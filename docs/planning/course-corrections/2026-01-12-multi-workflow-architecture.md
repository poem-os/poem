# Sprint Change Proposal: Multi-Workflow Architecture Gap

**Date**: 2026-01-12
**Trigger**: NanoBanana testing revealed architectural limitation
**Change Agent**: Claude (Course Correct Task - YOLO Mode)
**Status**: 🟡 Awaiting User Approval

---

## Executive Summary

**Issue**: POEM's architecture lacks support for **multiple workflows within a single workspace**. Current design assumes one workspace = one flat set of prompts/schemas, but real-world usage requires multiple independent workflows (YouTube Launch, Video Planning, NanoBanana, SupportSignal) sharing a workspace while maintaining isolation and workflow-specific context.

**Recommended Path**: **Document as architectural gap, add to future enhancements, continue with workaround** (Option 1). User constraints: "important but future," "if we get a little bit wrong now it won't matter too much," "fast flow."

**Impact Level**: 🟡 **Medium** - No immediate MVP blocker, but critical for real-world usage patterns.

---

## Section 1: Change Context & Trigger Analysis

### Triggering Event

**Story**: Story 3.7.1 (Refactor to Unified Schema Structure) - just completed, ready for review
**Discovery Phase**: Testing Penny (Prompt Engineer agent) on NanoBanana data source
**Observer**: User (David)

### Core Problem Definition

**Issue Type**: ✅ Newly discovered architectural limitation (not present in original PRD/Architecture)

**Precise Problem Statement**:

POEM's current architecture assumes:
- **One workspace** = **one set of prompts/schemas/data**
- **Flat directory structure**: `dev-workspace/prompts/`, `dev-workspace/schemas/`
- **Single workflow context**: Penny is implicitly tied to one workflow (e.g., youtube-launch-optimizer)

**Real-world requirement** (discovered via NanoBanana):
- **One workspace** should support **multiple workflows**
- Each workflow has:
  - Its own prompts collection (e.g., 54 prompts for YouTube Launch, different set for Video Planning)
  - Its own schemas and data contracts
  - Its own source-of-truth reference materials (API docs, domain knowledge)
  - Workflow definition (orchestration logic, node dependencies)
  - **Shared/reusable components** (some prompts used across workflows)

**Example**:

```
YouTube Content Creation Workspace
│
├── Workflow 1: YouTube Launch Optimizer
│   ├── Source: Video transcript (post-production)
│   ├── Goal: Not published → Published
│   ├── Prompts: 54 templates (chapters, titles, descriptions, thumbnails, articles)
│   └── Reference: Brand configs, style guides
│
├── Workflow 2: Video Planning
│   ├── Source: Content idea (pre-production)
│   ├── Goal: Concept → Ready to record
│   ├── Prompts: Different set (title generator, outline, script, talking points)
│   └── Reference: Content strategy docs
│
└── Shared Components:
    └── generate-title.hbs (used by both workflows, different contexts)
```

### Evidence

**User Quote** (from conversation):
> "I realized that Penny was tied fairly intimately to the YouTube optimiser workflow. And I'm going, well, how do I test her on Nano Banana, keeping in mind that Nano Banana isn't even part of this workspace if this was a real application."

**Real-world datasets** (already in `data/`):
- `youtube-launch-optimizer/` - 54 prompts, 9 sections, post-production workflow
- `nano-banana/` - Image generation workflow, JSON prompting, different domain
- `supportsignal/` - Narrative enhancement, question generation, NDIS domain
- `storyline/` - Character schemas, transcript-to-storyline transformations

**Problem manifestation**:
- Cannot test Penny on NanoBanana without mixing workflows
- No way to switch workflow context (no `*switch nano-banana` command)
- No isolation between workflow prompts/schemas
- Reference materials in `data/nano-banana/` are invisible to Penny

### Initial Impact Assessment

**Observed Consequences**:
- ❌ Cannot test agent on multiple workflows without manual workarounds
- ❌ Penny doesn't know which workflow she's operating within
- ❌ No way to access workflow-specific reference materials
- ❌ Prompts from different workflows get mixed together in flat structure
- ❌ No workflow definition/orchestration visible to agents

**Blockers**:
- Testing NanoBanana prompts requires manual subdirectory workaround
- Cannot validate POEM pattern generalizes across use cases
- Cannot demonstrate multi-workflow support to users

