# SupportSignal Application - POEM Planning Example

**Status**: Planning reference data
**Purpose**: Demonstrate POEM capabilities with NDIS/healthcare domain
**Source**: SupportSignal (app.supportsignal.com.au - Angela's client)

---

## What This Example Shows

This is a **real-world example** of AI-powered incident reporting and analysis in the NDIS (National Disability Insurance Scheme) sector.

**Focus**: Linear workflows with single-step prompts
**Pattern**: Workflow-driven prompt orchestration
**Use Case**: Enhance incident narratives, classify severity, extract timelines

This demonstrates POEM's capabilities for:

- Compliance-heavy industries
- Structured data workflows
- Template reusability (same prompt, different incidents)
- Privacy-sensitive contexts (mock data generation critical)

---

## Directory Structure

```
supportsignal/
├── prompts/                   # Workflow-based templates
│   ├── ask-clarifying-questions.hbs
│   ├── enhance-narrative.hbs
│   ├── classify-incident-severity.hbs
│   ├── extract-key-events.hbs
│   └── sentiment-analysis.hbs
│
├── schemas/                   # Entity structure definitions
│   ├── incident-schema.json
│   ├── participant-schema.json
│   ├── company-schema.json
│   └── location-schema.json
│
├── mappings/                  # Data transformations
│   └── (TBD - may not be needed with Handlebars)
│
└── archive/                   # Historical/deprecated files
```

---

## The SupportSignal Workflow

### Current Process (Main App)

```
1. User creates incident
   ↓
2. AI asks clarifying questions (Prompt: ask-clarifying-questions.hbs)
   ↓
3. User answers questions
   ↓
4. AI enhances narrative (Prompt: enhance-narrative.hbs)
   ↓
5. Manager reviews enhanced incident
```

### Analysis Prompts (Additional)

**Classification**:

- `classify-incident-severity.hbs` - Risk assessment (low/medium/high/critical)
- `sentiment-analysis.hbs` - Emotional tone detection

**Extraction**:

- `extract-key-events.hbs` - Timeline and critical moments
- `extract-participants.hbs` - Who was involved

---

## Data Source Patterns

**Core Concept**: Same entity type (incident) can have different data source contexts

### Data Source Types

**`incident.single`** - Complete incident record

- All 4 phases (before_event, event, after_event, immediate_action)
- Full participant details
- Complete location data
- All related Q&A

**`incident.collection`** - Multiple incidents

- Used for comparison prompts
- Example: "Which of these 5 incidents is riskiest?"
- Requires format specification (JSON array? Markdown table?)

**`incident.view`** - Partial data for specific workflow

- Metadata + before_event only (for initial questions)
- Useful for staged workflows where full data isn't available yet

### Other Entity Types

- `participant.single` - Individual participant data
- `company.single` - Organization details
- `location.single` - Location information
- `moment.single` - Daily observation notes
- `shift_note.single` - Shift handover notes

---

## Key Entities

### Incident (Primary Entity)

**Core Fields**:

- `participantName` - Who was involved
- `location` - Where it happened
- `incidentDate` - When it occurred
- `severity` - Risk level (calculated or manual)

**Narrative Phases** (4 parts):

1. `before_event` - What led up to the incident
2. `event` - What happened during the incident
3. `after_event` - What happened after
4. `immediate_action` - Actions taken in response

**Related Data**:

- Questions/Answers (Q&A thread)
- Attachments (photos, documents)
- Staff notes
- Manager reviews

### Participant

**Fields**:

- `firstName`, `lastName`
- `ndisNumber` - NDIS participant ID
- `supportLevel` - Level of support required
- `communicationPreferences`
- `triggers` - Known triggers for behaviors

### Company

**Fields**:

- `name` - Organization name
- `abnNumber` - Australian Business Number
- `address`
- `contactDetails`

---

## Template Reusability Example

**Same Template, Different Use Cases**:

**Sentiment Analysis Template**:

```handlebars
Analyze the emotional tone of the following text:

{{narrativeText}}

Identify: 1. Primary emotion 2. Secondary emotions 3. Overall sentiment (positive/neutral/negative)
4. Concerning phrases (if any)
```

**Can be applied to**:

- `incident.single` → narrativeText = incident.event
- `moment.single` → narrativeText = moment.observation
- `shift_note.single` → narrativeText = shift_note.notes

This demonstrates **cross-entity template reusability** - one template, multiple entity types.

---

## Privacy & Mock Data

**Critical Requirement**: NDIS data is highly sensitive (personal health information)

**POEM's Solution**: Mock data generation

- Generate realistic incident scenarios without real participant data
- Test prompts thoroughly before production deployment
- No production database access needed during prompt development

**Example Mock Data**:

```json
{
  "participantName": "John Smith",
  "location": "Kitchen",
  "incidentDate": "2024-11-15",
  "before_event": "John was preparing lunch with staff support...",
  "event": "John became frustrated when unable to open a container...",
  "after_event": "Staff redirected John to a calming activity...",
  "immediate_action": "Incident documented, family notified..."
}
```

---

## Comparison: SupportSignal vs Storyline

| Aspect           | SupportSignal (This Folder)              | Storyline                                    |
| ---------------- | ---------------------------------------- | -------------------------------------------- |
| **Domain**       | Healthcare/Compliance                    | Creative/Content                             |
| **Input**        | Incident reports                         | Narrative transcript                         |
| **Output**       | Enhanced narratives, analysis            | Visual production spec                       |
| **Workflow**     | Linear (Q&A → enhance)                   | Pipeline (extract → style → segment)         |
| **Prompts**      | 8 workflow-specific                      | 4 transformation steps                       |
| **Data Sources** | `incident.single`, `incident.collection` | `storyline.transcript`, `storyline.complete` |
| **Complexity**   | Single-step prompts                      | Multi-step orchestration                     |
| **Use Case**     | Improve compliance documentation         | Generate production assets                   |

---

## What POEM Needs to Support This

1. **Data Source Flexibility**: Handle single vs collection vs view contexts
2. **Template Reusability**: One template, multiple entity types
3. **Mock Data Generation**: Generate realistic NDIS scenarios
4. **Schema Validation**: Ensure fields match data dictionary
5. **Provider Integration**: Publish to Convex/SupportSignal

---

## Notes

- **Prompts are workflow-based** (step-by-step user journey)
- **Linear progression** (unlike Storyline's pipeline)
- **Privacy-first** (mock data generation essential)
- **Compliance-focused** (NDIS regulations, documentation standards)
- **This is planning reference data** to inform POEM's architecture

---

**Last Updated**: 2025-11-20
