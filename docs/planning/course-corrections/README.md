# Course Corrections Directory

This directory contains course correction documentation from BMAD `/correct-course` task executions.

## 2026-01-12: Multi-Workflow Architecture

**Trigger**: Testing Penny on NanoBanana revealed architectural gap - no support for multiple workflows within one workspace.

**Files**:
- `2026-01-12-multi-workflow-architecture.md` - Complete Sprint Change Proposal (33KB)
  - Full BMAD change-checklist analysis
  - 3 options evaluated
  - Recommended: Two-phase prototype
  - 6 proposed documentation edits

- `2026-01-12-documentation-updates-checklist.md` - Documentation update plan (18KB)
  - 8 files to update
  - Specific edits for each file
  - Sequenced by dependencies
  - ~2-3 hours total effort

**Outcome**:
- ✅ Story 3.8 (Phase 1) created: `docs/stories/3.8.story.md`
- ✅ Story 4.9 (Phase 2) created: `docs/stories/4.9.story.md`
- ⏭️ Documentation updates: Apply checklist when implementing stories
- 🔮 Epic 9: Full multi-workflow architecture (Q2-Q3 2026)

**Key Insight** (User - 2026-01-12):
> "Reference material could come from more than one directory... it's almost like an array."

This insight led to `reference: ReferenceConfig[]` array architecture supporting multiple sources (local, second-brain, external) with priority-based conflict resolution.

---

**Usage**: When starting Story 3.8 or 4.9, reference these documents for complete context on the course correction that led to the stories.
