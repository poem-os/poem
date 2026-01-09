# B72 Video Release - POEM Prompt Testing Guide

**Status**: Ready for testing when you release B72 video
**Created**: 2026-01-09
**Project**: b72-opus-4.5-awesome (Claude Opus 4.5 Recording Namer demo)
**Transcript**: 4,497 words across 20 chapters

---

## What Was Created

Six POEM prompts were created to test the YouTube workflow automation:

| Prompt | Input | Output | Purpose |
|--------|-------|--------|---------|
| `summarize-video.hbs` | transcript | Text summary | Concise video summary |
| `abridge-transcript.hbs` | transcript | Compressed text (40-60%) | Near-lossless transcript compression |
| `identify-chapters.hbs` | transcript | Chapter list + quotes | YouTube chapters identification |
| `generate-title.hbs` | transcript, shortTitle (opt) | 10 title options | CTR-optimized YouTube titles |
| `thumbnail-text.hbs` | transcript, videoTitle (opt) | 5-7 thumbnail text ideas | Thumbnail text suggestions (table) |
| `video-description.hbs` | transcript, videoTitle (opt) | JSON (firstLine, simpleDescription) | SEO-optimized description |

**Location**: `/Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/prompts/`

**Test Data**: B72 transcript stored in `dev-workspace/mock-data/*.json`

---

## How to Test (Manual - Before Epic 2)

Since the Astro server (Epic 2) isn't built yet, you'll test these manually by copy-pasting into Claude.

### Step 1: Get the B72 Transcript

```bash
# The transcript is already in mock data
cat dev-workspace/mock-data/summarize-video.json | jq -r '.transcript'
```

Or get fresh from FliHub:
```bash
curl -s "http://localhost:5101/api/query/projects/b72-opus-4.5-awesome/transcripts?include=content" | jq -r '.transcripts[].content' | tr '\n' ' '
```

### Step 2: Load a Prompt Template

```bash
# Example: Generate titles
cat dev-workspace/prompts/generate-title.hbs
```

### Step 3: Replace Placeholders

- Replace `{{transcript}}` with the B72 transcript text
- Replace `{{shortTitle}}` (if present) with: "Claude Opus 4.5 Builds Recording Namer App"
- Replace `{{videoTitle}}` (if present) with your selected title

### Step 4: Run in Claude

Copy the filled template and paste into a Claude conversation. Review the output.

### Step 5: Document Results

Use the **Testing Results** section below to record what worked and what didn't.

---

## Expected Workflow for B72 Release

**Suggested order**:

1. **Summarize** → Get quick summary for personal reference
2. **Abridge** → Get compressed transcript for AI context
3. **Generate Title** → Get 10 title options, pick your favorite
4. **Thumbnail Text** → Generate thumbnail text ideas based on chosen title
5. **Video Description** → Generate SEO description based on chosen title
6. **Identify Chapters** → Get chapter suggestions

---

## Testing Results Template

### Test Run: [DATE]

**Prompt**: `generate-title.hbs`

**Input Data**:
- Transcript: B72 (4,497 words)
- Short Title: "Claude Opus 4.5 Builds Recording Namer App"

**Output Quality**:
- [ ] Generated expected format (10 titles with emotion labels + char counts)
- [ ] Titles are relevant to video content
- [ ] Character counts are accurate
- [ ] Emotion triggers make sense
- [ ] Would actually use one of these titles

**Issues Found**:
- Example: "Titles too generic, not specific to Recording Namer app"
- Example: "Character counts off by 5+ chars"
- Example: "Didn't capture the '20 minutes' hook from transcript"

**Suggested Fixes**:
- Example: "Add instruction to identify time-based hooks (e.g., '20 minutes', '3 minutes')"
- Example: "Emphasize extraction of concrete tools/technologies mentioned"

---

## How to Iterate on Prompts

If you find issues during testing:

### Option 1: Direct Edit (Quick Fix)

