# Unified Project Structure

POEM uses a monorepo structure for development, which transforms into installed directories in user projects.

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
│   │   ├── workflows/
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

After running `npx poem-os install`:

```
user-project/
├── .poem-core/                       # Framework (from packages/poem-core/)
│   ├── agents/
│   ├── workflows/
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
├── poem/                             # User workspace (created by installer)
│   ├── prompts/
│   ├── schemas/
│   │   └── dictionaries/
│   ├── mock-data/
│   │   └── scenarios/
│   ├── workflow-data/
│   └── config/
│       ├── providers/
│       └── poem.yaml
│
└── [existing project files]
```

## Key Directories Explained

| Directory | Purpose | Modifiable by User |
|-----------|---------|-------------------|
| `.poem-core/` | Framework documents (agents, workflows, skills) | No (reinstall to update) |
| `.poem-app/` | Runtime server code | No (except helpers/) |
| `.poem-app/src/services/handlebars/helpers/` | Custom helpers | **Yes** (generated by System Agent) |
| `/poem/` | User workspace | **Yes** (all user content) |
| `.claude/commands/poem/` | Slash command wrappers | No |

---
