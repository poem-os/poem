# Penny's Review: `1-4-abridge.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Near-lossless abridgement preserving ALL meaningful information
**Status:** ✅ Production-ready, canonical version

---

## Formatting Assessment

### ✅ Follows `0-formatting-rules.md` Standards

- ✅ Opening statement with clear context ("Think of this as JPEG compression")
- ✅ Numbered steps (Step 1, Step 2, Step 3)
- ✅ Each step has clear sections with bullet points
- ✅ Horizontal rules separate major sections
- ✅ Output format shown in code block with structure
- ✅ Input section with proper tags (`<transcript>`)
- ✅ Blank lines between sections
- ✅ Bold emphasis for key terms (**MUST Preserve**, **MAY Remove**)
- ✅ Verification checklist before output

**Verdict:** Fully compliant. Excellent formatting.

---

## Input/Output Analysis

### Inputs

**Expected Data:**
```handlebars
{{transcript}}  // Full video transcript (string)
```

**Parallel Execution Note:** Same input as 1-3-summarize-video (enables parallel execution)

---

### Outputs

**Output Name:** `transcriptAbridgement`

**Output Format:**
```
Abridged Transcript:

[Section 1: Opening/Context]
[Chronologically structured content with **bold** for key terms on first mention]

[Section 2: Main Content]
[Continue chronologically...]

[Section 3: Conclusion/Outcomes]
[Final section...]

Target: 40-60% of original length while preserving 100% of meaningful content
```

**Strong Points:**
- Clear length target (40-60% compression ratio)
- Explicit preservation goal (100% meaningful content)
- Structured output with section breaks
- Bold formatting for key terms on first mention

---

## POEM Architecture Observations

### Near-Lossless Philosophy

**The "JPEG Compression" Analogy:**
- Brilliant framing: smaller but visually identical
- Sets expectation: reduce redundancy, keep meaning
- Guides AI behavior: aggressive compression with zero quality loss

**Why This Matters for YouTube Workflow:**
1. **Technical content preservation** - Tools, versions, APIs retained
2. **Debugging preservation** - Problems AND solutions captured
3. **Chronological flow** - Sequence matters for tutorials
4. **Cause & effect** - Why decisions were made, not just what happened

