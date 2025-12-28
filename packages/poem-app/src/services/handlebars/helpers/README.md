# Handlebars Helpers

Custom helper functions for Handlebars templates.

## Available Helpers

### titleCase

Converts a string to title case (capitalizes first letter of each word).

```handlebars
{{titleCase "hello world"}} → "Hello World"
{{titleCase "THE QUICK BROWN FOX"}} → "The Quick Brown Fox"
```

**Edge cases:** Returns empty string for null/undefined, converts non-strings to string first.

### upperCase

Converts a string to uppercase.

```handlebars
{{upperCase "hello"}} → "HELLO"
{{upperCase "Hello World"}} → "HELLO WORLD"
```

**Edge cases:** Returns empty string for null/undefined, converts non-strings to string first.

### lowerCase

Converts a string to lowercase.

```handlebars
{{lowerCase "HELLO"}} → "hello"
{{lowerCase "Hello World"}} → "hello world"
```

**Edge cases:** Returns empty string for null/undefined, converts non-strings to string first.

### dateFormat

Formats a date using a format string with tokens.

**Supported tokens:**
- `YYYY` - 4-digit year (2025)
- `MM` - 2-digit month (01-12)
- `DD` - 2-digit day (01-31)
- `HH` - 2-digit hour 24h (00-23)
- `mm` - 2-digit minutes (00-59)
- `ss` - 2-digit seconds (00-59)

```handlebars
{{dateFormat date "YYYY-MM-DD"}} → "2025-12-28"
{{dateFormat date "MM/DD/YYYY"}} → "12/28/2025"
{{dateFormat date "YYYY-MM-DD HH:mm:ss"}} → "2025-12-28 14:30:00"
```

**Accepts:** Date objects, ISO strings, or timestamps.

**Edge cases:** Returns empty string for null/undefined/invalid dates. Defaults to "YYYY-MM-DD" if no format provided.

### default

Returns the value if it's not empty, otherwise returns the fallback.

**Empty values (trigger fallback):** `null`, `undefined`, `""` (empty string)

**Preserved values (NOT empty):** `0` (zero), `false` (boolean)

```handlebars
{{default title "Untitled"}} → "Untitled" (if title is null/undefined/"")
{{default count 0}} → uses actual count value (0 is preserved)
{{default enabled false}} → uses actual enabled value (false is preserved)
```

### json

Converts an object to a formatted JSON string for debugging.

```handlebars
{{json user}}
→ {
    "name": "John",
    "age": 30
  }
```

**Edge cases:** Returns "null" for null, "undefined" for undefined. Handles circular references by replacing them with `[Circular Reference]`.

---

## Adding a New Helper

Create a JavaScript file in this directory with the helper function as the default export:

> **Note:** Helpers use ESM (`export default`) for Vite compatibility. The loader uses `import.meta.glob` which requires ESM modules. Each `.js` helper requires a corresponding `.d.ts` file for TypeScript support.

```javascript
/**
 * Converts a string to title case
 * @param {string} str - String to convert
 * @returns {string} Title-cased string
 * @example {{titleCase "hello world"}} → "Hello World"
 */
function titleCase(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Export metadata for helper listing
titleCase.description = 'Converts a string to title case';
titleCase.example = '{{titleCase "hello world"}} → "Hello World"';

export default titleCase;
```

Also create a matching TypeScript declaration file (`titleCase.d.ts`):

```typescript
interface TitleCaseHelper {
  (str: unknown): string;
  description: string;
  example: string;
}
declare const titleCase: TitleCaseHelper;
export default titleCase;
```

## Helper Guidelines

1. **Handle edge cases gracefully** - Never throw errors, return empty string or original value
2. **Include JSDoc** - Document parameters, return type, and usage example
3. **Use ESM exports** - Use `export default` (required for Vite compatibility)
4. **Export metadata** - Add `.description` and `.example` for API listing
5. **Create `.d.ts` file** - Add TypeScript declaration file for type safety in tests

## File Naming

- Use **camelCase** for filenames: `titleCase.js`, `formatTimestamp.js`
- Files starting with `_` are ignored (e.g., `_utils.js`)

## Runtime Loading

Helpers are automatically loaded on server startup. Check `/api/health` for the `helpersLoaded` count.
