# Current Thinking: POEM - Prompt Orchestration and Engineering Method OS

**Status**: Active exploration - Requirements gathering
**Date**: 2025-11-18 (Updated: 2025-11-19)
**Context**: Breakthrough session exploring OS/kernel analogies and BMAD parallels, extended with structure decisions

**Acronym**: **POEM** = **P**rompt **O**rchestration and **E**ngineering **M**ethod (OS = Operating System)

**Tagline**: *"Poetry in Prompt Engineering"*

**Organization**: `poem-os` (GitHub organization and NPM scope)

---

## Naming: How We Arrived at POEM

### The Name Journey

**Final Decision**: **POEM** - Prompt Orchestration and Engineering Method

**Why This Works**:
- ✅ Visually striking in capital letters (POEM)
- ✅ Correctly spelled word (searchable, memorable, findable in videos/articles)
- ✅ Short and punchy (4 letters)
- ✅ Sentence built first, acronym emerged naturally (vs forced acronym → sentence)
- ✅ NPM package `poem-os` is AVAILABLE

**The Quirks**:
- ⚠️ "Orchestration" before "Engineering" feels backward grammatically
  - "Prompt Engineering Orchestration Method" would read better
  - But PEOM doesn't spell a word
- ⚠️ Has nothing to do with poetry (potential confusion)
- ⚠️ Word order prioritizes memorability over grammatical accuracy

**Design Philosophy**: Sentence → Acronym (not Acronym → Sentence)
- Built the concept: "Prompt Orchestration and Engineering Method"
- Discovered it spelled POEM
- Accepted the quirks for the visual/memorable payoff

### Comparison to BMAD

**BMAD** = Breakthrough Method for Agile AI Driven Development
- Acronym feels forced to fit "BMAD"
- Harder to remember the full name
- Not a correctly spelled word

**POEM** = Prompt Orchestration and Engineering Method
- Natural word
- Easier to remember and reference
- Visually distinctive

### Alternative Names Considered

**Operating System Angle**:
- **PEOS** - Prompt Engineering Operating System (accurate but generic)
- **PEM** - Prompt Engineering Method (simple but loses OS concept)
- **PROMPT** - Prompt Runtime for Orchestration, Mapping, and Production Testing (recursive/meta, but forced)

**Mock Data + Testing Focus**:
- **FORGE** - Framework for Orchestrating, Refining, and Generating Examples (strong verb, captures mock data generation)
- **MINT** - Mock data Integration and Narrative Testing (clean but too simple)
- **CAST** - Contextual Assembly and Simulation Tool (good for storytelling, too specific)

**Workspace/Environment Angle**:
- **STUDIO** - System for Testing, Understanding, and Deploying Intelligence Operations (too forced)
- **BENCH** - Prompt Engineering Bench (not an acronym, but captures workspace feel)

**Metaphorical Names**:
- **TRELLIS** - Template Refinement Environment with Live Logic and Iteration Support (beautiful metaphor, too long)
- **LOOM** - Logic Operations and Output Modeling (weaving metaphor, not clear)
- **KILN** - Testing/firing/hardening before production (strong metaphor, requires explanation)

**Variations on POEM**:
- **POEM** - Prompt Operating Engineering Machine (feels wrong)
- **POEM** - Prompt Operations Execution Method (loses orchestration concept)
- **POEM** - Prompt Optimization and Engineering Methodology (too long)

### Why We Kept POEM

**Visual Impact**: Even with quirks, the name is memorable and distinctive
**Findability**: Correctly spelled word means better discoverability
**Brevity**: 4-letter acronym is ideal for branding
**Uniqueness**: POEM doesn't exist as a prompt engineering system
**NPM Available**: `poem-os` organization and package name available

**Accepted Trade-offs**:
- Grammatical word order (Orchestration before Engineering)
- Poetry association (irrelevant but harmless)
- Not 100% literal/descriptive

**Philosophy**: Memorable > Grammatically Perfect

### Tagline

**Primary**: *"Poetry in Prompt Engineering"*
- Embraces the POEM name fully
- Suggests craft, artistry, refinement
- Simple and memorable
- Turns the poetry "quirk" into a feature

**Secondary**: *"Compose. Test. Refine. Deploy."*
- Workflow in 4 beats (like a stanza)
- Actionable and clear
- Maintains subtle poetry metaphor
- Describes the actual process

---

## Quick Summary (2025-11-19 Decisions)

**What is POEM?** A Prompt Engineering Operating System that runs on Claude Code (like BMAD is a Software Development OS)

**Key Decisions**:
- **3-4 Agents**: Prompt Engineer, System Agent, Integration Agent (+ potential Data/Testing Agent)
- **8 Skills**: Check My Template, Preview with Example Data, Generate Placeholder Schema, Find Fields in Data Dictionary, Validate Schema Against Dictionary, Suggest Mappings, Pull Data Dictionary, Publish Template
- **Structure**: `.poem-core/` + `.poem-app/` + `/poem/`
- **Tech**: Astro SSR + API pattern (not MCP)
- **Helpers**: On-demand creation by agents (CODE in `.poem-app/`)
- **BMAD**: Use v4 patterns (template-driven, fast, stable)
- **NPM**: `npx poem-os install` (available!)
- **GitHub**: `poem-os/poem`

**Quick Install** (future):
```bash
npx poem-os install           # Everything
npx poem-os install --core    # Just .poem-core/
npx poem-os install --app     # Just .poem-app/
```

---

## The Breakthrough: OS/Kernel Analogy

### The Question That Changed Everything

**Q**: "What is Claude Code and what is the relationship of BMAD to Claude Code? Is Claude Code kind of like an operating system and BMAD kind of like a kernel?"

### The Realization

After studying BMAD v4 documentation from the second brain (`/Users/davidcruwys/dev/ad/brains/bmad-method/`), the analogy became clear:

**Claude Code = Operating System**
- Provides the runtime environment (AI models, file operations, tool execution)
- Resource management (context windows, agent capabilities, skill execution)
- API/System calls (Bash, Read, Write, Edit tools)
- Process isolation (separate agent instances with context)

**BMAD = Application Operating System**
- Has its own "file system" (`.bmad-core/`)
- Has "process management" (agent orchestration)
- Has "system calls" (agent commands like `*draft`, `*impl`)
- Provides abstractions (templates, workflows)
- Complete development methodology, not just tools

### The Layering Model

```
Hardware Layer:       AI Models (Claude, GPT, etc.)
Operating System:     Claude Code (provides environment, tools, capabilities)
Application Framework: BMAD Method (orchestration, templates, workflows)
Applications:         Individual Projects (like Prompts App)
```

