# POEM Glossary

**Purpose**: Define domain-specific terminology used throughout POEM documentation

**Last Updated**: 2025-11-21

---

## Core POEM Concepts

### Prompt
**What Angela creates**: The `.hbs` file containing Handlebars markup with placeholders.

**Example**: `enhance-narrative-before-event.hbs`

**Location**: `/poem/prompts/`

**Angela says**: "I'm working on the incident-classifier prompt"

**NOT**: Don't confuse with "rendered prompt" (the final output)

---

### Rendered Prompt
**Final output**: The prompt after Handlebars processing fills all placeholders with actual data.

**Process**: Prompt + Data → Rendered Prompt

**Example**:
- **Prompt**: `Analyze incident for {{participantName}} at {{location}}`
- **Data**: `{participantName: "John Smith", location: "Kitchen"}`
- **Rendered Prompt**: `Analyze incident for John Smith at Kitchen`

**Angela says**: "Show me the rendered prompt" or "Preview with example data"

**Purpose**: What gets sent to the AI (Claude, GPT, etc.)

---

### Placeholder
**Syntax**: `{{variableName}}` in Handlebars

**Purpose**: Variable that gets replaced with actual data during rendering

**Example**: `{{participantName}}`, `{{eventDateTime}}`, `{{location}}`

**Defined in**: Schema file (matching prompt name)

**Rules**:
- Must match schema definition
- Required vs optional specified in schema
- Type-validated (string, number, datetime, etc.)

---

### Schema
**Purpose**: Define structure of placeholders for a prompt

**Format**: JSON file with placeholder definitions

**Location**: `/poem/schemas/[prompt-name].json`

**Contains**:
```json
{
  "promptName": "incident-classifier",
  "description": "...",
  "dataSource": "incident.single",
  "placeholders": {
    "participantName": {
      "type": "string",
      "required": true,
      "description": "Name of participant",
      "example": "John Smith"
    }
  }
}
```

---

### Data Source
**Concept**: Entity type + scope + shape of data feeding a prompt

**Format**: `entity.scope` (e.g., `incident.single`, `moment.collection`)

**Scope Types**:
- **single**: One entity instance
- **collection**: Multiple entity instances
- **view**: Joined/aggregated data (TBD - under consideration)

**Purpose**:
- Determines what placeholders are available
- Drives mock data generation
- Connects prompt to real-world data

**Status**: Conceptually identified, full implementation TBD

---

### Mock Data
**Purpose**: Generated test data for prompt testing without production access

**How**: Auto-generated based on schema + data source

**Why Critical**:
- Privacy/security (no real user data needed)
- Rapid iteration (generate hundreds of scenarios)
- Standalone development (no production database access)

**Example**: Given `participantName: string`, generates "John Smith", "Sarah Jones", etc.

---

### Skill
**Anthropic Concept**: Autonomous, single-responsibility capability

**Structure**: Filesystem-based directories with SKILL.md containing YAML frontmatter

**Progressive Disclosure**:
1. **Level 1 (Metadata)**: name + description (~100 tokens)
2. **Level 2 (Instructions)**: SKILL.md body (<5k tokens)
3. **Level 3+ (Resources)**: Referenced files (unlimited)

**Key Trait**: Can bundle executable code (scripts, applications) that run deterministically

**NOT**: Sub-agents that make LLM calls

**POEM has 8 skills**: Check My Prompt, Preview with Example Data, Generate Placeholder Schema, Find Fields in Data Dictionary, Validate Schema Against Dictionary, Suggest Mappings, Pull Data Dictionary, Publish Prompt

---

### Provider
**Abstraction**: External system that POEM integrates with

**Pattern**: Skill → Astro API → Provider → External System

**Example**: SupportSignal/Convex (current), future REST/GraphQL APIs

**API Endpoints**:
- `POST /api/providers/{provider}/publish-prompt`
- `GET /api/providers/{provider}/read-dictionary`

**Key**: Skills don't know provider specifics (Convex queries, authentication, etc.) - provider handles it

---

### Agent
**POEM Concept**: Role-based AI assistant with specific capabilities

**Three Core Agents**:
1. **Prompt Engineer**: Create/refine prompts
2. **System Agent**: Maintain infrastructure (Astro, Handlebars)
3. **Integration Agent**: Connect to external providers

**Potential Fourth**: Data/Testing Agent (TBD)

**How They Work**: Each agent has access to specific skills and workspaces

