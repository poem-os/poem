#!/bin/bash
#
# POEM Installation Manager
# Manages POEM installations at target locations for testing and development
#
# Usage:
#   ./scripts/manage-installation.sh <command> <target-dir>
#
# Commands:
#   analyze <dir>   - Show what would be installed/preserved
#   clean <dir>     - Remove framework files, preserve user data
#   backup <dir>    - Backup user data to timestamped archive
#   validate <dir>  - Validate preservation rules
#   info <dir>      - Show installation information
#
# Examples:
#   ./scripts/manage-installation.sh analyze /path/to/target
#   ./scripts/manage-installation.sh clean /path/to/target
#   ./scripts/manage-installation.sh backup /path/to/target
#

set -e

# Colors for output
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
DIM='\033[2m'
BOLD='\033[1m'
RESET='\033[0m'

# ============================================================================
# Target Location Shortcuts
# ============================================================================

# Predefined target locations (edit these for your setup)
# Format: "shortcut:description:path" - one per line
TARGET_LOCATIONS="
ss:SupportSignal:$HOME/dev/clients/supportsignal/prompt.supportsignal.com.au
supportsignal:SupportSignal:$HOME/dev/clients/supportsignal/prompt.supportsignal.com.au
voz:vOz:$HOME/dev/video-projects/v-voz
ad:AppyDave:$HOME/dev/video-projects/v-appydave
appydave:AppyDave:$HOME/dev/video-projects/v-appydave
poem:POEM:$HOME/dev/ad/poem-os/poem
"

# Framework workflows (safe to overwrite)
declare -a FRAMEWORK_WORKFLOWS=(
  "create-prompt.yaml"
  "refine-prompt.yaml"
  "test-prompt.yaml"
  "validate-prompt.yaml"
  "deploy-prompt.yaml"
  "add-helper.yaml"
  "create-provider.yaml"
)

# ============================================================================
# Helper Functions
# ============================================================================

log() {
  echo -e "$1"
}

log_header() {
  echo ""
  echo -e "${CYAN}${BOLD}$1${RESET}"
  echo -e "${DIM}$(printf '%.0s─' {1..70})${RESET}"
}

log_success() {
  echo -e "  ${GREEN}✓${RESET} $1"
}

log_info() {
  echo -e "  ${CYAN}ℹ${RESET} $1"
}

log_warning() {
  echo -e "  ${YELLOW}⚠${RESET} $1"
}

log_error() {
  echo -e "  ${RED}✗${RESET} $1"
}

is_framework_workflow() {
  local filename="$1"
  for fw in "${FRAMEWORK_WORKFLOWS[@]}"; do
    if [[ "$filename" == "$fw" ]]; then
      return 0  # true
    fi
  done
  return 1  # false
}

resolve_target() {
  local input="$1"

  # Parse TARGET_LOCATIONS and look for matching shortcut
  while IFS=: read -r shortcut description path; do
    # Skip empty lines
    [[ -z "$shortcut" ]] && continue

    if [[ "$shortcut" == "$input" ]]; then
      echo "$path"
      return 0
    fi
  done <<< "$TARGET_LOCATIONS"

  # Not a shortcut, return as-is
  echo "$input"
}

list_targets() {
  log_header "📍 Available Target Shortcuts"

  echo ""
  log "${BOLD}Shortcuts → Full Paths:${RESET}"
  echo ""

  # Parse and display all targets
  local entries=()
  while IFS=: read -r shortcut description path; do
    # Skip empty lines
    [[ -z "$shortcut" ]] && continue

    # Store for display
    entries+=("$shortcut:$description:$path")
  done <<< "$TARGET_LOCATIONS"

  # Sort entries by shortcut name
  IFS=$'\n' sorted=($(sort <<<"${entries[*]}"))
  unset IFS

  for entry in "${sorted[@]}"; do
    IFS=: read -r shortcut description path <<< "$entry"

    local exists="${RED}✗${RESET}"
    [[ -d "$path" ]] && exists="${GREEN}✓${RESET}"

    echo -e "  ${CYAN}${shortcut}${RESET} → ${path} ${exists}"
  done

  echo ""
  log "${BOLD}Usage Examples:${RESET}"
  log_info "./scripts/manage-installation.sh analyze ss"
  log_info "./scripts/manage-installation.sh backup voz"
  log_info "./scripts/manage-installation.sh clean ad"
  log_info "./scripts/manage-installation.sh info supportsignal"

  echo ""
  log "${DIM}To edit shortcuts, modify TARGET_LOCATIONS at the top of this script${RESET}"
  echo ""
}

