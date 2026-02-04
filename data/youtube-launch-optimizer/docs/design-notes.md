# YouTube Launch Optimizer - Design Notes

**Created:** 2026-02-04
**Purpose:** Document decisions applying SupportSignal patterns to YouTube workflow
**Session:** Freeform exploration for Epic 4-5 preparation

---

## Session Context

**Session 1: 2026-02-04**
- Starting iterative discovery workflow
- Reviewing prompts one-by-one
- Establishing formatting rules and pattern observations
- Penny creating .penny.md observation files in parallel

---

## Key Decisions

### Decision 1: [Session Start] - AI-Driven Selection Over Human-in-the-Loop

**Problem:** Prompt `1-2-title-shortlist.hbs` has ambiguous interaction model - unclear if AI or human makes title selections.

**Decision:** Recommend **AI-driven selection with explicit criteria** for YouTube workflow automation.

**Rationale:**
1. **POEM Architecture Alignment**: Prompts should be AI-executable, not human input forms
2. **Testability**: AI selection can be validated with mock data and structured outputs
3. **Automation Goal**: YouTube workflow targets full automation (15-20 min end-to-end)
4. **Structured Outputs**: AI selection produces parseable JSON, human freeform input doesn't

**Alternatives Considered:**
- **Human selection via UI**: Breaks automation, belongs in application layer not prompt templates
- **Hybrid (AI recommends, human confirms)**: Adds checkpoint complexity, deferred to Story 4.7

**Impact:**
- **Blocks Story 4.7** (Human-in-the-Loop Checkpoints): This architectural decision defines checkpoint design
- **Informs Story 4.6.5**: Schema must support selection criteria (SEO weight, engagement weight, maxSelections)
- **Affects prompts**: Any prompt with "enter your choice" language needs redesign

**Questions Remaining:**
- Should ALL title-related prompts use AI selection? (Yes, likely)
- What are the selection criteria weights? (SEO 40%, Engagement 40%, Brand 20%?)
- How many titles to select? (Top 5 for shortlist?)

---

### Decision 2: [2026-02-04] - Section 3 Workflow DEPRECATED

**Problem:** Section 3 (B-roll Suggestions) represents an old/unusual workflow that is no longer used.

**Decision:** Archive entire Section 3 - move all prompts and analyses to `prompts/archive/3-b-roll-suggestions/`

**Rationale:**
1. **Workflow Obsolete**: Midjourney style selection → CSV export workflow is deprecated
2. **Not Current Practice**: User no longer follows this b-roll generation approach
3. **Historical Value**: Analysis patterns remain valid for understanding workflow evolution
4. **Clean Active Prompts**: Keep only actively-used prompts in main directory

**Impact:**
- Section 3 (4 prompts) archived: 3-1 through 3-4
- All Penny analyses preserved in archive
- Task #3 marked complete (archived rather than kept active)
- Continue to Section 4 for active workflow review

**Files Moved:**
- `3-1-transcript-design-style.hbs` + `.penny.md`
- `3-2-intro-outro-design-ideas.hbs` + `.penny.md`
- `3-3-editor-brief.hbs` + `.penny.md`
- `3-4-transcript-design-ideas.hbs` + `.penny.md`
- `section-3-overview.md` → `archive/3-b-roll-suggestions/README.md`

---

### Decision 3: [Human Feedback] - Hybrid Selection with Human Confirmation

**Problem:** Decision 1 proposed pure AI selection, but workflow needs human confirmation step.

**Decision:** Use **HYBRID approach** for title selection:
1. AI generates title ideas (Step 1-1-configure)
2. AI provides recommendations with reasoning and scores (Step 1-2 enhanced)
3. Human selects/confirms from recommendations (checkpoint)
4. Workflow continues with human's selections

**Rationale:**
- Balances automation with human creative control
- AI narrows options (reduces decision fatigue)
- Human makes final brand-aligned choice
- Aligns with Story 4.7 (Human-in-the-Loop Checkpoints)

**New Output Parameter Required:**
- `selectedTitles` - Array of titles confirmed by human
- Distinct from `recommendedTitles` (AI suggestions) and `titleIdeas` (initial generation)

