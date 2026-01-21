# Epic Details

## Epic 1: Foundation & Monorepo Setup

**Goal**: Establish the project infrastructure with monorepo structure, NPX installer, and basic scaffolding that enables all subsequent development. Users should be able to install POEM into their projects.

---

### Story 1.1: Initialize Monorepo Structure

As a developer,
I want a monorepo structure with poem-core and poem-app packages,
so that the codebase is organized for coordinated development and releases.

**Acceptance Criteria**:

1. Root `package.json` configured for monorepo (workspaces or similar)
2. `packages/poem-core/` directory created with basic structure
3. `packages/poem-app/` directory created with basic structure
4. Shared TypeScript configuration across packages
5. Root scripts for common operations (build, test, lint)
6. `.gitignore` configured for Node.js/TypeScript project
7. README.md with project overview and development setup

---

### Story 1.2: Create poem-core Package Structure

As a developer,
I want the poem-core package structured for agents, workflows, and skills,
so that the framework components have a clear home.

**Acceptance Criteria**:

1. `packages/poem-core/` follows BMAD-style structure
2. Directory structure includes: `agents/`, `workflows/`, `skills/`, `templates/`, `data/`
3. `core-config.yaml` created with basic configuration schema
4. Placeholder agent file created: `agents/prompt-engineer.md`
5. Placeholder workflow file created: `workflows/new-prompt.yaml`
6. Placeholder skill file created: `skills/check-my-prompt.md`
7. Package exports configuration files for installation

---

### Story 1.3: Create poem-app Package Structure

As a developer,
I want the poem-app package structured as an Astro project,
so that the runtime server has proper scaffolding.

**Acceptance Criteria**:

1. `packages/poem-app/` initialized as Astro project (latest version)
2. TypeScript configured for Astro
3. Directory structure includes: `src/pages/api/`, `src/services/`, `src/config/`
4. Placeholder API endpoint: `src/pages/api/health.ts` returns status
5. Basic Astro config with configurable port
6. Package.json with start/build/dev scripts
7. Tailwind CSS configured (minimal, for future use)

---

### Story 1.4: Implement NPX Installer

As a user,
I want to install POEM via `npx poem-os install`,
so that I can add POEM to my project with a single command.

**Acceptance Criteria**:

1. `npx poem-os install` copies `.poem-core/` to user's project root
2. `npx poem-os install` copies `.poem-app/` to user's project root
3. `npx poem-os install` creates `/poem/` workspace directory with subdirs: `prompts/`, `schemas/`, `config/`
4. `npx poem-os install --core` installs only `.poem-core/`
5. `npx poem-os install --app` installs only `.poem-app/`
6. Installer detects existing installation and prompts for overwrite/merge
7. Installation completes in under 3 minutes (NFR1)
8. Success message displays next steps for user

---

### Story 1.5: Create Claude Code Slash Command Integration

As a user,
I want slash commands to activate POEM agents,
so that I can access POEM workflows from Claude Code.

**Acceptance Criteria**:

1. `.claude/commands/poem/` directory structure created during install
2. Slash command wrapper for Prompt Engineer agent: `/poem/agents/penny`
3. Slash command files follow BMAD pattern (load agent definition)
4. Commands discoverable via Claude Code's slash command system
5. Agent activation displays agent name, role, and available commands
6. Help command lists all available POEM slash commands

---

### Story 1.6: NPM Package Publishing ✅ DONE

As a developer,
I want to publish POEM to NPM as a public package,
so that users can install it globally via `npx poem-os install`.

**Acceptance Criteria**:

1. Remove `"private": true` from root `package.json`
2. Add `"bin"` field mapping `"poem-os"` command to `"bin/install.js"`
3. Add `"repository"`, `"bugs"`, and `"homepage"` URLs to package.json
4. Define `"files"` array in package.json to control published content
5. Test package installation locally using `npm link` followed by `npx poem-os install`
6. Create `publishing-guide.md` documenting the manual publishing process
7. Add GitHub Actions workflow for automated NPM publishing (optional, future enhancement)

**Status**: Completed. POEM can now be installed via `npx poem-os install`.

---

### Story 1.7: Startup Script and Port Configuration

As a user,
I want to start POEM from my project root and configure the server port,
so that I can run POEM without navigating into .poem-app/ and manage multiple POEM instances on different ports.

**Acceptance Criteria**:

