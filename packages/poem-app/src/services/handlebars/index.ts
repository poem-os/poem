/**
 * Handlebars Service
 * Provides template compilation and rendering with helper support
 */

import Handlebars from 'handlebars';

/**
 * Compiled template function type from Handlebars
 */
export type CompiledTemplate = Handlebars.TemplateDelegate;

/**
 * Helper function signature
 */
export type HelperFunction = Handlebars.HelperDelegate;

/**
 * Compilation error details for helpful error messages
 */
export interface CompilationErrorDetails {
  type: string;
  message: string;
  line?: number;
  column?: number;
  snippet?: string;
}

/**
 * Result type for operations that can fail
 */
export type CompileResult =
  | { success: true; template: CompiledTemplate }
  | { success: false; error: string; details: CompilationErrorDetails };

/**
 * Render result with warnings for missing placeholders
 */
export interface RenderResult {
  rendered: string;
  warnings: string[];
}

/**
 * Configuration options for HandlebarsService
 */
export interface HandlebarsServiceOptions {
  /** If true, throw on missing properties instead of returning empty string */
  strict?: boolean;
}

/**
 * Helper metadata for listing helpers
 */
export interface HelperInfo {
  name: string;
  description?: string;
  example?: string;
}

/**
 * HandlebarsService class
 * Compiles and renders Handlebars templates with helper support
 */
export class HandlebarsService {
  private handlebars: typeof Handlebars;
  private registeredHelpers: Map<string, HelperInfo> = new Map();
  private strict: boolean;

  constructor(options: HandlebarsServiceOptions = {}) {
    // Create isolated Handlebars instance
    this.handlebars = Handlebars.create();
    this.strict = options.strict ?? false;
  }

  /**
   * Compile a template string into a reusable template function
   * @param template - Handlebars template string
   * @returns CompileResult with compiled template or error details
   * @example
   * const result = service.compile('Hello {{name}}');
   * if (result.success) {
   *   const output = result.template({ name: 'World' });
   * }
   */
  compile(template: string): CompileResult {
    try {
      const compiled = this.handlebars.compile(template, {
        strict: this.strict,
      });
      return { success: true, template: compiled };
    } catch (error) {
      const details = this.extractErrorDetails(error, template);
      return {
        success: false,
        error: 'Template compilation failed',
        details,
      };
    }
  }

  /**
   * Render a template string with data (convenience method)
   * Compiles and renders in one step
   * @param template - Handlebars template string
   * @param data - Data to render template with
   * @returns Rendered string (empty string for missing placeholders)
   * @throws Error if template has syntax errors
   * @example
   * const output = service.render('Hello {{name}}', { name: 'World' });
   * // Returns: 'Hello World'
   */
  render(template: string, data: Record<string, unknown> = {}): string {
    const result = this.compile(template);
    if (!result.success) {
      throw new Error(`${result.error}: ${result.details.message}`);
    }
    return result.template(data);
  }

  /**
   * Render a template with data and track missing placeholders
   * @param template - Handlebars template string
   * @param data - Data to render template with
   * @returns RenderResult with rendered string and warnings
   */
  renderWithWarnings(
    template: string,
    data: Record<string, unknown> = {}
  ): RenderResult {
    const warnings: string[] = [];
    const placeholders = this.extractPlaceholders(template);

    // Check for missing data fields
    for (const placeholder of placeholders) {
      if (!this.hasNestedProperty(data, placeholder)) {
        warnings.push(`Missing field: ${placeholder}`);
      }
    }

    const result = this.compile(template);
    if (!result.success) {
      throw new Error(`${result.error}: ${result.details.message}`);
    }

    return {
      rendered: result.template(data),
      warnings,
    };
  }

  /**
   * Register a custom helper function
   * @param name - Helper name (used in templates as {{name ...}})
   * @param fn - Helper function
   * @param info - Optional metadata for the helper
   * @example
   * service.registerHelper('uppercase', (str) => str.toUpperCase(), {
   *   description: 'Converts string to uppercase',
   *   example: '{{uppercase name}} → "JOHN"'
   * });
   */
  registerHelper(
    name: string,
    fn: HelperFunction,
    info?: Omit<HelperInfo, 'name'>
  ): void {
    this.handlebars.registerHelper(name, fn);
    this.registeredHelpers.set(name, {
      name,
      description: info?.description,
      example: info?.example,
    });
  }

  /**
   * Unregister a helper
   * @param name - Helper name to remove
   */
  unregisterHelper(name: string): void {
    this.handlebars.unregisterHelper(name);
    this.registeredHelpers.delete(name);
  }

