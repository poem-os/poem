# Handover: Batch 3 Story File Epic Reference Review

**Date**: 2026-02-03
**Context**: Epic Renumbering Validation (Epic 5 insertion, Epics 5-9 shifted to 6-10)
**Status**: Batches 1-2 complete, Batch 3 in progress
**Agent**: Lisa (Librarian)

---

## 📋 Executive Summary

**Epic renumbering work** (commit 877e846) inserted new Epic 5 (Workflow Orchestration Agents) and shifted existing Epics 5-9 to 6-10. Validation identified **47 files** with outdated epic references.

**Completed**:
- ✅ Batch 1: 5 critical files (commit 96989f8)
- ✅ Batch 2: 3 medium-priority files + ADR-011 + pre-commit hook update (commit 736eec2)
- ✅ Total: 8 files updated, 34 references corrected

**Remaining**:
- ⚠️ Batch 3: 40 story files need individual review (manual judgment required)
- 📋 Optional: 8 navigation index files (low priority)

---

## ✅ Completed Work

### Batch 1 (Commit 96989f8) - Critical Files

| File | References | Changes |
|------|-----------|---------|
| `docs/poem/triage-guide.md` | 10 | Fixed duplicate epic theme lists |
| `docs/kdd/decisions/adr-009-fixed-kdd-taxonomy.md` | 9 | Epic 8→9 (BMAD Integration) |
| `docs/stories/3.9.story.md` | 6 | Epic 6→7 (Integration Agent) |
| `docs/stories/3.9.story-SAT.md` | 2 | Epic 6→7 (Integration Agent) |
| `docs/stories/3.2.story.md` | 4 | Epic 7→8 (Mock Data API) |

**Total**: 31 references corrected

### Batch 2 (Commit 736eec2) - Medium Priority + ADR

| File | References | Changes |
|------|-----------|---------|
| `docs/kdd/decisions/adr-008-file-based-workflow-persistence.md` | 1 | Epic 5+→6+ |
| `docs/architecture.md` | 1 | Epic 7→8 (line 767) |
| `docs/future-enhancements.md` | 1 | Epic 10→9 (header fix) |
| `docs/kdd/decisions/adr-011-pre-commit-testing-strategy.md` | NEW | Documented removal of pre-commit tests |
| `.husky/pre-commit` | - | Removed `npm run test:unit` |

**Total**: 3 references corrected + ADR created + hook updated

---

## 🔄 Epic Renumbering Mapping

Use this table to validate changes:

| Old Epic | New Epic | Name |
|----------|----------|------|
| Epic 5 | Epic 6 | System Agent & Helper Generation |
| Epic 6 | Epic 7 | Integration Agent & Provider Pattern |
| Epic 7 | Epic 8 | Mock/Test Data Agent & Level 2 Mock Data |
| Epic 8 | Epic 9 | BMAD Integration - Capability Validation Pattern |
| Epic 9 | Epic 10 | Multi-Workflow Support |
| **NEW** | **Epic 5** | **Workflow Orchestration Agents (Alex + Oscar)** |

**Story number examples**:
- Old: Story 5.1, 5.2, 5.3 → New: Story 6.1, 6.2, 6.3
- Old: Story 6.1, 6.2 → New: Story 7.1, 7.2
- Old: Story 7.2 → New: Story 8.2
- Old: Story 8.x → New: Story 9.x
- Old: Story 9.x → New: Story 10.x

---

## ⚠️ Batch 3: Remaining Story Files (40 files)

### Review Criteria

For each file, determine:

1. **Active reference** - Future work or deferred implementation → **UPDATE**
2. **Historical context** - Describing past decisions or completed work → **KEEP AS-IS**
3. **Unclear** - Requires domain knowledge or PO input → **FLAG FOR REVIEW**

### File List (40 files)

**Epic 1 Stories** (4 files):
- `docs/stories/1.11.story.md` - References old Epic numbers
- `docs/stories/1.12-story-context.md` - References old Epic numbers
- `docs/stories/1.3.story.md` - References old Epic numbers
- `docs/stories/1.6.story.md` - References old Epic numbers

**Epic 3 Stories** (2 files):
- `docs/stories/3.2.9.story.md` - References old Epic numbers
- `docs/stories/3.4.story.md` - References old Epic numbers

**Other Story Files** (34 files):
*(Run grep to identify exact files)*

```bash
# Find all story files with Epic 5-9 references
grep -l "Epic [5-9]" docs/stories/*.md | grep -v "3.2.story.md" | grep -v "3.9"
```

### Suggested Workflow

**Step 1: Batch Review (10-20 files at a time)**
```bash
# Read first 10 files, identify patterns
for file in <file-list>; do
  # Check context around "Epic X" references
  grep -n -C 3 "Epic [5-9]" $file
done
```

**Step 2: Categorize**
- **Active**: Files with "planned for Epic X", "will be implemented in Epic X"
- **Historical**: Files with "this was deferred from Epic X", "Epic X completed this"
- **Unclear**: Files needing PO/David input

