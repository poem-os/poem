# /poem/help Command

Display available POEM slash commands and usage information.

## Available POEM Slash Commands

### Agents

| Command | Description |
|---------|-------------|
| `/poem/agents/prompt-engineer` | Activate the Prompt Engineer agent (Petra) for creating, refining, testing, and validating AI prompts |

### Coming Soon

| Command | Description |
|---------|-------------|
| `/poem/agents/system-agent` | System Agent for managing POEM infrastructure and creating custom Handlebars helpers |
| `/poem/agents/integration-agent` | Integration Agent for connecting to external systems and managing providers |
| `/poem/agents/mock-data-agent` | Mock/Test Data Agent for generating realistic test data |

## Usage

To activate an agent, type the slash command in Claude Code:

```
/poem/agents/prompt-engineer
```

The agent will greet you and display available commands. All agent commands use the `*` prefix:

- `*help` - Show agent's available commands
- `*exit` - End the agent session

## POEM Structure

When POEM is installed, your project contains:

```
.poem-core/           # Framework documents (agents, workflows, skills)
.poem-app/            # Runtime server (Astro + Handlebars)
.claude/commands/poem/ # Slash command wrappers
poem/                 # Your workspace (prompts, schemas, config)
```

## Getting Started

1. Install dependencies: `cd .poem-app && npm install`
2. Start the server: `npm run dev`
3. Activate an agent: `/poem/agents/prompt-engineer`
4. Create your first prompt: `*new`

## More Information

- POEM documentation: `.poem-core/data/poem-principles.md`
- Prompt best practices: `.poem-core/data/prompt-best-practices.md`
