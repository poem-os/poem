# /triage Command

Unified work intake triage system for routing development work to the appropriate workflow.

## Usage

```bash
/triage                           # Analyze recent conversation
/triage issue-3                   # Triage usage issue #3
/triage Add prompt validation     # Triage explicit description
# Planning mode detected automatically when plan.md exists
```

## What This Does

Analyzes development work and recommends the optimal workflow path:
- **Quick Fixes** (<1hr, no ceremony)
- **Feature Epic Stories** (new capabilities in Epics 1-7)
- **Epic 0 Stories** (maintenance work >1hr)
- **Existing Stories** (continue AppyDave workflow)
- **Usage Issues** (convert issues to stories/fixes)
- **Planning Documents** (Mode D - enriches analysis with plan.md signals)

## Instructions

Load and execute the triage task:

1. Load `.bmad-core/tasks/triage-work.md`
2. Follow the sequential task execution steps
3. Parse input format (conversation/issue/explicit)
4. Analyze context and extract attributes
5. Apply decision criteria in priority order
6. Generate routing recommendation with handoff command
7. Wait for user confirmation (go/1/2/text)
8. Provide guidance but DO NOT auto-execute handoff commands

**Critical**: This command provides routing guidance. The user must execute the recommended command sequence themselves (e.g., `/BMad/agents/sm` then `*draft`).

## Example Output

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

✅ RECOMMENDED: Quick Fix

Simple documentation correction taking <5 minutes with no ceremony needed.

┌────────┬──────────────┬─────────────────────────────────────┬──────────────────────┐
│ Option │ Route To →   │ Agent & Command                     │ Why                  │
├────────┼──────────────┼─────────────────────────────────────┼──────────────────────┤
│ ✅ REC │ Quick Fix    │ SM (Bob)                            │ <1hr, no tests       │
│        │              │ /BMad/agents/sm → *add-fix          │ Simple correction    │
│        │              │   documentation "Fix typo in..."    │                      │
├────────┼──────────────┼─────────────────────────────────────┼──────────────────────┤
│   1️⃣   │ Epic 0 Story │ SM (Bob)                            │ Formal tracking      │
│        │              │ /BMad/agents/sm → *draft (0)        │ if desired           │
└────────┴──────────────┴─────────────────────────────────────┴──────────────────────┘

Type 'go', '1', or '2': _
```

---

**Last Updated**: 2026-01-21
