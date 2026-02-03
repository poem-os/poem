---
# Architecture Decision Record Metadata
adr_number: "011"
title: "Pre-commit Hook Testing Strategy"
status: "Accepted"
created: "2026-02-03"
decision_date: "2026-02-03"
story_reference: "Epic Renumbering Validation"
authors: ["David Cruwys", "Lisa (Librarian)"]
supersedes: null
superseded_by: null
---

# ADR-011: Pre-commit Hook Testing Strategy

> **Status**: Accepted
> **Date**: 2026-02-03
> **Context**: Epic renumbering validation work

## Status

**ACCEPTED** - 2026-02-03

## Context

### Background

POEM's pre-commit hook (`.husky/pre-commit`) currently runs three checks before allowing commits:
1. **gitleaks protect** - Secret scanning (critical security check)
2. **npm run test:unit** - All unit tests (~718 tests, ~2 seconds)
3. **npm run validate-kdd** - KDD link validation (conditional, only if KDD docs changed)

The unit test execution was added to catch broken code before it enters the repository, following the principle of "shift left" testing. However, during epic renumbering work (updating documentation references), the pre-commit hook blocked a documentation commit because an unrelated unit test failed (`path-resolution-verification.test.ts`).

**Historical evolution**:
- **Initial** (commit 5affa44): `npm test` ran all tests including integration tests (~12s+, flaky)
- **Jan 2, 2026** (commit 6d4db85): Changed to `npm run test:unit` to exclude flaky integration tests (~500ms-2s, more reliable)
- **Jan 26, 2026** (commit a680dcf): Added conditional KDD validation

No Architecture Decision Record was created documenting why tests were included in pre-commit, making it unclear whether this was an intentional strategy or inherited practice.

### Problem Statement

**Should unit tests run in pre-commit hooks, or should they be deferred to CI/CD or manual execution?**

The current approach creates friction:
- Documentation-only changes are blocked by unrelated test failures
- 2-second delay on every commit (minor but cumulative)
- False sense of security (developers can bypass with `--no-verify`)
- No documented rationale for the current approach

### Forces at Play

**Force 1: Code Quality vs. Developer Velocity**
- Pre-commit tests catch broken code immediately
- But they slow down commit workflow and can block unrelated changes

**Force 2: Test Reliability vs. Coverage**
- Unit tests are generally reliable, but edge cases can fail intermittently
- Flaky tests undermine trust in pre-commit hooks

**Force 3: Local Testing vs. CI/CD**
- Modern CI/CD (GitHub Actions, GitLab CI) provides fast, reliable test execution
- Local pre-commit hooks add redundancy but can catch issues earlier

**Force 4: Developer Discipline vs. Automation**
- Trusting developers to run tests manually requires discipline
- Automated hooks enforce consistency but can be bypassed

**Force 5: Monorepo Scope**
- POEM is a monorepo with documentation, code, and configuration
- Not all changes require test execution (docs, ADRs, planning files)

### Assumptions

- Developers will run tests before pushing to CI/CD if pre-commit hooks don't enforce it
- CI/CD will catch test failures before code merges to main
- Documentation changes should not require passing unit tests to commit
- Secret scanning (gitleaks) is non-negotiable and should remain

### Constraints

- Pre-commit hooks can be bypassed with `git commit --no-verify`
- Hooks run in developer's local environment (slower, less consistent than CI/CD)
- Test execution time grows as codebase expands (currently ~2s, future unknown)

## Decision

**We will remove `npm run test:unit` from the pre-commit hook and rely on CI/CD for automated test execution.**

### Detailed Decision

The `.husky/pre-commit` hook will be simplified to:
1. **gitleaks protect** - Secret scanning (KEEP)
2. **npm run validate-kdd** - KDD link validation (KEEP, conditional)

Unit tests will be:
- **Removed from pre-commit** - No longer block local commits
- **Required in CI/CD** - GitHub Actions (or equivalent) will run full test suite on push
- **Available manually** - Developers can run `npm test` or `npm run test:unit` when needed

### Implementation Approach

1. Edit `.husky/pre-commit` to remove line 6 (`npm run test:unit`)
2. Ensure CI/CD pipeline runs full test suite (verify GitHub Actions config)
3. Document testing expectations in `CONTRIBUTING.md` (if it exists) or `docs/guides/`
4. Create this ADR to explain the decision and provide future review criteria

### Scope

- **In Scope**: Pre-commit hook strategy for unit tests
- **Out of Scope**:
  - Integration test strategy (already excluded from pre-commit)
  - CI/CD pipeline configuration (assumed to exist)
  - Code review requirements (separate process)
  - Manual testing guidelines (developer responsibility)

