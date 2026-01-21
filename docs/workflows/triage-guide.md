# Triage System User Guide

## Overview

The Triage System eliminates decision paralysis when routing development work by applying clear criteria to determine whether work should be a story, quick fix, or existing workflow.

**Problem**: POEM has 5+ entry points for work (existing stories, new stories in epics, quick fixes, Epic 0 stories, usage issues) with no unified decision framework.

**Solution**: Type `/triage` and let the system analyze context, apply decision criteria, and recommend the optimal workflow path with clear handoff instructions.

---

## When to Use `/triage`

**Use triage when you have work but are unsure:**
- Should this be a story or a quick fix?
- Which epic does this belong to?
- Is there already a story for this?
- How should I convert this usage issue to actionable work?

**Scenarios where triage helps:**
1. **Unclear Scope**: "I need to add validation... is this <1hr or more?"
2. **Epic Ambiguity**: "This could be Epic 2 or Epic 0... which?"
3. **Existing Work**: "Did someone already create a story for this?"
4. **Usage Issues**: "How do I turn issue #5 into a story?"
5. **Quick Wins**: "This typo fix... ceremony or no ceremony?"

---

## How to Use `/triage`

### Basic Usage

```bash
# Triage based on recent conversation
/triage

# Triage a specific usage issue
/triage issue-3

# Triage with explicit description
/triage Add schema validation for prompt templates
```

### What Happens

1. **Context Analysis**: Extracts description, area, estimate, impact, type
2. **Decision Criteria**: Applies time/ceremony, epic fit, impact, type checks
3. **Routing Recommendation**: Suggests optimal path with reasoning
4. **Handoff Command**: Provides exact command sequence to execute
5. **Alternatives**: Shows 1-2 alternative paths
6. **User Confirmation**: Waits for `go`, `1`, `2`, or clarification

---

## Decision Criteria Explained

### 1. Time/Ceremony Check (Priority #1)

**Question**: Is this <1 hour AND no ceremony needed?

**Quick Fix Indicators**:
- Typo fixes
- Single-line code changes
- Adding .gitignore entries
- Simple documentation updates
- No tests required

**Story Indicators**:
- Multi-file changes
- Requires testing
- Complex logic
- Architectural changes
- >1 hour scope

### 2. Existing Story Check (Priority #2)

**Question**: Does a story file already exist?

- Searches `docs/stories/` for relevant story
- If found → Route to `/appydave-workflow {story}`
- If not found → Continue to Epic Fit check

### 3. Epic Thematic Fit (Priority #3)

**Question**: Does work align with a feature epic?

**Epic Themes**:
- **Epic 1**: Installation, NPX, framework setup
- **Epic 2**: Prompt management, schemas, validation
- **Epic 3**: Mock data generation, faker
- **Epic 4**: Workflow orchestration, chains
- **Epic 5**: External provider integrations
- **Epic 6**: Web visualization, dashboards
- **Epic 7**: CLI commands, developer tools

**If match found** → Route to Feature Epic Story
**If no match** → Continue to Epic 0 check

### 4. Epic 0 vs Ambiguous (Priority #4)

**Question**: Is this pure maintenance?

**Epic 0 Categories**:
- Bug fixes
- Performance optimization
- Technical debt
- Security patches
- Infrastructure (CI/CD, Docker)
- Developer experience improvements
- Documentation updates

**If clear maintenance** → Route to Epic 0 Story
**If ambiguous** → Ask user for clarification

---

## Visual Decision Tree

```
┌─────────────────────┐
│   Development Work  │
└──────────┬──────────┘
           │
           ▼
   ╔═══════════════════╗
   ║ <1hr & no ceremony? ║
   ╚═════════╦═════════╝
             ║
        YES  ║  NO
     ┌───────╨───────┐
     ▼               ▼
┌──────────┐   ╔═══════════════╗
│ QUICK FIX│   ║ Story exists? ║
└──────────┘   ╚═══════╦═══════╝
                       ║
                  YES  ║  NO
               ┌───────╨───────┐
               ▼               ▼
        ┌──────────────┐  ╔═══════════╗
        │ EXISTING     │  ║ Epic fit? ║
        │ STORY        │  ╚═════╦═════╝
        └──────────────┘        ║
                           YES  ║  NO
                        ┌───────╨───────┐
                        ▼               ▼
                 ┌────────────┐  ╔══════════╗
                 │ FEATURE    │  ║ Maint?   ║
                 │ EPIC STORY │  ╚═════╦════╝
                 └────────────┘        ║
                                  YES  ║  NO
                               ┌───────╨───────┐
                               ▼               ▼
                        ┌───────────┐   ┌──────────┐
                        │ EPIC 0    │   │ CLARIFY  │
                        │ STORY     │   │ WITH USER│
                        └───────────┘   └──────────┘
```

