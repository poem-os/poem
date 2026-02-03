# POEM Future Enhancements

**Purpose**: High-visibility tracking for future enhancements that extend beyond current epic scope
**Last Updated**: 2026-01-11

---

## 🎯 High Priority

### 1. BMAD Integration: Capability Validation Pattern

**Status**: 📋 Requirements Complete, Proof of Concept Validated
**Target**: BMAD community integration (proposal target: Q2 2026)
**Epic**: Future Epic 10

**What**: Extract POEM's Workflow Validator (Victor) pattern and generalize for BMAD core

**Why**: Framework/tooling/DSL projects need product-level QA that validates capabilities across stories, not just in isolation. Traditional story-level validation isn't enough for cumulative capability building.

**Proof of Concept**: Victor agent successfully validated POEM Epic 3:
- Caught 2 regressions before merge
- Identified 4 capability gaps early
- Generated 11 strategic feedback items
- Tracked cumulative progress from 10% → 40% automation

**Requirements Document**: `GENERALIZED-CAPABILITY-VALIDATION-REQUIREMENTS.md`

**Key Deliverables**:
1. `capability-validator` agent for BMAD core (`.bmad-core/agents/`)
2. Reference workflow definition format
3. Snapshot management utilities
4. Integration matrix tracking
5. Strategic feedback loop
6. Documentation and patterns

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
5. 🚀 Propose to BMAD community for future release integration

**Dependencies**:
- Complete POEM Epic 3 (80% workflow coverage)
- Complete POEM Epic 4 (100% workflow coverage)
- Validate pattern on 2nd project (Klueless or appydave-tools)

**Tracking**:
- Epic List: `docs/prd/epic-list.md` (Epic 9)
- Requirements: `dev-workspace/GENERALIZED-CAPABILITY-VALIDATION-REQUIREMENTS.md`
- POEM Implementation: `.claude/commands/poem/agents/victor.md`
- Guide: `dev-workspace/WORKFLOW-VALIDATION-GUIDE.md`

---

### 2. Agent Task Format Alignment with BMAD

**Status**: ⚠️ Divergent (Tracked for Future Resolution)
**Target**: POEM v1.1 - v2.0 (Q2-Q3 2026)
**Epic**: Future Epic 10

**What**: Address format divergence between POEM agent tasks (YAML) and BMAD tasks (markdown)

**Why**: POEM Epic 3 created custom YAML-based "agent workflows" that guide AI agents through prompt engineering operations (new-prompt, refine-prompt, test-prompt, validate-prompt). These are conceptually identical to BMAD tasks but use a different format.

**Current State**:
- POEM agent tasks: Custom YAML with structured elicitation steps, data storage, validation
- BMAD tasks: Markdown with numbered sections and plain text instructions
- Both solve same problem (guide single agent through steps)
- Different formats create fragmentation and maintenance burden

**The Divergence**:
```yaml
# POEM Agent Task (YAML)
id: validate-prompt
steps:
  - id: select-prompt
    type: elicit
    prompt: "Which prompt?"
    stores: promptName
    validation:
      required: true
```

vs

```markdown
# BMAD Task (Markdown)

## 1. Select Story
- Ask user for story number
- Validate story exists
- Store story path
```

**Decision Document**: `docs/planning/decisions/agent-workflows-vs-bmad-tasks.md`

**Alignment Options**:
1. **Migrate to BMAD markdown format** (lose structured advantages)
2. **Keep YAML, document as domain-specific** (permanent divergence)
3. **Propose YAML task RFC to BMAD community** (contribute improvement)
4. **Hybrid approach** (support both formats)

**Recommended Path**:
- ✅ **Short-term**: Keep YAML agent tasks (Epic 3 complete, works well)
- 📋 **Medium-term**: Propose structured task format RFC to BMAD community
- 🔮 **Long-term**: Align with BMAD community direction

