#!/bin/bash
#
# POEM Development Setup Script
# Sets up the development environment for working on POEM
#

set -e

echo "🚀 POEM Development Setup"
echo "========================="
echo ""

# Check Node.js version
REQUIRED_NODE_MAJOR=20
CURRENT_NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)

if [ -z "$CURRENT_NODE_VERSION" ]; then
    echo "❌ Node.js is not installed. Please install Node.js $REQUIRED_NODE_MAJOR.x or higher."
    exit 1
fi

if [ "$CURRENT_NODE_VERSION" -lt "$REQUIRED_NODE_MAJOR" ]; then
    echo "❌ Node.js $REQUIRED_NODE_MAJOR.x or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Create .env file with POEM_DEV=true if it doesn't exist
ENV_FILE="$PROJECT_ROOT/packages/poem-app/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Creating .env file with POEM_DEV=true..."
    echo "POEM_DEV=true" > "$ENV_FILE"
    echo "✅ Created $ENV_FILE"
else
    # Check if POEM_DEV is already set
    if grep -q "POEM_DEV" "$ENV_FILE"; then
        echo "✅ POEM_DEV already configured in .env"
    else
        echo "📝 Adding POEM_DEV=true to existing .env..."
        echo "" >> "$ENV_FILE"
        echo "# POEM Development Mode" >> "$ENV_FILE"
        echo "POEM_DEV=true" >> "$ENV_FILE"
        echo "✅ Added POEM_DEV=true to $ENV_FILE"
    fi
fi

echo ""

# Create dev-workspace directory structure (idempotent - safe to run multiple times)
echo "📁 Setting up dev-workspace for development testing..."

# Check if dev-workspace has existing validation data
if [ -d "$PROJECT_ROOT/dev-workspace/test-reports" ] && [ "$(ls -A $PROJECT_ROOT/dev-workspace/test-reports 2>/dev/null)" ]; then
    echo "   ⚠️  Found existing validation data - preserving it"
    echo "   (test-reports/, test-runs/, matrices, feedback)"
fi

# Create directories (mkdir -p is safe - won't delete existing files)
mkdir -p "$PROJECT_ROOT/dev-workspace"/{prompts,schemas,mock-data,config,workflow-data,test-reports,test-runs/B72/baseline}

# Generate README.md (always regenerated - this file is disposable)
cat > "$PROJECT_ROOT/dev-workspace/README.md" << 'DEVWORKSPACE_README'
# POEM Dev Workspace

> ⚠️ **IMPORTANT: This folder's STRUCTURE is transient, but VALIDATION DATA is valuable!**
>
> **Safe**: Re-run `./scripts/dev-setup.sh` anytime (preserves existing data)
> **Unsafe**: `rm -rf dev-workspace` (loses validation history!)
>
> Once Victor agent has run, this folder contains real test data. Back it up before deleting.

This directory is the **development testing workspace** for POEM framework developers.

## Purpose

1. **User-generated content** - Prompts, schemas, mock data created during development
2. **Validation artifacts** - Test reports, snapshots, matrices (data from Victor agent runs)

## Directory Structure

```
dev-workspace/
├── prompts/        # Test prompt templates (.hbs files)
├── schemas/        # Test JSON schemas
├── mock-data/      # Test mock data files
├── config/         # Test configuration files
├── workflow-data/  # Workflow state and output
│
├── test-reports/   # Validation reports (Victor agent)
├── test-runs/      # Workflow snapshots for regression testing
│   └── B72/        # B72 YouTube workflow snapshots
├── integration-matrix.md     # Capability integration test results
├── feedback-for-bmad.md      # Strategic feedback for story planning
└── b72-video-testing-guide.md  # B72 workflow testing guide
```

## Important Notes

- This directory is **gitignored** - contents are not committed
- This README is **generated** by `scripts/dev-setup.sh`
- In **production mode**, user content goes to `poem/` instead
- The config service automatically detects which mode you're in

## Mode Detection

| Mode | Detection | User Content Location |
|------|-----------|----------------------|
| Development | `POEM_DEV=true` | `dev-workspace/` |
| Production | `POEM_DEV` not set | `poem/` |

## Documentation

