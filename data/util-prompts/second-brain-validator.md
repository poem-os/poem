---
name: Second Brain Validator
category: Quality Assurance
type: Comprehensive Audit
created: 2026-02-07
triggers:
  - validate brain
  - check second brain
  - audit documentation
  - brain quality check
  - validate knowledge base
keywords:
  - validation
  - quality assurance
  - documentation audit
  - second brain
  - multi-author consistency
  - content accuracy
  - structural integrity
---

# Second Brain Validator

## Purpose

Comprehensive validation methodology for second brain documentation that has been written by multiple contributors. Detects structural issues, content contradictions, broken references, and technical inaccuracies.

## When to Use

- Validating any brain in `/dev/ad/brains/`
- After multiple contributors have updated documentation
- Before releasing brain documentation
- Periodic quality audits
- When you suspect inconsistencies or broken references

## The Validation Framework

### Phase 1: Initial Assessment (Quick Scan)

**Structure Audit**
- Does it follow `documentation-pattern-for-second-brains.md`?
- Check for required files: `INDEX.md`, fundamentals, technical-patterns, practical-examples, `sources/`
- Verify file naming follows kebab-case convention
- Confirm all files have required sections (Title, Purpose, For Agents, dates)

**Source Repository Mapping**
- Identify claimed source repos from the brain
- Verify those repos exist locally (from `source-repos.md`)
- Check if source repo locations are documented correctly
- Validate the brain→repo pairing

**File Inventory**
- Count and categorize all files
- Identify orphaned files (not linked from INDEX.md)
- Spot naming inconsistencies
- Check for old/deprecated files

### Phase 2: Deep Content Analysis (Parallel Agents Recommended)

**Technical Accuracy Agent**
- Verify commands, code snippets, API calls
- Cross-reference with source repos (where they exist)
- Check version consistency
- Test command examples where safe
- Validate technical terminology

**Link & Reference Agent**
- Check all internal cross-references
- Validate external URLs (without fetching unless necessary)
- Verify file path references
- Test navigation flows from INDEX.md

**Content Quality Agent**
- Check for self-containment (no hidden dependencies)
- Verify progressive disclosure flow
- Assess agent-friendliness
- Evaluate source attribution

### Phase 3: Multi-Author Conflict Detection

**Contradiction Finder**
- Same topic explained differently
- Conflicting recommendations
- Incompatible workflow patterns
- Version mismatches

**Duplication Detector**
- Repeated content across files
- Overlapping topics
- Redundant examples
- Similar quick references

**Terminology Inconsistency**
- Same concepts with different names
- Inconsistent capitalization
- Mixed terminology systems

### Phase 4: Navigation & Usability Check

**Agent Decision Trees**
- Validate "For Agents:" sections are helpful
- Test decision paths in INDEX.md
- Check quick reference accessibility
- Verify progressive disclosure works

**Human Usability**
- Clear hierarchical structure
- Consistent section ordering
- Appropriate level of detail
- Good examples vs. theory balance

### Phase 5: System Integration Validation

**Convention Compliance**
- Follows `/dev/.ai-conventions.md`
- Aligns with CLAUDE.md hierarchy
- Respects source of truth model (Brain → SDK/Repo)

**Cross-Brain Consistency**
- Check if this brain references other brains correctly
- Verify shared concepts align across brains
- Validate brand-dave meta-brain references

## Output Format

Deliver a comprehensive report with:

### 1. Executive Summary
- Overall brain health score
- Critical issues count
- Quick wins vs. deep refactoring needs
- Estimated effort to fix

### 2. Findings by Severity

**🔴 Critical Issues** (breaks functionality, wrong info, security concerns)
- Specific file and line number
- What's wrong
- Why it matters
- Recommended fix

**🟡 Major Issues** (confusing, inconsistent, poor UX)
- Same detail level as critical

**🟢 Minor Issues** (polish, optimization, nice-to-haves)
- Grouped by category
- Lower detail, batch fixes possible