  /**
   * Get count of registered helpers
   * @returns Number of registered custom helpers
   */
  getHelperCount(): number {
    return this.registeredHelpers.size;
  }

  /**
   * Get list of registered helpers with metadata
   * @returns Array of helper info objects
   */
  getHelpers(): HelperInfo[] {
    return Array.from(this.registeredHelpers.values());
  }

  /**
   * Check if a helper is registered
   * @param name - Helper name
   * @returns true if helper exists
   */
  hasHelper(name: string): boolean {
    return this.registeredHelpers.has(name);
  }

  /**
   * Extract placeholder names from a template
   * Simple extraction for warning purposes
   * @param template - Template string
   * @returns Array of placeholder names
   */
  private extractPlaceholders(template: string): string[] {
    const placeholders: string[] = [];
    // Match {{placeholder}} but not {{#block}} {{/block}} {{!comment}}
    const regex = /\{\{(?!#|\/|!|else|>)([^{}]+)\}\}/g;
    let match;

    while ((match = regex.exec(template)) !== null) {
      const placeholder = match[1].trim();
      // Remove helper calls (first word is helper name)
      // e.g., "titleCase name" -> we want "name"
      const parts = placeholder.split(/\s+/);
      if (parts.length > 1 && this.registeredHelpers.has(parts[0])) {
        // Helper call - extract arguments
        for (let i = 1; i < parts.length; i++) {
          const arg = parts[i];
          // Skip string literals and numbers
          if (
            !arg.startsWith('"') &&
            !arg.startsWith("'") &&
            !/^\d+$/.test(arg)
          ) {
            placeholders.push(arg);
          }
        }
      } else {
        placeholders.push(placeholder);
      }
    }

    return [...new Set(placeholders)]; // Remove duplicates
  }

  /**
   * Check if object has nested property
   * @param obj - Object to check
   * @param path - Dot-notation path (e.g., "user.name")
   */
  private hasNestedProperty(
    obj: Record<string, unknown>,
    path: string
  ): boolean {
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current === null || current === undefined) return false;
      if (typeof current !== 'object') return false;
      current = (current as Record<string, unknown>)[part];
    }

    return current !== undefined;
  }

  /**
   * Extract error details from Handlebars compilation error
   * @param error - Caught error
   * @param template - Original template string
   * @returns CompilationErrorDetails with context
   */
  private extractErrorDetails(
    error: unknown,
    template: string
  ): CompilationErrorDetails {
    const errorObj = error as Error & {
      lineNumber?: number;
      column?: number;
      description?: string;
    };

    const message = errorObj.message || String(error);
    const line = errorObj.lineNumber;
    const column = errorObj.column;

    let snippet: string | undefined;
    if (line !== undefined) {
      snippet = this.getErrorSnippet(template, line, column);
    }

    return {
      type: 'ParseError',
      message: errorObj.description || message,
      line,
      column,
      snippet,
    };
  }

  /**
   * Get snippet of template around error location
   * @param template - Template string
   * @param line - Error line number
   * @param column - Error column number
   * @returns Snippet with error indicator
   */
  private getErrorSnippet(
    template: string,
    line: number,
    column?: number
  ): string {
    const lines = template.split('\n');
    const errorLine = lines[line - 1] || '';

    let snippet = errorLine;
    if (column !== undefined && column > 0) {
      snippet += '\n' + ' '.repeat(column - 1) + '^--- error here';
    }

    return snippet;
  }
}

// Use globalThis for singleton to survive Vite/Astro module reloading
// This ensures the same instance is shared across SSR and API contexts
const GLOBAL_KEY = '__POEM_HANDLEBARS_SERVICE__';

/**
 * Get the shared HandlebarsService instance
 * @returns HandlebarsService singleton
 */
export function getHandlebarsService(): HandlebarsService {
  const globalObj = globalThis as Record<string, unknown>;
  if (!globalObj[GLOBAL_KEY]) {
    globalObj[GLOBAL_KEY] = new HandlebarsService();
  }
  return globalObj[GLOBAL_KEY] as HandlebarsService;
}

/**
 * Initialize the HandlebarsService with options
 * Should be called during server startup
 * @param options - Service configuration options
 * @returns Initialized HandlebarsService instance
 */
export function initHandlebarsService(
  options: HandlebarsServiceOptions = {}
): HandlebarsService {
  const globalObj = globalThis as Record<string, unknown>;
  globalObj[GLOBAL_KEY] = new HandlebarsService(options);
  return globalObj[GLOBAL_KEY] as HandlebarsService;
}

/**
 * Reset the service instance (useful for testing)
 */
export function resetHandlebarsService(): void {
  const globalObj = globalThis as Record<string, unknown>;
  delete globalObj[GLOBAL_KEY];
}
