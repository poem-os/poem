/**
 * Helper Loader
 * Discovers and loads Handlebars helpers from the helpers directory
 * Uses Vite's import.meta.glob for dev/build compatibility
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

// Use Vite's import.meta.glob to eagerly load all helper modules
// This is resolved at build time, making it compatible with Vite dev server
const helperModules = import.meta.glob('./helpers/*.js', { eager: true }) as Record<
  string,
  { default: HelperFunction & { description?: string; example?: string } }
>;

/**
 * Load all helpers from the helpers directory
 * @param service - HandlebarsService instance to register helpers with
 * @returns LoadHelpersResult with success/failure info
 */
export async function loadHelpers(
  service: HandlebarsService
): Promise<LoadHelpersResult> {
  const loaded: string[] = [];
  const failed: HelperLoadResult[] = [];

  // Process each helper module from import.meta.glob
  for (const [modulePath, helperModule] of Object.entries(helperModules)) {
    // Extract helper name from path (e.g., './helpers/titleCase.js' -> 'titleCase')
    const name = path.basename(modulePath, '.js');

    // Skip files starting with underscore (utilities, etc.)
    if (name.startsWith('_')) continue;

    try {
      // Get the helper function (default export)
      const helperFn = helperModule.default;

      if (typeof helperFn !== 'function') {
        failed.push({
          name,
          success: false,
          error: 'Module does not export a function',
        });
        continue;
      }

      // Extract metadata from the function properties
      const metadata = {
        description:
          typeof helperFn.description === 'string'
            ? helperFn.description
            : undefined,
        example:
          typeof helperFn.example === 'string' ? helperFn.example : undefined,
      };

      // Register the helper
      service.registerHelper(name, helperFn, metadata);
      loaded.push(name);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      failed.push({
        name,
        success: false,
        error: message,
      });
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
