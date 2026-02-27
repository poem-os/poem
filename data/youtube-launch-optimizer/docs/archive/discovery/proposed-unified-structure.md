# Proposed Unified Structure - YouTube Launch Optimizer

**Date**: 2026-02-05
**Purpose**: Align prompts, schemas, and YAML naming/organization
**Status**: Proposal - awaiting approval

---

## Current State (Misaligned)

### Prompts (Number Prefixes, Flat)
```
prompts/
├── 1-1-configure.hbs                    ← Section 1, step 1
├── 1-3-summarize-video.hbs              ← Section 1, step 3
├── 1-4-abridge-v2.hbs                   ← Section 1, step 4
├── 2-1-identify-chapters.hbs            ← Section 2, step 1
├── 4-1-analyze-content-essence.hbs      ← Section 4, step 1
└── ... (43 prompts flat with number prefixes)
```

### Schemas (Clean Names, Flat)
```
schemas/
├── configure.json                       ← Matches YAML id
├── summarize.json                       ← Matches YAML id
├── abridge.json                         ← Matches YAML id
├── identify-chapters.json               ← Matches YAML id
├── analyze-content-essence.json         ← Matches YAML id
└── ... (10 schemas, clean names)
```

### YAML (Clean IDs, Sections)
```yaml
sections:
  - name: Video Preparation
    steps:
      - id: configure                    ← Clean ID
        prompt: prompts/1-1-configure.hbs  ← ❌ Has number prefix
      - id: summarize
        prompt: prompts/1-3-summarize-video.hbs

  - name: Build Chapters
    steps:
      - id: identify-chapters
        prompt: prompts/2-1-identify-chapters.hbs

  - name: Content Analysis
    steps:
      - id: analyze-content-essence
        prompt: prompts/4-1-analyze-content-essence.hbs
```

**Misalignment**:
- ❌ Prompts have number prefixes (`1-1-`, `4-1-`)
- ❌ Schemas have clean names (`configure.json`)
- ❌ YAML IDs have clean names (`id: configure`)
- ❌ Prompt paths reference old numbered names
- ✅ Schemas match YAML IDs (this is good!)

---

## Proposed State (Aligned)

### Option A: Subfolder Structure (Recommended) ⭐

#### Prompts (Subfolders, No Prefixes)
```
prompts/
├── video-preparation/                   ← Section 1
│   ├── configure.hbs                    ← Matches YAML id
│   ├── summarize.hbs                    ← Matches YAML id
│   ├── abridge.hbs                      ← Matches YAML id
│   ├── qa-abridge.hbs
│   ├── separate-intro-outro.hbs
│   ├── find-video-cta.hbs
│   └── title-shortlist.hbs              ← (7 prompts)
│
├── build-chapters/                      ← Section 2
│   ├── identify-chapters.hbs
│   ├── refine-chapters.hbs
│   └── create-chapters.hbs              ← (3 prompts)
│
├── content-analysis/                    ← Section 4
│   ├── analyze-content-essence.hbs
│   ├── analyze-audience-engagement.hbs
│   └── analyze-cta-competitors.hbs      ← (3 prompts)
│
├── title-thumbnail/                     ← Section 5
│   ├── generate-title.hbs
│   ├── select-title-shortlist.hbs
│   ├── generate-thumbnail-text.hbs
│   ├── thumbnail-visual-elements.hbs
│   └── thumbnail.hbs                    ← (5 prompts)
│
├── youtube-metadata/                    ← Section 6
│   ├── yt-simple-description.hbs
│   ├── yt-write-description.hbs
│   └── yt-description-custom-gpt.hbs    ← (3 prompts)
│
├── social-media/                        ← Section 7
│   ├── create-tweet.hbs
│   ├── create-linkedin-post.hbs
│   └── add-to-video-list.hbs            ← (3 prompts)
│
├── youtube-defaults/                    ← Section 9
│   ├── select-playlists.hbs
│   ├── generate-tags.hbs
│   └── select-related-videos.hbs        ← (3 prompts)
│
├── intro-outro-extraction/              ← Section 10
│   ├── extract-intro.hbs
│   ├── extract-outro.hbs
│   ├── extract-cta-timestamp.hbs
│   └── validate-extractions.hbs         ← (4 prompts)
│
├── intro-outro-analysis/                ← Section 11
│   ├── analyze-intro.hbs
│   ├── analyze-outro.hbs
│   ├── analyze-cta.hbs
│   └── create-intro-outro-report.hbs    ← (4 prompts)
│
├── archive/                             ← Deprecated
│   ├── b-roll-suggestions/              ← Section 3 (deprecated)
│   └── deprecated-variants/             ← v1 versions
│
└── meta/                                ← Meta prompts
    └── outcome-notes.hbs                ← (99-1)
```

