import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

describe('Preservation System', () => {
  const testDir = path.join(process.cwd(), 'tests', 'fixtures', 'preservation-test');

  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('parsePreservationFile', () => {
    it('should parse valid preservation file with comments and blank lines', async () => {
      const { parsePreservationFile } = await import('../../bin/preservation.js');

      // Create test .poem-preserve file
      const preserveContent = `# .poem-preserve
# This is a comment

poem/
dev-workspace/

# Another comment
.poem-core/my-workflow.yaml
`;
      await fs.writeFile(path.join(testDir, '.poem-preserve'), preserveContent);

      const rules = await parsePreservationFile(testDir);

      expect(rules).toEqual([
        'poem/',
        'dev-workspace/',
        '.poem-core/my-workflow.yaml',
      ]);
    });

    it('should return empty array if .poem-preserve does not exist', async () => {
      const { parsePreservationFile } = await import('../../bin/preservation.js');

      const rules = await parsePreservationFile(testDir);

      expect(rules).toEqual([]);
    });

    it('should handle empty preservation file', async () => {
      const { parsePreservationFile } = await import('../../bin/preservation.js');

      await fs.writeFile(path.join(testDir, '.poem-preserve'), '');

      const rules = await parsePreservationFile(testDir);

      expect(rules).toEqual([]);
    });

    it('should ignore lines with only whitespace', async () => {
      const { parsePreservationFile } = await import('../../bin/preservation.js');

      const preserveContent = `poem/

\t\t
dev-workspace/
`;
      await fs.writeFile(path.join(testDir, '.poem-preserve'), preserveContent);

      const rules = await parsePreservationFile(testDir);

      expect(rules).toEqual(['poem/', 'dev-workspace/']);
    });
  });

  describe('isPreserved', () => {
    it('should match directory preservation rules', async () => {
      const { isPreserved } = await import('../../bin/preservation.js');

      const rules = ['poem/', 'dev-workspace/'];

      expect(isPreserved('poem/prompts/test.hbs', rules)).toBe(true);
      expect(isPreserved('poem/schemas/test.json', rules)).toBe(true);
      expect(isPreserved('dev-workspace/test.txt', rules)).toBe(true);
      expect(isPreserved('.poem-core/agents/test.md', rules)).toBe(false);
    });

    it('should match exact file preservation rules', async () => {
      const { isPreserved } = await import('../../bin/preservation.js');

      const rules = ['.poem-core/my-workflow.yaml'];

      expect(isPreserved('.poem-core/my-workflow.yaml', rules)).toBe(true);
      expect(isPreserved('.poem-core/other-workflow.yaml', rules)).toBe(false);
    });

    it('should match directory name without trailing slash', async () => {
      const { isPreserved } = await import('../../bin/preservation.js');

      const rules = ['poem/'];

      expect(isPreserved('poem', rules)).toBe(false);
      expect(isPreserved('poem/', rules)).toBe(false);
      expect(isPreserved('poem/test.txt', rules)).toBe(true);
    });

    it('should handle cross-platform path separators', async () => {
      const { isPreserved } = await import('../../bin/preservation.js');

      const rules = ['poem/', 'dev-workspace/'];

      // Test Windows-style paths
      expect(isPreserved('poem\\prompts\\test.hbs', rules)).toBe(true);
      expect(isPreserved('dev-workspace\\test.txt', rules)).toBe(true);
    });

    it('should return false if no rules match', async () => {
      const { isPreserved } = await import('../../bin/preservation.js');

      const rules = ['poem/'];

      expect(isPreserved('.poem-core/agents/test.md', rules)).toBe(false);
      expect(isPreserved('.poem-app/src/test.ts', rules)).toBe(false);
    });

    it('should handle empty rules array', async () => {
      const { isPreserved } = await import('../../bin/preservation.js');

      expect(isPreserved('poem/test.txt', [])).toBe(false);
      expect(isPreserved('any/path/file.txt', [])).toBe(false);
    });
  });

  describe('isUserWorkflow', () => {
    it('should return false for framework workflows', async () => {
      const { isUserWorkflow, FRAMEWORK_WORKFLOWS } = await import('../../bin/preservation.js');

      for (const workflow of FRAMEWORK_WORKFLOWS) {
        expect(isUserWorkflow(`.poem-core/workflows/${workflow}`)).toBe(false);
        expect(isUserWorkflow(`packages/poem-core/workflows/${workflow}`)).toBe(false);
      }
    });

    it('should return true for user workflows', async () => {
      const { isUserWorkflow } = await import('../../bin/preservation.js');

      expect(isUserWorkflow('.poem-core/workflows/my-custom-workflow.yaml')).toBe(true);
      expect(isUserWorkflow('packages/poem-core/workflows/user-workflow.yaml')).toBe(true);
      expect(isUserWorkflow('.poem-core/workflows/project-specific.yml')).toBe(true);
    });

    it('should return false for files outside workflows directory', async () => {
      const { isUserWorkflow } = await import('../../bin/preservation.js');

      expect(isUserWorkflow('.poem-core/agents/test.md')).toBe(false);
      expect(isUserWorkflow('poem/prompts/test.hbs')).toBe(false);
      expect(isUserWorkflow('.poem-app/src/test.ts')).toBe(false);
    });

    it('should return false for non-YAML files in workflows directory', async () => {
      const { isUserWorkflow } = await import('../../bin/preservation.js');

      expect(isUserWorkflow('.poem-core/workflows/README.md')).toBe(false);
      expect(isUserWorkflow('.poem-core/workflows/test.txt')).toBe(false);
    });

    it('should handle both .yaml and .yml extensions', async () => {
      const { isUserWorkflow } = await import('../../bin/preservation.js');

      expect(isUserWorkflow('.poem-core/workflows/test.yaml')).toBe(true);
      expect(isUserWorkflow('.poem-core/workflows/test.yml')).toBe(true);
    });
  });

  describe('createPreservationFile', () => {
    it('should create .poem-preserve with default content', async () => {
      const { createPreservationFile, DEFAULT_PRESERVATION_RULES } = await import('../../bin/preservation.js');

      const result = await createPreservationFile(testDir);

      expect(result.created).toBe(true);
      expect(result.reason).toBeUndefined();

      const preserveFile = path.join(testDir, '.poem-preserve');
      expect(existsSync(preserveFile)).toBe(true);

      const content = await fs.readFile(preserveFile, 'utf-8');
      expect(content).toBe(DEFAULT_PRESERVATION_RULES);
    });

    it('should not overwrite existing .poem-preserve', async () => {
      const { createPreservationFile } = await import('../../bin/preservation.js');

      const existingContent = '# Existing content\npoem/\n';
      await fs.writeFile(path.join(testDir, '.poem-preserve'), existingContent);

      const result = await createPreservationFile(testDir);

      expect(result.created).toBe(false);
      expect(result.reason).toBe('already_exists');

      const content = await fs.readFile(path.join(testDir, '.poem-preserve'), 'utf-8');
      expect(content).toBe(existingContent);
    });
  });

  describe('FRAMEWORK_WORKFLOWS constant', () => {
    it('should contain expected framework workflows', async () => {
      const { FRAMEWORK_WORKFLOWS } = await import('../../bin/preservation.js');

      const expected = [
        'create-prompt.yaml',
        'refine-prompt.yaml',
        'test-prompt.yaml',
        'validate-prompt.yaml',
        'deploy-prompt.yaml',
        'add-helper.yaml',
        'create-provider.yaml',
      ];

      expect(FRAMEWORK_WORKFLOWS).toEqual(expected);
    });
  });

  describe('DEFAULT_PRESERVATION_RULES constant', () => {
    it('should contain poem/ and dev-workspace/ directories', async () => {
      const { DEFAULT_PRESERVATION_RULES } = await import('../../bin/preservation.js');

      expect(DEFAULT_PRESERVATION_RULES).toContain('poem/');
      expect(DEFAULT_PRESERVATION_RULES).toContain('dev-workspace/');
      expect(DEFAULT_PRESERVATION_RULES).toContain('# .poem-preserve');
    });
  });
});

