> **POEM Context**: This document was imported from the Motus project. It analyzes cross-workflow patterns and execution primitives that inform POEM's workflow orchestration architecture.

# Workflow Patterns Analysis

**Purpose**: Compare patterns between Video Planner and Launch Optimizer workflows to identify:

- Common patterns for reusable Motus components
- Unique patterns requiring specialized implementations
- Cross-workflow elements needing coordination
- Optimization opportunities (parallelization, automation)

**Created**: 2025-10-24
**Workflows Analyzed**:

- Video Planner (VIDEO-PLANNER-FLOW-ANALYSIS.md)
- Launch Optimizer (LAUNCH-OPTIMIZER-FLOW-ANALYSIS.md)

---

## Executive Summary

### Workflow Characteristics

| Aspect                 | Video Planner            | Launch Optimizer        |
| ---------------------- | ------------------------ | ----------------------- |
| **Purpose**            | Pre-production planning  | Post-production launch  |
| **Target Time**        | ~15 minutes              | ~60-90 minutes          |
| **Philosophy**         | "Fast and furious" speed | Thorough processing     |
| **Steps (Total)**      | 16 designed, 10 used     | 35 designed, 16-18 used |
| **Sections Used**      | 2 of 3 sections          | 5-6 of 8 sections       |
| **Human Checkpoints**  | 5-6 (all in Section 1)   | 6 major checkpoints     |
| **Auto-advance Steps** | 5 steps                  | 11-13 steps             |
| **Parallel Potential** | 3-5 min savings          | 10-13 min savings       |

### Key Insight

**Both workflows are MUCH simpler in practice than in design:**

- Video Planner: 10 active steps (62% usage)
- Launch Optimizer: 16-18 active steps (51% usage)

This suggests AWB workflows naturally evolve toward simplicity through real-world use.

---

## 1. Common Patterns (Reusable Components)

These patterns appear in BOTH workflows and should be core Motus primitives.

### 1.1 Review & Approve Pattern

**Definition**: AI generates output → Human reviews → Approve or request changes → Proceed

**Video Planner Examples:**

- Step 2: Initial Video Idea (review refined purpose/audience)
- Step 3: Define Video Goal (review goal/concept)
- Step 4: Talking Points (review expanded points)
- Step 6: Generate Project Name (review/modify suggestions)

**Launch Optimizer Examples:**

- Section 1 Step 4: Abridge QA (~20% need fixes, 1-3 correction rounds)
- Section 5 Step 1: Title Ideas (select from 10 options)
- Section 6 Step 1: Simple Description (occasional refinement)
- Section 7 Step 3: LinkedIn Post (minimal edits)

**Motus Implementation Needs:**

```javascript
// Common checkpoint pattern
{
  type: 'review-and-approve',
  retries: 'unlimited',  // Or specific count like 3
  actions: ['approve', 'request-changes', 'manual-edit'],
  defaultAction: 'approve'
}
```

**Variants:**

1. **Single iteration** (usually approve) - Video Planner Steps 2-4
2. **Iterative refinement** (1-3 rounds) - Launch Optimizer Section 1 Step 4
3. **Selection from options** (pick 1 from N) - Launch Optimizer Section 5 Step 1

---

### 1.2 Auto-Advance Pattern

**Definition**: Step runs automatically without human intervention, outputs immediately available

**Video Planner Examples:**

- Step 2-2: Planning Brief (consolidation)
- Step 2-3: Planning Reference Card (formatting)

**Launch Optimizer Examples:**

- Section 1 Step 1: Configure
- Section 1 Step 2: Script Summary (parallel-ready)
- Section 1 Step 3: Script Abridgement (parallel-ready)
- Section 1 Step 5: Intro/Outro Separation (parallel-ready)
- Section 6 Steps 1-3: Description pipeline
- Section 4 Steps 1-3: Content analysis (though outputs mostly unused)

**Common Characteristics:**

- Pure transformation steps (input → output, no decisions)
- Consolidation steps (combine multiple attributes into single output)
- Formatting steps (restructure data for different use)

**Motus Implementation:**

```javascript
{
  type: 'auto-advance',
  timeout: 60000,  // Fail if exceeds 60 seconds
  retryOnError: true,
  maxRetries: 3
}
```

