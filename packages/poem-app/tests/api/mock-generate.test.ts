/**
 * Mock Generate API Integration Tests
 * Tests POST /api/mock/generate endpoint
 */

import { describe, it, expect } from 'vitest';
import type { UnifiedSchema } from '../../src/services/schema/types';

// Mock fetch for Astro API testing
const baseUrl = 'http://localhost:4321';

describe('POST /api/mock/generate', () => {
  const testSchema: UnifiedSchema = {
    templateName: 'test-template',
    version: '1.0.0',
    input: {
      fields: [
        { name: 'title', type: 'string', required: true },
        { name: 'count', type: 'number', required: true },
        { name: 'active', type: 'boolean', required: true }
      ]
    }
  };

  describe('Success cases', () => {
    it('should generate mock data from inline schema', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: testSchema,
          count: 1
        })
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('title');
      expect(result.data[0]).toHaveProperty('count');
      expect(result.data[0]).toHaveProperty('active');
    });

    it('should generate multiple records when count specified', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: testSchema,
          count: 5
        })
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(5);
      expect(result.count).toBe(5);
    });

    it('should use seed for reproducible generation', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request1 = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: testSchema,
          seed: 12345
        })
      });

      const request2 = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: testSchema,
          seed: 12345
        })
      });

      const response1 = await POST({ request: request1 } as any);
      const response2 = await POST({ request: request2 } as any);

      const result1 = await response1.json();
      const result2 = await response2.json();

      expect(result1.data[0]).toEqual(result2.data[0]);
      expect(result1.seed).toBe(result2.seed);
    });

    it('should include seed in response metadata', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: testSchema,
          seed: 99999
        })
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(result.seed).toBe(99999);
    });

    it('should include warnings in response', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: testSchema
        })
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('Error cases', () => {
    it('should return 400 when schema is missing', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toContain('schema');
    });

    it('should return 400 for invalid inline schema structure', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: {
            // Missing required fields
            invalidField: true
          }
        })
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid schema');
    });

    it('should return 400 for invalid schema parameter type', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: 12345 // Invalid type
        })
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
    });

    it('should include error details in response', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(result.details).toBeDefined();
      expect(result.details.message).toBeDefined();
    });
  });

  describe('YouTube-specific generation', () => {
    it('should generate YouTube-specific fields correctly', async () => {
      const { POST } = await import('../../src/pages/api/mock/generate');

      const youtubeSchema: UnifiedSchema = {
        templateName: 'youtube-test',
        version: '1.0.0',
        input: {
          fields: [
            { name: 'videoTitle', type: 'string', required: true },
            { name: 'videoKeywords', type: 'array', required: true, items: { name: 'keyword', type: 'string', required: true } },
            { name: 'transcriptAbridgement', type: 'string', required: true }
          ]
        }
      };

      const request = new Request(baseUrl + '/api/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema: youtubeSchema
        })
      });

      const response = await POST({ request } as any);
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data[0].videoTitle).toBeDefined();
      expect((result.data[0].videoTitle as string).length).toBeGreaterThan(0);
      expect(Array.isArray(result.data[0].videoKeywords)).toBe(true);
      expect((result.data[0].videoKeywords as unknown[]).length).toBeGreaterThan(0);
      expect(result.data[0].transcriptAbridgement).toBeDefined();
      expect((result.data[0].transcriptAbridgement as string).length).toBeGreaterThan(100);
    });
  });
});
