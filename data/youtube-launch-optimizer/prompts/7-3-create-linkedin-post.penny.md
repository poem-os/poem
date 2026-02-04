# Penny Analysis: 7-3-create-linkedin-post

**Prompt File**: `7-3-create-linkedin-post.hbs`
**Section**: 7 - Social Media Posts
**Status**: ✅ Active
**Created**: 2026-02-04

---

## Overview

Creates professional LinkedIn article posts to promote YouTube videos. Generates 1300-1700 character posts with attention-grabbing headlines, key point summaries, CTAs, and 3-5 hashtags optimized for LinkedIn engagement.

**Purpose**: Generate LinkedIn promotional content that drives YouTube views through professional network sharing.

---

## Input Schema

| Variable | Type | Source Prompt | Required | Description |
|----------|------|---------------|----------|-------------|
| `videoTitle` | String | 5-1 or 5-2 | Yes | The selected video title |
| `videoLink` | String (URL) | Config | Yes | YouTube video URL |
| `transcriptAbridgement` | String (Long) | 1-4 | Yes | Abridged transcript for content summary |

**Dependencies**:
- **Section 1**: Video Preparation (1-4) provides transcript abridgement
- **Section 5**: Title Generation (5-1 or 5-2) provides video title
- **Configuration**: Video link

**Note**: Prompt mentions "content highlights" in guideline #4, but no input variable provided. May reference `contentHighlights` from 4-1 or extract from `transcriptAbridgement`.

---

## Output Schema

**Format**: Plain Text (LinkedIn Article Post)

**Constraints**:
- 1300-1700 characters (optimal for LinkedIn articles)
- Professional tone (avoid casual language, jargon)
- 3-5 hashtags for visibility
- Emoji sparingly (only if adds value)
- Appropriate line breaks and spacing for readability
- No explanations or comments (just the post)

**Structure**:
1. Attention-grabbing headline (incorporates video title keywords)
2. Engaging introduction (hints at viewer value)
3. 2-3 key points from video abridgement (most compelling/useful)
4. Depth explanation (why points matter, how they benefit reader)
5. Call-to-action (watch full video on YouTube)
6. 3-5 relevant hashtags

---

## Workflow Position

**Section 7: Social Media Posts** - Prompt 2/3

```
Section 1 (Abridgement) → Section 5 (Title) → [7-3] → LinkedIn
             Config (Link) ───────────────────────┘
```

**Execution Order**:
1. Video preparation provides abridgement
2. Title generation provides selected title
3. **This prompt (7-3)** generates LinkedIn post
4. User posts to LinkedIn (manual or via API)

---

## Architecture Patterns

### 1. LinkedIn Article Format Pattern

**Pattern**: Optimized for LinkedIn's "article" format (1300-1700 chars) vs. short updates.

**Why**: LinkedIn articles get more engagement than short posts. Longer format allows storytelling and value demonstration.

**Sweet Spot**: 1300-1700 chars balances depth with attention span.

### 2. Professional Tone Enforcement Pattern

**Pattern**: Explicit instructions to "maintain professional tone" and "avoid overly casual language or jargon".

**Why**: LinkedIn audience expects professional content. Casual Twitter tone doesn't work.

**Contrast with 7-1 (Twitter)**: Twitter allows urgency/curiosity tactics. LinkedIn requires value-first, professional framing.

### 3. Value-First Structure Pattern

**Pattern**: Post structure prioritizes viewer value over promotional messaging.

**Structure Flow**:
1. Headline → Hooks with keywords
2. Intro → Hints at value
3. Key points → Demonstrates value (2-3 points)
4. Depth → Explains why points matter
5. CTA → Invites to watch (after value established)

**Why**: LinkedIn users are value-driven. Lead with insights, end with CTA.

### 4. Sparse Emoji Usage Pattern

**Pattern**: "Use emoji sparingly and only if they add value".

**Why**: LinkedIn is professional network. Emoji overuse reduces credibility.

**Contrast with 6-2 (YouTube Description)**: YouTube description uses emoji headers liberally (👉, 🎥, 🔗). LinkedIn is more conservative.

---

## Human Checkpoint

**Type**: 🟡 Medium Approval (Review + Light Editing)

**What to Check**:

1. **Character count**: Is post 1300-1700 chars?
2. **Headline quality**: Does it grab attention and incorporate video title keywords?
3. **Key points**: Are 2-3 most compelling points highlighted?
4. **Professional tone**: Is tone appropriate for LinkedIn (not too casual)?
5. **CTA**: Is there a clear call to watch the video?
6. **Hashtags**: Are there 3-5 relevant hashtags?
7. **Formatting**: Are line breaks and spacing used for readability?
8. **Emoji usage**: If emojis present, do they add value (not decorative)?

**Common Issues**:
- Post too short or too long (outside 1300-1700 char range)
- Tone too casual (Twitter-style) or too stiff (corporate)
- CTA missing or buried
- Too many/too few hashtags
- Emoji overuse

**Approval Criteria**:
- ✅ Character count in range (1300-1700)
- ✅ Professional tone maintained
- ✅ 2-3 key points clearly highlighted
- ✅ CTA present and compelling
- ✅ 3-5 relevant hashtags
- ✅ Well-formatted for readability

---

## LATO Classification

**Level**: 🟡 Medium Automation (LATO-2)

**Automation Threshold**: 60%+ (structured format, but professional tone requires judgment)

**Why Medium**:
- Character count is objective (1300-1700)
- Hashtag count is objective (3-5)
- Structure is defined (headline → intro → points → CTA)
- **BUT** professional tone is subjective (requires human judgment)
- **AND** "value to reader" assessment is subjective

**Automation Potential**:
- Character count validation: 100%
- Hashtag count validation: 100%
- Structure presence: 90% (can detect sections)
- Professional tone: 50% (tone analysis is improving but subjective)
- Value demonstration: 40% (requires domain expertise)

**Recommended Workflow**:
1. AI generates LinkedIn post
2. Auto-validate character count + hashtag count + structure
3. Human reviews tone + value demonstration + CTA effectiveness
4. Approve or request refinement

---

## Schema Requirements

**Priority**: 🟡 Medium (Social media promotion is important but not core workflow)

**Required Schemas**:
1. `videoTitle` (String)
2. `videoLink` (String, URL format)
3. `transcriptAbridgement` (String, Long)

**Optional** (mentioned in guidelines but no input variable):
- `contentHighlights` (Array or String) - may be extracted from abridgement or pulled from 4-1

**Output**: LinkedIn article post (1300-1700 chars)

---

## Tags

`#section-7-social-media` `#linkedin` `#article-post` `#professional-content` `#1300-1700-chars` `#hashtags` `#cta` `#lato-2-medium`

---

**Analyzed by**: Penny (AI Prompt Assistant)
**Analysis Date**: 2026-02-04
**Last Updated**: 2026-02-04
