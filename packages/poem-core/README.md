# @poem-os/core

POEM Core package containing agents, workflows, skills, and templates for the Prompt Orchestration and Engineering Method.

## Overview

This package provides the framework components that define how POEM agents operate, guide workflows, and provide autonomous skills for prompt engineering.

## Directory Structure

```
poem-core/
├── agents/              # AI agent personas
│   └── prompt-engineer.md
├── workflows/           # Multi-step guided processes
│   └── new-prompt.yaml
├── skills/              # Autonomous capabilities
│   └── check-my-prompt.md
├── templates/           # Reusable templates
├── data/                # Knowledge base and reference data
├── core-config.yaml     # POEM configuration
└── README.md
```

## Components

### Agents

Agents are AI personas with specific roles that guide users through workflows. Each agent has:

- **Activation instructions**: How to initialize the agent
- **Persona**: Role, style, identity, and principles
- **Commands**: Available actions (prefixed with `*`)
- **Dependencies**: Workflows and skills the agent uses

**Available Agents:**
- `prompt-engineer.md` - Expert for creating, refining, testing, and validating prompts

### Workflows

Workflows are YAML-defined multi-step processes that agents execute:

- **Steps**: Sequential actions with types (elicit, action, output)
- **Elicitation**: User interaction points for gathering input
- **Actions**: API calls, skill invocations, file operations
- **Outputs**: Files created by the workflow

**Available Workflows:**
- `new-prompt.yaml` - Create a new prompt with schema and optional mock data

### Skills

Skills are autonomous capabilities that Claude invokes contextually:

- **Self-describing**: Explain when they should be used
- **API-integrated**: Call POEM runtime endpoints
- **Focused**: Single responsibility per skill

**Available Skills:**
- `check-my-prompt.md` - Validate prompt structure and quality

## Configuration

The `core-config.yaml` file configures POEM:

```yaml
version: "1.0.0"

server:
  port: 4321
  host: localhost

workspace:
  prompts: poem/prompts
  schemas: poem/schemas
  mockData: poem/mock-data
  config: poem/config
  workflowData: poem/workflow-data

logging:
  level: info

features:
  hotReload: true
  mockDataGeneration: true
```

## BMAD Pattern

POEM follows the BMAD (BMAD Method) v4 pattern for agent-driven development:

- Agents as specialized personas with defined behaviors
- Workflows as executable task definitions
- Skills as autonomous, context-aware capabilities
- YAML + Markdown for human-readable, AI-parseable documents

## Installation

This package is installed as part of POEM:

```bash
npx poem-os install
```

The contents are copied to `.poem-core/` in your project.

## Usage

After installation, activate agents via Claude Code slash commands:

```
/poem/agents/prompt-engineer
```

Then use agent commands:

```
*help     # Show available commands
*new      # Create a new prompt
*test     # Test a prompt with data
*validate # Validate prompt quality
```

## License

MIT
