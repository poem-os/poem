# `.ai/` Directory - Usage Policy

> **Purpose**: Ephemeral files for AI agent sessions (Claude Code, other AI tools)
>
> **Status**: Controlled directory with strict usage rules (see ADR-010)

## Acceptable Uses

### ✅ ALLOWED (Ephemeral, Session-Specific)

1. **Debug Logs During Active Development**
   - Temporary debugging output
   - Error traces for troubleshooting
   - **Lifecycle**: Delete after debugging session completes

2. **Scratch Notes**
   - Quick notes for current session
   - Temporary context for AI agents
   - **Lifecycle**: Delete after session or mark with expiration date

3. **Auto-Generated Session Files**
   - AI tool output files (transient)
   - Session context files
   - **Lifecycle**: Auto-delete or manual cleanup

**Key Characteristic**: All allowed files are **temporary** and **session-specific**. Not permanent knowledge.

---

## ❌ PROHIBITED (Permanent Knowledge)

1. **Handover Documents for Story Communication**
   - ❌ Implementation summaries
   - ❌ Bug fix descriptions
   - ❌ Testing instructions
   - ❌ File modification lists
   - **Why Prohibited**: Story files are single source of truth (ADR-010)
   - **Correct Location**: `docs/stories/{number}.story.md`

2. **Implementation Details**
   - ❌ Design decisions
   - ❌ Architecture notes
   - ❌ Code explanations
   - **Why Prohibited**: Belongs in KDD or story files
   - **Correct Location**: `docs/kdd/` or story Dev Agent Record

3. **Reusable Knowledge**
   - ❌ Patterns
   - ❌ Learnings
   - ❌ Best practices
   - **Why Prohibited**: Permanent knowledge belongs in KDD system
   - **Correct Location**: `docs/kdd/learnings/`, `docs/kdd/patterns/`

4. **Testing Artifacts**
   - ❌ Test plans
   - ❌ SAT guides
   - ❌ Test results
   - **Why Prohibited**: Belongs in story files or test directories
   - **Correct Location**: `docs/stories/{number}.story-SAT.md`

---

## Where Documentation Belongs

| Content Type | Correct Location | Example |
|--------------|------------------|---------|
| **Story implementation details** | `docs/stories/{number}.story.md` | Tasks, Dev Agent Record, File List |
| **Testing instructions** | `docs/stories/{number}.story-SAT.md` | Acceptance tests, manual test steps |
| **Reusable patterns** | `docs/kdd/patterns/` | Code patterns, architectural patterns |
| **Incident learnings** | `docs/kdd/learnings/` | Debugging sessions, bugs, incidents |
| **Design decisions** | `docs/kdd/decisions/` | Architecture Decision Records (ADRs) |
| **Code examples** | `docs/examples/` | Working demonstrations |
| **QA results** | Story file QA Results section | Quinn's review, quality gates |
| **Temporary notes** | `.ai/` (ephemeral) | Debug logs, scratch notes |

---

## Cleanup Policy

### When to Delete Files

- **After each session**: Delete debug logs, scratch notes
- **Monthly**: Audit `.ai/` directory, remove stale files
- **Before commits**: Clean up temporary files (don't commit ephemeral content)

### How to Clean

```bash
# List files older than 7 days
find .ai -type f -mtime +7 -ls

# Delete old debug logs
find .ai -name "debug-*.log" -mtime +7 -delete

# Keep only README.md
git clean -Xdf .ai/
```

---

## Rationale

**Why This Policy Exists**: [ADR-010: Story Files as Single Source of Truth](../docs/kdd/decisions/adr-010-handover-documents-vs-story-files.md)

**Problem**: If every story creates handover documents in `.ai/`, we get:
- Documentation fragmentation (scattered across multiple files)
- Duplicate content (same info in story file AND handover doc)
- Source of truth violations (unclear where authoritative information lives)
- "Documentation landfill" (`.ai/` accumulates dead documents)

**Solution**: Story files are comprehensive (Status, AC, Tasks, Dev Agent Record, File List, QA Results, Knowledge Assets). All permanent knowledge goes there or in KDD system.

---

## Examples

### ✅ GOOD: Debug Log (Ephemeral)

**File**: `.ai/debug-install-script-2026-01-30.log`
**Purpose**: Temporary debugging output for installation script issue
**Lifecycle**: Delete after bug fixed
**Content**: Error traces, variable dumps, stack traces

### ❌ BAD: Handover Document (Prohibited)

**File**: `.ai/handover-story-1.12-fixes.md` ← **VIOLATION**
**Problem**: Contains permanent implementation details (bug fixes, testing, file changes)
**Why Bad**: Story 1.12 file already has sections for this (Dev Agent Record, File List)
**Action**: Integrate content into story file, then delete

### ✅ GOOD: Scratch Notes (Ephemeral)

**File**: `.ai/session-notes-2026-01-30.md`
**Purpose**: Quick notes during development session
**Lifecycle**: Delete at end of session or mark with `[DELETE AFTER 2026-02-06]`
**Content**: Ideas, temporary reminders, session context

---

## Questions?

**Q**: Where do I document bug fixes discovered during a story?
**A**: Story file Dev Agent Record section (Completion Notes, Debug Log References)

**Q**: Where do I document testing steps for QA?
**A**: `docs/stories/{number}.story-SAT.md` (SAT guide created by Taylor)

**Q**: Where do I document design decisions made during implementation?
**A**: If story-specific → Dev Agent Record. If reusable → Lisa creates ADR in `docs/kdd/decisions/`

**Q**: Where do I document lessons learned from debugging?
**A**: Pre-Curation Findings section of story file → Lisa extracts to KDD learnings

**Q**: Can I create debug logs in `.ai/` during development?
**A**: Yes! Debug logs are allowed (ephemeral). Just delete them after debugging completes.

---

**Policy Established**: 2026-01-30
**See Also**: [ADR-010: Handover Documents vs Story Files](../docs/kdd/decisions/adr-010-handover-documents-vs-story-files.md)
**Maintained By**: Lisa (Librarian)
