# VibeDeck - Design Decisions Worksheet

**Purpose**: Make concrete design decisions before generating images
**Status**: ✅ COMPLETED based on concept renders (2026-01-12)

---

## Decision 1: Form Factor

### Your Decision

**Primary form factor**: **Custom Horizontal Layout (10-12 buttons + analog controls)**

**Reasoning**:
- Not a traditional grid—horizontal layout optimized for workflow
- Integrated OLED/LED display at top (4-5" wide × 1" tall)
- ~10-12 buttons arranged in 3 functional rows
- 2 analog controls: rotary encoder (right side) + toggle switch (left side)
- Approximate dimensions: 8-10" wide × 3-4" tall × 1-2" deep
- Compact enough for desk space, distinctive enough to stand out
- Display differentiates from Stream Deck (which uses LCD buttons)

**Backup option**: Modular version (base unit with display + optional button expansions)

---

## Decision 2: Button Layout & Labels

### Your Layout Decision

**Actual layout from renders**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  [=====  OLED DISPLAY: Task/Model/Progress/Status  =====]          │
│                                                                     │
│  [Toggle]  [ACCEPT ]  [APPROVE]  [ YOLO  ]  [Rotary]  [ENTER]     │
│  MODEL     CHANGES    ACTION      MODE                  [CHAT ]     │
│  HI/LOW                                                             │
│                                                                     │
│            [==========  SUGGEST NEXT PROMPT  ==========]            │
│                                                                     │
│  [DISCARD]  [RETRY ]  [  🎤  ]                                     │
│                       VOICE                                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Button labels** (from renders):

**Row 0 (Display row)**:
- OLED Display showing: "TASK: CODE REFACTOR - PROGRESS: 60%" / "MODEL: CLAUDE OPUS 4.5 - SUBSCRIPTION: 95%"
- Alternative: "prismor.dev" (customizable branding)
- Alternative: Terminal interface (Claude Code welcome screen)

**Row 1 (Top action row)**:
- MODEL HIGH/LOW (toggle switch, left side)
- ACCEPT CHANGES (checkmark icon)
- APPROVE ACTION (thumbs up icon)
- YOLO MODE (salmon/red, icon: ⚡ or 🔥)
- MODEL SWITCHER (rotary encoder, right side)
- ENTER
- OPEN CHAT

**Row 2 (Middle - primary action)**:
- SUGGEST NEXT PROMPT (long button spanning most of width)

**Row 3 (Bottom - utility)**:
- DISCARD
- RETRY
- 🎤 (microphone/voice input)
- (Additional space for future buttons or branding)

