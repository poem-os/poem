---
generated: 2026-04-03
generator: system-context
status: snapshot
sources:
  - CLAUDE.md
  - package.json
  - packages/poem-app/src/services/
  - packages/poem-core/poem-core-config.yaml
  - data/youtube-launch-optimizer/
  - docs/prd.md
  - docs/architecture.md
regenerate: "Run /system-context in the repo root"
---

# POEM — System Context

## Purpose
Framework for systematically creating, testing, and deploying AI prompts — with JSON schemas for type safety, Handlebars templates for reuse, mock data generation for testing without production access, and prompt chaining for multi-step workflows.

## Domain Concepts
- **Prompt Template** — A Handlebars `.hbs` file defining an AI prompt with placeholder variables. The atomic unit of POEM — everything else exists to support creating, validating, and running these.
- **Schema** — A JSON Schema defining the expected input/output contract for a prompt template. Drives mock data generation and validation.
- **Workflow** — A named collection of prompts, schemas, and mock data organized under a single domain (e.g., `youtube-launch-optimizer`). Each workflow is isolated with its own directory tree and can reference external knowledge sources.
- **Chain** — A multi-step prompt execution sequence where each step's output feeds into the next step's input via field mapping. Defined in YAML, supports pause/resume.
- **Mock Data** — Faker-generated test data conforming to a schema, enabling prompt testing without production data or real API calls. This is the "killer feature."

## Design Decisions
- **Two operating modes**: Development (`POEM_DEV=true`) uses `dev-workspace/`; production uses `poem/` in the consuming project. The config service is the single source of truth for path resolution — tasks must NOT hardcode paths.
- **Installable framework**: Installs into other projects via `npx poem-os install`, placing `.poem-core/` and `.poem-app/` in the target. `.poem-preserve` protects user content during reinstall.
- **Multi-workflow isolation**: Each workflow has its own prompts, schemas, and mock data. `currentWorkflow` in config determines the active context. Workflows declare external reference material paths with priority-based conflict resolution.
- **POEM does NOT call LLMs**: It renders prompt templates and generates mock data. The actual AI calls happen in the consuming application. This keeps POEM a pure tooling layer.
- **Server must start from monorepo root**: The root `npm run server` script uses npm workspaces for correct relative path resolution. Starting from `packages/poem-app/` directly breaks path resolution.

## Scope Limits
- Does NOT call LLM APIs — renders templates and generates mock data only.
- Does NOT have a GUI for prompt editing — interaction is through Claude Code slash commands and the REST API.
- Does NOT manage auth, billing, or multi-tenancy — local development tool and framework.
- `.bmad-core/` is part of the BMAD Method framework, not POEM — do not modify; updated via `npx bmad-method install`.
- `data/` contains example/reference data only — not used at runtime by the POEM server.
