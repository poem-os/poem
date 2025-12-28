/**
 * Converts a string to uppercase
 * @param {string} str - String to convert
 * @returns {string} Uppercase string
 * @example {{upperCase "hello"}} → "HELLO"
 */
function upperCase(str) {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') return String(str).toUpperCase();
  if (str === '') return '';

  return str.toUpperCase();
}

// Metadata for API listing
upperCase.description = 'Converts a string to uppercase';
upperCase.example = '{{upperCase "hello"}} → "HELLO"';

export default upperCase;
