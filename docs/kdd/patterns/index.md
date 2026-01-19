# KDD Patterns Index

This directory contains reusable code patterns and approaches that work well in the POEM codebase.

## Purpose

Patterns document:
- Architectural patterns established
- Code organization conventions
- Testing strategies
- Integration patterns
- Anti-patterns to avoid

## Format

Each pattern document should include:
- **Context**: When to use this pattern
- **Implementation**: How to implement it
- **Example**: Working code demonstrating the pattern
- **Rationale**: Why this approach was chosen
- **Related Patterns**: Cross-references to similar patterns

## Current Patterns

### Core Patterns

- [Handlebars Parsing Patterns](handlebars-parsing-patterns.md) - Template parsing and placeholder extraction

### Epic 3 Patterns (Prompt Engineering Agent Foundation)

Epic 3 established foundational patterns for the Prompt Engineer agent (Penny) and workflow management system.

1. **[Config Service Single Source of Truth](config-service-single-source-of-truth.md)** (Stories 3.2.5, 3.8)
   - Centralize all workspace path definitions in config service
   - Workflows/agents inherit paths without duplication
   - Enables multi-workflow support without touching 15+ files

2. **[Unified Schema Structure](unified-schema-structure.md)** (Stories 3.7, 3.7.1)
   - Schemas as function signatures: `(input) -> output` in single file
   - Corrects Story 3.7's dual-file approach (architectural alignment)
   - Makes prompt contracts explicit and chainable

3. **[Skills Self-Description Format](skills-self-description-format.md)** (Stories 3.5, 3.6)
   - 8-section markdown format for autonomous agent capabilities
   - "When to Use" enables context-aware skill activation
   - API-integrated, single-responsibility, self-documenting

4. **[API-First Heavy Operations](api-first-heavy-operations.md)** (Stories 3.2, 3.3, 3.4, 3.7)
   - Route expensive operations (rendering, validation) through Astro APIs
   - Agents call HTTP endpoints, not TypeScript imports
   - Testability, external integration, clear contracts

5. **[Workflow-Scoped Resource Management](workflow-scoped-resource-management.md)** (Story 3.8)
   - Isolate prompts/schemas in workflow-specific directories
   - Hot-switchable context with persistent workflow selection
   - Supports multiple independent projects in one workspace

### Epic 4 Patterns (YouTube Automation Workflow - System Validation)

Epic 4 validated POEM with real-world YouTube workflow (53 templates), establishing patterns for mock data generation, prompt chaining, and helper management.

1. **[Schema-Based Mock Data Generation](4-schema-based-mock-data-generation.md)** (Story 4.3)
   - Use UnifiedSchema to generate realistic test data with Faker.js
   - Pattern-based field detection for domain-specific content
   - Constraint satisfaction (minLength, maxLength) + reproducibility via seeds

2. **[Field Mapper Pattern](4-field-mapper-pattern.md)** (Story 4.6)
   - Translate prompt output names to workflow attribute names
   - Prevents collisions when multiple prompts output similar fields
   - Enables prompt reusability with generic names

3. **[Workflow Chain Execution](4-workflow-chain-execution.md)** (Story 4.6)
   - Sequential prompt execution with progressive data accumulation
   - File-based persistence enables pause/resume and crash recovery
   - Execution history tracks what ran, when, and what it produced

4. **[Handlebars Helper Module Pattern](4-handlebars-helper-module-pattern.md)** (Story 4.4)
   - ESM helpers with self-describing metadata (description, example)
   - Auto-loading via import.meta.glob + hot-reload with chokidar
   - API-accessible for agent-driven development

5. **[Section-Based Template Naming](4-section-based-template-naming.md)** (Story 4.1)
   - Organize templates with `{section}-{sequence}-{description}.hbs` pattern
   - Encodes workflow phase and execution order in filename
   - Scales to 50+ templates with visual grouping

6. **[Output Schema Validation as Warnings](4-output-schema-validation-warnings.md)** (Story 4.5)
   - Validate rendered output against output schema section
   - Report violations as warnings (not errors) for graceful degradation
   - Enables debugging without breaking workflows

7. **[WorkflowData File-Based Persistence](4-workflowdata-file-persistence.md)** (Story 4.6)
   - Store workflow state as pretty-printed JSON files
   - Human-readable execution logs + crash recovery
   - No database dependencies (file-based philosophy)

---

**Last Updated**: 2026-01-19
**Maintainer**: Dev Agent (updates during KDD task execution)