---

## Layer 3: Behavioral Integration (v2.0)

Starting with **Story 0.2**, the Issue Logger and Triage systems have been integrated through schema v2.0, enabling automated routing suggestions and fast-path triage.

### What is Layer 3?

**Layer 3** connects the Issue Logger agent with the Triage task so that:
1. **Issue Logger** automatically computes routing suggestions when logging issues
2. **Triage** uses pre-computed suggestions as the primary recommendation
3. **Staleness detection** ensures suggestions remain valid over time

### v2.0 Issue Schema

When you log issues via `/poem/log-issues`, the Issue Logger now:
- Prompts you to confirm inferred values (estimatedTime, thematicArea, type)
- Applies triage logic automatically to compute `suggestedPath`
- Stores routing rationale in `suggestedPathRationale`
- Supports "auto" mode to skip all prompts and use inference

**v2.0 fields**:
```json
{
  "schemaVersion": "2.0",
  "estimatedTime": "<1hr|1-4hr|4-8hr|>8hr",
  "thematicArea": "installation|prompts|schemas|workflows|...",
  "type": "bug|enhancement|refactor|docs|feature",
  "suggestedPath": "Quick Fix|Epic 0 Story|Feature Epic Story",
  "suggestedPathRationale": "2-3 bullet points explaining routing",
  "suggestedEpic": "Epic 0-7 (if applicable)"
}
```

### Fast-Path Triage for v2.0 Issues

When you run `/triage issue-{N}` on a v2.0 issue:

**If suggestion is valid** (logged <30 days ago, epic not completed):
```
🔍 Work Intake Triage (v2.0 Fast-Path)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: [description]
✓ Area: [thematicArea from issue]
✓ Estimate: [estimatedTime from issue]
✓ Impact: [inferred from severity]
✓ Type: [type from issue]
✓ Suggestion still valid (logged 2026-01-15)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: [suggestedPath from issue]
   [Path details]
   Reason (from Issue Logger):
   • [rationale bullet 1]
   • [rationale bullet 2]
   • [rationale bullet 3]

   Next: [Command sequence]
```

**If suggestion is stale** (>30 days old OR epic completed):
```
🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: [description]
✓ Area: [thematicArea from issue]
✓ Estimate: [estimatedTime from issue]
✓ Impact: [inferred from severity]
✓ Type: [type from issue]
⚠ Suggestion stale (>30 days), recomputed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: [newly computed path]
   [Path details]
   Reason:
   • [criterion 1 reasoning]
   • [criterion 2 reasoning]

   Next: [Command sequence]
```

### Staleness Detection Rules

Triage recomputes `suggestedPath` when:

1. **Age > 30 days**: Issue logged over 30 days ago
   - Rationale: Epic priorities shift, new stories created
   - Action: Rerun Criteria 1-4 with current project state

2. **Epic completed**: `suggestedEpic` status is Done
   - Rationale: Feature epic finished, work should route to Epic 0
   - Action: Re-evaluate epic fit, typically routes to Epic 0

3. **Estimate changed**: User overrides `estimatedTime`
   - Rationale: Time estimate affects Criterion 1 (Quick Fix vs Story)
   - Action: Rerun Criteria 1-4 with new estimate

### Backward Compatibility (v1.0 Issues)

Triage automatically detects v1.0 issues (no `schemaVersion` field) and:
- Infers missing fields using rules from `.bmad-core/utils/triage-logic.md`
- Computes routing on-the-fly (no staleness detection)
- Works seamlessly with existing 10 logged issues

**No migration required** - v1.0 issues continue working as before.

### Benefits of Layer 3 Integration

1. **Eliminates Dual Entry**: Issue Logger captures routing data once
2. **Faster Triage**: Pre-computed suggestions reduce analysis time
3. **Historical Record**: Routing rationale stored with issue for debugging
4. **Automatic Updates**: Staleness detection adapts to project changes
5. **User Control**: Confirmation prompts allow override of inferred values

---

## Unified Vocabulary

The Triage System uses a shared vocabulary defined in `.bmad-core/vocabularies/work-item-taxonomy.yaml`. This ensures consistent classification across Issue Logger and Triage.

