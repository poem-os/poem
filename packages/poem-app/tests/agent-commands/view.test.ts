import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('prompt-engineer agent *view command', () => {
  const agentPath = join(process.cwd(), '../../packages/poem-core/agents/prompt-engineer.md');
  let agentContent: string;

  try {
    agentContent = readFileSync(agentPath, 'utf-8');
  } catch (error) {
    agentContent = '';
  }

  describe('Command Description', () => {
    it('should document *view command in commands section', () => {
      const commandsMatch = agentContent.match(/commands:([\s\S]*?)(?=dependencies:|^```)/m);
      expect(commandsMatch).toBeTruthy();

      if (commandsMatch) {
        const section = commandsMatch[1];
        expect(section).toMatch(/view:/);
      }
    });

    it('should mention rich metadata in command description', () => {
      const commandsMatch = agentContent.match(/- view:(.*)/);
      expect(commandsMatch).toBeTruthy();

      if (commandsMatch) {
        const description = commandsMatch[1];
        expect(description).toMatch(/metadata|size|modified|statistics|line count/i);
      }
    });

    it('should document usage pattern in command description', () => {
      const commandsMatch = agentContent.match(/- view:(.*)/);
      expect(commandsMatch).toBeTruthy();

      if (commandsMatch) {
        const description = commandsMatch[1];
        expect(description).toMatch(/usage.*<prompt-name>|\*view <prompt-name>/i);
      }
    });
  });

  describe('Agent Behavior Documentation', () => {
    it('should have "Viewing a Prompt" section in Agent Behavior', () => {
      expect(agentContent).toMatch(/## Agent Behavior/);
      expect(agentContent).toMatch(/Viewing a Prompt.*\(`\*view <prompt-name>`\)/);
    });

    it('should document reading template file from workspace', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Read.*template file.*\.hbs.*workspace/i);
      }
    });

    it('should document displaying template metadata', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/metadata/i);
        expect(section).toMatch(/Size.*KB/i);
        expect(section).toMatch(/Modified.*date/i);
        expect(section).toMatch(/Line Count/i);
      }
    });

    it('should document syntax highlighting for template content', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/syntax highlighting|code block.*handlebars/i);
      }
    });

    it('should document template statistics calculation', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/template statistics|Calculate.*display.*statistics/i);
        expect(section).toMatch(/Placeholder Count/i);
        expect(section).toMatch(/Helper Usage/i);
        expect(section).toMatch(/Conditional Blocks/i);
        expect(section).toMatch(/Loop Blocks/i);
      }
    });

    it('should document schema details display', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/schema.*file.*\.json.*exists|Read.*schema/i);
        expect(section).toMatch(/Field Count/i);
        expect(section).toMatch(/Required Fields/i);
        expect(section).toMatch(/Field Types/i);
      }
    });

    it('should document error handling for missing template', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/template not found|missing.*template/i);
        expect(section).toMatch(/Available prompts|Use.*\*list/i);
      }
    });

    it('should document error handling for missing schema', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/schema not found|No schema file found/i);
        expect(section).toMatch(/generate-schema/i);
      }
    });

    it('should document display sections order', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Display in formatted sections|Display.*sections:/i);
        expect(section).toMatch(/Template Metadata/i);
        expect(section).toMatch(/Template Content/i);
        expect(section).toMatch(/Template Statistics/i);
        expect(section).toMatch(/Schema Details/i);
      }
    });
  });

  describe('Template Metadata Specification', () => {
    it('should specify Size format (KB)', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Size.*:.*KB|size in KB/i);
      }
    });

    it('should specify Modified date format', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Modified.*:.*date|modified date/i);
      }
    });

    it('should specify Line Count', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Line Count.*:.*lines|Number of lines/i);
      }
    });
  });

  describe('Template Statistics Specification', () => {
    it('should calculate placeholder count', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Placeholder Count.*:.*placeholders/i);
      }
    });

    it('should list helper usage', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Helper Usage.*:.*helpers used|List.*helpers/i);
      }
    });

    it('should count conditional blocks', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Conditional Blocks.*:.*#if.*#unless|Count of.*#if/i);
      }
    });

    it('should count loop blocks', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Loop Blocks.*:.*#each|Count of.*#each/i);
      }
    });
  });

  describe('Schema Details Specification', () => {
    it('should display schema filename', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Schema File.*:.*Filename/i);
      }
    });

    it('should display field count', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Field Count.*:.*Number of fields/i);
      }
    });

    it('should list required fields', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Required Fields.*:.*List.*required/i);
      }
    });

    it('should summarize field types', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/Field Types.*:.*Summary.*types|types used/i);
      }
    });
  });

  describe('Error Handling Documentation', () => {
    it('should provide helpful suggestion when template not found', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/not found.*Available prompts|Use.*\*list/i);
      }
    });

    it('should provide helpful suggestion when schema not found', () => {
      const viewBehaviorMatch = agentContent.match(/Viewing a Prompt[\s\S]*?(?=\d+\. \*\*|$)/);
      expect(viewBehaviorMatch).toBeTruthy();

      if (viewBehaviorMatch) {
        const section = viewBehaviorMatch[0];
        expect(section).toMatch(/No schema.*found.*generate-schema/i);
      }
    });
  });
});
