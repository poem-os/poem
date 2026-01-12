# Generate Schema

A skill that automatically extracts JSON schemas (both input and output) from Handlebars prompt templates by analyzing placeholders and output format comments.

## When to Use

Invoke this skill when:
- Creating a new prompt template and need to generate schemas
- An existing prompt is missing its schema files
- Template placeholders have changed and schema needs updating
- You want to ensure schema matches template requirements
- Documenting template data requirements

## What It Does

This skill automatically generates schemas for prompts:

1. **Input Schema Extraction**: Analyzes template placeholders to generate input data schema
2. **Output Schema Extraction**: Parses template comments for expected output structure
3. **Helper Detection**: Identifies required Handlebars helpers used in template
4. **Schema Creation**: Saves both input and output schemas to workspace

## How It Works

1. Load the prompt template from workspace (or use template in context)
2. Call `POST /api/schema/extract` to extract placeholders and helper usage
3. Parse template for output format comments (HTML or Handlebars comments)
4. Extract output structure from "Expected Output" or "Output Format" sections
5. Generate input schema JSON from placeholders (field names and inferred types)
6. Generate output schema JSON from parsed output structure (if present)
7. Save input schema as `{prompt-name}.json` in schemas directory
8. Save output schema as `{prompt-name}-output.json` in schemas directory (if output format found)
9. Report schemas created and any required helpers

## API Calls

- `POST /api/schema/extract` - Extract placeholders, helpers, and structure from template

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

Input Schema Generated:
- File: {prompt-name}.json
- Fields: 5 (transcriptAbridgement, mainTopic, keywords, targetAudience, videoLength)
- Required Helpers: titleCase, truncate

Output Schema Generated:
- File: {prompt-name}-output.json
- Fields: 3 (title, confidence, suggestions)
- Structure: object with string, number, and array fields

Schemas saved to workspace schemas directory.

Status: ✓ Schemas generated successfully
```

Without output schema:

```
Schema Generation: {{promptName}}
==================================

Input Schema Generated:
- File: {prompt-name}.json
- Fields: 3 (name, description, category)
- Required Helpers: none

Output Schema:
- No output format defined in template (optional)
- Output schemas enable validation but are not required

Schemas saved to workspace schemas directory.

Status: ✓ Input schema generated successfully
```

## Example Usage

**User context**: Has a prompt template file named `generate-chapter-titles.hbs` with placeholders and output format comment

**Skill activation**: "Can you generate schemas for this template?"

**Skill response**:
```
I'll extract schemas from your prompt template.

Schema Generation: generate-chapter-titles.hbs
===============================================

Input Schema Generated:
- File: generate-chapter-titles.json
- Fields: 4
  - transcriptAbridgement (string, required)
  - videoLength (number, required)
  - targetAudience (string, optional)
  - existingChapters (array, optional)
- Required Helpers: formatTimestamp

Output Schema Generated:
- File: generate-chapter-titles-output.json
- Fields: 2
  - chapters (array of objects)
    - title (string)
    - timestamp (string)
    - duration (number)
  - totalChapters (number)

Schemas saved to:
- /poem/schemas/generate-chapter-titles.json
- /poem/schemas/generate-chapter-titles-output.json

Status: ✓ Both schemas generated successfully

The schemas are now ready for use. You can validate inputs and outputs against these schemas when testing your prompt.
```
