# Librarian Agent (Lisa) - Corrected Design

**Date**: 2026-01-22
**Revision**: Based on David's critical correction about Lisa's role
**Focus**: Lisa is a documentation librarian, NOT a code enforcer

---

## Critical Correction: Lisa's Role

**WRONG (previous design)**:
- Lisa does pre-implementation pattern guidance (Step 3.5)
- Lisa validates code patterns post-implementation
- Lisa "enforces" patterns
- Lisa is "preventative"

**RIGHT (corrected design)**:
- Lisa creates and maintains KDD documentation (Step 7 ONLY)
- Lisa does NOT check code
- Lisa does NOT appear in Steps 2, 4, or 6
- Other agents USE Lisa's docs for validation

---

## Lisa's ONE Job: Curate Documentation

**Lisa IS**:
- Documentation librarian
- Knowledge curator
- Topology maintainer (links, indexes, structure)
- Makes KDD discoverable and structured

**Lisa is NOT**:
- Code reviewer
- Pattern enforcer
- Implementation guide generator
- Technical validator

---

## The Two Icebergs (David's Analogy)

### Code Iceberg (James's Domain)
- **Visible**: Running application, UI, features
- **Hidden**: Implementation details, tech stack, architecture decisions, algorithms

### Documentation Iceberg (Lisa's Domain) - EQUAL SIZE
- **Visible**: README, API docs, user guides
- **Hidden**: Patterns, learnings, decisions, anti-patterns, architectural rationale

**KDD Principle**: These two icebergs must stay in sync.

**Lisa's responsibility**: Manage the documentation iceberg (100% of her job)

---

## Who Does What (Corrected Workflow)

### Step 1: Bob (SM) Creates Story
- Bob MAY reference Lisa's patterns when drafting implementation notes
- Bob's workflow can include: "Check existing patterns before suggesting approach"
- Lisa is NOT involved - her docs are referenced

### Step 2: Sarah (PO) Validates Story (Optional)
- Sarah MAY check Bob's architectural suggestions against patterns
- Sarah's workflow: "Validate proposed approach against documented patterns"
- Lisa is NOT involved - her docs are referenced

### Step 4: James (Dev) Implements
- James SHOULD reference patterns, anti-patterns, examples before coding
- James's workflow: "Check existing patterns before implementing"
- Lisa is NOT involved - her docs are referenced

### Step 5: Tyler (SAT) Creates Test Guide
- Tyler MAY use Lisa's documented testing patterns
- Tyler's workflow: "Reference testing patterns for comprehensive coverage"
- Lisa is NOT involved - her docs are referenced

### Step 6: Quinn (QA) Reviews
- **CRITICAL**: Quinn validates James's code against Lisa's patterns
- Quinn's workflow: "Compare implementation to documented patterns, flag inconsistencies"
- Lisa is NOT involved - her docs are used by Quinn

### Step 7: Lisa Curates Knowledge (ONLY STEP LISA APPEARS)
- Lisa extracts learnings from story
- Lisa creates/updates KDD documentation
- Lisa maintains topology (links, indexes, structure)
- Lisa makes docs discoverable

**Key Insight**: Lisa appears AFTER everyone else is done. She documents what was learned.

---

## The Security Disaster (Reframed)

### What Actually Happened

**4 Password Validation Implementations**:
1. auth.ts (23 special chars) - Story X
2. acceptInvitation.ts (29 special chars) - Story Y
3. resetPasswordById.ts (29 special chars) - Story Z
4. validation.ts (incomplete) - Story W

**Root Cause**: Password validation pattern was NEVER documented by Lisa after Story X

### If KDD Had Been Followed

