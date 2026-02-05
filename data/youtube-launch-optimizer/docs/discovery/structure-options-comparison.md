# Structure Options - Clear Comparison

**Date**: 2026-02-05
**Purpose**: Choose between subfolder vs flat organization

---

## Current State (Misaligned) ❌

```
prompts/
├── 1-1-configure.hbs                    ← Has prefix
├── 1-3-summarize-video.hbs              ← Has prefix
├── 4-1-analyze-content-essence.hbs      ← Has prefix
└── ... (43 prompts)

schemas/
├── configure.json                       ← No prefix (clean)
├── summarize.json                       ← No prefix (clean)
├── analyze-content-essence.json         ← No prefix (clean)
└── ... (10 schemas)

YAML:
  - id: configure                        ← Clean ID
    prompt: prompts/1-1-configure.hbs    ← ❌ References old prefix
```

**Problems**:
- Prompts have prefixes, schemas don't
- YAML IDs are clean, but prompt paths have prefixes
- No one-to-one correspondence

---

## Option A: Subfolder Organization (Recommended) ⭐

### Full Structure

```
prompts/
├── video-preparation/                   ← Section 1
│   ├── configure.hbs
│   ├── configure.penny.md
│   ├── summarize.hbs
│   ├── summarize.penny.md
│   ├── abridge.hbs
│   ├── abridge.penny.md
│   ├── qa-abridge.hbs
│   ├── qa-abridge.penny.md
│   ├── separate-intro-outro.hbs
│   ├── separate-intro-outro.penny.md
│   ├── find-video-cta.hbs
│   └── find-video-cta.penny.md          (7 prompts + 7 penny files)
│
├── build-chapters/                      ← Section 2
│   ├── identify-chapters.hbs
│   ├── identify-chapters.penny.md
│   ├── refine-chapters.hbs
│   ├── refine-chapters.penny.md
│   ├── create-chapters.hbs
│   └── create-chapters.penny.md         (3 prompts + 3 penny files)
│
├── content-analysis/                    ← Section 4
│   ├── analyze-content-essence.hbs
│   ├── analyze-content-essence.penny.md
│   ├── analyze-audience-engagement.hbs
│   ├── analyze-audience-engagement.penny.md
│   ├── analyze-cta-competitors.hbs
│   └── analyze-cta-competitors.penny.md (3 prompts + 3 penny files)
│
├── title-thumbnail/                     ← Section 5
│   ├── generate-title.hbs
│   ├── generate-title.penny.md
│   ├── select-title-shortlist.hbs
│   ├── select-title-shortlist.penny.md
│   ├── generate-thumbnail-text.hbs
│   ├── generate-thumbnail-text.penny.md
│   ├── thumbnail-visual-elements.hbs
│   ├── thumbnail-visual-elements.penny.md
│   ├── thumbnail.hbs
│   └── thumbnail.penny.md               (5 prompts + 5 penny files)
│
├── youtube-metadata/                    ← Section 6
│   ├── yt-simple-description.hbs
│   ├── yt-simple-description.penny.md
│   ├── yt-write-description.hbs
│   ├── yt-write-description.penny.md
│   ├── yt-description-custom-gpt.hbs
│   └── yt-description-custom-gpt.penny.md (3 prompts + 3 penny files)
│
├── social-media/                        ← Section 7
│   ├── create-tweet.hbs
│   ├── create-tweet.penny.md
│   ├── create-linkedin-post.hbs
│   ├── create-linkedin-post.penny.md
│   ├── add-to-video-list.hbs
│   └── add-to-video-list.penny.md       (3 prompts + 3 penny files)
│
├── youtube-defaults/                    ← Section 9
│   ├── select-playlists.hbs
│   ├── select-playlists.penny.md
│   ├── generate-tags.hbs
│   ├── generate-tags.penny.md
│   ├── select-related-videos.hbs
│   └── select-related-videos.penny.md   (3 prompts + 3 penny files)
│
├── intro-outro-extraction/              ← Section 10
│   ├── extract-intro.hbs
│   ├── extract-intro.penny.md
│   ├── extract-outro.hbs
│   ├── extract-outro.penny.md
│   ├── extract-cta-timestamp.hbs
│   ├── extract-cta-timestamp.penny.md
│   ├── validate-extractions.hbs
│   └── validate-extractions.penny.md    (4 prompts + 4 penny files)
│
├── intro-outro-analysis/                ← Section 11
│   ├── analyze-intro.hbs
│   ├── analyze-intro.penny.md
│   ├── analyze-outro.hbs
│   ├── analyze-outro.penny.md
│   ├── analyze-cta.hbs
│   ├── analyze-cta.penny.md
│   ├── create-intro-outro-report.hbs
│   └── create-intro-outro-report.penny.md (4 prompts + 4 penny files)
│
├── archive/                             ← Deprecated
│   ├── b-roll-suggestions/
│   └── deprecated-variants/
│
└── meta/
    ├── outcome-notes.hbs
    └── outcome-notes.penny.md

schemas/
├── video-preparation/                   ← Section 1 (mirrors prompts!)
│   ├── configure.json
│   ├── summarize.json
│   ├── abridge.json
│   ├── qa-abridge.json
│   ├── separate-intro-outro.json
│   └── find-video-cta.json              (6 schemas - not all prompts have schemas yet)
│
├── build-chapters/                      ← Section 2
│   ├── identify-chapters.json
│   ├── refine-chapters.json
│   └── create-chapters.json             (3 schemas)
│
├── content-analysis/                    ← Section 4
│   ├── analyze-content-essence.json
│   ├── analyze-audience-engagement.json
│   └── analyze-cta-competitors.json     (3 schemas)
│
├── title-thumbnail/                     ← Section 5
│   ├── generate-title.json
│   ├── select-title-shortlist.json
│   ├── generate-thumbnail-text.json
│   ├── thumbnail-visual-elements.json
│   └── thumbnail.json                   (5 schemas)
│
├── youtube-metadata/                    ← Section 6
│   ├── yt-simple-description.json
│   ├── yt-write-description.json
│   └── yt-description-custom-gpt.json   (3 schemas)
│
├── social-media/                        ← Section 7
│   ├── create-tweet.json
│   ├── create-linkedin-post.json
│   └── add-to-video-list.json           (3 schemas)
│
├── youtube-defaults/                    ← Section 9
│   ├── select-playlists.json
│   ├── generate-tags.json
│   └── select-related-videos.json       (3 schemas)
│
├── intro-outro-extraction/              ← Section 10
│   ├── extract-intro.json
│   ├── extract-outro.json
│   ├── extract-cta-timestamp.json
│   └── validate-extractions.json        (4 schemas)
│
├── intro-outro-analysis/                ← Section 11
│   ├── analyze-intro.json
│   ├── analyze-outro.json
│   ├── analyze-cta.json
│   └── create-intro-outro-report.json   (4 schemas)
│
└── workflow-attributes.json             ← Aggregate (stays at root)

YAML:
sections:
  - name: Video Preparation
    steps:
      - id: configure
        prompt: prompts/video-preparation/configure.hbs        ← Clean path
        schema: schemas/video-preparation/configure.json       ← Mirror path

  - name: Content Analysis
    steps:
      - id: analyze-content-essence
        prompt: prompts/content-analysis/analyze-content-essence.hbs
        schema: schemas/content-analysis/analyze-content-essence.json
```

