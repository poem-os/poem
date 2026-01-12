# Documentation Updates Checklist - Multi-Workflow Support

**Date**: 2026-01-12
**Purpose**: Track all documentation updates needed for multi-workflow support (Stories 3.8 + 4.9)
**Estimated Total Effort**: 2-3 hours

---

## 📊 **Quick Summary**

| Category | Files to Update | Effort |
|----------|----------------|--------|
| **PRD** | 2 files | 45 min |
| **Architecture** | 2 files | 45 min |
| **Config** | 1 file | 15 min |
| **Agents** | 1 file | 15 min |
| **Future Enhancements** | 1 file | 20 min |
| **Guides** (Phase 2) | 1 new file | 60 min |
| **TOTAL** | **8 files** | **~3 hours** |

---

## 🎯 **Phase 1 Documentation Updates (NOW)**

### 1. Update Epic List

**File**: `docs/prd/epic-list.md`

**Changes**:
- Add Story 3.8 to Epic 3 summary
- Update Epic 4 note about multi-workflow support available
- Update Epic 9 description with Phase 1+2 context

**Specific Edits**:

**Line 11** (after Epic 3 description):
```markdown
## Epic 3: Prompt Engineer Agent & Core Workflows

Create the first agent (Prompt Engineer) with workflows for new prompt creation, refinement, testing, and validation—enabling the primary user journey. **Includes multi-workflow foundation (Story 3.8)** to support multiple independent workflows within one workspace.

**Stories**: 3.1 - 3.8
```

**Line 16** (Epic 4 description):
```markdown
## Epic 4: YouTube Automation Workflow (System Validation)

Validate POEM's core capabilities through the YouTube Launch Optimizer workflow—a real multi-prompt pipeline that transforms video transcripts into complete launch assets (titles, descriptions, chapters, thumbnails, tags, social posts). This epic tests schema extraction, template chaining, mock data generation, Handlebars helpers, progressive data accumulation, and human-in-the-loop patterns using 53 production templates across 11 workflow sections. **Benefits from multi-workflow support** to test multiple workflows (YouTube Launch vs Video Planning vs NanoBanana) in parallel. **Includes multi-workflow polish (Story 4.9)** to finalize reference integration based on B72 learnings.

**Stories**: 4.1 - 4.9
```

**Line 34** (Epic 9 - after current description):
```markdown
## Epic 9: Multi-Workflow Support (Future)

**Status**: 📋 Requirements Complete, Foundation Validated
**Target**: POEM v1.1 - v2.0 (Q2-Q3 2026)

**Foundation**: Stories 3.8 (Phase 1) and 4.9 (Phase 2) deliver production-ready multi-workflow prototype validated through Epic 4.

**What Epic 9 Adds**: Advanced features beyond prototype:
- Visual workflow editor and designer
- Auto-sync reference materials from git repositories
- Cross-workflow analytics and insights
- Workflow templates and marketplace
- Advanced validation (step I/O compatibility checking)
- Workflow execution orchestration
- CI/CD integration for workflow testing

**Dependencies**: Prototype validation through Epic 3-4 (complete), community feedback on Phase 1+2 usage patterns

**Tracking**: `docs/future-enhancements.md` (Enhancement #11)
```

**Effort**: 15 minutes

---

### 2. Add Stories to Epic Details

**File**: `docs/prd/epic-details.md`

**Changes**:
- Add Story 3.8 after Story 3.7.1 (Epic 3 section)
- Add Story 4.9 at end of Epic 4 section
- Both stories already fully drafted (use story files)

**Specific Edits**:

**After Story 3.7.1** (insert full Story 3.8 content):
```markdown
---

### Story 3.8: Multi-Workflow Foundation (Phase 1)

As a prompt engineer,
I want to work with multiple independent workflows within one POEM workspace,
so that I can manage distinct prompt collections (YouTube Launch, Video Planning, NanoBanana) with workflow-specific context while sharing common resources.

**Acceptance Criteria**:

[Copy full AC list from story-3.8-multi-workflow-foundation.md]

**Phase Note**: Phase 1 delivers foundation. Phase 2 (Story 4.9) adds polish and integration based on Epic 4 learnings.

---
```

**After Story 4.8** (last current story in Epic 4 - insert Story 4.9):
```markdown
---

### Story 4.9: Multi-Workflow Polish & Integration (Phase 2)

As a prompt engineer,
I want reference materials and shared resources integrated with multi-workflow context,
so that Penny can provide context-aware guidance using workflow-specific knowledge and detect cross-workflow resource usage.

**Acceptance Criteria**:

[Copy full AC list from story-4.9-multi-workflow-polish.md]

**Epic 4 Learnings**: This story applies learnings from B72 workflow validation (Stories 4.1-4.8) to finalize workflow definition format and reference integration patterns.

---
```

