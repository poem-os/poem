# BMAD Core Gap Analysis: POEM vs SupportSignal

**Date**: 2026-01-20
**Comparison**: POEM OS vs SupportSignal BMAD implementations
**BMAD Version**: Both running v4.44.3
**Purpose**: Identify strengths, gaps, and cross-pollination opportunities

---

## Executive Summary

Both projects run **BMAD v4.44.3** with clean installations and strategic customizations. Each has evolved unique strengths:

- **POEM**: Innovation laboratory with Victor agent (product-level QA), maintenance backlog system, and minimal-but-strategic customizations
- **SupportSignal**: Enterprise rigor with 8 devLoadAlwaysFiles, comprehensive KDD integration, and pattern-driven development

**Key Finding**: These are complementary implementations - POEM pushes BMAD boundaries (Victor, capability validation), while SupportSignal demonstrates production-grade execution (comprehensive context, systematic quality).

---

## Side-by-Side Comparison Matrix

| Aspect | POEM OS | SupportSignal | Winner |
|--------|---------|---------------|---------|
| **Installation** |
| BMAD Version | 4.44.3 (2025-11-22) | 4.44.3 (2026-01-06) | Tie |
| Total Files | 79 core + 35 integration | 93 core + 14 integration | SS |
| Total Size | 816 KB core | 1.0 MB core | SS |
| Total Lines | 11,200 | 20,614 | SS |
| Files Tracked | 230+ | 315+ | SS |
| **Agents** |
| Core Agents | 11 standard | 13 standard | SS |
| Custom Agents | Victor (product QA), Penny | SAT/Taylor, Repo-sync, Tester | SS |
| Agent Innovation | ⭐ Victor (game-changer) | SAT integration | POEM |
| Agent Size | ~180 KB | 74 KB | POEM (more compact) |
| **Tasks** |
| Task Count | 26 | 27 | SS |
| Custom Tasks | Victor workflows | create-sat.md | Tie |
| Average Task Size | ~200 lines | 181 lines | Similar |
| Largest Task | execute-appydave-workflow (409) | document-project (13K) | SS |
| **Configuration** |
| devLoadAlwaysFiles | 3 files | 8 files | SS (context) |
| Maintenance Backlog | ✅ Yes (categories) | ❌ No | POEM |
| Quality Focus | Testing + validation | KDD + patterns + testing | SS (breadth) |
| **Templates** |
| Template Count | 13 | 18 | SS |
| Coverage | Standard set | + GitHub issue templates | SS |
| **Workflows** |
| Workflow Files | 6 | 6 | Tie |
| Workflow Routing | Standard | Conditional routing by scope | SS |
| **Checklists** |
| Checklist Count | 6 | 8 | SS |
| Total Checklist Size | ~50 KB | 88 KB | SS (detail) |
| Unique Checklists | - | kdd-validation, worktree-handoff | SS |
| **Knowledge Base** |
| KB Files | 5 | 7 | SS |
| KB Size | 60 KB | 50 KB | POEM (more concise) |
| Unique Content | - | estimation-guidelines.md | SS |
| **Documentation** |
| Core Guides | 3 (57 KB) | 3 (~100 KB) | SS (detail) |
| Custom Guides | workflow-validation-guide.md | - | POEM |
| Quality | Excellent | Excellent | Tie |
| **Innovation** |
| Product-Level QA | ⭐ Victor agent | - | POEM |
| Capability Validation | ⭐ B72 workflow testing | - | POEM |
| Cumulative Progress | ⭐ Cross-story tracking | - | POEM |
| Strategic Feedback | ⭐ For story planning | - | POEM |
| Maintenance System | ⭐ Lightweight backlog | - | POEM |
| KDD Integration | Basic | ⭐ Comprehensive (8 files) | SS |
| Pattern Library | Basic | ⭐ Backend + testing patterns | SS |
| Testing Infrastructure | Standard | ⭐ Lessons learned + strategy | SS |
| **Customization Philosophy** |
| Approach | Minimal, strategic (2-3 key) | Thoughtful enhancements | POEM (lean) |
| CHANGELOG | ✅ Tracked | ✅ Tracked | Tie |
| Backward Compat | ✅ Yes | ✅ Yes | Tie |

