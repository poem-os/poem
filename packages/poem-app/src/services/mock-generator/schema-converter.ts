/**
 * JSON Schema to UnifiedSchema Converter
 * Converts JSON Schema format to POEM UnifiedSchema format
 */

import type { UnifiedSchema, SchemaField } from '../schema/types';

/**
 * JSON Schema property definition
 */
interface JSONSchemaProperty {
  type: string | string[];
  description?: string;
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
}

/**
 * JSON Schema definition
 */
interface JSONSchema {
  $schema?: string;
  title?: string;
  description?: string;
  type: string;
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
}

/**
 * Convert JSON Schema to UnifiedSchema format
 *
 * @param jsonSchema - JSON Schema object
 * @param templateName - Template name for the unified schema
 * @returns UnifiedSchema
 */
export function convertJSONSchemaToUnified(
  jsonSchema: JSONSchema,
  templateName: string
): UnifiedSchema {
  const fields: SchemaField[] = [];
  const requiredFields = new Set(jsonSchema.required || []);

  // Convert each property to a SchemaField
  for (const [fieldName, property] of Object.entries(jsonSchema.properties)) {
    const field = convertProperty(fieldName, property, requiredFields.has(fieldName));
    fields.push(field);
  }

  return {
    templateName,
    version: '1.0.0',
    description: jsonSchema.description || jsonSchema.title,
    input: {
      fields
    }
  };
}

/**
 * Convert a JSON Schema property to a SchemaField
 */
function convertProperty(
  name: string,
  property: JSONSchemaProperty,
  required: boolean
): SchemaField {
  // Determine type
  let type: SchemaField['type'] = 'string';
  const propType = Array.isArray(property.type) ? property.type[0] : property.type;

  switch (propType) {
    case 'string':
      type = 'string';
      break;
    case 'number':
    case 'integer':
      type = 'number';
      break;
    case 'boolean':
      type = 'boolean';
      break;
    case 'array':
      type = 'array';
      break;
    case 'object':
      type = 'object';
      break;
  }

  const field: SchemaField = {
    name,
    type,
    required,
    description: property.description
  };

  // Handle arrays
  if (type === 'array' && property.items) {
    field.items = convertProperty('item', property.items, false);
  }

  // Handle objects
  if (type === 'object' && property.properties) {
    field.properties = [];
    for (const [propName, propDef] of Object.entries(property.properties)) {
      const propRequired = property.required?.includes(propName) ?? false;
      field.properties.push(convertProperty(propName, propDef, propRequired));
    }
  }

  return field;
}
