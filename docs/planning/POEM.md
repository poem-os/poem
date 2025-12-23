# POEM - Prompt Orchestration and Engineering Method

**Status**: Planning phase complete - Ready for BMAD implementation
**Last Updated**: 2025-11-20
**Version**: 1.0.0

---

## What is POEM?

**POEM** is a Prompt Engineering Operating System that runs on Claude Code (similar to how BMAD is a Software Development).

**Full Name**: Prompt Orchestration and Engineering Method
**Tagline**: _"Poetry in Prompt Engineering"_
**Secondary Tagline**: _"Compose. Test. Refine. Deploy."_

**Organization**: `poem-os`
**Repository**: `poem-os/poem`
**NPM Package**: `poem-os` ✨ (available)

---

## Quick Summary

**Installation** (future):

```bash
npx poem-os install           # Everything (.poem-core/ + .poem-app/)
npx poem-os install --core    # Just .poem-core/
npx poem-os install --app     # Just .poem-app/
```

**What it does**:

- Create, refine, and test AI prompt templates
- Generate mock data for testing without production access
- Validate schemas against data dictionaries
- Publish prompts to external systems (SupportSignal/Convex, etc.)
- Transform data using prompt pipelines

**Who it's for**:

- Prompt engineers (like vOz from vOz Studios, Angela from SupportSignal)
- Teams building AI-powered applications
- Anyone needing systematic prompt development and deployment

---

## The Breakthrough Insight

POEM is a specialized framework that runs on AI coding assistants - similar to how a build framework (like Vite or Webpack) runs in any IDE. Understanding this layered architecture helps clarify where POEM fits in the AI development ecosystem.

### The Layering Model

```
┌─────────────────────────────────────────┐
│  Your Work (Apps, Prompts, Templates)   │
├─────────────────────────────────────────┤
│  Frameworks (BMAD, POEM)                │
├─────────────────────────────────────────┤
│  AI Assistants (Claude Code, Cursor...) │
├─────────────────────────────────────────┤
│  AI Providers (Anthropic, OpenAI...)    │
└─────────────────────────────────────────┘
```

**Note**: While POEM is optimized for Claude Code, the framework design allows for future compatibility with other AI coding assistants.

### AI Development Stack

**AI Model Providers**

- Anthropic Claude, OpenAI GPT, etc.
- Provide AI capabilities and processing

**AI Coding Assistants**

- Claude Code (primary platform) ⭐
- Cursor, Codex, GitHub Copilot
- Provide workspace, tools, and orchestration

**Specialized Frameworks**

- **BMAD**: Software development framework
  - Orchestrates agents to build software
  - `.bmad-core/` structure, workflow templates
- **POEM**: Prompt engineering framework
  - Orchestrates agents to build prompts
  - `.poem-core/` structure, workflow templates

**Your Work**

- Applications (BMAD output)
- Prompts, Templates, Schemas (POEM output)

---

## Architecture Overview

### Three-Part System Structure

**1. `.poem-core/`** - The Operating System (installed once)

- Agents (Prompt Engineer, System Agent, Integration Agent)
- Workflows (YAML templates for common tasks)
- Brain (prompt engineering knowledge base)
- Config (ports, endpoints, providers)

**2. `.poem-app/`** - Application Infrastructure

- Astro server (visualization + APIs)
- Handlebars engine (template rendering)
- Provider APIs (external system integration)
- Custom helpers (on-demand JS code generation)

**3. `/poem/`** - User Workspace

- Prompts (`.hbs` templates)
- Schemas (JSON field definitions)
- Mappings (data transformations)

**See**: [system-explorations/structure.md](./system-explorations/structure.md) for complete details

---

## Agents (3-4 Confirmed)

### 1. Prompt Engineer Agent

**Goal**: Create, refine, validate prompts using POEM principles

**Capabilities**:

- Create/edit prompt templates
- Generate schemas from templates
- Map fields between data sources
- Preview with mock/example data
- Validate templates and schemas

### 2. System Agent

**Goal**: Maintain infrastructure (Astro, Handlebars, APIs)

**Capabilities**:

- Create Handlebars helpers (generates JS code on-demand)
- Manage Astro server (start, stop, configure)
- Create/modify API endpoints
- Test and register helpers

### 3. Integration Agent

**Goal**: Connect to external systems (SupportSignal, future providers)

**Capabilities**:

- Pull data dictionary from providers
- Publish templates to production
- Test connections
- Sync schemas and status

### 4. Data/Testing Agent 🚧 UNDER ACTIVE PLANNING

**Goal**: Manage mock data ecosystem, test workflows, validate data quality

**Status**: Not yet decided - watching for trigger points during BMAD implementation

**Why considering**:

