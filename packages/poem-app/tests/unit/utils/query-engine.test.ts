import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  parseQuery,
  listAllCapabilities,
  canDoQuery,
  findSimilarQuery,
  findBlockersQuery,
  executeQuery
} from '../../../../poem-core/utils/query-engine';
import type { CapabilityRecord } from '../../../../poem-core/utils/capability-reader';

const TEST_DIR = join(process.cwd(), 'test-temp-query-engine');

const SAMPLE_CAPABILITIES: CapabilityRecord[] = [
  {
    name: 'organize prompts into workflows',
    status: '✅',
    story: '3.8',
    validation: 'passed',
    description: 'Multi-workflow support',
    source: 'story'
  },
  {
    name: 'run prompt chain',
    status: '✅',
    story: '4.6',
    validation: 'passed',
    description: 'Chain execution',
    source: 'story'
  },
  {
    name: 'human-in-the-loop checkpoint',
    status: '🔄',
    story: '4.7',
    description: 'Pause workflow for human input',
    source: 'story'
  },
  {
    name: 'platform constraint validation',
    status: '📅',
    description: 'Validate YouTube constraints',
    source: 'epic'
  },
  {
    name: 'generate mock data',
    status: '✅',
    story: '4.3',
    validation: 'passed',
    description: 'Generate mock workflow data',
    source: 'story'
  }
];

