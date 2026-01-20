# PRD Sync Workflow Gap

**Created**: 2026-01-20
**Priority**: High
**Category**: BMAD Process Improvement
**Affects**: All BMAD projects using sharded PRDs

---

## Problem Statement

The BMAD `create-next-story` task creates story files but **does NOT update the PRD**, causing PRD drift where implemented stories are not documented in the product requirements.

### Concrete Example (POEM Project)

Stories 1.6, 1.7, and 1.8 were created and implemented but missing from the PRD:

| Story | Created | Status | In `docs/prd/epic-details.md`? | In `docs/prd.md`? |
|-------|---------|--------|-------------------------------|-------------------|
| 1.6   | ~Dec 2025 | Done | ✅ Yes (manually added) | ❌ No (until 2026-01-20) |
| 1.7   | ~Jan 2026 | Done | ✅ Yes (manually added) | ❌ No (until 2026-01-20) |
| 1.8   | 2026-01-20 | Approved | ✅ Yes (manually added) | ❌ No (until 2026-01-20) |

**Discovery**: While creating Story 1.8, user asked "Did you update the PRD?" - Answer was NO.

---

## Root Cause

The `create-next-story` task (`.bmad-core/tasks/create-next-story.md`) workflow:

1. ✅ Loads core config
2. ✅ Identifies next story
3. ✅ Gathers requirements from epic
4. ✅ Gathers architecture context
5. ✅ Populates story template
6. ✅ Runs story draft checklist
7. ❌ **MISSING**: Updates PRD with new story

The task creates the story file at `{devStoryLocation}/{epicNum}.{storyNum}.story.md` but **stops there**.

---

## Impact

### Immediate Impact
1. **PRD Drift**: PRD becomes outdated as stories are created
2. **Manual Cleanup**: Developers must manually sync PRD with story files
3. **Incomplete Documentation**: New team members/agents reading PRD miss recent work
4. **Process Inconsistency**: PRD is supposed to be source of truth, but it's not maintained

### Cascading Impact
1. **PO Validation**: PO reviewing PRD sees incomplete epic structure
2. **Story Planning**: SM planning next story may miss context from recent stories
3. **External Stakeholders**: Anyone reading PRD gets outdated view of project
4. **Brownfield Additions**: If stories are added outside original epic plan, they're invisible in PRD

### Quality Impact
- **Violates "Documentation is Source of Truth" principle**
- **Creates technical debt** (documentation debt)
- **Reduces confidence** in BMAD workflow automation

---

## Current Workaround

**Manual PRD Update** after story creation:
1. Copy story title and acceptance criteria
2. Open `docs/prd/epic-details.md` (if sharded)
3. Manually add story section under correct epic
4. Open `docs/prd.md` (if consolidated exists)
5. Manually add story section under correct epic
6. Verify formatting consistency
7. Save and commit

**Time cost**: 3-5 minutes per story (adds up over 50+ stories)

---

## Proposed Solution

Add **Step 7: Update PRD Documentation** to `create-next-story` task:

### Implementation Details

**Location**: `.bmad-core/tasks/create-next-story.md`
**Insert After**: Step 6 (Story Draft Completion and Review)

### Pseudo-code Logic

```javascript
async function updatePRD(epicNum, storyNum, storyTitle, acceptanceCriteria) {
  const config = loadCoreConfig();

  // Construct story block
  const storyBlock = `
---

#### Story ${epicNum}.${storyNum}: ${storyTitle}

${storyStatement}

**Acceptance Criteria**:

