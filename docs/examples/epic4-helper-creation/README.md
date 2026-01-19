# Example: Creating a New Handlebars Helper

**Pattern**: [Handlebars Helper Module Pattern](../../kdd/patterns/4-handlebars-helper-module-pattern.md)
**ADR**: [ADR-007: ESM Helpers with Hot-Reload](../../kdd/decisions/adr-007-esm-helpers-hot-reload.md)
**Story**: Story 4.4

## Purpose

Demonstrates creating a new custom Handlebars helper with metadata exports, type declarations, and hot-reload support.

## Step-by-Step Usage

### 1. Create Helper File

**File**: `packages/poem-app/src/services/handlebars/helpers/titleCase.js`

```javascript
/**
 * Converts string to title case (capitalize each word)
 * @param {string} str - String to convert
 * @returns {string} Title cased string
 * @example {{titleCase "hello world"}} → "Hello World"
 */
function titleCase(str) {
  // Defensive: handle null/undefined/wrong types
  if (typeof str !== 'string') return '';
  if (str.length === 0) return '';

  // Convert to title case
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ✅ Metadata for API discovery
titleCase.description = "Converts string to title case (capitalize each word)";
titleCase.example = '{{titleCase "hello world"}} → "Hello World"';

// ✅ ESM export (required for Vite auto-loading)
export default titleCase;
```

### 2. Create TypeScript Declaration

**File**: `packages/poem-app/src/services/handlebars/helpers/titleCase.d.ts`

```typescript
/**
 * Converts string to title case (capitalize each word)
 */
declare function titleCase(str: string): string;

/** Helper description for API listing */
export const description: string;

/** Usage example for documentation */
export const example: string;

export default titleCase;
```

### 3. Verify Auto-Loading (Hot-Reload)

**Watch console output**:
```
[Hot Reload] Helper added: titleCase.js
[Handlebars] Registered helper: titleCase
```

Helper is immediately available in templates - no server restart required!

### 4. Use Helper in Template

**File**: `dev-workspace/workflows/demo/prompts/format-name.hbs`

```handlebars
Welcome, {{titleCase userName}}!

Your recent videos:
{{#each videos}}
  - {{titleCase title}}
{{/each}}
```

**Test via API**:
```bash
curl -X POST http://localhost:4321/api/prompt/render \
  -H "Content-Type: application/json" \
  -d '{
    "template": "Welcome, {{titleCase userName}}!",
    "data": {"userName": "john doe"},
    "isRawTemplate": true
  }'
```

**Output**: `"Welcome, John Doe!"`

### 5. Verify API Discovery

```bash
curl http://localhost:4321/api/helpers
```

**Response includes**:
```json
{
  "helpers": [
    {
      "name": "titleCase",
      "description": "Converts string to title case (capitalize each word)",
      "example": "{{titleCase \"hello world\"}} → \"Hello World\""
    }
    // ... other helpers
  ]
}
```

## Key Concepts

**Auto-Loading**: `import.meta.glob` discovers helper automatically. No manual registration needed.

**Hot-Reload**: Edit helper → File watcher detects change → Helper reloaded → Logs to console → Templates instantly use new logic.

**Metadata Exports**: Function properties (`helper.description`, `helper.example`) enable API discovery for agents.

**Graceful Degradation**: Helper returns `''` for invalid input (not `throw Error`). Templates continue rendering.

## Real-World Usage ⭐

- **VibeDeck Application**: Not yet tested
- **Production Status**: Pattern validated with 4 helpers (gt, truncate, join, formatTimestamp)
- **Edge Cases Found**: None - pattern is straightforward

## Epic 3 Pattern Reuse ⭐

- **Extended**: Helpers existed in Epic 3, Epic 4 formalized ESM + metadata pattern

## Related Patterns

- [Handlebars Helper Module Pattern](../../kdd/patterns/4-handlebars-helper-module-pattern.md)
- [API-First Heavy Operations](../../kdd/patterns/api-first-heavy-operations.md) (Epic 3)

## References

- Story: `docs/stories/4.4.story.md`
- Helpers: `packages/poem-app/src/services/handlebars/helpers/`
- Loader: `packages/poem-app/src/services/handlebars/loader.ts`
- Watcher: `packages/poem-app/src/services/handlebars/watcher.ts`
- Tests: 146/146 passing

---

**Created**: 2026-01-19
**Source**: Epic 4 KDD Retrospective
