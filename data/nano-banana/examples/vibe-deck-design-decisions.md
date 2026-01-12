# VibeDeck - Design Decisions Worksheet

**Purpose**: Make concrete design decisions before generating images
**Status**: 🔨 Working document - fill in as you research

---

## Decision 1: Form Factor

### Options Under Consideration

**Option A: Compact (8 keys)**
- **Size**: ~4" x 3" (roughly half a Stream Deck)
- **Layout**: 4x2 or 2x4 grid
- **Pros**: Minimal desk footprint, portable, focused feature set
- **Cons**: Limited buttons, less room for all workflow stages
- **Target user**: Solo developer, simpler workflows

**Option B: Standard (12 keys)**
- **Size**: ~5" x 4" (similar to Stream Deck)
- **Layout**: 4x3 or 3x4 grid
- **Pros**: Familiar size, balanced functionality, standard form factor
- **Cons**: Middle-of-the-road, not particularly distinctive
- **Target user**: General vibe coder, BMAD user

**Option C: Extended (20 keys)**
- **Size**: ~7" x 5" (larger desktop footprint)
- **Layout**: 5x4 or 4x5 grid
- **Pros**: Complete workflow coverage, no compromises
- **Cons**: Takes up more desk space, might be overwhelming
- **Target user**: Power users, full BMAD workflows

**Option D: Modular**
- **Size**: Base unit + stackable extensions
- **Layout**: Start with 8-12, add modules as needed
- **Pros**: Scalable, customizable, premium positioning
- **Cons**: Complex manufacturing, higher cost, connection reliability
- **Target user**: Teams, professional setups

### Your Decision

**Primary form factor**: ____________

**Reasoning**:
-
-
-

