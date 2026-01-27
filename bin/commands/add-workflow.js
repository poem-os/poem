#!/usr/bin/env node

/**
 * POEM Add Workflow Command
 * Creates workflow-specific folders and updates poem.yaml config
 *
 * Usage:
 *   poem-os add-workflow <name>
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import * as yaml from 'js-yaml';

/**
 * Validates workflow name
 * @param {string} name - Workflow name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidWorkflowName(name) {
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(name);
}

/**
 * Creates workflow-specific folders and updates config
 * @param {string} targetDir - Project root directory
 * @param {string} workflowName - Name of the workflow to create
 * @returns {Promise<{created: boolean, reason?: string}>}
 */
export async function runAddWorkflow(targetDir, workflowName) {
  const workflowDir = path.join(targetDir, 'poem', 'workflows', workflowName);
  const configFile = path.join(targetDir, 'poem', 'config', 'poem.yaml');

  // Validate workflow name
  if (!isValidWorkflowName(workflowName)) {
    console.log('❌ Invalid workflow name. Use alphanumeric, dash, or underscore only.');
    return { created: false, reason: 'invalid_name' };
  }

  // Check if workflow already exists
  if (existsSync(workflowDir)) {
    console.log(`ℹ  Workflow '${workflowName}' already exists. Skipped.`);
    return { created: false, reason: 'already_exists' };
  }

  // Create workflow directories (Story 1.10: workflow-state instead of workflow-data)
  const promptsDir = path.join(workflowDir, 'prompts');
  const schemasDir = path.join(workflowDir, 'schemas');
  const mockDataDir = path.join(workflowDir, 'mock-data');
  const workflowStateDir = path.join(workflowDir, 'workflow-state');

  await fs.mkdir(promptsDir, { recursive: true });
  await fs.mkdir(schemasDir, { recursive: true });
  await fs.mkdir(mockDataDir, { recursive: true });
  await fs.mkdir(workflowStateDir, { recursive: true });

  // Load or create poem.yaml
  let config = {
    version: 1.0,
    currentWorkflow: null,
    workflows: {},
  };

  if (existsSync(configFile)) {
    const configContent = await fs.readFile(configFile, 'utf-8');
    config = yaml.load(configContent);
  }

  // Add workflow definition
  config.workflows[workflowName] = {
    prompts: `poem/workflows/${workflowName}/prompts`,
    schemas: `poem/workflows/${workflowName}/schemas`,
    mockData: `poem/workflows/${workflowName}/mock-data`,
    workflowState: `poem/workflows/${workflowName}/workflow-state`,
  };

  // If first workflow, set as current
  if (!config.currentWorkflow || Object.keys(config.workflows).length === 1) {
    config.currentWorkflow = workflowName;
  }

  // Save updated config
  const configYaml = yaml.dump(config, {
    indent: 2,
    lineWidth: -1,
  });

  await fs.writeFile(configFile, `# POEM Configuration\n${configYaml}`, 'utf-8');

  console.log(`✅ Workflow '${workflowName}' added. Switch to it: /poem/agents/penny → *switch ${workflowName}`);
  console.log(`   Created: poem/workflows/${workflowName}/prompts/`);
  console.log(`   Created: poem/workflows/${workflowName}/schemas/`);
  console.log(`   Created: poem/workflows/${workflowName}/mock-data/`);
  console.log(`   Created: poem/workflows/${workflowName}/workflow-state/`);

  return { created: true };
}
