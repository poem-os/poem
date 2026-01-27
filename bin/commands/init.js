#!/usr/bin/env node

/**
 * POEM Init Command
 * Creates root-level workspace folders (poem/config/, poem/shared/)
 *
 * Usage:
 *   poem-os init
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

/**
 * Default poem.yaml configuration file content
 */
const DEFAULT_POEM_CONFIG = `# POEM Configuration
version: 1.0

# Active workflow (set by add-workflow command)
currentWorkflow: null

# Workflow definitions (managed by add-workflow command)
workflows: {}
`;

/**
 * Creates root-level workspace folders
 * @param {string} targetDir - Project root directory
 * @returns {Promise<{created: boolean, reason?: string}>}
 */
export async function runInit(targetDir) {
  const workspaceDir = path.join(targetDir, 'poem');
  const configDir = path.join(workspaceDir, 'config');
  const sharedDir = path.join(workspaceDir, 'shared');
  const sharedPromptsDir = path.join(sharedDir, 'prompts');
  const sharedSchemasDir = path.join(sharedDir, 'schemas');
  const configFile = path.join(configDir, 'poem.yaml');

  // Check if workspace already exists (idempotent behavior)
  if (existsSync(workspaceDir)) {
    console.log('ℹ  Workspace already initialized. Skipped.');
    return { created: false, reason: 'already_exists' };
  }

  // Create directories
  await fs.mkdir(configDir, { recursive: true });
  await fs.mkdir(sharedPromptsDir, { recursive: true });
  await fs.mkdir(sharedSchemasDir, { recursive: true });

  // Create default poem.yaml
  await fs.writeFile(configFile, DEFAULT_POEM_CONFIG, 'utf-8');

  console.log('✅ Workspace initialized at poem/');
  console.log('   Created: poem/config/poem.yaml');
  console.log('   Created: poem/shared/prompts/');
  console.log('   Created: poem/shared/schemas/');

  return { created: true };
}
