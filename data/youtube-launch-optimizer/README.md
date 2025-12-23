# YouTube Launch Optimizer

**Status**: Phase 1 Test Case - Battle-tested prompts ready for POEM validation
**Origin**: Agent Workflow Builder (AWB) - 15+ months of production use
**Purpose**: Validate POEM's Prompt Engineer Agent workflows with real, proven prompts

---

## Why This Scenario First?

YouTube Launch Optimizer is the ideal first test case for POEM because:

1. **Battle-tested**: 15+ months of actual use publishing YouTube videos
2. **No infrastructure needed**: Can test with just `.poem-core/` (Phase 1)
3. **Immediate value**: David can publish videos while building POEM
4. **Known-good prompts**: All prompts work - we're validating POEM, not the prompts
5. **Real workflow**: Sequential pipeline pattern matches POEM's design

---

## The Production Line Metaphor

YouTube Launch Optimizer follows the AWB "factory" pattern:

```
Factory (YouTube Launch Optimizer)
├── Production Line 1: Video Preparation
│   ├── Station: Configure
│   ├── Station: Script Summary
│   ├── Station: Script Abridgement
│   └── ...
├── Production Line 2: Build Chapters
│   ├── Station: Find Chapters
│   ├── Station: Refine Chapters
│   └── Station: Create Chapters
├── Production Line 3: B-Roll Suggestions
├── Production Line 4: Content Analysis
├── Production Line 5: Title & Thumbnail
├── Production Line 6: YouTube Meta Data
├── Production Line 7: Social Media Posts
└── Production Line 8: YouTube Shorts
```

Each **station** is a prompt with:

- Zero or more **inputs** (from attribute store)
- One **prompt** (Handlebars template)
- Zero or more **outputs** (back to attribute store)

Data accumulates as you flow through the production line.

---

## Sections (Production Lines)

### 1. Video Preparation

Initial processing of the raw transcript.

| Step                   | Prompt                              | Key Inputs                        | Key Outputs                                   |
| ---------------------- | ----------------------------------- | --------------------------------- | --------------------------------------------- |
| Configure              | 1-1-short-title.hbs                 | transcript                        | projectCode, shortTitle                       |
| Script Summary         | 1-1-summarize-video.hbs             | transcript                        | transcriptSummary                             |
| Script Abridgement     | 1-2-1-abridge-video.hbs             | transcript, transcriptSummary     | transcriptAbridgement                         |
| Abridge QA             | 1-3-abridge-video-descrepencies.hbs | transcript, transcriptAbridgement | descrepencies                                 |
| Intro/Outro Separation | 1-4-seperate-intro-outro.hbs        | transcript                        | transcriptIntro, transcriptOutro              |
| Find Video CTA         | 1-5-find-video-cta.hbs              | transcript                        | videoReferences, futureVideoCta, pastVideoCta |

### 2. Build Chapters

Create YouTube chapter timestamps from transcript.

| Step            | Prompt                    | Key Inputs                        | Key Outputs                |
| --------------- | ------------------------- | --------------------------------- | -------------------------- |
| Find Chapters   | 2-1-identify-chapters.hbs | transcript, transcriptAbridgement | identifyChapters           |
| Refine Chapters | 2-2-refine-chapters.hbs   | identifyChapters, transcript      | chapters                   |
| Create Chapters | 2-3-create-chapters.hbs   | chapters, srt                     | chapters (with timestamps) |

### 3. B-Roll Suggestions

Generate visual design ideas for the editor.

| Step                    | Prompt                           | Key Inputs                                               | Key Outputs           |
| ----------------------- | -------------------------------- | -------------------------------------------------------- | --------------------- |
| Design Style List       | 3-1-transcript-design-style.hbs  | transcript                                               | designStyle           |
| Intro/Outro B-Roll      | 3-2-intro-outro-design-ideas.hbs | transcriptIntro, transcriptOutro, designStyle            | introOutroDesignIdeas |
| Brief for Editor        | 3-3-editor-brief.hbs             | videoEditorInstructions, introOutroDesignIdeas, chapters | editorBrief           |
| Transcript Design Ideas | 3-4-transcript-design-ideas.hbs  | transcript, designStyle                                  | designIdeas           |

### 4. Content Analysis

Deep analysis for SEO and engagement optimization.

| Step                | Prompt                              | Key Inputs                           | Key Outputs                                             |
| ------------------- | ----------------------------------- | ------------------------------------ | ------------------------------------------------------- |
| Content Essence     | 4-1-analyze-content-essence.hbs     | transcriptAbridgement, videoKeywords | videoTopicTheme, importantStatistics, contentHighlights |
| Audience Engagement | 4-2-analyze-audience-engagement.hbs | transcriptAbridgement                | emotionalTriggerTone, audienceInsights, usp             |
| CTA/Competitors     | 4-3-analyze-cta-competitors.hbs     | transcriptAbridgement                | ctaPhrases, catchyPhrases, competitorSearchTerms        |

### 5. Title & Thumbnail

Generate title options and thumbnail concepts.

