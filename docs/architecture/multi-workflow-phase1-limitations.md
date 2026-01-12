# Multi-Workflow Support: Phase 1 Limitations

**Story**: 3.8 - Multi-Workflow Foundation (Phase 1)
**Date**: 2026-01-12
**Status**: ✅ Phase 1 Complete, 🔄 Phase 2 Planned (Story 4.9)

## Overview

Story 3.8 delivers the **foundation** for multi-workflow support, enabling users to work with multiple independent prompt collections within one POEM workspace. This document outlines what's implemented in Phase 1 and what's intentionally deferred to Phase 2 (Story 4.9).

**Goal**: Deliver minimum viable multi-workflow support for Epic 4 testing (4-6 hours effort), then refine based on real-world usage in Story 4.9.

---

## Phase 1: What's Implemented ✅

### Directory Structure
- ✅ Workflow-scoped directories: `dev-workspace/workflows/<name>/`
- ✅ Each workflow has: `prompts/`, `schemas/`, `mock-data/`
- ✅ Two example workflows: `youtube-launch-optimizer`, `nano-banana`
- ✅ Directories are gitignored (transient development workspace)

### Configuration System
- ✅ Config schema extended with `currentWorkflow` and `workflows` map
- ✅ Workflow config includes: `prompts`, `schemas`, `mockData`, `reference` (array)
- ✅ Reference path types: `local`, `second-brain`
- ✅ Inline comments in `poem-core-config.yaml` explaining all fields
- ✅ Backward compatibility: flat structure still works if no workflows defined

### Config Service
- ✅ `getCurrentWorkflow()` - Returns active workflow name or null
- ✅ `listWorkflows()` - Returns array of workflow names
- ✅ `getWorkflowPath(resourceType)` - Resolves workflow-scoped paths
- ✅ `getReferencePaths()` - Returns array of ReferenceConfig
- ✅ `setCurrentWorkflow(name)` - Validates and sets active workflow
- ✅ Path resolution logic: workflow-scoped if active, flat otherwise
- ✅ 43 tests passing (10 new workflow tests)

### Workflow Persistence
- ✅ Persistence service: `workflow-persistence.ts`
- ✅ State file: `dev-workspace/.poem-state.json`
- ✅ Active workflow persists across Penny sessions
- ✅ `loadWorkflowState()` - Loads persisted workflow on startup
- ✅ `saveWorkflowState()` - Saves workflow selection to disk
- ✅ 12 persistence tests passing

### Penny Agent Commands
- ✅ `*workflows` - Lists all available workflows with current indicator
- ✅ `*switch <workflow>` - Changes active workflow (hot-switch, no restart)
- ✅ `*context` - Shows current workflow info, paths, references
- ✅ Commands documented in agent definition
- ✅ Skills created: `list-workflows.md`, `switch-workflow.md`, `show-workflow-context.md`

### Workflow-Scoped Operations
- ✅ `*list` - Lists prompts only from current workflow
- ✅ `*new` - Creates prompts in workflow-scoped directories
- ✅ `*view` - Searches workflow-scoped prompts first
- ✅ Schema generation saves to workflow-scoped schemas directory
- ✅ Workflow context displayed in command output headers

### Isolation
- ✅ Prompts created in workflow A don't appear in workflow B
- ✅ Schemas scoped to workflow directories
- ✅ Mock data scoped to workflow directories
- ✅ Config service enforces isolation via path resolution

