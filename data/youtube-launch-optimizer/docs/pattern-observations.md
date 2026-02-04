# Prompt Design Observations

This document captures design issues, anti-patterns, and improvement opportunities discovered while reviewing the YouTube Launch Optimizer prompts.

## Purpose

As we review and format these 54 prompts, we're identifying conceptual problems that may need refactoring to align with POEM's architecture. These observations help us:

1. Understand legacy design decisions
2. Identify mixed concerns and anti-patterns
3. Plan future refactoring work
4. Document the evolution from the old system to POEM

---

## Observations by File

### `1-1-configure.hbs`

**Issue:** Mixed Concerns - Configuration vs Processing

**Current Behavior:**
The prompt tries to do two things:
1. **Input/Configuration** - Gather project metadata (project code, short title, project folder, transcript)
2. **Processing** - Analyze transcript and generate suggested titles

**Problem:**
In POEM's architecture, "Configure" should be a human-in-the-loop input step that simply loads and validates data. It shouldn't perform AI analysis or content generation.

**What's Mixed:**
- ✅ **Configuration** (appropriate): Project code, project folder, short title
- ❌ **Processing** (should be separate): "Read the transcript and generate 3-7 alternative titles"

**POEM-Aligned Design:**
- **Step 1-1 (Configure)**: Load project metadata, validate inputs, prepare transcript
- **Step 1-2 (Generate Titles)**: Analyze transcript and suggest titles

**Impact:**
- Low urgency - the prompt still works functionally
- Medium priority - misaligns with POEM's separation of concerns
- Affects reusability - can't reuse title generation for other workflows

**Notes:**
This pattern likely came from a previous system where configuration and processing were bundled together. In POEM, we prefer clear separation: input → validate → process → output.

---

## Pattern: Configuration Anti-Pattern

**What to watch for:**
Prompts named "configure" or "setup" that do more than gather and validate inputs.

**Red flags:**
- Instructions like "read the X and generate Y"
- Output formats that include derived/analyzed data (not just echoing inputs)
- Multiple distinct processing steps in a single "config" prompt

**POEM Best Practice:**
Configuration prompts should:
- Load inputs from files, APIs, or user input
- Validate data structure and completeness
- Set up context for downstream processing
- NOT perform analysis, generation, or transformation

---

## Refactoring Priority

| Priority | Pattern | Impact |
|----------|---------|--------|
| 🔴 High | Prompts that block workflow execution | Breaking |
| 🟡 Medium | Mixed concerns, poor reusability | Technical debt |
| 🟢 Low | Formatting, naming, minor improvements | Polish |

Current observations:
- `1-1-configure.hbs` - 🟡 Medium (mixed concerns)
- `1-2-title-shortlist.hbs` - 🔴 High (ambiguous interaction model)

---

## Pattern: Ambiguous Interaction Model (Human vs AI)

**Discovered in:** `1-2-title-shortlist.hbs`

**What to watch for:**
Prompts that are unclear about WHO is making the decision - the AI or a human user.

**Red flags:**
- Prompts ending with questions like "Which titles resonate with you?"
- Instructions that say "You can enter..." or "Select your preferences..."
- No explicit output format (can't tell if AI or human responds)
- Mixed language (instructions for both AI and human)

**The Problem:**
These prompts have an **identity crisis**:
1. **If HUMAN selection** → Should be application UI, not AI prompt
2. **If AI selection** → Needs criteria, output format, quantity specification
3. **If HYBRID** → Should be split into two prompts (AI recommends → Human confirms)

**POEM Best Practice:**
- **AI Prompts** should have:
  - Clear decision criteria (SEO, engagement, brand fit, etc.)
  - Explicit structured output format (JSON or markdown code block)
  - Specified quantity (select top 3, top 5, etc.)
  - No freeform "enter your input" instructions

- **Human Input** should be:
  - Implemented in application layer (web forms, CLI menus)
  - Captured as structured data (JSON selections)
  - Passed to next workflow step as validated input

**Recommendation:**
For fully automated workflows (like YouTube Launch Optimizer), prefer **AI-driven selection** with explicit criteria. If human input is required, implement checkpoints in application code, not prompt templates.

---

**Version:** 1.1
**Last Updated:** 2026-02-04
**Maintainer:** Review this file as each prompt is formatted
