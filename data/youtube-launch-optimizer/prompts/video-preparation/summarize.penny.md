# Penny's Review: `1-3-summarize-video.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Create a concise summary of video transcript
**Status:** ✅ Well-formatted after restructuring

---

## Formatting Assessment

### ✅ Follows `0-formatting-rules.md` Standards (After Formatting)

- ✅ Opening statement explains purpose
- ✅ Numbered steps (Step 1, Step 2, Step 3)
- ✅ Each step has clear action and bullet points
- ✅ Horizontal rules separate major sections
- ✅ Output format shown in code block
- ✅ Input section with proper tags (`<transcript>`)
- ✅ Blank lines between sections
- ✅ No wall-of-text paragraphs

**Verdict:** Compliant after formatting improvements.

---

## Input/Output Analysis

### Inputs

**Expected Data:**
```handlebars
{{transcript}}  // Full video transcript (string)
```

**Schema Inference:**
```json
{
  "transcript": "Full video transcript text here..."
}
```

**Missing:** JSON schema file at `schemas/1-3-summarize-video.json`

---

### Outputs

**Current State:** ✅ Explicit output format defined

**Output Format:**
```
Summary:
[Concise summary capturing essential points and main ideas]
```

**Output Schema (Inferred):**
```json
{
  "transcriptSummary": {
    "type": "string",
    "description": "Concise summary of video content",
    "minLength": 100,
    "maxLength": 1000
  }
}
```

**Notes:**
- Single string output (simple)
- No structured fields (topics, key points as arrays)
- Could be enhanced with structured summary if needed

---

## POEM Architecture Observations

### Comparison: 1-3 (Summarize) vs 1-4 (Abridge)

**Both prompts process the same input (`transcript`) but serve different purposes:**

| Aspect | 1-3 Summarize | 1-4 Abridge |
|--------|---------------|-------------|
| **Goal** | Extract key points/highlights | Near-lossless compression |
| **Length** | Short summary (10-20% of original) | 40-60% of original |
| **Detail Level** | High-level overview | Preserves all meaningful details |
| **Use Case** | Quick understanding | Full context without redundancy |

**Relationship in Workflow:**
- `transcriptSummary` (1-3 output) → Used for quick reference in later steps
- `transcriptAbridgement` (1-4 output) → Used as primary content source for analysis steps

**Why Both Needed:**
- Summary: Fast scanning, executive overview
- Abridgement: Deep analysis without full transcript bloat

---

## Edge Cases

### Edge Case 1: Very Short Transcript (< 500 words)
**Problem:** Summarizing something already concise may add no value

**Current Handling:** ❌ No check for transcript length

**Recommendation:**
- Add schema validation: `minLength: 500` on input
- Or: Pass through original if < 500 words

---

### Edge Case 2: Non-English Transcript
**Problem:** "Filler words and verbal tics" are language-specific

**Current Handling:** ⚠️ Instructions assume English

**Recommendation:**
- Add input parameter: `language` (default: "en")
- Adjust filler word removal based on language

---

### Edge Case 3: Multiple Speakers (Interview/Dialogue)
**Problem:** Summary might lose speaker attribution

**Current Handling:** ⚠️ No guidance on preserving speaker context

**Recommendation:**
- If speaker attribution is important, specify in output format
- Example: "If multiple speakers, note key contributors"

---

## Test Coverage Recommendations

### Test Scenario 1: Standard Tutorial Video
**Input:**
```json
{
  "transcript": "[2000-word tutorial transcript about React hooks]"
}
```

**Expected Output:**
- Summary: 200-400 words
- Captures: Main topic (React hooks), key concepts (useState, useEffect), takeaways
- Removes: Filler, tangents, repetitive explanations

---

### Test Scenario 2: Interview Format
**Input:**
```json
{
  "transcript": "[3000-word interview with 2 speakers about AI ethics]"
}
```

**Expected Output:**
- Summary preserves both perspectives
- Key arguments from each speaker captured
- Main themes identified

---

### Test Scenario 3: Minimal Transcript
**Input:**
```json
{
  "transcript": "[300-word short update video]"
}
```

**Expected Output:**
- Summary shouldn't be longer than input
- Should add value or pass through original

---

## Schema Requirements

### Input Schema: `1-3-summarize-video.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "templateName": "summarize-video",
  "description": "Create concise summary of video transcript",
  "dataSource": "transcript",

  "placeholders": {
    "transcript": {
      "type": "string",
      "required": true,
      "description": "Full video transcript to summarize",
      "minLength": 100,
      "example": "In this video, we'll explore React hooks..."
    }
  },

  "outputSchema": {
    "type": "object",
    "required": ["transcriptSummary"],
    "properties": {
      "transcriptSummary": {
        "type": "string",
        "description": "Concise summary capturing essential points",
        "minLength": 100,
        "maxLength": 1000
      }
    }
  },

  "recommendedModel": "openai/gpt-4o-mini",
  "maxTokens": 500,
  "temperature": 0.7
}
```

---

## Observations on Output Structure

### Current: Plain Text Summary
```
Summary:
[Free-form text paragraph]
```

### Alternative: Structured Summary (Optional Enhancement)
```json
{
  "transcriptSummary": {
    "overview": "One-sentence overview",
    "mainTopics": ["Topic 1", "Topic 2", "Topic 3"],
    "keyTakeaways": ["Takeaway 1", "Takeaway 2"],
    "fullSummary": "Detailed paragraph summary"
  }
}
```

**Trade-off:**
- ✅ Structured: More parseable, supports downstream processing
- ✅ Plain text: Simpler, faster, less token overhead

**Recommendation:** Keep plain text for now (matches production use), consider structured if Epic 4-5 stories need it.

---

## Action Items (For Second Pass)

**Priority: High**
- [ ] Create `schemas/1-3-summarize-video.json` schema file

**Priority: Medium**
- [ ] Add edge case handling (short transcripts, multiple speakers)
- [ ] Clarify relationship to 1-4-abridge in workflow documentation

**Priority: Low**
- [ ] Consider structured output if downstream steps need it
- [ ] Add language parameter if non-English support needed

---

## Recommendation

**This prompt is production-ready** with minor enhancements:
1. Add schema file (high priority)
2. Document its relationship to 1-4-abridge (workflow context)
3. Consider edge cases for future iterations

The formatting improvements made it much more readable and aligned with `0-formatting-rules.md`.

---

**Reference:**
- Formatting Rules: `prompts/0-formatting-rules.md`
- Design Observations: `prompts/0-observations.md`
- Previous Reviews: `prompts/1-1-configure.penny.md`, `prompts/1-2-title-shortlist.penny.md`
