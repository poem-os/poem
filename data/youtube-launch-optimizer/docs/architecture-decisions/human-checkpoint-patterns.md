# Human Checkpoint Patterns for Workflow Design

**Date**: 2026-02-04
**Context**: Section 5-2 analysis reveals sophisticated human-in-the-loop requirements
**Purpose**: Document checkpoint patterns for Epic 6 (Workflow Engine) implementation

---

## Overview

Human checkpoints are **workflow pause points** where AI cannot proceed without human input. Analysis of YouTube Launch Optimizer reveals **three distinct checkpoint patterns** with different complexity levels and workflow implications.

---

## Three Checkpoint Patterns

### Pattern 1: Simple Selection (Pick One)

**Example**: Section 3, Step 3-1 → 3-2 (deprecated, but pattern valid)
- AI generates 10 style options
- Human picks 1
- Selected value becomes `{{designStyle}}` for next step

**Characteristics**:
- **Input type**: Single selection from generated list
- **UI component**: Radio buttons or dropdown
- **Conversation turns**: 0 (no dialogue, just selection)
- **State stored**: Selected value only
- **Rationale captured**: No

**YAML representation**:
```yaml
- id: checkpoint-style-selection
  action: human-select
  input: styleIdeas (from previous step)
  output: designStyle
  ui:
    type: radio
    prompt: "Select one design style for this video:"
```

---

### Pattern 2: Text Input (Free-Form)

**Example**: Section 3, Step 3-3 (deprecated, but pattern valid)
- Prompt needs `{{videoEditorInstructions}}`
- Human provides custom text input
- Not from workflow bus (external context)

**Characteristics**:
- **Input type**: Free-form text
- **UI component**: Text area
- **Conversation turns**: 0 (no dialogue, just input)
- **State stored**: User-provided text
- **Rationale captured**: No

**YAML representation**:
```yaml
- id: checkpoint-special-instructions
  action: human-input
  output: videoEditorInstructions
  ui:
    type: textarea
    prompt: "Provide any special instructions for the video editor:"
    placeholder: "e.g., Focus on fast-paced editing, include brand colors..."
```

---

### Pattern 3: Facilitated Curation (Conversational) ⭐

**Example**: Section 5, Step 5-2 (select-title-shortlist)

**Process**:
1. AI presents analysis of candidates
2. AI asks 5 clarifying questions
3. Human responds to questions
4. AI creates curated shortlist based on input
5. AI captures rationale for each selection

**Characteristics**:
- **Input type**: Multi-question dialogue + selection with modification
- **UI component**: Conversational interface with structured questions
- **Conversation turns**: 5+ (interactive dialogue)
- **State stored**: Shortlist (2-4 titles) + human preferences + rationale
- **Rationale captured**: Yes (why each title was selected, what gap it fills)

**YAML representation**:
```yaml
- id: checkpoint-title-curation
  action: human-facilitate
  input: generatedTitles (from 5-1)
  output:
    shortlist: selectedTitles (2-4 items)
    preferences: davidInput (captured context)
  conversation:
    steps:
      - present_analysis:
          - hook_type_distribution
          - character_length_distribution
          - keyword_coverage
      - ask_questions:
          - keyword_priority
          - hook_preference
          - titles_you_like
          - titles_to_tweak
          - custom_angle
      - create_shortlist:
          capture_rationale: true
          capture_gap_filled: true
  ui:
    type: conversational
    allow_tweaks: true
    min_selections: 2
    max_selections: 4
```

---

## Comparison Matrix

| Pattern | Complexity | Turns | Rationale | State Captured | Example |
|---------|------------|-------|-----------|----------------|---------|
| **Simple Selection** | Low | 0 | No | Selected value | Pick 1 style |
| **Text Input** | Low | 0 | No | User text | Special instructions |
| **Facilitated Curation** | High | 5+ | Yes | Selection + preferences + rationale | Title shortlist |

---

## Workflow Engine Requirements

### 1. Checkpoint Types (Action Types)

**Epic 6 must support**:
```yaml
action: human-select     # Pattern 1
action: human-input      # Pattern 2
action: human-facilitate # Pattern 3
```

### 2. State Management

**Between checkpoints, workflow must preserve**:
- All prior outputs (workflow bus)
- Human input values
- Preferences/rationale (for facilitated checkpoints)

