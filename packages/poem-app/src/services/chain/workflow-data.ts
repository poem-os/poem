/**
 * WorkflowData Service
 *
 * Manages workflow-data persistence and CRUD operations.
 * Stores workflow state as JSON files in dev-workspace/workflow-data/
 */

import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { WorkflowData, ExecutionRecord } from "./types.js";
import { resolvePathAsync } from "../config/poem-config.js";

/**
 * WorkflowDataService - Handles workflow-data persistence
 */
export class WorkflowDataService {
  private workflowDataDir: string | null = null;

  /**
   * Initialize the service and ensure workflow-data directory exists
   */
  async initialize(): Promise<void> {
    // Resolve workflow-data directory
    this.workflowDataDir = await resolvePathAsync("workflowData");

    // Ensure directory exists
    await fs.mkdir(this.workflowDataDir, { recursive: true });
  }

  /**
   * Create new workflow-data with unique ID
   */
  async create(workflowName: string, initialData: Record<string, unknown> = {}): Promise<WorkflowData> {
    if (!this.workflowDataDir) {
      await this.initialize();
    }

    const now = new Date().toISOString();
    const id = this.generateId();

    const workflowData: WorkflowData = {
      id,
      workflowName,
      startedAt: now,
      updatedAt: now,
      executedTemplates: [],
      data: { ...initialData },
      checkpoint: null,
    };

    // Save to file
    await this.save(workflowData);

    return workflowData;
  }

  /**
   * Load workflow-data by ID
   */
  async load(id: string): Promise<WorkflowData> {
    if (!this.workflowDataDir) {
      await this.initialize();
    }

    const filePath = join(this.workflowDataDir!, `${id}.json`);

    try {
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content) as WorkflowData;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new Error(`Workflow data not found: ${id}`);
      }
      throw new Error(`Failed to load workflow data: ${(error as Error).message}`);
    }
  }

  /**
   * Save workflow-data to file
   */
  async save(workflowData: WorkflowData): Promise<void> {
    if (!this.workflowDataDir) {
      await this.initialize();
    }

    workflowData.updatedAt = new Date().toISOString();

    const filePath = join(this.workflowDataDir!, `${workflowData.id}.json`);

    // Pretty-print JSON for human readability
    const content = JSON.stringify(workflowData, null, 2);

    await fs.writeFile(filePath, content, "utf-8");
  }

  /**
   * Update workflow data fields
   */
  async updateData(
    id: string,
    newData: Record<string, unknown>
  ): Promise<WorkflowData> {
    const workflowData = await this.load(id);

    // Merge new data into existing data
    workflowData.data = {
      ...workflowData.data,
      ...newData,
    };

    await this.save(workflowData);

    return workflowData;
  }

  /**
   * Add execution record to workflow-data
   */
  async addExecutionRecord(
    id: string,
    record: ExecutionRecord
  ): Promise<WorkflowData> {
    const workflowData = await this.load(id);

    workflowData.executedTemplates.push(record);

    await this.save(workflowData);

    return workflowData;
  }

  /**
   * Delete workflow-data file
   */
  async delete(id: string): Promise<void> {
    if (!this.workflowDataDir) {
      await this.initialize();
    }

    const filePath = join(this.workflowDataDir!, `${id}.json`);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        // Already deleted, no-op
        return;
      }
      throw new Error(`Failed to delete workflow data: ${(error as Error).message}`);
    }
  }

  /**
   * List all workflow-data files
   */
  async list(): Promise<string[]> {
    if (!this.workflowDataDir) {
      await this.initialize();
    }

    try {
      const files = await fs.readdir(this.workflowDataDir!);
      return files
        .filter((file) => file.endsWith(".json"))
        .map((file) => file.replace(".json", ""));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw new Error(`Failed to list workflow data: ${(error as Error).message}`);
    }
  }

  /**
   * Generate unique ID for workflow-data
   * Uses timestamp + random string for simplicity
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `${timestamp}-${randomStr}`;
  }
}
