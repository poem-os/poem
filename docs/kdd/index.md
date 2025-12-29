# Knowledge-Driven Development (KDD)

This folder contains learnings, decisions, and insights gathered during development. Over time, this becomes a searchable source of truth for project-specific knowledge.

## Structure

```
kdd/
├── index.md                    # This file - navigation and overview
├── learnings/                  # Insights discovered during development
│   └── *.md                    # Individual learning documents
├── decisions/                  # Architecture Decision Records (ADRs)
│   └── *.md                    # Decision documents
└── patterns/                   # Reusable patterns discovered
    └── *.md                    # Pattern documents
```

## Categories

### Learnings (`learnings/`)
Insights and discoveries made during implementation. Things we learned that weren't obvious from docs.

### Decisions (`decisions/`)
Significant technical decisions with context, alternatives considered, and rationale.

### Patterns (`patterns/`)
Reusable code patterns or approaches that work well in this codebase.

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

**Created:** 2025-12-29
