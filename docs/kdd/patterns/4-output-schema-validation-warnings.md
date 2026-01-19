# Output Schema Validation as Warnings

**Pattern**: Validate rendered prompt output against output schema section, but report violations as warnings (not errors) to maintain graceful degradation.

**Source Stories**: Story 4.5 (Run Single Prompt with Mock Data)

## Context

When to use this pattern:

- Prompts have defined output schemas (structured return types)
- Want to validate AI-generated output matches expected structure
- Need feedback about schema violations without failing the operation
- Building prompt chains where output validation helps debug issues
- Testing templates during development

**Problem**: Strict validation (reject invalid output) breaks workflows when AI produces slightly off-format responses. No validation means schema drift goes undetected until downstream consumers fail.

**Solution**: Validate output against output schema, report violations as warnings in response, but return the output anyway. Let consumers decide how to handle violations.

## Implementation

### Validation Flow

```typescript
// POST /api/prompt/render endpoint
export const POST: APIRoute = async ({ request }) => {
  const { template, data, isRawTemplate } = await request.json();

  // 1. Render template
  const rendered = await handlebarsService.render(template, data);

  // 2. Attempt output schema validation (optional)
  const warnings: string[] = [];
  const schemaPath = resolveSchemaPath(template);

  if (schemaPath && fs.existsSync(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

    if (schema.output) {
      // Validate rendered output against output schema
      const validationResult = await validateOutputSchema(rendered, schema.output);

      // Add warnings (not errors!)
      warnings.push(...validationResult.warnings);
    }
  }

  // 3. Return output WITH warnings (not error status)
  return new Response(JSON.stringify({
    rendered,
    renderTimeMs,
    warnings,  // ← Includes schema validation warnings
    dataSource: 'provided',
    helperUsageCount: 3
  }), { status: 200 });  // ← Always 200, even with validation warnings
};
```

### Validation Logic

```typescript
async function validateOutputSchema(
  rendered: string,
  outputSchema: { fields: SchemaField[] }
): Promise<{ warnings: string[] }> {
  const warnings: string[] = [];

  // 1. Parse rendered output as JSON (if possible)
  let outputData: Record<string, unknown>;
  try {
    outputData = JSON.parse(rendered);
  } catch {
    warnings.push(`Output schema validation skipped: Output is not valid JSON`);
    return { warnings };
  }

  // 2. Validate fields
  for (const field of outputSchema.fields) {
    const value = outputData[field.name];

    // Check required fields
    if (field.required && (value === undefined || value === null)) {
      warnings.push(`Schema validation: Required field '${field.name}' is missing`);
      continue;
    }

    // Check type
    if (value !== undefined && !validateFieldType(value, field.type)) {
      warnings.push(
        `Schema validation: Field '${field.name}' expected type '${field.type}' ` +
        `but got '${typeof value}'`
      );
    }

    // Array item validation
    if (field.type === 'array' && field.items && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (!validateFieldType(item, field.items.type)) {
          warnings.push(
            `Schema validation: Array '${field.name}[${index}]' expected type ` +
            `'${field.items.type}' but got '${typeof item}'`
          );
        }
      });
    }
  }

  return { warnings };
}
```

## Example

### Schema with Output Section

```json
{
  "templateName": "generate-titles",
  "version": "1.0.0",
  "input": { ... },
  "output": {
    "fields": [
      {
        "name": "titles",
        "type": "array",
        "required": true,
        "items": {
          "name": "title",
          "type": "string",
          "required": true
        }
      },
      {
        "name": "recommendedIndex",
        "type": "number",
        "required": false
      }
    ]
  }
}
```

### Valid Output (No Warnings)

```json
// Rendered output:
{
  "titles": [
    "How to Build AI Systems",
    "AI Development Guide",
    "Complete AI Tutorial"
  ],
  "recommendedIndex": 0
}

// API Response:
{
  "rendered": "{...}",
  "renderTimeMs": 245,
  "warnings": [],  // ← Empty (valid output)
  "dataSource": "provided"
}
```

### Invalid Output (Warnings Added)

```json
// Rendered output (wrong types):
{
  "titles": "How to Build AI Systems",  // Wrong: string instead of array
  "recommendedIndex": "first"           // Wrong: string instead of number
}

// API Response:
{
  "rendered": "{...}",
  "renderTimeMs": 245,
  "warnings": [
    "Schema validation: Field 'titles' expected type 'array' but got 'string'",
    "Schema validation: Field 'recommendedIndex' expected type 'number' but got 'string'"
  ],
  "dataSource": "provided"
}
// Status: 200 (not 400!) - output still returned
```

## Rationale

**Why Warnings Instead of Errors?**

1. **Graceful Degradation**: Prompt slightly off-format? Get feedback but don't block workflow
2. **Development Feedback**: See schema violations during testing without failing tests
3. **AI Flexibility**: LLMs sometimes produce valid-but-different output structures
4. **Debugging Aid**: Warnings help identify prompt engineering issues
5. **Consumer Choice**: Downstream code can inspect warnings and decide how to react

