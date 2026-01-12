/**
 * POEM Configuration Service
 *
 * This service is the SINGLE SOURCE OF TRUTH for workspace paths.
 * Workflows should NOT duplicate path definitions - they inherit from here.
 *
 * Handles path resolution for both development and production modes.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { loadWorkflowState, saveWorkflowState } from './workflow-persistence.js';

/**
 * Reference material configuration (Story 3.8)
 * Defines paths to reference materials for workflows
 */
export interface ReferenceConfig {
  /** Path to reference materials (relative for 'local', absolute for 'second-brain') */
  path: string;
  /** Type of reference source */
  type: 'local' | 'second-brain' | 'external' | 'git-repo';
  /** Optional description of this reference source */
  description?: string;
  /** Priority for conflict resolution (higher wins, default: 10) */
  priority?: number;
}

/**
 * Workflow-specific configuration (Story 3.8)
 * Each workflow has its own prompts, schemas, mock data, workflow execution state, and reference materials
 */
export interface WorkflowConfig {
  /** Path to workflow-specific prompts directory */
  prompts: string;
  /** Path to workflow-specific schemas directory */
  schemas: string;
  /** Path to workflow-specific mock data directory */
  mockData: string;
  /** Path to workflow-specific execution state directory */
  workflowData: string;
  /** Reference material sources (array) */
  reference?: ReferenceConfig[];
}

/**
 * Workspace path configuration (flat structure for backward compatibility)
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
  /** Active workflow name (Story 3.8) */
  currentWorkflow?: string;
  /** Workflow definitions (Story 3.8) */
  workflows?: Record<string, WorkflowConfig>;
}

/**
 * Valid workspace path types
 */
export type WorkspacePathType = keyof WorkspacePaths;

/**
 * Development mode fallback defaults
 * Used when config file not found in development
 *
 * User-generated content goes to dev-workspace/ (gitignored)
 * to avoid polluting the POEM source code.
 */
