# Workflow Architecture Concepts - Extracted from User Conversation

**Source:** `/Users/davidcruwys/dev/ad/poem-os/poem/data/youtube-launch-optimizer/x.x`

**Date Extracted:** 2026-01-07

**Context:** David (user) describing Agent Workflow Builder architecture to PO agent, explaining how workflows should be structured in POEM.

---

## Concept: Prompts as Nodes

**Priority:** Now (Current Epic 3)

**Owner:** Prompt Engineer

**Description:** David conceptualizes prompts not as simple text files, but as nodes (similar to n8n workflow nodes) that have additional metadata and capabilities beyond just the prompt content. This includes thinking of prompts in two forms: (1) the prompt itself, and (2) the prompt within a Handlebars template with logic and parameter placement.

**Quote:**
> "The way I believe we've set up the POEM prompt agent, and correct me if I'm wrong, Is that we've thought of a prompt as being a node, kind of like you would do in an NA10 workflow. So what does that mean? It means that the prompt exists in two conceptual versions. One is the prompt itself and two is the prompt as it stands within a handlebars template. Which is the same thing except now we also have additional logic and parameter placement."

**Current Status in POEM:** Supported - Epic 3 Stories 3.1-3.2 implement this via JSON schemas paired with Handlebars templates

---

## Concept: Input Parameters with Signatures

**Priority:** Now (Current Epic 3)

**Owner:** Prompt Engineer

**Description:** Inputs to prompts have typed signatures including: type declarations, required vs optional flags, and distinction between data inputs vs human-in-the-loop inputs.

**Quote:**
> "But by thinking of it as a conceptualized node, And not just a prompt file, we can package it with extra information. For instance, we could package it with input parameters. And they could have a signature. They could be things like, should they be a type of data, should they be required or optional. And are they even data or are they inputs from the human in the loop system?"

**Current Status in POEM:** Partially supported - JSON schemas define type/required/optional, but human-in-the-loop vs data distinction not formally represented

---

## Concept: Human-in-the-Loop Inputs

**Priority:** Now (Epic 4)

**Owner:** Prompt Engineer

**Description:** Certain inputs come from human interaction during workflow execution rather than from data. These are particularly useful when paired with Handlebars conditional statements to create prompt variations.

**Quote:**
> "And are they even data or are they inputs from the human in the loop system? Which is really useful when you're pairing it with the handlebars templates that might have a conditional statement in it. So based on the conditional statement and the human input we could have variations of the It's a great prompt for any number of reasons."

**Current Status in POEM:** Documented in Epic 4 Story 4.7 (Human-in-the-Loop Checkpoint Pattern)

---

## Concept: Output Specifications

**Priority:** Now (Current Epic 3)

**Owner:** Prompt Engineer

**Description:** Prompts return outputs that are either structured data or natural text. For structured data, there can be multiple outputs. This defines what the prompt produces.

**Quote:**
> "And because ultimately the prompt needs to return something, that then leads to the concept of is it structured data or is it natural text? And if it is structured data, is there more than one output?"

**Current Status in POEM:** Partially documented - Input schemas are first-class, but output schemas not explicitly defined in Epic 3 stories

---

## Concept: Model Selection (Custom Model Usage)

**Priority:** Future

**Owner:** Future enhancement (potentially Workflow Engineer)

**Description:** Node-level capability to specify which LLM model to use for a specific prompt. Includes default model selection at workflow level with ability to override at step level.

**Quote:**
> "Once you've got this node level concept going on with prompts, you could expand it out into other concepts later on. The two that come to mind is custom model usage."

> "Notice also that I had the concept of what model to use if a model was never passed through to an actual step." (referring to `default_llm :gpt4o` in settings block)

**Current Status in POEM:** Not documented anywhere in PRD or Architecture

---

## Concept: Orchestrators / Sub-Agents

**Priority:** Future (Out of Scope)

**Owner:** Future enhancement

**Description:** Advanced capability where a node could spin off sub-agents or orchestrate complex multi-agent interactions.

**Quote:**
> "Or potentially...An orchestrator that spins off sub-agents, but that's very outside of the scope of what we're doing. But all capable from a node-based prompt system."

**Current Status in POEM:** Not in scope, future consideration

---

## Concept: Step Structure (input/prompt/output)

**Priority:** Now (Part of Workflow definition)

