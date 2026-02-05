# YouTube Launch Optimizer - Schema Extraction

**Extracted from**: 27 Penny Analysis Files
**Sections**: 1-2, 4-7, 9
**Date**: 2026-02-05

---

## Sequential Workflow Order

### Section 1: Video Preparation (7 prompts)
1. **1-1-configure** - Extract project metadata and generate title suggestions
2. **1-2-title-shortlist** - Review and select title options (Human-in-loop)
3. **1-3-summarize-video** - Create concise summary
4. **1-4-abridge** - Near-lossless compression (40-60%)
5. **1-5-abridge-qa** - Quality assurance for abridgement
6. **1-6-seperate-intro-outro** - Extract intro/outro sections
7. **1-7-find-video-cta** - Identify past/future video references

### Section 2: Build Chapters (3 prompts)
1. **2-1-identify-chapters** - Identify natural topic boundaries
2. **2-2-refine-chapters** - Refine titles with folder alignment (49 char limit)
3. **2-3-create-chapters** - Add timestamps from SRT file

### Section 4: Content Analysis (3 prompts - PARALLEL)
1. **4-1-analyze-content-essence** - Extract theme, keywords, statistics, takeaways
2. **4-2-analyze-audience-engagement** - Emotional triggers, tone, USPs
3. **4-3-analyze-cta-competitors** - CTAs, catchy phrases, search terms

### Section 5: Title & Thumbnail (5 prompts)
1. **5-1-generate-title** - Generate 10 titles with psychological framework
2. **5-2-select-title-shortlist** - Human curates 2-4 titles (Human-in-loop)
3. **5-3-generate-thumbnail-text** - Complementary thumb text (≤20 chars)
4. **5-4-thumbnail-visual-elements** - 3 visual concept sets
5. **5-5-thumbnail** - Leonardo AI prompt generation

### Section 6: YouTube Meta Data (3 prompts)
1. **6-1-yt-simple-description** - First line + simple description (JSON)
2. **6-2-yt-write-description** - Assemble full description (pure assembly)
3. **6-4-yt-description-custom-gpt** - Alternative: Custom GPT persona

### Section 7: Social Media Posts (3 prompts)
1. **7-1-create-tweet** - Twitter/X post (280 chars)
2. **7-3-create-linkedin-post** - LinkedIn article (1300-1700 chars)
3. **7-4-add-to-video-list** - Append to video references list

### Section 9: YouTube Defaults (3 prompts)
1. **9-1-select-playlists** - Select 1-4 playlists
2. **9-2-generate-tags** - YouTube tags + description hashtags
3. **9-3-select-related-videos** - Select 2-3 related videos with placement

---

## All Input Variables (Alphabetical)

