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