**After Story X** (auth.ts implemented):
1. **Step 7**: Lisa extracts password validation pattern from auth.ts
2. Lisa creates `docs/kdd/patterns/password-validation-pattern.md`:
   ```markdown
   # Password Validation Pattern

   **Canonical Implementation**: `apps/convex/auth.ts:43`

   ## Requirements
   - Min length: 8
   - Max length: 128
   - Special characters: 23 chars `!@#$%^&*(),.?":{}|<>`
   - Must include: uppercase, lowercase, numbers, special chars
   - No 3+ consecutive characters
   - Block common patterns: 123456, password, qwerty, admin

   ## Implementation
   ```typescript
   const PASSWORD_REQUIREMENTS = {
     MIN_LENGTH: 8,
     MAX_LENGTH: 128,
     SPECIAL_CHARS: '!@#$%^&*(),.?":{}|<>',
   }

   function validatePassword(password: string): { valid: boolean; errors: string[] } {
     // Implementation details
   }
   ```

   ## Files Using This Pattern
   - apps/convex/auth.ts (canonical)

   ## Anti-Patterns
   - ❌ Don't inline password regex (use centralized function)
   - ❌ Don't use different special character sets
   - ❌ Don't skip max length check

   ## Related Patterns
   - [Security Constants Pattern](./security-constants-pattern.md)
   - [Password Hashing Pattern](./password-hashing-pattern.md)
   ```

3. Lisa updates `docs/kdd/patterns/index.md`
4. Pattern is now DISCOVERABLE

**During Story Y** (acceptInvitation.ts):
1. **Step 1**: Bob drafts story, references password validation pattern (optional)
2. **Step 2**: Sarah validates Bob's approach against pattern (optional)
3. **Step 4**: James implements, READS password validation pattern, uses auth.ts implementation
4. **Step 6**: Quinn reviews, compares James's code to pattern
   - Quinn sees: James's code matches pattern ✅
   - OR Quinn sees: James's code uses 29 special chars (inconsistent) ❌
   - Quinn flags inconsistency, returns to Dev
5. **Step 7**: Lisa checks if pattern needs updating (no, already documented)

**Result**: Stories Y, Z, W would have used the same pattern. Consistency maintained.

### The Real Failure

**Lisa never created the pattern doc after Story X.**

Without the doc:
- Bob couldn't reference it
- Sarah couldn't validate against it
- James didn't know it existed
- Quinn had nothing to compare against

**Lisa failed to do her ONE job: Document the pattern.**

---

## Workflows (Separate from Agents)

### Workflow 1: Pre-Implementation Pattern Check
**Who**: Sarah (PO)
**When**: Step 2 (optional PO validation)
**Uses**: Lisa's pattern docs
**Actions**:
1. Read story implementation approach from Bob
2. Search Lisa's patterns for related topics
3. Compare Bob's approach to documented patterns
4. Flag architectural deviations
5. Suggest pattern alignment

**Lisa's role**: NONE (her docs are used)

### Workflow 2: Developer Self-Check
**Who**: James (Dev)
**When**: Step 4 (implementation)
**Uses**: Lisa's pattern docs, anti-patterns, examples
**Actions**:
1. Before coding, search for existing patterns
2. Read related patterns, examples, anti-patterns
3. Follow documented patterns in implementation
4. Reference pattern in code comments if appropriate

**Lisa's role**: NONE (her docs are used)

### Workflow 3: Post-Implementation Validation
**Who**: Quinn (QA)
**When**: Step 6 (QA review)
**Uses**: Lisa's pattern docs
**Actions**:
1. Read story implementation (James's code)
2. Identify domain/technical area (password validation, email, auth, etc.)
3. Search Lisa's patterns for related topics
4. Compare implementation to documented patterns
5. Flag inconsistencies
6. Return to Dev with specific pattern violations

**Lisa's role**: NONE (her docs are used)

### Workflow 4: Knowledge Curation
**Who**: Lisa (Librarian)
**When**: Step 7 (after QA pass)
**Uses**: Story learnings, code changes, Quinn's findings
**Actions**:
1. Extract learnings from story (Dev/SAT/QA sections)
2. Categorize knowledge (pattern vs learning vs decision)
3. Check for duplicates (keyword-based)
4. Create KDD documentation
5. Update indexes
6. Validate topology (links, structure)
7. Update story with knowledge asset links

**Lisa's role**: PRIMARY (this is her job)

---

## Lisa's Commands (Corrected)

**Remove these commands** (enforcement, not documentation):
- ~~generate-implementation-brief~~ (Sarah/Bob use workflow)
- ~~validate-code-patterns~~ (Quinn uses workflow)

**Keep these commands** (documentation only):
- `curate`: Extract knowledge from story, create docs, maintain topology
- `validate-topology`: Check KDD structure health (links, indexes, orphans)
- `search-similar`: Find duplicate knowledge (keyword-based)
- `consolidate`: Merge duplicate docs (human approval)
- `regenerate-indexes`: Auto-generate index.md files
- `detect-recurrence`: Identify recurring issues in lessons
- `health-dashboard`: Generate KDD health metrics
- `suggest-structure`: Recommend directory improvements
- `epic-curation`: Consolidate knowledge across epic (post-epic)

---

## Step 7: Lisa's Workflow (Detailed)

**Trigger**: QA (Quinn) marks story as PASS

**Lisa's Process**:

### 1. Extract Knowledge from Story
- Read story file completely
- Parse sections:
  - Dev Agent Record (implementation insights)
  - SAT Results (testing discoveries)
  - QA Results (quality patterns, code issues flagged)
  - Any "Learning" or "KDD" sections
- Identify knowledge types:
  - Patterns (reusable code approaches)
  - Learnings (incidents, debugging, insights)
  - Decisions (architectural choices with rationale)
  - Examples (working code demonstrations)

### 2. Categorize Knowledge
- Use `kdd-categorization-rules.yaml` (configurable)
- Determine document type (pattern, learning, decision, example)
- Identify subdirectory if applicable (deployment, debugging, testing, etc.)
- Determine filename (kebab-case, descriptive)

### 3. Check for Duplicates (Simple)
- Extract keywords from knowledge
- Search existing docs for keyword overlap (60%+ = flag)
- If potential duplicate:
  - Show existing doc
  - Ask: Update existing vs Create new vs Consolidate
  - Human approval for consolidation

### 4. Create KDD Documentation
- Use template (pattern-tmpl.md, learning-tmpl.md, etc.)
- Add frontmatter (title, category, created, story_context, tags, related)
- Write content following template structure
- Save to correct location (docs/kdd/patterns/, docs/kdd/learnings/, etc.)

### 5. Update Indexes (Auto-Generated)
- Regenerate relevant index.md files
- Group by category or subdirectory
- Sort by date or title
- Include metadata (created, story context, tags)

### 6. Validate Topology
- Check all internal links work
- Validate cross-references
- Check for orphaned files (not indexed)
- Identify overloaded directories (> 20 files)
- Generate health report

### 7. Update Story
- Add "Knowledge Assets Created" section to story
- Link to created docs
- Archive story learnings (move to permanent location)

### 8. Gate Decision
- ✅ **PASS**: Knowledge properly filed, topology healthy
- ❌ **FAIL**: Documentation issues (broken links, duplication, wrong placement)
  - Lisa can auto-fix simple issues (move file, fix link)
  - Complex issues (consolidation) require human approval

---

## Quinn's Enhanced QA Workflow (Using Lisa's Docs)

**Current Quinn Workflow** (Step 6):
1. Code quality review
2. Test coverage validation
3. Acceptance criteria verification
4. Security review
5. Performance review

**NEW Addition: Pattern Consistency Check** (uses Lisa's docs):

6. **Pattern Consistency Review**:
   - Identify technical domain from story (password validation, email, auth, etc.)
   - Search Lisa's patterns: `docs/kdd/patterns/`
   - If pattern exists:
     - Read pattern documentation
     - Compare James's implementation to pattern
     - Check for deviations:
       - Different validation rules (special chars, length, etc.)
       - Different error messages
       - Inline implementation vs reusable function
       - Missing anti-pattern checks
   - If pattern doesn't exist:
     - Flag: "No pattern documented for [domain]"
     - Note: Lisa should create pattern in Step 7
   - If inconsistencies found:
     - Document in QA Results section
     - Return to Dev with specific violations
     - Example: "Your password validation uses 29 special chars, pattern specifies 23"

**Quinn's Report** (if inconsistencies found):
```markdown
## QA Results

