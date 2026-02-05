# YouTube Launch Optimizer - Schema Priority List

**Purpose**: Build order and schema requirements for POEM development (Epic 4-5)
**Source**: 27 active prompts (Sections 1-2, 4-7, 9)
**Excluded**: Sections 3, 8 (archived), Sections 10-11 (experimental)
**Date**: 2026-02-05

---

## Build Order: Sequential Workflow

POEM should build schemas in **workflow execution order** (not High/Medium/Low priority). This matches the natural dependency flow.

### Phase 1: Foundation (Section 1)
**7 prompts** - Core content processing and metadata extraction

1. **1-1-configure** - Extract project code + title suggestions
2. **1-2-title-shortlist** - Human selects titles (CHECKPOINT)
3. **1-3-summarize-video** - Create summary
4. **1-4-abridge** - Compress transcript (40-60%)
5. **1-5-abridge-qa** - Validate abridgement quality
6. **1-6-separate-intro-outro** - Extract intro/outro sections
7. **1-7-find-video-cta** - Find video references

**Key Output**: `transcriptAbridgement` (used by 6 downstream prompts)

### Phase 2: Chapters (Section 2)
**3 prompts** - Chapter creation for YouTube

1. **2-1-identify-chapters** - Find natural topic boundaries
2. **2-2-refine-chapters** - Align with folder names (CHECKPOINT - human provides `chapterFolderNames`)
3. **2-3-create-chapters** - Add timestamps from SRT file

**Key Output**: `chapters` (used by Section 6, 9)

### Phase 3: Analysis (Section 4)
**3 prompts** - **PARALLEL EXECUTION** - Content deep-dive

1. **4-1-analyze-content-essence** - Theme, keywords, statistics, takeaways
2. **4-2-analyze-audience-engagement** - Emotional triggers, tone, USPs
3. **4-3-analyze-cta-competitors** - CTAs, catchy phrases, search terms

**Key Outputs**: `mainTopic`, `keywords`, `searchTerms`, `contentHighlights` (feed into Sections 5, 6, 9)
**Critical**: These 3 prompts can run in parallel (3x speedup)

### Phase 4: Visual Assets (Section 5)
**5 prompts** - Title and thumbnail generation

1. **5-1-generate-title** - Generate 10 titles with psychological framework
2. **5-2-select-title-shortlist** - Human curates 2-4 titles (CHECKPOINT)
3. **5-3-generate-thumbnail-text** - Complementary text (≤20 chars)
4. **5-4-thumbnail-visual-elements** - 3 visual concept sets
5. **5-5-thumbnail** - Leonardo AI prompt generation

**Key Outputs**: `selectedTitles`, `thumbnailText` (used by Section 6)

### Phase 5: YouTube Metadata (Section 6)
**3 prompts** - Description and metadata assembly

1. **6-1-yt-simple-description** - First line + simple description (JSON output)
2. **6-2-yt-write-description** - **Assembly prompt** (no LLM needed - template rendering only)
3. **6-4-yt-description-custom-gpt** - Alternative: Custom GPT persona (optional path)

**Key Output**: `videoDescription` (YouTube-ready)
**Note**: 6-2 is pure assembly - skip LLM inference (see `docs/architecture-decisions/assembly-prompts-template-rendering.md`)

### Phase 6: Social Media (Section 7)
**3 prompts** - Cross-platform promotion

1. **7-1-create-tweet** - Twitter/X post (280 chars, 1-3 hashtags)
2. **7-3-create-linkedin-post** - LinkedIn article (1300-1700 chars, professional tone)
3. **7-4-add-to-video-list** - Append to video references list (minimal prompt)

**Key Outputs**: `tweetContent`, `linkedinPost`, video reference entry

### Phase 7: YouTube Defaults (Section 9)
**3 prompts** - Playlists, tags, related videos

1. **9-1-select-playlists** - Select 1-4 playlists (multi-select with rejection reasoning)
2. **9-2-generate-tags** - YouTube tags + description hashtags (dual output)
3. **9-3-select-related-videos** - Select 2-3 related videos with placement recommendations

**Key Outputs**: `selectedPlaylists`, `youtubeTags`, `descriptionHashtags`, `relatedVideos`

---

## Schema Reuse Patterns

**Note**: Document reuse only - **DO NOT implement** $ref or shared schema files yet. Keep schemas simple for initial POEM development.

