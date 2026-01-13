/**
 * YouTube Generators Tests
 * Tests YouTube-specific mock data generators
 */

import { describe, it, expect } from 'vitest';
import {
  generateTranscript,
  generateTranscriptAbridgement,
  generateChapters,
  generateTitle,
  generateTitleIdeas,
  generateDescription,
  generateSimpleDescription,
  generateKeywords,
  generateThumbnailText,
  generateCTA
} from '../../../src/services/mock-generator/youtube-generators';

describe('YouTubeGenerators', () => {
  describe('generateTranscript', () => {
    it('should generate transcript with word count in range', () => {
      const transcript = generateTranscript(1000, 2000);
      const wordCount = transcript.split(/\s+/).length;

      expect(wordCount).toBeGreaterThanOrEqual(900); // Allow 10% variance
      expect(wordCount).toBeLessThanOrEqual(2100);
    });

    it('should generate transcript with custom word range', () => {
      const transcript = generateTranscript(100, 200);
      const wordCount = transcript.split(/\s+/).length;

      expect(wordCount).toBeGreaterThanOrEqual(90);
      expect(wordCount).toBeLessThanOrEqual(210);
    });
  });

  describe('generateTranscriptAbridgement', () => {
    it('should generate abridgement (500-1000 words)', () => {
      const abridgement = generateTranscriptAbridgement();
      const wordCount = abridgement.split(/\s+/).length;

      expect(wordCount).toBeGreaterThanOrEqual(450);
      expect(wordCount).toBeLessThanOrEqual(1050);
    });
  });

  describe('generateChapters', () => {
    it('should generate chapters with timestamp format', () => {
      const chapters = generateChapters();
      const lines = chapters.split('\n');

      expect(lines.length).toBeGreaterThanOrEqual(5);
      expect(lines.length).toBeLessThanOrEqual(10);

      // Check timestamp format: MM:SS
      lines.forEach(line => {
        expect(line).toMatch(/^\d+:\d{2}\s+/);
      });
    });

    it('should generate chapters with increasing timestamps', () => {
      const chapters = generateChapters();
      const lines = chapters.split('\n');

      let lastTime = -1;
      lines.forEach(line => {
        const match = line.match(/^(\d+):(\d{2})/);
        if (match) {
          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          const totalSeconds = minutes * 60 + seconds;

          expect(totalSeconds).toBeGreaterThan(lastTime);
          lastTime = totalSeconds;
        }
      });
    });
  });

  describe('generateTitle', () => {
    it('should generate title within length constraints', () => {
      const title = generateTitle(45, 50);

      expect(title.length).toBeGreaterThanOrEqual(45);
      expect(title.length).toBeLessThanOrEqual(50);
    });

    it('should generate title with custom length', () => {
      const title = generateTitle(20, 30);

      expect(title.length).toBeGreaterThanOrEqual(20);
      expect(title.length).toBeLessThanOrEqual(30);
    });
  });

  describe('generateTitleIdeas', () => {
    it('should generate array of 3-5 title ideas', () => {
      const ideas = generateTitleIdeas();

      expect(Array.isArray(ideas)).toBe(true);
      expect(ideas.length).toBeGreaterThanOrEqual(3);
      expect(ideas.length).toBeLessThanOrEqual(5);
    });

    it('should generate titles within length constraints', () => {
      const ideas = generateTitleIdeas();

      ideas.forEach(title => {
        expect(title.length).toBeGreaterThanOrEqual(45);
        expect(title.length).toBeLessThanOrEqual(50);
      });
    });
  });

  describe('generateDescription', () => {
    it('should generate description up to max length', () => {
      const description = generateDescription(500);

      expect(description.length).toBeLessThanOrEqual(500);
      expect(description.length).toBeGreaterThan(0);
    });

    it('should generate long description (5000 chars)', () => {
      const description = generateDescription(5000);

      expect(description.length).toBeLessThanOrEqual(5000);
      expect(description.length).toBeGreaterThan(1000);
    });
  });

  describe('generateSimpleDescription', () => {
    it('should generate simple description (max 200 chars)', () => {
      const description = generateSimpleDescription();

      expect(description.length).toBeLessThanOrEqual(200);
      expect(description.length).toBeGreaterThan(0);
    });
  });

  describe('generateKeywords', () => {
    it('should generate array of 5-10 keywords', () => {
      const keywords = generateKeywords();

      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThanOrEqual(5);
      expect(keywords.length).toBeLessThanOrEqual(10);
    });

    it('should generate unique keywords', () => {
      const keywords = generateKeywords();
      const uniqueKeywords = new Set(keywords);

      // Most keywords should be unique
      expect(uniqueKeywords.size).toBeGreaterThan(keywords.length * 0.5);
    });
  });

  describe('generateThumbnailText', () => {
    it('should generate text max 20 chars', () => {
      const text = generateThumbnailText();

      expect(text.length).toBeLessThanOrEqual(20);
      expect(text.length).toBeGreaterThan(0);
    });
  });

  describe('generateCTA', () => {
    it('should generate valid CTA phrase', () => {
      const cta = generateCTA();

      expect(typeof cta).toBe('string');
      expect(cta.length).toBeGreaterThan(0);
    });

    it('should return one of predefined CTAs', () => {
      const validCTAs = [
        'Subscribe for more!',
        'Check out the links below',
        'Visit my website',
        'Join my community',
        'Get the free guide',
        'Download the resource',
        'Sign up for updates',
        'Follow on social media'
      ];

      const cta = generateCTA();

      expect(validCTAs).toContain(cta);
    });
  });
});
