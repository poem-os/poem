/**
 * Mock Generator Service Tests
 * Tests core mock data generation functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { generateFromSchema, generateFieldValue } from '../../../src/services/mock-generator';
import type { UnifiedSchema, SchemaField } from '../../../src/services/schema/types';

describe('MockGenerator', () => {
  describe('generateFromSchema', () => {
    it('should generate single record by default', () => {
      const schema: UnifiedSchema = {
        templateName: 'test-template',
        version: '1.0.0',
        input: {
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'count', type: 'number', required: true }
          ]
        }
      };

      const result = generateFromSchema(schema);

      expect(result.data).toHaveLength(1);
      expect(result.count).toBe(1);
      expect(result.data[0]).toHaveProperty('title');
      expect(result.data[0]).toHaveProperty('count');
    });

    it('should generate multiple records when count specified', () => {
      const schema: UnifiedSchema = {
        templateName: 'test-template',
        version: '1.0.0',
        input: {
          fields: [
            { name: 'name', type: 'string', required: true }
          ]
        }
      };

      const result = generateFromSchema(schema, { count: 5 });

      expect(result.data).toHaveLength(5);
      expect(result.count).toBe(5);
    });

    it('should use seed for reproducible generation', () => {
      const schema: UnifiedSchema = {
        templateName: 'test-template',
        version: '1.0.0',
        input: {
          fields: [
            { name: 'value', type: 'string', required: true }
          ]
        }
      };

      const result1 = generateFromSchema(schema, { seed: 12345 });
      const result2 = generateFromSchema(schema, { seed: 12345 });

      expect(result1.data[0]).toEqual(result2.data[0]);
    });

    it('should return warnings for failed field generation', () => {
      const schema: UnifiedSchema = {
        templateName: 'test-template',
        version: '1.0.0',
        input: {
          fields: [
            {
              name: 'invalidField',
              type: 'string',
              required: true,
              constraints: { fakerHint: 'invalid.method.path' }
            }
          ]
        }
      };

      const result = generateFromSchema(schema);

      // Should still generate data but may have warnings
      expect(result.data).toHaveLength(1);
      expect(result.warnings).toBeDefined();
    });
  });

  describe('generateFieldValue', () => {
    it('should generate string field', () => {
      const field: SchemaField = {
        name: 'description',
        type: 'string',
        required: true
      };

      const value = generateFieldValue(field);

      expect(typeof value).toBe('string');
      expect((value as string).length).toBeGreaterThan(0);
    });

    it('should generate string with length constraints', () => {
      const field: SchemaField = {
        name: 'title',
        type: 'string',
        required: true,
        constraints: { minLength: 40, maxLength: 50 }
      };

      const value = generateFieldValue(field) as string;

      expect(value.length).toBeGreaterThanOrEqual(40);
      expect(value.length).toBeLessThanOrEqual(50);
    });

    it('should generate number field', () => {
      const field: SchemaField = {
        name: 'age',
        type: 'number',
        required: true
      };

      const value = generateFieldValue(field);

      expect(typeof value).toBe('number');
    });

    it('should generate number with constraints', () => {
      const field: SchemaField = {
        name: 'score',
        type: 'number',
        required: true,
        constraints: { min: 10, max: 100 }
      };

      const value = generateFieldValue(field) as number;

      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThanOrEqual(100);
    });

    it('should generate boolean field', () => {
      const field: SchemaField = {
        name: 'active',
        type: 'boolean',
        required: true
      };

      const value = generateFieldValue(field);

      expect(typeof value).toBe('boolean');
    });

    it('should generate array field', () => {
      const field: SchemaField = {
        name: 'tags',
        type: 'array',
        required: true,
        items: {
          name: 'tag',
          type: 'string',
          required: true
        }
      };

      const value = generateFieldValue(field);

      expect(Array.isArray(value)).toBe(true);
      expect((value as unknown[]).length).toBeGreaterThan(0);
    });

    it('should generate object field', () => {
      const field: SchemaField = {
        name: 'user',
        type: 'object',
        required: true,
        properties: [
          { name: 'firstName', type: 'string', required: true },
          { name: 'lastName', type: 'string', required: true }
        ]
      };

      const value = generateFieldValue(field) as Record<string, unknown>;

      expect(typeof value).toBe('object');
      expect(value).toHaveProperty('firstName');
      expect(value).toHaveProperty('lastName');
    });

    it('should use enum values when provided', () => {
      const field: SchemaField = {
        name: 'status',
        type: 'string',
        required: true,
        constraints: { enum: ['draft', 'published', 'archived'] }
      };

      const value = generateFieldValue(field) as string;

      expect(['draft', 'published', 'archived']).toContain(value);
    });

    it('should use fakerHint when provided', () => {
      const field: SchemaField = {
        name: 'email',
        type: 'string',
        required: true,
        constraints: { fakerHint: 'internet.email' }
      };

      const value = generateFieldValue(field);

      expect(typeof value).toBe('string');
      // Basic email format check
      expect((value as string)).toMatch(/@/);
    });
  });
});
