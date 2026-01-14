/**
 * Chain Execution Types
 *
 * Defines the structure for workflow chain definitions and execution state.
 * Supports prompt chaining with data accumulation and field mapping.
 */

/**
 * Chain Definition - Specifies a sequence of prompts to execute
 */
export interface ChainDefinition {
  /** Chain name/identifier */
  name: string;

  /** Human-readable description */
  description?: string;

  /** Chain version */
  version: string;

  /** Ordered list of steps to execute */
  steps: ChainStep[];
}

/**
 * Individual step in a chain
 */
export interface ChainStep {
  /** Step identifier (unique within chain) */
  id: string;

  /** Prompt template path (relative to workspace prompts/) */
  prompt: string;

  /** Input field names required from workflow-data */
  inputs: string[];

  /** Output field names to store in workflow-data */
  outputs: string[];

  /** Optional field mapper: promptOutputField → workflowAttributeName */
  mapper?: Record<string, string>;

  /** Human-readable description */
  description?: string;
}

/**
 * WorkflowData - Runtime state that accumulates as prompts execute
 */
export interface WorkflowData {
  /** Unique execution ID */
  id: string;

  /** Workflow/chain name */
  workflowName: string;

  /** Timestamps */
  startedAt: string;
  updatedAt: string;

  /** Chain of executed templates */
  executedTemplates: ExecutionRecord[];

  /** Accumulated data from all prompts */
  data: Record<string, unknown>;

  /** Current checkpoint (reserved for Story 4.7, null for this story) */
  checkpoint?: CheckpointInfo | null;
}

/**
 * Execution record for a single step
 */
export interface ExecutionRecord {
  /** Step ID */
  stepId: string;

  /** Template path */
  templatePath: string;

  /** Execution timestamp (ISO 8601) */
  executedAt: string;

  /** Fields added to workflow data */
  outputFields: string[];

  /** Render time in ms */
  renderTimeMs: number;
}

/**
 * Checkpoint info (reserved for Story 4.7 - human-in-the-loop)
 */
export interface CheckpointInfo {
  /** Template requiring human input */
  templatePath: string;

  /** Type of input needed */
  inputType: "selection" | "freeform" | "approval";

  /** Options for selection type */
  options?: string[];

  /** Field to store result */
  outputField: string;
}

/**
 * Chain execution request
 */
export interface ChainExecuteRequest {
  /** Chain definition (inline object or path to YAML/JSON file) */
  chain: ChainDefinition | string;

  /** Initial data to start the chain (optional) */
  initialData?: Record<string, unknown>;

  /** Workflow ID for resume (optional) */
  workflowId?: string;

  /** Resume from last checkpoint (requires workflowId) */
  resume?: boolean;

  /** Pause after this step number (for testing pause/resume) */
  pauseAfterStep?: number;
}

/**
 * Chain execution response
 */
export interface ChainExecuteResponse {
  /** Success flag */
  success: boolean;

  /** Final workflow-data with all accumulated fields */
  workflowData: WorkflowData;

  /** Execution summary */
  executionSummary: {
    /** Number of steps executed */
    stepsExecuted: number;

    /** Total render time across all steps (ms) */
    totalRenderTimeMs: number;

    /** Number of failed steps */
    failedSteps: number;
  };

  /** Error message (if failed) */
  error?: string;

  /** Error details (if failed) */
  details?: {
    /** Failed step index */
    failedStep?: number;

    /** Template path that failed */
    templatePath?: string;

    /** Workflow ID for debugging */
    workflowDataId?: string;
  };
}

/**
 * Chain execution error with context
 */
export class ChainExecutionError extends Error {
  constructor(
    message: string,
    public stepIndex: number,
    public templatePath: string,
    public workflowDataId: string
  ) {
    super(message);
    this.name = "ChainExecutionError";
  }
}
