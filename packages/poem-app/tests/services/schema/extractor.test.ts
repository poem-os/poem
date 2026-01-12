/**
 * Unit tests for SchemaExtractor service
 */

import { describe, it, expect } from 'vitest';
import { SchemaExtractor } from '../../../src/services/schema/extractor.js';
import type { SchemaField } from '../../../src/services/schema/types.js';

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

  describe('Output Schema Extraction', () => {
    describe('extractOutputSchema from HTML comments', () => {
      it('should extract output schema from HTML comment with JSON structure', () => {
        const template = `
{{transcriptAbridgement}}
<!-- Expected Output: { "title": "string", "description": "string" } -->
`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema).toHaveLength(2);
        expect(outputSchema![0]).toEqual({
          name: 'title',
          type: 'string',
          required: true,
        });
        expect(outputSchema![1]).toEqual({
          name: 'description',
          type: 'string',
          required: true,
        });
      });

      it('should extract output schema with number type', () => {
        const template = `<!-- Expected Output: { "title": "string", "views": number } -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema![1]).toEqual({
          name: 'views',
          type: 'number',
          required: true,
        });
      });

      it('should handle "Output Format" keyword', () => {
        const template = `<!-- Output Format: { "result": "boolean" } -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema![0]).toEqual({
          name: 'result',
          type: 'boolean',
          required: true,
        });
      });

      it('should handle case-insensitive pattern matching', () => {
        const template = `<!-- expected output: { "value": "string" } -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema).toHaveLength(1);
      });
    });

    describe('extractOutputSchema from Handlebars comments', () => {
      it('should extract output schema from Handlebars comment', () => {
        const template = `
{{transcriptAbridgement}}
{{! Expected Output: { "category": "string", "confidence": number } }}
`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema).toHaveLength(2);
        expect(outputSchema![0].name).toBe('category');
        expect(outputSchema![1].name).toBe('confidence');
        expect(outputSchema![1].type).toBe('number');
      });

      it('should handle "Output Format" in Handlebars comment', () => {
        const template = `{{! Output Format: { "success": boolean } }}`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema![0].type).toBe('boolean');
      });
    });

    describe('infer from natural language description', () => {
      it('should infer array schema from "array of" description', () => {
        const template = `<!-- Expected Output: Array of 5 title strings, each under 60 characters -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema![0]).toEqual({
          name: 'title',
          type: 'array',
          required: true,
          items: {
            name: 'title',
            type: 'string',
            required: true,
          },
        });
      });

      it('should infer array of numbers', () => {
        const template = `<!-- Expected Output: List of integers -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema![0].type).toBe('array');
        expect(outputSchema![0].items?.type).toBe('number');
      });

      it('should infer single string field from description', () => {
        const template = `<!-- Expected Output: A formatted title string -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema![0]).toEqual({
          name: 'output',
          type: 'string',
          required: true,
        });
      });

      it('should infer number field from description', () => {
        const template = `<!-- Expected Output: Count of matching items -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema![0].type).toBe('number');
      });

      it('should infer boolean field from description', () => {
        const template = `<!-- Expected Output: Boolean indicating success -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        expect(outputSchema![0].type).toBe('boolean');
      });
    });

    describe('return null when no output section found', () => {
      it('should return null when no HTML comment exists', () => {
        const template = `{{transcriptAbridgement}}`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).toBeNull();
      });

      it('should return null when HTML comment does not match pattern', () => {
        const template = `<!-- This is a regular comment -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).toBeNull();
      });

      it('should return null when no Handlebars comment matches', () => {
        const template = `{{! This is a regular comment }}`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).toBeNull();
      });
    });

    describe('handle malformed output sections gracefully', () => {
      it('should handle empty output description', () => {
        const template = `<!-- Expected Output: -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        // Should still extract, but might have default field
        expect(outputSchema).not.toBeNull();
      });

      it('should handle malformed JSON structure', () => {
        const template = `<!-- Expected Output: { broken json -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        // Should not crash, should try to infer from description
        expect(outputSchema).not.toBeNull();
      });

      it('should handle unexpected type strings', () => {
        const template = `<!-- Expected Output: { "field": unknownType } -->`;
        const outputSchema = extractor.extractOutputSchema(template);

        expect(outputSchema).not.toBeNull();
        // Should default to string
        expect(outputSchema![0].type).toBe('string');
      });
    });

    describe('extractDualSchema', () => {
      it('should extract both input and output schemas', () => {
        const template = `
{{transcriptAbridgement}}
{{contentAnalysis}}
<!-- Expected Output: { "titles": "array" } -->
`;
        const result = extractor.extractDualSchema(template);

        expect(result.inputSchema).toHaveLength(2);
        expect(result.inputSchema[0].name).toBe('contentAnalysis');
        expect(result.inputSchema[1].name).toBe('transcriptAbridgement');

        expect(result.outputSchema).not.toBeNull();
        expect(result.outputSchema).toHaveLength(1);
        expect(result.outputSchema![0].name).toBe('titles');
      });

      it('should return null output schema when no output section exists', () => {
        const template = `{{field1}} {{field2}}`;
        const result = extractor.extractDualSchema(template);

        expect(result.inputSchema).toHaveLength(2);
        expect(result.outputSchema).toBeNull();
      });

      it('should include required helpers in dual extraction', () => {
        const template = `
{{truncate title 50}}
{{formatTimestamp timestamp}}
<!-- Expected Output: { "result": "string" } -->
`;
        const result = extractor.extractDualSchema(template);

        expect(result.requiredHelpers).toContain('truncate');
        expect(result.requiredHelpers).toContain('formatTimestamp');
        expect(result.outputSchema).not.toBeNull();
      });
    });

    describe('extractUnifiedSchema (new unified format)', () => {
      it('should extract unified schema with input and output sections', () => {
        const template = `
Generate YouTube video titles for: {{topic}}
Target audience: {{audience}}

<!-- Expected Output: { "title": string, "count": number } -->
`;
        const result = extractor.extractUnifiedSchema(template, 'generate-titles', 'prompts/generate-titles.hbs');

        expect(result.schema).toBeDefined();
        expect(result.schema.templateName).toBe('generate-titles');
        expect(result.schema.version).toBe('1.0.0');
        expect(result.schema.input.fields).toHaveLength(2);
        expect(result.schema.input.fields.find((f) => f.name === 'topic')).toBeDefined();
        expect(result.schema.input.fields.find((f) => f.name === 'audience')).toBeDefined();
        expect(result.schema.output).toBeDefined();
        expect(result.schema.output!.fields).toHaveLength(2);
        expect(result.schema.output!.fields.find((f) => f.name === 'title')).toBeDefined();
        expect(result.schema.output!.fields.find((f) => f.name === 'count')).toBeDefined();
        expect(result.templatePath).toBe('prompts/generate-titles.hbs');
      });

      it('should extract unified schema without output section', () => {
        const template = `Send email to {{recipient}} with subject: {{subject}}`;
        const result = extractor.extractUnifiedSchema(template, 'send-email', 'prompts/send-email.hbs');

        expect(result.schema.templateName).toBe('send-email');
        expect(result.schema.input.fields).toHaveLength(2);
        expect(result.schema.output).toBeUndefined();
      });

      it('should include required helpers in unified extraction', () => {
        const template = `
{{truncate title 50}}
{{formatTimestamp timestamp}}
<!-- Expected Output: { "result": "string" } -->
`;
        const result = extractor.extractUnifiedSchema(template, 'test-helpers', 'prompts/test.hbs');

        expect(result.requiredHelpers).toContain('truncate');
        expect(result.requiredHelpers).toContain('formatTimestamp');
        expect(result.schema.output).toBeDefined();
      });

      it('should handle complex nested input structures', () => {
        const template = `
User: {{user.firstName}} {{user.lastName}}
Email: {{user.email}}
Address: {{user.address.city}}, {{user.address.state}}
`;
        const result = extractor.extractUnifiedSchema(template, 'user-info', 'prompts/user-info.hbs');

        expect(result.schema.input.fields).toHaveLength(1);
        expect(result.schema.input.fields[0].name).toBe('user');
        expect(result.schema.input.fields[0].type).toBe('object');
        expect(result.schema.input.fields[0].properties).toBeDefined();
        expect(result.schema.input.fields[0].properties!.length).toBeGreaterThan(0);
      });

      it('should handle array input fields', () => {
        const template = `
{{#each items}}
  - {{this}}
{{/each}}
`;
        const result = extractor.extractUnifiedSchema(template, 'list-items', 'prompts/list.hbs');

        expect(result.schema.input.fields).toHaveLength(1);
        expect(result.schema.input.fields[0].name).toBe('items');
        expect(result.schema.input.fields[0].type).toBe('array');
      });

      it('should extract unified schema from real-world template', () => {
        const template = `
You are a YouTube content strategist.

Given the following video transcript abridgement:
{{transcriptAbridgement}}

Generate 5 compelling video titles that:
- Capture the main topic
- Are under 60 characters
- Include relevant keywords
- Drive clicks

<!-- Expected Output:
{
  "title": string,
  "keyword": string,
  "confidence": number
}
-->
`;
        const result = extractor.extractUnifiedSchema(template, 'youtube-titles', 'prompts/youtube-titles.hbs');

        expect(result.schema.templateName).toBe('youtube-titles');
        expect(result.schema.input.fields).toHaveLength(1);
        expect(result.schema.input.fields[0].name).toBe('transcriptAbridgement');
        expect(result.schema.output).toBeDefined();
        expect(result.schema.output!.fields).toHaveLength(3);
        expect(result.schema.output!.fields.find((f) => f.name === 'title')).toBeDefined();
        expect(result.schema.output!.fields.find((f) => f.name === 'keyword')).toBeDefined();
        expect(result.schema.output!.fields.find((f) => f.name === 'confidence')).toBeDefined();
      });
    });
  });
});
