# Example: Skill Creation Pattern

**Feature**: Story 3.6 - Create Core Skills for Prompt Engineer
**Pattern**: [Skills Self-Description Format](../../kdd/patterns/skills-self-description-format.md)
**ADR**: [ADR-004: Skills as Markdown Documentation](../../kdd/decisions/adr-004-skills-as-markdown-documentation.md)

## Purpose

Demonstrates creating a new skill for Penny agent using the 8-section markdown format.

## Example: Create "Analyze Performance" Skill

### Step 1: Create Skill File

`packages/poem-core/skills/analyze-performance.md`:

```markdown
# Analyze Performance

Analyzes prompt rendering performance and identifies optimization opportunities.

## When to Use

Invoke this skill when:
- User asks about prompt performance ("why is this slow?")
- Rendering takes >500ms
- User mentions optimization needs

## What It Does

1. Measures template rendering time
2. Identifies slow helpers and operations
3. Suggests optimization strategies

## How It Works

1. Call `/api/prompt/render` with timing enabled
2. Analyze `renderTimeMs` in response
3. Parse warnings for performance hints
4. Generate optimization recommendations

## API Calls

- `POST /api/prompt/render`
  - Request: `{ template: string, data: object }`
  - Response: `{ rendered: string, renderTimeMs: number, warnings: string[] }`

## Output Format

\`\`\`
Performance Analysis:
Render Time: 523ms
Bottleneck: Custom helper 'complexCalculation' (480ms)

Recommendations:
- Cache helper results
- Simplify calculation logic
\`\`\`

## Example Usage

**User context**: User's prompt takes 5 seconds to render.

**Skill activation**: "Why is my prompt so slow?"

**Skill response**:
\`\`\`
Performance Analysis:
Render Time: 5234ms (⚠️ Exceeds 1000ms target)
Bottleneck: Helper 'fetchExternalAPI' (4800ms)

Recommendations:
- Move API calls to workflow step (not in template)
- Use cached data when possible
\`\`\`
```

### Step 2: Add to Skills README

`packages/poem-core/skills/README.md`:

```markdown
| Skill Name | File | Purpose | Key APIs |
|------------|------|---------|----------|
| Analyze Performance | `analyze-performance.md` | Identify prompt performance issues | `/api/prompt/render` |
```

### Step 3: Reference in Agent

`packages/poem-core/agents/prompt-engineer.md`:

```markdown
## Dependencies

### Skills
- analyze-performance.md - Performance analysis and optimization
```

### Step 4: Test Skill Structure

`packages/poem-app/tests/skills/analyze-performance.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('analyze-performance skill', () => {
  const content = fs.readFileSync('packages/poem-core/skills/analyze-performance.md', 'utf-8');

  it('should have all 8 required sections', () => {
    expect(content).toMatch(/^# Analyze Performance/m);
    expect(content).toMatch(/## When to Use/);
    expect(content).toMatch(/## What It Does/);
    expect(content).toMatch(/## How It Works/);
    expect(content).toMatch(/## API Calls/);
    expect(content).toMatch(/## Output Format/);
    expect(content).toMatch(/## Example Usage/);
  });

  it('should have 3+ "When to Use" triggers', () => {
    const triggers = content.match(/^- /gm) || [];
    expect(triggers.length).toBeGreaterThanOrEqual(3);
  });

  it('should document API endpoint', () => {
    expect(content).toMatch(/POST \/api\/prompt\/render/);
  });
});
```

### Step 5: Test Skill Execution (Manual)

```bash
# Activate Penny
/poem/agents/penny

# Create scenario matching "When to Use"
User: "My prompt is really slow, can you analyze why?"

# Verify skill activates and calls correct API
# Expected: Penny uses analyze-performance skill, calls /api/prompt/render, shows performance analysis
```

## Key Concepts

### 1. Self-Describing Format

"When to Use" section enables autonomous activation - agent reads this and knows when to invoke skill.

### 2. API-First Integration

Skills document API calls, not implementations. Loose coupling with service layer.

### 3. Example-Based Testing

"Example Usage" section doubles as test case for manual testing.

## Related Patterns

- [Skills Self-Description Format](../../kdd/patterns/skills-self-description-format.md)
- [API-First Heavy Operations](../../kdd/patterns/api-first-heavy-operations.md)

## References

- **Story**: `docs/stories/3.6.story.md`
- **Skills README**: `packages/poem-core/skills/README.md`
- **Testing Strategy**: `docs/architecture/testing-strategy.md` (Manual Testing section)

---

**Last Updated**: 2026-01-16