---

## Section 2: Epic Impact Assessment

### Current Epic Status

**Epic 3**: Prompt Engineer Agent & Core Workflows
**Status**: ✅ **Complete** (Story 3.7.1 just finished, ready for review)
**Stories**: 3.1 - 3.7.1 (all done)

**Can Epic 3 be completed?** ✅ **YES** - Epic 3 is effectively complete. Multi-workflow support is not an Epic 3 requirement.

### Future Epics Impact Analysis

| Epic | Title | Impact | Notes |
|------|-------|--------|-------|
| **Epic 4** | YouTube Automation Workflow | 🟡 **AFFECTED** | Will need workflow-scoped context for B72 testing. Can workaround with manual subdirectories. |
| **Epic 5** | System Agent & Helper Generation | 🟢 **LOW** | System Agent operates at framework level, not workflow level |
| **Epic 6** | Integration Agent & Provider Pattern | 🟡 **AFFECTED** | May need workflow-specific provider configs |
| **Epic 7** | Mock/Test Data Agent | 🟡 **AFFECTED** | Mock data generation should be workflow-scoped |
| **Epic 8** | BMAD Integration (Future) | 🟢 **NOT AFFECTED** | Victor pattern already documented, not dependent on multi-workflow |

### New Epics Needed

✅ **YES** - Propose **Epic 9: Multi-Workflow Support**

**Justification**:
- Not part of original PRD scope (focused on single-workflow MVP)
- Significant architectural change (config, agents, workspace structure)
- Real-world usage pattern discovered during development
- Fits naturally after Epic 7 (Mock/Test Data Agent) and before Epic 8 (BMAD Integration)

### Epic Sequence Changes

**Current Sequence**: Epic 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 (BMAD)
**Proposed Sequence**: Epic 1 → 2 → 3 → 4 → 5 → 6 → 7 → **9 (Multi-Workflow)** → 8 (BMAD)

**Rationale**: Multi-workflow support should come before BMAD integration since it affects core architecture.

---

## Section 3: Artifact Conflict & Impact Analysis

### PRD Conflicts

**File**: `docs/prd.md` and `docs/prd/goals-and-background-context.md`

**Current PRD Statement**:
> "For multi-project support, users can install POEM in separate project directories with isolated workspaces."

**Conflict**: PRD mentions **multi-project** (separate POEM installations) but not **multi-workflow** (within one workspace).

**Required Update**:
- Add clarification: "Multi-project = separate installations; Multi-workflow = workflows within one workspace"
- Document multi-workflow as future enhancement

**File**: `docs/prd/epic-list.md`

**Conflict**: Epic list (1-8) doesn't include multi-workflow support.

**Required Update**:
- Add **Epic 9: Multi-Workflow Support** to epic list
- Update Epic 8 numbering if needed

---

### Architecture Conflicts

**File**: `packages/poem-core/poem-core-config.yaml`

**Current State**:
```yaml
workspace:
  prompts: dev-workspace/prompts          # Flat structure
  schemas: dev-workspace/schemas
  mockData: dev-workspace/mock-data
  config: dev-workspace/config
  workflowData: dev-workspace/workflow-data
```

**Conflict**: Assumes flat workspace structure. No concept of workflow-scoped paths.

**Proposed Future Structure** (Epic 9):
```yaml
workspace:
  # Multi-workflow support
  workflows:
    youtube-launch-optimizer:
      prompts: dev-workspace/workflows/youtube-launch-optimizer/prompts
      schemas: dev-workspace/workflows/youtube-launch-optimizer/schemas
      reference: data/youtube-launch-optimizer/
    nano-banana:
      prompts: dev-workspace/workflows/nano-banana/prompts
      schemas: dev-workspace/workflows/nano-banana/schemas
      reference: data/nano-banana/

  # Shared resources
  shared:
    prompts: dev-workspace/shared/prompts
    schemas: dev-workspace/shared/schemas
```

**Required Update**: Document this as future architecture in `docs/architecture/components.md` and `docs/future-enhancements.md`.

---

**File**: `docs/architecture/components.md`

**Section**: Component: Agents (poem-core)

**Conflict**: Agents section doesn't mention workflow context awareness.

**Required Update**:
- Add note: "Future: Agents will support workflow-scoped context (Epic 9)"
- Document current limitation

