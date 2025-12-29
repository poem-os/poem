/**
 * Helper Watcher
 * Provides hot-reload functionality for Handlebars helpers
 * Watches the helpers directory and dynamically loads/unloads helpers on file changes
 */

import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import chokidar from 'chokidar';
import type { FSWatcher } from 'chokidar';
import type { HandlebarsService, HelperFunction } from './index.js';
import { getHelpersDirectory } from './loader.js';

/**
 * Result of a hot-reload operation
 */
export interface HotReloadResult {
  action: 'add' | 'change' | 'unlink';
  name: string;
  success: boolean;
  error?: string;
}

/**
 * Watcher status information
 */
export interface WatcherStatus {
  active: boolean;
  watchPath: string;
  helpersWatched: number;
  lastReloadTimestamp?: number;
}

/**
 * HelperWatcher class
 * Watches the helpers directory and hot-reloads helpers on file changes
 */
export class HelperWatcher {
  private service: HandlebarsService;
  private watcher: FSWatcher | null = null;
  private watchPath: string;
  private pendingReloads = new Map<string, NodeJS.Timeout>();
  private debounceMs = 100;
  private lastReloadTimestamp?: number;

  constructor(service: HandlebarsService) {
    this.service = service;
    this.watchPath = getHelpersDirectory();
  }

  /**
   * Start watching the helpers directory for changes
   */
  async start(): Promise<void> {
    if (this.watcher) {
      return; // Already watching
    }

    // Watch only .js files, ignore .d.ts and _ prefixed files
    this.watcher = chokidar.watch('*.js', {
      cwd: this.watchPath,
      ignored: /(^|[/\\])(_.*|.*\.d\.ts)$/,
      persistent: true,
      ignoreInitial: true, // Don't trigger for existing files on startup
    });

    this.watcher
      .on('add', (relativePath) => this.scheduleReload(relativePath, 'add'))
      .on('change', (relativePath) => this.scheduleReload(relativePath, 'change'))
      .on('unlink', (relativePath) => this.scheduleReload(relativePath, 'unlink'))
      .on('error', (error) => {
        console.error('\x1b[31m[HotReload] Watcher error:\x1b[0m', error.message);
      });

    console.log(`\x1b[36m[HotReload] \u{1F440} Watching for helper changes in ${this.watchPath}\x1b[0m`);
  }

  /**
   * Stop watching and clean up resources
   */
  async stop(): Promise<void> {
    // Clear all pending debounce timers
    for (const timer of this.pendingReloads.values()) {
      clearTimeout(timer);
    }
    this.pendingReloads.clear();

    // Close the watcher
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
  }

  /**
   * Get current watcher status
   */
  getStatus(): WatcherStatus {
    return {
      active: this.watcher !== null,
      watchPath: this.watchPath,
      helpersWatched: this.service.getHelperCount(),
      lastReloadTimestamp: this.lastReloadTimestamp,
    };
  }

  /**
   * Schedule a reload operation with debouncing
   * Prevents duplicate events when editors save files multiple times
   */
  private scheduleReload(
    relativePath: string,
    action: 'add' | 'change' | 'unlink'
  ): void {
    const name = path.basename(relativePath, '.js');

    // Skip files starting with underscore (utilities, etc.)
    if (name.startsWith('_')) return;

    // Clear existing timer for this file
    const existing = this.pendingReloads.get(name);
    if (existing) {
      clearTimeout(existing);
    }

    // Schedule the reload
    const timer = setTimeout(() => {
      this.pendingReloads.delete(name);
      this.executeReload(name, action);
    }, this.debounceMs);

    this.pendingReloads.set(name, timer);
  }

  /**
   * Execute the actual reload operation
   */
  private async executeReload(
    name: string,
    action: 'add' | 'change' | 'unlink'
  ): Promise<HotReloadResult> {
    const startTime = Date.now();

    try {
      if (action === 'unlink') {
        // Helper file was deleted
        this.service.unregisterHelper(name);
        console.log(`\x1b[33m[HotReload] \u2796 Removed helper: ${name}\x1b[0m`);
        this.lastReloadTimestamp = Date.now();
        return { action, name, success: true };
      }

      // For add or change, load the helper
      const absolutePath = path.join(this.watchPath, `${name}.js`);

      // Use file:// URL with cache-busting query string
      const fileUrl = pathToFileURL(absolutePath).href + `?t=${Date.now()}`;

      // Dynamic import with cache busting
      const helperModule = await import(fileUrl);
      const helperFn = helperModule.default as HelperFunction & {
        description?: string;
        example?: string;
      };

      if (typeof helperFn !== 'function') {
        throw new Error('Module does not export a default function');
      }

      // For changes, unregister the old version first
      if (action === 'change' && this.service.hasHelper(name)) {
        this.service.unregisterHelper(name);
      }

      // Register the helper with metadata
      const metadata = {
        description:
          typeof helperFn.description === 'string'
            ? helperFn.description
            : undefined,
        example:
          typeof helperFn.example === 'string'
            ? helperFn.example
            : undefined,
      };

      this.service.registerHelper(name, helperFn, metadata);
      this.lastReloadTimestamp = Date.now();

      const elapsed = Date.now() - startTime;

      if (action === 'add') {
        console.log(`\x1b[32m[HotReload] \u2795 Added helper: ${name} (${elapsed}ms)\x1b[0m`);
      } else {
        console.log(`\x1b[32m[HotReload] \u{1F504} Reloaded helper: ${name} (${elapsed}ms)\x1b[0m`);
      }

      return { action, name, success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\x1b[31m[HotReload] \u274C Error loading ${name}: ${message}\x1b[0m`);

      // IMPORTANT: Do NOT unregister a working helper if the modified version has errors
      // The old version remains active

      return { action, name, success: false, error: message };
    }
  }
}

// Singleton instance
let watcherInstance: HelperWatcher | null = null;

/**
 * Get or create the HelperWatcher singleton
 * @param service - HandlebarsService instance (required on first call)
 */
export function getHelperWatcher(service?: HandlebarsService): HelperWatcher {
  if (!watcherInstance) {
    if (!service) {
      throw new Error('HandlebarsService required to create HelperWatcher');
    }
    watcherInstance = new HelperWatcher(service);
  }
  return watcherInstance;
}

/**
 * Reset the watcher instance (useful for testing)
 */
export async function resetHelperWatcher(): Promise<void> {
  if (watcherInstance) {
    await watcherInstance.stop();
    watcherInstance = null;
  }
}
