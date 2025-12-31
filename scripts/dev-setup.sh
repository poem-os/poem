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
echo "   3. Test the Prompt Engineer agent:"
echo "      /poem/agents/prompt-engineer"
echo ""
echo "💡 If you edit packages/poem-core/commands/, re-run this script to sync."
echo ""
echo "📖 For more info, see CLAUDE.md"
