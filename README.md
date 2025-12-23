# POEM - Prompt Orchestration and Engineering Method

> _Poetry in Prompt Engineering_

**POEM** is a Prompt Engineering Operating System designed for systematic creation, testing, and deployment of AI prompts with schemas, templates, and mock data generation.

## Quick Start

```bash
# Install POEM in your project (coming soon)
npx poem-os install           # Everything (.poem-core/ + .poem-app/)
npx poem-os install --core    # Just the framework
npx poem-os install --app     # Just the runtime
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

## Development Setup

```bash
# Clone and install
git clone https://github.com/poem-os/poem.git
cd poem
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint and format
npm run lint
npm run format
```

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

## Documentation

- **[Complete Overview](docs/planning/POEM.md)** - Full requirements and vision
- **[Architecture](docs/planning/system-explorations/)** - System design explorations

## License

MIT License - see [LICENSE](LICENSE) for details

## Links

- **NPM Package**: `poem-os` (coming soon)
- **Organization**: [poem-os](https://github.com/poem-os)
- **Issues**: [GitHub Issues](https://github.com/poem-os/poem/issues)

---

**Tagline**: _Compose. Test. Refine. Deploy._