1. `npx poem-os start` command launches POEM server from project root
2. Startup script validates `.poem-app/` exists and shows helpful error if not
3. During installation, users prompted for port number (default: 4321)
4. Port configuration written to `.poem-app/.env`
5. Users can override port temporarily: `npx poem-os start --port=XXXX`
6. Users can reconfigure port permanently: `npx poem-os config --port XXXX`
7. Users can view current config: `npx poem-os config --list`
8. Port validation rejects invalid values (< 1024 or > 65535)
9. Startup script is cross-platform compatible (Windows/macOS/Linux)
10. Documentation updated (README.md, publishing-guide.md)

---

### Story 1.8: Installation Registry and Port Conflict Detection

As a developer,
I want POEM installations to automatically register with port conflict detection,
so that I can avoid port conflicts across multiple POEM instances without manual tracking.

**Acceptance Criteria**:

**Core Functionality (Port Conflict Detection)**:
1. Default port changed from 4321 to 9500 across all documentation and configuration files
2. Installation process automatically registers in `~/.poem/registry.json` (creates directory if needed)
3. Port conflict detection runs automatically during `npx poem-os install` with warning and suggested alternatives (increments of 10: 9510, 9520, 9530...)
4. Port conflict detection runs automatically during `npx poem-os config --port XXXX` with warning and suggested alternatives
5. Port suggestion algorithm finds next available port in increments of 10 from 9500 (9500, 9510, 9520...)
6. Registry operations are silent and automatic (no user interaction required for normal operations)

**Registry Data Structure**:
7. Registry format stores: id, path, port, installedAt, lastChecked, version, mode, gitBranch, status, metadata

**Debug/Inspection Tools (Optional, for troubleshooting)**:
8. Debug CLI command: `npx poem-os registry --list` displays all registered installations with status
9. Debug CLI command: `npx poem-os registry --refresh` scans filesystem and updates registry
10. Debug CLI command: `npx poem-os registry --clean` removes entries for missing installations

**Documentation**:
11. Documentation updated: README.md, CLAUDE.md, docs/architecture.md, packages/poem-app/astro.config.mjs

---

### Story 1.9: Installation Preservation System

As a POEM user,
I want a preservation system that protects my user files during reinstallation,
so that I can safely run `npx poem-os install` to get the latest POEM version without losing my custom workflows and data.

**Acceptance Criteria**:

1. During installation, create `.poem-preserve` file in project root with default preservation rules (`poem/`, `dev-workspace/`)
2. When reinstalling, read preservation rules and identify files to update vs preserve; user workflows detected by "not in framework workflow list"
3. Before overwriting, display installation summary with file counts and prompt for confirmation: "This will overwrite X files. Continue? [y/N]"
4. Extend installation registry to track POEM version (`poemVersion` field read from `package.json`)
5. If framework files were modified by user (hash mismatch), warn during summary: "⚠ X files were modified and will be overwritten"
6. Update `README.md` with `.poem-preserve` explanation and examples

---

## Epic 2: Astro Runtime & Handlebars Engine

**Goal**: Build the `.poem-app/` Astro server with Handlebars template engine, enabling template rendering via API endpoints. This provides the runtime foundation for all template-based operations.

---

### Story 2.1: Configure Astro Server

As a developer,
I want a configured Astro server that starts reliably,
so that API endpoints are available for POEM operations.

**Acceptance Criteria**:

1. Astro server starts with `npm run dev` in `.poem-app/`
2. Server port configurable via environment variable or config file
3. Server startup time under 3 seconds (NFR2)
4. Health check endpoint `/api/health` returns server status
5. Server logs startup information (port, environment, version)
6. Graceful shutdown on SIGTERM/SIGINT
7. Error handling for port conflicts with helpful message

---

### Story 2.2: Implement Handlebars Service

As a developer,
I want a Handlebars service that compiles and renders templates,
so that API endpoints can process `.hbs` files.

**Acceptance Criteria**:

1. Handlebars service initializes on server start
2. Service loads helpers from `src/services/handlebars/helpers/` directory
3. Eager loading of all helpers during initialization
4. Service exposes `compile(template)` and `render(compiled, data)` methods
5. Template compilation errors return helpful messages with line numbers
6. Service handles missing placeholders gracefully (empty string or configurable)
7. Performance: render typical template (< 5KB) in under 100ms

---

### Story 2.3: Implement Basic Handlebars Helpers

As a prompt engineer,
I want basic formatting helpers available,
so that templates can transform data without custom code.

**Acceptance Criteria**:

1. `titleCase` helper: `{{titleCase "hello world"}}` → "Hello World"
2. `upperCase` helper: `{{upperCase "hello"}}` → "HELLO"
3. `lowerCase` helper: `{{lowerCase "HELLO"}}` → "hello"
4. `dateFormat` helper: `{{dateFormat date "YYYY-MM-DD"}}` → formatted date
5. `default` helper: `{{default value "fallback"}}` → value or fallback if empty
6. `json` helper: `{{json object}}` → JSON string for debugging
7. All helpers documented with examples in helpers README

