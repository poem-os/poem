# Penny's Review: `2-3-create-chapters.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Create final YouTube chapter timestamps by matching to SRT file
**Status:** ✅ Well-formatted, production-ready

---

## Formatting Assessment

### ✅ Follows `0-formatting-rules.md` Standards

- ✅ Opening statement with clear purpose
- ✅ Numbered steps (Step 1, Step 2, Step 3, Step 4)
- ✅ Clear bullet points and sub-steps
- ✅ Horizontal rules separate major sections
- ✅ Output format shown in code block
- ✅ Input sections with proper tags
- ✅ Bold emphasis for key rules
- ✅ Example formatting for SRT and timestamp conversion

**Verdict:** Fully compliant after formatting.

---

## Input/Output Analysis

### Inputs

**Three inputs required:**

1. **`{{srt}}`** - SRT subtitle file with timestamps
   - Contains precise timing for each spoken phrase
   - Format: Block number, timestamp range, text

2. **`{{transcript}}`** - Plain text transcript (cleaner)
   - Used as context when SRT matching is difficult
   - Fallback for unclear matches

3. **`{{chapters}}`** - Refined chapters from 2-2-refine
   - Chapter titles (under 49 chars)
   - Reference text for matching

**Why all three?**
- SRT: Source of timestamps (primary)
- Transcript: Context for validation (secondary)
- Chapters: What to timestamp (target)

---

### Outputs

**Output Name (Inferred):** `youtubeChapters` or `finalChapters`

**Output Format:**
```
0:00 Chapter Title
1:35 Next Chapter
3:45 Another Chapter
```

**YouTube-ready format:**
- `M:SS` or `H:MM:SS` format
- Title follows timestamp
- One chapter per line

**Output Schema (Inferred):**
```json
{
  "chapters": [
    {
      "timestamp": "0:00",
      "title": "Introduction",
      "srtBlockNumber": 1
    },
    {
      "timestamp": "1:35",
      "title": "Setup Environment",
      "srtBlockNumber": 45
    }
  ]
}
```

---

## Workflow Position: Final Step

**Complete 3-step chapter workflow:**
```
2-1-identify (AI draft)
    ↓
2-2-refine (human folders + 49-char titles)
    ↓
2-3-create (this - add timestamps from SRT)
```

**This is the final output** - directly usable in YouTube description.

---

## Matching Strategy Analysis

### Good: 4-Step Matching Process

**1. Extract key phrase (5-10 distinctive words)**
- Avoids false matches (uses distinctive words)
- Balances specificity vs flexibility

**2. Find in SRT (allow minor differences)**
- Handles transcription variations
- Hyphenation, punctuation differences OK

**3. Get timestamp (START time)**
- Uses beginning of SRT block
- Ensures chapter starts at right moment

**4. Handle splits (multi-block text)**
- Uses FIRST block timestamp
- Prevents mid-sentence chapter starts

**This is solid text-matching logic.**

---

## Critical Rules

### Rule 1: First Chapter Must Be 0:00
**Why:** YouTube chapters require starting at beginning
- YouTube will reject chapters that don't start at 0:00
- Platform constraint, not optional

### Rule 2: Chronological Order
**Why:** Chapters must increase
- Cannot go backwards in time
- SRT is chronological, chapters must follow

### Rule 3: No Duplicates
**Why:** Each chapter needs unique timestamp
- YouTube won't display duplicate timestamps
- If two chapters match same SRT block, offset by 1 second

### Rule 4: All Chapters Included
**Why:** Don't lose chapters from refinement step
- User provided folder structure in 2-2
- Must honor all folders/chapters

### Rule 5: Title Under 49 Chars
**Why:** Already validated in 2-2-refine
- Just use as-is (no modification needed)

**These rules are well-defined and testable.**

---

## Edge Cases

### Edge Case 1: Reference Text Not Found in SRT
**Problem:** Chapter reference doesn't match any SRT block

**Current Handling:** ✅ Guidance provided
- Look for partial phrase matches
- Use surrounding context from transcript
- Note uncertainty in output

**Recommendation:** Add fallback strategy
- If no match found, estimate based on surrounding chapters
- Example: Chapter 3 is halfway between Chapter 2 (2:00) and Chapter 4 (6:00) → estimate 4:00

---

### Edge Case 2: Two Chapters Match Same SRT Block
**Problem:** Adjacent chapters start at same moment

**Current Handling:** ⚠️ "No duplicates" rule but no resolution strategy

**Recommendation:** Offset by 1 second
- Chapter 1: 2:30
- Chapter 2: 2:31 (if matched same block)

---

### Edge Case 3: SRT Has Timestamps, Transcript Doesn't
**Problem:** Reference text from chapters may match transcript, not SRT

**Current Handling:** ⚠️ Implicit - match against SRT text

**Clarification needed:** Should reference text be from SRT or transcript?
- If from transcript: May not match SRT wording exactly
- If from SRT: Already aligned

---

### Edge Case 4: Very Long Video (Hours)
**Problem:** Timestamp format needs hours

**Current Handling:** ✅ Mentioned - `M:SS` or `H:MM:SS`

