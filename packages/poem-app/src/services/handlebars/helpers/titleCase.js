/**
 * Converts a string to title case (capitalizes first letter of each word)
 * @param {string} str - String to convert
 * @returns {string} Title-cased string
 * @example {{titleCase "hello world"}} → "Hello World"
 */
function titleCase(str) {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') return String(str);
  if (str === '') return '';

  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Metadata for API listing
titleCase.description = 'Converts a string to title case (capitalizes first letter of each word)';
titleCase.example = '{{titleCase "hello world"}} → "Hello World"';

export default titleCase;
