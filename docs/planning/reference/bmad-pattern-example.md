# BMAD Patterns Applied to POEM - Concrete Example

**Purpose**: Understand how BMAD's task/template/checklist pattern works by seeing it applied to POEM

**Example Workflow**: Creating a new prompt in POEM

---

## The Three Components

### 1. TASK (Workflow Procedure)

**File**: `.poem-core/tasks/create-prompt.md`

**What it is**: Step-by-step instructions for the Prompt Engineer Agent to follow

**Example Content**:

```markdown
# Create Prompt Task

## Purpose

Guide Prompt Engineer through creating a new prompt from scratch

## Prerequisites

- Angela has described what the prompt should do
- Data source is known (incident, moment, etc.)

## Steps

1. **Understand Requirements**
   - What is the prompt's purpose?
   - What data source will it use?
   - What output is expected?

2. **Load Template**
   - Load `prompt-definition-tmpl.yaml`
   - Use template to gather structured information

3. **Create Prompt File**
   - Create `.hbs` file in `/poem/prompts/`
   - Use Handlebars syntax for placeholders
   - Follow principles from `brain/principles.md`

4. **Generate Schema**
   - Use skill: Generate Placeholder Schema
   - Create matching schema in `/poem/schemas/`

5. **Validate**
   - Run checklist: `prompt-creation-checklist.md`
   - Ensure all required elements present

6. **Confirm with Angela**
   - Show what was created
   - Confirm it matches expectations
```

**Key**: This is LLM-guided workflow - Claude reads this and follows the steps.

---

### 2. TEMPLATE (Conversation Guide)

**File**: `.poem-core/templates/prompt-definition-tmpl.yaml`

**What it is**: YAML structure that guides the conversation to gather information

**Example Content**:

```yaml
template:
  id: prompt-definition-v1
  name: Prompt Definition
  version: 1.0
  output:
    format: structured-data
    title: "Prompt Definition for {{prompt_name}}"

workflow:
  mode: interactive
  elicitation: guided-conversation

sections:
  - id: basic-info
    title: Basic Information
    sections:
      - id: prompt-name
        title: Prompt Name
        type: single-value
        instruction: |
          Ask Angela: "What should we call this prompt?"
          Use kebab-case (e.g., "enhance-narrative-before-event")

      - id: purpose
        title: Purpose
        type: paragraph
        instruction: |
          Ask Angela: "What should this prompt do?"
          Get 1-2 sentence description

      - id: data-source
        title: Data Source
        type: single-value
        instruction: |
          Ask Angela: "What data source does this use?"
          Examples: incident.single, moment.collection

  - id: prompt-content
    title: Prompt Content
    sections:
      - id: system-message
        title: System Message
        type: paragraph
        instruction: |
          Ask Angela: "How should we set context? For example:
          'You are an expert NDIS incident documentation specialist...'"

      - id: instruction-format
        title: Instruction Format
        type: paragraph
        instruction: |
          Ask Angela: "What instructions should the prompt give?
          For example: 'Analyze the following incident and...'"

      - id: placeholders-needed
        title: Placeholders Needed
        type: bullet-list
        instruction: |
          Ask Angela: "What data fields does the prompt need?"
          List placeholders: participantName, eventDescription, location, etc.

  - id: output-specification
    title: Expected Output
    sections:
      - id: output-format
        title: Output Format
        type: single-value
        instruction: |
          Ask Angela: "What format should the AI return?"
          Options: markdown, json, plain-text, structured

      - id: output-structure
        title: Output Structure
        type: paragraph
        instruction: |
          If structured output, ask Angela: "What should the output look like?"
          Get example structure
```

**Key**: This guides the LLM conversation - agent asks questions in order, gathers structured information.

---

### 3. CHECKLIST (Validation Criteria)

**File**: `.poem-core/checklists/prompt-creation-checklist.md`

**What it is**: Validation criteria to ensure quality

**Example Content**:

