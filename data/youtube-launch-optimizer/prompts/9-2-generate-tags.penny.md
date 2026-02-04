# Penny Analysis: 9-2-generate-tags

**Prompt File**: `9-2-generate-tags.hbs`
**Section**: 9 - YouTube Defaults
**Status**: ✅ Active
**Created**: 2026-02-04

---

## Overview

Generates TWO types of tags for YouTube: (1) YouTube Tags for the tag field (10-15 tags, <500 chars total), (2) Description Hashtags for selection (10 hashtags in priority order, user selects 5). JSON output with structured tag data and metadata.

**Purpose**: Optimize video discoverability through YouTube's tag system and description hashtags.

---

## Input Schema

| Variable | Type | Source | Required | Description |
|----------|------|--------|----------|-------------|
| `title` | String | 5-1 or 5-2 | Yes | Video title |
| `mainTopic` | String | 4-1 | Yes | Primary topic/theme |
| `keywords` | Array[String] | 4-1 | Yes | Core keywords |
| `searchTerms` | Array[String] | 4-3 | Yes | Search phrases people use |

---

## Output Schema

**Format**: JSON

```json
{
  "youtubeTags": {
    "tags": ["multi-word tag one", "tag two"],
    "tagString": "multi-word tag one, tag two",
    "totalCharacters": 123,
    "count": 12
  },
  "descriptionHashtags": {
    "recommended": [
      {
        "position": 1,
        "hashtag": "#example",
        "reason": "Why this should be first"
      }
    ],
    "count": 10
  }
}
```

**Constraints**:
- YouTube Tags: 2-5 words per tag, 10-15 tags, <500 chars total
- Description Hashtags: 10 generated, user selects 5, ordered by priority

---

## Architecture Patterns

### 1. Dual Output Pattern

**Pattern**: Single prompt generates TWO distinct tag types with different constraints.

**Type 1 (YouTube Tags)**:
- For YouTube's tag field
- Multi-word phrases (2-5 words perform better)
- Comma-separated string
- 500 char total limit

**Type 2 (Description Hashtags)**:
- For YouTube description
- Single-word or short phrases with # prefix
- Ordered by priority (first 3 appear "above the fold")
- Mix: niche (#bmadmethod) + broad (#aicoding) + trending

**Why Dual**: Different tag systems serve different purposes (backend search vs. description display).

### 2. Priority Ordering Pattern

**Pattern**: Hashtags are ordered by priority with explicit reasoning.

**Why Order Matters**: First 3 hashtags appear "above the fold" in YouTube description (prime real estate).

**Structure**: Each hashtag has `position` and `reason` fields explaining priority.

### 3. Metadata Enrichment Pattern

**Pattern**: Output includes metadata (`totalCharacters`, `count`) for validation.

**Why**: Enables auto-validation (e.g., check if tags exceed 500 char limit before posting).

---

## Human Checkpoint

**Type**: 🔵 Light Approval + Selection

**What to Check**:
- Are YouTube tags within 500 char limit?
- Do hashtags match brand voice?
- **Select 5** description hashtags from the 10 recommended (POEM UI could handle this)

---

## LATO Classification

**Level**: 🔵 Light Assistance (LATO-3)

**Why**: Tag generation follows objective rules (character limits, multi-word phrases). Hashtag selection is manual but straightforward.

---

## Tags

`#section-9-youtube-defaults` `#tag-generation` `#hashtags` `#dual-output` `#json-output` `#priority-ordering` `#lato-3-light`

---

**Analyzed by**: Penny (AI Prompt Assistant)
**Last Updated**: 2026-02-04
