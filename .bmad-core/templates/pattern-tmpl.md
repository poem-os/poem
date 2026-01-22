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

# {Domain} - {Topic} Pattern

> **Pattern Name**: {domain}-{topic}-pattern
> **Type**: {pattern_type}
> **Status**: {status}
> **First Used**: Story {story_reference}

## Context

**When to use this pattern**:
- {Describe the scenario or problem this pattern addresses}
- {Identify triggering conditions or use cases}
- {Explain when this pattern is appropriate vs alternatives}

**Problem Statement**:
{Brief description of the problem this pattern solves}

## Implementation

### Overview
{High-level description of the pattern implementation}

### Code Structure
```{language}
{Example code demonstrating the pattern}
{Include key functions, classes, or components}
{Show the essential structure, not complete implementation}
```

### Step-by-Step Implementation
1. {First implementation step}
   - {Details or considerations}
2. {Second implementation step}
   - {Details or considerations}
3. {Additional steps as needed}

### Key Components
- **{Component 1}**: {Purpose and role}
- **{Component 2}**: {Purpose and role}
- **{Component 3}**: {Purpose and role}

### Configuration
{Any configuration required for this pattern}
{Environment variables, settings, dependencies}

## Examples

### Example 1: {Use Case Name}
{Context: When this example applies}

```{language}
{Working code example demonstrating the pattern}
{Show realistic usage, not just abstract structure}
```

**Result**: {What this example achieves}

### Example 2: {Another Use Case Name}
{Context: Different scenario using same pattern}

```{language}
{Second working code example}
```

**Result**: {What this example achieves}

### Common Variations
- **Variation 1**: {When to use this variation}
- **Variation 2**: {When to use this variation}

## Rationale

### Why This Approach?
{Explain the reasoning behind this pattern}
{What makes this the preferred solution?}

### Benefits
- ✅ {Benefit 1}
- ✅ {Benefit 2}
- ✅ {Benefit 3}

### Trade-offs
- ⚠️ {Trade-off or limitation 1}
- ⚠️ {Trade-off or limitation 2}

### Alternatives Considered
- **Alternative 1**: {Brief description and why not chosen}
- **Alternative 2**: {Brief description and why not chosen}

## Related Patterns

- **[{Related Pattern Name}](./{related-pattern-file}.md)**: {How patterns relate}
- **[{Another Pattern}](./{another-pattern-file}.md)**: {How patterns relate}

## Testing Considerations

{How to test implementations of this pattern}
{Key test scenarios to validate pattern usage}

## References

- Story: [Story {number}](../../stories/{number}.story.md)
- Additional documentation: {Links to architecture docs, ADRs, etc.}
- External resources: {Links to articles, RFCs, or standards if applicable}

---

**Pattern maintained by**: Lisa (Librarian)
**Last reviewed**: {YYYY-MM-DD}
