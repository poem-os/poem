# Penny's Review: `1-6-seperate-intro-outro.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Extract intro and outro sections from transcript
**Status:** ⚠️ Needs architectural rethinking

---

## ⚠️ CRITICAL: Architectural Concern

**This prompt needs to be rethought in the context of understanding videos in general.**

The current approach treats intro/outro as simple text extraction, but videos have multiple structural elements:
- Intros (greeting, context setting)
- Outros (recap, sign-off)
- Calls to action (CTAs) - may appear multiple times
- Chapters - logical content sections
- Breakout moments - key demonstrations or highlights
- Transitions between topics

**The fundamental problem:** The prompt uses **circular/subjective logic** to identify boundaries:
- "Intro = everything before main content begins"
- "Main content = everything after intro"
- **But how do you identify the boundary?**

This is like saying "the intro ends when it stops being the intro" - not actionable for consistent AI execution.

**Recommendation:** Revisit this as part of a comprehensive video structure analysis approach, potentially combining with Section 10-11 prompts (Extract/Analyze Elements).

---

## Formatting Assessment

### ❌ Does NOT Follow `0-formatting-rules.md` Standards

- ⚠️ Has opening statement but not "You are..." format
- ⚠️ Has numbered steps (1, 2, 3) but mixed with sub-bullets
- ❌ No horizontal rules separating major sections
- ❌ Output format not in proper code block
- ❌ Input section uses XML-style tags but inconsistent structure
- ⚠️ Some instructions mixed with format examples

**Verdict:** Partially structured but needs formatting polish.

---

## Input/Output Analysis

### Inputs

**Expected Data:**
```handlebars
{{transcript}}  // Full video transcript (string)
```

**Note:** Uses original `transcript`, not `transcriptAbridgement`
- Could use either, but original ensures full intro/outro text
- Abridgement might have truncated intro/outro content

---

### Outputs

**Current State:** ⚠️ Output format defined but not in code block

**Output Format (Current):**
```
Intro section: [Extracted intro text]
Outro section: [Extracted outro text]
```

**Output Names (Inferred):**
- `introText` - Full text of intro section
- `outroText` - Full text of outro section

**Missing:**
- Structured output (what if no intro found? no outro?)
- Timestamps (where does intro end? where does outro start?)
- Confidence level (is this definitely the intro/outro?)

---

## Purpose Analysis

### What This Prompt Does

**Content Segmentation:**
- Identifies intro section (opening to main content start)
- Identifies outro section (recap/CTA to end)
- Extracts full text of each section

**Why This Matters for YouTube Workflow:**
- Intro text → Used for hook analysis
- Outro text → Used for CTA (call-to-action) extraction
- Main content (implicit) → Everything between intro and outro

**Downstream Uses:**
- Section 10: Extract elements (intro, outro, CTA, breakout moments)
- Section 11: Analyze elements (what makes intro engaging?)

---

## Critical Issue: Circular Logic in Identification Rules

### The Core Problem: Subjective/Circular Instructions

**The prompt says:**
> "The intro includes everything up to where the main content begins"

**This is circular logic:**
- Intro = everything before main content
- Main content = everything after intro
- **But how do you identify the boundary?**

It's like saying "the intro ends when it stops being the intro" - not actionable for AI.

**Result:** Five AI runs might give five different cutoff points (inconsistent, unreliable).

---

### Specific Issues

**Current instructions:**
- "The intro includes everything up to where the main content begins"
- "The outro starts when the speaker recaps or mentions liking/subscribing"

**Why these are problematic:**
1. **"Where main content begins"** - How to identify this boundary?
   - First substantial point?
   - After channel intro animation?
   - After "In this video we'll cover..."?

2. **"Recaps or mentions liking/subscribing"** - What if:
   - No recap exists?
   - CTA is in middle of video?
   - Multiple CTAs throughout?

**Edge cases not handled:**
- Videos with no formal intro (jumps right in)
- Videos with no outro (cuts off abruptly)
- Videos with mid-roll CTAs
- Videos with multiple recaps

---

## POEM Architecture Observations

### Content Segmentation Pattern

**This is the first segmentation prompt in the workflow:**

```
Transcript (full)
    │
    ├─> Intro section
    ├─> Main content (implicit - everything not intro/outro)
    └─> Outro section
```

**Why segment?**
- Different sections serve different purposes
- Intro → Hook and context setting
- Main → Core teaching/demonstration
- Outro → Recap and CTA

**Better structure (recommended):**
```json
{
  "intro": {
    "text": "Hey everyone, welcome back...",
    "startTime": "00:00",
    "endTime": "00:45",
    "wordCount": 120
  },
  "mainContent": {
    "text": "Today we're building...",
    "startTime": "00:45",
    "endTime": "14:30",
    "wordCount": 2800
  },
  "outro": {
    "text": "So that's how you build...",
    "startTime": "14:30",
    "endTime": "15:00",
    "wordCount": 95
  }
}
```

---

## Edge Cases

### Edge Case 1: No Formal Intro (Jumps Right In)
**Example:** "Let's build a React app. First, create a new project..."

**Current Handling:** ❌ Unclear - would it extract first sentence? entire video?