---

## POEM OS: Unique Strengths

### 🏆 Innovation: Victor Agent (Product-Level QA)

**What it is**: Capability Progression Validation agent that validates stories in context, not isolation.

**Capabilities**:
- Multi-story context maintenance (stories 1..N-1 inform story N)
- Real-world workflow validation (B72 YouTube Launch - 54 prompts, 5 phases)
- Cumulative progress tracking (10% → 40% → 80% automation)
- Strategic feedback generation for future story planning
- Regression prevention through workflow snapshots
- Integration matrix tracking

**Why it matters**:
- Traditional BMAD validates stories in isolation (SM → Dev → QA)
- Victor adds **product-level QA layer** - validates cumulative capability
- Catches integration issues BMAD agents miss
- Generates insights for BMAD story planning (feedback loop)

**Output Artifacts** (transient in `dev-workspace/`):
- Cumulative test reports
- B72 workflow snapshots (time-travel debugging)
- Integration matrix
- Strategic feedback log

**Future Impact**: Pattern being generalized for BMAD future release as "Capability Validator" agent.

**Reference**:
- Agent: `.claude/agents/victor.md` (387 lines)
- Guide: `docs/guides/workflow-validation-guide.md`
- Requirements: `docs/planning/bmad-integration/capability-validation-requirements.md`

---

### 🏆 Lightweight Task Management: Maintenance Backlog

**What it is**: Category-based backlog system for non-story work.

**Configuration** (`core-config.yaml`):
```yaml
maintenance:
  backlogFile: docs/backlog/maintenance.md
  categories: [infrastructure, tech-debt, documentation, bugs]
```

**Why it matters**:
- Not everything needs full story ceremony
- Reduces overhead for quick fixes, docs updates, infra tasks
- Clear categorization for prioritization
- Separate from formal story workflow

**Use Cases**:
- Fix typo in docs → Documentation
- Update dependencies → Infrastructure
- Refactor helper function → Tech-debt
- Fix minor bug → Bugs

**Gap in SupportSignal**: No lightweight task system (everything is story-sized).

---

### 🏆 Minimal Customization Philosophy

**Approach**: Only 2-3 strategic customizations to BMAD core.

**Changes**:
1. Workflow chain clarity (prevents skipped agents)
2. Victor agent (product-level QA)
3. Maintenance backlog system

**Why it matters**:
- Preserves upgrade path to future BMAD versions
- Clear separation: what's core vs custom
- Easier to maintain and debug
- Less cognitive overhead

**Contrast**: SupportSignal has more customizations (13 agents, 8 devLoadAlwaysFiles, extensive patterns).

---

### 🏆 Focused Developer Context

