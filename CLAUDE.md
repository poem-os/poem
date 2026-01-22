# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**POEM** (Prompt Orchestration and Engineering Method) is a Prompt Engineering Operating System designed to help teams create, manage, and deploy AI prompts with schemas, mappings, and mock data generation. This project uses the **BMAD Method v4** for structured AI-driven development.

**Current Status**: PRD and Architecture complete. Ready for story creation and implementation.

## Understanding the BMAD Framework

This project uses **BMAD Method v4.44.3** - a comprehensive AI-assisted development methodology with specialized agents, tasks, and workflows. Before working on this codebase, understanding BMAD is critical.

### Core BMAD Concepts

**BMAD Agents** are AI personas with specific roles:

- **SM (Bob)** - Scrum Master: Creates detailed user stories from epics
- **Dev (James)** - Developer: Implements stories with tests
- **QA (Quinn)** - Test Architect: Reviews code quality, creates quality gates
- **Librarian (Lisa)** - Documentation Curator: Extracts knowledge, maintains KDD documentation (Step 7 of AppyDave workflow)
- **Architect** - Designs system architecture
- **PM** - Product Manager: Creates PRDs
- **PO** - Product Owner: Validates alignment
- **Analyst** - Research and planning
- **UX Expert** - Frontend specifications

**BMAD Agents vs Claude Code**: BMAD agents are accessed via slash commands (e.g., `/BMad/agents/dev`) and are context-aware personas. Don't confuse these with your native capabilities.

### Key BMAD Commands (Slash Commands)

Access BMAD agents and tasks via Claude Code slash commands:

```bash
# Agent access
/BMad/agents/sm         # Scrum Master (story creation)
/BMad/agents/dev        # Developer (implementation)
/BMad/agents/qa         # Test Architect (quality review)
/BMad/agents/librarian  # Librarian (knowledge curation - Step 7)
/BMad/agents/architect  # System design
/BMad/agents/pm         # Product planning

# Common tasks
/BMad/tasks/create-next-story      # SM: Draft next story
/BMad/tasks/review-story           # QA: Comprehensive review
/BMad/tasks/document-project       # Architect: Document codebase
/BMad/tasks/risk-profile           # QA: Assess implementation risks
/BMad/tasks/test-design            # QA: Create test strategy
```

### BMAD Workflow Overview

1. **Planning** (Web/IDE): PM creates PRD → Architect designs → PO validates → Shard documents
2. **Development** (IDE): SM drafts story → Dev implements → QA reviews → Lisa curates knowledge → Commit
3. **Quality Gates**: QA provides PASS/CONCERNS/FAIL decisions (advisory, not blocking)
4. **Knowledge Curation** (Step 7): Lisa extracts learnings, creates KDD documentation, maintains topology

**Critical Files**:

- `.bmad-core/core-config.yaml` - BMAD project configuration
- `.bmad-core/agents/*.md` - Agent definitions (10 agents)
- `.bmad-core/tasks/*.md` - Executable task workflows (23 tasks)
- `.bmad-core/user-guide.md` - Complete BMAD documentation
- `.bmad-core/enhanced-ide-development-workflow.md` - Step-by-step development guide

## Project Structure

