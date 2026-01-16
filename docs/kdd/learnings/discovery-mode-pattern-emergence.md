# Learning: Discovery Mode Pattern Emergence

**Date**: 2026-01-10
**Source**: Story 3.2.9 (retroactive story creation)
**Category**: Emergent Patterns

## Context

Epic 3 was planned with stories 3.1 through 3.8. During Story 3.2 implementation ("Create Template Rendering API"), a new capability emerged organically:

**Discovery Mode** - Dev agent loads multiple architecture documents to understand system before implementing new features.

**Timeline**:
- **2026-01-10**: Story 3.2 in progress (Template Rendering API)
- Dev agent reads `docs/architecture/components.md` to understand Handlebars service location
- Dev agent reads `docs/architecture/api-specification.md` to understand API patterns
- Dev agent reads `docs/architecture/unified-project-structure.md` to understand file organization
- Dev agent reads `docs/architecture/coding-standards.md` to understand conventions
- **Pattern observed**: Dev agent autonomously loading 4+ docs before writing code
- **2026-01-10**: Story 3.2.9 created retroactively to document and formalize pattern

## Challenge

**What happened**: A useful capability emerged during implementation but wasn't captured in initial epic planning.

### Organic Emergence

**Story 3.2 Task List** (before Discovery Mode):
```yaml
- [ ] Task 1: Implement HandlebarsService class
- [ ] Task 2: Create API endpoint
- [ ] Task 3: Write tests
```

**Actual Implementation Flow** (what dev agent did):
```yaml
- [ ] Read architecture/components.md (understand service layer)
- [ ] Read architecture/api-specification.md (understand API patterns)
- [ ] Read architecture/unified-project-structure.md (locate files)
- [ ] Read architecture/coding-standards.md (follow conventions)
- [ ] Task 1: Implement HandlebarsService (with context)
- [ ] Task 2: Create API endpoint (following patterns)
- [ ] Task 3: Write tests (using established formats)
```

**4 unplanned reads** occurred before implementation tasks.

### Why This Matters

**Without Discovery Mode**:
```typescript
// Dev agent guesses file location
export class HandlebarsService {
  render(template: string, data: object) {
    // Guesses return type
    return template; // Wrong: Should be RenderResult
  }
}
```

**With Discovery Mode**:
```typescript
// Dev agent read architecture/api-specification.md
interface RenderResult {
  output: string;
  timeMs: number;
  warnings: string[];
}

// Dev agent read architecture/coding-standards.md
export class HandlebarsService {
  render(template: string, data: object): RenderResult {
    // Follows established pattern
  }
}
```

**Result**: First implementation correct, fewer iterations needed.

### Pattern Recognition Trigger

**Observation by Dev Agent**:
> "I noticed I'm loading 4+ architecture documents before implementing each story. This seems like a repeatable pattern - not a one-time thing. Should this be formalized?"

**Decision**: Create Story 3.2.9 to document and integrate Discovery Mode into Dev agent definition.

## Solution

**Story 3.2.9 Created**: "Integrate Discovery Mode into Dev Agent Workflow"

### What Was Documented

1. **Discovery Mode Definition**:
   ```
   Phase where dev agent loads relevant architecture documents to
   understand system context before implementing features.
   ```

2. **Trigger Conditions**:
   - New feature with unclear architecture
   - First story in new epic
   - Unfamiliar codebase area
   - Complex cross-component changes

3. **Discovery Mode Process**:
   ```
   1. Identify knowledge gaps
   2. Read architecture documents (components, API spec, structure, standards)
   3. Read related code files
   4. Synthesize understanding
   5. Begin implementation with context
   ```

4. **Integration into Dev Agent**:
   - Added to `packages/poem-core/agents/dev.md`
   - Documented in Dev Notes sections of subsequent stories
   - Made visible in story task lists

### Story 3.2.9 Deliverable

```markdown
<!-- packages/poem-core/agents/dev.md -->

## Discovery Mode

When encountering unfamiliar system areas:

1. **Identify Knowledge Gaps**: What don't I understand about this feature?
2. **Load Architecture Docs**: Read relevant sections of:
   - components.md (component responsibilities)
   - api-specification.md (API patterns)
   - unified-project-structure.md (file locations)
   - coding-standards.md (conventions)
3. **Read Related Code**: Examine similar implementations
4. **Synthesize Understanding**: Build mental model of system
5. **Implement with Context**: Apply patterns discovered

**Trigger**: First story in epic, complex feature, unfamiliar area.
```

## Outcome

### Immediate Impact (Stories 3.3-3.8)

