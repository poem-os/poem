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
# Install runtime dependencies
cd .poem-app && npm install

# Start the development server
npm run dev

# Activate Prompt Engineer agent in Claude Code
/poem/agents/prompt-engineer
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
