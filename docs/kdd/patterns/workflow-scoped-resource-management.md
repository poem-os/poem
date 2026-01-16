# Workflow-Scoped Resource Management

**Pattern**: Isolate prompts, schemas, and mock data in workflow-specific directories with hot-switchable context and persistent workflow selection.

**Source Story**: 3.8 (Multi-Workflow Foundation - Phase 1)

## Context

When to use this pattern:

- Managing multiple independent prompt collections (YouTube, NanoBanana, SupportSignal)
- Need context isolation between different use cases
- Want to switch between workflows without restarting server or agent
- Sharing workspace between multiple projects/teams
- Each workflow has unique reference materials (second brain, local docs)

**Problem**: Flat workspace structure (`prompts/`, `schemas/`, `mock-data/`) mixes all workflows together:
- Prompts from different projects appear in same list
- No way to filter by workflow context
- Switching contexts requires manual file management
- Reference materials not scoped to workflow

**Solution**: Workflow-scoped directories with config-driven context switching.

## Implementation

### Directory Structure

```
dev-workspace/
├── workflows/                       # Workflow-scoped structure
│   ├── youtube-launch-optimizer/
│   │   ├── prompts/                # YouTube-specific prompts
│   │   ├── schemas/                # YouTube-specific schemas
│   │   └── mock-data/              # YouTube-specific mock data
│   ├── nano-banana/
│   │   ├── prompts/
│   │   ├── schemas/
│   │   └── mock-data/
│   └── support-signal/
│       ├── prompts/
│       ├── schemas/
│       └── mock-data/
├── shared/                          # Optional: Cross-workflow resources
│   ├── prompts/
│   └── schemas/
└── .poem-state.json                 # Persistent workflow selection
```

### Configuration

```yaml
# packages/poem-core/poem-core-config.yaml
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
        - path: /ad/brains/youtube/
          type: second-brain
          priority: 20

    nano-banana:
      prompts: dev-workspace/workflows/nano-banana/prompts
      schemas: dev-workspace/workflows/nano-banana/schemas
      mockData: dev-workspace/workflows/nano-banana/mock-data
      reference:
        - path: data/nano-banana/reference/
          type: local
          priority: 10
```

### Config Service Extension

```typescript
// packages/poem-app/src/services/config/poem-config.ts

interface WorkflowConfig {
  prompts: string;
  schemas: string;
  mockData: string;
  reference?: ReferenceConfig[];
}

interface ReferenceConfig {
  path: string;                           // Path to reference materials
  type: 'local' | 'second-brain';         // Reference source type
  description?: string;
  priority?: number;                      // Conflict resolution (higher wins)
}

interface PoemConfig {
  workspace: {
    currentWorkflow?: string;
    workflows?: Record<string, WorkflowConfig>;
  };
}

export class ConfigService {
  // Get current workflow name
  getCurrentWorkflow(): string | null {
    return this.config.workspace.currentWorkflow || null;
  }

  // Get workflow-scoped path
  getWorkflowPath(resourceType: 'prompts' | 'schemas' | 'mockData'): string {
    const workflow = this.getCurrentWorkflow();
    if (workflow && this.config.workspace.workflows?.[workflow]) {
      return this.config.workspace.workflows[workflow][resourceType];
    }
    // Fallback to flat structure
    return this.config.workspace[resourceType] || `dev-workspace/${resourceType}`;
  }

  // Switch workflow context
  async setCurrentWorkflow(workflowName: string): Promise<void> {
    if (!this.config.workspace.workflows?.[workflowName]) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }
    this.config.workspace.currentWorkflow = workflowName;
    await saveWorkflowState({ currentWorkflow: workflowName });
  }

  // Get reference paths for current workflow
  getReferencePaths(): ReferenceConfig[] {
    const workflow = this.getCurrentWorkflow();
    if (workflow && this.config.workspace.workflows?.[workflow]) {
      return this.config.workspace.workflows[workflow].reference || [];
    }
    return [];
  }
}
```

### Persistence

