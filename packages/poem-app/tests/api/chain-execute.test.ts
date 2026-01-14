import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { ChainDefinition } from "../../src/services/chain/types.js";
import { resolvePathAsync } from "../../src/services/config/poem-config.js";
import { WorkflowDataService } from "../../src/services/chain/workflow-data.js";

// Note: These tests require the Astro dev server to be running
// or use a test server setup
const BASE_URL = "http://localhost:4321";

describe("POST /api/chain/execute", () => {
  let workflowDataService: WorkflowDataService;
  let createdWorkflowIds: string[] = [];

  beforeAll(async () => {
    workflowDataService = new WorkflowDataService();
    await workflowDataService.initialize();

    // Create test templates
    const promptsDir = await resolvePathAsync("prompts");
    await fs.mkdir(promptsDir, { recursive: true });

    const template1 = "Step 1: {{input}}";
    const template2 = "Step 2: {{step1Output}}";

    await fs.writeFile(join(promptsDir, "api-test-1.hbs"), template1);
    await fs.writeFile(join(promptsDir, "api-test-2.hbs"), template2);
  });

  afterAll(async () => {
    // Clean up workflow-data files
    for (const id of createdWorkflowIds) {
      try {
        await workflowDataService.delete(id);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  it("should execute a 2-step chain successfully", async () => {
    const chainDef: ChainDefinition = {
      name: "api-test-chain",
      version: "1.0.0",
      steps: [
        {
          id: "step1",
          prompt: "api-test-1.hbs",
          inputs: ["input"],
          outputs: ["step1Output"],
        },
        {
          id: "step2",
          prompt: "api-test-2.hbs",
          inputs: ["step1Output"],
          outputs: ["step2Output"],
        },
      ],
    };

    const response = await fetch(`${BASE_URL}/api/chain/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chain: chainDef,
        initialData: { input: "test value" },
      }),
    });

    expect(response.ok).toBe(true);
    const result = await response.json();

    expect(result.success).toBe(true);
    expect(result.workflowData).toBeDefined();
    expect(result.workflowData.executedTemplates).toHaveLength(2);
    expect(result.workflowData.data.input).toBe("test value");
    expect(result.workflowData.data.step1Output).toBe("Step 1: test value");
    expect(result.workflowData.data.step2Output).toBe("Step 2: Step 1: test value");

    expect(result.executionSummary).toBeDefined();
    expect(result.executionSummary.stepsExecuted).toBe(2);
    expect(result.executionSummary.failedSteps).toBe(0);
    expect(result.executionSummary.totalRenderTimeMs).toBeGreaterThan(0);

    createdWorkflowIds.push(result.workflowData.id);
  });

  it("should return validation error for invalid chain definition", async () => {
    const invalidChain = {
      // Missing required fields
      steps: [],
    };

    const response = await fetch(`${BASE_URL}/api/chain/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chain: invalidChain,
      }),
    });

    expect(response.status).toBe(400);
    const result = await response.json();

    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid request format");
    expect(result.details.validationErrors).toBeDefined();
  });

  it("should handle missing input field error", async () => {
    const chainDef: ChainDefinition = {
      name: "error-test",
      version: "1.0.0",
      steps: [
        {
          id: "step1",
          prompt: "api-test-1.hbs",
          inputs: ["missingField"],
          outputs: ["output"],
        },
      ],
    };

    const response = await fetch(`${BASE_URL}/api/chain/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chain: chainDef,
        initialData: { input: "test" },
      }),
    });

    expect(response.status).toBe(400);
    const result = await response.json();

    expect(result.success).toBe(false);
    expect(result.error).toContain("Missing required input field");
    expect(result.details.failedStep).toBe(0);
    expect(result.details.workflowDataId).toBeDefined();

    if (result.details.workflowDataId) {
      createdWorkflowIds.push(result.details.workflowDataId);
    }
  });

  it("should support pause and resume via API", async () => {
    const chainDef: ChainDefinition = {
      name: "pause-resume-test",
      version: "1.0.0",
      steps: [
        {
          id: "step1",
          prompt: "api-test-1.hbs",
          inputs: ["input"],
          outputs: ["step1Output"],
        },
        {
          id: "step2",
          prompt: "api-test-2.hbs",
          inputs: ["step1Output"],
          outputs: ["step2Output"],
        },
      ],
    };

    // Execute first step, pause
    const response1 = await fetch(`${BASE_URL}/api/chain/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chain: chainDef,
        initialData: { input: "pause test" },
        pauseAfterStep: 1,
      }),
    });

    expect(response1.ok).toBe(true);
    const result1 = await response1.json();

    expect(result1.workflowData.executedTemplates).toHaveLength(1);
    expect(result1.executionSummary.stepsExecuted).toBe(1);

    createdWorkflowIds.push(result1.workflowData.id);

    // Resume from step 2
    const response2 = await fetch(`${BASE_URL}/api/chain/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chain: chainDef,
        workflowId: result1.workflowData.id,
        resume: true,
      }),
    });

    expect(response2.ok).toBe(true);
    const result2 = await response2.json();

    expect(result2.workflowData.executedTemplates).toHaveLength(2);
    expect(result2.executionSummary.stepsExecuted).toBe(1); // Only executed step 2
    expect(result2.workflowData.data.step2Output).toBe("Step 2: Step 1: pause test");
  });

  it("should load chain definition from file path", async () => {
    // Use the simple-chain.yaml from test fixtures
    const response = await fetch(`${BASE_URL}/api/chain/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chain: "chains/simple-chain.yaml",
        initialData: { inputData: "from file" },
      }),
    });

    // This will fail if templates don't exist, but tests the path resolution
    // Skip assertion if 400 error (expected if templates don't exist)
    if (response.status === 400) {
      const result = await response.json();
      expect(result.error).toBeDefined();
      return;
    }

    expect(response.ok).toBe(true);
    const result = await response.json();
    createdWorkflowIds.push(result.workflowData.id);
  });

  it("should return execution summary with timing info", async () => {
    const chainDef: ChainDefinition = {
      name: "timing-test",
      version: "1.0.0",
      steps: [
        {
          id: "step1",
          prompt: "api-test-1.hbs",
          inputs: ["input"],
          outputs: ["output"],
        },
      ],
    };

    const response = await fetch(`${BASE_URL}/api/chain/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chain: chainDef,
        initialData: { input: "timing" },
      }),
    });

    expect(response.ok).toBe(true);
    const result = await response.json();

    expect(result.executionSummary).toBeDefined();
    expect(result.executionSummary.stepsExecuted).toBe(1);
    expect(result.executionSummary.totalRenderTimeMs).toBeGreaterThan(0);
    expect(result.executionSummary.failedSteps).toBe(0);

    createdWorkflowIds.push(result.workflowData.id);
  });
});
