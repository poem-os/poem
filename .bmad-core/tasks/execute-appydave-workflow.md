<!-- Powered by BMAD™ Core -->

# Execute AppyDave Workflow Task

## Purpose

Orchestrate the complete end-to-end story lifecycle from creation through QA review with human-in-loop approval gates. This is AppyDave's signature workflow that provides semi-automated story management, preventing race conditions from typing ahead while maintaining necessary human oversight for critical decision points.

## SEQUENTIAL Task Execution (Do not proceed until current step is complete)

### 0. Load Core Configuration and Initialize

**Discover next story (Epic-Aware)**:

1. Load `.bmad-core/core-config.yaml` from the project root
   - If the file does not exist, HALT and inform the user: "core-config.yaml not found. This workflow requires BMAD v4 core configuration."
   - Extract key configurations:
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

6. Ask user: "Which story number do you want to work on? [Suggested: {nextStory}]"

7. **Display appropriate context**:
   - If suggesting incomplete story:
     ```
     ⚠️  Warning: Story {current} has status "{status}" (not Done).
     Would you like to:
     1. Continue with {current} (complete it)
     2. Override and start {next} anyway
     3. Specify a different story number
     ```
   - If suggesting story from epic PRD that has no file yet:

     ```
     📋 Story {nextStory} found in Epic {epic} PRD but not yet created.
     Epic {epic} Progress: {completedCount}/{totalCount} stories completed
     Next story: {nextStory} - {storyTitle}

     Suggested: {nextStory}
     ```

8. Store the story number as `{storyNum}` for use throughout workflow

---

### Step 1: Story Creation

**Agent Context**: Load Scrum Master (SM) agent context and capabilities

**Objective**: Create comprehensive story draft with all requirements and context

**Actions**:

1. Execute the `create-next-story.md` task for story `{storyNum}`
2. Verify output file exists: `{devStoryLocation}/{storyNum}.story.md`
3. Verify story status is set to: `Draft`
4. Display story file path as clickable link for user review

**Output**: Story file created with Status: Draft

**HALT POINT**:

```
✅ Story {storyNum} created successfully!
📄 File: {devStoryLocation}/{storyNum}.story.md
📊 Status: Draft

Please review the story file to ensure:
- Acceptance criteria are clear and complete
- Tasks are well-defined
- Technical context is sufficient

Type 'go' to proceed to validation, or 'skip' to go directly to development.
```

**User Response Options**:

- `go` → Proceed to Step 2 (Validation)
- `skip` → Skip to Step 3 (Mark Ready)
- `exit` → Exit workflow

---

### Step 2: Story Validation (Optional Quality Gate)

**Agent Context**: Load Product Owner (PO) agent context and capabilities

**Objective**: Validate story draft meets quality standards before development

**Actions**:

1. Execute the `validate-next-story.md` task for story `{storyNum}`
2. Run 10-step validation process:
   - Template completeness
   - File structure clarity
   - Acceptance criteria coverage
   - Anti-hallucination verification
   - Implementation readiness
3. Generate validation report with Critical/Should-Fix/Nice-to-Have issues

**Output**: Validation report with GO/NO-GO decision

**HALT POINT**:

```
✅ Validation complete for Story {storyNum}

📋 Validation Summary:
- Critical Issues: {count}
- Should-Fix Issues: {count}
- Nice-to-Have: {count}
- Final Assessment: {GO or NO-GO}
- Implementation Readiness Score: {score}/10

{If NO-GO:}
❌ Story requires fixes before proceeding.
Please address critical issues and run validation again.
Type 'exit' to fix issues.

{If GO:}
✅ Story is ready for development!
Type 'go' to proceed to status change.
```

**User Response Options**:

- If GO: `go` → Proceed to Step 3
- If NO-GO: `exit` → Fix issues, re-run workflow from Step 1

---

### Step 3: Mark Story Ready (Human Gate)

**Agent Context**: None (human action required)

**Objective**: Ensure human approval before development begins

**Actions**:

1. Inform user of required manual action
2. Provide clickable file path link
3. Wait for user confirmation

**HALT POINT**:

```
⚠️  HUMAN ACTION REQUIRED

Please manually change the story status:
📄 File: {devStoryLocation}/{storyNum}.story.md
📝 Change: Status from "Draft" to "Ready"

This manual step ensures you've reviewed and approved the story before development.

When you've updated the status, type 'go' to proceed to development.
Type 'verify' to check if status has been changed.
```

