---
# Knowledge Traceability Guide
title: "Knowledge Traceability: Story ↔ KDD Documentation"
created: "2026-01-22"
maintained_by: "Lisa (Librarian)"
version: "1.0.0"
purpose: "Guide for bidirectional traceability between stories and KDD documents"
---

# Knowledge Traceability Guide

> **Purpose**: Establish bidirectional traceability between stories and extracted knowledge (patterns, learnings, decisions, examples)
> **Maintained By**: Lisa (Librarian)
> **Updated**: 2026-01-22

---

## Overview

This guide documents the **knowledge traceability pattern** implemented in POEM to enable:
1. **Story → KDD**: Track which knowledge assets were extracted from each story
2. **KDD → Story**: Track which story generated each knowledge document
3. **Future System Integration**: Standardized metadata for programmatic access

---

## 1. Story Files: "Knowledge Assets" Section

### Purpose

The **"Knowledge Assets"** section provides bidirectional traceability from story files to KDD documentation.

### Location in Story Template

Added to `.bmad-core/templates/story-tmpl.yaml` as a new section after QA Results.

### Template Format

```yaml
  - id: knowledge-assets
    title: Knowledge Assets
    instruction: |
      Links to KDD (Knowledge-Driven Development) documents created from this story.
      This section is populated by Lisa (Librarian) during knowledge curation (Step 7 of AppyDave workflow).
      Provides bidirectional traceability between stories and extracted knowledge.
    owner: librarian
    editors: [librarian]
    template: |
      <!-- Lisa (Librarian) updates this section during knowledge curation -->

      **Patterns Created**:
      - (None yet)

      **Learnings Documented**:
      - (None yet)

      **Decisions (ADRs)**:
      - (None yet)

      **Examples Created**:
      - (None yet)

      **Knowledge Extraction Status**: Not yet curated
```

### Example: Populated Section

When Lisa runs `*curate` on Story 4.3, the section would be updated to:

```markdown
## Knowledge Assets

<!-- Lisa (Librarian) updates this section during knowledge curation -->

**Patterns Created**:
- [Schema-Based Mock Data Generation](../kdd/patterns/4-schema-based-mock-data-generation.md)

**Learnings Documented**:
- [Array Type Override in Mock Data Generation](../kdd/learnings/epic4-array-type-override-bug.md)

**Decisions (ADRs)**:
- [ADR-005: Mock Data Generation with Faker.js](../kdd/decisions/adr-005-mock-data-generation-fakerjs.md)

**Examples Created**:
- [Schema-Based Mock Generation Example](../examples/epic4-schema-based-mock-generation/README.md)

**Knowledge Extraction Status**: Curated on 2026-01-19
```

### Lisa's Permissions

**Lisa can ONLY update**:
- "Knowledge Assets" section (add links to created KDD docs)

**Lisa CANNOT modify**:
- Status, Story, Acceptance Criteria, Tasks, Dev Agent Record, QA Results

---

## 2. KDD Documents: YAML Frontmatter Metadata

### Purpose

Standardized YAML frontmatter enables:
- **Programmatic access** - Future systems can parse metadata
- **Consistent structure** - All KDD docs follow same schema
- **Traceability** - Story references link back to source
- **Discovery** - Category, status, and topic fields enable search

### Pattern Template Metadata

**File**: `.bmad-core/templates/pattern-tmpl.md`

```yaml
---
# Pattern Template Metadata
domain: "{domain}"            # e.g., authentication, validation, deployment
topic: "{topic}"              # e.g., password-validation, email-validation
status: "Active"              # Active | Deprecated | Under Review
created: "{YYYY-MM-DD}"
story_reference: "{Story X.Y}" # First story that used this pattern
pattern_type: "{type}"        # Code Pattern | Architectural Pattern | Validation Pattern
last_updated: "{YYYY-MM-DD}"
---
```

**Required Fields**:
- `domain` - High-level category (authentication, api, testing, etc.)
- `topic` - Specific focus area
- `status` - Lifecycle status
- `created` - Creation date
- `story_reference` - Source story
- `pattern_type` - Classification
- `last_updated` - Maintenance date

### Learning Template Metadata

**File**: `.bmad-core/templates/learning-tmpl.md`

```yaml
---
# Learning Document Metadata
topic: "{topic}"                     # e.g., deployment, debugging, testing
issue: "{issue-name}"                # e.g., cors-error, timeout-issue
created: "{YYYY-MM-DD}"
story_reference: "{Story X.Y}"       # Story where this issue occurred
category: "{category}"               # deployment | debugging | testing | ai-integration | validation
severity: "{severity}"               # Low | Medium | High | Critical
status: "{status}"                   # Active | Resolved | Recurring
recurrence_count: 1                  # Number of times this issue appeared
last_occurred: "{YYYY-MM-DD}"
---
```

