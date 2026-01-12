/**
 * POST /api/schema/validate
 * Validates data against a JSON schema
 */

import type { APIContext } from 'astro';
import { z } from 'zod';
import { promises as fs } from 'node:fs';
import { SchemaValidator } from '../../../services/schema/validator.js';
import type {
  SchemaField,
  ValidationError,
  UnifiedSchema,
} from '../../../services/schema/types.js';
import { isUnifiedSchema } from '../../../services/schema/types.js';
import { resolvePathAsync } from '../../../services/config/poem-config.js';

/**
 * Request schema with Zod validation
 */
const ValidateRequestSchema = z.object({
  schema: z.union([z.string().min(1), z.array(z.any()), z.object({})]),
  data: z.any(),
  schemaSection: z.enum(['input', 'output']).optional(),
});

/**
 * Request interface
 */
export interface ValidateRequest {
  schema: string | SchemaField[] | UnifiedSchema;
  data: unknown;
  schemaSection?: 'input' | 'output';
}

/**
 * Response interface for successful validation
 */
export interface ValidateResponse {
  success: true;
  valid: boolean;
  errors: ValidationError[];
  validationTimeMs: number;
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}

/**
 * POST handler for schema validation
 */
export async function POST({ request }: APIContext): Promise<Response> {
  const startTime = performance.now();

  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = ValidateRequestSchema.parse(body) as ValidateRequest;

    let schema: SchemaField[] | UnifiedSchema;
    const schemaSection = validatedRequest.schemaSection;

    // Handle schema as file path or inline object
    if (typeof validatedRequest.schema === 'string') {
      // Load schema from file
      const schemaPath = await resolvePathAsync(validatedRequest.schema, 'schema');

      try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        const schemaObj = JSON.parse(schemaContent);

        // Check if it's a UnifiedSchema
        if (isUnifiedSchema(schemaObj)) {
          schema = schemaObj as UnifiedSchema;
        } else if (schemaObj.fields && Array.isArray(schemaObj.fields)) {
          // Legacy format with fields array
          schema = schemaObj.fields;
        } else if (schemaObj.placeholders) {
          // Handle old schema format (placeholders object)
          schema = Object.entries(schemaObj.placeholders).map(([name, props]: [string, any]) => ({
            name,
            type: props.type || 'string',
            required: props.required || false,
            description: props.description,
          }));
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Invalid schema format',
              details: {
                schemaPath,
                message:
                  'Schema must be UnifiedSchema or have "fields" array or "placeholders" object',
              },
            } as ErrorResponse),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to load schema file',
            details: {
              schemaPath,
              message: err instanceof Error ? err.message : 'Unknown error',
            },
          } as ErrorResponse),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } else {
      // Use inline schema (could be UnifiedSchema or SchemaField[])
      schema = validatedRequest.schema;
    }

    // Validate data against schema
    const validator = new SchemaValidator();
    let validationResult;

    if (isUnifiedSchema(schema)) {
      // Use new validateUnified method for UnifiedSchema
      if (!schemaSection) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'schemaSection is required when using UnifiedSchema',
            details: {
              message: 'Specify "input" or "output" in schemaSection field',
            },
          } as ErrorResponse),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      validationResult = validator.validateUnified(validatedRequest.data, schema, schemaSection);
    } else {
      // Use legacy validate method for SchemaField[]
      validationResult = validator.validate(validatedRequest.data, schema);
    }

    const endTime = performance.now();
    const validationTimeMs = Number((endTime - startTime).toFixed(2));

    // Return validation result (NFR2: include timing)
    return new Response(
      JSON.stringify({
        success: true,
        valid: validationResult.valid,
        errors: validationResult.errors,
        validationTimeMs,
      } as ValidateResponse),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Zod validation error
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid request format',
          details: {
            issues: err.errors,
          },
        } as ErrorResponse),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Generic error
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
        details: {
          type: err instanceof Error ? err.constructor.name : typeof err,
        },
      } as ErrorResponse),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
