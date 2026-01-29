# Integration Test Setup Guide

This guide explains how to set up and run integration tests for the POEM application.

## Server Start Workflow

**CRITICAL**: The POEM server MUST be started from the **monorepo root**, NOT from `packages/poem-app/`.

### Quick Start

```bash
# From monorepo root (/path/to/poem-os/poem)
npm run server
```

**Server Configuration**:
- **Port**: 9500 (default, configurable via `.env`)
- **Environment**: Development (`POEM_DEV=true`)
- **Startup Time**: < 3 seconds (NFR2 requirement)
- **Health Check**: `http://localhost:9500/api/health`

### Why Start from Root?

The root `package.json` includes a workspace-aware script:

```json
{
  "scripts": {
    "server": "npm run dev --workspace=@poem-os/app"
  }
}
```

This script:
1. Uses npm workspaces to target the correct package
2. Uses **relative paths** (no hardcoded absolute paths)
3. Runs the server in `packages/poem-app/` context
4. Works on any developer's machine without modification

## Integration Test Prerequisites

### 1. Environment Setup

**Required Environment Variables**:

| Variable | Value | Purpose |
|----------|-------|---------|
| `POEM_DEV` | `true` | Uses development paths (`packages/poem-core/` instead of `.poem-core/`) |
| `PORT` | `9500` (default) | Server port (1024-65535) |

**Set in `.env` file**:

```bash
# packages/poem-app/.env
POEM_DEV=true
PORT=9500
```

### 2. Server Must Be Running

Integration tests require a running POEM server. Most integration tests **spawn their own server instances** on unique ports to avoid conflicts.

**Manual Server Start** (for manual testing):

```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Run integration tests
npm run test:integration
```

**Auto-Spawned Server** (in test files):

Most integration tests use this pattern:

```typescript
const TEST_PORT = 4399; // Unique port per test file
let serverProcess: ChildProcess | null = null;

beforeAll(async () => {
  serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(TEST_PORT), POEM_DEV: 'true' },
    stdio: 'pipe',
  });

  await waitForServer(`http://localhost:${TEST_PORT}`, 10000);
}, 15000);

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
});
```

### 3. Health Check Verification

Before running integration tests, verify the server is healthy:

```bash
curl http://localhost:9500/api/health
```

**Expected Response**:

```json
{
  "status": "ok",
  "version": "0.1.0",
  "uptime": 0.123,
  "helpersLoaded": 10
}
```

**Health Check Failure**: If the endpoint returns non-200 status, check:
- Server is running
- PORT environment variable matches (`9500` or custom)
- No port conflicts (`lsof -i :9500`)

## AI Workflow for Integration Tests

**CRITICAL**: AI agents (like Claude Code) MUST follow this workflow when running integration tests:

### Step-by-Step AI Workflow

1. **Check if server is running**
   ```bash
   curl -s http://localhost:9500/api/health > /dev/null 2>&1
   ```

2. **If server NOT running, ASK human**
   ```
   Integration tests require POEM server. Can you run: npm run server?
   ```

3. **Wait for human response or confirmation**
   - Human may start server themselves
   - Human may ask AI to start it

4. **If human says "you do it", start server** (from root)
   ```bash
   npm run server
   ```

5. **Wait for server health check to pass**
   ```bash
   # Poll /api/health until 200 OK (max 10 seconds)
   for i in {1..20}; do
     curl -sf http://localhost:9500/api/health && break
     sleep 0.5
   done
   ```

6. **Run integration tests**
   ```bash
   npm run test:integration
   ```

**NEVER** run integration tests without asking human first. Server startup can interfere with other work.

## Running Integration Tests

### All Integration Tests

```bash
npm run test:integration
```

### Specific Integration Test File

```bash
npx vitest run tests/integration/api/health.test.ts
```

### With Environment Variable

Some tests are skipped by default and require explicit opt-in:

```bash
INTEGRATION_TEST=1 npm run test:integration
```

## Expected Server Errors

**Target**: <5 non-critical errors during normal server operation.

**Common Expected Errors** (non-critical):

| Error Type | Example | Resolution |
|------------|---------|------------|
| Missing optional config | `WARN: poem.yaml not found (using defaults)` | Expected in dev mode |
| Deprecation warnings | `DeprecationWarning: ...` | Track for future updates |
| Beta software notices | `⚠️  This is a beta prerelease build!` | Expected (Astro 6 beta) |

**Unexpected Errors** (investigate immediately):

- Broken imports or missing files
- Unhandled exceptions
- Configuration errors
- File system permission errors

**If server error flood occurs**:
1. Check `PORT` is configured in `.env` (`PORT=9500`)
2. Verify no port conflicts (`lsof -i :9500`)
3. Check `POEM_DEV=true` is set
4. Review server startup logs for specific errors

## Troubleshooting

### Port Already in Use

**Problem**: `❌ Port 9500 is already in use`

**Solution**:

```bash
# Find process using port 9500
lsof -i :9500

# Kill the process
kill <PID>

# Or use a different port
PORT=9501 npm run server
```

### Server Won't Start

**Problem**: Server crashes on startup

**Checklist**:
1. ✅ Node.js version 22.x or higher (`node --version`)
2. ✅ Dependencies installed (`npm install`)
3. ✅ `.env` file exists in `packages/poem-app/`
4. ✅ No syntax errors in `astro.config.mjs`
5. ✅ No port conflicts

**Debug Mode**:

```bash
# Start server with verbose logging
DEBUG=* npm run server
```

### Integration Tests Fail

**Problem**: Tests fail with `ECONNREFUSED`

**Solution**:
1. Verify server is running (`curl http://localhost:9500/api/health`)
2. Check test uses correct port (9500 or test-specific port)
3. Ensure `POEM_DEV=true` in test environment
4. Wait longer for server startup (increase timeout in `beforeAll`)

**Problem**: Tests fail with "Cannot find module"

**Solution**:
- Check import paths in test files
- Verify source files exist
- Run `npm install` to ensure dependencies are installed

### Flaky Tests

**Problem**: Tests pass sometimes, fail other times

**Common Causes**:
- Race conditions (file system operations)
- Insufficient wait times for async operations
- Port conflicts between parallel test runs
- Shared state between tests

**Solutions**:
- Add explicit waits (`await new Promise(resolve => setTimeout(resolve, 100))`)
- Use unique ports per test file
- Clean up fixtures in `afterEach`
- Avoid shared global state

## Test Organization

**See**: `packages/poem-app/tests/README.md` for complete test organization guide.

**Unit vs Integration**:

| Aspect | Unit Tests | Integration Tests |
|--------|-----------|-------------------|
| **Server Required** | No | Yes |
| **Speed** | Fast (<100ms) | Slower (>100ms) |
| **Isolation** | Complete | External dependencies |
| **What to Test** | Services, utilities, helpers | API endpoints, workflows |
| **Run Command** | `npm run test:unit` | `npm run test:integration` |
| **Location** | `tests/unit/` | `tests/integration/` |

## Next Steps

1. ✅ Start POEM server: `npm run server`
2. ✅ Verify health check: `curl http://localhost:9500/api/health`
3. ✅ Run integration tests: `npm run test:integration`
4. ✅ Review test output for failures

**For AI Agents**: Follow the AI Workflow section above before running any integration tests.

---

**Last Updated**: 2026-01-29 (Story 0.7)
**Related Docs**:
- `packages/poem-app/tests/README.md` - Test organization guide
- `CLAUDE.md` - Development setup
- `docs/architecture/testing-strategy.md` - Testing philosophy