**Required Fields**:
- `topic` - High-level category
- `issue` - Specific issue name
- `created` - Creation date
- `story_reference` - Source story
- `category` - Issue classification
- `severity` - Impact level
- `status` - Resolution status
- `recurrence_count` - Recurrence tracking (VAL-006)
- `last_occurred` - Last occurrence date

### Decision (ADR) Template Metadata

**File**: `.bmad-core/templates/decision-adr-tmpl.md`

```yaml
---
# Architecture Decision Record Metadata
adr_number: "{NNN}"              # Sequential: 001, 002, 003, etc.
title: "{Short Decision Title}"
status: "Proposed"               # Proposed | Accepted | Deprecated | Superseded
created: "{YYYY-MM-DD}"
decision_date: "{YYYY-MM-DD}"    # When decision was accepted (blank if Proposed)
story_reference: "{Story X.Y}"   # Story that triggered this decision
authors: ["{Author Name}"]
supersedes: null                 # ADR-XXX if this supersedes another
superseded_by: null              # ADR-XXX if this is superseded
---
```

**Required Fields**:
- `adr_number` - Sequential ADR number (001, 002, etc.)
- `title` - Short decision title
- `status` - Decision lifecycle status
- `created` - Creation date
- `decision_date` - When decision was accepted
- `story_reference` - Source story
- `authors` - Decision makers
- `supersedes` / `superseded_by` - Decision chain

### Example Template Metadata

**File**: `.bmad-core/templates/example-tmpl.md`

```yaml
---
# Example Document Metadata
title: "{Example Title}"
purpose: "{Brief purpose description}"
category: "{category}"           # Code Example | Configuration Example | Integration Example | Workflow Example
created: "{YYYY-MM-DD}"
story_reference: "{Story X.Y}"   # Story that created this example (if applicable)
related_patterns: []             # List of pattern filenames (without .md)
technologies: []                 # List of technologies used
difficulty: "{difficulty}"       # Beginner | Intermediate | Advanced
last_updated: "{YYYY-MM-DD}"
---
```

**Required Fields**:
- `title` - Example name
- `purpose` - Brief description
- `category` - Example classification
- `created` - Creation date
- `story_reference` - Source story (if applicable)
- `related_patterns` - Pattern links (enables pattern → example traceability)
- `technologies` - Tech stack used
- `difficulty` - Complexity level
- `last_updated` - Maintenance date

---

## 3. Bidirectional Traceability Flow

### Story → KDD (Forward Traceability)

1. **Dev Agent** completes story implementation (Status: "Done")
2. **QA Agent** reviews story (QA Results section populated)
3. **Lisa (Librarian)** runs `*curate {story-file}` (Step 7 of AppyDave workflow)
4. Lisa extracts knowledge:
   - Patterns from Dev Agent Record
   - Learnings from debugging notes, challenges encountered
   - Decisions from architectural choices made
   - Examples from working implementations
5. Lisa creates KDD documents with YAML frontmatter
6. **Lisa updates story file** "Knowledge Assets" section with links
7. Story now shows all extracted knowledge

### KDD → Story (Reverse Traceability)

Every KDD document includes `story_reference` field in YAML frontmatter:

```yaml
story_reference: "Story 4.3"
```

This enables:
- **Pattern usage tracking** - Which stories used this pattern?
- **Learning recurrence detection** - Did this issue appear again? (VAL-006)
- **Decision impact analysis** - Which stories implemented this decision?
- **Example validation** - Which story validated this example?

### Complete Traceability Chain

```
Story 4.3
  ├─→ Pattern: 4-schema-based-mock-data-generation.md
  │     └─→ story_reference: "Story 4.3"
  ├─→ Learning: epic4-array-type-override-bug.md
  │     └─→ story_reference: "Story 4.3"
  ├─→ ADR: adr-005-mock-data-generation-fakerjs.md
  │     └─→ story_reference: "Story 4.3"
  └─→ Example: epic4-schema-based-mock-generation/README.md
        └─→ story_reference: "Story 4.3"
```

**Bidirectional navigation**:
- From Story 4.3 → Find all extracted knowledge
- From Pattern → Find source story

---

## 4. Benefits for Future Systems

### Programmatic Access

YAML frontmatter enables:

```typescript
// Parse KDD document metadata
const frontmatter = parseYAML(document);
const sourceStory = frontmatter.story_reference; // "Story 4.3"
const status = frontmatter.status; // "Active"
const created = frontmatter.created; // "2026-01-19"
```

### Metrics & Analytics

Standardized metadata enables:

1. **Knowledge Extraction Rate**
   - Query: How many stories have "Knowledge Assets" section populated?
   - Metric: `(stories with KDD docs) / (total stories completed) * 100`