**User Response Options**:

- `verify` → Check if status is "Ready" (re-read file, confirm or prompt again)
- `go` → Proceed to Step 4 (assumes status changed)

**Verification** (if user types 'verify'):

- Read story file
- Check if Status field = "Ready"
- If YES: "✅ Status confirmed as Ready. Type 'go' to proceed."
- If NO: "❌ Status is still '{current}'. Please change to 'Ready' before continuing."

---

### Step 4: Development (Code Implementation)

**Agent Context**: Load Dev agent context and capabilities

**Objective**: Implement story requirements with code, tests, and documentation

**Pre-Check**:

1. Read story file and verify Status = "Ready"
2. If NOT ready: HALT with error "Story status is not 'Ready'. Cannot proceed to development."

**Actions**:

1. Execute implementation workflow for story `{storyNum}`
2. Follow all tasks and subtasks defined in story
3. Write code, tests, and documentation
4. Update story status to "Review" when complete
5. Add implementation notes to Dev Agent Record section

**Output**: Working code with tests, Status changed to Review

**HALT POINT**:

```
✅ Development complete for Story {storyNum}!

📊 Implementation Summary:
- Files created/modified: {count}
- Tests added: {count}
- Status: Review

📄 Story file: {devStoryLocation}/{storyNum}.story.md

Type 'go' to proceed to acceptance testing.
```

**User Response Options**:

- `go` → Proceed to Step 5 (SAT)

---

### Step 5: Acceptance Testing (SAT Agent)

**Agent Context**: Load Story Acceptance Test (SAT) agent context and capabilities

**Objective**: Create comprehensive acceptance test guide and prepare for manual testing

**Actions**:

1. Execute the `create-sat.md` task for story `{storyNum}`
2. Read story file (acceptance criteria) AND actual implementation code
3. Create test guide: `{devStoryLocation}/{storyNum}.story-SAT.md`
4. Include:
   - Human Tests (visual, browser, UI verification)
   - Terminal Tests (curl commands, scripts, CLI verification)
   - Prerequisites and setup instructions
   - Troubleshooting guide
5. Display test guide path

**Output**: SAT test guide file created

**HALT POINT**:

```
✅ Story Acceptance Test guide created!

📄 Test Guide: {devStoryLocation}/{storyNum}.story-SAT.md

⚠️  HUMAN TESTING REQUIRED

Please execute the following tests manually:
1. Review the SAT guide file
2. Run all Human Tests (visual verification)
3. Run all Terminal Tests (scripted commands)
4. Document PASS/FAIL results in the SAT file

When all tests are complete and results documented, type 'go' for QA review.
```

**User Response Options**:

- `go` → Proceed to Step 6 (QA Review)

---

### Step 6: QA Review (Final Quality Gate)

**Agent Context**: Load QA agent context and capabilities

**Objective**: Final quality assurance review including code, tests, and SAT results

**Actions**:

1. Execute the `review-story.md` task for story `{storyNum}`
2. Review:
   - Code quality and standards compliance
   - Test coverage and test quality
   - SAT test results (from Step 5)
   - All acceptance criteria met
   - Definition of Done checklist
3. Generate QA report with PASS/FAIL decision
4. **If PASS - Automatically close the story**:
   - Read story file: `{devStoryLocation}/{storyNum}.story.md`
   - Update Status field from "Review" to "Done"
   - Mark any incomplete tasks as completed (change `[ ]` to `[x]`)
   - Add completion timestamp to QA Results section
   - Save updated story file
5. If FAIL: Document issues requiring fixes

**Output**: QA review report with final decision + automated story closure (if PASS)

**HALT POINT (If PASS)**:

```
✅ QA Review PASSED for Story {storyNum}!

📋 QA Summary:
- Code Quality: ✅
- Test Coverage: ✅
- SAT Results: ✅
- Acceptance Criteria: ✅
- Overall Score: {score}/100

🎉 Story {storyNum} is now complete!

📝 Automated Story Closure:
- Status updated: Review → Done ✅
- All tasks marked complete ✅
- Completion timestamp added ✅
- Story file saved ✅

Type 'go' to proceed to knowledge curation (Step 7).
```

**User Response Options**:

