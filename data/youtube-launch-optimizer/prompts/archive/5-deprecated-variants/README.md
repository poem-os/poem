# Archived: Section 5 Deprecated Variants

**Archived**: 2026-02-04
**Reason**: Inferior versions or redundant functionality

---

## Deprecated Files

### 5-1-generate-title-v1.hbs
**Replaced by**: 5-1-generate-title.hbs (v2)

**Why deprecated**:
- Basic inputs only (no Section 4 integration)
- No emotion framework
- No character limit optimization
- v2 is significantly more sophisticated

### 5-2-generate-thumbnail-text.hbs
**Replaced by**: 5-3-generate-thumbnail-text.hbs

**Why deprecated**:
- Wrong numbering (collision with 5-2-select-title-shortlist)
- Inferior quality (no Section 4 integration)
- Basic table format (vs advanced CSV with complementarity logic)
- 5-3 version has title coordination rules and emotion triggers

### 5-3-generate-thumbnail-text-csv.hbs
**Replaced by**: 5-3-generate-thumbnail-text.hbs (already outputs CSV)

**Why deprecated**:
- Redundant formatter (just wraps existing thumbnailText in CSV)
- 5-3 main version already outputs CSV format
- Unnecessary extra step in workflow

---

## Active Section 5 Prompts

1. 5-1-generate-title.hbs (v2 - advanced)
2. 5-2-select-title-shortlist.hbs (human-in-the-loop)
3. 5-3-generate-thumbnail-text.hbs (advanced CSV generator)
4. 5-4-thumbnail-visual-elements.hbs
5. 5-5-thumbnail.hbs
