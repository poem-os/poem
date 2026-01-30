---
# Architecture Decision Record Metadata
adr_number: "010"
title: "Story Files as Single Source of Truth (Prohibit Handover Documents)"
status: "Accepted"
created: "2026-01-30"
decision_date: "2026-01-30"
story_reference: "Story 1.12"
authors: ["Lisa (Librarian)", "David Cruwys"]
supersedes: null
superseded_by: null
---

# ADR-010: Story Files as Single Source of Truth (Prohibit Handover Documents)

> **Status**: Accepted
> **Date**: 2026-01-30
> **Story**: Story 1.12

## Status

**ACCEPTED** - 2026-01-30

This ADR establishes that story files (`docs/stories/{number}.story.md`) are the single source of truth for all implementation details, explicitly prohibiting the creation of handover documents in the `.ai/` directory.

## Context

### Background

During Story 1.12 implementation, a handover document was created at `.ai/handover-story-1.12-fixes.md` to communicate post-implementation bug fixes and installation workflow improvements to the human user and next agent (Quinn for QA review).

This pattern raises critical questions about documentation source of truth and information fragmentation.

### Problem Statement

**Issue**: Multiple locations for story implementation details creates documentation fragmentation, maintenance burden, and source of truth violations.

**Example**: Story 1.12 handover document contains:
- Task summaries (should be in story checklist)
- Bug fix descriptions (should be in Dev Agent Record)
- Testing instructions (should be in SAT guide)
- File modification summary (should be in File List)
- Next steps (should be in story Status/Notes)

**Impact**: If every story creates handover documents, we'll have:
- Scattered information instead of consolidated story files
- Duplicate content across multiple files
- "Dead" documents after sessions end
- Unclear where to find authoritative information

### Forces at Play

- **Need for Communication**: Developers need to communicate what was done to QA and users
- **Session Boundaries**: Claude Code sessions end, requiring handoff mechanisms
- **Story File Completeness**: Story files have structured sections (Dev Agent Record, File List, etc.) designed for this purpose
- **Documentation Pollution**: `.ai/` directory risks becoming dumping ground for transient documents

### Assumptions

- Story files are designed to be comprehensive (Status, AC, Tasks, Dev Agent Record, File List, QA Results, Knowledge Assets)
- All implementation details belong in structured story sections
- Handover documents duplicate what should be in story files
- Lisa (Librarian) can extract knowledge from story files without needing separate handover docs

### Constraints

- BMAD story file format has defined sections and structure
- Dev Agent (James) has permission boundaries (can only update specific sections)
- `.ai/` directory exists for temporary/session-specific files
- Need clear rules for what belongs in `.ai/` vs. permanent documentation

## Decision

**We will enforce story files as the single source of truth and prohibit handover documents.**

### Detailed Decision

1. **Story files** (`docs/stories/{number}.story.md`) are the definitive record for all implementation details
2. **Handover documents** in `.ai/` directory are **prohibited** for story communication
3. **All story information** must go in appropriate story sections:
   - **Tasks/Subtasks**: Implementation checklist
   - **Dev Agent Record**: Debugging logs, completion notes, challenges encountered
   - **File List**: Files created/modified
   - **Testing**: SAT results, test outcomes
   - **QA Results**: Quinn's review
   - **Knowledge Assets**: Links to KDD documents (created by Lisa)
4. **`.ai/` directory usage** is restricted to:
   - Debug logs during active development (ephemeral, deleted after session)
   - Temporary notes (explicitly marked as transient)
   - Session-specific context (not permanent knowledge)

### Implementation Approach

1. **Immediate**: Delete existing handover document (`.ai/handover-story-1.12-fixes.md`) after integrating unique content into Story 1.12
2. **Update BMAD Dev Agent rules**: Explicitly prohibit handover document creation
3. **Establish `.ai/` directory policy**: Document acceptable uses (debug logs, temp notes only)
4. **Story template update**: Ensure all sections are clear and sufficient for communication
5. **Training**: Educate agents (James, Quinn, Lisa) on where to document information

### Scope

- **In Scope**:
  - Story files as source of truth
  - `.ai/` directory usage policy
  - Handover document prohibition
  - Integration of existing handover content into Story 1.12
- **Out of Scope**:
  - KDD documents (they serve different purpose - reusable knowledge)
  - Architecture/PRD documents (different lifecycle)
  - User-facing guides (different audience)

## Alternatives Considered

### Alternative 1: Allow Handover Documents as Optional Communication
**Description**: Permit handover documents but establish guidelines for when to use them.

**Pros**:
- ✅ Flexibility for complex scenarios
- ✅ Additional communication channel
- ✅ Can include session-specific context

**Cons**:
- ❌ Creates dual sources of truth
- ❌ Unclear when to use handover vs. story file
- ❌ Documentation fragmentation over time
- ❌ Maintenance burden (syncing handover with story)
- ❌ "Dead" documents accumulate in `.ai/`

**Why Not Chosen**: Introduces ambiguity and fragmentation risk. Story files are designed to be comprehensive.

### Alternative 2: Handover Documents as Session Logs (Auto-Delete)
**Description**: Allow handover documents but automatically delete them after session or integrate content.

**Pros**:
- ✅ Temporary communication without permanent clutter
- ✅ Clear lifecycle (ephemeral)

**Cons**:
- ❌ Still duplicates story file content
- ❌ Adds complexity (auto-delete logic)
- ❌ Risk of losing information if not integrated properly
- ❌ Doesn't solve root issue (story file should be sufficient)

**Why Not Chosen**: Adds complexity without solving source of truth problem. Better to fix story files if they're insufficient.

### Alternative 3: Status Quo (Allow Handover Documents)
**Description**: Continue allowing handover documents without restrictions.

