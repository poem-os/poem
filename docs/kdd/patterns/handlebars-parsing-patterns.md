# Handlebars Parsing Patterns

**Source**: Story 2.6 - Schema Extraction API
**Created**: 2025-12-30

## Overview

When parsing Handlebars templates to extract schema information, certain patterns require special handling to avoid false positives.

## Pattern 1: Filter Non-Field References

Not everything inside `{{ }}` is a data field. These must be filtered out:

### Block Variables (@ prefix)

```handlebars
{{#each items}}
  {{@index}}    <!-- NOT a field - loop index -->
  {{@first}}    <!-- NOT a field - first iteration flag -->
  {{@last}}     <!-- NOT a field - last iteration flag -->
  {{@key}}      <!-- NOT a field - object key in each -->
{{/each}}
```

### Context References

```handlebars
{{#each items}}
  {{this}}        <!-- NOT a field - current item reference -->
  {{this.name}}   <!-- NOT a field - property of current item -->
  {{./name}}      <!-- NOT a field - relative path -->
{{/each}}
```

### Implementation

```typescript
private isFieldReference(str: string): boolean {
  // Skip string literals
  if (str.startsWith('"') || str.startsWith("'")) return false;
  // Skip numbers
  if (/^\d+$/.test(str)) return false;
  // Skip boolean literals
  if (str === 'true' || str === 'false') return false;
  // Skip @index, @first, @last (each block variables)
  if (str.startsWith('@')) return false;
  // Skip this and this.* inside each blocks
  if (str === 'this' || str.startsWith('this.')) return false;

  return true;
}
```

**Bug encountered**: Initially `{{this}}` and `@index` were being extracted as fields, causing 3 test failures. The fix was adding the `isFieldReference()` check before calling `addFieldPath()`.

## Pattern 2: Helper vs Field Detection

Distinguishing between helper calls and field references:

```handlebars
{{truncate title 50}}   <!-- truncate = helper, title = field, 50 = literal -->
{{userName}}            <!-- userName = field (single token, no arguments) -->
{{user.name}}           <!-- user.name = nested field path -->
```

### Detection Logic

```typescript
private looksLikeHelper(str: string): boolean {
  // Helpers: lowercase start, no dots, followed by arguments
  return /^[a-z][a-zA-Z0-9]*$/.test(str) && !str.includes('.');
}
```

When `parts.length > 1` and first part looks like a helper:
- First part → helper name
- Remaining parts → extract fields (skip literals)

## Pattern 3: Built-in Helpers

These are Handlebars built-ins and should NOT be reported as required helpers:

```typescript
const BUILTIN_HELPERS = new Set([
  'if', 'unless', 'each', 'with', 'lookup', 'log'
]);
```

## Pattern 4: Subexpressions

Helpers can appear in subexpressions within block helpers:

```handlebars
{{#if (gt length 20)}}  <!-- gt = helper, length = field -->
  Too long!
{{/if}}
```

Parse the subexpression `(helperName arg1 arg2)` separately to extract both the helper and field arguments.

## Pattern 5: Array Type Inference

Multiple patterns indicate a field is an array:

```handlebars
{{#each items}}...{{/each}}  <!-- items = array -->
{{items.[0]}}                 <!-- items = array (bracket index) -->
{{items.0.name}}              <!-- items = array (numeric index) -->
```

## Pattern 6: Boolean Type Inference

Fields used in `#if` conditions are typically boolean:

```handlebars
{{#if isActive}}...{{/if}}   <!-- isActive = boolean -->
```

Note: This is a heuristic. The field could also be truthy/falsy of any type.

---

## Related Files

- `packages/poem-app/src/services/schema/extractor.ts` - Implementation
- `packages/poem-app/tests/services/schema/extractor.test.ts` - Test cases

## Future Considerations

These patterns apply to both:
1. **Development**: Building schema extraction features
2. **User guidance**: Authoring templates that extract cleanly

When creating user documentation, adapt these patterns for template authors rather than code implementers.
