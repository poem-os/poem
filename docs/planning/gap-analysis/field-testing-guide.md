# Field Testing Guide

**POEM Field Testing System** - Client-server architecture for tracking usage issues across multiple external POEM installations.

**Story**: 0.4 - Field Testing System with External POEM Project Integration

---

## Overview

### Problem

POEM is being used in 3 external projects (v-voz, prompt-supportsignal, v-appydave), each discovering issues during real-world usage. There was no structured way to:
1. Capture blockers/observations from external project contexts
2. Submit discoveries to central POEM's issue tracking system
3. Link related issues across multiple projects
4. Enhance POEM issues with multi-project perspectives

### Solution

**Client-Server Architecture**:

```
External Project (v-voz)          Central POEM Repository
┌─────────────────────┐           ┌─────────────────────┐
│ Field Testing Agent │ ─submit─> │ Inbox Directory     │
│ ├─ *log-blocker     │           │ ├─ v-voz-001.json   │
│ ├─ *log-session     │           │ ├─ prompt-ss-001... │
│ └─ *log-status      │           │ └─ v-appydave-...   │
│                     │           │                     │
│ Local Storage:      │           │ Triage Agent        │
│ docs/field-testing/ │           │ `/triage inbox`     │
│ ├─ blockers/        │           │ ├─ Link to issues   │
│ └─ sessions/        │           │ └─ Create new       │
└─────────────────────┘           └─────────────────────┘
```

**Components**:
1. **Field Testing Agent** (client) - Logs blockers in external projects
2. **Inbox Bridge Skill** (transport) - Submits to central POEM inbox
3. **Triage Agent Mode E** (server) - Processes inbox submissions

---

## Usage Instructions

### For External Project Developers

When working in external POEM projects (v-voz, prompt-supportsignal, v-appydave) and encountering issues:

#### 1. Activate Field Testing Agent

```bash
/poem/agents/field-tester
```

Agent greeting:
```
🔬 Felix - Field Testing Observer

Commands:
  *log-blocker - Log a blocker with project context
  *log-session - Create quick session notes
  *log-status  - Display blocker status
  *exit        - Exit agent
```

#### 2. Log a Blocker

```
*log-blocker
```

**Interactive prompts**:
1. **Description**: One-line summary (e.g., "Multi-workflow switching loses state")
2. **Context**: What were you doing? (e.g., "Working on storyline workflow, switched to nano-banana, lost draft data")
3. **Severity**: critical/high/medium/low
4. **Workflow name**: Which workflow was affected? (e.g., "storyline")
5. **Project-specific details**: Affected files, data lost, etc.

**Example interaction**:
```
Felix: Let's log this blocker. What's the issue?
User: Multi-workflow switching loses state

Felix: Can you describe what you were doing when it happened?
User: Working on storyline workflow, switched to nano-banana, lost draft data

Felix: How severe is this? (critical/high/medium/low)
User: high

Felix: Which workflow was affected?
User: storyline

Felix: Any other project-specific details? (files, data lost, etc.)
User: Lost 3 character descriptions, schema file: poem/workflows/storyline/schemas/character.schema.json

✅ Blocker logged!
  - Submission ID: v-voz-001
  - Local file: docs/field-testing/blockers/001.json
  - Status: submitted
  - POEM inbox: /Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/gap-analysis/inbox/v-voz-001.json

Next steps:
  1. Run `/triage inbox` in POEM to process this submission
```

**What happens**:
- Local blocker file created: `docs/field-testing/blockers/001.json`
- Submission sent to POEM inbox: `/Users/.../poem/docs/planning/gap-analysis/inbox/v-voz-001.json`
- Status: `"pending"` → `"submitted"`

#### 3. Check Blocker Status

```
*log-status
```

**Output**:
```
## Field Testing Blockers - v-voz

| ID        | Description                      | Severity | Status    | POEM Issue | Date    |
|-----------|----------------------------------|----------|-----------|------------|---------|
| v-voz-001 | Multi-workflow switching loses...| high     | linked    | issue-42   | Jan 22  |
| v-voz-002 | Schema validation fails silently | medium   | submitted | -          | Jan 23  |

Summary:
- Total blockers: 2
- Pending: 0
- Submitted: 1
- Linked: 1
- Resolved: 0
```

#### 4. Session Notes (Optional)

For quick observations that don't need formal blocker submission:

```
*log-session
```

Creates markdown file: `docs/field-testing/sessions/2026-01-22-10-30.md`

---

### For POEM Developers

Processing field testing submissions in central POEM repository:

#### 1. Run Triage Inbox Mode

```bash
/triage inbox
```

**If inbox has pending submissions**:
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

#### 2. Process Submission

**Select submission number (e.g., `1`)**

Triage displays submission details and searches for similar issues:

**If similar issue found (>80% match)**:
```
🔗 Similar issue found!

Issue #42: Multi-workflow state management broken
Severity: high | Category: bug
Epic: Epic 3 | Story: 3.4

Link this submission to Issue #42? [y/n]: _
```

- Type `y`: Links submission to Issue #42, adds to `reportedBy` array, updates submission status to `"linked"`
- Type `n`: Continues to create new issue option

**If no similar issue found (<80% match)**:
```
🆕 No similar issue found

Create new POEM issue for this submission? [y/n]: _
```

- Type `y`: Creates new POEM issue, links submission, updates status
- Type `n`: Skips submission (keeps status "pending")

#### 3. Review Results

After processing all selected submissions:
```
✅ Inbox processing complete

Processed: 2 submissions
- Linked to existing issues: 1
- Created new issues: 1
- Skipped: 0
```