```
poem/
├── .bmad-core/                    # BMAD Method framework (v4.44.3)
│   ├── agents/                    # 10 AI agent personas (sm, dev, qa, architect, etc.)
│   ├── agent-teams/               # Team configurations
│   ├── tasks/                     # 23 executable task workflows
│   ├── templates/                 # YAML templates (PRD, architecture, stories, etc.)
│   ├── workflows/                 # Greenfield/brownfield workflows
│   ├── checklists/                # Quality checklists
│   ├── data/                      # BMAD knowledge base, test frameworks
│   ├── utils/                     # Utility scripts
│   ├── core-config.yaml           # Project configuration
│   ├── user-guide.md              # Complete BMAD methodology guide
│   └── working-in-the-brownfield.md # Brownfield workflow guide
│
├── .claude/commands/BMad/         # Claude Code slash command integration
│   ├── agents/                    # Agent command wrappers
│   └── tasks/                     # Task command wrappers
│
├── docs/                          # Project documentation
│   ├── index.md                   # Documentation navigation
│   ├── brief.md                   # Project brief (34KB)
│   ├── prd.md                     # ⭐ Consolidated PRD (48KB)
│   ├── prd/                       # Sharded PRD documents
│   │   ├── index.md               # PRD navigation
│   │   ├── goals-and-background-context.md
│   │   ├── requirements.md
│   │   ├── epic-list.md
│   │   ├── epic-details.md
│   │   ├── technical-assumptions.md
│   │   └── next-steps.md
│   ├── architecture.md            # ⭐ Consolidated Architecture (86KB)
│   ├── architecture/              # Sharded Architecture documents
│   │   ├── index.md               # Architecture navigation
│   │   ├── introduction.md
│   │   ├── high-level-architecture.md
│   │   ├── components.md
│   │   ├── data-models.md
│   │   ├── core-workflows.md
│   │   ├── api-specification.md
│   │   ├── tech-stack.md
│   │   ├── coding-standards.md
│   │   ├── testing-strategy.md
│   │   ├── unified-project-structure.md
│   │   ├── cicd-strategy.md
│   │   └── next-steps.md
│   └── planning/                  # Pre-implementation planning (historical)
│       ├── poem-requirements.md                # Original POEM requirements
│       ├── README.md              # Planning navigation hub
│       ├── system-explorations/   # Architecture ideas
│       ├── decisions/             # Open questions and alternatives
│       ├── exploration/           # Discovery journey
│       └── reference/             # External knowledge (BMAD, SupportSignal)
│
└── data/                          # Example data for development
    ├── supportsignal/             # SupportSignal schemas and mappings
    │   ├── schemas/               # JSON schemas (narrative enhancement, questions)
    │   ├── prompts/               # Handlebars prompt templates
    │   └── mappings/              # Predicate-to-shift-note mappings
    ├── storyline/                 # Storyline app data
    │   ├── schemas/               # Character, output schemas
    │   ├── prompts/               # Handlebars prompt templates
    │   ├── mappings/              # Transcript-to-storyline mappings
    │   └── source/                # Source storyline data
    └── youtube-launch-optimizer/  # YouTube workflow example (54 prompts)
        ├── schemas/               # Workflow attribute schemas
        ├── prompts/               # Comprehensive prompt library
        └── brand-config.json      # Brand configuration
```

## Documentation Philosophy

### Document Hierarchy

The project has completed PRD and Architecture phases. Documents are organized by purpose:

**Implementation Specs** (use these for development):

- `docs/prd.md` - Product requirements (consolidated)
- `docs/architecture.md` - Technical architecture (consolidated)
- `docs/architecture/` - Sharded architecture docs (coding standards, tech stack, etc.)

**Historical/Context** (reference only):

- `docs/planning/` - Pre-BMAD brainstorming and exploration
- `docs/brief.md` - Original project brief

**Start with**: `docs/prd.md` for requirements, `docs/architecture.md` for technical design

### Key Documentation

| Document                                          | Purpose                           | When to Read                       |
| ------------------------------------------------- | --------------------------------- | ---------------------------------- |
| `docs/prd.md`                                     | Complete product requirements     | ⭐ START HERE for requirements     |
| `docs/architecture.md`                            | Complete technical architecture   | ⭐ START HERE for technical design |
| `docs/architecture/coding-standards.md`           | Code style and conventions        | Before writing code                |
| `docs/architecture/tech-stack.md`                 | Technology choices                | Understanding stack                |
| `docs/guides/workflow-validation-guide.md`        | Victor agent (Capability Progression Validation) | Using workflow validator |
| `docs/future-enhancements.md`                     | Future work and Epic 8 tracking   | Planning ahead                     |
| `.bmad-core/user-guide.md`                        | BMAD methodology guide            | Understanding workflow             |
| `.bmad-core/enhanced-ide-development-workflow.md` | Step-by-step dev process          | During implementation              |
| `docs/planning/poem-requirements.md`                           | Original requirements exploration | Historical context                 |

## Development Commands

### BMAD Agent Usage (Primary Development Method)

**Story Creation**:

```bash
# Use Scrum Master to draft next story
/BMad/agents/sm
# Then in agent context: *draft

# Validate story against artifacts
/BMad/tasks/validate-next-story
```

**Implementation**:

```bash
# Use Developer agent to implement story
/BMad/agents/dev
# Then in agent context: *develop-story {story-file}

# Developer workflow:
# 1. Read task → Implement → Write tests → Validate
# 2. Update story checkboxes and Dev Agent Record sections ONLY
# 3. Never modify Status, Story, Acceptance Criteria sections
# 4. When complete: Set status "Ready for Review"
```

**Quality Review**:

```bash
# Risk assessment (before development)
/BMad/agents/qa
# Then: *risk {story-file}

# Test design (before development)
# Then: *design {story-file}

# Requirements tracing (during development)
# Then: *trace {story-file}

# NFR validation (during development)
# Then: *nfr {story-file}

# Comprehensive review (after development)
# Then: *review {story-file}

# Quality gate update (after fixes)
# Then: *gate {story-file}
```

### When NOT to Use BMAD Agents

For simple tasks outside the formal workflow:

- Reading documentation
- Exploring codebase structure
- Quick file modifications
- General questions about the project

Use your native Claude Code capabilities for these.

## Working with BMAD

### Core Configuration

`.bmad-core/core-config.yaml` defines:

- Documentation locations (PRD, Architecture, Stories)
- QA assessment paths
- Files developers should always load
- Sharding configuration

**Critical for Dev agent**:

```yaml
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
```

These files are automatically loaded for developers and contain implementation standards.

### Test Architect (QA Agent) Integration

Quinn (QA agent) provides comprehensive quality assurance:

**Command Aliases** (short forms work):

- `*risk` → `*risk-profile`
- `*design` → `*test-design`
- `*nfr` → `*nfr-assess`
- `*trace` → `*trace-requirements`

**When to Use**:
| Stage | Commands | Priority |
|-------|----------|----------|
| After story approval | `*risk`, `*design` | High for complex features |
| During development | `*trace`, `*nfr` | Medium to high |
| After development | `*review` | **Required** |
| Post-review fixes | `*gate` | As needed |

**Quality Gate Statuses**:

- **PASS**: All critical requirements met
- **CONCERNS**: Non-critical issues (team should review)
- **FAIL**: Critical issues (should address)
- **WAIVED**: Issues acknowledged and accepted

**Output Locations**:

```
docs/qa/assessments/    # Risk, design, trace, NFR reports
docs/qa/gates/          # Quality gate decisions (.yml)
```

### Story Files and Agent Permissions

**Dev Agent** can ONLY update:

- Task/Subtask checkboxes
- Dev Agent Record section (Debug Log, Completion Notes, Change Log)
- File List
- Status (to "Ready for Review")

**QA Agent** can ONLY update:

- QA Results section

**DO NOT** modify:

- Story description
- Acceptance Criteria
- Testing sections
- Other agents' sections

### Librarian Agent (Lisa) Integration

Lisa (Librarian) is the FINAL agent in AppyDave workflow (Step 7), responsible for Knowledge-Driven Development (KDD) documentation curation after Quinn passes QA review.

**When to Use Lisa**:
- After Quinn's QA review passes
- Story status is "Done"
- Step 7 of AppyDave workflow
- Never during active development or before QA

**Lisa's Core Role**:
- Extract learnings from Dev Agent Record, SAT results, and QA feedback
- Create KDD documentation using templates (patterns, learnings, decisions, examples)
- Maintain documentation topology (indexes, cross-links, validation)
- Update story file with knowledge asset links
- Prevent documentation rot and knowledge decay

**Lisa's Commands**:
```bash
# Load Lisa agent
/BMad/agents/librarian

# Core commands
*curate {story}           # Extract knowledge from story (8-step workflow)
*validate-topology        # Check KDD structure health (links, orphans, directories)
*search-similar {doc}     # Find duplicate documents (70% similarity threshold)
*regenerate-indexes       # Auto-generate all index.md files
*detect-recurrence        # Identify recurring issues (pattern promotion)
*health-dashboard         # Generate KDD health metrics report
*exit                     # Exit Librarian persona
```

**KDD Document Types** (created by Lisa):
1. **Pattern** (`docs/kdd/patterns/`) - Reusable code/architectural patterns (promoted after 3+ uses)
2. **Learning** (`docs/kdd/learnings/`) - Story-specific insights, debugging sessions, incidents
3. **Decision** (`docs/kdd/decisions/`) - Architecture Decision Records (ADRs)
4. **Example** (`docs/examples/`) - Working code demonstrations