| Variable | Type | Source | Used By (Prompts) | Reuse Count |
|----------|------|--------|-------------------|-------------|
| `affiliateCta` | String | Config | 6-4 | 1 |
| `analyzeAudienceEngagement.audienceInsights` | Array/Object | 4-2 | 5-1 | 1 |
| `analyzeContentEssence.keywords` | Array[String] | 4-1 | 6-1 | 1 |
| `analyzeContentEssence.mainTopic` | String | 4-1 | 5-1, 6-1 | 2 |
| `analyzeContentEssence.statistics` | Array[String] | 4-1 | 5-1 | 1 |
| `analyzeCtaCompetitors.catchyPhrases` | Array[String] | 4-3 | 5-1 | 1 |
| `analyzeCtaCompetitors.searchTerms` | Array[String] | 4-3 | 6-1, 9-2 | 2 |
| `brandConfig` | Object | Config | 6-2 | 1 |
| `brandConfig.affiliates` | Array[Object] | Config | 6-2 | 1 |
| `brandConfig.ctas.primaryCta` | Object | Config | 6-2 | 1 |
| `brandConfig.descriptionTemplate.legalDisclosure` | String | Config | 6-2 | 1 |
| `brandConfig.socialLinks` | Object | Config | 6-2 | 1 |
| `brandInfo` | String | Config | 6-4 | 1 |
| `chapterFolderNames` | Array[String] | **Human Input** | 2-2 | 1 |
| `chapters` | String (Multi-line) | 2-3 | 6-4, 9-1 | 2 |
| `contentHighlights` | Array[String] | 4-1 | 7-1 | 1 |
| `createChapters` | String (Multi-line) | 2-3 | 6-2 | 1 |
| `descriptionHashtags` | String | 9-2 | 6-2 | 1 |
| `foldCta` | Object | Config/1-1 | 6-1, 6-4 | 2 |
| `foldCta.label` | String | Config/1-1 | 6-1 | 1 |
| `foldCta.url` | String (URL) | Config/1-1 | 6-1 | 1 |
| `hookType` | String | Unknown | 9-1 | 1 |
| `identifyChapters` | String | 2-1 | 2-2 | 1 |
| `keywords` | Array[String] | 4-1, Config | 9-1, 9-2, 9-3 | 3 |
| `mainTopic` | String | 4-1 | 9-1, 9-2, 9-3 | 3 |
| `playlists` | Array[Object] | Config | 9-1 | 1 |
| `primaryCta` | String | Config | 6-4 | 1 |
| `projectFolder` | String | Config | 1-1, 7-4 | 2 |
| `relatedVideos` | Array[Object] | 9-3 | 6-2 | 1 |
| `searchTerms` | Array[String] | 4-3 | 9-2 | 1 |
| `selectedTitles` | Array[String] | 5-2 | 6-1 | 1 |
| `selectedTitles.[0]` | String | 5-2 | 6-1 | 1 |
| `srt` | String | External | 2-3 | 1 |
| `thumbnailText` | String | 5-3 | 5-5 | 1 |
| `title` | String | 5-1/5-2 | 9-1, 9-2, 9-3 | 3 |
| `titleHookType` | String | Unknown | 5-3 | 1 |
| `titleIdeas` | Array[String] | 1-1/5-1 | 1-2, 5-1 | 2 |
| `transcript` | String (Long) | External | 1-1, 1-3, 1-4, 1-6, 1-7, 2-1, 2-2, 2-3 | 8 |
| `transcriptAbridgement` | String (Long) | 1-4 | 4-1, 4-2, 4-3, 5-5, 6-4, 7-3 | 6 |
| `transcriptAbridgement_v2` | String (Long) | 1-4 | 6-1 | 1 |
| `transcriptSummary` | String | 1-3 | 7-1 | 1 |
| `videoCode` | String | Config | 9-3 | 1 |
| `videoDescriptionFirstLine` | String | 6-1 | 6-2 | 1 |
| `videoKeywords` | String | Config/1-1 | 6-4, 7-1 | 2 |
| `videoLink` | String (URL) | Config | 7-1, 7-3, 7-4 | 3 |
| `videoRelatedLinks` | String | 9-3 | 6-4 | 1 |
| `videoSimpleDescription` | String | 6-1 | 6-2 | 1 |
| `videoTitle` | String | 5-1/5-2 | 5-3, 5-5, 6-4 | 3 |
| `videoTopicTheme` | String | 1-1 | 5-3 | 1 |
| `videos` | Array[Object] | 7-4/Config | 9-3 | 1 |

---

## High-Reuse Variables (Used by 3+ Prompts)

### Core Content Variables
1. **`transcript`** (8 prompts): 1-1, 1-3, 1-4, 1-6, 1-7, 2-1, 2-2, 2-3
   - **Type**: String (Long)
   - **Source**: External (YouTube transcript)
   - **Purpose**: Primary content source for analysis and extraction

2. **`transcriptAbridgement`** (6 prompts): 4-1, 4-2, 4-3, 5-5, 6-4, 7-3
   - **Type**: String (Long, 40-60% of original)
   - **Source**: 1-4 (abridge)
   - **Purpose**: Compressed version for efficient analysis

### Metadata Variables
3. **`keywords`** (3 prompts): 9-1, 9-2, 9-3
   - **Type**: Array[String]
   - **Source**: 4-1 or Config
   - **Purpose**: SEO and discoverability

4. **`mainTopic`** (3 prompts): 9-1, 9-2, 9-3
   - **Type**: String
   - **Source**: 4-1
   - **Purpose**: Primary topic/theme for categorization

5. **`title`** (3 prompts): 9-1, 9-2, 9-3
   - **Type**: String
   - **Source**: 5-1 or 5-2
   - **Purpose**: Selected video title

6. **`videoLink`** (3 prompts): 7-1, 7-3, 7-4
   - **Type**: String (URL)
   - **Source**: Config
   - **Purpose**: YouTube video URL

7. **`videoTitle`** (3 prompts): 5-3, 5-5, 6-4
   - **Type**: String
   - **Source**: 5-1 or 5-2
   - **Purpose**: Selected video title (variant name)

---

## All Output Schemas by Prompt

### Section 1: Video Preparation

#### 1-1-configure
```json
{
  "projectCode": "string (pattern: ^[a-z]\\d{2})",
  "shortTitle": "string (3-7 words)",
  "titleSuggestions": ["string (3-7 words)"]
}
```

