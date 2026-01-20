#!/usr/bin/env node

/**
 * Shared Utilities for POEM CLI
 * Used by start.js, config.js, and other CLI commands
 */

import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Validates that POEM is installed in the current directory
 * Exits with error message if .poem-app/ directory doesn't exist
 */
export function validatePoemInstalled() {
  if (!existsSync('.poem-app')) {
    console.error('\n❌ POEM is not installed in this directory.');
    console.error('   Run: npx poem-os install\n');
    process.exit(1);
  }
}

/**
 * Validates a port number
 * @param {string|number} port - Port number to validate
 * @returns {number} - Valid port number
 * @throws {Error} - If port is invalid
 */
export function validatePort(port) {
  const num = parseInt(port, 10);
  if (isNaN(num) || num < 1024 || num > 65535) {
    throw new Error(`Invalid port: ${port}. Port must be between 1024 and 65535.`);
  }
  return num;
}

/**
 * Reads and parses a .env file into a key-value object
 * @param {string} filePath - Path to .env file
 * @returns {Promise<Object>} - Parsed configuration object
 */
export async function readEnvFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const config = {};

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key) {
          config[key] = values.join('='); // Handle values with '=' in them
        }
      }
    }

    return config;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty config
      return {};
    }
    throw error;
  }
}

/**
 * Writes a configuration object to a .env file
 * @param {string} filePath - Path to .env file
 * @param {Object} config - Configuration object to write
 * @returns {Promise<void>}
 */
export async function writeEnvFile(filePath, config) {
  const lines = Object.entries(config).map(([key, value]) => `${key}=${value}`);
  await fs.writeFile(filePath, lines.join('\n') + '\n', 'utf-8');
}

// =============================================================================
// Registry Data Structures and Constants
// =============================================================================

/**
 * Registry file path constant
 */
export const REGISTRY_PATH = path.join(os.homedir(), '.poem', 'registry.json');

/**
 * Registry version
 */
export const REGISTRY_VERSION = '1.0';

/**
 * Status enum values
 * @typedef {'active' | 'inactive' | 'stale' | 'missing'} InstallationStatus
 */

/**
 * Installation metadata
 * @typedef {Object} InstallationMetadata
 * @property {string} [lastServerRun] - Last time server was started
 * @property {number} [workflowCount] - Number of workflows
 * @property {number} [promptCount] - Number of prompts
 */

/**
 * Installation record
 * @typedef {Object} Installation
 * @property {string} id - Short identifier (auto-generated from path)
 * @property {string} path - Absolute path to installation root
 * @property {number|null} port - Server port (null if not configured)
 * @property {string} installedAt - ISO timestamp of installation
 * @property {string} lastChecked - ISO timestamp of last health check
 * @property {string} version - POEM version (from package.json)
 * @property {'development'|'production'} mode - POEM_DEV status from .env
 * @property {string|null} currentWorkflow - Active workflow name (future enhancement)
 * @property {string|null} gitBranch - Git branch (if in git repo)
 * @property {InstallationStatus} status - Health status
 * @property {InstallationMetadata} metadata - Additional metadata
 */

/**
 * Registry data structure
 * @typedef {Object} Registry
 * @property {string} version - Registry format version (1.0)
 * @property {Installation[]} installations - Array of installations
 */

/**
 * Default empty registry
 * @returns {Registry}
 */
function createDefaultRegistry() {
  return {
    version: REGISTRY_VERSION,
    installations: []
  };
}

// =============================================================================
// Registry Utility Functions
// =============================================================================

/**
 * Reads the registry file from ~/.poem/registry.json
 * Returns default empty registry if file doesn't exist
 * Gracefully handles corrupted JSON by deleting and recreating
 * @returns {Promise<Registry>}
 */