**Key Deliverables**:
1. Architecture documentation: `docs/architecture/agent-tasks.md`
2. RFC for BMAD community (structured task format)
3. Decision on migration vs maintenance based on BMAD community direction
4. Refactor if community adopts YAML (or maintain custom format)

**Dependencies**:
- BMAD future roadmap announcement
- Community feedback on structured task format
- POEM Epic 3 completion (validates pattern effectiveness)

**Effort Estimate**:
- Documentation: 6-8 hours
- RFC creation: 8-12 hours
- Migration (if needed): 16-24 hours

**Tracking**:
- Decision: `docs/planning/decisions/agent-workflows-vs-bmad-tasks.md`
- POEM Agent Tasks: `packages/poem-core/tasks/*.yaml` (Epic 3)
- BMAD Tasks: `.bmad-core/tasks/*.md`

**Next Steps**:
1. ✅ Document divergence (agent-workflows-vs-bmad-tasks.md) - DONE
2. 📝 Create agent-tasks.md architecture doc
3. 📋 Propose RFC to BMAD Discord (Q2 2026)
4. 🔄 Gather community feedback
5. 🎯 Decide on alignment strategy based on BMAD community direction

---

### 11. Multi-Workflow Support (Workspace Context Architecture)

**Status**: 🔄 **In Progress** → Story 3.8 (Phase 1) ready for SM drafting, Story 4.9 (Phase 2) after Epic 4
**Target**: POEM v1.1 (Phase 1+2) → v2.0 (Epic 10 advanced features)
**Discovered**: 2026-01-12 (Story 3.7.1 testing with NanoBanana)
**Course Correction**: `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`

**What**: Build workflow-scoped architecture to support multiple independent workflows within a single POEM workspace.

**Why**: Current POEM architecture assumes one workspace = one flat set of prompts/schemas/data. Real-world usage requires multiple workflows (YouTube Launch, Video Planning, NanoBanana, SupportSignal) sharing a workspace while maintaining isolation and workflow-specific context.

**The Problem**: Users have multiple distinct workflows with:
- Different prompt collections (54 prompts for YouTube Launch vs different set for Video Planning)
- Different schemas and data contracts
- Different source-of-truth reference materials (API docs, domain knowledge)
- Different workflow orchestration logic
- Some shared components (e.g., `generate-title` used by both workflows)

**Implementation Plan**:

**Phase 1 - Story 3.8** (4-6 hours, Epic 3):
- ✅ Workflow-scoped directory structure (`dev-workspace/workflows/<name>/`)
- ✅ Config system with workflow definitions
- ✅ Basic workflow commands: `*workflows`, `*switch`, `*context`
- ✅ Reference config structure (array support for multiple sources)
- ✅ Path resolution and isolation
- ⏭️ Ready for SM to draft when user starts Story 3.8

**Phase 2 - Story 4.9** (4-6 hours, after Epic 4):
- 🔮 Reference materials loading from multiple sources
- 🔮 Priority-based conflict resolution
- 🔮 Shared resource detection
- 🔮 Workflow definition format (based on B72 learnings)
- 🔮 Enhanced commands (--verbose, --reference, --sections, --shared)
- 🔮 Context-aware assistance
- ⏭️ SM will draft after Epic 4 validation complete

**Epic 10 - Future** (Q2-Q3 2026):
- 🔮 Visual workflow editor
- 🔮 Auto-sync from git repositories
- 🔮 Cross-workflow analytics
- 🔮 Workflow templates/marketplace
- 🔮 CI/CD integration

**Key User Insight** (2026-01-12):
> "Reference material could come from more than one directory... it's almost like an array."

Led to `reference: ReferenceConfig[]` array architecture supporting multiple sources (local, second-brain, external) with priority-based conflict resolution.

**Example Configuration**:
```yaml
workspace:
  currentWorkflow: nano-banana
  workflows:
    nano-banana:
      prompts: dev-workspace/workflows/nano-banana/prompts
      schemas: dev-workspace/workflows/nano-banana/schemas
      reference:
        - path: data/nano-banana/reference/
          type: local
          priority: 10
        - path: /ad/brains/nano-banana/
          type: second-brain
          priority: 20
```

