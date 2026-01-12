# Nano Banana Product Photography Workflow

**For**: Jan
**From**: David + Claude
**Date**: 2026-01-12

---

## What's in This Folder

This folder contains everything you need to test the Nano Banana Pro JSON prompting workflow using Claude Code.

**Files:**
1. `README.md` - You are here (instructions)
2. `agent-nano-banana-product-photography.md` - The agent (controller)
3. `template-product-photography.json` - JSON template (view)
4. `input-simple.txt` - Simple test input ("quick brown fox")
5. `input-complex.txt` - Complex test input (human-readable VibeDeck prompt)
6. `output-vibedeck-example.json` - Complete VibeDeck JSON (ready to paste into Nano Banana)

---

## Quick Test: Does Nano Banana Work?

**Test the complete VibeDeck JSON first** to verify your Nano Banana setup works:

1. Open `output-vibedeck-example.json`
2. Copy the entire JSON
3. Paste into Nano Banana Pro (via Kai, Fal, or Google AI Studio)
4. Generate image

**Expected result**: Professional product shot of VibeDeck controller with dark gray housing, cyan blue backlighting, matrix green display, on dark wood desk.

If this works, you're ready for the agent workflow!

---

## Agent Workflow: Generate JSON from Natural Language

### Step 1: Load the Agent

In Claude Code, paste this command:

```
Load the Nano Banana Product Photography Agent from:
/Users/davidcruwys/dev/ad/poem-os/poem/data/nano-banana/jan/agent-nano-banana-product-photography.md

You are now the Nano Banana Product Photography Agent. Read your instructions and await my input.
```

**What happens:**
- Agent loads and reads the template automatically
- Agent asks: "What would you like me to visualize today?"

### Step 2: Provide Input (Simple Test)

Copy the contents of `input-simple.txt` and paste it:

```
The quick brown fox jumps over the lazy dog
```

**What the agent does:**
- Takes your simple input
- Applies it to the product photography template
- Generates complete JSON with proper lighting, composition, camera settings, etc.
- Outputs JSON you can copy

### Step 3: Copy JSON and Generate Image

1. Copy the JSON the agent produced
2. Paste into Nano Banana Pro
3. Generate image

**Expected result**: Beautiful, professionally lit photo of a quick brown fox jumping over a lazy dog.

### Step 4: Test with Complex Input

Reload the agent and this time use `input-complex.txt`:

```
Load the Nano Banana Product Photography Agent again. I want to generate a product shot based on this description:

[paste contents of input-complex.txt]
```

**What the agent does:**
- Takes your detailed VibeDeck description
- Applies it to the template
- Generates complete JSON (should match `output-vibedeck-example.json` closely)

### Step 5: Compare Outputs

Compare the agent's output with `output-vibedeck-example.json`:
- Are all the handles present?
- Does it have proper lighting structure?
- Does it capture the VibeDeck design details?

If yes, the agent workflow is working!

---

## Using Your Own Prompts

Once you've tested with the provided inputs, try your own:

```
Load the Nano Banana Product Photography Agent.

I want to visualize: [your description here]
```

**Examples:**
- "A steaming cup of coffee on a wooden table with morning light"
- "A futuristic smartwatch with holographic display in a tech lab"
- "An open MacBook Pro on a minimalist desk with plants in background"

The agent will generate complete JSON for any product photography scenario.

---

## Understanding the MVC Pattern

**Agent (Controller)** - `agent-nano-banana-product-photography.md`
- The brain that merges template + data
- Reads the template, understands the structure
- Takes your natural language input
- Generates complete JSON

**Template (View)** - `template-product-photography.json`
- JSON schema showing best practices
- All the "handles" for controlling the image
- Lighting, composition, camera, surface, props, effects
- Agent fills this in based on your input

**Data (Input)** - `input-simple.txt` or `input-complex.txt`
- What you want to visualize
- Natural language (not JSON)
- Agent converts this to structured JSON

**Output** - Complete JSON ready for Nano Banana
- Fully specified product photography prompt
- Can be pasted directly into Nano Banana Pro

---

## Troubleshooting

**Agent doesn't load:**
- Make sure you're in Claude Code (Sonnet 4.5 or Opus 4.5)
- Copy the exact load command from Step 1
- If using $20 plan, you have enough tokens for this

**JSON has errors:**
- Validate JSON syntax (use JSONLint or similar)
- Check for missing commas, brackets
- Agent should produce valid JSON, but sometimes needs a retry

**Nano Banana doesn't produce good image:**
- Check if JSON has all required fields (task, output_format, etc.)
- Verify hex codes for colors are valid
- Try simplifying the prompt first, then add complexity

**Image doesn't match your vision:**
- Use handles to iterate: Identify what's wrong (e.g., "lighting too flat")
- Tell the agent: "Regenerate but make lighting more dramatic"
- Agent will update specific handles while preserving the rest

---

## Next Steps

After testing this workflow:

1. **Create your own templates** - Product photography is just one use case. Try UI mockups, infographics, etc.
2. **Customize the agent** - Modify the agent to specialize in your domain (e.g., "Food Photography Agent", "Tech UI Agent")
3. **Build a library** - Save successful JSONs and create a library of reusable templates
4. **Integrate with POEM** - This workflow can be integrated into POEM OS for systematic prompt management

---

## Questions?

Ping David or check the reference docs in the parent directory:
- `../reference/nano-banana-json-prompting.md` - Core concepts
- `../reference/nano-banana-api-implementation.md` - API details

---

**Have fun generating beautiful images!** 🎨🚀
