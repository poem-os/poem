# Schema Extraction Tool

**Purpose**: Auto-extract JSON schemas from YouTube Launch Optimizer YAML workflow

**Status**: TEMPORARY discovery tool (not Epic 4.2 implementation)

---

## Quick Start

```bash
# From this directory
node extract-schemas.js

# Or from monorepo root
node data/youtube-launch-optimizer/tools/extract-schemas.js
```

---

## What It Does

1. Reads `youtube-launch-optimizer.yaml`
2. Parses all sections and steps
3. For each step:
   - Extracts `inputs` array → Input schema fields
   - Extracts `outputs` array → Output schema fields
   - Looks up type definitions from reference doc
4. Generates `{step-id}.json` files in `schemas/` directory

---

## Output Format

Each schema file follows this structure:

```json
{
  "templateName": "configure",
  "title": "Configure Project",
  "description": "Set up project metadata and initial titles",
  "section": "Video Preparation",
  "input": {
    "fields": [
      {
        "name": "projectFolder",
        "type": "string",
        "description": "Path to project folder",
        "required": true
      },
      {
        "name": "transcript",
        "type": "string",
        "description": "Full video transcript text",
        "format": "long-text",
        "required": true
      }
    ]
  },
  "output": {
    "fields": [
      {
        "name": "projectCode",
        "type": "string",
        "description": "Unique project identifier (e.g., b69)",
        "pattern": "^[a-z]\\d{2}$"
      },
      {
        "name": "shortTitle",
        "type": "string",
        "description": "Brief working title (3-7 words)"
      }
    ]
  }
}
```

---

## Type Mappings

The script uses `TYPE_MAPPINGS` to resolve field types from the reference documentation (`docs/schema-extraction.md`). Key mappings:

**Core Content**:
- `transcript` → String (long-text format)
- `transcriptAbridgement` → String (long-text, 40-60% compression)
- `transcriptSummary` → String (100-1000 chars)

**Analysis Outputs** (Section 4):
- `analyzeContentEssence` → Object (mainTopic, keywords, statistics, takeaways)
- `analyzeAudienceEngagement` → Object (emotionalTriggers, tone, audienceInsights, usps)
- `analyzeCtaCompetitors` → Object (callToActions, catchyPhrases, questions, searchTerms)

**Fallback**:
- Unknown fields → `{ type: "string", description: "Auto-generated" }`

---

## Testing

The script automatically processes all steps in the workflow. To verify specific prompts:

```bash
# Check generated schemas
ls -la ../schemas/

# Inspect specific schemas
cat ../schemas/configure.json
cat ../schemas/abridge.json
cat ../schemas/analyze-content-essence.json
```

---

## Dependencies

- Node.js (v20+)
- `yaml` package (install: `npm install yaml`)

---

## Output Statistics

After running, you'll see:

```
📊 Extraction Summary
============================================================
Total Steps:           8
Schemas Generated:     8
Total Input Fields:    15
Total Output Fields:   8
Output Directory:      /path/to/schemas
============================================================
```

---

## Limitations (Known Issues)

1. **Type inference is limited** - Only maps ~15 core fields, uses string default for rest
2. **Nested field paths** - Supports one level (e.g., `analyzeContentEssence.mainTopic`)
3. **No validation** - Doesn't verify schemas against actual prompt files
4. **Hardcoded mappings** - Would need Epic 4.2 to auto-detect types from prompt content

---

## Future Work (Epic 4.2)

This tool demonstrates the **pattern** for Epic 4/5 implementation:

**Epic 4.2**: Auto-Derivation Engine
- Parse Handlebars templates to detect variable usage
- Infer types from context (e.g., `{{#each chapters}}` → array)
- Generate schemas from actual prompt logic, not just YAML metadata

**Epic 5**: Workflow Schema
- Merge all step schemas into unified workflow schema
- Track field lineage (which step produces what)
- Validate dependency chains

---

## See Also

- `docs/schema-extraction.md` - Field type reference
- `docs/schema-priority-list.md` - Build order guide
- `youtube-launch-optimizer.yaml` - Source YAML workflow
- `/Users/davidcruwys/.claude/projects/-Users-davidcruwys-dev-ad-poem-os-poem/memory/MEMORY.md` - Schema implementation pattern

---

**Created**: 2026-02-05
**Author**: Auto-extraction discovery tool
**Status**: Temporary (informs Epic 4/5 stories)
