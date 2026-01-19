# Learning: Integration Tests Deferred to SAT Phase

**Date**: 2026-01-14
**Source**: Stories 4.5, 4.6 (Run Single Prompt, Run Prompt Chain)
**Category**: Testing Strategy / Workflow Pattern

## Context

Stories 4.5 and 4.6 implemented API endpoints (`/api/prompt/render`, `/api/chain/execute`) with comprehensive unit test coverage (713 tests, 28 tests respectively) but needed integration tests that require a running server.

## Challenge

**Problem**: Writing integration tests during development requires:
1. Starting Astro dev server (port 4321 or configured port)
2. Waiting for server ready signal
3. Running tests against live server
4. Managing server lifecycle (start before tests, stop after)

**Issue discovered**: Dev agent wrote integration tests but execution was deferred because:
- Server startup adds 5-10 seconds to test suite
- Tests are written but server may not be running during story development
- Integration tests belong in SAT (Story Acceptance Testing) phase, not development phase

**Pattern emerged**: **Write integration tests during development, execute during SAT**.

## Solution

**Workflow pattern established**:

1. **Development Phase** (Dev Agent):
   - Write comprehensive unit tests (mock-free, fast, <1 second)
   - Write integration tests in `tests/api/` directory
   - Mark integration tests appropriately (comment: "requires server")
   - Validate logic through unit tests (713/713 passing for Story 4.5)

2. **SAT Phase** (QA Agent):
   - Start Astro dev server (`npm run dev`)
   - Execute integration tests against live server
   - Validate end-to-end behavior (API → Service → Response)
   - Mark story Done if SAT tests pass

**Test organization**:
```
tests/
├── services/           # Unit tests (run during development)
│   ├── handlebars/     # Fast, no server needed
│   ├── chain/          # Mock-based, isolated
│   └── mock-generator/ # Pure logic tests
└── api/                # Integration tests (run during SAT)
    ├── prompt-render.test.ts    # Requires server
    └── chain-execute.test.ts     # Requires server
```

**Key insight**: Integration tests are documentation + validation, not blocking development.

## Outcome

**Benefits**:
- ✅ Unit tests provide fast feedback during development (<1 second)
- ✅ Integration tests written with full context (while logic fresh in mind)
- ✅ SAT phase has ready-to-execute tests (no test writing delay)
- ✅ Clear separation: Unit tests (dev) vs Integration tests (SAT)
- ✅ Quality gate doesn't block on integration test execution (unit tests sufficient for PASS)

**Story 4.5**:
- 713 unit tests written and passing during development
- 6 integration tests written but execution deferred to SAT
- QA gate: PASS (100/100) based on unit test coverage

**Story 4.6**:
- 28 unit tests passing during development
- 6 integration tests written but execution deferred to SAT
- QA gate: PASS (100/100) based on unit test coverage
- SAT tests executed manually: 8/8 passed

## Prevention with Epic 3 Knowledge ⭐

- **Was this avoidable?**: No - this is a workflow pattern, not a mistake
- **Epic 3 Learning Missed**: N/A (pattern is appropriate, not a failure)
- **Root Cause**: N/A - intentional workflow design

**Pattern validation**: This workflow works well and should be continued.

## Discovery Mode Status ⭐

- **Triggered?**: No
- **Architecture Docs Read**: `docs/architecture/testing-strategy.md` (testing levels documented)
- **Should Have Triggered?**: No - testing strategy already documented

## Future Application

**When implementing API endpoints**:

1. ✅ **DO**: Write unit tests first (service logic, edge cases)
2. ✅ **DO**: Validate unit tests pass before moving to QA
3. ✅ **DO**: Write integration tests in `tests/api/` during development
4. ✅ **DO**: Comment integration tests: "Requires server - execute during SAT"
5. ✅ **DO**: Execute integration tests during SAT phase (manual or automated)
6. ❌ **DON'T**: Block QA gate on integration test execution
7. ❌ **DON'T**: Start server during unit test execution (slows feedback loop)

**SAT Execution Pattern** (from Story 4.6):
```bash
# Terminal 1: Start server
npm run dev
# Wait for "Server ready"

# Terminal 2: Run integration tests
npm test tests/api/chain-execute.test.ts
# Verify all tests pass

# Document results in story file
```

## Related Knowledge

- **Story 4.5**: `docs/stories/4.5.story.md` (713/714 unit tests, 6 integration tests written)
- **Story 4.6**: `docs/stories/4.6.story.md` (28 unit tests, 6 integration tests, SAT: 8/8 passed)
- **Testing Strategy**: `docs/architecture/testing-strategy.md` (testing levels documented)
- **QA Gates**: `docs/qa/gates/4.5-*.yml`, `docs/qa/gates/4.6-*.yml` (100/100 scores without integration execution)

---

**Learning Captured**: 2026-01-14
**Impact**: Low (workflow pattern, not a problem)
**Pattern Type**: Intentional workflow design
**Last Updated**: 2026-01-19
