# Contributing to POEM

Thank you for your interest in contributing to POEM! This guide will help you get set up for development and understand the development workflow.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing the Installer Locally](#testing-the-installer-locally)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
- [Submitting Changes](#submitting-changes)
- [See Also](#see-also)

## Prerequisites

Before you begin, ensure you have:

- **Node.js 22.x or higher** (`node --version` to check)
- **npm 10.x or higher** (comes with Node.js)
- **Git** for version control
- A code editor (VS Code recommended for Claude Code integration)

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/appydave/poem-os.git
cd poem

# Install dependencies
npm install
```

This installs dependencies for:
- Root workspace
- `packages/poem-core/`
- `packages/poem-app/`

### 2. Verify Installation

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build packages
npm run build
```

All commands should complete without errors.

### 3. Start Development Server

```bash
# Start the Astro development server
npm run dev

# Server runs at http://localhost:9500
```

## Development Workflow

### Common Commands

```bash
# Run all tests (all workspaces)
npm test

# Run unit tests only
npm run test:unit

# Lint code
npm run lint

# Format code
npm run format

# Build all packages
npm run build

# Start dev server (poem-app)
npm run dev
```

### Working with Workspaces

POEM uses npm workspaces. To run commands in specific packages:

```bash
# Run tests in poem-app only
npm run test --workspace=@poem-os/app

# Install a dependency in poem-core
npm install <package> --workspace=@poem-os/core
```

## Testing the Installer Locally

When working on the installer (`bin/install.js`), you need to test it without publishing to NPM. Use `npm link` for local testing.

### Step 1: Create Symbolic Link

```bash
# In the poem repository root
npm link
```

This creates a global symlink so `npx poem-os` points to your local development version.

### Step 2: Test Installation

**Test Full Installation:**
```bash
# Create clean test directory
mkdir -p /tmp/test-poem-full && cd /tmp/test-poem-full

# Run installer (uses your local version)
npx poem-os install

# Verify directories created
ls -la

# Check contents
ls .poem-core .poem-app poem .claude
```

**Test Core-Only Installation:**
```bash
mkdir -p /tmp/test-poem-core && cd /tmp/test-poem-core
npx poem-os install --core
ls -la  # Should only have .poem-core/ and .claude/
```

**Test App-Only Installation:**
```bash
mkdir -p /tmp/test-poem-app && cd /tmp/test-poem-app
npx poem-os install --app
ls -la  # Should only have .poem-app/
```

### Step 3: Cleanup

**Important:** Always unlink when you're done testing.

```bash
# Remove test directories
rm -rf /tmp/test-poem-*

# IMPORTANT: Unlink the global symlink
npm unlink -g poem-os
```

**Why unlink?**
- If you keep it linked, all `npx poem-os` commands anywhere on your system will use your dev version
- This can cause confusion when testing published versions
- Links persist across terminal sessions and can interfere with other projects

**When to use npm link:**
- ✅ **Link:** When actively testing installer changes
- ✅ **Unlink:** When done testing or switching to test published version
- ❌ **Don't leave linked:** Avoid system-wide confusion

### Verifying npm link Status

```bash
# Check if poem-os is linked globally
npm list -g --depth=0 | grep poem-os

# Check where poem-os command points to
which poem-os
```

## Project Structure

```
poem/
├── .bmad-core/              # BMAD Method framework (v4.44.3)
│   ├── agents/              # AI agent personas
│   ├── tasks/               # Executable workflows
│   └── templates/           # Document templates
├── packages/
│   ├── poem-core/           # Framework (agents, workflows, skills)
│   └── poem-app/            # Runtime (Astro server, APIs)
├── bin/
│   └── install.js           # NPM installer script
├── docs/
│   ├── prd.md               # Product requirements
│   ├── architecture.md      # Technical architecture
│   └── stories/             # User stories
├── data/                    # Example data for development
├── .github/workflows/       # CI/CD workflows
├── package.json             # Root workspace config
├── README.md                # User documentation
├── CONTRIBUTING.md          # This file
├── publishing-guide.md            # Release process (maintainers)
└── CLAUDE.md                # AI-assisted development guide
```

### Key Directories

- **`packages/poem-core/`** → Becomes `.poem-core/` when installed
- **`packages/poem-app/`** → Becomes `.poem-app/` when installed
- **`bin/install.js`** → Installer script executed by `npx poem-os install`
- **`docs/`** → Project documentation (not published to NPM)
- **`data/`** → Example data for development (not published to NPM)

## Code Quality

### Before Committing

```bash
# Run linter
npm run lint

# Format code
npm run format

# Run all tests
npm test

# Build to verify no errors
npm run build
```

### Git Hooks

POEM uses Husky for pre-commit hooks:
- Linting is enforced before commits
- Tests should pass before pushing

## Submitting Changes

### Workflow

1. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following coding standards
   - See `docs/architecture/coding-standards.md`
   - Keep changes focused and atomic

3. **Write tests** for new functionality
   - Unit tests: `*.test.ts` files
   - Follow existing test patterns

4. **Update documentation** if needed
   - README.md for user-facing changes
   - CONTRIBUTING.md for developer workflow changes
   - Inline code comments for complex logic

5. **Verify quality checks pass**
   ```bash
   npm run lint
   npm run format
   npm test
   npm run build
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation changes
   - `refactor:` Code refactoring
   - `test:` Test additions/changes
   - `chore:` Maintenance tasks

7. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## BMAD Method Development

POEM is developed using the **BMAD Method v4** - an AI-assisted development methodology with specialized agents and workflows.

### For BMAD Developers

If you're using Claude Code with BMAD agents:

1. **Read CLAUDE.md first** - Complete guide to BMAD integration
2. **Use agent personas** via slash commands:
   - `/BMad/agents/sm` - Scrum Master (story creation)
   - `/BMad/agents/dev` - Developer (implementation)
   - `/BMad/agents/qa` - Test Architect (quality review)
3. **Follow story-driven development** - All work traces to stories in `docs/stories/`

### Key BMAD Documents

- **`.bmad-core/user-guide.md`** - Complete BMAD methodology
- **`docs/stories/`** - User stories and acceptance tests
- **`docs/qa/`** - Quality assessments and gates

## See Also

- **[README.md](README.md)** - User installation and getting started
- **[publishing-guide.md](publishing-guide.md)** - NPM publishing process (maintainers only)
- **[CLAUDE.md](CLAUDE.md)** - AI-assisted development with Claude Code
- **[docs/prd.md](docs/prd.md)** - Product requirements
- **[docs/architecture.md](docs/architecture.md)** - Technical architecture
- **[docs/architecture/coding-standards.md](docs/architecture/coding-standards.md)** - Code style guide

## Questions or Issues?

- **Issues:** https://github.com/appydave/poem-os/issues
- **Discussions:** Use GitHub Discussions for questions
- **Documentation:** Check `docs/` for detailed technical docs

---

**Last Updated:** 2026-01-13
