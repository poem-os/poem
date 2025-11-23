# Project Brief: POEM

**Version**: 1.0
**Date**: 2025-11-22
**Status**: Draft

---

## Executive Summary

**POEM (Prompt Orchestration and Engineering Method)** is a Prompt Engineering Operating System that runs on Claude Code, enabling teams to systematically create, test, and deploy AI prompts using Handlebars templates with schemas and mock data generation. POEM solves the critical problem of slow, manual prompt development by providing autonomous agents, workflow templates, and instant mock data generation—allowing prompt engineers to iterate rapidly without production database access. The primary market is AI-powered application teams in high-compliance industries (legal, medical, healthcare, finance) and creative production studios who need systematic prompt engineering tools. POEM's killer feature is automatic mock data generation from schemas, enabling testing of hundreds of edge cases instantly while maintaining data privacy and independence from production systems.

---

## Problem Statement

**Current State**: Prompt engineering today is manual, slow, and requires constant access to production data. Engineers write prompts in isolation, copy-paste sample data from databases, manually test variations, and deploy without systematic validation. This creates several critical pain points:

**Pain Points**:
- **Slow iteration cycles**: Testing a prompt change requires pulling fresh production data, risking data privacy issues
- **Limited test coverage**: Manual data creation means testing only 2-3 scenarios instead of hundreds of edge cases
- **Production dependency**: Engineers need database access to test, creating security and compliance risks (especially in legal, medical, NDIS)
- **No systematic workflow**: Each engineer develops their own ad-hoc process, leading to inconsistent quality
- **Template fragmentation**: Prompts scattered across codebases, databases, and local files with no central management
- **Deployment risk**: No validation step between "it works on my machine" and production deployment

**Impact** (Quantified):
- **SupportSignal example**: Angela (prompt engineer) spends ~60% of time waiting for data exports and manually crafting test scenarios, when she could be iterating on prompt quality
- **vOz Studios example**: Vasilios needs 15-20 manual test runs to refine a storyline transformation prompt, each requiring 5-10 minutes of setup
- **Industry-wide**: Prompt engineering teams spend 40-60% of time on infrastructure (data access, setup, deployment) vs actual prompt refinement

**Why Existing Solutions Fall Short**:
- **Playground tools** (OpenAI Playground, Anthropic Console): No schema management, no mock data, no deployment pipeline
- **General IDEs**: No prompt-specific workflows, no template engines, no AI-aware validation
- **Custom internal tools**: Fragmented, one-off solutions that don't transfer between projects
- **BMAD**: Excellent for software development, but not specialized for prompt engineering workflows

**Urgency**: With AI adoption accelerating, prompt engineering is becoming a core discipline. Teams need professional tooling NOW—the gap between "copy-paste in Playground" and "production-grade prompt systems" is widening.

---

## Proposed Solution

**Core Concept**: POEM is a three-part operating system that lives in your project alongside your code:

1. **`.poem-core/`** - The OS kernel: AI agents, workflow templates, prompt engineering knowledge base
2. **`.poem-app/`** - The runtime: Astro server with Handlebars engine, provider APIs, visualization tools
3. **`/poem/`** - Your workspace: Prompts (`.hbs` templates), schemas (JSON), mappings, mock data

**How It Works**:
```
User: "I need a prompt to analyze NDIS incidents"
→ Prompt Engineer Agent activates
→ Guides creation using POEM principles
→ Generates schema from template placeholders
→ Auto-generates mock incident data
→ User tests 100+ scenarios instantly
→ Integration Agent publishes to SupportSignal/Convex
```