#### 1-2-title-shortlist
```json
{
  "selectedTitles": [
    {
      "index": "number",
      "title": "string",
      "seoScore": "number (1-10)",
      "engagementScore": "number (1-10)",
      "reasoning": "string"
    }
  ]
}
```

#### 1-3-summarize-video
```json
{
  "transcriptSummary": "string (100-1000 chars)"
}
```

#### 1-4-abridge
```json
{
  "transcriptAbridgement": "string (40-60% compression, preserves 100% meaningful content)"
}
```

#### 1-5-abridge-qa
```json
{
  "preservationScore": "number (0-100)",
  "criticalGaps": ["string"],
  "recommendations": ["string"]
}
```

#### 1-6-seperate-intro-outro
```json
{
  "introText": "string | null",
  "outroText": "string | null",
  "mainContentStart": "string | null"
}
```

#### 1-7-find-video-cta
```json
{
  "pastVideoReferences": [
    {
      "title": "string",
      "reference": "string (full sentence)"
    }
  ],
  "futureVideoReference": {
    "title": "string",
    "reference": "string"
  } | null
}
```

---

### Section 2: Build Chapters

#### 2-1-identify-chapters
```json
{
  "chapters": [
    {
      "number": "integer",
      "name": "string (5-50 chars)",
      "referenceQuote": "string"
    }
  ]
}
```

#### 2-2-refine-chapters
```json
{
  "chapters": [
    {
      "number": "string (pattern: ^\\d{2}$)",
      "title": "string (max 49 chars)",
      "referenceQuote": "string"
    }
  ]
}
```

#### 2-3-create-chapters
```json
{
  "chapters": [
    {
      "timestamp": "string (M:SS or H:MM:SS)",
      "title": "string (max 49 chars)"
    }
  ],
  "uncertainMatches": ["string"]
}
```

**YouTube-Ready Format** (Plain Text):
```
0:00 Introduction
1:35 Setup Environment
4:20 First Component
```

---

### Section 4: Content Analysis (PARALLEL EXECUTION)

#### 4-1-analyze-content-essence
```json
{
  "contentEssence": {
    "mainTopic": "string",
    "keywords": ["string"],
    "statistics": ["string"],
    "takeaways": ["string"]
  }
}
```

#### 4-2-analyze-audience-engagement
```json
{
  "audienceEngagement": {
    "emotionalTriggers": [
      {
        "trigger": "string",
        "influence": "string"
      }
    ],
    "tone": {
      "style": "string (formal|casual|humorous)",
      "examples": ["string"]
    },
    "audienceInsights": [
      {
        "group": "string (demographic)",
        "relevance": "string"
      }
    ],
    "usps": [
      {
        "point": "string",
        "explanation": "string"
      }
    ]
  }
}
```

#### 4-3-analyze-cta-competitors
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

---

### Section 5: Title & Thumbnail

#### 5-1-generate-title
**Output**: 10 titles with emotion labels and character counts
```
[CURIOSITY] How to Build AI Agents in 30 Minutes (39 chars)
[DESIRE] Master BMAD Method for Faster Development (43 chars)
[FEAR] Stop Wasting Time on Manual Workflows (40 chars)
...
```

#### 5-2-select-title-shortlist
```json
{
  "shortlist": [
    {
      "title": "string",
      "reasoning": "string"
    }
  ],
  "davidInput": {
    "keywordPriority": "string",
    "hookPreference": "string",
    "customTweaks": "string"
  }
}
```

#### 5-3-generate-thumbnail-text
**CSV Format**:
```csv
Title,Hook Type,Thumb Text,Part 1,Part 2,Chars,Complements
"Video Title","bmad+sdk","Full Text","Part 1","Part 2",18,"What gap it fills"
```

#### 5-4-thumbnail-visual-elements
```json
{
  "conceptSets": [
    {
      "description": "string",
      "mainElements": ["string"],
      "textInclusion": "string",
      "colorSchemeMood": "string",
      "contentConnection": "string",
      "prompts": {
        "primary": "string",
        "secondary": "string"
      }
    }
  ]
}
```

#### 5-5-thumbnail
**Output**: Leonardo AI Prompt (Plain Text)
```
16:9 YouTube thumbnail optimized for small screens...
[Leonardo AI prompt with title, text, visual elements]
```

---

### Section 6: YouTube Meta Data

#### 6-1-yt-simple-description
```json
{
  "firstLine": "string (40-50 words, ~150 chars)",
  "simpleDescription": "string (400-600 chars)"
}
```

