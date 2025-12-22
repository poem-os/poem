> **POEM Context**: This document was imported from the Motus project. It documents the data model for workflow execution (static definitions vs dynamic runtime), which directly informs POEM's schema and attribute store design.

# AWB Schema Analysis

## Purpose

This document explains the AWB data model - the entities, relationships, and storage strategies used to define and execute AI agent workflows.

**Note:** This is documentation, not code. For implementation details, see `.awb/schema/` (types.ts, create_schema.rb).

---

## Schema Overview

AWB uses a two-layer data model:

1. **Static Workflow Definition** - The blueprint (what to do)
2. **Dynamic Workflow Execution** - The runtime (what happened)

### Visual Overview

```
STATIC DEFINITION                    DYNAMIC EXECUTION
┌─────────────────┐                 ┌──────────────────┐
│   Workflow      │                 │  Workflow Run    │
│   (blueprint)   │ ◄─── creates ───│  (instance)      │
└────────┬────────┘                 └────────┬─────────┘
         │                                    │
    ┌────▼────┐                          ┌───▼────┐
    │ Section │                          │Section │
    │         │ ◄────── executes ────────│  Run   │
    └────┬────┘                          └────┬───┘
         │                                    │
     ┌───▼───┐                           ┌───▼────┐
     │ Step  │                           │ Step   │
     │       │ ◄────── executes ─────────│  Run   │
     └───┬───┘                           └───┬────┘
         │                                   │
    ┌────▼────────┐                    ┌────▼─────────┐
    │ Attributes  │                    │  Attribute   │
    │ (definition)│                    │   Values     │
    └─────────────┘                    └──────────────┘
```

---

## Static Workflow Definition

### Entity: Workflow

**Purpose:** Define a series of tasks to achieve a specific goal

**Fields:**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Unique identifier | 1 |
| name | string | Machine-readable name | youtube_launch_optimizer |
| description | string | Human-readable purpose | "Optimizes video launch..." |

**Relationships:**
- Has many sections (1:N)
- Has many attributes (1:N)
- Has many prompts (1:N)
- Has many settings (1:N)
- Has many workflow_runs (1:N)

**Example Workflows:**
- YouTube Video Script
- YouTube Title Creator
- YouTube Transcription to Medium Article
- YouTube Launch Optimizer (9 sections, 35 steps)
- YouTube Livestream Podcast Brief (4 sections, 20 steps)

---

### Entity: Section

**Purpose:** Subdivisions within workflows to organize steps logically

**Fields:**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Unique identifier | 1 |
| workflow_id | integer | Foreign key to workflow | 1 |
| name | string | Section name | Video Preparation |
| description | string | Section purpose | "Prepare transcript for analysis" |
| order | integer | Execution order | 1 |

**Relationships:**
- Belongs to workflow (N:1)
- Has many steps (1:N)
- Has many section_runs (1:N)

**Example Sections (Launch Optimizer):**
1. Video Preparation (6 steps)
2. Build Chapters (3 steps)
3. B-Roll Suggestions (4 steps)
4. Content Analysis (3 steps)
5. Title & Thumbnail (6 steps)
6. YouTube Meta Data (6 steps)
7. Social Media Posts (4 steps)
8. YouTube Shorts (3 steps)

---

### Entity: Step

**Purpose:** Individual tasks within a section, each associated with an AI prompt

**Fields:**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Unique identifier | 1 |
| section_id | integer | Foreign key to section | 1 |
| name | string | Step name | Script Summary |
| action | string | Action type (default: 'gpt') | gpt |
| description | string | Step purpose | "Summarize transcript" |
| order | integer | Execution order within section | 2 |
| prompt | string | Template string for prompt | [transcript] |

**Relationships:**
- Belongs to section (N:1)
- Has many input_attributes (1:N)
- Has many output_attributes (1:N)
- Has many step_runs (1:N)

