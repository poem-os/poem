# Example: Unified Schema Creation

**Feature**: Story 3.7.1 - Unified Schema Structure
**Pattern**: [Unified Schema Structure](../../kdd/patterns/unified-schema-structure.md)
**ADR**: [ADR-001: Unified Schema Structure](../../kdd/decisions/adr-001-unified-schema-structure.md)

## Purpose

Demonstrates creating prompts with unified schemas that combine input and output specifications in a single file, following the function signature metaphor: `(input) -> output`.

## Overview

This example shows:
1. Creating a prompt template with input placeholders and output expectations
2. Extracting unified schema (input + output) from template
3. Validating input data before rendering
4. Validating output data after AI execution

**Real-World Scenario**: YouTube title generation workflow

## Setup

### Prerequisites

- POEM development environment (`POEM_DEV=true`)
- Astro server running (`npm run dev`)
- Penny agent accessible via Claude Code

### File Structure

```
dev-workspace/workflows/youtube-launch-optimizer/
├── prompts/
│   └── generate-titles.hbs
└── schemas/
    └── generate-titles.json    # Single unified file
```

## Step-by-Step Usage

### Step 1: Create Prompt Template

Create `generate-titles.hbs` with input placeholders and output documentation:

```handlebars
{{!--
  Generate YouTube Video Titles

  Input Parameters:
  - topic (string, required): Video topic or subject matter
  - targetAudience (string, required): Primary audience demographic
  - titleCount (number, optional): Number of title variations (default: 5)

  Expected Output:
  {
    "titles": ["string[]"],           // Array of title variations
    "recommendedIndex": "number?"     // Index of best title (0-based)
  }
--}}

Generate {{titleCount}} engaging YouTube video titles for:
- Topic: {{topic}}
- Target Audience: {{targetAudience}}

Requirements:
- Titles should be 40-60 characters
- Include relevant keywords for SEO
- Create emotional curiosity
- Use title case formatting

Return as JSON array with recommended index.
```

### Step 2: Extract Unified Schema

**Via Penny Agent**:
```bash
# Activate Penny
/poem/agents/penny

# Switch to workflow
*switch youtube-launch-optimizer

# Generate schema (will extract both input and output)
User: "Generate schema for generate-titles prompt"
```

**Or via API** (for automation):
```bash
curl -X POST http://localhost:4321/api/schema/extract \
  -H "Content-Type: application/json" \
  -d '{
    "template": "dev-workspace/workflows/youtube-launch-optimizer/prompts/generate-titles.hbs"
  }'
```

**Generated Schema** (`generate-titles.json`):
```json
{
  "templateName": "generate-titles",
  "version": "1.0.0",
  "description": "Generate YouTube video title variations",
  "input": {
    "fields": [
      {
        "name": "topic",
        "type": "string",
        "required": true,
        "description": "Video topic or subject matter"
      },
      {
        "name": "targetAudience",
        "type": "string",
        "required": true,
        "description": "Primary audience demographic"
      },
      {
        "name": "titleCount",
        "type": "number",
        "required": false,
        "description": "Number of title variations to generate"
      }
    ]
  },
  "output": {
    "fields": [
      {
        "name": "titles",
        "type": "array",
        "required": true,
        "description": "Array of title variations",
        "items": {
          "name": "title",
          "type": "string",
          "required": true
        }
      },
      {
        "name": "recommendedIndex",
        "type": "number",
        "required": false,
        "description": "Index of recommended title (0-based)"
      }
    ]
  }
}
```

### Step 3: Validate Input Data

Before rendering prompt:

```bash
curl -X POST http://localhost:4321/api/schema/validate \
  -H "Content-Type: application/json" \
  -d '{
    "schema": "dev-workspace/workflows/youtube-launch-optimizer/schemas/generate-titles.json",
    "data": {
      "topic": "AI Automation with Claude",
      "targetAudience": "developers",
      "titleCount": 5
    },
    "schemaSection": "input"
  }'
```

**Response**:
```json
{
  "valid": true,
  "errors": [],
  "validationTimeMs": 12
}
```

### Step 4: Render Prompt

```bash
curl -X POST http://localhost:4321/api/prompt/render \
  -H "Content-Type: application/json" \
  -d '{
    "template": "dev-workspace/workflows/youtube-launch-optimizer/prompts/generate-titles.hbs",
    "data": {
      "topic": "AI Automation with Claude",
      "targetAudience": "developers",
      "titleCount": 5
    }
  }'
```

**Response**: Rendered prompt ready for AI execution.

### Step 5: Validate Output Data