describe('query-engine', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('parseQuery', () => {
    it('should parse "list all" queries', () => {
      expect(parseQuery('list all').type).toBe('list-all');
      expect(parseQuery('show all').type).toBe('list-all');
      expect(parseQuery('all').type).toBe('list-all');
      expect(parseQuery('capabilities').type).toBe('list-all');
    });

    it('should parse "can do X" queries', () => {
      const result = parseQuery('can POEM organize prompts?');
      expect(result.type).toBe('can-do');
      expect(result.searchTerm).toBe('organize prompts');
    });

    it('should parse "find blockers" queries', () => {
      const result = parseQuery("what's blocking story 4.7?");
      expect(result.type).toBe('find-blockers');
      expect(result.searchTerm).toBe('4.7');
    });

    it('should parse "find similar" queries', () => {
      const result = parseQuery('workflow execution');
      expect(result.type).toBe('find-similar');
      expect(result.searchTerm).toBe('workflow execution');
    });
  });

  describe('listAllCapabilities', () => {
    it('should return all capabilities sorted by status', () => {
      const result = listAllCapabilities(SAMPLE_CAPABILITIES);

      expect(result.queryType).toBe('list-all');
      expect(result.capabilities).toHaveLength(5);

      // Should sort: ✅ first, then ⚠️, 🔄, 📅
      expect(result.capabilities[0].status).toBe('✅');
      expect(result.capabilities[result.capabilities.length - 1].status).toBe('📅');
    });
  });

  describe('canDoQuery', () => {
    it('should find exact matches', () => {
      const result = canDoQuery('organize prompts', SAMPLE_CAPABILITIES);

      expect(result.queryType).toBe('can-do');
      expect(result.matchType).toBe('exact');
      expect(result.capabilities.length).toBeGreaterThan(0);
      expect(result.capabilities[0].name).toContain('organize prompts');
    });

    it('should find near-matches with partial keyword overlap', () => {
      const result = canDoQuery('workflow chains', SAMPLE_CAPABILITIES);

      expect(result.queryType).toBe('can-do');
      expect(result.capabilities.length).toBeGreaterThan(0);

      // Should find "organize prompts into workflows" and "run prompt chain"
      const hasWorkflow = result.capabilities.some(c => c.name.includes('workflow'));
      const hasChain = result.capabilities.some(c => c.name.includes('chain'));
      expect(hasWorkflow || hasChain).toBe(true);
    });

    it('should return no match when nothing found', () => {
      const result = canDoQuery('quantum computing', SAMPLE_CAPABILITIES);

      expect(result.matchType).toBe('none');
      expect(result.capabilities).toHaveLength(0);
    });
  });

  describe('findSimilarQuery', () => {
    it('should find similar capabilities with scores', () => {
      const result = findSimilarQuery('workflow', SAMPLE_CAPABILITIES);

      expect(result.queryType).toBe('find-similar');
      expect(result.similarCapabilities).toBeDefined();
      expect(result.similarCapabilities!.length).toBeGreaterThan(0);

      // Should have similarity scores
      const firstResult = result.similarCapabilities![0];
      expect(firstResult.similarity).toBeGreaterThan(0);
      expect(firstResult.similarity).toBeLessThanOrEqual(100);
    });

    it('should rank exact phrase matches higher', () => {
      const result = findSimilarQuery('prompt chain', SAMPLE_CAPABILITIES);

      expect(result.similarCapabilities).toBeDefined();
      expect(result.similarCapabilities!.length).toBeGreaterThan(0);

      // "run prompt chain" should be ranked higher than others
      const topResult = result.similarCapabilities![0];
      expect(topResult.capability.name).toContain('chain');
    });

    it('should filter out low similarity results', () => {
      const result = findSimilarQuery('xyz', SAMPLE_CAPABILITIES);

      // Should filter out capabilities with <20% similarity
      expect(result.capabilities).toHaveLength(0);
    });
  });

  describe('findBlockersQuery', () => {
    it('should find blocking stories from dependencies', async () => {
      const storiesDir = join(TEST_DIR, 'stories');
      await fs.mkdir(storiesDir, { recursive: true });

      // Create story with dependency
      const storyContent = `# Story 5.1

## Status

Ready

## Story

**As a** user,
**I want** something,
**so that** I can do something.

## Background

This story depends on Story 4.7 which must be completed first.

## Acceptance Criteria

1. Works
`;
      await fs.writeFile(join(storiesDir, '5.1.story.md'), storyContent);

      const result = await findBlockersQuery('5.1', SAMPLE_CAPABILITIES, storiesDir);

      expect(result.queryType).toBe('find-blockers');
      expect(result.blockers).toBeDefined();
      expect(result.blockers!.length).toBeGreaterThan(0);

      const blocker = result.blockers![0];
      expect(blocker.story).toBe('5.1');
      expect(blocker.blockedBy).toContain('4.7');
    });

    it('should detect explicitly blocked status', async () => {
      const storiesDir = join(TEST_DIR, 'stories');
      await fs.mkdir(storiesDir, { recursive: true });

      const storyContent = `# Story 5.2

## Status

Blocked

## Story

**As a** user,
**I want** something.

## Acceptance Criteria

1. Works
`;
      await fs.writeFile(join(storiesDir, '5.2.story.md'), storyContent);

      const result = await findBlockersQuery('5.2', SAMPLE_CAPABILITIES, storiesDir);

      expect(result.blockers).toBeDefined();
      expect(result.blockers!.length).toBeGreaterThan(0);
      expect(result.blockers![0].reason).toContain('Blocked');
    });

    it('should handle missing story file gracefully', async () => {
      const result = await findBlockersQuery('99.99', SAMPLE_CAPABILITIES, join(TEST_DIR, 'nonexistent'));

      expect(result.queryType).toBe('find-blockers');
      expect(result.blockers).toEqual([]);
    });
  });

  describe('executeQuery', () => {
    it('should execute list-all query', async () => {
      const result = await executeQuery('list all', SAMPLE_CAPABILITIES);

      expect(result.queryType).toBe('list-all');
      expect(result.capabilities.length).toBeGreaterThan(0);
    });

    it('should execute can-do query', async () => {
      const result = await executeQuery('can POEM organize prompts?', SAMPLE_CAPABILITIES);

      expect(result.queryType).toBe('can-do');
      expect(result.capabilities.length).toBeGreaterThan(0);
    });

    it('should execute find-similar query', async () => {
      const result = await executeQuery('workflow execution', SAMPLE_CAPABILITIES);

      expect(result.queryType).toBe('find-similar');
      expect(result.similarCapabilities).toBeDefined();
    });

    it('should execute find-blockers query with storiesDir', async () => {
      const storiesDir = join(TEST_DIR, 'stories');
      await fs.mkdir(storiesDir, { recursive: true });

      const result = await executeQuery(
        "what's blocking story 4.7?",
        SAMPLE_CAPABILITIES,
        storiesDir
      );

      expect(result.queryType).toBe('find-blockers');
      expect(result.blockers).toBeDefined();
    });

    it('should throw error if blockers query missing storiesDir', async () => {
      await expect(
        executeQuery("what's blocking story 4.7?", SAMPLE_CAPABILITIES)
      ).rejects.toThrow('storiesDir required');
    });
  });
});
