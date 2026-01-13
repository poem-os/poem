/**
 * Mock Data Generator Service
 * Generates realistic mock data from schema definitions using Faker.js
 */

import { faker } from '@faker-js/faker';
import type { UnifiedSchema, SchemaField, FieldConstraints } from '../schema/types';
import { getYouTubeGenerator, getArrayItemCount } from './field-detector';

/**
 * Options for mock data generation
 */
export interface GenerateOptions {
  /** Number of records to generate (default: 1) */
  count?: number;
  /** Random seed for reproducible generation */
  seed?: number;
  /** Include edge cases (empty, max length, special chars) */
  includeEdgeCases?: boolean;
}

/**
 * Result of mock data generation
 */
export interface GenerateResult {
  /** Generated mock data records */
  data: Record<string, unknown>[];
  /** Number of records generated */
  count: number;
  /** Seed used for generation */
  seed: number;
  /** Warnings encountered during generation */
  warnings: string[];
}

/**
 * Generate mock data from a unified schema
 *
 * @param schema - UnifiedSchema to generate data from
 * @param options - Generation options
 * @returns Generated mock data with metadata
 */
export function generateFromSchema(
  schema: UnifiedSchema,
  options: GenerateOptions = {}
): GenerateResult {
  const {
    count = 1,
    seed = Date.now(),
    includeEdgeCases = false
  } = options;

  // Set seed for reproducible generation
  faker.seed(seed);

  const warnings: string[] = [];
  const data: Record<string, unknown>[] = [];

  // Generate the specified number of records
  for (let i = 0; i < count; i++) {
    const record: Record<string, unknown> = {};

    // Generate data for input fields
    for (const field of schema.input.fields) {
      try {
        const value = generateFieldValue(field, includeEdgeCases);
        record[field.name] = value;
      } catch (error) {
        warnings.push(`Failed to generate field "${field.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Use fallback value
        record[field.name] = getFallbackValue(field.type);
      }
    }

    data.push(record);
  }

  return {
    data,
    count: data.length,
    seed,
    warnings
  };
}

/**
 * Generate a value for a single schema field
 *
 * @param field - Schema field definition
 * @param includeEdgeCases - Whether to include edge cases
 * @returns Generated field value
 */
export function generateFieldValue(
  field: SchemaField,
  includeEdgeCases: boolean = false
): unknown {
  const { type, constraints } = field;

  // Handle array and object types first (they need recursive generation)
  if (type === 'array') {
    return generateArray(field, includeEdgeCases);
  }

  if (type === 'object') {
    return generateObject(field, includeEdgeCases);
  }

  // Check for YouTube-specific field patterns (for non-array/object fields)
  const youtubeValue = generateYouTubeSpecificValue(field);
  if (youtubeValue !== null) {
    return youtubeValue;
  }

  // Check for fakerHint
  if (constraints?.fakerHint) {
    return generateFromFakerHint(constraints.fakerHint, constraints);
  }

  // Generate based on type
  switch (type) {
    case 'string':
      return generateString(constraints, includeEdgeCases);
    case 'number':
      return generateNumber(constraints);
    case 'boolean':
      return generateBoolean();
    default:
      return null;
  }
}

/**
 * Generate string value with constraints
 */
function generateString(constraints?: FieldConstraints, includeEdgeCases: boolean = false): string {
  // Check for enum values
  if (constraints?.enum && constraints.enum.length > 0) {
    return faker.helpers.arrayElement(constraints.enum);
  }

  // Generate based on length constraints
  const minLength = constraints?.minLength ?? 10;
  const maxLength = constraints?.maxLength ?? 100;

  if (includeEdgeCases && faker.number.int({ min: 0, max: 2 }) === 0) {
    // Return edge case
    return faker.number.int({ min: 0, max: 1 }) === 0 ? '' : 'x'.repeat(maxLength);
  }

  // Generate realistic text
  const targetLength = faker.number.int({ min: minLength, max: maxLength });
  let text = faker.lorem.sentence();

  // Adjust to target length
  while (text.length < targetLength) {
    text += ' ' + faker.lorem.sentence();
  }

  return text.slice(0, maxLength);
}

/**
 * Generate number value with constraints
 */
function generateNumber(constraints?: FieldConstraints): number {
  const min = constraints?.min ?? 0;
  const max = constraints?.max ?? 1000;

  return faker.number.int({ min, max });
}

/**
 * Generate boolean value
 */
function generateBoolean(): boolean {
  return faker.datatype.boolean();
}

/**
 * Generate array value
 */
function generateArray(field: SchemaField, includeEdgeCases: boolean): unknown[] {
  if (!field.items) {
    // No item schema specified, return empty array
    return [];
  }

  // Determine array size using field detector
  const { min: minItems, max: maxItems } = getArrayItemCount(field);
  const itemCount = faker.number.int({ min: minItems, max: maxItems });

  const array: unknown[] = [];
  for (let i = 0; i < itemCount; i++) {
    const value = generateFieldValue(field.items, includeEdgeCases);
    array.push(value);
  }

  return array;
}

/**
 * Generate object value with nested properties
 */
function generateObject(field: SchemaField, includeEdgeCases: boolean): Record<string, unknown> {
  if (!field.properties || field.properties.length === 0) {
    return {};
  }

  const obj: Record<string, unknown> = {};

  for (const property of field.properties) {
    obj[property.name] = generateFieldValue(property, includeEdgeCases);
  }

  return obj;
}

/**
 * Generate value from Faker.js hint
 *
 * @param hint - Faker.js method path (e.g., "person.firstName", "lorem.paragraph")
 * @param constraints - Optional constraints
 * @returns Generated value
 */
function generateFromFakerHint(hint: string, constraints?: FieldConstraints): unknown {
  try {
    const parts = hint.split('.');
    let current: any = faker;

    // Navigate to the faker method
    for (const part of parts) {
      current = current[part];
      if (current === undefined) {
        throw new Error(`Invalid faker hint: ${hint}`);
      }
    }

    // Call the method if it's a function
    if (typeof current === 'function') {
      // Pass constraints if applicable
      if (constraints) {
        return current(constraints);
      }
      return current();
    }

    return current;
  } catch (error) {
    // Fallback to lorem text if hint fails
    return faker.lorem.sentence();
  }
}

/**
 * Check for YouTube-specific field patterns and generate appropriate content
 * Returns null if field doesn't match YouTube patterns
 */
function generateYouTubeSpecificValue(field: SchemaField): unknown | null {
  const generator = getYouTubeGenerator(field);

  if (generator) {
    return generator();
  }

  return null;
}

/**
 * Get fallback value for a type when generation fails
 */
function getFallbackValue(type: string): unknown {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      return {};
    default:
      return null;
  }
}