### Code Quality: ⚠️ CONCERNS

**Pattern Consistency Issues**:

1. **Password Validation Inconsistency**:
   - Pattern: [Password Validation Pattern](../../kdd/patterns/password-validation-pattern.md)
   - Expected: 23 special characters `!@#$%^&*(),.?":{}|<>`
   - Actual: 29 special characters `!@#$%^&*()_+-=[]{};':"|,.<>/?`
   - **Recommendation**: Update code to match pattern or justify deviation

2. **Inline Validation (Anti-Pattern)**:
   - Pattern recommends: Use centralized `validatePassword()` function
   - Actual: Inline regex in acceptInvitation.ts
   - **Recommendation**: Refactor to use shared validation function

**Action Required**: Address pattern inconsistencies before story completion.
```

**Lisa's role in this**: NONE. Quinn uses Lisa's docs. If pattern is missing, Lisa creates it in Step 7.

---

## Sarah's Enhanced PO Workflow (Using Lisa's Docs)

**Current Sarah Workflow** (Step 2, optional):
1. Completeness check
2. Clarity check
3. Alignment check
4. Anti-hallucination check

**NEW Addition: Architectural Pattern Check** (uses Lisa's docs):

5. **Architectural Pattern Review**:
   - Review Bob's proposed implementation approach
   - Search Lisa's patterns for related architectural decisions
   - Check if Bob's approach aligns with documented patterns
   - If deviations:
     - Flag for discussion
     - Ask: Is this intentional deviation or oversight?
   - If patterns missing:
     - Note: Pattern should be created after implementation

**Sarah's Report** (if architectural concerns):
```markdown
## PO Validation Results

