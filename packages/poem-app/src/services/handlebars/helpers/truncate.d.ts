/**
 * Truncates a string to specified length with ellipsis
 * @param str - String to truncate
 * @param length - Maximum length
 * @returns Truncated string
 */
declare function truncate(str: any, length: number): string;

declare namespace truncate {
  export const description: string;
  export const example: string;
}

export default truncate;
