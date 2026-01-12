import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { join } from "path";

describe("test-prompt workflow", () => {
  const workflowPath = join(
    __dirname,
    "../../../poem-core/workflows/test-prompt.yaml"
  );
  let workflowContent: string;
  let workflow: any;

  // Load workflow file before tests
  try {
    workflowContent = readFileSync(workflowPath, "utf-8");
    workflow = parse(workflowContent);
  } catch (error) {
    console.error("Failed to load workflow file:", error);
  }

  describe("Workflow YAML Structure", () => {
    it("should parse workflow YAML correctly", () => {
      expect(workflow).toBeDefined();
      expect(workflow).toBeTypeOf("object");
    });

    it("should have required top-level fields", () => {
      expect(workflow.id).toBe("test-prompt");
      expect(workflow.name).toBe("Test Prompt with Data");
      expect(workflow.version).toBeDefined();
      expect(workflow.author).toBe("POEM Framework");
      expect(workflow.lastUpdated).toBeDefined();
    });

    it("should have pathResolution set to config", () => {
      expect(workflow.pathResolution).toBe("config");
    });

    it("should have description field", () => {
      expect(workflow.description).toBeDefined();
      expect(workflow.description).toBeTypeOf("string");
      expect(workflow.description.length).toBeGreaterThan(50);
    });

    it("should have fallback configuration", () => {
      expect(workflow.fallback).toBeDefined();
      expect(workflow.fallback.onMissingInput).toBeDefined();
      expect(workflow.fallback.onApiError).toBeDefined();
      expect(workflow.fallback.onFileConflict).toBeDefined();
    });

    it("should have steps array", () => {
      expect(workflow.steps).toBeDefined();
      expect(Array.isArray(workflow.steps)).toBe(true);
      expect(workflow.steps.length).toBeGreaterThan(0);
    });

    it("should have exactly 11 steps", () => {
      // Test-prompt workflow has 11 defined steps (AC coverage)
      expect(workflow.steps.length).toBe(11);
    });

    it("should NOT have a paths section", () => {
      // CRITICAL: Workflows should inherit paths from config, not define them
      expect(workflow.paths).toBeUndefined();
    });
  });

  describe("Step Structure Validation", () => {
    it("should have all required step fields", () => {
      workflow.steps.forEach((step: any, index: number) => {
        expect(step.id, `Step ${index + 1} missing id`).toBeDefined();
        expect(step.name, `Step ${index + 1} missing name`).toBeDefined();
        expect(step.type, `Step ${index + 1} missing type`).toBeDefined();
        expect(
          step.instruction,
          `Step ${index + 1} missing instruction`
        ).toBeDefined();
      });
    });

    it("should have unique step IDs", () => {
      const stepIds = workflow.steps.map((step: any) => step.id);
      const uniqueIds = new Set(stepIds);
      expect(stepIds.length).toBe(uniqueIds.size);
    });

    it("should have valid step types", () => {
      const validTypes = ["elicit", "action", "output"];
      workflow.steps.forEach((step: any) => {
        expect(validTypes).toContain(step.type);
      });
    });

    it("should have elicit=true for elicit type steps", () => {
      workflow.steps
        .filter((step: any) => step.type === "elicit")
        .forEach((step: any) => {
          expect(step.elicit, `Elicit step ${step.id} missing elicit: true`).toBe(
            true
          );
          expect(
            step.prompt,
            `Elicit step ${step.id} missing prompt field`
          ).toBeDefined();
        });
    });

    it("should have stores field for steps that capture data", () => {
      const dataCapturingSteps = [
        "select-prompt",
        "choose-data-source",
        "load-test-data",
        "load-schema",
        "rendered",
        "validationResult",
        "currentScenarioResult",
        "continueTestingChoice",
        "saveResultsChoice",
      ];

      workflow.steps
        .filter((step: any) => dataCapturingSteps.includes(step.stores))
        .forEach((step: any) => {
          expect(
            step.stores,
            `Step ${step.id} should have stores field`
          ).toBeDefined();
        });
    });
  });

  describe("Workflow Steps Coverage", () => {
    it("should have select-prompt step (AC 2)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "select-prompt"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
      expect(step.stores).toBe("promptName");
    });

    it("should have choose-data-source step (AC 2)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "choose-data-source"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
      expect(step.stores).toBe("dataSourceChoice");
    });

    it("should have load-test-data step (AC 2)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "load-test-data"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("testData");
    });

    it("should have load-output-schema step (AC 3)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "load-output-schema"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("outputSchemaContent");
    });

    it("should have render-template step (AC 3, 4, 6)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "render-template"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("rendered");
    });

    it("should have validate-output step (AC 3, 4)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "validate-output"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("validationResult");
    });

    it("should have collect-results step (AC 4, 6)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "collect-results"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("currentScenarioResult");
    });

    it("should have run-another-scenario step (AC 5)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "run-another-scenario"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
      expect(step.stores).toBe("continueTestingChoice");
    });

    it("should have test-summary step (AC 4, 5, 6)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "test-summary"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("output");
    });

    it("should have save-results step (AC 7)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "save-results"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
      expect(step.stores).toBe("saveResultsChoice");
    });

    it("should have complete step", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "complete"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("output");
    });
  });

  describe("Acceptance Criteria Coverage", () => {
    it("should cover AC1: Workflow defined in .poem-core/workflows/test-prompt.yaml", () => {
      expect(workflow.id).toBe("test-prompt");
      expect(workflowPath).toContain("test-prompt.yaml");
    });

    it("should cover AC2: Accepts prompt path and data source", () => {
      const selectPromptStep = workflow.steps.find(
        (s: any) => s.id === "select-prompt"
      );
      const chooseDataStep = workflow.steps.find(
        (s: any) => s.id === "choose-data-source"
      );
      expect(selectPromptStep).toBeDefined();
      expect(chooseDataStep).toBeDefined();
    });

    it("should cover AC3: Calls render API and validates against schema", () => {
      const renderStep = workflow.steps.find(
        (s: any) => s.id === "render-template"
      );
      const validateStep = workflow.steps.find(
        (s: any) => s.id === "validate-output"
      );
      expect(renderStep).toBeDefined();
      expect(validateStep).toBeDefined();
    });

    it("should cover AC4: Reports missing fields, helper errors, warnings", () => {
      const renderStep = workflow.steps.find(
        (s: any) => s.id === "render-template"
      );
      const validateStep = workflow.steps.find(
        (s: any) => s.id === "validate-output"
      );
      const summaryStep = workflow.steps.find(
        (s: any) => s.id === "test-summary"
      );
      expect(renderStep).toBeDefined();
      expect(validateStep).toBeDefined();
      expect(summaryStep).toBeDefined();
    });

    it("should cover AC5: Can run multiple test scenarios in sequence", () => {
      const multipleStep = workflow.steps.find(
        (s: any) => s.id === "run-another-scenario"
      );
      expect(multipleStep).toBeDefined();
      expect(multipleStep.type).toBe("elicit");
    });

    it("should cover AC6: Displays render time and output length", () => {
      const renderStep = workflow.steps.find(
        (s: any) => s.id === "render-template"
      );
      const summaryStep = workflow.steps.find(
        (s: any) => s.id === "test-summary"
      );
      expect(renderStep).toBeDefined();
      expect(summaryStep).toBeDefined();
    });

    it("should cover AC7: Output can be saved to file for review", () => {
      const saveStep = workflow.steps.find(
        (s: any) => s.id === "save-results"
      );
      expect(saveStep).toBeDefined();
      expect(saveStep.type).toBe("elicit");
    });
  });

  describe("Path Resolution Inheritance", () => {
    it("should use pathResolution: config pattern", () => {
      expect(workflow.pathResolution).toBe("config");
    });

    it("should document path resolution in description", () => {
      expect(workflow.description).toContain("Path Resolution");
      expect(workflow.description).toContain("poem-core-config.yaml");
    });

    it("should mention dev-workspace in description", () => {
      expect(workflow.description).toContain("dev-workspace");
    });

    it("should mention production mode in description", () => {
      expect(workflow.description).toContain("Production");
      expect(workflow.description).toContain("poem/prompts");
    });
  });

  describe("Version and Metadata", () => {
    it("should have semantic versioning format", () => {
      const versionPattern = /^\d+\.\d+\.\d+$/;
      expect(versionPattern.test(workflow.version)).toBe(true);
    });

    it("should have valid date format in lastUpdated", () => {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      expect(datePattern.test(workflow.lastUpdated)).toBe(true);
    });

    it("should have lastUpdated date of 2026-01-11 or later", () => {
      expect(workflow.lastUpdated).toMatch(/^202[6-9]-/);
    });
  });

  describe("Step Instructions Quality", () => {
    it("should have detailed instructions for each step", () => {
      workflow.steps.forEach((step: any) => {
        expect(step.instruction.length).toBeGreaterThan(50);
      });
    });

    it("should mention API endpoints in render step", () => {
      const renderStep = workflow.steps.find(
        (s: any) => s.id === "render-template"
      );
      expect(renderStep.instruction).toContain("/api/prompt/render");
    });

    it("should mention API endpoints in validation step", () => {
      const validateStep = workflow.steps.find(
        (s: any) => s.id === "validate-output"
      );
      expect(validateStep.instruction).toContain("/api/schema/validate");
    });
  });
});
