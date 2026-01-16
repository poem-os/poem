# ADR-001: Unified Schema Structure

**Date**: 2026-01-12
**Status**: Accepted
**Replaces**: Dual-file schema approach (Story 3.7)
**Source**: Story 3.7.1

## Context

Story 3.7 implemented output schemas for prompts, allowing validation of AI-generated responses. However, it used a **dual-file approach**:
- `generate-titles.json` (input schema)
- `generate-titles-output.json` (output schema)

This deviated from the original architecture design discussed on 2026-01-07, which specified **unified schema files** with input and output sections, treating prompts like function signatures.

### Problems with Dual-File Approach

1. **File Management Complexity**: 2 files per prompt (input + output)
2. **Unclear Relationships**: Difficult to see connection between input and output
3. **No Clear Contract**: Prompt doesn't have a single "signature"
4. **Workflow Chaining**: Hard to validate if prompt A's output matches prompt B's input
5. **Architecture Drift**: Implementation didn't match documented design

### Original Design Intent

From `data/youtube-launch-optimizer/workflow-architecture-concepts.md` (lines 25-67):

> Prompts should be treated like **function signatures** with:
> - Input parameters: Typed inputs (string, number, boolean, array, object)
> - Output specifications: Structured return values

**Function Signature Analogy**:
```csharp
// C# style
(string topic, string audience) GenerateTitles() -> (string[] titles, int count)
```

## Decision

**Adopt unified schema structure** with input and output sections in a single JSON file.

### Unified Schema Interface

```typescript
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
```

### Example Unified Schema

```json
{
  "templateName": "generate-titles",
  "version": "1.0.0",
  "description": "Generate YouTube video title variations",
  "input": {
    "fields": [
      { "name": "topic", "type": "string", "required": true },
      { "name": "targetAudience", "type": "string", "required": true }
    ]
  },
  "output": {
    "fields": [
      { "name": "titles", "type": "array", "required": true },
      { "name": "recommendedIndex", "type": "number", "required": false }
    ]
  }
}
```

## Alternatives Considered

### Alternative 1: Keep Dual-File Approach (Rejected)

**Pros**:
- Already implemented in Story 3.7
- No refactoring needed
- Clear separation of input vs output

**Cons**:
- 2 files per prompt (management overhead)
- Relationship between files not explicit
- Doesn't align with function signature metaphor
- Difficult to validate workflow chains programmatically

### Alternative 2: Unified File with Top-Level Fields (Rejected)

```json
{
  "fields": [
    { "name": "topic", "direction": "input", ... },
    { "name": "titles", "direction": "output", ... }
  ]
}
```

**Pros**:
- Single file
- All fields in one array

**Cons**:
- No clear separation between input and output
- "direction" field is awkward
- Doesn't match function signature mental model

### Alternative 3: Unified with Sections (Accepted)

As described in Decision section above.

**Pros**:
- Single file per prompt ✓
- Clear input/output separation ✓
- Matches function signature metaphor ✓
- Easy to validate workflow chains ✓
- Aligns with original architecture ✓

**Cons**:
- Requires refactoring Story 3.7 work (153 tests updated)
- Slightly larger schema files (both sections in one file)

**Trade-off**: Refactoring cost justified by long-term maintainability gains.

## Rationale

### Conceptual Clarity

**Prompts ARE functions.** They accept typed inputs and return typed outputs. The schema is the function signature.

This mental model makes prompt libraries easier to understand:
- Input = function parameters
- Output = return type
- Schema file = API contract

### Workflow Chaining

Unified schemas enable safe prompt composition:

```typescript
function canChainPrompts(promptA: UnifiedSchema, promptB: UnifiedSchema): boolean {
  const outputFields = promptA.output?.fields || [];
  const inputFields = promptB.input.fields.filter(f => f.required);

  // Check if A's outputs satisfy B's required inputs
  return inputFields.every(field =>
    outputFields.some(output => output.name === field.name)
  );
}
```

### File Management

**Before (Dual-File)**:
```
schemas/
├── generate-titles.json          # Which file do I edit?
└── generate-titles-output.json   # Are these in sync?
```

**After (Unified)**:
```
schemas/
└── generate-titles.json          # Single source of truth
```

### Architecture Alignment

Corrects deviation from original design. Story 3.7 implementation didn't match documented architecture from 2026-01-07 conversation.

## Consequences

### Positive Consequences

1. **Single Source of Truth**: One file per prompt (easier management)
2. **Clear Contracts**: Schema file = complete prompt API
3. **Better Documentation**: Function signature metaphor intuitive
4. **Workflow Validation**: Easy to check prompt compatibility
5. **Reduced Complexity**: Fewer files to track

### Negative Consequences

1. **Refactoring Cost**: Story 3.7 completed, required Story 3.7.1 to correct
2. **Slightly Larger Files**: Input + output in same file (minor impact)

### Migration Path

Story 3.7.1 provided backward compatibility:
- Deprecated `Schema` interface kept with warnings
- New `UnifiedSchema` interface introduced
- Type guards added (`isUnifiedSchema()`, `isLegacySchema()`)
- Migration guidance in deprecation comments

### Test Impact

**Story 3.7**: 151 tests (dual-file approach)
**Story 3.7.1**: 153 tests (unified approach) - all passing

Refactoring increased test count (added type guard tests, backward compatibility tests).

## Related Decisions

- **ADR-003: API-First for Heavy Operations** - Schema extraction and validation through APIs
- **Pattern: Unified Schema Structure** - Implementation details

## Implementation

**Files Changed** (Story 3.7.1):
- `packages/poem-app/src/services/schema/types.ts` - UnifiedSchema interface
- `packages/poem-app/src/services/schema/extractor.ts` - extractUnifiedSchema() method
- `packages/poem-app/src/services/schema/validator.ts` - validateUnified() method
- `packages/poem-app/src/pages/api/schema/extract.ts` - Return unified structure
- `packages/poem-app/src/pages/api/schema/validate.ts` - Accept unified structure
- `docs/architecture/data-models.md` - Updated Schema section
- 153 tests updated (100% passing)

**Quality Score**: 95/100 (QA approved with PASS gate)

## References

- **Original Design**: `data/youtube-launch-optimizer/workflow-architecture-concepts.md` (lines 25-67)
- **Initial Implementation**: `docs/stories/3.7.story.md` (dual-file approach - superseded)
- **Correction**: `docs/stories/3.7.1.story.md` (unified structure refactoring)
- **Refactoring Plan**: `~/.claude/plans/refactored-seeking-flamingo.md`
- **QA Gate**: `docs/qa/gates/3.7.1-refactor-to-unified-schema-structure.yml` (PASS)
- **Pattern**: `docs/kdd/patterns/unified-schema-structure.md`

---

**Last Updated**: 2026-01-16
**Author**: Dev Agent (Story 3.7.1)
**Approved By**: Quinn (QA Agent)