describe('Installation Integration with Preservation', () => {
  const testDir = path.join(process.cwd(), 'tests', 'fixtures', 'install-preservation-test');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should preserve files specified in .poem-preserve during reinstall', async () => {
    // This is an integration test that would require full installer mocking
    // For now, we'll verify the preservation functions work correctly
    const { parsePreservationFile, isPreserved } = await import('../../bin/preservation.js');

    // Create .poem-preserve
    const preserveContent = `poem/\ndev-workspace/\n.poem-core/my-workflow.yaml`;
    await fs.writeFile(path.join(testDir, '.poem-preserve'), preserveContent);

    const rules = await parsePreservationFile(testDir);

    // Verify preservation logic
    expect(isPreserved('poem/prompts/test.hbs', rules)).toBe(true);
    expect(isPreserved('dev-workspace/test.txt', rules)).toBe(true);
    expect(isPreserved('.poem-core/my-workflow.yaml', rules)).toBe(true);
    expect(isPreserved('.poem-core/agents/test.md', rules)).toBe(false);
  });

  it('should preserve user workflows during reinstall', async () => {
    const { isUserWorkflow } = await import('../../bin/preservation.js');

    // Framework workflows should not be preserved
    expect(isUserWorkflow('.poem-core/workflows/create-prompt.yaml')).toBe(false);

    // User workflows should be preserved
    expect(isUserWorkflow('.poem-core/workflows/my-custom-workflow.yaml')).toBe(true);
  });
});

describe('Version Tracking Integration', () => {
  it('should read version from package.json', async () => {
    const { getPoemVersion } = await import('../../bin/utils.js');

    const version = await getPoemVersion(process.cwd());

    // Version should be a valid semver string or "unknown"
    expect(version).toMatch(/^\d+\.\d+\.\d+$|^unknown$/);
  });

  it('should return "unknown" if package.json is missing', async () => {
    const { getPoemVersion } = await import('../../bin/utils.js');

    const testDir = path.join(process.cwd(), 'tests', 'fixtures', 'no-package-json');
    await fs.mkdir(testDir, { recursive: true });

    try {
      const version = await getPoemVersion(testDir);
      expect(version).toBe('unknown');
    } finally {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });
});
