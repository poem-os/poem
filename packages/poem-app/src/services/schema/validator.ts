/**
 * Schema Validator Service
 * Validates data against JSON schemas, reporting errors with field paths and messages
 */

import type {
  SchemaField,
  ValidationResult,
  ValidationError,
  UnifiedSchema,
  Schema,
} from './types.js';
import { isUnifiedSchema, isLegacySchema } from './types.js';

/**
 * SchemaValidator class
 * Validates data against schema definitions
 */
export class SchemaValidator {
  /**
   * Validate data against a unified schema
   * @param data - Data to validate (can be object, array, string, etc.)
   * @param schema - Unified schema with input/output sections
   * @param schemaSection - Which section to validate against ('input' or 'output')
   * @returns ValidationResult with valid flag and error array
   */
  validateUnified(
    data: unknown,
    schema: UnifiedSchema,
    schemaSection: 'input' | 'output'
  ): ValidationResult {
    // Select the appropriate section from the unified schema
    const section = schemaSection === 'input' ? schema.input : schema.output;

    if (!section) {
      return {
        valid: false,
        errors: [
          {
            field: '<root>',
            message: `Schema does not have an ${schemaSection} section`,
            severity: 'error',
          },
        ],
      };
    }

    // Validate against the selected section
    return this.validateFields(data, section.fields, schemaSection);
  }

  /**
   * Validate data against a schema
   * @deprecated Use validateUnified() instead. This method is for backward compatibility only.
   * @param data - Data to validate (can be object, array, string, etc.)
   * @param schema - Schema fields to validate against OR legacy Schema object OR UnifiedSchema
   * @param schemaSection - (Optional) For UnifiedSchema, which section to validate ('input' or 'output')
   * @returns ValidationResult with valid flag and error array
   */
  validate(
    data: unknown,
    schema: SchemaField[] | Schema | UnifiedSchema,
    schemaSection?: 'input' | 'output'
  ): ValidationResult {
    // Handle UnifiedSchema with schemaSection (redirect to new method)
    if (isUnifiedSchema(schema)) {
      if (!schemaSection) {
        console.warn(
          '[DEPRECATED] validate() called with UnifiedSchema but no schemaSection. Defaulting to "input". Use validateUnified() instead.'
        );
        schemaSection = 'input';
      }
      return this.validateUnified(data, schema, schemaSection);
    }

    // Handle legacy Schema object
    if (isLegacySchema(schema)) {
      console.warn(
        '[DEPRECATED] validate() called with legacy Schema format. Use UnifiedSchema and validateUnified() instead.'
      );
      return this.validateFields(data, schema.fields);
    }

    // Handle raw SchemaField[] (original behavior)
    console.warn(
      '[DEPRECATED] validate() called with raw SchemaField[]. Use UnifiedSchema and validateUnified() instead.'
    );
    return this.validateFields(data, schema);
  }

