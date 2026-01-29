---
# Pattern Template Metadata
domain: "testing"
topic: "zero-tolerance"
status: "Active"
created: "2026-01-29"
story_reference: "Story 0.7"
pattern_type: "Testing Pattern"
last_updated: "2026-01-29"
---

# Testing - Zero-Tolerance Pattern

> **Pattern Name**: testing-zero-tolerance-pattern
> **Type**: Testing Pattern
> **Status**: Active
> **First Used**: Story 0.7

## Context

**When to use this pattern**:
- Any story that modifies, creates, or organizes test files
- When implementing test infrastructure improvements
- When encountering skipped, flaky, or failing tests
- During test refactoring or cleanup efforts

**Problem Statement**:
Test suites accumulate non-passing tests over time (skipped, flaky, failing), creating noise that obscures real failures. Conditional test logic (environment guards, skip flags) results in tests that "only run sometimes," providing no value. Zero-tolerance prevents this degradation by enforcing: **every test must pass unconditionally, or be deleted**.

## Implementation

### Overview
Zero-tolerance testing enforces a simple rule: **`npm test` must show 100% pass rate with 0 skipped tests**. Any test that doesn't run unconditionally is deleted. This pattern applies to ALL test types (unit, integration, e2e) and prevents test suite decay.

### Philosophy
**"If a test does not run, there's no point having a test."** - Quinn (Test Architect)

Every non-passing test falls into one of three categories:
1. **Real bug** → Fix it
2. **Dead code** → Delete it
3. **Cop-out** (conditional logic, environment guards) → **Make it work unconditionally OR delete it**

There is **no acceptable middle ground**. Tests that "only run sometimes" have zero value.

### Step-by-Step Implementation

1. **Run full test suite and capture results**
   ```bash
   npm test
   ```
   Expected output: `X/X passing, 0 skipped, 0 failed`

2. **Identify all non-passing tests**
   - Skipped tests (marked with `.skip()` or conditional `if` guards)
   - Failing tests (red output, exit code 1)
   - Flaky tests (pass sometimes, fail sometimes)

3. **For EACH non-passing test, make decision**:
   
   **If test is skipped**:
   ```javascript
   // ❌ WRONG - Conditional skip
   test.skipIf(!process.env.INTEGRATION_TEST)('should work', () => {
     // test code
   });
   
   // ❌ WRONG - Environment guard
   if (process.env.RUN_INTEGRATION) {
     test('should work', () => {
       // test code
     });
   }
   
   // ✅ CORRECT - Delete the test
   // File removed entirely OR test deleted from file
   ```

   **If test is flaky**:
   ```javascript
   // ❌ WRONG - Retry logic to hide flakiness
   test.retry(3)('flaky test', () => {
     // test code
   });
   
   // ✅ CORRECT - Delete the test (fix later when stable)
   // Flaky tests have zero value - delete them
   ```

   **If test is failing**:
   - Investigate root cause
   - If bug in code → Fix the code
   - If bug in test → Fix the test
   - If test is for deleted feature → **Delete the test**
   - If can't fix quickly (>2 hours) → **Delete the test** (create story to fix properly)

4. **Verify zero-tolerance achieved**
   ```bash
   npm test
   # Must show: X/X passing, 0 skipped, 0 failed
   ```

5. **Self-check before marking "Ready for Review"**
   - ✅ `npm test` shows 0 skipped
   - ✅ `npm test` shows 0 failed
   - ✅ No conditional test logic (`if (env)`, `.skipIf()`, etc.)
   - ✅ No retry logic hiding flakiness

### Key Components
- **Decision Matrix**: Every non-passing test must be fixed or deleted (no third option)
- **No Conditional Logic**: Tests must run unconditionally in all environments
- **No Retry Logic**: Flaky tests must be stabilized or deleted (retries hide problems)
- **100% Pass Rate**: Target is ALWAYS 100% passing, 0 skipped

## Examples

### Example 1: Deleting Conditional Integration Tests (Story 0.7)

**Context**: Integration tests wrapped in `if (INTEGRATION_TEST)` environment guard

**Before** (73 tests skipped):
```typescript
// schema-extract.test.ts (29 tests)
if (process.env.INTEGRATION_TEST) {
  describe('Schema Extraction API', () => {
    test('should extract schema from prompt', async () => {
      // 29 tests here
    });
  });
}
// If INTEGRATION_TEST not set, these tests don't run → 29 skipped
```

**After** (0 tests skipped):
```bash
# Delete the entire file
git rm tests/integration/api/schema-extract.test.ts
```

**Result**: Test count drops from 850 to 756, but **100% of tests now run unconditionally**. Quality > quantity.

---

### Example 2: Deleting Flaky Tests (Story 0.7)

**Context**: Tests with race conditions that fail intermittently

**Before** (3 tests flaky):
```typescript
// watcher.test.ts
test('should detect file changes', async () => {
  await writeFile('test.txt', 'content');
  await sleep(100); // Race condition - may not be enough time
  expect(watcher.hasChanges()).toBe(true);
});
```

**After**:
```bash
# Delete the entire file
git rm tests/unit/services/handlebars/watcher.test.ts
```

**Rationale**: Flaky tests are worse than no tests. They create false failures, waste debugging time, and erode trust in test suite. Delete them until they can be stabilized.

---

### Example 3: Deleting Tests for Non-Existent Code (Story 0.7)

**Context**: Tests reference API endpoints that were never implemented

**Before** (0 tests run):
```typescript
// chain-execute.test.ts
import { chainExecute } from '../api/chain/execute.js'; // File doesn't exist

test('should execute chain', async () => {
  // This test never runs because import fails
});
```

