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
import { spawn } from 'child_process';
import { existsSync } from 'fs';

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

  // Parse --port flag (supports both --port=XXXX and --port XXXX)
  let port = null;
  let list = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Handle --port=XXXX format
    if (arg.startsWith('--port=')) {
      port = arg.substring(7);
    }
    // Handle --port XXXX format
    else if (arg === '--port' && i + 1 < args.length) {
      port = args[i + 1];
    }
    // Handle --list flag
    else if (arg === '--list') {
      list = true;
    }
  }

  return {
    command,
    flags: {
      core: args.includes('--core'),
      app: args.includes('--app'),
      force: args.includes('--force'),
      verbose: args.includes('--verbose') || args.includes('-v'),
      help: args.includes('--help') || args.includes('-h'),
      port,
      list,
    },
  };
}

function showHelp() {
  console.log(`
POEM CLI v${VERSION}
Prompt Orchestration and Engineering Method

Usage:
  npx poem-os <command> [options]

Commands:
  install     Install POEM into the current directory
  start       Start the POEM server
  config      Configure POEM settings

Install Options:
  --core      Install only .poem-core/ (framework documents)
  --app       Install only .poem-app/ (runtime server)
  --force     Skip overwrite prompts (overwrite existing files)
  --verbose   Show detailed logging output
  --help, -h  Show this help message

Start Options:
  --port=XXXX Override server port temporarily

Config Options:
  --list      Show current configuration
  --port XXXX Set server port permanently

Examples:
  npx poem-os install              # Full installation
  npx poem-os install --core       # Install framework only
  npx poem-os start                # Start server on configured port
  npx poem-os start --port=3000    # Start on port 3000
  npx poem-os config --list        # View configuration
  npx poem-os config --port 8080   # Set port to 8080
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
// Port Configuration
// ============================================================================

async function promptForPort(force) {
  if (force) return 4321; // Skip prompt with --force

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\n? What port should POEM run on? (default: 4321): ', (answer) => {
      rl.close();
      if (!answer.trim()) {
        resolve(4321);
        return;
      }

      const port = parseInt(answer, 10);
      if (isNaN(port) || port < 1024 || port > 65535) {
        console.error('⚠️  Invalid port. Using default: 4321');
        resolve(4321);
      } else {
        resolve(port);
      }
    });
  });
}

async function configurePort(targetDir, port) {
  const envFile = path.join(targetDir, '.poem-app', '.env');
  let content = '';

  try {
    content = await fs.readFile(envFile, 'utf-8');
  } catch {
    // File doesn't exist yet, will create it
  }

  const lines = content.split('\n');
  let updated = false;
  const newLines = lines.map((line) => {
    if (line.startsWith('PORT=')) {
      updated = true;
      return `PORT=${port}`;
    }
    return line;
  });

  if (!updated) {
    newLines.push(`PORT=${port}`);
  }

  await fs.writeFile(envFile, newLines.join('\n'), 'utf-8');
  logVerbose(`Configured PORT=${port} in .poem-app/.env`);
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
// Command Handlers
// ============================================================================

async function handleInstall(flags) {
  const startTime = Date.now();

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

    // Configure port if installing the app
    if (shouldInstallApp) {
      const port = await promptForPort(flags.force);
      await configurePort(targetDir, port);
      log(`   ✓ Configured server port: ${port}`);
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

async function handleStart(flags) {
  // Validate POEM is installed
  if (!existsSync('.poem-app')) {
    console.error('\n❌ POEM is not installed in this directory.');
    console.error('   Run: npx poem-os install\n');
    process.exit(1);
  }

  // Load PORT from .env or use default
  const envFile = path.join(process.cwd(), '.poem-app', '.env');
  let port = '4321'; // Default port

  try {
    const content = await fs.readFile(envFile, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('PORT=')) {
        port = trimmed.substring(5); // Extract value after 'PORT='
        break;
      }
    }
  } catch {
    // .env file doesn't exist or can't be read, use default
    logVerbose('Could not read .env file, using default port 4321');
  }

  // Override with --port flag if provided
  if (flags.port) {
    port = flags.port.toString();
  }

  // Validate port
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 1024 || portNum > 65535) {
    console.error(`\n❌ Invalid port: ${port}`);
    console.error('   Port must be between 1024 and 65535.\n');
    process.exit(1);
  }

  log(`\n🚀 Starting POEM server on port ${portNum}...\n`);

  // Determine npm command (Windows uses npm.cmd)
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  // Spawn npm run dev in .poem-app directory
  const child = spawn(npm, ['run', 'dev'], {
    cwd: path.resolve('.poem-app'),
    env: { ...process.env, PORT: portNum.toString() },
    stdio: 'inherit', // Pass through stdout/stderr to show Astro logs
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(0);
  });

  // Forward child process exit code
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

async function handleConfig(flags) {
  // Validate POEM is installed
  if (!existsSync('.poem-app')) {
    console.error('\n❌ POEM is not installed in this directory.');
    console.error('   Run: npx poem-os install\n');
    process.exit(1);
  }

  const envFile = path.join(process.cwd(), '.poem-app', '.env');

  // Handle --list flag
  if (flags.list) {
    let config = {};
    try {
      const content = await fs.readFile(envFile, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...values] = trimmed.split('=');
          if (key) {
            config[key] = values.join('=');
          }
        }
      }
    } catch {
      // .env file doesn't exist, use defaults
    }

    log('\nCurrent POEM Configuration:');
    log(`  PORT: ${config.PORT || '4321 (default)'}`);
    log(`  POEM_DEV: ${config.POEM_DEV || 'false (default)'}\n`);
    process.exit(0);
  }

  // Handle --port flag
  if (flags.port) {
    const portNum = parseInt(flags.port, 10);
    if (isNaN(portNum) || portNum < 1024 || portNum > 65535) {
      console.error(`\n❌ Invalid port: ${flags.port}`);
      console.error('   Port must be between 1024 and 65535.\n');
      process.exit(1);
    }

    // Read existing .env file
    let config = {};
    try {
      const content = await fs.readFile(envFile, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...values] = trimmed.split('=');
          if (key) {
            config[key] = values.join('=');
          }
        }
      }
    } catch {
      // .env file doesn't exist, will create it
    }

    // Update PORT
    config.PORT = portNum.toString();

    // Write back to .env
    const lines = Object.entries(config).map(([key, value]) => `${key}=${value}`);
    await fs.writeFile(envFile, lines.join('\n') + '\n', 'utf-8');

    log(`\n✅ Port updated to ${portNum}`);
    log('   Restart POEM for changes to take effect:');
    log('   npx poem-os start\n');
    process.exit(0);
  }

  // No valid flags provided
  console.error('\n❌ Invalid usage.');
  console.error('   Usage: npx poem-os config --list | --port XXXX\n');
  process.exit(1);
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
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

  // Default to 'install' if no command provided
  const cmd = command || 'install';

  // Route to command handlers
  switch (cmd) {
    case 'install':
      await handleInstall(flags);
      break;
    case 'start':
      await handleStart(flags);
      break;
    case 'config':
      await handleConfig(flags);
      break;
    default:
      console.error(`\n❌ Unknown command: ${cmd}`);
      console.error('   Run "npx poem-os --help" for usage information.\n');
      process.exit(1);
  }
}

// Run main
main();
