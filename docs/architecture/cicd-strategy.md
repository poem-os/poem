# CI/CD Strategy

POEM uses a **manual-first, automate-incrementally** approach to CI/CD. Manual workflows establish the validation discipline; automation replaces manual steps as the codebase matures.

## Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│  START HERE: Manual Checklist                               │
│  - Establishes discipline before automation                 │
│  - Validates the validation (are we checking the right      │
│    things?)                                                  │
│  - Zero infrastructure overhead                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  GRADUATE TO: CI/CD Automation                              │
│  - Automate what you've proven manually                     │
│  - Each phase replaces corresponding checklist section      │
│  - Just-in-time implementation (not upfront)                │
└─────────────────────────────────────────────────────────────┘
```

**Key Principle:** The manual checklist is not temporary scaffolding—it's the specification for what CI/CD will automate. Each checklist section maps to a CI/CD phase.

---

## Manual Validation Workflow

Use this checklist until corresponding CI/CD phases are implemented. Each section maps to a CI/CD phase that will eventually automate it.

### Validate (Steps 1-3) → CI Phase 1

```bash