### One-to-One Correspondence (Option A)

| YAML ID | Prompt Path | Schema Path | Penny File |
|---------|-------------|-------------|------------|
| `configure` | `prompts/video-preparation/configure.hbs` | `schemas/video-preparation/configure.json` | `prompts/video-preparation/configure.penny.md` |
| `analyze-content-essence` | `prompts/content-analysis/analyze-content-essence.hbs` | `schemas/content-analysis/analyze-content-essence.json` | `prompts/content-analysis/analyze-content-essence.penny.md` |
| `generate-title` | `prompts/title-thumbnail/generate-title.hbs` | `schemas/title-thumbnail/generate-title.json` | `prompts/title-thumbnail/generate-title.penny.md` |

**Pattern**: `{section-folder}/{yaml-id}.{ext}`

**Benefits**:
✅ One-to-one relationship maintained
✅ Schemas mirror prompt structure
✅ Easy to find related files (all in same folder)
✅ Scalable (ready for 100+ prompts)
✅ Clear semantic grouping
✅ Matches SupportSignal subfolder pattern

---

## Option B: Flat Organization (Simple Names)

### Full Structure

```
prompts/
├── configure.hbs                        ← No prefix, no subfolder
├── configure.penny.md
├── summarize.hbs
├── summarize.penny.md
├── abridge.hbs
├── abridge.penny.md
├── identify-chapters.hbs
├── identify-chapters.penny.md
├── analyze-content-essence.hbs
├── analyze-content-essence.penny.md
├── analyze-audience-engagement.hbs
├── analyze-audience-engagement.penny.md
├── generate-title.hbs
├── generate-title.penny.md
├── yt-simple-description.hbs
├── yt-simple-description.penny.md
├── create-tweet.hbs
├── create-tweet.penny.md
├── select-playlists.hbs
├── select-playlists.penny.md
├── ... (43 prompts + 43 penny files, all flat)
│
└── archive/                             ← Only archived files in subfolders
    ├── b-roll-suggestions/
    └── deprecated-variants/

schemas/
├── configure.json                       ← No subfolder
├── summarize.json
├── abridge.json
├── identify-chapters.json
├── analyze-content-essence.json
├── analyze-audience-engagement.json
├── generate-title.json
├── yt-simple-description.json
├── create-tweet.json
├── select-playlists.json
├── ... (27 schemas, all flat)
└── workflow-attributes.json             ← Aggregate

YAML:
sections:
  - name: Video Preparation
    steps:
      - id: configure
        prompt: prompts/configure.hbs                  ← Simple path
        schema: schemas/configure.json                 ← Simple path

  - name: Content Analysis
    steps:
      - id: analyze-content-essence
        prompt: prompts/analyze-content-essence.hbs
        schema: schemas/analyze-content-essence.json
```

