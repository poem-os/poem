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

---
