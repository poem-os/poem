> **POEM Context**: This document was imported from the Motus project. It provides the detailed step-by-step analysis that informs POEM's Epic 4 (YouTube Automation Workflow validation). The patterns, human checkpoints, and parallelization opportunities documented here are directly applicable to POEM's workflow orchestration design.

# Launch Optimizer Flow Analysis

## Purpose

This document analyzes the youtube_launch_optimizer workflow step-by-step to understand:
- Human-in-the-loop requirements and types
- Dependencies (which attributes must be populated)
- Parallelization opportunities
- Sequential vs parallel flow patterns

**Method**: Systematic walkthrough with detailed questioning

---

## Section 1: Video Preparation

### Overview
**Purpose**: Prepare raw transcript for analysis
**Steps**: 6
**Input Materials**: transcript, project_code, project_folder (+ optional pre-filled values)

---

### Step 1: Configure

**Inputs:**
- gpt_links
- gpt_links2
- project_code
- project_folder
- short_title
- video_title
- title_ideas
- video_link
- video_related_links
- video_keywords
- brand_info
- fold_cta
- primary_cta
- affiliate_cta
- chapters
- srt
- transcript
- transcript_abridgement
- transcript_summary
- transcript_intro
- transcript_hook
- transcript_outro
- transcript_recap

**Prompt**: short_title_prompt

**Outputs:**
- project_code
- short_title
- title_ideas

**Prompt Analysis:**
```
1. Extract project code from project_folder (e.g., "b62-remotion-overview" → "b62")
2. Generate short title from project_folder name
3. Read transcript and generate list of 3-7 word title suggestions

Placeholders used: [project_folder], [transcript]
```

**Reality Check (from David):**

**Why 23 inputs?**
- UX artifact: Human might jump back to this step from step 10, wants to see all loaded data
- Or human pre-fills values manually before starting
- NOT because all 23 are functionally required
- This is human convenience, not step logic

**Required vs Optional:**
- **REQUIRED**: transcript
- **USEFUL**: project_folder (helps extract code + generate short title)
- **OPTIONAL CONFIG**: brand_info (static across runs, should come from config/second brain)
- **OPTIONAL PRE-FILLS**: Everything else (human might fill ahead of time)

**Human-in-the-loop:**
- **START**: Human provides transcript (minimum), optionally project_folder
- **EXECUTION**: AI generates project_code, short_title, title_ideas
- **REVIEW**: Human reviews generated values?
- **PROCEED**: Human approves to continue? Or auto-advances?

**Dependencies:**
- Cannot run until: transcript provided
- Outputs become available immediately after execution

**Analysis:**
- This is the **initialization step** - sets up project metadata
- Generates multiple title options for human to choose from later
- Creates project_code used throughout workflow (e.g., file storage paths)

---

### Step 2: Script Summary

**Inputs:**
- transcript
- title_ideas
- project_code

**Prompt**: video_summary_prompt

**Outputs:**
- transcript_summary

**Prompt Analysis:**
```
Summarize YouTube video transcript
- Extract main topics, key arguments, essential points
- Eliminate unnecessary details
- Maintain original intent and tone
- Condense to core meaning/highlights

Placeholders used: [transcript] only
```

**Observation:**
- Prompt ONLY uses [transcript]
- But RBX declares title_ideas and project_code as inputs
- **These are unused by the prompt** - possibly for context/reference?

**Dependencies:**
- REQUIRES: transcript (from raw materials)
- DECLARED BUT UNUSED: title_ideas, project_code (from Step 1)
- **Technically could run in parallel with Step 1** if we ignore unused inputs

**Human-in-the-loop:**
- [DAVID TO CONFIRM] Fully automated? Or review checkpoint?

**Purpose:**
- Create condensed version of transcript
- Used by later steps that need shorter context

**Data File Evidence (b62):**
- transcript_summary: Used later (e.g., tweets, social media)
- Different from transcript_abridgement:
  - **summary** = high-level overview (smallest)
  - **abridgement** = detailed but compressed (medium)
  - **transcript** = full detail (largest)

**Reality Check (from David):**
- Unused inputs (title_ideas, project_code): Keep them, they're there for convenience
- transcript_summary IS used: Primarily for social media posts requiring brevity
- **Human checkpoint**: NO - auto-advance
- **Fully automated step**

---

### Step 3: Script Abridgement

**Inputs:**
- transcript_summary (from Step 2)
- transcript

**Prompt**: video_abridgement_prompt

**Outputs:**
- transcript_abridgement

**Prompt Analysis:**
```
Condense video transcript while preserving key details
- Keep essential information, context, structure
- Remove redundant phrases, filler, off-topic content
- Maintain chronological flow and narrative arc
- Preserve technical terms, examples, data points
- Ensure abridgement is self-contained and coherent

Placeholders used: [transcript] only
```

**Observation:**
- Prompt ONLY uses [transcript]
- RBX declares transcript_summary as input but **prompt doesn't use it**
- Similar to Step 2 - input declared for convenience/reference

**Dependencies:**
- REQUIRES: transcript (raw material)
- DECLARED BUT UNUSED: transcript_summary (from Step 2)
- **Could technically run in parallel with Step 2** (both only need transcript)

**Reality Check (from David):**
- **Human checkpoint**: NO - auto-advance
- **Fully automated step**
- **CAN RUN IN PARALLEL WITH STEP 2** (both only need transcript)

**Purpose:**
- Create detailed-but-compressed version
- Retains more info than summary
- Used extensively in later steps (chapters, analysis, etc.)
- **Most important derived attribute** in the workflow

**Parallelization Discovery:**
```
After Step 1 completes:
├── Step 2: Script Summary (transcript → transcript_summary) ─┐
└── Step 3: Script Abridgement (transcript → transcript_abridgement) ─┤
                                                                       ↓
                                                              Both feed into Step 4
```

---

### Step 4: Abridge QA ⚠️ HUMAN CHECKPOINT

**Inputs:**
- transcript
- transcript_abridgement (from Step 3)

**Prompt**: abridgement_descrepencies_prompt

**Outputs:**
- transcript_abridgement_descrepencies

**Prompt Analysis:**
```
Compare abridged transcript to original
- Identify missing important information
- Check for misrepresented context or facts
- Flag removed content that should be preserved
- Note any loss of key narrative elements
- Assess overall quality and completeness

Output: List of discrepancies found

Uses: [transcript] and [transcript_abridgement]
```

**Dependencies:**
- REQUIRES: transcript (raw material)
- REQUIRES: transcript_abridgement (from Step 3)
- **Must run AFTER Step 3 completes**
- **Cannot parallelize** - needs Step 3 output

**Human-in-the-loop:** ⚠️ **YES - QUALITY CHECK (CONVERSATIONAL REFINEMENT)**
- AI always generates list of discrepancies
- Human reviews the list
- ~20% of time: Issues need fixing
- ~80% of time: Good enough, proceed

**When issues found:**
- Human provides modified guidance in same conversation
- AI has full context (transcript + transcript_abridgement already loaded)
- AI regenerates improved transcript_abridgement
- This is conversational refinement, not a full Step 3 re-run
- Could be recursive/iterative until human satisfied

