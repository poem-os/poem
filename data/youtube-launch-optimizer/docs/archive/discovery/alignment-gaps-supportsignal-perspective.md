# Alignment Gaps - What SupportSignal Does Better

**Date**: 2026-02-05
**Purpose**: Learn from SupportSignal patterns to improve YouTube Launch Optimizer
**Status**: Discovery - feed learnings back to central POEM

---

## What SupportSignal Does Better (Adopt These Patterns)

### 1. Task-Based Subfolder Organization ⭐

**SupportSignal Approach**:
```
prompts/
├── analyze-incident/              # 9 prompts grouped by task
│   ├── generate-clarification-questions-before-event.hbs
│   ├── generate-clarification-questions-during-event.hbs
│   └── ...
└── elicit-basic-info.hbs          # 6 top-level prompts
```
- Semantic grouping by task/domain
- Scalable organization (15 prompts manageable, ready for 50+)

**YouTube Current State**:
```
prompts/
├── 1-1-configure.hbs              # 43 prompts flat
├── 1-2-title-shortlist.hbs
├── 4-1-analyze-content-essence.hbs
└── ...
```
- Number prefixes (1-1, 4-1, 5-3) indicate sections
- Flat structure becoming unwieldy (43 prompts)

**Action**: Reorganize into `prompts/section-1/`, `prompts/section-4/`, etc.
**Benefit**: Better organization, easier navigation, removes number prefixes

---

### 2. Explicit Workflow YAML Format ⭐

**SupportSignal Approach**:
```yaml
steps:
  - id: step-3
    type: action                    # ← Explicit step type
    action: llm-parallel            # ← Execution mode
    validation:                     # ← Validation rules
      required: [beforeEventQuestions]
      minFields: 1
    stores: [beforeEventQuestions, duringEventQuestions]  # ← State management
    designDecisions:
      requiresParallelExecution: true
```

**YouTube Current State**:
```yaml
steps:
  - id: configure
    prompt: 1-1-configure.hbs       # ← Minimal declaration
    inputs: [projectFolder, transcript]
    outputs: [projectCode, shortTitle]
    # AUTO-DERIVE: Generate schema from inputs/outputs
```
- Implicit step types
- No validation rules
- No explicit state/stores
- Comments explain intent

**Action**: Enhance YAML with `type:`, `validation:`, `stores:` sections
**Benefit**: Self-documenting, validation at YAML level, explicit state management

---

### 3. Schema Type System (human-input vs llm-output) ⭐

**SupportSignal Approach**:
```json
{
  "$id": "incident-basic-info-schema",
  "schemaType": "human-input",        // ← Type system
  "additionalProperties": true,        // ← Workflow enrichment allowed
  "_comment": "..."
}
```
- Validates differently based on source (human vs LLM)
- Allows additional properties for context accumulation

**YouTube Current State**:
- No schema type system
- All schemas assume LLM output
- No distinction for human-in-loop steps (1-2, 2-2, 5-2)

**Action**: Add `schemaType` field to all schemas
**Benefit**: Better validation routing, supports human checkpoints explicitly

---

### 4. Explicit Parallel Execution Declarations ⭐

**SupportSignal Approach**:
```yaml
designDecisions:
  requiresParallelExecution: true
  futureCapability: "When parallel execution supported"
```
- Metadata flags future optimization
- Documents design intent
- Ready for Epic 5 workflow engine

**YouTube Current State**:
- Parallel execution identified in docs (Section 4)
- Not declared in YAML
- Tool-level detection only (same input pattern)

**Action**: Add `execution: parallel` or similar flag to Section 4 steps
**Benefit**: Explicit intent, easier workflow engine implementation

---

### 5. Mappings Infrastructure ⭐

**SupportSignal Approach**:
```
shared/mappings/
├── analysis-predicate-example.shift-note.json
└── ... (transformation patterns)
```
- Explicit folder for data transformations
- Adapts generic prompts to specific domains
- Reusable mapping patterns

**YouTube Current State**:
- No `mappings/` folder
- Implicit mappings in brand-config.json
- Transformations embedded in prompts

**Action**: Create `mappings/` folder for Section 4 → Section 5 transformations
**Benefit**: Reusable patterns, clearer data flow, separation of concerns

