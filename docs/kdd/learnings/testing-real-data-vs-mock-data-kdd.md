---
# Learning Document Metadata
topic: "testing"
issue: "real-data-vs-mock-data"
created: "2026-01-30"
story_reference: "Story 1.12"
category: "testing"
severity: "Medium"
status: "Resolved"
recurrence_count: 1
last_occurred: "2026-01-30"
---

# Testing Against Real vs Mock Data - Learning

> **Issue**: Mock data tests passed but real user data exposed function bug
> **Category**: testing
> **Story**: Story 1.12
> **Severity**: Medium (wasted debugging time, delayed fix)

## Problem Signature

### Symptoms
During field testing of Story 1.12 installation workflow fixes in v-voz project:
- Feature appeared to work in unit tests (all passing)
- Feature failed silently in production (user's v-voz directory)
- Debugging focused on wrong root cause (npm/npx linking issues)
- Actual bug: function implementation relied on data structure assumptions

**Affected component**: `bin/install.js` → `getExistingWorkflows()` function
**When it occurs**: Testing against real user directories with legacy/incomplete data

### Error Details
```
User reported: "Installation workflow detection not working"
Expected: Show existing workflows during install
Actual: No workflows shown, prompts for "first" workflow
```

**Investigation revealed**:
- Unit tests passed (created mock `poem.yaml` with perfect structure)
- Real user `poem.yaml` was migrated but missing `workflows: {}` field
- Function only checked yaml file, ignored filesystem reality
- Workflow directory existed (`languish-the-artist`) but yaml didn't reference it

### Environment
- **Technology Stack**: Node.js 22.x, POEM installation script
- **Environment**: User's real project directory (v-voz)
- **Configuration**: Legacy `poem.yaml` from pre-migration POEM version

### Triggering Conditions
1. User runs `npx poem-os install` in project with existing POEM installation
2. `poem.yaml` exists but is in old format (missing `workflows` field)
3. Workflow directories exist in filesystem (`poem/workflows/{name}/`)
4. Function `getExistingWorkflows()` only checks yaml, not filesystem

## Root Cause

### Technical Analysis

**Function Implementation Flaw**:
```javascript
// WRONG (original): Only checked yaml file
async function getExistingWorkflows(targetDir) {
  const config = loadPoemConfig(targetDir);
  const workflows = config.workflows ? Object.keys(config.workflows) : [];
  return workflows;
}
```

**Problem**: Function assumed `poem.yaml` would always have clean, complete structure after migration. Reality: User data is messy, has old formats, incomplete migrations, manual edits.

### Contributing Factors
- **Mock Data Testing Only**: Unit tests used perfectly formatted mock data
- **Assumption Chain**: Assumed migration worked → assumed yaml correct → assumed function works
- **No Real-World Validation**: Never tested against actual user directory before field testing
- **Wrong Root Cause Analysis**: Blamed npm/npx/linking instead of inspecting actual function logic

### Why It Wasn't Caught Earlier
1. **Unit tests validated LOGIC but missed REAL-WORLD compatibility**
2. **No integration test against messy/legacy data**
3. **Field testing happened after "tests passed" confidence built up**
4. **Function implementation prioritized config file over filesystem (wrong source of truth)**

## Solution

### Resolution Steps
1. **Debugged function directly**:
   - Inspected user's actual `poem.yaml` file structure
   - Discovered missing `workflows` field
   - Realized function relied on yaml instead of checking filesystem

2. **Fixed function to check filesystem first**:
   ```javascript
   // FIXED: Check filesystem for workflow directories
   async function getExistingWorkflows(targetDir) {
     const workflowsDir = path.join(targetDir, 'poem', 'workflows');
     let workflows = [];

     // Check filesystem first (source of truth)
     if (existsSync(workflowsDir)) {
       const entries = await fs.readdir(workflowsDir, { withFileTypes: true });
       workflows = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
     }

     return workflows;
   }
   ```

3. **Verified fix in user's v-voz directory**:
   - Function now works regardless of yaml file completeness
   - Detects `languish-the-artist` workflow correctly
   - No dependency on migration success

### Code Changes

**Before**:
```javascript
// Only checked yaml file
const workflows = config.workflows ? Object.keys(config.workflows) : [];
```

**After**:
```javascript
// Check filesystem for workflow directories
if (existsSync(workflowsDir)) {
  const entries = await fs.readdir(workflowsDir, { withFileTypes: true });
  workflows = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
}
```

### Verification
- ✅ Tested in v-voz directory with real workflow
- ✅ Function detects existing workflow correctly
- ✅ Installation prompts change from "first" to "another"
- ✅ Works regardless of `poem.yaml` structure

### Time to Resolve
**Total Time**: ~30 minutes (from report to fix verification)
**Breakdown**:
- Investigation: 20 minutes (chasing wrong root causes)
- Implementation: 5 minutes (simple fix once root cause identified)
- Testing: 5 minutes (field verification in v-voz)

**Wasted Time**: ~15 minutes on npm/npx explanations (red herrings)

## Prevention

### How to Prevent This in Future Stories

**For Developers (James)**:
- ✅ **Test against real user directories** before marking story complete
- ✅ **Prefer filesystem as source of truth** over config files for discovery operations
- ✅ **Assume user data is messy** (old formats, incomplete migrations, manual edits)
- ✅ **Debug function directly** when feature doesn't work (don't assume infrastructure issues)
- ✅ **Avoid assumption chains** (migration worked → yaml correct → function works)

