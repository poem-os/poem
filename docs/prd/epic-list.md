# Epic List

## Epic 1: Foundation & Monorepo Setup

Establish project infrastructure with monorepo structure, NPX installer, and basic `.poem-core/` + `.poem-app/` scaffolding that copies to user projects.

## Epic 2: Astro Runtime & Handlebars Engine

Build the `.poem-app/` Astro server with Handlebars template engine, basic helpers, hot-reload support, and core API endpoints for template rendering.

## Epic 3: Prompt Engineer Agent & Core Workflows

Create the first agent (Prompt Engineer) with workflows for new prompt creation, refinement, testing, and validation—enabling the primary user journey.

## Epic 4: YouTube Automation Workflow (System Validation)

Validate POEM's core capabilities through the YouTube Launch Optimizer workflow—a real multi-prompt pipeline that transforms video transcripts into complete launch assets (titles, descriptions, chapters, thumbnails, tags, social posts). This epic tests schema extraction, template chaining, mock data generation, Handlebars helpers, progressive data accumulation, and human-in-the-loop patterns using 53 production templates across 11 workflow sections. Mock data generation is one capability among many being validated.

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
