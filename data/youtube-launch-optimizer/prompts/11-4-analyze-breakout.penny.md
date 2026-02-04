# Penny Analysis: 11-4-analyze-breakout

**Prompt File**: `11-4-analyze-breakout.hbs`
**Section**: 11 - Analyze Video Elements (Advanced)
**Status**: ⚠️ Experimental/Unused (Companion to 10-4)
**Created**: 2026-02-04

---

## Overview

Analyzes breakout moments extracted by 10-4. Classifies breakout type (7 categories: demo, problem-solving, creation, research, retrospective, insight, tangent), evaluates standalone value, identifies repurposing potential (video/short/blog/snippet/tweet), assesses teaching value. JSON output.

**Purpose**: Identify content repurposing opportunities (breakouts → shorts, tutorials, social media clips).

**Workflow**: 10-4 (extract) → 11-4 (analyze) → Content repurposing strategy

---

## Key Pattern: Repurposing Potential Analysis

**Standalone Value**: Can this be its own content piece?

**Potential Formats**: Which formats suit this breakout? (video, short, blog, snippet, tweet)

**Teaching Value**: `teachesTransferable` - is this lesson applicable beyond current project?

**Use Case**: Breakout with `standaloneValue: high` + `potentialFormats: ["short"]` + `estimatedLength: brief` = **YouTube Short candidate**.

---

## Tags

`#section-11-analyze-advanced` `#breakout-analysis` `#content-repurposing` `#experimental` `#companion-to-10-4`

---

**Analyzed by**: Penny | **Last Updated**: 2026-02-04
