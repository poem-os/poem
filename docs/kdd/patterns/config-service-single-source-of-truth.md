# Config Service Single Source of Truth

**Pattern**: Centralize all workspace path definitions in the config service; other components inherit paths without duplication.

**Source Stories**: 3.2.5 (Config Service Paths), 3.8 (Multi-Workflow Foundation)

## Context

When to use this pattern:

- Building systems with dynamic workspace layouts (development vs production)
- Supporting multiple workflow contexts that need different paths
- Need to avoid "magic strings" scattered throughout codebase
- Path resolution logic becomes complex (environment-dependent, mode-dependent)

**Problem**: If workflows, agents, and skills duplicate path definitions, they drift out of sync. Changes to workspace structure require updates in dozens of locations.

## Implementation

### Core Principle

**Single Source of Truth**: `packages/poem-app/src/services/config/poem-config.ts`

```typescript
// ✅ DO: Config service defines all paths
export interface PoemConfig {
  workspace: {
    // Flat structure (backward compatibility)
    prompts?: string;
    schemas?: string;

    // Multi-workflow structure
    currentWorkflow?: string;
    workflows?: Record<string, WorkflowConfig>;
  };
}

export class ConfigService {
  // Single source for path resolution
  getWorkflowPath(resourceType: 'prompts' | 'schemas' | 'mockData'): string {
    const workflow = this.getCurrentWorkflow();
    if (workflow && this.config.workspace.workflows?.[workflow]) {
      return this.config.workspace.workflows[workflow][resourceType];
    }
    // Fallback to flat structure
    return this.config.workspace[resourceType] || `dev-workspace/${resourceType}`;
  }
}
```

### Consumer Pattern (Workflows, Skills, Agents)

```yaml
# ✅ DO: Workflows reference config, never hardcode paths
# packages/poem-core/workflows/new-prompt.yaml
pathResolution: config  # ← Inherit from config service

# ❌ DON'T: Never duplicate path definitions in workflows
paths:
  prompts: dev-workspace/prompts  # ANTI-PATTERN: duplicates config
```

**Key Rule**: If you're tempted to write `dev-workspace/` or `poem/` in a workflow, agent, or skill file, STOP. Use `pathResolution: config` instead.

## Example

### Before Pattern (Anti-Pattern)

```typescript
// ❌ workflows/new-prompt.yaml
paths:
  prompts: dev-workspace/prompts
  schemas: dev-workspace/schemas

// ❌ agents/prompt-engineer.md
When listing prompts, search in `dev-workspace/prompts/`

// ❌ skills/list-prompts.md
Read directory: dev-workspace/prompts
```

**Problem**: When Story 3.8 added multi-workflow support, this would require updating 15+ files.

### After Pattern

```yaml
# ✅ workflows/new-prompt.yaml
pathResolution: config
```

```markdown
# ✅ agents/prompt-engineer.md
When listing prompts, call config service to get prompts path.
```

```markdown
# ✅ skills/list-prompts.md
1. Call GET /api/config/paths
2. Use `prompts` path from response
```

**Result**: Story 3.8 multi-workflow support only required modifying config service and poem-core-config.yaml. Zero changes to workflows, skills, or agents.

## Rationale

**Why This Works**:
1. **Single point of change**: Workspace restructuring affects only config service
2. **Environment awareness**: Config service handles dev vs prod mode transparently
3. **Testability**: Mock config service to test path resolution independently
4. **Type safety**: TypeScript interfaces enforce correct path types

**Trade-offs**:
- Slightly more verbose (must call config service)
- Indirect (can't see paths in workflow files)
- But: Maintainability gains outweigh verbosity cost

## Related Patterns

- **Workflow-Scoped Resource Management** (Story 3.8) - Builds on this pattern for multi-workflow isolation
- **API-First Heavy Operations** - Config service accessed via API endpoints, not direct imports

## Anti-Patterns

```typescript
// ❌ ANTI-PATTERN: Hardcoded paths in service methods
function listPrompts() {
  const files = fs.readdirSync('dev-workspace/prompts');
  // WRONG: Doesn't adapt to production mode or multi-workflow
}

// ❌ ANTI-PATTERN: Duplicating path resolution logic
function getPromptsPath() {
  return process.env.POEM_DEV
    ? 'dev-workspace/prompts'
    : 'poem/prompts';
  // WRONG: This logic belongs ONLY in config service
}

// ❌ ANTI-PATTERN: Workflows defining paths
paths:
  prompts: ${env.WORKSPACE}/prompts
# WRONG: Path logic embedded in workflow definition
```

## Implementation Checklist

When adding a new resource type:

- [ ] Define path in `poem-core-config.yaml` (development and production sections)
- [ ] Add path to `WorkflowConfig` interface (if workflow-scoped)
- [ ] Extend `getWorkflowPath()` method to handle new resource type
- [ ] Document in `packages/poem-core/workflows/README.md` (for workflow authors)
- [ ] Test in both dev and prod modes

## References

- **Source**: `docs/stories/3.2.5.story.md` (Config Service Paths - initial pattern)
- **Extension**: `docs/stories/3.8.story.md` (Multi-Workflow Foundation - multi-workflow support)
- **Epic 1 Application**: Story 1.10 (Selective Workspace Creation), Story 1.11 (Central POEM Path Configuration)
- **Config File**: `packages/poem-core/poem-core-config.yaml` (configuration examples)
- **Implementation**: `packages/poem-app/src/services/config/poem-config.ts` (config service code)
- **Documentation**: `packages/poem-core/workflows/README.md` (workflow path resolution guide)

---

**Pattern Established**: Story 3.2.5 (2026-01-10)
**Extended**: Story 3.8 (2026-01-12)
**Applied in Epic 1**: Story 1.10, Story 1.11 (2026-01-30)
**Last Updated**: 2026-01-30
