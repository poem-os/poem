# Detect Unknown Documentation

**Task ID**: detect-unknown-documentation
**Owner**: Lisa (Librarian)
**Scope**: Full `docs/` tree
**Purpose**: Find folders/files outside taxonomy and suggest proper locations

---

## Overview

This task is a **focused detector** that finds documentation created outside the known taxonomy and provides interactive suggestions for proper placement.

**Difference from `audit-documentation-taxonomy`**:
- `audit-documentation-taxonomy`: Comprehensive audit (errors + warnings + links + indexes)
- `detect-unknown-documentation`: Focused on unknown items ONLY, with interactive suggestions

**When to use**:
- When you notice unexpected folders in docs/
- After someone creates documentation without Lisa's guidance
- To clean up documentation sprawl
- To categorize uncategorized docs

---

## Prerequisites

**Required files**:
- `.bmad-core/data/documentation-taxonomy.yaml` - Master taxonomy
- `docs/` - Documentation tree to scan

**Agent**: Lisa (Librarian)

---

## Task Steps

### Step 1: Load Taxonomy and Scan

**Action**: Load taxonomy and get complete file/folder inventory

```bash
# Get all folders
find docs/ -type d | sort > /tmp/found-folders.txt

# Get all markdown files
find docs/ -type f -name "*.md" | sort > /tmp/found-files.txt
```

**Extract from taxonomy**:
- Known folders (BMAD + KDD + POEM + shared)
- File naming patterns
- Exceptions list

---

### Step 2: Detect Unknown Folders

**Action**: Compare found folders against taxonomy

**Algorithm**:
```
known_folders = [
  # BMAD
  "docs/prd/", "docs/architecture/", "docs/stories/",
  "docs/qa/", "docs/backlog/", "docs/planning/",

  # KDD
  "docs/kdd/", "docs/kdd/patterns/", "docs/kdd/learnings/",
  "docs/kdd/decisions/",

  # POEM
  "docs/poem/", "docs/poem/user-guide/",

  # Shared
  "docs/examples/"
]

unknown_folders = []

FOR EACH folder IN found_folders:
  IF folder NOT IN known_folders:
    unknown_folders.append(folder)
```

---

### Step 3: Interactive Categorization

**For EACH unknown folder**, ask user to categorize:

**Display**:
```
🔍 Unknown folder detected: docs/{folder-name}/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Folder: {folder-name}
📄 Files: {count} files
📅 Created: {date if available}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What should this folder be?

1. BMAD Artifact
   → Move to: docs/planning/ (historical) or docs/backlog/ (quick fixes)
   → Reason: BMAD workflow documentation (PRD, architecture, stories, QA)

2. KDD Knowledge
   → Move to: docs/kdd/patterns/ or docs/kdd/learnings/ or docs/kdd/decisions/
   → Reason: Developer knowledge (patterns, debugging sessions, ADRs)

3. POEM Product Documentation
   → Move to: docs/poem/ or docs/poem/user-guide/
   → Reason: End-user documentation for POEM features

4. Transient/Temporary
   → Move to: dev-workspace/{folder-name}/
   → Reason: Runtime artifacts, logs, temporary notes (gitignored)

5. Add to Taxonomy (New Category)
   → Edit: .bmad-core/data/documentation-taxonomy.yaml
   → Reason: This is a permanent new documentation category

6. Delete (Obsolete)
   → Action: Remove folder
   → Reason: No longer needed

7. Skip (Review Later)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enter choice (1-7): _
```

---

### Step 4: Execute User Choice

Based on user selection:

**Choice 1-3** (BMAD/KDD/POEM):
- Ask for specific target location
- Confirm move
- Execute `mv docs/{folder} {target}/`
- Update any broken links (offer to run `*validate-all-links` after)

**Choice 4** (Transient):
- Confirm move to dev-workspace/
- Execute `mv docs/{folder} dev-workspace/`
- Remind user: "dev-workspace/ is gitignored"

**Choice 5** (Add to Taxonomy):
- Guide user to edit documentation-taxonomy.yaml
- Show example of adding new category
- Pause for user to edit file
- Reload taxonomy after edit

**Choice 6** (Delete):
- Show files that will be deleted
- Confirm deletion
- Execute `rm -rf docs/{folder}`

