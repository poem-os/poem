<!-- Powered by BMAD™ Core -->

# Validate KDD Topology Task

## Purpose

To check the health of KDD (Knowledge-Driven Development) documentation structure, validate links, detect orphaned documents, verify index files are current, and identify structural issues. This task implements Lisa's `*validate-topology` command and ensures discoverability and maintenance of knowledge assets.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 0. Pre-Validation Setup

- Load `.bmad-core/core-config.yaml` from the project root
- Load validation rules: `.bmad-core/data/validation-rules.yaml`
- Identify KDD documentation root: `docs/kdd/` (patterns/, learnings/, decisions/)
- Identify examples root: `docs/examples/`
- Initialize health report counters:
  - Total documents scanned
  - Broken links detected (VAL-001)
  - Orphaned documents found
  - Missing index files
  - Directory structure warnings (VAL-003)

### 1. Validate Links (VAL-001: Link Health)

- **For each KDD document** in `docs/kdd/` and `docs/examples/`:
  - Extract all Markdown links: `[text](path)` and `[text](path#anchor)`
  - **For relative links**:
    - Resolve path relative to document location
    - Check if target file exists
    - If file exists and anchor specified, check if anchor exists in target
    - If link broken, record: `{source-file} → {target-path} (BROKEN)`
  - **For absolute links** (external URLs):
    - Skip validation (external link checking is optional, not required)
  - **Ignore internal document anchors** (e.g., `#section-name` without file path)
- **VAL-001 Rule**: 0 broken links (error severity)
- **Graceful degradation**: Report broken links as warnings, not errors (advisory only)

### 2. Check Directory Structure (VAL-003: Directory Limit)

- **For each KDD subdirectory**:
  - Count files in `docs/kdd/patterns/`
  - Count files in `docs/kdd/learnings/`
  - Count files in `docs/kdd/decisions/`
  - Count files in `docs/examples/`
- **VAL-003 Rule**: 20 files per directory (warning severity)
- **If directory has >20 files**:
  - Issue warning: "Directory {path} has {count} files (threshold: 20). Consider subdirectory organization."
  - **For `docs/kdd/learnings/`**, suggest subdirectories:
    - deployment/, debugging/, testing/, ai-integration/, validation/
  - **For `docs/kdd/patterns/`**, suggest grouping by domain:
    - backend/, frontend/, security/, performance/
  - **For `docs/kdd/decisions/`**, suggest grouping by year or component

### 3. Detect Orphaned Documents

- **Orphan definition**: KDD document not linked from any index.md or other KDD document
- **For each KDD document**:
  - Check if document is linked from `{directory}/index.md`
  - Check if document is linked from any other KDD document (cross-references)
  - Check if document is linked from any story file (Knowledge Assets section)
- **If document has zero inbound links**:
  - Report as orphaned: "{path} has no inbound links (orphaned)"
  - Advisory warning, not error (document may be newly created)

### 4. Verify Index Files Exist and Are Current

- **For each KDD subdirectory**:
  - Check if `docs/kdd/patterns/index.md` exists
  - Check if `docs/kdd/learnings/index.md` exists
  - Check if `docs/kdd/decisions/index.md` exists
  - Check if `docs/examples/index.md` exists (if examples directory exists)
- **If index.md does not exist**:
  - Issue warning: "Index file missing: {path}/index.md"
  - Suggest: "Run `*regenerate-indexes` to auto-generate index files"
- **If index.md exists, verify it is current**:
  - Extract list of documents from index.md
  - Compare with actual files in directory
  - If mismatch detected (documents exist but not in index):
    - Issue warning: "Index {path}/index.md is outdated. Missing {count} documents."
    - List missing documents
    - Suggest: "Run `*regenerate-indexes` to update index files"

### 5. Check Metadata Completeness (VAL-005)

- **For each KDD document, verify frontmatter metadata**:
  - Pattern documents require: domain, topic, status, created date
  - Learning documents require: topic, issue, created date, story reference
  - Decision documents require: ADR number, title, status, created date
  - Example documents require: purpose, related patterns (if applicable)
- **VAL-005 Rule**: Required fields present (warning severity)
- **If metadata missing or incomplete**:
  - Issue warning: "{path} missing required metadata fields: {fields}"
  - Advisory only, not blocking

### 6. Generate Health Report

- **Display topology health summary**:
  ```
  📊 KDD Topology Health Report

  Documents Scanned: {total-count}

  Link Health (VAL-001):
  - Total links checked: {link-count}
  - Broken links: {broken-count} ❌
  - Link health score: {(link-count - broken-count) / link-count * 100}%

  Directory Structure (VAL-003):
  - docs/kdd/patterns/: {count} files {⚠️ if >20}
  - docs/kdd/learnings/: {count} files {⚠️ if >20}
  - docs/kdd/decisions/: {count} files
  - docs/examples/: {count} files

  Orphaned Documents:
  - {orphan-count} documents with no inbound links

  Index Files:
  - docs/kdd/patterns/index.md: {EXISTS | MISSING | OUTDATED}
  - docs/kdd/learnings/index.md: {EXISTS | MISSING | OUTDATED}
  - docs/kdd/decisions/index.md: {EXISTS | MISSING | OUTDATED}

  Metadata Completeness (VAL-005):
  - {incomplete-count} documents with incomplete metadata

  Recommendations:
  - {List of suggested actions based on findings}
  ```
- **If broken links detected**: List each broken link with source and target
- **If directories over threshold**: Suggest subdirectory organization
- **If indexes missing or outdated**: Suggest running `*regenerate-indexes`

### 7. Optional: Fix Suggestions

- **If user requests auto-fix** (optional, requires approval):
  - Offer to run `*regenerate-indexes` to update index files
  - Offer to suggest subdirectory organization for >20 files
  - **Do NOT auto-fix broken links** (requires human review)
  - **Do NOT auto-merge orphaned documents** (requires human decision)

## Error Handling

- **If docs/kdd/ directory does not exist**: Create it with subdirectories (patterns/, learnings/, decisions/)
- **If validation-rules.yaml not found**: Use default thresholds (0 broken links, 20 files/dir)
- **If document has parse errors**: Skip and report: "{path} could not be parsed (invalid Markdown)"

## Graceful Degradation

- Broken links reported as warnings, not errors (VAL-001 = advisory)
- Directory structure warnings advisory only (VAL-003 = warning severity)
- Orphaned documents reported but not deleted (human judgment required)
- Metadata incompleteness reported as warnings (VAL-005 = warning severity)

## Notes

- This task is Lisa's quality check command (`*validate-topology`)
- Run topology validation regularly (after each epic, or monthly)
- Topology health is advisory, not blocking (graceful degradation principle)
- Integration with `*regenerate-indexes` command for auto-fixing index issues
