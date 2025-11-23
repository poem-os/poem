# Project Brief

**Status**: Decided
**BMAD Ready**: Yes
**Last Updated**: 2025-11-08

## Overview

Preliminary planning for the Prompts Application. The architecture will be designed for simplicity, maintainability, and easy integration with the main SupportSignal application.

## Design Principles

1. **Simplicity First**: Start simple, add complexity only when needed
2. **Version Control Native**: Git is the primary version control mechanism (with Claude skill for archiving)
3. **Human-Readable**: Prompts stored in readable formats (Markdown, JSON)
4. **Self-Documenting**: Each prompt includes its own documentation
5. **Direct Integration**: Claude skill makes API calls to main app's Convex database

## Architecture Overview

### Data Layer (Text Files)

```
data/
├── prompts/
│   ├── system/
│   │   ├── classifier-v1.txt
│   │   └── summarizer-v1.txt
│   └── user/
│       └── greeting-v1.txt
├── templates/
│   └── response-template-v1.txt
├── schemas/
│   ├── placeholders/
│   │   └── ticket-schema.json
│   └── data-sources/
│       └── user-context-schema.json
```

### Visualization Layer (Astro)

- Read-only views of prompts and templates
- Hot-reload when files change
- Shows interpolated templates with placeholder values
- Copy-to-clipboard buttons for testing in ChatGPT
- Pure presentation (no CRUD, no database)

### Integration Layer (Claude Skill → API)

- Claude skill makes direct API calls to main app
- Sends template definitions and placeholder schemas (not execution results)
- Main app persists to Convex database
- Triggered manually: "Update the main application with this template"

### Development Workflow

1. **Edit**: Modify text files directly (or via Claude agents)
2. **Visualize**: Astro shows changes immediately
3. **Push**: Use Claude skills to sync to Convex
4. **Deploy**: Main app consumes updated prompts

## Claude-First Development

### Claude Agents

Custom agents for prompt management:
- Create new prompts
- Modify existing templates
- Update placeholder schemas
- Validate prompt structure

### Claude Skills

**Archive Skill**: "Create new version of [prompt]"
- Archives current version to `/archive` folder
- Makes current version available for editing

**Integration Skill**: "Update main app with [template]"
- Reads template file and schemas
- Makes API call to main app's Convex endpoint
- Sends template definition (not execution results)

