/**
 * Schema Service Type Definitions
 * Shared types for schema extraction, validation, and management
 */

/**
 * Represents a field in a schema
 */
export interface SchemaField {
  /** Field name (supports dot notation for nesting) */
  name: string;
  /** Field type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  /** Whether the field is required */
  required: boolean;
  /** Human-readable description */
  description?: string;
  /** For arrays, the item type */
  items?: SchemaField;
  /** For objects, nested field definitions */
  properties?: SchemaField[];
  /** Constraints for validation and mock data generation */
  constraints?: FieldConstraints;
}

/**
 * Field constraints for validation and mock data
 */
export interface FieldConstraints {
  /** Min/max for numbers */
  min?: number;
  max?: number;
  /** Min/max length for strings */
  minLength?: number;
  maxLength?: number;
  /** Enum values */
  enum?: string[];
  /** Faker.js method hint e.g., "person.firstName" */
  fakerHint?: string;
  /** Regex pattern */
  pattern?: string;
}

/**
 * Complete schema definition
 * Can represent input schemas, output schemas, or both
 */
export interface Schema {
  /** Relative path from /poem/schemas/ */
  path: string;
  /** Schema version */
  version: string;
  /** Human-readable description */
  description?: string;
  /** Schema type: input (data into prompt), output (data from prompt), or both */
  schemaType?: 'input' | 'output' | 'both';
  /** Field definitions */
  fields: SchemaField[];
}

/**
 * Result of schema extraction (input schemas only - legacy)
 */
export interface ExtractionResult {
  /** Extracted schema fields */
  fields: SchemaField[];
  /** Helper names used in the template */
  requiredHelpers: string[];
}

/**
 * Result of dual schema extraction (input + output)
 */
export interface DualExtractionResult {
  /** Extracted input schema fields */
  inputSchema: SchemaField[];
  /** Extracted output schema fields (null if no output section found) */
  outputSchema: SchemaField[] | null;
  /** Helper names used in the template */
  requiredHelpers: string[];
}

/**
 * Result of schema validation
 */
export interface ValidationResult {
  /** Whether the data is valid */
  valid: boolean;
  /** Validation errors */
  errors: ValidationError[];
}

/**
 * Schema validation error
 */
export interface ValidationError {
  /** Field path (dot notation) */
  field: string;
  /** Clear error message */
  message: string;
  /** Error severity */
  severity: 'error' | 'warning';
}
