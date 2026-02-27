# API-First Heavy Operations

**Pattern**: Route computationally expensive operations (template rendering, schema extraction, validation) through Astro API endpoints instead of direct service method calls.

**Source Stories**: 3.2 (Template Rendering API), 3.3 (Schema Extraction API), 3.4 (Prompt Validation API), 3.7 (Schema Validation API)

## Context

When to use this pattern:

- Operations involve significant computation (parsing, validation, rendering)
- Agent-driven workflows need to invoke business logic
- Need clear API contracts between framework and runtime
- Want to test operations independently of agent context
- Operations may be called by external tools (CLI, VS Code extension)

**Problem**: If agents and workflows directly import service classes, you create tight coupling, hard-to-test code, and no API surface for external integrations.

**Solution**: Expose all heavy operations as Astro API endpoints. Agents and workflows call HTTP APIs, not TypeScript imports.

## Implementation

### Core Principle

**Every computationally expensive operation gets an API endpoint.**

### Example: Template Rendering

```typescript
// ✅ DO: Expose via API endpoint
// packages/poem-app/src/pages/api/prompt/render.ts
import type { APIRoute } from 'astro';
import { HandlebarsService } from '@services/handlebars';

export const POST: APIRoute = async ({ request }) => {
  const { template, data, isRawTemplate } = await request.json();

  const service = new HandlebarsService();
  const result = service.render(template, data);

  return new Response(JSON.stringify({
    rendered: result.output,
    renderTimeMs: result.timeMs,
    warnings: result.warnings
  }), { status: 200 });
};
```

```markdown
<!-- ✅ Agent skill calls API -->
<!-- packages/poem-core/skills/preview-with-data.md -->

## API Calls

- `POST /api/prompt/render`
  - Request: `{ template: string, data: object }`
  - Response: `{ rendered: string, renderTimeMs: number }`
```

```typescript
// ❌ DON'T: Direct service import in agent context
import { HandlebarsService } from '@services/handlebars';
const service = new HandlebarsService();
const result = service.render(template, data);
// WRONG: Tight coupling, no API contract, hard to test
```

### Heavy Operations in POEM

| Operation | Endpoint | Service | Why Heavy |
|-----------|----------|---------|-----------|
| **Template Rendering** | `POST /api/prompt/render` | HandlebarsService | Template parsing, placeholder resolution, helper execution |
| **Schema Extraction** | `POST /api/schema/extract` | SchemaExtractor | Template parsing, placeholder analysis, type inference |
| **Prompt Validation** | `POST /api/prompt/validate` | PromptValidator | Syntax check, schema cross-reference, anti-pattern detection |
| **Schema Validation** | `POST /api/schema/validate` | SchemaValidator | Recursive field validation, type checking, format constraints |
| **Mock Data Generation** | `POST /api/mock-data/generate` | MockDataGenerator | Schema parsing, data generation, constraint satisfaction |

**Common Characteristics**:
- Parsing (Handlebars, JSON Schema)
- Validation (syntax, types, formats)
- Transformation (template → rendered output)
- Analysis (extract placeholders, infer types)

## Rationale

**Why API-First?**

1. **Testability**: API endpoints can be tested independently with curl, Postman, or Vitest
2. **Separation of Concerns**: Service layer (business logic) separate from agent layer (orchestration)
3. **External Integration**: CLI tools, VS Code extensions, CI/CD pipelines can call APIs
4. **Performance Monitoring**: API endpoints report timing (e.g., `renderTimeMs`, `validationTimeMs`)
5. **Type Safety**: API contracts defined with TypeScript interfaces or Zod schemas
6. **Error Boundaries**: API errors don't crash agent context

**Architecture Layers**:
```
┌─────────────────────────────────────┐
│ Agents & Skills (Orchestration)    │ ← Markdown files, no TypeScript
├─────────────────────────────────────┤
│ API Endpoints (HTTP Interface)     │ ← Astro routes, type-safe
├─────────────────────────────────────┤
│ Services (Business Logic)          │ ← TypeScript classes
├─────────────────────────────────────┤
│ Utilities (Helpers)                │ ← Pure functions
└─────────────────────────────────────┘
```

**Agents call APIs, not services directly.**

## Related Patterns

- **Skills Self-Description Format** - Skills document API calls in "API Calls" section
- **Config Service Single Source of Truth** - Config accessed via API for path resolution

## When NOT to Use API-First

**Lightweight operations** can use direct service calls:
- Reading config files (fast, synchronous)
- Simple file operations (list directory)
- Path resolution (pure computation)

**Rule of Thumb**: If operation takes >10ms or involves parsing/validation, use API.

## Example: End-to-End Flow

### Scenario: User Asks to Preview Prompt

```
User: "Show me what the generate-titles prompt looks like with example data"
      ↓
Agent (Penny): Activates "preview-with-data" skill (based on "When to Use" context)
      ↓
Skill Instructions: "Call POST /api/prompt/render with template and mock data"
      ↓
API Endpoint: /api/prompt/render
      ↓
Service Layer: HandlebarsService.render(template, data)
      ↓
API Response: { rendered: "...", renderTimeMs: 23 }
      ↓
Agent (Penny): Formats response for user
      ↓
User: Sees rendered prompt output
```

**Key Points**:
- Agent never imports `HandlebarsService`
- Skill documents API contract
- Service layer testable in isolation
- Timing metrics included in response

## Implementation Checklist

When adding a new heavy operation:

- [ ] Create service class in `packages/poem-app/src/services/`
- [ ] Write unit tests for service logic
- [ ] Create API endpoint in `packages/poem-app/src/pages/api/`
- [ ] Define request/response types (TypeScript interfaces or Zod)
- [ ] Add API integration tests in `tests/api/`
- [ ] Document endpoint in `docs/architecture/api-specification.md`
- [ ] Reference endpoint in skill "API Calls" section
- [ ] Include timing metrics in response (e.g., `operationTimeMs`)
- [ ] Add error handling with clear messages (NFR6)

## API Specification Pattern

```typescript
// Request Interface
interface RenderPromptRequest {
  template: string;           // Handlebars template or path
  data: object;               // Input data for placeholders
  isRawTemplate?: boolean;    // True if template is inline string
}

// Response Interface
interface RenderPromptResponse {
  rendered: string;           // Rendered output
  renderTimeMs: number;       // Execution time
  warnings: string[];         // Non-fatal issues (missing placeholders, etc.)
  templatePath?: string;      // Path if template loaded from file
}

// Error Response
interface ErrorResponse {
  error: string;              // Error type (e.g., "TEMPLATE_NOT_FOUND")
  message: string;            // Human-readable error message
  details?: object;           // Additional context
}
```

## Testing Pattern

### Unit Tests (Service Layer)

```typescript
// packages/poem-app/tests/services/handlebars/renderer.test.ts
describe('HandlebarsService', () => {
  it('should render template with data', () => {
    const service = new HandlebarsService();
    const result = service.render('Hello {{name}}', { name: 'World' });
    expect(result.output).toBe('Hello World');
  });

  it('should report missing placeholders as warnings', () => {
    const service = new HandlebarsService();
    const result = service.render('Hello {{name}}', {});
    expect(result.warnings).toContain('Missing value for placeholder: name');
  });
});
```

### API Integration Tests

```typescript
// packages/poem-app/tests/api/prompt-render.test.ts
describe('POST /api/prompt/render', () => {
  it('should render template successfully', async () => {
    const response = await fetch('/api/prompt/render', {
      method: 'POST',
      body: JSON.stringify({
        template: 'Hello {{name}}',
        data: { name: 'World' },
        isRawTemplate: true
      })
    });

    const result = await response.json();
    expect(result.rendered).toBe('Hello World');
    expect(result.renderTimeMs).toBeGreaterThan(0);
  });

  it('should return 400 for invalid request', async () => {
    const response = await fetch('/api/prompt/render', {
      method: 'POST',
      body: JSON.stringify({ template: 123 }) // Invalid type
    });

    expect(response.status).toBe(400);
  });
});
```

### Manual Tests (via Claude Code Agent)

```bash
# Activate agent
/poem/agents/penny

# Trigger skill that calls API
User: "Preview the generate-titles prompt with example data"

# Agent internally calls:
POST /api/prompt/render
{
  "template": "dev-workspace/workflows/youtube/prompts/generate-titles.hbs",
  "data": { "topic": "AI Automation", "audience": "developers" }
}

# Verify response shown to user
```

## Anti-Patterns

```typescript
// ❌ ANTI-PATTERN: Agent imports service directly
import { HandlebarsService } from '@services/handlebars';

const service = new HandlebarsService();
const result = service.render(template, data);
// WRONG: Tight coupling, no API contract

// ❌ ANTI-PATTERN: Lightweight operation exposed as API
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ version: '1.0.0' }));
};
// WRONG: This is trivial, doesn't need API (could be constant)

// ❌ ANTI-PATTERN: No error handling in API
export const POST: APIRoute = async ({ request }) => {
  const { template, data } = await request.json();
  const result = service.render(template, data); // May throw
  return new Response(JSON.stringify(result));
  // WRONG: Unhandled errors crash endpoint
};

// ✅ CORRECT: Proper error handling
export const POST: APIRoute = async ({ request }) => {
  try {
    const { template, data } = await request.json();
    const result = service.render(template, data);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'RENDER_ERROR',
      message: error.message
    }), { status: 500 });
  }
};
```

## Performance Considerations

**NFR2: API operations must complete in <100ms (excluding mock data generation which can take up to 3 seconds).**

### Timing Metrics

All API responses include timing:

```typescript
interface APIResponse {
  // ... response data
  renderTimeMs?: number;        // Template rendering
  validationTimeMs?: number;    // Schema validation
  extractionTimeMs?: number;    // Schema extraction
  generationTimeMs?: number;    // Mock data generation
}
```

### Performance Tests

```typescript
describe('POST /api/schema/validate - Performance', () => {
  it('should complete in <100ms', async () => {
    const start = Date.now();
    await fetch('/api/schema/validate', {
      method: 'POST',
      body: JSON.stringify({ schema: testSchema, data: testData })
    });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);
  });
});
```

## References

- **Story 3.2**: `docs/stories/3.2.story.md` (Template Rendering API)
- **Story 3.3**: `docs/stories/3.3.story.md` (Schema Extraction API)
- **Story 3.4**: `docs/stories/3.4.story.md` (Prompt Validation API)
- **Story 3.7**: `docs/stories/3.7.story.md` (Schema Validation API)
- **API Spec**: `docs/architecture/api-specification.md` (complete API documentation)
- **Coding Standards**: `docs/architecture/coding-standards.md` (API-First principle)
- **Skills README**: `packages/poem-core/skills/README.md` (how skills call APIs)
- **Decision Record**: [ADR-003: API-First for Heavy Operations](../decisions/adr-003-api-first-for-heavy-operations.md)

---

**Pattern Established**: Story 3.2 (2026-01-10)
**Extended**: Stories 3.3, 3.4, 3.7 (2026-01-10 to 2026-01-12)
**Last Updated**: 2026-01-16
