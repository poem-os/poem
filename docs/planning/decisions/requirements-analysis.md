# Requirements Analysis & Decision Rationale

**Date**: 2025-11-23
**Purpose**: Document why original requirements were problematic and how we arrived at the final agent-focused structure
**Outcome**: 25 Functional Requirements + 12 Non-Functional Requirements organized into 3 conceptual groups

---

## Executive Summary

The original functional requirements (FR1-FR15) were too implementation-focused and missed POEM's core value proposition: **agent-guided workflows for systematic prompt engineering**. Through iterative Q&A, we restructured requirements around:

1. **Four agents with ~15-20 workflows** (not just tools/APIs)
2. **User capabilities** (what Angela/Vasilios can accomplish, not how the system works)
3. **Correct abstraction level** (requirements describe what's possible, not when it becomes possible)

**Final Output**: See `requirements-paste.md` for the complete Section 2 ready for PRD conversation.

---

## What Was Wrong With Original Requirements

### Problem 1: Missing Core Value Proposition (Agents & Workflows)

**Original approach**: Treated POEM like a tool collection
- FR2 mentioned "Prompt Engineer Agent" as a single line
- FR13 mentioned workflows as a single line
- No mention of systematic, guided workflows as primary interface

**What was missing**: The planning documents position POEM as an **agent-guided operating system**, not a templating library with scripts. Agents and workflows ARE the product.

### Problem 2: Wrong Abstraction Level (Technical Plumbing vs User Needs)

**Original approach**: Requirements described internal components
- FR7: "Integration Agent pulls data dictionaries via provider APIs"
- FR9: "System Agent creates custom Handlebars helpers by generating JavaScript"
- FR11: "Support provider pattern with configurable endpoints"

**What was missing**: User-facing capabilities Angela cares about:
- "I can validate my schema against production without manual field lookup"
- "I can request new formatting capabilities and have them available immediately"
- "I can publish prompts to my production systems"

### Problem 3: BMAD Patterns Not Reflected

**Original approach**: Mentioned workflows/templates/checklists as discrete features
- FR13: "POEM shall provide workflow templates (YAML-based)..."

**What was missing**: These are **implementation patterns** that repeat across agents, not individual FRs. Each agent follows BMAD v4 pattern: agent definition (YAML + markdown) + workflows (YAML) + checklists (markdown).

---

## Key Insights From Conversation

### The Four Agents & Phased Capability Unlock

POEM has **4 agents with ~15-20 workflows total**. Not all workflows are available from day 1—some unlock as infrastructure is built:

#### Agent 1: Prompt Engineer (5-6 workflows)
**Can work with ZERO .poem-app/ infrastructure**
- Creates/edits prompts (`.hbs` files) in `/poem/prompts/`
- Creates/edits schemas in `/poem/schemas/`
- Uses Claude Code context window for refinement
- **Pre-infrastructure**: "Fake it till you make it" - LLM assists with text editing
- **Post-infrastructure**: Real Handlebars rendering via skills → Astro API

**Key workflows**:
- Create new prompt
- Refine existing prompt (most common, iterative)
- Test prompt with data
- Validate prompt structure

#### Agent 2: System Agent (4-5 workflows)
**Needs .poem-app/ Astro server**
- **Phase 1A**: Create Handlebars templates (unlocks templating for Agent 1)
- **Phase 1B**: Create Handlebars helpers (unlocks Advanced Template addons)
- **Phase 2**: Create provider implementations (unlocks Agent 3 workflows)
- Manage Astro infrastructure

**Key workflows**:
- Add Handlebars helper
- Create provider
- Manage infrastructure

#### Agent 3: Integration Agent (3-4 workflows)
**Depends on providers existing (created by Agent 2)**
- Pull data dictionary from provider
- Publish prompts to provider
- Sync schemas, test connections

**Key workflows**:
- Pull data dictionary
- Publish prompt
- Test connection

#### Agent 4: Mock/Test Data Agent (3-4 workflows)
**Two levels of capability**
- **Level 1 (Early)**: Fake mock data (LLM/faker.js, no external dependency) - can be created alongside Agent 1
- **Level 2 (Later)**: Realistic mock data (based on provider data) - requires Agent 2 (providers) + Agent 3 (communication)

**Key workflows**:
- Generate fake mock data
- Generate realistic mock data
- Pull sample data from provider
- Curate domain-specific libraries

---

## Critical Patterns

### The "Fake It Till You Make It" Pattern

**Critical distinction**: Agent 1 operates in two modes:

**Mode 1 (Pre-Infrastructure)**: Basic text rendering and prompt engineering
- Create `.hbs` files with placeholders like `{{participantName}}`
- LLM understands placeholders, helps write good prompts
- No actual Handlebars rendering—just smart text editing with LLM assistance
- **Example**: Agent helps Angela write "Analyze incident for {{participantName}} at {{location}}" without calling any APIs

**Mode 2 (Post-Infrastructure)**: Powerful Handlebars features unlock
- Custom helpers like `{{fullName firstName lastName}}`
- Skills call APIs for actual template rendering
- Real preview of rendered output
- **Example**: Agent calls Astro API to render template with actual Handlebars processing

**Key principle**: FRs describe what's possible, not when it becomes possible. The same FR ("Users can preview rendered prompts") is true on Day 1 (LLM simulation) and Day 30 (real API calls).

### Skills Are Framework Infrastructure (Group 3)

**Skills are filesystem-based capabilities** in `.poem-core/skills/` that Claude discovers and uses autonomously. They belong in Framework Infrastructure (Group 3), NOT Agent Workflows (Group 1).

**What skills do**: Automation/glue that bridges agents to infrastructure
- Some work pre-infrastructure (via LLM simulation)
- Some require APIs (Astro server must exist)
- **8 total skills**: Check My Prompt, Preview with Example Data, Generate Placeholder Schema, Find Fields in Data Dictionary, Validate Schema Against Dictionary, Suggest Mappings, Pull Data Dictionary, Publish Prompt

### Provider Pattern: Abstract Interface + Concrete Implementations

**The pattern**:
- **Abstract provider interface** (part of .poem-app/ foundation, built early)
- **Concrete implementations** (created by David/Angela via System Agent as needed)
  - SupportSignal/Convex provider (first implementation)
  - Storyline provider (second implementation)
  - Mock/demo provider (for testing the pattern)

**FRs focus on**: "System Agent can create provider implementations"
**NOT**: "POEM includes SupportSignal provider" (that's user-created content, not system requirement)

**Why this matters**: Integration Agent can't work until at least one concrete provider exists. This is a chicken-and-egg dependency that affects epic planning, but not FR wording.

---

## Final Requirements Structure

### Overview
- **25 Functional Requirements** (organized into 3 groups)
- **12 Non-Functional Requirements** (performance, privacy, experience)

### Grouping Strategy

**Groups are conceptual buckets, NOT epics/build phases**

#### Group 1: Agent-Guided Workflows (15 FRs)
Core value proposition - what makes POEM different from text editors
- 4 Prompt Engineer FRs
- 3 System Agent FRs
- 3 Integration Agent FRs
- 2 Mock/Test Data Agent FRs
- 3 Cross-agent user capabilities (schema extraction, validation, mock data generation)

#### Group 2: Framework & Runtime Infrastructure (7 FRs)
Foundation that enables agent capabilities
- Installation system
- Agent definitions and slash commands
- YAML workflow templates (~15-20 total)
- 8 skills
- Astro server
- Handlebars engine
- Provider pattern

#### Group 3: Cross-Cutting Capabilities (3 FRs)
System-wide concerns
- Multi-project support
- Offline-first operation
- File-based storage

**Epic structure will emerge later** based on dependencies and phased capability unlock. See separate workflow dependencies documentation.

---

## Key Decisions

### Decision 1: Agent-First Requirements
**Rationale**: Planning documents emphasize agent-guided workflows as primary differentiator. Original FRs treated agents as features; new FRs treat agents as the interface.

### Decision 2: Separate "Fake" vs "Realistic" Mock Data
**Rationale**: Level 1 mock data (fake, no dependencies) can ship with Agent 1. Level 2 (realistic, requires providers) comes later. Separate FRs (FR-MD-1, FR-MD-2) clarify this phasing without constraining epic planning.

### Decision 3: Provider Pattern Made Explicit
**Rationale**: Integration is a core capability. By making abstract provider interface + concrete implementations explicit in FRs, we ensure extensibility is architected from the start, not retrofitted later.

### Decision 4: Skills in Framework Infrastructure (Group 2)
**Rationale**: Skills are filesystem-based capabilities in `.poem-core/skills/`, not workflows. They belong in framework infrastructure alongside agents and workflow templates.

### Decision 5: ~15-20 Workflows, Not Just 5
**Rationale**: Original FR13 listed 5 workflows. Planning identified 4 agents with multiple workflows each. Approximate total (15-20) gives flexibility while setting expectations that workflows are substantial.

### Decision 6: "What's Possible" Not "When It's Possible"
**Rationale**: FRs should be timeless. "Users can preview rendered prompts" is true whether it's LLM-simulated (Day 1) or API-driven (Day 30). Epic/story planning handles phasing.

---

## Dependency Management

**Important Note**: Dependency progression is documented separately, not in FRs themselves.

**Rough progression**:
1. **Phase 1**: Agent 1 (Prompt Engineer) + Agent 4 Level 1 (fake mock data) - No .poem-app/ needed
2. **Phase 2**: .poem-app/ Astro foundation + Agent 2 (helper creation) - Unlocks enhanced templating
3. **Phase 3**: Agent 2 (provider creation) - Creates provider pattern infrastructure
4. **Phase 4**: Agent 3 (Integration) + concrete provider implementations - Enables publish/pull workflows
5. **Phase 5**: Agent 4 Level 2 (realistic mock data) - Uses provider data

**See**: Separate workflow dependencies document for detailed dependency graph and epic planning guidance.

---

## Trade-offs & Open Questions

### Trade-offs Made
- **Included all 4 agents in FRs** even though Agent 4 might be post-MVP - FRs describe full system
- **Grouped by agent, not by feature** - Emphasizes agent-first experience over feature checklist
- **Made provider pattern explicit** - Ensures extensibility is core, not afterthought
- **Listed approximate workflow count** (15-20) - Flexibility while setting expectations

### Areas That Might Need Refinement
- **FR-FI-3**: "Approximately 15-20 workflows" - Actual count will emerge during agent implementation
- **FR-UC-3**: "10+ scenarios" - Illustrative; actual test coverage will vary by use case
- **Provider implementations**: FRs describe pattern abstractly; concrete implementations are user/project-specific
- **Skills behavior**: Some work pre-infrastructure (LLM simulation), others require APIs - distinction is behavioral, not in FR wording

### What's Explicitly Out of MVP Scope
- Level 2 mock data (entity relationships, realistic anonymization) - FR-MD-2 describes capability but marked for post-MVP
- Multi-step pipeline orchestration (workflow chaining)
- Visual UI/dashboard (Astro pages beyond API endpoints)
- Version control integration (git workflows, diff views)
- Collaborative features (team sharing, permissions)
- Additional providers beyond initial implementations

---

## Next Steps

1. **Use `requirements-paste.md`** to paste Section 2 into PRD conversation
2. **BMAD will process** and create its own `/docs/requirements/` structure
3. **Create workflow dependencies document** showing phased capability unlock and dependency graph
4. **Architecture phase** will detail epic sequencing based on dependencies

---

**Last Updated**: 2025-11-23
**Status**: ✅ Complete - Analysis preserved for future reference
