# Workflow Installation Bug Fixes

**Date**: 2026-01-30
**Agent**: James (Dev)
**Context**: User-reported bugs in installation workflow

## Bugs Fixed

### Bug #1: Missing `centralPoemPath` Hint

**Problem**: When `centralPoemPath: null`, no hint shown about convention path

**Solution**: Added hint to migration output
- File: `bin/commands/migrate-config.js`
- Change: Display hint `~/dev/ad/poem-os/poem (convention for contributors)` when `centralPoemPath` is null

### Bug #2: Workflow Creation Fails After Migration

**Problem**: "Cannot set properties of undefined (setting 'languish-the-artist')"

**Root Cause**: Migration added `centralPoemPath` field but didn't ensure `workflows` object exists

**Solution**: Ensure `workflows` object exists in two places:
1. Migration script (`bin/commands/migrate-config.js`):
   - Added check to create `workflows: {}` if missing
   - Added check to create `currentWorkflow: null` if missing

2. Add-workflow script (`bin/commands/add-workflow.js`):
   - Added defensive check after loading config
   - Ensures `workflows` object exists before trying to add workflow

### Bug #3: No Duplicate Workflow Detection in Config

**Problem**: Could create workflows with same name without warning, showing existing workflows

**Solution**: Added config-level duplicate detection
- File: `bin/commands/add-workflow.js`
- Change: Check if workflow name exists in `config.workflows` before creation
- Shows list of existing workflows when duplicate detected

### Bug #4: No Workflow Listing Command

**Problem**: Users couldn't see what workflows already exist

**Solution**: Added `list-workflows` command
- New function: `listWorkflows()` in `bin/commands/add-workflow.js`
- New handler: `handleListWorkflows()` in `bin/install.js`
- Updated help text with new command
- Shows all workflows with current workflow marked

### Bug #5: CLAUDE.md Documentation Message Flow

**Problem**: User believed CLAUDE.md message was blocked by workflow prompts

**Status**: Not actually a bug - message already appears in `showSuccessMessage()` before prompts
- Message displays at lines 1125-1129 in `bin/install.js`
- `showSuccessMessage()` called at line 1370, before interactive prompts at line 1373

## Files Modified

1. `bin/commands/migrate-config.js`:
   - Added `workflows` and `currentWorkflow` field creation
   - Added central path hint to output

2. `bin/commands/add-workflow.js`:
   - Added defensive `workflows` object check
   - Added config-level duplicate detection
   - Added workflow listing when duplicates found
   - Added workflow listing after successful creation (if > 1 workflow)
   - Added `listWorkflows()` export function

3. `bin/install.js`:
   - Imported `listWorkflows` function
   - Added `list-workflows` case to command handler
   - Added `handleListWorkflows()` function
   - Updated help text with new command
   - Updated examples section

## Test Results

**Test File**: `bin/commands/test-workflow-bugs.js`

All tests passed:
- ✅ Bug #1: Migration creates workflows field automatically
- ✅ Bug #2: Duplicate workflow detection (directory and config level)
- ✅ Bug #3: List workflows command works
- ✅ Bug #4: Central path hint displays correctly

## New Commands

```bash
# List all existing workflows
npx poem-os list-workflows

# Output example:
# 📁 Existing workflows:
#   1. workflow-a ✓ (current)
#   2. workflow-b
#   3. workflow-c
```

## Migration Output Improvements

**Before**:
```
- centralPoemPath: null
```

**After**:
```
- centralPoemPath: null
  Hint: ~/dev/ad/poem-os/poem (convention for contributors)
```

## Workflow Creation Improvements

**Before** (when duplicate):
```
Creating workflow 'existing'...
❌ Error: Cannot set properties of undefined (setting 'existing')
```

**After** (when duplicate):
```
ℹ  Workflow 'existing' already exists in config. Skipped.

Existing workflows:
  1. workflow-a (current)
  2. existing
```

**After successful creation** (multiple workflows):
```
✅ Workflow 'new-workflow' added. Switch to it: /poem/agents/penny → *switch new-workflow
   Created: poem/workflows/new-workflow/prompts/
   Created: poem/workflows/new-workflow/schemas/
   Created: poem/workflows/new-workflow/mock-data/
   Created: poem/workflows/new-workflow/workflow-state/

All workflows:
  1. workflow-a (current)
  2. existing
  3. new-workflow
```

## User Experience Improvements

1. **Better Error Messages**: Clear feedback when workflows already exist
2. **Workflow Discovery**: Users can list existing workflows before creating new ones
3. **Configuration Hints**: Helpful hints for optional fields (centralPoemPath)
4. **Defensive Programming**: Graceful handling of migration edge cases
5. **Smart Workflow Prompts**: Installation detects and displays existing workflows before asking to add more

### UX Improvement: Show Existing Workflows During Installation

**User Feedback**: When running `npx poem-os install` and workspace already has workflows, the prompt said "add your first workflow" without showing what exists.

**Fixed**: Installation now:
1. Detects existing workflows from `poem.yaml`
2. Displays them with current workflow marked
3. Changes prompt text from "first workflow" to "another workflow"

**Before**:
```
Would you like to add your first workflow now?
  (Creates workflow-specific folders: prompts/, schemas/, mock-data/, workflow-state/)
  [y/N]:
```

**After** (when workflows exist):
```
📁 Existing workflows:
  1. languish-the-artist ✓ (current)

Would you like to add another workflow now?
  (Creates workflow-specific folders: prompts/, schemas/, mock-data/, workflow-state/)
  [y/N]:
```

**Implementation**:
- New function: `getExistingWorkflows(targetDir)` in `bin/install.js`
- Reads `poem/config/poem.yaml` and returns workflow list
- Conditional prompt text based on workflow count
- Visual feedback with current workflow indicator

## Backward Compatibility

All changes are backward compatible:
- Old configs are migrated automatically
- Existing workflows are preserved
- New fields added with sensible defaults
