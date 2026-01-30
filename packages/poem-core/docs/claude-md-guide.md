# POEM Agents - Claude Code Documentation

This guide provides ready-to-use documentation for POEM agents that you can copy into your project's `CLAUDE.md` file. Adding this section helps Claude Code understand which POEM agents are available and when to use them.

## Why Add This to CLAUDE.md?

When you install POEM in your project (`npx poem-os install`), the slash commands work (`/poem/agents/victor`, etc.), but Claude Code has no context about what these agents do. By adding this documentation to your `CLAUDE.md`, Claude can:

- Suggest the right agent for your current task
- Explain what each agent does when you ask
- Guide you through agent workflows
- Provide better context-aware assistance

## Copy-Paste Ready Section

Copy the section below into your project's `CLAUDE.md`:

---

## POEM Agents

POEM includes specialized agents that extend beyond the standard BMAD framework:

| Agent | Persona | Role | Primary Use |
|-------|---------|------|-------------|
| **victor** | Victor | Workflow Validator + Capability Query | After each story: tests B72 YouTube workflow end-to-end, prevents regressions, tracks automation progress. Also answers "what can POEM do?" via `*capability-explorer` |
| **penny** | Penny | AI Prompt Assistant | Create, refine, test, and validate AI prompts. Generates schemas, creates mock data, validates prompt structure |
| **felix** | Felix | Cross-Project Bug Reporter | When using POEM in other projects (v-voz, etc.): logs bugs with full context and submits them back to central POEM for triage |

**Access**: `/poem/agents/{agent-name}`

### Victor (Workflow Validator + Capability Query)

**Command**: `/poem/agents/victor`

**Role**: Product Integration QA - Multi-Story Context Keeper

**When to use**:
- After completing a BMAD story to validate capabilities against B72 YouTube workflow
- To prevent regressions and ensure cumulative progress toward automation goals
- To query POEM capabilities ("what can POEM do?") in <3 seconds

**Key Commands**:
- `*validate` - Execute full 6-step validation cycle (regression + progression + integration + artifacts + feedback). Duration: 60-90 min
- `*regression` - Quick regression check (did we break anything with the last story?). Duration: 10-15 min
- `*progress-report` - Generate epic/product progress summary (% complete, workflow coverage, blockers). Duration: 5-10 min
- `*capability-explorer <query>` - Query POEM capabilities across local and central contexts. **NEW in Story 3.9**. Response time: <3 seconds
  - Examples:
    - `*capability-explorer list all` - List all capabilities grouped by status
    - `*capability-explorer can POEM chain prompts?` - Check if specific capability exists
    - `*capability-explorer workflow execution` - Find capabilities matching keywords
    - `*capability-explorer what's blocking story 5.1?` - Identify story dependencies

**Dual Purpose**:
1. **Workflow Testing**: Validates story implementations against B72 YouTube workflow (real-world validation)
2. **Capability Query**: Resolves **Issue #15** (users can't discover what POEM can do) by querying Victor artifacts, Story files, KDD docs, and Epic Capabilities

**What Victor Does**:
- Validates in three dimensions: regression + progression + integration
- Maintains context across stories (story N in context of 1..N-1)
- Tracks cumulative progress toward epic/product goals
- Generates strategic feedback for future story planning
- Tests against real-world B72 workflow (54 prompts, 5 phases)
- Documents findings with evidence (snapshots, diffs, test results)

**Validation Artifacts** (in `dev-workspace/`, transient):
- Cumulative test reports - Epic progress tracking
- B72 workflow snapshots - Time-travel debugging, regression comparison
- Integration matrix - Capability integration status
- Feedback log - Strategic feedback for BMAD story planning

**All documentation** is permanent in `docs/guides/` and `docs/planning/bmad-integration/`.

### Penny (AI Prompt Assistant)

**Command**: `/poem/agents/penny`

**Role**: Expert Prompt Engineer & Template Architect

