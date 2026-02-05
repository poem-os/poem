# ADR-012: Co-Location Pattern for Prompts and Schemas

**Status**: Accepted
**Date**: 2026-02-05
**Extends**: ADR-001 (Unified Schema Structure)
**Context**: YouTube Launch Optimizer implementation, POEM standard

---

## Decision

POEM adopts **co-location** of prompt templates, schemas, and analysis files in a unified folder structure.

### Structure

```
prompts/
├── {section}/
│   ├── {prompt-name}.hbs        ← Prompt template (implementation)
│   ├── {prompt-name}.json       ← Unified schema (type signature)
│   └── {prompt-name}.penny.md   ← Analysis/documentation
```

### Example

```
prompts/
├── video-preparation/
│   ├── configure.hbs
│   ├── configure.json           ← Co-located schema
│   └── configure.penny.md       ← Co-located analysis
├── content-analysis/
│   ├── analyze-content-essence.hbs
│   ├── analyze-content-essence.json
│   └── analyze-content-essence.penny.md
```

---

## Context

### The Problem

Prior pattern used **separate folders** for prompts and schemas:

```
prompts/
├── section-1/
│   └── configure.hbs
schemas/
├── section-1/
│   └── configure.json
```

**Issues**:
- High cognitive load (jump between folders)
- Unclear relationship (schema separated from prompt)
- Harder maintenance (update in two places)
- Poor git diffs (changes in different folders)

### Philosophical Foundation

From **ADR-001** (Story 3.7.1):
> "Prompts ARE functions. They accept typed inputs and return typed outputs. The schema is the function signature."

**Logical extension**:
- If schema = function signature
- And prompt = function implementation
- Then they should **live together** (like TypeScript)

---

## Rationale

### 1. Schema IS the Type Signature

Just as TypeScript co-locates types with implementation:

```typescript
// Function + signature together
function configure(inputs: {
  projectFolder: string,
  transcript: string
}): {
  projectCode: string,
  shortTitle: string
} {
  // implementation
}
```

POEM co-locates prompt + schema:

```
configure.hbs   ← Implementation
configure.json  ← Type signature
```

### 2. Industry Best Practices

**React Components** (proven pattern):
```
Button/
├── Button.tsx          ← Component logic
├── Button.css          ← Styling
├── Button.test.tsx     ← Tests
└── Button.stories.tsx  ← Docs
```

**Principle**: "Things that change together should live together"

### 3. Practical Benefits

✅ **Lower cognitive load** - All related files in one place
✅ **Clearer intent** - Schema presence signals "typed prompt"
✅ **Easier maintenance** - Update prompt + schema together
✅ **Better git diffs** - See changes as cohesive unit
✅ **Simpler tooling** - Extract schemas to same folder

### 4. Extends ADR-001

ADR-001 established unified schema files (input + output in one file).
ADR-012 extends this: unified schema co-located with prompt.

**Progression**:
1. ❌ **Before ADR-001**: Separate input.json + output.json
2. ✅ **ADR-001**: Unified schema (single file)
3. ✅ **ADR-012**: Co-located with prompt (same folder)

---

## Implementation

### YAML Declaration

Each step declares prompt and schema paths:

```yaml
steps:
  - id: configure
    prompt: prompts/video-preparation/configure.hbs
    schema: prompts/video-preparation/configure.json  ← Same folder!
    inputs: [projectFolder, transcript]
    outputs: [projectCode, shortTitle]
```

### Folder Organization

**Section-based grouping**:
- `video-preparation/` (7 prompts)
- `build-chapters/` (3 prompts)
- `content-analysis/` (3 prompts)
- etc.

**Pattern**: `prompts/{section}/{prompt-name}.{ext}`

### File Naming

- Prompt: `{name}.hbs`
- Schema: `{name}.json`
- Analysis: `{name}.penny.md`

**All use same base name** (no prefixes, no versions)

---

## Consequences

### Positive

✅ **Developer experience** - Lower cognitive load, easier navigation
✅ **Maintainability** - Related files change together
✅ **Git workflow** - Cohesive commits, clearer diffs
✅ **Tool simplicity** - Schema extraction writes to same folder
✅ **Scalability** - Works for 100+ prompts with section grouping

### Negative

⚠️ **Breaking change** - Existing projects need migration
⚠️ **SupportSignal misalignment** - They use separate folders (brownfield)
⚠️ **Learning curve** - Teams need to understand new pattern

### Mitigation

- **YouTube Launch Optimizer**: Adopted (greenfield, no migration cost)
- **SupportSignal**: Optional upgrade (brownfield, keep working pattern)
- **Future projects**: Use ADR-012 from start
- **Migration script**: Provided for projects wanting to adopt

---

## Alternatives Considered

### Alternative 1: Keep Separate Folders (Status Quo)

```
prompts/section-1/configure.hbs
schemas/section-1/configure.json
```

**Rejected**: Doesn't address cognitive load or maintenance issues

### Alternative 2: Flat Structure (No Subfolders)

```
prompts/
├── configure.hbs
├── configure.json
```

**Rejected**: Doesn't scale (43+ prompts become unwieldy)

### Alternative 3: Per-Prompt Subfolders

```
prompts/
├── configure/
│   ├── configure.hbs
│   ├── configure.json
│   └── configure.penny.md
```

**Rejected**: Too granular (11 folders → 43 folders), harder navigation

**Chosen**: Section-based grouping with co-located files (best balance)

---

## Evidence

### Production Validation

**YouTube Launch Optimizer**:
- ✅ 35 prompts migrated to co-location
- ✅ 10 schemas co-located
- ✅ ~35 penny files co-located
- ✅ YAML updated with explicit schema references
- ✅ Zero issues, improved developer experience

### Industry Precedents

- **React**: Component co-location (standard practice)
- **TypeScript**: Types with implementation (same file)
- **GraphQL**: Schema + resolvers (often co-located)

---

## Migration Guide

### For New Projects

Use co-location from start:

```bash
mkdir -p prompts/section-name
# Create prompt + schema + analysis together
```

### For Existing Projects

**Option A** (Recommended): Adopt co-location
1. Create section folders
2. Move prompts + schemas together
3. Update YAML references
4. Test end-to-end

**Option B**: Keep existing structure
- Valid for brownfield projects (SupportSignal)
- Can adopt co-location for new prompts only

---

## Related Decisions

- **ADR-001**: Unified Schema Structure (input + output in one file)
- **ADR-012**: Co-Location Pattern (this document)

**Future**:
- ADR-013: Schema Auto-Derivation (Epic 4.2)
- ADR-014: Workflow Execution Model (Epic 5)

---

## References

- **Implementation**: `data/youtube-launch-optimizer/` (reference implementation)
- **Analysis**: `data/youtube-launch-optimizer/docs/discovery/option-c-co-location-analysis.md`
- **Comparison**: `data/youtube-launch-optimizer/docs/discovery/structure-options-comparison.md`
- **Completion**: `data/youtube-launch-optimizer/docs/discovery/option-c-implementation-complete.md`

---

**Status**: ✅ Accepted and implemented
**Adopted by**: YouTube Launch Optimizer (2026-02-05)
**POEM Standard**: Yes (recommended for all new projects)
