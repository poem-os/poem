# Epic 0: Maintenance & Continuous Improvement

**Epic Goal**: Provide a structured workflow for ongoing maintenance, bug fixes, technical debt, performance optimization, security updates, and developer experience improvements throughout POEM's lifecycle.

**Status**: 🔄 Perpetual (Never Completes)

---

## Business Context

### Why Epic 0 Exists

Software projects generate maintenance work continuously: bugs discovered during feature development, performance bottlenecks identified under load, security vulnerabilities disclosed in dependencies, technical debt from pragmatic shortcuts, and infrastructure needs as the system scales. Feature epics (1-7) focus on delivering new capabilities, but maintenance work is equally critical for product health.

Epic 0 provides a dedicated home for all non-feature work, ensuring maintenance is planned, prioritized, and executed systematically rather than being handled reactively or neglected entirely.

### Key Differences from Feature Epics

| Aspect | Feature Epics (1-7) | Epic 0 |
|--------|---------------------|--------|
| **Completion** | Defined end state | Perpetual (never completes) |
| **Planning Horizon** | Planned upfront | Emerges continuously |
| **Story Ceremony** | Full BMAD workflow | Lighter ceremony |
| **Sprint Allocation** | 80-90% capacity | 10-20% capacity |
| **Priority Basis** | Product roadmap | Impact + urgency |

### When to Use Epic 0

**Use Epic 0 for**:
- Bug fixes (production issues, edge cases, error handling)
- Technical debt (refactoring, code cleanup, architectural improvements)
- Performance optimization (template rendering, server startup, API response times)
- Security patches (dependency updates, vulnerability fixes)
- Developer experience (build tooling, testing infrastructure, local dev workflow)
- Infrastructure (CI/CD improvements, deployment automation, monitoring)
- Documentation (README updates, troubleshooting guides, inline comments)

**Don't use Epic 0 for**:
- New features (use feature epics)
- Major architectural changes (use Architect agent + feature epic)
- Research spikes (use appropriate feature epic or create temporary "Research" epic)

### Quick Fixes vs Epic 0 Stories

**Quick Fixes** (`docs/backlog/quick-fixes.md`):
- **Scope**: <1 hour
- **Ceremony**: None (no story file, no QA gate)
- **Process**: Direct fix and log with commit reference
- **Categories**: infrastructure, tech-debt, documentation, bugs
- **Examples**: Fix typo in docs, add missing .gitignore entry, update README link
- **File Location**: `docs/backlog/quick-fixes.md`
- **Commands**: `*add-fix`, `*list-fixes` (via Bob/Sarah agents)

**Epic 0 Stories**:
- **Scope**: >1 hour
- **Ceremony**: Full BMAD workflow (5-agent AppyDave workflow: Bob → James → Taylor → Quinn)
- **Process**: Story file with acceptance criteria, tasks, QA review, SAT
- **Priority Levels**: P0 (Critical), P1 (High), P2 (Medium)
- **Examples**: Add triage system, refactor schema validation, implement gitleaks pre-commit hook
- **File Location**: `docs/stories/{epic}.{story}.story.md`
- **Commands**: `/appydave-workflow {story}` for full lifecycle

**Promotion Path**:
- If a Quick Fix grows beyond 1 hour during implementation → Promote to Epic 0 story
- Process: Create Epic 0 story via `/BMad/agents/sm` then `*draft` (enter 0 for epic)
- Reference original Quick Fix item in story Background section

**Decision Guidance**:
- Use `/triage` command to automatically route work to Quick Fixes vs Epic 0 Stories based on scope, ceremony, and impact

---

## Story Categories

### 1. Technical Debt

**Definition**: Code, architecture, or design decisions that need refactoring to improve maintainability, reduce complexity, or align with best practices.

**Examples**:
- Refactor Handlebars helper registration to use plugin pattern
- Extract duplicated schema validation logic into shared utility
- Migrate from callback-based async to promises for consistency

**Typical Priority**: P1-P2 (unless debt is blocking new features)

---

### 2. Bug Fix

**Definition**: Defects in existing functionality that cause incorrect behavior, errors, or unexpected outcomes.

**Examples**:
- Fix template rendering failure when schema contains null values
- Resolve NPX installer crash on Windows when path contains spaces
- Correct port conflict detection false positive for localhost vs 127.0.0.1

