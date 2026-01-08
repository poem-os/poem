# Workflow Definition Format

**Status**: Decided
**BMAD Ready**: Yes
**Purpose**: Document the choice of YAML workflow format and architecture rationale
**Context**: POEM needs a workflow system to orchestrate multi-step prompt chains with progressive data accumulation

## Decision

**Use YAML format with sequential step execution and auto-derived data bus schema.**

**Why**:

- ✅ Human-readable and easy to author (accessible to non-developers)
- ✅ Structured format with clear step declarations (inputs/outputs explicit)
- ✅ Auto-derived data bus eliminates redundant schema definitions
- ✅ Sequential execution model matches real-world prompt chaining patterns
- ✅ Simple to extend with future features (parallel execution, conditionals, loops)
- ✅ Consistent with BMAD workflows (`.poem-core/workflows/*.yaml`)
- ✅ YAML is industry-standard for configuration and orchestration systems

**Current status**: Architecture documented in `docs/architecture.md` § Workflow Definition Structure

---

## Workflow Format

### Core Structure

```yaml
name: workflow-name
description: Human-readable description of what this workflow does

steps:
  - name: Step Name
    prompt: prompts/template-file.hbs
    inputs:
      - attribute1
      - attribute2
    outputs:
      - outputAttribute
```

### With Sections (Optional)

```yaml
name: complex-workflow
description: Workflow with organized sections

sections:
  - name: Phase 1 - Data Preparation
    steps:
      - name: Load Data
        prompt: prompts/load.hbs
        inputs: [rawInput]
        outputs: [cleanedData]

  - name: Phase 2 - Analysis
    steps:
      - name: Analyze Data
        prompt: prompts/analyze.hbs
        inputs: [cleanedData]
        outputs: [insights]
```

### With Checkpoints (Human-in-the-Loop)

```yaml
steps:
  - name: Generate Options
    prompt: prompts/generate-titles.hbs
    inputs: [content]
    outputs: [titleCandidates]

  - name: Human Selection
    prompt: prompts/select-title.hbs
    inputs: [titleCandidates]
    outputs: [selectedTitle]
    checkpoint: true  # Pauses for human curation
```

---

## Key Architectural Concepts

### 1. Auto-Derived Data Bus

**Concept**: Workflow attributes are automatically derived from the union of all step inputs + outputs.

**Example**:

```yaml
steps:
  - name: Step A
    inputs: [transcript]
    outputs: [summary]
  - name: Step B
    inputs: [summary, transcript]
    outputs: [keywords]
```

**Auto-derived attributes**: `transcript`, `summary`, `keywords`

**Benefit**: No redundant schema declaration - the workflow YAML is self-documenting.

---

### 2. Sequential Execution

**Pattern**: Steps execute in order. Each step can access all attributes from previous steps.

**Data Flow**:

```
Step 1: [transcript] → Render → [summary]
  ↓ (summary added to data bus)
Step 2: [summary, transcript] → Render → [keywords]
  ↓ (keywords added to data bus)
Step 3: [keywords, summary] → Render → [description]
```

**Benefit**: Simple mental model - data accumulates progressively through the pipeline.

---

### 3. Prompt-Level I/O Declaration

**Each step declares**:

- `inputs`: Attributes needed from data bus
- `outputs`: Attributes this step produces
- `prompt`: Template file to render

**Validation**: Engine can verify data bus contains required inputs before executing step.

---

## Alternatives Considered

### Alternative 1: Ruby DSL (from Agent Workflow Builder)

**Example**:

```ruby
workflow :youtube_optimizer do
  step :abridge do
    prompt 'prompts/abridge.hbs'
    inputs [:transcript]
    outputs [:transcriptAbridgement]
  end
end
```

**Rejected because**:

- ❌ Requires Ruby runtime (POEM uses Node.js/TypeScript)
- ❌ Less accessible to non-developers
- ❌ Harder to parse and validate programmatically
- ❌ Doesn't align with BMAD YAML workflows

**Note**: The Ruby DSL pattern was valuable for understanding the architecture, but YAML is more appropriate for POEM's tech stack.

---

### Alternative 2: JSON Format

**Example**:

```json
{
  "name": "workflow-name",
  "steps": [
    {
      "name": "Step Name",
      "prompt": "prompts/template.hbs",
      "inputs": ["attribute1"],
      "outputs": ["outputAttribute"]
    }
  ]
}
```

**Rejected because**:

- ❌ Less human-readable (quotes everywhere, no comments)
- ❌ Harder to author and maintain
- ❌ No multiline string support (awkward for documentation)
- ✅ Would work programmatically (but YAML also works)

---

### Alternative 3: Code-Based Workflow (TypeScript)

**Example**:

```typescript
const workflow = new Workflow('youtube-optimizer')
  .addStep({
    name: 'Abridge Transcript',
    prompt: 'prompts/abridge.hbs',
    inputs: ['transcript'],
    outputs: ['transcriptAbridgement']
  })
```

**Rejected because**:

- ❌ Not accessible to non-developers (Angela can't edit)
- ❌ Requires compilation/build step
- ❌ Harder to introspect and validate
- ❌ Doesn't align with BMAD patterns

---

## Future Enhancements (Not in Epic 4)

### Parallel Execution

```yaml
steps:
  - name: Parallel Analysis
    parallel: true
    substeps:
      - name: Analyze Keywords
        prompt: prompts/analyze-keywords.hbs
        inputs: [transcript]
        outputs: [keywords]
      - name: Analyze Sentiment
        prompt: prompts/analyze-sentiment.hbs
        inputs: [transcript]
        outputs: [sentiment]
```

**Status**: Potentially Epic 6

---

### DTO Mapping (Parameter Translation)

```yaml
steps:
  - name: Generic Summarize
    prompt: prompts/generic/summarize.hbs  # Expects 'content' input
    inputs:
      - transcript
    outputs:
      - summary
    mapping:
      inputs:
        content: transcript          # Map workflow 'transcript' to prompt 'content'
      outputs:
        summary: transcriptSummary   # Map prompt 'summary' to workflow 'transcriptSummary'
```

**Purpose**: Enable prompt reusability by decoupling workflow attribute names from prompt parameter names.

**Status**: Future implementation (Epic 5+), format undefined.

---

### Conditional Execution

```yaml
steps:
  - name: Generate Title
    prompt: prompts/generate-title.hbs
    inputs: [content]
    outputs: [title]
    condition: "content.length > 100"  # Only run if condition met
```

**Status**: Potentially Epic 7+

---

### Explicit Attributes Block

```yaml
attributes:
  - name: transcript
    type: string
    description: Raw video transcript
    transient: false

  - name: tempAnalysis
    type: object
    description: Temporary analysis results
    transient: true  # Not persisted, computed on-demand
```

**Purpose**: Support transient attributes, computed attributes, and external attributes not tied to specific steps.

**Status**: Future enhancement when use cases emerge.

---

## Loose Coupling Pattern

### Problem

Workflows need to be flexible and reusable. Tight coupling between workflow attribute names and prompt parameter names limits reusability.

### Solution

**Current (Epic 4)**: Direct attribute name matching
- Workflow has `transcript` attribute
- Prompt template uses `{{transcript}}` placeholder
- Simple and direct

**Future (Epic 5+)**: DTO mapping layer
- Workflow has `transcript` attribute
- Generic prompt expects `content` parameter
- Mapping translates: `content: transcript`
- Enables prompt library with generic, reusable prompts

### When Needed

- Building a substantial library of generic/reusable prompts
- Different workflows use different naming conventions
- Need to use same prompt template across multiple workflows with different attribute names

---

## Rationale Summary

| Factor | Decision | Rationale |
|--------|----------|-----------|
| **Format** | YAML | Human-readable, accessible, industry-standard |
| **Execution Model** | Sequential | Matches real-world prompt chaining patterns |
| **Data Bus** | Auto-derived | Eliminates redundant schema declarations |
| **Step I/O** | Explicit declaration | Clear contracts, validation support |
| **Loose Coupling** | Future (DTO mapping) | Not needed initially, add when library grows |
| **Parallel Execution** | Future | Optimization for performance-critical workflows |
| **Conditionals** | Future | Add when complex branching needed |

---

## References

- **Architecture**: `docs/architecture.md` § Workflow Definition Structure (lines 425-853)
- **PRD**: `docs/prd.md` Epic 4 (YouTube workflow validation)
- **Story**: Story 3.7 (Implement Workflow Orchestration System)
- **Inspiration**: Agent Workflow Builder Ruby DSL (analyzed but not copied)
- **YouTube Optimizer**: 53-prompt real-world workflow proving the pattern

---

**Last Updated**: 2026-01-07
**Related Decisions**:
- `handlebars-templating.md` (template format)
- `schema-format-alternatives.md` (schema approach)
- `mapping-architecture-concepts.md` (field mapping strategies)
