# Verification Prompt for Fresh Conversation

Copy and paste this into a new Claude Code conversation starting from the POEM directory:

---

I need you to verify a gap analysis that was completed comparing BMAD Core implementations between two projects: POEM and SupportSignal.

**Working Directory**: `/Users/davidcruwys/dev/ad/poem-os/poem`

**Task**: Read the handover document and verify all the work was done correctly.

Please start by reading this handover document:

```
Read: docs/planning/gap-analysis/HANDOVER.md
```

After reading the handover, please:

1. Run all verification commands (Steps 1-4 in the handover)
2. Read and validate all created files against the expected structure
3. Verify the three key concepts:
   - Victor Agent (advanced retrospective agent, applicable to both projects)
   - AppyDave Workflow (6-step orchestration with HALT gates)
   - Lean Context vs Heavy Workflow (orthogonal concepts)
4. Answer the 15 verification questions listed in the handover
5. Report any discrepancies, inconsistencies, or issues found

Focus on:
- Content accuracy (does it represent both BMAD implementations correctly?)
- File structure (3 concepts across 4 files)
- Technical correctness (Victor scope, AppyDave analysis, effort estimates)
- Clarity (are confusing concepts properly clarified?)

Provide a summary report with:
- ✅ What's correct
- ⚠️ What needs attention
- ❌ What's incorrect
- 💡 Suggested improvements

---

**Copy everything above this line into your fresh conversation**