  /**
   * Validate data against schema fields
   * @param data - Data to validate
   * @param schema - Schema fields to validate against
   * @param schemaSection - (Optional) Which section is being validated (for error messages)
   * @returns ValidationResult with valid flag and error array
   */
  private validateFields(
    data: unknown,
    schema: SchemaField[],
    schemaSection?: 'input' | 'output'
  ): ValidationResult {
    const errors: ValidationError[] = [];

    // Handle unstructured text outputs (AC6)
    if (typeof data === 'string' && schema.length === 1 && schema[0].type === 'string') {
      // Simple string validation
      return {
        valid: true,
        errors: [],
      };
    }

    // Handle structured data (objects/arrays)
    if (typeof data !== 'object' || data === null) {
      errors.push({
        field: '<root>',
        message: 'Expected object or array but received ' + typeof data,
        severity: 'error',
      });
      return {
        valid: false,
        errors,
      };
    }

    // Validate each schema field against the data
    for (const field of schema) {
      this.validateField(field, data, '', errors, schemaSection);
    }

    return {
      valid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Validate a single field
   * @param field - Schema field definition
   * @param data - Data object to validate
   * @param parentPath - Parent field path (for nested validation)
   * @param errors - Errors array to populate
   * @param schemaSection - (Optional) Which section is being validated (for error context)
   */
  private validateField(
    field: SchemaField,
    data: Record<string, unknown> | unknown[],
    parentPath: string,
    errors: ValidationError[],
    schemaSection?: 'input' | 'output'
  ): void {
    const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
    const value = Array.isArray(data) ? data : (data as Record<string, unknown>)[field.name];
    const sectionPrefix = schemaSection ? `[${schemaSection}] ` : '';

    // Check required field presence (AC5)
    if (field.required && (value === undefined || value === null)) {
      errors.push({
        field: fieldPath,
        message: `${sectionPrefix}Field '${fieldPath}' is required but missing`,
        severity: 'error',
      });
      return;
    }

    // Skip validation if field is optional and missing
    if (!field.required && (value === undefined || value === null)) {
      return;
    }

    // Validate field type (AC5)
    this.validateType(field, value, fieldPath, errors, schemaSection);

    // Validate format constraints if specified
    if (field.constraints) {
      this.validateConstraints(field, value, fieldPath, errors, schemaSection);
    }
  }

  /**
   * Validate field type correctness
   */
  private validateType(
    field: SchemaField,
    value: unknown,
    fieldPath: string,
    errors: ValidationError[],
    schemaSection?: 'input' | 'output'
  ): void {
    const actualType = this.getActualType(value);
    const sectionPrefix = schemaSection ? `[${schemaSection}] ` : '';

    if (field.type === 'string') {
      if (typeof value !== 'string') {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' expected type 'string' but received '${actualType}'`,
          severity: 'error',
        });
      }
    } else if (field.type === 'number') {
      if (typeof value !== 'number') {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' expected type 'number' but received '${actualType}'`,
          severity: 'error',
        });
      }
    } else if (field.type === 'boolean') {
      if (typeof value !== 'boolean') {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' expected type 'boolean' but received '${actualType}'`,
          severity: 'error',
        });
      }
    } else if (field.type === 'array') {
      if (!Array.isArray(value)) {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' expected type 'array' but received '${actualType}'`,
          severity: 'error',
        });
      } else if (field.items) {
        // Validate array items
        (value as unknown[]).forEach((item, index) => {
          const itemPath = `${fieldPath}[${index}]`;
          if (typeof item === 'object' && item !== null) {
            this.validateField(
              field.items!,
              item as Record<string, unknown>,
              '',
              errors,
              schemaSection
            );
          } else {
            const itemType = this.getActualType(item);
            if (itemType !== field.items!.type) {
              errors.push({
                field: itemPath,
                message: `${sectionPrefix}Array item at ${itemPath} expected type '${field.items!.type}' but received '${itemType}'`,
                severity: 'error',
              });
            }
          }
        });
      }
    } else if (field.type === 'object') {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' expected type 'object' but received '${actualType}'`,
          severity: 'error',
        });
      } else if (field.properties) {
        // Validate nested properties
        for (const prop of field.properties) {
          this.validateField(
            prop,
            value as Record<string, unknown>,
            fieldPath,
            errors,
            schemaSection
          );
        }
      }
    }
  }

  /**
   * Validate field constraints (min/max, length, enum, pattern)
   */
  private validateConstraints(
    field: SchemaField,
    value: unknown,
    fieldPath: string,
    errors: ValidationError[],
    schemaSection?: 'input' | 'output'
  ): void {
    const constraints = field.constraints!;
    const sectionPrefix = schemaSection ? `[${schemaSection}] ` : '';

    // Number constraints
    if (field.type === 'number' && typeof value === 'number') {
      if (constraints.min !== undefined && value < constraints.min) {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' value ${value} is less than minimum ${constraints.min}`,
          severity: 'error',
        });
      }
      if (constraints.max !== undefined && value > constraints.max) {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' value ${value} exceeds maximum ${constraints.max}`,
          severity: 'error',
        });
      }
    }

    // String constraints
    if (field.type === 'string' && typeof value === 'string') {
      if (constraints.minLength !== undefined && value.length < constraints.minLength) {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' length ${value.length} is less than minimum ${constraints.minLength}`,
          severity: 'error',
        });
      }
      if (constraints.maxLength !== undefined && value.length > constraints.maxLength) {
        errors.push({
          field: fieldPath,
          message: `${sectionPrefix}Field '${fieldPath}' length ${value.length} exceeds maximum ${constraints.maxLength}`,
          severity: 'error',
        });
      }
      if (constraints.pattern) {
        const regex = new RegExp(constraints.pattern);
        if (!regex.test(value)) {
          errors.push({
            field: fieldPath,
            message: `${sectionPrefix}Field '${fieldPath}' does not match required pattern`,
            severity: 'error',
          });
        }
      }
    }

    // Enum constraints
    if (constraints.enum && !constraints.enum.includes(String(value))) {
      errors.push({
        field: fieldPath,
        message: `${sectionPrefix}Field '${fieldPath}' value '${value}' is not one of allowed values: ${constraints.enum.join(', ')}`,
        severity: 'error',
      });
    }
  }

  /**
   * Get the actual type of a value as a string
   */
  private getActualType(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
}
