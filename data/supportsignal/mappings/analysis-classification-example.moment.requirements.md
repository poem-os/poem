# Mapping Requirement: Classification for Moments

**Status**: EXAMPLE ONLY - Reference for requirements format
**Target Template**: `analysis-classification-example`
**Source Data**: `moment` data source
**Requester**: Angela (example)
**Date**: 2025-11-11

## What I Need

I want to use the `analysis-classification-example` template with moment data, but the data structure requires transformation.

### Template Placeholders (what the prompt expects):
- `categories` (string) - Comma-separated list of valid categories
- `input` (text) - The text to be classified

### Source Data (what moments provide):
- `moment_type` (enum/code)
- `observation_notes` (text)
- `impact_rating` (number 1-5)
- `person.first_name` + `person.last_name` (separate fields)

## Transformations Needed

1. **categories**: Hard-coded list based on moment types: "Positive Interaction, Challenging Behavior, Medical Concern, Routine Activity"
2. **input**: Combine observation notes with participant name and impact level for context
   - Format: "[Name] - Rating [X]/5: [observation_notes]"
   - Example: "John Smith - Rating 4/5: Became agitated during meal preparation"

## Implementation Notes

Developer would create `MomentToClassificationMapper` class in main app with logic to:
- Combine first_name + last_name
- Format the input string with rating
- Provide fixed categories list

---

**This is a reference example** showing how Angela would document requirements for a complex mapper.
