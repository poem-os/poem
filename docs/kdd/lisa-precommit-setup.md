# Lisa's Pre-Commit Hook Setup

**Feature**: Block commits with unknown documentation folders
**Owner**: Lisa (Master Documentation Librarian)
**Status**: Optional (recommended)

---

## Overview

Lisa can **block commits** that introduce unknown folders in `docs/` by validating against `documentation-taxonomy.yaml` during pre-commit.

**What it does**:
- Scans staged documentation files before commit
- Checks if folders are in known taxonomy
- **Blocks commit** if unknown folders detected (exit code 1)
- Allows commit if clean or warnings only (exit code 0)

**When to use**:
- You want proactive documentation taxonomy enforcement
- You want to prevent documentation sprawl
- You want Lisa to act as gatekeeper

---

## Quick Setup (Husky)

### Option A: Using Husky (Recommended)

**1. Install Husky**:
```bash
npm install --save-dev husky
npx husky install
```

**2. Create pre-commit hook**:
```bash
npx husky add .husky/pre-commit ".bmad-core/utils/validate-docs-taxonomy.sh"
```

**3. Make validation script executable**:
```bash
chmod +x .bmad-core/utils/validate-docs-taxonomy.sh
```

**4. Test**:
```bash
# Try creating unknown folder
mkdir docs/test-folder
touch docs/test-folder/test.md
git add docs/test-folder

# Try committing (should block)
git commit -m "test"

# Should see Lisa's error message blocking commit
```

---

## Quick Setup (Native Git Hooks)

### Option B: Using .git/hooks/ (Native)

**1. Copy validation script to git hooks**:
```bash
cp .bmad-core/utils/validate-docs-taxonomy.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**2. Test**:
```bash
# Try creating unknown folder
mkdir docs/test-folder
touch docs/test-folder/test.md
git add docs/test-folder

# Try committing (should block)
git commit -m "test"
```

**Note**: `.git/hooks/` is local-only (not committed to repo)

---

## What Happens on Commit

### Scenario 1: Clean Commit (No Violations)

```bash
$ git commit -m "Add new pattern to KDD"

📚 Validating documentation taxonomy...

✓ Documentation taxonomy: CLEAN
  All staged documentation is in known folders.

[main abc1234] Add new pattern to KDD
 1 file changed, 50 insertions(+)
```

**Result**: Commit succeeds

---

### Scenario 2: Unknown Folder Detected (Blocked)

```bash
$ git commit -m "Add new docs"

📚 Validating documentation taxonomy...

❌ ERRORS FOUND: Unknown folders detected