**Owner:** Prompt Engineer or Workflow Engineer

**Description:** Steps are the execution units within a workflow. Each step declares its inputs (from the data bus), references a prompt by keyword, and declares its outputs (written to the data bus).

**Quote:**
```ruby
step('Hook Ideas') do
  input :current_video_goal
  input :intro_scenario
  prompt :intro_hook_ideas_prompt
  output :intro_hook_ideas
end
```

**Current Status in POEM:** Not formalized - Epic 4 Story 4.6 mentions "chain definition" but doesn't define step structure

---

## Concept: Loose Coupling via Prompt Keywords

**Priority:** Now (Part of Workflow definition)

**Owner:** Prompt Engineer or Workflow Engineer

**Description:** Prompts are registered in a separate `prompts do...end` block with keywords, allowing steps to reference prompts by symbol rather than direct file paths. This decouples workflow logic from prompt storage.

**Quote:**
> "And what I'd done with the original agent workflow builder was I loosely coupled the actual prompt. So there'd be another section in my configuration for retrieving the prompts by keyword."

```ruby
prompts do
  prompt :intro_hook_ideas_prompt, content: load_file("01-1-intro-hook-ideas.txt")
  prompt :intro_hooks_prompt, content: load_file("01-2-intro-hooks.txt")
end
```

**Current Status in POEM:** Not documented - Handlebars templates exist but no formal prompt registry pattern

---

## Concept: Settings Block

**Priority:** Now (Part of Workflow definition)

**Owner:** Workflow Engineer (or Prompt Engineer)

**Description:** Workflow-level configuration including prompt file path location and default LLM model selection.

**Quote:**
```ruby
settings do
  prompt_path Ad::AgentArchitecture.gem_relative_file('prompts/youtube/script_booster')
  default_llm :gpt4o
end
```

**Current Status in POEM:** Not documented anywhere in PRD or Architecture

---

## Concept: Attributes Block (Data Bus Schema)

**Priority:** Now (Part of Workflow definition)

**Owner:** Workflow Engineer (or Prompt Engineer)

**Description:** Predefined key-value map of all data that can be collected/used throughout the workflow. Acts as a shared data bus where each step can read from or write to. Attributes are typed (e.g., `:string`).

**Quote:**
> "What I hope you notice from this structure is that the only two concepts added is that the attributes or the data that you can collect for the workflow have been predefined. It's kind of a key value map and it acts like a bus so that as each step is executed they can use any data that's currently on the bus or they can write data to the bus or potentially though not normally overwrite data on the bus."

```ruby
attributes do
  attribute :audience, type: :string
  attribute :current_video_goal, type: :string
  # ... 60+ more
end
```

**Current Status in POEM:** Partially supported - Epic 4 Story 4.6 mentions "workflow-data" informally but no formal attributes block definition. YouTube example uses `workflow-attributes.json` with 60+ fields.

---

## Concept: Sections (Standard Operating Procedures)

**Priority:** Now (Part of Workflow definition)

**Owner:** Workflow Engineer (or Prompt Engineer)

**Description:** Organizational grouping of related steps. The main workflow represents the outcome being achieved, and sections represent the standard operating procedures (SOPs) to reach that outcome.

**Quote:**
> "The only other thing that they do separately is that they're in standard operating procedures under the main workflows. The main workflow is the outcome we're trying to do. The standard operating procedures to get to that finished workflow are the sections."

```ruby
section('Intro Hook') do
  step('Hook Ideas') do ... end
  step('Write Intro Hook') do ... end
end

section('Last Episode Recap Bridge') do
  step('Intro Recap Content Analysis') do ... end
  step('Write Intro Recap Script') do ... end
end
```

**Current Status in POEM:** Not documented - Epic 4 references numbered prompts/sections but no formal section structure

---

## Concept: Workflow Entity Structure

**Priority:** Now (Missing piece)

**Owner:** Workflow Engineer (potentially new agent, or extension of Prompt Engineer)

**Description:** Complete workflow as a first-class entity with description, settings, prompts registry, attributes (data bus), and sections containing steps. This is the container that ties all other concepts together.