### Architectural Alignment: ⚠️ CONCERNS

**Pattern Alignment Issues**:

1. **Password Validation Approach**:
   - Existing pattern: [Password Validation Pattern](../../kdd/patterns/password-validation-pattern.md)
   - Bob's proposal: Create new inline validation function
   - **Question**: Why not use existing centralized validator?
   - **Recommendation**: Clarify if deviation is intentional

**Action**: Discuss with Bob before proceeding to Dev.
```

**Lisa's role in this**: NONE. Sarah uses Lisa's docs.

---

## Comment Rot (Where Does This Live?)

**The Problem**: Code comments claim "matches auth.ts" but code has diverged.

**Example**:
```typescript
// acceptInvitation.ts
// Validate password strength (matches auth.ts validation - 23 special characters)
const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;  // 29 characters!
```

**Who handles this?**

**Option 1: Quinn flags during QA**
- Quinn reads pattern doc (23 chars)
- Quinn reads code comment (claims 23 chars)
- Quinn checks actual code (29 chars)
- Quinn flags: "Comment rot detected - code doesn't match comment or pattern"
- Return to Dev

**Option 2: Lisa documents the pattern clearly**
- Lisa's pattern doc explicitly says: "23 chars: `!@#$%^&*(),.?":{}|<>`"
- Lisa's pattern doc includes anti-pattern: "Don't use different special char sets"
- Quinn uses Lisa's doc to catch the issue

**Conclusion**: **Quinn catches comment rot using Lisa's pattern doc**

**Lisa's role**: Provide accurate pattern documentation so Quinn can validate

---

## Does POEM Need Another Agent?

David asked: "If there's another role in the hierarchy, would you suggest another agent?"

**Analysis**:

**Current agents and their pattern-related roles**:
- **Bob (SM)**: Creates stories, MAY reference patterns (optional)
- **Sarah (PO)**: Validates stories, MAY check architectural patterns (optional)
- **James (Dev)**: Implements code, SHOULD reference patterns (workflow)
- **Tyler (SAT)**: Creates test guide, MAY reference testing patterns (optional)
- **Quinn (QA)**: Reviews code, MUST validate against patterns (critical)
- **Lisa (Librarian)**: Creates/maintains pattern docs (foundational)

**Gap Analysis**:

1. **Pre-implementation guidance**: Currently Sarah (PO) optional check
   - Is this sufficient? Probably yes, if Sarah's workflow is strengthened
   - Alternative: Create dedicated "Architect" agent for pre-implementation review

2. **Pattern discoverability**: Currently relies on agents searching Lisa's docs
   - Is this sufficient? Maybe, if indexes are good and search works
   - Alternative: Create "Pattern Advisor" agent that suggests patterns proactively

3. **Pattern evolution**: Currently ad-hoc (Lisa creates after stories)
   - Is this sufficient? Unknown - need to see if patterns get outdated
   - Alternative: Create "Pattern Curator" agent for periodic pattern reviews