```bash
# Edit the prompt template
code dev-workspace/prompts/generate-title.hbs

# Modify the guidelines or instructions
# Save and re-test
```

### Option 2: Document for POEM Agent (Future)

Once Epic 3 is built, you'll be able to use:

```bash
/poem/agents/prompt-engineer
*refine generate-title

# Describe what went wrong
# Agent will update the template
```

### Option 3: Provide Feedback to This Conversation

When you test, capture:
1. **What prompt you tested**
2. **What went wrong** (specific examples)
3. **What you expected** (desired output)
4. **Suggested fix** (how to improve the prompt)

This becomes training data for improving POEM's prompt generation patterns.

---

## Key Simplifications Made

These prompts are **simplified versions** compared to your original YouTube Launch Optimizer:

### Original Title Generator (6 inputs)
```
- shortTitle
- analyzeContentEssence.mainTopic
- analyzeContentEssence.statistics
- analyzeCtaCompetitors.catchyPhrases
- analyzeAudienceEngagement.audienceInsights
- titleIdeas (previous attempts)
```

### POEM Simplified (1-2 inputs)
```
- transcript (extract everything from here)
- shortTitle (optional)
```

**Why simplified?**
- Tests POEM's capability with self-contained prompts
- No workflow dependencies required
- Easier to test manually
- Can add complexity later in Epic 4

**Trade-off**:
- Less SEO optimization (no competitor analysis)
- No audience targeting refinement
- No iterative improvement from previous attempts

**If simplified versions don't work well**, we can:
1. Add the analysis prompts (`analyze-content-essence.hbs`, etc.)
2. Test the full workflow chain (Epic 4)
3. Compare simple vs complex output quality

---

## Connection to B72 Video Project

**FliHub Project**: `b72-opus-4.5-awesome`

**Video Content**: Claude Opus 4.5 building a Recording Namer application
- 20 minutes total development time
- Stack: Express 5, React, Vite, Tailwind, Socket.IO, TanStack Query
- Monorepo: 7 server files, 10 client files, 1 shared
- Timeline: 10min initial build + 2min bugs + 3min features + 2min refactor

**Key Hooks for Titles/Thumbnails**:
- "20 minutes" - time-based hook
- "Claude Opus 4.5" - model name
- "Recording Namer" - specific app
- "No code review" - everything via prompts
- "3 minute bug fixes" - speed
- Tech stack (Express 5, React, Socket.IO)

**Suggested Title Direction** (based on transcript):
- Emphasize speed ("20 Minutes", "3 Minute Fixes")
- Emphasize tool (Claude Opus 4.5)
- Emphasize outcome (Recording Namer app)
- Emphasize method (No code review, just prompts)

---

## Feedback Loop

After testing, update this document with:

### What Worked
- List prompts that produced usable output
- Note any particularly good results

### What Didn't Work
- List prompts that missed the mark
- Specific examples of bad output

### Prompt Improvements Needed
- Specific changes to make
- Examples of desired output

### POEM System Insights
- Did the simplified approach work?
- Should we add the analysis prompts?
- Any patterns that need addressing?

---

## Next Steps

1. **When you release B72 video**: Run through testing workflow above
2. **Document results**: Fill in Testing Results section
3. **Iterate if needed**: Update prompts based on feedback
4. **Compare to manual**: How does POEM output compare to your manual process?
5. **Feed back to POEM development**: Insights inform Epic 3-4 implementation

---

## Questions to Answer During Testing

- [ ] Do simplified prompts produce usable output?
- [ ] Is the POEM structure (Context → Input → Task → Output) helpful?
- [ ] Do we need the complex analysis prompts, or is transcript-only sufficient?
- [ ] How does output compare to your original YouTube Launch Optimizer?
- [ ] What's missing that would make these prompts production-ready?

---

**Last Updated**: 2026-01-09
**Conversation**: Prompt Engineer agent testing session
**Status**: Awaiting B72 video release for real-world testing
