# POEM Examples Index

This directory contains working implementation examples demonstrating POEM patterns and features.

## Purpose

Examples provide:
- Complete, runnable code demonstrating patterns
- Integration examples showing components working together
- Reference implementations for common use cases
- Test fixtures and sample data
- Step-by-step setup instructions

## Format

Each example is a subdirectory containing:
- **README.md**: Overview, purpose, setup instructions
- **Usage instructions**: How to run/test the example
- **Key files**: Annotated source code
- **Dependencies**: Required packages or configuration
- **Pattern links**: Cross-references to related patterns in `docs/kdd/patterns/`

## Organization

Examples organized by feature area:
```
examples/
├── schema-validation/          # Schema extraction and validation examples
├── workflow-execution/         # Workflow orchestration examples
├── agent-activation/           # Agent conversation examples
├── multi-workflow/             # Workflow-scoped resource management
└── index.md                    # This file
```

## Current Examples

### Epic 3 Examples (Prompt Engineering Agent Foundation)

Complete, runnable examples demonstrating patterns established in Epic 3.

1. **[Unified Schema Creation](unified-schema-creation/)** (Story 3.7.1)
   - Create prompts with unified schemas (input + output in single file)
   - Function signature metaphor: `(input) -> output`
   - Extract, validate input/output, render, validate AI response

2. **[Multi-Workflow Setup](multi-workflow-setup/)** (Story 3.8)
   - Configure multiple independent workflows (YouTube, NanoBanana, SupportSignal)
   - Hot-switch between workflows without restart
   - Test workflow isolation and persistence

3. **[Skill Creation Pattern](skill-creation-pattern/)** (Story 3.6)
   - Create new skill using 8-section markdown format
   - Self-describing "When to Use" for autonomous activation
   - API-first integration, structure testing, execution testing

4. **[Workflow Validation End-to-End](workflow-validation-end-to-end/)** (Story 3.5)
   - Complete validation workflow: syntax → schema → semantic → integration
   - Skill composition: check-my-prompt, find-fields, preview-with-data
   - API-driven validation pipeline

---

**Last Updated**: 2026-01-16
**Maintainer**: Dev Agent (updates during KDD task execution)
