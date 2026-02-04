# Penny Analysis: 3-2-intro-outro-design-ideas

**Prompt Type**: Visual Content Generation / Midjourney Prompt Creation
**Phase**: Section 3 (Design & Editorial)
**Analyzed**: 2026-02-04

---

## Architectural Observations

### 1. Prompt Category
**Targeted Visual Ideation** - Generates Midjourney prompts for specific video segments

- Inputs: `{{designStyle}}`, `{{transcriptIntro}}`, `{{transcriptOutro}}`
- Output: Concepts + 2 Midjourney prompts per concept (intro & outro)
- Pattern: Style-guided prompt generation

### 2. Style Dependency
**Uses Output from 3-1** - `{{designStyle}}` comes from previous step

This confirms the workflow chain:
```
3-1: Generate 10 styles → User selects 1 → 3-2: Apply selected style
```

**Critical**: This is the first **human checkpoint** in Section 3 (user must select style between steps 3-1 and 3-2)

### 3. Input Sources
**Multi-Source Dependencies**:
- `{{designStyle}}` ← From 3-1 (via human selection)
- `{{transcriptIntro}}` ← From Section 1, Step 1-6 (separate-intro-outro)
- `{{transcriptOutro}}` ← From Section 1, Step 1-6 (separate-intro-outro)

Long-range dependencies spanning back to Section 1.

### 4. Output Structure
**Dual-Track with Variable Count**:

```
Intro: N concepts → 2 prompts each = 2N prompts
Outro: M concepts → 2 prompts each = 2M prompts
```

Unlike 3-1 (fixed 10 ideas), this generates variable output based on identified concepts.

### 5. Generation Pattern
**2-Alternative Pattern** - For each concept, generate 2 prompt variations

- Provides choice/redundancy
- Similar to A/B testing approach
- User can pick best visual for each concept

---

## Schema Implications

### Input Schema
```json
{
  "designStyle": "string (selected from 3-1 output)",
  "transcriptIntro": "string (from 1-6)",
  "transcriptOutro": "string (from 1-6)"
}
```

### Output Schema (Suggested)
```json
{
  "intro": {
    "concepts": [
      {
        "id": 1,
        "text": "string",
        "prompts": ["string", "string"] // Always 2
      }
    ]
  },
  "outro": {
    "concepts": [
      {
        "id": 1,
        "text": "string",
        "prompts": ["string", "string"] // Always 2
      }
    ]
  }
}
```

---

## Workflow Position

**Section 3, Step 2** - Style-guided visual prompt generation

```
1-6: separate-intro-outro → transcriptIntro/Outro
                                    ↓
3-1: Generate 10 styles → [HUMAN SELECTS] → designStyle
                                    ↓
                            3-2: Generate visual prompts (THIS STEP)
```

**Human Checkpoint Confirmed**: User must select design style between 3-1 and 3-2.

---

## Patterns & Observations

### Pattern: Human Checkpoint
- Explicit human input required (select design style)
- Cannot auto-execute 3-2 without human intervention
- YAML must support checkpoint/pause mechanism

### Pattern: Long-Range Dependencies
- Uses outputs from Section 1 (intro/outro from 1-6)
- Skips Section 2 entirely
- Not all sections are sequential

### Pattern: Dual-Track Processing
- Processes intro and outro in parallel structure
- Same logic applied to both segments
- Could be optimized with parallel execution

### Pattern: Multi-Alternative Generation
- 2 prompts per concept (like 3-1's 10 alternatives)
- Common theme in Section 3: Generate options for human selection

---

## Questions for Design

1. **Style Selection Storage**: Where is the selected `{{designStyle}}` stored between 3-1 and 3-2?
2. **Concept Count**: Is there a target/limit for number of concepts to identify?
3. **Prompt Usage**: Are these Midjourney prompts used immediately, or stored for later?
4. **Dual-Track Pattern**: Should intro/outro be processed in parallel?

---

## Integration Notes

**Epic 4 (Schema)**: Variable-length arrays with nested 2-item arrays
**Epic 5 (Templates)**: Human checkpoint pattern, dual-track processing
**Epic 6 (Workflow)**: Checkpoint mechanism for human input storage

---

**Status**: Formatted ✅ | Analysis Complete ✅
