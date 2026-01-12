# VibeDeck - Product Concept for Image Generation

**Project Type**: Product photography + marketing images
**Purpose**: Generate promotional images for Kickstarter campaign
**Status**: Concept stage - using Nano Banana to visualize the product

---

## Product Overview

**VibeDeck** is a purpose-built hardware controller for vibe coding and context engineering workflows.

### The Evolution
- **Starting point**: Stream Deck (programmable button controller)
- **Vision**: Custom 3D-printed device optimized for AI-assisted development
- **Target**: Developers using Claude, BMAD Method, SPECkit, OpenSPEC, AutoClaude, etc.

### Key Features
- Dedicated buttons for role switching (PO → Dev → QA → Context Engineer)
- Mode buttons (Spec / Build / Test / Review / Ship)
- Prompt bank (save/load common prompts)
- Microphone input for voice-driven workflows
- Visual feedback (LEDs showing current mode/role)
- Context checkpoint button (save state)
- "What's next?" quick action button

---

## Product Description (for Image Generation)

### Physical Form Factor

**Option 1: Compact Deck (8-12 keys)**
- Desktop form factor, similar size to Stream Deck (4x3 grid or 3x4)
- 3D printed enclosure with matte finish
- Mechanical keyboard switches (tactile feedback)
- RGB LED backlighting per key
- Small OLED display showing current mode
- Integrated USB-C connection
- Optional: Dedicated microphone with push-to-talk button

**Option 2: Extended Deck (15-20 keys)**
- Larger desktop surface
- Organized in functional rows:
  - Top row: Role buttons (PO / Dev / QA / Review)
  - Middle row: Meta actions (Next / Summarize / Checkpoint / Help)
  - Bottom row: Workflow stages (Spec / Plan / Build / Test / Fix / Ship)
- Rotary encoder for volume/slider control
- Larger status display

**Option 3: Modular System**
- Stackable/connectable units
- Base unit: Core controls
- Extension modules: Prompt bank, advanced workflows
- Magnetic or clip-together design

### Materials & Aesthetics

**Current thinking:**
- 3D printed PLA or ABS plastic (production-ready finish)
- Matte black or dark gray primary color
- Accent colors for key caps (role-based color coding)
- Minimalist, professional aesthetic (not gamer-RGB)
- Subtle branding (VibeDeck logo, maybe Claude/BMAD badges)

**Inspiration:**
- Stream Deck (familiar to target audience)
- Mechanical keyboard aesthetic (developer-friendly)
- Professional audio equipment (studio-grade feel)

---

## Image Generation Goals

### 1. Product Photography (Hero Shots)

**Use case**: Kickstarter main image, website hero

**Desired outputs:**
- Clean studio shot on neutral background
- Dramatic lighting showing key details
- Close-up of button layout and labels
- 3/4 angle showing depth and design
- Possibly with hands interacting (developer using it)

**Example prompt concept:**
```json
{
  "task": "generate_image",
  "subject": {
    "type": "hardware_device",
    "name": "VibeDeck programmable controller",
    "description": "3D printed control deck with mechanical buttons, RGB lighting, small OLED display",
    "color_primary": "matte black",
    "color_accent": "subtle RGB glow from buttons"
  },
  "composition": {
    "shot_type": "product_hero",
    "angle": "3/4 view from slightly above",
    "distance": "medium close-up"
  },
  "lighting": {
    "style": "dramatic studio",
    "key_light": "soft from left 45 degrees",
    "rim_light": "subtle blue/purple accent"
  },
  "surface": {
    "material": "dark wood desk or concrete",
    "reflectivity": "subtle reflection"
  },
  "background": {
    "type": "gradient",
    "colors": ["dark gray", "black"],
    "blur": "subtle"
  },
  "mood": "professional, high-tech, developer-focused"
}
```

### 2. Lifestyle / In-Context Shots

**Use case**: Show the product in use, Kickstarter story section

**Desired outputs:**
- Developer's desk setup with VibeDeck
- Dual monitor setup, coffee cup, minimal aesthetic
- VibeDeck in foreground, code editor on screen in background
- Natural/warm lighting (home office vibe)
- Optional: Hands typing on keyboard with VibeDeck nearby

