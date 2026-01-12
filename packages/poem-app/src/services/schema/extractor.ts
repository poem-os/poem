/**
 * Schema Extractor Service
 * Extracts JSON schemas from Handlebars templates by parsing placeholders and blocks
 */

import type {
  SchemaField,
  ExtractionResult,
  DualExtractionResult,
  UnifiedSchema,
  UnifiedSchemaExtractionResult,
} from './types.js';

/**
 * Known Handlebars built-in helpers (not custom helpers)
 */
const BUILTIN_HELPERS = new Set([
  'if',
  'unless',
  'each',
  'with',
  'lookup',
  'log',
]);

/**
 * SchemaExtractor class
 * Parses Handlebars templates and extracts schema information
 */
export class SchemaExtractor {
  /**
   * Extract schema from a Handlebars template
   * @param template - Handlebars template string
   * @returns ExtractionResult with fields and required helpers
   */
  extract(template: string): ExtractionResult {
    const fieldMap = new Map<string, SchemaField>();
    const helpers = new Set<string>();

    // Extract #each blocks (arrays)
    this.extractEachBlocks(template, fieldMap);

    // Extract #if blocks (booleans)
    this.extractIfBlocks(template, fieldMap, helpers);

    // Extract simple and nested placeholders
    this.extractPlaceholders(template, fieldMap, helpers);

    // Convert map to array, merging nested properties
    const fields = this.buildFieldArray(fieldMap);

    return {
      fields,
      requiredHelpers: Array.from(helpers).sort(),
    };
  }

