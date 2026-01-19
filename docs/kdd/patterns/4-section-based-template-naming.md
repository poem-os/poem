# Section-Based Template Naming Convention

**Pattern**: Organize templates with section-sequence-description naming (`1-1-configure.hbs`, `5-1-generate-title-v1.hbs`) to reflect workflow phase and execution order.

**Source Stories**: Story 4.1 (Import YouTube Launch Optimizer Templates)

## Context

When to use this pattern:

- Workflow has distinct phases or sections (config, analysis, generation, publishing)
- Templates should be grouped visually by workflow stage
- Need to maintain execution order within sections
- Multiple template variations exist for same task (v1, v2, etc.)
- Large template collections (50+ templates) need organization

**Problem**: Flat naming (e.g., `generate-title.hbs`, `analyze-content.hbs`) doesn't communicate workflow structure. Hard to see which templates belong together or their intended execution order.

**Solution**: Use `{section}-{sequence}-{description}.hbs` naming pattern that encodes workflow phase and order directly in filename.

## Implementation

### Naming Pattern

```
{section}-{sequence}-{description}[-version].hbs

section:     1-11 (workflow phase number)
sequence:    1-99 (order within section)
description: kebab-case task name
version:     (optional) v1, v2, etc. for variations
```

### Examples from YouTube Launch Optimizer

```
# Section 1: Configuration
1-1-configure.hbs               # Workflow configuration
1-2-brand-config.hbs            # Brand settings
1-3-load-transcript.hbs         # Load source data
1-4-abridge-v2.hbs              # Summarize transcript (version 2)

# Section 4: Content Analysis
4-1-analyze-content-essence.hbs # Main topic extraction
4-2-extract-keywords.hbs        # Keyword identification
4-3-identify-audience.hbs       # Target audience analysis

# Section 5: Title Generation
5-1-generate-title-v1.hbs       # Title generation (original)
5-1-generate-title-v2.hbs       # Title generation (improved)
5-2-optimize-title-length.hbs   # SEO optimization

# Section 99: Utilities
99-1-debug-workflow.hbs         # Debugging helper
99-2-validate-output.hbs        # Output validation
```

### Directory Structure

```
prompts/
├── 1-1-configure.hbs
├── 1-2-brand-config.hbs
├── 1-3-load-transcript.hbs
├── 1-4-abridge-v2.hbs
├── 4-1-analyze-content-essence.hbs
├── 4-2-extract-keywords.hbs
├── 5-1-generate-title-v1.hbs
├── 5-1-generate-title-v2.hbs
├── 5-2-optimize-title-length.hbs
└── 99-1-debug-workflow.hbs
```

**Benefits**: Alphabetical sorting = workflow order. Visual grouping by section prefix.

## Rationale

**Why Section-Based Naming?**

1. **Visual Grouping**: Templates for same workflow phase cluster together alphabetically
2. **Execution Order**: Sequence number indicates intended order within section
3. **Workflow Documentation**: Naming alone communicates workflow structure
4. **Versioning**: Multiple variations (`v1`, `v2`) coexist with clear differentiation
5. **Scalability**: Pattern scales to 100+ templates across 11+ sections (proven with YouTube workflow)

**Section Numbers as Workflow Phases**:
- **1-3**: Setup/Config
- **4-7**: Analysis/Processing
- **8-10**: Generation/Output
- **11+**: Publishing/Deployment
- **99**: Utilities/Debugging

**Trade-offs**:
- Slightly longer filenames than flat naming
- Requires workflow phase planning upfront
- But: Organization benefits far outweigh verbosity cost at scale

## Architecture Alignment ⭐

- **Designed in**: Not specified in original architecture (emergent pattern from real-world usage)
- **Implementation Status**: 🆕 **Novel** - Pattern discovered from YouTube Launch Optimizer workflow structure
- **Deviation Rationale**: N/A - Not specified in architecture, adopted from existing workflow

**Validation**: Successfully organized 53 YouTube templates across 11 sections. Zero naming conflicts.

## Evolution from Epic 3 ⭐

- **Relationship**: **New** pattern (Epic 3 didn't have multi-section workflows)
- **Epic 3 Pattern**: Simple kebab-case naming (e.g., `generate-titles.hbs`)
- **Changes**: Added section prefix and sequence number for workflow organization

**Key Innovation**: Encoding workflow structure in filenames enables visual workflow understanding without opening files or consulting documentation.

## Real-World Validation ⭐

- **VibeDeck Status**: **Untested** - VibeDeck has flat structure (`docs/image-generation/` folder, not section-organized)
- **Gap Analysis Reference**: Not directly mentioned in `vibedeck-observations.jsonl`
- **Edge Cases Discovered**:
  - **Version suffix**: Some templates have `-v2` suffix when improving existing templates (e.g., `1-4-abridge-v2.hbs`)
  - **Section 99 for utilities**: Convention emerged for debug/utility templates that don't fit workflow phases

**Production Readiness**: Pattern successfully applied to 53 templates. All templates imported without naming conflicts. Quality score: 95/100 (Story 4.1 QA gate).

## Related Patterns

- **[Workflow-Scoped Resource Management](workflow-scoped-resource-management.md)** (Epic 3) - Templates organized in workflow directories
- **[Workflow Chain Execution](4-workflow-chain-execution.md)** (Epic 4) - Chain definitions reference templates by section-based names

## Anti-Patterns

```
# ❌ ANTI-PATTERN: No workflow structure
prompts/
├── abridge.hbs
├── analyze.hbs
├── generate-title.hbs
└── create-thumbnail.hbs
# WRONG: No visual grouping, unclear order

# ❌ ANTI-PATTERN: Numeric prefix without sections
prompts/
├── 01-configure.hbs
├── 02-abridge.hbs
├── 03-analyze.hbs
└── 04-generate-title.hbs
# WRONG: Doesn't scale (runs out of numbers), no phase grouping

# ❌ ANTI-PATTERN: Folder-based sections
prompts/
├── 1-config/
│   ├── configure.hbs
│   └── brand.hbs
├── 4-analysis/
│   ├── analyze.hbs
│   └── extract.hbs
# WRONG: Extra directory depth, harder to glob patterns
```

## Implementation Checklist

When adopting section-based naming:

- [ ] Define workflow phases (e.g., 1=config, 4=analysis, 5=generation)
- [ ] Document section number meanings in workflow README
- [ ] Use `{section}-{sequence}-{description}.hbs` format
- [ ] Sequence starts at 1 within each section
- [ ] Add version suffix (`-v2`) for improved templates
- [ ] Reserve section 99 for utilities
- [ ] Update chain definitions to use new template names
- [ ] Glob patterns work with naming: `prompts/5-*.hbs` selects all title generation templates

## References

- **Story**: `docs/stories/4.1.story.md` (Import YouTube Launch Optimizer Templates)
- **Source Data**: `data/youtube-launch-optimizer/prompts/` (53 templates with section-based naming)
- **Implementation**: Templates imported to `dev-workspace/workflows/youtube-launch-optimizer/prompts/`
- **QA Gate**: `docs/qa/gates/4.1-import-youtube-launch-optimizer-templates.yml` (Quality Score: 95/100)

---

**Pattern Established**: Story 4.1 (2026-01-12)
**Discovered From**: YouTube Launch Optimizer real-world workflow
**Last Updated**: 2026-01-19
