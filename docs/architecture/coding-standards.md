# Coding Standards

These are **minimal but critical** standards for AI-driven development. Focus is on project-specific rules that prevent common mistakes.

## Critical Rules

- **File-Based Everything:** All user data stored as files. Never introduce database dependencies.

- **API-First for Heavy Operations:** Template rendering, schema extraction, and mock generation MUST go through Astro APIs. Never implement these in agent/skill documents.

- **Helper Hot-Reload Safety:** New helpers must be valid JavaScript modules. Invalid syntax must not crash the server — log and skip.

- **Workspace Isolation:** API operations read from/write to `/poem/` workspace only. Never access files outside the workspace root.

- **Error Context:** All API errors must include: error type, message, and relevant context (file path, line number for parse errors).

- **No Production Data:** Mock data only. Skills and agents must never store or log actual production data from providers.

- **Graceful Degradation:** Missing template placeholders render as empty string (not error). Missing helpers log warning but render template.

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| **poem-core** |
| Agent files | kebab-case.md | `prompt-engineer.md` |
| Workflow files | kebab-case.yaml | `new-prompt.yaml` |
| Skill files | kebab-case.md | `check-my-prompt.md` |
| **poem-app** |
| API routes | kebab-case directories | `/api/prompt/render.ts` |
| Services | PascalCase classes | `HandlebarsService` |
| Helpers | camelCase files | `titleCase.js`, `formatTimestamp.js` |
| Tests | *.test.ts | `handlebars.test.ts` |
| **User Workspace** |
| Prompts | kebab-case.hbs | `generate-titles.hbs` |
| Schemas | kebab-case.json | `generate-titles.json` |
| Config | kebab-case.yaml/json | `supportsignal.yaml` |

## TypeScript Standards

```typescript
// ✅ DO: Use explicit types for API responses
interface RenderResponse {
  rendered: string;
  renderTimeMs: number;
  warnings: string[];
}

// ❌ DON'T: Use `any` for API boundaries
function handleRender(req: any): any { ... }

// ✅ DO: Use Result types for operations that can fail
type Result<T> = { success: true; data: T } | { success: false; error: string };

// ✅ DO: Export types for API contracts
export type { RenderRequest, RenderResponse } from './types';

// ❌ DON'T: Import from relative paths outside package
import { something } from '../../../poem-core/...'; // Wrong
```

## Handlebars Helper Standards

```javascript
// ✅ DO: Include JSDoc with example
/**
 * Truncates a string to specified length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 * @example {{truncate title 50}} → "First 50 characters..."
 */
module.exports = function(str, length) {
  if (typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
};

// ❌ DON'T: Throw errors that crash rendering
module.exports = function(str, length) {
  if (!str) throw new Error('str required'); // Crashes template
};

// ✅ DO: Handle edge cases gracefully
module.exports = function(str, length) {
  if (!str) return '';
  if (typeof length !== 'number') return str;
  // ...
};
```

## API Endpoint Standards

```typescript
// ✅ DO: Use consistent error response format
export async function POST({ request }: APIContext) {
  try {
    const body = await request.json();
    // ... process
    return new Response(JSON.stringify({ success: true, data }));
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: { /* context */ }
      }),
      { status: 400 }
    );
  }
}

// ✅ DO: Validate input at API boundary
const schema = z.object({
  template: z.string().min(1),
  data: z.record(z.unknown()).optional(),
  isRawTemplate: z.boolean().default(false)
});

// ❌ DON'T: Trust input blindly
const { template } = await request.json();
render(template); // No validation
```

## Agent/Workflow Document Standards

```yaml