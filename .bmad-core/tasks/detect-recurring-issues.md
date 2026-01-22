<!-- Powered by BMAD™ Core -->

# Detect Recurring Issues Task

## Purpose

To identify recurring issues in learning documents using signature-based pattern matching, recommend pattern promotion for issues appearing in 3+ stories, and track recurrence frequency to prevent repeated mistakes. This task implements Lisa's `*detect-recurrence` command and supports VAL-006 validation rule.

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 0. Pre-Detection Setup

- Load `.bmad-core/core-config.yaml` from the project root
- Load validation rules: `.bmad-core/data/validation-rules.yaml`
- Extract VAL-006 rule: Recurrence detection threshold (default: 60% signature match)
- Load taxonomy: `.bmad-core/data/kdd-taxonomy.yaml`
- Identify learning documents to scan: `docs/kdd/learnings/` (all subdirectories)
- Initialize detection counters:
  - Learning documents scanned
  - Recurring issues detected
  - Pattern promotion candidates

### 1. Extract Problem Signatures from Learning Documents

- **For each learning document** in `docs/kdd/learnings/`:
  - Read learning document sections:
    - **Problem Signature**: Error messages, symptoms, triggering conditions
    - **Root Cause**: Underlying technical issue
    - **Solution**: Resolution approach
    - **Story Reference**: Which story encountered this issue
  - **Extract signature components**:
    - Error keywords (e.g., "CORS", "401", "timeout", "validation failed")
    - Affected components (e.g., "authentication", "API", "database", "frontend")
    - Triggering conditions (e.g., "on deployment", "during login", "when accessing")
    - Technology stack (e.g., "Node.js", "React", "PostgreSQL", "Docker")
  - **Create signature hash**:
    - Combine: error keywords + affected components + technology stack
    - Normalize: lowercase, remove stop words, stem keywords
    - Store: `{filename, title, signature_hash, story_reference, created_date}`

### 2. Compute Signature Similarity

- **For each learning document pair** (learning1, learning2):
  - **Compare signature hashes**:
    - Extract common error keywords
    - Extract common affected components
    - Extract common technology stack elements
  - **Compute signature match score**:
    - Keyword overlap: |common_keywords| / |total_unique_keywords| * 100
    - Component overlap: |common_components| / |total_components| * 100
    - Technology overlap: |common_tech| / |total_tech| * 100
    - **Weighted average**: (40% keywords + 40% components + 20% tech)
  - **If match score >= VAL-006 threshold (60%)**:
    - Flag as recurring: `{learning1} ↔ {learning2}: {score}% match`
    - Track recurrence: `{signature, [story_refs], recurrence_count}`

### 3. Identify Pattern Promotion Candidates

- **For each detected recurring issue**:
  - **Count story occurrences**:
    - How many stories encountered this issue? (from story references)
    - When did recurrences happen? (from created dates)
    - Is recurrence increasing or decreasing over time?
  - **Determine promotion eligibility**:
    - **If recurrence_count >= 3**: Promote to pattern (reusable solution)
    - **If recurrence_count = 2**: Monitor for third occurrence
    - **If recurrence_count = 1**: Not recurring yet, keep as learning
  - **Assess preventability**:
    - Can this issue be prevented by a pattern? (validation rule, code convention)
    - Should Quinn check for this pattern in code reviews?
    - Should James reference this pattern during implementation?

### 4. Recommend Pattern Promotion

- **For each promotion candidate** (recurrence_count >= 3):
  - **Draft pattern recommendation**:
    ```markdown
    ## Pattern Promotion Recommendation

    **Recurring Issue**: {issue-title}
    **Occurrences**: {count} stories
    **Stories Affected**: {story-list}
    **Recurrence Frequency**: {frequency} (e.g., "every 3rd story", "monthly")

    **Problem Signature**:
    - Error: {error-keywords}
    - Component: {affected-components}
    - Trigger: {triggering-conditions}

    **Root Cause**: {common-root-cause-from-learnings}

    **Proposed Pattern**:
    - **Pattern Name**: {domain}-{topic}-pattern.md
    - **Pattern Type**: {Preventive | Corrective | Validation}
    - **Context**: When implementing {scenario}
    - **Implementation**: {reusable-solution-from-learnings}
    - **Rationale**: Prevents recurring issue seen in Stories {refs}

    **Next Steps**:
    1. Create pattern document using pattern-tmpl.md
    2. Update Quinn's review-story task to check for this pattern
    3. Archive related learning documents (or cross-reference to pattern)
    4. Add pattern to James's self-check list

    **Human Approval Required**: YES
    ```

