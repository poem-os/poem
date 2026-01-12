# Nano Banana - 3-Step Implementation Plan

This document defines the complete workflow from research to production prompts.

**Current Status**: 📍 Step 1 (Research & Data Collection)

---

## Step 1: Organize Raw Data ✅ CURRENT PHASE

**Goal**: Build comprehensive knowledge base before prompt creation

**Activities:**
- [x] Research Nano Banana Pro JSON prompting fundamentals
- [x] Understand renderer vs vibes machine paradigm
- [x] Document handle-based iteration patterns
- [x] Capture multi-grammar schema patterns (photo/UI/diagram)
- [x] Document API implementation (Python SDK, request/response)
- [x] Capture advanced patterns (prompt chaining, identity persistence, minimal diff)
- [ ] Collect YOUR specific example image generation prompts
- [ ] Document YOUR camera angles and shot types vocabulary for nano banana
- [ ] Define YOUR storytelling beat structure
- [ ] Capture YOUR visual style preferences and patterns
- [ ] Note pain points and requirements specific to your workflow

**Output Artifacts** (in `data/nano-banana/`):
- `reference/` - Domain knowledge documents ✅ **3 documents complete**
  - `nano-banana-json-prompting.md` - Core concepts (renderer vs vibes, handles, schemas)
  - `nano-banana-api-implementation.md` - Technical/API implementation (Python SDK, patterns)
  - `vibe-deck-context-engineering-research.md` - Related hardware project research
- `examples/` - Real examples of what works/doesn't work ⏳ **Awaiting your examples**

**Completion Criteria:**
- ✅ Have sufficient examples to understand the domain
- ✅ Domain vocabulary is documented (camera angles, shot types, etc.)
- ✅ Understand the workflow/process that needs automation
- ✅ Know what inputs and outputs the prompt system needs

**When Ready**: Update this file with "Step 1 Complete" and move to Step 2.

---

## Step 2: Design Prompt Workflow 📋 DEFINED, NOT STARTED

**Goal**: Use POEM's Prompt Engineer agent to create working prompts in `dev-workspace/`

**Prerequisites:**
- Step 1 complete with sufficient reference materials
- Clear understanding of inputs (scene description, shot type, camera angle, etc.)
- Examples of desired outputs

**Activities:**
1. **Activate Prompt Engineer**: `/poem/agents/penny`
2. **Create first prompt** using `*new` workflow:
   - Define prompt purpose from Step 1 research
   - Specify input fields (discovered during research)
   - Choose naming convention (e.g., `generate-nano-banana-shot`)
   - Generate input schema automatically
   - Optionally define output schema for validation
   - Generate mock data for testing
3. **Test and refine**:
   - Use `*test` to validate with different scenarios
   - Use `*refine` to improve template based on results
   - Use `*validate` to check quality and best practices
4. **Iterate** until prompt produces desired results

**Output Artifacts** (in `dev-workspace/`):
- `prompts/` - Working `.hbs` template files
- `schemas/` - JSON schemas for input/output validation
- `mock-data/` - Test data for validation

**Completion Criteria:**
- ✅ Core prompt(s) working in `dev-workspace/`
- ✅ Tested with diverse scenarios
- ✅ Output quality meets requirements
- ✅ Schemas validated and complete

**When Ready**: Move to Step 3 for workflow chaining.

---

## Step 3: Build Multi-Prompt Workflow 📋 DEFINED, NOT STARTED

**Goal**: Chain multiple prompts together for complete end-to-end workflow

**Prerequisites:**
- Step 2 complete with validated individual prompts
- Understanding of prompt chaining requirements

**Activities:**
1. **Identify prompt sequence**:
   - Example: Story outline → Shot list → Individual shot prompts → Style refinement
2. **Create workflow prompts**:
   - Use Penny's `*new` for each stage of the pipeline
   - Ensure output schemas from one prompt match input schemas of next
3. **Test integration**:
   - Validate data flows correctly between prompts
   - Check cumulative output quality
4. **Document workflow**:
   - Create workflow guide in `data/nano-banana/`
   - Document the prompt chain and data flow

**Output Artifacts**:
- Complete prompt pipeline in `dev-workspace/`
- Integration tests proving end-to-end workflow
- Documentation for using the workflow

**Completion Criteria:**
- ✅ Multi-stage workflow functional
- ✅ End-to-end testing complete
- ✅ Ready for production use

---

## Notes for Future Sessions

**If starting a new conversation:**
1. Check this file to see current phase
2. Review `README.md` for project context
3. Review completed artifacts in `examples/` and `reference/`
4. Continue from current step

**Reference Materials:**
- POEM documentation: `docs/prd.md`, `docs/architecture.md`
- Prompt Engineer agent: `/poem/agents/penny`
- Example datasets: `data/supportsignal/`, `data/storyline/`, `data/youtube-launch-optimizer/`

---

**Last Updated**: 2026-01-12
**Next Review**: After Step 1 research complete