- Level 2 mock data is substantial work (entity management, anonymization, library curation)
- SupportSignal compliance needs require audit-ready test scenarios
- Workflow testing across multi-prompt pipelines needs orchestration

**Decision approach**: Build with 3 agents first, add 4th if pain points emerge

**📌 NOTE TO CLAUDE**: This is an **area of active planning**. If you notice:

- Mock data tasks becoming complex
- Data management bottlenecks
- Testing orchestration challenges
- Separation of concerns issues
  → **Flag it as evidence for/against Fourth Agent decision**

**See**: [system-explorations/agents.md](./system-explorations/agents.md) for detailed analysis and trigger points

---

## Skills (8 Total)

Skills are autonomous, single-responsibility entities that suggest when they're useful. Claude decides which skill to use based on context.

### Prompt & Schema Skills

- **Check My Prompt** - Validate prompt structure and placeholders
- **Generate Placeholder Schema** - Auto-create schema from prompt
- **Preview with Example Data** - Render prompt with sample data

### Data Dictionary Skills

- **Find Fields in Data Dictionary** - Search available fields
- **Validate Schema Against Dictionary** - Ensure fields exist
- **Suggest Mappings** - Recommend field mappings

### Integration Skills

- **Pull Data Dictionary** - Import from provider
- **Publish Prompt** - Deploy to production

**See**: [system-explorations/skills.md](./system-explorations/skills.md) for complete specifications

---

## Core Workflows

### 1. New Prompt

Create brand new prompt from scratch

- Consult principles
- Create prompt + schema
- Preview with example data
- Validate structure

### 2. Refine Prompt (Most Common)

Improve existing prompt iteratively

- Load prompt
- Test with data
- Identify issues
- Update prompt
- Repeat (non-linear iteration)

### 3. Deploy Prompt (Always at End)

Push tested prompt to production

- Validate schema
- Test connection
- Publish prompt
- Confirm deployment

### 4. Test Prompt

Test prompt performance with real/mock data

- Pull/generate sample data
- Render template
- Compare to expected output
- Report field usage

### 5. Add Helper

Create new Handlebars helper on-demand

- Define requirements
- Generate JS code
- Register with engine
- Test availability

**See**: [system-explorations/workflows.md](./system-explorations/workflows.md) for complete details

---

## Mock Data Generation (Killer Feature)

**The Problem**: Testing prompts requires data, but manually creating test data is slow and requires production access.

**The Solution**: Auto-generate realistic mock data from schemas.

### How It Works

```
1. Angela creates template: "Analyze incident for {{participantName}}"
2. Template references data source: "incident.single"
3. POEM reads incident schema (participantName: string, location: string)
4. POEM generates mock data: {participantName: "John Smith", location: "Kitchen"}
5. Angela tests template instantly
6. Iterates rapidly without production access
7. Publishes when satisfied
```

### Why This Matters

**Independence**: No production database access needed
**Speed**: Generate hundreds of test scenarios instantly
**Privacy**: No real user data in POEM workspace
**Iteration**: Test edge cases, long text, special characters

**See**: [system-explorations/mock-data.md](./system-explorations/mock-data.md) for complete details

---

## Example Domains

POEM includes two real-world example domains:

### Domain 1: SupportSignal (NDIS/Healthcare)

**Use Case**: Incident reporting and analysis
**Pattern**: Linear workflows, single-step prompts
**Data**: Incident entities with workflow-based processing

**Examples**:

- Ask clarifying questions
- Enhance narrative
- Classify severity
- Extract timeline

### Domain 2: Storyline (Creative Production)

**Use Case**: Transform narrative to visual production spec
**Pattern**: Multi-step pipeline, context accumulation
**Data**: 631 words → 21KB structured JSON (64 beats, 68 visual concepts)

**Pipeline**:

1. Extract characters with visual profiles
2. Define visual style guide
3. Break into narrative beats
4. Generate visual concepts per beat

### Comparison

| Aspect     | SupportSignal | Storyline                |
| ---------- | ------------- | ------------------------ |
| Workflow   | Linear        | Pipeline                 |
| Complexity | Single-step   | Multi-step orchestration |
| Output     | Enhanced text | Rich structured data     |
| Use Case   | Compliance    | Creative production      |

**See**: [reference/examples.md](./reference/examples.md) for complete details

---

## Technical Architecture

### Astro API Pattern

**Why**: Handlebars needs heavy boot cycle (compile templates + load 20-30 helpers)

**Solution**: Persistent Astro server with explicit HTTP calls

```typescript
// Skills call APIs explicitly (not MCP)
POST http://localhost:4321/api/handlebars/render
{
  "template": "{{titleCase name}}",
  "data": {"name": "john"}
}

Response: {"result": "John"}
```