**Key Concepts**:

### Severity Scale
- **critical**: Production blockers, data loss, security vulnerabilities → P0 priority, 4-8hr estimate
- **high**: Affects core workflows, impacts multiple users → P1 priority, 1-4hr estimate
- **medium**: Minor issues with workarounds, edge cases → P1 priority, <1hr estimate
- **low**: Nice-to-have improvements → P2 priority, <1hr estimate

### Work Types
- **bug**: Defects causing incorrect behavior → Routes to Epic 0
- **enhancement**: Improvements to existing functionality → Routes by epic fit
- **refactor**: Code restructuring for maintainability → Routes to Epic 0
- **docs**: Documentation updates → Routes to Epic 0
- **feature**: New capabilities → Routes to Feature Epics (1-7)

### Epic Themes
- **Epic 1**: Installation, setup, NPX installer
- **Epic 2**: Prompt management, schemas, validation
- **Epic 3**: Mock data generation
- **Epic 4**: Workflow orchestration, chains
- **Epic 5**: Provider integrations
- **Epic 6**: Web visualization, dashboards
- **Epic 7**: CLI commands, developer tools
- **Epic 0**: Maintenance, bugs, tech debt, docs, performance

**Reference**: See `.bmad-core/vocabularies/work-item-taxonomy.yaml` for complete taxonomy and `.bmad-core/utils/triage-logic.md` for decision rules.

---

## Example Scenarios

### Path #1: Existing Story

**Scenario**: User mentions "continue work on prompt validation"

```
🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: Continue prompt validation work
✓ Area: Prompts (Epic 2)
✓ Estimate: 2 hours
✓ Impact: High
✓ Type: enhancement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: Existing Story (Path #1)
   Story 2.3 already exists for this work
   Use AppyDave workflow to continue development

   Reason:
   - Story file found: docs/stories/2.3.story.md
   - Avoid duplication by using existing story
   - Workflow handles full lifecycle (Dev → SAT → QA)

   Next: /appydave-workflow 2.3
```

### Path #2: Feature Epic Story

**Scenario**: User wants to add React dashboard for workflow visualization

```
🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: Add React dashboard for workflow visualization
✓ Area: Web visualization (Epic 6)
✓ Estimate: 8 hours
✓ Impact: High
✓ Type: feature

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: Epic 6 Story (Path #2)
   Create new story in Epic 6: Web Visualization
   Work fits theme: Interactive UI for workflow monitoring

   Reason:
   - Clear alignment with Epic 6 goals (visualization)
   - High impact feature requiring full ceremony
   - Multi-day effort with testing needs

   Next: /BMad/agents/sm then *draft
   (Bob will prompt for epic number - enter 6)

🔀 Alternatives:
1️⃣ Epic 4 Story (if focus is workflow logic vs UI)
```

### Path #3: Quick Fix

**Scenario**: Fix typo in CONTRIBUTING.md

```
🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: Fix typo in CONTRIBUTING.md
✓ Area: Documentation
✓ Estimate: 5 minutes
✓ Impact: Low
✓ Type: docs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: Quick Fixes (Path #3)
   Category: documentation
   Simple fix, no ceremony needed

   Reason:
   - <1 hour scope (5 minutes)
   - Simple correction, no tests required
   - Direct fix more efficient than story overhead

   Next: /BMad/agents/sm then *add-fix documentation "Fix typo in CONTRIBUTING.md"

🔀 Alternatives:
1️⃣ Create Epic 0 Story (if you want formal tracking)
```

### Path #4: Epic 0 Story

**Scenario**: Refactor schema validation logic into shared utility

```
🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: Refactor schema validation into shared utility
✓ Area: Technical debt
✓ Estimate: 3 hours
✓ Impact: Medium
✓ Type: refactor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: Epic 0 Story (Path #4)
   Maintenance work requiring full ceremony
   Priority: P1 (High)

   Reason:
   - >1 hour scope, needs structured approach
   - Refactor work fits Epic 0 category (tech debt)
   - Medium impact maintenance requiring QA validation

   Next: /BMad/agents/sm then *draft
   (Bob will prompt for epic number - enter 0)

🔀 Alternatives:
1️⃣ Quick Fix (if scope can be reduced to single file)
```

### Path #5: Usage Issue

**Scenario**: Convert usage issue #7 to work

