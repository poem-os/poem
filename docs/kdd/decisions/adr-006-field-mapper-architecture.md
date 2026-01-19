# ADR-006: Field Mapper Architecture for Prompt Chaining

**Date**: 2026-01-14
**Status**: Accepted
**Source**: Story 4.6 (Run Prompt Chain)

## Context

When building prompt chains where outputs from one prompt feed into subsequent prompts, a naming conflict problem emerges:

**Problem**: Multiple prompts in a workflow may output fields with the same generic names (`summary`, `analysis`, `result`). When step 2 outputs `analysis`, it overwrites step 1's `analysis` field in workflow-data.

**Example scenario**:
- Step 1 (`analyze-sentiment.hbs`) outputs `analysis: { sentiment: "positive" }`
- Step 2 (`analyze-topics.hbs`) outputs `analysis: { topics: ["AI", "automation"] }`
- Step 3 needs both analyses, but step 2 overwrote step 1's data

**Alternatives evaluated**:
1. **Field mappers** - Translate prompt field names to workflow attribute names
2. **Step ID prefixing** - Automatically prefix all outputs with step ID (`step1_analysis`)
3. **Namespace objects** - Store each step's outputs in separate objects
4. **Unique naming requirement** - Force prompts to use unique names
5. **Last-writer-wins** - Accept collisions, let later steps overwrite

## Decision

Implement **optional field mapper objects** in chain step definitions that translate prompt output field names to workflow-specific attribute names.

**Syntax**:
```yaml
steps:
  - id: analyze
    prompt: analyze-content.hbs
    inputs: [text]
    outputs: [contentEssence]     # Prompt uses generic name
    mapper:
      contentEssence: analyzeContentEssence  # Store as workflow-specific name
```

**Behavior**:
- If mapper present: Apply translation before storing in workflow-data
- If mapper absent: Store fields using prompt's output names (no translation)
- Unmapped fields: Pass through as-is (permissive by design)
- Missing mapped field: Warning logged but execution continues

## Alternatives Considered

### Option 1: Field Mappers (Chosen)

**Pros**:
- Explicit (mapper documents semantic relationship)
- Flexible (prompts use natural names, workflows use descriptive names)
- Optional (only add mapper when needed)
- Refactoring-safe (change prompt output names without breaking workflow)

**Cons**:
- Indirection (field name in prompt ≠ field name in workflow-data)
- Maintenance (mapper must be updated if prompt outputs change)

**Why chosen**: Balances flexibility with explicitness. Mapper is documentation.

### Option 2: Step ID Prefixing

**Pros**:
- Automatic (no mapper configuration needed)
- Zero collisions (step ID uniquely identifies source)

**Cons**:
- Couples workflow-data to chain structure (reorder steps → attribute names change)
- Ugly names (`step1_analysis` vs `sentimentAnalysis`)
- Breaks if step ID changes

**Rejected**: Too much coupling between workflow and chain definition.

### Option 3: Namespace Objects

**Pros**:
- Clean separation (each step's outputs isolated)

**Cons**:
- Deep nesting (`workflow.data.step1.analysis` vs `workflow.data.sentimentAnalysis`)
- Harder to access fields (must know which step produced them)
- Breaks flat workflow-data assumption

**Rejected**: Too much indirection for common use case.

### Option 4: Unique Naming Requirement

**Pros**:
- Simple (no mapper needed)
- No translation overhead

**Cons**:
- Kills prompt reusability (every prompt must use globally unique names)
- Hard to enforce (how do you validate uniqueness across 53 templates?)
- Prompts become workflow-specific (can't reuse `analyze-sentiment.hbs` in multiple workflows)

**Rejected**: Defeats purpose of reusable prompts.

### Option 5: Last-Writer-Wins

**Pros**:
- Zero configuration
- Simple implementation

**Cons**:
- Data loss (earlier steps' outputs silently overwritten)
- Hard to debug (which step produced this field?)
- No warning when collision occurs

**Rejected**: Silent failures unacceptable.

## Rationale

**Why Field Mappers?**

1. **Explicit Contract**: Mapper documents "this prompt's `contentEssence` becomes workflow's `analyzeContentEssence`"
2. **Prompt Reusability**: Prompts use natural names (`summary`, `analysis`) without worrying about collisions
3. **Workflow Clarity**: Workflow-data has descriptive names (`sentimentAnalysis`, `topicAnalysis`, `structuralAnalysis`)
4. **Refactoring Safety**: Change prompt output names without updating downstream consumers
5. **Optional**: Only add mapper when needed (most single-prompt workflows don't need it)

**Design Philosophy**: Trade indirection for flexibility. Mapper is small price for reusable prompts.

## Consequences

**Positive**:
- ✅ Prompts can use generic names (`result`, `output`, `analysis`)
- ✅ Zero collisions in workflow-data (each field uniquely named)
- ✅ Workflow-data self-documenting (field names describe source)
- ✅ 11/11 ChainExecutorService tests passing
- ✅ Validated with YouTube 3-step chain (contentEssence → analyzeContentEssence)

**Negative**:
- ⚠️ Indirection (must check mapper to know source of fields)
- ⚠️ Maintenance (mapper updated when prompt outputs change)

**Mitigations**:
- Mapper is part of chain definition YAML (version controlled, documented)
- Tests validate mapper logic (missing fields, unmapped pass-through)

## Gap Analysis Impact ⭐

- **VibeDeck Relevance**: Not yet tested (VibeDeck has single-prompt workflows)
- **Real-World Validation**: Observation #5 in vibedeck-observations.jsonl mentions template patterns but not chaining
- **Future Implications**: When VibeDeck adds multi-step workflows (e.g., model-research → design-generation → manufacturing-check), field mappers will be essential

## Evolution from Epic 3 ⭐

- **Related Epic 3 ADR**: None (chains introduced in Epic 4)
- **Pattern Change**: N/A
- **Breaking Change**: No

## References

- **Story**: `docs/stories/4.6.story.md` (Run Prompt Chain, AC3 & AC8)
- **Implementation**: `packages/poem-app/src/services/chain/executor.ts` (applyFieldMapper method)
- **Tests**: `packages/poem-app/tests/services/chain/executor.test.ts` (field mapper test)
- **Example**: `packages/poem-app/tests/fixtures/chains/youtube-3-step.yaml` (contentEssence → analyzeContentEssence)
- **QA Gate**: Quality Score 100/100
- **Pattern**: [Field Mapper Pattern](../patterns/4-field-mapper-pattern.md)

---

**Last Updated**: 2026-01-19
