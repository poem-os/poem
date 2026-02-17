# Triage Work Task

## Purpose

This task provides a unified work intake triage system that analyzes development work and routes it to the appropriate workflow. It eliminates decision paralysis by applying clear criteria to determine whether work should be a story, quick fix, or routed to an existing workflow.

**Problem Solved**: Developers face 5+ entry points for work (existing stories, new stories in epics, quick fixes, Epic 0 stories, usage issues) with no clear decision framework.

**Solution**: Systematic evaluation using decision criteria (time/ceremony, epic fit, impact, type) to recommend the optimal workflow path with clear handoff instructions.

## SEQUENTIAL Task Execution

### Step 1: Parse Input Format

Determine which triage mode to use:

**Mode A: Conversation-Based Triage** (default)
- User types `/triage` with no arguments
- Analyze recent conversation history (last 10-20 messages)
- Extract work description from user messages

**Mode B: Usage Issue Triage**
- User types `/triage issue-{N}` where N is issue number
- Load usage issues file: `docs/planning/gap-analysis/usage-issues.jsonl`
- Parse JSONL and extract issue N (N = line number in file)
- **Detect schema version**: Check for `schemaVersion` field
  - If `schemaVersion == "2.0"`: Read v2.0 fields directly (estimatedTime, thematicArea, type, suggestedPath, suggestedPathRationale)
  - If `schemaVersion` missing or `"1.0"`: Use v1.0 inference (see Step 2 fallback logic)
- If file missing: gracefully inform user "Usage issues file not found. Use /triage without issue number." and switch to Mode A
- If issue resolved: inform user and offer to list open issues

**Mode C: Explicit Description**
- User types `/triage [description]`
- Use provided description directly

**Mode D: Planning Document Triage**
- Detect if Claude Code planning document exists in current session
- Check for plan files in `~/.claude/plans/` directory
- Read most recent plan.md file (by modification time)
- Extract signals from plan:
  - **File count**: Count file mentions → Scope indicator (search for file paths, "Create", "Modify" keywords)
  - **Phase count**: Count "## Phase" headers → Complexity tier
  - **Time estimates**: Extract hour estimates from "Effort:", "Timeline:", or explicit hour mentions
  - **Risk level**: Extract from "Risk Level:" or "Risk:" sections
  - **Complexity keywords**: "simple", "medium", "complex", "most complex"
- Enrich conversation-based analysis with planning signals
- Display: "✓ Planning document found: [filename]"
- If plan file not found or unreadable: Gracefully fall back to Mode A

**Mode E: Inbox Processing** (Field Testing Submissions)
- User types `/triage inbox`
- Scan `docs/planning/gap-analysis/inbox/` for `*.json` files
- Filter for submissions with `status: "pending"`
- If no pending submissions: Display "✅ Inbox empty - no pending submissions" and exit
- If pending submissions found:
  - List submissions with numbers (1, 2, 3, ...)
  - Display submission metadata table:
    ```
    📬 Field Testing Inbox - {N} pending submission(s)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌────┬─────────────┬──────────────────────────┬──────────┬────────┐
    │ #  │ Submission  │ Description              │ Project  │ Date   │
    ├────┼─────────────┼──────────────────────────┼──────────┼────────┤
    │ 1  │ v-voz-001   │ Multi-workflow switchi...│ v-voz    │ Jan 22 │
    │ 2  │ prompt-ss...│ Schema validation fail...│ prompt-..│ Jan 23 │
    └────┴─────────────┴──────────────────────────┴──────────┴────────┘

    Type a number to process, 'all' for batch, or 'exit': _
    ```
  - Wait for user selection
- If user selects number or 'all': Proceed to inbox processing workflow (see Mode E Workflow below)
- If user types 'exit': Exit triage task

**Mode E Workflow** (Inbox Submission Processing):
1. Load selected submission JSON file(s)
2. For each submission:
   - Display submission details (description, context, severity, project details)
   - Search existing POEM issues in `docs/planning/gap-analysis/usage-issues.jsonl`
   - Similarity matching:
     - Compare submission `blocker.description` with issue `observation` field
     - Use fuzzy text matching (>80% similarity threshold)
     - Match on keywords, severity, thematic area
   - If match found (>80% similarity):
     ```
     🔗 Similar issue found!

     Issue #{N}: {observation}
     Severity: {severity} | Category: {category}
     Epic: {suggestedEpic} | Story: {suggestedStory}

     Link this submission to Issue #{N}? [y/n]: _
     ```
     - If yes: Link submission to existing issue (see Step 4: Link Submission)
     - If no: Continue to create new issue
   - If no match found (<80% similarity):
     ```
     🆕 No similar issue found

     Create new POEM issue for this submission? [y/n]: _
     ```
     - If yes: Create new issue (see Step 4: Create New Issue)
     - If no: Skip submission (keeps status "pending")