```markdown
# Prompt Creation Checklist

Use this checklist after creating a new prompt to ensure quality.

## File Structure

- [ ] Prompt file created in `/poem/prompts/` with `.hbs` extension
- [ ] File name uses kebab-case
- [ ] Schema file created in `/poem/schemas/` with matching name

## Prompt Content Quality

- [ ] System message establishes clear context and role
- [ ] Instructions are specific and actionable
- [ ] Examples provided (if complex task)
- [ ] Tone/style guidance included (if relevant)
- [ ] Output format clearly specified

## Placeholders

- [ ] All placeholders use `{{placeholderName}}` syntax
- [ ] Placeholder names are descriptive
- [ ] No undefined placeholders (all in schema)
- [ ] Required vs optional placeholders identified

## Schema Completeness

- [ ] Schema file is valid JSON
- [ ] All placeholders from prompt are defined in schema
- [ ] Each placeholder has:
  - [ ] Type specified
  - [ ] Description provided
  - [ ] Example value included
  - [ ] Required/optional marked

## Data Source

- [ ] Data source identified (e.g., incident.single)
- [ ] Placeholders match data source fields (if data dictionary available)

## Testing Readiness

- [ ] Example data can be substituted
- [ ] Prompt would make sense when rendered
- [ ] No obvious syntax errors

## Documentation

- [ ] Purpose documented in schema
- [ ] Use case clear
- [ ] Angela confirmed it matches expectations
```

**Key**: This is validation criteria - could be LLM-evaluated or programmatic check.

---

## How They Work Together

```
Angela: "I need a prompt to classify incident severity"
  ↓
Prompt Engineer Agent: *create-prompt
  ↓
Agent reads: create-prompt.md (TASK)
  ↓
Task says: Load prompt-definition-tmpl.yaml (TEMPLATE)
  ↓
Agent follows template: Asks Angela questions in order
  ↓
Template gathers: Name, purpose, data source, placeholders, output format
  ↓
Agent creates: severity-classifier.hbs and severity-classifier.json
  ↓
Agent loads: prompt-creation-checklist.md (CHECKLIST)
  ↓
Agent validates: Goes through checklist items
  ↓
Agent confirms with Angela: "Created severity-classifier prompt. Ready to test?"
```

---

## Key Distinctions

### TASK

- **What**: Procedural instructions
- **How**: LLM reads and follows steps
- **When**: Agent executes a command
- **Format**: Markdown with numbered steps

### TEMPLATE

- **What**: Conversation guide
- **How**: LLM uses to elicit information in structured way
- **When**: Task references it for gathering information
- **Format**: YAML with sections and elicitation instructions

### CHECKLIST

- **What**: Validation criteria
- **How**: LLM (or script) verifies quality
- **When**: After creation/before completion
- **Format**: Markdown with checkbox items

---

## Comparison to Skills

**Skills** (deterministic execution):

- Validate Handlebars syntax (run parser script)
- Render prompt with data (run Handlebars engine)
- Call Astro API (HTTP request)

**Tasks/Templates/Checklists** (LLM-guided):

- Create new prompt (conversation + file creation)
- Generate schema (analyze + infer + structure)
- Validate completeness (review against criteria)

---

## Naming Clarification

### The Two Prompt Concepts

**Prompt** (what Angela creates):

- The `.hbs` file with placeholders
- Lives in `/poem/prompts/`
- Example: `enhance-narrative.hbs` with `{{participantName}}`, `{{location}}`
- This is THE artifact Angela works with
- "I'm working on the incident-classifier prompt"

**Rendered Prompt** (what gets sent to AI):

- The final text after Handlebars processing
- Placeholders filled with actual data
- What Claude/GPT receives
- "Let me preview the rendered prompt with example data"

**Payload** (internal API concept - TBD if needed):

- Data structure for Astro API calls
- Contains: prompt reference, data, schema
- Mostly implementation detail
- May not be a first-class POEM concept

**Key**: Angela thinks in terms of "prompts" (the `.hbs` files). The rendered version is just what happens when you USE the prompt.
