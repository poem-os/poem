# POEM Agents

**Extracted from**: current-thinking-prompt-os.md
**Last Updated**: 2025-11-20
**Status**: Architecture definition

---

## Three Agents Confirmed (Fourth Under Consideration)

### 1. **Prompt Engineer Agent**
**Goal**: Create, refine, validate prompts using POEM principles

**Skills**:
- Check My Prompt
- Preview with Example Data
- Generate Placeholder Schema
- Find Fields in Data Dictionary
- Validate Schema Against Dictionary
- Suggest Mappings
- Create Prompt from Principles (uses brain/)

**Works with**: `/poem/prompts/`, `/poem/schemas/`

---

### 2. **System Agent**
**Goal**: Maintain systems like Astro and Handlebars

**Skills**:
- Create Helper (generates code in `.poem-app/src/services/handlebars/helpers/`)
- Register Helper (calls Astro API to load it)
- Test Prompt (renders with sample data)
- List Helpers (shows available helpers)
- Update Helper (modifies existing)
- Manage Astro Server (start, stop, configure)
- Create/modify API endpoints

**Works with**: `.poem-app/` (Astro, Handlebars, APIs)

**Why separate agent**:
- Different domain (system maintenance vs content creation)
- Different mindset for Angela ("maintaining the system" vs "creating prompts")
- Clear boundary (System infrastructure vs prompt content)

---

### 3. **Integration Agent**
**Goal**: Integrate with external systems (SupportSignal, future providers)

**Skills**:
- Pull Data Dictionary (from provider)
- Publish Prompt (to provider)
- Test Connection (verify provider works)
- Sync Status (check what's published)

**Works with**: Astro Provider APIs (`/api/providers/[name]`)

**Why separate**:
- External boundaries (not POEM internals)
- Could fail (network, auth, API changes)
- Provider-specific logic

---

## Agent Names - Function Over Technology

**Principle**: Agent names should describe FUNCTION, not technology they use.

### Current Names

**Agent 1: Prompt Engineer** ✅
- **Status**: Confirmed
- **Function**: Creates, refines, validates prompts
- **Domain**: Content (prompts, schemas, mappings)
- **Why this name**: Clear function focus, describes what Angela does most

**Agent 2: System Agent** ✅
- **Status**: Confirmed
- **Function**: Maintains systems like Astro and Handlebars
- **Domain**: System infrastructure (helpers, APIs, server management)
- **Why this name**: Function-focused (not "Handlebars Agent" - too technology-specific)
- **Alternative names considered**:
  - Extension Agent - Extends the system
  - Workshop Agent - Builds tools
  - Toolsmith Agent - Crafts system tools
  - Infrastructure Agent - Manages infrastructure

**Agent 3: Integration Agent** ✅
- **Status**: Confirmed
- **Function**: Integrates with external systems
- **Domain**: External boundaries (providers, data dictionary, publishing)
- **Why this name**: Describes integration function (not "DevOps Agent" - too generic)
- **Alternative names considered**:
  - Bridge Agent - Bridges to external world
  - Connector Agent - Connects to providers
  - Gateway Agent - Gateway to external systems
  - Sync Agent - Syncs with external systems

---

### Capabilities by Agent

**Prompt Engineer**:
- Create/edit prompts
- Generate schemas
- Map fields
- Validate prompts
- Search data dictionary
- Preview/test with data

**System Agent**:
- Create Handlebars helpers
- Test/register helpers
- Manage Astro server
- Create/modify Astro API endpoints
- Extend system functionality
- Configure infrastructure

**Integration Agent**:
- Connect to providers (SupportSignal/Convex, future)
- Pull data dictionary from external systems
- Publish prompts to external systems
- Test connections
- Sync status/data

---

## Common Questions

### Why No "Visualization Agent"?

**Answer**: Visualization is a **skill**, not an agent role.

**Reasoning**:
- Any agent can view the Astro dashboard when needed
- Opening a browser to `localhost:4321` is a simple action, not a complex role
- All agents might need to see prompt lists, schemas, or validation results
- No orchestration or decision-making required - just "show me the data"

**How it works**:
- **Skill**: "Open Dashboard" or "View Prompt List"
- **Action**: Launch browser to configured Astro URL
- **Available to**: All agents (no ownership)

---

## Skills vs Agents - Key Distinction

**Skills are autonomous, single-responsibility entities** that suggest when they're useful.

- Skills are NOT "owned by" agents
- Claude decides which skill to use based on context
- Any agent can potentially use any skill
- Skills suggest their utility through clear descriptions
- Agent groupings are organizational hints, not restrictions

**Example**: The "Preview with Example Data" skill is listed with Prompt Engineer Agent, but System Agent might use it when testing a new Handlebars helper.

---

## Fourth Agent Under Consideration

**Potential: Data/Testing Agent**

### Purpose
Generate mock data, validate schemas, test workflows, manage mock data ecosystem

### Current Thinking (Updated with Level 2 Mock Data Insights)

**Why it's LIKELY needed** (stronger case now):
- **Mock data is complex**: Not just "generate random name" but manage entire ecosystem
  - Hand-crafted scenarios with backstories
  - Anonymize production data (export → anonymize → store)
  - Entity-level persistence (participants, staff, locations)
  - Workflow scenarios (multi-step prompt pipelines)
  - Output data as input data tracking
- **Library management**: Version, tag, search, curate scenarios
- **Compliance requirements**: SupportSignal needs audit-ready test scenarios
- **Substantial orchestration**: This is significant work beyond simple skills

### Responsibilities (if created)
- **Mock Data Generation**: Hand-craft, anonymize, AI-generate scenarios
- **Entity Management**: Maintain persistent mock participants, staff, locations
- **Workflow Testing**: Test multi-prompt pipelines with realistic data
- **Library Curation**: Tag, version, search mock scenarios
- **Anonymization**: Export from production → de-identify → store
- **Validation**: Ensure mock data meets schema requirements

### Implementation Considerations
- **Anonymization**: Use libraries (Faker.js) + coded logic (not LLM-heavy)
  - Could be Astro API endpoint: `/api/mock-data/anonymize`
  - Or Claude Skill (if not too complex)
- **Mock Data Storage**: `/poem/mock-data/` (new top-level folder)
- **Export Integration**: Use SupportSignal's existing export function
  - Grab real data as JSON
  - Grab schemas from Convex
  - Create realistic mock data repositories

### Decision
**Status**: TBD - but Level 2 mock data vision makes this agent much more likely

**See**: [mock-data.md](./mock-data.md) for complete Level 2 mock data architecture

---

## Agent Selection in Practice

When Angela (or any user) works with POEM:

1. **Claude Code suggests the appropriate agent** based on the task
2. **User can explicitly switch agents** if needed
3. **Skills are available across agents** (autonomous entities)
4. **Agents are personas/contexts**, not hard boundaries

**Example workflow**:
```
User: "I want to create a new prompt for incident classification"
→ Claude suggests: Prompt Engineer Agent
→ Agent loads with relevant skills and context

User: "Now I need a helper to format dates in Australian format"
→ Claude suggests: System Agent
→ Agent loads with different skills and context

User: "Publish this to SupportSignal"
→ Claude suggests: Integration Agent
→ Agent loads with provider skills
```

---

**See also**:
- [skills.md](./skills.md) - Detailed skill specifications
- [workflows.md](./workflows.md) - How agents work together in workflows
- [structure.md](./structure.md) - System architecture and folder structure