- If PASS: `go` → Proceed to Step 7 (Knowledge Curation)

**HALT POINT (If FAIL)**:

```
❌ QA Review FAILED for Story {storyNum}

📋 Issues Found:
{List of issues requiring fixes}

Please address these issues. Options:
1. Return to Development (type 'dev' to go back to Step 4)
2. Exit and fix manually (type 'exit')
```

**User Response Options**:

- If FAIL: `dev` → Return to Step 4 (Development)
- If FAIL: `exit` → Exit workflow

---

### Step 7: Knowledge Curation (Librarian Agent)

**Agent Context**: Load Librarian (Lisa) agent context and capabilities

**Objective**: Extract learnings, create KDD documentation, maintain topology, and preserve knowledge from completed story

**Pre-Check**:

1. Read story file and verify Status = "Done"
2. If NOT done: HALT with error "Story status is not 'Done'. Knowledge curation should only happen after QA passes."

**Actions**:

1. Execute the `extract-knowledge-from-story.md` task for story `{storyNum}`
2. Analyze story sections:
   - Dev Agent Record (Completion Notes, Debug Log, File List)
   - QA Results (pattern violations, quality concerns)
   - SAT Results (acceptance test findings)
3. Create KDD documentation using templates:
   - Pattern documents (if reusable patterns identified)
   - Learning documents (if issues/insights discovered)
   - Decision documents/ADRs (if architectural decisions made)
   - Example documents (if working examples worth preserving)
4. Maintain topology:
   - Update index.md files
   - Validate links (VAL-001)
   - Check for duplicates (VAL-002)
5. Update story file with "Knowledge Assets" section linking to created docs
6. Run knowledge-curation-checklist to validate process
7. Display curation summary

**Output**: KDD documents created, topology maintained, story updated with knowledge asset links

**HALT POINT**:

```
✅ Knowledge curation complete for Story {storyNum}!

📚 Knowledge Assets Created:
- Patterns: {count} document(s)
- Learnings: {count} document(s)
- Decisions (ADRs): {count} document(s)
- Examples: {count} document(s)

📊 Topology Health:
- Links validated: {broken-count} broken links (VAL-001)
- Duplication rate: {percentage}% (VAL-002)
- Directory structure: {warning-count} warnings (VAL-003)

🔄 WORKFLOW: Quinn (QA) → LISA (LIBRARIAN) → [WORKFLOW END]

✅ Story workflow finished.

Would you like to:
1. Start next story workflow (type 'next')
2. Exit workflow (type 'exit')
```

**User Response Options**:

- `next` → Loop back to Step 0 for next story
- `exit` → Exit workflow

---

## Workflow State Transitions

```
Draft → Ready → In Progress → Review → Done → [KDD Curation]
  ↑       ↑          ↑           ↑        ↑         ↑
Step 1  Step 3     Step 4       Step 4   Step 6   Step 7
 (SM)   (Human)     (Dev)        (Dev)    (QA)    (Lisa)
```

## Workflow Agent Handoff Chain

```
Bob (SM) → Sarah (PO) → James (Dev) → Taylor (SAT) → Quinn (QA) → Lisa (Librarian) → [END]
  Creates     Validates    Implements    Tests         Reviews      Curates
  Story       Story        Code          Manual        Quality      Knowledge
```

## Error Handling

**If user types unexpected input**:

- Show valid options for current step
- Re-display HALT POINT message

**If file operations fail**:

- Display clear error message
- Suggest corrective action
- Allow user to retry or exit

**If agent context loading fails**:

- HALT workflow
- Inform user which agent failed to load
- Suggest checking `.bmad-core/agents/` directory

## Notes

- This workflow enforces sequential execution to prevent race conditions
- Human gates ensure critical review points are not skipped
- Each step is self-contained and can be resumed if interrupted
- Workflow state is maintained through file system (story status field)
- Compatible with BMAD v4 architecture and agent system

## Usage

**Via BMad Master Agent**:

```
BMad Master: *execute-task execute-appydave-workflow
[User prompted for story number]
[Workflow begins at Step 1]
```

**Via BMad Orchestrator**:

```
BMad Orchestrator: *execute-task execute-appydave-workflow
[User prompted for story number]
[Workflow begins at Step 1]
```

**Recommended**: Combine with Claude Code slash command (see `.claude/commands/appydave-workflow.md`) for streamlined invocation.
