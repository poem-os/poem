# Capture KDD Knowledge

## Purpose

Systematically extract and document learnings from story implementation for institutional knowledge building.

**CRITICAL**: This task MUST be executed after every story completion. Target: 95%+ execution rate.

## When to Execute

- **Trigger**: Immediately after story marked "Ready for Review"
- **Before**: QA review (allows QA to validate knowledge capture)
- **Mandatory**: Dev Agent cannot mark story complete without executing this task

## Sequential Steps

### Step 1: Git Analysis (Facts, Not Assumptions)

Analyze actual code changes to understand what was REALLY implemented:

```bash
# Recent commits for this story
git log --oneline -10

# Files that actually changed
git diff HEAD~5..HEAD --name-only

# Scope of changes
git diff HEAD~5..HEAD --stat
```

**Focus**: Identify files that changed during story implementation (not assumptions about what "should" have changed).

---

### Step 2: Pattern Identification

**A. New Patterns Discovered**
- What architectural patterns emerged during implementation?
- What code organization approaches worked well?
- What testing strategies proved effective?
- What integration patterns were established?

**B. Existing Patterns Validated**
- Which established patterns were successfully followed?
- Which patterns from previous stories were reused?
- Did any patterns need adaptation?

**C. Anti-Patterns Avoided**
- What approaches were tried but abandoned?
- What pitfalls were identified and avoided?
- What would you NOT do next time?

---

### Step 3: Write to Knowledge Base (NOT Story Files)

**CRITICAL**: Write to `docs/kdd/` and `docs/examples/`, NOT to story files. Stories are transient; knowledge base is permanent.

**A. Patterns → `docs/kdd/patterns/`**

If new patterns discovered:
- Create `docs/kdd/patterns/[pattern-name].md`
- Include: Context, Implementation, Example, Rationale, Related Patterns
- Example: `config-service-single-source-of-truth.md`

**B. Examples → `docs/examples/[feature]/`**

If working code demonstrates pattern:
- Create subdirectory: `docs/examples/[feature-name]/`
- Include: README.md, key files, setup instructions, dependencies
- Link to related patterns
- Example: `docs/examples/unified-schema-creation/`

**C. Learnings → `docs/kdd/learnings/`**

If unexpected behaviors or insights discovered:
- Create `docs/kdd/learnings/[learning-name].md`
- Include: Context, Challenge, Solution, Outcome, Future Application
- Example: `schema-type-guard-performance.md`

**D. Decisions → `docs/kdd/decisions/`**

If significant technical decision made:
- Create `docs/kdd/decisions/adr-NNN-[decision-name].md`
- Include: Status, Context, Decision, Alternatives, Rationale, Consequences
- Sequential numbering (NNN)
- Example: `adr-001-unified-schema-structure.md`

---

### Step 4: Architecture Documentation Updates

If story changed or extended architecture:

**Update Architecture Docs**:
- `docs/architecture/data-models.md` (if data models changed)
- `docs/architecture/components.md` (if components added/modified)
- `docs/architecture/api-specification.md` (if APIs changed)
- `docs/architecture/workflows.md` (if workflows added)

**Note Changes**:
- Add "Updated" timestamp
- Reference story number
- Link to related patterns/examples

---

### Step 5: TOC Maintenance (CRITICAL)

**Update category-specific TOCs** to ensure discoverability:

**A. Patterns TOC**: `docs/kdd/patterns/index.md`
- Add new pattern entry with brief description
- Organize by epic or feature area
- Include last updated date

**B. Examples TOC**: `docs/examples/index.md`
- Add new example entry with purpose
- Link to related patterns
- Note dependencies

**C. Learnings TOC**: `docs/kdd/learnings/index.md`
- Add new learning entry with context
- Categorize by epic
- Cross-reference related patterns

**D. Decisions TOC**: `docs/kdd/decisions/index.md`
- Add new ADR entry with status
- Maintain sequential numbering
- Link to affected stories

**Validation**:
- Ensure all new knowledge assets are indexed
- Check for broken cross-references
- Verify bidirectional links

---

### Step 6: Story Reference (Minimal)

**In story Dev Agent Record** → Add brief KDD summary:

```markdown
## KDD Knowledge Captured

### Patterns Documented
- [Config Service Single Source of Truth](../../kdd/patterns/config-service-single-source-of-truth.md)
- [Unified Schema Structure](../../kdd/patterns/unified-schema-structure.md)

### Examples Created
- [Multi-Workflow Setup](../../examples/multi-workflow-setup/)

### Learnings Captured
- [Workflow Persistence Edge Cases](../../kdd/learnings/workflow-persistence-edge-cases.md)

### Architecture Updates
- Updated `docs/architecture/data-models.md` (WorkflowConfig interface)
- Updated `docs/architecture/components.md` (Config Service description)
```

**IMPORTANT**: Story contains ONLY file paths to knowledge assets, NOT detailed content. Content lives in knowledge base.

---

### Step 7: Cross-Reference Validation

Ensure knowledge assets are properly linked:

**From Patterns → Examples**:
- Pattern documents link to working examples
- Examples reference patterns they demonstrate

**From Learnings → Patterns**:
- Learnings reference patterns that emerged
- Patterns reference learnings that led to their discovery

**From Architecture Docs → Patterns**:
- Architecture docs link to implementation patterns
- Patterns reference architectural principles

**From Story → Knowledge Base**:
- Story links to captured knowledge
- Knowledge assets reference originating story

---

### Step 8: Quality Check

Before completing task:

- [ ] At least ONE knowledge asset created (pattern, example, learning, or decision)
- [ ] All TOCs updated with new assets
- [ ] Cross-references validated (bidirectional links work)
- [ ] Story Dev Agent Record includes KDD summary section
- [ ] Architecture docs updated if needed
- [ ] No orphaned files (all assets indexed in TOCs)

---

## Success Metrics

**Target Execution Rate**: 95%+ of stories
**Target Knowledge Assets**: 1-3 per story (patterns, examples, learnings)
**Target TOC Health**: 100% (no orphaned files, no broken links)

## Common Anti-Patterns

**❌ DON'T**:
- Write detailed knowledge in story files (stories are transient)
- Skip TOC maintenance (creates orphaned files)
- Document assumptions without git analysis (use facts, not memory)
- Create knowledge assets without cross-references (reduces discoverability)
- Execute KDD task "later" (execute immediately after implementation)

**✅ DO**:
- Start with git analysis (facts first)
- Write to permanent knowledge base
- Update TOCs every time
- Validate cross-references
- Link from story to knowledge base

---

## POEM-Specific Domains

Focus knowledge capture on these areas:

**Schemas**: Input/output validation, type systems, schema extraction
**Workflows**: Orchestration patterns, elicitation strategies, validation flows
**Agents**: Command patterns, skill activation, context awareness
**Skills**: Self-description format, API integration, autonomous behavior
**API Endpoints**: Request/response patterns, error handling, performance
**Config Management**: Path resolution, workspace isolation, environment detection
**Testing**: Unit/integration patterns, SAT structure, manual test protocols

---

**Task Type**: Post-Implementation Knowledge Capture
**Execution Time**: 15-30 minutes
**Mandatory**: Yes (95%+ execution rate target)
**Owner**: Dev Agent (executor), QA Agent (validator)

---

**Created**: 2026-01-16 (adapted from SupportSignal KDD system)
**Based On**: `.bmad-core/tasks/capture-kdd-knowledge.md` (SupportSignal 11-step process)
