# Reference - External Knowledge and Patterns

This folder contains reference materials from external sources that inform POEM's design.

---

## Files in This Folder

| File                      | Source              | Purpose                                  | BMAD Relevance                 |
| ------------------------- | ------------------- | ---------------------------------------- | ------------------------------ |
| `main-app-concepts.md`    | SupportSignal app   | Domain concepts, patterns from main app  | BA, PRD (domain understanding) |
| `bmad-reference.md`       | BMAD v4/v6          | BMAD methodology quick reference         | All specialists                |
| `data-dictionary.md`      | SupportSignal       | Data integration requirements            | PRD, Architect                 |
| `glossary.md`             | POEM planning       | Terminology reference                    | All specialists                |
| `bmad-pattern-example.md` | BMAD patterns       | Task/Template/Checklist concrete example | All specialists                |
| `examples.md`             | SupportSignal + VOZ | Two domain examples (NDIS + Storyline)   | BA, PRD (use cases)            |

---

## External Second Brains

POEM draws on knowledge from these curated second brains:

### 1. Claude Skills Brain

**Location**: `/Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/`
**Index**: [INDEX.md](file:///Users/davidcruwys/dev/ad/brains/anthropic-claude/skills/INDEX.md)

**What it contains**:

- Anthropic skills specification
- Best practices for skill development
- Progressive disclosure patterns
- Example skills repository

**Relevant for**:

- Understanding POEM's 8 skills architecture
- Skill file structure (.../SKILL.md pattern)
- Metadata → Instructions → Resources pattern

---

### 2. LLM Structured Data Brain

**Location**: `/Users/davidcruwys/dev/ad/brains/llm-structured-data/`
**Index**: [INDEX.md](file:///Users/davidcruwys/dev/ad/brains/llm-structured-data/INDEX.md)

**What it contains**:

- TOON (Token-Oriented Object Notation) - 40-60% token savings
- JSON schema patterns
- Structured data best practices for LLMs

**Relevant for**:

- Schema format decisions
- Large data optimization (mock data, examples)
- Token-efficient data representation

---

### 3. BMAD Method Brain

**Location**: `/Users/davidcruwys/dev/ad/brains/bmad-method/`
**Index**: [INDEX.md](file:///Users/davidcruwys/dev/ad/brains/bmad-method/INDEX.md)

**What it contains**:

- BMAD v4 (stable, template-driven, fast)
- BMAD v6-alpha (interactive, team-focused)
- Workflow comparison (Quick Flow vs BMad Method vs Enterprise)
- Agent system (BA/Mary, PM/John, Architect/Winston, Dev/Amelia, etc.)

**Relevant for**:

- POEM's agent structure (inspired by BMAD v4)
- Workflow patterns (.poem-core/ mirrors .bmad-core/)
- Task/Template/Checklist pattern
- Solo-optimized vs team-optimized approaches

**Key decision**: POEM uses BMAD v4 patterns (3x faster, template-driven, stable)

---

## Domain Examples

### SupportSignal (NDIS Healthcare)

**File**: `examples.md` (SupportSignal section)

**Why it matters**:

- **Compliance-critical**: Government-funded care, cannot afford errors
- **Precision required**: Incorrect documentation has real-world consequences
- **Audit trail needed**: Legal and regulatory requirements

**What POEM enables**:

- Test prompts rigorously before production
- Validate compliance without touching real data
- Version control for audit trail

### Storyline (Creative Production)

**File**: `examples.md` (Storyline section)

**Why it matters**:

- **Multi-step transformation**: 631 words → 21KB structured JSON
- **Pipeline orchestration**: Character extraction → Style → Beats → Shots
- **Creative complexity**: Visual + audio + emotion layers

**What POEM enables**:

- Test transformation pipelines
- Iterate on creative prompts
- Validate output structure

---

## For BMAD Specialists

### Business Analyst (Mary)

**Start here**:

- `examples.md` - Domain understanding
- `main-app-concepts.md` - SupportSignal patterns
- Second brains for context (skim, don't deep-dive)

**Use for**:

- Understanding POEM's value proposition
- Domain context (NDIS compliance, creative production)
- User needs and pain points

---

### PRD Writer (John)

**Start here**:

- `main-app-concepts.md` - Technical patterns to adopt
- `data-dictionary.md` - Data integration requirements
- `examples.md` - Use cases and scenarios

**Use for**:

- Functional requirements
- Integration specifications
- User stories and scenarios

---

### Architect (Winston)

**Start here**:

- `bmad-reference.md` - BMAD patterns (reference, not constraint)
- BMAD Method Brain - v4 patterns we explored
- Claude Skills Brain - Skills architecture patterns

**Use for**:

- Reference architectures (not mandates)
- Proven patterns (consider, don't copy)
- Technology patterns

**Remember**: These are REFERENCES, not specifications. Design freely.

---

## Terminology Clarity

**Read**: `glossary.md` for POEM-specific terms

**Key confusions to avoid**:

- "Template" has two meanings (BMAD template vs prompt template)
- "Prompt" vs "Rendered Prompt" (template vs output)
- "Payload" (internal API concept, TBD if needed)

---

## How to Use Reference Materials

1. **Don't read everything**: Skim what's relevant to your role
2. **External knowledge**: These are patterns to inform, not dictate
3. **Second brains**: Deep knowledge bases, refer when needed
4. **Domain examples**: Understand WHY POEM exists
5. **Glossary**: Reference when terminology is unclear

---

**Created**: 2025-11-21
**Purpose**: Index external knowledge and patterns
**Maintained by**: Planning team, used by BMAD specialists
