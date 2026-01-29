# POEM Test Organization

This directory contains all automated tests for the POEM application.

## Directory Structure

```
tests/
├── unit/              # Unit tests (no server required)
├── integration/       # Integration tests (requires server)
└── fixtures/          # Shared test data
```

## Test Categories

### Unit Tests (`tests/unit/`)

**Characteristics**:
- No external dependencies (no server, no file system operations)
- Fast execution (<100ms per test)
- Isolated and deterministic

**What to test**:
- Services and utilities (Handlebars service, schema extractor, mock generator)
- Helper functions (titleCase, truncate, formatTimestamp, etc.)
- Business logic and data transformations
- Type definitions and validators

**Run unit tests only**:
```bash
npm run test:unit
```

**Examples**:
- `unit/services/handlebars/helpers/titleCase.test.ts` - Test titleCase helper
- `unit/services/schema/validator.test.ts` - Test schema validation logic
- `unit/services/mock-generator/generator.test.ts` - Test mock data generation

### Integration Tests (`tests/integration/`)

**Characteristics**:
- Require running POEM server
- Slower execution (>100ms per test, includes server startup)
- Test API endpoints and workflows

**What to test**:
- API endpoints (`/api/prompt/render`, `/api/schema/extract`, etc.)
- Multi-step workflows (prompt rendering with schema validation)
- File operations in user workspace

**Prerequisites**:
1. POEM server must be running: `npm run server` (from monorepo root)
2. Environment variable `POEM_DEV=true` must be set

**Run integration tests only**:
```bash
npm run test:integration
```

**Note**: Integration tests spawn their own server instances on unique ports to avoid conflicts.

**Examples**:
- `integration/api/prompt-render.test.ts` - Test template rendering API
- `integration/api/schema-extract.test.ts` - Test schema extraction API
- `integration/api/health.test.ts` - Test health check endpoint

## Running Tests

```bash
# Run all tests (unit + integration)
npm test

# Run unit tests only (fast, no server required)
npm run test:unit

# Run integration tests only (requires server)
npm run test:integration

# Watch mode (re-run on file changes)
npm run test:watch
```

## Test Baseline

**Current Status** (after Story 0.7 test organization):
- **Unit tests**: 756/764 passing (99.0%), 5 skipped
- **Integration tests**: 7 test files (some skipped by env var)
- **Total**: 872 tests target (Story 0.6 baseline: 810 passing)

**Zero Tolerance Policy**:
- No skipped tests allowed in production (all must pass or be removed)
- No flaky tests (tests must pass consistently)
- Clear error messages when tests fail

## Writing New Tests

**Unit Test Template**:
```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../../../../src/services/your-service.js';

describe('yourFunction', () => {
  it('should do something specific', () => {
    const result = yourFunction(input);
    expect(result).toBe(expected);
  });
});
```

**Integration Test Template**:
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';

const TEST_PORT = 4399; // Use unique port
const BASE_URL = `http://localhost:${TEST_PORT}`;

describe('POST /api/your-endpoint', () => {
  let serverProcess: ChildProcess | null = null;

  beforeAll(async () => {
    // Start server on unique port
    serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      env: { ...process.env, PORT: String(TEST_PORT), POEM_DEV: 'true' },
      stdio: 'pipe',
    });

    await waitForServer(BASE_URL, 10000);
  }, 15000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
  });

  it('should return expected response', async () => {
    const response = await fetch(`${BASE_URL}/api/your-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'test' }),
    });

    expect(response.ok).toBe(true);
    const result = await response.json();
    expect(result).toMatchObject({ success: true });
  });
});
```

## Path Resolution

**Import Depth by Location**:

| Test Location | Import Depth | Example |
|---------------|--------------|---------|
| `tests/unit/services/` | `../../../src/` | `import X from '../../../src/services/X.js'` |
| `tests/unit/services/handlebars/helpers/` | `../../../../../src/` | `import X from '../../../../../src/services/handlebars/helpers/X.js'` |
| `tests/unit/tasks/` | `../../../../src/` | `import X from '../../../../src/services/X.js'` |
| `tests/integration/api/` | `../../../../src/` | `import X from '../../../../src/pages/api/X.ts'` |

**Accessing poem-core**:
- From `tests/unit/tasks/`: `../../../../poem-core/tasks/your-workflow.yaml`
- From `tests/unit/utils/`: `../../../../poem-core/utils/your-util.ts`

## Continuous Integration

Tests run automatically on:
- Pre-commit hook (via Husky): Unit tests only (fast)
- GitHub Actions CI: All tests (unit + integration)

**Skip integration tests in CI/pre-commit**:
```typescript
const SKIP_INTEGRATION = !process.env.INTEGRATION_TEST;
describe.skipIf(SKIP_INTEGRATION)('Integration test suite', () => {
  // Tests that require server
});
```

## Troubleshooting

**"Cannot find module" errors**:
- Check import depth (`../` count) matches test file location
- Verify source file exists at expected path

**Integration tests failing**:
- Ensure POEM server is running: `npm run server`
- Check `POEM_DEV=true` in environment
- Verify port not already in use

**Flaky tests**:
- Add explicit waits for async operations
- Use unique ports for integration tests
- Clean up test fixtures in `afterEach`

---

**Last Updated**: 2026-01-29 (Story 0.7)