---

**File**: `docs/architecture/data-models.md`

**Section**: WorkflowData

**Current Model**:
```typescript
interface WorkflowData {
  id: string;
  workflowName: string;  // ← Exists but not enforced
  executedTemplates: ExecutionRecord[];
  data: Record<string, unknown>;
}
```

**Conflict**: `workflowName` field exists but no workflow definition or context system.

**Required Update**:
- Add note about future workflow definition model
- Document that current `workflowName` is a placeholder

---

### Frontend Spec Impact

**Not Applicable** - POEM has no frontend UI currently (Astro server + CLI agents only).

---

### Other Artifacts Impact

**File**: `packages/poem-core/agents/prompt-engineer.md`

**Section**: Agent commands

**Conflict**: Penny has no `*switch` or `*workflows` commands for context switching.

**Required Update**: Document as future enhancement (Epic 9).

---

**Files in `data/`**:
- `youtube-launch-optimizer/` - Contains workflow definition (`youtube-launch-optimizer.yaml`)
- `nano-banana/` - Has reference materials but no workflow definition file
- `supportsignal/` - Has prompts/schemas but no workflow definition
- `storyline/` - Has data but no workflow definition

**Conflict**: Inconsistent workflow definition patterns across data sources.

**Required Update**:
- Document workflow definition format in `docs/architecture/data-models.md` (future)
- Create example workflow definition templates

---

### Summary of Artifacts Requiring Updates

| Artifact | Update Type | Priority | Effort |
|----------|-------------|----------|--------|
| `docs/prd/epic-list.md` | Add Epic 9 | High | 5 min |
| `docs/future-enhancements.md` | Add multi-workflow enhancement | High | 15 min |
| `docs/architecture/components.md` | Add workflow context note | Medium | 10 min |
| `docs/architecture/data-models.md` | Add workflow definition model (future) | Medium | 15 min |
| `packages/poem-core/poem-core-config.yaml` | Add comment about future structure | Low | 5 min |
| `packages/poem-core/agents/prompt-engineer.md` | Add note about future commands | Low | 5 min |

**Total Effort**: ~55 minutes of documentation updates

---

## Section 4: Path Forward Evaluation

### Option 1: Document as Gap, Add to Roadmap (⭐ **RECOMMENDED**)

**Approach**:
- Document multi-workflow support as architectural gap
- Add as **Enhancement #11** in `docs/future-enhancements.md` (high priority)
- Add as **Epic 9** in `docs/prd/epic-list.md`
- Continue testing with **workaround**: Manual subdirectories in `dev-workspace/`
- User can test NanoBanana using `dev-workspace/nano-banana/` subdirectory pattern

**Pros**:
- ✅ Minimal immediate effort (~1 hour documentation)
- ✅ No work thrown away (all Epic 3 code remains valid)
- ✅ Fits user's "important but future" constraint
- ✅ Allows continued progress on Epic 4 (YouTube validation)
- ✅ Proper planning time for architectural changes
- ✅ Can validate pattern with multiple use cases before building

**Cons**:
- ❌ Manual workaround required for NanoBanana testing
- ❌ Penny doesn't have workflow awareness yet
- ❌ User must manage subdirectories manually

**Effort**: ~1 hour (documentation updates only)

**Risks**: 🟢 **LOW** - No code changes, no breaking changes, user can work around limitation

**Sustainability**: ✅ **HIGH** - Documents problem, provides clear path forward, doesn't create technical debt

**Timeline Impact**: ⏱️ **NONE** - Continue with Epic 4 immediately

---

### Option 2: Implement Multi-Workflow Support Now

**Approach**:
- Pause Epic 4 (YouTube validation)
- Design and implement workflow-scoped architecture immediately
- Refactor config system, agents, workspace structure
- Add `*workflows`, `*switch` commands to Penny
- Test thoroughly before continuing

**Pros**:
- ✅ Solves problem immediately
- ✅ Clean architecture from the start
- ✅ No workarounds needed

**Cons**:
- ❌ **HIGH effort** (~40-60 hours / 5-7 full days)
- ❌ Blocks progress on Epic 4 (YouTube validation)
- ❌ Violates user's "fast flow" constraint
- ❌ May over-engineer before validating pattern with real use cases
- ❌ Significant refactoring risk (config, agents, paths, tests)

