# Example: Workflow Validation End-to-End

**Feature**: Story 3.5 - Create Validation Skills
**Pattern**: [API-First Heavy Operations](../../kdd/patterns/api-first-heavy-operations.md), [Skills Self-Description Format](../../kdd/patterns/skills-self-description-format.md)

## Purpose

Demonstrates end-to-end workflow validation using `check-my-prompt` and `find-fields` skills with API integration.

## Scenario

Validate a new prompt before deploying to production.

## Workflow Steps

### Step 1: Activate Penny

```bash
/poem/agents/penny
*switch youtube-launch-optimizer
```

### Step 2: Create Prompt

Create `generate-description.hbs`:

```handlebars
{{!--
  Generate YouTube Video Description
  Input: {{title}}, {{keywords}}, {{duration}}
--}}
Create a compelling YouTube video description for:

Title: {{title}}
Keywords: {{keywords}}
Duration: {{duration}} minutes

Include:
- Engaging hook
- Key takeaways
- Call to action
```

### Step 3: Validate Prompt (check-my-prompt skill)

```bash
User: "Check my generate-description prompt for issues"

# Penny activates check-my-prompt skill
# Calls: POST /api/prompt/validate
```

**Response**:
```
Validating prompt: generate-description.hbs

✓ Syntax: Valid Handlebars
✗ Error: No schema found (generate-description.json missing)
⚠ Warning: Placeholder {{keywords}} not documented in comments

Recommendations:
1. Create schema: generate-description.json
2. Add {{! @param keywords string[] - SEO keywords }} comment
```

### Step 4: Create Schema

```json
{
  "templateName": "generate-description",
  "version": "1.0.0",
  "input": {
    "fields": [
      { "name": "title", "type": "string", "required": true },
      { "name": "keywords", "type": "array", "required": true },
      { "name": "duration", "type": "number", "required": true }
    ]
  },
  "output": {
    "fields": [
      { "name": "description", "type": "string", "required": true }
    ]
  }
}
```

### Step 5: Re-Validate

```bash
User: "Check again"

# Response:
✓ Syntax: Valid Handlebars
✓ Schema: Matches template (3 input fields)
✓ All placeholders documented

Ready for testing!
```

### Step 6: Find Field Usage (find-fields skill)

```bash
User: "Where is the 'keywords' field used across all prompts?"

# Penny activates find-fields skill
# Searches: dev-workspace/workflows/youtube-launch-optimizer/prompts/
```

**Response**:
```
Field 'keywords' found in 3 prompts:
1. generate-description.hbs (line 12)
2. generate-tags.hbs (line 8)
3. optimize-seo.hbs (line 15)

All prompts have matching schema definitions.
```

### Step 7: Preview with Data

```bash
User: "Show me what it looks like with example data"

# Penny activates preview-with-data skill
# Calls: POST /api/prompt/render
```

**Response**:
```handlebars
Rendered Output:

Create a compelling YouTube video description for:

Title: Build AI Agents That Write Code for You
Keywords: AI automation, Claude Code, agent development
Duration: 12 minutes

Include:
- Engaging hook
- Key takeaways
- Call to action
```

## API Calls Used

```
1. POST /api/prompt/validate (check-my-prompt)
2. POST /api/schema/extract (generate-schema, if needed)
3. POST /api/prompt/render (preview-with-data)
```

## Validation Checklist

- [x] Syntax valid (no unmatched tags)
- [x] Schema exists and matches template
- [x] All placeholders documented
- [x] Field usage consistent across prompts
- [x] Renders successfully with example data
- [x] Output matches expected format

## Key Concepts

### 1. Layered Validation

1. **Syntax**: Handlebars parser (valid tags)
2. **Schema**: Field presence and types
3. **Semantic**: Field documentation and usage
4. **Integration**: Cross-prompt consistency

### 2. Skill Composition

Multiple skills work together:
- `check-my-prompt` → Validate structure
- `find-fields` → Check cross-prompt usage
- `preview-with-data` → Test rendering

### 3. API-Driven Validation

All validation through APIs:
- `/api/prompt/validate` - Comprehensive validation
- `/api/prompt/render` - Test rendering
- `/api/schema/extract` - Infer schema if missing

## Related Patterns

- [API-First Heavy Operations](../../kdd/patterns/api-first-heavy-operations.md)
- [Skills Self-Description Format](../../kdd/patterns/skills-self-description-format.md)
- [Unified Schema Structure](../../kdd/patterns/unified-schema-structure.md)

## References

- **Story**: `docs/stories/3.5.story.md`
- **Skills**: `packages/poem-core/skills/check-my-prompt.md`, `find-fields.md`
- **API Docs**: `docs/architecture/api-specification.md`

---

**Last Updated**: 2026-01-16
