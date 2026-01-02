# POEM Workflows

This directory contains agent-interpreted workflow definitions for POEM.

## Path Resolution Pattern

**CRITICAL: Workflows do NOT define paths - config is the source of truth.**

### Why This Matters

Previously, each workflow duplicated path definitions:
```yaml
# BAD - Don't do this!
paths:
  development:
    prompts: prompts
    schemas: schemas
  production:
    prompts: poem/prompts
    schemas: poem/schemas
```

This caused:
- DRY violations (paths duplicated in every workflow)
- Inconsistency when paths change
- Maintenance burden for future workflows

### The Pattern

Workflows inherit paths from `poem-core-config.yaml`:

```yaml
# GOOD - Reference config instead
# Path resolution: Inherited from poem-core-config.yaml
# DO NOT add a paths: section - config service is the source of truth
pathResolution: config
```

### How Agents Resolve Paths

When executing a workflow, agents should:

1. **Detect mode** by checking directory structure:
   - `packages/poem-core/` exists → Development mode
   - `.poem-core/` exists → Production mode

2. **Use appropriate paths**:
   | Mode | Prompts | Schemas | Mock Data |
   |------|---------|---------|-----------|
   | Development | `dev-workspace/prompts/` | `dev-workspace/schemas/` | `dev-workspace/mock-data/` |
   | Production | `poem/prompts/` | `poem/schemas/` | `poem/mock-data/` |

3. **Reference config service** for path resolution (when API calls are needed):
   - The config service at `packages/poem-app/src/services/config/poem-config.ts`
   - Provides `resolvePath()` and `resolvePathAsync()` functions

### Example: new-prompt.yaml

See `new-prompt.yaml` as the reference implementation:

```yaml
# Path resolution: Inherited from poem-core-config.yaml
# DO NOT add a paths: section - config service is the source of truth
pathResolution: config

description: |
  ...
  **Path Resolution:**
  Workspace paths are inherited from poem-core-config.yaml (loaded by config service).
  - Development (POEM_DEV=true): dev-workspace/prompts/, dev-workspace/schemas/, etc.
  - Production: poem/prompts/, poem/schemas/, etc.
```

### Anti-Pattern: Never Duplicate Paths

```yaml
# WRONG - Creates duplication and maintenance burden
paths:
  development:
    prompts: dev-workspace/prompts
  production:
    prompts: poem/prompts

# CORRECT - Let config handle it
pathResolution: config
```

## Workflow List

| Workflow | Purpose | Status |
|----------|---------|--------|
| `new-prompt.yaml` | Create new prompt with schema | Implemented |
| `refine-prompt.yaml` | Iteratively improve prompts | Planned (Story 3.3) |
| `test-prompt.yaml` | Test prompts with data | Planned (Story 3.4) |
| `validate-prompt.yaml` | Validate prompt quality | Planned (Story 3.5) |

## See Also

- `poem-core-config.yaml` - Path configuration source of truth
- `packages/poem-app/src/services/config/poem-config.ts` - Config service implementation
- `dev-workspace/README.md` - Developer testing workspace