---

## BMAD Methodology Terms

### Task
**BMAD Concept**: Workflow procedure - step-by-step instructions

**Format**: Markdown file with numbered steps

**Example**: `create-prompt.md` - guides Prompt Engineer through new prompt creation

**Nature**: LLM-guided workflow (Claude reads and follows steps)

**Location**: `.poem-core/tasks/`

---

### Template (BMAD)
**BMAD Concept**: YAML conversation guide for eliciting information

**Format**: YAML structure with sections and elicitation instructions

**Example**: `prompt-definition-tmpl.yaml` - asks Angela questions to gather prompt requirements

**Purpose**: Structure conversation to collect all needed information

**Nature**: LLM-guided conversation (Claude asks questions in order)

**Location**: `.poem-core/templates/`

**⚠️ IMPORTANT**: This is DIFFERENT from "prompt" (the .hbs file). BMAD uses "template" for conversation guides.

---

### Checklist
**BMAD Concept**: Validation criteria for quality assurance

**Format**: Markdown with checkbox items

**Example**: `prompt-creation-checklist.md` - ensures new prompts meet quality standards

**Nature**: LLM-evaluated or programmatic check

**Location**: `.poem-core/checklists/`

---

## System Architecture Terms

### .poem-core/
**What**: The Operating System (installed once)

**Contains**: agents/, workflows/, brain/ (knowledge), config.yaml

**Analogy**: Like BMAD's `.bmad-core/` - the "OS" for prompt engineering

---

### .poem-app/
**What**: Astro application infrastructure

**Contains**: Visualization pages, API endpoints, services (Handlebars engine, helpers)

**Key Services**:
- `src/services/handlebars/helpers/` - Custom helpers (CODE, not data)
- `src/pages/api/providers/` - Provider integration endpoints

**Port**: 4321 (configurable)

---

### /poem/
**What**: Angela's workspace

**Contains**:
- `prompts/` - .hbs prompts
- `schemas/` - JSON schemas
- `mappings/` - Data mappings

**Note**: Helpers live in `.poem-app/`, NOT here

---

### Handlebars Helper
**What**: Custom JavaScript function for use in prompts

**Location**: `.poem-app/src/services/handlebars/helpers/`

**Example**: `fullName.js` - combines firstName + lastName

**Usage in Prompt**: `{{fullName participant.firstName participant.lastName}}`

**Created**: On-demand by System Agent when Angela needs them

**Nature**: APPLICATION CODE (generated by agent as needed)

---

## Data Flow Terms

### INBOUND (Provider → POEM)
Data coming into POEM from external systems:
- Data Dictionary (field definitions, types)
- Data Source Definitions (entities, relationships)
- Sample Data (optional reference)

---

### OUTBOUND (POEM → Provider)
Data going from POEM to external systems:
- Publish Prompts (deployment to production)

---

### INTERNAL (Within POEM)
Data workflows within POEM:
- Generate Mock Data
- Apply Prompts to Mock Data (rendering)
- Generate Output Data (future: data transformation pipeline)

---

## Terminology NOT in Glossary

**Why excluded**: Common dev terms used conventionally

- **Schema** - Standard term (included because POEM uses it specifically for placeholder definitions)
- **API** - Standard term
- **Workflow** - Standard term
- **JSON**, **YAML** - Standard formats
- **CLI** - Standard term

---

## Confusion to Avoid

### "Template" Has Two Meanings

**WRONG** (confusing):
- "Angela creates a template" ← Could mean prompt OR BMAD template

**RIGHT** (clear):
- "Angela creates a **prompt**" ← The .hbs file
- "Agent loads the **template**" ← BMAD YAML conversation guide

**Fix**: Always specify which you mean, or use "prompt" when referring to .hbs files

---

### "Prompt" Has Two Forms

**WRONG** (unclear):
- "The prompt looks good" ← Which? The .hbs file or the rendered output?

**RIGHT** (specific):
- "The **prompt** validates correctly" ← The .hbs file structure
- "The **rendered prompt** includes the right data" ← Final output after processing

---

## Related Documentation

- [structure.md](./structure.md) - System architecture details
- [bmad-pattern-example.md](./bmad-pattern-example.md) - Concrete example of task/template/checklist
- [skills.md](./skills.md) - Full skill specifications
- [agents.md](./agents.md) - Agent definitions and capabilities

---

**Last Updated**: 2025-11-21
