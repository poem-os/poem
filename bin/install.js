#!/usr/bin/env node

/**
 * POEM Installer
 * Installs POEM (Prompt Orchestration and Engineering Method) into a user's project.
 *
 * Usage:
 *   npx poem-os install [options]
 *
 * Options:
 *   --core      Install only .poem-core/ (framework documents)
 *   --app       Install only .poem-app/ (runtime server)
 *   --force     Skip overwrite prompts
 *   --skip-deps Skip automatic dependency installation (for offline environments)
 *   --verbose   Show detailed logging
 *   --help      Show this help message
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
  let health = false;
  let cleanup = false;

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
    // Handle --health flag
    else if (arg === '--health') {
      health = true;
    }
    // Handle --cleanup flag
    else if (arg === '--cleanup') {
      cleanup = true;
    }
  }

  return {
    command,
    flags: {
      core: args.includes('--core'),
      app: args.includes('--app'),
      force: args.includes('--force'),
      'skip-deps': args.includes('--skip-deps'),
      verbose: args.includes('--verbose') || args.includes('-v'),
      help: args.includes('--help') || args.includes('-h'),
      port,
      list,
      health,
      cleanup,
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
  registry    Manage POEM installations registry

Install Options:
  --core      Install only .poem-core/ (framework documents)
  --app       Install only .poem-app/ (runtime server)
  --force     Skip overwrite prompts (overwrite existing files)
  --skip-deps Skip automatic dependency installation (for offline/air-gapped environments)
  --verbose   Show detailed logging output
  --help, -h  Show this help message

Start Options:
  --port=XXXX Override server port temporarily

Config Options:
  --list      Show current configuration
  --port XXXX Set server port permanently

Registry Options:
  --list      Show all POEM installations
  --health    Check installation health and update registry
  --cleanup   Remove missing installations from registry

Examples:
  npx poem-os install                # Full installation
  npx poem-os install --core         # Install framework only
  npx poem-os start                  # Start server on configured port
  npx poem-os start --port=3000      # Start on port 3000
  npx poem-os config --list          # View configuration
  npx poem-os config --port 8080     # Set port to 8080
  npx poem-os registry --list        # List all installations
  npx poem-os registry --health      # Check installation health
  npx poem-os registry --cleanup     # Clean up missing installations
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

/**
 * Recursively scans a directory and returns all file paths relative to root
 * @param {string} dir - Directory to scan
 * @param {string} root - Root directory for relative paths
 * @param {string[]} files - Accumulated file list
 * @returns {Promise<string[]>} - Array of relative file paths
 */
async function getAllFiles(dir, root = dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip excluded patterns
    if (EXCLUDE_PATTERNS.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      await getAllFiles(fullPath, root, files);
    } else {
      // Store relative path from root
      const relativePath = path.relative(root, fullPath);
      files.push(relativePath);
    }
  }

  return files;
}

async function copyDirectory(src, dest, stats = { files: 0, dirs: 0 }, preservationContext = null) {
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

    // Check preservation if context provided
    if (preservationContext) {
      const relativePath = path.relative(preservationContext.targetDir, destPath);
      const normalizedPath = relativePath.replace(/\\/g, '/');

      // Check if preserved by rules
      if (preservationContext.isPreserved(normalizedPath, preservationContext.rules)) {
        logVerbose(`Preserved: ${normalizedPath}`);
        continue;
      }

      // Check if user workflow
      if (preservationContext.isUserWorkflow(normalizedPath)) {
        logVerbose(`Preserved (user workflow): ${normalizedPath}`);
        continue;
      }
    }

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath, stats, preservationContext);
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

async function installCore(targetDir, preservationContext = null) {
  const srcDir = path.join(PACKAGE_ROOT, 'packages', 'poem-core');
  const destDir = path.join(targetDir, '.poem-core');

  if (!(await directoryExists(srcDir))) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  log('Installing .poem-core/ (framework documents)...');
  const stats = await copyDirectory(srcDir, destDir, { files: 0, dirs: 0 }, preservationContext);
  log(`   ✓ Copied ${stats.files} files in ${stats.dirs} directories`);

  return stats;
}

