# Handlebars Helper Module Pattern

**Pattern**: Handlebars helpers as ESM modules with self-describing metadata, auto-loaded via Vite's import.meta.glob, with hot-reload support for development.

**Source Stories**: Story 4.4 (Implement Required Handlebars Helpers)

## Context

When to use this pattern:

- Adding custom formatting logic to Handlebars templates
- Need helpers to be auto-discovered and registered without manual imports
- Want hot-reload during development (add/modify helpers without server restart)
- Need API-accessible helper documentation for agent-driven development
- Building domain-specific template operations (YouTube formatting, timestamp conversion, etc.)

**Problem**: Traditional Handlebars helper registration requires manual imports and registration in a central file. Adding new helpers requires modifying registration code. No way to discover available helpers or their usage without reading source code.

**Solution**: Helpers as ESM modules with metadata exports, auto-loaded via Vite glob imports, with chokidar watching for changes.

## Implementation

### Helper Module Structure

```javascript
// packages/poem-app/src/services/handlebars/helpers/truncate.js

/**
 * Truncates a string to specified length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 * @example {{truncate title 50}} → "First 50 characters..."
 */
function truncate(str, length) {
  // Type checking (defensive programming)
  if (typeof str !== 'string') return '';
  if (str.length <= length) return str;

  // Smart truncation logic
  if (length < 4) return str.slice(0, length);
  return str.slice(0, length - 3) + '...';
}

// Metadata exports for API listing
truncate.description = "Truncates a string to specified length with ellipsis";
truncate.example = '{{truncate title 50}} → "First 50 characters..."';

// ESM export (required for Vite)
export default truncate;
```

### TypeScript Declaration

```typescript
// packages/poem-app/src/services/handlebars/helpers/truncate.d.ts

/**
 * Truncates a string to specified length with ellipsis
 */
declare function truncate(str: string, length: number): string;

/** Helper description for API listing */
export const description: string;

/** Usage example for documentation */
export const example: string;

export default truncate;
```

### Auto-Loading Mechanism

```typescript
// packages/poem-app/src/services/handlebars/loader.ts

import Handlebars from 'handlebars';

/**
 * Auto-load all helpers using Vite's import.meta.glob
 * Eager loading: All helpers loaded at build time
 */
const helperModules = import.meta.glob('./helpers/*.js', { eager: true });

export function registerHelpers(handlebars: typeof Handlebars): Map<string, HelperMetadata> {
  const helpers = new Map();

  for (const [path, module] of Object.entries(helperModules)) {
    // Extract helper name from file path
    const match = path.match(/\.\/helpers\/(.+)\.js$/);
    if (!match) continue;

    const helperName = match[1];

    // Skip utility files (prefixed with underscore)
    if (helperName.startsWith('_')) continue;

    // Get helper function (default export)
    const helperFn = module.default;
    if (typeof helperFn !== 'function') continue;

    // Register with Handlebars
    handlebars.registerHelper(helperName, helperFn);

    // Extract metadata
    helpers.set(helperName, {
      name: helperName,
      description: helperFn.description || `${helperName} helper`,
      example: helperFn.example || `{{${helperName} ...}}`
    });
  }

  return helpers;
}
```

### Hot-Reload with Chokidar

```typescript
// packages/poem-app/src/services/handlebars/watcher.ts

import chokidar from 'chokidar';
import path from 'path';

export function watchHelpers(handlebars: typeof Handlebars, callback?: () => void) {
  const helpersDir = path.resolve('./src/services/handlebars/helpers');

  const watcher = chokidar.watch(`${helpersDir}/*.js`, {
    persistent: true,
    ignoreInitial: true
  });

  watcher
    .on('add', async (filePath) => {
      console.log(`[Hot Reload] Helper added: ${path.basename(filePath)}`);
      await reloadHelper(handlebars, filePath);
      callback?.();
    })
    .on('change', async (filePath) => {
      console.log(`[Hot Reload] Helper changed: ${path.basename(filePath)}`);
      await reloadHelper(handlebars, filePath);
      callback?.();
    })
    .on('unlink', (filePath) => {
      const helperName = path.basename(filePath, '.js');
      handlebars.unregisterHelper(helperName);
      console.log(`[Hot Reload] Helper removed: ${helperName}`);
      callback?.();
    });

  return watcher;
}

async function reloadHelper(handlebars: typeof Handlebars, filePath: string) {
  const helperName = path.basename(filePath, '.js');

  try {
    // Cache-busting import (timestamp query param)
    const timestamp = Date.now();
    const module = await import(`${filePath}?t=${timestamp}`);

    const helperFn = module.default;
    if (typeof helperFn === 'function') {
      handlebars.registerHelper(helperName, helperFn);
    }
  } catch (error) {
    console.error(`[Hot Reload] Failed to reload ${helperName}:`, error.message);
    // Graceful degradation: Log error but don't crash server
  }
}
```

## Example

### Creating a New Helper

```bash
# 1. Create helper file
touch packages/poem-app/src/services/handlebars/helpers/formatTimestamp.js
```

```javascript
// packages/poem-app/src/services/handlebars/helpers/formatTimestamp.js

/**
 * Converts seconds to MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted timestamp
 * @example {{formatTimestamp 125}} → "02:05"
 */
