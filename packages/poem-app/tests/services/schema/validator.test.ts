/**
 * Schema Validator Unit Tests
 * Tests for schema validation service
 */

import { describe, it, expect, vi } from 'vitest';
import { SchemaValidator } from '../../../src/services/schema/validator.js';
import type { SchemaField, UnifiedSchema } from '../../../src/services/schema/types.js';

describe('SchemaValidator', () => {
  const validator = new SchemaValidator();

  describe('validate required field presence', () => {
    it('should pass when all required fields are present', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'count', type: 'number', required: true },
      ];
      const data = { title: 'Hello', count: 42 };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when required field is missing', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
      ];
      const data = {};

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        field: 'title',
        message: "Field 'title' is required but missing",
        severity: 'error',
      });
    });

    it('should fail when required field is null', () => {
      const schema: SchemaField[] = [
        { name: 'value', type: 'string', required: true },
      ];
      const data = { value: null };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('required but missing');
    });

    it('should pass when optional field is missing', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'subtitle', type: 'string', required: false },
      ];
      const data = { title: 'Hello' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validate type correctness', () => {
    it('should validate string type', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
      ];
      const data = { title: 'Hello World' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when string field receives number', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
      ];
      const data = { title: 123 };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toEqual({
        field: 'title',
        message: "Field 'title' expected type 'string' but received 'number'",
        severity: 'error',
      });
    });

    it('should validate number type', () => {
      const schema: SchemaField[] = [
        { name: 'count', type: 'number', required: true },
      ];
      const data = { count: 42 };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when number field receives string', () => {
      const schema: SchemaField[] = [
        { name: 'age', type: 'number', required: true },
      ];
      const data = { age: '25' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain("expected type 'number' but received 'string'");
    });

    it('should validate boolean type', () => {
      const schema: SchemaField[] = [
        { name: 'active', type: 'boolean', required: true },
      ];
      const data = { active: true };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when boolean field receives string', () => {
      const schema: SchemaField[] = [
        { name: 'isValid', type: 'boolean', required: true },
      ];
      const data = { isValid: 'true' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain("expected type 'boolean'");
    });
  });

  describe('validate nested objects', () => {
    it('should validate nested object properties', () => {
      const schema: SchemaField[] = [
        {
          name: 'user',
          type: 'object',
          required: true,
          properties: [
            { name: 'firstName', type: 'string', required: true },
            { name: 'age', type: 'number', required: true },
          ],
        },
      ];
      const data = {
        user: {
          firstName: 'John',
          age: 30,
        },
      };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when nested object field has wrong type', () => {
      const schema: SchemaField[] = [
        {
          name: 'user',
          type: 'object',
          required: true,
          properties: [
            { name: 'age', type: 'number', required: true },
          ],
        },
      ];
      const data = {
        user: {
          age: 'thirty',
        },
      };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].field).toBe('user.age');
      expect(result.errors[0].message).toContain("expected type 'number'");
    });

    it('should fail when nested required field is missing', () => {
      const schema: SchemaField[] = [
        {
          name: 'user',
          type: 'object',
          required: true,
          properties: [
            { name: 'email', type: 'string', required: true },
          ],
        },
      ];
      const data = {
        user: {},
      };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].field).toBe('user.email');
    });
  });

  describe('validate arrays with item types', () => {
    it('should validate array of strings', () => {
      const schema: SchemaField[] = [
        {
          name: 'tags',
          type: 'array',
          required: true,
          items: {
            name: 'tag',
            type: 'string',
            required: true,
          },
        },
      ];
      const data = { tags: ['javascript', 'typescript', 'nodejs'] };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when array item has wrong type', () => {
      const schema: SchemaField[] = [
        {
          name: 'scores',
          type: 'array',
          required: true,
          items: {
            name: 'score',
            type: 'number',
            required: true,
          },
        },
      ];
      const data = { scores: [10, 20, '30', 40] };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].field).toContain('scores[2]');
      expect(result.errors[0].message).toContain("expected type 'number'");
    });

    it('should validate empty array', () => {
      const schema: SchemaField[] = [
        {
          name: 'items',
          type: 'array',
          required: true,
          items: {
            name: 'item',
            type: 'string',
            required: true,
          },
        },
      ];
      const data = { items: [] };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when array field receives object', () => {
      const schema: SchemaField[] = [
        { name: 'list', type: 'array', required: true },
      ];
      const data = { list: { value: 123 } };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain("expected type 'array'");
    });
  });

  describe('support unstructured text outputs', () => {
    it('should validate simple string output', () => {
      const schema: SchemaField[] = [
        { name: 'output', type: 'string', required: true },
      ];
      const data = 'This is a simple text output from AI';

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when expecting object but receiving string', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'description', type: 'string', required: true },
      ];
      const data = 'Just a string';

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Expected object or array');
    });
  });

  describe('handle missing optional fields', () => {
    it('should pass validation when optional fields are missing', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'subtitle', type: 'string', required: false },
        { name: 'tags', type: 'array', required: false },
      ];
      const data = { title: 'Hello' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate optional field when present', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'count', type: 'number', required: false },
      ];
      const data = { title: 'Test', count: 10 };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when optional field has wrong type', () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'count', type: 'number', required: false },
      ];
      const data = { title: 'Test', count: '10' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].field).toBe('count');
    });
  });

  describe('handle edge cases', () => {
    it('should handle empty data object', () => {
      const schema: SchemaField[] = [
        { name: 'field', type: 'string', required: false },
      ];
      const data = {};

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should handle empty schema', () => {
      const schema: SchemaField[] = [];
      const data = { anything: 'goes' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should handle null data', () => {
      const schema: SchemaField[] = [
        { name: 'field', type: 'string', required: true },
      ];
      const data = null;

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Expected object or array');
    });

    it('should handle undefined values', () => {
      const schema: SchemaField[] = [
        { name: 'value', type: 'string', required: true },
      ];
      const data = { value: undefined };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('required but missing');
    });
  });

  describe('validate format constraints', () => {
    it('should validate number min constraint', () => {
      const schema: SchemaField[] = [
        {
          name: 'age',
          type: 'number',
          required: true,
          constraints: { min: 18 },
        },
      ];
      const data = { age: 25 };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when number is below min', () => {
      const schema: SchemaField[] = [
        {
          name: 'age',
          type: 'number',
          required: true,
          constraints: { min: 18 },
        },
      ];
      const data = { age: 15 };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('less than minimum');
    });

    it('should validate number max constraint', () => {
      const schema: SchemaField[] = [
        {
          name: 'score',
          type: 'number',
          required: true,
          constraints: { max: 100 },
        },
      ];
      const data = { score: 95 };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when number exceeds max', () => {
      const schema: SchemaField[] = [
        {
          name: 'score',
          type: 'number',
          required: true,
          constraints: { max: 100 },
        },
      ];
      const data = { score: 150 };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('exceeds maximum');
    });

    it('should validate string minLength constraint', () => {
      const schema: SchemaField[] = [
        {
          name: 'password',
          type: 'string',
          required: true,
          constraints: { minLength: 8 },
        },
      ];
      const data = { password: 'securepass123' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when string is too short', () => {
      const schema: SchemaField[] = [
        {
          name: 'password',
          type: 'string',
          required: true,
          constraints: { minLength: 8 },
        },
      ];
      const data = { password: 'short' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('less than minimum');
    });

    it('should validate string maxLength constraint', () => {
      const schema: SchemaField[] = [
        {
          name: 'title',
          type: 'string',
          required: true,
          constraints: { maxLength: 50 },
        },
      ];
      const data = { title: 'Short title' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when string exceeds maxLength', () => {
      const schema: SchemaField[] = [
        {
          name: 'title',
          type: 'string',
          required: true,
          constraints: { maxLength: 10 },
        },
      ];
      const data = { title: 'This is a very long title that exceeds the limit' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('exceeds maximum');
    });

    it('should validate enum constraint', () => {
      const schema: SchemaField[] = [
        {
          name: 'status',
          type: 'string',
          required: true,
          constraints: { enum: ['active', 'inactive', 'pending'] },
        },
      ];
      const data = { status: 'active' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when value not in enum', () => {
      const schema: SchemaField[] = [
        {
          name: 'status',
          type: 'string',
          required: true,
          constraints: { enum: ['active', 'inactive'] },
        },
      ];
      const data = { status: 'unknown' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('not one of allowed values');
    });

    it('should validate pattern constraint', () => {
      const schema: SchemaField[] = [
        {
          name: 'email',
          type: 'string',
          required: true,
          constraints: { pattern: '^[a-z]+@[a-z]+\\.[a-z]+$' },
        },
      ];
      const data = { email: 'user@example.com' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
    });

    it('should fail when string does not match pattern', () => {
      const schema: SchemaField[] = [
        {
          name: 'email',
          type: 'string',
          required: true,
          constraints: { pattern: '^[a-z]+@[a-z]+\\.[a-z]+$' },
        },
      ];
      const data = { email: 'invalid-email' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('does not match required pattern');
    });
  });

  describe('validateUnified - unified schema structure', () => {
    it('should validate input section of unified schema', () => {
      const schema: UnifiedSchema = {
        templateName: 'generate-titles',
        version: '1.0.0',
        description: 'Generate YouTube video titles',
        input: {
          fields: [
            { name: 'topic', type: 'string', required: true },
            { name: 'audience', type: 'string', required: true },
          ],
        },
      };
      const data = { topic: 'TypeScript', audience: 'developers' };

      const result = validator.validateUnified(data, schema, 'input');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate output section of unified schema', () => {
      const schema: UnifiedSchema = {
        templateName: 'generate-titles',
        version: '1.0.0',
        input: {
          fields: [{ name: 'topic', type: 'string', required: true }],
        },
        output: {
          fields: [
            { name: 'titles', type: 'array', required: true },
            { name: 'count', type: 'number', required: true },
          ],
        },
      };
      const data = {
        titles: ['Title 1', 'Title 2', 'Title 3'],
        count: 3,
      };

      const result = validator.validateUnified(data, schema, 'output');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when validating against missing output section', () => {
      const schema: UnifiedSchema = {
        templateName: 'test-prompt',
        version: '1.0.0',
        input: {
          fields: [{ name: 'input', type: 'string', required: true }],
        },
        // No output section
      };
      const data = { result: 'something' };

      const result = validator.validateUnified(data, schema, 'output');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('does not have an output section');
    });

    it('should include schema section in error messages for input', () => {
      const schema: UnifiedSchema = {
        templateName: 'test-prompt',
        version: '1.0.0',
        input: {
          fields: [{ name: 'name', type: 'string', required: true }],
        },
      };
      const data = {};

      const result = validator.validateUnified(data, schema, 'input');

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('[input]');
      expect(result.errors[0].message).toContain('is required but missing');
    });

    it('should include schema section in error messages for output', () => {
      const schema: UnifiedSchema = {
        templateName: 'test-prompt',
        version: '1.0.0',
        input: {
          fields: [{ name: 'input', type: 'string', required: true }],
        },
        output: {
          fields: [{ name: 'result', type: 'number', required: true }],
        },
      };
      const data = { result: 'not-a-number' };

      const result = validator.validateUnified(data, schema, 'output');

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('[output]');
      expect(result.errors[0].message).toContain('expected type');
    });

    it('should validate complex unified schema with nested objects', () => {
      const schema: UnifiedSchema = {
        templateName: 'complex-prompt',
        version: '1.0.0',
        input: {
          fields: [
            {
              name: 'config',
              type: 'object',
              required: true,
              properties: [
                { name: 'enabled', type: 'boolean', required: true },
                { name: 'maxItems', type: 'number', required: false },
              ],
            },
          ],
        },
        output: {
          fields: [
            {
              name: 'results',
              type: 'array',
              required: true,
              items: {
                name: 'item',
                type: 'string',
                required: true,
              },
            },
          ],
        },
      };

      const inputData = {
        config: {
          enabled: true,
          maxItems: 10,
        },
      };
      const outputData = {
        results: ['result1', 'result2', 'result3'],
      };

      const inputResult = validator.validateUnified(inputData, schema, 'input');
      const outputResult = validator.validateUnified(outputData, schema, 'output');

      expect(inputResult.valid).toBe(true);
      expect(outputResult.valid).toBe(true);
    });
  });

  describe('validate - backward compatibility', () => {
    it('should show deprecation warning when using raw SchemaField[]', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const schema: SchemaField[] = [{ name: 'test', type: 'string', required: true }];
      const data = { test: 'value' };

      validator.validate(data, schema);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEPRECATED]')
      );
      consoleSpy.mockRestore();
    });

    it('should redirect UnifiedSchema to validateUnified when schemaSection provided', () => {
      const schema: UnifiedSchema = {
        templateName: 'test',
        version: '1.0.0',
        input: {
          fields: [{ name: 'name', type: 'string', required: true }],
        },
      };
      const data = { name: 'test' };

      const result = validator.validate(data, schema, 'input');

      expect(result.valid).toBe(true);
    });

    it('should default to input section when UnifiedSchema used without schemaSection', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const schema: UnifiedSchema = {
        templateName: 'test',
        version: '1.0.0',
        input: {
          fields: [{ name: 'name', type: 'string', required: true }],
        },
      };
      const data = { name: 'test' };

      const result = validator.validate(data, schema);

      expect(result.valid).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Defaulting to "input"')
      );
      consoleSpy.mockRestore();
    });
  });
});
