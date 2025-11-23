# Main App Concepts

**Status**: Reference
**BMAD Ready**: Yes
**Last Updated**: 2025-11-11
**Source**: SupportSignal app.supportsignal.com.au (Story 11.3 modeling, Epic 11 documentation)

## Purpose

This document consolidates key concepts learned from the main SupportSignal application's prompt management system. The main app uses a **database-driven backend**; our prompts app will be **text-file driven**, but the core concepts remain the same.

---

## Application Context (Both Apps)

### Why POEM is Separate from Main App

**Decision made**: 2025-11-08

Prompt management was slowing down main app development and isn't a core customer requirement for SupportSignal. By separating it:
- Main app team focuses on customer-facing features
- Prompt engineering happens independently
- We might bring pieces back to main app later

**Integration**: The main app consumes prompt templates via API (Claude skill pushes updates)

### Repository Structure

**Main App**: `/Users/davidcruwys/dev/clients/supportsignal/app.supportsignal.com.au/`
**POEM App**: `/Users/davidcruwys/dev/clients/supportsignal/prompt.supportsignal.com.au/`

### Directory Structure

```
/dev/clients/supportsignal/
├── app.supportsignal.com.au/           # Main SupportSignal application
├── prompt.supportsignal.com.au/        # Prompts management (this app - POEM)
├── brain.supportsignal.com.au/         # Knowledge base / Second brain
├── support-signal-placeholder/          # Placeholder site
└── supportsignal-email-with-resend/    # Email service
```

### Tech Stacks

**Main App**:
- Next.js (App Router) with TypeScript
- Convex for backend and database
- Tailwind CSS + ShadCN UI
- Purpose: AI-powered NDIS support application

**Prompts App** (this repo):
- Astro for visualization
- Text files for storage
- Claude Code for development
- Claude skills for integration
- Purpose: Prompt template management and engineering

### Relationship

- **Main App**: Consumes prompt templates
- **Prompts App**: Manages and provides templates
- **Integration**: Claude skill → API → Convex database

---

## Core Concepts (From Main App - We Adopt These)

### 1. Prompts & Templates

A **prompt** is an instruction sent to an AI model with placeholders that get filled with real data.

**Template Example**:
```
You are an expert analyst. Review the incident for {{participantName}}
on {{eventDateTime}} at {{location}}.

Determine if this incident is reportable to NDIS.
Answer: YES or NO with one-sentence justification.
```

**After Placeholder Substitution**:
```
You are an expert analyst. Review the incident for John Smith
on 2025-11-08 14:30 at Kitchen.

Determine if this incident is reportable to NDIS.
Answer: YES or NO with one-sentence justification.
```

**Template Components**:
1. **Prompt Template**: The text with `{{placeholders}}`
2. **Placeholder Schema**: Definition of what variables are available
3. **Data Source**: Where the placeholder values come from
4. **AI Model Config**: Which model, tokens, temperature, etc.

### 2. Data Sources

**Data Source** = A structured collection of data that can feed prompts

**Examples from Main App**:

**Incident Data Source**:
- Metadata: participant name, location, date/time, reporter
- Four narrative phases: before/during/end/post event
- Clarification Q&A pairs
- Enhanced narratives

**Moment Data Source** (planned):
- Voice recording transcripts
- Shift notes
- Bundle of daily observations

**Key Concept**: Prompts are reusable across data sources if they share similar structure.

### 3. Two Prompt Architectures

The main app discovered that prompts fall into two fundamentally different categories:

#### Architecture 1: Workflow Prompts

**Purpose**: Support specific workflow steps
**Lifecycle**: One-to-one with workflow, consumed immediately
**Examples**: Generate clarification questions, enhance narratives

**Characteristics**:
- Tied to specific workflow step
- Output consumed right away
- No human review needed
- Part of automatic process

#### Architecture 2: Flexible Prompts (Analysis Prompts)

**Purpose**: Reusable analysis that can apply to many entities
**Lifecycle**: One-to-many, creates reviewable results
**Examples**: "Is this reportable?", "What's the risk level?", "Training gaps?"

