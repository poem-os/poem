# /triage Command

Unified work intake triage system for routing development work to the appropriate workflow.

## Usage

```bash
/triage                    # Analyze recent conversation
/triage issue-3            # Triage usage issue #3
/triage Add prompt validation  # Triage explicit description
```

## What This Does

Analyzes development work and recommends the optimal workflow path:
- **Quick Fixes** (<1hr, no ceremony)
- **Feature Epic Stories** (new capabilities in Epics 1-7)
- **Epic 0 Stories** (maintenance work >1hr)
- **Existing Stories** (continue AppyDave workflow)
- **Usage Issues** (convert issues to stories/fixes)

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

✅ RECOMMENDED: Quick Fixes (Path #3)
   Category: documentation
   Simple fix, no ceremony needed

   Reason:
   - <1 hour scope (5 minutes)
   - Simple correction, no tests required
   - Direct fix more efficient than story overhead

   Next: /BMad/agents/sm then *add-fix documentation "Fix typo in CONTRIBUTING.md"

   Press Enter or type 'go' to proceed ⏎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔀 Alternatives
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Create Epic 0 Story (if you want formal tracking)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type 'go' for recommended path, '1' for alternative,
or describe what you'd prefer: _
```

---

**Last Updated**: 2026-01-21
