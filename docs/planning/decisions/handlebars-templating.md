# Handlebars.js Templating

**Status**: Exploring
**BMAD Ready**: Partial (decision needed: use or not?)
**Purpose**: Show how Handlebars could eliminate simple data mapping needs
**Context**: This is a brand new application - we have the luxury of choosing Handlebars from the start

## File Extension: .hbs

**Decision**: Use `.hbs` file extension for all template files

**Why**:
- ✅ `.hbs` is the standard Handlebars file extension
- ✅ Widely supported across editors (VS Code, WebStorm/IntelliJ, Sublime Text)
- ✅ Proper syntax highlighting in editors
- ✅ GitHub recognizes `.hbs` for syntax highlighting
- ✅ Clear indication of templating engine
- ✅ Industry standard

**Current status**: All templates in `data/prompts/` already use `.hbs` extension

---

## What is Handlebars?

Handlebars is a proven templating language that provides:
- Object path navigation (`{{person.first_name}}`)
- Conditionals (`{{#if}}...{{/if}}`)
- Loops (`{{#each}}...{{/each}}`)
- Custom helpers (developer-provided functions)
- Standard, well-documented syntax

## Why Handlebars?

**Currently**, templates use simple placeholders: `{{participantName}}`

**Problem**: When data sources have different structures, we need mapping files

**Handlebars**: Eliminates 80%+ of simple mappings by handling structure differences directly in templates

---

## Use Case Examples

### Use Case 1: Nested Object Paths

**Current Approach** (requires mapper):
```
Template: Hi {{participantName}}

Mapper needed:
{
  "participantName": "person.full_name"
}
```

**With Handlebars** (no mapper):
```handlebars
Template: Hi {{person.full_name}}

No mapping file needed - just pass nested object
```

---

### Use Case 2: Conditional Name Formatting

**Scenario**: Use preferred name if available, otherwise first name

**Current Approach** (requires code mapper):
```
Template: Hi {{displayName}}

Code mapper needed:
function map(data) {
  return {
    displayName: data.person.preferred_name || data.person.first_name
  }
}
```

**With Handlebars** (no mapper):
```handlebars
Hi {{#if person.preferred_name}}
  {{person.preferred_name}}
{{else}}
  {{person.first_name}}
{{/if}} {{person.last_name}}
```

---

### Use Case 3: Formal vs Casual Greetings

**Scenario**: Different greeting formats based on context

**With Handlebars**:
```handlebars
{{#if formal}}
  Dear {{#if recipient.title}}{{recipient.title}} {{/if}}{{recipient.last_name}},
{{else}}
  Hi {{recipient.first_name}},
{{/if}}

Your incident report is ready for review.
```

**Data variants that work**:
```javascript
// Formal with title
{formal: true, recipient: {title: "Mr", first_name: "David", last_name: "Cruwys"}}
// → "Dear Mr Cruwys,"

// Formal without title
{formal: true, recipient: {first_name: "David", last_name: "Cruwys"}}
// → "Dear Cruwys,"

// Casual
{formal: false, recipient: {first_name: "David", last_name: "Cruwys"}}
// → "Hi David,"
```

---

### Use Case 4: Lists and Iterations

**Scenario**: Display clarification questions and answers

**Current Approach** (requires formatting):
```
Template: Questions: {{questionsText}}

Formatter needed to convert array to text
```

**With Handlebars**:
```handlebars
**Clarification Questions:**

{{#each questions}}
Q{{@index}}: {{this.question}}
A: {{this.answer}}

{{/each}}
```

**Data**:
```javascript
{
  questions: [
    {question: "How did they seem?", answer: "Tired and quiet"},
    {question: "Was anyone else present?", answer: "Yes, 3 other participants"}
  ]
}
```

**Output**:
```
**Clarification Questions:**

Q0: How did they seem?
A: Tired and quiet

Q1: Was anyone else present?
A: Yes, 3 other participants
```

---

### Use Case 5: Custom Helpers for Common Patterns

**Scenario**: Format names consistently across templates

**Developer provides helper** (once):
```javascript
Handlebars.registerHelper('formatName', function(person, style) {
  if (style === 'full') {
    return `${person.first_name} ${person.last_name}`
  } else if (style === 'preferred') {
    return person.preferred_name || person.first_name
  } else if (style === 'formal') {
    return person.title ? `${person.title} ${person.last_name}` : person.last_name
  }
})
```

**Angela uses in templates**:
```handlebars
Participant: {{formatName participant style="preferred"}}
Reporter: {{formatName reporter style="formal"}}
```

**Same template works with different data sources** - no mapping files needed!

---