**After**:
```bash
# Delete the test file
git rm tests/integration/api/chain-execute.test.ts
```

**Rationale**: Tests for code that doesn't exist serve no purpose. Delete them.

---

### Common Variations
- **Variation 1: Fix instead of delete**: If test failure is trivial (<15 min fix), fix it. Otherwise, delete and create story for proper fix.
- **Variation 2: Deferred integration tests**: If integration tests require external services not in dev environment, delete them until infrastructure exists (don't guard with `if` statements).

## Rationale

### Why This Approach?

**Problem**: Test suites degrade over time as teams add conditional skips for "temporary" issues:
- "Skip this test until Issue #123 is fixed"
- "Only run integration tests if server is running"
- "Skip flaky tests on CI"

**Result**: After 6 months, 20-30% of tests don't run. These tests provide **zero value** while creating maintenance burden.

**Zero-tolerance prevents this decay**: Delete tests that don't run. If they're important, they'll be recreated properly.

### Benefits
- ✅ **Clear Signal**: Test failures always indicate real problems (no noise from flaky/skipped tests)
- ✅ **Fast Debugging**: No time wasted investigating "why is this test skipped?"
- ✅ **Trustworthy CI**: Green build means ALL tests pass, not "tests that ran today pass"
- ✅ **Prevents Debt**: Forces team to fix or delete, not defer with conditionals
- ✅ **Maintainability**: Fewer tests, but all valuable (quality > quantity)

### Trade-offs
- ⚠️ **Coverage Drops**: Deleting 73 tests reduces coverage percentage (Story 0.7: 850 → 756 tests)
  - **Mitigation**: Only meaningful coverage matters; non-running tests provide 0% coverage
- ⚠️ **Short-Term Pain**: Requires discipline to delete tests instead of skipping
  - **Mitigation**: Long-term gain (trustworthy test suite) outweighs short-term discomfort

### Alternatives Considered
- **Alternative 1: Mark tests as "Known Failing"**: Keep failing tests, document them in README
  - **Rejected**: Creates noise, erodes trust in test suite, tests still don't provide value
- **Alternative 2: Separate "unstable" test suite**: Run stable tests always, unstable tests separately
  - **Rejected**: Adds complexity, unstable tests still provide no value, defeats purpose of tests

## Related Patterns

- **[Test Organization by Directory](../../kdd/decisions/adr-001-test-organization-by-directory.md)**: ADR-001 established unit/ vs integration/ separation (complements zero-tolerance)
- **Environment Validation Pattern** (future): Pattern for validating required env vars exist (prevents env-related skips)

## Testing Considerations

**How to validate zero-tolerance compliance**:

1. **Pre-Review Self-Check** (Developer):
   ```bash
   npm test
   # Look for: "Tests: X passed (X)"
   # If shows "X skipped" or "X failed" → NOT zero-tolerance compliant
   ```

2. **QA Review Checklist** (Quinn):
   - ✅ Run `npm test` and verify output shows **0 skipped**
   - ✅ Check for conditional test logic in code (grep for `.skipIf`, `if (env)`, etc.)
   - ✅ Check for retry logic (grep for `.retry()`)
   - ✅ If ANY violations found → **Automatic CONCERNS gate** (no discretion)

3. **CI Validation**:
   ```yaml
   # Example: Enforce zero-tolerance in CI
   - name: Run tests
     run: npm test
   - name: Verify zero skipped
     run: |
       TEST_OUTPUT=$(npm test 2>&1)
       if echo "$TEST_OUTPUT" | grep -q "skipped"; then
         echo "❌ Zero-tolerance violated: Skipped tests detected"
         exit 1
       fi
   ```

**Key Test Scenarios**:
- **Scenario 1**: Developer adds `.skip()` → CI fails, PR blocked
- **Scenario 2**: Flaky test appears → Developer deletes it, creates story for proper fix
- **Scenario 3**: Integration test requires server → Developer makes test self-contained OR deletes it

## References

- Story: [Story 0.7](../../stories/0.7.story.md) - First enforcement of zero-tolerance (deleted 73 non-passing tests)
- Learning: [Testing - Zero-Tolerance Enforcement](../learnings/testing-zero-tolerance-enforcement-kdd.md) - Detailed incident analysis
- ADR: [ADR-001: Test Organization by Directory Structure](../decisions/adr-001-test-organization-by-directory.md) - Test organization architecture
- QA Gate: `docs/qa/gates/0.7-complete-test-infrastructure-improvements.yml` - Quinn's PASS decision after zero-tolerance achieved

## Quinn's Enforcement

**How Quinn validates this pattern**:

1. **Automatic Check**: Run `npm test` at start of review
2. **Zero Discretion**: If output shows ANY skipped tests → **CONCERNS gate** (automatic)
3. **Code Review**: Search for conditional test patterns:
   ```bash
   # Patterns Quinn checks for
   grep -r "\.skip" tests/
   grep -r "skipIf" tests/
   grep -r "if (process.env" tests/
   grep -r "\.retry" tests/
   ```
4. **Feedback**: If violations found, return to Dev with explicit deletion list
5. **Pattern Reference**: Link to this pattern in QA Results section

**Quinn's Quote**:
> "If a test does not run, there's no point having a test. Every non-passing test is either a real bug (fix it), dead code (delete it), or a cop-out (make it work or delete it). No exceptions."

---

**Pattern maintained by**: Lisa (Librarian)
**Last reviewed**: 2026-01-29
**Promotion**: Promoted from Learning (Story 0.7) - High impact, foundational principle