const DEV_DEFAULTS: WorkspacePaths = {
  prompts: 'dev-workspace/prompts',
  schemas: 'dev-workspace/schemas',
  mockData: 'dev-workspace/mock-data',
  config: 'dev-workspace/config',
  workflowData: 'dev-workspace/workflow-data',
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

    // Extract workspace configuration
    const workspaceConfig = (rawConfig.workspace || {}) as Record<string, unknown>;
    const defaults = isDev ? DEV_DEFAULTS : PROD_DEFAULTS;

    // Extract flat workspace paths (backward compatibility)
    const workspace: WorkspacePaths = {
      prompts: (workspaceConfig.prompts as string) || defaults.prompts,
      schemas: (workspaceConfig.schemas as string) || defaults.schemas,
      mockData: (workspaceConfig.mockData as string) || defaults.mockData,
      config: (workspaceConfig.config as string) || defaults.config,
      workflowData: (workspaceConfig.workflowData as string) || defaults.workflowData,
    };

    // Extract multi-workflow configuration (Story 3.8)
    let currentWorkflow = workspaceConfig.currentWorkflow as string | undefined;
    const workflows = workspaceConfig.workflows as Record<string, WorkflowConfig> | undefined;

    // Load persisted workflow state if no currentWorkflow in config (Story 3.8)
    if (!currentWorkflow && workflows) {
      const persistedState = await loadWorkflowState();
      if (persistedState?.currentWorkflow) {
        // Use persisted workflow if it exists in workflows map
        if (workflows[persistedState.currentWorkflow]) {
          currentWorkflow = persistedState.currentWorkflow;
        } else {
          console.warn(
            `[POEM] Persisted workflow "${persistedState.currentWorkflow}" not found in config, ignoring`
          );
        }
      }
    }

    // Validate currentWorkflow exists in workflows map
    if (currentWorkflow && workflows && !workflows[currentWorkflow]) {
      console.warn(`[POEM] currentWorkflow "${currentWorkflow}" not found in workflows, falling back to flat structure`);
      configInstance = {
        isDevelopment: isDev,
        projectRoot,
        workspace,
      };
      return configInstance;
    }

    configInstance = {
      isDevelopment: isDev,
      projectRoot,
      workspace,
      currentWorkflow,
      workflows,
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

// ============================================================================
// Multi-Workflow Support (Story 3.8)
// ============================================================================

/**
 * Get the currently active workflow name
 * @returns Current workflow name, or null if using flat structure
 */
export function getCurrentWorkflow(): string | null {
  const config = getPoemConfigSync();
  return config.currentWorkflow || null;
}

/**
 * Get all defined workflow names
 * @returns Array of workflow names
 */
export function listWorkflows(): string[] {
  const config = getPoemConfigSync();
  if (!config.workflows) {
    return [];
  }
  return Object.keys(config.workflows);
}

/**
 * Get workflow-scoped path for a resource type
 *
 * Path Resolution Logic:
 * 1. If currentWorkflow is set AND workflows are defined:
 *    - Return workflow-scoped path: workflows/{workflow}/{resourceType}
 * 2. Otherwise:
 *    - Fall back to flat structure path
 *
 * @param resourceType - The resource type (prompts, schemas, mockData, workflowData)
 * @param relativePath - Optional relative path within the resource directory
 * @returns Absolute path to the resolved location
 */
export function getWorkflowPath(
  resourceType: 'prompts' | 'schemas' | 'mockData' | 'workflowData',
  relativePath: string = ''
): string {
  const config = getPoemConfigSync();

  // Check if workflow-scoped paths should be used
  if (config.currentWorkflow && config.workflows) {
    const workflow = config.workflows[config.currentWorkflow];
    if (workflow && workflow[resourceType]) {
      const basePath = path.join(config.projectRoot, workflow[resourceType]);
      return relativePath ? path.join(basePath, relativePath) : basePath;
    }
  }

  // Fall back to flat structure
  return resolvePath(resourceType, relativePath);
}

/**
 * Get reference paths for the current workflow
 * @returns Array of reference configurations, or empty array if none defined
 */
export function getReferencePaths(): ReferenceConfig[] {
  const config = getPoemConfigSync();

  if (config.currentWorkflow && config.workflows) {
    const workflow = config.workflows[config.currentWorkflow];
    if (workflow && workflow.reference) {
      return workflow.reference;
    }
  }

  return [];
}

/**
 * Set the current workflow
 * Validates that the workflow exists before setting
 * Persists the selection to disk for future sessions
 *
 * @param workflowName - Name of the workflow to activate
 * @throws Error if workflow doesn't exist
 */
export async function setCurrentWorkflowAsync(workflowName: string): Promise<void> {
  const config = getPoemConfigSync();

  if (!config.workflows || !config.workflows[workflowName]) {
    const available = config.workflows ? Object.keys(config.workflows).join(', ') : 'none';
    throw new Error(
      `[POEM] Workflow "${workflowName}" not found. Available workflows: ${available}`
    );
  }

  // Update the in-memory config
  config.currentWorkflow = workflowName;

  // Persist to disk (Story 3.8)
  await saveWorkflowState(workflowName);
}

/**
 * Set the current workflow (synchronous version for backward compatibility)
 * Note: This version does NOT persist to disk. Use setCurrentWorkflowAsync() for persistence.
 *
 * @param workflowName - Name of the workflow to activate
 * @throws Error if workflow doesn't exist
 * @deprecated Use setCurrentWorkflowAsync() for persistence support
 */
export function setCurrentWorkflow(workflowName: string): void {
  const config = getPoemConfigSync();

  if (!config.workflows || !config.workflows[workflowName]) {
    const available = config.workflows ? Object.keys(config.workflows).join(', ') : 'none';
    throw new Error(
      `[POEM] Workflow "${workflowName}" not found. Available workflows: ${available}`
    );
  }

  // Update the in-memory config (no persistence)
  config.currentWorkflow = workflowName;
}

/**
 * Reset config (useful for testing)
 */
export function resetConfig(): void {
  configInstance = null;
}
