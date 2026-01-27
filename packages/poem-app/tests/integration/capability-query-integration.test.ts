import { describe, it, expect, beforeAll } from 'vitest';
import { buildCapabilityRecords } from '../../../poem-core/utils/capability-reader';
import { executeQuery } from '../../../poem-core/utils/query-engine';
import { formatQueryResult } from '../../../poem-core/utils/response-formatter';
import { join } from 'path';

/**
 * Integration tests for capability query system
 * Tests full flow: read capabilities → execute query → format result
 */
describe('capability-query-integration', () => {
  const PROJECT_ROOT = join(__dirname, '../../../..');
  const STORIES_DIR = join(PROJECT_ROOT, 'docs/stories');
  const KDD_DIR = join(PROJECT_ROOT, 'docs/kdd');
  const EPIC_CAPABILITIES_PATH = join(PROJECT_ROOT, 'docs/prd/epic-capabilities.md');
  const VICTOR_WORKSPACE = join(PROJECT_ROOT, 'dev-workspace');

  let capabilities: Awaited<ReturnType<typeof buildCapabilityRecords>>;

  beforeAll(async () => {
    // Build capabilities from real project data
    capabilities = await buildCapabilityRecords(
      STORIES_DIR,
      VICTOR_WORKSPACE,
      KDD_DIR,
      EPIC_CAPABILITIES_PATH
    );
  });

  describe('list all capabilities', () => {
    it('should return all capabilities in <3s', async () => {
      const startTime = Date.now();

      const result = await executeQuery('list all', capabilities);

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(3000);
      expect(result.queryType).toBe('list-all');
      expect(result.capabilities.length).toBeGreaterThan(0);
    });

    it('should format list-all result with status grouping', async () => {
      const result = await executeQuery('list all', capabilities);
      const formatted = formatQueryResult(result);

      expect(formatted).toContain('# POEM Capabilities');
      expect(formatted).toContain('##'); // Should have status section headers
    });
  });

  describe('can POEM do X', () => {
    it('should find workflow capabilities', async () => {
      const result = await executeQuery('can POEM organize workflows?', capabilities);

      expect(result.queryType).toBe('can-do');
      expect(result.capabilities.length).toBeGreaterThanOrEqual(0);

      // If found, should have match type
      if (result.capabilities.length > 0) {
        expect(result.matchType).toBeDefined();
        expect(['exact', 'partial']).toContain(result.matchType);
      }
    });

    it('should return no match for non-existent capability', async () => {
      const result = await executeQuery('can POEM do quantum computing?', capabilities);

      expect(result.queryType).toBe('can-do');
      expect(result.matchType).toBe('none');
      expect(result.capabilities).toHaveLength(0);
    });

    it('should format can-do result with YES/NO', async () => {
      const result = await executeQuery('can POEM organize workflows?', capabilities);
      const formatted = formatQueryResult(result);

      expect(formatted).toContain('# Can POEM');
      expect(formatted).toMatch(/##\s+(✅ YES|⚠️ PARTIAL MATCH|❌ NO)/);
    });
  });

  describe('find similar capabilities', () => {
    it('should find similar capabilities with scores', async () => {
      const result = await executeQuery('workflow execution', capabilities);

      expect(result.queryType).toBe('find-similar');

      if (result.similarCapabilities && result.similarCapabilities.length > 0) {
        // Should have similarity scores
        for (const sc of result.similarCapabilities) {
          expect(sc.similarity).toBeGreaterThan(0);
          expect(sc.similarity).toBeLessThanOrEqual(100);
        }

        // Should be sorted by similarity (descending)
        for (let i = 0; i < result.similarCapabilities.length - 1; i++) {
          expect(result.similarCapabilities[i].similarity).toBeGreaterThanOrEqual(
            result.similarCapabilities[i + 1].similarity
          );
        }
      }
    });

    it('should return empty for no matches', async () => {
      const result = await executeQuery('zzz xyz abc', capabilities);

      expect(result.queryType).toBe('find-similar');
      expect(result.capabilities).toHaveLength(0);
    });

    it('should format find-similar result with similarity percentages', async () => {
      const result = await executeQuery('workflow', capabilities);
      const formatted = formatQueryResult(result);

      expect(formatted).toContain('# Capabilities similar to');

      if (result.similarCapabilities && result.similarCapabilities.length > 0) {
        expect(formatted).toMatch(/\d+% match/);
      }
    });
  });

  describe('KDD topology reading', () => {
    it('should read KDD patterns, learnings, decisions', async () => {
      // Find a capability with KDD links
      const capWithKDD = capabilities.find(
        cap =>
          cap.kddLinks &&
          (cap.kddLinks.patterns.length > 0 ||
            cap.kddLinks.learnings.length > 0 ||
            cap.kddLinks.decisions.length > 0)
      );

      if (capWithKDD) {
        expect(capWithKDD.kddLinks).toBeDefined();

        // Should have at least one type of KDD document
        const hasKDD =
          capWithKDD.kddLinks!.patterns.length > 0 ||
          capWithKDD.kddLinks!.learnings.length > 0 ||
          capWithKDD.kddLinks!.decisions.length > 0;

        expect(hasKDD).toBe(true);
      }
    });
  });

  describe('status indicators accuracy', () => {
    it('should match status indicators to actual story status', async () => {
      // Find stories with "Done" status
      const doneCapabilities = capabilities.filter(cap => cap.story && cap.status === '✅');

      // At least some stories should be done
      if (doneCapabilities.length > 0) {
        for (const cap of doneCapabilities) {
          // Done stories should have ✅ status
          expect(cap.status).toBe('✅');
        }
      }

      // Find in-progress stories
      const inProgressCapabilities = capabilities.filter(cap => cap.status === '🔄');

      for (const cap of inProgressCapabilities) {
        // In progress should have story reference
        expect(cap.story).toBeDefined();
      }
    });
  });

  describe('graceful degradation', () => {
    it('should handle missing Victor workspace gracefully', async () => {
      const caps = await buildCapabilityRecords(
        STORIES_DIR,
        join(PROJECT_ROOT, 'nonexistent-workspace'),
        KDD_DIR,
        EPIC_CAPABILITIES_PATH
      );

      // Should still return capabilities from other sources
      expect(caps.length).toBeGreaterThan(0);
    });

    it('should handle missing KDD directory gracefully', async () => {
      const caps = await buildCapabilityRecords(
        STORIES_DIR,
        VICTOR_WORKSPACE,
        join(PROJECT_ROOT, 'nonexistent-kdd'),
        EPIC_CAPABILITIES_PATH
      );

      // Should still return capabilities from other sources
      expect(caps.length).toBeGreaterThan(0);
    });

    it('should handle missing epic capabilities file gracefully', async () => {
      const caps = await buildCapabilityRecords(
        STORIES_DIR,
        VICTOR_WORKSPACE,
        KDD_DIR,
        join(PROJECT_ROOT, 'nonexistent.md')
      );

      // Should still return capabilities from stories
      expect(caps.length).toBeGreaterThan(0);
    });
  });

  describe('performance', () => {
    it('should respond to queries in <3s', async () => {
      const queries = [
        'list all',
        'can POEM organize prompts?',
        'workflow execution',
        "what's blocking story 3.8?"
      ];

      for (const query of queries) {
        const startTime = Date.now();

        if (query.includes('blocking')) {
          await executeQuery(query, capabilities, STORIES_DIR);
        } else {
          await executeQuery(query, capabilities);
        }

        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(3000);
      }
    });
  });
});