## Alternatives Considered

### Alternative 1: Keep `npm run test:unit` in Pre-commit

**Pros**:
- ✅ Catches broken code immediately before commit
- ✅ Enforces testing discipline automatically
- ✅ Prevents "broken main" scenarios from local commits

**Cons**:
- ❌ Blocks documentation commits for unrelated test failures
- ❌ Adds 2-second delay to every commit (cumulative friction)
- ❌ Can be bypassed with `--no-verify` (false sense of security)
- ❌ Redundant with CI/CD testing
- ❌ Grows slower as test suite expands

**Why Not Chosen**: The cons outweigh the pros. CI/CD provides better test execution environment, and the friction caused by blocking doc commits is unacceptable.

### Alternative 2: Conditional Unit Tests (Only if Code Changed)

Make unit test execution conditional, similar to KDD validation:
```bash
if git diff --cached --name-only | grep -q "packages/.*\.(ts|js)"; then
  npm run test:unit
fi
```

**Pros**:
- ✅ Documentation commits proceed without tests
- ✅ Code commits still get immediate feedback
- ✅ Targets testing to relevant changes

**Cons**:
- ❌ Complex logic to determine "code vs docs" (what about YAML config? Scripts?)
- ❌ Still adds delay to code commits
- ❌ Harder to maintain (pattern matching for file types)
- ❌ Doesn't solve core issue: local environment inconsistency

**Why Not Chosen**: Adds complexity without solving the core problem. CI/CD is the better place for comprehensive testing.

### Alternative 3: Status Quo (Do Nothing)

Keep current pre-commit hook unchanged.

**Pros**:
- ✅ No changes needed
- ✅ Maintains current testing discipline

**Cons**:
- ❌ Problem remains: doc commits blocked by unrelated failures
- ❌ Developer frustration continues
- ❌ No documented rationale for current approach

**Why Not Chosen**: The status quo creates unnecessary friction and lacks documented reasoning. This decision provides clarity and improves developer experience.

### Alternative 4: Move All Checks to CI/CD (Including Gitleaks)

Remove all pre-commit hooks entirely.

**Pros**:
- ✅ Fastest local commit experience
- ✅ CI/CD handles all validation

**Cons**:
- ❌ Secrets could be committed locally before CI/CD catches them
- ❌ KDD link validation happens too late (after commit)

**Why Not Chosen**: Secret scanning must happen pre-commit (security). KDD validation benefits from early feedback to maintain link health.

## Rationale

### Why This Decision?

**Primary reasons**:
1. **Developer experience**: Documentation commits should not be blocked by unrelated code tests
2. **CI/CD redundancy**: Modern CI/CD pipelines provide better test execution (parallel, isolated, consistent)
3. **Diminishing returns**: Pre-commit tests can be bypassed, so they provide limited enforcement
4. **Monorepo reality**: Not all commits involve code changes (docs, ADRs, planning)

**Philosophy**: Pre-commit hooks should focus on **fast, essential checks** (secrets, broken links) that provide immediate value. Comprehensive testing belongs in CI/CD where it can run in a controlled environment.

### Decision Criteria

| Criterion | Keep Tests | Remove Tests (Chosen) | Conditional Tests |
|-----------|------------|----------------------|-------------------|
| **Developer velocity** | ❌ Slow (2s every commit) | ✅ Fast (no delay for docs) | ⚠️ Medium (delay for code) |
| **Test coverage** | ✅ High (all commits) | ⚠️ Relies on CI/CD | ✅ High (code commits only) |
| **Maintainability** | ✅ Simple | ✅ Simple | ❌ Complex (pattern matching) |
| **Flexibility** | ❌ Rigid (all commits) | ✅ Flexible (dev choice) | ⚠️ Medium (auto for code) |
| **Security** | N/A (gitleaks separate) | N/A (gitleaks remains) | N/A (gitleaks remains) |

**Winner**: Remove tests - best balance of velocity and maintainability.

### Alignment

- **Technical Strategy**: Aligns with modern CI/CD-first testing approach
- **Business Goals**: Improves developer productivity, reduces friction
- **Architectural Principles**: Separation of concerns (local hooks = fast checks, CI/CD = comprehensive testing)

### Risk Mitigation

**Risk**: Broken code enters repository if developers don't run tests locally.
**Mitigation**: CI/CD catches failures before merge to main. Code review provides second layer of defense.

**Risk**: Developer discipline varies (some may not run tests manually).
**Mitigation**: Team culture and code review process enforce testing expectations.

## Consequences

### Positive Consequences