**Typical Priority**: P0-P2 (based on severity and impact)

**Priority Guidelines**:
- **P0**: Production blockers, data loss, security vulnerabilities
- **P1**: Affects core workflows, impacts multiple users, workaround is difficult
- **P2**: Minor issues, edge cases, workaround is straightforward

---

### 3. Developer Experience

**Definition**: Improvements to development workflow, build tooling, testing infrastructure, or local setup that increase team velocity and reduce friction.

**Examples**:
- Add hot-reload support for Handlebars helpers during development
- Create VS Code snippet library for common POEM patterns
- Improve error messages for schema validation failures

**Typical Priority**: P1-P2 (investment in team productivity)

---

### 4. Performance

**Definition**: Optimizations to reduce latency, improve throughput, or decrease resource consumption for existing functionality.

**Examples**:
- Optimize template rendering for large schemas (>100 fields)
- Reduce Astro server startup time from 3s to <1s
- Cache compiled Handlebars templates to avoid repeated parsing (potential future story)

**Typical Priority**: P1-P2 (unless performance issue blocks adoption)

---

### 5. Security

**Definition**: Patches for security vulnerabilities, dependency updates, security audits, or improvements to authentication/authorization.

**Examples**:
- Update Astro dependency to patch XSS vulnerability (CVE-XXXX-XXXX)
- Add input sanitization for user-provided template content
- Implement rate limiting for provider API endpoints

**Typical Priority**: P0-P1 (security issues often require immediate action)

---

### 6. Infrastructure

**Definition**: CI/CD pipeline improvements, deployment automation, monitoring, logging, or operational tooling.

**Examples**:
- Add GitHub Actions workflow for automated NPM publishing
- Implement health check endpoint for production monitoring
- Create Docker image for POEM server deployment

**Typical Priority**: P1-P2 (enables operational excellence)

---

### 7. Documentation

**Definition**: Updates to README files, inline code comments, troubleshooting guides, or API documentation that improve clarity and onboarding.

**Examples**:
- Add troubleshooting section for common NPX installer errors
- Document Handlebars helper API with examples
- Create quickstart guide for first-time POEM users

**Typical Priority**: P1-P2 (critical for adoption and community growth)

---

## Sprint Planning Approach

### Capacity Allocation

Reserve **10-20% of sprint capacity** for Epic 0 work:

**Example Sprint (2 weeks, 10 story points capacity)**:
- Feature stories (Epic 1-7): 8-9 points (80-90%)
- Epic 0 stories: 1-2 points (10-20%)

This ensures maintenance work is planned proactively, not squeezed in reactively.

### Story Selection Process

**Weekly Epic 0 Review** (15-30 minutes):
1. Review Epic 0 backlog (all open P0/P1/P2 stories)
2. Assess new issues discovered during previous sprint
3. Prioritize based on:
   - **Impact**: How many users affected? How severe?
   - **Urgency**: Does this block feature work? Is there a deadline?
   - **Effort**: Can this be completed within sprint capacity?
4. Pull 1-2 Epic 0 stories into sprint backlog alongside feature stories

### Priority Triage

**P0 (Critical)**: Address immediately, potentially pausing feature work
- Production blockers (e.g., server crash on startup)
- Security vulnerabilities (e.g., disclosed CVE in dependency)
- Data loss risks (e.g., installer overwrites user files without warning)

**P1 (High)**: Schedule within 1-2 sprints
- Significant bugs affecting core workflows (e.g., template rendering fails for arrays)
- Major performance issues (e.g., 10s API response time)
- Critical technical debt blocking new features (e.g., refactor required before Epic 4)

**P2 (Medium)**: Schedule opportunistically based on capacity
- Minor bugs with workarounds (e.g., error message unclear)
- Small optimizations (e.g., reduce server startup by 0.5s)
- Low-impact technical debt (e.g., rename variable for clarity)

---

## Story Template (Lightweight)

Epic 0 stories use **lighter ceremony** than feature stories:

```markdown
### Story 0.X: [Category]: [Brief Description]

**Priority**: P0 / P1 / P2

**Context**: [1-2 sentences: Why does this matter? What's the impact?]

**Current Behavior**: [What happens now?]

**Expected Behavior**: [What should happen?]

**Acceptance Criteria**:
1. [Specific, testable criterion]
2. [Specific, testable criterion]
3. [Specific, testable criterion]

**Notes**: [Optional: Relevant context, related issues, technical details]
```

