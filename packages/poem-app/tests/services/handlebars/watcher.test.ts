/**
 * HelperWatcher Tests
 * Tests for hot-reload functionality of Handlebars helpers
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  HelperWatcher,
  getHelperWatcher,
  resetHelperWatcher,
} from '../../../src/services/handlebars/watcher.js';
import {
  HandlebarsService,
  getHandlebarsService,
  resetHandlebarsService,
} from '../../../src/services/handlebars/index.js';
import { getHelpersDirectory } from '../../../src/services/handlebars/loader.js';

// Test helper directory - use the actual helpers directory
const helpersDir = getHelpersDirectory();

// Generate unique test helper names to avoid conflicts
// NOTE: Do NOT start with underscore - those are filtered out by the watcher
const generateTestHelperName = () => `testHelper${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

// Valid helper content template
const createValidHelper = (name: string) => `
/**
 * Test helper: ${name}
 */
function ${name}(str) {
  return 'test_' + str;
}

${name}.description = 'Test helper for ${name}';
${name}.example = '{{${name} "input"}} → "test_input"';

export default ${name};
`;

// Invalid helper content (syntax error)
const createInvalidHelper = () => `
// Invalid syntax - missing function body
export default function
`;

describe('HelperWatcher', () => {
  let service: HandlebarsService;
  let watcher: HelperWatcher;
  let testHelperName: string;
  let testHelperPath: string;

  beforeEach(async () => {
    // Reset services and create fresh instances
    resetHandlebarsService();
    await resetHelperWatcher();

    service = getHandlebarsService();
    watcher = new HelperWatcher(service);

    // Generate unique test helper name
    testHelperName = generateTestHelperName();
    testHelperPath = path.join(helpersDir, `${testHelperName}.js`);
  });

  afterEach(async () => {
    // Stop watcher and clean up test files
    await watcher.stop();

    // Remove test helper file if it exists
    try {
      await fs.unlink(testHelperPath);
    } catch {
      // File may not exist, ignore
    }
  });

  describe('Lifecycle', () => {
    it('should start watching without error', async () => {
      await expect(watcher.start()).resolves.not.toThrow();
      expect(watcher.getStatus().active).toBe(true);
    });

    it('should stop watching without error', async () => {
      await watcher.start();
      await expect(watcher.stop()).resolves.not.toThrow();
      expect(watcher.getStatus().active).toBe(false);
    });

    it('should handle multiple start calls idempotently', async () => {
      await watcher.start();
      await watcher.start(); // Second call should not error
      expect(watcher.getStatus().active).toBe(true);
    });

    it('should handle stop without start', async () => {
      await expect(watcher.stop()).resolves.not.toThrow();
    });

    it('should report correct watch path', async () => {
      const status = watcher.getStatus();
      expect(status.watchPath).toBe(helpersDir);
    });
  });

  describe('Add Detection (AC: 2, 5)', () => {
    it('should detect new helper files and register them', async () => {
      await watcher.start();

      // Verify helper doesn't exist yet
      expect(service.hasHelper(testHelperName)).toBe(false);

      // Create a new helper file
      await fs.writeFile(testHelperPath, createValidHelper(testHelperName));

      // Wait for debounce + processing time
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Verify helper was registered
      expect(service.hasHelper(testHelperName)).toBe(true);
    });

    it('should extract helper metadata on add', async () => {
      await watcher.start();

      await fs.writeFile(testHelperPath, createValidHelper(testHelperName));
      await new Promise((resolve) => setTimeout(resolve, 300));

      const helpers = service.getHelpers();
      const addedHelper = helpers.find((h) => h.name === testHelperName);

      expect(addedHelper).toBeDefined();
      expect(addedHelper?.description).toContain('Test helper');
    });
  });

  describe('Modify Detection (AC: 3, 5)', () => {
    it('should reload helper when file is modified', async () => {
      // Track unregister calls to verify reload workflow
      const unregisterSpy = vi.spyOn(service, 'unregisterHelper');
      const registerSpy = vi.spyOn(service, 'registerHelper');

      // Start watcher first
      await watcher.start();

      // Create helper file (triggers add event)
      await fs.writeFile(testHelperPath, createValidHelper(testHelperName));
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Helper should exist now
      expect(service.hasHelper(testHelperName)).toBe(true);

      // Clear spy counts after initial add
      unregisterSpy.mockClear();
      registerSpy.mockClear();

      // Modify the helper
      const modifiedContent = `
/**
 * MODIFIED version
 */
function ${testHelperName}(str) {
  return 'modified_' + str;
}

${testHelperName}.description = 'MODIFIED v2 description';
${testHelperName}.example = '{{${testHelperName} "input"}} → "modified_input"';

