/**
 * Schema Types Unit Tests
 * Tests for schema type differentiation and type definitions
 */

import { describe, it, expect } from 'vitest';
import type { Schema, SchemaField, ValidationResult, ValidationError } from '../../../src/services/schema/types.js';

describe('Schema Types', () => {
  describe('Schema interface', () => {
    it('should create input schema with schemaType', () => {
      const inputSchema: Schema = {
        path: 'generate-titles.json',
        version: '1.0',
        description: 'Input schema for title generation',
        schemaType: 'input',
        fields: [
          {
            name: 'transcriptAbridgement',
            type: 'string',
            required: true,
          },
        ],
      };

      expect(inputSchema.schemaType).toBe('input');
      expect(inputSchema.fields).toHaveLength(1);
    });

    it('should create output schema with schemaType', () => {
      const outputSchema: Schema = {
        path: 'generate-titles-output.json',
        version: '1.0',
        description: 'Output schema for title generation',
        schemaType: 'output',
        fields: [
          {
            name: 'titles',
            type: 'array',
            required: true,
            items: {
              name: 'title',
              type: 'string',
              required: true,
            },
          },
        ],
      };

      expect(outputSchema.schemaType).toBe('output');
      expect(outputSchema.path).toBe('generate-titles-output.json');
    });

    it('should create schema with schemaType "both"', () => {
      const schema: Schema = {
        path: 'combined-schema.json',
        version: '1.0',
        schemaType: 'both',
        fields: [],
      };

      expect(schema.schemaType).toBe('both');
    });

    it('should allow optional schemaType (defaults to input)', () => {
      const schema: Schema = {
        path: 'legacy-schema.json',
        version: '1.0',
        fields: [],
      };

      expect(schema.schemaType).toBeUndefined();
      // When schemaType is undefined, it's treated as 'input' by convention
    });

    it('should validate file naming convention for output schema', () => {
      const outputSchema: Schema = {
        path: 'generate-titles-output.json',
        version: '1.0',
        schemaType: 'output',
        fields: [],
      };

      expect(outputSchema.path).toMatch(/-output\.json$/);
      expect(outputSchema.schemaType).toBe('output');
    });

    it('should support nested object fields in output schema', () => {
      const outputSchema: Schema = {
        path: 'analysis-output.json',
        version: '1.0',
        schemaType: 'output',
        fields: [
          {
            name: 'result',
            type: 'object',
            required: true,
            properties: [
              {
                name: 'confidence',
                type: 'number',
                required: true,
              },
              {
                name: 'category',
                type: 'string',
                required: true,
              },
            ],
          },
        ],
      };

      expect(outputSchema.fields[0].type).toBe('object');
      expect(outputSchema.fields[0].properties).toHaveLength(2);
    });
  });

  describe('SchemaField interface', () => {
    it('should create field with all properties', () => {
      const field: SchemaField = {
        name: 'userName',
        type: 'string',
        required: true,
        description: 'User name field',
        constraints: {
          minLength: 3,
          maxLength: 50,
        },
      };

      expect(field.name).toBe('userName');
      expect(field.type).toBe('string');
      expect(field.required).toBe(true);
      expect(field.constraints).toBeDefined();
    });

    it('should support array field with items', () => {
      const field: SchemaField = {
        name: 'tags',
        type: 'array',
        required: false,
        items: {
          name: 'tag',
          type: 'string',
          required: true,
        },
      };

      expect(field.type).toBe('array');
      expect(field.items?.type).toBe('string');
    });

    it('should support nested object field with properties', () => {
      const field: SchemaField = {
        name: 'user',
        type: 'object',
        required: true,
        properties: [
          { name: 'firstName', type: 'string', required: true },
          { name: 'age', type: 'number', required: false },
        ],
      };

      expect(field.type).toBe('object');
      expect(field.properties).toHaveLength(2);
    });
  });

  describe('ValidationResult interface', () => {
    it('should create valid result with no errors', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
      };

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should create invalid result with errors', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          {
            field: 'userName',
            message: "Field 'userName' is required but missing",
            severity: 'error',
          },
        ],
      };

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].severity).toBe('error');
    });
  });

  describe('ValidationError interface', () => {
    it('should create error with all properties', () => {
      const error: ValidationError = {
        field: 'age',
        message: "Field 'age' expected type 'number' but received 'string'",
        severity: 'error',
      };

      expect(error.field).toBe('age');
      expect(error.message).toContain('expected type');
      expect(error.severity).toBe('error');
    });

    it('should create warning with warning severity', () => {
      const warning: ValidationError = {
        field: 'optional Field',
        message: 'Field is optional and missing',
        severity: 'warning',
      };

      expect(warning.severity).toBe('warning');
    });

    it('should support dot notation in field path', () => {
      const error: ValidationError = {
        field: 'user.email',
        message: "Field 'user.email' has invalid format",
        severity: 'error',
      };

      expect(error.field).toBe('user.email');
    });
  });

  describe('Schema type discrimination', () => {
    it('should distinguish input from output schemas by schemaType', () => {
      const inputSchema: Schema = {
        path: 'input.json',
        version: '1.0',
        schemaType: 'input',
        fields: [],
      };

      const outputSchema: Schema = {
        path: 'output.json',
        version: '1.0',
        schemaType: 'output',
        fields: [],
      };

      expect(inputSchema.schemaType).not.toBe(outputSchema.schemaType);
      expect(inputSchema.schemaType).toBe('input');
      expect(outputSchema.schemaType).toBe('output');
    });

    it('should distinguish schemas by file naming convention', () => {
      const inputPath = 'generate-titles.json';
      const outputPath = 'generate-titles-output.json';

      expect(outputPath).toMatch(/-output\.json$/);
      expect(inputPath).not.toMatch(/-output\.json$/);
    });

    it('should support both input and output in single schema', () => {
      const schema: Schema = {
        path: 'dual-schema.json',
        version: '1.0',
        schemaType: 'both',
        fields: [],
      };

      expect(schema.schemaType).toBe('both');
    });
  });
});
