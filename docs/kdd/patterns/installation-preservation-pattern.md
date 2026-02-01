---
# Pattern Template Metadata
domain: "installation"
topic: "file-preservation"
status: "Active"
created: "2026-01-30"
story_reference: "Story 1.9"
pattern_type: "Architectural Pattern"
last_updated: "2026-01-30"
---

# Installation - File Preservation Pattern

> **Pattern Name**: installation-preservation-pattern
> **Type**: Architectural Pattern
> **Status**: Active
> **First Used**: Story 1.9

## Context

**When to use this pattern**:
- CLI tool/framework supports reinstallation to upgrade versions
- Users have configuration files or data that must survive reinstall
- Installation process copies framework files to target directory
- Need to prevent data loss during reinstall

**Problem Statement**:
When users run `npx poem-os install` on an existing POEM installation to upgrade or reconfigure, the installer copies framework files from `packages/poem-core/` to the target directory. Without preservation, user-created files (`.env`, `poem.yaml`, workflow data) would be overwritten or lost.

**Solution**: A `.poem-preserve` file lists paths to preserve during reinstallation. The installer reads this file, backs up preserved files, copies framework files, then restores preserved files.

## Implementation

### Overview
A `.poem-preserve` file in the POEM installation directory lists file patterns (globs) to preserve during reinstallation. The installer:
1. Reads `.poem-preserve`
2. Backs up matching files to temp location
3. Copies framework files (may overwrite)
4. Restores preserved files from backup

### Code Structure
```javascript
// .poem-preserve file format (YAML)
version: 1
preserve:
  - .env                              # Environment variables
  - poem/config/poem.yaml             # User configuration
  - poem/workflows/*/workflow-data/*  # Workflow state
  - poem/workflows/*/prompts/*        # User prompts
  - poem/workflows/*/schemas/*        # User schemas
  - poem/workflows/*/mock-data/*      # Generated mock data

// Preservation workflow (bin/install.js)
async function preserveAndReinstall(targetDir) {
  // 1. Read preservation rules
  const preserveFile = path.join(targetDir, '.poem-preserve');
  const rules = await readPreserveRules(preserveFile);

  // 2. Backup preserved files
  const backupDir = await createTempBackup(targetDir, rules.preserve);

  // 3. Copy framework files (may overwrite)
  await copyFrameworkFiles(targetDir);

  // 4. Restore preserved files
  await restoreFromBackup(backupDir, targetDir);

  // 5. Clean up temp backup
  await fs.rm(backupDir, { recursive: true });
}
```

### Step-by-Step Implementation
1. **Create `.poem-preserve` file**
   - Generate during initial install
   - Use glob patterns for flexibility
   - Document preservation rules for users

2. **Read preservation rules**
   - Parse YAML file
   - Expand glob patterns to file list
   - Handle missing `.poem-preserve` (create default)

3. **Backup preserved files**
   - Create temporary directory
   - Copy matching files to backup
   - Maintain directory structure

4. **Copy framework files**
   - Copy from `packages/poem-core/` to target
   - Overwrite existing framework files
   - May overwrite non-preserved user files (acceptable)

5. **Restore preserved files**
   - Copy from backup to target directory
   - Overwrite any framework files with user versions
   - Clean up temporary backup

6. **Auto-migrate old preserve files**
   - Detect old preserve file format
   - Add missing rules (e.g., workflow-data pattern)
   - Update to current version

### Key Components
- **`.poem-preserve` File**: YAML file with glob patterns to preserve
- **Backup/Restore Logic**: Temporary backup during reinstall
- **Glob Pattern Matching**: Flexible file selection (e.g., `workflows/*/prompts/*`)
- **Auto-migration**: Update old preserve files to current version
- **Default Rules**: Sensible defaults for first install

### Configuration
```yaml
# .poem-preserve (created during install)
version: 1
preserve:
  - .env                              # Environment variables (port, API keys)
  - poem/config/poem.yaml             # User configuration
  - poem/workflows/*/workflow-data/*  # Workflow execution state
  - poem/workflows/*/prompts/*        # User-created prompts
  - poem/workflows/*/schemas/*        # User-created schemas
  - poem/workflows/*/mock-data/*      # Generated mock data
```

Users can edit `.poem-preserve` to add custom preservation rules.

## Examples

### Example 1: Preserve `.env` During Reinstall
Context: User runs `npx poem-os install` to upgrade POEM version