**Examples:**
- Short video: `1:35`, `3:45`
- Long video: `1:05:30`, `2:30:15`

---

## SRT Format Understanding

**Good: Provides clear SRT format example**

```
1
00:00:00,840 --> 00:00:05,440
First line of speech

2
00:00:05,440 --> 00:00:09,430
Second line of speech
```

**Prompt correctly instructs:**
- Use START time (before `-->`)
- Convert `00:00:05,440` → `0:05`
- Convert `00:01:35,200` → `1:35`

**Missing:** Handling of milliseconds (,440) - are they ignored or rounded?
- Recommendation: Ignore milliseconds, use seconds only

---

## Schema Requirements

### Input Schema: `2-3-create-chapters.json`

```json
{
  "$schema": "http://json-schema.org/draft/07/schema#",
  "templateName": "create-chapters",
  "description": "Create final YouTube chapter timestamps",

  "placeholders": {
    "srt": {
      "type": "string",
      "required": true,
      "description": "SRT subtitle file with timestamps"
    },
    "transcript": {
      "type": "string",
      "required": true,
      "description": "Plain text transcript for context"
    },
    "chapters": {
      "type": "string",
      "required": true,
      "description": "Refined chapters from 2-2-refine",
      "source": "2-2 output"
    }
  },

  "outputSchema": {
    "type": "object",
    "required": ["chapters", "uncertainMatches"],
    "properties": {
      "chapters": {
        "type": "array",
        "minItems": 1,
        "items": {
          "type": "object",
          "required": ["timestamp", "title"],
          "properties": {
            "timestamp": {
              "type": "string",
              "pattern": "^(\\d+:)?\\d{1,2}:\\d{2}$",
              "description": "M:SS or H:MM:SS format"
            },
            "title": {
              "type": "string",
              "maxLength": 49
            }
          }
        }
      },
      "uncertainMatches": {
        "type": "array",
        "items": {
          "type": "string",
          "description": "List of chapters where matching was difficult"
        }
      }
    }
  },

  "validationRules": {
    "firstChapterMustBeZero": true,
    "chronologicalOrder": true,
    "noDuplicateTimestamps": true
  },

  "recommendedModel": "openai/gpt-4o-mini",
  "maxTokens": 2000,
  "temperature": 0.3
}
```

---

## Test Coverage Recommendations

### Test Scenario 1: Standard Match (All Exact)
**Input:**
- 5 chapters with clear reference text
- All reference text found in SRT

**Expected Output:**
```
0:00 Introduction
1:35 Setup Environment
4:20 First Component
7:45 Adding State
10:30 Summary
```

**Validation:**
- All timestamps chronological
- First is 0:00
- No duplicates

---

### Test Scenario 2: Partial Match (Some Uncertain)
**Input:**
- 4 chapters, but 1 reference text not in SRT

**Expected Output:**
```
0:00 Introduction
1:30 Setup (estimated - no exact match)
5:00 Main Content
8:15 Conclusion
```

**Note before output:** "Chapter 2 (Setup) had no exact match - timestamp estimated from context"

---

### Test Scenario 3: Adjacent Chapters (Duplicate Risk)
**Input:**
- Two chapters start in same SRT block

**Expected Output:**
```
0:00 Introduction
2:30 Topic Overview
2:31 First Subtopic (offset from 2:30)
5:00 Next Major Topic
```

**Validation:** No duplicate timestamps (2:31 offset)

---

### Test Scenario 4: Long Video (Hour+ Format)
**Input:**
- 90-minute video with 12 chapters

**Expected Output:**
```
0:00 Introduction
5:30 Part 1
15:45 Part 2
1:05:30 Advanced Topics (hour format)
1:25:00 Conclusion
```

**Validation:** Proper H:MM:SS format after 1 hour

---

## Action Items (For Second Pass)

**Priority: High**
- [ ] Create `schemas/2-3-create-chapters.json` with timestamp validation
- [ ] Add fallback strategy for no-match cases (estimate from surrounding)

**Priority: Medium**
- [ ] Define duplicate timestamp resolution (offset by 1 second)
- [ ] Clarify millisecond handling (ignore vs round)
- [ ] Add validation rules to schema (first=0:00, chronological, no dupes)

**Priority: Low**
- [ ] Add examples of good vs problematic SRT matching
- [ ] Document expected uncertainty rate (how often are matches unclear?)

---

## Recommendation

**This prompt is production-ready** and completes the 3-step chapter workflow.

**Key Strengths:**
1. ✅ Clear 4-step matching strategy
2. ✅ Well-defined rules (5 critical constraints)
3. ✅ Handles uncertainty (partial matches, context fallback)
4. ✅ YouTube-ready output format (M:SS / H:MM:SS)
5. ✅ Three-input validation (SRT + transcript + chapters)

**Minor enhancements:**
- Add fallback strategy for complete match failures
- Define duplicate timestamp resolution
- Clarify millisecond handling

**Overall:** Solid final step that produces YouTube-ready chapter timestamps.

---

**Reference:**
- Previous: `2-2-refine-chapters.penny.md`
- Workflow: Completes Section 2 (Build Chapters)
- Output: YouTube description format (`0:00 Title`)
