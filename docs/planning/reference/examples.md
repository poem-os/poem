# POEM Example Domains

**Extracted from**: current-thinking-prompt-os.md + data folders
**Last Updated**: 2025-11-20
**Status**: Architecture definition - Real-world examples

---

## Overview

POEM development includes two complete example domains to demonstrate different prompt engineering patterns:

1. **SupportSignal** (NDIS/Healthcare) - Incident reporting and analysis
2. **Storyline** (Creative/Content) - Narrative-to-production transformation

**Why Two Domains?**
- Demonstrates POEM's flexibility across different use cases
- SupportSignal: Linear workflows, single-step prompts
- Storyline: Pipeline orchestration, multi-step transformations
- Real data from actual client projects

---

## Domain 1: SupportSignal (NDIS)

**Location**: `/data/supportsignal/`

**Domain**: Healthcare/Compliance (National Disability Insurance Scheme)
**Client**: SupportSignal (app.supportsignal.com.au)
**Use Case**: AI-powered incident reporting and analysis

### What It Demonstrates

**Single-Entity Focus**:
- One primary entity type (incident)
- Different data source contexts (single, collection, view)
- Workflow-driven prompts (Q&A → narrative enhancement)

**Linear Workflows**:
```
User creates incident
  → AI asks clarifying questions
  → User answers questions
  → AI enhances narrative
  → Manager reviews incident
```

### Data Structure

**Entities**:
- Incident (primary)
- Participant
- Company
- Location
- Shift Note
- Moment

**Data Source Patterns**:
- `incident.single` - Complete incident record
- `incident.collection` - Multiple incidents for comparison
- `incident.view` - Partial data (e.g., metadata + before_event only)

### Example Prompts (Workflow-Based)

```
/data/supportsignal/prompts/
├── ask-clarifying-questions.hbs      # Step 1: Generate questions
├── enhance-narrative.hbs              # Step 2: Improve description
├── classify-incident-severity.hbs    # Analysis: Risk assessment
├── extract-key-events.hbs            # Analysis: Timeline extraction
└── sentiment-analysis.hbs            # Analysis: Emotional tone
```

### Key Insight: Precision & Compliance

**Domain Context**: Government-funded care (NDIS - National Disability Insurance Scheme)

**Critical Requirement**: **You cannot screw up here.**
- **Compliance is mandatory**: Government regulations, legal requirements
- **Precision is paramount**: Incorrect documentation has real-world consequences
- **Audit trail required**: Every incident must be traceable and defensible
- **Professional standards**: Care providers must meet strict quality benchmarks

**Why POEM Exists**: This domain is exactly why POEM was created.
- **Cannot afford to "play around"** with prompts in production
- **Need rigorous testing** before deployment
- **Must validate outputs** meet compliance standards
- **Require audit trail** of prompt versions and changes

**SupportSignal shows POEM's value for**:
- Compliance-heavy industries (healthcare, government, legal)
- Structured data workflows with mandatory fields
- Prompt reusability (same prompt, different incidents)
- Privacy-sensitive contexts (mock data generation critical)
- High-stakes environments where errors have serious consequences

---

## Domain 2: Storyline (Creative Production)

**Location**: `/data/storyline/`

**Domain**: Storytelling/Content Generation
**Client**: VOZ (Boy and the Baker project)
**Use Case**: Transform narrative into visual production specification

### What It Demonstrates

**Multi-Step Pipeline**:
- Sequential prompt execution (Step 4 depends on Steps 1-3)
- Context accumulation across prompts
- Loop iteration (same prompt per beat)
- Rich output transformation (631 words → 21KB structured data)

**Pipeline Workflow**:
```
Simple transcript (631 words)
  → Step 1: Extract characters with visual profiles
  → Step 2: Define visual style guide
  → Step 3: Break narrative into 64 beats
  → Step 4: Generate visual concepts for each beat (68 total)
  = Complete production-ready JSON (21KB)
```

### Data Structure

**Input**:
- `source/transcript.txt` - Raw narrative (3,250 characters)
- `source/storyline-v2.json` - Desired output structure (example)

**Transformation Pipeline**:
See `/data/storyline/mappings/transcript-to-storyline.json`

**Output Components**:
- Cast (3 characters with detailed visual profiles)
- Style Guide (era, influences, color palettes)
- Beats (64 narrative segments with timing)
- Visual Concepts (68 shot breakdowns)

### Example Prompts (Pipeline-Based)

```
/data/storyline/prompts/
├── extract-characters.hbs           # Step 1: Cast extraction
├── define-visual-style.hbs          # Step 2: Style guide creation
├── break-into-beats.hbs             # Step 3: Narrative segmentation
└── generate-visual-concepts.hbs     # Step 4: Shot composition (loops)
```

### Transformation Example

**INPUT** (transcript.txt):
```
The Boy and the Baker by Vaz
An elderly baker walking to his shop sees a boy being
bullied and beaten by a gang of older children...
[631 words total]
```

