# Skills Self-Description Format

**Pattern**: Define autonomous agent skills as markdown files with structured sections that enable context-aware activation.

**Source Stories**: 3.5 (Create Validation Skills), 3.6 (Create Core Skills for Prompt Engineer)

## Context

When to use this pattern:

- Building AI agent capabilities that should activate automatically based on context
- Creating reusable single-responsibility tools for agents
- Need clear documentation of what a skill does and when to use it
- Skills call APIs but are invoked conversationally (not via commands)

**Problem**: Agents need capabilities that are:
1. **Self-describing** - Agent understands when to invoke them
2. **Single-responsibility** - Each skill does one thing well
3. **API-integrated** - Heavy operations go through Astro endpoints
4. **Documented** - Clear usage examples for testing

**Solution**: Markdown-based skill definitions with 8 standard sections.

## Implementation

### 8-Section Skill Format

Every skill file follows this structure:

```markdown
# [Skill Name]

[1-2 sentence description of skill purpose]

## When to Use

Invoke this skill when:
- [Context 1 - specific user request or situation]
- [Context 2 - conversational trigger]
- [Context 3 - agent decision point]

## What It Does

1. [Step 1 - first action]
2. [Step 2 - second action]
3. [Step 3 - result]

## How It Works

[Sequential process description with implementation details]

## API Calls

- `[METHOD] /api/endpoint` - [Description of API call]
- `[METHOD] /api/another` - [Description]

## Output Format

\`\`\`
[Example output structure - JSON, table, or formatted text]
\`\`\`

## Example Usage

**User context**: [Scenario description]

**Skill activation**: "[Example user request]"

**Skill response**:
\`\`\`
[Example response showing skill output]
\`\`\`

## Notes

[Optional: Edge cases, limitations, future enhancements]
```

### Real Example: `check-my-prompt.md`

```markdown
# Check My Prompt

Validates prompt structure, syntax, and completeness before testing.

## When to Use

Invoke this skill when:
- User asks to check, validate, or review a prompt
- User mentions potential issues with a prompt
- About to run test workflow and want pre-flight check

## What It Does

1. Validates Handlebars syntax (balanced tags, proper nesting)
2. Checks for required sections (description, placeholders documentation)
3. Verifies schema exists and matches template placeholders
4. Reports issues with actionable suggestions

## How It Works

1. Parse template with Handlebars parser
2. Extract placeholders and helper usage
3. Load corresponding schema file
4. Cross-reference schema fields vs template placeholders
5. Check for common anti-patterns (hardcoded values, unclear placeholders)
6. Generate validation report

## API Calls

- `POST /api/prompt/validate` - Comprehensive prompt validation
  - Request: `{ template: string, schemaPath?: string }`
  - Response: `{ valid: boolean, errors: ValidationError[], warnings: string[] }`

## Output Format

\`\`\`
✓ Syntax: Valid Handlebars
✓ Schema: Matches template (5 fields)
⚠ Warning: Placeholder {{title}} not documented in comments

Suggestions:
- Add description comment above {{title}} placeholder
\`\`\`

## Example Usage

**User context**: User just created a new prompt and wants to verify it's correct.

**Skill activation**: "Can you check my prompt for issues?"

**Skill response**:
\`\`\`
Validating prompt: generate-titles.hbs

✓ Syntax: Valid Handlebars
✓ Schema: Found generate-titles.json with 3 input fields
✗ Error: Placeholder {{audience}} used in template but not defined in schema

Recommendation: Add 'audience' field to schema or remove from template.
\`\`\`
```

## Rationale

**Why This Format?**

1. **"When to Use" Enables Autonomous Activation**:
   - Agent reads skill files to understand capabilities
   - Matches user context against "When to Use" triggers
   - Invokes skill without explicit user command

2. **Single Responsibility**:
   - Each skill does ONE thing
   - Clear boundaries prevent scope creep
   - Easy to test in isolation

3. **API-First Architecture**:
   - Skills document API calls, not implementation
   - Heavy operations (parsing, validation, rendering) through endpoints
   - Agent orchestrates API calls, doesn't execute logic

4. **Self-Documenting**:
   - Example usage shows real conversation flows
   - Testing involves replaying examples with agent
   - No separate documentation needed

**Design Principles**:
- Skills are documentation, not code
- Skills guide agent behavior, not execute operations
- Skills are conversational, not command-driven

## Related Patterns

- **API-First Heavy Operations** - Skills call APIs for computation
- **Config Service Single Source of Truth** - Skills use config for paths

## Skill vs Workflow vs Command

