# Schema Format Alternatives

**Status**: Exploring
**BMAD Ready**: No (decision needed: which format?)
**Purpose**: Explore alternative formats for placeholder schemas

## Current Format (Custom JSON)

**Current**: `data/schemas/analysis-predicate-example.json`

```json
{
  "templateName": "analysis-predicate-example",
  "description": "Binary yes/no decision...",
  "dataSource": "flexible",
  "placeholders": {
    "context": {
      "type": "text",
      "required": true,
      "description": "The contextual information...",
      "example": "An incident occurred..."
    }
  }
}
```

**Pros**:
- Simple, readable
- Easy for Angela to edit
- No dependencies

**Cons**:
- No validation tooling
- No type safety
- Custom format (not standard)

---

## Alternative 1: JSON Schema (W3C Standard)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "analysis-predicate-example",
  "title": "Analysis Predicate Example",
  "description": "Binary yes/no decision based on context",
  "type": "object",
  "properties": {
    "templateName": {
      "const": "analysis-predicate-example"
    },
    "dataSource": {
      "const": "flexible"
    },
    "placeholders": {
      "type": "object",
      "properties": {
        "context": {
          "type": "string",
          "description": "The contextual information needed to make the decision",
          "examples": ["An incident occurred where a participant fell..."]
        },
        "question": {
          "type": "string",
          "description": "The yes/no question to be answered",
          "examples": ["Is this a reportable incident under NDIS guidelines?"]
        }
      },
      "required": ["context", "question"]
    }
  },
  "additionalProperties": false
}
```

**Pros**:
- Industry standard (W3C)
- Validation tooling exists (ajv, etc.)
- IDE support (autocomplete, validation)
- Can generate TypeScript types

**Cons**:
- More verbose
- Complex for simple cases
- Harder for Angela to edit

---

## Alternative 2: Zod Schema (TypeScript)

```typescript
// data/schemas/analysis-predicate-example.schema.ts
import { z } from 'zod'

export const AnalysisPredicateSchema = z.object({
  templateName: z.literal('analysis-predicate-example'),
  description: z.string(),
  dataSource: z.literal('flexible'),
  outputType: z.literal('predicate'),

  placeholders: z.object({
    context: z.string()
      .describe('The contextual information needed to make the decision')
      .openapi({ example: 'An incident occurred where...' }),

    question: z.string()
      .describe('The yes/no question to be answered')
      .openapi({ example: 'Is this a reportable incident?' })
  }),

  outputFormat: z.string().optional(),
  recommendedModel: z.string().default('openai/gpt-4o-mini'),
  maxTokens: z.number().int().positive().default(150),
  temperature: z.number().min(0).max(1).default(0.3)
})

// Infer TypeScript type from schema
export type AnalysisPredicateTemplate = z.infer<typeof AnalysisPredicateSchema>

// Validation function
export function validateTemplate(data: unknown) {
  return AnalysisPredicateSchema.parse(data)
}
```

**Pros**:
- Type-safe (TypeScript)
- Runtime validation
- Excellent IDE support
- Can generate JSON Schema
- Chainable, composable
- Great error messages

**Cons**:
- Requires TypeScript/Node.js
- Not editable by Angela (code, not data)
- Build step required

---

## Alternative 3: YAML Format

```yaml
# data/schemas/analysis-predicate-example.yaml
templateName: analysis-predicate-example
description: Binary yes/no decision based on context
dataSource: flexible
outputType: predicate

placeholders:
  context:
    type: text
    required: true
    description: The contextual information needed to make the decision
    example: |
      An incident occurred where a participant fell from a chair
      and sustained a minor bruise on their arm.

  question:
    type: string
    required: true
    description: The yes/no question to be answered
    example: Is this a reportable incident under NDIS guidelines?

outputFormat: Yes/No with brief justification
recommendedModel: openai/gpt-4o-mini
maxTokens: 150
temperature: 0.3
```

**Pros**:
- More readable than JSON
- Supports multiline strings naturally
- Comments allowed
- Less syntactic noise

**Cons**:
- Indentation-sensitive
- Parsing more complex
- Less universal than JSON

---

## Alternative 4: Hybrid - JSON + Zod Validation

**Approach**: Keep data in JSON (Angela-editable), validate with Zod (type-safe)

**Schema file** (Angela edits): `data/schemas/analysis-predicate-example.json`
```json
{
  "templateName": "analysis-predicate-example",
  "placeholders": {
    "context": {
      "type": "text",
      "required": true
    }
  }
}
```

**Validator** (Developer provides): `lib/validators/template-schema.ts`
```typescript
import { z } from 'zod'

const PlaceholderSchema = z.object({
  type: z.enum(['string', 'text', 'number', 'datetime', 'array']),
  required: z.boolean(),
  description: z.string().optional(),
  example: z.any().optional()
})

export const TemplateSchemaValidator = z.object({
  templateName: z.string(),
  description: z.string(),
  dataSource: z.string(),
  placeholders: z.record(PlaceholderSchema)
})

// Validate JSON files
export function validateSchemaFile(jsonContent: unknown) {
  return TemplateSchemaValidator.parse(jsonContent)
}
```

**Pros**:
- Angela edits simple JSON
- Type safety + validation via code
- Best of both worlds

**Cons**:
- Requires build tooling
- Two-layer approach

---

## Alternative 5: HCL (HashiCorp Configuration Language)

```hcl
# data/schemas/analysis-predicate-example.hcl
template_name = "analysis-predicate-example"
description   = "Binary yes/no decision based on context"
data_source   = "flexible"
output_type   = "predicate"

placeholder "context" {
  type        = "text"
  required    = true
  description = "The contextual information needed to make the decision"
  example     = <<-EOT
    An incident occurred where a participant fell from a chair
    and sustained a minor bruise on their arm.
  EOT
}

placeholder "question" {
  type        = "string"
  required    = true
  description = "The yes/no question to be answered"
  example     = "Is this a reportable incident under NDIS guidelines?"
}

ai_config {
  model       = "openai/gpt-4o-mini"
  max_tokens  = 150
  temperature = 0.3
}
```

**Pros**:
- Very readable
- Supports blocks/nesting naturally
- Heredoc strings
- Comments
- Used by Terraform (proven)

**Cons**:
- Requires HCL parser
- Less common than JSON/YAML
- Not standard for web apps

---

## Recommendation

**For this project**: Stick with **Custom JSON** for now

**Why**:
1. Angela can edit directly
2. Simple, no dependencies
3. Astro can read easily
4. Git-friendly
5. Validation can be added later if needed

**Future enhancement**: Add Zod validation as a Claude skill
- Angela continues editing JSON
- Skill validates on save
- Best of both worlds

**If Astro app grows**: Consider **Hybrid (JSON + Zod)**
- Keeps JSON for data
- Adds type safety
- Still Angela-friendly

---

## Schema Validation as a Claude Skill

**Concept**: Validate JSON schemas programmatically

```typescript
// Claude skill validates schema file
async function validateSchemaFile(filePath: string) {
  const content = await readFile(filePath)
  const json = JSON.parse(content)

  // Check required fields
  if (!json.templateName) throw new Error('Missing templateName')
  if (!json.placeholders) throw new Error('Missing placeholders')

  // Validate placeholder structure
  for (const [name, config] of Object.entries(json.placeholders)) {
    if (!config.type) throw new Error(`Placeholder ${name} missing type`)
    if (!['string', 'text', 'number', 'datetime', 'array'].includes(config.type)) {
      throw new Error(`Invalid type for ${name}: ${config.type}`)
    }
  }

  return { valid: true }
}
```

---

**Last Updated**: 2025-11-11