**Example Steps (Video Preparation section):**
1. Configure - Initial setup
2. Script Summary - Condense transcript
3. Script Abridgement - Further condensation
4. Abridge QA - Validate abridgement
5. Intro/Outro Separation - Extract boundaries
6. Find Video CTA - Identify calls-to-action

---

### Entity: Attribute

**Purpose:** Parameters used in steps, can be simple values or arrays

**Fields:**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Unique identifier | 1 |
| workflow_id | integer | Foreign key to workflow | 1 |
| name | string | Attribute name (snake_case) | transcript_summary |
| type | string | Data type | string |
| is_array | boolean | Array vs single value | false |
| description | string | Purpose | "Condensed transcript" |

**Relationships:**
- Belongs to workflow (N:1)
- Has many input_attributes (1:N) - maps to steps
- Has many output_attributes (1:N) - maps to steps
- Has many attribute_values (1:N) - runtime instances

**Example Attributes (Launch Optimizer):**
- `transcript` - Full video transcript (string)
- `transcript_summary` - Condensed version (string)
- `title_ideas` - Potential titles (array)
- `video_keywords` - SEO keywords (array)
- `chapters` - Timestamp markers (string)

**Key Concept:**
- Attributes are **definitions** (no value)
- Attribute Values are **runtime data** (with values)

---

### Entity: Input/Output Attributes

**Purpose:** Map attributes to steps as either inputs or outputs

**Input Attributes:**
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier |
| step_id | integer | Foreign key to step |
| attribute_id | integer | Foreign key to attribute |
| required | boolean | Must have value |

**Output Attributes:**
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier |
| step_id | integer | Foreign key to step |
| attribute_id | integer | Foreign key to attribute |

**Relationships:**
- Belongs to step (N:1)
- Belongs to attribute (N:1)

**Example Flow:**
```
Step: Script Summary
  Input: transcript (required)
  Input: title_ideas (optional)
  Output: transcript_summary

Step: Script Abridgement
  Input: transcript_summary (from previous step)
  Input: transcript
  Output: transcript_abridgement
```

---

### Entity: Prompt

**Purpose:** Reusable AI instruction templates

**Fields:**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Unique identifier | 1 |
| workflow_id | integer | Foreign key to workflow | 1 |
| name | string | Prompt identifier | video_summary_prompt |
| path | string | File path (if external) | 1-1-summarize-video.txt |
| content | string | Prompt text | "Summarize: [transcript]" |
| description | string | Purpose | "Condense transcript" |

**Relationships:**
- Belongs to workflow (N:1)
- Referenced by steps (1:N)

**Storage Strategies:**

**Strategy A: External Files**
```
prompts/youtube/launch_optimizer/
├── 1-1-short-title.txt
├── 1-1-summarize-video.txt
└── 5-1-generate-title.txt
```
- Pro: Version control, easy editing
- Con: File management complexity

**Strategy B: Embedded**
```json
{
  "prompts": {
    "video_summary_prompt": {
      "name": "video_summary_prompt",
      "content": "Summarize the following:\n\n[transcript]"
    }
  }
}
```
- Pro: Self-contained, portable
- Con: Harder to edit, duplication

**Strategy C: Database**
```sql
CREATE TABLE prompts (
  id INTEGER,
  name STRING,
  content TEXT
);
```
- Pro: Reusable across workflows, queryable
- Con: Requires database, more setup

**AWB Uses:** Hybrid (external files → loaded into JSON)

---

### Entity: Setting

**Purpose:** Configuration parameters for workflow execution

**Fields:**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Unique identifier | 1 |
| workflow_id | integer | Foreign key to workflow | 1 |
| name | string | Setting key | default_llm |
| value | string | Setting value | gpt4o |
| description | string | Purpose | "Default language model" |

**Relationships:**
- Belongs to workflow (N:1)

**Example Settings:**
```yaml
settings:
  prompt_path: "/path/to/prompts/youtube/launch_optimizer"
  default_llm: "gpt4o"
  max_retries: 3
  timeout: 120
```

---

## Dynamic Workflow Execution

### Entity: Workflow Run