**Effort**: ~40-60 hours (design + implementation + testing + documentation)

**Risks**: 🔴 **HIGH** - Major refactoring, breaks existing code, high testing burden

**Sustainability**: ⚠️ **UNCERTAIN** - May design wrong abstraction before understanding full requirements

**Timeline Impact**: ⏱️ **MAJOR DELAY** - 1-2 weeks before resuming Epic 4

---

### Option 3: Prototype Minimal Workflow Switching

**Approach**:
- Add basic `*workflows` and `*switch <workflow>` commands to Penny
- Use subdirectories: `dev-workspace/workflows/<workflow-name>/`
- Minimal changes to config (add `currentWorkflow` state)
- Document pattern for formal implementation in Epic 9

**Pros**:
- ✅ Provides immediate workflow switching capability
- ✅ Moderate effort (~8-12 hours / 1-1.5 days)
- ✅ Validates pattern before full implementation
- ✅ User can test NanoBanana cleanly

**Cons**:
- ❌ Partial solution (not full workflow-scoped architecture)
- ❌ May create technical debt if not done carefully
- ❌ Still requires Epic 9 for complete solution
- ⚠️ Risk of premature abstraction

**Effort**: ~8-12 hours (prototype + testing + documentation)

**Risks**: 🟡 **MEDIUM** - Could create tech debt, may need refactoring later

**Sustainability**: ⚠️ **MEDIUM** - Prototype could become permanent workaround

**Timeline Impact**: ⏱️ **1-2 DAYS DELAY** - Brief pause before Epic 4

---

### Recommended Path: **Option 1** (Document as Gap)

**Rationale**:
1. **User constraints**: "important but future," "fast flow," "if we get a little bit wrong now it won't matter"
2. **Low risk**: No code changes, no breaking changes
3. **Clean separation**: Document now, design properly later with more data
4. **No wasted work**: All Epic 3 code remains valid
5. **Validation opportunity**: Test pattern with workaround before committing to architecture
6. **Timeline**: Allows immediate progress on Epic 4

**User can proceed with**:
- Manual subdirectories: `dev-workspace/nano-banana/`, `dev-workspace/youtube-launch-optimizer/`
- Penny operates in each subdirectory context
- Reference materials in `data/<workflow>/` accessible manually

**When to implement** (Epic 9 timing):
- After Epic 4 validation (prove B72 workflow works end-to-end)
- After collecting requirements from multiple use cases (YouTube, NanoBanana, SupportSignal, Storyline)
- Q2-Q3 2026 (POEM v1.1 or v2.0)

---

## Section 5: Proposed Artifact Edits

Below are the specific changes to implement **Option 1** (Document as Gap).

---

### Edit 1: Add Epic 9 to Epic List

**File**: `docs/prd/epic-list.md`

**Location**: After Epic 7, before Epic 8

**Change Type**: Addition

**Proposed Edit**:

```markdown
## Epic 9: Multi-Workflow Support

**Status**: 📋 Planned (Future Enhancement)
**Target**: POEM v1.1 - v2.0 (Q2-Q3 2026)

Build workflow-scoped architecture to support multiple independent workflows within a single POEM workspace. Enable users to manage distinct prompt collections (YouTube Launch, Video Planning, NanoBanana, SupportSignal) with workflow-specific context, reference materials, and shared components.

**Key Capabilities**:
- Workflow definition format (YAML or config-based)
- Workflow-scoped workspace structure (`dev-workspace/workflows/<name>/`)
- Agent workflow context awareness (Penny knows which workflow she's operating in)
- Workflow switching commands (`*workflows`, `*switch <workflow>`)
- Shared resource management (prompts/schemas used across workflows)
- Workflow-specific reference materials integration

**Why**: Real-world usage patterns require multiple workflows per workspace. Users have different prompt collections for different use cases (post-production vs pre-production, different domains), but want them managed in one POEM installation.

**Example Use Cases**:
- YouTube Creator: Launch Optimizer workflow (54 prompts) + Video Planning workflow (different prompts)
- AppyDave: NanoBanana image generation + Storyline narrative generation + SupportSignal analysis
- Agency: Multiple client workflows in one POEM instance

**Dependencies**:
- Epic 7 complete (all agents operational)
- Validation of pattern through Epic 4 (B72 workflow)
- Requirements collected from multiple use cases

**Effort Estimate**: 40-60 hours (design + implementation + testing)

**Discovery**: Identified during Story 3.7.1 when testing Penny on NanoBanana data source

---
```

