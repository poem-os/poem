# Architecture Decision: Single Responsibility Principle for Prompts

**Date**: 2026-02-04
**Status**: Recommended (not yet implemented)
**Context**: Section 4 prompt review and SRP analysis

---

## Problem Statement

YouTube Launch Optimizer Section 4 uses **3 prompts with 12 total outputs** (4 outputs per prompt):
- 4-1: Theme, keywords, statistics, takeaways
- 4-2: Emotions, tone, audience, USPs
- 4-3: CTAs, phrases, questions, search terms

**Trade-off**: Single Responsibility Principle (SRP) vs token efficiency

### Historical Context (2024)
When prompts were created (2 years ago):
- **Token costs**: $3-10 per 1M input tokens (high)
- **Concern**: Repeating transcript 12 times would be expensive
- **Solution**: Combine 4 related outputs per prompt (3 prompts total)

**Result**: Violates SRP, each prompt juggling 4 distinct extractions.

---

## Analysis: What Changed (2024 → 2026)

### 1. Token Economics
**2024**: Input tokens $3-10 per 1M
**2026**: Input tokens $0.15-0.30 per 1M (90% drop)

**Cost calculation** (12 SRP prompts):
- Abridgement size: ~3k tokens
- 12 prompts × 3k tokens = 36k input tokens
- Cost: 36k × $0.30/1M = **$0.01**

**Conclusion**: Token cost no longer a constraint.

### 2. Parallel Execution
**2024**: Sequential execution (12 prompts = 12× latency)
**2026**: Parallel API support (12 prompts = 1× latency)

**YAML pattern**:
```yaml
- action: llm-parallel
  input: transcriptAbridgement
  steps: [12 focused prompts]
```

**Conclusion**: No latency penalty for SRP approach.

### 3. Quality vs Complexity
**Multi-output prompts**:
- Model balances 4 tasks simultaneously
- Harder to optimize individual extractions
- Complex schema validation
- "Keywords weak but theme strong" → can't iterate independently

**SRP prompts**:
- Model focuses 100% on one extraction
- Easy to improve ("upgrade keyword prompt without touching theme")
- Simple schema per prompt
- Independent quality control

**Conclusion**: SRP produces higher quality outputs.

### 4. Context Windows
**2024**: 8k-32k context windows (repetition concerning)
**2026**: 200k standard context windows (3k × 12 = 36k trivial)

**Conclusion**: Repeating transcript 12 times is negligible.

---

## Decision: Aggressive SRP (12 Focused Prompts)

**Recommendation**: Split Section 4 into **12 focused prompts**, one extraction per prompt.

### Proposed Structure

**Section 4: Content Analysis (12 prompts, parallel execution)**

```
Content Essence:
  4.1: extract-theme
  4.2: extract-keywords
  4.3: extract-statistics
  4.4: extract-takeaways

Engagement Analysis:
  4.5: extract-emotional-triggers
  4.6: extract-tone-style
  4.7: extract-audience-insights
  4.8: extract-usps

Marketing Intelligence:
  4.9: extract-ctas
  4.10: extract-catchy-phrases
  4.11: extract-questions
  4.12: extract-search-terms
```

**Execution**:
```yaml
section_4:
  action: llm-parallel
  input: transcriptAbridgement (from 1-4)
  steps:
    - extract-theme
    - extract-keywords
    - extract-statistics
    - extract-takeaways
    - extract-emotional-triggers
    - extract-tone-style
    - extract-audience-insights
    - extract-usps
    - extract-ctas
    - extract-catchy-phrases
    - extract-questions
    - extract-search-terms
```

---

## Benefits

### 1. Higher Quality
- Each prompt optimized for one extraction
- Model focuses 100% on task
- Better instruction following

### 2. Easier Testing
- Validate theme extraction independently
- Mock data per extraction type
- Isolated quality control

### 3. Better Iteration
- Improve weak extractions without breaking strong ones
- A/B test prompt variations easily
- Independent optimization cycles

### 4. Simpler Schemas
**Current** (complex):
```json
{
  "contentEssence": {
    "theme": "string",
    "keywords": ["string"],
    "statistics": ["string"],
    "takeaways": ["string"]
  }
}
```

**SRP** (simple):
```json
{ "theme": "string" }
{ "keywords": ["string"] }
{ "statistics": ["string"] }
{ "takeaways": ["string"] }
```

### 5. Clearer Prompts
- 20 lines per prompt (vs 60 lines)
- Easier to understand and maintain
- Lower cognitive load

### 6. Negligible Cost
- Token cost: ~$0.01 per video
- Time cost: Same (parallel execution)
- Quality gain: Significant

---

## Alternative Considered: Pragmatic SRP (6 Prompts)

**Logical groupings** (2 related outputs per prompt):

1. Content core: Theme + keywords
2. Content data: Statistics + takeaways
3. Engagement emotion: Triggers + tone
4. Engagement targeting: Audience + USPs
5. Marketing action: CTAs + questions
6. Marketing intelligence: Phrases + search terms

**Pros**:
- Better than current (focus on 2 tasks vs 4)
- Logical groupings preserve context
- Still parallelizable

**Cons**:
- Still violates SRP (each prompt has 2 responsibilities)
- Harder to iterate than pure SRP
- Marginal token savings (not worth trade-off)

**Decision**: Not recommended. Go full SRP or keep current.

---

## Implementation Notes

### Schema Design
Each extraction gets simple, focused schema:
```json
// extract-theme
{ "theme": "string" }

// extract-keywords
{ "keywords": ["string"] }

// extract-statistics
{ "statistics": [
  { "value": "string", "context": "string" }
]}

// extract-emotional-triggers
{ "triggers": [
  { "trigger": "string", "influence": "string" }
]}
```

### Prompt Template Pattern
```handlebars
You are a [specialized role] analyzing video content.

## Input
<abridgement>{{transcriptAbridgement}}</abridgement>

## Task
Extract [single thing] from the transcript.

## Guidelines
[Focused instructions for one extraction]

## Output Format
[Simple, single-focus output]
```

### Testing Strategy
- Unit test each extraction independently
- Mock data per extraction type
- Quality metrics per prompt
- A/B testing variants

---

## Impact Assessment

### Sections Affected
**Section 4 only** (currently)

Other sections may benefit from SRP review:
- Section 1: Already well-focused
- Section 2: Already focused
- Section 5+: TBD (review pending)

### Epic Implications
- **Epic 4 (Schema)**: Simpler schemas per prompt
- **Epic 5 (Templates)**: SRP prompt pattern (reusable)
- **Epic 6 (Workflow)**: Parallel execution infrastructure

---

## Status

**Current**: Recommendation documented
**Next**: Review with user
**Implementation**: Pending approval

---

## Related Patterns

See: `lato-code-patterns.md` for prompt type taxonomy (Predicate, Observation, Classification, Extraction)
