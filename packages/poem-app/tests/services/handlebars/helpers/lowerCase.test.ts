import { describe, it, expect, beforeEach } from 'vitest';
import { HandlebarsService } from '../../../../src/services/handlebars/index.js';
import lowerCase from '../../../../src/services/handlebars/helpers/lowerCase.js';

describe('lowerCase helper', () => {
  let service: HandlebarsService;

  beforeEach(() => {
    service = new HandlebarsService();
    service.registerHelper('lowerCase', lowerCase, {
      description: lowerCase.description,
      example: lowerCase.example,
    });
  });

  describe('basic functionality', () => {
    it('should convert "HELLO" to "hello"', () => {
      const result = service.render('{{lowerCase text}}', { text: 'HELLO' });
      expect(result).toBe('hello');
    });

    it('should convert mixed case to lowercase', () => {
      const result = service.render('{{lowerCase text}}', { text: 'Hello World' });
      expect(result).toBe('hello world');
    });

    it('should keep already lowercase text', () => {
      const result = service.render('{{lowerCase text}}', { text: 'hello' });
      expect(result).toBe('hello');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = service.render('{{lowerCase text}}', { text: '' });
      expect(result).toBe('');
    });

    it('should handle null', () => {
      const result = service.render('{{lowerCase text}}', { text: null });
      expect(result).toBe('');
    });

    it('should handle undefined', () => {
      const result = service.render('{{lowerCase text}}', { text: undefined });
      expect(result).toBe('');
    });

    it('should convert number to lowercase string', () => {
      const result = service.render('{{lowerCase text}}', { text: 123 });
      expect(result).toBe('123');
    });

    it('should handle string with numbers', () => {
      const result = service.render('{{lowerCase text}}', { text: 'HELLO123' });
      expect(result).toBe('hello123');
    });

    it('should handle special characters', () => {
      const result = service.render('{{lowerCase text}}', { text: 'HELLO-WORLD!' });
      expect(result).toBe('hello-world!');
    });
  });

  describe('direct function calls', () => {
    it('should work when called directly', () => {
      expect(lowerCase('HELLO')).toBe('hello');
    });

    it('should return empty string for null', () => {
      expect(lowerCase(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(lowerCase(undefined)).toBe('');
    });
  });

  describe('metadata', () => {
    it('should have description', () => {
      expect(lowerCase.description).toBeDefined();
      expect(typeof lowerCase.description).toBe('string');
    });

    it('should have example', () => {
      expect(lowerCase.example).toBeDefined();
      expect(typeof lowerCase.example).toBe('string');
    });
  });
});
