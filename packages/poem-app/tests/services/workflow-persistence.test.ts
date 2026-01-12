import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  loadWorkflowState,
  saveWorkflowState,
  clearWorkflowState,
} from '../../src/services/config/workflow-persistence.js';
import { getProjectRoot } from '../../src/services/config/poem-config.js';

describe('Workflow Persistence', () => {
  const getStatePath = () => {
    const projectRoot = getProjectRoot();
    return path.join(projectRoot, 'dev-workspace', '.poem-state.json');
  };

  beforeEach(async () => {
    // Clean up any existing state file
    await clearWorkflowState();
  });

  afterEach(async () => {
    // Clean up state file after each test
    await clearWorkflowState();
  });

  describe('saveWorkflowState()', () => {
    it('should save workflow state to disk', async () => {
      await saveWorkflowState('youtube-launch-optimizer');

      const statePath = getStatePath();
      const content = await fs.readFile(statePath, 'utf-8');
      const state = JSON.parse(content);

      expect(state.currentWorkflow).toBe('youtube-launch-optimizer');
      expect(state.updatedAt).toBeDefined();
      expect(typeof state.updatedAt).toBe('string');
    });

    it('should overwrite existing state', async () => {
      await saveWorkflowState('youtube-launch-optimizer');
      await saveWorkflowState('nano-banana');

      const state = await loadWorkflowState();
      expect(state?.currentWorkflow).toBe('nano-banana');
    });

    it('should create directory if it does not exist', async () => {
      // Remove directory
      const statePath = getStatePath();
      const stateDir = path.dirname(statePath);
      try {
        await fs.rm(stateDir, { recursive: true, force: true });
      } catch {
        // Ignore if directory doesn't exist
      }

      // Should create directory
      await saveWorkflowState('test-workflow');

      const state = await loadWorkflowState();
      expect(state?.currentWorkflow).toBe('test-workflow');
    });

    it('should save valid JSON format', async () => {
      await saveWorkflowState('test-workflow');

      const statePath = getStatePath();
      const content = await fs.readFile(statePath, 'utf-8');

      // Should be valid JSON
      expect(() => JSON.parse(content)).not.toThrow();

      // Should be pretty-printed (includes newlines)
      expect(content).toContain('\n');
    });
  });

  describe('loadWorkflowState()', () => {
    it('should load saved workflow state', async () => {
      await saveWorkflowState('nano-banana');

      const state = await loadWorkflowState();
      expect(state).not.toBeNull();
      expect(state?.currentWorkflow).toBe('nano-banana');
      expect(state?.updatedAt).toBeDefined();
    });

    it('should return null if state file does not exist', async () => {
      await clearWorkflowState();

      const state = await loadWorkflowState();
      expect(state).toBeNull();
    });

    it('should return null on parse error', async () => {
      const statePath = getStatePath();

      // Write invalid JSON
      const stateDir = path.dirname(statePath);
      await fs.mkdir(stateDir, { recursive: true });
      await fs.writeFile(statePath, 'invalid json', 'utf-8');

      const state = await loadWorkflowState();
      expect(state).toBeNull();
    });

    it('should handle missing updatedAt field gracefully', async () => {
      const statePath = getStatePath();

      // Write state without updatedAt
      const stateDir = path.dirname(statePath);
      await fs.mkdir(stateDir, { recursive: true });
      await fs.writeFile(
        statePath,
        JSON.stringify({ currentWorkflow: 'test-workflow' }),
        'utf-8'
      );

      const state = await loadWorkflowState();
      expect(state?.currentWorkflow).toBe('test-workflow');
    });
  });

  describe('clearWorkflowState()', () => {
    it('should delete state file', async () => {
      await saveWorkflowState('test-workflow');

      const statePath = getStatePath();
      const existsBefore = await fs.access(statePath).then(() => true, () => false);
      expect(existsBefore).toBe(true);

      await clearWorkflowState();

      const existsAfter = await fs.access(statePath).then(() => true, () => false);
      expect(existsAfter).toBe(false);
    });

    it('should not error if state file does not exist', async () => {
      await clearWorkflowState(); // Should not throw
      await expect(clearWorkflowState()).resolves.not.toThrow();
    });
  });

  describe('Workflow state persistence integration', () => {
    it('should persist workflow across load/save cycles', async () => {
      await saveWorkflowState('youtube-launch-optimizer');
      let state = await loadWorkflowState();
      expect(state?.currentWorkflow).toBe('youtube-launch-optimizer');

      await saveWorkflowState('nano-banana');
      state = await loadWorkflowState();
      expect(state?.currentWorkflow).toBe('nano-banana');
    });

    it('should include timestamp in state', async () => {
      const before = new Date();
      await saveWorkflowState('test-workflow');
      const after = new Date();

      const state = await loadWorkflowState();
      expect(state?.updatedAt).toBeDefined();

      const timestamp = new Date(state!.updatedAt);
      expect(timestamp >= before && timestamp <= after).toBe(true);
    });
  });
});
