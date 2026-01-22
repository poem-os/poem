# Knowledge-Driven Development (KDD)

This folder contains learnings, decisions, and insights gathered during development. Over time, this becomes a searchable source of truth for project-specific knowledge.

## Structure

```
kdd/
├── index.md                           # This file - navigation and overview
├── kdd-workflow-guide.md              # Complete KDD workflow documentation
├── knowledge-traceability-guide.md    # Knowledge tracing and topology maintenance
├── learnings/                         # Insights discovered during development
│   └── *.md                           # Individual learning documents
├── decisions/                         # Architecture Decision Records (ADRs)
│   └── *.md                           # Decision documents
└── patterns/                          # Reusable patterns discovered
    └── *.md                           # Pattern documents
```

## Methodology

### KDD Workflow Guide

**[KDD Workflow Guide](./kdd-workflow-guide.md)** ⭐ **START HERE**

Complete guide for Lisa (Librarian agent) on knowledge curation in Step 7 of the AppyDave workflow.

**What it covers**:
- KDD document taxonomy (patterns, learnings, decisions, examples)
- Complete 8-step knowledge curation workflow
- How agents use KDD documentation
- Topology maintenance and validation rules
- Success metrics and best practices

### Knowledge Traceability

**[Knowledge Traceability Guide](./knowledge-traceability-guide.md)**

How to maintain bidirectional links between stories, KDD documents, and validation artifacts.

---

## Categories

### Learnings (`learnings/`)
Story-specific insights, debugging sessions, and incidents. Things we learned that weren't obvious from docs.

### Decisions (`decisions/`)
Architecture Decision Records (ADRs) documenting significant technical decisions with context, alternatives considered, and rationale.

### Patterns (`patterns/`)
Reusable code patterns or approaches that work well in this codebase. Promoted after 3+ uses.

## Naming Convention

Files use kebab-case with a category prefix:
- `learnings/hot-reload-production-mode.md`
- `decisions/adr-001-chokidar-over-fs-watch.md`
- `patterns/singleton-service-pattern.md`

## How to Use

1. **Adding knowledge:** Create a new file in the appropriate subfolder
2. **Searching:** Use grep/search across the `kdd/` folder
3. **Referencing:** Link from story Dev Notes using `[Source: kdd/learnings/filename.md]`

---

## Knowledge Domains

POEM has two distinct knowledge domains that serve different audiences:

### Development Knowledge (`docs/kdd/`)

Knowledge for AI agents and developers **building** POEM OS:
- Patterns discovered during implementation
- Bug fixes and their root causes
- Architecture decisions and rationale
- Code conventions specific to this codebase

**Audience**: Dev agents, contributors, maintainers

### User Knowledge (`docs/poem/user-guide/`)

Knowledge for people **using** POEM OS:
- How to author templates
- Helper creation best practices
- Schema definition patterns
- Integration guides

**Audience**: POEM users, integrators

### Overlap and Future Migration

Some knowledge applies to both domains (e.g., Handlebars template patterns). When this occurs:
- Document in `kdd/` for development context
- Create user-facing version in `docs/poem/user-guide/` when needed

**Future consideration**: User documentation may migrate to `packages/poem-core/docs/` as the core library matures. This keeps usage docs close to the library they document.

---

**Created:** 2025-12-29
**Updated:** 2026-01-22 - Reorganized documentation structure, added KDD workflow guide
