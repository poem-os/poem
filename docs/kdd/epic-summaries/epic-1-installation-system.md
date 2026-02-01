---
epic: "Epic 1"
title: "Installation & Framework Setup"
status: "Complete"
stories: "1.1-1.12"
created: "2026-01-30"
---

# Epic 1: Installation & Framework Setup

> **Epic Theme**: Installation, NPX installer, framework structure, multi-installation management
> **Stories**: 1.1 through 1.12 (12 stories)
> **Status**: Complete (all stories done)
> **Duration**: ~6 weeks

## Epic Overview

Epic 1 established the foundational installation system for POEM OS. Starting with monorepo structure, the epic evolved into a sophisticated multi-installation management system with port allocation, conflict detection, file preservation, and ecosystem visibility.

### Key Achievements

1. **Monorepo Structure** (Stories 1.1-1.3) - Separated `poem-core` (framework) and `poem-app` (Astro web app)
2. **NPX Installation** (Stories 1.4-1.6) - One-command install: `npx poem-os install`
3. **Multi-Installation System** (Stories 1.7-1.9) - Registry, port allocation, file preservation
4. **Configuration Management** (Stories 1.10-1.11) - Centralized config, workspace scoping
5. **Knowledge Curation** (Story 1.12) - Extracted learnings and patterns

## Story Progression

### Phase 1: Foundation (Stories 1.1-1.3)

**Story 1.1** - Initialize Monorepo Structure
- Created Nx monorepo with workspaces
- Established project conventions

**Story 1.2** - Create poem-core Package
- Framework code (tasks, agents, utilities)
- Installable via NPX

**Story 1.3** - Create poem-app Package
- Astro-based web application
- API endpoints for heavy operations

**Patterns Established**:
- Monorepo separation (framework vs app)
- Nx workspace conventions

---

### Phase 2: Installation System (Stories 1.4-1.6)

**Story 1.4** - NPX Installer
- `npx poem-os install` command
- Copies framework files to target directory
- Interactive prompts for configuration

**Story 1.5** - Claude Code Slash Command Integration
- `/poem/agents/penny`, `/poem/agents/victor`, etc.
- Slash commands load from `.poem-core/` or `packages/poem-core/`

**Story 1.6** - NPM Package Publishing
- Published `poem-os` to NPM registry
- Made `bin/install.js` executable
- Enabled `npx poem-os` global access

**Patterns Established**:
- NPX-based installation (no global install required)
- Slash command integration with Claude Code

---

### Phase 3: Multi-Installation Management (Stories 1.7-1.9)

**Story 1.7** - Startup Script and Port Configuration
- Port validation (range 1024-65535)
- Initial port allocation strategy
- Startup script for POEM server

**Story 1.8** - Installation Registry with Port Conflict Detection
- Global registry: `~/.poem/registry.json`
- Tracks installations (id, path, port, timestamps)
- Port conflict detection
- Stale entry detection

**Story 1.9** - Installation Preservation System
- `.poem-preserve` file with glob patterns
- Preserves user files during reinstall (`.env`, `poem.yaml`, workflow data)
- Auto-migration of old preserve files

**Patterns Established**:
- ⭐ [Installation Registry Pattern](../patterns/installation-registry-pattern.md)
- ⭐ [Port Allocation Strategy](../patterns/port-allocation-strategy.md) (increment-of-10: 9500, 9510, 9520...)
- ⭐ [Installation Preservation Pattern](../patterns/installation-preservation-pattern.md)

---

### Phase 4: Configuration & Polish (Stories 1.10-1.12)

**Story 1.10** - Selective Workspace Creation
- Only create workspace folders when needed (prompts/, schemas/, etc.)
- Renamed `workflow-state/` → `workflow-data/` for clarity

**Story 1.11** - Central POEM Path Configuration
- Config service as single source of truth
- Port synchronization between config and `.env`
- Registry integration for port conflict detection

**Story 1.12** - Knowledge Curation
- Lisa (Librarian) extracted learnings from Stories 1.1-1.11
- Created this epic summary
- Promoted recurring patterns

**Patterns Established**:
- ✅ [Config Service Single Source of Truth](../patterns/config-service-single-source-of-truth.md) (pre-existing)
- ✅ [Workflow-Scoped Resource Management](../patterns/workflow-scoped-resource-management.md) (pre-existing)

---

## Architectural Patterns

### 1. Installation Registry System ⭐

**Pattern**: [installation-registry-pattern.md](../patterns/installation-registry-pattern.md)

**Problem**: Multiple POEM installations across projects need coordination to prevent port conflicts

**Solution**: Global registry (`~/.poem/registry.json`) tracks all installations with metadata (id, path, port, timestamps)

