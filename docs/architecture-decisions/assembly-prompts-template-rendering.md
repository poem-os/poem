# Assembly Prompts: Template Rendering vs. LLM Inference

**Category**: Architecture Decision
**Status**: ✅ Documented
**Date**: 2026-02-04
**Source**: YouTube Launch Optimizer Section 6 Analysis

---

## The Insight

**Not all prompts require LLM inference.** Some prompts are **pure assembly tasks** that only need template rendering (Handlebars string interpolation, loops, conditionals).

**Example**: `6-2-yt-write-description.hbs` combines 9 pre-generated components into a final YouTube description. It does NOT generate new content - it only arranges existing content.

---

## Two Types of Prompts

### Type 1: **Generative Prompts** (LLM Inference Required)

**Definition**: Prompts that require AI to generate new content, make decisions, or transform data.

**Characteristics**:
- Creates new text from analysis/synthesis
- Requires reasoning or creativity
- Output varies based on LLM model/temperature
- Examples: `4-1-analyze-content-essence`, `5-1-generate-title`, `7-1-create-tweet`

**Processing**:
1. Render Handlebars template with inputs
2. Send rendered prompt to LLM
3. Receive generated output
4. Store output for downstream prompts

**Cost**: LLM API call (time + money)

---

### Type 2: **Assembly Prompts** (Template Rendering Only)

**Definition**: Prompts that combine pre-generated components without requiring AI inference.

**Characteristics**:
- **NO content generation** (only arrangement)
- Deterministic (same inputs = same output)
- Uses Handlebars conditionals, loops, string concatenation
- Examples: `6-2-yt-write-description` (assembles 9 sections)

**Processing**:
1. Render Handlebars template with inputs
2. **STOP** - output IS the rendered template
3. Store output for downstream prompts

**Cost**: Zero (no LLM call)

---

## The 6-2 Example

**Prompt**: `6-2-yt-write-description.hbs`

**Inputs** (all pre-generated):
- `videoDescriptionFirstLine` (from 6-1)
- `videoSimpleDescription` (from 6-1)
- `brandConfig.ctas.primaryCta` (from config)
- `relatedVideos` (from 9-3)
- `brandConfig.affiliates` (from config)
- `brandConfig.socialLinks` (from config)
- `createChapters` (from 2-3)
- `descriptionHashtags` (from 9-2)
- `brandConfig.descriptionTemplate.legalDisclosure` (from config)

**Process**: Handlebars template renders these inputs into 9 sections with:
- Emoji headers (👉, 🎥, 🔗, 🌐, ⏱️)
- Conditional logic (`{{#if active}}` for affiliates)
- Iteration (`{{#each relatedVideos}}`)
- String concatenation (paste sections with blank lines)

**Output**: Complete YouTube description (plain text, YouTube-native formatting)

**LLM Required?**: **NO** - this is pure string assembly.

---

## Benefits of Assembly Prompts

### 1. **Performance**
- Template rendering: **<1ms**
- LLM inference: **2-10 seconds**
- **Speedup**: 2000x - 10000x

### 2. **Cost**
- Template rendering: **$0**
- LLM inference: **$0.001 - $0.01 per call** (varies by model/tokens)
- **Savings**: 100%

### 3. **Determinism**
- Template rendering: **Same inputs = same output** (100% reproducible)
- LLM inference: **Variability** (temperature, model updates, non-determinism)
- **Consistency**: Guaranteed

### 4. **Offline Capability**
- Template rendering: **Works offline** (no API required)
- LLM inference: **Requires API connection**
- **Reliability**: No network dependency

### 5. **Debugging**
- Template rendering: **Errors are syntax errors** (easy to debug)
- LLM inference: **Errors can be content errors** (harder to catch)
- **Maintainability**: Simpler

---

## How to Identify Assembly Prompts

**Indicators a prompt is assembly-only**:

✅ **Prompt says "PURE ASSEMBLY"** (explicit, like 6-2)
✅ **No generative verbs**: "Create", "Generate", "Analyze", "Summarize", "Write"
✅ **Only assembly verbs**: "Assemble", "Combine", "Arrange", "Format", "Paste"
✅ **All inputs are pre-generated** (no new content created)
✅ **Output is deterministic** (same inputs always produce same output)
✅ **Uses only Handlebars features**: `{{variable}}`, `{{#if}}`, `{{#each}}`, string concatenation

**Indicators a prompt requires LLM**:

❌ **Generative verbs**: "Create", "Generate", "Analyze", "Summarize", "Extract", "Write", "Draft"
❌ **Requires reasoning**: "Determine the best...", "Identify key points...", "Assess..."
❌ **Requires creativity**: "Craft engaging...", "Write compelling...", "Suggest..."
❌ **Transforms data**: Transcript → Summary, Keywords → Hashtags, Analysis → Insights

---

## Implementation Considerations

### POEM Workflow Engine

**Decision Point**: After rendering Handlebars template, should POEM:
1. **Always send to LLM** (current assumption)
2. **Skip LLM for assembly prompts** (optimization)

**Recommended**: Option 2 (skip LLM for assembly prompts)

**Implementation**:
```yaml
# In prompt metadata (YAML frontmatter or separate config)
prompt:
  id: 6-2-yt-write-description
  type: assembly  # <-- NEW FIELD
  skipLLM: true   # <-- Indicates template rendering only
```