```typescript
// packages/poem-app/src/services/config/workflow-persistence.ts

interface WorkflowState {
  currentWorkflow: string;
}

export async function loadWorkflowState(): Promise<WorkflowState | null> {
  try {
    const content = await fs.readFile('dev-workspace/.poem-state.json', 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') return null; // File doesn't exist yet
    console.warn('Failed to load workflow state:', error.message);
    return null;
  }
}

export async function saveWorkflowState(state: WorkflowState): Promise<void> {
  await fs.mkdir('dev-workspace', { recursive: true });
  await fs.writeFile(
    'dev-workspace/.poem-state.json',
    JSON.stringify(state, null, 2)
  );
}
```

### Agent Commands

```markdown
<!-- packages/poem-core/agents/prompt-engineer.md -->

## Workflow Context Awareness

Penny operates in the context of the currently active workflow. All commands (`*list`, `*new`, `*view`) are workflow-scoped.

### Workflow Commands

- `*workflows` - List all available workflows with current indicator
- `*switch <workflow>` - Switch to a different workflow context
- `*context` - Display current workflow info, paths, and reference materials

### Workflow-Scoped Behavior

- `*list` - Shows only prompts from current workflow
- `*new` - Creates prompts in current workflow directory
- `*view` - Searches current workflow prompts first
```

## Rationale

**Why Workflow-Scoped Resources?**

1. **Context Isolation**: YouTube prompts don't clutter NanoBanana workspace
2. **Team Collaboration**: Multiple teams can share POEM instance with separate workflows
3. **Hot-Switching**: Change context without restarting server (async state update)
4. **Persistence**: Workflow selection survives agent restarts
5. **Reference Scoping**: Each workflow has its own documentation sources
6. **Scalability**: Add new workflows without affecting existing ones

**Real-World Use Case** (From Story 3.8 Discovery):
- User testing YouTube Launch Optimizer prompts
- Switches to NanoBanana workflow for client project
- Returns to YouTube later - context automatically restored
- No cross-contamination of prompts between workflows

**Architecture Benefits**:
- Config service remains single source of truth
- Backward compatible (flat structure still works)
- No changes needed to existing agent commands
- Skills automatically workflow-aware via config service

## Related Patterns

- **Config Service Single Source of Truth** - Workflows defined in config, paths resolved dynamically
- **Skills Self-Description Format** - Skills operate in workflow context transparently

## Usage Example

### Switching Workflows

```bash
# Activate Penny
/poem/agents/penny

# List available workflows
*workflows

# Output:
# Available Workflows:
# ┌─────────────────────────┬──────────────────────────────┬─────────┐
# │ Name                    │ Description                  │ Current │
# ├─────────────────────────┼──────────────────────────────┼─────────┤
# │ youtube-launch-optimizer│ YouTube video publishing     │ ✓       │
# │ nano-banana             │ NanoBanana client project    │         │
# │ support-signal          │ SupportSignal shift notes    │         │
# └─────────────────────────┴──────────────────────────────┴─────────┘

# Switch to NanoBanana
*switch nano-banana

# Output:
# ✓ Switched to workflow: nano-banana
# Workspace:
#   Prompts: dev-workspace/workflows/nano-banana/prompts
#   Schemas: dev-workspace/workflows/nano-banana/schemas

# List prompts (only NanoBanana prompts shown)
*list

# Create prompt (saved in nano-banana directory)
*new
```

### Persistence Verification

```bash
# Switch workflow
*switch youtube-launch-optimizer

# Exit agent
*exit

# Reactivate agent (new session)
/poem/agents/penny

# Check current context
*context

# Output:
# Current Workflow: youtube-launch-optimizer
# (Workflow persisted across sessions)
```

## Implementation Checklist

When adding multi-workflow support to a codebase:

- [ ] Create workflow directory structure (workflows/<name>/)
- [ ] Extend config schema with currentWorkflow and workflows map
- [ ] Add WorkflowConfig and ReferenceConfig interfaces
- [ ] Implement getCurrentWorkflow() and getWorkflowPath() methods
- [ ] Add workflow persistence (load/save state to .poem-state.json)
- [ ] Create workflow management commands (*workflows, *switch, *context)
- [ ] Update existing commands to use workflow-scoped paths
- [ ] Test isolation (create prompt in A, switch to B, verify not visible)
- [ ] Test persistence (switch workflow, restart, verify persisted)
- [ ] Document workflow configuration in config file comments

