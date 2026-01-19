# Workflow Chain Execution

**Pattern**: Execute sequences of prompts where outputs from each step accumulate in workflow-data and feed into subsequent steps, with file-based persistence enabling pause/resume.

**Source Stories**: Story 4.6 (Run Prompt Chain)

## Context

When to use this pattern:

- Building multi-step AI workflows where prompts build on each other's outputs
- Need to persist intermediate results for debugging or resume after failure
- Want to track execution history (which prompts ran, when, what they produced)
- Testing complex workflows step-by-step
- Implementing human-in-the-loop workflows (pause for approval, resume after input)

**Problem**: Running prompts individually requires manual data management - copy output from prompt A, paste as input to prompt B, track what ran when. This doesn't scale and loses execution history.

**Solution**: Chain executor orchestrates prompt sequence, accumulates outputs in workflow-data, persists state after each step, and logs execution records.

## Implementation

### Chain Definition Structure

```typescript
interface ChainDefinition {
  name: string;                // Chain identifier
  description?: string;        // Human-readable description
  version: string;             // Chain version
  steps: ChainStep[];          // Sequential steps
}

interface ChainStep {
  id: string;                  // Step identifier
  prompt: string;              // Template path (e.g., "5-1-generate-title-v2.hbs")
  inputs: string[];            // Field names from workflow-data
  outputs: string[];           // Fields this step produces
  mapper?: Record<string, string>; // Optional field name translation
}
```

### Workflow-Data State

```typescript
interface WorkflowData {
  id: string;                  // Unique execution ID (nanoid)
  workflowName: string;        // Chain name
  startedAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
  data: Record<string, unknown>; // Accumulated fields from all steps
  executedTemplates: ExecutionRecord[]; // Execution history
  checkpoint?: CheckpointInfo; // Reserved for Story 4.7 (human-in-the-loop)
}

interface ExecutionRecord {
  templatePath: string;        // Template that executed
  executedAt: string;          // ISO 8601 timestamp
  outputFields: string[];      // Fields added to workflow-data
  renderTimeMs: number;        // Execution time
}
```

### Execution Algorithm

```typescript
class ChainExecutorService {
  async executeChain(
    chainDef: ChainDefinition,
    initialData: Record<string, unknown>,
    workflowId?: string  // For resume
  ): Promise<WorkflowData> {
    // 1. Initialize or load workflow-data
    let workflowData = workflowId
      ? await this.workflowDataService.load(workflowId)
      : await this.workflowDataService.create(chainDef.name, initialData);

    // 2. Execute each step sequentially
    for (const step of chainDef.steps) {
      // Skip already-executed steps (resume scenario)
      if (this.isStepExecuted(step, workflowData)) {
        continue;
      }

      await this.executeStep(step, workflowData);

      // 3. Persist after each step (enables pause/resume)
      await this.workflowDataService.save(workflowData);
    }

    return workflowData;
  }

  private async executeStep(step: ChainStep, workflowData: WorkflowData): Promise<void> {
    const start = performance.now();

    // 1. Resolve inputs from accumulated workflow-data
    const inputData = this.resolveInputs(step.inputs, workflowData.data);

    // 2. Check all required inputs present
    const missingInputs = step.inputs.filter(f => !inputData.hasOwnProperty(f));
    if (missingInputs.length > 0) {
      throw new ChainExecutionError(
        `Missing required inputs: ${missingInputs.join(', ')}`,
        step.id,
        step.prompt,
        workflowData.id
      );
    }

    // 3. Render prompt (calls HandlebarsService)
    const rendered = await this.renderPrompt(step.prompt, inputData);

    // 4. Parse output (detect JSON vs plain text)
    const outputData = this.parseOutput(rendered);

    // 5. Apply field mapper (if present)
    const mappedData = step.mapper
      ? this.applyFieldMapper(outputData, step.mapper)
      : outputData;

    // 6. Accumulate in workflow-data
    Object.assign(workflowData.data, mappedData);

    // 7. Log execution record
    const renderTimeMs = performance.now() - start;
    workflowData.executedTemplates.push({
      templatePath: step.prompt,
      executedAt: new Date().toISOString(),
      outputFields: Object.keys(mappedData),
      renderTimeMs
    });

    // 8. Update timestamp
    workflowData.updatedAt = new Date().toISOString();
  }
}
```

### File-Based Persistence

```typescript
// WorkflowDataService
class WorkflowDataService {
  private basePath = 'dev-workspace/workflow-data/'; // Via config service

  async create(workflowName: string, initialData: Record<string, unknown>): Promise<WorkflowData> {
    const id = nanoid();
    const workflowData: WorkflowData = {
      id,
      workflowName,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: initialData,
      executedTemplates: [],
      checkpoint: null
    };

    await this.save(workflowData);
    return workflowData;
  }

  async save(workflowData: WorkflowData): Promise<void> {
    const filePath = path.join(this.basePath, `${workflowData.id}.json`);
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(workflowData, null, 2), // Pretty-print for human readability
      'utf-8'
    );
  }

  async load(id: string): Promise<WorkflowData> {
    const filePath = path.join(this.basePath, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }
}
```

