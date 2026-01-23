# Learning: Test Expectation Maintenance

**Date**: 2026-01-12
**Source**: Story 3.7 test failures after workflow changes
**Category**: Test Maintenance

## Context

Story 3.7 ("Define and Validate Output Schemas") extended workflows and APIs to support dual schema extraction and validation.

**Changes Made**:
- Added dual schema support to `test-prompt.yaml` workflow (load both input and output schemas)
- Added output schema validation step to `validate-prompt.yaml` workflow (13 steps instead of 12)
- Updated API responses to return `{ inputSchema, outputSchema }` instead of `{ schema }`

**Test Status After Implementation**:
- **Total**: 592 tests
- **Passing**: 536 (91%)
- **Failing**: 8 (1%)
- **Skipped**: 48 (8%)

**All failing tests** were in workflow test files - not core functionality.

## Challenge

**What went wrong**: Workflow structure changed, but workflow test expectations weren't updated in the same story.

### Failing Tests

**1. `test-prompt.test.ts` (1 failure)**:
```typescript
// Test expected old step name
expect(workflow.steps[3].name).toBe('load-schema');

// Actual step name after Story 3.7
expect(workflow.steps[3].name).toBe('load-input-schema');
// Story 3.7 renamed to clarify dual schema loading
```

**2. `validate-prompt.test.ts` (7 failures)**:
```typescript
// Tests expected 12 steps
expect(workflow.steps.length).toBe(12);

// Actual steps after Story 3.7
expect(workflow.steps.length).toBe(13);
// Story 3.7 added STEP 7 for output schema validation
```

### Why This Wasn't Caught

**Root Causes**:

1. **Test Expectations Hardcoded**: Tests checked exact step counts and names
2. **No Test Update in Story**: Dev agent completed workflow changes but didn't update corresponding tests
3. **SAT Tests Passed**: Story Acceptance Tests (SAT) validated API functionality, not workflow structure tests
4. **QA Gate Triggered**: Quinn raised CONCERNS gate (80/100 score) due to test failures

### QA Review Findings

From Story 3.7 QA Results:

> **Failing Tests (All in workflow test files):**
> - `test-prompt.test.ts`: 1 failure - expects 'load-schema' step name
> - `validate-prompt.test.ts`: 7 failures - expects 12 steps, workflow now has 13
>
> **Root Cause:** Workflow test expectations not updated after Story 3.7 added dual schema support.
>
> **Impact:** Low - Core functionality proven working via SAT tests. These are test expectation mismatches, not functional failures.
>
> **Gate Status:** CONCERNS ⚠️

## Solution

**Two-Part Fix**:

1. **Immediate**: Update test expectations to match new workflow structure
2. **Preventive**: Add workflow structure change detection to Definition of Done

### Fix Applied (Post-Review)

```typescript
// ✅ FIXED: test-prompt.test.ts
expect(workflow.steps[3].name).toBe('load-input-schema');  // Updated expectation
expect(workflow.steps[4].name).toBe('load-output-schema'); // New step

// ✅ FIXED: validate-prompt.test.ts
expect(workflow.steps.length).toBe(13);  // Updated expectation
expect(workflow.steps[6].name).toBe('validate-output-schema'); // New step
```

### Definition of Done Enhancement

**Added to checklist**:

**When Modifying Workflow Files** (`packages/poem-core/tasks/*.yaml`):
- [ ] Update workflow YAML
- [ ] Update corresponding test file in `tests/workflows/`
- [ ] Run workflow tests: `npm test workflows/`
- [ ] If test expectations changed, document in story notes

**When Adding/Removing Workflow Steps**:
- [ ] Check test files for hardcoded step counts: `grep -r 'steps.length' tests/workflows/`
- [ ] Check test files for step name expectations: `grep -r "steps\\[.*\\].name" tests/workflows/`
- [ ] Update ALL affected test expectations
- [ ] Verify with `npm test`

## Outcome

**After Fix**:
- All 592 tests passing (100%)
- QA gate updated to PASS
- Story 3.7 approved for Done status

**Time Cost**:
- 30 minutes to identify failing tests
- 15 minutes to update test expectations
- 10 minutes to verify all tests passing

**Total**: 55 minutes of rework that could have been avoided.

## Future Application

### Test Maintenance Patterns

**Pattern 1: Avoid Hardcoded Structure Expectations**

```typescript
// ❌ BAD: Hardcoded step count
expect(workflow.steps.length).toBe(12);
// PROBLEM: Breaks when steps added/removed

// ✅ GOOD: Test specific requirements
expect(workflow.steps.find(s => s.name === 'validate-output-schema')).toBeDefined();
// BETTER: Tests what matters (step exists), not structure
```

**Pattern 2: Test Behavior, Not Structure**

```typescript
// ❌ BAD: Test step name
expect(workflow.steps[3].name).toBe('load-input-schema');
// PROBLEM: Fragile if steps reordered

// ✅ GOOD: Test behavior
const schemaSteps = workflow.steps.filter(s => s.name.includes('schema'));
expect(schemaSteps.length).toBeGreaterThanOrEqual(2);
// BETTER: Tests that schema loading steps exist
```

**Pattern 3: Co-locate Workflow Changes with Test Updates**

```typescript
// In same commit:
// 1. Update workflow: workflows/test-prompt.yaml
// 2. Update tests: tests/workflows/test-prompt.test.ts
// 3. Run: npm test
```

### When Hardcoded Expectations Are OK

**Acceptable Use Cases**:
- **Critical invariants**: "Workflow must have at least 1 step"
- **Ordering requirements**: "Validation must come after schema loading"
- **Regression tests**: "Story 3.7 added output validation step"

**Key Question**: "If we add/remove/reorder steps, should this test break?"
- **Yes** → Hardcoded expectation OK (documents requirement)
- **No** → Use behavioral test (more resilient)

### QA Checklist Addition

**Test Coverage Review**:
- [ ] Unit tests cover service logic ✓
- [ ] API tests cover endpoints ✓
- [ ] Workflow tests updated if workflows changed ✓ (NEW)
- [ ] All tests passing (`npm test` exit code 0) ✓

**Red Flag**: "All functional tests pass, but workflow tests fail"
- **Diagnosis**: Likely test expectation mismatch
- **Action**: Review workflow changes, update test expectations

## Related Knowledge

- **Story 3.7**: QA Results section (test failures documented)
- **Pattern**: Test-Driven Development (write tests alongside implementation)
- **Learning**: Hot Reload in Production Mode (similar test maintenance lesson)

## Key Insights

1. **Functional correctness ≠ Test suite health**
   - APIs work ✓
   - SAT tests pass ✓
   - Workflow structure tests fail ✗

2. **Test failures have context**
   - Low-impact: Test expectations outdated
   - High-impact: Functionality broken

3. **QA gates prevent merging broken test suites**
   - CONCERNS gate appropriate for test expectation mismatches
   - FAIL gate for functional failures

4. **Co-locate changes**: Workflow modification + test update = same story

---

**Last Updated**: 2026-01-16
**Learning Captured By**: Dev Agent (Story 3.7 retrospective)
**Applied In**: Story 3.7 (post-QA fix), Definition of Done updates
