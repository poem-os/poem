# Check My Prompt

A skill that validates prompt structure, syntax, and quality against POEM best practices.

## When to Use

Invoke this skill when:
- A user has a prompt template in context and wants to validate it
- Before deploying a prompt to production
- After making changes to check for issues
- When troubleshooting rendering errors

## What It Does

This skill performs comprehensive validation of a Handlebars prompt template:

1. **Syntax Validation**: Checks for valid Handlebars syntax
2. **Schema Alignment**: Verifies placeholders match schema fields
3. **Helper Verification**: Confirms required helpers are registered
4. **Best Practice Checks**: Applies POEM quality guidelines

## How It Works

1. Load the prompt template from the workspace
2. Parse the Handlebars template to extract placeholders and helpers
3. Load the corresponding schema (if exists)
4. Call validation API endpoint
5. Report findings with severity levels

## API Calls

- `POST /api/schema/extract` - Extract placeholders from template
- `GET /api/helpers` - List registered helpers
- `POST /api/schema/validate` - Validate data against schema

## Validation Checks

### Syntax Checks
- [ ] Template parses without errors
- [ ] All blocks properly closed ({{#if}}, {{#each}}, etc.)
- [ ] No orphaned closing tags

### Schema Checks
- [ ] Corresponding schema file exists
- [ ] All placeholders have schema definitions
- [ ] No unused schema fields (warning)
- [ ] Required fields marked in schema

### Helper Checks
- [ ] All referenced helpers are registered
- [ ] Helper usage matches expected signatures

### Best Practice Checks
- [ ] Template uses semantic placeholder names
- [ ] Conditional blocks have fallbacks (recommended)
- [ ] Arrays use {{#each}} not index access
- [ ] No hardcoded values that should be data

## Output Format

```
Prompt Validation Report: {{promptName}}
========================================

Syntax:     ✓ PASS | ✗ FAIL (details)
Schema:     ✓ PASS | ✗ FAIL | ⚠ WARNINGS
Helpers:    ✓ PASS | ✗ FAIL
Practices:  ✓ PASS | ⚠ SUGGESTIONS

Issues Found:
- [ERROR] Line 5: Unclosed {{#if}} block
- [WARN] Field 'timestamp' in schema not used in template
- [INFO] Consider adding default for optional field 'subtitle'

Overall: PASS | FAIL
```

## Example Usage

**User context**: Has a prompt template open or recently discussed

**Skill activation**: "Can you check this prompt for issues?"

**Skill response**:
```
I'll validate your prompt template.

Prompt Validation Report: generate-titles.hbs
=============================================

Syntax:     ✓ PASS
Schema:     ✓ PASS
Helpers:    ✓ PASS (using: truncate, titleCase)
Practices:  ⚠ SUGGESTIONS

Suggestions:
- Consider adding {{else}} fallback for {{#if hasKeywords}}
- The placeholder 'desc' could be more descriptive (e.g., 'description')

Overall: PASS - Ready for testing
```
