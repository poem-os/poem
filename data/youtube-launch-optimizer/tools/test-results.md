# Schema Extraction Test Results

**Date**: 2026-02-05
**Sections Tested**: 3 (Video Preparation, Build Chapters, Content Analysis)
**Total Schemas**: 10

---

## Test Matrix

| Step ID | Section | Inputs | Outputs | Complexity | Status |
|---------|---------|--------|---------|------------|--------|
| configure | Video Preparation | 2 | 2 | Simple | ✅ |
| summarize | Video Preparation | 1 | 1 | Simple | ✅ |
| abridge | Video Preparation | 2 | 1 | Dependency | ✅ |
| qa-abridge | Video Preparation | 2 | 1 | Array output | ✅ |
| separate-intro-outro | Video Preparation | 1 | 2 | Multi-output | ✅ |
| identify-chapters | Build Chapters | 1 | 1 | Simple | ✅ |
| refine-chapters | Build Chapters | 2 | 1 | Dependency | ✅ |
| analyze-content-essence | Content Analysis | 1 | 1 | **Complex object** | ✅ |
| analyze-audience-engagement | Content Analysis | 1 | 1 | **Deeply nested** | ✅ |
| analyze-cta-competitors | Content Analysis | 1 | 1 | **Nullable arrays** | ✅ |

---

## Complexity Levels

**Simple**: String inputs → String outputs
**Dependency**: Uses output from previous step
**Array output**: Outputs array type
**Multi-output**: Multiple output fields
**Complex object**: Nested object with arrays
**Deeply nested**: 3+ levels of nesting
**Nullable arrays**: Optional array fields

---

## Critical Test Cases

### 1. Dependency Chain (abridge)

**YAML**:
```yaml
- id: abridge
  inputs: [transcript, transcriptSummary]  # ← Uses output from 'summarize'
  outputs: [transcriptAbridgement]
```

**Result**: ✅ Schema correctly shows dependency on transcriptSummary

---

### 2. Complex Nested Object (analyze-content-essence)

**YAML**:
```yaml
- id: analyze-content-essence
  inputs: [transcriptAbridgement]
  outputs: [analyzeContentEssence]
```

**Result**: ✅ Generated 53-line schema with:
- Object type with 4 properties
- Arrays of strings (keywords, statistics, takeaways)
- Rich descriptions

**Schema Preview**:
```json
{
  "name": "analyzeContentEssence",
  "type": "object",
  "properties": {
    "mainTopic": { "type": "string" },
    "keywords": { "type": "array", "items": { "type": "string" } },
    "statistics": { "type": "array", "items": { "type": "string" } },
    "takeaways": { "type": "array", "items": { "type": "string" } }
  }
}
```

---

### 3. Deeply Nested Object (analyze-audience-engagement)

**YAML**:
```yaml
- id: analyze-audience-engagement
  inputs: [transcriptAbridgement]
  outputs: [analyzeAudienceEngagement]
```

**Result**: ✅ Generated 90-line schema with:
- 4 nested properties
- Array of objects (emotionalTriggers, audienceInsights, usps)
- Enum type (tone.style: formal|casual|humorous)
- 3 levels of nesting

**Schema Structure**:
```
analyzeAudienceEngagement (object)
  ├── emotionalTriggers (array)
  │   └── items (object)
  │       ├── trigger (string)
  │       └── influence (string)
  ├── tone (object)
  │   ├── style (string, enum)
  │   └── examples (array[string])
  ├── audienceInsights (array)
  │   └── items (object)
  │       ├── group (string)
  │       └── relevance (string)
  └── usps (array)
      └── items (object)
          ├── point (string)
          └── explanation (string)
```

---

### 4. Parallel Execution Detection (Section 4)

**Observation**: All 3 Section 4 steps:
- Use same input: `transcriptAbridgement`
- Produce independent outputs
- Can run concurrently (3x speedup)