---

### 1.3 Quality Gate Pattern

**Definition**: Validation checkpoint that checks alignment/correctness before allowing workflow to proceed

**Video Planner Example:**

- **Step 5: Video Goal QA** - Validates talking points align with video goal
  - Critical checkpoint where contraction phase begins
  - Two outcomes: change talking points OR change goal/audience
  - Prevents misalignment from propagating to downstream steps (marketing, titles, thumbnails)

**Launch Optimizer Example:**

- **Section 1 Step 4: Abridge QA** - Validates transcript abridgement didn't lose critical content
  - ~20% need fixes (catches real problems)
  - 1-3 correction rounds typical
  - Prevents poor downstream chapter/description generation

**Common Characteristics:**

- **Validation-focused** (not generation-focused)
- **Conditional branching** (pass/fail with different actions)
- **Critical for quality** (skipping would cause downstream problems)
- **Relatively simple logic** (alignment check, not complex analysis)

**Motus Implementation:**

```javascript
{
  type: 'quality-gate',
  validation: {
    type: 'alignment-check',  // or 'completeness-check', 'accuracy-check'
    criteria: ['talking-points-match-goal', 'no-contradictions'],
    failureActions: ['refine-inputs', 'change-upstream', 'override']
  },
  blockDownstream: true  // Don't allow next steps until passed
}
```

---

### 1.4 Parallel Execution Opportunities

**Definition**: Multiple steps that can run simultaneously because they have no dependencies on each other

**Video Planner Opportunities:**

- **Section 1**: Steps 6 & 7 (both depend on Step 5 outputs, independent of each other)
- **Section 2**: Steps 2-2 & 2-3 ✅ CONFIRMED (both use same inputs)
- **Potential savings**: 3-5 minutes

**Launch Optimizer Opportunities:**

- **Section 1**: Steps 2, 3, 5, 6 (4 steps parallel after Step 1)
- **Section 4**: Steps 1, 2, 3 (3 steps parallel - if kept)
- **Section 7**: Steps 1 & 3 (Tweet + LinkedIn parallel)
- **Potential savings**: 10-13 minutes

**Common Characteristics:**

- Steps share same input dependencies
- Steps have different output attributes (no conflicts)
- Steps don't need each other's results

**Motus Implementation:**

```javascript
{
  type: 'parallel-group',
  steps: [
    { id: 'step-2-2', agent: 'planning-brief-agent' },
    { id: 'step-2-3', agent: 'reference-card-agent' }
  ],
  inputs: ['video_goal', 'target_audience', 'talking_points', ...],
  waitForAll: true,  // Continue only when all complete
  failureStrategy: 'wait-for-successful'  // Or 'fail-fast', 'continue-partial'
}
```

---

### 1.5 Consolidation Pattern

**Definition**: Combine multiple attributes into single formatted output for human consumption or next stage

**Video Planner Examples:**

- Step 2-2: Planning Brief (9 attributes → rich text factsheet)
- Step 2-3: Planning Reference Card (9 attributes → simplified reference card)

**Launch Optimizer Examples:**

- Section 6 Step 2: Write Description (multiple attributes → 9-section YouTube description)
- Section 6 Step 3: Format Description (markdown → YouTube-formatted text)

**Common Characteristics:**

- Multiple inputs → single output
- Usually auto-advance (pure transformation)
- Often formatting/presentation focused
- Can run in parallel with similar consolidation steps

**Motus Implementation:**

```javascript
{
  type: 'consolidation',
  template: 'planning-brief.hbs',  // Handlebars template
  inputs: ['video_goal', 'target_audience', 'talking_points', ...],
  output: 'planning_brief',
  format: 'rich-text',  // or 'json', 'markdown', 'youtube-format'
  autoAdvance: true
}
```

---

## 2. Unique Patterns (Workflow-Specific)

These patterns are unique to one workflow and may require specialized implementations.

### 2.1 Expansion-Contraction Philosophy (Video Planner ONLY)

**Definition**: Workflow designed to expand simple ideas into detail, then contract back to powerful distilled essence

**Implementation:**

1. **Start simple** (Step 1-2): Initial purpose/audience (not powerful)
2. **Expand outwards** (Steps 2-4): Add video goal, concept, talking points (greater detail)
3. **Quality gate** (Step 5): Validate alignment (contraction begins)
4. **Distill** (Steps 6-7): Project name, YouTube title (powerful distilled idea)