**Purpose:** Instance of a workflow execution

**Fields:**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Unique identifier | 42 |
| workflow_id | integer | Foreign key to workflow | 1 |
| created_at | datetime | Start time | 2025-10-12 10:00:00 |
| status | string | Running/completed/failed | completed |

**Relationships:**
- Belongs to workflow (N:1)
- Has many section_runs (1:N)

**Purpose:**
- Track multiple executions of same workflow
- Enable parallel runs
- Historical record

**Example:**
```
Workflow: youtube_launch_optimizer
  Run #42: b62-remotion-overview (completed)
  Run #43: b57-publish-host (running)
  Run #44: b60-ai-agents (failed)
```

---

### Entity: Section Run

**Purpose:** Instance of a section execution within a workflow run

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier |
| workflow_run_id | integer | Foreign key to workflow_run |
| section_id | integer | Foreign key to section |
| order | integer | Execution order |
| status | string | Running/completed/failed |

**Relationships:**
- Belongs to workflow_run (N:1)
- Belongs to section (N:1)
- Has many step_runs (1:N)

---

### Entity: Step Run

**Purpose:** Instance of a step execution, supports multiple branches

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier |
| section_run_id | integer | Foreign key to section_run |
| step_id | integer | Foreign key to step |
| branch_number | integer | Branch for parallel execution |
| status | string | Running/completed/failed |
| started_at | datetime | Start time |
| completed_at | datetime | End time |

**Relationships:**
- Belongs to section_run (N:1)
- Belongs to step (N:1)
- Has many attribute_values (1:N)

**Branch Number Concept:**
```
Step: Generate Titles
  Branch 1: Temperature 0.7 → ["Title A1", "Title A2"]
  Branch 2: Temperature 0.9 → ["Title B1", "Title B2"]
  Branch 3: Temperature 1.0 → ["Title C1", "Title C2"]
```

Allows A/B testing, experimentation, multiple attempts.

---

### Entity: Attribute Value

**Purpose:** Store attribute values during step executions

**Fields:**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Unique identifier | 1 |
| attribute_id | integer | Foreign key to attribute | 5 |
| step_run_id | integer | Foreign key to step_run | 42 |
| value | text | Actual runtime value | "This is a transcript..." |

**Relationships:**
- Belongs to attribute (N:1)
- Belongs to step_run (N:1)

**Example Values:**
```json
{
  "attribute": "transcript",
  "step_run": 42,
  "value": "4000 word transcript of video..."
}

{
  "attribute": "title_ideas",
  "step_run": 43,
  "value": "[\"Title 1\", \"Title 2\", \"Title 3\"]"
}
```

---

## Data Flow Example

### Scenario: Launch Optimizer (b62-remotion-overview)

**Workflow Run #42:**

```
Section 1: Video Preparation
  Step 1: Configure
    Inputs: project_folder="remotion-overview"
    Outputs: project_code="b62", short_title="Remotion Example"

  Step 2: Script Summary
    Inputs: transcript (4000 words)
    Outputs: transcript_summary (400 words)

  Step 3: Script Abridgement
    Inputs: transcript_summary, transcript
    Outputs: transcript_abridgement (200 words)

Section 2: Build Chapters
  Step 7: Find Chapters
    Inputs: transcript, transcript_abridgement
    Outputs: identify_chapters="00:00 Intro\n02:30 Demo\n..."

  Step 8: Refine Chapters
    Inputs: identify_chapters, transcript
    Outputs: chapters (formatted)

... (7 more sections)
```

**Attribute Values Table:**
| Attribute | Step Run | Value (truncated) |
|-----------|----------|-------------------|
| project_code | 1 | "b62" |
| transcript | 1 | "Are you interested in YouTube..." (4000 words) |
| transcript_summary | 2 | "I'm AppyDave, and in this video..." (400 words) |
| transcript_abridgement | 3 | "I show how to automate video..." (200 words) |
| chapters | 8 | "00:00 Introduction\n02:30..." |

---

