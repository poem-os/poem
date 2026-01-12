# POEM Skills

Skills are autonomous, single-responsibility capabilities that Claude invokes based on context. Unlike workflows (which require explicit commands), skills activate automatically when their "When to Use" conditions match the conversation context.

## Overview

**What are Skills?**

Skills are markdown documents that guide Claude's behavior for specific tasks. They are self-describing, context-aware documentation that enables Claude to:

- Validate prompts (`check-my-prompt`)
- Preview rendered output (`preview-with-data`)
- Generate schemas automatically (`generate-schema`)
- Suggest field mappings (future)
- Pull data dictionaries (future)
- Publish prompts to providers (future)

**When to Use Skills vs Workflows:**

Skills are best for quick, single-purpose operations that don't require user input during execution. Workflows are better for multi-step processes with user decisions.

## Skill vs Workflow Comparison

| Aspect | Skills | Workflows |
|--------|--------|-----------|
| **Activation** | Automatic (context-driven) | Manual (explicit command like `*new`, `*test`) |
| **User Interaction** | Minimal (single operation) | Multi-step with elicitation |
| **Complexity** | Single-responsibility | Multi-step guided process |
| **Examples** | Validate syntax, preview output | Create new prompt, refine iteratively |
| **When to Use** | Quick checks, one-off operations | Structured development workflows |
| **Documentation** | Markdown skill definition | YAML workflow definition |

## Available Skills

| Skill | File | Purpose | Key API Endpoints |
|-------|------|---------|-------------------|
| Check My Prompt | `check-my-prompt.md` | Validates prompt structure, syntax, schema alignment, and best practices | `POST /api/schema/extract`<br>`GET /api/helpers`<br>`POST /api/schema/validate` |
| Preview with Data | `preview-with-data.md` | Renders prompt template with mock or provided data to preview output | `POST /api/prompt/render` |
| Generate Schema | `generate-schema.md` | Extracts input and output JSON schemas from template placeholders and comments | `POST /api/schema/extract` |
| List Workflows | `list-workflows.md` | Displays all available workflows in workspace with current workflow indicator | Config service (no API) |
| Switch Workflow | `switch-workflow.md` | Changes active workflow context without requiring server restart | Config service (no API) |
| Show Workflow Context | `show-workflow-context.md` | Shows current workflow information, paths, and reference materials | Config service (no API) |

## Skill Format

All skill documents follow a consistent structure to ensure clarity and completeness.

### Required Sections

#### 1. Title (H1)
```markdown
# Skill Name
```

#### 2. Description (Paragraph)
Brief 1-2 sentence description of what the skill does.

```markdown
A skill that [verb] [object] to [benefit/purpose].
```

#### 3. When to Use (H2)
Bulleted list of contexts where the skill should be invoked.

```markdown
## When to Use

Invoke this skill when:
- Context 1
- Context 2
- Context 3
```

#### 4. What It Does (H2)
Numbered list of the skill's core capabilities.

```markdown
## What It Does

1. **Capability 1**: Description
2. **Capability 2**: Description
3. **Capability 3**: Description
```

#### 5. How It Works (H2)
Sequential process description with numbered steps.

```markdown
## How It Works

1. Step 1: Action taken
2. Step 2: Action taken
3. Step 3: Action taken
```

#### 6. API Calls (H2)
List of HTTP endpoints used by the skill.

```markdown
## API Calls

- `POST /api/endpoint` - What the endpoint does
- `GET /api/resource` - What the endpoint returns
```

#### 7. Output Format (H2)
Example output structure in code blocks.

```markdown
## Output Format

\`\`\`
Example output structure
showing what user sees
\`\`\`
```

#### 8. Example Usage (H2)
Realistic conversation flow showing skill activation and response.

```markdown
## Example Usage

**User context**: Description of context

**Skill activation**: "User's request phrase"

**Skill response**:
\`\`\`
Example of skill's response
including actual output format
\`\`\`
```

## Creating New Skills

### When to Create a Skill