**For guides and documentation**, see the **permanent docs** (not in this transient folder):

- **Workflow Validation Guide**: `docs/guides/workflow-validation-guide.md` - How to use Victor agent
- **Future Enhancements**: `docs/future-enhancements.md` - Upcoming features and Epic 8 tracking
- **BMAD Integration Requirements**: `docs/planning/bmad-integration/capability-validation-requirements.md`

**This folder contains only:**
- Run-specific data (test reports, snapshots, matrices)
- Transient testing content (prompts, schemas, mock data)

## Victor Agent (Workflow Validator)

**Capability Progression Validation** - Product-level QA that validates capabilities across stories:

```bash
# Activate Victor
/poem/agents/workflow-validator

# Run full validation (60-90 min)
*validate

# Quick regression check (10-15 min)
*regression
```

**Artifacts created by Victor** (in this workspace):
- `test-reports/` - Cumulative epic progress reports
- `test-runs/B72/` - Workflow snapshots for regression comparison
- `integration-matrix.md` - Capability integration test results
- `feedback-for-bmad.md` - Strategic feedback for BMAD story planning

**See**: `docs/guides/workflow-validation-guide.md` for complete documentation

## Regenerating This Folder

```bash
# From project root
./scripts/dev-setup.sh

# Or manually
rm -rf dev-workspace && ./scripts/dev-setup.sh
```

## See Also

- **POEM Documentation**: `docs/` - All permanent documentation
- **Path Configuration**: `packages/poem-core/poem-core-config.yaml`
- **Workflow Patterns**: `packages/poem-core/workflows/README.md`
- **Project Guide**: `CLAUDE.md`

---
*Generated by scripts/dev-setup.sh*
*Validation artifacts maintained by Victor agent*
DEVWORKSPACE_README

# Show what was created
echo "✅ Dev-workspace structure ready"
echo "   ├── prompts/"
echo "   ├── schemas/"
echo "   ├── mock-data/"
echo "   ├── config/"
echo "   ├── workflow-data/"
echo "   ├── test-reports/ (Victor validation artifacts)"
echo "   ├── test-runs/B72/ (workflow snapshots)"
echo "   └── README.md (generated)"
echo ""
echo "   ℹ️  This folder is gitignored (not version controlled)"
echo "   ⚠️  VALIDATION DATA is valuable - back up before deleting!"
echo "   ✅  Safe to re-run this script anytime (preserves existing data)"
echo ""
echo "   📚 Documentation: docs/guides/workflow-validation-guide.md"

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""

# Install poem-app dependencies
echo "📦 Installing poem-app dependencies..."
cd "$PROJECT_ROOT/packages/poem-app"
npm install

echo ""

# Sync slash commands from source to .claude/commands/poem/
cd "$PROJECT_ROOT"
echo "🔗 Syncing slash commands..."
COMMANDS_SRC="$PROJECT_ROOT/packages/poem-core/commands"
COMMANDS_DEST="$PROJECT_ROOT/.claude/commands/poem"

if [ -d "$COMMANDS_SRC" ]; then
    # Remove old generated commands
    rm -rf "$COMMANDS_DEST"
    # Copy from source
    mkdir -p "$(dirname "$COMMANDS_DEST")"
    cp -r "$COMMANDS_SRC" "$COMMANDS_DEST"
    echo "✅ Synced slash commands from packages/poem-core/commands/"
else
    echo "⚠️  No commands source found at $COMMANDS_SRC"
fi

echo ""
echo "✅ Development setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the development server:"
echo "      cd packages/poem-app && npm run dev"
echo ""
echo "   2. The server will start at http://localhost:4321"
echo ""
echo "   3. Test Penny (Prompt Engineer):"
echo "      /poem/agents/penny"
echo ""
echo "   4. Validate with Victor (Workflow Validator):"
echo "      /poem/agents/victor"
echo ""
echo "💡 If you edit packages/poem-core/commands/, re-run this script to sync."
echo ""
echo "📖 Documentation:"
echo "   - CLAUDE.md - Project guide"
echo "   - docs/guides/workflow-validation-guide.md - Victor agent guide"
echo "   - docs/future-enhancements.md - Epic 8 and future work"
