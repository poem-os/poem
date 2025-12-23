# Mock Data Generation - Core POEM Value Proposition

**Extracted from**: current-thinking-prompt-os.md
**Last Updated**: 2025-11-21
**Status**: Architecture definition - Killer feature

🚧 **ACTIVE PLANNING AREA**: Level 2 mock data architecture may drive need for Fourth Agent (Data/Testing Agent). Watch for complexity signals during implementation.

---

## The Problem This Solves

**Angela's Pain Point**: Prompt engineering requires testing prompts with data, but manually filling in test data is:

- Time-consuming and tedious
- Blocks rapid iteration
- Requires access to real production data (privacy/security concerns)

**The POEM Solution**: Auto-generate mock data based on schemas and data sources

---

## How Mock Data Generation Works

**Prerequisites**:

1. Data source definition (e.g., `incident.single`, `moment.collection`)
2. Schema (field definitions, types, constraints)

**Process (Level 1 - Simple)**:

```
1. Angela creates prompt: "Analyze incident for {{participantName}} at {{location}}"
2. Prompt references data source: "incident.single"
3. POEM reads incident schema (participantName: string, location: string, etc.)
4. POEM generates realistic mock data: {participantName: "John Smith", location: "Kitchen"}
5. Angela tests prompt with mock data
6. Iterates rapidly without touching production system
7. When satisfied, publishes prompt to provider
```

**Process (Level 2 - Persistent Scenarios)**: _(See "Advanced Mock Data" section below)_

```
1. Angela creates prompt
2. POEM uses persistent mock entities (5 participants with backstories, recurring scenarios)
3. Angela tests prompt against multiple realistic scenarios
4. Mock data can be:
   - Hand-crafted (realistic, meaningful scenarios)
   - Anonymized from production (real data, privacy-safe)
   - AI-generated from schemas (automated, varied)
5. Output data from prompt testing becomes new mock data for downstream workflows
6. Builds library of test scenarios over time
```

---

## Three Data Flows in POEM

### INBOUND (Provider → POEM)

- Pull Data Dictionary (field definitions, types, constraints)
- Pull Data Source Definitions (what entities exist, relationships)
- [Optional] Pull Sample Data (real data exports as JSON for reference)

### OUTBOUND (POEM → Provider)

- Publish Prompts (prompts ready for production use)

### INTERNAL (Within POEM)

- Generate Mock Data (for local testing and iteration)
- Apply Prompts to Mock Data (test prompt rendering)
- [Future] Generate Output Data (batch prompt execution for workflows)

---

## Why This Matters for POEM

**Independence from Production**:

- Prompt engineering becomes standalone activity
- No need to access production database for testing
- Privacy/security: no real user data needed in POEM

**Rapid Iteration**:

- Generate hundreds of test scenarios instantly
- Test edge cases (empty fields, long text, special characters)
- Validate prompts before deployment

**Data Source Connection**:
This is **why data sources are critical to POEM**:

- Data source defines **what** to generate (entity type, scope, shape)
- Schema defines **how** to generate it (fields, types, constraints)
- Mock data generator uses both to create realistic test data

---

## Output Data Generation (Future Consideration)

**Beyond Mock Input**: POEM could also generate output data by:

1. Taking input data (mock or real)
2. Applying prompts to generate outputs
3. Producing structured data for downstream systems

**Real-World Example** (Storyline App - Boy and the Baker):

### INPUT

Simple narrative transcript (3,250 characters):

```
The Boy and the Baker by Vaz
An elderly baker walking to his shop sees a boy being
bullied and beaten by a gang of older children...
[Full story: 631 words, ~5 minutes]
```

### PROMPTS APPLIED

Series of prompts for:

- Character extraction and profiling
- Visual scene breakdown
- Shot composition and camera angles
- Emotional tone and mood
- Animation instructions
- Color palette and styling

### OUTPUT

Rich storyline JSON (21KB structured data):

```json
{
  "metadata": {
    "totalBeats": 64,
    "totalVisualConcepts": 16,
    "totalImageVariations": 68,
    "totalAnimations": 68,
    "totalDuration": 298.84
  },
  "cast": [
    {
      "key": "baker",
      "name": "The Baker",
      "age": "60-63",
      "visualProfile": {
        "build": "Sturdy frame, gently weathered",
        "colorSignature": ["warm ochre", "dusty brown", "cream"],
        "symbolism": "Bread as sacrament; represents sanctuary"
      }
    }
    // ... more characters
  ],
  "beats": [
    {
      "id": 1,
      "timing": { "start": "00:05.56", "end": "00:13.36" },
      "narrative": { "text": "...", "speaker": "narrator" },
      "visualConcepts": [
        {
          "conceptNumber": 1,
          "description": "Baker walks toward shop",
          "shotType": "wide",
          "cameraAngle": "eye-level",
          "mood": "warm, peaceful",
          "characters": ["baker"]
        }
        // ... 67 more visual concepts across 64 beats
      ]
    }
    // ... 63 more beats
  ]
}
```

