# Documentation Updates - Multi-Workflow Support (CORRECTED)

**Date**: 2026-01-12
**Purpose**: Track documentation updates from course correction (BMAD-compliant)
**Estimated Total Effort**: 2-3 hours

---

## ⚠️ **BMAD-Compliant Approach**

**What Changed from Original**:
- ❌ **REMOVED**: Creating full story.md files (3.8.story.md, 4.9.story.md)
- ✅ **CORRECT**: Adding story DESCRIPTIONS to epic-details.md only
- ✅ Stories will be created on-demand by SM agent using `*draft` command

**BMAD Story Creation Flow**:
1. Course correction identifies need for stories ✅
2. Add story descriptions to epic-details.md ✅
3. When ready: Load SM agent and draft story on-demand ✅
4. SM creates full story file using elicitation workflow ✅

---

## 📊 **Quick Summary**

| Category | Files to Update | Effort |
|----------|----------------|--------|
| **PRD** | 2 files | 45 min |
| **Architecture** | 2 files | 45 min |
| **Config** | 1 file | 15 min |
| **Agents** | 1 file | 15 min |
| **Future Enhancements** | 1 file | 20 min |
| **TOTAL** | **7 files** | **~2.5 hours** |

---

## 📝 **Documentation Updates**

### 1. Update Epic List

**File**: `docs/prd/epic-list.md`

**Line 11** (after Epic 3 description):
```markdown
## Epic 3: Prompt Engineer Agent & Core Workflows

Create the first agent (Prompt Engineer) with workflows for new prompt creation, refinement, testing, and validation—enabling the primary user journey. **Includes multi-workflow foundation (Story 3.8)** to support multiple independent workflows within one workspace.
```

**Line 16** (Epic 4 description):
```markdown
## Epic 4: YouTube Automation Workflow (System Validation)

Validate POEM's core capabilities through the YouTube Launch Optimizer workflow—a real multi-prompt pipeline that transforms video transcripts into complete launch assets (titles, descriptions, chapters, thumbnails, tags, social posts). This epic tests schema extraction, template chaining, mock data generation, Handlebars helpers, progressive data accumulation, and human-in-the-loop patterns using 53 production templates across 11 workflow sections. **Benefits from multi-workflow support** to test multiple workflows (YouTube Launch vs Video Planning vs NanoBanana) in parallel. **Includes multi-workflow polish (Story 4.9)** to finalize reference integration based on B72 learnings.
```

**After Epic 7, update Epic 9**:
```markdown
## Epic 9: Multi-Workflow Support (Future)

**Status**: 📋 Requirements Complete, Foundation Validated
**Target**: POEM v2.0 (Q2-Q3 2026)

**Foundation**: Stories 3.8 (Phase 1) and 4.9 (Phase 2) deliver production-ready multi-workflow prototype validated through Epic 4.

**What Epic 9 Adds**: Advanced features beyond prototype:
- Visual workflow editor and designer
- Auto-sync reference materials from git repositories
- Cross-workflow analytics and insights
- Workflow templates and marketplace
- Advanced validation (step I/O compatibility checking)
- Workflow execution orchestration
- CI/CD integration for workflow testing

**Dependencies**: Prototype validation through Epic 3-4, community feedback on usage patterns

**Tracking**: `docs/future-enhancements.md` (Enhancement #11)
```

**Effort**: 15 minutes

---

### 2. Add Story Descriptions to Epic Details

**File**: `docs/prd/epic-details.md`

**After Story 3.7** (around line 354, BEFORE "## Epic 4"):

