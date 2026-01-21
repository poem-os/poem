# Planning Notes

**Status**: ✅ Ready for BMAD Implementation
**Last Updated**: 2025-11-22
**Purpose**: Navigation and decision tracking for POEM planning documentation

⚠️ **IMPORTANT**: This is PLANNING-PHASE EXPLORATION, not final specifications.

---

## 🎯 Start Here

**Primary Document**: **[poem-requirements.md](./poem-requirements.md)** ← Complete requirements and system overview

**This README**: Navigation hub for planning folder + cross-cutting concerns (decision log, status tracking, reading paths)

---

## What This Folder Contains

This folder contains planning documentation for POEM. **Important**: These are planning explorations, not final architectural specifications.

### Organization

1. **poem-requirements.md** - Primary requirements document (START HERE)
   - What POEM is and what it does
   - Architecture, agents, skills, workflows
   - Complete system overview

2. **system-explorations/** - Planning ideas about how POEM could work
   - Agents, skills, workflows, structure concepts
   - Based on BMAD v4 patterns and Anthropic skills
   - **NOT final architecture** - use as reference context

3. **decisions/** - Open questions and alternatives
   - What needs deciding during implementation
   - Technology choices and tradeoffs
   - Decision status tracking

4. **exploration/** - Discovery journey
   - How we evolved from SupportSignal tool → Open source OS
   - Historical context for understanding POEM's purpose

5. **reference/** - External knowledge
   - SupportSignal patterns, BMAD methodology
   - Terminology glossary, example patterns
   - Links to second brains

---

## Document Structure

```
docs/planning/
├── poem-requirements.md                         # ← PRIMARY DOCUMENT (start here)
├── README.md                       # ← You are here (index)
│
├── system-explorations/            # ✅ RENAMED (was architecture/)
│   ├── README.md                   # ✅ BMAD disclaimer
│   ├── agents.md                   # 3-4 agents (Prompt Engineer, System, Integration, Data/Testing?)
│   ├── skills.md                   # 8 skills specifications
│   ├── workflows.md                # 5 core workflows (new, refine, deploy, test, add-helper)
│   ├── structure.md                # System architecture (.poem-core/ + .poem-app/ + /poem/)
│   └── mock-data.md                # Mock data generation (killer feature)
│
├── decisions/                      # Open questions
│   ├── README.md                   # ✅ Decision status log
│   ├── handlebars-templating.md    # ✅ Decided: Use Handlebars
│   ├── schema-format-alternatives.md # Open: Schema format choice
│   └── mapping-architecture-concepts.md # Deferred: YAGNI
│
├── exploration/                    # Historical journey
│   ├── README.md                   # ✅ Journey explanation
│   ├── brief.md                    # Original project brief
│   ├── application-type-README.md  # How we discovered OS concept
│   ├── conventional-types.md       # Early app type exploration
│   └── naming.md                   # ✅ MOVED from architecture/
│
├── reference/                      # External knowledge
│   ├── README.md                   # ✅ External knowledge index + second brains
│   ├── main-app-concepts.md        # Patterns from SupportSignal
│   ├── bmad-reference.md           # BMAD methodology guide
│   ├── data-dictionary.md          # Data integration requirements
│   ├── glossary.md                 # ✅ MOVED from architecture/
│   ├── bmad-pattern-example.md     # ✅ MOVED from architecture/
│   └── examples.md                 # ✅ MOVED from architecture/
│
└── archive/                        # ✅ Archived files
    ├── 00-original-overview-2025-11-08.md
    └── 01-current-thinking-archive.md
```

---

## Decision Log

### Major Architecture Decisions (2025-11-19)

| Date       | Decision                                                              | Doc                              |
| ---------- | --------------------------------------------------------------------- | -------------------------------- |
| 2025-11-18 | **Application Type**: Prompt Engineering OS                           | poem-requirements.md                          |
| 2025-11-19 | **Name**: POEM (Prompt Orchestration and Engineering Method)          | exploration/naming.md            |
| 2025-11-19 | **3-4 Agents**: Function-based naming, skills autonomous              | system-explorations/agents.md    |
| 2025-11-19 | **8 Skills**: Core POEM capabilities                                  | system-explorations/skills.md    |
| 2025-11-19 | **Structure**: .poem-core/ + .poem-app/ + /poem/                      | system-explorations/structure.md |
| 2025-11-19 | **Mock Data**: Core value proposition                                 | system-explorations/mock-data.md |
| 2025-11-19 | **v4 BMAD Patterns**: Template-driven, 3x faster                      | system-explorations/structure.md |
| 2025-11-19 | **Astro API**: Persistent server (not MCP)                            | system-explorations/structure.md |
| 2025-11-19 | **Two Domains**: SupportSignal + Storyline                            | reference/examples.md            |
| 2025-11-20 | **Documentation Structure**: Primary doc + modular references         | This restructure                 |
| 2025-11-21 | **Glossary**: Domain terminology reference                            | reference/glossary.md            |
| 2025-11-21 | **Level 2 Mock Data**: Persistent scenarios, anonymization, workflows | system-explorations/mock-data.md |
| 2025-11-21 | **TOON Format**: Token-efficient data format option                   | system-explorations/workflows.md |
| 2025-11-21 | **Folder Reorganization**: architecture/ → system-explorations/       | README.md                        |

### 🚧 Active Planning Areas (Watch During Implementation)

| Area                  | Status              | What to Watch For                                                               | Doc                              |
| --------------------- | ------------------- | ------------------------------------------------------------------------------- | -------------------------------- |
| **Fourth Agent**      | Under consideration | Mock data bottlenecks, testing orchestration needs, Prompt Engineer overwhelmed | system-explorations/agents.md    |
| **Mock Data Library** | Designing Level 2   | Anonymization complexity, entity persistence patterns, workflow scenarios       | system-explorations/mock-data.md |

**📌 NOTE TO CLAUDE**: These are areas we're actively evaluating. Flag observations that inform these decisions!

### Open Decisions

| Question                           | Options                  | Current Thinking      | Doc                                        |
| ---------------------------------- | ------------------------ | --------------------- | ------------------------------------------ |
| Handlebars or simple placeholders? | Handlebars vs {{simple}} | Handlebars preferred  | decisions/handlebars-templating.md         |
| Schema format?                     | JSON, Zod, YAML, HCL     | JSON now, Zod later?  | decisions/schema-format-alternatives.md    |
| Build mapping system?              | Yes/No/Later             | YAGNI - wait for need | decisions/mapping-architecture-concepts.md |

### Blocked Items

| Item                       | Blocker                | Impact                       | Doc                          |
| -------------------------- | ---------------------- | ---------------------------- | ---------------------------- |
| Data dictionary population | Main app export needed | Can't fully validate schemas | reference/data-dictionary.md |

---

## Reading Paths

### First Time (Understanding POEM)

1. **[poem-requirements.md](./poem-requirements.md)** - Complete overview (start here)
2. **[reference/examples.md](./reference/examples.md)** - Real-world use cases (SupportSignal + Storyline)
3. **[system-explorations/agents.md](./system-explorations/agents.md)** - POEM's agents (what we're building)
4. **[system-explorations/workflows.md](./system-explorations/workflows.md)** - Core workflows
5. **[system-explorations/mock-data.md](./system-explorations/mock-data.md)** - Killer feature

### Technical Deep Dive

6. **[system-explorations/structure.md](./system-explorations/structure.md)** - System architecture ideas
7. **[system-explorations/skills.md](./system-explorations/skills.md)** - Skill specifications
8. **[reference/bmad-reference.md](./reference/bmad-reference.md)** - BMAD methodology context
9. **[reference/main-app-concepts.md](./reference/main-app-concepts.md)** - SupportSignal patterns to adopt

### Historical Context

10. **[exploration/brief.md](./exploration/brief.md)** - Original project brief
11. **[exploration/application-type-README.md](./exploration/application-type-README.md)** - Discovery journey (tool → OS)
12. **[decisions/\*.md](./decisions/)** - Open questions and alternatives

### For BMAD Team

**Business Analyst**: poem-requirements.md → reference/examples.md → exploration/ (why POEM exists)

**PRD Writer**: poem-requirements.md → system-explorations/ (as ideas, not specs) → decisions/README.md

**Architect**: poem-requirements.md → system-explorations/README.md (read disclaimer) → reference/bmad-reference.md → Second brains

---

## For BMAD Implementation

**When starting BMAD**:

1. Read **[poem-requirements.md](./poem-requirements.md)** as primary requirements document
2. Reference `system-explorations/` for planning ideas (NOT final architecture)
3. Use `reference/` docs for external context (BMAD methodology, SupportSignal patterns)
4. Resolve `decisions/` as needed during implementation
5. Use example data in `../../data/` for testing and validation

**Key Principle**: This is planning. BMAD will turn planning ideas into actual implementation.

**Second Brains**: See [poem-requirements.md](./poem-requirements.md#second-brains-knowledge-bases) for complete list

---

## Quick Links

**Example Data**: `../../data/supportsignal/` and `../../data/storyline/`

**External Knowledge**: See [reference/README.md](./reference/README.md) for second brain locations

**Primary Reference**: [poem-requirements.md](./poem-requirements.md) - Always start there for what POEM is and does

---

## Use These Docs For

✅ Understanding POEM's purpose and architecture
✅ Learning from real-world examples (SupportSignal + Storyline)
✅ Reference during BMAD implementation
✅ Context for design decisions

## Don't Treat These As

❌ Final implementation specifications
❌ API documentation (that comes from implementation)
❌ User documentation (that comes later)
❌ Locked-in requirements (BMAD may reveal better approaches)

---

**Last Updated**: 2025-11-22
**Status**: ✅ Ready for BMAD
