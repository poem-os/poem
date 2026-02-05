# Schema Extraction Discovery Notes

**Date**: 2026-02-05
**Tool**: extract-schemas.js
**Purpose**: Validate YAML-to-schema auto-derivation approach for Epic 4/5

---

## What We Built

A Node.js script that:
1. Parses `youtube-launch-optimizer.yaml`
2. Extracts `inputs` and `outputs` arrays from each step
3. Maps field names to type definitions (from `docs/schema-extraction.md`)
4. Generates unified JSON schema files (`{step-id}.json`)

---

## Test Results

### Execution Summary

```
Total Steps:           10
Schemas Generated:     10
Total Input Fields:    14
Total Output Fields:   12
Sections Tested:       3 (Video Preparation, Build Chapters, Content Analysis)
```

### Tested Prompts

**Section 1: Video Preparation**
- ✅ `configure` - Simple string inputs/outputs
- ✅ `summarize` - Single input → single output
- ✅ `abridge` - Dependency chain (uses transcriptSummary from previous step)
- ✅ `qa-abridge` - Array output (transcriptAbridgementDescrepencies)
- ✅ `separate-intro-outro` - Multi-output (intro + outro)

**Section 2: Build Chapters**
- ✅ `identify-chapters` - Single input/output with transformation
- ✅ `refine-chapters` - Depends on previous step output

**Section 4: Content Analysis** (CRITICAL TEST)
- ✅ `analyze-content-essence` - Complex nested object with arrays
- ✅ `analyze-audience-engagement` - Deeply nested objects with enums
- ✅ `analyze-cta-competitors` - Object with nullable arrays

---

## Key Learnings

### 1. YAML as Source of Truth Works

**Observation**: The YAML `inputs`/`outputs` arrays cleanly map to schema fields.

**Example**:
```yaml
- id: configure
  inputs: [projectFolder, transcript]
  outputs: [projectCode, shortTitle]
```

**Generated Schema**:
```json
{
  "input": {
    "fields": [
      { "name": "projectFolder", "type": "string", "required": true },
      { "name": "transcript", "type": "string", "required": true }
    ]
  },
  "output": {
    "fields": [
      { "name": "projectCode", "type": "string", "pattern": "^[a-z]\\d{2}$" },
      { "name": "shortTitle", "type": "string" }
    ]
  }
}
```

**Verdict**: ✅ Pattern validated. Epic 4.2 should build on this.

---

### 2. Type Inference is the Hard Part

**Challenge**: YAML only provides field names, not types.

**Current Solution**: Hardcoded `TYPE_MAPPINGS` dictionary (~15 core fields).

**Example**:
```javascript
const TYPE_MAPPINGS = {
  'transcript': { type: 'string', format: 'long-text' },
  'analyzeContentEssence': { type: 'object', properties: { ... } }
};
```

**Fallback**: Unknown fields default to `{ type: 'string', description: 'Auto-generated' }`

**What Epic 4.2 Needs**:
- Parse Handlebars templates to detect:
  - `{{variable}}` → string
  - `{{#each items}}` → array
  - Nested paths like `{{analyzeContentEssence.mainTopic}}`
- Infer types from prompt instructions (e.g., "Generate JSON with mainTopic, keywords, statistics")
- Build schema from actual prompt logic, not just YAML metadata

---

### 3. Complex Schemas Work Beautifully

**Test Case**: `analyze-audience-engagement` (most complex output)

**YAML Declaration**:
```yaml
outputs: [analyzeAudienceEngagement]
```

**Generated Schema** (90 lines, deeply nested):
```json
{
  "type": "object",
  "properties": {
    "emotionalTriggers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "trigger": { "type": "string" },
          "influence": { "type": "string" }
        }
      }
    },
    "tone": {
      "type": "object",
      "properties": {
        "style": { "type": "string", "enum": ["formal", "casual", "humorous"] },
        "examples": { "type": "array", "items": { "type": "string" } }
      }
    }
    // ... 3 more nested properties
  }
}
```

**Verdict**: ✅ JSON Schema can handle any complexity. Epic 4.2 should support nested objects, arrays, enums.

---

### 4. Dependency Chains are Implicit

