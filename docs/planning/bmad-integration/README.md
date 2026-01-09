# BMAD Integration Planning

This directory contains planning documents for generalizing POEM patterns into BMAD core.

## Capability Validation Requirements

**File**: `capability-validation-requirements.md`

**Status**: 📋 Requirements Complete, Proof of Concept Validated

**Target**: BMAD v5.0.0 (Q2 2026)

**What**: Extract POEM's Workflow Validator (Victor) pattern and generalize for BMAD core as a reusable "Capability Validation Pattern" for framework/tooling/DSL projects.

**Why**: Traditional BMAD validates stories in isolation. For framework/tooling projects that build cumulative capabilities, we need product-level validation that maintains context across stories and ensures trajectory toward automation goals.

**Proof of Concept**: Victor agent in POEM successfully validated Epic 3:
- Caught 2 regressions before merge
- Identified 4 capability gaps early
- Generated 11 strategic feedback items
- Tracked cumulative progress from 10% → 40% automation

**Key Sections**:
1. Executive Summary - Problem, solution, proof of concept
2. Pattern Applicability - When to use, example projects
3. Architecture Overview - 6-step validation cycle
4. Configuration Schema - YAML extensions for `.bmad-core/core-config.yaml`
5. Agent Definition Requirements - `capability-validator` agent spec
6. Workflow Definitions - 4 YAML workflows
7. Data Models - Reference workflow, capability, test result schemas
8. Integration with BMAD - Enhanced workflow, timing, feedback loop
9. Implementation Roadmap - 6 phases, 32-46 hours total
10. Success Criteria - Must have, should have, nice to have
11. Migration Path - For existing and new projects
12. Open Questions - Technical, process, product

**Applicable To**:
- Klueless (DSL validation against code generation templates)
- appydave-tools (CLI validation against multi-step workflows)
- BMAD itself (methodology validation against real projects)
- Any framework/tooling project with cumulative capabilities

**Effort Estimate**: 32-46 hours (4-6 full days)

**Next Steps**:
1. ✅ Complete POEM-specific implementation (Victor) - DONE
2. 🔄 Validate pattern through POEM Epic 3-4 - IN PROGRESS
3. 📊 Collect metrics and learnings
4. 📝 Refine requirements based on POEM experience
5. 🚀 Propose to BMAD community for v5.0 integration

**Tracking**:
- Epic 8: `docs/prd/epic-list.md`
- Future Enhancements: `docs/future-enhancements.md`

---

**Last Updated**: 2026-01-09