**Recommendation:**
- Output: `"intro": null` or `"intro": "None detected"`
- Don't force extraction if no intro exists

---

### Edge Case 2: No Outro (Video Cuts Off)
**Example:** Video ends mid-sentence or abruptly without recap

**Current Handling:** ❌ Unclear

**Recommendation:**
- Output: `"outro": null`
- Don't invent an outro if none exists

---

### Edge Case 3: Multiple CTAs (Mid-roll + Outro)
**Example:**
- 05:00 - "If you like this, hit subscribe"
- 14:30 - "Thanks for watching, see you next time"

**Current Handling:** ❌ Might extract first CTA as outro

**Recommendation:**
- Outro = final section only
- Mid-roll CTAs captured separately

---

### Edge Case 4: Long Intro (3+ minutes)
**Example:** Intro includes channel update, sponsor message, episode overview

**Current Handling:** ⚠️ Might extract entire 3 minutes

**Recommendation:**
- Add guidance: "Intro typically 30-90 seconds"
- Or: Separate sponsor messages from intro

---

## Improved Identification Rules (Recommendation)

### Intro Detection

**Look for these signals:**
- Greeting ("Hey everyone", "Welcome back", "What's up")
- Channel intro/branding
- Episode context ("Today we're covering...")
- **Ends when:** First substantial teaching point begins

**Example markers:**
- "Let's get started"
- "First, we'll..."
- "Step 1:"

---

### Outro Detection

**Look for these signals:**
- Recap language ("So that's how you...", "To summarize...")
- CTA language ("Like and subscribe", "Leave a comment")
- Sign-off ("Thanks for watching", "See you next time")
- **Starts when:** Main teaching concludes, recap begins

**Example markers:**
- "And that's it"
- "So to recap"
- "If you enjoyed this"

---

## Test Coverage Recommendations

### Test Scenario 1: Standard Tutorial Structure
**Input:**
```
"Hey everyone, welcome to my channel. Today we're building a React app.
[... 2500 words of tutorial ...]
So that's how you build a React app. If you found this helpful, hit subscribe. Thanks for watching!"
```

**Expected Output:**
```
Intro: "Hey everyone, welcome to my channel. Today we're building a React app."
Outro: "So that's how you build a React app. If you found this helpful, hit subscribe. Thanks for watching!"
```

---

### Test Scenario 2: No Intro (Cold Open)
**Input:**
```
"First, create a new React project with npm create vite.
[... tutorial continues ...]"
```

**Expected Output:**
```
Intro: None detected
Outro: [if exists]
```

---

### Test Scenario 3: No Outro (Abrupt End)
**Input:**
```
"[... tutorial ...]
And finally, add the configuration file. [video ends]"
```

**Expected Output:**
```
Intro: [if exists]
Outro: None detected
```

---

## Schema Requirements

### Input Schema: `1-6-seperate-intro-outro.json`

```json
{
  "$schema": "http://json-schema.org/draft/07/schema#",
  "templateName": "separate-intro-outro",
  "description": "Extract intro and outro sections from transcript",
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
      "introText": {
        "type": ["string", "null"],
        "description": "Text of intro section (null if not detected)"
      },
      "outroText": {
        "type": ["string", "null"],
        "description": "Text of outro section (null if not detected)"
      },
      "mainContentStart": {
        "type": ["string", "null"],
        "description": "First few words of main content (for validation)"
      }
    }
  },

  "recommendedModel": "openai/gpt-4o-mini",
  "maxTokens": 1500,
  "temperature": 0.3
}
```

---

## Action Items (For Second Pass)

**Priority: High**
- [ ] Restructure to match formatting rules (proper steps, code blocks, horizontal rules)
- [ ] Add explicit intro/outro identification rules with examples
- [ ] Handle edge cases (no intro, no outro, null values)
- [ ] Add structured output with confidence levels

**Priority: Medium**
- [ ] Consider using `transcriptAbridgement` instead of full `transcript` (efficiency)
- [ ] Add timestamp/position information (where intro ends, outro starts)
- [ ] Create `schemas/1-6-seperate-intro-outro.json` schema file

**Priority: Low**
- [ ] Add word count limits (intro typically < 200 words, outro < 150 words)
- [ ] Add examples of good vs bad intro/outro detection

---

## Recommendation

**This prompt needs clarity improvements:**

1. ✅ **Core purpose is valid** - Segmenting intro/outro is useful
2. ⚠️ **Identification rules too vague** - Needs explicit markers
3. ❌ **Edge cases not handled** - What if no intro/outro?
4. ⚠️ **Output format basic** - Could be more structured

**Suggested improvements:**
- Add specific identification markers (greetings, CTAs, etc.)
- Handle null cases (no intro/outro detected)
- Consider structured output with confidence/positions
- Align with Section 10-11 prompts (which use these extractions)

**Not urgent** - prompt likely works in most cases, but edge case handling would improve robustness.

---

**Reference:**
- Formatting Rules: `prompts/0-formatting-rules.md`
- Pattern Observations: `docs/pattern-observations.md`
- Downstream: Section 10 (Extract Elements), Section 11 (Analyze Elements)