**Color coding scheme**:
- Critical actions (YOLO MODE): Red/salmon (#FF6B6B or #FF5252)
- Accept/Approve: Blue backlight (#4A9EFF or #64B5F6)
- Neutral actions (DISCARD, RETRY): White/gray backlight
- Voice/utility: Cyan or purple (#00E5FF or #B388FF)
- Display text: Matrix green (#00FF00) on black background

---

## Decision 3: Visual Aesthetic

### Your Aesthetic Choice

**Primary aesthetic**: **Premium Studio Gear** (Option D)

**Secondary influence**: **Retro-Tech Nostalgia** (coiled cable, terminal font, industrial touches)

**Describe the overall vibe you want**:
- Professional tool, not a gaming peripheral
- Brushed aluminum or high-quality ABS plastic housing (gunmetal/dark gray)
- Reminiscent of audio interfaces (Focusrite, Universal Audio) or high-end MIDI controllers
- Retro computing callbacks: coiled cable (like old phone cords), terminal-style display font
- Subtle RGB accents (not gamer RGB rainbow)
- Clean industrial design language—utilitarian beauty
- "This is expensive but worth it" positioning

**Alternate aesthetic shown**: Industrial Maker (weathered/rusted version for special edition or marketing imagery)

---

## Decision 4: Color Scheme

### Primary Device Colors

**Enclosure color**:
- [X] Dark gray (charcoal/gunmetal) - PRIMARY
- [ ] Matte black - Secondary option
- [X] White/cream - Premium variant (shown in AJAZZ reference)
- [ ] Weathered metal/rust - Marketing/special edition only

**Key cap colors**:
- [X] Black keys, colored legends (white text)
- [X] Custom per key (YOLO MODE is red/salmon, different from others)
- RGB backlighting shines through or around keycaps

**RGB Lighting**:
- [X] Per-key RGB (full customization) - Most buttons have blue/cyan backlight by default
- [X] Single button exception: YOLO MODE (red/salmon backlight)
- Underglow possible (see modular key reference with blue underglow)

**Accent colors**:
- Primary accent: **#00FF00 (Matrix green)** - Display text
- Secondary accent: **#4A9EFF (Cyan blue)** - Button backlighting
- Danger accent: **#FF5252 (Salmon red)** - YOLO MODE

### Specific Hex Codes

**Brand colors**:
- Housing: `#4A4A4A` (dark gray/gunmetal)
- Display background: `#000000` (pure black)
- Display text: `#00FF00` (matrix green)
- Button backlight (default): `#4A9EFF` (cyan blue)
- YOLO MODE: `#FF5252` (salmon red)
- Button legends: `#FFFFFF` (white)
- Surface (desk): `#3E2723` (dark wood brown)

---

## Decision 5: Surface & Context

### Where does VibeDeck live?

**Desk surface**:
- [X] Dark wood (classic developer desk) - PRIMARY context
- [ ] Weathered metal (industrial) - Marketing variant only

**What's around it**?:
- [X] Mechanical keyboard (partially visible, dark keycaps)
- [X] Coiled cable connecting to VibeDeck (retro aesthetic)
- [ ] Coffee cup - Could add for lifestyle shots
- [ ] Monitor(s) in background (showing code/terminal) - YES for in-use shots
- [ ] Notebook and pen - Optional for "brainstorming" context
- [ ] Potted plant - No (keep it tech-focused)
- [X] Other: Smartphone in some renders (showing mobile app version)

**Environment**:
- [X] Home office (warm, personal) - PRIMARY
- [ ] Studio (clean, professional) - Secondary option
- [ ] Maker lab (tools, equipment visible) - Marketing variant (weathered version)
- [X] Minimal (just product and surface) - Hero shots

---

## Decision 6: Reference Images

### Collect Visual References

**Similar products to reference**:
- [X] Elgato Stream Deck - HAVE reference images (Image 2: XL with developer icons)
- [X] Custom macro pads - HAVE reference (Image 4: modular single key with underglow)
- [X] AJAZZ mini deck - HAVE reference (Image 3: white/cream housing, clean aesthetic)
- [ ] Audio interfaces - Need to find (Focusrite Scarlett, Universal Audio)
- [ ] MIDI controllers - Need to find (AKAI MPC, Native Instruments Maschine)

**Aesthetic inspiration**:
- [X] Product photography examples - HAVE (Images 1, 5, 6: various angles and lighting)
- [X] Weathered/industrial - HAVE (Image 8: rusted version for comparison)
- [X] Mobile UI mockup - HAVE (Image 9: phone app version)
- [X] Skeuomorphic UI design - HAVE (Image 7: P-BOT MODULATOR interface)

**Action**: ✅ COMPLETED - All key references analyzed in `visual-analysis.md`

---

## Decision 7: Key Features to Highlight

### What makes VibeDeck special?

**Top 3 features for hero shot**:
1. **YOLO MODE Button** - The iconic red button (signature feature, instantly recognizable)
2. **Integrated OLED Display** - Shows task/model/progress in real-time (differentiator vs Stream Deck)
3. **Physical Controls** - Rotary encoder + toggle switch (not just buttons)

**Feature detail shots needed**:
- [X] Button layout close-up (especially YOLO MODE button with red glow)
- [X] OLED display showing mode (various states: task progress, branding, terminal)
- [X] RGB lighting effects (blue underglow, per-key backlighting)
- [ ] Connection ports (USB-C with coiled cable)
- [ ] 3D printed texture/quality (if 3D printed) OR machined aluminum finish
- [X] Ergonomic angle/profile (slight rear tilt visible in renders)
- [ ] Size comparison (hand, keyboard, coffee cup for scale)
- [X] Rotary encoder detail (brushed metal, knurled texture)
- [X] Toggle switch detail (tactile, satisfying)
- [X] Coiled cable close-up (retro aesthetic element)

---

## Decision 8: Kickstarter Narrative

### What story do the images tell?

**Problem** (what pain does VibeDeck solve?):
- Vibe coders juggle multiple Claude windows, constantly copy/pasting context between PO and Dev
- Switching between roles, models, and prompts is tedious and breaks flow
- No physical interface optimized for AI-assisted development workflows
- Generic stream decks require constant reconfiguration and don't understand vibe coding patterns

**Solution** (how does VibeDeck help?):
- Dedicated hardware controller designed specifically for Claude/AI coding workflows
- One-button role switching (PO → Dev → QA)
- Model selection via rotary encoder (Opus ↔ Sonnet ↔ Haiku)
- Display shows current task, model, progress—no guessing
- "YOLO MODE" for "ship it" moments (accept changes without overthinking)
- "SUGGEST NEXT PROMPT" AI-powered workflow assistance
- Voice input for natural prompt refinement

**Vision** (what future does it enable?):
- AI-assisted development becomes as natural as using a keyboard
- Physical controls bring tactile satisfaction to software workflows
- Vibe coding evolves from "hacky workflow" to "professional practice"
- Hardware + software co-evolution (like MIDI did for music production)
- Community shares button configurations, prompts, workflows (ecosystem)

**Before image concept**:
- Developer hunched over laptop, multiple terminal windows, messy tabs, sticky notes everywhere
- Copy/pasting between Claude windows, losing context
- "Which window is my PO? Which is my Dev?"
- Frustrated, overwhelmed, constant context switching

**After image concept**:
- Clean desk setup: VibeDeck front and center, coiled cable, single monitor
- Developer confidently pressing YOLO MODE button, code flows smoothly
- Display shows: "TASK: CODE REFACTOR - PROGRESS: 60%" (transparency, confidence)
- Calm, focused, in flow state
- "This is how AI development should feel"

---

## Decision Summary

**Form factor**: Custom horizontal controller with integrated display, 10-12 buttons + 2 analog controls

**Layout**: 3 functional rows + top display (8-10" wide × 3-4" tall)

**Aesthetic**: Premium Studio Gear with Retro-Tech elements (brushed metal, coiled cable, terminal font)

**Primary color**: Dark gray/gunmetal housing (#4A4A4A)

**Accent colors**: Matrix green display (#00FF00), cyan blue backlighting (#4A9EFF), salmon red YOLO MODE (#FF5252)

**Context**: Dark wood developer desk with mechanical keyboard, home office environment

**Hero shot angle**: 3/4 view from slightly above (shows display + button layout + coiled cable)

**Mood/vibe**: "Professional tool for serious vibe coders—retro charm meets modern AI workflows"

---

## Additional Design Details from Renders

### Physical Materials & Finish
- **Housing**: Brushed aluminum or high-quality ABS plastic (matte finish)
- **Button caps**: PBT plastic (durable, non-shiny) or double-shot ABS
- **Display**: OLED (deep blacks, green text for retro aesthetic)
- **Rotary encoder**: Metal (brushed/knurled finish)
- **Toggle switch**: Metal or high-quality plastic (tactile snap)
- **Base**: Rubber feet or weighted base (stability)
- **Cable**: Coiled USB-C (retro telephone cord aesthetic, 5-6 feet extended)

### Dimensions (Estimated from renders)
- **Width**: 8-10 inches (200-250mm)
- **Depth**: 3-4 inches (75-100mm)
- **Height**: 1-2 inches at front, 2-3 inches at rear (angled for ergonomics)
- **Weight**: 1-2 lbs (substantial, premium feel)

### Display Specifications
- **Size**: ~4-5" wide × 0.75-1" tall (128×32 or 256×64 OLED)
- **Font**: Monospace/terminal style (Courier New, Monaco, or custom pixel font)
- **Content**: 2-3 lines of text
  - Line 1: TASK: [current task] - PROGRESS: [percentage]
  - Line 2: MODEL: [model name] - SUBSCRIPTION: [usage]
  - Alternative: Custom branding, domain name, workflow state

### Button Specifications
- **Type**: Mechanical keyboard switches (Cherry MX or Kailh)
- **Travel**: 3-4mm (tactile feedback)
- **Actuation force**: Medium (50-60g)
- **Backlighting**: Per-key RGB LED (addressable, customizable)
- **Long button** (SUGGEST NEXT PROMPT): 2× or 3× standard button width (2u or 3u keycap)

### Connectivity & Power
- **Connection**: USB-C (data + power)
- **Cable**: Detachable? (TBD—renders show permanent coiled cable)
- **Power draw**: <5W (USB powered, no external power supply)
- **Compatibility**: Windows, Mac, Linux (HID device, no drivers needed)

---

## Variants & SKUs (Potential)

### Standard Edition
- Dark gray housing
- Blue backlit buttons (except YOLO MODE)
- Coiled cable included
- Price: $149-$199

### Premium Edition
- White/cream housing (AJAZZ-style)
- Per-key RGB (full customization)
- Aluminum rotary encoder
- Detachable braided cable
- Price: $249-$299

### Maker Edition
- Transparent housing (see internals)
- Open-source firmware
- Expansion headers
- DIY kit option
- Price: $99-$149 (kit), $179-$229 (assembled)

### Special Edition: "Weathered"
- Rust/weathered texture (marketing only?)
- Industrial aesthetic
- Collector's item
- Price: $299-$349 (limited run)

---

## Next Steps After Completing This

1. ✅ Collect reference images → COMPLETED (renders analyzed)
2. ⏳ Optional: Create detailed button layout diagram (vector/CAD)
3. ⏳ Update `vibe-deck-product-concept.md` with finalized decisions
4. ⏳ Define functional specs (what does each button actually DO?)
5. ➡️ Move to **Step 2**: Generate Nano Banana Pro images based on these specs
6. ⏳ Iterate based on generated results

---

**Last Updated**: 2026-01-12
**Status**: ✅ COMPLETE - Ready for image generation
**Next**: Create Nano Banana JSON prompts based on these decisions
