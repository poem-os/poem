import { describe, it, expect, beforeEach } from 'vitest';
import { HandlebarsService } from '../../../../src/services/handlebars/index.js';
import titleCase from '../../../../src/services/handlebars/helpers/titleCase.js';

describe('titleCase helper', () => {
  let service: HandlebarsService;

  beforeEach(() => {
    service = new HandlebarsService();
    service.registerHelper('titleCase', titleCase, {
      description: titleCase.description,
      example: titleCase.example,
    });
  });

  describe('basic functionality', () => {
    it('should convert "hello world" to "Hello World"', () => {
      const result = service.render('{{titleCase text}}', { text: 'hello world' });
      expect(result).toBe('Hello World');
    });

    it('should convert all caps to title case', () => {
      const result = service.render('{{titleCase text}}', { text: 'THE QUICK BROWN FOX' });
      expect(result).toBe('The Quick Brown Fox');
    });

    it('should handle mixed case', () => {
      const result = service.render('{{titleCase text}}', { text: 'tHe QuIcK bRoWn FoX' });
      expect(result).toBe('The Quick Brown Fox');
    });

    it('should handle single word', () => {
      const result = service.render('{{titleCase text}}', { text: 'hello' });
      expect(result).toBe('Hello');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = service.render('{{titleCase text}}', { text: '' });
      expect(result).toBe('');
    });

    it('should handle null', () => {
      const result = service.render('{{titleCase text}}', { text: null });
      expect(result).toBe('');
    });

    it('should handle undefined', () => {
      const result = service.render('{{titleCase text}}', { text: undefined });
      expect(result).toBe('');
    });

    it('should convert number to string', () => {
      const result = service.render('{{titleCase text}}', { text: 123 });
      expect(result).toBe('123');
    });

    it('should handle string with numbers', () => {
      const result = service.render('{{titleCase text}}', { text: 'hello123world' });
      expect(result).toBe('Hello123world');
    });

    it('should handle string with special characters', () => {
      // Note: hyphenated words are treated as single words (hyphen is not a word boundary)
      const result = service.render('{{titleCase text}}', { text: 'hello-world' });
      expect(result).toBe('Hello-world');
    });
  });

  describe('direct function calls', () => {
    it('should work when called directly', () => {
      expect(titleCase('hello world')).toBe('Hello World');
    });

    it('should return empty string for null', () => {
      expect(titleCase(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(titleCase(undefined)).toBe('');
    });
  });

  describe('metadata', () => {
    it('should have description', () => {
      expect(titleCase.description).toBeDefined();
      expect(typeof titleCase.description).toBe('string');
    });

    it('should have example', () => {
      expect(titleCase.example).toBeDefined();
      expect(typeof titleCase.example).toBe('string');
    });
  });
});