**YAML**:
```yaml
- id: analyze-content-essence
  inputs: [transcriptAbridgement]
  outputs: [analyzeContentEssence]

- id: analyze-audience-engagement
  inputs: [transcriptAbridgement]
  outputs: [analyzeAudienceEngagement]

- id: analyze-cta-competitors
  inputs: [transcriptAbridgement]
  outputs: [analyzeCtaCompetitors]
```

**Result**: ✅ Pattern detectable for Epic 5 workflow orchestration

---

## Coverage Summary

### Input Field Diversity

| Field | Type | Used By | Test Coverage |
|-------|------|---------|---------------|
| transcript | String (long-text) | 7 steps | ✅ High reuse |
| transcriptSummary | String | 1 step | ✅ Dependency |
| transcriptAbridgement | String (long-text) | 3 steps | ✅ Parallel |
| identifyChapters | String | 1 step | ✅ Dependency |
| projectFolder | String | 1 step | ✅ Simple |

### Output Field Diversity

| Field | Type | Complexity | Test Coverage |
|-------|------|------------|---------------|
| projectCode | String (pattern) | Simple | ✅ |
| shortTitle | String | Simple | ✅ |
| transcriptSummary | String | Simple | ✅ |
| transcriptAbridgement | String (long-text) | Simple | ✅ |
| transcriptAbridgementDescrepencies | Array[String] | Array | ✅ |
| transcriptIntro | String | Multi-output | ✅ |
| transcriptOutro | String | Multi-output | ✅ |
| identifyChapters | String | Simple | ✅ |
| chapters | String (multi-line) | Simple | ✅ |
| analyzeContentEssence | Object (nested) | **Complex** | ✅ |
| analyzeAudienceEngagement | Object (deeply nested) | **Very complex** | ✅ |
| analyzeCtaCompetitors | Object (nullable arrays) | **Complex** | ✅ |

---

## Type Mapping Coverage

### Mapped Types (from TYPE_MAPPINGS)

✅ transcript
✅ transcriptAbridgement
✅ transcriptSummary
✅ transcriptIntro
✅ transcriptOutro
✅ projectFolder
✅ projectCode
✅ shortTitle
✅ identifyChapters
✅ chapters
✅ transcriptAbridgementDescrepencies
✅ analyzeContentEssence
✅ analyzeAudienceEngagement
✅ analyzeCtaCompetitors

**Coverage**: 14/14 fields (100%)

---

## Performance

**Execution Time**: ~0.5 seconds
**Files Generated**: 10 schemas
**Total Lines**: ~600 lines of JSON
**Output Size**: ~25 KB

---

## Validation Checklist

- ✅ All schemas are valid JSON
- ✅ All schemas have required fields (templateName, title, description, section, input, output)
- ✅ All input fields marked as required
- ✅ All complex types correctly nested
- ✅ All enums properly formatted
- ✅ All patterns included (e.g., projectCode regex)
- ✅ All descriptions are meaningful
- ✅ All files named correctly ({step-id}.json)

---

## Known Limitations

1. **Unknown field fallback**: Fields not in TYPE_MAPPINGS default to `string`
2. **No prompt validation**: Doesn't verify schemas match actual .hbs files
3. **Limited nesting support**: Only 1 level for nested paths (e.g., `object.field`)
4. **No human-in-loop detection**: Can't identify steps requiring human input

---

## Conclusion

✅ **All 10 test cases passed**
✅ **Complex schemas work flawlessly**
✅ **Pattern validated for Epic 4/5**
✅ **Ready for story creation**

---

**Next Steps**:
1. Review discovery notes
2. Draft Epic 4.2 stories (Handlebars parser)
3. Draft Epic 5 stories (Workflow schema generation)
4. Build validation tool (verify schemas match prompts)

---

**Generated**: 2026-02-05
**Tool**: extract-schemas.js
**Location**: /Users/davidcruwys/dev/ad/poem-os/poem/data/youtube-launch-optimizer/tools/
