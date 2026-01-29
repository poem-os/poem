import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

describe('Skills README', () => {
  const readmePath = join(process.cwd(), '../../packages/poem-core/skills/README.md');
  const skillsDir = join(process.cwd(), '../../packages/poem-core/skills');
  let readmeContent: string;
  let skillFiles: string[];

  try {
    readmeContent = readFileSync(readmePath, 'utf-8');
  } catch (error) {
    readmeContent = '';
  }

  try {
    skillFiles = readdirSync(skillsDir).filter(f => f.endsWith('.md') && f !== 'README.md');
  } catch (error) {
    skillFiles = [];
  }

  describe('README Structure', () => {
    it('should exist and have content', () => {
      expect(readmeContent).toBeTruthy();
      expect(readmeContent.length).toBeGreaterThan(100);
    });

    it('should have H1 title "POEM Skills"', () => {
      expect(readmeContent).toMatch(/^# POEM Skills/m);
    });

    it('should have "Overview" section', () => {
      expect(readmeContent).toMatch(/## Overview/);
    });

    it('should have "Skill vs Workflow Comparison" section', () => {
      expect(readmeContent).toMatch(/## Skill vs Workflow Comparison/);
    });

    it('should have "Available Skills" section', () => {
      expect(readmeContent).toMatch(/## Available Skills/);
    });

    it('should have "Skill Format" section', () => {
      expect(readmeContent).toMatch(/## Skill Format/);
    });

    it('should have "Creating New Skills" section', () => {
      expect(readmeContent).toMatch(/## Creating New Skills/);
    });

    it('should have "Testing Skills" section', () => {
      expect(readmeContent).toMatch(/## Testing Skills/);
    });
  });

  describe('Overview Section Completeness', () => {
    it('should explain what skills are', () => {
      const overviewMatch = readmeContent.match(/## Overview([\s\S]*?)(?=##|$)/);
      expect(overviewMatch).toBeTruthy();

      if (overviewMatch) {
        const section = overviewMatch[1];
        expect(section).toMatch(/What are Skills\?/);
        expect(section).toMatch(/When to Use Skills vs Workflows:/i);
      }
    });

    it('should describe skill vs workflow distinction', () => {
      const overviewMatch = readmeContent.match(/## Overview([\s\S]*?)(?=##|$)/);
      expect(overviewMatch).toBeTruthy();

      if (overviewMatch) {
        const section = overviewMatch[1];
        expect(section).toMatch(/workflow|single.*purpose|quick/i);
      }
    });
  });

  describe('Skill vs Workflow Comparison Table', () => {
    it('should include comparison table', () => {
      const comparisonMatch = readmeContent.match(/## Skill vs Workflow Comparison([\s\S]*?)(?=##|$)/);
      expect(comparisonMatch).toBeTruthy();

      if (comparisonMatch) {
        const section = comparisonMatch[1];
        expect(section).toMatch(/\|.*Aspect.*\|.*Skills.*\|.*Workflows.*\|/);
      }
    });

    it('should compare activation methods', () => {
      const comparisonMatch = readmeContent.match(/## Skill vs Workflow Comparison([\s\S]*?)(?=##|$)/);
      expect(comparisonMatch).toBeTruthy();

      if (comparisonMatch) {
        const section = comparisonMatch[1];
        expect(section).toMatch(/Activation.*automatic.*manual/is);
      }
    });

    it('should compare complexity levels', () => {
      const comparisonMatch = readmeContent.match(/## Skill vs Workflow Comparison([\s\S]*?)(?=##|$)/);
      expect(comparisonMatch).toBeTruthy();

      if (comparisonMatch) {
        const section = comparisonMatch[1];
        expect(section).toMatch(/Complexity.*single.*multi/is);
      }
    });
  });

  describe('Available Skills Table Completeness', () => {
    it('should include skills table with headers', () => {
      const availableMatch = readmeContent.match(/## Available Skills([\s\S]*?)(?=##|$)/);
      expect(availableMatch).toBeTruthy();

      if (availableMatch) {
        const section = availableMatch[1];
        expect(section).toMatch(/\|.*Skill.*\|.*File.*\|.*Purpose.*\|.*API Endpoints.*\|/);
      }
    });

    it('should list check-my-prompt skill', () => {
      const availableMatch = readmeContent.match(/## Available Skills([\s\S]*?)(?=##|$)/);
      expect(availableMatch).toBeTruthy();

      if (availableMatch) {
        const section = availableMatch[1];
        expect(section).toMatch(/check.*my.*prompt|check-my-prompt/i);
      }
    });

    it('should list preview-with-data skill', () => {
      const availableMatch = readmeContent.match(/## Available Skills([\s\S]*?)(?=##|$)/);
      expect(availableMatch).toBeTruthy();

      if (availableMatch) {
        const section = availableMatch[1];
        expect(section).toMatch(/preview.*with.*data|preview-with-data/i);
      }
    });

    it('should list generate-schema skill', () => {
      const availableMatch = readmeContent.match(/## Available Skills([\s\S]*?)(?=##|$)/);
      expect(availableMatch).toBeTruthy();

      if (availableMatch) {
        const section = availableMatch[1];
        expect(section).toMatch(/generate.*schema|generate-schema/i);
      }
    });

    it('should include API endpoints for each skill', () => {
      const availableMatch = readmeContent.match(/## Available Skills([\s\S]*?)(?=##|$)/);
      expect(availableMatch).toBeTruthy();

      if (availableMatch) {
        const section = availableMatch[1];
        expect(section).toMatch(/\/api\//);
      }
    });
  });

  describe('Skill Format Documentation', () => {
    it('should document all 8 required sections', () => {
      const formatMatch = readmeContent.match(/## Skill Format([\s\S]*?)(?=## Creating New Skills|$)/);
      expect(formatMatch).toBeTruthy();

      if (formatMatch) {
        const section = formatMatch[1];
        expect(section).toMatch(/Title.*H1/i);
        expect(section).toMatch(/Description.*Paragraph/i);
        expect(section).toMatch(/When to Use/);
        expect(section).toMatch(/What It Does/);
        expect(section).toMatch(/How It Works/);
        expect(section).toMatch(/API Calls/);
        expect(section).toMatch(/Output Format/);
        expect(section).toMatch(/Example Usage/);
      }
    });

    it('should provide examples for each section format', () => {
      const formatMatch = readmeContent.match(/## Skill Format([\s\S]*?)(?=## Creating New Skills|$)/);
      expect(formatMatch).toBeTruthy();

      if (formatMatch) {
        const section = formatMatch[1];
        // Should have multiple code blocks showing examples
        const codeBlocks = section.match(/```/g);
        expect(codeBlocks).toBeTruthy();
        expect(codeBlocks!.length).toBeGreaterThanOrEqual(10); // Multiple examples
      }
    });
  });

  describe('Creating New Skills Guidelines', () => {
    it('should include creation checklist', () => {
      expect(readmeContent).toMatch(/## Creating New Skills/);
      expect(readmeContent).toMatch(/checklist/i);
    });

    it('should explain when to create a skill', () => {
      expect(readmeContent).toMatch(/## Creating New Skills/);
      expect(readmeContent).toMatch(/When to Create/);
    });

    it('should document naming conventions', () => {
      expect(readmeContent).toMatch(/## Creating New Skills/);
      expect(readmeContent).toMatch(/Naming Conventions/);
      expect(readmeContent).toMatch(/kebab-case/);
    });

    it('should mention API-first principle', () => {
      expect(readmeContent).toMatch(/## Creating New Skills/);
      expect(readmeContent).toMatch(/API.*First|API.*endpoint/i);
    });
  });

  describe('Testing Skills Section', () => {
    it('should explain unit testing approach', () => {
      expect(readmeContent).toMatch(/## Testing Skills/);
      expect(readmeContent).toMatch(/Unit Testing/);
      expect(readmeContent).toMatch(/Vitest/i);
    });

    it('should explain manual testing approach', () => {
      expect(readmeContent).toMatch(/## Testing Skills/);
      expect(readmeContent).toMatch(/Manual Testing/);
      expect(readmeContent).toMatch(/Claude Code/);
    });

    it('should provide test location guidance', () => {
      expect(readmeContent).toMatch(/## Testing Skills/);
      expect(readmeContent).toMatch(/packages\/poem-app\/tests\/skills/);
    });
  });

  describe('Skills Table Accuracy', () => {
    it('should list all existing skill files', () => {
      if (skillFiles.length > 0) {
        skillFiles.forEach(skillFile => {
          const skillName = skillFile.replace('.md', '');
          // Check if skill is mentioned in README
          const kebabName = skillName;
          const displayName = skillName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const hasKebab = readmeContent.includes(kebabName);
          const hasDisplay = readmeContent.toLowerCase().includes(skillName.toLowerCase());
          expect(hasKebab || hasDisplay).toBe(true);
        });
      }
    });
  });

  describe('Markdown Format Correctness', () => {
    it('should have properly formatted headers', () => {
      const headers = readmeContent.match(/^##? .+$/gm);
      expect(headers).toBeTruthy();

      if (headers) {
        headers.forEach(header => {
          expect(header).toMatch(/^#{1,2} [^ ]/);
        });
      }
    });

    it('should have properly formatted tables', () => {
      const tables = readmeContent.match(/\|.*\|.*\|/g);
      if (tables && tables.length > 0) {
        // Tables should have consistent column separators
        tables.forEach(row => {
          expect(row).toMatch(/^\|.*\|$/);
        });
      }
    });
  });
});