---

## The Transformation

**What Happened**:

- 631 words → 64 narrative beats with precise timing
- Simple text → Complete visual production specification
- Characters extracted with detailed visual profiles
- Every shot planned with camera angles, mood, composition
- Machine-readable format ready for animation pipeline

**This is POEM's Power**: Prompts as data transformation engine

- Input: Unstructured narrative
- Processing: Multiple specialized prompts
- Output: Fully structured production-ready data

This transforms POEM from "prompt tester" to **"data transformation pipeline"** using prompts as the transformation logic.

---

## Potential Fourth Agent: Data/Testing Agent

**Status**: Under consideration - may need separate agent for data workflows

**Possible Responsibilities**:

- Generate mock data based on schemas
- Validate data against schemas
- Test prompt rendering with various data scenarios
- Batch apply prompts to datasets (input → output transformation)
- Export/import data for testing

**Name Options**:

- **Data Engineer Agent** (focus: data generation and transformation)
- **Testing Agent** (focus: prompt validation and testing)
- **Data Workflow Agent** (focus: end-to-end data pipelines)

**Distinction from Other Agents**:

- **Prompt Engineer**: Creates/refines prompts (content focus)
- **System Agent**: Maintains infrastructure (Astro, Handlebars, APIs)
- **Integration Agent**: Connects to external providers (publish/sync)
- **Data/Testing Agent**: Works with data (generate, validate, transform, test)

**Open Question**: Is this a separate agent or an extension of Testing/Prompt Engineer responsibilities?

**Design Principle**: Don't create agent until workflows clearly demand it

---

## Advanced Mock Data (Level 2)

**Concept**: Beyond simple field-level generation - persistent, meaningful mock data ecosystem

### Three Sources of Mock Data

#### 1. Hand-Crafted Scenarios

**What**: Curated, realistic test data with backstories

**SupportSignal Example**:

```json
{
  "mockParticipants": [
    {
      "id": "p1",
      "name": "Alex Chen",
      "age": 28,
      "primaryDisability": "Autism Spectrum Disorder",
      "backstory": "Lives independently, requires support with social situations and sensory environments",
      "commonScenarios": ["sensory-overload", "routine-disruption", "social-anxiety"]
    },
    {
      "id": "p2",
      "name": "Maria Santos",
      "age": 45,
      "primaryDisability": "Cerebral Palsy",
      "backstory": "Uses wheelchair, active community participant, requires physical support",
      "commonScenarios": ["mobility-incident", "equipment-failure", "access-barrier"]
    },
    {
      "id": "p3",
      "name": "David Thomson",
      "age": 19,
      "primaryDisability": "Intellectual Disability",
      "backstory": "Lives in supported accommodation, learning life skills",
      "commonScenarios": ["behavioral-episode", "medication-related", "skill-development"]
    }
  ]
}
```

**Benefits**:

- Realistic, consistent characters across tests
- Meaningful scenarios that reflect real-world patterns
- Test edge cases (rare scenarios, complex interactions)
- Builds institutional knowledge

**Use Case**: Testing incident classification prompt with Alex, Maria, and David across various scenarios

---

#### 2. Anonymized Production Data

**What**: Real data from production system, de-identified and privacy-safe

**Process**:

```
1. Export production data via provider API
2. Anonymize:
   - Replace names with mock names
   - Randomize dates (keep relative timing)
   - Remove identifying information (addresses, phone numbers)
   - Preserve structure and relationships
3. Store in POEM mock data library
4. Use for prompt testing
```

**Example** (SupportSignal incident):

```json
{
  "original": {
    "participantName": "John David Smith",
    "dob": "1985-03-15",
    "address": "123 Main St, Sydney",
    "eventDateTime": "2025-11-08 14:30"
  },
  "anonymized": {
    "participantName": "Alex Chen", // From mock library
    "dob": "1997-05-22", // Randomized but preserves age range
    "address": "[REDACTED]", // Privacy-sensitive
    "eventDateTime": "2025-11-12 09:15" // Recent, random time
  }
}
```

**Benefits**:

- Test with realistic data patterns
- Discover edge cases from production
- No privacy/security concerns
- Can be hand-tuned after anonymization

---

#### 3. AI-Generated from Schemas

**What**: Automated generation based on schema + data source + constraints

**Current Approach** (Level 1):

```javascript
// Simple field-level generation
{
  participantName: faker.person.fullName(),
  location: faker.random.arrayElement(['Kitchen', 'Bedroom', 'Bathroom']),
  eventDateTime: faker.date.recent()
}
```

**Advanced Approach** (Level 2):

