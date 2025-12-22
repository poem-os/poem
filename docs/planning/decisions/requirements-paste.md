# Section 2: Requirements

Now I'll draft the functional and non-functional requirements based on the Project Brief's MVP scope and system specifications.

## Functional Requirements

### Group 1: Agent-Guided Workflows (15 FRs)

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

### Group 2: Framework and Runtime Infrastructure (7 FRs)

**FR-FI-1**: POEM shall provide an NPX-based installation system (npx poem-os install) that copies .poem-core/ and .poem-app/ directories into the user's project and creates /poem/ workspace structure

**FR-FI-2**: POEM shall include four agents (Prompt Engineer, System Agent, Integration Agent, Mock/Test Data Agent) accessible via Claude Code slash commands, each with defined capabilities and workflows

**FR-FI-3**: POEM shall provide YAML-based workflow templates for approximately 15-20 common tasks across all agents (e.g., New Prompt, Refine Prompt, Deploy Prompt, Test Prompt, Add Helper, Create Provider)

**FR-FI-4**: POEM shall include 8 skills that provide autonomous capabilities: Check My Prompt, Preview with Example Data, Generate Placeholder Schema, Find Fields in Data Dictionary, Validate Schema Against Dictionary, Suggest Mappings, Pull Data Dictionary, Publish Prompt

**FR-RI-1**: POEM shall run a persistent Astro server on configurable port for template rendering API endpoints and provider integration

**FR-RI-2**: POEM shall provide a Handlebars template engine via .poem-app/ Astro server with helper registration, template compilation, and rendering capabilities

**FR-RI-3**: POEM shall support a provider pattern with abstract interfaces and configurable API endpoints in .poem-app/src/pages/api/providers/{name}/ to enable extensible external system integration

### Group 3: Cross-Cutting Capabilities (3 FRs)

**FR-CC-1**: POEM shall support multi-project usage where each project has its own .poem-core/, .poem-app/, and /poem/ workspace as independent instances

**FR-CC-2**: POEM shall work offline for core functionality (prompt creation, schema generation, mock data generation, template rendering, preview) without cloud dependencies

**FR-CC-3**: POEM shall maintain user workspace structure in /poem/ directory containing prompts (.hbs), schemas (JSON), and mappings using file-based storage with no database dependency

## Non-Functional Requirements

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

---

## Rationale

**Functional Requirements Organization:**
- **Group 1 (15 FRs)**: Agent-guided workflows represent POEM's core value proposition—systematic, agent-driven prompt engineering vs ad-hoc text editing
- **Group 2 (7 FRs)**: Framework and runtime infrastructure provides the foundation that enables agent capabilities
- **Group 3 (3 FRs)**: Cross-cutting capabilities ensure system-wide consistency and usability

**Key Architectural Decisions Reflected:**
- **Four agents** (FR-FI-2): Prompt Engineer, System Agent, Integration Agent, Mock/Test Data Agent—each with distinct responsibilities
- **~15-20 workflows** (FR-FI-3): Not all workflows available from day 1; some unlock as infrastructure capabilities are built
- **8 skills** (FR-FI-4): Autonomous capabilities that bridge agents to infrastructure (some work pre-infrastructure via LLM simulation, others require Astro APIs)
- **Provider pattern** (FR-RI-3, FR-SA-2): Abstract interface allows System Agent to create concrete implementations; Integration Agent uses these to communicate with external systems
- **Two-level mock data** (FR-MD-1, FR-MD-2): Level 1 (fake) works standalone, Level 2 (realistic) requires provider integration

**Dependency Progression (Not Reflected in FRs, Documented Separately):**
- Phase 1: Agent 1 (Prompt Engineer) works standalone with .poem-core/ only
- Phase 2: Agent 2 (System Agent) creates Handlebars helpers, unlocking enhanced templating for Agent 1
- Phase 3: Agent 2 creates provider implementations, enabling Agent 3 (Integration Agent) workflows
- Phase 4: Agent 4 (Mock/Test Data) Level 2 capabilities enabled by provider access
- FRs describe *what's possible*, not *when it becomes possible*—that's for epic/story planning

**Non-Functional Requirements Assumptions:**
- Performance targets (NFR1-3) based on Project Brief's "Performance Targets" section
- Cross-platform (NFR5) from "Platform Requirements" in Technical Considerations
- Offline-first (NFR4) from "Must work offline" constraint—critical for independence and rapid iteration
- Data privacy (NFR8) critical for high-compliance target users (healthcare, legal, NDIS)
- 2-hour time-to-first-prompt (NFR9) from MVP Success Criteria
- File-based scaling (NFR7) acknowledges MVP uses no database
- BMAD v4 alignment (NFR12) ensures methodology consistency

**Trade-offs Made:**
- Grouped workflows by agent (not by feature) to emphasize agent-first experience
- Separated "fake" vs "realistic" mock data (FR-MD-1 vs FR-MD-2) to clarify phased capability
- Made provider pattern explicit (FR-RI-3, FR-SA-2) to emphasize extensibility architecture
- Included all 4 agents and 8 skills in FRs even though some are post-MVP—FRs describe full system capability, not MVP subset

**What's Explicitly Out of MVP Scope:**
- Level 2 mock data (entity relationships, realistic anonymization)—FR-MD-2 describes capability but marked for post-MVP implementation
- Multi-step pipeline orchestration (workflow chaining)
- Visual UI/dashboard (Astro pages beyond API endpoints)
- Version control integration (git workflows, diff views)
- Collaborative features (team sharing, permissions)
- Additional providers beyond initial SupportSignal/Storyline implementations

**Areas That Might Need Refinement:**
- FR-FI-3 says "approximately 15-20 workflows"—actual count will emerge during agent implementation
- FR-UC-3 mentions "10+ scenarios"—this is illustrative; actual test coverage will vary by use case
- Provider pattern (FR-RI-3) described abstractly; concrete implementations will be user/project-specific
- Skills (FR-FI-4) listed as 8 total, but some may work pre-infrastructure (via LLM simulation) vs post-infrastructure (via APIs)—this distinction is behavioral, not in FR itself

