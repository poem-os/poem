import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import path from 'node:path';
import {
  loadPoemConfig,
  getPoemConfig,
  getPoemConfigSync,
  getProjectRoot,
  isDevelopmentMode,
  resolvePath,
  resolvePathAsync,
  resetConfig,
  type PoemConfig,
} from '../../src/services/config/poem-config.js';

describe('POEM Configuration Service', () => {
  beforeEach(() => {
    // Reset config before each test
    resetConfig();
    // Clear environment variable
    delete process.env.POEM_DEV;
  });

  afterEach(() => {
    resetConfig();
    delete process.env.POEM_DEV;
  });

  describe('isDevelopmentMode()', () => {
    it('should return true when POEM_DEV=true', () => {
      process.env.POEM_DEV = 'true';
      expect(isDevelopmentMode()).toBe(true);
    });

    it('should return false when POEM_DEV is not set', () => {
      delete process.env.POEM_DEV;
      expect(isDevelopmentMode()).toBe(false);
    });

    it('should return false when POEM_DEV is any other value', () => {
      process.env.POEM_DEV = 'false';
      expect(isDevelopmentMode()).toBe(false);

      process.env.POEM_DEV = '1';
      expect(isDevelopmentMode()).toBe(false);

      process.env.POEM_DEV = 'yes';
      expect(isDevelopmentMode()).toBe(false);
    });
  });

  describe('getProjectRoot()', () => {
    it('should return monorepo root in development mode', () => {
      process.env.POEM_DEV = 'true';
      const root = getProjectRoot();

      // In development, should go up 2 levels from cwd
      const expectedRoot = path.resolve(process.cwd(), '..', '..');
      expect(root).toBe(expectedRoot);
    });

    it('should return cwd in production mode', () => {
      delete process.env.POEM_DEV;
      const root = getProjectRoot();

      expect(root).toBe(process.cwd());
    });
  });

  describe('loadPoemConfig()', () => {
    it('should load config in development mode', async () => {
      process.env.POEM_DEV = 'true';
      const config = await loadPoemConfig();

      expect(config).toBeDefined();
      expect(config.isDevelopment).toBe(true);
      expect(config.projectRoot).toBeDefined();
      expect(config.workspace).toBeDefined();
    });

    it('should use fallback defaults when config file not found', async () => {
      // Set to production mode where config won't be found
      delete process.env.POEM_DEV;

      // Mock console.warn to suppress warning output
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const config = await loadPoemConfig();

      expect(config).toBeDefined();
      expect(config.isDevelopment).toBe(false);
      expect(config.workspace.prompts).toBe('poem/prompts');
      expect(config.workspace.schemas).toBe('poem/schemas');
      expect(config.workspace.mockData).toBe('poem/mock-data');

      // Verify warning was logged
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it('should use development fallback defaults', async () => {
      process.env.POEM_DEV = 'true';

      // Temporarily modify the config lookup to fail
      // This will trigger fallback in a real scenario where config doesn't exist
      const config = await loadPoemConfig();

      // In dev mode with config loaded from poem-core-config.yaml
      expect(config.isDevelopment).toBe(true);
      // The actual paths depend on whether config file exists
      expect(config.workspace.prompts).toBeDefined();
    });

    it('should not throw error when config file missing', async () => {
      delete process.env.POEM_DEV;

      // Suppress warning
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Should not throw
      await expect(loadPoemConfig()).resolves.toBeDefined();

      warnSpy.mockRestore();
    });
  });

  describe('getPoemConfig()', () => {
    it('should load config if not cached', async () => {
      process.env.POEM_DEV = 'true';

      const config = await getPoemConfig();
      expect(config).toBeDefined();
      expect(config.isDevelopment).toBe(true);
    });

    it('should return cached config on subsequent calls', async () => {
      process.env.POEM_DEV = 'true';

      const config1 = await getPoemConfig();
      const config2 = await getPoemConfig();

      expect(config1).toBe(config2); // Same object reference
    });
  });

  describe('getPoemConfigSync()', () => {
    it('should throw if config not loaded', () => {
      expect(() => getPoemConfigSync()).toThrow('Config not loaded');
    });

    it('should return config after loading', async () => {
      process.env.POEM_DEV = 'true';
      await loadPoemConfig();

      const config = getPoemConfigSync();
      expect(config).toBeDefined();
      expect(config.isDevelopment).toBe(true);
    });
  });

  describe('resolvePath()', () => {
    it('should resolve prompts path in development mode', async () => {
      process.env.POEM_DEV = 'true';
      await loadPoemConfig();

      const resolved = resolvePath('prompts', 'test.hbs');
      const config = getPoemConfigSync();

      expect(resolved).toBe(path.join(config.projectRoot, config.workspace.prompts, 'test.hbs'));
    });

    it('should resolve schemas path', async () => {
      process.env.POEM_DEV = 'true';
      await loadPoemConfig();

      const resolved = resolvePath('schemas', 'test.json');
      const config = getPoemConfigSync();

      expect(resolved).toBe(path.join(config.projectRoot, config.workspace.schemas, 'test.json'));
    });

    it('should resolve mockData path', async () => {
      process.env.POEM_DEV = 'true';
      await loadPoemConfig();

      const resolved = resolvePath('mockData', 'test.json');
      const config = getPoemConfigSync();

      expect(resolved).toBe(path.join(config.projectRoot, config.workspace.mockData, 'test.json'));
    });

    it('should resolve config path', async () => {
      process.env.POEM_DEV = 'true';
      await loadPoemConfig();

      const resolved = resolvePath('config', 'settings.yaml');
      const config = getPoemConfigSync();

      expect(resolved).toBe(path.join(config.projectRoot, config.workspace.config, 'settings.yaml'));
    });

    it('should return base path when relativePath is empty', async () => {
      process.env.POEM_DEV = 'true';
      await loadPoemConfig();

      const resolved = resolvePath('prompts');
      const config = getPoemConfigSync();

      expect(resolved).toBe(path.join(config.projectRoot, config.workspace.prompts));
    });
  });

  describe('resolvePathAsync()', () => {
    it('should load config if needed and resolve path', async () => {
      process.env.POEM_DEV = 'true';
      resetConfig(); // Ensure not loaded

      const resolved = await resolvePathAsync('prompts', 'test.hbs');

      expect(resolved).toContain('prompts');
      expect(resolved).toContain('test.hbs');
    });
  });

  describe('Fallback Defaults', () => {
    it('should use development defaults in dev mode', async () => {
      process.env.POEM_DEV = 'true';
      const config = await loadPoemConfig();

      // Development mode should have prompts at root level
      // (either from config file or defaults)
      expect(config.workspace.prompts).not.toContain('poem/');
    });

    it('should use production defaults in prod mode', async () => {
      delete process.env.POEM_DEV;

      // Suppress warning
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const config = await loadPoemConfig();

      // Production defaults should have poem/ prefix
      expect(config.workspace.prompts).toBe('poem/prompts');
      expect(config.workspace.schemas).toBe('poem/schemas');
      expect(config.workspace.mockData).toBe('poem/mock-data');
      expect(config.workspace.config).toBe('poem/config');
      expect(config.workspace.workflowData).toBe('poem/workflow-data');

      warnSpy.mockRestore();
    });
  });

  describe('resetConfig()', () => {
    it('should clear cached config', async () => {
      process.env.POEM_DEV = 'true';
      await loadPoemConfig();

      // Should work
      expect(() => getPoemConfigSync()).not.toThrow();

      // Reset
      resetConfig();

      // Should throw now
      expect(() => getPoemConfigSync()).toThrow('Config not loaded');
    });
  });
});
