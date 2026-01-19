# ADR-008: File-Based Workflow Persistence over Database

**Date**: 2026-01-14
**Status**: Accepted
**Source**: Story 4.6 (Run Prompt Chain)

## Context

Multi-step prompt chains need durable state to enable:
- **Pause/Resume**: Stop workflow mid-execution, resume later
- **Crash Recovery**: Preserve progress if server crashes
- **Debugging**: Inspect workflow state at point of failure
- **Audit Trail**: See what ran, when, and what it produced

**Requirement**: Persist workflow-data after each chain step.

**Alternatives evaluated**:
1. **JSON files** (Chosen)
2. **SQLite database**
3. **PostgreSQL/MySQL database**
4. **In-memory with periodic snapshots**
5. **Key-value store (Redis)**

## Decision

Store workflow-data as **pretty-printed JSON files** in `dev-workspace/workflow-data/`.

**Format**: `{workflow-id}.json` where ID is generated via `nanoid()`.

**Persistence strategy**:
- Save after each step (atomic writes: temp file + rename)
- Pretty-print with 2-space indentation (human-readable)
- Include timestamps in ISO 8601 format
- Log execution history (which templates ran, when, what they produced)

## Alternatives Considered

### Option 1: JSON Files (Chosen)

**Pros**:
- No database setup required (zero infrastructure)
- Human-readable (open in editor, inspect workflow state)
- Version control friendly (check in test fixtures)
- Portable (copy file to debug elsewhere)
- Crash recovery built-in (file persisted after each step)
- Atomic writes (temp file + rename prevents corruption)

**Cons**:
- Slower than database for large workflows (file I/O per step)
- No query capability (can't search across workflows)
- File size grows with data accumulation

**Why chosen**: Simplicity + human readability outweigh performance cost for development workflows.

### Option 2: SQLite

**Pros**:
- Fast (better than file I/O for reads/writes)
- ACID transactions (atomic updates)
- Query capability (SQL SELECT across workflows)
- Single-file database (portable like JSON)

**Cons**:
- Requires sqlite3 dependency
- Not human-readable (binary format)
- Schema migrations needed if WorkflowData structure changes
- Debugging requires SQL queries (not "open in VS Code")

**Rejected**: Binary format defeats human-readability requirement.

### Option 3: PostgreSQL/MySQL

**Pros**:
- Enterprise-grade (proven reliability)
- Advanced queries (analytics across workflows)
- Concurrent access (multiple servers writing)

**Cons**:
- **Infrastructure overhead**: Requires database server, connection pooling, migrations
- **Deployment complexity**: Must provision database in all environments
- **Not human-readable**: Binary storage, requires SQL client
- **Overkill**: POEM is development tool, not production service

**Rejected**: Infrastructure overhead not justified for POEM use case.

### Option 4: In-Memory with Periodic Snapshots

**Pros**:
- Fastest (no I/O during execution)
- Simple implementation

**Cons**:
- **Data loss on crash**: Snapshots only every N seconds → lose up to N seconds of work
- **No pause/resume**: In-memory state lost when process exits
- **Debugging harder**: Can't inspect state after crash

**Rejected**: Data loss unacceptable for workflow automation.

### Option 5: Redis (Key-Value Store)

**Pros**:
- Fast (in-memory with persistence)
- Supports JSON (REDIS_JSON module)
- Distributed (multiple servers can access)

**Cons**:
- **Infrastructure dependency**: Requires Redis server
- **Not file-based**: Violates POEM's file-based philosophy
- **Debugging**: Requires Redis CLI (not "cat workflow.json")
- **Overkill**: Don't need distributed access

**Rejected**: Infrastructure dependency not justified.

## Rationale

**Why JSON Files?**

1. **Alignment with POEM Philosophy**: Everything in POEM is file-based (prompts, schemas, config). Workflow-data should be too.
2. **Developer Experience**: Open `abc123xyz.json` in VS Code → see exact workflow state. No SQL required.
3. **Zero Infrastructure**: `npm install` works. No database setup, connection strings, migrations.
4. **Crash Recovery**: File written after each step = never lose progress.
5. **Portability**: Copy file to colleague's machine for debugging.
6. **Version Control**: Check in test workflow-data as fixtures.

**Pretty-Print Decision**:
- `JSON.stringify(data, null, 2)` adds ~15% file size
- But: Readable JSON enables debugging (see field structure at glance)
- Trade-off: Small file size increase for massive debuggability improvement

**Atomic Writes**:
Write to temp file (`abc123xyz.json.tmp`), then rename to final name. If crash during write, temp file is orphaned but original file uncorrupted. Rename is atomic on POSIX systems.

## Consequences

**Positive**:
- ✅ 17/17 WorkflowDataService tests passing
- ✅ 3-step YouTube chain successfully persisted and resumed
- ✅ Human-readable workflow-data (inspectable in editor)
- ✅ Zero infrastructure dependencies
- ✅ Crash recovery validated (kill server mid-step → resume completes)

**Negative**:
- ⚠️ Slower than database (file I/O per step ~10-50ms overhead)
- ⚠️ No query capability (can't "SELECT * FROM workflows WHERE status = 'failed'")
- ⚠️ File size grows (large data accumulates over workflow execution)

**Mitigations**:
- Performance acceptable for POEM use case (development workflows, not production pipelines)
- Query capability not needed (workflows are independent, no cross-workflow analytics required)
- File size growth handled via manual cleanup (delete old workflow-data files)

**Future Considerations**:
- If POEM becomes production service (Story 4.7+): Consider SQLite as upgrade path
- If query capability needed (Epic 5+): Add indexing layer over files (JSON search)
- For now: YAGNI (You Aren't Gonna Need It)

## Gap Analysis Impact ⭐

- **VibeDeck Relevance**: Not yet tested (VibeDeck has single-prompt workflows, no multi-step chains)
- **Real-World Validation**: Pattern validated through 28 unit tests but not production usage
- **Future Implications**: VibeDeck multi-step workflows (e.g., model-research → design-generation → manufacturing-check) will benefit from file-based persistence (debuggable workflow state)

## Evolution from Epic 3 ⭐

- **Related Epic 3 ADR**: ADR-003 (API-First) mentions file-based philosophy but not persistence
- **Pattern Change**: New capability (Epic 3 had no workflow state persistence)
- **Breaking Change**: No

## References

- **Story**: `docs/stories/4.6.story.md` (Run Prompt Chain, AC6)
- **Implementation**: `packages/poem-app/src/services/chain/workflow-data.ts` (WorkflowDataService)
- **Tests**: 17/17 passing (create, load, save, update, ENOENT handling)
- **QA Gate**: Quality Score 100/100
- **Coding Standards**: `docs/architecture/coding-standards.md` (File-Based Everything principle)
- **Pattern**: [WorkflowData File-Based Persistence](../patterns/4-workflowdata-file-persistence.md)

---

**Last Updated**: 2026-01-19
