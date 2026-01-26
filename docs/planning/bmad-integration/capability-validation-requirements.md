# Generalized Capability Validation Pattern - Requirements

**Status**: 📋 Requirements Document (For Future BMAD Integration)
**Created**: 2026-01-09
**Purpose**: Define requirements for generalizable BMAD pattern based on POEM workflow validation success

---

## Executive Summary

### The Problem This Solves

When building **framework/tooling/DSL projects**, traditional story-level validation isn't enough. You need:

1. **Capability Progression Tracking**: Validate that capabilities build cumulatively (story N depends on 1..N-1)
2. **Reference Workflow Validation**: Test capabilities against a real-world "golden path" workflow
3. **Integration Testing**: Ensure capabilities work together, not just in isolation
4. **Regression Prevention**: Detect when new capabilities break existing ones
5. **Strategic Feedback**: Generate insights for future story planning

**Current Gap**: BMAD has Dev (story implementation) and QA (story review) but lacks **Product Integration QA** that operates across stories and epics.

---

### The Solution

Add a new **Capability Validator** agent and pattern to BMAD core that:

1. Validates capabilities **in context** (story N with stories 1..N-1)
2. Tests against **reference workflows** (configurable golden paths)
3. Maintains **cumulative progress** toward product goals
4. Generates **strategic feedback** for backlog planning
5. Operates at **product-level**, not just story-level

---

### Proof of Concept

**POEM Workflow Validator (Victor)** demonstrates the pattern:
- Validates POEM capabilities against B72 YouTube workflow
- Tracks progress from 10% → 40% → 80% automation
- Generates strategic feedback for story planning
- Maintains context across 5+ stories in Epic 3

**Success Metrics** (POEM):
- Caught 2 regressions before merge
- Identified 4 capability gaps early
- Generated 11 feedback items for future stories
- Tracked cumulative progress across 3 stories

---

## Pattern Applicability

### When to Use This Pattern

✅ **Use When Project Has**:

1. **Framework/Tooling/DSL** - Building capabilities for other developers/systems
2. **Reference Workflow** - A "golden path" or benchmark workflow to validate against
3. **Cumulative Capabilities** - Story N builds on stories 1..N-1
4. **Multiple Epics** - Capabilities span multiple epics with evolving complexity
5. **Integration Risk** - High risk that capabilities won't integrate properly

### Examples of Applicable Projects

| Project | Reference Workflow | Capabilities |
|---------|-------------------|--------------|
| **POEM** | B72 YouTube Launch (54 prompts) | Prompt execution, schema validation, mock data, workflows |
| **Klueless** | Code generation templates | DSL parsing, template rendering, file generation, AST manipulation |
| **BMAD itself** | Real project workflows | Agent coordination, task execution, artifact management, quality gates |
| **appydave-tools** | Multi-step YouTube publishing | CLI commands, API integrations, data transformations, workflow chaining |
| **FliVideo** | Video asset workflows | Asset ingestion, metadata extraction, transcoding, search indexing |

### When NOT to Use This Pattern

❌ **Skip When Project Is**:

1. **End-User Application** - Normal app with CRUD operations
2. **Single Epic** - Small project with few stories
3. **Simple Integration** - Capabilities don't depend on each other
4. **No Reference Workflow** - No clear "golden path" to validate against
5. **Low Integration Risk** - Capabilities are isolated

---

## Architecture Overview

### The Capability Validator Agent

**Name**: `capability-validator` (or `product-integration-qa`)
**Location**: `.bmad-core/agents/capability-validator.md`
**Persona**: Product-level QA that validates capabilities across stories/epics

**Core Responsibilities**:
1. Validate story N in context of stories 1..N-1
2. Test capabilities against reference workflow
3. Track cumulative progress toward epic/product goals
4. Generate strategic feedback for story planning
5. Maintain trajectory toward automation/completion

---

### The 6-Step Validation Cycle