- ✅ **Faster commits**: Documentation and planning work proceeds without test delays
- ✅ **Reduced friction**: No more blocked commits for unrelated test failures
- ✅ **Clearer separation**: Pre-commit = security/links, CI/CD = comprehensive testing
- ✅ **Better test environment**: CI/CD provides isolated, reproducible test execution
- ✅ **Scalability**: Pre-commit hook performance won't degrade as test suite grows

### Negative Consequences

- ⚠️ **Relies on discipline**: Developers must remember to run tests before pushing
- ⚠️ **Later feedback**: Test failures discovered in CI/CD, not pre-commit
- ⚠️ **Potential for broken commits**: If CI/CD is misconfigured or skipped

### Technical Debt

**No technical debt introduced**. This decision simplifies the pre-commit hook and delegates testing to the appropriate layer (CI/CD).

**Future consideration**: If broken code frequently enters the repository due to skipped local testing, revisit this decision (see Review Date below).

### Impact on Stories

- **Epic 5+**: Future story development benefits from faster commit cycle
- **Documentation work**: ADRs, planning docs, KDD curation proceed without test barriers
- **Testing stories**: CI/CD configuration becomes more critical (should be verified/documented)

### Reversibility

**Can this decision be reversed?** Yes (Low cost)

**Reversal cost**: One-line change to `.husky/pre-commit` to restore `npm run test:unit`. ADR would be marked as "Superseded" with link to new ADR explaining why reversal was needed.

**Conditions for reversal**:
- Broken code frequently enters repository (>2 incidents/month)
- CI/CD is unreliable or too slow (>10 minutes to get test feedback)
- Team consensus that pre-commit tests improve quality more than they hinder velocity

## Implementation

### Affected Components

- `.husky/pre-commit` - Remove line 6 (`npm run test:unit`)
- CI/CD pipeline - Verify it runs full test suite (should already exist)
- Developer workflow - Update documentation to clarify testing expectations

### Required Changes

**Code Changes**:
- Remove `npm run test:unit` from `.husky/pre-commit` (line 6)

**Infrastructure Changes**:
- None (assumes CI/CD already configured)

**Process Changes**:
- Developers should run `npm test` or `npm run test:unit` before pushing
- Code reviewers should verify tests pass in CI/CD
- Document testing expectations in developer guide (optional)

### Timeline

- **Decision Date**: 2026-02-03
- **Implementation Start**: 2026-02-03 (immediate)
- **Expected Completion**: 2026-02-03 (same day)
- **Review Date**: 2026-05-03 (3 months) - Re-evaluate if broken code enters repository

### Success Criteria

**After 3 months (by 2026-05-03), this decision is successful if**:
- ✅ Fewer than 2 broken commits entered repository (caught by CI/CD before merge)
- ✅ No developer complaints about blocked documentation commits
- ✅ CI/CD test execution remains reliable (<5% flakiness)
- ✅ Commit velocity improved (subjective, but measurable via git log timing analysis)

**Failure criteria** (trigger re-evaluation):
- ❌ More than 2 broken commits per month reach main branch
- ❌ CI/CD becomes unreliable (>10% test flakiness)
- ❌ Team consensus that pre-commit tests are needed

## Related Decisions

- **ADR-009**: [Fixed KDD Taxonomy](./adr-009-fixed-kdd-taxonomy.md) - KDD validation remains in pre-commit (conditional)
- **Related Pattern**: None (testing strategy is process, not code pattern)

## References

- Commit 5affa44: Initial pre-commit hook with `npm test`
- Commit 6d4db85: Changed to `npm run test:unit` for reliability
- Commit a680dcf: Added KDD validation to pre-commit
- Epic Renumbering Context: Documentation commit blocked by `path-resolution-verification.test.ts` failure
- Pre-commit Hook File: `.husky/pre-commit`

**External Resources**:
- [Husky Documentation](https://typicode.github.io/husky/)
- [Pre-commit Hook Best Practices](https://www.atlassian.com/git/tutorials/git-hooks)
- Industry Consensus: Fast, essential checks in pre-commit; comprehensive testing in CI/CD

## Notes

**Future Considerations**:
- If POEM adds more complex validation (linting, formatting), consider adding to pre-commit if fast (<500ms)
- Monitor CI/CD execution time; if it exceeds 5 minutes, may need to optimize test suite or reconsider strategy
- Consider adding pre-push hook (instead of pre-commit) for tests if team wants some local validation

**Review Triggers** (revisit before scheduled review date if):
- Broken code enters repository more than 2 times in a month
- CI/CD becomes unreliable or too slow
- Team consensus shifts toward wanting pre-commit tests
- New tooling emerges that makes pre-commit testing fast and non-intrusive

---

**ADR maintained by**: Lisa (Librarian)
**Last updated**: 2026-02-03