| Step             | Prompt                              | Key Inputs                                       | Key Outputs             |
| ---------------- | ----------------------------------- | ------------------------------------------------ | ----------------------- |
| Title Ideas      | 5-1-generate-title.hbs              | shortTitle, videoTopicTheme, contentHighlights   | titleIdeas              |
| Thumb Text Ideas | 5-2-generate-thumbnail-text.hbs     | videoTitle, contentHighlights, titleIdeas        | thumbnailText           |
| Thumb Text CSV   | 5-3-generate-thumbnail-text-csv.hbs | thumbnailText                                    | thumbnailTextCsv        |
| Visual Elements  | 5-4-thumbnail-visual-elements.hbs   | videoTitle, contentHighlights                    | thumbnailVisualElements |
| Create Thumbnail | 5-5-thumbnail.hbs                   | videoTitle, thumbnailText, transcriptAbridgement | thumbnailImage          |

### 6. YouTube Meta Data

Generate all YouTube description and metadata.

| Step                   | Prompt                            | Key Inputs                                                | Key Outputs                  |
| ---------------------- | --------------------------------- | --------------------------------------------------------- | ---------------------------- |
| Simple Description     | 6-1-yt-simple-description.hbs     | videoTitle, videoKeywords, transcriptAbridgement          | videoSimpleDescription       |
| Write Description      | 6-2-yt-write-description.hbs      | videoTitle, chapters, brandInfo, primaryCta, affiliateCta | videoDescription             |
| Format Description     | 6-3-yt-format-description.hbs     | videoDescription                                          | videoDescription (formatted) |
| Custom GPT Description | 6-4-yt-description-custom-gpt.hbs | videoTitle, chapters, transcriptAbridgement, brandInfo    | videoDescriptionCustomGpt    |

### 7. Social Media Posts

Generate promotional content for social platforms.

| Step                 | Prompt                       | Key Inputs                                              | Key Outputs     |
| -------------------- | ---------------------------- | ------------------------------------------------------- | --------------- |
| Create Tweet         | 7-1-create-tweet.hbs         | videoTitle, videoLink, videoKeywords, transcriptSummary | tweetContent    |
| Create LinkedIn Post | 7-3-create-linkedin-post.hbs | videoTitle, videoLink, transcriptAbridgement            | linkedinPost    |
| Add To Video List    | 7-4-add-to-video-list.hbs    | projectFolder, videoTitle, videoLink                    | videoReferences |

### 8. YouTube Shorts

Generate content for YouTube Shorts.

| Step                      | Prompt                            | Key Inputs                                       | Key Outputs       |
| ------------------------- | --------------------------------- | ------------------------------------------------ | ----------------- |
| Shorts Context            | 8-1-create-shorts-context.hbs     | -                                                | shortsContext     |
| Create Shorts Title       | 8-2-create-shorts-title.hbs       | shortTranscription                               | shortsTitle       |
| Create Shorts Description | 8-3-create-shorts-description.hbs | shortsTitle, shortTranscription, shortsVideoLink | shortsDescription |
| Create Shorts Tweet       | 8-4-create-shorts-tweet.hbs       | shortsTitle, shortTranscription, shortsVideoLink | shortsTweet       |

---

## Folder Structure

```
data/youtube-launch-optimizer/
├── README.md                           # This file
├── prompts/                            # Handlebars templates (33 files)
│   ├── 1-1-short-title.hbs
│   ├── 1-1-summarize-video.hbs
│   ├── 1-2-1-abridge-video.hbs
│   ├── ...
│   └── 99-1-outcome-notes.hbs
└── schemas/
    └── workflow-attributes.json        # All 60+ attributes
```

---

## How This Tests POEM

### Phase 1 (No Infrastructure)

- **Prompt Engineer Agent** creates/refines prompts
- LLM simulates Handlebars rendering (basic placeholders)
- David can still publish videos using manual copy-paste to ChatGPT

### Phase 2 (With .poem-app/)

- Skills call Astro API for real Handlebars rendering
- Preview shows actual rendered output
- Custom helpers could be added (e.g., `{{formatChapters chapters}}`)

### Phase 3+ (With Providers)

- Mock Data Agent generates realistic test data
- Integration Agent could publish to a "video project" system

---

## Source Reference

**Original DSL**: `/Users/davidcruwys/dev/ad/agent-workflow-builder/ad-agent_architecture/spec/usecases/youtube/youtube_launch_optimizer.rbx`

**Original Prompts**: `/Users/davidcruwys/dev/ad/agent-workflow-builder/ad-agent_architecture/prompts/youtube/launch_optimizer/`

**Transformation**: Placeholders converted from `[snake_case]` to `{{camelCase}}`

---

## Notes

- Some prompts are empty/inactive (6-5, 6-6, 7-2) - skipped during transformation
- Some prompts have variant versions (e.g., `*-OLD.txt`, `*-original.txt`) - only active versions included
- Not everything in the workflow is still accurate, but it's "good enough" for real video publishing
- This has been used for 15+ months across many video releases

---

**Last Updated**: 2025-11-23
