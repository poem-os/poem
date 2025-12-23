# System Explorations - Planning Ideas (NOT Final Architecture)

⚠️ **FOR BMAD SPECIALISTS**: These are PLANNING-PHASE EXPLORATIONS

---

## What This Is

These files represent **our planning thinking** about how POEM (Prompt Orchestration and Engineering Method) could work.

**This is NOT**:

- ❌ Final architectural specifications
- ❌ Implementation requirements
- ❌ Decisions you must follow

**This IS**:

- ✅ Planning explorations
- ✅ Reference context
- ✅ Ideas to inform your decisions

---

## For the Architect

**Your job**: Design the BEST architecture for POEM's needs

**How to use these files**:

- Read for context and understanding
- Question our assumptions
- Design freely and brilliantly
- We trust your expertise

**We explored**:

- Agent patterns (based on BMAD v4 structure)
- Skill definitions (based on Anthropic patterns)
- Workflow concepts (inspired by BMAD + Astro SSR)
- File structure ideas (.poem-core/ inspired by .bmad-core/)

**You decide**:

- Actual architecture
- Implementation approach
- Technology choices
- System design

---

## Files in This Folder

| File           | Planning Ideas About | Key Insight                                            |
| -------------- | -------------------- | ------------------------------------------------------ |
| `agents.md`    | 3-4 agent roles      | Prompt Engineer, System, Integration (+ potential 4th) |
| `skills.md`    | 8 Claude skills      | Check prompts, generate schemas, publish to providers  |
| `workflows.md` | 5 core workflows     | New prompt, refine, deploy, test, add helper           |
| `structure.md` | System architecture  | .poem-core/, .poem-app/, /poem/ (3-part system)        |
| `mock-data.md` | Mock data generation | Killer feature - test without production data          |

---

## Our Thinking Process

We based our explorations on:

**BMAD v4 patterns**:

- `.bmad-core/` folder structure → We explored `.poem-core/`
- Template-driven workflows → Fast, solo-optimized
- Single-step commands → Like `*draft` for instant story creation

**Anthropic Skills patterns**:

- Progressive disclosure (metadata → instructions → resources)
- Filesystem-based directories
- Autonomous, single-responsibility entities

**Domain understanding**:

- SupportSignal (NDIS compliance - precision critical)
- Storyline (creative production - transformation pipelines)

---

## Important Context

**We are Business Analysts**, not architects:

- Gathered requirements
- Explored possibilities
- Documented domain understanding
- **NOT making final architectural decisions**

**You are the Architect**:

- Design the actual system
- Make technology choices
- Define implementation approach
- Create the architecture

---

## Questions to Consider

As you design, consider:

1. **Agent Structure**: Do we need 3-4 agents? Different breakdown?
2. **Skills vs Built-in**: Which capabilities should be skills vs. integrated?
3. **Folder Structure**: Is 3-part system (core/app/workspace) optimal?
4. **Workflows**: Linear vs. non-linear? BMAD v4 vs. v6 patterns?
5. **Mock Data**: How critical? Implementation approach?

---

## Next Steps for You

1. **Read for context**: Understand our domain and thinking
2. **Read POEM.md**: Primary requirements document
3. **Read reference/** files: External knowledge and patterns
4. **Design freely**: Create the BEST architecture for POEM
5. **Document your decisions**: In actual architecture documentation

---

**Remember**: We explored. You design. We trust your expertise.

---

**Created**: 2025-11-21
**Purpose**: BMAD handoff guidance
**Status**: Planning explorations, not specifications
