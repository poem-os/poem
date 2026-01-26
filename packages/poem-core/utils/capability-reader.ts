/**
 * Capability Data Reader
 *
 * Reads capability information from multiple data sources:
 * 1. Victor artifacts (integration-matrix.md, test-reports/)
 * 2. Story files (Status, Acceptance Criteria)
 * 3. KDD topology (patterns/, learnings/, decisions/)
 * 4. Epic Capabilities (epic-capabilities.md)
 */

import { promises as fs } from 'fs';
import { join } from 'path';

export interface CapabilityRecord {
  name: string;
  status: '✅' | '🔄' | '📅' | '⚠️' | '❌';
  story?: string;
  validation?: 'passed' | 'concerns' | 'failed';
  description: string;
  usage?: {
    commands: string[];
    examples: string[];
    docs: string[];
  };
  kddLinks?: {
    patterns: string[];
    learnings: string[];
    decisions: string[];
  };
  source: 'victor' | 'story' | 'kdd' | 'epic';
}

export interface StoryData {
  storyNumber: string;
  status: string;
  acceptanceCriteria: string[];
  description: string;
}

export interface VictorData {
  capabilities: string[];
  validationStatus: Record<string, 'passed' | 'concerns' | 'failed'>;
}

export interface KDDData {
  patterns: string[];
  learnings: string[];
  decisions: string[];
}

export interface EpicCapability {
  name: string;
  description: string;
  epic: string;
  story?: string;
}

/**
 * Read story files and extract capability information
 */
