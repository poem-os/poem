# Application Type Exploration

**Purpose**: Understanding what TYPE of application we're building architecturally

---

## Quick Navigation

### 🎯 Current Thinking (Start Here)

**[current-thinking-prompt-os.md](./current-thinking-prompt-os.md)** - We're building a **Prompt Engineering Operating System** that runs on Claude Code

**Key insights**:

- Not a web app, not a CLI tool, not a traditional application
- Similar to how BMAD is a "Software Development OS" on Claude Code
- Orchestrates agents/skills to build, test, validate, and deploy prompts
- Astro is just the visualization layer (like Finder or Windows Explorer)
- Likely needs fewer agents than BMAD (1-6 instead of 10)
- Integration is done through tools (Skills, MCP, future innovations)

---

## Documents

### Current Thinking (2025-11-18) - **START HERE**

**[current-thinking-prompt-os.md](./current-thinking-prompt-os.md)**

Breakthrough session exploring OS/kernel analogies and BMAD parallels.

**What changed**: Realized we're building an OPERATING SYSTEM for prompt engineering, not a traditional application.

**Key concepts**:

- Claude Code = OS (platform layer)
- BMAD = Application OS (orchestration framework)
- Our system = Prompt Engineering OS (domain-specific orchestration)
- Agents are polyglot and goal-oriented
- Fewer agents than BMAD, more use of skills/sub-agents
- Systematization + automation (not just automation)

---

### Earlier Exploration (2025-11-18) - Historical

**[exploration-conventional-types.md](./exploration-conventional-types.md)**

Early exploration analyzing conventional application architectures (Web, Mobile, CLI, Agent Orchestration).

**Why superseded**: Focused on WHAT the app DOES (features) rather than WHAT TYPE of architecture it represents.

**Useful as background**, but current thinking has moved beyond this.

**What we learned**:

- Not Type A (Web app) - no backend, no database, no CRUD
- Not Type B (Mobile) - no mobile components
- Not Type C (CLI) - has Astro visualization
- Partially Type D (Agent Orchestration) - but not complete understanding

**Content in this document**:

- Three feature-based interpretations (Template Library, Engineering Workbench, Transformation Pipeline)
- Initial BMAD similarity observations
- Hybrid nature analysis (60% orchestration, 30% web, 10% integration)

---

## The Journey

1. **Initial question**: "What sort of application do you think we're going to be building?"
2. **First attempt**: Three feature-based interpretations (Template Library, Workbench, Pipeline)
3. **Pushback**: "What I don't understand is, is there an actual application here? What is the automation? What is the tech stack?"
4. **Pivot**: Analyzed conventional architecture types (Web, Mobile, CLI, Agent Orchestration)
5. **Challenge**: "Is Claude Code like an OS and BMAD like a kernel?"
6. **Breakthrough**: Understanding the layering model and OS analogy
7. **Current hypothesis**: We're building a Prompt Engineering Operating System

---

## Open Questions (For Next Session)

See the "Open Questions" section in current-thinking-prompt-os.md for current unknowns:

- File system structure (core vs target)
- Number of actual agents vs skills/sub-agents
- Core workflows
- Machine-readable format choice
- And more...

---

## Context for Future Sessions

When you open a fresh Claude conversation and ask "what were we working on related to the new prompt operating system?", read **current-thinking-prompt-os.md** first. It contains everything from the breakthrough session.

The key is understanding:

1. **The analogy**: Claude Code (OS) → BMAD (Application OS) → Our system (Prompt Engineering OS)
2. **The parallel**: Just like BMAD orchestrates agents to build software, we orchestrate to build prompts
3. **The distinction**: Core (the OS itself) vs Target (the prompts/schemas we manage)
4. **The constraints**: Building on Claude Code gives us MCP, sub-agents, skills - use them wisely
5. **The lesson from BMAD**: Fewer agents with clear boundaries, more systematization than automation
