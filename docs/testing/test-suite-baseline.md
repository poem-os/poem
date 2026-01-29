# Test Suite Baseline

This document tracks the health and progress of the POEM test suite over time.

## Current Status

**As of Story 0.7** (2026-01-29):
- **Total Tests**: 872 (target)
- **Unit Tests**: 764 total, 756 passing (99.0%), 5 skipped, 3 failed
- **Integration Tests**: 7 test files (some skipped via env var)
- **Test Organization**: Separated into `tests/unit/` and `tests/integration/`

## Historical Baseline

### Pre-Story 0.6 (Baseline)
- **Total**: 872 tests
- **Passing**: 797-801 (varies by run)
- **Failures**: 62-66 (flaky/skipped)
- **Issues**: 10 pre-existing failures, 66 skipped tests, server error flood

### Story 0.6 Completion
- **Total**: 872 tests
- **Passing**: 810/872 (92.9%)
- **Improvement**: +9 to +13 tests (75-88% failure reduction)
- **Key Fix**: Added `zod@^3.23.0` explicit dependency
- **Deferred Work**: Test organization, documentation, server errors, 66 skipped tests

### Story 0.7 Progress
- **Test Organization**: ✅ Separated unit (34 files) and integration (7 files)
- **Server Error Flood**: ✅ **FIXED** (0 errors with `PORT=9500` in .env)
- **Unit Tests**: 756/764 passing (99.0%)
- **Remaining**: 5 skipped, 3 failed (watcher flaky)
- **Integration Tests**: Not fully validated yet

## Test Categories Breakdown

### Unit Tests (`tests/unit/`)
| Category | Files | Tests | Status |
|----------|-------|-------|--------|
| Handlebars Helpers | 10 | ~100 | ✅ Passing |
| Services | 13 | ~400 | ✅ Mostly passing |
| Utils | 3 | ~50 | ✅ Passing |
| Agent Commands | 2 | ~20 | ✅ Passing |
| Skills | 3 | ~30 | ✅ Passing |
| Tasks | 3 | ~30 | ✅ Passing |
| **Total** | **34** | **764** | **756 passing (99.0%)** |

### Integration Tests (`tests/integration/`)
| Category | Files | Tests | Status |
|----------|-------|-------|--------|
| API Endpoints | 7 | ~108 | Some skipped (env var) |
| Capability Query | 1 | ~10 | ✅ Passing |
| **Total** | **8** | **~118** | **Needs validation** |

## Target Metrics

### Story 0.7 Goals
- ✅ **Organize tests**: Unit vs integration separation
- ✅ **Reduce server errors**: <5 target (achieved: 0)
- ⚙️ **Zero skipped tests**: 0/872 (current: 5 skipped)
- ⚙️ **All tests passing**: 872/872 (current: 756/764 unit)
- ⚙️ **Test health script**: `npm run test:health`

### Long-Term Health Indicators
- **Pass Rate**: 100% (872/872)
- **Skipped Tests**: 0 (zero tolerance)
- **Flaky Tests**: 0 (consistent pass over 10 runs)
- **Test Execution Time**: <30s for unit tests, <2min for all tests
- **Coverage**: See `docs/architecture/testing-strategy.md` for targets

## Known Issues

### Story 0.7 Remaining Work
1. **5 Skipped Tests** (unit tests):
   - Location: Various services tests
   - Reason: TBD (requires investigation)
   - Action: Investigate and fix/remove (Task 6)

2. **3 Failed Tests** (watcher.test.ts):
   - Tests: `should detect new helper files`, `should extract helper metadata`
   - Type: Flaky (timing-dependent)
   - Action: Passes in isolation, fails in suite (race condition)

3. **Integration Tests Not Validated**:
   - Many integration tests skipped by `INTEGRATION_TEST` env var
   - Action: Run with `INTEGRATION_TEST=1` and validate

## Test Health Script

**Command**: `npm run test:health`

**Output Format**:
```
✅ 872/872 passing (100%)
Unit: 764/764 (100%)
Integration: 108/108 (100%)
Skipped: 0
Flaky: 0
```

**Exit Codes**:
- `0`: All tests passing
- `1`: Failures or skipped tests detected

**Usage**:
```bash
# Check test suite health
npm run test:health

# In Definition of Done checklist
- [ ] Run `npm run test:health` and confirm 100% passing
```

## Regression Prevention

**Before each story**:
1. Run `npm run test:health` to establish baseline
2. Document current pass/fail/skip counts

**After each story**:
1. Run `npm run test:health` to verify no regressions
2. Update this baseline document
3. All new tests must pass before marking story "Done"

**CI/CD Integration**:
- Pre-commit hook: Unit tests only (fast)
- GitHub Actions: All tests (unit + integration)
- Deployment gate: 100% pass rate required

---

**Last Updated**: 2026-01-29 (Story 0.7)
**Next Review**: After Story 0.7 completion (target: 872/872 passing)