function formatTimestamp(seconds) {
  // Type checking and edge cases
  if (typeof seconds !== 'number' || seconds < 0 || isNaN(seconds)) {
    return '00:00';
  }

  // Convert to MM:SS
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Pad with zeros
  const mm = String(minutes).padStart(2, '0');
  const ss = String(remainingSeconds).padStart(2, '0');

  return `${mm}:${ss}`;
}

// Metadata
formatTimestamp.description = "Converts seconds to MM:SS timestamp format";
formatTimestamp.example = '{{formatTimestamp 125}} → "02:05"';

export default formatTimestamp;
```

```typescript
// packages/poem-app/src/services/handlebars/helpers/formatTimestamp.d.ts
declare function formatTimestamp(seconds: number): string;
export const description: string;
export const example: string;
export default formatTimestamp;
```

**Result**: Helper immediately available in templates. Hot-reload detects new file, registers helper, logs to console.

### Using Helper in Template

```handlebars
<!-- YouTube chapter template -->
{{#each chapters}}
  {{formatTimestamp timestamp}} {{title}}
{{/each}}
```

**Output**:
```
00:00 Introduction
02:15 Main Topic
05:30 Deep Dive
10:45 Conclusion
```

## Rationale

**Why ESM Modules?**

1. **Vite Compatibility**: `import.meta.glob` requires ESM (not CommonJS)
2. **Dynamic Imports**: Cache-busting for hot-reload (`import(url?t=timestamp)`)
3. **Tree-Shaking**: Unused helpers can be eliminated in production builds
4. **Type Safety**: `.d.ts` files provide IDE autocomplete and type checking

**Why Metadata Exports?**

1. **API Discoverability**: `GET /api/helpers` lists all helpers with descriptions
2. **Agent Documentation**: LLM agents can query available helpers and their usage
3. **Testing**: Test framework can validate metadata exists on all helpers
4. **Self-Documenting**: No separate documentation file to maintain

**Why Hot-Reload?**

1. **Developer Experience**: Edit helper, see changes instantly (no server restart)
2. **Rapid Iteration**: Test complex helpers without losing state
3. **Production-Safe**: Only enabled in development mode (POEM_DEV=true)

**Trade-offs**:
- ESM-only (no CommonJS support) - acceptable given Vite's ESM-first philosophy
- Hot-reload adds chokidar dependency - acceptable for DX improvement

## Architecture Alignment ⭐

- **Designed in**: Helpers existed in Epic 3, but hot-reload and metadata patterns not documented in architecture
- **Implementation Status**: ✅ **Aligned** - Follows Astro + Vite tech stack from architecture
- **Deviation Rationale**: N/A - Pattern consistent with Vite's module system

**Validation**: 146/146 helper tests passing (100%). Hot-reload system validated with 18 tests for watcher.

## Evolution from Epic 3 ⭐

- **Relationship**: **Refinement** - Epic 3 had helpers, Epic 4 formalized pattern
- **Epic 3 Pattern**: Helpers existed (titleCase, upperCase, lowerCase, dateFormat, default, json) but no documented pattern
- **Changes**:
  - **Added**: ESM export requirement (was: no specific export format)
  - **Added**: Metadata exports (description, example) for API listing
  - **Added**: Hot-reload with chokidar (was: server restart required)
  - **Added**: TypeScript declarations for IDE support
  - **Formalized**: Auto-loading via `import.meta.glob` (was: implicit)

**Key Innovation**: Helpers became **API-accessible, self-documenting, hot-reloadable** modules instead of simple functions.

## Real-World Validation ⭐

- **VibeDeck Status**: **Untested** - VibeDeck doesn't use custom helpers yet (uses standard Handlebars only)
- **Gap Analysis Reference**: Not mentioned in `vibedeck-observations.jsonl`
- **Edge Cases Discovered**:
  - **Invalid helper syntax**: If helper file has syntax error, hot-reload logs error but doesn't crash server (graceful degradation)
  - **Helper metadata missing**: Tests warn if helper lacks description/example but helper still functions
  - **Truncate edge case**: `length < 4` special handling (can't add "..." if no room) - demonstrates thoughtful edge case design

**Production Readiness**: Pattern validated with 4 helpers (gt, truncate, join, formatTimestamp) in 43 comprehensive tests. Quality score: 100/100 (QA gate). All 53 YouTube templates render successfully with helpers.

## Related Patterns

- **[API-First Heavy Operations](api-first-heavy-operations.md)** (Epic 3) - Helpers tested via `/api/helpers/test` endpoint
- **[Schema-Based Mock Data Generation](4-schema-based-mock-data-generation.md)** (Epic 4) - Uses helpers in generated templates
- **[Workflow Chain Execution](4-workflow-chain-execution.md)** (Epic 4) - Chains execute templates that use helpers

## Anti-Patterns

```javascript
// ❌ ANTI-PATTERN: CommonJS export
module.exports = function truncate(str, length) { ... };
// WRONG: Vite requires ESM, import.meta.glob won't find it

// ❌ ANTI-PATTERN: No metadata
export default function truncate(str, length) { ... }
// WRONG: Can't discover helper via API, no documentation

// ❌ ANTI-PATTERN: Throwing errors
function truncate(str, length) {
  if (typeof str !== 'string') {
    throw new Error('str must be string');
  }
  // ...
}
// WRONG: Crashes template rendering, breaks graceful degradation

// ❌ ANTI-PATTERN: Side effects in helper
function logAndTruncate(str, length) {
  console.log('Truncating:', str);
  return str.slice(0, length);
}
// WRONG: Helpers should be pure functions (no side effects)

// ❌ ANTI-PATTERN: Manual registration
import truncate from './helpers/truncate';
Handlebars.registerHelper('truncate', truncate);
// WRONG: Defeats auto-loading, requires modification for new helpers
```

## Implementation Checklist

When creating a new helper:

- [ ] Create `.js` file in `packages/poem-app/src/services/handlebars/helpers/`
- [ ] Use camelCase file name matching helper name (e.g., `formatTimestamp.js`)
- [ ] Export function as default: `export default helperName;`
- [ ] Add JSDoc with description, params, returns, example
- [ ] Add metadata properties: `helperName.description` and `helperName.example`
- [ ] Create `.d.ts` TypeScript declaration file
- [ ] Handle null/undefined/wrong types gracefully (return safe default, don't throw)
- [ ] Write unit tests in `tests/services/handlebars/helpers/helperName.test.ts`
- [ ] Test edge cases (null, undefined, wrong types, boundary values)
- [ ] Test metadata properties exist
- [ ] Verify helper appears in `GET /api/helpers` response
- [ ] Test hot-reload (modify file, verify reload logged to console)

## References

- **Story**: `docs/stories/4.4.story.md` (Implement Required Handlebars Helpers)
- **Implementation**:
  - Helpers: `packages/poem-app/src/services/handlebars/helpers/*.js` (gt, truncate, join, formatTimestamp)
  - Loader: `packages/poem-app/src/services/handlebars/loader.ts` (auto-loading logic)
  - Watcher: `packages/poem-app/src/services/handlebars/watcher.ts` (hot-reload system)
  - README: `packages/poem-app/src/services/handlebars/helpers/README.md` (helper documentation)
- **Tests**:
  - `packages/poem-app/tests/services/handlebars/helpers/gt.test.ts` (9 tests)
  - `packages/poem-app/tests/services/handlebars/helpers/truncate.test.ts` (11 tests)
  - `packages/poem-app/tests/services/handlebars/helpers/join.test.ts` (13 tests)
  - `packages/poem-app/tests/services/handlebars/helpers/formatTimestamp.test.ts` (10 tests)
  - `packages/poem-app/tests/services/handlebars/watcher.test.ts` (18 tests - hot-reload validation)
- **QA Gate**: `docs/qa/gates/4.4-implement-required-handlebars-helpers.yml` (Quality Score: 100/100)
- **Tech Stack**: `docs/architecture/tech-stack.md` (Handlebars.js 4.7.x, Vite 5.x)

---

**Pattern Established**: Story 4.4 (2026-01-13)
**Refines**: Implicit helper system from Epic 3
**Last Updated**: 2026-01-19