**Backup option** (if primary doesn't work): ____________

---

## Decision 2: Button Layout & Labels

### Core Button Categories

Based on vibe coder research, we need buttons for:

1. **Role Switching** (4 buttons)
   - PO (Product Owner)
   - Dev (Developer)
   - QA (Tester)
   - Meta (Context Engineer)

2. **Mode/Stage** (5-7 buttons)
   - Brief
   - Spec
   - Plan
   - Build
   - Test
   - Polish
   - Ship

3. **Quick Actions** (3-5 buttons)
   - Next (what's next?)
   - Summarize (what changed?)
   - Checkpoint (save state)
   - Help
   - Undo/Back

4. **Meta Controls** (2-3 buttons)
   - Voice (push-to-talk)
   - List prompts
   - Settings

### Layout Sketch

**If 8 keys (4x2)**:
```
[  Role  ] [  Role  ] [  Role  ] [  Role  ]
[  Mode  ] [  Mode  ] [ Action ] [ Action ]
```

**If 12 keys (4x3)**:
```
[  Role  ] [  Role  ] [  Role  ] [  Role  ]
[  Mode  ] [  Mode  ] [  Mode  ] [  Mode  ]
[ Action ] [ Action ] [ Action ] [ Voice  ]
```

**If 20 keys (5x4)**:
```
[  Role  ] [  Role  ] [  Role  ] [  Role  ] [  Meta  ]
[  Mode  ] [  Mode  ] [  Mode  ] [  Mode  ] [  Mode  ]
[ Action ] [ Action ] [ Action ] [ Action ] [ Action ]
[ Prompt ] [ Prompt ] [ Prompt ] [ Prompt ] [ Voice  ]
```

### Your Layout Decision

**Draw/describe your preferred layout here**:
```
[        ] [        ] [        ] [        ]
[        ] [        ] [        ] [        ]
[        ] [        ] [        ] [        ]
```

**Button labels** (list them row by row):
- Row 1:
- Row 2:
- Row 3:
- Row 4:

**Color coding scheme**:
- Role buttons: _______________ (e.g., blue tones)
- Mode buttons: _______________ (e.g., green tones)
- Action buttons: _______________ (e.g., orange tones)
- Meta buttons: _______________ (e.g., purple tones)

---

## Decision 3: Visual Aesthetic

### Style Direction

**Choose one primary aesthetic** (or blend):

**Option A: Cyberpunk Developer**
- Matte black with neon RGB accents
- Sharp angles, aggressive lines
- High contrast
- References: Razer keyboards, gaming peripherals
- Vibe: "I'm serious about my craft"

**Option B: Minimalist Professional**
- Matte white or light gray
- Soft curves, clean lines
- Subtle RGB or no RGB
- References: Apple products, Teenage Engineering
- Vibe: "This belongs in a design studio"

**Option C: Industrial Maker**
- Raw materials visible (exposed PCB, clear enclosure)
- Utilitarian aesthetic
- Functional beauty
- References: Open-source hardware, maker movement
- Vibe: "I built this myself"

**Option D: Premium Studio Gear**
- Aluminum or high-quality plastic
- Subtle branding
- Professional color (dark gray, midnight blue)
- References: Audio interfaces, Elgato Stream Deck
- Vibe: "This is a tool, not a toy"

### Your Aesthetic Choice

**Primary aesthetic**: _______________

**Secondary influence** (if blending): _______________

**Describe the overall vibe you want**:
-
-
-

---

## Decision 4: Color Scheme

### Primary Device Colors

**Enclosure color** (pick one):
- [ ] Matte black
- [ ] Glossy black
- [ ] Dark gray (charcoal)
- [ ] White
- [ ] Light gray
- [ ] Clear/Transparent
- [ ] Other: _______________

**Key cap colors** (pick approach):
- [ ] All same as enclosure
- [ ] Black keys, colored legends
- [ ] Color-coded by category (role=blue, mode=green, etc.)
- [ ] Gradient across keys
- [ ] Custom per key

**RGB Lighting** (if using):
- [ ] Per-key RGB (full customization)
- [ ] Single color underglow
- [ ] Multi-zone underglow
- [ ] No RGB (clean, minimal)

**Accent colors**:
- Primary accent: _______________ (e.g., #00FF00 - matrix green)
- Secondary accent: _______________ (e.g., #FF00FF - neon pink)

### Specific Hex Codes

**If you have brand colors or preferences**:
- Background: `#______`
- Primary: `#______`
- Secondary: `#______`
- Accent: `#______`
- Text: `#______`

---

## Decision 5: Surface & Context

### Where does VibeDeck live?

**Desk surface**:
- [ ] Dark wood (classic developer desk)
- [ ] Light wood (Scandinavian minimal)
- [ ] Black desk mat
- [ ] White desk (clean studio)
- [ ] Metal/aluminum (industrial)
- [ ] Concrete (brutalist)

**What's around it**?:
- [ ] Mechanical keyboard (what kind? _______)
- [ ] Coffee cup (what style? _______)
- [ ] Monitor(s) in background (showing code/terminal)
- [ ] Notebook and pen
- [ ] Potted plant
- [ ] Other: _______________

**Environment**:
- [ ] Home office (warm, personal)
- [ ] Studio (clean, professional)
- [ ] Maker lab (tools, equipment visible)
- [ ] Minimal (just product and surface)

---

## Decision 6: Reference Images

### Collect Visual References

**Similar products to reference**:
- [ ] Elgato Stream Deck (link/image: _______)
- [ ] Mechanical keyboards (specific model: _______)
- [ ] Audio interfaces (link/image: _______)
- [ ] MIDI controllers (link/image: _______)
- [ ] Custom macro pads (link/image: _______)
- [ ] Other: _______________

**Aesthetic inspiration**:
- [ ] Product photography examples (link: _______)
- [ ] Color schemes you like (link: _______)
- [ ] Form factors that work (link: _______)

**Action**: Drop links or save images to `data/nano-banana/examples/references/`

---

## Decision 7: Key Features to Highlight

### What makes VibeDeck special?

**Top 3 features for hero shot**:
1. _______________
2. _______________
3. _______________

**Feature detail shots needed**:
- [ ] Button layout close-up
- [ ] RGB lighting effects
- [ ] OLED display showing mode
- [ ] Connection ports (USB-C)
- [ ] 3D printed texture/quality
- [ ] Ergonomic angle/profile
- [ ] Size comparison (hand, keyboard)
- [ ] Other: _______________

---

## Decision 8: Kickstarter Narrative

### What story do the images tell?

**Problem** (what pain does VibeDeck solve?):
-
-

**Solution** (how does VibeDeck help?):
-
-

**Vision** (what future does it enable?):
-
-

**Before image concept**:
- Describe the "chaos" scene: _______________

**After image concept**:
- Describe the "clean workflow" scene: _______________

---

## Decision Summary

Once you've filled this in, summarize your key decisions:

**Form factor**: _______________
**Layout**: _______________ keys, _______________ arrangement
**Aesthetic**: _______________
**Primary color**: _______________
**Accent color**: _______________
**Context**: _______________ desk with _______________
**Hero shot angle**: _______________
**Mood/vibe**: _______________

---

## Next Steps After Completing This

1. Collect reference images → `examples/references/` folder
2. Optional: Sketch button layout on paper, take photo
3. Update `vibe-deck-product-concept.md` with finalized decisions
4. Move to **Step 2**: Generate first image with Nano Banana Pro
5. Iterate based on what works

---

**Last Updated**: 2026-01-12
**Status**: Working draft - fill in as you research
