---
# Architecture Decision Record Metadata
adr_number: "001"
title: "Test Organization by Directory Structure"
status: "Accepted"
created: "2026-01-29"
decision_date: "2026-01-29"
story_reference: "Story 0.7"
authors: ["James (Developer)", "Quinn (Test Architect)"]
supersedes: null
superseded_by: null
---

# ADR-001: Test Organization by Directory Structure

> **Status**: Accepted
> **Date**: 2026-01-29
> **Story**: Story 0.7

## Status

**ACCEPTED** - 2026-01-29

Implemented in Story 0.7 as part of test infrastructure improvements.

## Context

### Background
POEM had 850+ tests in a flat directory structure (`packages/poem-app/tests/*.test.ts`) with no clear organization. Tests were mixed between:
- Unit tests (no server required, fast)
- Integration tests (requires server, slower)

This lack of organization made it difficult to:
- Run only unit tests (for fast feedback during development)
- Run only integration tests (which require server setup)
- Understand test dependencies at a glance

### Problem Statement
**How should we organize tests to clearly separate unit tests from integration tests, enable selective test execution, and improve discoverability?**

### Forces at Play
- **Force 1**: Developer experience - Need fast feedback loop during development (unit tests only)
- **Force 2**: CI/CD efficiency - Want to run unit tests first (fast fail), integration tests second
- **Force 3**: Discoverability - Developers should understand test type by location, not by reading test code
- **Force 4**: Consistency - Pattern should be simple, enforceable, and follow industry conventions

### Assumptions
- Test framework (Vitest) supports directory-based test filtering
- Unit tests can be clearly distinguished from integration tests (server dependency is the criterion)
- Test organization won't require significant test code changes (only file moves)

