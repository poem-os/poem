# POEM Documentation

Documentation hub for POEM (Prompt Orchestration and Engineering Method).

---

## 🎯 Quick Start

**New to POEM?** Start here:
- **[Getting Started with Workflows](./poem/user-guide/getting-started-with-workflows.md)** - Learn POEM workflows
- **[PRD](./prd.md)** - Product requirements and feature epics
- **[Architecture](./architecture.md)** - Technical architecture and design

---

## 📚 Documentation Categories

### POEM Product Documentation

**Location**: `docs/poem/`

Documentation for **users of POEM** - people building prompts, workflows, and integrations.

- **[POEM Index](./poem/index.md)** - Product features and guides
  - Getting Started with Workflows
  - Workflow Validation (Victor agent)
  - Triage System
  - User guides

**Audience**: POEM users, integrators, prompt engineers

---

### Knowledge-Driven Development (KDD)

**Location**: `docs/kdd/`

Documentation for **developers building POEM** - patterns, learnings, and decisions from story development.

- **[KDD Index](./kdd/index.md)** - Knowledge curation system
  - **[KDD Workflow Guide](./kdd/kdd-workflow-guide.md)** - Lisa's Step 7 curation process
  - **[Patterns](./kdd/patterns/)** - Reusable code patterns (15+ documented)
  - **[Learnings](./kdd/learnings/)** - Story-specific insights (10+ captured)
  - **[Decisions](./kdd/decisions/)** - ADRs (8 documented)

**Audience**: BMAD agents (Lisa, Quinn, James), contributors, maintainers

---

### BMAD Workflow Documentation

**Location**: `docs/` (top-level, planned future: `docs/bmad/`)

Documentation for **BMAD methodology** - PRD, architecture, stories, QA.

#### Product Requirements

- **[PRD](./prd.md)** - Consolidated product requirements (48KB)
- **[PRD Sharded](./prd/)** - Sharded PRD documents
  - Goals and background
  - Requirements and epics
  - Technical assumptions

#### Architecture

- **[Architecture](./architecture.md)** - Consolidated architecture (86KB)
- **[Architecture Sharded](./architecture/)** - Sharded architecture documents
  - High-level architecture
  - Components and data models
  - Tech stack and coding standards
  - Testing strategy

#### Story Development

- **[Stories](./stories/)** - Story files (65 stories)
  - X.Y.story.md - Story specifications
  - X.Y.story-SAT.md - System Acceptance Tests

#### Quality Assurance

- **[QA](./qa/)** - QA assessments and gates
  - Risk profiles
  - Test designs
  - Requirements tracing
  - Quality gates

#### Maintenance

- **[Backlog](./backlog/)** - Quick fixes and tech debt
  - Infrastructure updates
  - Documentation fixes
  - Bug fixes (<1 hour, no ceremony)

#### Historical

- **[Planning](./planning/)** - Pre-BMAD exploration and business analysis
  - Historical brainstorming
  - Requirements exploration
  - Original research

**Audience**: SM (Bob), Dev (James), QA (Quinn), PO (Sarah), Architect

---

### Examples

**Location**: `docs/examples/`

Working code demonstrations and reference implementations.

**Audience**: Both developers and users

---

## 📂 Transient Artifacts (Not in Git)

**Location**: `dev-workspace/` (gitignored)

Runtime artifacts and workflow logs - not committed to Git.

- **workflow-logs/** - BMAD workflow audit trails (JSONL format)
- **handovers/** - Story-specific handover prompts
- **workflow-data/** - Workflow execution state

---

## 🗺️ Directory Structure

```
docs/
├── index.md                      # This file - master navigation
│
├── poem/                         # POEM Product Documentation ⭐
│   ├── index.md
│   ├── user-guide/
│   ├── workflow-validation-guide.md
│   ├── triage-guide.md
│   └── backing-up-validation-data.md
│
├── kdd/                          # Knowledge-Driven Development 📚
│   ├── index.md
│   ├── kdd-workflow-guide.md
│   ├── knowledge-traceability-guide.md
│   ├── patterns/
│   ├── learnings/
│   └── decisions/
│
├── prd/                          # BMAD: Product Requirements
├── architecture/                 # BMAD: Technical Architecture
├── stories/                      # BMAD: Story Files (65)
├── qa/                           # BMAD: QA Assessments & Gates
├── backlog/                      # BMAD: Quick Fixes & Tech Debt
├── planning/                     # BMAD: Historical (Pre-BMAD BA work)
│
└── examples/                     # Working Code Demonstrations
```

---

## 🎯 Navigation by Role

### I'm a POEM User
→ Start: [POEM Index](./poem/index.md)
→ Learn: [Getting Started with Workflows](./poem/user-guide/getting-started-with-workflows.md)
→ Reference: [Triage Guide](./poem/triage-guide.md), [Victor Guide](./poem/workflow-validation-guide.md)

### I'm a Developer (BMAD Workflow)
→ Requirements: [PRD](./prd.md)
→ Architecture: [Architecture](./architecture.md)
→ Coding Standards: [Coding Standards](./architecture/coding-standards.md)
→ Knowledge: [KDD Index](./kdd/index.md)

### I'm Lisa (Librarian Agent)
→ Workflow: [KDD Workflow Guide](./kdd/kdd-workflow-guide.md)
→ Taxonomy: `.bmad-core/data/kdd-taxonomy.yaml`
→ Commands: *curate, *validate-topology, *health-dashboard

### I'm Quinn (QA Agent)
→ Review: [Testing Strategy](./architecture/testing-strategy.md)
→ Patterns: [KDD Patterns](./kdd/patterns/)
→ Gates: [QA Gates](./qa/gates/)

---

## 📖 Related Documentation

- **[CLAUDE.md](../CLAUDE.md)** - Project overview for Claude Code
- **[README.md](../README.md)** - Project setup and installation
- **[.bmad-core/user-guide.md](../.bmad-core/user-guide.md)** - BMAD methodology guide

---

**Last Updated**: 2026-01-22
**Maintained By**: Lisa (Librarian), POEM Documentation Team
**Version**: 2.0 (Post-reorganization)
