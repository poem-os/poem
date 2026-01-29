# Workflow Validation Guide

This guide covers using Victor (Workflow Validator agent) for product-level QA in POEM.

## What is Victor?

Victor is POEM's Workflow Validator agent that provides product-level quality assurance by:
- Validating capabilities against real workflows (B72 YouTube automation)
- Maintaining context across stories (story N in context of 1..N-1)
- Tracking cumulative progress toward automation goals
- Generating strategic feedback for future story planning

## Quick Start

**Activate Victor**:
```bash
/poem/agents/victor
```

**Run full validation** (after completing a story):
```bash
*validate
```

**Quick regression check**:
```bash
*regression
```

**Query capabilities**:
```bash
*capability-explorer list all
*capability-explorer can POEM chain prompts?
*capability-explorer what's blocking story 5.1?
```

## Available Commands

| Command | Duration | Purpose |
|---------|----------|---------|
| `*validate` | 60-90 min | Full 6-step validation cycle (regression + progression + integration + artifacts + feedback) |
| `*regression` | 10-15 min | Quick regression check (did we break anything?) |
| `*progression` | 15-20 min | Test new story's capability in isolation |
| `*integration` | 10-15 min | Test how new capability works with existing ones |
| `*progress-report` | 5-10 min | Epic/product progress summary (% complete, workflow coverage, blockers) |
| `*capability-explorer` | <3 sec | Query POEM capabilities (answers "what can POEM do?") |
| `*snapshot` | 5 min | Save B72 workflow outputs for current story milestone |
| `*compare-milestones` | 10-15 min | Compare outputs across story milestones |
| `*update-matrix` | 5-10 min | Update integration matrix with new test results |
| `*generate-feedback` | 10-15 min | Create strategic feedback for upcoming stories |

## Path Resolution

Victor queries multiple locations to answer capability questions:

**LOCAL context** (always queries):
- `.poem-core/agents/` - Which agents are available?
- `docs/field-testing/blockers/` - Felix's logged blockers (if exists)
- `poem/workflows/` - Which workflows are active? (if exists)

**CENTRAL context** (queries if central path configured):
- `{central}/docs/stories/` - What's implemented in POEM framework?
- `{central}/docs/prd/epic-list.md` + `epic-details.md` - What's planned?
- `{central}/docs/kdd/` - Patterns, learnings, architectural decisions
- `{central}/dev-workspace/test-reports/` - Validation status
- `{central}/data/` - Example use cases

## Troubleshooting

### "Victor says 'Running in local-only mode' - what does this mean?"

This means Victor can't find the central POEM development source. This is **normal for most users**.

**For contributors/developers**: If you have the POEM development clone and want Victor to query central capabilities:
```bash
# Configure central POEM path
npx poem-os config set central-path ~/dev/ad/poem-os/poem

# Verify configuration
npx poem-os config get central-path
```

**For end users**: You can ignore this message - Victor will work in local-only mode using installed framework files (`.poem-core/`).

### How do I configure central POEM path?

Use the `poem-os config` command:

```bash
# Set central path
npx poem-os config set central-path ~/dev/ad/poem-os/poem

# Get current value
npx poem-os config get central-path

# List all config
npx poem-os config list
```

**Who needs this?**
- POEM contributors who have the development repository cloned
- Framework developers working on POEM itself
- NOT needed for end users who just use POEM

### Felix can't submit to inbox - path not configured

The Felix agent (Field Tester) needs the central POEM path to submit blockers to the central issue inbox.

**Solution** (contributors only):
```bash
npx poem-os config set central-path ~/dev/ad/poem-os/poem
```

If you're an end user (not a POEM contributor), you won't need Felix's inbox submission feature.

### Multi-machine setup: Central path differs across machines

If you work across multiple machines with different directory structures (e.g., laptop vs desktop), use the `POEM_CENTRAL_PATH` environment variable instead of `poem.yaml`:

```bash
# On laptop
export POEM_CENTRAL_PATH=~/dev/poem-os/poem

# On desktop
export POEM_CENTRAL_PATH=/Users/work/projects/poem

# This overrides the value in poem/config/poem.yaml
```

Add this to your shell profile (`.bashrc`, `.zshrc`) to make it persistent.

**Why not gitignore poem.yaml?**
- `poem.yaml` contains workflow definitions that should be version controlled
- The environment variable allows machine-specific overrides without conflicts
- Already protected from reinstallation by `.poem-preserve` (Story 1.9)

### Stale central path (directory moved/deleted)

If you moved or deleted the POEM development directory:

```bash
# Check current value
npx poem-os config get central-path

# Update to new location
npx poem-os config set central-path /new/path/to/poem

# Or set to null (local-only mode)
npx poem-os config set central-path null
```

## Validation Artifacts

Victor maintains several artifacts in `dev-workspace/` (gitignored, transient):

| Artifact | Location | Purpose |
|----------|----------|---------|
| Cumulative test reports | `dev-workspace/test-reports/` | Epic progress tracking |
| B72 workflow snapshots | `dev-workspace/test-runs/B72/` | Time-travel debugging, regression comparison |
| Integration matrix | `dev-workspace/integration-matrix.md` | Capability integration status |
| Feedback log | `dev-workspace/feedback-for-bmad.md` | Strategic feedback for BMAD story planning |
| B72 testing guide | `dev-workspace/B72-VIDEO-TESTING-GUIDE.md` | Living document with current B72 workflow status |

## Success Criteria by Epic

### Epic 3: Prompt Engineering Capabilities
- ✅ All 54 B72 prompts can execute individually
- ✅ Schema validation works for all prompts
- ✅ Mock data generation covers all schemas
- ✅ Handlebars templating functional
- ✅ No regressions in Tier 2 validation
- ✅ Integration matrix shows >80% capability pairs tested

**Workflow Target**: 80% of B72 prompts executable (manual chaining OK)

### Epic 4: Workflow Orchestration
- ✅ Workflow definition format works
- ✅ Step chaining automated (no manual intervention)
- ✅ Data transformations between steps work
- ✅ State management across workflow works
- ✅ B72 workflow runs end-to-end unattended
- ✅ Error handling and rollback functional

**Workflow Target**: B72 workflow fully automated (transcript in → metadata out)

## Related Documentation

- Victor agent definition: `packages/poem-core/commands/agents/victor.md`
- Capability progression validation (BMAD integration): `docs/planning/bmad-integration/capability-validation-requirements.md`
- Epic capabilities: `docs/prd/epic-list.md`, `docs/prd/epic-details.md`
- Architecture: `docs/architecture.md`

---

**Last updated**: 2026-01-29 (Story 1.11)