Create a new skill when you have a:
- **Single-responsibility operation** that can be performed autonomously
- **Common task** that users perform frequently
- **Context-aware capability** that should activate automatically
- **API-backed operation** that benefits from Claude's interpretation

### Skill Creation Checklist

1. **Define Purpose**: What single thing does this skill do?
2. **Identify Contexts**: When should this skill activate?
3. **Document API Calls**: What endpoints does it use?
4. **Write Example Usage**: Show realistic conversation flow
5. **Follow Format**: Include all 8 required sections
6. **Create Tests**: Validate skill document structure
7. **Update README**: Add skill to "Available Skills" table

### Naming Conventions

- **Skill Files**: kebab-case.md (e.g., `check-my-prompt.md`)
- **Test Files**: `{skill-name}.test.ts` (e.g., `check-my-prompt.test.ts`)

### API-First Principle

Skills **never** implement heavy operations directly. They always:
1. Describe the operation
2. Call an API endpoint
3. Present the results

**Why?** Heavy operations (rendering, schema extraction, validation) must go through Astro APIs for consistency, performance, and error handling.

## Testing Skills

### Unit Testing

Unit tests validate skill document structure and content:

**Test Location**: `packages/poem-app/tests/skills/{skill-name}.test.ts`

**What to Test**:
- All 8 required sections present
- "When to Use" has multiple contexts (at least 3)
- "What It Does" has numbered steps
- API endpoints documented correctly
- Output format includes code blocks
- Example usage shows realistic conversation
- Markdown format is correct

**Test Framework**: Vitest 4.x

**Example Test Structure**:
```typescript
describe('skill-name skill', () => {
  describe('Skill Document Structure', () => {
    it('should have H1 title', () => { /* ... */ });
    it('should have all required sections', () => { /* ... */ });
  });

  describe('API Endpoint Documentation Accuracy', () => {
    it('should document correct endpoints', () => { /* ... */ });
  });

  describe('Example Usage Completeness', () => {
    it('should show realistic conversation', () => { /* ... */ });
  });
});
```

### Manual Testing (Claude Code)

Manual testing validates skill execution behavior:

**How to Test**:
1. Activate Prompt Engineer agent: `/poem/agents/penny`
2. Create natural language requests that match skill "When to Use" contexts
3. Verify skill activates automatically (Claude recognizes context)
4. Verify correct API endpoints are called
5. Verify output formatting is clear and useful
6. Test edge cases (missing files, invalid data, empty results)

**Example Manual Test**:
```
User: "I want to preview this template with some test data"
Expected: preview-with-data skill activates
Verify: Calls POST /api/prompt/render
Verify: Displays rendered output with metadata
```

### Testing Best Practices

1. **Test Documents, Not Execution**: Unit tests validate the skill documentation structure, not the runtime behavior
2. **Manual Tests for Behavior**: Use Claude Code to verify skills work in conversation
3. **Edge Cases Matter**: Test with missing files, invalid input, empty results
4. **API Accuracy**: Ensure documented endpoints match actual API specification
5. **Example Clarity**: Example usage should be copy-pasteable as a test scenario

## Skill Lifecycle

1. **Creation**: Developer writes skill markdown following format
2. **Testing**: Unit tests validate document structure
3. **Integration**: Skill added to agent dependencies (if needed)
4. **Activation**: Claude recognizes "When to Use" contexts and invokes skill
5. **Execution**: Skill guides Claude to call APIs and present results
6. **Maintenance**: Update skill when APIs change or new contexts emerge

## Future Skills

Skills planned but not yet implemented:

- `find-fields.md` - Search data dictionaries for field definitions
- `validate-schema.md` - Check schemas against data dictionary standards
- `suggest-mappings.md` - Recommend field mappings between systems
- `pull-dictionary.md` - Import field definitions from external providers
- `publish-prompt.md` - Deploy prompts to production environments

See `docs/architecture/components.md` for complete future skills roadmap.

---

**Last Updated**: 2026-01-11
