# Getting Started with Workflows

**Target Audience**: Users who have installed POEM and organized their prompts, now wondering "what's next?"

**What You'll Learn**:
- When you need a workflow vs standalone prompts
- How the workflow data accumulation pattern works
- How to build your first 3-prompt workflow
- Real example walkthrough (YouTube Launch Optimizer)

---

## The Question: Do I Need a Workflow?

After organizing your prompts, you'll face this decision:

**Standalone Prompts** → Use when:
- Each prompt is independent
- No data needs to accumulate between prompts
- You're just organizing prompts for reuse
- Example: SupportSignal predicate prompts (12 independent classification prompts)

**Workflows** → Use when:
- Prompts build on each other
- Data accumulates across multiple steps
- You have a sequential process (Step 1 → Step 2 → Step 3)
- Example: YouTube Launch Optimizer (8 production lines, 54 prompts)

---

## The Data Flow Pattern

### Standalone Prompts (No Workflow)

```
┌─────────────────┐
│ Prompt 1        │ → Output
│ Input: Raw Data │
└─────────────────┘

┌─────────────────┐
│ Prompt 2        │ → Output
│ Input: Raw Data │
└─────────────────┘

┌─────────────────┐
│ Prompt 3        │ → Output
│ Input: Raw Data │
└─────────────────┘
```

**No accumulation**. Each prompt is self-contained.

### Workflow Pattern (With Accumulation)

```
┌─────────────────┐
│ Prompt 1        │ → Output A
│ Input: Raw Data │
└─────────────────┘
         ↓
┌─────────────────────┐
│ Prompt 2            │ → Output B
│ Input: Output A     │
└─────────────────────┘
         ↓
┌─────────────────────┐
│ Prompt 3            │ → Output C
│ Input: Output A + B │
└─────────────────────┘
```

**Data accumulates**. Each prompt builds on previous outputs.

**Where does this data live?** → `workflow-data/` (in dev mode: `dev-workspace/workflow-data/`)

---

## Your First Workflow: Predicate Analysis Pipeline

Let's build a simple 3-prompt workflow using the SupportSignal predicate pattern.

### Use Case

You have 12 predicate classification prompts (medical, behavioral, environmental, etc.). Instead of running them independently, you want to:

1. **Classify** the text with all predicates
2. **Observe** patterns in the classifications
3. **Report** recommendations based on patterns

### Step 1: Define the Workflow

Create `poem/workflows/predicate-analysis.yaml`:

```yaml
name: Predicate Analysis Pipeline
description: Classify text, observe patterns, generate recommendations

steps:
  - name: classify
    prompt: classify-all-predicates.hbs
    inputs:
      - shiftNoteText
    outputs:
      - classifications

  - name: observe
    prompt: observe-patterns.hbs
    inputs:
      - classifications
      - shiftNoteText
    outputs:
      - patterns
      - highRiskFlags

  - name: report
    prompt: generate-recommendations.hbs
    inputs:
      - classifications
      - patterns
      - highRiskFlags
    outputs:
      - recommendations
      - urgencyLevel
```

### Step 2: Create the Prompts

**1. `prompts/classify-all-predicates.hbs`**

```handlebars
You are a classification assistant. Analyze the following shift note text and classify it against ALL predicates.

Shift Note:
---
{{shiftNoteText}}
---

Predicates:
1. Medical concerns (medications, health issues)
2. Behavioral incidents (aggression, distress)
3. Environmental hazards (trip hazards, safety issues)
4. Social interactions (family visits, peer conflicts)
5. [... 8 more predicates]

Return JSON:
{
  "medical": { "present": true/false, "evidence": "..." },
  "behavioral": { "present": true/false, "evidence": "..." },
  ...
}
```

**2. `prompts/observe-patterns.hbs`**

```handlebars
You are a pattern recognition assistant. Analyze these classifications for concerning patterns.

Classifications:
{{json classifications}}

Original Text:
{{shiftNoteText}}

Identify:
1. Multiple high-risk categories present
2. Escalation indicators (compared to baseline)
3. Co-occurring concerns (medical + behavioral)

Return JSON:
{
  "patterns": ["pattern1", "pattern2"],
  "highRiskFlags": ["flag1", "flag2"]
}
```

**3. `prompts/generate-recommendations.hbs`**

```handlebars
You are a care planning assistant. Generate recommendations based on analysis.

Classifications: {{json classifications}}
Patterns: {{json patterns}}
High-Risk Flags: {{json highRiskFlags}}

Generate:
1. Immediate actions required
2. Follow-up items for care team
3. Escalation required? (yes/no)
4. Urgency level (low/medium/high/critical)

Return JSON:
{
  "recommendations": ["action1", "action2"],
  "urgencyLevel": "high"
}
```

### Step 3: Execute the Workflow

```bash
# Activate Prompt Engineer agent
/poem/agents/prompt-engineer

# Initialize workflow with input data
*run predicate-analysis --input shiftNoteText="Participant refused medications this morning..."

# Workflow executes:
# 1. classify → saves classifications to workflow-data/
# 2. observe → reads classifications, saves patterns to workflow-data/
# 3. report → reads classifications + patterns, saves recommendations to workflow-data/
```

### What Happens Behind the Scenes

```
dev-workspace/workflow-data/predicate-analysis-abc123/
├── input.json              # Initial input (shiftNoteText)
├── step-1-classify.json    # Output from step 1
├── step-2-observe.json     # Output from step 2
└── step-3-report.json      # Final output
```

**Data accumulation**:
- Step 1 creates `classifications`
- Step 2 reads `classifications`, creates `patterns` and `highRiskFlags`
- Step 3 reads all previous outputs, creates final `recommendations`

