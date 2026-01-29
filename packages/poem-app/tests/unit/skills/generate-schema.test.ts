import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('generate-schema skill', () => {
  const skillPath = join(process.cwd(), '../../packages/poem-core/skills/generate-schema.md');
  let skillContent: string;

  try {
    skillContent = readFileSync(skillPath, 'utf-8');
  } catch (error) {
    skillContent = '';
  }

  describe('Skill Document Structure', () => {
    it('should have H1 title', () => {
      expect(skillContent).toMatch(/^# Generate Schema/m);
    });

    it('should have description paragraph after title', () => {
      const lines = skillContent.split('\n');
      const titleIndex = lines.findIndex(line => line.startsWith('# Generate Schema'));
      expect(titleIndex).toBeGreaterThan(-1);
      const descLine = lines[titleIndex + 2];
      expect(descLine).toBeTruthy();
      expect(descLine.length).toBeGreaterThan(20);
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

    it('should have "Output Schema Extraction" section', () => {
      expect(skillContent).toMatch(/## Output Schema Extraction/);
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

    it('should describe contexts for schema generation', () => {
      const whenToUseMatch = skillContent.match(/## When to Use([\s\S]*?)(?=##|$)/);
      expect(whenToUseMatch).toBeTruthy();

      if (whenToUseMatch) {
        const section = whenToUseMatch[1];
        expect(section).toMatch(/schema|template|missing|new/i);
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

    it('should mention both input AND output schema extraction', () => {
      const whatItDoesMatch = skillContent.match(/## What It Does([\s\S]*?)(?=##|$)/);
      expect(whatItDoesMatch).toBeTruthy();

      if (whatItDoesMatch) {
        const section = whatItDoesMatch[1];
        expect(section).toMatch(/input.*schema/i);
        expect(section).toMatch(/output.*schema/i);
      }
    });
  });

  describe('"How It Works" Section Completeness', () => {
    it('should describe sequential process with numbered steps', () => {
      const howItWorksMatch = skillContent.match(/## How It Works([\s\S]*?)(?=##|$)/);
      expect(howItWorksMatch).toBeTruthy();

      if (howItWorksMatch) {
        const section = howItWorksMatch[1];
        const hasNumberedSteps = /^\d+\./gm.test(section);
        expect(hasNumberedSteps).toBe(true);
      }
    });

    it('should mention API call to extract endpoint', () => {
      const howItWorksMatch = skillContent.match(/## How It Works([\s\S]*?)(?=##|$)/);
      expect(howItWorksMatch).toBeTruthy();

      if (howItWorksMatch) {
        const section = howItWorksMatch[1];
        expect(section).toMatch(/api.*extract|POST.*extract/i);
      }
    });

    it('should mention parsing output format comments', () => {
      const howItWorksMatch = skillContent.match(/## How It Works([\s\S]*?)(?=##|$)/);
      expect(howItWorksMatch).toBeTruthy();

      if (howItWorksMatch) {
        const section = howItWorksMatch[1];
        expect(section).toMatch(/parse.*comment|comment.*output/i);
      }
    });

    it('should mention saving schemas to workspace', () => {
      const howItWorksMatch = skillContent.match(/## How It Works([\s\S]*?)(?=##|$)/);
      expect(howItWorksMatch).toBeTruthy();

      if (howItWorksMatch) {
        const section = howItWorksMatch[1];
        expect(section).toMatch(/save.*schema|schema.*directory/i);
      }
    });
  });

  describe('API Endpoint Documentation Accuracy', () => {
    it('should document POST /api/schema/extract endpoint', () => {
      const apiCallsMatch = skillContent.match(/## API Calls([\s\S]*?)(?=##|$)/);
      expect(apiCallsMatch).toBeTruthy();

      if (apiCallsMatch) {
        const section = apiCallsMatch[1];
        expect(section).toMatch(/POST.*\/api\/schema\/extract/);
      }
    });

    it('should describe what the API endpoint extracts', () => {
      const apiCallsMatch = skillContent.match(/## API Calls([\s\S]*?)(?=##|$)/);
      expect(apiCallsMatch).toBeTruthy();

      if (apiCallsMatch) {
        const section = apiCallsMatch[1];
        expect(section).toMatch(/extract|placeholder|helper|structure/i);
      }
    });
  });

  describe('"Output Schema Extraction" Section Completeness', () => {
    it('should have dedicated output schema extraction section', () => {
      const outputSchemaMatch = skillContent.match(/## Output Schema Extraction([\s\S]*?)(?=##|$)/);
      expect(outputSchemaMatch).toBeTruthy();
    });

    it('should document HTML comment format', () => {
      const outputSchemaMatch = skillContent.match(/## Output Schema Extraction([\s\S]*?)(?=##|$)/);
      expect(outputSchemaMatch).toBeTruthy();

      if (outputSchemaMatch) {
        const section = outputSchemaMatch[1];
        expect(section).toMatch(/<!--.*Expected Output/);
      }
    });

    it('should document Handlebars comment format', () => {
      const outputSchemaMatch = skillContent.match(/## Output Schema Extraction([\s\S]*?)(?=##|$)/);
      expect(outputSchemaMatch).toBeTruthy();

      if (outputSchemaMatch) {
        const section = outputSchemaMatch[1];
        expect(section).toMatch(/\{\{!.*Output Format/);
      }
    });

    it('should describe extraction process', () => {
      const outputSchemaMatch = skillContent.match(/## Output Schema Extraction([\s\S]*?)(?=##|$)/);
      expect(outputSchemaMatch).toBeTruthy();

      if (outputSchemaMatch) {
        const section = outputSchemaMatch[1];
        // Should have numbered extraction steps or process description
        const hasNumberedSteps = /^\d+\./gm.test(section);
        expect(hasNumberedSteps).toBe(true);
      }
    });

    it('should mention that output schemas are optional', () => {
      const outputSchemaMatch = skillContent.match(/## Output Schema Extraction([\s\S]*?)(?=##|$)/);
      expect(outputSchemaMatch).toBeTruthy();

      if (outputSchemaMatch) {
        const section = outputSchemaMatch[1];
        expect(section).toMatch(/optional/i);
      }
    });
  });

  describe('"Output Format" Section Completeness', () => {
    it('should include example output in code blocks', () => {
      const outputFormatMatch = skillContent.match(/## Output Format([\s\S]*?)(?=##|$)/);
      expect(outputFormatMatch).toBeTruthy();

      if (outputFormatMatch) {
        const section = outputFormatMatch[1];
        const codeBlocks = section.match(/```/g);
        expect(codeBlocks).toBeTruthy();
        expect(codeBlocks!.length).toBeGreaterThanOrEqual(2); // At least one opening and closing
      }
    });

    it('should show both scenarios (with and without output schema)', () => {
      const outputFormatMatch = skillContent.match(/## Output Format([\s\S]*?)(?=##|$)/);
      expect(outputFormatMatch).toBeTruthy();

      if (outputFormatMatch) {
        const section = outputFormatMatch[1];
        expect(section).toMatch(/Unified Schema Generated/);
        expect(section).toMatch(/Input Section|Output Section|without output/i);
      }
    });

    it('should mention file names for schemas', () => {
      const outputFormatMatch = skillContent.match(/## Output Format([\s\S]*?)(?=##|$)/);
      expect(outputFormatMatch).toBeTruthy();

      if (outputFormatMatch) {
        const section = outputFormatMatch[1];
        expect(section).toMatch(/\.json|-output\.json/);
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

    it('should show dual schema generation (input and output)', () => {
      const exampleUsageMatch = skillContent.match(/## Example Usage([\s\S]*?)(?=##|$)/);
      expect(exampleUsageMatch).toBeTruthy();

      if (exampleUsageMatch) {
        const section = exampleUsageMatch[1];
        expect(section).toMatch(/Unified Schema Generated/);
        expect(section).toMatch(/Input Section|Output Section/i);
      }
    });

    it('should show realistic conversation flow', () => {
      const exampleUsageMatch = skillContent.match(/## Example Usage([\s\S]*?)(?=##|$)/);
      expect(exampleUsageMatch).toBeTruthy();

      if (exampleUsageMatch) {
        const section = exampleUsageMatch[1];
        expect(section).toMatch(/```/);
        expect(section.length).toBeGreaterThan(300); // Meaningful example
      }
    });
  });

  describe('Markdown Format Correctness', () => {
    it('should have properly formatted headers', () => {
      const headers = skillContent.match(/^##? .+$/gm);
      expect(headers).toBeTruthy();

      if (headers) {
        headers.forEach(header => {
          expect(header).toMatch(/^#{1,2} [^ ]/);
        });
      }
    });

    it('should have consistent list formatting', () => {
      const lists = skillContent.match(/^- .+$/gm);
      if (lists && lists.length > 0) {
        lists.forEach(item => {
          expect(item).toMatch(/^- [^ ]/);
        });
      }
    });
  });
});
