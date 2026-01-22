#!/bin/bash
# BMAD Workflow Audit Trail Logger
# Format: YAML front matter + JSONL body (Option D)
# Zero context impact - pure command hooks

set -e

# Read JSON input from stdin
INPUT=$(cat)

# Extract common fields
HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // "unknown"')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Log directory (transient development artifacts)
LOG_DIR="/Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/workflow-logs"

# Try to detect current story from recent file operations or session
# Look for story files in the session's working directory
detect_story_number() {
  # Check if there's a story file mentioned in tool_input
  local file_path=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')
  if [[ "$file_path" == *"docs/stories"* ]]; then
    echo "$file_path" | grep -oE '[0-9]+\.[0-9]+' | head -1
    return
  fi

  # Check for most recently modified story file
  local latest=$(ls -t "$CWD/docs/stories/"*.story.md 2>/dev/null | head -1 || true)
  if [[ -n "$latest" ]]; then
    echo "$latest" | grep -oE '[0-9]+\.[0-9]+' | head -1
    return
  fi

  echo "unknown"
}

# Get or create log file for current session
get_log_file() {
  local story_num=$(detect_story_number)
  local log_file="${LOG_DIR}/${story_num}-workflow.log"

  # Create with YAML front matter if new
  if [[ ! -f "$log_file" ]]; then
    cat > "$log_file" << EOF
---
schema: "1.0"
story: "${story_num}"
session_id: "${SESSION_ID}"
started: "${TIMESTAMP}"
description: "BMAD Workflow Audit Trail"
---
EOF
  fi

  echo "$log_file"
}

# Determine event type and tag based on hook and context
get_event_type_and_tag() {
  local event_type=""
  local tag=""

  case "$HOOK_EVENT" in
    "UserPromptSubmit")
      event_type="human_decision"
      local prompt=$(echo "$INPUT" | jq -r '.prompt // ""' | tr -d '\n' | cut -c1-100)

      # Detect specific workflow commands
      if [[ "$prompt" == *"/appydave-workflow"* ]]; then
        tag="workflow_start"
      elif [[ "$prompt" =~ ^[0-9]+\.[0-9]+$ ]]; then
        tag="story_select"
      elif [[ "$prompt" == "go" ]]; then
        tag="gate_approve"
      elif [[ "$prompt" == "skip" ]]; then
        tag="gate_skip"
      elif [[ "$prompt" == "exit" ]]; then
        tag="workflow_exit"
      elif [[ "$prompt" == "verify" ]]; then
        tag="status_verify"
      elif [[ "$prompt" == "next" ]]; then
        tag="next_story"
      elif [[ "$prompt" == "dev" ]]; then
        tag="return_to_dev"
      else
        tag="user_input"
      fi
      ;;

    "PostToolUse")
      local tool_name=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
      local file_path=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

      case "$tool_name" in
        "Write"|"Edit")
          event_type="file_change"
          if [[ "$file_path" == *".story.md" ]] && [[ "$file_path" != *"-SAT.md" ]]; then
            tag="story_update"
          elif [[ "$file_path" == *"-SAT.md" ]]; then
            tag="sat_created"
          elif [[ "$file_path" == *"docs/qa"* ]]; then
            tag="qa_artifact"
          elif [[ "$file_path" == *"docs/kdd"* ]]; then
            tag="knowledge_capture"
          elif [[ "$file_path" == *"/src/"* ]]; then
            tag="code_change"
          elif [[ "$file_path" == *"/tests/"* ]] || [[ "$file_path" == *".test."* ]]; then
            tag="test_change"
          else
            tag="file_update"
          fi
          ;;
        "Bash")
          event_type="command_run"
          local command=$(echo "$INPUT" | jq -r '.tool_input.command // ""' | cut -c1-50)
          if [[ "$command" == *"npm test"* ]] || [[ "$command" == *"vitest"* ]]; then
            tag="test_run"
          elif [[ "$command" == *"npm run"* ]]; then
            tag="npm_script"
          elif [[ "$command" == *"git"* ]]; then
            tag="git_operation"
          elif [[ "$command" == *"tsc"* ]]; then
            tag="type_check"
          else
            tag="shell_command"
          fi
          ;;
        "Skill")
          event_type="agent_load"
          local skill=$(echo "$INPUT" | jq -r '.tool_input.skill // ""')
          if [[ "$skill" == *"agents:sm"* ]]; then
            tag="agent_sm"
          elif [[ "$skill" == *"agents:po"* ]]; then
            tag="agent_po"
          elif [[ "$skill" == *"agents:dev"* ]]; then
            tag="agent_dev"
          elif [[ "$skill" == *"agents:qa"* ]]; then
            tag="agent_qa"
          elif [[ "$skill" == *"agents:sat"* ]]; then
            tag="agent_sat"
          elif [[ "$skill" == *"tasks:"* ]]; then
            tag="task_execute"
          else
            tag="skill_invoke"
          fi
          ;;
        *)
          event_type="tool_use"
          tag="other"
          ;;
      esac
      ;;

    "Stop")
      event_type="workflow_gate"
      tag="session_stop"
      ;;

    *)
      event_type="unknown"
      tag="unknown"
      ;;
  esac

  echo "${event_type}|${tag}"
}

# Build the JSONL event entry
build_event_json() {
  local type_tag=$(get_event_type_and_tag)
  local event_type=$(echo "$type_tag" | cut -d'|' -f1)
  local tag=$(echo "$type_tag" | cut -d'|' -f2)

  # Build data payload based on event type
  local data="{}"

  case "$HOOK_EVENT" in
    "UserPromptSubmit")
      local prompt=$(echo "$INPUT" | jq -r '.prompt // ""' | tr -d '\n' | cut -c1-200)
      data=$(jq -n --arg p "$prompt" '{"prompt": $p}')
      ;;
    "PostToolUse")
      local tool_name=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
      local file_path=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')
      local command=$(echo "$INPUT" | jq -r '.tool_input.command // ""' | cut -c1-100)
      local skill=$(echo "$INPUT" | jq -r '.tool_input.skill // ""')

      if [[ "$tool_name" == "Write" ]] || [[ "$tool_name" == "Edit" ]]; then
        data=$(jq -n --arg t "$tool_name" --arg f "$file_path" '{"tool": $t, "file": $f}')
      elif [[ "$tool_name" == "Bash" ]]; then
        data=$(jq -n --arg t "$tool_name" --arg c "$command" '{"tool": $t, "command": $c}')
      elif [[ "$tool_name" == "Skill" ]]; then
        data=$(jq -n --arg t "$tool_name" --arg s "$skill" '{"tool": $t, "skill": $s}')
      else
        data=$(jq -n --arg t "$tool_name" '{"tool": $t}')
      fi
      ;;
    "Stop")
      data='{"reason": "agent_stop"}'
      ;;
  esac

  # Build complete JSON event
  jq -n \
    --arg type "$event_type" \
    --arg tag "$tag" \
    --arg ts "$TIMESTAMP" \
    --argjson data "$data" \
    '{"type": $type, "tag": $tag, "ts": $ts, "data": $data}'
}

# Main execution
main() {
  # Skip logging for workflow-logs directory to prevent recursion
  local file_path=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')
  if [[ "$file_path" == *"workflow-logs"* ]]; then
    exit 0
  fi

  local log_file=$(get_log_file)
  local event_json=$(build_event_json)

  # Append JSONL entry to log file
  echo "$event_json" >> "$log_file"
}

main
