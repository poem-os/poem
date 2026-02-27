# KDD Patterns Index

Reusable architectural patterns, coding conventions, and design patterns extracted from POEM development.

## All Patterns

### Installation Patterns (3) ⭐ NEW

1. **[Installation Registry Pattern](./installation-registry-pattern.md)** - Story 1.8
   - **Type**: Architectural Pattern
   - **Status**: Active
   - **Problem**: Multiple POEM installations need coordination to prevent port conflicts
   - **Solution**: Global registry (`~/.poem/registry.json`) tracks all installations with metadata
   - **Epic 1**: Core multi-installation management pattern

2. **[Port Allocation Strategy](./port-allocation-strategy.md)** - Story 1.7
   - **Type**: Architectural Pattern
   - **Status**: Active
   - **Convention**: Increment-of-10 (9500, 9510, 9520...) for predictable, discoverable port allocation
   - **Epic 1**: Enables conflict-free multi-installation ecosystem

3. **[Installation Preservation Pattern](./installation-preservation-pattern.md)** - Story 1.9
   - **Type**: Architectural Pattern
   - **Status**: Active
   - **Problem**: Users lose configuration during reinstall/upgrade
   - **Solution**: `.poem-preserve` file with glob patterns preserves user files during framework upgrade
   - **Epic 1**: Enables safe reinstallation

### Configuration Patterns (2)

4. **[Config Service Single Source of Truth](./config-service-single-source-of-truth.md)** - Story 3.2.5
   - **Type**: Architectural Pattern
   - **Status**: Active
   - **Problem**: Path definitions duplicated across tasks cause drift
   - **Solution**: Central config service reads from `poem-core-config.yaml`, tasks inherit paths
   - **Applied**: Epic 1 (Stories 1.10, 1.11)

5. **[Workflow-Scoped Resource Management](./workflow-scoped-resource-management.md)** - Story 3.8
   - **Type**: Architectural Pattern
   - **Status**: Active
   - **Problem**: Creating all workspace folders up-front wastes disk space
   - **Solution**: Only create workflow folders when user adds workflow
   - **Applied**: Epic 1 (Story 1.10)

### Schema & Validation Patterns (3)

6. **[Unified Schema Structure](./unified-schema-structure.md)** - Story 2.2
   - **Type**: Architectural Pattern
   - **Status**: Active
   - **Convention**: JSON Schema + Handlebars templates for AI prompts
   - **Components**: Schema, template, mock data generation

7. **[Field Mapper Pattern](./4-field-mapper-pattern.md)** - Story 4.6
   - **Type**: Code Pattern
   - **Status**: Active
   - **Problem**: Transform between data formats (transcript → storyline, analysis → shift notes)
   - **Solution**: Declarative field mapping DSL

8. **[Schema-Based Mock Data Generation](./4-schema-based-mock-data-generation.md)** - Story 4.1
   - **Type**: Code Pattern
   - **Status**: Active
   - **Solution**: Faker.js + JSON Schema → realistic mock data

### Workflow & Template Patterns (4)

9. **[Workflow Chain Execution](./4-workflow-chain-execution.md)** - Story 4.5
   - **Type**: Architectural Pattern
   - **Status**: Active
   - **Problem**: Multi-step workflows (YouTube: 54 prompts in sequence)
   - **Solution**: Declarative chain execution with state management

10. **[Handlebars Helper Module Pattern](./4-handlebars-helper-module-pattern.md)** - Story 4.3
    - **Type**: Code Pattern
    - **Status**: Active
    - **Problem**: Reusable template logic (capitalize, truncate, etc.)
    - **Solution**: ESM-based helper modules with hot reload

11. **[Section-Based Template Naming](./4-section-based-template-naming.md)** - Story 4.4
    - **Type**: Naming Convention
    - **Status**: Active
    - **Convention**: `{workflow}/{section}/{prompt-name}.hbs` (e.g., `chapters/generate-timestamps.hbs`)
    - **Benefits**: Organization, discoverability

