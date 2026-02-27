# KDD Decisions Index

Architecture Decision Records (ADRs) documenting significant technical decisions made during POEM development.

---

## All ADRs

### ADR-001: [Unified Schema Structure](./adr-001-unified-schema-structure.md)
- **Status**: Accepted
- **Date**: 2026-01-12
- **Story**: Story 3.7.1
- **Decision**: Adopt unified schema structure (input + output in single file) treating prompts as function signatures, replacing the dual-file approach implemented in Story 3.7.
- **Pattern**: [Unified Schema Structure](../patterns/unified-schema-structure.md)

### ADR-002: [Multi-Workflow Architecture](./adr-002-multi-workflow-architecture.md)
- **Status**: Accepted
- **Date**: 2026-01-15
- **Story**: Story 3.8
- **Decision**: Implement workflow-scoped resource management enabling multiple independent prompt collections in a single POEM instance with hot-switchable context.
- **Pattern**: [Workflow-Scoped Resource Management](../patterns/workflow-scoped-resource-management.md)

### ADR-003: [API-First for Heavy Operations](./adr-003-api-first-for-heavy-operations.md)
- **Status**: Accepted
- **Date**: 2026-01-15
- **Story**: Story 3.7
- **Decision**: All operations >10ms (rendering, validation, schema extraction) go through HTTP API endpoints, not direct service imports.
- **Pattern**: [API-First Heavy Operations](../patterns/api-first-heavy-operations.md)

### ADR-004: [Skills as Markdown Documentation](./adr-004-skills-as-markdown-documentation.md)
- **Status**: Accepted
- **Date**: 2026-01-17
- **Story**: Story 3.6
- **Decision**: Define skills as markdown documentation with "When to Use" sections for autonomous LLM activation, rather than executable code.
- **Pattern**: [Skills Self-Description Format](../patterns/skills-self-description-format.md)

### ADR-005: [Mock Data Generation with Faker.js](./adr-005-mock-data-generation-fakerjs.md)
- **Status**: Accepted
- **Date**: 2026-01-20
- **Story**: Story 4.1 / 4.3
- **Decision**: Use Faker.js as core generation engine augmented with pattern-based domain-specific generators (YouTube timestamps, chapters, etc.).
- **Pattern**: [Schema-Based Mock Data Generation](../patterns/4-schema-based-mock-data-generation.md)

### ADR-006: [Field Mapper Architecture for Prompt Chaining](./adr-006-field-mapper-architecture.md)
- **Status**: Accepted
- **Date**: 2026-01-22
- **Story**: Story 4.6
- **Decision**: Use optional mapper objects in chain definitions to translate prompt output field names to workflow attribute names, preventing namespace collisions.
- **Pattern**: [Field Mapper Pattern](../patterns/4-field-mapper-pattern.md)

### ADR-007: [ESM Helpers with Hot-Reload via Chokidar](./adr-007-esm-helpers-hot-reload.md)
- **Status**: Accepted
- **Date**: 2026-01-22
- **Story**: Story 4.4
- **Decision**: Implement Handlebars helpers as ESM modules with `import.meta.glob` auto-loading and chokidar hot-reload for development without server restart.
- **Pattern**: [Handlebars Helper Module Pattern](../patterns/4-handlebars-helper-module-pattern.md)

### ADR-008: [File-Based Workflow Persistence over Database](./adr-008-file-based-workflow-persistence.md)
- **Status**: Accepted
- **Date**: 2026-01-23
- **Story**: Story 4.7
- **Decision**: Choose JSON files over a database for workflow state persistence — aligns with POEM's file-based philosophy, enables human-readable debugging, zero infrastructure.
- **Pattern**: [WorkflowData File-Based Persistence](../patterns/4-workflowdata-file-persistence.md)

### ADR-009: [Fixed KDD Taxonomy for POEM](./adr-009-fixed-kdd-taxonomy.md)
- **Status**: Accepted
- **Date**: 2026-01-26
- **Story**: Story 0.3 (Librarian)
- **Decision**: Establish fixed four-category KDD taxonomy (patterns, learnings, decisions, examples) rather than meta-driven configuration, for consistent cross-project knowledge organisation.

### ADR-010: [Story Files as Single Source of Truth](./adr-010-handover-documents-vs-story-files.md)
- **Status**: Accepted
- **Date**: 2026-01-30
- **Story**: Story 1.12
- **Decision**: Prohibit handover documents in `.ai/` directory. Story files are the single definitive record for all implementation details.
- **Related Policy**: [.ai/ Directory Usage Policy](../../../.ai/README.md)

### ADR-011: [Pre-commit Hook Testing Strategy](./adr-011-pre-commit-testing-strategy.md)
- **Status**: Accepted
- **Date**: 2026-02-03
- **Story**: Story 0.7 / maintenance
- **Decision**: Remove unit tests from pre-commit hook (keep only gitleaks + conditional KDD validation), delegating comprehensive testing to CI/CD for better developer experience.

