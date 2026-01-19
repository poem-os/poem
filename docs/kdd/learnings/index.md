# KDD Learnings Index

This directory contains insights and discoveries made during POEM development. Things we learned that weren't obvious from documentation or initial design.

## Purpose

Learnings capture:
- Unexpected behaviors discovered
- Root causes of bugs
- Performance characteristics
- Integration gotchas
- Assumption corrections

## Format

Each learning document should include:
- **Context**: What we were trying to do
- **Challenge**: What went wrong or surprised us
- **Solution**: How we addressed it
- **Outcome**: Results and validation
- **Future Application**: When to apply this learning

## Current Learnings

### Epic 0-2 (Initial Development)

- [Hot Reload in Production Mode](hot-reload-production-mode.md) - POEM_DEV environment variable behavior
- [Slash Command Source Duplication](slash-command-source-duplication.md) - Managing agent definition redundancy

### Epic 3 (Prompt Engineering Agent Foundation)

Epic 3 revealed insights about architecture validation, test maintenance, emergent patterns, and state management.

1. **[Architecture Validation Failure (Story 3.7)](architecture-validation-failure-story-3-7.md)**
   - **Challenge**: Story 3.7 implemented dual-file schemas, deviating from original unified design
   - **Solution**: Story 3.7.1 refactored to unified structure (4-hour effort)
   - **Lesson**: Tests passing ≠ Architecture correct. Need architecture validation step in DoD.

2. **[Test Expectation Maintenance](test-expectation-maintenance.md)**
   - **Challenge**: Workflow changes broke test expectations (8 failures)
   - **Solution**: Co-locate workflow changes with test updates
   - **Lesson**: Test behavior, not structure. Avoid hardcoded step counts/names.

3. **[Discovery Mode Pattern Emergence](discovery-mode-pattern-emergence.md)**
   - **Challenge**: Dev agent organically loaded 4+ architecture docs before implementing
   - **Solution**: Story 3.2.9 formalized Discovery Mode as repeatable pattern
   - **Lesson**: Emergent patterns are valuable. Observe, document, integrate.

4. **[Workflow Persistence Edge Cases](workflow-persistence-edge-cases.md)**
   - **Challenge**: File-based state persistence has 6+ edge cases (ENOENT, parse errors, permissions)
   - **Solution**: Comprehensive error handling with graceful degradation
   - **Lesson**: Simple ≠ Easy. State loss better than crash. Test edge cases thoroughly.

### Epic 4 (YouTube Automation Workflow)

Epic 4 revealed insights about type safety in generation, testing workflows, pattern emergence, and API design.

5. **[Array Type Override in Mock Data Generation](epic4-array-type-override-bug.md)**
   - **Challenge**: Pattern-based detection overrode array types (generated string instead of array)
   - **Solution**: Check field.type BEFORE applying pattern generators
   - **Lesson**: Type hierarchy > Pattern detection. Schema contract > content hint.

6. **[Integration Tests Deferred to SAT Phase](epic4-integration-tests-deferred-to-sat.md)**
   - **Challenge**: Integration tests require running server (5-10 sec startup overhead)
   - **Solution**: Write during development, execute during SAT (Story Acceptance Testing)
   - **Lesson**: Intentional workflow pattern - unit tests (dev) vs integration tests (SAT).

7. **[Section-Based Naming Pattern Emergence](epic4-section-naming-pattern-emergence.md)**
   - **Challenge**: Section-based naming not designed upfront, emerged from YouTube workflow
   - **Solution**: Adopted real-world pattern as POEM convention
   - **Lesson**: Real-world usage reveals patterns design phase misses. Architecture guides, not dictates.

8. **[Helper Metadata Needed for API Discovery](epic4-helper-metadata-api-discovery.md)**
   - **Challenge**: Agents need to discover helpers programmatically, no API endpoint existed
   - **Solution**: Add description/example metadata exports, create `/api/helpers` endpoint
   - **Lesson**: Apply API-First pattern to ALL discoverable resources, not just heavy operations.

---

**Last Updated**: 2026-01-19
**Maintainer**: Dev Agent (updates during KDD task execution)