**Characteristics**:
- Can apply to incidents, moments, narratives
- Creates reviewable data records
- Supports human override
- Batch execution possible

### 4. Output Types

Flexible prompts produce three types of outputs:

#### Predicate (Boolean Decision)

**Output**: YES/NO with justification

```json
{
  "decision": true,
  "confidence": 0.85,
  "reasoning": "Incident involved police and injury requiring hospital visit"
}
```

#### Classification (Category Selection)

**Output**: One category from a list

```json
{
  "category": "high",
  "options": ["low", "medium", "high", "critical"],
  "confidence": 0.72,
  "reasoning": "Participant showed signs of distress..."
}
```

#### Observation (Descriptive Insight)

**Output**: Text summary/analysis

```json
{
  "observation": "Staff showed unfamiliarity with de-escalation techniques...",
  "confidence": 0.65
}
```

### 5. Dual-Field Pattern (Critical!)

**Critical Architectural Pattern**: AI and human assessments are SEPARATE, not approval/rejection

#### Wrong Model ❌

```typescript
ai_output: any
review_status: "approved" | "rejected" | "modified"
```

#### Correct Model ✅

```typescript
ai_value: any        // AI's assessment (immutable)
human_value: any     // Human's assessment (mutable, initially null)
effective_value = human_value ?? ai_value  // Computed: human wins if present
```

**Why This Matters**:
- AI's original assessment is preserved (for learning/improvement)
- Human can override without destroying AI's conclusion
- You can see when humans and AI disagree
- Effective value is simple: human's choice if they made one, otherwise AI's

### 6. Two Reviewer Roles

#### Angela (Prompt Manager)

**Purpose**: Improve prompt quality

**Actions**:
- Reviews AI outputs to assess prompt quality
- Marks prompts as "good" or "needs refinement"
- Provides feedback: "This prompt is too vague"
- Does NOT change incident data

**Focus**: Template engineering, not operational validation

#### Team Leader (Operational Validator)

**Purpose**: Validate incident analysis

**Actions**:
- Reviews AI outputs for THEIR incidents
- Overrides when AI is wrong
- Their override becomes official classification

**Focus**: Operational accuracy, not prompt quality

**Key Difference**: Angela improves the **prompts**, Team Leaders correct the **data**

### 7. Placeholder System

#### Current Main App Placeholders

**Incident-related**:
- `{{participantName}}` - Who the incident is about
- `{{eventDateTime}}` - When it occurred
- `{{location}}` - Where it occurred
- `{{reporterName}}` - Who reported it
- `{{beforeEvent}}`, `{{duringEvent}}`, `{{endEvent}}`, `{{postEvent}}` - Narrative phases
- `{{beforeEventQA}}`, `{{duringEventQA}}` - Q&A for each phase

#### How Placeholders Work

1. **Define schema**: What placeholders are available for a data source
2. **Template uses them**: `{{participantName}}` in template text
3. **Runtime substitution**: System replaces with actual values
4. **Send to AI**: Final prompt with real data

---

## Architectural Decisions

### Decision 1: Separate Workflow vs Flexible Prompts

**Why**: Originally tried to combine both types in one table, created complexity and confusion

**Solution**: Keep them separate

**For Our Text App**:
- Both types in same flat folder
- Distinguished by tags in schema: `"tags": ["workflow"]` vs `"tags": ["analysis"]`
- Can be organized by type if needed in future

### Decision 2: Dual-Field Pattern

**Why**: Need to preserve AI's original assessment while allowing human override

**What We Send to Main App**:

```json
{
  "promptId": "ndis-reportable",
  "name": "NDIS Reportable Incident Check",
  "templateContent": "You are an expert NDIS specialist...",
  "dataSource": "incident",
  "outputType": "predicate",
  "placeholderSchema": {
    "participantName": {"type": "string", "required": true}
  },
  "aiConfig": {
    "model": "gpt-4o",
    "maxTokens": 150,
    "temperature": 0.3
  }
}
```

