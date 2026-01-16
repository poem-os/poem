# Example: Multi-Workflow Setup

**Feature**: Story 3.8 - Multi-Workflow Foundation
**Pattern**: [Workflow-Scoped Resource Management](../../kdd/patterns/workflow-scoped-resource-management.md)
**ADR**: [ADR-002: Multi-Workflow Architecture](../../kdd/decisions/adr-002-multi-workflow-architecture.md)

## Purpose

Demonstrates setting up multiple independent workflows (YouTube, NanoBanana, SupportSignal) in a single POEM workspace with hot-switchable context.

## Setup

### 1. Create Workflow Directories

```bash
mkdir -p dev-workspace/workflows/{youtube-launch-optimizer,nano-banana,support-signal}/{prompts,schemas,mock-data}
```

### 2. Configure Workflows

Edit `packages/poem-core/poem-core-config.yaml`:

```yaml
workspace:
  currentWorkflow: youtube-launch-optimizer

  workflows:
    youtube-launch-optimizer:
      prompts: dev-workspace/workflows/youtube-launch-optimizer/prompts
      schemas: dev-workspace/workflows/youtube-launch-optimizer/schemas
      mockData: dev-workspace/workflows/youtube-launch-optimizer/mock-data
      reference:
        - path: data/youtube-launch-optimizer/
          type: local
          priority: 10

    nano-banana:
      prompts: dev-workspace/workflows/nano-banana/prompts
      schemas: dev-workspace/workflows/nano-banana/schemas
      mockData: dev-workspace/workflows/nano-banana/mock-data
      reference:
        - path: data/nano-banana/reference/
          type: local
          priority: 10
```

## Usage

### Via Penny Agent

```bash
# Activate Penny
/poem/agents/penny

# List workflows
*workflows

# Switch to NanoBanana
*switch nano-banana

# Check context
*context

# List prompts (only NanoBanana prompts shown)
*list

# Create prompt (saved in nano-banana directory)
*new
```

### Workflow Isolation Test

```bash
# Switch to YouTube
*switch youtube-launch-optimizer
*new  # Create: generate-titles.hbs

# Switch to NanoBanana
*switch nano-banana
*list  # generate-titles.hbs NOT visible (isolation verified)

# Switch back to YouTube
*switch youtube-launch-optimizer
*list  # generate-titles.hbs visible again
```

### Persistence Test

```bash
# Set workflow
*switch nano-banana

# Exit agent
*exit

# Reactivate agent (new session)
/poem/agents/penny
*context  # Shows: nano-banana (persisted!)
```

## Key Files

**State Persistence**: `dev-workspace/.poem-state.json`
```json
{
  "currentWorkflow": "nano-banana"
}
```

**Config Service**: `packages/poem-app/src/services/config/poem-config.ts`
- `getCurrentWorkflow()` - Returns active workflow
- `getWorkflowPath('prompts')` - Resolves workflow-scoped path
- `setCurrentWorkflow(name)` - Hot-switch with persistence

## Related Patterns

- [Config Service Single Source of Truth](../../kdd/patterns/config-service-single-source-of-truth.md)
- [Workflow-Scoped Resource Management](../../kdd/patterns/workflow-scoped-resource-management.md)

## References

- **Story**: `docs/stories/3.8.story.md`
- **Limitations**: `docs/architecture/multi-workflow-phase1-limitations.md` (Phase 1 vs Phase 2)

---

**Last Updated**: 2026-01-16
