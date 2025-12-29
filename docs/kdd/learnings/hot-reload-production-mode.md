# Hot-Reload: Development vs Production Mode Consideration

**Category:** Learnings
**Date:** 2025-12-29
**Source:** Story 2.4 PO Validation
**Status:** Open Question

## Context

When implementing hot-reload for Handlebars helpers (Story 2.4), we identified a consideration about whether hot-reload should be enabled in production builds.

## The Question

Should hot-reload (file watching) be:
1. **Always enabled** - Same behavior in dev and production
2. **Dev-only** - Disabled in production builds
3. **Configurable** - Environment variable or config option

## Considerations

### Arguments for Dev-Only

- **Performance:** File watchers consume resources (memory, file descriptors)
- **Security:** Reduces attack surface (no runtime file modification impact)
- **Stability:** Production helpers should be static and tested
- **Convention:** Vite/webpack HMR is typically dev-only

### Arguments for Always Enabled

- **Simplicity:** Single code path, easier to maintain
- **Flexibility:** Allows hot-patching in production if needed
- **Local tool:** POEM runs locally, not in hostile environments

### Arguments for Configurable

- **Best of both:** Users decide based on their use case
- **Complexity:** Adds configuration surface area

## Current Decision

**Deferred** - Story 2.4 implements hot-reload without mode distinction. This can be addressed in a future story if performance concerns arise.

## Recommended Future Implementation

If we decide to make it dev-only:

```typescript
// In watcher.ts
export class HelperWatcher {
  async start(): Promise<void> {
    // Skip in production mode
    if (import.meta.env.PROD) {
      console.log('[HotReload] Disabled in production mode');
      return;
    }

    // ... start watcher
  }
}
```

Or via Astro config:

```typescript
// astro.config.mjs
export default defineConfig({
  vite: {
    define: {
      'import.meta.env.ENABLE_HOT_RELOAD': JSON.stringify(
        process.env.NODE_ENV !== 'production'
      )
    }
  }
});
```

## Related

- Story 2.4: Implement Hot-Reload for Helpers
- `packages/poem-app/src/services/handlebars/watcher.ts`

---

**Tags:** hot-reload, production, performance, configuration
