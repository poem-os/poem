import { describe, it, expect, beforeEach } from 'vitest';
import { HandlebarsService } from '../../../../src/services/handlebars/index.js';
import dateFormat from '../../../../src/services/handlebars/helpers/dateFormat.js';

describe('dateFormat helper', () => {
  let service: HandlebarsService;

  beforeEach(() => {
    service = new HandlebarsService();
    service.registerHelper('dateFormat', dateFormat, {
      description: dateFormat.description,
      example: dateFormat.example,
    });
  });

  describe('basic functionality', () => {
    it('should format date with YYYY-MM-DD', () => {
      const date = new Date(2025, 11, 28); // Dec 28, 2025
      const result = service.render('{{dateFormat date "YYYY-MM-DD"}}', { date });
      expect(result).toBe('2025-12-28');
    });

    it('should format date with MM/DD/YYYY', () => {
      const date = new Date(2025, 11, 28);
      const result = service.render('{{dateFormat date "MM/DD/YYYY"}}', { date });
      expect(result).toBe('12/28/2025');
    });

    it('should format date with time', () => {
      const date = new Date(2025, 11, 28, 14, 30, 45);
      const result = service.render('{{dateFormat date "YYYY-MM-DD HH:mm:ss"}}', { date });
      expect(result).toBe('2025-12-28 14:30:45');
    });

    it('should pad single digit values', () => {
      const date = new Date(2025, 0, 5, 9, 5, 3); // Jan 5, 2025 09:05:03
      const result = service.render('{{dateFormat date "YYYY-MM-DD HH:mm:ss"}}', { date });
      expect(result).toBe('2025-01-05 09:05:03');
    });
  });

  describe('input types', () => {
    it('should accept ISO string', () => {
      const result = service.render('{{dateFormat date "YYYY-MM-DD"}}', {
        date: '2025-12-28T00:00:00.000Z',
      });
      // Note: result depends on timezone, but should be a valid date
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should accept timestamp', () => {
      const timestamp = new Date(2025, 11, 28).getTime();
      const result = service.render('{{dateFormat date "YYYY-MM-DD"}}', { date: timestamp });
      expect(result).toBe('2025-12-28');
    });

    it('should use default format if not provided', () => {
      const date = new Date(2025, 11, 28);
      const result = service.render('{{dateFormat date}}', { date });
      expect(result).toBe('2025-12-28');
    });
  });

  describe('edge cases', () => {
    it('should handle null', () => {
      const result = service.render('{{dateFormat date "YYYY-MM-DD"}}', { date: null });
      expect(result).toBe('');
    });

    it('should handle undefined', () => {
      const result = service.render('{{dateFormat date "YYYY-MM-DD"}}', { date: undefined });
      expect(result).toBe('');
    });

    it('should handle invalid date string', () => {
      const result = service.render('{{dateFormat date "YYYY-MM-DD"}}', { date: 'not-a-date' });
      expect(result).toBe('');
    });

    it('should handle empty format string', () => {
      const date = new Date(2025, 11, 28);
      const result = service.render('{{dateFormat date ""}}', { date });
      expect(result).toBe('2025-12-28'); // Uses default
    });
  });

  describe('format tokens', () => {
    const testDate = new Date(2025, 5, 15, 8, 30, 45); // June 15, 2025 08:30:45

    it('should format YYYY correctly', () => {
      expect(dateFormat(testDate, 'YYYY')).toBe('2025');
    });

    it('should format MM correctly', () => {
      expect(dateFormat(testDate, 'MM')).toBe('06');
    });

    it('should format DD correctly', () => {
      expect(dateFormat(testDate, 'DD')).toBe('15');
    });

    it('should format HH correctly', () => {
      expect(dateFormat(testDate, 'HH')).toBe('08');
    });

    it('should format mm correctly', () => {
      expect(dateFormat(testDate, 'mm')).toBe('30');
    });

    it('should format ss correctly', () => {
      expect(dateFormat(testDate, 'ss')).toBe('45');
    });
  });

  describe('direct function calls', () => {
    it('should work when called directly', () => {
      const date = new Date(2025, 11, 28);
      expect(dateFormat(date, 'YYYY-MM-DD')).toBe('2025-12-28');
    });

    it('should return empty string for null', () => {
      expect(dateFormat(null, 'YYYY-MM-DD')).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(dateFormat(undefined, 'YYYY-MM-DD')).toBe('');
    });
  });

  describe('metadata', () => {
    it('should have description', () => {
      expect(dateFormat.description).toBeDefined();
      expect(typeof dateFormat.description).toBe('string');
    });

    it('should have example', () => {
      expect(dateFormat.example).toBeDefined();
      expect(typeof dateFormat.example).toBe('string');
    });
  });
});
