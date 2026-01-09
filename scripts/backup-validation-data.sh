#!/bin/bash
#
# Backup POEM Validation Data
# Backs up valuable validation artifacts from dev-workspace
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="$PROJECT_ROOT/validation-backups/backup-$TIMESTAMP"

echo "📦 POEM Validation Data Backup"
echo "=============================="
echo ""

# Check if dev-workspace exists
if [ ! -d "$PROJECT_ROOT/dev-workspace" ]; then
    echo "❌ No dev-workspace found. Nothing to backup."
    exit 1
fi

# Check if validation data exists
if [ ! -d "$PROJECT_ROOT/dev-workspace/test-reports" ] || [ -z "$(ls -A $PROJECT_ROOT/dev-workspace/test-reports 2>/dev/null)" ]; then
    echo "⚠️  No validation data found in dev-workspace."
    echo "   (test-reports/ is empty or doesn't exist)"
    echo ""
    read -p "Continue with backup anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Backup cancelled."
        exit 0
    fi
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "📁 Backing up validation data to:"
echo "   $BACKUP_DIR"
echo ""

# Backup validation artifacts (the valuable stuff)
echo "📋 Backing up test reports..."
if [ -d "$PROJECT_ROOT/dev-workspace/test-reports" ]; then
    cp -r "$PROJECT_ROOT/dev-workspace/test-reports" "$BACKUP_DIR/"
    echo "   ✅ test-reports/"
fi

echo "📸 Backing up workflow snapshots..."
if [ -d "$PROJECT_ROOT/dev-workspace/test-runs" ]; then
    cp -r "$PROJECT_ROOT/dev-workspace/test-runs" "$BACKUP_DIR/"
    echo "   ✅ test-runs/"
fi

echo "🔗 Backing up integration matrix..."
if [ -f "$PROJECT_ROOT/dev-workspace/integration-matrix.md" ]; then
    cp "$PROJECT_ROOT/dev-workspace/integration-matrix.md" "$BACKUP_DIR/"
    echo "   ✅ integration-matrix.md"
fi

echo "💬 Backing up feedback log..."
if [ -f "$PROJECT_ROOT/dev-workspace/feedback-for-bmad.md" ]; then
    cp "$PROJECT_ROOT/dev-workspace/feedback-for-bmad.md" "$BACKUP_DIR/"
    echo "   ✅ feedback-for-bmad.md"
fi

echo "📓 Backing up B72 testing guide..."
if [ -f "$PROJECT_ROOT/dev-workspace/b72-video-testing-guide.md" ]; then
    cp "$PROJECT_ROOT/dev-workspace/b72-video-testing-guide.md" "$BACKUP_DIR/"
    echo "   ✅ b72-video-testing-guide.md"
fi

# Optional: Backup user-created prompts/schemas (if any exist)
if [ -d "$PROJECT_ROOT/dev-workspace/prompts" ] && [ -n "$(ls -A $PROJECT_ROOT/dev-workspace/prompts 2>/dev/null)" ]; then
    echo "✍️  Backing up user prompts..."
    cp -r "$PROJECT_ROOT/dev-workspace/prompts" "$BACKUP_DIR/"
    echo "   ✅ prompts/"
fi

if [ -d "$PROJECT_ROOT/dev-workspace/schemas" ] && [ -n "$(ls -A $PROJECT_ROOT/dev-workspace/schemas 2>/dev/null)" ]; then
    echo "📐 Backing up schemas..."
    cp -r "$PROJECT_ROOT/dev-workspace/schemas" "$BACKUP_DIR/"
    echo "   ✅ schemas/"
fi

if [ -d "$PROJECT_ROOT/dev-workspace/mock-data" ] && [ -n "$(ls -A $PROJECT_ROOT/dev-workspace/mock-data 2>/dev/null)" ]; then
    echo "🎲 Backing up mock data..."
    cp -r "$PROJECT_ROOT/dev-workspace/mock-data" "$BACKUP_DIR/"
    echo "   ✅ mock-data/"
fi

echo ""
echo "✅ Backup complete!"
echo ""
echo "📦 Backup location: $BACKUP_DIR"
echo ""
echo "💡 To restore:"
echo "   cp -r $BACKUP_DIR/* dev-workspace/"
echo ""
echo "🗑️  To clean old backups:"
echo "   rm -rf validation-backups/backup-YYYYMMDD-HHMMSS"
echo ""