**Quote:**
```ruby
dsl = Agent.create(:youtube_intro_outro_booster) do
  description 'This workflow designs compelling YouTube video intros & outros to boost engagement and watch time.'

  settings do
    prompt_path Ad::AgentArchitecture.gem_relative_file('prompts/youtube/script_booster')
    default_llm :gpt4o
  end

  prompts do
    prompt :intro_hook_ideas_prompt, content: load_file("01-1-intro-hook-ideas.txt")
    # ...
  end

  attributes do
    attribute :audience, type: :string
    attribute :current_video_goal, type: :string
    # ...
  end

  section('Intro Hook') do
    step('Hook Ideas') do
      input :current_video_goal
      prompt :intro_hook_ideas_prompt
      output :intro_hook_ideas
    end
  end
end
```

**Current Status in POEM:** NOT documented - This is the key missing piece. Epic 4 Story 4.6 describes "chains" but not full workflow entity structure.

---

## Concept: DTO Mapping Pattern

**Priority:** Now (Critical for reusability)

**Owner:** Prompt Engineer or Workflow Engineer

**Description:** Parameter name translation layer between workflow-level data (data bus) and prompt-level parameters. Allows prompts to be single-responsibility and generic, reusable across different workflows. Workflows can map their parameter names to whatever the prompt expects.

**Quote:**
> "Now, it's not in this old system because there was quite a bit of tight coupling between the workflow attributes and the prompt or step input and output attributes. But, and this tight coupling is and has been a challenge for me. Because what it's meant is that I haven't been able to have a generic reusable prompt or step because the inputs and the outputs have to match the workflow. And I do believe in my planning documents for POEM, I was clear, and if I wasn't, this is another thing we can raise, I was clear that mapping objects would be a supported concept in our prompt building system. Because with your standard DTO mapper pattern, You can have your prompts be quite single responsibility and generic. And they can be reused in any workflow and the workflow can have its version of what it thinks a parameter name should be. But it can map it through to whatever parameter name the prompt thinks it should be and vice versa. The output can also be mapped. So a simple DTO map from, map to, design pattern would have solved that problem."

**Current Status in POEM:** NOT documented - PO confirmed this is not in planning docs, PRD, or Architecture. The `mapping-architecture-concepts.md` document covers data source mapping (incident → shift_note), which is a different concept.

---

## Concept: Data Bus Read/Write Pattern

**Priority:** Now (Part of Workflow execution)

**Owner:** Workflow Engineer (execution engine)

**Description:** As steps execute, they read data from the data bus (attributes), execute their prompt, and write results back to the bus. Data accumulates progressively. Normally data is added but not overwritten.

**Quote:**
> "It's kind of a key value map and it acts like a bus so that as each step is executed they can use any data that's currently on the bus or they can write data to the bus or potentially though not normally overwrite data on the bus."

**Current Status in POEM:** Partially supported - Epic 4 Story 4.6 AC2 and AC3 describe "workflow-data" accumulation pattern, but no formal specification of read/write rules

---

## Concept: Sequential vs Parallel Execution

**Priority:** Future (mentioned as needed)

**Owner:** Workflow Engineer

**Description:** Workflows should support both sequential execution (A → B → C) and parallel execution patterns for steps that can run concurrently.

**Quote:**
From Penny's analysis: "Needed: Define sequential or parallel execution patterns"

**Current Status in POEM:** Not documented - Epic 4 Story 4.6 describes sequential chaining only

---

## Concept: Workflow vs Chain

**Priority:** Now (Terminology clarification)

**Owner:** Product Owner / Architect

**Description:** A "chain" is a simple linear workflow (A → B → C) while a "workflow" is the full concept with attributes, sections, steps, settings, and potentially branching/conditionals.

**Quote:**
From PO's interpretation: "Chain (Story 4.6) = Simple linear execution (A → B → C). Workflow (your concept) = Full entity with attributes, sections, steps, settings, branching, etc. A chain is a subset of a workflow."

**Current Status in POEM:** Not clarified - Epic 4 uses "chain" terminology but doesn't distinguish from "workflow"

---

## Concept: Shared Schema vs Individual Schemas

**Priority:** Now (Critical architectural decision)

**Owner:** Architect / Product Owner

**Description:** David's YouTube system uses ONE shared schema (`workflow-attributes.json` with 60+ fields) that all prompts reference. This is the "workflow attributes" pattern. Contrasts with "one schema per prompt" model.

