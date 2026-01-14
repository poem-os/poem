import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ChainExecutorService } from "../../../src/services/chain/executor.js";
import { WorkflowDataService } from "../../../src/services/chain/workflow-data.js";
import type { ChainDefinition } from "../../../src/services/chain/types.js";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { resolvePathAsync } from "../../../src/services/config/poem-config.js";

describe("ChainExecutorService", () => {
  let service: ChainExecutorService;
  let workflowDataService: WorkflowDataService;
  let createdWorkflowIds: string[] = [];

  beforeEach(async () => {
    service = new ChainExecutorService();
    workflowDataService = new WorkflowDataService();
    await workflowDataService.initialize();
  });

  afterEach(async () => {
    // Clean up workflow-data files
    for (const id of createdWorkflowIds) {
      try {
        await workflowDataService.delete(id);
      } catch {
        // Ignore cleanup errors
      }
    }
    createdWorkflowIds = [];
  });

  describe("loadChainDefinition", () => {
    it("should load chain definition from inline object", async () => {
      const chainDef: ChainDefinition = {
        name: "test-chain",
        version: "1.0.0",
        steps: [
          {
            id: "step1",
            prompt: "test-template.hbs",
            inputs: ["input"],
            outputs: ["output"],
          },
        ],
      };

      const loaded = await service.loadChainDefinition(chainDef);

      expect(loaded.name).toBe("test-chain");
      expect(loaded.steps).toHaveLength(1);
    });

    it("should load chain definition from YAML file", async () => {
      const loaded = await service.loadChainDefinition("chains/simple-chain.yaml");

      expect(loaded.name).toBe("simple-test-chain");
      expect(loaded.version).toBe("1.0.0");
      expect(loaded.steps).toHaveLength(2);
    });

    it("should throw error for unsupported format", async () => {
      // Create a dummy .txt file
      const promptsDir = await resolvePathAsync("prompts");
      const configDir = await resolvePathAsync("config");
      await fs.mkdir(join(configDir, "chains"), { recursive: true });
      await fs.writeFile(join(configDir, "chains", "invalid.txt"), "invalid content");

      await expect(
        service.loadChainDefinition("chains/invalid.txt")
      ).rejects.toThrow("Unsupported chain definition format");
    });
  });

  describe("execute - basic chain", () => {
    // TODO: Fix test isolation - this test has a race condition with parallel execution
    // Passes in isolation but fails in full suite due to workflow-data cleanup conflicts
    it.skip("should execute a simple 2-step chain", async () => {
      // Create test templates
      const promptsDir = await resolvePathAsync("prompts");
      await fs.mkdir(promptsDir, { recursive: true });

      const template1 = "Test output: {{inputData}}";
      const template2 = "Final: {{outputData}}";

      await fs.writeFile(join(promptsDir, "test-template-1.hbs"), template1);
      await fs.writeFile(join(promptsDir, "test-template-2.hbs"), template2);

      const chainDef: ChainDefinition = {
        name: "simple-test",
        version: "1.0.0",
        steps: [
          {
            id: "step1",
            prompt: "test-template-1.hbs",
            inputs: ["inputData"],
            outputs: ["outputData"],
          },
          {
            id: "step2",
            prompt: "test-template-2.hbs",
            inputs: ["outputData"],
            outputs: ["finalResult"],
          },
        ],
      };

      const result = await service.execute(chainDef, {
        initialData: { inputData: "hello" },
      });

      createdWorkflowIds.push(result.workflowData.id);

      expect(result.stepsExecuted).toBe(2);
      expect(result.failedSteps).toBe(0);
      expect(result.workflowData.executedTemplates).toHaveLength(2);
      expect(result.workflowData.data.inputData).toBe("hello");
      expect(result.workflowData.data.outputData).toBe("Test output: hello");
      expect(result.workflowData.data.finalResult).toBe("Final: Test output: hello");
    });

    it("should track execution records for each step", async () => {
      const promptsDir = await resolvePathAsync("prompts");
      await fs.mkdir(promptsDir, { recursive: true });

      const template = "Output: {{input}}";
      await fs.writeFile(join(promptsDir, "test-template.hbs"), template);

      const chainDef: ChainDefinition = {
        name: "tracking-test",
        version: "1.0.0",
        steps: [
          {
            id: "step1",
            prompt: "test-template.hbs",
            inputs: ["input"],
            outputs: ["output"],
          },
        ],
      };

      const result = await service.execute(chainDef, {
        initialData: { input: "test" },
      });

      createdWorkflowIds.push(result.workflowData.id);

      const record = result.workflowData.executedTemplates[0];
      expect(record.stepId).toBe("step1");
      expect(record.templatePath).toBe("test-template.hbs");
      expect(record.executedAt).toBeDefined();
      expect(record.outputFields).toEqual(["output"]);
      expect(record.renderTimeMs).toBeGreaterThan(0);
    });
  });

  describe("execute - field mappers", () => {
    it("should apply field mapper to rename output fields", async () => {
      const promptsDir = await resolvePathAsync("prompts");
      await fs.mkdir(promptsDir, { recursive: true });

      // Template outputs JSON with field "result"
      const template = '{"result": "{{input}}"}';
      await fs.writeFile(join(promptsDir, "mapper-test.hbs"), template);

      const chainDef: ChainDefinition = {
        name: "mapper-test",
        version: "1.0.0",
        steps: [
          {
            id: "step1",
            prompt: "mapper-test.hbs",
            inputs: ["input"],
            outputs: ["finalOutput"],
            mapper: {
              // Rename "result" to "finalOutput"
              result: "finalOutput",
            },
          },
        ],
      };

      const result = await service.execute(chainDef, {
        initialData: { input: "mapped value" },
      });

      createdWorkflowIds.push(result.workflowData.id);

      expect(result.workflowData.data.finalOutput).toBe("mapped value");
      // Original field should not exist
      expect(result.workflowData.data.result).toBeUndefined();
    });
  });

  describe("execute - pause and resume", () => {
    // TODO: Fix test isolation - race condition with parallel execution (same as above)
    it.skip("should pause after specified step", async () => {
      const promptsDir = await resolvePathAsync("prompts");
      await fs.mkdir(promptsDir, { recursive: true });

      const template = "Step output: {{input}}";
      await fs.writeFile(join(promptsDir, "pause-test.hbs"), template);

      const chainDef: ChainDefinition = {
        name: "pause-test",
        version: "1.0.0",
        steps: [
          {
            id: "step1",
            prompt: "pause-test.hbs",
            inputs: ["input"],
            outputs: ["step1Output"],
          },
          {
            id: "step2",
            prompt: "pause-test.hbs",
            inputs: ["step1Output"],
            outputs: ["step2Output"],
          },
          {
            id: "step3",
            prompt: "pause-test.hbs",
            inputs: ["step2Output"],
            outputs: ["step3Output"],
          },
        ],
      };

      // Execute first 2 steps, pause
      const result1 = await service.execute(chainDef, {
        initialData: { input: "test" },
        pauseAfterStep: 2,
      });

      createdWorkflowIds.push(result1.workflowData.id);

      expect(result1.stepsExecuted).toBe(2);
      expect(result1.workflowData.executedTemplates).toHaveLength(2);

      // Resume from step 3
      const result2 = await service.execute(chainDef, {
        workflowId: result1.workflowData.id,
      });

      expect(result2.stepsExecuted).toBe(1); // Only executed step 3
      expect(result2.workflowData.executedTemplates).toHaveLength(3); // Total 3 steps
      expect(result2.workflowData.data.step3Output).toBeDefined();
    });

    // TODO: Fix test isolation - race condition with parallel execution (same as above)
    it.skip("should preserve workflow-data state across pause/resume", async () => {
      const promptsDir = await resolvePathAsync("prompts");
      await fs.mkdir(promptsDir, { recursive: true });

      const template1 = "{{input}}";
      const template2 = "{{output1}}";
      await fs.writeFile(join(promptsDir, "state-test-1.hbs"), template1);
      await fs.writeFile(join(promptsDir, "state-test-2.hbs"), template2);

      const chainDef: ChainDefinition = {
        name: "state-test",
        version: "1.0.0",
        steps: [
          {
            id: "step1",
            prompt: "state-test-1.hbs",
            inputs: ["input"],
            outputs: ["output1"],
          },
          {
            id: "step2",
            prompt: "state-test-2.hbs",
            inputs: ["output1"],
            outputs: ["output2"],
          },
        ],
      };

      // Execute first step
      const result1 = await service.execute(chainDef, {
        initialData: { input: "initial" },
        pauseAfterStep: 1,
      });

      createdWorkflowIds.push(result1.workflowData.id);

      // Resume
      const result2 = await service.execute(chainDef, {
        workflowId: result1.workflowData.id,
      });

      // Initial data should still be present
      expect(result2.workflowData.data.input).toBe("initial");
      expect(result2.workflowData.data.output1).toBe("initial");
      expect(result2.workflowData.data.output2).toBe("initial");
    });
  });

  describe("execute - error handling", () => {
    it("should throw ChainExecutionError on missing input field", async () => {
      const chainDef: ChainDefinition = {
        name: "error-test",
        version: "1.0.0",
        steps: [
          {
            id: "step1",
            prompt: "test.hbs",
            inputs: ["missingField"],
            outputs: ["output"],
          },
        ],
      };

      await expect(
        service.execute(chainDef, { initialData: {} })
      ).rejects.toThrow("Missing required input field: missingField");
    });

    // TODO: Fix test isolation - race condition with parallel execution (same as above)
    it.skip("should preserve workflow-data up to failed step", async () => {
      const promptsDir = await resolvePathAsync("prompts");
      await fs.mkdir(promptsDir, { recursive: true });

      const template = "{{input}}";
      await fs.writeFile(join(promptsDir, "error-test.hbs"), template);

      const chainDef: ChainDefinition = {
        name: "partial-failure",
        version: "1.0.0",
        steps: [
          {
            id: "step1",
            prompt: "error-test.hbs",
            inputs: ["input"],
            outputs: ["output1"],
          },
          {
            id: "step2",
            prompt: "error-test.hbs",
            inputs: ["missingField"], // This will fail
            outputs: ["output2"],
          },
        ],
      };

      try {
        const result = await service.execute(chainDef, {
          initialData: { input: "test" },
        });
        createdWorkflowIds.push(result.workflowData.id);
      } catch (error: any) {
        // Should have workflow ID for debugging
        expect(error.workflowDataId).toBeDefined();
        createdWorkflowIds.push(error.workflowDataId);

        // Load workflow-data to verify partial state
        const workflowData = await workflowDataService.load(error.workflowDataId);

        // Step 1 should have executed successfully
        expect(workflowData.executedTemplates).toHaveLength(1);
        expect(workflowData.data.output1).toBe("test");
        // Step 2 should not have executed
        expect(workflowData.data.output2).toBeUndefined();
      }
    });

    it("should include error context in ChainExecutionError", async () => {
      const chainDef: ChainDefinition = {
        name: "context-test",
        version: "1.0.0",
        steps: [
          {
            id: "failing-step",
            prompt: "nonexistent-template.hbs",
            inputs: ["input"],
            outputs: ["output"],
          },
        ],
      };

      try {
        const result = await service.execute(chainDef, { initialData: { input: "test" } });
        createdWorkflowIds.push(result.workflowData.id);
        throw new Error("Should have thrown");
      } catch (error: any) {
        expect(error.stepIndex).toBe(0);
        expect(error.templatePath).toBe("nonexistent-template.hbs");
        expect(error.workflowDataId).toBeDefined();
        createdWorkflowIds.push(error.workflowDataId);
      }
    });
  });
});
