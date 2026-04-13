---
generated: 2026-04-13
generator: system-context
status: snapshot
sources:
  - CLAUDE.md
  - package.json
  - CHANGELOG.md
  - packages/poem-core/poem-core-config.yaml
  - packages/poem-core/tasks/README.md
  - packages/poem-core/tasks/new-prompt.yaml
  - packages/poem-app/src/services/config/poem-config.ts
  - packages/poem-app/src/services/chain/executor.ts
  - packages/poem-app/src/services/chain/types.ts
  - packages/poem-app/src/services/handlebars/index.ts
  - packages/poem-app/src/services/mock-generator/index.ts
  - packages/poem-app/src/services/schema/extractor.ts
  - packages/poem-app/src/pages/api/prompt/render.ts
  - packages/poem-app/src/pages/api/chain/execute.ts
  - docs/guides/workflow-validation-guide.md
  - context.globs.json
regenerate: "Run /system-context in the repo root"
---

# POEM — System Context

**System context**: See [CONTEXT.md](CONTEXT.md) for purpose, core abstractions, key workflows, design decisions, non-obvious constraints, expert mental model, scope limits, and failure modes.

## Purpose
A prompt engineering framework that lets developers create type-safe, testable AI prompts — with Handlebars templates, JSON schemas, and Faker-generated mock data — so prompts can be built and validated without requiring real LLM calls or production data.

## Core Abstractions
- **Prompt Template** — A Handlebars `.hbs` file defining an AI prompt with placeholder variables. The atomic unit — everything else exists to create, validate, and run these. Templates are stored per-workflow in `dev-workspace/workflows/{name}/prompts/`.
- **Schema** — A JSON Schema defining the expected input/output contract for a prompt template. Drives mock data generation and validation. Can be auto-extracted from a template by parsing its `{{variable}}` and `#each` blocks.
- **Workflow** — A named collection of prompts, schemas, and mock data organised under a single domain (e.g., `youtube-launch-optimizer`). Each workflow is isolated with its own directory tree and can declare external reference sources (local data dirs, second-brain knowledge bases) with priority-based conflict resolution.
- **Chain** — A multi-step prompt execution sequence defined in YAML where each step's `outputs` feed into subsequent steps' `inputs` via field mapping. Supports pause/resume via persisted `workflow-state`. Chain steps accumulate data — later steps have access to all prior steps' outputs.
- **Mock Data** — Faker.js-generated records conforming to a schema, enabling prompt testing without production data or real LLM API calls. This is the system's "killer feature" — it decouples prompt development from production dependencies.

The abstractions compose in one direction: a Workflow contains Prompt Templates, each Template has a Schema, each Schema enables Mock Data generation, and Chains sequence Templates together.

## Key Workflows

### Create a new prompt end-to-end
1. Activate Penny agent: `/poem/agents/penny` then `*new`
2. Penny elicits the prompt's purpose, input fields, and desired output via guided questions
3. Penny writes a `.hbs` file to `dev-workspace/workflows/{currentWorkflow}/prompts/`
4. Schema is auto-extracted from the template's `{{variables}}` and `#each` blocks via `POST /api/schema/extract`
5. Optionally generate mock data via `POST /api/mock/generate` using the schema
6. Live-preview the rendered template with mock data via `POST /api/prompt/render`
7. Outcome: a tested prompt file with schema and sample data, ready for the consuming app

### Test a prompt without LLM calls
1. Load or generate mock data matching the prompt's schema (via `POST /api/mock/generate`)
2. Call `POST /api/prompt/render` with the template name and mock data as `{ template, data }`
3. The server renders the Handlebars template and returns the fully expanded prompt text
4. Inspect warnings for any missing data fields that rendered as empty strings
5. Outcome: validated prompt output at zero API cost and in milliseconds

