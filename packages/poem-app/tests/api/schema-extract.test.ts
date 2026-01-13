/**
 * Integration tests for POST /api/schema/extract
 *
 * Skip in CI/pre-commit - requires running server
 * Run manually with: INTEGRATION_TEST=1 npm test
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const TEST_PORT = 4398;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Skip integration tests in CI/pre-commit - they require a running server
const SKIP_INTEGRATION = !process.env.INTEGRATION_TEST;

describe.skipIf(SKIP_INTEGRATION)('POST /api/schema/extract', () => {
  let serverProcess: ChildProcess | null = null;

  // Fixture paths
  const fixtureSource = path.resolve(__dirname, '../fixtures/prompts/hello.hbs');
  const projectRoot = path.resolve(__dirname, '../../../..');
  const devWorkspacePrompts = path.join(projectRoot, 'dev-workspace/prompts');
  const testFixtureDest = path.join(devWorkspacePrompts, 'test/hello.hbs');

  beforeAll(async () => {
    // Copy test fixture to dev-workspace for file-based template tests
    await fs.mkdir(path.dirname(testFixtureDest), { recursive: true });
    await fs.copyFile(fixtureSource, testFixtureDest);

    // Start the server on a unique port for testing
    serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      env: { ...process.env, PORT: String(TEST_PORT), POEM_DEV: 'true' },
      stdio: 'pipe',
    });

    // Wait for server to be ready
    await waitForServer(BASE_URL, 10000);
  }, 15000);

  afterAll(async () => {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
    // Clean up test fixture from dev-workspace
    try {
      await fs.unlink(testFixtureDest);
      await fs.rmdir(path.dirname(testFixtureDest));
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Raw Template Extraction (AC: 1, 2, 3)', () => {
    it('should extract schema from a simple raw template', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'Hello {{name}}',
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.schema).toBeDefined();
      expect(result.schema.input).toBeDefined();
      expect(result.schema.input.fields).toHaveLength(1);
      expect(result.schema.input.fields[0].name).toBe('name');
      expect(result.schema.input.fields[0].type).toBe('string');
      expect(result.schema.output).toBeUndefined(); // No output section in this template
    });

    it('should extract multiple fields', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{firstName}} {{lastName}}',
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.schema.input.fields).toHaveLength(2);
    });

    it('should have correct Content-Type header', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{name}}',
          isRawTemplate: true,
        }),
      });

      expect(response.headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('Nested Object Extraction (AC: 4)', () => {
    it('should extract nested object paths', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{user.email}}',
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();

      expect(result.schema.input.fields).toHaveLength(1);
      expect(result.schema.input.fields[0].name).toBe('user');
      expect(result.schema.input.fields[0].type).toBe('object');
      expect(result.schema.input.fields[0].properties).toHaveLength(1);
      expect(result.schema.input.fields[0].properties[0].name).toBe('email');
    });

    it('should merge multiple nested properties', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{user.firstName}} {{user.lastName}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.schema.input.fields[0].properties).toHaveLength(2);
    });

    it('should handle deeply nested paths', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{user.address.city}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.schema.input.fields[0].name).toBe('user');
      expect(result.schema.input.fields[0].properties[0].name).toBe('address');
      expect(result.schema.input.fields[0].properties[0].properties[0].name).toBe('city');
    });
  });

  describe('Array Extraction (AC: 5)', () => {
    it('should extract #each blocks as arrays', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{#each items}}{{this}}{{/each}}',
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();

      expect(result.schema.input.fields).toHaveLength(1);
      expect(result.schema.input.fields[0].name).toBe('items');
      expect(result.schema.input.fields[0].type).toBe('array');
    });

    it('should extract array index access', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{items.[0]}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.schema.input.fields[0].type).toBe('array');
    });
  });

  describe('Boolean Extraction', () => {
    it('should extract #if conditions as booleans', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{#if active}}Active{{/if}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.schema.input.fields[0].name).toBe('active');
      expect(result.schema.input.fields[0].type).toBe('boolean');
    });
  });

  describe('Helper Detection (AC: 6)', () => {
    it('should identify required helpers', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{truncate title 50}}',
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();

      expect(result.requiredHelpers).toBeDefined();
      expect(result.requiredHelpers).toContain('truncate');
    });

    it('should identify multiple helpers', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{truncate title 50}} {{upperCase name}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.requiredHelpers).toContain('truncate');
      expect(result.requiredHelpers).toContain('upperCase');
    });

    it('should not include built-in helpers', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{#if active}}{{/if}}{{#each items}}{{/each}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.requiredHelpers).not.toContain('if');
      expect(result.requiredHelpers).not.toContain('each');
    });

    it('should identify unregistered helpers', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{nonExistentHelper value}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.unregisteredHelpers).toBeDefined();
      expect(result.unregisteredHelpers).toContain('nonExistentHelper');
    });

    it('should identify helper in subexpression', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{#if (gt length 20)}}Too long{{/if}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.requiredHelpers).toContain('gt');
    });
  });

  describe('Schema Format (AC: 7)', () => {
    it('should return schema with fields array', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{name}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      expect(result.schema.input).toHaveProperty('fields');
      expect(Array.isArray(result.schema.input.fields)).toBe(true);
    });

    it('should include name, type, required for each field', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{{name}}',
          isRawTemplate: true,
        }),
      });

      const result = await response.json();
      const field = result.schema.input.fields[0];
      expect(field).toHaveProperty('name');
      expect(field).toHaveProperty('type');
      expect(field).toHaveProperty('required');
    });
  });

  describe('Error Handling', () => {
    it('should return 400 for invalid JSON body', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json',
      });

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON');
    });

    it('should return 400 for missing template field', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.success).toBe(false);
    });

    it('should return 400 for empty template', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '',
          isRawTemplate: true,
        }),
      });

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.success).toBe(false);
    });

    it('should return 404 for non-existent template file', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'non-existent/template.hbs',
          isRawTemplate: false,
        }),
      });

      expect(response.status).toBe(404);
      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
      expect(result.details.path).toBeDefined();
    });

    it('should include error details with context', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'non-existent.hbs',
          isRawTemplate: false,
        }),
      });

      const result = await response.json();
      expect(result.details).toBeDefined();
    });
  });

  describe('File-based Templates', () => {
    it('should extract schema from file-based template', async () => {
      // Uses the test template from Story 2.5
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'test/hello.hbs',
          isRawTemplate: false,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.templatePath).toBeDefined();
      expect(result.schema.input.fields).toBeDefined();
    });

    it('should include templatePath in response for file-based templates', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'test/hello.hbs',
          isRawTemplate: false,
        }),
      });

      const result = await response.json();
      expect(result.templatePath).toContain('prompts');
      expect(result.templatePath).toContain('test/hello.hbs');
    });
  });

  describe('Default Values', () => {
    it('should default isRawTemplate to false', async () => {
      // When isRawTemplate is not provided, template should be treated as a file path
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'some-template.hbs',
        }),
      });

      // Should return 404 since we're treating it as a file path
      expect(response.status).toBe(404);
    });
  });

  describe('Dual Schema Extraction (AC: Task 5)', () => {
    it('should extract both input and output schemas when output section present', async () => {
      const template = `
        {{name}} {{age}}
        <!-- Expected Output: { "title": "string", "count": number } -->
      `;

      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();

      // Check input schema
      expect(result.schema.input).toBeDefined();
      expect(result.schema.input.fields).toHaveLength(2);
      const inputFieldNames = result.schema.input.fields.map((f: { name: string }) => f.name);
      expect(inputFieldNames).toContain('name');
      expect(inputFieldNames).toContain('age');

      // Check output schema
      expect(result.schema.output).toBeDefined();
      expect(result.schema.output).toBeDefined();
      expect(result.schema.output.fields).toHaveLength(2);
      const outputFieldNames = result.schema.output.fields.map((f: { name: string }) => f.name);
      expect(outputFieldNames).toContain('title');
      expect(outputFieldNames).toContain('count');
    });

    it('should return null output schema when no output section present', async () => {
      const template = '{{name}} {{age}}';

      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();

      expect(result.schema.input).toBeDefined();
      expect(result.schema.output).toBeUndefined();
    });

    it('should extract output schema from Handlebars comment', async () => {
      const template = `
        {{title}}
        {{! Output Format: Array of 5 title strings }}
      `;

      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();

      expect(result.schema.output).toBeDefined();
      expect(result.schema.output).toBeDefined();
      expect(result.schema.output.fields[0].type).toBe('array');
    });
  });

  describe('Complex Templates', () => {
    it('should handle a complex template with multiple patterns', async () => {
      const template = `
        {{#if showTitle}}
          <h1>{{truncate title 50}}</h1>
        {{/if}}
        <p>By {{author.name}}</p>
        {{#each chapters}}
          <h2>{{this.title}}</h2>
        {{/each}}
      `;

      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();

      // Check fields
      const fieldNames = result.schema.input.fields.map((f: { name: string }) => f.name);
      expect(fieldNames).toContain('showTitle');
      expect(fieldNames).toContain('title');
      expect(fieldNames).toContain('author');
      expect(fieldNames).toContain('chapters');

      // Check types
      const showTitle = result.schema.input.fields.find((f: { name: string }) => f.name === 'showTitle');
      expect(showTitle.type).toBe('boolean');

      const chapters = result.schema.input.fields.find((f: { name: string }) => f.name === 'chapters');
      expect(chapters.type).toBe('array');

      const author = result.schema.input.fields.find((f: { name: string }) => f.name === 'author');
      expect(author.type).toBe('object');
      expect(author.properties).toBeDefined();

      // Check helpers
      expect(result.requiredHelpers).toContain('truncate');
    });

    it('should handle empty template', async () => {
      const response = await fetch(`${BASE_URL}/api/schema/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'No placeholders here',
          isRawTemplate: true,
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.schema.input.fields).toHaveLength(0);
      expect(result.requiredHelpers).toHaveLength(0);
    });
  });
});

/**
 * Wait for server to be ready
 */
async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  const healthUrl = `${url}/api/health`;

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Server did not start within ${timeoutMs}ms`);
}
