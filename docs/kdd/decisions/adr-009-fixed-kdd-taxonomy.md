---
adr_number: 009
title: "Fixed KDD Taxonomy for POEM"
status: "Accepted"
created: "2026-01-25"
decision_date: "2026-01-25"
story_reference: "N/A - Design decision"
authors:
  - "Lisa (Librarian)"
  - "David Cruwys"
---

# ADR-009: Fixed KDD Taxonomy for POEM

## Status

**Accepted** (2026-01-25)

This decision establishes POEM's use of a fixed, four-category KDD taxonomy and documents when meta-driven taxonomy would be appropriate for future systems.

## Context

During POEM development, we considered whether the KDD (Knowledge-Driven Development) taxonomy should be:

1. **Fixed** - Hard-coded categories (pattern/learning/decision/example) defined by framework
2. **Meta-driven** - Configurable categories defined in `kdd-taxonomy.yaml`, allowing projects to customize
3. **Project-specific** - Extensible taxonomy where projects add custom categories beyond the core four

### Why This Decision Was Needed

**SupportSignal Analysis**: Analysis of SupportSignal's KDD documentation revealed a clean, four-category structure:
- `docs/kdd/patterns/` (18 documents) - Reusable code/architectural patterns
- `docs/kdd/learnings/` (29 documents) - Story-specific insights, debugging sessions
- `docs/kdd/decisions/` (8 ADRs) - Architecture Decision Records
- `docs/examples/` (0 documents, but directory exists)

The structure was **organic** - it emerged naturally during development without needing configuration or customization. This raised the question: **Should POEM enforce this structure, or allow flexibility?**

### Requirements

POEM is designed to:
1. Support **cross-project consistency** (POEM installations should use same structure)
2. Enable **Lisa (Librarian)** to curate knowledge predictably across projects
3. Work in **greenfield** (new projects) and **brownfield** (existing codebases) contexts
4. **Not conflict** with BMAD framework paths (`docs/stories/`, `docs/qa/`)
5. Provide **clear classification rules** for agent-driven knowledge extraction

### Trade-offs Considered

| Approach | Pros | Cons |
|----------|------|------|
| **Fixed Taxonomy** | Simple, consistent across installations, no config needed | Less flexible for domain-specific categories |
| **Meta-driven Taxonomy** | Maximum flexibility, project-customizable | Complexity, potential for inconsistency, harder to maintain tools |
| **Project-specific Extensions** | Balance of consistency + flexibility | Risk of taxonomy fragmentation, validation complexity |

## Decision

**POEM uses a FIXED four-category KDD taxonomy**, defined by the framework (not configurable):

```
docs/kdd/
├── patterns/      # Reusable code/architectural patterns (promoted after 3+ uses)
├── learnings/     # Story-specific insights, debugging sessions, incidents
├── decisions/     # Architecture Decision Records (ADRs)
└── (no direct files, organized by category)

docs/examples/     # Working code demonstrations
```

**This taxonomy is NOT defined in `kdd-taxonomy.yaml`**. The YAML file provides **metadata templates** for documents within these categories, but the categories themselves are hard-coded in POEM tooling.

**Rationale for Fixed Taxonomy**:

1. **POEM is a focused tool** - Not a general-purpose documentation system. It solves a specific problem: agent-driven knowledge extraction for AI-assisted development.

2. **Consistency across installations** - Every POEM workspace uses the same structure, making cross-project knowledge sharing straightforward.

3. **Simplicity** - No configuration required. New projects get a working taxonomy out of the box.

4. **Evidence from SupportSignal** - The organic structure that emerged matches POEM's fixed taxonomy exactly, validating the categories as sufficient for real-world projects.

5. **Framework-aware classification** - Lisa's classification rules are simple and predictable:
   - **Pattern**: Promoted from learnings after 3+ recurrences (VAL-006)
   - **Learning**: Story-specific insights, debugging sessions, one-off issues
   - **Decision**: Architecture choices, trade-offs, alternatives considered
   - **Example**: Working code demonstrations referenced by prompts

## Alternatives Considered

### Alternative A: Meta-Driven Taxonomy (kdd-taxonomy.yaml)