**Why Unique:**

- Launch Optimizer is purely sequential processing (transcript → outputs)
- Video Planner is iterative refinement (idea → expansion → validation → distillation)

**Motus Consideration:**

- This is workflow-level philosophy, not a pattern to codify
- Implementation should support this flow naturally through step sequencing
- Quality gate (Step 5) is critical to the philosophy

---

### 2.2 Fast-and-Furious Approach (Video Planner ONLY)

**Definition**: Optimize for SPEED over thoroughness - "better than nothing" is acceptable

**Characteristics:**

- 15-minute total target (vs Launch Optimizer's 60-90 minutes)
- Conscious trade-offs for speed:
  - Step 1: Optional preprocessing (skip if no conversation)
  - Step 2-1: Manual hook scenario (simplified vs multi-step generation)
  - Step 2-2/2-3: Auto-advance (no review)
- Use case: Quick prep before livestream/podcast recording

**Why Unique:**

- Launch Optimizer is thorough post-production (has recorded video, can take time)
- Video Planner is pre-production race (need to go live soon)

**Motus Consideration:**

- Support "workflow modes" (fast vs thorough)
- Allow skipping optional steps in fast mode
- Auto-advance more aggressively in fast mode

---

### 2.3 Flexible Selection Pattern (Video Planner ONLY)

**Definition**: AI provides suggestions to INSPIRE user, not strict "select from list" - user often creates own version

**Examples:**

- **Step 6: Project Name** - AI suggests 5 names, user often creates own inspired by them
- **Step 7: YouTube Titles** - AI suggests 10 titles, user combines/modifies/creates new

**Why Unique:**

- Launch Optimizer has stricter selection: pick 1 from N options
  - Section 5 Step 1: Pick 1 title from 10 (or future: pick 1-3 for A/B testing)
  - Section 7 Step 1: Pick 1 tweet from 5 (sometimes merge)

**Difference:**

- **Video Planner**: Suggestions are INSPIRATION for creative work
- **Launch Optimizer**: Suggestions are OPTIONS to choose from

**Motus Consideration:**

```javascript
{
  type: 'flexible-selection',
  mode: 'inspire',  // vs 'strict-select'
  suggestions: 10,
  allowCustom: true,
  allowCombine: true,
  guidance: 'Use suggestions as inspiration for your own version'
}
```

---

### 2.4 Complex Iterative Refinement (Launch Optimizer ONLY)

**Definition**: Steps requiring multiple rounds of back-and-forth refinement with nuanced interactions

**Examples:**

- **Section 2 Step 2: Refine Chapters** - Uses folder names from recording session as critical input
- **Section 2 Step 3: Create Chapters** - Currently BROKEN, done manually (most hated task)

**Why Unique:**

- Video Planner's iterative steps (Step 7 YouTube titles) are creative iteration
- Launch Optimizer's iteration is correction/refinement for accuracy

**Motus Consideration:**

- Need support for "external data injection" (folder names from file system)
- Need better chapter creation AI (high-value improvement opportunity)

---

## 3. Cross-Workflow Elements

These elements appear in BOTH workflows and need coordination strategy.

### 3.1 YouTube Title Generation - DUPLICATION

**Appears In:**

- **Video Planner Step 7** (Section 1): Planning phase BEFORE recording
- **Launch Optimizer Section 5 Step 1**: Launch phase AFTER recording (has transcript)

**Key Differences:**

| Aspect             | Video Planner Step 7           | Launch Optimizer Sec 5-1          |
| ------------------ | ------------------------------ | --------------------------------- |
| **Timing**         | Pre-production planning        | Post-production launch            |
| **Available Data** | Goal, audience, talking points | Transcript, actual content        |
| **Purpose**        | Guide recording direction      | Attract viewers to finished video |
| **Accuracy**       | Based on plan (may diverge)    | Based on actual content           |
| **Usage Pattern**  | Flexible Selection (inspire)   | Strict Selection (pick 1 from 10) |

**Problem:**

- Same prompt appears twice (or very similar prompts)
- Planning title might not match final content
- Redundant step if both used

**Possible Solutions:**

**Option A: Sequential Reuse**

- Use Video Planner title as INPUT to Launch Optimizer title generation
- Prompt: "Here's the planned title. Based on transcript, suggest refinements or confirm it works."

**Option B: Different Prompts**

- Video Planner: Generate "working titles" for direction/focus
- Launch Optimizer: Generate "marketing titles" for clickthrough optimization
- Different purposes, both valuable

**Option C: Skip in Launch Optimizer if Video Planner Used**

- If workflow data shows Video Planner was run, pre-fill title and skip Section 5-1
- User can override if video diverged significantly from plan

**Motus Consideration:**

```javascript
// Cross-workflow data sharing
{
  workflowId: 'launch-optimizer',
  section: 5,
  step: 1,
  checkPreviousWorkflow: 'video-planner',
  strategy: 'prefill-if-exists',  // or 'merge-suggestions', 'skip-if-exists'
  prefillAttributes: ['youtube_title', 'title_ideas']
}
```

---

## 4. Human-in-the-Loop Pattern Comparison

### Pattern Types Found

| Pattern Type                       | Video Planner      | Launch Optimizer                   | Motus Primitive?                       |
| ---------------------------------- | ------------------ | ---------------------------------- | -------------------------------------- |
| **Review & Approve**               | Steps 2, 3, 4, 6   | Sec 1-4, Sec 5-1, Sec 6-1, Sec 7-3 | ✅ YES                                 |
| **Auto-Advance**                   | Steps 2-2, 2-3     | Sec 1 (Steps 1,2,3,5), Sec 6 (1-3) | ✅ YES                                 |
| **QA with Conditional Refinement** | Step 5             | Sec 1-4                            | ✅ YES (Quality Gate)                  |
| **Flexible Selection**             | Steps 6, 7         | -                                  | ⚠️ Maybe (variant of Review & Approve) |
| **Strict Selection**               | -                  | Sec 5-1, Sec 7-1                   | ⚠️ Maybe (variant of Review & Approve) |
| **Complex Iterative**              | Step 7 (sometimes) | Sec 2-2, Sec 2-3                   | ❌ NO (too varied)                     |
| **Manual Input + Auto-generate**   | Step 2-1           | -                                  | ⚠️ Maybe (common enough)               |
| **Optional Preprocessing**         | Step 1             | -                                  | ❌ NO (workflow-specific)              |

### Human Checkpoint Density

**Video Planner:**

- 5-6 checkpoints in 10 active steps = **50-60% checkpoint rate**
- All checkpoints in Section 1 (planning phase)
- Section 2 is 100% auto-advance (execution phase)

**Launch Optimizer:**

- 6 checkpoints in 16-18 active steps = **33-37% checkpoint rate**
- Checkpoints distributed across all sections
- Some sections 100% auto (Section 6), some 100% manual (Section 2-3)

**Insight:**

- Video Planner front-loads human decisions (get plan right, then execute)
- Launch Optimizer distributes decisions (review at each stage)
- Both valid, depends on workflow philosophy

---

## 5. Parallelization Strategy Comparison

### Video Planner Parallelization

**Opportunities:**

1. **Section 1**: Steps 6 & 7 (after Step 5 quality gate)
   - Both depend on validated goal/audience/points
   - Generate project name + YouTube titles simultaneously
   - **Savings**: 2-3 minutes

2. **Section 2**: Steps 2-2 & 2-3 ✅ CONFIRMED
   - Both use same 9 inputs
   - Generate brief + reference card simultaneously
   - **Savings**: 1-2 minutes

**Total Potential**: 3-5 minutes (20-33% time reduction on 15-min workflow)

**Characteristics:**

- Small parallel groups (2 steps at a time)
- All parallelization in latter half of workflow (after decisions made)

---

### Launch Optimizer Parallelization

**Opportunities:**

1. **Section 1**: Steps 2, 3, 5, 6 (after Step 1 config)
   - All pure transcript analysis (independent)
   - 4 steps run simultaneously
   - **Savings**: 4-5 minutes

2. **Section 4**: Steps 1, 2, 3 (if kept)
   - All content analysis steps
   - 3 steps run simultaneously
   - **Savings**: 4-6 minutes

3. **Section 7**: Steps 1 & 3
   - Tweet + LinkedIn post generation
   - 2 steps run simultaneously
   - **Savings**: 2 minutes

**Total Potential**: 10-13 minutes (11-14% time reduction on 90-min workflow)

**Characteristics:**

- Larger parallel groups (2-4 steps at a time)
- Parallelization throughout workflow
- Higher absolute time savings (but similar relative %)

---

### Motus Parallelization Primitives Needed

```javascript
// Simple parallel group (Video Planner style)
{
  type: 'parallel-group',
  steps: ['step-6', 'step-7'],
  waitForAll: true
}

// Large parallel group (Launch Optimizer style)
{
  type: 'parallel-group',
  steps: ['step-2', 'step-3', 'step-5', 'step-6'],
  waitForAll: true,
  timeout: 300000,  // 5 minutes for all
  partialFailure: 'continue'  // If step-6 fails, still use 2,3,5 results
}

// Conditional parallelization
{
  type: 'parallel-group',
  steps: ['tweet-gen', 'linkedin-gen', 'facebook-gen'],
  condition: 'user-enabled',  // Only run if user wants social posts
  waitForAll: false,  // Can proceed when first completes
  displayProgress: true  // Show parallel execution to user
}
```

---

## 6. State Management Patterns

### Attribute Flow Patterns

**Video Planner Flow:**

```
Step 1 (optional): preliminary_conversation
  ↓ (extracts)
Step 2: initial_purpose, initial_audience
  ↓ (refines)
  video_purpose, target_audience
  ↓
Step 3: video_goal, video_concept
  ↓
Step 4: talking_points
  ↓
Step 5: (validates alignment, may loop back)
  ↓
Steps 6 & 7: project_name, youtube_title
  ↓
Step 2-1: script_hook, script_overview
  ↓
Steps 2-2 & 2-3: planning_brief, planning_reference_card
```

**Characteristics:**

- Linear dependency chain (each step builds on previous)
- One critical branch point (Step 5 QA may loop back)
- Attributes rarely reused (each step consumes previous, generates new)

---

**Launch Optimizer Flow:**

```
Step 1-1: transcript, project_folder
  ↓ (generates)
  project_code, short_title, title_ideas
  ↓
Steps 1-2,3,5,6: (parallel - all use transcript)
  ↓
  transcript_summary, transcript_abridgement, transcript_intro/outro
  ↓
Step 1-4: (QA - validates abridgement)
  ↓
Section 2: chapters (complex, broken)
  ↓
Section 4: keywords, entities, themes (mostly unused)
  ↓
Section 5-1: youtube_title (selected from options)
  ↓
Section 6: description (3-step pipeline)
  ↓
Section 7: social_posts (Tweet, LinkedIn, etc.)
```

**Characteristics:**

- Tree structure (transcript branches to multiple analyses)
- Multiple checkpoints throughout
- Attributes reused extensively (transcript used in 10+ steps)
- Some pipelines (Section 6: Step 1 → 2 → 3)

---

### Motus State Management Needs

```javascript
// Attribute dependency tracking
{
  stepId: 'step-2-video-idea',
  inputs: {
    required: ['initial_purpose', 'initial_audience'],
    optional: ['preliminary_conversation']
  },
  outputs: ['video_purpose', 'target_audience'],
  validation: {
    'video_purpose': { minLength: 50, maxLength: 500 },
    'target_audience': { minLength: 30, maxLength: 300 }
  }
}

// Reusable attribute (used by multiple steps)
{
  attribute: 'transcript',
  usedBy: ['step-1-2', 'step-1-3', 'step-1-5', 'step-2-1', ...],
  cacheStrategy: 'persist',  // Don't reload for each step
  largeData: true  // Handle efficiently
}

// Conditional attributes (depends on workflow path)
{
  attribute: 'preliminary_conversation',
  condition: 'step-1-used',
  optional: true,
  fallback: null
}
```

---

## 7. Error Handling & Recovery Patterns

### Video Planner Approach

**Philosophy**: "Fast and furious" means minimal error handling, manual recovery

**Observed Patterns:**

- **Step 1 complexity**: 3 usage scenarios (A/B/C) - user manually chooses path
- **Step 5 QA failure**: Human loops back to fix talking points or goal
- **Step 7 not-quite-right**: Iterative refinement until acceptable

**No evidence of:**

- Automatic retries
- Timeout handling
- Partial results handling

**User expectation**: If something fails, human fixes it manually

---

### Launch Optimizer Approach

**Philosophy**: Thorough processing means more error scenarios to handle

**Observed Patterns:**

- **Section 1 Step 4 QA**: ~20% failure rate, 1-3 correction rounds built into workflow
- **Section 2 Step 3 broken**: User does manually (complete failure, no recovery)
- **Section 4 outputs unused**: Steps run successfully but outputs discarded (soft failure)

**Challenges:**

- Chapter creation completely broken (needs manual recovery every time)
- Some steps run but produce poor quality (e.g., Step 2-1 too many chapters)

**User tolerance**: More willing to iterate since not time-pressured

---

### Motus Error Handling Needs

```javascript
{
  errorHandling: {
    // Automatic retry for transient failures
    autoRetry: {
      enabled: true,
      maxAttempts: 3,
      backoffMs: [1000, 5000, 15000]
    },

    // Timeout handling
    timeout: {
      warningMs: 45000,  // Warn at 45 seconds
      failMs: 60000,     // Fail at 60 seconds
      onTimeout: 'prompt-user'  // or 'retry', 'skip', 'fail-workflow'
    },

    // Validation failures
    validation: {
      onFailure: 'show-error-and-retry',  // or 'skip-step', 'use-default'
      allowManualOverride: true
    },

    // Quality failures (QA steps)
    qualityGate: {
      onFailure: 'loop-back',  // Return to previous step
      maxLoops: 3,
      escalate: 'manual-intervention'  // After max loops
    },

    // Complete step failure
    stepFailure: {
      onFailure: 'prompt-user',  // Ask: retry, skip, manual, abort
      allowSkip: true,
      allowManual: true
    }
  }
}
```

---

## 8. Design vs Reality Gap

Both workflows show significant gap between designed steps and actually-used steps.

### Video Planner Gap

| Metric        | Designed | Actually Used | Usage % |
| ------------- | -------- | ------------- | ------- |
| Sections      | 3        | 2             | 67%     |
| Steps         | 16       | 10            | 62%     |
| Time designed | Unknown  | 15 minutes    | -       |

**Sections not used:**

- Section 3: Content Development (5 steps) - NEVER USED

**Why:**

- Section 3 is for script creation (Video Planner is for livestreams/podcasts, no script needed)
- Fast-and-furious approach means unnecessary steps dropped

---

### Launch Optimizer Gap

| Metric        | Designed | Actually Used | Usage % |
| ------------- | -------- | ------------- | ------- |
| Sections      | 8        | 5-6           | 62-75%  |
| Steps         | 35       | 16-18         | 46-51%  |
| Time designed | Unknown  | 60-90 minutes | -       |

**Sections deprecated/unused:**

- Section 3: B-Roll Suggestions (4 steps) - Should be own workflow
- Section 8: YouTube Shorts (3 steps) - Should be own workflow
- Section 4: Content Analysis (3 steps) - Runs but outputs mostly unused
- Section 5: Partial (Steps 2-6 not used, only Step 1)

**Why:**

- Some workflows too complex to embed (B-Roll, Shorts)
- Some outputs not useful enough (keywords, entities)
- Some broken/poor quality (chapters, thumbnails)

---

### Insight for Motus

**Don't over-design workflows upfront:**

- Start with core 8-12 steps that solve primary use case
- Add steps incrementally based on real usage
- Expect ~50-60% of designed steps to be actively used
- Design for easy step removal/skipping

**Support workflow evolution:**

- Easy to disable steps without breaking workflow
- Easy to split sections into separate workflows
- Easy to merge workflows when appropriate
- Version workflows so users can revert if needed

---

## 9. Recommendations for Motus Implementation

### Priority 1: Core Patterns (Must Have)

Implement these patterns as first-class Motus primitives:

1. **Review & Approve** - Most common checkpoint pattern (80% of human steps)
2. **Auto-Advance** - Essential for workflow flow (40-50% of steps)
3. **Quality Gate** - Critical validation pattern (1-2 per workflow)
4. **Parallel Execution** - 10-30% time savings potential
5. **Consolidation** - Common final-step pattern

**Estimated effort**: 3-4 weeks for all 5 patterns

---

### Priority 2: Workflow-Level Features (Should Have)

Support these workflow-level capabilities:

1. **State management** - Attribute dependency tracking, validation, caching
2. **Error handling** - Retries, timeouts, manual recovery, quality loops
3. **Cross-workflow data** - Share attributes between workflows (title duplication)
4. **Step disabling** - Easy skip/disable without breaking workflow
5. **Progress visibility** - Show user where in workflow, what's happening

**Estimated effort**: 2-3 weeks

---

### Priority 3: Advanced Patterns (Nice to Have)

Consider these for future enhancement:

1. **Flexible Selection vs Strict Selection** - Different selection UX modes
2. **Workflow modes** - Fast vs Thorough execution strategies
3. **Conditional steps** - Skip based on context (if video_planner_used, skip title gen)
4. **Partial failure handling** - Continue workflow with some steps failed
5. **A/B testing support** - Select multiple options for testing (future Launch Optimizer)

**Estimated effort**: 2-4 weeks

---

### Priority 4: Workflow-Specific (Later)

These are unique to specific workflows, implement in workflow definitions not core:

1. **Expansion-Contraction philosophy** - Video Planner specific
2. **Chapter creation from folder names** - Launch Optimizer specific
3. **Optional preprocessing** - Video Planner Step 1 scenarios
4. **Complex iterative refinement** - Workflow-defined, not system pattern

**Estimated effort**: Implemented per-workflow as needed

---

## 10. Implementation Recommendations

### Recommended Implementation Order

Based on analysis of both workflows:

**Option A: Video Planner First (RECOMMENDED)**

**Rationale:**

- Simpler workflow (10 steps vs 16-18)
- Clearer linear flow (easier to implement)
- 15-minute target is achievable quick win
- Tests core patterns without complexity
- Section 2 perfect for parallelization testing

**What you'll build:**

- Review & Approve pattern (Steps 2, 3, 4, 6, 7)
- Auto-Advance pattern (Steps 2-2, 2-3)
- Quality Gate pattern (Step 5)
- Parallel execution (Steps 2-2 & 2-3)
- Manual input + auto-generate (Step 2-1)

**What you'll defer:**

- Complex iteration (Step 7 variants)
- Optional preprocessing (Step 1 scenarios)
- Cross-workflow coordination

**Timeline**: 3-4 weeks for MVP (10 steps, core patterns)

---

**Option B: Launch Optimizer First**

**Rationale:**

- More comprehensive workflow (tests more patterns)
- Higher user value (most time-intensive workflow)
- Chapter creation fix is high-value quick win
- Tests complex parallelization (4 steps at once)

**Challenges:**

- More complex (16-18 steps)
- More varied patterns
- Broken steps need fixing (Chapter creation)
- May take longer to show value

**Timeline**: 5-6 weeks for MVP

---

**Option C: Hybrid Approach**

**Rationale:**

- Build core patterns from Video Planner (3 weeks)
- Immediately apply to Launch Optimizer (2 weeks)
- Gives fastest validation of pattern reusability

**Timeline**: 5 weeks total (but validates architecture earlier)

---

### Recommended: Option A (Video Planner First)

**Reasons:**

1. **Faster time to value** (3-4 weeks vs 5-6 weeks)
2. **Clearer validation** (simpler workflow = clearer pattern fit)
3. **Better testing ground** (less complexity = easier debugging)
4. **User benefit earlier** (15-min workflow automated sooner)
5. **Builds confidence** (success here validates approach for Launch Optimizer)

**After Video Planner working:**

- Apply learned patterns to Launch Optimizer
- Fix chapter creation (high-value opportunity)
- Implement advanced patterns discovered

---

## 11. Next Steps

1. **Review this document** with user for feedback
2. **Create RECOMMENDED-NEXT-STEPS.md** with specific implementation plan
3. **Choose implementation path** (Video Planner vs Launch Optimizer vs Hybrid)
4. **Define MVP scope** (which patterns, which steps)
5. **Start implementation** (build core patterns, test with chosen workflow)

---

**Document Status**: Complete
**Created**: 2025-10-24
**Last Updated**: 2025-10-24
