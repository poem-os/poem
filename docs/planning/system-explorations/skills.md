# POEM Skills

**Extracted from**: claude-skills.md (moved from planning root)
**Last Updated**: 2025-11-20
**Status**: Architecture definition

---

## Overview

POEM has **8 core skills** that enable prompt engineering workflows. Skills are autonomous, single-responsibility entities that suggest when they're useful. Claude decides which skill to use based on context.

## Reference Documentation

For implementation details and technical patterns, see:

**Official Anthropic Documentation**:

- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [Skills Specification](https://github.com/anthropics/skills/blob/main/agent_skills_spec.md)
- [Engineering Blog: Equipping Agents](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

**Local Reference Materials**:

- Skills knowledge base: `/Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/INDEX.md`
- Example skills repository: `/Users/davidcruwys/dev/js_3rd/anthropic-skills/`
- Anthropic SDK: `/Users/davidcruwys/dev/js_3rd/anthropic-sdk-typescript/`

**Key Concepts**:

- **Progressive Disclosure**: 3 levels (metadata → instructions → resources)
- **Filesystem-based**: Skills are directories with SKILL.md containing YAML frontmatter
- **Discovery**: `description` field determines when Claude activates the skill
- **Surfaces**: Claude.ai, Claude Code, API, SDK - skills work across all platforms

---

## Skill Catalog (8 Total)

### Prompt & Schema Skills

1. Check My Prompt
2. Generate Placeholder Schema
3. Preview with Example Data

### Data Dictionary Skills

4. Find Fields in Data Dictionary
5. Validate Schema Against Dictionary
6. Suggest Mappings

### Integration Skills

7. Pull Data Dictionary
8. Publish Prompt

---

## Skill 1: Publish Prompt

**What Angela says**: "I'm ready to publish this prompt"

**Purpose**: Deploy prompt to external provider (SupportSignal/Convex, future providers)

**How it works**:

1. Reads prompt + schema from `/poem/` workspace
2. Validates prompt structure and schema
3. Calls Astro API provider endpoint
4. Provider handles authentication, formatting, and deployment
5. Reports status back to Angela

**Architecture Pattern**:

```
Skill → Astro API → Provider → External System
        (localhost:4321/api/providers/[name]/publish-template)
```

**Actions**:

1. Read prompt file (`.hbs`)
2. Read associated schema (`.json`)
3. Call Astro provider API:
   ```
   POST http://localhost:4321/api/providers/{provider}/publish-prompt
   {
     "promptName": "...",
     "promptContent": "...",
     "schema": {...}
   }
   ```
4. Provider handles specifics (Convex, REST API, GraphQL, etc.)
5. Return success/failure status

**Input**:

- Prompt name
- Provider name (from config, defaults to "supportsignal")

**Output**:

- Success/failure status
- Provider-specific ID (if successful)
- Error details (if failed)

**Example Usage**:

```
Angela: "Publish support-ticket-classifier"
Skill: Validates prompt → Calls Astro API → Provider deploys
Response: "Published to SupportSignal. Prompt ID: abc123"
```

**Key Abstraction**: Skill doesn't know about Convex, REST, authentication, etc. Provider handles all provider-specific logic.

---

## Skill 2: Check My Prompt

**What Angela says**: "Can you check if my prompt is correct?"

**Purpose**: Validate prompt structure and compliance

**Actions**:

1. Read prompt file
2. Read placeholder schema
3. Validate:
   - Prompt has content
   - **Handlebars syntax is valid** (programmatic check, not LLM)
   - All `{{placeholders}}` match schema
   - No undefined placeholders used in prompt
   - Schema file exists and is valid JSON
   - All required schema fields present
4. Report validation results with specific issues

**Input**:

- Prompt name

**Output**:

- Validation status (pass/fail)
- List of issues found
- Suggestions for fixes

**Example Usage**:

```
Angela: "Check enhance-narrative-before-event"
Skill: Reads and validates files
Response: "✓ Prompt structure valid
          ✓ Handlebars syntax correct
          ✓ All placeholders defined in schema
          ⚠ Warning: {{location}} not marked as required in schema
          ✓ Schema file complete"
```

**Note**: Handlebars validation should be programmatic (parse with Handlebars compiler), not LLM-based.

---

## Skill 3: Preview with Example Data

**What Angela says**: "Show me what this looks like with real data"

**Purpose**: Generate example output with sample data for testing

**Actions**:

1. Read prompt file
2. Read placeholder schema
3. Use example values from schema to substitute placeholders
4. Render prompt with Handlebars (if applicable)
5. Output fully rendered prompt
6. Optionally copy to clipboard

**Input**:

- Prompt name

**Output**:

- Fully rendered prompt text
- Copy-to-clipboard option

**Example Usage**:

```
Angela: "Preview enhance-narrative-before-event"
Skill: Substitutes example values and renders
Response: Shows rendered prompt with sample data
          "You are an expert NDIS incident documentation specialist...

           Incident Overview:
           - Participant: John Smith
           - Date/Time: 2025-11-08 14:30
           - Location: Kitchen
           - Reporter: Sarah Jones

           [Copied to clipboard for ChatGPT testing]"
```

---

## Skill 4: Generate Placeholder Schema

**What Angela says**: "I just made a prompt, create the schema for it"

**Purpose**: Auto-generate schema file from prompt placeholders

**Actions**:

1. Read prompt file
2. Extract all `{{placeholder}}` references
3. Analyze context around each placeholder (to infer type)
4. Generate schema structure:
   ```json
   {
     "promptName": "...",
     "description": "...",
     "dataSource": "...",
     "placeholders": {
       "placeholderName": {
         "type": "string",
         "required": true,
         "description": "...",
         "example": "..."
       }
     }
   }
   ```
5. Write to `data/schemas/[prompt-name].json`
6. Ask Angela to review and fill in descriptions/examples

**Input**:

- Prompt name

**Output**:

- Generated schema file path
- List of placeholders found
- Request for Angela to add descriptions

**Example Usage**:

```
Angela: "Generate schema for my-new-prompt"
Skill: Parses prompt, creates schema
Response: "Created data/schemas/my-new-prompt.json with 5 placeholders:
          - participantName (inferred: string)
          - eventDate (inferred: datetime)
          - location (inferred: string)
          - description (inferred: text)
          - severity (inferred: string)

          Please review and add descriptions/examples for each field."
```

---

## Skill 5: Find Fields in Data Dictionary

**What Angela says**: "What fields are available for incidents?"

**Purpose**: Search data dictionary for available fields

**Actions**:

1. Load data dictionary (e.g., `data/data-dictionary.json`)
2. Search for data source (e.g., "incident")
3. List all available fields with:
   - Field name
   - Type
   - Description
   - Example value
   - Path (for nested fields)
4. Optionally filter by field name keyword

**Input**:

- Data source name (e.g., "incident", "shift_note", "moment")
- Optional: field name filter

**Output**:

- List of matching fields with details
- Total count

**Example Usage**:

```
Angela: "Find fields in incident data source"
Skill: Searches data dictionary
Response: "Found 15 fields in 'incident' data source:

          participantName (string) - Name of participant
            Example: 'John Smith'
            Path: participantName

          eventDateTime (datetime) - When incident occurred
            Example: '2025-11-08 14:30'
            Path: eventDateTime

          [... 13 more fields ...]"
```

---

## Skill 6: Validate Schema Against Dictionary

**What Angela says**: "Does my schema match the data dictionary?"

**Purpose**: Check schema placeholders exist in data dictionary

**Actions**:

1. Read schema file
2. Load data dictionary
3. For each placeholder in schema:
   - Check if field exists in data source
   - Verify type matches
   - Check if path is correct
4. Report mismatches or missing fields

**Input**:

- Schema name
- Data source name

**Output**:

- Validation status
- List of issues (missing fields, type mismatches, incorrect paths)
- Suggestions

**Example Usage**:

```
Angela: "Validate my-template schema against incident"
Skill: Cross-references schema with dictionary
Response: "✓ 4 fields match data dictionary
          ⚠ Field 'participantFullName' not found in data dictionary
             Suggestion: Use 'participantName' instead
          ⚠ Field 'location' type mismatch:
             Schema: text
             Dictionary: string
          ✓ All required fields available"
```

---

## Skill 7: Pull Data Dictionary

**What Angela says**: "Update my data dictionary"

**Purpose**: Import latest data dictionary from external provider

**How it works**:

1. Calls Astro API provider endpoint
2. Provider fetches from external system (Convex, REST API, etc.)
3. Saves data dictionary to `/poem/` workspace
4. Reports changes (new/modified/removed fields)

**Architecture Pattern**:

```
Skill → Astro API → Provider → External System
        (localhost:4321/api/providers/[name]/read-dictionary)
```

**Actions**:

1. Call Astro provider API:
   ```
   GET http://localhost:4321/api/providers/{provider}/read-dictionary
   ```
2. Provider returns standardized data dictionary format
3. Save to workspace (location configurable)
4. Diff against previous version
5. Report changes to Angela

**Input**:

- Provider name (from config, defaults to "supportsignal")
- Optional: specific data sources to fetch

**Output**:

- Updated file location
- Change summary (new/modified/removed fields)
- Field count and data source count

**Example Usage**:

```
Angela: "Pull data dictionary"
Skill: Calls Astro API → Provider fetches → Saves to workspace
Response: "Updated data dictionary from SupportSignal

          Changes:
          + incident.impactRating (new field)
          + shift_note.priority_level (new field)
          ~ moment.person.preferred_name (description updated)

          3 data sources, 47 total fields"
```

**Key Abstraction**: Skill doesn't know how provider fetches data (Convex query, REST, GraphQL, etc.). Provider handles authentication and formatting.

---

## Skill 8: Suggest Mappings

**What Angela says**: "Help me map moment data to this prompt"

**Purpose**: Recommend field mappings based on similarity

**Actions**:

1. Read prompt schema
2. Load data dictionary
3. For each placeholder in prompt:
   - Find fields in target data source with similar names
   - Check type compatibility
   - Score by similarity
4. Generate suggested mapping file
5. Ask Angela to review

**Input**:

- Prompt name
- Target data source

**Output**:

- Suggested mapping file (simple or requirements format)
- Confidence score for each suggestion
- Fields that couldn't be mapped

**Example Usage**:

```
Angela: "Suggest mappings for analysis-predicate to moment data"
Skill: Analyzes schema and dictionary, suggests mappings
Response: "Created data/mappings/analysis-predicate.moment.json (DRAFT)

          Confident matches (90%+):
          - context → moment.observation_notes
          - question → [requires manual input]

          Review and adjust before using."
```

---

## Future Skills (Ideas for Later)

| Skill Name          | What Angela Says                     | Purpose                                     |
| ------------------- | ------------------------------------ | ------------------------------------------- |
| Batch Validate All  | "Check all my prompts"               | Validate all prompts at once                |
| Compare Versions    | "Show me what changed"               | Diff current vs archived                    |
| List Placeholders   | "What placeholders can I use?"       | Show available placeholders for data source |
| Create from Prompt  | "Make a new prompt like this one"    | Scaffold new prompt from existing           |
| Test with Real Data | "Try this with actual incident data" | Run against real data from main app         |

---

## Skill Development Guidelines

### User-Friendly Naming

- Name skills based on what Angela would say
- Avoid technical jargon
- Use natural language triggers
- **Recommended format**: Gerund form (e.g., `processing-pdfs`, `validating-prompts`)

### Single Responsibility

- Each skill does ONE thing well
- Don't combine multiple operations

### Clear Triggers

- User should know exactly how to invoke
- Support multiple phrasings

### Helpful Output

- Always confirm what was done
- Provide next steps
- Surface errors clearly

### Validation Approach

- **Programmatic validation** (syntax, structure) - Use code/parsers
- **LLM validation** (semantics, context) - Only when appropriate

### Error Handling

- Gracefully handle missing files
- Provide specific error messages
- Suggest fixes when possible

### File Paths

- Always use absolute or project-relative paths
- Check files exist before operations
- **Always use forward slashes** (Unix-style, not Windows `\`)

### Git Integration

- Commit meaningful changes
- Descriptive messages
- Include timestamp/context

---

## Technical Implementation

### Skill File Structure

Each skill should follow the standard Anthropic structure:

```
skill-name/
├── SKILL.md           # Required: Main skill file with YAML frontmatter
├── reference/         # Optional: Additional reference materials
│   └── details.md
└── scripts/           # Optional: Utility scripts
    └── helper.py
```

### SKILL.md Format

```yaml
---
name: skill-name # Required: lowercase, hyphens only, max 64 chars
description: What the skill does... # Required: max 1024 chars, include WHAT and WHEN
---
# Skill Name

[Instructions in markdown...]
```

**Field Requirements**:

**name**:

- Maximum 64 characters
- Lowercase letters, numbers, hyphens only
- No XML tags
- Cannot contain: "anthropic", "claude"
- Must match directory name

**description**:

- Maximum 1024 characters
- Non-empty, no XML tags
- **Use third person**: "Validates prompt..." not "I can validate..."
- Include both **WHAT** skill does and **WHEN** to use it
- Include key terms for discovery

### Progressive Disclosure Pattern

Following Anthropic's architecture:

- **Level 1 (Metadata)**: Always loaded (~100 tokens) - `name` and `description` from YAML
- **Level 2 (Instructions)**: Loaded when triggered (<5k tokens) - SKILL.md body
- **Level 3+ (Resources)**: Loaded as needed - Referenced files (effectively unlimited)

**Benefits**:

- Install many skills without context penalty
- Unbounded complexity through referenced files
- Efficient code execution (scripts run without loading into context)

**Best Practices**:

- Keep SKILL.md under 500 lines (split into reference files if larger)
- Reference files should be **one level deep** (avoid deeply nested references)
- Move specialized content to separate files loaded on-demand

**Example for "Check My Prompt"**:

```markdown
# Check My Prompt

## Quick validation

- Prompt has content
- Handlebars syntax is valid (use programmatic parser)
- All placeholders match schema

For detailed validation rules, see [VALIDATION_RULES.md](VALIDATION_RULES.md)
For schema compliance checks, see [SCHEMA_VALIDATION.md](SCHEMA_VALIDATION.md)
```

### Degrees of Freedom

Match specificity to task requirements:

**High Freedom** (Text-based instructions):

- Use when multiple approaches are valid
- Decisions depend on context
- Example: Code reviews, content analysis

**Medium Freedom** (Pseudocode or parameterized scripts):

- Use when preferred pattern exists
- Some variation acceptable
- Example: Report generation with format options

**Low Freedom** (Specific scripts, few/no parameters):

- Use when operations are fragile
- Consistency is critical
- Example: Database migrations, form filling

---

## Testing & Validation

### Evaluation-Driven Development

Before building each skill:

1. **Identify gaps**: Test current workflow without skill, document failures
2. **Create evaluations**: Build 3+ test scenarios
3. **Establish baseline**: Measure Claude's performance without skill
4. **Write minimal instructions**: Address gaps efficiently
5. **Iterate**: Execute evaluations, refine based on results

### Example Evaluation Structure

```json
{
  "skills": ["check-prompt"],
  "query": "Check if enhance-narrative-before-event prompt is correct",
  "files": [
    "data/prompts/enhance-narrative-before-event.hbs",
    "data/schemas/enhance-narrative-before-event.json"
  ],
  "expected_behavior": [
    "Validates Handlebars syntax programmatically",
    "Confirms all placeholders match schema",
    "Reports any undefined placeholders",
    "Verifies schema file is valid JSON"
  ]
}
```

### Testing Across Models

Test each skill with different Claude models:

- **Claude Haiku** (fast, economical) - Does skill provide enough guidance?
- **Claude Sonnet** (balanced) - Is skill clear and efficient?
- **Claude Opus** (powerful reasoning) - Does skill avoid over-explaining?

### Iterative Development with Claude

**Pattern**: Claude A (expert helper) → create/refine skill → Claude B (agent tester) → observe → iterate

1. **Complete task without skill**: Work through problem, notice repeated context
2. **Identify reusable pattern**: What information helps similar tasks?
3. **Ask Claude to create skill**: "Create a skill that captures this pattern"
4. **Review for conciseness**: Remove unnecessary explanations
5. **Test on similar tasks**: Use skill with fresh Claude session
6. **Iterate based on observation**: Refine based on actual usage

---

**Last Updated**: 2025-11-18