#### 6-2-yt-write-description
**Output**: YouTube Description (Plain Text, YouTube-Native Formatting)
```
[First Line with SEO + Skool CTA]

[Simple Description]

👉 Primary CTA: [URL]

🎥 Related Videos
- [Video 1]
- [Video 2]

🔗 Tools & Affiliate Links
- [Tool 1]

🌐 Connect
- Website: [URL]
- Twitter: [URL]

⏱️ Chapters
0:00 Introduction
1:35 Setup

#Hashtags

[Legal Disclaimer]
```

#### 6-4-yt-description-custom-gpt
**Output**: Custom GPT Persona Prompt (Plain Text)
```
You are a YouTube description specialist...

<video_title>{{videoTitle}}</video_title>
<chapters>{{chapters}}</chapters>
...

Commands:
- CREATE: Generate YouTube description
- HASHTAGS: Suggest hashtags
- HELP: Show commands
```

---

### Section 7: Social Media Posts

#### 7-1-create-tweet
**Output**: Tweet (Plain Text, ≤280 chars)
```
[Hook] [Key point] [Video link] #Hashtag1 #Hashtag2
```

#### 7-3-create-linkedin-post
**Output**: LinkedIn Article Post (Plain Text, 1300-1700 chars)
```
[Headline]

[Introduction]

Key points:
- Point 1
- Point 2

[Depth explanation]

[CTA to watch video]

#Hashtag1 #Hashtag2 #Hashtag3
```

#### 7-4-add-to-video-list
**Output**: Video Reference Entry (Format Unknown)
```
Inferred: - <videoTitle>: <videoLink> (<projectFolder>)
```

---

### Section 9: YouTube Defaults

#### 9-1-select-playlists
```json
{
  "selectedPlaylists": [
    {
      "id": "string",
      "name": "string",
      "matchReason": "string"
    }
  ],
  "notSelected": [
    {
      "name": "string",
      "reason": "string"
    }
  ]
}
```

#### 9-2-generate-tags
```json
{
  "youtubeTags": {
    "tags": ["string (2-5 words)"],
    "tagString": "string (comma-separated)",
    "totalCharacters": "number (<500)",
    "count": "number (10-15)"
  },
  "descriptionHashtags": {
    "recommended": [
      {
        "position": "number (1-10)",
        "hashtag": "string",
        "reason": "string"
      }
    ],
    "count": 10
  }
}
```

#### 9-3-select-related-videos
```json
{
  "relatedVideos": [
    {
      "code": "string",
      "title": "string",
      "url": "string (URL)",
      "relationship": "string",
      "placement": "end_screen | card_early | card_middle | card_late",
      "cardTimestamp": "string (MM:SS, if card)"
    }
  ],
  "reasoning": "string (overall strategy)"
}
```

---

## Schema Reuse Patterns

### High-Reuse Output Schemas (Consumed by Multiple Prompts)

1. **`transcriptAbridgement`** (from 1-4)
   - **Consumed by**: 4-1, 4-2, 4-3, 5-5, 6-4, 7-3
   - **Pattern**: Section 4 parallel analysis foundation
   - **Reuse Count**: 6

2. **`transcript`** (external source)
   - **Consumed by**: 1-1, 1-3, 1-4, 1-6, 1-7, 2-1, 2-2, 2-3
   - **Pattern**: Section 1-2 content processing
   - **Reuse Count**: 8

3. **Section 4 Analysis Outputs** (from 4-1, 4-2, 4-3)
   - **`analyzeContentEssence.mainTopic`**: Used by 5-1, 6-1, 9-1, 9-2, 9-3
   - **`analyzeContentEssence.keywords`**: Used by 6-1, 9-2, 9-3
   - **`analyzeCtaCompetitors.searchTerms`**: Used by 6-1, 9-2
   - **Pattern**: Foundation for Sections 5, 6, 9
   - **Reuse Count**: 10+ (combined)

4. **`selectedTitles`** (from 5-2)
   - **Consumed by**: 6-1
   - **Pattern**: Human-curated title feeds description
   - **Reuse Count**: 1

5. **`createChapters`** (from 2-3)
   - **Consumed by**: 6-2, 6-4
   - **Pattern**: Chapters embedded in descriptions
   - **Reuse Count**: 2

---

## Human Checkpoints (Human-in-the-Loop)

### Critical Human Inputs
1. **2-2-refine-chapters**: `chapterFolderNames` (Array[String])
   - **Type**: External human input (not from previous prompts)
   - **Purpose**: Authoritative chapter structure
   - **Workflow**: Must pause for human to provide folder names

### Human Selection/Approval
1. **1-2-title-shortlist**: Select titles from AI-generated list
2. **5-2-select-title-shortlist**: Curate 2-4 titles with guided questions
3. **6-4-yt-description-custom-gpt**: Interactive ChatGPT persona usage

