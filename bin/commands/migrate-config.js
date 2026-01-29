#!/usr/bin/env node

/**
 * POEM Config Migration Command
 * Migrates old poem.yaml format to new schema (Story 1.11)
 *
 * Detects missing fields (server, centralPoemPath) and adds them with defaults
 * Preserves existing fields during migration
 *
 * Usage:
 *   poem-os migrate-config
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import yaml from 'js-yaml';
import { createInterface } from 'readline';

/**
 * Prompts user for migration confirmation
 * @returns {Promise<boolean>} True if user confirms
 */
async function promptMigration() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\n⚠️  Old config format detected. Migrate to new format? [Y/n]: ', (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === '' || normalized === 'y' || normalized === 'yes');
    });
  });
}

/**
 * Checks if poem.yaml needs migration
 * @param {object} config - Current poem.yaml content
 * @returns {boolean} True if migration needed
 */
function needsMigration(config) {
  return !config.server || config.centralPoemPath === undefined;
}

/**
 * Migrates poem.yaml to new schema
 * @param {string} targetDir - Project root directory
 */
export async function runMigration(targetDir) {
  const poemConfigPath = path.join(targetDir, 'poem', 'config', 'poem.yaml');

  // Check if poem.yaml exists
  if (!existsSync(poemConfigPath)) {
    console.log('\n❌ poem/config/poem.yaml not found. Nothing to migrate.');
    console.log('Run "poem-os init" to create workspace first.');
    return;
  }

  try {
    // Read existing config
    const configContent = await fs.readFile(poemConfigPath, 'utf-8');
    const config = yaml.load(configContent);

    // Check if migration needed
    if (!needsMigration(config)) {
      console.log('\n✅ Config is already up-to-date (v1.1 schema).');
      console.log('\nCurrent schema:');
      console.log('- server.port:', config.server?.port || 'not set');
      console.log('- centralPoemPath:', config.centralPoemPath ?? 'not set');
      return;
    }

    // Display migration info
    console.log('\n📋 Migration needed:');
    if (!config.server) {
      console.log('  - Missing: server.port field (will add default: 9500)');
    }
    if (config.centralPoemPath === undefined) {
      console.log('  - Missing: centralPoemPath field (will add default: null)');
    }

    // Prompt for confirmation
    const confirmed = await promptMigration();
    if (!confirmed) {
      console.log('\n❌ Migration cancelled.');
      return;
    }

    // Perform migration
    const migratedConfig = { ...config };

    // Add server.port if missing
    if (!migratedConfig.server) {
      migratedConfig.server = { port: 9500 };
    }

    // Add centralPoemPath if missing
    if (migratedConfig.centralPoemPath === undefined) {
      migratedConfig.centralPoemPath = null;
    }

    // Generate migrated YAML with comment
    const timestamp = new Date().toISOString();
    const migratedYaml = yaml.dump(migratedConfig, {
      indent: 2,
      lineWidth: -1, // Disable line wrapping
    });

    const migratedContent = `${migratedYaml.trimEnd()}

# Migrated to v1.1 on ${timestamp}
`;

    // Write migrated config
    await fs.writeFile(poemConfigPath, migratedContent, 'utf-8');

    console.log('\n✅ Config migrated successfully!');
    console.log('\nMigrated schema:');
    console.log('- server.port:', migratedConfig.server.port);
    console.log('- centralPoemPath:', migratedConfig.centralPoemPath ?? 'null');
    console.log('\nConfig file: poem/config/poem.yaml');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    throw error;
  }
}
