# Penny Analysis: 7-1-create-tweet

**Prompt File**: `7-1-create-tweet.hbs`
**Section**: 7 - Social Media Posts
**Status**: ✅ Active
**Created**: 2026-02-04

---

## Overview

Creates engaging tweets to promote YouTube videos on Twitter/X. Captures video essence in 280 characters, includes video link and 1-3 hashtags, optimized for click-through and engagement.

**Purpose**: Generate promotional tweets that drive YouTube views through Twitter/X platform.

---

## Input Schema

| Variable | Type | Source Prompt | Required | Description |
|----------|------|---------------|----------|-------------|
| `videoTitle` | String | 5-1 or 5-2 | Yes | The selected video title |
| `videoLink` | String (URL) | Config | Yes | YouTube video URL |
| `transcriptSummary` | String | 1-3 | Yes | High-level content summary |
| `contentHighlights` | Array[String] or String | 4-1 | Yes | Key points from content analysis |
| `videoKeywords` | String | Config/1-1 | Yes | SEO keywords for hashtag generation |

**Dependencies**:
- **Section 1**: Video Preparation (1-1, 1-3) provides keywords, transcript summary
- **Section 4**: Content Analysis (4-1) provides content highlights
- **Section 5**: Title Generation (5-1 or 5-2) provides video title
- **Configuration**: Video link

---

## Output Schema

**Format**: Plain Text (Tweet)

**Constraints**:
- Maximum 280 characters (including video link and hashtags)
- Video link placed near the end
- 1-3 hashtags (can appear within text or at end, some after link)
- Concise, compelling language
- Tone aligned with brand voice
- Creates urgency or curiosity

**Structure**:
```
[Engaging hook/key point] [Optional: second point] [Video link] [#Hashtag1 #Hashtag2]
```

---

## Workflow Position

**Section 7: Social Media Posts** - Prompt 1/3

```
Section 1 (Summary/Keywords) → Section 4 (Highlights) → Section 5 (Title) → [7-1] → Twitter/X
                                                           Config (Link) ────┘
```

**Execution Order**:
1. Content analysis provides highlights and keywords
2. **This prompt (7-1)** generates promotional tweet
3. User posts to Twitter/X (manual or via API)

---

## Architecture Patterns

### 1. Character Budget Optimization Pattern

**Pattern**: Strict 280-character limit requires careful word choice and structure.

**Implementation**: Prompt emphasizes "concise and compelling language" and reminds to include link + hashtags in character count.

**Challenge**: Video link alone is ~30+ chars, hashtags ~10-20 chars each. Leaves ~200 chars for actual content.

### 2. Strategic Link Placement Pattern

**Pattern**: Video link placed "near the end" (not at start) to maximize hook visibility.

**Why**: Users see hook first, then link. Starting with link buries the compelling message.

**Structure**: Hook → Key point → Link → Hashtags

### 3. Flexible Hashtag Positioning Pattern

**Pattern**: Hashtags can be "strategically within the text or at the end" and "some can go after" the link.

**Why**: Enables natural hashtag weaving (e.g., "Excited about #AI developments...") vs. appending (e.g., "... [link] #AI #MachineLearning").

**Range**: 1-3 hashtags (prevents hashtag spam while maintaining discoverability).

---

## Human Checkpoint

**Type**: 🔵 Light Approval (Quick Review)

**What to Check**:
1. **Character count**: Is tweet ≤280 chars (including link + hashtags)?
2. **Hook quality**: Does opening grab attention and create curiosity?
3. **Link placement**: Is video link near the end (not buried, not leading)?
4. **Hashtag count**: Are there 1-3 hashtags (not 0, not >3)?
5. **Tone alignment**: Does tweet match brand voice?

**Approval Criteria**:
- ✅ Fits in 280 characters
- ✅ Compelling hook creates urgency/curiosity
- ✅ Video link is present and well-placed
- ✅ 1-3 relevant hashtags included
- ✅ Brand voice maintained

---

## LATO Classification

**Level**: 🔵 Light Assistance (LATO-3)

**Automation Threshold**: 80%+ (structured format, objective constraints, clear guidelines)

**Why Light**:
- Character limit is objective (280 chars)
- Link placement is rule-based (near end)
- Hashtag count is objective (1-3)
- Hook quality is subjective but follows clear guidelines (urgency, curiosity)

**Recommended Workflow**:
1. AI generates tweet
2. Auto-validate character count + link presence + hashtag count
3. Human reviews hook quality + tone alignment
4. Approve or request regeneration

---

## Schema Requirements

**Priority**: 🟡 Medium (Social media promotion is important but not core workflow)

**Required Schemas**:
1. `videoTitle` (String)
2. `videoLink` (String, URL format)
3. `transcriptSummary` (String)
4. `contentHighlights` (Array or String)
5. `videoKeywords` (String)

**Output**: Tweet text (280 chars max)

---

## Tags

`#section-7-social-media` `#twitter` `#x-platform` `#tweet-generation` `#280-char-limit` `#hashtags` `#promotional-content` `#lato-3-light`

---

**Analyzed by**: Penny (AI Prompt Assistant)
**Analysis Date**: 2026-02-04
**Last Updated**: 2026-02-04
