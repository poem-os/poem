# POEM Ideas Parking Lot

**Purpose**: Brainstorming space for enhancement ideas that haven't been promoted to epics yet
**Last Updated**: 2026-02-03

---

## 📋 Governance Rules

**When does an idea become an epic?**
- Effort estimate > 20 hours (3+ days of work)
- Requires multiple stories (3+ stories)
- Significant architectural impact
- Clear business value identified

**When does an idea become a story?**
- Effort estimate 4-20 hours (single story scope)
- Fits within existing epic scope
- Can be implemented independently

**When to archive an idea?**
- Superseded by better approach
- No longer relevant to POEM goals
- Low value relative to effort

**Review Cadence**: Review this list after each epic completion (Epic 4, 5, 6, etc.)

---

## 🎯 High Priority Ideas

### 3. Automated Regression Testing

**Status**: 💡 Idea
**Target**: After Epic 5 (when Victor pattern proven)
**Effort**: 16-24 hours (could be 2-3 stories in Epic 6 or 7)

**What**: Automate Victor's validation workflow in CI/CD pipeline

**Why**: Manual validation (60-90 min per story) doesn't scale. Automate regression detection for faster feedback loops.

**Key Features**:
- GitHub Actions integration
- Automatic snapshot comparison on PR
- Blocking merge on regression detection
- Slack/email notifications for failures
- Daily regression runs against main branch

**Dependencies**:
- Victor pattern proven effective in Epic 4-5
- B72 workflow stable and validated
- CI/CD infrastructure in place

**Promotion Path**:
- If effort > 20 hours → Create Epic 6 or 7
- If effort < 20 hours → Add as story to existing epic

---

### 7. Prompt Version Comparison & Quality Evolution Tracking

**Status**: 💡 Idea (from user testing, 2026-01-11)
**Target**: POEM v1.1 or could fit in Epic 6
**Effort**: 12-20 hours (1.5-2.5 days, could be 2-3 stories)

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
    test_results:
      - scenario: B72
        quality_score: 85/100
        improvements: ["Better CTR potential", "9/10 mobile-optimized"]
```

**Dependencies**:
- Story 3.5 complete (`validate-prompt` for quality scoring)
- Epic 4 complete (runtime execution + result storage)
- Test result persistence (file-based or database)
- Version control for prompt templates

**Promotion Path**: Could become Story 6.X or 7.X if fits existing epic scope

---

## 🔮 Medium Priority Ideas

### 4. Visual Progress Dashboards

**Status**: 💡 Idea
**Target**: POEM v2.0
**Effort**: 24-40 hours (Epic-sized)

**What**: Web-based dashboards for epic progress, workflow coverage, capability integration

**Why**: Stakeholders want visual progress tracking, not markdown files

**Key Features**:
- Epic progress chart (stories complete, % coverage)
- Integration matrix heatmap
- Workflow coverage timeline
- Regression history graph
- Real-time updates via WebSocket

**Dependencies**:
- Victor pattern established
- Metrics collected over multiple epics
- Web UI framework (consider using Astro for consistency)

**Promotion Path**: If validated, create Epic 7 or 8 for "POEM Observability"

---

### 5. Multi-Dataset Validation

**Status**: 💡 Idea
**Target**: After POEM Epic 4
**Effort**: 12-20 hours (2-3 stories)

**What**: Validate POEM capabilities against multiple datasets (B72, Storyline, SupportSignal)

**Why**: Prove that POEM patterns generalize across use cases, not just YouTube workflows

**Key Features**:
- Dataset registry in config
- Cross-dataset capability validation
- Pattern detection across datasets
- Framework generalization metrics
- Automated dataset rotation in tests

**Dependencies**: Epic 4 complete (B72 at 100% coverage)

**Promotion Path**: Could be Story 5.X or 6.X if fits validation epic

---

### 6. AI-Powered Failure Analysis

**Status**: 💡 Idea
**Target**: POEM v2.0 or v3.0
**Effort**: 20-32 hours (Epic-sized)

**What**: Use AI to analyze test failures and suggest fixes automatically

**Why**: Reduce time to diagnose regressions, provide actionable feedback to developers

**Key Features**:
- Analyze diff reports with AI
- Suggest root causes (template change, schema mismatch, data issue)
- Recommend fixes with code snippets
- Generate test cases for edge cases
- Learn from historical failure patterns

**Dependencies**:
- Large dataset of failures and fixes (Epic 4-6)
- AI integration (Claude API or similar)
- Failure classification taxonomy

**Promotion Path**: If validated, create Epic 9+ for "AI-Assisted Quality"

---

## 🌟 Low Priority / Nice to Have

### 8. Predictive Capability Risk Scoring

**Status**: 💡 Idea
**Target**: POEM v3.0
**Effort**: 16-24 hours

**What**: Predict which capabilities are high-risk for integration failures

**Why**: Proactive risk management, prioritize testing efforts on high-risk areas

**Key Features**:
- ML model trained on historical integration failures
- Risk score per capability (low/medium/high)
- Risk factors: complexity, dependencies, LOC changed, test coverage
- Recommendations for additional testing

**Dependencies**: Large dataset of capability integrations (Epic 4-8)

---

### 9. Cross-Project Pattern Detection

**Status**: 💡 Idea
**Target**: BMAD future release (if generalized)
**Effort**: 20-32 hours

**What**: Detect similar capability validation patterns across BMAD projects

**Why**: Share learnings across projects, improve BMAD methodology

**Key Features**:
- Pattern library (common validation workflows)
- Cross-project metrics comparison
- Best practice recommendations
- Pattern reuse suggestions

**Dependencies**: BMAD community adoption, multiple BMAD projects using capability validation

---

### 10. Integration with GitHub Projects/Issues

**Status**: 💡 Idea
**Target**: POEM v2.0
**Effort**: 8-16 hours (1-2 stories)

**What**: Automatically create GitHub issues from Victor's strategic feedback

**Why**: Streamline feedback loop, track resolution in GitHub

**Key Features**:
- Auto-create issues from feedback log
- Tag issues by category (regression, gap, improvement)
- Link issues to story files
- Close issues when resolved
- Sync status bidirectionally

**Dependencies**: GitHub API integration, issue template design

**Promotion Path**: Could be Story 6.X or 7.X if fits integration epic

---

## 📋 Enhancement Proposal Template

When proposing new ideas, copy this template:

```markdown
### [Number]. [Enhancement Name]