export async function readRegistry() {
  try {
    const content = await fs.readFile(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(content);

    // Validate basic structure
    if (!registry.version || !Array.isArray(registry.installations)) {
      console.warn('⚠️  Invalid registry format detected. Recreating...');
      await writeRegistry(createDefaultRegistry());
      return createDefaultRegistry();
    }

    return registry;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default
      return createDefaultRegistry();
    } else if (error instanceof SyntaxError) {
      // Corrupted JSON, delete and recreate
      console.warn('⚠️  Corrupted registry file detected. Recreating...');
      try {
        await fs.unlink(REGISTRY_PATH);
      } catch {}
      return createDefaultRegistry();
    }
    throw error;
  }
}

/**
 * Writes the registry to ~/.poem/registry.json
 * Ensures ~/.poem/ directory exists before writing
 * @param {Registry} registry - Registry object to write
 * @returns {Promise<void>}
 */
export async function writeRegistry(registry) {
  const registryDir = path.dirname(REGISTRY_PATH);

  // Ensure ~/.poem/ directory exists
  await fs.mkdir(registryDir, { recursive: true });

  // Write registry as formatted JSON
  const content = JSON.stringify(registry, null, 2);
  await fs.writeFile(REGISTRY_PATH, content, 'utf-8');
}

/**
 * Generates a short installation ID from an installation path
 * Examples:
 *   /clients/supportsignal/prompt.supportsignal.com.au → ss-prompt
 *   /ad/flivideo/vibedeck → vibedeck
 *   /some/path → installation-{timestamp}
 * @param {string} installPath - Installation path
 * @returns {string} - Short installation ID
 */
export function generateInstallationId(installPath) {
  const parts = installPath.split(path.sep).filter(Boolean);

  // Try to extract meaningful name from last part of path
  const lastPart = parts[parts.length - 1];

  // Check for common patterns
  if (lastPart.includes('.')) {
    // Extract domain-like names (e.g., prompt.supportsignal.com.au → ss-prompt)
    const domainParts = lastPart.split('.');
    if (domainParts.length >= 2) {
      const firstPart = domainParts[0];
      const secondPart = domainParts[1];
      return `${secondPart.substring(0, 2)}-${firstPart}`;
    }
  }

  // Use last directory name if it's meaningful
  if (lastPart && lastPart !== 'poem' && lastPart !== '.poem-app') {
    return lastPart.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }

  // Fallback: use timestamp-based ID
  return `installation-${Date.now()}`;
}

/**
 * Gets the current git branch for a directory
 * Returns null if not a git repository
 * @param {string} dirPath - Directory path
 * @returns {Promise<string|null>} - Git branch name or null
 */
export async function getGitBranch(dirPath) {
  try {
    const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', {
      cwd: dirPath,
      timeout: 5000
    });
    return stdout.trim() || null;
  } catch {
    // Not a git repo or git command failed
    return null;
  }
}

/**
 * Checks if a port is already allocated to another installation
 * @param {number} port - Port number to check
 * @param {string} [excludePath] - Optional installation path to exclude from check (for updates)
 * @returns {Promise<{conflict: boolean, installation?: Installation}>} - Conflict status and installation details if conflict exists
 */
export async function checkPortConflict(port, excludePath = null) {
  const registry = await readRegistry();

  for (const installation of registry.installations) {
    // Skip if this is the same installation being updated
    if (excludePath && installation.path === excludePath) {
      continue;
    }

    if (installation.port === port) {
      return {
        conflict: true,
        installation
      };
    }
  }

  return { conflict: false };
}

/**
 * Suggests available ports in increments of 10, starting from base port
 * @param {number} [basePort=9500] - Starting port number
 * @param {number} [count=3] - Number of suggestions to return
 * @returns {Promise<number[]>} - Array of available port numbers
 */
export async function suggestAvailablePorts(basePort = 9500, count = 3) {
  const registry = await readRegistry();
  const usedPorts = new Set(registry.installations.map(i => i.port).filter(p => p !== null));
  const suggestions = [];

  let candidate = basePort;
  while (suggestions.length < count) {
    if (!usedPorts.has(candidate)) {
      suggestions.push(candidate);
    }
    candidate += 10; // Increment by 10
  }

  return suggestions;
}