**Reality Check (from David):**
- Always produces discrepancy list (it's the output)
- Issues found: ~20% of videos
- Fix method: Conversational guidance within same context
- Open to better approaches (recursive system, etc.)
- **This is the ONLY human checkpoint in Section 1**

**Purpose:**
- Quality assurance gate
- Catch missing critical information before it propagates
- Most important QA step since transcript_abridgement feeds 20+ later steps

**Motus Implementation Notes:**
- Could be agent loop: generate → human review → refine → human review → approve
- Or separate "refine" agent triggered by human feedback
- Need state management for "approved" flag

---

### Step 5: Intro/Outro Separation

**Inputs:**
- transcript
- transcript_intro (optional pre-fill)
- transcript_outro (optional pre-fill)

**Prompt**: intro_outro_seperation_prompt

**Outputs:**
- transcript_intro
- transcript_outro

**Prompt Analysis:**
```
Extract intro and outro sections from transcript
- Intro: Everything before main content begins
- Outro: Starts when speaker recaps or mentions like/subscribe
- Output: Extracted text for each section

Placeholders used: [transcript] only
```

**Dependencies:**
- REQUIRES: transcript (raw material)
- OPTIONAL: transcript_intro/outro (for manual override/pre-fill)
- **Could run in PARALLEL with Steps 2-4** (all only need transcript)

**Reality Check (from David):**
- **Can run in PARALLEL** with Steps 2, 3, 6
- **Sometimes needs human review** - doesn't always pick correct split points
- Accuracy issue: Intro/outro boundaries can be ambiguous

**Human-in-the-loop:** ⚠️ **SOMETIMES - BOUNDARY VALIDATION**
- AI extracts intro and outro
- Sometimes picks wrong split location
- Human reviews if boundaries look incorrect
- Frequency: [not specified, but less critical than Abridge QA]

**Purpose:**
- Extract opening/closing segments
- Used for: B-roll suggestions, outro animations, contextual framing
- Separate processing of beginning and end

**Improvement Note (from David):**
- **Should be 2 separate steps:**
  - Step 5a: Extract Intro
  - Step 5b: Extract Outro
- More focused prompts = better accuracy
- Consider for future refactoring

---

### Step 6: Find Video CTA

**Inputs:**
- transcript

**Prompt**: find_video_cta_prompt

**Outputs:**
- video_references
- future_video_cta
- past_video_cta

**Prompt Analysis:**
```
Identify video cross-references in transcript
- Past videos: "As I mentioned in...", "In previous video..."
- Future videos: "I'll be making...", "Stay tuned for..."
- Extract: Title/topic + full sentence with reference
- Only include explicit video references, not vague mentions

Placeholders used: [transcript] only
```

**Dependencies:**
- REQUIRES: transcript (raw material)
- **Could run in PARALLEL with Steps 2-5** (all only need transcript)

**Reality Check (from David):**
- **Can run in PARALLEL** with Steps 2, 3, 5
- **Currently NOT USED in actual workflow**
- Needs different approach to be useful
- Designed feature that didn't meet real-world needs

**Human-in-the-loop:** ❌ **NOT APPLICABLE - STEP NOT USED**

**Purpose (intended):**
- Identify creator's other videos mentioned in content
- Use in: YouTube description, pinned comments, related links
- Build content interconnectivity

**Real-World Insight:**
- This step doesn't provide useful output in practice
- May need manual curation of related videos instead
- Or different prompt approach to extract actionable CTAs
- Consider removing or redesigning for Motus implementation

---

## Preliminary Parallelization Analysis (Section 1)

### Current Sequential Flow (as designed):
```
Step 1: Configure
  ↓
Step 2: Script Summary
  ↓
Step 3: Script Abridgement
  ↓
Step 4: Abridge QA ⚠️ HUMAN CHECKPOINT
  ↓
Step 5: Intro/Outro Separation
  ↓
Step 6: Find Video CTA
```

### Discovered Parallelization Opportunities:

**After Step 1 completes, ALL of Steps 2-6 could run in PARALLEL** because they ALL only need `transcript`:

```
Step 1: Configure (transcript + project_folder → project_code, short_title, title_ideas)
  ↓
┌─────────────────┴──────────────────────────────────┐
│ PARALLEL GROUP (all only need transcript):         │
├─ Step 2: Script Summary → transcript_summary       │
├─ Step 3: Script Abridgement → transcript_abridgement │
├─ Step 5: Intro/Outro → transcript_intro/outro      │
└─ Step 6: Find CTA → video_references, CTAs         │
└─────────────────┬──────────────────────────────────┘
                  ↓
Step 4: Abridge QA (needs transcript + transcript_abridgement)
       ⚠️ HUMAN CHECKPOINT
```

**However, Step 4 must wait for Step 3** because it needs `transcript_abridgement`.

**Revised optimal flow:**
```
Step 1: Configure
  ↓
┌────────────────────────────────┐
│ PARALLEL GROUP A (4 steps):    │
│ - Step 2: Script Summary       │
│ - Step 3: Script Abridgement   │
│ - Step 5: Intro/Outro          │
│ - Step 6: Find CTA             │
└────────────────┬───────────────┘
                 ↓ (wait for Step 3)
Step 4: Abridge QA ⚠️ HUMAN CHECKPOINT
```

---

## Human-in-the-Loop Patterns (Discovered)

### Pattern Types

**Pattern 1: Review & Select (Curation)**
- AI generates analysis/comparisons/options
- Human reviews findings
- Human selects which items to include/apply
- Example: Abridge QA - AI finds discrepancies, human decides which to fix

**Pattern 2: Correction/Refinement (Directive Feedback)**
- AI generates output
- If wrong, human provides specific correction
- Usually 1-2 simple directives: "start here", "stop there"
- Example: Intro/Outro - AI extracts boundaries, human corrects: "should've started at this word"

**Pattern 3: Categorization**
- AI generates list of items with categories/types
- Human reviews categorized results
- Example: CTA - list of calls-to-action with types

**Pattern 4: Predicate/Boolean**
- AI answers yes/no question
- Human verifies answer
- Example: CTA - "Is there a CTA present? Yes/No"

**Pattern 5: Approval Gate**
- AI generates output
- Human approves or rejects (simple gate)
- No refinement, just proceed/stop decision

### Schema Enhancement Proposal

Add to Step definition:
```yaml
step:
  name: "Abridge QA"
  human_in_loop:
    enabled: true
    type: "review_and_select"      # Pattern type
    frequency: "always"             # always | sometimes | rare
    blocking: true                  # Must complete before next step
    correction_rounds: 1-3          # Expected iterations
    description: "Review discrepancy list, select fixes to apply"
```

---

## Section 1 Summary: Reality vs Design

### Human Checkpoints (with Patterns)

**Step 4: Abridge QA** ⚠️ **PRIMARY CHECKPOINT**
- **Pattern**: Review & Select (Curation)
- AI generates discrepancy list with comparisons/questions
- Human reviews: "Should I include these findings in the abridgement?"
- Human selects which findings to apply
- Frequency: Always generates list, ~20% need fixes
- Most critical QA gate (transcript_abridgement feeds 20+ later steps)

**Step 5: Intro/Outro Separation** ⚠️ **OCCASIONAL CHECKPOINT**
- **Pattern**: Correction/Refinement (Directive Feedback)
- AI extracts intro/outro boundaries
- If wrong, human provides simple correction: "should've started at this word"
- Usually 1 correction, maybe 2 if still wrong
- Frequency: Sometimes (when boundaries ambiguous)

**Step 6: Find CTA** ❌ **NOT CURRENTLY USED**
- **Pattern**: Could be Categorization OR Predicate/Boolean
  - Option A: List of CTAs with types (categorization)
  - Option B: "Is there a CTA? Yes/No" (predicate)
- David doesn't use this step currently, so no preference yet
- Frequency: N/A

**Steps 1, 2, 3**: ✅ **No human checkpoint needed**

### What Actually Works

**Highly Valuable:**
- Step 1: Configure - Sets up project metadata ✓
- Step 2: Script Summary - Used for social media ✓
- Step 3: Script Abridgement - Most important derived attribute ✓
- Step 4: Abridge QA - Critical quality gate ✓
- Step 5: Intro/Outro - Useful but accuracy issues ⚠️

**Doesn't Work in Practice:**
- Step 6: Find CTA - Not used, needs redesign ❌

### Design Improvements Identified

1. **Step 5 should be split into 2 steps:**
   - Separate "Extract Intro" and "Extract Outro"
   - More focused prompts = better accuracy
   - Would reduce human review frequency

2. **Step 6 needs different approach:**
   - Current output not actionable
   - Consider manual curation or different prompt strategy

3. **Unused inputs throughout:**
   - Many steps declare inputs they don't use
   - This is UX artifact (human convenience)
   - Not functional dependencies

4. **Step 4 iterative refinement:**
   - Currently conversational in same context
   - Could be formalized as agent loop
   - Opportunity for recursive improvement system

### Parallelization Findings

**Massive opportunity discovered:**
- Steps 2, 3, 5, 6 ALL only need `transcript`
- Could run simultaneously after Step 1
- Current design: Sequential (1→2→3→4→5→6)
- Optimal design: 1 → [2,3,5,6 parallel] → 4 (human checkpoints)

**Critical Insight:**
- Human checkpoints DON'T block parallel execution
- Steps 2, 3, 5, 6 can all run in parallel
- Human reviews happen AFTER all complete
- Workflow: Execute parallel → Present all results → Human reviews each

**Revised optimal flow with human checkpoints:**
```
Step 1: Configure
  ↓
┌────────────────────────────────────┐
│ PARALLEL EXECUTION                 │
│ - Step 2: Script Summary           │
│ - Step 3: Script Abridgement       │
│ - Step 5: Intro/Outro              │
│ - Step 6: Find CTA (if using)      │
└────────────────┬───────────────────┘
                 ↓ (all complete)
┌────────────────────────────────────┐
│ HUMAN REVIEW PHASE                 │
│ - Step 4: Abridge QA (review list) │ ⚠️ Pattern: Review & Select
│ - Step 5: Validate boundaries      │ ⚠️ Pattern: Correction (if needed)
│ - Step 6: Review CTAs              │ ⚠️ Pattern: Categorization/Predicate (if using)
└────────────────────────────────────┘
```

**Time savings potential:**
- If each step takes 30-60 seconds
- Sequential: 4-6 minutes for Steps 2-6
- Parallel: 30-60 seconds (longest step wins) + human review time
- **Potential 4-5 minute savings in execution, human reviews same batch**

### Data Flow Insights

**Three transcript variants:**
- `transcript` (4000 words) - Full detail
- `transcript_summary` (400 words) - High-level overview, used in social media
- `transcript_abridgement` (800 words) - Detailed but compressed, used in 20+ later steps

**Most important attributes from Section 1:**
1. `transcript_abridgement` - Used extensively in later sections
2. `project_code` - Used for file organization
3. `transcript_summary` - Used for social media posts
4. `transcript_intro/outro` - Used for B-roll, contextual framing

---

## Section 2: Build Chapters

### Overview
**Purpose**: Create YouTube chapter markers with timestamps
**Steps**: 3
**Dependencies from Section 1**: transcript, transcript_abridgement

---

### Step 1: Find Chapters

**Inputs:**
- transcript
- transcript_abridgement

**Prompt**: identify_chapters_prompt

**Outputs:**
- identify_chapters

**Prompt Analysis:**
```
Generate initial chapter list from video content
- Identify logical sections/topics
- Use simple, general terms
- Minimize detail in chapter names
- Include reference quote from transcript for each chapter
- Format: Numbered list with quotes

Placeholders used: [transcript], [x-transcript-abridgement]
Note: Prompt has unusual [x-transcript-abridgement] prefix
```

**Dependencies:**
- REQUIRES: transcript (from raw materials)
- REQUIRES: transcript_abridgement (from Section 1, Step 3)
- **Must wait for Section 1, Step 3 to complete**
- **Cannot run in parallel with Section 1**

**Reality Check (from David):**
- **Accuracy: POOR** - Usually generates WAY TOO MANY chapters
- Only becomes accurate when Step 2 adds human folder names
- [x-transcript-abridgement] prefix: Prevents it from being included in data (not actually used)

**Human-in-the-loop:** ✅ **AUTO-ADVANCE (but output not very useful)**
- AI attempts chapter identification
- Result is usually poor (too many chapters)
- Real value comes in Step 2 when human provides structure

**Purpose:**
- Give AI "contextual understanding" of chapter possibilities
- Sets up context for Step 2 refinement
- Could potentially be combined with Step 2, but kept separate for AI context

**Critical Insight:**
- **Chapter creation is THE HARDEST task for AI in entire workflow**
- David manually does 90% of chapter work himself
- Hasn't done in 6 months (AI may be better now)

---

### Step 2: Refine Chapters

**Inputs:**
- identify_chapters (from Step 1)
- chapter_folder_names
- transcript

**Prompt**: chapter_folder_names_prompt

**Outputs:**
- chapters

**Prompt Analysis:**
```
Align AI-suggested chapters with author's folder structure
- Folder names are AUTHORITATIVE (human-provided structure)
- Must produce exactly one chapter per folder
- Preserve folder order exactly
- Merge/normalize AI suggestions to fit folder structure
- Balance SEO, readability, but anchor to folder intent

Placeholders used: [identify_chapters], [transcript], [chapter_folder_names]
```

**Reality Check (from David):**
- **THIS IS WHERE THE MAGIC HAPPENS**
- Human provides `chapter_folder_names` from their file system
- These come from video recording process: David records videos in separate files with short names (e.g., "introduction", "setup", "demo")
- Folder names are LIMITED LIST that dramatically improves accuracy

**How David Records Videos:**
- Records in separate files (not one continuous recording)
- Each file has short descriptive name = natural chapter structure
- Feeds these file names into workflow as `chapter_folder_names`
- AI uses these as authoritative structure to refine its poor Step 1 attempt

**Dependencies:**
- REQUIRES: identify_chapters (from Step 1 - though it's poor quality)
- REQUIRES: chapter_folder_names (**human provides from file system**)
- REQUIRES: transcript (raw material)
- **Must run AFTER Step 1** (AI needs context first)
- **Sequential within Section 2**

**Human-in-the-loop:** ⚠️ **YES - HUMAN PROVIDES FRAMEWORK**
- **Pattern**: Human defines framework (folder names), AI populates/refines
- Human supplies folder names at this step
- If folder names provided → can auto-advance
- **Usage: ALL THE TIME** - Step 2 is the only step that actually helps David

**Purpose:**
- Transform AI's poor many-chapter attempt → accurate limited list
- Align AI understanding with human's natural recording structure
- Makes chapters actually usable

---

### Step 3: Create Chapters

**Inputs:**
- chapters (from Step 2)
- srt

**Prompt**: create_chapters_prompt

**Outputs:**
- chapters (updates same attribute with timestamps)

**Prompt Analysis:**
```
Add timestamps to chapters using SRT file
- Match chapter sentences to SRT timestamps
- Format: [M:SS] or [H:MM:SS] Chapter Name
- First chapter always 0:00
- Chronological order, no duplicates
- Flexible matching (exact sentence may not exist)

Placeholders used: [srt], [chapters]
```

**Dependencies:**
- REQUIRES: chapters (from Step 2)
- REQUIRES: srt (subtitle file from YouTube or external tool)
- **Must run AFTER Step 2**
- **Sequential within Section 2**

**Reality Check (from David):**
- **THIS STEP DOESN'T WORK IN PRACTICE** ❌
- Would be wonderful if it did
- Problem: Couldn't easily process machine-readable files (SRT) with LLMs at the time
- **BUT: This might work NOW** (LLMs can handle structured files better)
- Current reality: David does this MANUALLY by watching the video
- **THIS IS THE HARDEST, MOST TIME-CONSUMING STEP** - David HATES doing this

**Human-in-the-loop:** ⚠️ **COMPLETELY MANUAL (step doesn't work)**
- Current process: Watch entire video, manually assign timestamps
- Extremely time-consuming
- Not automated at all

**Purpose (intended but not achieved):**
- Automatically match chapter names to SRT timestamps
- Create YouTube-formatted chapter list
- Save massive manual effort

**Critical Gap:**
- This is HIGH-VALUE automation opportunity
- If Step 3 could work, it would eliminate David's most hated task
- Worth revisiting with modern LLM capabilities

**Post-Step 3 Reality:**
- Even after all this, David writes FINAL chapter names while watching video
- So the flow is:
  1. AI attempts (poor)
  2. AI refines with folder names (better)
  3. Manual timestamp assignment (painful)
  4. Final human chapter name writing (end of process)

---

## Section 2 Summary: Reality vs Design

### The Chapter Creation Challenge

**THE HARDEST AI TASK IN ENTIRE WORKFLOW**
- David manually does 90% of chapter work himself
- AI struggles significantly with this task
- More manual intervention required than any other section

### What Works vs What Doesn't

**Step 1: Find Chapters** ⚠️
- **AI Output: POOR** - Generates way too many chapters
- But provides contextual understanding for Step 2
- Auto-advance but output not very useful

**Step 2: Refine Chapters** ✅ **THE ONLY STEP THAT HELPS**
- **THIS IS WHERE IT WORKS**
- Human provides folder names from recording file system
- AI refines poor Step 1 attempt into accurate limited list
- **Used ALL THE TIME**
- Pattern: Human defines framework, AI populates

**Step 3: Create Chapters** ❌ **COMPLETELY BROKEN**
- **DOESN'T WORK AT ALL**
- Was supposed to match chapters to SRT timestamps
- LLMs couldn't handle structured files well at the time
- David does this MANUALLY by watching entire video
- **MOST HATED TASK** - extremely time-consuming
- **HIGH-VALUE opportunity for modern LLMs**

### David's Recording Process (Key Insight)

**Why Step 2 works:**
- David records videos in **separate files** (not continuous)
- Each file has **short descriptive name** (e.g., "introduction", "setup", "demo")
- These file names = natural chapter structure
- Feeds file names as `chapter_folder_names` in workflow
- AI uses as authoritative framework

**This is brilliant because:**
- Chapter structure created DURING recording, not after
- Natural workflow alignment
- Provides clear boundaries for AI
- Limited list prevents "too many chapters" problem

### The Full Reality of Chapter Creation

**Actual workflow:**
1. **Step 1**: AI attempts chapters (poor, too many)
2. **Step 2**: Add folder names → AI refines (this helps!)
3. **Step 3**: Manual timestamp assignment by watching video (PAINFUL - doesn't work)
4. **Post-workflow**: David writes final chapter names while watching video

**So really:**
- 10% AI-assisted (Step 2 refinement with folder names)
- 90% manual (timestamp assignment + final naming)

### Human-in-the-Loop Patterns

**Pattern: Human Defines Framework, AI Populates**
- Step 2 demonstrates this perfectly
- Human provides structure (folder names)
- AI refines within that structure
- More effective than pure AI generation

### Dependencies

**Sequential within section:**
```
Section 1 completes (need transcript_abridgement)
  ↓
Section 2, Step 1: Find Chapters (poor quality)
  ↓
Section 2, Step 2: Refine with folder names (works!)
  ↓
Section 2, Step 3: Timestamps (broken - manual)
  ↓
Post-process: Final chapter names (manual)
```

**Cannot parallelize:**
- All 3 steps must run sequentially
- Each depends on previous step output
- But Step 3 doesn't actually work anyway

### Opportunity for Motus

**High-value automation target:**
- Step 3 (timestamp matching) with modern LLMs
- Could eliminate David's most time-consuming manual task
- SRT file processing now feasible with Claude/GPT-4
- Worth prototyping early in Motus implementation

---

## Section 3: B-Roll Suggestions

**Purpose**: Generate visual design guidelines and b-roll prompts for video editors using Midjourney/Leonardo.AI

**Steps**: 4
**Prompts**: 4

---

### Step 1: Design Style List

**RBX Declaration:**
```ruby
step 'Design Style List' do
  input :transcript
  prompt :transcript_design_style_prompt
  output :design_style
end
```

**Prompt File**: `3-1-transcript-design-style.txt`

**Actual Dependencies:**
- ✅ `[transcript]` - Full video transcript

**Output**: `design_style` - List of 10 style ideas (e.g., "Neon Cyberpunk: Vibrant colors with holographic effects...")

**What it does:**
- Analyzes transcript mood, themes, and content
- Generates 10 distinct visual style options for Midjourney images
- Each style has short label + descriptive sentence
- Considers: color schemes, textures, lighting, art styles, time periods, atmosphere

**Dependencies:**
- Requires: Section 1 Step 1 (transcript loaded)
- Can run: After transcript is available

**Human-in-the-Loop:**
- ⚠️ **QUESTION 1**: Do you review and select from the 10 style options, or just use all of them?
- ⚠️ **QUESTION 2**: Is this step actually used in your current workflow?

**Can auto-advance**: ⚠️ UNKNOWN - need to know if human selection needed

---

### Step 2: Intro/Outro B-Roll

**RBX Declaration:**
```ruby
step 'Intro/Outro B-Roll' do
  input :transcript_intro
  input :transcript_outro
  input :design_style
  prompt :intro_outro_design_ideas_prompt
  output :intro_outro_design_ideas
end
```

**Prompt File**: `3-2-intro-outro-design-ideas.txt`

**Actual Dependencies:**
- ✅ `[design_style]` - Style guidelines from Step 1
- ✅ `[transcript_intro]` - Intro text from Section 1 Step 5
- ✅ `[transcript_outro]` - Outro text from Section 1 Step 5

**Output**: `intro_outro_design_ideas` - List of concepts + Midjourney prompts for intro/outro visuals

**What it does:**
- Identifies key concepts/sentences from intro & outro
- Generates 2 Midjourney prompts per concept
- Uses selected design style for consistency
- Creates numbered list of visual concepts

**Dependencies:**
- Requires: Section 1 Step 5 (intro/outro), Section 3 Step 1 (design_style)
- Can run: After Step 1 completes

**Human-in-the-Loop:**
- ⚠️ **QUESTION 3**: Do you review/edit these prompts before sending to Midjourney?
- ⚠️ **QUESTION 4**: Or does someone (video editor) generate the images directly?

**Can auto-advance**: ⚠️ UNKNOWN - need workflow clarity

---

### Step 3: Brief for Video Editor

**RBX Declaration:**
```ruby
step 'Brief for Video Editor' do
  input :video_editor_instructions
  input :intro_outro_design_ideas
  input :chapters
  input :future_video_cta
  input :past_video_cta
  prompt :editor_brief_prompt
  output :editor_brief
end
```

**Prompt File**: `3-3-editor-brief.txt`

**Actual Dependencies:**
- ✅ `[intro_outro_design_ideas]` - From Step 2
- ✅ `[chapters]` - From Section 2 Step 2
- ✅ `[video_editor_instructions]` - Special instructions (human-provided?)
- ✅ `[future_video_cta]` - From Section 1 Step 6
- ✅ `[past_video_cta]` - From Section 1 Step 6

**Output**: `editor_brief` - Instructions for video editor

**What it does:**
- Creates brief for video editor (who knows your systems)
- Includes intro/outro design guidelines
- Includes chapters structure
- Special handling: If past_video_cta exists → needs thumbnail overlay for that specific video

**Dependencies:**
- Requires: Step 2, Section 1 Step 6 (CTAs), Section 2 (chapters)
- Can run: After Step 2 completes

**Human-in-the-Loop:**
- ⚠️ **QUESTION 5**: Who provides `video_editor_instructions`? You? Or is it from config?
- ⚠️ **QUESTION 6**: Do you review/edit this brief before sending to editor?
- ⚠️ **QUESTION 7**: Or does this go directly to your editor?

**Can auto-advance**: ⚠️ UNKNOWN - need to know if review/editing happens

---

### Step 4: Transcript Design Ideas

**RBX Declaration:**
```ruby
step 'Transcript Design Ideas' do
  input :transcript
  input :design_style
  prompt :transcript_design_ideas_prompt
  output :design_ideas
end
```

**Prompt File**: `3-4-transcript-design-ideas.txt`

**Actual Dependencies:**
- ✅ `[transcript]` - Full transcript
- ✅ `[design_style]` - Style from Step 1

**Output**: `design_ideas` - CSV file with visual concepts mapped to transcript sentences + Midjourney prompts

**What it does:**
- Breaks down transcript into visual concepts (1 per sentence or few sentences)
- For each concept: creates 2-3 Midjourney prompts
- Outputs CSV with columns: File, Concept, Sentence, Prompt
- Example: "01-futuristic-city-skyline-1-", "Futuristic city skyline", "In 2050...", "futuristic city with floating buildings..."

**Dependencies:**
- Requires: Section 1 Step 1 (transcript), Section 3 Step 1 (design_style)
- Can run: After Step 1 completes (PARALLEL with Step 2!)

**Human-in-the-Loop:**
- ⚠️ **QUESTION 8**: This CSV goes to someone who generates Midjourney images?
- ⚠️ **QUESTION 9**: Do you review/filter the CSV first?
- ⚠️ **QUESTION 10**: How many images actually get generated? (CSV could be 50+ concepts)

**Can auto-advance**: ⚠️ UNKNOWN - CSV generation likely automatic, but usage unclear

---

### Section 3 Summary

**Execution Flow:**

```
Section 1 Step 5 (intro/outro) ──┐
                                  │
Section 1 Step 1 (transcript) ───┼──→ Step 1: Design Style List
                                  │         ↓
Section 1 Step 6 (CTAs) ─────────┤         design_style
                                  │         ↓
Section 2 (chapters) ────────────┤    ┌────┴────────────┐
                                  │    │                 │
                                  └───→│  Step 2:        │  Step 4:
                                       │  Intro/Outro    │  Transcript Design Ideas
                                       │  B-Roll         │  (PARALLEL!)
                                       └────┬────────────┘
                                            │
                                            ↓
                                       Step 3:
                                       Brief for Video Editor
```

**Dependencies:**
- Step 1: Only needs transcript (can run after Section 1 Step 1)
- Step 2: Needs Step 1 + Section 1 Step 5 (intro/outro) + Section 1 Step 6 (CTAs, but may not exist)
- Step 3: Needs Step 2 + Section 2 (chapters) + video_editor_instructions
- Step 4: Needs Step 1 + transcript (PARALLEL with Step 2!)

**Parallelization Opportunity:**
- Steps 2 and 4 can run in PARALLEL after Step 1 completes
- Both only need design_style from Step 1
- Step 3 must wait for Step 2 to complete

**Time Savings:**
- Sequential: ~6-8 minutes (Step 1: 1-2min, Step 2: 2-3min, Step 3: 1min, Step 4: 2-3min)
- Parallel: ~5-6 minutes (Steps 2+4 run simultaneously)
- Savings: 1-2 minutes

**Human Checkpoints:**
- ⚠️ UNKNOWN: 10 questions about workflow (see individual steps)
- Key questions:
  1. Is design style selection manual or automatic?
  2. Are Midjourney prompts reviewed before image generation?
  3. Who generates the actual images?
  4. Is editor brief reviewed before sending to editor?

**What Actually Works:**
- ❌ **NOTHING - ENTIRE SECTION DEPRECATED**

**Real-World Usage Pattern:**
- ❌ **Step 1: NOT USED** - Multi-select/fork pattern too complex to implement in AWB
  - Would want to test multiple design styles simultaneously (branching)
  - Current workflow doesn't support this pattern
- ❌ **Step 2: TOO SHALLOW** - Not detailed enough for actual use
- ❌ **Step 3: DEPRECATED** - Brief for video editor no longer happens
- ❌ **Step 4: DEPRECATED** - Transcript design ideas no longer used

**Key Insight:**
- B-Roll generation is complex enough to warrant its own **independent workflow**
- Should not be a section within Launch Optimizer
- Would need complete redesign if reactivated

---

## Section 4: Content Analysis

**Purpose**: Deep analysis of video content to extract themes, keywords, audience insights, and competitive intelligence

**Steps**: 3
**Prompts**: 3

**⚡ MAJOR PARALLELIZATION OPPORTUNITY**: All 3 steps only need `transcript_abridgement` → can run 100% in parallel!

---

### Step 1: Content Essence

**RBX Declaration:**
```ruby
step 'Content Essence' do
  input :transcript_abridgement
  input :video_topic_theme        # (Main Topic or Theme)
  input :video_keywords
  input :important_statistics
  input :content_highlights       # (Keywords/Insites/Takeaways/Audience-Related Insights)
  prompt :analyze_content_essence_prompt
  output :video_topic_theme
  output :video_keywords
  output :important_statistics
  output :content_highlights
end
```

**Prompt File**: `4-1-analyze-content-essence.txt`

**Actual Dependencies:**
- ✅ `[transcript_abridgement]` - Condensed transcript from Section 1 Step 3

**Outputs**:
- `video_topic_theme` - Main topic/theme
- `video_keywords` - Relevant keywords
- `important_statistics` - Numbers/stats mentioned
- `content_highlights` - Key takeaways/insights

**What it does:**
- Extracts core content elements
- Identifies main topic/theme
- Lists relevant keywords for SEO
- Notes important statistics/numbers
- Highlights key takeaways

**Dependencies:**
- Requires: Section 1 Step 3 (transcript_abridgement)
- Can run: Immediately after transcript_abridgement available

**Human-in-the-Loop:**
- ⚠️ **QUESTION 1**: Do you review/edit these extracted elements?
- ⚠️ **QUESTION 2**: Or do they feed directly into later steps (title, description, etc.)?

**Can auto-advance**: ⚠️ UNKNOWN - likely auto if feeding into later steps

**Note**: RBX declares inputs that match outputs (refinement pattern). Initial values may come from config or previous runs.

---

### Step 2: Audience Engagement

**RBX Declaration:**
```ruby
step 'Audience Engagement' do
  input :transcript_abridgement
  input :emotional_trigger_tone
  input :overal_tone_style
  input :audience_insights
  input :usp
  prompt :analyze_audience_engagement_prompt
  output :emotional_trigger_tone
  output :overal_tone_style
  output :audience_insights
  output :usp
end
```

**Prompt File**: `4-2-analyze-audience-engagement.txt`

**Actual Dependencies:**
- ✅ `[transcript_abridgement]` - Condensed transcript from Section 1 Step 3

**Outputs**:
- `emotional_trigger_tone` - Emotional triggers/tone
- `overal_tone_style` - Overall tone (formal/casual/humorous)
- `audience_insights` - References to demographics/groups
- `usp` - Unique selling points

**What it does:**
- Identifies emotional triggers that influence audience response
- Determines overall tone/style (with examples)
- Identifies audience-related insights (demographics, references)
- Lists unique selling points (USPs)

**Dependencies:**
- Requires: Section 1 Step 3 (transcript_abridgement)
- Can run: PARALLEL with Step 1 and Step 3!

**Human-in-the-Loop:**
- ⚠️ **QUESTION 3**: Are these insights reviewed/validated?
- ⚠️ **QUESTION 4**: Used for title/thumbnail/description generation?

**Can auto-advance**: ⚠️ UNKNOWN - likely auto

---

### Step 3: CTA/Competitors

**RBX Declaration:**
```ruby
step 'CTA/Competitors' do
  input :transcript_abridgement
  input :cta_phrases
  input :catchy_phrases
  input :questions_posed_or_answered
  input :competitor_search_terms
  prompt :analyze_cta_competitors_prompt
  output :cta_phrases
  output :catchy_phrases
  output :questions_posed_or_answered
  output :competitor_search_terms
end
```

**Prompt File**: `4-3-analyze-cta-competitors.txt`

**Actual Dependencies:**
- ✅ `[transcript_abridgement]` - Condensed transcript from Section 1 Step 3

**Outputs**:
- `cta_phrases` - Call-to-action phrases (NOT generic "like and subscribe")
- `catchy_phrases` - Memorable/unique expressions for marketing
- `questions_posed_or_answered` - Questions for engagement
- `competitor_search_terms` - Keywords for competitor research

**What it does:**
- Extracts specific CTA phrases (not generic ones)
- Identifies catchy/memorable phrases for promotion
- Lists relevant questions (rhetorical or engagement-driving)
- Determines search terms for Google/YouTube competitor research

**Dependencies:**
- Requires: Section 1 Step 3 (transcript_abridgement)
- Can run: PARALLEL with Step 1 and Step 2!

**Human-in-the-Loop:**
- ⚠️ **QUESTION 5**: Do you actually use competitor search terms for research?
- ⚠️ **QUESTION 6**: Are catchy phrases selected for social media posts?

**Can auto-advance**: ⚠️ UNKNOWN - likely auto

---

### Section 4 Summary

**Execution Flow:**

```
Section 1 Step 3 (transcript_abridgement)
                    ↓
    ┌───────────────┼───────────────┐
    │               │               │
    ↓               ↓               ↓
Step 1:         Step 2:         Step 3:
Content         Audience        CTA/
Essence         Engagement      Competitors
    │               │               │
    └───────────────┼───────────────┘
                    ↓
            (All outputs available)
```

**Dependencies:**
- **ALL 3 STEPS**: Only need transcript_abridgement
- **NO INTERDEPENDENCIES**: Steps don't depend on each other
- **PERFECT PARALLELIZATION**: All 3 can run simultaneously

**Parallelization Opportunity:**
- ⚡ **HUGE TIME SAVINGS**
- Sequential: ~6-9 minutes (Step 1: 2-3min, Step 2: 2-3min, Step 3: 2-3min)
- Parallel: ~2-3 minutes (all run simultaneously)
- **Savings: 4-6 minutes** (50-67% reduction!)

**Human Checkpoints:**
- ⚠️ UNKNOWN: 6 questions about usage/review patterns
- Likely all auto-advance if feeding into later sections
- Outputs used in Sections 5-7 (Title/Thumbnail, YouTube Meta, Social Media)

**What Actually Works:**
- ✅ All 3 steps execute successfully and produce output
- ⚠️ **But outputs are mostly INFORMATIONAL/UNUSED**

**Real-World Usage Pattern:**
- **Step 1 (Content Essence):**
  - Keywords are **seeded** (rough starting point) for YouTube description/Twitter
  - Problems: Too many keywords, not quite right quality
  - David manually refines them for actual use
  - Theme, statistics, highlights: ❌ Not used
- **Step 2 (Audience Engagement):** ❌ All outputs discarded (emotional triggers, tone, insights, USPs)
- **Step 3 (CTA/Competitors):** ❌ All outputs discarded (CTA phrases, catchy phrases, questions, search terms)

**Summary:**
- Only partial use of keywords from Step 1
- Everything else generated but not applied
- David reads outputs but doesn't know what to do with them
- **Question:** What could actually be done with this analysis?

**For Motus:**
- Could auto-advance (no human checkpoint needed)
- Consider making these "optional analysis" steps
- Questionable value if 90% of outputs unused

**Pattern Note:**
- All steps use "refinement" pattern: inputs match outputs
- Allows iterative improvement if run multiple times
- Initial values may come from config/templates

---

## Section 5: Title & Thumbnail

**Purpose**: Generate optimized YouTube title and thumbnail concepts

**Steps**: 6 (5 automated + 1 manual external)
**Prompts**: 5

---

### Step 1: Title Ideas

**RBX Declaration:**
```ruby
step 'Title Ideas' do
  input :short_title
  input :video_topic_theme        # (Main Topic or Theme)
  input :content_highlights       # (Keywords/Insites/Takeaways/Audience-Related Insights)
  prompt :title_generation_prompt
  output :title_ideas
end
```

**Prompt File**: `5-1-generate-title.txt`

**Actual Dependencies:**
- ✅ `[short_title]` - From Section 1 Step 1
- ✅ `[video_topic_theme]` - From Section 4 Step 1
- ✅ `[content_highlights]` - From Section 4 Step 1

**Output**: `title_ideas` - 10 YouTube titles

**What it does:**
- Creates 10 YouTube title options
- Under 70 characters for full visibility
- Uses action verbs, curiosity-driven (not clickbait)
- Incorporates keywords and current year for SEO
- Uses brackets, numbers, all caps strategically
- Includes "how-to" solutions for pain points

**Dependencies:**
- Requires: Section 1 Step 1 (short_title), Section 4 Step 1 (theme, highlights)
- Can run: After Section 4 Step 1 completes

**Human-in-the-Loop:**
- ⚠️ **QUESTION 1**: Do you select one title from the 10 options?
- ⚠️ **QUESTION 2**: Or review/refine before selecting?
- ⚠️ **QUESTION 3**: Does selection happen now or later in workflow?

**Can auto-advance**: ⚠️ UNKNOWN - likely needs human selection

---

### Step 2: Thumb Text Ideas

**RBX Declaration:**
```ruby
step 'Thumb Text Ideas' do
  input :video_title
  input :video_topic_theme
  input :content_highlights
  input :title_ideas
  prompt :thumbnail_text_prompt
  output :thumbnail_text
end
```

**Prompt File**: `5-2-generate-thumbnail-text.txt`

**Actual Dependencies:**
- ✅ `[video_title]` - From config or Step 1 selection?
- ✅ `[video_topic_theme]` - From Section 4 Step 1
- ✅ `[title_ideas]` - From Step 1

**Output**: `thumbnail_text` - Table with 3-5 thumbnail text ideas, split into 1-4 parts

**What it does:**
- Creates text for thumbnail overlay (different from title)
- Short, impactful (3-5 words)
- Uses different psychological hook than title
- Split into segments (Part 1, Part 2, Part 3)
- Creates curiosity/urgency
- Complementary to title (different emotional perspective)

**Example output**:
```
| Thumb Text          | Part 1    | Part 2   | Part 3 | Title Idea |
| Build AI Fast!      | Build AI  | Fast!    |        | Agent as Code... |
| Fast AI, No Code    | Fast AI   | No Code  |        | |
```

**Dependencies:**
- Requires: Step 1 (title_ideas), Section 4 Step 1 (theme, highlights)
- Can run: After Step 1 completes (PARALLEL with Step 5!)

**Human-in-the-Loop:**
- ⚠️ **QUESTION 4**: Do you select one thumb text from 3-5 options?
- ⚠️ **QUESTION 5**: Or review/edit before selecting?

**Can auto-advance**: ⚠️ UNKNOWN - likely needs human selection

---

### Step 3: Thumb Text CSV

**RBX Declaration:**
```ruby
step 'Thumb Text CSV' do
  input :thumbnail_text
  prompt :thumbnail_text_csv_prompt
  output :thumbnail_text_csv
end
```

**Prompt File**: `5-3-generate-thumbnail-text-csv.txt`

**Actual Dependencies:**
- ✅ `[thumbnail_text]` - From Step 2

**Output**: `thumbnail_text_csv` - CSV format of thumbnail text table

**What it does:**
- Simple conversion: takes table from Step 2
- Converts to CSV format with headers: "Thumb Text,Part 1,Part 2,Part 3,Title"

**Dependencies:**
- Requires: Step 2 (thumbnail_text)
- Can run: Immediately after Step 2

**Human-in-the-Loop:**
- None (automatic conversion)

**Can auto-advance**: ✅ YES - simple formatting step

---

### Step 4: THUMB THUMB THUMB

**RBX Declaration:**
```ruby
step 'THUMB THUMB THUMB' do
  # https://websim.ai/@wonderwhy_er/youtube-thumbnail-brainstormer
end
```

**No prompt file** - External manual step

**What it does:**
- Links to external tool: websim.ai YouTube thumbnail brainstormer
- Likely manual experimentation/brainstorming step
- Not automated in AWB workflow

**Dependencies:**
- None (manual external tool)

**Human-in-the-Loop:**
- ✅ Fully manual

**Can auto-advance**: ❌ NO - external manual process

**Note**: This step appears to be placeholder/reminder for manual creative process

---

### Step 5: Visual Element Ideas

**RBX Declaration:**
```ruby
step 'Visual Element Ideas' do
  input :video_title
  input :content_highlights
  input :title_ideas
  prompt :thumbnail_visual_elements_prompt
  output :thumbnail_visual_elements
end
```

**Prompt File**: `5-4-thumbnail-visual-elements.txt`

**Actual Dependencies:**
- ✅ `[video_topic_theme]` - From Section 4 Step 1
- ✅ `[content_highlights]` - From Section 4 Step 1
- ✅ `[title_ideas]` - From Step 1

**Output**: `thumbnail_visual_elements` - 3 sets of visual guidelines with prompts

**What it does:**
- Generates 3 distinct visual concepts for thumbnail
- Each set includes:
  1. Visual concept description
  2. Main element(s) to feature
  3. Text to include (if any)
  4. Color scheme/mood
  5. Connection to video content
- Plus 2 prompts per set (primary + secondary visual elements)
- Simple visuals (1-2 elements) for maximum impact

**Dependencies:**
- Requires: Step 1 (title_ideas), Section 4 Step 1 (theme, highlights)
- Can run: After Step 1 completes (PARALLEL with Step 2!)

**Human-in-the-Loop:**
- ⚠️ **QUESTION 6**: Do you select one visual guideline from 3 options?
- ⚠️ **QUESTION 7**: Or used for inspiration/reference?

**Can auto-advance**: ⚠️ UNKNOWN - likely needs human selection/review

---

### Step 6: Create Thumbnail

**RBX Declaration:**
```ruby
step 'Create Thumbnail' do
  input :video_title
  input :thumbnail_text
  input :transcript_abridgement
  prompt :thumbnail_prompt
  output :thumbnail_image
end
```

**Prompt File**: `5-5-thumbnail.txt`

**Actual Dependencies:**
- ✅ `[video_title]` - From Step 1 selection or config
- ✅ `[thumbnail_text]` - From Step 2
- ✅ `[transcript_abridgement]` - From Section 1 Step 3

**Output**: `thumbnail_image` - Leonardo AI prompt for generating thumbnail

**What it does:**
- Creates Leonardo AI prompt for 16:9 YouTube thumbnail
- Visually captures core idea/emotion from title + description
- Vivid, eye-catching, clean (optimized for small screens)
- Leaves space for text OR integrates text as design element
- Simple structure, clear focus, bold contrast
- Can pick one line from thumbnail_text options

**Dependencies:**
- Requires: Step 2 (thumbnail_text), Section 1 Step 3 (transcript_abridgement)
- Can run: After Step 2 completes

**Human-in-the-Loop:**
- ⚠️ **QUESTION 8**: Do you manually run this prompt in Leonardo AI?
- ⚠️ **QUESTION 9**: Or is there automation/integration?
- ⚠️ **QUESTION 10**: Do you iterate on the prompt based on results?

**Can auto-advance**: ⚠️ UNKNOWN - prompt generation yes, but image creation likely manual

---

### Section 5 Summary

**Execution Flow:**

```
Section 1 Step 1 (short_title) ────────┐
Section 4 Step 1 (theme, highlights) ──┼──→ Step 1: Title Ideas
                                       │         ↓
Section 1 Step 3 (abridgement) ────────┤      title_ideas
                                       │         ↓
                                       │    ┌────┴─────────────┐
                                       │    │                  │
                                       │    ↓                  ↓
                                       └─→ Step 2:          Step 5:
                                          Thumb Text       Visual Element
                                          Ideas            Ideas
                                             ↓              (PARALLEL!)
                                          thumbnail_text
                                             ↓
                                          Step 3:
                                          Thumb Text CSV
                                             ↓
                                          thumbnail_text_csv
                                             │
                                             ├──→ Step 4: THUMB THUMB THUMB
                                             │    (manual external)
                                             │
                                             └──→ Step 6: Create Thumbnail
                                                  thumbnail_image (Leonardo AI prompt)
```

**Dependencies:**
- Step 1: Needs Section 1 Step 1 + Section 4 Step 1
- Step 2: Needs Step 1 (can run PARALLEL with Step 5 after Step 1)
- Step 3: Needs Step 2 (auto-conversion)
- Step 4: Manual external (no dependencies)
- Step 5: Needs Step 1 (can run PARALLEL with Step 2 after Step 1)
- Step 6: Needs Step 2 + Section 1 Step 3

**Parallelization Opportunity:**
- Steps 2 and 5 can run in PARALLEL after Step 1 completes
- Both need title_ideas but don't depend on each other
- Time savings: ~1-2 minutes

**Time Estimate:**
- Sequential: ~8-10 minutes (Step 1: 2min, Step 2: 2min, Step 3: 30sec, Step 5: 2min, Step 6: 2min, Step 4: manual)
- Parallel: ~7-8 minutes (Steps 2+5 parallel)
- Savings: ~1-2 minutes

**Human Checkpoints:**
- ⚠️ UNKNOWN: 10 questions about selection/review/iteration patterns
- Key questions:
  1. When/how is final title selected from 10 options?
  2. When/how is thumbnail text selected from 3-5 options?
  3. How are visual guidelines used (selection or inspiration)?
  4. Is Leonardo AI generation automated or manual?

**What Actually Works:**
- ✅ **Step 1 (Title Ideas): ACTIVELY USED**
  - Generates 10 titles, David selects one
  - **Future enhancement:** Support A/B testing (1-3 title options for YouTube A/B testing)
  - **Use case:** Sometimes want shortlist for testing or multiple title conversations
- ⚠️ **Step 2 (Thumb Text Ideas): INFORMATIONAL**
  - Generates complementary text for thumbnail overlay
  - Problem: Prompts not good enough yet to get correct information
  - David reads for ideas but doesn't directly use output
- ❌ **Step 3 (Thumb Text CSV): DOESN'T WORK WELL**
  - Transforms Step 2 data to CSV for copy/paste into Canva
  - Reality: Never works that well
- 🔄 **Step 4 (THUMB THUMB THUMB): NEEDS RETHINKING**
  - External manual tool (websim.ai)
  - David looking at design tools to replace/improve this
- ❌ **Step 5 (Visual Element Ideas): NOT USED YET**
  - Generates 3 visual concept guidelines
  - Would be useful with multiple guidelines
  - Thumbnail design complex enough to be its own workflow (like B-Roll)
- ❌ **Step 6 (Create Thumbnail): NOT USED YET**
  - Generates Leonardo AI prompt for thumbnail
  - Not used

**Real-World Usage Pattern:**
- Only Step 1 actively used (title generation)
- Step 2 informational (prompts need improvement)
- Steps 3-6 not used or need rethinking
- **Key insight:** Thumbnail generation incomplete/needs work
- Similar to B-Roll: Thumbnail design may need to be its own independent workflow

**For Motus:**
- Step 1: Implement with A/B testing support (1-3 title outputs)
- Steps 2-6: Low priority or defer until thumbnail workflow designed

---

## Section 6: YouTube Meta Data

**Purpose**: Generate YouTube description, pinned comment, and metadata

**Steps**: 6 (4 implemented + 2 placeholders)
**Prompts**: 4 (2 empty placeholders)

---

### Step 1: Simple Description

**RBX Declaration:**
```ruby
step 'Simple Description' do
  input :video_title
  input :video_keywords
  input :transcript_abridgement
  prompt :yt_simple_description_prompt
  output :video_simple_description
end
```

**Prompt File**: `6-1-yt-simple-description.txt`

**Actual Dependencies:**
- ✅ `[video_title]` - From Section 5 Step 1 (or config)
- ✅ `[video_keywords]` - From Section 4 Step 1
- ✅ `[transcript_abridgement]` - From Section 1 Step 3

**Output**: `video_simple_description` - Simple description (<1000 chars)

**What it does:**
- Creates SEO-optimized YouTube description
- Focuses on essence of video
- Weaves in keywords naturally (no keyword section)
- Under 1000 characters
- Simple version to be embedded in final description (Step 2)

**Dependencies:**
- Requires: Section 1 Step 3 (abridgement), Section 4 Step 1 (keywords), Section 5 Step 1 (title)
- Can run: After all dependencies available

**Human-in-the-Loop:**
- ⚠️ **QUESTION 1**: Do you review/edit this simple description?
- ⚠️ **QUESTION 2**: Or auto-advance to Step 2?

**Can auto-advance**: ⚠️ UNKNOWN - likely auto

---

### Step 2: Write Description

**RBX Declaration:**
```ruby
step 'Write Description' do
  input :video_title
  input :chapters
  input :video_simple_description
  input :brand_info
  input :fold_cta
  input :primary_cta
  input :affiliate_cta
  input :video_related_links
  input :video_keywords
  prompt :yt_description_prompt
  output :video_description
end
```

**Prompt File**: `6-2-yt-write-description.txt`

**Actual Dependencies:**
- ✅ `[video_simple_description]` - From Step 1
- ✅ `[fold_cta]` - From config (above-the-fold CTA)
- ✅ `[primary_cta]` - From config
- ✅ `[chapters]` - From Section 2 Step 2
- ✅ `[brand_info]` - From config
- ✅ `[affiliate_cta]` - From config
- ✅ `[video_related_links]` - From config
- ✅ `[video_keywords]` - From Section 4 Step 1

**Output**: `video_description` - Full YouTube description with structure

**What it does:**
- Assembles complete YouTube description with sections:
  1. Above the fold (40 words, primary keyword early, clickable fold_cta link)
  2. Simple Description (from Step 1)
  3. Chapters (from Section 2)
  4. Related Videos (video_related_links)
  5. Secondary CTAs/Affiliate Links (affiliate_cta)
  6. Brand/Social Links (brand_info)
  7. End Note/Closing Statement
  8. #Keyword1, #Keyword2 (hashtag format)
  9. Legal Disclosure
- Natural flow (not rigid article formatting)
- Scattered emojis for engagement

**Dependencies:**
- Requires: Step 1 (simple_description), Section 2 (chapters), Section 4 Step 1 (keywords), config (CTAs, brand)
- Can run: After Step 1 completes

**Human-in-the-Loop:**
- ⚠️ **QUESTION 3**: Do you review/edit the assembled description?
- ⚠️ **QUESTION 4**: Or auto-advance to Step 3 (formatting)?

**Can auto-advance**: ⚠️ UNKNOWN - likely needs review given importance

---

### Step 3: Format Description

**RBX Declaration:**
```ruby
step 'Format Description' do
  input :video_description
  prompt :yt_format_description_prompt
  output :video_description
end
```

**Prompt File**: `6-3-yt-format-description.txt`

**Actual Dependencies:**
- ✅ `[video_description]` - From Step 2

**Output**: `video_description` - YouTube-formatted description (overwrites input)

**What it does:**
- Converts markdown-like formatting to YouTube format
- Headings: Use #, ##, ### (same as markdown)
- Bold: Single asterisk `*` (NOT double `**`)
  - Example: `**Chapters**` → `*Chapters*`
- Hyperlinks: Raw URLs only (strip markdown format)
  - Example: `[https://appydave.com](https://appydave.com)` → `https://appydave.com`
- Remove horizontal lines `---`

**Dependencies:**
- Requires: Step 2 (video_description)
- Can run: Immediately after Step 2

**Human-in-the-Loop:**
- None (automatic formatting)

**Can auto-advance**: ✅ YES - simple formatting conversion

---

### Step 4: Custom GPT Description

**RBX Declaration:**
```ruby
step 'Custom GPT Description' do
  input :video_title
  input :chapters
  input :transcript_abridgement
  input :brand_info
  input :fold_cta
  input :primary_cta
  input :affiliate_cta
  input :video_related_links
  input :video_keywords
  prompt :yt_description_custom_gpt_prompt
  output :video_description_custom_gpt
end
```

**Prompt File**: `6-4-yt-description-custom-gpt.txt`

**Actual Dependencies:**
- ✅ `[video_title]` - From Section 5 Step 1
- ✅ `[video_keywords]` - From Section 4 Step 1
- ✅ `[chapters]` - From Section 2 Step 2
- ✅ `[brand_info]` - From config
- ✅ `[fold_cta]` - From config
- ✅ `[primary_cta]` - From config
- ✅ `[affiliate_cta]` - From config
- ✅ `[video_related_links]` - From config
- ✅ `[transcript_abridgement]` - From Section 1 Step 3

**Output**: `video_description_custom_gpt` - Alternative description using custom GPT

**What it does:**
- Alternative path to create YouTube description
- Uses custom GPT with commands: CREATE, HASHTAGS, HELP
- Produces structured description with SEO focus
- Separate output from Steps 1-3 pipeline

**Dependencies:**
- Requires: Section 1 Step 3, Section 2 Step 2, Section 4 Step 1, Section 5 Step 1, config
- Can run: PARALLEL with Steps 1-3! (no interdependencies)

**Human-in-the-Loop:**
- ⚠️ **QUESTION 5**: Do you compare output from Step 3 vs Step 4?
- ⚠️ **QUESTION 6**: Or only use one path (either 1-3 or 4)?
- ⚠️ **QUESTION 7**: Is custom GPT a specific GPT you've created?

**Can auto-advance**: ⚠️ UNKNOWN - depends on usage pattern

---

### Step 5: Pinned Comment

**RBX Declaration:**
```ruby
step 'Pinned Comment' do
  # I don't need all these, but not sure which ones I do need yet
  input :video_title
  input :transcript_abridgement
  input :chapters
  input :brand_info
  input :fold_cta
  input :primary_cta
  input :affiliate_cta
  input :video_related_links
  input :video_keywords
  input :video_description
  prompt :yt_pinned_comment_prompt
  output :video_pinned_comment
end
```

**Prompt File**: `6-5-yt-pinned-comment.txt` (EMPTY - not implemented)

**What it does:**
- ❌ **NOT IMPLEMENTED**
- Intended to create pinned comment for YouTube video
- Comment in RBX: "I don't need all these, but not sure which ones I do need yet"

**Status**: Placeholder/future feature

---

### Step 6: Extra Metadata

**RBX Declaration:**
```ruby
step 'Extra Metadata' do
  input :video_title
  input :transcript_abridgement
  prompt :yt_metadata_prompt
  output :video_metadata
end
```

**Prompt File**: `6-6-yt-meta-data.txt` (EMPTY - not implemented)

**What it does:**
- ❌ **NOT IMPLEMENTED**
- Intended to generate additional YouTube metadata
- Tags? Category? Other fields?

**Status**: Placeholder/future feature

---

### Section 6 Summary

**Execution Flow:**

```
Section 1 Step 3 (abridgement) ──────┐
Section 2 Step 2 (chapters) ─────────┤
Section 4 Step 1 (keywords) ─────────┼──→ Step 1: Simple Description
Section 5 Step 1 (title) ────────────┤         ↓
Config (CTAs, brand, links) ─────────┤      video_simple_description
                                     │         ↓
                                     ├────→ Step 2: Write Description
                                     │         ↓
                                     │      video_description
                                     │         ↓
                                     │      Step 3: Format Description
                                     │         ↓
                                     │      video_description (formatted)
                                     │
                                     └────→ Step 4: Custom GPT Description
                                               ↓
                                            video_description_custom_gpt
                                            (PARALLEL PATH!)
```

**Dependencies:**
- Steps 1-3: Sequential pipeline
  - Step 1 → Step 2 → Step 3
- Step 4: Independent parallel path
  - Can run simultaneously with Steps 1-3
- Steps 5-6: Not implemented

**Parallelization Opportunity:**
- ⚡ Step 4 can run in PARALLEL with Steps 1-3
- Both produce YouTube descriptions
- Likely compare/choose between outputs
- Time savings: None (same duration), but provides options

**Time Estimate:**
- Steps 1-3 Sequential: ~3-4 minutes (Step 1: 1min, Step 2: 2min, Step 3: 30sec)
- Step 4 (if used): ~2-3 minutes
- Total if both paths: ~3-4 minutes (parallel)

**Human Checkpoints:**
- ⚠️ UNKNOWN: 7 questions about review/selection patterns
- Key questions:
  1. Is simple description (Step 1) reviewed?
  2. Is full description (Step 2) reviewed before formatting?
  3. Are both description paths (1-3 vs 4) used? Compared?
  4. How is final description selected/approved?

**What Actually Works:**
- ✅ **Steps 1-3: FULLY WORKING SEQUENTIAL PIPELINE**
  - Step 1 (Simple Description): Auto-advances (occasionally needs manual refinement later)
  - Step 2 (Write Description): Auto-advances - assembles full 9-section YouTube description
  - Step 3 (Format Description): Auto-advances - converts markdown → YouTube format
  - All three steps run sequentially without human checkpoints
- ❌ **Step 4 (Custom GPT Description): DEPRECATED** - Alternative parallel path not used
- ❌ **Step 5 (Pinned Comment): DEPRECATED** - Not implemented
- ❌ **Step 6 (Extra Metadata): DEPRECATED** - Not implemented

**Real-World Usage Pattern:**
- Steps 1-3 form a working auto-advance pipeline
- Step 1 output occasionally needs manual refinement after the fact
- Steps 4-6 all deprecated/unused

**For Motus:**
- Implement Steps 1-3 as sequential auto-advance pipeline
- Optional: Allow manual review/edit hook after Step 1 if refinement needed
- Skip Steps 4-6 entirely

---

## Section 7: Social Media Posts

**Purpose**: Generate social media posts for Twitter, Facebook, and LinkedIn to promote YouTube video

**Steps**: 4 (2 implemented + 2 placeholders)
**Prompts**: 4 (1 empty, 1 minimal)

**⚡ MAJOR PARALLELIZATION OPPORTUNITY**: Steps 1-3 have NO interdependencies → can run 100% in parallel!

---

### Step 1: Create Tweet

**RBX Declaration:**
```ruby
step 'Create Tweet' do
  input :video_title
  input :video_link
  input :video_link_playlist
  input :video_keywords
  input :transcript_summary
  prompt :tweet_prompt
  output :tweet_content
end
```

**Prompt File**: `7-1-create-tweet.txt`

**Actual Dependencies:**
- ✅ `[video_title]` - From Section 5 Step 1
- ✅ `[video_link]` - From config
- ✅ `[transcript_summary]` - From Section 1 Step 2
- ✅ `[content_highlights]` - From Section 4 Step 1 (in prompt but not RBX)
- ✅ `[video_keywords]` - From Section 4 Step 1

**Output**: `tweet_content` - Twitter post (280 chars)

**What it does:**
- Creates engaging tweet promoting video
- Captures video essence in tweet format
- 280-character limit including link + hashtags
- Highlights key points to intrigue viewers
- 1-3 hashtags from keywords
- Video link near end, hashtags after

**Dependencies:**
- Requires: Section 1 Step 2 (summary), Section 4 Step 1 (keywords, highlights), Section 5 Step 1 (title), config (link)
- Can run: PARALLEL with Steps 2 & 3 (no interdependencies!)

**Human-in-the-Loop:**
- ⚠️ **QUESTION 1**: Do you review/edit tweet before posting?
- ⚠️ **QUESTION 2**: Or does it auto-post somewhere?

**Can auto-advance**: ⚠️ UNKNOWN - likely needs review

---

### Step 2: Create FB Post

**RBX Declaration:**
```ruby
step 'Create FB Post' do
  input :transcript_summary
  input :video_keywords
  prompt :facebook_post_prompt
  output :facebook_post
end
```

**Prompt File**: `7-2-create-fb-post.txt` (EMPTY - not implemented)

**What it does:**
- ❌ **NOT IMPLEMENTED**
- Intended to create Facebook post

**Status**: Placeholder/future feature

---

### Step 3: Create LinkedIn Post

**RBX Declaration:**
```ruby
step 'Create LinkedIn Post' do
  input :video_title
  input :video_link
  input :video_link_playlist
  input :video_keywords
  input :transcript_abridgement
  prompt :linkedin_post_prompt
  output :linkedin_post
end
```

**Prompt File**: `7-3-create-linkedin-post.txt`

**Actual Dependencies:**
- ✅ `[video_title]` - From Section 5 Step 1
- ✅ `[video_link]` - From config
- ✅ `[transcript_abridgement]` - From Section 1 Step 3
- (RBX declares video_keywords but prompt doesn't use it)

**Output**: `linkedin_post` - LinkedIn article post (1300-1700 chars)

**What it does:**
- Creates professional LinkedIn article post
- Attention-grabbing headline with keywords
- Engaging intro (value proposition)
- 2-3 key points from abridgement
- Call-to-action to watch video
- 3-5 relevant hashtags
- Professional tone
- Optimal length: 1300-1700 characters
- Formatted with line breaks, sparse emojis

**Dependencies:**
- Requires: Section 1 Step 3 (abridgement), Section 5 Step 1 (title), config (link)
- Can run: PARALLEL with Steps 1 & 3 (no interdependencies!)

**Human-in-the-Loop:**
- ⚠️ **QUESTION 3**: Do you review/edit LinkedIn post?
- ⚠️ **QUESTION 4**: Or auto-post to LinkedIn?

**Can auto-advance**: ⚠️ UNKNOWN - likely needs review

---

### Step 4: Add To Video List

**RBX Declaration:**
```ruby
step 'Add To Video List' do
  input :project_folder
  input :video_title
  input :video_link
  input :video_link_playlist
  prompt :add_to_video_list_prompt
  output :video_references
end
```

**Prompt File**: `7-4-add-to-video-list.txt` (MINIMAL - just placeholder text)

**Actual Dependencies:**
- ✅ `[project_folder]` - From config
- ✅ `[video_title]` - From Section 5 Step 1
- ✅ `[video_link]` - From config

**Output**: `video_references` - Updated video list

**What it does:**
- Adds video to master video list/database
- Tracks: project folder, title, link, playlist link
- Minimal prompt (just lists placeholders - not fully implemented)

**Dependencies:**
- Requires: Section 5 Step 1 (title), config (folder, links)
- Can run: After title available

**Human-in-the-Loop:**
- ⚠️ **QUESTION 5**: Is this a manual database update?
- ⚠️ **QUESTION 6**: Or automated append to file/spreadsheet?

**Can auto-advance**: ⚠️ UNKNOWN - depends on implementation

**Note**: RBX comment references example video: "b09-synthesize-chat-confo / How to Create Structured Docs from AI Chats FAST / https://youtu.be/l86EwdhS4hY"

---

### Section 7 Summary

**Execution Flow:**

```
Section 1 Step 2 (summary) ──────┐
Section 1 Step 3 (abridgement) ──┤
Section 4 Step 1 (keywords) ─────┼──→ ┌─────────────────┐
Section 5 Step 1 (title) ────────┤    │  Step 1: Tweet  │
Config (links) ──────────────────┤    │  Step 3: LinkedIn │
                                 │    │  (PARALLEL!)    │
                                 │    └─────────────────┘
                                 │            ↓
                                 └──────→ Step 4: Add To Video List
```

**Dependencies:**
- Steps 1 & 3: Independent (can run in PARALLEL)
- Step 2: Not implemented
- Step 4: Only needs title (can run anytime after Section 5)

**Parallelization Opportunity:**
- ⚡ **HUGE TIME SAVINGS**
- Steps 1 and 3 can run 100% in parallel
- Sequential: ~4-5 minutes (Step 1: 2min, Step 3: 2-3min, Step 4: 30sec)
- Parallel: ~2-3 minutes (Steps 1+3 simultaneously, then Step 4)
- **Savings: 2 minutes** (40-50% reduction!)

**Human Checkpoints:**
- ⚠️ UNKNOWN: 6 questions about posting automation
- Likely all posts need human review before publishing

**What Actually Works:**
- ✅ **Step 1 (Create Tweet): ACTIVELY USED**
  - Generates 5 tweets (not just 1)
  - David walks through and picks one
  - Sometimes merges 2 tweets in conversational nature
  - Requires human review/selection
- ❌ **Step 2 (Create FB Post): POOR PROMPT - NOT USED**
  - Prompt quality too low, not currently used
  - Would like to use it if improved
  - **Future enhancement:** Need multiple FB posts for different target audiences
- ✅ **Step 3 (Create LinkedIn Post): ACTIVELY USED**
  - Generally pretty good as-is
  - Minimal editing needed
  - Can run in PARALLEL with Step 1
- 🔧 **Step 4 (Add To Video List): NEEDS IMPLEMENTATION**
  - Should be JSON/spreadsheet append operation
  - Currently just placeholder prompt
  - Needs proper implementation

**Real-World Usage Pattern:**
- Steps 1 & 3 actively used with human review
- Step 2 not used (poor prompt quality)
- Step 4 needs proper implementation
- Steps 1 & 3 can run in parallel (2-minute savings)

**Future Needs:**
- **Skool community posts** - new platform to support
- Multiple audience-targeted posts per platform (Facebook, Skool, etc.)

**For Motus:**
- Step 1: Implement with 5 tweet options + human selection/merge capability
- Step 2: Improve prompt quality, add multi-audience support
- Step 3: Implement as-is (working well)
- Step 4: Implement as JSON/spreadsheet append operation

---

## Section 8: YouTube Shorts

**Purpose**: Generate titles, descriptions, and tweets for YouTube Shorts (short-form videos)

**Steps**: 3
**Prompts**: 4 (1 extra context prompt)

**Note**: This section processes SHORT videos (Shorts), separate from main long-form video

---

### Context Prompt (Not a Step)

**Prompt File**: `8-1-create-shorts-context.txt`

**What it does:**
- Provides context from long-form video abridgement
- "Read and absorb" instruction for AI
- Shorts transcripts are priority, but long-form provides context
- Not a workflow step - likely used as system message or prefix

**Input**: `[transcript_abridgement]` - From Section 1 Step 3 (long-form video)

---

### Step 1: Create Shorts Title

**RBX Declaration:**
```ruby
step 'Create Shorts Title' do
  input :short_transcription
  prompt :shorts_title_prompt
  output :shorts_title
end
```

**Prompt File**: `8-2-create-shorts-title.txt`

**Actual Dependencies:**
- ✅ `[short_transcription]` - Transcript of SHORT video (external input)

**Output**: `shorts_title` - 10 YouTube Shorts title options

**What it does:**
- Creates 10 YouTube Shorts titles
- Under 70 characters
- Action verbs, curiosity-driven
- Keywords + current year for SEO
- Brackets, numbers, all caps strategically
- How-to solutions for pain points

**Dependencies:**
- Requires: short_transcription (external - from Shorts video)
- Can run: Immediately (independent of main workflow)

**Human-in-the-Loop:**
- ⚠️ **QUESTION 1**: Do you select one title from 10 options?
- ⚠️ **QUESTION 2**: Or review/refine before selecting?

**Can auto-advance**: ⚠️ UNKNOWN - likely needs human selection

---

### Step 2: Create Shorts Description

**RBX Declaration:**
```ruby
step 'Create Shorts Description' do
  input :shorts_title
  input :short_transcription
  input :shorts_video_link
  input :shorts_video_keywords
  prompt :shorts_description_prompt
  output :shorts_description
end
```

**Prompt File**: `8-3-create-shorts-description.txt`

**Actual Dependencies:**
- ✅ `[shorts_title]` - From Step 1
- ✅ `[short_transcription]` - Shorts transcript (external)
- ✅ `[video_keywords]` - Shorts keywords (external or from Section 4?)

**Output**: `shorts_description` - YouTube Shorts description (<1000 chars)

**What it does:**
- Creates SEO-optimized Shorts description
- Under 1000 characters
- Weaves in keywords naturally
- Based on shorts_title for guidance
- YouTube guidelines compliance

**Dependencies:**
- Requires: Step 1 (shorts_title), external (transcription, keywords)
- Can run: After Step 1 completes

**Human-in-the-Loop:**
- ⚠️ **QUESTION 3**: Do you review/edit description?

**Can auto-advance**: ⚠️ UNKNOWN - likely auto or quick review

---

### Step 3: Create Tweet

**RBX Declaration:**
```ruby
step 'Create Tweet' do
  input :shorts_title
  input :short_transcription
  input :shorts_video_link
  input :shorts_video_keywords
  prompt :shorts_tweet_prompt
  output :shorts_tweet
end
```

**Prompt File**: `8-4-create-shorts-tweet.txt`

**Actual Dependencies:**
- ✅ `[shorts_title]` - From Step 1
- ✅ `[shorts_video_link]` - External (Shorts link)
- ✅ `[shorts_video_keywords]` - External
- ✅ `[shorts_transcription]` - External (note: typo in RBX, correct in prompt)
- ✅ `[video_keywords]` - External

**Output**: `shorts_tweet` - Twitter post for Shorts (280 chars)

**What it does:**
- Creates engaging tweet for Shorts video
- 280-character limit including link + hashtags
- 1-3 hashtags from keywords
- Video link near end

**Dependencies:**
- Requires: Step 1 (shorts_title), external (link, transcription, keywords)
- Can run: After Step 1 completes (PARALLEL with Step 2!)

**Human-in-the-Loop:**
- ⚠️ **QUESTION 4**: Do you review tweet before posting?

**Can auto-advance**: ⚠️ UNKNOWN - likely needs review

---

### Section 8 Summary

**Execution Flow:**

```
External Inputs:
- short_transcription
- shorts_video_link
- shorts_video_keywords

        ↓
    Step 1: Create Shorts Title
        ↓
     shorts_title
        ↓
   ┌────┴─────────┐
   │              │
   ↓              ↓
Step 2:        Step 3:
Create         Create
Description    Tweet
(PARALLEL!)
```

**Dependencies:**
- Step 1: Independent (only needs external shorts transcript)
- Steps 2 & 3: Both depend on Step 1 (shorts_title)
- Steps 2 & 3: Can run in PARALLEL after Step 1

**Parallelization Opportunity:**
- Steps 2 and 3 can run in PARALLEL after Step 1
- Time savings: ~1 minute

**Time Estimate:**
- Sequential: ~4-5 minutes (Step 1: 2min, Step 2: 1-2min, Step 3: 1min)
- Parallel: ~3-4 minutes (Step 1, then Steps 2+3 parallel)
- Savings: ~1 minute

**Human Checkpoints:**
- ⚠️ UNKNOWN: 4 questions about review/selection
- Likely title selection (Step 1) and tweet review (Step 3) need human input

**What Actually Works:**
- All 3 steps fully implemented
- Context prompt provides helpful background from long-form video

**Real-World Usage Pattern:**
- ❌ **NEEDS TO BE SPLIT OFF INTO OWN WORKFLOW**
- Should NOT be a section within Launch Optimizer
- Should be separate "YouTube Shorts Optimizer" workflow
- Processes completely different input (Shorts videos vs long-form videos)

**Key Note:**
- Section 8 is INDEPENDENT from Sections 1-7
- Processes different input (Shorts transcripts, not main video)
- Similar to B-Roll and Thumbnail design: complex enough to warrant own workflow

**For Motus:**
- Remove from Launch Optimizer
- Create separate "YouTube Shorts Optimizer" workflow
- Can reference long-form video context if Shorts are clips from main video

---

## SUMMARY: What Actually Works

### Core Launch Optimizer Workflow (Sections to Keep)

**✅ SECTION 1: Video Preparation (6 steps)**
- Step 1: Configure ✅ Auto-advance
- Step 2: Script Summary ✅ Auto-advance (can run PARALLEL with Steps 3, 5, 6)
- Step 3: Script Abridgement ✅ Auto-advance (can run PARALLEL with Steps 2, 5, 6)
- Step 4: Abridge QA ⚠️ Human checkpoint (~20% need fixes, 1-3 correction rounds)
- Step 5: Intro/Outro Separation ✅ Auto-advance (can run PARALLEL with Steps 2, 3, 6)
- Step 6: Find CTA ❌ Not used (but could be in future)

**✅ SECTION 2: Build Chapters (3 steps)**
- Step 1: Find Chapters ⚠️ Poor quality (generates too many)
- Step 2: Refine Chapters ✅ ONLY STEP THAT HELPS (uses folder names from recording)
- Step 3: Create Chapters ❌ COMPLETELY BROKEN (David does manually - most hated task)
- **HIGH-VALUE opportunity:** Step 3 automation with modern LLMs

**❌ SECTION 3: B-Roll Suggestions (4 steps) - ENTIRE SECTION DEPRECATED**
- Needs to be own independent workflow
- Too complex for section within Launch Optimizer

**⚠️ SECTION 4: Content Analysis (3 steps) - INFORMATIONAL/UNUSED**
- All 3 steps run successfully but outputs mostly discarded
- Only keywords partially used (too many, not quite right)
- Could auto-advance but questionable value

**✅ SECTION 5: Title & Thumbnail (6 steps)**
- Step 1: Title Ideas ✅ ACTIVELY USED (select from 10 options, want A/B testing support)
- Steps 2-6: Not used or need rethinking
- **Note:** Thumbnail design may need own workflow (like B-Roll)

**✅ SECTION 6: YouTube Meta Data (6 steps)**
- Steps 1-3: ✅ FULLY WORKING AUTO-ADVANCE PIPELINE
  - Step 1: Simple Description (occasionally needs refinement)
  - Step 2: Write Description (9-section structure)
  - Step 3: Format Description (markdown → YouTube)
- Steps 4-6: ❌ All deprecated

**✅ SECTION 7: Social Media Posts (4 steps)**
- Step 1: Create Tweet ✅ ACTIVELY USED (5 options, human picks/merges)
- Step 2: Create FB Post ❌ Poor prompt (want to use if improved)
- Step 3: Create LinkedIn Post ✅ ACTIVELY USED (works well as-is)
- Step 4: Add To Video List 🔧 Needs JSON/spreadsheet implementation
- **Steps 1 & 3 run in PARALLEL**

**❌ SECTION 8: YouTube Shorts (3 steps) - SPLIT OFF TO OWN WORKFLOW**
- Completely independent from main workflow
- Should be separate "YouTube Shorts Optimizer" workflow

---

### Workflows to Split Off

1. **B-Roll Suggestions Workflow** (from Section 3)
2. **Thumbnail Design Workflow** (from Section 5 Steps 2-6)
3. **YouTube Shorts Optimizer Workflow** (from Section 8)

---

### Actual Step Count

**Original AWB:** 8 sections, 35 steps

**Actually Used in Core Workflow:**
- Section 1: 5-6 steps (Step 6 not used but could be)
- Section 2: 2 steps actively work, 1 broken (high-value fix opportunity)
- Section 3: 0 steps (deprecated)
- Section 4: 3 steps run but outputs mostly unused
- Section 5: 1 step actively used
- Section 6: 3 steps actively used
- Section 7: 2 steps actively used, 1 needs implementation, 1 poor prompt
- Section 8: 0 steps (split off)

**Core Working Steps:** ~16-18 steps (vs 35 designed)

---

### Parallelization Opportunities

**Section 1:** 4 steps parallel (Steps 2, 3, 5, 6) → 4-5 minute savings
**Section 4:** 3 steps parallel (if kept) → 4-6 minute savings
**Section 7:** 2 steps parallel (Steps 1, 3) → 2 minute savings

**Total potential savings:** 10-13 minutes through parallelization

---

### Human Checkpoints Required

1. **Section 1 Step 4:** Abridge QA (~20% need fixes)
2. **Section 2 Step 2:** Refine Chapters (folder names input)
3. **Section 2 Step 3:** Create Chapters (currently manual - broken)
4. **Section 5 Step 1:** Title selection (1 from 10, future: A/B testing)
5. **Section 7 Step 1:** Tweet selection (1 from 5, sometimes merge)
6. **Section 7 Step 3:** LinkedIn post review (minimal edits)

---

### Future Enhancements

1. **A/B Testing:** Support 1-3 title options (Section 5 Step 1)
2. **Multi-Audience Posts:** Facebook/Skool posts for different audiences (Section 7)
3. **Chapter Automation:** Fix Step 3 with modern LLMs (HIGH VALUE)
4. **Skool Platform:** Add Skool community post generation
5. **Improved FB Prompt:** Make Step 2 usable (Section 7)

---

## General Rules & Patterns

[TO BE SYNTHESIZED AFTER STEP-BY-STEP ANALYSIS]

### Dependency Types
[TO BE FILLED]

### Human-in-the-Loop Patterns
[TO BE FILLED]

### Parallelization Opportunities
[TO BE FILLED]

### Sequential Requirements
[TO BE FILLED]

---

## Document Status

- **Created**: 2025-10-12
- **Status**: In Progress - Section 1 questioning phase
- **Next**: Answer Section 1 questions, then proceed to Section 2
