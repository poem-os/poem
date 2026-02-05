# Penny's Review: `2-1-identify-chapters.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Identify logical chapters from video transcript
**Status:** ✅ Well-formatted, needs future improvement

---

## ⚠️ Production Context (User Feedback)

**Current Accuracy:** Finding "natural text boundaries" is not highly accurate yet in this automated form.

**What Actually Works Better:**
- When user manually provides chapter headings (later in workflow)
- Timings may come from FliHub system (unclear)
- Manual chapter headings alone produce pretty good results

**Known Issue: Timestamped Transcripts**
- Current prompt doesn't handle transcripts WITH timestamps well
- Timestamps add too much data and interfere with boundary detection
- May need separate handling for timestamped vs plain text transcripts

**Future Improvement Needed:**
- Better algorithms for finding natural text boundaries
- Consider alternative approaches beyond text analysis
- May need human-in-the-loop checkpoint for chapter definition

---

## Formatting Assessment

### ✅ Follows `0-formatting-rules.md` Standards

- ✅ Opening statement with "You are..." context
- ✅ Numbered steps (Step 1, Step 2, Step 3)
- ✅ Clear bullet points for chapter naming rules
- ✅ Horizontal rules separate major sections
- ✅ Output format shown in code block
- ✅ Input section with proper tags (`<transcript>`)
- ✅ Blank lines between sections
- ✅ Bold emphasis for important rules

**Verdict:** Fully compliant after formatting.

---

## Input/Output Analysis

### Inputs

**Expected Data:**
```handlebars
{{transcript}}  // Full video transcript (string)
```

**Note on Original:** Had `[x-transcript-abridgement]` comment - removed during formatting
- Could use `transcriptAbridgement` instead of full `transcript` for efficiency
- Abridgement preserves chronological flow (sufficient for chapter identification)
- Decision: Keep `transcript` for now (ensures full context)

---

### Outputs

**Output Name (Inferred):** `chapterList` or `preliminaryChapters`

**Output Format:**
```markdown
1. Chapter Name
   "Representative quote"

2. Another Chapter Name
   "Quote from this section"
```

**Output Characteristics:**
- Sequential numbering
- Plain text (no bold)
- Quote on line below each chapter
- In code block

**Schema Inference:**
```json
{
  "chapters": [
    {
      "number": 1,
      "name": "Chapter Name",
      "referenceQuote": "Quote from transcript"
    }
  ]
}
```

---

## Purpose Analysis

### What This Prompt Does

**Chapter Identification (First Pass):**
- Identifies natural topic boundaries in transcript
- Creates simple chapter names
- Extracts representative quotes

**Why "Identify" vs "Create":**
- This is Step 1 of 3-step chapter workflow
- **2-1 (this):** Identify chapters (rough cut)
- **2-2:** Refine chapters (review and adjust)
- **2-3:** Create final chapters (with timestamps)

**Downstream Dependencies:**
- Output feeds into 2-2-refine-chapters
- Eventually creates YouTube chapter markers (timestamps)

---

## Observations

### Good: Simple Naming Guideline

**"Use simple, general terms; minimize detail"**

**Why this matters:**
- YouTube chapters should be scannable
- Viewers skim chapter list to jump to sections
- Overly detailed = hard to scan

**Examples:**
- ✅ Good: "Introduction"
- ✅ Good: "Setting Up Environment"
- ❌ Bad: "Introduction to React Hooks and Why They're Better Than Class Components"

---

### Good: Reference Quotes for Validation

**Each chapter includes a quote from the transcript**

**Why this helps:**
- Validates chapter placement (not hallucinated)
- Shows where chapter begins
- Enables review in 2-2-refine step
- Audit trail for debugging

---

### Potential Issue: Vague "Natural Topic Boundaries"

**Current instruction:**
> "Identify natural topic boundaries where the speaker transitions"

**Problem:** "Natural" is subjective
- How many chapters is appropriate? (3? 10? 20?)
- What defines a "topic boundary"?
- Should minor tangents be separate chapters?

**Compare to:**
- Some videos have 5 broad chapters
- Tutorial videos might have 15-20 granular chapters

**Current handling:** ⚠️ AI uses judgment (inconsistent)

**Recommendation:** Add guidelines:
- Typical video: 5-10 chapters
- Long video (30+ min): 10-15 chapters
- Short video (<10 min): 3-5 chapters

---

## Edge Cases

### Edge Case 1: Very Short Video (< 5 min)
**Problem:** May only have 1-2 natural sections

**Current Handling:** ⚠️ AI might create too many chapters

**Recommendation:**
- Minimum chapter length: ~2 minutes of content
- Don't force chapters if content is linear

---

### Edge Case 2: Stream-of-Consciousness Content
**Example:** Live stream, podcast-style video with no clear structure

**Current Handling:** ⚠️ AI will try to create chapters anyway

