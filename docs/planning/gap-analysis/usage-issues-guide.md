# Usage Issues Tracking Guide

## Overview

`usage-issues.jsonl` is a structured log of issues discovered during real-world POEM usage and testing. Each line is a JSON object conforming to `usage-issues.schema.json`.

## Schema

See `usage-issues.schema.json` for the complete schema definition.

### Key Fields

- **timestamp**: When the issue was observed (ISO 8601)
- **category**: Type of issue (`bug`, `missing-feature`, `usability`, `docs-gap`, `architecture`, `performance`)
- **severity**: Impact level (`critical`, `high`, `medium`, `low`)
- **observation**: Detailed description of what was observed
- **resolution**: ⭐ NEW - Resolution tracking for fixed issues

## Resolution Status

The `resolution` object tracks issue lifecycle:

```json
{
  "resolution": {
    "status": "fixed",
    "fixedIn": "Story 1.9",
    "fixedDate": "2026-01-20T00:00:00Z",
    "fixDescription": "How the issue was resolved",
    "verifiedBy": "Who verified the fix"
  }
}
```

### Status Values

- **`open`**: Issue not yet addressed (default if no resolution field)
- **`fixed`**: Issue has been fixed with code changes
- **`resolved`**: Issue resolved (may not require code changes)
- **`wont-fix`**: Decided not to fix (document reasoning in fixDescription)
- **`duplicate`**: Duplicate of another issue (reference in fixDescription)

## Usage Guidelines

### For Agents/Commands Reading This File

When displaying issues to users:

1. **Default behavior**: Show only `open` issues (no resolution field or `resolution.status === "open"`)
2. **All issues**: Use `--all` flag to include fixed/resolved issues
3. **Fixed issues**: Use `--fixed` flag to show only resolved issues
4. **Filter by severity**: Use `--severity=critical` to show specific severity levels

### Example Filtering Logic

```javascript
// Show only open issues (default)
const openIssues = issues.filter(issue =>
  !issue.resolution || issue.resolution.status === 'open'
);

// Show all issues
const allIssues = issues;

// Show fixed issues
const fixedIssues = issues.filter(issue =>
  issue.resolution && ['fixed', 'resolved'].includes(issue.resolution.status)
);

// Show critical open issues
const criticalOpenIssues = issues.filter(issue =>
  issue.severity === 'critical' &&
  (!issue.resolution || issue.resolution.status === 'open')
);
```

### For Issue Reporters

When adding new issues:

1. Omit the `resolution` field (defaults to open)
2. Use semantic line breaks in long descriptions
3. Tag appropriately for discoverability
4. Reference related files, commands, and docs

When resolving issues:

1. Add `resolution` object with complete information
2. Keep the original issue data intact
3. Verify the fix before marking as `fixed`
4. Use `resolved` for issues that don't require code changes

## Current Status Summary

As of 2026-01-21:

- **Fixed**: Issues #1, #2, #6, #9, #10 (5 issues)
- **Open**: Issues #3, #4, #5, #7, #8 (5 issues)

### Fixed Issues

1. **Issue #1**: dev-workspace location (fixed in commit 5a3744a)
2. **Issue #2**: Port configuration (already correct, verified)
3. **Issue #6**: Critical data loss risk (fixed in Story 1.9)
4. **Issue #9**: Granular upgrade control (fixed in Story 1.9)
5. **Issue #10**: Preservation ruleset (fixed in Story 1.9)

### Open Issues

3. **Issue #3**: Slash command naming (agent name vs role)
4. **Issue #4**: Extension mechanism for agent customization
5. **Issue #5**: Prompt templates vs prompt instances
7. **Issue #7**: Agent discovery (missing Tyler agent)
8. **Issue #8**: Schema input/output distinction

## Integration with POEM Agents

### For Victor (Capability Progression Validator)

Victor should check usage-issues.jsonl for:
- Open issues related to completed stories
- Regression detection (fixed issues reappearing)
- Coverage gaps in validation

### For Penny (Prompt Engineer)

When users ask about known issues or limitations, Penny can reference:
- Open issues matching the query
- Workarounds documented in additional_notes
- Suggested epics/stories for future work

### For Future Agents

Any agent dealing with quality, testing, or validation should:
- Filter for `open` issues by default
- Respect severity levels when prioritizing
- Update resolution status when fixing issues
- Verify fixes match issue descriptions

## Tools and Commands

### Viewing Issues

```bash
# Show open issues (default)
grep -v '"resolution"' usage-issues.jsonl | jq .

# Show all issues with resolution status
cat usage-issues.jsonl | jq 'select(.resolution.status)'

# Show critical open issues
cat usage-issues.jsonl | jq 'select(.severity == "critical" and (.resolution.status == "open" or .resolution == null))'

# Count by status
cat usage-issues.jsonl | jq -r '.resolution.status // "open"' | sort | uniq -c
```

### Adding Issues

```bash
# Append new issue (use proper JSON formatting)
echo '{"timestamp":"...","observation":"..."}' >> usage-issues.jsonl
```

### Updating Resolutions

See the Python script example in Story 1.9 implementation for batch updates.

## Schema Evolution

If adding new fields to the schema:

1. Update `usage-issues.schema.json`
2. Document in this guide
3. Update filtering logic in agents/commands
4. Consider backward compatibility (optional fields)

---

**Last Updated**: 2026-01-21
**Schema Version**: 1.0.0