---

### Story 2.4: Implement Hot-Reload for Helpers

As a developer,
I want helpers to hot-reload when modified,
so that I can develop helpers without restarting the server.

**Acceptance Criteria**:

1. File watcher monitors `src/services/handlebars/helpers/` directory
2. New helper files automatically loaded and registered
3. Modified helper files reloaded without server restart
4. Deleted helper files unregistered from Handlebars
5. Hot-reload logs which helpers were added/modified/removed
6. Syntax errors in helpers logged but don't crash server
7. Hot-reload completes within 1 second of file change

---

### Story 2.5: Create Template Render API Endpoint

As a skill or agent,
I want an API endpoint to render templates with data,
so that prompts can be processed programmatically.

**Acceptance Criteria**:

1. `POST /api/prompt/render` accepts template path and data
2. Endpoint loads template from `/poem/prompts/` or provided content
3. Template rendered with Handlebars service
4. Response includes: rendered output, render time, warnings
5. Missing data fields reported as warnings in response
6. Invalid template path returns 404 with helpful message
7. Response time under 1 second for typical templates (NFR3)

---

### Story 2.6: Create Schema Extraction API Endpoint

As a skill or agent,
I want an API endpoint to extract schemas from templates,
so that required data fields are automatically identified.

**Acceptance Criteria**:

1. `POST /api/schema/generate` accepts template path or content
2. Endpoint parses Handlebars placeholders and blocks
3. Returns JSON schema with field names and inferred types
4. Handles nested objects: `{{obj.field}}` → `{obj: {field: string}}`
5. Handles arrays: `{{#each items}}` → `{items: array}`
6. Identifies required helpers used in template
7. Schema follows simple JSON format (not full JSON Schema spec initially)

---

## Epic 3: Prompt Engineer Agent & Core Workflows

**Goal**: Create the first agent (Prompt Engineer) with workflows that enable users to create, refine, test, and validate prompts. This delivers the primary user journey.

---

### Story 3.1: Create Prompt Engineer Agent Definition

As a user,
I want a Prompt Engineer agent that guides prompt development,
so that I have systematic assistance creating quality prompts.

**Acceptance Criteria**:

1. Agent definition in `.poem-core/agents/prompt-engineer.md`
2. Agent follows BMAD agent structure (YAML config + persona + commands)
3. Persona defined: name, role, style, core principles
4. Commands listed: `*new`, `*refine`, `*test`, `*validate`, `*help`
5. Agent loads POEM principles/knowledge base on activation
6. Activation via `/poem/agents/penny` slash command works
7. Agent greets user and displays available commands

---

### Story 3.2: Implement New Prompt Workflow

As a prompt engineer,
I want a guided workflow to create new prompts,
so that prompts follow POEM best practices from the start.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/new-prompt.yaml`
2. Workflow gathers: prompt purpose, target output, required inputs
3. Creates `.hbs` template file in `/poem/prompts/`
4. Generates initial input schema and prompts for output schema definition in `/poem/schemas/`
5. Offers to generate mock data for testing
6. Provides preview of rendered template with example data
7. Workflow follows BMAD elicitation patterns for user interaction

---

### Story 3.3: Implement Refine Prompt Workflow

As a prompt engineer,
I want a workflow to iteratively improve existing prompts,
so that I can rapidly test and update prompts.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/refine-prompt.yaml`
2. Workflow loads existing prompt from path
3. Displays current template content, input schema, and output schema
4. Renders with available data (mock or provided)
5. User can modify template inline or via file
6. Changes saved and re-rendered for comparison
7. Iteration history tracked (optional, for undo)

---

### Story 3.4: Implement Test Prompt Workflow

As a prompt engineer,
I want a workflow to test prompts with various data,
so that I can validate prompt behavior across scenarios.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/test-prompt.yaml`
2. Workflow accepts prompt path and data source (mock, file, or inline)
3. Calls render API endpoint, displays output, and validates against output schema if present
4. Reports missing fields, helper errors, warnings
5. Can run multiple test scenarios in sequence
6. Displays render time and output length
7. Output can be saved to file for review

---

### Story 3.5: Implement Validate Prompt Workflow

As a prompt engineer,
I want a workflow to validate prompt structure and quality,
so that I catch issues before deployment.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/validate-prompt.yaml`
2. Validates Handlebars syntax (no parse errors)
3. Validates all input placeholders have corresponding input schema fields and output structure matches output schema
4. Validates required helpers are registered
5. Checks for POEM best practices (configurable rules)
6. Reports issues with severity (error, warning, info)
7. Provides suggestions for fixing common issues

