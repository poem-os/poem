# KDD Learnings Index

Documentation of story-specific insights, debugging sessions, incidents, and lessons learned from POEM development.

---

## All Learnings

### Architecture & Design (3)

1. **[Architecture Validation Failure (Story 3.7)](./architecture-validation-failure-story-3-7.md)** - Story 3.7 → 3.7.1
   - **Issue**: Story fully implemented and QA-reviewed but deviated from architecture (dual-file vs unified schema)
   - **Severity**: High
   - **Status**: Resolved (Story 3.7.1 rework, 4 hours)
   - **Key Lesson**: AC ambiguity + architecture drift = full rework. Validate implementation approach against architecture *before* writing code.

2. **[Slash Command Source Duplication](./slash-command-source-duplication.md)** - Stories 3.1, 3.1.5
   - **Issue**: Two source files for same slash command diverged silently (dev file updated, installer source not)
   - **Severity**: Medium
   - **Status**: Resolved (single source in `packages/poem-core/`, sync script created)
   - **Key Lesson**: Any file that exists in two places will diverge. Establish single source + generate.

3. **[Hot-Reload: Dev vs Production Mode](./hot-reload-production-mode.md)** - Story 2.4
   - **Issue**: Open question — should hot-reload be enabled in production builds?
   - **Severity**: Low
   - **Status**: Deferred (can be addressed if performance concerns arise)
   - **Key Lesson**: Defer configuration decisions until there's evidence they're needed.

---

### Testing (8)

4. **[Testing - Missing Dependency](./testing-missing-dependency-kdd.md)** - Story 0.7
   - **Issue**: Missing PORT env variable caused server error flood blocking debugging
   - **Severity**: Medium
   - **Status**: Resolved (PORT=9500 added to .env)
   - **Key Lesson**: Infrastructure errors masquerade as code issues — check configuration first.

5. **[Testing - Zero-Tolerance Enforcement](./testing-zero-tolerance-enforcement-kdd.md)** - Story 0.7
   - **Issue**: Zero-tolerance promise broken (73 non-passing tests left as "acceptable")
   - **Severity**: High
   - **Status**: Resolved — **Pattern Promoted**
   - **Key Lesson**: Zero-tolerance means DELETE, not document or mark acceptable.
   - **Pattern**: [Zero-Tolerance Testing Pattern](../patterns/testing-zero-tolerance-pattern.md) ✅

6. **[Testing - Real Data vs Mock Data](./testing-real-data-vs-mock-data-kdd.md)** - Story 1.12
   - **Issue**: Tests passed with mock data but failed silently in production with real user data
   - **Severity**: Medium
   - **Status**: Resolved (filesystem checked first, not config file)
   - **Key Lesson**: Test against real user directories with messy/legacy data, not just perfect mock data.

7. **[Testing - Infrastructure Challenges](./testing-infrastructure-challenges-kdd.md)** - Story 1.11
   - **Issue**: 8-10 pre-existing test failures in suite unrelated to story being implemented
   - **Severity**: Medium
   - **Status**: Documented (follow-up story planned)
   - **Key Lesson**: Pre-existing failures reduce confidence in new tests. Track and isolate them explicitly.

8. **[Test Expectation Maintenance](./test-expectation-maintenance.md)** - Story 3.7
   - **Issue**: Workflow structure changed but test expectations not updated in same story (expected 12 steps, got 13)
   - **Severity**: Medium
   - **Status**: Resolved (expectations updated, DoD checklist enhanced)
   - **Key Lesson**: When changing workflow structure, search for hardcoded expectations in test files.

9. **[Workflow Data Test Race Condition](./workflow-data-test-race-condition.md)** - Story 4.x (recurring)
   - **Issue**: Async file write from `create()` not complete before `load()` reads — ENOENT flaky test
   - **Severity**: Medium
   - **Status**: Documented — **Recurrence Count: 2** (watch for 3rd)
   - **Key Lesson**: File-based async ops need existence verification before read.

10. **[Development Workflow - Process Violation](./dev-workflow-process-violation-kdd.md)** - Story 1.11
    - **Issue**: Developer marked tasks complete without writing required unit tests
    - **Severity**: High
    - **Status**: Resolved — **Pattern Promoted**
    - **Key Lesson**: Advisory quality gates are ignored under pressure. Must be blocking.
    - **Pattern**: [Mandatory Test Gate Pattern](../patterns/mandatory-test-gate-pattern.md) ✅

11. **[Epic 4 - Integration Tests Deferred to SAT](./epic4-integration-tests-deferred-to-sat.md)** - Stories 4.5, 4.6
    - **Issue**: Integration tests require server startup — execution deferred to SAT phase
    - **Severity**: Low
    - **Status**: Resolved (established workflow pattern: write during dev, run during SAT)
    - **Key Lesson**: Write integration tests during development (document intent); execute during SAT.

---

### Quality Assurance (1)

12. **[Advisory vs Blocking Quality Gates](./quality-assurance/advisory-vs-blocking-quality-gates.md)** - Story 1.10
    - **Issue**: Story committed with 25 failing tests — all quality gates bypassed/rubber-stamped
    - **Severity**: Critical
    - **Status**: Resolved — **Pattern Promoted**
    - **Key Lesson**: Advisory quality gates will be ignored. Test execution must be mandatory and blocking.
    - **Pattern**: [Mandatory Test Gate Pattern](../patterns/mandatory-test-gate-pattern.md) ✅

