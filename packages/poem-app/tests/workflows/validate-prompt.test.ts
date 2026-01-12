import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { join } from "path";

describe("validate-prompt workflow", () => {
  const workflowPath = join(
    __dirname,
    "../../../poem-core/workflows/validate-prompt.yaml"
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
      expect(workflow.id).toBe("validate-prompt");
      expect(workflow.name).toBe("Validate Prompt Structure and Quality");
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

    it("should have exactly 13 steps", () => {
      // Validate-prompt workflow has 13 defined steps (added output schema validation in Story 3.7)
      expect(workflow.steps.length).toBe(13);
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
        });
    });

    it("should have prompt field for elicit steps", () => {
      workflow.steps
        .filter((step: any) => step.type === "elicit")
        .forEach((step: any) => {
          expect(step.prompt, `Elicit step ${step.id} missing prompt`).toBeDefined();
        });
    });
  });

  describe("Workflow Steps Coverage", () => {
    it("should have select-prompt step", () => {
      const step = workflow.steps.find((s: any) => s.id === "select-prompt");
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
    });

    it("should have load-template step", () => {
      const step = workflow.steps.find((s: any) => s.id === "load-template");
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have validate-syntax step", () => {
      const step = workflow.steps.find((s: any) => s.id === "validate-syntax");
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have extract-placeholders step", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "extract-placeholders"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have load-schemas step", () => {
      const step = workflow.steps.find((s: any) => s.id === "load-schemas");
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have validate-input-schema step", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "validate-input-schema"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have validate-helpers step", () => {
      const step = workflow.steps.find((s: any) => s.id === "validate-helpers");
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have check-best-practices step", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "check-best-practices"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have aggregate-results step", () => {
      const step = workflow.steps.find((s: any) => s.id === "aggregate-results");
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have validation-report step", () => {
      const step = workflow.steps.find((s: any) => s.id === "validation-report");
      expect(step).toBeDefined();
      expect(step.type).toBe("output");
    });

    it("should have save-report step", () => {
      const step = workflow.steps.find((s: any) => s.id === "save-report");
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
    });

    it("should have complete step", () => {
      const step = workflow.steps.find((s: any) => s.id === "complete");
      expect(step).toBeDefined();
      expect(step.type).toBe("output");
    });
  });

  describe("Acceptance Criteria Coverage", () => {
    it("should cover AC1: Workflow defined in validate-prompt.yaml", () => {
      // The file existence and structure tests above cover this
      expect(workflow.id).toBe("validate-prompt");
      expect(workflow.name).toBeDefined();
    });

    it("should cover AC2: Validates Handlebars syntax", () => {
      // Check that validate-syntax step exists
      const step = workflow.steps.find((s: any) => s.id === "validate-syntax");
      expect(step).toBeDefined();
      expect(step.instruction).toContain("Handlebars.compile");
      expect(step.instruction).toContain("syntax");
    });

    it("should cover AC3: Validates input/output placeholders and schemas", () => {
      // Check that load-schemas and validate-input-schema steps exist
      const loadStep = workflow.steps.find((s: any) => s.id === "load-schemas");
      const validateStep = workflow.steps.find(
        (s: any) => s.id === "validate-input-schema"
      );
      expect(loadStep).toBeDefined();
      expect(validateStep).toBeDefined();
      expect(loadStep.instruction).toContain("input schema");
      expect(loadStep.instruction).toContain("output schema");
      expect(validateStep.instruction).toContain("placeholder");
      expect(validateStep.instruction).toContain("schema fields");
    });

    it("should cover AC4: Validates required helpers are registered", () => {
      // Check that validate-helpers step exists
      const step = workflow.steps.find((s: any) => s.id === "validate-helpers");
      expect(step).toBeDefined();
      expect(step.instruction).toContain("/api/helpers");
      expect(step.instruction).toContain("registered");
    });

    it("should cover AC5: Checks for POEM best practices", () => {
      // Check that check-best-practices step exists
      const step = workflow.steps.find(
        (s: any) => s.id === "check-best-practices"
      );
      expect(step).toBeDefined();
      expect(step.instruction).toContain("best practice");
      expect(step.instruction).toContain("Rule");
    });

    it("should cover AC6: Reports issues with severity", () => {
      // Check that aggregate-results and validation-report steps handle severity
      const aggregateStep = workflow.steps.find(
        (s: any) => s.id === "aggregate-results"
      );
      const reportStep = workflow.steps.find(
        (s: any) => s.id === "validation-report"
      );
      expect(aggregateStep).toBeDefined();
      expect(reportStep).toBeDefined();
      expect(aggregateStep.instruction).toContain("severity");
      expect(aggregateStep.instruction).toContain("error");
      expect(aggregateStep.instruction).toContain("warning");
      expect(aggregateStep.instruction).toContain("info");
    });

    it("should cover AC7: Provides suggestions for fixing issues", () => {
      // Check that aggregate-results includes suggestions
      const aggregateStep = workflow.steps.find(
        (s: any) => s.id === "aggregate-results"
      );
      expect(aggregateStep).toBeDefined();
      expect(aggregateStep.instruction).toContain("suggestion");
    });
  });

  describe("Path Resolution Inheritance", () => {
    it("should use pathResolution: config", () => {
      expect(workflow.pathResolution).toBe("config");
    });

    it("should NOT define paths section", () => {
      expect(workflow.paths).toBeUndefined();
    });

    it("should reference config in description", () => {
      expect(workflow.description).toContain("poem-core-config.yaml");
      expect(workflow.description).toContain("Path Resolution");
    });

    it("should mention workspace modes in description", () => {
      expect(workflow.description).toContain("Development");
      expect(workflow.description).toContain("Production");
    });
  });

  describe("Version and Metadata", () => {
    it("should have valid semantic version", () => {
      expect(workflow.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("should have lastUpdated in YYYY-MM-DD format", () => {
      expect(workflow.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should have POEM Framework as author", () => {
      expect(workflow.author).toBe("POEM Framework");
    });
  });

  describe("Step Instructions Quality", () => {
    it("should have detailed instructions for each step", () => {
      workflow.steps.forEach((step: any) => {
        expect(
          step.instruction.length,
          `Step ${step.id} has insufficient instruction detail`
        ).toBeGreaterThan(100);
      });
    });

    it("should reference API endpoints in relevant steps", () => {
      const extractStep = workflow.steps.find(
        (s: any) => s.id === "extract-placeholders"
      );
      const helperStep = workflow.steps.find(
        (s: any) => s.id === "validate-helpers"
      );

      expect(extractStep.instruction).toContain("/api/schema/extract");
      expect(helperStep.instruction).toContain("/api/helpers");
    });

    it("should include error handling guidance", () => {
      const selectStep = workflow.steps.find((s: any) => s.id === "select-prompt");
      expect(selectStep.instruction).toContain("not found");
      expect(selectStep.instruction).toContain("error");
    });
  });
});