| Aspect | Skill | Workflow | Command |
|--------|-------|----------|---------|
| **Invocation** | Autonomous (context-aware) | User runs via command | Explicit command |
| **Scope** | Single operation | Multi-step process | Single action |
| **File Type** | Markdown (`.md`) | YAML (`.yaml`) | N/A (in agent file) |
| **Example** | `check-my-prompt.md` | `new-prompt.yaml` | `*list`, `*help` |

**When to Use Each**:
- **Skill**: Autonomous capability (e.g., validate prompt when user mentions "check")
- **Workflow**: Multi-step guided process (e.g., `*new` creates prompt with 6 steps)
- **Command**: Explicit user action (e.g., `*list` always lists prompts)

## Implementation Checklist

When creating a new skill:

- [ ] Create markdown file in `packages/poem-core/skills/` (kebab-case.md)
- [ ] Include all 8 sections (When to Use, What It Does, How It Works, API Calls, Output Format, Example Usage, Notes)
- [ ] Define 3+ "When to Use" contexts for autonomous activation
- [ ] Document all API calls with endpoints and payloads
- [ ] Provide realistic example usage with conversation flow
- [ ] Add skill to `packages/poem-core/skills/README.md` table
- [ ] Reference skill in agent dependencies section
- [ ] Write structure validation tests in `tests/skills/`

## Testing Skills

**Unit Tests** (validate document structure):
```typescript
// packages/poem-app/tests/skills/check-my-prompt.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('check-my-prompt skill', () => {
  const skillContent = fs.readFileSync('packages/poem-core/skills/check-my-prompt.md', 'utf-8');

  it('should have title section', () => {
    expect(skillContent).toMatch(/^# Check My Prompt/m);
  });

  it('should have "When to Use" section', () => {
    expect(skillContent).toMatch(/## When to Use/);
  });

  it('should have at least 3 "When to Use" contexts', () => {
    const whenSection = skillContent.match(/## When to Use[\s\S]*?##/)?.[0];
    const bullets = whenSection?.match(/^- /gm) || [];
    expect(bullets.length).toBeGreaterThanOrEqual(3);
  });

  it('should document API endpoints', () => {
    expect(skillContent).toMatch(/## API Calls/);
    expect(skillContent).toMatch(/POST \/api\/prompt\/validate/);
  });

  it('should have example usage', () => {
    expect(skillContent).toMatch(/## Example Usage/);
  });
});
```

**Manual Tests** (execution validation):
1. Activate agent: `/poem/agents/penny`
2. Create scenario matching "When to Use" context
3. Verify skill activates automatically
4. Check output matches "Output Format"

## Anti-Patterns

```markdown
<!-- ❌ ANTI-PATTERN: No "When to Use" section -->
# My Skill

This skill does X.

## How It Works
[...]

<!-- WRONG: Agent can't determine when to invoke -->
```

```markdown
<!-- ❌ ANTI-PATTERN: Vague "When to Use" triggers -->
## When to Use

- When user needs help
- When things go wrong
- When validation is needed

<!-- WRONG: Too generic, every scenario matches -->
```

```markdown
<!-- ❌ ANTI-PATTERN: Embedding implementation code -->
## Implementation

\`\`\`typescript
function checkPrompt(template: string) {
  const parser = new HandlebarsParser();
  return parser.parse(template);
}
\`\`\`

<!-- WRONG: Skills document behavior, not implementation -->
```

```markdown
<!-- ❌ ANTI-PATTERN: Missing API documentation -->
## API Calls

Uses validation endpoint.

<!-- WRONG: No endpoint path, no request/response format -->
```

## Skill Discovery

Agents discover skills at startup by reading:
```
packages/poem-core/skills/*.md
```

Each skill file is loaded into agent context, enabling:
1. Context matching ("When to Use" vs current conversation)
2. Capability awareness (agent knows it CAN validate prompts)
3. Usage guidance (example conversations as templates)

## References

- **Initial Implementation**: `docs/stories/3.5.story.md` (validation skills created)
- **Core Skills**: `docs/stories/3.6.story.md` (preview-with-data, generate-schema)
- **Skill Directory**: `packages/poem-core/skills/` (all skill files)
- **Skills README**: `packages/poem-core/skills/README.md` (comprehensive skills guide)
- **Example Skills**:
  - `check-my-prompt.md` (Story 3.5)
  - `preview-with-data.md` (Story 3.6)
  - `generate-schema.md` (Story 3.6)
  - `list-workflows.md` (Story 3.8)
- **Decision Record**: [ADR-004: Skills as Markdown Documentation](../decisions/adr-004-skills-as-markdown-documentation.md)

---

**Pattern Established**: Story 3.5 (2026-01-11)
**Extended**: Story 3.6 (2026-01-12), Story 3.8 (2026-01-12)
**Last Updated**: 2026-01-16