2. **Pattern Usage Tracking**
   - Query: Which stories reference Pattern X in "Knowledge Assets"?
   - Metric: Pattern adoption rate across epics

3. **Recurrence Detection** (VAL-006)
   - Query: Find learnings with `recurrence_count >= 3`
   - Action: Promote to pattern

4. **Decision Impact Analysis**
   - Query: Which stories implemented ADR-005?
   - Metric: Decision adoption rate

### Search & Discovery

Metadata enables rich queries:

```bash
# Find all patterns in "testing" domain
grep -r "^domain: \"testing\"" docs/kdd/patterns/

# Find all critical severity learnings
grep -r "^severity: \"Critical\"" docs/kdd/learnings/

# Find all accepted ADRs from Epic 4
grep -r "^status: \"Accepted\"" docs/kdd/decisions/ | grep "story_reference.*4\."

# Find recurring issues (recurrence_count >= 2)
grep -r "^recurrence_count: [2-9]" docs/kdd/learnings/
```

### Validation & Compliance

Metadata enables automated validation:

1. **VAL-005: Metadata Completeness**
   - Check: All required fields present?
   - Alert: Missing `story_reference` or `created` date

2. **Story Curation Completeness**
   - Check: Does "Done" story have "Knowledge Assets" section populated?
   - Alert: Story completed but not curated

3. **Pattern Promotion Eligibility**
   - Check: Learning has `recurrence_count >= 3`?
   - Recommendation: Promote to pattern

---

## 5. Lisa's Curation Workflow

### Step 7 of AppyDave Workflow

**Context**: After QA passes (Quinn approves), Lisa curates knowledge.

**Command**: `*curate {story-file}`

### Lisa's 8-Step Process

1. **Read story file** - Dev Agent Record, SAT results, QA feedback
2. **Identify knowledge** - Patterns, learnings, decisions, examples
3. **Create KDD documents** - Use templates with YAML frontmatter
4. **Populate metadata** - Fill in `story_reference`, `created`, etc.
5. **Write KDD content** - Document patterns, learnings, decisions
6. **Update story file** - Add links to "Knowledge Assets" section
7. **Update indexes** - Add new docs to `patterns/index.md`, etc.
8. **Validate topology** - Ensure links work (VAL-001)

### Example Curation Session

**Input**: Story 4.3 (Schema-Based Mock Data Generation)

**Lisa's Actions**:

1. Reads `docs/stories/4.3.story.md`
2. Identifies:
   - **Pattern**: Schema-based mock data generation with Faker.js
   - **Learning**: Array type override bug discovered during implementation
   - **Decision**: Choose Faker.js over alternatives
   - **Example**: Working implementation with test fixtures
3. Creates KDD documents:
   - `docs/kdd/patterns/4-schema-based-mock-data-generation.md`
   - `docs/kdd/learnings/epic4-array-type-override-bug.md`
   - `docs/kdd/decisions/adr-005-mock-data-generation-fakerjs.md`
   - `docs/examples/epic4-schema-based-mock-generation/README.md`
4. Updates story file:
   - Adds links to "Knowledge Assets" section
   - Sets status: "Curated on 2026-01-19"
5. Updates indexes:
   - Adds pattern to `docs/kdd/patterns/index.md`
   - Adds learning to `docs/kdd/learnings/index.md`
   - Adds ADR to `docs/kdd/decisions/index.md`

**Output**: Complete bidirectional traceability established

---

## 6. Migration Strategy for Existing Stories

### Objective

Add "Knowledge Assets" section to existing story files (Stories 0.1 through 4.6).

### Approach

**Option A: Manual Migration (Recommended)**
1. Add section to story template (✅ Done)
2. New stories auto-include section going forward
3. Backfill existing stories **only when curated** (lazy migration)
4. No immediate action required for completed stories

**Option B: Batch Migration**
1. Script to add "Knowledge Assets" section to all existing stories
2. Initialize with "(None yet)" for uncurated stories
3. Lisa backfills during retrospective curation
4. Higher upfront effort, cleaner result

**Recommended**: **Option A** - Lazy migration as stories are curated

### Backfill Priority

**Priority 1** (High value):
- Epic 4 stories (4.1-4.6) - Recent, well-documented
- Epic 3 stories (3.1-3.8) - Architectural foundation

**Priority 2** (Medium value):
- Epic 1-2 stories - Foundational

**Priority 3** (Low value):
- Epic 0 stories - Setup/infrastructure

---

## 7. Validation Rules Integration

### VAL-005: Metadata Completeness

**Rule**: KDD documents must have complete YAML frontmatter

