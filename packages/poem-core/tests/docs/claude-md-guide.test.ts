import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('claude-md-guide.md', () => {
  const guidePath = resolve(__dirname, '../../docs/claude-md-guide.md');
  const agentPaths = {
    victor: resolve(__dirname, '../../commands/agents/victor.md'),
    penny: resolve(__dirname, '../../commands/agents/penny.md'),
    felix: resolve(__dirname, '../../commands/agents/field-tester.md'),
  };

  it('should exist at expected path', () => {
    expect(existsSync(guidePath)).toBe(true);
  });

  describe('content validation', () => {
    let content: string;

    it('should be readable', () => {
      expect(() => {
        content = readFileSync(guidePath, 'utf-8');
      }).not.toThrow();
    });

    it('should contain all 3 agent names', () => {
      content = readFileSync(guidePath, 'utf-8');
      expect(content).toContain('Victor');
      expect(content).toContain('Penny');
      expect(content).toContain('Felix');
    });

    it('should contain agent table', () => {
      content = readFileSync(guidePath, 'utf-8');
      expect(content).toContain('| Agent | Persona | Role | Primary Use |');
      expect(content).toContain('**victor**');
      expect(content).toContain('**penny**');
      expect(content).toContain('**felix**');
    });

    describe('Victor agent section', () => {
      it('should have required fields', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('### Victor');
        expect(content).toContain('**Command**: `/poem/agents/victor`');
        expect(content).toContain('**Role**:');
        expect(content).toContain('**When to use**:');
        expect(content).toContain('**Key Commands**:');
      });

      it('should document 4 key commands', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('`*validate`');
        expect(content).toContain('`*regression`');
        expect(content).toContain('`*progress-report`');
        expect(content).toContain('`*capability-explorer');
      });

      it('should explain dual purpose (workflow testing + capability query)', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('Dual Purpose');
        expect(content).toContain('Workflow Testing');
        expect(content).toContain('Capability Query');
      });
    });

    describe('Penny agent section', () => {
      it('should have required fields', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('### Penny');
        expect(content).toContain('**Command**: `/poem/agents/penny`');
        expect(content).toContain('**Role**:');
        expect(content).toContain('**When to use**:');
        expect(content).toContain('**Key Commands**:');
      });

      it('should document 4 key commands', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('`*new`');
        expect(content).toContain('`*refine`');
        expect(content).toContain('`*test`');
        expect(content).toContain('`*validate`');
      });
    });

    describe('Felix agent section', () => {
      it('should have required fields', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('### Felix');
        expect(content).toContain('**Command**: `/poem/agents/felix`');
        expect(content).toContain('**Role**:');
        expect(content).toContain('**When to use**:');
        expect(content).toContain('**Key Commands**:');
      });

      it('should document 3 key commands', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('`*log-blocker`');
        expect(content).toContain('`*log-session`');
        expect(content).toContain('`*log-status`');
      });
    });

    describe('markdown formatting', () => {
      it('should have valid markdown structure', () => {
        content = readFileSync(guidePath, 'utf-8');

        // Should start with H1
        expect(content).toMatch(/^# POEM Agents/);

        // Should have multiple H2 sections
        const h2Count = (content.match(/^## /gm) || []).length;
        expect(h2Count).toBeGreaterThan(0);

        // Should have H3 sections for agents
        expect(content).toContain('### Victor');
        expect(content).toContain('### Penny');
        expect(content).toContain('### Felix');
      });

      it('should use proper markdown table syntax', () => {
        content = readFileSync(guidePath, 'utf-8');

        // Check table header
        expect(content).toMatch(/\| Agent \| Persona \| Role \| Primary Use \|/);

        // Check table separator
        expect(content).toMatch(/\|-------|---------|------|-------------|/);
      });

      it('should use code blocks for commands', () => {
        content = readFileSync(guidePath, 'utf-8');

        // Commands should be in backticks
        expect(content).toContain('`*validate`');
        expect(content).toContain('`*new`');
        expect(content).toContain('`*log-blocker`');
      });

      it('should use bold for important labels', () => {
        content = readFileSync(guidePath, 'utf-8');

        expect(content).toContain('**Command**:');
        expect(content).toContain('**Role**:');
        expect(content).toContain('**When to use**:');
        expect(content).toContain('**Key Commands**:');
      });
    });

    describe('content consistency with agent definitions', () => {
      it('should match Victor agent definition', () => {
        const guideContent = readFileSync(guidePath, 'utf-8');
        const victorDef = readFileSync(agentPaths.victor, 'utf-8');

        // Victor should be described as Workflow Validator
        expect(guideContent).toContain('Workflow Validator');
        expect(victorDef).toContain('workflow-validator');

        // Should mention capability-explorer (Story 3.9 feature)
        expect(guideContent).toContain('capability-explorer');
        expect(victorDef).toContain('capability-explorer');
      });

      it('should match Penny agent definition', () => {
        const guideContent = readFileSync(guidePath, 'utf-8');
        const pennyDef = readFileSync(agentPaths.penny, 'utf-8');

        // Penny should be described as Prompt Engineer
        expect(guideContent).toContain('Prompt Engineer');
        expect(pennyDef).toContain('prompt-engineer');

        // Should mention key workflows
        expect(guideContent).toContain('new');
        expect(pennyDef).toContain('new-prompt.yaml');
      });

      it('should match Felix agent definition', () => {
        const guideContent = readFileSync(guidePath, 'utf-8');
        const felixDef = readFileSync(agentPaths.felix, 'utf-8');

        // Felix should be described as Field Testing Observer
        expect(guideContent).toContain('Field Testing Observer');
        expect(felixDef).toContain('field-tester');

        // Should mention blocker logging
        expect(guideContent).toContain('log-blocker');
        expect(felixDef).toContain('log-blocker');
      });
    });

    describe('copy-paste readiness', () => {
      it('should have a clear "copy-paste" section delimiter', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('Copy-Paste Ready Section');
      });

      it('should provide usage tips', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('Usage Tips');
      });

      it('should explain why to add to CLAUDE.md', () => {
        content = readFileSync(guidePath, 'utf-8');
        expect(content).toContain('Why Add This to CLAUDE.md');
      });
    });
  });
});
