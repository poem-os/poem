# Goals and Background Context

## Goals

- Reduce prompt iteration time by 60% for prompt engineers through systematic workflows and instant mock data generation
- Enable prompt engineers to test prompts with 10+ scenarios on average (vs 2-3 manual scenarios) without production database access
- Establish POEM as a reusable framework that runs on Claude Code, providing agent-guided workflows for creating, testing, and deploying AI prompts
- Validate the provider pattern with SupportSignal/Convex integration, demonstrating extensibility to other platforms
- Achieve first prompt deployed within 2 hours of installation for target users (prompt engineers in high-compliance teams)
- Create foundation for AppyDave's education ecosystem and Skool community around systematic prompt engineering

## Background Context

Prompt engineering today is manual, slow, and production-dependent. Engineers write prompts in isolation, manually craft test scenarios by copy-pasting from databases, and deploy without systematic validation. This creates critical bottlenecks: slow iteration cycles (waiting hours/days for data exports), limited test coverage (2-3 scenarios vs hundreds needed), production database dependency (security/compliance risks in healthcare, legal, NDIS sectors), and no systematic workflow leading to inconsistent quality across teams.

POEM (Prompt Orchestration and Engineering Method) solves this by providing a Prompt Engineering Operating System that runs on Claude Code. The system consists of three parts: `.poem-core/` (agents, workflows, knowledge base), `.poem-app/` (Astro server with Handlebars engine and provider APIs), and `/poem/` (user workspace for prompts, schemas, mappings). The killer feature is automatic mock data generation from JSON schemas—enabling testing of hundreds of edge cases instantly while maintaining data privacy and eliminating production system dependencies. POEM applies BMAD-style template-driven workflows to prompt engineering, making it as systematic and professional as software development.

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-22 | 0.1 | Initial PRD draft from Project Brief | John (PM Agent) |
| 2025-12-08 | 1.0 | Complete PRD with 7 Epics, 40 Stories, PM Checklist passed | John (PM Agent) |
