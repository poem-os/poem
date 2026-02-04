# Penny's Review: `1-2-title-shortlist.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Review title suggestions and select preferred options
**Status:** ⚠️ Ambiguous interaction model - needs clarification

---

## Formatting Assessment

### ✅ Follows Some `0-rules.md` Standards

- ✅ Opening statement explains purpose
- ✅ Numbered steps (Step 1, Step 2)
- ✅ Horizontal rules separate sections
- ✅ Uses Handlebars `{{#each}}` helper correctly
- ✅ Blank lines between sections

### ❌ Missing Key Elements

- ❌ **No Output Format code block** - Violates `0-rules.md` requirement
- ❌ **Unclear separation of concerns** - Instructions mixed with output
- ❌ **No structured output specification**

**Verdict:** Partially compliant - missing critical output format section.

---

## Input/Output Analysis

### Inputs

**Expected Data:**
```handlebars
{{titleIdeas}}  // Array of strings (title suggestions)
```

**Schema Inference:**
```json
{
  "titleIdeas": [
    "How to Bake Bread in 5 Minutes",
    "Quick Bread Recipe for Beginners",
    "The Secret to Perfect Bread Every Time"
  ]
}
```

**Missing:** JSON schema file at `data/youtube-launch-optimizer/schemas/1-2-title-shortlist.schema.json`

---

### Outputs

**Current State:** ❌ No explicit output format defined

**Problem:** The prompt ends with a question:
```
"Which titles resonate with you? Enter your choices (numbers and/or your own ideas):"
```

**Critical Ambiguity:**
- Who is "you"? The AI? The human user?
- Is this a human-in-the-loop selection interface?
- Is this an AI recommendation prompt?
- How should selections be formatted?

**Expected Output (undefined):**
- Selected title indices?
- Modified titles?
- New custom titles?
- All of the above?

---

## Interaction Model Issue

### The Core Problem

This prompt has an **identity crisis**:

1. **If HUMAN selection:**
   - Should be a UI form, not an AI prompt template
   - Should capture structured input (JSON with selections)
   - Belongs in application layer, not prompt layer

2. **If AI selection:**
   - Needs selection criteria (SEO, engagement, brand fit, etc.)
   - Needs explicit output format
   - Should specify quantity (pick top 3? top 5?)

3. **If HYBRID (AI recommends, human confirms):**
   - Should be split into two prompts:
     - `1-2a-recommend-titles.hbs` (AI ranks/filters)
     - `1-2b-confirm-selection.hbs` (Human confirms)

**Current Prompt:** Tries to be all three at once ❌

---

## Observations on Better Prompt Design

### Option A: Pure AI Selection (Recommended for POEM)

**Goal:** AI selects best titles based on criteria

**Improved Prompt Structure:**
```markdown
You are an expert YouTube content strategist selecting the best video titles.

## Step 1: Review Title Candidates
Review the following title suggestions:

{{#each titleIdeas}}
{{add @index 1}}. {{this}}
{{/each}}

## Step 2: Evaluate Each Title
For each title, assess:
- **SEO potential** - Keyword strength and searchability
- **Click-through appeal** - Curiosity and engagement
- **Brand alignment** - Fits the channel's voice
- **Clarity** - Viewer understands topic immediately

## Step 3: Select Top 5 Titles
Choose the 5 best titles that balance SEO, engagement, and clarity.

---

## Output Format

```
Selected Titles (ranked by preference):

1. [Title from original list with index reference]
   - SEO Score: [1-10]
   - Engagement Score: [1-10]
   - Reasoning: [1-2 sentences]

2. [Title...]
   ...

5. [Title...]
```

---

## Original Title Ideas

{{#each titleIdeas}}
{{add @index 1}}. {{this}}
{{/each}}
```

**Why This Works:**
- ✅ Clear AI role (evaluator + selector)
- ✅ Explicit output format
- ✅ Criteria-driven selection
- ✅ Structured reasoning for transparency
- ✅ Follows `0-rules.md` formatting standards

---

### Option B: Human-in-the-Loop Selection

**Goal:** Present titles to human user for selection

**Solution:** Move to application UI layer, not prompt template

**Implementation:**
- Web form or CLI interface
- User selects checkboxes/numbers
- Capture selections as structured data

**Why NOT a Prompt Template:**
- Prompts are for AI-to-AI or Human-to-AI communication
- User input capture belongs in application code
- Can't enforce structured output from freeform "enter your choices"

---

### Option C: Hybrid (AI Filter + Human Confirm)

**Goal:** AI narrows down, human makes final choice

**Split into Two Prompts:**

