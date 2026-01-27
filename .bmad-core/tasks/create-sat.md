# create-sat

Create a Story Acceptance Test (SAT) document for a completed story, execute automated tests, and track results in a single file. This combines test documentation, automated execution, and results tracking.

## Inputs

```yaml
required:
  - story_id: "{epic}.{story}" # e.g., "1.2"
  - story_path: "{devStoryLocation}/{epic}.{story}.*.md" # Path from core-config.yaml
```

## Prerequisites

- Story status must be "Complete" or "Review"
- Developer has implemented all acceptance criteria
- Code is functional and testable

## Process

### 1. **MANDATORY FIRST STEP: Execute Full Test Suite**

**BLOCKING REQUIREMENT - Must complete before proceeding:**

```bash
# Run full test suite
npm test

# Document results
```

**Document in SAT file header:**
```markdown
## Test Suite Baseline (Before SAT)
- **Executed**: [timestamp]
- **Results**: X/Y passing, Y skipped, Z failing
- **Story-related failures**: [List any failures related to this story]
```

**BLOCKING RULES:**
- ❌ **IF story-related tests are failing**: STOP. Return story to Dev (James) with failure details. DO NOT proceed to Step 2.
- ✅ **IF only unrelated tests failing**: Document them and proceed (note in SAT file why they're unrelated)
- ✅ **IF all tests passing**: Proceed to Step 2

**Rationale**: SAT cannot validate acceptance if implementation is broken. Full test suite execution catches integration issues that unit tests miss.

---

### 2. Read Story Context

- Load story file from `{devStoryLocation}/{epic}.{story}.story.md`
- Extract:
  - Acceptance criteria (full list)
  - Dev completion notes (what was implemented)
  - File list (what files were created/modified)
  - Manual verification results (if any)

### 3. Read Implementation Code

- Read key implemented files to understand:
  - What endpoints exist
  - What UI elements exist
  - What configuration is needed
  - What observable behavior exists

### 4. Categorize Acceptance Criteria

For each AC, determine:

**🧑 Human Tests (Visual/Manual)**:

- Browser-based (open URL, observe UI)
- Visual (colors, formatting, layout)
- Interactive (click, type, observe response)
- Observable behavior (logs, console output with colors)

**🤖 Terminal Tests (Scriptable)**:

- curl commands (API endpoints)
- Build commands (npm run build)
- File system checks (ls, cat)
- Package checks (grep package.json)

**⏳ Not Testable Yet**:

- Requires future stories
- Requires additional setup not in current story
- Placeholder for future functionality

### 5. Generate SAT Guide Structure

Create file: `{devStoryLocation}/{epic}.{story}.story-SAT.md`

**Template Structure**:

````markdown
# Story {epic}.{story} - Acceptance Test Guide

## Quick Summary

**Story**: {story title}
**Status**: {story status}
**Test Focus**: {brief description of what this story delivers}

## Prerequisites

**Before testing, ensure:**

- [ ] Story status is "Complete" or "Review"
- [ ] Server is not running (if applicable)
- [ ] Required dependencies installed (`npm install`)
- [ ] {any other specific prerequisites}

**Environment Setup:**

- Node.js: {version}
- Port: {port if applicable}
- Working directory: {directory}

---

## 🧑 Human Tests (Visual/Manual)

Tests requiring human observation - browser, UI, colors, interactive behavior.

### Test 1: AC{#} - {AC description}

**What to test**: {acceptance criterion}

**Steps**:

1. {Exact step - e.g., "Open browser to http://localhost:3000/api/health"}
2. {What to observe - e.g., "Observe JSON response"}
3. {Any interaction - e.g., "Refresh page"}

**Expected Result**:
✅ {Clear success criteria}

- {Observable outcome 1}
- {Observable outcome 2}

**Evidence**:

- {What to capture - e.g., "Screenshot of browser showing JSON"}
- {What to note - e.g., "Terminal shows blue colored log"}

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes**: **\*\*\*\***\_**\*\*\*\***

---

### Test 2: AC{#} - {AC description}

{repeat template}

---

## 🤖 Terminal Tests (Scriptable)

Tests using command-line tools - copy-paste ready commands.

### Test A: AC{#} - {brief description}

**What to test**: {what this validates}

**Command**:

```bash
{exact command - e.g., curl -s http://localhost:3000/api/health}
```
````

**Expected Output**:

```
{exact expected output}
```

**Validation**:

- ✅ {Success criterion 1}
- ✅ {Success criterion 2}

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes**: **\*\*\*\***\_**\*\*\*\***

---

### Test B: AC{#} - {brief description}

{repeat template}

---

## ⏳ Not Testable Yet

**AC{#}**: {description}
**Reason**: {why not testable - e.g., "Requires Story 1.4 Socket.io implementation"}
**When**: {which story will enable this test}

---

## Test Checklist

Copy this checklist to track overall progress:

**Human Tests:**

- [ ] Test 1: {brief description}
- [ ] Test 2: {brief description}

**Terminal Tests:**

- [ ] Test A: {brief description}
- [ ] Test B: {brief description}

**Overall Status**: ⬜ Not Started | 🔄 In Progress | ✅ All Passed | ❌ Issues Found

---

## Troubleshooting

### Issue: {Common problem}

**Symptom**: {What you see}
**Solution**: {How to fix}

### Issue: {Common problem}

**Symptom**: {What you see}
**Solution**: {How to fix}

---

## Test Results Summary

**Date Tested**: **\*\*\*\***\_**\*\*\*\***
**Tester**: **\*\*\*\***\_**\*\*\*\***

**Results**:

- Human Tests: ** / ** passed
- Terminal Tests: ** / ** passed
- Total: ** / ** passed

**Issues Found**:

1. {Issue description}
2. {Issue description}

**Sign-off**: ✅ Story accepted | ❌ Issues require fixes

---

_Generated by Taylor (SAT Guide Creator) from Story {epic}.{story}_

````

### 6. Write Human Tests

For each AC categorized as "Human Test":

**Guidelines**:
- Start with exact URL or navigation step
- Use visual language ("observe", "see", "displays")
- Note colors, formatting, layout details
- Include interactive steps (click, type, hover)
- Specify browser if needed (Chrome, Firefox)
- Note what should appear in terminal logs
- Use numbered steps (1, 2, 3)
- Include expected result in checklist format

**Example**:
```markdown
### Test 1: AC10 - Server logs startup message

**What to test**: Server logs startup message with port number using logger utility

**Steps**:
1. Run `npm run dev --workspace=@bmad-app/server`
2. Observe terminal output

**Expected Result**:
✅ Terminal shows colored log messages:
- Blue colored timestamp in ISO 8601 format
- `[Server] Server started on port 3000` message
- `[Server] Health check: http://localhost:3000/api/health` message

**Evidence**:
- Terminal screenshot showing blue colored logs
- Timestamp format: `[2025-11-14T10:30:45.123Z]`

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes**: _________________
````

### 7. Write Terminal Tests

For each AC categorized as "Terminal Test":

**Guidelines**:

- Provide exact copy-paste command
- Show complete expected output
- Include validation checklist
- Note any prerequisites (server running, etc.)
- Use code blocks for commands and output
- Keep descriptions brief (command speaks for itself)

**Example**:

````markdown
### Test A: AC4 - Health check endpoint

**What to test**: Health check route returns correct JSON

**Command**:

```bash
curl -s http://localhost:3000/api/health
```
````

**Expected Output**:

```json
{ "status": "ok" }
```

**Validation**:

- ✅ Response is valid JSON
- ✅ Contains `status` field
- ✅ Value is `"ok"`
- ✅ No errors in terminal

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes**: **\*\*\*\***\_**\*\*\*\***

```

### 7. Document Not Testable Items

For ACs that cannot be tested yet:
- Clearly state which AC
- Explain why (requires future story)
- Note which story will enable testing
- Keep it brief

### 8. Add Troubleshooting Section

Based on implementation and common issues:
- Server won't start (port in use)
- Build failures (missing dependencies)
- Expected output doesn't match
- Colors not showing (terminal support)

### 9. Final Review

Ensure:
- [ ] Every AC is addressed (Human/Terminal/Not Testable)
- [ ] All commands are copy-paste ready
- [ ] All URLs are complete and correct
- [ ] Expected outputs are exact
- [ ] Steps are numbered and clear
- [ ] Evidence requirements specified
- [ ] Troubleshooting covers common issues
- [ ] Test checklist matches test count
- [ ] File saved to correct location

## Key Principles

1. **Visual-First**: If it can be observed in browser/UI, it's a Human Test
2. **Exact Details**: Real URLs (`http://localhost:3000`), not placeholders
3. **Copy-Paste Ready**: Terminal commands must work exactly as written
4. **Evidence-Based**: Every test maps to specific AC number
5. **Human-Friendly**: Write for non-developers, clear language
6. **Standalone**: SAT guide readable without story file
7. **Practical**: Focus on what can be tested NOW

## Output

**File Location**: `{devStoryLocation}/{epic}.{story}.story-SAT.md`

**Naming Example**: `1.2.story-SAT.md` (for Story 1.2)

**File Contents**: Complete SAT guide following template structure above

## Success Criteria

A good SAT guide:
- ✅ Can be followed by non-technical user
- ✅ Every test maps to acceptance criterion
- ✅ Human tests prioritized (visual/browser)
- ✅ Terminal tests clearly separated
- ✅ Exact commands/URLs (copy-paste ready)
- ✅ Expected results clearly described
- ✅ Troubleshooting section included
- ✅ Test result tracking section
- ✅ Standalone (readable without story file)

### 10. Execute Automated Tests

**Run all Terminal Tests immediately**:

For each test marked as "🤖 Terminal Tests":
1. Execute the command
2. Capture output
3. Compare with expected output
4. Update test status in the SAT file:
   - ✅ Passed if output matches
   - ❌ Failed if output differs (include actual output in Notes)
5. Update the Test Checklist section with results

**DO NOT** create a separate results file - update the SAT file directly.

### 11. Create Test Data Files

If tests require data files (e.g., JSON test files):
1. Create the necessary files
2. Document them in the Prerequisites section
3. Note cleanup instructions if needed

## Completion

After creating SAT document and running automated tests:
1. Confirm file saved to `{devStoryLocation}/{epic}.{story}.story-SAT.md`
2. Show user summary:
   - Count of Human Tests (pending user execution)
   - Count of Terminal Tests (with pass/fail results)
   - Count of Not Testable items
   - Files created for testing
3. Provide next steps:
   - If automated tests passed: "Human tests ready for manual execution"
   - If automated tests failed: "Fix issues found in automated tests first"
   - Explain that user updates the SAME SAT file after running human tests
```