**OUTPUT** (storyline-v2.json):
```json
{
  "metadata": {
    "totalBeats": 64,
    "totalVisualConcepts": 68,
    "totalDuration": 298.84
  },
  "cast": [
    {
      "key": "baker",
      "name": "The Baker",
      "visualProfile": {
        "build": "Sturdy frame, gently weathered",
        "colorSignature": ["warm ochre", "dusty brown", "cream"],
        "symbolism": "Bread as sacrament; represents sanctuary"
      }
    }
  ],
  "beats": [/* 64 beats with timing and visual concepts */]
}
```

**Transformation Ratio**: ~33x size expansion with semantic enrichment

### Key Insight: Creative Complexity

**Domain Context**: Visual storytelling production (5-minute animated content)

**Creative Challenge**: **The Boy and the Baker** - Visually stunning narrative requiring complex creative processes

**Multi-Layered Complexity**:
- **Visual Prompting**: Difficult to create precise visual descriptions
  - Character profiles (build, color signature, symbolism)
  - Scene composition (camera angles, mood, visual concepts)
  - Shot-by-shot specifications (64 beats, each unique)
- **Multi-Modal Content**: Beyond just visuals
  - **Music**: Emotional score, scene transitions
  - **Audio**: Sound effects, ambient audio, voice direction
  - **Emotion**: Tone mapping, emotional arcs across scenes
- **Scene-Level Complexity**: Individual beat analysis
- **Scene-Boundary Transitions**: How beats flow into each other
- **Iterative Evolution**: New versions add layers (audio, music, emotion)

**POEM's Role**: Not just "test a prompt" but "orchestrate creative transformation"
- Start: Simple narrative text (631 words)
- Process: Multiple specialized creative prompts
- Output: Production-ready visual + audio + emotional specification
- Scale: Same system handles version iterations with added complexity

**Storyline shows POEM's potential for**:
- Complex data transformation pipelines (narrative → production spec)
- Multi-step orchestration with context passing (character extraction → scene breakdown → shot composition)
- Prompt iteration (run same prompt 64 times with different data)
- Rich output structure generation (21KB structured JSON)
- Creative workflow management (visual, audio, music, emotion)
- Beyond "testing prompts" → **"creative transformation engine"**

---

## Comparison: SupportSignal vs Storyline

| Aspect | SupportSignal (NDIS) | Storyline (Content) |
|--------|---------------------|---------------------|
| **Domain** | Healthcare/compliance | Creative/storytelling |
| **Input** | Incident reports | Narrative transcript |
| **Output** | Enhanced narratives, analysis | Visual production spec |
| **Workflow** | Linear (Q&A → enhance) | Pipeline (extract → style → segment → visualize) |
| **Prompts** | 8 workflow-specific | 4 transformation steps |
| **Data Sources** | `incident.single`, `incident.collection` | `storyline.transcript`, `storyline.complete` |
| **Complexity** | Single-step prompts | Multi-step orchestration |
| **Use Case** | Improve compliance documentation | Generate production assets |

---

## What POEM Needs to Support Both

### From SupportSignal
1. **Data Source Flexibility**: Same entity, different contexts (single vs collection vs view)
2. **Prompt Reusability**: One prompt, many instances
3. **Mock Data Generation**: Test without production data access
4. **Provider Integration**: Publish to Convex/SupportSignal

### From Storyline
1. **Pipeline Orchestration**: Execute prompts in sequence
2. **Context Management**: Pass outputs as inputs to next step
3. **Loop Iteration**: Run same prompt multiple times
4. **Data Source Evolution**: Handle intermediate data sources created during processing
5. **Rich Transformation**: Input text → Structured output

### Common Needs
1. **Schema Validation**: Ensure output matches expected structure
2. **Handlebars Templating**: Powerful placeholders and helpers
3. **Visualization**: See prompts, schemas, outputs in Astro
4. **Version Control**: Track prompt evolution over time

---

## Data Folder Structure

```
/data/
├── supportsignal/             # Domain 1: NDIS incident management
│   ├── prompts/              # Workflow-based prompts
│   ├── schemas/              # Entity schemas
│   ├── mappings/             # Data transformations
│   └── README.md             # Domain documentation
│
└── storyline/                # Domain 2: Creative production
    ├── source/               # Input data
    │   ├── transcript.txt    # Raw narrative
    │   └── storyline-v2.json # Example output
    ├── prompts/              # Pipeline prompts
    ├── schemas/              # Output schemas
    ├── mappings/             # Transformation pipeline
    └── README.md             # Domain documentation
```

**Note**: These are sibling directories, not nested. Each represents a complete domain example.

---

## Using Examples During BMAD

**During Epic 1: Core Infrastructure**
- Reference example structure
- Don't build domain-specific features yet

**During Epic 2: First Domain (SupportSignal)**
- Implement single-entity workflows
- Build mock data generation
- Create provider integration

**During Epic 3: Second Domain (Storyline)**
- Add pipeline orchestration
- Implement context passing
- Build loop iteration support

**Principle**: Examples inform architecture, but we build incrementally using BMAD

---

**See also**:
- ../../data/supportsignal/README.md - Complete SupportSignal documentation
- ../../data/storyline/README.md - Complete Storyline documentation
- [workflows.md](./workflows.md) - How workflows map to these examples
- [mock-data.md](./mock-data.md) - Mock data generation (killer feature)
