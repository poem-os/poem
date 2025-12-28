/**
 * Formats a date using a format string
 * Supported tokens: YYYY (year), MM (month), DD (day), HH (hour 24h), mm (minutes), ss (seconds)
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @param {string} format - Format string (e.g., "YYYY-MM-DD")
 * @returns {string} Formatted date string
 * @example {{dateFormat date "YYYY-MM-DD"}} → "2025-12-28"
 */
function dateFormat(date, format) {
  // Handle missing or invalid date
  if (date === null || date === undefined) return '';

  // Parse the date
  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    return '';
  }

  // Check for invalid date
  if (isNaN(dateObj.getTime())) return '';

  // Default format if not provided
  if (typeof format !== 'string' || format === '') {
    format = 'YYYY-MM-DD';
  }

  // Pad number with leading zeros
  const pad = (num, size) => String(num).padStart(size, '0');

  // Extract date components
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // 0-indexed
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  // Replace tokens in format string
  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, pad(month, 2))
    .replace(/DD/g, pad(day, 2))
    .replace(/HH/g, pad(hours, 2))
    .replace(/mm/g, pad(minutes, 2))
    .replace(/ss/g, pad(seconds, 2));
}

// Metadata for API listing
dateFormat.description = 'Formats a date using a format string (YYYY, MM, DD, HH, mm, ss)';
dateFormat.example = '{{dateFormat date "YYYY-MM-DD"}} → "2025-12-28"';

export default dateFormat;
