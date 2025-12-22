# YouTube Launch Optimizer - Reference Documentation

This subfolder contains battle-tested analysis from 15+ months of using the YouTube Launch Optimizer workflow. This documentation was originally created for the Motus project and has been brought into POEM because it provides invaluable insights for workflow orchestration.

## Why This Matters for POEM

The YouTube Launch Optimizer is the **primary validation case** for POEM's Epic 4. This workflow demonstrates:

- **Template chaining**: Output from Prompt A becomes input for Prompt B
- **Progressive data accumulation**: 60+ attributes build up through 33 prompts
- **Human checkpoint patterns**: 6 identified patterns for human-in-the-loop
- **Parallelization opportunities**: 10-13 minutes potential savings identified
- **Real-world complexity**: Not a toy example—actual production workflow

## Documents in This Folder

| Document | Purpose |
|----------|---------|
| `flow-analysis.md` | Step-by-step analysis of all 35 steps across 8 sections. Includes what works, what doesn't, human checkpoints, and parallelization opportunities. **The gold mine.** |
| `workflow-patterns.md` | Cross-workflow pattern comparison and Motus execution primitives. |
| `schema-analysis.md` | Data model deep dive: entities, relationships, storage strategies. |
| `sample-data/b62-remotion-overview.json` | Real workflow data showing 60+ attributes accumulated through execution. |

## Key Findings Summary

### What Actually Works (16-18 steps vs 35 designed)

| Section | Status | Notes |
|---------|--------|-------|
| 1. Video Preparation | ✅ Works | 5/6 steps, parallelizable |
| 2. Build Chapters | ⚠️ Partial | Step 2 helps (folder names), Step 3 broken |
| 3. B-Roll Suggestions | ❌ Deprecated | Should be own workflow |
| 4. Content Analysis | ⚠️ Informational | Runs but outputs mostly unused |
| 5. Title & Thumbnail | ⚠️ Partial | Only Step 1 (title ideas) used |
| 6. YouTube Meta Data | ✅ Works | Steps 1-3 auto-advance pipeline |
| 7. Social Media | ✅ Works | Tweet + LinkedIn work, can run parallel |
| 8. YouTube Shorts | ❌ Split off | Should be separate workflow |

### Human Checkpoint Patterns Identified

1. **Review & Select (Curation)** - AI generates options, human selects
2. **Correction/Refinement (Directive Feedback)** - Human provides 1-2 corrections
3. **Human Defines Framework, AI Populates** - Human provides structure (e.g., folder names)
4. **Approval Gate** - Simple proceed/stop decision

### Parallelization Opportunities

- **Section 1**: 4 steps parallel → 4-5 minute savings
- **Section 4**: 3 steps parallel → 4-6 minute savings
- **Section 7**: 2 steps parallel → 2 minute savings
- **Total**: 10-13 minutes potential savings

## How to Use This Documentation

**For POEM Planning**: Use these insights to inform Epic 4 stories and validate architectural decisions.

**For Workflow Execution**: Reference the flow-analysis.md to understand which steps actually work and what human checkpoints to expect.

**For Schema Design**: The sample data JSON shows the actual attribute structure accumulated through a real workflow run.

---

**Source**: Originally from Motus project `.awb/docs/`
**Imported**: 2025-12-01
**Context**: POEM Epic 4 validation case