**For QA (Quinn)**:
- ✅ Add to review checklist: "Was feature tested against real user data?"
- ✅ Validate: Functions that discover user-created resources should check filesystem first
- ✅ Flag: Mock-data-only testing as risk factor in review

**For Story Creation (Bob)**:
- ✅ Include in acceptance criteria: "Feature works with legacy/incomplete data"
- ✅ Require field testing against real project directories for installation stories

### Recommended Patterns
- Consider creating: [Filesystem-First Discovery Pattern](../patterns/filesystem-first-discovery-pattern.md)
- If this pattern recurs 3+ times, promote to reusable pattern

### Tests Added
No new automated tests added (fix was to use filesystem instead of config).

**Future improvement**: Create integration test that uses real user directory fixtures (not just mock data).

## Related Incidents

### Previous Occurrences
- **Story 1.12**: First occurrence (this incident)

### Similar Issues
None documented yet in this codebase.

### Pattern Promotion Status
- **Status**: Candidate for Pattern (if recurs 2+ more times)
- **Pattern**: Filesystem-First Discovery Pattern (not yet created)

## Lessons Learned

### Key Takeaways
1. **Mock data validates logic, not real-world compatibility** - Unit tests passed because mock data was perfect
2. **Filesystem is ground truth for discovery** - Config files can be outdated, corrupted, or manually edited
3. **Test against messy data** - Real users have legacy formats, incomplete migrations, manual edits
4. **Debug the function first** - Don't blame infrastructure (npm/npx) before inspecting actual code logic
5. **Wasted user time damages trust** - Repeated false assurances ("tests passed", "npm link works") frustrate users

### Impact Assessment
- **Time Lost**: 30 minutes total (15 minutes wasted on wrong root cause)
- **Scope**: Local to Story 1.12 (installation workflow)
- **Preventability**: **High** - Could have been prevented with real-data testing

**User Impact**:
- Wasted user time with incorrect explanations
- Damaged trust with repeated false assurances
- User rightfully frustrated

## References

- Story: [Story 1.12](../../stories/1.12.story.md)
- Story Pre-Curation Findings: Lines 501-589 (comprehensive debugging session documentation)
- Related patterns: Filesystem-First Discovery Pattern (candidate)
- Files modified: `bin/install.js` (getExistingWorkflows function)

---

**Learning documented by**: Lisa (Librarian)
**Status**: Resolved (2026-01-30)
**Recurrence tracking**: Monitor for similar issues in future installation/discovery stories
