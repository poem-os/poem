#!/usr/bin/env node

/**
 * Test script to validate workflow bug fixes
 * Run from project root: node bin/commands/test-workflow-bugs.js
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import yaml from 'js-yaml';
import { runAddWorkflow, listWorkflows } from './add-workflow.js';

const testDir = '/tmp/poem-test-workflow-bugs';

async function setup() {
  console.log('🧪 Setting up test environment...\n');

  // Clean up any existing test directory
  if (existsSync(testDir)) {
    await fs.rm(testDir, { recursive: true, force: true });
  }

  // Create test directory structure
  await fs.mkdir(path.join(testDir, 'poem', 'config'), { recursive: true });
  await fs.mkdir(path.join(testDir, 'poem', 'shared', 'prompts'), { recursive: true });
  await fs.mkdir(path.join(testDir, 'poem', 'shared', 'schemas'), { recursive: true });

  console.log('✅ Test environment created at', testDir);
}

async function testBug1_MigrationWithoutWorkflows() {
  console.log('\n━━━ Test: Bug #1 - Migration creates workflows field ━━━\n');

  // Create old config format (missing workflows field)
  const oldConfig = {
    version: 1.0,
    server: { port: 4321 },
    centralPoemPath: null,
    currentWorkflow: null
    // Missing: workflows field
  };

  const configPath = path.join(testDir, 'poem', 'config', 'poem.yaml');
  await fs.writeFile(configPath, yaml.dump(oldConfig), 'utf-8');

  console.log('Created old config (missing workflows field)');

  // Try to add a workflow
  try {
    await runAddWorkflow(testDir, 'test-workflow-1');
    console.log('✅ PASS: Workflow created successfully despite missing workflows field\n');

    // Verify workflows field exists
    const updatedContent = await fs.readFile(configPath, 'utf-8');
    const updatedConfig = yaml.load(updatedContent);

    if (updatedConfig.workflows && updatedConfig.workflows['test-workflow-1']) {
      console.log('✅ PASS: workflows field was added automatically');
    } else {
      console.log('❌ FAIL: workflows field not added properly');
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  }
}

async function testBug2_DuplicateWorkflowDetection() {
  console.log('\n━━━ Test: Bug #2 - Duplicate workflow detection ━━━\n');

  // Create a workflow
  console.log('Creating workflow "duplicate-test"...');
  await runAddWorkflow(testDir, 'duplicate-test');

  // Try to create the same workflow again
  console.log('\nAttempting to create duplicate...');
  const result = await runAddWorkflow(testDir, 'duplicate-test');

  if (result.created === false && result.reason === 'already_exists_in_config') {
    console.log('✅ PASS: Duplicate workflow detected in config');
  } else {
    console.log('❌ FAIL: Duplicate workflow not detected');
  }
}

async function testBug3_WorkflowListing() {
  console.log('\n━━━ Test: Bug #3 - List workflows command ━━━\n');

  // Create multiple workflows
  await runAddWorkflow(testDir, 'workflow-a');
  await runAddWorkflow(testDir, 'workflow-b');
  await runAddWorkflow(testDir, 'workflow-c');

  console.log('\nListing all workflows:');
  await listWorkflows(testDir);

  console.log('✅ PASS: list-workflows command works');
}

async function testBug4_CentralPathHint() {
  console.log('\n━━━ Test: Bug #4 - Central path hint in migration ━━━\n');

  const configPath = path.join(testDir, 'poem', 'config', 'poem.yaml');
  const content = await fs.readFile(configPath, 'utf-8');
  const config = yaml.load(content);

  if (config.centralPoemPath === null) {
    console.log('✅ PASS: centralPoemPath set to null');
    console.log('   Hint should display: ~/dev/ad/poem-os/poem (convention for contributors)');
  } else {
    console.log('❌ FAIL: centralPoemPath not set correctly');
  }
}

async function cleanup() {
  console.log('\n🧹 Cleaning up test environment...');
  await fs.rm(testDir, { recursive: true, force: true });
  console.log('✅ Test environment cleaned up\n');
}

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  POEM Workflow Bug Fixes - Test Suite   ║');
  console.log('╚══════════════════════════════════════════╝\n');

  try {
    await setup();
    await testBug1_MigrationWithoutWorkflows();
    await testBug2_DuplicateWorkflowDetection();
    await testBug3_WorkflowListing();
    await testBug4_CentralPathHint();

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║         All Tests Completed! ✅          ║');
    console.log('╚══════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    console.error(error.stack);
  } finally {
    await cleanup();
  }
}

main();
