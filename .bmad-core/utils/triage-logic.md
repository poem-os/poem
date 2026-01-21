# Triage Logic Reference

This document defines the unified decision criteria and inference rules for routing development work. Used by both Triage task (`.bmad-core/tasks/triage-work.md`) and Issue Logger agent (`docs/planning/gap-analysis/observation-collector.md`).

---

## 4 Sequential Decision Criteria

### Criterion 1: Time & Ceremony

**Purpose**: Separate lightweight fixes from formal story work

**Decision Logic**:
```
IF estimatedTime == "<1hr":
  → Route to "Quick Fix" (.bmad-core/maintenance/backlog)
  → No story file, no QA gate
  → Direct fix and log with commit reference
ELSE:
  → Continue to Criterion 2
```

**Rationale**: Work under 1 hour doesn't justify full BMAD ceremony overhead (story file, QA review, SAT). Better to execute immediately and log in maintenance backlog.

**Examples**:
- **Quick Fix**: Fix typo in README, add .gitignore entry, update broken link
- **Not Quick Fix**: Add new Handlebars helper (requires tests, API endpoint, docs)

---

### Criterion 2: Existing Story

**Purpose**: Detect if work is already captured in a story file

**Decision Logic**:
```
IF existing story found with matching scope:
  → Route to "Existing Story {number}"
  → Update story if needed (add tasks, revise ACs)
ELSE:
  → Continue to Criterion 3
```

**How to Check**:
1. Search `docs/stories/` for keywords from issue description
2. Check story Status: Draft, Ready, In Progress, Review (NOT Done)
3. Verify scope overlap: Does story ACs cover this work?

**Examples**:
- Issue: "Template rendering fails for null values in schema"
- Found: Story 4.5 "Run Single Prompt with Mock Data" (Status: In Progress)
- Action: Route to Story 4.5, add subtask for null handling

---

### Criterion 3: Epic Fit

**Purpose**: Map work to feature epics (1-7) based on thematic area

**Decision Logic**:
```
IF thematicArea maps to Feature Epic (1-7):
  → Route to "Feature Epic Story"
  → Create new story in appropriate epic
  → Use full BMAD workflow
ELSE:
  → Continue to Criterion 4
```

**Epic Theme Mapping** (from `work-item-taxonomy.yaml`):

| Thematic Area | Epic | Keywords |
|---------------|------|----------|
| installation | Epic 1 | install, setup, npx, bin/install.js |
| prompts | Epic 2 | template, handlebars, .hbs, prompt-engineer |
| schemas | Epic 2 | schema, json, validation, extract |
| workflows | Epic 3 | workflow, chain, workflow-data |
| youtube | Epic 4 | youtube, launch-optimizer, video |
| providers | Epic 5 | provider, anthropic, openai, integration |
| visualization | Epic 6 | ui, dashboard, visualization |
| deployment | Epic 7 | deploy, publish, npm, github-actions |

**Examples**:
- Issue: "Add support for custom Handlebars partials" → thematicArea: prompts → **Epic 2**
- Issue: "Implement OpenAI provider integration" → thematicArea: providers → **Epic 5**

---

### Criterion 4: Epic 0 vs Ambiguous

**Purpose**: Classify remaining work as maintenance (Epic 0) or ambiguous

**Decision Logic**:
```
IF type IN [bug, refactor, docs]:
  → Route to "Epic 0 Story"
  → Maintenance category (P0/P1/P2 priority)
ELSE IF type == enhancement AND category == performance:
  → Route to "Epic 0 Story"
  → Performance optimization category
ELSE:
  → Route to "Ambiguous - Needs Clarification"
  → Consult with PM/PO for epic assignment
```

**Epic 0 Indicators**:
- Bug fixes (all priorities)
- Refactoring / technical debt
- Documentation updates
- Performance optimizations
- Infrastructure improvements
- Developer experience enhancements

**Ambiguous Indicators**:
- New features with unclear epic fit
- Enhancements that don't map to existing epics
- Cross-cutting concerns spanning multiple epics

**Examples**:
- Issue: "Extract schema validation into shared utility" → type: refactor → **Epic 0**
- Issue: "Add support for custom LLM providers" → type: feature, unclear epic → **Ambiguous**

---

## Estimate Inference Heuristics

### Severity → Time Mapping

```
critical → 4-8hr
high     → 1-4hr
medium   → <1hr
low      → <1hr
```

**Rationale**: Critical issues often require investigation, root cause analysis, comprehensive testing. Low/medium issues are typically isolated fixes.

### Keywords → Time Adjustment

Override severity-based estimate if keywords indicate scope:

| Keyword | Adjustment | Reason |
|---------|------------|--------|
| "refactor entire", "rewrite" | +8hr | Major architectural work |
| "add tests for", "test coverage" | +2hr | Test development takes time |
| "typo", "link", "formatting" | <1hr | Trivial changes |
| "investigate", "debug", "reproduce" | +2-4hr | Investigation overhead |

**Examples**:
- "Fix typo in README" → **<1hr** (keyword override, ignore severity)
- "Critical: Investigate template rendering performance" → **4-8hr** (severity + investigation keyword)

---

## Impact Inference Rules

### Severity → Impact Mapping

```
critical → high
high     → high
medium   → medium
low      → low
```

### Context-Based Adjustment

