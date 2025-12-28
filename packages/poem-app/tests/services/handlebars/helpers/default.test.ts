import { describe, it, expect, beforeEach } from 'vitest';
import { HandlebarsService } from '../../../../src/services/handlebars/index.js';
import defaultHelper from '../../../../src/services/handlebars/helpers/default.js';

describe('default helper', () => {
  let service: HandlebarsService;

  beforeEach(() => {
    service = new HandlebarsService();
    service.registerHelper('default', defaultHelper, {
      description: defaultHelper.description,
      example: defaultHelper.example,
    });
  });

  describe('basic functionality', () => {
    it('should return value when it exists', () => {
      const result = service.render('{{default title "Untitled"}}', { title: 'My Title' });
      expect(result).toBe('My Title');
    });

    it('should return fallback for null', () => {
      const result = service.render('{{default title "Untitled"}}', { title: null });
      expect(result).toBe('Untitled');
    });

    it('should return fallback for undefined', () => {
      const result = service.render('{{default title "Untitled"}}', { title: undefined });
      expect(result).toBe('Untitled');
    });

    it('should return fallback for empty string', () => {
      const result = service.render('{{default title "Untitled"}}', { title: '' });
      expect(result).toBe('Untitled');
    });
  });

  describe('falsy value preservation', () => {
    it('should preserve 0 (zero)', () => {
      const result = service.render('{{default count "N/A"}}', { count: 0 });
      expect(result).toBe('0');
    });

    it('should preserve false (boolean)', () => {
      const result = service.render('{{default enabled "N/A"}}', { enabled: false });
      expect(result).toBe('false');
    });
  });

  describe('various value types', () => {
    it('should return number value', () => {
      const result = service.render('{{default count "N/A"}}', { count: 42 });
      expect(result).toBe('42');
    });

    it('should return true boolean', () => {
      const result = service.render('{{default enabled "N/A"}}', { enabled: true });
      expect(result).toBe('true');
    });

    it('should handle missing property', () => {
      const result = service.render('{{default missing "fallback"}}', {});
      expect(result).toBe('fallback');
    });
  });

  describe('fallback edge cases', () => {
    it('should handle number as fallback', () => {
      const result = service.render('{{default value 0}}', { value: null });
      expect(result).toBe('0');
    });

    it('should return empty string when no fallback provided', () => {
      expect(defaultHelper(null, undefined)).toBe('');
    });

    it('should return empty string when fallback is undefined', () => {
      expect(defaultHelper(undefined, undefined)).toBe('');
    });
  });

  describe('direct function calls', () => {
    it('should return value when called directly with valid value', () => {
      expect(defaultHelper('value', 'fallback')).toBe('value');
    });

    it('should return fallback for null', () => {
      expect(defaultHelper(null, 'fallback')).toBe('fallback');
    });

    it('should return fallback for undefined', () => {
      expect(defaultHelper(undefined, 'fallback')).toBe('fallback');
    });

    it('should return fallback for empty string', () => {
      expect(defaultHelper('', 'fallback')).toBe('fallback');
    });

    it('should preserve 0', () => {
      expect(defaultHelper(0, 'fallback')).toBe(0);
    });

    it('should preserve false', () => {
      expect(defaultHelper(false, 'fallback')).toBe(false);
    });
  });

  describe('metadata', () => {
    it('should have description', () => {
      expect(defaultHelper.description).toBeDefined();
      expect(typeof defaultHelper.description).toBe('string');
    });

    it('should have example', () => {
      expect(defaultHelper.example).toBeDefined();
      expect(typeof defaultHelper.example).toBe('string');
    });
  });
});