---

## Parallel Execution Opportunities

### Section 1: Video Preparation
- **1-3-summarize-video** + **1-4-abridge** (both use `transcript`)
  - Independent outputs: `transcriptSummary` vs `transcriptAbridgement`
  - **Speedup**: 2x

### Section 4: Content Analysis
- **4-1-analyze-content-essence** + **4-2-analyze-audience-engagement** + **4-3-analyze-cta-competitors**
  - All use same input: `transcriptAbridgement`
  - Independent outputs
  - **Speedup**: 3x

---

## Schema Priority for POEM Development

### Tier 1: Core Foundation (Must Have)
1. **`transcript`** (String, Long) - Primary content source
2. **`transcriptAbridgement`** (String, Long, 40-60% compression) - Analysis foundation
3. **`analyzeContentEssence`** (Object) - Metadata extraction (mainTopic, keywords, statistics, takeaways)
4. **`selectedTitles`** (Array[String]) - Human-curated titles
5. **`createChapters`** (String, Multi-line, YouTube format) - Chapter timestamps

### Tier 2: Essential Workflow (High Priority)
6. **`analyzeAudienceEngagement`** (Object) - Emotional triggers, tone, USPs
7. **`analyzeCtaCompetitors`** (Object) - CTAs, phrases, search terms
8. **`brandConfig`** (Object) - Brand CTAs, affiliates, social links
9. **`videoDescriptionFirstLine`** + **`videoSimpleDescription`** (Strings) - Description components
10. **`relatedVideos`** (Array[Object]) - Video cards/end screen

### Tier 3: Discoverability & Promotion (Medium Priority)
11. **`youtubeTags`** (Object) - Tag generation with metadata
12. **`descriptionHashtags`** (Object) - Hashtag suggestions
13. **`selectedPlaylists`** (Array[Object]) - Playlist assignments
14. **`transcriptSummary`** (String) - Quick summary for social media

### Tier 4: Social Media & Auxiliary (Lower Priority)
15. **Tweet** (String, ≤280 chars) - Twitter/X promotion
16. **LinkedIn Post** (String, 1300-1700 chars) - LinkedIn article
17. **Thumbnail Text** (CSV) - Complementary thumb text
18. **Leonardo AI Prompt** (String) - Image generation

---

## Notes on Missing/Unclear Schemas

1. **`hookType`** (used by 9-1, 5-3): Source undefined - likely from title analysis or config
2. **`titleHookType`** (used by 5-3): Source undefined - likely from 5-1 output
3. **`videoTopicTheme`** (used by 5-3): Source undefined - likely from 1-1 or 4-1
4. **`contentHighlights`** (mentioned in 7-3): Not provided as input variable - extracted from `transcriptAbridgement`?
5. **`videos`** (array for 9-3): Likely cumulative list from 7-4 outputs
6. **7-4-add-to-video-list**: Output format completely undefined (minimal prompt with only variables)

---

## Recommendations for POEM Schema Design

### 1. Namespace Organization
```
youtube-launch-optimizer/
  schemas/
    section-1-video-prep/
    section-2-chapters/
    section-4-analysis/
    section-5-title-thumbnail/
    section-6-description/
    section-7-social/
    section-9-defaults/
```

### 2. Schema Naming Convention
- Input schemas: `{section}-{step}-{name}.input.json`
- Output schemas: `{section}-{step}-{name}.output.json`
- Example: `4-1-analyze-content-essence.input.json`, `4-1-analyze-content-essence.output.json`

### 3. Shared Schema Components
Create reusable schema fragments:
- `transcript.schema.json` (used by 8 prompts)
- `transcript-abridgement.schema.json` (used by 6 prompts)
- `brand-config.schema.json` (complex nested object)
- `video-metadata.schema.json` (title, link, code, etc.)

### 4. Validation Priority
**Phase 1** (Epic 4 Foundation):
- Core content: `transcript`, `transcriptAbridgement`
- Section 4 outputs: `analyzeContentEssence`, `analyzeAudienceEngagement`, `analyzeCtaCompetitors`
- Human inputs: `chapterFolderNames`, `selectedTitles`

**Phase 2** (Epic 5 Integration):
- Brand config: `brandConfig` (CTAs, affiliates, social links)
- YouTube outputs: `createChapters`, `youtubeTags`, `selectedPlaylists`

**Phase 3** (Epic 6 Polish):
- Social media: Tweet, LinkedIn, thumbnail text
- Auxiliary: Related videos, video list append

---

**Extracted by**: Penny (AI Prompt Assistant)
**Date**: 2026-02-05
