# Generate Schema

A skill that automatically extracts a unified JSON schema (input and output sections) from Handlebars prompt templates by analyzing placeholders and output format comments.

## When to Use

Invoke this skill when:
- Creating a new prompt template and need to generate a schema
- An existing prompt is missing its schema file
- Template placeholders have changed and schema needs updating
- You want to ensure schema matches template requirements
- Documenting template data requirements

## What It Does

This skill automatically generates a unified schema for prompts:

1. **Input Schema Extraction**: Analyzes template placeholders to generate input data schema section
2. **Output Schema Extraction**: Parses template comments for expected output structure section
3. **Helper Detection**: Identifies required Handlebars helpers used in template
4. **Unified Schema Creation**: Saves single schema file with both input and output sections to workspace

## How It Works

1. Load the prompt template from workspace (or use template in context)
2. Call `POST /api/schema/extract` to extract unified schema structure
3. Parse template for output format comments (HTML or Handlebars comments)
4. Extract output structure from "Expected Output" or "Output Format" sections
5. Generate input section from placeholders (field names and inferred types)
6. Generate output section from parsed output structure (if present, otherwise omit)
7. Combine into unified schema with `templateName`, `version`, `input`, and optional `output` sections
8. Save unified schema as `{prompt-name}.json` in schemas directory
9. Report schema created and any required helpers

## API Calls

- `POST /api/schema/extract` - Extract unified schema with input/output sections from template
  - **Returns**: `{ schema: UnifiedSchema, requiredHelpers: string[], templatePath: string }`

## Output Schema Extraction

The skill searches for output format definitions in template comments:

**HTML Comment Format:**
```handlebars
<!-- Expected Output: {"title": "string", "score": "number", "tags": ["string"]} -->
```

**Handlebars Comment Format:**
```handlebars
{{! Output Format:
  {
    "title": "Generated title text",
    "keywords": ["keyword1", "keyword2"],
    "confidence": 0.95
  }
}}
```

**Extraction Process:**
1. Look for `<!-- Expected Output: ... -->` or `{{! Output Format: ... }}` patterns
2. Extract JSON structure from comment content
3. Infer types from example values (string, number, boolean, array, object)
4. Generate JSON schema with proper type definitions
5. If no output format found, only input schema is created (output schemas are optional)

## Output Format

```
Schema Generation: {{promptName}}
==================================

Unified Schema Generated:
- File: {prompt-name}.json
- Template: {prompt-name}
- Version: 1.0.0

Input Section:
- Fields: 5 (transcriptAbridgement, mainTopic, keywords, targetAudience, videoLength)
- Required Helpers: titleCase, truncate

Output Section:
- Fields: 3 (title, confidence, suggestions)
- Structure: object with string, number, and array fields

Schema saved to workspace schemas directory.

Status: ✓ Unified schema generated successfully
```

Without output section:

```
Schema Generation: {{promptName}}
==================================

Unified Schema Generated:
- File: {prompt-name}.json
- Template: {prompt-name}
- Version: 1.0.0

Input Section:
- Fields: 3 (name, description, category)
- Required Helpers: none

Output Section:
- No output format defined in template (optional)
- Output section enables validation but is not required

Schema saved to workspace schemas directory.

Status: ✓ Unified schema generated (input only)
```

## Example Usage

**User context**: Has a prompt template file named `generate-chapter-titles.hbs` with placeholders and output format comment

**Skill activation**: "Can you generate schemas for this template?"

**Skill response**:
```
I'll extract a unified schema from your prompt template.

Schema Generation: generate-chapter-titles.hbs
===============================================

Unified Schema Generated:
- File: generate-chapter-titles.json
- Template: generate-chapter-titles
- Version: 1.0.0

Input Section:
- Fields: 4
  - transcriptAbridgement (string, required)
  - videoLength (number, required)
  - targetAudience (string, optional)
  - existingChapters (array, optional)
- Required Helpers: formatTimestamp

Output Section:
- Fields: 2
  - chapters (array of objects)
    - title (string)
    - timestamp (string)
    - duration (number)
  - totalChapters (number)

Schema saved to:
- /poem/schemas/generate-chapter-titles.json

Status: ✓ Unified schema generated successfully

The schema is now ready for use. You can validate inputs against the input section and outputs against the output section when testing your prompt.
```
