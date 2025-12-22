# POEM Capability Progression

**Purpose**: Visualize how POEM capabilities unlock over time, which agents can do what at each phase, and how the three test scenarios fit in.

---

## The Big Picture: Phased Capability Unlock

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         POEM CAPABILITY PROGRESSION                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1                PHASE 2                PHASE 3               PHASE 4 │
│  ─────────              ─────────              ─────────             ─────── │
│  .poem-core/            + .poem-app/           + Providers          + Level 2│
│  only                   Astro server           created              Mock Data│
│                                                                              │
│  ┌─────────┐           ┌─────────┐           ┌─────────┐          ┌─────────┐│
│  │ Agent 1 │           │ Agent 2 │           │ Agent 3 │          │ Agent 4 ││
│  │ Prompt  │           │ System  │           │Integration         │Mock Data││
│  │Engineer │           │ Agent   │           │ Agent   │          │ Level 2 ││
│  │         │           │         │           │         │          │         ││
│  │ + Agent │           │         │           │         │          │         ││
│  │ 4 basic │           │         │           │         │          │         ││
│  └────┬────┘           └────┬────┘           └────┬────┘          └────┬────┘│
│       │                     │                     │                     │    │
│       ▼                     ▼                     ▼                     ▼    │
│  ┌─────────┐           ┌─────────┐           ┌─────────┐          ┌─────────┐│
│  │YouTube  │           │Custom   │           │Publish  │          │Realistic││
│  │Launch   │           │Helpers  │           │to       │          │Domain   ││
│  │Optimizer│           │unlock   │           │Providers│          │Data     ││
│  │         │           │         │           │         │          │         ││
│  │SupportSig│          │Advanced │           │Pull Data│          │Entity   ││
│  │prompts  │           │templates│           │Dictionary          │Relations││
│  └─────────┘           └─────────┘           └─────────┘          └─────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```


---

## Phase 1: The "Fake It Till You Make It" Phase

**What's installed**: `.poem-core/` only (agents, workflows, knowledge base)
**What's NOT installed**: `.poem-app/` Astro server

### What Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1 CAPABILITIES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AGENT 1: Prompt Engineer                                       │
│  ─────────────────────────                                      │
│  ✅ Create new prompts (.hbs files)                             │
│  ✅ Create schemas (.json files)                                │
│  ✅ Refine existing prompts                                     │
│  ✅ Validate prompt structure                                   │
│  ⚠️  Preview (LLM-simulated, not real Handlebars)              │
│                                                                 │
│  AGENT 4: Mock Data (Level 1 only)                              │
│  ────────────────────────────────                               │
│  ✅ Generate fake data (LLM-invented)                           │
│  ✅ Basic faker.js patterns                                     │
│  ❌ Realistic domain data (needs providers)                     │
│                                                                 │
│  WHAT YOU CAN BUILD:                                            │
│  • YouTube Launch Optimizer (all prompts work)                  │
│  • SupportSignal prompts (basic testing)                        │
│  • Storyline prompts (basic testing)                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The "Fake It" Pattern Explained

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  USER: "Show me what this prompt looks like with data"          │
│                                                                 │
│  ┌─────────────────┐                                            │
│  │  Prompt (.hbs)  │     PHASE 1: LLM reads template,           │
│  │                 │     mentally substitutes values,           │
│  │  Hello          │     shows approximate output               │
│  │  {{firstName}}  │                                            │
│  │                 │     "Here's roughly what it would          │
│  └────────┬────────┘      look like: Hello John"                │
│           │                                                     │
│           │          PHASE 2+: Skill calls Astro API,           │
│           ▼          gets REAL Handlebars rendering             │
│  ┌─────────────────┐                                            │
│  │ Astro API       │     "Actual rendered output:               │
│  │ /api/render     │      Hello John"                           │
│  │                 │                                            │
│  └─────────────────┘                                            │
│                                                                 │
│  BOTH ARE USEFUL - Phase 1 is "good enough" for prompt          │
│  engineering, Phase 2 is "real" rendering                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 2: Infrastructure Unlocks

**What's installed**: `.poem-core/` + `.poem-app/` Astro server running

### What Unlocks

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2 CAPABILITIES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AGENT 2: System Agent (NOW FUNCTIONAL)                         │
│  ─────────────────────────────────────                          │
│  ✅ Create Handlebars helpers                                   │
│     → Generates JS in .poem-app/src/services/handlebars/helpers/│
│  ✅ Manage Astro server (start/stop/configure)                  │
│  ⚠️  Create providers (interface exists, no implementations)    │
│                                                                 │
│  AGENT 1: Enhanced Capabilities                                 │
│  ─────────────────────────────                                  │
│  ✅ REAL Handlebars rendering via API                           │
│  ✅ Custom helpers available ({{fullName}}, {{formatDate}})     │
│  ✅ Skills call APIs (not LLM simulation)                       │
│                                                                 │
│  WHAT BECOMES POSSIBLE:                                         │
│  • Complex templates with custom formatting                     │
│  • True preview of rendered output                              │
│  • Helper creation on-demand                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Helper Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  USER: "I need a helper to format chapter timestamps"           │
│                                                                 │
│           ┌─────────────────┐                                   │
│           │  System Agent   │                                   │
│           │                 │                                   │
│           │  Understands    │                                   │
│           │  requirement    │                                   │
│           └────────┬────────┘                                   │
│                    │                                            │
│                    ▼                                            │
│           ┌─────────────────┐                                   │
│           │  Generates JS   │                                   │
│           │                 │                                   │
│           │  formatChapters │                                   │
│           │  .js            │                                   │
│           └────────┬────────┘                                   │
│                    │                                            │
│                    ▼                                            │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  .poem-app/src/services/handlebars/helpers/         │        │
│  │  └── formatChapters.js                              │        │
│  └─────────────────────────────────────────────────────┘        │
│                    │                                            │
│                    ▼                                            │
│           ┌─────────────────┐                                   │
│           │  Now available  │                                   │
│           │  in templates:  │                                   │
│           │                 │                                   │
│           │  {{formatChapters chapters}}                        │
│           └─────────────────┘                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 3: Provider Pattern Unlocks

**What's installed**: Phase 2 + at least one provider implementation

### What Unlocks

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 3 CAPABILITIES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AGENT 2: Provider Creation                                     │
│  ──────────────────────────                                     │
│  ✅ Create provider implementations                             │
│     → Generates code in .poem-app/src/pages/api/providers/      │
│  ✅ SupportSignal/Convex provider                               │
│  ✅ Storyline provider                                          │
│  ✅ Any future providers                                        │
│                                                                 │
│  AGENT 3: Integration Agent (NOW FUNCTIONAL)                    │
│  ───────────────────────────────────────────                    │
│  ✅ Pull data dictionary from provider                          │
│  ✅ Publish prompts to provider                                 │
│  ✅ Test provider connections                                   │
│  ✅ Sync schemas                                                │
│                                                                 │
│  WHAT BECOMES POSSIBLE:                                         │
│  • Deploy prompts to production (SupportSignal)                 │
│  • Validate schemas against real data dictionaries              │
│  • Pull real field definitions                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Provider Pattern Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    PROVIDER PATTERN                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               Abstract Provider Interface                │    │
│  │  (Built into .poem-app/ foundation)                      │    │
│  │                                                          │    │
│  │  • readDictionary()                                      │    │
│  │  • publishPrompt(template, schema)                       │    │
│  │  • testConnection()                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│           ┌──────────────┼──────────────┐                       │
│           │              │              │                       │
│           ▼              ▼              ▼                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │SupportSignal│ │  Storyline  │ │   Future    │                │
│  │   Provider  │ │  Provider   │ │  Provider   │                │
│  │             │ │             │ │             │                │
│  │ Convex SDK  │ │  REST API   │ │     ???     │                │
│  │ integration │ │ integration │ │             │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                 │
│  CREATED BY: System Agent (via "create provider" workflow)      │
│  USED BY: Integration Agent (via publish/pull workflows)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 4: Full Capability

**What's installed**: Everything + provider data access

### What Unlocks

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 4 CAPABILITIES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AGENT 4: Mock Data (Level 2 - Realistic)                       │
│  ─────────────────────────────────────────                      │
│  ✅ Generate mock data based on real schemas                    │
│  ✅ Entity relationships                                        │
│  ✅ Domain-specific patterns                                    │
│  ✅ Anonymization of real data                                  │
│  ✅ Curated domain libraries                                    │
│                                                                 │
│  WHAT BECOMES POSSIBLE:                                         │
│  • Test prompts with realistic NDIS incident data               │
│  • Test prompts with realistic storyline characters             │
│  • Edge cases that match production patterns                    │
│  • Compliance-ready test scenarios                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Three Test Scenarios

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST SCENARIO PROGRESSION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCENARIO 1: YouTube Launch Optimizer                           │
│  ─────────────────────────────────────                          │
│  Phase: 1 (immediately usable)                                  │
│  Readiness: ★★★★★ (battle-tested, 15+ months)                   │
│  Purpose: Validate Prompt Engineer Agent                        │
│  Benefit: David can publish videos while building POEM          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  transcript → summary → chapters → title → description  │    │
│  │                                                         │    │
│  │  33 prompts, 8 sections, sequential pipeline            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SCENARIO 2: SupportSignal                                      │
│  ─────────────────────────                                      │
│  Phase: 2-3 (needs providers for full testing)                  │
│  Readiness: ★★★★☆ (5 months with Angela)                        │
│  Purpose: Validate Integration Agent + Provider Pattern         │
│  Benefit: Real-world deployment to Convex                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  incident data → enhance narrative → classify → extract │    │
│  │                                                         │    │
│  │  NDIS compliance, high-stakes prompts                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SCENARIO 3: Storyline App                                      │
│  ─────────────────────────                                      │
│  Phase: 4+ (needs everything)                                   │
│  Readiness: ★★☆☆☆ (concept only)                                │
│  Purpose: Validate "build from scratch" workflow                │
│  Benefit: Tests POEM for NEW prompt creation                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  narrative → characters → style → beats → visual specs  │    │
│  │                                                         │    │
│  │  Multi-step pipeline, rich JSON output                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Workflow Unlock Matrix

Which workflows are available at each phase:

```
┌────────────────────────┬─────────┬─────────┬─────────┬─────────┐
│ Workflow               │ Phase 1 │ Phase 2 │ Phase 3 │ Phase 4 │
├────────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ PROMPT ENGINEER                                                │
├────────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ Create new prompt      │   ✅    │   ✅    │   ✅    │   ✅    │
│ Refine prompt          │   ✅    │   ✅    │   ✅    │   ✅    │
│ Test with data         │   ⚠️*   │   ✅    │   ✅    │   ✅    │
│ Validate structure     │   ✅    │   ✅    │   ✅    │   ✅    │
├────────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ SYSTEM AGENT                                                   │
├────────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ Create helper          │   ❌    │   ✅    │   ✅    │   ✅    │
│ Create provider        │   ❌    │   ⚠️**  │   ✅    │   ✅    │
│ Manage infrastructure  │   ❌    │   ✅    │   ✅    │   ✅    │
├────────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ INTEGRATION AGENT                                              │
├────────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ Pull data dictionary   │   ❌    │   ❌    │   ✅    │   ✅    │
│ Publish prompt         │   ❌    │   ❌    │   ✅    │   ✅    │
│ Test connection        │   ❌    │   ❌    │   ✅    │   ✅    │
├────────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ MOCK DATA AGENT                                                │
├────────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ Generate fake data     │   ✅    │   ✅    │   ✅    │   ✅    │
│ Generate realistic     │   ❌    │   ❌    │   ❌    │   ✅    │
│ Pull sample data       │   ❌    │   ❌    │   ✅    │   ✅    │
└────────────────────────┴─────────┴─────────┴─────────┴─────────┘

