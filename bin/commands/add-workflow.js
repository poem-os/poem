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

    // Ensure workflows object exists (Bug Fix: Cannot set properties of undefined after migration)
    if (!config.workflows) {
      config.workflows = {};
    }

    // Check if workflow name already exists in config (Bug Fix: No duplicate detection in config)
    if (config.workflows[workflowName]) {
      console.log(`ℹ  Workflow '${workflowName}' already exists in config. Skipped.`);

      // Show existing workflows
      const existingWorkflows = Object.keys(config.workflows);
      console.log('\nExisting workflows:');
      existingWorkflows.forEach((wf, idx) => {
        const marker = wf === config.currentWorkflow ? '(current)' : '';
        console.log(`  ${idx + 1}. ${wf} ${marker}`);
      });

      return { created: false, reason: 'already_exists_in_config' };
    }
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

  // Show all workflows
  const allWorkflows = Object.keys(config.workflows);
  if (allWorkflows.length > 1) {
    console.log('\nAll workflows:');
    allWorkflows.forEach((wf, idx) => {
      const marker = wf === config.currentWorkflow ? '(current)' : '';
      console.log(`  ${idx + 1}. ${wf} ${marker}`);
    });
  }

  return { created: true };
}

/**
 * Lists all existing workflows in poem.yaml
 * @param {string} targetDir - Project root directory
 * @returns {Promise<void>}
 */
export async function listWorkflows(targetDir) {
  const configFile = path.join(targetDir, 'poem', 'config', 'poem.yaml');

  if (!existsSync(configFile)) {
    console.log('❌ No poem.yaml found. Run "poem-os init" first.');
    return;
  }

  const configContent = await fs.readFile(configFile, 'utf-8');
  const config = yaml.load(configContent);

  if (!config.workflows || Object.keys(config.workflows).length === 0) {
    console.log('ℹ  No workflows created yet.');
    console.log('   Create one with: poem-os add-workflow <name>');
    return;
  }

  const workflows = Object.keys(config.workflows);
  console.log('\n📁 Existing workflows:');
  workflows.forEach((wf, idx) => {
    const marker = wf === config.currentWorkflow ? '✓ (current)' : '';
    console.log(`  ${idx + 1}. ${wf} ${marker}`);
  });
  console.log('');
}