### Provider Pattern

**Problem**: SupportSignal/Convex is specific, need generic integration

**Solution**: Provider pattern via Astro APIs

```
/api/providers/supportsignal/read-dictionary
/api/providers/supportsignal/publish-template
/api/providers/supportsignal/sync-schema
/api/providers/[new-provider]/...
```

### On-Demand Helper Creation

Helpers are generated as CODE by agents when needed:

```
Angela: "I need a fullName helper"
→ System Agent generates .poem-app/src/services/handlebars/helpers/fullName.js
→ Registers with Handlebars engine
→ Available immediately: {{fullName participant.firstName participant.lastName}}
```

**See**: [system-explorations/structure.md](./system-explorations/structure.md) for complete technical details

---

## Design Decisions

### Naming

**Final**: POEM - Prompt Orchestration and Engineering Method

- Visually striking (4-letter word)
- Correctly spelled (searchable, memorable)
- NPM package available (`poem-os`)
- Quirk accepted: "Orchestration" before "Engineering" (memorability > grammar)

**See**: [exploration/naming.md](./exploration/naming.md) for alternatives considered

### BMAD Version

**Decision**: Use v4 patterns (not v6)

- 3x faster workflows (5 min vs 15 min)
- Template-driven (YAML workflows)
- Stable (not alpha)
- Solo-optimized (Angela works alone)

### Skills vs MCP vs Astro API

**Decision**: Skills + Astro APIs (no MCP)

- Skills: Teach Claude HOW to do tasks
- Astro APIs: Provide heavy lifting (explicit HTTP calls)
- No MCP: Simpler, explicit, testable (can `curl` endpoints)

---

## Reference Documentation

### System Explorations (Planning Ideas)

- [agents.md](./system-explorations/agents.md) - Agent definitions and capabilities
- [skills.md](./system-explorations/skills.md) - Skill specifications
- [workflows.md](./system-explorations/workflows.md) - Core workflow patterns
- [structure.md](./system-explorations/structure.md) - System architecture and tech decisions
- [mock-data.md](./system-explorations/mock-data.md) - Mock data generation (killer feature)

### Reference (External Knowledge)

- [main-app-concepts.md](./reference/main-app-concepts.md) - Patterns from SupportSignal
- [bmad-reference.md](./reference/bmad-reference.md) - BMAD methodology
- [data-dictionary.md](./reference/data-dictionary.md) - Data integration requirements
- [glossary.md](./reference/glossary.md) - Terminology reference
- [bmad-pattern-example.md](./reference/bmad-pattern-example.md) - Task/Template/Checklist pattern
- [examples.md](./reference/examples.md) - Two complete domain examples (SupportSignal + Storyline)

### Decisions (Open Questions)

- [handlebars-templating.md](./decisions/handlebars-templating.md) - Template approach
- [schema-format-alternatives.md](./decisions/schema-format-alternatives.md) - Schema format choice
- [mapping-architecture-concepts.md](./decisions/mapping-architecture-concepts.md) - Mapping system (YAGNI)

### Exploration (Historical Journey)

- [brief.md](./exploration/brief.md) - Original project brief
- [conventional-types.md](./exploration/conventional-types.md) - Early app type exploration
- [application-type-README.md](./exploration/application-type-README.md) - How we discovered OS concept
- [naming.md](./exploration/naming.md) - Naming journey and rationale

### Example Data

- ../../data/supportsignal/ - Complete NDIS domain example
- ../../data/storyline/ - Complete creative production example

### Second Brains (Knowledge Bases)

**Claude Skills**:

- **Location**: `/Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/`
- **Index**: [INDEX.md](/Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/INDEX.md)
- **Key Docs**:
  - [creating-custom-skills.md](/Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/creating-custom-skills.md) - Step-by-step skill creation
  - [best-practices.md](/Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/best-practices.md) - Authoring guide
  - [claude-code-skills.md](/Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/claude-code-skills.md) - Claude Code implementation
- **Use For**: Creating POEM's 8 skills, understanding progressive disclosure, skill composition

**BMAD Method**:

- **Location**: `/Users/davidcruwys/dev/ad/brains/bmad-method/`
- **Key Docs**:
  - `v4-fundamentals.md` - Core concepts, `.bmad-core/` structure
  - `v4-agents-reference.md` - All 10 agent definitions
  - `v4-workflows.md` - Complete workflow patterns
  - `v4-practical-examples.md` - Real usage examples
- **Use For**: POEM's v4 patterns (template-driven, YAML workflows, single-step commands)

**Local Repositories**:

- Skills examples: `/Users/davidcruwys/dev/js_3rd/anthropic-skills/`
- Anthropic SDK: `/Users/davidcruwys/dev/js_3rd/anthropic-sdk-typescript/`

