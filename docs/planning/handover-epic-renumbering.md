# Handover: Epic Renumbering Task

**Created**: 2026-02-03
**Task**: Renumber POEM epics to insert new Epic 5 (Workflow Orchestration Agents)
**Estimated Effort**: 1-2 hours
**Priority**: Medium (prerequisite for Epic 5 implementation)

---

## Goal

Insert a new Epic 5 (Workflow Orchestration Agents) into the POEM project roadmap and shift existing Epics 5-9 down by one position to become Epics 6-10.

---

## Why We're Doing This

### Context
During planning for POEM, we identified a critical gap: **No conversational interface exists for creating or executing workflows**. While Epic 4.6 delivered the technical foundation (chain execution engine), users cannot:
1. **Create workflow YAML definitions** through conversation
2. **Execute workflows with human-in-the-loop** checkpoints

### Business Value
Two new agents will unlock workflow capabilities for non-technical users:
- **Alex (Workflow Architect)**: Designs and generates workflow YAML through interviews
- **Oscar (Workflow Orchestrator)**: Executes workflows with checkpoint-based human collaboration

### Why Epic 5 (Not Later)
1. **Foundation Complete**: Epic 4.6 delivered working execution engine
2. **Prerequisite for Epic 4.7-4.9**: Stories 4.7 (Human-in-the-Loop), 4.8 (Constraints), and 4.9 (Multi-Workflow Polish) will benefit from having Alex and Oscar available
3. **Validation Ready**: Prototypes are being tested in SupportSignal system
4. **Logical Sequence**: Build execution infrastructure (Epic 4) → Build agents (Epic 5) → Finish validation (Epic 4.10)

### Why Not Epic 4.5
Using decimal numbering (4.5) is awkward and breaks BMAD conventions. Clean integer epic numbering is better for:
- Documentation clarity
- Story file naming
- Progress tracking
- Team communication

---

## Current Epic Structure

| Epic | Name | Stories | Status |
|------|------|---------|--------|
| 0 | Maintenance & Continuous Improvement | 7 | 🔄 Perpetual |
| 1 | Foundation & Monorepo Setup | 12 | ✅ Complete |
| 2 | Astro Runtime & Handlebars Engine | 6 | ✅ Complete |
| 3 | Prompt Engineer Agent & Core Workflows | 13 | ✅ Complete |
| 4 | YouTube Automation Workflow (System Validation) | 6 | 🟡 In Progress (at 4.6) |
| 5 | System Agent & Helper Generation | 0 | 📋 Not Started |
| 6 | Integration Agent & Provider Pattern | 0 | 📋 Not Started |
| 7 | Mock/Test Data Agent & Level 2 Mock Data | 0 | 📋 Not Started |
| 8 | BMAD Integration - Capability Validation | N/A | 📋 Future (Q2 2026) |
| 9 | Multi-Workflow Support (Advanced Features) | N/A | 📋 Future (Q2-Q3 2026) |

---

## Target Epic Structure

| Epic | Name | Stories | Status | Change |
|------|------|---------|--------|--------|
| 0 | Maintenance & Continuous Improvement | 7 | 🔄 Perpetual | No change |
| 1 | Foundation & Monorepo Setup | 12 | ✅ Complete | No change |
| 2 | Astro Runtime & Handlebars Engine | 6 | ✅ Complete | No change |
| 3 | Prompt Engineer Agent & Core Workflows | 13 | ✅ Complete | No change |
| 4 | YouTube Automation Workflow (System Validation) | 6 | 🟡 In Progress | No change |
| **5** | **Workflow Orchestration Agents** | 0 | 🆕 **NEW** | **Inserted** |
| 6 | System Agent & Helper Generation | 0 | 📋 Not Started | Was Epic 5 |
| 7 | Integration Agent & Provider Pattern | 0 | 📋 Not Started | Was Epic 6 |
| 8 | Mock/Test Data Agent & Level 2 Mock Data | 0 | 📋 Not Started | Was Epic 7 |
| 9 | BMAD Integration - Capability Validation | N/A | 📋 Future | Was Epic 8 |
| 10 | Multi-Workflow Support (Advanced Features) | N/A | 📋 Future | Was Epic 9 |