**Benefits**:
- ✅ Matches SupportSignal pattern (task-based subfolders)
- ✅ No number prefixes
- ✅ Scalable (ready for 100+ prompts)
- ✅ Clear semantic grouping
- ✅ Easier navigation

#### Schemas (Mirror Structure or Stay Flat?)

**Option A1: Mirror Subfolder Structure**
```
schemas/
├── video-preparation/
│   ├── configure.json
│   ├── summarize.json
│   ├── abridge.json
│   └── ...
├── build-chapters/
│   ├── identify-chapters.json
│   └── ...
├── content-analysis/
│   ├── analyze-content-essence.json
│   └── ...
└── workflow-attributes.json             ← Aggregate (stays at root)
```

**Option A2: Keep Flat (Recommended)** ⭐
```
schemas/
├── configure.json
├── summarize.json
├── abridge.json
├── identify-chapters.json
├── analyze-content-essence.json
├── ... (27 schemas flat)
└── workflow-attributes.json             ← Aggregate
```

**Recommendation**: Keep schemas flat (Option A2)
- Schemas are referenced by ID, not path
- Flatter is simpler for tooling
- SupportSignal uses flat schemas too
- Only 27 files (manageable)

#### YAML (Update Prompt Paths)
```yaml
sections:
  - name: Video Preparation
    steps:
      - id: configure
        prompt: prompts/video-preparation/configure.hbs  ← Clean path
      - id: summarize
        prompt: prompts/video-preparation/summarize.hbs

  - name: Build Chapters
    steps:
      - id: identify-chapters
        prompt: prompts/build-chapters/identify-chapters.hbs

  - name: Content Analysis
    steps:
      - id: analyze-content-essence
        prompt: prompts/content-analysis/analyze-content-essence.hbs
```

**Alignment**:
- ✅ YAML `id` matches prompt filename
- ✅ YAML `id` matches schema filename
- ✅ Prompt path includes section subfolder
- ✅ No number prefixes anywhere

---

### Option B: Flat Structure with Clean Names (Simpler Migration)

If subfolder structure is too disruptive, keep flat but remove prefixes:

#### Prompts (Flat, No Prefixes)
```
prompts/
├── configure.hbs                        ← Matches YAML id
├── summarize.hbs
├── abridge.hbs
├── identify-chapters.hbs
├── analyze-content-essence.hbs
└── ... (43 prompts flat, clean names)
```

**Benefits**:
- ✅ Simple migration (just rename files)
- ✅ Alignment achieved (matches schemas and YAML)
- ❌ Still flat (will be unwieldy at 100+ prompts)
- ❌ Loses semantic grouping

**Recommendation**: Only use Option B if subfolder structure is rejected.

---

## Companion Files (.penny.md)

### Current State
```
prompts/
├── 1-1-configure.hbs
├── 1-1-configure.penny.md               ← Paired analysis file
├── 4-1-analyze-content-essence.hbs
├── 4-1-analyze-content-essence.penny.md
```

### Proposed (Option A - Subfolders)
```
prompts/
├── video-preparation/
│   ├── configure.hbs
│   ├── configure.penny.md               ← Stays paired
│   ├── summarize.hbs
│   └── summarize.penny.md
├── content-analysis/
│   ├── analyze-content-essence.hbs
│   └── analyze-content-essence.penny.md
```

**Alignment**: Companion files follow prompt naming (no prefixes)

---

## Folder Naming Convention

### Section Name → Folder Name Mapping

| Section # | YAML Section Name | Proposed Folder Name | Rationale |
|-----------|------------------|----------------------|-----------|
| 1 | Video Preparation | `video-preparation` | Matches YAML, kebab-case |
| 2 | Build Chapters | `build-chapters` | Matches YAML |
| 4 | Content Analysis | `content-analysis` | Matches YAML |
| 5 | Title & Thumbnail | `title-thumbnail` | Shortened, clear |
| 6 | YouTube Meta Data | `youtube-metadata` | One word "metadata" |
| 7 | Social Media Posts | `social-media` | Shortened |
| 9 | YouTube Defaults | `youtube-defaults` | Matches YAML |
| 10 | Intro/Outro Extraction | `intro-outro-extraction` | Descriptive |
| 11 | Intro/Outro Analysis | `intro-outro-analysis` | Descriptive |
| 3 (archived) | B-roll Suggestions | `archive/b-roll-suggestions` | Moved to archive |
| 99 (meta) | Outcome Notes | `meta` | Meta prompts folder |

**Convention**: kebab-case, semantic, matches YAML section names (simplified if long)

---

## Migration Path

### Phase 1: Reorganize Prompts
1. Create subfolder structure
2. Move prompts (remove number prefixes)
3. Move companion `.penny.md` files
4. Update YAML prompt paths

### Phase 2: Verify Schemas
1. Schemas already have clean names (✅ no change needed)
2. Verify schema filenames match YAML IDs (✅ already aligned)

