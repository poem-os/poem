# Field Mapper Pattern

**Pattern**: Translate prompt-specific field names to workflow attribute names when storing outputs in workflow-data, enabling prompts to use natural naming while maintaining consistent workflow vocabulary.

**Source Stories**: Story 4.6 (Run Prompt Chain)

## Context

When to use this pattern:

- Building prompt chains where outputs from one prompt feed into subsequent prompts
- Need prompts to use domain-natural field names (e.g., `contentEssence` in prompt)
- Want consistent workflow attribute naming (e.g., `analyzeContentEssence` in workflow-data)
- Different prompts produce similar outputs that should be stored under different keys
- Refactoring prompts without breaking workflow contracts

**Problem**: Prompts often use generic, natural names for their outputs (`title`, `summary`, `analysis`). When multiple prompts in a workflow produce similarly-named fields, they collide. Example: Three prompts each output `summary` - which one does step 4 use?

**Solution**: Use optional mapper objects in chain definitions to translate prompt output names to workflow-specific attribute names.

## Implementation

### Chain Definition with Mappers

```yaml
# Example: YouTube 3-step chain
name: youtube-3-step-chain
description: Abridge → Analyze → Generate Titles
version: 1.0.0

steps:
  - id: abridge
    prompt: 1-4-abridge-v2.hbs
    inputs: [rawTranscript]
    outputs: [transcriptAbridgement]
    # No mapper needed - field name is already specific

  - id: analyze
    prompt: 4-1-analyze-content-essence.hbs
    inputs: [transcriptAbridgement]
    outputs: [contentEssence]    # Prompt uses generic name
    mapper:
      contentEssence: analyzeContentEssence  # Stored as workflow-specific name

  - id: generateTitles
    prompt: 5-1-generate-title-v2.hbs
    inputs: [transcriptAbridgement, analyzeContentEssence]
    outputs: [titleCandidates]
    # No mapper needed
```

**Key**: The `mapper` object translates `promptFieldName` → `workflowAttributeName`.

### Service Implementation

```typescript
// ChainExecutorService.executeStep()
async executeStep(step: ChainStep, workflowData: WorkflowData): Promise<void> {
  // 1. Resolve inputs from workflow-data
  const inputData = this.resolveInputs(step.inputs, workflowData.data);

  // 2. Render prompt
  const rendered = await this.renderPrompt(step.prompt, inputData);

  // 3. Parse output (JSON or raw text)
  const outputData = this.parseOutput(rendered);

  // 4. Apply field mapper (if present)
  const mappedData = step.mapper
    ? this.applyFieldMapper(outputData, step.mapper)
    : outputData;

  // 5. Store in workflow-data
  Object.assign(workflowData.data, mappedData);

  // 6. Log execution record
  workflowData.executedTemplates.push({
    templatePath: step.prompt,
    executedAt: new Date().toISOString(),
    outputFields: Object.keys(mappedData),
    renderTimeMs: /* timing */
  });
}

private applyFieldMapper(
  data: Record<string, unknown>,
  mapper: Record<string, string>
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [promptField, workflowField] of Object.entries(mapper)) {
    if (data.hasOwnProperty(promptField)) {
      mapped[workflowField] = data[promptField];
    } else {
      // Prompt didn't output expected field - warning or error
      this.warnings.push(`Mapper expected field '${promptField}' but prompt did not output it`);
    }
  }

  // Include unmapped fields as-is (pass-through)
  for (const [key, value] of Object.entries(data)) {
    if (!mapper.hasOwnProperty(key)) {
      mapped[key] = value;
    }
  }

  return mapped;
}
```

### Workflow-Data Structure

```typescript
// After step 2 (analyze) executes:
{
  "id": "yt-workflow-001",
  "workflowName": "youtube-3-step-chain",
  "data": {
    "rawTranscript": "...",              // Initial data
    "transcriptAbridgement": "...",      // From step 1
    "analyzeContentEssence": {           // From step 2 (mapped!)
      "mainTopic": "AI Automation",
      "keywords": ["AI", "automation", "workflow"],
      "targetAudience": "developers"
    }
    // Note: Stored as "analyzeContentEssence", not "contentEssence"
  },
  "executedTemplates": [
    {
      "templatePath": "1-4-abridge-v2.hbs",
      "executedAt": "2026-01-14T10:00:00Z",
      "outputFields": ["transcriptAbridgement"],
      "renderTimeMs": 245
    },
    {
      "templatePath": "4-1-analyze-content-essence.hbs",
      "executedAt": "2026-01-14T10:00:15Z",
      "outputFields": ["analyzeContentEssence"],  // Mapped name logged
      "renderTimeMs": 312
    }
  ]
}
```

## Example

### Scenario: Multiple Analysis Steps

```yaml
# Workflow with 3 analysis prompts
name: multi-analysis-chain

steps:
  - id: sentiment-analysis
    prompt: analyze-sentiment.hbs
    inputs: [text]
    outputs: [analysis]    # Generic name
    mapper:
      analysis: sentimentAnalysis  # → workflow attribute

  - id: topic-analysis
    prompt: analyze-topics.hbs
    inputs: [text]
    outputs: [analysis]    # Same generic name
    mapper:
      analysis: topicAnalysis  # → different workflow attribute

  - id: summarize
    prompt: generate-summary.hbs
    inputs: [sentimentAnalysis, topicAnalysis]  # Uses mapped names
    outputs: [summary]
```

**Without mapper**: Step 2 would overwrite step 1's `analysis` field.

**With mapper**: Each analysis stored under unique key (`sentimentAnalysis`, `topicAnalysis`).

## Rationale

**Why Field Mappers?**

