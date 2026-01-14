/**
 * POST /api/chain/execute
 * Executes a prompt chain with data accumulation
 */

import type { APIContext } from "astro";
import { z } from "zod";
import { ChainExecutorService } from "../../../services/chain/executor.js";
import type { ChainDefinition, ChainExecuteResponse } from "../../../services/chain/types.js";

/**
 * Request schema with Zod validation
 */
const ChainStepSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  inputs: z.array(z.string()),
  outputs: z.array(z.string()),
  mapper: z.record(z.string()).optional(),
  description: z.string().optional(),
});

const ChainDefinitionSchema = z.object({
  name: z.string().min(1, "Chain name is required"),
  description: z.string().optional(),
  version: z.string().min(1, "Chain version is required"),
  steps: z.array(ChainStepSchema).min(1, "At least one step is required"),
});

const ExecuteRequestSchema = z.object({
  chain: z.union([ChainDefinitionSchema, z.string().min(1)]),
  initialData: z.record(z.unknown()).optional(),
  workflowId: z.string().optional(),
  resume: z.boolean().optional().default(false),
  pauseAfterStep: z.number().int().positive().optional(),
});

/**
 * Request interface
 */
export interface ExecuteRequest {
  chain: ChainDefinition | string;
  initialData?: Record<string, unknown>;
  workflowId?: string;
  resume?: boolean;
  pauseAfterStep?: number;
}

/**
 * POST handler
 */
export async function POST({ request }: APIContext): Promise<Response> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = ExecuteRequestSchema.parse(body);

    // Create executor service
    const executor = new ChainExecutorService();

    // Execute chain
    const startTime = performance.now();
    const result = await executor.execute(validatedRequest.chain, {
      initialData: validatedRequest.initialData,
      workflowId: validatedRequest.workflowId,
      pauseAfterStep: validatedRequest.pauseAfterStep,
    });
    const executionTimeMs = performance.now() - startTime;

    // Build response
    const response: ChainExecuteResponse = {
      success: true,
      workflowData: result.workflowData,
      executionSummary: {
        stepsExecuted: result.stepsExecuted,
        totalRenderTimeMs: result.totalRenderTimeMs,
        failedSteps: result.failedSteps,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request format",
          details: {
            validationErrors: error.errors,
          },
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Handle ChainExecutionError with context
    if (error.name === "ChainExecutionError") {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
          details: {
            failedStep: error.stepIndex,
            templatePath: error.templatePath,
            workflowDataId: error.workflowDataId,
          },
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Chain execution failed",
        details: {
          errorType: error.name || "Unknown",
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
