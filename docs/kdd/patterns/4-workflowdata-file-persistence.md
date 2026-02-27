# WorkflowData File-Based Persistence

**Pattern**: Store workflow execution state as pretty-printed JSON files, enabling human inspection, crash recovery, and pause/resume without database dependencies.

**Source Stories**: Story 4.6 (Run Prompt Chain)

## Context

When to use this pattern:

- Need to preserve workflow state across sessions (pause/resume)
- Want human-readable execution logs (inspect workflow-data in editor)
- Debugging workflows (see exact state at point of failure)
- No database available or desired (keep infrastructure simple)
- Workflow state is document-oriented (not relational)

**Problem**: In-memory workflow state is lost on crash or server restart. Database adds complexity and infrastructure overhead for development workflows.

**Solution**: Persist workflow-data as JSON files after each step, with pretty-printing for human readability.

## Implementation

### File Structure

```
dev-workspace/
└── workflow-data/
    ├── abc123xyz.json       # Workflow execution "abc123xyz"
    ├── def456uvw.json       # Workflow execution "def456uvw"
    └── ghi789rst.json       # Workflow execution "ghi789rst"
```

**File Naming**: `{workflow-id}.json` where ID is generated via `nanoid()` (URL-safe, collision-resistant).

### JSON Format

```json
{
  "id": "abc123xyz",
  "workflowName": "youtube-3-step-chain",
  "startedAt": "2026-01-14T10:00:00.000Z",
  "updatedAt": "2026-01-14T10:01:30.000Z",
  "data": {
    "rawTranscript": "Welcome to this comprehensive tutorial...",
    "transcriptAbridgement": "This tutorial covers AI automation...",
    "analyzeContentEssence": {
      "mainTopic": "AI Automation",
      "keywords": ["AI", "automation", "workflow"],
      "targetAudience": "developers"
    },
    "titleCandidates": [
      "How to Build AI Automation Systems",
      "AI Automation Made Easy"
    ]
  },
  "executedTemplates": [
    {
      "templatePath": "1-4-abridge-v2.hbs",
      "executedAt": "2026-01-14T10:00:05.000Z",
      "outputFields": ["transcriptAbridgement"],
      "renderTimeMs": 245
    },
    {
      "templatePath": "4-1-analyze-content-essence.hbs",
      "executedAt": "2026-01-14T10:00:50.000Z",
      "outputFields": ["analyzeContentEssence"],
      "renderTimeMs": 312
    },
    {
      "templatePath": "5-1-generate-title-v2.hbs",
      "executedAt": "2026-01-14T10:01:25.000Z",
      "outputFields": ["titleCandidates"],
      "renderTimeMs": 428
    }
  ],
  "checkpoint": null
}
```

**Key Features**:
- **Pretty-printed** (2-space indentation) for human readability
- **ISO 8601 timestamps** (sortable, timezone-aware)
- **Execution history** (which templates ran, when, what they produced)
- **Accumulated data** (all fields from all steps)

### Persistence Service

```typescript
// WorkflowDataService
class WorkflowDataService {
  private basePath: string;

  constructor() {
    // Path from config service (workspace isolation)
    const config = new ConfigService();
    this.basePath = path.join(config.getWorkspaceRoot(), 'workflow-data');
  }

  async create(workflowName: string, initialData: Record<string, unknown>): Promise<WorkflowData> {
    // Generate unique ID
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

    // Ensure directory exists
    await fs.promises.mkdir(this.basePath, { recursive: true });

    // Pretty-print with 2-space indentation
    const json = JSON.stringify(workflowData, null, 2);

    // Atomic write (write to temp file, then rename)
    const tempPath = `${filePath}.tmp`;
    await fs.promises.writeFile(tempPath, json, 'utf-8');
    await fs.promises.rename(tempPath, filePath);
  }

  async load(id: string): Promise<WorkflowData> {
    const filePath = path.join(this.basePath, `${id}.json`);

    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Workflow data not found: ${id}`);
      }
      throw error;
    }
  }

  async updateData(id: string, newData: Record<string, unknown>): Promise<void> {
    const workflowData = await this.load(id);
    Object.assign(workflowData.data, newData);
    workflowData.updatedAt = new Date().toISOString();
    await this.save(workflowData);
  }

  async addExecutionRecord(id: string, record: ExecutionRecord): Promise<void> {
    const workflowData = await this.load(id);
    workflowData.executedTemplates.push(record);
    workflowData.updatedAt = new Date().toISOString();
    await this.save(workflowData);
  }
}
```

## Example: Pause and Resume

### Execute First 2 Steps, Pause

```typescript
const workflow = await workflowDataService.create('youtube-3-step-chain', {
  rawTranscript: '...'
});

// Execute step 1
await chainExecutor.executeStep(steps[0], workflow);
await workflowDataService.save(workflow);  // ← Persist after step 1

// Execute step 2
await chainExecutor.executeStep(steps[1], workflow);
await workflowDataService.save(workflow);  // ← Persist after step 2

console.log('Workflow ID:', workflow.id);  // "abc123xyz"
// User can inspect file: dev-workspace/workflow-data/abc123xyz.json
```

### Resume Later (Different Session)

```typescript
// Load workflow state from file
const workflow = await workflowDataService.load('abc123xyz');

console.log('Executed so far:', workflow.executedTemplates.length);  // 2
console.log('Data accumulated:', Object.keys(workflow.data));
// ["rawTranscript", "transcriptAbridgement", "analyzeContentEssence"]

// Resume from step 3
await chainExecutor.executeStep(steps[2], workflow);
await workflowDataService.save(workflow);  // ← Final state