### 3. Feature Detail Shots

**Use case**: Explain specific features in campaign

**Desired outputs:**
- Close-up of button labels (show "PO", "Dev", "QA", etc.)
- OLED display showing mode ("Build Mode")
- RGB lighting effects (different colors for different modes)
- Micro-USB or USB-C connection detail
- Bottom view showing 3D printed structure/mounting

### 4. Comparison / Before & After

**Use case**: Show problem → solution

**Before**: Developer struggling with multiple Claude windows, copying/pasting
**After**: Clean workflow with VibeDeck controlling everything

### 5. Marketing / Social Media

**Use case**: Instagram, Twitter, LinkedIn posts

**Desired outputs:**
- Square format (1:1)
- Bold text overlay: "VibeDeck: Hardware for Vibe Coding"
- High contrast, eye-catching
- Product against solid color background
- Minimal copy, maximum visual impact

---

## Conceptual Variations to Explore

Since we're in concept stage, we want to generate multiple options:

1. **Form factor variations**:
   - Compact (8 keys)
   - Standard (12 keys)
   - Extended (20 keys)
   - Modular (stackable units)

2. **Color schemes**:
   - All black (stealthy)
   - Black + neon accents (cyberpunk)
   - White + pastels (minimalist/Apple-esque)
   - Transparent enclosure (showcase internals)

3. **Button layout**:
   - Grid (4x3, 5x4)
   - Curved arc (ergonomic)
   - Staggered rows (like keyboard)

4. **Branding integration**:
   - VibeDeck logo placement
   - Claude logo/colors
   - BMAD Method badge
   - "Powered by OpenSPEC" badge

---

## Kickstarter Campaign Image Strategy

### Primary Images (Must Have)
1. **Hero shot**: Product on dramatic background
2. **In-context**: Developer using VibeDeck at desk
3. **Feature grid**: 6-9 close-ups showing key features
4. **Comparison**: Before VibeDeck (chaotic) vs After (clean)
5. **Team photo**: Hackathon-style team building the product

### Supporting Images
6. Size comparison (next to Stream Deck, keyboard, coffee cup)
7. Connection diagram (how it integrates with workflow)
8. Packaging mockup (what backers receive)
9. Color/variant options
10. Behind-the-scenes (3D printing, assembly)

---

## First Nano Banana Prompt to Try

**Start simple with hero shot:**

```json
{
  "task": "generate_image",
  "subject": {
    "type": "product",
    "name": "VibeDeck controller",
    "description": "Compact programmable button deck with 12 mechanical keys arranged in 4x3 grid, matte black 3D printed enclosure, subtle RGB underglow from buttons, small OLED display at top showing 'Build Mode', professional developer tool aesthetic"
  },
  "lighting": {
    "style": "studio softbox",
    "key_light": {
      "direction": "left_45",
      "intensity": "medium"
    },
    "rim_light": {
      "enabled": true,
      "intensity": "subtle",
      "color": "cool blue"
    }
  },
  "composition": {
    "angle": "eye_level",
    "distance": "medium",
    "framing": "rule_of_thirds_left"
  },
  "surface": {
    "material": "dark wood desk",
    "texture_visibility": "subtle wood grain"
  },
  "background": {
    "type": "gradient",
    "colors": ["#1a1a1a", "#000000"],
    "gradient_direction": "vertical"
  },
  "mood": "professional, high-tech, minimalist"
}
```

**Iterate from there:**
- Adjust lighting
- Change camera angle
- Add context (keyboard, monitor in background)
- Experiment with colors
- Test different surfaces

---

## Research Still Needed

Before generating final campaign images:
- [ ] Finalize form factor (8, 12, or 20 keys?)
- [ ] Decide on primary color scheme
- [ ] Confirm button labels/layout
- [ ] Get reference images of similar products (Stream Deck, etc.)
- [ ] Define target aesthetic more precisely (cyberpunk? minimalist? gamer?)

**Next step**: Use POEM Prompt Engineer (`/poem/agents/penny`) to create templates for each image type.

---

**Last Updated**: 2026-01-12
**Status**: Ready to start generating concept images
