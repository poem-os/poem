# Example: Field Mapper in Prompt Chains

**Pattern**: [Field Mapper Pattern](../../kdd/patterns/4-field-mapper-pattern.md)
**Pattern**: [Workflow Chain Execution](../../kdd/patterns/4-workflow-chain-execution.md)
**ADR**: [ADR-006: Field Mapper Architecture](../../kdd/decisions/adr-006-field-mapper-architecture.md)
**Story**: Story 4.6

## Purpose

Demonstrates using field mappers to translate prompt output names to workflow-specific attribute names, preventing collisions when multiple prompts output similarly-named fields.

## Setup

**Files needed** (already exist from Story 4.6):
- Chain definition: `packages/poem-app/tests/fixtures/chains/youtube-3-step.yaml`
- Templates: `dev-workspace/workflows/youtube-launch-optimizer/prompts/`

## Step-by-Step Usage

### 1. Review Chain Definition

`youtube-3-step-chain.yaml`:

```yaml
name: youtube-3-step-chain
description: Abridge → Analyze → Generate Titles
version: 1.0.0

steps:
  - id: abridge
    prompt: 1-4-abridge-v2.hbs
    inputs: [rawTranscript]
    outputs: [transcriptAbridgement]
    # No mapper - field name is already specific

  - id: analyze
    prompt: 4-1-analyze-content-essence.hbs
    inputs: [transcriptAbridgement]
    outputs: [contentEssence]     # ← Generic name from prompt
    mapper:
      contentEssence: analyzeContentEssence  # ← Mapped to workflow-specific name

  - id: generateTitles
    prompt: 5-1-generate-title-v2.hbs
    inputs: [transcriptAbridgement, analyzeContentEssence]  # ← Uses mapped name
    outputs: [titleCandidates]
```

**Key**: Step 2 outputs `contentEssence` (prompt uses generic name), but it's stored as `analyzeContentEssence` (workflow-specific name).

### 2. Execute Chain

```bash
curl -X POST http://localhost:4321/api/chain/execute \
  -H "Content-Type: application/json" \
  -d '{
    "chain": {
      "name": "youtube-3-step-chain",
      "steps": [ /* chain definition */ ]
    },
    "initialData": {
      "rawTranscript": "Welcome to this comprehensive tutorial on AI automation..."
    }
  }'
```

### 3. Inspect Workflow-Data

After execution, workflow-data contains:

```json
{
  "id": "abc123xyz",
  "workflowName": "youtube-3-step-chain",
  "data": {
    "rawTranscript": "...",
    "transcriptAbridgement": "...",
    "analyzeContentEssence": {     // ← Mapped from contentEssence
      "mainTopic": "AI Automation",
      "keywords": ["AI", "automation"],
      "targetAudience": "developers"
    },
    "titleCandidates": ["...", "..."]
  },
  "executedTemplates": [
    {
      "templatePath": "4-1-analyze-content-essence.hbs",
      "outputFields": ["analyzeContentEssence"],  // ← Logged with mapped name
      "renderTimeMs": 312
    }
  ]
}
```

**Benefit**: Step 3's template can reference `{{analyzeContentEssence}}` (clear, descriptive) instead of ambiguous `{{contentEssence}}`.

## Key Concepts

**Problem Solved**: If step 2 and step 4 both output `analysis`, step 4 would overwrite step 2's data. Mapper prevents collision.

**When to Use Mapper**:
- Prompt uses generic name (`summary`, `result`, `analysis`)
- Workflow needs descriptive name (`sentimentAnalysis`, `topicAnalysis`)
- Multiple prompts produce similar-named outputs

**When to Skip Mapper**:
- Prompt already uses specific name (`transcriptAbridgement` - no collision risk)
- Single-prompt workflow (no chaining, no collisions possible)

## Real-World Usage ⭐

- **VibeDeck Application**: Not yet tested (single-prompt workflows)
- **Production Status**: Validated with YouTube 3-step chain
- **Edge Cases Found**: Missing mapped field logs warning but continues execution

## Epic 3 Pattern Reuse ⭐

- **Reused**: API-First Heavy Operations (Epic 3) - chain executor calls `/api/prompt/render`
- **New**: Field mappers (chains introduced in Epic 4)

## Related Patterns

- [Field Mapper Pattern](../../kdd/patterns/4-field-mapper-pattern.md)
- [Workflow Chain Execution](../../kdd/patterns/4-workflow-chain-execution.md)

## References

- Story: `docs/stories/4.6.story.md`
- Test Fixture: `packages/poem-app/tests/fixtures/chains/youtube-3-step.yaml`
- API: `packages/poem-app/src/pages/api/chain/execute.ts`
- Tests: 28/28 passing (including field mapper tests)

---

**Created**: 2026-01-19
**Source**: Epic 4 KDD Retrospective
