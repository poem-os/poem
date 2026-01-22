<!-- Powered by BMAD™ Core -->

# Knowledge Curation Checklist

## Instructions for Lisa (Librarian Agent)

After extracting knowledge from a completed story (via `*curate` command), use this checklist to validate the curation process. Report the status of each item (e.g., [x] Done, [ ] Not Done, [N/A] Not Applicable) and provide brief comments if necessary.

[[LLM: INITIALIZATION INSTRUCTIONS - KNOWLEDGE CURATION VALIDATION

This checklist is for LISA (LIBRARIAN AGENT) to self-validate knowledge extraction and documentation.

IMPORTANT: This is Step 7 of AppyDave workflow, executed AFTER Quinn passes QA review. Be thorough about knowledge capture - future developers depend on this documentation.

EXECUTION APPROACH:

1. Go through each section systematically
2. Mark items as [x] Done, [ ] Not Done, or [N/A] Not Applicable
3. Add brief comments explaining any [ ] or [N/A] items
4. Be specific about what knowledge assets were created
5. Verify all topology health checks pass

The goal is complete knowledge capture, not just checking boxes.]]

## Checklist Items

### 1. Documentation Extraction

[[LLM: Extract learnings from Dev Agent Record, SAT results, and QA feedback. Be comprehensive.]]

- [ ] **Story File Loaded**: Story file read successfully from `{devStoryLocation}`
- [ ] **Story Status Verified**: Story status is "Review" or "Done" (not Draft or In Progress)
- [ ] **Dev Agent Record Analyzed**: Completion Notes, Debug Log, and File List reviewed
- [ ] **QA Results Reviewed**: Quinn's QA Results section analyzed for patterns and concerns
- [ ] **SAT Results Reviewed** (if applicable): Taylor's acceptance test findings analyzed
- [ ] **Learnings Identified**: At least one learning, pattern, or decision identified from story

**Comments**: {Brief description of what learnings were extracted}

---

### 2. Knowledge Assets Created

[[LLM: Create KDD documents using templates. Document type depends on what was learned.]]

- [ ] **Pattern Documents Created** (if applicable):
  - Files: {List pattern files created, e.g., `docs/kdd/patterns/password-validation-pattern.md`}
  - Used template: `.bmad-core/templates/pattern-tmpl.md`
  - Pattern promotion criteria met: Used in 3+ stories OR first occurrence tracked for future promotion
- [ ] **Learning Documents Created** (if applicable):
  - Files: {List learning files created, e.g., `docs/kdd/learnings/deployment/cors-issue-kdd.md`}
  - Used template: `.bmad-core/templates/learning-tmpl.md`
  - Recurrence tracking: Issue signature documented for future detection
- [ ] **Decision Documents Created** (if applicable):
  - Files: {List ADR files created, e.g., `docs/kdd/decisions/adr-042-jwt-authentication.md`}
  - Used template: `.bmad-core/templates/decision-adr-tmpl.md`
  - ADR numbering: Sequential numbering maintained (checked highest ADR number)
- [ ] **Example Documents Created** (if applicable):
  - Files: {List example files created, e.g., `docs/examples/auth-flow-example.md`}
  - Used template: `.bmad-core/templates/example-tmpl.md`
  - Related patterns linked

**Comments**: {Brief summary of knowledge assets created}

---

### 3. Templates Used Correctly

[[LLM: Verify templates were followed, not just copied. Each section should be populated with actual content.]]

- [ ] **Frontmatter Metadata Complete**: All required metadata fields populated (domain, topic, status, created date, story reference)
- [ ] **Template Sections Populated**: All required sections have actual content (not placeholder text)
- [ ] **Code Examples Included** (if applicable): Working code examples demonstrate patterns or learnings
- [ ] **Story References Added**: Story number referenced in all created documents
- [ ] **Cross-References Complete**: Related patterns, learnings, or decisions cross-linked

**Comments**: {Any template deviations or issues}

---

### 4. Links Validated

[[LLM: Run VAL-001 validation rule. 0 broken links is the target.]]

