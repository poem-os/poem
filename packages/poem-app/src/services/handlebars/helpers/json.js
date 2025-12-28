import Handlebars from 'handlebars';

/**
 * Converts an object to a formatted JSON string for debugging
 * Handles circular references gracefully
 * Returns a SafeString to prevent HTML escaping
 * @param {*} obj - Object to stringify
 * @returns {Handlebars.SafeString} Formatted JSON string
 * @example {{json user}} → "{\n  \"name\": \"John\"\n}"
 */
function json(obj) {
  if (obj === null) return new Handlebars.SafeString('null');
  if (obj === undefined) return new Handlebars.SafeString('undefined');

  try {
    // Handle circular references
    const seen = new WeakSet();
    const result = JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular Reference]';
          }
          seen.add(value);
        }
        return value;
      },
      2
    );
    return new Handlebars.SafeString(result);
  } catch {
    // Fallback for any other stringify errors
    return new Handlebars.SafeString('[Error: Unable to stringify object]');
  }
}

// Metadata for API listing
json.description = 'Converts an object to formatted JSON string for debugging';
json.example = '{{json user}} → "{\\n  \\"name\\": \\"John\\"\\n}"';

export default json;
