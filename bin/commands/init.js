#!/usr/bin/env node

/**
 * POEM Init Command
 * Creates root-level workspace folders (poem/config/, poem/shared/)
 * Syncs port from .env to poem.yaml
 * Detects and prompts for central POEM path configuration
 *
 * Usage:
 *   poem-os init
 *   poem-os init --skip-central-path
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { existsSync } from 'fs';
import { createInterface } from 'readline';
import yaml from 'js-yaml';

/**
 * Reads port from .env file or environment variable
 * @param {string} targetDir - Project root directory
 * @returns {Promise<number>} Port number (default: 9500)
 */
async function readPort(targetDir) {
  const envFile = path.join(targetDir, '.poem-app', '.env');

  // Try reading from .env file first
  if (existsSync(envFile)) {
    try {
      const envContent = await fs.readFile(envFile, 'utf-8');
      const portMatch = envContent.match(/^PORT=(\d+)/m);
      if (portMatch) {
        return parseInt(portMatch[1], 10);
      }
    } catch (error) {
      // Fall through to environment variable
    }
  }

  // Fallback to environment variable
  if (process.env.PORT) {
    return parseInt(process.env.PORT, 10);
  }

  // Default
  return 9500;
}

/**
 * Detects if central POEM path exists using convention
 * @returns {string | null} Central POEM path or null
 */
function detectCentralPoemPath() {
  const conventionPath = path.join(os.homedir(), 'dev', 'ad', 'poem-os', 'poem');

  if (existsSync(conventionPath)) {
    // Verify it looks like POEM (has docs/ and packages/)
    const docsPath = path.join(conventionPath, 'docs');
    const packagesPath = path.join(conventionPath, 'packages');

    if (existsSync(docsPath) && existsSync(packagesPath)) {
      return conventionPath;
    }
  }

  return null;
}

/**
 * Prompts user to configure central POEM path
 * @param {string} detectedPath - Detected central path
 * @returns {Promise<boolean>} True if user wants to configure
 */
async function promptCentralPath(detectedPath) {
  console.log('\n📍 POEM development clone detected at', detectedPath);
  console.log('\nThis allows agents (Victor, Felix) to query central POEM capabilities.');
  console.log('Most users don\'t need this - only contributors and framework developers.\n');

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Configure central POEM path? [Y/n]: ', (answer) => {
      rl.close();

      const normalized = answer.trim().toLowerCase();

      // Y/y/Enter → yes, n/N → no
      if (normalized === 'n') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Creates poem.yaml configuration with dynamic values
 * @param {number} port - Server port
 * @param {string | null} centralPath - Central POEM path
 * @returns {string} YAML content
 */
function createPoemConfig(port, centralPath) {
  const timestamp = new Date().toISOString();

  return `# POEM Configuration
version: 1.0

# Server Configuration (for port discovery by tools)
# Synced from .env on ${timestamp} by poem-os init
server:
  port: ${port}

# Central POEM Path (optional - for contributors/developers)
centralPoemPath: ${centralPath ? `"${centralPath}"` : 'null'}

# Active workflow (set by add-workflow command)
currentWorkflow: null

# Workflow definitions (managed by add-workflow command)
workflows: {}
`;
}

/**
 * Creates root-level workspace folders with port sync and central path detection
 * @param {string} targetDir - Project root directory
 * @param {object} options - CLI flags
 * @param {boolean} options.skipCentralPath - Skip central path prompting
 * @returns {Promise<{created: boolean, reason?: string}>}
 */
export async function runInit(targetDir, options = {}) {
  const workspaceDir = path.join(targetDir, 'poem');
  const configDir = path.join(workspaceDir, 'config');
  const sharedDir = path.join(workspaceDir, 'shared');
  const sharedPromptsDir = path.join(sharedDir, 'prompts');
  const sharedSchemasDir = path.join(sharedDir, 'schemas');
  const configFile = path.join(configDir, 'poem.yaml');

  // Check if workspace already exists (idempotent behavior)
  if (existsSync(workspaceDir)) {
    console.log('ℹ  Workspace already initialized.');

    // Check if config needs migration (old format → v1.1)
    if (existsSync(configFile)) {
      try {
        const configContent = await fs.readFile(configFile, 'utf-8');
        const config = yaml.load(configContent);

        // Check for old format (missing server or centralPoemPath)
        if (!config.server || config.centralPoemPath === undefined) {
          console.log('\n⚠️  Old config format detected.');
          console.log('Missing fields: server.port, centralPoemPath');

          const { runMigration } = await import('./migrate-config.js');
          await runMigration(targetDir);
        }
      } catch (error) {
        // Ignore migration errors, continue
      }
    }

    return { created: false, reason: 'already_exists' };
  }

  // Read port from .env or environment
  const port = await readPort(targetDir);
  console.log(`✓ Port synced to poem.yaml: ${port}`);

  // Detect central POEM path
  let centralPath = null;

  if (!options.skipCentralPath) {
    const detectedPath = detectCentralPoemPath();

    if (detectedPath) {
      const userWantsCentralPath = await promptCentralPath(detectedPath);

      if (userWantsCentralPath) {
        centralPath = detectedPath;
        console.log(`✓ Central POEM path configured: ${centralPath}`);
      } else {
        console.log('ℹ  Central POEM path not configured (local-only mode)');
      }
    }
  }

  // Create directories
  await fs.mkdir(configDir, { recursive: true });
  await fs.mkdir(sharedPromptsDir, { recursive: true });
  await fs.mkdir(sharedSchemasDir, { recursive: true });

  // Create poem.yaml with dynamic values
  const poemConfig = createPoemConfig(port, centralPath);
  await fs.writeFile(configFile, poemConfig, 'utf-8');

  console.log('\n✅ Workspace initialized at poem/');
  console.log('   Created: poem/config/poem.yaml');
  console.log('   Created: poem/shared/prompts/');
  console.log('   Created: poem/shared/schemas/');

  return { created: true };
}
