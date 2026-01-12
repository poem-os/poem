# Vibe Deck - Context Engineering Research

**Source**: Raw research extracted 2026-01-12
**Purpose**: Understanding what vibe coders and context engineers actually do to inform hardware design

---

## Research Goal

Understand the **actual human-in-the-loop interactions** for vibe coding across different personas, workflow stages, and toolchains to determine:
- What buttons/sliders/context switches are needed
- What feedback mechanisms matter
- What actions are frequent vs rare
- What causes cognitive load

**Not product design yet—pure field research.**

---

## Summary 1: By Persona/Role

### 1. Product Owner / "Product Donor"

**Thinks in**: Intent, constraints, deltas

**What they actually type**:
- Problem framing: "We need X because Y, but Z constraint"
- Requirement clarification: "What assumptions are we making?"
- Change requests: "We need to support A now" / "Remove B, it's out of scope"
- Backlog shaping: "Break this into smaller tasks"
- Review prompts: "Does this meet the acceptance criteria?"

**Artifacts they create/maintain**:
- Requirements doc (PRD / Spec / OpenSPEC-style)
- Acceptance criteria
- Backlog / task list
- Change log
- Non-goals
- Release notes (occasionally)

**Agent usage**:
- One primary LLM instance
- Rarely autonomous agents
- Uses model as: Clarifier, Challenger, Spec writer, Summarizer

**Key behaviors**:
- Frequent context restatement
- Frequent "are we aligned?" checks
- Low tolerance for verbosity
- High tolerance for iteration

---

### 2. Developer

**Thinks in**: Intent → implementation → correction

**What they actually type**:
- Scaffolding: "Create file structure for X"
- Implementation: "Implement Y using Z"
- Debugging: "Why is this failing?"
- Testing: "Generate tests for this"
- Refactoring: "Clean this up"
- Explanation: "Explain this function"

**Artifacts**:
- Code
- Tests
- Diff summaries
- Commit messages
- PR descriptions
- Design notes (occasionally)

**Agent usage**:
- Primary LLM for code
- Sometimes secondary: Test generator, Refactor agent
- Rare use of fully autonomous agents (still supervising heavily)

**Key behaviors**:
- Constant prompt refinement
- Frequent retry / regenerate
- Switching between files and mental models
- **Wants diffs, not essays**

---

### 3. QA / Tester

**Thinks in**: Finding mismatches, not building

**What they type**:
- "What are the edge cases?"
- "Generate test cases"
- "How would this break?"
- "Write repro steps"
- "What's missing?"

**Artifacts**:
- Test plans
- Test cases
- Bug reports
- Repro steps
- Regression lists

**Agent usage**:
- Often separate LLM window
- Uses model as: Adversary, Edge-case generator, Checklist generator

**Key behaviors**:
- Repeatedly reframes: "Assume this fails"
- Wants structured output
- Less iteration, more breadth

---

### 4. Context Engineer / "Meta Operator"

**The glue role** (sometimes implicit)

**What they actually do**:
- Maintain shared context
- Decide what goes into which prompt
- Decide what gets summarized vs dropped
- Rewrite prompts for clarity
- Decide when to checkpoint

**Artifacts**:
- Prompt templates
- Context summaries
- System instructions
- Workflow rules

**Agent usage**:
- Multiple LLM windows
- Sometimes orchestrators (AutoClaude / GasTown)
- Heavy use of summaries and role prompts

**Key behaviors**:
- Constant context compression
- Frequent role switching
- Very sensitive to drift

---

## Summary 2: By Workflow Stage

### Stage 1: Framing / Brief
**Human actions**: Dump messy intent, ask clarifying questions, define success
**Inputs**: Free text, bullet points, voice (sometimes)
**Outputs**: Short spec, goal statement, constraints

### Stage 2: Specification
**Human actions**: Expand intent into structure, define AC, define non-goals
**Inputs**: "Turn this into a spec", "Add edge cases"
**Outputs**: PRD / SPECkit / OpenSPEC doc, task list

### Stage 3: Breakdown / Planning
**Human actions**: Decompose work, sequence tasks, decide manual vs AI
**Inputs**: "Break this into steps", "Estimate complexity"
**Outputs**: Tasks, subtasks, implementation plan

### Stage 4: Implementation
**Human actions**: Generate code, correct code, refine prompts
**Inputs**: "Implement X", "Fix this error"
**Outputs**: Code, diffs

