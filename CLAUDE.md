# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**POEM** (Prompt Orchestration and Engineering Method) is a Prompt Engineering Operating System designed to help teams create, manage, and deploy AI prompts with schemas, mappings, and mock data generation. This is a planning/pre-implementation repository using the **BMAD Method v4** for structured AI-driven development.

**Current Status**: Planning phase complete, ready for BMAD implementation workflow.

## Understanding the BMAD Framework

This project uses **BMAD Method v4.44.3** - a comprehensive AI-assisted development methodology with specialized agents, tasks, and workflows. Before working on this codebase, understanding BMAD is critical.

### Core BMAD Concepts

**BMAD Agents** are AI personas with specific roles:
- **SM (Bob)** - Scrum Master: Creates detailed user stories from epics
- **Dev (James)** - Developer: Implements stories with tests
- **QA (Quinn)** - Test Architect: Reviews code quality, creates quality gates
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
2. **Development** (IDE): SM drafts story → Dev implements → QA reviews → Commit
3. **Quality Gates**: QA provides PASS/CONCERNS/FAIL decisions (advisory, not blocking)

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
│   ├── tasks/                     # 23 executable task workflows
│   ├── templates/                 # YAML templates (PRD, architecture, stories, etc.)
│   ├── workflows/                 # Greenfield/brownfield workflows
│   ├── checklists/                # Quality checklists
│   ├── data/                      # BMAD knowledge base, test frameworks
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
│   └── planning/                  # Pre-implementation planning (READ ONLY)
│       ├── POEM.md                # ⭐ PRIMARY: Complete POEM requirements
│       ├── README.md              # Planning navigation hub
│       ├── system-explorations/   # Architecture ideas (NOT final specs)
│       ├── decisions/             # Open questions and alternatives
│       ├── exploration/           # Discovery journey
│       └── reference/             # External knowledge (BMAD, SupportSignal)
│
└── data/                          # Example data for development
    ├── supportsignal/             # SupportSignal schemas and mappings
    │   ├── schemas/               # JSON schemas (narrative enhancement, questions)
    │   └── mappings/              # Predicate-to-shift-note mappings
    └── storyline/                 # Storyline app data
        ├── schemas/               # Character, output schemas
        ├── mappings/              # Transcript-to-storyline mappings
        └── source/                # Source storyline data
```

## Documentation Philosophy

### Planning vs Implementation

**`docs/planning/` is planning exploration, NOT implementation specs**:
- Contains pre-BMAD brainstorming and architectural ideas
- Use for context and understanding, not as locked requirements
- BMAD workflow will create actual implementation specs (PRD, Architecture, Stories)

**Start with**: `docs/planning/POEM.md` - Complete POEM overview and requirements

**Don't treat as**: Final API docs, implementation specs, or locked decisions

### Key Documentation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `docs/planning/POEM.md` | Complete POEM requirements and vision | ⭐ START HERE |
| `.bmad-core/user-guide.md` | BMAD methodology guide | Understanding workflow |
| `.bmad-core/enhanced-ide-development-workflow.md` | Step-by-step dev process | During implementation |
| `docs/planning/system-explorations/` | Architecture ideas | Planning context only |
| `docs/planning/reference/` | External knowledge (BMAD, SupportSignal patterns) | Reference during work |

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

### POEM's Value Proposition

**Key Features** (from planning):
1. **Mock Data Generation** - Killer feature for testing prompts
2. **Schema-Driven Prompts** - Type-safe AI interactions
3. **Template Management** - Handlebars-based reusability
4. **Mapping System** - Transform between data formats
5. **Integration Tools** - Deploy prompts to apps

## Common Development Patterns

### Starting Development

1. **Read primary requirements**: `docs/planning/POEM.md`
2. **Understand BMAD workflow**: `.bmad-core/enhanced-ide-development-workflow.md`
3. **Check existing stories**: `docs/stories/` (if any exist)
4. **Load agent**: `/BMad/agents/sm` or `/BMad/agents/dev`

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

## Important Notes

### DO NOT

- ❌ Modify `.bmad-core/` files (they're part of BMAD framework)
- ❌ Treat `docs/planning/` as final implementation specs
- ❌ Update story file sections you don't have permission for
- ❌ Skip tests or validation steps
- ❌ Bypass quality gates without team discussion

### DO

- ✅ Use BMAD agents via slash commands for formal workflow
- ✅ Read `docs/planning/POEM.md` for project understanding
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
- Primary requirements: `docs/planning/POEM.md`
- Planning navigation: `docs/planning/README.md`
- Example data: `data/supportsignal/`, `data/storyline/`

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
- Stories: `docs/stories/`
- QA Assessments: `docs/qa/assessments/`
- Quality Gates: `docs/qa/gates/`
- Planning: `docs/planning/`
- Example Data: `data/`

---

**Last Updated**: 2025-11-22
