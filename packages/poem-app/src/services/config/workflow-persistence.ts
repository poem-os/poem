/**
 * Workflow Persistence Service (Story 3.8)
 *
 * Persists the active workflow selection across sessions using a state file.
 * State file location: dev-workspace/.poem-state.json (gitignored)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getProjectRoot } from './poem-config.js';

/**
 * Workflow state stored to disk
 */
interface WorkflowState {
  /** Currently active workflow name */
  currentWorkflow: string;
  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Get the path to the workflow state file
 * Always stored in dev-workspace (gitignored) regardless of mode
 */
function getStatePath(): string {
  const projectRoot = getProjectRoot();
  return path.join(projectRoot, 'dev-workspace', '.poem-state.json');
}

/**
 * Load the persisted workflow state from disk
 * @returns WorkflowState if file exists, null if not found
 */
export async function loadWorkflowState(): Promise<WorkflowState | null> {
  const statePath = getStatePath();

  try {
    const content = await fs.readFile(statePath, 'utf-8');
    const state = JSON.parse(content) as WorkflowState;
    return state;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      // File doesn't exist yet - not an error
      return null;
    }
    // Other error (permission, parse error, etc.)
    console.warn(`[POEM] Error loading workflow state: ${err.message}`);
    return null;
  }
}

/**
 * Save the current workflow state to disk
 * @param workflowName - Name of the workflow to persist
 */
export async function saveWorkflowState(workflowName: string): Promise<void> {
  const statePath = getStatePath();

  const state: WorkflowState = {
    currentWorkflow: workflowName,
    updatedAt: new Date().toISOString(),
  };

  try {
    // Ensure directory exists
    const stateDir = path.dirname(statePath);
    await fs.mkdir(stateDir, { recursive: true });

    // Write state file
    await fs.writeFile(statePath, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    console.error(`[POEM] Error saving workflow state: ${err.message}`);
    throw error;
  }
}

/**
 * Clear the persisted workflow state
 * Used when user wants to reset to default
 */
export async function clearWorkflowState(): Promise<void> {
  const statePath = getStatePath();

  try {
    await fs.unlink(statePath);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      // File doesn't exist - not an error
      return;
    }
    console.warn(`[POEM] Error clearing workflow state: ${err.message}`);
  }
}
