# POEM OS: Action Items from SupportSignal Gap Analysis

**Date**: 2026-01-20
**Source**: Gap Analysis comparing POEM vs SupportSignal BMAD implementations
**Focus**: What POEM should adopt from SupportSignal
**Reference**: `bmad-core-gap-analysis.md`

---

## Executive Summary

SupportSignal demonstrates **enterprise-grade BMAD implementation** with:
- Comprehensive KDD integration (8 devLoadAlwaysFiles)
- Pattern library (backend + testing patterns)
- Testing infrastructure maturity (lessons learned + comprehensive strategy)
- Enterprise quality system (8 checklists vs POEM's 6)

**POEM's Mission**: Knowledge management for prompt engineering (prompts, schemas, mappings, workflows)

**Strategic Fit**: SupportSignal's KDD methodology and pattern-driven approach align perfectly with POEM's knowledge management mission.

---

## High Priority (Epic 5-6)

### 1. 🔥 Adopt KDD Integration

**Priority**: 🔥 High
**Effort**: Medium
**Impact**: ⭐⭐⭐⭐
**Timeline**: Epic 5
**Status**: Not started

#### What

Integrate Knowledge-Driven Development (KDD) methodology into POEM development workflow.

#### Why

- POEM **is a knowledge management system** (prompts, schemas, mappings)
- KDD methodology = systematic knowledge capture during development
- Perfect alignment: POEM teaches knowledge patterns, should practice KDD
- Code + knowledge artifacts as dual outputs

#### Assets to Port from SupportSignal

1. **`docs/methodology/kdd-complete-guide.md`**
   - Complete KDD methodology reference
   - Add to devLoadAlwaysFiles
   - Adapt examples to POEM context (prompt engineering, schema design)

2. **`.bmad-core/checklists/kdd-validation-checklist.md`** (7.1K)
   - Quality gate for knowledge artifacts
   - Ensures patterns are documented during development

3. **`.bmad-core/tasks/capture-kdd-knowledge.md`** (7.4K)
   - Task for systematic knowledge capture
   - Executable workflow for documenting patterns

#### Implementation Steps

1. **Copy KDD guide** from SupportSignal
   ```bash
   cp ~/dev/clients/supportsignal/app.supportsignal.com.au/docs/methodology/kdd-complete-guide.md \
      docs/methodology/kdd-complete-guide.md
   ```

2. **Adapt content** to POEM context
   - Replace SupportSignal examples with POEM examples
   - Add prompt engineering patterns
   - Add schema design patterns
   - Add workflow validation patterns

3. **Update core-config.yaml**
   ```yaml
   devLoadAlwaysFiles:
     - docs/architecture/coding-standards.md
     - docs/architecture/tech-stack.md
     - docs/architecture/source-tree.md
     - docs/methodology/kdd-complete-guide.md  # NEW
   ```

4. **Copy KDD checklist**
   ```bash
   cp ~/dev/clients/supportsignal/app.supportsignal.com.au/.bmad-core/checklists/kdd-validation-checklist.md \
      .bmad-core/checklists/kdd-validation-checklist.md
   ```

5. **Copy capture-kdd-knowledge task**
   ```bash
   cp ~/dev/clients/supportsignal/app.supportsignal.com.au/.bmad-core/tasks/capture-kdd-knowledge.md \
      .bmad-core/tasks/capture-kdd-knowledge.md
   ```

6. **Integrate into story workflow**
   - Add KDD validation to story-dod-checklist.md
   - Dev agent checks for knowledge artifacts before completion
   - QA agent validates KDD compliance

#### Success Criteria

- [ ] KDD guide adapted and added to devLoadAlwaysFiles
- [ ] KDD validation checklist integrated
- [ ] capture-kdd-knowledge task available
- [ ] Story workflow includes KDD validation
- [ ] First story completed with KDD artifacts documented

#### Estimated Effort

- Guide adaptation: 4-6 hours
- Checklist integration: 2 hours
- Task integration: 2 hours
- Workflow updates: 2 hours
- **Total**: ~10-12 hours

---

### 2. 🔥 Create Pattern Library

**Priority**: 🔥 High
**Effort**: Medium
**Impact**: ⭐⭐⭐⭐
**Timeline**: Epic 6
**Status**: Not started

#### What

Document POEM-specific development patterns as permanent reference material.

#### Why

- **Consistency** - Same problems solved same way
- **Velocity** - Don't reinvent, apply proven patterns
- **Quality** - Patterns embody lessons learned
- **Onboarding** - Patterns teach POEM architecture

#### SupportSignal Model

SupportSignal has:
- `docs/patterns/backend-patterns.md` (always loaded)
- `docs/patterns/testing-patterns.md` (always loaded)
- Patterns referenced in stories and by agents

#### POEM-Specific Patterns to Document

**Schema Patterns** (`docs/patterns/schema-patterns.md`):
- JSON Schema generation from examples
- Schema versioning and migration
- Schema validation in workflows
- Schema reuse and composition
- Mock data generation from schemas

**Prompt Engineering Patterns** (`docs/patterns/prompt-patterns.md`):
- Handlebars template structure
- Prompt chaining patterns
- Context variable management
- Prompt testing and validation
- Prompt versioning

**Workflow Patterns** (`docs/patterns/workflow-patterns.md`):
- Multi-step workflow design
- State management across steps
- Error handling and recovery
- Workflow validation patterns
- B72 YouTube workflow as reference

**Testing Patterns** (`docs/patterns/testing-patterns.md`):
- Schema validation testing
- Mock data generation testing
- Workflow end-to-end testing
- CLI testing patterns
- Integration testing for multi-package

**Code Organization Patterns** (`docs/patterns/code-patterns.md`):
- Monorepo package structure
- Service layer patterns
- Path resolution (dev vs prod)
- Config management
- Error handling

#### Implementation Steps

1. **Create patterns directory**
   ```bash
   mkdir -p docs/patterns
   ```

2. **Identify existing patterns** in POEM codebase
   - Review completed stories for recurring solutions
   - Extract patterns from `packages/poem-core/` and `packages/poem-app/`
   - Document decisions from ADRs

3. **Document pattern files** (one at a time)
   - Start with schema-patterns.md (most central to POEM)
   - Use SupportSignal's pattern format as template
   - Include: Problem, Solution, Example, When to Use, Trade-offs

4. **Update core-config.yaml**
   ```yaml
   devLoadAlwaysFiles:
     - docs/architecture/coding-standards.md
     - docs/architecture/tech-stack.md
     - docs/architecture/source-tree.md
     - docs/methodology/kdd-complete-guide.md
     - docs/patterns/schema-patterns.md         # NEW
     - docs/patterns/prompt-patterns.md         # NEW
   ```

5. **Reference patterns in stories**
   - SM references patterns when drafting stories
   - Dev references patterns during implementation
   - QA validates pattern compliance

6. **Evolve patterns** as POEM develops
   - Add new patterns as they emerge
   - Refine existing patterns based on experience
   - Deprecate patterns that don't work

#### Success Criteria

- [ ] 5 pattern files documented (schema, prompt, workflow, testing, code)
- [ ] Pattern files added to devLoadAlwaysFiles
- [ ] Patterns referenced in story templates
- [ ] Dev agent automatically considers patterns
- [ ] Pattern library grows organically during development

#### Estimated Effort

- Pattern identification: 6-8 hours
- Schema patterns: 4 hours
- Prompt patterns: 4 hours
- Workflow patterns: 4 hours
- Testing patterns: 4 hours
- Code patterns: 4 hours
- Integration: 2 hours
- **Total**: ~28-30 hours (spread across Epic 6)

---

## Medium Priority (Epic 7-8)

### 3. 🟡 Port Testing Infrastructure Documentation

**Priority**: 🟡 Medium
**Effort**: Low-Medium
**Impact**: ⭐⭐⭐
**Timeline**: Epic 7
**Status**: Not started

#### What

Document POEM testing infrastructure: lessons learned, strategy, standards.

#### Why

- POEM has complex testing needs (schemas, workflows, CLI, web app, multi-package)
- Learning from failures prevents repeat mistakes
- Test strategy upfront prevents rework
- Comprehensive testing is critical for prompt engineering reliability

#### Assets to Port from SupportSignal

1. **`docs/testing/technical/testing-infrastructure-lessons-learned.md`**
   - Pattern: Document what didn't work and why
   - Captures failures so they're not repeated
   - SupportSignal includes this in devLoadAlwaysFiles

2. **`docs/testing/technical/test-strategy-and-standards.md`**
   - Test design principles
   - Coverage expectations
   - Test pyramid guidance
   - Integration testing strategy

#### Implementation Steps

1. **Create testing directory**
   ```bash
   mkdir -p docs/testing/technical
   ```

2. **Start lessons-learned document**
   - Copy SupportSignal template structure
   - Document POEM testing challenges as they arise
   - Initial content: Epic 1-4 testing issues
   - Evolve organically during development

3. **Create test strategy document**
   - Test levels: unit, integration, e2e
   - Coverage targets by package
   - Testing tools: Vitest, Playwright
   - CI/CD integration
   - Schema validation testing strategy
   - Workflow testing strategy

4. **Optionally add to devLoadAlwaysFiles** (consider in Epic 8)
   ```yaml
   devLoadAlwaysFiles:
     - docs/architecture/coding-standards.md
     - docs/architecture/tech-stack.md
     - docs/architecture/source-tree.md
     - docs/methodology/kdd-complete-guide.md
     - docs/patterns/schema-patterns.md
     - docs/patterns/prompt-patterns.md
     - docs/testing/technical/test-strategy-and-standards.md  # NEW (optional)
   ```

5. **Reference in story workflow**
   - Dev agent considers test strategy during implementation
   - QA agent validates test coverage against strategy

#### Success Criteria

- [ ] Lessons-learned document created and populated
- [ ] Test strategy document created
- [ ] Documents evolve during development
- [ ] Testing failures documented and prevented
- [ ] Test coverage improves systematically

#### Estimated Effort

- Initial lessons-learned: 3 hours
- Test strategy: 4 hours
- Ongoing updates: 1 hour per story
- **Total**: ~7 hours initial + ongoing

---

### 4. 🟡 Conditional Workflow Routing

**Priority**: 🟡 Medium
**Effort**: Low
**Impact**: ⭐⭐
**Timeline**: Epic 8
**Status**: Not started

#### What

Add scope-based routing to brownfield workflows: single story → feature → major enhancement.

#### Why

- Right-sized ceremony: big changes get planning, small changes don't
- Efficiency: no process overhead for trivial fixes
- Risk management: complex work gets architecture validation

#### SupportSignal Model

`brownfield-fullstack.yaml`:
```
Enhancement Type Assessment:
├── Single story fix → Direct to Dev
├── Small feature (2-5 stories) → Create feature epic
└── Major enhancement (6+ stories) → Architecture review + epic planning
```

#### Implementation Steps

1. **Copy SupportSignal workflow**
   ```bash
   cp ~/dev/clients/supportsignal/app.supportsignal.com.au/.bmad-core/workflows/brownfield-fullstack.yaml \
      .bmad-core/workflows/brownfield-fullstack.yaml
   ```

2. **Customize routing thresholds** for POEM
   - Define "single story" vs "feature" vs "major" for POEM context
   - Adjust routing rules based on POEM complexity

3. **Test workflow** with sample enhancement scenarios

#### Success Criteria

- [ ] Brownfield workflow has conditional routing
- [ ] Routing thresholds appropriate for POEM
- [ ] Workflow tested with multiple enhancement types

#### Estimated Effort

- Copy and adapt: 2 hours
- Testing: 1 hour
- **Total**: ~3 hours

---

## Low Priority (Backlog)

### 5. 🟢 Add TestBot Agent

**Priority**: 🟢 Low
**Effort**: Low
**Impact**: ⭐⭐
**Timeline**: Backlog
**Status**: Not started

#### What

Add TestBot (Test-Dev) agent for automated test framework setup and CI/CD config.

#### Why

- POEM has multi-package testing (Vitest, Playwright)
- Systematizes test infrastructure setup
- Reduces manual configuration

#### Implementation Steps

1. Copy agent from SupportSignal
   ```bash
   cp ~/dev/clients/supportsignal/app.supportsignal.com.au/.bmad-core/agents/test-dev.md \
      .bmad-core/agents/test-dev.md
   ```

2. Adapt to POEM testing stack

3. Add to agent teams if needed

#### Estimated Effort

- Copy and adapt: 2 hours

---

### 6. 🟢 Add Worktree Manager Agent

**Priority**: 🟢 Low
**Effort**: Low
**Impact**: ⭐⭐
**Timeline**: Backlog (only if using worktree workflow)
**Status**: Not started

#### What

Add Worktree Manager agent for git worktree and branch management.

#### Why

- Prevents git workflow issues in complex branching
- Only useful if POEM adopts worktree workflow

#### Implementation Steps

1. Copy agent from SupportSignal
   ```bash
   cp ~/dev/clients/supportsignal/app.supportsignal.com.au/.bmad-core/agents/worktree-manager.md \
      .bmad-core/agents/worktree-manager.md
   ```

2. Adapt to POEM branching strategy

#### Estimated Effort

- Copy and adapt: 2 hours

---

### 7. 🟢 Add Estimation Guidelines

**Priority**: 🟢 Low
**Effort**: Very Low
**Impact**: ⭐
**Timeline**: Backlog
**Status**: Not started

#### What

Add story point estimation framework to knowledge base.

#### Why

- POEM backlog planning would benefit from consistent estimates
- Helps with sprint planning and velocity tracking

#### Implementation Steps

1. Copy from SupportSignal
   ```bash
   cp ~/dev/clients/supportsignal/app.supportsignal.com.au/.bmad-core/data/estimation-guidelines.md \
      .bmad-core/data/estimation-guidelines.md
   ```

#### Estimated Effort

- Copy: 15 minutes

---

## Implementation Roadmap

| Epic | Focus | Items | Estimated Effort |
|------|-------|-------|------------------|
| **Epic 5** | KDD Integration | #1 KDD Integration | 10-12 hours |
| **Epic 6** | Pattern Library | #2 Pattern Library | 28-30 hours |
| **Epic 7** | Testing Infrastructure | #3 Testing Docs | 7 hours + ongoing |
| **Epic 8** | Workflow Enhancement | #4 Conditional Routing | 3 hours |
| **Backlog** | Optional Enhancements | #5-7 (TestBot, Worktree, Estimation) | ~5 hours total |

**Total High Priority Effort**: ~38-42 hours (Epic 5-6)
**Total Medium Priority Effort**: ~10 hours (Epic 7-8)
**Total Low Priority Effort**: ~5 hours (Backlog)

---

## Success Metrics

### KDD Integration Success
- Developers reference KDD guide during implementation
- Knowledge artifacts created for each story
- Pattern library grows organically
- POEM documentation improves systematically

### Pattern Library Success
- Developers apply patterns consistently
- Story implementation time decreases (patterns reduce decisions)
- Code quality improves (patterns embody best practices)
- New developers onboard faster (patterns teach architecture)

### Testing Infrastructure Success
- Testing failures documented and not repeated
- Test coverage increases systematically
- Test strategy guides implementation
- Regression issues decrease

---

## Notes

1. **KDD First**: KDD integration (Epic 5) should happen before pattern library (Epic 6) because KDD methodology teaches pattern documentation.

2. **Pattern Evolution**: Pattern library should grow organically. Don't try to document all patterns upfront—add patterns as they emerge during development.

3. **Testing Over Time**: Testing infrastructure docs should evolve during development. Start with initial structure in Epic 7, populate during subsequent stories.

4. **Keep Lean**: POEM's philosophy is minimal customization. Only add what provides clear value. Don't blindly copy everything from SupportSignal.

5. **Preserve Victor**: POEM's Victor agent is unique innovation. KDD and patterns should complement Victor, not replace it.

---

**Document Status**: Ready for review and prioritization
**Next Steps**:
1. Review action items with team
2. Prioritize Epic 5 (KDD) for next development cycle
3. Begin Epic 6 (Patterns) planning
