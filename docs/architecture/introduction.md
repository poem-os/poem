# Introduction

This document outlines the complete architecture for **POEM** (Prompt Orchestration and Engineering Method), a Prompt Engineering Operating System designed to run on Claude Code.

**POEM is NOT a traditional fullstack application.** It is a **hybrid system**:
- **95% Document-Based Framework**: Agents (YAML + Markdown), workflows (YAML), templates (Handlebars), schemas (JSON), skills (Markdown) — similar to BMAD
- **5% Runtime Tool**: `.poem-app/` Astro server providing Handlebars engine, API endpoints, and provider integrations

This unified architecture document covers both the document framework and the runtime infrastructure, serving as the single source of truth for AI-driven development.

## Starter Template or Existing Project

**N/A - Greenfield project** with specific structural influences:

- **BMAD v4.44.3**: POEM follows BMAD's proven framework architecture pattern (`.bmad-core/` → `.poem-core/`)
- **Astro**: Latest version selected for runtime server due to file-based routing, TypeScript support, and minimal overhead
- **No existing codebase**: This is a new framework being built from scratch

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-12-08 | 0.1 | Initial architecture draft | Winston (Architect Agent) |

---
