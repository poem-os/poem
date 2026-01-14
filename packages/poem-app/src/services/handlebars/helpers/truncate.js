/**
 * Truncates a string to specified length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 * @example {{truncate title 49}} → "First 49 characters..."
 */
function truncate(str, length) {
  // Handle null/undefined
  if (str === null || str === undefined) return '';

  // Handle non-string types
  if (typeof str !== 'string') return '';

  // Handle invalid length
  if (typeof length !== 'number' || length <= 0) return str;

  // If string is shorter than or equal to length, return as-is
  if (str.length <= length) return str;

  // If truncation wouldn't save space (length too short for ellipsis), return original
  if (length < 4) return str;

  // Truncate with ellipsis
  return str.slice(0, length - 3) + '...';
}

// Metadata for API listing
truncate.description = 'Truncates a string to specified length with ellipsis';
truncate.example = '{{truncate title 49}} → "First 49 characters..."';

export default truncate;
