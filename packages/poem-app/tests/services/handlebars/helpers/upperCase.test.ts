import { describe, it, expect, beforeEach } from 'vitest';
import { HandlebarsService } from '../../../../src/services/handlebars/index.js';
import upperCase from '../../../../src/services/handlebars/helpers/upperCase.js';

describe('upperCase helper', () => {
  let service: HandlebarsService;

  beforeEach(() => {
    service = new HandlebarsService();
    service.registerHelper('upperCase', upperCase, {
      description: upperCase.description,
      example: upperCase.example,
    });
  });

  describe('basic functionality', () => {
    it('should convert "hello" to "HELLO"', () => {
      const result = service.render('{{upperCase text}}', { text: 'hello' });
      expect(result).toBe('HELLO');
    });

    it('should convert mixed case to uppercase', () => {
      const result = service.render('{{upperCase text}}', { text: 'Hello World' });
      expect(result).toBe('HELLO WORLD');
    });

    it('should keep already uppercase text', () => {
      const result = service.render('{{upperCase text}}', { text: 'HELLO' });
      expect(result).toBe('HELLO');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = service.render('{{upperCase text}}', { text: '' });
      expect(result).toBe('');
    });

    it('should handle null', () => {
      const result = service.render('{{upperCase text}}', { text: null });
      expect(result).toBe('');
    });

    it('should handle undefined', () => {
      const result = service.render('{{upperCase text}}', { text: undefined });
      expect(result).toBe('');
    });

    it('should convert number to uppercase string', () => {
      const result = service.render('{{upperCase text}}', { text: 123 });
      expect(result).toBe('123');
    });

    it('should handle string with numbers', () => {
      const result = service.render('{{upperCase text}}', { text: 'hello123' });
      expect(result).toBe('HELLO123');
    });

    it('should handle special characters', () => {
      const result = service.render('{{upperCase text}}', { text: 'hello-world!' });
      expect(result).toBe('HELLO-WORLD!');
    });
  });

  describe('direct function calls', () => {
    it('should work when called directly', () => {
      expect(upperCase('hello')).toBe('HELLO');
    });

    it('should return empty string for null', () => {
      expect(upperCase(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(upperCase(undefined)).toBe('');
    });
  });

  describe('metadata', () => {
    it('should have description', () => {
      expect(upperCase.description).toBeDefined();
      expect(typeof upperCase.description).toBe('string');
    });

    it('should have example', () => {
      expect(upperCase.example).toBeDefined();
      expect(typeof upperCase.example).toBe('string');
    });
  });
});
