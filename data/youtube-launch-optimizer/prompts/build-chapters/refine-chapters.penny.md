# Penny's Review: `2-2-refine-chapters.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Refine chapter titles with folder alignment and character limits
**Status:** ✅ Production-ready, canonical version

---

## Formatting Assessment

### ✅ Follows `0-formatting-rules.md` Standards

- ✅ Opening statement with clear goal
- ✅ Numbered steps (Step 1, Step 2, Step 3, Step 4)
- ✅ Clear bullet points for requirements
- ✅ Horizontal rules separate major sections
- ✅ Output format shown in code block
- ✅ Input sections with proper tags
- ✅ Quality checklist at end
- ✅ Bold emphasis for key requirements

**Verdict:** Fully compliant.

---

## Key Strength: 49-Character Limit 🎯

**Why this is critical:**
- YouTube shows exactly 49 characters in hover preview
- Longer titles get truncated with "..."
- Viewers scan chapters to jump to sections
- Forces concise, scannable naming

**This is a production-learned constraint** - evolved from real-world YouTube usage.

**Examples:**
- ✅ "Introduction to React Hooks" (29 chars)
- ✅ "Setting Up the Development Environment" (40 chars)
- ❌ "Introduction to React Hooks and Why They're Better Than Class Components" (74 chars - truncated)

---

## Input/Output Analysis

### Inputs

**Three inputs required:**

1. **`{{identifyChapters}}`** - AI-suggested chapters from 2-1-identify
   - Draft chapter list with reference quotes
   - May be inaccurate (AI guessing boundaries)

2. **`{{chapterFolderNames}}`** - Author's folder structure (AUTHORITATIVE)
   - User-provided ground truth
   - Defines chapter count and order
   - Example: `["00-intro", "01-setup", "02-first-component"]`

3. **`{{transcript}}`** - Full video transcript
   - Source for matching titles to content
   - Validation against actual spoken words

**Why all three?**
- AI suggestions: Starting point (may need correction)
- Folder names: Ground truth structure (human-provided)
- Transcript: Content validation (what was actually said)

---

### Outputs

**Output Name (Inferred):** `refinedChapters`

**Output Format:**
```
Chapters:

00. [Title under 49 chars]
    "[Matching transcript quote]"

01. [Title under 49 chars]
    "[Matching transcript quote]"
```

**Output Schema (Inferred):**
```json
{
  "chapters": [
    {
      "number": "00",
      "title": "Introduction",
      "characterCount": 12,
      "referenceQuote": "Hey everyone, welcome to..."
    }
  ]
}
```

---

## Workflow Position: Human-in-the-Loop

**3-step chapter workflow:**
```
2-1-identify (AI draft)
    ↓
2-2-refine (this - human folders + AI refinement)
    ↓
2-3-create (add timestamps)
```

**Key insight:** This is NOT fully automated
- Step 2-1: AI guesses chapters
- **Step 2-2: Human provides folder names** (authoritative structure)
- Step 2-3: Final YouTube format

**Why human folders matter:**
- AI boundary detection not highly accurate (per user feedback on 2-1)
- User knows video structure better than AI
- Folder names = semantic boundaries user has chosen

---

## ⚠️ CRITICAL: Workflow Design Implication

**This prompt requires EXTERNAL HUMAN INPUT, not just previous step data.**

**Input Source Distinction:**
- `{{identifyChapters}}` → **From workflow bus** (output of 2-1-identify)
- `{{chapterFolderNames}}` → **From human input** (external, not from previous step)
- `{{transcript}}` → **From workflow bus** (accumulated state)

**Why this matters for workflow orchestration:**
1. **Workflow pause required** - Must stop and wait for human to provide folder names
2. **Not on the bus** - Folder names don't come from previous steps
3. **Checkpoint implementation** - Needs UI/CLI interface for human input
4. **YAML structure impact** - Must define human input mechanism

**SupportSignal Reference:**
- SupportSignal workflows don't have mid-workflow human input (all inputs upfront)
- YouTube workflow needs **checkpoint pattern** for human folder input

**YAML Workflow Implications:**
```yaml
- id: refine-chapters
  name: Refine Chapter Titles
  type: action
  action: llm
  prompt: prompts/2-2-refine-chapters.hbs

  inputs:
    identifyChapters: "{{identifyChapters}}"  # From previous step (2-1)
    transcript: "{{transcript}}"               # From workflow state
    chapterFolderNames: "{{chapterFolderNames}}" # FROM HUMAN - needs checkpoint

  # Human input checkpoint BEFORE this step
  humanInput:
    required: true
    checkpoint: true
    inputName: chapterFolderNames
    inputType: array
    description: "User provides folder names defining chapter structure"
```

