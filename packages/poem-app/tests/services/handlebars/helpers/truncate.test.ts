import { describe, it, expect } from 'vitest';
import truncate from '../../../../src/services/handlebars/helpers/truncate.js';

describe('truncate helper', () => {
  describe('truncation logic', () => {
    it('should truncate long strings with ellipsis', () => {
      const result = truncate('This is a very long string that needs truncation', 10);
      expect(result).toBe('This is...');
      expect(result.length).toBe(10);
    });

    it('should handle exact length', () => {
      const result = truncate('Exactly ten!', 12);
      expect(result).toBe('Exactly ten!');
    });

    it('should not truncate strings shorter than limit', () => {
      expect(truncate('Short', 10)).toBe('Short');
      expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('should handle length exactly at boundary', () => {
      expect(truncate('1234567890', 10)).toBe('1234567890');
      expect(truncate('12345678901', 10)).toBe('1234567...');
    });
  });

  describe('edge cases', () => {
    it('should return empty string for null/undefined', () => {
      expect(truncate(null, 10)).toBe('');
      expect(truncate(undefined, 10)).toBe('');
    });

    it('should return empty string for non-string types', () => {
      expect(truncate(123, 10)).toBe('');
      expect(truncate({}, 10)).toBe('');
      expect(truncate([], 10)).toBe('');
      expect(truncate(true, 10)).toBe('');
    });

    it('should handle invalid length parameter', () => {
      expect(truncate('test string', null)).toBe('test string');
      expect(truncate('test string', undefined)).toBe('test string');
      expect(truncate('test string', 'invalid')).toBe('test string');
      expect(truncate('test string', 0)).toBe('test string');
      expect(truncate('test string', -5)).toBe('test string');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });

    it('should handle very short truncation lengths', () => {
      // When length < 4, truncation wouldn't save space, so return original
      expect(truncate('test', 3)).toBe('test');
      expect(truncate('test string', 3)).toBe('test string');
      // Length >= 4 allows proper truncation
      expect(truncate('test string', 4)).toBe('t...');
    });
  });

  describe('metadata', () => {
    it('should have description property', () => {
      expect(truncate.description).toBeDefined();
      expect(typeof truncate.description).toBe('string');
    });

    it('should have example property', () => {
      expect(truncate.example).toBeDefined();
      expect(typeof truncate.example).toBe('string');
    });
  });
});