${acceptanceCriteria.map((ac, i) => `${i+1}. ${ac}`).join('\n')}
`;

  // Update sharded PRD (if configured)
  if (config.prd.prdSharded && config.prd.prdShardedLocation) {
    const epicDetailsPath = path.join(config.prd.prdShardedLocation, 'epic-details.md');
    await appendToEpicSection(epicDetailsPath, epicNum, storyBlock);
    log(`   ✓ Updated ${epicDetailsPath}`);
  }

  // Update consolidated PRD (if exists)
  if (config.prd.prdFile && fs.existsSync(config.prd.prdFile)) {
    await appendToEpicSection(config.prd.prdFile, epicNum, storyBlock);
    log(`   ✓ Updated ${config.prd.prdFile}`);
  }
}

async function appendToEpicSection(filePath, epicNum, storyBlock) {
  const content = await fs.readFile(filePath, 'utf-8');

  // Find Epic N section
  const epicPattern = new RegExp(`(### Epic ${epicNum}:.*?)(\\n---\\n\\n### Epic ${epicNum + 1}:|$)`, 's');
  const match = content.match(epicPattern);

  if (!match) {
    throw new Error(`Could not find Epic ${epicNum} section in ${filePath}`);
  }

  // Insert story block before next epic or end
  const updatedContent = content.replace(
    epicPattern,
    `$1${storyBlock}\n$2`
  );

  await fs.writeFile(filePath, updatedContent, 'utf-8');
}
```

### Task Instructions (Natural Language)

Add to `.bmad-core/tasks/create-next-story.md` after Step 6:

```markdown
### 7. Update PRD Documentation