---

## Decision Log

### Major Decisions (2025-11-19)

| Date       | Decision                                                         | Rationale                                                      |
| ---------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| 2025-11-18 | **Application Type**: Prompt Engineering OS                      | Not a web app - OS for prompt engineering on Claude Code       |
| 2025-11-19 | **Name**: POEM                                                   | Organization: poem-os, Tagline: "Poetry in Prompt Engineering" |
| 2025-11-19 | **3-4 Agents**: Prompt Engineer, System Agent, Integration Agent | Function-based naming, skills are autonomous                   |
| 2025-11-19 | **8 Skills**: Core POEM capabilities                             | Backup skill dropped, focus on mock data generation            |
| 2025-11-19 | **Structure**: .poem-core/ + .poem-app/ + /poem/                 | Three-part system with clear separation                        |
| 2025-11-19 | **Mock Data Generation**: Core value proposition                 | Enables testing without production data access                 |
| 2025-11-19 | **Data Sources**: Concept identified, TBD implementation         | Use case + scope + shape pattern                               |
| 2025-11-19 | **v4 BMAD Patterns**: Template-driven, single-step               | 3x faster than v6, stable, no XML                              |
| 2025-11-19 | **Astro API Pattern**: Persistent server + HTTP                  | Not MCP, configurable endpoints                                |
| 2025-11-19 | **Two Example Domains**: SupportSignal + Storyline               | Real data demonstrating different patterns                     |

### Open Decisions

| Question                               | Options                  | Current Thinking                                  |
| -------------------------------------- | ------------------------ | ------------------------------------------------- |
| Use Handlebars or simple placeholders? | Handlebars vs {{simple}} | Handlebars preferred (eliminates 80% of mappings) |
| Schema format?                         | JSON, Zod, YAML, HCL     | JSON now, Zod validation later?                   |
| Build mapping system?                  | Yes/No/Later             | YAGNI - wait for actual need                      |
| Fourth agent needed?                   | Data/Testing Agent       | TBD based on actual workflows                     |

---

## What's Next?

### Phase Complete: Requirements Gathering ✅

We've completed exploration and requirements gathering:

- ✅ Identified system type (OS for prompt engineering)
- ✅ Named it (POEM)
- ✅ Defined structure (.poem-core/ + .poem-app/ + /poem/)
- ✅ Identified agents (3-4 confirmed)
- ✅ Listed skills (8 core capabilities)
- ✅ Captured two example domains
- ✅ Discovered killer feature (mock data generation)
- ✅ Documented workflows, patterns, architecture

### Next Phase Options

**Option 1: Start Building with BMAD** 🛠️ (Recommended)

- Use BMAD v4 method to create POEM
- Begin with Epic 1: Core Infrastructure
- Build .poem-core/ structure
- Implement first agent (Prompt Engineer)
- Create initial skills

**Option 2: Continue Planning** 📋

- Resolve open decisions (Handlebars? Schema format?)
- Get data dictionary export from main app
- Define more detailed skill specifications
- Create mockups of Astro visualization

**Option 3: Prototype/Spike** 🔬

- Quick proof-of-concept for mock data generation
- Test Astro API pattern with Handlebars
- Validate agent switching concept
- Experiment with skill definitions

---

## File Structure (This Documentation)

```
docs/planning/
├── POEM.md                         # ← YOU ARE HERE (Primary document)
├── README.md                       # Index and status tracking
│
├── system-explorations/            # Planning ideas (NOT final architecture)
│   ├── README.md                   # BMAD disclaimer
│   ├── agents.md
│   ├── skills.md
│   ├── workflows.md
│   ├── structure.md
│   └── mock-data.md
│
├── reference/                      # External knowledge
│   ├── README.md                   # External knowledge index + second brains
│   ├── main-app-concepts.md
│   ├── bmad-reference.md
│   ├── data-dictionary.md
│   ├── glossary.md
│   ├── bmad-pattern-example.md
│   └── examples.md
│
├── decisions/                      # Open questions
│   ├── README.md                   # Decision status log
│   ├── handlebars-templating.md
│   ├── schema-format-alternatives.md
│   └── mapping-architecture-concepts.md
│
├── exploration/                    # Historical journey
│   ├── README.md                   # Journey explanation
│   ├── brief.md
│   ├── conventional-types.md
│   ├── application-type-README.md
│   └── naming.md
│
└── archive/                        # Archived files
    ├── 00-original-overview-2025-11-08.md
    └── 01-current-thinking-archive.md
```

---

**Remember**: This is planning. BMAD will turn planning into implementation.

**Last Updated**: 2025-11-20
**Status**: ✅ Ready for BMAD
