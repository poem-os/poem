# KDD Patterns Index

Reusable architectural patterns, coding conventions, and design patterns extracted from POEM development.

## All Patterns

### Testing Patterns (1)

1. **[Testing - Zero-Tolerance Pattern](./testing-zero-tolerance-pattern.md)** - Story 0.7
   - **Type**: Testing Pattern
   - **Status**: Active
   - **Philosophy**: "If a test does not run, there's no point having a test"
   - **Rule**: Delete all non-passing tests (skipped, flaky, failing) - no exceptions
   - **Enforcement**: Quinn validates 0 skipped tests in QA review

## Patterns by Domain

### Testing (1)
- [Testing - Zero-Tolerance Pattern](./testing-zero-tolerance-pattern.md)

## Patterns by Status

### Active (1)
- [Testing - Zero-Tolerance Pattern](./testing-zero-tolerance-pattern.md)

## Pattern Promotion History

### Promoted from Learnings
- **Zero-Tolerance Pattern** (2026-01-29): Promoted from [Testing - Zero-Tolerance Enforcement Learning](../learnings/testing-zero-tolerance-enforcement-kdd.md)
  - **Justification**: High impact, foundational principle (affects all future testing stories)
  - **Recurrence Count**: 1 (promoted immediately due to critical importance)

## Related Documentation

- [Learnings Index](../learnings/index.md) - Story-specific insights that may become patterns
- [Decisions Index](../decisions/index.md) - ADRs that define patterns
- [ADR-001: Test Organization](../decisions/adr-001-test-organization-by-directory.md) - Complements zero-tolerance pattern

---

**Index maintained by**: Lisa (Librarian)
**Last updated**: 2026-01-29
**Total patterns**: 1
