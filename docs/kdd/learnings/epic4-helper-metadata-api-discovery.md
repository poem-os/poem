# Learning: Helper Metadata Needed for Agent-Driven Development

**Date**: 2026-01-13
**Source**: Story 4.4 (Implement Required Handlebars Helpers)
**Category**: API Design / Agent Integration

## Context

Implementing 4 Handlebars helpers (gt, truncate, join, formatTimestamp) for YouTube templates. Initial implementation focused on core functionality: register helpers, ensure they work in templates.

## Challenge

**Discovery during implementation**: Agents (like Penny, the Prompt Engineer) need to **discover and understand** available helpers programmatically.

**Use case scenario**:
1. User asks Penny: "What helpers can I use in my template?"
2. Penny needs to query: "Which helpers exist and what do they do?"
3. Current state: No API endpoint, no metadata on helper functions
4. Problem: Penny can't answer without parsing source code

**Initial implementation** (insufficient):
```javascript
// Helper function only
function truncate(str, length) {
  // ...logic
}

export default truncate;
```

**Gap identified**: No way for agents to discover:
- Helper name
- Description (what it does)
- Usage example (how to call it)

## Solution

**Add metadata exports to helpers**:

```javascript
// Helper function
function truncate(str, length) {
  if (typeof str !== 'string') return '';
  if (str.length <= length) return str;
  if (length < 4) return str.slice(0, length);
  return str.slice(0, length - 3) + '...';
}

// ✅ Metadata for API discovery
truncate.description = "Truncates a string to specified length with ellipsis";
truncate.example = '{{truncate title 50}} → "First 50 characters..."';

export default truncate;
```

**API endpoint for listing helpers**:
```typescript
// GET /api/helpers
{
  "helpers": [
    {
      "name": "truncate",
      "description": "Truncates a string to specified length with ellipsis",
      "example": "{{truncate title 50}} → \"First 50 characters...\""
    },
    {
      "name": "formatTimestamp",
      "description": "Converts seconds to MM:SS timestamp format",
      "example": "{{formatTimestamp 125}} → \"02:05\""
    },
    // ... all helpers
  ]
}
```

**Agent workflow enabled**:
```
User: "What helpers can I use?"
  ↓
Penny: Calls GET /api/helpers
  ↓
Penny: Formats response for user:
"Available helpers:
- truncate: Truncates strings ({{truncate title 50}})
- formatTimestamp: Converts seconds to MM:SS ({{formatTimestamp 125}})
- ..."
```

## Outcome

**Benefits**:
- ✅ Agents can discover helpers programmatically
- ✅ API-first design (helpers queryable via HTTP)
- ✅ Self-documenting (metadata on function, not separate file)
- ✅ Tests validate metadata exists (helper.description required)
- ✅ Single source of truth (code + metadata in same file)

**Validation**:
- 146/146 helper tests passing (including metadata validation)
- `/api/helpers` endpoint returns all helpers with descriptions
- Penny agent can query and explain available helpers

**Test pattern**:
```typescript
describe('Helper metadata', () => {
  it('should have description property', () => {
    expect(truncate.description).toBeDefined();
    expect(typeof truncate.description).toBe('string');
  });

  it('should have example property', () => {
    expect(truncate.example).toBeDefined();
    expect(typeof truncate.example).toBe('string');
  });
});
```

## Prevention with Epic 3 Knowledge ⭐

- **Was this avoidable?**: Yes - Epic 3 established API-First pattern, should have applied to helpers
- **Epic 3 Learning Missed**: [ADR-003: API-First Heavy Operations](../decisions/adr-003-api-first-for-heavy-operations.md) - "Skills document API calls in 'API Calls' section"
- **Root Cause**: Helpers treated as internal utilities, not API-accessible resources

**Why missed**: Helpers were implemented as template utilities (internal concern), not as discoverable resources for agents (external concern).

**Epic 3 pattern that should have applied**: "Skills Self-Description Format" - if skills need self-description, helpers do too.

## Discovery Mode Status ⭐

- **Triggered?**: No
- **Architecture Docs Read**: Limited (tech-stack.md for Handlebars, not API design patterns)
- **Should Have Triggered?**: Yes - reading ADR-003 (API-First) and API-specification.md would have revealed this requirement earlier

**Mitigation**: Added metadata during implementation (not post-implementation), so minimal rework.

## Future Application

**When creating extensible systems**:

1. ✅ **DO**: Add metadata to all discoverable resources (helpers, validators, generators)
2. ✅ **DO**: Create API endpoints for programmatic discovery
3. ✅ **DO**: Test metadata exists on all resources (prevent regressions)
4. ✅ **DO**: Colocate metadata with code (single source of truth)
5. ❌ **DON'T**: Treat internal utilities as non-discoverable (agents need all info)
6. ❌ **DON'T**: Put documentation in separate files (stale risk)

**Metadata pattern template**:
```javascript
function myHelper(...) { /* logic */ }

// Metadata for API discovery
myHelper.description = "Short description of what helper does";
myHelper.example = '{{myHelper arg1}} → "expected output"';

export default myHelper;
```

**API design pattern**:
- Listing endpoint: `GET /api/[resource-type]` (e.g., `/api/helpers`, `/api/validators`)
- Returns array of objects with: name, description, example
- Agents call this endpoint to discover capabilities

## Related Knowledge

- **Story**: `docs/stories/4.4.story.md` (Implement Required Handlebars Helpers)
- **Pattern**: [Handlebars Helper Module Pattern](../patterns/4-handlebars-helper-module-pattern.md)
- **ADR**: [ADR-007: ESM Helpers with Hot-Reload](../decisions/adr-007-esm-helpers-hot-reload.md)
- **Epic 3 Reference**: [ADR-003: API-First Heavy Operations](../decisions/adr-003-api-first-for-heavy-operations.md) (pattern that should have been applied)

---

**Learning Captured**: 2026-01-13
**Impact**: Medium (added during implementation, not post-facto)
**Prevention**: Apply API-First pattern to all discoverable resources, not just heavy operations
**Last Updated**: 2026-01-19
