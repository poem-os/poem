#!/usr/bin/env node

/**
 * POEM Config Command
 * Manages poem.yaml configuration at runtime
 *
 * Usage:
 *   poem-os config set <key> <value>
 *   poem-os config get <key>
 *   poem-os config list
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import yaml from 'js-yaml';

/**
 * Valid configuration keys
 */
const VALID_KEYS = ['port', 'central-path'];

/**
 * Get path to poem.yaml
 * @param {string} targetDir - Project root directory
 * @returns {string} Path to poem.yaml
 */
function getPoemConfigPath(targetDir) {
  return path.join(targetDir, 'poem', 'config', 'poem.yaml');
}

/**
 * Get path to .env file
 * @param {string} targetDir - Project root directory
 * @returns {string} Path to .env
 */
function getEnvFilePath(targetDir) {
  return path.join(targetDir, '.poem-app', '.env');
}

/**
 * Load poem.yaml configuration
 * @param {string} targetDir - Project root directory
 * @returns {Promise<object | null>} Parsed config or null if not found
 */
async function loadPoemConfig(targetDir) {
  const configPath = getPoemConfigPath(targetDir);

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = await fs.readFile(configPath, 'utf-8');
    return yaml.load(content);
  } catch (error) {
    console.error(`❌ Error reading poem.yaml: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Save poem.yaml configuration
 * @param {string} targetDir - Project root directory
 * @param {object} config - Configuration object
 */
async function savePoemConfig(targetDir, config) {
  const configPath = getPoemConfigPath(targetDir);
  const yamlContent = yaml.dump(config);

  try {
    await fs.writeFile(configPath, yamlContent, 'utf-8');
  } catch (error) {
    console.error(`❌ Error writing poem.yaml: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Update .env file with new port
 * @param {string} targetDir - Project root directory
 * @param {number} port - New port value
 */
async function updateEnvFile(targetDir, port) {
  const envPath = getEnvFilePath(targetDir);

  // Read existing .env or create new content
  let envContent = '';
  if (existsSync(envPath)) {
    envContent = await fs.readFile(envPath, 'utf-8');
  }

  // Update or add PORT line
  if (envContent.includes('PORT=')) {
    envContent = envContent.replace(/^PORT=.*$/m, `PORT=${port}`);
  } else {
    envContent = envContent.trim() + `\nPORT=${port}\n`;
  }

  await fs.writeFile(envPath, envContent, 'utf-8');
}

/**
 * Validate port value
 * @param {string} value - Port value as string
 * @returns {{valid: boolean, port?: number, error?: string}}
 */
function validatePort(value) {
  const port = parseInt(value, 10);

  if (isNaN(port)) {
    return { valid: false, error: '❌ Port must be a number' };
  }

  if (port < 1024 || port > 65535) {
    return { valid: false, error: '❌ Port must be between 1024 and 65535' };
  }

  return { valid: true, port };
}

/**
 * Validate central path value
 * @param {string} value - Path value
 * @returns {{valid: boolean, path?: string, error?: string}}
 */
function validateCentralPath(value) {
  // Check if path exists
  if (!existsSync(value)) {
    return { valid: false, error: `❌ Path does not exist: ${value}` };
  }

  // Verify it looks like POEM repository (has docs/ and packages/)
  const docsPath = path.join(value, 'docs');
  const packagesPath = path.join(value, 'packages');

  if (!existsSync(docsPath) || !existsSync(packagesPath)) {
    return { valid: false, error: `❌ Path does not exist or is not a POEM repository: ${value}` };
  }

  return { valid: true, path: value };
}

/**
 * Handle 'set' subcommand
 * @param {string} targetDir - Project root directory
 * @param {string} key - Configuration key
 * @param {string} value - Configuration value
 */
async function handleSet(targetDir, key, value) {
  // Validate key
  if (!VALID_KEYS.includes(key)) {
    console.error(`❌ Unknown config key: ${key}. Valid keys: ${VALID_KEYS.join(', ')}`);
    process.exit(1);
  }

  // Load existing config
  let config = await loadPoemConfig(targetDir);

  if (!config) {
    console.error('❌ poem.yaml not found. Run "poem-os init" first.');
    process.exit(1);
  }

  // Handle key-specific logic
  if (key === 'port') {
    const validation = validatePort(value);

    if (!validation.valid) {
      console.error(validation.error);
      process.exit(1);
    }

    // Update both poem.yaml and .env
    if (!config.server) {
      config.server = {};
    }
    config.server.port = validation.port;

    await savePoemConfig(targetDir, config);
    await updateEnvFile(targetDir, validation.port);

    console.log(`✅ Updated ${key} to ${validation.port}`);
    console.log('   Updated: poem/config/poem.yaml');
    console.log('   Updated: .poem-app/.env');
  } else if (key === 'central-path') {
    const validation = validateCentralPath(value);

    if (!validation.valid) {
      console.error(validation.error);
      process.exit(1);
    }

    // Update poem.yaml only
    config.centralPoemPath = validation.path;

    await savePoemConfig(targetDir, config);

    console.log(`✅ Updated ${key} to ${validation.path}`);
  }
}

/**
 * Handle 'get' subcommand
 * @param {string} targetDir - Project root directory
 * @param {string} key - Configuration key
 */
async function handleGet(targetDir, key) {
  // Validate key
  if (!VALID_KEYS.includes(key)) {
    console.error(`❌ Unknown config key: ${key}. Valid keys: ${VALID_KEYS.join(', ')}`);
    process.exit(1);
  }

  // Load config
  const config = await loadPoemConfig(targetDir);

  if (!config) {
    console.error('❌ poem.yaml not found. Run "poem-os init" first.');
    process.exit(1);
  }

  // Get value based on key
  let value;

  if (key === 'port') {
    value = config.server?.port || 9500;
  } else if (key === 'central-path') {
    value = config.centralPoemPath || 'null';
  }

  console.log(`${key}: ${value}`);
}

/**
 * Handle 'list' subcommand
 * @param {string} targetDir - Project root directory
 */
async function handleList(targetDir) {
  // Load config
  const config = await loadPoemConfig(targetDir);

  if (!config) {
    console.error('❌ poem.yaml not found. Run "poem-os init" first.');
    process.exit(1);
  }

  console.log('📋 POEM Configuration:');
  console.log('');
  console.log(`  version: ${config.version || '1.0'}`);
  console.log(`  server.port: ${config.server?.port || 9500}`);
  console.log(`  centralPoemPath: ${config.centralPoemPath || 'null'}`);
  console.log(`  currentWorkflow: ${config.currentWorkflow || 'null'}`);
  console.log(`  workflows: ${Object.keys(config.workflows || {}).length} defined`);
}

/**
 * Main config command handler
 * @param {string} targetDir - Project root directory
 * @param {string} subcommand - Subcommand (set, get, list)
 * @param {string[]} args - Command arguments
 */
export async function runConfig(targetDir, subcommand, args = []) {
  if (!subcommand || subcommand === '--help') {
    console.log('Usage:');
    console.log('  poem-os config set <key> <value>   Update configuration');
    console.log('  poem-os config get <key>           Display configuration value');
    console.log('  poem-os config list                Display all configuration');
    console.log('');
    console.log('Valid keys: port, central-path');
    return;
  }

  if (subcommand === 'set') {
    const [key, value] = args;

    if (!key || !value) {
      console.error('❌ Usage: poem-os config set <key> <value>');
      process.exit(1);
    }

    await handleSet(targetDir, key, value);
  } else if (subcommand === 'get') {
    const [key] = args;

    if (!key) {
      console.error('❌ Usage: poem-os config get <key>');
      process.exit(1);
    }

    await handleGet(targetDir, key);
  } else if (subcommand === 'list') {
    await handleList(targetDir);
  } else {
    console.error(`❌ Unknown subcommand: ${subcommand}`);
    console.error('Valid subcommands: set, get, list');
    process.exit(1);
  }
}