### High-Reuse Variables (3+ Prompts)

| Variable | Used By | Count | Purpose |
|----------|---------|-------|---------|
| **`transcript`** | 1-1, 1-3, 1-4, 1-6, 1-7, 2-1, 2-2, 2-3 | **8** | Primary content source (YouTube transcript) |
| **`transcriptAbridgement`** | 4-1, 4-2, 4-3, 5-5, 6-4, 7-3 | **6** | Compressed version (40-60% of original) |
| **`keywords`** | 9-1, 9-2, 9-3 | 3 | SEO and discoverability |
| **`mainTopic`** | 9-1, 9-2, 9-3 | 3 | Primary topic/theme |
| **`title`** (or `videoTitle`) | 5-3, 5-5, 6-4, 9-1, 9-2, 9-3 | **6** | Selected video title |
| **`videoLink`** | 7-1, 7-3, 7-4 | 3 | YouTube video URL |

### Critical Dependencies

**Section 4 outputs** feed into **Sections 5, 6, 9** (10+ reuses):
- `mainTopic` (4-1) → Used by 5-1, 6-1, 9-1, 9-2, 9-3
- `keywords` (4-1) → Used by 6-1, 9-1, 9-2, 9-3
- `searchTerms` (4-3) → Used by 6-1, 9-2
- `contentHighlights` (4-1) → Used by 5-1, 5-3, 5-4, 7-1

**Section 1-4 output** (`transcriptAbridgement`) feeds into **Sections 4, 5, 6, 7** (6 reuses):
- Powers all Section 4 analysis prompts (4-1, 4-2, 4-3)
- Powers thumbnail generation (5-5)
- Powers description generation (6-4)
- Powers LinkedIn post (7-3)

**Section 6-1 outputs** feed into **Section 6-2** (assembly):
- `videoDescriptionFirstLine` → Used by 6-2
- `videoSimpleDescription` → Used by 6-2

### External Inputs (Not Generated by Prompts)

| Variable | Type | Source | Used By |
|----------|------|--------|---------|
| **`transcript`** | String (Long) | YouTube transcript API | 8 prompts (Section 1-2) |
| **`srt`** | String (SRT format) | Video file | 2-3 (create-chapters) |
| **`chapterFolderNames`** | Array[String] | **Human input** | 2-2 (refine-chapters) |
| **`projectFolder`** | String | User config | 1-1, 7-4 |
| **`videoLink`** | String (URL) | User config | 7-1, 7-3, 7-4 |
| **`brandConfig`** | Object | User config | 6-2 (brand info, CTAs, social links, legal) |
| **`playlists`** | Array[Object] | Channel config | 9-1 |
| **`videos`** | Array[Object] | Channel video list | 9-3 |

---

## Human Checkpoints (Manual Steps)

POEM must support human input at these points:

1. **1-2-title-shortlist** - Human selects 2-4 titles from AI suggestions
2. **2-2-refine-chapters** - Human provides `chapterFolderNames` array (49-char limit)
3. **5-2-select-title-shortlist** - Human curates 2-4 titles from 10 generated

**Note**: These are LATO-2/LATO-3 prompts with human-in-loop validation.

---

## Parallel Execution Opportunities

POEM can optimize workflow speed with parallel execution:

### Section 1 (2x Speedup)
- **1-3 + 1-4** can run in parallel (both use `transcript`, no dependencies)

### Section 4 (3x Speedup)
- **4-1 + 4-2 + 4-3** can run in parallel (all use `transcriptAbridgement`, independent outputs)

**Total Potential**: ~4x speedup for Sections 1 + 4 combined

---

## Schema Count by Section

| Section | Prompts | Input Variables (Unique) | Output Variables | Human Checkpoints |
|---------|---------|--------------------------|------------------|-------------------|
| 1 | 7 | ~8 | 7 | 1 (1-2) |
| 2 | 3 | ~5 | 3 | 1 (2-2) |
| 4 | 3 | ~3 | 9 | 0 |
| 5 | 5 | ~12 | 5 | 1 (5-2) |
| 6 | 3 | ~18 | 3 | 0 |
| 7 | 3 | ~8 | 3 | 0 |
| 9 | 3 | ~10 | 3 | 0 |
| **Total** | **27** | **~48 unique** | **33** | **3** |

**Note**: Some variables have multiple aliases (e.g., `title` vs. `videoTitle`). Final schema design should normalize naming.