### Execute a multi-step chain
1. Define a chain YAML file with named steps, each declaring `inputs`, `outputs`, and optional `mapper` for field renaming
2. Call `POST /api/chain/execute` with the chain definition and `initialData`
3. The Chain Executor runs steps sequentially, accumulating all outputs into `WorkflowData`
4. State is persisted to `workflow-state/` after each step — set `pauseAfterStep` to inspect mid-run
5. Resume a paused chain by passing the `workflowId` and `resume: true`
6. Outcome: a completed multi-step prompt pipeline with all intermediate and final outputs preserved

### Install POEM into a consuming project
1. Run `npx poem-os install` from the target project root
2. Installer places `.poem-core/` (tasks, agent definitions) and `.poem-app/` (Astro runtime) in the project
3. Existing user content (prompts, schemas, mock-data) under `poem/` is protected by `.poem-preserve`
4. Start the runtime: `npm run server` (from project root — not from a sub-package)
5. Verify: `curl http://localhost:9500/api/health`
6. Outcome: POEM is running in production mode, reading from `poem/` instead of `dev-workspace/`

## Design Decisions
- **POEM does NOT call LLMs**: It renders templates and generates mock data only. Actual AI calls happen in the consuming application. This keeps POEM a pure tooling layer with no API keys, billing, or provider lock-in required during prompt development.
  - *Alternative considered*: Bundle an LLM proxy so prompts could be "run" directly
  - *Why rejected*: Adds auth complexity, cost uncertainty, and network dependency to a local dev tool — contradicts the goal of testability without production access
- **Two operating modes (dev vs production)**: `POEM_DEV=true` uses `dev-workspace/`; unset uses `poem/` in the consuming project. The config service at `poem-config.ts` is the single source of truth for all path resolution — tasks and workflows inherit from it and must not hardcode paths.
  - *Alternative considered*: Single mode, always reads from `poem/`
  - *Why rejected*: Would pollute POEM's own source tree with user-generated content during framework development
- **Astro as the server runtime**: The REST API server is built on Astro (with `pages/api/` routes) rather than a plain Express/Fastify server.
  - *Alternative considered*: Express or Fastify with explicit route files
  - *Why rejected*: Astro's file-based routing provides structure without boilerplate; allows future UI pages alongside API routes in the same server
- **Multi-workflow isolation**: Each workflow has its own prompts, schemas, mock-data, and workflow-state directories. `currentWorkflow` in config determines the active context. Workflows declare external reference material paths with priority-based conflict resolution.
  - *Alternative considered*: Single flat directory for all prompts/schemas across workflows
  - *Why rejected*: Flat structure conflates prompts from different domains (YouTube vs SupportSignal vs Storyline), making it impossible to switch context cleanly
- **Server must start from monorepo root**: The root `npm run server` script uses npm workspaces with relative path resolution. Starting from `packages/poem-app/` directly breaks the path resolution because the Astro dev server resolves config file paths relative to its working directory.
  - *Alternative considered*: Make the server work from any directory using absolute paths
  - *Why rejected*: Adds complexity to path resolution; the monorepo root convention is already enforced by the npm workspace setup

## Non-obvious Constraints
- **Starting the server from `packages/poem-app/` silently breaks path resolution**: The server starts without errors, but all config file reads fail because relative paths in `poem-core-config.yaml` resolve against the wrong directory. Always `cd` to the monorepo root and run `npm run server`.
- **Integration tests require a running server at port 9500**: Unlike unit tests, integration tests call live HTTP endpoints. Running `npm run test:integration` without a running server produces connection-refused errors that look like test failures, not setup failures.
- **Missing Handlebars variables render as empty string, not an error**: If a template uses `{{someField}}` but `someField` is absent from the data object, Handlebars silently renders it as `""`. The render API returns warnings, but the response is still `success: true`. Silent data gaps are the most common source of incorrect prompts.
- **`data/` is reference material, not runtime input**: The `data/youtube-launch-optimizer/`, `data/supportsignal/`, and `data/storyline/` directories are example and documentation data — they are not read by the POEM server at runtime. At runtime, the server reads from `dev-workspace/` (dev) or `poem/` (production).
- **`gitleaks` must be installed globally before the first commit**: The Husky pre-commit hook runs `gitleaks detect` to scan for secrets. If gitleaks is not installed (`brew install gitleaks`), every commit attempt fails with a command-not-found error — not an obvious cause.
- **Chain field mapping is positional by name, not by order**: A chain step's `outputs` array defines what field names get written to `WorkflowData`. If the next step's `inputs` names don't match exactly (including case), those fields arrive as `undefined`. The mapper (`mapper: { targetField: sourceField }`) can rename fields but is optional — missing it when names differ causes silent data loss mid-chain.

