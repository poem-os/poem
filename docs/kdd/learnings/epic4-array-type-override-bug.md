# Learning: Array Type Override in Mock Data Generation

**Date**: 2026-01-13
**Source**: Story 4.3 (Generate Mock Workflow Data)
**Category**: Edge Cases / Type Safety

## Context

Implementing YouTube-specific mock data generators for realistic content generation (video titles, chapters with timestamps, keyword arrays).

## Challenge

Pattern-based field detection (e.g., field name contains "chapter") was overriding array types during mock generation.

**Bug manifestation**:
```json
// Schema defines:
{
  "name": "chapters",
  "type": "array",
  "items": { "type": "string" }
}

// Generator produced:
{
  "chapters": "00:00 Introduction\n02:15 Main Topic"  // ❌ String, not array!
}

// Expected:
{
  "chapters": [
    "00:00 Introduction",
    "02:15 Main Topic"
  ]  // ✅ Array of strings
}
```

**Root cause**: `field-detector.ts` matched `chapters` pattern and called `generateChapters()` without checking if field type was `array` vs `string`. YouTube generator returned single string with newlines instead of array of strings.

## Solution

**Fix**: Check field type **before** applying pattern generators.

```typescript
// ✅ BEFORE: Pattern detection logic
function generateFieldValue(field: SchemaField): unknown {
  // 1. Check type FIRST
  if (field.type === 'array') {
    return generateArrayField(field);  // Delegate to array handler
  }

  // 2. THEN apply pattern detection (for non-array types)
  const pattern = detectPattern(field.name);
  if (pattern) {
    return pattern.generator(field);
  }

  // 3. Fallback to type-based generation
  return generateByType(field.type);
}

// Array handler respects items type
function generateArrayField(field: SchemaField): unknown[] {
  const count = getArrayItemCount(field.name);  // YouTube-specific: chapters → 5

  // Generate array items
  return Array.from({ length: count }, () => {
    // ✅ Recursively generate item using field.items schema
    return generateFieldValue(field.items!);
  });
}
```

**Key insight**: Type hierarchy > Pattern detection. Type is schema contract, pattern is content hint.

## Outcome

**After fix**:
- All 61 mock-generator tests passing
- `chapters` field correctly generates array of 5 timestamped strings
- Similar fields (`videoKeywords`, `titleCandidates`) also fixed
- Type safety preserved while maintaining domain-specific realism

**Validation**: Generated 68-field YouTube workflow data with zero type mismatches.

## Prevention with Epic 3 Knowledge ⭐

- **Was this avoidable?**: Yes
- **Epic 3 Learning Missed**: N/A (mock generation new in Epic 4)
- **Root Cause**: Insufficient understanding of schema type precedence during initial implementation

**Prevention strategy**: Test schema-type boundary cases (array fields with pattern-matching names) during initial implementation, not after integration.

## Discovery Mode Status ⭐

- **Triggered?**: No
- **Architecture Docs Read**: Limited (data-models.md for SchemaField structure)
- **Should Have Triggered?**: No - bug discovered through unit testing, not architecture mismatch

## Future Application

**When writing field generators**:

1. ✅ **DO**: Check `field.type` before applying pattern detection
2. ✅ **DO**: Write tests for array fields with pattern-matching names (edge case coverage)
3. ✅ **DO**: Respect schema contracts (type > pattern > content)
4. ❌ **DON'T**: Assume pattern generators return correct types
5. ❌ **DON'T**: Skip edge case testing (array + pattern collision)

**Test pattern**:
```typescript
it('should generate array even when field name matches pattern', () => {
  const field = {
    name: 'chapters',  // Matches pattern
    type: 'array',     // But schema says array!
    items: { type: 'string' }
  };

  const result = generateFieldValue(field);

  expect(Array.isArray(result)).toBe(true);  // ✅ Type wins
  expect(result.length).toBeGreaterThan(0);
});
```

## Related Knowledge

- **Pattern**: [Schema-Based Mock Data Generation](../patterns/4-schema-based-mock-data-generation.md)
- **ADR**: [ADR-005: Mock Data Generation with Faker.js](../decisions/adr-005-mock-data-generation-fakerjs.md)
- **Story**: `docs/stories/4.3.story.md` (Generate Mock Workflow Data)

---

**Learning Captured**: 2026-01-13
**Impact**: Medium (affected 3 fields, caught by tests before production)
**Last Updated**: 2026-01-19