## What Handlebars Eliminates

### ✅ Simple Field Path Mappings
```json
// NO LONGER NEEDED
{
  "participantName": "person.full_name",
  "location": "place.room_name"
}
```

Use Handlebars paths instead: `{{person.full_name}}`, `{{place.room_name}}`

### ✅ Conditional Logic Mappings
```javascript
// NO LONGER NEEDED
displayName: data.preferred_name || data.first_name
```

Use Handlebars conditionals instead: `{{#if preferred_name}}...{{else}}...{{/if}}`

### ✅ Array Formatting
```javascript
// NO LONGER NEEDED
questionsText: data.questions.map(q => `Q: ${q.question}`).join('\n')
```

Use Handlebars loops instead: `{{#each questions}}...{{/each}}`

---

## What Handlebars DOESN'T Replace

Code mappers still needed for:

### ❌ Database Lookups
```javascript
// Still need code
location_name: await lookupLocationById(data.site_id)
```

### ❌ Complex Business Logic
```javascript
// Still need code
severity: calculateRiskLevel(data.impact, data.vulnerability, data.history)
```

### ❌ Data Validation/Transformation
```javascript
// Still need code
eventDate: parseAndValidateDate(data.event_timestamp)
```

### ❌ External API Calls
```javascript
// Still need code
staffDetails: await fetchStaffFromAPI(data.staff_id)
```

---

## Recommended Helper Library

**Developer provides these helpers** (Angela uses them in templates):

| Helper | Purpose | Example |
|--------|---------|---------|
| `formatName` | Handle name formats | `{{formatName person style="preferred"}}` |
| `formatDate` | Date/time formatting | `{{formatDate eventTime format="long"}}` |
| `formatList` | Array to comma-separated | `{{formatList items separator=", "}}` |
| `join` | Join with separator | `{{join names ", and "}}` |
| `truncate` | Limit text length | `{{truncate description 100}}` |
| `default` | Fallback value | `{{default optionalField "N/A"}}` |

---

## Benefits

1. **Fewer mapping files** - Template handles structure differences
2. **More flexible** - Same template works with multiple data sources
3. **Clearer intent** - Logic visible in template, not hidden in mapper
4. **Standard tooling** - Proven, documented, maintained
5. **Progressive enhancement** - Start simple, add helpers as needed

## Considerations

1. **Learning curve** - Angela needs to learn Handlebars syntax (but it's simpler than JSON mapping + code)
2. **Template complexity** - Logic in templates can get messy (keep helpers for complex logic)
3. **Testing** - Need to test templates with different data shapes

## Decision Criteria

**Use Handlebars when:**
- Simple data structure transformation
- Conditional rendering needed
- Format conversions (dates, names, lists)
- Template logic (if/else, loops)

**Use code mappers when:**
- Database/API lookups required
- Complex business logic
- Data validation/sanitization
- External system integration

---

## Example: Complete Template

**Scenario**: Incident report that works with different data structures

```handlebars
# Incident Report: {{incident.type}}

**Participant**: {{formatName participant style="full"}}
**Date/Time**: {{formatDate incident.datetime format="long"}}
**Location**: {{#if location.building}}{{location.building}} - {{/if}}{{location.room}}
**Reporter**: {{formatName reporter style="formal"}}

## What Happened

{{#if incident.narrative}}
{{incident.narrative}}
{{else}}
No narrative provided.
{{/if}}

## Clarification Details

{{#each clarifications}}
**Q**: {{this.question}}
**A**: {{this.answer}}

{{/each}}

{{#if incident.severity}}
**Severity Level**: {{incident.severity}}
{{/if}}

---
*Report generated by {{system.name}} on {{formatDate system.timestamp}}*
```

**Works with minimal data**:
```javascript
{
  incident: {type: "Behavioral", datetime: "2025-11-11T14:30:00"},
  participant: {first_name: "John", last_name: "Smith"},
  location: {room: "Kitchen"},
  reporter: {first_name: "Sarah", last_name: "Jones"}
}
```

**Works with rich data**:
```javascript
{
  incident: {
    type: "Behavioral",
    datetime: "2025-11-11T14:30:00",
    narrative: "Participant became agitated...",
    severity: "Medium"
  },
  participant: {first_name: "John", last_name: "Smith", preferred_name: "Johnny"},
  location: {building: "Main House", room: "Kitchen"},
  reporter: {title: "Ms", first_name: "Sarah", last_name: "Jones"},
  clarifications: [
    {question: "What triggered it?", answer: "Loud noise from kitchen"}
  ]
}
```

Same template, no mapping files!

---

**Last Updated**: 2025-11-11
