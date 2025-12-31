#!/bin/bash
#
# Sync slash commands from source to .claude/commands/poem/
#
# Usage:
#   ./scripts/sync-commands.sh          # One-time sync
#   ./scripts/sync-commands.sh --watch  # Watch mode (auto-sync on changes)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

COMMANDS_SRC="$PROJECT_ROOT/packages/poem-core/commands"
COMMANDS_DEST="$PROJECT_ROOT/.claude/commands/poem"

sync_commands() {
    if [ ! -d "$COMMANDS_SRC" ]; then
        echo "❌ Source not found: $COMMANDS_SRC"
        exit 1
    fi

    rm -rf "$COMMANDS_DEST"
    mkdir -p "$(dirname "$COMMANDS_DEST")"
    cp -r "$COMMANDS_SRC" "$COMMANDS_DEST"

    echo "✅ Synced: packages/poem-core/commands/ → .claude/commands/poem/"
}

# Check for watch mode
if [ "$1" = "--watch" ] || [ "$1" = "-w" ]; then
    echo "👀 Watch mode: monitoring packages/poem-core/commands/"
    echo "   Press Ctrl+C to stop"
    echo ""

    # Initial sync
    sync_commands

    # Check if fswatch is available (macOS)
    if command -v fswatch &> /dev/null; then
        fswatch -o "$COMMANDS_SRC" | while read; do
            echo ""
            echo "🔄 Change detected..."
            sync_commands
        done
    else
        echo "⚠️  fswatch not found. Install with: brew install fswatch"
        echo "   Falling back to polling (checks every 2 seconds)..."
        echo ""

        # Simple polling fallback
        LAST_HASH=""
        while true; do
            CURRENT_HASH=$(find "$COMMANDS_SRC" -type f -exec md5 {} \; 2>/dev/null | md5)
            if [ "$CURRENT_HASH" != "$LAST_HASH" ] && [ -n "$LAST_HASH" ]; then
                echo ""
                echo "🔄 Change detected..."
                sync_commands
            fi
            LAST_HASH="$CURRENT_HASH"
            sleep 2
        done
    fi
else
    # One-time sync
    sync_commands
fi
