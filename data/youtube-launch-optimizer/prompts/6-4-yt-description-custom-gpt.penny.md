# Penny Analysis: 6-4-yt-description-custom-gpt

**Prompt File**: `6-4-yt-description-custom-gpt.hbs`
**Section**: 6 - YouTube Meta Data
**Status**: ✅ Active (Alternative Strategy)
**Created**: 2026-02-04

---

## Overview

Creates a custom GPT persona prompt for YouTube description generation. This is an **alternative strategy** to the POEM workflow (6-1 + 6-2). Instead of using POEM's structured prompts, this generates a custom GPT configuration that can be used interactively with ChatGPT or similar chat interfaces.

**Purpose**: Generate a custom GPT prompt that, when pasted into ChatGPT, creates a YouTube description specialist with commands (CREATE, HASHTAGS, HELP).

**Key Difference**: This is NOT a prompt that generates a description directly. It's a **meta-prompt** that creates another GPT persona.

---

## Input Schema

| Variable | Type | Source Prompt | Required | Description |
|----------|------|---------------|----------|-------------|
| `videoTitle` | String | 5-1 or 5-2 | Yes | The selected video title |
| `videoKeywords` | String | Config/1-1 | Yes | SEO keywords for the video |
| `chapters` | String (Multi-line) | 2-3 | Yes | Chapters with timestamps |
| `brandInfo` | String | Config | Yes | Brand information (name, tagline, links) |
| `foldCta` | String | Config/1-1 | Yes | Above the fold CTA |
| `primaryCta` | String | Config | Yes | Primary CTA text and link |
| `affiliateCta` | String | Config | No | Affiliate CTA text and links |
| `videoRelatedLinks` | String | 9-3 | No | Related video links |
| `transcriptAbridgement` | String (Long) | 1-4 | Yes | Abridged transcript for content summary |

**Dependencies**:
- **Section 1**: Video Preparation (1-1, 1-4) provides configuration, transcript abridgement
- **Section 2**: Build Chapters (2-3) provides chapters
- **Section 5**: Title Generation (5-1 or 5-2) provides video title
- **Section 9**: YouTube Defaults (9-3) provides related video links
- **Configuration**: Brand info, CTAs, keywords

---

## Output Schema

**Format**: Custom GPT Persona Prompt (Plain Text)

**Output**: A custom GPT configuration that can be pasted into ChatGPT to create a YouTube description specialist.

**Persona Capabilities**:
- **CREATE** command: Generates YouTube description based on title, keywords, transcript, and CTAs
- **HASHTAGS** command: Suggests relevant hashtags as comma-separated list
- **HELP** command: Shows role, overview, guidelines, and command list

**Interaction Model**: User pastes this output into ChatGPT, then interacts with the custom GPT using commands.

---

## Workflow Position

**Section 6: YouTube Meta Data** - Prompt 4/4 (Alternative Strategy)

```
Main Workflow: 6-1 → 6-2 → YouTube Description
Alternative:   6-4 → Custom GPT → Interactive Description Generation
```

**Execution Order**:
1. Sections 1-5, 9 generate all inputs (title, keywords, chapters, CTAs, transcript)
2. **This prompt (6-4)** generates custom GPT persona with all inputs pre-populated
3. User pastes output into ChatGPT
4. User runs `CREATE` command to generate description
5. User runs `HASHTAGS` command to generate tags
6. User runs `HELP` if needed for guidance

**Key Difference**: Main workflow (6-1 + 6-2) is automated/batch. This workflow is interactive/conversational.

---

## Architecture Patterns

### 1. Meta-Prompt Pattern

**Pattern**: This prompt generates ANOTHER prompt (custom GPT configuration), not the final output.

**Why**: Enables interactive, conversational description generation instead of batch processing.

**Use Case**: When user wants to iterate on description (try multiple versions, tweak CTAs, experiment with wording) rather than generate once and commit.

