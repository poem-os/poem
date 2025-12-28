# Handlebars Helpers

Custom helper functions for Handlebars templates.

## Adding a New Helper

Create a JavaScript file in this directory with the helper function as the default export:

```javascript
/**
 * Converts a string to title case
 * @param {string} str - String to convert
 * @returns {string} Title-cased string
 * @example {{titleCase "hello world"}} → "Hello World"
 */
module.exports = function (str) {
  if (typeof str !== 'string') return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Optional: Export metadata for helper listing
module.exports.description = 'Converts a string to title case';
module.exports.example = '{{titleCase "hello world"}} → "Hello World"';
```

## Helper Guidelines

1. **Handle edge cases gracefully** - Never throw errors, return empty string or original value
2. **Include JSDoc** - Document parameters, return type, and usage example
3. **Use CommonJS exports** - Use `module.exports = function(...)`
4. **Export metadata** - Add `.description` and `.example` for API listing

## File Naming

- Use **camelCase** for filenames: `titleCase.js`, `formatTimestamp.js`
- Files starting with `_` are ignored (e.g., `_utils.js`)

## Available Helpers

Helpers are automatically loaded on server startup. Check `/api/helpers` for the current list.
