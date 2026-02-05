# Penny Analysis: 10-2-extract-outro

**Prompt File**: `10-2-extract-outro.hbs`
**Section**: 10 - Extract Video Elements (Advanced)
**Status**: ⚠️ Experimental/Unused (Evolved version of 1-6)
**Created**: 2026-02-04

---

## Overview

Extracts outro section from video transcript with **structured segment types** (recap, teaser, signOff) plus `ctasPresent` flag. JSON output. Evolved version of Section 1's simpler outro extraction.

**Purpose**: Analyze outro structure, track CTA presence, enable template creation.

**Evolution**: Section 1-6 extracted outro as raw text. This adds segmentation + CTA detection.

---

## Key Pattern: CTA Detection Flag

Includes `ctasPresent: true/false` to indicate if CTAs exist in outro. Actual CTA details extracted by 10-3 (extract-cta).

---

## Tags

`#section-10-extract-advanced` `#outro-extraction` `#structural-segmentation` `#cta-detection` `#experimental` `#evolved-from-1-6`

---

**Analyzed by**: Penny | **Last Updated**: 2026-02-04