**Storage structure**:
```json
{
  "workflowState": {
    "stepOutputs": {
      "5-1": { "generatedTitles": [...] },
      "5-2": {
        "shortlist": [...],
        "davidInput": {
          "keywordPriority": "equal",
          "hookPreference": "curiosity",
          "customTweaks": "..."
        }
      }
    }
  }
}
```

### 3. UI Component Mapping

**Pattern 1** → Radio buttons, dropdown, or card selection
**Pattern 2** → Text area or rich text editor
**Pattern 3** → Conversational UI with:
- Presentation area (show analysis)
- Question/response flow (5 questions)
- Selection area with modification capability
- Rationale capture fields

### 4. Workflow Pause/Resume

**Checkpoints require**:
- Pause execution at checkpoint
- Wait for human input (async)
- Resume execution after input received
- Validate human input before proceeding

**State transitions**:
```
Running → Paused (awaiting human input)
Paused → Running (human input received, validation passed)
Paused → Error (invalid input, validation failed)
```

---

## Advanced: Preference Learning (Future)

**Pattern 3 (Facilitated Curation) enables preference learning**:

Section 5-2 captures:
```json
"davidInput": {
  "keywordPriority": "BMAD over SDK",
  "hookPreference": "curiosity > desire > fear",
  "commonTweaks": "shorten to 45 chars, front-load keywords"
}
```

**Future enhancement**:
- Store preferences across sessions
- Pre-populate questions with learned preferences
- Suggest selections based on past choices
- "David usually prefers curiosity hooks with 45-char limit"

**YAML extension**:
```yaml
- id: checkpoint-title-curation
  action: human-facilitate
  preferences:
    learn: true
    storage: user-profile
    pre_populate: true
```

---

## Non-Blocking vs Blocking Checkpoints

### Blocking Checkpoints (Current)
**Workflow cannot proceed without human input**

All current checkpoints are blocking:
- 5-2: Cannot generate thumbnail text without selected titles
- Section 3: Cannot create editor brief without style selection

### Non-Blocking Checkpoints (Future)
**Workflow can proceed with default/AI-selected values, but human can override**

Example:
```yaml
- id: checkpoint-title-selection
  action: human-select
  blocking: false
  default: ai-recommended
  timeout: 24h # Auto-proceed after timeout with default
```

**Use case**: "Generate titles, AI picks best, but David can override within 24 hours"

---

## Conversational Checkpoint Architecture

### Step-by-Step Flow (Pattern 3)

**Phase 1: Present Analysis**
```
AI → User: "Here are 10 generated titles. Distribution:
- Curiosity hooks: 4
- Desire hooks: 3
- Fear hooks: 3
Character lengths: 40-70 chars
Keywords covered: BMAD (7), Agent SDK (5), both (3)"
```

**Phase 2: Ask Questions** (5 questions, sequential or all-at-once)
```
AI → User:
Q1: "Keyword priority: BMAD, SDK, or equal?"
Q2: "Hook preference: Any to emphasize/avoid?"
Q3: "Which 2-3 titles stand out?"
Q4: "Any titles to tweak? What changes?"
Q5: "Custom angle to incorporate?"

User → AI: [Responses]
```

**Phase 3: Create Shortlist**
```
AI processes user input:
- Filters by preferences
- Applies tweaks to selected titles
- Generates 2-4 curated titles
- Documents rationale for each

AI → User: "Shortlist created (4 titles):
1. [Title] - Rationale: ... Gap filled: ...
2. [Title] - Rationale: ... Gap filled: ...
..."
```

**Phase 4: Capture State**
```
Store:
- shortlist (2-4 titles)
- davidInput (preferences)
- rationale (per title)

Resume workflow with shortlist
```

---

## YAML Workflow Examples

### Example 1: Section 5 (Title & Thumbnail)