### 3. Category Breakdowns
- Structure violations
- Content contradictions
- Missing attribution
- Broken navigation
- Technical inaccuracies
- Naming convention violations

### 4. Prioritized Recommendations

Action plan ordered by priority:
1. **Quick wins** (< 30 min, high impact)
2. **Must fix** (breaks brain usability)
3. **Should fix** (quality improvements)
4. **Nice to have** (polish)

### 5. Examples & Evidence
- Code snippets
- File excerpts with line numbers
- Before/after suggestions

## Tools to Use

- **Read** - File content analysis
- **Glob** - File discovery and pattern matching
- **Grep** - Content search across files
- **Task (Explore agent)** - For thorough codebase exploration
- **Task (background agents)** - Parallel analysis if needed
- **Bash** - For checking repos, testing commands (read-only)

## Execution Strategy

### Step 1: Preparation
1. Read the documentation pattern (`/dev/ad/brains/documentation-pattern-for-second-brains.md`)
2. Read the target brain's INDEX.md to understand scope
3. Identify source repositories (if applicable)

### Step 2: Parallel Analysis
Launch multiple exploration agents for different validation aspects:
- Structure & pattern compliance
- Technical accuracy
- Link validation
- Content quality

### Step 3: Synthesis
Consolidate findings from all agents into structured report

### Step 4: Delivery
Provide actionable summary with priority fixes

## Usage Examples

**Basic usage:**
```
Validate the "anthropic-claude" brain using the second-brain-validator prompt.
```

**Specific focus:**
```
Run a quick validation on the "remotion" brain - focus only on structure
and broken links (Phase 1 and Phase 2 Link Agent).
```

**Full deep dive:**
```
Perform a comprehensive validation of the "bmad-method" brain using all
5 phases with parallel agents. I need a detailed report before publishing.
```

## Validation Variations

### Quick Validation (30 min)
Focus only on:
- Phase 1 (structure audit)
- Phase 2 (technical accuracy only)
- Critical issues only

### Standard Validation (1-2 hours)
- All 5 phases
- All severity levels
- Single-threaded analysis

### Deep Validation (2-4 hours)
Full five-phase process with:
- Parallel agents for Phase 2
- Detailed evidence collection
- Before/after examples for all issues
- Effort estimates per fix

### Maintenance Validation (ongoing)
Run after major updates:
- Check only modified files
- Verify new cross-references
- Validate new source attributions

## Quality Checklist

A validated brain should meet these standards:

- ✅ Self-contained files (no hidden dependencies)
- ✅ Non-overlapping topics (clear boundaries)
- ✅ Agent-friendly navigation ("For Agents:" sections)
- ✅ Progressive disclosure (quick ref → fundamentals → technical → practical → sources)
- ✅ Source attribution (copy locally, prevent web fetch failures)
- ✅ Kebab-case file naming
- ✅ Required front matter in all files
- ✅ Working internal cross-references
- ✅ Technical accuracy in examples
- ✅ Consistent terminology across files

## Success Metrics

A successful validation delivers:
1. **Comprehensive findings** - All issues catalogued with severity
2. **Actionable recommendations** - Clear fixes with priority order
3. **Evidence-based** - Specific file/line references
4. **Effort estimates** - Time required for remediation
5. **Quick wins identified** - High-impact, low-effort fixes highlighted

## Related Documentation

- `/dev/ad/brains/documentation-pattern-for-second-brains.md` - Pattern specification
- `/dev/ad/brains/CLAUDE.md` - Second brains system overview
- `/dev/ad/brains/source-repos.md` - Source repository locations
- `/dev/.ai-conventions.md` - Global naming and coding standards

---

**Input Required**: Brain name (e.g., "anthropic-claude", "bmad-method", "remotion")

**Base Path**: `/Users/davidcruwys/dev/ad/brains/[brain-name]/`