---

## Files to Update

### 1. PRD Documents

**Primary Files**:
- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/prd/epic-list.md`
  - Renumber Epic 5 → Epic 6 (System Agent)
  - Renumber Epic 6 → Epic 7 (Integration Agent)
  - Renumber Epic 7 → Epic 8 (Mock Data Agent)
  - Renumber Epic 8 → Epic 9 (BMAD Integration)
  - Renumber Epic 9 → Epic 10 (Multi-Workflow Support)
  - Insert new Epic 5 section (copy from planning document)

- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/prd/epic-details.md`
  - Same renumbering as above
  - Add Epic 5 detailed section (copy from planning document)

- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/prd.md` (consolidated PRD)
  - Update epic references throughout
  - Search for "Epic 5", "Epic 6", "Epic 7", "Epic 8", "Epic 9" and renumber

### 2. Architecture Documents

**Files**:
- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/architecture.md`
  - Search for epic references and update as needed

- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/architecture/*.md` (sharded docs)
  - Check all files for epic references

### 3. Planning Documents

**Files**:
- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/*.md`
  - Update epic references in exploration/decision documents
  - Already created: `epic-5-workflow-orchestration-agents.md` (no changes needed)

### 4. Future Enhancements

**File**:
- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/future-enhancements.md`
  - Update epic tracking references

### 5. Story Files

**Current Status**: No story files exist for Epics 5-9 yet
**Action Required**: None (no files to rename)

**Verification**:
```bash
# Confirm no story files exist for epics 5-9
find /Users/davidcruwys/dev/ad/poem-os/poem/docs/stories -name "[5-9].*.story.md"
```

### 6. Index/Navigation Files

**Files**:
- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/index.md`
- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/prd/index.md`
- Any other navigation documents

---

## Search Patterns

Use these patterns to find references that need updating:

```bash
# Search for epic references
grep -r "Epic 5" /Users/davidcruwys/dev/ad/poem-os/poem/docs/
grep -r "Epic 6" /Users/davidcruwys/dev/ad/poem-os/poem/docs/
grep -r "Epic 7" /Users/davidcruwys/dev/ad/poem-os/poem/docs/
grep -r "Epic 8" /Users/davidcruwys/dev/ad/poem-os/poem/docs/
grep -r "Epic 9" /Users/davidcruwys/dev/ad/poem-os/poem/docs/

# Search for story references (e.g., "Story 5.1")
grep -r "Story 5\." /Users/davidcruwys/dev/ad/poem-os/poem/docs/
grep -r "Story 6\." /Users/davidcruwys/dev/ad/poem-os/poem/docs/
grep -r "Story 7\." /Users/davidcruwys/dev/ad/poem-os/poem/docs/
```

---

## Epic 5 Content to Insert

**Source**: `/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/epic-5-workflow-orchestration-agents.md`

**Epic 5 Summary** (for epic-list.md):
```markdown
## Epic 5: Workflow Orchestration Agents

Build conversational AI agents for creating and executing multi-step workflow orchestrations. Alex (Workflow Architect) helps users design workflow YAML definitions through interviews. Oscar (Workflow Orchestrator) executes workflows with human-in-the-loop checkpoint capabilities. Enables non-technical users to leverage POEM's workflow engine through natural conversation.
```

**Epic 5 Details** (for epic-details.md):
See full specification in planning document, sections:
- "Epic 5 Overview"
- "Agent 1: Alex - Workflow Architect"
- "Agent 2: Oscar - Workflow Orchestrator"
- "Dependencies & Prerequisites"

---

## Automation Strategy

### Option 1: Manual Search/Replace (Safest)
1. Open each file in editor
2. Use find/replace: "Epic 9" → "Epic 10", "Epic 8" → "Epic 9", etc.
3. Work backwards (9→10, 8→9, 7→8, 6→7, 5→6) to avoid double-replacement
4. Review changes before committing

### Option 2: Sed Script (Faster)
```bash
cd /Users/davidcruwys/dev/ad/poem-os/poem/docs

# Work backwards to avoid conflicts
sed -i '' 's/Epic 9/Epic 10/g' prd/epic-list.md prd/epic-details.md prd.md
sed -i '' 's/Epic 8/Epic 9/g' prd/epic-list.md prd/epic-details.md prd.md
sed -i '' 's/Epic 7/Epic 8/g' prd/epic-list.md prd/epic-details.md prd.md
sed -i '' 's/Epic 6/Epic 7/g' prd/epic-list.md prd/epic-details.md prd.md
sed -i '' 's/Epic 5/Epic 6/g' prd/epic-list.md prd/epic-details.md prd.md
```

**Caution**: Review all changes before committing. Sed can replace unintended matches.

### Option 3: AI Agent (Recommended)
Use Claude Code to:
1. Read each file
2. Identify epic references
3. Suggest changes
4. Apply updates with human review

---

## Validation Checklist

After renumbering, verify:

- [ ] All epic numbers updated in PRD documents
- [ ] No references to old Epic 5 (System Agent) remain
- [ ] No references to old Epic 6 (Integration Agent) remain
- [ ] No references to old Epic 7 (Mock Data Agent) remain
- [ ] New Epic 5 content inserted in epic-list.md
- [ ] New Epic 5 content inserted in epic-details.md
- [ ] Architecture document epic references updated
- [ ] Planning document epic references updated
- [ ] Internal links still work (no broken cross-references)
- [ ] future-enhancements.md epic tracking updated
- [ ] Git diff reviewed for unintended changes

---

## Success Criteria

Task is complete when:

1. ✅ All PRD documents reflect new epic structure (5-9 → 6-10)
2. ✅ New Epic 5 (Workflow Orchestration Agents) appears in epic-list.md and epic-details.md
3. ✅ Architecture and planning docs updated
4. ✅ No broken references or links
5. ✅ Git commit created with clear message
6. ✅ Ready to draft Story 5.1 using `/BMad/agents/sm`

---

## Git Commit Message

```
docs(epic): renumber epics 5-9 to 6-10, insert Epic 5 (Workflow Orchestration Agents)

- Shift Epic 5 (System Agent) → Epic 6
- Shift Epic 6 (Integration Agent) → Epic 7
- Shift Epic 7 (Mock Data Agent) → Epic 8
- Shift Epic 8 (BMAD Integration) → Epic 9
- Shift Epic 9 (Multi-Workflow Support) → Epic 10
- Insert new Epic 5: Workflow Orchestration Agents (Alex + Oscar)

Rationale: Critical gap identified for workflow creation/execution agents.
Epic 5 provides foundation for Epic 4.7-4.9 (Human-in-the-Loop, Constraints, Multi-Workflow Polish).

See: docs/planning/epic-5-workflow-orchestration-agents.md
```

---

## Reference Documents

**Planning**:
- `/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/epic-5-workflow-orchestration-agents.md`
  Complete specification for new Epic 5

**External Testing** (prototypes in progress):
- `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/.claude/commands/poem/agents/alex.md`
- `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/.claude/commands/poem/agents/oscar.md`

---

## Next Steps After Completion

1. **Verify renumbering** - Review git diff
2. **Commit changes** - Use message above
3. **Update CLAUDE.md** - If epic references exist
4. **Draft Story 5.1** - Use `/BMad/agents/sm`
5. **Begin Epic 5 implementation** - After Epic 4.6 completes

---

**Last Updated**: 2026-02-03
**Status**: Ready for Execution
**Owner**: TBD (handover to next conversation)