After AI execution, validate response against output schema:

```bash
curl -X POST http://localhost:4321/api/schema/validate \
  -H "Content-Type: application/json" \
  -d '{
    "schema": "dev-workspace/workflows/youtube-launch-optimizer/schemas/generate-titles.json",
    "data": {
      "titles": [
        "Build AI Agents That Write Code for You",
        "Automating Development with Claude Code",
        "How I Saved 10 Hours Using AI Automation",
        "Claude Code Tutorial for Developers",
        "AI-Powered Coding: The Future is Here"
      ],
      "recommendedIndex": 2
    },
    "schemaSection": "output"
  }'
```

**Response**:
```json
{
  "valid": true,
  "errors": [],
  "validationTimeMs": 8
}
```

## Key Concepts

### 1. Function Signature Metaphor

**Unified Schema** = **Function Signature**

```typescript
// TypeScript equivalent
function generateTitles(
  topic: string,
  targetAudience: string,
  titleCount?: number
): {
  titles: string[];
  recommendedIndex?: number;
}
```

The schema file IS the prompt's API contract.

### 2. Single Source of Truth

**Before (Dual-File)**:
- `generate-titles.json` (input)
- `generate-titles-output.json` (output)
- **Problem**: Which file to edit? Are they in sync?

**After (Unified)**:
- `generate-titles.json` (input + output)
- **Benefit**: One file, one source of truth.

### 3. Workflow Chaining

Check if prompts can be chained:

```typescript
// Can we chain extract-concepts → generate-titles?
const extractSchema = loadSchema('extract-concepts.json');
const generateSchema = loadSchema('generate-titles.json');

// Check: Do extract's outputs match generate's required inputs?
const extractOutputs = extractSchema.output?.fields || [];
const generateInputs = generateSchema.input.fields.filter(f => f.required);

const canChain = generateInputs.every(input =>
  extractOutputs.some(output => output.name === input.name)
);
```

## Related Patterns

- **[Config Service Single Source of Truth](../../kdd/patterns/config-service-single-source-of-truth.md)** - Schema paths resolved via config
- **[API-First Heavy Operations](../../kdd/patterns/api-first-heavy-operations.md)** - Schema extraction and validation through APIs
- **[Skills Self-Description Format](../../kdd/patterns/skills-self-description-format.md)** - generate-schema skill uses this pattern

## Common Pitfalls

### Pitfall 1: Separate Files

```
❌ schemas/generate-titles.json (input only)
❌ schemas/generate-titles-output.json (output only)
```

**Fix**: Combine into single unified file.

### Pitfall 2: No Output Section

```json
{
  "templateName": "generate-titles",
  "fields": [...]  // Flat structure - no input/output distinction
}
```

**Fix**: Use `input` and `output` sections explicitly.

### Pitfall 3: Output Section Not Optional

Some prompts return unstructured text. Output section should be optional:

```json
{
  "templateName": "summarize-content",
  "input": { "fields": [...] },
  "output": null  // Or omit entirely - unstructured text output
}
```

## Testing

### Unit Test: Schema Structure

```typescript
import { describe, it, expect } from 'vitest';
import { loadSchema, isUnifiedSchema } from '@services/schema';

describe('generate-titles schema', () => {
  it('should be a valid unified schema', () => {
    const schema = loadSchema('generate-titles.json');
    expect(isUnifiedSchema(schema)).toBe(true);
  });

  it('should have input and output sections', () => {
    const schema = loadSchema('generate-titles.json');
    expect(schema.input).toBeDefined();
    expect(schema.output).toBeDefined();
  });

  it('should have required input fields', () => {
    const schema = loadSchema('generate-titles.json');
    const requiredInputs = schema.input.fields.filter(f => f.required);
    expect(requiredInputs.map(f => f.name)).toEqual(['topic', 'targetAudience']);
  });
});
```

### Integration Test: End-to-End

```bash
# Extract → Validate Input → Render → Execute AI → Validate Output
npm run test:integration -- --match="generate-titles workflow"
```

## References

- **Story**: `docs/stories/3.7.1.story.md` (unified schema refactoring)
- **Pattern**: `docs/kdd/patterns/unified-schema-structure.md`
- **ADR**: `docs/kdd/decisions/adr-001-unified-schema-structure.md`
- **Service**: `packages/poem-app/src/services/schema/extractor.ts`
- **API Docs**: `docs/architecture/api-specification.md` (schema/extract, schema/validate endpoints)

---

**Last Updated**: 2026-01-16
**Example Author**: Dev Agent (KDD retrospective)