**Dependencies**:
- Epic 3 complete (Penny operational) ✅
- Epic 4 validation (proves B72 workflow end-to-end)
- Requirements from multiple use cases validated

**Effort Estimate**:
- Phase 1: 4-6 hours
- Phase 2: 4-6 hours
- Epic 10: 40-60 hours

**Tracking**:
- Stories: `docs/prd/epic-details.md` (Story 3.8, Story 4.9)
- Epic: `docs/prd/epic-list.md` (Epic 10)
- Architecture: `docs/architecture/data-models.md` (WorkflowDefinition model)
- Course Correction: `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`

---

## 🔮 Medium Priority

### 3. Automated Regression Testing

**Status**: 💡 Idea
**Target**: POEM v2.0 or Epic 6-7

**What**: Automate Victor's validation workflow in CI/CD pipeline

**Why**: Manual validation (60-90 min per story) doesn't scale. Automate regression detection.

**Key Features**:
- GitHub Actions integration
- Automatic snapshot comparison
- Blocking merge on regression
- Slack/email notifications

**Dependencies**: Victor pattern proven effective in Epic 3-4

---

### 4. Visual Progress Dashboards

**Status**: 💡 Idea
**Target**: POEM v2.0

**What**: Web-based dashboards for epic progress, workflow coverage, capability integration

**Why**: Stakeholders want visual progress tracking, not markdown files

**Key Features**:
- Epic progress chart (stories complete, % coverage)
- Integration matrix heatmap
- Workflow coverage timeline
- Regression history graph

**Dependencies**: Victor pattern established, metrics collected

---

### 5. Multi-Dataset Validation

**Status**: 💡 Idea
**Target**: After POEM Epic 4

**What**: Validate POEM capabilities against multiple datasets (B72, Storyline, SupportSignal)

**Why**: Prove that POEM patterns generalize across use cases

**Key Features**:
- Dataset registry in config
- Cross-dataset capability validation
- Pattern detection across datasets
- Framework generalization metrics

**Dependencies**: Epic 4 complete (B72 at 100%)

---

### 6. AI-Powered Failure Analysis

**Status**: 💡 Idea
**Target**: POEM v2.0 or v3.0

**What**: Use AI to analyze test failures and suggest fixes automatically

**Why**: Reduce time to diagnose regressions, provide actionable feedback

**Key Features**:
- Analyze diff reports with AI
- Suggest root causes
- Recommend fixes
- Generate test cases for edge cases

**Dependencies**: Large dataset of failures and fixes (Epic 3-5)

---

### 7. Prompt Version Comparison & Quality Evolution Tracking

**Status**: 💡 Idea (from Victor validation insights)
**Target**: POEM v1.1 or Epic 6
**Suggested By**: User testing B72 prompts (2026-01-11)

**What**: Track prompt quality improvements across refinement iterations with version history and quality metrics.

**Why**: Users refine prompts iteratively (e.g., generate-title v1.0 → v1.1 → v1.2). Currently no system to:
- Compare quality scores between versions
- Track what changed and why
- Prove refinements actually improved output
- Understand which refinement strategies work

**Example Use Case**:
1. User runs `test-prompt` on generate-title v1.0 with B72 data → Quality: 70/100
2. User runs `refine-prompt` (adds time-based hooks, front-loads keywords)
3. User runs `test-prompt` on generate-title v1.1 with same B72 data → Quality: 85/100
4. User asks: "Did my refinement improve output quality? What changed?"
5. System shows: "+15 points due to time-based hooks, better mobile optimization"

**Current State**:
- Manual tracking in `B72-VIDEO-TESTING-GUIDE.md` (testing results template)
- No automated version comparison
- Quality assessment is subjective and not tracked over time

