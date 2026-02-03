# Epic 5: Workflow Orchestration Agents - Planning Document

**Created**: 2026-02-03
**Status**: Planning
**Target**: Insert as new Epic 5, shift existing Epics 5-7 down to 6-8

---

## Table of Contents

1. [Epic Renumbering Strategy](#epic-renumbering-strategy)
2. [Epic 5 Overview](#epic-5-overview)
3. [Agent 1: Alex - Workflow Architect](#agent-1-alex---workflow-architect)
4. [Agent 2: Ruby - Workflow Runner](#agent-2-ruby---workflow-runner)
5. [Ruby vs Victor: Role Clarification Needed](#ruby-vs-victor-role-clarification-needed)
6. [Dependencies & Prerequisites](#dependencies--prerequisites)
7. [Success Criteria](#success-criteria)
8. [Next Steps](#next-steps)

---

## Epic Renumbering Strategy

### Current Epic Structure

| Epic | Name | Status |
|------|------|--------|
| 0 | Maintenance & Continuous Improvement | Perpetual |
| 1 | Foundation & Monorepo Setup | ✅ Complete |
| 2 | Astro Runtime & Handlebars Engine | ✅ Complete |
| 3 | Prompt Engineer Agent & Core Workflows | ✅ Complete |
| 4 | YouTube Automation Workflow (System Validation) | 🟡 In Progress (at Story 4.6) |
| 5 | System Agent & Helper Generation | 📋 Not Started |
| 6 | Integration Agent & Provider Pattern | 📋 Not Started |
| 7 | Mock/Test Data Agent & Level 2 Mock Data | 📋 Not Started |
| 8 | BMAD Integration - Capability Validation | 📋 Future (Q2 2026) |
| 9 | Multi-Workflow Support (Advanced Features) | 📋 Future (Q2-Q3 2026) |

### New Epic Structure (After Insertion)

| Epic | Name | Status | Change |
|------|------|--------|--------|
| 0 | Maintenance & Continuous Improvement | Perpetual | No change |
| 1 | Foundation & Monorepo Setup | ✅ Complete | No change |
| 2 | Astro Runtime & Handlebars Engine | ✅ Complete | No change |
| 3 | Prompt Engineer Agent & Core Workflows | ✅ Complete | No change |
| 4 | YouTube Automation Workflow (System Validation) | 🟡 In Progress | No change |
| **5** | **Workflow Orchestration Agents** | 🆕 **NEW** | **Inserted** |
| 6 | System Agent & Helper Generation | 📋 Not Started | Was Epic 5 |
| 7 | Integration Agent & Provider Pattern | 📋 Not Started | Was Epic 6 |
| 8 | Mock/Test Data Agent & Level 2 Mock Data | 📋 Not Started | Was Epic 7 |
| 9 | BMAD Integration - Capability Validation | 📋 Future | Was Epic 8 |
| 10 | Multi-Workflow Support (Advanced Features) | 📋 Future | Was Epic 9 |

### Renumbering Tasks

**Files to Update** (estimated 1-2 hours):

1. **PRD Documents**:
   - `docs/prd.md` - Update epic references
   - `docs/prd/epic-list.md` - Renumber Epics 5-9
   - `docs/prd/epic-details.md` - Renumber epic sections

2. **Architecture Documents**:
   - Search for "Epic 5", "Epic 6", "Epic 7" references and update

3. **Story Files** (if any exist for Epics 5-7):
   - Currently: 0 story files exist for Epics 5-7
   - Action: No story renaming needed

4. **Planning Documents**:
   - `docs/planning/` - Update epic references in exploration docs
   - `docs/future-enhancements.md` - Update epic tracking

**Automation Strategy**:
- Use search/replace for bulk updates
- Consider using a script or agent to rename references
- Validate all internal links after renumbering

---

## Epic 5 Overview

### Name
**Epic 5: Workflow Orchestration Agents**

### Purpose
Enable users to create and execute multi-step workflow orchestrations through conversational AI agents. Workflow creation (design, YAML generation) is handled by Alex. Workflow execution (running, checkpoints, human-in-the-loop) is handled by Ruby.

### Why Now?
- **Foundation Complete**: Epic 4.6 delivered working chain execution engine
- **Gap Identified**: No conversational interface for creating or running workflows
- **Business Value**: Unlock workflow capabilities for non-technical users
- **Prerequisite for Epic 4.7+**: Stories 4.7-4.9 benefit from having Ruby and Alex available

### Key Deliverables
1. **Alex (Workflow Architect)** - Agent for creating workflow YAML definitions
2. **Oscar (Workflow Orchestrator)** - Agent for executing workflows with human-in-the-loop
3. **Human-in-the-Loop Checkpoint Implementation** - Technical foundation for pausing workflows
4. **Conditional Routing** - Support for if-then branching in workflows

### Estimated Effort
44-66 hours (approximately 1-1.5 sprints)

---

## Agent 1: Alex - Workflow Architect

### Role
**Workflow Architect**

### Persona
**Alex** - Expert workflow designer who helps users structure multi-step AI orchestrations

### Primary Capabilities

#### 1. Workflow Design Interview
- Ask users about workflow goals and objectives
- Identify input data sources and desired outputs
- Map out logical steps and dependencies
- Determine checkpoint locations (where human decisions are needed)

#### 2. Workflow YAML Generation
- Analyze existing prompts to suggest workflow sequences
- Generate workflow YAML with proper structure:
  - `name`, `description`, `version`
  - `sections` with logical groupings
  - `steps` with `prompt`, `inputs`, `outputs` contracts
  - `checkpoint: true` flags for human-in-the-loop
- Auto-detect data flow between steps (output of Step A → input of Step B)

#### 3. Workflow Validation
- Validate step I/O compatibility (Step 2 inputs must exist in Step 1 outputs or initial data)
- Check that all referenced prompts exist
- Verify schema compatibility across steps
- Suggest improvements (parallel execution opportunities, redundant steps)

#### 4. Workflow Refinement
- Load existing workflow YAML
- Update based on user feedback
- Re-validate and save

### Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `*design` | Start workflow design interview | `*design` → Alex asks questions about workflow goals |
| `*analyze <prompts>` | Analyze existing prompts and suggest workflow | `*analyze youtube-launch` → Generates workflow from 53 templates |
| `*generate` | Generate workflow YAML from design session | After interview, `*generate` creates `.workflow.yaml` |
| `*validate <workflow>` | Validate workflow definition | `*validate youtube-launch.workflow.yaml` |
| `*refine <workflow>` | Load and improve existing workflow | `*refine youtube-launch.workflow.yaml` |
| `*exit` | Exit Alex persona | Return to normal mode |

### Technical Implementation Notes

- **Location**: `.claude/commands/poem/agents/alex.md`
- **Workflow Storage**: Saves to `dev-workspace/workflows/<name>/<name>.workflow.yaml`
- **Dependencies**: Reads from `dev-workspace/prompts/` and `dev-workspace/schemas/`
- **Validation**: Uses Config Service to validate paths and schema compatibility

### Example Workflow YAML (Alex Output)

```yaml
name: youtube-launch-optimizer
description: Transform video transcript into complete YouTube launch assets
version: 1.0.0

sections:
  - name: Transcript Processing
    steps:
      - id: abridge
        prompt: prompts/1-4-abridge.hbs
        inputs: [transcript]
        outputs: [transcriptAbridgement]

      - id: analyze
        prompt: prompts/2-1-analyze-content.hbs
        inputs: [transcriptAbridgement]
        outputs: [contentEssence]

  - name: Title Generation
    steps:
      - id: generate-titles
        prompt: prompts/5-1-generate-title.hbs
        inputs: [contentEssence]
        outputs: [titleCandidates]

      - id: select-titles
        prompt: prompts/5-2-select-title-shortlist.hbs
        checkpoint: true  # Human selects from candidates
        inputs: [titleCandidates]
        outputs: [selectedTitles]
```

---

## Agent 2: Ruby - Workflow Runner

### Role
**Workflow Orchestrator / Workflow Runner**

### Persona
**Oscar** - Skilled workflow execution specialist who runs multi-step orchestrations and manages human-in-the-loop checkpoints

### Primary Capabilities

#### 1. Workflow Execution
- Load workflow definitions (`.workflow.yaml` files)
- Execute steps sequentially with progressive data accumulation
- Call `/api/chain/execute` under the hood
- Track execution progress and provide status updates

#### 2. Human-in-the-Loop Checkpoints
- Pause execution at steps marked `checkpoint: true`
- Present options to user:
  - **Selection**: "Select 2-3 titles from this list: [1, 2, 3, 4, 5]"
  - **Freeform**: "Enter your brand tagline:"
  - **Approval**: "Approve this description? [Yes/No]"
- Capture user input and store in workflow-data
- Resume execution with human decisions available to downstream steps

#### 3. Workflow State Management
- Save workflow state to `dev-workspace/workflow-state/<workflow-id>.json`
- Support pause/resume across sessions
- List active workflows with status
- Resume from specific checkpoint

#### 4. Progress Reporting
- Show execution summary (steps completed, current step, remaining steps)
- Display accumulated workflow-data
- Report render times and warnings
- Provide error context if step fails

### Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `*run <workflow>` | Execute workflow from start | `*run youtube-launch` |
| `*resume <id>` | Resume paused workflow | `*resume wf_abc123` |
| `*status [id]` | Show workflow status | `*status wf_abc123` or `*status` (show all active) |
| `*checkpoint <decision>` | Provide input at checkpoint | At checkpoint: `*checkpoint 1,3,5` (select options 1, 3, 5) |
| `*pause` | Pause current workflow | `*pause` → Save state and exit |
| `*list` | List all workflow executions | `*list` → Shows active, paused, completed workflows |
| `*cancel <id>` | Cancel workflow execution | `*cancel wf_abc123` |
| `*exit` | Exit Ruby persona | Return to normal mode |

### Technical Implementation Notes

- **Location**: `.claude/commands/poem/agents.oscar.md`
- **API Integration**: Wraps `/api/chain/execute` with conversational UX
- **Checkpoint Handling**: Implements CheckpointInfo pattern (Story 5.1)
- **State Persistence**: Uses WorkflowData service for save/resume
- **Error Handling**: Captures step failures and provides retry options

### Example Execution Flow

```
User: *run youtube-launch

Oscar: Starting workflow: youtube-launch-optimizer
      Loading workflow definition...
      Initial data required: [transcript]

Oscar: Please provide the video transcript.

User: [pastes transcript]

Oscar: ✓ Step 1/5: Abridge Transcript (45ms)
      ✓ Step 2/5: Analyze Content (52ms)
      ✓ Step 3/5: Generate Titles (63ms)

      ⏸ CHECKPOINT: Select Titles

      Generated 5 title options:
      1. "How to Build AI Workflows in 10 Minutes"
      2. "AI Workflow Automation: Complete Guide"
      3. "Build Smart AI Pipelines Fast"
      4. "Workflow Automation with AI Tools"
      5. "AI Orchestration Made Simple"

      Select 2-3 titles for shortlist (e.g., *checkpoint 1,3,5)

User: *checkpoint 1,2,5

Oscar: ✓ Captured selections: [1, 2, 5]
      Resuming workflow...

      ✓ Step 4/5: Generate Descriptions (71ms)
      ✓ Step 5/5: Format Output (28ms)

      ✅ Workflow complete!
      Workflow ID: wf_20260203_001
      Total time: 2.3s

      Final outputs:
      - selectedTitles: [1, 2, 5]
      - description: "In this tutorial..."
      - formattedOutput: {...}
```

---

## Ruby vs Victor: Role Clarification Needed

### Current Understanding

**Victor (Workflow Validator)**:
- **Role**: Product-level QA agent
- **Focus**: Validation and regression testing AFTER execution
- **Key Activities**:
  - Tests B72 YouTube workflow end-to-end
  - Compares outputs across story milestones
  - Detects regressions
  - Tracks cumulative capability progression
  - Generates strategic feedback for future stories
  - Answers "what can POEM do?" via capability query
- **Commands**: `*validate`, `*regression`, `*progress-report`, `*capability-explorer`
- **Artifacts**: Creates validation reports, snapshots, integration matrix
- **Location**: `docs/guides/workflow-validation-guide.md`

**Oscar (Workflow Orchestrator)**:
- **Role**: Workflow execution orchestrator
- **Focus**: Running workflows DURING execution with human-in-the-loop
- **Key Activities**:
  - Executes workflow steps sequentially
  - Pauses at checkpoints for human input
  - Manages workflow state (pause/resume)
  - Provides real-time progress reporting
  - Captures user decisions and stores in workflow-data
- **Commands**: `*run`, `*resume`, `*status`, `*checkpoint`, `*pause`
- **Artifacts**: Creates workflow-data files, execution logs

### Overlap Areas 🚨

| Activity | Victor | Oscar | Overlap? |
|----------|--------|------|----------|
| Execute workflow end-to-end | ✅ (for validation) | ✅ (for production use) | ⚠️ YES |
| Pause/resume support | ❌ | ✅ | No |
| Human-in-the-loop | ❌ | ✅ | No |
| Regression detection | ✅ | ❌ | No |
| Snapshot comparison | ✅ | ❌ | No |
| Progress tracking | ✅ (epic-level) | ✅ (workflow-level) | ⚠️ YES |
| Strategic feedback | ✅ | ❌ | No |
| Capability query | ✅ | ❌ | No |

### Key Questions to Resolve

1. **Should Victor use Ruby for execution?**
   - Option A: Victor calls Ruby to run workflows, then validates outputs
   - Option B: Victor executes workflows directly (keeps current implementation)
   - **Recommendation**: Option A (Victor delegates execution to Ruby, focuses on validation logic)

2. **Who owns workflow execution?**
   - **Oscar**: Production workflow execution (with checkpoints)
   - **Victor**: Validation-specific execution (automated, no checkpoints)
   - **Recommendation**: Both execute, but different contexts

3. **Should they share execution infrastructure?**
   - Both wrap `/api/chain/execute`
   - Victor needs automated execution (skip checkpoints)
   - Ruby needs interactive execution (pause at checkpoints)
   - **Recommendation**: Same API, different parameters (`skipCheckpoints: true` for Victor)

4. **Could they be merged?**
   - Combined agent: "Workflow Orchestrator & Validator"
   - Commands: `*run` (production), `*validate` (QA), `*regression`, `*capability-explorer`
   - **Risk**: Single agent with two distinct personalities (executor vs validator)
   - **Recommendation**: Keep separate for now, re-evaluate after Epic 5

### Decision Framework

**Keep Both If**:
- Victor's validation logic is complex enough to warrant dedicated agent
- Oscar's conversational UX for checkpoints is fundamentally different from Victor's automated testing
- Clear separation of concerns: Ruby = production runtime, Victor = QA system

**Merge If**:
- Execution logic overlaps significantly (>50% code duplication)
- Users find it confusing to have two "workflow execution" agents
- Combined agent can maintain clear mental model with distinct command namespaces

### Proposed Resolution (Post-Epic 5)

1. **Build Ruby first** (Epic 5.2) - Validate conversational execution UX
2. **Refactor Victor** (Epic 5.3 or 5.4) - Have Victor use Oscar's execution engine
3. **Evaluate overlap** (End of Epic 5) - Decide merge vs keep separate based on usage patterns
4. **Document decision** (ADR) - Architecture Decision Record for future reference

**For now**: Proceed with both agents, re-evaluate after implementation.

---

## Dependencies & Prerequisites

### Technical Dependencies

1. **Chain Execution Engine** ✅ Complete (Story 4.6)
   - `/api/chain/execute` endpoint
   - WorkflowData persistence service
   - Sequential step execution

2. **Workflow YAML Format** ✅ Defined
   - Format documented in `docs/architecture.md` (lines 361-489)
   - Example: YouTube Launch Optimizer structure

3. **CheckpointInfo Type** ⚠️ Defined but Not Implemented
   - Type exists in `packages/poem-app/src/services/chain/types.ts`
   - Implementation needed for Story 5.1

4. **Multi-Workflow Support (Phase 1)** ✅ Complete (Story 3.8)
   - Workflow-scoped directories
   - Config service path resolution

### Story Dependencies

- **Epic 5 depends on**: Epic 4.6 (chain execution complete)
- **Epic 4.7-4.9 benefit from**: Epic 5 (Ruby and Alex available)
- **Epic 9 depends on**: Epic 5 (workflow orchestration agents prove multi-workflow value)

### Knowledge Dependencies

- **Workflow Definition Format Decision**: `docs/planning/decisions/workflow-definition-format.md`
- **Multi-Workflow Architecture**: `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`
- **YouTube Workflow Patterns**: `docs/planning/exploration/youtube-launch-optimizer-workflow-spec.md`

---

## Success Criteria

### Epic 5 is successful if:

1. **Alex can create workflows**
   - User can describe workflow goals conversationally
   - Alex generates valid workflow YAML
   - Workflow YAML validates successfully
   - Generated workflows execute without errors

2. **Ruby can execute workflows**
   - User can run workflows end-to-end
   - Checkpoints pause execution correctly
   - User can provide selections/freeform input/approvals
   - Workflow resumes with human input in context
   - Final workflow-data contains all accumulated outputs

3. **Human-in-the-Loop works**
   - Workflows pause at `checkpoint: true` steps
   - Ruby presents options clearly
   - User input is captured and stored
   - Downstream steps access checkpoint data

4. **Conditional routing works**
   - Workflows can branch based on data
   - If-then logic executes correctly
   - Conditional steps are skipped when condition is false

5. **Victor and Ruby coexist**
   - No confusion between validation (Victor) and execution (Ruby)
   - Clear documentation on when to use each
   - No significant code duplication

### Key Metrics

- **Time to create workflow**: < 10 minutes (with Alex guidance)
- **Time to execute workflow**: Matches current `/api/chain/execute` performance
- **Checkpoint pause latency**: < 1 second
- **Resume success rate**: 100% (no data loss on pause/resume)

---

## Next Steps

### Immediate Actions (Before Epic 5 Draft)

1. **Renumber Epics** (1-2 hours)
   - Update PRD documents
   - Update architecture references
   - Update planning documents
   - Validate internal links

2. **Define Epic 5 Stories** (2-4 hours)
   - Story 5.1: Implement Human-in-the-Loop Checkpoint (technical foundation)
   - Story 5.2: Create Oscar (Workflow Orchestrator Agent)
   - Story 5.3: Create Alex (Workflow Architect Agent)
   - Story 5.4: Conditional Routing Support
   - Story 5.5: Victor/Oscar Integration & Role Clarification

3. **Review with Stakeholders**
   - Confirm Alex and Oscar personas
   - Validate epic priority (Epic 5 vs later)
   - Decide on Victor/Oscar merge vs separate

4. **Draft Epic 5 Stories** (Use BMAD /sm agent)
   - Create detailed story files
   - Define acceptance criteria
   - Estimate effort per story

### When Ready to Start Epic 5

1. **Complete Epic 4.6** (current work)
2. **Review this planning document**
3. **Use /BMad/agents/sm to draft Story 5.1**
4. **Implement sequentially** (5.1 → 5.2 → 5.3 → 5.4 → 5.5)
5. **Re-evaluate Victor/Oscar overlap after Story 5.2**

---

## External Testing & Validation

**Testing Location**: SupportSignal Prompt Engineering System
**Path**: `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/`

### Reference Documents

**Context & Planning:**
1. **Prompt Engineering Challenges**: `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/1-prompt-engineering-challenges.md`
   Documents the real-world problems Alex and Oscar are designed to solve

2. **Session Goals**: `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/2-session-goals.md`
   Defines success criteria for agent testing

3. **Agent Definitions**: `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/3-agent-definitions.md`
   Consolidated specifications for Alex and Oscar

**Agent Implementations (Claude Commands):**
4. **Alex (Workflow Architect)**: `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/.claude/commands/poem/agents/alex.md`
   Working prototype of Alex agent for external validation

5. **Oscar (Workflow Orchestrator)**: `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/.claude/commands/poem/agents/oscar.md`
   Working prototype of Oscar agent for external validation

**Purpose**: These files serve as the testing ground for Alex and Oscar before integration into POEM core. Learnings from SupportSignal usage will inform Epic 5 story requirements and implementation details.

**Testing Strategy**: Validate agent UX, command patterns, and workflow orchestration concepts in production SupportSignal context before committing to POEM Epic 5 implementation.

---

**Last Updated**: 2026-02-03
**Document Status**: Planning (Ready for Story Drafting)
**Next Milestone**: Epic renumbering complete → Draft Story 5.1
**External Testing**: In progress at SupportSignal prompt engineering system