The following folders are not in the documentation taxonomy:

  → docs/random-notes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why this matters:

  Lisa (Librarian) maintains documentation taxonomy to ensure
  all documentation is properly categorized and discoverable.

  Unknown folders create documentation sprawl and make it hard
  for agents and humans to find information.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What to do:

  1. Determine where this documentation should live:

     BMAD Workflow Documentation:
       docs/prd/          - Product requirements
       docs/architecture/ - Technical architecture
       docs/stories/      - Story files
       ...

     KDD (Knowledge-Driven Development):
       docs/kdd/patterns/  - Reusable patterns
       docs/kdd/learnings/ - Story insights
       ...

     POEM Product Documentation:
       docs/poem/           - Product feature guides
       docs/poem/user-guide/ - User getting started

     Transient/Temporary:
       dev-workspace/       - Runtime logs, temp notes (gitignored)

  2. Move the folder to the correct location:

     Example: mv docs/random-notes docs/poem/

  3. OR add this folder to the taxonomy (if it's a new category):

     Edit: .bmad-core/data/documentation-taxonomy.yaml
     Add under: categories.bmad.optional_folders (or kdd/poem)

  4. Re-stage your changes and commit again

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To bypass this check (NOT recommended):

  git commit --no-verify

  Only use --no-verify if you're intentionally adding a new
  documentation category and will update the taxonomy afterwards.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result**: Commit blocked (exit code 1)

---

## Bypassing the Hook (When Intentional)

If you're **intentionally** adding a new documentation category and will update the taxonomy:

```bash
# Bypass validation
git commit --no-verify -m "Add new docs category"

# Then immediately update taxonomy
vim .bmad-core/data/documentation-taxonomy.yaml
# Add new category

# Commit taxonomy update
git add .bmad-core/data/documentation-taxonomy.yaml
git commit -m "Update taxonomy for new category"
```

**When to use `--no-verify`**:
- Adding a legitimate new documentation category
- Taxonomy will be updated in same PR
- You understand the implications

**When NOT to use `--no-verify`**:
- "I don't want to deal with this right now"
- "Lisa is being annoying"
- Unknown folder is actually transient (should be in dev-workspace/)

---

## Integration with Lisa's Workflow

Lisa's pre-commit hook is part of her **expanded role** as Master Documentation Librarian:

**PRIMARY** (Step 7 of AppyDave workflow):
- Extract knowledge from stories after QA passes
- Create patterns, learnings, decisions
- Maintain KDD topology

**SECONDARY** (Whole-repository):
- **Pre-commit validation** ← YOU ARE HERE
- Detect documentation outside taxonomy
- Report holistic health (BMAD + KDD + POEM)
- Validate links across ALL docs/

---

## Commands to Use with Pre-Commit Hook

If hook blocks your commit:

```bash
# 1. Audit what's wrong
/BMad/agents/librarian
*audit-docs

# 2. Detect and categorize unknown items
*detect-unknown

# 3. Fix and retry commit
git add .
git commit -m "Fixed documentation placement"
```

---

## Testing the Hook

**Test 1: Clean commit (should pass)**:
```bash
echo "# Test Pattern" > docs/kdd/patterns/test-pattern.md
git add docs/kdd/patterns/test-pattern.md
git commit -m "test: add pattern" # Should succeed
git reset HEAD~1 # Undo test commit
rm docs/kdd/patterns/test-pattern.md
```

**Test 2: Unknown folder (should block)**:
```bash
mkdir docs/unknown-test
echo "# Test" > docs/unknown-test/test.md
git add docs/unknown-test
git commit -m "test: should block" # Should block with error
rm -rf docs/unknown-test
```

**Test 3: Bypass (should pass)**:
```bash
mkdir docs/unknown-test
echo "# Test" > docs/unknown-test/test.md
git add docs/unknown-test
git commit --no-verify -m "test: bypass" # Should succeed
git reset HEAD~1 # Undo test commit
rm -rf docs/unknown-test
```

---

## Disabling the Hook

If you want to temporarily disable:

**Husky**:
```bash
# Remove hook
rm .husky/pre-commit

# Or set HUSKY=0
HUSKY=0 git commit -m "commit without hooks"
```

**Native git hooks**:
```bash
# Rename hook
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled

# Or use --no-verify
git commit --no-verify -m "commit without hooks"
```

---

## Troubleshooting

### Hook doesn't run

**Check**:
```bash
# Husky installed?
npm list husky

# Hook file exists?
ls -la .husky/pre-commit

# Hook is executable?
ls -l .husky/pre-commit

# Make executable if needed
chmod +x .husky/pre-commit
chmod +x .bmad-core/utils/validate-docs-taxonomy.sh
```

### Hook always passes (doesn't detect violations)

**Check**:
```bash
# Run validation script directly
./.bmad-core/utils/validate-docs-taxonomy.sh

# Check if docs/ changes are staged
git status

# If not staged, hook won't see them
git add docs/
```

### False positives (blocks valid folders)

**Check taxonomy**:
```bash
# View known folders
grep "^  \"docs/" .bmad-core/utils/validate-docs-taxonomy.sh

# Add missing folder to taxonomy
vim .bmad-core/data/documentation-taxonomy.yaml
```

---

## Related Documentation

- **Documentation Taxonomy**: `.bmad-core/data/documentation-taxonomy.yaml`
- **Validation Script**: `.bmad-core/utils/validate-docs-taxonomy.sh`
- **Lisa's Commands**: Run `*help` in `/BMad/agents/librarian`
- **Audit Task**: `.bmad-core/tasks/audit-documentation-taxonomy.md`

---

**Last Updated**: 2026-01-22
**Owner**: Lisa (Master Documentation Librarian)
**Status**: Optional feature (recommended for large teams)
