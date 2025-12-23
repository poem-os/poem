# Data Dictionary

**Status**: Blocked
**BMAD Ready**: No (blocked on main app export)
**Purpose**: Reference guide for Angela to understand available fields in each data source
**Owner**: Development team (ideally auto-generated from main app)

**IMPORTANT**: Current field examples below are based on planning assumptions, NOT actual database schema. We need to export real schema from main app before this becomes authoritative.

## Why This Matters

Angela needs to know:

- What data sources exist (incident, shift_note, moment, etc.)
- What fields each data source has
- Field types and whether they're required
- Relationships between data sources
- Example values

This enables her to:

- Create simple JSON mapping files herself
- Write requirements for complex mappers
- Understand what's possible with each data source

## Data Sources (To Be Documented)

### Incident

**Status**: ✅ Documented in template schemas
**Fields**: See `data/schemas/enhance-narrative-*.json` for current incident fields

Common incident fields:

- `participantName` (string)
- `eventDateTime` (datetime)
- `location` (string)
- `reporterName` (string)
- `beforeEvent`, `duringEvent`, `endEvent`, `postEvent` (text)
- `beforeEventQA`, `duringEventQA`, `endEventQA`, `postEventQA` (array)

### Shift Note

**Status**: ⏳ Needs documentation
**Fields**: To be documented

Expected fields (based on mapping examples):

- `resident.full_name`
- `note_category`
- `priority_level`
- `location.room_name`
- `author.name`
- `narrative.summary`

### Moment

**Status**: ⏳ Needs documentation
**Fields**: To be documented

Expected fields (based on mapping examples):

- `person.first_name`
- `person.last_name`
- `person.preferred_name`
- `moment_type`
- `impact_rating` (1-5)
- `place.area`
- `place.building`
- `recorded_by.first_name`
- `recorded_by.last_name`
- `observation_notes`

### Other Data Sources

**Status**: ⏳ To be identified

## Ideal Format (Future)

```yaml
data_source: incident
description: NDIS incident reports
table: incidents
fields:
  participantName:
    type: string
    required: true
    description: Name of the participant involved
    example: "John Smith"

  eventDateTime:
    type: datetime
    required: true
    description: When the incident occurred
    example: "2025-11-08 14:30"

  location:
    type: string
    required: true
    description: Where the incident occurred
    example: "Kitchen"

  beforeEvent:
    type: text
    required: true
    description: What happened before the incident
    example: "Participant was in day room watching TV..."

relationships:
  - participant → people.id
  - reporter → staff.id
  - location → locations.id
```

---

## Requirements: Data Dictionary Export from Main App

**Blocker**: This data dictionary cannot be accurate until we export real schema from main app.

### Required Implementation (Main App)

**New Convex Function**: `apps/convex/dataDictionary.ts` (or add to `dataSource.ts`)

```typescript
export const generateDataDictionary = query({
  args: {
    sessionToken: v.string(),
    dataSources: v.optional(v.array(v.string())), // Optional filter
  },
  handler: async (ctx, args) => {
    // 1. Verify system admin privileges
    // 2. Read schema.ts definitions
    // 3. Transform to data dictionary format
    // 4. Return structured field definitions
  },
});
```

### Output Format Required

```json
{
  "exportedAt": "2025-11-11T10:30:00Z",
  "version": "1.0.0",
  "dataSources": {
    "incident": {
      "description": "NDIS incident reports with four-phase narratives",
      "table": "incidents",
      "fields": {
        "participantName": {
          "type": "string",
          "required": true,
          "description": "Name of the participant involved in the incident",
          "example": "John Smith",
          "path": "participantName"
        },
        "eventDateTime": {
          "type": "datetime",
          "required": true,
          "description": "Date and time when the incident occurred",
          "example": "2025-11-08T14:30:00Z",
          "path": "eventDateTime"
        },
        "beforeEventQA": {
          "type": "array",
          "required": false,
          "description": "Q&A for before phase",
          "items": {
            "question": "string",
            "answer": "string"
          },
          "example": [
            {
              "question": "How did they seem?",
              "answer": "Tired"
            }
          ],
          "path": "beforeEventQA"
        }
      },
      "relationships": {
        "participant": {
          "table": "people",
          "field": "participant_id",
          "description": "References the participant involved"
        },
        "reporter": {
          "table": "staff",
          "field": "reporter_id",
          "description": "References the staff member who reported"
        }
      }
    }
  }
}
```

