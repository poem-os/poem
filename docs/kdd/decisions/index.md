# KDD Decisions Index

This directory contains Architecture Decision Records (ADRs) and significant technical decisions made during POEM development.

## Purpose

Decision documents capture:
- Significant technical choices
- Alternatives considered
- Trade-offs evaluated
- Rationale for chosen approach
- Consequences and implications

## Format

ADRs follow this structure:
- **Title**: Short descriptive name
- **Status**: Proposed | Accepted | Deprecated | Superseded
- **Context**: Problem or situation requiring a decision
- **Decision**: What we decided to do
- **Alternatives Considered**: Options evaluated
- **Rationale**: Why this approach was chosen
- **Consequences**: Expected outcomes, trade-offs, risks

## Naming Convention

`adr-NNN-short-title.md` where NNN is a sequential number (e.g., `adr-001-unified-schema-structure.md`)

## Current Decisions

### Epic 3 Decisions (Prompt Engineering Agent Foundation)

Epic 3 established four foundational architectural decisions that shape POEM's agent-driven development approach.

1. **[ADR-001: Unified Schema Structure](adr-001-unified-schema-structure.md)** (Story 3.7.1)
   - **Decision**: Schemas use unified structure with input/output sections in single file
   - **Rationale**: Prompts are like function signatures `(input) -> output`
   - **Replaces**: Dual-file approach from Story 3.7
   - **Status**: Accepted (153 tests passing, QA approved)

2. **[ADR-002: Multi-Workflow Architecture](adr-002-multi-workflow-architecture.md)** (Story 3.8)
   - **Decision**: Workflow-scoped directories with hot-switchable context
   - **Rationale**: Real-world usage requires multiple independent workflows
   - **Status**: Accepted Phase 1 (Phase 2 planned for Story 4.9)
   - **Impact**: Enables YouTube, NanoBanana, SupportSignal workflows in one workspace

3. **[ADR-003: API-First for Heavy Operations](adr-003-api-first-for-heavy-operations.md)** (Stories 3.2-3.7)
   - **Decision**: Route expensive operations (>10ms) through Astro API endpoints
   - **Rationale**: Testability, external integration, loose coupling
   - **Status**: Accepted (5 API endpoints created)
   - **Pattern**: Agents call HTTP APIs, not TypeScript imports

4. **[ADR-004: Skills as Markdown Documentation](adr-004-skills-as-markdown-documentation.md)** (Stories 3.5-3.6)
   - **Decision**: Skills are markdown files with 8-section format, not executable code
   - **Rationale**: LLM-native format, context-aware activation, self-documenting
   - **Status**: Accepted (7 skills created)
   - **Key Innovation**: "When to Use" section enables autonomous activation

### Epic 4 Decisions (YouTube Automation Workflow)

Epic 4 established decisions for mock data generation, prompt chaining, helper management, and workflow persistence.

5. **[ADR-005: Mock Data Generation with Faker.js](adr-005-mock-data-generation-fakerjs.md)** (Story 4.3)
   - **Decision**: Use @faker-js/faker with domain-specific generators
   - **Rationale**: Mature library (45K stars), TypeScript support, deterministic seeding
   - **Status**: Accepted (61/61 tests passing)
   - **Key Innovation**: Pattern-based field detection for YouTube-specific content

6. **[ADR-006: Field Mapper Architecture for Prompt Chaining](adr-006-field-mapper-architecture.md)** (Story 4.6)
   - **Decision**: Optional mappers translate prompt field names to workflow attributes
   - **Rationale**: Enables prompt reusability with generic names, prevents collisions
   - **Status**: Accepted (28/28 chain executor tests passing)
   - **Alternative Rejected**: Step ID prefixing (couples workflow-data to chain structure)

7. **[ADR-007: ESM Helpers with Hot-Reload via Chokidar](adr-007-esm-helpers-hot-reload.md)** (Story 4.4)
   - **Decision**: ESM modules with import.meta.glob + chokidar watcher
   - **Rationale**: Vite compatibility, hot-reload DX, API-accessible metadata
   - **Status**: Accepted (146/146 tests passing, 18 watcher tests)
   - **Key Innovation**: Helper metadata exports for agent discovery

8. **[ADR-008: File-Based Workflow Persistence over Database](adr-008-file-based-workflow-persistence.md)** (Story 4.6)
   - **Decision**: Pretty-printed JSON files in dev-workspace/workflow-data/
   - **Rationale**: Human-readable, zero infrastructure, crash recovery built-in
   - **Status**: Accepted (17/17 persistence tests passing)
   - **Alternative Rejected**: SQLite (binary format defeats human-readability)

---

**Last Updated**: 2026-01-19
**Maintainer**: Dev Agent (updates during KDD task execution)