```javascript
// Entity-aware generation with relationships
{
  participant: mockParticipants.random(),  // Reuse persistent entity
  incident: {
    type: participant.commonScenarios.random(),  // Scenario matches participant
    location: participant.preferredLocations.random(),
    reporter: participant.supportWorkers.random(),  // Relationship-aware
    context: generateContextFor(participant, scenarioType)  // AI-generated narrative
  }
}
```

**Benefits**:

- Scale to hundreds of scenarios
- Maintain entity consistency
- Relationship-aware (reporter knows participant)
- Scenario-appropriate (autism participant → sensory scenarios more common)

---

### Entity-Level Mock Data

**Concept**: Mock data organized by entity type, with persistent identities

**Structure**:

```
/poem/mock-data/
├── participants.json         # 5-10 mock participants with full profiles
├── support-workers.json      # Staff who might report incidents
├── locations.json           # Facilities/rooms where incidents occur
├── incidents/               # Pre-generated incident scenarios
│   ├── p1-sensory-overload.json
│   ├── p2-mobility-fall.json
│   └── ...
└── workflows/               # Multi-step workflow scenarios
    ├── incident-workflow-1.json
    └── ...
```

**Key Principle**: **Entities are persistent, scenarios are composed**

Example workflow:

1. **Prompt**: "Classify incident severity"
2. **Mock Data**: Use `p1-sensory-overload.json` (Alex Chen in kitchen, auditory trigger)
3. **Output**: Severity classification + rationale
4. **Next Prompt**: "Generate action plan for moderate severity incident"
5. **Mock Data**: Use _output from previous prompt_ as input to next
6. **Output**: Action plan (becomes part of workflow scenario)

---

### Output Data as Mock Data

**Concept**: Prompts generate data that feeds other prompts (pipeline testing)

**Workflow Example** (SupportSignal incident lifecycle):

```
1. Classify Incident Prompt
   Input: Raw incident report (mock data)
   Output: {severity: "moderate", category: "behavioral", riskLevel: 3}

2. Generate Action Plan Prompt
   Input: Classification output (becomes mock data for this prompt)
   Output: {actions: [...], timeline: "...", responsibleParty: "..."}

3. Draft Report Prompt
   Input: Original incident + classification + action plan (all mock data)
   Output: Formatted incident report (ready for review)

4. Extract Key Events Prompt
   Input: Final report (output from previous)
   Output: Timeline of events for analytics
```

**Storage**:

```
/poem/mock-data/workflows/incident-pipeline-1/
├── 1-raw-incident.json           # Initial mock data
├── 2-classification-output.json  # Prompt 1 output
├── 3-action-plan-output.json     # Prompt 2 output
├── 4-final-report-output.json    # Prompt 3 output
└── 5-timeline-output.json        # Prompt 4 output
```

**Benefits**:

- Test entire workflow, not just individual prompts
- Validate data flows between prompts
- Catch integration issues early
- Build library of realistic workflow scenarios

---

### Mock Data Library Management

**Operations**:

- **Create Scenario**: Hand-craft or generate new mock scenario
- **Import from Production**: Anonymize real data
- **Version Scenarios**: Track changes to mock data over time
- **Tag Scenarios**: `#edge-case`, `#common`, `#regression-test`
- **Search Scenarios**: Find relevant test data by participant, type, severity
- **Export Scenarios**: Share mock data across team

**Agent Responsibility** (Data/Testing Agent):

- Manage mock data library
- Generate new scenarios on demand
- Anonymize production data
- Validate scenario completeness
- Curate scenario collection

---

### Why This Matters

**Level 1 Mock Data**: Good for basic prompt testing

- "Does this prompt work with any data?"
- Generate fields, test syntax

**Level 2 Mock Data**: Essential for production-ready prompts

- "Does this prompt work with realistic scenarios?"
- Test edge cases, workflows, data quality
- Build regression test suite
- Enable workflow testing (multi-prompt pipelines)
- Support compliance/audit requirements

**For SupportSignal**: Can't just test with "John Smith in Kitchen"

- Need realistic participant profiles
- Need scenario variety (behavioral, medical, environmental)
- Need workflow testing (incident → classification → action → report)
- Need compliance validation (all required fields, proper categorization)

**For Storyline**: Can't just test with "generic character"

- Need consistent character profiles across beats
- Need visual continuity (color signature, build, mood)
- Need scene-to-scene transitions
- Need full pipeline testing (narrative → characters → beats → shots)

---

**See also**:

- [agents.md](./agents.md) - Agent definitions (includes Data/Testing consideration)
- [workflows.md](./workflows.md) - How data flows through workflows
- [skills.md](./skills.md) - Skills for data generation and testing
- ../../data/storyline/README.md - Complete Storyline example demonstrating transformation

**Last Updated**: 2025-11-21
