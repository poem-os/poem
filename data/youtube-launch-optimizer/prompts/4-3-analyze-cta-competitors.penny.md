# Penny Analysis: 4-3-analyze-cta-competitors

**Prompt Type**: Actionable Content Extraction / Competitive Research
**Phase**: Section 4 (Content Analysis)
**Analyzed**: 2026-02-04

---

## Architectural Observations

### 1. Prompt Category
**Marketing Intelligence Extraction** - Identifies actionable phrases and competitive research terms

- Input: `{{transcriptAbridgement}}` (from Section 1, Step 1-4)
- Output: CTAs, catchy phrases, questions, search terms
- Pattern: Content → Marketing assets + competitive intelligence

### 2. Third Parallel Analysis
**Completes Analysis Trio**

```
transcriptAbridgement
    ↓
    ├─→ 4-1: Content essence (objective metadata)
    ├─→ 4-2: Audience engagement (emotional/tone analysis)
    └─→ 4-3: CTAs & competitor research (marketing intelligence)
```

**All 3 prompts use same input** → Strong candidate for parallel execution.

### 3. Output Structure
**Four-Category Extraction**:

1. **Call-to-Action Phrases** - Specific CTAs (excluding generic ones)
2. **Catchy Phrases** - Memorable quotes for marketing
3. **Relevant Questions** - Engagement drivers
4. **Search Terms** - Competitor research keywords

Mix of internal use (CTAs, phrases) and external research (search terms).

### 4. Explicit Constraint System
**Strict Extraction Rules**:

- CTAs: No generic phrases ("like and subscribe") unless uniquely phrased
- Catchy phrases: Direct quotes only
- Questions: Both posed and answered
- Search terms: Main topics and specific terminology

**Anti-hallucination design**: "Only explicit content, no inference"

### 5. Optional Output Categories
**"Leave section empty if no items found"**

Unlike 4-1 and 4-2 (which expect all fields populated), this prompt acknowledges some categories may be empty. More flexible schema.

---

## Schema Implications

### Input Schema
```json
{
  "transcriptAbridgement": "string (from 1-4)"
}
```

### Output Schema (Suggested)
```json
{
  "ctaCompetitors": {
    "callToActions": ["string"] | null,
    "catchyPhrases": ["string"] | null,
    "questions": ["string"] | null,
    "searchTerms": ["string"] | null
  }
}
```

**Validation Rules**:
- All arrays can be empty/null
- No minimum item counts
- Direct quotes from transcript (no synthetic content)

---

## Workflow Position

**Section 4, Step 3** - Marketing intelligence (parallel with 4-1, 4-2)

```
Section 1, Step 1-4: transcriptAbridgement
              ↓
    ┌─────────┼─────────┐
    ↓         ↓         ↓
  4-1      4-2      4-3 (THIS STEP)
    └─────────┼─────────┘
              ↓
    [Combined metadata for optimization]
```

**Section 4 = Parallel Analysis Phase**: All 3 steps analyze same input from different angles.

---

## Patterns & Observations

### Pattern: Three-Way Parallel Execution
**Opportunity for 3x speedup**:

```yaml
- action: llm-parallel
  input: transcriptAbridgement
  steps:
    - 4-1-analyze-content-essence
    - 4-2-analyze-audience-engagement
    - 4-3-analyze-cta-competitors
```

All have independent outputs, no sequential dependencies.

### Pattern: Marketing Asset Library
Section 4 creates comprehensive marketing metadata:
- Content (4-1): Theme, keywords, statistics, takeaways
- Engagement (4-2): Emotions, tone, audience, USPs
- Action (4-3): CTAs, phrases, questions, search terms

**Foundational for Sections 5+** (likely title, description, tags generation).

### Pattern: Competitive Intelligence
**Dual purpose**:
1. **Internal optimization**: CTAs, phrases, questions for own content
2. **External research**: Search terms for competitor analysis

First prompt that explicitly supports competitive research workflow.

### Pattern: Anti-Hallucination
Strong constraints against inference:
- "Only explicit content"
- "Do not infer, assume, or create"
- "Direct quotes from transcript"

Quality control pattern for factual extraction.

---

## Questions for Design

1. **Parallel Execution Confirmed?**: Should 4-1, 4-2, 4-3 run in parallel?
2. **Empty Categories**: How to represent in UI? Show "None found" vs hide section?
3. **Search Terms Usage**: Does POEM trigger competitor research, or manual?
4. **CTA Filtering**: How to distinguish "unique" vs "generic" CTAs programmatically?

---

## Section 4 Summary

**All 3 prompts complete** - Section 4 is a **parallel analysis phase**:

| Prompt | Focus | Output Use |
|--------|-------|------------|
| 4-1 | Content essence | SEO, metadata |
| 4-2 | Engagement | Copywriting, targeting |
| 4-3 | CTAs & competitors | Marketing, research |

**Parallel execution potential**: 3x speedup (all use same input, independent outputs)

---

## Integration Notes

**Epic 4 (Schema)**: Optional arrays, anti-hallucination validation
**Epic 5 (Templates)**: Marketing asset extraction pattern
**Epic 6 (Workflow)**: 3-way parallel execution (`action: llm-parallel`)
**Epic 7 (Integration)**: Competitor research tool integration

---

**Status**: Formatted ✅ | Analysis Complete ✅