- Based on `prdSharded` and `prdFile` from config, update PRD with new story
- **If `prdSharded: true`**:
  - Append story to `{prdShardedLocation}/epic-details.md` under Epic {epicNum} section
  - Insert before next epic heading or end of file
  - Use consistent formatting: story heading (####), statement, acceptance criteria
- **If consolidated PRD exists** (`prdFile` path exists):
  - Append story to consolidated PRD under Epic {epicNum} section
  - Use same formatting as sharded version
- **Story block format**:
  ```markdown
  ---

  #### Story {epicNum}.{storyNum}: {Story Title}

  As a {role},
  I want {action},
  so that {benefit}.

  **Acceptance Criteria**:

  1. {AC1}
  2. {AC2}
  ...
  ```
- Verify insertion was successful (re-read file and confirm story appears)
- Log: "✓ PRD updated: docs/prd/epic-details.md" (and consolidated if applicable)
- If PRD update fails, WARN user but continue (don't block story creation)

**Error Handling**:
- If epic section not found: Warn user, provide manual instructions
- If file write fails: Warn user, provide manual instructions
- Never fail story creation due to PRD update failure
```

---

## Implementation Considerations

### 1. File Parsing Complexity
- **Challenge**: Finding correct insertion point in PRD markdown
- **Solution**: Use regex pattern matching for epic headings
- **Fallback**: If automation fails, provide manual instructions to user

### 2. Formatting Consistency
- **Challenge**: Maintaining consistent markdown formatting
- **Solution**: Define story block template (shown above)
- **Validation**: Could add optional checklist to verify formatting

### 3. Consolidated vs Sharded PRD
- **Challenge**: Projects may have one or both
- **Solution**: Check for both, update whichever exists
- **Config**: Use `prdSharded`, `prdFile` from core-config.yaml

### 4. Brownfield Stories
- **Challenge**: Stories added outside original epic plan
- **Solution**: Still append to epic section (maintains chronological order)
- **Alternative**: Could insert by story number (more complex)

### 5. Error Recovery
- **Challenge**: What if PRD update fails?
- **Solution**: Graceful degradation - warn user, don't block story creation
- **Rationale**: Story file is primary artifact, PRD is documentation

---

## Testing Strategy

When implementing this fix:

1. **Test with sharded PRD only** (POEM's current setup)
2. **Test with consolidated PRD only** (legacy projects)
3. **Test with both** (ensure no duplication)
4. **Test with neither** (should skip gracefully)
5. **Test insertion at various epic positions** (Epic 1, Epic 3, last epic)
6. **Test when epic section has no stories yet** (first story in epic)
7. **Test when epic section has multiple stories** (append correctly)
8. **Test malformed PRD** (missing epic heading, extra whitespace)

---

## Acceptance Criteria (For Fix Story)

If this becomes a BMAD enhancement story:

1. `create-next-story` task includes Step 7: Update PRD Documentation
2. PRD update is attempted after story file creation
3. Sharded PRD (`{prdShardedLocation}/epic-details.md`) is updated if configured
4. Consolidated PRD (`prdFile`) is updated if file exists
5. Story block format matches existing PRD formatting
6. Story inserted under correct Epic section before next epic
7. Success message logged: "✓ PRD updated: {file path}"
8. If PRD update fails, warning shown but story creation continues
9. Manual update instructions provided if automation fails
10. Documentation updated: `.bmad-core/tasks/create-next-story.md` includes new step

---

## Alternative Solutions Considered

### Alternative 1: Separate PRD Update Task
**Approach**: Create `update-prd.md` task, SM runs after story creation

**Pros**:
- Separates concerns (story creation vs documentation)
- Could be run on multiple stories at once (batch update)
- Easier to implement (no modification to create-next-story)

**Cons**:
- ❌ Extra manual step (defeats automation purpose)
- ❌ Easy to forget (back to original problem)
- ❌ Doesn't solve process gap

**Verdict**: Rejected - doesn't solve root cause

### Alternative 2: PRD Generation from Story Files
**Approach**: Generate PRD from story files (source of truth = stories)

**Pros**:
- No sync needed (stories are source of truth)
- Always accurate (generated on demand)
- Could regenerate entire PRD at any time

**Cons**:
- ❌ Reverses BMAD principle (PRD should be source of truth)
- ❌ Loses PRD as planning document (epic structure, goals)
- ❌ Requires major workflow change

**Verdict**: Rejected - violates BMAD methodology

### Alternative 3: Pre-commit Hook
**Approach**: Git hook detects new story files, updates PRD automatically

**Pros**:
- Automatic (no manual intervention)
- Happens at commit time
- Works for any story creation method

**Cons**:
- ❌ Happens too late (after story created)
- ❌ Complex error handling (what if hook fails?)
- ❌ Requires git (might not always be present)

**Verdict**: Rejected - too fragile, wrong timing

---

## Related Issues

- **Epic Planning**: Should epic structure be locked before stories created?
- **PRD Versioning**: How to handle PRD changes vs story changes?
- **Brownfield Workflow**: Should brownfield stories update PRD differently?
- **QA Validation**: Should QA agent verify PRD sync as part of story review?

---

## Priority Justification

**High Priority** because:
1. Affects ALL BMAD projects (not just POEM)
2. Creates documentation debt on every story
3. Violates core BMAD principle (documentation as source of truth)
4. Easy to fix (estimated 2-4 hours)
5. High value (saves 3-5 min per story × 50+ stories = 2.5+ hours saved)

---

## Estimated Effort

**Task Complexity**: Medium
**Estimated Time**: 2-4 hours

**Breakdown**:
- Understand create-next-story task structure: 30 min
- Design PRD update logic: 30 min
- Implement file parsing and insertion: 1-2 hours
- Test with various PRD configurations: 1 hour
- Update task documentation: 30 min

---

## Implementation Notes for Dev Agent

When implementing this:

1. **Read first**: `.bmad-core/tasks/create-next-story.md` (current workflow)
2. **Reference**: This document for detailed requirements
3. **Test setup**: Use POEM project as test case (has both sharded + consolidated PRD)
4. **Insertion point**: After Step 6, before final summary
5. **Error handling**: Graceful degradation - warn, don't fail
6. **Logging**: Clear success/failure messages
7. **Edge cases**: Empty epic section, malformed PRD, missing files

---

## Success Criteria

This issue is resolved when:
1. ✅ New stories automatically update PRD without manual intervention
2. ✅ Both sharded and consolidated PRDs are updated (if present)
3. ✅ Story format in PRD matches existing formatting
4. ✅ SM agent (Bob) no longer needs to manually sync PRD
5. ✅ Documentation debt eliminated going forward

---

## Follow-up Actions

After implementing this fix:
1. **Audit existing stories**: Verify all stories in `docs/stories/` exist in PRD
2. **Update BMAD documentation**: Add PRD sync to workflow diagrams
3. **Consider QA check**: Add "PRD updated" to story-draft-checklist?
4. **Backport**: Should this be backported to all BMAD users?

---

## Questions for User/Team

1. Should this be a BMAD core enhancement or POEM-specific?
2. Should PRD update be mandatory (fail if can't update) or optional (warn only)?
3. Should QA agent verify PRD sync as part of story review?
4. Should we audit existing POEM stories and ensure all are in PRD?

---

**Next Steps**: Convert this document to a BMAD enhancement story (Epic TBD) or POEM maintenance item.
