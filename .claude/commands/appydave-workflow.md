---
description: Execute AppyDave's full BMAD v4 story workflow with human-in-loop gates
---

# AppyDave Workflow Command

You are FOLLOWING AppyDave's complete BMAD v4 story lifecycle workflow. The USER orchestrates; you execute step-by-step with explicit human approval gates.

## Agent Handoff Chain

```
Bob (SM) → Sarah (PO) → James (Dev) → Taylor (SAT) → Quinn (QA)
  Creates     Validates    Implements    Tests         Reviews
  Story       Story        Code          Manual        Quality
```

This workflow guides a story from creation through QA review with human approval gates at critical decision points.

## CRITICAL INSTRUCTIONS

**SEQUENTIAL EXECUTION ONLY**:

- Execute steps ONE AT A TIME
- ALWAYS HALT and wait for user confirmation before proceeding to next step
- Do NOT load multiple agents simultaneously
- Do NOT skip ahead to later steps
- User must explicitly type 'go', 'skip', or other specified commands to proceed

**HUMAN-IN-LOOP GATES**:

- Story validation (optional)
- Status change from Draft → Ready (required)
- Manual acceptance testing (required)
- QA review decision (required)

---

## Workflow Steps

### Step 0: Initialize

**Discover next story**:

1. Load `.bmad-core/core-config.yaml` and extract:
   - `devStoryLocation` (where story files are stored)
   - `prdShardedLocation` (where epic PRD files are stored)
   - `epicFilePattern` (pattern for epic files, e.g., "epic-{n}\*.md")

2. List all story files in `{devStoryLocation}` matching pattern `{epic}.{story}.story.md`

3. Find the highest story file (e.g., `2.6.story.md`):
   - Parse epic number from filename (e.g., 2.6 → Epic 2)
   - Read that file and check its Status field

4. **Read the Epic PRD file** to find all defined stories:
   - Build epic filename using pattern: `{prdShardedLocation}/epic-{epic-number}*.md`
   - Read the epic file
   - Extract all story headings matching pattern: `## Story {epic}.{story}:`
   - Find highest story number defined in epic (e.g., Epic 2 has stories 2.1 through 2.7)

5. **Compare filesystem to PRD** and determine suggestion:
   - If highest file Status = "Done" AND epic has more stories defined:
     - Suggest next story in same epic (e.g., if 2.6 Done and epic has 2.7, suggest 2.7)
   - If highest file Status = "Done" AND epic has NO more stories:
     - Suggest first story of next epic (e.g., if Epic 2 complete, suggest 3.1)
   - If highest file Status ≠ "Done":
     - Warn about incomplete story, suggest completing it first
   - If no story files exist:
     - Suggest 1.1 (first story)

**Ask user**: "Which story number do you want to work on? [Suggested: {nextStory}]"

**If suggesting incomplete story**:

```
⚠️  Warning: Story {current} has status "{status}" (not Done).
Would you like to:
1. Continue with {current} (complete it)
2. Override and start {next} anyway
3. Specify a different story number
```

**If suggesting story from epic PRD that has no file yet**:

```
📋 Story {nextStory} found in Epic {epic} PRD but not yet created.
Epic {epic} Progress: {completedCount}/{totalCount} stories completed
Next story: {nextStory} - {storyTitle}

Suggested: {nextStory}
```

Store the story number for use throughout the workflow.

---

### Step 1: Story Creation

**Agent**: Load Scrum Master (SM) agent

**Action**: Run `*draft-story` command for the specified story number

**After story is created**:

- Display story file path (make it clickable)
- Show current status (should be "Draft")

**STOP and display**:

```
✅ Story {number} created successfully!
📄 File: docs/stories/{number}.story.md
📊 Status: Draft

Please review the story file to ensure acceptance criteria and tasks are clear.

Options:
- Type 'go' to proceed to validation
- Type 'skip' to skip validation and go to status change
- Type 'exit' to stop workflow
```

**Wait for user input**: `go`, `skip`, or `exit`

---

### Step 2: Story Validation (Optional)

**Only execute if user typed 'go' in Step 1**

**Agent**: Load Product Owner (PO) agent

**Action**: Run `*validate-story-draft {story-number}` command

**After validation completes**:

- Display validation summary (Critical/Should-Fix/Nice-to-Have issues)
- Show GO/NO-GO decision

**STOP and display (if GO)**:

```
✅ Validation complete for Story {number}

Final Assessment: GO ✅
Implementation Readiness Score: {score}/10

Story is ready for development!

Type 'go' to proceed to status change gate.
```

**STOP and display (if NO-GO)**:

```
❌ Validation complete for Story {number}

Final Assessment: NO-GO ❌

Critical Issues Found:
{list issues}

Please fix these issues before proceeding.
Type 'exit' to stop workflow and address issues.
```

**Wait for user input**: `go` or `exit`

---

### Step 3: Status Change Gate (REQUIRED HUMAN ACTION)

**No agent needed** - This is a manual human step

**STOP and display**:

```
⚠️  HUMAN ACTION REQUIRED

Please manually change the story status:
📄 File: docs/stories/{number}.story.md
📝 Action: Change Status from "Draft" to "Ready"

This manual step ensures you've reviewed and approved the story.

Options:
- Type 'verify' to check if status has been changed
- Type 'go' to proceed (assumes you've changed it)
```

**If user types 'verify'**:

- Read the story file
- Check the Status field
- If "Ready": Display "✅ Status confirmed as Ready. Type 'go' to proceed."
- If not "Ready": Display "❌ Status is still '{current}'. Please change to 'Ready' first."

**Wait for user input**: `verify` or `go`

---

### Step 4: Development

