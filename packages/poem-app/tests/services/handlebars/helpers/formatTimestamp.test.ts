import { describe, it, expect } from 'vitest';
import formatTimestamp from '../../../../src/services/handlebars/helpers/formatTimestamp.js';

describe('formatTimestamp helper', () => {
  describe('MM:SS formatting', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTimestamp(125)).toBe('02:05');
      expect(formatTimestamp(65)).toBe('01:05');
      expect(formatTimestamp(3665)).toBe('61:05');
    });

    it('should pad single digits with leading zeros', () => {
      expect(formatTimestamp(5)).toBe('00:05');
      expect(formatTimestamp(59)).toBe('00:59');
      expect(formatTimestamp(60)).toBe('01:00');
      expect(formatTimestamp(65)).toBe('01:05');
    });

    it('should handle zero', () => {
      expect(formatTimestamp(0)).toBe('00:00');
    });

    it('should handle large numbers', () => {
      expect(formatTimestamp(3599)).toBe('59:59');
      expect(formatTimestamp(3600)).toBe('60:00');
      expect(formatTimestamp(7200)).toBe('120:00');
    });

    it('should handle decimal seconds by flooring', () => {
      expect(formatTimestamp(125.9)).toBe('02:05');
      expect(formatTimestamp(65.1)).toBe('01:05');
    });
  });

  describe('edge cases', () => {
    it('should return 00:00 for null/undefined', () => {
      expect(formatTimestamp(null)).toBe('00:00');
      expect(formatTimestamp(undefined)).toBe('00:00');
    });

    it('should return 00:00 for non-numeric types', () => {
      expect(formatTimestamp('125')).toBe('00:00');
      expect(formatTimestamp({})).toBe('00:00');
      expect(formatTimestamp([])).toBe('00:00');
      expect(formatTimestamp(true)).toBe('00:00');
    });

    it('should return 00:00 for negative numbers', () => {
      expect(formatTimestamp(-125)).toBe('00:00');
      expect(formatTimestamp(-1)).toBe('00:00');
    });
  });

  describe('metadata', () => {
    it('should have description property', () => {
      expect(formatTimestamp.description).toBeDefined();
      expect(typeof formatTimestamp.description).toBe('string');
    });

    it('should have example property', () => {
      expect(formatTimestamp.example).toBeDefined();
      expect(typeof formatTimestamp.example).toBe('string');
    });
  });
});