Increase impact if:
- Affects core workflows (prompts, workflows, installation)
- Blocks other development work
- Reported by multiple users
- No known workaround

Decrease impact if:
- Affects edge case
- Easy workaround available
- Affects optional features only

**Examples**:
- "Template rendering fails" + context: "affects all prompts" → **Impact: High**
- "Helper function typo" + context: "helper rarely used" → **Impact: Low**

---

## Type Classification Rules

### Category → Type Mapping

```
bug               → bug
missing-feature   → enhancement (default)
missing-feature + severity:critical → feature
usability         → enhancement
docs-gap          → docs
architecture      → refactor
performance       → enhancement
```

### Severity-Based Type Promotion

For `category: missing-feature`:
- **Critical severity** → Promote to `type: feature` (significant capability gap)
- **High/Medium/Low severity** → Keep as `type: enhancement` (incremental improvement)

**Examples**:
- "Add hot-reload support for helpers" → category: missing-feature, severity: high → **Type: enhancement**
- "Add multi-provider support" → category: missing-feature, severity: critical → **Type: feature**

---

## Epic Fit Decision Examples

### Example 1: Bug Fix

**Input**:
- Description: "NPX installer crashes on Windows with spaces in path"
- Severity: critical
- Category: bug

**Decision Path**:
1. Criterion 1: estimatedTime = 4-8hr (critical) → NOT Quick Fix
2. Criterion 2: No existing story found
3. Criterion 3: thematicArea = installation → Epic 1? NO (bug fix)
4. Criterion 4: type = bug → **Route to Epic 0 Story**

**Output**: Epic 0 Story (P0 priority)

---

### Example 2: New Feature

**Input**:
- Description: "Add support for human-in-the-loop checkpoints in workflows"
- Severity: high
- Category: missing-feature

**Decision Path**:
1. Criterion 1: estimatedTime = 4-8hr → NOT Quick Fix
2. Criterion 2: No existing story found
3. Criterion 3: thematicArea = workflows → **Route to Epic 3**
4. (Not reached)

**Output**: Feature Epic Story (Epic 3)

---

### Example 3: Quick Fix

**Input**:
- Description: "Fix broken link in README to troubleshooting section"
- Severity: low
- Category: docs-gap

**Decision Path**:
1. Criterion 1: estimatedTime = <1hr (low + keyword "link") → **Route to Quick Fix**
2. (Not reached)

**Output**: Quick Fix (no story file)

---

### Example 4: Technical Debt

**Input**:
- Description: "Refactor Handlebars helper registration to use plugin pattern"
- Severity: medium
- Category: architecture

**Decision Path**:
1. Criterion 1: estimatedTime = 1-4hr (medium + refactor) → NOT Quick Fix
2. Criterion 2: No existing story found
3. Criterion 3: thematicArea = prompts → Epic 2? NO (refactor)
4. Criterion 4: type = refactor → **Route to Epic 0 Story**

**Output**: Epic 0 Story (P1 priority - technical debt)

---

### Example 5: Enhancement with Epic Fit

**Input**:
- Description: "Improve schema validation error messages with field-level details"
- Severity: medium
- Category: usability

**Decision Path**:
1. Criterion 1: estimatedTime = 1-4hr → NOT Quick Fix
2. Criterion 2: No existing story found
3. Criterion 3: thematicArea = schemas → **Route to Epic 2**
4. (Not reached)

**Output**: Feature Epic Story (Epic 2)

---

## Staleness Rules

### When to Recompute suggestedPath

Triage task should recompute pre-computed `suggestedPath` when:

1. **Age**: Issue logged >30 days ago
   - Rationale: Epic priorities may have shifted, new stories created
   - Action: Rerun Criteria 1-4 with current state

2. **Epic Completion**: `suggestedEpic` is now Done
   - Rationale: Feature epic completed, work should route to Epic 0 or new epic
   - Action: Re-evaluate epic fit, likely route to Epic 0

3. **Estimate Changed**: User overrides `estimatedTime`
   - Rationale: Time estimate affects Criterion 1 (Quick Fix vs Story)
   - Action: Rerun Criteria 1-4 with new estimate

### Staleness Detection Example

```
Issue #42:
  timestamp: 2025-11-15
  suggestedPath: "Feature Epic Story"
  suggestedEpic: "Epic 4"
  estimatedTime: "1-4hr"

Today: 2026-01-21 (67 days later)

Staleness Check:
  ✗ Age > 30 days (67 days)
  ? Epic 4 status: Done ✓
  → STALE: Recompute suggestion
  → New suggestedPath: "Epic 0 Story" (Epic 4 complete)
```

---

## Usage Notes

**For Issue Logger Agent** (`observation-collector.md`):
- Use inference rules to populate v2.0 fields automatically
- Apply Criteria 1-4 to compute `suggestedPath`
- Store rationale in `suggestedPathRationale` (2-3 bullets)

**For Triage Task** (`triage-work.md`):
- Read pre-computed `suggestedPath` from v2.0 issues
- Verify staleness (age, epic completion)
- Display with verification status: "✓ Suggestion still valid (2025-12-15)"
- Recompute if stale, show: "⚠ Suggestion stale (>30 days), recomputed"

**For v1.0 Compatibility**:
- Infer missing fields using rules above
- Compute `suggestedPath` on-the-fly (not stored)
- No staleness detection (no stored timestamp)

---

**Last Updated**: 2026-01-21
