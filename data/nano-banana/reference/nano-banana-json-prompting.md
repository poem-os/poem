# Nano Banana - JSON Prompting Research

**Source**: Raw research extracted 2026-01-12
**Purpose**: Understanding how Nano Banana Pro works and why JSON prompting is effective

---

## Core Insight: Renderer vs Vibes Machine

**Nano Banana Pro is a renderer, not a vibes machine.**

Key characteristics:
- Optimizes for **constraint satisfaction**
- Tracks **object identity**
- Preserves **compositional invariants**
- Accepts **scoped mutations**
- Can re-render the same scene graph under different projections

This is fundamentally different from Midjourney-style diffusion-vibe systems.

---

## Why JSON Works for Nano Banana Pro

### JSON = Stable Handles, Not Format

JSON isn't about format—it's about creating a **referential system** the model can reason over.

Once you name things:
- `subject`
- `environment`
- `camera`
- `component_id`
- `layout_node`
- `token.color.primary`

...you've created handles that enable:
- "Regenerate but only change X" workflows
- Camera pivots around the same scene
- Cross-grammar rendering (photo → UI → diagram)
- Meaningful diffing between prompt versions
- Version control that makes sense

**Without handles, everything collapses back into vibes.**

---

## When JSON Is Good vs Bad

### JSON is GOOD for:
- High-stakes propositions (marketing images, product shots)
- Precise specifications (UI with exact colors, layouts)
- Reproducible outputs (same scene, different angle)
- Iterative refinement (change one thing, keep the rest)
- Professional workflows requiring governance

### JSON is BAD for:
- Creative discovery / early ideation
- When you don't know what you want yet
- Exploratory vibes (Midjourney-style "neon cyberpunk schema")

**JSON collapses entropy. Creative discovery requires entropy.**

---

## Multi-Grammar Capability

Nano Banana Pro operates across multiple visual grammars:
- **Photo** (product shots, portraits, scenes)
- **UI** (mockups, dashboards, wireframes)
- **Diagram** (flowcharts, infographics, data viz)

These share no surface vocabulary but share **structure**:
- Abstract entities
- Relations
- Layout primitives
- Projection rules

**Nano Banana Pro is closer to a visual compiler than an image model.**

JSON schemas act as:
- Grammar selectors
- Domain constraints
- Validation scaffolding

---

## The Workflow

### Natural Language → Schema Synthesis → Deterministic Rendering

1. **Human** describes intent in natural language
2. **LLM translator** synthesizes structured JSON schema
3. **Human** reviews and adjusts schema (learns schema literacy organically)
4. **Nano Banana Pro** renders from schema
5. **Human** iterates by modifying specific handles

This preserves:
- Human intuition (stay in natural language)
- Machine rigor (structured specs)
- Team scalability (different skill levels can participate)

---

## Reproducibility = Production Readiness

Once you can:
- Version control prompts
- Diff V3 → V4 changes
- Encode accessibility constraints (e.g., minimum tap targets)
- Re-render identical outputs
- Test whether a prompt worked in a reliable way

You've crossed the line from:
- **"AI as a creative toy"**

to:
- **"AI as an engineered system component"**

This is the difference between:
- A designer typing vibes
- A product org shipping governed artifacts

---

## Key Schema Patterns

From the research, three core schema types emerged:

### 1. Product Photography Schema
Key sections:
- `product` - Identity, material, label positioning
- `lighting` - Style, key light, fill, rim, reflections
- `composition` - Camera angle, distance, framing, negative space
- `surface` - Material, color, texture, reflectivity
- `background` - Type, colors, gradient, blur
- `props` - Additional elements and positioning
- `effects` - Condensation, steam, splash, DOF
- `mood` & `style_reference` - Emotional tone and aesthetic reference

### 2. UI Mockup Schema
Key sections:
- `presentation` - Device type, screen arrangement, perspective
- `design_system` - Colors (hex codes), typography, styling
- `screens` - Array of screen definitions with components
- `component_types` - Structured component library (navbar, cards, forms, etc.)
- `content` - Text approach, image approach, data density
- `visual_style` & `reference_brands` - Style direction and inspirations

### 3. Data Infographic Schema
Key sections:
- `format` - Type, aspect ratio, orientation
- `header` - Title, subtitle, logo placement
- `data_sections` - Array of visualization sections with prominence hierarchy
- `visualization_types` - Big numbers, charts, timelines, flowcharts, tables
- `design` - Color scheme, typography, layout, decorative elements
- `style_reference` & `brand_notes` - Aesthetic direction

---

## Handle-Driven Iteration

The core workflow unlock:

1. **Generate initial spec** → Get baseline image
2. **Identify what's wrong** → "Lighting is too flat"
3. **Find the handle** → `lighting.style`, `lighting.key_light.direction`
4. **Make targeted change** → Adjust just those fields
5. **Regenerate** → Other elements stay stable because their specs didn't change

**Changing one handle doesn't roll the dice on everything else.**

---

## Important Rules

1. **Never invent data values** - For infographics, always ask for exact numbers
2. **Be specific with colors** - Use hex codes, not "blue"
3. **Use precise terminology** - "45 degrees from left" not "from the side"
4. **Preserve complete spec** - When iterating, provide full updated JSON
5. **Optimize for handles** - Structure specs so related things are grouped

---

## Suggestions for Enhancement

From the research conversation, additional patterns to consider:

### Add Entity IDs Everywhere
Not just screens—give IDs to:
- `product.id`, `product.label.id`
- Each `prop` gets an `id`
- Background/surface elements get IDs

**Why**: Enables "regenerate but only touch prop_ice_01" instead of roulette

### Add Mutation Protocol
```json
"mutation": {
  "mode": "freeze_all_except",
  "allow": ["lighting.*", "composition.camera.*"],
  "deny": ["product.*", "label.*", "text_in_image.copy"]
}
```

### Add Exactness Controls
```json
"field": {
  "strict": true,
  "tolerance": "low"
}
```

Prevents over-specification while maintaining control where needed.

---

## Bottom Line

JSON prompting for Nano Banana Pro is about:
- **Correctness over creativity** (when you need it)
- **Handles over vibes** (reproducibility)
- **Compilation over generation** (deterministic rendering)
- **Governance over guessing** (production readiness)

Use it when you need precision. Don't use it when you need exploration.

---

**Last Updated**: 2026-01-12
