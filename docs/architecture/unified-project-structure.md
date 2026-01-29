# Unified Project Structure

POEM uses a monorepo structure for development, which transforms into installed directories in user projects.

## For BMAD Development

**CRITICAL FOR STORY IMPLEMENTATION:**

When implementing stories, ALL development work happens in the **Development Repository Structure** below:
- Modify files in `packages/poem-core/` and `packages/poem-app/`
- Reference `packages/` paths in Dev Notes and story files
- Create new files in `packages/` directories
- The `dev-workspace/` directory (when `POEM_DEV=true`) is for testing user workflows, not source code

The **Installed Structure** is for reference only—it shows what users see after running `npx poem-os install`.

**Path Examples for Story Implementation:**
- ✅ Correct: `packages/poem-app/src/services/config/index.ts`
- ✅ Correct: `packages/poem-core/agents/prompt-engineer.md`
- ✅ Correct: `packages/poem-app/tests/services/config.test.ts`
- ❌ Wrong: `.poem-app/src/services/config/index.ts` (installed path, not dev path)
- ❌ Wrong: `.poem-core/agents/prompt-engineer.md` (installed path, not dev path)

**Dev Workspace vs Source Code:**
- `packages/` = Source code (version controlled, stories modify these)
- `dev-workspace/` = Transient testing workspace (gitignored, for testing POEM features)

---

## Development Repository Structure

```
poem-os/poem/
├── .github/                          # CI/CD workflows (phased)
│   └── workflows/
│       ├── ci.yaml                   # Phase 1-3: validation
│       └── publish.yaml              # Phase 4: NPM publish
│
├── packages/
│   ├── poem-core/                    # → Becomes .poem-core/ when installed
│   │   ├── agents/
│   │   │   ├── prompt-engineer.md
│   │   │   ├── system-agent.md
│   │   │   ├── integration-agent.md
│   │   │   └── mock-data-agent.md
│   │   │
│   │   ├── tasks/
│   │   │   ├── new-prompt.yaml
│   │   │   ├── refine-prompt.yaml
│   │   │   ├── test-prompt.yaml
│   │   │   ├── validate-prompt.yaml
│   │   │   ├── deploy-prompt.yaml
│   │   │   ├── add-helper.yaml
│   │   │   └── create-provider.yaml
│   │   │
│   │   ├── skills/
│   │   │   ├── check-my-prompt.md
│   │   │   ├── preview-with-data.md
│   │   │   ├── generate-schema.md
│   │   │   ├── find-fields.md
│   │   │   ├── validate-schema.md
│   │   │   ├── suggest-mappings.md
│   │   │   ├── pull-dictionary.md
│   │   │   ├── publish-prompt.md
│   │   │   └── README.md
│   │   │
│   │   ├── templates/
│   │   │   ├── prompt-template.hbs
│   │   │   └── schema-template.json
│   │   │
│   │   ├── data/
│   │   │   ├── poem-principles.md
│   │   │   ├── prompt-best-practices.md
│   │   │   └── helper-patterns.md
│   │   │
│   │   ├── core-config.yaml
│   │   └── package.json
│   │
│   └── poem-app/                     # → Becomes .poem-app/ when installed
│       ├── src/
│       │   ├── pages/
│       │   │   └── api/
│       │   │       ├── health.ts
│       │   │       ├── prompt/
│       │   │       │   └── render.ts
│       │   │       ├── schema/
│       │   │       │   ├── extract.ts
│       │   │       │   └── validate.ts
│       │   │       ├── mock/
│       │   │       │   └── generate.ts
│       │   │       ├── helpers/
│       │   │       │   ├── index.ts
│       │   │       │   └── test.ts
│       │   │       └── providers/
│       │   │           ├── _base.ts
│       │   │           ├── mock/
│       │   │           └── [name]/
│       │   │
│       │   ├── services/
│       │   │   ├── handlebars/
│       │   │   │   ├── index.ts
│       │   │   │   ├── helpers/
│       │   │   │   │   ├── titleCase.js
│       │   │   │   │   ├── truncate.js
│       │   │   │   │   ├── gt.js
│       │   │   │   │   ├── join.js
│       │   │   │   │   ├── formatTimestamp.js
│       │   │   │   │   └── README.md
│       │   │   │   └── watcher.ts
│       │   │   │
│       │   │   ├── mock-generator/
│       │   │   │   ├── index.ts
│       │   │   │   └── type-mappers.ts
│       │   │   │
│       │   │   └── schema/
│       │   │       ├── extractor.ts
│       │   │       └── validator.ts
│       │   │
│       │   ├── config/
│       │   │   └── index.ts
│       │   │
│       │   └── env.d.ts
│       │
│       ├── tests/
│       │   ├── services/
│       │   │   ├── handlebars.test.ts
│       │   │   ├── mock-generator.test.ts
│       │   │   └── schema-extractor.test.ts
│       │   └── api/
│       │       ├── render.test.ts
│       │       └── mock.test.ts
│       │
│       ├── astro.config.mjs
│       ├── tailwind.config.mjs
│       ├── tsconfig.json
│       └── package.json
│
├── bin/
│   └── install.js                    # NPX installer script
│
├── docs/
│   ├── prd.md
│   ├── architecture.md               # This document
│   └── planning/
│
├── data/                             # Example data for development
│   ├── supportsignal/
│   ├── storyline/
│   └── youtube-launch-optimizer/
│
├── .claude/
│   └── commands/
│       └── poem/
│           └── agents/
│
├── package.json                      # Root package.json (workspaces)
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── .secretlintrc.json               # Secret detection config
├── .gitignore
├── CLAUDE.md
└── README.md
```

