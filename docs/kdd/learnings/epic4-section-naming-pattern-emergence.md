# Learning: Section-Based Naming Pattern Emerged from Real-World Usage

**Date**: 2026-01-12
**Source**: Story 4.1 (Import YouTube Launch Optimizer Templates)
**Category**: Pattern Discovery / Architecture Evolution

## Context

Story 4.1 imported 53 templates from YouTube Launch Optimizer workflow. During import, discovered templates used `{section}-{sequence}-{description}.hbs` naming pattern (e.g., `1-1-configure.hbs`, `5-1-generate-title-v2.hbs`).

## Challenge

**Discovery**: Section-based naming pattern was **not designed upfront** in POEM architecture. It emerged organically from real-world YouTube workflow organization needs.

**Initial assumption**: POEM would use simple kebab-case names (`generate-titles.hbs`, `analyze-content.hbs`) as established in Epic 3.

**Reality**: YouTube workflow creators needed:
- Visual grouping by workflow phase (config, analysis, generation)
- Execution order indication within phases
- Multiple template variations (v1, v2)
- Scalability to 50+ templates

**Pattern they invented**: `1-1-configure.hbs`, `4-1-analyze-content-essence.hbs`, `5-1-generate-title-v2.hbs`

## Solution

**Decision**: Adopt real-world pattern as POEM convention.

**Actions taken**:
1. ✅ Documented pattern in KDD (section-based-template-naming.md)
2. ✅ Imported all 53 templates preserving original naming
3. ✅ Updated architecture docs to reflect pattern
4. ✅ Created pattern guidelines for future workflows

**Pattern benefits validated**:
- Alphabetical sorting = workflow order (files naturally organize by section)
- Easy to find templates by phase (`ls 5-*.hbs` shows all title-generation templates)
- Version suffixes work well (`-v1`, `-v2` coexist cleanly)
- Scales to 11 sections × 50+ templates without conflicts

## Outcome

**Key insight**: **Real-world usage reveals patterns that design phase misses.**

**Pattern adoption**:
- YouTube workflow: 53 templates organized across 11 sections (sections 1-10, plus 99 for utilities)
- Zero naming conflicts
- Easy navigation (developers can visually scan and understand workflow structure)
- Glob patterns work naturally (`prompts/5-*.hbs` selects all title-generation templates)

**Architecture evolution**: Pattern documented as Epic 4 best practice, recommended for future workflows.

## Prevention with Epic 3 Knowledge ⭐

- **Was this avoidable?**: No - pattern emerged from real-world workflow complexity that Epic 3 didn't encounter
- **Epic 3 Learning Missed**: N/A (Epic 3 had simple workflows with 5-10 templates, not 53)
- **Root Cause**: Design phase focused on single-workflow simplicity, not multi-section organization at scale

**Why Epic 3 didn't reveal this**:
- Epic 3 workflows: 5-10 templates each (simple kebab-case sufficient)
- Epic 4 YouTube: 53 templates across 11 phases (needed organization system)
- Scale reveals patterns that small datasets hide

## Discovery Mode Status ⭐

- **Triggered?**: No (pattern discovered during import, not during implementation)
- **Architecture Docs Read**: N/A
- **Should Have Triggered?**: No - pattern came from external source (YouTube workflow creators)

**Pattern source**: YouTube Launch Optimizer creators invented this naming independently. POEM adopted their proven pattern.

## Future Application

**When encountering real-world patterns**:

1. ✅ **DO**: Recognize value in patterns invented by domain experts
2. ✅ **DO**: Document discovered patterns as KDD learnings
3. ✅ **DO**: Validate pattern against architecture principles before adopting
4. ✅ **DO**: Update architecture docs to reflect adopted patterns
5. ❌ **DON'T**: Reject real-world patterns just because they weren't designed upfront
6. ❌ **DON'T**: Force architecture onto users when their pattern works better

**Pattern validation checklist** (before adoption):
- [ ] Does pattern solve real problem? (Yes - organization at scale)
- [ ] Is pattern consistent with POEM philosophy? (Yes - file-based, discoverable)
- [ ] Does pattern scale? (Yes - 53 templates, 11 sections)
- [ ] Are there downsides? (Longer filenames - acceptable trade-off)

**Lesson**: Architecture should **guide** but not **dictate**. Real-world usage teaches what design phase cannot predict.

## Related Knowledge

- **Story**: `docs/stories/4.1.story.md` (Import YouTube Launch Optimizer Templates)
- **Pattern**: [Section-Based Template Naming](../patterns/4-section-based-template-naming.md)
- **Source Data**: `data/youtube-launch-optimizer/prompts/` (53 templates with section-based naming)
- **QA Gate**: Quality Score 95/100

---

**Learning Captured**: 2026-01-12
**Impact**: High (influenced POEM naming conventions going forward)
**Pattern Type**: Emergent pattern from real-world usage
**Last Updated**: 2026-01-19