**Related**: This is a **prompt generator** pattern - POEM generates a GPT persona that can then generate descriptions.

### 2. Custom GPT Persona Pattern

**Pattern**: Output includes role definition, commands, guidelines, and response styles.

**Why**: Creates a specialized GPT persona that understands YouTube description best practices and can respond to structured commands.

**Persona Components**:
- **Role**: "Specializes in creating descriptions for YouTube videos, focusing on SEO, viewer engagement, and compliance with YouTube guidelines"
- **Commands**: CREATE, HASHTAGS, HELP
- **Guidelines**: SEO keywords, structured layout, title/keywords usage, hashtag suggestions, YouTube compliance
- **Response Styles**: Defined behavior for each command

### 3. XML-Style Input Injection Pattern

**Pattern**: All inputs are injected as XML-tagged sections (`<video_title>`, `<chapters>`, etc.).

**Why**: Makes the custom GPT configuration self-contained - all data is embedded in the prompt, no external references needed.

**Structure**:
```
<video_title>
{{videoTitle}}
</video_title>

<chapters>
{{chapters}}
</chapters>
...
```

**Contrast with 6-1/6-2**: 6-1/6-2 use Handlebars variables and iteration. 6-4 uses XML tags for ChatGPT compatibility.

### 4. Command-Based Interaction Pattern

**Pattern**: Custom GPT responds to specific commands (CREATE, HASHTAGS, HELP) instead of open-ended conversation.

**Why**: Provides structure to the interaction - user knows exactly what the GPT can do and how to invoke it.

**Commands**:
- `CREATE`: Generate full YouTube description based on all inputs
- `HASHTAGS`: Generate comma-separated hashtag list
- `HELP`: Show detailed command list with descriptions and parameters

**Response Styles**:
- `CREATE` → Write the description
- `HASHTAGS` → Show comma-separated list of tags
- `HELP` → Detailed command list with descriptions and parameters

### 5. Alternative Strategy Pattern

**Pattern**: This prompt is NOT part of the main workflow (6-1 + 6-2). It's an alternative path.

**Why**: Offers flexibility - users can choose batch processing (6-1 + 6-2) or interactive iteration (6-4).

**When to Use 6-4 Instead of 6-1 + 6-2**:
- User wants to iterate on description (try multiple versions)
- User wants conversational refinement (ask GPT to tweak specific parts)
- User wants to experiment with different tones or structures
- User prefers interactive ChatGPT interface over batch POEM workflow

**When to Use 6-1 + 6-2 Instead of 6-4**:
- User wants automation (generate description without interaction)
- User wants consistent, reproducible output
- User wants to integrate with downstream tools (6-2 output can be programmatically consumed)

---

## Human Checkpoint

**Type**: 🟢 Full Manual Execution (Interactive)

**When**: Entire description generation is manual/interactive

**What to Do**:

1. **Generate Custom GPT**:
   - Run this prompt (6-4) to generate custom GPT persona
   - Copy the entire output

2. **Paste into ChatGPT**:
   - Open ChatGPT (or compatible chat interface)
   - Paste the custom GPT configuration
   - GPT persona is now active

3. **Generate Description**:
   - Type `CREATE` command
   - Review generated description
   - If unsatisfied, ask GPT to revise (e.g., "Make it shorter", "Add more SEO keywords")

4. **Generate Hashtags** (optional):
   - Type `HASHTAGS` command
   - Review hashtag suggestions
   - Select relevant hashtags

5. **Use HELP** (if needed):
   - Type `HELP` command
   - Review available commands and guidelines

**Common Issues**:
- Pasted configuration too long for ChatGPT (may hit token limits)
- XML tags not rendering correctly in ChatGPT
- GPT doesn't recognize commands (may need to rephrase as questions)
- Description doesn't match brand voice (requires iterative refinement)