**1-2a-recommend-titles.hbs:**
```markdown
You are filtering title candidates to a manageable shortlist.

## Step 1: Review All Titles
[List of titleIdeas]

## Step 2: Remove Poor Candidates
Eliminate titles that:
- Are too generic or clickbait
- Don't match brand voice
- Have weak SEO potential

## Step 3: Recommend Top 7 Titles
Select the 7 strongest candidates for human review.

---

## Output Format

```json
{
  "recommendedTitles": [
    {
      "index": 3,
      "title": "How to Bake Bread in 5 Minutes",
      "reasoning": "Strong SEO, clear value proposition"
    },
    ...
  ],
  "eliminatedTitles": [
    {
      "index": 1,
      "title": "You Won't Believe This!",
      "reasoning": "Clickbait, no SEO value"
    },
    ...
  ]
}
```
```

**1-2b-confirm-selection.hbs** (or UI form):
- Present `recommendedTitles` to human
- Capture final selections

---

## Schema Requirements

### Current (Inferred)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["titleIdeas"],
  "properties": {
    "titleIdeas": {
      "type": "array",
      "items": {"type": "string"},
      "minItems": 1
    }
  }
}
```

### Recommended (Option A: AI Selection)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["titleIdeas", "selectionCriteria"],
  "properties": {
    "titleIdeas": {
      "type": "array",
      "items": {"type": "string"},
      "minItems": 3
    },
    "selectionCriteria": {
      "type": "object",
      "properties": {
        "seoWeight": {"type": "number", "minimum": 0, "maximum": 1},
        "engagementWeight": {"type": "number", "minimum": 0, "maximum": 1},
        "maxSelections": {"type": "integer", "minimum": 1, "maximum": 10}
      }
    }
  }
}
```

---

## Edge Cases

**Current Prompt Fails On:**

1. **User enters invalid numbers** (e.g., "99" when only 7 titles exist)
   - No validation possible without structured output

2. **User enters only custom titles** (ignores all suggestions)
   - Output format can't capture this

3. **User enters mix of numbers and text**
   - Parsing "1, 3, My Custom Title, 7" is ambiguous

4. **Empty selection**
   - What if user provides no input?

**Better Approach (Option A) Handles:**
- AI always returns valid indices (1-N)
- Structured JSON output is parseable
- AI can't skip selection (must return top 5)

---

## Test Coverage Recommendations

### Test Scenario 1: Standard Selection
**Input:**
```json
{
  "titleIdeas": [
    "How to Bake Bread in 5 Minutes",
    "Quick Bread Recipe",
    "Bread Baking 101",
    "The Ultimate Bread Guide",
    "You Won't Believe This Bread Trick!"
  ]
}
```

**Expected Output (Option A):**
- Top 5 titles with scores and reasoning
- Valid index references (1-5)
- SEO/engagement scores between 1-10

---

### Test Scenario 2: Minimal Input
**Input:**
```json
{
  "titleIdeas": [
    "Title One",
    "Title Two",
    "Title Three"
  ]
}
```

**Expected Output:**
- All 3 titles ranked (can't select 5 from 3)
- Graceful handling of fewer options than requested

---

### Test Scenario 3: Poor Quality Titles
**Input:**
```json
{
  "titleIdeas": [
    "Click Here!!!",
    "You Won't Believe...",
    "OMG Watch This"
  ]
}
```

**Expected Output:**
- Low scores across the board
- Reasoning explains why titles are weak
- Possible recommendation to regenerate

---

## Action Items (For Second Pass)

**Priority: CRITICAL**
- [ ] **Decide interaction model** - AI selection? Human selection? Hybrid?
- [ ] **Define explicit output format** - Add code block with structure

**Priority: High**
- [ ] Create `1-2-title-shortlist.schema.json` schema file
- [ ] Rewrite prompt based on chosen model (see Option A/B/C above)

**Priority: Medium**
- [ ] Add selection criteria if AI-driven (SEO, engagement, etc.)
- [ ] Add edge case handling (empty list, minimal options)
- [ ] Specify quantity (top 3? top 5? configurable?)

**Priority: Low**
- [ ] Generate mock data and test scenarios
- [ ] Add examples of good vs bad title selections

---

## Recommendation

**Choose Option A (Pure AI Selection)** for POEM alignment:

1. **Fits POEM architecture** - Prompts should be AI-executable, not human forms
2. **Testable** - Can generate mock data and validate outputs
3. **Automatable** - Entire workflow can run without human intervention
4. **Structured** - Clear inputs/outputs, schema-driven

**If human selection is required:**
- Implement as application feature (web UI / CLI menu)
- Use prompt output from `1-1-configure` as input to UI
- Capture selections as structured data for next workflow step

---

## Notes

- Current prompt violates `0-rules.md` (missing output format)
- Interaction model is fundamentally ambiguous
- Cannot be properly tested or validated without output structure
- Needs architectural decision before formatting fixes

---

**Reference:**
- Formatting Rules: `data/youtube-launch-optimizer/prompts/0-rules.md`
- Design Observations: `data/youtube-launch-optimizer/prompts/0-observations.md`
- Previous Review: `data/youtube-launch-optimizer/prompts/1-1-configure.penny.md`
