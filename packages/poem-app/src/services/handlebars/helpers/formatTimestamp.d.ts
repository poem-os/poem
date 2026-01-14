/**
 * Formats seconds as MM:SS timestamp
 * @param seconds - Number of seconds
 * @returns Formatted timestamp (MM:SS)
 */
declare function formatTimestamp(seconds: any): string;

declare namespace formatTimestamp {
  export const description: string;
  export const example: string;
}

export default formatTimestamp;
