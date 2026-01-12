/**
 * Schema Types Unit Tests
 * Tests for schema type differentiation and type definitions
 */

import { describe, it, expect } from 'vitest';
import type {
  Schema,
  UnifiedSchema,
  SchemaField,
  ValidationResult,
  ValidationError,
} from '../../../src/services/schema/types.js';
import { isUnifiedSchema, isLegacySchema } from '../../../src/services/schema/types.js';

describe('Schema Types', () => {
  describe('UnifiedSchema interface', () => {
    it('should create unified schema with input and output sections', () => {
      const schema: UnifiedSchema = {
        templateName: 'generate-titles',
        version: '1.0.0',
        description: 'Generate YouTube video titles',
        input: {
          fields: [
            {
              name: 'topic',
              type: 'string',
              required: true,
            },
            {
              name: 'audience',
              type: 'string',
              required: true,
            },
          ],
        },
        output: {
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
        },
      };

      expect(schema.templateName).toBe('generate-titles');
      expect(schema.input.fields).toHaveLength(2);
      expect(schema.output?.fields).toHaveLength(1);
    });

    it('should create unified schema with only input (no output)', () => {
      const schema: UnifiedSchema = {
        templateName: 'send-email',
        version: '1.0.0',
        input: {
          fields: [
            {
              name: 'recipient',
              type: 'string',
              required: true,
            },
            {
              name: 'subject',
              type: 'string',
              required: true,
            },
          ],
        },
      };

      expect(schema.templateName).toBe('send-email');
      expect(schema.input.fields).toHaveLength(2);
      expect(schema.output).toBeUndefined();
    });

    it('should support complex nested structures in input', () => {
      const schema: UnifiedSchema = {
        templateName: 'analyze-data',
        version: '1.0.0',
        input: {
          fields: [
            {
              name: 'data',
              type: 'object',
              required: true,
              properties: [
                {
                  name: 'metrics',
                  type: 'array',
                  required: true,
                  items: {
                    name: 'metric',
                    type: 'number',
                    required: true,
                  },
                },
              ],
            },
          ],
        },
        output: {
          fields: [
            {
              name: 'average',
              type: 'number',
              required: true,
            },
          ],
        },
      };

      expect(schema.input.fields[0].type).toBe('object');
      expect(schema.input.fields[0].properties).toHaveLength(1);
      expect(schema.output?.fields[0].name).toBe('average');
    });
  });

  describe('Type Guards', () => {
    describe('isUnifiedSchema', () => {
      it('should return true for valid UnifiedSchema', () => {
        const schema: UnifiedSchema = {
          templateName: 'test',
          version: '1.0.0',
          input: {
            fields: [],
          },
        };

        expect(isUnifiedSchema(schema)).toBe(true);
      });

      it('should return false for null', () => {
        expect(isUnifiedSchema(null)).toBe(false);
      });

      it('should return false for undefined', () => {
        expect(isUnifiedSchema(undefined)).toBe(false);
      });

      it('should return false for non-object', () => {
        expect(isUnifiedSchema('string')).toBe(false);
        expect(isUnifiedSchema(123)).toBe(false);
        expect(isUnifiedSchema(true)).toBe(false);
      });

      it('should return false for object without templateName', () => {
        const invalid = {
          version: '1.0.0',
          input: { fields: [] },
        };

        expect(isUnifiedSchema(invalid)).toBe(false);
      });

      it('should return false for object without version', () => {
        const invalid = {
          templateName: 'test',
          input: { fields: [] },
        };

        expect(isUnifiedSchema(invalid)).toBe(false);
      });

      it('should return false for object without input', () => {
        const invalid = {
          templateName: 'test',
          version: '1.0.0',
        };

        expect(isUnifiedSchema(invalid)).toBe(false);
      });

      it('should return false for object with input but no fields array', () => {
        const invalid = {
          templateName: 'test',
          version: '1.0.0',
          input: {},
        };

        expect(isUnifiedSchema(invalid)).toBe(false);
      });

      it('should return true for UnifiedSchema with optional output', () => {
        const schema: UnifiedSchema = {
          templateName: 'test',
          version: '1.0.0',
          input: { fields: [] },
          output: { fields: [] },
        };

        expect(isUnifiedSchema(schema)).toBe(true);
      });
    });

    describe('isLegacySchema', () => {
      it('should return true for valid legacy Schema', () => {
        const schema: Schema = {
          path: 'test.json',
          version: '1.0',
          fields: [],
        };

        expect(isLegacySchema(schema)).toBe(true);
      });

      it('should return false for UnifiedSchema', () => {
        const schema: UnifiedSchema = {
          templateName: 'test',
          version: '1.0.0',
          input: { fields: [] },
        };

        expect(isLegacySchema(schema)).toBe(false);
      });

      it('should return false for null', () => {
        expect(isLegacySchema(null)).toBe(false);
      });

      it('should return false for undefined', () => {
        expect(isLegacySchema(undefined)).toBe(false);
      });

      it('should return false for non-object', () => {
        expect(isLegacySchema('string')).toBe(false);
        expect(isLegacySchema(123)).toBe(false);
      });

      it('should return false for object without path', () => {
        const invalid = {
          version: '1.0',
          fields: [],
        };

        expect(isLegacySchema(invalid)).toBe(false);
      });

      it('should return false for object without version', () => {
        const invalid = {
          path: 'test.json',
          fields: [],
        };

        expect(isLegacySchema(invalid)).toBe(false);
      });

      it('should return false for object without fields', () => {
        const invalid = {
          path: 'test.json',
          version: '1.0',
        };

        expect(isLegacySchema(invalid)).toBe(false);
      });

      it('should distinguish legacy Schema from UnifiedSchema by templateName', () => {
        const legacy: Schema = {
          path: 'test.json',
          version: '1.0',
          fields: [],
        };

        const unified: UnifiedSchema = {
          templateName: 'test',
          version: '1.0.0',
          input: { fields: [] },
        };

        expect(isLegacySchema(legacy)).toBe(true);
        expect(isLegacySchema(unified)).toBe(false);
        expect(isUnifiedSchema(unified)).toBe(true);
        expect(isUnifiedSchema(legacy)).toBe(false);
      });
    });
  });

  describe('Legacy Schema interface (deprecated)', () => {
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
        field: 'optionalField',
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

  describe('Schema type discrimination (legacy)', () => {
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
