# Changelog

All notable changes to POEM (Prompt Orchestration and Engineering Method) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Epic 3: Prompt Engineer Agent & Core Workflows (In Progress)
- Prompt Engineer agent with workflow guidance
- Workflow execution and validation
- Multiple workflow support infrastructure

### Epic 4: YouTube Automation Workflow (In Progress)
- YouTube Launch Optimizer integration (53 prompt templates)
- System validation with real-world workflow

## [0.1.0] - 2026-01-21

### Epic 1: Foundation & Monorepo Setup (Complete)

#### Added
- NPM package structure with `npx poem-os` CLI
- Installation system with `npx poem-os install` command
- Installation modes: full, `--core`, `--app`, `--force`, `--verbose`
- Automatic dependency installation during setup
- Installation registry at `~/.poem/registry.json`
- Registry management commands: `--list`, `--health`, `--cleanup`
- Port configuration and conflict detection system
- Default port changed from 4321 to 9500
- Port management via `npx poem-os config --port`
- Preservation system (`.poem-preserve`) for safe reinstallation
- Node.js 22.x version requirement validation
- ASCII POEM banner in installer
- Pre-commit hooks with gitleaks secret scanning
- Comprehensive test suite (unit + integration)

#### Story Completion
- Story 1.1: NPX Package Structure & Installation System
- Story 1.2: Comprehensive Testing Infrastructure
- Story 1.3: Command Routing & Help System
- Story 1.4: Config Command Implementation
- Story 1.5: Registry Command Implementation
- Story 1.6: Default Port Migration (4321→9500)
- Story 1.7: Port Validation & Conflict Detection
- Story 1.8: Installation Registry System
- Story 1.9: Installation Preservation System

### Epic 2: Astro Runtime & Handlebars Engine (Complete)

#### Added
- Astro runtime server with Handlebars template engine
- Development/production path resolution (`POEM_DEV` mode)
- Template rendering API endpoints
- Custom Handlebars helpers system
- Health check endpoint (`/api/health`)
- Workflow configuration system
- Config service as single source of truth for paths

#### Story Completion
- Story 2.1: Astro Runtime Foundation
- Story 2.2: Development Mode & Path Resolution
- Story 2.3: Handlebars Helpers System
- Story 2.4: Health Check Endpoint
- Story 2.5: Template Rendering API
- Story 2.6: Workflow Configuration

### Documentation
- Comprehensive README with ASCII banner
- CONTRIBUTING.md with developer workflow
- publishing-guide.md for NPM releases
- CLAUDE.md for AI-assisted development
- Installation and configuration guides
- Development setup documentation

### Infrastructure
- Monorepo structure with npm workspaces
- TypeScript configuration across packages
- ESLint and Prettier for code quality
- Husky pre-commit hooks
- Vitest for testing
- GitHub Actions workflow template (deferred)

## Release Notes

### v0.1.0 - Foundation Complete

This release establishes POEM's core infrastructure with a fully functional installation system, runtime server, and development workflow. The foundation supports multi-project usage, safe reinstallation, and systematic prompt engineering workflows.

**Installation:**
```bash
npx poem-os@latest install
npx poem-os start
```

**Key Capabilities:**
- ✅ NPM package distribution
- ✅ Multi-mode installation (core/app/full)
- ✅ Installation registry and management
- ✅ Port configuration and conflict detection
- ✅ Astro runtime with Handlebars engine
- ✅ Development/production path resolution
- ✅ Template rendering API
- ✅ Safe reinstallation with preservation

**What's Next:**
- Epic 3: Prompt Engineer Agent workflows
- Epic 4: YouTube automation validation
- Epic 5: External provider integrations

---

For detailed development history and story-level changes, see:
- **PRD**: `docs/prd.md`
- **Stories**: `docs/stories/`
- **Architecture**: `docs/architecture.md`

**Last Updated**: 2026-01-21