### Field Information Needed

For each field, export:

1. **type**: `string`, `text`, `number`, `datetime`, `boolean`, `array`, `object`
2. **required**: Is the field required?
3. **description**: Human-readable explanation
4. **example**: Sample value for testing
5. **path**: Dot notation path for nested fields (e.g., `resident.full_name`)
6. **items**: For arrays, describe the item structure
7. **fields**: For objects, describe nested fields

### Security Requirements

- **System admin only**: Use same security pattern as `generateDatabaseExport`
- Verify `sessionToken` has system admin privileges
- Do NOT export sensitive fields (passwords, tokens, etc.)
- Schema information only (no actual data)

### Source Files (Main App)

**Schema location**: `apps/convex/schema.ts` (lines 1-623)
**Existing export pattern**: `apps/convex/exports.ts` (has pattern for exporting)
**Export code location**: `/Users/davidcruwys/dev/clients/supportsignal/app.supportsignal.com.au/apps/convex/exports.ts`

### Type Mapping (Convex → Data Dictionary)

| Convex Type      | Dictionary Type |
| ---------------- | --------------- |
| `v.string()`     | `"string"`      |
| `v.number()`     | `"number"`      |
| `v.boolean()`    | `"boolean"`     |
| `v.array()`      | `"array"`       |
| `v.object()`     | `"object"`      |
| Custom datetime  | `"datetime"`    |
| Long text fields | `"text"`        |

### API Endpoint (Optional)

If exposing via HTTP API:

**Endpoint**: `GET /api/data-dictionary`
**Authentication**: Bearer token (system admin)
**Response**: Same JSON format as above

```bash
curl https://app.supportsignal.com.au/api/data-dictionary \
  -H "Authorization: Bearer [token]"
```

### Data Sources to Include

**Required** (current):

- `incident` - NDIS incident reports
- `shift_note` - Daily shift observations
- `moment` - Voice recording transcripts

**Optional** (future):

- Any other tables that might be used as prompt data sources

### Acceptance Criteria

- ✅ Function callable by system admin
- ✅ Returns structured JSON with all data sources
- ✅ Each field has: type, required, description, example, path
- ✅ Nested objects properly documented with paths
- ✅ Arrays include item structure
- ✅ Relationships documented
- ✅ No sensitive information exposed
- ✅ Response includes metadata (exportedAt, version)

### Usage from Prompts App

Once implemented, the Prompts App will use Claude skill "Pull Data Dictionary":

1. **Pull data dictionary**

   ```bash
   bunx convex run dataDictionary:generate '{"sessionToken": "xxx"}'
   ```

2. **Save to file**

   ```
   Save response to: data/data-dictionary.json
   ```

3. **Git commit**

   ```bash
   git add data/data-dictionary.json
   git commit -m "Update data dictionary - 2025-11-18"
   ```

4. **Use for validation**
   - "Find Fields" skill searches this file
   - "Validate Schema" skill checks against this file
   - "Suggest Mappings" skill uses this file

---

## Priority

**HIGH** - This is a blocker for:

- Validating schemas in Prompts App
- Creating accurate mappings
- Angela understanding available fields
- Template testing with correct data structures

---

## Next Steps

- [ ] Implement `generateDataDictionary` function in main app
- [ ] Test export with real schema
- [ ] Create Claude skill "Pull Data Dictionary" in prompts app
- [ ] Replace placeholder field examples with real data
- [ ] Document any other data sources that could use prompts

---

**Last Updated**: 2025-11-18
