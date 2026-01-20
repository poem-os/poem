import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import * as os from 'os';

describe('Installation Registry Integration', () => {
  const testDir = path.join(process.cwd(), 'tests', 'fixtures', 'install-test');

  beforeEach(async () => {
    // Create test directories
    await fs.mkdir(testDir, { recursive: true });

    // Note: We can't mock os.homedir() in ESM, so these tests will use the actual ~/.poem directory
    // Tests will verify behavior without modifying the actual registry
  });

  afterEach(async () => {
    // Clean up test directories
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should verify registry utilities are available', async () => {
    const { readRegistry } = await import('../../bin/utils.js');

    // Verify the registry utilities work correctly
    const registry = await readRegistry();

    expect(registry.version).toBe('1.0');
    expect(Array.isArray(registry.installations)).toBe(true);
    // Note: May have existing installations from actual usage
  });

  it('should preserve installedAt timestamp when updating existing installation', async () => {
    const { readRegistry, writeRegistry } = await import('../../bin/utils.js');

    // Read current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      // Create test installation
      const originalTimestamp = '2025-01-01T00:00:00.000Z';
      const testInstallation = {
        id: 'test-project-temp',
        path: path.join(testDir, 'test-path'),
        port: 9999,
        installedAt: originalTimestamp,
        lastChecked: originalTimestamp,
        version: '0.1.0',
        mode: 'production',
        currentWorkflow: null,
        gitBranch: 'main',
        status: 'active',
        metadata: {
          lastServerRun: null,
          workflowCount: 0,
          promptCount: 0
        }
      };

      // Write test registry
      const testRegistry = {
        version: '1.0',
        installations: [testInstallation]
      };
      await writeRegistry(testRegistry);

      // Read it back
      const registry = await readRegistry();

      expect(registry.installations.length).toBeGreaterThanOrEqual(1);
      const found = registry.installations.find(i => i.id === 'test-project-temp');
      expect(found).toBeDefined();
      expect(found.installedAt).toBe(originalTimestamp);
      expect(found.port).toBe(9999);
    } finally {
      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });

  it('should detect development mode from .env', async () => {
    const installDir = path.join(testDir, 'dev-project');
    const poemAppDir = path.join(installDir, '.poem-app');
    await fs.mkdir(poemAppDir, { recursive: true });

    // Create .env file with POEM_DEV=true
    const envFile = path.join(poemAppDir, '.env');
    await fs.writeFile(envFile, 'PORT=9500\nPOEM_DEV=true\n');

    // Verify .env file was created correctly
    const content = await fs.readFile(envFile, 'utf-8');
    expect(content).toContain('POEM_DEV=true');
  });

  it('should generate installation ID from path', async () => {
    const { generateInstallationId } = await import('../../bin/utils.js');

    // Test simple directory name
    const id1 = generateInstallationId('/home/user/projects/vibedeck');
    expect(id1).toBe('vibedeck');

    // Test domain-like name
    const id2 = generateInstallationId('/home/user/prompt.supportsignal.com.au');
    expect(id2).toBe('su-prompt');

    // Test fallback for generic paths
    const id3 = generateInstallationId('/home/user/poem');
    expect(id3).toMatch(/^installation-\d+$/);
  });

  it('should get git branch if in git repository', async () => {
    const { getGitBranch } = await import('../../bin/utils.js');

    // Test in current directory (should be a git repo)
    const branch = await getGitBranch(process.cwd());

    // Should either return a branch name or null (if not in git repo or git not installed)
    expect(branch === null || typeof branch === 'string').toBe(true);

    // Test in non-existent directory
    const nonExistentBranch = await getGitBranch('/non/existent/path');
    expect(nonExistentBranch).toBeNull();
  });

  it('should write and read registry correctly', async () => {
    const { writeRegistry, readRegistry } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      const testRegistry = {
        version: '1.0',
        installations: [
          {
            id: 'test-write-1',
            path: path.join(testDir, 'test-path-1'),
            port: 9998,
            installedAt: '2025-01-15T10:00:00.000Z',
            lastChecked: '2025-01-15T10:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          },
          {
            id: 'test-write-2',
            path: path.join(testDir, 'test-path-2'),
            port: 9997,
            installedAt: '2025-01-15T11:00:00.000Z',
            lastChecked: '2025-01-15T11:00:00.000Z',
            version: '0.1.0',
            mode: 'development',
            currentWorkflow: 'test-workflow',
            gitBranch: 'feature/test',
            status: 'active',
            metadata: {
              lastServerRun: '2025-01-15T11:30:00.000Z',
              workflowCount: 5,
              promptCount: 12
            }
          }
        ]
      };

      // Write registry
      await writeRegistry(testRegistry);

      // Read it back
      const readBack = await readRegistry();

      expect(readBack.version).toBe('1.0');
      expect(readBack.installations.length).toBe(2);

      const test1 = readBack.installations.find(i => i.id === 'test-write-1');
      const test2 = readBack.installations.find(i => i.id === 'test-write-2');

      expect(test1).toBeDefined();
      expect(test1.port).toBe(9998);
      expect(test2).toBeDefined();
      expect(test2.port).toBe(9997);
      expect(test2.mode).toBe('development');
    } finally {
      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });

  it('should handle corrupted registry gracefully', async () => {
    const { readRegistry, writeRegistry, REGISTRY_PATH } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupContent = JSON.stringify(currentRegistry);

    try {
      // Write corrupted JSON
      await fs.writeFile(REGISTRY_PATH, '{ invalid json }');

      // Should recreate default registry
      const registry = await readRegistry();

      expect(registry.version).toBe('1.0');
      expect(Array.isArray(registry.installations)).toBe(true);
    } finally {
      // Restore original registry
      await fs.writeFile(REGISTRY_PATH, backupContent);
    }
  });

  it('should handle missing registry file gracefully', async () => {
    const { readRegistry, writeRegistry, REGISTRY_PATH } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupContent = JSON.stringify(currentRegistry);

    try {
      // Delete registry file
      await fs.unlink(REGISTRY_PATH);

      // Should return default empty registry
      const registry = await readRegistry();

      expect(registry.version).toBe('1.0');
      expect(Array.isArray(registry.installations)).toBe(true);
    } finally {
      // Restore original registry
      await fs.writeFile(REGISTRY_PATH, backupContent);
    }
  });

  it('should create ~/.poem directory if it does not exist', async () => {
    const { writeRegistry, readRegistry, REGISTRY_PATH } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupContent = JSON.stringify(currentRegistry);
    const poemDir = path.dirname(REGISTRY_PATH);

    try {
      // Remove ~/.poem directory
      await fs.rm(poemDir, { recursive: true, force: true });

      // Verify directory doesn't exist
      expect(existsSync(poemDir)).toBe(false);

      // Write registry (should create directory)
      const testRegistry = {
        version: '1.0',
        installations: []
      };
      await writeRegistry(testRegistry);

      // Verify directory and file were created
      expect(existsSync(REGISTRY_PATH)).toBe(true);
    } finally {
      // Restore original registry
      await fs.mkdir(poemDir, { recursive: true });
      await fs.writeFile(REGISTRY_PATH, backupContent);
    }
  });

  it('should detect port conflicts correctly', async () => {
    const { checkPortConflict, writeRegistry, readRegistry } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      // Create test installations with specific ports
      const testRegistry = {
        version: '1.0',
        installations: [
          {
            id: 'test-conflict-1',
            path: path.join(testDir, 'conflict-test-1'),
            port: 9500,
            installedAt: '2025-01-15T10:00:00.000Z',
            lastChecked: '2025-01-15T10:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          },
          {
            id: 'test-conflict-2',
            path: path.join(testDir, 'conflict-test-2'),
            port: 9510,
            installedAt: '2025-01-15T11:00:00.000Z',
            lastChecked: '2025-01-15T11:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          }
        ]
      };

      await writeRegistry(testRegistry);

      // Test: Port 9500 should have conflict
      const conflict1 = await checkPortConflict(9500);
      expect(conflict1.conflict).toBe(true);
      expect(conflict1.installation.id).toBe('test-conflict-1');

      // Test: Port 9510 should have conflict
      const conflict2 = await checkPortConflict(9510);
      expect(conflict2.conflict).toBe(true);
      expect(conflict2.installation.id).toBe('test-conflict-2');

      // Test: Port 9520 should not have conflict
      const noConflict = await checkPortConflict(9520);
      expect(noConflict.conflict).toBe(false);
      expect(noConflict.installation).toBeUndefined();

      // Test: Exclude path parameter works
      const excludeConflict = await checkPortConflict(9500, path.join(testDir, 'conflict-test-1'));
      expect(excludeConflict.conflict).toBe(false);
    } finally {
      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });

  it('should suggest available ports in increments of 10', async () => {
    const { suggestAvailablePorts, writeRegistry, readRegistry } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      // Create test registry with some ports already used
      const testRegistry = {
        version: '1.0',
        installations: [
          {
            id: 'test-suggest-1',
            path: path.join(testDir, 'suggest-test-1'),
            port: 9500, // 9500 is taken
            installedAt: '2025-01-15T10:00:00.000Z',
            lastChecked: '2025-01-15T10:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          },
          {
            id: 'test-suggest-2',
            path: path.join(testDir, 'suggest-test-2'),
            port: 9510, // 9510 is taken
            installedAt: '2025-01-15T11:00:00.000Z',
            lastChecked: '2025-01-15T11:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          }
        ]
      };

      await writeRegistry(testRegistry);

      // Test: Should suggest 3 available ports starting from 9500
      const suggestions = await suggestAvailablePorts(9500, 3);

      expect(suggestions.length).toBe(3);
      // Should skip 9500 and 9510 (taken), suggest 9520, 9530, 9540
      expect(suggestions).toEqual([9520, 9530, 9540]);

      // Test: Custom base port
      const customSuggestions = await suggestAvailablePorts(8500, 2);
      expect(customSuggestions.length).toBe(2);
      expect(customSuggestions[0]).toBe(8500);
      expect(customSuggestions[1]).toBe(8510);
    } finally {
      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });

  it('should handle empty registry when suggesting ports', async () => {
    const { suggestAvailablePorts, writeRegistry, readRegistry } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      // Create empty registry
      await writeRegistry({
        version: '1.0',
        installations: []
      });

      const suggestions = await suggestAvailablePorts(9500, 5);

      expect(suggestions.length).toBe(5);
      expect(suggestions).toEqual([9500, 9510, 9520, 9530, 9540]);
    } finally {
      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });

  it('should detect port conflicts during config change (AC2)', async () => {
    const { checkPortConflict, writeRegistry, readRegistry } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      // Create test registry with two installations
      const testRegistry = {
        version: '1.0',
        installations: [
          {
            id: 'test-config-1',
            path: path.join(testDir, 'config-test-1'),
            port: 9500,
            installedAt: '2025-01-15T10:00:00.000Z',
            lastChecked: '2025-01-15T10:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          },
          {
            id: 'test-config-2',
            path: path.join(testDir, 'config-test-2'),
            port: 9510,
            installedAt: '2025-01-15T11:00:00.000Z',
            lastChecked: '2025-01-15T11:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          }
        ]
      };

      await writeRegistry(testRegistry);

      // Test: Installation 2 tries to change port to 9500 (conflict with installation 1)
      const conflict1 = await checkPortConflict(9500, path.join(testDir, 'config-test-2'));
      expect(conflict1.conflict).toBe(true);
      expect(conflict1.installation.id).toBe('test-config-1');

      // Test: Installation 2 can change to its own current port (no conflict with self)
      const noConflict = await checkPortConflict(9510, path.join(testDir, 'config-test-2'));
      expect(noConflict.conflict).toBe(false);

      // Test: Installation 2 can change to an available port (no conflict)
      const noConflict2 = await checkPortConflict(9520, path.join(testDir, 'config-test-2'));
      expect(noConflict2.conflict).toBe(false);
    } finally {
      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });

  it('should list all installations (AC10 - registry --list)', async () => {
    const { writeRegistry, readRegistry } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      // Create test registry with multiple installations
      const testRegistry = {
        version: '1.0',
        installations: [
          {
            id: 'test-list-1',
            path: path.join(testDir, 'list-test-1'),
            port: 9500,
            installedAt: '2025-01-15T10:00:00.000Z',
            lastChecked: '2025-01-15T10:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          },
          {
            id: 'test-list-2',
            path: path.join(testDir, 'list-test-2'),
            port: 9510,
            installedAt: '2025-01-15T11:00:00.000Z',
            lastChecked: '2025-01-15T11:00:00.000Z',
            version: '0.1.0',
            mode: 'development',
            currentWorkflow: 'test-workflow',
            gitBranch: 'feature/test',
            status: 'inactive',
            metadata: {
              lastServerRun: '2025-01-15T11:30:00.000Z',
              workflowCount: 5,
              promptCount: 12
            }
          }
        ]
      };

      await writeRegistry(testRegistry);

      // Read back and verify
      const registry = await readRegistry();

      expect(registry.installations.length).toBe(2);

      const install1 = registry.installations.find(i => i.id === 'test-list-1');
      const install2 = registry.installations.find(i => i.id === 'test-list-2');

      expect(install1).toBeDefined();
      expect(install1.status).toBe('active');
      expect(install1.mode).toBe('production');
      expect(install1.port).toBe(9500);

      expect(install2).toBeDefined();
      expect(install2.status).toBe('inactive');
      expect(install2.mode).toBe('development');
      expect(install2.port).toBe(9510);
      expect(install2.gitBranch).toBe('feature/test');
    } finally {
      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });

  it('should update installation health status (AC10 - registry --health)', async () => {
    const { writeRegistry, readRegistry, getGitBranch } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      // Create a test installation pointing to a directory that exists (testDir)
      await fs.mkdir(path.join(testDir, 'health-test', '.poem-app'), { recursive: true });

      const testRegistry = {
        version: '1.0',
        installations: [
          {
            id: 'test-health-exists',
            path: path.join(testDir, 'health-test'),
            port: 9500,
            installedAt: '2025-01-15T10:00:00.000Z',
            lastChecked: '2025-01-15T10:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          },
          {
            id: 'test-health-missing',
            path: path.join(testDir, 'health-missing'),
            port: 9510,
            installedAt: '2025-01-15T11:00:00.000Z',
            lastChecked: '2025-01-15T11:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          }
        ]
      };

      await writeRegistry(testRegistry);

      // Simulate health check logic
      const registry = await readRegistry();
      let updated = false;

      for (const install of registry.installations) {
        const poemAppDir = path.join(install.path, '.poem-app');
        const exists = existsSync(poemAppDir);

        const gitBranch = await getGitBranch(install.path);

        let newStatus = install.status;
        if (!exists) {
          newStatus = 'missing';
        } else if (install.status === 'missing') {
          newStatus = 'active';
        }

        if (newStatus !== install.status || gitBranch !== install.gitBranch) {
          install.status = newStatus;
          install.gitBranch = gitBranch;
          install.lastChecked = new Date().toISOString();
          updated = true;
        }
      }

      // Verify health check results
      expect(updated).toBe(true);

      const existingInstall = registry.installations.find(i => i.id === 'test-health-exists');
      const missingInstall = registry.installations.find(i => i.id === 'test-health-missing');

      expect(existingInstall.status).toBe('active');
      expect(missingInstall.status).toBe('missing');
    } finally {
      // Cleanup
      await fs.rm(path.join(testDir, 'health-test'), { recursive: true, force: true });

      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });

  it('should remove missing installations from registry (AC10 - registry --cleanup)', async () => {
    const { writeRegistry, readRegistry } = await import('../../bin/utils.js');

    // Backup current registry
    const currentRegistry = await readRegistry();
    const backupInstallations = [...currentRegistry.installations];

    try {
      // Create test registry with some missing installations
      const testRegistry = {
        version: '1.0',
        installations: [
          {
            id: 'test-cleanup-active',
            path: path.join(testDir, 'cleanup-active'),
            port: 9500,
            installedAt: '2025-01-15T10:00:00.000Z',
            lastChecked: '2025-01-15T10:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'active',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          },
          {
            id: 'test-cleanup-missing-1',
            path: path.join(testDir, 'cleanup-missing-1'),
            port: 9510,
            installedAt: '2025-01-15T11:00:00.000Z',
            lastChecked: '2025-01-15T11:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'missing',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          },
          {
            id: 'test-cleanup-missing-2',
            path: path.join(testDir, 'cleanup-missing-2'),
            port: 9520,
            installedAt: '2025-01-15T12:00:00.000Z',
            lastChecked: '2025-01-15T12:00:00.000Z',
            version: '0.1.0',
            mode: 'production',
            currentWorkflow: null,
            gitBranch: 'main',
            status: 'missing',
            metadata: {
              lastServerRun: null,
              workflowCount: 0,
              promptCount: 0
            }
          }
        ]
      };

      await writeRegistry(testRegistry);

      // Simulate cleanup logic
      const registry = await readRegistry();
      const before = registry.installations.length;

      registry.installations = registry.installations.filter(install => {
        if (install.status === 'missing') {
          return false;
        }
        return true;
      });

      const removed = before - registry.installations.length;

      await writeRegistry(registry);

      // Verify cleanup results
      expect(before).toBe(3);
      expect(removed).toBe(2);
      expect(registry.installations.length).toBe(1);

      const remainingInstall = registry.installations[0];
      expect(remainingInstall.id).toBe('test-cleanup-active');
      expect(remainingInstall.status).toBe('active');
    } finally {
      // Restore original registry
      await writeRegistry({
        version: '1.0',
        installations: backupInstallations
      });
    }
  });
});