**Agent Handoff**: Sarah (PO) → **James (Dev)** → Taylor (SAT)

**Load Agent**: `/BMad/agents/dev` with argument `*develop-story {story-number}`

**Pre-check**: Verify story status is "Ready" (read file and check)
- If not Ready: HALT with error "Story status is not 'Ready'. Cannot proceed."

**What James Does**:
1. Implements all story tasks sequentially
2. Writes comprehensive tests
3. Runs Definition of Done checklist
4. Updates story status to "Review"
5. **Hands off to Taylor (SAT)** - displays exact message:
   ```
   ✅ Development complete for Story {number}!
   Ready for Taylor (SAT agent) to create acceptance tests.
   Type 'go' to proceed.
   ```

**James is RESTRICTED from**:
- Mentioning Quinn or QA
- Suggesting any agent beyond Taylor
- Jumping ahead in the workflow

**STOP and wait for user input**: `go`

---

### Step 5: Acceptance Testing (SAT)

**Agent Handoff**: James (Dev) → **Taylor (SAT)** → Quinn (QA)

**Load Agent**: `/BMad/agents/sat` with argument `*create-sat {story-number}`

**What Taylor Does**:
1. Creates human-friendly acceptance test guide
2. Separates Human Tests (browser/visual) from Terminal Tests (commands)
3. Maps every test to an acceptance criterion
4. **Hands off to Quinn (QA)** - displays exact message:
   ```
   ✅ SAT guide complete for Story {number}!
   Ready for Quinn (QA agent) for final review.
   Type 'go' to proceed.
   ```

**Taylor is RESTRICTED from**:
- Mentioning development or implementation (that's done)
- Suggesting any agent beyond Quinn
- Jumping ahead in the workflow

**SAT Output**:
- File created: `docs/stories/{number}.story-SAT.md`

**⚠️  HUMAN TESTING REQUIRED**:
User must manually execute tests:
1. Open the SAT guide file
2. Run all Human Tests (visual verification in browser)
3. Run all Terminal Tests (curl commands, scripts)
4. Document PASS/FAIL results in the SAT file

**STOP and wait for user input**: `go` (after human testing complete)

---

### Step 6: QA Review (Final Gate)

**Agent Handoff**: Taylor (SAT) → **Quinn (QA)** → [WORKFLOW END]

**Load Agent**: `/BMad/agents/qa` with argument `*review {story-number}`

**What Quinn Does**:
1. Reads and follows `.bmad-core/tasks/review-story.md` task
2. Reviews the story file (`docs/stories/{story-number}.story.md`)
3. Updates ONLY the "QA Results" section in the story file
4. Creates a gate file at `docs/qa/gates/{epic}.{story}-{slug}.yml`
5. Gate file contains PASS/CONCERNS/FAIL/WAIVED decision with score
6. **Workflow ends** - displays exact message:
   ```
   ✅ QA review complete for Story {number}.
   Story workflow finished.
   ```

**Quinn is RESTRICTED from**:
- Mentioning next agents or next steps
- **Quinn is the FINAL agent** - no handoff beyond this point

**Quinn MUST NOT**:
- Create a separate QA markdown document
- Modify any story sections other than "QA Results"
- Simulate with general-purpose agent

**After QA review completes**:

- Read the gate file to get the decision and score
- Read the story file QA Results section for summary
- Display decision to user

**If PASS - Automatically close the story**:

1. Update story file (`docs/stories/{number}.story.md`):
   - Change Status from "Review" to "Done"
   - Mark any incomplete tasks as completed (change `[ ]` to `[x]`)
   - Add completion timestamp to QA Results section
2. Display completion summary

**STOP and display (if PASS)**:

```
✅ QA Review PASSED for Story {number}!

📋 QA Summary:
- Code Quality: ✅
- Test Coverage: ✅
- SAT Results: ✅
- Overall Score: {score}/100

🎉 Story {number} is now complete!

📝 Automated Story Closure:
- Status updated: Review → Done ✅
- All tasks marked complete ✅
- Completion timestamp added ✅

Options:
- Type 'next' to start workflow for next story
- Type 'exit' to end workflow
```

**STOP and display (if FAIL)**:

```
❌ QA Review FAILED for Story {number}

Issues found:
{list of issues}

Options:
- Type 'dev' to return to development (Step 4)
- Type 'exit' to stop and fix issues manually
```

**Wait for user input**: `next`, `exit`, or `dev`

---

## Error Handling

**If user types unexpected input**:

- Display: "Invalid input. Please choose from: {list valid options for current step}"
- Re-display the current HALT point message

**If file not found**:

- Display clear error with expected file path
- Suggest corrective action
- Offer to retry or exit

**If agent fails to load**:

- Display: "Failed to load {agent-name} agent. Please check .bmad-core/agents/ directory."
- Halt workflow

---

## State Transitions

```
Draft → Ready → In Progress → Review → Done
  ↑       ↑          ↑           ↑        ↑
Step 1  Step 3     Step 4       Step 4   Step 6
 (SM)   (Human)     (Dev)        (Dev)    (QA)
```

---

## Example Usage

```bash
# In your terminal
cd /path/to/project
claude

# Run AppyDave's workflow command
> /appydave-workflow

# Claude asks: "Which story number?"
> 2.3

# Workflow begins at Step 1
# Follow prompts, type 'go' at each gate
```

---

## Notes

- This workflow prevents race conditions by enforcing sequential execution
- Each HALT point requires explicit user confirmation
- Human gates ensure critical review happens at right moments
- Workflow state persists in file system (story status field)
- Compatible with BMAD v4 agent architecture

---

**Created**: 2025-11-16
**BMAD Version**: v4
**Workflow Type**: Semi-automated with human gates
