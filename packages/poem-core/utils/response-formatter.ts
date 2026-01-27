/**
 * Response Formatter
 *
 * Formats capability query results for display to users.
 * Supports 4 query types: list-all, can-do, find-similar, find-blockers
 */

import type { QueryResult } from './query-engine';
import type { CapabilityRecord } from './capability-reader';

/**
 * Format "list all" results (grouped by status, with icons)
 */
export function formatListAll(result: QueryResult): string {
  const lines: string[] = [];

  lines.push('# POEM Capabilities\n');

  // Group by status
  const grouped: Record<string, CapabilityRecord[]> = {};
  for (const cap of result.capabilities) {
    if (!grouped[cap.status]) {
      grouped[cap.status] = [];
    }
    grouped[cap.status].push(cap);
  }

  // Display in priority order
  const statusOrder = ['✅', '⚠️', '🔄', '📅', '❌'];

  for (const status of statusOrder) {
    if (!grouped[status] || grouped[status].length === 0) continue;

    const statusLabel = {
      '✅': 'Functional',
      '⚠️': 'Partial / Warnings',
      '🔄': 'In Progress',
      '📅': 'Planned',
      '❌': 'Not Available'
    }[status];

    lines.push(`\n## ${status} ${statusLabel} (${grouped[status].length})\n`);

    for (const cap of grouped[status]) {
      lines.push(`### ${cap.name}`);
      if (cap.story) {
        lines.push(`**Story**: ${cap.story}`);
      }
      if (cap.validation) {
        lines.push(`**Validation**: ${cap.validation}`);
      }
      if (cap.description) {
        lines.push(`**Description**: ${cap.description}`);
      }

      // KDD links
      if (cap.kddLinks) {
        const links: string[] = [];
        if (cap.kddLinks.patterns.length > 0) {
          links.push(`Patterns: ${cap.kddLinks.patterns.length}`);
        }
        if (cap.kddLinks.learnings.length > 0) {
          links.push(`Learnings: ${cap.kddLinks.learnings.length}`);
        }
        if (cap.kddLinks.decisions.length > 0) {
          links.push(`Decisions: ${cap.kddLinks.decisions.length}`);
        }
        if (links.length > 0) {
          lines.push(`**KDD**: ${links.join(', ')}`);
        }
      }

      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Format "can do X" results (YES/NO + details + usage)
 */
export function formatCanDo(result: QueryResult): string {
  const lines: string[] = [];

  lines.push(`# Can POEM ${result.query.replace(/^can POEM\s+/i, '').replace(/\?$/, '')}?\n`);

  if (result.matchType === 'none') {
    lines.push('## ❌ NO\n');
    lines.push('POEM does not currently have this capability.');
    lines.push('\nCheck planned features in Epic Capabilities or request this feature.');
    return lines.join('\n');
  }

  if (result.matchType === 'exact') {
    lines.push('## ✅ YES\n');
  } else {
    lines.push('## ⚠️ PARTIAL MATCH\n');
    lines.push('Found related capabilities:\n');
  }

  for (const cap of result.capabilities) {
    lines.push(`### ${cap.status} ${cap.name}`);

    if (cap.story) {
      lines.push(`**Story**: ${cap.story}`);
    }

    if (cap.description) {
      lines.push(`**Description**: ${cap.description}`);
    }

    // Usage information
    if (cap.usage) {
      lines.push('\n**How to use:**');

      if (cap.usage.commands.length > 0) {
        lines.push(`Commands: ${cap.usage.commands.join(', ')}`);
      }

      if (cap.usage.examples.length > 0) {
        lines.push('\nExamples:');
        for (const example of cap.usage.examples) {
          lines.push(`- ${example}`);
        }
      }

      if (cap.usage.docs.length > 0) {
        lines.push('\nDocumentation:');
        for (const doc of cap.usage.docs) {
          lines.push(`- ${doc}`);
        }
      }
    }

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format "find similar" results (ranked list with % similarity)
 */
export function formatFindSimilar(result: QueryResult): string {
  const lines: string[] = [];

  lines.push(`# Capabilities similar to "${result.query.replace(/^find capabilities similar to\s+/i, '').replace(/['"]/g, '')}"\n`);

  if (!result.similarCapabilities || result.similarCapabilities.length === 0) {
    lines.push('No similar capabilities found.');
    return lines.join('\n');
  }

  lines.push(`Found ${result.similarCapabilities.length} similar capabilities:\n`);

  for (const { capability, similarity } of result.similarCapabilities) {
    lines.push(`## ${capability.status} ${capability.name} (${similarity}% match)`);

    if (capability.story) {
      lines.push(`**Story**: ${capability.story}`);
    }

    if (capability.description) {
      lines.push(`**Description**: ${capability.description}`);
    }

    // KDD links for deep dive
    if (capability.kddLinks && (
      capability.kddLinks.patterns.length > 0 ||
      capability.kddLinks.learnings.length > 0 ||
      capability.kddLinks.decisions.length > 0
    )) {
      lines.push('\n**Related KDD:**');

      if (capability.kddLinks.patterns.length > 0) {
        lines.push(`- Patterns: ${capability.kddLinks.patterns.slice(0, 3).join(', ')}`);
      }
      if (capability.kddLinks.learnings.length > 0) {
        lines.push(`- Learnings: ${capability.kddLinks.learnings.slice(0, 3).join(', ')}`);
      }
      if (capability.kddLinks.decisions.length > 0) {
        lines.push(`- Decisions: ${capability.kddLinks.decisions.slice(0, 3).join(', ')}`);
      }
    }

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format "find blockers" results (dependency tree with recommendations)
 */
export function formatFindBlockers(result: QueryResult): string {
  const lines: string[] = [];

  const storyMatch = result.query.match(/story\s+(\d+\.\d+)/i);
  const storyNumber = storyMatch ? storyMatch[1] : 'unknown';

  lines.push(`# What's blocking Story ${storyNumber}?\n`);

  if (!result.blockers || result.blockers.length === 0) {
    lines.push('✅ No blockers found!\n');
    lines.push('This story appears ready to proceed.');
    return lines.join('\n');
  }

  lines.push(`Found ${result.blockers.length} blocker(s):\n`);

  for (const blocker of result.blockers) {
    lines.push(`## Blocker: ${blocker.reason}`);

    if (blocker.blockedBy.length > 0) {
      lines.push('\n**Blocked by stories:**');
      for (const blockingStory of blocker.blockedBy) {
        lines.push(`- Story ${blockingStory}`);
      }
    }

    lines.push('\n**Recommendation:**');
    if (blocker.blockedBy.length > 0) {
      lines.push(`Complete ${blocker.blockedBy.join(', ')} before proceeding with Story ${storyNumber}.`);
    } else {
      lines.push('Review story status and resolve blocking issues.');
    }

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Main formatter - delegates to specific query type formatter
 */
export function formatQueryResult(result: QueryResult): string {
  switch (result.queryType) {
    case 'list-all':
      return formatListAll(result);

    case 'can-do':
      return formatCanDo(result);

    case 'find-similar':
      return formatFindSimilar(result);

    case 'find-blockers':
      return formatFindBlockers(result);

    default:
      return `# Query Result\n\nQuery: ${result.query}\nType: ${result.queryType}\n\nNo formatter available for this query type.`;
  }
}
