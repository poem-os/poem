# Switch Workflow

A skill that changes the active workflow context without requiring server restart or agent reload.

## When to Use

Invoke this skill when:
- User wants to work with a different workflow
- User asks "Can I switch to <workflow-name>?"
- User needs to create prompts in a different workflow context
- User wants to test workflow isolation

## What It Does

This skill switches the active workflow context:

1. **Validates Workflow**: Confirms requested workflow exists in configuration
2. **Updates Context**: Calls config service to set new current workflow
3. **Persists State**: Saves workflow selection to disk for session persistence
4. **Confirms Switch**: Displays success message with new workflow details
5. **Hot-Switch**: No server restart or agent reload required

## How It Works

1. Parse workflow name from command parameter
2. Read config service to get available workflows
3. Validate workflow exists in `workflows` map
4. Call `setCurrentWorkflow(name)` method
5. Workflow state persisted to `dev-workspace/.poem-state.json`
6. Display success confirmation with new context paths
7. If validation fails, show error and list available workflows

## Command Usage

```
*switch <workflow-name>
```

**Examples**:
- `*switch youtube-launch-optimizer`
- `*switch nano-banana`
- `*switch video-planning`

## Output Format

### Successful Switch

```
Workflow switched successfully!
================================

Previous: youtube-launch-optimizer
Current:  nano-banana

Workflow Details:
- Prompts:   dev-workspace/workflows/nano-banana/prompts
- Schemas:   dev-workspace/workflows/nano-banana/schemas
- Mock Data: dev-workspace/workflows/nano-banana/mock-data

Reference Paths:
- data/nano-banana/reference/ (local, priority: 10)
- /ad/brains/nano-banana/ (second-brain, priority: 20)

Use `*list` to see prompts in this workflow.
Use `*context` to view full workflow details.
```

### Invalid Workflow Name

```
Error: Workflow 'invalid-name' not found.
=========================================

Available workflows:
1. youtube-launch-optimizer - YouTube video publishing workflow
2. nano-banana - NanoBanana content planning
3. video-planning - General video planning workflow

Usage: *switch <workflow-name>
Example: *switch youtube-launch-optimizer
```

### Missing Parameter

```
Error: Workflow name required.
==============================

Usage: *switch <workflow-name>

Use `*workflows` to see available workflows.
```

## Example Usage

**User request**: "Switch to nano-banana" or "*switch nano-banana"

**Skill response**:
```
I'll switch to the nano-banana workflow.

Workflow switched successfully!
================================

Previous: youtube-launch-optimizer
Current:  nano-banana

Workflow Details:
- Prompts:   dev-workspace/workflows/nano-banana/prompts
- Schemas:   dev-workspace/workflows/nano-banana/schemas
- Mock Data: dev-workspace/workflows/nano-banana/mock-data

You're now working in the nano-banana workflow context.
Any prompts you create with `*new` will be saved here.
Use `*list` to see prompts in this workflow.
```

## Implementation Notes

- Config service provides `setCurrentWorkflow(name)` method
- Method includes validation and throws error if workflow doesn't exist
- Persistence handled by workflow-persistence.ts service layer
- State file: `dev-workspace/.poem-state.json`
- Agent catches validation errors and displays helpful messages
- No API endpoint needed - agent calls config service directly
- Switch is instantaneous (no reload required per AC 11)
- Story 4.9 will add workflow validation and advanced features
