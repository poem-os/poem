# SupportSignal vs YouTube Launch Optimizer - Alignment Gaps Analysis

**Date**: 2026-02-05
**Purpose**: Discovery analysis - identifying patterns to converge back to POEM
**Status**: Exploration phase (no changes to SupportSignal yet)

---

## Executive Summary

Two POEM implementations exist with different maturity levels:
- **SupportSignal** (`/clients/supportsignal/prompt.supportsignal.com.au/poem/`) - 15 prompts, 3-step workflow, production use
- **YouTube Launch Optimizer** (`/ad/poem-os/poem/data/youtube-launch-optimizer/`) - 43 prompts, 53-step workflow, discovery phase

**Critical Finding**: SupportSignal has explicit workflow architecture (validation, storage, step types). YouTube has auto-derivation patterns (YAML → schemas). **Both patterns needed for POEM convergence.**

---

## Directory Structure Comparison

### SupportSignal (Hierarchical, Workflow-Centric)
```
/poem/
├── config/
│   └── poem.yaml              # Multi-workflow management
├── shared/                     # Reusable across workflows
│   ├── mappings/
│   ├── prompts/
│   └── schemas/
└── workflows/
    ├── new-incident/
    │   ├── docs/
    │   ├── prompts/
    │   ├── schemas/
    │   ├── mock-data/
    │   ├── workflow-state/
    │   ├── workflow-data/
    │   └── new-incident.yaml
    └── new-incident-ux/
```

### YouTube Launch Optimizer (Flat, Unified)
```
/youtube-launch-optimizer/
├── config/
│   └── brand-config.json       # Brand/content config
├── docs/                       # Consolidated documentation
│   ├── architecture-decisions/
│   ├── discovery/              # ← NEW (for findings like this)
│   ├── schema-extraction.md
│   └── schema-priority-list.md
├── prompts/                    # All 43 prompts flat + .penny.md files
├── schemas/                    # workflow-attributes.json (auto-derived)
├── mock-data/
├── workflow-data/
└── youtube-launch-optimizer.yaml
```

**Gap**: SupportSignal uses hierarchical workflow grouping; YouTube uses flat structure.

**Recommendation**: YouTube should add `prompts/section-N/` subfolders as it scales (43 prompts). SupportSignal pattern proven for multi-workflow systems.

---

## Schema Definition Approaches

### SupportSignal (Manual, Prompt-Specific)
- **11 hand-written JSON schemas** (one per prompt or phase)
- Schema types: `human-input`, `llm-output` (explicit type system)
- Field definitions include semantic meaning
- Example: `incident-basic-info-schema.json` with 5 required fields
- **Approach**: Manual schema creation per prompt

### YouTube (Auto-Derived, Workflow-Unified)
- **Single `workflow-attributes.json`** aggregating ALL step I/O
- Source of truth: `youtube-launch-optimizer.yaml` step declarations
- 80+ fields tracked through 53-step workflow
- Schemas auto-generated (Epic 4 - not yet built)
- **Approach**: YAML-driven auto-derivation

**Gap**: SupportSignal validates per-prompt (granular). YouTube validates workflow-level (aggregate).

**Convergence**:
1. ✅ YouTube auto-derivation parser should generate **both** per-prompt schemas AND workflow aggregate
2. ✅ SupportSignal should adopt auto-derivation (remove manual schema creation)
3. ✅ Both need schema type system (`human-input` vs `llm-output`)

---

## Workflow YAML Format

### SupportSignal (Explicit Architecture)
```yaml
steps:
  - id: step-3
    type: action
    action: llm-parallel
    prompt: analyze-incident/generate-clarification-questions.hbs
    inputs:
      basicInfo: "{{basicInfo}}"
      narrative: "{{narratives.beforeEvent}}"
    outputs:
      - beforeEventQuestions
      - duringEventQuestions
    validation:
      required: [beforeEventQuestions]
      minFields: 1
    stores: [beforeEventQuestions, duringEventQuestions]
    designDecisions:
      requiresParallelExecution: true
```

