---
# Pattern Template Metadata
domain: "installation"
topic: "port-allocation"
status: "Active"
created: "2026-01-30"
story_reference: "Story 1.7"
pattern_type: "Architectural Pattern"
last_updated: "2026-01-30"
---

# Installation - Port Allocation Strategy Pattern

> **Pattern Name**: port-allocation-strategy
> **Type**: Architectural Pattern
> **Status**: Active
> **First Used**: Story 1.7

## Context

**When to use this pattern**:
- Allocating network ports for multiple installations of a local development server
- Preventing port conflicts across project installations
- Making port allocation predictable and discoverable
- Providing a convention that users can follow manually

**Problem Statement**:
When running multiple instances of a development tool (like POEM) across different projects, each instance needs a unique port. Random port allocation is unpredictable and hard to remember. Sequential allocation (9500, 9501, 9502...) creates confusion when installations are deleted.

**Solution**: Use increment-of-10 port allocation (9500, 9510, 9520...) to provide breathing room between installations and make the pattern obvious to users.

## Implementation

### Overview
POEM uses a base port of 9500 with increments of 10 for each installation. The registry tracks allocated ports, and the installer suggests the next available port following this convention.

### Code Structure
```javascript
// Port allocation constants
const BASE_PORT = 9500;
const PORT_INCREMENT = 10;
const PORT_RANGE = { min: 1024, max: 65535 };

// Suggest available ports (bin/utils.js)
export async function suggestAvailablePorts(basePort, count = 3) {
  const registry = await readRegistry();
  const allocatedPorts = new Set(
    registry.installations.map(i => i.port).filter(p => p !== null)
  );

  const suggestions = [];
  let candidatePort = basePort;

  while (suggestions.length < count && candidatePort <= PORT_RANGE.max) {
    if (!allocatedPorts.has(candidatePort)) {
      suggestions.push(candidatePort);
    }
    candidatePort += PORT_INCREMENT; // Increment by 10
  }

  return suggestions;
}

// Validate port with conflict check
export async function validatePortWithConflictCheck(port) {
  if (port < PORT_RANGE.min || port > PORT_RANGE.max) {
    return { valid: false, error: 'invalid_range' };
  }

  const registry = await readRegistry();
  const conflict = registry.installations.find(i => i.port === port);

  if (conflict) {
    return { valid: false, error: 'conflict', conflictWith: conflict };
  }

  return { valid: true };
}
```

### Step-by-Step Implementation
1. **Define base port and increment**
   - Base: 9500 (default POEM port)
   - Increment: 10 (provides spacing between installations)
   - Range: 1024-65535 (standard unprivileged port range)

2. **Read allocated ports from registry**
   - Query registry for all installations
   - Extract port numbers into a Set
   - Filter out null ports (installations without servers)

3. **Generate suggestions**
   - Start at base port (9500)
   - Check if port is allocated
   - If free, add to suggestions
   - Increment by 10 and repeat

4. **Display convention to users**
   - Show "Next suggested port: 9550 (following increment-of-10 convention)"
   - Make pattern explicit so users can choose manually

5. **Validate user input**
   - Check port is in valid range (1024-65535)
   - Check port isn't already allocated in registry
   - Show conflict details if port taken

### Key Components
- **Base Port**: 9500 (first POEM installation default)
- **Port Increment**: 10 (spacing between installations)
- **Registry Query**: Check allocated ports before suggesting
- **Validation**: Range check + conflict detection
- **User Guidance**: Explicit convention messaging in installer

### Configuration
```bash
# Documented in README.md (lines 215+)
# Port allocation follows increment-of-10 convention:
# - First installation: 9500
# - Second installation: 9510
# - Third installation: 9520
# - And so on...

# Users can override during install:
npx poem-os install
# Prompt: What port should POEM run on? (default: 9500):
# User can type any port (e.g., 9550)
```

## Examples

### Example 1: Suggest Next Available Port
Context: User installs POEM in 6th project, ports 9500-9540 allocated

```javascript
const suggestions = await suggestAvailablePorts(9500, 3);
console.log(`Next suggested port: ${suggestions[0]} (following increment-of-10 convention)`);

// Output:
// Next suggested port: 9550 (following increment-of-10 convention)
```

**Result**: User gets next port in sequence (9550), pattern is explicit

