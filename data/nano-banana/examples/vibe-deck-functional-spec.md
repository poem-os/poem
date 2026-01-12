# VibeDeck - Functional Specification

**Version**: 1.0
**Date**: 2026-01-12
**Status**: Draft - Ready for Review

---

## Overview

VibeDeck is a hardware controller designed specifically for AI-assisted development (vibe coding) workflows. It uses a **context-switching rotary encoder system** to provide access to 60+ functions through 6 contexts, combined with always-available standalone buttons for frequent actions.

**Core Innovation**: Instead of fixed-function buttons (like Stream Deck), VibeDeck uses context buttons that change what the rotary encoder controls, enabling deep functionality in a compact form factor.

---

## Physical Layout

```
┌─────────────────────────────────────────────────────┐
│   [======  LED DISPLAY: Context | Selection  ======] │
│                                                     │
│              [CTX 1]     [CTX 2]                    │
│                   \       /                         │
│        [CTX 6]--   ⦿   --[CTX 3]   (rotary dial)   │
│                   /       \                         │
│              [CTX 5]     [CTX 4]                    │
│                                                     │
│    [YES]  [NO]  [OTHER]  [🎤]  [SEND]  [CHAT]     │
└─────────────────────────────────────────────────────┘
```

**Physical dimensions**: 8-10" wide × 3-4" deep × 1.5-2.5" tall
**Weight**: 1-2 lbs (weighted base for stability)

---

## Component Specifications

