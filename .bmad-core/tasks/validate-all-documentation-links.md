# Validate All Documentation Links

**Task ID**: validate-all-documentation-links
**Owner**: Lisa (Librarian)
**Scope**: Full `docs/` tree (ALL markdown files)
**Purpose**: Validate ALL links across entire documentation to detect broken links

---

## Overview

This task scans EVERY markdown file in `docs/` and validates ALL links (relative and absolute) to ensure documentation integrity across BMAD, KDD, and POEM documentation.

**Difference from `validate-kdd-topology`**:
- `validate-kdd-topology`: KDD links only (VAL-001)
- `validate-all-documentation-links`: ENTIRE docs/ tree

**When to use**:
- After major documentation reorganization
- After moving folders or files
- Periodic health audits (monthly)
- When `*audit-docs` reports broken links in sample

---

## Prerequisites

**Required**:
- `docs/` - Documentation tree
- All markdown files

**Agent**: Lisa (Librarian)

---

## Task Steps

### Step 1: Scan All Markdown Files

**Action**: Get complete list of markdown files

```bash
find docs/ -type f -name "*.md" | sort > /tmp/all-docs.txt
```

**Output**: List of ALL markdown files for validation

---

### Step 2: Extract Links from Each File

**Action**: For each markdown file, extract all links

**Link types to check**:
1. **Relative links**: `[text](./path/to/file.md)`, `[text](../other/file.md)`
2. **Root-relative links**: `[text](/docs/path/file.md)`
3. **Absolute links**: `[text](https://example.com)` (optional check)

**Algorithm**:
```
FOR EACH file IN all_markdown_files:
  content = read(file)
  links = extract_markdown_links(content)  # Regex: \[.*?\]\((.*?)\)

  FOR EACH link IN links:
    IF link starts with "http://" or "https://":
      # External link - optionally check (can be slow)
      SKIP or check_external(link)
    ELSE IF link starts with "/":
      # Root-relative link
      target = project_root + link
      check_exists(target)
    ELSE:
      # Relative link
      target = resolve_relative_path(dirname(file), link)
      check_exists(target)
```

---

### Step 3: Validate Relative Links

**Action**: Resolve relative paths and check if target exists

**Example**:
```
File: docs/poem/index.md
Link: ./user-guide/getting-started.md
Resolved: docs/poem/user-guide/getting-started.md
Check: Does this file exist?
```

**Handle special cases**:
- Links with anchors: `file.md#section` → Check file exists, warn if anchor not found
- Links to directories: `../architecture/` → Check if directory has index.md

---

### Step 4: Validate Root-Relative Links

**Action**: Resolve paths from project root

**Example**:
```
File: docs/kdd/patterns/some-pattern.md
Link: /docs/architecture/components.md
Resolved: /Users/.../poem/docs/architecture/components.md
Check: Does this file exist?
```

---

### Step 5: Optionally Check External Links (Slow)

**Action**: HTTP HEAD request to check if external URLs are reachable

**Note**: This can be SLOW (network requests). Ask user if they want to check external links.

**Prompt**:
```
Check external links? This can take several minutes for large documentation.

1. Yes - Check all external links (slow)
2. No - Skip external links (faster)

Enter choice (1-2): _
```

**If YES**:
```
FOR EACH external_link:
  try:
    response = http_head(external_link, timeout=5s)
    IF response.status >= 400:
      BROKEN: external_link (status: {response.status})
  except timeout:
    WARN: external_link (timeout)
  except error:
    BROKEN: external_link (unreachable)
```

---

### Step 6: Check Anchor Links

**Action**: Validate anchors within files

**Example**:
```
Link: ./architecture.md#high-level-architecture
Target: docs/architecture.md
Check: Does file have heading "# High-Level Architecture" or "## High-Level Architecture"?
```

**Algorithm**:
```
IF link contains "#":
  file_part, anchor = link.split("#")
  target_file = resolve_path(file_part)

  IF exists(target_file):
    content = read(target_file)
    headings = extract_headings(content)  # Lines starting with #
    anchor_slug = slugify(anchor)  # Convert to heading slug

    IF anchor_slug NOT IN headings:
      WARN: Anchor not found: {link} in {source_file}
  ELSE:
    ERROR: File not found: {file_part}
```

