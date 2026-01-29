# POEM App

Runtime server for POEM (Prompt Orchestration and Engineering Method).

## Development

**Start Server** (from monorepo root):
```bash
npm run server
```

Server runs at `http://localhost:9500`

**Configuration** (`packages/poem-app/.env`):
```
POEM_DEV=true
PORT=9500
```

**Testing**:
```bash
# All tests
npm test

# Unit tests (fast, no server)
npm run test:unit

# Integration tests (requires server)
npm run test:integration
```

See `tests/README.md` for test organization details.
See `../../docs/guides/integration-test-setup.md` for integration test setup.

## Architecture

- **Framework**: Astro 6 (beta) with Node adapter
- **Template Engine**: Handlebars.js 4.7.x
- **Testing**: Vitest 4.x
- **Runtime**: Node.js 22.x LTS

See `../../docs/architecture.md` for complete architecture documentation.