---

### Edit 2: Add Enhancement #11 to Future Enhancements

**File**: `docs/future-enhancements.md`

**Location**: After Enhancement #2 (Agent Task Format Alignment), before Medium Priority section

**Change Type**: Addition

**Proposed Edit**:

```markdown
---

### 11. Multi-Workflow Support (Workspace Context Architecture)

**Status**: 💡 Idea → 📋 Requirements Gathering
**Target**: POEM v1.1 - v2.0 (Q2-Q3 2026)
**Epic**: Future Epic 9
**Discovered**: 2026-01-12 (Story 3.7.1 testing with NanoBanana)

**What**: Build workflow-scoped architecture to support multiple independent workflows within a single POEM workspace.

**Why**: Current POEM architecture assumes one workspace = one flat set of prompts/schemas/data. Real-world usage requires multiple workflows (YouTube Launch, Video Planning, NanoBanana, SupportSignal) sharing a workspace while maintaining isolation and workflow-specific context.

**The Problem**:

Users have multiple distinct workflows with:
- Different prompt collections (54 prompts for YouTube Launch vs different set for Video Planning)
- Different schemas and data contracts
- Different source-of-truth reference materials (API docs, domain knowledge)
- Different workflow orchestration logic
- Some shared components (e.g., `generate-title` used by both workflows)

**Current State** (discovered during NanoBanana testing):
```
dev-workspace/
├── prompts/           # ❌ All prompts mixed together
├── schemas/           # ❌ All schemas mixed together
└── mock-data/         # ❌ No workflow isolation
```

**Desired State** (Epic 9):
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
│   └── video-planning/
│       ├── prompts/
│       ├── schemas/
│       └── mock-data/
└── shared/           # Shared components
    ├── prompts/
    └── schemas/
```

**Key Features**:

1. **Workflow Definition Format**:
   ```yaml
   # workflow-definition.yaml
   name: youtube-launch-optimizer
   description: Post-production video optimization pipeline
   version: 1.0.0
   sections:
     - name: Video Preparation
       steps:
         - id: configure
           prompt: prompts/1-1-configure.hbs
           inputs: [projectFolder, transcript]
           outputs: [projectCode, shortTitle]
   reference: data/youtube-launch-optimizer/
   ```

2. **Agent Workflow Awareness** (Penny):
   ```
   *workflows              # List all workflows in workspace
   *switch nano-banana     # Change active workflow context
   *context                # Show current workflow info

   # All commands now workflow-scoped:
   *list                   # Lists nano-banana prompts only
   *new                    # Creates prompt in nano-banana/prompts/
   *view                   # Searches nano-banana prompts first
   ```

3. **Config System Updates**:
   ```yaml
   # poem-core-config.yaml
   workspace:
     currentWorkflow: nano-banana  # Active context
     workflows:
       youtube-launch-optimizer:
         definition: data/youtube-launch-optimizer/youtube-launch-optimizer.yaml
         prompts: dev-workspace/workflows/youtube-launch-optimizer/prompts
         reference: data/youtube-launch-optimizer/
       nano-banana:
         definition: data/nano-banana/nano-banana-workflow.yaml
         prompts: dev-workspace/workflows/nano-banana/prompts
         reference: data/nano-banana/
   ```

4. **Shared Resource Management**:
   - Some prompts used across workflows (e.g., `generate-title`)
   - Shared schemas for common data types
   - Workflow-specific overrides

5. **Reference Material Integration**:
   - Penny can access workflow-specific docs in `data/<workflow>/reference/`
   - Context-aware prompt suggestions
   - Domain-specific validation

**Example Use Case** (What Triggered Discovery):

AppyDave testing NanoBanana:
- Has existing YouTube Launch Optimizer workflow (54 prompts, post-production)
- Wants to add NanoBanana workflow (image generation, different domain)
- Needs Video Planning workflow (pre-production, different prompts)
- Some prompts shared (title generation), some unique

**Current Workaround** (Until Epic 9):
- Manual subdirectories: `dev-workspace/nano-banana/`, `dev-workspace/youtube-launch-optimizer/`
- Penny operates in each subdirectory context manually
- User manages workflow switching via directory navigation