**Effort**: 30 minutes (mostly copy-paste with formatting)

---

### 3. Update Data Models

**File**: `docs/architecture/data-models.md`

**Changes**:
- Update WorkflowDefinition model (already has placeholder from Course Correct)
- Add ReferenceConfig interface
- Update example with reference arrays

**Specific Edit** (find "Workflow Definition (Future - Epic 9)" section):

**Replace this section**:
```markdown
## Workflow Definition (Future - Epic 9)

**Purpose:** Define a multi-prompt workflow with orchestration logic, sections, and step dependencies.

**Status**: 🔮 **Future Enhancement** - Not yet implemented. See `docs/future-enhancements.md` (Enhancement #11).
```

**With**:
```markdown
## Workflow Definition

**Purpose:** Define a multi-prompt workflow with orchestration logic, sections, and step dependencies.

**Status**: ✅ **Implemented** - Phase 1 (Story 3.8) foundation, Phase 2 (Story 4.9) polish. See `docs/guides/multi-workflow-guide.md` for usage.
```

**Add ReferenceConfig interface** (after WorkflowDefinition):
```typescript
interface ReferenceConfig {
  /** Path to reference materials (relative or absolute) */
  path: string;

  /** Reference source type */
  type: 'local' | 'second-brain' | 'external' | 'git-repo';

  /** Optional description of this reference source */
  description?: string;

  /** Priority for conflict resolution (higher = preferred, default: 10) */
  priority?: number;
}
```

**Update WorkflowDefinition.reference**:
```typescript
interface WorkflowDefinition {
  name: string;
  description: string;
  version: string;
  sections: WorkflowSection[];

  /** Reference material sources (can be multiple) */
  reference?: ReferenceConfig[];  // ✅ ARRAY of sources
}
```

**Add example with multiple references**:
```yaml
# Example: NanoBanana workflow definition
name: nano-banana
description: AI image generation using Nano Banana Pro JSON prompting
version: 1.0.0

reference:
  # Local project reference materials
  - path: data/nano-banana/reference/
    type: local
    description: API docs and JSON prompting guide
    priority: 10

  # Second brain curated knowledge
  - path: /ad/brains/nano-banana/
    type: second-brain
    description: Curated best practices and examples
    priority: 20

  # External documentation (future)
  - path: https://github.com/appydave/nano-banana-docs
    type: git-repo
    description: Official Nano Banana documentation
    priority: 5

sections:
  - name: Shot Generation
    steps:
      - id: generate-shot
        prompt: prompts/generate-shot.hbs
        inputs: [sceneDescription, shotType, cameraAngle]
        outputs: [jsonPrompt]
```

**Effort**: 20 minutes

---

### 4. Update Components Documentation

**File**: `docs/architecture/components.md`

**Changes**:
- Update Agents section with workflow awareness details
- Add workflow context to existing text

**Specific Edit** (find "Component: Agents (poem-core)" section, after agents table):

**Find this text** (added in Course Correct):
```markdown
**Future Enhancement (Epic 9)**: Agents will support **workflow-scoped context awareness**...

**Current Limitation**: Agents operate in a single flat workspace...
```

**Replace with**:
```markdown
**Workflow Context Awareness** (✅ Implemented - Stories 3.8, 4.9):

Agents support **workflow-scoped context**, enabling operation across multiple independent workflows within one workspace.

**Key Capabilities**:
- **Workflow Switching**: Penny has `*workflows`, `*switch <workflow>`, `*context` commands
- **Scoped Operations**: All commands (`*list`, `*new`, `*view`) operate in current workflow context
- **Reference Integration**: Access to workflow-specific reference materials from multiple sources
- **Shared Resources**: Detection and management of prompts/schemas shared across workflows

**Example Usage**:
```
*workflows                    # List all workflows
*switch nano-banana           # Change to NanoBanana workflow
*context                      # Show current workflow info
*list                         # Lists nano-banana prompts only
*new                          # Creates prompt in nano-banana/prompts/
```

**Configuration**: See `packages/poem-core/poem-core-config.yaml` for workflow setup.

**User Guide**: See `docs/guides/multi-workflow-guide.md` for complete documentation.

---
```

**Effort**: 15 minutes

---

### 5. Update Config File

**File**: `packages/poem-core/poem-core-config.yaml`

**Changes**:
- Add workflow structure with examples
- Document reference array pattern
- Add comments explaining usage

**Specific Edit** (after existing workspace section):

