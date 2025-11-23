# BMAD Reference

**Status**: Reference
**BMAD Ready**: N/A (this IS the BMAD guide)
**Last Updated**: 2025-11-18

## What is BMAD?

**BMAD** = **Breakthrough Method for Agile AI Driven Development**

A methodology for managing AI agents to build software systematically through specialized agent personas and structured workflows.

**GitHub Repository**: [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) (21k+ stars)

## The 8 Specialized Agents

| Agent | Role | Primary Functions |
|-------|------|-------------------|
| **Analyst** 📊 | Business Analyst | Project briefs, market research, brainstorming |
| **PM** 📋 | Product Manager | PRDs, requirements management, story prioritization |
| **UX Expert** 🎨 | UX/UI Designer | Frontend specifications, user research, design systems |
| **Architect** 🏗️ | Solution Architect | Technical architecture, system design, technology decisions |
| **Product Owner** 📝 | Product Owner (PO) | Backlog management, story validation, process stewardship |
| **Dev** 💻 | Senior Developer | Implementation, code review, technical execution |
| **QA** 🔍 | Quality Assurance | Testing, code review, quality validation |
| **KDD** 📚 | Knowledge-Driven Development | Documentation updates, learning capture, knowledge management |

## Basic Usage

### Activating Agents

Use `@agent-name` to activate an agent:

```bash
@sm              # Activate Story Manager
@po              # Activate Product Owner
@architect       # Activate Solution Architect
@dev             # Activate Developer
@qa              # Activate QA Engineer
@kdd             # Activate Knowledge-Driven Development
```

### Agent Commands

Execute agent commands with `*command`:

```bash
@sm *create                  # Create next user story
@po *validate-story-draft    # Validate story quality
@qa *generate-uat            # Generate user acceptance test plan
@qa *review                  # Review implementation
@kdd *update-documentation   # Update documentation with learnings
@kdd *capture-learnings      # Document implementation insights
```

## Typical Workflow

1. **Story Creation**: `@sm *create` - Generate next story
2. **Validation**: `@po *validate-story-draft` - Ensure story quality
3. **Implementation**: `@dev` - Build the feature
4. **Quality Check**: `@qa *review` - Validate implementation
5. **Documentation**: `@kdd *capture-learnings` - Document insights

## Story Structure Best Practices

### Dev Notes Pattern

Every story should include a **Dev Notes** section that extracts all context the developer needs:

```markdown
## Dev Notes

### Previous Story Insights
- What was delivered in the previous story
- What's now available to use
- What's still pending for future stories

### Tech Stack
- Relevant technology decisions
- [Source: architecture/tech-stack.md#Section]

### Project Structure
- File/folder organization for this story
- [Source: system-explorations/structure.md]

### Coding Standards
- Critical rules that apply
- [Source: architecture/coding-standards.md]

### Testing
- Testing approach for this story
- [Source: architecture/testing-strategy.md]
```

**Why this matters**: Developer gets ALL context in one place - no hunting through architecture docs.

**Source Citations**: Always cite where information comes from using `[Source: path/to/file.md#Section]` format.

### Story Acceptance Tests (SAT)

Create a separate SAT file for each story (e.g., `1.2.story-SAT.md`) with tests split into:

**🧑 Human Tests** (Visual/Manual):
- Browser checks
- UI appearance
- Visual behavior
- Interactive features

**🤖 Terminal Tests** (Scriptable):
- Copy-paste commands
- curl tests
- Build verification
- File structure checks

**⏳ Not Testable Yet**:
- Features requiring future stories
- Integration dependencies

**Example**:
```markdown
## 🧑 Human Tests

### Test 1: Verify UI appearance
**Steps**:
1. Open browser to http://localhost:3000
2. Check that header displays correctly

**Expected**: Header shows with proper styling

---

## 🤖 Terminal Tests

### Test A: Health check endpoint
**Command**:
```bash
curl -s http://localhost:3000/api/health
```

**Expected Output**:
```json
{"status":"ok"}
```
```

### Post-Mortems

When a story is particularly challenging or goes wrong, create a post-mortem file (e.g., `3.3.story-post-mortem.md`):

```markdown
# Post-Mortem: Story X.X - [Brief Description]

## What Went Wrong
1. [Issue 1] - Time wasted, root cause, what should have been done
2. [Issue 2] - Impact, lesson learned

## What We Learned
- [Key insight 1]
- [Key insight 2]

## What to Do Differently Next Time
- [Action 1]
- [Action 2]
```

**Why this matters**: Capture real mistakes honestly so you don't repeat them.

## For This Prompts App

While this prompts application is simpler than the main app, BMAD principles still apply:

- Use appropriate agents for different tasks
- Document learnings systematically
- Follow structured workflows
- Maintain quality through agent validation

## Learn More

### BMAD Resources on Your Machine

**Second Brain (Comprehensive Knowledge Base)**:
- **Location**: `/Users/davidcruwys/dev/ad/brains/bmad-method/`
- **Start here**: `INDEX.md` - Navigation hub with v4 vs v6 comparison
- **Coverage**: v4 (stable) and v6-alpha with workflow comparisons, migration guides

**BMAD SDK (Implementation Files)**:
- **Location**: `/Users/davidcruwys/dev/ad/appydave-app-a-day/BMAD-METHOD/`
- **Contents**: Agents, checklists, templates, personas, tasks
- **Folder**: `bmad-agent/` contains all agent definitions and workflows

### SupportSignal App BMAD Implementation

**Full BMAD Integration**: See the main SupportSignal app at:
- `../app.supportsignal.com.au/docs/methodology/bmad-overview.md`
- `../app.supportsignal.com.au/docs/methodology/bmad-context-engineering.md`
- `../app.supportsignal.com.au/.bmad-core/` - Full agent system

### Official Repository

- **GitHub**: [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) (21k+ stars)
- **Discord**: https://discord.gg/gk8jAdXWmj
- **YouTube**: https://www.youtube.com/@BMadCode

---

**Note**: This is a simplified reference. The Second Brain contains comprehensive knowledge, the SDK has implementation files, and the main SupportSignal app shows a complete BMAD integration.
