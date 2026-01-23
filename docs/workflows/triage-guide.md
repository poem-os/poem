# Triage Guide

**POEM Work Intake Triage System** - Systematic evaluation and routing of development work.

**Task**: `.bmad-core/tasks/triage-work.md`

---

## Overview

Triage eliminates decision paralysis by applying clear criteria to determine whether work should be:
- Quick Fix (< 1 hour, no ceremony)
- Existing Story (story file already exists)
- Feature Epic Story (Epics 1-7)
- Epic 0 Story (maintenance work)

**5 Triage Modes**:
- **Mode A**: Conversation-based triage (default)
- **Mode B**: Usage issue triage (`/triage issue-{N}`)
- **Mode C**: Explicit description (`/triage [description]`)
- **Mode D**: Planning document triage (auto-detect)
- **Mode E**: Inbox processing (`/triage inbox`) **← Field Testing Submissions**

---

## Mode E: Inbox Processing

**Purpose**: Process field testing submissions from external POEM projects (v-voz, prompt-supportsignal, v-appydave).

**When to Use**: After external projects log blockers using Field Testing Agent (`/poem/agents/field-tester`).

### Command

```bash
/triage inbox
```

### Workflow

#### Step 1: List Pending Submissions

Triage scans `docs/planning/gap-analysis/inbox/` for `*.json` files with `status: "pending"`.

**If inbox empty**:
```
✅ Inbox empty - no pending submissions
```

**If pending submissions found**:
```
📬 Field Testing Inbox - 2 pending submission(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────┬─────────────┬──────────────────────────┬──────────┬────────┐
│ #  │ Submission  │ Description              │ Project  │ Date   │
├────┼─────────────┼──────────────────────────┼──────────┼────────┤
│ 1  │ v-voz-001   │ Multi-workflow switchi...│ v-voz    │ Jan 22 │
│ 2  │ prompt-ss...│ Schema validation fail...│ prompt-..│ Jan 23 │
└────┴─────────────┴──────────────────────────┴──────────┴────────┘

Type a number to process, 'all' for batch, or 'exit': _
```

**Options**:
- `1`, `2`, etc. - Process specific submission
- `all` - Process all submissions in batch
- `exit` - Exit triage

#### Step 2: Process Submission

For each selected submission, Triage:

1. **Loads submission JSON** from inbox
2. **Displays submission details**:
   - Description, context, severity
   - Project name, location, POEM version
   - Workflow name, project-specific details
3. **Searches existing POEM issues** for similarity
4. **Presents options** based on search results

#### Step 3a: Link to Existing Issue

**If similar issue found (>80% match)**:

```
🔗 Similar issue found!

Issue #42: Multi-workflow state management broken
Severity: high | Category: bug
Epic: Epic 3 | Story: 3.4
Reported by: v-voz (1 project)

Link this submission to Issue #42? [y/n]: _
```

**If you type `y`**:

1. **Updates POEM issue** (`docs/planning/gap-analysis/usage-issues.jsonl`):
   - Upgrades schema to v2.1 (if needed)
   - Appends to `reportedBy` array:
     ```json
     "reportedBy": [
       {
         "submissionId": "v-voz-001",
         "project": "v-voz",
         "timestamp": "2026-01-22T10:00:00Z",
         "projectSpecificDetails": {
           "workflowName": "storyline",
           "dataLost": "3 character descriptions"
         }
       }
     ]
     ```
2. **Updates submission file**:
   - Status: `"pending"` → `"linked"`
   - `poemIssueRef`: `"issue-42"`
3. **Displays confirmation**:
   ```
   ✅ Linked v-voz-001 to Issue #42

   Updated:
   - POEM issue reportedBy array (now 2 project(s))
   - Submission status: pending → linked
   ```

**If you type `n`**: Continues to Step 3b (create new issue).

#### Step 3b: Create New Issue

**If no similar issue found (<80% match)**:

```
🆕 No similar issue found

Create new POEM issue for this submission? [y/n]: _
```

**If you type `y`**:

1. **Creates new POEM issue** in `docs/planning/gap-analysis/usage-issues.jsonl`:
   ```json
   {
     "timestamp": "2026-01-22T10:00:00Z",
     "session": "field-testing-v-voz",
     "category": "bug",
     "severity": "high",
     "observation": "Multi-workflow switching loses state",
     "context": "Working on storyline workflow, switched to nano-banana",
     "expected": "System should maintain state across workflow switches",
     "actual": "State lost when switching workflows",
     "impact": "Data loss risk, poor user experience",
     "tags": ["v-voz", "storyline", "field-testing", "workflow"],
     "schemaVersion": "2.1",
     "estimatedTime": "1-4hr",
     "thematicArea": "workflows",
     "type": "bug",
     "suggestedPath": "Epic 3 Story",
     "reportedBy": [
       {
         "submissionId": "v-voz-001",
         "project": "v-voz",
         "timestamp": "2026-01-22T10:00:00Z",
         "projectSpecificDetails": {
           "workflowName": "storyline",
           "dataLost": "3 character descriptions"
         }
       }
     ]
   }
   ```

