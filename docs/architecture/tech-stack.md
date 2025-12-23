# Tech Stack

This is the **definitive technology selection** for POEM. Note that POEM is a hybrid system, so categories are adapted accordingly.

## Technology Stack Table

> **Last updated:** 2025-12-23

| Category                 | Technology        | Version  | Purpose                                       | Rationale                                                       |
| ------------------------ | ----------------- | -------- | --------------------------------------------- | --------------------------------------------------------------- |
| **Framework Documents**  |
| Agent Definitions        | Markdown + YAML   | -        | Define AI agent personas, commands, behaviors | BMAD v4 pattern; readable, maintainable                         |
| Workflows                | YAML              | -        | Define multi-step guided processes            | Declarative, template-driven per BMAD                           |
| Skills                   | Markdown          | -        | Define autonomous capabilities                | Self-describing, context-aware                                  |
| Prompt Templates         | Handlebars (.hbs) | 4.7.x    | User prompt files with placeholders           | Industry standard templating; helpers, conditionals, loops      |
| Schemas                  | JSON              | -        | Define data structures for prompts            | Simple, universal, tool-friendly                                |
| **Runtime Server**       |
| Server Framework         | Astro             | 5.x      | API endpoints, file-based routing             | Fast startup, TypeScript native, minimal overhead               |
| Runtime Language         | TypeScript        | 5.9.x    | Type-safe server code                         | Type safety, IDE support, modern JS features                    |
| Node.js                  | Node.js           | 22.x LTS | Server runtime                                | Cross-platform, Active LTS (until Oct 2027)                     |
| **Template Engine**      |
| Templating               | Handlebars.js     | 4.7.x    | Compile and render .hbs templates             | Mature, extensible helpers, logic-less by default               |
| **Mock Data**            |
| Fake Data                | @faker-js/faker   | 10.x     | Generate realistic test data                  | Comprehensive data types, TypeScript support, requires Node 20+ |
| **Styling (Minimal)**    |
| CSS Framework            | Tailwind CSS      | 4.x      | Future visualization pages                    | CSS-first config, 5x faster builds, utility-first               |
| **Testing**              |
| Unit/Integration         | Vitest            | 4.x      | Test Astro APIs, Handlebars service           | Fast, Vite-native, stable browser mode                          |
| Manual Testing           | Claude Code       | -        | Test agent workflows, skills                  | Conversation-based validation                                   |
| **Build & Distribution** |
| Package Manager          | npm               | 10.x     | Dependency management, workspaces             | Native workspaces, no extra tooling                             |
| Distribution             | npx               | -        | `npx poem-os install`                         | Zero-install execution                                          |
| Bundler                  | Vite              | 7.x      | Astro's built-in bundler                      | Fast builds, HMR, ESM-only                                      |
| **Development**          |
| Linting                  | ESLint            | 9.x      | Code quality                                  | Flat config default, modern API                                 |
| Formatting               | Prettier          | 3.7.x    | Code formatting                               | Consistent style, Handlebars support                            |
| **Not Used**             |
| Database                 | None              | -        | File-based storage only                       | Simplicity, privacy, offline operation                          |
| Authentication           | None              | -        | Local tool, no auth needed                    | Single-user developer tool                                      |
| CI/CD                    | Phased            | -        | Manual-first, automate incrementally          | See CI/CD Strategy section                                      |
| E2E Testing              | None              | -        | Not a deployed web app                        | Manual testing via Claude Code                                  |

## Key Technology Decisions

**Why Astro over Express/Fastify?**

- File-based API routing (`src/pages/api/*.ts`) matches POEM's file-centric philosophy
- Built-in TypeScript support without configuration
- Vite-powered with fast startup (< 3 seconds per NFR2)
- Future option for visualization pages if needed

**Why Handlebars over other templating?**

- Logic-less by default encourages clean prompts
- Custom helpers enable domain-specific formatting
- Mature ecosystem with predictable behavior
- Already specified in PRD requirements

**Why Vitest over Jest?**

- Native Vite integration (Astro uses Vite)
- Faster execution, modern API
- Compatible with existing Jest patterns
- Vitest 4.x includes stable browser mode and visual regression testing

---