**Key Differences from Feature Stories**:
- No "As a [user], I want [capability], so that [value]" format (too verbose for bugs/fixes)
- Shorter descriptions (focus on problem + solution, not extensive context)
- Fewer acceptance criteria (3-5 vs 7-10 for feature stories)
- Priority explicitly stated (P0/P1/P2)
- Category identified in title (e.g., "Bug Fix:", "Performance:")

---

## Stories

### Story 0.1: Work Intake Triage System

**As a** POEM developer,
**I want** a unified work intake triage system,
**so that** I can quickly route development work to the appropriate workflow without decision paralysis or confusion.

**Acceptance Criteria**:

1. Rename "Maintenance Backlog" to "Quick Fixes" system (`*add-fix`, `*list-fixes` commands)
2. Create `.bmad-core/tasks/triage-work.md` with decision criteria and routing logic for 5 paths
3. Create `.claude/commands/triage.md` skill wrapper (top-level, NOT in `/poem/`)
4. Add `*triage` command to Bob (SM) and Sarah (PO) agents
5. Create `docs/workflows/triage-guide.md` user documentation with examples
6. Support `/triage issue-{N}` format for usage issue conversion
7. Update Epic 0 PRD to clarify boundary between Quick Fixes (<1hr) and Epic 0 Stories (>1hr)

---

### Story 0.2: Triage and Issue Logger Normalization

**As a** POEM developer,
**I want** the Triage and Issue Logger systems normalized with unified vocabulary and schema alignment,
**so that** I can eliminate dual data entry, improve triage accuracy, and maintain system architectural separation while enabling seamless data reuse.

**Acceptance Criteria**:

1. Create `.bmad-core/vocabularies/work-item-taxonomy.yaml` with unified severity/impact scale, work type classification, epic thematic areas, and time estimate categories
2. Create `.bmad-core/utils/triage-logic.md` with 4 sequential decision criteria, epic theme matching rules, estimate/impact inference heuristics, and type classification rules
3. No breaking changes to existing workflows (Layer 1 validation)
4. Update Issue Logger JSONL schema to v2.0 with `schemaVersion`, `estimatedTime`, `thematicArea`, `type`, `suggestedPath`, and `suggestedPathRationale` fields
5. Update `docs/planning/gap-analysis/observation-collector.md` to prompt for estimate/area with smart defaults and generate v2.0 JSONL records
6. Update `.bmad-core/tasks/triage-work.md` to read v2.0 fields directly with v1.0 fallback and use pre-computed `suggestedPath`
7. Update `docs/planning/gap-analysis/README.md` with v2.0 schema documentation
8. Issue Logger computes `suggestedPath` automatically by loading triage logic and applying 4 sequential checks
9. Triage uses pre-computed suggestions with staleness detection (>30 days, completed epic)
10. Update `docs/workflows/triage-guide.md` with Layer 3 integration details
11. 5 integration tests pass (auto-inference, user override, v1.0 compatibility, staleness detection, migration)

---

### Story 0.3: Create Lisa (Librarian) Agent for KDD Documentation Curation

**As a** BMAD developer,
**I want** a Librarian agent (Lisa) that curates Knowledge-Driven Development (KDD) documentation after QA passes,
**so that** I can systematically extract and maintain architectural patterns, learnings, and decisions from completed stories to prevent knowledge decay and documentation rot.

**Acceptance Criteria**:

1. Create Lisa (Librarian) agent at `.bmad-core/agents/librarian.md` with persona, commands, and dependencies
2. Create CLI wrapper at `.claude/commands/BMad/agents/librarian.md` for `/BMad/agents/librarian` command
3. Implement 8-step knowledge extraction workflow task (`.bmad-core/tasks/extract-knowledge-from-story.md`) as Lisa's `*curate` command
4. Create 4 KDD document templates: Pattern (`pattern-tmpl.md`), Learning (`learning-tmpl.md`), Decision/ADR (`decision-adr-tmpl.md`), Example (`example-tmpl.md`)
5. Implement topology validation task (`.bmad-core/tasks/validate-kdd-topology.md`) as Lisa's `*validate-topology` command with 3 checks: link health, directory limits, index completeness
6. Implement semantic duplicate detection task (`.bmad-core/tasks/detect-semantic-duplicates.md`) as Lisa's `*search-similar` command using keyword-based similarity (70% threshold)
7. Implement auto-index generation task (`.bmad-core/tasks/generate-indexes.md`) as Lisa's `*regenerate-indexes` command using frontmatter metadata
8. Implement recurrence detection task (`.bmad-core/tasks/detect-recurring-issues.md`) as Lisa's `*detect-recurrence` command for pattern promotion
9. Create KDD taxonomy data file (`.bmad-core/data/kdd-taxonomy.yaml`) defining document types, required sections, filename formats, promotion criteria
10. Create validation rules data file (`.bmad-core/data/validation-rules.yaml`) defining VAL-001 through VAL-006 with thresholds and remediation
11. Create knowledge curation checklist (`.bmad-core/checklists/knowledge-curation-checklist.md`) with 8 validation sections
12. Create comprehensive KDD workflow guide (`docs/guides/kdd-workflow-guide.md`) with 10 sections including examples and agent integration
13. Integrate Lisa as Step 7 in AppyDave workflow (`.bmad-core/tasks/execute-appydave-workflow.md`) after Quinn's QA review passes
14. Update CLAUDE.md with Lisa documentation, commands reference, workflow integration, validation rules, and success metrics
15. Lisa updates "Knowledge Assets" section in story files with links to created KDD documents (4 categories: Patterns, Learnings, Decisions, Examples)
16. Quinn (QA) validates code against Lisa's documented patterns and flags pattern violations during review
17. Knowledge extraction status tracked in story files: "Not yet curated" → "Curated ({date})"
18. All tasks use imperative/infinitive form following BMAD command conventions

---

### Story 0.4: Field Testing System with External POEM Project Integration

**As a** POEM developer using POEM in external projects (v-voz, prompt-supportsignal, v-appydave),
**I want** a field testing system that allows me to log blockers and observations from external projects and submit them to central POEM for processing,
**so that** I can track usage issues across multiple projects, link related problems, and enhance POEM's central issue tracker with multi-project context without tight coupling.

**Acceptance Criteria**:

1. Create Field Testing Agent at `packages/poem-core/agents/field-tester.md` with persona "Field Testing Observer" and commands: `*log-blocker`, `*log-session`, `*log-status`
2. Create CLI wrapper at `.claude/commands/poem/agents/field-tester.md` for `/poem/agents/field-tester` command
3. Create directory structure for external projects: `docs/field-testing/blockers/` (JSONL logs), `docs/field-testing/sessions/` (markdown notes)
4. Define client blocker schema (v1.0): `submissionId` ({project}-{sequence}), `timestamp`, `project` object, `blocker` object, `status` (pending/submitted/linked/resolved), `poemIssueRef`, `submittedTo` path
5. Create Inbox Bridge Skill at `packages/poem-core/skills/poem-inbox-bridge/` following Anthropic skill-creator patterns: YAML frontmatter (`name`, comprehensive `description`), concise body (<500 lines), progressive disclosure
6. Inbox Bridge Skill writes submissions to `/Users/davidcruwys/dev/ad/poem-os/poem/docs/planning/gap-analysis/inbox/{submissionId}.json` (direct file write, no sync command)
7. Extend Triage task at `.bmad-core/tasks/triage-work.md` with Mode E: Inbox Processing triggered by `/triage inbox`
8. Triage Mode E: Scan `docs/planning/gap-analysis/inbox/*.json` for `status: "pending"`, list submissions, prompt user to select, search existing POEM issues for similarity (>80%)
9. If match found: Link submission to existing issue, enhance issue with new project perspective; If no match: Prompt to create new POEM issue
10. Update POEM issue schema to v2.1 with optional `reportedBy` array field (backward compatible): `{submissionId, project, timestamp, projectSpecificDetails}`
11. Update submission status after processing: `"pending"` → `"linked"`, add `poemIssueRef: "issue-{N}"`
12. Create inbox directory `docs/planning/gap-analysis/inbox/` with `.gitignore` pattern for `inbox/*.json` (transient submissions)
13. Create Field Testing Guide at `docs/planning/gap-analysis/field-testing-guide.md` with architecture overview, usage instructions, workflow examples, schema documentation, troubleshooting
14. Update Triage Guide at `docs/workflows/triage-guide.md` with Mode E section: `/triage inbox` usage, examples of linking/creating issues

---