**Key Differentiators**:
- **Agent-Guided Workflows**: Not just tools—AI agents (Prompt Engineer, System Agent, Integration Agent) that understand prompt engineering best practices and guide you through proven workflows
- **Automatic Mock Data Generation** ⭐: The killer feature—schemas automatically generate realistic test data, eliminating production database dependency
- **Handlebars Power**: Full templating engine with helpers, partials, and on-demand custom helper creation (System Agent writes JavaScript helpers as needed)
- **Built for Claude Code**: Runs natively in your IDE where you're already working, not a separate web app to context-switch to
- **Provider Pattern**: Clean integration with any backend (SupportSignal/Convex today, OpenAI Functions tomorrow, custom APIs next week)
- **BMAD-Style Workflows**: Proven template-driven approach (YAML workflows) adapted from successful software development methodology

**Why This Succeeds Where Others Haven't**:
- **Playground tools** lack workflows and deployment → POEM has end-to-end lifecycle
- **Custom tools** are one-off solutions → POEM is reusable across projects
- **Generic IDEs** have no prompt expertise → POEM agents know prompt engineering
- **Manual processes** don't scale → POEM systematizes and accelerates

**High-Level Vision**: Prompt engineering becomes as systematic and professional as software engineering, with POEM as the standard toolkit.

---

## Target Users

### Primary User Segment: Prompt Engineers in High-Compliance Teams

**Profile**:
- **Role**: Prompt Engineer, AI Developer, or Technical Product Manager responsible for AI features
- **Industry**: High-compliance sectors (healthcare/NDIS, legal, finance, government) where data privacy and systematic validation are critical
- **Team Size**: Small to mid-size teams (2-10 engineers) building AI-powered applications
- **Technical Level**: Comfortable with CLIs, JSON, and template syntax; may or may not be software developers

**Current Behaviors**:
- Writes prompts in Anthropic Console or OpenAI Playground during development
- Copy-pastes prompts into application code (databases, config files, or hardcoded strings)
- Manually requests data exports from engineering team for testing
- Maintains spreadsheets or docs with test scenarios and expected outputs
- Iterates slowly due to friction in testing/deployment cycle

**Specific Needs**:
- **Data privacy**: Cannot use production data freely due to compliance (HIPAA, NDIS, GDPR)
- **Systematic testing**: Need to validate prompts against dozens of edge cases, not just happy path
- **Version control**: Track prompt changes over time and collaborate with team
- **Deployment confidence**: Know that tested prompts will work exactly the same in production
- **Independence**: Stop blocking on engineers for data exports or deployment

**Goals**:
- Reduce time-to-production for new prompts from weeks to days
- Increase test coverage from 2-3 scenarios to 50+ comprehensive cases
- Enable non-blocking iteration without engineering dependencies
- Maintain compliance while moving fast

**Example Persona**: **Angela** (SupportSignal Prompt Engineer)
- Builds AI features for NDIS incident reporting
- Can't access production databases due to privacy regulations
- Needs to test prompts for narrative enhancement, question generation, severity classification
- Currently waits hours/days for sanitized data exports
- POEM would let her generate mock NDIS incidents instantly and iterate freely

### Secondary User Segment: Creative Production Studios

**Profile**:
- **Role**: Creative Director, Producer, or Technical Artist working with AI tools
- **Industry**: Video production, advertising, content creation, game development
- **Team Size**: Small studios or individual creators with technical capabilities
- **Technical Level**: Varied—comfortable with creative tools, may need gentler learning curve

**Current Behaviors**:
- Uses AI for content transformation (text to storyboards, scripts to shot lists, narrative to visual concepts)
- Tests prompts manually with sample projects
- Builds one-off scripts or uses web UIs for prompt testing
- Struggles with complex multi-step pipelines (e.g., character extraction → style guide → beat breakdown)

**Specific Needs**:
- **Multi-step workflows**: Chain prompts together (output of one becomes input to next)
- **Rich output schemas**: Not just text—structured JSON with nested data (characters, visual concepts, timelines)
- **Repeatability**: Apply same prompt pipeline to multiple projects
- **Visual validation**: Preview outputs in human-readable formats (not just JSON dumps)

**Goals**:
- Systematize creative workflows that currently rely on manual prompt chaining
- Build reusable prompt pipelines for recurring project types
- Reduce time spent on repetitive AI-assisted tasks
- Maintain creative control while leveraging AI acceleration