3. After processing all selected submissions: Display summary
   ```
   ✅ Inbox processing complete

   Processed: {N} submissions
   - Linked to existing issues: {N}
   - Created new issues: {N}
   - Skipped: {N}
   ```

### Step 2: Context Analysis

**Reference Documents**:
- **Unified Vocabulary**: `.bmad-core/vocabularies/work-item-taxonomy.yaml` - severity scales, work types, epic themes, time estimates
- **Decision Rules**: `.bmad-core/utils/triage-logic.md` - inference heuristics, classification rules, staleness detection

Extract the following attributes from conversation/issue/description:

**Required Attributes**:
- **Description**: What needs to be done (1-2 sentences)
- **Area**: Which domain/epic (Installation, Prompts, Workflows, Maintenance, etc.)
- **Estimate**: Time estimate (<1hr, 1-4hr, 4-8hr, >8hr)
- **Impact**: User impact level (low, medium, high)
- **Type**: Work classification (bug, enhancement, refactor, docs, feature)

**For v2.0 Usage Issues** (Mode B with `schemaVersion: "2.0"`):
- **Read directly from JSONL**:
  - `estimatedTime` → Estimate
  - `thematicArea` → Area
  - `type` → Type
  - `severity` → infer Impact (critical/high→high, medium→medium, low→low)
  - `suggestedPath` → Pre-computed routing suggestion
  - `suggestedPathRationale` → Reason for routing
- **Staleness Check** (see `.bmad-core/utils/triage-logic.md` staleness rules):
  - IF `timestamp` > 30 days old → Mark as STALE, recompute routing
  - IF `suggestedEpic` status is Done → Mark as STALE, recompute routing
  - IF `estimatedTime` differs from severity inference → Recompute routing
- **If STALE**: Recompute `suggestedPath` using Criteria 1-4 (Step 3), display warning: "⚠ Suggestion stale (>30 days), recomputed"
- **If VALID**: Use pre-computed `suggestedPath` as primary recommendation, display: "✓ Suggestion still valid ({timestamp})"

**For v1.0 Usage Issues** (Mode B with no `schemaVersion` or `"1.0"`):
- **Infer missing fields** using `.bmad-core/utils/triage-logic.md` inference rules:
  - `severity` → Estimate (critical→4-8hr, high→1-4hr, medium/low→<1hr)
  - `tags` + `references.files` + keywords → Area (see triage-logic.md thematic area inference)
  - `category` + `severity` → Type (bug→bug, missing-feature+critical→feature, etc.)
  - `severity` → Impact (critical/high→high, medium→medium, low→low)
- **Compute routing on-the-fly** using Criteria 1-4 (Step 3)
- **No staleness detection** (v1.0 has no stored suggestions)

**For Conversation-Based / Explicit Description** (Mode A / Mode C):
- **Extract from conversation/description**:
  - Keywords: "fix" suggests bug, "add" suggests enhancement, "refactor" suggests tech debt
  - File paths mentioned: `docs/` suggests documentation, `.github/` suggests infrastructure
  - Scope indicators: "typo", "quick" → <1hr; "implement", "create" → 1-4hr+
  - Impact indicators: "blocks", "critical", "users" → high; "nice to have" → low

**For Planning Documents** (Mode D):
- **Read planning signals directly**:
  - File count → Estimate (1-3 files→<1hr, 4-8 files→1-4hr, 8+ files→4-8hr+)
  - Phase count → Complexity (1 phase→simple, 2-3 phases→medium, 4+ phases→complex)
  - Explicit time estimates → Use directly (overrides file count inference)
  - Risk level → Impact (Low risk→low/medium impact, Medium/High risk→high impact)
- **Enrich conversation context**:
  - Combine planning signals with conversation-based extraction
  - Planning signals take precedence for Estimate and Complexity
  - Display confidence: "✓ High confidence routing (planning doc confirms [signal])"
- **Fallback handling**:
  - If planning doc exists but signals unclear → Use conversation-based extraction
  - If no planning doc → Transparent fallback to Mode A

### Step 3: Apply Decision Criteria

Evaluate in priority order:

**Criterion 1: Time/Ceremony Check**
```
Is estimate <1 hour AND no ceremony needed (no tests, no complex validation)?
├─ YES → Route to Quick Fix
└─ NO → Story required, continue to Criterion 2
```

**Criterion 2: Existing Story Check**
```
Does a story file already exist for this work?
├─ YES → Route to Existing Story (AppyDave Workflow)
└─ NO → Continue to Criterion 3
```

**Criterion 3: Epic Thematic Fit**
```
Does work align with a feature epic theme?
├─ Epic 1: Installation, NPX installer, framework setup
├─ Epic 2: Prompt management, schema extraction, validation
├─ Epic 3: Mock data generation, faker integration
├─ Epic 4: Workflow orchestration, chains, automation
├─ Epic 5: Integration with external providers
├─ Epic 6: Web visualization, dashboards
├─ Epic 7: CLI commands, developer tools
│
├─ MATCH FOUND → Route to Feature Epic Story (Epic 1-7)
└─ NO MATCH → Continue to Criterion 4
```

**Criterion 4: Epic 0 vs Ambiguous**
```
Is this pure maintenance (bug fix, perf, tech debt, security, infra, docs)?
├─ YES → Route to Epic 0 Story (Maintenance)
└─ NO (ambiguous, needs clarification) → Ask user for clarification
```

### Step 3.5: Mode E Specific Processing (Inbox Submissions)

**Only execute if Mode E (/triage inbox) was triggered**

For each selected submission from the inbox:

**Step 3.5a: Link to Existing Issue**

If user confirmed linking to existing issue:

1. **Update POEM issue** (`docs/planning/gap-analysis/usage-issues.jsonl`):
   - Read existing issue line (issue number = line number in file)
   - Parse JSON object
   - If `schemaVersion` is not `"2.1"`: Upgrade to v2.1 (add `schemaVersion: "2.1"`)
   - Add or update `reportedBy` array field:
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
   - Extract from submission: `submissionId`, `project.name`, `timestamp`, `blocker.projectSpecificDetails`
   - Append to existing `reportedBy` array (if already exists) or create new array
   - Write updated issue back to JSONL file (same line number)

2. **Update submission file** (`docs/planning/gap-analysis/inbox/{submissionId}.json`):
   - Read submission JSON
   - Update fields:
     - `status`: `"pending"` → `"linked"`
     - `poemIssueRef`: `"issue-{N}"` (where N = issue line number)
   - Write updated submission back to inbox file
   - Pretty-print JSON (indent 2 spaces)

3. **Display confirmation**:
   ```
   ✅ Linked {submissionId} to Issue #{N}

   Updated:
   - POEM issue reportedBy array (now {count} project(s))
   - Submission status: pending → linked
   ```

**Step 3.5b: Create New Issue**

If user confirmed creating new issue:

1. **Create new POEM issue entry**:
   - Generate new issue from submission data:
     ```json
     {
       "timestamp": "{submission.timestamp}",
       "session": "field-testing-{project}",
       "category": "{infer from severity/description}",
       "severity": "{submission.blocker.severity}",
       "observation": "{submission.blocker.description}",
       "context": "{submission.blocker.context}",
       "expected": "System should maintain state across workflow switches",
       "actual": "{derived from context}",
       "impact": "{derived from severity}",
       "tags": ["{project}", "{workflowName}", "field-testing"],
       "schemaVersion": "2.1",
       "estimatedTime": "{infer from severity}",
       "thematicArea": "{infer from workflowName}",
       "type": "bug",
       "suggestedPath": "{compute using Criteria 1-4}",
       "reportedBy": [
         {
           "submissionId": "{submission.submissionId}",
           "project": "{submission.project.name}",
           "timestamp": "{submission.timestamp}",
           "projectSpecificDetails": "{submission.blocker.projectSpecificDetails}"
         }
       ]
     }
     ```
   - Inference rules:
     - `category`: Use `severity` + keywords (critical/high→bug, medium→usability, low→enhancement)
     - `expected`: Generic statement based on context
     - `actual`: Extract from context
     - `impact`: Map severity (critical/high→high, medium→medium, low→low)
     - `estimatedTime`: Map severity (critical→4-8hr, high→1-4hr, medium→<1hr, low→<1hr)
     - `thematicArea`: Map workflowName (storyline→workflows, prompt→prompts, etc.)
   - Append new issue to `docs/planning/gap-analysis/usage-issues.jsonl`
   - Get new issue number (count lines in file)

