```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  ██████╗  ██████╗ ███████╗███╗   ███╗                         ║
║  ██╔══██╗██╔═══██╗██╔════╝████╗ ████║                         ║
║  ██████╔╝██║   ██║█████╗  ██╔████╔██║                         ║
║  ██╔═══╝ ██║   ██║██╔══╝  ██║╚██╔╝██║                         ║
║  ██║     ╚██████╔╝███████╗██║ ╚═╝ ██║                         ║
║  ╚═╝      ╚═════╝ ╚══════╝╚═╝     ╚═╝                         ║
║                                                               ║
║   Prompt Orchestration & Engineering Method                   ║
║   v0.1.0                                                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

# POEM - Prompt Orchestration and Engineering Method

> _Poetry in Prompt Engineering_

**POEM** is a Prompt Engineering Operating System designed for systematic creation, testing, and deployment of AI prompts with schemas, templates, and mock data generation.

## Installation

Install POEM into your project using npx:

```bash
# Full installation (framework + runtime)
npx poem-os install

# Framework only (agents, workflows, skills)
npx poem-os install --core

# Runtime only (Astro server, APIs)
npx poem-os install --app

# Force overwrite existing installation
npx poem-os install --force

# Verbose output for debugging
npx poem-os install --verbose
```

**Requirements**: Node.js 22.x or higher

**What Gets Installed**:
- `.poem-core/` - Framework documents (agents, workflows, skills)
- `.poem-app/` - Runtime server (Astro, Handlebars, APIs)
- `.claude/commands/poem/` - Claude Code slash commands
- `poem/` - Your workspace (prompts, schemas, config)

**After Installation**:
```bash
# Start the POEM server (from project root)
npx poem-os start

# Or start with custom port
npx poem-os start --port=3000

# View current configuration
npx poem-os config --list

# Change port permanently
npx poem-os config --port 8080

# Activate Prompt Engineer agent in Claude Code
/poem/agents/prompt-engineer
```

**Note**: Dependencies are installed automatically during `npx poem-os install`. For offline/air-gapped environments, use `--skip-deps` and install manually:
```bash
npx poem-os install --skip-deps
cd .poem-app && npm install && cd ..
```

**Next Steps**:
- **[Getting Started with Workflows](docs/user-guide/getting-started-with-workflows.md)** - Learn when you need workflows vs standalone prompts, and how to build your first workflow

## Usage

### Starting the Server

Start POEM from your project root:

```bash
npx poem-os start
```

By default, POEM runs on port 9500. You can override this:

```bash
# Temporary port override (this session only)
npx poem-os start --port=3000
```

### Configuration Management

View your current POEM configuration:

```bash
npx poem-os config --list
```

Change the server port permanently:

```bash
npx poem-os config --port 8080
```

**Port Requirements**: Port numbers must be between 1024 and 65535.

### Installation Registry Management

POEM maintains a registry of all installations at `~/.poem/registry.json`. This allows managing multiple POEM installations across different projects.

**List all installations:**

```bash
npx poem-os registry --list
```

Shows all POEM installations on your system with details:
- Installation ID and status (active/inactive/missing)
- Installation path
- Configured port
- POEM version
- Development/production mode
- Git branch (if in a git repository)
- Installation and last checked timestamps

**Check installation health:**

```bash
npx poem-os registry --health
```

Scans all registered installations and updates their status:
- Verifies installation directories exist
- Updates git branch information
- Marks missing installations
- Updates last checked timestamps

**Clean up missing installations:**

```bash
npx poem-os registry --cleanup
```

Removes installations from the registry that no longer exist on disk. This is useful after deleting project directories.

**Port Conflict Prevention:**

The registry automatically prevents port conflicts between installations:
- During `install`: Detects if chosen port is already allocated and suggests alternatives
- During `config --port`: Validates port is available before updating configuration
- Suggestions use increments of 10 (e.g., 9500, 9510, 9520, 9530)

### Preserving Your Files During Updates

POEM protects your custom files during reinstallation using a `.poem-preserve` file. This ensures you can safely update POEM without losing your work.

**What Gets Preserved:**
- `poem/` - Your workspace (prompts, schemas, mock data)
- `dev-workspace/` - Development workspace (if exists)
- `.poem-app/.env` - Your port configuration and environment settings
- User-created workflows in `.poem-core/workflows/`
- Any custom paths you add to `.poem-preserve`

**What Gets Updated:**
- Framework files (agents, skills, templates)
- Runtime server (`.poem-app/` except `.env`)
- Framework workflows (create-prompt, refine-prompt, etc.)

**The `.poem-preserve` File:**

Created automatically during installation at your project root:

```
# .poem-preserve
# Files/folders protected from overwriting during POEM installation

# User workspace - always preserved
poem/

# Dev workspace - always preserved (if exists)
dev-workspace/

# User configuration - always preserved
.poem-app/.env

# Add custom preservation rules below:
# .poem-core/my-custom-workflow.yaml
# .poem-core/templates/my-template.hbs
```

**Adding Custom Preservation Rules:**

To protect additional files, add them to `.poem-preserve`:

```bash
# Example 1: Preserve a custom workflow
echo ".poem-core/workflows/my-project-workflow.yaml" >> .poem-preserve

