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

# ADR-{NNN}: {Decision Title}

> **Status**: {status}
> **Date**: {decision_date}
> **Story**: {story_reference}

## Status

**{STATUS}** - {decision_date}

{If Superseded: This ADR has been superseded by [ADR-{XXX}: {Title}](./adr-{XXX}-{slug}.md)}
{If Supersedes: This ADR supersedes [ADR-{XXX}: {Title}](./adr-{XXX}-{slug}.md)}

## Context

### Background
{What is the issue or situation that requires a decision?}
{Provide technical and business context}

### Problem Statement
{Clear, concise statement of the problem to be solved}

### Forces at Play
{Describe the factors influencing the decision}
- **Force 1**: {Description}
- **Force 2**: {Description}
- **Force 3**: {Description}

### Assumptions
{Any assumptions made during decision-making}
- {Assumption 1}
- {Assumption 2}

### Constraints
{Technical, business, or organizational constraints}
- {Constraint 1}
- {Constraint 2}

## Decision

**We will {concise statement of decision}.**

### Detailed Decision
{Elaborate on the decision}
{What exactly are we committing to?}

### Implementation Approach
{High-level implementation strategy}
1. {Step 1}
2. {Step 2}
3. {Step 3}

### Scope
{What is in scope and out of scope for this decision}
- **In Scope**: {What this decision covers}
- **Out of Scope**: {What this decision does NOT cover}

## Alternatives Considered

### Alternative 1: {Name}
{Description of this alternative}

**Pros**:
- ✅ {Advantage 1}
- ✅ {Advantage 2}

**Cons**:
- ❌ {Disadvantage 1}
- ❌ {Disadvantage 2}

**Why Not Chosen**: {Rationale for rejection}

### Alternative 2: {Name}
{Description of this alternative}

**Pros**:
- ✅ {Advantage 1}
- ✅ {Advantage 2}

**Cons**:
- ❌ {Disadvantage 1}
- ❌ {Disadvantage 2}

**Why Not Chosen**: {Rationale for rejection}

### Alternative 3: Status Quo (Do Nothing)
{What happens if we don't make any decision?}

**Pros**:
- ✅ {Advantage of status quo}

**Cons**:
- ❌ {Problem that remains unsolved}

**Why Not Chosen**: {Why inaction is worse than chosen decision}

## Rationale

### Why This Decision?
{Explain the reasoning behind choosing this option}
{What makes this the best choice given the context?}

### Decision Criteria
{What criteria were used to evaluate alternatives?}
- **{Criterion 1}**: {How chosen option scores}
- **{Criterion 2}**: {How chosen option scores}
- **{Criterion 3}**: {How chosen option scores}

### Alignment
- **Technical Strategy**: {How this aligns with technical direction}
- **Business Goals**: {How this supports business objectives}
- **Architectural Principles**: {How this follows architectural guidelines}

### Risk Mitigation
{How does this decision reduce or manage risk?}

## Consequences

### Positive Consequences
- ✅ {Benefit 1}
- ✅ {Benefit 2}
- ✅ {Benefit 3}

### Negative Consequences
- ⚠️ {Trade-off or limitation 1}
- ⚠️ {Trade-off or limitation 2}

### Technical Debt
{Any technical debt introduced by this decision?}
{Mitigation strategy for the debt?}

### Impact on Stories
{How will this decision affect future story implementation?}
- {Impact 1}
- {Impact 2}

### Reversibility
**Can this decision be reversed?** {Yes | No | Partially}
{If yes: What would reversal cost?}
{If no: Why is this decision irreversible?}

## Implementation

### Affected Components
{Which parts of the system are affected?}
- {Component 1}
- {Component 2}
- {Component 3}

### Required Changes
{What needs to change to implement this decision?}
- **Code Changes**: {Description}
- **Infrastructure Changes**: {Description}
- **Process Changes**: {Description}

### Timeline
- **Decision Date**: {YYYY-MM-DD}
- **Implementation Start**: {YYYY-MM-DD}
- **Expected Completion**: {YYYY-MM-DD}
- **Review Date**: {YYYY-MM-DD} (when to re-evaluate)

### Success Criteria
{How will we know this decision was successful?}
- {Measurable criterion 1}
- {Measurable criterion 2}
- {Measurable criterion 3}

## Related Decisions

- **Related ADR**: [ADR-{XXX}: {Title}](./adr-{XXX}-{slug}.md) - {How they relate}
- **Related Pattern**: [{Pattern Name}](../patterns/{pattern-file}.md)

## References

- Story: [Story {number}](../../stories/{number}.story.md)
- Architecture docs: {Links to relevant architecture documentation}
- External resources: {Links to RFCs, standards, articles}
- Discussion: {Links to discussions, PRs, or design documents}

## Notes

{Any additional context, future considerations, or follow-up items}

---

**ADR maintained by**: Lisa (Librarian)
**Last updated**: {YYYY-MM-DD}
