# Audit Documentation Taxonomy

**Task ID**: audit-documentation-taxonomy
**Owner**: Lisa (Librarian)
**Scope**: Full `docs/` tree (BMAD, KDD, POEM)
**Purpose**: Detect documentation violations and ensure taxonomy compliance

---

## Overview

This task scans the ENTIRE `docs/` tree and validates against `documentation-taxonomy.yaml` to detect:
- **Unknown folders** (ERROR - blocks commits)
- **Unknown files** (WARNING - report only)
- **Naming violations** (WARNING - report only)
- **Missing indexes** (WARNING - report only)
- **Broken links** across ALL docs/ (WARNING - report only)

**When to use**:
- After story completion (part of Lisa's Step 7 workflow)
- Before major documentation changes
- During periodic health audits
- When investigating documentation issues

---

## Prerequisites

**Required files**:
- `.bmad-core/data/documentation-taxonomy.yaml` - Master taxonomy
- `docs/` - Documentation tree to audit

**Agent**: Lisa (Librarian)

---

## Task Steps

### Step 1: Load Documentation Taxonomy

**Action**: Read `.bmad-core/data/documentation-taxonomy.yaml`

**Extract**:
- `categories.bmad.required_folders` and `optional_folders`
- `categories.kdd.required_folders` and `optional_folders`
- `categories.poem.required_folders` and `optional_folders`
- `categories.shared` (master index, examples)
- `violation_detection` rules

**Output**: In-memory taxonomy structure

---

### Step 2: Scan docs/ Tree

**Action**: List ALL folders and files in `docs/` recursively

**Commands**:
```bash
find docs/ -type d | sort
find docs/ -type f -name "*.md" | sort
```

**Output**: Complete inventory of current documentation structure

---

### Step 3: Check for Unknown Folders

**Action**: Compare found folders against taxonomy

**Algorithm**:
```
FOR EACH folder IN docs/:
  IF folder NOT IN (bmad.required + bmad.optional + kdd.required + kdd.optional + poem.required + poem.optional + shared):
    VIOLATION: unknown_folder
    SEVERITY: error
    ACTION: block_commit
```

**Output**: List of unknown folders with suggested locations

**Example**:
```
❌ ERROR: Unknown folder detected
   Path: docs/random-notes/

   Suggestions:
   - Is this transient? → Move to dev-workspace/
   - Is this BMAD artifact? → Check docs/planning/, docs/backlog/
   - Is this KDD knowledge? → Should be docs/kdd/patterns|learnings|decisions/
   - Is this POEM product docs? → Should be docs/poem/ or docs/poem/user-guide/

   To fix:
   1. Move folder to appropriate location, OR
   2. Add to documentation-taxonomy.yaml if this is a new category
```

---

### Step 4: Check for Unknown Files

**Action**: Validate files against expected locations

**Algorithm**:
```
FOR EACH file IN docs/**/*.md:
  parent_folder = dirname(file)

  IF parent_folder IN known_folders:
    IF file matches naming_pattern FOR parent_folder:
      PASS
    ELSE:
      VIOLATION: naming_violation (WARNING)
  ELSE:
    IF file IN exceptions (index.md, README.md, .gitkeep):
      PASS
    ELSE:
      VIOLATION: unknown_file (WARNING)
```

**Output**: List of files in unexpected locations

**Example**:
```
⚠ WARNING: Unknown file detected
   Path: docs/notes.md

   Suggestions:
   - Move to appropriate category folder
   - Delete if obsolete
   - Add to .gitignore if transient
```

---

### Step 5: Check Naming Violations

**Action**: Validate markdown file naming conventions

**Rules** (from taxonomy):
- Markdown files should be `kebab-case.md`
- Exceptions: `README.md`, `CLAUDE.md`, standard uppercase files
- Story files: `X.Y.story(-SAT)?.md`
- Patterns: `{domain}-{topic}-pattern.md`
- Learnings: `{topic}-{issue}-kdd.md`
- Decisions: `adr-{NNN}-{name}.md`

**Algorithm**:
```
FOR EACH file IN docs/**/*.md:
  IF file NOT IN exceptions:
    IF file.name does NOT match kebab-case pattern:
      VIOLATION: naming_violation (WARNING)
```

**Output**: List of naming violations

**Example**:
```
⚠ WARNING: Naming violation
   Path: docs/poem/WorkflowGuide.md
   Expected: workflow-guide.md (kebab-case)
```

---

### Step 6: Check Missing Indexes

**Action**: Verify index.md files exist where required

**Rules** (from taxonomy):
- `docs/index.md` (required - master navigation)
- `docs/poem/index.md` (required)
- `docs/poem/user-guide/index.md` (required)
- `docs/kdd/index.md` (required)
- `docs/kdd/patterns/index.md` (required)
- `docs/kdd/learnings/index.md` (required)
- `docs/kdd/decisions/index.md` (required)
- Folders with >3 markdown files should have index.md

**Algorithm**:
```
FOR EACH required_index IN taxonomy.required_indexes:
  IF NOT exists(required_index):
    VIOLATION: missing_index (WARNING)

FOR EACH folder IN docs/**/:
  file_count = count(*.md files in folder)
  IF file_count > 3 AND NOT exists(folder/index.md):
    VIOLATION: missing_index (WARNING)
```

**Output**: List of missing indexes

**Example**:
```
⚠ WARNING: Missing index file
   Path: docs/poem/tutorials/
   Reason: Folder has 5 markdown files but no index.md

   Fix: Run `*regenerate-indexes` to auto-create
```

---

### Step 7: Check Broken Links (Sample)

**Action**: Validate links across ALL documentation

**Note**: Full link validation is in `validate-all-documentation-links.md` task. This step does a SAMPLE check (10% of files).

**Algorithm**:
```
sample_files = random 10% of docs/**/*.md

FOR EACH file IN sample_files:
  links = extract_markdown_links(file)

  FOR EACH link IN links:
    IF link is relative:
      target = resolve_path(dirname(file), link)
      IF NOT exists(target):
        VIOLATION: broken_link (WARNING)
```

**Output**: Sample broken links (if found, recommend running `*validate-all-links`)

**Example**:
```
⚠ WARNING: Broken link detected (sample check)
   File: docs/poem/index.md
   Link: ./api-reference/overview.md
   Target: docs/poem/api-reference/overview.md (NOT FOUND)

   Run `*validate-all-links` for full scan.
```

---

### Step 8: Generate Audit Report

**Action**: Compile all violations into structured report

**Report Format**:
```
📚 Documentation Taxonomy Audit Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: {timestamp}
Scope: docs/ (full tree)
Taxonomy: documentation-taxonomy.yaml v1.0.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Summary

Total folders scanned: {count}
Total files scanned: {count}

Violations:
  ❌ ERRORS (blocking): {count}
  ⚠ WARNINGS (non-blocking): {count}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ❌ ERRORS (Blocking)

### Unknown Folders ({count})
{list of unknown folders with suggestions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ⚠ WARNINGS (Non-blocking)

### Unknown Files ({count})
{list of unknown files}

### Naming Violations ({count})
{list of naming violations}

### Missing Indexes ({count})
{list of missing indexes}

### Broken Links (Sample) ({count})
{list of broken links from sample}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Actions Required

1. Fix ERRORS first (they block commits):
   - Move or categorize unknown folders

2. Address WARNINGS:
   - Fix naming violations
   - Run `*regenerate-indexes` for missing indexes
   - Run `*validate-all-links` for full link check

3. Update taxonomy if needed:
   - Edit .bmad-core/data/documentation-taxonomy.yaml
   - Document new categories with purpose and owner

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Output**: Save to `docs/qa/documentation-audit-{date}.md` (for historical tracking)

---

## Exit Criteria

- [✓] Taxonomy loaded from documentation-taxonomy.yaml
- [✓] Full docs/ tree scanned (folders and files)
- [✓] Unknown folders detected (ERROR level)
- [✓] Unknown files detected (WARNING level)
- [✓] Naming violations detected (WARNING level)
- [✓] Missing indexes detected (WARNING level)
- [✓] Broken links sample checked (WARNING level)
- [✓] Audit report generated and displayed
- [✓] Report saved to docs/qa/documentation-audit-{date}.md

---

## Success Criteria

**Ideal state** (zero violations):
```
✅ Documentation Taxonomy Audit: CLEAN
   - 0 unknown folders
   - 0 unknown files
   - 0 naming violations
   - 0 missing indexes
   - 0 broken links
```

**Acceptable state** (warnings only):
```
✓ Documentation Taxonomy Audit: PASS WITH WARNINGS
  - 0 unknown folders (ERRORS)
  ⚠ 3 naming violations (non-blocking)
  ⚠ 2 missing indexes (non-blocking)
```

**Blocking state** (errors present):
```
❌ Documentation Taxonomy Audit: BLOCKED
   - 2 unknown folders (must fix before commit)
```

---

## Related Tasks

- `detect-unknown-documentation.md` - Focused detection of unknown items
- `validate-all-documentation-links.md` - Full link validation
- `generate-indexes.md` - Auto-generate missing indexes

---

## Integration with Pre-Commit Hook

This task is called by `.husky/pre-commit` via:
```bash
.bmad-core/utils/validate-docs-taxonomy.sh
```

**Behavior**:
- If ERRORS found → Exit code 1 (blocks commit)
- If only WARNINGS → Exit code 0 (commit allowed, warnings displayed)

**Bypass** (when intentional):
```bash
git commit --no-verify
```

---

**Last Updated**: 2026-01-22
**Owner**: Lisa (Librarian)
**Scope**: Full docs/ tree