* LLM-simulated preview (good enough for most work)
** Can create code, but no external system to test against
```

---

## Skills Dependency

```
┌─────────────────────────────────────────────────────────────────┐
│                    SKILLS BY PHASE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1 (Works with LLM assistance)                            │
│  ──────────────────────────────────                             │
│  ✅ Check My Prompt                                             │
│  ✅ Generate Placeholder Schema                                 │
│  ⚠️  Preview with Example Data (simulated)                     │
│                                                                 │
│  PHASE 2 (Requires Astro APIs)                                  │
│  ─────────────────────────────                                  │
│  ✅ Preview with Example Data (real rendering)                  │
│                                                                 │
│  PHASE 3 (Requires Providers)                                   │
│  ─────────────────────────────                                  │
│  ✅ Find Fields in Data Dictionary                              │
│  ✅ Validate Schema Against Dictionary                          │
│  ✅ Suggest Mappings                                            │
│  ✅ Pull Data Dictionary                                        │
│  ✅ Publish Prompt                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary: The Unlock Story

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  PHASE 1: "I can write and test prompts"                        │
│           └── YouTube Launch Optimizer is immediately useful    │
│                                                                 │
│  PHASE 2: "I can use advanced templating"                       │
│           └── Custom helpers, real preview                      │
│                                                                 │
│  PHASE 3: "I can deploy to production"                          │
│           └── SupportSignal prompts go live                     │
│                                                                 │
│  PHASE 4: "I can test with realistic data"                      │
│           └── Full compliance testing, edge cases               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2025-11-23