---

## Recommendations for POEM Schema Development

### 1. Namespace Organization

Organize schemas by source section for clarity:

```
schemas/
├── section-1-video-preparation/
│   ├── configure-output.json
│   ├── abridge-output.json
│   └── ...
├── section-2-chapters/
│   ├── identify-chapters-output.json
│   └── ...
├── section-4-analysis/
│   ├── content-essence-output.json
│   └── ...
├── shared/
│   ├── transcript.json (used by 8 prompts)
│   ├── transcript-abridgement.json (used by 6 prompts)
│   └── brand-config.json
└── external/
    ├── srt-file.json
    └── user-config.json
```

### 2. Naming Conventions

**Current Issues**:
- `title` vs. `videoTitle` (same concept, different names)
- `transcriptAbridgement` vs. `transcriptAbridgement_v2` (version drift)

**Recommendation**: Normalize during schema design phase:
- Use `videoTitle` consistently (more explicit)
- Use `transcriptAbridgement` (drop `_v2` suffix - version in metadata instead)

### 3. Shared Schema Components

**Don't implement $ref now**, but be aware these could be shared later:

- **Brand Config** (6-2): `brandConfig.ctas`, `brandConfig.affiliates`, `brandConfig.socialLinks`
- **Video Metadata**: `videoTitle`, `videoLink`, `videoCode`, `projectCode`
- **Analysis Outputs**: `mainTopic`, `keywords`, `searchTerms`

### 4. Assembly Prompt Handling

**6-2-yt-write-description** is a **pure assembly prompt** (template rendering only, no LLM):

```yaml
# In prompt metadata
type: assembly
skipLLM: true
```

POEM should skip LLM inference for this prompt. See `docs/architecture-decisions/assembly-prompts-template-rendering.md`.

### 5. Validation Priority (3 Phases)

**Phase 1 (MVP)**: Validate required fields exist
- Check all required variables are present before prompt execution
- Simple presence/absence validation

**Phase 2 (Quality)**: Validate types and formats
- String lengths (e.g., thumbnail text ≤20 chars)
- URL formats (e.g., `videoLink` is valid YouTube URL)
- Number ranges (e.g., `preservationScore` is 0-100)

**Phase 3 (Advanced)**: Validate business rules
- Character limits (e.g., 2-2 chapter titles ≤49 chars)
- Array lengths (e.g., 5-2 selects 2-4 titles)
- Cross-field validation (e.g., `selectedTitles` are subset of `titleIdeas`)

---

## Next Steps for POEM Development

### Epic 4: Mock Data Generation

1. **Start with Section 1** (foundation schemas)
   - Create mock `transcript` (realistic YouTube transcript format)
   - Create mock `projectFolder`, `videoLink` (config data)
   - Generate sample outputs for 1-1 through 1-7

2. **Section 4 next** (high-reuse outputs)
   - Mock `mainTopic`, `keywords`, `searchTerms`, `contentHighlights`
   - These feed into Sections 5, 6, 9

3. **Work sequentially** through Sections 2, 5, 6, 7, 9
   - Each section builds on previous outputs
   - Natural dependency flow

### Epic 5: Schema Management

1. **Create JSON Schemas** for all 27 prompts
   - Input schemas (48 unique variables)
   - Output schemas (33 outputs)

2. **Implement validation** (3-phase approach)
   - Phase 1: Required field checks (MVP)
   - Phase 2: Type/format validation (Quality)
   - Phase 3: Business rule validation (Advanced)

3. **Document naming conventions**
   - Normalize `title` vs. `videoTitle`
   - Drop version suffixes (`_v2`)
   - Consistent casing (camelCase for variables)

4. **Tag assembly prompts**
   - Mark 6-2 with `type: assembly` and `skipLLM: true`
   - POEM workflow engine can optimize (skip LLM inference)

---

## Full Schema Extraction Reference

For complete details on all input/output schemas, see:
**`data/youtube-launch-optimizer/schema-extraction.md`**

This document contains:
- All 48 input variables with types and sources
- All 33 output schemas with JSON structures
- Detailed reuse patterns
- Schema dependencies mapped

---

**Last Updated**: 2026-02-05
**Status**: ✅ Ready for Epic 4-5 Development
**Source**: 27 Penny analyses (Sections 1-2, 4-7, 9)
