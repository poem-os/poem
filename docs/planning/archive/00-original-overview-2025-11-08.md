# Prompts Application Overview

**Status**: Decided
**BMAD Ready**: Yes
**Last Updated**: 2025-11-08

## Purpose

The SupportSignal Prompts Application is a specialized system for managing AI prompts used throughout the SupportSignal ecosystem.

## Core Objectives

1. **Centralized Prompt Management**: Single source of truth for all AI prompts
2. **Version Tracking**: Git-based history with Claude skill for archiving before edits
3. **Organization**: Categorize and organize prompts logically
4. **Integration**: Claude skill pushes templates/schemas to main app via API
5. **Quality Visualization**: Astro shows templates and placeholders for easy review

## Key Features (Planned)

- Prompt library with categorization
- Git-based version history
- Claude skill for archiving prompts before editing
- Astro visualization with auto-reload
- Copy-to-clipboard for testing in ChatGPT
- Claude skill to push templates to main app API
- Documentation for each prompt

## Relationship to Main Application

This is a **companion application** to the main SupportSignal app:

- **Main App Location**: `../app.supportsignal.com.au/`
- **Prompts App Location**: `../prompt.supportsignal.com.au/` (this repo)

**Why Separate?**

Prompt management was slowing down main app development and isn't a core customer requirement. By separating it:
- Main app team focuses on customer-facing features
- Prompt engineering happens independently
- We might bring pieces back to main app later

**Integration**: The main app consumes prompt templates via API (Claude skill pushes updates).

## Technology Stack

- **Astro**: Visualization layer (read-only)
- **Text Files**: Data storage in `/data` directories
- **API Push Service**: Integration with main app and Convex
- **Claude Code**: Development environment with agents and skills

**Current Status**: Planning phase - defining structure

## Getting Started

1. Review this overview
2. Check `docs/brief.md` for architecture options
3. Review `docs/bmad-reference.md` for BMAD methodology
4. Explore `prompts/` directory for prompt library (when created)

## Next Steps

1. Define prompt organization structure
2. Create initial prompt templates
3. Build Astro visualization
4. Create Claude skill for API integration
5. Create Claude skill for archive-before-edit workflow
