# Preview with Data

A skill that renders a Handlebars prompt template with provided or mock data to preview the final output before deployment or testing.

## When to Use

Invoke this skill when:
- You want to quickly preview how a prompt will render with specific data
- Testing a prompt with mock data before running through full workflow
- Debugging template rendering issues
- Verifying placeholder substitution works correctly
- Demonstrating prompt output to stakeholders

## What It Does

This skill provides a quick preview of rendered prompt output:

1. **Data Source Selection**: Prompts for data source (mock, file, or inline JSON)
2. **Template Rendering**: Calls the render API with the template and data
3. **Output Display**: Shows the rendered output with metadata (render time, warnings)
4. **Warning Reporting**: Identifies missing fields, unused data, or helper errors

## How It Works

1. Elicit data source from user (mock data, file path, or inline JSON)
2. Load the prompt template from workspace (or use template in context)
3. If mock data selected, generate appropriate mock data for the template schema
4. Call `POST /api/prompt/render` with template and data
5. Display rendered output with formatting
6. Report any warnings (missing placeholders, unused data fields, helper issues)

## API Calls

- `POST /api/prompt/render` - Render template with provided data, returns rendered output and warnings

## Output Format

```
Preview: {{promptName}}
========================

Rendered Output:
---
{{rendered content}}
---

Metadata:
- Render Time: 45ms
- Template Size: 1.2KB
- Warnings: 0

Status: ✓ Rendered successfully
```

With warnings:

```
Preview: {{promptName}}
========================

Rendered Output:
---
{{rendered content}}
---

Metadata:
- Render Time: 52ms
- Template Size: 1.2KB
- Warnings: 2

⚠ Warnings:
- Missing field: 'subtitle' (rendered as empty string)
- Helper 'formatDate' not found (rendered as-is)

Status: ✓ Rendered with warnings
```

## Example Usage

**User context**: Has a prompt template file named `generate-title.hbs` in workspace

**Skill activation**: "Can you preview this template with some test data?"

**Skill response**:
```
I'll preview your prompt template with mock data.

Preview: generate-title.hbs
============================

Rendered Output:
---
You are a YouTube title expert. Based on the following video content,
generate 5 compelling titles that are engaging and SEO-friendly.

Video Topic: Building REST APIs with Node.js
Keywords: nodejs, api, backend, tutorial
Target Audience: intermediate developers

Generate titles that:
- Are between 40-60 characters
- Include the main keyword
- Are attention-grabbing
- Follow YouTube best practices
---

Metadata:
- Render Time: 38ms
- Template Size: 856 bytes
- Warnings: 0

Status: ✓ Rendered successfully

The template rendered cleanly with all placeholders filled. Ready for testing with real data.
```
