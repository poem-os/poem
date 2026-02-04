# Penny Analysis: 6-1-yt-simple-description

**Prompt File**: `6-1-yt-simple-description.hbs`
**Section**: 6 - YouTube Meta Data
**Status**: ✅ Active
**Created**: 2026-02-04

---

## Overview

Creates the core text content for a YouTube video description in two parts: (1) First line "above the fold" with SEO keyword + community CTA, (2) Simple description "below the fold" with detailed content summary.

**Purpose**: Generate the main description text that will be embedded into the final YouTube description (which includes chapters, links, and other metadata in subsequent prompts).

---

## Input Schema

| Variable | Type | Source Prompt | Required | Description |
|----------|------|---------------|----------|-------------|
| `selectedTitles.[0]` | String (Array First Element) | 5-2 | Yes | The selected video title |
| `foldCta.label` | String | Config/1-1 | Yes | Community CTA label text |
| `foldCta.url` | String (URL) | Config/1-1 | Yes | Community CTA link URL |
| `analyzeContentEssence.mainTopic` | String | 4-1 | Yes | Primary topic for SEO front-loading |
| `analyzeCtaCompetitors.searchTerms` | Array[String] | 4-3 | Yes | Search phrases to weave in (2-3 used) |
| `analyzeContentEssence.keywords` | Array[String] | 4-1 | Yes | Core technical keywords |
| `transcriptAbridgement_v2` | String (Long) | 1-4 | Yes | Abridged transcript for content summary |

**Dependencies**:
- **Section 1**: Configuration (1-1) provides `foldCta`
- **Section 1**: Video Preparation (1-4) provides `transcriptAbridgement_v2`
- **Section 4**: Content Analysis (4-1, 4-3) provides topic/keywords/search terms
- **Section 5**: Title Selection (5-2) provides `selectedTitles`

---

## Output Schema

**Format**: JSON (strict)

```json
{
  "firstLine": "String (40-50 words, ~150 chars, ends with CTA link)",
  "simpleDescription": "String (400-600 chars, 2-3 sentences OR 1 sentence + 3-4 bullets)"
}
```

**Constraints**:
- **First Line**: Must fit in YouTube's "above the fold" visible area (~150 characters), front-load primary keyword, end with community CTA link
- **Simple Description**: Direct tone, no hype, no fluff phrases like "In this video we will explore..."
- **Flow**: First line and description must flow together as one cohesive piece
- **Output Format**: ONLY JSON, no explanation, no markdown wrapper

**What NOT to Include** (handled by downstream prompts):
- Video title (handled separately)
- Chapters/timestamps (6-2)
- Related videos (6-2)
- Affiliate links (6-2)
- Brand/social links (6-2)
- Hashtags (6-2)
- Emojis (6-2)

---

## Workflow Position

**Section 6: YouTube Meta Data** - Prompt 1/4

```
Section 4 (Analysis) → Section 5 (Title) → [6-1] → 6-2 (Full Description) → 6-4 (Custom GPT)
                                              ↓
                                      firstLine + simpleDescription
                                              ↓
                                         (embedded in 6-2)
```

**Execution Order**:
1. Content analysis provides SEO inputs (Section 4)
2. Title selection provides selected title (Section 5)
3. **This prompt (6-1)** generates core description text
4. Next prompt (6-2) embeds this into full description with chapters/links/metadata

---

## Architecture Patterns

### 1. Two-Part Structure Pattern

**Pattern**: Split description into "above the fold" (first line) and "below the fold" (detailed description) to optimize for both YouTube's UI and user engagement.

**Why**: YouTube shows only ~150 characters before "Show more" button. This prompt explicitly optimizes for both visibility zones.

**Related**: See `docs/architecture-decisions/srp-recommendation.md` - this is a focused single-purpose prompt.

### 2. SEO Front-Loading Pattern

**Pattern**: Place primary keyword/topic at the start of the first line for maximum SEO impact.

**Why**: YouTube's algorithm weights the beginning of descriptions more heavily for search ranking.

**Inputs Used**:
- `analyzeContentEssence.mainTopic` → Front-loaded in first line
- `analyzeCtaCompetitors.searchTerms` → Woven naturally (2-3 terms)
- `analyzeContentEssence.keywords` → Included where natural

### 3. Community CTA Integration Pattern

