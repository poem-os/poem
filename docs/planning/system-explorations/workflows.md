# POEM Core Workflows

**Extracted from**: current-thinking-prompt-os.md
**Last Updated**: 2025-11-20
**Status**: Architecture definition

---

## Overview

**Angela's typical usage patterns**:

- **Most common**: Refining and testing existing prompts
- **Second most common**: Creating new prompts from scratch
- **Always ends with**: Deployment (all refined/created prompts get deployed)

**Key insight**: Both linear AND non-linear workflows exist

- **Linear progression** (like BMAD): Draft → Review → Implement → Test → Deploy
- **Non-linear iteration**: Refine → Test → Refine → Test → Refine → Deploy

---

## Workflow 1: "New Prompt" Workflow

**Purpose**: Create a brand new prompt from scratch

**Steps**:

1. Consult principles (`.poem-core/brain/`)
2. Create prompt file in `/poem/prompts/`
3. Generate placeholder schema
4. Preview with example data
5. Validate structure

**Command**: `*new-prompt "support-ticket-classifier"`
**Primary Agent**: Prompt Engineer (may invoke System Agent for helpers, Integration Agent for validation)

---

## Workflow 2: "Refine Prompt" Workflow

**Purpose**: Improve an existing prompt (Angela's most common task)

**Steps**:

1. Load existing prompt
2. Test against real data from dictionary
3. Identify missing fields
4. Suggest mappings
5. Update prompt
6. Validate changes
7. Repeat steps 2-6 as needed (non-linear)

**Command**: `*refine "support-ticket-classifier"`
**Primary Agent**: Prompt Engineer (may invoke Integration Agent for data dictionary)

---

## Workflow 3: "Deploy Prompt" Workflow

**Purpose**: Push tested prompt to production (always happens at the end)

**Steps**:

1. Validate schema against data dictionary
2. Test connection to provider
3. Publish prompt
4. Sync schema
5. Confirm deployment status

**Command**: `*deploy "support-ticket-classifier" --provider supportsignal`
**Primary Agent**: Integration Agent (may invoke Prompt Engineer for final validation)

---

## Workflow 4: "Test Prompt" Workflow

**Purpose**: Test how a prompt performs with real data

**Steps**:

1. Pull sample data from provider (or use example data)
2. Render prompt with data
3. Compare output to expected
4. Report on field usage

**Command**: `*test "support-ticket-classifier" --data-source supportsignal`
**Primary Agent**: Prompt Engineer (may invoke Integration Agent for data pull)

---

## Workflow 5: "Add Helper" Workflow

**Purpose**: Create a new Handlebars helper while working on a prompt

**Steps**:

1. Define helper requirements
2. Generate helper code
3. Register with Handlebars engine
4. Test helper
5. Confirm availability

**Command**: `*add-helper "fullName"`
**Primary Agent**: System Agent

---

## Workflow vs Commands

**Important distinction**:

- **Workflows** can span multiple agents (agent switching during workflow execution)
- **Commands** are agent-specific (tied to specific agents)

**Example** (from BMAD AppyDave workflow):

```
Workflow: "Create Feature"
├─ Scrum Master Agent    → *draft (draft story command)
├─ QA Agent             → *review (review story command)
├─ Development Agent    → *impl (implement story command)
├─ SAT Agent            → *sat-create (create acceptance test command)
└─ QA Agent             → *qa-final (final quality check command)
```

Each agent has specific commands, but the workflow orchestrates across them.

---

## Data Sources (Future Consideration)

**Status**: Concept identified, implementation TBD based on actual usage

**Core Problem**: Data sources represent **use case + scope + shape** of data feeding prompts.

**The Challenge**:

- Same entity type (e.g., "incident") can have different data source contexts
- This affects how we write prompts, schemas, mappings, deployment, and testing
- We don't fully understand the requirements until we use the system

**Possible Data Source Types** (notation examples):

- `incident.single` - Single complete incident (one entity)
- `incident.collection` - Multiple incidents (list of same entity)
- `incident.view` - Depends on what's being joined/aggregated:
  - Could be single entity from joined tables (company + employee → one record)
  - Could be collection from joined tables (company + employees → multiple records)
  - Could be aggregates (company → totals/stats as single value)
  - Could be list of aggregates (companies → list of totals)
- `moment.single`, `shift_note.single`, etc. - Other entity types

**The "view" concept**: Where is data coming from?

1. One entity (single record)
2. List of same entity (multiple records)
3. List of joined entities (multiple tables, multiple records)
4. Single value from multiple entities (joined/aggregated → one result)
5. List of aggregated values (multiple aggregates)

**Examples from SupportSignal**:

1. **Workflow prompts** - Use partial data (e.g., incident metadata + before_event only)
2. **Analysis prompts** - Use complete data (e.g., full incident with all 4 phases + Q&A)
3. **Comparison prompts** - Use collections (e.g., "which of these 5 incidents is riskiest?")
4. **Cross-entity prompts** - Same prompt, different entities (e.g., sentiment analysis on incident vs moment)

**What We Know**:

- Data sources will impact prompt design
- Different scopes need different presentations (single vs collection)
- Collections might need format specifications (CSV? JSON? Markdown table?)
- Cross-entity prompts require generic placeholders + entity-specific mappings

**What We Don't Know Yet**:

- How to represent data sources in POEM (if explicit representation needed)
- Where they live (config? schemas? separate files?)
- Whether we need a simple DSL to describe them
- How mappings relate to data sources

**Design Principle**: Don't over-engineer - wait for actual usage to reveal requirements

**Impact Areas**:

- Prompt writing (what placeholders available?)
- Schema definitions (what shape is data?)
- Mapping architecture (how to translate entity → prompt?)
- Deployment (what context does prompt need?)
- Testing (what example data to use?)

**Next Steps**: Monitor as system evolves, capture patterns as they emerge

---

## Machine-readable Format Choice

Options considered for various POEM components:

### Workflow Definitions

- **YAML** (BMAD's choice for readability) - Likely choice for workflow templates
- **XML** (Anthropic's preference for model training) - Used in v6 BMAD story-context
- **Markdown** (documentation-friendly) - Good for human-readable specs
- **Markdown + Front Matter** (hybrid structured + readable) - YAML metadata + Markdown content
  - Example: Skills use this pattern (YAML frontmatter + Markdown body)
  - Best of both: structured metadata, human-readable content

### Data Exchange

- **JSON** (standard, data-friendly) - Default for schemas, mappings, API payloads
- **TOON** (Token-Oriented Object Notation) - 40-60% token savings for large datasets
  - See: `/Users/davidcruwys/dev/ad/brains/llm-structured-data/` for TOON investigation
  - Use case: Reducing token costs when passing large data to prompts
  - Trade-off: Lower readability for higher efficiency
- **k_doc (Klueless DSL)** - Ruby DSL for settings + tables
  - Part of Klueless content pillar
  - See: `/kgems/k_doc/` for Ruby gem implementation
  - Pattern: Structured data with semantic meaning
  - Use case: Configuration files, data definitions with relationships

### Mixed Formats?

Different parts of POEM may use different formats optimized for their purpose:

- Workflows: YAML (human-readable, BMAD v4 pattern)
- Schemas: JSON (standard, tooling support)
- Large data inputs: TOON (token efficiency)
- Documentation: Markdown (readability)

**Status**: TBD - likely YAML for workflows, JSON for schemas, TOON for large data optimization

---

**See also**:

- [agents.md](./agents.md) - Agent definitions and capabilities
- [skills.md](./skills.md) - Individual skill specifications
- [structure.md](./structure.md) - System architecture and folder structure
