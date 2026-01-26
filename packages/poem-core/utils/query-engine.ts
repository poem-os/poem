/**
 * Query Engine
 *
 * Implements capability query system with 4 query types:
 * 1. "list all" - returns categorized capabilities
 * 2. "can do X" - exact match + near-matches
 * 3. "find similar" - keyword matching with similarity scores
 * 4. "find blockers" - story dependency resolution
 */

import type { CapabilityRecord } from './capability-reader';

export interface QueryResult {
  query: string;
  queryType: 'list-all' | 'can-do' | 'find-similar' | 'find-blockers';
  matchType?: 'exact' | 'partial' | 'none';
  capabilities: CapabilityRecord[];
  similarCapabilities?: Array<{
    capability: CapabilityRecord;
    similarity: number;
  }>;
  blockers?: Array<{
    story: string;
    blockedBy: string[];
    reason: string;
  }>;
}

/**
 * Parse natural language query and determine query type
 */
export function parseQuery(query: string): {
  type: QueryResult['queryType'];
  searchTerm?: string;
} {
  const normalizedQuery = query.toLowerCase().trim();

  // List all
  if (
    normalizedQuery.includes('list all') ||
    normalizedQuery.includes('show all') ||
    normalizedQuery === 'all' ||
    normalizedQuery === 'capabilities'
  ) {
    return { type: 'list-all' };
  }

  // Can do X
  if (normalizedQuery.startsWith('can') || normalizedQuery.includes('can poem')) {
    const searchTerm = normalizedQuery
      .replace(/^can\s+(poem\s+)?/, '')
      .replace(/\?$/, '')
      .trim();
    return { type: 'can-do', searchTerm };
  }

  // Find blockers
  if (normalizedQuery.includes('blocking') || normalizedQuery.includes('blocked')) {
    const storyMatch = normalizedQuery.match(/story\s+(\d+\.\d+)/);
    const searchTerm = storyMatch ? storyMatch[1] : '';
    return { type: 'find-blockers', searchTerm };
  }

  // Find similar (default for other queries)
  return { type: 'find-similar', searchTerm: query.trim() };
}

/**
 * Execute "list all" query - returns categorized capabilities
 */
export function listAllCapabilities(capabilities: CapabilityRecord[]): QueryResult {
  return {
    query: 'list all capabilities',
    queryType: 'list-all',
    capabilities: capabilities.sort((a, b) => {
      // Sort by status priority
      const statusPriority: Record<string, number> = {
        '✅': 1,
        '⚠️': 2,
        '🔄': 3,
        '📅': 4,
        '❌': 5
      };
      return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
    })
  };
}

/**
 * Execute "can do X" query - exact match + near-matches
 */
export function canDoQuery(
  searchTerm: string,
  capabilities: CapabilityRecord[]
): QueryResult {
  const normalizedSearch = searchTerm.toLowerCase();

  // Find exact matches
  const exactMatches = capabilities.filter(cap => {
    const capName = cap.name.toLowerCase();
    return (
      capName === normalizedSearch ||
      capName.includes(normalizedSearch) ||
      normalizedSearch.includes(capName)
    );
  });

  // Find near-matches (keyword-based)
  const keywords = normalizedSearch.split(/\s+/);
  const nearMatches = capabilities.filter(cap => {
    if (exactMatches.includes(cap)) return false;

    const capName = cap.name.toLowerCase();
    const capDesc = cap.description.toLowerCase();

    // At least 50% of keywords must match
    const matchingKeywords = keywords.filter(
      kw => capName.includes(kw) || capDesc.includes(kw)
    );

    return matchingKeywords.length >= Math.ceil(keywords.length * 0.5);
  });

  const allMatches = [...exactMatches, ...nearMatches];

  return {
    query: `can POEM ${searchTerm}?`,
    queryType: 'can-do',
    matchType: exactMatches.length > 0 ? 'exact' : nearMatches.length > 0 ? 'partial' : 'none',
    capabilities: allMatches
  };
}

/**
 * Execute "find similar" query - keyword matching with similarity scores
 */
