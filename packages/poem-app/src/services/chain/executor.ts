/**
 * Chain Executor Service
 *
 * Executes prompt chains with data accumulation and field mapping.
 * Coordinates WorkflowDataService and HandlebarsService to run multi-step workflows.
 */

import { promises as fs } from "node:fs";
import yaml from "js-yaml";
import type {
  ChainDefinition,
  ChainStep,
  WorkflowData,
  ExecutionRecord,
  ChainExecutionError as ChainExecutionErrorType,
} from "./types.js";
import { ChainExecutionError } from "./types.js";
import { WorkflowDataService } from "./workflow-data.js";
import { getHandlebarsService } from "../handlebars/index.js";
import { resolvePathAsync } from "../config/poem-config.js";
import { join } from "node:path";

/**
 * Chain execution options
 */
export interface ChainExecuteOptions {
  /** Initial data to start the chain */
  initialData?: Record<string, unknown>;

  /** Workflow ID for resume (if resuming) */
  workflowId?: string;

  /** Pause after this step number (for testing) */
  pauseAfterStep?: number;
}

/**
 * Chain execution result
 */
export interface ChainExecuteResult {
  /** Final workflow-data with all accumulated fields */
  workflowData: WorkflowData;

  /** Number of steps executed in this run */
  stepsExecuted: number;

  /** Total render time across all steps (ms) */
  totalRenderTimeMs: number;

  /** Number of failed steps */
  failedSteps: number;
}

/**
 * ChainExecutorService - Executes prompt chains
 */
export class ChainExecutorService {
  private workflowDataService: WorkflowDataService;

  constructor() {
    this.workflowDataService = new WorkflowDataService();
  }