### Story 0.5: Rename POEM Core Workflows Directory to Tasks for BMAD Alignment

**As a** POEM developer and user,
**I want** the POEM core agent procedure directory renamed from `workflows/` to `tasks/` to match BMAD terminology,
**so that** the codebase uses consistent terminology (agents execute "tasks", not "workflows") and eliminates confusion between agent procedures and user workspace projects.

**Acceptance Criteria**:

1. Directory renamed: `packages/poem-core/tasks/` → `packages/poem-core/tasks/`
2. All YAML files moved to new location (new-prompt.yaml, refine-prompt.yaml, test-prompt.yaml, validate-prompt.yaml)
3. README.md in tasks/ updated to reflect "tasks" terminology
4. CLAUDE.md updated with correct paths and terminology
5. README.md (project root) updated with correct paths
6. Architecture docs updated (unified-project-structure.md, index.md, high-level-architecture.md)
7. Agent definitions updated (prompt-engineer.md - lines referencing workflows/)
8. Test files updated to reference tasks/ instead of workflows/
9. Installation scripts updated (bin/preservation.js if applicable)
10. Installed structure documented correctly (.poem-core/tasks/ after install)
11. No references to packages/poem-core/tasks/ remain in active documentation
12. Planning/exploration docs updated or marked as historical (low priority)
13. All tests pass after rename
14. Git history preserved (use `git mv` for directory rename)
15. No broken links or references in documentation

---

## Example Stories

These are hypothetical examples showing the Epic 0 story format. See the **Stories** section above for actual completed/in-progress stories.

### Example 1: Bug Fix (P0)

```markdown
### Story 0.X: Bug Fix: NPX Installer Crashes on Windows with Spaces in Path

**Priority**: P0

**Context**: Users on Windows with spaces in their project path (e.g., `C:\Users\John Doe\Projects\my-app`) cannot install POEM—the installer crashes with "ENOENT" error. This blocks adoption on Windows entirely.

**Current Behavior**: Installer crashes with cryptic Node.js error when path contains spaces.

**Expected Behavior**: Installer correctly handles paths with spaces, providing clear error if path is invalid.

**Acceptance Criteria**:
1. Installer wraps all file path operations in quotes to handle spaces
2. Test on Windows with path `C:\Users\Test User\poem-test` succeeds
3. If path is invalid for other reasons, installer displays helpful error message
4. Regression test added for space-in-path scenario

**Notes**: Affects ~40% of Windows users (based on telemetry from other tools).
```

---

### Example 2: Technical Debt (P1)

```markdown
### Story 0.X: Technical Debt: Extract Schema Validation into Shared Utility

**Priority**: P1

**Context**: Schema validation logic is duplicated across Prompt Engineer agent (workflow validation), Integration Agent (provider schema checking), and API endpoints (runtime validation). This violates DRY principle and makes bug fixes require changes in 3 places.

**Current Behavior**: Schema validation duplicated in 3 locations (~150 lines total).

**Expected Behavior**: Single `validateSchema()` utility function used by all components.

**Acceptance Criteria**:
1. Create `packages/poem-app/src/utils/schema-validator.ts` with `validateSchema()` function
2. Refactor Prompt Engineer agent to use shared validator
3. Refactor Integration Agent to use shared validator
4. Refactor API endpoints to use shared validator
5. All existing tests pass without modification
6. Add unit tests for `validateSchema()` utility

**Notes**: Estimated 2-3 hours. Low risk, high maintainability benefit.
```

---

### Example 3: Performance (P2)

```markdown
### Story 0.X: Performance: Cache Compiled Handlebars Templates

**Priority**: P2

**Context**: Template rendering API (`/api/render`) recompiles Handlebars templates on every request, even for unchanged templates. This adds ~50-100ms latency per request, which is noticeable when testing prompts iteratively.

**Current Behavior**: Template compiled on every render (3-5 renders per prompt during testing = 150-500ms overhead).

**Expected Behavior**: Templates cached after first compile, invalidated only when file changes.

**Acceptance Criteria**:
1. Implement in-memory cache for compiled Handlebars templates (keyed by file path + mtime)
2. Cache invalidates automatically when template file modified (watch file mtime)
3. Template rendering latency reduces from ~100ms to <10ms for cached templates
4. Cache size limited to prevent memory issues (e.g., max 100 templates, LRU eviction)
5. Performance test confirms 10x speedup for cached templates

**Notes**: Medium effort (~4 hours), high impact for developer experience during iterative testing. This is a potential future Epic 0 story that has not yet been implemented.
```