2. **Updates submission file** (same as Step 3a #2, but with new issue number)

3. **Displays confirmation**:
   ```
   ✅ Created Issue #67 for v-voz-001

   New issue:
   - Observation: Multi-workflow switching loses state
   - Category: bug | Severity: high
   - Suggested Path: Epic 3 Story
   - Submission linked and marked as "linked"
   ```

**If you type `n`**: Skips submission (status remains "pending").

#### Step 4: Summary

After processing all selected submissions:

```
✅ Inbox processing complete

Processed: 2 submissions
- Linked to existing issues: 1
- Created new issues: 1
- Skipped: 0
```

---

## Examples

### Example 1: Linking Submission to Existing Issue

**Scenario**: v-voz reports "Multi-workflow switching loses state". POEM already has Issue #42 about workflow state management.

**Command**:
```bash
/triage inbox
```

**Output**:
```
📬 Field Testing Inbox - 1 pending submission(s)

┌────┬───────────┬──────────────────────────┬─────────┬────────┐
│ #  │ Submis.   │ Description              │ Project │ Date   │
├────┼───────────┼──────────────────────────┼─────────┼────────┤
│ 1  │ v-voz-001 │ Multi-workflow switchi...│ v-voz   │ Jan 22 │
└────┴───────────┴──────────────────────────┴─────────┴────────┘

Type a number: 1

────────────────────────────────────────────────────
Submission: v-voz-001
Project: v-voz (/Users/davidcruwys/dev/video-projects/v-voz)
POEM Version: 0.1.0
Timestamp: 2026-01-22T10:00:00Z

Blocker:
- Description: Multi-workflow switching loses state
- Context: Working on storyline workflow, switched to nano-banana, lost draft data
- Severity: high
- Workflow: storyline
- Project Details:
  - dataLost: 3 character descriptions
  - schemaFiles: poem/workflows/storyline/schemas/character.schema.json
────────────────────────────────────────────────────

🔗 Similar issue found!

Issue #42: Multi-workflow state management broken
Severity: high | Category: bug
Epic: Epic 3 | Story: 3.4
Reported by: (no previous field testing reports)

Similarity: 87% (description match)

Link this submission to Issue #42? [y/n]: y

✅ Linked v-voz-001 to Issue #42

Updated:
- POEM issue reportedBy array (now 1 project)
- Submission status: pending → linked
- Issue now tracked by: v-voz
```

### Example 2: Creating New Issue from Submission

**Scenario**: prompt-supportsignal reports "Schema validation fails silently". No similar issue exists.

**Command**:
```bash
/triage inbox
```

**Output**:
```
📬 Field Testing Inbox - 1 pending submission(s)

[...submission list...]

Type a number: 1

────────────────────────────────────────────────────
Submission: prompt-ss-001
Project: prompt-supportsignal (/Users/davidcruwys/dev/clients/prompt-supportsignal)
POEM Version: 0.1.0
Timestamp: 2026-01-23T14:00:00Z

Blocker:
- Description: Schema validation fails silently
- Context: Prompt template had invalid placeholders, no error shown
- Severity: medium
- Workflow: narrative-enhancement
- Project Details:
  - affectedPrompts: 5
  - schemaPath: poem/schemas/narrative-enhancement.json
────────────────────────────────────────────────────

Searching existing issues...

🆕 No similar issue found (highest match: 34%)

Create new POEM issue for this submission? [y/n]: y

✅ Created Issue #68 for prompt-ss-001

New issue:
- Observation: Schema validation fails silently
- Category: bug | Severity: medium
- Thematic Area: prompts
- Estimated Time: <1hr
- Suggested Path: Quick Fix
- Submission linked and marked as "linked"

Issue #68 ready for triage (use /triage issue-68 to route)
```

### Example 3: Multi-Project Issue Enhancement

**Scenario**: Both v-voz and v-appydave report the same issue. First creates issue, second enhances it.

**First submission (v-voz-001)**:
- Creates Issue #42
- `reportedBy`: `[{submissionId: "v-voz-001", project: "v-voz", ...}]`

**Second submission (v-appydave-002)**:
- Links to Issue #42 (87% similarity)
- Appends to `reportedBy`: `[{...v-voz...}, {submissionId: "v-appydave-002", project: "v-appydave", ...}]`

**Result**: Issue #42 now shows multi-project context, helping prioritize fixes.

---

## Similarity Matching

Triage uses fuzzy text matching to find similar issues:

**Matching criteria** (>80% threshold):
1. **Description similarity**: Compare `blocker.description` with `observation`
2. **Keyword overlap**: Match tags, workflow names, thematic areas
3. **Severity alignment**: Same or adjacent severity levels

**Example matches**:
- "Multi-workflow switching loses state" (submission)
- "Multi-workflow state management broken" (issue)
- **Similarity**: 87% (high keyword overlap, same severity)

**Example non-matches**:
- "Schema validation fails silently" (submission)
- "Multi-workflow state management broken" (issue)
- **Similarity**: 34% (different keywords, different area)

---

## Related Documentation

- **Field Testing Guide**: `docs/planning/gap-analysis/field-testing-guide.md`
- **Field Testing Agent**: `packages/poem-core/agents/field-tester.md`
- **Inbox Bridge Skill**: `packages/poem-core/skills/poem-inbox-bridge/SKILL.md`
- **Triage Task**: `.bmad-core/tasks/triage-work.md`
- **Story 0.4**: `docs/stories/0.4.story.md`

---

**Last Updated**: 2026-01-23