**Choice 7** (Skip):
- Add to "Review Later" list
- Continue to next unknown folder

---

### Step 5: Detect Unknown Files

**Action**: Find markdown files in unexpected locations

**Algorithm**:
```
unknown_files = []

FOR EACH file IN found_files:
  parent = dirname(file)

  IF parent IN known_folders:
    # File is in known folder, validate naming pattern
    IF NOT matches_naming_pattern(file, parent):
      unknown_files.append({file, reason: "naming_violation"})
  ELSE:
    # File is in unknown folder (already handled in Step 2)
    SKIP
```

**Display** (for each unknown file):
```
🔍 Unknown file: {file}

Reason: File doesn't match expected naming pattern for {parent}/

Expected pattern:
{pattern from taxonomy}

Examples:
{examples from taxonomy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Actions:

1. Rename to follow pattern
2. Move to different folder
3. Add exception to taxonomy
4. Delete file
5. Skip

Enter choice (1-5): _
```

---

### Step 6: Generate Summary Report

**Action**: Summarize actions taken

**Report Format**:
```
📚 Documentation Categorization Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Unknown Folders: {count processed}/{count total}
Unknown Files: {count processed}/{count total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Actions Taken

### Moved to BMAD
- docs/random-notes/ → docs/planning/random-notes/

### Moved to KDD
- docs/debugging/ → docs/kdd/learnings/debugging/

### Moved to POEM
- docs/guides/ → docs/poem/guides/

### Moved to dev-workspace
- docs/temp/ → dev-workspace/temp/

### Deleted
- docs/obsolete/ (3 files)

### Added to Taxonomy
- docs/diagrams/ (new category: architectural diagrams)

### Skipped for Review
- docs/unclear-folder/ (needs clarification)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Next Steps

✓ Run `*validate-all-links` to fix broken links
✓ Run `*regenerate-indexes` to update navigation
✓ Run `*audit-docs` to verify full compliance
✓ Review skipped items later

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Exit Criteria

- [✓] Taxonomy loaded
- [✓] Unknown folders detected
- [✓] User prompted for each unknown folder
- [✓] User choices executed (move/delete/add/skip)
- [✓] Unknown files detected
- [✓] User prompted for each unknown file
- [✓] Summary report generated

---

## Success Criteria

**All categorized**:
```
✅ All unknown documentation categorized
   - 5 folders moved
   - 2 files renamed
   - 1 folder deleted
   - 0 items remaining
```

**Partial categorization**:
```
✓ Partial categorization complete
  - 3 folders moved
  - 2 folders skipped for review
```

---

## Example Session

```
Lisa: 🔍 Scanning docs/ for unknown documentation...

Found 2 unknown folders:
1. docs/temp-notes/
2. docs/old-diagrams/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Unknown folder detected: docs/temp-notes/

📁 Folder: temp-notes
📄 Files: 3 markdown files
📅 Created: 2026-01-20

What should this folder be?
1. BMAD Artifact
2. KDD Knowledge
3. POEM Product Documentation
4. Transient/Temporary (→ dev-workspace/)
5. Add to Taxonomy
6. Delete
7. Skip

Enter choice (1-7): 4

✓ Moving docs/temp-notes/ → dev-workspace/temp-notes/
✓ Complete. Folder is now gitignored.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Unknown folder detected: docs/old-diagrams/

📁 Folder: old-diagrams
📄 Files: 8 SVG files, 2 markdown files
📅 Created: 2025-12-15

What should this folder be?
... [user chooses "Add to Taxonomy"]

Lisa: To add this category to the taxonomy:

1. Open: .bmad-core/data/documentation-taxonomy.yaml
2. Add under categories.bmad.optional_folders:
   - path: "diagrams/"
     purpose: "Architectural diagrams and visualizations"
     status: "active"

Would you like me to pause while you edit? (y/n): y

[User edits file...]

Lisa: ✓ Taxonomy updated. Reloading...
✓ docs/old-diagrams/ now recognized as docs/diagrams/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Summary: 2 folders processed
  - 1 moved to dev-workspace
  - 1 added to taxonomy
```

---

## Related Tasks

- `audit-documentation-taxonomy.md` - Full topology audit
- `suggest-location.md` - AI-powered location suggestions

---

**Last Updated**: 2026-01-22
**Owner**: Lisa (Librarian)