**Approval Criteria**:
- ✅ Custom GPT persona successfully created in ChatGPT
- ✅ `CREATE` command generates valid YouTube description
- ✅ Description matches brand voice and includes all required sections
- ✅ `HASHTAGS` command generates relevant tags

---

## LATO Classification

**Level**: 🟢 Full Manual (LATO-1)

**Automation Threshold**: 20%+ (generates custom GPT config, but description generation is fully interactive)

**Why Full Manual**:
- This prompt only automates the GPT persona creation (meta-prompt generation)
- Actual description generation requires human interaction (CREATE command)
- Iterative refinement is manual (ask GPT to revise, tweak, experiment)
- No automation of final output (human must copy/paste description to YouTube)

**Automation Potential**:
- Custom GPT config generation: 100% (this prompt is automated)
- Description generation: 0% (requires human to run CREATE command)
- Hashtag generation: 0% (requires human to run HASHTAGS command)
- Description refinement: 0% (requires human to iteratively request changes)
- YouTube upload: 0% (requires human to copy/paste)

**Recommended Workflow**:
1. AI generates custom GPT config (this prompt)
2. Human pastes into ChatGPT
3. Human runs CREATE command
4. Human reviews and iterates (ask GPT to revise)
5. Human runs HASHTAGS command (if needed)
6. Human copies final description to YouTube

**Contrast with 6-1 + 6-2**: 6-1 + 6-2 are LATO-3 (Light) and LATO-2 (Medium) respectively, with 60-80% automation. 6-4 is LATO-1 (Full Manual) with 20% automation.

---

## Evolution Notes

**Version History**:
- **v1** (current): XML-style inputs, command-based interaction (CREATE, HASHTAGS, HELP)

**No Evolution Yet**: This prompt hasn't evolved - it's the original version.

**Why This Exists**: Provides an alternative to the structured POEM workflow (6-1 + 6-2) for users who prefer interactive, conversational description generation.

**Future Evolution Possibilities**:
- Add more commands (e.g., `REVISE [section]`, `TONE [formal|casual|energetic]`, `LENGTH [short|medium|long]`)
- Support multiple description formats (e.g., `FORMAT [standard|shorts|podcast]`)
- Add validation commands (e.g., `CHECK_SEO`, `CHECK_LENGTH`)
- Enable custom GPT memory (remember user preferences across sessions)

---

## Schema Requirements

**Priority**: 🟡 Medium (Alternative strategy, not core workflow)

**Required Schemas**: Same as 6-2 (Write Description), but formatted as XML tags instead of Handlebars variables.

1. **`videoTitle`** (String):
   - Source: Title Generation (5-1 or 5-2)
   - Format: `<video_title>{{videoTitle}}</video_title>`

2. **`videoKeywords`** (String):
   - Source: Configuration (1-1)
   - Format: `<video_keywords>{{videoKeywords}}</video_keywords>`

3. **`chapters`** (String, Multi-line):
   - Source: Create Chapters (2-3)
   - Format: `<chapters>{{chapters}}</chapters>`

4. **`brandInfo`** (String):
   - Source: Configuration
   - Format: `<brand_information>{{brandInfo}}</brand_information>`

5. **`foldCta`** (String):
   - Source: Configuration (1-1)
   - Format: `<above_the_folder_cta>{{foldCta}}</above_the_folder_cta>`

6. **`primaryCta`** (String):
   - Source: Configuration
   - Format: `<primary_cta>{{primaryCta}}</primary_cta>`

7. **`affiliateCta`** (String):
   - Source: Configuration
   - Format: `<affiliate_cta>{{affiliateCta}}</affiliate_cta>`

8. **`videoRelatedLinks`** (String):
   - Source: Select Related Videos (9-3)
   - Format: `<video_related_links>{{videoRelatedLinks}}</video_related_links>`

