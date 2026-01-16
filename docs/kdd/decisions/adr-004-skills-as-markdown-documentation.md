# ADR-004: Skills as Markdown Documentation

**Date**: 2026-01-11 to 2026-01-12
**Status**: Accepted
**Source**: Stories 3.5 (Create Validation Skills), 3.6 (Create Core Skills)

## Context

POEM's agents (like Penny) need reusable capabilities that:
1. **Activate autonomously** based on conversation context
2. **Are single-responsibility** (do one thing well)
3. **Call APIs** for heavy operations
4. **Are testable** (both structure and execution)
5. **Are self-documenting** (usage examples included)

### The Question

**How should we implement agent skills?**

Two fundamentally different approaches were considered:

**Executable Code** (TypeScript/JavaScript files with logic)
vs
**Documentation Files** (Markdown files that guide agent behavior)

This decision fundamentally affects:
- How skills are created
- How skills are tested
- How skills are discovered
- How skills evolve over time

## Decision

**Skills are markdown documentation files, not executable code.**

### Core Principle

**Skills guide agent behavior through clear documentation, not through code execution.**

### 8-Section Format

Every skill follows this structure:

```markdown
# [Skill Name]

[1-2 sentence description]

## When to Use

Invoke this skill when:
- [Context trigger 1]
- [Context trigger 2]
- [Context trigger 3+]

## What It Does

1. [Step 1]
2. [Step 2]
3. [Result]

## How It Works

[Sequential process description]

## API Calls

- `[METHOD] /api/endpoint` - [Description]

## Output Format

\`\`\`
[Example output structure]
\`\`\`

## Example Usage

**User context**: [Scenario]
**Skill activation**: "[User request]"
**Skill response**: [Example response]
```

### Key Characteristics

1. **Self-Describing**: "When to Use" enables autonomous activation
2. **API-Integrated**: "API Calls" documents endpoints, not implementations
3. **Single-Responsibility**: Each skill does one thing
4. **Testable**: Structure tests verify format, manual tests verify execution

## Alternatives Considered

### Alternative 1: Executable Skill Files (Rejected)

**Approach**: Skills as TypeScript/JavaScript modules with execute() function.

```typescript
// packages/poem-core/skills/check-my-prompt.ts
export class CheckMyPromptSkill {
  async execute(context: AgentContext): Promise<SkillResult> {
    const template = context.getCurrentTemplate();
    const validator = new PromptValidator();
    const result = await validator.validate(template);

    return {
      success: result.valid,
      message: this.formatValidationReport(result)
    };
  }
}
```

**Pros**:
- Type-safe (TypeScript)
- IDE support (autocomplete, refactoring)
- Unit testable (import and test execute())
- Familiar to developers

**Cons**:
- **Tight Coupling**: Skills import service classes (violates API-first)
- **Hard to Modify**: Code changes require recompilation
- **Not LLM-Friendly**: Code harder for AI to understand than docs
- **Testing Complexity**: Must mock service dependencies
- **Version Lock**: Skills tied to specific TypeScript/Node versions
- **Discovery**: Requires module loading system
- **Non-Extensible**: Users can't easily add custom skills

### Alternative 2: JSON/YAML Skill Definitions (Rejected)

**Approach**: Skills as structured data with action declarations.

```yaml
# packages/poem-core/skills/check-my-prompt.yaml
name: Check My Prompt
description: Validates prompt structure and syntax
triggers:
  - pattern: "check my prompt"
  - pattern: "validate prompt"
actions:
  - type: api_call
    endpoint: POST /api/prompt/validate
    params:
      template: "{{context.currentTemplate}}"
  - type: format_response
    template: "Validation result: {{response.valid}}"
```

**Pros**:
- Structured (machine-readable)
- No code execution
- Declarative

**Cons**:
- **Limited Expressiveness**: Can't handle complex logic
- **Custom DSL**: Requires learning YAML action syntax
- **No Examples**: Hard to include usage examples
- **Not Human-Friendly**: YAML verbose for documentation
- **No Context Explanation**: "When to Use" limited to simple patterns

### Alternative 3: Markdown Documentation Files (Accepted)

As described in Decision section above.

**Pros**:
- **LLM-Friendly**: Markdown is AI agent's native format ✓
- **Self-Describing**: "When to Use" explains context ✓
- **API-First**: Documents endpoints, not implementations ✓
- **Human-Readable**: Examples show real conversations ✓
- **Easy to Modify**: Edit text, no recompilation ✓
- **Extensible**: Users can add custom skills ✓
- **Version-Agnostic**: Not tied to specific languages ✓
- **Testable**: Structure tests + manual conversation tests ✓