async function installApp(targetDir, preservationContext = null) {
  const srcDir = path.join(PACKAGE_ROOT, 'packages', 'poem-app');
  const destDir = path.join(targetDir, '.poem-app');

  if (!(await directoryExists(srcDir))) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  log('Installing .poem-app/ (runtime server)...');
  const stats = await copyDirectory(srcDir, destDir, { files: 0, dirs: 0 }, preservationContext);
  log(`   ✓ Copied ${stats.files} files in ${stats.dirs} directories`);

  return stats;
}

async function createWorkspace(targetDir) {
  const workspaceDir = path.join(targetDir, 'poem');

  // Preserve existing workspace (aligned with preservation system)
  if (await directoryExists(workspaceDir)) {
    log('Preserving existing poem/ workspace...');
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

async function promptForPort(force, targetDir = null) {
  const { checkPortConflict, suggestAvailablePorts } = await import('./utils.js');

  // Helper function to check and validate port
  async function validatePortWithConflictCheck(port) {
    // First validate port range
    if (isNaN(port) || port < 1024 || port > 65535) {
      return { valid: false, error: 'invalid_range' };
    }

    // Check for conflicts (exclude current installation path)
    const installPath = targetDir ? path.resolve(targetDir) : null;
    const { conflict, installation } = await checkPortConflict(port, installPath);

    if (conflict) {
      return { valid: false, error: 'conflict', installation };
    }

    return { valid: true };
  }

  if (force) {
    // In force mode, still check for conflicts but use first available port
    const { conflict } = await checkPortConflict(9500, targetDir ? path.resolve(targetDir) : null);
    if (conflict) {
      const suggestions = await suggestAvailablePorts(9500, 1);
      return suggestions[0];
    }
    return 9500;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(async (resolve) => {
    // First, check if default port is available
    const defaultPort = 9500;
    const defaultCheck = await validatePortWithConflictCheck(defaultPort);

    if (!defaultCheck.valid && defaultCheck.error === 'conflict') {
      // Default port has conflict, show suggestions
      const suggestions = await suggestAvailablePorts(9500, 3);
      log(`\n⚠️  Port ${defaultPort} is already allocated to:`);
      log(`   [${defaultCheck.installation.id}] ${defaultCheck.installation.path}`);
      log(`\n   Suggested available ports: ${suggestions.join(', ')}`);
    }

    const askForPort = () => {
      rl.question('\n? What port should POEM run on? (default: 9500): ', async (answer) => {
        if (!answer.trim()) {
          // User pressed enter, use default or first suggestion
          if (!defaultCheck.valid && defaultCheck.error === 'conflict') {
            const suggestions = await suggestAvailablePorts(9500, 1);
            rl.close();
            resolve(suggestions[0]);
          } else {
            rl.close();
            resolve(9500);
          }
          return;
        }

        const port = parseInt(answer, 10);
        const validation = await validatePortWithConflictCheck(port);

        if (!validation.valid) {
          if (validation.error === 'invalid_range') {
            console.error('⚠️  Invalid port. Port must be between 1024 and 65535.');
            askForPort(); // Ask again
          } else if (validation.error === 'conflict') {
            const suggestions = await suggestAvailablePorts(9500, 3);
            console.error(`\n⚠️  Port ${port} is already allocated to:`);
            console.error(`   [${validation.installation.id}] ${validation.installation.path}`);
            console.log(`\n   Suggested available ports: ${suggestions.join(', ')}`);
            askForPort(); // Ask again
          }
        } else {
          rl.close();
          resolve(port);
        }
      });
    };

    askForPort();
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

async function registerInstallation(targetDir, port) {
  const {
    readRegistry,
    writeRegistry,
    generateInstallationId,
    getGitBranch,
    getPoemVersion
  } = await import('./utils.js');

  // Read current registry
  const registry = await readRegistry();

  // Generate installation record
  const installPath = path.resolve(targetDir);
  const id = generateInstallationId(installPath);
  const gitBranch = await getGitBranch(installPath);
  const poemVersion = await getPoemVersion(PACKAGE_ROOT);

  // Determine mode from .env
  const envFile = path.join(targetDir, '.poem-app', '.env');
  let mode = 'production';
  try {
    const content = await fs.readFile(envFile, 'utf-8');
    if (content.includes('POEM_DEV=true')) {
      mode = 'development';
    }
  } catch {
    // .env doesn't exist yet or can't be read
  }

  // Check if installation already exists
  const existingIndex = registry.installations.findIndex(
    install => install.path === installPath
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    // Update existing installation (preserve installedAt)
    const existing = registry.installations[existingIndex];
    registry.installations[existingIndex] = {
      ...existing,
      id,
      port,
      poemVersion,
      lastChecked: now,
      version: VERSION,
      mode,
      gitBranch,
      status: 'active',
      metadata: {
        lastServerRun: existing.metadata?.lastServerRun || null,
        workflowCount: existing.metadata?.workflowCount || 0,
        promptCount: existing.metadata?.promptCount || 0
      }
    };
  } else {
    // Create new installation
    const installation = {
      id,
      path: installPath,
      port,
      poemVersion,
      installedAt: now,
      lastChecked: now,
      version: VERSION,
      mode,
      currentWorkflow: null,
      gitBranch,
      status: 'active',
      metadata: {
        lastServerRun: null,
        workflowCount: 0,
        promptCount: 0
      }
    };
    registry.installations.push(installation);
  }

  // Write registry
  await writeRegistry(registry);

  log(`   ✓ Registered in ~/.poem/registry.json`);
}

async function installDependencies(targetDir) {
  const appDir = path.join(targetDir, '.poem-app');

  log('Installing dependencies (this may take a minute)...');
  logVerbose(`Running npm install in ${appDir}`);

  return new Promise((resolve, reject) => {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    const child = spawn(npm, ['install'], {
      cwd: appDir,
      stdio: verboseMode ? 'inherit' : 'pipe', // Show output only in verbose mode
    });

    let errorOutput = '';

    if (!verboseMode) {
      // Collect error output silently for error reporting
      child.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });
    }

    child.on('error', (error) => {
      reject(new Error(`Failed to run npm install: ${error.message}`));
    });

    child.on('exit', (code) => {
      if (code === 0) {
        log('   ✓ Dependencies installed');
        resolve();
      } else {
        const error = new Error('npm install failed');
        error.details = errorOutput;
        error.exitCode = code;
        reject(error);
      }
    });
  });
}

// ============================================================================
// Installation Analysis
// ============================================================================

/**
 * Analyzes what will be changed during installation
 * @param {string} sourceDir - Source directory (PACKAGE_ROOT)
 * @param {string} targetDir - Target directory (project root)
 * @param {string[]} preservationRules - Preservation rules from .poem-preserve
 * @param {boolean} shouldInstallCore - Whether to install .poem-core
 * @param {boolean} shouldInstallApp - Whether to install .poem-app
 * @returns {Promise<Object>} - Analysis object with file lists
 */
async function analyzeInstallation(
  sourceDir,
  targetDir,
  preservationRules,
  shouldInstallCore = true,
  shouldInstallApp = true
) {
  const { parsePreservationFile, isPreserved, isUserWorkflow } = await import('./preservation.js');
  const { readRegistry } = await import('./utils.js');

  // Track files by category for detailed reporting
  const coreFilesToUpdate = [];
  const appFilesToUpdate = [];
  const preservedWorkspace = new Set();
  const preservedConfig = [];
  const preservedCustomWorkflows = [];
  const modifiedFiles = [];

  // Get registry for hash comparison
  const registry = await readRegistry();
  const installPath = path.resolve(targetDir);
  const existingInstall = registry.installations.find(i => i.path === installPath);
  const fileHashes = existingInstall?.metadata?.fileHashes || {};

  // Scan .poem-core files
  if (shouldInstallCore) {
    const coreSource = path.join(sourceDir, 'packages', 'poem-core');
    if (await directoryExists(coreSource)) {
      const coreFiles = await getAllFiles(coreSource);

      for (const file of coreFiles) {
        const targetPath = path.join('.poem-core', file);

        // Check if preserved by rules
        if (isPreserved(targetPath, preservationRules)) {
          // Don't track individual files in preserved folders
          continue;
        }

        // Check if user workflow
        if (isUserWorkflow(targetPath)) {
          preservedCustomWorkflows.push(targetPath);
          continue;
        }

        // File will be updated
        coreFilesToUpdate.push(targetPath);

        // Check if file was modified (hash mismatch)
        const targetFullPath = path.join(targetDir, targetPath);
        if (existsSync(targetFullPath)) {
          // TODO: Implement hash checking when registry tracks file hashes
          // For now, skip modification detection
        }
      }
    }
  }

  // Scan .poem-app files
  if (shouldInstallApp) {
    const appSource = path.join(sourceDir, 'packages', 'poem-app');
    if (await directoryExists(appSource)) {
      const appFiles = await getAllFiles(appSource);

      for (const file of appFiles) {
        const targetPath = path.join('.poem-app', file);

        // Check if preserved by rules
        if (isPreserved(targetPath, preservationRules)) {
          // Track .env specifically as config
          if (targetPath === '.poem-app/.env') {
            preservedConfig.push('.poem-app/.env');
          }
          continue;
        }

        // File will be updated
        appFilesToUpdate.push(targetPath);
      }
    }
  }

  // Check for preserved workspace folders
  if (preservationRules.includes('poem/')) {
    preservedWorkspace.add('poem/');
  }
  if (preservationRules.includes('dev-workspace/')) {
    preservedWorkspace.add('dev-workspace/');
  }

  return {
    // Categorized updates
    coreFilesToUpdate,
    appFilesToUpdate,
    totalFilesToUpdate: coreFilesToUpdate.length + appFilesToUpdate.length,

    // Categorized preserved items
    preservedWorkspace: Array.from(preservedWorkspace),
    preservedConfig,
    preservedCustomWorkflows,

    // Legacy fields for compatibility
    filesToUpdate: [...coreFilesToUpdate, ...appFilesToUpdate],
    filesPreserved: [...preservedConfig, ...preservedCustomWorkflows],
    foldersPreserved: Array.from(preservedWorkspace),
    modifiedFiles,
  };
}

/**
 * Prompts user for confirmation before overwriting files
 * @param {Object} analysis - Analysis object from analyzeInstallation
 * @returns {Promise<boolean>} - True if user confirms, false if cancels
 */
async function promptInstallationConfirmation(analysis) {
  const {
    coreFilesToUpdate,
    appFilesToUpdate,
    totalFilesToUpdate,
    preservedWorkspace,
    preservedConfig,
    preservedCustomWorkflows,
    modifiedFiles,
  } = analysis;

  log('\n' + '─'.repeat(50));
  log('POEM Installation Summary:');
  log('─'.repeat(50));

  // Updates section
  log('Updates:');
  if (coreFilesToUpdate.length > 0) {
    log(`  .poem-core/    ${coreFilesToUpdate.length} files (framework)`);
  }
  if (appFilesToUpdate.length > 0) {
    log(`  .poem-app/     ${appFilesToUpdate.length} files (runtime)`);
  }

  // Preserved section - only show if there are preserved items
  const hasPreservedItems =
    preservedWorkspace.length > 0 ||
    preservedConfig.length > 0 ||
    preservedCustomWorkflows.length > 0;

  if (hasPreservedItems) {
    log('  ');
    log('Preserved:');

    // Show workspace folders
    for (const workspace of preservedWorkspace) {
      log(`  ✓ ${workspace} (workspace)`);
    }

    // Show config files
    for (const config of preservedConfig) {
      log(`  ✓ ${config} (configuration)`);
    }

    // Show custom workflows
    if (preservedCustomWorkflows.length > 0) {
      log(`  ✓ ${preservedCustomWorkflows.length} custom workflows`);
    }
  }

  log('─'.repeat(50));

  // Show modified files warning if any
  if (modifiedFiles.length > 0) {
    log(`\n⚠️  ${modifiedFiles.length} file(s) were modified and will be overwritten:`);
    const toShow = modifiedFiles.slice(0, 10);
    for (const file of toShow) {
      log(`    - ${file}`);
    }
    if (modifiedFiles.length > 10) {
      log(`    ...and ${modifiedFiles.length - 10} more`);
    }
    log('');
  }

  const answer = await prompt(`\nContinue? [y/N]: `);

  return answer === 'y' || answer === 'yes';
}

// ============================================================================
// Success Message
// ============================================================================

function showSuccessMessage(results, targetDir) {
  const {
    installedCore,
    installedApp,
    createdWorkspace,
    installedCommands,
    installedDependencies,
    skippedDependencies,
    dependencyError,
  } = results;

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

  // Show appropriate next steps based on dependency installation status
  if (installedDependencies) {
    // Dependencies installed successfully - ready to go
    log('  1. npx poem-os start              (start the server)');
    log('  2. In Claude Code: /poem/agents/prompt-engineer');
  } else if (skippedDependencies || dependencyError) {
    // Dependencies not installed - manual steps required
    log('  1. cd .poem-app && npm install    (install dependencies)');
    log('  2. cd ..                          (return to project root)');
    log('  3. npx poem-os start              (start the server)');
    log('  4. In Claude Code: /poem/agents/prompt-engineer');

    if (dependencyError) {
      log('\n⚠️  Dependencies were not installed automatically.');
      log('   Complete step 1 manually before starting the server.');
    }
  } else {
    // App not installed or core-only install
    log('  1. cd .poem-app && npm install');
    log('  2. npm run dev');
    log('  3. In Claude Code: /poem/agents/prompt-engineer');
  }

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
    // Silently detect existing installation
    const hasCore = await directoryExists(path.join(targetDir, '.poem-core'));
    const hasApp = await directoryExists(path.join(targetDir, '.poem-app'));
    const isReinstallation = hasCore || hasApp;

    // Prepare preservation context for reinstallation
    let preservationContext = null;
    if (isReinstallation && !flags.force) {
      // CRITICAL: Create/migrate .poem-preserve FIRST
      // This ensures preservation rules are available during analysis
      const { createPreservationFile, parsePreservationFile, isPreserved, isUserWorkflow } = await import('./preservation.js');
      const preserveResult = await createPreservationFile(targetDir);

      // Notify user of migration if rules were added
      if (preserveResult.migrated) {
        logVerbose(`Migrated .poem-preserve (added: ${preserveResult.missingRules.join(', ')})`);
      }

      // Reinstallation: Use preservation system with confirmation prompt
      const preservationRules = await parsePreservationFile(targetDir);

      // Run installation analysis
      const analysis = await analyzeInstallation(
        PACKAGE_ROOT,
        targetDir,
        preservationRules,
        shouldInstallCore,
        shouldInstallApp
      );

      // Show NEW preservation-aware confirmation prompt
      const confirmed = await promptInstallationConfirmation(analysis);

      if (!confirmed) {
        log('\nInstallation cancelled.\n');
        process.exit(0);
      }

      // Create preservation context for file copying
      preservationContext = {
        targetDir,
        rules: preservationRules,
        isPreserved,
        isUserWorkflow,
      };
    } else if (isReinstallation && flags.force) {
      // Force mode: Skip prompts, show warning
      log(`\n⚠️  Existing installation detected (--force mode)`);
      log('   Overwriting without confirmation...\n');
    }

    // Perform installation
    const results = {
      installedCore: false,
      installedApp: false,
      createdWorkspace: false,
      installedCommands: false,
    };

    if (shouldInstallCore) {
      await installCore(targetDir, preservationContext);
      results.installedCore = true;
    }

    if (shouldInstallApp) {
      await installApp(targetDir, preservationContext);
      results.installedApp = true;

      // Install dependencies automatically unless --skip-deps flag is set
      if (!flags['skip-deps']) {
        try {
          await installDependencies(targetDir);
          results.installedDependencies = true;
        } catch (error) {
          log('\n⚠️  Warning: Failed to install dependencies automatically');
          log(`   Error: ${error.message}\n`);
          log('   This usually means:');
          log('   • No internet connection (air-gapped environment)');
          log('   • npm registry is unreachable');
          log('   • Firewall or proxy blocking npm\n');
          log('   To complete installation manually:');
          log('   1. cd .poem-app');
          log('   2. npm install');
          log('   3. cd ..\n');
          log('   Alternatively, re-run with: npx poem-os install --skip-deps\n');
          results.installedDependencies = false;
          results.dependencyError = error.message;
        }
      } else {
        log('   ⊘ Skipping dependency installation (--skip-deps)');
        results.installedDependencies = false;
        results.skippedDependencies = true;
      }
    }

    if (shouldInstallCommands) {
      await installCommands(targetDir);
      results.installedCommands = true;
    }

    if (shouldCreateWorkspace) {
      await createWorkspace(targetDir);
      results.createdWorkspace = true;
    }

    // Create preservation file for fresh installs
    // (For reinstallations, it was already created/migrated before analysis)
    if (!isReinstallation) {
      const { createPreservationFile } = await import('./preservation.js');
      const preserveResult = await createPreservationFile(targetDir);
      if (preserveResult.created) {
        log('Creating .poem-preserve (preservation rules)...');
        log('   ✓ Created preservation file');
        results.createdPreservationFile = true;
      } else if (preserveResult.migrated) {
        logVerbose(`Migrated .poem-preserve (added: ${preserveResult.missingRules.join(', ')})`);
      } else if (preserveResult.reason === 'already_exists') {
        logVerbose('Preservation file already exists, skipping creation');
      }
    }

    // Configure port if installing the app
    if (shouldInstallApp) {
      const { readEnvFile } = await import('./utils.js');
      const envFile = path.join(targetDir, '.poem-app', '.env');
      let port;

      if (isReinstallation) {
        // Reinstallation: Check registry first (source of truth), then .env, then prompt
        const { readRegistry } = await import('./utils.js');
        const registry = await readRegistry();
        const installPath = path.resolve(targetDir);
        const existingInstall = registry.installations.find(i => i.path === installPath);

        // Try registry first
        if (existingInstall && existingInstall.port) {
          port = existingInstall.port;
          logVerbose(`Found port in registry: ${port}`);

          // Update .env if it's missing PORT (repair scenario)
          const envConfig = await readEnvFile(envFile);
          if (!envConfig.PORT) {
            logVerbose(`Repairing .env (missing PORT entry)`);
            await configurePort(targetDir, port);
          }

          log(`   ✓ Using existing port: ${port}`);
        } else {
          // Fallback: Try reading from .env
          const envConfig = await readEnvFile(envFile);
          port = envConfig.PORT ? parseInt(envConfig.PORT, 10) : null;

          if (port) {
            logVerbose(`Found port in .env: ${port}`);
            log(`   ✓ Using existing port: ${port}`);
          } else {
            // Last resort: Prompt for port
            logVerbose(`No port found in registry or .env, prompting user`);
            port = await promptForPort(flags.force, targetDir);
            await configurePort(targetDir, port);
            log(`   ✓ Configured server port: ${port}`);
          }
        }
      } else {
        // Fresh install: Prompt for port and create .env
        port = await promptForPort(flags.force, targetDir);
        await configurePort(targetDir, port);
        log(`   ✓ Configured server port: ${port}`);
      }

      // Register installation in ~/.poem/registry.json
      await registerInstallation(targetDir, port);
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

  // Validate dependencies are installed
  if (!existsSync('.poem-app/node_modules')) {
    console.error('\n❌ POEM dependencies not installed.');
    console.error('   Run: cd .poem-app && npm install && cd ..\n');
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
    const { checkPortConflict, suggestAvailablePorts } = await import('./utils.js');

    const portNum = parseInt(flags.port, 10);
    if (isNaN(portNum) || portNum < 1024 || portNum > 65535) {
      console.error(`\n❌ Invalid port: ${flags.port}`);
      console.error('   Port must be between 1024 and 65535.\n');
      process.exit(1);
    }

    // Check for port conflicts (exclude current installation)
    const targetDir = process.cwd();
    const { conflict, installation } = await checkPortConflict(portNum, path.resolve(targetDir));

    if (conflict) {
      const suggestions = await suggestAvailablePorts(9500, 3);
      console.error(`\n⚠️  Port ${portNum} is already allocated to:`);
      console.error(`   [${installation.id}] ${installation.path}`);
      console.log(`\n   Suggested available ports: ${suggestions.join(', ')}`);
      console.log('   Override with: npx poem-os config --port XXXX\n');
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

    // Update registry with new port
    await registerInstallation(targetDir, portNum);

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

async function handleRegistry(flags) {
  const { readRegistry, writeRegistry, generateInstallationId, getGitBranch } = await import('./utils.js');

  // Handle --list flag (show all installations)
  if (flags.list) {
    const registry = await readRegistry();

    log('\n📋 POEM Installation Registry\n');
    log(`Registry version: ${registry.version}`);
    log(`Location: ~/.poem/registry.json`);
    log(`Total installations: ${registry.installations.length}\n`);

    if (registry.installations.length === 0) {
      log('No installations found.\n');
      process.exit(0);
    }

    // Sort by status (active first) then by lastChecked
    const sorted = [...registry.installations].sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return b.lastChecked.localeCompare(a.lastChecked);
    });

    for (const install of sorted) {
      const statusIcon = {
        active: '✓',
        inactive: '○',
        stale: '⚠',
        missing: '✗'
      }[install.status] || '?';

      log(`${statusIcon} [${install.id}] ${install.status.toUpperCase()}`);
      log(`  Path: ${install.path}`);
      log(`  Port: ${install.port !== null ? install.port : 'not configured'}`);
      log(`  Version: ${install.version}`);
      log(`  Mode: ${install.mode}`);
      if (install.gitBranch) {
        log(`  Branch: ${install.gitBranch}`);
      }
      log(`  Installed: ${new Date(install.installedAt).toLocaleString()}`);
      log(`  Last checked: ${new Date(install.lastChecked).toLocaleString()}`);
      log('');
    }

    process.exit(0);
  }

  // Handle --health flag (check and update installation status)
  if (flags.health) {
    const registry = await readRegistry();

    log('\n🏥 Checking installation health...\n');

    let updated = false;
    for (const install of registry.installations) {
      // Check if installation directory exists
      const poemAppDir = path.join(install.path, '.poem-app');
      const exists = existsSync(poemAppDir);

      // Check git branch (may have changed)
      const gitBranch = await getGitBranch(install.path);

      let newStatus = install.status;
      if (!exists) {
        newStatus = 'missing';
      } else if (install.status === 'missing') {
        newStatus = 'active'; // Directory exists again
      }

      // Update if status or branch changed
      if (newStatus !== install.status || gitBranch !== install.gitBranch) {
        install.status = newStatus;
        install.gitBranch = gitBranch;
        install.lastChecked = new Date().toISOString();
        updated = true;

        const statusIcon = {
          active: '✓',
          inactive: '○',
          stale: '⚠',
          missing: '✗'
        }[newStatus] || '?';

        log(`${statusIcon} [${install.id}] ${newStatus.toUpperCase()}`);
        log(`  Path: ${install.path}`);
        log('');
      }
    }

    if (updated) {
      await writeRegistry(registry);
      log('✅ Registry updated\n');
    } else {
      log('✅ All installations are up to date\n');
    }

    process.exit(0);
  }

  // Handle --cleanup flag (remove stale/missing installations)
  if (flags.cleanup) {
    const registry = await readRegistry();

    log('\n🧹 Cleaning up registry...\n');

    const before = registry.installations.length;
    registry.installations = registry.installations.filter(install => {
      if (install.status === 'missing') {
        log(`✗ Removing [${install.id}] ${install.path} (missing)`);
        return false;
      }
      return true;
    });

    const removed = before - registry.installations.length;

    if (removed > 0) {
      await writeRegistry(registry);
      log(`\n✅ Removed ${removed} installation(s)\n`);
    } else {
      log('✅ No installations to remove\n');
    }

    process.exit(0);
  }

  // No valid flags provided
  console.error('\n❌ Invalid usage.');
  console.error('   Usage: npx poem-os registry --list | --health | --cleanup\n');
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
    case 'registry':
      await handleRegistry(flags);
      break;
    default:
      console.error(`\n❌ Unknown command: ${cmd}`);
      console.error('   Run "npx poem-os --help" for usage information.\n');
      process.exit(1);
  }
}

// Run main
main();
