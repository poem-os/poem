# Slash Command Source Duplication

**Date:** 2025-12-31
**Story:** 3.1, 3.1.5 (post-implementation fix)
**Category:** Architecture / File Organization

## The Problem

After Story 3.1 and 3.1.5 were marked complete, testing revealed the Prompt Engineer agent showed different names ("Penny" in development, "Petra" when installed).

**Root cause:** Two separate source files existed for the same slash command:

| File | Purpose | Content |
|------|---------|---------|
| `.claude/commands/poem/agents/prompt-engineer.md` | Development (Claude Code reads directly) | Had "Penny" + hybrid paths |
| `packages/poem-core/commands/agents/prompt-engineer.md` | Installer source (copied to user's project) | Had "Petra" + old paths |

Story 3.1.5 updated the development file but didn't know about the installer source file.

## Why It Happened

1. Story 3.1 created `.claude/commands/poem/agents/prompt-engineer.md` during development
2. The file was edited directly rather than editing the installer source
3. `packages/poem-core/commands/` was a pre-existing directory that the installer was configured to use
4. Nobody realized there were two separate files that needed to stay in sync

## The Fix

**Single source of truth:** `packages/poem-core/commands/` is the ONE source.

**Sync mechanism:**
- `./scripts/sync-commands.sh` - copies source → `.claude/commands/poem/`
- `./scripts/sync-commands.sh --watch` - auto-syncs on file changes
- `./scripts/dev-setup.sh` - runs sync as part of setup

**Generated file ignored:**
- `.claude/commands/poem/` added to `.gitignore`
- It's generated from source, not committed

## Developer Workflow

1. Edit: `packages/poem-core/commands/agents/prompt-engineer.md`
2. Sync: `./scripts/sync-commands.sh` (or use `--watch`)
3. Test: `/poem/agents/prompt-engineer`

## Lesson Learned

When the installer copies files from one location to another, **development must also use the source location** (via copy/sync), not maintain a parallel file that can diverge.

**Pattern:** Source → Generated (for both development and installation)

## Related

- Story 3.1.5: Path Resolution Configuration (handled API paths, not slash command file locations)
- `bin/install.js` line 325: copies from `packages/poem-core/commands/`
