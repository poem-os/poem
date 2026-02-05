# Penny Analysis: 9-3-select-related-videos

**Prompt File**: `9-3-select-related-videos.hbs`
**Section**: 9 - YouTube Defaults
**Status**: ✅ Active
**Created**: 2026-02-04

---

## Overview

Selects 2-3 related videos for YouTube cards and end screen. Uses selection criteria (topic continuity, concept depth, complementary skills, series connection) and provides placement recommendations (end_screen, card_early, card_middle, card_late) with timestamps for cards. JSON output with relationship explanations and overall strategy.

**Purpose**: Curate viewer journey by recommending next logical videos (end screen) and contextual videos (cards at specific timestamps).

---

## Input Schema

| Variable | Type | Source | Required | Description |
|----------|------|--------|----------|-------------|
| `title` | String | 5-1 or 5-2 | Yes | Current video title |
| `mainTopic` | String | 4-1 | Yes | Primary topic |
| `keywords` | String or Array | Config/1-1 | Yes | Video keywords |
| `videoCode` | String | Config | Yes | Video identifier (e.g., "b72") |
| `videos` | Array[Object] | 7-4 or Config | Yes | Available videos on channel |
| `videos[].code` | String | 7-4 or Config | Yes | Video code |
| `videos[].title` | String | 7-4 or Config | Yes | Video title |
| `videos[].synopsis` | String | 7-4 or Config | No | Video synopsis |
| `videos[].url` | String (URL) | 7-4 or Config | Yes | YouTube URL |

**Note**: `videos` array likely comes from 7-4 (add-to-video-list) cumulative list.

---

## Output Schema

**Format**: JSON

```json
{
  "relatedVideos": [
    {
      "code": "b63",
      "title": "Video Title",
      "url": "https://...",
      "relationship": "How this relates to current video",
      "placement": "end_screen | card_early | card_middle | card_late",
      "cardTimestamp": "MM:SS (if card, when to show)"
    }
  ],
  "reasoning": "Overall strategy for video connections"
}
```

**Typical Range**: 2-3 selected videos

---

## Architecture Patterns

### 1. Placement Strategy Pattern

**Pattern**: Output includes specific placement recommendations with timing.

**Placement Types**:
- **End Screen**: Most relevant "watch next" video (strongest recommendation)
- **Card (early)**: Prerequisite or background video (before complex topic)
- **Card (middle)**: Deeper dive on mentioned concept (when topic is discussed)
- **Card (late)**: Related advanced topic (after building foundation)

**Why**: Each placement serves different purpose in viewer journey.

### 2. Viewer Journey Pattern

**Pattern**: Prompt instructs LLM to "consider the viewer's journey: what would help them most?"

**Selection Criteria**:
1. **Topic Continuity**: Next logical video in learning path
2. **Concept Depth**: Goes deeper on mentioned concept
3. **Complementary Skills**: Related skill viewer would need
4. **Series Connection**: Part of same series or playlist

**Philosophy**: Optimize for learning path, not just topic similarity.

### 3. Timestamp-Based Card Pattern

**Pattern**: Card placements include timestamps (when to show card during video).

**Why**: Cards should appear contextually (e.g., show "deeper dive on X" card when X is mentioned).

**Format**: `cardTimestamp: "MM:SS"`

---

## Human Checkpoint

**Type**: 🟡 Medium Approval

**What to Check**:
- Are relationships accurate (does video X actually cover what's claimed)?
- Are placements logical (end screen = best "watch next", cards = contextual)?
- Are timestamps appropriate (card shows when topic is discussed)?
- Are any obvious related videos missing?

---

## LATO Classification

**Level**: 🟡 Medium Automation (LATO-2)

**Why**: Requires understanding of video content relationships and viewer psychology (subjective).

---

## Tags

`#section-9-youtube-defaults` `#related-videos` `#selection-prompt` `#placement-strategy` `#viewer-journey` `#json-output` `#lato-2-medium`

---

**Analyzed by**: Penny (AI Prompt Assistant)
**Last Updated**: 2026-02-04
