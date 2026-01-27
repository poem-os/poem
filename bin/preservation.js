#!/usr/bin/env node

/**
 * Preservation System for POEM Installer
 * Protects user files during reinstallation by defining preservation rules
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// =============================================================================
// Constants
// =============================================================================

/**
 * Framework workflow files that can be updated during reinstallation
 * All other .yaml files in .poem-core/workflows/ are considered user workflows
 */
export const FRAMEWORK_WORKFLOWS = [
  'create-prompt.yaml',
  'refine-prompt.yaml',
  'test-prompt.yaml',
  'validate-prompt.yaml',
  'deploy-prompt.yaml',
  'add-helper.yaml',
  'create-provider.yaml',
];

/**
 * Default preservation rules template
 */
export const DEFAULT_PRESERVATION_RULES = `# .poem-preserve
# Files/folders protected from overwriting during POEM installation
# Format: One file/folder path per line (relative to project root)
# Comments start with # and blank lines are ignored

# User workspace - always preserved (Story 1.10: selective workspace)
poem/config/
poem/shared/
poem/workflows/

# Dev workspace - always preserved (if exists)
dev-workspace/

# User configuration - always preserved
.poem-app/.env

# Add custom preservation rules below:
# .poem-core/my-custom-workflow.yaml
# .poem-core/templates/my-template.hbs
`;

// =============================================================================
// Preservation File Parsing
// =============================================================================

/**
 * Parses a .poem-preserve file and returns preservation rules
 * @param {string} targetDir - Project root directory
 * @returns {Promise<string[]>} - Array of preservation patterns
 */
export async function parsePreservationFile(targetDir) {
  const preserveFile = path.join(targetDir, '.poem-preserve');

  try {
    const content = await fs.readFile(preserveFile, 'utf-8');

    const rules = [];
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('#')) {
        continue;
      }

      rules.push(trimmed);
    }

    return rules;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    // For other errors (permission issues, etc.), log warning and return empty
    console.warn(`⚠️  Could not read .poem-preserve: ${error.message}`);
    return [];
  }
}

/**
 * Checks if a file path is preserved by preservation rules
 * @param {string} filePath - Relative file path to check
 * @param {string[]} preservationRules - Array of preservation patterns
 * @returns {boolean} - True if file is preserved, false otherwise
 */
export function isPreserved(filePath, preservationRules) {
  // Normalize path separators for cross-platform compatibility
  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const rule of preservationRules) {
    const normalizedRule = rule.replace(/\\/g, '/');

    // Check if rule is a directory (ends with /)
    if (normalizedRule.endsWith('/')) {
      // Match files/subdirectories inside the directory
      // Don't match the directory itself (with or without trailing slash)
      if (normalizedPath.startsWith(normalizedRule) && normalizedPath.length > normalizedRule.length) {
        return true;
      }
    } else {
      // Exact file match
      if (normalizedPath === normalizedRule) {
        return true;
      }
    }
  }

  return false;
}

// =============================================================================
// User Workflow Detection
// =============================================================================

/**
 * Checks if a file is a user-created workflow (not a framework workflow)
 * @param {string} filePath - Relative file path to check
 * @returns {boolean} - True if user workflow (preserve), false if framework workflow
 */
export function isUserWorkflow(filePath) {
  // Normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Check if file is in .poem-core/workflows/ directory
  if (!normalizedPath.startsWith('.poem-core/workflows/') &&
      !normalizedPath.startsWith('packages/poem-core/workflows/')) {
    return false; // Not a workflow file
  }

  // Extract filename from path
  const filename = path.basename(normalizedPath);

  // Check if filename is in framework workflows list
  if (FRAMEWORK_WORKFLOWS.includes(filename)) {
    return false; // Framework workflow (can be overwritten)
  }

  // It's a .yaml file in workflows/ but not in framework list
  return filename.endsWith('.yaml') || filename.endsWith('.yml');
}

// =============================================================================
// Preservation File Creation
// =============================================================================

/**
 * Creates a .poem-preserve file with default rules
 * Auto-migrates existing files to add missing default rules
 * @param {string} targetDir - Project root directory
 * @returns {Promise<{created: boolean, migrated?: boolean, reason?: string}>} - Result object
 */
export async function createPreservationFile(targetDir) {
  const preserveFile = path.join(targetDir, '.poem-preserve');

  try {
    // Check if file already exists
    let existingContent = null;
    try {
      existingContent = await fs.readFile(preserveFile, 'utf-8');
    } catch {
      // File doesn't exist, create it with defaults
      await fs.writeFile(preserveFile, DEFAULT_PRESERVATION_RULES, 'utf-8');
      return { created: true };
    }

    // File exists - check if it needs migration (missing default rules)
    // Story 1.10: Updated rules to reflect selective workspace structure
    const requiredRules = ['poem/config/', 'poem/shared/', 'poem/workflows/', 'dev-workspace/', '.poem-app/.env'];
    const missingRules = [];

    for (const rule of requiredRules) {
      // Check if rule exists (as a standalone line, not in a comment)
      const lines = existingContent.split('\n');
      const hasRule = lines.some(line => {
        const trimmed = line.trim();
        return trimmed === rule && !trimmed.startsWith('#');
      });

      if (!hasRule) {
        missingRules.push(rule);
      }
    }

    // If no missing rules, file is up-to-date
    if (missingRules.length === 0) {
      return { created: false, reason: 'already_exists' };
    }

    // Migrate: Add missing rules before "Add custom preservation rules" section
    const lines = existingContent.split('\n');
    const customSectionIndex = lines.findIndex(line =>
      line.includes('Add custom preservation rules')
    );

    if (customSectionIndex === -1) {
      // No custom section marker, append to end
      let updatedContent = existingContent.trimEnd() + '\n\n';

      // Add missing rules with labels
      const ruleLabels = {
        'poem/config/': '# User workspace - always preserved (Story 1.10)',
        'poem/shared/': '# Shared resources - always preserved',
        'poem/workflows/': '# Workflow folders - always preserved',
        'dev-workspace/': '# Dev workspace - always preserved (if exists)',
        '.poem-app/.env': '# User configuration - always preserved',
      };

      for (const rule of missingRules) {
        if (ruleLabels[rule]) {
          updatedContent += ruleLabels[rule] + '\n';
        }
        updatedContent += rule + '\n\n';
      }

      await fs.writeFile(preserveFile, updatedContent, 'utf-8');
      return { created: false, migrated: true, missingRules };
    } else {
      // Insert before custom section (keeping user's custom rules intact)
      const beforeCustom = lines.slice(0, customSectionIndex);
      const afterCustom = lines.slice(customSectionIndex);

      const ruleLabels = {
        'poem/config/': '# User workspace - always preserved (Story 1.10)',
        'poem/shared/': '# Shared resources - always preserved',
        'poem/workflows/': '# Workflow folders - always preserved',
        'dev-workspace/': '# Dev workspace - always preserved (if exists)',
        '.poem-app/.env': '# User configuration - always preserved',
      };

      const insertLines = [];
      for (const rule of missingRules) {
        if (ruleLabels[rule]) {
          insertLines.push(ruleLabels[rule]);
        }
        insertLines.push(rule);
        insertLines.push(''); // Blank line
      }

      const updatedLines = [...beforeCustom, ...insertLines, ...afterCustom];
      const updatedContent = updatedLines.join('\n');

      await fs.writeFile(preserveFile, updatedContent, 'utf-8');
      return { created: false, migrated: true, missingRules };
    }
  } catch (error) {
    console.warn(`⚠️  Could not create/migrate .poem-preserve: ${error.message}`);
    return { created: false, reason: error.message };
  }
}
