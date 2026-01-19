# Example: Schema-Based Mock Data Generation

**Pattern**: [Schema-Based Mock Data Generation](../../kdd/patterns/4-schema-based-mock-data-generation.md)
**ADR**: [ADR-005: Mock Data Generation with Faker.js](../../kdd/decisions/adr-005-mock-data-generation-fakerjs.md)
**Story**: Story 4.3

## Purpose

Demonstrates generating realistic mock data from UnifiedSchema definitions using Faker.js with domain-specific generators.

## Setup

No special setup required - mock generator is built into POEM.

## Step-by-Step Usage

### 1. Create Schema

`dev-workspace/workflows/demo/schemas/generate-video-summary.json`:

```json
{
  "templateName": "generate-video-summary",
  "version": "1.0.0",
  "description": "Generate video summary from transcript",
  "input": {
    "fields": [
      {
        "name": "videoTitle",
        "type": "string",
        "required": true,
        "constraints": {
          "minLength": 40,
          "maxLength": 50
        }
      },
      {
        "name": "transcriptAbridgement",
        "type": "string",
        "required": true,
        "constraints": {
          "minLength": 500,
          "maxLength": 1000
        }
      },
      {
        "name": "videoKeywords",
        "type": "array",
        "required": true,
        "items": {
          "name": "keyword",
          "type": "string",
          "required": true
        }
      }
    ]
  },
  "output": {
    "fields": [
      {
        "name": "summary",
        "type": "string",
        "required": true
      }
    ]
  }
}
```

### 2. Generate Mock Data

**Via API**:
```bash
curl -X POST http://localhost:4321/api/mock/generate \
  -H "Content-Type: application/json" \
  -d '{
    "schemaPath": "dev-workspace/workflows/demo/schemas/generate-video-summary.json",
    "count": 1,
    "seed": 12345
  }'
```

**Response**:
```json
{
  "data": [
    {
      "videoTitle": "How to Build AI Automation Systems: A Complete Guide",
      "transcriptAbridgement": "In this comprehensive video, we explore AI automation fundamentals including prompt engineering, workflow orchestration, schema design, and real-world examples from YouTube content optimization. You'll learn about sequential processing, parallel execution, conditional branching, type-safe AI interactions, mock data generation, and best practices for handling errors gracefully. By the end, you'll have the knowledge to build production-ready AI automation workflows that scale. We cover testing strategies, debugging techniques, and performance optimization to ensure your systems are reliable and maintainable...",
      "videoKeywords": [
        "AI automation",
        "workflow optimization",
        "prompt engineering",
        "system design",
        "development tools",
        "productivity",
        "tutorial",
        "guide"
      ]
    }
  ],
  "count": 1,
  "seed": 12345,
  "warnings": []
}
```

### 3. Use in Template

`dev-workspace/workflows/demo/prompts/generate-video-summary.hbs`:

```handlebars
Generate a concise summary for this video:

Title: {{videoTitle}}

Keywords: {{join videoKeywords ", "}}

Transcript:
{{truncate transcriptAbridgement 200}}
```

### 4. Test with Mock Data

```bash
curl -X POST http://localhost:4321/api/prompt/render \
  -H "Content-Type: application/json" \
  -d '{
    "template": "dev-workspace/workflows/demo/prompts/generate-video-summary.hbs",
    "data": {
      "videoTitle": "How to Build AI Automation Systems: A Complete Guide",
      "videoKeywords": ["AI automation", "workflow optimization"],
      "transcriptAbridgement": "In this comprehensive video..."
    }
  }'
```

## Key Concepts

**Pattern-Based Detection**: Field name `videoTitle` triggers YouTube-specific generator (40-50 chars, appropriate format).

**Constraint Satisfaction**: Generated data respects minLength/maxLength constraints automatically.

**Reproducibility**: Same seed (12345) always generates identical data.

**Domain Realism**: `transcriptAbridgement` generates 500-1000 words of realistic content, not "lorem ipsum".

## Real-World Usage ⭐

- **VibeDeck Application**: Not yet tested
- **Production Status**: Validated with 53 YouTube templates
- **Edge Cases Found**: Array type override bug (fixed in Story 4.3)
- **Gap Analysis Reference**: Not mentioned in vibedeck-observations.jsonl

## Epic 3 Pattern Reuse ⭐

- **Reused**: Unified Schema Structure (Epic 3) - schema format unchanged
- **Extended**: Mock generation uses input section to generate test data

## Related Patterns

- [Schema-Based Mock Data Generation](../../kdd/patterns/4-schema-based-mock-data-generation.md)
- [Unified Schema Structure](../../kdd/patterns/unified-schema-structure.md) (Epic 3)

## References

- Story: `docs/stories/4.3.story.md`
- API: `packages/poem-app/src/pages/api/mock/generate.ts`
- Service: `packages/poem-app/src/services/mock-generator/`
- Tests: 61/61 passing

---

**Created**: 2026-01-19
**Source**: Epic 4 KDD Retrospective