**Recommendation:**
- Add note: "If no clear topic boundaries, create broad time-based chapters"
- Example: "First 10 Minutes", "Discussion Continues", "Q&A"

---

### Edge Case 3: Repeated Topics
**Example:** Tutorial that keeps revisiting same concept

**Problem:** Should each mention be a separate chapter?

**Current Handling:** ⚠️ Unclear

**Recommendation:**
- Group related content under single chapter
- Or: Use sub-sections in chapter name ("React Setup - Part 1")

---

### Edge Case 4: Intro/Outro as Chapters?
**Question:** Should "Introduction" and "Outro" be chapters?

**Current Handling:** ⚠️ Not specified

**Recommendation:**
- Intro: Yes, if substantial (>30 seconds)
- Outro: Optional (usually just CTA)

---

## Workflow Context: 3-Step Chapter Process

### Step 1: Identify (This Prompt)
**Purpose:** Rough cut of chapter structure
**Output:** List of chapter names + quotes
**Quality:** Draft quality (will be refined)

### Step 2: Refine (2-2-refine-chapters)
**Purpose:** Review and adjust chapter list
**Input:** Output from Step 1
**Actions:** Merge, split, rename, reorder chapters

### Step 3: Create (2-3-create-chapters)
**Purpose:** Add timestamps and finalize
**Input:** Refined chapter list from Step 2
**Output:** YouTube-ready chapter markers with timestamps

**Why 3 steps?**
- Iterative refinement produces better results
- Easier to review/adjust incrementally
- Separates content (what) from timing (when)

---

## Schema Requirements

### Input Schema: `2-1-identify-chapters.json`

```json
{
  "$schema": "http://json-schema.org/draft/07/schema#",
  "templateName": "identify-chapters",
  "description": "Identify logical chapters from transcript (first pass)",
  "dataSource": "transcript",

  "placeholders": {
    "transcript": {
      "type": "string",
      "required": true,
      "description": "Full video transcript"
    }
  },

  "outputSchema": {
    "type": "object",
    "required": ["chapters"],
    "properties": {
      "chapters": {
        "type": "array",
        "minItems": 1,
        "items": {
          "type": "object",
          "required": ["number", "name", "referenceQuote"],
          "properties": {
            "number": {
              "type": "integer",
              "minimum": 1
            },
            "name": {
              "type": "string",
              "description": "Simple, general chapter name",
              "minLength": 5,
              "maxLength": 50
            },
            "referenceQuote": {
              "type": "string",
              "description": "Quote from transcript for this chapter"
            }
          }
        }
      }
    }
  },

  "recommendedModel": "openai/gpt-4o-mini",
  "maxTokens": 1500,
  "temperature": 0.5
}
```

---

## Test Coverage Recommendations

### Test Scenario 1: Standard Tutorial (15 min)
**Input:** 15-minute React tutorial transcript

**Expected Output:**
- 7-10 chapters
- Chapter names: "Introduction", "Setup Environment", "First Component", etc.
- Each chapter has relevant quote

---

### Test Scenario 2: Short Video (3 min)
**Input:** 3-minute quick tip video

**Expected Output:**
- 2-4 chapters (not 10+)
- Broad sections: "Introduction", "The Tip", "Summary"

---

### Test Scenario 3: Long Deep-Dive (45 min)
**Input:** 45-minute comprehensive tutorial

**Expected Output:**
- 12-15 chapters
- Granular breakdown of sub-topics

---

### Test Scenario 4: Stream-of-Consciousness
**Input:** Unstructured live stream transcript

**Expected Output:**
- 5-7 broad time-based chapters
- Names: "Opening Discussion", "Main Topic", "Q&A", etc.

---

## Action Items (For Second Pass)

**Priority: Medium**
- [ ] Add chapter count guidelines (5-10 typical, adjust by length)
- [ ] Define minimum chapter length (~2 min content)
- [ ] Clarify intro/outro handling
- [ ] Create `schemas/2-1-identify-chapters.json` schema file

**Priority: Low**
- [ ] Add examples of good vs bad chapter names
- [ ] Consider using `transcriptAbridgement` instead of full `transcript`

---

## Recommendation

**This prompt is well-designed for initial chapter identification.**

**Key Strengths:**
1. ✅ Simple naming guidelines prevent overly detailed chapters
2. ✅ Reference quotes provide validation and audit trail
3. ✅ Part of 3-step workflow (identify → refine → create)
4. ✅ Clear output format

**Minor improvements:**
- Add chapter count guidelines (prevent too many/too few)
- Define minimum chapter length
- Clarify edge cases (short videos, unstructured content)

**Overall:** Solid first pass for chapter identification. Works well as part of iterative workflow.

---

**Reference:**
- Formatting Rules: `prompts/0-formatting-rules.md`
- Pattern Observations: `docs/pattern-observations.md`
- Next Steps: `2-2-refine-chapters.hbs`, `2-3-create-chapters.hbs`