---

### 6. Incremental Workflow Design (Staged Implementation) ⭐

**SupportSignal Approach**:
- Steps 1-2 implemented (production)
- Step 3 designed (YAML ready, not implemented)
- Steps 4-6 documented (future roadmap)
- Design decisions inline with implementation sections

**YouTube Current State**:
- All 53 steps defined upfront in YAML
- No staging/phasing metadata
- Assumes full implementation

**Action**: Add `status: implemented|designed|planned` to YAML steps
**Benefit**: Clearer roadmap, phased rollout, better project management

---

## What YouTube Should Keep (We Do This Better)

### ✅ YAML Auto-Derivation Pattern
- Schemas generated from YAML (not manual)
- SupportSignal should adopt this (remove 11 manual schemas)
- Don't change - this is superior pattern

### ✅ Companion Analysis Files (.penny.md)
- External documentation (80+ pages)
- Minimal prompts (35 lines)
- SupportSignal should adopt for complex prompts
- Don't change - this is cleaner separation

### ✅ Assembly Prompt Pattern
- Template-only prompts (no LLM)
- Marked with metadata
- 2000x faster, $0 cost
- Don't change - this is optimization win

### ✅ Architecture Decision Records (ADRs)
- Dedicated `docs/architecture-decisions/` folder
- Structured rationale documentation
- SupportSignal should adopt
- Don't change - this is knowledge retention

---

## Recommended Actions (Priority Order)

### Priority 1: Reorganize Prompts into Subfolders
**Current**:
```
prompts/
├── 1-1-configure.hbs
├── 1-2-title-shortlist.hbs
├── 4-1-analyze-content-essence.hbs
```

**Proposed**:
```
prompts/
├── section-1-video-prep/
│   ├── configure.hbs
│   ├── title-shortlist.hbs
│   └── ...
├── section-4-analysis/
│   ├── analyze-content-essence.hbs
│   ├── analyze-audience-engagement.hbs
│   └── analyze-cta-competitors.hbs
└── ...
```

**Action**: Remove number prefixes, use subfolder grouping
**Benefit**: Aligns with SupportSignal pattern, better organization

### Priority 2: Align Schema Naming with Prompts
**Current Misalignment**:
- Prompt: `1-1-configure.hbs`
- Schema: `configure.json`
- YAML: `id: configure`

**Proposed Alignment**:
- Prompt: `section-1-video-prep/configure.hbs`
- Schema: `section-1-video-prep/configure.json` (or keep flat: `configure.json`)
- YAML: `id: configure` (no prefix, references subfolder)

**Question**: Should schemas mirror prompt subfolders or stay flat?

### Priority 3: Enhance YAML with Explicit Sections
Add SupportSignal's explicit format:
- `type:` (elicit/action/assembly)
- `validation:` (required fields, constraints)
- `stores:` (state management)
- `execution:` (parallel flag for Section 4)

### Priority 4: Add Schema Type System
Mark schemas with `schemaType`:
- `human-input` for steps 1-2, 2-2, 5-2 (human checkpoints)
- `llm-output` for all other steps

### Priority 5: Create Mappings Folder
Document transformations:
- Section 1 → Section 4 (transcript → abridgement)
- Section 4 → Section 5 (analysis → title generation)
- Section 4 → Section 6 (analysis → description)

---

## Three-Track System

**Track 1**: SupportSignal
- `/clients/supportsignal/prompt.supportsignal.com.au`
- Production NDIS workflow
- Explicit YAML, manual schemas (for now)

**Track 2**: YouTube Launch Optimizer (this system)
- `/ad/poem-os/poem/data/youtube-launch-optimizer`
- Discovery/testing system
- Auto-derivation patterns, companion files

**Track 3**: Central POEM
- `/ad/poem-os/poem/docs`
- Epic 4-5 development (not built yet)
- Learnings from Track 1 & 2 feed here

**Convergence**: When Epic 4-5 complete, both Track 1 & 2 migrate to central POEM

---

**Status**: Discovery complete ✅
**Feed Forward To**: Central POEM Epic 4-5 story creation
**Next**: Propose unified structure for prompts + schemas + YAML alignment