**Configuration**: 3 devLoadAlwaysFiles (vs SupportSignal's 8)

```yaml
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
```

**Why it matters**:
- Lean context = faster agent loading
- Focused on essentials: standards, stack, structure
- Reduces cognitive load for developers
- Less context pollution

**Trade-off**: Less comprehensive than SupportSignal, but more targeted.

---

### 🏆 Innovation Documentation

**Unique Docs**:
- `docs/guides/workflow-validation-guide.md` - Victor agent usage
- `docs/planning/bmad-integration/capability-validation-requirements.md` - Future BMAD integration
- `docs/future-enhancements.md` - Epic 9 (BMAD Integration) tracking

**Why it matters**:
- Documents innovations for future BMAD versions
- Clear roadmap for capability validation in BMAD future release
- Shows path from project-specific to framework-level features

---

## SupportSignal: Unique Strengths

### 🏆 Comprehensive Developer Context

**Configuration**: 8 devLoadAlwaysFiles (vs POEM's 3)

```yaml
devLoadAlwaysFiles:
  - docs/methodology/kdd-complete-guide.md
  - docs/patterns/backend-patterns.md
  - docs/patterns/testing-patterns.md
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
  - docs/testing/technical/testing-infrastructure-lessons-learned.md
  - docs/testing/technical/test-strategy-and-standards.md
```

**Why it matters**:
- **KDD integration** - Complete methodology guide always available
- **Pattern library** - Proven backend and testing patterns at fingertips
- **Testing rigor** - Infrastructure lessons + comprehensive strategy
- **Quality culture** - Standards embedded in workflow, not afterthought

**Use Cases**:
- Dev implements feature → Automatically references backend patterns
- QA reviews code → Testing strategy already loaded
- New dev onboards → KDD guide provides methodology context

**Gap in POEM**: Minimal context (3 files) - relies on developers to seek patterns.

---

### 🏆 Enterprise-Grade Quality System

**8 Checklists (88 KB)** vs POEM's 6 (50 KB):
- `story-dod-checklist.md` (5.8K)
- `story-draft-checklist.md` (5.9K)
- `architect-checklist.md` (18K) ⭐ Largest
- `po-master-checklist.md` (16K) ⭐ Second largest
- `pm-checklist.md` (13K)
- `kdd-validation-checklist.md` (7.1K) ⭐ Unique
- `change-checklist.md` (8.2K)
- `worktree-handoff-checklist.md` (5.9K) ⭐ Unique

**Why it matters**:
- **KDD validation** - Explicit checklist for knowledge-driven patterns
- **Worktree management** - Git workflow quality gates
- **Comprehensive gates** - 18K architect checklist covers every dimension
- **Systematic quality** - Not ad-hoc, not optional

**Gap in POEM**: Standard BMAD checklists without KDD emphasis.

---

### 🏆 KDD Methodology Integration

**KDD-Specific Assets**:
- `docs/methodology/kdd-complete-guide.md` (always loaded)
- `checklists/kdd-validation-checklist.md` (7.1K)
- Task: `capture-kdd-knowledge.md` (7.4K)
- KDD validation in story workflow

**Why it matters**:
- **Systematic learning** - Patterns captured during development
- **Knowledge artifacts** - Not just code, but understanding
- **Quality validation** - KDD compliance checked before completion
- **Team learning** - Knowledge shared via documented patterns

**Philosophy**: Code + knowledge as dual outputs of development.

**Gap in POEM**: Basic BMAD knowledge capture, no KDD-specific workflow.

---

### 🏆 Pattern-Driven Development

**Pattern Library**:
- `docs/patterns/backend-patterns.md` (always loaded)
- `docs/patterns/testing-patterns.md` (always loaded)
- Patterns referenced in stories and tasks

**Why it matters**:
- **Consistency** - Same problems solved same way
- **Velocity** - Don't reinvent, apply proven patterns
- **Quality** - Patterns embody lessons learned
- **Onboarding** - Patterns teach system design

**Examples**:
- Backend: Repository pattern, service layer, error handling
- Testing: Test doubles, fixtures, integration test patterns

**Gap in POEM**: No explicit pattern library (relies on architecture docs).

---

### 🏆 Testing Infrastructure Maturity

**Testing Assets**:
- `docs/testing/technical/testing-infrastructure-lessons-learned.md` (always loaded)
- `docs/testing/technical/test-strategy-and-standards.md` (always loaded)
- `checklists/story-dod-checklist.md` includes testing gates
- Multiple test-focused tasks (test-design, nfr-assess, trace-requirements)

**Why it matters**:
- **Lessons learned** - Explicit documentation of testing failures and fixes
- **Strategy first** - Test design before test writing
- **NFR validation** - Quality attributes (performance, security) explicitly checked
- **Traceability** - Requirements-to-tests mapping

**Philosophy**: Testing is architecture, not afterthought.

**Gap in POEM**: Standard BMAD testing, no specialized testing infrastructure docs.

---

### 🏆 Conditional Workflow Routing

**Feature**: Brownfield workflows route based on scope/complexity.

**Example** (`brownfield-fullstack.yaml`):
```
Enhancement Type Assessment:
├── Single story fix → Direct to Dev
├── Small feature (2-5 stories) → Create feature epic
└── Major enhancement (6+ stories) → Architecture review + epic planning
```

**Why it matters**:
- **Right-sized ceremony** - Big changes get planning, small changes don't
- **Efficiency** - No process overhead for trivial work
- **Risk management** - Complex work gets architecture validation

**Gap in POEM**: Standard workflows without scope-based routing.

---

### 🏆 Additional Agents (13 vs POEM's 11)

**Extra Agents**:
1. **TestBot (Test-Dev)** (7.7K) - Automated test framework setup, CI/CD config
2. **Worktree Manager** (6.9K) - Git worktree and branch management

**Why they matter**:
- **TestBot** - Systematizes test infrastructure setup (Jest, Vitest, Playwright)
- **Worktree Manager** - Prevents git workflow issues in complex branching

**Gap in POEM**: No specialized test automation or git workflow agents.

---

### 🏆 More Templates (18 vs POEM's 13)

**Extra Templates**:
- `claude-issue-bug.md` - GitHub bug template
- `claude-issue-feature.md` - GitHub feature template
- `claude-issue-feedback.md` - GitHub feedback template
- `toc-update-tmpl.md` - Table of contents updates
- `uat-simple-tmpl.yaml` - User acceptance test plan

**Why it matters**:
- **GitHub integration** - Standardized issue creation
- **Documentation maintenance** - TOC updates templated
- **UAT planning** - Separate from SAT (different audiences)

**Gap in POEM**: Basic template set without GitHub/UAT extensions.

---

### 🏆 Knowledge Base Depth

**7 KB Files (vs POEM's 5)**:
- `bmad-kb.md` (31K) ⭐ Largest
- `elicitation-methods.md` (5.0K)
- `test-levels-framework.md` (3.4K)
- `test-priorities-matrix.md` (3.9K)
- `brainstorming-techniques.md` (1.9K)
- `estimation-guidelines.md` (2.2K) ⭐ Unique
- `technical-preferences.md` (97B)

**Unique**: Estimation guidelines for story pointing.

**Why it matters**: Comprehensive reference material for all agents.

---

## Gap Analysis: What Each Could Learn

### POEM → Could Adopt from SupportSignal

#### 1. KDD Integration (High Priority)

**What**: Comprehensive knowledge-driven development workflow.

**Assets to Port**:
- `docs/methodology/kdd-complete-guide.md` (add to devLoadAlwaysFiles)
- `checklists/kdd-validation-checklist.md`
- Task: `capture-kdd-knowledge.md`

**Why**:
- POEM is a knowledge management system (prompts, schemas, mappings)
- KDD methodology aligns perfectly with POEM's mission
- Explicit knowledge capture would improve POEM documentation

**Implementation**:
```yaml
# Add to core-config.yaml
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
  - docs/methodology/kdd-complete-guide.md  # NEW
```

**Effort**: Medium (adapt SupportSignal KDD guide to POEM context).

---

#### 2. Pattern Library (Medium Priority)

**What**: Documented backend and testing patterns as devLoadAlwaysFiles.

**Assets to Port**:
- `docs/patterns/backend-patterns.md`
- `docs/patterns/testing-patterns.md`

**Why**:
- POEM development would benefit from consistent patterns
- Reduces reinvention and decision fatigue
- Improves code quality and consistency

**Implementation**:
1. Create `docs/patterns/` directory
2. Document POEM-specific patterns (e.g., schema generation, mock data patterns)
3. Add to devLoadAlwaysFiles

**Effort**: Medium (requires pattern identification and documentation).

---

#### 3. Testing Infrastructure Lessons (Medium Priority)

**What**: Explicit documentation of testing failures, fixes, and strategies.

**Assets to Port**:
- `docs/testing/technical/testing-infrastructure-lessons-learned.md`
- `docs/testing/technical/test-strategy-and-standards.md`

**Why**:
- POEM has complex testing needs (schemas, workflows, CLI, web app)
- Learning from failures prevents repeat mistakes
- Test strategy upfront prevents rework

**Implementation**:
1. Create `docs/testing/` directory
2. Document POEM testing challenges and solutions
3. Add to devLoadAlwaysFiles

**Effort**: Low-Medium (document as issues arise, evolve over time).

---

#### 4. Conditional Workflow Routing (Low Priority)

**What**: Scope-based routing in brownfield workflows.

**Why**:
- POEM will have enhancements of varying sizes
- Right-sized ceremony for each enhancement type
- Efficiency gains for small changes

**Implementation**:
- Adopt SupportSignal's `brownfield-fullstack.yaml` structure
- Customize routing thresholds for POEM context

**Effort**: Low (copy and adapt workflow file).

---

#### 5. Additional Agents (Low Priority)

**What**: TestBot (Test-Dev) and Worktree Manager agents.

**Why**:
- TestBot: POEM has multi-package testing needs (Vitest, Playwright)
- Worktree Manager: POEM may use worktree workflow for parallel dev

**Implementation**:
- Copy `agents/test-dev.md` and `agents/worktree-manager.md`
- Adapt to POEM testing stack

**Effort**: Low (copy and minor edits).

---

#### 6. Estimation Guidelines (Low Priority)

**What**: Story point estimation framework.

**Why**:
- POEM backlog planning would benefit from consistent estimates
- Helps with sprint planning and velocity tracking

**Implementation**:
- Copy `data/estimation-guidelines.md`
- Add to knowledge base

**Effort**: Very Low (copy file).

---

### SupportSignal → Could Adopt from POEM

#### 1. Victor Agent / Product-Level QA (High Priority)

**What**: Capability Progression Validation - validates stories in cumulative context.

**Assets to Port**:
- `.claude/agents/victor.md` (387 lines)
- `docs/guides/workflow-validation-guide.md`
- Victor's commands: `*validate`, `*regression`, `*progress-report`

**Why**:
- **SupportSignal has complex integration needs** (Convex backend, Next.js frontend, shift-note workflows)
- Traditional story-by-story QA misses integration issues
- Victor would validate SupportSignal workflows (e.g., "narrative enhancement" end-to-end)
- Cumulative progress tracking shows velocity toward product goals

**SupportSignal Use Cases**:
- Validate "shift note creation → narrative enhancement → PDF generation" workflow
- Track cumulative progress toward "fully automated shift note creation"
- Regression testing across 10+ integrated stories
- Integration matrix for frontend/backend capability alignment

**Implementation**:
1. Copy Victor agent to `.claude/agents/victor.md`
2. Create `docs/guides/workflow-validation-guide.md`
3. Identify SupportSignal "reference workflow" (analogous to POEM's B72)
4. Define capability progression milestones
5. Create `dev-workspace/` for transient validation artifacts

**Effort**: Medium-High (requires defining SupportSignal reference workflow).

**Impact**: ⭐⭐⭐⭐⭐ - Would catch integration issues BMAD agents miss.

---

#### 2. Maintenance Backlog System (Medium Priority)

**What**: Lightweight category-based backlog for non-story work.

**Assets to Port**:
- `core-config.yaml` maintenance section
- Categories: infrastructure, tech-debt, documentation, bugs

**Why**:
- **SupportSignal has daily operational tasks** (dependency updates, bug fixes, docs)
- Not everything needs story ceremony (overhead for 5-minute fixes)
- Clear prioritization via categories

**Implementation**:
```yaml
# Add to core-config.yaml
maintenance:
  backlogFile: docs/backlog/maintenance.md
  categories: [infrastructure, tech-debt, documentation, bugs, convex-updates]
```

**Effort**: Low (add config + create backlog file).

**Impact**: ⭐⭐⭐ - Reduces ceremony for small tasks.

---

#### 3. Focused devLoadAlwaysFiles (Low Priority)

**What**: Reduce from 8 to 5-6 files for faster agent loading.

**Current** (8 files):
- docs/methodology/kdd-complete-guide.md
- docs/patterns/backend-patterns.md
- docs/patterns/testing-patterns.md
- docs/architecture/coding-standards.md
- docs/architecture/tech-stack.md
- docs/architecture/source-tree.md
- docs/testing/technical/testing-infrastructure-lessons-learned.md
- docs/testing/technical/test-strategy-and-standards.md

**Proposed** (5 files - essential only):
- docs/methodology/kdd-complete-guide.md (keep - KDD is core)
- docs/architecture/coding-standards.md (keep - essential)
- docs/architecture/tech-stack.md (keep - essential)
- docs/architecture/source-tree.md (keep - essential)
- docs/patterns/consolidated-patterns.md (NEW - merge backend + testing)

**Rationale**:
- Faster agent context loading
- Patterns can be consolidated into single file
- Testing docs can be referenced on-demand (not always-load)

**Trade-off**: Less comprehensive, but more performant.

**Effort**: Low (consolidate patterns, update config).

**Impact**: ⭐⭐ - Minor performance gain, may reduce quality.

**Recommendation**: Keep current approach (comprehensive > fast).

---

#### 4. Innovation Documentation Pattern (Low Priority)

**What**: Document innovations for future BMAD framework integration.

**Assets to Port**:
- `docs/future-enhancements.md` pattern
- `docs/planning/bmad-integration/` directory structure

**Why**:
- SupportSignal has innovations (KDD integration, comprehensive QA, pattern library)
- These could be contributed back to BMAD framework
- Documentation ensures patterns are reusable

**Implementation**:
1. Create `docs/future-enhancements.md`
2. Document SupportSignal-specific BMAD innovations
3. Create `docs/planning/bmad-integration/` for framework proposals

**Effort**: Low (documentation exercise).

**Impact**: ⭐ - Enables future BMAD contributions.

---

## Recommendations by Priority

### For POEM OS

| Priority | Recommendation | Effort | Impact | Timeline |
|----------|---------------|--------|--------|----------|
| 🔥 High | Adopt KDD Integration | Medium | ⭐⭐⭐⭐ | Epic 6 (System Agent) |
| 🔥 High | Create Pattern Library | Medium | ⭐⭐⭐⭐ | Epic 7 (Integration Agent) |
| 🟡 Medium | Port Testing Infrastructure Docs | Low-Med | ⭐⭐⭐ | Epic 8 (Mock/Test Data) |
| 🟡 Medium | Conditional Workflow Routing | Low | ⭐⭐ | Epic 9 (BMAD Integration) |
| 🟢 Low | Add TestBot Agent | Low | ⭐⭐ | Backlog |
| 🟢 Low | Add Estimation Guidelines | Very Low | ⭐ | Backlog |

**Focus**: KDD + Patterns → POEM's knowledge management mission.

---

### For SupportSignal

| Priority | Recommendation | Effort | Impact | Timeline |
|----------|---------------|--------|--------|----------|
| 🔥 High | Adopt Victor Agent (Product-Level QA) | Med-High | ⭐⭐⭐⭐⭐ | Q1 2026 |
| 🟡 Medium | Add Maintenance Backlog System | Low | ⭐⭐⭐ | Q1 2026 |
| 🟢 Low | Document Innovations for BMAD | Low | ⭐ | Q2 2026 |
| ⚪ Consider | Reduce devLoadAlwaysFiles | Low | ⭐ | Optional |

**Focus**: Victor agent → Integration quality + cumulative progress tracking.

---

## Synthesis: Complementary Strengths

### POEM OS Philosophy
- **Innovation Laboratory** - Pushes BMAD boundaries (Victor, capability validation)
- **Minimal Customization** - Strategic changes only (2-3 key modifications)
- **Lean Context** - Focused devLoadAlwaysFiles (3 files)
- **Product-Level QA** - Validates cumulative capability, not just per-story
- **Future-Focused** - Documents innovations for BMAD future release integration

**Archetype**: Experimental, innovative, lean.

---

### SupportSignal Philosophy
- **Enterprise Rigor** - Comprehensive quality system (8 checklists, 88 KB)
- **KDD Integration** - Knowledge as first-class artifact (methodology + patterns)
- **Pattern-Driven** - Backend and testing patterns always available
- **Testing Maturity** - Lessons learned + comprehensive strategy
- **Comprehensive Context** - 8 devLoadAlwaysFiles ensure full understanding

**Archetype**: Production-grade, systematic, comprehensive.

---

### Together: Best of Both Worlds

**Ideal BMAD Implementation** (hypothetical fusion):

```
Victor Agent (POEM)
  ↓ validates
Story Lifecycle (BMAD v4.44.3)
  ├── SM creates story (SupportSignal checklists)
  ├── Dev implements (SupportSignal patterns + KDD)
  ├── QA reviews (SupportSignal testing strategy)
  └── Victor validates cumulative capability (POEM)
       ↓
Maintenance Backlog (POEM)
  ├── Small tasks (no story ceremony)
  └── Categories (infra, tech-debt, docs, bugs)
```

**Context Loading**:
- Essential: coding-standards, tech-stack, source-tree (both)
- Methodology: kdd-complete-guide (SupportSignal)
- Patterns: backend-patterns, testing-patterns (SupportSignal)
- Strategy: test-strategy (SupportSignal)

**Result**: POEM's innovation + SupportSignal's rigor = production-grade system with product-level quality validation.

---

## Conclusion

**POEM** and **SupportSignal** represent two evolutionary branches of BMAD v4.44.3:

- **POEM** → Innovation frontier (Victor agent, capability validation, lean customization)
- **SupportSignal** → Enterprise maturity (KDD, patterns, comprehensive testing)

**Gap Analysis Verdict**:
- Neither is "better" - they solve different problems
- **POEM** shows where BMAD is going (capability validation innovation)
- **SupportSignal** shows BMAD at production scale (KDD + patterns + rigor)

**Recommended Exchange**:
- **POEM adopts**: KDD integration, pattern library, testing infrastructure
- **SupportSignal adopts**: Victor agent (product-level QA), maintenance backlog

**Future State**: Both projects contribute innovations back to BMAD framework (POEM's Victor → BMAD future release, SupportSignal's KDD integration → BMAD expansion pack).

---

## Appendix: File Counts

### POEM OS
- **Core Files**: 79 (.bmad-core/)
- **Integration**: 35 (.claude/)
- **Total Lines**: 11,200
- **Total Size**: 816 KB
- **Custom Agents**: Victor (387 lines), Penny
- **Custom Tasks**: Victor workflows
- **Unique Features**: Product-level QA, maintenance backlog

### SupportSignal
- **Core Files**: 93 (.bmad-core/)
- **Integration**: 14 (.claude/)
- **Total Lines**: 20,614
- **Total Size**: 1.0 MB
- **Custom Agents**: SAT/Taylor, TestBot, Worktree Manager, Repo-sync, Tester
- **Custom Tasks**: create-sat.md
- **Unique Features**: KDD integration, pattern library, comprehensive testing infrastructure

---

## POEM Innovation: Work Intake Triage System

**Date Added**: 2026-01-21
**Story**: 0.1 - Work Intake Triage System
**Status**: Implemented ✅

### Innovation Summary

POEM has developed a **unified work intake triage system** that eliminates decision paralysis when routing development work. This addresses a common BMAD pain point: knowing which workflow to use for incoming work.

### The Problem

BMAD projects have 5+ entry points for development work:
1. Existing stories → `/appydave-workflow {story}`
2. New feature stories → Bob `*draft` in Epic 1-7
3. Quick fixes → Bob `*add-fix`
4. Epic 0 stories → Bob `*draft` in Epic 0
5. Usage issues → Manual conversion

**Pain Point**: Developers experience decision paralysis - is this <1hr (quick fix) or >1hr (story)? Which epic does this fit? Should I use ceremony or not?

### The POEM Solution: `/triage` Command

**Pattern**: Context Analysis → Decision Criteria → Routing Recommendation → Handoff

**Implementation**:
- **Skill Wrapper**: `.claude/commands/triage.md` (30 lines)
- **Core Logic**: `.bmad-core/tasks/triage-work.md` (comprehensive task)
- **Agent Integration**: Added `*triage` command to Bob (SM) and Sarah (PO)
- **User Documentation**: `docs/workflows/triage-guide.md` (200 lines)

**Decision Criteria** (applied in priority order):
1. **Time/Ceremony**: <1hr AND no ceremony → Quick Fix, else Story
2. **Existing Story**: Story file exists → AppyDave Workflow
3. **Epic Thematic Fit**: Matches Epic 1-7 theme → Feature Epic Story
4. **Epic 0 vs Ambiguous**: Pure maintenance → Epic 0 Story

**Output Format**:
```
🔍 Work Intake Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing context...
✓ Found: [description]
✓ Area: [epic/category]
✓ Estimate: [time]
✓ Impact: [high/medium/low]
✓ Type: [bug/enhancement/refactor/docs]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Routing Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED: [Path Name]
   [Path details]
   Reason: [2-3 bullet points]

   Next: [Command to execute]

🔀 Alternatives:
1️⃣ [Alternative 1]
2️⃣ [Alternative 2]
```

### Benefits

1. **Eliminates Decision Paralysis**: Clear criteria replace guesswork
2. **Reduces Friction**: Single entry point for all work types
3. **Consistent Routing**: Same decision logic every time
4. **Handoff Clarity**: Exact command sequences provided
5. **Usage Issue Integration**: Converts issues from JSONL to routed work
6. **Quick Fixes Clarity**: Renamed "Maintenance Backlog" to "Quick Fixes" with explicit <1hr boundary

### SupportSignal Adoption Recommendation

**Priority**: High (P1)

**Value for SupportSignal**:
- **KDD Integration**: Triage could analyze KDD documents to determine epic fit
- **Parallel Development**: Multiple developers could use consistent routing logic
- **Onboarding**: New team members get guided workflow selection
- **Pattern Recognition**: Triage could learn project-specific routing patterns

**Implementation Path**:
1. Copy POEM's triage implementation:
   - `.bmad-core/tasks/triage-work.md`
   - `.claude/commands/triage.md`
   - `docs/workflows/triage-guide.md`
2. Adapt decision criteria to SupportSignal's epic structure
3. Add KDD document analysis to context extraction
4. Integrate with SupportSignal's usage issue tracking
5. Add Bob/Sarah `*triage` command
6. Train team on `/triage` usage

**Estimated Effort**: 2-4 hours (mostly adaptation, core logic is reusable)

**Risk**: Low (read-only analysis, doesn't modify files)

### Broader BMAD Community Benefit

**Proposal**: Elevate triage system to **BMAD future release core feature**

**Rationale**:
- Every BMAD project faces work routing decisions
- Pattern is project-agnostic (decision criteria adapt to project structure)
- Reduces cognitive load on developers
- Improves workflow adoption (clear entry points)

**Requirements for BMAD future release**:
- Generalize epic theme detection (configurable in core-config.yaml)
- Add project-specific decision criteria customization
- Create triage analytics (track routing accuracy, user overrides)
- Integrate with BMAD CLI for cross-project triage

### Related Files

**Core Implementation**:
- `.bmad-core/tasks/triage-work.md` - Task logic
- `.claude/commands/triage.md` - Skill wrapper
- `.bmad-core/agents/sm.md` - Bob integration (line 55)
- `.bmad-core/agents/po.md` - Sarah integration (line 67)

**Documentation**:
- `docs/workflows/triage-guide.md` - User guide (200 lines)
- `docs/prd/epic-0-process.md` - Quick Fixes vs Epic 0 Stories section
- `docs/stories/0.1.story.md` - Implementation story

**Supporting Files**:
- `docs/backlog/quick-fixes.md` - Renamed from maintenance.md
- `.bmad-core/core-config.yaml` - Updated backlogFile path

---

**Document prepared by**: Claude Code (Sonnet 4.5)
**Review status**: Initial draft + Triage innovation documented
**Next steps**: Review findings, prioritize recommendations, plan implementation
