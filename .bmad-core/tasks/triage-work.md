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
- If file missing: gracefully inform user "Usage issues file not found. Use /triage without issue number." and switch to Mode A
- If issue resolved: inform user and offer to list open issues

**Mode C: Explicit Description**
- User types `/triage [description]`
- Use provided description directly

### Step 2: Context Analysis

Extract the following attributes from conversation/issue/description:

**Required Attributes**:
- **Description**: What needs to be done (1-2 sentences)
- **Area**: Which domain/epic (Installation, Prompts, Workflows, Maintenance, etc.)
- **Estimate**: Time estimate (<1hr, 1-4hr, 4-8hr, >8hr)
- **Impact**: User impact level (low, medium, high)
- **Type**: Work classification (bug, enhancement, refactor, docs, feature)

**Analysis Hints**:
- Keywords: "fix" suggests bug, "add" suggests enhancement, "refactor" suggests tech debt
- File paths mentioned: `docs/` suggests documentation, `.github/` suggests infrastructure
- Scope indicators: "typo", "quick" → <1hr; "implement", "create" → 1-4hr+
- Impact indicators: "blocks", "critical", "users" → high; "nice to have" → low

### Step 3: Apply Decision Criteria

Evaluate in priority order:

**Criterion 1: Time/Ceremony Check**
```
Is estimate <1 hour AND no ceremony needed (no tests, no complex validation)?
├─ YES → Route to Quick Fixes (Path #3)
└─ NO → Story required, continue to Criterion 2
```

**Criterion 2: Existing Story Check**
```
Does a story file already exist for this work?
├─ YES → Route to AppyDave Workflow (Path #1)
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
├─ MATCH FOUND → Route to Feature Epic Story (Path #2)
└─ NO MATCH → Continue to Criterion 4
```

**Criterion 4: Epic 0 vs Ambiguous**
```
Is this pure maintenance (bug fix, perf, tech debt, security, infra, docs)?
├─ YES → Route to Epic 0 Story (Path #4)
└─ NO (ambiguous, needs clarification) → Ask user for clarification
```

### Step 4: Generate Routing Recommendation

Based on decision criteria, generate output using this format:

```
🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: [description]
✓ Area: [epic/category]
✓ Estimate: [time]
✓ Impact: [high/medium/low]
✓ Type: [bug/enhancement/refactor/docs/feature]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: [Path Name]
   [Path details - see Step 5 for templates]
   Reason:
   - [Reason 1 based on criteria]
   - [Reason 2 based on analysis]
   - [Reason 3 based on impact/type]

   Next: [Command sequence - see handoff templates below]

   Press Enter or type 'go' to proceed ⏎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔀 Alternatives
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ [Alternative path with brief rationale]
2️⃣ [Alternative path with brief rationale]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type 'go' for recommended path, '1' or '2' for alternatives,
or describe what you'd prefer: _
```

### Step 5: Handoff Templates by Path

**Path #1: Existing Story → AppyDave Workflow**
```
✅ RECOMMENDED: Existing Story (Path #1)
   Story {story-number} already exists for this work
   Use AppyDave workflow to continue development

   Reason:
   - Story file found: docs/stories/{story-number}.story.md
   - Avoid duplication by using existing story
   - Workflow handles full lifecycle (Dev → SAT → QA)

   Next: /appydave-workflow {story-number}
```

**Path #2: New Feature Epic Story → Bob *draft**
```
✅ RECOMMENDED: Epic {N} Story (Path #2)
   Create new story in Epic {N}: {epic-name}
   Work fits theme: {thematic-fit-explanation}

   Reason:
   - Clear alignment with Epic {N} goals
   - {Impact justification - e.g., "High impact feature requiring full ceremony"}
   - {Complexity justification - e.g., "Multi-hour effort with testing needs"}

   Next: /BMad/agents/sm then *draft
   (Bob will prompt for epic number - enter {N})
```

**Path #3: Quick Fixes → Bob *add-fix**
```
✅ RECOMMENDED: Quick Fixes (Path #3)
   Category: {category} (infrastructure, tech-debt, documentation, bugs)
   Simple fix, no ceremony needed

   Reason:
   - <1 hour scope ({estimate})
   - {Simplicity indicator - e.g., "Simple correction, no tests required"}
   - Direct fix more efficient than story overhead

   Next: /BMad/agents/sm then *add-fix {category} "{description}"
```

**Path #4: Epic 0 Story → Bob *draft**
```
✅ RECOMMENDED: Epic 0 Story (Path #4)
   Maintenance work requiring full ceremony
   Priority: {P0/P1/P2 based on impact}

   Reason:
   - >1 hour scope, needs structured approach
   - {Type} work fits Epic 0 category
   - {Impact justification - e.g., "High impact maintenance requiring QA validation"}

   Next: /BMad/agents/sm then *draft
   (Bob will prompt for epic number - enter 0)
```

**Path #5: From Usage Issue → Depends on Analysis**
```
✅ RECOMMENDED: [Determined by analysis]
   Issue #{N}: {issue-title}
   Severity: {severity}

   [Apply Criteria 1-4 to route to appropriate path]
   [Use handoff template for determined path]
```

### Step 6: Present Alternatives

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

### Step 7: Wait for User Confirmation

HALT and wait for user input:
- `'go'` or `Enter` → Proceed with recommended path (inform user they should execute the command)
- `'1'` or `'2'` → Switch to alternative path and re-display with new recommendation
- Free-form text → Re-analyze with user's clarification and regenerate recommendation

**Important**: Triage DOES NOT auto-execute the handoff command. It provides routing guidance. User must execute the command sequence themselves.

### Step 8: Handle Edge Cases

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
