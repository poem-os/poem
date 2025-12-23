# Mapping Architecture Concepts

**Status**: Exploring
**BMAD Ready**: No (YAGNI - build when needed)
**Purpose**: Explores how templates could be reused across different data sources
**NOT**: Implementation specifications or requirements

## The Problem

Some prompts are **domain-specific** (tightly coupled to one data source):

- `enhance-narrative-before-event` - Only makes sense for incidents
- Uses incident-specific vocabulary and context

Other prompts are **generic** (could work with multiple data sources):

- `analysis-predicate-example` - Just needs context and a question
- `analysis-classification-example` - Just needs input and categories

When a generic prompt works great on incidents, business might want to use it on shift notes or moments. But field names differ across data sources.

## The Two Solutions

### 80%: Simple Data Mappings (Angela-Owned)

When field names differ but structure is similar, Angela creates a JSON mapping file.

**Example**: `data/mappings/analysis-predicate.shift-note.json`

```json
{
  "templateName": "analysis-predicate-example",
  "sourceDataSource": "shift_note",
  "description": "Maps shift note fields to incident analysis format",
  "fieldMappings": {
    "participant_name": "resident.full_name",
    "event_type": "note_category",
    "severity_level": "priority_level",
    "description": "narrative.summary"
  }
}
```

**Angela needs**: Data dictionary showing what fields exist in each data source

**Process**:

1. Angela tests prompt on incidents (works great)
2. Business wants it for shift notes
3. Angela checks data dictionary
4. Angela creates mapping JSON
5. System applies mapping automatically

### 20%: Complex Transformations (Developer-Owned)

When data needs transformation logic (combining names, converting codes, lookups), Angela writes requirements and developer builds code mapper in main app.

**Example**: `data/mappings/analysis-predicate.moment.requirements.md`

```markdown
# Mapping Requirement: Analysis Predicate for Moments

**Target Template**: `analysis-predicate-example`
**Source Data**: `moment` data source

## Transformations Needed

1. **participant_name**: Combine first_name + last_name
2. **event_type**: Translate moment_type codes to readable text
3. **severity_level**: Convert 1-5 rating to Low/Medium/High
4. **description**: Use observation_notes
```

**Developer builds** (in main app code):

```javascript
// EXAMPLE ONLY - Shows what COULD be built in target system
// This is NOT part of the prompts management app

class MomentToAnalysisMapper {
  transform(momentData) {
    return {
      participant_name: `${momentData.person.first_name} ${momentData.person.last_name}`,
      event_type: this.translateType(momentData.moment_type),
      severity_level: this.convertRating(momentData.impact_rating),
      description: momentData.observation_notes,
    };
  }
}
```

**Process**:

1. Angela realizes she needs complex transformation
2. Angela writes requirements document (or uses agent to help)
3. Developer builds mapper class in main app
4. Main app uses mapper when calling prompt

## Agent-Assisted Requirements

Potential future feature: Agent helps Angela write requirements by:

- Knowing the template placeholders (from schema)
- Knowing the data source fields (from data dictionary)
- Asking Angela what transformations are needed
- Generating requirements document

## Data Dictionary

**Critical dependency**: Angela needs to know what fields exist in each data source.

**Future work needed**:

1. Document current data sources and their fields
2. Build export feature in main app to generate data dictionary
3. Keep data dictionary updated as schema evolves
4. Show relationships between tables

**Example data dictionary entry**:

```
Data Source: shift_note
Fields:
  - resident.full_name (string)
  - resident.preferred_name (string, optional)
  - note_category (string)
  - priority_level (enum: Low, Medium, High, Critical)
  - location.room_name (string)
  - author.name (string)
  - narrative.summary (text)
Relationships:
  - resident → people table
  - author → staff table
```

## What We're NOT Building Yet

- ❌ Transformer library with reusable functions
- ❌ UI for creating mappings
- ❌ Agent for requirements generation
- ❌ Data dictionary export system

## What We Might Build Later

- ✅ Simple JSON mapping files (when needed)
- ✅ Requirements documents (when complex mapping needed)
- ✅ Code mappers in main app (on-demand)
- ✅ Data dictionary documentation (manual for now)

## Key Principles

1. **YAGNI**: Don't build mapping infrastructure until Angela needs it
2. **Angela-First**: If she can't understand it, it's too complex
3. **Data Dictionary**: Critical enabler - document early
4. **Simple by Default**: 80% should be JSON field mappings
5. **Code Escape Hatch**: 20% complex cases get custom code
6. **Clear Separation**: Mapping files vs mapper code vs requirements

## Example Use Cases

| Scenario                                    | Solution                   | Owner        |
| ------------------------------------------- | -------------------------- | ------------ |
| Shift note field names differ from incident | JSON mapping file          | Angela       |
| Need to combine first+last name             | Requirements → Code mapper | Angela → Dev |
| Need to decode legacy codes                 | Requirements → Code mapper | Angela → Dev |
| Need database lookup for location           | Requirements → Code mapper | Angela → Dev |
| Simple field path changes                   | JSON mapping file          | Angela       |

---

**Remember**: These are planning ideas. Build only when business need is proven.

**Last Updated**: 2025-11-11