**Production Context:**
This prompt evolved from 15+ months of production use where information loss caused downstream problems (lost tool names → couldn't reproduce tutorial, lost version numbers → incompatible dependencies).

---

## Preservation Categories Analysis

### MUST Preserve (Non-Negotiable)

**Comprehensive coverage of technical needs:**

| Category | Why Critical | Example |
|----------|-------------|---------|
| **Named Entities** | People, tools, brands | "React", "TypeScript", "Claude Code" |
| **Numbered Items** | Version specificity | "Story 4.6.5", "Epic 4", "v2.1.3" |
| **Technical Terms** | Reproducibility | "API endpoint", "useState hook", "package.json" |
| **Problems & Solutions** | Learning value | "CORS error → added proxy config" |
| **Demonstrations** | Show-and-tell capture | "Created authentication flow, tested with Postman" |
| **Chronological Flow** | Step-by-step integrity | "First installed deps, then configured server" |
| **Cause & Effect** | Understanding context | "Used Redis because session state needed persistence" |
| **Quantitative Details** | Precision | "Reduced bundle size by 40%", "3 API calls" |

**Assessment:** Production-proven. Covers all critical information types for technical YouTube videos.

---

### MAY Remove (Negotiable)

**Smart compression choices:**
- ✅ Filler words ("um", "uh", "you know", "so")
- ✅ Repeated explanations of same concept
- ✅ Transitional phrases without meaning
- ✅ Verbose introductions to obvious actions
- ✅ Meta-commentary about the video itself

**Assessment:** Conservative removal list. Won't lose meaningful content.

---

## Verification Checklist

**Actionable self-QA questions:**
- "Could someone recreate the project from this abridgement?"
- "Are all tools/technologies mentioned?"
- "Are all problems and their solutions captured?"
- "Is the chronological order preserved?"

**Why This Works:**
- Tests completeness (recreation test)
- Prevents common omissions (tools, solutions)
- Maintains narrative flow

---

## Parallel Execution Opportunity ⚡

**Can run in parallel with 1-3-summarize-video:**
- Same input: `{{transcript}}`
- Independent outputs: `transcriptAbridgement` vs `transcriptSummary`
- No dependencies between them
- **2x speedup potential**

**Workflow Structure:**
```yaml
- id: compress-transcript
  name: Compress Transcript (Parallel)
  type: action
  action: llm-parallel
  parallel: true
  timeout: 120000

  substeps:
    - id: summarize
      prompt: prompts/1-3-summarize-video.hbs
      inputs: { transcript: "{{transcript}}" }
      outputs: [transcriptSummary]
      schema: schemas/1-3-summarize-video.json

    - id: abridge
      prompt: prompts/1-4-abridge.hbs
      inputs: { transcript: "{{transcript}}" }
      outputs: [transcriptAbridgement]
      schema: schemas/1-4-abridge.json

  stores: [transcriptSummary, transcriptAbridgement]
```

---

## Edge Cases

### Edge Case 1: Very Short Transcript (< 1000 words)
**Problem:** Abridgement might not reduce length significantly

**Current Handling:** ⚠️ No check for minimum transcript length

**Recommendation:**
- Add schema validation: `minLength: 1000` on input
- Or: Pass through original if compression ratio < 10%

---

### Edge Case 2: Multiple Speakers (Interview/Panel)
**Problem:** Speaker attribution might be lost

**Current Handling:** ✅ Partially covered ("Named Entities" includes people)

**Enhancement:**
- Explicit guidance: "Preserve speaker names when dialogue matters"
- Example format: "Alice explained X, then Bob countered with Y"

---

### Edge Case 3: Non-English Content
**Problem:** Filler words are language-specific ("um", "uh" are English)

**Current Handling:** ⚠️ Assumes English

**Enhancement:**
- Add optional input parameter: `language` (default: "en")
- Adjust filler word examples per language

---

### Edge Case 4: Highly Redundant Content
**Problem:** Speaker repeats same concept 5+ times

**Current Handling:** ✅ "MAY Remove: Repeated explanations"

**Quality Check:**
- AI should keep first detailed explanation
- Remove subsequent redundant mentions
- Preserve if repetition adds new nuance

---

## Test Coverage Recommendations

### Test Scenario 1: Technical Tutorial (Coding)
**Input:** 5000-word React tutorial with code examples

**Expected Output:**
- 2000-3000 words (40-60% compression)
- All component names, hooks, API calls preserved
- Code logic captured (not full code blocks, but what was shown)
- Chronological flow: setup → implementation → testing

---

### Test Scenario 2: Interview/Discussion
**Input:** 8000-word interview about AI ethics (2 speakers)

**Expected Output:**
- 3200-4800 words
- Both speakers' key arguments preserved
- Speaker attribution maintained
- Main themes and debate flow captured

---

### Test Scenario 3: Product Demo
**Input:** 3000-word product walkthrough

**Expected Output:**
- 1200-1800 words
- All feature names preserved
- Demonstrations captured ("Showed how to export to CSV")
- UI navigation steps clear ("Settings → Advanced")

---

## Schema Requirements

### Schema File: `schemas/1-4-abridge.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "templateName": "abridge",
  "description": "Near-lossless abridgement preserving 100% meaningful content",
  "dataSource": "transcript",

  "placeholders": {
    "transcript": {
      "type": "string",
      "required": true,
      "description": "Full video transcript to abridge",
      "minLength": 500,
      "example": "In this tutorial, we'll build a React app using TypeScript..."
    }
  },

  "outputSchema": {
    "type": "object",
    "required": ["transcriptAbridgement"],
    "properties": {
      "transcriptAbridgement": {
        "type": "string",
        "description": "Near-lossless abridgement (40-60% of original length)",
        "compressionRatio": "0.4-0.6",
        "preservationLevel": "100% meaningful content",
        "preservationRules": {
          "mustPreserve": [
            "named entities",
            "numbered items",
            "technical terms",
            "problems and solutions",
            "demonstrations",
            "chronological flow",
            "cause and effect",
            "quantitative details"
          ],
          "mayRemove": [
            "filler words",
            "repeated explanations",
            "transitional phrases",
            "verbose introductions",
            "meta-commentary"
          ]
        }
      }
    }
  },

  "recommendedModel": "openai/gpt-4o-mini",
  "maxTokens": 4000,
  "temperature": 0.7
}
```

---

## Action Items (For Second Pass)

**Priority: High**
- [ ] Create `schemas/1-4-abridge.json` schema file
- [ ] Document parallel execution with 1-3-summarize in workflow YAML

**Priority: Medium**
- [ ] Add edge case handling (short transcripts, multiple speakers)
- [ ] Test compression ratio consistency across content types

**Priority: Low**
- [ ] Add language parameter for non-English support
- [ ] Generate test scenarios with expected outputs

---

## Recommendation

**This prompt is production-ready and represents the canonical abridgement approach** for the YouTube Launch Optimizer workflow.

**Key Strengths:**
1. ✅ 15+ months of production refinement
2. ✅ Explicit preservation rules prevent information loss
3. ✅ Clear compression target (40-60%) produces predictable results
4. ✅ Actionable verification checklist ensures quality
5. ✅ Ideal for technical YouTube content (tutorials, demos, interviews)

**Version History:**
- Supersedes v1 (deprecated 2026-02-04 for vague preservation rules and poor formatting)
- v2 promoted to canonical version based on superior preservation rules and production validation

---

**Reference:**
- Formatting Rules: `prompts/0-formatting-rules.md`
- Pattern Observations: `docs/pattern-observations.md`
- Previous Review: `prompts/1-3-summarize-video.penny.md`