**Observation**: Step dependencies are visible through input/output matching.

**Example**:
```yaml
# Step 1
- id: abridge
  outputs: [transcriptAbridgement]

# Step 2
- id: analyze-content-essence
  inputs: [transcriptAbridgement]  # ← Depends on step 1
```

**What Epic 5 Needs**:
- Build dependency graph from input/output matching
- Validate: "Can't run Step 2 before Step 1"
- Generate execution order (topological sort)

**Verdict**: ✅ Pattern works. Epic 5 should auto-detect dependencies.

---

### 5. Parallel Execution is Detectable

**Observation**: Section 4 steps all use same input, independent outputs.

**Example**:
```yaml
- id: analyze-content-essence
  inputs: [transcriptAbridgement]
  outputs: [analyzeContentEssence]

- id: analyze-audience-engagement
  inputs: [transcriptAbridgement]  # ← Same input
  outputs: [analyzeAudienceEngagement]  # ← Different output

- id: analyze-cta-competitors
  inputs: [transcriptAbridgement]  # ← Same input
  outputs: [analyzeCtaCompetitors]  # ← Different output
```

**What Epic 5 Needs**:
- Detect parallel-safe steps (no interdependencies)
- Allow concurrent LLM calls (3x speedup for Section 4)

**Verdict**: ✅ Pattern detectable. Epic 5 should optimize execution.

---

### 6. Schema Files are Self-Documenting

**Generated Schema Structure**:
```json
{
  "templateName": "analyze-content-essence",
  "title": "Analyze Content Essence",
  "description": "Extract theme, keywords, statistics, and takeaways",
  "section": "Content Analysis",
  "input": { ... },
  "output": { ... }
}
```

**Benefits**:
- Includes human-readable metadata (title, description, section)
- Can generate documentation automatically
- UI can display step details from schema

**Verdict**: ✅ Schema format is good for Epic 4/5.

---

## What Worked

1. ✅ **YAML parsing** - `yaml` npm package worked flawlessly
2. ✅ **ES modules** - Converted from CommonJS to ES modules (monorepo uses `"type": "module"`)
3. ✅ **Type mappings** - Hardcoded types worked for known fields
4. ✅ **Complex nested schemas** - JSON Schema handles deep nesting
5. ✅ **File generation** - All 10 schemas generated successfully
6. ✅ **Self-documenting** - Schemas include title/description/section metadata

---

## What Didn't Work

1. ❌ **Type inference for unknown fields** - Defaults to `string` (needs prompt parsing in Epic 4.2)
2. ❌ **Nested field resolution** - Only supports 1 level (e.g., `analyzeContentEssence.mainTopic`)
3. ⚠️ **Validation against prompts** - Script doesn't verify schemas match actual Handlebars templates
4. ⚠️ **Human-in-loop detection** - Can't detect steps like `1-2-title-shortlist` that require human input

---

## What We Learned for Epic 4/5

### Epic 4.2: Auto-Derivation Engine

**Requirement**: Parse Handlebars templates to infer types

**Approach**:
1. Read `.hbs` file from `prompt` field in YAML
2. Scan for Handlebars expressions:
   - `{{variable}}` → string
   - `{{#each items}}` → array
   - `{{#if condition}}` → boolean
   - Nested paths: `{{object.field}}` → infer object structure
3. Scan for JSON output patterns:
   - Look for code blocks with JSON schemas
   - Parse expected output structure
4. Merge YAML metadata + prompt analysis → generate complete schema

**Example Pattern** (from `4-1-analyze-content-essence.hbs`):
```handlebars
## Output Format

```
Main Topic or Theme:
[Insert identified theme here]

