# Unified Schema Structure (Function Signature Pattern)

**Pattern**: Define prompts like function signatures with input and output schemas in a single unified file.

**Source Stories**: 3.7 (Define and Validate Output Schemas), 3.7.1 (Refactor to Unified Schema Structure)

## Context

When to use this pattern:

- Defining AI prompts that require structured inputs and outputs
- Building prompt libraries where each prompt is a reusable component
- Need type-safe validation for both prompt inputs and AI responses
- Creating workflows that chain multiple prompts (output of A → input of B)

**Problem**: Story 3.7 initially used separate files (`prompt.json` for input, `prompt-output.json` for output), leading to:
- File management complexity (2 files per prompt)
- Unclear relationship between input and output
- No clear "signature" for prompt as a reusable component

**Solution**: Treat prompts like function signatures `(input) -> output` in a single unified file.

## Implementation

### Unified Schema Structure

```typescript
// TypeScript Interface
interface UnifiedSchema {
  templateName: string;           // Prompt identifier
  version: string;                // Schema version
  description?: string;           // Human-readable description
  input: {                        // Input schema section
    fields: SchemaField[];
  };
  output?: {                      // Output schema section (optional)
    fields: SchemaField[];
  };
}

interface SchemaField {
  name: string;                   // Field name (supports dot notation)
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  description?: string;
  items?: SchemaField;            // For arrays
  properties?: SchemaField[];     // For objects
}
```

### Example Schema File

```json
// dev-workspace/workflows/youtube/schemas/generate-titles.json
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
        "description": "Primary audience for the video"
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
        "description": "List of generated title variations",
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
        "description": "Index of the recommended title"
      }
    ]
  }
}
```

## Function Signature Analogy

The unified schema mirrors function signatures in programming languages:

```csharp
// C# style
(string topic, string targetAudience, int? titleCount = 5) GenerateTitles()
  -> (string[] titles, int? recommendedIndex)
```

```typescript
// TypeScript style
function generateTitles(
  topic: string,
  targetAudience: string,
  titleCount?: number
): {
  titles: string[];
  recommendedIndex?: number;
}
```

```json
// POEM unified schema (same semantics)
{
  "templateName": "generate-titles",
  "input": { "fields": [...] },   // Function parameters
  "output": { "fields": [...] }    // Return type
}
```

**Key Insight**: Prompts ARE functions. They accept typed inputs and return typed outputs. The schema is the function signature.

## Rationale

**Why Unified Structure?**

1. **Conceptual Clarity**: Prompt = function with clear contract
2. **File Management**: 1 file per prompt (not 2)
3. **Workflow Chaining**: Easy to see if outputs match downstream inputs
4. **Documentation**: Schema file IS the API documentation
5. **Type Safety**: Validate both inputs (before render) and outputs (after AI execution)

**Architecture Alignment**:
- Original 2026-01-07 architecture design specified unified structure
- Story 3.7 deviated (separate files)
- Story 3.7.1 corrected to align with original intent

**Trade-offs**:
- Slightly larger schema files (combined input + output)
- But: Clearer relationships, easier validation, better ergonomics

## Related Patterns

- **API-First Heavy Operations** - Schema extraction and validation through Astro APIs
- **Skills Self-Description Format** - Skills that generate/validate schemas use this structure

## Migration from Separate Files

If you have legacy separate files:

```bash
# Before (Story 3.7 format)
schemas/
├── generate-titles.json         # Input schema
└── generate-titles-output.json  # Output schema

# After (Story 3.7.1 format)
schemas/
└── generate-titles.json         # Unified schema (input + output)
```

### Migration Script Pattern

```typescript
// Conceptual migration (not implemented in POEM, but shows the transform)
function migrateSeparateToUnified(
  inputSchemaPath: string,
  outputSchemaPath: string
): UnifiedSchema {
  const inputSchema = JSON.parse(fs.readFileSync(inputSchemaPath));
  const outputSchema = JSON.parse(fs.readFileSync(outputSchemaPath));

  return {
    templateName: path.basename(inputSchemaPath, '.json'),
    version: inputSchema.version || '1.0.0',
    description: inputSchema.description,
    input: {
      fields: inputSchema.fields
    },
    output: outputSchema ? {
      fields: outputSchema.fields
    } : undefined
  };
}
```

## Implementation Checklist

When creating a new prompt schema:

- [ ] Use unified structure with `input` and `output` sections
- [ ] Define `templateName` matching prompt file name
- [ ] Set `version` (start at "1.0.0")
- [ ] Document all fields with clear descriptions
- [ ] Mark required fields correctly
- [ ] Use `output` section only if prompt returns structured data
- [ ] Test with schema extraction skill: `generate-schema.md`
- [ ] Validate with `POST /api/schema/validate` endpoint

## Anti-Patterns

```json
// ❌ ANTI-PATTERN: Separate input/output files
// generate-titles.json (input only)
{ "fields": [...] }

// generate-titles-output.json (output only)
{ "fields": [...] }
// WRONG: Relationship unclear, 2 files to maintain

// ❌ ANTI-PATTERN: Flat schema (no input/output sections)
{
  "fields": [
    { "name": "topic", ... },      // Is this input or output?
    { "name": "titles", ... }      // Ambiguous!
  ]
}
// WRONG: Can't distinguish inputs from outputs

// ❌ ANTI-PATTERN: Embedding schema in prompt template
<!-- Schema: { "topic": "string", "audience": "string" } -->
// WRONG: Not machine-readable, no validation
```

## Example: Workflow Chaining

Unified schemas enable safe prompt chaining:

```typescript
// Check if prompt A's output matches prompt B's input
function canChainPrompts(
  promptA: UnifiedSchema,
  promptB: UnifiedSchema
): boolean {
  const outputFields = promptA.output?.fields || [];
  const inputFields = promptB.input.fields;

  // Simple check: Do required input fields exist in output?
  const requiredInputs = inputFields.filter(f => f.required).map(f => f.name);
  const outputNames = outputFields.map(f => f.name);

  return requiredInputs.every(name => outputNames.includes(name));
}

// Example workflow: Extract concepts → Generate titles
const extract = schemas['extract-concepts.json'];  // output: { concepts: string[] }
const generate = schemas['generate-titles.json'];   // input: { concepts: string[] }

if (canChainPrompts(extract, generate)) {
  console.log('✓ Prompts can be chained safely');
}
```

## References

- **Original Design**: `data/youtube-launch-optimizer/workflow-architecture-concepts.md` (lines 25-67, function signature analogy)
- **Initial Implementation**: `docs/stories/3.7.story.md` (separate files approach - superseded)
- **Correction**: `docs/stories/3.7.1.story.md` (unified structure refactoring)
- **Type Definitions**: `packages/poem-app/src/services/schema/types.ts` (UnifiedSchema interface)
- **Architecture Doc**: `docs/architecture/data-models.md` (lines 155-230, Schema section)
- **Decision Record**: [ADR-001: Unified Schema Structure](../decisions/adr-001-unified-schema-structure.md)

---

**Pattern Established**: Story 3.7.1 (2026-01-12)
**Corrects**: Story 3.7 (separate files approach)
**Last Updated**: 2026-01-16