## Installed Structure (User Project)

After running `npx poem-os install` (bare installation):

```
user-project/
├── .poem-core/                       # Framework (from packages/poem-core/)
│   ├── agents/
│   ├── tasks/
│   ├── skills/
│   ├── templates/
│   ├── data/
│   └── core-config.yaml
│
├── .poem-app/                        # Runtime (from packages/poem-app/)
│   ├── src/
│   ├── tests/
│   ├── astro.config.mjs
│   ├── package.json
│   └── ...
│
├── .claude/
│   └── commands/
│       └── poem/
│           └── agents/
│
└── [existing project files]
```

**Note (Story 1.10)**: User workspace (`poem/`) is NOT created during bare installation. Use `poem-os init` to create workspace, then `poem-os add-workflow <name>` to create workflow-specific folders.

### Two-Tier Workspace Architecture

After running `poem-os init`:

```
user-project/
├── poem/                             # User workspace (created on-demand)
│   ├── config/                       # Root: Global POEM settings
│   │   └── poem.yaml                 # Workflow definitions
│   └── shared/                       # Root: Cross-workflow resources
│       ├── prompts/                  # Shared prompt templates
│       └── schemas/                  # Shared schemas
```

After running `poem-os add-workflow youtube-launch`:

```
user-project/
├── poem/
│   ├── config/
│   │   └── poem.yaml                 # Updated with workflow definition
│   ├── shared/
│   │   ├── prompts/
│   │   └── schemas/
│   └── workflows/                    # Workflow-specific folders
│       └── youtube-launch/
│           ├── prompts/              # Workflow prompts
│           ├── schemas/              # Workflow schemas
│           ├── mock-data/            # Test data
│           └── workflow-state/       # Execution state (renamed from workflow-data)
```

## Key Directories Explained

| Directory                                    | Purpose                                         | Modifiable by User                  |
| -------------------------------------------- | ----------------------------------------------- | ----------------------------------- |
| `.poem-core/`                                | Framework documents (agents, tasks, skills) | No (reinstall to update)            |
| `.poem-app/`                                 | Runtime server code                             | No (except helpers/)                |
| `.poem-app/src/services/handlebars/helpers/` | Custom helpers                                  | **Yes** (generated by System Agent) |
| `/poem/`                                     | User workspace                                  | **Yes** (all user content)          |
| `.claude/commands/poem/`                     | Slash command wrappers                          | No                                  |

## poem.yaml Configuration Schema

The `poem/config/poem.yaml` file stores POEM configuration and workflow definitions.

**Location**: `poem/config/poem.yaml` (created by `poem-os init`)

**Schema** (v1.1):

```yaml
# POEM Configuration
version: 1.0

# Server Configuration (for port discovery by tools)
server:
  port: 9500  # 1024-65535, mirrors .env for tool discovery

# Central POEM Path (optional - for contributors/developers)
centralPoemPath: null  # absolute path or null

# Active workflow
currentWorkflow: null

# Workflow definitions
workflows:
  <workflow-name>:
    prompts: poem/workflows/<name>/prompts
    schemas: poem/workflows/<name>/schemas
    mockData: poem/workflows/<name>/mock-data
    workflowState: poem/workflows/<name>/workflow-state
```

**Field Descriptions**:

| Field | Type | Purpose | Source of Truth |
|-------|------|---------|-----------------|
| `version` | string | Schema version (currently 1.0) | Static |
| `server.port` | number | POEM server port (1024-65535) | **Mirrors** `.poem-app/.env` PORT value |
| `centralPoemPath` | string\|null | Absolute path to central POEM dev clone | User configuration OR convention (`~/dev/ad/poem-os/poem`) OR null |
| `currentWorkflow` | string\|null | Active workflow name | User workflow switching |
| `workflows` | object | Workflow folder definitions | Created by `poem-os add-workflow` |

**Port Sync Flow** (Story 1.11):
- `.poem-app/.env` → Source of truth (Astro reads `process.env.PORT`)
- `poem.yaml` → Mirror for tool discovery (CLIs, Victor, monitoring)
- Sync happens: During `poem-os init`, on server startup (auto), via `poem-os config set port`

**Central Path Resolution** (Story 1.11):
- Priority order:
  1. Environment variable `POEM_CENTRAL_PATH` (highest priority, machine-specific override)
  2. `poem.yaml` → `centralPoemPath` field (committed to version control)
  3. Convention: `~/dev/ad/poem-os/poem` (if exists)
  4. Null (local-only mode)
- **Why committed**: `poem.yaml` contains workflow definitions, so it must be version controlled
- **Multi-machine workaround**: Use `POEM_CENTRAL_PATH` env var to override per-machine

**Environment Variable Override**:
```bash
export POEM_CENTRAL_PATH=~/dev/ad/poem-os/poem  # Overrides poem.yaml value
```

---