## Phase 1 vs Phase 2

**Phase 1 (Story 3.8)** - Foundation:
- ✅ Workflow-scoped directories
- ✅ Config-driven workflow management
- ✅ Hot-switching without restart
- ✅ Persistent workflow selection
- ✅ Reference path configuration (array structure)
- ✅ Basic workflow commands

**Phase 2 (Story 4.9)** - Polish & Integration:
- ❌ Shared resources detection and management
- ❌ Priority-based reference path resolution
- ❌ Workflow definition files (`.workflow.yaml`)
- ❌ Cross-workflow prompt sharing UI
- ❌ Workflow import/export

**Design Decision**: Phase 1 delivers enough functionality for Epic 4 testing. Phase 2 adds polish based on real-world usage feedback.

## Testing Pattern

### Unit Tests (Config Service)

```typescript
describe('ConfigService - Workflow Management', () => {
  it('should return current workflow', () => {
    const config = new ConfigService();
    expect(config.getCurrentWorkflow()).toBe('youtube-launch-optimizer');
  });

  it('should resolve workflow-scoped path', () => {
    const config = new ConfigService();
    const path = config.getWorkflowPath('prompts');
    expect(path).toBe('dev-workspace/workflows/youtube-launch-optimizer/prompts');
  });

  it('should throw error for invalid workflow switch', async () => {
    const config = new ConfigService();
    await expect(config.setCurrentWorkflow('invalid')).rejects.toThrow('Workflow not found');
  });
});
```

### Manual Tests (Agent Activation)

```bash
# SAT Test Scenarios:

# Test 1: Workflow Isolation
1. Switch to youtube-launch-optimizer
2. Create test prompt "generate-titles"
3. List prompts (verify "generate-titles" appears)
4. Switch to nano-banana
5. List prompts (verify "generate-titles" does NOT appear)

# Test 2: Persistence
1. Switch to nano-banana
2. Exit agent
3. Reactivate agent
4. Run *context (verify nano-banana still active)

# Test 3: Hot-Switching
1. Switch to youtube-launch-optimizer
2. Run *context (verify instant switch, no restart)
```

## Anti-Patterns

```typescript
// ❌ ANTI-PATTERN: Hardcoded workflow paths in skills
const promptsPath = 'dev-workspace/workflows/youtube-launch-optimizer/prompts';
// WRONG: Breaks when workflow switches

// ✅ CORRECT: Use config service
const promptsPath = configService.getWorkflowPath('prompts');

// ❌ ANTI-PATTERN: Global state for current workflow
let currentWorkflow = 'youtube-launch-optimizer';
// WRONG: Not persistent, not config-driven

// ✅ CORRECT: Persist in .poem-state.json, load from config

// ❌ ANTI-PATTERN: Mixing workflows in same directory
prompts/
  youtube-generate-titles.hbs
  nano-banana-process-order.hbs
# WRONG: No isolation, can't filter by workflow

// ✅ CORRECT: Workflow-scoped directories
workflows/youtube-launch-optimizer/prompts/generate-titles.hbs
workflows/nano-banana/prompts/process-order.hbs
```

## References

- **Discovery**: `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md` (genesis of pattern)
- **Story**: `docs/stories/3.8.story.md` (Phase 1 implementation)
- **Config Service**: `packages/poem-app/src/services/config/poem-config.ts` (workflow path resolution)
- **Persistence**: `packages/poem-app/src/services/config/workflow-persistence.ts` (state management)
- **Agent**: `packages/poem-core/agents/prompt-engineer.md` (workflow commands)
- **Skills**: `packages/poem-core/skills/list-workflows.md`, `switch-workflow.md`, `show-workflow-context.md`
- **Limitations**: `docs/architecture/multi-workflow-phase1-limitations.md` (Phase 1 vs Phase 2)

---

**Pattern Established**: Story 3.8 (2026-01-12)
**Phase 1 Status**: Complete
**Phase 2 Story**: 4.9 (planned)
**Last Updated**: 2026-01-16