### Constraints
- Cannot break existing test execution (`npm test` must run all tests)
- Must preserve git history when moving files
- Integration tests must spawn their own servers (don't require manual server start)

## Decision

**We will organize tests by directory structure: `tests/unit/` for unit tests and `tests/integration/` for integration tests.**

### Detailed Decision
1. **Directory Structure**:
   ```
   packages/poem-app/tests/
   ├── unit/                    # Unit tests (no server required)
   │   ├── services/
   │   ├── utils/
   │   └── helpers/
   ├── integration/             # Integration tests (requires server)
   │   ├── api/
   │   ├── workflows/
   │   └── file-operations/
   └── fixtures/                # Shared test data
   ```

2. **Separation Criterion**: **Server dependency**
   - Unit tests: No server required, isolated, fast (<100ms per test)
   - Integration tests: Requires server, tests API endpoints/workflows, slower (>100ms per test)

3. **npm Scripts**:
   ```json
   {
     "test:unit": "vitest run tests/unit",
     "test:integration": "vitest run tests/integration",
     "test": "vitest run"
   }
   ```

4. **Migration Strategy**:
   - Use `git mv` to preserve file history
   - Update import paths in moved tests
   - Verify all tests still pass after migration

### Scope
- **In Scope**: Test file organization, npm scripts, documentation
- **Out of Scope**: Test code refactoring, changing test framework, test coverage improvements

## Alternatives Considered

### Alternative 1: File Naming Convention (Suffix-Based)
Organize tests by filename suffix: `*.unit.test.ts` vs `*.integration.test.ts`

**Pros**:
- ✅ No directory changes required
- ✅ Tests stay in same location

**Cons**:
- ❌ Harder to filter in file explorers
- ❌ Requires grep/glob patterns for npm scripts
- ❌ Less discoverable (need to read filename carefully)
- ❌ Doesn't scale well (still flat directory with 850+ files)

**Why Not Chosen**: Directory structure provides better visual organization and easier filtering.

### Alternative 2: Separate Test Projects (Workspaces)
Create separate npm packages: `@poem-os/unit-tests` and `@poem-os/integration-tests`

**Pros**:
- ✅ Complete separation of concerns
- ✅ Independent test configurations possible

**Cons**:
- ❌ Overhead of managing multiple packages
- ❌ Shared test fixtures become complex
- ❌ Harder to run all tests together
- ❌ Over-engineering for current needs

**Why Not Chosen**: Too complex for POEM's current scale. Directory structure provides sufficient separation.

### Alternative 3: Status Quo (Flat Directory)
Keep all tests in flat `tests/` directory, rely on developers to know which are unit vs integration

**Pros**:
- ✅ No migration effort

**Cons**:
- ❌ Problem remains unsolved
- ❌ Cannot selectively run unit tests for fast feedback
- ❌ Discoverability poor (850+ files in flat directory)
- ❌ Harder to enforce separation (developers might mix concerns)

**Why Not Chosen**: Problem is actively blocking developer productivity and CI/CD optimization.

## Rationale

### Why This Decision?
Directory-based organization is the **industry standard** for test organization in JavaScript/TypeScript projects. It provides:
1. **Clear visual separation** - Developers see test type at a glance
2. **Simple filtering** - npm scripts use directory paths (no complex glob patterns)
3. **Scalability** - Subdirectories within unit/ and integration/ prevent flat directory growth
4. **Tooling support** - IDEs, file explorers, CI/CD tools work naturally with directory structure

### Decision Criteria
| Criterion | Directory Structure | Suffix-Based | Separate Projects |
|-----------|---------------------|--------------|-------------------|
| Discoverability | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Ease of Filtering | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| Migration Effort | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| Scalability | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ |
| Industry Standard | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

**Winner**: Directory Structure (highest total score)

### Alignment
- **Technical Strategy**: Follows Node.js/TypeScript ecosystem best practices
- **Business Goals**: Improves developer productivity (fast unit test feedback)
- **Architectural Principles**: Clear separation of concerns, discoverability

### Risk Mitigation
- **Risk**: Breaking tests during migration
- **Mitigation**: Use `git mv` to preserve history, verify all tests pass after each batch of moves
- **Risk**: Import paths break after directory changes
- **Mitigation**: Systematic import path updates, verify with ESLint

## Consequences

### Positive Consequences
- ✅ **Faster Development Feedback**: Developers run `npm run test:unit` for quick validation (<5s vs >30s for all tests)
- ✅ **Better CI/CD Pipeline**: Run unit tests first (fast fail), integration tests second (slower but comprehensive)
- ✅ **Improved Discoverability**: Test type immediately clear from file path
- ✅ **Scalability**: Subdirectories prevent flat directory sprawl (currently 32 unit files, 2 integration files)

### Negative Consequences
- ⚠️ **Migration Effort**: Required moving 41 test files and updating import paths (~2 hours of work in Story 0.7)
- ⚠️ **Learning Curve**: Developers must understand new directory structure (minimal - documented in README)

### Technical Debt
**No technical debt introduced.** This decision pays down existing organizational debt (flat directory sprawl).

### Impact on Stories
**Future stories must**:
- Place unit tests in `tests/unit/` subdirectories
- Place integration tests in `tests/integration/` subdirectories
- Update both unit and integration tests when changing functionality

Quinn (QA) will enforce this pattern during code review.

### Reversibility
**Can this decision be reversed?** Partially

**Reversal cost**: Low
- Move files back to flat directory
- Remove npm scripts
- Update documentation

**However, reversal unlikely** because:
- Pattern is industry standard
- Benefits are immediate and measurable
- No downsides discovered after implementation

## Implementation

### Affected Components
- `packages/poem-app/tests/` - All test files reorganized
- `packages/poem-app/package.json` - New npm scripts added
- `packages/poem-app/vitest.config.ts` - No changes required (supports directory filtering)
- Documentation:
  - `packages/poem-app/tests/README.md` - Created (test organization guide)
  - `docs/guides/integration-test-setup.md` - Created (integration test prerequisites)

### Required Changes
- **Code Changes**: Test files moved (git mv), import paths updated
- **Infrastructure Changes**: npm scripts added (test:unit, test:integration)
- **Process Changes**: Developers run `test:unit` during development, `test` before commits

### Timeline
- **Decision Date**: 2026-01-29
- **Implementation Start**: 2026-01-29 (Story 0.7 Task 2)
- **Expected Completion**: 2026-01-29 (Story 0.7 Task 2)
- **Review Date**: 2026-04-01 (re-evaluate after 3 months of usage)

### Success Criteria
How will we know this decision was successful?
- ✅ **Test Execution Speed**: Unit tests run in <5 seconds
- ✅ **Developer Adoption**: Developers use `npm run test:unit` during development (observed via CI logs)
- ✅ **Zero Violations**: All new tests placed in correct directories (enforced by Quinn during QA)
- ✅ **Discoverability**: New developers understand test organization without asking questions

**Story 0.7 Results**:
- ✅ Unit tests: 735/735 passing in 1.52s (fast) ✅
- ✅ Integration tests: 21/21 passing in 4.25s (self-contained) ✅
- ✅ All tests: 756/756 passing in 4.88s ✅
- ✅ 32 unit files + 2 integration files properly organized ✅

## Related Decisions

- **Related Pattern**: [Zero-Tolerance Testing Pattern](../patterns/testing-zero-tolerance-pattern.md) (established in Story 0.7)
- **Future ADR**: TBD - Test coverage requirements (may need separate ADR in future)

## References

- Story: [Story 0.7](../../stories/0.7.story.md)
- Architecture docs: [Testing Strategy](../../architecture/testing-strategy.md)
- Test README: [Test Organization Guide](../../../packages/poem-app/tests/README.md)
- QA Gate: `docs/qa/gates/0.7-complete-test-infrastructure-improvements.yml`

## Notes

This ADR represents the **first formal architecture decision** for POEM project. It establishes:
1. ADR numbering starts at 001
2. ADRs stored in `docs/kdd/decisions/`
3. Lisa (Librarian) maintains ADR documents
4. Quinn (QA) enforces patterns documented in ADRs

Future considerations:
- May need subdirectories within unit/ and integration/ as test count grows (VAL-003 threshold: 20 files per directory)
- Consider e2e/ directory for end-to-end tests (if/when POEM adds browser-based testing)

---

**ADR maintained by**: Lisa (Librarian)
**Last updated**: 2026-01-29
