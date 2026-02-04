# ⚠️ ARCHIVED: Section 3 - B-roll Suggestions Workflow

**Status**: DEPRECATED
**Archived**: 2026-02-04
**Reason**: Workflow is old/unusual/unusable - deprecated approach

---

## Why This is Archived

This section represented an early b-roll generation workflow that is **no longer used**. The workflow approach (Midjourney style selection → visual prompts → CSV export) has been superseded by more modern methods.

**The analysis and patterns documented here remain valid** for understanding historical workflow evolution, but these prompts should not be used in production.

---

## Original Overview: Design & Editorial

**Original Status**: Complete (4/4 prompts reviewed)
**Created**: 2026-02-04
**Phase**: Design and visual content creation

---

## Section Summary

Section 3 focuses on **visual design and editorial coordination** with heavy Midjourney integration and multiple human checkpoints.

### Prompts
1. **3-1-transcript-design-style** - Generate 10 Midjourney style ideas
2. **3-2-intro-outro-design-ideas** - Create visual prompts for intro/outro  
3. **3-3-editor-brief** - Synthesize editor handoff document
4. **3-4-transcript-design-ideas** - Generate CSV for b-roll production

---

## Key Architectural Patterns

### 1. Human Checkpoints (2 Required)
- **Checkpoint #1**: User selects 1 of 10 styles (between 3-1 and 3-2)
- **Checkpoint #2**: User provides special editor instructions (for 3-3)

### 2. Multi-Format Outputs
- List (10 style alternatives)
- Dual-track concepts (intro/outro)
- Prose document (editor brief)
- CSV file (batch processing)

### 3. External Tool Integration
- **Midjourney**: 3 of 4 prompts target Midjourney
- CSV export for batch image generation
- Human handoff for video editor

### 4. Convergence Point
**3-3 (Editor Brief)** aggregates 5 inputs:
- Design ideas (from 3-2)
- Chapters (from Section 2)
- CTAs (from Section 1)
- Special instructions (from user)

### 5. Long-Range Dependencies
Section 3 pulls from multiple prior sections (not purely sequential)

---

## Workflow Flow

```
3-1: Generate styles (transcript → 10 ideas)
  ↓
[USER SELECTS 1 STYLE]
  ↓
3-2: Intro/outro prompts (style + intro/outro → visual prompts)
  ↓
3-3: Editor brief (5 inputs → handoff document)
  ↓  [USER PROVIDES INSTRUCTIONS]
  ↓
3-4: B-roll CSV (transcript + style → CSV)
  ↓
[EXPORT TO MIDJOURNEY]
```

---

## Input/Output Matrix

| Prompt | Inputs | Output Format | Human Input? |
|--------|--------|---------------|--------------|
| 3-1 | 1 (transcript) | List (10 ideas) | No |
| 3-2 | 3 (style, intro, outro) | Dual-track | Yes (style selection) |
| 3-3 | 5 (multi-source) | Prose document | Yes (instructions) |
| 3-4 | 2 (transcript, style) | CSV | No |

---

## YAML Implications

**New workflow concepts needed**:
- `action: human-select` - Pick from alternatives
- `action: human-input` - Free-form text entry  
- `export` - Output format and destination
- Conditional logic (if pastVideoCta → require thumbnail)

---

## Questions for User Feedback

1. **Style selection UX**: How should user pick from 10 styles? Preview?
2. **Editor brief delivery**: Email? Dashboard? Export?
3. **CSV processing**: Manual Midjourney upload or auto-trigger?
4. **Checkpoint persistence**: Where to store user selections between steps?

---

**Status**: All 4 prompts formatted and analyzed ✅
**Files created**: 8 total (4 prompts + 4 Penny analyses)