**Workflow Logic**:
```javascript
function executePrompt(prompt, inputs) {
  // Step 1: Always render template
  const rendered = renderHandlebars(prompt.template, inputs);

  // Step 2: Check if LLM required
  if (prompt.skipLLM || prompt.type === 'assembly') {
    return rendered; // Template output IS final output
  }

  // Step 3: Send to LLM (generative prompts only)
  const llmOutput = await callLLM(rendered);
  return llmOutput;
}
```

---

## Other Assembly Prompt Candidates

**From YouTube Launch Optimizer**:

| Prompt ID | Name | Assembly? | Notes |
|-----------|------|-----------|-------|
| 6-2 | Write Description | ✅ Yes | Confirmed pure assembly |
| 7-4 | Add to Video List | ⚠️ Maybe | Only 3 variables, no instructions - likely template-only |
| 9-0 | YouTube Defaults | ⚠️ Unknown | Not reviewed yet, but name suggests config assembly |

**Potential Pattern**: Look for prompts with names like:
- "Assemble...", "Combine...", "Format...", "Write..." (when "write" means "paste together")
- "Add to...", "Append to...", "Insert into..."

---

## Edge Cases

### What if assembly prompt has instructions?

**Example**: `6-2-yt-write-description.hbs` has instructions like:
- "Use emoji headers for scannability"
- "If chapters >20 lines, move to position 7"
- "One blank line between sections"

**Question**: Does this require LLM interpretation?

**Answer**: **No, if logic can be encoded in Handlebars.**

**Implementation**:
```handlebars
{{!-- Conditional section ordering based on chapter count --}}
{{#if (gt chaptersLineCount 20)}}
  {{!-- CTAs first, chapters later --}}
  ...
{{else}}
  {{!-- Chapters earlier, CTAs later --}}
  ...
{{/if}}
```

**Rule**: If logic can be expressed in Handlebars conditionals/helpers, it's still assembly.

---

## Hybrid Prompts?

**Question**: Can a prompt be BOTH generative AND assembly?

**Example**: What if 6-2 also had to "select the top 3 related videos based on relevance"?

**Answer**: **Split into two prompts:**
1. **Generative**: Select top 3 videos (LLM required)
2. **Assembly**: Assemble description (template only)

**Reason**: Keep SRP (Single Responsibility Principle). Each prompt does ONE thing.

---

## Documentation Recommendations

### 1. **Tag Assembly Prompts**

In Penny analyses, add tag:
```markdown
`#assembly-prompt` `#no-llm-required` `#template-rendering-only`
```

### 2. **Add Metadata to Prompt Files**

YAML frontmatter or separate config:
```yaml
---
id: 6-2-yt-write-description
type: assembly
skipLLM: true
description: "Assemble YouTube description from pre-generated components"
---
```

### 3. **Update LATO Classification**

Assembly prompts have **0% LLM automation** (because LLM isn't used), but **100% template automation**.

**New LATO Sub-Category**: **LATO-Assembly** (distinct from LATO-1/2/3)
- No LLM required
- Fully automated via template rendering
- Deterministic output

### 4. **Create Workflow Optimization Guide**

Document in `docs/architecture-decisions/workflow-optimization.md`:
- How to identify assembly prompts
- How to configure POEM to skip LLM calls
- Performance/cost benefits

---

## Future Considerations

### 1. **Template Helpers**

Some assembly logic might need custom Handlebars helpers:
```handlebars
{{!-- Custom helper to count lines --}}
{{#if (gtLines createChapters 20)}}
  ...
{{/if}}
```

**Decision**: Should POEM provide standard helpers for common assembly tasks?

### 2. **Validation**

Assembly prompts can have validation rules:
- Check character counts (YouTube description <5000 chars)
- Validate URL formats
- Ensure required sections present

**Decision**: Should validation happen before or after template rendering?

### 3. **A/B Testing**

Assembly prompts are deterministic - same inputs = same output.

**Implication**: A/B testing must vary INPUTS, not prompt logic (unlike generative prompts where temperature/model can vary).

---

## Related Patterns

| Pattern | Document | Relationship |
|---------|----------|--------------|
| SRP Recommendation | `srp-recommendation.md` | Assembly prompts exemplify SRP (single responsibility = assembly only) |
| Pure Assembly Pattern | (6-2 Penny analysis) | Specific implementation example |
| Two-Part Structure | (6-1 Penny analysis) | Generative prompt that FEEDS assembly prompt (6-1 → 6-2) |

---

## Summary

**Key Insight**: Not all prompts need LLM inference. Assembly prompts are template rendering tasks that combine pre-generated content.

**Benefits**:
- **2000x-10000x faster** (template rendering vs. LLM)
- **100% cost savings** (no API calls)
- **Deterministic** (reproducible outputs)
- **Offline capable** (no network required)

**Implementation**: Add `type: assembly` and `skipLLM: true` metadata to prompt files. POEM workflow engine checks metadata and skips LLM call for assembly prompts.

**Identification**: Look for prompts with "PURE ASSEMBLY", "Assemble", "Combine", "Format" language and all pre-generated inputs.

---

**Tags**: `#assembly-prompts` `#template-rendering` `#no-llm-required` `#performance-optimization` `#cost-optimization` `#deterministic` `#architecture-decision`

**Related Prompts**: `6-2-yt-write-description`, `7-4-add-to-video-list` (candidate)

---

**Last Updated**: 2026-02-04