**Dependencies**:
- Epic 3 complete (Penny operational) ✅
- Epic 4 validation (proves B72 workflow end-to-end)
- Requirements from multiple use cases (YouTube, NanoBanana, SupportSignal, Storyline)
- Understanding of workflow orchestration needs

**Effort Estimate**: 40-60 hours (5-7 full days)

**Breakdown**:
- Design workflow definition format: 6-8 hours
- Extend config system: 8-12 hours
- Add workflow commands to Penny: 8-12 hours
- Update path resolution: 6-8 hours
- Shared resource handling: 4-6 hours
- Testing and validation: 8-12 hours

**Tracking**:
- Epic: `docs/prd/epic-list.md` (Epic 9)
- Discovery: Course Correct Task (2026-01-12)
- Related: NanoBanana Plan (`data/nano-banana/project-plan.md`)
- Current datasets: `data/youtube-launch-optimizer/`, `data/nano-banana/`, `data/supportsignal/`, `data/storyline/`

**Related Enhancements**:
- Enhancement #1 (BMAD Integration) - Not affected, Victor pattern independent
- Enhancement #2 (Agent Task Format) - May inform workflow definition format

---
```

---

### Edit 3: Add Note to Architecture Components

**File**: `docs/architecture/components.md`

**Location**: Component: Agents (poem-core) section, after the agents table

**Change Type**: Addition (note)

**Proposed Edit**:

```markdown