**How Other Agents Use Lisa's Docs**:
- **Quinn (QA)**: Validates code against documented patterns, flags pattern violations
- **James (Dev)**: Self-checks against patterns before marking story ready for review
- **Sarah (PO)**: References ADRs and architectural decisions during story validation
- **Bob (SM)**: Uses patterns and learnings to inform story requirements

**Lisa's Permissions**:

Lisa can ONLY update:
- "Knowledge Assets" section of story files (adds links to created KDD docs)

Lisa CANNOT modify:
- Story Status, Description, Acceptance Criteria, Tasks, Dev Agent Record, QA Results

**Validation Rules** (VAL-001 through VAL-006):
- VAL-001: Link Health (0 broken links target)
- VAL-002: Semantic Similarity (70% threshold for duplicates)
- VAL-003: Directory Limit (20 files per directory)
- VAL-004: Story File Size (300 lines target)
- VAL-005: Metadata Completeness (required frontmatter fields)
- VAL-006: Recurrence Detection (60% signature match for recurring issues)

**Success Metrics** (evidence-based targets):
| Metric | Baseline (SupportSignal) | Target | Owner |
|--------|--------------------------|--------|-------|
| Pattern Documentation | 0 | 100% critical patterns | Lisa |
| Pattern Consistency | 25% (1/4 implementations) | 95%+ | Quinn |
| Link Health | 70% (30% broken) | 95%+ valid links | Lisa |
| Documentation Maintenance | 7.4 hours/month | <1 hour/month | Lisa |
| Knowledge Extraction | ~40% stories | 100% stories | Lisa |

**Workflow Position**:
```
Step 6: Quinn (QA) → Step 7: Lisa (Librarian) → [WORKFLOW END]
```

Lisa is the FINAL agent. After knowledge curation, the story workflow is complete.

## Capability Progression Validation (Victor Agent)

### NEW: Product-Level QA System

**POEM has a specialized workflow validator** called **Victor** that validates capabilities across stories:

**Name**: Capability Progression Validation
**Agent**: `/poem/agents/victor`
**Guide**: `docs/guides/workflow-validation-guide.md`

### What is Capability Progression Validation?

**Traditional BMAD validates stories in isolation**. Victor adds **product-level QA** that:
1. Validates story N **in context** of stories 1..N-1
2. Tests against **B72 YouTube workflow** (real-world validation)
3. Tracks **cumulative progress** toward automation goals (10% → 40% → 80%)
4. Generates **strategic feedback** for future story planning

### When to Use Victor

**After each story completion**:
1. Dev completes SAT ✅
2. QA reviews story ✅
3. **Victor validates in context** (60-90 min)
4. Victor generates feedback for next story

### Victor's Commands

```bash
# Activate Victor
/poem/agents/victor

# Full validation cycle (60-90 min)
*validate

# Quick regression check (10-15 min)
*regression

# Epic progress summary (5-10 min)
*progress-report
```

### Validation Artifacts

Victor maintains (in `dev-workspace/`, transient):
- **Cumulative test reports** - Epic progress tracking
- **B72 workflow snapshots** - Time-travel debugging, regression comparison
- **Integration matrix** - Capability integration status
- **Feedback log** - Strategic feedback for BMAD story planning

**All documentation** is permanent in `docs/guides/` and `docs/planning/bmad-integration/`.

### Future: BMAD Integration (Epic 8)

Victor's pattern will be generalized for BMAD v5.0 as "Capability Validator" agent.

**Requirements**: `docs/planning/bmad-integration/capability-validation-requirements.md`
**Target**: BMAD v5.0.0 (Q2 2026)
**Tracking**: `docs/prd/epic-list.md` (Epic 8), `docs/future-enhancements.md`

---

## POEM-Specific Context

### What is POEM?

POEM (Prompt Orchestration and Engineering Method) is a system for:

1. Creating AI prompts with JSON schemas
2. Managing prompt templates (Handlebars-based)
3. Generating mock data for testing
4. Mapping data transformations
5. Deploying prompts to applications

### Example Use Cases (in `data/`)

**SupportSignal** (`data/supportsignal/`):

- Narrative enhancement prompts with schemas
- Question generation for shift notes
- Analysis predicates and classifications
- Mapping from analysis to shift notes

