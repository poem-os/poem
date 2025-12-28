import { describe, it, expect, beforeEach } from 'vitest';
import { HandlebarsService } from '../../../../src/services/handlebars/index.js';
import json from '../../../../src/services/handlebars/helpers/json.js';

describe('json helper', () => {
  let service: HandlebarsService;

  beforeEach(() => {
    service = new HandlebarsService();
    service.registerHelper('json', json, {
      description: json.description,
      example: json.example,
    });
  });

  describe('basic functionality', () => {
    it('should stringify simple object', () => {
      const result = service.render('{{json obj}}', { obj: { name: 'John' } });
      expect(JSON.parse(result)).toEqual({ name: 'John' });
    });

    it('should stringify nested object', () => {
      const obj = { user: { name: 'John', age: 30 } };
      const result = service.render('{{json obj}}', { obj });
      expect(JSON.parse(result)).toEqual(obj);
    });

    it('should stringify array', () => {
      const arr = [1, 2, 3];
      const result = service.render('{{json arr}}', { arr });
      expect(JSON.parse(result)).toEqual(arr);
    });

    it('should format with 2-space indent', () => {
      const result = service.render('{{json obj}}', { obj: { name: 'John' } });
      expect(result).toContain('\n');
      expect(result).toContain('  '); // 2-space indent
    });
  });

  describe('primitive values', () => {
    it('should stringify string', () => {
      const result = service.render('{{json val}}', { val: 'hello' });
      expect(result).toBe('"hello"');
    });

    it('should stringify number', () => {
      const result = service.render('{{json val}}', { val: 42 });
      expect(result).toBe('42');
    });

    it('should stringify boolean', () => {
      const result = service.render('{{json val}}', { val: true });
      expect(result).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('should handle null', () => {
      const result = service.render('{{json val}}', { val: null });
      expect(result).toBe('null');
    });

    it('should handle undefined', () => {
      const result = service.render('{{json val}}', { val: undefined });
      expect(result).toBe('undefined');
    });

    it('should handle empty object', () => {
      const result = service.render('{{json obj}}', { obj: {} });
      expect(result).toBe('{}');
    });

    it('should handle empty array', () => {
      const result = service.render('{{json arr}}', { arr: [] });
      expect(result).toBe('[]');
    });
  });

  describe('circular references', () => {
    it('should handle circular reference', () => {
      const obj: Record<string, unknown> = { name: 'test' };
      obj.self = obj; // Create circular reference

      const result = json(obj).toString();
      expect(result).toContain('[Circular Reference]');
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it('should handle deeply nested circular reference', () => {
      const obj: Record<string, unknown> = {
        level1: {
          level2: {},
        },
      };
      (obj.level1 as Record<string, unknown>).level2 = obj; // Circular

      const result = json(obj).toString();
      expect(result).toContain('[Circular Reference]');
    });
  });

  describe('direct function calls', () => {
    it('should work when called directly', () => {
      const result = json({ name: 'John' });
      // json returns SafeString, need to convert to string for parsing
      expect(JSON.parse(result.toString())).toEqual({ name: 'John' });
    });

    it('should return "null" for null', () => {
      expect(json(null).toString()).toBe('null');
    });

    it('should return "undefined" for undefined', () => {
      expect(json(undefined).toString()).toBe('undefined');
    });
  });

  describe('metadata', () => {
    it('should have description', () => {
      expect(json.description).toBeDefined();
      expect(typeof json.description).toBe('string');
    });

    it('should have example', () => {
      expect(json.example).toBeDefined();
      expect(typeof json.example).toBe('string');
    });
  });
});
