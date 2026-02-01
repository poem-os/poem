# POEM Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Reduce prompt iteration time by 60% for prompt engineers through systematic workflows and instant mock data generation
- Enable prompt engineers to test prompts with 10+ scenarios on average (vs 2-3 manual scenarios) without production database access
- Establish POEM as a reusable framework that runs on Claude Code, providing agent-guided workflows for creating, testing, and deploying AI prompts
- Validate the provider pattern with SupportSignal/Convex integration, demonstrating extensibility to other platforms
- Achieve first prompt deployed within 2 hours of installation for target users (prompt engineers in high-compliance teams)
- Create foundation for AppyDave's education ecosystem and Skool community around systematic prompt engineering

### Background Context

Prompt engineering today is manual, slow, and production-dependent. Engineers write prompts in isolation, manually craft test scenarios by copy-pasting from databases, and deploy without systematic validation. This creates critical bottlenecks: slow iteration cycles (waiting hours/days for data exports), limited test coverage (2-3 scenarios vs hundreds needed), production database dependency (security/compliance risks in healthcare, legal, NDIS sectors), and no systematic workflow leading to inconsistent quality across teams.

POEM (Prompt Orchestration and Engineering Method) solves this by providing a Prompt Engineering Operating System that runs on Claude Code. The system consists of three parts: `.poem-core/` (agents, workflows, knowledge base), `.poem-app/` (Astro server with Handlebars engine and provider APIs), and `/poem/` (user workspace for prompts, schemas, mappings). The killer feature is automatic mock data generation from JSON schemas—enabling testing of hundreds of edge cases instantly while maintaining data privacy and eliminating production system dependencies. POEM applies BMAD-style template-driven workflows to prompt engineering, making it as systematic and professional as software development.

### Change Log

| Date       | Version | Description                                                | Author          |
| ---------- | ------- | ---------------------------------------------------------- | --------------- |
| 2025-11-22 | 0.1     | Initial PRD draft from Project Brief                       | John (PM Agent) |
| 2025-12-08 | 1.0     | Complete PRD with 7 Epics, 40 Stories, PM Checklist passed | John (PM Agent) |

## Requirements

### Functional Requirements

#### Group 1: Agent-Guided Workflows (15 FRs)

**FR-PE-1**: Users shall be able to create new prompts by activating the Prompt Engineer Agent via slash command, which guides them through a systematic workflow that consults POEM principles, creates prompt (.hbs) and schema (JSON) files in /poem/ workspace, and provides preview of rendered output with example data

**FR-PE-2**: Users shall be able to refine existing prompts iteratively through Prompt Engineer Agent workflows that enable rapid test-update cycles, including loading existing prompts, testing with mock or example data, identifying issues, and updating prompt/schema files without leaving their IDE

**FR-PE-3**: Users shall be able to test prompts with data through workflows that render Handlebars templates and display output in the conversation stream for validation and debugging

**FR-PE-4**: Users shall be able to validate prompt structure through workflows that check template syntax, placeholder consistency with schemas, and adherence to POEM best practices

**FR-SA-1**: System Agent shall be able to create custom Handlebars helpers on-demand by generating JavaScript code files in .poem-app/src/services/handlebars/helpers/ when users request new formatting or transformation capabilities

**FR-SA-2**: System Agent shall be able to create provider implementations by generating API endpoint code in .poem-app/src/pages/api/providers/{name}/ following the provider interface pattern for external system integration

**FR-SA-3**: System Agent shall be able to manage Astro infrastructure including server start/stop, configuration, and troubleshooting

**FR-IA-1**: Integration Agent shall be able to pull data dictionaries from external systems via provider implementations, storing field definitions and types for schema validation

**FR-IA-2**: Integration Agent shall be able to publish prompts (template .hbs files and schemas) to external systems via provider implementations for production deployment

**FR-IA-3**: Integration Agent shall be able to test provider connections and validate integration health

**FR-MD-1**: Mock/Test Data Agent shall be able to generate fake mock data using faker.js or LLM-generated content based on JSON schemas, enabling testing without external dependencies

**FR-MD-2**: Mock/Test Data Agent shall be able to generate realistic mock data based on provider data dictionaries and real data patterns, including entity relationships and domain-specific scenarios

**FR-UC-1**: POEM shall automatically extract JSON schemas from Handlebars template placeholders (e.g., {{participantName}} → {participantName: string}) to reduce manual work and ensure schema-template alignment

**FR-UC-2**: POEM shall validate template syntax and placeholder consistency with schemas before deployment, preventing errors and ensuring quality

**FR-UC-3**: POEM shall generate realistic mock data from JSON schemas, enabling users to test prompts with 10+ scenarios (vs 2-3 manual scenarios) without production database access

#### Group 2: Framework and Runtime Infrastructure (7 FRs)

**FR-FI-1**: POEM shall provide an NPX-based installation system (npx poem-os install) that copies .poem-core/ and .poem-app/ directories into the user's project and creates /poem/ workspace structure

**FR-FI-2**: POEM shall include four agents (Prompt Engineer, System Agent, Integration Agent, Mock/Test Data Agent) accessible via Claude Code slash commands, each with defined capabilities and workflows

**FR-FI-3**: POEM shall provide YAML-based workflow templates for approximately 15-20 common tasks across all agents (e.g., New Prompt, Refine Prompt, Deploy Prompt, Test Prompt, Add Helper, Create Provider)

**FR-FI-4**: POEM shall include 8 skills that provide autonomous capabilities: Check My Prompt, Preview with Example Data, Generate Placeholder Schema, Find Fields in Data Dictionary, Validate Schema Against Dictionary, Suggest Mappings, Pull Data Dictionary, Publish Prompt

**FR-RI-1**: POEM shall run a persistent Astro server on configurable port for template rendering API endpoints and provider integration

**FR-RI-2**: POEM shall provide a Handlebars template engine via .poem-app/ Astro server with helper registration, template compilation, and rendering capabilities

**FR-RI-3**: POEM shall support a provider pattern with abstract interfaces and configurable API endpoints in .poem-app/src/pages/api/providers/{name}/ to enable extensible external system integration

#### Group 3: Cross-Cutting Capabilities (3 FRs)

**FR-CC-1**: POEM shall support multi-project usage where each project has its own .poem-core/, .poem-app/, and /poem/ workspace as independent instances

**FR-CC-2**: POEM shall work offline for core functionality (prompt creation, schema generation, mock data generation, template rendering, preview) without cloud dependencies

**FR-CC-3**: POEM shall maintain user workspace structure in /poem/ directory containing prompts (.hbs), schemas (JSON), and mappings using file-based storage with no database dependency

### Non-Functional Requirements

**NFR1**: Installation must complete in under 3 minutes on standard development machines

**NFR2**: Astro server startup time must be under 3 seconds to maintain responsive developer experience

**NFR3**: Template rendering API endpoints must respond in under 1 second for typical prompts (< 5KB templates)

**NFR4**: POEM must work offline for core functionality (mock data generation, template rendering, preview) without cloud dependencies

**NFR5**: POEM must be cross-platform compatible (macOS, Linux, Windows) via Node.js runtime

**NFR6**: Mock data generation must produce realistic test data for 80%+ of schema types without manual intervention

**NFR7**: File-based storage must scale to handle 100s of prompts without performance degradation

**NFR8**: System must maintain data privacy—no production data stored in POEM workspace, only mock/example data

**NFR9**: Documentation and agent prompts must enable users to deploy their first prompt within 2 hours of installation

**NFR10**: System architecture must support future provider integrations beyond initial implementations without core framework changes

**NFR11**: Generated mock data must include realistic variations (edge cases, long text, special characters) for comprehensive testing

**NFR12**: POEM must follow BMAD v4 patterns for consistency with established methodology (YAML workflows, template-driven, agent-based architecture)

## Technical Assumptions

### Repository Structure: Monorepo

POEM uses a monorepo structure for development:

```
poem-os/poem/
├── packages/
│   ├── poem-core/    → Becomes .poem-core/ when installed
│   └── poem-app/     → Becomes .poem-app/ when installed
└── package.json      → Published as 'poem-os' on NPM
```

**Rationale**: Single repository simplifies versioning, testing, and release coordination between framework (poem-core) and runtime (poem-app). NPM package name `poem-os` is available and aligns with "Operating System" positioning.

### Service Architecture: Hybrid (Document Framework + Local Runtime)

POEM is a **Framework/Operating System** (like BMAD), not a traditional web application:

- **95% Document-Based**: Agents (YAML + Markdown), workflows (YAML), templates (Handlebars), schemas (JSON), skills (Markdown)
- **5% Runtime Tool**: `.poem-app/` Astro server providing Handlebars engine, API endpoints, and provider integrations