---

## Real Example: YouTube Launch Optimizer

The YouTube Launch Optimizer (`data/youtube-launch-optimizer/`) demonstrates the workflow pattern at scale.

### The Pattern

**Factory**: YouTube video publishing workflow
**Production Lines**: 8 phases (Video Preparation → YouTube Metadata → Social Posts)
**Stations**: 54 prompts (each is a "station" in the production line)

### Phase 1: Video Preparation (6 prompts)

```yaml
# Step 1: Configure
inputs: [transcript]
outputs: [projectCode, shortTitle]

# Step 2: Script Summary
inputs: [transcript]
outputs: [transcriptSummary]

# Step 3: Script Abridgement
inputs: [transcript, transcriptSummary]  # ← Uses output from Step 2
outputs: [transcriptAbridgement]

# Step 4: Abridge QA
inputs: [transcript, transcriptAbridgement]  # ← Uses output from Step 3
outputs: [discrepancies]
```

**Notice the pattern**: Each step builds on previous outputs. By Step 4, you have:
- `transcript` (original input)
- `projectCode`, `shortTitle` (from Step 1)
- `transcriptSummary` (from Step 2)
- `transcriptAbridgement` (from Step 3)

### Phase 2: Build Chapters (3 prompts)

```yaml
# Step 1: Identify chapters
inputs: [transcript, transcriptAbridgement]  # ← Uses outputs from Phase 1
outputs: [identifyChapters]

# Step 2: Refine chapters
inputs: [identifyChapters, transcript]
outputs: [chapters]

# Step 3: Add timestamps
inputs: [chapters, srt]
outputs: [chapters]  # Enhanced with timestamps
```

**Data accumulation continues**. By the end of Phase 2, you have everything from Phase 1 PLUS chapters.

### Why This Works

**Single workflow-data directory** accumulates ALL outputs:

```
workflow-data/youtube-video-xyz/
├── input.json                    # Original transcript
├── phase1-step1-configure.json   # projectCode, shortTitle
├── phase1-step2-summary.json     # transcriptSummary
├── phase1-step3-abridge.json     # transcriptAbridgement
├── phase2-step1-identify.json    # identifyChapters
├── phase2-step2-refine.json      # chapters
└── phase2-step3-timestamps.json  # chapters (enhanced)
```

By Phase 8 (YouTube Shorts), you can reference ANY output from Phases 1-7.

---

## When You DON'T Need Workflows

### SupportSignal Predicate Classification (Standalone)

If you have 12 predicates and you just want to classify text:

```
prompts/
├── predicate-medical.hbs
├── predicate-behavioral.hbs
├── predicate-environmental.hbs
└── ... (9 more)
```

**No workflow needed**. Each predicate runs independently:

```bash
# Run one predicate
*prompt predicate-medical --input text="..."

# Run another predicate
*prompt predicate-behavioral --input text="..."
```

**No accumulation**. Each classification is self-contained.

### When to Add a Workflow

**If you later want to**:
1. Run ALL predicates together
2. Analyze patterns across classifications
3. Generate recommendations based on patterns

**Then wrap them in a workflow** (like the example above).

---

## External Data Integration

**Question**: "Do I always use workflow-data/?"

**Answer**: No. workflows are for POEM-orchestrated processes.

### Pattern 1: POEM Workflows (Internal Data)

```
workflow-data/
└── my-workflow-run-123/
    ├── step1-output.json
    ├── step2-output.json
    └── step3-output.json
```

Use when: POEM manages the entire process (like YouTube Launch Optimizer)

### Pattern 2: External Data Sources

```yaml
# SupportSignal integration
steps:
  - name: classify
    prompt: classify-shift-note.hbs
    inputs:
      - shiftNoteText  # ← From database export, NOT workflow-data/
    outputs:
      - classification  # → Saved to workflow-data/ OR sent back to DB
```

Use when: Input comes from external system (database, API, file export)

### Pattern 3: Hybrid

```yaml
steps:
  - name: import
    prompt: parse-database-export.hbs
    inputs:
      - dbExport  # ← External
    outputs:
      - normalizedData  # → workflow-data/

  - name: process
    prompt: analyze-data.hbs
    inputs:
      - normalizedData  # ← From workflow-data/ (Step 1)
    outputs:
      - analysis  # → workflow-data/

  - name: export
    prompt: format-for-database.hbs
    inputs:
      - analysis  # ← From workflow-data/ (Step 2)
    outputs:
      - dbUpdate  # → Could be sent back to external system
```

---

## Summary

### Decision Tree

```
Do my prompts need outputs from previous prompts?
├─ NO  → Standalone prompts (no workflow)
└─ YES → Workflow
    │
    └─ Does data accumulate across 3+ steps?
        ├─ NO  → Consider 2-step workflow or just compose manually
        └─ YES → Definitely use workflow (like YouTube Launch Optimizer)
```

### Key Concepts

1. **Standalone Prompts**: Independent, no accumulation (SupportSignal predicates)
2. **Workflows**: Sequential, data accumulates (YouTube Launch Optimizer)
3. **workflow-data/**: Storage for accumulated workflow outputs
4. **External Data**: Workflows can integrate external data sources

### Next Steps

**Read**:
- `data/youtube-launch-optimizer/README.md` - Full real-world example
- `data/supportsignal/` - Standalone prompt examples

**Try**:
1. Organize your prompts (standalone or workflow?)
2. If workflow: Define `workflows/my-workflow.yaml`
3. Create prompts with Handlebars placeholders
4. Run workflow with `/poem/agents/prompt-engineer`

---

**Created**: 2026-01-16
**Status**: User onboarding guide
