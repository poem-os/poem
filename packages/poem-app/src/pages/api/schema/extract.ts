/**
 * POST /api/schema/extract
 * Extracts JSON schema from a Handlebars template
 */

import type { APIContext } from 'astro';
import { z } from 'zod';
import { promises as fs } from 'node:fs';
import { SchemaExtractor } from '../../../services/schema/extractor.js';
import type { UnifiedSchema } from '../../../services/schema/types.js';
import { getHandlebarsService } from '../../../services/handlebars/index.js';
import { resolvePathAsync, loadPoemConfig } from '../../../services/config/poem-config.js';

/**
 * Request schema with Zod validation
 */
const ExtractRequestSchema = z.object({
  template: z.string().min(1, 'Template is required'),
  isRawTemplate: z.boolean().optional().default(false),
});

/**
 * Request interface
 */
export interface ExtractRequest {
  template: string;
  isRawTemplate?: boolean;
}

/**
 * Response interface for successful extraction (unified schema)
 */
export interface ExtractResponse {
  success: true;
  schema: UnifiedSchema;
  requiredHelpers: string[];
  unregisteredHelpers: string[];
  templatePath?: string;
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: {
    path?: string;
    line?: number;
    column?: number;
  };
}

/**
 * Resolve template path using POEM config service
 * Handles both development and production modes automatically
 */
async function resolveTemplatePath(templatePath: string): Promise<string> {
  return resolvePathAsync('prompts', templatePath);
}

/**
 * POST handler for /api/schema/extract
 */
export async function POST({ request }: APIContext): Promise<Response> {
  try {
    // Ensure POEM config is loaded
    await loadPoemConfig();

    // Parse JSON body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        {
          success: false,
          error: 'Invalid JSON body',
        } as ErrorResponse,
        400
      );
    }

    // Validate request with Zod
    const parseResult = ExtractRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0];
      return jsonResponse(
        {
          success: false,
          error: firstError.message,
          details: {
            path: firstError.path.join('.'),
          },
        } as ErrorResponse,
        400
      );
    }

    const { template, isRawTemplate } = parseResult.data;
    let templateContent: string;
    let templatePath: string | undefined;

    // Load template content
    if (isRawTemplate) {
      // Use template string directly
      templateContent = template;
    } else {
      // Load from file system
      templatePath = await resolveTemplatePath(template);

      try {
        templateContent = await fs.readFile(templatePath, 'utf-8');
      } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === 'ENOENT') {
          return jsonResponse(
            {
              success: false,
              error: `Template not found: ${template}`,
              details: {
                path: templatePath,
              },
            } as ErrorResponse,
            404
          );
        }
        throw error;
      }
    }

    // Extract unified schema (input + output in single structure)
    const extractor = new SchemaExtractor();

    try {
      const result = extractor.extractUnifiedSchema(templateContent, template);

      // Check which helpers are registered
      const handlebarsService = getHandlebarsService();
      const unregisteredHelpers = result.requiredHelpers.filter(
        (helper) => !handlebarsService.hasHelper(helper)
      );

      const response: ExtractResponse = {
        success: true,
        schema: result.schema,
        requiredHelpers: result.requiredHelpers,
        unregisteredHelpers,
      };

      if (templatePath) {
        response.templatePath = templatePath;
      }

      return jsonResponse(response, 200);
    } catch (error) {
      // Template parsing error
      const err = error as Error & {
        lineNumber?: number;
        column?: number;
      };

      return jsonResponse(
        {
          success: false,
          error: `Template parsing error: ${err.message}`,
          details: {
            line: err.lineNumber,
            column: err.column,
          },
        } as ErrorResponse,
        400
      );
    }
  } catch (error) {
    // Unexpected error
    const err = error as Error;
    return jsonResponse(
      {
        success: false,
        error: err.message || 'Internal server error',
      } as ErrorResponse,
      500
    );
  }
}

/**
 * Helper to create JSON responses
 */
function jsonResponse(data: ExtractResponse | ErrorResponse, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