**Storyline** (`data/storyline/`):

- Character schema definitions
- Transcript-to-storyline transformations
- Output format schemas

**YouTube Launch Optimizer** (`data/youtube-launch-optimizer/`):

- Comprehensive workflow with 54 prompt templates
- Multi-phase video publishing pipeline (chapters, titles, descriptions, thumbnails)
- Brand configuration system
- Workflow attribute schemas

### POEM's Value Proposition

**Key Features** (from planning):

1. **Mock Data Generation** - Killer feature for testing prompts
2. **Schema-Driven Prompts** - Type-safe AI interactions
3. **Template Management** - Handlebars-based reusability
4. **Mapping System** - Transform between data formats
5. **Integration Tools** - Deploy prompts to apps

## Common Development Patterns

### Starting Development

1. **Read PRD**: `docs/prd.md` - Product requirements and epics
2. **Read Architecture**: `docs/architecture.md` - Technical design and standards
3. **Understand BMAD workflow**: `.bmad-core/enhanced-ide-development-workflow.md`
4. **Check existing stories**: `docs/stories/` (if any exist)
5. **Load agent**: `/BMad/agents/sm` or `/BMad/agents/dev`

### Creating a New Story

```bash
# 1. Load Scrum Master
/BMad/agents/sm

# 2. Draft story from epic
*draft

# 3. Review generated story in docs/stories/
# 4. Update status from "Draft" to "Approved"
```

### Implementing a Story

```bash
# 1. Load Developer agent
/BMad/agents/dev

# 2. Execute story implementation
*develop-story {story-file-path}

# 3. Follow sequential task execution:
#    - Read task → Implement → Write tests → Validate
#    - Update checkboxes as tasks complete
#    - Update File List with changes
#    - Add Debug Log entries if needed

# 4. When all tasks complete and tests pass:
#    - Run execute-checklist for story-dod-checklist
#    - Set status: "Ready for Review"
```

### Quality Review Workflow

```bash
# 1. Load QA agent
/BMad/agents/qa

# 2. Run comprehensive review
*review {story-file-path}

# 3. Review creates:
#    - QA Results section in story file
#    - Quality gate file in docs/qa/gates/

# 4. If issues found, developer addresses them

# 5. Update gate status
*gate {story-file-path}
```

## Installation and Setup

This project uses **BMAD Method v4.44.3** installed for Claude Code.

**Installation manifest**: `.bmad-core/install-manifest.yaml`

- Installed: 2025-11-22
- IDE: claude-code
- Version: 4.44.3

**To refresh BMAD**:

```bash
npx bmad-method install -f -i claude-code
```

## POEM Development Setup

POEM operates in two modes: **Development** and **Production**. Path resolution is automatic based on environment.

### Quick Setup

```bash
# Run the setup script
./scripts/dev-setup.sh
```

This will:
1. Verify Node.js version (20.x+ required)
2. Create `.env` with `POEM_DEV=true`
3. Create `dev-workspace/` directory for development testing (gitignored)
4. Install all dependencies

### Manual Setup

```bash
# 1. Set environment variable
echo "POEM_DEV=true" >> packages/poem-app/.env

# 2. Install dependencies
npm install
cd packages/poem-app && npm install
```

### Pre-commit Hook Requirements

The `.husky/pre-commit` hook uses **gitleaks** for secret scanning. This tool must be installed globally before committing changes.

**Installation**:
- macOS: `brew install gitleaks`
- Other platforms: See https://github.com/gitleaks/gitleaks

If gitleaks is not installed, commits will fail with an error. This is intentional to prevent accidentally committing secrets.

### Two Operating Modes

| Mode | Detection | Framework Location | User Workspace |
|------|-----------|-------------------|----------------|
| **Development** | `POEM_DEV=true` | `packages/poem-core/` | `dev-workspace/prompts/`, `dev-workspace/schemas/` |
| **Production** | `POEM_DEV` unset | `.poem-core/` | `poem/prompts/`, `poem/schemas/` |

### Dev Workspace

In development mode, user-generated content (prompts, schemas, mock-data) is stored in `dev-workspace/` to avoid polluting the POEM source code. This directory is gitignored.

```
dev-workspace/
├── prompts/       # User-created prompt templates
├── schemas/       # JSON schemas for prompts
├── mock-data/     # Generated mock data for testing
├── config/        # User configuration files
└── workflow-data/ # Workflow execution state
```

