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
 * Unified schema structure with input and output sections
 * Like a function signature: (input) -> output
 */
export interface UnifiedSchema {
  /** Prompt template name (e.g., "generate-titles") */
  templateName: string;
  /** Schema version (e.g., "1.0.0") */
  version: string;
  /** Human-readable description */
  description?: string;
  /** Input schema section (required) */
  input: {
    fields: SchemaField[];
  };
  /** Output schema section (optional) */
  output?: {
    fields: SchemaField[];
  };
}

/**
 * @deprecated Use UnifiedSchema instead. This interface will be removed in a future version.
 * Complete schema definition (legacy format with separate files)
 * Can represent input schemas, output schemas, or both
 */
export interface Schema {
  /** Relative path from /poem/schemas/ */
  path: string;
  /** Schema version */
  version: string;
  /** Human-readable description */
  description?: string;
  /** @deprecated Use UnifiedSchema input/output sections instead */
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
 * @deprecated Use UnifiedSchemaExtractionResult instead
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
 * Result of unified schema extraction
 */
export interface UnifiedSchemaExtractionResult {
  /** Extracted unified schema */
  schema: UnifiedSchema;
  /** Helper names used in the template */
  requiredHelpers: string[];
  /** Template file path */
  templatePath: string;
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

/**
 * Type guard to check if a value is a UnifiedSchema
 */
export function isUnifiedSchema(value: unknown): value is UnifiedSchema {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.templateName === 'string' &&
    typeof obj.version === 'string' &&
    typeof obj.input === 'object' &&
    obj.input !== null &&
    Array.isArray((obj.input as { fields?: unknown }).fields)
  );
}

/**
 * Type guard to check if a value is a legacy Schema
 */
export function isLegacySchema(value: unknown): value is Schema {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.path === 'string' &&
    typeof obj.version === 'string' &&
    Array.isArray(obj.fields) &&
    !('templateName' in obj) // Distinguish from UnifiedSchema
  );
}