**Related to Story 4.7:** Human-in-the-Loop Checkpoints (Epic 4)

---

## Critical Rules

### Rule 1: Match Folder Count Exactly
**"Produce exactly one chapter per folder name"**

**Why:** Folder structure is authoritative
- If 5 folders → must output 5 chapters
- Cannot add extra chapters
- Cannot skip folders

### Rule 2: Preserve Folder Order
**"Do not add, remove, or reorder chapters"**

**Why:** Order matters for YouTube
- Chapters must be chronological
- User's folder order = intended sequence

### Rule 3: Character Limit Enforcement
**"Under 49 characters"**

**Why:** YouTube UI constraint
- Enforced by quality checklist
- Should be validated in schema

---

## Quality Checklist (Built-in QA)

**5-point verification:**
1. Each title under 49 characters
2. Each chapter has matching reference text
3. Folder order preserved exactly
4. Titles are informative
5. One chapter per folder name

**This is good prompt design** - built-in self-QA reduces errors.

---

## Edge Cases

### Edge Case 1: Folder Name Doesn't Match Transcript
**Example:** Folder says "setup", transcript never mentions setup

**Current Handling:** ⚠️ AI must create title anyway (matching folder count rule)

**Recommendation:** AI should note discrepancy in reference quote
- Reference: "[No clear match - folder indicates setup phase]"

---

### Edge Case 2: Multiple AI Chapters Match One Folder
**Example:** AI identified 3 intro sections, but user has 1 "intro" folder

**Current Handling:** ✅ Implicit - "match folder count exactly" forces merging

**AI should:** Combine into single title covering all intro content

---

### Edge Case 3: Title Exactly 49 Characters
**Question:** Is 49 included or excluded?

**Current Handling:** "Under 49 characters" suggests < 49 (max 48)

**Recommendation:** Clarify: "49 characters or fewer" (≤49) or "Under 49" (<49)

---

## Schema Requirements

### Input Schema: `2-2-refine-chapters.json`

```json
{
  "$schema": "http://json-schema.org/draft/07/schema#",
  "templateName": "refine-chapters",
  "description": "Refine chapter titles with folder alignment",

  "placeholders": {
    "identifyChapters": {
      "type": "string",
      "required": true,
      "description": "Output from 2-1-identify-chapters",
      "source": "2-1 output"
    },
    "chapterFolderNames": {
      "type": "array",
      "required": true,
      "description": "User's folder structure (authoritative)",
      "items": {"type": "string"},
      "example": ["00-intro", "01-setup", "02-component"]
    },
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
        "items": {
          "type": "object",
          "required": ["number", "title", "referenceQuote"],
          "properties": {
            "number": {
              "type": "string",
              "pattern": "^\\d{2}$"
            },
            "title": {
              "type": "string",
              "maxLength": 49,
              "description": "YouTube chapter title (49 char limit)"
            },
            "referenceQuote": {
              "type": "string",
              "description": "Transcript excerpt for this chapter"
            }
          }
        }
      }
    }
  },

  "recommendedModel": "openai/gpt-4o-mini",
  "maxTokens": 2000,
  "temperature": 0.5
}
```

---

## Action Items (For Second Pass)

**Priority: High**
- [ ] Create `schemas/2-2-refine-chapters.json` with 49-char validation
- [ ] Clarify "under 49" vs "49 or fewer" (≤49 vs <49)

**Priority: Medium**
- [ ] Add handling guidance for folder-transcript mismatches
- [ ] Document folder name format expectations (numbered? free-form?)

**Priority: Low**
- [ ] Add examples of good 49-char titles
- [ ] Consider validation for folder count matching

---

## Recommendation

**This prompt is production-ready** and represents the refined version evolved from real-world use.

**Key Strengths:**
1. ✅ 49-character limit (practical YouTube constraint)
2. ✅ Quality checklist (built-in QA)
3. ✅ Human-in-the-loop design (folder names as ground truth)
4. ✅ Three-input validation (AI draft + human structure + transcript)
5. ✅ Reference quotes for audit trail

**Version History:**
- Supersedes v1 (deprecated 2026-02-04 for missing character limit and structure)
- v2 promoted to canonical based on production constraints and quality checklist

---

**Reference:**
- Previous: `2-1-identify-chapters.penny.md`
- Next: `2-3-create-chapters` (add timestamps)
