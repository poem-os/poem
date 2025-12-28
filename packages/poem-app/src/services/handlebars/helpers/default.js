/**
 * Returns the value if it's not empty, otherwise returns the fallback
 * Empty values: null, undefined, empty string ""
 * Preserved values: 0 (zero), false (boolean) - these are valid values, not empty
 * @param {*} value - Value to check
 * @param {*} fallback - Fallback value if empty
 * @returns {*} Value or fallback
 * @example {{default title "Untitled"}} → "Untitled" (if title is empty)
 */
function defaultHelper(value, fallback) {
  // Only use fallback for: null, undefined, empty string
  // Preserve 0 and false as valid values
  if (value === null || value === undefined || value === '') {
    return fallback !== undefined ? fallback : '';
  }
  return value;
}

// Metadata for API listing
defaultHelper.description = 'Returns value or fallback if empty (null, undefined, or empty string)';
defaultHelper.example = '{{default title "Untitled"}} → "Untitled" (if title is empty)';

export default defaultHelper;
