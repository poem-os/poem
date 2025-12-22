# Technical Assumptions

## Repository Structure: Monorepo

POEM uses a monorepo structure for development:
```
poem-os/poem/
├── packages/
│   ├── poem-core/    → Becomes .poem-core/ when installed
│   └── poem-app/     → Becomes .poem-app/ when installed
└── package.json      → Published as 'poem-os' on NPM
```

**Rationale**: Single repository simplifies versioning, testing, and release coordination between framework (poem-core) and runtime (poem-app). NPM package name `poem-os` is available and aligns with "Operating System" positioning.

## Service Architecture: Hybrid (Document Framework + Local Runtime)

POEM is a **Framework/Operating System** (like BMAD), not a traditional web application:
- **95% Document-Based**: Agents (YAML + Markdown), workflows (YAML), templates (Handlebars), schemas (JSON), skills (Markdown)
- **5% Runtime Tool**: `.poem-app/` Astro server providing Handlebars engine, API endpoints, and provider integrations

**Rationale**: This mirrors BMAD's proven architecture. Most development involves creating documents (prompts, workflows, schemas), not traditional software code. The Astro runtime exists solely to provide heavy lifting that can't be done in conversation (template compilation, helper execution, API calls).

## Testing Requirements: Unit + Integration

- **Unit Tests**: Core functions (schema extraction, template validation, mock data generation)
- **Integration Tests**: API endpoints, provider pattern, Handlebars engine
- **Manual Testing**: Agent workflows, skill execution (via Claude Code conversation)
- **No E2E Tests**: POEM is a framework, not a deployed web app

**Rationale**: Testing focuses on the runtime components (`.poem-app/`) since document-based components (agents, workflows) are validated through usage. Manual testing via Claude Code conversation is appropriate for agent interactions.

## Additional Technical Assumptions and Requests

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