**Features**:
- Explicit `type:` (elicit/action/assembly)
- `validation:` rules (required fields, constraints)
- `stores:` for runtime context naming
- `designDecisions:` metadata

### YouTube (Implicit Pipeline)
```yaml
steps:
  - id: configure
    prompt: 1-1-configure.hbs
    inputs: [projectFolder, transcript]
    outputs: [projectCode, shortTitle, titleSuggestions]
    # AUTO-DERIVE: Generate unified schema from inputs/outputs
```

**Features**:
- Minimal declarations (id, prompt, I/O)
- Auto-derivation comments
- Assumes stream semantics
- No explicit validation/storage

**Gap**: SupportSignal is explicit; YouTube is implicit.

**Convergence**: YouTube should adopt SupportSignal's explicit format:
- Add `type:` declarations (elicit/action/assembly)
- Add `validation:` sections
- Add `stores:` for state management
- Keep auto-derivation pattern

---

## Prompt Organization

### SupportSignal (Task-Based Subfolders)
```
prompts/
├── analyze-incident/              # 9 prompts (task grouping)
│   ├── generate-clarification-questions-before-event.hbs
│   ├── generate-clarification-questions-during-event.hbs
│   └── ...
├── elicit-basic-info.hbs          # 6 top-level prompts
└── ...
```
- **Format**: Verbose prompts with inline reasoning steps
- **Naming**: Descriptive, action-oriented
- **Scale**: 15 prompts (manageable)

### YouTube (Flat + Companion Files)
```
prompts/
├── 1-1-configure.hbs
├── 1-1-configure.penny.md         # Companion analysis (80+ pages total)
├── 4-1-analyze-content-essence.hbs
├── 4-1-analyze-content-essence.penny.md
└── ... (43 prompts)
```
- **Format**: Minimal prompts + external `.penny.md` analysis
- **Naming**: Section-number prefixes
- **Scale**: 43 prompts (flat becoming unwieldy)

**Gap**: SupportSignal organizes by task; YouTube keeps flat. SupportSignal embeds reasoning; YouTube externalizes.

**Convergence**:
- ✅ YouTube should adopt subfolder structure: `prompts/section-1/`, `prompts/analysis/`
- ✅ YouTube should keep `.penny.md` companion pattern (proven valuable)
- ✅ SupportSignal should adopt companion files when prompts become more complex

---

## Schema Metadata Systems

### SupportSignal (Rich Type System)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "incident-basic-info-schema",
  "schemaVersion": "1.0.0",
  "schemaType": "human-input",        // ← TYPE SYSTEM
  "title": "...",
  "description": "...",
  "required": [...],
  "properties": {...},
  "additionalProperties": true,        // ← LENIENCY (workflow enrichment)
  "_comment": "..."
}
```

### YouTube (Reference Example)
```json
{
  "$comment": "⚠️ REFERENCE EXAMPLE ONLY - NOT SOURCE OF TRUTH",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "...",
  "description": "...",
  "type": "object",
  "properties": {...},
  "required": ["transcript"]
}
```

**Gap**: SupportSignal has schema type system (`human-input` vs `llm-output`). YouTube doesn't address this.

**Convergence**:
- ✅ POEM needs `schemaType` field for validation routing
- ✅ POEM needs `additionalProperties: true` pattern for context enrichment

---

## Mappings System

### SupportSignal (Explicit Mapping Infrastructure)
```
shared/mappings/
├── analysis-predicate-example.shift-note.json
└── ... (Simple mappings)
```
- **Purpose**: Adapt generic prompts to different data sources
- **Pattern**: Transform predicate output → SupportSignal shift-notes
- **Governance**: Created on-demand, documented

### YouTube (Implicit Mapping)
- Brand config serves similar function (maps context → template variables)
- No separate mapping files
- Implicit in prompt design

**Gap**: SupportSignal has explicit mapping infrastructure; YouTube relies on implicit variables.

**Convergence**:
- ✅ YouTube should create `mappings/` folder for phase transitions
- ✅ SupportSignal pattern proven for reusability
- ✅ Example YouTube use: Map Section 4 outputs → Section 5 inputs

---

## Mock Data Strategy

### SupportSignal (Semantic Naming)
```
mock-data/incidents/
├── 000-sarah-williams.json        # Semantic (person-date)
└── ... (incident-specific test data)
```

### YouTube (Code-Based Naming)
```
mock-data/
├── sample-transcripts/
│   └── b72.txt                    # Project code-based
└── brand-configs/
    └── appydave-brand.json        # Separate brand configs
