# Option C Implementation Complete

**Date**: 2026-02-05
**Status**: ✅ Complete
**Pattern**: Co-located prompts + schemas + analysis files

---

## What Was Implemented

### Structure Change

**Before** (Option A - Separate Folders):
```
prompts/1-1-configure.hbs
prompts/1-1-configure.penny.md
schemas/configure.json
```

**After** (Option C - Co-Located):
```
prompts/video-preparation/
├── configure.hbs           ← Prompt template
├── configure.json          ← Schema (same folder!) ✨
└── configure.penny.md      ← Analysis (same folder!)
```

### Migration Results

**Files Migrated**:
- ✅ 35 prompt files (.hbs) → moved to section subfolders
- ✅ 10 schema files (.json) → co-located with prompts
- ✅ ~35 penny files (.penny.md) → co-located with prompts
- ✅ Archive folder preserved

**Sections Created**:
1. `video-preparation/` (7 prompts)
2. `build-chapters/` (3 prompts)
3. `content-analysis/` (3 prompts)
4. `title-thumbnail/` (5 prompts)
5. `youtube-metadata/` (3 prompts)
6. `social-media/` (3 prompts)
7. `youtube-defaults/` (3 prompts)
8. `intro-outro-extraction/` (4 prompts)
9. `intro-outro-analysis/` (4 prompts)
10. `meta/` (1 prompt)
11. `archive/` (deprecated)

**Total**: 81 files organized in 11 folders

---

## YAML Updates

### Schema References Added

Each step now explicitly declares both prompt AND schema paths:

```yaml
- id: configure
  name: Configure Project
  prompt: prompts/video-preparation/configure.hbs
  schema: prompts/video-preparation/configure.json  ← NEW!
  inputs: [projectFolder, transcript]
  outputs: [projectCode, shortTitle]
```

**Benefits**:
- ✅ Explicit schema declaration (not implicit)
- ✅ Same folder path (co-location visible in YAML)
- ✅ Easy to see which prompts have schemas

---

## One-to-One Correspondence Examples

### Example 1: Content Analysis

| YAML ID | Prompt Path | Schema Path | Analysis File |
|---------|-------------|-------------|---------------|
| `analyze-content-essence` | `prompts/content-analysis/analyze-content-essence.hbs` | `prompts/content-analysis/analyze-content-essence.json` | `prompts/content-analysis/analyze-content-essence.penny.md` |

**All files in**: `prompts/content-analysis/` ✨

### Example 2: Video Preparation

| YAML ID | Prompt Path | Schema Path | Analysis File |
|---------|-------------|-------------|---------------|
| `configure` | `prompts/video-preparation/configure.hbs` | `prompts/video-preparation/configure.json` | `prompts/video-preparation/configure.penny.md` |
| `abridge` | `prompts/video-preparation/abridge.hbs` | `prompts/video-preparation/abridge.json` | `prompts/video-preparation/abridge.penny.md` |

**All files in**: `prompts/video-preparation/` ✨

---

## Benefits Realized

### 1. Lower Cognitive Load ✅
**Before**: Jump between `prompts/` and `schemas/` folders
**After**: All related files in one place

### 2. Clearer Intent ✅
Seeing `configure.json` next to `configure.hbs` signals: "This prompt has a typed contract"

### 3. Easier Maintenance ✅
Update prompt + schema together in same folder

### 4. Better Git Diffs ✅
```
prompts/video-preparation/configure.hbs  (changes)
prompts/video-preparation/configure.json (changes)  ← Same commit!
```

### 5. Simpler Tooling ✅
Schema extraction tool writes to same folder as prompt

---

## POEM Standard Established

This pattern is now the **POEM standard** for organizing prompt projects.

### Recommendation for Central POEM (Track 3)

Create **ADR-012: Co-Location Pattern for Prompts and Schemas**:

```markdown
# ADR-012: Co-Location Pattern

## Decision
Adopt co-location of prompt templates, schemas, and analysis files.

## Structure
```
prompts/
├── {section}/
│   ├── {prompt}.hbs        ← Implementation
│   ├── {prompt}.json       ← Type signature
│   └── {prompt}.penny.md   ← Analysis
```

## Rationale
1. Schema = type signature (extends ADR-001)
2. Co-location best practice (React, TypeScript)
3. Cognitive clarity (all files in one place)
4. Easier maintenance (change together)
```

### Migration Path for Other Projects

**YouTube Launch Optimizer**: ✅ Complete (greenfield)
**SupportSignal**: Can adopt for new prompts (brownfield, optional)
**Future POEM projects**: Use Option C from start

---

## Next Steps

### Immediate
- [ ] Update `tools/extract-schemas.js` to write to co-located paths
- [ ] Test schema extraction with new structure
- [ ] Delete `prompts-old/` and `schemas-old/` backups (after validation)

### Documentation
- [ ] Create ADR-012 in central POEM docs
- [ ] Update POEM examples to use co-location
- [ ] Document in Epic 4/5 continuation guide

### SupportSignal (Optional Future)
- [ ] Propose co-location pattern for new prompts
- [ ] Create migration guide if they want to adopt
- [ ] Keep as optional (brownfield project)

---

## Migration Script Preserved

**Location**: `migrate-to-option-c.sh`

Kept for reference and potential use by other projects adopting this pattern.

---

## Verification Checklist

- ✅ All 35 prompts moved to section folders
- ✅ All 10 schemas co-located with prompts
- ✅ All penny files co-located with prompts
- ✅ YAML updated with new paths
- ✅ YAML includes explicit schema declarations
- ✅ Archive folder preserved
- ✅ Old structure backed up (prompts-old/, schemas-old/)
- ⏳ Tools updated (next step)
- ⏳ End-to-end testing (next step)

---

## Success Metrics

**Developer Experience**:
- Finding related files: 1 folder (was 2)
- Context switching: 0 (was 2+ times)
- Files per folder: 5-10 (was 43 + 28)

**Code Organization**:
- Sections: 11 clear categories
- Naming: Clean (no number prefixes)
- Structure: Scalable (ready for 100+ prompts)

**POEM Alignment**:
- Philosophy: ✅ Schema = type signature (ADR-001 extended)
- Best practices: ✅ Co-location (React, TypeScript patterns)
- Three-track convergence: ✅ YouTube → Central POEM → SupportSignal

---

**Status**: Implementation complete, ready for tooling updates and testing
**Feed Forward**: This becomes POEM standard (ADR-012)
