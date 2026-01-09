# Testing Strategy

POEM requires a **hybrid testing approach**: automated tests for the runtime server (`.poem-app/`) and manual testing via Claude Code for the framework documents (`.poem-core/`).

## Testing Pyramid

```
        ┌─────────────────────┐
        │   Manual Testing    │  ← Agents, Workflows, Skills
        │   (Claude Code)     │     via conversation
        ├─────────────────────┤
        │  Integration Tests  │  ← API endpoints, provider
        │     (Vitest)        │     integrations
        ├─────────────────────┤
        │    Unit Tests       │  ← Handlebars service, schema
        │     (Vitest)        │     extractor, mock generator
        └─────────────────────┘
```

## Test Organization

### Unit Tests (packages/poem-app/tests/)

```
tests/
├── services/
│   ├── handlebars/
│   │   ├── service.test.ts
│   │   ├── helpers/
│   │   │   ├── titleCase.test.ts
│   │   │   ├── truncate.test.ts
│   │   │   ├── gt.test.ts
│   │   │   ├── join.test.ts
│   │   │   └── formatTimestamp.test.ts
│   │   └── watcher.test.ts
│   │
│   ├── schema/
│   │   ├── extractor.test.ts
│   │   └── validator.test.ts
│   │
│   └── mock-generator/
│       ├── generator.test.ts
│       └── type-mappers.test.ts
│
├── api/
│   ├── health.test.ts
│   ├── prompt-render.test.ts
│   ├── schema-extract.test.ts
│   ├── schema-validate.test.ts
│   ├── mock-generate.test.ts
│   └── helpers.test.ts
│
└── fixtures/
    ├── templates/
    ├── schemas/
    └── data/
```

### Manual Testing (Claude Code)

```
Manual Test Scenarios:
├── Agent Activation
│   ├── /poem/agents/penny activates correctly
│   ├── Agent displays help on activation
│   └── Agent responds to commands (*new, *refine, etc.)
│
├── Workflow Execution
│   ├── *new creates prompt + schema files
│   ├── *refine loads existing prompt correctly
│   ├── *test renders with mock data
│   └── Workflow respects user decisions
│
├── Skill Invocation
│   ├── Skills activate in appropriate contexts
│   ├── Skills call APIs correctly
│   └── Skills report results to user
│
└── End-to-End Scenarios
    ├── Create prompt → Test → Refine → Deploy
    ├── YouTube Launch Optimizer chain
    └── Provider integration (if available)
```

## Test Examples

### Unit Test: Handlebars Service

```typescript
// tests/services/handlebars/service.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { HandlebarsService } from "../../../src/services/handlebars";

describe("HandlebarsService", () => {
  let service: HandlebarsService;

  beforeEach(() => {
    service = new HandlebarsService();
  });

  describe("compile", () => {
    it("should compile a simple template", () => {
      const template = "Hello {{name}}";
      const compiled = service.compile(template);
      expect(compiled).toBeDefined();
    });

    it("should throw on invalid syntax", () => {
      const template = "Hello {{name}"; // Missing closing
      expect(() => service.compile(template)).toThrow();
    });
  });

  describe("render", () => {
    it("should render template with data", () => {
      const template = "Hello {{name}}";
      const result = service.render(template, { name: "World" });
      expect(result).toBe("Hello World");
    });

    it("should handle nested data", () => {
      const template = "{{user.firstName}} {{user.lastName}}";
      const result = service.render(template, {
        user: { firstName: "John", lastName: "Doe" },
      });
      expect(result).toBe("John Doe");
    });

    it("should handle missing data gracefully", () => {
      const template = "Hello {{name}}";
      const result = service.render(template, {});
      expect(result).toBe("Hello ");
    });
  });

  describe("helpers", () => {
    it("should use titleCase helper", () => {
      const template = "{{titleCase name}}";
      const result = service.render(template, { name: "hello world" });
      expect(result).toBe("Hello World");
    });

    it("should use truncate helper", () => {
      const template = "{{truncate text 10}}";
      const result = service.render(template, { text: "This is a long text" });
      expect(result).toBe("This is a...");
    });
  });
});
```

### Integration Test: API Endpoint

```typescript
// tests/api/prompt-render.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "../../src/server";

describe("POST /api/prompt/render", () => {
  let server: any;
  let baseUrl: string;

  beforeAll(async () => {
    server = await createServer({ port: 0 }); // Random port
    baseUrl = `http://localhost:${server.address().port}`;
  });

  afterAll(async () => {
    await server.close();
  });

  it("should render a raw template", async () => {
    const response = await fetch(`${baseUrl}/api/prompt/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: "Hello {{name}}",
        data: { name: "World" },
        isRawTemplate: true,
      }),
    });

    expect(response.ok).toBe(true);
    const result = await response.json();
    expect(result.rendered).toBe("Hello World");
    expect(result.renderTimeMs).toBeDefined();
  });

  it("should return 400 for invalid template", async () => {
    const response = await fetch(`${baseUrl}/api/prompt/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: "Hello {{name}",
        data: {},
        isRawTemplate: true,
      }),
    });

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toBeDefined();
  });

  it("should report missing fields as warnings", async () => {
    const response = await fetch(`${baseUrl}/api/prompt/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: "{{firstName}} {{lastName}}",
        data: { firstName: "John" },
        isRawTemplate: true,
      }),
    });

    const result = await response.json();
    expect(result.warnings).toContain("Missing field: lastName");
  });
});
```

## Coverage Targets

| Area               | Target | Rationale                           |
| ------------------ | ------ | ----------------------------------- |
| Handlebars Service | 90%    | Core functionality, many edge cases |
| Schema Extractor   | 85%    | Complex parsing logic               |
| Mock Generator     | 80%    | Type mapping coverage               |
| API Endpoints      | 75%    | Integration paths                   |
| Helpers            | 100%   | Simple, deterministic functions     |

## NFR Validation Tests

```typescript
// tests/nfr/performance.test.ts
import { describe, it, expect } from "vitest";

describe("NFR Performance", () => {
  it("NFR2: Server starts in under 3 seconds", async () => {
    const start = Date.now();
    const server = await createServer();
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(3000);
    await server.close();
  });

  it("NFR3: Render completes in under 1 second", async () => {
    const template = loadFixture("large-template.hbs"); // ~5KB
    const data = loadFixture("large-data.json");

    const start = Date.now();
    await fetch("/api/prompt/render", {
      method: "POST",
      body: JSON.stringify({ template, data, isRawTemplate: true }),
    });
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(1000);
  });
});
```

---