```markdown
---

### Story 3.8: Multi-Workflow Foundation (Phase 1)

As a prompt engineer,
I want to work with multiple independent workflows within one POEM workspace,
so that I can manage distinct prompt collections (YouTube Launch, Video Planning, NanoBanana) with workflow-specific context while sharing common resources.

**Acceptance Criteria**:

1. Workflow-scoped directory structure created in `dev-workspace/workflows/<name>/`
2. Config system extended to support `currentWorkflow` and workflow definitions
3. Workflow configuration includes: prompts path, schemas path, reference paths (array)
4. Config service resolves workflow-scoped paths based on active workflow
5. Penny gains `*workflows` command to list available workflows
6. Penny gains `*switch <workflow>` command to change active context
7. Penny gains `*context` command to show current workflow info
8. Existing Penny commands (`*list`, `*new`, `*view`) operate in workflow-scoped context
9. Prompts created in workflow A don't appear when switched to workflow B
10. Schemas scoped to workflow directories
11. Can switch between workflows without restarting server or agent
12. Active workflow persists across Penny sessions
13. Workflow config supports reference paths as **array** (multiple sources)
14. Reference path types supported: `local`, `second-brain`
15. `*context` command displays available reference paths
16. WorkflowDefinition model documented in architecture
17. Workflow config structure documented with comments
18. Phase 1 limitations documented (what's deferred to Phase 2)

**Phase Note**: Phase 1 (4-6 hours) delivers foundation for Epic 4 testing. Phase 2 (Story 4.9) adds polish and integration based on Epic 4 learnings.

**Related**: Course correction `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`

---
```

**After Story 4.8** (around line 542, BEFORE "## Epic 6"):

```markdown
---

### Story 4.9: Multi-Workflow Polish & Integration (Phase 2)

As a prompt engineer,
I want reference materials and shared resources integrated with multi-workflow context,
so that Penny can provide context-aware guidance using workflow-specific knowledge and detect cross-workflow resource usage.

**Acceptance Criteria**:

1. Penny can load and display reference materials from configured paths (array)
2. Reference loading supports multiple types: `local`, `second-brain`, `external`
3. Priority system used when same document exists in multiple sources
4. `*context --reference` command displays available reference documents
5. Reference documents viewable from Penny (e.g., `*view-reference api-docs.md`)
6. Shared prompts directory (`dev-workspace/shared/prompts/`) functional
7. Shared schemas directory functional
8. Penny detects when prompt is shared across workflows
9. `*list --shared` shows shared prompts with workflow usage info
10. Creating/editing shared prompt shows multi-workflow impact warning
11. Workflow definition file format finalized based on B72 learnings
12. `workflow-definition.yaml` structure documented
13. Workflow definitions include: name, description, sections, steps, I/O contracts
14. YouTube Launch Optimizer workflow definition created as reference
15. Workflow definitions loaded by config service
16. `*workflows --verbose` shows detailed workflow info
17. `*context --sections` displays workflow sections/steps (if definition exists)
18. `*switch <workflow>` validates workflow definition and warns about missing files
19. Better error messages and validation for workflow commands
20. When creating new prompt, Penny suggests related reference materials
21. When refining prompt, Penny references workflow-specific best practices
22. Multi-workflow usage guide created
23. Example workflows documented (YouTube, NanoBanana, SupportSignal)
24. Migration guide for converting flat workspace to multi-workflow
25. Phase 2 completion notes document learnings for Epic 9

**Epic 4 Integration**: This story applies learnings from B72 workflow validation (Stories 4.1-4.8) to finalize workflow definition format and reference integration patterns discovered during real 53-prompt workflow testing.

**Effort**: 4-6 hours (after Epic 4 validation complete)

**Related**: Story 3.8 (Phase 1 foundation), Enhancement #11 (Future Enhancements)

---
```

**Effort**: 15 minutes (mostly copy-paste)

---

### 3. Update Data Models Architecture

**File**: `docs/architecture/data-models.md`

**Find section**: "Workflow Definition (Future - Epic 9)" (around line 250-384)

**Replace status line**:
```markdown
## Workflow Definition

**Purpose:** Define a multi-prompt workflow with orchestration logic, sections, and step dependencies.

**Status**: ✅ **Phase 1 Structure Defined** (Story 3.8), ✅ **Phase 2 Integration** (Story 4.9). See course correction `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md` for background.
```

