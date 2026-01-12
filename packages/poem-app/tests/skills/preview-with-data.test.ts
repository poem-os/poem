import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('preview-with-data skill', () => {
  const skillPath = join(process.cwd(), '../../packages/poem-core/skills/preview-with-data.md');
  let skillContent: string;

  try {
    skillContent = readFileSync(skillPath, 'utf-8');
  } catch (error) {
    skillContent = '';
  }

  describe('Skill Document Structure', () => {
    it('should have H1 title', () => {
      expect(skillContent).toMatch(/^# Preview with Data/m);
    });

    it('should have description paragraph after title', () => {
      const lines = skillContent.split('\n');
      const titleIndex = lines.findIndex(line => line.startsWith('# Preview with Data'));
      expect(titleIndex).toBeGreaterThan(-1);
      // Skip empty line, description should be on line after title
      const descLine = lines[titleIndex + 2];
      expect(descLine).toBeTruthy();
      expect(descLine.length).toBeGreaterThan(20); // Meaningful description
    });

    it('should have "When to Use" section', () => {
      expect(skillContent).toMatch(/## When to Use/);
    });

    it('should have "What It Does" section', () => {
      expect(skillContent).toMatch(/## What It Does/);
    });

    it('should have "How It Works" section', () => {
      expect(skillContent).toMatch(/## How It Works/);
    });

    it('should have "API Calls" section', () => {
      expect(skillContent).toMatch(/## API Calls/);
    });

    it('should have "Output Format" section', () => {
      expect(skillContent).toMatch(/## Output Format/);
    });

    it('should have "Example Usage" section', () => {
      expect(skillContent).toMatch(/## Example Usage/);
    });
  });

  describe('"When to Use" Section Completeness', () => {
    it('should list multiple use cases (at least 3)', () => {
      const whenToUseMatch = skillContent.match(/## When to Use([\s\S]*?)(?=##|$)/);
      expect(whenToUseMatch).toBeTruthy();

      if (whenToUseMatch) {
        const section = whenToUseMatch[1];
        const bulletPoints = section.match(/^- /gm);
        expect(bulletPoints).toBeTruthy();
        expect(bulletPoints!.length).toBeGreaterThanOrEqual(3);
      }
    });

    it('should describe contexts for skill activation', () => {
      const whenToUseMatch = skillContent.match(/## When to Use([\s\S]*?)(?=##|$)/);
      expect(whenToUseMatch).toBeTruthy();

      if (whenToUseMatch) {
        const section = whenToUseMatch[1];
        expect(section).toMatch(/preview|render|test|debug|verify/i);
      }
    });
  });

  describe('"What It Does" Section Completeness', () => {
    it('should list numbered steps (at least 2)', () => {
      const whatItDoesMatch = skillContent.match(/## What It Does([\s\S]*?)(?=##|$)/);
      expect(whatItDoesMatch).toBeTruthy();

      if (whatItDoesMatch) {
        const section = whatItDoesMatch[1];
        const numberedItems = section.match(/^\d+\./gm);
        expect(numberedItems).toBeTruthy();
        expect(numberedItems!.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('should mention rendering with data', () => {
      const whatItDoesMatch = skillContent.match(/## What It Does([\s\S]*?)(?=##|$)/);
      expect(whatItDoesMatch).toBeTruthy();

      if (whatItDoesMatch) {
        const section = whatItDoesMatch[1];
        expect(section).toMatch(/render|data|output/i);
      }
    });
  });

  describe('"How It Works" Section Completeness', () => {
    it('should describe sequential process', () => {
      const howItWorksMatch = skillContent.match(/## How It Works([\s\S]*?)(?=##|$)/);
      expect(howItWorksMatch).toBeTruthy();

      if (howItWorksMatch) {
        const section = howItWorksMatch[1];
        // Should have numbered steps or sequential language
        const hasNumberedSteps = /^\d+\./gm.test(section);
        expect(hasNumberedSteps).toBe(true);
      }
    });

    it('should mention API call', () => {
      const howItWorksMatch = skillContent.match(/## How It Works([\s\S]*?)(?=##|$)/);
      expect(howItWorksMatch).toBeTruthy();

      if (howItWorksMatch) {
        const section = howItWorksMatch[1];
        expect(section).toMatch(/api|endpoint|call|POST/i);
      }
    });
  });

  describe('API Endpoint Documentation Accuracy', () => {
    it('should document POST /api/prompt/render endpoint', () => {
      const apiCallsMatch = skillContent.match(/## API Calls([\s\S]*?)(?=##|$)/);
      expect(apiCallsMatch).toBeTruthy();

      if (apiCallsMatch) {
        const section = apiCallsMatch[1];
        expect(section).toMatch(/POST.*\/api\/prompt\/render/);
      }
    });

    it('should describe what the API endpoint does', () => {
      const apiCallsMatch = skillContent.match(/## API Calls([\s\S]*?)(?=##|$)/);
      expect(apiCallsMatch).toBeTruthy();

      if (apiCallsMatch) {
        const section = apiCallsMatch[1];
        // Should have description after endpoint
        expect(section).toMatch(/render.*template|template.*render/i);
      }
    });
  });

  describe('"Output Format" Section Completeness', () => {
    it('should include example output in code block', () => {
      const outputFormatMatch = skillContent.match(/## Output Format([\s\S]*?)(?=##|$)/);
      expect(outputFormatMatch).toBeTruthy();

      if (outputFormatMatch) {
        const section = outputFormatMatch[1];
        expect(section).toMatch(/```/);
      }
    });

    it('should show structured output format', () => {
      const outputFormatMatch = skillContent.match(/## Output Format([\s\S]*?)(?=##|$)/);
      expect(outputFormatMatch).toBeTruthy();

      if (outputFormatMatch) {
        const section = outputFormatMatch[1];
        expect(section).toMatch(/Preview|Rendered|Output|Metadata/);
      }
    });
  });

  describe('"Example Usage" Section Completeness', () => {
    it('should include user context', () => {
      const exampleUsageMatch = skillContent.match(/## Example Usage([\s\S]*?)(?=##|$)/);
      expect(exampleUsageMatch).toBeTruthy();

      if (exampleUsageMatch) {
        const section = exampleUsageMatch[1];
        expect(section).toMatch(/\*\*User context\*\*/);
      }
    });

    it('should include skill activation phrase', () => {
      const exampleUsageMatch = skillContent.match(/## Example Usage([\s\S]*?)(?=##|$)/);
      expect(exampleUsageMatch).toBeTruthy();

      if (exampleUsageMatch) {
        const section = exampleUsageMatch[1];
        expect(section).toMatch(/\*\*Skill activation\*\*/);
      }
    });

    it('should include skill response', () => {
      const exampleUsageMatch = skillContent.match(/## Example Usage([\s\S]*?)(?=##|$)/);
      expect(exampleUsageMatch).toBeTruthy();

      if (exampleUsageMatch) {
        const section = exampleUsageMatch[1];
        expect(section).toMatch(/\*\*Skill response\*\*/);
      }
    });

    it('should show realistic conversation flow', () => {
      const exampleUsageMatch = skillContent.match(/## Example Usage([\s\S]*?)(?=##|$)/);
      expect(exampleUsageMatch).toBeTruthy();

      if (exampleUsageMatch) {
        const section = exampleUsageMatch[1];
        // Should have code block with example output
        expect(section).toMatch(/```/);
        expect(section.length).toBeGreaterThan(200); // Meaningful example
      }
    });
  });

  describe('Markdown Format Correctness', () => {
    it('should have properly formatted headers (no extra spaces)', () => {
      const headers = skillContent.match(/^##? .+$/gm);
      expect(headers).toBeTruthy();

      if (headers) {
        headers.forEach(header => {
          // Headers should not have extra spaces after #
          expect(header).toMatch(/^#{1,2} [^ ]/);
        });
      }
    });

    it('should have consistent list formatting', () => {
      const lists = skillContent.match(/^- .+$/gm);
      if (lists && lists.length > 0) {
        lists.forEach(item => {
          // List items should have space after dash
          expect(item).toMatch(/^- [^ ]/);
        });
      }
    });
  });
});
