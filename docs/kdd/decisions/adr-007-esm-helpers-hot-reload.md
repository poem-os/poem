# ADR-007: ESM Helpers with Hot-Reload via Chokidar

**Date**: 2026-01-13
**Status**: Accepted
**Source**: Story 4.4 (Implement Required Handlebars Helpers)

## Context

POEM needs custom Handlebars helpers for template formatting (truncate strings, format timestamps, join arrays, etc.). Requirements:
- Auto-discovery (adding new helper shouldn't require modifying registration code)
- Hot-reload (edit helper, see changes without server restart)
- Type-safe (TypeScript support for IDE autocomplete)
- API-accessible metadata (agents need to query available helpers)

**Key constraint**: POEM uses Vite + Astro, which is ESM-first (no CommonJS).

**Alternatives evaluated**:
1. **ESM with import.meta.glob + chokidar** (Chosen)
2. **CommonJS with require.context**
3. **Manual registration**
4. **Plugin system with dynamic imports**

## Decision

Implement helpers as **ESM modules** with:
- **Auto-loading**: `import.meta.glob('./helpers/*.js', { eager: true })`
- **Hot-reload**: `chokidar.watch('./helpers/*.js')` for file changes
- **Metadata exports**: `helper.description` and `helper.example` properties
- **TypeScript declarations**: `.d.ts` files for type safety

**Module structure**:
```javascript
// packages/poem-app/src/services/handlebars/helpers/truncate.js
function truncate(str, length) {
  // ...implementation
}

truncate.description = "Truncates string to specified length";
truncate.example = '{{truncate title 50}} → "First 50..."';

export default truncate;  // ESM export
```

## Alternatives Considered

### Option 1: ESM + Chokidar (Chosen)

**Pros**:
- Vite-native (import.meta.glob is first-class Vite API)
- Type-safe (TypeScript support via .d.ts)
- Hot-reload support (chokidar detects file changes)
- Tree-shakable (unused helpers eliminated in production)
- Cache-busting for hot-reload (`import(url?t=timestamp)`)

**Cons**:
- ESM-only (no CommonJS support)
- Requires chokidar dependency (3.6MB)
- Hot-reload only in dev mode (adds complexity)

**Why chosen**: Vite compatibility critical. Chokidar cost acceptable for DX improvement.

### Option 2: CommonJS with require.context

**Pros**:
- Webpack-style pattern (familiar to developers)
- Simple registration

**Cons**:
- **Incompatible with Vite** (Vite doesn't support require.context)
- No ESM support (can't use import.meta.glob)
- No hot-reload without additional tooling

**Rejected**: Vite incompatibility is dealbreaker.

### Option 3: Manual Registration

**Pros**:
- Simple implementation
- No dependencies
- Full control

**Cons**:
- Adding helper requires modifying registration file
- No auto-discovery
- Brittle (easy to forget to register new helpers)
- No hot-reload

**Rejected**: Violates DRY (Don't Repeat Yourself). New helpers should just be created, not registered.

### Option 4: Plugin System with Dynamic Imports

**Pros**:
- Most flexible (plugins can provide multiple helpers)
- Versioned plugins (semantic versioning)

**Cons**:
- Over-engineered for POEM's needs (4 helpers don't justify plugin system)
- Complex implementation (plugin API, versioning, compatibility)
- No clear benefit over simpler approaches

**Rejected**: YAGNI (You Aren't Gonna Need It). Simple auto-loading sufficient.

## Rationale

**Why ESM?**

1. **Vite Requirement**: `import.meta.glob` only works with ESM modules
2. **Tree-Shaking**: Unused helpers can be eliminated in production builds
3. **Dynamic Imports**: Cache-busting for hot-reload (`import(url?t=timestamp)`)
4. **Future-Proof**: ESM is the future of JavaScript module system

**Why Chokidar?**

1. **Cross-Platform**: Works on Windows, macOS, Linux
2. **Efficient**: Uses native fsevents on macOS (low overhead)
3. **Battle-Tested**: Used by Vite, Webpack, Parcel (proven reliability)
4. **Granular Events**: Distinguishes add, change, unlink events

**Why Metadata Exports?**

1. **API Discoverability**: `GET /api/helpers` lists all helpers with descriptions
2. **Agent Documentation**: LLM agents query available helpers and usage
3. **Self-Documenting**: No separate documentation file to maintain

**Development Experience**:
- Edit `truncate.js` → Chokidar detects change → Helper reloaded → Logs "Helper changed: truncate" → Templates instantly use new logic
- Zero server restarts during helper development

## Consequences

**Positive**:
- ✅ 146/146 helper tests passing (100%)
- ✅ Hot-reload validated with 18 watcher tests
- ✅ 4 helpers implemented (gt, truncate, join, formatTimestamp)
- ✅ TypeScript autocomplete in templates
- ✅ Helpers accessible via `/api/helpers` endpoint

**Negative**:
- ⚠️ ESM-only (no CommonJS) - acceptable given Vite's ESM-first philosophy
- ⚠️ Chokidar adds 3.6MB dependency - acceptable for dev-only feature

**Mitigations**:
- Hot-reload only enabled in development mode (`POEM_DEV=true`)
- Chokidar is dev dependency (not shipped to production)

## Gap Analysis Impact ⭐

- **VibeDeck Relevance**: Not yet applicable (VibeDeck doesn't use custom helpers)
- **Real-World Validation**: Untested in production workflows
- **Future Implications**: VibeDeck may need model-research-specific helpers (e.g., `{{compareModels flux dall-e}}`, `{{formatDimensions width height depth}}`)

## Evolution from Epic 3 ⭐

- **Related Epic 3 ADR**: None (helpers existed but no documented pattern)
- **Pattern Change**: Formalized ESM exports + metadata + hot-reload (was implicit)
- **Breaking Change**: No (helpers always worked, now documented + enhanced)

## References

- **Story**: `docs/stories/4.4.story.md` (Implement Required Handlebars Helpers)
- **Implementation**:
  - Loader: `packages/poem-app/src/services/handlebars/loader.ts`
  - Watcher: `packages/poem-app/src/services/handlebars/watcher.ts`
  - Helpers: `packages/poem-app/src/services/handlebars/helpers/*.js`
- **Tests**: 146/146 passing (unit tests + watcher tests)
- **QA Gate**: Quality Score 100/100
- **Dependencies**: `chokidar@^4.0.3`
- **Pattern**: [Handlebars Helper Module Pattern](../patterns/4-handlebars-helper-module-pattern.md)

---

**Last Updated**: 2026-01-19