- [ ] **Internal Links Checked**: All relative links (to stories, patterns, decisions) are valid
- [ ] **Cross-References Verified**: Bidirectional links between related documents work
- [ ] **Story Links Functional**: Links from story to knowledge assets work
- [ ] **No Broken Links Detected**: VAL-001 rule passed (0 broken links)
- [ ] **Anchor Links Verified** (if used): Links to document sections work correctly

**Broken Links** (if any): {List broken links with source and target}

**Comments**: {Link validation results}

---

### 5. Indexes Updated

[[LLM: Update or generate index.md files. No document should be orphaned.]]

- [ ] **Pattern Index Updated** (if pattern created): `docs/kdd/patterns/index.md` includes new pattern
- [ ] **Learning Index Updated** (if learning created): `docs/kdd/learnings/index.md` or subdirectory index includes new learning
- [ ] **Decision Index Updated** (if ADR created): `docs/kdd/decisions/index.md` includes new ADR
- [ ] **Example Index Updated** (if example created): `docs/examples/index.md` includes new example
- [ ] **Index Generation Run** (if needed): Executed `generate-indexes` task to auto-generate indexes
- [ ] **No Orphaned Documents**: All new documents linked from at least one index

**Comments**: {Index update status}

---

### 6. Story Updated with Knowledge Asset Links

[[LLM: Update story file with Knowledge Assets section. This creates bidirectional links.]]

- [ ] **Knowledge Assets Section Added**: Story file contains "Knowledge Assets" section (before Dev Agent Record)
- [ ] **All Assets Linked**: Every created KDD document linked from story
- [ ] **Link Format Correct**: Links use relative paths and include document type (Pattern, Learning, Decision, Example)
- [ ] **Story Permissions Respected**: ONLY updated "Knowledge Assets" section (not Status, Acceptance Criteria, or other sections)

**Story File**: `{devStoryLocation}/{story-number}.story.md`

**Assets Linked**: {Count and types: X patterns, Y learnings, Z decisions, W examples}

**Comments**: {Story update status}

---

### 7. Topology Health Checked

[[LLM: Run topology validation to ensure overall KDD health. Graceful degradation applies.]]

- [ ] **Link Health Validated** (VAL-001): Broken link count reported (target: 0)
- [ ] **Directory Structure Checked** (VAL-003): Directories with >20 files flagged for reorganization
- [ ] **Orphan Detection Run**: No orphaned documents detected (or orphans listed for review)
- [ ] **Duplicate Detection Run** (optional): Checked for semantic duplicates (70%+ similarity)
- [ ] **Recurrence Detection Run** (optional): Checked if issues recur (60%+ signature match)

**Topology Health Score**: {percentage}%

**Warnings** (if any): {List any topology warnings or recommendations}

**Comments**: {Topology health summary}

---

### 8. Workflow Completion

[[LLM: Lisa is the FINAL agent in AppyDave workflow. Confirm workflow end.]]

- [ ] **Curation Summary Displayed**: User informed of knowledge assets created
- [ ] **Workflow Position Confirmed**: "🔄 WORKFLOW: Quinn (QA) → LISA (LIBRARIAN) → [WORKFLOW END]" displayed
- [ ] **No Next Agent Mentioned**: Did NOT suggest next agents or next steps (Lisa is final)
- [ ] **Story Workflow Finished**: Confirmed story workflow is complete

**Comments**: {Final workflow status}

---

## Final Confirmation

[[LLM: FINAL CURATION SUMMARY

After completing the checklist:

1. Summarize knowledge assets created (count and types)
2. List any items marked as [ ] Not Done with explanations
3. Report topology health score and any warnings
4. Confirm whether knowledge curation is complete
5. Note any follow-up actions (e.g., pattern promotion candidates)

Be honest - incomplete curation means lost knowledge for future developers.]]

- [ ] **I, Lisa (Librarian Agent), confirm that all applicable items above have been addressed.**
- [ ] **Knowledge extraction rate**: {percentage}% (Target: 100% of stories)
- [ ] **Documentation maintenance burden**: {hours} hours spent (Target: <1 hour/month)

**Curation Complete**: {YES | NO | PARTIAL}

**Follow-up Actions** (if any):
- {Action 1}
- {Action 2}

---

**Checklist maintained by**: Lisa (Librarian)
**Last reviewed**: {YYYY-MM-DD}
