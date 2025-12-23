# YouTube Launch Optimizer - Workflow Specification

**Purpose**: Document the YouTube Launch Optimizer workflow as explored through video b64 (BMAD Claude SDK Tutorial). This serves as the concrete use case for POEM Epic 4 (System Validation).

**Created**: 2025-12-08
**Source**: Scouting session analyzing 50+ prompts against real video production workflow

---

## Executive Summary

The YouTube Launch Optimizer is a multi-prompt workflow that transforms a raw video transcript into complete YouTube launch assets: titles, descriptions, chapters, thumbnails, tags, and social posts.

**Key characteristics that make this ideal for POEM validation:**

- 50+ Handlebars prompt templates
- 11 logical sections with dependencies
- Progressive data accumulation (37 workflow-data fields)
- Mix of extraction, generation, transformation, and human curation prompts
- Real platform constraints (YouTube character limits, SEO rules)
- Multiple V1/V2 prompt iterations showing refinement patterns

---

## Workflow Structure

### Section Overview

| Section | Name                | Prompts | Purpose                                             |
| ------- | ------------------- | ------- | --------------------------------------------------- |
| 1       | Initial Processing  | 7       | Configure, titles, summary, abridge, QA             |
| 2       | Chapters            | 3       | Identify, refine, create chapters with timestamps   |
| 3       | Design Briefs       | 4       | Editor instructions (deprecated - skipped)          |
| 4       | Content Analysis    | 3       | Extract essence, audience insights, competitor CTAs |
| 5       | Titles & Thumbnails | 5       | Generate titles, human curation, thumbnail text     |
| 6       | Description         | 4       | Simple description, full assembly, formatting       |
| 7       | Social              | 3       | Tweet, LinkedIn, video list                         |
| 8       | Shorts              | 4       | Context, title, description, tweet for shorts       |
| 9       | YouTube Defaults    | 3       | Playlists, tags, related videos                     |
| 10      | Segment Extract     | 4       | Extract intro, outro, CTAs, breakouts               |
| 11      | Segment Analysis    | 4       | Analyze extracted segments                          |

### Data Flow Diagram

```
Raw Transcript
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ Section 1: Initial Processing                               │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│ │Configure│→ │Summary  │→ │Abridge  │→ │Abridge  │         │
│ │         │  │         │  │(v1/v2)  │  │QA       │         │
│ └────┬────┘  └────┬────┘  └────┬────┘  └─────────┘         │
│      │            │            │                            │
│      ▼            ▼            ▼                            │
│ projectCode  transcriptSummary  transcriptAbridgement       │
│ shortTitle                                                  │
│ titleIdeas                                                  │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ Section 4: Content Analysis (Query Layer)                   │
│ ┌───────────┐  ┌───────────┐  ┌───────────┐                │
│ │Content    │  │Audience   │  │CTA        │                │
│ │Essence    │  │Engagement │  │Competitors│                │
│ └─────┬─────┘  └─────┬─────┘  └─────┬─────┘                │
│       │              │              │                       │
│       ▼              ▼              ▼                       │
│  mainTopic      keyTakeaways    searchTerms                │
│  keywords       audienceInsights competitorCTAs            │
└─────────────────────────────────────────────────────────────┘
      │
      ├──────────────────────┬────────────────────┐
      ▼                      ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Section 2   │      │ Section 5   │      │ Section 6   │
│ Chapters    │      │ Titles &    │      │ Description │
│             │      │ Thumbnails  │      │             │
│ identify    │      │ generate    │      │ simple desc │
│ refine      │      │ shortlist*  │      │ full desc   │
│ create      │      │ thumb text  │      │ format      │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │
       ▼                    ▼                    ▼
  createChapters      selectedTitles       videoFullDescription
                      thumbnailText

* = Human-in-the-loop curation step
```

### Prompt Files (53 total)

```
prompts/
├── 1-1-configure.hbs
├── 1-2-title-shortlist.hbs
├── 1-3-summarize-video.hbs
├── 1-4-abridge-v1.hbs
├── 1-4-abridge-v2.hbs
├── 1-5-abridge-qa-v1.hbs
├── 1-5-abridge-qa-v2.hbs
├── 1-6-seperate-intro-outro.hbs
├── 1-7-find-video-cta.hbs
├── 2-1-identify-chapters.hbs
├── 2-2-refine-chapters-v1.hbs
├── 2-2-refine-chapters-v2.hbs
├── 2-3-create-chapters.hbs
├── 3-*.hbs (4 files - deprecated)
├── 4-1-analyze-content-essence.hbs
├── 4-2-analyze-audience-engagement.hbs
├── 4-3-analyze-cta-competitors.hbs
├── 5-1-generate-title-v1.hbs
├── 5-1-generate-title-v2.hbs
├── 5-2-select-title-shortlist.hbs
├── 5-3-generate-thumbnail-text.hbs
├── 6-1-yt-simple-description.hbs
├── 6-1-yt-simple-description-v2.hbs
├── 6-2-yt-write-description.hbs
├── 6-2-yt-write-description-v2.hbs
├── 6-3-yt-format-description.DEPRECATED.hbs
├── 6-4-yt-description-custom-gpt.hbs
├── 7-*.hbs (3 files)
├── 8-*.hbs (4 files)
├── 9-*.hbs (3 files)
├── 10-1-extract-intro.hbs
├── 10-2-extract-outro.hbs
├── 10-3-extract-cta.hbs
├── 10-4-extract-breakout.hbs
├── 11-1-analyze-intro.hbs
├── 11-2-analyze-outro.hbs
├── 11-3-analyze-cta.hbs
├── 11-4-analyze-breakout.hbs
└── 99-1-outcome-notes.hbs
```