**Note**: We send the **recipe** (template definition), not the **results** (execution data). The main app uses this template to execute prompts and create results with dual-field pattern.

### Decision 3: Entity-Specific Organization

**Why**: Polymorphic "one table for all entities" creates weak typing and complex queries

**Main App**: Separate tables per entity type (incident_analysis, moment_analysis)

**For Our Text App**: Organize by entity if needed, but flat structure works for now

### Decision 4: Git for Version Control

**Main App Issue**: Complex event sourcing built into prompts table, rarely used, adds complexity

**Our Solution**: **Git IS our version history!**

```bash
# History of a template file
git log data/prompts/ndis-reportable.txt

# See what changed
git diff HEAD~1 data/prompts/ndis-reportable.txt
```

**Claude Skill for Archiving**:
When Angela needs backup before edit:
1. Copy current file to `data/archive/[template-name]-YYYY-MM-DD.txt`
2. Git commit with message "Archive: [template-name] before edit"
3. Current file stays in place, ready for editing

This isn't "version control" - it's just a backup-before-edit workflow. Git provides the real history.

### Decision 5: Placeholder Schema Definition

**Why**: Placeholders were hardcoded in templates with no schema definition. Hard to discover what's available.

**Our Solution**: Explicit schema files

```json
{
  "templateName": "analysis-predicate-example",
  "dataSource": "incident",
  "placeholders": {
    "participantName": {
      "type": "string",
      "description": "Name of participant",
      "required": true,
      "example": "John Smith"
    }
  }
}
```

**Benefits**:
- Clear documentation of what's available
- Astro can show available placeholders when viewing template
- Can validate template uses only available placeholders
- Auto-generate documentation from schema

---

## Template Processing Flows

### Main App Flow
```
1. Hardcoded templates (code)
   ↓
2. Seeded to database (ai_prompts table)
   ↓
3. Runtime retrieval (query active prompt)
   ↓
4. Placeholder substitution ({{var}} → actual value)
   ↓
5. Send to AI model (OpenAI, etc.)
```

### Our Text-Driven Flow (Future)
```
1. Text file templates (data/prompts/)
   ↓
2. Astro reads files (visualization with hot-reload)
   ↓
3. Angela reviews in Astro (copy buttons for ChatGPT testing)
   ↓
4. Claude skill pushes template definition to main app API
   ↓
5. Main app stores in Convex, uses for execution
```

---

## What We're Building Differently

| Aspect | Main App | Prompts App |
|--------|----------|-------------|
| Storage | Database tables | Text files |
| UI | React forms | Astro pages |
| Processing | Backend mutations | Claude skills |
| Versioning | Event sourcing | Git |
| Organization | Database queries | File system |

**Same Concepts**: Templates, placeholders, data sources, output types, dual-field pattern

**Different Implementation**: Files not database, Claude agents not React UI

---

## Application to Our Text-Driven System

### What We Keep

✅ Dual-field pattern (when pushing to Convex)
✅ Separate workflow vs flexible prompts (via tags)
✅ Placeholder schemas
✅ Entity-specific organization (if needed)
✅ Two reviewer role concepts

### What We Simplify

📁 File-based instead of database tables
🎨 Astro visualization instead of React UI
🔧 Claude agents instead of backend mutations
📝 Git for versioning instead of event sourcing

### What We Don't Need (Main App Handles It)

❌ Backend API endpoints
❌ React forms for CRUD
❌ Database migrations
❌ User authentication
❌ Real-time subscriptions

---

## Key Takeaways

1. **Prompts ≠ Just Text**: Prompts are templates + placeholders + config
2. **Two Types**: Workflow (immediate) vs Flexible (reviewable)
3. **Data Sources**: Structure that defines what placeholders are available
4. **Dual-Field**: Always separate AI value from human value
5. **Output Types**: Predicate, Classification, Observation
6. **Two Reviewers**: Quality feedback (Angela) vs Operational validation (Team Leaders)
7. **Git as Version Control**: Simple and effective for text files
8. **Send Recipes, Not Meals**: Push template definitions, not execution results

---

**Last Updated**: 2025-11-11
