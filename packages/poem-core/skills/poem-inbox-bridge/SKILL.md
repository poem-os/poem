---
name: poem-inbox-bridge
description: "Submit field testing observations from external POEM installations to central POEM inbox. Use when working in external projects (v-voz, prompt-supportsignal, v-appydave) and need to log blockers, issues, or observations that should be tracked in central POEM issue registry. Triggers: 'log this to POEM', 'submit to inbox', 'report issue to central POEM', 'blocker submission'."
---

# POEM Inbox Bridge Skill

Submit field testing observations from external POEM projects to central POEM for issue tracking and multi-project correlation.

## Purpose

This skill enables external POEM installations (client projects) to submit blockers and observations to a central POEM inbox, where they can be processed by the Triage agent to:
- Link related issues across multiple projects
- Enhance existing POEM issues with multi-project context
- Create new issues when unique problems are discovered

## When to Use

Use this skill when:
- Working in external POEM projects (v-voz, prompt-supportsignal, v-appydave)
- Field Testing Agent (`/poem/agents/field-tester`) logs a blocker
- Need to submit observations to central POEM issue tracking system
- Want to contribute field testing discoveries to POEM development

**Typical invocation**: Field Testing Agent calls this skill after creating a local blocker file.

## How It Works

**Client-Server Architecture**:
1. **Client side** (external project): Field Testing Agent creates local blocker file
2. **Transport** (this skill): Writes submission to central POEM inbox
3. **Server side** (central POEM): Triage agent processes submissions

**Direct file write**: This skill writes directly to the POEM inbox path. No sync command needed.

## Submission Process

### Input Data

Expects a **Client Blocker** object with:

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
      "dataLost": "3 character descriptions"
    }
  },
  "status": "pending",
  "poemIssueRef": null,
  "submittedTo": null
}
```

### Submission Steps

1. **Validate input**:
   - Required fields: `submissionId`, `timestamp`, `project`, `blocker`, `status`
   - Submission ID format: `{project}-{sequence}` (e.g., `v-voz-001`)
   - Timestamp: ISO 8601 format

2. **Write to POEM inbox**:
   - **Target path** (hardcoded MVP): `/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/gap-analysis/inbox/{submissionId}.json`
   - **Format**: Pretty-printed JSON (indent 2 spaces)
   - **Overwrite behavior**: Error if file already exists (duplicate submission ID)

3. **Update submission object**:
   - Set `submittedTo` field to inbox file path
   - Return updated object to caller

4. **Confirm submission**:
   - Display success message with inbox path
   - Remind user to run `/triage inbox` in POEM

### Example Submission

Given blocker data from Field Testing Agent:

**Input**:
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
    "context": "Working on storyline workflow, switched to nano-banana",
    "severity": "high",
    "workflowName": "storyline",
    "projectSpecificDetails": {
      "dataLost": "3 character descriptions"
    }
  },
  "status": "pending",
  "poemIssueRef": null,
  "submittedTo": null
}
```

**Action**: Write to `/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/gap-analysis/inbox/v-voz-001.json`

**Output**:
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
    "context": "Working on storyline workflow, switched to nano-banana",
    "severity": "high",
    "workflowName": "storyline",
    "projectSpecificDetails": {
      "dataLost": "3 character descriptions"
    }
  },
  "status": "pending",
  "poemIssueRef": null,
  "submittedTo": "/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/gap-analysis/inbox/v-voz-001.json"
}
```

## Error Handling

**Directory doesn't exist**:
- Create inbox directory if missing
- Notify user: "Created POEM inbox directory"

**Duplicate submission ID**:
- Error: "Submission v-voz-001 already exists in inbox"
- Suggest incrementing sequence number

**Write permission error**:
- Error: "Cannot write to POEM inbox (permission denied)"
- Troubleshooting: Check POEM path exists and is writable

**Invalid submission data**:
- Error: "Missing required field: {fieldName}"
- Validate before write attempt

## Processing in POEM

After submission:

1. User navigates to central POEM repository
2. Runs `/triage inbox` command
3. Triage agent:
   - Scans inbox for `status: "pending"` submissions
   - Lists submissions with numbers
   - Prompts user to select which to process
4. For each submission:
   - Search existing POEM issues for similarity
   - If match found (>80%): Link to existing issue, enhance with new project context
   - If no match: Create new POEM issue
5. Update submission:
   - Change status: `"pending"` → `"linked"`
   - Add `poemIssueRef: "issue-{N}"`
   - Write back to inbox file

## Schema Reference

### Client Blocker Schema (v1.0)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `submissionId` | string | Yes | Format: `{project}-{sequence}` |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `project` | object | Yes | Project metadata |
| `project.name` | string | Yes | Project name (v-voz, prompt-ss, v-appydave) |
| `project.location` | string | Yes | Absolute path to project |
| `project.poemVersion` | string | Yes | POEM version in use |
| `blocker` | object | Yes | Blocker details |
| `blocker.description` | string | Yes | One-line summary |
| `blocker.context` | string | Yes | What happened |
| `blocker.severity` | string | Yes | critical/high/medium/low |
| `blocker.workflowName` | string | No | Affected workflow |
| `blocker.projectSpecificDetails` | object | No | Flexible context object |
| `status` | string | Yes | pending/submitted/linked/resolved |
| `poemIssueRef` | string/null | No | POEM issue ID (null until linked) |
| `submittedTo` | string/null | No | Inbox file path (set by this skill) |

## Configuration

**Hardcoded paths (MVP)**:
- Central POEM inbox: `/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/gap-analysis/inbox/`

**Future enhancement**: Make path configurable via environment variable or config file.

## Integration Notes

**Bundled with POEM**: This skill is located in `packages/poem-core/skills/` so it's automatically included when POEM is installed in external projects.

**No authentication**: Direct file write (acceptable for MVP single-developer use case).

**Transient inbox**: Submission files are processed then archived/deleted. Inbox is gitignored.

---

**Related**:
- Field Testing Agent: `packages/poem-core/agents/field-tester.md`
- Triage Mode E: `.bmad-core/tasks/triage-work.md`
- Story 0.4: Field Testing System with External POEM Project Integration