**Quote:**
From PO's question: "In your YouTube Optimizer, you have one shared schema (workflow-attributes.json with 60+ fields). In your Agent Workflow Builder example, you have attributes that act as a data bus. Are these the same concept? Is workflow-attributes.json essentially the 'attributes' block for the YouTube workflow?"

David's implicit answer (via architecture example): Yes - the `attributes do...end` block IS the workflow-attributes.json schema.

**Current Status in POEM:** CONFLICT - Epic 3 assumes "one schema per prompt", Epic 4 Story 4.1 imports "ONE shared schema", Story 4.2 wants to extract individual schemas. These are incompatible models.

---

## Concept: Conditional Logic in Templates

**Priority:** Now (Supported via Handlebars)

**Owner:** Prompt Engineer

**Description:** Handlebars templates support conditional statements, allowing prompt variations based on inputs (including human inputs).

**Quote:**
> "Which is really useful when you're pairing it with the handlebars templates that might have a conditional statement in it. So based on the conditional statement and the human input we could have variations of the It's a great prompt for any number of reasons."

**Current Status in POEM:** Supported - Handlebars provides this capability, documented in Epic 3

---

## Concept: Workflow Description

**Priority:** Now (Part of Workflow entity)

**Owner:** Workflow Engineer

**Description:** Human-readable description of what the workflow achieves.

**Quote:**
```ruby
description 'This workflow designs compelling YouTube video intros & outros to boost engagement and watch time.'
```

**Current Status in POEM:** Not documented as part of workflow structure

---

## Concept: Prompt File Location Configuration

**Priority:** Now (Part of Settings)

**Owner:** Workflow Engineer

**Description:** Settings block specifies where prompt files are stored, allowing workflows to reference a base path.

**Quote:**
> "And the prompts themselves would live at a particular location, which we're going to do using handlebars on an Astro server, but in my system it would have been here."

```ruby
prompt_path Ad::AgentArchitecture.gem_relative_file('prompts/youtube/script_booster')
```

**Current Status in POEM:** Partially supported - POEM has workspace paths configured but not at workflow level

---

## Summary: What's Missing vs What's Supported

### ✅ Supported in Current POEM (Epic 3)
1. Prompts as nodes (with Handlebars templates + JSON schemas)
2. Input parameters with type signatures (required/optional)
3. Conditional logic in templates (Handlebars)
4. Loose coupling potential (nothing prevents keyword-based registry)

### ⚠️ Partially Documented (Epic 4)
5. Data accumulation (Story 4.6 mentions "workflow-data")
6. Human-in-the-loop (Story 4.7 checkpoint pattern)
7. Prompt chaining (Story 4.6)
8. Shared schema pattern (Story 4.1 imports one schema)

### ❌ NOT Documented (Major Gaps)
9. **Workflow entity structure** (description, settings, prompts, attributes, sections)
10. **Formal attributes/data bus definition** (attributes do...end block)
11. **Sections as organizational concept** (SOPs within workflow)
12. **Steps with input/prompt/output declarations**
13. **DTO mapping pattern** (workflow params ↔ prompt params)
14. **Settings block** (prompt_path, default_llm)
15. **Prompts registry** (keyword-based lookup)
16. **Model selection** (default_llm, per-step override)
17. **Output schemas** (structured data specifications)

### 🔮 Future Enhancements
18. Sequential vs parallel execution
19. Orchestrators / sub-agents

---

## Key Insight from David

**David's Core Thesis:**
> "I start to feel that all we really needed to do was add in a little bit of information about workflows."

David believes the architecture is fundamentally sound - prompts as nodes with I/O are already supported. The gap is NOT architectural mismatch, but rather **missing formal workflow definitions** that tie prompts together into executable workflows with:
- Shared data bus (attributes)
- Organizational structure (sections → steps)
- Loose coupling (prompt registry)
- Parameter mapping (DTO pattern)

This is a **documentation and formalization gap**, not a fundamental design flaw.

---

## Recommendations from PO

**PO's Assessment:**
> "Architecture is sound. Documentation has gaps. Penny's claim of 'massive misalignment' was wrong."

**Recommended Actions:**
1. Add Story 3.7: Define Workflow Entity Structure
2. Modify Story 4.2: Resolve individual vs shared schema conflict
3. Document DTO mapping pattern
4. Formalize attributes/data bus concept
5. Update Epic 4 to reference formalized workflow structure

---

**End of Extraction**