**Schema Impact:**
- `1-2-title-shortlist.schema.json` needs:
  - Input: `titleIdeas` array
  - Output: `recommendedTitles` (AI's top 5 with scores/reasoning)
  - Output: `selectedTitles` (human's confirmed choices)

**Workflow Impact:**
- Step 1-2 becomes AI recommendation step
- Checkpoint after 1-2 for human selection
- Subsequent steps use `selectedTitles` not `titleIdeas`

---

## SupportSignal Pattern Applications

[Patterns will be documented as discovered]

---

## Blockers Discovered

[Blockers will be logged with story impact as discovered]

---

## Questions for Later

### Q1: [2026-02-04] How Do Sections Map to YAML Workflow Structure?

**Context:** We're reviewing prompts organized in sections (Section 1: Video Preparation, Section 2: Build Chapters, etc.)

**Questions:**
1. **Sections in YAML** - Are "sections" just organizational grouping in docs, or do they have workflow significance?
   - Should YAML have a `sections:` top-level key?
   - Or are sections just comments/documentation?

2. **Parallel Execution Within Sections**
   - Section 1 has parallel opportunity: 1-3-summarize + 1-4-abridge
   - How to represent: `action: llm-parallel` with substeps?
   - SupportSignal pattern for reference

3. **Timing**
   - Update YAML incrementally (section by section)?
   - Or wait until all prompts reviewed (comprehensive update)?

**Decision Needed By:** End of prompt review phase (before Phase 3: Reshape YAML Workflow)

**Related Task:** Task #6 - Update YAML Workflow with Discovered Structure

---

### Q2: [2026-02-04] How to Handle Human Input Mid-Workflow?

**Context:** Prompt 2-2-refine-chapters requires human input (folder names) that is NOT from previous steps.

**The Problem:**
- Some inputs come from previous steps (on the "workflow bus")
- Some inputs come from human interaction (external, checkpoint required)
- YAML workflow needs to distinguish these

**Example from 2-2-refine-chapters:**
- `{{identifyChapters}}` → From step 2-1 (workflow state)
- `{{chapterFolderNames}}` → From human (NOT from previous step)
- `{{transcript}}` → From workflow state

**Questions:**
1. How to represent human input checkpoints in YAML?
2. Does workflow pause and wait for human?
3. What UI mechanism captures human input?
4. How is it different from initial workflow inputs?

**SupportSignal Comparison:**
- SupportSignal has no mid-workflow human input
- All inputs provided upfront
- YouTube needs checkpoint pattern

**Decision Needed By:** Phase 3 (Reshape YAML Workflow)

**Related:**
- Story 4.7 (Human-in-the-Loop Checkpoints)
- Task #6 (Update YAML Workflow)

---

## Data Design Patterns

### Pattern: Computed vs Stored Metadata

**Discovered:** 2026-02-04 (during 2-2-refine-chapters review)

**Observation:**
Metadata like character counts, word counts, array lengths, etc. can be valuable but raises design questions:
- Should it be stored in data files?
- Or computed transiently by applications?

**Example from chapters schema:**
```json
{
  "title": "Introduction",
  "characterCount": 12  // ← Is this stored or computed?
}
```

**Trade-offs:**

**Stored Metadata (in data files):**
- ✅ Faster access (no computation needed)
- ✅ Queryable (can filter by length)
- ❌ Heavier data files
- ❌ Can become stale (if title changes, count needs update)
- ❌ Often not used (clutters data)

**Computed Metadata (transient/application-level):**
- ✅ Lighter data files
- ✅ Always accurate (computed on demand)
- ✅ No stale data issues
- ❌ Computation cost (minimal for simple operations)
- ❌ Not queryable in data layer

**When to Store vs Compute:**

**Store if:**
- Used frequently in queries/filters
- Expensive to compute (complex calculation)
- Needs to be cached for performance
- Example: Word count for long documents

**Compute if:**
- Cheap operation (string length, array length)
- Used infrequently
- Derived from single field
- Example: Character count for titles

**YouTube Workflow Context:**
- **Title character count**: Should be computed (cheap, derived from title)
- **Chapter count**: Could be computed (array.length)
- **Video duration**: Should be stored (comes from external source)

**Application Pattern:**
```typescript
interface Chapter {
  title: string;
  referenceQuote: string;

  // Computed property (not stored)
  get characterCount(): number {
    return this.title.length;
  }
}
```

**Configuration-Based Approach:**
```yaml
schemas:
  chapter:
    fields:
      title:
        type: string
        maxLength: 49
        computedMetadata:
          - characterCount  # Auto-computed, not stored
```

**Related Decisions:**
- Schema design (Epic 4-5)
- Validation rules (49-char limit for titles)
- Performance optimization

**Questions:**
- Should POEM schemas support computed metadata declarations?
- How to configure which metadata is stored vs computed?
- Should validation run on computed values?

---

## Related Files

**Session Tracking:**
- `.current-prompt` - Current progress marker
- `.session-log.md` - Session history
- `design-notes.md` - This file

**Emergent Documentation:**
- `prompts/0-formatting-rules.md` - Formatting standards (existing)
- `prompts/0-observations.md` - Cross-cutting patterns (existing)
- `prompts/*.penny.md` - Individual prompt observations (created by Penny)