**Cons**:
- Not executable (agent interprets, doesn't run)
- No compile-time type checking
- Manual testing required for execution validation

**Trade-off**: Flexibility and LLM-friendliness outweigh lack of type safety.

## Rationale

### 1. LLM-Native Format

**Agents are LLMs.** They understand markdown natively.

```markdown
## When to Use

Invoke this skill when:
- User asks to check, validate, or review a prompt
- User mentions potential issues with a prompt
```

Agent reads this and understands: "If user says 'check my prompt', activate this skill."

**No code interpretation needed.** LLM directly maps context to skill activation.

### 2. Context-Aware Activation

**"When to Use" is key innovation.**

```markdown
## When to Use

Invoke this skill when:
- User explicitly requests validation ("check my prompt")
- User expresses uncertainty ("is this prompt correct?")
- About to run test workflow (pre-flight check)
- Schema and template potentially out of sync
```

Agent matches current conversation context against these triggers.

**Autonomous activation** without explicit commands.

### 3. API-First Integration

Skills document APIs, not implementations:

```markdown
## API Calls

- `POST /api/prompt/validate`
  - Request: `{ template: string, schemaPath?: string }`
  - Response: `{ valid: boolean, errors: ValidationError[] }`
```

If API changes, update documentation. No code changes in skill file.

### 4. Self-Documentation

**Usage examples are built-in:**

```markdown
## Example Usage

**User context**: User just created a new prompt.

**Skill activation**: "Can you check my prompt for issues?"

**Skill response**:
\`\`\`
Validating prompt: generate-titles.hbs

✓ Syntax: Valid Handlebars
✗ Error: Placeholder {{audience}} not defined in schema

Recommendation: Add 'audience' field to schema.
\`\`\`
```

These examples serve as:
- Usage documentation
- Test cases
- Conversation templates

### 5. Testing Strategy

**Two-Level Testing:**

1. **Structure Tests** (Automated with Vitest):
```typescript
describe('check-my-prompt skill', () => {
  it('should have "When to Use" section with 3+ triggers', () => {
    const content = fs.readFileSync('skills/check-my-prompt.md');
    const triggers = content.match(/^- /gm) || [];
    expect(triggers.length).toBeGreaterThanOrEqual(3);
  });
});
```

2. **Execution Tests** (Manual with Claude Code):
```bash
/poem/agents/penny
User: "Check my prompt for issues"
# Verify skill activates and calls correct API
```

**Rationale**: Skills are documentation, so test document structure. Execution testing requires agent context (manual).

### 6. Extensibility

**Users can add custom skills:**

1. Create `custom-skills/analyze-seo.md`
2. Follow 8-section format
3. Document "When to Use" triggers
4. Agent automatically discovers and uses

No code compilation, no plugin system, no registration.

## Consequences

### Positive Consequences

1. **LLM-Friendly**: Markdown is agent's native format
2. **Context-Aware**: "When to Use" enables autonomous activation
3. **API-First**: Skills document endpoints, not implementations
4. **Self-Documenting**: Examples are usage docs and test cases
5. **Easy to Create**: Write markdown, no coding required
6. **Extensible**: Users add custom skills without recompilation
7. **Version-Agnostic**: Not tied to TypeScript/Node versions
8. **Maintainable**: Update docs, not code

### Negative Consequences

1. **No Type Safety**: Can't validate API calls at compile time
2. **Manual Execution Tests**: Require agent activation
3. **Interpretation Variance**: Different LLMs may interpret slightly differently
4. **No IDE Support**: No autocomplete for API endpoints

### Mitigation

- **API Docs**: `docs/architecture/api-specification.md` as reference
- **Structure Tests**: Validate format with Vitest
- **Skills README**: `packages/poem-core/skills/README.md` provides format guide
- **Examples**: Every skill has usage examples

## Implementation

### Epic 3 Skills Created

**Story 3.5** (Validation Skills):
- `check-my-prompt.md` - Validate prompt structure and syntax
- `find-fields.md` - Search for field usage across prompts

**Story 3.6** (Core Skills):
- `preview-with-data.md` - Render prompt with mock/provided data
- `generate-schema.md` - Extract input and output schemas

**Story 3.8** (Workflow Skills):
- `list-workflows.md` - List available workflows
- `switch-workflow.md` - Switch to different workflow
- `show-workflow-context.md` - Display current workflow info

### Testing Results

**Structure Tests**:
- Story 3.5: 35 tests (check-my-prompt, find-fields)
- Story 3.6: 88 tests (preview-with-data, generate-schema, README)
- All passing ✓

**Manual Execution Tests**:
- Verified via `/poem/agents/penny` activation
- Skills activate correctly based on context
- API calls execute successfully

### Skills README

Created comprehensive guide:
- `packages/poem-core/skills/README.md`
- Skill vs Workflow vs Command comparison
- Format specification
- Creation guidelines
- Testing approach

## Related Decisions

- **ADR-003: API-First for Heavy Operations** - Skills call APIs
- **Pattern: Skills Self-Description Format** - Implementation details
- **Pattern: API-First Heavy Operations** - API integration approach

## References

- **Story 3.5**: `docs/stories/3.5.story.md` (validation skills)
- **Story 3.6**: `docs/stories/3.6.story.md` (core skills)
- **Story 3.8**: `docs/stories/3.8.story.md` (workflow skills)
- **Skills Directory**: `packages/poem-core/skills/` (all skill files)
- **Skills README**: `packages/poem-core/skills/README.md` (comprehensive guide)
- **Pattern**: `docs/kdd/patterns/skills-self-description-format.md`

---

**Last Updated**: 2026-01-16
**Author**: Dev Agent (Stories 3.5, 3.6, 3.8)
**Skills Created**: 7 (as of Epic 3 completion)
