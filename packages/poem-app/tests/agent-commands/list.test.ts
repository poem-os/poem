import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('prompt-engineer agent *list command', () => {
  const agentPath = join(process.cwd(), '../../packages/poem-core/agents/prompt-engineer.md');
  let agentContent: string;

  try {
    agentContent = readFileSync(agentPath, 'utf-8');
  } catch (error) {
    agentContent = '';
  }

  describe('Command Description', () => {
    it('should document *list command in commands section', () => {
      const commandsMatch = agentContent.match(/commands:([\s\S]*?)(?=dependencies:|^```)/m);
      expect(commandsMatch).toBeTruthy();

      if (commandsMatch) {
        const section = commandsMatch[1];
        expect(section).toMatch(/list:/);
      }
    });

    it('should mention rich metadata in command description', () => {
      const commandsMatch = agentContent.match(/- list:(.*)/);
      expect(commandsMatch).toBeTruthy();

      if (commandsMatch) {
        const description = commandsMatch[1];
        expect(description).toMatch(/metadata|size|modified|table/i);
      }
    });
  });

  describe('Agent Behavior Documentation', () => {
    it('should have "Listing Prompts" section in Agent Behavior', () => {
      expect(agentContent).toMatch(/## Agent Behavior/);
      expect(agentContent).toMatch(/Listing Prompts.*\(`\*list`\)/);
    });

    it('should document reading directory with file stats', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/file stat|size|modified|KB/i);
      }
    });

    it('should document checking for schema files', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/schema.*directory|check.*schema/i);
      }
    });

    it('should document Markdown table format with required columns', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/table|column/i);
        // Check that all four column names are present
        expect(section).toMatch(/Name/);
        expect(section).toMatch(/Size/);
        expect(section).toMatch(/Modified/);
        expect(section).toMatch(/Has Schema/);
      }
    });

    it('should document optional filtering options', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/filter/i);
        expect(section).toMatch(/--with-schema|--no-schema/);
      }
    });

    it('should document name pattern filtering', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/name pattern|search.*term/i);
      }
    });

    it('should document empty directory handling', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/empty.*directory|no prompts found/i);
      }
    });

    it('should document total count display', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/total.*count|total.*X|Total:/i);
      }
    });
  });

  describe('Table Format Specification', () => {
    it('should specify Name column format', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/Name.*:.*filename.*without.*\.hbs|Name.*:.*Prompt filename/i);
      }
    });

    it('should specify Size column format (KB)', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/Size.*:.*KB|size in KB/i);
      }
    });

    it('should specify Modified column format (date)', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/Modified.*:.*date|modified date/i);
      }
    });

    it('should specify Has Schema column format (✓/✗)', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/Has Schema.*:.*✓.*✗|schema exists.*missing/i);
      }
    });
  });

  describe('Error Handling Documentation', () => {
    it('should provide helpful message for empty workspace', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        expect(section).toMatch(/No prompts found|empty.*directory/i);
        expect(section).toMatch(/\*new.*create.*first prompt/i);
      }
    });
  });

  describe('Filtering Options Documentation', () => {
    it('should document three filtering modes', () => {
      const listBehaviorMatch = agentContent.match(/Listing Prompts[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(listBehaviorMatch).toBeTruthy();

      if (listBehaviorMatch) {
        const section = listBehaviorMatch[0];
        // Should mention: name pattern, with-schema, no-schema
        const hasNamePattern = /name pattern|search.*term/i.test(section);
        const hasWithSchema = /--with-schema/.test(section);
        const hasNoSchema = /--no-schema/.test(section);

        expect(hasNamePattern).toBe(true);
        expect(hasWithSchema).toBe(true);
        expect(hasNoSchema).toBe(true);
      }
    });
  });
});
