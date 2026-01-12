# Show Workflow Context

A skill that displays detailed information about the current workflow context, including workspace paths and reference materials.

## When to Use

Invoke this skill when:
- User asks "What workflow am I in?"
- User wants to know current workspace paths
- User needs to see available reference materials
- User is debugging workflow configuration
- User wants to verify workflow switch was successful

## What It Does

This skill displays comprehensive workflow context:

1. **Current Workflow**: Shows active workflow name and details
2. **Workspace Paths**: Lists prompts, schemas, and mock-data directories
3. **Reference Materials**: Displays configured reference paths with types and priorities
4. **Fallback Mode**: Shows flat workspace info if no workflow active

## How It Works

1. Call config service `getCurrentWorkflow()` to get active workflow
2. If workflow exists:
   - Get workflow config details
   - Read workspace paths from `getWorkflowPath()` methods
   - Read reference paths from `getReferencePaths()`
   - Format and display all context information
3. If no workflow (backward compatibility):
   - Display flat workspace structure
   - Show traditional paths
   - Explain flat mode

## Command Usage

```
*context
```

**Future enhancements** (Story 4.9):
- `*context --reference` - Show only reference paths
- `*context --sections` - Show workflow sections/phases
- `*context --shared` - Show shared resources

## Output Format

### With Active Workflow

```
Current Workflow Context
========================

Workflow: youtube-launch-optimizer
Description: YouTube video publishing workflow
Version: Not defined (Phase 1 - workflow definition files in Story 4.9)

Workspace Paths
---------------
Prompts:   dev-workspace/workflows/youtube-launch-optimizer/prompts
Schemas:   dev-workspace/workflows/youtube-launch-optimizer/schemas
Mock Data: dev-workspace/workflows/youtube-launch-optimizer/mock-data

Reference Materials
-------------------
| Path                               | Type          | Priority | Description                          |
|------------------------------------|---------------|----------|--------------------------------------|
| data/youtube-launch-optimizer/     | local         | 10       | Local reference materials            |
| /ad/brains/youtube/                | second-brain  | 20       | Curated YouTube knowledge base       |

Workflow Operations
-------------------
- `*list` - List prompts in this workflow
- `*new` - Create prompt in this workflow
- `*switch <name>` - Switch to different workflow
- `*workflows` - List all available workflows

Note: Reference paths are configured but not yet integrated (Story 4.9).
Priority system will be implemented in Story 4.9.
```

### No Active Workflow (Flat Mode)

```
Current Workspace Context
=========================

Mode: Flat Structure (Backward Compatibility)
No workflow selected.

Workspace Paths
---------------
Prompts:   dev-workspace/prompts
Schemas:   dev-workspace/schemas
Mock Data: dev-workspace/mock-data
Config:    dev-workspace/config
Workflow Data: dev-workspace/workflow-data

Multi-Workflow Support
----------------------
To use workflows:
1. Edit `packages/poem-core/poem-core-config.yaml`
2. Uncomment the `workspace.workflows` section
3. Define workflows with paths and references
4. Use `*switch <workflow-name>` to activate

See Story 3.8 documentation for examples.
```

### No Reference Paths Configured

```
Current Workflow Context
========================

Workflow: nano-banana
Description: NanoBanana content planning

Workspace Paths
---------------
Prompts:   dev-workspace/workflows/nano-banana/prompts
Schemas:   dev-workspace/workflows/nano-banana/schemas
Mock Data: dev-workspace/workflows/nano-banana/mock-data

Reference Materials
-------------------
No reference paths configured for this workflow.

To add references, edit `packages/poem-core/poem-core-config.yaml`:
```yaml
workflows:
  nano-banana:
    reference:
      - path: data/nano-banana/reference/
        type: local
        description: Local reference materials
        priority: 10
```
```

## Example Usage

**User request**: "Show me my current context" or "*context"

**Skill response**:
```
I'll show you the current workflow context.

Current Workflow Context
========================

Workflow: youtube-launch-optimizer
Description: YouTube video publishing workflow

Workspace Paths
---------------
Prompts:   dev-workspace/workflows/youtube-launch-optimizer/prompts
Schemas:   dev-workspace/workflows/youtube-launch-optimizer/schemas
Mock Data: dev-workspace/workflows/youtube-launch-optimizer/mock-data

Reference Materials
-------------------
| Path                               | Type          | Priority |
|------------------------------------|---------------|----------|
| data/youtube-launch-optimizer/     | local         | 10       |
| /ad/brains/youtube/                | second-brain  | 20       |

You're working in the youtube-launch-optimizer workflow.
Use `*list` to see prompts in this workflow.
```

## Implementation Notes

- Config service provides `getCurrentWorkflow()` method
- Config service provides `getWorkflowPath(resourceType)` method
- Config service provides `getReferencePaths()` method
- No API endpoint needed - agent reads config directly
- Display is read-only (no mutations)
- Reference path integration (using paths for context loading) deferred to Story 4.9
- Workflow sections/phases deferred to Story 4.9
- Story 4.9 will add command-line flags for filtered views