9. **`transcriptAbridgement`** (String, Long):
   - Source: Abridge Transcript (1-4)
   - Format: `<transcript_abridgement>{{transcriptAbridgement}}</transcript_abridgement>`

**Output Schema**: Custom GPT Persona Prompt (Plain Text)

---

## SupportSignal Pattern Mapping

**Relevant SupportSignal Patterns**: None directly applicable (this is YouTube-specific meta-prompt generation)

**Generic Pattern**: **Meta-Prompt for Interactive AI Personas**

This pattern could be used in SupportSignal for creating custom GPT personas for specific NDIS tasks:
- **Shift Note Writer GPT**: Interactive persona for drafting shift notes with commands (DRAFT, ENHANCE, REVIEW)
- **Question Generator GPT**: Interactive persona for generating questions with commands (GENERATE, REFINE, VALIDATE)
- **Analysis Predicates GPT**: Interactive persona for analysis with commands (ANALYZE, CLASSIFY, SUMMARIZE)

**Transferable Concept**:
- Create meta-prompts that generate specialized GPT personas
- Use XML-tagged input injection for self-contained configurations
- Define command-based interactions (CREATE, HASHTAGS, HELP → DRAFT, ENHANCE, REVIEW)
- Provide alternative interactive path to batch workflows

---

## Questions for YAML Review

1. **Strategy Selection**:
   - Should POEM provide UI to choose between main workflow (6-1 + 6-2) and alternative workflow (6-4)?
   - Or should 6-4 be hidden/deprecated if main workflow is preferred?

2. **Token Limits**:
   - Custom GPT config can be very long (all inputs embedded). Should there be a warning if config exceeds ChatGPT token limits?

3. **XML Tag Consistency**:
   - Some tags have typos (`<above_the_folder_cta>` should be `<above_the_fold_cta>`). Should this be fixed?
   - Note: `videoKeywords` appears twice in the XML (lines 6-9 and 35-37). Is this intentional?

4. **Command Extensibility**:
   - Should we add more commands? (e.g., `REVISE`, `TONE`, `LENGTH`, `CHECK_SEO`)
   - How should new commands be documented and maintained?

5. **Output Format**:
   - Should the CREATE command output match 6-2's YouTube-native formatting, or can it be different?
   - Should there be explicit instructions in the GPT persona about YouTube-native formatting (single `*` for bold, etc.)?

6. **Interactive Refinement**:
   - Should the GPT persona include examples of refinement requests? (e.g., "Make it shorter", "Add more SEO keywords", "Change tone to more casual")

7. **Memory/Context**:
   - Should the custom GPT remember user preferences across sessions? (e.g., preferred tone, favorite hashtags, brand voice guidelines)

8. **Version Control**:
   - If user generates multiple descriptions using this GPT, how should versions be tracked?
   - Should there be a command like `SAVE_VERSION` to log generated descriptions?

---

## Related Prompts

| Relationship | Prompt ID | Description |
|--------------|-----------|-------------|
| **Provides Input** | 1-1 | Configuration (videoKeywords, foldCta) |
| **Provides Input** | 1-4 | Abridge Transcript (transcriptAbridgement) |
| **Provides Input** | 2-3 | Create Chapters (chapters) |
| **Provides Input** | 5-1 or 5-2 | Generate Title (videoTitle) |
| **Provides Input** | 9-3 | Select Related Videos (videoRelatedLinks) |
| **Provides Input** | Config | Brand Info, CTAs |
| **Alternative To** | 6-1 + 6-2 | Main workflow (batch processing) vs. this (interactive) |

---

## Tags

`#section-6-youtube-meta-data` `#meta-prompt` `#custom-gpt` `#interactive-workflow` `#command-based-interaction` `#alternative-strategy` `#xml-inputs` `#lato-1-full-manual` `#chatgpt-persona`

---

**Analyzed by**: Penny (AI Prompt Assistant)
**Analysis Date**: 2026-02-04
**Last Updated**: 2026-02-04
