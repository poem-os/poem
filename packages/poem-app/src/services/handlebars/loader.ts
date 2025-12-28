/**
 * Helper Loader
 * Discovers and loads Handlebars helpers from the helpers directory
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { HandlebarsService, HelperFunction } from './index.js';

/**
 * Result of loading a single helper
 */
interface HelperLoadResult {
  name: string;
  success: boolean;
  error?: string;
}

/**
 * Result of loading all helpers
 */
export interface LoadHelpersResult {
  loaded: string[];
  failed: HelperLoadResult[];
  total: number;
}

/**
 * Get the helpers directory path
 * @returns Absolute path to helpers directory
 */
export function getHelpersDirectory(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  return path.join(currentDir, 'helpers');
}

/**
 * Load all helpers from the helpers directory
 * @param service - HandlebarsService instance to register helpers with
 * @returns LoadHelpersResult with success/failure info
 */
export async function loadHelpers(
  service: HandlebarsService
): Promise<LoadHelpersResult> {
  const helpersDir = getHelpersDirectory();
  const loaded: string[] = [];
  const failed: HelperLoadResult[] = [];

  // Check if helpers directory exists
  if (!fs.existsSync(helpersDir)) {
    console.log(
      `\x1b[33m⚠️  Helpers directory not found: ${helpersDir}\x1b[0m`
    );
    return { loaded, failed, total: 0 };
  }

  // Get all .js files in the helpers directory
  const files = fs.readdirSync(helpersDir).filter((file) => {
    return file.endsWith('.js') && !file.startsWith('_');
  });

  // Load each helper file
  for (const file of files) {
    const result = await loadHelper(service, helpersDir, file);
    if (result.success) {
      loaded.push(result.name);
    } else {
      failed.push(result);
    }
  }

  // Log results
  if (loaded.length > 0) {
    console.log(
      `\x1b[32m✅ Loaded ${loaded.length} helper(s): ${loaded.join(', ')}\x1b[0m`
    );
  }
  if (failed.length > 0) {
    console.log(
      `\x1b[31m❌ Failed to load ${failed.length} helper(s):\x1b[0m`
    );
    for (const f of failed) {
      console.log(`   - ${f.name}: ${f.error}`);
    }
  }

  return {
    loaded,
    failed,
    total: loaded.length,
  };
}

/**
 * Load a single helper file
 * @param service - HandlebarsService instance
 * @param helpersDir - Path to helpers directory
 * @param filename - Helper filename (e.g., 'titleCase.js')
 * @returns HelperLoadResult
 */
async function loadHelper(
  service: HandlebarsService,
  helpersDir: string,
  filename: string
): Promise<HelperLoadResult> {
  const name = path.basename(filename, '.js');
  const filepath = path.join(helpersDir, filename);

  try {
    // Import the helper module using file:// URL for ESM compatibility
    const fileUrl = `file://${filepath}`;
    const helperModule = await import(fileUrl);

    // Get the helper function (default export or module.exports)
    const helperFn: HelperFunction =
      helperModule.default || helperModule;

    if (typeof helperFn !== 'function') {
      return {
        name,
        success: false,
        error: 'Module does not export a function',
      };
    }

    // Extract metadata from JSDoc if available
    const metadata = extractHelperMetadata(helperModule);

    // Register the helper
    service.registerHelper(name, helperFn, metadata);

    return { name, success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    return {
      name,
      success: false,
      error: message,
    };
  }
}

/**
 * Extract helper metadata from module
 * @param helperModule - Imported helper module
 * @returns Helper metadata (description, example)
 */
function extractHelperMetadata(
  helperModule: Record<string, unknown>
): { description?: string; example?: string } {
  return {
    description:
      typeof helperModule.description === 'string'
        ? helperModule.description
        : undefined,
    example:
      typeof helperModule.example === 'string'
        ? helperModule.example
        : undefined,
  };
}

/**
 * Synchronous check if helpers directory has any helper files
 * @returns true if helpers directory exists and has .js files
 */
export function hasHelperFiles(): boolean {
  const helpersDir = getHelpersDirectory();
  if (!fs.existsSync(helpersDir)) {
    return false;
  }
  const files = fs.readdirSync(helpersDir);
  return files.some((file) => file.endsWith('.js') && !file.startsWith('_'));
}