## Storage Strategies Compared

### Strategy A: Embedded (JSON Export)

**Format:**
```json
{
  "workflow": "youtube_launch_optimizer",
  "sections": [...],
  "steps": [...],
  "attributes": {...},
  "prompts": {...},
  "settings": {...}
}
```

**Use Cases:**
- Version control
- Sharing workflows
- Portability
- Static website generation

**Benefits:**
- Self-contained
- Easy to distribute
- No database required

**Drawbacks:**
- Duplication if prompts reused
- Harder to query
- Large file sizes

---

### Strategy B: Normalized (Database)

**Format:**
```sql
workflows table
sections table (FK: workflow_id)
steps table (FK: section_id)
attributes table (FK: workflow_id)
prompts table (FK: workflow_id)
settings table (FK: workflow_id)
...
```

**Use Cases:**
- Complex queries
- Multiple workflows
- Reusable components
- Execution tracking

**Benefits:**
- No duplication
- Relational integrity
- Efficient queries
- Scalable

**Drawbacks:**
- Requires database
- Setup complexity
- Not as portable

---

### Strategy C: Hybrid (AWB Approach)

**Format:**
1. Define workflow in Ruby DSL
2. Load prompts from external .txt files
3. Export to JSON (embedded)
4. Store in database (normalized)
5. Generate HTML from either

**Benefits:**
- Best of both worlds
- Flexible storage
- Multiple export formats

**Drawbacks:**
- More complex
- Multiple sources of truth
- Sync challenges

---

## Schema Inconsistencies

### Issue 1: Prompts & Settings Tables Undocumented

**Problem:**
- `create_schema.rb` defines `prompts` and `settings` tables
- `requirements.md` does NOT document these
- Created gap between code and documentation

**Impact:**
- Developers don't know these tables exist
- May not use them correctly
- Inconsistent with embedded strategy

**Resolution:**
- Document in requirements.md
- Clarify when to use tables vs embedded
- Update ERD diagram

---

### Issue 2: Attribute Value Conflation

**Problem:**
```typescript
// types.ts - INCORRECT
interface Attribute {
  name: string;
  type: string;
  value: string | null;  // ← Mixes definition with runtime
}
```

**Correct Approach:**
```typescript
// Separate definition from runtime
interface Attribute {
  name: string;
  type: string;
  is_array: boolean;
}

interface AttributeValue {
  attribute_id: number;
  value: string;
  step_run_id: number;
}
```

**Impact:**
- Frontend may try to store values in wrong place
- Confusion about where data lives
- Can't track multiple values for same attribute

**Resolution:**
- Remove `value` from Attribute interface
- Add AttributeValue interface
- Update UI to use correct model

---

### Issue 3: Missing Runtime Interfaces (types.ts)

**Problem:**
- `types.ts` has no interfaces for:
  - WorkflowRun
  - SectionRun
  - StepRun
  - AttributeValue

**Impact:**
- Frontend can't track execution state
- No way to display progress
- Can't implement resume functionality

**Resolution:**
- Add runtime interfaces to types.ts
- Or clarify types.ts is static-only
- Document scope limitation

---

## Key Takeaways

1. **Two-Layer Model**: Static definition + dynamic execution
2. **60+ Attributes**: Need robust state management
3. **External Prompts**: 38+ files require organization
4. **Multiple Storage**: Hybrid approach (JSON + Database)
5. **Execution Tracking**: Runtime tables critical for resume
6. **Schema Gaps**: Documentation needs updating

---

## Recommendations

1. **Update requirements.md** - Document prompts & settings tables
2. **Fix types.ts** - Remove value from Attribute, add runtime interfaces
3. **Create ERD** - Visual diagram of all entities
4. **Document storage strategies** - When to use each approach
5. **Validate consistency** - Ensure all three representations align

---

## Document Status

- **Created**: 2025-10-12
- **Source**: requirements.md + types.ts + create_schema.rb
- **Status**: Documentation extraction complete
- **Next**: Align schema with Motus requirements
