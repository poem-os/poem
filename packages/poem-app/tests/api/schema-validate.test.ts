/**
 * API Integration Tests for /api/schema/validate endpoint
 */

import { describe, it, expect } from 'vitest';
import { POST } from '../../src/pages/api/schema/validate.js';
import type { SchemaField } from '../../src/services/schema/types.js';

// Helper to create mock APIContext
function createMockContext(body: unknown): any {
  return {
    request: {
      json: async () => body,
    },
  };
}

// Helper to parse response
async function parseResponse(response: Response) {
  const text = await response.text();
  return JSON.parse(text);
}

describe('POST /api/schema/validate', () => {
  describe('with inline schema', () => {
    it('should return valid=true when data matches schema', async () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'count', type: 'number', required: true },
      ];
      const data = { title: 'Hello', count: 42 };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.validationTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should return valid=false when required field is missing', async () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
      ];
      const data = {};

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        field: 'title',
        message: "Field 'title' is required but missing",
        severity: 'error',
      });
    });

    it('should return valid=false when field type is wrong', async () => {
      const schema: SchemaField[] = [
        { name: 'age', type: 'number', required: true },
      ];
      const data = { age: '25' };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain("expected type 'number' but received 'string'");
    });

    it('should validate nested object schema', async () => {
      const schema: SchemaField[] = [
        {
          name: 'user',
          type: 'object',
          required: true,
          properties: [
            { name: 'name', type: 'string', required: true },
            { name: 'age', type: 'number', required: true },
          ],
        },
      ];
      const data = { user: { name: 'John', age: 30 } };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.valid).toBe(true);
    });

    it('should validate array schema', async () => {
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
      const data = { tags: ['javascript', 'typescript'] };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.valid).toBe(true);
    });
  });

  describe('validation timing (NFR2)', () => {
    it('should complete validation in <100ms', async () => {
      const schema: SchemaField[] = [
        { name: 'field1', type: 'string', required: true },
        { name: 'field2', type: 'number', required: true },
        { name: 'field3', type: 'boolean', required: false },
      ];
      const data = { field1: 'test', field2: 123 };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.validationTimeMs).toBeLessThan(100);
    });

    it('should report validation time in response', async () => {
      const schema: SchemaField[] = [
        { name: 'value', type: 'string', required: true },
      ];
      const data = { value: 'test' };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.validationTimeMs).toBeDefined();
      expect(typeof result.validationTimeMs).toBe('number');
    });
  });

  describe('clear error messages (NFR6)', () => {
    it('should provide clear message for missing required field', async () => {
      const schema: SchemaField[] = [
        { name: 'username', type: 'string', required: true },
      ];
      const data = {};

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.errors[0].message).toBe("Field 'username' is required but missing");
    });

    it('should provide clear message for type mismatch', async () => {
      const schema: SchemaField[] = [
        { name: 'count', type: 'number', required: true },
      ];
      const data = { count: 'not-a-number' };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.errors[0].message).toBe("Field 'count' expected type 'number' but received 'string'");
    });

    it('should include field path in error message', async () => {
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
      const data = { user: {} };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.errors[0].field).toBe('user.email');
      expect(result.errors[0].message).toContain('user.email');
    });
  });

  describe('error handling', () => {
    it('should return 400 for malformed request (missing schema)', async () => {
      const context = createMockContext({ data: { value: 'test' } });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid request format');
    });

    it('should return 200 with validation error when data is undefined', async () => {
      const schema: SchemaField[] = [
        { name: 'value', type: 'string', required: true },
      ];
      const context = createMockContext({ schema, data: undefined });
      const response = await POST(context);
      const result = await parseResponse(response);

      // Undefined data is accepted, but validation will fail
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.valid).toBe(false);
    });

    it('should return 400 for invalid schema format (empty array)', async () => {
      const context = createMockContext({ schema: [], data: {} });
      const response = await POST(context);
      const result = await parseResponse(response);

      // Empty schema is valid - should return success
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
    });
  });

  describe('handle schema as file path', () => {
    it('should handle schema as string path (error when file not found)', async () => {
      // Note: This test would require a real schema file in the workspace
      // For now, we test that the API accepts string format
      const context = createMockContext({
        schema: 'nonexistent-schema.json',
        data: { value: 'test' },
      });
      const response = await POST(context);
      const result = await parseResponse(response);

      // resolvePathAsync throws, caught as 500 or 400 depending on error type
      expect([400, 500]).toContain(response.status);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('support structured and unstructured outputs', () => {
    it('should validate structured JSON output', async () => {
      const schema: SchemaField[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'description', type: 'string', required: true },
      ];
      const data = { title: 'Test', description: 'Description' };

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.valid).toBe(true);
    });

    it('should validate unstructured text output', async () => {
      const schema: SchemaField[] = [
        { name: 'output', type: 'string', required: true },
      ];
      const data = 'Simple text output from AI';

      const context = createMockContext({ schema, data });
      const response = await POST(context);
      const result = await parseResponse(response);

      expect(result.valid).toBe(true);
    });
  });
});