**Stories**: 1.8, 1.11, Bug #6

**Key Features**:
- Port conflict detection
- Stale entry detection (deleted installations)
- Ecosystem visibility (user sees all installations)

**Usage Example**:
```bash
# Registry content
{
  "installations": [
    {"id": "poem-dev-main", "path": "/Users/dev/poem-os/poem", "port": 9500},
    {"id": "v-storyline", "path": "/Users/dev/v-storyline/poem", "port": 9510},
    {"id": "v-voz", "path": "/Users/dev/v-voz/poem", "port": 9540}
  ]
}
```

---

### 2. Port Allocation Strategy ⭐

**Pattern**: [port-allocation-strategy.md](../patterns/port-allocation-strategy.md)

**Problem**: How to allocate ports that are predictable, memorable, and conflict-free?

**Solution**: Increment-of-10 convention (9500, 9510, 9520...) provides breathing room and discoverability

**Stories**: 1.7, 1.8, Bug #6

**Convention**:
- Base port: 9500
- Increment: 10
- Range: 1024-65535
- Pattern is self-documenting

**Benefits**:
- Users can guess next port
- Easy to remember
- Reduces accidental conflicts
- Allows manual override

**Usage Example**:
```bash
# Installation prompt shows:
📊 POEM Port Registry:
   9500  poem-dev-main      /Users/dev/poem-os/poem
   9510  v-storyline        /Users/dev/v-storyline/poem
   9520  v-supportsignal    /Users/dev/v-supportsignal/poem

   Next suggested port: 9530 (following increment-of-10 convention)

? What port should POEM run on? (default: 9530):
```

---

### 3. Installation Preservation System ⭐

**Pattern**: [installation-preservation-pattern.md](../patterns/installation-preservation-pattern.md)

**Problem**: Users lose configuration and data when running `npx poem-os install` to upgrade

**Solution**: `.poem-preserve` file lists glob patterns to preserve during reinstallation

**Stories**: 1.9

**Preservation Rules**:
```yaml
version: 1
preserve:
  - .env                              # Environment variables
  - poem/config/poem.yaml             # User configuration
  - poem/workflows/*/workflow-data/*  # Workflow state
  - poem/workflows/*/prompts/*        # User prompts
  - poem/workflows/*/schemas/*        # User schemas
  - poem/workflows/*/mock-data/*      # Generated mock data
```

**Workflow**:
1. Read `.poem-preserve`
2. Backup matching files to temp
3. Copy framework files (upgrade)
4. Restore preserved files
5. Clean up temp backup

**Auto-migration**: Old preserve files upgraded automatically to add new patterns

---

### 4. Config Service Single Source of Truth ✅

**Pattern**: [config-service-single-source-of-truth.md](../patterns/config-service-single-source-of-truth.md)

**Problem**: Path definitions duplicated across tasks and services cause drift

**Solution**: Central config service (`poem-config.ts`) reads from `poem-core-config.yaml`, tasks inherit paths

**Stories**: 1.10, 1.11

**Reference**: Pattern already documented, verified Story 1.10, 1.11 references added

---

### 5. Workflow-Scoped Resource Management ✅

**Pattern**: [workflow-scoped-resource-management.md](../patterns/workflow-scoped-resource-management.md)

**Problem**: Creating all workspace folders up-front wastes disk space

**Solution**: Only create folders when user adds a workflow (prompts/, schemas/, mock-data/, workflow-data/)

**Stories**: 1.10

**Reference**: Pattern already documented, verified Story 1.10 reference added

---

## Cross-Story Insights

### Installation UX Evolution

The installation UX improved significantly across Epic 1:

**Story 1.4** (Initial):
- Basic file copying
- Minimal user feedback

**Story 1.7-1.8** (Registry):
- Port conflict detection
- Installation ecosystem tracking

**Bug #6** (Visibility):
- Always show registry (not just on conflict)
- Display next suggested port with convention hint
- Improved user understanding of ecosystem

**Jan 30 Bugs** (Workflow UX):
- Show existing workflows before asking to add more
- Better migration hints (`centralPoemPath` suggestion)
- Duplicate workflow detection

**Pattern**: Installation UX improvements are iterative, driven by user feedback

---

### Multi-Installation Coordination

Epic 1 solved the multi-installation problem with 3 coordinated patterns:

1. **Registry** - Central source of truth for all installations
2. **Port Allocation** - Predictable convention (increment-of-10)
3. **Preservation** - User data survives upgrades

**Together, these patterns enable**:
- Users can install POEM in multiple projects (v-storyline, v-voz, v-supportsignal, etc.)
- No port conflicts (registry + allocation strategy)
- No data loss during upgrades (preservation system)
- Ecosystem visibility (registry display)

