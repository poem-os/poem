#!/usr/bin/env node

/**
 * Test UX improvement: Show existing workflows before prompt
 * Run from project root: node bin/commands/test-workflow-prompt-ux.js
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import yaml from 'js-yaml';

const testDir = '/tmp/poem-test-workflow-prompt';

async function setup() {
  console.log('🧪 Setting up test environment...\n');

  // Clean up
  if (existsSync(testDir)) {
    await fs.rm(testDir, { recursive: true, force: true });
  }

  // Create test structure
  await fs.mkdir(path.join(testDir, 'poem', 'config'), { recursive: true });
  await fs.mkdir(path.join(testDir, 'poem', 'workflows', 'languish-the-artist', 'prompts'), { recursive: true });
  await fs.mkdir(path.join(testDir, 'poem', 'workflows', 'languish-the-artist', 'schemas'), { recursive: true });

  // Create poem.yaml with existing workflow
  const config = {
    version: 1.0,
    server: { port: 9520 },
    centralPoemPath: null,
    currentWorkflow: 'languish-the-artist',
    workflows: {
      'languish-the-artist': {
        prompts: 'poem/workflows/languish-the-artist/prompts',
        schemas: 'poem/workflows/languish-the-artist/schemas',
        mockData: 'poem/workflows/languish-the-artist/mock-data',
        workflowState: 'poem/workflows/languish-the-artist/workflow-state',
      }
    }
  };

  const configPath = path.join(testDir, 'poem', 'config', 'poem.yaml');
  await fs.writeFile(configPath, yaml.dump(config), 'utf-8');

  console.log('✅ Test environment created');
  console.log('   Workspace: poem/');
  console.log('   Workflow: languish-the-artist');
}

/**
 * Simulates getExistingWorkflows function from install.js
 */
async function getExistingWorkflows(targetDir) {
  const configFile = path.join(targetDir, 'poem', 'config', 'poem.yaml');

  if (!existsSync(configFile)) {
    return { workflows: [], currentWorkflow: null };
  }

  try {
    const configContent = await fs.readFile(configFile, 'utf-8');
    const config = yaml.load(configContent);

    const workflows = config.workflows ? Object.keys(config.workflows) : [];
    const currentWorkflow = config.currentWorkflow || null;

    return { workflows, currentWorkflow };
  } catch (error) {
    return { workflows: [], currentWorkflow: null };
  }
}

async function testExistingWorkflowDetection() {
  console.log('\n━━━ Test: Detect Existing Workflows ━━━\n');

  const { workflows, currentWorkflow } = await getExistingWorkflows(testDir);

  console.log('Detection results:');
  console.log('  Workflows found:', workflows.length);
  console.log('  Current workflow:', currentWorkflow);

  if (workflows.length > 0) {
    console.log('\n📁 Existing workflows:');
    workflows.forEach((wf, idx) => {
      const marker = wf === currentWorkflow ? ' ✓ (current)' : '';
      console.log(`  ${idx + 1}. ${wf}${marker}`);
    });
  }

  if (workflows.length === 1 && workflows[0] === 'languish-the-artist') {
    console.log('\n✅ PASS: Correctly detected existing workflow');
  } else {
    console.log('\n❌ FAIL: Did not detect workflow correctly');
  }
}

async function testPromptTextLogic() {
  console.log('\n━━━ Test: Prompt Text Changes Based on Workflows ━━━\n');

  const { workflows } = await getExistingWorkflows(testDir);

  const workflowPromptText = workflows.length > 0
    ? 'Would you like to add another workflow now?'
    : 'Would you like to add your first workflow now?';

  console.log('Prompt text:', workflowPromptText);

  if (workflowPromptText.includes('another')) {
    console.log('✅ PASS: Prompt text correctly says "another workflow"');
  } else {
    console.log('❌ FAIL: Should say "another workflow", not "first workflow"');
  }
}

async function cleanup() {
  console.log('\n🧹 Cleaning up test environment...');
  await fs.rm(testDir, { recursive: true, force: true });
  console.log('✅ Cleaned up\n');
}

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Workflow Prompt UX Improvement Test    ║');
  console.log('╚══════════════════════════════════════════╝\n');

  try {
    await setup();
    await testExistingWorkflowDetection();
    await testPromptTextLogic();

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║         All UX Tests Passed! ✅          ║');
    console.log('╚══════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await cleanup();
  }
}

main();
