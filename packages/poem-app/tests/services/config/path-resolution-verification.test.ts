/**
 * Path Resolution Verification Tests
 *
 * These tests verify that the path resolution fix is working correctly:
 * 1. POEM_DEV environment variable is set by vitest.config.ts
 * 2. Development mode is detected correctly
 * 3. Workflow-data files are created in dev-workspace/, not packages/poem-app/poem/
 * 4. Project root is resolved correctly
 *
 * This test suite serves as regression protection for the path resolution bug
 * that was fixed in commit 2f423d4.
 */

import { describe, it, expect } from "vitest";
import { loadPoemConfig, getProjectRoot, isDevelopmentMode, resetConfig, resolvePathAsync } from "../../../src/services/config/poem-config.js";
import { WorkflowDataService } from "../../../src/services/chain/workflow-data.js";
import { promises as fs } from "node:fs";

describe("Path Resolution Verification (Regression Test)", () => {
  describe("Environment Configuration", () => {
    it("POEM_DEV should be 'true' (set by vitest.config.ts)", () => {
      expect(process.env.POEM_DEV).toBe('true');
    });

    it("isDevelopmentMode() should return true", () => {
      expect(isDevelopmentMode()).toBe(true);
    });
  });

  describe("Project Root Resolution", () => {
    it("should resolve to monorepo root (not packages/poem-app)", () => {
      const root = getProjectRoot();

      // Should end with "poem" (the monorepo root)
      expect(root).toMatch(/poem$/);

      // Should NOT be inside packages/poem-app
      expect(root).not.toMatch(/packages\/poem-app$/);
    });
  });

  describe("Workspace Path Configuration", () => {
    it("should use dev-workspace/ paths in development mode", async () => {
      resetConfig();
      const config = await loadPoemConfig();

      expect(config.isDevelopment).toBe(true);
      expect(config.workspace.workflowState).toBe('dev-workspace/workflow-state');
      expect(config.workspace.prompts).toBe('dev-workspace/prompts');
      expect(config.workspace.schemas).toBe('dev-workspace/schemas');
      expect(config.workspace.mockData).toBe('dev-workspace/mock-data');
      expect(config.workspace.config).toBe('dev-workspace/config');
    });
  });

  describe("Workflow State File Location", () => {
    it("should create files in dev-workspace/workflow-state/", async () => {
      const service = new WorkflowDataService();
      await service.initialize();

      const workflowData = await service.create("path-verification-test", {
        testType: "regression",
        purpose: "verify path resolution fix"
      });

      // Get absolute path using resolvePathAsync (handles both flat and workflow modes)
      const path = require("node:path");
      const workflowStateDir = await resolvePathAsync("workflowState");
      const expectedPath = path.join(workflowStateDir, `${workflowData.id}.json`);

      // File should exist at expected location
      await expect(fs.access(expectedPath)).resolves.toBeUndefined();

      // Verify file contents
      const content = await fs.readFile(expectedPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.id).toBe(workflowData.id);
      expect(parsed.workflowName).toBe("path-verification-test");
      expect(parsed.data.testType).toBe("regression");

      // Verify path contains dev-workspace (not packages/poem-app/poem)
      // Note: In multi-workflow mode, path will be dev-workspace/workflows/<name>/workflow-state
      expect(expectedPath).toContain('dev-workspace');
      expect(expectedPath).toContain('workflow-state');
      expect(expectedPath).not.toContain('packages/poem-app/poem');

      // Cleanup
      await service.delete(workflowData.id);
    });

    it("should NOT create files in packages/poem-app/poem/workflow-state/", async () => {
      const service = new WorkflowDataService();
      await service.initialize();

      const workflowData = await service.create("wrong-location-check", { test: true });

      // Calculate wrong path (relative to cwd which is packages/poem-app)
      const path = require("node:path");
      const wrongPath = path.join(process.cwd(), "poem/workflow-state", `${workflowData.id}.json`);

      // File should NOT exist at wrong location
      await expect(fs.access(wrongPath)).rejects.toThrow();

      // Cleanup
      await service.delete(workflowData.id);
    });
  });

  describe("Directory Structure", () => {
    it("packages/poem-app/poem/workflow-state/ should not exist", async () => {
      // This directory is for source code structure, not runtime data
      const path = require("node:path");
      const wrongDir = path.join(process.cwd(), "poem/workflow-state");

      try {
        await fs.access(wrongDir);
        // If we reach here, the directory exists - bad!
        expect.fail("packages/poem-app/poem/workflow-state/ should not exist in development mode");
      } catch (error) {
        // Directory doesn't exist - good!
        expect((error as NodeJS.ErrnoException).code).toBe('ENOENT');
      }
    });
  });
});
