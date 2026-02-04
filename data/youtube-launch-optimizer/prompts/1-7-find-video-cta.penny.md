# Penny's Review: `1-7-find-video-cta.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Identify references to past and future videos
**Status:** ✅ Well-formatted, solid logic

---

## Formatting Assessment

### ✅ Follows `0-formatting-rules.md` Standards

- ✅ Opening statement with "You are..." context
- ✅ Numbered steps (Step 1, Step 2, Step 3)
- ✅ Clear bullet points for example phrases
- ✅ Horizontal rules separate major sections
- ✅ Output format shown in code block (XML structure)
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

**Note:** Uses original `transcript` (full text needed to find all references)

---

### Outputs

**Output Names (Inferred):**
- `pastVideoReferences` - Array of {title, reference} objects
- `futureVideoReference` - Single {title, reference} object (or null)

**Output Format (XML-based):**
```xml
<past_videos>
  1. Title: [topic]
     Reference: [sentence]
</past_videos>

<future_video>
  Title: [topic]
  Reference: [sentence]
</future_video>
```

**Strong Points:**
- Handles optional elements (omit tags if none found)
- Clear structure with numbered list for past videos
- Distinction between multiple past vs single future

---

## Purpose Analysis

### What This Prompt Does

**Cross-Video Reference Detection:**
- Identifies mentions of creator's other videos (past)
- Identifies teases for upcoming videos (future)
- Extracts context (full sentence with reference)

**Why This Matters for YouTube Workflow:**
- **Past references** → Opportunity for video cards/end screens
- **Future references** → Content pipeline planning, audience expectations
- **Context preservation** → Understand why video was mentioned

**Potential Downstream Uses:**
- Auto-generate video cards/end screens
- Track content series and sequencing
- Measure cross-promotion effectiveness

---

## Observations

### Good: Clear Example Phrases

**The prompt provides explicit patterns to match:**

**Past video indicators:**
- "As I mentioned in my video about..."
- "In a previous video, I talked about..."
- "If you've seen my video on..."

**Future video indicators:**
- "I'll be making a video about..."
- "In an upcoming video, I'll discuss..."
- "Stay tuned for my video on..."

**Why this works:** AI knows what to look for (not vague like 1-6's "where main content begins")

---

### Good: Filtering Rules

**"Only include clear references to other videos"**
- Do NOT include vague mentions
- Do NOT include general topics
- Must be explicit video references

**This prevents false positives:**
- ❌ "We'll talk about React later" (not a video reference)
- ✅ "In my React tutorial video, I covered..." (explicit reference)

---

### Good: Optional Element Handling

**"If there are no past video references, omit the `<past_videos>` tag entirely"**

This is proper null handling (unlike 1-6 which doesn't specify what to do if no intro/outro).

---

## Edge Cases

### Edge Case 1: No References Found
**Expected Output:** Empty (no XML tags)

**Current Handling:** ✅ Explicitly stated (omit tags)

---

### Edge Case 2: Ambiguous Reference
**Example:** "As I mentioned before, React hooks are great"

**Is this a video reference?**
- Could be: "earlier in THIS video"
- Could be: "in a PREVIOUS video"

**Current Handling:** ⚠️ Relies on AI interpretation

**Recommendation:** Add guidance:
- "earlier in this video" → NOT a video reference
- "in my previous video" → IS a video reference

---

### Edge Case 3: Multiple Future Videos Mentioned
**Example:** "Next week I'll post about React, then the week after about TypeScript"

**Current Handling:** ⚠️ Prompt says "at most one future video reference"

**Possible issue:** Would AI pick first? last? both?

**Recommendation:** Clarify expected behavior

---

### Edge Case 4: Indirect Reference
**Example:** "Check the description for my Redux tutorial link"

**Is this a video reference?** Yes (implicitly referencing another video)

**Current Handling:** ⚠️ May not match the explicit phrase patterns

**Could enhance:** Add pattern "check out my [topic] video"

---

## Schema Requirements

### Input Schema: `1-7-find-video-cta.json`

```json
{
  "$schema": "http://json-schema.org/draft/07/schema#",
  "templateName": "find-video-cta",
  "description": "Identify references to past and future videos",
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
    "properties": {
      "pastVideoReferences": {
        "type": "array",
        "items": {
          "type": "object",
          "required": ["title", "reference"],
          "properties": {
            "title": {
              "type": "string",
              "description": "Short title or topic"
            },
            "reference": {
              "type": "string",
              "description": "Full sentence containing reference"
            }
          }
        }
      },
      "futureVideoReference": {
        "type": ["object", "null"],
        "properties": {
          "title": {
            "type": "string",
            "description": "Short title or topic"
          },
          "reference": {
            "type": "string",
            "description": "Full sentence containing reference"
          }
        }
      }
    }
  },

  "recommendedModel": "openai/gpt-4o-mini",
  "maxTokens": 1000,
  "temperature": 0.3
}
```

---

## Test Coverage Recommendations

### Test Scenario 1: Multiple Past References
**Input:**
```
"As I showed in my React Hooks tutorial, you can use useState.
In my previous video on TypeScript, I covered interfaces.
Today we'll combine both concepts."
```

**Expected Output:**
```xml
<past_videos>
  1. Title: React Hooks tutorial
     Reference: As I showed in my React Hooks tutorial, you can use useState.

  2. Title: TypeScript video
     Reference: In my previous video on TypeScript, I covered interfaces.
</past_videos>
```

---

### Test Scenario 2: Future Video Tease
**Input:**
```
"[... content ...]
Next week, I'll be making a video about advanced React patterns.
Thanks for watching!"
```

**Expected Output:**
```xml
<future_video>
  Title: advanced React patterns
  Reference: Next week, I'll be making a video about advanced React patterns.
</future_video>
```

---

### Test Scenario 3: No References
**Input:**
```
"Today I'm building a simple React app. Let's start with create-react-app..."
(No mentions of other videos)
```

**Expected Output:** Empty (no XML tags)

---

### Test Scenario 4: Ambiguous "Before" Reference
**Input:**
```
"As I mentioned before, hooks are great..."
```

**Expected:** NOT included (ambiguous - could be earlier in THIS video)

**Test:** Ensure AI doesn't extract this as past video reference

---

## Action Items (For Second Pass)

**Priority: Medium**
- [ ] Clarify handling of ambiguous "before/earlier" references
- [ ] Define behavior if multiple future videos mentioned
- [ ] Consider indirect reference patterns ("check description for...")
- [ ] Create `schemas/1-7-find-video-cta.json` schema file

**Priority: Low**
- [ ] Add more example phrases for edge cases
- [ ] Consider JSON output instead of XML (easier parsing)

---

## Recommendation

**This prompt is well-designed and production-ready** with minor enhancements possible.

**Key Strengths:**
1. ✅ Clear example phrases (not vague like 1-6)
2. ✅ Explicit filtering rules (prevents false positives)
3. ✅ Proper null handling (omit tags if none found)
4. ✅ Structured output with context preservation
5. ✅ Distinction between multiple past vs single future

**Minor improvements:**
- Clarify ambiguous "before/earlier" cases
- Handle multiple future video mentions
- Consider indirect reference patterns

**Overall:** Solid prompt with actionable instructions.

---

**Reference:**
- Formatting Rules: `prompts/0-formatting-rules.md`
- Pattern Observations: `docs/pattern-observations.md`