**Recommendation**: **No new agent needed YET**

**Reasons**:
1. Quinn's enhanced workflow (pattern validation) is the critical missing piece
2. Sarah's enhanced workflow (architectural check) closes pre-implementation gap
3. Lisa's documentation is the foundation everyone else builds on
4. Let's see if this structure works before adding complexity

**Revisit later**: If pattern discoverability or evolution becomes a problem, consider:
- **Pattern Advisor** agent: Proactively suggests patterns during story planning
- **Pattern Curator** agent: Periodically reviews patterns for consolidation/updates

---

## Success Metrics (Corrected)

| Metric | Current State | Target | Owner |
|--------|---------------|--------|-------|
| **Pattern Documentation** | 0 (password validation) | 100% (all critical patterns) | **Lisa** |
| **Pattern Consistency** | 25% (1/4 implementations) | 95%+ (Quinn catches deviations) | **Quinn** |
| **Pattern Discoverability** | Unknown | 95%+ (agents find patterns) | **Lisa** (indexes) |
| **Documentation Maintenance** | 7.4 hours/month | < 1 hour/month | **Lisa** |
| **Link Health** | 70% valid | 95%+ valid | **Lisa** |
| **Duplication** | 80% overlap (worst case) | < 30% average | **Lisa** |
| **Knowledge Extraction** | ~40% stories | 100% stories | **Lisa** |

**Key Changes**:
- Pattern consistency is **Quinn's metric** (using Lisa's docs)
- Pattern documentation is **Lisa's metric** (create the docs)
- Quinn can only enforce what Lisa documents

---

## The Critical Dependency

**Lisa's documentation is the foundation for everyone else's validation.**

**If Lisa fails to document a pattern** → Quinn cannot validate against it → Inconsistencies spread

**Example**:
- Story X: James implements password validation in auth.ts
- **Lisa fails to document pattern** (Step 7 skipped or incomplete)
- Story Y: James implements password validation in acceptInvitation.ts
- Quinn has no pattern to compare against (no doc exists)
- Quinn cannot flag inconsistency
- **Inconsistency spreads**

**The Fix**: Lisa MUST extract and document patterns after EVERY story (100% execution rate)

---

## Implementation Priority (Corrected)

**Phase 1 (P0 - Lisa's Core)**:
1. Knowledge extraction workflow (Step 7)
2. Pattern/learning/decision templates
3. Index auto-generation
4. Link validation
5. Duplicate detection (keyword-based)

**Phase 2 (P1 - Quinn's Enhancement)**:
6. Quinn's pattern consistency workflow (Step 6 enhancement)
7. Pattern consistency checklist for Quinn
8. Integration with Lisa's docs (search, compare)

**Phase 3 (P2 - Sarah's Enhancement)**:
9. Sarah's architectural pattern check (Step 2 enhancement)
10. Pattern alignment workflow for Sarah

**Phase 4 (P3 - Nice-to-Have)**:
11. Epic-level curation
12. Health dashboards
13. Structure refactoring

---

## Conclusion

**Lisa's role (corrected)**:
- Lisa is a **documentation librarian** (100% of her job)
- Lisa appears in **Step 7 ONLY**
- Lisa creates/maintains KDD docs that other agents USE

**Pattern enforcement (corrected)**:
- **Quinn validates** code against Lisa's patterns (Step 6)
- **Sarah validates** architecture against Lisa's patterns (Step 2)
- **James self-checks** against Lisa's patterns (Step 4)
- **Lisa documents** patterns for others to use (Step 7)

**The security disaster (reframed)**:
- Root cause: Lisa never documented password validation pattern
- Solution: Lisa documents ALL critical patterns (100% execution rate)
- Prevention: Quinn uses those docs to catch inconsistencies

**Key insight**: Lisa doesn't enforce patterns. Lisa creates the documentation that enables others to enforce patterns.

**David's analogy**: Two icebergs (code + documentation). Lisa manages the documentation iceberg. That's her ONE job, and it's as important as the code iceberg.

---

**Last Updated**: 2026-01-22
**Correction**: Lisa is a librarian, not an enforcer