### Documentation
- ✅ WorkflowDefinition interface documented in `data-models.md`
- ✅ Workflow Context Awareness section in `components.md`
- ✅ Config structure documented with inline comments
- ✅ This limitations document (you're reading it!)

---

## Phase 2: What's Deferred 🔄 (Story 4.9)

### Workflow Definition Files
- ❌ `.workflow.yaml` files for complete workflow orchestration
- ❌ Workflow file schema: `name`, `description`, `version`, `sections`, `steps`
- ❌ Workflow import/export functionality
- ❌ Workflow validation (schema, dependencies, step ordering)

**Why Deferred**: Phase 1 focuses on workspace isolation. Workflow orchestration (multi-step execution, dependencies) is a distinct feature that benefits from Epic 4 usage feedback.

### Priority System
- ❌ Priority-based conflict resolution when same file exists in multiple reference sources
- ❌ Automatic selection of highest-priority source
- ❌ Priority inheritance and override rules

**Why Deferred**: Reference paths are configured but not yet loaded/used. Priority logic makes sense once reference integration is active.

**Phase 1 Behavior**: Reference paths displayed in `*context` command but not used for context loading.

### Shared Resources
- ❌ `dev-workspace/shared/prompts/` and `dev-workspace/shared/schemas/`
- ❌ Detection of prompts that could be shared across workflows
- ❌ `*list --shared` flag to show shared resources
- ❌ Automatic fallback to shared/ when prompt not found in workflow

**Why Deferred**: Shared resource management requires heuristics (usage tracking, dependency analysis) that benefit from real-world workflow usage patterns.

**Phase 1 Behavior**: Workflows are fully isolated. No sharing mechanism.

### Reference Path Integration
- ❌ Loading reference materials from configured paths
- ❌ Context augmentation with reference materials during prompt creation
- ❌ Reference path types: `external` (URLs), `git-repo` (GitHub repos)
- ❌ Automatic syncing of external reference sources
- ❌ Reference material caching and refresh logic

**Why Deferred**: Integration requires API design for context loading, which benefits from Epic 4 workflow testing to understand real needs.

**Phase 1 Behavior**: Reference paths are configured and displayed (`*context` command) but not used for context loading.

### Advanced Commands
- ❌ `*workflows --verbose` - Extended workflow details (sections, steps, dependencies)
- ❌ `*context --reference` - Filtered view showing only reference paths
- ❌ `*context --sections` - Show workflow sections/phases
- ❌ `*list --shared` - Show shared prompts across workflows
- ❌ `*view <prompt> --all-workflows` - Search prompt across all workflows

**Why Deferred**: Advanced flags require Phase 2 infrastructure (workflow files, shared resources, reference integration).

**Phase 1 Behavior**: Basic commands work (`*workflows`, `*switch`, `*context`, `*list`). Flags ignored or show "coming in Story 4.9" message.

### Cross-Workflow Analysis
- ❌ Duplicate prompt detection across workflows
- ❌ Schema compatibility analysis (which workflows can share prompts)
- ❌ Reference path overlap warnings
- ❌ Workflow migration tools (move prompts between workflows)

**Why Deferred**: Analysis tools require established workflows with prompts to analyze.

---

## Backward Compatibility

Phase 1 maintains full backward compatibility:

- ✅ If `currentWorkflow` not set, POEM operates in flat mode
- ✅ Flat paths still work: `dev-workspace/prompts/`, `dev-workspace/schemas/`
- ✅ Existing prompts continue to function without changes
- ✅ Config service falls back to flat paths if no workflow active

**Migration Path**: Users can adopt multi-workflow support incrementally:
1. Keep using flat structure (no action needed)
2. Define workflows in config when ready
3. Use `*switch` to activate workflow context
4. Create new prompts in workflow-scoped directories
5. Migrate existing prompts at your own pace

---

## Phase 1 vs Phase 2 Decision Criteria

**Phase 1 Scope** (4-6 hours):
- ✅ Enables Epic 4 testing (YouTube Launch Optimizer workflow)
- ✅ Proves isolation works (critical for multi-workflow)
- ✅ Validates config structure and path resolution
- ✅ Establishes Penny command UX patterns

**Phase 2 Scope** (Story 4.9 - after Epic 4):
- 🔄 Learns from Epic 4 usage (what's actually needed?)
- 🔄 Adds polish based on real workflow patterns
- 🔄 Integrates reference materials (context loading)
- 🔄 Implements priority system (conflict resolution)
- 🔄 Detects shared resources (cross-workflow optimization)

**Key Insight**: Phase 1 delivers the risky/novel parts (isolation, path resolution, persistence). Phase 2 adds polish and integration based on validated patterns.

---

## Testing Notes

**Phase 1 Testing**:
- ✅ Unit tests: Config service (43 tests passing)
- ✅ Unit tests: Persistence service (12 tests passing)
- ✅ Manual testing: Penny workflow commands (Task 11)
- ✅ Isolation testing: Create prompt in A, switch to B, verify not visible

**Phase 2 Testing** (Story 4.9):
- 🔄 Epic 4 integration testing (full YouTube workflow)
- 🔄 Reference path loading tests
- 🔄 Priority system unit tests
- 🔄 Shared resource detection tests
- 🔄 Cross-workflow analysis tests

---

## Known Issues / Future Enhancements

**Phase 1 Known Issues**:
- None identified (as of 2026-01-12)

**Future Enhancements** (beyond Phase 2):
- Workflow templates library (predefined workflow configurations)
- Workflow marketplace (share workflows with community)
- Workflow versioning (track changes to workflow definitions)
- Workflow analytics (usage tracking, performance metrics)
- Multi-user workflows (team collaboration, permissions)

---

## Related Documentation

- **Course Correction**: `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`
- **Architecture - Data Models**: `docs/architecture/data-models.md` (lines 362-487)
- **Architecture - Components**: `docs/architecture/components.md` (lines 32-63)
- **Config**: `packages/poem-core/poem-core-config.yaml` (lines 9-104)
- **Story 3.8**: `docs/stories/3.8.story.md`
- **Story 4.9** (Phase 2): TBD (to be created after Epic 4 completion)

---

## Summary

**Phase 1 Achievement**: ✅ Foundation complete

POEM now supports multiple independent workflows within one workspace. Users can:
1. Define workflows in config
2. Switch between workflows with `*switch`
3. Create workflow-scoped prompts with `*new`
4. View workflow context with `*context`
5. Work in isolation (prompts don't leak across workflows)

**Phase 2 Goal**: 🔄 Integration and polish

Story 4.9 will add reference integration, priority system, shared resources, and workflow orchestration files based on Epic 4 learnings.

**Result**: Users can now test Epic 4 (YouTube Launch Optimizer) with proper workflow isolation, and we'll refine the system based on real-world usage patterns.

---

**Last Updated**: 2026-01-12
**Status**: ✅ Phase 1 Complete
**Next**: Story 4.9 (Phase 2) after Epic 4 completion