**Approach**: Define categories in `kdd-taxonomy.yaml` with schema:

```yaml
categories:
  - id: "pattern"
    directory: "docs/kdd/patterns/"
    description: "Reusable patterns"
  - id: "learning"
    directory: "docs/kdd/learnings/"
    description: "Story-specific insights"
  - id: "decision"
    directory: "docs/kdd/decisions/"
    description: "ADRs"
  - id: "example"
    directory: "docs/examples/"
    description: "Code demos"
```

**Why Rejected for POEM**:
- **Over-engineered** - No evidence that projects need custom categories
- **Complexity** - Classification rules must be dynamic, harder to maintain
- **Inconsistency risk** - Different projects might define categories differently

**When This WOULD Be Appropriate**:
- **Tier 2 architecture** (ADR-002 Phase 2) - If POEM supports multiple disconnected ecosystems (e.g., enterprise with compliance/audit categories)
- **BMAD future integration** - If BMAD framework becomes meta-driven and POEM inherits its structure
- **Plugin architecture** - If third-party plugins need to define custom KDD categories

### Alternative B: Project-Specific Extensions

**Approach**: Fixed core taxonomy + extensible categories:

```yaml
core_categories: [pattern, learning, decision, example]  # Framework-defined
project_categories:  # User-defined
  - id: "compliance"
    directory: "docs/kdd/compliance/"
```

**Why Rejected for POEM**:
- **Validation complexity** - Lisa must validate both core and custom categories
- **Fragmentation risk** - Projects might define overlapping categories (e.g., "security-pattern" vs "pattern")
- **Tooling burden** - Index generation, link validation, topology checks must handle dynamic structure

**When This WOULD Be Appropriate**:
- **Enterprise compliance** - If projects require audit trails, regulatory documentation
- **Domain-specific documentation** - Scientific research, medical applications with specialized knowledge types

### Alternative C: No Taxonomy (Flat Structure)

**Approach**: All KDD documents in `docs/kdd/` without categories

**Why Rejected**:
- **Discoverability** - SupportSignal analysis showed 29 learnings in flat directory reduced usability (VAL-003)
- **Classification loss** - Pattern promotion (VAL-006) requires distinguishing patterns from learnings
- **No organizational signal** - Categories provide semantic structure for AI agents

## Framework-Aware Classification Rules

Lisa's classification rules are **framework-aware** to prevent conflicts with BMAD paths:

### BMAD Paths (Do Not Move)

Lisa **never moves or reclassifies** files in BMAD-controlled directories:

```
docs/stories/              # BMAD story files (Bob creates, James updates, Quinn reviews)
docs/qa/                   # BMAD QA artifacts
  ├── assessments/         # Quinn's risk/design/trace/NFR reports
  ├── gates/               # Quinn's quality gate decisions
docs/architecture/         # BMAD architecture documents (sharded)
docs/prd/                  # BMAD PRD documents (sharded)
```

**Reason**: These directories are managed by BMAD agents (Bob, James, Quinn, Sarah). Lisa is **read-only** in these locations.

### Lisa's KDD Paths (Read-Write)

Lisa **creates, updates, validates** files in KDD-controlled directories:

```
docs/kdd/
├── patterns/              # Lisa creates patterns (promoted from learnings)
├── learnings/             # Lisa extracts learnings from story Dev Agent Record
├── decisions/             # Lisa documents ADRs (from architect discussions)
└── meta/                  # Lisa maintains KDD guides and indexes

docs/examples/             # Lisa creates working code examples
```

**Classification Flow**:

1. **Story completion** → Dev Agent Record contains debugging logs, insights
2. **Lisa extracts** → Creates learning document in `docs/kdd/learnings/`
3. **Recurrence detection (VAL-006)** → If issue appears 3+ times, Lisa promotes to pattern
4. **Pattern promotion** → Move content to `docs/kdd/patterns/`, update indexes

### Cross-Reference Pattern

Lisa **cross-references** between BMAD and KDD paths, but **never moves** BMAD files:

**Example** (Story 4.3 completion):