## Expert Mental Model
- **Think of POEM as a "prompt compiler", not a "prompt runner"**: POEM prepares and validates prompts; the consuming application submits them to an LLM. This means the entire value of POEM is in the quality and testability of the output text — the workflow is: write template → define schema → generate mock data → inspect rendered output → iterate. Trying to use POEM as an LLM proxy inverts this mental model.
- **The active workflow is a context switch, not just a path**: Changing `currentWorkflow` in `poem-core-config.yaml` changes which prompts, schemas, and reference materials Penny and Victor operate against. Fluent practitioners treat workflow switching the way they treat git branch switching — a deliberate context change before starting work, not an incidental config detail.
- **Schema extraction is bottom-up, not top-down**: A newcomer assumes schemas are written first and templates are generated from them. The expert understands that POEM's schema extractor parses `{{variables}}` from existing Handlebars templates to auto-generate schemas. The template IS the specification — the schema is derived, not defined first.
- **Assembly prompts break the "POEM doesn't call LLMs" framing in a useful way**: Some prompts (marked `type: assembly`, `skipLLM: true`) are pure Handlebars renders with no LLM call at all — they assemble pre-generated components into formatted output. Recognising which prompts in a chain need LLM calls versus which are pure assembly is the difference between a $0.01/run workflow and a $0.00001/run workflow.

## Scope Limits
- Does NOT call LLM APIs — renders Handlebars templates and generates Faker mock data only. Actual AI inference happens in the consuming application after POEM produces the prompt text.
- Does NOT provide a graphical UI for prompt editing — interaction is via Claude Code slash commands (Penny agent) and the REST API. The Astro server serves API routes, not a browser app.
- Does NOT manage auth, billing, rate limits, or multi-tenancy — it is a local development framework with a single-user localhost server.
- Does NOT own `.bmad-core/` — that directory is part of the BMAD Method framework installed separately via `npx bmad-method install`. Never modify BMAD files; they are framework infrastructure.
- Does NOT use `data/` at runtime — the example datasets in `data/supportsignal/`, `data/storyline/`, and `data/youtube-launch-optimizer/` are reference material for humans and agents, not inputs to the server.

## Failure Modes
- **Server starts but all file operations return 404 or "not found"**: Caused by starting the server from `packages/poem-app/` instead of the monorepo root. All config-relative paths resolve incorrectly. Fix: stop the server, `cd` to the monorepo root, run `npm run server`.
- **Integration tests show connection-refused errors**: The POEM server is not running on port 9500. Unit tests pass but integration tests fail. Fix: check `curl http://localhost:9500/api/health`; if it fails, start the server first.
- **Template renders with unexpected empty sections**: A `{{variable}}` in the template has no matching key in the data object. The render API returns `success: true` with `warnings` listing the missing fields. Fix: inspect `response.warnings`; add missing fields to the data object or mock data.
- **Chain step receives empty inputs mid-execution**: A prior step's output field name doesn't match the current step's input field name (or the mapper is missing/misconfigured). Data is silently dropped rather than causing an error. Fix: check the chain YAML — every step's `outputs` must match the next step's `inputs` exactly, or a `mapper` must bridge the difference.
- **Pre-commit hook fails with "gitleaks: command not found"**: gitleaks is not installed globally. Fix: `brew install gitleaks` (macOS) or see the gitleaks GitHub releases page for other platforms.
- **Reinstall wipes user prompt files**: `npx poem-os install` without a `.poem-preserve` file in `poem/` will overwrite user content. Fix: create `.poem-preserve` in the `poem/` directory listing paths to protect before running reinstall.