---

## What POEM Epic 4 Should Validate

Based on scouting this workflow, here's what the POEM system needs to handle:

### 1. Template Chaining

Output from Prompt A becomes input for Prompt B.

**Example chain:**

```
1-4-abridge.hbs → transcriptAbridgement
                        ↓
4-1-analyze-content-essence.hbs → mainTopic, keywords
                                        ↓
5-1-generate-title.hbs → titleCandidates
                              ↓
5-2-select-title-shortlist.hbs → selectedTitles (human curation)
                                        ↓
6-1-yt-simple-description.hbs → videoSimpleDescription
```

### 2. Schema Extraction from Templates

Each `.hbs` file has Handlebars placeholders that define required inputs.

**Example from 6-1-yt-simple-description-v2.hbs:**

```handlebars
{{selectedTitles.[0]}}
{{foldCta.label}}: {{foldCta.url}}
{{analyzeContentEssence.mainTopic}}
{{#each analyzeCtaCompetitors.searchTerms}}
{{#each analyzeContentEssence.keywords}}
{{transcriptAbridgement_v2}}
```

POEM should extract these as a schema and validate data availability.

### 3. Mock Data Generation

Each prompt should be testable independently without real transcripts.

**Use case:** Test 5-1-generate-title.hbs with mock `transcriptAbridgement` and `analyzeContentEssence` data to validate title generation quality.

### 4. Progressive Data Accumulation

workflow-data.json grows as prompts execute:

| After Section | Fields Added                                                                  |
| ------------- | ----------------------------------------------------------------------------- |
| 1             | projectCode, shortTitle, titleIdeas, transcriptSummary, transcriptAbridgement |
| 2             | identifyChapters, refineChapters, createChapters                              |
| 4             | analyzeContentEssence, analyzeAudienceEngagement, analyzeCtaCompetitors       |
| 5             | generate_title_v1/v2, selectedTitles, thumbnailText                           |
| 6             | videoSimpleDescription, videoDescriptionFirstLine, videoFullDescription       |
| 10-11         | videoIntroExtract, videoOutroExtract, videoCta/BreakoutExtract, \*Analysis    |

### 5. Handlebars Helpers Needed

Real formatting needs discovered:

| Helper            | Purpose                 | Example                           |
| ----------------- | ----------------------- | --------------------------------- |
| `gt`              | Greater than comparison | `{{#if (gt chapters.length 20)}}` |
| `formatTimestamp` | MM:SS format            | `{{formatTimestamp seconds}}`     |
| `truncate`        | Character limit         | `{{truncate title 49}}`           |
| `join`            | Array to string         | `{{join keywords ", "}}`          |

### 6. Human-in-the-Loop Patterns

Several prompts require human curation, not automation:

| Prompt                     | Pattern               | Why                                 |
| -------------------------- | --------------------- | ----------------------------------- |
| 5-2-select-title-shortlist | Flexible Selection    | Creative decision needs human taste |
| 1-2-title-shortlist        | Review & Approve      | Initial titles need validation      |
| 2-2-refine-chapters        | Correction/Refinement | AI gets ~44% timestamp accuracy     |

### 7. Platform-Specific Constraints

YouTube has specific rules that prompts encode:

| Constraint          | Value       | Prompt                      |
| ------------------- | ----------- | --------------------------- |
| Chapter title max   | 49 chars    | 2-2-refine-chapters         |
| Title optimal       | 40-50 chars | 5-1-generate-title          |
| Thumbnail text      | ≤20 chars   | 5-3-generate-thumbnail-text |
| Description visible | ~150 chars  | 6-1 (above fold)            |
| Description max     | 5000 chars  | 6-2                         |

---

## Patterns Discovered (Key Insights for Paige)

### Prompt Engineering Principles

1. **Predicate Prompt Principle**: Simple prompts don't mess up. One prompt per metric when possible.

2. **Data Loss Anti-Pattern**: Refinement should preserve upstream context, not drop it.

3. **Categorization Before Extraction**: "Extract keywords" is too generic. "Extract YouTube tags (long phrases)" is actionable.

4. **Query Layer Positioning**: Extraction prompts only need transcript - run them early so outputs feed downstream prompts.

5. **First Match ≠ Right Match**: When matching text to timestamps, context matters more than position.

6. **Reference Text Quality**: Verbatim quotes find timestamps; paraphrases fail.

7. **Anchor vs Authority**: Inputs can guide (anchors) or dictate (authorities). Clarify which.

