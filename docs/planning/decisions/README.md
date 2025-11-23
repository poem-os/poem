# Decisions - Technology Choices and Open Questions

This folder contains decision documentation for POEM's technology choices and architectural approaches.

---

## Decision Status Log

| Decision | Status | File | Final Choice | Date | Notes |
|----------|--------|------|--------------|------|-------|
| **Handlebars Templating** | ✅ **Decided** | `handlebars-templating.md` | Use Handlebars (.hbs extension) | 2025-11-20 | All prompts use .hbs, strong rationale documented |
| **Schema Format** | 📋 **Leaning** | `schema-format-alternatives.md` | Custom JSON (open to Architect ideas) | - | Simple approach preferred, but Architect can choose alternative |
| **Fourth Agent** | 📋 **Decided Need, Details TBD** | `../system-explorations/agents.md` | Will have 4th agent (Data/Testing), specifics pending | - | Mock data complexity suggests need, but implementation details require more discovery |
| **Mapping Architecture** | 📋 **Deferred (YAGNI)** | `mapping-architecture-concepts.md` | Build when needed | 2025-11-20 | Don't over-engineer, implement if use cases emerge |

---

## Decision Categories

### ✅ Decided

Choices that have been made and documented:
- **Handlebars Templating**: Using Handlebars for template engine

### 📋 Leaning / Pending

Preferences indicated, but open to BMAD specialist input:
- **Schema Format**: Leaning toward Custom JSON, but Architect should choose
- **Fourth Agent**: Decided we want one, details need more information

### 🔄 Deferred

Decisions postponed until more information available:
- **Mapping Architecture**: YAGNI - build when use cases emerge

---

## For BMAD Specialists

### Business Analyst
- Use decided items as constraints
- Note open questions for PRD
- Leaning items are suggestions, not requirements

### PRD Writer
- Document decided items as requirements
- Present alternatives for open decisions
- Include rationale from decision files

### Architect
- Respect decided items (unless strong rationale to change)
- Make final call on "leaning" items
- Question assumptions if needed
- Document your architectural decisions separately

---

## How to Use Decision Files

Each decision file includes:
1. **Current Status**: Exploring, Decided, Deferred
2. **Problem Statement**: What we're deciding
3. **Alternatives**: Options considered
4. **Rationale**: Why each option matters
5. **BMAD Ready**: Whether ready for handoff

---

## Adding New Decisions

When documenting a decision:

1. Create new file: `decision-name.md`
2. Follow template:
   ```markdown
   # Decision: [Name]

   **Status**: Exploring / Decided / Deferred
   **Date**: YYYY-MM-DD
   **BMAD Ready**: Yes / No / Partial

   ## Problem
   [What are we deciding?]

   ## Alternatives
   ### Option 1: [Name]
   - Pros: ...
   - Cons: ...

   ### Option 2: [Name]
   - Pros: ...
   - Cons: ...

   ## Recommendation
   [If status is Decided]

   ## Rationale
   [Why this choice?]
   ```

3. Update this README decision log table
4. Reference in POEM.md if critical

---

**Created**: 2025-11-21
**Purpose**: Track technology choices and architectural decisions
**Maintained by**: Planning team, handed to BMAD specialists