12. **[Workflow Data File Persistence](./4-workflowdata-file-persistence.md)** - Story 4.7
    - **Type**: Architectural Pattern
    - **Status**: Active
    - **Problem**: Store workflow execution state across sessions
    - **Solution**: File-based JSON persistence in `workflow-data/`

### API & Integration Patterns (2)

13. **[API-First Heavy Operations](./api-first-heavy-operations.md)** - Story 3.7
    - **Type**: Architectural Pattern
    - **Status**: Active
    - **Problem**: Mock data generation, LLM calls too slow for synchronous CLI
    - **Solution**: Astro API endpoints handle heavy operations, CLI calls endpoints

14. **[Skills Self-Description Format](./skills-self-description-format.md)** - Story 3.6
    - **Type**: Documentation Pattern
    - **Status**: Active
    - **Convention**: Markdown files with YAML frontmatter for Claude Code slash command integration

### Testing Patterns (3)

15. **[Testing - Zero-Tolerance Pattern](./testing-zero-tolerance-pattern.md)** - Story 0.7
    - **Type**: Testing Pattern
    - **Status**: Active
    - **Philosophy**: "If a test does not run, there's no point having a test"
    - **Rule**: Delete all non-passing tests (skipped, flaky, failing) - no exceptions
    - **Enforcement**: Quinn validates 0 skipped tests in QA review

16. **[Mandatory Test Gate Pattern](./mandatory-test-gate-pattern.md)** - Stories 0.7, 1.10, 1.11 ⭐ NEW
    - **Type**: Process Pattern
    - **Status**: Active
    - **Problem**: Advisory quality gates systematically ignored under pressure
    - **Rule**: Test execution is mandatory and blocking at every agent handoff — BLOCK not DEFER
    - **Promoted**: 2026-02-27 (3 independent recurrences)

17. **[Output Schema Validation Warnings](./4-output-schema-validation-warnings.md)** - Story 4.2
    - **Type**: Validation Pattern
    - **Status**: Active
    - **Problem**: LLM outputs may not match schema
    - **Solution**: Validation warnings (not errors) with diffs

### Parser Patterns (1)

17. **[Handlebars Parsing Patterns](./handlebars-parsing-patterns.md)** - Story 3.4
    - **Type**: Code Pattern
    - **Status**: Active
    - **Problem**: Parse Handlebars templates to extract variables and helpers
    - **Solution**: Regular expressions + AST traversal

---

## Patterns by Domain

### Installation (3) ⭐ EPIC 1
- [Installation Registry Pattern](./installation-registry-pattern.md)
- [Port Allocation Strategy](./port-allocation-strategy.md)
- [Installation Preservation Pattern](./installation-preservation-pattern.md)

### Configuration (2)
- [Config Service Single Source of Truth](./config-service-single-source-of-truth.md)
- [Workflow-Scoped Resource Management](./workflow-scoped-resource-management.md)

### Schemas & Validation (3)
- [Unified Schema Structure](./unified-schema-structure.md)
- [Field Mapper Pattern](./4-field-mapper-pattern.md)
- [Schema-Based Mock Data Generation](./4-schema-based-mock-data-generation.md)
- [Output Schema Validation Warnings](./4-output-schema-validation-warnings.md)

### Workflows & Templates (4)
- [Workflow Chain Execution](./4-workflow-chain-execution.md)
- [Handlebars Helper Module Pattern](./4-handlebars-helper-module-pattern.md)
- [Section-Based Template Naming](./4-section-based-template-naming.md)
- [Workflow Data File Persistence](./4-workflowdata-file-persistence.md)

### API & Integration (2)
- [API-First Heavy Operations](./api-first-heavy-operations.md)
- [Skills Self-Description Format](./skills-self-description-format.md)