### ADR-012: [Test Organization by Directory Structure](./adr-012-test-organization-by-directory.md)
- **Status**: Accepted
- **Date**: 2026-01-29
- **Story**: Story 0.7
- **Decision**: Organise tests by directory (`tests/unit/` and `tests/integration/`) based on server dependency, enabling selective test execution.
- **Pattern**: [Zero-Tolerance Testing Pattern](../patterns/testing-zero-tolerance-pattern.md)

---

## ADRs by Status

### Accepted (12)
- [ADR-001: Unified Schema Structure](./adr-001-unified-schema-structure.md)
- [ADR-002: Multi-Workflow Architecture](./adr-002-multi-workflow-architecture.md)
- [ADR-003: API-First for Heavy Operations](./adr-003-api-first-for-heavy-operations.md)
- [ADR-004: Skills as Markdown Documentation](./adr-004-skills-as-markdown-documentation.md)
- [ADR-005: Mock Data Generation with Faker.js](./adr-005-mock-data-generation-fakerjs.md)
- [ADR-006: Field Mapper Architecture](./adr-006-field-mapper-architecture.md)
- [ADR-007: ESM Helpers with Hot-Reload](./adr-007-esm-helpers-hot-reload.md)
- [ADR-008: File-Based Workflow Persistence](./adr-008-file-based-workflow-persistence.md)
- [ADR-009: Fixed KDD Taxonomy](./adr-009-fixed-kdd-taxonomy.md)
- [ADR-010: Story Files as Single Source of Truth](./adr-010-handover-documents-vs-story-files.md)
- [ADR-011: Pre-commit Hook Testing Strategy](./adr-011-pre-commit-testing-strategy.md)
- [ADR-012: Test Organization by Directory Structure](./adr-012-test-organization-by-directory.md)

---

## ADRs by Epic

### Epic 0 / Maintenance (2)
- [ADR-009: Fixed KDD Taxonomy](./adr-009-fixed-kdd-taxonomy.md)
- [ADR-012: Test Organization by Directory Structure](./adr-012-test-organization-by-directory.md)

### Epic 1: Installation & Framework (2)
- [ADR-010: Story Files as Single Source of Truth](./adr-010-handover-documents-vs-story-files.md)
- [ADR-011: Pre-commit Hook Testing Strategy](./adr-011-pre-commit-testing-strategy.md)

### Epic 2: Prompt Management (1)
- [ADR-004: Skills as Markdown Documentation](./adr-004-skills-as-markdown-documentation.md)

### Epic 3: Multi-Workflow Foundation (4)
- [ADR-001: Unified Schema Structure](./adr-001-unified-schema-structure.md)
- [ADR-002: Multi-Workflow Architecture](./adr-002-multi-workflow-architecture.md)
- [ADR-003: API-First for Heavy Operations](./adr-003-api-first-for-heavy-operations.md)

### Epic 4: Workflow Orchestration (5)
- [ADR-005: Mock Data Generation with Faker.js](./adr-005-mock-data-generation-fakerjs.md)
- [ADR-006: Field Mapper Architecture](./adr-006-field-mapper-architecture.md)
- [ADR-007: ESM Helpers with Hot-Reload](./adr-007-esm-helpers-hot-reload.md)
- [ADR-008: File-Based Workflow Persistence](./adr-008-file-based-workflow-persistence.md)

---

## Pattern Backing Map

Each ADR that backs a pattern:

| ADR | Pattern |
|-----|---------|
| ADR-001 | [Unified Schema Structure](../patterns/unified-schema-structure.md) |
| ADR-002 | [Workflow-Scoped Resource Management](../patterns/workflow-scoped-resource-management.md) |
| ADR-003 | [API-First Heavy Operations](../patterns/api-first-heavy-operations.md) |
| ADR-004 | [Skills Self-Description Format](../patterns/skills-self-description-format.md) |
| ADR-005 | [Schema-Based Mock Data Generation](../patterns/4-schema-based-mock-data-generation.md) |
| ADR-006 | [Field Mapper Pattern](../patterns/4-field-mapper-pattern.md) |
| ADR-007 | [Handlebars Helper Module Pattern](../patterns/4-handlebars-helper-module-pattern.md) |
| ADR-008 | [WorkflowData File-Based Persistence](../patterns/4-workflowdata-file-persistence.md) |
| ADR-012 | [Zero-Tolerance Testing Pattern](../patterns/testing-zero-tolerance-pattern.md) |

---

**Index maintained by**: Lisa (Librarian)
**Last updated**: 2026-02-27
**Total ADRs**: 12 active (+ 1 example placeholder: adr-042-jwt-authentication.md)
