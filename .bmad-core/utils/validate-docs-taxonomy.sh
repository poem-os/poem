#!/bin/bash
# Documentation Taxonomy Validator (Pre-Commit Hook)
#
# Purpose: Validate documentation against taxonomy BEFORE commit
# Scope: docs/ folder only
# Owner: Lisa (Librarian)
#
# Exit codes:
# 0 = Clean or warnings only (allows commit)
# 1 = Errors found (blocks commit)

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Config
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
TAXONOMY_FILE="$PROJECT_ROOT/.bmad-core/data/documentation-taxonomy.yaml"
DOCS_DIR="$PROJECT_ROOT/docs"

# Known folders from taxonomy (BMAD + KDD + POEM)
KNOWN_FOLDERS=(
  # BMAD
  "docs/prd"
  "docs/architecture"
  "docs/stories"
  "docs/qa"
  "docs/backlog"
  "docs/planning"

  # KDD
  "docs/kdd"
  "docs/kdd/patterns"
  "docs/kdd/learnings"
  "docs/kdd/decisions"

  # POEM
  "docs/poem"
  "docs/poem/user-guide"
  "docs/poem/examples"
)

# Check if taxonomy file exists
if [[ ! -f "$TAXONOMY_FILE" ]]; then
  echo -e "${RED}❌ ERROR: Documentation taxonomy not found${NC}"
  echo "   Expected: $TAXONOMY_FILE"
  echo ""
  echo "   This file defines the known documentation structure."
  echo "   If you're setting up POEM for the first time, this is expected."
  exit 1
fi

# Check if docs/ exists
if [[ ! -d "$DOCS_DIR" ]]; then
  # No docs/ folder = nothing to validate
  exit 0
fi

# Get list of staged files in docs/ (only check what's being committed)
STAGED_DOCS=$(git diff --cached --name-only --diff-filter=ACM | grep "^docs/" || true)

if [[ -z "$STAGED_DOCS" ]]; then
  # No documentation changes staged
  exit 0
fi

echo -e "${BLUE}📚 Validating documentation taxonomy...${NC}"
echo ""

# Extract unique folders from staged files
STAGED_FOLDERS=$(echo "$STAGED_DOCS" | xargs -I {} dirname {} | sort -u)

# Check for unknown folders
UNKNOWN_FOLDERS=()
ERRORS_FOUND=0

for folder in $STAGED_FOLDERS; do
  # Normalize folder path (remove trailing slash)
  folder="${folder%/}"

  # Check if folder or any parent is in KNOWN_FOLDERS
  FOLDER_KNOWN=0

  for known in "${KNOWN_FOLDERS[@]}"; do
    # Check exact match or if folder is a subdirectory of known folder
    if [[ "$folder" == "$known" ]] || [[ "$folder" == "$known"/* ]]; then
      FOLDER_KNOWN=1
      break
    fi
  done

  if [[ $FOLDER_KNOWN -eq 0 ]]; then
    # Unknown folder detected
    UNKNOWN_FOLDERS+=("$folder")
    ERRORS_FOUND=1
  fi
done

# Report results
if [[ ${#UNKNOWN_FOLDERS[@]} -gt 0 ]]; then
  echo -e "${RED}❌ ERRORS FOUND: Unknown folders detected${NC}"
  echo ""
  echo "The following folders are not in the documentation taxonomy:"
  echo ""

  for folder in "${UNKNOWN_FOLDERS[@]}"; do
    echo -e "  ${RED}→${NC} $folder"
  done

  echo ""
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}Why this matters:${NC}"
  echo ""
  echo "  Lisa (Librarian) maintains documentation taxonomy to ensure"
  echo "  all documentation is properly categorized and discoverable."
  echo ""
  echo "  Unknown folders create documentation sprawl and make it hard"
  echo "  for agents and humans to find information."
  echo ""
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}What to do:${NC}"
  echo ""
  echo "  1. Determine where this documentation should live:"
  echo ""
  echo "     ${GREEN}BMAD Workflow Documentation:${NC}"
  echo "       docs/prd/          - Product requirements"
  echo "       docs/architecture/ - Technical architecture"
  echo "       docs/stories/      - Story files"
  echo "       docs/qa/           - QA assessments"
  echo "       docs/backlog/      - Quick fixes"
  echo "       docs/planning/     - Historical (pre-BMAD)"
  echo ""
  echo "     ${GREEN}KDD (Knowledge-Driven Development):${NC}"
  echo "       docs/kdd/patterns/  - Reusable patterns"
  echo "       docs/kdd/learnings/ - Story insights"
  echo "       docs/kdd/decisions/ - Architecture decisions (ADRs)"
  echo ""
  echo "     ${GREEN}POEM Product Documentation:${NC}"
  echo "       docs/poem/           - Product feature guides"
  echo "       docs/poem/user-guide/ - User getting started"
  echo ""
  echo "     ${GREEN}Transient/Temporary:${NC}"
  echo "       dev-workspace/       - Runtime logs, temp notes (gitignored)"
  echo ""
  echo "  2. Move the folder to the correct location:"
  echo ""
  echo "     ${GREEN}Example:${NC} mv docs/unknown-folder docs/poem/"
  echo ""
  echo "  3. OR add this folder to the taxonomy (if it's a new category):"
  echo ""
  echo "     Edit: .bmad-core/data/documentation-taxonomy.yaml"
  echo "     Add under: categories.bmad.optional_folders (or kdd/poem)"
  echo ""
  echo "  4. Re-stage your changes and commit again"
  echo ""
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}To bypass this check (NOT recommended):${NC}"
  echo ""
  echo "  git commit --no-verify"
  echo ""
  echo "  Only use --no-verify if you're intentionally adding a new"
  echo "  documentation category and will update the taxonomy afterwards."
  echo ""
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  exit 1
else
  echo -e "${GREEN}✓ Documentation taxonomy: CLEAN${NC}"
  echo "  All staged documentation is in known folders."
  echo ""
  exit 0
fi