**When to use**:
- Creating new AI prompts with Handlebars templates
- Refining existing prompts iteratively
- Testing prompts with mock or real data
- Validating prompt structure and quality
- Generating JSON schemas for prompts

**Key Commands**:
- `*new` - Execute workflow to create a new prompt with schema. Creates Handlebars template in `/poem/prompts/` and corresponding JSON schema in `/poem/schemas/`
- `*refine` - Execute workflow to iteratively improve an existing prompt. Loads existing prompt, displays current template, guides improvements, re-validates
- `*test` - Execute workflow to test a prompt with mock or provided data. Renders template via API endpoint, reports missing fields and warnings
- `*validate` - Execute workflow to validate prompt structure and quality. Checks Handlebars syntax, validates placeholder-schema alignment, verifies required helpers exist

**What Penny Does**:
- Guides you through prompt creation and refinement using POEM principles
- Generates schemas alongside templates for validation
- Uses mock data to test prompts before deployment
- Ensures prompts have proper structure and follow best practices
- Validates Handlebars syntax and helper usage

**Core Principles**:
- Follow POEM best practices for prompt structure
- Always validate templates before finalizing
- Generate schemas alongside templates
- Use mock data to test prompts before deployment
- Ensure prompts have corresponding schemas for validation

### Felix (Cross-Project Bug Reporter)

**Command**: `/poem/agents/felix`

**Role**: Field Testing Observer & Issue Reporter

**When to use**:
- Testing POEM in external projects (v-voz, prompt-supportsignal, v-appydave)
- Hitting blockers or bugs during field testing
- Logging observations with rich project context
- Submitting issues back to central POEM for processing

**Key Commands**:
- `*log-blocker` - Log a blocker with project context and submit to central POEM inbox. Creates local blocker file in `docs/field-testing/blockers/`, submits to POEM inbox with submission ID (e.g., `v-voz-001`)
- `*log-session` - Create quick session notes in markdown format (no submission to POEM). Generates timestamped file in `docs/field-testing/sessions/` for freeform notes
- `*log-status` - Display status of all logged blockers (pending/submitted/linked/resolved). Scans `docs/field-testing/blockers/` and shows status table

**What Felix Does**:
- Captures blockers with sufficient context for triage (workflow name, affected files, severity)
- Automatically includes project-specific details (project name, location, POEM version)
- Submits observations to central POEM inbox for processing (`/triage inbox` in POEM)
- Maintains local logs for reference and status tracking
- Uses structured schemas (Client Blocker Schema v1.0) for consistent reporting

**Workflow for Logging Blockers**:
1. Detects current project context (name, location, POEM version)
2. Prompts for blocker details (description, context, severity, workflow)
3. Generates submission ID (e.g., `v-voz-001`)
4. Creates local blocker file in `docs/field-testing/blockers/{sequence}.json`
5. Submits to central POEM inbox via poem-inbox-bridge skill
6. Confirms submission with paths and next steps

**Severity Guidelines**:
- **Critical**: Blocks all work, data loss risk
- **High**: Blocks specific workflow, workaround exists
- **Medium**: Annoying but doesn't block work
- **Low**: Minor inconvenience or cosmetic

**Directory Structure Created**:
```
docs/field-testing/
├── blockers/           # JSONL blocker logs (Client Blocker Schema v1.0)
│   ├── 001.json
│   ├── 002.json
│   └── ...
└── sessions/           # Markdown session notes (freeform)
    ├── 2026-01-22-10-30.md
    └── 2026-01-23-14-00.md
```

---

## Usage Tips

**Victor**: Use after story completion to validate against real workflows and prevent regressions. Use `*capability-explorer` to quickly find out what POEM can do.

**Penny**: Use during prompt development to create well-structured, validated prompts with schemas.

**Felix**: Use when testing POEM in external projects to log blockers with rich context for central POEM triage.

All agents follow BMAD v4 patterns and integrate seamlessly with the POEM framework.