## Example

### Chain Definition (YAML)

```yaml
# youtube-3-step-chain.yaml
name: youtube-3-step-chain
description: Abridge → Analyze → Generate Titles
version: 1.0.0

steps:
  - id: abridge
    prompt: 1-4-abridge-v2.hbs
    inputs: [rawTranscript]
    outputs: [transcriptAbridgement]

  - id: analyze
    prompt: 4-1-analyze-content-essence.hbs
    inputs: [transcriptAbridgement]
    outputs: [contentEssence]
    mapper:
      contentEssence: analyzeContentEssence

  - id: generateTitles
    prompt: 5-1-generate-title-v2.hbs
    inputs: [transcriptAbridgement, analyzeContentEssence]
    outputs: [titleCandidates]
```

### Execution Flow

```typescript
// Initial data
const initialData = {
  rawTranscript: "Welcome to this comprehensive tutorial on AI automation..."
};

// Execute chain
const result = await chainExecutor.executeChain(
  chainDefinition,
  initialData
);

// Result workflow-data
{
  "id": "abc123xyz",
  "workflowName": "youtube-3-step-chain",
  "startedAt": "2026-01-14T10:00:00Z",
  "updatedAt": "2026-01-14T10:01:30Z",
  "data": {
    "rawTranscript": "Welcome to this comprehensive tutorial...",
    "transcriptAbridgement": "This tutorial covers AI automation fundamentals...",
    "analyzeContentEssence": {
      "mainTopic": "AI Automation",
      "keywords": ["AI", "automation", "workflow"],
      "targetAudience": "developers"
    },
    "titleCandidates": [
      "How to Build AI Automation Systems: A Complete Guide",
      "AI Automation Made Easy: Step-by-Step Tutorial",
      "Master AI Workflows: From Basics to Production"
    ]
  },
  "executedTemplates": [
    {
      "templatePath": "1-4-abridge-v2.hbs",
      "executedAt": "2026-01-14T10:00:05Z",
      "outputFields": ["transcriptAbridgement"],
      "renderTimeMs": 245
    },
    {
      "templatePath": "4-1-analyze-content-essence.hbs",
      "executedAt": "2026-01-14T10:00:50Z",
      "outputFields": ["analyzeContentEssence"],
      "renderTimeMs": 312
    },
    {
      "templatePath": "5-1-generate-title-v2.hbs",
      "executedAt": "2026-01-14T10:01:25Z",
      "outputFields": ["titleCandidates"],
      "renderTimeMs": 428
    }
  ]
}
```

### Pause and Resume

```typescript
// Execute first 2 steps, then pause
const partial = await chainExecutor.executeChain(
  chainDefinition,
  initialData,
  { pauseAfterStep: 2 }
);

console.log(partial.id); // "abc123xyz"
console.log(partial.executedTemplates.length); // 2

// Later: Resume from step 3
const final = await chainExecutor.executeChain(
  chainDefinition,
  {}, // Initial data not needed (loaded from workflow-data file)
  { workflowId: "abc123xyz", resume: true }
);

console.log(final.executedTemplates.length); // 3 (all steps complete)
```

## Rationale

**Why Chain Execution?**

1. **Data Accumulation**: Each step adds to workflow-data - downstream steps access all prior outputs
2. **Execution History**: Audit trail shows what ran, when, and what it produced
3. **Pause/Resume**: File-based persistence enables stopping mid-chain and resuming later
4. **Debugging**: Workflow-data files are human-readable JSON - inspect state at any point
5. **Performance Tracking**: Render times logged for each step - identify bottlenecks

**Why File-Based Persistence?**

- Simple (no database dependencies)
- Inspectable (open file in editor, see exact state)
- Portable (copy file to debug elsewhere)
- Atomic (save after each step - never lose progress)

**Architecture Decision**: Story 4.6 chose JSON files over database because POEM is file-based throughout (prompts, schemas, config all files). Consistency > performance for development workflows.

## Architecture Alignment ⭐

- **Designed in**: `docs/architecture/core-workflows.md` (Workflow 4: Prompt Chain Execution, lines 127-168)
- **Implementation Status**: ✅ **Aligned** - Implements sequence diagram from architecture exactly
- **Deviation Rationale**: N/A - Implementation follows design

**Validation**:
- Architecture specified: "Store output fields in workflow-data" ✅
- Architecture specified: "Save workflow-data.json" after each step ✅
- Architecture specified: Prompt Engineer agent orchestrates ✅ (via API endpoint)

## Evolution from Epic 3 ⭐

- **Relationship**: **New** pattern (no Epic 3 equivalent)
- **Epic 3 Pattern**: No chain execution in Epic 3 (individual prompts only)
- **Changes**: N/A