1. **Prompt Reusability**: Prompts can use natural, generic names (`summary`, `result`, `analysis`)
2. **Namespace Isolation**: Multiple prompts can output fields with same names without collision
3. **Workflow Clarity**: Workflow-data uses descriptive, unambiguous attribute names
4. **Refactoring Safety**: Change prompt field names without breaking workflow consumers
5. **Explicit Contracts**: Mapper documents the semantic relationship (prompt output → workflow attribute)

**Trade-offs**:
- Adds indirection (field name != stored name)
- Requires mapper maintenance if prompt outputs change
- But: Prevents collisions and enables reusable prompts

**Alternative Considered**: Prefix all prompt outputs with step ID (e.g., `analyze_contentEssence`). **Rejected** because it couples workflow-data to chain structure. If steps are reordered, attribute names change.

## Architecture Alignment ⭐

- **Designed in**: `docs/architecture/core-workflows.md` (Workflow 4: Prompt Chain Execution, lines 127-168)
- **Implementation Status**: ✅ **Aligned** - Implements data accumulation pattern from architecture
- **Deviation Rationale**: N/A - Mapper concept not in original architecture but consistent with design philosophy

**Validation**: 28/28 chain executor tests passing. Field mapper logic validated with 3 unit tests.

## Evolution from Epic 3 ⭐

- **Relationship**: **New** pattern (no Epic 3 equivalent)
- **Epic 3 Pattern**: No comparable pattern in Epic 3 (chains weren't implemented)
- **Changes**: N/A

**Rationale for New Pattern**: Epic 3 focused on individual prompts. Epic 4 introduced prompt chaining, revealing the need for namespace management across multiple prompt outputs.

## Real-World Validation ⭐

- **VibeDeck Status**: **Blocked** - VibeDeck doesn't have multi-prompt workflows yet (observation #1 in `vibedeck-observations.jsonl` mentions single-workflow structure, not chains)
- **Gap Analysis Reference**: Not directly mentioned, but observation #4 suggests extensibility gaps that would affect chain patterns
- **Edge Cases Discovered**:
  - **Missing mapped field**: If prompt doesn't output a field specified in mapper, warning logged but execution continues (graceful degradation)
  - **Unmapped fields pass-through**: Fields not in mapper are included in workflow-data as-is (default behavior)
  - **Empty mapper**: Valid (no translation performed) - allows chain definition flexibility

**Production Readiness**: Pattern validated through 6 API integration tests and 11 ChainExecutorService unit tests. Quality score: 100/100 (QA gate).

## Related Patterns

- **[Workflow Chain Execution](4-workflow-chain-execution.md)** (Epic 4) - Field mappers are part of chain execution
- **[Unified Schema Structure](unified-schema-structure.md)** (Epic 3) - Schemas define prompt inputs/outputs that mappers translate
- **[Config Service Single Source of Truth](config-service-single-source-of-truth.md)** (Epic 3) - Similar philosophy (single definition, inherited by consumers)

## Anti-Patterns

```yaml
# ❌ ANTI-PATTERN: No mapper when fields collide
steps:
  - id: analyze-v1
    prompt: analyze-v1.hbs
    outputs: [result]
  - id: analyze-v2
    prompt: analyze-v2.hbs
    outputs: [result]  # Overwrites analyze-v1's result!
# WRONG: Field collision, data loss

# ❌ ANTI-PATTERN: Over-mapping (every field)
steps:
  - id: analyze
    prompt: analyze-content.hbs
    outputs: [mainTopic, keywords, audience]
    mapper:
      mainTopic: analyzeMainTopic
      keywords: analyzeKeywords
      audience: analyzeAudience
# WRONG: Unnecessary complexity if fields don't collide

# ❌ ANTI-PATTERN: Hardcoded mapper in prompt template
<!-- Outputs: contentEssence (store as analyzeContentEssence) -->
# WRONG: Mapper logic belongs in chain definition, not template
```

## Implementation Checklist

When defining a prompt chain:

- [ ] Identify potential field name collisions (multiple prompts output `summary`, `result`, etc.)
- [ ] Add `mapper` object to chain step definition only when needed
- [ ] Document mapper rationale in chain description (why translation is necessary)
- [ ] Use descriptive workflow attribute names (e.g., `analyzeContentEssence` not `ace`)
- [ ] Test with missing mapped fields (prompt doesn't output expected field)
- [ ] Verify unmapped fields pass through correctly
- [ ] Update workflow-data schema documentation if adding new attributes

## References

- **Story**: `docs/stories/4.6.story.md` (Run Prompt Chain)
- **Implementation**:
  - Service: `packages/poem-app/src/services/chain/executor.ts` (ChainExecutorService)
  - Types: `packages/poem-app/src/services/chain/types.ts` (ChainDefinition, ChainStep)
  - API: `packages/poem-app/src/pages/api/chain/execute.ts`
- **Tests**:
  - `packages/poem-app/tests/services/chain/executor.test.ts` (11 tests, including field mapper test)
  - `packages/poem-app/tests/api/chain-execute.test.ts` (6 integration tests)
  - Test fixture: `packages/poem-app/tests/fixtures/chains/youtube-3-step.yaml` (example with mapper)
- **QA Gate**: `docs/qa/gates/4.6-run-prompt-chain.yml` (Quality Score: 100/100)
- **Architecture**: `docs/architecture/core-workflows.md` (Workflow 4: Prompt Chain Execution)
- **Decision Record**: [ADR-006: Field Mapper Architecture](../decisions/adr-006-field-mapper-architecture.md)

---

**Pattern Established**: Story 4.6 (2026-01-14)
**New Pattern**: No Epic 3 equivalent (chains introduced in Epic 4)
**Last Updated**: 2026-01-19
