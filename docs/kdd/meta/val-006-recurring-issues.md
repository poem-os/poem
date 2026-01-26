# VAL-006: Recurring Issues Tracker

**Validation Rule**: VAL-006 (Recurrence Detection)

**Purpose**: Track recurring issues to identify patterns worthy of promotion to reusable patterns.

**Threshold**: 3 occurrences → Promote to pattern (from `.bmad-core/data/kdd-taxonomy.yaml`)

**Signature Match**: 60% similarity to detect recurrence (semantic similarity)

---

## Overview

This tracker monitors recurring issues across the POEM codebase. When an issue recurs 3+ times, it becomes a candidate for pattern promotion - transforming a learning document into a reusable pattern document.

**Why Track Recurrence?**
- Patterns emerge from repetition (not single incidents)
- Third occurrence confirms systematic issue (not coincidence)
- Evidence-based pattern promotion (data-driven, not opinion-based)

**Workflow**:
1. **First occurrence**: Create learning document
2. **Second occurrence**: Update learning with recurrence_count=2, add to this tracker
3. **Third occurrence**: Promote to pattern, document prevention strategy

---

## Active Recurring Issues

### 1. Workflow Data Test Race Condition

**Issue Signature**: Flaky test failure in `workflow-data.test.ts` due to async file write timing

**Learning Document**: [workflow-data-test-race-condition.md](../learnings/workflow-data-test-race-condition.md)

**Occurrences**:
1. **Unknown date** - Old conversation (not documented)
   - Bypassed with `git commit --no-verify`
2. **2026-01-25** - KDD knowledge curation commit
   - Error: `Workflow data not found: mkt74cqs-urm5whp`
   - Bypassed with `git commit --no-verify`

**Current Count**: 2 / 3 (threshold)

**Status**: Monitoring (1 more occurrence triggers pattern promotion)

**Severity**: Medium (blocks commits, has workaround)

**Category**: Testing (async file operations)

**Signature**:
- Test: `packages/poem-app/tests/services/chain/workflow-data.test.ts`
- Error: "Workflow data not found: {id}"
- Root Cause: Race condition - async file write not complete before read
- Context: File-based persistence testing

**Proposed Pattern** (if promoted):
- **Pattern Name**: "Async File Operation Testing"
- **Pattern Type**: Testing Pattern
- **Location**: `docs/kdd/patterns/testing/async-file-operation-testing.md`
- **Prevention**: Verify filesystem state before assertions (`fs.promises.access()`)

**Next Action**: If third occurrence happens, create pattern document with:
- Verification step template for file-based tests
- Checklist for async file write → read sequences
- Anti-patterns (arbitrary delays, no verification)

---

## Promoted Patterns

*(None yet - POEM has not reached 3 occurrences for any issue)*

---

## Recurrence Detection Methodology

**How to Detect Recurrence**:

1. **Semantic Signature Matching** (60% threshold):
   - Same error message (fuzzy match, ignore IDs/timestamps)
   - Same root cause (file timing, API error, schema mismatch, etc.)
   - Same context (test suite, service layer, API endpoint)

2. **Manual Review**:
   - Compare learning documents
   - Check if solutions overlap
   - Assess if pattern would prevent recurrence

3. **Update Learning Document**:
   - Increment `recurrence_count` metadata field
   - Add "Related Incidents" section with links to previous occurrences
   - Update status to "Recurring" (from "Active" or "Resolved")

**Example Signature Match**:

```yaml
# Occurrence 1
error: "Workflow data not found: abc123xyz"
test: "workflow-data.test.ts"
root_cause: "async file write timing"

# Occurrence 2
error: "Workflow data not found: mkt74cqs-urm5whp"  # Different ID (ignore)
test: "workflow-data.test.ts"                      # Same test ✓
root_cause: "async file write timing"              # Same cause ✓

# Similarity: 100% (ignore variable parts like IDs)
```

---

## Pattern Promotion Criteria

**Required for Promotion** (from `kdd-taxonomy.yaml`):
- ✅ Issue recurs 3+ times (recurrence_count >= 3)
- ✅ Solution is reusable across multiple stories
- ✅ Team approves pattern standardization

**Process**:
1. Run `/BMad/agents/librarian` command: `*detect-recurrence`
2. Lisa identifies candidates (3+ occurrences)
3. Human reviews candidates for promotion
4. Lisa creates pattern document from learning template
5. Lisa updates learning document with link to promoted pattern
6. Lisa updates this tracker with promoted pattern entry

---

## Health Metrics

**Target**: Reduce recurrence count via pattern adoption

| Metric | Target | Current Status |
|--------|--------|----------------|
| Issues at 3+ occurrences | 0 (promote immediately) | 0 |
| Issues at 2 occurrences | Monitor closely | 1 (workflow-data-test-race-condition) |
| Pattern promotion rate | 100% at 3rd occurrence | N/A (no 3rd occurrences yet) |

**Success Indicator**: If promoted pattern prevents future occurrences, recurrence_count stops growing.

---

## References

- **Taxonomy Rule**: `.bmad-core/data/kdd-taxonomy.yaml` (lines 98-101, recurrence_tracking)
- **Validation Rule**: VAL-006 (60% signature similarity threshold, 3-occurrence promotion)
- **Learning Template**: Learning documents have `recurrence_count` metadata field
- **Lisa Command**: `*detect-recurrence` (identifies recurring issues)

---

**Created**: 2026-01-25
**Last Updated**: 2026-01-25
**Maintainer**: Lisa (Librarian agent)
**Next Review**: After next test suite failure (check for 3rd occurrence)
