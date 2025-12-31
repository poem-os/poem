/**
 * POEM Configuration Service
 * Handles path resolution for both development and production modes
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Workspace path configuration
 */
export interface WorkspacePaths {
  prompts: string;
  schemas: string;
  mockData: string;
  config: string;
  workflowData: string;
}

/**
 * POEM configuration interface
 */
export interface PoemConfig {
  isDevelopment: boolean;
  projectRoot: string;
  workspace: WorkspacePaths;
}

/**
 * Valid workspace path types
 */
export type WorkspacePathType = keyof WorkspacePaths;

/**
 * Development mode fallback defaults
 * Used when config file not found in development
 */
const DEV_DEFAULTS: WorkspacePaths = {
  prompts: 'prompts',
  schemas: 'schemas',
  mockData: 'mock-data',
  config: 'config',
  workflowData: 'workflow-data',
};

/**
 * Production mode fallback defaults
 * Used when config file not found in production
 */
const PROD_DEFAULTS: WorkspacePaths = {
  prompts: 'poem/prompts',
  schemas: 'poem/schemas',
  mockData: 'poem/mock-data',
  config: 'poem/config',
  workflowData: 'poem/workflow-data',
};

/**
 * Singleton instance
 */
let configInstance: PoemConfig | null = null;

/**
 * Detect if running in development mode
 * Development mode is enabled when POEM_DEV=true environment variable is set
 */
export function isDevelopmentMode(): boolean {
  return process.env.POEM_DEV === 'true';
}

/**
 * Get the project root directory based on mode
 *
 * Development: Goes up from packages/poem-app to monorepo root
 * Production: Uses cwd (user's project root)
 */
export function getProjectRoot(): string {
  if (isDevelopmentMode()) {
    // In development, cwd is packages/poem-app, go up 2 levels to reach monorepo root
    return path.resolve(process.cwd(), '..', '..');
  } else {
    // In production, cwd is the user's project root
    return process.cwd();
  }
}

/**
 * Get the path to the config file based on mode
 */
function getConfigFilePath(): string {
  const root = getProjectRoot();
  if (isDevelopmentMode()) {
    return path.join(root, 'packages', 'poem-core', 'poem-core-config.yaml');
  } else {
    return path.join(root, '.poem-core', 'poem-core-config.yaml');
  }
}

/**
 * Load POEM configuration from yaml file
 * Falls back to defaults if file not found (with warning)
 */
export async function loadPoemConfig(): Promise<PoemConfig> {
  const isDev = isDevelopmentMode();
  const projectRoot = getProjectRoot();
  const configPath = getConfigFilePath();

  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    const rawConfig = yaml.load(configContent) as Record<string, unknown>;

    // Extract workspace paths from config
    const workspaceConfig = (rawConfig.workspace || {}) as Partial<WorkspacePaths>;
    const defaults = isDev ? DEV_DEFAULTS : PROD_DEFAULTS;

    const workspace: WorkspacePaths = {
      prompts: workspaceConfig.prompts || defaults.prompts,
      schemas: workspaceConfig.schemas || defaults.schemas,
      mockData: workspaceConfig.mockData || defaults.mockData,
      config: workspaceConfig.config || defaults.config,
      workflowData: workspaceConfig.workflowData || defaults.workflowData,
    };

    configInstance = {
      isDevelopment: isDev,
      projectRoot,
      workspace,
    };

    return configInstance;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    if (err.code === 'ENOENT') {
      // Config file not found - use defaults with warning
      console.warn(`[POEM] poem-core-config.yaml not found at ${configPath}, using defaults`);

      const defaults = isDev ? DEV_DEFAULTS : PROD_DEFAULTS;
      configInstance = {
        isDevelopment: isDev,
        projectRoot,
        workspace: { ...defaults },
      };

      return configInstance;
    }

    // Other error (permission, yaml parse, etc.) - still use defaults
    console.warn(`[POEM] Error loading poem-core-config.yaml: ${err.message}, using defaults`);

    const defaults = isDev ? DEV_DEFAULTS : PROD_DEFAULTS;
    configInstance = {
      isDevelopment: isDev,
      projectRoot,
      workspace: { ...defaults },
    };

    return configInstance;
  }
}

/**
 * Get cached config or load if not cached
 */
export async function getPoemConfig(): Promise<PoemConfig> {
  if (!configInstance) {
    await loadPoemConfig();
  }
  return configInstance!;
}

/**
 * Get cached config synchronously (throws if not loaded)
 */
export function getPoemConfigSync(): PoemConfig {
  if (!configInstance) {
    throw new Error('[POEM] Config not loaded. Call loadPoemConfig() first.');
  }
  return configInstance;
}

/**
 * Resolve a workspace path to an absolute path
 *
 * @param type - The workspace path type (prompts, schemas, mockData, config, workflowData)
 * @param relativePath - Optional relative path within the workspace directory
 * @returns Absolute path to the resolved location
 */
export function resolvePath(type: WorkspacePathType, relativePath: string = ''): string {
  const config = getPoemConfigSync();
  const basePath = path.join(config.projectRoot, config.workspace[type]);

  if (relativePath) {
    return path.join(basePath, relativePath);
  }

  return basePath;
}

/**
 * Async version of resolvePath that loads config if needed
 */
export async function resolvePathAsync(type: WorkspacePathType, relativePath: string = ''): Promise<string> {
  const config = await getPoemConfig();
  const basePath = path.join(config.projectRoot, config.workspace[type]);

  if (relativePath) {
    return path.join(basePath, relativePath);
  }

  return basePath;
}

/**
 * Reset config (useful for testing)
 */
export function resetConfig(): void {
  configInstance = null;
}
