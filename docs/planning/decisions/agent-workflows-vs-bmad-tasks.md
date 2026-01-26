NOTE: This doc refers to agent procedures (now renamed from 'workflows' to 'tasks' in Story 0.5)
# Agent Workflows vs BMAD Tasks

**Status**: ⚠️ Divergent (Requires Future Alignment)
**BMAD Ready**: No - Custom implementation diverges from BMAD v4 patterns
**Purpose**: Document the architectural decision to use custom YAML agent workflows instead of BMAD markdown tasks
**Context**: POEM needs agent-guided workflows for prompt engineering operations (Epic 3)
**Date**: 2026-01-11

---

## Decision

**Use custom YAML-based agent workflows for Epic 3 prompt engineering operations, diverging from BMAD v4 markdown task format.**

**Why This Decision Was Made:**

Epic 3 Stories (3.2-3.5) implemented four agent workflows:
- `new-prompt.yaml` - Guide agent through creating new prompt templates
- `refine-prompt.yaml` - Guide agent through editing existing prompts
- `test-prompt.yaml` - Guide agent through testing prompts with data
- `validate-prompt.yaml` - Guide agent through validating prompt structure

These workflows use a **custom YAML format** with structured elicitation steps, data storage, and validation rules.

---

## The Problem: Two Different "Workflows"

POEM introduced two distinct workflow concepts that can be confusing:

### 1. Content Workflows (Epic 4 - Intended)
**Purpose**: Orchestrate **prompt execution** - data flows between AI prompts

**Format** (documented in `workflow-definition-format.md`):
```yaml
name: youtube-launch-optimizer
steps:
  - name: Summarize Transcript
    prompt: prompts/summarize-video.hbs
    inputs: [transcript]
    outputs: [transcriptSummary]

  - name: Abridge Summary
    prompt: prompts/abridge-video.hbs
    inputs: [transcript, transcriptSummary]
    outputs: [transcriptAbridgement]
```

**Use Case**: Run prompts in sequence, passing outputs as inputs to next step

---

### 2. Agent Workflows (Epic 3 - Current Implementation)
**Purpose**: Guide **agent conversation behavior** - tell AI agents what to say/do

**Format** (custom, undocumented):
```yaml
id: validate-prompt
steps:
  - id: select-prompt
    type: elicit
    elicit: true
    prompt: "Which prompt would you like to validate?"
    validation:
      required: true
    stores: promptName
    instruction: |
      Wait for user to provide prompt name.
      Parse input and validate file exists.
```

**Use Case**: Agent reads YAML during conversation and follows instructions step by step

---

## Comparison with BMAD v4

### BMAD v4 Has Two Similar Concepts

#### BMAD Workflows (Agent Handoffs)
**Purpose**: Orchestrate **agent transitions** (analyst → pm → architect → dev → qa)

**Format**: `.bmad-core/workflows/brownfield-fullstack.yaml`
```yaml
workflow:
  id: brownfield-fullstack
  sequence:
    - step: enhancement_classification
      agent: analyst
      action: classify enhancement scope

    - agent: pm
      creates: prd.md
      uses: brownfield-prd-tmpl

    - agent: dev
      action: implement_story
```

**Use Case**: Multi-agent project workflow with handoffs

---

#### BMAD Tasks (Single Agent Instructions)
**Purpose**: Guide **single agent** through task execution

**Format**: `.bmad-core/tasks/create-next-story.md` (Markdown)
```markdown
# Create Next Story Task

## Purpose
To identify the next logical story...

## SEQUENTIAL Task Execution

### 1. Identify Next Story
- Locate epic files
- Load highest story
- Verify status is 'Done'

### 2. Gather Story Requirements
- Extract from epic file
- Review previous story context
```

**Use Case**: Single agent follows numbered steps to complete task

---

## The Divergence

**POEM Agent Workflows = BMAD Tasks** (conceptually)

Both guide a single agent through sequential steps. But they use **different formats**:

| Feature | BMAD Task | POEM Agent Workflow |
|---------|-----------|---------------------|
| **Format** | Markdown | YAML |
| **Steps** | Numbered sections (`### 1.`, `### 2.`) | YAML array (`steps:`) |
| **Instructions** | Plain text bullets | YAML `instruction:` blocks |
| **User Input** | Described in text | Structured `elicit:` type |
| **Data Storage** | Implicit ("store X") | Explicit (`stores: variableName`) |
| **Validation** | Described in text | Structured (`validation:`) |
| **Execution** | Agent reads markdown | Agent reads YAML |

**Result**: POEM reinvented BMAD tasks in YAML instead of using BMAD's markdown format.

---

## Why This Divergence Occurred

### Reasons for Custom YAML Format

1. **More Structured/Parseable**
   - Machine-readable format enables future automation
   - Explicit fields (`elicit:`, `stores:`, `validation:`) vs implicit text descriptions

2. **Clearer Data Flow**
   - Explicit `stores: variableName` shows what data accumulates
   - Easier to track workflow state across steps

3. **Validation Support**
   - Structured `validation:` block with rules (required, pattern, minLength)
   - Can be validated programmatically before execution

4. **Domain Separation**
   - BMAD tasks designed for software development workflows
   - POEM workflows designed for prompt engineering operations
   - Different domains might justify different formats

5. **Development Velocity**
   - Pattern was established in Stories 3.2-3.4 before alignment was questioned
   - Worked effectively for immediate needs

---

## Downsides of Divergence

