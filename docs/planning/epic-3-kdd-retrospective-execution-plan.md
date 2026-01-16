# Epic 3 KDD Retrospective Execution Plan

## Purpose

Execute `capture-kdd-knowledge` task retroactively for Epic 3 stories (3.1-3.8) to extract patterns, learnings, decisions, and examples before starting Epic 4.

**Why**: Epic 3 was completed without KDD system in place. Extracting knowledge now prevents loss of institutional knowledge and enables Epic 4 to reference established patterns.

## Execution Context

**Stories to Process**: 11 completed stories
- 3.1: Prompt Engineer Agent
- 3.1.5: Path Resolution Config
- 3.2: New Prompt Workflow
- 3.2.5: Dev Workspace & Config Source of Truth
- 3.2.9: Workflow Architecture Documentation (retroactive)
- 3.3: Refine Prompt Workflow
- 3.4: Test Prompt Workflow
- 3.5: Validate Prompt Workflow
- 3.6: Core Skills
- 3.7: Output Schemas (superseded by 3.7.1)
- 3.7.1: Unified Schema Refactor
- 3.8: Multi-Workflow Foundation

**Time Estimate**: 3-4 hours total (15-20 min per story)

---

## Pre-Execution Setup

### 1. Verify KDD Infrastructure

```bash
# Check directories exist
ls -la docs/kdd/learnings/
ls -la docs/kdd/patterns/
ls -la docs/kdd/decisions/
ls -la docs/examples/

# Check index files exist
ls -la docs/kdd/learnings/index.md
ls -la docs/kdd/patterns/index.md
ls -la docs/kdd/decisions/index.md
ls -la docs/examples/index.md
```

**Status**: ✅ Complete (created 2026-01-16)

---

### 2. Verify KDD Task Exists

```bash
# Check task file
ls -la .bmad-core/tasks/capture-kdd-knowledge.md
```

**Status**: ✅ Complete (created 2026-01-16)

---

### 3. Verify Dev Agent Updated

```bash
# Check dev agent has KDD task in dependencies
grep -A 5 "dependencies:" .bmad-core/agents/dev.md | grep "capture-kdd-knowledge"

# Check dev agent has Discovery Mode in core_principles
grep "DISCOVERY MODE" .bmad-core/agents/dev.md
```

**Status**: ✅ Complete (updated 2026-01-16)

---

## Execution Approach

### Option A: Sequential Story-by-Story (Thorough)

Execute `capture-kdd-knowledge` for each story in order, creating knowledge assets as you go.

**Pros**: Most thorough, captures story-specific context
**Cons**: Slow (3-4 hours), repetitive

**Steps per story**:
1. Read story file (`docs/stories/N.N.story.md`)
2. Run git analysis for story commits
3. Identify patterns, learnings, decisions
4. Create knowledge assets
5. Update TOCs
6. Add KDD summary to story Dev Agent Record

---

### Option B: Batch Pattern Extraction (Efficient)

Analyze all Epic 3 stories together, extract cross-cutting patterns in batches.

**Pros**: Faster (1.5-2 hours), identifies cross-story patterns
**Cons**: May miss story-specific nuances

**Steps**:
1. **Phase 1: Git Analysis** (15 min)
   - Analyze all Epic 3 commits at once
   - Identify files modified across all stories
   - Group by domain (schemas, workflows, agents, skills, APIs, config)

2. **Phase 2: Pattern Extraction** (30 min)
   - Extract architectural patterns (unified schema, API-first, config single source of truth)
   - Create pattern documents in `docs/kdd/patterns/`
   - Update patterns index

3. **Phase 3: Decision Documentation** (20 min)
   - Document key ADRs (unified schema, multi-workflow, skills as markdown)
   - Create ADR documents in `docs/kdd/decisions/`
   - Update decisions index

4. **Phase 4: Learning Capture** (20 min)
   - Extract unexpected behaviors and insights
   - Document in `docs/kdd/learnings/`
   - Update learnings index

5. **Phase 5: Example Creation** (20 min)
   - Identify reusable examples (unified schema creation, multi-workflow setup)
   - Create example directories with READMEs
   - Update examples index

