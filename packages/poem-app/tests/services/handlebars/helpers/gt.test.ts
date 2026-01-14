import { describe, it, expect } from 'vitest';
import gt from '../../../../src/services/handlebars/helpers/gt.js';

describe('gt helper', () => {
  describe('numeric comparison', () => {
    it('should return true when a > b', () => {
      expect(gt(10, 5)).toBe(true);
      expect(gt(100, 50)).toBe(true);
      expect(gt(1, 0)).toBe(true);
    });

    it('should return false when a <= b', () => {
      expect(gt(5, 10)).toBe(false);
      expect(gt(5, 5)).toBe(false);
      expect(gt(0, 1)).toBe(false);
    });

    it('should handle negative numbers', () => {
      expect(gt(-5, -10)).toBe(true);
      expect(gt(-10, -5)).toBe(false);
      expect(gt(0, -5)).toBe(true);
    });

    it('should handle decimal numbers', () => {
      expect(gt(5.5, 5.4)).toBe(true);
      expect(gt(5.4, 5.5)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return false for null/undefined values', () => {
      expect(gt(null, 5)).toBe(false);
      expect(gt(5, null)).toBe(false);
      expect(gt(null, null)).toBe(false);
      expect(gt(undefined, 5)).toBe(false);
      expect(gt(5, undefined)).toBe(false);
      expect(gt(undefined, undefined)).toBe(false);
    });

    it('should return false for non-numeric types', () => {
      expect(gt('10', 5)).toBe(false);
      expect(gt(10, '5')).toBe(false);
      expect(gt('10', '5')).toBe(false);
      expect(gt({}, 5)).toBe(false);
      expect(gt([], 5)).toBe(false);
      expect(gt(true, 5)).toBe(false);
    });

    it('should handle zero', () => {
      expect(gt(1, 0)).toBe(true);
      expect(gt(0, 1)).toBe(false);
      expect(gt(0, 0)).toBe(false);
    });
  });

  describe('metadata', () => {
    it('should have description property', () => {
      expect(gt.description).toBeDefined();
      expect(typeof gt.description).toBe('string');
    });

    it('should have example property', () => {
      expect(gt.example).toBeDefined();
      expect(typeof gt.example).toBe('string');
    });
  });
});