### One-to-One Correspondence (Option B)

| YAML ID | Prompt Path | Schema Path | Penny File |
|---------|-------------|-------------|------------|
| `configure` | `prompts/configure.hbs` | `schemas/configure.json` | `prompts/configure.penny.md` |
| `analyze-content-essence` | `prompts/analyze-content-essence.hbs` | `schemas/analyze-content-essence.json` | `prompts/analyze-content-essence.penny.md` |
| `generate-title` | `prompts/generate-title.hbs` | `schemas/generate-title.json` | `prompts/generate-title.penny.md` |

**Pattern**: `{folder}/{yaml-id}.{ext}` (flat)

**Benefits**:
✅ One-to-one relationship maintained
✅ Simple paths (no subfolders)
✅ Easy migration (just rename files)
✅ All schemas match YAML IDs

**Drawbacks**:
❌ 43 prompts + 43 penny files = 86 files in one folder (unwieldy)
❌ No semantic grouping (harder to navigate)
❌ Not scalable (100+ prompts would be chaotic)
❌ Doesn't match SupportSignal pattern

---

## Side-by-Side Comparison

### File Count

| Location | Option A (Subfolder) | Option B (Flat) |
|----------|---------------------|-----------------|
| `prompts/` root | 11 subfolders | 86 files (43 prompts + 43 penny) |
| `prompts/{section}/` | 5-10 files per folder | N/A |
| `schemas/` root | 11 subfolders + 1 aggregate | 28 files (27 schemas + 1 aggregate) |
| `schemas/{section}/` | 3-7 files per folder | N/A |

### Navigation

**Option A**:
- Find configure prompt: `prompts/video-preparation/configure.hbs`
- Find its schema: `schemas/video-preparation/configure.json`
- Find its analysis: `prompts/video-preparation/configure.penny.md`
- **All related files in same conceptual group**

**Option B**:
- Find configure prompt: `prompts/configure.hbs` (scan 86 files)
- Find its schema: `schemas/configure.json` (scan 28 files)
- Find its analysis: `prompts/configure.penny.md` (scan 86 files)
- **Related files scattered across flat lists**

### Scalability

**Option A**:
- Add 50 more prompts → Create new subfolders or add to existing (5-10 files per folder)
- Still manageable

**Option B**:
- Add 50 more prompts → 93 prompts + 93 penny files = 186 files in one folder
- Unmanageable

### SupportSignal Alignment

**Option A**: ✅ Matches SupportSignal's `prompts/analyze-incident/` pattern

**Option B**: ❌ Different from SupportSignal (they use subfolders)

---

## Recommendation: Option A ⭐

### Reasons:
1. **One-to-one relationship maintained** (prompts/schemas/penny files mirror structure)
2. **Scalable** (ready for 100+ prompts)
3. **Semantic grouping** (easier navigation and understanding)
4. **Matches SupportSignal pattern** (proven in production)
5. **Future-proof** (clear organization as system grows)

### With Schema Subfolders (Your Feedback):
✅ Schemas mirror prompt subfolders
✅ `prompts/video-preparation/configure.hbs` ↔ `schemas/video-preparation/configure.json`
✅ Clear one-to-one correspondence
✅ Easy to find related files (same section folder)

---

## Migration Checklist (Option A)

### Phase 1: Create Structure
- [ ] Create 11 subfolder pairs in `prompts/` and `schemas/`
- [ ] Sections: video-preparation, build-chapters, content-analysis, title-thumbnail, youtube-metadata, social-media, youtube-defaults, intro-outro-extraction, intro-outro-analysis, archive, meta

### Phase 2: Move Prompts
- [ ] Remove number prefixes (1-1-configure.hbs → configure.hbs)
- [ ] Move to section subfolder (prompts/video-preparation/configure.hbs)
- [ ] Move companion .penny.md files with prompts

### Phase 3: Move/Generate Schemas
- [ ] Move existing schemas to section subfolders (configure.json → schemas/video-preparation/configure.json)
- [ ] Update extract-schemas.js tool to output to subfolders
- [ ] Regenerate all 27 schemas in subfolder structure

### Phase 4: Update YAML
- [ ] Update all prompt paths (prompts/video-preparation/configure.hbs)
- [ ] Add schema paths (schemas/video-preparation/configure.json)
- [ ] Verify all references correct

### Phase 5: Update Tools/Docs
- [ ] Update extract-schemas.js (output to subfolders)
- [ ] Update documentation references
- [ ] Test end-to-end workflow

---

**Status**: Option A recommended with schema subfolders ✅
**Next**: Confirm approval and execute migration