### Testing (3)
- [Testing - Zero-Tolerance Pattern](./testing-zero-tolerance-pattern.md)
- [Mandatory Test Gate Pattern](./mandatory-test-gate-pattern.md) ⭐ NEW
- [Output Schema Validation Warnings](./4-output-schema-validation-warnings.md)

### Parsing (1)
- [Handlebars Parsing Patterns](./handlebars-parsing-patterns.md)

---

## Patterns by Epic

### Epic 1: Installation & Framework (5) ⭐
- [Installation Registry Pattern](./installation-registry-pattern.md) ⭐ NEW
- [Port Allocation Strategy](./port-allocation-strategy.md) ⭐ NEW
- [Installation Preservation Pattern](./installation-preservation-pattern.md) ⭐ NEW
- [Config Service Single Source of Truth](./config-service-single-source-of-truth.md) (applied)
- [Workflow-Scoped Resource Management](./workflow-scoped-resource-management.md) (applied)

### Epic 2: Prompt Management (2)
- [Unified Schema Structure](./unified-schema-structure.md)
- [Skills Self-Description Format](./skills-self-description-format.md)

### Epic 3: Multi-Workflow Foundation (4)
- [Config Service Single Source of Truth](./config-service-single-source-of-truth.md)
- [API-First Heavy Operations](./api-first-heavy-operations.md)
- [Handlebars Parsing Patterns](./handlebars-parsing-patterns.md)
- [Workflow-Scoped Resource Management](./workflow-scoped-resource-management.md)

### Epic 4: Workflow Orchestration (7)
- [Schema-Based Mock Data Generation](./4-schema-based-mock-data-generation.md)
- [Output Schema Validation Warnings](./4-output-schema-validation-warnings.md)
- [Handlebars Helper Module Pattern](./4-handlebars-helper-module-pattern.md)
- [Section-Based Template Naming](./4-section-based-template-naming.md)
- [Workflow Chain Execution](./4-workflow-chain-execution.md)
- [Field Mapper Pattern](./4-field-mapper-pattern.md)
- [Workflow Data File Persistence](./4-workflowdata-file-persistence.md)

### Epic 0: Maintenance (1)
- [Testing - Zero-Tolerance Pattern](./testing-zero-tolerance-pattern.md)

---

## Pattern Promotion History

### Epic 1 Curation (2026-01-30) ⭐
- **Installation Registry Pattern** - Created from Stories 1.8, 1.11, Bug #6
  - **Justification**: Core multi-installation management pattern, used in 3+ stories/bugs
  - **Impact**: Enables POEM ecosystem across multiple projects

- **Port Allocation Strategy** - Created from Stories 1.7, 1.8, Bug #6
  - **Justification**: Predictable, discoverable convention used in all installations
  - **Impact**: Prevents port conflicts, improves UX

- **Installation Preservation Pattern** - Created from Story 1.9
  - **Justification**: Critical for safe reinstallation, affects all users
  - **Impact**: Prevents data loss during upgrades

### Previous Promotions
- **Zero-Tolerance Pattern** (2026-01-29): Promoted from [Testing - Zero-Tolerance Enforcement Learning](../learnings/testing-zero-tolerance-enforcement-kdd.md)
  - **Justification**: High impact, foundational principle (affects all future testing stories)
  - **Recurrence Count**: 1 (promoted immediately due to critical importance)

---

## Related Documentation

- **[Epic Summaries](../epic-summaries/)** - Epic-level knowledge consolidation
  - [Epic 1: Installation System](../epic-summaries/epic-1-installation-system.md) ⭐ NEW
- **[Learnings Index](../learnings/index.md)** - Story-specific insights that may become patterns
- **[Decisions Index](../decisions/index.md)** - ADRs that define patterns
- **[KDD Main Index](../index.md)** - Knowledge-Driven Development hub

---

**Index maintained by**: Lisa (Librarian)
**Last updated**: 2026-02-27
**Total patterns**: 18 (1 new from health check curation: Mandatory Test Gate)