**Add after line 31** (after production workspace paths comment):
```yaml
# ============================================================================
# MULTI-WORKFLOW SUPPORT (Stories 3.8, 4.9)
# ============================================================================
#
# POEM supports multiple independent workflows within one workspace.
# Each workflow has its own prompts, schemas, mock data, and reference materials.
#
# Example configuration:
#
# workspace:
#   currentWorkflow: youtube-launch-optimizer
#
#   workflows:
#     youtube-launch-optimizer:
#       prompts: dev-workspace/workflows/youtube-launch-optimizer/prompts
#       schemas: dev-workspace/workflows/youtube-launch-optimizer/schemas
#       mockData: dev-workspace/workflows/youtube-launch-optimizer/mock-data
#       reference:
#         - path: data/youtube-launch-optimizer/
#           type: local
#           priority: 10
#         - path: /ad/brains/youtube/
#           type: second-brain
#           priority: 20
#
#     nano-banana:
#       prompts: dev-workspace/workflows/nano-banana/prompts
#       schemas: dev-workspace/workflows/nano-banana/schemas
#       mockData: dev-workspace/workflows/nano-banana/mock-data
#       reference:
#         - path: data/nano-banana/reference/
#           type: local
#           priority: 10
#         - path: /ad/brains/nano-banana/
#           type: second-brain
#           priority: 20
#
#   # Shared resources across workflows
#   shared:
#     prompts: dev-workspace/shared/prompts
#     schemas: dev-workspace/shared/schemas
#
# Reference Material Types:
#   - local: Relative to project root (e.g., data/nano-banana/)
#   - second-brain: Absolute path (e.g., /ad/brains/nano-banana/)
#   - external: URL to documentation (future)
#   - git-repo: Git repository URL (future)
#
# Priority System:
#   - Higher priority wins conflicts (same filename in multiple sources)
#   - Default priority: 10
#   - Typical: local=10, second-brain=20, external=5
#
# To enable multi-workflow:
#   1. Add 'currentWorkflow' field
#   2. Define workflows with paths and reference sources
#   3. Activate Penny: /poem/agents/penny
#   4. Use workflow commands: *workflows, *switch <name>, *context
#
# See: docs/guides/multi-workflow-guide.md
# ============================================================================
```

**Effort**: 15 minutes

---

### 6. Update Prompt Engineer Agent

**File**: `packages/poem-core/agents/prompt-engineer.md`

**Changes**:
- Update commands list with workflow commands
- Update agent behavior section

**Specific Edit**:

**Find commands section** (around line 53):

**Replace**:
```yaml
commands:
  - help: Show numbered list of the following commands to allow selection
  - list: List all available prompts in the workspace...
  - view: Display a specific prompt template...
  - new: Execute workflow new-prompt.yaml to create a new prompt with schema
  - refine: Execute workflow refine-prompt.yaml to iteratively improve an existing prompt
  - test: Execute workflow test-prompt.yaml to test a prompt with mock or provided data
  - validate: Execute workflow validate-prompt.yaml to validate prompt structure and quality
  - exit: Say goodbye as the Prompt Engineer, and then abandon inhabiting this persona

# Future Enhancement (Epic 9): Multi-Workflow Support
# [old comment about future commands]
```

**With**:
```yaml
commands:
  - help: Show numbered list of the following commands to allow selection
  - list: List all available prompts in current workflow with rich metadata (usage: *list or *list --shared)
  - view: Display a specific prompt template with rich metadata (usage: *view <prompt-name>)
  - new: Execute workflow new-prompt.yaml to create a new prompt with schema in current workflow
  - refine: Execute workflow refine-prompt.yaml to iteratively improve an existing prompt
  - test: Execute workflow test-prompt.yaml to test a prompt with mock or provided data
  - validate: Execute workflow validate-prompt.yaml to validate prompt structure and quality
  - workflows: List all available workflows in workspace (usage: *workflows or *workflows --verbose)
  - switch: Change to a different workflow context (usage: *switch <workflow-name>)
  - context: Show current workflow information, reference materials, and paths (usage: *context, *context --reference, *context --sections)
  - exit: Say goodbye as the Prompt Engineer, and then abandon inhabiting this persona
```

**Effort**: 10 minutes

---

### 7. Update Future Enhancements

**File**: `docs/future-enhancements.md`

**Changes**:
- Update Enhancement #11 status (Phase 1 + Phase 2 complete)
- Clarify what's still future (Epic 9)

