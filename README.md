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

By default, POEM runs on port 4321. You can override this:

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

### Troubleshooting

**Error: POEM is not installed**
```bash
# Solution: Install POEM first
npx poem-os install
```

**Error: Port already in use**
```bash
# Solution: Use a different port
npx poem-os start --port=4322
# Or permanently change it
npx poem-os config --port 4322
```

**Running multiple POEM instances**
```bash
# Terminal 1 (project A)
cd ~/projects/project-a
npx poem-os start  # Port 4321

# Terminal 2 (project B)
cd ~/projects/project-b
npx poem-os config --port 4322
npx poem-os start  # Port 4322
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

## Status

**Current Phase**: Planning complete - BMAD implementation in progress

This project uses the [BMAD Method](https://github.com/bmadcode/bmad-method) for structured AI-driven development.

## Contributing

We welcome contributions! If you'd like to contribute to POEM development:

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Complete guide for developers including setup, testing, and workflow
- **[PUBLISHING.md](PUBLISHING.md)** - Release process for maintainers

**Quick Start for Contributors:**
```bash
git clone https://github.com/appydave/poem-os.git
cd poem
npm install
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on local testing, development workflow, and submitting changes.

## Documentation

- **[Complete Overview](docs/planning/POEM.md)** - Full requirements and vision
- **[Architecture](docs/planning/system-explorations/)** - System design explorations

## License

MIT License - see [LICENSE](LICENSE) for details

## Links

- **NPM Package**: [`poem-os`](https://www.npmjs.com/package/poem-os)
- **Repository**: [github.com/appydave/poem-os](https://github.com/appydave/poem-os)
- **Issues**: [GitHub Issues](https://github.com/appydave/poem-os/issues)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for developer guide
- **Publishing**: See [PUBLISHING.md](PUBLISHING.md) for maintainer release process

---

**Tagline**: _Compose. Test. Refine. Deploy._