# Example 2: Preserve custom templates
echo ".poem-core/templates/my-custom-template.hbs" >> .poem-preserve

# Example 3: Preserve project-specific configuration
echo "poem/config/my-project.yaml" >> .poem-preserve
```

**Reinstallation Confirmation:**

When running `npx poem-os install` over an existing installation, you'll see a summary:

```
POEM Installation Summary:
──────────────────────────────────────────────────
  Files to update: 47 (framework files)
  Files preserved: 3 (user content)
  Folders preserved: poem/, dev-workspace/

This will overwrite 47 file(s). Continue? [y/N]:
```

- Enter `y` or `Y` to proceed with the update
- Enter `n`, `N`, or press Enter to cancel (safe default)

**Modified Files Warning:**

If you've modified framework files, you'll be warned:

```
⚠️ 2 file(s) were modified and will be overwritten:
    - .poem-core/agents/prompt-engineer.md
    - .poem-app/src/services/config.ts
```

**Best Practices:**
1. Never modify framework files directly - they'll be overwritten during updates
2. Create custom workflows instead of modifying framework workflows
3. Use `.poem-preserve` to protect project-specific customizations
4. Review the installation summary before confirming updates
5. Keep `.poem-preserve` in version control with your project

**User Workflows Detection:**

POEM automatically preserves user-created workflows in `.poem-core/workflows/`:
- Framework workflows (create-prompt.yaml, refine-prompt.yaml, etc.) - updated during reinstall
- All other `.yaml` files in workflows/ - automatically preserved

### Troubleshooting

**Error: POEM is not installed**
```bash
# Solution: Install POEM first
npx poem-os install
```

**Error: Port already in use**
```bash
# Solution: Use a different port
npx poem-os start --port=9510
# Or permanently change it
npx poem-os config --port 9510
```

**Running multiple POEM instances**
```bash
# Terminal 1 (project A)
cd ~/projects/project-a
npx poem-os start  # Port 9500

# Terminal 2 (project B)
cd ~/projects/project-b
npx poem-os config --port 9510
npx poem-os start  # Port 9510
```

## What is POEM?

POEM provides a structured framework for:

- **Creating AI prompts** with Handlebars templates
- **Generating mock data** for testing without production access
- **Validating schemas** against data dictionaries
- **Publishing prompts** to external systems (SupportSignal, Convex, etc.)
- **Transforming data** using prompt pipelines

## Who is it for?

- **Prompt Engineers** building systematic AI workflows
- **Teams** developing AI-powered applications
- **Anyone** needing reproducible prompt development and deployment

## Project Structure

```
poem-os/
├── packages/
│   ├── poem-core/          # Framework (agents, workflows, skills)
│   └── poem-app/           # Runtime (Astro server, APIs)
├── docs/                   # Documentation
├── data/                   # Example data
├── package.json            # Monorepo root
└── tsconfig.json           # Shared TypeScript config
```

## Architecture

POEM uses a three-part structure:

1. **`.poem-core/`** - Framework (agents, workflows, knowledge base)
2. **`.poem-app/`** - Runtime (Astro server, Handlebars engine, APIs)
3. **`/poem/`** - User workspace (prompts, schemas, mappings)

## Key Features

✨ **Mock Data Generation** - Test prompts without production data
📝 **Schema-Driven Prompts** - Type-safe AI interactions
🎨 **Template Management** - Handlebars-based reusability
🔄 **Mapping System** - Transform between data formats
🚀 **Integration Tools** - Deploy prompts to applications
📂 **Multi-Workflow Support** - Organize prompts by project with independent reference materials

## Status

**Current Phase**: Foundation Complete - Core Features In Progress

- ✅ **Epic 1: Foundation & Monorepo Setup** (Complete) - NPM package, installer, registry, port configuration
- ✅ **Epic 2: Astro Runtime & Handlebars Engine** (Complete) - Template rendering, API endpoints
- 🚧 **Epic 3: Prompt Engineer Agent & Core Workflows** (In Progress) - Agent-guided prompt development
- 🚧 **Epic 4: YouTube Automation Workflow** (In Progress) - System validation with 53-prompt workflow

This project uses the [BMAD Method](https://github.com/bmadcode/bmad-method) for structured AI-driven development.

## Contributing

We welcome contributions! If you'd like to contribute to POEM development:

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Complete guide for developers including setup, testing, and workflow
- **[publishing-guide.md](publishing-guide.md)** - Release process for maintainers
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes

**Quick Start for Contributors:**
```bash
git clone https://github.com/appydave/poem-os.git
cd poem
npm install
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on local testing, development workflow, and submitting changes.

## Documentation

- **[Complete Overview](docs/planning/poem-requirements.md)** - Full requirements and vision
- **[Architecture](docs/planning/system-explorations/)** - System design explorations

## License

MIT License - see [LICENSE](LICENSE) for details

## Links

- **NPM Package**: [`poem-os`](https://www.npmjs.com/package/poem-os)
- **Repository**: [github.com/appydave/poem-os](https://github.com/appydave/poem-os)
- **Issues**: [GitHub Issues](https://github.com/appydave/poem-os/issues)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for developer guide
- **Publishing**: See [publishing-guide.md](publishing-guide.md) for maintainer release process

---

**Tagline**: _Compose. Test. Refine. Deploy._
