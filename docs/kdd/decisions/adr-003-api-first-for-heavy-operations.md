# ADR-003: API-First for Heavy Operations

**Date**: 2026-01-10 to 2026-01-12
**Status**: Accepted
**Source**: Stories 3.2, 3.3, 3.4, 3.7 (Epic 3 architectural pattern)

## Context

POEM's agents (like Penny, the Prompt Engineer) need to perform computationally expensive operations:
- **Template rendering**: Parse Handlebars templates, resolve placeholders, execute helpers
- **Schema extraction**: Analyze templates to infer input schemas
- **Prompt validation**: Check syntax, schema compatibility, anti-patterns
- **Schema validation**: Validate data against JSON schemas
- **Mock data generation**: Generate test data satisfying schema constraints

### The Problem

Two architectural approaches were possible:

**Option A: Direct Service Imports** (Agent calls TypeScript services directly)
```typescript
// Agent-side code (hypothetical)
import { HandlebarsService } from '@services/handlebars';
const service = new HandlebarsService();
const result = service.render(template, data);
```

**Option B: API-First** (Agent calls HTTP endpoints)
```markdown
<!-- Agent skill documentation -->
## API Calls
- `POST /api/prompt/render`
  - Request: `{ template: string, data: object }`
  - Response: `{ rendered: string, renderTimeMs: number }`
```

**Questions**:
1. Should agents directly import and call service classes?
2. Or should all heavy operations be exposed via API endpoints?
3. What about lightweight operations (reading config, listing files)?

## Decision

**Adopt API-First architecture** for all computationally expensive operations (parsing, validation, rendering, transformation).

### Core Principle

**Every operation that takes >10ms or involves parsing/validation gets an API endpoint.**

### Heavy Operations → API Endpoints

| Operation | Endpoint | Why API? |
|-----------|----------|----------|
| **Template Rendering** | `POST /api/prompt/render` | Handlebars parsing, helper execution (20-50ms) |
| **Schema Extraction** | `POST /api/schema/extract` | Template analysis, type inference (30-60ms) |
| **Prompt Validation** | `POST /api/prompt/validate` | Syntax check, schema cross-reference (40-80ms) |
| **Schema Validation** | `POST /api/schema/validate` | Recursive field validation (10-50ms) |
| **Mock Data Generation** | `POST /api/mock-data/generate` | Data generation with constraints (100-3000ms) |

### Lightweight Operations → Direct Service Calls

| Operation | Approach | Why Direct? |
|-----------|----------|-------------|
| **Config Resolution** | Direct call to ConfigService | Fast (<1ms), synchronous |
| **List Directory** | File system read | Fast (<5ms) |
| **Path Resolution** | Pure computation | Instant (<1ms) |

### Architecture Layers

```
┌─────────────────────────────────────┐
│ Agents & Skills (Orchestration)    │ ← Markdown files, call APIs
├─────────────────────────────────────┤
│ API Endpoints (HTTP Interface)     │ ← Astro routes, type-safe
├─────────────────────────────────────┤
│ Services (Business Logic)          │ ← TypeScript classes
├─────────────────────────────────────┤
│ Utilities (Helpers)                │ ← Pure functions
└─────────────────────────────────────┘
```

**Key Rule**: Agents call APIs, never import services directly.

## Alternatives Considered

### Alternative 1: Direct Service Imports (Rejected)

**Approach**: Agents directly import and call TypeScript service classes.

**Pros**:
- Simpler (no HTTP overhead)
- Type-safe at import time
- No API contract needed
- Faster (no network serialization)

**Cons**:
- **Tight Coupling**: Agents depend on service implementations
- **Hard to Test**: Can't test agents without full service stack
- **No External Integration**: CLI tools, VS Code extensions can't call operations
- **No Performance Monitoring**: Can't measure operation timing
- **Mixing Concerns**: Agent layer knows about service internals
- **Breaking Changes**: Service refactoring breaks agents

**Example Failure Scenario**:
```typescript
// Agent code
import { HandlebarsService } from '@services/handlebars';
const service = new HandlebarsService();
const result = service.render(template, data);

// Problem: If HandlebarsService refactored to async, agent breaks:
const result = await service.render(template, data); // Now async!
// All agents must be updated
```

### Alternative 2: Hybrid Approach (Rejected)

**Approach**: Heavy operations via API, lightweight via direct calls, but no clear boundary.

**Pros**:
- Flexibility (choose per operation)
- Optimize for performance case-by-case

**Cons**:
- **Inconsistent Architecture**: No clear pattern
- **Decision Fatigue**: Every operation requires API vs direct choice
- **Testing Confusion**: Some paths mocked, some not
- **Documentation Burden**: Must explain when to use each approach

### Alternative 3: API-First with Clear Boundary (Accepted)

As described in Decision section above.

**Pros**:
- **Clear Architecture**: Simple rule (>10ms → API)
- **Testability**: API endpoints independently testable
- **External Integration**: CLI, VS Code extensions can call APIs
- **Performance Monitoring**: API responses include timing
- **Type Safety**: API contracts defined with Zod schemas
- **Loose Coupling**: Agents don't know service implementations
- **Versioning**: API versions can be maintained independently

**Cons**:
- HTTP overhead (minimal - 1-2ms)
- More code (endpoint + service)
- API contracts to maintain

**Trade-off**: Slight performance cost justified by testability, maintainability, and integration benefits.

## Rationale

### 1. Testability

**API endpoints can be tested independently:**
```bash
# Test rendering without agent context
curl -X POST http://localhost:4321/api/prompt/render \
  -d '{"template": "Hello {{name}}", "data": {"name": "World"}}'

# Response:
# {"rendered": "Hello World", "renderTimeMs": 23}
```