---

## Schema Documentation

### Client Blocker Schema (v1.0)

Stored in external projects: `docs/field-testing/blockers/{sequence}.json`

```json
{
  "submissionId": "v-voz-001",
  "timestamp": "2026-01-22T10:00:00Z",
  "project": {
    "name": "v-voz",
    "location": "/Users/davidcruwys/dev/video-projects/v-voz",
    "poemVersion": "0.1.0"
  },
  "blocker": {
    "description": "Multi-workflow switching loses state",
    "context": "Working on storyline workflow, switched to nano-banana, lost draft data",
    "severity": "high",
    "workflowName": "storyline",
    "projectSpecificDetails": {
      "schemaFiles": ["poem/workflows/storyline/schemas/character.schema.json"],
      "promptFiles": ["poem/workflows/storyline/prompts/generate-character.hbs"],
      "dataLost": "3 character descriptions"
    }
  },
  "status": "pending",
  "poemIssueRef": null,
  "submittedTo": "/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/gap-analysis/inbox/v-voz-001.json"
}
```

**Field Descriptions**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `submissionId` | string | Yes | Format: `{project}-{sequence}` (e.g., `v-voz-001`) |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `project.name` | string | Yes | Project name (v-voz, prompt-supportsignal, v-appydave) |
| `project.location` | string | Yes | Absolute path to project |
| `project.poemVersion` | string | Yes | POEM version in use |
| `blocker.description` | string | Yes | One-line summary |
| `blocker.context` | string | Yes | What happened |
| `blocker.severity` | string | Yes | critical/high/medium/low |
| `blocker.workflowName` | string | No | Affected workflow |
| `blocker.projectSpecificDetails` | object | No | Flexible context object |
| `status` | string | Yes | pending/submitted/linked/resolved |
| `poemIssueRef` | string/null | No | POEM issue ID (null until linked) |
| `submittedTo` | string/null | No | Inbox file path (set by Inbox Bridge Skill) |

**Status Lifecycle**:
1. `pending` - Local blocker file created, not yet submitted
2. `submitted` - Submitted to POEM inbox, awaiting processing
3. `linked` - Processed by Triage, linked to POEM issue
4. `resolved` - POEM issue closed (manual update)

### Enhanced POEM Issue Schema (v2.1)

Stored in central POEM: `docs/planning/gap-analysis/usage-issues.jsonl`

```json
{
  "timestamp": "2026-01-22T10:00:00Z",
  "session": "field-testing-v-voz",
  "category": "bug",
  "severity": "high",
  "observation": "Multi-workflow switching loses state",
  "context": "Working on storyline workflow, switched to nano-banana, lost draft data",
  "expected": "System should maintain state across workflow switches",
  "actual": "State lost when switching workflows",
  "impact": "Data loss risk, poor user experience",
  "tags": ["v-voz", "storyline", "field-testing", "workflow", "state-management"],
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
    },
    {
      "submissionId": "prompt-ss-005",
      "project": "prompt-supportsignal",
      "timestamp": "2026-01-23T14:00:00Z",
      "projectSpecificDetails": {
        "workflowName": "narrative-enhancement",
        "affectedPrompts": 5
      }
    }
  ]
}
```

**New in v2.1**: `reportedBy` array tracks which external projects reported the same issue.

---

## Troubleshooting

### Submission Failed

**Error**: "Cannot write to POEM inbox (permission denied)"

**Solution**:
1. Check POEM path exists: `/Users/davidcruwys/dev/ad/poem-os/poem/`
2. Verify inbox directory exists: `docs/planning/gap-analysis/inbox/`
3. Check write permissions on inbox directory

### Duplicate Submission ID

**Error**: "Submission v-voz-001 already exists in inbox"

**Solution**:
- Submission ID already used (inbox not processed yet)
- Wait for POEM to process inbox, or increment sequence number manually

### No Similar Issues Found

If Triage doesn't find similar issues but you know one exists:

1. Check similarity threshold (>80% match required)
2. Description keywords may differ - review existing issues manually
3. Create new issue and manually merge later if needed

### Status Not Updating

If blocker status shows "submitted" but should be "linked":

1. Check if POEM Triage processed the submission (`/triage inbox`)
2. Verify submission file in inbox has `poemIssueRef` field populated
3. Manually update local blocker file if needed

---

## Directory Structures

### External Project (v-voz, prompt-ss, v-appydave)

```
docs/field-testing/
├── blockers/           # JSONL blocker logs
│   ├── 001.json        # First blocker
│   ├── 002.json        # Second blocker
│   └── ...
└── sessions/           # Markdown session notes
    ├── 2026-01-22-10-30.md
    └── 2026-01-23-14-00.md
```

**Created automatically** by Field Testing Agent on first use.

### Central POEM Repository

```
docs/planning/gap-analysis/
├── usage-issues.jsonl      # POEM issues (v2.1 with reportedBy)
├── usage-issues.schema.json
└── inbox/                  # Transient submissions (gitignored)
    ├── v-voz-001.json
    ├── prompt-ss-001.json
    └── v-appydave-001.json
```

**Inbox is transient**: Submissions processed then archived/deleted. Gitignored.

---

## Related Documentation

- **Field Testing Agent**: `packages/poem-core/agents/field-tester.md`
- **Inbox Bridge Skill**: `packages/poem-core/skills/poem-inbox-bridge/SKILL.md`
- **Triage Guide**: `docs/workflows/triage-guide.md` (Mode E: Inbox Processing)
- **Story 0.4**: `docs/stories/0.4.story.md`

---

**Last Updated**: 2026-01-23
