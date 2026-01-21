# Next Steps

## UX Expert Prompt

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

## Architect Prompt

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