export async function readStoryFiles(storiesDir: string): Promise<StoryData[]> {
  try {
    const files = await fs.readdir(storiesDir);
    const storyFiles = files.filter(f => f.endsWith('.story.md'));

    const stories: StoryData[] = [];

    for (const file of storyFiles) {
      const content = await fs.readFile(join(storiesDir, file), 'utf-8');
      const storyNumber = file.replace('.story.md', '');

      // Extract status
      const statusMatch = content.match(/## Status\s+(\w+)/);
      const status = statusMatch ? statusMatch[1] : 'Unknown';

      // Extract acceptance criteria
      const acSection = content.match(/## Acceptance Criteria\s+([\s\S]*?)(?=\n##|$)/);
      const acceptanceCriteria: string[] = [];
      if (acSection) {
        const acLines = acSection[1].match(/^\d+\.\s+(.+)$/gm);
        if (acLines) {
          acceptanceCriteria.push(...acLines.map(line => line.replace(/^\d+\.\s+/, '')));
        }
      }

      // Extract story description
      const storySection = content.match(/## Story\s+([\s\S]*?)(?=\n##|$)/);
      const description = storySection ? storySection[1].trim() : '';

      stories.push({
        storyNumber,
        status,
        acceptanceCriteria,
        description
      });
    }

    return stories;
  } catch (error) {
    // Graceful degradation
    console.warn(`Failed to read story files from ${storiesDir}:`, error);
    return [];
  }
}

/**
 * Read Victor artifacts (integration-matrix.md, test-reports/)
 */
export async function readVictorArtifacts(workspaceDir: string): Promise<VictorData> {
  const data: VictorData = {
    capabilities: [],
    validationStatus: {}
  };

  try {
    // Read integration-matrix.md
    const matrixPath = join(workspaceDir, 'integration-matrix.md');
    try {
      const matrixContent = await fs.readFile(matrixPath, 'utf-8');

      // Extract capability names from markdown table
      const tableRows = matrixContent.match(/\|[^\n]+\|/g);
      if (tableRows) {
        for (const row of tableRows.slice(2)) { // Skip header rows
          const cells = row.split('|').map(c => c.trim()).filter(c => c);
          if (cells.length > 0) {
            const capability = cells[0];
            if (capability && !capability.includes('---')) {
              data.capabilities.push(capability);

              // Extract validation status from status column (usually last column)
              const statusCell = cells[cells.length - 1];
              if (statusCell.includes('✅')) {
                data.validationStatus[capability] = 'passed';
              } else if (statusCell.includes('⚠️')) {
                data.validationStatus[capability] = 'concerns';
              } else if (statusCell.includes('❌')) {
                data.validationStatus[capability] = 'failed';
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Integration matrix not found, skipping');
    }

    // Read test-reports/ directory
    try {
      const reportsDir = join(workspaceDir, 'test-reports');
      const reportFiles = await fs.readdir(reportsDir);

      for (const file of reportFiles) {
        if (file.endsWith('.md')) {
          const reportContent = await fs.readFile(join(reportsDir, file), 'utf-8');

          // Extract capabilities from test reports
          const capabilityMatches = reportContent.matchAll(/(?:test|capability|feature):\s*(.+)/gi);
          for (const match of capabilityMatches) {
            const capability = match[1].trim();
            if (!data.capabilities.includes(capability)) {
              data.capabilities.push(capability);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Test reports directory not found, skipping');
    }

  } catch (error) {
    console.warn(`Failed to read Victor artifacts from ${workspaceDir}:`, error);
  }

  return data;
}

/**
 * Read KDD topology (patterns/, learnings/, decisions/)
 */
export async function readKDDTopology(kddDir: string): Promise<KDDData> {
  const data: KDDData = {
    patterns: [],
    learnings: [],
    decisions: []
  };

  try {
    // Read patterns/
    try {
      const patternsDir = join(kddDir, 'patterns');
      const patternFiles = await fs.readdir(patternsDir);
      data.patterns = patternFiles.filter(f => f.endsWith('.md'));
    } catch (err) {
      console.warn('Patterns directory not found, skipping');
    }

    // Read learnings/
    try {
      const learningsDir = join(kddDir, 'learnings');
      const learningFiles = await fs.readdir(learningsDir);
      data.learnings = learningFiles.filter(f => f.endsWith('.md'));
    } catch (err) {
      console.warn('Learnings directory not found, skipping');
    }

    // Read decisions/
    try {
      const decisionsDir = join(kddDir, 'decisions');
      const decisionFiles = await fs.readdir(decisionsDir);
      data.decisions = decisionFiles.filter(f => f.endsWith('.md'));
    } catch (err) {
      console.warn('Decisions directory not found, skipping');
    }

  } catch (error) {
    console.warn(`Failed to read KDD topology from ${kddDir}:`, error);
  }

  return data;
}

/**
 * Read Epic Capabilities from PRD
 */
export async function readEpicCapabilities(epicCapabilitiesPath: string): Promise<EpicCapability[]> {
  const capabilities: EpicCapability[] = [];

  try {
    const content = await fs.readFile(epicCapabilitiesPath, 'utf-8');

    // Extract table rows
    const tableRows = content.match(/\|[^\n]+\|/g);
    if (tableRows) {
      for (const row of tableRows.slice(2)) { // Skip header rows
        const cells = row.split('|').map(c => c.trim()).filter(c => c);

        if (cells.length >= 3) {
          const [name, description, epicStory] = cells;

          if (name && !name.includes('---')) {
            const epicMatch = epicStory.match(/(\d+)\.(\d+)/);

            capabilities.push({
              name,
              description,
              epic: epicMatch ? epicMatch[1] : epicStory,
              story: epicMatch ? `${epicMatch[1]}.${epicMatch[2]}` : undefined
            });
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to read epic capabilities from ${epicCapabilitiesPath}:`, error);
  }

  return capabilities;
}

/**
 * Build unified capability records from all sources
 */
export async function buildCapabilityRecords(
  storiesDir: string,
  victorWorkspaceDir: string,
  kddDir: string,
  epicCapabilitiesPath: string
): Promise<CapabilityRecord[]> {
  const records: CapabilityRecord[] = [];

  // Read all data sources
  const [stories, victorData, kddData, epicCapabilities] = await Promise.all([
    readStoryFiles(storiesDir),
    readVictorArtifacts(victorWorkspaceDir),
    readKDDTopology(kddDir),
    readEpicCapabilities(epicCapabilitiesPath)
  ]);

  // Build capability records from stories
  for (const story of stories) {
    const capabilityName = extractCapabilityName(story.description);

    // Find matching validation from Victor data (case-insensitive)
    let validation: CapabilityRecord['validation'] | undefined;
    for (const [victorCap, status] of Object.entries(victorData.validationStatus)) {
      if (victorCap.toLowerCase().includes(capabilityName.toLowerCase()) ||
          capabilityName.toLowerCase().includes(victorCap.toLowerCase())) {
        validation = status;
        break;
      }
    }

    // Determine status
    let status: CapabilityRecord['status'];
    if (story.status === 'Done') {
      // Check Victor validation
      status = validation === 'concerns' ? '⚠️' : '✅';
    } else if (story.status === 'InProgress' || story.status === 'Review') {
      status = '🔄';
    } else {
      status = '📅';
    }

    records.push({
      name: capabilityName,
      status,
      story: story.storyNumber,
      validation,
      description: story.description,
      source: 'story',
      kddLinks: {
        patterns: kddData.patterns.filter(p => p.includes(story.storyNumber.replace('.', '-'))),
        learnings: kddData.learnings.filter(l => l.includes(story.storyNumber.replace('.', '-'))),
        decisions: kddData.decisions.filter(d => d.includes(story.storyNumber.replace('.', '-')))
      }
    });
  }

  // Build capability records from Epic Capabilities (planned features)
  for (const epicCap of epicCapabilities) {
    // Check if already in stories
    const existingStory = stories.find(s => s.storyNumber === epicCap.story);

    if (!existingStory) {
      records.push({
        name: epicCap.name,
        status: '📅',
        description: epicCap.description,
        source: 'epic'
      });
    }
  }

  return records;
}

/**
 * Extract capability name from story description
 */
function extractCapabilityName(description: string): string {
  // Extract "I want to X" pattern
  const wantMatch = description.match(/I want (?:to\s+)?([^,]+)/i);
  if (wantMatch) {
    return wantMatch[1].trim();
  }

  // Fallback: use first sentence
  const firstSentence = description.split('\n')[0];
  return firstSentence.replace(/^\*\*As a\*\*.*\*\*I want\*\*\s*/i, '').trim();
}