**Step 3: Batch Update**
- Group similar changes (e.g., all "Epic 7→8" for mock data references)
- Use background Task agent for batch edits
- Commit in logical groups (e.g., "Epic 1 stories", "Epic 3 stories")

---

## 🎯 Recommended Next Steps

### Immediate (Next Session)

**Option A: Complete Batch 3 (40 files)**
- Review all 40 story files
- Update active references
- Document historical references as OK
- Commit in 2-3 batches (by epic or by pattern)
- Time estimate: 20-40 minutes

**Option B: Partial Batch 3 (10-20 files)**
- Review first 10-20 files (Epic 1 stories, Epic 3 stories)
- Update what's clear, flag unclear for PO
- Create handover for remaining 20-30 files
- Time estimate: 10-20 minutes

**Option C: Defer Batch 3**
- Story files are lower priority (most are historical context)
- Focus on active development work
- Revisit during next epic planning or story creation

### Optional (Future)

**Create Navigation Indexes** (8 directories missing index.md):
- `docs/planning/index.md` (22 files - important)
- `docs/stories/index.md` (82 files - critical for organization)
- `docs/guides/index.md` (3 files)
- `docs/backlog/index.md`, `docs/qa/index.md`, `docs/testing/index.md`, `docs/workflows/index.md`

---

## 📂 Key File Paths

**Validation Results**:
- Epic renumbering commit: `877e846`
- Batch 1 commit: `96989f8`
- Batch 2 commit: `736eec2`

**Documentation**:
- Epic list (updated): `docs/prd/epic-list.md`
- Epic details (updated): `docs/prd/epic-details.md`
- ADR on pre-commit testing: `docs/kdd/decisions/adr-011-pre-commit-testing-strategy.md`

**Story Files Directory**:
- Location: `docs/stories/`
- Count: 82 total story files
- Affected: 40 files with Epic 5-9 references

---

## 🔍 Validation Commands

**Find remaining story files with old epic refs**:
```bash
cd /Users/davidcruwys/dev/ad/poem-os/poem
grep -l "Epic [5-9]" docs/stories/*.md | wc -l  # Count
grep -l "Epic [5-9]" docs/stories/*.md           # List
```

**Check specific file for epic references**:
```bash
grep -n "Epic [5-9]" docs/stories/1.11.story.md
```

**Verify no broken links**:
```bash
npm run validate-kdd
```

---

## 📊 Progress Tracking

| Phase | Files | Status | Commit |
|-------|-------|--------|--------|
| Batch 1 (Critical) | 5 | ✅ Complete | 96989f8 |
| Batch 2 (Medium) | 3 | ✅ Complete | 736eec2 |
| ADR-011 + Hook | 2 | ✅ Complete | 736eec2 |
| **Batch 3 (Stories)** | **40** | **⚠️ In Progress** | - |
| Navigation Indexes | 8 | 📋 Optional | - |

**Completion**: 8/48 core files (17%)
**Remaining**: 40 story files (83%)

---

## 💡 Tips for Next Agent

1. **Context Loading**: Read this handover + `docs/planning/epic-5-workflow-orchestration-agents.md` for epic context
2. **Pattern Recognition**: Many story files will have similar patterns (e.g., "deferred to Epic 7")
3. **Batch Operations**: Group similar changes for efficiency
4. **Human Judgment**: Flag unclear cases for PO rather than guessing
5. **Commit Granularity**: Commit in logical batches (by epic, by pattern type)
6. **Testing**: No unit tests in pre-commit now (ADR-011), but verify KDD links stay healthy

---

## 🔗 Related Documents

- Original epic renumbering handover: `docs/planning/handover-epic-renumbering.md`
- Epic 5 planning: `docs/planning/epic-5-workflow-orchestration-agents.md`
- Validation findings: See Lisa's consolidated report (this session)
- ADR on testing strategy: `docs/kdd/decisions/adr-011-pre-commit-testing-strategy.md`

---

## 🗑️ Self-Deletion Instructions

**When Batch 3 is complete**:

1. Verify all 40 story files reviewed and updated (or documented as historical context)
2. Commit final changes
3. Delete this handover file:
   ```bash
   git rm docs/planning/handover-batch-3-story-review.md
   git commit -m "chore: remove completed handover (Batch 3 story review finished)"
   ```

**Completion criteria**:
- ✅ All 40 story files reviewed (active vs. historical context determined)
- ✅ Active references updated with correct epic numbers
- ✅ Historical references documented as OK (no changes needed)
- ✅ Changes committed (1-3 commits depending on grouping)
- ✅ No broken links (verify with `npm run validate-kdd`)

**This file is temporary** - it exists only to preserve context between sessions. Once Batch 3 is complete, this handover should be deleted as it becomes outdated/redundant.

---

**Handover Created By**: Lisa (Librarian)
**Handover Date**: 2026-02-03
**Session Context**: 108k tokens remaining, fresh validation context loaded
**Recommended Action**: Continue in current session (Option B: Partial Batch 3)
