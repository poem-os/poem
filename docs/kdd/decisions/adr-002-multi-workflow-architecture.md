# ADR-002: Multi-Workflow Architecture

**Date**: 2026-01-12
**Status**: Accepted (Phase 1 Complete, Phase 2 Planned)
**Source**: Story 3.8
**Phase 2**: Story 4.9 (planned)

## Context

During Story 3.7.1 testing with NanoBanana data, a critical limitation was discovered: **POEM's flat workspace structure doesn't support real-world usage patterns**.

### The Problem

**Initial Architecture**:
```
dev-workspace/
├── prompts/       # ALL prompts from ALL projects mixed together
├── schemas/       # ALL schemas mixed together
└── mock-data/     # ALL mock data mixed together
```

**Real-World Usage**:
- User has YouTube Launch Optimizer workflow (54 prompts)
- User has NanoBanana client project (12 prompts)
- User has SupportSignal integration (8 prompts)
- User switches between projects daily

**Issues**:
1. **No Context Isolation**: YouTube prompts clutter NanoBanana workspace
2. **No Filtering**: Can't filter `*list` by project
3. **Namespace Collisions**: `generate-content.hbs` - which project?
4. **Manual File Management**: User must organize prompts themselves
5. **No Project-Specific Context**: Reference materials not scoped

### Discovery Trigger

From `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`:

> Testing Story 3.7.1 with NanoBanana data revealed that a single flat workspace doesn't match how users actually work. They need multiple independent workflows within one POEM instance, each with its own prompts, schemas, and reference materials.

## Decision

**Implement workflow-scoped resource management** with independent directories for each workflow, hot-switchable context, and persistent workflow selection.

### Architecture

**New Structure**:
```
dev-workspace/
├── workflows/
│   ├── youtube-launch-optimizer/
│   │   ├── prompts/
│   │   ├── schemas/
│   │   └── mock-data/
│   ├── nano-banana/
│   │   ├── prompts/
│   │   ├── schemas/
│   │   └── mock-data/
│   └── support-signal/
│       ├── prompts/
│       ├── schemas/
│       └── mock-data/
├── shared/                    # Optional: Cross-workflow resources
│   ├── prompts/
│   └── schemas/
└── .poem-state.json           # Persistent workflow selection
```

### Configuration

```yaml
# poem-core-config.yaml
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
```

### Key Features

1. **Workflow-Scoped Directories**: Each workflow has independent resource directories
2. **Hot-Switching**: Change workflow without restarting server or agent
3. **Persistent Context**: Workflow selection survives agent restarts
4. **Config-Driven**: All workflows defined in `poem-core-config.yaml`
5. **Reference Scoping**: Each workflow has its own documentation sources
6. **Agent Commands**: `*workflows`, `*switch <name>`, `*context`

## Alternatives Considered

### Alternative 1: Flat Structure with Namespacing (Rejected)

**Approach**: Use filename prefixes
```
prompts/
  youtube-generate-titles.hbs
  nano-banana-process-order.hbs
  support-signal-enhance-notes.hbs
```

**Pros**:
- No directory restructuring
- Simple implementation

**Cons**:
- Manual namespace management
- No automatic filtering
- Still shows all prompts in `*list`
- No context-specific reference materials
- Doesn't scale (100+ prompts with prefixes is unmanageable)

### Alternative 2: Multiple POEM Instances (Rejected)

**Approach**: Run separate POEM servers for each project

**Pros**:
- Complete isolation
- No code changes needed

