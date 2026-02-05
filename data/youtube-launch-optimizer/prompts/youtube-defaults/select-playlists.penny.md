# Penny Analysis: 9-1-select-playlists

**Prompt File**: `9-1-select-playlists.hbs`
**Section**: 9 - YouTube Defaults
**Status**: ✅ Active
**Created**: 2026-02-04

---

## Overview

Selects which YouTube playlists the video should be added to (1-4 playlists). Uses selection criteria (direct topic match, indirect relevance, audience overlap) to filter available playlists. JSON output includes selected playlists with match reasons and not-selected playlists with rejection reasons.

**Purpose**: Match video content to appropriate channel playlists for organization and discoverability.

---

## Input Schema

| Variable | Type | Source | Required | Description |
|----------|------|--------|----------|-------------|
| `title` | String | 5-1 or 5-2 | Yes | Video title |
| `mainTopic` | String | 4-1 | Yes | Primary topic/theme |
| `keywords` | String or Array | Config/1-1 | Yes | Video keywords |
| `hookType` | String | Unknown | No | Hook pattern used (e.g., "7 agents") |
| `playlists` | Array[Object] | Config | Yes | Available playlists on channel |
| `playlists[].name` | String | Config | Yes | Playlist name |
| `playlists[].id` | String | Config | Yes | Playlist ID |
| `playlists[].description` | String | Config | No | Playlist description |

---

## Output Schema

**Format**: JSON

```json
{
  "selectedPlaylists": [
    {
      "id": "playlist_id",
      "name": "Playlist Name",
      "matchReason": "Why this video fits"
    }
  ],
  "notSelected": [
    {
      "name": "Playlist Name",
      "reason": "Why this doesn't fit"
    }
  ]
}
```

**Typical Range**: 1-4 selected playlists

---

## Architecture Patterns

### 1. Selection/Filtering Pattern

**Pattern**: This is NOT a generative prompt - it's a **selection prompt** that filters from available options.

**Process**: LLM analyzes video context → Matches against available playlists → Selects best fits

**Contrast**: Generative prompts create new content. Selection prompts choose from existing options.

### 2. Explicit Rejection Reasoning Pattern

**Pattern**: Output includes both selected AND not-selected playlists with reasons.

**Why**: Transparency and debugging - shows LLM decision-making process.

**Benefit**: Human reviewer can validate rejections (e.g., "Why wasn't this added to X playlist?").

### 3. Multi-Select with Criteria Pattern

**Pattern**: Prompt explicitly allows multiple selections and defines clear criteria.

**Criteria**:
1. Direct topic match (explicit coverage)
2. Indirect relevance (demonstrates related concepts)
3. Audience overlap (viewers would benefit)

**Note**: "Select ALL that are a good fit" (encourages multi-select, not forced single choice).

---

## Human Checkpoint

**Type**: 🟡 Medium Approval

**What to Check**:
- Are selected playlists genuinely relevant?
- Were any obvious playlists missed (check notSelected)?
- Do match reasons make sense?

---

## LATO Classification

**Level**: 🟡 Medium Automation (LATO-2)

**Why**: Objective criteria (topic match) but subjective judgment (relevance, audience overlap).

---

## Tags

`#section-9-youtube-defaults` `#playlist-selection` `#filtering-prompt` `#json-output` `#multi-select` `#lato-2-medium`

---

**Analyzed by**: Penny (AI Prompt Assistant)
**Last Updated**: 2026-02-04