export function findSimilarQuery(
  searchTerm: string,
  capabilities: CapabilityRecord[]
): QueryResult {
  const normalizedSearch = searchTerm.toLowerCase();
  const keywords = normalizedSearch.split(/\s+/).filter(k => k.length > 2); // Ignore short words

  const scoredCapabilities = capabilities.map(cap => {
    const capName = cap.name.toLowerCase();
    const capDesc = cap.description.toLowerCase();

    // Calculate similarity score
    let score = 0;

    for (const keyword of keywords) {
      if (capName.includes(keyword)) score += 10; // Name match = high weight
      if (capDesc.includes(keyword)) score += 3; // Description match = medium weight

      // Acceptance criteria matches
      if (cap.story) {
        const acText = cap.description.toLowerCase();
        if (acText.includes(keyword)) score += 2;
      }
    }

    // Bonus for exact phrase match
    if (capName.includes(normalizedSearch)) score += 20;
    if (capDesc.includes(normalizedSearch)) score += 10;

    // Calculate percentage similarity
    const maxScore = keywords.length * 10 + 20; // Max possible score
    const similarity = Math.min(100, Math.round((score / maxScore) * 100));

    return { capability: cap, similarity };
  });

  // Filter and sort by similarity
  const results = scoredCapabilities
    .filter(sc => sc.similarity > 20) // Only show >20% similarity
    .sort((a, b) => b.similarity - a.similarity);

  return {
    query: `find capabilities similar to "${searchTerm}"`,
    queryType: 'find-similar',
    capabilities: results.map(r => r.capability),
    similarCapabilities: results
  };
}

/**
 * Execute "find blockers" query - story dependency resolution
 */
export async function findBlockersQuery(
  storyNumber: string,
  capabilities: CapabilityRecord[],
  storiesDir: string
): Promise<QueryResult> {
  const blockers: QueryResult['blockers'] = [];

  // Read story file to check dependencies
  try {
    const { promises: fs } = await import('fs');
    const { join } = await import('path');

    const storyPath = join(storiesDir, `${storyNumber}.story.md`);
    const content = await fs.readFile(storyPath, 'utf-8');

    // Extract dependencies from story (look for "depends on", "blocked by", etc.)
    const depMatches = content.matchAll(/(?:depends on|blocked by|requires)\s+story\s+(\d+\.\d+)/gi);

    for (const match of depMatches) {
      const blockedByStory = match[1];

      // Find capability for blocking story
      const blockingCap = capabilities.find(c => c.story === blockedByStory);

      if (blockingCap && blockingCap.status !== '✅') {
        blockers.push({
          story: storyNumber,
          blockedBy: [blockedByStory],
          reason: `Story ${blockedByStory} (${blockingCap.name}) is ${blockingCap.status}`
        });
      }
    }

    // Also check if story status is blocked
    const statusMatch = content.match(/## Status\s+(\w+)/);
    if (statusMatch && statusMatch[1] === 'Blocked') {
      blockers.push({
        story: storyNumber,
        blockedBy: [],
        reason: 'Story status is explicitly marked as Blocked'
      });
    }
  } catch (error) {
    console.warn(`Failed to read story ${storyNumber}:`, error);
  }

  return {
    query: `find what's blocking story ${storyNumber}`,
    queryType: 'find-blockers',
    capabilities: [],
    blockers
  };
}

/**
 * Main query executor - delegates to specific query type
 */
export async function executeQuery(
  query: string,
  capabilities: CapabilityRecord[],
  storiesDir?: string
): Promise<QueryResult> {
  const { type, searchTerm } = parseQuery(query);

  switch (type) {
    case 'list-all':
      return listAllCapabilities(capabilities);

    case 'can-do':
      return canDoQuery(searchTerm || '', capabilities);

    case 'find-similar':
      return findSimilarQuery(searchTerm || '', capabilities);

    case 'find-blockers':
      if (!storiesDir) {
        throw new Error('storiesDir required for find-blockers query');
      }
      return findBlockersQuery(searchTerm || '', capabilities, storiesDir);

    default:
      return {
        query,
        queryType: 'list-all',
        capabilities: []
      };
  }
}
