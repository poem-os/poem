---
# Learning Document Metadata
topic: "testing"
issue: "missing-dependency"
created: "2026-01-29"
story_reference: "Story 0.7"
category: "testing"
severity: "Medium"
status: "Resolved"
recurrence_count: 1
last_occurred: "2026-01-29"
---

# Testing - Missing Dependency Learning

> **Issue**: missing-dependency
> **Category**: testing
> **Story**: Story 0.7
> **Severity**: Medium

## Problem Signature

### Symptoms
Infrastructure errors can masquerade as code issues when environment configuration is incomplete.
- Error message: "Flood" of server startup errors making debugging impossible
- Affected component: POEM server startup
- When it occurs: Running `npm run server` from monorepo root

### Error Details
```
(Not captured - described as "a heck of a lot of errors" during server startup)
Server error flood blocks effective debugging - cannot distinguish real errors from noise
```

### Environment
- **Technology Stack**: Node.js 22.x, Astro 5.x
- **Environment**: Development (POEM_DEV=true)
- **Configuration**: Missing PORT environment variable in `.env` file

### Triggering Conditions
What actions or conditions cause this issue?
1. Start POEM server without PORT configured in environment
2. Server attempts to start on undefined port
3. Configuration errors cascade through initialization

## Root Cause

### Technical Analysis
The root cause was NOT code issues but missing environment configuration. The server startup sequence expected `PORT=9500` to be defined in `packages/poem-app/.env`, but this critical configuration was absent from the environment file.

Without PORT configuration:
- Server initialization failed to bind to expected port
- Downstream services expecting port 9500 connectivity failed
- Error cascade created "flood" of error messages

### Contributing Factors
- **Factor 1**: Environment variable not documented as required in setup instructions
- **Factor 2**: .env file not version controlled (gitignored), so PORT setting not preserved
- **Factor 3**: Server error messages did not clearly indicate root cause (missing PORT)

### Why It Wasn't Caught Earlier
- Tests didn't catch this because integration tests spawn their own servers with explicit ports
- Unit tests don't require server startup
- Development workflow assumed PORT would be configured manually

## Solution

### Resolution Steps
1. Identified root cause through systematic investigation
   - Command/code: Analyzed server startup logs
   - Result: Discovered PORT variable undefined
2. Added PORT configuration to `.env` file
   - Command/code: `echo "PORT=9500" >> packages/poem-app/.env`
   - Result: Server started cleanly with 0 errors
3. Verified fix
   - Command/code: `npm run server`
   - Result: Server startup produced **0 errors** (exceeded target of <5)

### Configuration Changes
**packages/poem-app/.env**:
```bash
POEM_DEV=true
PORT=9500  # Added - critical for server startup
```

### Verification
How was the fix verified?
- Start server: `npm run server` → 0 errors ✅
- Health endpoint: `curl http://localhost:9500/api/health` → 200 OK ✅
- Integration tests: All passing ✅

### Time to Resolve
**Total Time**: ~1 hour (from discovery to resolution)
**Breakdown**:
- Investigation: 30 minutes (debugging server logs)
- Implementation: 5 minutes (add PORT to .env)
- Testing: 25 minutes (verify fix, run full test suite)

## Prevention

### How to Prevent This in Future Stories

**For Developers (James)**:
- ✅ Check `.env.example` or setup scripts for required environment variables before implementation
- ✅ Document all required environment variables in README or setup guide
- ✅ Add validation at server startup to check for required env vars (fail fast with clear error)

**For QA (Quinn)**:
- ✅ Review checklist item: "Verify all required environment variables documented"
- ✅ Test scenario: Start server with missing env vars, verify clear error message

**For Story Creation (Bob)**:
- ✅ Story requirement: "Document environment prerequisites in acceptance criteria"
- ✅ Acceptance criteria: "Server startup fails gracefully with clear error if env vars missing"

### Recommended Patterns
This is a first occurrence (recurrence_count: 1). If this issue appears in 2+ more stories, promote to pattern:
- Consider creating: `env-validation-pattern.md` (future pattern for environment variable validation)

### Tests Added
No new test cases created (configuration issue, not code bug).
However, Story 0.7 improved test infrastructure with:
- Test organization (unit vs integration separation)
- Zero-tolerance enforcement (0 skipped tests)

## Related Incidents

### Previous Occurrences
None - this is the first documented occurrence.

### Similar Issues
None identified in current KDD documentation.

### Pattern Promotion Status
- **Status**: Single occurrence, not yet candidate for pattern
- **Threshold**: Promote to pattern if recurs 2+ more times (3 total occurrences)

## Lessons Learned

### Key Takeaways
1. **Infrastructure errors can masquerade as code issues** - Always check configuration before diving into code debugging
2. **Error floods hide signal** - When overwhelmed by errors, step back and look for root cause, not individual symptoms
3. **Environment setup documentation critical** - Missing .env documentation causes preventable issues

### Impact Assessment
- **Time Lost**: ~1 hour (relatively low)
- **Scope**: Local to Story 0.7 (server startup)
- **Preventability**: **Could have been prevented** with better .env documentation and validation

## References

- Story: [Story 0.7](../../stories/0.7.story.md)
- Related patterns: None (first occurrence)
- Commit: Story 0.7 implementation (2026-01-29)

---

**Learning documented by**: Lisa (Librarian)
**Status**: Resolved
