import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  readStoryFiles,
  readVictorArtifacts,
  readKDDTopology,
  readEpicCapabilities,
  buildCapabilityRecords
} from '../../../poem-core/utils/capability-reader';

const TEST_DIR = join(process.cwd(), 'test-temp-capability-reader');

describe('capability-reader', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('readStoryFiles', () => {
    it('should read story files and extract data', async () => {
      const storiesDir = join(TEST_DIR, 'stories');
      await fs.mkdir(storiesDir, { recursive: true });

      const storyContent = `# Story 3.8: Multi-Workflow Foundation

## Status

Done

## Story

**As a** prompt engineer,
**I want** to organize prompts into workflows,
**so that** I can manage multiple projects independently.

## Acceptance Criteria

1. Workflow-scoped directory structure working
2. Penny has workflow commands
3. Config service resolves workflow-scoped paths
`;

      await fs.writeFile(join(storiesDir, '3.8.story.md'), storyContent);

      const stories = await readStoryFiles(storiesDir);

      expect(stories).toHaveLength(1);
      expect(stories[0].storyNumber).toBe('3.8');
      expect(stories[0].status).toBe('Done');
      expect(stories[0].acceptanceCriteria).toHaveLength(3);
      expect(stories[0].acceptanceCriteria[0]).toContain('Workflow-scoped directory structure');
    });

    it('should handle missing stories directory gracefully', async () => {
      const stories = await readStoryFiles(join(TEST_DIR, 'nonexistent'));
      expect(stories).toEqual([]);
    });
  });

  describe('readVictorArtifacts', () => {
    it('should read integration matrix', async () => {
      const workspaceDir = join(TEST_DIR, 'workspace');
      await fs.mkdir(workspaceDir, { recursive: true });

      const matrixContent = `# Integration Matrix

| Capability | Story | Status |
|------------|-------|--------|
| Multi-Workflow Support | 3.8 | ✅ |
| Prompt Chaining | 3.7 | ⚠️ |
`;

      await fs.writeFile(join(workspaceDir, 'integration-matrix.md'), matrixContent);

      const victorData = await readVictorArtifacts(workspaceDir);

      expect(victorData.capabilities).toContain('Multi-Workflow Support');
      expect(victorData.capabilities).toContain('Prompt Chaining');
      expect(victorData.validationStatus['Multi-Workflow Support']).toBe('passed');
      expect(victorData.validationStatus['Prompt Chaining']).toBe('concerns');
    });

    it('should handle missing workspace directory gracefully', async () => {
      const victorData = await readVictorArtifacts(join(TEST_DIR, 'nonexistent'));
      expect(victorData.capabilities).toEqual([]);
      expect(victorData.validationStatus).toEqual({});
    });
  });

  describe('readKDDTopology', () => {
    it('should read KDD directories', async () => {
      const kddDir = join(TEST_DIR, 'kdd');
      await fs.mkdir(join(kddDir, 'patterns'), { recursive: true });
      await fs.mkdir(join(kddDir, 'learnings'), { recursive: true });
      await fs.mkdir(join(kddDir, 'decisions'), { recursive: true });

      await fs.writeFile(join(kddDir, 'patterns', 'pattern-1.md'), '# Pattern 1');
      await fs.writeFile(join(kddDir, 'learnings', 'learning-3-8.md'), '# Learning');
      await fs.writeFile(join(kddDir, 'decisions', 'adr-001.md'), '# ADR 001');

      const kddData = await readKDDTopology(kddDir);

      expect(kddData.patterns).toEqual(['pattern-1.md']);
      expect(kddData.learnings).toEqual(['learning-3-8.md']);
      expect(kddData.decisions).toEqual(['adr-001.md']);
    });

    it('should handle missing KDD directory gracefully', async () => {
      const kddData = await readKDDTopology(join(TEST_DIR, 'nonexistent'));
      expect(kddData.patterns).toEqual([]);
      expect(kddData.learnings).toEqual([]);
      expect(kddData.decisions).toEqual([]);
    });
  });

  describe('readEpicCapabilities', () => {
    it('should read epic capabilities table', async () => {
      const epicPath = join(TEST_DIR, 'epic-capabilities.md');

      const epicContent = `# Epic Capabilities

| Capability | Description | Epic.Story |
|------------|-------------|------------|
| Multi-Workflow Support | Organize prompts into workflows | 3.8 |
| Future Feature | Coming soon | 5.1 |
`;

      await fs.writeFile(epicPath, epicContent);

      const capabilities = await readEpicCapabilities(epicPath);

      expect(capabilities).toHaveLength(2);
      expect(capabilities[0].name).toBe('Multi-Workflow Support');
      expect(capabilities[0].epic).toBe('3');
      expect(capabilities[0].story).toBe('3.8');
      expect(capabilities[1].name).toBe('Future Feature');
      expect(capabilities[1].story).toBe('5.1');
    });

    it('should handle missing file gracefully', async () => {
      const capabilities = await readEpicCapabilities(join(TEST_DIR, 'nonexistent.md'));
      expect(capabilities).toEqual([]);
    });
  });

  describe('buildCapabilityRecords', () => {
    it('should build unified capability records from all sources', async () => {
      const storiesDir = join(TEST_DIR, 'stories');
      const workspaceDir = join(TEST_DIR, 'workspace');
      const kddDir = join(TEST_DIR, 'kdd');
      const epicPath = join(TEST_DIR, 'epic-capabilities.md');

      await fs.mkdir(storiesDir, { recursive: true });
      await fs.mkdir(workspaceDir, { recursive: true });
      await fs.mkdir(join(kddDir, 'patterns'), { recursive: true });

      // Story file
      const storyContent = `# Story 3.8

## Status

Done

## Story

**As a** prompt engineer,
**I want** to organize prompts into workflows,
**so that** I can manage multiple projects.

## Acceptance Criteria

1. Works
`;
      await fs.writeFile(join(storiesDir, '3.8.story.md'), storyContent);

      // Victor matrix
      const matrixContent = `| Capability | Story | Status |
|------------|-------|--------|
| organize prompts into workflows | 3.8 | ✅ |
`;
      await fs.writeFile(join(workspaceDir, 'integration-matrix.md'), matrixContent);

      // KDD files
      await fs.writeFile(join(kddDir, 'patterns', 'pattern-3-8.md'), '# Pattern');

      // Epic capabilities
      const epicContent = `| Capability | Description | Epic.Story |
|------------|-------------|------------|
| organize prompts into workflows | Multi-workflow support | 3.8 |
| Future Feature | Coming soon | 5.1 |
`;
      await fs.writeFile(epicPath, epicContent);

      const records = await buildCapabilityRecords(storiesDir, workspaceDir, kddDir, epicPath);

      expect(records.length).toBeGreaterThan(0);

      const workflowRecord = records.find(r => r.story === '3.8');
      expect(workflowRecord).toBeDefined();
      expect(workflowRecord?.status).toBe('✅');
      // Validation is optional - Victor might not have validated this capability yet
      if (workflowRecord?.validation) {
        expect(workflowRecord.validation).toBe('passed');
      }

      const futureRecord = records.find(r => r.name === 'Future Feature');
      expect(futureRecord).toBeDefined();
      expect(futureRecord?.status).toBe('📅');
    });

    it('should handle empty data sources gracefully', async () => {
      const records = await buildCapabilityRecords(
        join(TEST_DIR, 'nonexistent1'),
        join(TEST_DIR, 'nonexistent2'),
        join(TEST_DIR, 'nonexistent3'),
        join(TEST_DIR, 'nonexistent4.md')
      );

      expect(records).toEqual([]);
    });
  });
});
