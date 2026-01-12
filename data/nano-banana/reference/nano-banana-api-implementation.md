# Nano Banana Pro - API Implementation Guide

**Source**: Technical research from ChatGPT (2026-01-12)
**Purpose**: Technical implementation details for using Nano Banana Pro via API

---

## API Access and Authentication

### Getting Started
- **Platform**: Google Gemini API (part of Google AI's developer offerings)
- **API Key**: Obtain via Google AI Studio or Cloud console
- **Model Names**:
  - `gemini-3-pro-image` (current)
  - `gemini-2.5-flash-image-preview` (earlier version)

### Authentication (Python SDK)
```python
import google.generativeai as genai
genai.configure(api_key="YOUR_API_KEY")
```

---

## Request Structure

### Basic Pattern (Python SDK)
```python
import json

# Construct your JSON prompt
prompt_json = {
    "task": "generate_image",
    "subject": {"type": "product", "name": "running shoe", "color": "red"},
    "style": {"primary": "studio photorealistic", "lighting": "softbox key light, fill light"},
    "environment": {"background": "solid white cyc wall"},
    "camera": {"angle": "eye-level", "lens": "85mm f/2.0"},
    "output_format": {"width": 1024, "height": 1024, "mime_type": "image/png"}
}

# Send to model
model = genai.GenerativeModel('gemini-3-pro-image')
response = model.generate_content([json.dumps(prompt_json)])
```

### Task Types
- `generate_image` - Create new image from scratch
- `edit_image` - Modify existing image (requires input image)
- `blend_images` - Combine multiple images

---

## Response Handling

### Extracting the Image (Python SDK)
```python
# Response structure: candidates → content → parts → inline_data
for part in response.candidates[0].content.parts:
    if hasattr(part, 'inline_data'):
        # Write image to file
        with open('output.png', 'wb') as f:
            f.write(part.inline_data.data)
```

### Response Fields
- `mime_type` - Image format (image/png, image/jpeg)
- `data` - Binary image data or base64 encoded
- Metadata (generation time, resolution, etc.)

---

## Technical Capabilities

### Prompt Limits
- **Max tokens**: ~1280 tokens per image prompt
- Keep JSON concise—avoid verbose keys or deep nesting
- Cost scales with prompt length + output size

### Reference Images
- **Up to 14 images** can be included as inputs
- **6 high-fidelity anchors** for identity consistency
- Useful for maintaining character/product identity across generations

### Resolution
- Standard: 1024x1024 (1K)
- Pro: Up to 2K (2048x2048)
- Some support for 4K depending on settings
- Can generate grids (e.g., 3x3 for sprite sheets)

### "Thinking" Mode
- Advanced reasoning engine parses JSON structure
- Plans output before rendering (latency cost, quality gain)
- Enforces logical consistency across complex prompts
- Improved task accuracy: **60-80% on complex tasks**

---

## JSON Schema Best Practices

### Hierarchical Structure
```json
{
  "task": "generate_image",
  "metadata": {
    "version": "1.0",
    "author": "AppyDave",
    "timestamp": "2026-01-12T10:00:00Z"
  },
  "subject": { /* ... */ },
  "style": { /* ... */ },
  "environment": { /* ... */ },
  "camera": { /* ... */ },
  "output_format": { /* ... */ }
}
```

### Key Conventions
These field names are widely recognized:
- `task` - Operation type
- `inputs` - Array of input images
- `negative_prompt` - Elements to suppress
- `width` / `height` - Output dimensions
- `style` - Visual style directives
- `camera` - Camera/composition settings
- `lighting` - Lighting setup
- `output_format` - Format specs

### Arrays for Multiple Elements
```json
{
  "subjects": [
    {"id": "character_1", "description": "..."},
    {"id": "character_2", "description": "..."}
  ],
  "props": [
    {"item": "ice cubes", "position": "foreground"},
    {"item": "splash", "position": "background"}
  ]
}
```

### Metadata for Reproducibility
```json
{
  "metadata": {
    "version": "1.2",
    "author": "Your Name",
    "timestamp": "2026-01-12T10:00:00Z",
    "project_id": "nano-banana-product-shots"
  }
}
```

### Validation
- Validate JSON syntax before sending (use JSON linter)
- Check for required fields
- Verify nested structure isn't too deep
- Test with simple prompts first

---

## Advanced Patterns

### 1. Prompt Chaining

Use `chain_id` to link multiple generations:

```json
{
  "task": "generate_image",
  "chain_id": "scene-001",
  /* ... base scene ... */
}
```

Then edit with reference to chain:

```json
{
  "task": "edit_image",
  "chain_id": "scene-001",
  "inputs": [{"type": "image", "data": "<previous_output>"}],
  "changes": "Add sunset lighting"
}
```

**Benefit**: Maintains context between generations, minimizes re-randomization

### 2. Identity Persistence

For consistent characters/products across multiple images:

```json
{
  "task": "generate_image",
  "inputs": [
    {"type": "image", "data": "<reference_face>", "role": "identity_anchor"}
  ],
  "subject": {
    "id": "protagonist",
    "reference_id": 1,
    "rules": ["Keep facial features identical to reference"]
  }
}
```

**Use cases**: Comic panels, product catalogs, storyboards

### 3. Minimal Diff Prompting (Batch Work)

Generate variations by changing one field:

```json
// Base template
{
  "product": {"color": "red", /* ... */},
  "lighting": { /* ... */ },
  "camera": { /* ... */ }
}

// Batch process: red, blue, green, yellow
// Only swap "color" field, keep everything else identical
```

**Result**: Consistent camera angle, lighting, positioning across color variants

### 4. Multi-Step Refinement

**Step 1**: Generate base
```json
{"task": "generate_image", "subject": "...", /* rough spec */}
```

**Step 2**: Edit specific element
```json
{
  "task": "edit_image",
  "inputs": [{"type": "image", "data": "<step1_output>"}],
  "changes": "Adjust lighting to golden hour"
}
```

**Step 3**: Add details
```json
{
  "task": "edit_image",
  "inputs": [{"type": "image", "data": "<step2_output>"}],
  "changes": "Add water droplets on surface"
}
```

**Benefit**: Incremental improvements without re-rolling entire scene

---

## Semantic Parsing and Field Mapping

### How Nano Banana Pro Interprets JSON

**NOT hard-coded schema**—fields guide the model semantically:

1. **Hierarchical parsing**:
   - Top-level `subject` vs `background` → different spatial zones
   - `lighting.key_light.direction` → directional lighting control
   - `camera.angle` → viewpoint control

2. **Constraint satisfaction**:
   - Model attempts to honor ALL fields simultaneously
   - Fields like `negative_prompt` strongly suppress features
   - Resolution fields (`width`, `height`) set output dimensions

3. **Reasoning phase**:
   - Model plans output before rendering
   - Allocates attention to satisfy constraints
   - Handles complex multi-element compositions (10+ subjects with UI overlays)

**Example**: 3D fighting game character select screen
- 10 characters (each with identity anchor)
- Curved arc layout (specified in `layout` section)
- Individual UI nameplates
- Unified lighting theme

Result: All constraints satisfied in single generation

---

## Performance Characteristics

### Latency
- **Thinking time**: Several seconds per generation
- Complex prompts take longer (more reasoning required)
- Trade-off: slower than base models, but higher quality

### Cost
- Billed per 1000 tokens of prompt/output
- Per image size (resolution)
- Pro model is more expensive than base Gemini
- Optimize prompt length to reduce costs

### Rate Limits
- Check API documentation for current limits
- Use batch API or async calls for parallel processing

### Determinism
- Same JSON prompt → similar results (not pixel-perfect)
- Random seed not exposed via API
- Determinism comes from **reduced ambiguity** in structured prompts
- "Thinking" mode contributes to consistency

---

## Comparison with Other Models

### Nano Banana Pro vs Gemini Base Models

**Base models:**
- Simple text prompts
- Less structured understanding
- More trial-and-error required
- Lower cost, faster

**Nano Banana Pro:**
- Native JSON parsing
- Advanced reasoning engine
- Enforces logical consistency
- Higher cost, slower, but more controllable

### Nano Banana Pro vs OpenAI Sora

**Sora (text-to-video):**
- Text prompts (screenplay-style)
- No native JSON input
- Focus on temporal consistency (video frames)
- Character consistency via description

**Nano Banana Pro (text-to-image):**
- Native JSON parsing
- Up to 14 reference images for identity locking
- Spatial layout control
- Multi-element composition (product photography, UI mockups)

### Cross-Platform Schema Compatibility

**Core concepts portable across models:**
- `prompt` / `negative_prompt`
- `width` / `height` / `aspect_ratio`
- `style` / `quality`

**Adaptation required:**
- Nano Banana Pro: Rich nested JSON
- Sora: Flatten to descriptive text (or use external JSON-to-text converter)
- Stable Diffusion: Similar to Nano Banana Pro (structured prompts work well)

**Universal schema pattern:**
```json
{
  "prompt": "Main description",
  "negative_prompt": "Things to avoid",
  "width": 1024,
  "height": 1024,
  "quality": "high",
  "style": "photorealistic"
}
```

Adjust complexity based on model capabilities.

---

## Practical Tips

### 1. Start Simple, Add Complexity
```json
// Start with basics
{"task": "generate_image", "subject": "red shoe"}

// Add structure incrementally
{"task": "generate_image", "subject": {"type": "shoe", "color": "red", "material": "leather"}}

// Full spec
{"task": "generate_image", "subject": {...}, "lighting": {...}, "camera": {...}}
```

### 2. Use Templates
Create reusable templates for common tasks:
- `product-shot-template.json`
- `ui-mockup-template.json`
- `infographic-template.json`

Swap out specific fields for each use case.

### 3. Validate Before Sending
```python
import json

try:
    json.loads(prompt_json_string)  # Validate syntax
except json.JSONDecodeError as e:
    print(f"Invalid JSON: {e}")
```

### 4. Log Everything
```python
{
  "metadata": {
    "timestamp": "2026-01-12T10:00:00Z",
    "project": "nano-banana-product-shots",
    "version": "1.3",
    "notes": "Testing golden hour lighting"
  }
}
```

Helps with debugging and reproducibility.

### 5. Batch Processing Pattern
```python
colors = ["red", "blue", "green", "yellow"]
base_template = {...}  # Load template

for color in colors:
    prompt = base_template.copy()
    prompt["product"]["color"] = color
    response = model.generate_content([json.dumps(prompt)])
    save_image(response, f"product_{color}.png")
```

---

## REST API (HTTP)

If using raw HTTP instead of Python SDK:

### Authentication
```
Authorization: Bearer YOUR_API_KEY
```

### Endpoint
```
POST https://generativelanguage.googleapis.com/v1/models/gemini-3-pro-image:generateContent
```

### Request Body
```json
{
  "contents": [{
    "parts": [{
      "text": "{\"task\": \"generate_image\", ...}"
    }]
  }]
}
```

### Response
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "inlineData": {
          "mimeType": "image/png",
          "data": "<base64_encoded_image>"
        }
      }]
    }
  }]
}
```

---

## Key Takeaways

1. **JSON prompts = blueprints** for Nano Banana Pro
2. **Hierarchical structure** enables surgical control
3. **Reference images** (up to 14) for identity consistency
4. **Prompt chaining** for iterative refinement
5. **Minimal diff prompting** for batch variations
6. **Thinking mode** trades latency for quality
7. **Cross-platform schemas** are mostly portable
8. **Metadata** enables reproducibility and debugging

---

## Resources

Official Documentation:
- Google AI Studio: https://ai.google.dev
- Gemini API Docs: https://ai.google.dev/gemini-api/docs
- Nano Banana Pro Overview: https://gemini.google/overview/image-generation/

Community Guides:
- Mindbees: JSON Prompts Guide (2025)
- DEV Community: Nano-Banana Pro Prompting Guide
- Higgsfield: Expert Use Cases with Prompts

---

**Last Updated**: 2026-01-12
**Next**: Practical examples for nano banana storytelling workflows
