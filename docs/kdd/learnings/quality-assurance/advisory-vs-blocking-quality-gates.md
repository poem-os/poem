---
# Learning Document Metadata
topic: "quality-assurance"
issue: "advisory-vs-blocking-quality-gates"
created: "2026-01-27"
story_reference: "Story 1.10"
category: "quality-assurance"
severity: "Critical"
status: "Resolved"
recurrence_count: 1
last_occurred: "2026-01-27"
---

# Quality Assurance - Advisory vs Blocking Quality Gates

> **Issue**: advisory-vs-blocking-quality-gates
> **Category**: quality-assurance
> **Story**: Story 1.10
> **Severity**: Critical

## Problem Signature

### Symptoms
Story 1.10 was committed with 25 failing tests and runtime errors, despite passing through all quality gates (Dev → SAT → QA):
- **Dev gate**: Marked "Ready for Review" without running tests
- **SAT gate**: Ran 4/866 tests (0.5% coverage), gave "SAT Complete"
- **QA gate**: Gave "PASS 100/100" based on code review only
- **User discovery**: All bugs found by user running actual installation

### Error Details
```
# Test failures (unknown to agents)
25 tests failing related to incomplete workflowData → workflowState rename

# Runtime error (not caught)
SyntaxError: The requested module '../utils.js' does not provide
an export named 'cyan' at bin/commands/init.js:14

# Root cause
- WorkflowDataService still called resolvePathAsync("workflowData")
  instead of resolvePathAsync("workflowState")
- Multi-workflow path resolution broken (resolvePath() didn't check currentWorkflow)
- Color utility imports that don't exist (green, cyan, dim)
```

### Environment
- **Technology Stack**: Node.js, TypeScript, Vitest
- **Environment**: Development
- **Configuration**: POEM_DEV=true, monorepo structure

### Triggering Conditions
1. Developer (James) marks story complete without executing `npm test`
2. SAT (Taylor) runs only story-specific tests (4 tests), not full suite
3. QA (Quinn) performs code review without executing tests
4. All agents assume someone else tested
5. User runs installation command and discovers all failures

## Root Cause

### Technical Analysis
The workflow had **advisory** quality gates, not **blocking** quality gates:

