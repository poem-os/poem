# Epic Capabilities

A capability-focused index for POEM. Use this document to answer:

- **"Can POEM do X?"** → Yes (here's where) / No, but planned / No, but here's how it could work
- **"How would X be implemented?"** → Links to epics, stories, planning docs
- **"What needs to change for X?"** → Which epics/stories to modify or create

**Related Documents:**
- [Epic List](./epic-list.md) — Epic summaries and status
- [Epic Details](./epic-details.md) — Full story breakdowns
- [Architecture](../architecture.md) — Technical design

**Status Legend:**
- ✅ **Available** — Implemented and working
- 🔜 **Coming Soon** — Story exists, not yet implemented
- 📅 **Planned** — In an epic, stories not yet drafted
- 💡 **Possible** — Not planned, but architecturally feasible

---

## POEM Core — Prompt Engineering & Workflows

Capabilities for prompt engineers working with templates, schemas, data, and workflows.

### Creating & Managing Prompts

| Capability | Status | Reference |
|------------|--------|-----------|
| Create new prompt template | ✅ Available | [Story 3.3](../stories/3.3.story.md) |
| List prompts in workspace | ✅ Available | [Story 3.3](../stories/3.3.story.md) — `*list` command |
| View prompt details | ✅ Available | [Story 3.3](../stories/3.3.story.md) — `*view` command |
| Edit existing prompt | ✅ Available | [Story 3.4](../stories/3.4.story.md) — `*edit` command |
| Delete prompt | ✅ Available | [Story 3.4](../stories/3.4.story.md) |
| Validate prompt syntax | ✅ Available | [Story 3.5](../stories/3.5.story.md) |
| Import prompts from external source | ✅ Available | [Story 4.1](../stories/4.1.story.md) |

**Not available:**
- Prompt versioning/history — 💡 Possible via git integration, not planned as POEM feature
- Prompt sharing/publishing — 💡 Possible, would need new Epic for prompt marketplace

### Schemas

| Capability | Status | Reference |
|------------|--------|-----------|
| Define input schema for prompt | ✅ Available | [Story 3.2](../stories/3.2.story.md) |
| Define output schema for prompt | ✅ Available | [Story 3.7](../stories/3.7.story.md) |
| Unified schema (input + output in one file) | ✅ Available | [Story 3.7.1](../stories/3.7.1.story.md) |
| Auto-extract schema from template | ✅ Available | [Story 4.2](../stories/4.2.story.md) |
| Validate data against schema | ✅ Available | [Story 3.2](../stories/3.2.story.md) |
| Auto-generate workflow schema from YAML | 🔜 Coming Soon | [Story 4.6.5](./epic-details.md#story-465-auto-generate-workflow-schema-from-yaml) |

**Not available:**
- Schema inheritance/composition — 💡 Possible, would extend schema service
- Import schema from OpenAPI/JSON Schema — 💡 Possible, conversion layer needed

### Mock Data Generation

| Capability | Status | Reference |
|------------|--------|-----------|
| Generate mock data from schema | ✅ Available | [Story 4.3](../stories/4.3.story.md) |
| YouTube-specific mock content | ✅ Available | [Story 4.3](../stories/4.3.story.md) |
| Reproducible generation (seeded) | ✅ Available | [Story 4.3](../stories/4.3.story.md) |
| Domain-specific generators | ✅ Available | YouTube implemented, extensible pattern |
| Generate from provider data dictionary | 📅 Planned | [Epic 8](./epic-list.md#epic-8-mocktest-data-agent--level-2-mock-data) |

**Not available:**
- AI-powered realistic mock data — 💡 Possible, would use LLM to generate contextual data
- Import real data as mock seed — 💡 Possible, would need data sanitization workflow

### Workflow Execution

| Capability | Status | Reference |
|------------|--------|-----------|
| Render single prompt with data | ✅ Available | [Story 4.5](../stories/4.5.story.md) |
| Chain prompts with data flow | ✅ Available | [Story 4.6](../stories/4.6.story.md) |
| Pause and resume workflow | ✅ Available | [Story 4.6](../stories/4.6.story.md) |
| Workflow data persistence | ✅ Available | [Story 4.6](../stories/4.6.story.md) |
| Field mapping between prompts | ✅ Available | [Story 4.6](../stories/4.6.story.md) |
| Human-in-the-loop checkpoints | 🔜 Coming Soon | [Story 4.7](./epic-details.md#story-47-human-in-the-loop-checkpoint) |
| Platform constraint validation | 🔜 Coming Soon | [Story 4.8](./epic-details.md#story-48-platform-constraint-validation) |

**Not available:**
- Conditional branching in workflows — 💡 Possible, extend chain definition format
- Parallel prompt execution — 💡 Possible, significant architecture change
- Workflow templates/reusable patterns — 💡 Possible, would need workflow template system

### Multi-Workflow Management

| Capability | Status | Reference |
|------------|--------|-----------|
| Multiple workflows in one workspace | ✅ Available | [Story 3.8](../stories/3.8.story.md) |
| Switch between workflows | ✅ Available | [Story 3.8](../stories/3.8.story.md) — `*switch` command |
| Workflow-scoped prompts/schemas | ✅ Available | [Story 3.8](../stories/3.8.story.md) |
| Reference materials per workflow | 🔜 Coming Soon | [Story 4.9](./epic-details.md#story-49-multi-workflow-polish--integration-phase-2) |
| Shared prompts across workflows | 🔜 Coming Soon | [Story 4.9](./epic-details.md#story-49-multi-workflow-polish--integration-phase-2) |
| Visual workflow editor | 📅 Planned | [Epic 10](./epic-list.md#epic-10-multi-workflow-support-future) |

**Not available:**
- Workflow marketplace/sharing — 💡 Possible, would need Epic 10+
- Auto-sync workflows from git repos — 📅 Planned in [Epic 10](./epic-list.md#epic-10-multi-workflow-support-future)

### Template Content

| Capability | Status | Reference |
|------------|--------|-----------|
| Handlebars syntax in templates | ✅ Available | [Epic 2](./epic-list.md#epic-2-astro-runtime--handlebars-engine) |
| Simple placeholders `{{field}}` | ✅ Available | Core Handlebars |
| Nested access `{{object.field}}` | ✅ Available | Core Handlebars |
| Iteration `{{#each items}}` | ✅ Available | Core Handlebars |
| Conditionals `{{#if condition}}` | ✅ Available | Core Handlebars |
| Custom helpers in templates | ✅ Available | [Story 4.4](../stories/4.4.story.md) |
| Output format sections | ✅ Available | [Story 3.7](../stories/3.7.story.md) |

**Not available:**
- Alternative template engines (Jinja, etc.) — 💡 Possible, would need adapter pattern
- Template includes/partials — 💡 Possible, Handlebars supports this, not yet exposed

---

## POEM App — Programmatic & Infrastructure

Capabilities for developers working with the runtime, APIs, and integrations.

### Astro Server & Runtime

| Capability | Status | Reference |
|------------|--------|-----------|
| Development server with hot-reload | ✅ Available | [Epic 2](./epic-list.md#epic-2-astro-runtime--handlebars-engine) |
| API endpoints for prompt operations | ✅ Available | [Architecture: API Spec](../architecture/api-specification.md) |
| Config-driven path resolution | ✅ Available | [Story 3.8](../stories/3.8.story.md) |
| Development vs production modes | ✅ Available | [CLAUDE.md](../../CLAUDE.md#poem-development-setup) |

**Not available:**
- Production deployment guide — 💡 Needed, documentation task
- Docker containerization — 💡 Possible, infrastructure work
- Multi-tenant support — 💡 Significant architecture change

### Handlebars Engine

| Capability | Status | Reference |
|------------|--------|-----------|
| Template compilation | ✅ Available | [Epic 2](./epic-list.md#epic-2-astro-runtime--handlebars-engine) |
| Built-in helpers (titleCase, dateFormat, etc.) | ✅ Available | [Story 2.2](../stories/2.2.story.md) |
| YouTube helpers (gt, truncate, join, formatTimestamp) | ✅ Available | [Story 4.4](../stories/4.4.story.md) |
| Helper hot-reload in development | ✅ Available | [Story 4.4](../stories/4.4.story.md) |
| Helper documentation via API | ✅ Available | [Story 4.4](../stories/4.4.story.md) |
| Create custom helpers on-demand | 📅 Planned | [Epic 6](./epic-list.md#epic-6-system-agent--helper-generation) |

**Not available:**
- Helper marketplace/sharing — 💡 Possible, would need Epic for helper ecosystem
- Helper testing framework — 💡 Possible, extend existing test infrastructure

### API Endpoints

| Capability | Status | Reference |
|------------|--------|-----------|
| `POST /api/prompt/render` — Render template | ✅ Available | [Story 4.5](../stories/4.5.story.md) |
| `POST /api/prompt/validate` — Validate syntax | ✅ Available | [Story 3.5](../stories/3.5.story.md) |
| `GET /api/helpers` — List available helpers | ✅ Available | [Story 4.4](../stories/4.4.story.md) |
| `POST /api/schema/extract` — Extract from template | ✅ Available | [Story 4.2](../stories/4.2.story.md) |
| `POST /api/mock/generate` — Generate mock data | ✅ Available | [Story 4.3](../stories/4.3.story.md) |
| `POST /api/workflow/execute` — Run workflow chain | ✅ Available | [Story 4.6](../stories/4.6.story.md) |
| `GET /api/workflow/{name}/schema` — Auto-derived schema | 🔜 Coming Soon | [Story 4.6.5](./epic-details.md#story-465-auto-generate-workflow-schema-from-yaml) |

**Not available:**
- WebSocket for real-time workflow updates — 💡 Possible, would enhance UX
- GraphQL API — 💡 Possible, alternative to REST
- OpenAPI spec generation — 💡 Possible, documentation enhancement

### External System Integration

| Capability | Status | Reference |
|------------|--------|-----------|
| Abstract provider contract | 📅 Planned | [Epic 7](./epic-list.md#epic-7-integration-agent--provider-pattern) |
| Pull data dictionary from provider | 📅 Planned | [Epic 7](./epic-list.md#epic-7-integration-agent--provider-pattern) |
| Publish prompts to external systems | 📅 Planned | [Epic 7](./epic-list.md#epic-7-integration-agent--provider-pattern) |
| SupportSignal integration | 📅 Planned | [Epic 7](./epic-list.md#epic-7-integration-agent--provider-pattern) |

**Not available:**
- LangChain integration — 💡 Possible, would need provider implementation
- OpenAI/Anthropic direct integration — 💡 Possible, provider for each
- Webhook triggers — 💡 Possible, extend API layer

### Developer Tooling

| Capability | Status | Reference |
|------------|--------|-----------|
| NPX installer | ✅ Available | [Epic 1](./epic-list.md#epic-1-foundation--monorepo-setup) |
| Dev setup script | ✅ Available | `./scripts/dev-setup.sh` |
| Pre-commit hooks (gitleaks) | ✅ Available | `.husky/pre-commit` |
| Vitest test suite | ✅ Available | [Architecture: Testing](../architecture/testing-strategy.md) |

**Not available:**
- VS Code extension — 💡 Possible, would enhance prompt authoring
- CLI outside of Claude Code — 💡 Possible, standalone npm package
- Debugging/tracing UI — 💡 Possible, Astro page for workflow debugging

---

## Cross-Cutting Capabilities

### Quality & Validation

| Capability | Status | Reference |
|------------|--------|-----------|
| Capability Progression Validation (Victor) | ✅ Available | [Workflow Validation Guide](../guides/workflow-validation-guide.md) |
| BMAD QA integration | ✅ Available | [CLAUDE.md](../../CLAUDE.md#test-architect-qa-agent-integration) |
| Story acceptance testing (SAT) | ✅ Available | `docs/stories/*.story-SAT.md` |

### Maintenance & Operations

| Capability | Status | Reference |
|------------|--------|-----------|
| Technical debt tracking | ✅ Available | [Epic 0](./epic-list.md#epic-0-maintenance--continuous-improvement) |
| Bug fix workflow | ✅ Available | [Epic 0](./epic-list.md#epic-0-maintenance--continuous-improvement) |
| Performance optimization | ✅ Available | [Epic 0](./epic-list.md#epic-0-maintenance--continuous-improvement) |

---

## Quick Reference: "Can POEM do X?"

### Common Questions

**Q: Can I create a prompt with typed inputs and outputs?**
A: ✅ Yes. Create a `.hbs` template and a unified schema with `input` and `output` sections. See [Story 3.7.1](../stories/3.7.1.story.md).

**Q: Can I test my prompts without real data?**
A: ✅ Yes. Use mock data generation from your schema. See [Story 4.3](../stories/4.3.story.md).

**Q: Can I chain multiple prompts where output feeds into the next?**
A: ✅ Yes. Define a workflow chain with field mappings. See [Story 4.6](../stories/4.6.story.md).

**Q: Can I pause a workflow for human review?**
A: 🔜 Coming soon in [Story 4.7](./epic-details.md#story-47-human-in-the-loop-checkpoint).

**Q: Can I validate that outputs meet platform limits (e.g., YouTube title length)?**
A: 🔜 Coming soon in [Story 4.8](./epic-details.md#story-48-platform-constraint-validation).

**Q: Can I pull schema definitions from an external system like SupportSignal?**
A: 📅 Planned in [Epic 7](./epic-list.md#epic-7-integration-agent--provider-pattern).

**Q: Can I use a different template engine like Jinja?**
A: 💡 Not planned, but architecturally possible. Would need an adapter pattern in the template service. Consider Epic 10+ or enhancement to Epic 2.

**Q: Can I deploy prompts to production systems automatically?**
A: 📅 Planned in [Epic 7](./epic-list.md#epic-7-integration-agent--provider-pattern) via provider publish workflow.

---

## Adding New Capabilities

If a capability you need is marked 💡 **Possible** or doesn't exist:

1. **Check Planning Docs**: [docs/planning/](../planning/) may have exploration notes
2. **Check Future Enhancements**: [future-enhancements.md](../future-enhancements.md) tracks deferred work
3. **Determine Epic Fit**:
   - Prompt/workflow capability → Epic 3-4 or Epic 8
   - Handlebars/helper capability → Epic 6
   - External integration → Epic 7
   - Infrastructure/tooling → Epic 0-2
   - New domain entirely → Propose Epic 11+
4. **Draft Story**: Use BMAD SM agent to draft story in appropriate epic

---

**Last Updated**: 2026-01-22