**Specific Edit** (find Enhancement #11 section):

**Update status line**:
```markdown
### 11. Multi-Workflow Support (Workspace Context Architecture)

**Status**: ✅ **Phase 1 + Phase 2 Complete** (Stories 3.8, 4.9) → 🔮 Epic 9 Future (Q2-Q3 2026)
**Target**: Production-ready prototype delivered. Epic 9 for advanced features.
**Completed**: 2026-01-12 (Phase 1), 2026-XX-XX (Phase 2 after Epic 4)
**Discovered**: 2026-01-12 (Story 3.7.1 testing with NanoBanana)
```

**Add "Completed Features" section** (after "What" section):
```markdown
**✅ Completed Features (Phase 1 + Phase 2)**:

**Phase 1 (Story 3.8)**:
- ✅ Workflow-scoped directory structure
- ✅ Config system with workflow definitions
- ✅ Workflow commands: `*workflows`, `*switch`, `*context`
- ✅ Reference config structure (array support)
- ✅ Basic isolation and path resolution

**Phase 2 (Story 4.9)**:
- ✅ Reference materials loading from multiple sources
- ✅ Priority-based conflict resolution
- ✅ Shared resource detection and management
- ✅ Workflow definition format (based on B72 learnings)
- ✅ Enhanced workflow commands (--verbose, --reference, --sections)
- ✅ Context-aware assistance in Penny
- ✅ Multi-workflow usage guide

**Production Ready**: YES - Multi-workflow support fully functional for real-world use.
```

**Add "Future Enhancements (Epic 9)" section**:
```markdown
**🔮 Future Enhancements (Epic 9 - Q2-Q3 2026)**:

What Epic 9 would add beyond Phase 1+2 prototype:
- Visual workflow editor and designer (drag-and-drop workflow creation)
- Auto-sync reference materials from git repositories
- Cross-workflow analytics (shared resource usage, workflow complexity metrics)
- Workflow templates and marketplace (community workflows)
- Advanced validation (step I/O compatibility checking, circular dependency detection)
- Workflow execution orchestration (automated multi-step execution)
- CI/CD integration for workflow testing
- Workflow versioning and rollback

**Dependencies**: Community feedback on Phase 1+2 usage patterns, validation across diverse use cases (YouTube, NanoBanana, SupportSignal, Storyline, Klueless)
```

**Effort**: 20 minutes

---

## 🔮 **Phase 2 Documentation Updates (AFTER EPIC 4)**

### 8. Create Multi-Workflow Usage Guide

**File**: `docs/guides/multi-workflow-guide.md` (NEW)

**Content**: Complete usage guide (drafted in Story 4.9, Task 8)

**Sections**:
1. Introduction (What is Multi-Workflow Support)
2. When to Use Multiple Workflows
3. Setting Up Workflows (config guide)
4. Reference Materials (multiple sources, priority)
5. Shared Resources (cross-workflow prompts/schemas)
6. Workflow Definitions (creating workflow-definition.yaml)
7. Example Workflows (YouTube, NanoBanana, SupportSignal)
8. Migration Guide (flat workspace → multi-workflow)
9. Troubleshooting
10. Advanced Usage

**Effort**: 60 minutes (Phase 2)

---

## ✅ **Validation Checklist**

After completing all updates:

- [ ] All 8 files updated
- [ ] Story 3.8 added to Epic 3 in epic-details.md
- [ ] Story 4.9 added to Epic 4 in epic-details.md
- [ ] WorkflowDefinition model updated with ReferenceConfig array
- [ ] Config file has multi-workflow examples and comments
- [ ] Penny agent has workflow commands documented
- [ ] Future Enhancements reflects Phase 1+2 completion
- [ ] Epic 9 description updated with advanced features scope
- [ ] No broken references or outdated information
- [ ] All examples use consistent naming (youtube-launch-optimizer, nano-banana)

---

## 📊 **Update Sequence Recommendation**

**Do in this order** (dependencies):

1. ✅ **PRD Epic List** (5 min) - Overview changes
2. ✅ **Architecture Data Models** (20 min) - WorkflowDefinition + ReferenceConfig
3. ✅ **Config File** (15 min) - Add workflow examples
4. ✅ **Prompt Engineer Agent** (10 min) - Add commands
5. ✅ **Architecture Components** (15 min) - Update agents section
6. ✅ **PRD Epic Details** (30 min) - Add Story 3.8 and 4.9 (copy from files)
7. ✅ **Future Enhancements** (20 min) - Update Enhancement #11 status
8. 🔮 **Multi-Workflow Guide** (60 min) - PHASE 2 only (after Epic 4)

**Total Phase 1 Effort**: ~2 hours
**Total Phase 2 Effort**: ~1 hour (mostly new guide)

---

## 🎯 **Who Does What**

**Option A: User Does It** (~2-3 hours)
- Follow this checklist sequentially
- Copy-paste from story files for epic-details.md
- Test by activating Penny and running workflow commands

**Option B: Dev Agent Does It** (~2-3 hours)
- Load this checklist as task list
- Execute each update with validation
- Commit with message: "docs: add multi-workflow support (Stories 3.8, 4.9)"

**Option C: We Do It Together** (~2-3 hours)
- I guide you through each file
- You approve changes before applying
- We validate together

**Recommendation**: Option B (Dev agent) - Most efficient, least error-prone

---

**End of Documentation Updates Checklist**