### Stage 5: Validation / Testing
**Human actions**: Ask for tests, probe edge cases, simulate failure
**Inputs**: "Generate tests", "What breaks this?"
**Outputs**: Test cases, bug lists

### Stage 6: Review / Polish
**Human actions**: Refactor, improve readability, review risks
**Inputs**: "Clean this up", "Review this"
**Outputs**: Refined code, review notes

### Stage 7: Ship / Handoff
**Human actions**: Summarize changes, create release notes, prepare rollback
**Inputs**: "Summarize", "Write release notes"
**Outputs**: PR, docs, notes

---

## Summary 3: By Toolchain / Environment

### Claude Console / Dual-Window Setup
**Reality**: Two roles, two windows, manual handoff, very high clarity
**Human behavior**: Copy/paste between windows, manual summarization, strong role discipline
**Pain**: Context drift, manual switching

### Replit / Lovable (Vibe Coding)
**Reality**: Fast iteration, low ceremony
**Human behavior**: Short prompts, immediate feedback, less documentation
**Pain**: Harder to step back, specs get fuzzy

### BMAD / SPECkit / OpenSPEC
**Reality**: Structured, explicit, doc-heavy upfront
**Human behavior**: More time specifying, less rework later
**Pain**: Overhead, requires discipline

### AutoClaude / GasTown
**Reality**: Agent-driven, humans supervise
**Human behavior**: Define rules, monitor output, interrupt often
**Pain**: Trust calibration, debugging agents is hard

### VibeKanban
**Reality**: Visual flow, status-driven
**Human behavior**: Move cards, ask "what's next?"
**Pain**: Still manual context sync

---

## What Actually Matters for a Vibe Deck

### Core Human Actions (These ARE the interactions)
1. **Role switching** (PO → Dev → QA → Context Engineer)
2. **Context summarization** ("What changed?", "Where are we?")
3. **Prompt reuse** (Save/load common prompts)
4. **"What changed?"** (Diff view, status check)
5. **"What's next?"** (Next action suggestion)
6. **Mode switching** (Spec mode / Build mode / Test mode)
7. **Interrupting / correcting AI** ("Stop", "No, like this")
8. **Saving state** (Checkpoint current context)
9. **Reframing intent** ("Let me restate the goal")

### What Humans Are NOT Doing
- Writing long prompts
- Managing complex UI
- Debugging workflows
- Heavy typing (mostly short commands/questions)

---

## Key Insight: Simplicity

> "Most of this is incredibly simple. The documents and agents could be complex, but the **human-in-the-loop interactions are piss easy**."

The hardware needs to support:
- **Fast role/mode switching**
- **Quick context checks**
- **Interrupt/correct flows**
- **State checkpointing**

NOT:
- Complex input
- Long text entry
- Detailed configuration

---

## Next Research Steps

Before hardware design, need to:

1. **Extract top 20 universal human actions**
2. **Rank by frequency** (what happens 50x per session vs 2x)
3. **Rank by cognitive load** (what breaks flow vs what flows)
4. **Only then** map to:
   - Buttons (discrete actions)
   - Sliders (gradual adjustments)
   - Modes (role/stage switches)
   - Feedback (LEDs/displays showing state)

---

## Observations on Documents & Agents

### Documents Involved
Most common artifacts:
- Requirements/specs (PRD, OpenSPEC)
- Backlogs/task lists
- Code/tests
- Diffs/commit messages
- Test cases/bug reports
- Context summaries
- Prompt templates

### Agent Patterns
- **Primary LLM** (main conversation partner)
- **Secondary specialists** (test gen, refactor, edge case finder)
- **Orchestrators** (AutoClaude, GasTown - supervise multiple agents)
- **Role-based prompting** (same LLM, different persona)

### Context Management
Critical pain point across all environments:
- Context drift over time
- Deciding what to keep vs summarize
- Handoff between roles/windows
- Maintaining alignment across team

---

## Hardware Design Constraints (Not Features)

From this research, constraints for VibeDeck design:

1. **Optimized for switching**, not input
2. **Fast feedback** (LEDs/display showing current state)
3. **Voice-first for longer inputs** (mic + push-to-talk)
4. **Buttons for discrete actions** (role, mode, checkpoint)
5. **Minimal typing required** (most commands are short)
6. **Status visibility** (what mode, what role, what changed)
7. **Interrupt-friendly** (easy to stop/correct AI)

---

**Last Updated**: 2026-01-12
**Next**: Canonical action set extraction + frequency ranking