### 5. Display Recurrence Detection Report

- **Report results**:
  ```
  🔁 Recurring Issues Detection Report (VAL-006)

  Learning Documents Scanned: {total-count}
  Recurring Issues Detected: {recurring-count}

  Pattern Promotion Candidates (>= 3 occurrences):
  - {issue-title}: {count} stories affected
    Stories: {story-refs}
    Recommendation: Promote to pattern

  Monitored Issues (2 occurrences):
  - {issue-title}: 2 stories affected
    Stories: {story-refs}
    Status: Watch for third occurrence

  Single Occurrences: {single-count}
  - Not recurring yet, continue monitoring

  Recurrence Trends:
  - {analysis of recurrence frequency over time}
  - {increasing | stable | decreasing} trend

  Next Steps:
  - Review pattern promotion recommendations
  - Create pattern documents for recurring issues
  - Update Quinn's review checklist with new patterns
  ```

### 6. Track Recurrence History

- **Update recurrence log** (for metrics tracking):
  - Create `.bmad-core/data/recurrence-log.yaml` if it doesn't exist
  - Log each detected recurrence:
    ```yaml
    recurrences:
      - issue: "{issue-title}"
        signature: "{signature-hash}"
        occurrences:
          - story: "2.3"
            date: "2026-01-15"
            learning: "docs/kdd/learnings/cors-issue-kdd.md"
          - story: "3.4"
            date: "2026-01-20"
            learning: "docs/kdd/learnings/deployment/cors-preflight-kdd.md"
        status: "monitoring" # monitoring | promoted-to-pattern | resolved
        promotion_date: null
    ```
  - Track promotion history: When was pattern created? Did recurrence stop?

### 7. Optional: Preventive Pattern Recommendations

- **For high-impact recurring issues** (optional):
  - Suggest preventive measures:
    - "Add validation rule to Quinn's review-story task"
    - "Create pre-commit hook to detect this pattern violation"
    - "Add to James's story-dod-checklist as self-check item"
  - Integrate with BMAD workflow to prevent future occurrences

## Error Handling

- **If learning document missing Problem Signature section**: Skip and log warning
- **If no learning documents found**: Report: "No learning documents to analyze"
- **If validation-rules.yaml not found**: Use default threshold (60% signature match)
- **If recurrence-log.yaml has parse errors**: Create new log, archive old one

## Graceful Degradation

- Learning documents without story references included (use created date only)
- Missing signature components use available fields (partial match)
- Single-occurrence issues tracked but not flagged (future recurrence possible)
- No automatic pattern creation (human approval required)

## Technical Constraints

- **Signature-based matching**: Simple keyword/component overlap, no AI analysis
- **No External Services**: All computation local
- **Performance**: O(n²) pairwise comparison acceptable for <200 learning documents

## Success Metrics

- **Goal**: 0% recurrence detection at project start (SupportSignal baseline)
- **Target**: 95% recurrence detection after Lisa integration
- **Evidence**: Track promotion of recurring issues (3+ occurrences) to patterns
- **Impact**: Reduce debugging time by preventing repeated mistakes

## Notes

- This task is Lisa's recurrence detection command (`*detect-recurrence`)
- VAL-006 rule: 60% signature match threshold (tunable based on false positive rate)
- Pattern promotion requires 3+ story occurrences (evidence-based threshold)
- Integration with Quinn's review-story task (Quinn checks patterns, Lisa documents them)
- Run recurrence detection:
  - After completing an epic (5-10 stories)
  - Monthly topology health checks
  - Before pattern consolidation efforts