---

### Story 3.6: Create Core Skills for Prompt Engineer

As a prompt engineer,
I want autonomous skills that assist with common tasks,
so that I can work efficiently without always invoking full workflows.

**Acceptance Criteria**:

1. `check-my-prompt.md` skill validates current prompt in context
2. `preview-with-data.md` skill renders prompt with provided/mock data
3. `generate-schema.md` skill extracts input AND output schemas from template
4. Skills follow POEM skill format (markdown with instructions)
5. Skills are self-describing (suggest when they're useful)
6. Skills call API endpoints via HTTP for heavy operations
7. Skills documented in `.poem-core/skills/README.md`
8. Enhance `*list` command with formatted table, metadata (size, date modified), filtering
9. Enhance `*view` command with rich formatting, schema details, template statistics

**Note**: Basic `*list` and `*view` commands added to Prompt Engineer agent after Story 3.3 for immediate usability. This story enhances them with proper formatting, error handling, and metadata display.

---

### Story 3.7: Define and Validate Output Schemas

> **Note:** This story was initially implemented with separate schema files (input + output), but was corrected in **Story 3.7.1** to use unified schema files with `input` and `output` sections in a single file, aligning with the original 2026-01-07 architecture design.

As a prompt engineer,
I want to define output schemas for my prompts,
so that I can validate AI responses and enable type-safe workflow chaining.

**Acceptance Criteria**:

1. ~~Output schema stored alongside input schema (e.g., `generate-title-output.json`)~~ **Corrected in Story 3.7.1:** Output schema stored within unified schema file with `input` and `output` sections (e.g., `generate-title.json` contains both)
2. Schema defines expected AI response structure (fields, types, format)
3. Output schema extraction from prompt "Expected Output" section (optional automation)
4. API endpoint validates rendered output against output schema
5. Validation reports missing fields, type mismatches, format errors
6. Output schemas support both structured (JSON) and unstructured (text) outputs
7. Prompt Engineer agent workflows handle unified schemas (input + output in one file)
8. Output schemas optional (prompts can omit `output` section if outputs are purely informational)

**NFR Considerations**:
- Schema validation completes in <100ms (NFR2)
- Clear error messages for schema mismatches (NFR6)

---

### Story 3.8: Multi-Workflow Foundation (Phase 1)

As a prompt engineer,
I want to work with multiple independent workflows within one POEM workspace,
so that I can manage distinct prompt collections (YouTube Launch, Video Planning, NanoBanana) with workflow-specific context while sharing common resources.

**Acceptance Criteria**:

1. Workflow-scoped directory structure created in `dev-workspace/workflows/<name>/`
2. Config system extended to support `currentWorkflow` and workflow definitions
3. Workflow configuration includes: prompts path, schemas path, reference paths (array)
4. Config service resolves workflow-scoped paths based on active workflow
5. Penny gains `*workflows` command to list available workflows
6. Penny gains `*switch <workflow>` command to change active context
7. Penny gains `*context` command to show current workflow info
8. Existing Penny commands (`*list`, `*new`, `*view`) operate in workflow-scoped context
9. Prompts created in workflow A don't appear when switched to workflow B
10. Schemas scoped to workflow directories
11. Can switch between workflows without restarting server or agent
12. Active workflow persists across Penny sessions
13. Workflow config supports reference paths as **array** (multiple sources)
14. Reference path types supported: `local`, `second-brain`
15. `*context` command displays available reference paths
16. WorkflowDefinition model documented in architecture
17. Workflow config structure documented with comments
18. Phase 1 limitations documented (what's deferred to Phase 2)

**Phase Note**: Phase 1 (4-6 hours) delivers foundation for Epic 4 testing. Phase 2 (Story 4.9) adds polish and integration based on Epic 4 learnings.

**Related**: Course correction `docs/planning/course-corrections/2026-01-12-multi-workflow-architecture.md`

---

## Epic 4: YouTube Automation Workflow (System Validation)

**Goal**: Validate POEM's core capabilities through the YouTube Launch Optimizer workflow—a real-world, non-trivial multi-prompt pipeline. This epic tests schema extraction, template chaining, mock data generation, Handlebars helpers, progressive data accumulation, and human-in-the-loop patterns using 53 production templates across 11 workflow sections.

---

### Story 4.1: Import YouTube Launch Optimizer Templates

As a prompt engineer,
I want to import the 53 YouTube Launch Optimizer templates into POEM,
so that I have a real-world prompt collection to validate the system.

**Acceptance Criteria**:

1. All 53 `.hbs` templates are copied to `/poem/prompts/youtube-launch-optimizer/`
2. Templates maintain their section-based naming convention (e.g., `1-1-configure.hbs`, `5-1-generate-title-v1.hbs`)
3. `brand-config.json` is imported to `/poem/config/` with CTAs, affiliates, and social links
4. `workflow-attributes.json` **reference example** is copied to `/poem/schemas/examples/youtube-launch-optimizer/` as validation baseline for auto-derived schema
5. Import process validates Handlebars syntax for each template
6. Import summary reports: total templates, sections covered, any syntax errors

---

### Story 4.2: Extract Schemas from Templates

As a prompt engineer,
I want to automatically extract JSON schemas from template placeholders,
so that I know what data each prompt requires without manual inspection.

**Acceptance Criteria**:

1. Schema extraction parses Handlebars placeholders from `.hbs` files
2. Simple placeholders extracted: `{{fieldName}}` → `{fieldName: string}`
3. Nested placeholders extracted: `{{object.field}}` → `{object: {field: string}}`
4. Array access extracted: `{{items.[0]}}` → `{items: array}`
5. Each blocks extracted: `{{#each items}}` → `{items: array}`
6. Conditional blocks extracted: `{{#if condition}}` → `{condition: boolean}`
7. Helper calls identified: `{{truncate title 49}}` → notes `truncate` helper required
8. Generated schemas saved to `/poem/schemas/youtube-launch-optimizer/` mirroring prompt structure
9. Extraction handles the 7 specific patterns from workflow spec
10. Output structure extracted from "Expected Output" or "Output Format" sections
11. Output schemas saved to `/poem/schemas/{name}-output.json`
12. Extraction reports prompts with no output schema defined

---

### Story 4.3: Generate Mock Workflow Data

As a prompt engineer,
I want to generate mock data matching the workflow-data schema,
so that I can test each prompt independently without real transcripts.

**Acceptance Criteria**:

1. Mock data generated for all 37 workflow-data fields defined in spec
2. String fields generate realistic YouTube-appropriate content (titles, descriptions)
3. Array fields generate appropriate item counts (e.g., 5-10 chapter titles, 3-5 title candidates)
4. Nested objects maintain structure (e.g., `analyzeContentEssence.mainTopic`, `analyzeContentEssence.keywords`)
5. Mock `transcriptAbridgement` generates 500-1000 word summary text
6. Mock `createChapters` generates YouTube chapter format with timestamps
7. Generated mock data validates against extracted schemas
8. Mock data saved to `/poem/mock-data/youtube-launch-optimizer/workflow-data.json`

---

### Story 4.4: Implement Required Handlebars Helpers

As a prompt engineer,
I want the Handlebars helpers needed by YouTube Launch Optimizer templates,
so that templates render correctly with formatting and logic.

**Acceptance Criteria**:

1. `gt` helper implemented: `{{#if (gt chapters.length 20)}}` for greater-than comparison
2. `truncate` helper implemented: `{{truncate title 49}}` with character limit
3. `join` helper implemented: `{{join keywords ", "}}` for array-to-string
4. `formatTimestamp` helper implemented: `{{formatTimestamp seconds}}` for MM:SS format
5. All helpers registered with Handlebars engine on server start
6. Hot-reload works when helpers are added/modified during development
7. Helpers documented in `.poem-app/src/services/handlebars/helpers/README.md`

---

### Story 4.5: Run Single Prompt with Mock Data

As a prompt engineer,
I want to render a single template with mock data and see the output,
so that I can validate individual prompts work correctly.

**Acceptance Criteria**:

1. API endpoint accepts template path and data source (mock or provided)
2. Template renders with Handlebars engine including custom helpers
3. Rendered output returned in response
4. Missing placeholder fields reported as warnings (not errors)
5. Helper errors reported with template location and context
6. Response includes metadata: template name, data source, render time
7. Test with `6-1-yt-simple-description-v2.hbs` using mock workflow data
8. Validates rendered output against output schema (if present)
9. Reports schema validation failures with field-level details

---

### Story 4.6: Run Prompt Chain (Section 1 → Section 5)

As a prompt engineer,
I want to run a chain of prompts where outputs feed into subsequent prompts,
so that I can validate template chaining and progressive data accumulation.

**Acceptance Criteria**:

1. Chain definition specifies prompt sequence and data flow
2. Output from prompt A stored in workflow-data under specified key
3. Subsequent prompts access accumulated workflow-data with optional field mappings between prompt I/O and workflow attributes
4. Chain tested: `1-4-abridge` → `4-1-analyze-content-essence` → `5-1-generate-title`
5. Each step logs: prompt name, input fields used, output fields added
6. Chain can be paused and resumed (workflow-data persisted)
7. Final workflow-data contains all accumulated fields from chain
8. Supports optional mapper objects for translating prompt field names to workflow attribute names

---

### Story 4.6.5: Auto-Generate Workflow Schema from YAML

As a workflow execution engine,
I want to automatically derive the workflow schema from step inputs/outputs,
so that the workflow YAML is the single source of truth.

**Acceptance Criteria**:

1. Workflow parser extracts all step `inputs:` and `outputs:` declarations from YAML
2. Schema generator computes union of all declared attributes
3. Generated schema includes type inference (string, array, object) based on usage
4. Schema file is written to `poem/schemas/workflows/{workflow-name}.json` for debugging
5. Generated schema matches `data/youtube-launch-optimizer/schemas/workflow-attributes.json` reference example (80+ attributes)
6. Schema generation is automatic - no manual creation required
7. API endpoint `/api/workflow/{name}/schema` returns auto-derived schema for validation

**Technical Notes**:

- Use workflow YAML step I/O as source of truth
- Reference example: `data/youtube-launch-optimizer/schemas/workflow-attributes.json` shows expected output
- Type inference rules:
  - Simple attributes default to `string`
  - Attributes accessed with `#each` are `array`
  - Attributes with dot notation are `object` with nested properties
  - Explicit type annotations in workflow YAML override inference

---

### Story 4.7: Human-in-the-Loop Checkpoint

As a prompt engineer,
I want to pause a workflow for human curation before continuing,
so that creative decisions like title selection involve human judgment.

**Acceptance Criteria**:

1. Workflow can define "checkpoint" steps requiring human input
2. Checkpoint presents options to user (e.g., generated title candidates)
3. User selection stored in workflow-data (e.g., `selectedTitles`)
4. Workflow resumes with human selection available to subsequent prompts
5. Test with `5-2-select-title-shortlist.hbs` pattern (Flexible Selection)
6. Checkpoint can accept multiple selections or free-form input
7. Skipping checkpoint uses first/default option (for automated testing)
8. Checkpoints can capture transient values (human input) into workflow attribute store
9. Transient values visible to downstream prompts via workflow-data

---

### Story 4.8: Platform Constraint Validation

As a prompt engineer,
I want prompts to validate platform-specific constraints,
so that generated content meets YouTube requirements.

**Acceptance Criteria**:

1. Constraint definitions loaded from config (character limits, format rules)
2. YouTube constraints implemented: title (50 chars), thumbnail text (20 chars), chapter title (49 chars), description visible (150 chars), description max (5000 chars)
3. Validation runs on prompt output, not input
4. Constraint violations reported with field name, limit, and actual length
5. Warnings vs errors configurable per constraint
6. Test with `5-1-generate-title` output against 50-char limit
7. Validation results included in chain execution report

---

### Story 4.9: Multi-Workflow Polish & Integration (Phase 2)

As a prompt engineer,
I want reference materials and shared resources integrated with multi-workflow context,
so that Penny can provide context-aware guidance using workflow-specific knowledge and detect cross-workflow resource usage.

**Acceptance Criteria**:

1. Penny can load and display reference materials from configured paths (array)
2. Reference loading supports multiple types: `local`, `second-brain`, `external`
3. Priority system used when same document exists in multiple sources
4. `*context --reference` command displays available reference documents
5. Reference documents viewable from Penny (e.g., `*view-reference api-docs.md`)
6. Shared prompts directory (`dev-workspace/shared/prompts/`) functional
7. Shared schemas directory functional
8. Penny detects when prompt is shared across workflows
9. `*list --shared` shows shared prompts with workflow usage info
10. Creating/editing shared prompt shows multi-workflow impact warning
11. Workflow definition file format finalized based on B72 learnings
12. `workflow-definition.yaml` structure documented
13. Workflow definitions include: name, description, sections, steps, I/O contracts
14. YouTube Launch Optimizer workflow definition created as reference
15. Workflow definitions loaded by config service
16. `*workflows --verbose` shows detailed workflow info
17. `*context --sections` displays workflow sections/steps (if definition exists)
18. `*switch <workflow>` validates workflow definition and warns about missing files
19. Better error messages and validation for workflow commands
20. When creating new prompt, Penny suggests related reference materials
21. When refining prompt, Penny references workflow-specific best practices
22. Multi-workflow usage guide created
23. Example workflows documented (YouTube, NanoBanana, SupportSignal)
24. Migration guide for converting flat workspace to multi-workflow
25. Phase 2 completion notes document learnings for Epic 9

**Epic 4 Integration**: This story applies learnings from B72 workflow validation (Stories 4.1-4.8) to finalize workflow definition format and reference integration patterns discovered during real 53-prompt workflow testing.

**Effort**: 4-6 hours (after Epic 4 validation complete)

**Related**: Story 3.8 (Phase 1 foundation), Enhancement #11 (Future Enhancements)

---

## Epic 5: System Agent & Helper Generation

**Goal**: Build the System Agent that creates custom Handlebars helpers on-demand and manages Astro infrastructure. This enables extensibility without manual coding.

---

### Story 5.1: Create System Agent Definition

As a user,
I want a System Agent that manages POEM infrastructure,
so that I can extend capabilities without leaving Claude Code.

**Acceptance Criteria**:

1. Agent definition in `.poem-core/agents/system-agent.md`
2. Agent follows BMAD agent structure
3. Persona defined: infrastructure-focused, code-generating
4. Commands listed: `*add-helper`, `*create-provider`, `*server-status`, `*help`
5. Activation via `/poem/agents/system-agent` slash command
6. Agent understands Handlebars helper patterns and Astro API patterns

---

### Story 5.2: Implement Add Helper Workflow

As a prompt engineer,
I want to request new Handlebars helpers by describing what I need,
so that custom formatting is available without manual JavaScript coding.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/add-helper.yaml`
2. User describes helper need in natural language
3. System Agent generates JavaScript helper code
4. Helper file created in `.poem-app/src/services/handlebars/helpers/`
5. Helper follows Handlebars helper conventions
6. Hot-reload picks up new helper automatically
7. Agent tests helper with example inputs before confirming

---

### Story 5.3: Implement Server Management Workflow

As a developer,
I want workflows to manage the Astro server,
so that I can start, stop, and troubleshoot without leaving Claude Code.

**Acceptance Criteria**:

1. `*server-start` command starts Astro server in background
2. `*server-stop` command gracefully stops running server
3. `*server-status` command reports: running/stopped, port, uptime
4. `*server-logs` command displays recent server logs
5. Server process management works cross-platform
6. Commands provide helpful error messages for common issues

---

### Story 5.4: Create Provider Pattern Foundation

As a developer,
I want a provider interface pattern established,
so that Integration Agent can work with any external system.

**Acceptance Criteria**:

1. Provider interface documented in `.poem-app/src/providers/README.md`
2. Interface defines required methods: `connect()`, `pullDictionary()`, `publishPrompt()`, `testConnection()`
3. Base provider class/type created for extension
4. Example "mock" provider implemented for testing
5. Provider registration mechanism in place
6. API endpoints route to appropriate provider based on name

---

### Story 5.5: Implement Create Provider Workflow

As a developer,
I want to create new provider implementations via System Agent,
so that external integrations are scaffolded correctly.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/create-provider.yaml`
2. User provides: provider name, connection details, API patterns
3. System Agent generates provider implementation files
4. Files created in `.poem-app/src/pages/api/providers/{name}/`
5. Provider implements required interface methods
6. Generated code includes TODO comments for customization
7. Provider registered and available after creation

---

## Epic 6: Integration Agent & Provider Pattern

**Goal**: Create the Integration Agent that connects to external systems via providers, enabling data dictionary pulls and prompt publishing.

---

### Story 6.1: Create Integration Agent Definition

As a user,
I want an Integration Agent that manages external system connections,
so that I can sync data and publish prompts to production.

**Acceptance Criteria**:

1. Agent definition in `.poem-core/agents/integration-agent.md`
2. Agent follows BMAD agent structure
3. Persona defined: integration-focused, connection-aware
4. Commands listed: `*connect`, `*pull-dictionary`, `*publish`, `*test-connection`, `*help`
5. Activation via `/poem/agents/integration-agent` slash command
6. Agent knows available providers and their status

---

### Story 6.2: Implement Pull Dictionary Workflow

As a prompt engineer,
I want to pull data dictionaries from external systems,
so that I know what fields are available for my prompts.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/pull-dictionary.yaml`
2. User selects provider to pull from
3. Workflow calls provider's `pullDictionary()` method
4. Dictionary saved to `/poem/schemas/dictionaries/{provider}.json`
5. Dictionary includes: field names, types, descriptions (if available)
6. Pull timestamp recorded for freshness tracking
7. Diff shown if dictionary already exists (new/changed/removed fields)

---

### Story 6.3: Implement Publish Prompt Workflow

As a prompt engineer,
I want to publish prompts to external systems,
so that tested prompts reach production.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/publish-prompt.yaml`
2. User selects prompt(s) and target provider
3. Validation runs before publish (syntax, schema, constraints)
4. Workflow calls provider's `publishPrompt()` method
5. Publish confirmation shows what was sent and response
6. Publish history logged for audit trail
7. Rollback information provided (if supported by provider)

---

### Story 6.4: Implement Test Connection Workflow

As a prompt engineer,
I want to test provider connections,
so that I know integrations are working before attempting operations.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/test-connection.yaml`
2. User selects provider to test
3. Workflow calls provider's `testConnection()` method
4. Reports: connected/failed, latency, authentication status
5. Helpful error messages for common connection issues
6. Can test all configured providers in sequence
7. Connection status cached for quick reference

---

### Story 6.5: Create Dictionary Skills

As a prompt engineer,
I want skills that help me work with data dictionaries,
so that I can find fields and validate schemas efficiently.

**Acceptance Criteria**:

1. `find-fields.md` skill searches dictionaries for matching fields
2. `validate-schema.md` skill checks schema fields exist in dictionary
3. `suggest-mappings.md` skill recommends field mappings based on names/types
4. Skills load dictionary data from `/poem/schemas/dictionaries/`
5. Skills provide helpful output with field details
6. Skills handle multiple dictionaries if present

---

## Epic 7: Mock/Test Data Agent & Level 2 Mock Data

**Goal**: Build the fourth agent with workflows for sophisticated mock data generation, including entity relationships and domain-specific scenarios.

---

### Story 7.1: Create Mock/Test Data Agent Definition

As a user,
I want a Mock/Test Data Agent that generates realistic test data,
so that I can test prompts with production-like scenarios.

**Acceptance Criteria**:

1. Agent definition in `.poem-core/agents/mock-data-agent.md`
2. Agent follows BMAD agent structure
3. Persona defined: data-focused, testing-oriented
4. Commands listed: `*generate-mock`, `*create-scenario`, `*curate-library`, `*help`
5. Activation via `/poem/agents/mock-data-agent` slash command
6. Agent understands schema patterns and data generation strategies

---

### Story 7.2: Implement Level 1 Mock Data Generation

As a prompt engineer,
I want to generate basic mock data from schemas,
so that I can test prompts without external dependencies.

**Acceptance Criteria**:

1. Workflow uses faker.js for data generation
2. String fields generate appropriate content based on field name hints
3. Number fields generate within reasonable ranges
4. Boolean fields generate true/false randomly
5. Array fields generate configurable number of items
6. Nested objects maintain structure from schema
7. Generated data saved to `/poem/mock-data/`

---

### Story 7.3: Implement Level 2 Mock Data Generation

As a prompt engineer,
I want realistic mock data based on provider dictionaries,
so that test data matches production patterns.

**Acceptance Criteria**:

1. Workflow reads field metadata from provider dictionaries
2. Field constraints (min/max, enum values, patterns) respected
3. Related fields maintain consistency (e.g., dates in sequence)
4. Domain-specific patterns applied (e.g., NDIS incident formats)
5. Entity relationships maintained across mock records
6. LLM-generated content option for realistic prose fields
7. Generation seed configurable for reproducible tests

---

### Story 7.4: Implement Scenario Library Workflow

As a prompt engineer,
I want to create and curate test scenario libraries,
so that edge cases and specific patterns are available for testing.

**Acceptance Criteria**:

1. Workflow defined in `.poem-core/workflows/create-scenario.yaml`
2. User describes scenario (e.g., "long title that exceeds limit")
3. Agent generates mock data matching scenario description
4. Scenarios saved to `/poem/mock-data/scenarios/` with names
5. Scenarios can be tagged and categorized
6. Scenario library searchable by tag/description
7. Scenarios can be combined for complex test cases

---

### Story 7.5: Implement Batch Mock Data Generation

As a prompt engineer,
I want to generate multiple mock data variations at once,
so that I can test prompts across many scenarios efficiently.

**Acceptance Criteria**:

1. Batch generation creates N variations from single schema
2. Variations include edge cases: empty strings, long text, special characters
3. Batch results saved as array or individual files
4. Summary report shows: variations generated, edge cases included
5. Batch can target specific fields for variation
6. Performance: generate 100 variations in under 10 seconds
7. Batch results usable for automated testing pipelines

---