console.log('Completed:', workflow.executedTemplates.length);  // 3
```

## Rationale

**Why File-Based Persistence?**

1. **No Database Required**: Simple JSON files, no PostgreSQL/MongoDB setup
2. **Human-Readable**: Open file in VS Code, see exact workflow state
3. **Version Control Friendly**: Check in test workflow-data files as fixtures
4. **Portable**: Copy file to different machine for debugging
5. **Crash Recovery**: File persisted after each step - never lose progress
6. **Atomic Writes**: Temp file + rename ensures consistency (no partial writes)

**Why Pretty-Print?**

- **Debugging**: Readable JSON when opened in editor
- **Diffs**: Git diffs show meaningful changes (not one-line JSON)
- **Inspection**: Console.log workflow-data, see structure clearly

**Trade-offs**:
- Slower than database (file I/O per step) - acceptable for development workflows
- No query capability (can't search across workflows) - not needed for POEM use case
- File size growth (large data accumulates) - mitigated by workflow-scoped cleanup

## Architecture Alignment ⭐

- **Designed in**: `docs/architecture/coding-standards.md` (File-Based Everything principle)
- **Implementation Status**: ✅ **Aligned** - "WorkflowData stored as JSON files (no database)"
- **Deviation Rationale**: N/A - Follows file-based philosophy throughout POEM

**Validation**: 17/17 WorkflowDataService tests passing. Tested create, load, save, update, ENOENT handling.

## Evolution from Epic 3 ⭐

- **Relationship**: **New** pattern (Epic 3 had no workflow state persistence)
- **Epic 3 Pattern**: No comparable pattern (single-prompt execution, no multi-step state)
- **Changes**: N/A

**Building Blocks from Epic 3**:
- Uses **Config Service** for path resolution (workspace isolation)
- Follows **File-Based Everything** principle established in Epic 3

**Key Innovation**: Introduced durable workflow state for multi-step execution with crash recovery.

## Real-World Validation ⭐

- **VibeDeck Status**: **Blocked** - VibeDeck doesn't have multi-step workflows yet
- **Gap Analysis Reference**: Not mentioned in `vibedeck-observations.jsonl`
- **Edge Cases Discovered**:
  - **ENOENT handling**: Load nonexistent ID throws descriptive error (not generic file error)
  - **Concurrent writes**: Temp file + rename pattern prevents corruption (atomic writes)
  - **Nested data structures**: JSON serialization handles complex objects, arrays, nested fields correctly
  - **Timestamp precision**: ISO 8601 format with milliseconds (`2026-01-14T10:00:00.000Z`)

**Production Readiness**: Pattern validated with 17 unit tests, 6 API integration tests. Successfully persisted 3-step YouTube chain execution. Quality score: 100/100 (Story 4.6 QA gate).

## Related Patterns

- **[Workflow Chain Execution](4-workflow-chain-execution.md)** (Epic 4) - Chain executor calls this service for state persistence
- **[Config Service Single Source of Truth](config-service-single-source-of-truth.md)** (Epic 3) - Paths resolved via config service

## Anti-Patterns

```typescript
// ❌ ANTI-PATTERN: In-memory only (no persistence)
const workflowData = { id: '...', data: {} };
// WRONG: Lost on crash, can't resume

// ❌ ANTI-PATTERN: Database for simple workflows
await db.workflows.create({ ... });
// WRONG: Infrastructure overhead, not human-readable

// ❌ ANTI-PATTERN: Minified JSON
fs.writeFileSync(path, JSON.stringify(data));
// WRONG: Not human-readable, hard to debug

// ❌ ANTI-PATTERN: Non-atomic writes
fs.writeFileSync(path, JSON.stringify(data, null, 2));
// WRONG: Crash during write = corrupted file

// ✅ CORRECT: Pretty-print with atomic writes
const tempPath = `${path}.tmp`;
fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
fs.renameSync(tempPath, path);  // Atomic
```

## Implementation Checklist

When implementing file-based workflow persistence:

- [ ] Use config service for base path resolution (workspace isolation)
- [ ] Generate unique IDs with `nanoid()` (URL-safe, collision-resistant)
- [ ] Pretty-print JSON with 2-space indentation (`JSON.stringify(data, null, 2)`)
- [ ] Use atomic writes (write to temp file, rename)
- [ ] Handle ENOENT errors gracefully (descriptive error messages)
- [ ] Include ISO 8601 timestamps (sortable, timezone-aware)
- [ ] Ensure directory exists before writing (`fs.mkdir(path, { recursive: true })`)
- [ ] Test edge cases: load nonexistent ID, concurrent writes, large data
- [ ] Document cleanup strategy (manual deletion vs automated)

## References

- **Story**: `docs/stories/4.6.story.md` (Run Prompt Chain)
- **Implementation**:
  - Service: `packages/poem-app/src/services/chain/workflow-data.ts` (WorkflowDataService)
  - Types: `packages/poem-app/src/services/chain/types.ts` (WorkflowData interface)
- **Tests**:
  - `packages/poem-app/tests/services/chain/workflow-data.test.ts` (17 tests)
    - create, load, save, updateData, addExecutionRecord
    - ENOENT handling, concurrent writes
- **QA Gate**: `docs/qa/gates/4.6-run-prompt-chain.yml` (Quality Score: 100/100)
- **Coding Standards**: `docs/architecture/coding-standards.md` (File-Based Everything principle)
- **Data Model**: `docs/architecture/data-models.md` (WorkflowData interface, lines 185-243)
- **Decision Record**: [ADR-008: File-Based Workflow Persistence](../decisions/adr-008-file-based-workflow-persistence.md)

---

**Pattern Established**: Story 4.6 (2026-01-14)
**New Pattern**: First durable workflow state in POEM
**Last Updated**: 2026-01-19