**Example Persona**: **Vasilios** (vOz Studios Creative Director)
- Transforms narrative scripts into detailed visual production specs
- Manually runs 4-step prompt pipeline: characters → style → beats → visuals
- Each iteration requires copy-pasting between tools and checking for consistency
- POEM would automate the pipeline and let him focus on creative refinement

---

## Goals & Success Metrics

### Business Objectives

- **Market validation by Q2 2026**: Achieve 10+ active teams using POEM in production (SupportSignal and vOz Studios count as first 2)
- **Reduce prompt iteration time by 60%**: Users report 3-5x faster development cycles vs manual methods (measured via user surveys and time-tracking)
- **Establish category leadership**: Position POEM as the de facto standard for systematic prompt engineering (measured by community adoption, GitHub stars, conference mentions)
- **Enable productization**: Create foundation for potential SaaS offering or premium features (validated by willingness-to-pay surveys)

### User Success Metrics

- **Time to first prompt deployed**: Users successfully create, test, and deploy their first prompt within 2 hours of installation
- **Test coverage increase**: Users test prompts with 10+ scenarios on average (vs 2-3 scenarios in manual workflows)
- **Mock data adoption**: 80%+ of prompts tested using generated mock data rather than production exports
- **Workflow completion rate**: Users complete full workflow (create → test → refine → deploy) without abandoning mid-process
- **Return usage**: Users return to POEM for subsequent prompts (not just one-time trial), indicating sticky value

### Key Performance Indicators (KPIs)

- **Active Projects**: Number of projects with `.poem-core/` installed and actively used (target: 50+ by end of year 1)
- **Prompts Deployed**: Total prompts published to production via POEM Integration Agent (target: 200+ in year 1)
- **Mock Data Generation Volume**: Number of mock data instances generated (proxy for testing activity, target: 10,000+ per month at scale)
- **Agent Activation Rate**: Percentage of sessions where users invoke POEM agents vs using manual file editing (target: 70%+ agent-guided)
- **Community Engagement**: GitHub issues, discussions, PRs, and community-contributed helpers/workflows (target: Active community by month 6)
- **NPS (Net Promoter Score)**: User satisfaction and likelihood to recommend (target: 40+ by end of year 1, indicating strong product-market fit)

---

## MVP Scope

### Core Features (Must Have)

- **`.poem-core/` Installation System**: Install POEM framework via `npx poem-os install` with agents, workflows, and knowledge base
  - **Rationale**: Foundation of everything—users need frictionless setup to start using POEM

- **Prompt Engineer Agent**: AI agent that guides prompt creation, refinement, and validation using POEM best practices
  - **Rationale**: Core value—systematic workflow is what differentiates POEM from text editors

- **Schema Generation from Templates**: Auto-extract placeholder schemas from Handlebars templates (e.g., `{{participantName}}` → `{participantName: string}`)
  - **Rationale**: Reduces manual work and ensures schema-template alignment

- **Mock Data Generation (Level 1)**: Generate realistic mock data from JSON schemas using faker.js or similar
  - **Rationale**: The killer feature—enables testing without production data

- **Handlebars Template Engine**: Full Handlebars support via `.poem-app/` Astro server with basic helpers (titleCase, dateFormat, etc.)
  - **Rationale**: More powerful than simple `{{placeholder}}` replacement; enables real-world use cases

- **Prompt Preview/Testing**: Render templates with mock or example data, show output in readable format
  - **Rationale**: Core workflow step—users must see results before deploying