**When to Use Strict Validation** (errors):
- API data contracts between services (use 400 status)
- User input validation (reject malformed requests)
- Configuration files (invalid config should fail fast)

**When to Use Warning Validation** (this pattern):
- AI-generated output (inherently unpredictable)
- Template testing (want feedback, not failures)
- Prompt chains (downstream steps might tolerate variations)

**Architecture Decision**: Story 4.5 chose warnings to align with POEM's graceful degradation principle (AC4: "Missing placeholder fields reported as warnings, not errors").

## Architecture Alignment ⭐

- **Designed in**: `docs/architecture/coding-standards.md` (Graceful Degradation principle)
- **Implementation Status**: ✅ **Aligned** - Follows coding standard: "Missing helpers log warning but render template"
- **Deviation Rationale**: N/A - Pattern extends graceful degradation to output validation

**Validation**: All 713 render tests passing. Output schema validation tested with 3 scenarios (no schema, valid output, invalid output).

## Evolution from Epic 3 ⭐

- **Relationship**: **Refinement** of Epic 3's Unified Schema Structure pattern
- **Epic 3 Pattern**: [Unified Schema Structure](unified-schema-structure.md) - Schemas validate inputs before rendering
- **Changes**:
  - Epic 3: Input validation only (validate data before rendering)
  - **Epic 4 adds**: Output validation (validate rendered result against output schema)
  - Epic 3: No validation of AI-generated content
  - **Epic 4 adds**: Optional output validation with warnings (not errors)

**Key Innovation**: Schemas now serve dual purpose - input contracts (strict) and output contracts (flexible).

## Real-World Validation ⭐

- **VibeDeck Status**: **Untested** - VibeDeck doesn't use output schemas yet
- **Gap Analysis Reference**: Not mentioned in `vibedeck-observations.jsonl`
- **Edge Cases Discovered**:
  - **Non-JSON output**: If template renders plain text but schema exists, warning logged: "Output is not valid JSON"
  - **Extra fields allowed**: Output can have fields not in schema (permissive by design)
  - **Nested object validation**: Story 4.5 validates top-level fields only (nested object validation deferred to future story)

**Production Readiness**: Pattern validated with YouTube templates. All 53 templates render successfully with optional schema validation. Quality score: 100/100 (Story 4.5 QA gate).

## Related Patterns

- **[Unified Schema Structure](unified-schema-structure.md)** (Epic 3) - Defines output schema format
- **[Handlebars Helper Module Pattern](4-handlebars-helper-module-pattern.md)** (Epic 4) - Helpers also follow graceful degradation (return safe defaults, not errors)
- **[Workflow Chain Execution](4-workflow-chain-execution.md)** (Epic 4) - Chains benefit from output warnings (debug which step produces bad data)

## Anti-Patterns

```typescript
// ❌ ANTI-PATTERN: Strict validation (throw error)
if (!validateOutputSchema(rendered, schema.output)) {
  throw new Error('Output does not match schema');
}
// WRONG: Breaks graceful degradation, fails workflow

// ❌ ANTI-PATTERN: Silent validation (no warnings)
const isValid = validateOutputSchema(rendered, schema.output);
// Just check, don't report
// WRONG: No feedback, schema violations undetected

// ❌ ANTI-PATTERN: Validation without schema
warnings.push('Output validation failed');
// WRONG: No context (which field? expected what?)

// ✅ CORRECT: Warnings with field-level details
warnings.push(
  `Schema validation: Field 'titles' expected type 'array' but got 'string'`
);
```

## Implementation Checklist

When adding output schema validation:

- [ ] Check if template has associated unified schema file
- [ ] Load schema and extract `output` section (may be undefined)
- [ ] Parse rendered output as JSON (catch parse errors → warning)
- [ ] Validate each field in output schema:
  - [ ] Required field check (missing → warning)
  - [ ] Type check (wrong type → warning)
  - [ ] Array item validation (if applicable)
- [ ] Add all warnings to response `warnings` array
- [ ] Return 200 status even with validation warnings
- [ ] Test scenarios: no schema, valid output, invalid output, non-JSON output

## References

- **Story**: `docs/stories/4.5.story.md` (Run Single Prompt with Mock Data, AC8-9)
- **Implementation**:
  - API: `packages/poem-app/src/pages/api/prompt/render.ts` (lines 73-134: validateOutputSchema)
  - Schema Validator: `packages/poem-app/src/services/schema/validator.ts` (field-level validation)
- **Tests**:
  - `packages/poem-app/tests/api/prompt-render.test.ts` (tests for AC8-9)
    - Line 386: "should skip validation when no schema exists"
    - Line 403: "should add warning if output is not JSON when schema exists"
- **QA Gate**: `docs/qa/gates/4.5-run-single-prompt-with-mock-data.yml` (Quality Score: 100/100)
- **Coding Standards**: `docs/architecture/coding-standards.md` (Graceful Degradation principle)

---

**Pattern Established**: Story 4.5 (2026-01-14)
**Extends**: Unified Schema Structure (Epic 3) with output validation
**Last Updated**: 2026-01-19