---

### Step 7: Generate Link Validation Report

**Action**: Compile all broken links into structured report

**Report Format**:
```
🔗 Documentation Link Validation Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: {timestamp}
Scope: docs/ (full tree)
Files scanned: {count}
Links checked: {count}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Summary

✓ Valid links: {count} ({percent}%)
❌ Broken links: {count} ({percent}%)
⚠ Warnings: {count} (missing anchors, timeouts)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ❌ Broken Links

### Relative Links ({count})

docs/poem/index.md:12
  → ./api-reference/overview.md
  Target: docs/poem/api-reference/overview.md
  Status: FILE NOT FOUND

docs/kdd/patterns/config-pattern.md:45
  → ../learnings/config-issue.md
  Target: docs/kdd/learnings/config-issue.md
  Status: FILE NOT FOUND

### Root-Relative Links ({count})

docs/architecture/components.md:89
  → /docs/prd/epic-3.md
  Target: docs/prd/epic-3.md
  Status: FILE NOT FOUND

### External Links ({count})

docs/poem/workflow-validation-guide.md:150
  → https://example.com/missing-page
  Status: HTTP 404

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ⚠ Warnings

### Missing Anchors ({count})

docs/kdd/index.md:20
  → ./kdd-workflow-guide.md#step-8
  File exists, but anchor "#step-8" not found
  Available headings: #step-1, #step-2, ..., #step-7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## By Category

BMAD Documentation:
  ✓ {valid_count} valid
  ❌ {broken_count} broken

KDD Documentation:
  ✓ {valid_count} valid
  ❌ {broken_count} broken

POEM Documentation:
  ✓ {valid_count} valid
  ❌ {broken_count} broken

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Fix Commands

To fix broken links, consider:

1. Update source files to correct targets
2. Move/rename target files and update links
3. Run `*regenerate-indexes` if index files changed
4. Run `*audit-docs` to verify full compliance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Output**: Save to `docs/qa/link-validation-{date}.md`

---

## Exit Criteria

- [✓] All markdown files scanned
- [✓] All links extracted (relative, root-relative, external)
- [✓] Relative links validated (path resolution)
- [✓] Root-relative links validated
- [✓] External links checked (if user opted in)
- [✓] Anchor links validated
- [✓] Validation report generated and displayed
- [✓] Report saved to docs/qa/

---

## Success Criteria

**Perfect link health**:
```
✅ Link Validation: PERFECT
   - 0 broken links (100% valid)
   - All anchors found
```

**Good link health** (target: 95%+):
```
✓ Link Validation: HEALTHY
  - 450 valid links (97%)
  - 15 broken links (3%)
  - Action required: Fix 15 broken links
```

**Poor link health** (< 95%):
```
⚠ Link Validation: DEGRADED
  - 350 valid links (85%)
  - 50 broken links (15%)
  - CRITICAL: High broken link rate
```

---

## Performance Notes

**Speed**:
- Relative/root-relative links: Fast (~1-2 seconds for 500 files)
- External links: SLOW (~5-10 minutes for 100 external links)

**Optimization**:
- Cache external link checks (avoid re-checking same URL)
- Parallel processing for external links
- Skip external links by default (opt-in)

---

## Example Session

```
Lisa: 🔗 Validating ALL documentation links...

Scanning files... 187 markdown files found

Extracting links... 1,245 links found
  - 980 relative/root-relative links
  - 265 external links

Validating relative links... ✓ 950 valid, ❌ 30 broken

Check external links? (1=Yes, 2=No): 2
Skipping external link validation.

Checking anchors... ⚠ 5 missing anchors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary:
  ✓ 950 valid links (97%)
  ❌ 30 broken links (3%)
  ⚠ 5 missing anchors

Target: 95%+ valid links
Status: HEALTHY ✓

Report saved: docs/qa/link-validation-2026-01-22.md
```

---

## Related Tasks

- `validate-kdd-topology.md` - KDD-specific link validation (VAL-001)
- `audit-documentation-taxonomy.md` - Full topology audit (includes sample link check)

---

**Last Updated**: 2026-01-22
**Owner**: Lisa (Librarian)
**Scope**: Full docs/ tree
