/**
 * Mock Data Generation API Endpoint
 * POST /api/mock/generate
 *
 * Generates mock data from a schema definition
 */

import type { APIContext } from 'astro';
import { generateFromSchema, type GenerateOptions } from '../../../services/mock-generator';
import type { UnifiedSchema } from '../../../services/schema/types';

/**
 * Request body interface
 */
interface GenerateRequest {
  /** Schema path or inline schema object */
  schema: string | UnifiedSchema;
  /** Number of records to generate (default: 1) */
  count?: number;
  /** Random seed for reproducibility */
  seed?: number;
  /** Include edge cases (default: false) */
  includeEdgeCases?: boolean;
}

/**
 * POST handler - Generate mock data from schema
 */
export async function POST({ request }: APIContext) {
  try {
    const body = await request.json() as GenerateRequest;

    // Validate required fields
    if (!body.schema) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required field: schema',
          details: {
            field: 'schema',
            message: 'Schema path or inline schema object is required'
          }
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle schema input (path or inline object)
    let schema: UnifiedSchema;

    if (typeof body.schema === 'string') {
      // Schema path provided - load from filesystem
      try {
        const fs = await import('fs/promises');
        const path = await import('path');

        // Resolve schema path (assume relative to project root)
        const schemaPath = path.resolve(process.cwd(), body.schema);
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        schema = JSON.parse(schemaContent) as UnifiedSchema;
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to load schema file',
            details: {
              path: body.schema,
              message: error instanceof Error ? error.message : 'Unknown error'
            }
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (typeof body.schema === 'object') {
      // Inline schema object provided
      schema = body.schema;

      // Validate schema structure
      if (!schema.templateName || !schema.version || !schema.input?.fields) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid schema structure',
            details: {
              message: 'Schema must include templateName, version, and input.fields'
            }
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid schema parameter',
          details: {
            message: 'Schema must be a string (file path) or object (inline schema)'
          }
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare generation options
    const options: GenerateOptions = {
      count: body.count ?? 1,
      seed: body.seed,
      includeEdgeCases: body.includeEdgeCases ?? false
    };

    // Generate mock data
    const result = generateFromSchema(schema, options);

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: result.data,
        count: result.count,
        seed: result.seed,
        warnings: result.warnings
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Handle unexpected errors
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error',
          type: error instanceof Error ? error.constructor.name : 'UnknownError'
        }
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