1. **Not Leveraging BMAD Framework**
   - Custom implementation means custom maintenance
   - BMAD improvements won't automatically benefit POEM

2. **Conceptual Overhead**
   - Users familiar with BMAD tasks must learn new format
   - "Workflows" term is overloaded (content workflows vs agent workflows)

3. **Framework Fragmentation**
   - POEM workflows aren't reusable in BMAD projects
   - BMAD tasks aren't reusable in POEM

4. **Technical Debt**
   - Custom YAML format requires custom parsers/validators
   - No established best practices or community patterns

---

## Future Alignment Options

### Option 1: Migrate to BMAD Task Markdown Format
**Pros:**
- ✅ Leverage BMAD framework
- ✅ Reduce maintenance burden
- ✅ Reusable across BMAD projects
- ✅ Familiar to BMAD users

**Cons:**
- ❌ Lose structured elicitation steps
- ❌ Lose explicit data storage tracking
- ❌ Lose validation rules
- ❌ Significant refactor effort (Epic 3 complete)

**Effort**: 16-24 hours to convert 4 workflows + tests

---

### Option 2: Keep Custom YAML, Document as "POEM Tasks"
**Pros:**
- ✅ No refactor needed
- ✅ Retain structured advantages
- ✅ Domain-specific optimization

**Cons:**
- ❌ Permanent divergence from BMAD
- ❌ Ongoing maintenance burden
- ❌ Not reusable in other projects

**Effort**: 4-6 hours to document rationale + rename "workflows" → "tasks"

---

### Option 3: Propose YAML Task Format to BMAD Community
**Pros:**
- ✅ Contribute improvement back to BMAD
- ✅ Structured format benefits entire ecosystem
- ✅ POEM becomes reference implementation

**Cons:**
- ❌ Requires BMAD community buy-in
- ❌ Long timeline (proposal target: Q2 2026)
- ❌ May not be accepted

**Effort**: 8-12 hours to create RFC + examples + documentation

---

### Option 4: Hybrid Approach
**Pros:**
- ✅ Support both BMAD markdown tasks AND POEM YAML workflows
- ✅ Use markdown for simple tasks, YAML for complex elicitation workflows
- ✅ No refactor, additive only

**Cons:**
- ❌ Increases conceptual overhead
- ❌ Two formats to maintain
- ❌ Users must learn both

**Effort**: 6-8 hours to integrate BMAD task runner

---

## Recommendation

**Short-term (POEM v1.0 - Now)**:
- ✅ Keep custom YAML agent workflows as-is (Epic 3 complete, works well)
- ✅ Document this decision record (acknowledge divergence)
- ✅ Rename terminology: "Agent Workflows" → "Agent Tasks" (clearer distinction)
- ✅ Create proper architecture documentation: `docs/architecture/agent-tasks.md`
- ✅ Update `docs/future-enhancements.md` with Epic 9 tracking

**Medium-term (POEM v1.1 - Q2 2026)**:
- 📋 Propose structured task format RFC to BMAD community
- 📋 Share POEM patterns as case study
- 📋 Gather feedback on YAML vs markdown for agent-guided workflows
- 📋 Decide based on community response

**Long-term (POEM v2.0 - Q3 2026)**:
- 🔮 Align with BMAD community decision (markdown, YAML, or both)
- 🔮 Refactor if community adopts YAML task format
- 🔮 Maintain custom format if BMAD stays markdown-only

---

## Immediate Actions Required

1. **Create**: `docs/architecture/agent-tasks.md`
   - Full documentation of POEM agent task system
   - YAML format specification
   - Comparison with content workflows
   - Examples from Epic 3 (new-prompt, validate-prompt)

2. **Update**: `docs/architecture.md` (consolidated)
   - Add section distinguishing agent tasks vs content workflows
   - Reference agent-tasks.md

3. **Update**: `docs/future-enhancements.md`
   - Add Epic 9: "Agent Task Format Alignment with BMAD"
   - Track RFC creation, community feedback, migration plan

4. **Update**: `packages/poem-core/workflows/README.md`
   - Clarify naming: "Agent tasks" (Epic 3) vs "Content workflows" (Epic 4)

5. **Consider**: Rename directory
   - `packages/poem-core/workflows/` → `packages/poem-core/agent-tasks/`?
   - Or keep "workflows" but document dual meaning?

---

## References

- **BMAD v4 Workflows**: `.bmad-core/workflows/brownfield-fullstack.yaml`
- **BMAD v4 Tasks**: `.bmad-core/tasks/create-next-story.md`
- **POEM Content Workflows**: `docs/planning/decisions/workflow-definition-format.md`
- **POEM Agent Workflows**: `packages/poem-core/workflows/*.yaml` (Epic 3)
- **Epic 3 Stories**: Stories 3.2, 3.3, 3.4, 3.5
- **Related**: Epic 8 (Capability Validation - separate BMAD integration)

---

## Related Decisions

- `workflow-definition-format.md` - Content workflows (Epic 4)
- `handlebars-templating.md` - Template format
- Future: Epic 9 tracking (RFC for BMAD alignment)

---

**Status Summary**:
- ✅ **Working**: POEM agent tasks work well in current form
- ⚠️ **Divergent**: Not aligned with BMAD v4 task format
- 📋 **Tracked**: Epic 9 will address long-term alignment
- 🔄 **Review**: Q2 2026 after BMAD community direction clarifies

---

**Last Updated**: 2026-01-11
**Next Review**: After BMAD future roadmap announced (Q2 2026)
**Decision Owner**: POEM Product Team + BMAD Community