**Rationale**: This mirrors BMAD's proven architecture. Most development involves creating documents (prompts, workflows, schemas), not traditional software code. The Astro runtime exists solely to provide heavy lifting that can't be done in conversation (template compilation, helper execution, API calls).

### Testing Requirements: Unit + Integration

- **Unit Tests**: Core functions (schema extraction, template validation, mock data generation)
- **Integration Tests**: API endpoints, provider pattern, Handlebars engine
- **Manual Testing**: Agent workflows, skill execution (via Claude Code conversation)
- **No E2E Tests**: POEM is a framework, not a deployed web app

**Rationale**: Testing focuses on the runtime components (`.poem-app/`) since document-based components (agents, workflows) are validated through usage. Manual testing via Claude Code conversation is appropriate for agent interactions.

### Additional Technical Assumptions and Requests

**Technology Stack**:

- **Server**: Astro (latest version) with Node.js/TypeScript for `.poem-app/`
- **Templating**: Handlebars.js with custom helpers (eager loading on server start, with hot-reload support for dynamically generated helpers)
- **Mock Data**: Faker.js (@faker-js/faker)
- **Styling**: Tailwind CSS (minimal, for any future visualization)
- **Storage**: File-based only (no database for MVP)
- **Package Distribution**: NPM via `npx poem-os install`

**Platform Requirements**:

- **Primary Platform**: Claude Code (slash commands, skills)
- **OS Support**: Cross-platform (macOS, Linux, Windows) via Node.js
- **Offline Support**: Core functionality works without cloud dependencies

**Integration Patterns**:

- **Provider Pattern**: Abstract contract interface for external system integration (concrete implementations created by System Agent per provider)
- **API Endpoints**: REST-style endpoints in `.poem-app/src/pages/api/`
- **Skill Communication**: Skills call Astro APIs via HTTP (not MCP)

**Schema Format**:

- **Initial Approach**: Simple JSON documents describing field names, types, and constraints
- **Evolution Path**: May adopt formal JSON Schema spec or validation libraries as needs emerge
- **Rationale**: Start simple, add complexity only when required by actual use cases

**File Structure Conventions**:

- Prompts: `/poem/prompts/*.hbs`
- Schemas: `/poem/schemas/*.json`
- Mappings: `/poem/mappings/*.json` (if needed)
- Custom Helpers: `.poem-app/src/services/handlebars/helpers/*.js`
- Provider Implementations: `.poem-app/src/pages/api/providers/{name}/`

**What's Explicitly Excluded**:

- Database systems (SQLite, PostgreSQL, etc.)
- Cloud hosting infrastructure
- Authentication/authorization systems
- Team collaboration features
- CI/CD pipelines (beyond local development)

## Epic List

### Epic 0: Maintenance & Continuous Improvement

**Status**: 🔄 Perpetual (Never Completes)

Ongoing maintenance, bug fixes, technical debt, developer experience improvements, performance optimizations, security patches, infrastructure updates, and documentation refinements that emerge during and after feature development.

**Purpose**: Epic 0 provides a structured home for all non-feature work that keeps POEM healthy, performant, and maintainable. Unlike feature epics (1-7) which have defined completion criteria, Epic 0 is perpetual—it absorbs maintenance work throughout the project lifecycle and continues indefinitely as long as POEM is actively maintained.

**Categories**:
- **Technical Debt**: Refactoring, code quality improvements, architectural cleanup
- **Bug Fix**: Production bugs, edge cases, error handling improvements
- **Developer Experience**: Build tooling, testing infrastructure, local development workflow
- **Performance**: Optimization of template rendering, server startup, API response times
- **Security**: Vulnerability patches, dependency updates, security audits
- **Infrastructure**: CI/CD improvements, deployment automation, monitoring
- **Documentation**: README updates, inline comments, troubleshooting guides

**Sprint Allocation**: 10-20% of each sprint reserved for Epic 0 work (e.g., 1-2 stories per 2-week sprint alongside 5-8 feature stories)

**Priority System**:
- **P0 (Critical)**: Production blockers, security vulnerabilities, data loss risks—must be addressed immediately
- **P1 (High)**: Significant bugs affecting core workflows, major performance issues, critical technical debt—should be addressed within 1-2 sprints
- **P2 (Medium)**: Minor bugs, small optimizations, low-impact technical debt—can be scheduled opportunistically

**Key Principles**:
- Epic 0 stories use lighter ceremony than feature stories (shorter descriptions, focused acceptance criteria)
- Each story clearly identifies category (e.g., "Bug Fix: Template rendering fails for empty arrays")
- Priority assigned based on impact and urgency, not arbitrary scheduling
- Epic 0 work is planned alongside feature work, not as an afterthought
- Team reviews Epic 0 backlog weekly to assess priorities and allocate capacity

---

#### Story 0.1: Work Intake Triage System

**As a** POEM developer,
**I want** a unified work intake triage system,
**so that** I can quickly route development work to the appropriate workflow without decision paralysis or confusion.

**Acceptance Criteria**:

1. Rename "Maintenance Backlog" to "Quick Fixes" system (`*add-fix`, `*list-fixes` commands)
2. Create `.bmad-core/tasks/triage-work.md` with decision criteria and routing logic for 5 paths
3. Create `.claude/commands/triage.md` skill wrapper (top-level, NOT in `/poem/`)
4. Add `*triage` command to Bob (SM) and Sarah (PO) agents
5. Create `docs/workflows/triage-guide.md` user documentation with examples
6. Support `/triage issue-{N}` format for usage issue conversion
7. Update Epic 0 PRD to clarify boundary between Quick Fixes (<1hr) and Epic 0 Stories (>1hr)

---

#### Story 0.2: Triage and Issue Logger Normalization

**As a** POEM developer,
**I want** the Triage and Issue Logger systems normalized with unified vocabulary and schema alignment,
**so that** I can eliminate dual data entry, improve triage accuracy, and maintain system architectural separation while enabling seamless data reuse.

**Acceptance Criteria**:

1. Create `.bmad-core/vocabularies/work-item-taxonomy.yaml` with unified severity/impact scale, work type classification, epic thematic areas, and time estimate categories
2. Create `.bmad-core/utils/triage-logic.md` with 4 sequential decision criteria, epic theme matching rules, estimate/impact inference heuristics, and type classification rules
3. No breaking changes to existing workflows (Layer 1 validation)
4. Update Issue Logger JSONL schema to v2.0 with `schemaVersion`, `estimatedTime`, `thematicArea`, `type`, `suggestedPath`, and `suggestedPathRationale` fields
5. Update `docs/planning/gap-analysis/observation-collector.md` to prompt for estimate/area with smart defaults and generate v2.0 JSONL records
6. Update `.bmad-core/tasks/triage-work.md` to read v2.0 fields directly with v1.0 fallback and use pre-computed `suggestedPath`
7. Update `docs/planning/gap-analysis/README.md` with v2.0 schema documentation
8. Issue Logger computes `suggestedPath` automatically by loading triage logic and applying 4 sequential checks
9. Triage uses pre-computed suggestions with staleness detection (>30 days, completed epic)
10. Update `docs/workflows/triage-guide.md` with Layer 3 integration details
11. 5 integration tests pass (auto-inference, user override, v1.0 compatibility, staleness detection, migration)

---

#### Story 0.3: Create Lisa (Librarian) Agent for KDD Documentation Curation

**As a** BMAD developer,
**I want** a Librarian agent (Lisa) that curates Knowledge-Driven Development (KDD) documentation after QA passes,
**so that** I can prevent documentation maintenance burden, broken topology links, code pattern inconsistencies, and knowledge extraction gaps across projects.

**Acceptance Criteria**:

1. Agent definition created in `.bmad-core/agents/librarian.md` (Lisa's persona, commands, dependencies)
2. CLI wrapper created in `.claude/commands/BMad/agents/librarian.md`
3. Task created: `.bmad-core/tasks/extract-knowledge-from-story.md` (8-step extraction workflow)
4. Task created: `.bmad-core/tasks/validate-kdd-topology.md` (link validation, structure checks)
5. Task created: `.bmad-core/tasks/generate-indexes.md` (auto-generate index.md files)
6. Task created: `.bmad-core/tasks/detect-semantic-duplicates.md` (keyword-based similarity)
7. Task created: `.bmad-core/tasks/detect-recurring-issues.md` (recurrence detection for lessons)
8. Template created: `.bmad-core/templates/pattern-tmpl.md`
9. Template created: `.bmad-core/templates/learning-tmpl.md`
10. Template created: `.bmad-core/templates/decision-adr-tmpl.md`
11. Template created: `.bmad-core/templates/example-tmpl.md`
12. Template created: `.bmad-core/templates/health-report-tmpl.md`
13. Checklist created: `.bmad-core/checklists/knowledge-curation-checklist.md`
14. Data file created: `.bmad-core/data/kdd-taxonomy.yaml` (document type definitions)
15. Data file created: `.bmad-core/data/validation-rules.yaml` (link validation, duplication thresholds)
16. AppyDave workflow integration: Update `.bmad-core/tasks/execute-appydave-workflow.md` (add Step 7: Lisa curation)
17. Documentation: Update POEM's `CLAUDE.md` with Lisa usage instructions
18. Documentation: Create `docs/guides/kdd-workflow-guide.md` (how agents use Lisa's docs)

---

#### Story 0.4: Field Testing System with External POEM Project Integration

**As a** POEM developer using POEM in external projects (v-voz, prompt-supportsignal, v-appydave),
**I want** a field testing system that allows me to log blockers and observations from external projects and submit them to central POEM for processing,
**so that** I can track usage issues across multiple projects, link related problems, and enhance POEM's central issue tracker with multi-project context without tight coupling.

**Acceptance Criteria**:

1. Create Field Testing Agent at `packages/poem-core/agents/field-tester.md` with persona "Field Testing Observer" and commands: `*log-blocker`, `*log-session`, `*log-status`
2. Create CLI wrapper at `.claude/commands/poem/agents/field-tester.md` for `/poem/agents/field-tester` command
3. Create directory structure for external projects: `docs/field-testing/blockers/` (JSONL logs), `docs/field-testing/sessions/` (markdown notes)
4. Define client blocker schema (v1.0): `submissionId` ({project}-{sequence}), `timestamp`, `project` object, `blocker` object, `status` (pending/submitted/linked/resolved), `poemIssueRef`, `submittedTo` path
5. Create Inbox Bridge Skill at `packages/poem-core/skills/poem-inbox-bridge/` following Anthropic skill-creator patterns: YAML frontmatter (`name`, comprehensive `description`), concise body (<500 lines), progressive disclosure
6. Inbox Bridge Skill writes submissions to `/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/gap-analysis/inbox/{submissionId}.json` (direct file write, no sync command)
7. Extend Triage task at `.bmad-core/tasks/triage-work.md` with Mode E: Inbox Processing triggered by `/triage inbox`
8. Triage Mode E: Scan `docs/planning/gap-analysis/inbox/*.json` for `status: "pending"`, list submissions, prompt user to select, search existing POEM issues for similarity (>80%)
9. If match found: Link submission to existing issue, enhance issue with new project perspective; If no match: Prompt to create new POEM issue
10. Update POEM issue schema to v2.1 with optional `reportedBy` array field (backward compatible): `{submissionId, project, timestamp, projectSpecificDetails}`
11. Update submission status after processing: `"pending"` → `"linked"`, add `poemIssueRef: "issue-{N}"`
12. Create inbox directory `docs/planning/gap-analysis/inbox/` with `.gitignore` pattern for `inbox/*.json` (transient submissions)
13. Create Field Testing Guide at `docs/planning/gap-analysis/field-testing-guide.md` with architecture overview, usage instructions, workflow examples, schema documentation, troubleshooting
14. Update Triage Guide at `docs/workflows/triage-guide.md` with Mode E section: `/triage inbox` usage, examples of linking/creating issues

---

#### Story 0.5: Rename POEM Core Workflows Directory to Tasks for BMAD Alignment

**As a** POEM developer and user,
**I want** the POEM core agent procedure directory renamed from `workflows/` to `tasks/` to match BMAD terminology,
**so that** the codebase uses consistent terminology (agents execute "tasks", not "workflows") and eliminates confusion between agent procedures and user workspace projects.

**Acceptance Criteria**:

1. Directory renamed: `packages/poem-core/tasks/` → `packages/poem-core/tasks/`
2. All YAML files moved to new location (new-prompt.yaml, refine-prompt.yaml, test-prompt.yaml, validate-prompt.yaml)
3. README.md in tasks/ updated to reflect "tasks" terminology
4. CLAUDE.md updated with correct paths and terminology
5. README.md (project root) updated with correct paths
6. Architecture docs updated (unified-project-structure.md, index.md, high-level-architecture.md)
7. Agent definitions updated (prompt-engineer.md - lines referencing workflows/)
8. Test files updated to reference tasks/ instead of workflows/
9. Installation scripts updated (bin/preservation.js if applicable)
10. Installed structure documented correctly (.poem-core/tasks/ after install)
11. No references to packages/poem-core/tasks/ remain in active documentation
12. Planning/exploration docs updated or marked as historical (low priority)
13. All tests pass after rename
14. Git history preserved (use `git mv` for directory rename)
15. No broken links or references in documentation

---

#### Story 0.6: Fix Integration Test Infrastructure & Stabilize Test Suite

**As a** POEM developer,
**I want** the integration test infrastructure stabilized and all pre-existing test failures resolved,
**so that** the test suite provides reliable feedback and I can confidently validate story implementations without infrastructure noise.

**Acceptance Criteria**:

1. All 10 pre-existing test failures resolved (target: 872/872 tests passing)
2. Separate unit tests from integration tests (different npm scripts: `test:unit`, `test:integration`, `test`)
3. Document server start location & prerequisites in `docs/guides/integration-test-setup.md`
4. Reduce server error flood (target: <5 non-critical errors during normal operation)
5. Establish test suite health monitoring (`docs/testing/test-suite-baseline.md`, `npm run test:health`)
6. Integration test infrastructure improvements (pre-test validation, clear error messages)

**Category**: Developer Experience + Infrastructure
**Priority**: P1 (High)

---

### Epic 1: Foundation & Monorepo Setup

Establish project infrastructure with monorepo structure, NPX installer, and basic `.poem-core/` + `.poem-app/` scaffolding that copies to user projects.

### Epic 2: Astro Runtime & Handlebars Engine

Build the `.poem-app/` Astro server with Handlebars template engine, basic helpers, hot-reload support, and core API endpoints for template rendering.

### Epic 3: Prompt Engineer Agent & Core Workflows

Create the first agent (Prompt Engineer) with workflows for new prompt creation, refinement, testing, and validation—enabling the primary user journey.

### Epic 4: YouTube Automation Workflow (System Validation)

Validate POEM's core capabilities through the YouTube Launch Optimizer workflow—a real multi-prompt pipeline that transforms video transcripts into complete launch assets (titles, descriptions, chapters, thumbnails, tags, social posts). This epic tests schema extraction, template chaining, mock data generation, Handlebars helpers, progressive data accumulation, and human-in-the-loop patterns using 53 production templates across 11 workflow sections. Mock data generation is one capability among many being validated.

### Epic 5: System Agent & Helper Generation

Build the System Agent with workflows for creating custom Handlebars helpers on-demand, managing Astro infrastructure, and establishing the provider pattern foundation.

### Epic 6: Integration Agent & Provider Pattern

Create the Integration Agent with abstract provider contract, workflows for pulling data dictionaries and publishing prompts to external systems.

### Epic 7: Mock/Test Data Agent & Level 2 Mock Data

Build the fourth agent with workflows for realistic mock data generation based on provider data dictionaries, entity relationships, and domain-specific scenarios.

---

## Epic Details

### Epic 1: Foundation & Monorepo Setup

**Goal**: Establish the project infrastructure with monorepo structure, NPX installer, and basic scaffolding that enables all subsequent development. Users should be able to install POEM into their projects.

---

#### Story 1.1: Initialize Monorepo Structure

As a developer,
I want a monorepo structure with poem-core and poem-app packages,
so that the codebase is organized for coordinated development and releases.

**Acceptance Criteria**:

1. Root `package.json` configured for monorepo (workspaces or similar)
2. `packages/poem-core/` directory created with basic structure
3. `packages/poem-app/` directory created with basic structure
4. Shared TypeScript configuration across packages
5. Root scripts for common operations (build, test, lint)
6. `.gitignore` configured for Node.js/TypeScript project
7. README.md with project overview and development setup

---

#### Story 1.2: Create poem-core Package Structure

As a developer,
I want the poem-core package structured for agents, workflows, and skills,
so that the framework components have a clear home.

**Acceptance Criteria**:

1. `packages/poem-core/` follows BMAD-style structure
2. Directory structure includes: `agents/`, `workflows/`, `skills/`, `templates/`, `data/`
3. `core-config.yaml` created with basic configuration schema
4. Placeholder agent file created: `agents/prompt-engineer.md`
5. Placeholder workflow file created: `workflows/new-prompt.yaml`
6. Placeholder skill file created: `skills/check-my-prompt.md`
7. Package exports configuration files for installation

---

#### Story 1.3: Create poem-app Package Structure

As a developer,
I want the poem-app package structured as an Astro project,
so that the runtime server has proper scaffolding.

**Acceptance Criteria**:

1. `packages/poem-app/` initialized as Astro project (latest version)
2. TypeScript configured for Astro
3. Directory structure includes: `src/pages/api/`, `src/services/`, `src/config/`
4. Placeholder API endpoint: `src/pages/api/health.ts` returns status
5. Basic Astro config with configurable port
6. Package.json with start/build/dev scripts
7. Tailwind CSS configured (minimal, for future use)

---

#### Story 1.4: Implement NPX Installer

As a user,
I want to install POEM via `npx poem-os install`,
so that I can add POEM to my project with a single command.

**Acceptance Criteria**:

1. `npx poem-os install` copies `.poem-core/` to user's project root
2. `npx poem-os install` copies `.poem-app/` to user's project root
3. `npx poem-os install` creates `/poem/` workspace directory with subdirs: `prompts/`, `schemas/`, `config/`
4. `npx poem-os install --core` installs only `.poem-core/`
5. `npx poem-os install --app` installs only `.poem-app/`
6. Installer detects existing installation and prompts for overwrite/merge
7. Installation completes in under 3 minutes (NFR1)
8. Success message displays next steps for user

---

#### Story 1.5: Create Claude Code Slash Command Integration

As a user,
I want slash commands to activate POEM agents,
so that I can access POEM workflows from Claude Code.

**Acceptance Criteria**:

1. `.claude/commands/poem/` directory structure created during install
2. Slash command wrapper for Prompt Engineer agent: `/poem/agents/penny`
3. Slash command files follow BMAD pattern (load agent definition)
4. Commands discoverable via Claude Code's slash command system
5. Agent activation displays agent name, role, and available commands
6. Help command lists all available POEM slash commands

---

#### Story 1.6: NPM Package Publishing ✅ DONE

As a developer,
I want to publish POEM to NPM as a public package,
so that users can install it globally via `npx poem-os install`.

**Acceptance Criteria**:

1. Remove `"private": true` from root `package.json`
2. Add `"bin"` field mapping `"poem-os"` command to `"bin/install.js"`
3. Add `"repository"`, `"bugs"`, and `"homepage"` URLs to package.json
4. Define `"files"` array in package.json to control published content
5. Test package installation locally using `npm link` followed by `npx poem-os install`
6. Create `publishing-guide.md` documenting the manual publishing process
7. Add GitHub Actions workflow for automated NPM publishing (optional, future enhancement)

**Status**: Completed. POEM can now be installed via `npx poem-os install`.

---

#### Story 1.7: Startup Script and Port Configuration

As a user,
I want to start POEM from my project root and configure the server port,
so that I can run POEM without navigating into .poem-app/ and manage multiple POEM instances on different ports.

**Acceptance Criteria**:

1. `npx poem-os start` command launches POEM server from project root
2. Startup script validates `.poem-app/` exists and shows helpful error if not
3. During installation, users prompted for port number (default: 9500)
4. Port configuration written to `.poem-app/.env`
5. Users can override port temporarily: `npx poem-os start --port=XXXX`
6. Users can reconfigure port permanently: `npx poem-os config --port XXXX`
7. Users can view current config: `npx poem-os config --list`
8. Port validation rejects invalid values (< 1024 or > 65535)
9. Startup script is cross-platform compatible (Windows/macOS/Linux)
10. Documentation updated (README.md, publishing-guide.md)

---

#### Story 1.8: Installation Registry and Port Conflict Detection

As a developer,
I want POEM installations to automatically register with port conflict detection,
so that I can avoid port conflicts across multiple POEM instances without manual tracking.

**Acceptance Criteria**:

1. Default port changed from 4321 to 9500 across all documentation and configuration files
2. Installation process automatically registers in `~/.poem/registry.json` (creates directory if needed)
3. Port conflict detection runs automatically during `npx poem-os install` with warning and suggested alternatives
4. Port conflict detection runs automatically during `npx poem-os config --port XXXX` with warning
5. Registry format stores: id, path, port, installedAt, lastChecked, version, mode, gitBranch, status, metadata
6. Debug CLI command: `npx poem-os registry --list` displays all registered installations with status
7. Debug CLI command: `npx poem-os registry --refresh` scans filesystem and updates registry
8. Debug CLI command: `npx poem-os registry --clean` removes entries for missing installations
9. Registry operations are silent and automatic (no user interaction required for normal operations)
10. Documentation updated: README.md, CLAUDE.md, docs/architecture.md, packages/poem-app/astro.config.mjs

---

#### Story 1.9: Installation Preservation System

As a POEM user,
I want a preservation system that protects my user files during reinstallation,
so that I can safely run `npx poem-os install` to get the latest POEM version without losing my custom workflows and data.

**Acceptance Criteria**:

1. During installation, create `.poem-preserve` file in project root with default preservation rules (`poem/`, `dev-workspace/`)
2. When reinstalling, read preservation rules and identify files to update vs preserve; user workflows detected by "not in framework workflow list"
3. Before overwriting, display installation summary with file counts and prompt for confirmation: "This will overwrite X files. Continue? [y/N]"
4. Extend installation registry to track POEM version (`poemVersion` field read from `package.json`)
5. If framework files were modified by user (hash mismatch), warn during summary: "⚠ X files were modified and will be overwritten"
6. Update `README.md` with `.poem-preserve` explanation and examples

---

#### Story 1.10: Selective Workspace Creation

As a POEM user,
I want to create workspace folders only when I need them,
so that I don't have empty folders cluttering my project and can organize by workflow.

**Acceptance Criteria**:

1. `npx poem-os install` creates ONLY `.poem-core/` and `.poem-app/` directories (no `poem/` folder)
2. `poem-os init` creates root-level folders: `poem/config/` with default `poem.yaml`, `poem/shared/prompts/`, `poem/shared/schemas/`; command is idempotent
3. `poem-os add-workflow <name>` creates workflow-specific folders with validated names (alphanumeric, dash, underscore); creates/updates `poem/config/poem.yaml`
4. Installation flags: `--init` and `--workflow <name>` enable one-command setup
5. Rename terminology everywhere: `workflow-data/` → `workflow-state/`, `workflowData` → `workflowState` in config/TypeScript
6. `poem/config/poem.yaml` created with default structure (version, currentWorkflow, workflows map)
7. Update `.poem-preserve` rules to protect new folder structure (`poem/config/`, `poem/shared/`, `poem/workflows/`)
8. Update documentation (README, architecture docs) with new installation workflow and two-tier folder architecture

---

#### Story 1.11: Central POEM Path Configuration & Port Sync

As a POEM contributor/developer,
I want the installer to configure central POEM path and sync port settings to poem.yaml,
so that agents (Victor, Felix) can query cross-repository capabilities and tools can discover the POEM server port.

**Acceptance Criteria**:

1. `poem/config/poem.yaml` includes new `server` section with `port` field (default: 9500) and new `centralPoemPath` field (default: `null`)
2. `poem-os init` reads port from `.poem-app/.env` file (if exists) or `PORT` environment variable (default: 9500), writes `server.port` to `poem/config/poem.yaml`; Astro config unchanged (continues reading `process.env.PORT`)
3. `poem-os init` detects if `~/dev/ad/poem-os/poem` exists; if yes, prompts user to configure central POEM path; prompt skippable with `--skip-central-path` flag
4. New command `poem-os config set <key> <value>` supports keys: `port` (updates both poem.yaml and .env), `central-path` (updates poem.yaml); new commands: `poem-os config get <key>`, `poem-os config list`
5. Config service (`packages/poem-app/src/services/config/poem-config.ts`) adds `getCentralPoemPath()` and `getServerPort()` methods for tool queries (NOT used by Astro)
6. Victor agent (`packages/poem-core/agents/workflow-validator.md`) updated with path resolution: reads `centralPoemPath` from poem.yaml, falls back to convention `~/dev/ad/poem-os/poem`; `*capability-explorer` queries both local context (.poem-core/) and central context (docs/stories/, docs/prd/, docs/kdd/)
7. Felix/Inbox Bridge (`packages/poem-core/skills/poem-inbox-bridge/SKILL.md`) removes hardcoded path, uses path resolution logic with helpful error if central path not configured
8. CLI routing in `bin/install.js` for `poem-os config` command with subcommands: set, get, list
9. Unit tests for config service; integration tests for init command; manual SAT for Victor cross-repo queries, Felix inbox submission, and port sync
10. Documentation updates: README (config command, gitignore policy), architecture docs (poem.yaml schema), Victor's guide (troubleshooting); document that `poem/config/poem.yaml` should be committed (not gitignored), already protected by `.poem-preserve`; for multi-machine scenarios, use `POEM_CENTRAL_PATH` env var override

---

#### Story 1.12: Post-Install CLAUDE.md Documentation Helper

As a user installing POEM in a project,
I want to see clear instructions for documenting POEM agents in my project's CLAUDE.md,
so that Claude Code can provide context-aware assistance about available POEM agents.

**Acceptance Criteria**:

1. After installation, user sees post-install message with path to agent documentation
2. Documentation file exists at `.poem-core/docs/claude-md-guide.md` in installed project
3. File contains clear descriptions of all 3 POEM agents (Victor, Penny, Felix)
4. Each agent includes: name, persona, role, when to use, key commands
5. Format is ready to copy-paste into CLAUDE.md
6. Works for both fresh installs and updates
7. Message is clear and non-intrusive

---

### Epic 2: Astro Runtime & Handlebars Engine

**Goal**: Build the `.poem-app/` Astro server with Handlebars template engine, enabling template rendering via API endpoints. This provides the runtime foundation for all template-based operations.

---

#### Story 2.1: Configure Astro Server

As a developer,
I want a configured Astro server that starts reliably,
so that API endpoints are available for POEM operations.

**Acceptance Criteria**:

1. Astro server starts with `npm run dev` in `.poem-app/`
2. Server port configurable via environment variable or config file
3. Server startup time under 3 seconds (NFR2)
4. Health check endpoint `/api/health` returns server status
5. Server logs startup information (port, environment, version)
6. Graceful shutdown on SIGTERM/SIGINT
7. Error handling for port conflicts with helpful message

---

#### Story 2.2: Implement Handlebars Service

As a developer,
I want a Handlebars service that compiles and renders templates,
so that API endpoints can process `.hbs` files.

**Acceptance Criteria**:

1. Handlebars service initializes on server start
2. Service loads helpers from `src/services/handlebars/helpers/` directory
3. Eager loading of all helpers during initialization
4. Service exposes `compile(template)` and `render(compiled, data)` methods
5. Template compilation errors return helpful messages with line numbers
6. Service handles missing placeholders gracefully (empty string or configurable)
7. Performance: render typical template (< 5KB) in under 100ms

---

#### Story 2.3: Implement Basic Handlebars Helpers

As a prompt engineer,
I want basic formatting helpers available,
so that templates can transform data without custom code.

**Acceptance Criteria**:

1. `titleCase` helper: `{{titleCase "hello world"}}` → "Hello World"
2. `upperCase` helper: `{{upperCase "hello"}}` → "HELLO"
3. `lowerCase` helper: `{{lowerCase "HELLO"}}` → "hello"
4. `dateFormat` helper: `{{dateFormat date "YYYY-MM-DD"}}` → formatted date
5. `default` helper: `{{default value "fallback"}}` → value or fallback if empty
6. `json` helper: `{{json object}}` → JSON string for debugging
7. All helpers documented with examples in helpers README

---

#### Story 2.4: Implement Hot-Reload for Helpers

As a developer,
I want helpers to hot-reload when modified,
so that I can develop helpers without restarting the server.

**Acceptance Criteria**:

1. File watcher monitors `src/services/handlebars/helpers/` directory
2. New helper files automatically loaded and registered
3. Modified helper files reloaded without server restart
4. Deleted helper files unregistered from Handlebars
5. Hot-reload logs which helpers were added/modified/removed
6. Syntax errors in helpers logged but don't crash server
7. Hot-reload completes within 1 second of file change

---

#### Story 2.5: Create Template Render API Endpoint

As a skill or agent,
I want an API endpoint to render templates with data,
so that prompts can be processed programmatically.

**Acceptance Criteria**:

1. `POST /api/prompt/render` accepts template path and data
2. Endpoint loads template from `/poem/prompts/` or provided content
3. Template rendered with Handlebars service
4. Response includes: rendered output, render time, warnings
5. Missing data fields reported as warnings in response
6. Invalid template path returns 404 with helpful message
7. Response time under 1 second for typical templates (NFR3)

---

#### Story 2.6: Create Schema Extraction API Endpoint

As a skill or agent,
I want an API endpoint to extract schemas from templates,
so that required data fields are automatically identified.

**Acceptance Criteria**:

1. `POST /api/schema/generate` accepts template path or content
2. Endpoint parses Handlebars placeholders and blocks
3. Returns JSON schema with field names and inferred types
4. Handles nested objects: `{{obj.field}}` → `{obj: {field: string}}`
5. Handles arrays: `{{#each items}}` → `{items: array}`
6. Identifies required helpers used in template
7. Schema follows simple JSON format (not full JSON Schema spec initially)

---

### Epic 3: Prompt Engineer Agent & Core Workflows

**Goal**: Create the first agent (Prompt Engineer) with workflows that enable users to create, refine, test, and validate prompts. This delivers the primary user journey.

---

#### Story 3.1: Create Prompt Engineer Agent Definition

As a user,
I want a Prompt Engineer agent that guides prompt development,
so that I have systematic assistance creating quality prompts.

**Acceptance Criteria**:

1. Agent definition in `.poem-core/agents/prompt-engineer.md`
2. Agent follows BMAD agent structure (YAML config + persona + commands)
3. Persona defined: name, role, style, core principles
4. Commands listed: `*new`, `*refine`, `*test`, `*validate`, `*help`
5. Agent loads POEM principles/knowledge base on activation
6. Activation via `/poem/agents/penny` slash command works
7. Agent greets user and displays available commands

---

#### Story 3.2: Implement New Prompt Workflow

As a prompt engineer,
I want a guided workflow to create new prompts,
so that prompts follow POEM best practices from the start.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/new-prompt.yaml`
2. Workflow gathers: prompt purpose, target output, required inputs
3. Creates `.hbs` template file in `/poem/prompts/`
4. Generates initial schema in `/poem/schemas/`
5. Offers to generate mock data for testing
6. Provides preview of rendered template with example data
7. Workflow follows BMAD elicitation patterns for user interaction

---

#### Story 3.3: Implement Refine Prompt Workflow

As a prompt engineer,
I want a workflow to iteratively improve existing prompts,
so that I can rapidly test and update prompts.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/refine-prompt.yaml`
2. Workflow loads existing prompt from path
3. Displays current template content and schema
4. Renders with available data (mock or provided)
5. User can modify template inline or via file
6. Changes saved and re-rendered for comparison
7. Iteration history tracked (optional, for undo)

---

#### Story 3.4: Implement Test Prompt Workflow

As a prompt engineer,
I want a workflow to test prompts with various data,
so that I can validate prompt behavior across scenarios.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/test-prompt.yaml`
2. Workflow accepts prompt path and data source (mock, file, or inline)
3. Calls render API endpoint and displays output
4. Reports missing fields, helper errors, warnings
5. Can run multiple test scenarios in sequence
6. Displays render time and output length
7. Output can be saved to file for review

---

#### Story 3.5: Implement Validate Prompt Workflow

As a prompt engineer,
I want a workflow to validate prompt structure and quality,
so that I catch issues before deployment.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/validate-prompt.yaml`
2. Validates Handlebars syntax (no parse errors)
3. Validates all placeholders have corresponding schema fields
4. Validates required helpers are registered
5. Checks for POEM best practices (configurable rules)
6. Reports issues with severity (error, warning, info)
7. Provides suggestions for fixing common issues

---

#### Story 3.6: Create Core Skills for Prompt Engineer

As a prompt engineer,
I want autonomous skills that assist with common tasks,
so that I can work efficiently without always invoking full workflows.

**Acceptance Criteria**:

1. `check-my-prompt.md` skill validates current prompt in context
2. `preview-with-data.md` skill renders prompt with provided/mock data
3. `generate-schema.md` skill extracts schema from template
4. Skills follow POEM skill format (markdown with instructions)
5. Skills are self-describing (suggest when they're useful)
6. Skills call API endpoints via HTTP for heavy operations
7. Skills documented in `.poem-core/skills/README.md`

---

#### Story 3.7: Define and Validate Output Schemas

> **Note:** This story was initially implemented with separate schema files (input + output), but was corrected in **Story 3.7.1** to use unified schema files with `input` and `output` sections in a single file, aligning with the original 2026-01-07 architecture design.

As a prompt engineer,
I want to define output schemas for my prompts,
so that I can validate AI responses and enable type-safe workflow chaining.

**Acceptance Criteria**:

1. ~~Output schema stored alongside input schema (e.g., `generate-title-output.json`)~~ **Corrected in Story 3.7.1:** Output schema stored within unified schema file with `input` and `output` sections (e.g., `generate-title.json` contains both)
2. Schema defines expected AI response structure (fields, types, format)
3. Output schema extraction from prompt "Expected Output" section (optional automation)
4. API endpoint validates rendered output against output schema
5. Validation reports missing fields, type mismatches, format errors
6. Output schemas support both structured (JSON) and unstructured (text) outputs
7. Prompt Engineer agent workflows handle unified schemas (input + output in one file)
8. Output schemas optional (prompts can omit `output` section if outputs are purely informational)

**NFR Considerations**:
- Schema validation completes in <100ms (NFR2)
- Clear error messages for schema mismatches (NFR6)

---

#### Story 3.8: Multi-Workflow Foundation (Phase 1)

As a prompt engineer,
I want to work with multiple independent workflows within one POEM workspace,
so that I can manage distinct prompt collections (YouTube Launch, Video Planning, NanoBanana) with workflow-specific context while sharing common resources.

**Acceptance Criteria**:

1. Workflow-scoped directory structure created in `dev-workspace/workflows/<name>/`
2. Config system extended to support `currentWorkflow` and workflow definitions
3. Workflow configuration includes: prompts path, schemas path, reference paths (array)
4. Config service resolves workflow-scoped paths based on active workflow
5. Penny gains `*workflows` command to list available workflows
6. Penny gains `*switch <workflow>` command to change active context
7. Penny gains `*context` command to show current workflow info
8. Existing Penny commands (`*list`, `*new`, `*view`) operate in workflow-scoped context
9. Prompts created in workflow A don't appear when switched to workflow B
10. Schemas scoped to workflow directories
11. Can switch between workflows without restarting server or agent
12. Active workflow persists across Penny sessions
13. Workflow config supports reference paths as **array** (multiple sources)
14. Reference path types supported: `local`, `second-brain`
15. `*context` command displays available reference paths
16. WorkflowDefinition model documented in architecture
17. Workflow config structure documented with comments
18. Phase 1 limitations documented (what's deferred to Phase 2)

**Phase Note**: Phase 1 (4-6 hours) delivers foundation for Epic 4 testing. Phase 2 (Story 4.9) adds polish and integration based on Epic 4 learnings.

**Related**: Course correction `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`

---

#### Story 3.9: Add Capability Explorer Command to Victor Agent

As a prompt engineer, developer, or new POEM user,
I want to query what POEM can do through a unified interface,
so that I can discover capabilities without manually searching across multiple documents (Epic Capabilities, Stories, Victor artifacts, KDD docs).

**Acceptance Criteria**:

1. Victor agent gains `*capability-explorer` command that accepts natural language queries
2. Command queries four data sources: Victor artifacts, Story files, KDD docs, Epic Capabilities
3. Supports query types: "list all", "can POEM do X?", "find similar to X", "what's blocking story Y?"
4. Returns results with capability status indicators (✅ Functional, 🔄 In Progress, 📅 Planned, ⚠️ Partial, ❌ Not Available)
5. Query results include story references, validation status, and KDD documentation links
6. Command reads Lisa's KDD topology (patterns, learnings, decisions) as additional context source
7. Results include practical usage information: commands to use, examples, documentation links
8. Fast query response (<3 seconds for typical queries)
9. Victor agent definition updated with new command documentation
10. Technical debt documented: "Extract to Capability Explorer agent if complexity exceeds 20% of Victor's code"
11. Help system updated to include `*capability-explorer` command description
12. Query command is optional and does not interfere with Victor's primary validation role

---

### Epic 4: YouTube Automation Workflow (System Validation)

**Goal**: Validate POEM's core capabilities through the YouTube Launch Optimizer workflow—a real-world, non-trivial multi-prompt pipeline. This epic tests schema extraction, template chaining, mock data generation, Handlebars helpers, progressive data accumulation, and human-in-the-loop patterns using 53 production templates across 11 workflow sections.

**Workflow Architecture**: This epic implements the POEM workflow system as defined in `docs/architecture.md` § Workflow Definition Structure. Workflows are YAML files with sequential steps, where each step declares inputs/outputs and references a prompt template. The data bus (workflow attributes) is auto-derived from the union of all step inputs and outputs, enabling progressive data accumulation across the prompt chain.

---

#### Story 4.1: Import YouTube Launch Optimizer Templates

As a prompt engineer,
I want to import the 53 YouTube Launch Optimizer templates into POEM,
so that I have a real-world prompt collection to validate the system.

**Acceptance Criteria**:

1. All 53 `.hbs` templates are copied to `/poem/prompts/youtube-launch-optimizer/`
2. Templates maintain their section-based naming convention (e.g., `1-1-configure.hbs`, `5-1-generate-title-v1.hbs`)
3. `brand-config.json` is imported to `/poem/config/` with CTAs, affiliates, and social links
4. `workflow-attributes.json` **reference example** is copied to `/poem/schemas/examples/youtube-launch-optimizer/` as validation baseline for auto-derived schema
5. Import process validates Handlebars syntax for each template
6. Import summary reports: total templates, sections covered, any syntax errors

---

#### Story 4.2: Extract Schemas from Templates

As a prompt engineer,
I want to automatically extract JSON schemas from template placeholders,
so that I know what data each prompt requires without manual inspection.

**Acceptance Criteria**:

1. Schema extraction parses Handlebars placeholders from `.hbs` files
2. Simple placeholders extracted: `{{fieldName}}` → `{fieldName: string}`
3. Nested placeholders extracted: `{{object.field}}` → `{object: {field: string}}`
4. Array access extracted: `{{items.[0]}}` → `{items: array}`
5. Each blocks extracted: `{{#each items}}` → `{items: array}`
6. Conditional blocks extracted: `{{#if condition}}` → `{condition: boolean}`
7. Helper calls identified: `{{truncate title 49}}` → notes `truncate` helper required
8. Generated **prompt-specific schemas** saved to `/poem/schemas/youtube-launch-optimizer/{prompt-name}.schema.json` (one per template)
9. Extraction handles the 7 specific patterns from workflow spec

**Note on Workflow Schema**: The workflow-level data bus schema is NOT extracted here—it's auto-derived from workflow step I/O declarations (union of all `inputs` + `outputs` arrays). Prompt schemas tell us what each template expects; workflow schemas tell us what the overall pipeline accumulates.

---

#### Story 4.3: Generate Mock Workflow Data

As a prompt engineer,
I want to generate mock data matching the workflow-data schema,
so that I can test each prompt independently without real transcripts.

**Acceptance Criteria**:

1. Mock data generated for all 37 workflow-data fields defined in spec
2. String fields generate realistic YouTube-appropriate content (titles, descriptions)
3. Array fields generate appropriate item counts (e.g., 5-10 chapter titles, 3-5 title candidates)
4. Nested objects maintain structure (e.g., `analyzeContentEssence.mainTopic`, `analyzeContentEssence.keywords`)
5. Mock `transcriptAbridgement` generates 500-1000 word summary text
6. Mock `createChapters` generates YouTube chapter format with timestamps
7. Generated mock data validates against extracted schemas
8. Mock data saved to `/poem/mock-data/youtube-launch-optimizer/workflow-data.json`

---

#### Story 4.4: Implement Required Handlebars Helpers

As a prompt engineer,
I want the Handlebars helpers needed by YouTube Launch Optimizer templates,
so that templates render correctly with formatting and logic.

**Acceptance Criteria**:

1. `gt` helper implemented: `{{#if (gt chapters.length 20)}}` for greater-than comparison
2. `truncate` helper implemented: `{{truncate title 49}}` with character limit
3. `join` helper implemented: `{{join keywords ", "}}` for array-to-string
4. `formatTimestamp` helper implemented: `{{formatTimestamp seconds}}` for MM:SS format
5. All helpers registered with Handlebars engine on server start
6. Hot-reload works when helpers are added/modified during development
7. Helpers documented in `.poem-app/src/services/handlebars/helpers/README.md`

---

#### Story 4.5: Run Single Prompt with Mock Data

As a prompt engineer,
I want to render a single template with mock data and see the output,
so that I can validate individual prompts work correctly.

**Acceptance Criteria**:

1. API endpoint accepts template path and data source (mock or provided)
2. Template renders with Handlebars engine including custom helpers
3. Rendered output returned in response
4. Missing placeholder fields reported as warnings (not errors)
5. Helper errors reported with template location and context
6. Response includes metadata: template name, data source, render time
7. Test with `6-1-yt-simple-description-v2.hbs` using mock workflow data

---

#### Story 4.6: Run Prompt Chain (Section 1 → Section 5)

As a prompt engineer,
I want to run a chain of prompts where outputs feed into subsequent prompts,
so that I can validate template chaining and progressive data accumulation.

**Acceptance Criteria**:

1. Workflow defined in `/poem/workflows/youtube-test-chain.yaml` with formalized structure:
   - `name`, `description` fields
   - `steps` array with `name`, `prompt`, `inputs`, `outputs` for each step
2. Chain tested: `1-4-abridge` → `4-1-analyze-content-essence` → `5-1-generate-title`
3. Each step declares inputs (e.g., `[transcript]`) and outputs (e.g., `[transcriptAbridgement]`)
4. Output from step A stored in workflow-data bus under declared output key
5. Subsequent steps access workflow-data bus for declared input keys
6. Each step logs: prompt name, input fields used, output fields added
7. Chain can be paused and resumed (workflow-data persisted to `/poem/workflow-data/`)
8. Final workflow-data contains all accumulated attributes from chain (auto-derived from union of all step I/O)

---

#### Story 4.6.5: Auto-Generate Workflow Schema from YAML

As a workflow execution engine,
I want to automatically derive the workflow schema from step inputs/outputs,
so that the workflow YAML is the single source of truth.

**Acceptance Criteria**:

1. Workflow parser extracts all step `inputs:` and `outputs:` declarations from YAML
2. Schema generator computes union of all declared attributes
3. Generated schema includes type inference (string, array, object) based on usage
4. Schema file is written to `poem/schemas/workflows/{workflow-name}.json` for debugging
5. Generated schema matches `data/youtube-launch-optimizer/schemas/workflow-attributes.json` reference example (80+ attributes)
6. Schema generation is automatic - no manual creation required
7. API endpoint `/api/workflow/{name}/schema` returns auto-derived schema for validation

**Technical Notes**:

- Use workflow YAML step I/O as source of truth
- Reference example: `data/youtube-launch-optimizer/schemas/workflow-attributes.json` shows expected output
- Type inference rules:
  - Simple attributes default to `string`
  - Attributes accessed with `#each` are `array`
  - Attributes with dot notation are `object` with nested properties
  - Explicit type annotations in workflow YAML override inference

---

#### Story 4.7: Human-in-the-Loop Checkpoint

As a prompt engineer,
I want to pause a workflow for human curation before continuing,
so that creative decisions like title selection involve human judgment.

**Acceptance Criteria**:

1. Workflow can define "checkpoint" steps requiring human input
2. Checkpoint presents options to user (e.g., generated title candidates)
3. User selection stored in workflow-data (e.g., `selectedTitles`)
4. Workflow resumes with human selection available to subsequent prompts
5. Test with `5-2-select-title-shortlist.hbs` pattern (Flexible Selection)
6. Checkpoint can accept multiple selections or free-form input
7. Skipping checkpoint uses first/default option (for automated testing)

---

#### Story 4.8: Platform Constraint Validation

As a prompt engineer,
I want prompts to validate platform-specific constraints,
so that generated content meets YouTube requirements.

**Acceptance Criteria**:

1. Constraint definitions loaded from config (character limits, format rules)
2. YouTube constraints implemented: title (50 chars), thumbnail text (20 chars), chapter title (49 chars), description visible (150 chars), description max (5000 chars)
3. Validation runs on prompt output, not input
4. Constraint violations reported with field name, limit, and actual length
5. Warnings vs errors configurable per constraint
6. Test with `5-1-generate-title` output against 50-char limit
7. Validation results included in chain execution report

---

### Epic 5: System Agent & Helper Generation

**Goal**: Build the System Agent that creates custom Handlebars helpers on-demand and manages Astro infrastructure. This enables extensibility without manual coding.

---

#### Story 5.1: Create System Agent Definition

As a user,
I want a System Agent that manages POEM infrastructure,
so that I can extend capabilities without leaving Claude Code.

**Acceptance Criteria**:

1. Agent definition in `.poem-core/agents/system-agent.md`
2. Agent follows BMAD agent structure
3. Persona defined: infrastructure-focused, code-generating
4. Commands listed: `*add-helper`, `*create-provider`, `*server-status`, `*help`
5. Activation via `/poem/agents/system-agent` slash command
6. Agent understands Handlebars helper patterns and Astro API patterns

---

#### Story 5.2: Implement Add Helper Workflow

As a prompt engineer,
I want to request new Handlebars helpers by describing what I need,
so that custom formatting is available without manual JavaScript coding.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/add-helper.yaml`
2. User describes helper need in natural language
3. System Agent generates JavaScript helper code
4. Helper file created in `.poem-app/src/services/handlebars/helpers/`
5. Helper follows Handlebars helper conventions
6. Hot-reload picks up new helper automatically
7. Agent tests helper with example inputs before confirming

---

#### Story 5.3: Implement Server Management Workflow

As a developer,
I want workflows to manage the Astro server,
so that I can start, stop, and troubleshoot without leaving Claude Code.

**Acceptance Criteria**:

1. `*server-start` command starts Astro server in background
2. `*server-stop` command gracefully stops running server
3. `*server-status` command reports: running/stopped, port, uptime
4. `*server-logs` command displays recent server logs
5. Server process management works cross-platform
6. Commands provide helpful error messages for common issues

---

#### Story 5.4: Create Provider Pattern Foundation

As a developer,
I want a provider interface pattern established,
so that Integration Agent can work with any external system.

**Acceptance Criteria**:

1. Provider interface documented in `.poem-app/src/providers/README.md`
2. Interface defines required methods: `connect()`, `pullDictionary()`, `publishPrompt()`, `testConnection()`
3. Base provider class/type created for extension
4. Example "mock" provider implemented for testing
5. Provider registration mechanism in place
6. API endpoints route to appropriate provider based on name

---

#### Story 5.5: Implement Create Provider Workflow

As a developer,
I want to create new provider implementations via System Agent,
so that external integrations are scaffolded correctly.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/create-provider.yaml`
2. User provides: provider name, connection details, API patterns
3. System Agent generates provider implementation files
4. Files created in `.poem-app/src/pages/api/providers/{name}/`
5. Provider implements required interface methods
6. Generated code includes TODO comments for customization
7. Provider registered and available after creation

---

### Epic 6: Integration Agent & Provider Pattern

**Goal**: Create the Integration Agent that connects to external systems via providers, enabling data dictionary pulls and prompt publishing.

---

#### Story 6.1: Create Integration Agent Definition

As a user,
I want an Integration Agent that manages external system connections,
so that I can sync data and publish prompts to production.

**Acceptance Criteria**:

1. Agent definition in `.poem-core/agents/integration-agent.md`
2. Agent follows BMAD agent structure
3. Persona defined: integration-focused, connection-aware
4. Commands listed: `*connect`, `*pull-dictionary`, `*publish`, `*test-connection`, `*help`
5. Activation via `/poem/agents/integration-agent` slash command
6. Agent knows available providers and their status

---

#### Story 6.2: Implement Pull Dictionary Workflow

As a prompt engineer,
I want to pull data dictionaries from external systems,
so that I know what fields are available for my prompts.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/pull-dictionary.yaml`
2. User selects provider to pull from
3. Workflow calls provider's `pullDictionary()` method
4. Dictionary saved to `/poem/schemas/dictionaries/{provider}.json`
5. Dictionary includes: field names, types, descriptions (if available)
6. Pull timestamp recorded for freshness tracking
7. Diff shown if dictionary already exists (new/changed/removed fields)

---

#### Story 6.3: Implement Publish Prompt Workflow

As a prompt engineer,
I want to publish prompts to external systems,
so that tested prompts reach production.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/publish-prompt.yaml`
2. User selects prompt(s) and target provider
3. Validation runs before publish (syntax, schema, constraints)
4. Workflow calls provider's `publishPrompt()` method
5. Publish confirmation shows what was sent and response
6. Publish history logged for audit trail
7. Rollback information provided (if supported by provider)

---

#### Story 6.4: Implement Test Connection Workflow

As a prompt engineer,
I want to test provider connections,
so that I know integrations are working before attempting operations.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/test-connection.yaml`
2. User selects provider to test
3. Workflow calls provider's `testConnection()` method
4. Reports: connected/failed, latency, authentication status
5. Helpful error messages for common connection issues
6. Can test all configured providers in sequence
7. Connection status cached for quick reference

---

#### Story 6.5: Create Dictionary Skills

As a prompt engineer,
I want skills that help me work with data dictionaries,
so that I can find fields and validate schemas efficiently.

**Acceptance Criteria**:

1. `find-fields.md` skill searches dictionaries for matching fields
2. `validate-schema.md` skill checks schema fields exist in dictionary
3. `suggest-mappings.md` skill recommends field mappings based on names/types
4. Skills load dictionary data from `/poem/schemas/dictionaries/`
5. Skills provide helpful output with field details
6. Skills handle multiple dictionaries if present

---

### Epic 7: Mock/Test Data Agent & Level 2 Mock Data

**Goal**: Build the fourth agent with workflows for sophisticated mock data generation, including entity relationships and domain-specific scenarios.

---

#### Story 7.1: Create Mock/Test Data Agent Definition

As a user,
I want a Mock/Test Data Agent that generates realistic test data,
so that I can test prompts with production-like scenarios.

**Acceptance Criteria**:

1. Agent definition in `.poem-core/agents/mock-data-agent.md`
2. Agent follows BMAD agent structure
3. Persona defined: data-focused, testing-oriented
4. Commands listed: `*generate-mock`, `*create-scenario`, `*curate-library`, `*help`
5. Activation via `/poem/agents/mock-data-agent` slash command
6. Agent understands schema patterns and data generation strategies

---

#### Story 7.2: Implement Level 1 Mock Data Generation

As a prompt engineer,
I want to generate basic mock data from schemas,
so that I can test prompts without external dependencies.

**Acceptance Criteria**:

1. Workflow uses faker.js for data generation
2. String fields generate appropriate content based on field name hints
3. Number fields generate within reasonable ranges
4. Boolean fields generate true/false randomly
5. Array fields generate configurable number of items
6. Nested objects maintain structure from schema
7. Generated data saved to `/poem/mock-data/`

---

#### Story 7.3: Implement Level 2 Mock Data Generation

As a prompt engineer,
I want realistic mock data based on provider dictionaries,
so that test data matches production patterns.

**Acceptance Criteria**:

1. Workflow reads field metadata from provider dictionaries
2. Field constraints (min/max, enum values, patterns) respected
3. Related fields maintain consistency (e.g., dates in sequence)
4. Domain-specific patterns applied (e.g., NDIS incident formats)
5. Entity relationships maintained across mock records
6. LLM-generated content option for realistic prose fields
7. Generation seed configurable for reproducible tests

---

#### Story 7.4: Implement Scenario Library Workflow

As a prompt engineer,
I want to create and curate test scenario libraries,
so that edge cases and specific patterns are available for testing.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/create-scenario.yaml`
2. User describes scenario (e.g., "long title that exceeds limit")
3. Agent generates mock data matching scenario description
4. Scenarios saved to `/poem/mock-data/scenarios/` with names
5. Scenarios can be tagged and categorized
6. Scenario library searchable by tag/description
7. Scenarios can be combined for complex test cases

---

#### Story 7.5: Implement Batch Mock Data Generation

As a prompt engineer,
I want to generate multiple mock data variations at once,
so that I can test prompts across many scenarios efficiently.

**Acceptance Criteria**:

1. Batch generation creates N variations from single schema
2. Variations include edge cases: empty strings, long text, special characters
3. Batch results saved as array or individual files
4. Summary report shows: variations generated, edge cases included
5. Batch can target specific fields for variation
6. Performance: generate 100 variations in under 10 seconds
7. Batch results usable for automated testing pipelines

---

## Checklist Results Report

### Executive Summary

| Metric                               | Assessment                                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Overall PRD Completeness**         | 92%                                                                                      |
| **MVP Scope Appropriateness**        | Just Right                                                                               |
| **Readiness for Architecture Phase** | Ready                                                                                    |
| **Most Critical Gaps**               | Security/compliance details minimal (acceptable for local-only tool); No visual diagrams |

### Category Analysis Table

| Category                         | Status      | Critical Issues                                                         |
| -------------------------------- | ----------- | ----------------------------------------------------------------------- |
| 1. Problem Definition & Context  | **PASS**    | None - Clear problem, quantified impact, differentiation documented     |
| 2. MVP Scope Definition          | **PASS**    | None - Well-defined boundaries, Epic 7 clearly marked post-MVP          |
| 3. User Experience Requirements  | **PARTIAL** | No visual UI (intentionally skipped - conversation-first product)       |
| 4. Functional Requirements       | **PASS**    | None - 25 FRs grouped by agent workflows, infrastructure, cross-cutting |
| 5. Non-Functional Requirements   | **PASS**    | None - 12 NFRs with specific performance targets                        |
| 6. Epic & Story Structure        | **PASS**    | None - 7 Epics, 40 Stories, clear sequencing                            |
| 7. Technical Guidance            | **PASS**    | None - Detailed tech stack, architecture decisions documented           |
| 8. Cross-Functional Requirements | **PARTIAL** | Provider integrations identified but implementations deferred           |
| 9. Clarity & Communication       | **PASS**    | None - Consistent terminology, well-structured                          |

### Top Issues by Priority

**BLOCKERS**: None identified

**HIGH Priority**: None

**MEDIUM Priority**:

1. Data dictionary format not fully specified (will emerge during Epic 6)
2. Provider contract interface details deferred to implementation
3. No visual architecture diagram (text descriptions sufficient for now)

**LOW Priority**:

1. Could add explicit test data examples for acceptance criteria
2. Changelog only has initial entry (expected at this stage)
3. No competitor analysis section (POEM is novel category)

### MVP Scope Assessment

**Features That Might Be Cut**:

- Epic 7 (Mock/Test Data Agent Level 2) is already marked post-MVP
- Story 4.8 (Platform Constraint Validation) could be simplified to manual checks initially
- Story 7.3-7.5 (Level 2 mock data features) already deferred

**Missing Features That Are Essential**: None identified - core MVP is complete

**Complexity Concerns**:

- Epic 4 (YouTube workflow validation) is largest epic (8 stories) - appropriate for system validation
- Handlebars hot-reload (Story 2.4) may have edge cases - acceptable technical risk

**Timeline Realism**:

- 40 stories across 7 epics is substantial but sequenced appropriately
- Solo developer with AI assistance (BMAD) makes this achievable
- Epics are independent enough for parallel work where possible

### Technical Readiness

**Clarity of Technical Constraints**: All major constraints documented (monorepo, tech stack, file-based storage, cross-platform)

**Identified Technical Risks**:

1. Handlebars helper hot-reload implementation complexity
2. Schema extraction from complex Handlebars patterns (mitigated by Epic 4 validation)
3. Provider pattern generalization (mitigated by mock provider first)

**Areas Needing Architect Investigation**:

1. Exact Handlebars AST parsing approach for schema extraction
2. Workflow-data persistence format for chain pause/resume
3. Cross-platform process management for server commands

### Recommendations

1. **Proceed to Architecture Phase** - PRD is comprehensive and ready
2. **Consider sharding PRD** if document becomes unwieldy (currently manageable)
3. **Add architecture diagram** during Architecture phase (not PRD responsibility)
4. **Document provider contract** formally during Epic 5 implementation

### Final Decision

**READY FOR ARCHITECT**: The PRD and epics are comprehensive, properly structured, and ready for architectural design.

---

## Next Steps

### UX Expert Prompt

> **Note**: POEM is a conversation-first product with no visual UI in MVP scope. UX Expert involvement is **optional** and would focus on conversation flow design, not visual interfaces.

If UX guidance is desired:

```
Review the POEM PRD (docs/prd.md) focusing on:
1. Agent conversation flows - How should agents greet users, present options, handle errors?
2. Workflow step transitions - What feedback should users receive between workflow steps?
3. Output formatting - How should rendered prompts, schemas, and validation results display in the conversation stream?
4. Error messaging - What tone and structure for error messages and warnings?

POEM is a CLI/conversation-first tool with no visual UI planned for MVP.
```

### Architect Prompt

```
Review the POEM PRD (docs/prd.md) and create the Architecture document.

Key areas requiring architectural decisions:
1. Monorepo structure - packages/poem-core/ and packages/poem-app/ organization
2. Astro server configuration - API endpoint patterns, Handlebars service integration
3. Schema extraction approach - Handlebars AST parsing strategy for placeholder extraction
4. Provider pattern - Abstract contract interface design for external system integration
5. Workflow-data persistence - Format and location for chain pause/resume state
6. Hot-reload mechanism - File watching and helper re-registration approach
7. Cross-platform considerations - Server process management for start/stop commands

Reference documents:
- Project Brief: docs/brief.md
- Planning overview: docs/planning/poem-requirements.md
- YouTube workflow spec: docs/planning/exploration/youtube-launch-optimizer-workflow-spec.md
- Example data: data/youtube-launch-optimizer/, data/supportsignal/, data/storyline/

Technical constraints confirmed:
- Astro (latest version) with TypeScript
- Handlebars.js with eager loading + hot-reload
- Faker.js for mock data
- File-based storage (no database)
- Simple JSON for schemas initially
```