```
1. CAPABILITY ANALYSIS
   ↓ (5-10 min)
2. REGRESSION VALIDATION
   ↓ (10-15 min)
3. PROGRESSION VALIDATION
   ↓ (15-20 min)
4. INTEGRATION VALIDATION
   ↓ (10-15 min)
5. ARTIFACT UPDATES
   ↓ (10 min)
6. FEEDBACK GENERATION
   ↓ (10-15 min)

Total: 60-90 minutes per story
```

**Step Details**:

#### 1. Capability Analysis
- **Input**: Completed story N
- **Output**: Capability summary (what's new, dependencies, impact)
- **Purpose**: Understand what changed

#### 2. Regression Validation
- **Input**: Stories 1..N-1 only
- **Output**: PASS/FAIL + diff if failed
- **Purpose**: Detect breaking changes
- **Decision Gate**: FAIL → Block merge

#### 3. Progression Validation
- **Input**: Stories 1..N (with new capability)
- **Output**: PASS/FAIL/PARTIAL + snapshot
- **Purpose**: Validate new capability works
- **Decision Gate**: FAIL → Feedback to Dev

#### 4. Integration Validation
- **Input**: Capability N with capabilities 1..N-1
- **Output**: Integration matrix update
- **Purpose**: Ensure capabilities integrate
- **Decision Gate**: Critical friction → Add story to backlog

#### 5. Artifact Updates
- **Input**: Validation results
- **Output**: Updated reports, snapshots, matrix
- **Purpose**: Maintain validation artifacts

#### 6. Feedback Generation
- **Input**: Findings from steps 1-4
- **Output**: Strategic feedback log
- **Purpose**: Inform future story planning

---

### Key Artifacts

#### 1. Cumulative Test Report
**Location**: `dev-workspace/test-reports/epic-N-cumulative.md`
**Purpose**: Track epic progress toward completion
**Updated**: After each story validation
**Content**:
- Stories completed
- Capabilities matrix
- Epic progress %
- Workflow coverage %
- Blockers and warnings
- Recommendations

#### 2. Reference Workflow Snapshots
**Location**: `dev-workspace/test-runs/{workflow-name}/`
**Purpose**: Time-travel debugging and regression comparison
**Updated**: After each story completion
**Structure**:
```
{workflow-name}/
├── baseline/
├── story-N.1/
├── story-N.2/
└── ...
```

#### 3. Integration Matrix
**Location**: `dev-workspace/integration-matrix.md`
**Purpose**: Track capability pairwise integration status
**Updated**: After each story validation
**Content**:
- Capability × Capability matrix (✅ PASS, ⚠️ PARTIAL, ❌ FAIL, 🔲 UNTESTED)
- Detailed test results
- Untested combinations (gaps)

#### 4. Feedback Log
**Location**: `dev-workspace/feedback-for-bmad.md`
**Purpose**: Strategic feedback for story planning
**Updated**: After each story validation
**Tags**: [BUG], [ENHANCEMENT], [GAP], [SEQUENCING], [ARCHITECTURE]

#### 5. Reference Workflow Guide
**Location**: `dev-workspace/{WORKFLOW-NAME}-TESTING-GUIDE.md`
**Purpose**: Living document showing current workflow status
**Updated**: After each story validation (new sections)

---

## Configuration Schema

### `.bmad-core/core-config.yaml` Extensions

Add new section for capability validation:

```yaml
capabilityValidation:
  enabled: true|false                    # Enable/disable capability validation

  # Reference workflow configuration
  referenceWorkflow:
    name: "B72 YouTube Launch"           # Human-readable name
    path: "data/reference-workflows/b72-youtube-launch.yaml"  # Workflow definition
    description: "54-prompt YouTube content workflow"
    goals:
      - "Transform transcript to YouTube metadata"
      - "Automate content optimization"
      - "Generate thumbnails and social posts"

  # Datasets for validation
  datasets:
    - name: "B72"
      path: "dev-workspace/test-runs/B72/"
      status: "active"                   # active|pending|archived
      description: "Claude Opus 4.5 demo video"
    - name: "Storyline"
      path: "dev-workspace/test-runs/storyline/"
      status: "pending"
      description: "Character narrative generation"
    - name: "SupportSignal"
      path: "dev-workspace/test-runs/support-signal/"
      status: "pending"
      description: "Shift note enhancement"

  # Artifact locations
  artifacts:
    testReports: "dev-workspace/test-reports/"
    snapshots: "dev-workspace/test-runs/"
    integrationMatrix: "dev-workspace/integration-matrix.md"
    feedbackLog: "dev-workspace/feedback-for-bmad.md"

  # Validation rules (when to block)
  validationRules:
    regressionBlocking: true             # Block merge on regression?
    progressionBlocking: false           # Block merge on progression fail?
    integrationBlocking: false           # Block merge on integration fail?
    requiresQAApproval: true             # Require QA approval before validation?

  # Success criteria
  successCriteria:
    epic3:
      workflowCoverage: 80               # % of workflow functional
      capabilitiesTested: 80             # % of capability pairs tested
      regressionsFree: true              # No regressions allowed
    epic4:
      workflowCoverage: 100              # Full automation
      endToEndWorks: true                # Workflow runs unattended

  # Performance tuning
  performance:
    snapshotRetentionDays: 90            # How long to keep snapshots
    lightweightValidationThreshold: 3    # Skip regression for stories < N changes
    parallelTestExecution: true          # Run tests in parallel?
```

---

## Agent Definition Requirements

### Capability Validator Agent (`.bmad-core/agents/capability-validator.md`)

**Must Have**:

1. **Persona**:
   - Role: Product Integration QA
   - Identity: Context keeper across stories/epics
   - Focus: Cumulative capability validation

2. **Commands**:
   - `*validate` - Full 6-step validation cycle
   - `*regression` - Quick regression check
   - `*progression` - Test new capability
   - `*integration` - Test capability integration
   - `*progress-report` - Epic/product progress summary
   - `*snapshot` - Save milestone snapshot
   - `*compare-milestones` - Compare snapshots
   - `*update-matrix` - Update integration matrix
   - `*generate-feedback` - Create strategic feedback

3. **Activation Instructions**:
   - Load project config (`.bmad-core/core-config.yaml`)
   - Load reference workflow definition
   - Load existing validation artifacts
   - Detect environment (dev vs production)
   - Display current validation status

4. **Dependencies** (workflows, data, templates):
   - `validate-capability-progression.yaml` - Full validation workflow
   - `regression-test.yaml` - Regression testing workflow
   - `integration-test.yaml` - Integration testing workflow
   - `progress-tracking.yaml` - Progress reporting workflow
   - `capability-validation-patterns.md` - Validation patterns knowledge
   - `test-report-template.md` - Test report template
   - `integration-matrix-template.md` - Integration matrix template
   - `feedback-log-template.md` - Feedback log template

---

## Workflow Definitions

### 1. `validate-capability-progression.yaml`

Full 6-step validation cycle:

```yaml
name: Validate Capability Progression
description: Full validation cycle for new capability in context of existing capabilities
steps:
  - id: capability-analysis
    name: Capability Analysis
    duration: 5-10 min
    actions:
      - Read completed story N
      - Identify new capability
      - Identify dependencies
      - Predict impact on reference workflow
    outputs:
      - capability-summary

  - id: regression-validation
    name: Regression Validation
    duration: 10-15 min
    actions:
      - Run reference workflow with stories 1..N-1 only
      - Compare outputs against previous snapshot
      - Generate diff report
    outputs:
      - regression-report (PASS/FAIL)
    gates:
      - condition: regression-report == FAIL
        action: BLOCK_MERGE
        message: "Regression detected, blocking merge"

  - id: progression-validation
    name: Progression Validation
    duration: 15-20 min
    actions:
      - Run reference workflow with stories 1..N
      - Execute workflow steps using new capability
      - Verify against story acceptance criteria
      - Save snapshot for milestone
    outputs:
      - progression-report (PASS/FAIL/PARTIAL)
      - milestone-snapshot
    gates:
      - condition: progression-report == FAIL
        action: FEEDBACK_TO_DEV
        message: "New capability failed, provide feedback"

  - id: integration-validation
    name: Integration Validation
    duration: 10-15 min
    actions:
      - Test capability N with capabilities 1..N-1 (pairwise)
      - Test edge cases
      - Identify friction points
    outputs:
      - integration-report
      - integration-matrix-update
    gates:
      - condition: integration-report == CRITICAL_FRICTION
        action: ADD_BACKLOG_STORY
        message: "Critical integration issue, add story to backlog"

  - id: artifact-updates
    name: Artifact Updates
    duration: 10 min
    actions:
      - Update cumulative test report
      - Save milestone snapshot
      - Update integration matrix
      - Update reference workflow guide
    outputs:
      - updated-artifacts

  - id: feedback-generation
    name: Feedback Generation
    duration: 10-15 min
    actions:
      - Document bugs found
      - Suggest enhancements
      - Identify gaps
      - Recommend story sequencing
      - Note architectural insights
    outputs:
      - feedback-log-update
```

---

### 2. `regression-test.yaml`

Quick regression testing:

```yaml
name: Regression Test
description: Verify no breaking changes from new story
steps:
  - id: run-previous-capabilities
    name: Run Previous Capabilities
    actions:
      - Load stories 1..N-1 only
      - Execute reference workflow
      - Capture outputs
    outputs:
      - current-outputs

  - id: compare-snapshots
    name: Compare Snapshots
    actions:
      - Load previous snapshot (story N-1)
      - Diff current-outputs vs previous-outputs
      - Generate regression report
    outputs:
      - regression-report (PASS/FAIL)
      - diff-report

  - id: decision-gate
    name: Regression Gate
    gates:
      - condition: regression-report == FAIL
        action: BLOCK_MERGE
        message: "Regression detected in {affected-capabilities}"
```

---

### 3. `integration-test.yaml`

Capability integration testing:

```yaml
name: Integration Test
description: Test capability N with existing capabilities
steps:
  - id: pairwise-tests
    name: Pairwise Capability Tests
    actions:
      - For each capability C in [1..N-1]:
          - Test capability N with capability C
          - Record result (PASS/FAIL/PARTIAL)
      - Update integration matrix
    outputs:
      - integration-results

  - id: edge-case-tests
    name: Edge Case Tests
    actions:
      - Test invalid inputs
      - Test missing data
      - Test boundary conditions
    outputs:
      - edge-case-results

  - id: friction-analysis
    name: Friction Analysis
    actions:
      - Identify integration friction points
      - Classify friction (critical/minor)
      - Recommend fixes
    outputs:
      - friction-report
```

---

### 4. `progress-tracking.yaml`

Progress reporting:

```yaml
name: Progress Tracking
description: Generate epic/product progress report
steps:
  - id: collect-metrics
    name: Collect Metrics
    actions:
      - Count stories completed
      - Count capabilities functional
      - Calculate workflow coverage %
      - Identify blockers and warnings
    outputs:
      - metrics

  - id: generate-report
    name: Generate Report
    actions:
      - Create progress report from metrics
      - Compare against success criteria
      - Recommend next actions
    outputs:
      - progress-report
```

---

## Data Models

### Reference Workflow Definition

```yaml
name: "B72 YouTube Launch"
description: "Transform video transcript to YouTube metadata bundle"
version: "1.0.0"

# Workflow structure
phases:
  - id: analyze
    name: "Analyze Content"
    prompts:
      - summarize-video
      - abridge-transcript
      - identify-chapters
      - extract-keywords
      # ... (12 prompts total)

  - id: generate
    name: "Generate Assets"
    prompts:
      - generate-title
      - thumbnail-text
      - video-description
      # ... (18 prompts total)

  # ... (5 phases total)

# Expected inputs/outputs
inputs:
  - name: transcript
    type: string
    required: true
    description: "Video transcript text"
  - name: brand-config
    type: object
    required: false
    description: "Brand configuration"

outputs:
  - name: youtube-metadata-bundle
    type: object
    fields:
      - title
      - description
      - tags
      - chapters
      - thumbnail-text
      - social-posts

# Success criteria
successCriteria:
  coverage:
    epic3: 80  # 80% of prompts functional by end of Epic 3
    epic4: 100 # 100% automated by end of Epic 4
  quality:
    - "Outputs are schema-compliant"
    - "No manual intervention required"
    - "Execution time < 5 minutes"
```

---

### Capability Definition

```yaml
id: "mock-data-generation"
name: "Mock Data Generation"
story: "3.3"
epic: "3"
description: "Generate schema-compliant mock data for testing prompts"

# Dependencies
dependencies:
  - id: "schema-validation"
    story: "3.2"
    reason: "Mock data must validate against schemas"

# Impact on reference workflow
impact:
  prompts_enabled: 16  # Enables 16 new prompts
  coverage_increase: 15  # +15% workflow coverage
  phases_enabled:
    - analyze
    - generate

# Integration requirements
integrations:
  - capability: "schema-validation"
    type: "consumer"
    description: "Mock data must validate"
  - capability: "prompt-execution"
    type: "producer"
    description: "Mock data feeds into execution"
```

---

### Test Result Model

```json
{
  "snapshot_id": "story-3.3",
  "timestamp": "2026-01-09T14:30:00Z",
  "story": "3.3",
  "epic": "3",
  "capabilities": ["prompt-execution", "schema-validation", "mock-data-generation"],

  "regression": {
    "status": "PASS",
    "duration_seconds": 45,
    "prompts_tested": 22,
    "prompts_passed": 22
  },

  "progression": {
    "status": "PASS",
    "duration_seconds": 68,
    "prompts_tested": 22,
    "prompts_passed": 22,
    "coverage_percent": 40
  },

  "integration": {
    "status": "PARTIAL",
    "tests": [
      {
        "capability_a": "mock-data-generation",
        "capability_b": "schema-validation",
        "status": "PARTIAL",
        "warning": "Deeply nested arrays not handled"
      }
    ]
  },

  "artifacts_updated": [
    "epic-3-cumulative.md",
    "integration-matrix.md",
    "feedback-for-bmad.md",
    "B72-VIDEO-TESTING-GUIDE.md"
  ],

  "feedback_generated": 4,
  "validation_duration_minutes": 68
}
```

---

## Integration with BMAD Workflow

### Current BMAD Flow (Story-Centric)

```
SM drafts story N
  ↓
Dev implements story N
  ↓
QA reviews story N
  ↓
Story N done ✅
```

### Enhanced BMAD Flow (Product-Centric)

```
SM drafts story N
  ↓
Dev implements story N
  ↓
QA reviews story N
  ↓
Capability Validator validates story N (in context)
  ↓
Capability Validator generates feedback
  ↓
Story N done ✅
  ↓
SM reads feedback, drafts story N+1 (informed by insights)
```

### When Capability Validator Runs

**Recommended Trigger**: After QA gate passes, before merge

**Alternative Triggers**:
- On-demand (developer/QA requests validation)
- Automated CI/CD pipeline (after QA approval)
- Epic milestones (comprehensive validation)

**Configurable in** `.bmad-core/core-config.yaml`:

```yaml
capabilityValidation:
  trigger: "after-qa-gate" | "on-demand" | "automated" | "epic-milestone"
```

---

## Implementation Roadmap

### Phase 1: Core Agent & Basic Validation (8-12 hours)

**Deliverables**:
1. Capability Validator agent definition (`.bmad-core/agents/capability-validator.md`)
2. Basic validation workflows (`validate-capability-progression.yaml`, `regression-test.yaml`)
3. Artifact templates (test report, integration matrix, feedback log)
4. Configuration schema extensions

**Validation**: Run on POEM as proof-of-concept

---

### Phase 2: Reference Workflow Integration (6-8 hours)

**Deliverables**:
1. Reference workflow definition format
2. Workflow loader and parser
3. Integration with validation workflows
4. Progress tracking against workflow

**Validation**: Test with B72, Storyline workflows

---

### Phase 3: Snapshot Management (4-6 hours)

**Deliverables**:
1. Snapshot creation and storage
2. Snapshot comparison utilities
3. Regression detection algorithms
4. Milestone tracking

**Validation**: Time-travel debugging on POEM

---

### Phase 4: Feedback Loop Integration (4-6 hours)

**Deliverables**:
1. Feedback generation workflows
2. Integration with SM story drafting
3. Feedback lifecycle tracking
4. Backlog prioritization recommendations

**Validation**: Track feedback from POEM Epic 3 → Epic 4

---

### Phase 5: Documentation & Patterns (4-6 hours)

**Deliverables**:
1. Capability Validation Pattern documentation
2. Best practices guide
3. Project selection guide (when to use)
4. Example projects (POEM, Klueless, etc.)

**Validation**: External review, community feedback

---

### Phase 6: Automation & CI/CD (6-8 hours)

**Deliverables**:
1. Automated validation in CI/CD
2. GitHub Actions integration
3. Blocking merge policies
4. Notification system

**Validation**: Run on BMAD itself

---

**Total Effort**: 32-46 hours (4-6 full days)

---

## Success Criteria

### For BMAD Integration

✅ **Must Have**:
1. Agent definition and workflows functional
2. Configuration schema documented
3. Works on 2+ projects (POEM + one other)
4. Documentation complete
5. Community review passed

🎯 **Should Have**:
1. Automated CI/CD integration
2. Works on 3+ project types (prompt eng, DSL, CLI tools)
3. Performance optimized (< 30 min for lightweight validation)
4. Visual progress dashboards

🌟 **Nice to Have**:
1. AI-powered failure analysis
2. Predictive capability risk scoring
3. Cross-project pattern detection
4. Integration with GitHub Projects/Issues

---

### For POEM Validation

✅ **Proof of Concept Complete**:
1. Victor agent functional
2. Validated 3+ stories (3.1, 3.2, 3.3)
3. Artifacts established and maintained
4. Feedback loop working (feedback → SM → Dev → QA → Victor)
5. Cumulative progress tracked (10% → 40%)

---

## Migration Path

### For Existing Projects

**Step 1**: Identify if project fits pattern
- Framework/tooling/DSL? ✅
- Reference workflow? ✅
- Cumulative capabilities? ✅
- Multiple epics? ✅

**Step 2**: Define reference workflow
- Create `data/reference-workflows/{workflow-name}.yaml`
- Define phases, prompts/steps, inputs/outputs
- Set success criteria per epic

**Step 3**: Configure capability validation
- Update `.bmad-core/core-config.yaml`
- Enable `capabilityValidation`
- Set validation rules and triggers

**Step 4**: Establish baseline
- Create baseline snapshot
- Document current state (pre-validation)

**Step 5**: Run first validation
- Activate Capability Validator
- Run validation on latest story
- Review artifacts generated

**Step 6**: Integrate into workflow
- Update BMAD workflow to include validation
- Train SM to read feedback
- Train Dev/QA on new artifacts

---

### For New Projects

**Step 1**: Enable during project setup
- BMAD installer asks: "Enable capability validation?"
- If yes, prompts for reference workflow

**Step 2**: Define reference workflow early
- During PRD/Architecture phase
- Include in project planning

**Step 3**: Validation from Story 1
- First validation establishes baseline
- Subsequent stories tracked from beginning

---

## Open Questions

### Technical

1. **Snapshot Storage**: Where to store snapshots long-term? (git-lfs, S3, local only?)
2. **Parallel Testing**: How to parallelize validation for speed?
3. **Cross-Project Patterns**: How to detect similar patterns across projects?
4. **Performance**: How to keep validation < 30 min for large workflows?

### Process

1. **Blocking Authority**: Should regressions always block merges?
2. **Validation Frequency**: Every story or every N stories?
3. **Feedback Priority**: How to prioritize feedback items?
4. **Team Adoption**: How to train teams on new workflow?

### Product

1. **Visualization**: Should we build dashboards for progress tracking?
2. **AI Analysis**: Can we use AI to analyze failures and suggest fixes?
3. **Community Patterns**: Should we share patterns across BMAD community?
4. **Pricing**: Is this a paid feature or core to BMAD?

---

## Appendix: Comparison to Existing Tools

### vs. Traditional CI/CD

| Feature | Capability Validator | CI/CD |
|---------|---------------------|-------|
| **Scope** | Product-level, cumulative | Build/test, per-commit |
| **Context** | Cross-story, epic-aware | Single commit |
| **Validation** | Capability integration | Unit/integration tests |
| **Feedback** | Strategic (future stories) | Tactical (fix this commit) |
| **Timing** | After QA gate | After every commit |

**Complementary**: Use both. CI/CD validates commits, Capability Validator validates stories/epics.

---

### vs. Regression Testing

| Feature | Capability Validator | Regression Tests |
|---------|---------------------|-----------------|
| **Scope** | Workflow-level | Feature-level |
| **Reference** | Real-world workflow | Test suite |
| **Output** | Snapshots + feedback | PASS/FAIL |
| **Integration** | Pairwise capability testing | Test dependencies |
| **Strategic** | Informs future planning | Prevents breakage |

**Complementary**: Use both. Regression tests are tactical, Capability Validator is strategic.

---

### vs. Manual QA

| Feature | Capability Validator | Manual QA |
|---------|---------------------|-----------|
| **Consistency** | Automated, repeatable | Human judgment |
| **Speed** | 60-90 min | Hours to days |
| **Coverage** | Full workflow | Sample testing |
| **Feedback** | Structured (tags, priority) | Ad-hoc |
| **Context** | Cross-story memory | Story-focused |

**Complementary**: Use both. Manual QA for UX/edge cases, Capability Validator for capability integration.

---

## Resources

### POEM Proof of Concept

- **Victor Agent**: `.claude/commands/poem/agents/victor.md`
- **Validation Guide**: `dev-workspace/WORKFLOW-VALIDATION-GUIDE.md`
- **Artifacts**: `dev-workspace/test-reports/`, `dev-workspace/integration-matrix.md`, etc.
- **B72 Workflow**: `dev-workspace/B72-VIDEO-TESTING-GUIDE.md`

### BMAD Core References

- **Agent Template**: `.bmad-core/agents/*.md`
- **Workflow Template**: `.bmad-core/workflows/*.yaml`
- **Configuration**: `.bmad-core/core-config.yaml`
- **User Guide**: `.bmad-core/user-guide.md`

---

## Next Steps

### For POEM (Immediate)

1. ✅ **Victor agent created** - POEM-specific implementation complete
2. 🔄 **Use Victor in Epic 3** - Validate stories 3.4, 3.5
3. 📊 **Collect metrics** - Measure impact (regressions caught, feedback quality)
4. 📝 **Document learnings** - What worked, what didn't
5. 🎯 **Prove the pattern** - Complete Epic 3 with Victor

### For BMAD Core (Future)

1. 📋 **Review requirements** - Get community feedback
2. 🔨 **Implement Phase 1** - Core agent & basic validation
3. 🧪 **Test on 2nd project** - Validate generalization (Klueless or appydave-tools)
4. 📚 **Write documentation** - Pattern guide, best practices
5. 🚀 **Release to community** - Propose Capability Validation pattern for BMAD future release

---

**Requirements Version**: 1.0.0
**Status**: 📋 Ready for Review
**Next Review**: After POEM Epic 3 completion
**Target BMAD Version**: 5.0.0 (Q2 2026)

**Created By**: Claude (based on POEM Workflow Validator success)
**Reviewed By**: TBD
**Approved By**: TBD

---

## Feedback & Questions

For questions or feedback on these requirements:
1. Review POEM's Victor agent implementation
2. Test pattern on your own project
3. Provide feedback via BMAD Discord: https://discord.gg/gk8jAdXWmj
4. Submit issues on GitHub: https://github.com/bmadcode/bmad-method

---

**Document Last Updated**: 2026-01-09
