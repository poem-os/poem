# POEM Workflow Validation Guide

**Agent**: Victor (Workflow Validator)
**Purpose**: Product-level QA that validates POEM capabilities against B72 YouTube workflow
**Version**: 1.0.0
**Last Updated**: 2026-01-09

---

## Table of Contents

1. [What is Workflow Validation?](#what-is-workflow-validation)
2. [When to Use Victor](#when-to-use-victor)
3. [Validation Workflow](#validation-workflow)
4. [Commands Reference](#commands-reference)
5. [Artifacts Explained](#artifacts-explained)
6. [Decision Gates](#decision-gates)
7. [Integration with BMAD](#integration-with-bmad)
8. [Troubleshooting](#troubleshooting)

---

## What is Workflow Validation?

### The Problem

Traditional BMAD workflow validates each story in isolation:
- **Dev** implements story N, runs tests ✅
- **QA** reviews story N, provides feedback ✅
- Story N marked complete ✅

**But**: How do we know story N works with stories 1..N-1? How do we track cumulative progress toward B72 automation?

### The Solution

**Workflow Validation** adds a **product-level QA layer** that:
1. Validates stories in **context of all previous stories**
2. Tracks **cumulative capability building** toward epic goals
3. Tests against **real-world workflow** (B72 YouTube automation)
4. Generates **strategic feedback** for future story planning
5. Maintains **trajectory toward Holy Grail** (full automation)

### Victor's Role

Victor is your **Product Integration QA**:
- Operates at **product-level**, not story-level
- Maintains **context across stories** (story N in context of 1..N-1)
- Validates **capability integration** (do capabilities work together?)
- Tracks **workflow coverage** (% of B72 prompts functional)
- Generates **strategic feedback** (bugs, gaps, architectural insights)

---

## When to Use Victor

### Trigger Points

**After each story completion** (recommended):
1. Dev completes SAT
2. QA reviews story and provides gate
3. **Victor validates story in context** (60-90 min)
4. Victor's feedback informs next story

**On-demand** (as needed):
- Before starting new story (check current state)
- After fixing bugs (verify no regression)
- At epic milestones (comprehensive validation)
- When adding new datasets (cross-dataset validation)

### When NOT to Use Victor

- **During story development** - Wait until SAT passes
- **For simple documentation changes** - No need for validation
- **For bug fixes within same story** - Dev's SAT sufficient
- **For exploratory work** - No formal validation needed

---

## Validation Workflow

### The 6-Step Cycle

Victor follows a repeatable 6-step validation cycle:

```
1. CAPABILITY ANALYSIS
   ↓
2. REGRESSION VALIDATION
   ↓
3. PROGRESSION VALIDATION
   ↓
4. INTEGRATION VALIDATION
   ↓
5. ARTIFACT UPDATES
   ↓
6. FEEDBACK GENERATION
```

### Step 1: Capability Analysis (5-10 min)

**What**: Identify what new capability story N added

**Actions**:
- Read completed story N
- Identify new capability (e.g., "mock data generation")
- Identify dependencies on previous stories (e.g., requires story 3.2's schema validation)
- Predict impact on B72 workflow (which prompts will this enable?)

**Output**: Capability summary

**Example**:
```
Story 3.3 added: Mock data generation with schema compliance
Dependencies: Story 3.2 (schema validation)
Expected impact: Enables testing all 54 prompts without real data
```

---

### Step 2: Regression Validation (10-15 min)

**What**: Verify that story N didn't break existing capabilities

**Actions**:
- Run B72 workflow using **ONLY** capabilities from stories 1..N-1
- Compare outputs against previous milestone snapshot
- Check for any differences or regressions

**Output**: Regression test report (PASS/FAIL)

**Decision Gate**: If FAIL → BLOCK story merge, create bug report

**Example**:
```
Running B72 workflow with stories 3.1-3.2 only...
Comparing against story-3.2 snapshot...
Result: ✅ PASS (no differences found)
```

---

### Step 3: Progression Validation (15-20 min)

**What**: Verify that story N's new capability works as expected

**Actions**:
- Run B72 workflow **WITH** story N capability included
- Execute workflow steps that use the new capability
- Verify expected behavior against story acceptance criteria
- Compare outputs against expected results

**Output**: Progression test report (PASS/FAIL/PARTIAL) + snapshot

**Decision Gate**: If FAIL → Feedback to Dev for fixes

**Example**:
```
Running B72 workflow with stories 3.1-3.3...
Testing mock data generation on 10 prompts...
Result: ✅ PASS (mock data generated, schema-compliant)
Snapshot saved: dev-workspace/test-runs/B72/story-3.3/
```

---

### Step 4: Integration Validation (10-15 min)

**What**: Verify that story N's capability integrates with existing capabilities

**Actions**:
- Test how capability N works with capabilities 1..N-1
- Run pairwise integration tests (e.g., mock data + schema validation)
- Test edge cases (invalid inputs, missing data, etc.)
- Identify workflow friction points

**Output**: Integration test report + updated integration matrix

**Decision Gate**: If critical friction → Add story to backlog for fixes

**Example**:
```
Testing: Mock data generation + Schema validation
Result: ✅ PASS (mock data validates against schemas)

Testing: Mock data with nested arrays
Result: ⚠️ PARTIAL (shallow arrays work, deep nesting fails)
```

---

### Step 5: Artifact Updates (10 min)

**What**: Update all validation artifacts with new findings

**Actions**:
- Update cumulative test report (`epic-3-cumulative.md`)
- Save B72 workflow snapshot (`test-runs/B72/story-3.N/`)
- Update integration matrix (`integration-matrix.md`)
- Update B72 testing guide (`B72-VIDEO-TESTING-GUIDE.md`)
- Update dataset tracking (if new data artifacts created)

**Output**: Updated artifacts

**Example**:
```
✅ Updated: epic-3-cumulative.md (3/5 stories, 60%)
✅ Saved: B72 snapshot for story 3.3
✅ Updated: integration-matrix.md
✅ Updated: B72-VIDEO-TESTING-GUIDE.md
```

---

### Step 6: Feedback Generation (10-15 min)

**What**: Generate strategic feedback for future story planning

**Actions**:
- Document issues found in story N (bugs, edge cases)
- Suggest improvements for stories N+1, N+2, etc.
- Identify gaps in epic planning (missing capabilities)
- Recommend story sequencing adjustments
- Note architectural insights (patterns emerging)

**Output**: Updated feedback log (`feedback-for-bmad.md`)

**Tags Used**:
- `[BUG]` - Issues in completed stories
- `[ENHANCEMENT]` - Improvements for upcoming stories
- `[GAP]` - Missing capabilities
- `[SEQUENCING]` - Story order adjustments
- `[ARCHITECTURE]` - Architectural patterns

**Example**:
```
[BUG] Mock data generator doesn't handle deeply nested arrays
  → Add to story 3.4 or create bug fix story

[ENHANCEMENT] Add configurable mock data complexity levels
  → Consider for story 3.5

[GAP] No validation for Handlebars variables matching schema fields
  → Add to story 3.4 acceptance criteria

[ARCHITECTURE] Schema-first design pattern emerging
  → Document in architecture/coding-standards.md
```

---

## Commands Reference

### Activate Victor

```bash
/poem/agents/victor
```

Victor will:
1. Load validation context
2. Display current status
3. Show available commands
4. Wait for your command

---

### `*validate` - Full Validation Cycle

**Duration**: 60-90 min (standard), 20-30 min (lightweight)

**When to use**: After story completion, before merge

**What it does**: Executes all 6 steps (capability analysis → regression → progression → integration → artifacts → feedback)

**Usage**:
```
*validate
# or
*validate --lightweight  (skip some regression tests)
```

**Output**: Comprehensive validation report + updated artifacts

---

### `*regression` - Quick Regression Check

**Duration**: 10-15 min

**When to use**: Quick check before merge, after bug fixes

**What it does**: Runs B72 workflow with previous stories only, compares against last snapshot

**Usage**:
```
*regression
```

**Output**: PASS/FAIL + diff if failed

---

### `*progression` - Test New Capability

**Duration**: 15-20 min

**When to use**: After implementing new story, want to test in isolation

**What it does**: Runs B72 workflow with new capability, validates against acceptance criteria

**Usage**:
```
*progression
```

**Output**: PASS/FAIL/PARTIAL + snapshot

---

### `*integration` - Test Capability Integration

**Duration**: 10-15 min

**When to use**: After progression passes, want to test integration

**What it does**: Tests new capability with existing capabilities, updates integration matrix

**Usage**:
```
*integration
```

**Output**: Integration test report + updated matrix

---

### `*progress-report` - Epic Progress Summary

**Duration**: 5-10 min

**When to use**: Check current epic status, prepare for planning

**What it does**: Generates epic/product progress summary

**Usage**:
```
*progress-report
```

**Output**: Stories completed, capabilities functional, workflow coverage %, blockers, warnings

**Example Output**:
```
Epic 3 Progress: 60% (3/5 stories)
B72 Workflow Coverage: 40% (22/54 prompts executable)
Blockers: None
Warnings: 1 (nested array handling)
```

---

### `*snapshot` - Save Milestone Snapshot

**Duration**: 5 min

**When to use**: After story completion, before moving to next story

**What it does**: Saves B72 workflow outputs for current story milestone

**Usage**:
```
*snapshot
```

**Output**: Snapshot directory created in `test-runs/B72/story-X.X/`

---

### `*compare-milestones` - Compare Snapshots

**Duration**: 10-15 min

**When to use**: Debugging regressions, understanding cumulative impact

**What it does**: Compares workflow outputs across story milestones

**Usage**:
```
*compare-milestones 3.2 3.3
```

**Output**: Diff report showing what changed between milestones

---

### `*update-matrix` - Update Integration Matrix

**Duration**: 5-10 min

**When to use**: After integration testing, before updating artifacts

**What it does**: Updates integration matrix with new test results

**Usage**:
```
*update-matrix
```

**Output**: Updated `integration-matrix.md`

---

### `*generate-feedback` - Create Strategic Feedback

**Duration**: 10-15 min

**When to use**: After validation, before next story planning

**What it does**: Creates strategic feedback for upcoming stories

**Usage**:
```
*generate-feedback
```

**Output**: Updated `feedback-for-bmad.md` with tagged feedback items

---

## Artifacts Explained

### 1. Cumulative Test Reports

**Location**: `dev-workspace/test-reports/epic-3-cumulative.md`

**Purpose**: Track epic-level progress toward completion

**Updated**: After each story validation

**Content**:
- Stories completed (with regression/progression/integration status)
- Capabilities matrix (which capabilities are functional)
- Epic progress percentage (stories/capabilities/workflow coverage)
- Blockers and warnings
- Key findings and recommendations

**How to read**:
- Look for ✅ (pass), ⚠️ (warning), ❌ (fail) indicators
- Check "Epic Progress" for overall status
- Review "Blockers" for issues blocking progress
- Read "Recommendations" for next steps

---

### 2. B72 Workflow Snapshots

**Location**: `dev-workspace/test-runs/B72/`

**Purpose**: Enable time-travel debugging and regression comparison

**Updated**: After each story completion

**Structure**:
```
B72/
├── baseline/           # Pre-Epic 3 state
│   ├── inputs/
│   └── outputs/
├── story-3.1/          # After story 3.1
│   ├── inputs/
│   ├── outputs/
│   └── test-results.json
├── story-3.2/          # After story 3.2
│   └── ...
└── story-3.3/          # After story 3.3
    └── ...
```

**How to use**:
- Compare outputs across milestones to understand cumulative impact
- Debug regressions by diffing snapshots
- Validate that new capabilities improve outputs

---

### 3. Integration Matrix

**Location**: `dev-workspace/integration-matrix.md`

**Purpose**: Track which capability pairs have been tested together

**Updated**: After each story validation

**Content**:
- Pairwise integration test results (✅ PASS, ⚠️ PARTIAL, ❌ FAIL, 🔲 UNTESTED)
- Detailed test results for each integration
- Untested integration gaps
- B72 workflow coverage by capability

**How to read**:
- Look for 🔲 (untested) cells - these are gaps
- Check for ⚠️ (partial) or ❌ (fail) - these need attention
- Review "Untested Integrations" section for planned tests

---

### 4. Feedback Log

**Location**: `dev-workspace/feedback-for-bmad.md`

**Purpose**: Strategic feedback for BMAD story planning and backlog management

**Updated**: After each story validation

**Content**:
- Bugs found in completed stories
- Enhancements suggested for upcoming stories
- Gaps identified in epic planning
- Story sequencing recommendations
- Architectural insights and patterns

**Tags**:
- `[BUG]` 🔴 - Issues needing fixes
- `[ENHANCEMENT]` 🟡 - Improvements for future stories
- `[GAP]` 🔴 - Missing capabilities
- `[SEQUENCING]` 🟡 - Story order adjustments
- `[ARCHITECTURE]` 🟢 - Patterns emerging

**How to use**:
- Scrum Master reads before drafting next story
- Incorporate relevant feedback into story acceptance criteria
- Track feedback lifecycle (open → in progress → resolved)

---

### 5. B72 Testing Guide

**Location**: `dev-workspace/B72-VIDEO-TESTING-GUIDE.md`

**Purpose**: Living document showing current B72 workflow status

**Updated**: After each story validation (new sections added)

**Content**:
- What prompts have been created
- How to test prompts (manual and automated)
- Expected workflow for B72 release
- Testing results and feedback
- Connection to B72 video project

**How to use**:
- Reference when testing B72 workflow
- Update with new prompts as they're created
- Document test results and feedback

---

## Decision Gates

### Gate 1: Regression Gate

**Triggered**: After Step 2 (Regression Validation)

**Decision**:
- **FAIL** → BLOCK story merge, create bug report, Dev fixes before proceeding
- **PASS** → Continue to Step 3 (Progression Validation)

**Example**:
```
Regression test failed: Prompt execution broke schema validation
Action: Block merge, create bug report for story 3.3
Developer: Fix regression before proceeding
```

---

### Gate 2: Progression Gate

**Triggered**: After Step 3 (Progression Validation)

**Decision**:
- **FAIL** → Feedback to Dev, optional block (discuss with David)
- **PARTIAL** → Document limitations, add to feedback log, proceed with warnings
- **PASS** → Continue to Step 4 (Integration Validation)

**Example**:
```
Progression test partial: Mock data works for simple schemas, fails for nested arrays
Action: Document limitation, add to feedback log, proceed with warning
Feedback: Add nested array handling to story 3.4 or create bug fix story
```

---

### Gate 3: Integration Gate

**Triggered**: After Step 4 (Integration Validation)

**Decision**:
- **CRITICAL FRICTION** → Add story to backlog for fixes, update epic plan
- **MINOR FRICTION** → Add to feedback log, continue
- **PASS** → Continue to Step 5 (Artifact Updates)

**Example**:
```
Integration test critical: Template variables don't validate against schemas
Action: Add story 3.4.1 to backlog: "Template-schema variable validation"
Update: Adjust Epic 3 plan to include new story
```

---

### Gate 4: Epic Completion Gate

**Triggered**: After last story in epic

**Decision**:
- **Workflow fails end-to-end** → Epic NOT complete, create integration stories
- **Workflow succeeds on B72** → Epic complete, add next dataset
- **Mixed results** → Review epic scope, adjust

**Example**:
```
Epic 3 completion: All stories done, but B72 workflow only 75% functional
Action: Epic NOT complete, create integration stories to reach 80% target
```

---

## Integration with BMAD

### How Victor Fits into BMAD Workflow

**Traditional BMAD** (Story-Centric):
```
SM drafts story N
  ↓
Dev implements story N
  ↓
QA reviews story N
  ↓
Story N done ✅
```

**With Victor** (Product-Centric):
```
SM drafts story N
  ↓
Dev implements story N
  ↓
QA reviews story N
  ↓
Victor validates story N (in context of 1..N-1)
  ↓
Victor generates feedback for stories N+1, N+2, N+3
  ↓
Story N done ✅
  ↓
SM reads Victor's feedback, drafts story N+1
```

### Victor's Unique Value

**What BMAD agents validate**:
- **Dev**: Does this story's code work in isolation?
- **QA**: Does this story meet requirements?

**What Victor validates**:
- Does this story work **with all previous stories**?
- Does this story progress toward **epic/product goals**?
- Does this story maintain **trajectory toward Holy Grail**?

**Key Difference**: Victor maintains **CONTEXT** and **TRAJECTORY** across stories

---

## Troubleshooting

### Issue: Regression test fails

**Symptoms**: Step 2 reports FAIL, outputs differ from previous snapshot

**Diagnosis**:
1. Check diff output - what changed?
2. Review story N code - what was modified?
3. Check dependencies - does story N affect previous stories?

**Solutions**:
- If unintended change: Bug in story N, fix before merge
- If intended change: Update baseline snapshot, document in feedback
- If unclear: Discuss with Dev and QA

---

### Issue: Progression test passes but integration fails

**Symptoms**: Step 3 PASS, Step 4 FAIL or PARTIAL

**Diagnosis**:
1. Check integration matrix - which capability pair failed?
2. Review edge cases - what inputs cause failure?
3. Identify friction points - where do capabilities conflict?

**Solutions**:
- If critical: Add integration story to backlog
- If minor: Document in feedback, defer to future story
- If architectural: Note pattern, update architecture docs

---

### Issue: Validation takes too long

**Symptoms**: Full validation exceeds 90 minutes

**Diagnosis**:
1. Check which step is slow (capability analysis, regression, etc.)
2. Review B72 workflow size (how many prompts being tested?)
3. Check for redundant tests

**Solutions**:
- Use `*validate --lightweight` for quick checks
- Use individual commands (`*regression`, `*progression`, etc.) instead of `*validate`
- Batch validations (every 2-3 stories instead of every story)
- Optimize test execution (parallel testing, caching, etc.)

---

### Issue: Victor's feedback not being incorporated

**Symptoms**: Same issues appearing in multiple stories, feedback log growing

**Diagnosis**:
1. Check if Scrum Master is reading feedback log before drafting stories
2. Verify feedback items are being added to story acceptance criteria
3. Confirm feedback lifecycle (open → resolved)

**Solutions**:
- Add "Review Victor's feedback" to SM's story drafting checklist
- Tag high-priority feedback items for immediate attention
- Review feedback log in sprint planning
- Close feedback loop: Mark items as RESOLVED when addressed

---

### Issue: B72 workflow coverage not progressing

**Symptoms**: Epic 3 stories completing but workflow coverage stuck at 40%

**Diagnosis**:
1. Check cumulative test report - which capabilities are missing?
2. Review B72 prompts - which ones are blocked?
3. Identify dependencies - what's preventing progress?

**Solutions**:
- Prioritize stories that unblock most B72 prompts
- Identify gaps in epic planning (missing capabilities)
- Consider adding integration stories
- Review epic scope - are we targeting right capabilities?

---

## Best Practices

### For Developers
1. **Wait for Victor's validation** before moving to next story
2. **Read Victor's feedback** for your story - it informs future work
3. **Address regressions immediately** - don't let them accumulate
4. **Test integrations locally** before formal validation

### For Scrum Masters
1. **Read feedback log** before drafting next story
2. **Incorporate Victor's feedback** into story acceptance criteria
3. **Prioritize stories** that address high-priority feedback items
4. **Review cumulative test report** for epic planning

### For QA
1. **Coordinate with Victor** - QA reviews story, Victor validates context
2. **Reference Victor's findings** in QA gate decisions
3. **Track feedback lifecycle** - ensure issues get resolved
4. **Use Victor's artifacts** for quality reporting

### For Product Owners
1. **Review progress reports** for epic health checks
2. **Monitor workflow coverage** toward automation goals
3. **Prioritize datasets** for validation (B72 → Storyline → SupportSignal)
4. **Use Victor's insights** for roadmap planning

---

## Quick Reference

### Typical Validation Flow

```bash
# 1. Activate Victor
/poem/agents/victor

# 2. Run full validation
*validate

# 3. Review artifacts
# - dev-workspace/test-reports/epic-3-cumulative.md
# - dev-workspace/integration-matrix.md
# - dev-workspace/feedback-for-bmad.md

# 4. Make decisions at gates
# - Regression Gate: PASS/FAIL
# - Progression Gate: PASS/FAIL/PARTIAL
# - Integration Gate: PASS/PARTIAL/FAIL

# 5. Update BMAD backlog with feedback

# 6. Exit Victor
*exit
```

---

## FAQ

**Q: How is Victor different from QA agent (Quinn)?**

A: Quinn validates story N against its requirements. Victor validates story N in context of stories 1..N-1 and epic goals. Quinn is story-centric, Victor is product-centric.

---

**Q: Do I need to run Victor for every story?**

A: Recommended for capability-adding stories. Optional for small bug fixes or documentation changes.

---

**Q: Can I skip regression testing?**

A: Not recommended for stories that modify existing code. Safe to skip for purely additive stories.

---

**Q: What if Victor's validation takes too long?**

A: Use `*validate --lightweight` or individual commands (`*regression`, `*progression`, etc.). Consider batching validations every 2-3 stories.

---

**Q: How do I know if feedback was addressed?**

A: Check feedback log - items should be marked RESOLVED when addressed. Victor verifies resolution in next validation cycle.

---

**Q: When do we add new datasets (Storyline, SupportSignal)?**

A: After Epic 3 (add Storyline), after Epic 4 (add SupportSignal), after Epic 5 (add full YouTube Launch Optimizer).

---

**Q: What's the "Holy Grail" Victor is tracking toward?**

A: Fully automated B72 workflow: Transcript in → Full YouTube metadata bundle out (unattended). Currently at 40%, targeting 80% by end of Epic 3, 100% by end of Epic 4.

---

## Resources

- **Victor Agent Definition**: `.claude/commands/poem/agents/victor.md`
- **Cumulative Test Reports**: `dev-workspace/test-reports/`
- **Integration Matrix**: `dev-workspace/integration-matrix.md`
- **Feedback Log**: `dev-workspace/feedback-for-bmad.md`
- **B72 Testing Guide**: `dev-workspace/B72-VIDEO-TESTING-GUIDE.md`
- **BMAD User Guide**: `.bmad-core/user-guide.md`
- **POEM Architecture**: `docs/architecture.md`

---

**Guide Version**: 1.0.0
**Last Updated**: 2026-01-09
**Maintained By**: Victor (Workflow Validator Agent)
**Questions?**: Ask David or activate Victor for guidance