- **SupportSignal/Convex Integration (Provider #1)**: Pull data dictionary, publish prompts, sync schemas via Integration Agent
  - **Rationale**: First real customer validation; proves provider pattern works

- **Basic CLI Skills (3-4 core)**: Check My Prompt, Generate Schema, Preview with Data, Publish Prompt
  - **Rationale**: Enable autonomous work without constant agent invocation

### Out of Scope for MVP

- Level 2 mock data (entity relationships, realistic anonymization, curated libraries)
- Multi-step pipeline orchestration (workflow chaining)
- Visual UI/dashboard (Astro pages beyond API endpoints)
- Version control integration (git workflows, diff views)
- Collaborative features (team sharing, permissions)
- Performance optimization (caching, parallel execution)
- Additional providers beyond SupportSignal
- Custom mapping system (YAGNI until proven needed)
- Backup/restore workflows
- Advanced Handlebars helpers beyond basics

### MVP Success Criteria

**MVP is successful if**:
1. Angela (SupportSignal) can create, test with mock NDIS data, and deploy a prompt to production in under 2 hours
2. Mock data generation works for 80%+ of schema types without manual intervention
3. Integration Agent successfully publishes to SupportSignal/Convex without errors
4. Users report "this is faster than my current workflow" after first use
5. No critical bugs preventing completion of create → test → deploy cycle

---

## Post-MVP Vision

### Phase 2 Features

**Near-term priorities** (3-6 months post-MVP):

- **System Agent**: Generate custom Handlebars helpers on-demand (write JavaScript code as users request new formatting/transformation functions)
- **vOz/Storyline Provider**: Second provider integration for creative production workflows, validating multi-provider pattern
- **Multi-step Pipeline Support**: Chain prompts together where output of one becomes input to next (critical for Vasilios's creative workflows)
- **Level 2 Mock Data**: Entity relationships, realistic anonymization, curated domain-specific libraries (e.g., realistic NDIS incident scenarios)
- **Additional Skills**: Complete the 8-skill set (Find Fields in Dictionary, Validate Schema, Suggest Mappings)
- **Basic Astro UI**: Simple web dashboard for visualizing schemas, browsing templates, viewing mock data

### Long-term Vision

**1-2 year horizon**:

**Become the Standard for Prompt Engineering**:
- POEM installed in hundreds of AI-powered application projects
- Active community contributing helpers, workflows, and provider integrations
- Conference talks, tutorials, and course content teaching POEM methodology
- "POEM-compatible" becomes a feature in prompt engineering job postings

**Platform Ecosystem**:
- **Provider Marketplace**: Pre-built integrations for common platforms (OpenAI Functions, LangChain, Pinecone, etc.)
- **Helper Registry**: Community-contributed Handlebars helpers for domain-specific needs
- **Workflow Library**: Reusable workflow templates for common use cases (Q&A generation, content transformation, classification)
- **Schema Repository**: Shared schemas for common domains (healthcare, legal, e-commerce)

**Advanced Capabilities**:
- **Prompt Versioning & Diffing**: Track changes over time, compare versions, roll back
- **A/B Testing Framework**: Deploy multiple prompt variations, measure performance
- **Analytics Dashboard**: Track prompt usage, performance metrics, cost optimization
- **Team Collaboration**: Multi-user projects, permissions, shared workspaces
- **CI/CD Integration**: Automated testing and deployment pipelines for prompts

### Expansion Opportunities

**Potential future directions** (speculative):

- **POEM Cloud**: Hosted version for teams who don't want local setup
- **Enterprise Features**: SSO, audit logs, compliance reporting for large organizations
- **Multi-LLM Support**: Test same prompt across Anthropic, OpenAI, Gemini, etc.
- **Prompt Optimization AI**: Agent that automatically refines prompts for clarity, token efficiency, accuracy
- **Training/Certification**: POEM Academy for systematic prompt engineering education
- **Integration with BMAD**: Agents that collaborate across software development and prompt engineering

---

## Technical Considerations

### System Classification

POEM is a **Framework/Operating System** (like BMAD), not a traditional web application:
- **95% of system**: Document-based (agents, workflows, templates, skills, schemas)
- **5% of system**: Runtime tool (`.poem-app/` Astro server)

### Platform Requirements

- **Target Platform**: Claude Code (primary); future: Cursor, Windsurf, other AI IDEs
- **OS Support**: Cross-platform (macOS, Linux, Windows) via Node.js
- **Installation Model**: NPX-based like BMAD (not SaaS, not cloud-hosted)

### Architecture: Three-Part System

**1. `.poem-core/` - The Framework Kernel**
- **Content**: Agents (AI personas), workflows, templates, knowledge base
- **Format**: YAML configs, markdown prompts, JSON schemas
- **Installation**: Copied to user's project via `npx poem-os install`
- **Update-Safe**: Lives in user's project, updates don't overwrite customizations

**2. `.poem-app/` - The Runtime Tool**
- **Technology**: Astro 4.x server with TypeScript
- **Purpose**: Local web service (internal tool, NOT public-facing)
- **Features**:
  - Handlebars template engine (compilation, helpers, rendering)
  - Web UI for visualization (HTML/Tailwind CSS)
  - API endpoints for agent/skill interactions
- **Deployment**: Persistent server on configurable port (details in future stories)
- **Multi-Project Support**: Each POEM installation = separate Astro instance

**3. `/poem/` - User Workspace**
- **Content**: User-created prompts (`.hbs`), schemas (JSON), mappings, mock data
- **Managed By**: User via agents and skills
- **Version Control**: User's responsibility (part of their project)

### Installation & Deployment Model

**Development Structure** (monorepo):
```
poem-os/poem/
├── packages/
│   ├── poem-core/    → Becomes .poem-core/ when installed
│   └── poem-app/     → Becomes .poem-app/ when installed
└── package.json      → Published as 'poem-os' on NPM
```

**User Installation** (following BMAD pattern):
```bash
npx poem-os install           # Full installation
npx poem-os install --core    # Framework only
npx poem-os install --app     # Runtime only
```

**Result in User's Project**:
```
my-project/
├── .poem-core/     (copied from packages/poem-core/)
├── .poem-app/      (copied from packages/poem-app/)
└── poem/           (created empty, user populates)
```

### Technology Stack

**Framework Layer** (Document-Based):
- **Agents**: Markdown prompts + YAML configuration
- **Workflows**: YAML-driven step-by-step processes
- **Templates**: Handlebars (`.hbs` files)
- **Schemas**: JSON Schema format
- **Skills**: Markdown instructions for autonomous Claude actions

**Runtime Layer** (`.poem-app/` only):
- **Server**: Astro 4.x (Node.js/TypeScript)
- **Templating**: Handlebars.js with custom helpers (System Agent can generate helpers on-demand)
- **Styling**: Tailwind CSS for web UI
- **Mock Data**: Faker.js or @faker-js/faker
- **Storage**: File-based (no database - Astro collections, YAML configs)

### Integration Patterns

**Provider System** (Abstract Interfaces):
- **Pattern**: Each external system needs a custom provider
- **Location**: `.poem-app/src/providers/{name}/`
- **Examples**:
  - SupportSignal provider (connects to Convex backend)
  - Storyline provider (connects to Storyline app)
- **Important**: Providers are user-created, NOT built into POEM
- **MVP Scope**: Provider creation workflow only - no implementations

**Claude Code Integration**:
- **Agent Activation**: Slash commands (future feature, not MVP)
- **Skills**: Autonomous Claude capabilities
- **HTTP Calls**: Skills call `.poem-app/` API endpoints (not MCP)

### Astro Server Details

**Boot Sequence**:
- Server startup: < 3 seconds
- Handlebars compilation: Load helpers, compile templates, register partials
- Configuration: Read port from config, validate environment

**API Endpoints**:
- `/api/prompt/render` - Render Handlebars template with data
- `/api/schema/generate` - Extract schema from template
- `/api/mock/generate` - Generate mock data from schema
- `/api/provider/{name}/*` - Provider-specific endpoints

**Performance Targets**:
- Server response: < 1 second for template rendering
- Handlebars boot cycle: Optimized for reasonable startup time
- Mock data generation: Performance details TBD in implementation stories

### POEM Development Pattern

**Key Distinction**: Most POEM development involves writing documents (prompts/workflows/schemas), NOT traditional software code.

| Component | Primary Activity | Format |
|-----------|------------------|--------|
| Agents | Document authoring | YAML + Markdown |
| Workflows | Process definition | YAML templates |
| Skills | Instruction writing | Markdown |
| Templates | Template authoring | Handlebars |
| Schemas | Schema definition | JSON Schema |
| `.poem-app/` | Software development | TypeScript/Astro |

**Implication for Implementation**:
- Most Epics/Stories = creating documents via POEM's own agents/workflows
- Only `.poem-app/` infrastructure requires traditional coding

### What's Out of Scope

- ❌ Specific provider implementations (SupportSignal, vOz, etc.)
- ❌ Database systems (SQLite, PostgreSQL, etc.)
- ❌ Cloud hosting infrastructure
- ❌ Deployment pipelines beyond local install
- ❌ Authentication/authorization systems
- ❌ Team collaboration features
- ❌ Deep version control integration (beyond basic file structure)

### Security & Compliance

- **Data Privacy**: No production data stored (mock data only)
- **API Keys**: Stored in `.env` files (gitignored)
- **Provider Authentication**: Delegated to provider implementations
- **Audit Trail**: File-based change tracking (via git)

---

## Constraints & Assumptions

### Constraints

- **Budget**: Self-funded development (no external funding); cost-conscious technology choices (open source, free tiers, local-first)

- **Timeline**: MVP target: 3-4 months from start of development; iterative releases preferred over big-bang launch

- **Resources**:
  - Solo developer (David) with part-time availability
  - Angela (SupportSignal) available for user testing and feedback
  - Vasilios (vOz) available for creative workflow validation post-MVP

- **Technical**:
  - Must work offline (no cloud dependencies for core functionality)
  - Must be cross-platform (macOS, Linux, Windows)
  - Claude Code is primary platform (future IDE compatibility is aspirational)
  - No database for MVP (file-based only)

### Key Assumptions

- **User adoption assumptions**:
  - Prompt engineers want systematic workflows (not just freeform tools)
  - Target users are comfortable with CLIs, JSON, and template syntax
  - Mock data generation provides sufficient value to drive adoption

- **Technical assumptions**:
  - Astro server running persistently is acceptable to users
  - File-based storage scales to MVP use cases (100s of prompts, not 1000s)
  - Handlebars is powerful enough for 80%+ of templating needs
  - Claude Code slash commands + skills provide adequate integration

- **Market assumptions**:
  - Prompt engineering is professionalizing (becoming a distinct role)
  - High-compliance industries will pay for systematic tooling
  - BMAD-style framework approach appeals to technical users
  - Provider pattern enables future ecosystem growth

- **Business assumptions**:
  - Open source model builds community faster than proprietary
  - Early adopters (SupportSignal, vOz) validate broader market need
  - NPM package distribution is sufficient (no app stores needed)
  - Future monetization paths exist (SaaS, premium features, consulting)

---

## Risks & Open Questions

### Key Risks

- **Technical Risk - "Handlebars boot cycle too slow"**: Loading 20-30 helpers might make Astro server startup unacceptably slow (> 5 seconds)
  - **Mitigation**: Lazy-load helpers, optimize boot sequence, benchmark early in development

- **Adoption Risk - "Too complex for target users"**: Agents, workflows, schemas, templates—might overwhelm users expecting simple "prompt playground"
  - **Mitigation**: Excellent onboarding, progressive disclosure, start with simplest workflows first

- **Provider Pattern Risk - "Doesn't generalize"**: SupportSignal/Convex pattern may not work for other systems; each integration might be completely custom
  - **Mitigation**: Second provider (vOz/Storyline) validates pattern early; mock/demo provider in MVP shows flexibility

- **Solo Developer Risk - "Can't ship fast enough"**: Part-time solo development might miss optimal delivery window
  - **Mitigation**: Ruthless scope discipline, BMAD for velocity, leverage AI coding assistants heavily

### Open Questions

- **Schema format strategy**: JSON Schema for MVP with potential hybrid approach:
  - **DSL (JSON-based)**: Human-readable, easy to edit, version control friendly
  - **TypeScript/Zod generation**: Skills auto-generate TypeScript schemas for type safety and validation
  - **Trade-off**: Readability (JSON) vs machine capability (TypeScript) → hybrid may provide both

- **Why Handlebars over simple placeholders**:
  - **Decision**: Use full Handlebars (confirmed)
  - **Rationale**: Built-in capabilities (uppercase, dashcase, conditionals) are deterministic; LLMs are not
  - **Value**: Offload formatting logic from prompts, making them cleaner and more reliable

- **Fourth agent (Data/Testing Agent)**:
  - **Decision**: Post-MVP, decide during implementation
  - **Approach**: Watch for pain points in mock data/testing workflows; add agent if complexity justifies it

- **Slash commands timing**:
  - **Decision**: Create ad-hoc alongside agents/commands
  - **Approach**: Develop pattern/instructions document early so slash command creation becomes automatic workflow

- **Provider implementations in MVP**:
  - **MVP scope**: Mock/demo provider (e.g., writes to Astro pages for visualization)
  - **Post-MVP**: SupportSignal and Storyline providers (early post-MVP priority)
  - **Demo idea**: Mock provider that creates documentation pages in `.poem-app/` to showcase integration pattern

- **Visual UI scope**:
  - **MVP**: Basic visualization pages (likely minimal)
  - **Post-MVP**: Richer dashboards and interaction as patterns emerge

- **Mock data approach**:
  - **Decision**: Faker.js for MVP (confirmed sufficient)
  - **Level 2**: Domain-specific libraries deferred to post-MVP

- **Pricing model**:
  - **Decision**: Not relevant to project success
  - **Context**: POEM supports AppyDave education ecosystem and Skool community
  - **Revenue model**: Skool membership, consulting, partnerships (not product pricing)

### Areas Needing Further Research

**Research to be conducted closer to implementation** (not upfront):

- **Data dictionary standards**: Research common formats during provider story implementation
- **Handlebars ecosystem**: Identify most-needed helpers during helper creation stories
- **Provider integration patterns**: Study during provider architecture stories
- **Mock data libraries**: Explore domain-specific options if/when Level 2 becomes priority

**Research to validate during story execution**:
- Include research tasks in relevant stories (e.g., "Research data dictionary formats" as story subtask)
- Use validation checkpoints to gather info just-in-time vs big upfront research phase

**Not prioritized for research**:
- Competitive landscape deep-dive (awareness of PromptLayer noted, but not blocking)
- Claude Code extensibility limits (discover through usage)
- User workflow shadowing (Angela/Vasilios available for ad-hoc feedback)

### Project Context & Philosophy

**This is a learning and education project**:
- Primary goal: David's learning and knowledge sharing
- Secondary goal: Community building via Skool platform
- Market validation: Nice-to-have, not critical success metric
- Open source: Enables community contribution and educational value

**Success metrics redefined**:
- Learning outcomes and educational content created
- Community engagement and knowledge sharing
- Real-world usage by SupportSignal/vOz (validation, not revenue)
- Foundation for AppyDave education ecosystem

---

## Appendices

### A. Research Summary

**Planning Phase Exploration** (2025-11-18 to 2025-11-20):

The POEM project underwent comprehensive planning documented in `docs/planning/`:

- **System type discovery**: Evolved from "web app" thinking to "OS/framework" model (see `exploration/application-type-README.md`)
- **Naming journey**: Explored 20+ alternatives before settling on POEM (see `exploration/naming.md`)
- **Agent architecture**: Defined 3-4 agents with function-based naming (see `system-explorations/agents.md`)
- **Skills identification**: 8 core skills for autonomous Claude capabilities (see `system-explorations/skills.md`)
- **Mock data breakthrough**: Identified as killer feature during SupportSignal use case analysis
- **Two example domains**: SupportSignal (NDIS/compliance) and Storyline (creative production) validate different workflow patterns

**Key Planning Documents**:
- `docs/planning/POEM.md` - Complete requirements and vision ⭐
- `docs/planning/system-explorations/` - Agent, skill, workflow, architecture planning
- `docs/planning/reference/examples.md` - Complete domain examples with real data
- `docs/planning/reference/bmad-reference.md` - BMAD v4 methodology patterns

**Second Brain References**:
- Claude Skills documentation: `/Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/`
- BMAD Method v4 patterns: `/Users/davidcruwys/dev/ad/brains/bmad-method/`
- Example implementations: `/Users/davidcruwys/dev/js_3rd/anthropic-skills/`

### B. Stakeholder Input

**Angela (SupportSignal Prompt Engineer)**:
- Primary pain point: Waiting for data exports to test prompts (hours/days delay)
- Compliance constraint: Cannot access production database due to NDIS regulations
- Testing bottleneck: Manually creates 2-3 test scenarios when she needs 50+
- Validation: Mock data generation solves her #1 problem

**Vasilios (vOz Studios Creative Director)**:
- Use case: 4-step pipeline (characters → style → beats → visuals) for video production
- Current workflow: Manual copy-paste between tools, 15-20 iterations to refine
- Need: Multi-step orchestration (post-MVP requirement)
- Validation: Template-based approach appeals for repeatability across projects

**David (Project Lead)**:
- Learning goal: Deep dive into prompt engineering as systematic discipline
- Education goal: Create content and community around POEM methodology
- Strategic goal: Foundation for AppyDave Skool community and education platform
- Technical goal: Apply BMAD methodology to build POEM (dogfooding framework development)

### C. References

**BMAD Method**:
- Official site: https://bmadmethod.com
- Discord: https://discord.gg/gk8jAdXWmj
- GitHub: https://github.com/bmadcode/bmad-method
- YouTube: https://www.youtube.com/@BMadCode

**Technology Documentation**:
- Astro: https://docs.astro.build
- Handlebars: https://handlebarsjs.com
- Faker.js: https://fakerjs.dev
- JSON Schema: https://json-schema.org
- Convex: https://www.convex.dev (SupportSignal backend)

**Related POEM Documentation**:
- Planning folder: `docs/planning/` (preserved as-is, shows thinking evolution)
- Example data: `data/supportsignal/`, `data/storyline/`
- BMAD configuration: `.bmad-core/`

---

## Next Steps

### Immediate Actions

1. **Review and approve this Project Brief** with David ✅ DONE
2. **Initialize BMAD PRD workflow**: Activate Product Manager agent to create PRD from this brief
3. **Follow BMAD v4 development process**: PRD → Architecture → Stories → Implementation

### PM Handoff

This Project Brief provides the full context for **POEM (Prompt Orchestration and Engineering Method)**. Please start in **PRD Generation Mode**:

- Review the brief thoroughly, focusing on:
  - System classification (Framework/OS, not web app)
  - Three-part architecture (.poem-core/, .poem-app/, /poem/)
  - MVP scope (SupportSignal-focused, mock data as killer feature)
  - Document-based development pattern (95% YAML/Markdown, 5% TypeScript)

- Work with David to create the PRD section by section using BMAD v4 templates
- Ask for clarification on technical decisions (schema format, provider pattern, etc.)
- Suggest improvements based on BMAD best practices
- Ensure PRD captures both framework development AND Astro runtime implementation

**Critical for PM**: POEM is being built WITH BMAD v4, so PRD should leverage sharding, epic structure, and template-driven workflows from the start.

**Note**: Repository structure (monorepo setup, packages, etc.) will be created during BMAD development stories, not as immediate action.

---

**Project Brief Complete** ✅
**Date**: 2025-11-22
**Ready for**: Product Manager Agent (PRD Creation)
**Planning Documentation**: Preserved in `docs/planning/` as historical record
