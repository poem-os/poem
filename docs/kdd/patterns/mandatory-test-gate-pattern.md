---
# Pattern Template Metadata
domain: "quality-assurance"
topic: "mandatory-test-gate"
status: "Active"
created: "2026-02-27"
story_reference: "Stories 0.7, 1.10, 1.11"
pattern_type: "Process Pattern"
last_updated: "2026-02-27"
recurrence_count: 3
promoted_from:
  - "docs/kdd/learnings/testing-zero-tolerance-enforcement-kdd.md"
  - "docs/kdd/learnings/dev-workflow-process-violation-kdd.md"
  - "docs/kdd/learnings/quality-assurance/advisory-vs-blocking-quality-gates.md"
---

# Mandatory Test Gate Pattern

> **Pattern Type**: Process Pattern
> **Domain**: Quality Assurance
> **Status**: Active
> **Promoted**: 2026-02-27 (recurrence count: 3 — Stories 0.7, 1.10, 1.11)

## Problem

Advisory quality gates are systematically ignored under pressure. When test execution is framed as a recommendation rather than a requirement, agents defer it — producing stories that appear complete but contain failing tests or unverified behaviour.

**Three independent occurrences**:

| Story | Violation | Impact |
|-------|-----------|--------|
| Story 0.7 | 73 non-passing tests left as "acceptable" | QA FAIL, full rework |
| Story 1.11 | Tasks marked complete without writing required unit tests | Self-caught pre-review |
| Story 1.10 | Story committed with 25 failing tests, SAT ran 4/866 tests | User discovered bugs in production |

**Common root cause**: Advisory gates ("DON'T BE LAZY, run tests") are treated as optional suggestions, not requirements. Without a hard block, test execution is the first thing dropped when time is short.

## Solution

**Make test execution mandatory and blocking at every agent handoff point.**

No agent may transition state (mark task complete, mark story Ready for Review, approve SAT, pass QA review) without first running the full test suite and verifying results.

```
Rule: Advisory = MUST. Failing tests = BLOCK, not DEFER.
```

### Dev Agent Gate (before "Ready for Review")

```bash
# REQUIRED before marking any task checkbox ✅
npm test

# ALL of the following must be true:
# ✅ Test count is same or higher than before
# ✅ 0 failing tests
# ✅ 0 skipped tests
# ✅ No regressions in passing count
```

If tests fail: fix the tests before marking the task complete. Do not defer to SAT.

### SAT Gate (before sign-off)

```bash
# Run FULL suite first — before any manual testing
npm test

# Only proceed to manual SAT steps if:
# ✅ Full test suite passes (not just story-specific tests)
# ✅ Integration tests pass (if server running)
```

If tests fail: STOP. Return to Dev agent. Do not sign off.

### QA Agent Gate (before PASS/CONCERNS/FAIL decision)

```bash
# Test-first review: verify tests before reading code
npm test
```

**Automatic FAIL** if:
- Tests are failing at review time
- Test count decreased from previous story baseline
- Skipped tests are present

QA does NOT rubber-stamp. If tests weren't run, the gate is FAIL regardless of code quality.

## When to Apply

Apply this pattern at **every agent transition**:

| Transition | Who checks | What they run |
|-----------|------------|---------------|
| Task → Task | Dev (James) | `npm test` after each task |
| Last task → "Ready for Review" | Dev (James) | `npm test` + verify count |
| Dev → SAT | Tyler | Full `npm test` first |
| SAT → QA | Quinn | `npm test` before code review |
| QA → Done | Quinn | Confirms tests pass in gate decision |

## Implementation Notes

**The deletion principle** (from Zero-Tolerance Pattern): A non-passing test must be either fixed or deleted. There is no middle ground. Marking a test as "acceptable to skip" violates this pattern.

**Regressions count**: If the passing test count decreases compared to the story baseline, that is a failing gate — even if all remaining tests pass.

**Error flood exception**: If the test runner produces an error flood (e.g., missing env var — see `testing-missing-dependency-kdd.md`), fix the infrastructure issue first before evaluating results.

## Evidence

This pattern was promoted after appearing independently in three stories across Epics 0 and 1:

1. **Story 0.7** — `testing-zero-tolerance-enforcement-kdd.md`: Zero-tolerance promise broken, 73 tests left as acceptable. Resolution: deleted all 73 tests. QA PASS (95/100) after deletion.

2. **Story 1.11** — `dev-workflow-process-violation-kdd.md`: Tests marked complete without execution. Self-identified during pre-review checkpoint. Resolved in ~30 minutes (6 new unit tests written).

3. **Story 1.10** — `quality-assurance/advisory-vs-blocking-quality-gates.md`: Story committed with 25 failing tests. SAT ran only 4 of 866 tests. User discovered bugs during real installation. Full rework required.

**Pattern**: In all three cases, test execution was deferred because the gate was advisory. Making it blocking prevents the recurrence.

## Quinn's Enforcement Checklist

When reviewing any story, Quinn should verify:

- [ ] `npm test` output is present in Dev Agent Record
- [ ] Test count at story completion ≥ test count at story start
- [ ] 0 failing tests
- [ ] 0 skipped tests
- [ ] SAT record shows full suite was run (not just story-specific subset)

If any item is unchecked: gate is **FAIL**, not CONCERNS.

## Related

- **[Zero-Tolerance Testing Pattern](./testing-zero-tolerance-pattern.md)** — Companion pattern covering what to do with non-passing tests (delete them)
- **[ADR-012: Test Organization by Directory Structure](../decisions/adr-012-test-organization-by-directory.md)** — How tests are organised to enable selective execution
- **[Testing - Zero-Tolerance Enforcement](../learnings/testing-zero-tolerance-enforcement-kdd.md)** — Story 0.7 learning (source 1)
- **[Development Workflow - Process Violation](../learnings/dev-workflow-process-violation-kdd.md)** — Story 1.11 learning (source 2)
- **[Advisory vs Blocking Quality Gates](../learnings/quality-assurance/advisory-vs-blocking-quality-gates.md)** — Story 1.10 learning (source 3)

---

**Pattern Established**: 2026-02-27
**Promoted from**: 3 learnings (Stories 0.7, 1.10, 1.11)
**Last Updated**: 2026-02-27