**Status**: 💡 Idea
**Target**: [Version or Epic]
**Effort**: [Hours estimate]

**What**: [Brief description - what are we building?]

**Why**: [Problem it solves - why does this matter?]

**Key Features**:
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Dependencies**: [What needs to happen first?]

**Promotion Path**: [When does this become epic/story?]
```

---

## 🗑️ Archived Ideas

*(Ideas that were promoted or discarded - keep for historical context)*

### ~~#1. BMAD Integration - Capability Validation Pattern~~
**Status**: ✅ Promoted to Epic 9 (will be Epic 10 after renumbering)
**Promoted**: 2026-01-09
**Location**: `docs/prd/epic-list.md` (Epic 9)

### ~~#2. Agent Task Format Alignment with BMAD~~
**Status**: ✅ Promoted to Epic 10 (will be Epic 11 after renumbering)
**Promoted**: 2026-01-09
**Location**: `docs/prd/epic-list.md` (Epic 10)

### ~~#11. Multi-Workflow Support~~
**Status**: ✅ Promoted to Epic 9 (will be Epic 10 after renumbering)
**Promoted**: 2026-01-12
**Location**: `docs/prd/epic-list.md` (Epic 9)
**Details**: Stories 3.8 (Phase 1) and 4.9 (Phase 2) in PRD

---

## 🔗 Related Documents

- **Epic List**: `docs/prd/epic-list.md` (single source of truth for epics)
- **Epic Details**: `docs/prd/epic-details.md` (detailed epic specifications)
- **Product Roadmap**: `docs/prd.md` (consolidated PRD)
- **Planning Documents**: `docs/planning/` (exploration, decisions, course corrections)

---

## 💬 How to Use This Document

**Adding Ideas**:
1. Copy the enhancement template
2. Fill in all sections (What, Why, Key Features, Dependencies)
3. Add effort estimate (best guess in hours)
4. Place in appropriate priority section

**Reviewing Ideas**:
- Review after each epic completion
- Promote ideas >20 hours to epics
- Promote ideas 4-20 hours to stories
- Archive ideas that are no longer relevant

**Promoting Ideas**:
1. Update idea status to "✅ Promoted"
2. Move to "Archived Ideas" section with promotion date
3. Create epic in `epic-list.md` OR add story to existing epic
4. Link back to this document for historical context

---

**Document Created**: 2026-02-03 (refactored from `future-enhancements.md`)
**Last Updated**: 2026-02-03
**Maintained By**: POEM Product Team
**Next Review**: After POEM Epic 5 completion
