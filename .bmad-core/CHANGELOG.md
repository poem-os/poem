# BMAD Core - Project-Specific Modifications Changelog

This file tracks changes made to BMAD core files for this specific project. These changes customize the workflow behavior and agent handoffs for the AppyDave workflow.

**Note**: This is NOT the official BMAD framework changelog. This tracks local modifications only.

---

## [Unreleased]

### 2026-01-12 - Workflow Agent Handoff Clarity

**Problem**: Dev agent (James) was jumping to QA (Quinn) instead of SAT (Taylor), breaking the 5-agent workflow chain: Bob → Sarah → James → Taylor → Quinn.

**Changes**:

1. **agents/dev.md**:
   - Added workflow position display on activation: `"🔄 WORKFLOW: Sarah (PO) → JAMES (Dev) → Taylor (SAT)"`
   - Updated completion command to explicitly mention Taylor (SAT) as next agent
   - Added restriction: "DO NOT mention QA, Quinn, or any agent beyond Taylor"
   - Changed completion message to: "✅ Development complete for Story {number}! Ready for Taylor (SAT agent) to create acceptance tests."

2. **agents/sat.md**:
   - Added workflow position display on activation: `"🔄 WORKFLOW: James (Dev) → TAYLOR (SAT) → Quinn (QA)"`
   - Updated create-sat command to include completion message: "✅ SAT guide complete for Story {number}! Ready for Quinn (QA agent) for final review."
   - Added restriction: "DO NOT mention development, implementation, or any agent beyond Quinn"

3. **agents/qa.md**:
   - Added workflow position display on activation: `"🔄 WORKFLOW: Taylor (SAT) → QUINN (QA) → [WORKFLOW END]"`
   - Added explicit declaration: "You are the FINAL agent in the AppyDave workflow"
   - Updated review command to include completion message: "✅ QA review complete for Story {number}. Story workflow finished."
   - Added restriction: "DO NOT mention next agents or next steps - YOU ARE THE FINAL AGENT"

**Rationale**: Each agent now explicitly knows their predecessor and successor in the workflow chain, preventing premature handoffs or skipped agents.

**Impact**:
- Fixes Story 3.7 issue where James jumped directly to Quinn, skipping Taylor
- Makes workflow chain visible during agent activation
- Prevents future sessions from repeating the same handoff errors

**Modified Files**:
- `.bmad-core/agents/dev.md`
- `.bmad-core/agents/sat.md`
- `.bmad-core/agents/qa.md`

---

## Changelog Format

When making future modifications to BMAD core files:

```markdown
### YYYY-MM-DD - Brief Description

**Problem**: What issue was being addressed?

**Changes**:
- File 1: What changed and why
- File 2: What changed and why

**Rationale**: Why this approach?

**Impact**: What does this fix/enable?

**Modified Files**: List of affected files
```

---

**Project**: POEM (Prompt Orchestration and Engineering Method)
**BMAD Version**: v4.44.3
**Last Updated**: 2026-01-12
