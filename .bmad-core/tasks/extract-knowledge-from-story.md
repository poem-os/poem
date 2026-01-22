<!-- Powered by BMAD™ Core -->

# Extract Knowledge from Story Task

## Purpose

To extract learnings, patterns, and knowledge assets from completed stories after QA passes, create structured KDD (Knowledge-Driven Development) documentation using templates, maintain topology health, and update the story with links to created knowledge assets. This task implements Lisa's core `*curate` command and is Step 7 of the AppyDave workflow.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 0. Pre-Curation Checks

- **Verify this task is called AFTER Quinn (QA) passes review**
- Load `.bmad-core/core-config.yaml` from the project root
- If the file does not exist, HALT and inform the user: "core-config.yaml not found. Cannot proceed with knowledge curation."
- Extract key configurations: `devStoryLocation`, `qa.qaLocation`
- Load taxonomy: `.bmad-core/data/kdd-taxonomy.yaml`
- Load validation rules: `.bmad-core/data/validation-rules.yaml`

### 1. Load Story File and QA Results

- **Story file location**: `{devStoryLocation}/{story-number}.story.md`
- If story file does not exist, HALT and inform user: "Story file not found at {path}. Please verify story number."
- Read the following story sections:
  - Status (verify it is "Review" or "Done")
  - Dev Agent Record → Completion Notes List (learnings, decisions, challenges)
  - Dev Agent Record → Debug Log References (issues encountered, resolutions)
  - Dev Agent Record → File List (implementation files changed)
  - QA Results (test outcomes, quality concerns, pattern violations)
  - SAT results if available (acceptance test findings)
- **If story status is not "Review" or "Done"**: HALT and inform user: "Story status is '{status}'. Knowledge curation should only happen after QA review passes (status: Review or Done)."

### 2. Extract Learnings from Dev Agent Record

- **Analyze Completion Notes List**:
  - Identify technical decisions made during implementation
  - Note any deviations from original plan
  - Extract challenges encountered and how they were resolved
  - Document performance optimizations or refactoring insights
- **Analyze Debug Log References**:
  - Identify recurring issues or bugs discovered
  - Document root causes and solutions
  - Note prevention strategies for future stories
- **Categorize learnings by type** (reference kdd-taxonomy.yaml):
  - **Pattern** (reusable code/architectural patterns used in 3+ stories)
  - **Learning** (story-specific insights, debugging sessions, incidents)
  - **Decision** (architectural decisions that warrant ADR documentation)
  - **Example** (working code demonstrations worth preserving)

### 3. Extract Patterns from Implementation

- **Review File List** from Dev Agent Record:
  - Identify code conventions used (naming, structure, error handling)
  - Extract architectural patterns (component structure, data flow)
  - Document reusable validation logic (password validation, email validation, input sanitization)
- **Cross-reference with Quinn's QA Results**:
  - If Quinn flagged pattern inconsistencies, document the pattern
  - If Quinn noted "No pattern documented for [domain]", create pattern document
  - Extract expected vs actual pattern implementations
- **Determine if pattern promotion is warranted**:
  - Has this pattern been used in 3+ stories? → Create pattern document
  - Is this a first-use pattern? → Create learning document, track for promotion

### 4. Identify Anti-Patterns or Lessons Learned

- **Review QA Results for concerns**:
  - Pattern deviations or inconsistencies
  - Code quality issues (duplicate code, complexity)
  - Test coverage gaps
  - Security or performance concerns
- **Analyze Debug Log for recurring issues**:
  - Check if similar issues appeared in previous stories (reference detect-recurring-issues task)
  - Document signature: error message patterns, affected components, triggering conditions
  - If recurrence detected (60%+ signature match), create lesson document
- **Document prevention strategies**:
  - What should future stories do differently?
  - What pre-checks should Quinn add to review-story task?

### 5. Create/Update KDD Documentation Using Templates

- **For each identified knowledge asset, create document**:

  **Pattern Documents** (`docs/kdd/patterns/`):
  - Use template: `.bmad-core/templates/pattern-tmpl.md`
  - Filename: `{domain}-{topic}-pattern.md` (e.g., `password-validation-pattern.md`)
  - Sections: Context, Implementation, Examples, Rationale, Related Patterns
  - Include story reference: "First used in Story {number}"

  **Learning Documents** (`docs/kdd/learnings/`):
  - Use template: `.bmad-core/templates/learning-tmpl.md`
  - Filename: `{topic}-{issue}-kdd.md` (e.g., `deployment-cors-issue-kdd.md`)
  - Sections: Problem Signature, Root Cause, Solution, Prevention, Related Incidents
  - Subdirectories triggered when directory has 15+ files: deployment/, debugging/, testing/, ai-integration/, validation/

  **Decision Documents** (`docs/kdd/decisions/`):
  - Use template: `.bmad-core/templates/decision-adr-tmpl.md`
  - Filename: `adr-NNN-{decision-name}.md` (sequential numbering, find highest ADR number first)
  - Sections: Status, Context, Decision, Alternatives, Rationale, Consequences
  - ADR format: RFC-compliant Architecture Decision Record

  **Example Documents** (`docs/examples/`):
  - Use template: `.bmad-core/templates/example-tmpl.md`
  - Structure: Single file or subdirectory with README.md for complex examples
  - Sections: Purpose, Setup, Implementation, Related Patterns

