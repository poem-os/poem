import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { join } from "path";

describe("refine-prompt workflow", () => {
  const workflowPath = join(
    __dirname,
    "../../../poem-core/workflows/refine-prompt.yaml"
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
      expect(workflow.id).toBe("refine-prompt");
      expect(workflow.name).toBe("Refine Existing Prompt");
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
        "load-template",
        "render-current",
        "modification-method",
        "apply-modifications",
        "re-render",
        "confirm-save",
        "track-iteration",
        "continue-refining",
      ];

      workflow.steps
        .filter((step: any) => dataCapturingSteps.includes(step.id))
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

    it("should have load-template step (AC 2, 3)", () => {
      const step = workflow.steps.find((s: any) => s.id === "load-template");
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("templateContent");
    });

    it("should have render-current step (AC 4)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "render-current"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("renderedOutput");
    });

    it("should have modification-method step (AC 5)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "modification-method"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
      expect(step.stores).toBe("modificationChoice");
    });

    it("should have apply-modifications step (AC 5, 6)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "apply-modifications"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("updatedTemplateContent");
    });

    it("should have re-render step (AC 6)", () => {
      const step = workflow.steps.find((s: any) => s.id === "re-render");
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
      expect(step.stores).toBe("newRenderedOutput");
    });

    it("should have confirm-save step (AC 6)", () => {
      const step = workflow.steps.find((s: any) => s.id === "confirm-save");
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
      expect(step.stores).toBe("saveChoice");
    });

    it("should have track-iteration step (AC 7, optional)", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "track-iteration"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("action");
    });

    it("should have continue-refining step", () => {
      const step = workflow.steps.find(
        (s: any) => s.id === "continue-refining"
      );
      expect(step).toBeDefined();
      expect(step.type).toBe("elicit");
      expect(step.stores).toBe("continueChoice");
    });

    it("should have complete step", () => {
      const step = workflow.steps.find((s: any) => s.id === "complete");
      expect(step).toBeDefined();
      expect(step.type).toBe("output");
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
  });

  describe("Workflow Outputs", () => {
    it("should define output artifacts", () => {
      expect(workflow.outputs).toBeDefined();
      expect(Array.isArray(workflow.outputs)).toBe(true);
      expect(workflow.outputs.length).toBeGreaterThan(0);
    });

    it("should have template output defined", () => {
      const templateOutput = workflow.outputs.find(
        (o: any) => o.name === "template"
      );
      expect(templateOutput).toBeDefined();
      expect(templateOutput.format).toBe("hbs");
      expect(templateOutput.optional).toBe(false);
    });

    it("should have backup output defined as optional", () => {
      const backupOutput = workflow.outputs.find(
        (o: any) => o.name === "backup"
      );
      expect(backupOutput).toBeDefined();
      expect(backupOutput.optional).toBe(true);
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

    it("should have lastUpdated date of 2026-01-09 or later", () => {
      expect(workflow.lastUpdated).toMatch(/^202[6-9]-/);
    });
  });
});