  /**
   * Extract #each blocks and mark fields as arrays
   * Pattern: {{#each fieldName}}...{{/each}}
   */
  private extractEachBlocks(
    template: string,
    fieldMap: Map<string, SchemaField>
  ): void {
    const eachRegex = /\{\{#each\s+([^\s}]+)\s*\}\}/g;
    let match;

    while ((match = eachRegex.exec(template)) !== null) {
      const fieldPath = match[1].trim();
      // Handle dot notation - only take the root field as the array
      const rootField = fieldPath.split('.')[0];

      if (!fieldMap.has(rootField)) {
        fieldMap.set(rootField, {
          name: rootField,
          type: 'array',
          required: true,
        });
      } else {
        // Update existing field to be an array
        const existing = fieldMap.get(rootField)!;
        existing.type = 'array';
      }
    }
  }

  /**
   * Extract #if blocks and mark fields as booleans (unless already typed)
   * Also extracts helper calls like {{#if (gt length 20)}}
   */
  private extractIfBlocks(
    template: string,
    fieldMap: Map<string, SchemaField>,
    helpers: Set<string>
  ): void {
    // Match {{#if condition}} and {{#if (helper args)}}
    const ifRegex = /\{\{#if\s+(.+?)\s*\}\}/g;
    let match;

    while ((match = ifRegex.exec(template)) !== null) {
      const condition = match[1].trim();

      // Check for subexpression: (helperName arg1 arg2...)
      if (condition.startsWith('(')) {
        const subExprMatch = condition.match(/^\((\w+)\s+(.+)\)$/);
        if (subExprMatch) {
          const helperName = subExprMatch[1];
          const args = subExprMatch[2];

          // Add helper if not built-in
          if (!BUILTIN_HELPERS.has(helperName)) {
            helpers.add(helperName);
          }

          // Extract field names from arguments
          this.extractFieldsFromArgs(args, fieldMap);
        }
      } else {
        // Simple condition - treat as boolean field
        const fieldPath = condition;
        const rootField = fieldPath.split('.')[0];

        if (!fieldMap.has(rootField)) {
          fieldMap.set(rootField, {
            name: rootField,
            type: 'boolean',
            required: true,
          });
        }
      }
    }
  }

  /**
   * Extract simple placeholders and nested object paths
   * Also identifies helper calls
   */
  private extractPlaceholders(
    template: string,
    fieldMap: Map<string, SchemaField>,
    helpers: Set<string>
  ): void {
    // Match {{placeholder}} but not {{#block}}, {{/block}}, {{!comment}}, {{>partial}}
    const placeholderRegex = /\{\{(?!#|\/|!|>|else)([^{}]+)\}\}/g;
    let match;

    while ((match = placeholderRegex.exec(template)) !== null) {
      const content = match[1].trim();

      // Skip empty or whitespace only
      if (!content) continue;

      const parts = content.split(/\s+/);
      const firstPart = parts[0];

      // Check if first part is a helper call
      if (parts.length > 1 && this.looksLikeHelper(firstPart)) {
        // Helper call: {{helperName arg1 arg2}}
        if (!BUILTIN_HELPERS.has(firstPart)) {
          helpers.add(firstPart);
        }

        // Extract fields from arguments (skip string literals and numbers)
        for (let i = 1; i < parts.length; i++) {
          const arg = parts[i];
          if (this.isFieldReference(arg)) {
            this.addFieldPath(arg, fieldMap);
          }
        }
      } else {
        // Simple placeholder or nested path - only add if it's a valid field reference
        if (this.isFieldReference(firstPart)) {
          this.addFieldPath(firstPart, fieldMap);
        }
      }
    }
  }

  /**
   * Extract field references from argument string
   */
  private extractFieldsFromArgs(
    args: string,
    fieldMap: Map<string, SchemaField>
  ): void {
    // Split by whitespace, filtering out literals
    const parts = args.split(/\s+/);
    for (const part of parts) {
      if (this.isFieldReference(part)) {
        this.addFieldPath(part, fieldMap);
      }
    }
  }

  /**
   * Check if a string looks like a helper name (starts with lowercase, no dots)
   */
  private looksLikeHelper(str: string): boolean {
    return /^[a-z][a-zA-Z0-9]*$/.test(str) && !str.includes('.');
  }

  /**
   * Check if a string is a field reference (not a literal)
   */
  private isFieldReference(str: string): boolean {
    // Skip string literals
    if (str.startsWith('"') || str.startsWith("'")) return false;
    // Skip numbers
    if (/^\d+$/.test(str)) return false;
    // Skip boolean literals
    if (str === 'true' || str === 'false') return false;
    // Skip @index, @first, @last (each block variables)
    if (str.startsWith('@')) return false;
    // Skip this and this.* inside each blocks
    if (str === 'this' || str.startsWith('this.')) return false;

    return true;
  }

  /**
   * Add a field path to the field map
   * Handles dot notation for nested objects and array access
   */
  private addFieldPath(
    fieldPath: string,
    fieldMap: Map<string, SchemaField>
  ): void {
    // Handle array index access: items.[0] or items.0
    const cleanPath = fieldPath.replace(/\.\[\d+\]/g, '').replace(/\.\d+/g, '');

    // Check if original path had array access
    const hasArrayAccess =
      fieldPath.includes('.[') || /\.\d+/.test(fieldPath);

    const parts = cleanPath.split('.');
    const rootField = parts[0];

    // Skip empty root fields
    if (!rootField) return;

    if (hasArrayAccess) {
      // Root is an array
      if (!fieldMap.has(rootField)) {
        fieldMap.set(rootField, {
          name: rootField,
          type: 'array',
          required: true,
        });
      } else {
        fieldMap.get(rootField)!.type = 'array';
      }
    } else if (parts.length === 1) {
      // Simple field
      if (!fieldMap.has(rootField)) {
        fieldMap.set(rootField, {
          name: rootField,
          type: 'string',
          required: true,
        });
      }
    } else {
      // Nested object path
      if (!fieldMap.has(rootField)) {
        fieldMap.set(rootField, {
          name: rootField,
          type: 'object',
          required: true,
          properties: [],
        });
      } else {
        const existing = fieldMap.get(rootField)!;
        if (existing.type !== 'array') {
          existing.type = 'object';
          if (!existing.properties) {
            existing.properties = [];
          }
        }
      }

      // Add nested property
      const nestedPath = parts.slice(1).join('.');
      this.addNestedProperty(fieldMap.get(rootField)!, nestedPath);
    }
  }

  /**
   * Add a nested property to an object field
   */
  private addNestedProperty(field: SchemaField, path: string): void {
    if (!field.properties) {
      field.properties = [];
    }

    const parts = path.split('.');
    const propName = parts[0];

    // Find or create the property
    let prop = field.properties.find((p) => p.name === propName);

    if (!prop) {
      prop = {
        name: propName,
        type: parts.length > 1 ? 'object' : 'string',
        required: true,
      };
      field.properties.push(prop);
    }

    // Recurse for deeper nesting
    if (parts.length > 1) {
      prop.type = 'object';
      this.addNestedProperty(prop, parts.slice(1).join('.'));
    }
  }

  /**
   * Build the final field array from the map
   */
  private buildFieldArray(fieldMap: Map<string, SchemaField>): SchemaField[] {
    return Array.from(fieldMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  /**
   * @deprecated Use extractUnifiedSchema() instead. This method will be removed in a future version.
   * Extract both input and output schemas from a Handlebars template
   * @param template - Handlebars template string
   * @returns DualExtractionResult with input schema, output schema (or null), and helpers
   */
  extractDualSchema(template: string): DualExtractionResult {
    console.warn(
      'extractDualSchema() is deprecated. Use extractUnifiedSchema() for the new unified schema format.'
    );
    const inputResult = this.extract(template);
    const outputSchema = this.extractOutputSchema(template);

    return {
      inputSchema: inputResult.fields,
      outputSchema,
      requiredHelpers: inputResult.requiredHelpers,
    };
  }

  /**
   * Extract unified schema from a Handlebars template
   * Returns a single UnifiedSchema with both input and output sections
   * @param template - Handlebars template string
   * @param templateName - Name of the template (e.g., "generate-titles")
   * @param templatePath - Path to the template file
   * @returns UnifiedSchemaExtractionResult with unified schema
   */
  extractUnifiedSchema(
    template: string,
    templateName: string,
    templatePath: string
  ): UnifiedSchemaExtractionResult {
    // Extract input schema using existing logic
    const inputResult = this.extract(template);

    // Extract output schema (may be null)
    const outputFields = this.extractOutputSchema(template);

    // Build unified schema
    const unifiedSchema: UnifiedSchema = {
      templateName,
      version: '1.0.0',
      input: {
        fields: inputResult.fields,
      },
    };

    // Add output section if output schema was found
    if (outputFields && outputFields.length > 0) {
      unifiedSchema.output = {
        fields: outputFields,
      };
    }

    return {
      schema: unifiedSchema,
      requiredHelpers: inputResult.requiredHelpers,
      templatePath,
    };
  }

  /**
   * Extract output schema from template comments
   * Parses HTML and Handlebars comments for "Expected Output" or "Output Format" sections
   * @param template - Handlebars template string
   * @returns Array of schema fields or null if no output section found
   */
  extractOutputSchema(template: string): SchemaField[] | null {
    // Try to extract from HTML comments
    const htmlOutput = this.extractFromHTMLComments(template);
    if (htmlOutput) return htmlOutput;

    // Try to extract from Handlebars comments
    const hbsOutput = this.extractFromHandlebarsComments(template);
    if (hbsOutput) return hbsOutput;

    // No output section found
    return null;
  }

  /**
   * Extract output schema from HTML comments
   * Pattern: <!-- Expected Output: ... --> or <!-- Output Format: ... -->
   */
  private extractFromHTMLComments(template: string): SchemaField[] | null {
    const htmlCommentRegex = /<!--\s*(?:Expected Output|Output Format)\s*:\s*(.+?)\s*-->/is;
    const match = template.match(htmlCommentRegex);

    if (!match) return null;

    const outputDescription = match[1].trim();
    return this.parseOutputDescription(outputDescription);
  }

  /**
   * Extract output schema from Handlebars comments
   * Pattern: {{! Expected Output: ... }} or {{! Output Format: ... }}
   */
  private extractFromHandlebarsComments(template: string): SchemaField[] | null {
    const hbsCommentRegex = /\{\{!\s*(?:Expected Output|Output Format)\s*:\s*(.+?)\s*\}\}/is;
    const match = template.match(hbsCommentRegex);

    if (!match) return null;

    const outputDescription = match[1].trim();
    return this.parseOutputDescription(outputDescription);
  }

  /**
   * Parse output description and infer schema fields
   * Handles JSON structures and natural language descriptions
   */
  private parseOutputDescription(description: string): SchemaField[] {
    // Try to parse as JSON structure
    const jsonFields = this.parseJSONStructure(description);
    if (jsonFields.length > 0) return jsonFields;

    // Try to infer from natural language description
    return this.inferFromDescription(description);
  }

  /**
   * Parse JSON structure from output description
   * Example: { "title": "string", "views": number }
   */
  private parseJSONStructure(description: string): SchemaField[] {
    const fields: SchemaField[] = [];

    // Match JSON object patterns: "fieldName": type or "fieldName": "type"
    const jsonFieldRegex = /"(\w+)":\s*(?:"([^"]+)"|(\w+))/g;
    let match;

    while ((match = jsonFieldRegex.exec(description)) !== null) {
      const fieldName = match[1];
      const typeString = match[2] || match[3];
      const inferredType = this.inferTypeFromString(typeString);

      fields.push({
        name: fieldName,
        type: inferredType,
        required: true,
      });
    }

    return fields;
  }

  /**
   * Infer schema from natural language description
   * Example: "Array of 5 title strings, each under 60 characters"
   */
  private inferFromDescription(description: string): SchemaField[] {
    const fields: SchemaField[] = [];
    const lowerDesc = description.toLowerCase();

    // Check for array patterns
    if (lowerDesc.includes('array of') || lowerDesc.includes('list of')) {
      // Extract what type the array contains
      let itemType: SchemaField['type'] = 'string';

      if (lowerDesc.includes('number') || lowerDesc.includes('integer')) {
        itemType = 'number';
      } else if (lowerDesc.includes('boolean') || lowerDesc.includes('true/false')) {
        itemType = 'boolean';
      } else if (lowerDesc.includes('object')) {
        itemType = 'object';
      }

      // Extract field name if mentioned (e.g., "array of titles")
      // Skip numbers (e.g., "array of 5 title strings" should extract "title")
      const arrayFieldMatch = lowerDesc.match(/array of (?:\d+\s+)?([a-z]+)/);
      const fieldName = arrayFieldMatch ? arrayFieldMatch[1] : 'items';

      fields.push({
        name: fieldName,
        type: 'array',
        required: true,
        items: {
          name: fieldName.endsWith('s') ? fieldName.slice(0, -1) : fieldName,
          type: itemType,
          required: true,
        },
      });
    } else {
      // Single field - infer type from keywords
      let fieldType: SchemaField['type'] = 'string';

      if (lowerDesc.includes('number') || lowerDesc.includes('count') || lowerDesc.includes('integer')) {
        fieldType = 'number';
      } else if (lowerDesc.includes('boolean') || lowerDesc.includes('true/false')) {
        fieldType = 'boolean';
      } else if (lowerDesc.includes('object') || lowerDesc.includes('structure')) {
        fieldType = 'object';
      }

      fields.push({
        name: 'output',
        type: fieldType,
        required: true,
      });
    }

    return fields;
  }

  /**
   * Infer field type from type string
   */
  private inferTypeFromString(typeString: string): SchemaField['type'] {
    const lower = typeString.toLowerCase();

    if (lower === 'number' || lower === 'integer' || lower === 'int' || lower === 'float') {
      return 'number';
    } else if (lower === 'boolean' || lower === 'bool') {
      return 'boolean';
    } else if (lower === 'array' || lower.includes('[]')) {
      return 'array';
    } else if (lower === 'object') {
      return 'object';
    }

    // Default to string
    return 'string';
  }
}
