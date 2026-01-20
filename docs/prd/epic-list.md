# Epic List

## Epic 0: Maintenance & Continuous Improvement

**Status**: 🔄 Perpetual (Never Completes)

Ongoing maintenance, bug fixes, technical debt, developer experience improvements, performance optimizations, security patches, infrastructure updates, and documentation refinements that emerge during and after feature development.

**Purpose**: Epic 0 provides a structured home for all non-feature work that keeps POEM healthy, performant, and maintainable. Unlike feature epics (1-7) which have defined completion criteria, Epic 0 is perpetual—it absorbs maintenance work throughout the project lifecycle and continues indefinitely as long as POEM is actively maintained.

**Categories**:
- **Technical Debt**: Refactoring, code quality improvements, architectural cleanup
- **Bug Fix**: Production bugs, edge cases, error handling improvements
- **Developer Experience**: Build tooling, testing infrastructure, local development workflow
- **Performance**: Optimization of template rendering, server startup, API response times
- **Security**: Vulnerability patches, dependency updates, security audits
- **Infrastructure**: CI/CD improvements, deployment automation, monitoring
- **Documentation**: README updates, inline comments, troubleshooting guides

**Sprint Allocation**: 10-20% of each sprint reserved for Epic 0 work (e.g., 1-2 stories per 2-week sprint alongside 5-8 feature stories)

**Priority System**:
- **P0 (Critical)**: Production blockers, security vulnerabilities, data loss risks—must be addressed immediately
- **P1 (High)**: Significant bugs affecting core workflows, major performance issues, critical technical debt—should be addressed within 1-2 sprints
- **P2 (Medium)**: Minor bugs, small optimizations, low-impact technical debt—can be scheduled opportunistically

**Key Principles**:
- Epic 0 stories use lighter ceremony than feature stories (shorter descriptions, focused acceptance criteria)
- Each story clearly identifies category (e.g., "Bug Fix: Template rendering fails for empty arrays")
- Priority assigned based on impact and urgency, not arbitrary scheduling
- Epic 0 work is planned alongside feature work, not as an afterthought
- Team reviews Epic 0 backlog weekly to assess priorities and allocate capacity

---

## Epic 1: Foundation & Monorepo Setup

Establish project infrastructure with monorepo structure, NPX installer, and basic `.poem-core/` + `.poem-app/` scaffolding that copies to user projects.

## Epic 2: Astro Runtime & Handlebars Engine

Build the `.poem-app/` Astro server with Handlebars template engine, basic helpers, hot-reload support, and core API endpoints for template rendering.

## Epic 3: Prompt Engineer Agent & Core Workflows

Create the first agent (Prompt Engineer) with workflows for new prompt creation, refinement, testing, and validation—enabling the primary user journey. **Includes multi-workflow foundation (Story 3.8)** to support multiple independent workflows within one workspace.

## Epic 4: YouTube Automation Workflow (System Validation)

Validate POEM's core capabilities through the YouTube Launch Optimizer workflow—a real multi-prompt pipeline that transforms video transcripts into complete launch assets (titles, descriptions, chapters, thumbnails, tags, social posts). This epic tests schema extraction, template chaining, mock data generation, Handlebars helpers, progressive data accumulation, and human-in-the-loop patterns using 53 production templates across 11 workflow sections. **Benefits from multi-workflow support** to test multiple workflows (YouTube Launch vs Video Planning vs NanoBanana) in parallel. **Includes multi-workflow polish (Story 4.9)** to finalize reference integration based on B72 learnings.

## Epic 5: System Agent & Helper Generation

Build the System Agent with workflows for creating custom Handlebars helpers on-demand, managing Astro infrastructure, and establishing the provider pattern foundation.

## Epic 6: Integration Agent & Provider Pattern

Create the Integration Agent with abstract provider contract, workflows for pulling data dictionaries and publishing prompts to external systems.

## Epic 7: Mock/Test Data Agent & Level 2 Mock Data

Build the fourth agent with workflows for realistic mock data generation based on provider data dictionaries, entity relationships, and domain-specific scenarios.

---

## Epic 8: BMAD Integration - Capability Validation Pattern (Future)

**Status**: 📋 Requirements Complete, Awaiting BMAD v5.0 Integration

Extract the Workflow Validator (Victor) pattern from POEM and generalize it for BMAD core as a reusable "Capability Validation Pattern" for framework/tooling/DSL projects. This pattern enables product-level QA that validates capabilities across stories, tests against reference workflows, tracks cumulative progress, and generates strategic feedback.

**Requirements Document**: `dev-workspace/GENERALIZED-CAPABILITY-VALIDATION-REQUIREMENTS.md`

**Why**: Traditional BMAD validates stories in isolation. For framework/tooling projects that build cumulative capabilities, we need product-level validation that maintains context across stories and ensures trajectory toward automation goals.

**Key Deliverables**:
- `capability-validator` agent for BMAD core
- Reference workflow definition format
- Snapshot management and regression detection
- Integration matrix tracking
- Strategic feedback loop

**Target BMAD Version**: v5.0.0 (Q2 2026)

**Dependencies**: Complete POEM Epic 3-4 validation to prove pattern effectiveness

**Note**: POEM-specific implementation (Victor agent) complete and functional. See `dev-workspace/WORKFLOW-VALIDATION-GUIDE.md` for usage.

---

## Epic 9: Multi-Workflow Support (Future)

**Status**: 📋 Requirements Complete, Foundation Ready for Drafting
**Target**: POEM v1.1 - v2.0 (Q2-Q3 2026)

**Foundation**: Stories 3.8 (Phase 1) and 4.9 (Phase 2) will deliver production-ready multi-workflow prototype validated through Epic 4.

**What Epic 9 Adds**: Advanced features beyond Phase 1+2 prototype:
- Visual workflow editor and designer
- Auto-sync reference materials from git repositories
- Cross-workflow analytics and insights
- Workflow templates and marketplace
- Advanced validation (step I/O compatibility checking)
- Workflow execution orchestration
- CI/CD integration for workflow testing

**Dependencies**: Prototype validation through Epic 3-4, community feedback on Phase 1+2 usage patterns

**Tracking**: `docs/future-enhancements.md` (Enhancement #11)

**Course Correction**: `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`

---
