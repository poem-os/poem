# POEM Architecture Overview

A visual summary of POEM's three-layer architecture.

---

## Three Installation Targets

| Target | Location | Purpose |
|--------|----------|---------|
| **poem-core** | `.poem-core/` | Framework - Agents, Workflows, Skills (markdown/YAML) |
| **poem-app** | `.poem-app/` | Runtime - Astro server, APIs, services |
| **poem** | `/poem/` | User workspace - prompts, schemas, mappings |

---

## Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    .poem-core/ (Framework)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Agents    │→ │  Workflows  │→ │   Skills    │         │
│  │ (4 agents)  │  │ (6 flows)   │  │ (8 skills)  │         │
│  └─────────────┘  └─────────────┘  └──────┬──────┘         │
└────────────────────────────────────────────│────────────────┘
                                             │ HTTP calls
                                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    .poem-app/ (Runtime)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Astro Server│→ │ Handlebars  │  │  Providers  │         │
│  │ (REST APIs) │  │  Service    │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────────────────────────────────────────│────────────────┘
                                             │ File access
                                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    /poem/ (User Workspace)                  │
│  prompts/  schemas/  mappings/  mock-data/  config/        │
└─────────────────────────────────────────────────────────────┘
```

---

## The Four Agents

| Agent | Primary Commands | Purpose |
|-------|------------------|---------|
| **Prompt Engineer** | `*new`, `*refine`, `*test`, `*validate` | Create and improve prompts |
| **System Agent** | `*add-helper`, `*server-status`, `*create-provider` | Infrastructure and helpers |
| **Integration Agent** | `*connect`, `*pull-dictionary`, `*publish` | External system connections |
| **Mock Data Agent** | `*generate-mock`, `*create-scenario`, `*curate-library` | Test data generation |

---

## Key Workflows

| Workflow | Steps |
|----------|-------|
| **New Prompt** | Gather purpose → Create template → Generate schema → Preview |
| **Refine Prompt** | Load → Test → Identify issues → Update → Repeat |
| **Test Prompt** | Select data source → Render → Report |
| **Validate Prompt** | Check syntax → Validate schema → Check helpers → Report |
| **Deploy Prompt** | Validate → Test connection → Publish → Confirm |
| **Add Helper** | Describe need → Generate code → Register → Test |

---

## Skills (Autonomous Capabilities)

| Skill | Purpose |
|-------|---------|
| Check My Prompt | Validate prompt structure |
| Preview with Data | Render with mock/example data |
| Generate Schema | Extract schema from template |
| Find Fields | Search data dictionaries |
| Validate Schema | Check against dictionary |
| Suggest Mappings | Recommend field mappings |
| Pull Dictionary | Import from provider |
| Publish Prompt | Deploy to production |

---

**Created**: 2025-12-08
**Source**: POEM PRD Architecture Section
