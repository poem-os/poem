# Maintenance Backlog

> Lightweight tracking for chores, infrastructure, tech debt, and small fixes.
> Items here don't require full BMAD ceremony - they can be fixed between stories.

## How to Use This File

**Adding items:**
- Dev/QA agents add items discovered during story work
- Humans add items noticed during development
- Include category, brief description, and context

**Working items:**
- Pick from Pending when you have 15-60 min between stories
- Fix it, mark done with commit reference
- No story, no QA gate, no ceremony

**Promoting items:**
- If an item grows beyond 2 hours, promote to `brownfield-create-story`
- Reference the original backlog item in the story

---

## Pending

### Infrastructure

- [ ] Add GitHub Actions CI pipeline (Story 2.1 mentioned CI in architecture but not implemented)
- [ ] Configure Dependabot for dependency updates

### Tech Debt

- [ ] Fix unused `_context` param warning in `packages/poem-app/src/pages/api/health.ts`
- [ ] Production build fails - needs Astro adapter (discovered Story 2.1, deferred)
- [ ] NFR2 test flaky - server startup sometimes exceeds 3s under load (increase threshold or add retry)

### Documentation

- [ ] (none currently)

### Bugs

- [ ] (none currently)

---

## Done

### 2025-12-28

- [x] **Infrastructure**: Add gitleaks + husky pre-commit hook — Story 2.3, commit `f31c346`
- [x] **Infrastructure**: Add `.astro/` to `.gitignore` — Story 2.3, commit `f31c346`
- [x] **Documentation**: Update coding-standards.md and helpers README to ESM pattern — Story 2.3, commit `5ad286f`
- [x] **Tech Debt**: Add `.d.ts` type declarations for helpers (TypeScript strict mode) — Story 2.3, commit `5ad286f`

---

## Archive

Items completed more than 30 days ago move here to keep Done section manageable.

(none yet)