**Future Enhancement (Epic 9)**: Agents will support **workflow-scoped context awareness**, enabling operation across multiple independent workflows within one workspace. Penny will gain `*workflows`, `*switch <workflow>`, and `*context` commands to manage workflow context. See `docs/future-enhancements.md` (Enhancement #11) for details.

**Current Limitation**: Agents operate in a single flat workspace. For multiple workflows, users must manually organize prompts in subdirectories (e.g., `dev-workspace/nano-banana/`, `dev-workspace/youtube-launch-optimizer/`).

---
```

---

### Edit 4: Add Workflow Definition Model to Data Models

**File**: `docs/architecture/data-models.md`

**Location**: After WorkflowData section, before Provider Configuration section

**Change Type**: Addition

**Proposed Edit**:

```markdown

---

## Workflow Definition (Future - Epic 9)

**Purpose:** Define a multi-prompt workflow with orchestration logic, sections, and step dependencies.

**Status**: 🔮 **Future Enhancement** - Not yet implemented. See `docs/future-enhancements.md` (Enhancement #11).

**Key Attributes:**

- `name`: string - Workflow identifier (e.g., "youtube-launch-optimizer")
- `description`: string - Human-readable description
- `version`: string - Workflow version
- `sections`: Section[] - Logical groupings of steps
- `reference`: string - Path to workflow-specific reference materials

```typescript
interface WorkflowDefinition {
  /** Unique workflow identifier */
  name: string;

  /** Human-readable description */
  description: string;

  /** Workflow version */
  version: string;

  /** Workflow sections (logical groupings) */
  sections: WorkflowSection[];

  /** Path to reference materials (relative to data/) */
  reference?: string;
}

interface WorkflowSection {
  /** Section name */
  name: string;

  /** Section description */
  description?: string;

  /** Steps in this section */
  steps: WorkflowStep[];
}

interface WorkflowStep {
  /** Step identifier */
  id: string;

  /** Prompt template path (relative to workflow prompts/) */
  prompt: string;

  /** Input field names */
  inputs: string[];

  /** Output field names */
  outputs: string[];

  /** Human-readable description */
  description?: string;
}
```

**Example Workflow Definition:**

```yaml
name: youtube-launch-optimizer
description: Multi-phase YouTube video optimization pipeline
version: 1.0.0

sections:
  - name: Video Preparation
    description: Configure project and summarize video
    steps:
      - id: configure
        prompt: prompts/1-1-configure.hbs
        inputs: [projectFolder, transcript]
        outputs: [projectCode, shortTitle]
        description: Set up project configuration

      - id: summarize
        prompt: prompts/1-3-summarize-video.hbs
        inputs: [transcript]
        outputs: [transcriptSummary]
        description: Generate video summary

  - name: Title Generation
    steps:
      - id: generate-titles
        prompt: prompts/2-1-generate-titles.hbs
        inputs: [transcriptSummary, brandConfig]
        outputs: [titles]

reference: data/youtube-launch-optimizer/
```

**Relationships:**

- Has many PromptTemplates (via steps)
- Has many WorkflowData (runtime executions)
- Stored in `/poem/workflows/` or `data/<workflow>/` directory

**Discovery**: Identified during Story 3.7.1 (2026-01-12) when testing Penny on NanoBanana data source.

---
```

---

### Edit 5: Add Comment to Config File

**File**: `packages/poem-core/poem-core-config.yaml`

**Location**: After the workspace paths section (line 31)

**Change Type**: Addition (comment)

**Proposed Edit**:

```yaml
# Production workspace paths (for reference - applied by config service)
# When POEM_DEV is not set, the config service uses these defaults:
#   prompts: poem/prompts
#   schemas: poem/schemas
#   mockData: poem/mock-data
#   config: poem/config
#   workflowData: poem/workflow-data

# Future Enhancement (Epic 9): Multi-Workflow Support
# This config will be extended to support workflow-scoped paths:
#   workspace:
#     currentWorkflow: nano-banana
#     workflows:
#       youtube-launch-optimizer:
#         prompts: dev-workspace/workflows/youtube-launch-optimizer/prompts
#         schemas: dev-workspace/workflows/youtube-launch-optimizer/schemas
#         reference: data/youtube-launch-optimizer/
#       nano-banana:
#         prompts: dev-workspace/workflows/nano-banana/prompts
#         schemas: dev-workspace/workflows/nano-banana/schemas
#         reference: data/nano-banana/
#     shared:
#       prompts: dev-workspace/shared/prompts
#       schemas: dev-workspace/shared/schemas
# See docs/future-enhancements.md (Enhancement #11) for details.

# Logging configuration
logging:
```

---

### Edit 6: Add Note to Prompt Engineer Agent

**File**: `packages/poem-core/agents/prompt-engineer.md`

**Location**: After the commands list (line 62), before dependencies

**Change Type**: Addition (comment)

**Proposed Edit**:

```yaml
commands:
  - help: Show numbered list of the following commands to allow selection
  - list: List all available prompts in the workspace with rich metadata (size, modified date, schema status) in table format
  - view: Display a specific prompt template with rich metadata (size, modified, line count), schema details, and template statistics (usage: *view <prompt-name>)
  - new: Execute workflow new-prompt.yaml to create a new prompt with schema
  - refine: Execute workflow refine-prompt.yaml to iteratively improve an existing prompt
  - test: Execute workflow test-prompt.yaml to test a prompt with mock or provided data
  - validate: Execute workflow validate-prompt.yaml to validate prompt structure and quality
  - exit: Say goodbye as the Prompt Engineer, and then abandon inhabiting this persona

# Future Enhancement (Epic 9): Multi-Workflow Support
# Penny will gain workflow-scoped context awareness with new commands:
#   - workflows: List all workflows in the workspace
#   - switch: Change active workflow context (e.g., *switch nano-banana)
#   - context: Show current workflow information and reference materials
# All existing commands will become workflow-scoped (e.g., *list shows only current workflow prompts)
# See docs/future-enhancements.md (Enhancement #11) for details.

dependencies:
```

---

## Section 6: Sprint Change Proposal Summary

### Issue Summary

**Architectural Gap Identified**: POEM lacks support for multiple workflows within a single workspace. Current design assumes flat structure (one set of prompts/schemas), but real-world usage requires workflow-scoped context for independent prompt collections (YouTube Launch, Video Planning, NanoBanana, SupportSignal).

### Epic Impact Summary

- **Current Epic (Epic 3)**: ✅ **NOT AFFECTED** - Story 3.7.1 complete, ready for review
- **Future Epics (4-7)**: 🟡 **MINOR IMPACT** - Can proceed with manual workarounds
- **New Epic Needed**: ✅ **YES** - Propose **Epic 9: Multi-Workflow Support** (Q2-Q3 2026)

### Artifact Adjustment Needs

**6 files require updates** (~55 minutes total):

1. ✅ `docs/prd/epic-list.md` - Add Epic 9 (5 min)
2. ✅ `docs/future-enhancements.md` - Add Enhancement #11 (15 min)
3. ✅ `docs/architecture/components.md` - Add workflow context note (10 min)
4. ✅ `docs/architecture/data-models.md` - Add WorkflowDefinition model (15 min)
5. ✅ `packages/poem-core/poem-core-config.yaml` - Add future enhancement comment (5 min)
6. ✅ `packages/poem-core/agents/prompt-engineer.md` - Add workflow commands note (5 min)

### Recommended Path Forward

**Option 1**: ⭐ **Document as Gap, Add to Roadmap**

**Rationale**:
- ✅ Fits user's "important but future" and "fast flow" constraints
- ✅ No immediate work thrown away
- ✅ Allows continued progress on Epic 4
- ✅ Low risk, minimal effort (~1 hour documentation)
- ✅ Provides clear path forward for proper design

**Workaround**: Manual subdirectories (`dev-workspace/nano-banana/`, `dev-workspace/youtube-launch-optimizer/`)

### PRD MVP Impact

🟢 **NO CHANGE** - MVP scope (Epic 1-7) remains unchanged. Multi-workflow support is future enhancement (Epic 9).

### High-Level Action Plan

**Immediate** (Today - 1 hour):
1. ✅ Update 6 documentation files with proposed edits above
2. ✅ Validate edits with user
3. ✅ Commit documentation updates
4. ✅ Continue with Epic 4 (YouTube validation)

**Near-Term** (Epic 4 testing):
- Use manual subdirectory workaround for NanoBanana testing
- Collect requirements from multiple use cases
- Document pain points and workflow patterns

**Future** (Q2-Q3 2026 - Epic 9):
- Design workflow-scoped architecture
- Implement multi-workflow support
- Add workflow commands to Penny
- Test across all use cases (YouTube, NanoBanana, SupportSignal, Storyline)

### Agent Handoff Plan

**Current**: Course Correct Task complete → **User approval** of Sprint Change Proposal

**If approved**:
- User or Dev agent implements proposed documentation edits (~1 hour)
- Resume Epic 4 (YouTube validation) immediately after

**If user prefers Option 2 or 3**:
- **Architect agent** to design multi-workflow architecture
- **Dev agent** to implement changes
- **QA agent** to validate (significant refactoring risk)

---

## Final Review Checklist

- [x] **Change Trigger Identified**: NanoBanana testing revealed architectural limitation
- [x] **Issue Type Classified**: Newly discovered architectural gap (not in original PRD)
- [x] **Epic Impact Assessed**: Current epic complete, future epics minor impact, new epic needed
- [x] **Artifact Conflicts Documented**: 6 files require updates
- [x] **Options Evaluated**: 3 paths analyzed (Document, Implement Now, Prototype)
- [x] **Recommended Path**: Option 1 (Document as Gap) based on user constraints
- [x] **Proposed Edits Drafted**: 6 specific edits provided for approval
- [x] **Action Plan Defined**: Immediate (1 hour docs) → Near-term (workaround) → Future (Epic 9)
- [x] **Handoff Plan Clear**: User approval → Documentation updates → Resume Epic 4

---

## Request for User Approval

**User**: Please review this Sprint Change Proposal and approve one of the following:

1. ✅ **Approve Option 1** (Recommended): Document as gap, add to roadmap, use workaround, continue Epic 4
2. ⚠️ **Approve Option 2**: Pause Epic 4, implement multi-workflow support now (~1-2 weeks effort)
3. ⚠️ **Approve Option 3**: Prototype minimal workflow switching (~1-2 days effort)
4. ❌ **Request Changes**: Suggest alternative approach

**If Option 1 approved**, I will:
1. Apply the 6 proposed documentation edits above
2. Commit changes with message: "docs: document multi-workflow architecture gap (Epic 9 planned)"
3. Mark this course correction as complete
4. Advise on NanoBanana testing approach with workaround

**What's your decision?**

---

**End of Sprint Change Proposal**

---

**Metadata**:
- **Generated By**: Course Correct Task (BMAD v4.44.3)
- **Mode**: YOLO (Batch Analysis)
- **Agent**: Claude Sonnet 4.5
- **Date**: 2026-01-12
- **Change-Checklist**: `.bmad-core/checklists/change-checklist.md`
- **Review Duration**: ~25 minutes (comprehensive analysis)
