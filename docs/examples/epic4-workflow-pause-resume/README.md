# Example: Workflow Pause and Resume

**Pattern**: [Workflow Chain Execution](../../kdd/patterns/4-workflow-chain-execution.md)
**Pattern**: [WorkflowData File-Based Persistence](../../kdd/patterns/4-workflowdata-file-persistence.md)
**ADR**: [ADR-008: File-Based Workflow Persistence](../../kdd/decisions/adr-008-file-based-workflow-persistence.md)
**Story**: Story 4.6

## Purpose

Demonstrates pausing workflow execution mid-chain and resuming later, enabled by file-based workflow-data persistence.

## Setup

**Chain**: YouTube 3-step chain (abridge → analyze → generate titles)

## Step-by-Step Usage

### 1. Execute First 2 Steps (Pause After Step 2)

```bash
curl -X POST http://localhost:4321/api/chain/execute \
  -H "Content-Type: application/json" \
  -d '{
    "chain": {
      "name": "youtube-3-step-chain",
      "steps": [
        {
          "id": "abridge",
          "prompt": "1-4-abridge-v2.hbs",
          "inputs": ["rawTranscript"],
          "outputs": ["transcriptAbridgement"]
        },
        {
          "id": "analyze",
          "prompt": "4-1-analyze-content-essence.hbs",
          "inputs": ["transcriptAbridgement"],
          "outputs": ["contentEssence"],
          "mapper": {"contentEssence": "analyzeContentEssence"}
        }
      ]
    },
    "initialData": {
      "rawTranscript": "Welcome to this comprehensive tutorial..."
    },
    "pauseAfterStep": 2
  }'
```

**Response**:
```json
{
  "workflowData": {
    "id": "abc123xyz",  // ← Save this ID
    "workflowName": "youtube-3-step-chain",
    "data": {
      "rawTranscript": "...",
      "transcriptAbridgement": "...",
      "analyzeContentEssence": {...}
    },
    "executedTemplates": [
      {"templatePath": "1-4-abridge-v2.hbs", ...},
      {"templatePath": "4-1-analyze-content-essence.hbs", ...}
    ]
  },
  "executionSummary": {
    "stepsExecuted": 2,
    "totalRenderTimeMs": 557
  }
}
```

### 2. Inspect Persisted Workflow-Data

**File**: `dev-workspace/workflow-data/abc123xyz.json`

```json
{
  "id": "abc123xyz",
  "workflowName": "youtube-3-step-chain",
  "startedAt": "2026-01-14T10:00:00.000Z",
  "updatedAt": "2026-01-14T10:00:50.000Z",
  "data": {
    "rawTranscript": "Welcome to this comprehensive tutorial...",
    "transcriptAbridgement": "This tutorial covers AI automation...",
    "analyzeContentEssence": {
      "mainTopic": "AI Automation",
      "keywords": ["AI", "automation", "workflow"],
      "targetAudience": "developers"
    }
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
    }
  ],
  "checkpoint": null
}
```

**Note**: File is pretty-printed (2-space indentation) for human readability.

### 3. Resume from Saved State

**Later (different session, after server restart, etc.)**:

```bash
curl -X POST http://localhost:4321/api/chain/execute \
  -H "Content-Type: application/json" \
  -d '{
    "chain": {
      "name": "youtube-3-step-chain",
      "steps": [
        /* all 3 steps */
      ]
    },
    "workflowId": "abc123xyz",  // ← Load saved state
    "resume": true
  }'
```

**Behavior**:
1. Loads `dev-workspace/workflow-data/abc123xyz.json`
2. Skips already-executed steps (abridge, analyze)
3. Executes remaining step (generateTitles)
4. Returns final workflow-data with all 3 steps

**Final Response**:
```json
{
  "workflowData": {
    "id": "abc123xyz",
    "data": {
      "rawTranscript": "...",
      "transcriptAbridgement": "...",
      "analyzeContentEssence": {...},
      "titleCandidates": [  // ← New from step 3
        "How to Build AI Automation Systems: A Complete Guide",
        "AI Automation Made Easy: Step-by-Step Tutorial"
      ]
    },
    "executedTemplates": [
      {"templatePath": "1-4-abridge-v2.hbs", ...},
      {"templatePath": "4-1-analyze-content-essence.hbs", ...},
      {"templatePath": "5-1-generate-title-v2.hbs", ...}  // ← Added
    ]
  },
  "executionSummary": {
    "stepsExecuted": 3,
    "totalRenderTimeMs": 985
  }
}
```

## Key Concepts

**File-Based Persistence**: Workflow-data saved to `dev-workspace/workflow-data/{id}.json` after each step.

**Crash Recovery**: If server crashes at step 2, workflow-data file preserves steps 1-2. Resume from saved state.

**Human-Readable**: Open workflow-data file in VS Code → see exact state (data accumulated, execution history, timestamps).

**Atomic Writes**: Temp file + rename prevents file corruption if crash during write.

## Real-World Usage ⭐

- **VibeDeck Application**: Not yet tested (single-prompt workflows)
- **Production Status**: Validated with 3-step YouTube chain
- **Edge Cases Found**: Partial state preservation on error (steps 1-2 saved when step 3 fails)

## Epic 3 Pattern Reuse ⭐

- **Reused**: File-Based Everything (Epic 3) - prompts, schemas, config all files
- **Extended**: Workflow state persistence (new in Epic 4)

## Related Patterns

- [Workflow Chain Execution](../../kdd/patterns/4-workflow-chain-execution.md)
- [WorkflowData File-Based Persistence](../../kdd/patterns/4-workflowdata-file-persistence.md)
- [Config Service Single Source of Truth](../../kdd/patterns/config-service-single-source-of-truth.md) (Epic 3)

## References

- Story: `docs/stories/4.6.story.md`
- Service: `packages/poem-app/src/services/chain/workflow-data.ts`
- API: `packages/poem-app/src/pages/api/chain/execute.ts`
- Tests: 17/17 passing (workflow-data service), 6/6 integration tests

---

**Created**: 2026-01-19
**Source**: Epic 4 KDD Retrospective
