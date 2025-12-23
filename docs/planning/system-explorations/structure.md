# POEM System Structure

**Extracted from**: current-thinking-prompt-os.md
**Last Updated**: 2025-11-20
**Status**: Architecture definition

---

## Three-Part System

### 1. `.poem-core/` - The Operating System (installed once)

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

---

### 2. `.poem-app/` - Astro Application Infrastructure

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

---

### 3. `/poem/` - Angela's Workspace

```
/poem/
├── prompts/                   # .hbs prompts
├── schemas/                   # JSON schemas
├── mappings/                  # Data mappings
└── mock-data/                 # Mock data library (NEW)
    ├── participants.json      # Persistent mock entities
    ├── support-workers.json
    ├── locations.json
    ├── incidents/             # Pre-generated scenarios
    └── workflows/             # Multi-step workflow scenarios
```

**Notes**:

- No `handlebars/helpers/` here - those live in `.poem-app/src/services/handlebars/helpers/`
- `mock-data/` is new top-level folder for Level 2 mock data ecosystem
- See [mock-data.md](./mock-data.md) for complete mock data architecture

---

## System Architecture Diagram

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
│  │  ├── /api/handlebars/helpers/create                 │  │
│  │  └── /api/providers/[name]/...                      │  │
│  │                                                       │  │
│  │  Services:                                           │  │
│  │  └── handlebars/                                     │  │
│  │      ├── engine.ts                                   │  │
│  │      └── helpers/     (CODE: fullName.js, etc.)     │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Angela's Workspace                         │
│                      (/poem/)                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ prompts/                                              │  │
│  │  ├── support-ticket-classifier.hbs                   │  │
│  │  ├── incident-analysis.hbs                           │  │
│  │  └── ...                                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ schemas/                                              │  │
│  │  ├── support-ticket.json                             │  │
│  │  ├── incident.json                                   │  │
│  │  └── ...                                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ mappings/                                             │  │
│  │  ├── convex-to-ticket.json                           │  │
│  │  └── ...                                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

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
  port: 4321 # Configurable per project
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

**See also**:

- [agents.md](./agents.md) - Agent definitions and capabilities
- [workflows.md](./workflows.md) - Core workflow patterns
- [skills.md](./skills.md) - Individual skill specifications
- [naming.md](./naming.md) - Naming decisions and rationale
