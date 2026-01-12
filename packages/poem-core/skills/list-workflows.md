# List Workflows

A skill that displays all available workflows in the POEM workspace and indicates which one is currently active.

## When to Use

Invoke this skill when:
- User asks "What workflows are available?"
- User wants to see workflow options before switching
- User asks "Which workflow am I in?"
- User needs an overview of workspace configuration

## What It Does

This skill lists all configured workflows with their status:

1. **Reads Configuration**: Loads workflow definitions from `poem-core-config.yaml`
2. **Identifies Current**: Determines which workflow is currently active
3. **Displays Table**: Shows workflow name, description, and active indicator
4. **Handles Empty State**: Shows helpful message if no workflows configured

## How It Works

1. Read config service to get `currentWorkflow` and `workflows` map
2. If no workflows defined, display backward-compatibility message
3. For each workflow, extract name and config details
4. Format as markdown table with current workflow highlighted
5. Display total count of workflows

## Output Format

### With Workflows Configured

```
Available Workflows
===================

| Workflow                    | Description                          | Status   |
|-----------------------------|--------------------------------------|----------|
| youtube-launch-optimizer    | YouTube video publishing workflow    | ✓ ACTIVE |
| nano-banana                 | NanoBanana content planning          |          |
| video-planning              | General video planning workflow      |          |

Total: 3 workflows

Use `*switch <workflow-name>` to change active workflow.
Use `*context` to see details about current workflow.
```

### No Workflows Configured (Backward Compatibility)

```
Workspace Mode: Flat Structure
==============================

This workspace uses the traditional flat structure (single set of prompts/schemas).

To enable multi-workflow support:
1. Edit `packages/poem-core/poem-core-config.yaml`
2. Uncomment the `workspace.workflows` section
3. Define your workflows with paths and references

See Story 3.8 documentation for configuration examples.
```

## Example Usage

**User request**: "Show me the workflows" or "*workflows"

**Skill response**:
```
I'll show you all available workflows.

Available Workflows
===================

| Workflow                    | Description                          | Status   |
|-----------------------------|--------------------------------------|----------|
| youtube-launch-optimizer    | YouTube video publishing workflow    | ✓ ACTIVE |
| nano-banana                 | NanoBanana content planning          |          |

Total: 2 workflows

You're currently in 'youtube-launch-optimizer'.
Use `*switch <workflow-name>` to change workflows.
```

## Implementation Notes

- No API endpoint needed - agent reads config directly
- Config service provides `getCurrentWorkflow()` and `listWorkflows()` methods
- Agent formats output as markdown table
- Description field is optional in config (show "No description" if missing)
- Story 4.9 will add `*workflows --verbose` for extended details
