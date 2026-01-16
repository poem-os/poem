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

---

**Last Updated**: 2026-01-16
**Maintainer**: Dev Agent (updates during KDD task execution)