---

### Example 4: Documentation (P2)

```markdown
### Story 0.X: Documentation: Add Troubleshooting Section to README

**Priority**: P2

**Context**: Users encounter 3 common issues during installation (port conflicts, missing Node.js, npm permissions) but README doesn't provide troubleshooting guidance. This generates support requests and slows onboarding.

**Current Behavior**: README has installation instructions but no troubleshooting section.

**Expected Behavior**: README includes troubleshooting section with solutions for common issues.

**Acceptance Criteria**:
1. Add "Troubleshooting" section to README.md after "Installation"
2. Document solution for port conflict errors (e.g., "Port 9500 already in use")
3. Document solution for Node.js version issues (e.g., "Node.js 18+ required")
4. Document solution for npm permission errors (e.g., "EACCES" on macOS)
5. Each solution includes: symptom, cause, fix, and verification step
6. Troubleshooting section linked from installation section

**Notes**: Low effort (~1 hour), reduces support burden and improves first-time user experience.
```

---

## Success Metrics

### Sprint Health Indicators

**Healthy Epic 0 Management**:
- 10-20% sprint capacity allocated to Epic 0
- P0 issues resolved within 1 sprint
- P1 issues resolved within 2 sprints
- Epic 0 backlog reviewed weekly
- No Epic 0 story blocked for >1 month due to deprioritization

**Warning Signs**:
- Epic 0 allocation drops below 10% for multiple sprints (technical debt accumulating)
- P0/P1 issues remain unaddressed for >2 sprints (maintenance neglected)
- Epic 0 backlog grows faster than resolution rate (unsustainable pace)

### Long-Term Health

**Success Indicators** (measured quarterly):
- Bug fix cycle time: P0 <1 week, P1 <2 weeks, P2 <1 month
- Technical debt ratio: <15% of codebase flagged for refactoring
- Developer velocity: Epic 0 work does not reduce feature delivery capacity over time
- Community health: Issue response time <24 hours, PRs reviewed within 48 hours

---

## BMAD Integration Notes

### Story Creation

Epic 0 stories are created via **SM (Scrum Master) agent** like feature stories, but use the lightweight template above instead of full BMAD story format.

**Workflow**:
1. Discover maintenance need (bug report, tech debt, performance issue)
2. Create Epic 0 story using lightweight template
3. Assign priority (P0/P1/P2) and category (Bug Fix, Technical Debt, etc.)
4. Add to Epic 0 backlog
5. During sprint planning, pull into sprint backlog based on priority and capacity

### Quality Review

Epic 0 stories still go through **QA (Quinn) agent** review, but with adjusted focus:

**For Bug Fixes**: QA validates fix resolves issue without introducing regressions
**For Technical Debt**: QA validates refactoring improves code quality metrics
**For Performance**: QA validates optimization achieves target improvement
**For Documentation**: QA validates clarity, accuracy, and completeness

### Tracking

Epic 0 stories tracked in `docs/stories/` directory with `0.X` prefix:
```
docs/stories/
├── 0.1.story.md                # Work Intake Triage System (Done)
├── 0.1.story-SAT.md            # SAT guide for Story 0.1
├── 0.2.story.md                # Triage and Issue Logger Normalization (Done)
├── 0.2.story-SAT.md            # SAT guide for Story 0.2
├── 0.3.story.md                # Create Lisa (Librarian) Agent for KDD (Done)
├── 0.3.story-SAT.md            # SAT guide for Story 0.3
└── 0.4.story.md                # Field Testing System (Draft)
```

**Note**: Epic 0 stories are co-located with feature epic stories (1.X, 2.X, etc.) in `docs/stories/` rather than a separate subdirectory. The `0.X` numbering scheme clearly identifies them as Epic 0 (maintenance/process) stories.

---

## Next Steps

1. Create `docs/stories/epic-0/` directory for Epic 0 stories
2. Add Epic 0 to project backlog tracking (e.g., GitHub Projects, linear board)
3. Schedule first Epic 0 review session with team (weekly recurring)
4. Identify initial Epic 0 candidates from current known issues
5. Reserve 10-20% sprint capacity for Epic 0 starting in next sprint

---

**Last Updated**: 2026-01-22
