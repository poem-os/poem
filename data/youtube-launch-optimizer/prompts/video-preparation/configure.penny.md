# Penny's Review: `1-1-configure.hbs`

**Reviewed:** 2026-02-04
**Prompt Purpose:** Extract project metadata and generate YouTube title suggestions
**Status:** ✅ Formatting follows 0-rules.md standards

---

## Formatting Assessment

### ✅ Follows `0-rules.md` Standards

- ✅ Opening statement explains purpose
- ✅ Numbered steps with clear action verbs
- ✅ Horizontal rules separate major sections
- ✅ Output format in code block
- ✅ Blank lines between sections
- ✅ Descriptive variable names (`{{projectFolder}}`, `{{transcript}}`)
- ✅ Clean structure matches the "After" example in 0-rules.md

**Verdict:** This prompt is well-formatted and serves as a good reference example.

---

## POEM Architecture Observations

### 1. Missing JSON Schema (Schema-First Design)

**Issue:** No corresponding schema file to validate inputs.

**Expected Location:** `data/youtube-launch-optimizer/schemas/1-1-configure.schema.json`

**Required Fields:**
- `projectFolder` (string, pattern: `^[a-z]\d{2}`, example: "b69")
- `transcript` (string, minLength: 1)

**Impact:** Medium - Can't validate inputs before prompt execution, risks runtime errors.

---

### 2. External Reference: "Title Format" Guidelines

**Location:** Step 2, line 8
```
Create a short title based on the project folder name using the "Title Format" guidelines.
```

**Issue:** References external "Title Format" guidelines not defined in prompt.

**Questions:**
- Where are these guidelines documented?
- Should they be inlined, parameterized, or referenced?
- Are they consistent across all YouTube workflow prompts?

**Impact:** Low - Assumes context that may not be available to AI or future maintainers.

---

### 3. Mixed Concerns (Noted in `0-observations.md`)

**Issue:** Prompt combines configuration (Step 1, Step 2) with processing (Step 3).

**Current Behavior:**
- Steps 1-2: Extract metadata (configuration)
- Step 3: Analyze transcript and generate titles (processing)

**POEM Best Practice:** Configuration prompts should load/validate inputs, not perform analysis.

**Potential Refactor:**
- **1-1-configure**: Extract project code and short title only
- **1-2-suggest-titles**: Analyze transcript and generate alternatives

**Impact:** Medium - Works functionally, but misaligns with separation of concerns. Affects reusability.

---

### 4. Edge Case Handling

**Missing Fallbacks:**
- No handling for empty/missing `{{transcript}}`
- No validation if `projectFolder` doesn't match expected pattern
- No guidance if project code extraction fails

**Potential Addition:**
```handlebars
{{#if transcript}}
<transcript>
{{transcript}}
</transcript>
{{else}}
[No transcript available - generate titles based on project folder name only]
{{/if}}
```

**Impact:** Low - Most executions will have valid data, but could fail gracefully.

---

### 5. Output Constraints

**Mentioned but not enforced:**
- "Short title" - no length specification
- "3-7 words each" - stated in Step 3, not reinforced in output format

**Potential Clarification:**
```
Short Title (3-7 words): [title based on folder name]

Suggested Titles (each 3-7 words):
```

**Impact:** Low - AI generally respects these constraints, but explicit is better.

---

## Test Coverage Recommendations

**Suggested Test Scenarios:**

1. **Happy Path**
   - `projectFolder`: "b69-how-to-bake-bread"
   - `transcript`: Full transcript (500+ words)
   - Expected: Clean extraction, 5-7 title suggestions

2. **Edge Case: Short Transcript**
   - `projectFolder`: "c42-quick-tip"
   - `transcript`: 50 words
   - Expected: Fewer title suggestions (3-4)

3. **Edge Case: Malformed Project Code**
   - `projectFolder`: "project-123-invalid"
   - `transcript`: Full transcript
   - Expected: Graceful failure or pattern mismatch handling

4. **Edge Case: Missing Transcript**
   - `projectFolder`: "b69-how-to-bake-bread"
   - `transcript`: ""
   - Expected: Fallback to folder-name-only title generation

---

## Action Items (For Second Pass)

**Priority: High**
- [ ] Create `1-1-configure.schema.json` schema file

**Priority: Medium**
- [ ] Clarify or inline "Title Format" guidelines
- [ ] Consider splitting into `1-1-configure` + `1-2-suggest-titles`

**Priority: Low**
- [ ] Add `{{#if transcript}}` conditional for graceful degradation
- [ ] Reinforce length constraints in output format section
- [ ] Generate mock data and test edge cases

---

## Notes

- Prompt follows formatting standards from `0-rules.md` ✅
- Conceptual design issue noted in `0-observations.md` (mixed concerns)
- Well-structured and readable - good reference example for other prompts
- Schema-first gap is most critical issue

---

**Reference:**
- Formatting Rules: `data/youtube-launch-optimizer/prompts/0-rules.md`
- Design Observations: `data/youtube-launch-optimizer/prompts/0-observations.md`
