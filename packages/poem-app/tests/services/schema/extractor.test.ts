/**
 * Unit tests for SchemaExtractor service
 */

import { describe, it, expect } from 'vitest';
import { SchemaExtractor, type SchemaField } from '../../../src/services/schema/extractor.js';

describe('SchemaExtractor', () => {
  const extractor = new SchemaExtractor();

  describe('simple placeholders', () => {
    it('should extract a simple placeholder as string', () => {
      const result = extractor.extract('Hello {{name}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0]).toEqual({
        name: 'name',
        type: 'string',
        required: true,
      });
    });

    it('should extract multiple simple placeholders', () => {
      const result = extractor.extract('{{firstName}} {{lastName}}');

      expect(result.fields).toHaveLength(2);
      expect(result.fields.find((f) => f.name === 'firstName')).toEqual({
        name: 'firstName',
        type: 'string',
        required: true,
      });
      expect(result.fields.find((f) => f.name === 'lastName')).toEqual({
        name: 'lastName',
        type: 'string',
        required: true,
      });
    });

    it('should deduplicate repeated placeholders', () => {
      const result = extractor.extract('{{name}} and {{name}} again');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('name');
    });
  });

  describe('nested objects', () => {
    it('should extract nested object path', () => {
      const result = extractor.extract('{{user.email}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0]).toEqual({
        name: 'user',
        type: 'object',
        required: true,
        properties: [
          {
            name: 'email',
            type: 'string',
            required: true,
          },
        ],
      });
    });

    it('should merge multiple nested properties', () => {
      const result = extractor.extract('{{user.firstName}} {{user.lastName}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('user');
      expect(result.fields[0].type).toBe('object');
      expect(result.fields[0].properties).toHaveLength(2);
      expect(result.fields[0].properties?.find((p) => p.name === 'firstName')).toBeDefined();
      expect(result.fields[0].properties?.find((p) => p.name === 'lastName')).toBeDefined();
    });

    it('should handle deeply nested paths', () => {
      const result = extractor.extract('{{user.address.city}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('user');
      expect(result.fields[0].type).toBe('object');
      expect(result.fields[0].properties?.[0].name).toBe('address');
      expect(result.fields[0].properties?.[0].type).toBe('object');
      expect(result.fields[0].properties?.[0].properties?.[0].name).toBe('city');
    });
  });

  describe('#each blocks (arrays)', () => {
    it('should extract #each block as array', () => {
      const result = extractor.extract('{{#each items}}{{this}}{{/each}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0]).toEqual({
        name: 'items',
        type: 'array',
        required: true,
      });
    });

    it('should extract nested #each path as array', () => {
      const result = extractor.extract('{{#each user.orders}}{{this.id}}{{/each}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('user');
      expect(result.fields[0].type).toBe('array');
    });

    it('should handle array index access', () => {
      const result = extractor.extract('{{items.[0]}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0]).toEqual({
        name: 'items',
        type: 'array',
        required: true,
      });
    });

    it('should handle numeric index access', () => {
      const result = extractor.extract('{{items.0.name}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('items');
      expect(result.fields[0].type).toBe('array');
    });
  });

  describe('#if blocks (booleans)', () => {
    it('should extract #if condition as boolean', () => {
      const result = extractor.extract('{{#if active}}Active{{/if}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0]).toEqual({
        name: 'active',
        type: 'boolean',
        required: true,
      });
    });

    it('should extract nested #if condition', () => {
      const result = extractor.extract('{{#if user.isAdmin}}Admin{{/if}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('user');
      expect(result.fields[0].type).toBe('boolean');
    });
  });

  describe('helper detection', () => {
    it('should detect helper calls', () => {
      const result = extractor.extract('{{truncate title 50}}');

      expect(result.requiredHelpers).toContain('truncate');
      // title should be extracted as a field
      expect(result.fields.find((f) => f.name === 'title')).toBeDefined();
    });

    it('should detect multiple helpers', () => {
      const result = extractor.extract('{{truncate title 50}} {{upperCase name}}');

      expect(result.requiredHelpers).toContain('truncate');
      expect(result.requiredHelpers).toContain('upperCase');
    });

    it('should not include built-in helpers', () => {
      const result = extractor.extract('{{#if active}}{{/if}}{{#each items}}{{/each}}');

      expect(result.requiredHelpers).not.toContain('if');
      expect(result.requiredHelpers).not.toContain('each');
    });

    it('should detect helper in subexpression', () => {
      const result = extractor.extract('{{#if (gt length 20)}}Too long{{/if}}');

      expect(result.requiredHelpers).toContain('gt');
      // length should be extracted as a field
      expect(result.fields.find((f) => f.name === 'length')).toBeDefined();
    });

    it('should sort helpers alphabetically', () => {
      const result = extractor.extract('{{zebra x}} {{alpha y}} {{middle z}}');

      expect(result.requiredHelpers).toEqual(['alpha', 'middle', 'zebra']);
    });
  });

  describe('complex templates', () => {
    it('should handle a realistic template with multiple patterns', () => {
      const template = `
        {{#if showTitle}}
          <h1>{{truncate title 50}}</h1>
        {{/if}}

        <p>By {{author.name}}</p>

        {{#each chapters}}
          <h2>{{this.title}}</h2>
        {{/each}}

        {{#if (gt items.length 10)}}
          <p>{{items.[0].name}}</p>
        {{/if}}
      `;

      const result = extractor.extract(template);

      // Check fields
      expect(result.fields.find((f) => f.name === 'showTitle')?.type).toBe('boolean');
      expect(result.fields.find((f) => f.name === 'title')?.type).toBe('string');
      expect(result.fields.find((f) => f.name === 'author')?.type).toBe('object');
      expect(result.fields.find((f) => f.name === 'chapters')?.type).toBe('array');
      expect(result.fields.find((f) => f.name === 'items')?.type).toBe('array');

      // Check helpers
      expect(result.requiredHelpers).toContain('truncate');
      expect(result.requiredHelpers).toContain('gt');
    });

    it('should handle empty template', () => {
      const result = extractor.extract('');

      expect(result.fields).toHaveLength(0);
      expect(result.requiredHelpers).toHaveLength(0);
    });

    it('should handle template with no placeholders', () => {
      const result = extractor.extract('Hello, World!');

      expect(result.fields).toHaveLength(0);
      expect(result.requiredHelpers).toHaveLength(0);
    });

    it('should ignore comments', () => {
      const result = extractor.extract('{{!-- This is a comment --}}{{name}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('name');
    });

    it('should ignore partials', () => {
      const result = extractor.extract('{{> header}}{{name}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('name');
    });

    it('should ignore @index and @first in each blocks', () => {
      const result = extractor.extract('{{#each items}}{{@index}}{{@first}}{{this.name}}{{/each}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('items');
      // Should not have @index or @first as fields
      expect(result.fields.find((f) => f.name === '@index')).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace in placeholders', () => {
      const result = extractor.extract('{{ name }}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('name');
    });

    it('should skip string literals in helper calls', () => {
      const result = extractor.extract('{{helper "literal" field}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('field');
    });

    it('should skip number literals in helper calls', () => {
      const result = extractor.extract('{{truncate field 50}}');

      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('field');
    });
  });
});