  /**
   * Load chain definition from file or inline object
   */
  async loadChainDefinition(chainDefOrPath: ChainDefinition | string): Promise<ChainDefinition> {
    // If already an object, return it
    if (typeof chainDefOrPath === "object") {
      return chainDefOrPath;
    }

    // Otherwise, load from file
    const filePath = await this.resolveChainPath(chainDefOrPath);
    const content = await fs.readFile(filePath, "utf-8");

    // Parse YAML or JSON based on extension
    if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
      return yaml.load(content) as ChainDefinition;
    } else if (filePath.endsWith(".json")) {
      return JSON.parse(content) as ChainDefinition;
    } else {
      throw new Error(`Unsupported chain definition format: ${filePath}`);
    }
  }

  /**
   * Execute a chain
   */
  async execute(
    chainDefOrPath: ChainDefinition | string,
    options: ChainExecuteOptions = {}
  ): Promise<ChainExecuteResult> {
    // Load chain definition
    const chainDef = await this.loadChainDefinition(chainDefOrPath);

    // Initialize or resume workflow-data
    let workflowData: WorkflowData;
    let startStepIndex = 0;

    if (options.workflowId) {
      // Resume from existing workflow
      workflowData = await this.workflowDataService.load(options.workflowId);
      startStepIndex = workflowData.executedTemplates.length;
    } else {
      // Create new workflow
      workflowData = await this.workflowDataService.create(
        chainDef.name,
        options.initialData || {}
      );
    }

    let totalRenderTimeMs = 0;
    let stepsExecuted = 0;
    let failedSteps = 0;

    // Execute steps sequentially
    for (let i = startStepIndex; i < chainDef.steps.length; i++) {
      const step = chainDef.steps[i];

      try {
        // Execute step
        const stepResult = await this.executeStep(step, workflowData);
        totalRenderTimeMs += stepResult.renderTimeMs;
        stepsExecuted++;

        // Add execution record
        const record: ExecutionRecord = {
          stepId: step.id,
          templatePath: step.prompt,
          executedAt: new Date().toISOString(),
          outputFields: step.outputs,
          renderTimeMs: stepResult.renderTimeMs,
        };

        workflowData = await this.workflowDataService.addExecutionRecord(
          workflowData.id,
          record
        );

        // Check if we should pause
        if (options.pauseAfterStep !== undefined && i + 1 === options.pauseAfterStep) {
          break;
        }
      } catch (error) {
        failedSteps++;

        // Preserve workflow-data up to failed step for debugging
        await this.workflowDataService.save(workflowData);

        // Throw ChainExecutionError with context
        throw new ChainExecutionError(
          (error as Error).message,
          i,
          step.prompt,
          workflowData.id
        );
      }
    }

    return {
      workflowData,
      stepsExecuted,
      totalRenderTimeMs,
      failedSteps,
    };
  }

  /**
   * Execute a single step in the chain
   */
  private async executeStep(
    step: ChainStep,
    workflowData: WorkflowData
  ): Promise<{ renderTimeMs: number }> {
    // Resolve inputs from workflow-data
    const inputData: Record<string, unknown> = {};
    for (const inputField of step.inputs) {
      if (!(inputField in workflowData.data)) {
        throw new Error(
          `Missing required input field: ${inputField} for step ${step.id}`
        );
      }
      inputData[inputField] = workflowData.data[inputField];
    }

    // Load and render template
    const startTime = performance.now();
    const templatePath = await this.resolveTemplatePath(step.prompt);
    const templateContent = await fs.readFile(templatePath, "utf-8");

    const handlebarsService = getHandlebarsService();
    const renderResult = handlebarsService.renderWithWarnings(
      templateContent,
      inputData
    );

    const renderTimeMs = performance.now() - startTime;

    // Parse output (assume it's JSON if step expects structured output)
    let outputData: Record<string, unknown>;
    try {
      outputData = JSON.parse(renderResult.rendered);
    } catch {
      // If not JSON, treat as single string output
      // Use first output field name as key
      if (step.outputs.length === 0) {
        throw new Error(`Step ${step.id} has no output fields defined`);
      }
      outputData = { [step.outputs[0]]: renderResult.rendered };
    }

    // Apply field mappers if present
    if (step.mapper) {
      outputData = this.applyFieldMapper(outputData, step.mapper);
    }

    // Store outputs in workflow-data
    const updatedData: Record<string, unknown> = {};
    for (const outputField of step.outputs) {
      if (outputField in outputData) {
        updatedData[outputField] = outputData[outputField];
      } else {
        throw new Error(
          `Expected output field ${outputField} not found in step ${step.id} result`
        );
      }
    }

    await this.workflowDataService.updateData(workflowData.id, updatedData);

    return { renderTimeMs };
  }

  /**
   * Apply field mapper to translate output field names
   */
  private applyFieldMapper(
    data: Record<string, unknown>,
    mapper: Record<string, string>
  ): Record<string, unknown> {
    const mapped: Record<string, unknown> = { ...data };

    for (const [sourceField, targetField] of Object.entries(mapper)) {
      if (sourceField in mapped) {
        mapped[targetField] = mapped[sourceField];
        // Remove original field if it was renamed
        if (sourceField !== targetField) {
          delete mapped[sourceField];
        }
      }
    }

    return mapped;
  }

  /**
   * Resolve chain definition file path
   */
  private async resolveChainPath(relativePath: string): Promise<string> {
    // Check in test fixtures first (for unit tests)
    if (relativePath.startsWith("chains/")) {
      const testFixturePath = join(process.cwd(), "tests", "fixtures", relativePath);
      try {
        await fs.access(testFixturePath);
        return testFixturePath;
      } catch {
        // Not in test fixtures, continue
      }
    }

    // Otherwise, resolve from workspace config directory
    const configDir = await resolvePathAsync("config");
    return join(configDir, relativePath);
  }

  /**
   * Resolve template file path
   */
  private async resolveTemplatePath(relativePath: string): Promise<string> {
    const promptsDir = await resolvePathAsync("prompts");
    return join(promptsDir, relativePath);
  }
}