```yaml
section_5:
  name: "Title & Thumbnail Generation"

  steps:
    # Step 1: Generate titles (no checkpoint)
    - id: 5-1
      action: llm
      prompt: generate-title
      inputs:
        - shortTitle
        - analyzeContentEssence
        - analyzeAudienceEngagement
        - analyzeCtaCompetitors
        - titleIdeas
      output: generatedTitles (10 titles)

    # Step 2: Human checkpoint (facilitated curation)
    - id: 5-2
      action: human-facilitate
      prompt: select-title-shortlist
      input: generatedTitles
      output:
        shortlist: selectedTitles
        preferences: davidInput
      conversation:
        phases:
          - present_analysis
          - ask_questions (5)
          - create_shortlist
        capture_rationale: true
      ui:
        type: conversational
        allow_modifications: true
        min_selections: 2
        max_selections: 4
      blocking: true

    # Step 3: Generate thumbnail text (uses shortlist)
    - id: 5-3
      action: llm
      prompt: generate-thumbnail-text
      inputs:
        - selectedTitles (from 5-2)
        - titleHookType
        - videoTopicTheme
        - emotionalTriggers
      output: thumbnailTextOptions (CSV)
```

---

## UI/UX Implications

### Pattern 1: Simple Selection
**UI**: Card grid or dropdown
**Interaction**: Click to select
**Validation**: Ensure 1 selected
**Time**: <30 seconds

### Pattern 2: Text Input
**UI**: Text area with placeholder
**Interaction**: Type free-form text
**Validation**: Min length (optional)
**Time**: 1-2 minutes

### Pattern 3: Facilitated Curation
**UI**: Multi-step conversational interface
**Interaction**:
- Step 1: View analysis (scroll/read)
- Step 2: Answer 5 questions (form or chat)
- Step 3: Review shortlist (approve/modify)
**Validation**: All questions answered, 2-4 selections
**Time**: 3-5 minutes

**Design recommendation**:
- Stepper UI (1/3 → 2/3 → 3/3)
- Progress indicator
- "Save & Continue Later" option

---

## Error Handling

### Checkpoint Failures

**Invalid input**:
```yaml
- User selects 0 titles (min: 2) → Error: "Select at least 2 titles"
- User selects 5 titles (max: 4) → Error: "Select maximum 4 titles"
- User skips question → Error: "Please answer all questions"
```

**Timeout**:
```yaml
- blocking: true + timeout: 24h → After 24h, send reminder
- blocking: false + timeout: 24h → After 24h, use AI default and proceed
```

**Workflow resume**:
```yaml
- User abandons checkpoint → Save partial state
- User returns → Resume from checkpoint with partial state
```

---

## Testing Checkpoints

### Unit Tests (Pattern-Level)

**Pattern 1 (Simple Selection)**:
- Test: User selects item → Output captured
- Test: User selects invalid index → Error
- Test: User skips selection → Validation error

**Pattern 2 (Text Input)**:
- Test: User provides text → Output captured
- Test: User provides empty text → Validation error (if required)
- Test: User provides text > max length → Truncated or error

**Pattern 3 (Facilitated Curation)**:
- Test: User answers all questions → Proceeds to shortlist
- Test: User skips question → Validation error
- Test: User tweaks title → Modified title in shortlist
- Test: Rationale captured for each selection

### Integration Tests (Workflow-Level)

**Checkpoint pause/resume**:
- Test: Workflow pauses at checkpoint
- Test: Workflow resumes after human input
- Test: State preserved across pause/resume

**Multi-checkpoint workflows**:
- Test: Section 5 (2 checkpoints: no checkpoints in 5-1, checkpoint in 5-2, no checkpoint in 5-3)
- Test: State flows correctly between checkpoints

---

## Migration Path

### Phase 1: Basic Checkpoints (MVP)
- Support Pattern 1 (simple selection)
- Support Pattern 2 (text input)
- Blocking checkpoints only
- Manual state management

### Phase 2: Advanced Checkpoints
- Support Pattern 3 (facilitated curation)
- Conversational UI
- Rationale capture
- Preference storage

### Phase 3: Intelligent Checkpoints
- Non-blocking checkpoints
- AI defaults with human override
- Preference learning
- Auto-resume with timeout

---

## Related Documents

- **SRP Prompt Design**: `srp-prompt-design.md` - Parallel execution (no checkpoints)
- **LATO Code Patterns**: `lato-code-patterns.md` - Fifth pattern: Facilitation
- **Section 5 Overview**: (to be created) - Complete Section 5 analysis

---

**Status**: Documented for Epic 6 (Workflow Engine) implementation
**Next**: Apply patterns to YAML workflow design