export default ${testHelperName};
`;
      await fs.writeFile(testHelperPath, modifiedContent);

      // Wait for reload
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verify the reload workflow was triggered:
      // 1. Helper was unregistered (for change event)
      // 2. Helper was re-registered
      const unregisterCalls = unregisterSpy.mock.calls.filter(
        (call) => call[0] === testHelperName
      );
      const registerCalls = registerSpy.mock.calls.filter(
        (call) => call[0] === testHelperName
      );

      expect(unregisterCalls.length).toBeGreaterThanOrEqual(1);
      expect(registerCalls.length).toBeGreaterThanOrEqual(1);

      // Helper should still exist after reload
      expect(service.hasHelper(testHelperName)).toBe(true);

      unregisterSpy.mockRestore();
      registerSpy.mockRestore();

      // Note: In Vitest, Node.js ESM module caching prevents testing
      // the actual content change. In Vite dev mode with real file
      // watching, the cache-busting query string works correctly.
    });
  });

  describe('Delete Detection (AC: 4, 5)', () => {
    it('should unregister helper when file is deleted', async () => {
      // Start watcher first
      await watcher.start();

      // Create helper file (triggers add event)
      await fs.writeFile(testHelperPath, createValidHelper(testHelperName));
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Verify it was registered
      expect(service.hasHelper(testHelperName)).toBe(true);

      // Delete the file
      await fs.unlink(testHelperPath);

      // Wait for detection
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Verify it was unregistered
      expect(service.hasHelper(testHelperName)).toBe(false);
    });
  });

  describe('Error Handling (AC: 6)', () => {
    it('should not crash on invalid helper syntax', async () => {
      await watcher.start();

      // Create a helper with invalid syntax
      await fs.writeFile(testHelperPath, createInvalidHelper());

      // Should not throw and watcher should still be active
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(watcher.getStatus().active).toBe(true);
    });

    it('should preserve working helper when modified version has errors', async () => {
      // Start watcher first
      await watcher.start();

      // Create valid helper
      await fs.writeFile(testHelperPath, createValidHelper(testHelperName));
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Verify registered
      expect(service.hasHelper(testHelperName)).toBe(true);

      // Now modify with invalid content
      await fs.writeFile(testHelperPath, createInvalidHelper());
      await new Promise((resolve) => setTimeout(resolve, 300));

      // The old valid helper should still be registered
      // (implementation preserves working helper on error)
      expect(service.hasHelper(testHelperName)).toBe(true);
    });
  });

  describe('Debouncing (AC: 7)', () => {
    it('should debounce rapid file changes', async () => {
      // Track registration calls before starting
      const registerSpy = vi.spyOn(service, 'registerHelper');

      await watcher.start();

      // Rapid writes (simulating editor save)
      for (let i = 0; i < 5; i++) {
        await fs.writeFile(
          testHelperPath,
          createValidHelper(testHelperName).replace('test_', `test_${i}_`)
        );
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // Wait for debounce to settle (100ms debounce + 200ms for import)
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Should only have registered once (debounced)
      const callsForTestHelper = registerSpy.mock.calls.filter(
        (call) => call[0] === testHelperName
      );
      expect(callsForTestHelper.length).toBe(1);

      registerSpy.mockRestore();
    });

    it('should clean up pending timers on stop', async () => {
      await watcher.start();

      // Trigger a change that will create a pending timer
      await fs.writeFile(testHelperPath, createValidHelper(testHelperName));

      // Immediately stop (before debounce fires)
      await watcher.stop();

      // Should not throw or leak timers
      expect(watcher.getStatus().active).toBe(false);
    });
  });

  describe('Performance (NFR)', () => {
    it('should complete hot-reload within 1 second', async () => {
      await watcher.start();

      // Small delay to ensure watcher is fully ready
      await new Promise((resolve) => setTimeout(resolve, 50));

      const startTime = Date.now();

      // Create a new helper
      await fs.writeFile(testHelperPath, createValidHelper(testHelperName));

      // Poll until registered or timeout
      let registered = false;
      while (Date.now() - startTime < 1000) {
        if (service.hasHelper(testHelperName)) {
          registered = true;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 25));
      }

      const elapsed = Date.now() - startTime;

      expect(registered).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance from getHelperWatcher', async () => {
      await resetHelperWatcher();
      const instance1 = getHelperWatcher(service);
      const instance2 = getHelperWatcher();
      expect(instance1).toBe(instance2);
    });

    it('should throw if getHelperWatcher called without service on first call', async () => {
      await resetHelperWatcher();
      expect(() => getHelperWatcher()).toThrow('HandlebarsService required');
    });
  });

  describe('File Filtering', () => {
    it('should ignore files starting with underscore', async () => {
      await watcher.start();

      const utilityPath = path.join(helpersDir, `_${testHelperName}.js`);
      try {
        await fs.writeFile(utilityPath, createValidHelper(testHelperName));
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Should NOT be registered
        expect(service.hasHelper(`_${testHelperName}`)).toBe(false);
      } finally {
        try {
          await fs.unlink(utilityPath);
        } catch {
          // Ignore
        }
      }
    });

    it('should ignore .d.ts files', async () => {
      await watcher.start();

      const dtsPath = path.join(helpersDir, `${testHelperName}.d.ts`);
      try {
        await fs.writeFile(dtsPath, 'export default function test(str: string): string;');
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Should NOT trigger any registration
        expect(service.hasHelper(testHelperName)).toBe(false);
      } finally {
        try {
          await fs.unlink(dtsPath);
        } catch {
          // Ignore
        }
      }
    });
  });
});