**Proposed Solution**:
- Add `compare-prompt-versions` workflow (after Story 3.5)
- Store test results with version metadata (version, date, refinements made)
- Generate before/after comparison reports
- Track refinement → improvement correlation
- Support both quantitative metrics (char counts, schema validation) and qualitative metrics (relevance, clarity)

**Key Features**:
- Version history for each prompt (v1.0, v1.1, v1.2, etc.)
- Side-by-side output comparison (diff view)
- Quality score tracking over time (line chart)
- Refinement notes with each version (what changed and why)
- A/B testing support (compare two refinement strategies)
- Rollback capability (revert to previous version if quality drops)

**Data Structure**:
```yaml
prompt: generate-title
versions:
  - version: 1.0
    date: 2026-01-07
    created_by: new-prompt workflow
    test_results:
      - scenario: B72
        quality_score: 70/100
        output_length: 450 chars
        issues: ["Titles too generic", "Missing time hooks"]

  - version: 1.1
    date: 2026-01-11
    created_by: refine-prompt workflow
    refinements:
      - "Added time-based hooks (20 minutes, 3 minutes)"
      - "Front-loaded keywords in titles"
      - "Emphasized model name (Opus 4.5)"
    test_results:
      - scenario: B72
        quality_score: 85/100
        output_length: 480 chars
        improvements: ["Better CTR potential", "9/10 mobile-optimized"]
```

**Dependencies**:
- Story 3.5 complete (`validate-prompt` for quality scoring)
- Epic 4 complete (runtime execution + result storage)
- Test result persistence (database or file-based)
- Version control for prompt templates (git-like tracking)

**Effort Estimate**: 12-20 hours (1.5-2.5 days)

**Tracking**:
- Related to Epic 3 workflows (new-prompt, refine-prompt, test-prompt, validate-prompt)
- Could become Story 3.6 or part of Epic 6

---

## 🌟 Low Priority / Nice to Have

### 8. Predictive Capability Risk Scoring

**Status**: 💡 Idea
**Target**: POEM v3.0

**What**: Predict which capabilities are high-risk for integration failures

**Why**: Proactive risk management, prioritize testing efforts

---

### 9. Cross-Project Pattern Detection

**Status**: 💡 Idea
**Target**: BMAD future release

**What**: Detect similar capability validation patterns across BMAD projects

**Why**: Share learnings across projects, improve BMAD methodology

---

### 10. Integration with GitHub Projects/Issues

**Status**: 💡 Idea
**Target**: POEM v2.0

**What**: Automatically create GitHub issues from Victor's feedback

**Why**: Streamline feedback loop, track resolution in GitHub

---

## 📋 Enhancement Proposal Template

When proposing new enhancements, use this template:

```markdown
### [Number]. [Enhancement Name]

**Status**: 💡 Idea | 📋 Requirements | 🔄 In Progress | ✅ Complete
**Target**: [Version or Epic]

**What**: [Brief description]

**Why**: [Problem it solves]

**Key Features**:
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Dependencies**: [What needs to happen first]

**Effort Estimate**: [Hours or days]

**Tracking**: [Links to docs, issues, PRDs]
```

---

## 🔗 Related Documents

- **Epic List**: `docs/prd/epic-list.md`
- **Product Roadmap**: `docs/prd.md`
- **Architecture**: `docs/architecture.md`
- **BMAD User Guide**: `.bmad-core/user-guide.md`
- **Victor Agent**: `.claude/commands/poem/agents/victor.md`
- **Validation Guide**: `dev-workspace/WORKFLOW-VALIDATION-GUIDE.md`

---

## 💬 Feedback & Discussion

To propose new enhancements or discuss existing ones:

1. **Update this document** with your enhancement idea
2. **Create GitHub issue** if it's high priority
3. **Discuss in BMAD Discord** for methodology changes
4. **Add to Epic backlog** if approved

---

**Document Created**: 2026-01-09
**Last Updated**: 2026-01-11
**Maintained By**: POEM Product Team
**Next Review**: After POEM Epic 3 completion
