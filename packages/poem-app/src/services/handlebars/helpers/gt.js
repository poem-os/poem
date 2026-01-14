/**
 * Greater than comparison helper for Handlebars conditionals
 * @param {*} a - First value to compare
 * @param {*} b - Second value to compare
 * @returns {boolean} True if a > b, false otherwise
 * @example {{#if (gt chapters.length 20)}}...{{/if}}
 */
function gt(a, b) {
  // Handle null/undefined
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }

  // Handle non-numeric types
  if (typeof a !== 'number' || typeof b !== 'number') {
    return false;
  }

  return a > b;
}

// Metadata for API listing
gt.description = 'Greater than comparison for Handlebars conditionals';
gt.example = '{{#if (gt count 10)}}...{{/if}}';

export default gt;
