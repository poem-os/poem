# POEM Installation Management Guide

This guide explains how POEM installations work and how to manage them for testing and development.

## Table of Contents

- [Understanding POEM Installation Structure](#understanding-poem-installation-structure)
- [What Gets Installed](#what-gets-installed)
- [What Gets Preserved](#what-gets-preserved)
- [Installation Manager Tool](#installation-manager-tool)
- [Testing Workflows](#testing-workflows)
- [Target Locations](#target-locations)

---

## Understanding POEM Installation Structure

POEM uses a **preservation-based installation system** that separates framework files from user data. This allows you to:

- **Reinstall/update** POEM framework without losing user work
- **Test** installations at different locations
- **Clean and reinstall** for testing without data loss

### Directory Layout

```
target-location/
├── .poem-core/              # Framework documents (agents, workflows, templates)
├── .poem-app/               # Runtime server (Astro application)
│   └── .env                 # ✅ PRESERVED - Port and POEM_DEV configuration
├── .claude/commands/poem/   # Slash commands (generated from source)
├── poem/                    # ✅ PRESERVED - User workspace
│   ├── prompts/             # User-created prompt templates (.hbs files)
│   ├── schemas/             # JSON schemas for prompts
│   ├── mock-data/           # Generated mock data for testing
│   ├── workflow-data/       # Workflow execution state
│   └── config/              # User configuration files
├── dev-workspace/           # ✅ PRESERVED - Development testing workspace
│   ├── prompts/             # Test prompts
│   ├── schemas/             # Test schemas
│   ├── mock-data/           # Test mock data
│   ├── test-reports/        # Victor validation artifacts
│   └── test-runs/           # Workflow snapshots
└── .poem-preserve           # ✅ PRESERVED - Preservation rules file
```

---

## What Gets Installed

### Framework Files (Can Be Removed/Reinstalled)

These files are **safe to delete** during testing because they can be regenerated:

1. **`.poem-core/`** - Framework documents
   - Agents (Penny, Victor, etc.)
   - Workflows (except custom workflows)
   - Templates
   - Data files
   - Skills

2. **`.poem-app/`** - Runtime server (except `.env`)
   - Astro application
   - Services and components
   - `node_modules/` dependencies
   - ❗ **EXCEPTION**: `.env` is preserved

3. **`.claude/commands/poem/`** - Slash commands
   - Generated from `packages/poem-core/commands/`
   - Safe to delete and regenerate

### Framework Workflows (Specific Files)

These workflow files in `.poem-core/workflows/` are framework files (can be overwritten):

- `create-prompt.yaml`
- `refine-prompt.yaml`
- `test-prompt.yaml`
- `validate-prompt.yaml`
- `deploy-prompt.yaml`
- `add-helper.yaml`
- `create-provider.yaml`

**All other `.yaml` files** in `.poem-core/workflows/` are considered **custom workflows** and will be preserved.

---

## What Gets Preserved

### User Data (NEVER Overwritten)

These files/folders are **protected** during reinstallation:

1. **`poem/`** - User workspace
   - All prompts, schemas, mock data
   - Workflow execution state
   - User configuration
   - **Always preserved**, even if empty

2. **`dev-workspace/`** - Development workspace
   - Test prompts and schemas
   - Validation artifacts (test-reports/, test-runs/)
   - Integration matrices
   - **Always preserved** if it exists

3. **`.poem-app/.env`** - Configuration
   - `PORT=` server port
   - `POEM_DEV=true` development mode flag
   - **Always preserved**

4. **`.poem-preserve`** - Preservation rules
   - Defines what gets preserved
   - Auto-migrated if missing required rules
   - **Always preserved**

5. **Custom workflows** - User-created workflows
   - Any `.yaml` files in `.poem-core/workflows/` that aren't in framework list
   - **Automatically detected and preserved**

### How Preservation Works

The installer uses `.poem-preserve` to determine what to skip:

```
# .poem-preserve
# Files/folders protected from overwriting during POEM installation

# User workspace - always preserved
poem/

# Dev workspace - always preserved (if exists)
dev-workspace/

# User configuration - always preserved
.poem-app/.env

# Add custom preservation rules below:
# .poem-core/my-custom-workflow.yaml
```

**Rules:**
- **Directory rules** end with `/` (preserves entire directory)
- **File rules** are exact paths (preserves single file)
- Comments start with `#`
- Blank lines are ignored

---

## Installation Manager Tool

The `scripts/manage-installation.sh` tool helps manage POEM installations at test locations.

### Target Shortcuts

The tool includes predefined shortcuts for your common target locations:

```bash
./scripts/manage-installation.sh targets
```

**Available shortcuts:**
- `ss`, `supportsignal` → SupportSignal prompt system
- `voz` → vOz video project
- `ad`, `appydave` → AppyDave video project
- `poem` → POEM development workspace

**Usage:**
```bash
# Use shortcuts instead of full paths
./scripts/manage-installation.sh analyze ss
./scripts/manage-installation.sh backup voz
./scripts/manage-installation.sh clean ad

# Full paths still work
./scripts/manage-installation.sh analyze ~/dev/clients/supportsignal/prompt.supportsignal.com.au
```

**Customizing shortcuts:**
Edit the `TARGET_LOCATIONS` variable at the top of the script to add your own shortcuts:

```bash
# Format: "shortcut:description:path"
TARGET_LOCATIONS="
ss:SupportSignal:$HOME/dev/clients/supportsignal/prompt.supportsignal.com.au
myproject:MyProject:$HOME/dev/myproject
"
```

### Commands

#### 0. List Target Shortcuts

Shows all available target shortcuts and their paths.

```bash
./scripts/manage-installation.sh targets
# or
./scripts/manage-installation.sh list
```

**Output:**
- All configured shortcuts
- Full paths they resolve to
- Status indicator (✓ exists, ✗ missing)
- Usage examples

**Example:**
```bash
./scripts/manage-installation.sh targets
```

#### 1. Analyze Installation

Shows what would be installed/preserved without making changes.

```bash
./scripts/manage-installation.sh analyze <target-dir>
```

**Output:**
- Installation status (what's installed)
- User data inventory (what would be preserved)
- Framework files inventory (what would be updated)

**Examples:**
```bash
# Using shortcut
./scripts/manage-installation.sh analyze ss

# Using full path
./scripts/manage-installation.sh analyze ~/dev/clients/supportsignal/prompt.supportsignal.com.au
```

#### 2. Clean Installation

Removes framework files while preserving user data. **Perfect for testing reinstallation.**

```bash
./scripts/manage-installation.sh clean <target-dir> [--dry-run]
```

**Dry Run (Preview):**

Before actually cleaning, see what would happen:

```bash
# Preview what will be removed and preserved
./scripts/manage-installation.sh clean ss --dry-run
```

**Output shows:**
- **What will be removed:** Directories only (`.poem-core/`, `.poem-app/`, slash commands)
- **What will be preserved:** User directories (poem/, dev-workspace/, custom workflows, .env)
- No files are actually removed

**What it does:**
1. Backs up `.env` to temp file
2. Backs up custom workflows to temp directory
3. Removes `.poem-core/`, `.poem-app/`, `.claude/commands/poem/`
4. Restores `.env` and custom workflows
5. Leaves `poem/`, `dev-workspace/`, `.poem-preserve` untouched

**Examples:**
```bash
# Preview first (recommended)
./scripts/manage-installation.sh clean ss --dry-run

# Then actually clean
./scripts/manage-installation.sh clean ss

# Or use full path
./scripts/manage-installation.sh clean ~/dev/video-projects/v-voz --dry-run
```

#### 3. Backup User Data

Creates a timestamped `.tar.gz` archive of all user data.

```bash
./scripts/manage-installation.sh backup <target-dir>
```

**What it backs up:**
- `poem/` workspace
- `dev-workspace/` (if exists)
- `.poem-app/.env` configuration
- `.poem-preserve` rules
- Custom workflows

**Output:** `poem-backup-YYYYMMDD-HHMMSS.tar.gz`

**Examples:**
```bash
# Using shortcut
./scripts/manage-installation.sh backup ad

# Using full path
./scripts/manage-installation.sh backup ~/dev/video-projects/v-appydave
```

#### 4. Validate Preservation

Checks `.poem-preserve` file and validates rules.

```bash
./scripts/manage-installation.sh validate <target-dir>
```

**What it checks:**
- `.poem-preserve` file exists
- Required rules present (`poem/`, `dev-workspace/`, `.poem-app/.env`)
- Files/directories referenced by rules
- Warns about missing required rules (auto-fixed during installation)

**Examples:**
```bash
# Using shortcut
./scripts/manage-installation.sh validate ss

# Using full path
./scripts/manage-installation.sh validate ~/dev/clients/supportsignal/prompt.supportsignal.com.au
```

#### 5. Show Info

Displays installation information and statistics.

```bash
./scripts/manage-installation.sh info <target-dir>
```

**What it shows:**
- Installed components
- Configuration (port, dev mode)
- User workspace statistics (prompt count, schema count)
- Custom workflow count
- Preservation rules count

**Examples:**
```bash
# Using shortcut
./scripts/manage-installation.sh info voz

# Using full path
./scripts/manage-installation.sh info ~/dev/video-projects/v-voz
```

---

## Testing Workflows

### Workflow 1: Test Fresh Reinstall

**Goal:** Verify that reinstallation preserves user data correctly.

```bash
# Using shortcuts (recommended)
# 1. Analyze current state
./scripts/manage-installation.sh analyze ss

# 2. Create backup (safety net)
./scripts/manage-installation.sh backup ss

# 3. Clean installation (remove framework, keep user data)
./scripts/manage-installation.sh clean ss

# 4. Reinstall POEM
cd ~/dev/clients/supportsignal/prompt.supportsignal.com.au
npx poem-os install

# 5. Verify user data is intact
./scripts/manage-installation.sh info ss
```

### Workflow 2: Test With New Features

**Goal:** Test new POEM features without affecting production installations.

```bash
# 1. Create backup of production installation
./scripts/manage-installation.sh backup ~/path/to/production

# 2. Clean installation
./scripts/manage-installation.sh clean ~/path/to/production

# 3. Install development version
cd ~/dev/ad/poem-os/poem
npm run build  # Build latest changes
cd ~/path/to/production
npx /path/to/poem-os/poem install

# 4. Test new features...

# 5. If needed, restore from backup
cd ~/path/to/production
tar -xzf poem-backup-YYYYMMDD-HHMMSS.tar.gz
rm -rf poem dev-workspace .poem-app/.env
mv poem-backup-YYYYMMDD-HHMMSS/* .
```

### Workflow 3: Clean Slate Testing

**Goal:** Test installation from scratch while keeping backups.

```bash
# 1. Full backup
./scripts/manage-installation.sh backup ~/path/to/target

# 2. Remove everything (including user data)
cd ~/path/to/target
rm -rf .poem-core .poem-app poem dev-workspace .claude .poem-preserve

# 3. Fresh install
npx poem-os install

# 4. Test with clean slate...

# 5. Restore original data if needed
tar -xzf poem-backup-YYYYMMDD-HHMMSS.tar.gz
# ... restore files
```

---

## Target Locations

### Built-in Shortcuts

The tool includes built-in shortcuts for common test locations. Use the `targets` command to see all available shortcuts:

```bash
./scripts/manage-installation.sh targets
```

**Current shortcuts:**
- `ss`, `supportsignal` → SupportSignal client project (prompt system)
- `voz` → vOz video project
- `ad`, `appydave` → AppyDave video project
- `poem` → POEM development workspace

### Typical Workflows by Location

#### 1. SupportSignal (ss)

**Use case:** Production-like environment for testing prompt engineering workflows.

```bash
# Quick workflow
./scripts/manage-installation.sh analyze ss
./scripts/manage-installation.sh backup ss
./scripts/manage-installation.sh clean ss
cd ~/dev/clients/supportsignal/prompt.supportsignal.com.au && npx poem-os install
```

#### 2. vOz (voz)

**Use case:** Video content workflow testing.

```bash
# Quick workflow
./scripts/manage-installation.sh info voz
./scripts/manage-installation.sh backup voz
./scripts/manage-installation.sh clean voz
cd ~/dev/video-projects/v-voz && npx poem-os install
```

#### 3. AppyDave (ad)

**Use case:** Testing POEM with AppyDave brand workflows.

```bash
# Quick workflow
./scripts/manage-installation.sh validate ad
./scripts/manage-installation.sh backup ad
./scripts/manage-installation.sh clean ad
cd ~/dev/video-projects/v-appydave && npx poem-os install
```

### Adding Custom Shortcuts

Edit `TARGET_LOCATIONS` at the top of the script:

```bash
# Format: "shortcut:description:path"
TARGET_LOCATIONS="
ss:SupportSignal:$HOME/dev/clients/supportsignal/prompt.supportsignal.com.au
voz:vOz:$HOME/dev/video-projects/v-voz
ad:AppyDave:$HOME/dev/video-projects/v-appydave
poem:POEM:$HOME/dev/ad/poem-os/poem
myproject:MyProject:$HOME/dev/myproject  # Add your own here
"
```

### Optional: Shell Alias for Convenience

While shortcuts are built-in, you can add a shell alias for even faster access:

```bash
# Add to ~/.zshrc or ~/.bashrc
alias poem-dev-helper='~/dev/ad/poem-os/poem/scripts/manage-installation.sh'

# Usage becomes even shorter
poem-dev-helper analyze ss
poem-dev-helper backup voz
poem-dev-helper clean ad
poem-dev-helper targets
```

**Alternative short aliases:**
```bash
# If you prefer something shorter
alias pdh='~/dev/ad/poem-os/poem/scripts/manage-installation.sh'
alias pmi='~/dev/ad/poem-os/poem/scripts/manage-installation.sh'  # POEM Manager Install
```

---

## Understanding Dry Runs

There are two ways to preview what will happen:

### 1. `analyze` - Full Analysis

Shows detailed statistics about the installation:

```bash
poem-dev-helper analyze ss
```

**Shows:**
- Installation status (what's installed)
- User data inventory with file counts
- Framework files inventory with file counts
- Custom workflow detection

**Use when:** You want to understand the current state in detail.

### 2. `clean --dry-run` - Preview Removal

Shows exactly what `clean` will remove and preserve:

```bash
poem-dev-helper clean ss --dry-run
```

**Shows:**
- **Directories that will be removed** (no file-by-file detail)
- **Directories that will be preserved** (poem/, dev-workspace/, etc.)
- **Specific preserved items** (.env, custom workflows with count)

**Use when:** You want to verify `clean` won't remove user data.

### Comparison

| Command | Detail Level | Use Case |
|---------|--------------|----------|
| `analyze` | High (file counts, stats) | Understanding installation state |
| `clean --dry-run` | Low (directory-level) | Confirming safety before clean |

**Recommended workflow:**

```bash
# 1. Understand the installation
poem-dev-helper analyze ss

# 2. Preview what clean will do
poem-dev-helper clean ss --dry-run

# 3. Actually clean
poem-dev-helper clean ss
```

---

## Quick Reference

With `poem-dev-helper` alias configured:

```bash
# List all target shortcuts
poem-dev-helper targets

# Analyze before making changes
poem-dev-helper analyze ss

# Backup user data (safety first!)
poem-dev-helper backup voz

# Clean for testing (removes framework, keeps user data)
poem-dev-helper clean ad

# Validate preservation rules
poem-dev-helper validate ss

# Show installation info
poem-dev-helper info voz
```

**Most common workflow:**
```bash
poem-dev-helper backup ss && \
poem-dev-helper clean ss && \
cd ~/dev/clients/supportsignal/prompt.supportsignal.com.au && \
npx poem-os install
```

---

## Git Integration

The `clean` command is **git-aware by design** - it only removes gitignored files.

### What's Gitignored?

In a properly configured POEM installation, these are gitignored:

```gitignore
# Generated framework files (safe to remove)
.poem-core/
.poem-app/
.claude/commands/poem/

# User-specific data (preserved by clean)
poem/
dev-workspace/
```

### Testing Workflow from Git Perspective

```bash
# 1. Check git is clean
cd ~/dev/clients/supportsignal/prompt.supportsignal.com.au
git status  # Should be clean

# 2. Preview clean (shows only directories)
poem-dev-helper clean ss --dry-run

# 3. Clean (removes only gitignored files)
poem-dev-helper clean ss

# 4. Check git status again
git status  # Still clean! (removed files were gitignored)

# 5. Reinstall
npx poem-os install

# 6. Verify git is still clean
git status  # Still clean! (installed files are gitignored)
```

### Benefits

✓ **No git noise** - Clean testing without affecting git status
✓ **Safe removal** - Only gitignored framework files removed
✓ **User data protected** - Local work stays gitignored and preserved
✓ **Zero commits needed** - Test installations without git distractions

### If `.gitignore` is Missing

If your target location doesn't have `.gitignore` configured:

```bash
# Add POEM entries to .gitignore
cat >> .gitignore << 'EOF'
# POEM Installation (generated files)
.poem-core/
.poem-app/
.claude/commands/poem/
poem/
dev-workspace/
EOF
```

---

## Best Practices

### 1. Always Backup Before Testing

```bash
./scripts/manage-installation.sh backup <target>
```

### 2. Use `analyze` Before `clean`

```bash
./scripts/manage-installation.sh analyze <target>
./scripts/manage-installation.sh clean <target>
```

### 3. Validate Preservation Rules

```bash
./scripts/manage-installation.sh validate <target>
```

### 4. Check Installation Info After Reinstall

```bash
cd <target> && npx poem-os install
./scripts/manage-installation.sh info <target>
```

### 5. Keep Backups Organized

```bash
# Move backups to dedicated directory
mkdir -p ~/backups/poem
mv ~/path/to/target/poem-backup-*.tar.gz ~/backups/poem/
```

---

## Troubleshooting

### Problem: User data was lost during reinstall

**Solution:** Check if `.poem-preserve` exists and has required rules:

```bash
./scripts/manage-installation.sh validate <target>
```

If rules are missing, run `npx poem-os install` again - it will auto-migrate.

### Problem: Custom workflow was overwritten

**Cause:** Workflow filename matches a framework workflow name.

**Solution:** Rename your custom workflow to avoid conflict:

```bash
# Framework workflows (avoid these names)
create-prompt.yaml
refine-prompt.yaml
test-prompt.yaml
validate-prompt.yaml
deploy-prompt.yaml
add-helper.yaml
create-provider.yaml

# Use custom names instead
my-custom-workflow.yaml
team-workflow.yaml
supportsignal-workflow.yaml
```

### Problem: `.env` configuration was lost

**Cause:** `.poem-preserve` is missing or doesn't include `.poem-app/.env` rule.

**Solution:**

1. Check preservation file:
   ```bash
   ./scripts/manage-installation.sh validate <target>
   ```

2. If missing, add manually:
   ```bash
   echo ".poem-app/.env" >> <target>/.poem-preserve
   ```

3. Or reinstall (auto-migration will add it):
   ```bash
   cd <target> && npx poem-os install
   ```

### Problem: Port conflict after reinstall

**Solution:** Check registry and resolve conflict:

```bash
npx poem-os registry --list
npx poem-os config --port <new-port>
```

---

## Registry Management

POEM maintains a global registry at `~/.poem/registry.json` that tracks all installations.

### List All Installations

```bash
npx poem-os registry --list
```

### Check Installation Health

```bash
npx poem-os registry --health
```

Updates registry with current status (checks if directories exist).

### Clean Up Stale Entries

```bash
npx poem-os registry --cleanup
```

Removes installations that no longer exist.

### Update Port for Installation

```bash
cd <target>
npx poem-os config --port <new-port>
```

---

## Advanced Usage

### Testing Multiple Installations

```bash
# Set up multiple test locations
LOCATIONS=(
  ~/dev/clients/supportsignal/prompt.supportsignal.com.au
  ~/dev/video-projects/v-voz
  ~/dev/video-projects/v-appydave
)

# Backup all
for loc in "${LOCATIONS[@]}"; do
  ./scripts/manage-installation.sh backup "$loc"
done

# Clean all
for loc in "${LOCATIONS[@]}"; do
  ./scripts/manage-installation.sh clean "$loc"
done

# Reinstall all
for loc in "${LOCATIONS[@]}"; do
  (cd "$loc" && npx poem-os install --force)
done
```

### Custom Preservation Rules

Add project-specific rules to `.poem-preserve`:

```bash
# .poem-preserve

# Standard rules (always included)
poem/
dev-workspace/
.poem-app/.env

# Custom workflows (add your own)
.poem-core/workflows/my-team-workflow.yaml
.poem-core/workflows/supportsignal-prompts.yaml

# Custom templates (if you create them)
.poem-core/templates/my-custom-template.hbs

# Project-specific config
poem/config/my-custom-config.yaml
```

---

## See Also

- **Installation Guide**: `docs/architecture.md` - Complete architecture documentation
- **POEM Configuration**: `packages/poem-core/poem-core-config.yaml` - Workspace paths
- **Preservation System**: `bin/preservation.js` - Preservation implementation
- **Install Script**: `bin/install.js` - Installation implementation

---

**Last Updated:** 2026-01-23
