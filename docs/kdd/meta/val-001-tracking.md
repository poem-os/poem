# VAL-001 Link Health Tracking

**Rule**: VAL-001 - Link Health
**Target**: 0 broken links (excluding documented teaching examples)
**Owner**: Lisa (Librarian)

## Latest Validation

**Date**: 2026-01-25
**Tool**: `scripts/validate-kdd-links.js`
**Scope**: `docs/kdd/` directory (all subdirectories)

### Results

| Metric | Value |
|--------|-------|
| Total Links | 89 |
| Valid Links | 83 (93.3%) |
| Broken Links (Production) | 0 (0%) ✅ |
| Broken Links (Teaching Examples) | 6 (6.7%) |
| **Overall Health Score** | **93.3%** |

### Status: ✅ **PASS**

All production links are valid. The 6 broken links are intentional teaching examples in `kdd-workflow-guide.md` and are clearly documented.

## Validation History

| Date | Total Links | Valid | Broken (Prod) | Health Score | Notes |
|------|-------------|-------|---------------|--------------|-------|
| 2026-01-25 (before) | 74 | 65 | 9 | 87.8% | Initial validation |
| 2026-01-25 (after) | 89 | 83 | 0 | 93.3% ✅ | Fixed path errors |

## Improvement Timeline

**2026-01-25**: +5.5 percentage points (87.8% → 93.3%)
- Fixed 3 broken links in `knowledge-traceability-guide.md` (duplicate `kdd/` in paths)
- Documented 6 teaching examples in `kdd-workflow-guide.md`
- Created validation tooling and tracking documentation
- Result: 0 production broken links

## Known Teaching Examples (Not Counted as Failures)

All in `docs/kdd/meta/kdd-workflow-guide.md`:

1. Line 374: `password-validation-pattern.md` (walkthrough example)
2. Line 375: `cors-issue-kdd.md` (example learning)
3. Line 376: `adr-042-jwt-authentication.md` (example decision)
4. Line 421: `password-validation-pattern.md` (validation example)
5. Line 504: `password-validation-pattern.md` (promotion example)
6. Line 510: `email-validation-pattern.md` (promotion example)

**Purpose**: These non-existent files demonstrate Lisa's workflow patterns. They are clearly marked in the guide with explanatory notes.

## Validation Frequency

**Target**: Monthly (1st of each month)
**Last Run**: 2026-01-25
**Next Run**: 2026-02-01

## Automation Status

**Current**: Manual execution (`node scripts/validate-kdd-links.js`)
**Future**: Consider adding to Lisa's pre-commit hook (`meta/lisa-precommit-setup.sh`)

## Common Link Issues and Fixes

### Issue 1: Duplicate Directory in Path

**Symptom**: `../../kdd/kdd/patterns/file.md`
**Cause**: Copy-paste error or path miscalculation
**Fix**: Remove duplicate directory: `../../kdd/patterns/file.md`

### Issue 2: Absolute vs Relative Paths

**Symptom**: Link works in editor but fails validation
**Cause**: Incorrect path base assumption
**Fix**: Use relative paths from source file location

### Issue 3: Anchor Case Sensitivity

**Symptom**: Link to heading fails validation
**Cause**: Anchor format mismatch (headings converted to lowercase with dashes)
**Fix**: Use lowercase, dash-separated anchors (e.g., `#my-heading`)

## Maintenance Checklist

- [ ] Run validation monthly (1st of each month)
- [ ] Document any new teaching examples
- [ ] Fix production broken links immediately
- [ ] Update this tracking document after each validation
- [ ] Review automation opportunities quarterly

## Related Documentation

- [KDD Workflow Guide](kdd-workflow-guide.md) - Contains teaching examples
- [Knowledge Traceability Guide](knowledge-traceability-guide.md) - Link usage patterns
- [Link Validation Report](link-validation-report.md) - Detailed validation results (2026-01-25)

## Validation Tool

**Location**: `/Users/davidcruwys/dev/ad/poem-os/poem/scripts/validate-kdd-links.js`

**Usage**:
```bash
# From project root
node scripts/validate-kdd-links.js

# Expected output:
# Total links checked, valid count, broken count
```

**Exit codes**:
- 0: All production links valid
- 1: Broken production links found (excluding teaching examples)

**Features**:
- Extracts all Markdown links (standard link format)
- Validates file existence
- Validates anchor existence in target files
- Handles directory links (implicit index.md)
- Filters external URLs (http/https)
- Generates improvement comparison report
