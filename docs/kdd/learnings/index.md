# KDD Learnings Index

Documentation of story-specific insights, debugging sessions, incidents, and lessons learned from POEM development.

## All Learnings

### Testing Category

1. **[Testing - Missing Dependency](./testing-missing-dependency-kdd.md)** - Story 0.7
   - **Issue**: Missing PORT environment variable causing server error flood
   - **Severity**: Medium
   - **Status**: Resolved
   - **Key Lesson**: Infrastructure errors can masquerade as code issues - check configuration first

2. **[Testing - Zero-Tolerance Enforcement](./testing-zero-tolerance-enforcement-kdd.md)** - Story 0.7
   - **Issue**: Zero-tolerance promise broken (73 non-passing tests left "acceptable")
   - **Severity**: High
   - **Status**: Resolved (Pattern promoted)
   - **Key Lesson**: Zero-tolerance means DELETE, not document or mark as "acceptable"
   - **Pattern**: [Zero-Tolerance Testing Pattern](../patterns/testing-zero-tolerance-pattern.md) (to be created)

3. **[Testing - Real Data vs Mock Data](./testing-real-data-vs-mock-data-kdd.md)** - Story 1.12
   - **Issue**: Mock data tests passed but real user data exposed function bug
   - **Severity**: Medium
   - **Status**: Resolved
   - **Key Lesson**: Test against real user directories with messy/legacy data, not just perfect mock data

## Learnings by Category

### Testing (3)
- [Testing - Missing Dependency](./testing-missing-dependency-kdd.md)
- [Testing - Zero-Tolerance Enforcement](./testing-zero-tolerance-enforcement-kdd.md)
- [Testing - Real Data vs Mock Data](./testing-real-data-vs-mock-data-kdd.md)

## Learnings by Severity

### High (1)
- [Testing - Zero-Tolerance Enforcement](./testing-zero-tolerance-enforcement-kdd.md)

### Medium (2)
- [Testing - Missing Dependency](./testing-missing-dependency-kdd.md)
- [Testing - Real Data vs Mock Data](./testing-real-data-vs-mock-data-kdd.md)

## Learnings by Status

### Resolved (3)
- [Testing - Missing Dependency](./testing-missing-dependency-kdd.md)
- [Testing - Zero-Tolerance Enforcement](./testing-zero-tolerance-enforcement-kdd.md)
- [Testing - Real Data vs Mock Data](./testing-real-data-vs-mock-data-kdd.md)

## Pattern Promotion Candidates

### Promoted
- **[Zero-Tolerance Enforcement](./testing-zero-tolerance-enforcement-kdd.md)** → Pattern: [Zero-Tolerance Testing Pattern](../patterns/testing-zero-tolerance-pattern.md) (to be created)

### Monitoring (Recurrence Count = 1, not yet promoted)
- [Testing - Missing Dependency](./testing-missing-dependency-kdd.md)
- [Testing - Real Data vs Mock Data](./testing-real-data-vs-mock-data-kdd.md) ← **Pattern candidate if recurs 2+ more times**

---

**Index maintained by**: Lisa (Librarian)
**Last updated**: 2026-01-29
**Total learnings**: 2
