import { describe, it, expect } from 'vitest';
import {
  formatListAll,
  formatCanDo,
  formatFindSimilar,
  formatFindBlockers,
  formatQueryResult
} from '../../../../poem-core/utils/response-formatter';
import type { QueryResult } from '../../../../poem-core/utils/query-engine';
import type { CapabilityRecord } from '../../../../poem-core/utils/capability-reader';

const SAMPLE_CAPABILITY: CapabilityRecord = {
  name: 'organize prompts into workflows',
  status: '✅',
  story: '3.8',
  validation: 'passed',
  description: 'Multi-workflow support for organizing prompts',
  source: 'story',
  usage: {
    commands: ['*switch <workflow>', '*list-prompts'],
    examples: ['*switch B72', '*list-prompts'],
    docs: ['docs/guides/workflow-validation-guide.md']
  },
  kddLinks: {
    patterns: ['pattern-3-8.md'],
    learnings: ['learning-3-8-workflow-structure.md'],
    decisions: ['adr-042-workflow-scoping.md']
  }
};

describe('response-formatter', () => {
  describe('formatListAll', () => {
    it('should format list of capabilities grouped by status', () => {
      const result: QueryResult = {
        query: 'list all capabilities',
        queryType: 'list-all',
        capabilities: [
          { ...SAMPLE_CAPABILITY, status: '✅' },
          { ...SAMPLE_CAPABILITY, name: 'mock data generation', status: '🔄', story: '4.3' },
          { ...SAMPLE_CAPABILITY, name: 'constraint validation', status: '📅', story: undefined }
        ]
      };

      const formatted = formatListAll(result);

      expect(formatted).toContain('# POEM Capabilities');
      expect(formatted).toContain('## ✅ Functional');
      expect(formatted).toContain('## 🔄 In Progress');
      expect(formatted).toContain('## 📅 Planned');
      expect(formatted).toContain('organize prompts into workflows');
      expect(formatted).toContain('mock data generation');
    });

    it('should include KDD link counts', () => {
      const result: QueryResult = {
        query: 'list all',
        queryType: 'list-all',
        capabilities: [SAMPLE_CAPABILITY]
      };

      const formatted = formatListAll(result);

      expect(formatted).toContain('Patterns: 1');
      expect(formatted).toContain('Learnings: 1');
      expect(formatted).toContain('Decisions: 1');
    });
  });

  describe('formatCanDo', () => {
    it('should format exact match as YES', () => {
      const result: QueryResult = {
        query: 'can POEM organize prompts?',
        queryType: 'can-do',
        matchType: 'exact',
        capabilities: [SAMPLE_CAPABILITY]
      };

      const formatted = formatCanDo(result);

      expect(formatted).toContain('# Can POEM organize prompts?');
      expect(formatted).toContain('## ✅ YES');
      expect(formatted).toContain('organize prompts into workflows');
    });

    it('should format partial match with warning', () => {
      const result: QueryResult = {
        query: 'can POEM do X?',
        queryType: 'can-do',
        matchType: 'partial',
        capabilities: [SAMPLE_CAPABILITY]
      };

      const formatted = formatCanDo(result);

      expect(formatted).toContain('## ⚠️ PARTIAL MATCH');
      expect(formatted).toContain('Found related capabilities');
    });

    it('should format no match as NO', () => {
      const result: QueryResult = {
        query: 'can POEM quantum computing?',
        queryType: 'can-do',
        matchType: 'none',
        capabilities: []
      };

      const formatted = formatCanDo(result);

      expect(formatted).toContain('## ❌ NO');
      expect(formatted).toContain('does not currently have this capability');
    });

    it('should include usage information', () => {
      const result: QueryResult = {
        query: 'can POEM organize prompts?',
        queryType: 'can-do',
        matchType: 'exact',
        capabilities: [SAMPLE_CAPABILITY]
      };

      const formatted = formatCanDo(result);

      expect(formatted).toContain('How to use:');
      expect(formatted).toContain('*switch <workflow>');
      expect(formatted).toContain('Examples:');
      expect(formatted).toContain('*switch B72');
      expect(formatted).toContain('Documentation:');
    });
  });

  describe('formatFindSimilar', () => {
    it('should format similar capabilities with similarity scores', () => {
      const result: QueryResult = {
        query: 'find capabilities similar to "workflow"',
        queryType: 'find-similar',
        capabilities: [SAMPLE_CAPABILITY],
        similarCapabilities: [
          { capability: SAMPLE_CAPABILITY, similarity: 85 },
          { capability: { ...SAMPLE_CAPABILITY, name: 'run workflow chain', status: '✅' }, similarity: 72 }
        ]
      };

      const formatted = formatFindSimilar(result);

      expect(formatted).toContain('# Capabilities similar to');
      expect(formatted).toContain('workflow');
      expect(formatted).toContain('Found 2 similar capabilities');
      expect(formatted).toContain('85% match');
      expect(formatted).toContain('72% match');
    });

    it('should handle no similar capabilities', () => {
      const result: QueryResult = {
        query: 'find capabilities similar to "xyz"',
        queryType: 'find-similar',
        capabilities: [],
        similarCapabilities: []
      };

      const formatted = formatFindSimilar(result);

      expect(formatted).toContain('No similar capabilities found');
    });

    it('should include KDD links for deep dive', () => {
      const result: QueryResult = {
        query: 'find similar',
        queryType: 'find-similar',
        capabilities: [SAMPLE_CAPABILITY],
        similarCapabilities: [{ capability: SAMPLE_CAPABILITY, similarity: 90 }]
      };

      const formatted = formatFindSimilar(result);

      expect(formatted).toContain('Related KDD:');
      expect(formatted).toContain('pattern-3-8.md');
    });
  });

  describe('formatFindBlockers', () => {
    it('should format blockers with dependency tree', () => {
      const result: QueryResult = {
        query: "what's blocking story 5.1?",
        queryType: 'find-blockers',
        capabilities: [],
        blockers: [
          {
            story: '5.1',
            blockedBy: ['4.7', '4.8'],
            reason: 'Dependencies not complete'
          }
        ]
      };

      const formatted = formatFindBlockers(result);

      expect(formatted).toContain("# What's blocking Story 5.1?");
      expect(formatted).toContain('Found 1 blocker');
      expect(formatted).toContain('Dependencies not complete');
      expect(formatted).toContain('Story 4.7');
      expect(formatted).toContain('Story 4.8');
      expect(formatted).toContain('Recommendation:');
    });

    it('should handle no blockers', () => {
      const result: QueryResult = {
        query: "what's blocking story 3.8?",
        queryType: 'find-blockers',
        capabilities: [],
        blockers: []
      };

      const formatted = formatFindBlockers(result);

      expect(formatted).toContain('✅ No blockers found');
      expect(formatted).toContain('ready to proceed');
    });
  });

  describe('formatQueryResult', () => {
    it('should delegate to correct formatter based on query type', () => {
      const listAllResult: QueryResult = {
        query: 'list all',
        queryType: 'list-all',
        capabilities: [SAMPLE_CAPABILITY]
      };

      const formatted = formatQueryResult(listAllResult);
      expect(formatted).toContain('# POEM Capabilities');
    });

    it('should handle unknown query types gracefully', () => {
      const unknownResult = {
        query: 'unknown',
        queryType: 'unknown' as any,
        capabilities: []
      };

      const formatted = formatQueryResult(unknownResult);
      expect(formatted).toContain('No formatter available');
    });
  });
});