### Example 2: Handle Port Conflict
Context: User manually enters port 9520 which is already allocated

```javascript
const port = 9520;
const validation = await validatePortWithConflictCheck(port);

if (!validation.valid && validation.error === 'conflict') {
  console.error(`\n⚠️  Port ${port} is already in use.`);
  console.error(`   Used by: ${validation.conflictWith.id} (${validation.conflictWith.path})`);

  const suggestions = await suggestAvailablePorts(9500, 3);
  console.log(`\n   Suggested available ports: ${suggestions.join(', ')}`);
}

// Output:
// ⚠️  Port 9520 is already in use.
//    Used by: v-supportsignal (/Users/dev/v-supportsignal/poem)
//
//    Suggested available ports: 9550, 9560, 9570
```

**Result**: User sees conflict details and gets 3 alternative suggestions

### Example 3: Display Ecosystem with Ports (Bug #6)
Context: Installer shows all allocated ports before prompting

```javascript
// Registry display (Bug #6 fix)
if (registry.installations && registry.installations.length > 0) {
  console.log('📊 POEM Port Registry:');
  console.log('   9500  poem-dev-main      /Users/dev/poem-os/poem');
  console.log('   9510  v-storyline        /Users/dev/v-storyline/poem');
  console.log('   9520  v-supportsignal    /Users/dev/v-supportsignal/poem');
  console.log('   9530  v-appydave         /Users/dev/v-appydave/poem');
  console.log('   9540  v-voz              /Users/dev/v-voz/poem');
  console.log('');
  console.log('   Next suggested port: 9550 (following increment-of-10 convention)');
}
```

**Result**: User sees full ecosystem and understands the convention before choosing

### Common Variations
- **Variation 1: Custom base port**: Allow user to configure base port via environment variable
- **Variation 2: Different increment**: Use increment of 5 or 100 for different spacing needs

## Rationale

### Why This Approach?
Increment-of-10 provides:
1. **Predictability**: Users can guess next port (9500 → 9510 → 9520)
2. **Breathing room**: Space between ports reduces accidental conflicts
3. **Discoverability**: Pattern is obvious after seeing 2-3 installations
4. **Manual override**: Users can choose any port in the sequence

### Benefits
- ✅ Predictable port allocation (users can guess next port)
- ✅ Easy to remember (9500, 9510, 9520...)
- ✅ Reduces conflicts (spacing between ports)
- ✅ Self-documenting (pattern is obvious)
- ✅ Allows manual override (users can pick any port)

### Trade-offs
- ⚠️ "Wastes" port numbers (9501-9509 unused) - acceptable trade-off for clarity
- ⚠️ Limited to ~6,500 installations (9500-65535 in increments of 10) - sufficient for practical use

### Alternatives Considered
- **Alternative 1: Random port allocation** - Unpredictable, hard to remember
- **Alternative 2: Sequential (9500, 9501, 9502)** - Less obvious pattern, no breathing room
- **Alternative 3: Port pool (9500-9599)** - More complex, harder to document

## Related Patterns

- **[Installation Registry Pattern](./installation-registry-pattern.md)**: Registry stores allocated ports
- **[Config Service Single Source of Truth](./config-service-single-source-of-truth.md)**: Port stored in config and synced with registry

## Testing Considerations

Key test scenarios:
1. **First installation**: Suggests 9500 (base port)
2. **Second installation**: Suggests 9510 (first increment)
3. **Port conflict**: User enters allocated port, gets alternatives
4. **Gaps in allocation**: If 9510 is free but 9500 is taken, suggests 9510
5. **Range validation**: Rejects ports outside 1024-65535
6. **Multiple suggestions**: Returns 3 suggestions when requested

## References

- Story: [Story 1.7](../../stories/1.7.story.md) - Initial port configuration and validation
- Story: [Story 1.8](../../stories/1.8.story.md) - Port conflict detection in registry
- Bug: [Bug #6](../../backlog/quick-fixes.md) - Display convention to users during install
- Documentation: `README.md` (line 215+) - Port allocation convention documented
- Implementation: `bin/utils.js` (suggestAvailablePorts, validatePortWithConflictCheck)

---

**Pattern maintained by**: Lisa (Librarian)
**Last reviewed**: 2026-01-30