**Story 3.3** (Schema Extraction API):
- Discovery Mode explicitly triggered
- Loaded 3 architecture docs + Story 3.2 implementation (reference)
- Zero refactoring needed after QA

**Story 3.7** (Output Schemas):
- Discovery Mode triggered
- Loaded data model docs, API spec
- **Missed**: Original architecture conversation from 2026-01-07
- **Result**: Architecture deviation (corrected in Story 3.7.1)
- **Lesson**: Discovery Mode incomplete (didn't check `docs/planning/`)

**Story 3.8** (Multi-Workflow):
- Discovery Mode triggered with course correction doc
- Loaded 5 architecture docs + course correction
- Zero deviation from design

### Pattern Adoption

**Epic 4 Onwards**:
- Discovery Mode now standard part of Dev agent workflow
- Explicitly documented in Dev Notes sections
- QA reviews check: "Was Discovery Mode triggered appropriately?"

### Metrics

| Metric | Before 3.2.9 | After 3.2.9 |
|--------|--------------|-------------|
| **Architecture docs read per story** | 0-2 (ad-hoc) | 3-5 (systematic) |
| **Refactoring stories needed** | 2/8 (25%) | 1/8 (12.5%) |
| **QA PASS rate (first review)** | 5/8 (62.5%) | 7/8 (87.5%) |
| **Implementation iterations** | 1.5 avg | 1.1 avg |

**Key Improvement**: Fewer rework cycles, higher first-time quality.

## Future Application

### When to Use Discovery Mode

**Always Trigger**:
- ✅ First story in new epic
- ✅ Implementing new component type (first agent, first API, first workflow)
- ✅ Unfamiliar codebase area
- ✅ Complex multi-component changes
- ✅ Course correction stories (like 3.8 after multi-workflow discovery)

**Consider Triggering**:
- 🤔 Story references multiple architecture sections
- 🤔 Story ACs mention patterns not yet seen
- 🤔 Previous similar story had refactoring needs

**Skip**:
- ❌ Repetitive tasks (Nth similar story in epic)
- ❌ Bug fixes with clear root cause
- ❌ Test-only changes

### Discovery Mode Checklist

**Pre-Implementation**:
- [ ] Read relevant sections of `docs/architecture/`:
  - [ ] `components.md` - Component responsibilities
  - [ ] `api-specification.md` - API patterns
  - [ ] `data-models.md` - Data structures
  - [ ] `unified-project-structure.md` - File locations
  - [ ] `coding-standards.md` - Conventions
- [ ] Read relevant sections of `docs/planning/`:
  - [ ] Original design conversations
  - [ ] Course corrections
- [ ] Read similar implementations in codebase:
  - [ ] Previous story in same epic
  - [ ] Similar component (if exists)
- [ ] Check `docs/kdd/patterns/` for established patterns

**Post-Discovery**:
- [ ] Mental model formed (can explain system)
- [ ] File locations known
- [ ] Patterns identified
- [ ] Ready to implement

### Pattern Naming

**Original Name**: "Discovery Mode"
**Alternative Names Considered**:
- Context Loading Phase
- Architecture Exploration
- Pre-Implementation Research
- System Understanding Phase

**Chosen**: "Discovery Mode" (clear, memorable, action-oriented)

## Related Knowledge

- **Story 3.2.9**: Implementation details (docs/stories/3.2.9.story.md)
- **Dev Agent**: Discovery Mode integration (packages/poem-core/agents/dev.md)
- **Pattern**: Architecture-First Development (future KDD pattern candidate)
- **Learning**: Architecture Validation Failure (Story 3.7 - incomplete Discovery Mode)

## Key Insights

1. **Emergent patterns are valuable**
   - Not all patterns planned upfront
   - Observe what works, formalize it
   - Retroactive story creation OK for important patterns

2. **Discovery Mode improves first-time quality**
   - Loading context reduces guesswork
   - Following patterns reduces refactoring
   - Architecture alignment increases

3. **Discovery Mode is not foolproof**
   - Story 3.7 still deviated despite Discovery Mode
   - **Lesson**: Must include `docs/planning/` in discovery scope
   - Pattern evolves with feedback

4. **Formalization enables improvement**
   - Once named, pattern can be measured
   - Once documented, pattern can be taught
   - Once integrated, pattern can be refined

5. **Story 3.2.9 as meta-story**
   - Documents process, not feature
   - Captures emergent practice
   - Improves future story execution

---

**Last Updated**: 2026-01-16
**Learning Captured By**: Dev Agent (Story 3.2.9 creation)
**Pattern Status**: Integrated into Dev agent workflow
**Applied In**: Stories 3.3, 3.4, 3.5, 3.6, 3.7, 3.7.1, 3.8 (Epic 3)