8. **Platform-Specific Constraints**: "SEO-friendly" is vague. "49-char YouTube hover cutoff" is actionable.

9. **Research Before Design**: V2 prompts outperform V1 because they're research-informed.

### Prompt Types Identified

| Type           | Purpose                | Data Shape     |
| -------------- | ---------------------- | -------------- |
| Predicate      | Yes/no check           | Boolean        |
| Extraction     | Pull specific value    | String, number |
| List           | Extract multiple items | Array, CSV     |
| Categorization | Group by type          | Keyed object   |
| Observation    | Note patterns          | Prose          |
| Transformation | Convert format         | Varies         |

### Software Architecture Principles Applied

- **Single Responsibility**: One prompt, one job
- **DRY**: Don't duplicate extractions across prompts
- **Composition Over Inheritance**: Chain small prompts vs one massive prompt
- **Separation of Concerns**: Extract vs Evaluate vs Generate vs Transform
- **Loose Coupling**: Design for parallel execution where possible
- **Fail Fast**: Validate early in the chain

---

## Workflow Data Schema (37 Fields)

```json
{
  "projectCode": "b64",
  "shortTitle": "BMAD Claude SDK",
  "youtubeUrl": "...",
  "publishedPlaylists": [...],

  "transcriptAbridgement_v1": "...",
  "transcriptAbridgement_v2": "...",
  "transcriptAbridgementQA_v1": {...},
  "transcriptAbridgementQA_v2": {...},
  "transcriptSummary": "...",

  "titleIdeas": [...],
  "titleIdeasShortlist": [...],
  "generate_title_v1": [...],
  "generate_title_v2": [...],
  "selectedTitles": [...],

  "identifyChapters": [...],
  "refineChapters_v1": [...],
  "refineChapters_v2": [...],
  "chapterFolderNames": [...],
  "createChapters": "...",

  "analyzeContentEssence": {...},
  "analyzeAudienceEngagement": {...},
  "analyzeCtaCompetitors": {...},
  "video_topic_theme": "...",
  "content_highlights": [...],

  "youtubeTags": "...",
  "descriptionHashtags": "...",
  "relatedVideos": [...],

  "videoIntroExtract": {...},
  "videoOutroExtract": {...},
  "videoCtaExtract": {...},
  "videoBreakoutExtract": {...},
  "videoIntroAnalysis": {...},
  "videoOutroAnalysis": {...},
  "videoCtaAnalysis": {...},
  "videoBreakoutAnalysis": {...},

  "videoSimpleDescription": "...",
  "videoDescriptionFirstLine": "...",
  "videoFullDescription": "..."
}
```

---

## Files Reference

### In POEM Repository

```
/Users/davidcruwys/dev/ad/poem-os/poem/data/youtube-launch-optimizer/
├── prompts/           # 53 Handlebars templates
├── schemas/           # workflow-attributes.json
├── brand-config.json  # CTAs, affiliates, social links
└── README.md
```

### Scouting Analysis (b64 video)

```
/Users/davidcruwys/dev/video-projects/v-appydave/b64-bmad-claude-sdk/launch-optimizer/
├── workflow-data.json      # All 37 output fields
├── tips-for-paige.md       # 27 prompt engineering principles
├── scout-agent.md          # Scout agent definition
├── design-brief.md         # Visual style for diagrams
├── 1-1-configure.md        # Section 1 analysis
├── 1-1-configure.AD.md     # Video notes for Section 1
├── ...                     # (15 analysis files total)
├── 10-segment-extract.md   # Section 10 analysis
├── 11-segment-analysis.md  # Section 11 analysis
└── 10-11-qa-session.md     # Q&A validation session
```

---

## Epic 4 Story Suggestions

Based on this workflow, Epic 4 could include:

1. **Import YouTube Launch Optimizer prompts** - Load 53 templates into POEM
2. **Extract schemas from templates** - Parse Handlebars placeholders
3. **Generate mock workflow-data** - Create test data for each prompt
4. **Run prompt chain end-to-end** - Validate template chaining works
5. **Implement Handlebars helpers** - `gt`, `truncate`, `join`, `formatTimestamp`
6. **Human curation checkpoint** - Implement Flexible Selection pattern
7. **Platform constraint validation** - Character limits, format rules
8. **Parallel execution** - Run independent prompts simultaneously

---

## Conclusion

The YouTube Launch Optimizer is a comprehensive, real-world workflow that exercises every capability POEM needs:

- Schema extraction from templates
- Mock data generation
- Template chaining with progressive data accumulation
- Custom Handlebars helpers
- Human-in-the-loop patterns
- Platform-specific constraints
- Parallel vs sequential execution

Using this as Epic 4's validation target ensures POEM is tested against non-trivial, production-grade requirements before building the remaining agents (Epics 5-7).

---

**Related Documents:**

- `tips-for-paige.md` - Full prompt engineering knowledge base (27 principles)
- `scout-agent.md` - Scout agent definition with pattern checklist
- Individual section analysis files (`1-1-configure.md`, etc.)