### Phase 3: Update References
1. Update `extract-schemas.js` tool (if prompt path logic exists)
2. Update documentation references
3. Test end-to-end workflow

### Phase 4: Archive Old Structure
1. Verify migration complete
2. Remove old numbered prompts (already archived via git)

---

## Alignment Matrix (Proposed)

| YAML Section | YAML ID | Prompt Path | Schema Path | Companion File |
|--------------|---------|-------------|-------------|----------------|
| Video Preparation | `configure` | `prompts/video-preparation/configure.hbs` | `schemas/configure.json` | `prompts/video-preparation/configure.penny.md` |
| Video Preparation | `summarize` | `prompts/video-preparation/summarize.hbs` | `schemas/summarize.json` | `prompts/video-preparation/summarize.penny.md` |
| Build Chapters | `identify-chapters` | `prompts/build-chapters/identify-chapters.hbs` | `schemas/identify-chapters.json` | `prompts/build-chapters/identify-chapters.penny.md` |
| Content Analysis | `analyze-content-essence` | `prompts/content-analysis/analyze-content-essence.hbs` | `schemas/analyze-content-essence.json` | `prompts/content-analysis/analyze-content-essence.penny.md` |

**Pattern**: `{section-folder}/{yaml-id}.{ext}`

---

## Enhanced YAML Format (Adopt SupportSignal Patterns)

### Current YAML (Minimal)
```yaml
steps:
  - id: configure
    prompt: prompts/video-preparation/configure.hbs
    inputs: [projectFolder, transcript]
    outputs: [projectCode, shortTitle]
```

### Proposed YAML (Explicit)
```yaml
steps:
  - id: configure
    name: Configure Project
    type: action                         # ← NEW: Step type (elicit|action|assembly)
    prompt: prompts/video-preparation/configure.hbs
    inputs: [projectFolder, transcript]
    outputs: [projectCode, shortTitle]
    validation:                          # ← NEW: Validation rules
      required: [projectCode, shortTitle]
    stores: [projectCode, shortTitle]    # ← NEW: State management
    schemaType: llm-output               # ← NEW: Schema type
```

### Human Checkpoint Example
```yaml
steps:
  - id: title-shortlist
    name: Select Title Shortlist
    type: elicit                         # ← Human-in-loop
    prompt: prompts/video-preparation/title-shortlist.hbs
    inputs: [titleSuggestions]
    outputs: [selectedTitles]
    validation:
      required: [selectedTitles]
      minItems: 2
      maxItems: 4
    schemaType: human-input              # ← Different validation
```

### Parallel Execution Example
```yaml
- name: Content Analysis
  description: Parallel analysis of content essence, audience engagement, and CTAs
  execution: parallel                    # ← NEW: Explicit parallel flag
  steps:
    - id: analyze-content-essence
      type: action
      prompt: prompts/content-analysis/analyze-content-essence.hbs
      inputs: [transcriptAbridgement]
      outputs: [analyzeContentEssence]
      validation:
        required: [analyzeContentEssence]

    - id: analyze-audience-engagement
      type: action
      prompt: prompts/content-analysis/analyze-audience-engagement.hbs
      inputs: [transcriptAbridgement]    # ← Same input (parallel eligible)
      outputs: [analyzeAudienceEngagement]
```

### Assembly Prompt Example
```yaml
steps:
  - id: yt-write-description
    name: Write YouTube Description
    type: assembly                       # ← Template-only (no LLM)
    skipLLM: true                        # ← Optimization flag
    prompt: prompts/youtube-metadata/yt-write-description.hbs
    inputs: [videoDescriptionFirstLine, videoSimpleDescription, chapters]
    outputs: [videoDescription]
```

---

## Recommendations

### Priority 1: Adopt Option A (Subfolder Structure) ⭐
- Scalable (SupportSignal pattern proven)
- Clean names (no prefixes)
- Semantic grouping (easier navigation)
- Aligns with YAML sections

### Priority 2: Keep Schemas Flat ⭐
- Simpler tooling
- Only 27 files (manageable)
- SupportSignal uses flat schemas too

### Priority 3: Enhance YAML with Explicit Sections
- Add `type:` declarations
- Add `validation:` rules
- Add `execution: parallel` flags
- Add `schemaType:` for schemas

### Priority 4: Update Companion Files
- Remove number prefixes
- Keep paired with prompts in subfolders

---

## Questions for Decision

1. **Confirm Option A (subfolder structure)** vs Option B (flat with clean names)?
2. **Confirm schemas stay flat** (not mirrored in subfolders)?
3. **Approve folder naming** (kebab-case, matches YAML section names)?
4. **Approve enhanced YAML format** (type, validation, stores, execution)?
5. **Migration timing** - do this now or after Section 6-11 review?

---

**Status**: Proposal ready for review ✅
**Next**: Await approval, then execute migration
**Feed Forward To**: Central POEM (this becomes the standard pattern)
