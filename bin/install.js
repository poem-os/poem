#!/usr/bin/env node

/**
 * POEM Installer
 * Installs POEM (Prompt Orchestration and Engineering Method) into a user's project.
 *
 * Usage:
 *   npx poem-os install [options]
 *
 * Options:
 *   --core     Install only .poem-core/ (framework documents)
 *   --app      Install only .poem-app/ (runtime server)
 *   --force    Skip overwrite prompts
 *   --verbose  Show detailed logging
 *   --help     Show this help message
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const VERSION = '0.1.0';
const PACKAGE_ROOT = path.resolve(__dirname, '..');

// Directories to exclude during copy
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.astro',
  '.git',
  '.DS_Store',
  'package-lock.json',
];

// ============================================================================
// Node Version Check
// ============================================================================

function checkNodeVersion() {
  const nodeVersion = process.versions.node;
  const majorVersion = parseInt(nodeVersion.split('.')[0], 10);

  if (majorVersion < 22) {
    console.error(`\n❌ POEM requires Node.js 22.x or higher.`);
    console.error(`   Current version: ${nodeVersion}`);
    console.error(`   Please upgrade: https://nodejs.org/\n`);
    process.exit(1);
  }
}

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args.find((arg) => !arg.startsWith('-')) || '';

  return {
    command,
    flags: {
      core: args.includes('--core'),
      app: args.includes('--app'),
      force: args.includes('--force'),
      verbose: args.includes('--verbose') || args.includes('-v'),
      help: args.includes('--help') || args.includes('-h'),
    },
  };
}

function showHelp() {
  console.log(`
POEM Installer v${VERSION}
Prompt Orchestration and Engineering Method

Usage:
  npx poem-os install [options]

Commands:
  install     Install POEM into the current directory

Options:
  --core      Install only .poem-core/ (framework documents)
  --app       Install only .poem-app/ (runtime server)
  --force     Skip overwrite prompts (overwrite existing files)
  --verbose   Show detailed logging output
  --help, -h  Show this help message

Examples:
  npx poem-os install              # Full installation
  npx poem-os install --core       # Install framework only
  npx poem-os install --app        # Install runtime only
  npx poem-os install --force      # Overwrite without prompts
`);
}

// ============================================================================
// Logging Utilities
// ============================================================================

let verboseMode = false;

function log(message) {
  console.log(message);
}

function logVerbose(message) {
  if (verboseMode) {
    console.log(`  [verbose] ${message}`);
  }
}

function logError(message, context = {}) {
  console.error(`\n❌ Error: ${message}`);
  if (context.path) {
    console.error(`   Path: ${context.path}`);
  }
  if (context.code) {
    console.error(`   Code: ${context.code}`);
  }
}

// ============================================================================
// Directory Copy Utility
// ============================================================================

async function copyDirectory(src, dest, stats = { files: 0, dirs: 0 }) {
  // Create destination directory
  await fs.mkdir(dest, { recursive: true });
  stats.dirs++;

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Check if should be excluded
    if (EXCLUDE_PATTERNS.includes(entry.name)) {
      logVerbose(`Skipping: ${entry.name}`);
      continue;
    }

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath, stats);
    } else {
      await fs.copyFile(srcPath, destPath);
      stats.files++;
      logVerbose(`Copied: ${entry.name}`);
    }
  }

  return stats;
}

async function directoryExists(dirPath) {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

// ============================================================================
// Interactive Prompts
// ============================================================================

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function checkExistingInstallation(targetDir, flags) {
  const checks = [
    { path: path.join(targetDir, '.poem-core'), name: '.poem-core' },
    { path: path.join(targetDir, '.poem-app'), name: '.poem-app' },
    { path: path.join(targetDir, 'poem'), name: 'poem' },
    { path: path.join(targetDir, '.claude', 'commands', 'poem'), name: '.claude/commands/poem' },
  ];

  const existing = [];
  for (const check of checks) {
    if (await directoryExists(check.path)) {
      existing.push(check.name);
    }
  }

  if (existing.length === 0) {
    return 'install'; // Fresh install
  }

  if (flags.force) {
    log(`\n⚠️  Existing installation detected: ${existing.join(', ')}`);
    log('   Using --force: overwriting existing files.\n');
    return 'overwrite';
  }

  log(`\n⚠️  Existing installation detected: ${existing.join(', ')}`);
  const answer = await prompt(
    '   [O]verwrite, [M]erge (preserve poem/), or [C]ancel? '
  );

  switch (answer.charAt(0)) {
    case 'o':
      return 'overwrite';
    case 'm':
      return 'merge';
    case 'c':
    default:
      return 'cancel';
  }
}

// ============================================================================
// Installation Logic
// ============================================================================

async function installCore(targetDir) {
  const srcDir = path.join(PACKAGE_ROOT, 'packages', 'poem-core');
  const destDir = path.join(targetDir, '.poem-core');

  if (!(await directoryExists(srcDir))) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  log('Installing .poem-core/ (framework documents)...');
  const stats = await copyDirectory(srcDir, destDir);
  log(`   ✓ Copied ${stats.files} files in ${stats.dirs} directories`);

  return stats;
}

async function installApp(targetDir) {
  const srcDir = path.join(PACKAGE_ROOT, 'packages', 'poem-app');
  const destDir = path.join(targetDir, '.poem-app');

  if (!(await directoryExists(srcDir))) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  log('Installing .poem-app/ (runtime server)...');
  const stats = await copyDirectory(srcDir, destDir);
  log(`   ✓ Copied ${stats.files} files in ${stats.dirs} directories`);

  return stats;
}

async function createWorkspace(targetDir, mode) {
  const workspaceDir = path.join(targetDir, 'poem');

  // In merge mode, preserve existing workspace
  if (mode === 'merge' && (await directoryExists(workspaceDir))) {
    log('Preserving existing poem/ workspace (merge mode)...');
    return { files: 0, dirs: 0, preserved: true };
  }

  log('Creating poem/ workspace...');

  const subdirs = [
    'prompts',
    'schemas',
    'schemas/dictionaries',
    'mock-data',
    'mock-data/scenarios',
    'workflow-data',
    'config',
    'config/providers',
  ];

  for (const subdir of subdirs) {
    const dirPath = path.join(workspaceDir, subdir);
    await fs.mkdir(dirPath, { recursive: true });
    logVerbose(`Created: poem/${subdir}/`);
  }

  // Create default poem.yaml config file
  const configPath = path.join(workspaceDir, 'config', 'poem.yaml');
  const defaultConfig = `# POEM Configuration
# See documentation for available options

version: "${VERSION}"
workspace: ./poem

# Server settings (used by .poem-app)
server:
  port: 4321
  host: localhost

# Provider configurations
providers: []
`;

  await fs.writeFile(configPath, defaultConfig);
  logVerbose('Created: poem/config/poem.yaml');

  log(`   ✓ Created workspace with ${subdirs.length} directories`);

  return { files: 1, dirs: subdirs.length };
}

async function removeDirectory(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    logVerbose(`Could not remove ${dirPath}: ${error.message}`);
  }
}

async function installCommands(targetDir) {
  const srcDir = path.join(PACKAGE_ROOT, 'packages', 'poem-core', 'commands');
  const destDir = path.join(targetDir, '.claude', 'commands', 'poem');

  // Check if source commands directory exists
  if (!(await directoryExists(srcDir))) {
    // Create empty directory structure if no commands exist yet
    log('Creating .claude/commands/poem/ (slash commands)...');
    const subdirs = ['agents', 'skills'];
    for (const subdir of subdirs) {
      const dirPath = path.join(destDir, subdir);
      await fs.mkdir(dirPath, { recursive: true });
      logVerbose(`Created: .claude/commands/poem/${subdir}/`);
    }
    log(`   ✓ Created slash command directories`);
    return { files: 0, dirs: subdirs.length };
  }

  log('Installing .claude/commands/poem/ (slash commands)...');
  const stats = await copyDirectory(srcDir, destDir);
  log(`   ✓ Copied ${stats.files} files in ${stats.dirs} directories`);

  return stats;
}

// ============================================================================
// Success Message
// ============================================================================

function showSuccessMessage(results, targetDir) {
  const { installedCore, installedApp, createdWorkspace, installedCommands } = results;

  log('\n✅ POEM installed successfully!\n');

  log('Installed:');
  if (installedCore) {
    log('  ├── .poem-core/           (framework documents)');
  }
  if (installedApp) {
    log('  ├── .poem-app/            (runtime server)');
  }
  if (installedCommands) {
    log('  ├── .claude/commands/poem/ (slash commands)');
  }
  if (createdWorkspace) {
    log('  └── poem/                 (your workspace)');
  }

  log('\nSlash Commands:');
  log('  /poem/agents/prompt-engineer  - Activate Prompt Engineer agent');
  log('  /poem/help                    - List all POEM commands');

  log('\nNext steps:');
  log('  1. cd .poem-app && npm install');
  log('  2. npm run dev');
  log('  3. In Claude Code: /poem/agents/prompt-engineer');

  log(`\nVersion: ${VERSION}`);
  log(`Location: ${targetDir}\n`);
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
  const startTime = Date.now();

  // Check Node.js version first
  checkNodeVersion();

  // Parse command line arguments
  const { command, flags } = parseArgs();
  verboseMode = flags.verbose;

  // Show help if requested
  if (flags.help) {
    showHelp();
    process.exit(0);
  }

  // Validate command
  if (command !== 'install') {
    if (command) {
      logError(`Unknown command: ${command}`);
    }
    log('\nUsage: npx poem-os install [options]');
    log('Run "npx poem-os --help" for more information.\n');
    process.exit(1);
  }

  // Determine what to install
  const shouldInstallCore = !flags.app || flags.core;
  const shouldInstallApp = !flags.core || flags.app;
  const shouldCreateWorkspace = !flags.core && !flags.app; // Only create workspace for full install
  const shouldInstallCommands = !flags.app; // Install commands with core or full install

  log('\n📦 POEM Installer v' + VERSION);
  log('─'.repeat(40));

  if (verboseMode) {
    log('Verbose mode enabled\n');
  }

  // Target is current working directory
  const targetDir = process.cwd();
  logVerbose(`Target directory: ${targetDir}`);
  logVerbose(`Package root: ${PACKAGE_ROOT}`);

  try {
    // Check for existing installation
    const mode = await checkExistingInstallation(targetDir, flags);

    if (mode === 'cancel') {
      log('\nInstallation cancelled.\n');
      process.exit(0);
    }

    // In overwrite mode, remove existing directories first
    if (mode === 'overwrite') {
      if (shouldInstallCore) {
        await removeDirectory(path.join(targetDir, '.poem-core'));
      }
      if (shouldInstallApp) {
        await removeDirectory(path.join(targetDir, '.poem-app'));
      }
      if (shouldCreateWorkspace) {
        await removeDirectory(path.join(targetDir, 'poem'));
      }
      if (shouldInstallCommands) {
        await removeDirectory(path.join(targetDir, '.claude', 'commands', 'poem'));
      }
    }

    // Perform installation
    const results = {
      installedCore: false,
      installedApp: false,
      createdWorkspace: false,
      installedCommands: false,
    };

    if (shouldInstallCore) {
      await installCore(targetDir);
      results.installedCore = true;
    }

    if (shouldInstallApp) {
      await installApp(targetDir);
      results.installedApp = true;
    }

    if (shouldInstallCommands) {
      await installCommands(targetDir);
      results.installedCommands = true;
    }

    if (shouldCreateWorkspace) {
      await createWorkspace(targetDir, mode);
      results.createdWorkspace = true;
    }

    // Calculate elapsed time
    const elapsed = Date.now() - startTime;
    logVerbose(`Installation completed in ${elapsed}ms`);

    // Show success message
    showSuccessMessage(results, targetDir);
  } catch (error) {
    logError(error.message, { path: error.path, code: error.code });
    process.exit(1);
  }
}

// Run main
main();