```javascript
// Before reinstall
/target-dir/.env                    # PORT=9500, API_KEY=secret
/target-dir/.poem-preserve          # preserve: [.env]

// Reinstall process
1. Backup .env to /tmp/poem-backup/.env
2. Copy framework files (overwrites everything except .poem-preserve)
3. Restore .env from /tmp/poem-backup/.env

// After reinstall
/target-dir/.env                    # PORT=9500, API_KEY=secret (PRESERVED)
/target-dir/.poem-preserve          # preserve: [.env]
```

**Result**: User's port and API keys survive reinstallation

### Example 2: Preserve Workflow Data
Context: User has multiple workflows with generated mock data

```yaml
# .poem-preserve
version: 1
preserve:
  - poem/workflows/*/workflow-data/*
  - poem/workflows/*/mock-data/*
```

**Files preserved**:
- `poem/workflows/storyline/workflow-data/execution.json`
- `poem/workflows/youtube-optimizer/mock-data/video-metadata.json`

**Result**: Workflow execution state and generated data survive reinstallation

### Example 3: Auto-migrate Old Preserve File
Context: User has old `.poem-preserve` without workflow-data pattern

```javascript
// Old .poem-preserve (version 0)
preserve:
  - .env
  - poem/config/poem.yaml
  - poem/workflows/*/prompts/*

// Auto-migration during reinstall
async function migratePreserveFile(preservePath) {
  const rules = await readPreserveRules(preservePath);

  if (!rules.version || rules.version < 1) {
    // Add missing workflow-data pattern
    rules.preserve.push('poem/workflows/*/workflow-data/*');
    rules.version = 1;

    await writePreserveRules(preservePath, rules);
    console.log('✅ Migrated .poem-preserve to version 1');
  }
}

// New .poem-preserve (version 1)
version: 1
preserve:
  - .env
  - poem/config/poem.yaml
  - poem/workflows/*/prompts/*
  - poem/workflows/*/workflow-data/*  # ADDED
```

**Result**: Old installations automatically get new preservation rules

### Common Variations
- **Variation 1: Preserve user config only**: Minimal preservation for simple tools
- **Variation 2: Preserve all non-framework files**: Aggressive preservation with exclusion list

## Rationale

### Why This Approach?
File-based preservation rules (`.poem-preserve`) provide:
1. **Transparency**: Users can see and edit what's preserved
2. **Flexibility**: Glob patterns handle dynamic file structures (workflows)
3. **Versioning**: Auto-migration when preservation rules change
4. **No database**: Simple file backup/restore, no dependencies

### Benefits
- ✅ Prevents data loss during reinstallation
- ✅ Transparent preservation rules (users can edit `.poem-preserve`)
- ✅ Flexible glob patterns handle dynamic structures
- ✅ Auto-migration when preservation rules evolve
- ✅ Simple implementation (file copy/restore)

### Trade-offs
- ⚠️ Backup/restore adds time to reinstall (~1-2 seconds)
- ⚠️ Temporary backup requires disk space
- ⚠️ Glob patterns can be tricky for users to write correctly

### Alternatives Considered
- **Alternative 1: Never overwrite existing files** - Doesn't allow framework upgrades
- **Alternative 2: Prompt user for each file** - Too much interaction, poor UX
- **Alternative 3: Database-backed state** - Adds dependency, overkill

## Related Patterns

- **[Installation Registry Pattern](./installation-registry-pattern.md)**: Registry metadata preserved via `.env` and `poem.yaml` preservation
- **[Workflow-Scoped Resource Management](./workflow-scoped-resource-management.md)**: Workflow-data preservation enables workflow state persistence

## Testing Considerations

Key test scenarios:
1. **Fresh install**: Creates `.poem-preserve` with default rules
2. **Reinstall with preservation**: User files survive, framework files updated
3. **Missing preserve file**: Installer creates default `.poem-preserve`
4. **Auto-migration**: Old preserve files upgraded to new version
5. **Glob pattern matching**: Wildcards correctly match workflow files
6. **Backup failure**: Graceful error handling if backup directory can't be created

## References

- Story: [Story 1.9](../../stories/1.9.story.md) - Installation preservation system creation
- Commit: `678615e` - Add installation preservation system
- Commit: `4c3636a` - Use preservation system for .env
- Commit: `a0b7728` - Auto-migrate old .poem-preserve files
- Implementation: `bin/install.js` (preserveAndReinstall, migratePreserveFile)
- Format: `.poem-preserve` (YAML file with glob patterns)

---

**Pattern maintained by**: Lisa (Librarian)
**Last reviewed**: 2026-01-30
