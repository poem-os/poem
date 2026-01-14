/**
 * Greater than comparison helper for Handlebars conditionals
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if a > b, false otherwise
 */
declare function gt(a: any, b: any): boolean;

declare namespace gt {
  export const description: string;
  export const example: string;
}

export default gt;