---

### Configuration Philosophy

Epic 1 established a clear configuration philosophy:

**Two-tier configuration**:
1. **Global Registry** (`~/.poem/registry.json`) - Cross-installation metadata (ports, ids, paths)
2. **Project Config** (`poem/config/poem.yaml`) - Project-specific settings (workflows, current workflow, central path)

**Sync points**:
- Port: Config → `.env` → Registry (Story 1.11)
- Installation metadata: Config → Registry (Story 1.8)

**Single source of truth**:
- Config service reads from `poem-core-config.yaml`
- Tasks inherit paths (no duplication)

---

## Metrics & Evidence

### Story Distribution

- **Foundation**: 3 stories (25%)
- **Installation**: 3 stories (25%)
- **Multi-Installation**: 3 stories (25%)
- **Configuration**: 3 stories (25%)

**Observation**: Balanced progression from foundation to sophisticated multi-installation system

---

### Pattern Promotion

- **New patterns documented**: 3 (Installation Registry, Port Allocation, Preservation)
- **Existing patterns verified**: 2 (Config Service, Workflow-Scoped Resources)
- **Total Epic 1 patterns**: 5

**Observation**: Epic 1 produced significant reusable patterns (5 total), more than any other epic

---

### Bug Fix Integration

Epic 1 work continued beyond story completion:

- **Bug #6** (Jan 30): Registry display UX improvement
- **Jan 30 Bugs**: Workflow installation UX (5 bugs fixed)

**Observation**: Even after story completion, installation system received iterative improvements (healthy pattern)

---

## Lessons Learned

### 1. File-Based > Database

**Decision**: Use file-based storage (JSON registry, YAML preserve file) instead of database

**Rationale**:
- No dependencies (SQLite, etc.)
- Cross-platform compatibility
- Easy debugging (users can inspect files)
- Sufficient for metadata-scale data

**Result**: ✅ Simple, reliable, debuggable

---

### 2. Conventions > Configuration

**Decision**: Use increment-of-10 port allocation as convention (not configurable)

**Rationale**:
- Predictable pattern users can learn
- Self-documenting (pattern is obvious)
- Reduces configuration burden

**Result**: ✅ Users understand convention after 2-3 installations

---

### 3. Preservation > Prevention

**Decision**: Allow framework files to be overwritten, then restore user files from backup

**Rationale**:
- Simpler than selective copying
- Enables framework upgrades
- Transparent preservation rules (`.poem-preserve`)

**Result**: ✅ Users can safely upgrade without data loss

---

### 4. UX Iterations Matter

**Decision**: Continuously improve installation UX based on user feedback (Bug #6, Jan 30 bugs)

**Rationale**:
- First-time experience is critical
- Small UX improvements compound (registry display, workflow listing, hints)

**Result**: ✅ Installation UX improved significantly from Story 1.4 to Bug #6

---

## Future Enhancements

### Potential Improvements

1. **File Locking**: Prevent registry corruption during concurrent installs
2. **Stale Entry Cleanup**: Automated cleanup of deleted installations
3. **Custom Base Port**: Allow users to configure base port via environment variable
4. **Installation Health Check**: `npx poem-os doctor` to verify installation integrity

### Not Planned

- **Database Migration**: File-based approach is working well
- **Cloud Registry**: Global registry is sufficient (no multi-machine coordination needed)
- **Installation Wizard**: Interactive prompts are sufficient for current UX

---

## Related Documentation

### Patterns
- [Installation Registry Pattern](../patterns/installation-registry-pattern.md) ⭐ NEW
- [Port Allocation Strategy](../patterns/port-allocation-strategy.md) ⭐ NEW
- [Installation Preservation Pattern](../patterns/installation-preservation-pattern.md) ⭐ NEW
- [Config Service Single Source of Truth](../patterns/config-service-single-source-of-truth.md) ✅ VERIFIED
- [Workflow-Scoped Resource Management](../patterns/workflow-scoped-resource-management.md) ✅ VERIFIED

### Stories
- Stories 1.1-1.12 (see git log for commit references)

### Bug Fixes
- [Bug #6: Port Registry Display](../../backlog/quick-fixes.md)
- [Jan 30 Workflow Installation Bugs](../../../.ai/bug-fixes-workflow-installation.md)

### Architecture
- [Unified Project Structure](../../architecture/unified-project-structure.md)
- [Tech Stack](../../architecture/tech-stack.md)

---

**Epic Summary maintained by**: Lisa (Librarian)
**Last reviewed**: 2026-01-30
**Epic Status**: ✅ Complete