**Update WorkflowDefinition interface** (around line 260):
```typescript
interface WorkflowDefinition {
  name: string;
  description: string;
  version: string;
  sections: WorkflowSection[];

  /** Reference material sources (can be multiple) */
  reference?: ReferenceConfig[];  // ✅ ARRAY of sources
}

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

**Add multi-source example** (after WorkflowDefinition interfaces):
```yaml
# Example: NanoBanana workflow with multiple reference sources
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

  # External documentation (future - Story 4.9)
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

### 4. Update Components Architecture

**File**: `docs/architecture/components.md`

**Find**: "Component: Agents (poem-core)" section (around line 10-30)

**After agents table, replace future enhancement note**:

```markdown

**Workflow Context Awareness** (✅ Stories 3.8, 4.9):

Agents support **workflow-scoped context**, enabling operation across multiple independent workflows within one workspace.

**Capabilities**:
- **Workflow Switching**: Penny has `*workflows`, `*switch <workflow>`, `*context` commands
- **Scoped Operations**: All commands operate in current workflow context
- **Reference Integration**: Access to workflow-specific reference materials from multiple sources (Story 4.9)
- **Shared Resources**: Detection and management of cross-workflow prompts/schemas (Story 4.9)

**Example**:
```
*workflows                    # List all workflows
*switch nano-banana           # Change to NanoBanana workflow
*context                      # Show current workflow info
*list                         # Lists nano-banana prompts only
```

**Configuration**: See `packages/poem-core/poem-core-config.yaml`

**Background**: Course correction `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`

---
```

**Effort**: 15 minutes

---

### 5. Update Config File

**File**: `packages/poem-core/poem-core-config.yaml`

**After line 40** (after production workspace paths comment), **add**:

```yaml
# ============================================================================
# MULTI-WORKFLOW SUPPORT (Stories 3.8, 4.9)
# ============================================================================
#
# POEM supports multiple independent workflows within one workspace.
# Each workflow has its own prompts, schemas, mock data, and reference materials.
#
# To enable (after Story 3.8 implementation):
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
#   - local: Relative to project (data/nano-banana/)
#   - second-brain: Absolute path (/ad/brains/nano-banana/)
#   - external: URL (future - Story 4.9)
#   - git-repo: Git repository URL (future - Story 4.9)
#
# Priority System (Story 4.9):
#   - Higher priority wins conflicts (same filename in multiple sources)
#   - Default: 10, Typical: local=10, second-brain=20, external=5
#
# Workflow Commands (Story 3.8):
#   Activate Penny: /poem/agents/penny
#   List workflows: *workflows
#   Switch workflow: *switch <name>
#   Show context: *context
#
# See: docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md
# ============================================================================
```

**Effort**: 15 minutes

---

### 6. Update Prompt Engineer Agent

**File**: `packages/poem-core/agents/prompt-engineer.md`

**Find commands section** (around line 53-62)

**Update commands list**:
```yaml
commands:
  - help: Show numbered list of the following commands to allow selection
  - list: List all available prompts in current workflow with rich metadata (usage: *list or *list --shared)
  - view: Display a specific prompt template with rich metadata (usage: *view <prompt-name>)
  - new: Execute workflow new-prompt.yaml to create a new prompt with schema in current workflow
  - refine: Execute workflow refine-prompt.yaml to iteratively improve an existing prompt
  - test: Execute workflow test-prompt.yaml to test a prompt with mock or provided data
  - validate: Execute workflow validate-prompt.yaml to validate prompt structure and quality
  - workflows: List all available workflows in workspace (usage: *workflows or *workflows --verbose) [Story 3.8]
  - switch: Change to a different workflow context (usage: *switch <workflow-name>) [Story 3.8]
  - context: Show current workflow information, reference materials, and paths (usage: *context, *context --reference, *context --sections) [Stories 3.8, 4.9]
  - exit: Say goodbye as the Prompt Engineer, and then abandon inhabiting this persona
```

**Add note after commands**:
```yaml
# Multi-Workflow Support:
#   Story 3.8: Basic workflow commands (workflows, switch, context)
#   Story 4.9: Enhanced commands (--verbose, --reference, --sections, --shared)
#   Configuration: packages/poem-core/poem-core-config.yaml
```

