# Penny Analysis: 3-3-editor-brief

**Prompt Type**: Document Synthesis / Brief Generation
**Phase**: Section 3 (Design & Editorial)
**Analyzed**: 2026-02-04

---

## Architectural Observations

### 1. Prompt Category
**Multi-Source Consolidation** - Synthesizes multiple inputs into single actionable document

- Inputs: 5 different sources (design ideas, chapters, CTAs, instructions)
- Output: Unified editor brief
- Pattern: Aggregation → Synthesis → Brief

### 2. Input Sources
**Complex Multi-Phase Dependencies**:

```
Section 1:
  1-7: find-video-cta → futureVideoCta, pastVideoCta

Section 2:
  2-3: create-chapters → chapters

Section 3:
  3-2: intro-outro-design-ideas → introOutroDesignIdeas

External/User:
  videoEditorInstructions (human input - special requirements)
```

**5 distinct inputs** - Most complex input structure seen so far.

### 3. Human Input Element
**External Context**: `{{videoEditorInstructions}}`

- Not from previous workflow steps
- User-provided special requirements
- Another human checkpoint (like Section 2's chapterFolderNames)

### 4. Output Purpose
**Handoff Document** - Not for AI consumption, for human (video editor)

- First prompt generating output for **external stakeholder** (editor)
- Not part of workflow bus for next AI step
- Could be final output or stored for reference

### 5. Conditional Logic
**Past Video CTA Rule**: "If I provide past video CTA then I am specifically needing a thumbnail overlay"

- First conditional requirement seen
- `if pastVideoCta exists → add thumbnail overlay requirement`
- Implicit business logic embedded in prompt

---

## Schema Implications

### Input Schema
```json
{
  "introOutroDesignIdeas": "string (from 3-2)",
  "chapters": "array/string (from 2-3)",
  "videoEditorInstructions": "string (human input)",
  "futureVideoCta": "string (from 1-7)",
  "pastVideoCta": "string | null (from 1-7)"
}
```

### Output Schema (Suggested)
```json
{
  "editorBrief": {
    "introRequirements": "string",
    "outroRequirements": "string",
    "chapters": ["string"],
    "ctaInstructions": {
      "future": "string",
      "past": "string | null",
      "thumbnailOverlayRequired": "boolean"
    },
    "specialInstructions": "string"
  }
}
```

---

## Workflow Position

**Section 3, Step 3** - Synthesis/handoff point

```
Section 1: CTAs → futureVideoCta, pastVideoCta
Section 2: Chapters → chapters
Section 3.2: Design ideas → introOutroDesignIdeas
User input → videoEditorInstructions
                ↓
        3-3: Generate editor brief (THIS STEP)
                ↓
           [Handoff to Editor]
```

**Convergence Point**: Multiple workflow streams merge here.

---

## Patterns & Observations

### Pattern: Multi-Source Synthesis
- Aggregates outputs from Sections 1, 2, 3
- Plus human input (special instructions)
- First "convergence" prompt (opposite of 3-1's divergence)

### Pattern: Human Stakeholder Output
- Brief is for human consumption (video editor)
- Not machine-readable workflow state
- Marks transition from AI workflow → human handoff

### Pattern: Conditional Requirements
- First explicit conditional logic
- `if pastVideoCta → require thumbnail overlay`
- Business rules embedded in prompt text

### Pattern: External Human Input
- `{{videoEditorInstructions}}` from user
- Not on workflow bus
- Second human checkpoint in Section 3 (after style selection)

---

## Questions for Design

1. **Editor Brief Storage**: Is this stored in POEM, or just generated on-demand?
2. **Conditional Logic**: Should POEM support if/then rules in prompts?
3. **Human Stakeholder Outputs**: How to distinguish AI workflow state vs external deliverables?
4. **Special Instructions**: How does user provide `{{videoEditorInstructions}}`? UI input field?

---

## Integration Notes

**Epic 4 (Schema)**: Complex multi-source input validation
**Epic 5 (Templates)**: Conditional logic support, synthesis patterns
**Epic 6 (Workflow)**: Convergence points, external stakeholder handoffs
**Epic 7 (Integration)**: Output format for external tools/humans

---

**Status**: Formatted ✅ | Analysis Complete ✅