```

**Gap**: SupportSignal = semantic naming; YouTube = project codes.

**Convergence**: Both approaches work. YouTube could add semantic variation for testing different video types.

---

## Documentation Patterns

### SupportSignal (Session-Based Learnings)
```
docs/
├── session-notes-prompt-refinement-testing.md  # 14KB (conversational)
└── ... (collaborative evolution, captured decisions)
```

### YouTube (Structural Analysis)
```
docs/
├── architecture-decisions/
├── schema-extraction.md            # 11KB (systematic analysis)
├── schema-priority-list.md         # 11KB (build order)
└── HANDOVER-SESSION-3.md           # Session continuity
```

**Gap**: SupportSignal captures conversational learnings; YouTube creates systematic analysis.

**Convergence**:
- ✅ Both patterns valuable
- ✅ YouTube should adopt session notes (now doing with HANDOVER docs)
- ✅ SupportSignal should adopt architecture decision records (ADRs)

---

## Data Flow Semantics

### SupportSignal (Explicit Context Accumulation)
```yaml
stores: [beforeEventQuestions, duringEventQuestions, afterEventQuestions]
# Step 3 accumulated state: {basicInfo, narratives, beforeEventQuestions, ...}
```
- YAML documents outputs stored in `context`
- Explicit state tracking
- Parallel execution flag: `requiresParallelExecution: true`

### YouTube (Implicit Pipeline)
```yaml
# Assumes left-to-right data flow
# Comments explain auto-derivation, not execution model
```
- No explicit context/state declarations
- Stream semantics assumed
- Parallel execution not declared

**Gap**: SupportSignal explicit; YouTube implicit.

**Convergence**: YouTube should adopt `stores:` declarations for clarity.

---

## Critical Convergence Points (Priority Order)

### Priority 1: Schema Auto-Derivation (Epic 4)
**Current State**:
- YouTube: Manual reference schema (`workflow-attributes.json`)
- SupportSignal: 11 manual schemas

**Target State**:
- YAML parser generates schemas from step I/O
- Both per-prompt schemas AND workflow aggregate
- Single auto-derivation system feeds both projects

**Action**: Build `tools/extract-schemas.js` in YouTube (Agent 2 currently working on this)

### Priority 2: Workflow YAML Format Enhancement
**Current State**:
- SupportSignal: Explicit (validation, stores, types)
- YouTube: Implicit (minimal declarations)

**Target State**:
- Unified YAML format with:
  - `type:` declarations (elicit/action/assembly)
  - `validation:` rules
  - `stores:` for state management
  - `designDecisions:` metadata
  - Auto-derivation pattern preserved

**Action**: Update `youtube-launch-optimizer.yaml` with explicit sections (after schema tool validation)

### Priority 3: Prompt Organization
**Current State**:
- SupportSignal: Task-based subfolders (15 prompts)
- YouTube: Flat (43 prompts becoming unwieldy)

**Target State**:
- YouTube adopts subfolder structure: `prompts/section-1/`, `prompts/analysis/`
- Keep `.penny.md` companion files
- SupportSignal adopts companion pattern when needed

**Action**: Reorganize YouTube prompts after Section 6-11 review completes

### Priority 4: Mappings System
**Current State**:
- SupportSignal: Explicit `mappings/` folder
- YouTube: Implicit (brand-config.json)

**Target State**:
- Both projects have `mappings/` for reusable transformations
- YouTube: Map Section 4 outputs → Section 5 inputs
- SupportSignal: Extend with reusable patterns

**Action**: Create `mappings/` folder in YouTube after workflow stabilizes

---

## Patterns to Adopt

### From SupportSignal → YouTube
1. ✅ **Explicit validation rules** in YAML (`required:`, `minFields:`)
2. ✅ **Parallel execution declarations** with metadata
3. ✅ **Step type taxonomy** (elicit/action/assembly)
4. ✅ **Explicit context stores** for runtime state
5. ✅ **Task-based prompt organization** (subfolders)
6. ✅ **Mappings infrastructure** (explicit transformations)
7. ✅ **Schema type system** (`human-input` vs `llm-output`)

### From YouTube → SupportSignal
1. ✅ **YAML-driven auto-derivation** (not manual schemas)
2. ✅ **Companion analysis files** (.penny.md pattern)
3. ✅ **Assembly prompt pattern** (template-only, no LLM)
4. ✅ **Aggregate workflow schema** (complete attribute flow)
5. ✅ **Architecture decision records** (ADRs in `docs/architecture-decisions/`)
6. ✅ **Workflow-level schema** (80+ fields tracked)

---

## Domain-Specific Differences (NOT Convergence Items)

These are intentional domain differences, not misalignments:

1. **Workflow Scope**:
   - SupportSignal = 3-step incident entry (human + parallel LLM)
   - YouTube = 53-step video optimization (sequential pipeline)

2. **Data Model**:
   - SupportSignal = NDIS incident structure (narratives, phases, predicates)
   - YouTube = Video metadata (transcript, chapters, descriptions)

3. **Prompt Complexity**:
   - SupportSignal = Verbose reasoning steps (quality filters inline)
   - YouTube = Minimal prompts + external Penny analysis

4. **Brand Config**:
   - SupportSignal = Single brand/config
   - YouTube = Multi-brand support via `brand-config.json`

---

## Recommendations for POEM (Epic 4-5)

### For Story Creation
When writing BMAD stories for Epic 4 (Schema Management) and Epic 5 (Workflow Engine):

1. **Schema Auto-Derivation** (Epic 4.2):
   - Build YAML parser (YouTube tool is prototype)
   - Generate per-prompt schemas + workflow aggregate
   - Support schema type system (`human-input`, `llm-output`)

2. **Workflow YAML Specification** (Epic 4.3):
   - Define unified format (SupportSignal explicit + YouTube auto-derivation)
   - Document step types, validation rules, stores pattern
   - Include parallel execution declarations

3. **Prompt Organization** (Epic 4.4):
   - Support both flat and subfolder structures
   - Define companion file pattern (.penny.md or similar)
   - Establish naming conventions

4. **Mappings System** (Epic 5.2):
   - Design mappings infrastructure (SupportSignal pattern)
   - Define transformation patterns
   - Create reusable mapping templates

### Testing Strategy
- Use YouTube Launch Optimizer as complexity test (43 prompts, 53 steps)
- Use SupportSignal as production validation (real NDIS use case)
- Both projects converge back to POEM when Epic 4-5 complete

---

## Next Steps

### Immediate (Discovery Phase)
1. ✅ Complete schema extraction tool (Agent 2 in progress)
2. Test tool with YouTube workflow
3. Document learnings in `tools/discovery-notes.md`
4. Update Epic 4/5 continuation document

### Near-Term (After Tool Validation)
1. Enhance `youtube-launch-optimizer.yaml` with explicit sections
2. Create `mappings/` folder with example transformations
3. Reorganize prompts into subfolders
4. Generate schemas using validated tool

### Long-Term (POEM Integration)
1. SupportSignal adopts auto-derivation (removes manual schemas)
2. YouTube adopts explicit validation/stores
3. Both projects migrate to unified POEM framework
4. Patterns proven in both domains feed BMAD stories

---

**Status**: Discovery complete ✅
**Next Agent**: Schema extraction tool (in progress)
**Feed Forward To**: Epic 4/5 continuation document, BMAD story creation
