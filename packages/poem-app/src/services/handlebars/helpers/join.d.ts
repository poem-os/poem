/**
 * Joins array elements with specified separator
 * @param array - Array to join
 * @param separator - Separator string (default: ", ")
 * @returns Joined string
 */
declare function join(array: any, separator?: string): string;

declare namespace join {
  export const description: string;
  export const example: string;
}

export default join;
