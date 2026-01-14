import { describe, it, expect } from 'vitest';
import join from '../../../../src/services/handlebars/helpers/join.js';

describe('join helper', () => {
  describe('array joining', () => {
    it('should join array elements with specified separator', () => {
      expect(join(['keyword1', 'keyword2', 'keyword3'], ', ')).toBe('keyword1, keyword2, keyword3');
      expect(join(['a', 'b', 'c'], '-')).toBe('a-b-c');
      expect(join(['one', 'two'], ' | ')).toBe('one | two');
    });

    it('should use default separator when not provided', () => {
      expect(join(['a', 'b', 'c'])).toBe('a, b, c');
      expect(join(['keyword1', 'keyword2'])).toBe('keyword1, keyword2');
    });

    it('should handle single element arrays', () => {
      expect(join(['single'], ', ')).toBe('single');
      expect(join(['single'])).toBe('single');
    });

    it('should handle arrays with numbers', () => {
      expect(join([1, 2, 3], ', ')).toBe('1, 2, 3');
    });

    it('should handle arrays with mixed types', () => {
      expect(join(['a', 1, true], ', ')).toBe('a, 1, true');
    });
  });

  describe('edge cases', () => {
    it('should return empty string for null/undefined', () => {
      expect(join(null, ', ')).toBe('');
      expect(join(undefined, ', ')).toBe('');
    });

    it('should return empty string for non-array types', () => {
      expect(join('not an array', ', ')).toBe('');
      expect(join(123, ', ')).toBe('');
      expect(join({}, ', ')).toBe('');
      expect(join(true, ', ')).toBe('');
    });

    it('should return empty string for empty arrays', () => {
      expect(join([], ', ')).toBe('');
      expect(join([])).toBe('');
    });

    it('should handle invalid separator parameter', () => {
      expect(join(['a', 'b', 'c'], null)).toBe('a, b, c');
      expect(join(['a', 'b', 'c'], undefined)).toBe('a, b, c');
      expect(join(['a', 'b', 'c'], 123)).toBe('a, b, c');
    });

    it('should handle empty string separator', () => {
      expect(join(['a', 'b', 'c'], '')).toBe('abc');
    });

    it('should handle arrays with empty strings', () => {
      expect(join(['', 'a', ''], ', ')).toBe(', a, ');
    });
  });

  describe('metadata', () => {
    it('should have description property', () => {
      expect(join.description).toBeDefined();
      expect(typeof join.description).toBe('string');
    });

    it('should have example property', () => {
      expect(join.example).toBeDefined();
      expect(typeof join.example).toBe('string');
    });
  });
});