**Building Blocks from Epic 3**:
- Uses **API-First Heavy Operations** pattern - chain executor calls `/api/prompt/render`
- Uses **Config Service Single Source of Truth** - paths resolved via config
- Uses **Workflow-Scoped Resource Management** - templates loaded from workflow directories

**Key Innovation**: Epic 3 provided single-prompt building blocks. Epic 4 adds orchestration layer that composes prompts into workflows.

## Real-World Validation ⭐

- **VibeDeck Status**: **Untested** - VibeDeck has single-prompt workflows, not chains yet
- **Gap Analysis Reference**: Observation #5 (vibedeck-observations.jsonl) mentions "prompt templates vs prompt instances" pattern - suggests VibeDeck needs meta-template chaining, not yet tested
- **Edge Cases Discovered**:
  - **Missing input field**: ChainExecutionError with step ID, template path, workflow ID (comprehensive error context)
  - **Partial state preservation**: If step 2 fails, workflow-data contains step 1's outputs (enables debugging and potential resume after fix)
  - **Test template creation**: Some tests create templates in `beforeEach` - documented in SAT guide troubleshooting

**Production Readiness**: Pattern validated through 28/28 unit tests (WorkflowDataService + ChainExecutorService) and 6 API integration tests. Quality score: 100/100 (QA gate). Successfully executed 3-step YouTube chain with 53 real templates.

## Related Patterns

- **[Field Mapper Pattern](4-field-mapper-pattern.md)** (Epic 4) - Enables name translation during chain execution
- **[API-First Heavy Operations](api-first-heavy-operations.md)** (Epic 3) - Chain executor calls render API, not service directly
- **[Config Service Single Source of Truth](config-service-single-source-of-truth.md)** (Epic 3) - Paths resolved via config service
- **[Workflow-Scoped Resource Management](workflow-scoped-resource-management.md)** (Epic 3) - Templates loaded from workflow directories

## Anti-Patterns

```typescript
// ❌ ANTI-PATTERN: No persistence between steps
for (const step of steps) {
  await executeStep(step, workflowData);
}
// Save only at end
await save(workflowData);
// WRONG: If crash at step 3, lose all progress

// ❌ ANTI-PATTERN: No execution records
workflowData.data[step.outputs[0]] = rendered;
// WRONG: No audit trail - can't see what ran when

// ❌ ANTI-PATTERN: Hardcoded step dependencies
const abridgement = await render('abridge.hbs', { rawTranscript });
const analysis = await render('analyze.hbs', { transcriptAbridgement: abridgement });
// WRONG: Not declarative, can't pause/resume, no state persistence

// ❌ ANTI-PATTERN: In-memory workflow-data only
const workflowData = { data: {} }; // Not persisted
// WRONG: Can't resume after crash, debugging requires console logs
```

## Implementation Checklist

When creating a new prompt chain:

- [ ] Define chain YAML/JSON with steps array
- [ ] Specify `inputs` for each step (fields from workflow-data)
- [ ] Specify `outputs` for each step (fields produced)
- [ ] Add `mapper` if prompt uses generic names that need translation
- [ ] Test with initial data containing required fields
- [ ] Test pause/resume by executing partial chain and resuming
- [ ] Verify workflow-data file created in `dev-workspace/workflow-data/`
- [ ] Verify execution records logged with timestamps and render times
- [ ] Test error scenario (missing input, template not found)
- [ ] Validate final workflow-data contains all accumulated fields

## References

- **Story**: `docs/stories/4.6.story.md` (Run Prompt Chain)
- **Implementation**:
  - Chain Executor: `packages/poem-app/src/services/chain/executor.ts` (ChainExecutorService)
  - Workflow Data: `packages/poem-app/src/services/chain/workflow-data.ts` (WorkflowDataService)
  - Types: `packages/poem-app/src/services/chain/types.ts` (interfaces)
  - API: `packages/poem-app/src/pages/api/chain/execute.ts` (REST endpoint)
- **Tests**:
  - `packages/poem-app/tests/services/chain/workflow-data.test.ts` (17 tests)
  - `packages/poem-app/tests/services/chain/executor.test.ts` (11 tests)
  - `packages/poem-app/tests/api/chain-execute.test.ts` (6 integration tests)
- **Test Fixtures**:
  - `packages/poem-app/tests/fixtures/chains/youtube-3-step.yaml` (example chain)
  - `packages/poem-app/tests/fixtures/chains/simple-chain.yaml` (minimal chain)
- **QA Gate**: `docs/qa/gates/4.6-run-prompt-chain.yml` (Quality Score: 100/100)
- **Architecture**: `docs/architecture/core-workflows.md` (Workflow 4: Prompt Chain Execution)
- **Data Model**: `docs/architecture/data-models.md` (WorkflowData interface, lines 185-243)

---

**Pattern Established**: Story 4.6 (2026-01-14)
**New Pattern**: Extends Epic 3 building blocks into orchestration layer
**Last Updated**: 2026-01-19
