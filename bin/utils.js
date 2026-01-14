#!/usr/bin/env node

/**
 * Shared Utilities for POEM CLI
 * Used by start.js, config.js, and other CLI commands
 */

import * as fs from 'fs/promises';
import { existsSync } from 'fs';

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