**Effort**: 10 minutes

---

### 7. Update Future Enhancements

**File**: `docs/future-enhancements.md`

**Find Enhancement #11** (around line 63)

**Update status**:
```markdown
### 11. Multi-Workflow Support (Workspace Context Architecture)

**Status**: 🔄 **In Progress** → Story 3.8 (Phase 1) ready for SM drafting, Story 4.9 (Phase 2) after Epic 4
**Target**: POEM v1.1 (Phase 1+2) → v2.0 (Epic 9 advanced features)
**Discovered**: 2026-01-12 (Story 3.7.1 testing with NanoBanana)
**Course Correction**: `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`
```

**Add "Implementation Plan" section** (after "What"):
```markdown
**Implementation Plan**:

**Phase 1 - Story 3.8** (4-6 hours, Epic 3):
- ✅ Workflow-scoped directory structure
- ✅ Config system with workflow definitions
- ✅ Basic workflow commands: `*workflows`, `*switch`, `*context`
- ✅ Reference config structure (array support)
- ✅ Path resolution and isolation
- ⏭️ Ready for SM to draft when user starts Story 3.8

**Phase 2 - Story 4.9** (4-6 hours, after Epic 4):
- 🔮 Reference materials loading from multiple sources
- 🔮 Priority-based conflict resolution
- 🔮 Shared resource detection
- 🔮 Workflow definition format (based on B72 learnings)
- 🔮 Enhanced commands (--verbose, --reference, --sections, --shared)
- 🔮 Context-aware assistance
- ⏭️ SM will draft after Epic 4 validation complete

**Epic 9 - Future** (Q2-Q3 2026):
- 🔮 Visual workflow editor
- 🔮 Auto-sync from git repositories
- 🔮 Cross-workflow analytics
- 🔮 Workflow templates/marketplace
- 🔮 CI/CD integration
```

**Key Insight** section:
```markdown
**Key User Insight** (2026-01-12):
> "Reference material could come from more than one directory... it's almost like an array."

Led to `reference: ReferenceConfig[]` array architecture supporting multiple sources (local, second-brain, external) with priority-based conflict resolution.
```

**Effort**: 20 minutes

---

## ✅ **Validation Checklist**

After updates:

- [ ] All 7 files updated (NOT 8 - no story files created)
- [ ] Story 3.8 description added to epic-details.md (NOT full story)
- [ ] Story 4.9 description added to epic-details.md (NOT full story)
- [ ] WorkflowDefinition model updated with ReferenceConfig array
- [ ] Config file has multi-workflow examples (commented out until Story 3.8)
- [ ] Penny agent commands list updated
- [ ] Future Enhancements shows SM will draft stories on-demand
- [ ] Epic 9 updated with Phase 1+2 context
- [ ] No full story.md files created (BMAD compliance)

---

## 📊 **Update Sequence**

**Do in order**:

1. ✅ **Epic List** (15 min)
2. ✅ **Epic Details** (15 min) - Story descriptions only
3. ✅ **Data Models** (20 min)
4. ✅ **Components** (15 min)
5. ✅ **Config File** (15 min)
6. ✅ **Penny Agent** (10 min)
7. ✅ **Future Enhancements** (20 min)

**Total**: ~2 hours

---

## 🎯 **BMAD Story Creation (After Documentation)**

When ready for Story 3.8:

```
1. Load SM agent: /BMad/agents/sm
2. SM: *draft
3. SM will ask: Which epic?
4. User: Epic 3
5. SM will see Story 3.8 description in epic-details.md
6. SM will elicit details and create full docs/stories/3.8.story.md
```

When ready for Story 4.9 (after Epic 4):

```
1. Load SM agent: /BMad/agents/sm
2. SM: *draft
3. User: Epic 4
4. SM will see Story 4.9 description in epic-details.md
5. SM creates full story based on Epic 4 learnings
```

---

**End of Corrected Documentation Updates**
