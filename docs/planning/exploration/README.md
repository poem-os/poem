# Exploration - Discovery Journey

This folder contains the historical journey of how we discovered POEM.

---

## The Journey

**From**: SupportSignal-specific prompt management tool
**To**: Open-source Prompt Engineering Operating System (POEM)

**Why this matters**: Understanding the journey helps understand the _why_ behind POEM's design.

---

## Files in This Folder

| File                         | Date       | Purpose                         | Superseded?                |
| ---------------------------- | ---------- | ------------------------------- | -------------------------- |
| `brief.md`                   | 2025-11-08 | Original project brief          | Partially (see poem-requirements.md)    |
| `application-type-README.md` | 2025-11-18 | Discovery journey to OS concept | No - explains evolution    |
| `conventional-types.md`      | 2025-11-18 | Early app type exploration      | Yes - but useful context   |
| `naming.md`                  | 2025-11-20 | POEM naming journey             | No - explains brand choice |

---

## The Evolution

### Phase 1: SupportSignal Tool (Nov 8)

**Problem**: Prompt management slowing down main app
**Solution**: Separate prompts application
**Thinking**: Simple text files + Astro visualization

### Phase 2: Questioning Application Type (Nov 18)

**Question**: "What sort of application are we building?"
**Discovery**: Not a web app, not a CLI, not traditional
**Realization**: More like BMAD - an orchestration system

### Phase 3: OS Breakthrough (Nov 18)

**Breakthrough**: POEM is an **Operating System** for prompt engineering
**Analogy**: Like BMAD is an OS for software development
**Impact**: Changed entire architectural thinking

### Phase 4: Open Source Pivot (Nov 20)

**Decision**: Not just for SupportSignal, but open source
**Name**: POEM (Prompt Orchestration and Engineering Method)
**NPM**: `poem-os` package

---

## Key Discoveries

### 1. It's an Operating System

Not a traditional application with CRUD and database:

- **Claude Code** = Platform (like Linux kernel)
- **BMAD** = Application OS (like Ubuntu)
- **POEM** = Domain-specific OS (like Docker for containers)

### 2. Agents + Skills Pattern

Combination of:

- **Agents**: Role-based AI assistants (Prompt Engineer, System, Integration)
- **Skills**: Single-responsibility capabilities (Check prompt, Generate schema)
- **Workflows**: Orchestrated procedures (Create prompt, Deploy, Test)

### 3. Three-Part System

- `.poem-core/` - The OS (agents, workflows, brain)
- `.poem-app/` - Infrastructure (Astro, APIs, services)
- `/poem/` - User workspace (prompts, schemas, mappings)

### 4. Mock Data as Killer Feature

Not just "test prompts" but:

- Generate realistic test data
- Privacy-safe (no production access)
- Rapid iteration
- Complete workflow testing

---

## For BMAD Business Analyst

**Why read this folder**:

- Understand POEM's evolution
- See decision journey
- Context for requirements
- Domain understanding

**Key insights**:

1. Started as SupportSignal internal tool
2. Evolved to open source
3. OS metaphor is central
4. Mock data is critical value prop

**Don't get lost in details**:

- Focus on poem-requirements.md for current requirements
- Use this for "why" questions
- Historical context, not specifications

---

## For Future Reference

**If you're wondering**:

- "Why is it called POEM?" → See `naming.md`
- "Why an OS not a web app?" → See `application-type-README.md`
- "What was the original plan?" → See `brief.md`
- "How did thinking evolve?" → Read files in chronological order

---

## Archived Files

Files marked as fully extracted have been moved to `/archive/`:

- `current-thinking-prompt-os-archive.md` → Content extracted into system-explorations/

---

**Created**: 2025-11-21
**Purpose**: Document discovery journey for context
**Audience**: BMAD specialists, future maintainers, historical reference
