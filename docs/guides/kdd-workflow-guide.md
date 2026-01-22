# KDD Workflow Guide

> **KDD** = Knowledge-Driven Development
>
> A systematic approach to capturing, organizing, and maintaining knowledge assets from completed stories, enabling pattern reuse, preventing recurring issues, and reducing documentation maintenance burden.

**Last Updated**: 2026-01-22
**BMAD Version**: v4
**Owner**: Lisa (Librarian)

---

## Table of Contents

1. [Overview](#overview)
2. [The Problem KDD Solves](#the-problem-kdd-solves)
3. [KDD Document Taxonomy](#kdd-document-taxonomy)
4. [Complete KDD Workflow](#complete-kdd-workflow)
5. [How Agents Use KDD Documentation](#how-agents-use-kdd-documentation)
6. [Topology Maintenance](#topology-maintenance)
7. [Validation Rules](#validation-rules)
8. [Success Metrics](#success-metrics)
9. [Best Practices](#best-practices)
10. [Examples](#examples)

---

## Overview

**KDD (Knowledge-Driven Development)** is POEM's approach to institutional knowledge management. After each story passes QA review (Step 6), Lisa (Librarian agent) extracts learnings and creates structured documentation in **Step 7** of the AppyDave workflow.

### Key Concepts

- **Lisa (Librarian)**: BMAD agent responsible for knowledge curation (Step 7)
- **KDD Documents**: Structured knowledge assets (patterns, learnings, decisions, examples)
- **Topology**: Organizational structure of KDD documents (directories, indexes, cross-links)
- **Validation Rules**: VAL-001 through VAL-006 (link health, duplication, structure)

### Workflow Position

```
Step 6: Quinn (QA) Reviews → PASS → Step 7: Lisa (Librarian) Curates Knowledge → [END]
```

Lisa is the **FINAL agent** in AppyDave workflow. Knowledge curation happens AFTER QA passes, not during development.

---

## The Problem KDD Solves

### Evidence from SupportSignal Project

**Without KDD Documentation** (baseline):
- **Documentation maintenance burden**: 7.4 hours/month lost to cleanup
- **Code pattern consistency disaster**: 4 duplicate password validation implementations with 25% consistency score
- **Broken topology**: 30%+ broken links, 80% duplication in deployment docs
- **Knowledge extraction gaps**: 60% of stories complete without knowledge capture
- **Recurring issues**: 0% recurrence detection, same bugs repeated in multiple stories

**Root Causes**:
1. No systematic knowledge extraction process
2. Documentation created ad-hoc, no templates or structure
3. No validation of documentation quality (broken links, duplicates)
4. No pattern enforcement (Quinn can't enforce what doesn't exist)
5. Manual TOC maintenance (13+ updates per 3 months)

### KDD Solution

Lisa (Librarian) provides:
- **Systematic extraction**: 8-step workflow ensures 100% story coverage
- **Structured documentation**: Templates for patterns, learnings, decisions, examples
- **Topology maintenance**: Auto-generated indexes, link validation, duplication detection
- **Pattern enforcement**: Quinn validates code against documented patterns
- **Recurring issue detection**: 60% signature match identifies pattern promotion candidates

**Target Improvements**:
- Documentation maintenance: 7.4 hrs/month → <1 hr/month (87% reduction)
- Pattern consistency: 25% → 95%+ (Quinn enforces)
- Link health: 70% → 95%+ (automated validation)
- Knowledge extraction: 40% → 100% stories
- Recurrence detection: 0% → 95%+ (automated signature matching)

---

## KDD Document Taxonomy

KDD uses **4 document types**, each with specific purpose, structure, and lifecycle.

### 1. Pattern Documents

**Purpose**: Reusable code/architectural patterns, coding conventions

**Location**: `docs/kdd/patterns/`

**Filename Format**: `{domain}-{topic}-pattern.md`
- Example: `password-validation-pattern.md`
- Example: `error-handling-pattern.md`

**When to Create**:
- Pattern used in 3+ stories (evidence-based promotion threshold)
- Reusable solution to recurring problem
- Team approves standardization

**Required Sections**:
- **Context**: When to use this pattern
- **Implementation**: How to implement (code structure, steps)
- **Examples**: Working code examples
- **Rationale**: Why this approach (benefits, trade-offs)
- **Related Patterns**: Cross-references

**Template**: `.bmad-core/templates/pattern-tmpl.md`

**Lifecycle**:
1. Created by Lisa when issue recurs 3+ times
2. Quinn validates code against pattern during QA review
3. James self-checks against pattern before marking story ready
4. Pattern deprecated when superseded or technology changes

**Example**:
```markdown
---
domain: "authentication"
topic: "password-validation"
status: "Active"
created: "2026-01-15"
story_reference: "Story 2.3"
pattern_type: "Validation Pattern"
---

# Authentication - Password Validation Pattern

## Context
Use this pattern when implementing password validation for user registration or password changes...

## Implementation
### Step-by-Step
1. Import validation library: `import { validatePassword } from '@/lib/auth'`
2. Define validation rules...
```

### 2. Learning Documents

**Purpose**: Story-specific insights, debugging sessions, incidents, lessons learned

**Location**: `docs/kdd/learnings/`

**Filename Format**: `{topic}-{issue}-kdd.md`
- Example: `cors-issue-kdd.md`
- Example: `timeout-error-kdd.md`

**When to Create**:
- Issue/bug discovered during development
- Debugging session with insights worth preserving
- Incident requiring resolution
- Story-specific lesson learned

**Required Sections**:
- **Problem Signature**: Symptoms, error messages, triggering conditions
- **Root Cause**: Technical analysis of why issue occurred
- **Solution**: Resolution steps, code changes, verification
- **Prevention**: How to prevent in future stories
- **Related Incidents**: Previous occurrences, similar issues

**Template**: `.bmad-core/templates/learning-tmpl.md`

**Subdirectories** (triggered when directory has 15+ files):
- `deployment/` - Deployment and DevOps issues
- `debugging/` - Debugging sessions and troubleshooting
- `testing/` - Testing-related insights
- `ai-integration/` - AI/LLM integration learnings
- `validation/` - Input validation and data integrity

**Lifecycle**:
1. Created by Lisa from Dev Agent Record debugging logs
2. Tracked for recurrence (VAL-006: 60% signature match)
3. Promoted to pattern if issue recurs 3+ times
4. Archived or cross-referenced after pattern promotion

**Example**:
```markdown
---
topic: "deployment"
issue: "cors-error"
created: "2026-01-15"
story_reference: "Story 2.3"
category: "deployment"
severity: "High"
status: "Resolved"
recurrence_count: 1
---

# Deployment - CORS Error Learning

## Problem Signature
### Symptoms
- Error message: `Access to XMLHttpRequest... blocked by CORS policy`
- Affected component: API requests from frontend
- When it occurs: After deploying to production (works in development)

## Root Cause
Production environment missing CORS configuration in Nginx...
```

### 3. Decision Documents (ADRs)

**Purpose**: Architecture Decision Records (ADRs) documenting significant technical decisions

**Location**: `docs/kdd/decisions/`

**Filename Format**: `adr-{NNN}-{decision-name}.md`
- Example: `adr-001-use-jwt-authentication.md`
- Example: `adr-042-migrate-to-typescript.md`

**When to Create**:
- Significant architectural decision made
- Technology choice requiring documentation
- Design pattern selection with alternatives
- Decision with long-term impact on codebase

**Required Sections**:
- **Status**: Proposed | Accepted | Deprecated | Superseded
- **Context**: Background, problem statement, forces, assumptions
- **Decision**: What we will do (concise statement + details)
- **Alternatives**: Options considered and why not chosen
- **Rationale**: Why this decision (criteria, alignment, risk)
- **Consequences**: Positive/negative consequences, reversibility

**Template**: `.bmad-core/templates/decision-adr-tmpl.md`

**Numbering**: Sequential (ADR-001, ADR-002, ...) - Lisa finds highest number first

**Lifecycle**:
1. Created by Lisa when architectural decision documented in story
2. Status: Proposed (when created) → Accepted (when team agrees)
3. Referenced by related patterns and learnings
4. Superseded by later ADR if decision changes

**Example**:
```markdown
---
adr_number: "042"
title: "Use JWT for Authentication"
status: "Accepted"
created: "2026-01-15"
decision_date: "2026-01-18"
story_reference: "Story 2.3"
---

# ADR-042: Use JWT for Authentication

## Status
**ACCEPTED** - 2026-01-18

## Context
### Background
Current authentication system uses session cookies, but we need stateless auth for microservices...

## Decision
**We will use JWT (JSON Web Tokens) for authentication.**
```

### 4. Example Documents

**Purpose**: Working code demonstrations and reference implementations

**Location**: `docs/examples/`

**Filename Format**: `{example-name}.md` or `{example-name}/README.md` for complex examples

**When to Create**:
- Working code worth preserving as reference
- Complex implementation requiring demonstration
- Pattern usage example
- Integration example

**Required Sections**:
- **Purpose**: What this example demonstrates
- **Setup**: Prerequisites, installation, configuration
- **Implementation**: Step-by-step code with explanations
- **Related Patterns**: Links to patterns demonstrated

**Template**: `.bmad-core/templates/example-tmpl.md`

**Structure**:
- **Simple examples**: Single `.md` file
- **Complex examples**: Subdirectory with `README.md` and code files

**Example**:
```markdown
---
title: "JWT Authentication Flow Example"
purpose: "Demonstrates complete JWT authentication flow"
category: "Code Example"
created: "2026-01-15"
difficulty: "Intermediate"
related_patterns: ["auth-flow-pattern"]
---

# JWT Authentication Flow Example

## Purpose
This example demonstrates a complete JWT authentication flow...

## Setup
### Prerequisites
- Node.js 20+
- npm 10+
```

---

## Complete KDD Workflow

Lisa executes this workflow in **Step 7** of AppyDave workflow (after Quinn's QA review passes).

### Step-by-Step Process

#### 0. Pre-Curation Checks
- Verify story status is "Done" (QA passed)
- Load `kdd-taxonomy.yaml` and `validation-rules.yaml`
- Verify Lisa's tasks and templates exist

#### 1. Load Story File and QA Results
- Read story file: `docs/stories/{number}.story.md`
- Extract Dev Agent Record (Completion Notes, Debug Log, File List)
- Extract QA Results (pattern violations, quality concerns)
- Extract SAT Results (acceptance test findings) if available

#### 2. Extract Learnings from Dev Agent Record
- Analyze Completion Notes for technical decisions, challenges, insights
- Analyze Debug Log for issues encountered and resolutions
- Analyze File List for implementation patterns
- Categorize learnings: Pattern | Learning | Decision | Example

#### 3. Extract Patterns from Implementation
- Review File List for code conventions (naming, structure, error handling)
- Extract architectural patterns (component structure, data flow)
- Document reusable validation logic
- Cross-reference with Quinn's QA Results for pattern violations

#### 4. Identify Anti-Patterns or Lessons Learned
- Review QA Results for pattern deviations, code quality issues
- Analyze Debug Log for recurring issues (signature matching)
- Document prevention strategies
- Check if issue has recurred in previous stories (VAL-006)

#### 5. Create/Update KDD Documentation Using Templates
- For each identified knowledge asset, create document:
  - **Pattern**: Use `pattern-tmpl.md` → `docs/kdd/patterns/{domain}-{topic}-pattern.md`
  - **Learning**: Use `learning-tmpl.md` → `docs/kdd/learnings/{topic}-{issue}-kdd.md`
  - **Decision**: Use `decision-adr-tmpl.md` → `docs/kdd/decisions/adr-{NNN}-{name}.md`
  - **Example**: Use `example-tmpl.md` → `docs/examples/{example-name}.md`

#### 6. Maintain Topology (Update Indexes, Cross-Links)
- Update `docs/kdd/patterns/index.md` (add new patterns)
- Update `docs/kdd/learnings/index.md` (add new learnings)
- Update `docs/kdd/decisions/index.md` (add new ADRs)
- Add cross-links between related documents
- Validate all links (VAL-001: 0 broken links)
- Check directory structure (VAL-003: <20 files per directory)

#### 7. Update Story with Knowledge Asset Links
- Add "Knowledge Assets" section to story file (before Dev Agent Record)
- List all created KDD documents with relative links
- Include document type (Pattern, Learning, Decision, Example)

**Example Story Update**:
```markdown
## Knowledge Assets

Documentation created from this story:
- Pattern: [Password Validation Pattern](../../kdd/patterns/password-validation-pattern.md)
- Learning: [CORS Issue Resolution](../../kdd/learnings/deployment/cors-issue-kdd.md)
- Decision: [ADR-042: Use JWT for Authentication](../../kdd/decisions/adr-042-jwt-authentication.md)
```

#### 8. Validate Created Documentation
- Run `knowledge-curation-checklist.md` (8 validation steps)
- Check templates used correctly
- Validate metadata completeness (VAL-005)
- Run duplicate detection (optional, VAL-002: 70% similarity)
- Display curation summary

#### 9. Workflow End
- Display: "🔄 WORKFLOW: Quinn (QA) → LISA (LIBRARIAN) → [WORKFLOW END]"
- Confirm story workflow complete
- DO NOT mention next agents or next steps (Lisa is FINAL)

---

## How Agents Use KDD Documentation

### Quinn (QA) - Pattern Enforcement

**Step 6 Enhanced Workflow** (uses Lisa's patterns):

1. **Identify Technical Domain** from story (password validation, email, auth, etc.)
2. **Search Lisa's Patterns**: `docs/kdd/patterns/`
3. **If pattern exists**:
   - Read pattern documentation
   - Compare James's implementation to pattern
   - Check for deviations (validation rules, error messages, inline vs reusable)
4. **If pattern doesn't exist**:
   - Flag: "No pattern documented for [domain]"
   - Note: Lisa should create pattern in Step 7
5. **If inconsistencies found**:
   - Document in QA Results section
   - Return to Dev with specific violations

**Example Quinn Report** (pattern violation):
```markdown
## QA Results

### Code Quality: ⚠️ CONCERNS

**Pattern Consistency Issues**:

1. **Password Validation Inconsistency**:
   - Pattern: [Password Validation Pattern](../../kdd/patterns/password-validation-pattern.md)
   - Expected: 23 special characters (as documented in pattern)
   - Actual: 29 special characters (implementation deviation)
   - **Recommendation**: Update code to match pattern or justify deviation in Completion Notes
```

### James (Dev) - Self-Check Against Patterns

**Before marking story "Ready for Review"**:

1. Review relevant patterns in `docs/kdd/patterns/`
2. Self-check implementation against documented patterns
3. If deviation necessary, document rationale in Completion Notes
4. Update File List with references to patterns followed

### Sarah (PO) - Validate Architecture Decisions

**During story validation** (Step 2):

1. Review `docs/kdd/decisions/` for related ADRs
2. Ensure story requirements align with architectural decisions
3. Flag conflicts between story and existing ADRs

### Bob (SM) - Inform Story Requirements

**When creating stories** (Step 1):

1. Review patterns and learnings from similar stories
2. Reference lessons learned to avoid recurring issues
3. Include pattern references in Dev Notes if applicable

---

## Topology Maintenance

**Topology** = Organizational structure of KDD documents (directories, indexes, cross-links)

### Lisa's Topology Commands

#### `*validate-topology` - Check KDD Structure Health

**Checks**:
- **Link Health (VAL-001)**: 0 broken links target
- **Directory Structure (VAL-003)**: <20 files per directory
- **Orphan Detection**: Documents with no inbound links
- **Index Currency**: Index files exist and are current

**Output**:
```
📊 KDD Topology Health Report

Link Health (VAL-001):
- Total links: 142
- Broken links: 3 ❌ (97.9% healthy)

Directory Structure (VAL-003):
- docs/kdd/learnings/: 23 files ⚠️ (threshold: 20)

Orphaned Documents: 2
- docs/kdd/patterns/legacy-pattern.md

Recommendations:
- Fix 3 broken links in patterns directory
- Create subdirectories in learnings/ (deployment/, debugging/)
```

#### `*regenerate-indexes` - Auto-Generate Index Files

**What It Does**:
- Scans all KDD documents
- Extracts frontmatter metadata
- Generates `index.md` for each directory
- Eliminates manual TOC maintenance (13+ updates per 3 months saved)

**Generated Index Example**:
```markdown
# Patterns Index

> Auto-generated by Lisa (Librarian) on 2026-01-22
> Total documents: 15

## Authentication Patterns

- **[Password Validation Pattern](./password-validation-pattern.md)** - Reusable password validation with 23 special characters
  - Story reference: Story 2.3
  - Status: Active

## Validation Patterns

- **[Email Validation Pattern](./email-validation-pattern.md)** - RFC-compliant email validation
  - Story reference: Story 2.5
  - Status: Active
```

#### `*search-similar` - Find Duplicate Documents

**What It Does**:
- Keyword-based duplicate detection (no RAG/embeddings)
- Computes pairwise similarity using Jaccard index
- Flags pairs with >=70% similarity (VAL-002)

**Output**:
```
📊 Duplicate Detection Report (VAL-002)

High-Similarity Pairs (>= 70%):
- cors-issue-kdd.md ↔ cors-preflight-kdd.md: 85% similarity
  Action: Merge recommended (high overlap)

- password-validation-pattern.md ↔ password-strength-pattern.md: 72% similarity
  Action: Cross-link suggested (partial overlap)
```

#### `*detect-recurrence` - Identify Recurring Issues

**What It Does**:
- Extracts problem signatures from learning documents
- Computes signature similarity (60% match threshold, VAL-006)
- Recommends pattern promotion for 3+ occurrences

**Output**:
```
🔁 Recurring Issues Report (VAL-006)

Pattern Promotion Candidates (>= 3 occurrences):
- CORS Error: 4 stories affected (Stories 2.3, 3.1, 3.5, 4.2)
  Recommendation: Promote to pattern (cors-configuration-pattern.md)

Monitored Issues (2 occurrences):
- Timeout Error: 2 stories (Stories 2.1, 3.3)
  Status: Watch for third occurrence
```

### Directory Organization Best Practices

**When directories exceed 20 files** (VAL-003), create subdirectories:

**For `docs/kdd/learnings/`**:
```
docs/kdd/learnings/
├── deployment/       # Deployment and DevOps issues
├── debugging/        # Debugging sessions
├── testing/          # Testing-related insights
├── ai-integration/   # AI/LLM integration
└── validation/       # Input validation issues
```

**For `docs/kdd/patterns/`**:
```
docs/kdd/patterns/
├── backend/          # Backend patterns
├── frontend/         # Frontend patterns
├── security/         # Security patterns
└── performance/      # Performance patterns
```

---

## Validation Rules

Lisa enforces 6 validation rules (VAL-001 through VAL-006) to maintain KDD health.

### VAL-001: Link Health

**Rule**: 0 broken links
**Trigger**: document_save
**Severity**: error (but treated as warning via graceful degradation)
**Target**: 95%+ link health

**What It Checks**:
- All relative links (`../../path/file.md`) exist
- Anchor links (`#section`) exist in target document
- No broken cross-references

**Remediation**:
- Run `*validate-topology` to identify broken links
- Fix relative paths or update cross-references
- Remove links to deleted documents

### VAL-002: Semantic Similarity (Duplicate Detection)

**Rule**: <30% average duplication
**Trigger**: document_create
**Severity**: warning
**Threshold**: 70% keyword similarity

**What It Checks**:
- Keyword overlap between documents (Jaccard similarity)
- Title/content similarity
- Code snippet similarity

**Remediation**:
- Run `*search-similar` to find duplicates
- Merge exact duplicates (>=90% similarity)
- Cross-link related documents (70-89% similarity)
- Run `*consolidate` command (requires human approval)

### VAL-003: Directory Limit

**Rule**: <20 files per directory
**Trigger**: document_create
**Severity**: warning
**Threshold**: 20 files

**What It Checks**:
- File count in each KDD subdirectory
- Flat directory structure detection

**Remediation**:
- Run `*suggest-structure` for reorganization recommendations
- Create subdirectories manually
- Update index.md files after reorganization

### VAL-004: Story File Size

**Rule**: <300 lines per story
**Trigger**: story_completion
**Severity**: warning
**Threshold**: 300 lines

**What It Checks**:
- Line count in story file
- Large Dev Agent Record sections
- Missing knowledge extraction

**Remediation**:
- Extract Dev Notes to learning documents
- Move debugging logs to learning documents
- Move pattern details to pattern documents

### VAL-005: Metadata Completeness

**Rule**: All required metadata fields present
**Trigger**: document_create
**Severity**: warning

**What It Checks**:
- Frontmatter YAML exists
- Required fields populated (domain, topic, status, created, story_reference)
- Field formats valid (dates, status values)

**Remediation**:
- Use templates to ensure metadata completeness
- Run `*validate-topology` to identify incomplete metadata
- Update documents with missing fields

### VAL-006: Recurrence Detection

**Rule**: Detect recurring issues (pattern promotion)
**Trigger**: lesson_create
**Severity**: info
**Threshold**: 60% signature match

**What It Checks**:
- Problem signature similarity between learning documents
- Recurrence count per issue
- Pattern promotion eligibility (3+ occurrences)

**Remediation**:
- Run `*detect-recurrence` to identify recurring issues
- Promote learnings with 3+ recurrences to patterns
- Update Quinn's review checklist with new patterns

---

## Success Metrics

### Evidence-Based Targets

| Metric | Baseline (SupportSignal) | Target | Owner | Validation |
|--------|--------------------------|--------|-------|------------|
| **Pattern Documentation** | 0 (password validation) | 100% critical patterns | Lisa | Count of pattern documents |
| **Pattern Consistency** | 25% (1/4 implementations) | 95%+ | Quinn | Quinn's QA reports |
| **Link Health** | 70% (30% broken) | 95%+ valid links | Lisa | VAL-001 validation |
| **Documentation Maintenance** | 7.4 hours/month | <1 hour/month | Lisa | Time tracking |
| **Knowledge Extraction** | ~40% stories | 100% stories | Lisa | Stories with KDD docs |
| **Duplication** | 80% overlap (worst case) | <30% average | Lisa | VAL-002 validation |

### Monthly Health Check

Run Lisa's `*health-dashboard` command monthly to generate KDD Health Report:

```bash
/BMad/agents/librarian
*health-dashboard
```

**Report Includes**:
- Link health score (VAL-001)
- Duplication rate (VAL-002)
- Knowledge extraction rate (% stories with KDD docs)
- Pattern consistency score (from Quinn's QA reports)
- Documentation maintenance burden (hours/month)
- Topology health (directory structure, orphans, indexes)

---

## Best Practices

### For Lisa (Librarian)

1. **Run KDD curation for EVERY story** - Target: 100% extraction rate
2. **Use templates consistently** - Ensures structure and metadata completeness
3. **Validate topology regularly** - Run `*validate-topology` after each epic
4. **Promote patterns proactively** - Run `*detect-recurrence` to identify 3+ occurrence issues
5. **Regenerate indexes frequently** - Run `*regenerate-indexes` after bulk curation
6. **Check for duplicates** - Run `*search-similar` during epic consolidation

### For Quinn (QA)

1. **Check patterns first** - Search `docs/kdd/patterns/` for relevant patterns before reviewing code
2. **Flag pattern violations clearly** - Document expected vs actual implementation
3. **Document missing patterns** - Note when Quinn can't validate due to missing pattern
4. **Reference ADRs** - Link to architectural decisions in QA Results

### For James (Dev)

1. **Self-check against patterns** - Review patterns before marking story ready
2. **Document deviations** - If pattern deviation necessary, explain in Completion Notes
3. **Reference patterns in File List** - Link to patterns followed during implementation
4. **Add debugging insights** - Document issues in Debug Log for Lisa to extract

### For Bob (SM)

1. **Reference learnings** - Review similar stories' learnings when creating new stories
2. **Include pattern references** - Add pattern links to Dev Notes if applicable
3. **Avoid recurring issues** - Check `*detect-recurrence` report before drafting stories

---

## Examples

### Example 1: Password Validation Pattern Curation

**Scenario**: Story 2.3 implements password validation. Lisa curates knowledge.

**Story Context**:
- Dev Agent Record mentions creating password validation with 23 special characters
- Debug Log shows issues with Unicode special characters
- QA Results: Quinn notes no documented pattern exists

**Lisa's Actions**:
1. **Identifies pattern**: Password validation used in implementation
2. **Creates pattern document**: `docs/kdd/patterns/password-validation-pattern.md`
   - Context: When implementing user registration or password changes
   - Implementation: 23 special characters, Unicode handling, regex pattern
   - Examples: Working code from Story 2.3
   - Rationale: Security best practices, user experience
3. **Updates index**: Adds pattern to `docs/kdd/patterns/index.md`
4. **Updates story**: Adds Knowledge Assets section with pattern link
5. **Creates learning**: `docs/kdd/learnings/validation/unicode-special-chars-kdd.md` (Unicode issue)

**Result**: Quinn can now validate password validation in future stories against this pattern.

### Example 2: CORS Error Recurrence Detection

**Scenario**: CORS error appears in Stories 2.3, 3.1, 3.5, and 4.2.

**Lisa's Actions**:
1. **Run `*detect-recurrence`**: Identifies 4 occurrences of CORS error (60%+ signature match)
2. **Pattern promotion recommendation**:
   - Issue: CORS Configuration
   - Occurrences: 4 stories
   - Promotion criteria met: 3+ occurrences
3. **Human approval obtained**: Team agrees to create pattern
4. **Creates pattern**: `docs/kdd/patterns/cors-configuration-pattern.md`
   - Context: API requests from frontend to backend
   - Implementation: Nginx configuration, backend CORS middleware
   - Prevention: Pre-deployment checklist item
5. **Updates Quinn's checklist**: Add CORS configuration check to `review-story.md`
6. **Updates learnings**: Cross-reference 4 CORS learning docs to new pattern

**Result**: Future stories check CORS configuration proactively; Quinn validates against pattern.

### Example 3: Topology Health Check

**Scenario**: Monthly health check shows broken links and directory over threshold.

**Lisa's Actions**:
1. **Run `*validate-topology`**:
   - Found: 5 broken links in patterns directory
   - Found: `docs/kdd/learnings/` has 23 files (threshold: 20)
2. **Fix broken links**: Update relative paths, remove links to deleted docs
3. **Run `*suggest-structure`**:
   - Recommendation: Create subdirectories (deployment/, debugging/, testing/)
4. **Human approval**: Team agrees to reorganization
5. **Create subdirectories**: Manually move files to appropriate subdirectories
6. **Run `*regenerate-indexes`**: Update all index files
7. **Validate**: Re-run `*validate-topology` to confirm health restored

**Result**: Link health improved from 96.5% to 100%; directory structure organized.

---

## Troubleshooting

### Common Issues

**Issue**: Lisa can't find story file
- **Cause**: Story number incorrect or file doesn't exist
- **Solution**: Verify story file exists at `docs/stories/{number}.story.md`

**Issue**: No learnings identified
- **Cause**: Dev Agent Record incomplete or story too simple
- **Solution**: Create minimal learning document noting "Story completed without notable learnings"

**Issue**: Duplicate pattern detected (VAL-002 >=70%)
- **Cause**: Similar pattern already exists
- **Solution**: Run `*consolidate` to merge, or cross-reference if intentionally separate

**Issue**: Directory over threshold (VAL-003 >20 files)
- **Cause**: Too many documents in flat directory
- **Solution**: Run `*suggest-structure` and create subdirectories

**Issue**: Pattern promotion unclear (recurrence count = 2)
- **Cause**: Not enough occurrences yet (threshold: 3+)
- **Solution**: Create learning document, track for future promotion

---

## Glossary

- **KDD**: Knowledge-Driven Development
- **Lisa**: Librarian agent (BMAD agent responsible for knowledge curation)
- **Topology**: Organizational structure of KDD documents (directories, indexes, cross-links)
- **Pattern**: Reusable code/architectural pattern (promoted after 3+ uses)
- **Learning**: Story-specific insight, debugging session, or incident
- **Decision**: Architecture Decision Record (ADR)
- **Example**: Working code demonstration
- **VAL-001 to VAL-006**: Validation rules for KDD topology health
- **Signature Match**: Keyword-based similarity for recurrence detection (60% threshold)

---

## Resources

- **BMAD Method Documentation**: `.bmad-core/user-guide.md`
- **Lisa Agent Definition**: `.bmad-core/agents/librarian.md`
- **KDD Taxonomy**: `.bmad-core/data/kdd-taxonomy.yaml`
- **Validation Rules**: `.bmad-core/data/validation-rules.yaml`
- **Story Template**: `.bmad-core/templates/story-tmpl.yaml`
- **AppyDave Workflow**: `.bmad-core/tasks/execute-appydave-workflow.md`

---

**Guide maintained by**: Lisa (Librarian)
**Last updated**: 2026-01-22
**Version**: 1.0.0