2. **Update submission file** (same as Step 3.5a #2)

3. **Display confirmation**:
   ```
   ✅ Created Issue #{N} for {submissionId}

   New issue:
   - Observation: {observation}
   - Category: {category} | Severity: {severity}
   - Suggested Path: {suggestedPath}
   - Submission linked and marked as "linked"
   ```

**Step 3.5c: Skip Submission**

If user chose not to link or create:
- Leave submission status as `"pending"`
- Display: "⏭ Skipped {submissionId} (status remains pending)"

### Step 4: Generate Routing Recommendation

**For v2.0 Usage Issues with Valid Pre-Computed Suggestion**:
- Read `suggestedPath` from issue
- Read `suggestedPathRationale` from issue
- Display with verification status: "✓ Suggestion still valid ({timestamp})"
- Use pre-computed suggestion as primary recommendation
- Rationale bullets come from `suggestedPathRationale` field

**For v2.0 Usage Issues with Stale Suggestion**:
- Display warning: "⚠ Suggestion stale (>30 days old / Epic {N} completed), recomputed"
- Recompute routing using Criteria 1-4 (Step 3)
- Generate new rationale bullets based on current state

**For v1.0 Usage Issues / Conversation-Based / Explicit Description**:
- Compute routing using Criteria 1-4 (Step 3)
- Generate rationale bullets based on criteria evaluation

---

Generate output using this format:

**All Modes (Unified Format)**:
```
🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: [description]
✓ Area: [epic/category]
✓ Estimate: [time]
✓ Impact: [high/medium/low]
✓ Type: [bug/enhancement/refactor/docs/feature]
[Optional indicators:]
✓ Planning document found: [filename]  [if Mode D]
✓ Suggestion still valid (logged {timestamp})  [if v2.0 valid]
⚠ Suggestion stale (>30 days), recomputed  [if v2.0 stale]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: [Route Destination Name]

[Brief 1-2 sentence summary of why this route was chosen]

┌────────┬──────────────────┬─────────────────────────────────────┬──────────────────────┐
│ Option │ Route To →       │ Agent & Command                     │ Why                  │
├────────┼──────────────────┼─────────────────────────────────────┼──────────────────────┤
│ ✅ REC │ [Destination]    │ [Agent Name]                        │ [Key reason]         │
│        │                  │ [Command]                           │ [Secondary reason]   │
├────────┼──────────────────┼─────────────────────────────────────┼──────────────────────┤
│   1️⃣   │ [Alt 1 Dest]     │ [Agent Name]                        │ [Key reason]         │
│        │                  │ [Command]                           │                      │
├────────┼──────────────────┼─────────────────────────────────────┼──────────────────────┤
│   2️⃣   │ [Alt 2 Dest]     │ [Agent Name]                        │ [Key reason]         │
│        │                  │ [Command]                           │                      │
└────────┴──────────────────┴─────────────────────────────────────┴──────────────────────┘

Type 'go', '1', or '2': _
```

### Step 5: Pattern Check (Pre-Execution)

Before presenting handoff commands, scan for relevant KDD knowledge:

1. **Scan KDD patterns**: Check `docs/kdd/patterns/` for patterns matching the work area
2. **Scan KDD learnings**: Check `docs/kdd/learnings/` for prior issues in the same area
3. **Scan coding standards**: Reference `docs/architecture/coding-standards.md` for the affected domain
4. **Scan ADRs**: Check `docs/kdd/decisions/` for architectural decisions constraining this area

If relevant knowledge found, append to the routing output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Relevant Patterns & Knowledge
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before fixing, review:
- [Pattern Name](docs/kdd/patterns/xxx.md) — {one-line summary}
- [Learning: {topic}](docs/kdd/learnings/xxx.md) — {one-line summary}
- [ADR-{N}](docs/kdd/decisions/xxx.md) — {one-line summary}

⚠️ These constrain how this fix should be implemented.
```

If no KDD docs exist yet, check coding standards and architecture decisions only.

### Step 6: Routing Destinations and Commands

These are reference templates for populating the table rows. Use user-facing destination names, not internal path numbers.

**Existing Story → AppyDave Workflow**
- **Route To →**: Existing Story (Story {story-number})
- **Agent & Command**: AppyDave Workflow → `/appydave-workflow {story-number}`
- **When**: Story file already exists for this work
- **Why**: Avoid duplication, workflow handles full lifecycle (Dev → SAT → QA)

**Feature Epic Story (Epics 1-7)**
- **Route To →**: Epic {N} Story
- **Agent & Command**: SM (Bob) → `/BMad/agents/sm` then `*draft` (enter {N})
- **When**: Work aligns with feature epic themes (Installation, Prompts, Mock Data, Workflows, Integration, Visualization, CLI)
- **Why**: Clear alignment with Epic {N} goals, multi-hour effort with testing needs

**Quick Fix**
- **Route To →**: Quick Fix
- **Agent & Command**: SM (Bob) → `/BMad/agents/sm` then `*add-fix {category} "{description}"`
- **Categories**: infrastructure, tech-debt, documentation, bugs
- **When**: <1 hour scope AND no ceremony needed (no tests, simple correction)
- **Pre-check**: Review relevant `docs/kdd/` patterns and `docs/architecture/coding-standards.md` before fixing
- **Why**: Direct fix more efficient than story overhead, logged in backlog for tracking

**Epic 0 Story (Maintenance)**
- **Route To →**: Epic 0 Story
- **Agent & Command**: SM (Bob) → `/BMad/agents/sm` then `*draft` (enter 0)
- **When**: Maintenance work >1 hour (bug fix, perf, tech debt, security, infra, docs)
- **Why**: Structured approach needed, requires full ceremony (Dev → SAT → QA)
- **Priority**: P0 (critical), P1 (high), P2 (medium)

**Usage Issue Routing**
- **Route To →**: [Determined by applying Criteria 1-4]
- **Agent & Command**: [Use one of the above templates based on analysis]
- **When**: Triaging from `usage-issues.jsonl` file
- **Note**: Apply decision criteria to determine which of the above 4 routes to use

### Step 7: Present Alternatives

For every recommended path, suggest 1-2 alternatives:

**If recommending Quick Fixes**, suggest:
1. Epic 0 Story (if user wants formal tracking)
2. Direct fix without logging (if extremely trivial)

**If recommending Feature Epic Story**, suggest:
1. Epic 0 (if maintenance aspect unclear)
2. Quick Fix (if scope could be reduced to <1hr)

**If recommending Epic 0**, suggest:
1. Feature Epic (if thematic fit exists)
2. Quick Fix (if scope negotiable)

**If recommending AppyDave Workflow**, suggest:
1. New story (if existing story scope has drifted)

### Step 8: Wait for User Confirmation

HALT and wait for user input:
- `'go'` or `Enter` → Proceed with recommended path (inform user they should execute the command)
- `'1'` or `'2'` → Switch to alternative path and re-display with new recommendation
- Free-form text → Re-analyze with user's clarification and regenerate recommendation

**Important**: Triage DOES NOT auto-execute the handoff command. It provides routing guidance. User must execute the command sequence themselves.

### Step 9: Handle Edge Cases

**No Clear Context**:
```
⚠️  Unable to determine work from conversation

Please provide more details:
- What needs to be done?
- Which area does this affect?
- How long do you estimate?

Example: /triage Add validation for prompt schemas
```

**Ambiguous Path**:
```
🤔 Ambiguous Routing

This could be either:
- Epic {N} Story ({reason})
- Epic 0 Story ({reason})

Please clarify:
1️⃣ Feature work (new capability) → Epic {N}
2️⃣ Maintenance work (fix/improve existing) → Epic 0

Type '1' or '2': _
```

**Usage Issue File Missing**:
```
⚠️  Usage issues file not found

File expected: docs/planning/gap-analysis/usage-issues.jsonl

Falling back to conversation-based triage.
Describe the work you'd like to triage: _
```

**Resolved Usage Issue**:
```
✅ Issue #{N} already resolved

Resolution: {resolution-summary}
Resolved at: {timestamp}

Would you like to:
1️⃣ List open issues
2️⃣ Triage different issue

Type '1' or '2': _
```

## Expected Inputs

- **Conversation history** (last 10-20 messages) - for Mode A
- **Usage issues file** (optional) - for Mode B
- **Explicit description** (optional) - for Mode C
- **User clarifications** (during execution) - for ambiguous cases

## Expected Outputs

- **Triage analysis** (Found, Area, Estimate, Impact, Type)
- **Routing decision** (recommended path with reasoning)
- **Handoff command** (exact command sequence for user to execute)
- **Alternatives** (1-2 alternative paths)
- **User confirmation prompt** (wait for go/1/2/text)

## Error Handling

- **Missing context**: Prompt user for details
- **Ambiguous classification**: Present options and ask for clarification
- **File not found**: Graceful fallback with informative message
- **Invalid issue number**: Inform user and offer to list valid issues
- **Malformed JSON**: Log error, inform user, fall back to conversation triage

---

**Last Updated**: 2026-01-21