```yaml
# Story file: docs/stories/epic-4/story-4.3-mock-data-generation.md
Knowledge Assets:
  - type: "learning"
    path: "docs/kdd/learnings/debugging/faker-install-esm-mismatch.md"
    description: "ESM module mismatch resolution"
  - type: "pattern"
    path: "docs/kdd/patterns/backend/esm-module-loading.md"
    description: "Vite + Faker.js ESM integration pattern"
```

Lisa **adds links** to story file (updates "Knowledge Assets" section), but **does not move** the story file itself.

## When Meta-Driven Taxonomy Would Be Appropriate

**Future Scenarios** where POEM should reconsider meta-driven taxonomy:

### Scenario 1: BMAD Future Integration (Epic 9)

**Trigger**: BMAD framework adopts configurable KDD taxonomy in `bmad-core-config.yaml`

**Requirement**: POEM must align with BMAD's taxonomy structure to avoid conflicts

**Implementation**:
- Read KDD categories from BMAD config (if present)
- Fall back to POEM's fixed taxonomy if BMAD not configured
- Validate BMAD categories include at minimum: pattern, learning, decision

**Tracking**: `docs/future-enhancements.md` (Epic 9 - BMAD Integration)

### Scenario 2: Tier 2 Architecture (ADR-002 Phase 2)

**Trigger**: POEM supports disconnected workflow ecosystems (e.g., enterprise workspace + client workspace)

**Requirement**: Different ecosystems may need different KDD structures (e.g., compliance category for enterprise)

**Implementation**:
- Define categories per workflow ecosystem in `poem-core-config.yaml`
- Lisa switches taxonomy context when switching workflows
- Validation rules (VAL-001 through VAL-006) scoped to ecosystem taxonomy

**Tracking**: `docs/kdd/decisions/adr-002-multi-workflow-architecture.md` (Phase 2 deferred)

### Scenario 3: Plugin Architecture (Not Yet Planned)

**Trigger**: Third-party POEM plugins need to extend KDD taxonomy

**Requirement**: Plugins define custom categories without forking POEM core

**Implementation**:
- Plugin manifest declares custom KDD categories
- Lisa loads core + plugin categories at runtime
- Validation rules apply to plugin-defined categories

**Tracking**: Not yet scoped (future product direction)

## Rationale

### Why Fixed Taxonomy is Correct for POEM v1.0

1. **Scope-appropriate complexity** - POEM solves prompt engineering knowledge management. Fixed taxonomy is sufficient for this scope.

2. **Evidence-based design** - SupportSignal's organic structure validates the four categories as complete for real-world AI-assisted development.

3. **Consistency goal** - POEM installations should be interoperable. Fixed taxonomy enables knowledge sharing between projects.

4. **Agent simplicity** - Lisa's classification rules are deterministic and predictable with fixed categories.

5. **No feature requests** - No user evidence that custom categories are needed (yet).

### Why Meta-Driven Taxonomy is NOT Appropriate for POEM v1.0

1. **No evidence of need** - SupportSignal analysis showed zero custom categories required

2. **YAGNI violation** - Building meta-driven taxonomy without clear use case is premature

3. **Maintenance burden** - Dynamic classification rules increase complexity without proven value

4. **Consistency risk** - Projects defining custom categories could fragment POEM ecosystem

## Consequences

### Positive Consequences

1. **Predictable structure** - Every POEM installation has same KDD layout
2. **Simple onboarding** - New users learn one taxonomy, applicable to all projects
3. **Tool maintainability** - Lisa's validation rules (VAL-001 through VAL-006) are static, easier to test
4. **Cross-project knowledge sharing** - Patterns from Project A can be copied to Project B without translation
5. **Clear upgrade path** - If meta-driven taxonomy becomes necessary, it can be added in v2.0 without breaking v1.0 installations

### Negative Consequences

1. **Limited flexibility** - Projects with domain-specific documentation needs (e.g., compliance) must use workarounds
   - **Mitigation**: Use subdirectories within categories (e.g., `docs/kdd/decisions/compliance/`)

2. **Harder for brownfield projects** - Existing codebases with custom KDD structures must migrate to POEM's taxonomy
   - **Mitigation**: Lisa's brownfield workflow (`.bmad-core/working-in-the-brownfield.md`) provides migration guide