6. **Phase 6: Story Updates** (20 min)
   - Add KDD summary sections to all 11 story files
   - Link to created knowledge assets
   - Cross-validate references

---

## Recommended Approach: **Option B (Batch Extraction)**

**Rationale**:
- Epic 3 stories are complete and won't change
- Cross-cutting patterns more important than story-specific details
- Time-efficient (can complete before starting Epic 4)
- Easier to identify themes across stories

---

## Expected Knowledge Assets

Based on Epic 3 retrospective analysis:

### Patterns (docs/kdd/patterns/)

1. **config-service-single-source-of-truth.md**
   - Context: All workspace path resolution through config service
   - Stories: 3.2.5, 3.8
   - Example: Multi-workflow path resolution

2. **unified-schema-structure.md**
   - Context: Schemas as function signatures (input → output)
   - Stories: 3.7.1
   - Rationale: Corrects dual-file approach from Story 3.7

3. **skills-self-description-format.md**
   - Context: Skills as markdown with "When to Use" sections
   - Stories: 3.5, 3.6
   - Example: check-my-prompt.md, preview-with-data.md

4. **api-first-heavy-operations.md**
   - Context: Template rendering, schema extraction through APIs
   - Stories: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
   - Rationale: Separation of concerns, testability

5. **workflow-scoped-resource-management.md**
   - Context: Independent workflows with isolated resources
   - Stories: 3.8
   - Example: Multi-workflow setup

---

### Decisions (docs/kdd/decisions/)

1. **adr-001-unified-schema-structure.md**
   - Status: Accepted
   - Context: Story 3.7 implemented dual-file, 3.7.1 corrected to unified
   - Decision: Single file with input/output sections
   - Alternatives: Separate files (rejected)
   - Rationale: Function signature analogy, simpler management
   - Consequences: Refactoring effort, but better long-term

2. **adr-002-multi-workflow-architecture.md**
   - Status: Accepted
   - Context: Flat workspace doesn't support real-world usage
   - Decision: Workflow-scoped directories with shared resources
   - Alternatives: Single flat workspace, project-per-workflow
   - Rationale: Isolation + resource sharing
   - Consequences: Phase 1/Phase 2 implementation pattern

3. **adr-003-api-first-for-heavy-operations.md**
   - Status: Accepted
   - Context: All Epic 3 stories follow API-First pattern
   - Decision: Heavy operations (render, extract, validate) through Astro APIs
   - Alternatives: Direct service calls, agent-embedded logic
   - Rationale: Testability, separation of concerns, reusability
   - Consequences: More boilerplate, but better architecture

4. **adr-004-skills-as-markdown-documentation.md**
   - Status: Accepted
   - Context: Need autonomous agent capabilities
   - Decision: Skills are markdown files with self-description
   - Alternatives: Executable code, API plugins
   - Rationale: Simplicity, discoverability, agent-friendly
   - Consequences: Manual testing required, not type-safe

---

### Learnings (docs/kdd/learnings/)

1. **architecture-validation-failure-story-3-7.md**
   - Context: Story 3.7 deviated from original design (dual-file vs unified)
   - Challenge: Dev agent didn't reference architecture conversations
   - Solution: Story 3.7.1 refactored to correct approach
   - Outcome: Rework story required, lost sprint capacity
   - Future Application: Mandatory architecture validation gate before coding

2. **test-expectation-maintenance.md**
   - Context: Story 3.7 completed with 8 failing workflow tests
   - Challenge: Test expectations out of sync with implementation
   - Solution: Update test expectations to match new workflow structure
   - Outcome: QA gate CONCERNS (80/100), requires fixes
   - Future Application: Update tests inline with implementation changes

3. **discovery-mode-pattern-emergence.md**
   - Context: Story 3.2.9 created retroactively after Stories 3.2-3.5
   - Challenge: Workflow architecture learnings documented too late
   - Solution: Discovery Mode protocol captures insights during implementation
   - Outcome: Pattern recognition delayed, next developer lacked context
   - Future Application: Real-time learning capture during >1hr debugging

