---
# Pattern Template Metadata
domain: "installation"
topic: "registry-system"
status: "Active"
created: "2026-01-30"
story_reference: "Story 1.8"
pattern_type: "Architectural Pattern"
last_updated: "2026-01-30"
---

# Installation - Registry System Pattern

> **Pattern Name**: installation-registry-pattern
> **Type**: Architectural Pattern
> **Status**: Active
> **First Used**: Story 1.8

## Context

**When to use this pattern**:
- Managing multiple installations of a CLI tool/framework across different projects
- Preventing port conflicts between installations
- Tracking installation metadata (path, port, ID, timestamps)
- Detecting stale installations and providing cleanup suggestions

**Problem Statement**:
When users install a CLI tool (like POEM) in multiple projects, they need a centralized registry to:
1. Track all installations and their ports
2. Prevent port conflicts
3. Display installation ecosystem
4. Detect and clean up stale entries

## Implementation

### Overview
A global registry file (`~/.poem/registry.json`) stores metadata about all POEM installations across the system. Each installation writes its metadata during `npx poem-os install` and the registry is queried during port selection to prevent conflicts.

### Code Structure
```javascript
// Registry structure
{
  "installations": [
    {
      "id": "poem-dev-main",
      "path": "/Users/dev/poem-os/poem",
      "port": 9500,
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-30T14:30:00Z"
    },
    {
      "id": "v-storyline",
      "path": "/Users/dev/v-storyline/poem",
      "port": 9510,
      "createdAt": "2026-01-20T09:00:00Z",
      "updatedAt": "2026-01-29T16:00:00Z"
    }
  ]
}

// Registry operations (bin/utils.js)
export async function readRegistry() {
  const registryPath = path.join(os.homedir(), '.poem', 'registry.json');
  // Read and parse registry
}

export async function writeRegistry(registry) {
  // Write registry with atomic file operations
}

export async function addInstallation(installation) {
  const registry = await readRegistry();
  registry.installations.push(installation);
  await writeRegistry(registry);
}
```

### Step-by-Step Implementation
1. **Create registry location**
   - Use home directory: `~/.poem/registry.json`
   - Create directory if missing
   - Initialize with empty installations array

2. **Generate installation ID**
   - Derive from project path or prompt user
   - Ensure uniqueness within registry
   - Use kebab-case format (e.g., `v-storyline`, `poem-dev-main`)

3. **Write installation metadata**
   - Capture: id, path, port, timestamps
   - Add to registry.installations array
   - Write atomically to prevent corruption

4. **Query registry for conflicts**
   - Check if port already allocated
   - Check if installation path already exists
   - Return conflict details for user feedback

5. **Detect stale entries**
   - Check if installation path still exists
   - Display stale indicator (⚠) in registry listings
   - Suggest cleanup options

### Key Components
- **Registry File**: `~/.poem/registry.json` - Global installation metadata store
- **Installation Metadata**: id, path, port, createdAt, updatedAt
- **Read/Write Operations**: Atomic file operations in `bin/utils.js`
- **Stale Detection**: Path existence check to identify removed installations
- **Display Utilities**: Format registry for terminal output with stale indicators

### Configuration
- Registry location: `~/.poem/registry.json` (hardcoded, user home directory)
- No environment variables needed
- Directory created automatically during first install

## Examples

### Example 1: Port Conflict Detection
Context: User runs `npx poem-os install` and chooses port 9500 which is already allocated

```javascript
// In bin/install.js
const port = 9500;
const validation = await validatePortWithConflictCheck(port);

if (!validation.valid && validation.error === 'conflict') {
  const { readRegistry } = await import('./utils.js');
  const registry = await readRegistry();

  console.error(`\n⚠️  Port ${port} is already in use.`);
  displayRegistryInstallations(registry.installations, console.log);

  const suggestions = await suggestAvailablePorts(9500, 3);
  console.log(`\n   Suggested available ports: ${suggestions.join(', ')}`);
}
```

**Result**: User sees which installation is using port 9500 and gets alternative port suggestions

### Example 2: Display Installation Ecosystem
Context: User runs install and registry shows all existing installations (Bug #6 fix)

```javascript
// In bin/install.js (lines 675-692)
const { readRegistry } = await import('./utils.js');
const registry = await readRegistry();

if (registry.installations && registry.installations.length > 0) {
  displayRegistryInstallations(registry.installations, log);

  const suggestions = await suggestAvailablePorts(9500, 3);
  log(`\n   Next suggested port: ${suggestions[0]} (following increment-of-10 convention)`);
}
```

**Result**: User sees full installation ecosystem before choosing port (improved UX)

### Common Variations
- **Variation 1: Multi-user systems**: Use `XDG_CONFIG_HOME` instead of `~/.poem`
- **Variation 2: Port range customization**: Allow users to configure base port and increment

## Rationale

### Why This Approach?
A global registry provides a single source of truth for all installations across the system. This prevents conflicts, improves UX, and enables ecosystem-level features (e.g., "list all installations", "clean up stale entries").

File-based approach (JSON) avoids database dependencies and works cross-platform.

### Benefits
- ✅ Prevents port conflicts automatically
- ✅ Provides ecosystem visibility (users see all installations)
- ✅ Enables stale entry detection and cleanup
- ✅ Simple file-based implementation (no DB)
- ✅ Works cross-platform (Windows, macOS, Linux)

### Trade-offs
- ⚠️ Global state can become inconsistent if installations are deleted without uninstall
- ⚠️ Requires file locking for concurrent installs (not currently implemented)
- ⚠️ No automatic cleanup of stale entries (user must manually remove)

### Alternatives Considered
- **Alternative 1: Project-local registry** - Doesn't solve cross-project port conflicts
- **Alternative 2: Database (SQLite)** - Adds dependency, overkill for simple metadata

## Related Patterns

- **[Port Allocation Strategy](./port-allocation-strategy.md)**: How ports are allocated from the registry
- **[Installation Preservation Pattern](./installation-preservation-pattern.md)**: How registry survives reinstallation
- **[Config Service Single Source of Truth](./config-service-single-source-of-truth.md)**: Registry complements project-local config

## Testing Considerations

Key test scenarios:
1. **Fresh install**: Registry created with first installation
2. **Port conflict**: Installing when port already allocated shows conflict warning
3. **Stale detection**: Deleted installation path shows ⚠ indicator
4. **Concurrent access**: Multiple installs don't corrupt registry (requires file locking)
5. **Registry display**: Ecosystem shown during install (Bug #6 validation)

## References

- Story: [Story 1.8](../../stories/1.8.story.md) - Installation registry creation
- Story: [Story 1.11](../../stories/1.11.story.md) - Registry integration with config service
- Bug: [Bug #6](../../backlog/quick-fixes.md) - Registry display UX improvement
- Implementation: `bin/utils.js` (readRegistry, writeRegistry, addInstallation)
- Display: `bin/install.js` (displayRegistryInstallations)

---

**Pattern maintained by**: Lisa (Librarian)
**Last reviewed**: 2026-01-30