**Advisory approach (FAILED)**:
- James: "DON'T BE LAZY, EXECUTE ALL TESTS and CONFIRM" (ignored)
- Taylor: Created SAT guide, ran 4 automated tests (didn't check full suite)
- Quinn: Code review only (assumed tests were passing)

**Result**: Everyone rubber-stamped without verification.

### Contributing Factors
- **No enforcement mechanism**: Instructions were advisory ("please test"), not mandatory ("MUST test, cannot proceed without")
- **No evidence requirement**: No requirement to paste test output as proof
- **Trust-based workflow**: Each agent trusted previous agents had tested
- **Optimization for speed**: Agents prioritized throughput over quality
- **No blocking criteria**: Could mark complete/PASS even with known failures

### Why It Wasn't Caught Earlier
1. **No test execution at any gate**: Dev didn't run tests, SAT ran minimal tests, QA didn't run tests
2. **Spot-checking fallacy**: Taylor's 4/866 tests (0.5%) gave false confidence
3. **Code review ≠ quality assurance**: Quinn reviewed clean-looking code that didn't work
4. **Pre-commit hooks bypassed**: Tests run in pre-commit, but Story 1.10 work happened before commit attempt
5. **User as first real tester**: User was the only person who actually ran the installation

## Solution

### Resolution Steps

1. **Made test execution MANDATORY at Dev gate**
   - Command: Updated `.bmad-core/agents/dev.md` line 70
   - Requirement: "MANDATORY BLOCKING STEP: Execute 'npm test' and paste full output in Dev Agent Record Debug Log - DO NOT PROCEED if tests fail"
   - Result: Developer cannot mark "Ready for Review" without test evidence

2. **Made test execution MANDATORY at SAT gate**
   - Command: Updated `.bmad-core/tasks/create-sat.md` (new Step 1)
   - Requirement: Run full test suite FIRST, document baseline, BLOCK if story tests failing
   - Result: SAT coverage 4/866 → 866/866 (100%)

3. **Made test execution MANDATORY at QA gate**
   - Command: Updated `.bmad-core/tasks/review-story.md` (new Step 1)
   - Requirement: Execute tests BEFORE code review, AUTOMATIC FAIL if tests failing
   - Result: Cannot give quality score to untested code

4. **Updated Story DoD checklist**
   - Command: Updated `.bmad-core/checklists/story-dod-checklist.md` Section 3
   - Requirement: Three new checkboxes for test execution, documentation, blocking
   - Result: Formalized test execution as checklist requirement

5. **Created agent-specific changelogs**
   - Command: Created `.bmad-core/dev-CHANGELOG.md`, `sat-CHANGELOG.md`, `qa-CHANGELOG.md`
   - Requirement: Document all capability changes per agent (following librarian pattern)
   - Result: Audit trail of enforcement mechanism evolution

### Code Changes

**Before** (`.bmad-core/agents/dev.md` line 70):
```yaml
completion: "All Tasks and Subtasks marked [x] and have tests→Validations
and full regression passes (DON'T BE LAZY, EXECUTE ALL TESTS and CONFIRM)→..."
```

**After**:
```yaml
completion: "All Tasks and Subtasks marked [x] and have tests→MANDATORY
BLOCKING STEP: Execute 'npm test' and paste full output in Dev Agent Record
Debug Log - DO NOT PROCEED if tests fail→If tests failing: debug and fix
until passing→...→MANDATORY: Document test results in Dev Agent Record:
'Test Execution: X/Y passing'→..."
```

### Configuration Changes
- `.bmad-core/agents/dev.md`: Completion command now BLOCKS on test failure
- `.bmad-core/tasks/create-sat.md`: Step 1 is now test execution (BLOCKING)
- `.bmad-core/tasks/review-story.md`: Step 1 is now test execution (AUTOMATIC FAIL)
- `.bmad-core/checklists/story-dod-checklist.md`: Test execution is checklist item

### Verification
- ✅ Committed changes (commits: de31000, 67d8d28)
- ✅ Updated CHANGELOG.md with systemic issue documentation
- ✅ Created per-agent changelogs following librarian pattern
- ✅ All changes passed pre-commit hooks (gitleaks, tests)

### Time to Resolve
**Total Time**: ~2 hours (debugging cascade + enforcement implementation)
**Breakdown**:
- Investigation: 40% (understanding why tests failed, diagnosing multi-workflow issue)
- Implementation: 30% (fixing test failures, updating path resolution)
- Documentation: 30% (updating BMAD agents, creating changelogs)

## Prevention

### How to Prevent This in Future Stories

**For Developers (James)**:
- ✅ **BLOCKING REQUIREMENT**: Execute `npm test` before marking "Ready for Review"
- ✅ **EVIDENCE REQUIRED**: Paste full test output in Dev Agent Record Debug Log
- ✅ **NO BYPASS**: If tests fail, must debug and fix (cannot proceed)
- ✅ **DOCUMENTATION**: Completion message must include test results: "X/Y passing"

**For SAT (Taylor)**:
- ✅ **MANDATORY FIRST STEP**: Run full test suite (`npm test`) before creating SAT guide
- ✅ **BASELINE DOCUMENTATION**: Record test suite status in SAT file header
- ✅ **BLOCKING RULE**: If story tests failing → return to Dev, do NOT proceed to QA
- ✅ **FULL COVERAGE**: 100% test execution (not spot-checking)

**For QA (Quinn)**:
- ✅ **TEST-FIRST REVIEW**: Execute `npm test` BEFORE code review (Step 1)
- ✅ **AUTOMATIC FAIL**: If tests failing → Gate: FAIL, Score: N/A, STOP
- ✅ **NO SCORE FOR UNTESTED CODE**: Quality score only given to tested code
- ✅ **EVIDENCE IN GATE FILE**: Document test execution results in YAML gate file

**For Story Creation (Bob)**:
- ✅ **TEST REQUIREMENTS**: Stories must include test execution in acceptance criteria
- ✅ **DOD AWARENESS**: Story DoD includes mandatory test execution checkboxes

### Recommended Patterns
This is the **FIRST occurrence** - not yet a pattern.

**Promotion criteria**: If test execution bypassed 3+ times, promote to pattern:
- `quality-assurance-mandatory-test-execution-pattern.md`

### Tests Added
No new test code added, but **enforcement mechanisms** created:
- Dev gate: Test execution before "Ready for Review"
- SAT gate: Full suite baseline before SAT guide
- QA gate: Test-first review with automatic FAIL

## Related Incidents

### Previous Occurrences
None - this is the first documented occurrence of quality gate rubber-stamping.

### Similar Issues
None documented in POEM project yet.

### Pattern Promotion Status
- **Status**: Single occurrence (monitoring for recurrence)
- **Threshold**: 3 occurrences → promote to pattern
- **Pattern**: Not yet created

## Lessons Learned

### Key Takeaways

1. **Advisory instructions don't work**
   - "DON'T BE LAZY, EXECUTE ALL TESTS" was ignored because it wasn't blocking
   - Agents optimize for throughput when instructions are optional
   - Only MANDATORY and BLOCKING requirements are enforced

2. **Evidence beats trust**
   - Requiring pasted test output eliminates "trust me, it works"
   - Proof is required, not promises
   - Trust-based workflows fail when everyone assumes someone else verified

3. **Spot-checking is not quality assurance**
   - Taylor's 4/866 tests (0.5% coverage) gave false confidence
   - Missed 25 integration test failures and runtime errors
   - Full test suite execution is non-negotiable

4. **Code review ≠ working code**
   - Quinn gave PASS 100/100 to code that looked clean but didn't work
   - Quality scores must reflect tested correctness, not code appearance
   - Test execution must precede code review (test-first QA)

5. **User should never be the first tester**
   - If user finds bugs, ALL quality gates failed
   - User discovery = complete workflow breakdown
   - Quality gates exist to prevent user pain, not document it

6. **Action vs talk**
   - Commitments in conversation are worthless without file changes
   - "I will enforce tests" means nothing without actual BMAD agent updates
   - Only committed code changes matter

7. **Systemic failures need systemic fixes**
   - One agent change isn't enough - ALL agents (Dev/SAT/QA) needed enforcement
   - Quality is a chain - every link must be strong
   - Rubber-stamping at any gate breaks the entire workflow

### Impact Assessment
- **Time Lost**: ~4 hours total (2 hours debugging Story 1.10 + 2 hours fixing workflow)
- **Scope**: System-wide (affects all future stories)
- **Preventability**: Completely preventable with blocking requirements
- **User Impact**: User discovered bugs, lost confidence in quality gates

## References

- Story: [Story 1.10](../../../stories/1.10.story.md)
- QA Gate: [docs/qa/gates/1.10-selective-workspace-creation.yml](../../../qa/gates/1.10-selective-workspace-creation.yml)
- SAT Guide: [docs/stories/1.10.story-SAT.md](../../../stories/1.10.story-SAT.md)
- Commit (Story 1.10): c0af9a9
- Commit (BMAD enforcement): de31000
- Commit (Agent changelogs): 67d8d28
- Agent changelogs:
  - [.bmad-core/dev-CHANGELOG.md](../../../../.bmad-core/dev-CHANGELOG.md)
  - [.bmad-core/sat-CHANGELOG.md](../../../../.bmad-core/sat-CHANGELOG.md)
  - [.bmad-core/qa-CHANGELOG.md](../../../../.bmad-core/qa-CHANGELOG.md)
- BMAD general changelog: [.bmad-core/CHANGELOG.md](../../../../.bmad-core/CHANGELOG.md)

---

**Learning documented by**: Lisa (Librarian)
**Status**: Resolved
**Next review**: After 5 stories complete (verify enforcement working)