**Pattern**: End first line with community CTA link to encourage engagement while content is fresh.

**Why**: "Above the fold" placement maximizes visibility and click-through rate for community building.

**Implementation**: `{{foldCta.label}}: {{foldCta.url}}` appears at end of 40-50 word first line.

### 4. JSON Output Format Pattern

**Pattern**: Strict JSON output with no explanation or markdown wrapper.

**Why**: Enables programmatic consumption by downstream prompts (6-2 will embed this JSON into final description).

**Format**:
```json
{
  "firstLine": "...",
  "simpleDescription": "..."
}
```

### 5. Explicit Exclusion List Pattern

**Pattern**: Document what NOT to include (handled by other prompts).

**Why**: Prevents duplicate work and ensures clean separation of concerns in the workflow pipeline.

**Excluded** (handled downstream):
- Chapters/timestamps → 6-2
- Related videos → 6-2
- Affiliate links → 6-2
- Brand/social links → 6-2
- Hashtags → 6-2
- Emojis → 6-2

---

## Human Checkpoint

**Type**: 🔵 Light Approval (Post-Generation Review)

**When**: After JSON generation, before embedding in 6-2

**What to Check**:
1. **First Line** (above the fold):
   - Is primary keyword front-loaded?
   - Is community CTA link present at the end?
   - Does it fit in ~150 characters (YouTube's visible limit)?
   - Does it hook the viewer?

2. **Simple Description** (below the fold):
   - Is length 400-600 characters?
   - Is tone direct and informative (no hype)?
   - Does it flow naturally from first line?
   - Are 2-3 search terms woven in naturally?

3. **JSON Format**:
   - Is output ONLY JSON (no explanation)?
   - Are both fields present (`firstLine`, `simpleDescription`)?

**Common Issues**:
- First line too long (exceeds YouTube's ~150 char visible limit)
- CTA link missing or not at end of first line
- Description too verbose (exceeds 600 chars)
- Hype language or fluff phrases ("In this video we will explore...")

**Approval Criteria**:
- ✅ Both parts meet length constraints
- ✅ SEO keyword is front-loaded
- ✅ Community CTA is present and correctly placed
- ✅ Tone is direct and informative
- ✅ JSON output is clean (no wrapper)

---

## LATO Classification

**Level**: 🔵 Light Assistance (LATO-3)

**Automation Threshold**: 80%+ (structured format, clear constraints, objective validation)

**Why Light**:
- Output format is strict (JSON with two fields)
- Length constraints are objective (char counts)
- Exclusion list is explicit
- SEO requirements are measurable (keyword placement)

**Human Review Required**:
- Hook quality (subjective - does first line grab attention?)
- Flow quality (subjective - do parts flow together?)
- Keyword weaving naturalness (subjective - forced vs. natural)
- Brand voice alignment (subjective - tone matches brand)

**Automation Potential**:
- Format validation: 100% (JSON structure, field presence)
- Length validation: 100% (char counts)
- Keyword presence: 90% (can detect if keywords included)
- CTA placement: 100% (can verify link at end of first line)
- Hook/flow quality: 40% (requires human judgment)

**Recommended Workflow**:
1. AI generates JSON output
2. Auto-validate format + length + keyword presence
3. Human reviews hook quality + flow + brand voice
4. Approve or request regeneration

---

## Evolution Notes

**Version History**:

- **v1** (`6-1-yt-simple-description.v1.ARCHIVED.hbs`): Basic SEO description (<1000 chars), simple keyword weaving, unstructured format
- **v2** (current): Two-part structured format (first line + detailed), JSON output, explicit SEO front-loading, community CTA integration, explicit exclusion list

**Key Changes v1 → v2**:
1. ✅ Added two-part structure (above/below fold optimization)
2. ✅ Introduced JSON output format for programmatic consumption
3. ✅ Added SEO front-loading requirement (primary keyword first)
4. ✅ Integrated community CTA link (end of first line)
5. ✅ Added explicit exclusion list (prevent duplicate work)
6. ✅ Tightened length constraints (40-50 words first line, 400-600 chars description)
7. ✅ Changed inputs to use analyzed content (`analyzeContentEssence`, `analyzeCtaCompetitors`) instead of raw `videoKeywords`

**Why Evolved**:
- v1 was too basic and didn't optimize for YouTube's UI structure
- v2 explicitly targets "above the fold" visibility for maximum engagement
- v2 separates concerns (this prompt does core text, 6-2 does assembly)
- v2 enables programmatic consumption via JSON output

---

## Schema Requirements

**Priority**: 🔴 High (Core workflow functionality)

**Required Schemas**:

1. **`foldCta`** (Object):
   ```json
   {
     "label": "string",
     "url": "string (URL format)"
   }
   ```
   - Source: Configuration (1-1)
   - Used in: First line (community CTA)

2. **`analyzeContentEssence`** (Object):
   ```json
   {
     "mainTopic": "string",
     "keywords": ["string"]
   }
   ```
   - Source: Content Analysis (4-1)
   - Used in: SEO front-loading + keyword weaving

3. **`analyzeCtaCompetitors`** (Object):
   ```json
   {
     "searchTerms": ["string"]
   }
   ```
   - Source: CTA/Competitors Analysis (4-3)
   - Used in: Natural search term weaving (2-3 terms)

4. **`selectedTitles`** (Array[String]):
   ```json
   ["Selected Title", "Alternative 1", "Alternative 2"]
   ```
   - Source: Title Selection (5-2)
   - Used in: Video title reference

5. **`transcriptAbridgement_v2`** (String):
   - Source: Video Preparation (1-4)
   - Used in: Content summary context

**Output Schema** (`videoSimpleDescription`):
```json
{
  "firstLine": "string (40-50 words, ~150 chars)",
  "simpleDescription": "string (400-600 chars)"
}
```

---

## SupportSignal Pattern Mapping

**Relevant SupportSignal Patterns**: None directly applicable (description generation is YouTube-specific)

**Generic Pattern**: **Structured Multi-Part Output with Constraints**

Similar to SupportSignal's tiered output formats (e.g., question generation with different difficulty levels), this prompt generates two distinct output parts with different constraints and purposes.

**Transferable Concept**:
- Define multiple output zones with specific constraints (length, tone, content)
- Optimize each zone for different consumption contexts (above fold = hook, below fold = detail)
- Use strict output format (JSON) for programmatic assembly downstream

---

## Questions for YAML Review

1. **CTA Configuration**:
   - Should `foldCta` be configurable per brand, or is it always the same community link?
   - If configurable, where should it be stored (brand config, workflow config, user input)?

2. **Search Term Selection**:
   - Prompt says "weave 2-3 in naturally" from `analyzeCtaCompetitors.searchTerms` array. Should this be configurable (e.g., `maxSearchTerms: 3`)?

3. **Alternative Description Formats**:
   - Prompt allows "2-3 sentences OR 1 sentence + 3-4 bullet points" for Part 2. Should the format preference be user-selectable or AI-chosen?

4. **Character Limits**:
   - First line constraint is "~40-50 words (must fit in ~150 characters)". These are correlated but not identical. Should we validate word count OR character count, or both?

5. **Version Naming**:
   - This is `v2` but references `transcriptAbridgement_v2` (suggesting the input also has versions). Should we establish a version alignment convention?

6. **Prompt Chaining**:
   - Output is embedded in 6-2. Should there be a schema validation step between 6-1 and 6-2 to ensure JSON is valid before embedding?

---

## Related Prompts

| Relationship | Prompt ID | Description |
|--------------|-----------|-------------|
| **Provides Input** | 1-1 | Configuration (foldCta) |
| **Provides Input** | 1-4 | Abridge Transcript (transcriptAbridgement_v2) |
| **Provides Input** | 4-1 | Analyze Content Essence (mainTopic, keywords) |
| **Provides Input** | 4-3 | Analyze CTA/Competitors (searchTerms) |
| **Provides Input** | 5-2 | Select Title Shortlist (selectedTitles) |
| **Consumes Output** | 6-2 | Write Description (embeds firstLine + simpleDescription) |
| **Alternative** | 6-4 | Custom GPT Description (alternative description strategy) |

---

## Tags

`#section-6-youtube-meta-data` `#description-generation` `#seo-optimization` `#json-output` `#two-part-structure` `#community-cta` `#above-the-fold` `#lato-3-light` `#schema-required` `#v2-active`

---

**Analyzed by**: Penny (AI Prompt Assistant)
**Analysis Date**: 2026-02-04
**Last Updated**: 2026-02-04