4. **workflow-persistence-edge-cases.md**
   - Context: Story 3.8 multi-workflow persistence implementation
   - Challenge: State file corruption, ENOENT errors, parse failures
   - Solution: Graceful error handling with console.warn, return null fallback
   - Outcome: Robust persistence layer with comprehensive error handling
   - Future Application: Always handle state file edge cases (ENOENT, corruption)

---

### Examples (docs/examples/)

1. **unified-schema-creation/**
   - Purpose: Demonstrate unified schema structure
   - Files: Example schema, creation script, validation tests
   - Pattern: unified-schema-structure.md
   - Story: 3.7.1

2. **multi-workflow-setup/**
   - Purpose: Show how to configure workflow-scoped directories
   - Files: Config example, directory structure, Penny activation
   - Pattern: workflow-scoped-resource-management.md
   - Story: 3.8

3. **skill-creation-pattern/**
   - Purpose: Template for creating new skills
   - Files: Skill template, example skills, testing approach
   - Pattern: skills-self-description-format.md
   - Story: 3.6

4. **workflow-validation-end-to-end/**
   - Purpose: Complete workflow execution example
   - Files: Workflow YAML, test data, expected outputs
   - Pattern: api-first-heavy-operations.md
   - Story: 3.5

---

## Execution Timeline

### Day 1: Setup + Pattern Extraction (1.5 hours)
- ✅ Verify KDD infrastructure
- ✅ Verify KDD task exists
- ✅ Verify Dev Agent updated
- Extract 5 patterns from Epic 3 stories
- Create pattern documents
- Update patterns/index.md

### Day 2: Decisions + Learnings (1.5 hours)
- Document 4 ADRs
- Create ADR documents
- Update decisions/index.md
- Extract 4 learnings
- Create learning documents
- Update learnings/index.md

### Day 3: Examples + Story Updates (1 hour)
- Create 4 example directories
- Write READMEs and key files
- Update examples/index.md
- Add KDD summaries to 11 story files
- Validate cross-references

**Total: 4 hours across 3 sessions**

---

## Validation Checklist

Before starting Epic 4:

- [ ] 5 pattern documents created in `docs/kdd/patterns/`
- [ ] 4 ADR documents created in `docs/kdd/decisions/`
- [ ] 4 learning documents created in `docs/kdd/learnings/`
- [ ] 4 example directories created in `docs/examples/`
- [ ] All 4 index.md files updated (patterns, decisions, learnings, examples)
- [ ] All 11 Epic 3 story files have KDD summary sections
- [ ] Cross-references validated (bidirectional links work)
- [ ] Architecture docs updated if needed
- [ ] No orphaned files (all assets indexed)
- [ ] Git commits for all KDD work

---

## Success Criteria

**Quantitative**:
- 13 knowledge assets created (5 patterns + 4 ADRs + 4 learnings)
- 4 examples created
- 11 story files updated
- 4 TOCs updated
- 0 orphaned files

**Qualitative**:
- Epic 4 developers can reference Epic 3 patterns
- Architectural decisions documented with rationale
- Unexpected behaviors captured for future avoidance
- Working examples available for reuse

---

## Post-Execution Actions

After KDD retrospective complete:

1. **Commit KDD work**:
   ```bash
   git add docs/kdd/ docs/examples/ docs/stories/
   git commit -m "chore: Epic 3 KDD retrospective - extract patterns, learnings, examples"
   ```

2. **Announce completion**:
   - Update Epic 3 retrospective document
   - Mark "KDD Retrospective Complete" in Epic 4 readiness checklist

3. **Start Epic 4 with KDD foundation**:
   - Epic 4 stories will execute `capture-kdd-knowledge` inline
   - Reference Epic 3 patterns during Epic 4 implementation
   - Build on established patterns rather than reinventing

---

**Created**: 2026-01-16
**Owner**: Dev Agent (executor), SM Agent (orchestrator)
**Target Completion**: Before Epic 4 start
**Estimated Effort**: 4 hours (batch extraction approach)