**Vitest integration tests:**
```typescript
describe('POST /api/prompt/render', () => {
  it('should render template successfully', async () => {
    const response = await fetch('/api/prompt/render', {
      method: 'POST',
      body: JSON.stringify({
        template: 'Hello {{name}}',
        data: { name: 'World' }
      })
    });
    const result = await response.json();
    expect(result.rendered).toBe('Hello World');
  });
});
```

### 2. Separation of Concerns

**Clear responsibility boundaries:**
- **Agents**: Orchestrate workflows, interpret user intent
- **APIs**: Define contracts, handle HTTP concerns
- **Services**: Implement business logic

Agent skills document API calls, not implementation:
```markdown
## API Calls
- `POST /api/schema/extract`
  - Extracts input and output schemas from template
  - Request: `{ template: string }`
  - Response: `{ schema: UnifiedSchema }`
```

### 3. External Integration

**CLI tools can call same APIs:**
```bash
# poem-cli render command
poem render generate-titles.hbs --data data.json
# Internally: POST /api/prompt/render
```

**VS Code extension can call APIs:**
```typescript
// VS Code extension
const response = await fetch('http://localhost:4321/api/prompt/validate', {
  method: 'POST',
  body: JSON.stringify({ template: currentDocument.getText() })
});
```

### 4. Performance Monitoring

**All API responses include timing:**
```json
{
  "rendered": "...",
  "renderTimeMs": 23,
  "warnings": []
}
```

**NFR2 Compliance**: API operations must complete in <100ms (verified in tests).

### 5. Error Boundaries

**API errors don't crash agent context:**
```typescript
// Service throws error
service.render(template, data); // Throws SyntaxError

// API catches and returns error response
return new Response(JSON.stringify({
  error: 'SYNTAX_ERROR',
  message: 'Unmatched {{#if}} tag at line 12'
}), { status: 400 });
```

Agent handles error gracefully:
```markdown
**Error**: Template has syntax error at line 12.
**Suggestion**: Check for unmatched {{#if}} tags.
```

## Consequences

### Positive Consequences

1. **Testability**: APIs testable with curl, Postman, Vitest
2. **Maintainability**: Service refactoring doesn't break agents
3. **Integration**: CLI, VS Code, CI/CD can call same APIs
4. **Monitoring**: Performance metrics built-in
5. **Type Safety**: Zod schemas enforce API contracts
6. **Documentation**: API spec serves as reference
7. **Versioning**: Can maintain multiple API versions

### Negative Consequences

1. **HTTP Overhead**: 1-2ms per call (acceptable for >10ms operations)
2. **More Code**: Endpoint layer + service layer
3. **API Maintenance**: Contracts must be maintained
4. **Learning Curve**: Developers must understand API-first pattern

### Mitigation

- **Clear Boundary Rule**: >10ms → API (eliminates decision fatigue)
- **Zod Validation**: Type-safe request/response schemas
- **API Documentation**: `docs/architecture/api-specification.md` maintained
- **Code Generation**: Consider OpenAPI spec generation (future)

## Implementation

### Epic 3 API Endpoints Created

**Story 3.2** - Template Rendering:
- `POST /api/prompt/render` - Render Handlebars templates

**Story 3.3** - Schema Extraction:
- `POST /api/schema/extract` - Extract input/output schemas

**Story 3.4** - Prompt Validation:
- `POST /api/prompt/validate` - Validate prompt syntax and structure

**Story 3.7** - Schema Validation:
- `POST /api/schema/validate` - Validate data against schemas

### API Specification Pattern

```typescript
// Request/Response Types
interface RenderPromptRequest {
  template: string;
  data: object;
  isRawTemplate?: boolean;
}

interface RenderPromptResponse {
  rendered: string;
  renderTimeMs: number;
  warnings: string[];
  templatePath?: string;
}

// Astro Endpoint
export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate request with Zod
    const body = await request.json();
    const validated = RenderPromptRequestSchema.parse(body);

    // Call service
    const service = new HandlebarsService();
    const result = service.render(validated.template, validated.data);

    // Return response with timing
    return new Response(JSON.stringify({
      rendered: result.output,
      renderTimeMs: result.timeMs,
      warnings: result.warnings
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'RENDER_ERROR',
      message: error.message
    }), { status: 500 });
  }
};
```

### Skills Reference APIs

```markdown
<!-- packages/poem-core/skills/preview-with-data.md -->

## API Calls

- `POST /api/prompt/render`
  - Renders Handlebars template with provided data
  - Request: `{ template: string, data: object }`
  - Response: `{ rendered: string, renderTimeMs: number, warnings: string[] }`
  - Timeout: <100ms (NFR2)
```

## Related Decisions

- **Pattern: API-First Heavy Operations** - Implementation details
- **Pattern: Skills Self-Description Format** - Skills document API calls
- **ADR-001: Unified Schema Structure** - Schema validation via API

## References

- **Story 3.2**: `docs/stories/3.2.story.md` (Template Rendering API)
- **Story 3.3**: `docs/stories/3.3.story.md` (Schema Extraction API)
- **Story 3.4**: `docs/stories/3.4.story.md` (Prompt Validation API)
- **Story 3.7**: `docs/stories/3.7.story.md` (Schema Validation API)
- **API Spec**: `docs/architecture/api-specification.md` (complete API docs)
- **Coding Standards**: `docs/architecture/coding-standards.md` (API-First principle documented)
- **Pattern**: `docs/kdd/patterns/api-first-heavy-operations.md`

---

**Last Updated**: 2026-01-16
**Author**: Dev Agent (Epic 3)
**Established**: Stories 3.2, 3.3, 3.4, 3.7
