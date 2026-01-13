/**
 * Schema-Based Field Detection
 * Analyzes schema fields and determines appropriate mock data generators
 */

import type { SchemaField } from '../schema/types';
import * as youtubeGenerators from './youtube-generators';

/**
 * Field pattern detection result
 */
export interface FieldPattern {
  /** Pattern type detected */
  type: 'youtube' | 'generic';
  /** Specific generator function name (if YouTube pattern) */
  generator?: string;
}

/**
 * Detect field pattern and return appropriate generator
 *
 * @param field - Schema field to analyze
 * @returns Field pattern detection result
 */
export function detectFieldPattern(field: SchemaField): FieldPattern {
  const fieldName = field.name.toLowerCase();

  // Transcript patterns
  if (fieldName.includes('transcript') && !fieldName.includes('summary') && !fieldName.includes('abridgement')) {
    return { type: 'youtube', generator: 'generateTranscript' };
  }

  // Transcript abridgement
  if (fieldName.includes('abridgement') || (fieldName.includes('transcript') && fieldName.includes('summary'))) {
    return { type: 'youtube', generator: 'generateTranscriptAbridgement' };
  }

  // Chapters
  if (fieldName.includes('chapter') && field.type === 'string' && !fieldName.includes('title')) {
    return { type: 'youtube', generator: 'generateChapters' };
  }

  // Video titles
  if (fieldName.includes('title') && !fieldName.includes('idea')) {
    return { type: 'youtube', generator: 'generateTitle' };
  }

  // Title ideas (array)
  if (fieldName.includes('title') && fieldName.includes('idea')) {
    return { type: 'youtube', generator: 'generateTitleIdeas' };
  }

  // Descriptions
  if (fieldName.includes('description') && !fieldName.includes('simple')) {
    return { type: 'youtube', generator: 'generateDescription' };
  }

  // Simple descriptions
  if (fieldName.includes('description') && fieldName.includes('simple')) {
    return { type: 'youtube', generator: 'generateSimpleDescription' };
  }

  // Keywords
  if (fieldName.includes('keyword')) {
    return { type: 'youtube', generator: 'generateKeywords' };
  }

  // Thumbnail text
  if (fieldName.includes('thumbnail') && fieldName.includes('text')) {
    return { type: 'youtube', generator: 'generateThumbnailText' };
  }

  // CTA
  if (fieldName.includes('cta')) {
    return { type: 'youtube', generator: 'generateCTA' };
  }

  // No specific pattern detected
  return { type: 'generic' };
}

/**
 * Get YouTube-specific generator function for a field
 * Returns null if field doesn't match YouTube patterns
 *
 * @param field - Schema field
 * @returns Generator function or null
 */
export function getYouTubeGenerator(field: SchemaField): (() => unknown) | null {
  const pattern = detectFieldPattern(field);

  if (pattern.type !== 'youtube' || !pattern.generator) {
    return null;
  }

  // Get the generator function
  const generator = (youtubeGenerators as Record<string, unknown>)[pattern.generator];

  if (typeof generator === 'function') {
    return generator as () => unknown;
  }

  return null;
}

/**
 * Check if field should use YouTube-specific generation
 *
 * @param field - Schema field
 * @returns True if YouTube-specific generator should be used
 */
export function isYouTubeField(field: SchemaField): boolean {
  const pattern = detectFieldPattern(field);
  return pattern.type === 'youtube';
}

/**
 * Determine array item count based on field name patterns
 * Uses YouTube-specific sizing for known patterns
 *
 * @param field - Schema field (must be type 'array')
 * @returns Recommended min and max item counts
 */
export function getArrayItemCount(field: SchemaField): { min: number; max: number } {
  const fieldName = field.name.toLowerCase();

  // Title ideas: 3-5 items
  if (fieldName.includes('title') && fieldName.includes('idea')) {
    return { min: 3, max: 5 };
  }

  // Keywords: 5-10 items
  if (fieldName.includes('keyword')) {
    return { min: 5, max: 10 };
  }

  // Chapters: 5-10 items
  if (fieldName.includes('chapter')) {
    return { min: 5, max: 10 };
  }

  // CTA arrays: 3-5 items
  if (fieldName.includes('cta')) {
    return { min: 3, max: 5 };
  }

  // Related links: 3-7 items
  if (fieldName.includes('link') || fieldName.includes('url')) {
    return { min: 3, max: 7 };
  }

  // Default: 3-7 items
  return { min: 3, max: 7 };
}
