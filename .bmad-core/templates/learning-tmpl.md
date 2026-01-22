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

# {Topic} - {Issue Name} Learning

> **Issue**: {issue-name}
> **Category**: {category}
> **Story**: {story_reference}
> **Severity**: {severity}

## Problem Signature

### Symptoms
{Describe observable symptoms or errors}
- Error message: `{exact error message if applicable}`
- Affected component: {which part of system}
- When it occurs: {triggering conditions}

### Error Details
```
{Full error message or stack trace}
{Include relevant log excerpts}
```

### Environment
- **Technology Stack**: {Node.js version, framework versions, etc.}
- **Environment**: {Development | Staging | Production}
- **Configuration**: {Relevant config settings}

### Triggering Conditions
{What actions or conditions cause this issue?}
1. {Condition 1}
2. {Condition 2}
3. {Additional conditions}

## Root Cause

### Technical Analysis
{Deep dive into why this issue occurred}
{Explain the underlying technical problem}

### Contributing Factors
- **Factor 1**: {Description}
- **Factor 2**: {Description}
- **Factor 3**: {Description}

### Why It Wasn't Caught Earlier
{Why didn't tests, code review, or earlier stages catch this?}
{What gaps in process or coverage allowed this through?}

## Solution

### Resolution Steps
1. {First step taken to resolve}
   - Command/code: `{command or code change}`
   - Result: {outcome}
2. {Second step}
   - Command/code: `{command or code change}`
   - Result: {outcome}
3. {Additional steps as needed}

### Code Changes
{If code changes were required, show before/after}

**Before**:
```{language}
{Code that caused the issue}
```

**After**:
```{language}
{Fixed code}
```

### Configuration Changes
{Any configuration updates required}

### Verification
{How was the fix verified?}
- {Test 1}
- {Test 2}
- {Manual verification steps}

### Time to Resolve
**Total Time**: {hours or days from discovery to resolution}
**Breakdown**:
- Investigation: {time}
- Implementation: {time}
- Testing: {time}

## Prevention

### How to Prevent This in Future Stories

**For Developers (James)**:
- ✅ {Prevention measure 1}
- ✅ {Prevention measure 2}
- ✅ {Prevention measure 3}

**For QA (Quinn)**:
- ✅ {Review checklist item to catch this}
- ✅ {Test scenario to validate prevention}

**For Story Creation (Bob)**:
- ✅ {Story requirement to include}
- ✅ {Acceptance criteria to prevent}

### Recommended Patterns
{If this issue occurs 3+ times, promote to pattern}
- Consider creating: [{domain}-{topic}-pattern.md](../patterns/{domain}-{topic}-pattern.md)

### Tests Added
{New test cases created to prevent recurrence}
```{language}
{Example test code}
```

## Related Incidents

### Previous Occurrences
{If this issue recurred, list previous stories}
- **Story {X.Y}**: [{issue-title}](./{previous-learning-file}.md) - {date}
- **Story {A.B}**: [{issue-title}](./{another-learning-file}.md) - {date}

### Similar Issues
- [{related-issue}](./{related-file}.md): {How they relate}

### Pattern Promotion Status
{If recurrence_count >= 3}
- **Status**: {Candidate for Pattern | Promoted to Pattern}
- **Pattern**: [{pattern-name}](../patterns/{pattern-file}.md)

## Lessons Learned

### Key Takeaways
1. {Lesson 1}
2. {Lesson 2}
3. {Lesson 3}

### Impact Assessment
- **Time Lost**: {hours/days}
- **Scope**: {Local to story | Affects multiple stories | System-wide}
- **Preventability**: {Could have been prevented | Unavoidable | Requires external fix}

## References

- Story: [Story {number}](../../stories/{number}.story.md)
- Related patterns: {Links to patterns}
- External documentation: {Links to external resources}
- Commit: {git commit hash if applicable}

---

**Learning documented by**: Lisa (Librarian)
**Status**: {Active | Resolved | Recurring}