**Pros**:
- ✅ No changes needed
- ✅ Maximum flexibility

**Cons**:
- ❌ Documentation pollution continues
- ❌ Every story creates handover docs
- ❌ Scattered information across multiple files
- ❌ Unclear source of truth
- ❌ Maintenance burden grows over time
- ❌ `.ai/` directory becomes "documentation landfill"

**Why Not Chosen**: Unacceptable long-term outcome. Documentation fragmentation defeats purpose of structured story files.

## Rationale

### Why This Decision?

1. **Single Source of Truth**: Story files are designed for comprehensive documentation
2. **BMAD Story Format Sufficiency**: Story structure already has sections for all implementation details
3. **Prevent Documentation Rot**: Handover docs become "dead" after sessions, creating maintenance burden
4. **Clear Information Architecture**: One place to look for story details
5. **Scalability**: 100+ stories with handover docs = chaos

### Decision Criteria

- **Information Completeness**: Story files have sufficient structure → **High**
- **Maintenance Burden**: Handover docs create duplication → **High cost**
- **Discoverability**: Single location easier to find → **High value**
- **Clarity**: Clear rules prevent confusion → **High value**

### Alignment

- **Technical Strategy**: File-based everything, clear structure
- **Business Goals**: Maintainable documentation, knowledge preservation
- **Architectural Principles**: Single source of truth, DRY (Don't Repeat Yourself)

### Risk Mitigation

This decision **eliminates** the risk of documentation fragmentation by enforcing clear boundaries.

## Consequences

### Positive Consequences

- ✅ **Clear source of truth**: Always check story file first
- ✅ **No duplicate content**: Information lives in one place
- ✅ **Better discoverability**: One file to search, not scattered across `.ai/`
- ✅ **Cleaner `.ai/` directory**: Only truly ephemeral files
- ✅ **Scalability**: 100+ stories remain organized
- ✅ **Easier knowledge curation**: Lisa reads story files, not handover docs

### Negative Consequences

- ⚠️ **Story files may grow large**: But Lisa extracts to KDD (VAL-004 handles size)
- ⚠️ **Less session-to-session flexibility**: Must use structured sections

### Technical Debt

**None introduced**. This decision **reduces** technical debt by preventing documentation pollution.

### Impact on Stories

**Future stories**:
- Dev Agent must document all details in story file sections
- No handover documents allowed
- If story file sections are insufficient, propose structure improvements (not workaround with handover docs)

### Reversibility

**Partially reversible**: Could allow handover documents again, but would reintroduce fragmentation. Cost of reversal: re-establishing clear policy.

**Irreversible aspect**: Once `.ai/` accumulates handover docs, cleanup is painful.

## Implementation

### Affected Components

- **Story files**: Remain primary documentation
- **`.ai/` directory**: Usage restricted
- **Dev Agent (James)**: Rules updated to prohibit handover docs
- **QA Agent (Quinn)**: Reads from story files only
- **Librarian (Lisa)**: Curates from story files, not handover docs

### Required Changes

**Code Changes**: None

**Process Changes**:
1. Update Dev Agent (James) rules: Prohibit handover document creation
2. Establish `.ai/` directory policy documentation
3. Update BMAD story template if sections are insufficient
4. Delete existing handover document after content integration

**Documentation Changes**:
1. Create `.ai/README.md` explaining directory purpose and restrictions
2. Update BMAD user guide with this ADR reference
3. Integrate Story 1.12 handover content into story file

### Timeline

- **Decision Date**: 2026-01-30
- **Implementation Start**: 2026-01-30 (immediate)
- **Expected Completion**: 2026-01-30 (during Story 1.12 curation)
- **Review Date**: 2026-04-30 (3 months) - Check if story file structure is sufficient

### Success Criteria

- ✅ No handover documents created in `.ai/` for future stories
- ✅ Story files remain comprehensive and sufficient for all agents
- ✅ `.ai/` directory contains only ephemeral/debug files
- ✅ No developer confusion about where to document information
- ✅ Lisa can curate knowledge from story files without needing external docs

## Related Decisions

- **Related ADR**: [ADR-009: Fixed KDD Taxonomy](./adr-009-fixed-kdd-taxonomy.md) - Establishes KDD document types (Pattern, Learning, Decision, Example) which serve different purpose than handover docs
- **Related Pattern**: Story File Structure (not yet documented) - Could create pattern for effective story documentation

## References

- Story: [Story 1.12](../../stories/1.12.story.md)
- Handover document (to be deleted): `.ai/handover-story-1.12-fixes.md`
- Story 1.12 Pre-Curation Findings: Lines 778-851 (CRITICAL QUESTION FOR LISA section)
- BMAD user guide: `.bmad-core/user-guide.md`

## Notes

### `.ai/` Directory Acceptable Uses

**Allowed** (ephemeral, session-specific):
- Debug logs during active development (delete after session)
- Temporary scratch notes (explicitly marked as transient)
- Session context files (auto-generated, not permanent)

**Prohibited** (permanent knowledge):
- Handover documents for story communication
- Implementation summaries (belongs in story Dev Agent Record)
- Testing instructions (belongs in SAT guide)
- Bug fix descriptions (belongs in story Dev Agent Record or KDD learnings)
- File modification lists (belongs in story File List)

### Action Items

1. **Immediate**: Integrate `.ai/handover-story-1.12-fixes.md` content into Story 1.12 file
2. **Today**: Delete handover document after integration
3. **Today**: Create `.ai/README.md` with usage policy
4. **Next sprint**: Update BMAD Dev Agent rules with handover prohibition

---

**ADR maintained by**: Lisa (Librarian)
**Last updated**: 2026-01-30
**Evidence source**: Story 1.12 documentation pattern analysis