```
User: /triage issue-7

🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: Issue #7 - Template rendering fails for null values
✓ Area: Prompts (Epic 2)
✓ Estimate: 2 hours
✓ Impact: High
✓ Type: bug
✓ Severity: P1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: Epic 0 Story (Path #4)
   Bug fix requiring full ceremony
   Priority: P1 (High severity)

   Reason:
   - High severity bug impacting core functionality
   - >1 hour scope (investigation + fix + tests)
   - Requires QA validation to prevent regression

   Next: /BMad/agents/sm then *draft
   (Bob will prompt for epic number - enter 0)

🔀 Alternatives:
1️⃣ Epic 2 Story (if this reveals need for template refactor)
```

---

## FAQ

### Q: Can triage auto-execute the handoff command?

**A**: No. Triage provides routing guidance only. You must execute the command sequence yourself (e.g., `/BMad/agents/sm` then `*draft`).

### Q: What if triage gets the recommendation wrong?

**A**: Use the alternatives (type `1` or `2`) or provide clarification. Triage will re-analyze with your input.

### Q: Can I override triage's recommendation?

**A**: Yes! Alternatives are suggestions. You can always execute a different workflow if you have good reason.

### Q: Does triage modify any files?

**A**: No. Triage is read-only analysis. It only recommends actions - you execute them.

### Q: What if usage issues file is missing?

**A**: Triage gracefully falls back to conversation-based triage and informs you the file wasn't found.

### Q: Can I use triage for client projects?

**A**: Yes! Triage works for any BMAD-based project. Epic themes will differ, but decision criteria are universal.

### Q: How do v2.0 issues differ from v1.0?

**A**: v2.0 issues include pre-computed routing suggestions (suggestedPath, suggestedPathRationale) from Issue Logger. Triage uses these as the primary recommendation with staleness detection. v1.0 issues compute routing on-the-fly (no stored suggestions).

### Q: What happens if I change the estimate in a v2.0 issue?

**A**: Triage detects the change and recomputes the routing suggestion, displaying "⚠ Suggestion stale (estimate changed), recomputed".

### Q: Can I override Issue Logger's suggested routing?

**A**: Yes! When logging issues, answer "no" to the confirmation prompt to provide custom values. When triaging, use alternatives (type `1` or `2`) or describe what you prefer.

### Q: What is "auto" mode in Issue Logger?

**A**: Type "auto" when prompted for confirmation. Issue Logger will skip all future prompts and use inferred values for remaining issues in the session. Useful for bulk issue logging.

---

## Troubleshooting

### Issue: "Unable to determine work from conversation"

**Solution**: Provide more context:
```bash
/triage Add JSON schema validation for prompt templates with error messages
```

### Issue: "Ambiguous routing - could be Epic X or Epic 0"

**Solution**: Clarify intent:
- Type `1` for Feature work (new capability)
- Type `2` for Maintenance work (fix/improve existing)

### Issue: Triage recommends Quick Fix but I want a story

**Solution**: Use alternative `1` or manually create Epic 0 story:
```bash
/BMad/agents/sm
*draft
# Enter 0 for Epic 0
```

### Issue: Usage issue file not found

**Solution**: Either:
1. Create the file: `docs/planning/gap-analysis/usage-issues.jsonl`
2. Use conversation-based triage instead: `/triage [description]`

---

## Quick Fixes vs Epic 0 Stories

**Quick Fixes** (`docs/backlog/quick-fixes.md`):
- <1 hour scope
- No ceremony (no story file, no QA gate)
- Direct fix and log with commit reference
- Categories: infrastructure, tech-debt, documentation, bugs
- Example: Fix typo, add .gitignore entry, update README

**Epic 0 Stories**:
- >1 hour scope
- Full BMAD ceremony (5-agent AppyDave workflow)
- Story file with acceptance criteria, tasks, QA review
- Priority: P0 (Critical), P1 (High), P2 (Medium)
- Example: Add triage system, refactor schema validation

**Promotion**: If a Quick Fix grows beyond 1hr, promote to Epic 0 story via `/BMad/agents/po` then `*create-story`.

---

## Best Practices

1. **Use triage early**: Don't start work without triaging first
2. **Provide context**: The more detail in conversation, the better the recommendation
3. **Trust but verify**: Triage is 90%+ accurate, but you're the final decision-maker
4. **Track patterns**: If triage consistently misroutes, provide feedback to improve criteria
5. **Update usage issues**: Keep `usage-issues.jsonl` current for accurate issue triage

---

**Last Updated**: 2026-01-21
