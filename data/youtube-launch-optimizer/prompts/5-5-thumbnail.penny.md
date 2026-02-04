# Penny Analysis: 5-5-thumbnail

**Prompt Type**: Tool-Specific Prompt Generation / Leonardo AI Integration
**Phase**: Section 5 (Title & Thumbnail)
**Analyzed**: 2026-02-04

---

## Architectural Observations

### 1. External Tool Integration ⭐
**Leonardo AI specific** - generates prompts FOR another AI tool.

**Prompt-for-prompt pattern** - meta-level generation.

### 2. Format Specification
**16:9 YouTube-style** - explicit aspect ratio and platform context.

Optimized for small-screen browsing (mobile consideration).

### 3. Design Constraints
**5 Leonardo AI best practices**:
1. Simple structure
2. Consistent character presence
3. Clear subject focus
4. Bold contrast and lighting
5. Clean backgrounds

**Tool-specific optimization rules**.

### 4. Dual-Purpose Text Integration
**Two approaches to thumbnail text**:
1. Leave space for text overlay (added later)
2. Integrate text as natural design element (sign, banner, screen)

**Flexible text handling**.

### 5. Input Minimalism
Only 3 inputs:
- `videoTitle`
- `thumbnailText` (from 5-3)
- `transcriptAbridgement` (from Section 1)

**Efficient** - doesn't require all Section 4 metadata.

---

## LATO Pattern Classification

**Pattern**: **Generation + Tool Orchestration**

- Generates prompt for external tool (Leonardo AI)
- Tool-specific optimization
- Format and constraint awareness

**Fifth LATO pattern candidate?** (Tool Orchestration)

---

## Workflow Position

**Section 5, Step 5** - Leonardo AI prompt generation (final step)

```
5-4: Visual concept guidelines
    ↓
5-5: Generate Leonardo AI prompt (THIS STEP)
    ↓
Raw text prompt (ready for Leonardo AI)
    ↓
[User submits to Leonardo AI → Thumbnail image generated]
```

**Workflow endpoint** - produces prompt for external execution.

---

## Key Patterns

### Pattern: Prompt-for-Prompt
**Meta-generation** - AI generating prompts for another AI.

Emerging pattern in multi-tool workflows.

### Pattern: Tool-Specific Optimization
Leonardo AI best practices embedded (not generic "image generation").

**Platform awareness** in prompt design.

### Pattern: Constraint-Driven Generation
**Explicit constraints**:
- 16:9 aspect ratio
- Small-screen optimization
- Avoid complex scenes
- Bold contrast
- Clean backgrounds

**Design principles encoded in prompt**.

### Pattern: Flexible Text Integration
**Two approaches supported**:
1. Leave space (user adds text later)
2. Integrate naturally (AI embeds text)

**Adaptive to workflow variations**.

---

## Comparison to Section 3 (Deprecated B-roll)

**Section 3** (archived):
- Midjourney prompts (different tool)
- Direct transcript → image prompts
- CSV batch format

**Section 5.5**:
- Leonardo AI prompts (different tool)
- Title + thumbnail text + abridgement → image prompt
- Single prompt output (not batch)

**Different tools, different approaches**.

---

## External Tool Integration Strategy

**Section 3**: Midjourney (deprecated)
**Section 5.5**: Leonardo AI (current)

**Question**: Should POEM support multiple image gen tools? (Midjourney, Leonardo, DALL-E, Stable Diffusion)

**Template parameterization**:
```yaml
prompt: generate-thumbnail-image
tool: leonardo-ai | midjourney | dalle | stable-diffusion
tool_specific_best_practices: [tool-config]
```

---

## SRP Analysis

**Responsibilities**:
1. Synthesize title + text + abridgement
2. Apply Leonardo AI best practices
3. Generate tool-specific prompt

**Verdict**: Focused on Leonardo AI prompt generation. Cohesive, should NOT split.

---

## Questions for Design

1. **Tool Selection**: Should user choose image gen tool (Leonardo vs Midjourney vs DALL-E)?
2. **Text Integration**: How does user specify "leave space" vs "integrate naturally"?
3. **Iteration**: Can user refine Leonardo prompt before submitting?
4. **Result Feedback**: Does POEM store/track generated thumbnail images?

---

## Integration Notes

**Epic 5 (Templates)**: Tool-specific prompt generation pattern
**Epic 6 (Workflow)**: Endpoint prompts (output for external tools)
**Epic 7 (Integration)**: Leonardo AI API integration (if automated)

---

**Status**: Formatted ✅ | Analysis Complete ✅
