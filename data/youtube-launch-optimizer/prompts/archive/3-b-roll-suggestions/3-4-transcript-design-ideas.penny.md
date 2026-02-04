# Penny Analysis: 3-4-transcript-design-ideas

**Prompt Type**: Structured Data Generation / CSV Export
**Phase**: Section 3 (Design & Editorial)
**Analyzed**: 2026-02-04

---

## Architectural Observations

### 1. Prompt Category
**Transcript-to-CSV Transformation** - Comprehensive b-roll production planning

- Inputs: `{{transcript}}`, `{{designStyle}}`
- Output: CSV file with visual concepts and Midjourney prompts
- Pattern: Segmentation → Prompt Generation → Structured Export

### 2. Output Format
**CSV (Machine-Readable)** - First structured data export

- 4 columns: File, Concept, Sentence, Prompt
- Multiple rows per concept (2-3 prompts each)
- Designed for downstream tool consumption (batch image generation)

**Different from previous prompts**: All prior outputs were text/markdown for human reading. This is structured data for automation.

### 3. Input Sources
**Style-Enhanced Full Transcript**:

```
Section 1, Step 1-3: transcript
Section 3, Step 3-1: designStyle (via human selection)
```

Same inputs as 3-2, but different output format (CSV vs. concepts list)

### 4. Granularity Pattern
**Sentence-Level Segmentation** - "one concept per sentence or every few sentences"

Unlike Section 2 (chapter-level), this operates at finest granularity seen so far:
- Section 2: Video → Chapters (macro)
- Section 3.4: Transcript → Sentences → Visual concepts (micro)

### 5. Variable Output Count
**Dynamic Based on Content**:

```
N sentences → M concepts → (M × 2-3) prompts
```

Output size depends on transcript length and concept density. Could range from dozens to hundreds of rows.

### 6. Batch Processing Intent
**CSV Suggests Automation** - File naming convention indicates batch workflow:

```
"01-futuristic-city-skyline-1-"
"01-futuristic-city-skyline-2-"
"02-advanced-ai-assistant-1-"
```

Sequential numbering + variant suffix → likely fed to batch image generator.

---

## Schema Implications

### Input Schema
```json
{
  "transcript": "string (full transcript)",
  "designStyle": "string (from 3-1 via human selection)"
}
```

### Output Schema (Suggested)
```json
{
  "brollCsv": "string (CSV content)",
  "concepts": [
    {
      "id": 1,
      "name": "string",
      "sentence": "string",
      "prompts": [
        {
          "file": "string (01-concept-1-)",
          "prompt": "string"
        }
      ] // 2-3 items
    }
  ]
}
```

**Validation Rules**:
- 2-3 prompts per concept
- File naming pattern: `\d{2}-[\w-]+-\d+-`
- CSV must be valid format

---

## Workflow Position

**Section 3, Step 4** - Comprehensive b-roll planning (final step in Section 3)

```
Section 1: transcript
Section 3.1: Generate styles → [HUMAN SELECTS] → designStyle
                                        ↓
                            3-4: Generate CSV (THIS STEP)
                                        ↓
                              [Export → Batch Processing]
```

**Section Endpoint**: This appears to be the final output of Section 3 (design/editorial phase complete).

---

## Patterns & Observations

### Pattern: Structured Data Export
- First CSV output (machine-readable)
- All prior outputs were human-readable text
- Indicates integration with external tools (Midjourney batch API?)

### Pattern: Fine-Grained Segmentation
- Sentence-level granularity (finest seen)
- Comprehensive coverage of full transcript
- Every visual moment captured

### Pattern: Multi-Alternative Per Unit
- 2-3 prompts per concept (like 3-2's dual prompts)
- Section 3 theme: Generate alternatives for selection/variety

### Pattern: File Naming Convention
- Sequential numbering system
- Descriptive slugs
- Variant suffixes
- Suggests automated file handling downstream

### Pattern: External Tool Integration
- Midjourney/Leonardo.AI mentioned explicitly
- CSV format for batch processing
- Different output format for different integration needs

---

## Questions for Design

1. **CSV Storage**: Is CSV stored in POEM, or generated on-demand for export?
2. **Batch Integration**: Does POEM trigger Midjourney batch jobs, or is this manual?
3. **Output Variants**: Should POEM support multiple output formats (text, CSV, JSON)?
4. **File Naming**: Should naming conventions be configurable or standardized?
5. **Variable Count**: Is there a max row limit for CSV (performance/UI concerns)?

---

## Section 3 Summary Patterns

Comparing all 4 prompts in Section 3:

| Prompt | Input Count | Output Format | Human Input? | Integration |
|--------|-------------|---------------|--------------|-------------|
| 3-1 | 1 (transcript) | 10 style ideas | No | Midjourney |
| 3-2 | 3 (style, intro, outro) | Concepts + prompts | Yes (style) | Midjourney |
| 3-3 | 5 (design, chapters, CTAs, instructions) | Editor brief | Yes (instructions) | Human (editor) |
| 3-4 | 2 (transcript, style) | CSV file | No (uses 3-1 style) | Midjourney batch |

**Section 3 Theme**: Visual design and editorial coordination
- Heavy Midjourney integration (3 of 4 prompts)
- Multiple human checkpoints (style selection, special instructions)
- Mix of formats: ideas, briefs, structured data
- Convergence point for Sections 1-2 outputs

---

## Integration Notes

**Epic 4 (Schema)**: CSV export schema, file naming validation
**Epic 5 (Templates)**: Structured data output patterns
**Epic 6 (Workflow)**: Batch processing triggers, export endpoints
**Epic 7 (Integration)**: External tool integration (Midjourney API), file export mechanisms

---

**Status**: Formatted ✅ | Analysis Complete ✅