**Validation**:
```yaml
pattern_required_fields:
  - domain
  - topic
  - status
  - created
  - story_reference
  - pattern_type
  - last_updated

learning_required_fields:
  - topic
  - issue
  - created
  - story_reference
  - category
  - severity
  - status
  - recurrence_count
  - last_occurred

decision_required_fields:
  - adr_number
  - title
  - status
  - created
  - decision_date
  - story_reference
  - authors
```

**Check**: Run `*validate-topology` to verify metadata completeness

### VAL-006: Recurrence Detection

**Rule**: Detect recurring issues for pattern promotion

**Metadata Usage**:
- `recurrence_count` tracks how many times issue appeared
- `last_occurred` tracks most recent occurrence
- `status: "Recurring"` flags as eligible for promotion

**Check**: Run `*detect-recurrence` to find promotion candidates

---

## 8. Future Enhancements

### Programmatic Knowledge Extraction

**Vision**: Automate knowledge curation using AI

```typescript
// Future: AI-powered knowledge extraction
const knowledge = await extractKnowledge(storyFile);
const pattern = await createPattern(knowledge.patterns[0]);
const learning = await createLearning(knowledge.learnings[0]);
await updateStoryKnowledgeAssets(storyFile, [pattern, learning]);
```

### Knowledge Graph

**Vision**: Build queryable knowledge graph

```typescript
// Query: "Show me all patterns related to testing"
const patterns = knowledgeGraph.query({
  type: 'pattern',
  domain: 'testing'
});

// Query: "Which stories used the API-First pattern?"
const stories = knowledgeGraph.reverseQuery({
  pattern: 'api-first-heavy-operations',
  relation: 'used_in_story'
});
```

### Dashboard & Metrics

**Vision**: Real-time KDD health dashboard

```typescript
// Metrics dashboard
const metrics = {
  knowledge_extraction_rate: 155%, // 31 docs / 20 stories
  pattern_adoption_rate: 95%,      // Stories using documented patterns
  recurrence_prevention_rate: 100%, // 0% recurring issues (VAL-006)
  link_health: 100%                // 0 broken links (VAL-001)
};
```

---

## 9. Best Practices

### For Lisa (Librarian)

1. **Always populate metadata** - Complete all required YAML fields
2. **Use story_reference consistently** - Format: "Story X.Y" (e.g., "Story 4.3")
3. **Update "Knowledge Assets" section** - Add links to all created docs
4. **Maintain bidirectional links** - KDD → Story AND Story → KDD
5. **Run validation after curation** - `*validate-topology` to check links

### For Story Authors (Bob - Scrum Master)

1. **Include "Knowledge Assets" section** - Use updated story template
2. **Initialize as "(None yet)"** - Lisa will populate during Step 7
3. **Don't manually update** - Only Lisa has permission to edit this section

### For Developers (James)

1. **Reference patterns in Dev Notes** - "Using API-First pattern from Story 3.2"
2. **Document debugging in Dev Agent Record** - Lisa extracts learnings from this
3. **Self-check against patterns** - Before marking "Ready for Review"

### For QA (Quinn)

1. **Validate pattern usage** - Check if documented patterns are followed
2. **Flag pattern violations** - Note in QA Results section
3. **Identify recurring issues** - Check for similar problems in past stories

---

## 10. Summary

### What We Achieved

✅ **Story Template Updated**
- Added "Knowledge Assets" section
- Lisa-owned, read-only for others
- Enables Story → KDD traceability

✅ **KDD Templates Already Standardized**
- All templates have YAML frontmatter
- Consistent metadata schema across document types
- Enables KDD → Story traceability

✅ **Bidirectional Traceability**
- Story → KDD via "Knowledge Assets" links
- KDD → Story via `story_reference` metadata
- Complete traceability chain established

✅ **Future-Proof Pattern**
- Programmatic access via YAML parsing
- Metrics & analytics enabled
- Validation rules integrated

### Files Modified

- `.bmad-core/templates/story-tmpl.yaml` - Added "Knowledge Assets" section

### Files Already Compliant

- `.bmad-core/templates/pattern-tmpl.md` - ✅ Has YAML frontmatter
- `.bmad-core/templates/learning-tmpl.md` - ✅ Has YAML frontmatter
- `.bmad-core/templates/decision-adr-tmpl.md` - ✅ Has YAML frontmatter
- `.bmad-core/templates/example-tmpl.md` - ✅ Has YAML frontmatter

### Next Steps

1. ✅ **Done** - Story template updated with "Knowledge Assets" section
2. ✅ **Done** - KDD templates already have standardized metadata
3. 🔄 **Recommended** - Backfill existing stories during retrospective curation (lazy migration)
4. 🔄 **Optional** - Run `*validate-topology` monthly to ensure metadata completeness

---

**Guide maintained by**: Lisa (Librarian)
**Last updated**: 2026-01-22
**Version**: 1.0.0