**Cons**:
- Resource overhead (multiple servers)
- Port management complexity
- Can't easily switch between projects
- No shared resources
- Separate agent sessions (can't maintain context across projects)

### Alternative 3: Workflow-Scoped Directories (Accepted)

As described in Decision section above.

**Pros**:
- Complete context isolation ✓
- Hot-switchable (no restart) ✓
- Single POEM instance ✓
- Persistent context ✓
- Reference material scoping ✓
- Agent remains active across switches ✓

**Cons**:
- Requires config system extension
- Requires persistence layer
- Requires new agent commands
- More complex than flat structure

**Trade-off**: Complexity justified by real-world usability gains.

## Rationale

### Real-World Usage Pattern

**User's Daily Workflow**:
1. Morning: Work on YouTube Launch Optimizer (B72 workflow with 54 prompts)
2. Afternoon: Client call - switch to NanoBanana project (12 prompts)
3. Evening: SupportSignal integration work (8 prompts)
4. Next day: Resume YouTube work - context automatically restored

**Without Multi-Workflow**:
- All 74 prompts shown in every `*list`
- No context isolation
- Manual file management

**With Multi-Workflow**:
- `*switch youtube-launch-optimizer` → See only 54 YouTube prompts
- `*switch nano-banana` → See only 12 NanoBanana prompts
- Context persists across sessions

### Config Service Pattern

Builds on **ADR-003: Config Service Single Source of Truth**.

Workflow paths resolved through config service:
```typescript
configService.getWorkflowPath('prompts')
// Returns: dev-workspace/workflows/youtube-launch-optimizer/prompts
```

All existing commands (`*list`, `*new`, `*view`) automatically workflow-aware via config service.

### Backward Compatibility

Flat structure still works if no workflows defined in config:
```yaml
workspace:
  prompts: dev-workspace/prompts
  schemas: dev-workspace/schemas
  # No workflows section → flat mode
```

Config service detects absence of `workflows` and falls back to flat paths.

## Consequences

### Positive Consequences

1. **Context Isolation**: YouTube prompts don't clutter NanoBanana workspace
2. **Scalability**: Add workflows without affecting existing ones
3. **Team Collaboration**: Multiple teams can share POEM instance
4. **Hot-Switching**: Instant context change (< 100ms)
5. **Persistence**: Workflow selection survives restarts
6. **Reference Scoping**: Each workflow has its own documentation
7. **Zero Command Changes**: Existing commands (`*list`, `*new`, `*view`) automatically workflow-aware

### Negative Consequences

1. **Configuration Complexity**: Config file more complex (multiple workflows)
2. **Learning Curve**: Users must understand workflow concept
3. **Initial Setup**: Must create workflow directories and config
4. **Migration**: Existing users must migrate from flat to scoped structure

### Mitigation

- **Phase 1** (Story 3.8): Foundation only (4-6 hours effort)
- **Phase 2** (Story 4.9): Polish and integration based on Epic 4 feedback
- **Documentation**: Multi-workflow guide, migration instructions
- **Backward Compatibility**: Flat structure still supported

## Phase 1 vs Phase 2

### Phase 1 (Story 3.8) - Delivered

✅ Workflow-scoped directory structure
✅ Config system extension (currentWorkflow, workflows map)
✅ Config service path resolution
✅ Penny workflow commands (*workflows, *switch, *context)
✅ Workflow-scoped operations (*list, *new, *view)
✅ Reference path configuration (array structure)
✅ Workflow persistence (.poem-state.json)
✅ Hot-switching without restart

### Phase 2 (Story 4.9) - Planned

❌ Shared resources detection and management
❌ Priority-based reference path resolution
❌ External reference types (git-repo, external)
❌ Workflow definition files (`.workflow.yaml`)
❌ Workflow import/export
❌ Cross-workflow prompt sharing UI

**Rationale for Phasing**: Phase 1 delivers enough for Epic 4 testing. Phase 2 adds polish based on real-world usage feedback.

## Implementation

**Story 3.8 Deliverables**:
- 3 new skills: `list-workflows.md`, `switch-workflow.md`, `show-workflow-context.md`
- Config service extended: 5 new methods (getCurrentWorkflow, setCurrentWorkflow, getWorkflowPath, getReferencePaths, listWorkflows)
- Persistence service: `workflow-persistence.ts` (load/save state)
- Agent updated: Workflow awareness documented, commands added
- 55 unit tests (43 config + 12 persistence) - 100% passing
- 9 automated SAT tests - all passing

**Quality Score**: 95/100 (QA approved with PASS gate)

**No Breaking Changes**: Backward compatible with flat structure.

## Usage Example

```bash
# Activate Penny
/poem/agents/penny

# List workflows
*workflows
# Shows: youtube-launch-optimizer (current), nano-banana, support-signal

# List prompts (only current workflow)
*list
# Shows: 54 YouTube prompts

# Switch to NanoBanana
*switch nano-banana
# Instantly switches, no restart

# List prompts (only NanoBanana)
*list
# Shows: 12 NanoBanana prompts

# Exit agent
*exit

# Reactivate agent (new session)
/poem/agents/penny

# Check context
*context
# Shows: nano-banana (persisted across sessions)
```

## Related Decisions

- **Pattern: Config Service Single Source of Truth** - Workflows defined in config
- **Pattern: Workflow-Scoped Resource Management** - Implementation details
- **ADR-003: API-First for Heavy Operations** - Config accessed via APIs

## References

- **Discovery**: `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`
- **Story**: `docs/stories/3.8.story.md` (Phase 1 implementation)
- **QA Gate**: `docs/qa/gates/3.8-multi-workflow-foundation.yml` (PASS)
- **Limitations**: `docs/architecture/multi-workflow-phase1-limitations.md` (Phase 1 vs Phase 2 details)
- **Pattern**: `docs/kdd/patterns/workflow-scoped-resource-management.md`
- **Config Service**: `packages/poem-app/src/services/config/poem-config.ts`
- **Persistence**: `packages/poem-app/src/services/config/workflow-persistence.ts`

---

**Last Updated**: 2026-01-16
**Author**: Dev Agent (Story 3.8)
**Approved By**: Quinn (QA Agent)
**Phase 1 Status**: Complete
**Phase 2 Status**: Planned (Story 4.9)
