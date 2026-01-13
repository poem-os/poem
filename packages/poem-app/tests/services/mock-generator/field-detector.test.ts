/**
 * Field Detector Tests
 * Tests schema field pattern detection and YouTube field identification
 */

import { describe, it, expect } from 'vitest';
import {
  detectFieldPattern,
  getYouTubeGenerator,
  isYouTubeField,
  getArrayItemCount
} from '../../../src/services/mock-generator/field-detector';
import type { SchemaField } from '../../../src/services/schema/types';

describe('FieldDetector', () => {
  describe('detectFieldPattern', () => {
    it('should detect transcript field', () => {
      const field: SchemaField = {
        name: 'transcript',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateTranscript');
    });

    it('should detect transcriptAbridgement field', () => {
      const field: SchemaField = {
        name: 'transcriptAbridgement',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateTranscriptAbridgement');
    });

    it('should detect chapters field', () => {
      const field: SchemaField = {
        name: 'chapters',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateChapters');
    });

    it('should detect videoTitle field', () => {
      const field: SchemaField = {
        name: 'videoTitle',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateTitle');
    });

    it('should detect titleIdeas field', () => {
      const field: SchemaField = {
        name: 'titleIdeas',
        type: 'array',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateTitleIdeas');
    });

    it('should detect videoDescription field', () => {
      const field: SchemaField = {
        name: 'videoDescription',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateDescription');
    });

    it('should detect simpleDescription field', () => {
      const field: SchemaField = {
        name: 'videoSimpleDescription',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateSimpleDescription');
    });

    it('should detect keywords field', () => {
      const field: SchemaField = {
        name: 'videoKeywords',
        type: 'array',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateKeywords');
    });

    it('should detect thumbnailText field', () => {
      const field: SchemaField = {
        name: 'thumbnailText',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateThumbnailText');
    });

    it('should detect CTA field', () => {
      const field: SchemaField = {
        name: 'primaryCta',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('youtube');
      expect(pattern.generator).toBe('generateCTA');
    });

    it('should return generic pattern for non-YouTube fields', () => {
      const field: SchemaField = {
        name: 'author',
        type: 'string',
        required: true
      };

      const pattern = detectFieldPattern(field);

      expect(pattern.type).toBe('generic');
      expect(pattern.generator).toBeUndefined();
    });
  });

  describe('getYouTubeGenerator', () => {
    it('should return generator function for YouTube fields', () => {
      const field: SchemaField = {
        name: 'transcript',
        type: 'string',
        required: true
      };

      const generator = getYouTubeGenerator(field);

      expect(generator).toBeDefined();
      expect(typeof generator).toBe('function');
    });

    it('should return null for non-YouTube fields', () => {
      const field: SchemaField = {
        name: 'author',
        type: 'string',
        required: true
      };

      const generator = getYouTubeGenerator(field);

      expect(generator).toBeNull();
    });

    it('should generate valid output when called', () => {
      const field: SchemaField = {
        name: 'videoTitle',
        type: 'string',
        required: true
      };

      const generator = getYouTubeGenerator(field);

      if (generator) {
        const result = generator();
        expect(typeof result).toBe('string');
        expect((result as string).length).toBeGreaterThan(0);
      }
    });
  });

  describe('isYouTubeField', () => {
    it('should return true for YouTube fields', () => {
      const field: SchemaField = {
        name: 'videoDescription',
        type: 'string',
        required: true
      };

      expect(isYouTubeField(field)).toBe(true);
    });

    it('should return false for generic fields', () => {
      const field: SchemaField = {
        name: 'email',
        type: 'string',
        required: true
      };

      expect(isYouTubeField(field)).toBe(false);
    });
  });

  describe('getArrayItemCount', () => {
    it('should return 3-5 for titleIdeas', () => {
      const field: SchemaField = {
        name: 'titleIdeas',
        type: 'array',
        required: true
      };

      const count = getArrayItemCount(field);

      expect(count.min).toBe(3);
      expect(count.max).toBe(5);
    });

    it('should return 5-10 for keywords', () => {
      const field: SchemaField = {
        name: 'videoKeywords',
        type: 'array',
        required: true
      };

      const count = getArrayItemCount(field);

      expect(count.min).toBe(5);
      expect(count.max).toBe(10);
    });

    it('should return 5-10 for chapters', () => {
      const field: SchemaField = {
        name: 'chapters',
        type: 'array',
        required: true
      };

      const count = getArrayItemCount(field);

      expect(count.min).toBe(5);
      expect(count.max).toBe(10);
    });

    it('should return 3-5 for CTA arrays', () => {
      const field: SchemaField = {
        name: 'affiliateCta',
        type: 'array',
        required: true
      };

      const count = getArrayItemCount(field);

      expect(count.min).toBe(3);
      expect(count.max).toBe(5);
    });

    it('should return 3-7 default for generic arrays', () => {
      const field: SchemaField = {
        name: 'items',
        type: 'array',
        required: true
      };

      const count = getArrayItemCount(field);

      expect(count.min).toBe(3);
      expect(count.max).toBe(7);
    });
  });
});
