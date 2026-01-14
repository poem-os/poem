/**
 * Joins array elements with specified separator
 * @param {Array} array - Array to join
 * @param {string} separator - Separator string (default: ", ")
 * @returns {string} Joined string
 * @example {{join keywords ", "}} → "keyword1, keyword2"
 */
function join(array, separator) {
  // Handle null/undefined
  if (array === null || array === undefined) return '';

  // Handle non-array types
  if (!Array.isArray(array)) return '';

  // Handle empty arrays
  if (array.length === 0) return '';

  // Default separator
  if (typeof separator !== 'string') {
    separator = ', ';
  }

  // Join array elements
  return array.join(separator);
}

// Metadata for API listing
join.description = 'Joins array elements with specified separator';
join.example = '{{join keywords ", "}} → "keyword1, keyword2"';

export default join;
