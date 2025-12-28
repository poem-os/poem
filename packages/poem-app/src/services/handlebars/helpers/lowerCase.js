/**
 * Converts a string to lowercase
 * @param {string} str - String to convert
 * @returns {string} Lowercase string
 * @example {{lowerCase "HELLO"}} → "hello"
 */
function lowerCase(str) {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') return String(str).toLowerCase();
  if (str === '') return '';

  return str.toLowerCase();
}

// Metadata for API listing
lowerCase.description = 'Converts a string to lowercase';
lowerCase.example = '{{lowerCase "HELLO"}} → "hello"';

export default lowerCase;