3. **BMAD alignment dependency** - If BMAD adopts meta-driven taxonomy, POEM must update
   - **Mitigation**: Epic 9 tracks BMAD integration. Fixed taxonomy is temporary until BMAD stabilizes.

4. **Potential for future breaking change** - If meta-driven taxonomy added in v2.0, projects may need config updates
   - **Mitigation**: Graceful migration path (v2.0 auto-generates config from v1.0 directory structure)

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Custom categories needed | Low | Medium | Subdirectories within fixed categories |
| BMAD taxonomy conflict | Medium | High | Epic 9 tracks alignment (planned Q2 2026) |
| Brownfield migration friction | Medium | Medium | Migration guide in `.bmad-core/working-in-the-brownfield.md` |
| Breaking change in v2.0 | Low | Medium | Auto-migration tool for v1.0 → v2.0 |

## Implementation Notes

### Code Locations

**Fixed Taxonomy Definition** (hard-coded):
- `packages/poem-core/tasks/librarian/curate-knowledge.yaml` - Lisa's classification rules
- `packages/poem-app/src/services/config/poem-config.ts` - KDD path definitions
- `.bmad-core/data/validation-rules.yaml` - Validation rules (VAL-001 through VAL-006)

**Metadata Templates** (YAML):
- `.bmad-core/data/kdd-taxonomy.yaml` - Metadata schemas for each category

**Migration Guide** (Documentation):
- `.bmad-core/working-in-the-brownfield.md` - Brownfield KDD migration workflow

### Validation Rules

Lisa enforces fixed taxonomy via validation rules:

- **VAL-001**: Link health (all links point to valid paths in fixed taxonomy)
- **VAL-002**: Semantic similarity (duplicates detected within same category)
- **VAL-003**: Directory limit (warns if `docs/kdd/patterns/` exceeds 20 files)
- **VAL-004**: Story file size (encourages extraction to KDD docs)
- **VAL-005**: Metadata completeness (validates required fields per category)
- **VAL-006**: Recurrence detection (promotes learnings to patterns after 3+ occurrences)

**Key Rule**: VAL-006 (Recurrence Detection) **depends on fixed taxonomy** to distinguish patterns from learnings.

### Future Refactoring Path

If meta-driven taxonomy becomes necessary (Epic 9 or Tier 2 architecture):

1. **Add configuration layer** - Define categories in `poem-core-config.yaml`:
   ```yaml
   kdd:
     taxonomy:
       mode: "fixed"  # or "configurable"
       categories:
         - id: "pattern"
           directory: "docs/kdd/patterns/"
         - id: "learning"
           directory: "docs/kdd/learnings/"
         # etc.
   ```

2. **Update Lisa's classification rules** - Read categories from config instead of hard-coded logic

3. **Extend validation rules** - VAL-001 through VAL-006 read category paths from config

4. **Provide migration tool** - Auto-generate config from v1.0 directory structure

**Tracking**: `docs/future-enhancements.md` (Epic 9 - BMAD Integration)

## Related Decisions

- **ADR-002: Multi-Workflow Architecture** - Taxonomy scoping per workflow ecosystem (Phase 2 deferred)
- **Epic 9: BMAD Integration** - BMAD future release may define meta-driven taxonomy
- **VAL-006: Recurrence Detection** - Pattern promotion depends on fixed pattern/learning distinction

## References

- SupportSignal KDD Analysis: Evidence for four-category taxonomy
- `.bmad-core/data/validation-rules.yaml`: VAL-001 through VAL-006 definitions
- `.bmad-core/data/kdd-taxonomy.yaml`: Metadata templates for fixed categories
- `.bmad-core/working-in-the-brownfield.md`: Brownfield KDD migration workflow
- `docs/future-enhancements.md`: Epic 9 - BMAD Integration tracking

---

**Decision Maker**: David Cruwys (Product Owner)
**Consensus**: Lisa (Librarian), Quinn (QA), BMAD community feedback
**Review Date**: Q2 2026 (during Epic 9 - BMAD Integration planning)