# ============================================================================
# Analysis Functions
# ============================================================================

analyze_installation() {
  local target_dir="$1"

  log_header "📊 Analyzing POEM Installation: $target_dir"

  # Check if POEM is installed
  local has_core=false
  local has_app=false
  local has_workspace=false
  local has_dev_workspace=false
  local has_preserve=false

  [[ -d "$target_dir/.poem-core" ]] && has_core=true
  [[ -d "$target_dir/.poem-app" ]] && has_app=true
  [[ -d "$target_dir/poem" ]] && has_workspace=true
  [[ -d "$target_dir/dev-workspace" ]] && has_dev_workspace=true
  [[ -f "$target_dir/.poem-preserve" ]] && has_preserve=true

  if [[ "$has_core" == false && "$has_app" == false ]]; then
    log_warning "No POEM installation found"
    return 1
  fi

  echo ""
  log "${BOLD}Installation Status:${RESET}"

  if [[ "$has_core" == true ]]; then
    log_success ".poem-core/ (framework documents)"
  else
    log_info ".poem-core/ ${DIM}(not installed)${RESET}"
  fi

  if [[ "$has_app" == true ]]; then
    log_success ".poem-app/ (runtime server)"
    # Check for .env
    if [[ -f "$target_dir/.poem-app/.env" ]]; then
      log_success "  .env configuration found"
    else
      log_warning "  .env configuration missing"
    fi
  else
    log_info ".poem-app/ ${DIM}(not installed)${RESET}"
  fi

  if [[ "$has_workspace" == true ]]; then
    log_success "poem/ (user workspace)"
    # Count files
    local prompt_count=$(find "$target_dir/poem/prompts" -type f -name "*.hbs" 2>/dev/null | wc -l | tr -d ' ')
    local schema_count=$(find "$target_dir/poem/schemas" -type f -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
    log_info "  $prompt_count prompts, $schema_count schemas"
  else
    log_info "poem/ ${DIM}(not created)${RESET}"
  fi

  if [[ "$has_dev_workspace" == true ]]; then
    log_success "dev-workspace/ (development workspace)"
  else
    log_info "dev-workspace/ ${DIM}(not created)${RESET}"
  fi

  if [[ "$has_preserve" == true ]]; then
    log_success ".poem-preserve (preservation rules)"
  else
    log_warning ".poem-preserve ${DIM}(missing - will be created)${RESET}"
  fi

  echo ""
  log "${BOLD}User Data (Will Be Preserved):${RESET}"

  # Check for user data
  local has_user_data=false

  if [[ -d "$target_dir/poem" ]]; then
    local total_files=$(find "$target_dir/poem" -type f 2>/dev/null | wc -l | tr -d ' ')
    if [[ "$total_files" -gt 0 ]]; then
      log_success "poem/ - $total_files files"
      has_user_data=true
    fi
  fi

  if [[ -d "$target_dir/dev-workspace" ]]; then
    local total_files=$(find "$target_dir/dev-workspace" -type f 2>/dev/null | wc -l | tr -d ' ')
    if [[ "$total_files" -gt 0 ]]; then
      log_success "dev-workspace/ - $total_files files"
      has_user_data=true
    fi
  fi

  if [[ -f "$target_dir/.poem-app/.env" ]]; then
    log_success ".poem-app/.env"
    has_user_data=true
  fi

  # Check for custom workflows
  if [[ -d "$target_dir/.poem-core/workflows" ]]; then
    local custom_count=0
    for workflow in "$target_dir/.poem-core/workflows"/*.yaml; do
      [[ ! -f "$workflow" ]] && continue
      local filename=$(basename "$workflow")
      if ! is_framework_workflow "$filename"; then
        ((custom_count++))
      fi
    done

    if [[ $custom_count -gt 0 ]]; then
      log_success ".poem-core/workflows/ - $custom_count custom workflows"
      has_user_data=true
    fi
  fi

  if [[ "$has_user_data" == false ]]; then
    log_info "No user data found ${DIM}(fresh installation)${RESET}"
  fi

  echo ""
  log "${BOLD}Framework Files (Can Be Removed):${RESET}"

  if [[ "$has_core" == true ]]; then
    local core_files=$(find "$target_dir/.poem-core" -type f 2>/dev/null | wc -l | tr -d ' ')
    log_info ".poem-core/ - $core_files files"
  fi

  if [[ "$has_app" == true ]]; then
    local app_files=$(find "$target_dir/.poem-app" -type f ! -name '.env' 2>/dev/null | wc -l | tr -d ' ')
    log_info ".poem-app/ - $app_files files (excluding .env)"
  fi

  if [[ -d "$target_dir/.claude/commands/poem" ]]; then
    local command_files=$(find "$target_dir/.claude/commands/poem" -type f 2>/dev/null | wc -l | tr -d ' ')
    log_info ".claude/commands/poem/ - $command_files files"
  fi

  echo ""
}

# ============================================================================
# Clean Installation
# ============================================================================

clean_installation() {
  local target_dir="$1"
  local dry_run="$2"

  log_header "🧹 Cleaning POEM Installation: $target_dir"

  # Verify POEM is installed
  if [[ ! -d "$target_dir/.poem-core" && ! -d "$target_dir/.poem-app" ]]; then
    log_error "No POEM installation found at $target_dir"
    return 1
  fi

  echo ""
  log "${BOLD}This will remove:${RESET}"
  log_info ".poem-core/ (framework documents)"
  log_info ".poem-app/ (except .env configuration)"
  log_info ".claude/commands/poem/ (slash commands)"

  echo ""
  log "${BOLD}This will preserve:${RESET}"
  log_success "poem/ (user workspace)"
  log_success "dev-workspace/ (development workspace)"
  log_success ".poem-app/.env (port and POEM_DEV config)"
  log_success ".poem-preserve (preservation rules)"

  # Count and show custom workflows
  local custom_count=0
  if [[ -d "$target_dir/.poem-core/workflows" ]]; then
    for workflow in "$target_dir/.poem-core/workflows"/*.yaml; do
      [[ ! -f "$workflow" ]] && continue
      local filename=$(basename "$workflow")
      if ! is_framework_workflow "$filename"; then
        ((custom_count++))
      fi
    done
    if [[ $custom_count -gt 0 ]]; then
      log_success "Custom workflows ($custom_count files in .poem-core/workflows/)"
    fi
  fi

  # Dry run mode - exit here
  if [[ "$dry_run" == "true" ]]; then
    echo ""
    log_info "${DIM}Dry run mode - no changes made${RESET}"
    log_info "Run without --dry-run to actually remove files"
    echo ""
    return 0
  fi

  echo ""
  read -p "Continue? [y/N]: " -n 1 -r
  echo ""

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Cancelled"
    return 1
  fi

  echo ""

  # Backup .env before removing .poem-app
  local env_backup=""
  if [[ -f "$target_dir/.poem-app/.env" ]]; then
    env_backup=$(mktemp)
    cp "$target_dir/.poem-app/.env" "$env_backup"
    log_success "Backed up .env to temp file"
  fi

  # Backup custom workflows
  local workflows_backup=""
  if [[ -d "$target_dir/.poem-core/workflows" ]]; then
    workflows_backup=$(mktemp -d)
    for workflow in "$target_dir/.poem-core/workflows"/*.yaml; do
      [[ ! -f "$workflow" ]] && continue
      local filename=$(basename "$workflow")
      if ! is_framework_workflow "$filename"; then
        cp "$workflow" "$workflows_backup/"
        log_success "Backed up custom workflow: $filename"
      fi
    done
  fi

  # Remove framework files
  if [[ -d "$target_dir/.poem-core" ]]; then
    rm -rf "$target_dir/.poem-core"
    log_success "Removed .poem-core/"
  fi

  if [[ -d "$target_dir/.poem-app" ]]; then
    rm -rf "$target_dir/.poem-app"
    log_success "Removed .poem-app/"
  fi

  if [[ -d "$target_dir/.claude/commands/poem" ]]; then
    rm -rf "$target_dir/.claude/commands/poem"
    log_success "Removed .claude/commands/poem/"

    # Remove .claude/commands if empty
    if [[ -d "$target_dir/.claude/commands" ]] && [[ -z "$(ls -A "$target_dir/.claude/commands")" ]]; then
      rmdir "$target_dir/.claude/commands"
      log_success "Removed empty .claude/commands/"
    fi

    # Remove .claude if empty
    if [[ -d "$target_dir/.claude" ]] && [[ -z "$(ls -A "$target_dir/.claude")" ]]; then
      rmdir "$target_dir/.claude"
      log_success "Removed empty .claude/"
    fi
  fi

  # Restore .env if it existed
  if [[ -n "$env_backup" && -f "$env_backup" ]]; then
    mkdir -p "$target_dir/.poem-app"
    cp "$env_backup" "$target_dir/.poem-app/.env"
    rm "$env_backup"
    log_success "Restored .env configuration"
  fi

  # Restore custom workflows
  if [[ -n "$workflows_backup" && -d "$workflows_backup" ]]; then
    local workflow_count=$(find "$workflows_backup" -type f -name "*.yaml" 2>/dev/null | wc -l | tr -d ' ')
    if [[ $workflow_count -gt 0 ]]; then
      mkdir -p "$target_dir/.poem-core/workflows"
      cp "$workflows_backup"/*.yaml "$target_dir/.poem-core/workflows/" 2>/dev/null || true
      log_success "Restored $workflow_count custom workflows"
    fi
    rm -rf "$workflows_backup"
  fi

  echo ""
  log_success "Clean complete! User data preserved."
  echo ""
  log_info "To reinstall POEM:"
  log_info "  cd $target_dir"
  log_info "  npx poem-os install"
  echo ""
}

# ============================================================================
# Backup User Data
# ============================================================================

backup_installation() {
  local target_dir="$1"
  local timestamp=$(date +%Y%m%d-%H%M%S)
  local backup_name="poem-backup-$timestamp"
  local backup_dir="$target_dir/$backup_name"

  log_header "💾 Backing Up POEM User Data: $target_dir"

  # Create backup directory
  mkdir -p "$backup_dir"

  echo ""
  local backed_up=false

  # Backup poem/ workspace
  if [[ -d "$target_dir/poem" ]]; then
    cp -r "$target_dir/poem" "$backup_dir/"
    log_success "Backed up poem/"
    backed_up=true
  fi

  # Backup dev-workspace/
  if [[ -d "$target_dir/dev-workspace" ]]; then
    cp -r "$target_dir/dev-workspace" "$backup_dir/"
    log_success "Backed up dev-workspace/"
    backed_up=true
  fi

  # Backup .env
  if [[ -f "$target_dir/.poem-app/.env" ]]; then
    mkdir -p "$backup_dir/.poem-app"
    cp "$target_dir/.poem-app/.env" "$backup_dir/.poem-app/"
    log_success "Backed up .poem-app/.env"
    backed_up=true
  fi

  # Backup .poem-preserve
  if [[ -f "$target_dir/.poem-preserve" ]]; then
    cp "$target_dir/.poem-preserve" "$backup_dir/"
    log_success "Backed up .poem-preserve"
    backed_up=true
  fi

  # Backup custom workflows
  if [[ -d "$target_dir/.poem-core/workflows" ]]; then
    local custom_count=0
    for workflow in "$target_dir/.poem-core/workflows"/*.yaml; do
      [[ ! -f "$workflow" ]] && continue
      local filename=$(basename "$workflow")
      if ! is_framework_workflow "$filename"; then
        mkdir -p "$backup_dir/.poem-core/workflows"
        cp "$workflow" "$backup_dir/.poem-core/workflows/"
        ((custom_count++))
      fi
    done

    if [[ $custom_count -gt 0 ]]; then
      log_success "Backed up $custom_count custom workflows"
      backed_up=true
    fi
  fi

  if [[ "$backed_up" == false ]]; then
    log_warning "No user data found to backup"
    rmdir "$backup_dir" 2>/dev/null || true
    return 1
  fi

  # Create archive
  local archive_name="$backup_name.tar.gz"
  tar -czf "$target_dir/$archive_name" -C "$target_dir" "$backup_name"
  rm -rf "$backup_dir"

  echo ""
  log_success "Backup complete!"
  log_info "Archive: $archive_name"
  log_info "Size: $(du -h "$target_dir/$archive_name" | cut -f1)"
  echo ""
}

# ============================================================================
# Validate Preservation
# ============================================================================

validate_preservation() {
  local target_dir="$1"

  log_header "✅ Validating Preservation Rules: $target_dir"

  echo ""
  local preserve_file="$target_dir/.poem-preserve"

  if [[ ! -f "$preserve_file" ]]; then
    log_warning ".poem-preserve not found"
    log_info "File will be created during installation"
    return 0
  fi

  log_success ".poem-preserve exists"

  # Read and validate rules
  local rules=()
  while IFS= read -r line; do
    # Skip empty lines and comments
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    rules+=("$line")
  done < "$preserve_file"

  echo ""
  log "${BOLD}Preservation Rules (${#rules[@]}):${RESET}"

  for rule in "${rules[@]}"; do
    local target="$target_dir/$rule"

    if [[ "$rule" == */ ]]; then
      # Directory rule
      if [[ -d "${target%/}" ]]; then
        log_success "$rule ${DIM}(exists)${RESET}"
      else
        log_info "$rule ${DIM}(will be preserved when created)${RESET}"
      fi
    else
      # File rule
      if [[ -f "$target" ]]; then
        log_success "$rule ${DIM}(exists)${RESET}"
      else
        log_info "$rule ${DIM}(will be preserved when created)${RESET}"
      fi
    fi
  done

  echo ""
  log "${BOLD}Required Rules:${RESET}"

  local required=("poem/" "dev-workspace/" ".poem-app/.env")
  local missing=()

  for req in "${required[@]}"; do
    local found=false
    for rule in "${rules[@]}"; do
      if [[ "$rule" == "$req" ]]; then
        found=true
        break
      fi
    done

    if [[ "$found" == true ]]; then
      log_success "$req"
    else
      log_warning "$req ${DIM}(missing - will be added during installation)${RESET}"
      missing+=("$req")
    fi
  done

  if [[ ${#missing[@]} -gt 0 ]]; then
    echo ""
    log_info "Run 'npx poem-os install' to auto-migrate preservation rules"
  fi

  echo ""
}

# ============================================================================
# Show Installation Info
# ============================================================================

show_info() {
  local target_dir="$1"

  log_header "ℹ️  POEM Installation Info: $target_dir"

  echo ""
  log "${BOLD}Directory:${RESET} $target_dir"

  # Check installation status
  if [[ ! -d "$target_dir/.poem-core" && ! -d "$target_dir/.poem-app" ]]; then
    echo ""
    log_warning "POEM is not installed at this location"
    return 0
  fi

  echo ""
  log "${BOLD}Installed Components:${RESET}"

  if [[ -d "$target_dir/.poem-core" ]]; then
    log_success ".poem-core/ (framework)"
  fi

  if [[ -d "$target_dir/.poem-app" ]]; then
    log_success ".poem-app/ (runtime)"

    # Check for .env and read configuration
    if [[ -f "$target_dir/.poem-app/.env" ]]; then
      local port=$(grep "^PORT=" "$target_dir/.poem-app/.env" 2>/dev/null | cut -d'=' -f2)
      local dev_mode=$(grep "^POEM_DEV=" "$target_dir/.poem-app/.env" 2>/dev/null | cut -d'=' -f2)

      echo ""
      log "${BOLD}Configuration:${RESET}"
      [[ -n "$port" ]] && log_info "Port: $port"
      [[ -n "$dev_mode" ]] && log_info "Dev Mode: $dev_mode"
    fi
  fi

  if [[ -d "$target_dir/.claude/commands/poem" ]]; then
    log_success ".claude/commands/poem/ (slash commands)"
  fi

  # User workspace info
  if [[ -d "$target_dir/poem" ]]; then
    echo ""
    log "${BOLD}User Workspace (poem/):${RESET}"

    local prompt_count=$(find "$target_dir/poem/prompts" -type f -name "*.hbs" 2>/dev/null | wc -l | tr -d ' ')
    local schema_count=$(find "$target_dir/poem/schemas" -type f -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
    local workflow_count=$(find "$target_dir/poem/workflow-data" -type f 2>/dev/null | wc -l | tr -d ' ')

    log_info "Prompts: $prompt_count"
    log_info "Schemas: $schema_count"
    log_info "Workflow data: $workflow_count files"
  fi

  # Dev workspace info
  if [[ -d "$target_dir/dev-workspace" ]]; then
    echo ""
    log "${BOLD}Dev Workspace (dev-workspace/):${RESET}"

    local prompt_count=$(find "$target_dir/dev-workspace/prompts" -type f -name "*.hbs" 2>/dev/null | wc -l | tr -d ' ')
    local schema_count=$(find "$target_dir/dev-workspace/schemas" -type f -name "*.json" 2>/dev/null | wc -l | tr -d ' ')

    log_info "Prompts: $prompt_count"
    log_info "Schemas: $schema_count"
  fi

  # Custom workflows
  if [[ -d "$target_dir/.poem-core/workflows" ]]; then
    local custom_count=0
    for workflow in "$target_dir/.poem-core/workflows"/*.yaml; do
      [[ ! -f "$workflow" ]] && continue
      local filename=$(basename "$workflow")
      if ! is_framework_workflow "$filename"; then
        ((custom_count++))
      fi
    done

    if [[ $custom_count -gt 0 ]]; then
      echo ""
      log "${BOLD}Custom Workflows:${RESET}"
      log_info "$custom_count custom workflows in .poem-core/workflows/"
    fi
  fi

  # Preservation file
  if [[ -f "$target_dir/.poem-preserve" ]]; then
    echo ""
    log "${BOLD}Preservation Rules:${RESET}"
    local rule_count=$(grep -v "^#" "$target_dir/.poem-preserve" | grep -v "^$" | wc -l | tr -d ' ')
    log_info "$rule_count rules in .poem-preserve"
  fi

  echo ""
}

# ============================================================================
# Usage and Main
# ============================================================================

show_usage() {
  cat << EOF

POEM Installation Manager
Manages POEM installations at target locations for testing and development

${BOLD}Usage:${RESET}
  ./scripts/manage-installation.sh <command> <target>

${BOLD}Commands:${RESET}
  targets           - List all available target shortcuts
  analyze <dir>     - Show what would be installed/preserved
  clean <dir>       - Remove framework files, preserve user data
  backup <dir>      - Backup user data to timestamped archive
  validate <dir>    - Validate preservation rules
  info <dir>        - Show installation information

${BOLD}Flags:${RESET}
  --dry-run, -n     - Preview what clean would do (use with clean command)

${BOLD}Target Shortcuts:${RESET}
  ss, supportsignal   → SupportSignal prompt system
  voz                 → vOz video project
  ad, appydave        → AppyDave video project
  poem                → POEM development workspace

  ${DIM}Run './scripts/manage-installation.sh targets' for full list${RESET}

${BOLD}Examples with Shortcuts:${RESET}
  ${DIM}# Analyze installation using shortcut${RESET}
  ./scripts/manage-installation.sh analyze ss

  ${DIM}# Preview what clean would do (dry run)${RESET}
  ./scripts/manage-installation.sh clean ss --dry-run

  ${DIM}# Backup before testing${RESET}
  ./scripts/manage-installation.sh backup voz

  ${DIM}# Clean installation for fresh reinstall${RESET}
  ./scripts/manage-installation.sh clean ad

  ${DIM}# Show installation info${RESET}
  ./scripts/manage-installation.sh info supportsignal

${BOLD}Examples with Full Paths:${RESET}
  ${DIM}# You can still use full paths${RESET}
  ./scripts/manage-installation.sh analyze ~/dev/clients/supportsignal/prompt.supportsignal.com.au
  ./scripts/manage-installation.sh backup ~/dev/video-projects/v-voz

${BOLD}What Gets Preserved:${RESET}
  ✓ poem/ (user workspace - prompts, schemas, mock-data, workflow-data, config)
  ✓ dev-workspace/ (development workspace)
  ✓ .poem-app/.env (port and POEM_DEV configuration)
  ✓ .poem-preserve (preservation rules)
  ✓ Custom workflows in .poem-core/workflows/

${BOLD}What Gets Removed (on clean):${RESET}
  ✗ .poem-core/ (framework documents)
  ✗ .poem-app/ (runtime server, except .env)
  ✗ .claude/commands/poem/ (slash commands)
  ✗ node_modules/ (dependencies)

${BOLD}Typical Testing Workflow:${RESET}
  1. backup <dir>    - Create backup of user data
  2. clean <dir>     - Remove framework files
  3. npx poem-os install  - Reinstall POEM
  4. Test changes
  5. (restore from backup if needed)

EOF
}

# Main execution
main() {
  local command="$1"
  shift  # Remove command from args

  # Parse flags
  local dry_run=false
  local target_input=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dry-run|-n)
        dry_run=true
        shift
        ;;
      *)
        # This is the target
        target_input="$1"
        shift
        ;;
    esac
  done

  # Show usage if no command or help requested
  if [[ -z "$command" || "$command" == "help" || "$command" == "--help" || "$command" == "-h" ]]; then
    show_usage
    exit 0
  fi

  # Handle targets command (no target directory needed)
  if [[ "$command" == "targets" || "$command" == "list" ]]; then
    list_targets
    exit 0
  fi

  # Validate target directory is provided
  if [[ -z "$target_input" ]]; then
    log_error "Target directory or shortcut is required"
    echo ""
    show_usage
    exit 1
  fi

  # Resolve shortcut to full path
  local target_dir=$(resolve_target "$target_input")

  # Expand ~ to home directory
  target_dir="${target_dir/#\~/$HOME}"

  # Convert to absolute path if needed
  if [[ "$target_dir" != /* ]]; then
    target_dir="$(pwd)/$target_dir"
  fi

  # Check target directory exists (except for analyze which can show what would happen)
  if [[ ! -d "$target_dir" && "$command" != "analyze" ]]; then
    log_error "Target directory does not exist: $target_dir"

    # Show helpful message if it was a shortcut
    if [[ "$target_dir" != "$target_input" ]]; then
      log_info "Shortcut '$target_input' resolves to: $target_dir"
      log_info "Run './scripts/manage-installation.sh targets' to see all shortcuts"
    fi

    exit 1
  fi

  # Route to command handler
  case "$command" in
    analyze)
      analyze_installation "$target_dir"
      ;;
    clean)
      if [[ "$dry_run" == true ]]; then
        clean_installation "$target_dir" "true"
      else
        clean_installation "$target_dir" "false"
      fi
      ;;
    backup)
      backup_installation "$target_dir"
      ;;
    validate)
      validate_preservation "$target_dir"
      ;;
    info)
      show_info "$target_dir"
      ;;
    *)
      log_error "Unknown command: $command"
      echo ""
      show_usage
      exit 1
      ;;
  esac
}

# Run main
main "$@"