**Created by**: `./scripts/dev-setup.sh`

### Config Source-of-Truth

The config service (`packages/poem-app/src/services/config/poem-config.ts`) is the **single source of truth** for workspace paths. Workflows should NOT duplicate path definitions - they inherit from config.

**Key files**:
- `packages/poem-core/poem-core-config.yaml` - Defines workspace paths
- `packages/poem-core/workflows/README.md` - Documents the pattern for workflows

**Pattern for workflows**:
```yaml
# CORRECT - Reference config for paths
pathResolution: config

# WRONG - Never duplicate paths in workflows
paths:
  development:
    prompts: dev-workspace/prompts  # DON'T DO THIS
```

### Path Resolution

POEM uses a hybrid path resolution approach:

1. **Config Service**: Single source of truth, reads from `poem-core-config.yaml`
2. **Slash Commands**: Detect `packages/poem-core/` (dev) vs `.poem-core/` (prod)
3. **Fallback**: If config file not found, use hardcoded defaults

### Starting the Development Server

```bash
cd packages/poem-app
npm run dev
# Server starts at http://localhost:9500
```

### Testing POEM Agents

```bash
# Activate the Prompt Engineer agent
/poem/agents/prompt-engineer

# The agent will:
# 1. Detect development mode
# 2. Load from packages/poem-core/
# 3. Display available commands
```

## Important Notes

### DO NOT

- ❌ Modify `.bmad-core/` files (they're part of BMAD framework)
- ❌ Treat `docs/planning/` as final implementation specs
- ❌ Update story file sections you don't have permission for
- ❌ Skip tests or validation steps
- ❌ Bypass quality gates without team discussion

### DO

- ✅ Use BMAD agents via slash commands for formal workflow
- ✅ Read `docs/planning/poem-requirements.md` for project understanding
- ✅ Follow agent permissions (dev/qa section restrictions)
- ✅ Run tests and validation before marking "Ready for Review"
- ✅ Update File List in stories when modifying code
- ✅ Use `.bmad-core/user-guide.md` as BMAD reference

### Key Principles

1. **BMAD-First Development**: Use BMAD agents for structured work
2. **Planning is Exploration**: Planning docs are ideas, not locked specs
3. **Agent Boundaries**: Respect what each agent can/cannot modify
4. **Quality Gates**: Use QA agent throughout lifecycle, not just at end
5. **Test-Driven**: Write tests as you implement tasks
6. **Story-Driven**: All work should trace to stories

## Getting Help

**BMAD Methodology**:

- `.bmad-core/user-guide.md` - Complete guide
- `.bmad-core/enhanced-ide-development-workflow.md` - Step-by-step workflow
- `.bmad-core/working-in-the-brownfield.md` - Brownfield patterns

**BMAD Community**:

- Discord: https://discord.gg/gk8jAdXWmj
- GitHub: https://github.com/bmadcode/bmad-method
- YouTube: https://www.youtube.com/@BMadCode

**POEM Project**:

- Product requirements: `docs/prd.md`
- Technical architecture: `docs/architecture.md`
- Example data: `data/supportsignal/`, `data/storyline/`, `data/youtube-launch-optimizer/`
- Historical planning: `docs/planning/`

## Quick Reference

**BMAD Agents** (via `/BMad/agents/`):

- `sm` (Bob) - Story creation
- `dev` (James) - Implementation
- `qa` (Quinn) - Quality review
- `architect` - System design
- `pm` - Product planning
- `po` - Alignment validation

**QA Commands** (via QA agent):

- `*risk` - Risk assessment
- `*design` - Test strategy
- `*trace` - Coverage verification
- `*nfr` - Quality attributes
- `*review` - Comprehensive review
- `*gate` - Gate decision

**Document Locations**:

- PRD: `docs/prd.md` (consolidated) or `docs/prd/` (sharded)
- Architecture: `docs/architecture.md` (consolidated) or `docs/architecture/` (sharded)
- Stories: `docs/stories/`
- QA Assessments: `docs/qa/assessments/`
- Quality Gates: `docs/qa/gates/`
- Planning (historical): `docs/planning/`
- Example Data: `data/`

---

**Last Updated**: 2026-01-01
