import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { WorkflowDataService } from "../../../src/services/chain/workflow-data.js";
import type { WorkflowData, ExecutionRecord } from "../../../src/services/chain/types.js";
import { resolvePathAsync } from "../../../src/services/config/poem-config.js";

describe("WorkflowDataService", () => {
  let service: WorkflowDataService;
  let workflowDataDir: string;
  let createdIds: string[] = [];

  beforeEach(async () => {
    service = new WorkflowDataService();
    await service.initialize();

    // Get workflow-data directory for cleanup
    workflowDataDir = await resolvePathAsync("workflowData");
  });

  afterEach(async () => {
    // Clean up created workflow-data files
    for (const id of createdIds) {
      try {
        await service.delete(id);
      } catch {
        // Ignore errors during cleanup
      }
    }
    createdIds = [];
  });

  describe("create", () => {
    it("should create new workflow-data with unique ID", async () => {
      const workflowData = await service.create("test-workflow");
      createdIds.push(workflowData.id);

      expect(workflowData.id).toBeDefined();
      expect(workflowData.workflowName).toBe("test-workflow");
      expect(workflowData.startedAt).toBeDefined();
      expect(workflowData.updatedAt).toBeDefined();
      expect(workflowData.executedTemplates).toEqual([]);
      expect(workflowData.data).toEqual({});
      expect(workflowData.checkpoint).toBeNull();
    });

    it("should create workflow-data with initial data", async () => {
      const initialData = { rawTranscript: "test transcript" };
      const workflowData = await service.create("test-workflow", initialData);
      createdIds.push(workflowData.id);

      expect(workflowData.data).toEqual(initialData);
    });

    it("should save workflow-data file to disk", async () => {
      const workflowData = await service.create("test-workflow");
      createdIds.push(workflowData.id);

      const filePath = join(workflowDataDir, `${workflowData.id}.json`);
      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      expect(exists).toBe(true);
    });
  });

  describe("load", () => {
    it("should load existing workflow-data", async () => {
      const created = await service.create("test-workflow", { foo: "bar" });
      createdIds.push(created.id);

      const loaded = await service.load(created.id);

      expect(loaded.id).toBe(created.id);
      expect(loaded.workflowName).toBe("test-workflow");
      expect(loaded.data).toEqual({ foo: "bar" });
    });

    it("should throw error for non-existent workflow-data", async () => {
      await expect(service.load("non-existent-id")).rejects.toThrow(
        "Workflow data not found: non-existent-id"
      );
    });
  });

  describe("save", () => {
    it("should update workflow-data file", async () => {
      const workflowData = await service.create("test-workflow");
      createdIds.push(workflowData.id);

      workflowData.data.newField = "new value";
      await service.save(workflowData);

      const loaded = await service.load(workflowData.id);
      expect(loaded.data.newField).toBe("new value");
    });

    it("should update updatedAt timestamp on save", async () => {
      const workflowData = await service.create("test-workflow");
      createdIds.push(workflowData.id);

      const originalUpdatedAt = workflowData.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      await service.save(workflowData);

      const loaded = await service.load(workflowData.id);
      expect(loaded.updatedAt).not.toBe(originalUpdatedAt);
    });

    it("should pretty-print JSON for human readability", async () => {
      const workflowData = await service.create("test-workflow");
      createdIds.push(workflowData.id);

      const filePath = join(workflowDataDir, `${workflowData.id}.json`);
      const content = await fs.readFile(filePath, "utf-8");

      // Pretty-printed JSON has newlines and indentation
      expect(content).toContain("\n");
      expect(content).toContain("  "); // 2-space indentation
    });
  });

  describe("updateData", () => {
    it("should merge new data into existing data", async () => {
      const workflowData = await service.create("test-workflow", {
        field1: "value1",
      });
      createdIds.push(workflowData.id);

      const updated = await service.updateData(workflowData.id, {
        field2: "value2",
      });

      expect(updated.data).toEqual({
        field1: "value1",
        field2: "value2",
      });
    });

    it("should overwrite existing fields", async () => {
      const workflowData = await service.create("test-workflow", {
        field1: "value1",
      });
      createdIds.push(workflowData.id);

      const updated = await service.updateData(workflowData.id, {
        field1: "updated value",
      });

      expect(updated.data.field1).toBe("updated value");
    });
  });

  describe("addExecutionRecord", () => {
    it("should add execution record to workflow-data", async () => {
      const workflowData = await service.create("test-workflow");
      createdIds.push(workflowData.id);

      const record: ExecutionRecord = {
        stepId: "step1",
        templatePath: "test-template.hbs",
        executedAt: new Date().toISOString(),
        outputFields: ["outputField1"],
        renderTimeMs: 42,
      };

      const updated = await service.addExecutionRecord(workflowData.id, record);

      expect(updated.executedTemplates).toHaveLength(1);
      expect(updated.executedTemplates[0]).toEqual(record);
    });

    it("should append multiple execution records", async () => {
      const workflowData = await service.create("test-workflow");
      createdIds.push(workflowData.id);

      const record1: ExecutionRecord = {
        stepId: "step1",
        templatePath: "template1.hbs",
        executedAt: new Date().toISOString(),
        outputFields: ["field1"],
        renderTimeMs: 10,
      };

      const record2: ExecutionRecord = {
        stepId: "step2",
        templatePath: "template2.hbs",
        executedAt: new Date().toISOString(),
        outputFields: ["field2"],
        renderTimeMs: 20,
      };

      await service.addExecutionRecord(workflowData.id, record1);
      const updated = await service.addExecutionRecord(workflowData.id, record2);

      expect(updated.executedTemplates).toHaveLength(2);
      expect(updated.executedTemplates[0].stepId).toBe("step1");
      expect(updated.executedTemplates[1].stepId).toBe("step2");
    });
  });

  describe("delete", () => {
    it("should delete workflow-data file", async () => {
      const workflowData = await service.create("test-workflow");
      const id = workflowData.id;

      await service.delete(id);

      await expect(service.load(id)).rejects.toThrow();
    });

    it("should not throw error when deleting non-existent file", async () => {
      await expect(service.delete("non-existent-id")).resolves.not.toThrow();
    });
  });

  describe("list", () => {
    it("should list all workflow-data IDs", async () => {
      const wf1 = await service.create("workflow1");
      const wf2 = await service.create("workflow2");
      createdIds.push(wf1.id, wf2.id);

      const list = await service.list();

      expect(list).toContain(wf1.id);
      expect(list).toContain(wf2.id);
    });

    it("should return empty array when no workflow-data exists", async () => {
      // Clean up first
      const list = await service.list();
      for (const id of list) {
        await service.delete(id);
      }

      const emptyList = await service.list();
      expect(emptyList).toEqual([]);
    });
  });

  describe("pause/resume support", () => {
    it("should persist workflow-data state for resume", async () => {
      const workflowData = await service.create("test-workflow", {
        rawTranscript: "test",
      });
      createdIds.push(workflowData.id);

      // Simulate partial execution
      await service.updateData(workflowData.id, {
        transcriptAbridgement: "abridged",
      });

      const record: ExecutionRecord = {
        stepId: "step1",
        templatePath: "1-4-abridge-v2.hbs",
        executedAt: new Date().toISOString(),
        outputFields: ["transcriptAbridgement"],
        renderTimeMs: 50,
      };
      await service.addExecutionRecord(workflowData.id, record);

      // Load and verify state is preserved
      const loaded = await service.load(workflowData.id);

      expect(loaded.data.rawTranscript).toBe("test");
      expect(loaded.data.transcriptAbridgement).toBe("abridged");
      expect(loaded.executedTemplates).toHaveLength(1);
      expect(loaded.executedTemplates[0].stepId).toBe("step1");
    });
  });
});