**Or alternatively:**

```
Agentic Development Platform:  Claude Code (or Codex, Cursor, etc.)
Operating System:              BMAD Method (has its own file system, process management, commands)
Applications:                  Stories, Features, Epics (the work being done)
```

---

## What We're Actually Building

**We're not building a "prompt library"** - we're building a **Prompt Engineering Operating System** that runs on Claude Code (though it could theoretically run on other agentic development platforms like Codex or Cursor).

Just like BMAD is a "Software Development OS" that orchestrates agents to build software, we're building a **"Prompt Engineering OS"** that orchestrates agents/skills to build, test, validate, and deploy prompts.

---

## The Parallel Architecture

### BMAD Method (Software Development OS)

- **Runs on**: Claude Code
- **Agents**: PM, SM, Dev, QA, Architect, Tech Lead, DevOps, Security, UX, Docs (10 agents)
- **Artifacts**: Code files, tests, documentation
- **Workflows**: `*draft` → stories, `*impl` → code, `*test` → validation
- **File System**: `.bmad-core/` (templates, architectures, stories)
- **Output**: Working software
- **Characteristics**:
  - Template-driven orchestration system
  - YAML templates defining workflows and commands
  - Single-step story creation via `*draft` command
  - Selective architecture loading (only loads what's needed)
  - Polyglot - agents can work in any language (Ruby, JS, Go, CSS, etc.)

### POEM (Prompt Orchestration and Engineering Method OS)

- **Runs on**: Claude Code (agentic development platform) - or Codex, Cursor, etc.
- **Agents**: 3 confirmed agents (not 10 like BMAD)
  1. **Prompt Engineer** - Create, refine, validate prompts
  2. **System Agent** - Maintain systems (Astro, Handlebars, APIs)
  3. **Integration Agent** - Sync with external systems (SupportSignal/Convex, future providers)
- **Skills**: 8 skills
  - Check My Template, Preview with Example Data, Generate Schema, Find Fields, Validate Schema, Suggest Mappings, Pull Dictionary, Publish Template
- **Artifacts**: Prompt templates (.hbs), schemas (JSON), data mappings, Handlebars helpers (JS)
- **Workflows**: v4 BMAD-style (template-driven, single-step commands)
- **File System**:
  - `.poem-core/` - The OS itself (agents, workflows, brain)
  - `.poem-app/` - Astro application (visualization + APIs)
  - `/poem/` - Workspace (Angela's prompts, schemas, mappings)
- **Output**: Production-ready prompts
- **Characteristics**:
  - Domain-specific for prompt engineering
  - File-based source of truth
  - Astro API pattern (Handlebars engine, Provider connectors)
  - v4 BMAD patterns (fast, template-driven, stable)

---

## The Agent/Skill Concept

### Understanding "Agent" in BMAD Context

When BMAD has a "Developer Agent" - it doesn't mean "JavaScript developer" or "Ruby developer".

It means: **"An agent whose GOAL is to implement solutions, regardless of the language/format/medium"**

**Key insight**: Agents are polyglot
- Can write Ruby, Python, JavaScript
- Can write CSS, HTML, YAML, JSON
- Can write domain-specific languages
- Can write any artifact type

**What defines an agent**:
- A specific GOAL or RESPONSIBILITY
- Different CAPABILITIES from other agents
- Well-defined BOUNDARIES (you can't do certain actions unless you're in the right agent)

### Our Prompt Engineering Agents/Skills

Similarly, our agents/skills aren't about a specific tech. They're **logic-based components with goals, inputs, and outputs**:

- **Check Template Skill** - Goal: Ensure prompt structure is correct
- **Preview Skill** - Goal: Show prompt with example data
- **Generate Schema** - Goal: Auto-create placeholder schemas from templates
- **Find Fields** - Goal: Search data dictionary
- **Validate Schema** - Goal: Check schema against data dictionary
- **Suggest Mappings** - Goal: Recommend field mappings based on data dictionary
- **Pull Dictionary** - Goal: Sync data dictionary from external system
- **Publish Template** - Goal: Deploy prompt to production (Convex)

### Agent vs Skill vs Sub-Agent vs MCP

**Open Question**: How many true "agents" do we need vs skills/sub-agents/MCP?

**David's observation**:
> "You get 8 agents in BMAD and quite frankly they're a pain in the arse to switch between. You can't do certain actions unless you're in the right agent. There really is this well-defined responsibility between each of them and every agent you just listed for me all look like they could have been done by the one agent just with different skills. I haven't read it deep enough to know that my statement is 100% true and 1 is probably too little, but it's certainly not 6."

**Key distinction**:
- **BMAD couldn't use sub-agents/skills** - they didn't exist when BMAD was designed
- **We have access to**: MCP, Agent, Sub-agent, Skill
- **Need to understand**: Strengths of each type
- **Likely**: Fewer agents than BMAD, more reliance on skills/sub-agents

---

## What Gets "Built" in This System

### BMAD Builds (Software Artifacts):
- Ruby classes
- React components
- CSS stylesheets
- Test files
- Configuration YAML
- Documentation

### Prompt Engineering OS Builds (Prompt Artifacts):
- **Prompt templates** (.hbs files) - Handlebars templates
- **Schemas** (JSON structure definitions)
- **Data mappings** (field transformations)
- **Validation rules** (schema validators)
- **Test data** (example inputs for testing)

All of these are just **different "languages"** or **artifact types** in the prompt engineering domain.

**Critical insight**: These are the TARGET SYSTEM artifacts, not the OS core artifacts.

---

## The Astro Piece (Visualization Layer)

Astro isn't the application - it's just the **visualization layer** (like a GUI or dashboard).

**Perfect analogy**:
- In an operating system you access the file system using Finder (macOS) or Windows Explorer
- That's what Astro is - accessing prompts/schemas/mappings in a visual fashion
- We may build a couple of little buttons to automate things, but it's primarily a visualization layer

**The real "application" is**:
- The orchestration of skills
- The workflows for prompt management
- The automation of validation/testing/deployment
- The integration with Convex (via skills)

Astro is the "status dashboard" or "file browser" for the OS. It shows you what's there, but the OS does the work.

---

## The Claude Code Foundation (Hardware Layer)

We're building on Claude Code, which gives us:
- **MCP** (Model Context Protocol) - for integrations
- **Sub-agents** - for specialized tasks
- **Skills** - for automation
- **CLAUDE.md** - for agent instructions
- **File-based workflows** - source of truth

This is our "hardware layer" - the capabilities we can orchestrate.

---

## What Actually Needs Building

### 1. Skill Definitions (The "Agents")

Just like BMAD has agent YAML templates, we need skill definitions.

**Note**: BMAD's use of YAML is their own abstraction, not related to Claude Code. They learned through experience that machine-readable formats (YAML, XML, JSON, CSV) give power to prompt engineering and help agents work more effectively.

**Anthropic's preference**: Currently XML (models trained on lots of XML), but YAML works well for workflows/checklists because it's easy to read.

**What we need**:
- `/skills/backup-prompt.md` or `.yaml` or other format
- `/skills/publish-to-convex.md`
- `/skills/validate-schema.md`
- `/skills/suggest-mappings.md`
- etc.

**Open question**: Format choice (YAML vs XML vs Markdown vs other)

### 2. Orchestration Workflows

How do skills work together?

**Examples**:
- "Create New Prompt" workflow
- "Test Against Data" workflow
- "Deploy to Production" workflow

**Status**: Unknown - this is something we're trying to figure out.

### 3. File System Structure

**BMAD has**: `.bmad-core/` with agents, YAML templates, architectures, stories

**What do we need?**

**Critical distinction**:
- `.bmad-core/` is the SOFTWARE DEVELOPMENT OS core
- Most of what we initially listed is TARGET SYSTEM data:
  - `/data/prompts/` - TARGET (like application code)
  - `/data/schemas/` - TARGET (like application data)
  - `/data/mappings/` - TARGET (like config files)

**The Prompt Engineering OS core needs**:
- `/skills/` - Definitely core
- `/workflows/` - Definitely core
- `/templates/` - UNCLEAR - are these Handlebars templates (TARGET) or OS templates (CORE)?

**Open question**: What exactly is the "core" vs the "target system"?

### 4. Integration Layer (Tools)

**David's insight**: "The integration layer is really just tools. Whether it be in the form of a skill or an MCP or some other idea that Claude comes up with in the future."

**Examples**:
- Convex API client (for publish/sync)
- Data dictionary sync (from main app)
- Schema validation engine

**These are all tools** - could be Skills, MCP, or future Claude innovations.

---

## The Extensibility Question

### Template Creator, Schema Generator, Mapper, Validator, Publisher

**Question posed**: Why can't we have agents whose job is creating agents/skills?

**David's pushback**: "Are they really agents? I don't know."

**Key observation**:
> "Every agent you just listed for me all look like they could have been done by the one agent just with different skills. 1 is probably too little, but it's certainly not 6."

**The BMAD lesson**:
- 8-10 agents in BMAD
- Switching between them is "a pain in the arse"
- You can't do certain actions unless you're in the right agent
- There's FUNDAMENTALLY different skills/capabilities between them
- Well-defined responsibilities

**For our Prompt Engineering OS**:
- We DON'T need as many agents as BMAD
- Many of the listed functions could be skills of a single agent
- Need to identify what's truly FUNDAMENTALLY different
- Likely somewhere between 1 and 6 agents

---

## Why This Couldn't Use Traditional BMAD

BMAD is optimized for **software development workflows** (epics → stories → code → tests).

But prompt engineering workflows are different:
- Not building "features" with user stories
- Artifacts are templates, not code
- Testing is data-driven validation, not unit tests
- Deployment is API push, not deploy scripts

**We need a DIFFERENT OS for a DIFFERENT domain.**

---

## Automation vs Systematization

**David's clarification on BMAD**:
> "I wouldn't say it's highly automated. I'd say it's highly systematized in that you have to manually go to the scrum master and you have to manually draft a story. There's no automation there, there's systematization, but once you draft the story, yes, it does a lot of stuff powered by the underlying agent harness, which in our case is Claude Code."

**Key distinction**:
- **Systematization**: Clear processes, defined steps, structured workflows
- **Automation**: Once you trigger the process, it does a lot automatically

**For our Prompt Engineering OS**: We want similar level of systematization and automation.

---

## Core Workflows (2025-11-19)

**Angela's typical usage patterns**:
- **Most common**: Refining and testing existing prompts
- **Second most common**: Creating new prompts from scratch
- **Always ends with**: Deployment (all refined/created prompts get deployed)

**Key insight**: Both linear AND non-linear workflows exist
- **Linear progression** (like BMAD): Draft → Review → Implement → Test → Deploy
- **Non-linear iteration**: Refine → Test → Refine → Test → Refine → Deploy

---

### Workflow 1: "New Prompt" Workflow
**Purpose**: Create a brand new prompt from scratch

**Steps**:
1. Consult principles (`.poem-core/brain/`)
2. Create template file in `/poem/prompts/`
3. Generate placeholder schema
4. Preview with example data
5. Validate structure

**Command**: `*new-prompt "support-ticket-classifier"`
**Primary Agent**: Prompt Engineer (may invoke System Agent for helpers, Integration Agent for validation)

---

### Workflow 2: "Refine Prompt" Workflow
**Purpose**: Improve an existing prompt (Angela's most common task)

**Steps**:
1. Load existing template
2. Test against real data from dictionary
3. Identify missing fields
4. Suggest mappings
5. Update template
6. Validate changes
7. Repeat steps 2-6 as needed (non-linear)

**Command**: `*refine "support-ticket-classifier"`
**Primary Agent**: Prompt Engineer (may invoke Integration Agent for data dictionary)

---

### Workflow 3: "Deploy Prompt" Workflow
**Purpose**: Push tested prompt to production (always happens at the end)

**Steps**:
1. Validate schema against data dictionary
2. Test connection to provider
3. Publish template
4. Sync schema
5. Confirm deployment status

**Command**: `*deploy "support-ticket-classifier" --provider supportsignal`
**Primary Agent**: Integration Agent (may invoke Prompt Engineer for final validation)

---

### Workflow 4: "Test Prompt" Workflow
**Purpose**: Test how a prompt performs with real data

**Steps**:
1. Pull sample data from provider (or use example data)
2. Render template with data
3. Compare output to expected
4. Report on field usage

**Command**: `*test "support-ticket-classifier" --data-source supportsignal`
**Primary Agent**: Prompt Engineer (may invoke Integration Agent for data pull)

---

### Workflow 5: "Add Helper" Workflow
**Purpose**: Create a new Handlebars helper while working on a template

**Steps**:
1. Define helper requirements
2. Generate helper code
3. Register with Handlebars engine
4. Test helper
5. Confirm availability

**Command**: `*add-helper "fullName"`
**Primary Agent**: System Agent

---

### Workflow vs Commands

**Important distinction**:
- **Workflows** can span multiple agents (agent switching during workflow execution)
- **Commands** are agent-specific (tied to specific agents)

**Example** (from BMAD AppyDave workflow):
```
Workflow: "Create Feature"
├─ Scrum Master Agent    → *draft (draft story command)
├─ QA Agent             → *review (review story command)
├─ Development Agent    → *impl (implement story command)
├─ SAT Agent            → *sat-create (create acceptance test command)
└─ QA Agent             → *qa-final (final quality check command)
```

Each agent has specific commands, but the workflow orchestrates across them.

---

### Data Sources (Future Consideration)

**Status**: Concept identified, implementation TBD based on actual usage

**Core Problem**: Data sources represent **use case + scope + shape** of data feeding templates.

**The Challenge**:
- Same entity type (e.g., "incident") can have different data source contexts
- This affects how we write templates, schemas, mappings, deployment, and testing
- We don't fully understand the requirements until we use the system

**Possible Data Source Types** (notation examples):
- `incident.single` - Single complete incident (one entity)
- `incident.collection` - Multiple incidents (list of same entity)
- `incident.view` - Depends on what's being joined/aggregated:
  - Could be single entity from joined tables (company + employee → one record)
  - Could be collection from joined tables (company + employees → multiple records)
  - Could be aggregates (company → totals/stats as single value)
  - Could be list of aggregates (companies → list of totals)
- `moment.single`, `shift_note.single`, etc. - Other entity types

**The "view" concept**: Where is data coming from?
1. One entity (single record)
2. List of same entity (multiple records)
3. List of joined entities (multiple tables, multiple records)
4. Single value from multiple entities (joined/aggregated → one result)
5. List of aggregated values (multiple aggregates)

**Examples from SupportSignal**:
1. **Workflow prompts** - Use partial data (e.g., incident metadata + before_event only)
2. **Analysis prompts** - Use complete data (e.g., full incident with all 4 phases + Q&A)
3. **Comparison prompts** - Use collections (e.g., "which of these 5 incidents is riskiest?")
4. **Cross-entity prompts** - Same template, different entities (e.g., sentiment analysis on incident vs moment)

**What We Know**:
- Data sources will impact template design
- Different scopes need different presentations (single vs collection)
- Collections might need format specifications (CSV? JSON? Markdown table?)
- Cross-entity templates require generic placeholders + entity-specific mappings

**What We Don't Know Yet**:
- How to represent data sources in POEM (if explicit representation needed)
- Where they live (config? schemas? separate files?)
- Whether we need a simple DSL to describe them
- How mappings relate to data sources

**Design Principle**: Don't over-engineer - wait for actual usage to reveal requirements

**Impact Areas**:
- Template writing (what placeholders available?)
- Schema definitions (what shape is data?)
- Mapping architecture (how to translate entity → template?)
- Deployment (what context does template need?)
- Testing (what example data to use?)

**Next Steps**: Monitor as system evolves, capture patterns as they emerge

---

### Machine-readable format choice
- YAML (BMAD's choice for readability)
- XML (Anthropic's preference for model training)
- Markdown (documentation-friendly)
- JSON (data-friendly)
- Mix of formats?

**Status**: TBD - likely YAML for workflows (v4 pattern)

---

## Key Insights Summary

1. **We're building a Prompt Engineering Operating System** - not a prompt library, not a web app, not a traditional application

2. **It runs on Claude Code** (the platform/hardware layer) - just like BMAD does

3. **It orchestrates agents/skills** to build, test, validate, and deploy prompts - similar to how BMAD orchestrates agents to build software

4. **Agents are polyglot and goal-oriented** - defined by their PURPOSE and CAPABILITIES, not by the artifacts they create

5. **We likely need fewer agents than BMAD** - somewhere between 1 and 6, with more reliance on skills/sub-agents since they're now available

6. **Astro is just the visualization layer** - like Finder or Windows Explorer for the OS

7. **Most artifacts are TARGET SYSTEM data** - prompts, schemas, mappings are what we're managing, not the OS itself

8. **Integration is done through tools** - Skills, MCP, or future Claude innovations

9. **We want systematization + automation** - clear processes that, once triggered, do a lot automatically

10. **We can't answer detailed questions yet** - need to explore and understand the domain better before deciding on structure

---

## Next Steps

1. **Understand the domain better** - What are the actual workflows for prompt engineering?

2. **Identify fundamental responsibilities** - What's truly FUNDAMENTALLY different that requires separate agents?

3. **Map capabilities to mechanisms** - What should be an agent vs skill vs sub-agent vs MCP?

4. **Define the core vs target** - What's the OS itself vs what it manages?

5. **Explore file system structure** - How should we organize the core and target artifacts?

6. **Study the 9 proposed skills** - Do they still make sense with this new understanding?

---

---

## Structure Decisions (2025-11-19)

### Three-Part System

**1. `.poem-core/`** - The Operating System (installed once)
```
.poem-core/
├── agents/
│   ├── prompt-engineer.md
│   ├── system-agent.md
│   └── integration-agent.md
├── workflows/
│   ├── create-prompt/
│   │   ├── workflow.yaml
│   │   ├── instructions.md
│   │   └── template.md
│   └── ...
├── brain/                     # Prompt engineering knowledge (not "knowledge/")
│   ├── principles.md
│   ├── patterns.md
│   └── anti-patterns.md
└── config.yaml                # Port, endpoints, providers
```

**Why "brain"**: Distinct from KDD (Knowledge Driven Development - a process). This is content/knowledge storage, following "second brain" pattern.

**2. `.poem-app/`** - Astro Application Infrastructure
```
.poem-app/
├── src/
│   ├── pages/                 # Visualization pages
│   ├── pages/api/            # API endpoints
│   │   ├── handlebars/
│   │   │   ├── compile.ts
│   │   │   └── render.ts
│   │   └── providers/
│   │       └── [provider]/
│   │           ├── read-dictionary.ts
│   │           └── publish-template.ts
│   └── services/
│       └── handlebars/
│           ├── engine.ts      # Handlebars setup (loaded once on server start)
│           └── helpers/       # Custom helpers (Angela-created, CODE not data)
│               ├── fullName.js
│               └── titleCase.js
├── astro.config.mjs
└── package.json
```

**Key insight**: Helpers are APPLICATION CODE (in `.poem-app/`), not workspace data (not in `/poem/`)

**3. `/poem/`** - Angela's Workspace
```
/poem/
├── prompts/                   # .hbs templates
├── schemas/                   # JSON schemas
└── mappings/                  # Data mappings
```

**Note**: No `handlebars/helpers/` here - those live in `.poem-app/src/services/handlebars/helpers/`

---

## Astro API Pattern

### Why Astro SSR + APIs?

**Problem**: Handlebars needs heavy boot cycle (compile templates + load 20-30 helpers)
**Solution**: Persistent Astro server with APIs

**Skills call Astro APIs explicitly** (not MCP's implicit context):
```typescript
// Skill: render-template
POST http://localhost:4321/api/handlebars/render
{
  "template": "{{titleCase name}}",
  "data": {"name": "john"}
}

Response: {"result": "John"}
```

**Configuration-driven endpoints**:
```yaml
# .poem-core/config.yaml
astro_server:
  host: "localhost"
  port: 4321  # Configurable per project
  base_url: "http://localhost:4321"

endpoints:
  handlebars_render: "/api/handlebars/render"
  handlebars_compile: "/api/handlebars/compile"
  provider_base: "/api/providers"
```

**Skills read config** - no hardcoded ports, future-proof for remote deployment

---

## On-Demand Helper Creation

**Angela's workflow**:
```
Angela (in System Agent): "I need a fullName helper that combines firstName + lastName"

Agent:
1. Generates helper code:
   // .poem-app/src/services/handlebars/helpers/fullName.js
   export function fullName(firstName, lastName) {
     return `${firstName} ${lastName}`.trim();
   }

2. Registers with Handlebars engine (via Astro API)
3. Confirms: "fullName helper created. Use: {{fullName participant.firstName participant.lastName}}"
```

**Key**: Helpers are GENERATED ON-DEMAND, not pre-planned. Agent creates them as CODE when Angela needs them.

---

## Provider Pattern (External Systems)

**Problem**: SupportSignal/Convex is specific, need generic integration pattern

**Solution**: Provider pattern via Astro APIs
```
Astro API Endpoints:
├── /api/providers/supportsignal/read-dictionary
├── /api/providers/supportsignal/publish-template
├── /api/providers/supportsignal/sync-schema
└── /api/providers/supportsignal/test-connection

Future providers:
└── /api/providers/[new-provider]/...
```

**Skills invoke providers**:
```
Skill: "publish-to-provider"
Config: provider = "supportsignal"
Action: POST /api/providers/supportsignal/publish-template
```

**Extensible**: New provider = new API routes in `.poem-app/src/pages/api/providers/[name]/`

---

## v4 vs v6 BMAD - Decision

**Use v4 patterns for POEM** ✅

**Why**:
- **3x faster** workflows (5 min vs 15 min for simple tasks)
- **Template-driven** (YAML workflows, single-step commands)
- **Stable** (not alpha)
- **No XML** (v6 still uses XML in story-context)
- **Solo-optimized** (Angela works alone, no team coordination)

**What we steal from v4**:
- `.poem-core/` structure (like `.bmad-core/`)
- YAML workflow templates
- Single-step commands (like `*draft` → complete story)
- Embedded context (not separate XML files)
- File system as source of truth

**v6 advantages don't apply**:
- ❌ Team coordination - Angela is solo
- ❌ Complex projects - Prompts are straightforward
- ❌ Module system - POEM is single-purpose

---

## NPM/NPX Distribution

**GitHub Organization**: `poem-os`
**Main Repository**: `poem-os/poem`

**NPM Package Availability** (checked 2025-11-19):

**Status**:
- ❌ `poem` - **TAKEN** (v0.0.1, abandoned ISC package)
- ✅ `poem-os` - **AVAILABLE** ✨

**Decision**: Use `poem-os` (like `bmad-method` pattern)

**User installation**:
```bash
npx poem-os install           # Installs everything (.poem-core/ + .poem-app/)
npx poem-os install --core    # Just .poem-core/
npx poem-os install --app     # Just .poem-app/
```

**Simple and clean** - matches BMAD's `npx bmad-method install` pattern

**Repository structure** (monorepo):
```
poem-os/poem/
├── packages/
│   ├── poem/          # Main CLI package (published to NPM)
│   ├── core/          # Core installation logic (internal)
│   └── app/           # App installation logic (internal)
└── docs/
```

---

## Skills in POEM (Claude Code Reality)

**Important**: In Claude Code, skills are **autonomous, single-responsibility entities** that:
- Suggest when they would be useful (not tied to specific agents)
- Claude decides which skill to use based on context
- Skills don't "belong" to agents - agents invoke skills as needed

**How This Works in Practice**:
- All skills are available to all agents
- Skills declare their purpose and when they're applicable
- Claude chooses appropriate skills based on agent's current goal

**POEM Skills (8 Total)**:

**Template & Schema Skills**:
- **Check My Template** - Validate template structure and placeholders
- **Generate Placeholder Schema** - Auto-create schema from template
- **Preview with Example Data** - Render template with sample data

**Data Dictionary Skills**:
- **Find Fields in Data Dictionary** - Search available fields
- **Validate Schema Against Dictionary** - Check schema correctness
- **Pull Data Dictionary** - Sync field definitions from provider

**Mapping & Deployment Skills**:
- **Suggest Mappings** - Recommend field mappings based on dictionary
- **Publish Template** - Deploy template to provider (SupportSignal/Convex)

**Skill Usage by Agent (Typical Patterns)**:
- **Prompt Engineer**: Frequently uses template/schema/dictionary skills
- **System Agent**: Frequently uses helper creation/server management (not listed - different domain)
- **Integration Agent**: Frequently uses dictionary/publish skills

**Additional Skills** (not in the 8 core):
- Helper creation, registration, testing (System Agent domain)
- Server management, API endpoints (System Agent domain)
- Visualization: Open Dashboard, View Prompt, List Templates (all agents)
- File operations: List Files, Read File, Search Files (all agents)
- Configuration: Read Config, Update Config (all agents)

**Design Reality**: Skills are autonomous tools; agents are goal-oriented orchestrators that use whatever skills help achieve their goals.

---

## Mock Data Generation - Core POEM Value Proposition

### The Problem This Solves

**Angela's Pain Point**: Prompt engineering requires testing templates with data, but manually filling in test data is:
- Time-consuming and tedious
- Blocks rapid iteration
- Requires access to real production data (privacy/security concerns)

**The POEM Solution**: Auto-generate mock data based on schemas and data sources

### How Mock Data Generation Works

**Prerequisites**:
1. Data source definition (e.g., `incident.single`, `moment.collection`)
2. Schema (field definitions, types, constraints)

**Process**:
```
1. Angela creates template: "Analyze incident for {{participantName}} at {{location}}"
2. Template references data source: "incident.single"
3. POEM reads incident schema (participantName: string, location: string, etc.)
4. POEM generates realistic mock data: {participantName: "John Smith", location: "Kitchen"}
5. Angela tests template with mock data
6. Iterates rapidly without touching production system
7. When satisfied, publishes template to provider
```

### Three Data Flows in POEM

**INBOUND** (Provider → POEM):
- Pull Data Dictionary (field definitions, types, constraints)
- Pull Data Source Definitions (what entities exist, relationships)
- [Optional] Pull Sample Data (real data exports as JSON for reference)

**OUTBOUND** (POEM → Provider):
- Publish Templates (prompts ready for production use)

**INTERNAL** (Within POEM):
- Generate Mock Data (for local testing and iteration)
- Apply Templates to Mock Data (test prompt rendering)
- [Future] Generate Output Data (batch template execution for workflows)

### Why This Matters for POEM

**Independence from Production**:
- Prompt engineering becomes standalone activity
- No need to access production database for testing
- Privacy/security: no real user data needed in POEM

**Rapid Iteration**:
- Generate hundreds of test scenarios instantly
- Test edge cases (empty fields, long text, special characters)
- Validate templates before deployment

**Data Source Connection**:
This is **why data sources are critical to POEM**:
- Data source defines **what** to generate (entity type, scope, shape)
- Schema defines **how** to generate it (fields, types, constraints)
- Mock data generator uses both to create realistic test data

### Output Data Generation (Future Consideration)

**Beyond Mock Input**: POEM could also generate output data by:
1. Taking input data (mock or real)
2. Applying templates to generate outputs
3. Producing structured data for downstream systems

**Real-World Example** (Storyline App - Boy and the Baker):

**INPUT**: Simple narrative transcript (3,250 characters):
```
The Boy and the Baker by Vaz
An elderly baker walking to his shop sees a boy being
bullied and beaten by a gang of older children...
[Full story: 631 words, ~5 minutes]
```

**TEMPLATES APPLIED**: Series of prompt templates for:
- Character extraction and profiling
- Visual scene breakdown
- Shot composition and camera angles
- Emotional tone and mood
- Animation instructions
- Color palette and styling

**OUTPUT**: Rich storyline JSON (21KB structured data):
```json
{
  "metadata": {
    "totalBeats": 64,
    "totalVisualConcepts": 16,
    "totalImageVariations": 68,
    "totalAnimations": 68,
    "totalDuration": 298.84
  },
  "cast": [
    {
      "key": "baker",
      "name": "The Baker",
      "age": "60-63",
      "visualProfile": {
        "build": "Sturdy frame, gently weathered",
        "colorSignature": ["warm ochre", "dusty brown", "cream"],
        "symbolism": "Bread as sacrament; represents sanctuary"
      }
    }
    // ... more characters
  ],
  "beats": [
    {
      "id": 1,
      "timing": {"start": "00:05.56", "end": "00:13.36"},
      "narrative": {"text": "...", "speaker": "narrator"},
      "visualConcepts": [
        {
          "conceptNumber": 1,
          "description": "Baker walks toward shop",
          "shotType": "wide",
          "cameraAngle": "eye-level",
          "mood": "warm, peaceful",
          "characters": ["baker"]
        }
        // ... 67 more visual concepts across 64 beats
      ]
    }
    // ... 63 more beats
  ]
}
```

**The Transformation**:
- 631 words → 64 narrative beats with precise timing
- Simple text → Complete visual production specification
- Characters extracted with detailed visual profiles
- Every shot planned with camera angles, mood, composition
- Machine-readable format ready for animation pipeline

**This is POEM's Power**: Templates as data transformation engine
- Input: Unstructured narrative
- Processing: Multiple specialized prompt templates
- Output: Fully structured production-ready data

This transforms POEM from "prompt tester" to **"data transformation pipeline"** using prompts as the transformation logic.

### Potential Fourth Agent: Data/Testing Agent

**Status**: Under consideration - may need separate agent for data workflows

**Possible Responsibilities**:
- Generate mock data based on schemas
- Validate data against schemas
- Test template rendering with various data scenarios
- Batch apply templates to datasets (input → output transformation)
- Export/import data for testing

**Name Options**:
- **Data Engineer Agent** (focus: data generation and transformation)
- **Testing Agent** (focus: template validation and testing)
- **Data Workflow Agent** (focus: end-to-end data pipelines)

**Distinction from Other Agents**:
- **Prompt Engineer**: Creates/refines templates (content focus)
- **System Agent**: Maintains infrastructure (Astro, Handlebars, APIs)
- **Integration Agent**: Connects to external providers (publish/sync)
- **Data/Testing Agent**: Works with data (generate, validate, transform, test)

**Open Question**: Is this a separate agent or an extension of Testing/Prompt Engineer responsibilities?

**Design Principle**: Don't create agent until workflows clearly demand it

---

## Three Agents Confirmed (Fourth Under Consideration)

### 1. **Prompt Engineer Agent**
**Goal**: Create, refine, validate prompts using POEM principles

**Skills**:
- Check My Template
- Preview with Example Data
- Generate Placeholder Schema
- Find Fields in Data Dictionary
- Validate Schema Against Dictionary
- Suggest Mappings
- Create Prompt from Principles (uses brain/)

**Works with**: `/poem/prompts/`, `/poem/schemas/`

---

### 2. **System Agent** (NEW)
**Goal**: Maintain systems like Astro and Handlebars

**Skills**:
- Create Helper (generates code in `.poem-app/src/services/handlebars/helpers/`)
- Register Helper (calls Astro API to load it)
- Test Template (renders with sample data)
- List Helpers (shows available helpers)
- Update Helper (modifies existing)
- Manage Astro Server (start, stop, configure)
- Create/modify API endpoints

**Works with**: `.poem-app/` (Astro, Handlebars, APIs)

**Why separate agent**:
- Different domain (system maintenance vs content creation)
- Different mindset for Angela ("maintaining the system" vs "creating prompts")
- Clear boundary (System infrastructure vs prompt content)

---

### 3. **Integration Agent**
**Goal**: Integrate with external systems (SupportSignal, future providers)

**Skills**:
- Pull Data Dictionary (from provider)
- Publish Template (to provider)
- Test Connection (verify provider works)
- Sync Status (check what's published)

**Works with**: Astro Provider APIs (`/api/providers/[name]`)

**Why separate**:
- External boundaries (not POEM internals)
- Could fail (network, auth, API changes)
- Provider-specific logic

---

## Visualization = Skill, Not Agent

**Any agent can call**:
- **Skill**: "Open Dashboard"
- **Action**: Launches browser to configured Astro URL
- **No separate agent needed** - it's a capability available to all

---

## Skills vs MCP vs Astro API - Clarity

**Research findings**:
- **Skills**: Teach Claude HOW to do tasks (procedures, workflows, orchestration)
- **MCP**: Connect Claude TO data sources (implicit, context-based)
- **Astro API**: Persistent services with explicit HTTP calls

**POEM architecture**:
- ✅ **Skills** orchestrate workflows → Call Astro APIs explicitly
- ✅ **Astro APIs** provide heavy lifting → Handlebars engine, Provider connectors
- ❌ **No MCP needed** → Direct HTTP is simpler and explicit (as David intuited)

**Why explicit > implicit**:
- Skills call APIs with clear intent (`POST /api/handlebars/render`)
- No "muddy waters" of MCP context magic
- Testable (can `curl` the endpoints)
- Future-proof (can decouple to remote server)

---

## References

- **BMAD v4 Documentation**: `/Users/davidcruwys/dev/ad/brains/bmad-method/`
  - `v4-fundamentals.md` - Core concepts, `.bmad-core/` structure, template-driven workflows
  - `v4-agents-reference.md` - All 10 agent definitions, commands, personas
  - `v4-workflows.md` - Complete workflow patterns, especially `*draft` command
  - `v4-practical-examples.md` - Real usage examples, daily workflows
  - `comparison/workflow-comparison.md` - v4 vs v6 comparison (why v4 is 3x faster)

- **Original Planning Docs**:
  - `claude-skills.md` - 8 skills specification
  - `data-dictionary.md` - Data integration requirements
  - `brief.md` - Original tech stack decisions

- **Previous Exploration**:
  - `exploration-conventional-types.md` - Earlier feature-based analysis (archived)

---

## Agent Names - Function Over Technology (Under Discussion)

**Principle**: Agent names should describe FUNCTION, not technology they use.

### Current Leading Names

**Agent 1: Prompt Engineer** ✅
- **Status**: Confirmed
- **Function**: Creates, refines, validates prompts
- **Domain**: Content (prompts, schemas, mappings)

**Agent 2: System Agent** (Leading candidate)
- **Status**: Preferred name
- **Function**: Maintains systems like Astro and Handlebars
- **Domain**: System infrastructure (helpers, APIs, server management)
- **Previous name**: "Handlebars Agent" (too technology-specific)

**Agent 3: Integration Agent** (Leading candidate)
- **Status**: Preferred name
- **Function**: Integrates with external systems
- **Domain**: External boundaries (providers, data dictionary, publishing)
- **Previous name**: "DevOps Agent" (too generic)

---

### Alternative Options Considered

**For Agent 2 (System Maintenance)**:
- ✅ **System Agent** - Maintains the systems (preferred)
- Extension Agent - Extends the system
- Workshop Agent - Builds tools
- Toolsmith Agent - Crafts system tools
- Infrastructure Agent - Manages infrastructure

**For Agent 3 (External Integration)**:
- ✅ **Integration Agent** - Integrates with external systems (preferred)
- Bridge Agent - Bridges to external world
- Connector Agent - Connects to providers
- Gateway Agent - Gateway to external systems
- Sync Agent - Syncs with external systems

---

### Capabilities by Agent

**Prompt Engineer**:
- Create/edit prompts
- Generate schemas
- Map fields
- Validate templates
- Search data dictionary
- Preview/test with data

**System Agent**:
- Create Handlebars helpers
- Test/register helpers
- Manage Astro server
- Create/modify Astro API endpoints
- Extend system functionality
- Configure infrastructure

**Integration Agent**:
- Connect to providers (SupportSignal/Convex, future)
- Pull data dictionary from external systems
- Publish templates to external systems
- Test connections
- Sync status/data

---

**Note**: Names to be finalized after more exploration and understanding of actual workflows.

---

## System Architecture Diagrams (2025-11-19)

### 1. Three-Layer System Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Angela (User)                            │
│          Works in Agentic Development Environment            │
│                    (Claude Code, etc.)                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  POEM Operating System                       │
│                    (.poem-core/)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Prompt     │  │   System     │  │ Integration  │      │
│  │  Engineer    │  │    Agent     │  │    Agent     │      │
│  │   Agent      │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Workflows (YAML templates)                         │    │
│  │  - create-prompt/    - test-prompt/                │    │
│  │  - refine-prompt/    - deploy-prompt/              │    │
│  │  - add-helper/                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Brain (Prompt Engineering Knowledge)               │    │
│  │  - principles.md  - patterns.md  - anti-patterns.md│    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Application Infrastructure                      │
│                  (.poem-app/)                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Astro Server (SSR + APIs)          Port: 4321       │  │
│  │                                                       │  │
│  │  Visualization Pages:                                │  │
│  │  ├── /prompts       (list all prompts)              │  │
│  │  ├── /schemas       (list all schemas)              │  │
│  │  └── /dashboard     (overview)                      │  │
│  │                                                       │  │
│  │  API Endpoints:                                      │  │
│  │  ├── /api/handlebars/render                         │  │
│  │  ├── /api/handlebars/compile                        │  │
│  │  └── /api/providers/[name]/                         │  │
│  │      ├── read-dictionary                            │  │
│  │      ├── publish-template                           │  │
│  │      └── test-connection                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Services (Application Code)                          │  │
│  │  └── handlebars/                                     │  │
│  │      ├── engine.ts      (persistent Handlebars)     │  │
│  │      └── helpers/       (custom helpers - JS code)  │  │
│  │          ├── fullName.js                             │  │
│  │          └── titleCase.js                            │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                Angela's Workspace                            │
│                    (/poem/)                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  prompts/    │  │  schemas/    │  │  mappings/   │      │
│  │  *.hbs files │  │  *.json      │  │  *.json      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Note: Also data-sources/ (to be discussed)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              External Systems (Providers)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ SupportSignal / Convex                               │  │
│  │  - Data Dictionary (field definitions)               │  │
│  │  - Prompt Storage (production prompts)               │  │
│  │  - Schema Sync                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Future Providers                                     │  │
│  │  - Other systems Angela might integrate with        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Agent Responsibilities & Communication

```
┌────────────────────────────────────────────────────────────────┐
│                      POEM Agents                               │
└────────────────────────────────────────────────────────────────┘

┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  Prompt Engineer     │      │   System Agent       │      │ Integration Agent    │
│      Agent           │      │                      │      │                      │
├──────────────────────┤      ├──────────────────────┤      ├──────────────────────┤
│ Domain: Content      │      │ Domain: Infrastructure│     │ Domain: External     │
│                      │      │                      │      │                      │
│ Works with:          │      │ Works with:          │      │ Works with:          │
│ - /poem/prompts/     │      │ - .poem-app/         │      │ - Provider APIs      │
│ - /poem/schemas/     │      │ - Astro server       │      │ - Data dictionary    │
│ - /poem/mappings/    │      │ - Handlebars engine  │      │ - External systems   │
│                      │      │ - API endpoints      │      │                      │
│ Skills:              │      │                      │      │ Skills:              │
│ ✓ Check Template     │◄────►│ Skills:              │◄────►│ ✓ Pull Dictionary    │
│ ✓ Preview Data       │      │ ✓ Create Helper      │      │ ✓ Publish Template   │
│ ✓ Generate Schema    │      │ ✓ Register Helper    │      │ ✓ Test Connection    │
│ ✓ Find Fields        │      │ ✓ Test Template      │      │ ✓ Sync Status        │
│ ✓ Validate Schema    │      │ ✓ List Helpers       │      │                      │
│ ✓ Suggest Mappings   │      │ ✓ Update Helper      │      │                      │
│                      │      │ ✓ Manage Server      │      │                      │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
         │                             │                              │
         │                             │                              │
         └─────────────────────────────┴──────────────────────────────┘
                                       │
                              All agents can call
                                       │
                                       ▼
                          ┌────────────────────────┐
                          │   Astro API Endpoints  │
                          │  (Shared Infrastructure)│
                          └────────────────────────┘

Shared Skills (available to all agents):
- Visualization: Open Dashboard, View Prompt, List Templates
- File System: List Files, Read File, Search Files
- Configuration: Read Config, Update Config
```

---

### 3. Data Flow: Creating & Deploying a Prompt

```
Angela's Journey: "I need a new support ticket classifier prompt"

Step 1: CREATE
┌─────────────┐
│   Angela    │──► "Create new prompt: support-ticket-classifier"
└─────────────┘
       │
       ▼
┌─────────────────────────┐
│ Prompt Engineer Agent   │──► Consults .poem-core/brain/principles.md
└─────────────────────────┘
       │
       ▼
   Creates:  /poem/prompts/support-ticket-classifier.hbs
             /poem/schemas/support-ticket-classifier.json


Step 2: ADD HELPER (if needed)
┌─────────────┐
│   Angela    │──► "I need a titleCase helper"
└─────────────┘
       │
       ▼
┌─────────────────────────┐
│   System Agent          │──► Generates JS code
└─────────────────────────┘    Registers with Handlebars
       │
       ▼
   Creates:  .poem-app/src/services/handlebars/helpers/titleCase.js
             (Application CODE, not workspace data)


Step 3: TEST (Angela's most common task - repeated multiple times)
┌─────────────┐
│   Angela    │──► "Test this prompt with example data"
└─────────────┘
       │
       ▼
┌─────────────────────────┐
│ Prompt Engineer Agent   │──► Calls Astro API
└─────────────────────────┘
       │
       ▼
   POST /api/handlebars/render
   {
     template: "{{titleCase ticket.subject}}",
     data: {ticket: {subject: "help me"}}
   }
       │
       ▼
   Response: "Help Me"

   ┌──────────────────────────────────────┐
   │ Non-linear iteration loop:           │
   │ Test → Refine → Test → Refine → Test│
   └──────────────────────────────────────┘


Step 4: VALIDATE
┌─────────────┐
│   Angela    │──► "Validate schema against data dictionary"
└─────────────┘
       │
       ▼
┌─────────────────────────┐
│ Integration Agent       │──► Calls provider API
└─────────────────────────┘
       │
       ▼
   GET /api/providers/supportsignal/read-dictionary
       │
       ▼
   Compares schema fields vs available fields
   Reports: ✓ All fields valid


Step 5: DEPLOY (always happens at the end)
┌─────────────┐
│   Angela    │──► "Publish to production"
└─────────────┘
       │
       ▼
┌─────────────────────────┐
│ Integration Agent       │──► Pushes to Convex
└─────────────────────────┘
       │
       ▼
   POST /api/providers/supportsignal/publish-template
   {
     name: "support-ticket-classifier",
     template: "...",
     schema: {...}
   }
       │
       ▼
┌────────────────────────────┐
│ SupportSignal / Convex     │──► Prompt now in production
└────────────────────────────┘
```

---

### 4. File System Layout (Complete Picture)

```
project-root/
│
├── .poem-core/              ← THE OPERATING SYSTEM (installed via npx)
│   ├── agents/
│   │   ├── prompt-engineer.md
│   │   ├── system-agent.md
│   │   └── integration-agent.md
│   ├── workflows/
│   │   ├── create-prompt/
│   │   │   ├── workflow.yaml
│   │   │   ├── instructions.md
│   │   │   └── template.md
│   │   ├── refine-prompt/
│   │   ├── test-prompt/
│   │   ├── deploy-prompt/
│   │   └── add-helper/
│   ├── brain/               ← Prompt engineering knowledge
│   │   ├── principles.md
│   │   ├── patterns.md
│   │   └── anti-patterns.md
│   └── config.yaml          ← Port, endpoints, providers
│
├── .poem-app/               ← APPLICATION INFRASTRUCTURE (installed via npx)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro
│   │   │   ├── prompts.astro
│   │   │   └── api/
│   │   │       ├── handlebars/
│   │   │       │   ├── render.ts
│   │   │       │   └── compile.ts
│   │   │       └── providers/
│   │   │           └── [provider]/
│   │   │               ├── read-dictionary.ts
│   │   │               └── publish-template.ts
│   │   └── services/
│   │       └── handlebars/
│   │           ├── engine.ts
│   │           └── helpers/   ← Custom helpers (JS CODE)
│   │               ├── fullName.js
│   │               └── titleCase.js
│   ├── astro.config.mjs
│   └── package.json
│
└── poem/                    ← ANGELA'S WORKSPACE (user data)
    ├── prompts/
    │   ├── support-ticket-classifier.hbs
    │   └── customer-sentiment.hbs
    ├── schemas/
    │   ├── support-ticket-classifier.json
    │   └── customer-sentiment.json
    ├── mappings/
    │   └── ticket-to-convex.json
    └── data-sources/        ← FUTURE: May define use case + scope + shape
        └── (TBD based on actual usage)
```
