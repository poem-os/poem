/**
 * Formats seconds as MM:SS timestamp
 * @param {number} seconds - Number of seconds
 * @returns {string} Formatted timestamp (MM:SS)
 * @example {{formatTimestamp 125}} → "02:05"
 */
function formatTimestamp(seconds) {
  // Handle null/undefined
  if (seconds === null || seconds === undefined) return '00:00';

  // Handle non-numeric types
  if (typeof seconds !== 'number') return '00:00';

  // Handle negative numbers
  if (seconds < 0) return '00:00';

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Pad with leading zeros
  const pad = (num) => String(num).padStart(2, '0');

  return `${pad(minutes)}:${pad(remainingSeconds)}`;
}

// Metadata for API listing
formatTimestamp.description = 'Formats seconds as MM:SS timestamp';
formatTimestamp.example = '{{formatTimestamp 125}} → "02:05"';

export default formatTimestamp;