### 6. Maintain Topology (Update Indexes, Cross-Links)

- **Update index.md files**:
  - If `docs/kdd/patterns/index.md` does not exist, create it (use generate-indexes task)
  - Add newly created pattern/learning/decision to appropriate index
  - Include: Title, Brief Description, Story Reference, Link
- **Add cross-links**:
  - Link related patterns (e.g., "See also: [Email Validation Pattern](./email-validation-pattern.md)")
  - Link decisions to affected patterns
  - Link learnings to related incidents
- **Check for broken links** (VAL-001):
  - Validate all links in created documents
  - Report any broken links as warnings (not errors)
- **Detect directory structure issues** (VAL-003):
  - If `docs/kdd/learnings/` has >20 files, suggest subdirectory creation
  - Recommend: deployment/, debugging/, testing/, ai-integration/, validation/

### 7. Update Story with Knowledge Asset Links

- **Add "Knowledge Assets" section to story file** (if it doesn't exist):
  ```markdown
  ## Knowledge Assets

  Documentation created from this story:
  - Pattern: [Password Validation Pattern](../../kdd/patterns/password-validation-pattern.md)
  - Learning: [CORS Issue Resolution](../../kdd/learnings/deployment/cors-issue-kdd.md)
  - Decision: [ADR-042: Use JWT for Authentication](../../kdd/decisions/adr-042-jwt-authentication.md)
  ```
- **Update story file** at `{devStoryLocation}/{story-number}.story.md`:
  - Append Knowledge Assets section BEFORE "Dev Agent Record" section
  - List all created KDD documents with relative links
  - Include document type (Pattern, Learning, Decision, Example)

### 8. Validate Created Documentation

- **Run knowledge curation checklist** (execute-checklist task with knowledge-curation-checklist.md):
  - [ ] Documentation extracted from story
  - [ ] Templates used correctly
  - [ ] Links validated (no broken links)
  - [ ] Indexes updated
  - [ ] Story updated with knowledge asset links
  - [ ] Topology health checked
- **Run duplicate detection** (optional, advisory):
  - Execute detect-semantic-duplicates task on created documents
  - If 70%+ similarity with existing docs, suggest consolidation (human approval required)
- **Display curation summary**:
  ```
  ✅ Knowledge curation complete for Story {number}

  Created:
  - {count} Pattern documents
  - {count} Learning documents
  - {count} Decision documents (ADRs)
  - {count} Example documents

  Topology Health:
  - Links validated: {broken-count} broken links (VAL-001)
  - Directory structure: {warning if >20 files} (VAL-003)

  Next: Workflow complete. Story {number} documentation preserved.
  ```

### 9. Final Workflow Handoff

- **Display completion message**:
  ```
  🔄 WORKFLOW: Quinn (QA) → LISA (LIBRARIAN) → [WORKFLOW END]

  ✅ Knowledge curation complete for Story {number}.
  Story workflow finished.
  ```
- **DO NOT mention next agents or next steps**
- Lisa is the FINAL agent in AppyDave workflow

## Error Handling

- **If story file not found**: HALT with clear error message and suggested path
- **If story status incorrect**: HALT and remind user Lisa runs after QA passes
- **If template file not found**: HALT with error: "Template {name} not found at .bmad-core/templates/. Please verify BMAD installation."
- **If kdd-taxonomy.yaml not found**: HALT with error: "KDD taxonomy not found. Cannot proceed with knowledge curation."
- **If no learnings found**: Create minimal learning document noting "Story completed without notable learnings or pattern deviations."

## Graceful Degradation

- **Broken links detected**: Log as warnings, not errors (VAL-001 = warning severity)
- **Duplicate documents detected**: Advisory only, suggest consolidation, do not auto-merge
- **Index generation fails**: Manual index updates supported, do not block curation
- **Pattern promotion uncertain**: Default to creating learning document, track for future promotion

## Notes

- This task is Lisa's core responsibility and primary command (`*curate`)
- Lisa documents what was learned, does NOT validate code or enforce patterns (that's Quinn's role)
- All KDD docs stored as Markdown files (file-based everything principle)
- Pattern promotion requires 3+ uses across stories, not automatic
- Human approval required for consolidation, not automated merges