Relevant Keywords:
[Insert keywords here, separated by commas or new lines]
```

**Inference**:
- Output has `mainTopic` (string)
- Output has `keywords` (array of strings)

**Implementation Priority**:
- Phase 1: Simple variable extraction (`{{variable}}` → string)
- Phase 2: Array detection (`{{#each}}` → array)
- Phase 3: JSON output parsing (parse code blocks)
- Phase 4: Nested object inference

---

### Epic 5: Workflow Schema Generation

**Requirement**: Merge all step schemas into unified workflow schema

**Approach**:
1. Compute union of all step outputs → workflow attributes
2. Identify initial inputs (fields used but never produced)
3. Mark required fields (e.g., `transcript` is always required)
4. Build dependency graph (which steps produce/consume which fields)

**Example** (from current YAML):
```json
{
  "workflowAttributes": {
    "transcript": { "type": "string", "required": true, "source": "external" },
    "transcriptSummary": { "type": "string", "source": "summarize" },
    "transcriptAbridgement": { "type": "string", "source": "abridge" },
    "analyzeContentEssence": { "type": "object", "source": "analyze-content-essence" }
  },
  "dependencies": {
    "abridge": ["transcript", "transcriptSummary"],
    "analyze-content-essence": ["transcriptAbridgement"]
  }
}
```

---

## Recommendations for Epic 4/5 Stories

### Story Sizing Guidance

**Epic 4.2 Stories** (Auto-Derivation):
1. **Handlebars parser** - 5 pts (parse template, extract variables)
2. **Type inference** - 8 pts (detect arrays, objects, strings from context)
3. **JSON output parsing** - 5 pts (extract schema from output examples)
4. **Nested field resolution** - 3 pts (support `object.field` paths)
5. **Schema generation** - 5 pts (merge YAML + prompt analysis)

**Epic 5 Stories** (Workflow Schema):
1. **Attribute union** - 3 pts (compute all outputs across steps)
2. **Dependency graph** - 5 pts (track which steps produce/consume fields)
3. **Execution order validation** - 5 pts (topological sort)
4. **Parallel detection** - 3 pts (identify concurrent-safe steps)
5. **Schema merging** - 5 pts (generate unified workflow schema)

---

## Files Generated

```
schemas/
├── configure.json                      # Section 1: Project setup
├── summarize.json                      # Section 1: Summary
├── abridge.json                        # Section 1: Abridgement
├── qa-abridge.json                     # Section 1: QA
├── separate-intro-outro.json           # Section 1: Intro/outro extraction
├── identify-chapters.json              # Section 2: Chapter detection
├── refine-chapters.json                # Section 2: Chapter refinement
├── analyze-content-essence.json        # Section 4: Content analysis ⭐
├── analyze-audience-engagement.json    # Section 4: Audience analysis ⭐
└── analyze-cta-competitors.json        # Section 4: CTA analysis ⭐
```

**Notable**:
- ⭐ Section 4 files demonstrate complex nested schemas (Epic 4.2 critical path)
- All schemas are valid JSON with consistent structure
- Each schema includes metadata (title, description, section)

---

## Next Steps

1. ✅ **Tool validated** - Schema extraction pattern works
2. ⏭️ **Review with stakeholders** - Share discovery notes with team
3. ⏭️ **Epic 4/5 story creation** - Use learnings to draft stories
4. ⏭️ **Handlebars parser spike** - Prototype type inference from templates
5. ⏭️ **Schema validation** - Build tool to verify schemas match prompts

---

## Sample Schema Outputs

### Simple Schema: configure.json

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
        "required": true,
        "type": "string",
        "description": "Path to project folder"
      },
      {
        "name": "transcript",
        "required": true,
        "type": "string",
        "description": "Full video transcript text",
        "format": "long-text"
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

### Complex Schema: analyze-content-essence.json

See `/Users/davidcruwys/dev/ad/poem-os/poem/data/youtube-launch-optimizer/schemas/analyze-content-essence.json`

**Highlights**:
- Nested object with 4 properties
- Arrays of strings (keywords, statistics, takeaways)
- Rich descriptions for each field

---

## Conclusion

✅ **Schema extraction from YAML works**

✅ **Complex nested schemas are supported**

✅ **Dependency chains are detectable**

✅ **Pattern validates Epic 4/5 approach**

⏭️ **Next**: Build Handlebars parser for type inference (Epic 4.2)

---

**Tool Location**: `tools/extract-schemas.js`
**Test Coverage**: 10 prompts across 3 sections
**Success Rate**: 100% (all schemas generated successfully)
**Epic Impact**: Validates Epic 4.2 approach, informs Epic 5 design