---

### Patterns & Process (3)

13. **[Discovery Mode Pattern Emergence](./discovery-mode-pattern-emergence.md)** - Story 3.2.9
    - **Issue**: Useful capability (loading architecture docs before coding) emerged unplanned during Story 3.2
    - **Severity**: Low (positive discovery)
    - **Status**: Resolved (Story 3.2.9 created, Discovery Mode now standard practice)
    - **Key Lesson**: Capture emergent patterns immediately — retroactive story creation is worth it.

14. **[Epic 4 - Section Naming Pattern Emergence](./epic4-section-naming-pattern-emergence.md)** - Story 4.1
    - **Issue**: 53 imported templates used `{section}-{sequence}-{description}.hbs` — not in original architecture
    - **Severity**: Low (positive adoption)
    - **Status**: Resolved — **Pattern Promoted**
    - **Key Lesson**: Real-world data reveals design assumptions. Adopt patterns that emerge from actual usage.
    - **Pattern**: [Section-Based Template Naming](../patterns/4-section-based-template-naming.md) ✅

---

### Edge Cases & Bugs (3)

15. **[Epic 4 - Array Type Override Bug](./epic4-array-type-override-bug.md)** - Story 4.3
    - **Issue**: Pattern-based field detection (field name contains "chapter") overriding declared array types
    - **Severity**: Medium
    - **Status**: Resolved (check field.type BEFORE applying pattern detection)
    - **Key Lesson**: Type declarations must take priority over name-based pattern matching.

16. **[Epic 4 - Helper Metadata API Discovery](./epic4-helper-metadata-api-discovery.md)** - Story 4.4
    - **Issue**: Helpers implemented without metadata — agents couldn't discover what helpers were available
    - **Severity**: Medium
    - **Status**: Resolved (metadata exports added, `/api/helpers` endpoint created)
    - **Key Lesson**: Agent-facing APIs need discoverability metadata from day one.

17. **[Workflow Persistence Edge Cases](./workflow-persistence-edge-cases.md)** - Story 3.8
    - **Issue**: File-based state persistence discovered 6 edge cases (ENOENT, corrupted JSON, permission errors, race conditions)
    - **Severity**: Low (all handled comprehensively)
    - **Status**: Resolved (graceful degradation for all 6 cases)
    - **Key Lesson**: File persistence has more failure modes than a database. Handle all of them explicitly.

---

### Deployment (1)

18. **[CORS Issue](./deployment/cors-issue-kdd.md)**
    - **Note**: Example/placeholder file for KDD Workflow Guide documentation. Not a real POEM issue.

---

## Learnings by Severity

### Critical (1)
- [Advisory vs Blocking Quality Gates](./quality-assurance/advisory-vs-blocking-quality-gates.md)

### High (2)
- [Testing - Zero-Tolerance Enforcement](./testing-zero-tolerance-enforcement-kdd.md)
- [Development Workflow - Process Violation](./dev-workflow-process-violation-kdd.md)

### Medium (9)
- [Architecture Validation Failure](./architecture-validation-failure-story-3-7.md)
- [Slash Command Source Duplication](./slash-command-source-duplication.md)
- [Testing - Missing Dependency](./testing-missing-dependency-kdd.md)
- [Testing - Real Data vs Mock Data](./testing-real-data-vs-mock-data-kdd.md)
- [Testing - Infrastructure Challenges](./testing-infrastructure-challenges-kdd.md)
- [Test Expectation Maintenance](./test-expectation-maintenance.md)
- [Workflow Data Test Race Condition](./workflow-data-test-race-condition.md)
- [Epic 4 - Array Type Override Bug](./epic4-array-type-override-bug.md)
- [Epic 4 - Helper Metadata API Discovery](./epic4-helper-metadata-api-discovery.md)

### Low (5)
- [Hot-Reload: Dev vs Production Mode](./hot-reload-production-mode.md)
- [Epic 4 - Integration Tests Deferred to SAT](./epic4-integration-tests-deferred-to-sat.md)
- [Discovery Mode Pattern Emergence](./discovery-mode-pattern-emergence.md)
- [Epic 4 - Section Naming Pattern Emergence](./epic4-section-naming-pattern-emergence.md)
- [Workflow Persistence Edge Cases](./workflow-persistence-edge-cases.md)

---

## Pattern Promotion Status

### Promoted to Patterns
- **[Zero-Tolerance Enforcement](./testing-zero-tolerance-enforcement-kdd.md)** → [Zero-Tolerance Testing Pattern](../patterns/testing-zero-tolerance-pattern.md)
- **[Process Violation](./dev-workflow-process-violation-kdd.md)** → [Mandatory Test Gate Pattern](../patterns/mandatory-test-gate-pattern.md)
- **[Advisory vs Blocking QA Gates](./quality-assurance/advisory-vs-blocking-quality-gates.md)** → [Mandatory Test Gate Pattern](../patterns/mandatory-test-gate-pattern.md)
- **[Section Naming Emergence](./epic4-section-naming-pattern-emergence.md)** → [Section-Based Template Naming](../patterns/4-section-based-template-naming.md)

### Monitoring (Recurrence Count = 2)
- [Workflow Data Test Race Condition](./workflow-data-test-race-condition.md) ← **Promote if seen again**

---

**Index maintained by**: Lisa (Librarian)
**Last updated**: 2026-02-27
**Total learnings**: 17 active (+ 1 example placeholder)