### LED Display
- **Type**: OLED (128×64 or 256×64 pixels)
- **Size**: 4-5" wide × 1" tall
- **Font**: Monospace terminal font (Monaco, Courier New, or custom pixel font)
- **Colors**: Matrix green text (#00FF00) on black background (#000000)
- **Content**: 2 lines
  - Line 1: `[CONTEXT NAME]`
  - Line 2: `[CURRENT SELECTION]`
- **Examples**:
  ```
  MODEL
  Claude Opus 4.5
  ```
  ```
  COMMAND
  /commit
  ```
  ```
  AGENT
  Bob (Scrum Master)
  ```

### Rotary Encoder
- **Type**: Mechanical rotary encoder with push button
- **Material**: Brushed aluminum with knurled texture
- **Rotation**: Infinite rotation with detents (tactile clicks)
- **Press**: Center push button (tactile feedback, 50-60g actuation)
- **Rotation speed**: 24 detents per revolution (15° per click)
- **Backlighting**: RGB underglow (context-dependent color)

### Context Buttons (6 buttons)
- **Arrangement**: Hexagonal pattern around rotary encoder
- **Type**: Mechanical switches (Cherry MX or Kailh)
- **Keycaps**: 1u size, low-profile
- **Backlighting**: Per-key RGB LED (shows active context)
- **Labels**: Printed legends (white text)
- **Spacing**: ~1.5" from rotary center

### Standalone Buttons (6 buttons)
- **Arrangement**: Single row at bottom
- **Type**: Mechanical switches (Cherry MX or Kailh)
- **Keycaps**: 1u size (YES/NO/OTHER/SEND/CHAT), 1.5u size (VOICE)
- **Backlighting**: Per-key RGB LED
  - YES: Green (#4CAF50)
  - NO: Red (#F44336)
  - OTHER: Orange/amber (#FF9800)
  - VOICE: Cyan (#00E5FF)
  - SEND: Blue (#2196F3)
  - CHAT: Purple (#9C27B0)

### Connectivity
- **Connection**: USB-C (data + power)
- **Cable**: Detachable coiled cable (5-6 feet extended, telephone cord style)
- **Power**: USB bus-powered (<5W, no external power supply)
- **Protocol**: HID device (no drivers required)
- **Compatibility**: Windows, Mac, Linux

---

## Context System

### How Contexts Work

1. **Press a context button** → Switches the rotary encoder's function
2. **Rotate the encoder** → Cycles through available options within that context
3. **Display updates** → Shows context name and current selection
4. **Context button lights up** → Visual indicator of active context
5. **Press encoder (if action command)** → Executes the selected command

### Context Types

**State Context** - Selection is immediate (no press required)
- Rotating the encoder changes the active state
- Example: Rotating through models immediately switches to that model

**Action Context** - Selection requires confirmation (press to execute)
- Rotating the encoder previews the command
- Pressing the encoder executes the command
- Example: Rotating to `/commit`, then pressing to execute

---

## Context Button Definitions

### Context 1: MODELS (State)

**Purpose**: Select which Claude model to use

**Display format**:
```
MODEL
Claude Opus 4.5
```

**Rotary behavior**:
- **Rotate clockwise**: Next model in list
- **Rotate counter-clockwise**: Previous model in list
- **Press**: Not required (state changes immediately on rotation)

**Available selections** (example list, user-configurable):
1. Claude Opus 4.5
2. Claude Sonnet 4.5
3. Claude Haiku 4.0
4. Claude Sonnet 3.5
5. GPT-4o (if multi-model support)
6. Custom model endpoint

**Visual feedback**:
- Context button: Solid blue when active
- Rotary underglow: Blue
- Display: Updates in real-time as you rotate

**Use case**: "I'm prototyping, switch to Haiku for speed" → Press MODELS button, rotate to Haiku, done.

---

### Context 2: PROJECTS (State)

**Purpose**: Switch between active projects/workspaces

**Display format**:
```
PROJECT
SupportSignal App
```

**Rotary behavior**:
- **Rotate**: Cycle through projects
- **Press**: Not required (switches immediately)

**Available selections** (user-configured from shell aliases or config):
1. SupportSignal App (jss-app)
2. VOZ Projects (jvoz-projects)
3. POEM OS (jpoem)
4. FliVideo (jfli)
5. Storyline App (jstory)
6. Beauty & Joy (jjoy-app)
7. AppyDave Tools (jad-tools)

**Integration**:
- Changes working directory in Claude Code
- Could trigger project-specific configurations (model defaults, prompt templates, etc.)

**Visual feedback**:
- Context button: Solid green when active
- Rotary underglow: Green
- Display: Shows project name

**Use case**: "Finished with SupportSignal, switching to POEM work" → Press PROJECTS, rotate to POEM OS, done.

---

### Context 3: BMAD AGENTS (State)

**Purpose**: Load BMAD Method agents for structured development workflow

**Display format**:
```
AGENT
Bob (Scrum Master)
```

**Rotary behavior**:
- **Rotate**: Cycle through agents
- **Press**: Optional (could press to load agent immediately, or auto-load on rotation)

**Available selections**:
1. Bob (Scrum Master) - `/BMad/agents/sm`
2. Sarah (Business Analyst) - `/BMad/agents/analyst`
3. James (Developer) - `/BMad/agents/dev`
4. Quinn (QA/Test Architect) - `/BMad/agents/qa`
5. Taylor (Architect) - `/BMad/agents/architect`
6. Morgan (Product Owner) - `/BMad/agents/po`
7. Alex (Product Manager) - `/BMad/agents/pm`
8. Jordan (UX Expert) - `/BMad/agents/ux-expert`

**Visual feedback**:
- Context button: Solid purple when active
- Rotary underglow: Purple (agent-specific colors possible)
- Display: Shows agent name and role

**Use case**: "Story approved, time to implement" → Press AGENTS, rotate to James (Dev), press to load, then use dev commands.

---

### Context 4: CLAUDE COMMANDS (Action)

**Purpose**: Execute Claude Code slash commands

**Display format**:
```
COMMAND
/commit
```

**Rotary behavior**:
- **Rotate**: Preview available commands
- **Press**: **Execute the selected command**

**Available selections** (common Claude slash commands):
1. `/commit` - Stage and commit changes
2. `/push` - Commit and push to remote
3. `/revert` - Revert all changes
4. `/rewind` - Undo recent changes
5. `/review-pr` - Review pull request
6. `/brain-bridge` - Save conversation to second brain
7. `/improve` - Review and improve conversation

**Visual feedback**:
- Context button: Solid cyan when active
- Rotary underglow: Cyan (changes to yellow when command is selected but not executed)
- Display: Shows command name
- When pressed: Brief flash (green if success, red if error), display shows "EXECUTING..."

**Use case**: "Code looks good, commit it" → Press COMMANDS, rotate to `/commit`, press encoder to execute.

---

### Context 5: CUSTOM COMMANDS (Action)

**Purpose**: User-defined shortcuts and macros

**Display format**:
```
CUSTOM
Save Context
```

**Rotary behavior**:
- **Rotate**: Preview custom commands
- **Press**: **Execute the selected command**

**Available selections** (user-configurable):
1. Save Context - Save current workspace state
2. Load Context - Restore saved state
3. Clear History - Clear conversation history
4. Toggle Sandbox - Enable/disable sandbox mode
5. Screenshot - Capture current state
6. Export Logs - Save session logs
7. Quick Test - Run project tests
8. Build Project - Run build command

**Configuration**:
- Users define commands in config file or GUI
- Each command maps to shell script, Claude prompt, or API call

**Visual feedback**:
- Context button: Solid orange when active
- Rotary underglow: Orange (changes to yellow when ready to execute)

**Use case**: "Need to test this change" → Press CUSTOM, rotate to Quick Test, press to run tests.

---

### Context 6: WORKFLOW CONTROL (Mixed)

**Purpose**: Control BMAD workflow progression and state

**Display format**:
```
WORKFLOW
Next: James (Dev)
```

**Rotary behavior**:
- **Rotate**: Navigate workflow steps
- **Press**: Advance to selected step (if action) or just preview (if state)

**Available selections** (workflow-aware):
1. Start Workflow - Begin new story workflow
2. Next Agent - Advance to next agent in sequence
3. Previous Agent - Go back to previous agent
4. Skip Agent - Skip current agent (with confirmation)
5. End Workflow - Complete and close workflow
6. Workflow Status - Show current workflow state
7. Load Story - Select which story to work on

**Smart behavior**:
- Knows current workflow state (which agent you're on)
- "Next Agent" automatically loads correct agent (Bob → Sarah → James → Quinn)
- Disables invalid options (can't go to "Previous" if you're on first agent)

**Visual feedback**:
- Context button: Solid magenta when active
- Rotary underglow: Magenta
- Display shows current workflow position and next step

**Use case**: "Finished implementing story" → Press WORKFLOW, rotate to "Next Agent" (Quinn for QA), press to advance.

---

## Standalone Buttons (Always Active)

These buttons work **regardless of active context**. They represent the 80% most frequent actions in vibe coding workflows.

### Button 1: YES (Green)

**Primary function**: Accept, approve, confirm, continue

**LED color**: Green (#4CAF50)

**Behavior**:
- When Claude asks for approval → Sends "yes" response
- When reviewing code changes → Accepts changes
- When confirming action → Proceeds with action
- In workflow → Advances to next step
- General: Affirmative response to any prompt

**Visual feedback**:
- Briefly pulses brighter green when pressed
- If action successful, sustained glow for 0.5s

**Use case**: Claude asks "Should I proceed with these changes?" → Press YES.

---

### Button 2: NO (Red)

**Primary function**: Reject, decline, cancel, stop

**LED color**: Red (#F44336)

**Behavior**:
- When Claude proposes action → Declines action
- When reviewing code → Rejects changes
- When asked for approval → Sends "no" response
- In workflow → Cancels current operation
- General: Negative response to any prompt

**Visual feedback**:
- Briefly pulses brighter red when pressed
- If cancellation successful, sustained glow for 0.5s

**Use case**: Claude suggests deleting a file you need → Press NO.

---

### Button 3: OTHER (Orange)

**Primary function**: "Go down a different path", iterate, modify, need more info

**LED color**: Orange/Amber (#FF9800)

**Behavior**:
- When proposed action isn't quite right → "Try a different approach"
- When code changes need adjustment → "Close, but iterate"
- When you need clarification → "Explain more"
- When workflow needs branching → "Let's explore alternatives"
- Sends message: "I need something different" (opens prompt input for clarification)

**Visual feedback**:
- Briefly pulses brighter orange when pressed
- After press, activates voice input or text prompt for clarification

**Use case**: Claude implements feature but you want different architecture → Press OTHER, then explain via voice or text.

---

### Button 4: VOICE (Cyan, 1.5u wide)

**Primary function**: Hold-to-talk voice input for prompts

**LED color**: Cyan (#00E5FF)

**Behavior**:
- **Hold down**: Activates microphone, starts recording
- **While held**: LED pulses to indicate recording active
- **Release**: Stops recording, transcribes audio to text, sends as prompt
- **Double-press**: Toggle voice mode (hands-free, voice-activated)

**Audio processing**:
- Real-time voice-to-text transcription
- Uses system microphone or built-in mic (Pro edition)
- Displays waveform or "RECORDING..." on LED display while active

**Visual feedback**:
- Not pressed: Solid cyan
- Held down: Pulsing cyan (breathing effect)
- Processing: Rapid cyan blink
- Transcription complete: Brief green flash

**Use case**: Want to describe a complex feature → Hold VOICE, speak naturally, release, Claude receives transcribed prompt.

---

### Button 5: SEND (Blue)

**Primary function**: Submit current prompt (equivalent to pressing Enter)

**LED color**: Blue (#2196F3)

**Behavior**:
- Submits typed or voice-transcribed prompt to Claude
- If no prompt is active, sends "continue" or "proceed"
- In workflow mode, could auto-advance to next step after sending

**Visual feedback**:
- Briefly pulses brighter blue when pressed
- While Claude is processing, slow blue pulse
- When response received, brief green flash

**Use case**: Typed a complex prompt, ready to send → Press SEND instead of reaching for keyboard Enter.

---

### Button 6: CHAT (Purple)

**Primary function**: Open Claude Code interface or switch to freeform chat mode

**LED color**: Purple (#9C27B0)

**Behavior**:
- **Single press**: Open or focus Claude Code window/terminal
- **Double press**: Toggle between workflow mode and freeform chat mode
- **Hold (2s)**: Open chat history or conversation management

**Modes**:
- **Workflow mode**: Structured BMAD agent interactions, guided prompts
- **Freeform mode**: Open conversation with Claude, no structure

**Visual feedback**:
- Not in chat: Dim purple
- Chat window focused: Bright purple
- Freeform mode active: Pulsing purple

**Use case**: Working in IDE, need to ask Claude a quick question → Press CHAT, window pops up, type question.

---

## Rotary Encoder Behavior

### Physical Characteristics
- **Rotation**: Infinite (no stops), detented (24 clicks per revolution)
- **Press**: Center push button, tactile click
- **Force**: Light rotation (<50g), medium press (50-60g)
- **Feedback**: Audible click on each detent, louder click on press

### Rotation Behavior (State Contexts)

**When context is state-based** (MODELS, PROJECTS, AGENTS):
- Each rotation click moves to next/previous item in list
- Selection is immediate (no press required)
- Display updates in real-time
- Wraps around (last item → first item when rotating past end)
- Fast rotation (multiple clicks quickly) accelerates scrolling

**Example**:
```
MODELS context active
Rotate right 1 click → Opus → Sonnet
Rotate right 1 click → Sonnet → Haiku
Rotate right 1 click → Haiku → Opus (wraps)
```

### Rotation Behavior (Action Contexts)

**When context is action-based** (CLAUDE COMMANDS, CUSTOM COMMANDS):
- Each rotation click previews next/previous command
- Selection is **preview only** (not executed until pressed)
- Display shows command name and brief description (if space)
- Rotary underglow changes color when command is selected (yellow = ready to execute)
- Pressing encoder executes the command

**Example**:
```
CLAUDE COMMANDS context active
Rotate right → Display shows "/commit"
Rotate right → Display shows "/push"
Press encoder → Executes "/push" command
```

### Press Behavior

**State contexts** (MODELS, PROJECTS, AGENTS):
- Press is **optional** or could force-load the selection
- Most state changes happen on rotation alone

**Action contexts** (COMMANDS, CUSTOM, some WORKFLOW options):
- Press **executes** the selected command
- Brief visual confirmation (flash, display shows "EXECUTING...")
- If command fails, shows error on display (red flash)

**Special cases**:
- Press while no context active → Could open menu or settings
- Hold press (2s) → Could lock the rotary (prevent accidental changes)

---

## LED Display Behavior

### Always Shows 2 Lines

**Line 1**: Context name (current active context)
**Line 2**: Current selection or device state

### Display States

**Context active**:
```
MODEL
Claude Opus 4.5
```

**No context active** (idle state):
```
VIBEDECK READY
Press context button
```

**Command executing**:
```
COMMAND EXECUTING
/commit
```

**Command complete** (brief 1-2s display):
```
✓ COMMITTED
Ready for next
```

**Error state**:
```
✗ ERROR
Check Claude Code
```

**YOLO MODE active** (if implemented):
```
⚡ YOLO MODE ACTIVE
Auto-accept enabled
```

### Display Animations

- **Idle**: Slow breathing effect on text (fade in/out)
- **Selecting**: Text scrolls if too long for display
- **Executing**: Progress bar or spinner animation
- **Success**: Brief checkmark animation
- **Error**: Brief X animation with red background

---

## Context Button Visual Feedback

### LED States

**Inactive** (not selected):
- Dim white or off
- Faint underglow

**Active** (currently selected):
- Bright color (context-specific)
- Full brightness
- Rotary underglow matches context color

**Unavailable** (context disabled or invalid):
- Red dim glow
- If pressed, brief red flash and display shows "Not available"

### Color Mapping

| Context | Color | Hex Code |
|---------|-------|----------|
| MODELS | Blue | #2196F3 |
| PROJECTS | Green | #4CAF50 |
| AGENTS | Purple | #9C27B0 |
| CLAUDE COMMANDS | Cyan | #00E5FF |
| CUSTOM COMMANDS | Orange | #FF9800 |
| WORKFLOW | Magenta | #E91E63 |

---

## Advanced Features

### Context Memory

**Behavior**: Device remembers last selection in each context
- Switch to MODELS, select Haiku
- Switch to PROJECTS, work on SupportSignal
- Switch back to MODELS → Still shows Haiku (not reset to default)

**Persistence**: Saved to device memory, survives disconnection/reconnection

---

### Quick Context Switch

**Behavior**: Hold a context button for 2 seconds → Locks to that context
- Prevents accidental context changes
- Useful when making many selections within one context
- Press and hold again to unlock

---

### Multi-Press Shortcuts

**Standalone buttons can have multi-press shortcuts**:

**YES button**:
- Single press: Accept/yes
- Double press: Accept all (if multiple confirmations pending)

**VOICE button**:
- Single press (hold): Push-to-talk
- Double press: Toggle voice-activated mode (hands-free)

**CHAT button**:
- Single press: Open/focus Claude window
- Double press: Toggle workflow/freeform mode
- Hold 2s: Open chat history

---

### YOLO Mode (Optional Feature)

**Activation**: Could be:
- A standalone 7th button (if space allows)
- A long-press on YES button (hold 3s)
- A custom command in CUSTOM COMMANDS context

**Behavior when active**:
- All confirmations auto-accept (YES button not needed)
- Standalone buttons still work (NO can cancel, OTHER can iterate)
- Display shows "⚡ YOLO MODE ACTIVE" in red
- All button LEDs pulse red to indicate risky mode
- Auto-disables after N minutes (5-10 min) or manual toggle off

**Visual feedback**:
- All buttons pulse red slowly
- Display background changes to red
- Rotary underglow pulses red

**Use case**: Rapid prototyping session → Enable YOLO, Claude makes changes, you rotate through agents fast, no confirmations.

---

## Workflow Integration

### BMAD Workflow Example

**Scenario**: Implementing Story 3.8

1. **Start**: Press WORKFLOW context, rotate to "Start Workflow", press encoder
2. **Display shows**: `WORKFLOW | Bob (SM)`
3. **Write story**: Press AGENTS context, rotate to Bob, press encoder
4. **Bob loaded**: Work with Bob to draft story
5. **Story approved**: Press YES
6. **Display shows**: `WORKFLOW | Next: James (Dev)`
7. **Advance**: Press SEND or press encoder (auto-advances in workflow mode)
8. **James loaded**: Implement story with Dev agent
9. **Implementation complete**: Press YES
10. **Display shows**: `WORKFLOW | Next: Quinn (QA)`
11. **QA review**: Quinn reviews code, press YES when passes
12. **Workflow complete**: Display shows `✓ WORKFLOW COMPLETE | Story 3.8 done`

**Smart workflow features**:
- Device knows which agent you're on
- "Next Agent" automatically loads correct next agent
- Can skip agents (with confirmation)
- Can go back to previous agent if needed
- End workflow marks story complete

---

### Voice-Driven Development Example

**Scenario**: Implementing new feature using voice

1. **Hold VOICE button**: Start recording
2. **Speak**: "I need to add a new API endpoint for user authentication. It should accept username and password, validate against the database, and return a JWT token. Use bcrypt for password hashing."
3. **Release VOICE**: Transcription complete
4. **Press SEND**: Prompt sent to Claude
5. **Claude responds**: Shows implementation plan
6. **Press YES**: Approve plan, Claude implements
7. **Review code**: Claude shows changes
8. **Hold VOICE**: "The token expiration should be 24 hours, not 1 hour"
9. **Press SEND**: Claude updates code
10. **Press YES**: Accept changes
11. **Press COMMANDS context**: Rotate to `/commit`, press encoder
12. **Done**: Changes committed

---

## Device Modes

### Standard Mode (Default)

- All contexts available
- Standalone buttons work as described
- No restrictions

### Workflow Mode (BMAD)

- WORKFLOW context auto-activates
- AGENTS context knows workflow sequence
- SEND button advances workflow after confirmations
- YES/NO/OTHER buttons interact with current agent
- Device guides you through Bob → Sarah → James → Quinn flow

### Freeform Mode (Open Chat)

- All contexts available
- WORKFLOW context disabled (no structured workflow)
- AGENTS context loads agents but doesn't enforce sequence
- More flexible, less structured

**Toggle**: Double-press CHAT button to switch between Workflow and Freeform modes

---

## Configuration & Customization

### User Configuration File

**Location**: `~/.vibedeck/config.yaml` or device memory

**Configurable settings**:
```yaml
contexts:
  models:
    enabled: true
    options:
      - "Claude Opus 4.5"
      - "Claude Sonnet 4.5"
      - "Claude Haiku 4.0"
    default: "Claude Sonnet 4.5"

  projects:
    enabled: true
    options:
      - name: "SupportSignal"
        path: "/Users/david/dev/clients/supportsignal"
        alias: "jss-app"
      - name: "POEM OS"
        path: "/Users/david/dev/ad/poem-os/poem"
        alias: "jpoem"
    default: "POEM OS"

  custom_commands:
    - name: "Quick Test"
      command: "npm test"
      icon: "🧪"
    - name: "Build Project"
      command: "npm run build"
      icon: "🔨"

standalone_buttons:
  yes:
    color: "#4CAF50"
    double_press_action: "accept_all"
  voice:
    mic_source: "built-in"  # or "system"
    double_press_action: "toggle_voice_mode"

display:
  font: "Monaco"
  color: "#00FF00"
  brightness: 80  # 0-100
  idle_timeout: 30  # seconds

yolo_mode:
  enabled: true
  activation: "long_press_yes"  # or "custom_command" or "standalone_button"
  auto_disable_after: 600  # seconds (10 minutes)
```

### Companion App (Optional)

**Purpose**: GUI for configuration (alternative to YAML)

**Features**:
- Visual context editor (add/remove contexts)
- Button mapping customization
- LED color customization
- Firmware updates
- Usage statistics (which buttons pressed most, which contexts used)

**Platforms**: Web-based (Electron app) or native (macOS/Windows/Linux)

---

## Hardware Variants

### Standard Edition ($149-$199)

**Included**:
- VibeDeck controller
- 6 context buttons + 6 standalone buttons + rotary encoder
- OLED display
- USB-C detachable coiled cable (6 feet extended)
- No microphone (use your own)

**Target user**: Developers with existing mic setup (Blue Yeti, Shure SM7B, etc.)

**Use case**: "I have a great mic, just need the controller"

---

### Pro Edition ($249-$299)

**Included**:
- Everything in Standard Edition
- **Built-in gooseneck microphone** (6-8" flexible arm, cardioid pattern)
- Mic mute button (on mic capsule or near base)
- Upgraded rotary encoder (metal knurled knob)
- Per-key RGB customization (software control)

**Target user**: Developers who want all-in-one solution

**Use case**: "This is my command center, one device for everything"

**Microphone specs**:
- Gooseneck: 6-8" flexible arm (adjustable positioning)
- Capsule: Cardioid condenser mic (focused pickup, reduces background noise)
- Frequency response: 50Hz-16kHz (optimized for voice)
- Connection: Internal (feeds through USB-C connection)
- Mute: Physical button on mic or near base (LED indicator on mic)

---

## Technical Implementation Notes

### Firmware

**Microcontroller**: RP2040, STM32, or similar
- Handles button presses, rotary encoder, LED control
- USB HID device (no custom drivers)
- Sends keystrokes or HID commands to host computer

**Communication protocol**:
- USB HID keyboard + mouse + custom HID
- Buttons can send:
  - Keystrokes (e.g., YES sends Y key with modifier)
  - HID commands (multimedia keys, etc.)
  - Custom HID reports (for companion app integration)

### Software Integration

**Claude Code Integration**:
- VibeDeck sends keystrokes or HID commands
- Claude Code receives inputs and responds
- Could have native VibeDeck plugin (reads device state, sends commands directly)

**Configuration**:
- Device stores config in EEPROM or flash memory
- Companion app or YAML file syncs to device
- Over-the-air firmware updates via USB

---

## Use Cases Summary

### Use Case 1: Rapid Model Switching
**Scenario**: Prototyping with Haiku, need Opus for complex logic
**Flow**: Press MODELS → Rotate to Opus → Done (auto-switches)

### Use Case 2: Voice-Driven Development
**Scenario**: Hands-free coding while whiteboarding
**Flow**: Double-press VOICE (hands-free mode) → Speak prompts → Say "yes" / "no" → Code flows

### Use Case 3: BMAD Workflow Execution
**Scenario**: Implementing Story 3.9 with Bob → James → Quinn
**Flow**: WORKFLOW → Start → Agents auto-advance → Press YES at each gate → Story complete

### Use Case 4: Quick Commits
**Scenario**: Made changes, ready to commit
**Flow**: Press COMMANDS → Rotate to `/commit` → Press encoder → Done

### Use Case 5: Multi-Project Context Switching
**Scenario**: Finished SupportSignal work, switching to POEM
**Flow**: Press PROJECTS → Rotate to POEM → Done (Claude Code changes directory, loads project)

---

## Open Questions / Future Decisions

### 1. YOLO Mode Placement
- [ ] Standalone 7th button (requires more space)
- [ ] Long-press YES button (hold 3s)
- [ ] Custom command (in CUSTOM COMMANDS context)
- [ ] **Decision needed**: Based on how important YOLO mode is

### 2. Rotary Press Behavior for State Contexts
- [ ] Press not required (state changes on rotation)
- [ ] Press required to confirm selection
- [ ] Press optional, provides force-confirm feedback
- [ ] **Decision needed**: User testing to determine preference

### 3. Context Count
- [ ] 6 contexts (hexagon layout, current design)
- [ ] 4 contexts (cardinal directions, simpler)
- [ ] 8 contexts (more power, more complexity)
- [ ] **Decision needed**: Balance power vs. learnability

### 4. Microphone Type (Pro Edition)
- [ ] Gooseneck flexible arm (current plan)
- [ ] Built-in mic array (no moving parts, like Amazon Echo)
- [ ] Detachable mic (USB or XLR, user can swap)
- [ ] **Decision needed**: Cost vs. quality vs. user preference

### 5. Companion App
- [ ] Required (all config through app)
- [ ] Optional (can edit YAML manually)
- [ ] Not needed (device has built-in config mode)
- [ ] **Decision needed**: Balance ease-of-use vs. simplicity

### 6. Workflow Auto-Advance
- [ ] SEND button auto-advances workflow after YES
- [ ] Manual advance (must explicitly select "Next Agent")
- [ ] Configurable (user chooses behavior)
- [ ] **Decision needed**: User testing to determine preference

---

## Next Steps

1. **Review this functional spec** - Validate all behaviors make sense
2. **Prioritize open questions** - Make decisions on YOLO mode, rotary press, etc.
3. **Create button behavior document** - Detailed state machine for each button
4. **Design visual feedback spec** - Exact LED patterns, animations, display states
5. **Use Penny to create Nano Banana prompts** - Generate product images based on this spec
6. **Prototype firmware** - Build basic version to test rotary + context switching
7. **User testing** - Validate assumptions with real vibe coders

---

**Document Version**: 1.0
**Last Updated**: 2026-01-12
**Status**: Draft - Ready for Review and Image Generation
**Next**: Define visual states → Create Penny prompts → Generate Nano Banana images
