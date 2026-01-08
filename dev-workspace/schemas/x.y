What *new Creates

  Single prompt artifact set consisting of:

  1. One Handlebars template (.hbs file) - the actual prompt
  2. One JSON schema - defines input data structure
  3. One mock data file (optional) - sample test data

  It does NOT create a workflow - it creates the artifacts that a workflow would use.

  ---
  Where Files Go (Current Configuration)

  You're in DEVELOPMENT mode, so based on poem-core-config.yaml:

  | Artifact  | Location                                |
  |-----------|-----------------------------------------|
  | Template  | dev-workspace/prompts/                  |
  | Schema    | dev-workspace/schemas/                  |
  | Mock Data | dev-workspace/mock-data/ (if generated) |

  ---
  Example: Prompt Called "ABC"

  Important: The workflow requires kebab-case names, so "ABC" would need to be "abc" (or suggest a descriptive name like "generate-abc-content").

  If you said *new and named it "abc", it would create:

  dev-workspace/
  ├── prompts/
  │   └── abc.hbs           ← Your Handlebars prompt template
  ├── schemas/
  │   └── abc.json          ← JSON schema for input validation
  └── mock-data/
      └── abc.json          ← Sample test data (optional)

  Absolute paths (from your current directory /Users/davidcruwys/dev/ad/poem-os/poem/):
  - Template: /Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/prompts/abc.hbs
  - Schema: /Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/schemas/abc.json
  - Mock data: /Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/mock-data/abc.json

  ---
  The 9-Step Workflow

  The *new command guides you through:

  1. Gather purpose - What should this prompt do? Output format?
  2. Gather inputs - What fields does it need (productName, etc.)?
  3. Choose name - Kebab-case identifier
  4. Create template - Generate .hbs file with proper structure
  5. Generate schema - Auto-extract schema from template + your metadata
  6. Offer mock data - Ask if you want test data
  7. Generate mock - Create realistic sample data (if yes)
  8. Preview - Render template with data to show you the result
  9. Complete - Show summary and next steps


 Alignment Analysis

  ✅ STRENGTHS (Where They Align)

  | Aspect             | Your System                 | POEM                         |
  |--------------------|-----------------------------|------------------------------|
  | Template Engine    | Handlebars                  | Handlebars ✅                |
  | Schema Language    | JSON Schema                 | JSON Schema ✅               |
  | Testing Philosophy | QA validation               | Mock data testing ✅         |
  | Reusability        | Templates → Multiple videos | Templates → Multiple uses ✅ |

  ⚠️ GAPS (Where They Differ)

  | Aspect             | Your System               | POEM                   | Impact                      |
  |--------------------|---------------------------|------------------------|-----------------------------|
  | Schema Granularity | 1 schema for 54 prompts   | 1 schema per prompt    | 🔴 Major difference         |
  | State Management   | Accumulating state object | Isolated prompt inputs | 🔴 Architecture mismatch    |
  | Template Structure | Freeform instructions     | Structured sections    | 🟡 Stylistic preference     |
  | Chaining           | Built-in via shared state | Not addressed          | 🔴 Missing workflow concept |
  | Validation         | QA prompt at end of chain | Per-prompt validation  | 🟡 Different approach       |

  ---
  Critical Question for POEM Evolution

  Your YouTube Launch Optimizer reveals a pattern POEM doesn't currently support:

  Workflow-Level State Management

  Current POEM Model:     Your Model:
  ┌─────────────┐         ┌─────────────┐
  │ Prompt A    │         │ Workflow    │
  │ + Schema A  │         │ + Schema    │
  │ + Mock A    │         │   ├─ Step 1 │──┐
  └─────────────┘         │   ├─ Step 2 │  │ Accumulating
                          │   ├─ Step 3 │  │ State
  ┌─────────────┐         │   └─ Step 4 │  │
  │ Prompt B    │         └─────────────┘──┘
  │ + Schema B  │
  │ + Mock B    │
  └─────────────┘

  ---
  How Would POEM Handle Your Chain Today?

  Using current *new workflow, I would create:

  Option 1: Independent Prompts (Current POEM way)
  prompts/
    summarize-video.hbs
    abridge-transcript.hbs
    qa-abridgement.hbs

  schemas/
    summarize-video.json        # { transcript: string }
    abridge-transcript.json     # { transcript: string }
    qa-abridgement.json         # { transcript: string, transcriptAbridgement: string }

  ❌ Problem: No concept of workflow state, no built-in chaining

  Option 2: Hybrid (Adapt POEM to your pattern)
  prompts/
    youtube-launch/
      1-configure.hbs
      2-summarize.hbs
      3-abridge.hbs YES - Your Patterns ARE Supported by End of Epic 4

  Critical Story: 3.7 - Workflow Orchestration System

  This is the game-changer that enables your YouTube Launch Optimizer patterns:

  What Story 3.7 Delivers

  # Workflow Definition Format
  name: youtube-launch-optimizer
  description: Transform transcript to complete launch assets
  steps:
    - name: Configure
      prompt: prompts/1-1-configure.hbs
      inputs: [transcript]
      outputs: [projectCode, shortTitle]

    - name: Summarize
      prompt: prompts/1-3-summarize-video.hbs
      inputs: [transcript]                    # From initial data
      outputs: [transcriptSummary]

    - name: Abridge
      prompt: prompts/1-4-abridge-v2.hbs
      inputs: [transcript]                    # From initial data
      outputs: [transcriptAbridgement]

    - name: QA Abridgement
      prompt: prompts/1-5-abridge-qa-v2.hbs
      inputs: [transcript, transcriptAbridgement]  # Uses output from step 3!
      outputs: [transcriptAbridgementDescrepencies]

  Key Features That Match Your System

  | Your YouTube Pattern          | POEM Support (Epic 3.7 + 4.6)               | Status                        |
  |-------------------------------|---------------------------------------------|-------------------------------|
  | Sequential chaining           | Steps run in order                          | ✅ Story 3.7 AC #5            |
  | Accumulating state            | Data bus (workflow-data) stores all outputs | ✅ Story 3.7 AC #3            |
  | Steps reference prior outputs | Each step can access all prior outputs      | ✅ Story 3.7 AC #5            |
  | Single workflow schema        | Auto-derived from union of all step I/O     | ✅ Story 4.2 Note + 4.6 AC #8 |
  | Pause/resume                  | Workflow-data persisted to JSON             | ✅ Story 3.7 AC #6            |
  | Human-in-the-loop             | Checkpoint steps                            | ✅ Story 4.7                  |
  | 53 prompts across 11 sections | Tested in Epic 4                            | ✅ Story 4.1-4.8              |

  ---
  Architecture Alignment

  Your Current System

  workflow-attributes.json (80+ fields)
    ↓
  Step 1: transcript → transcriptSummary
  Step 2: transcript → transcriptAbridgement
  Step 3: transcript + transcriptAbridgement → QA
    ↓
  All attributes accumulate in single state object

  POEM After Epic 4

  Workflow YAML defines steps
    ↓
  Data Bus (workflow-data) stores accumulated state
    ↓
  Step 1: inputs[transcript] → outputs[transcriptSummary] → stored in bus
  Step 2: inputs[transcript] → outputs[transcriptAbridgement] → stored in bus
  Step 3: inputs[transcript, transcriptAbridgement] → outputs[QA] → stored in bus
    ↓
  workflow-data.json persisted with ALL attributes

  Schema auto-generated from union of all step I/O declarations

  🎯 It's the SAME model, just formalized with explicit step I/O declarations!

  ---
  What's Different (Important!)

  Schema Approach

  Your System:
  - 1 hand-written schema (workflow-attributes.json)
  - 80+ fields defined upfront
  - Prompts implicitly know what they need

  POEM System:
  - Per-prompt schemas (auto-extracted): What each template needs
  - Per-workflow schema (auto-derived): Union of all step I/O
  - Explicit declaration of inputs/outputs per step

  Example Comparison

  Your 1-5-abridge-qa-v2.hbs (implicit dependencies):
  Abridged Output:
  {{transcriptAbridgement}}

  Original Transcript:
  {{transcript}}

  POEM workflow declaration (explicit dependencies):
  - name: QA Abridgement
    prompt: 1-5-abridge-qa-v2.hbs
    inputs: [transcript, transcriptAbridgement]  # ← Makes dependencies EXPLICIT
    outputs: [transcriptAbridgementDescrepencies]

  ---
  Story 4.6 - Validates Your Exact Pattern

  Acceptance Criteria #3-8 directly test your chain:

  2. Chain tested: 1-4-abridge → 4-1-analyze-content-essence → 5-1-generate-title
  3. Output from step A stored in workflow-data bus under declared output key
  4. Subsequent steps access workflow-data bus for declared input keys
  5. Final workflow-data contains all accumulated attributes from chain (auto-derived from union of all step I/O)

  This IS your accumulating state model!

  ---
  What Epic 3 & 4 DON'T Provide

  Missing: Workflow Creation UX

  The PRD defines:
  - ✅ How workflows EXECUTE (Story 3.7)
  - ✅ How to TEST workflows (Story 4.6)
  - ❌ How USERS CREATE workflows via agent

  Current *new command: Creates single prompts
  Missing command: *new-workflow to create multi-step pipelines

  You'd manually write the YAML like:
  # poem/workflows/my-workflow.yaml
  name: my-workflow
  steps:
    - name: Step 1
      prompt: prompts/step-1.hbs
      inputs: [field1]
      outputs: [field2]

  ---
  Bottom Line Answer

  Question: Will the flows we're interested in be supported by end of Epic 4?

  Answer: YES ✅

  By end of Epic 4, POEM will support:
  1. ✅ Multi-prompt chains (Story 3.7, 4.6)
  2. ✅ Accumulating state model (workflow-data bus)
  3. ✅ Sequential execution with output→input flow
  4. ✅ Human-in-the-loop checkpoints (Story 4.7)
  5. ✅ Your exact 53-prompt YouTube workflow (Story 4.1-4.8)
  6. ✅ Auto-derived workflow schemas from step I/O

  Limitation: You'll manually write workflow YAML files. There's no agent-guided "create workflow" UX defined in Epic 3-4. That would be a future epic (or Epic 5+).

  ---
  Implication for Your Test: When you create a prompt with *new, you're creating a building block for workflows, not the workflow itself. Epic 4 will let you CHAIN those building blocks together.

  Want to proceed with testing *new to create summarize-video as a single prompt?

> The folder where you just read those summary and transcript abridgment stuff, and it's the only ones I'm interested in are a summary and
abridgment. I'm not interested in the QA. Can you go a bit further and find out whether we get a title generator, a thumbnail generator, sorry
 not a thumbnail generator, a thumbnail text generator, And a YouTube description generator and what sort of parameters it needs. And a
YouTube chapter generator because I think I want to go and create all of them.

⏺ Bash(ls -1 data/youtube-launch-optimizer/prompts/ | grep -E "(title|thumbnail|description|chapter)" | sort)
  ⎿  1-2-title-shortlist.hbs
     2-1-identify-chapters.hbs
     2-2-refine-chapters-v1.hbs
     … +18 lines (ctrl+o to expand)

⏺ Read(data/youtube-launch-optimizer/prompts/5-1-generate-title-v2.hbs)
  ⎿  Read 49 lines

⏺ Read(data/youtube-launch-optimizer/prompts/5-2-generate-thumbnail-text.hbs)
  ⎿  Read 69 lines

⏺ Read(data/youtube-launch-optimizer/prompts/6-1-yt-simple-description-v2.hbs)
  ⎿  Read 46 lines

⏺ Read(data/youtube-launch-optimizer/prompts/2-3-create-chapters.hbs)
  ⎿  Read 34 lines

⏺ Read(data/youtube-launch-optimizer/prompts/2-1-identify-chapters.hbs)
  ⎿  Read 22 lines

⏺ Read(data/youtube-launch-optimizer/prompts/6-2-yt-write-description-v2.hbs)
  ⎿  Read 60 lines

⏺ Perfect! Here's what I found for the prompts you want to create:

  ---
  Your Target Prompts Summary

  | #   | Prompt             | File                             | Complexity                |
  |-----|--------------------|----------------------------------|---------------------------|
  | 1   | Summary            | 1-3-summarize-video.hbs          | ⭐ Simple                 |
  | 2   | Abridgment         | 1-4-abridge-v2.hbs               | ⭐ Simple                 |
  | 3   | Title Generator    | 5-1-generate-title-v2.hbs        | ⭐⭐⭐ Complex (6 inputs) |
  | 4   | Thumbnail Text     | 5-2-generate-thumbnail-text.hbs  | ⭐⭐ Medium (3 inputs)    |
  | 5   | Description        | 6-1-yt-simple-description-v2.hbs | ⭐⭐⭐ Complex (6 inputs) |
  | 6a  | Chapter Identify   | 2-1-identify-chapters.hbs        | ⭐ Simple                 |
  | 6b  | Chapter Timestamps | 2-3-create-chapters.hbs          | ⭐⭐ Medium (3 inputs)    |

  ---
  Detailed Input Requirements

  1. Summary (Simple) ✅

  File: 1-3-summarize-video.hbs
  Inputs:
  - transcript (string) - Full video transcript

  Output: transcriptSummary

  ---
  2. Abridgment (Simple) ✅

  File: 1-4-abridge-v2.hbs
  Inputs:
  - transcript (string) - Full video transcript

  Output: transcriptAbridgement

  ---
  3. Title Generator (Complex) ⚠️

  File: 5-1-generate-title-v2.hbs
  Inputs:
  - shortTitle (string) - Base working title
  - analyzeContentEssence.mainTopic (string) - Main video topic
  - analyzeContentEssence.statistics (string) - Key statistics/numbers
  - analyzeCtaCompetitors.catchyPhrases (string) - Compelling language examples
  - analyzeAudienceEngagement.audienceInsights (string) - Target audience info
  - titleIdeas (array) - Previous title attempts to build upon

  Output: 10 title options with emotion triggers and character counts

  Dependencies: Needs outputs from other prompts (analyzeContentEssence, analyzeCtaCompetitors, analyzeAudienceEngagement)

  ---
  4. Thumbnail Text Generator (Medium) ✅

  File: 5-2-generate-thumbnail-text.hbs
  Inputs:
  - videoTitle (string) - Selected video title
  - videoTopicTheme (string) - Video topic/theme
  - titleIdeas (array) - Alternative title ideas for inspiration

  Output: Table with 3-5 thumbnail text ideas split into 1-4 parts

  ---
  5. YouTube Description (Complex) ⚠️

  File: 6-1-yt-simple-description-v2.hbs
  Inputs:
  - selectedTitles.[0] (string) - The chosen video title
  - foldCta.label + foldCta.url (object) - Community CTA link
  - analyzeContentEssence.mainTopic (string) - Main topic for SEO
  - analyzeCtaCompetitors.searchTerms (array) - SEO search phrases
  - analyzeContentEssence.keywords (array) - Technical keywords
  - transcriptAbridgement_v2 (string) - Video content summary

  Output: JSON with firstLine (~40-50 words) and simpleDescription (400-600 chars)

  Dependencies: Needs outputs from abridgment + content analysis prompts

  ---
  6a. Chapter Identify (Simple) ✅

  File: 2-1-identify-chapters.hbs
  Inputs:
  - transcript (string) - Full video transcript

  Output: Numbered chapter list with reference quotes

  ---
  6b. Chapter Timestamps (Medium)

  File: 2-3-create-chapters.hbs
  Inputs:
  - srt (string) - SRT subtitle file with timestamps
  - transcript (string) - Full transcript for context
  - chapters (string) - Chapter list from 2-1-identify-chapters

  Output: YouTube-ready chapter timestamps (0:00 Chapter Name)

  Dependencies: Needs output from Chapter Identify prompt

  ---
  Two Tiers of Complexity

  ✅ Tier 1: Self-Contained (Start Here)

  These prompts ONLY need transcript as input:
  1. Summary - 1-3-summarize-video.hbs
  2. Abridgment - 1-4-abridge-v2.hbs
  3. Chapter Identify - 2-1-identify-chapters.hbs

  ⚠️ Tier 2: Chain-Dependent (Requires Workflow)

  These prompts need outputs from OTHER prompts:
  4. Title Generator - Needs 6 inputs including analyzeContentEssence, analyzeCtaCompetitors, etc.
  5. Thumbnail Text - Needs selected title
  6. Description - Needs title, abridgment, content analysis
  7. Chapter Timestamps - Needs SRT + identified chapters

  ---
  Observation: The Missing Prompts

  Your Title Generator references prompts that DON'T exist in the simple chain:
  - analyzeContentEssence - Not in your folder (would analyze main topic, keywords, statistics)
  - analyzeCtaCompetitors - Not in your folder (would analyze catchy phrases, search terms)
  - analyzeAudienceEngagement - Not in your folder (would identify audience insights)

  These are missing from the 1- section!* They're likely in sections 4, 11, or similar.

  ---
  Recommendation

  Option 1: Start with Tier 1 (Simple Prompts)
  Create the 3 self-contained prompts first:
  - Summary
  - Abridgment
  - Chapter Identify

  Option 2: Find Missing Analysis Prompts
  Search for the content analysis prompts that Title/Description need:
  # I can search for these if you want
  - analyze-content-essence
  - analyze-cta-competitors
  - analyze-audience-engagement

  Option 3: Simplified Versions
  Create simplified versions of Title/Description that ONLY use transcript + shortTitle, skipping the advanced SEO features.

  ---
  What would you like to do?
  1. Create all 3 Tier 1 prompts (Summary, Abridgment, Chapter Identify)?
  2. Find the missing analysis prompts first?
  3. Create simplified versions of Title/Description for testing?

> What are the title generator inputs? Why does it need six?

⏺ Let me break down why the title generator needs 6 inputs and what each one does:

⏺ Read(data/youtube-launch-optimizer/prompts/5-1-generate-title-v2.hbs)
  ⎿  Read 49 lines

⏺ Here's the breakdown of the 6 inputs and why each exists:

  ---
  Title Generator Input Analysis

  The 6 Inputs (Explained)

  | Input                                         | Purpose                               | Why It Matters                                            | Could You Skip It?               |
  |-----------------------------------------------|---------------------------------------|-----------------------------------------------------------|----------------------------------|
  | 1. shortTitle                                 | Starting point / working title        | Gives context about what the creator originally called it | ⚠️ Helpful baseline              |
  | 2. analyzeContentEssence.mainTopic            | What the video is actually about      | Front-load this for SEO + mobile truncation               | ⚠️ Could extract from transcript |
  | 3. analyzeContentEssence.statistics           | Numbers for impact ("10X", "3 Steps") | Creates authority + curiosity triggers                    | ✅ Yes, optional                 |
  | 4. analyzeCtaCompetitors.catchyPhrases        | Proven compelling language            | Uses phrases that already work in similar content         | ✅ Yes, optional                 |
  | 5. analyzeAudienceEngagement.audienceInsights | Who the target audience is            | Tailors emotional triggers (beginner vs expert)           | ✅ Yes, optional                 |
  | 6. titleIdeas                                 | Previous title attempts               | Avoids repeating + shows what to improve                  | ✅ Yes, optional                 |

  ---
  Why 6 Inputs? YouTube Title Science

  This prompt is highly optimized for CTR (click-through rate) because on YouTube:

  Title quality = Views
  - Great content + bad title = 0 views
  - Mediocre content + great title = 10K+ views

  The prompt uses a sophisticated framework:

  The Strategy Behind Each Input

  Input #1-2 (Core Content)
  shortTitle + mainTopic
  = "What is this video about?"
  Purpose: SEO + accuracy

  Input #3-4 (Social Proof)
  statistics + catchyPhrases
  = "Why should I care?"
  Purpose: Authority + proven language patterns

  Input #5 (Targeting)
  audienceInsights
  = "Is this for me?"
  Purpose: Emotional trigger selection (Curiosity/Desire/Fear)

  Input #6 (Iteration)
  titleIdeas
  = "How can we improve?"
  Purpose: Don't repeat past attempts, build on what worked

  ---
  The Reality: It's Over-Engineered for Testing

  What You ACTUALLY Need

  Minimum viable title generator:
  inputs:
    - transcript  # Extract main topic + key points
    - shortTitle  # Starting point (optional)

  output: 10 title ideas with emotion labels

  Why the extra 4 inputs exist:
  They're optimization layers for professional YouTubers who:
  - Run A/B tests on titles
  - Analyze competitor content
  - Target specific demographics
  - Iterate based on CTR data

  For your testing, you probably DON'T need:
  - ❌ statistics - Just use numbers from the transcript
  - ❌ catchyPhrases - AI can generate these without analysis
  - ❌ audienceInsights - Can infer from transcript content
  - ❌ titleIdeas - Only useful if you're iterating

  ---
  Simplified Version for POEM Testing

  Option A: Use transcript only
  {{! Simplified title generator }}
  You are creating YouTube video titles optimized for CTR.

  ## Video Content
  {{transcript}}

  ## Task
  Generate 10 YouTube titles (40-50 chars each).
  For each title:
  1. Identify main topic from transcript
  2. Apply Three Emotions Framework (Curiosity/Desire/Fear)
  3. Use power words and numbers from content
  4. Front-load keywords for mobile

  ## Output
  1. [CURIOSITY] (47 chars) "Title here..."
  2. [DESIRE] (52 chars) "Title here..."
  ...

  Option B: Use transcript + shortTitle
  ## Base Title
  {{shortTitle}}

  ## Video Transcript
  {{transcript}}

  ## Task
  Generate 10 improved titles building on the base title...

  ---
  The Missing Analysis Prompts

  The title generator references these prompts that extract the 4 complex inputs:

  data/youtube-launch-optimizer/prompts/
    4-1-analyze-content-essence.hbs       # → mainTopic, statistics, keywords
    11-?-analyze-cta-competitors.hbs      # → catchyPhrases, searchTerms
    ?-?-analyze-audience-engagement.hbs   # → audienceInsights

  Let me search for these:

⏺ Bash(ls -1 data/youtube-launch-optimizer/prompts/ | grep -i "analyze")
  ⎿  11-1-analyze-intro.hbs
     11-2-analyze-outro.hbs
     11-3-analyze-cta.hbs
     … +4 lines (ctrl+o to expand)

⏺ Found them! The analysis prompts exist:

  4-1-analyze-content-essence.hbs      → mainTopic, statistics, keywords
  4-2-analyze-audience-engagement.hbs  → audienceInsights
  4-3-analyze-cta-competitors.hbs      → catchyPhrases, searchTerms

  So the full chain for title generation is:

  transcript
    ↓
  Section 4: Analysis (3 prompts)
    ↓
  4-1: Content Essence → mainTopic, statistics
  4-2: Audience → audienceInsights
  4-3: Competitors → catchyPhrases
    ↓
  Section 5: Title Generator (uses all above outputs)
    ↓
  10 optimized titles

  ---
  Bottom Line

  Why 6 inputs?
  Because this is a production-grade YouTube optimization system designed for professional content creators who want maximum CTR.

  Do you need 6 inputs for POEM testing?
  NO. You could:

  1. Test with simplified version (transcript only)
  2. Add the 3 analysis prompts to your workflow (makes title generator more powerful)
  3. Create both versions (simple + complex) to compare POEM's handling

  ---
  What would you prefer?

  A) Create simplified title generator (transcript → titles)
  B) Create full chain (transcript → analysis × 3 → titles)
  C) Start with Tier 1 prompts (Summary, Abridgment, Chapter Identify) and save titles for later?

      4-qa.hbs

  schemas/
    youtube-launch-workflow.json   # Single accumulating schema (your pattern)

  ⚠️ Problem: POEM's *new workflow assumes 1:1 prompt:schema relationship

  ---


Perfect! Creating the prompt now...

  ---
  Step 4: Creating Template File

⏺ Write(dev-workspace/prompts/summarize-video.hbs)
  ⎿  Wrote 35 lines to dev-workspace/prompts/summarize-video.hbs
     {{!
       Prompt: summarize-video
       Purpose: Streamline and condense YouTube video transcriptions to extract pivotal information
       Generated by: POEM new-prompt workflow
     }}
     ## Context
     You are an expert content analyst specializing in video transcription summarization. Your task
     is to use advanced NLP techniques to extract pivotal information from video scripts and create
     concise, readable summaries while maintaining the original intent and tone.
     … +25 lines (ctrl+o to expand)

⏺ ---
  Step 5: Generating Schema

⏺ Write(dev-workspace/schemas/summarize-video.json)
  ⎿  Wrote 15 lines to dev-workspace/schemas/summarize-video.json
     {
       "$schema": "http://json-schema.org/draft-07/schema#",
       "title": "summarize-video",
       "description": "Schema for summarize-video prompt - condenses YouTube video transcriptions",
       "type": "object",
       "properties": {
         "transcript": {
           "type": "string",
           "description": "Full video transcript text to be summarized",
           "minLength": 1
     … +5 lines (ctrl+o to expand)

⏺ ---
  Step 6: Mock Data Generation

  Would you like to generate mock data for testing this prompt?

  Mock data helps you:
  - Test your template immediately
  - Verify placeholders render correctly
  - See a realistic preview

  Options:
  1. Yes - Generate sample transcript data
  2. No - Skip for now (you can generate later with *test)

  What would you like to do?

> Now I can give you a transcript. You can use the FliHub skill to access B72 and get the full
transcript from there.

⏺ Perfect! Let me use FliHub to get the B72 transcript:

⏺ /flihub

⏺ Let me get the B72 transcript from FliHub:

⏺ Bash(curl -s "http://localhost:5101/api/query/projects/resolve?q=b72" | jq)
  ⎿  {
       "success": true,
       "project": {
     … +5 lines (ctrl+o to expand)



  Creating: Thumbnail Text (Simplified)

⏺ Write(dev-workspace/prompts/thumbnail-text.hbs)
  ⎿  Wrote 72 lines to dev-workspace/prompts/thumbnail-text.hbs
     {{!
       Prompt: thumbnail-text
       Purpose: Generate engaging thumbnail text ideas for YouTube videos
       Generated by: POEM new-prompt workflow (simplified version)
     }}
     ## Context
     You are a YouTube thumbnail optimization expert. Your task is to create engaging thumbnail text that grabs viewers' attention and entices them to click. Thumbnail text should be
     different from the video title but still relate to the video's content and theme.
     … +62 lines (ctrl+o to expand)

⏺ Write(dev-workspace/schemas/thumbnail-text.json)
  ⎿  Wrote 19 lines to dev-workspace/schemas/thumbnail-text.json
     {
       "$schema": "http://json-schema.org/draft-07/schema#",
       "title": "thumbnail-text",
       "description": "Schema for thumbnail-text prompt - generates engaging thumbnail text for YouTube videos",
       "type": "object",
       "properties": {
         "transcript": {
           "type": "string",
           "description": "Full video transcript text to analyze for thumbnail text generation",
           "minLength": 1
     … +9 lines (ctrl+o to expand)

⏺ Bash(cp /Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/mock-data/generate-title.json /Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/mock-data/thumbnail-t…)
  ⎿  (No content)

⏺ Bash(cat /Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/mock-data/thumbnail-text.json | jq '. + {videoTitle: .shortTitle} | del(.shortTitle)' > /tmp/thumbnail-…)
  ⎿  (No content)

⏺ ---
  Creating: Video Description (Simplified)

⏺ Write(dev-workspace/prompts/video-description.hbs)
  ⎿  Wrote 91 lines to dev-workspace/prompts/video-description.hbs
     {{!
       Prompt: video-description
       Purpose: Generate YouTube video description optimized for SEO and engagement
       Generated by: POEM new-prompt workflow (simplified version)
     }}
     ## Context
     You are a YouTube SEO and description expert. Your task is to create compelling video descriptions that appear both "above the fold" (first 150 characters) and "below the fold"
     (detailed description).
     … +81 lines (ctrl+o to expand)

⏺ Write(dev-workspace/schemas/video-description.json)
  ⎿  Wrote 19 lines to dev-workspace/schemas/video-description.json
     {
       "$schema": "http://json-schema.org/draft-07/schema#",
       "title": "video-description",
       "description": "Schema for video-description prompt - generates YouTube video descriptions optimized for SEO",
       "type": "object",
       "properties": {
         "transcript": {
           "type": "string",
           "description": "Full video transcript text to analyze for description generation",
           "minLength": 1
     … +9 lines (ctrl+o to expand)

⏺ Bash(cp /Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/mock-data/thumbnail-text.json /Users/davidcruwys/dev/ad/poem-os/poem/dev-workspace/mock-data/video-descr…)
  ⎿  (No content)

⏺ ---
  ✅ All Prompts Created Successfully!

  Summary: 6 YouTube Workflow Prompts

  | #   | Prompt Name        | Inputs                       | Output                                    | Complexity  |
  |-----|--------------------|------------------------------|-------------------------------------------|-------------|
  | 1   | summarize-video    | transcript                   | Concise summary                           | ⭐ Simple   |
  | 2   | abridge-transcript | transcript                   | Near-lossless compression (40-60% length) | ⭐ Simple   |
  | 3   | identify-chapters  | transcript                   | Numbered chapter list with quotes         | ⭐ Simple   |
  | 4   | generate-title     | transcript, shortTitle (opt) | 10 CTR-optimized titles                   | ⭐⭐ Medium |
  | 5   | thumbnail-text     | transcript, videoTitle (opt) | 5-7 thumbnail text ideas (table)          | ⭐⭐ Medium |
  | 6   | video-description  | transcript, videoTitle (opt) | JSON with firstLine + simpleDescription   | ⭐⭐ Medium |

  ---
  Created Artifacts (18 Files Total)

  Templates (6 files)

  dev-workspace/prompts/
  ├── summarize-video.hbs
  ├── abridge-transcript.hbs
  ├── identify-chapters.hbs
  ├── generate-title.hbs
  ├── thumbnail-text.hbs
  └── video-description.hbs

  Schemas (6 files)

  dev-workspace/schemas/
  ├── summarize-video.json
  ├── abridge-transcript.json
  ├── identify-chapters.json
  ├── generate-title.json
  ├── thumbnail-text.json
  └── video-description.json

  Mock Data (6 files)

  dev-workspace/mock-data/
  ├── summarize-video.json          (B72 transcript - 4,497 words)
  ├── abridge-transcript.json        (B72 transcript - 4,497 words)
  ├── identify-chapters.json         (B72 transcript - 4,497 words)
  ├── generate-title.json            (B72 transcript + shortTitle)
  ├── thumbnail-text.json            (B72 transcript + videoTitle)
  └── video-description.json         (B72 transcript + videoTitle)

  ---
  Test Data: B72 Video

  All prompts use the real B72 Opus 4.5 Recording Namer transcript:
  - Project: b72-opus-4.5-awesome
  - Transcript: 4,497 words across 20 chapters
  - Topic: Claude Opus 4.5 building a Recording Namer application in 20 minutes

  ---
  Key Differences: Your System vs POEM Prompts

  Structure

  | Aspect   | Your Original            | POEM Version                                                   |
  |----------|--------------------------|----------------------------------------------------------------|
  | Format   | Freeform instructions    | Structured sections (Context, Guidelines, Input, Task, Output) |
  | Comments | None                     | Handlebars metadata block                                      |
  | Inputs   | Implicit {{placeholder}} | Explicit with descriptions                                     |

  Simplifications Made

  Title Generator:
  - ❌ Removed: analyzeContentEssence.*, analyzeCtaCompetitors.*, analyzeAudienceEngagement.*
  - ✅ Added: Direct extraction from transcript
  - Benefit: Self-contained, no workflow dependencies

  Thumbnail Text:
  - ❌ Removed: videoTopicTheme, titleIdeas array
  - ✅ Kept: transcript, videoTitle (optional)
  - Benefit: Works standalone or after title generation

  Video Description:
  - ❌ Removed: foldCta, analyzeContentEssence.*, analyzeCtaCompetitors.*, transcriptAbridgement
  - ✅ Added: Direct analysis from transcript
  - Benefit: No external dependencies, pure JSON output

  ---
  Workflow Compatibility

  Tier 1: Independent Prompts (No Dependencies)

  transcript → summarize-video → summary
  transcript → abridge-transcript → abridgement
  transcript → identify-chapters → chapter list

  Tier 2: Optional Chaining

  transcript → generate-title → titles
              ↓
           (select one)
              ↓
  transcript + title → thumbnail-text → thumbnail ideas
  transcript + title → video-description → description JSON

  ---
  Next Steps

  To Test These Prompts (Future: Epic 2)

  Once the Astro server is running:

  # Start POEM server
  cd packages/poem-app
  npm run dev

  # Test a prompt via API
  POST http://localhost:4321/api/prompt/render
  {
    "template": "dev-workspace/prompts/summarize-video.hbs",
    "data": <contents of dev-workspace/mock-data/summarize-video.json>
  }

  To Use via Prompt Engineer Agent

  # Activate agent
  /poem/agents/prompt-engineer

  # Test prompt
  *test summarize-video

  # Refine prompt
  *refine summarize-video

  # Validate prompt
  *validate summarize-video

  ---
  Observations: Alignment with POEM

  ✅ What Works Well

  1. Schema-first design - All prompts have corresponding schemas
  2. Mock data ready - Real B72 transcript enables immediate testing
  3. POEM structure - All templates follow Context → Input → Task → Output pattern
  4. Self-contained - Simplified versions remove workflow dependencies

  ⚠️ What's Missing (Epic 4 Will Add)

  1. Workflow orchestration - No automated chaining yet
  2. Human-in-the-loop - No checkpoint pattern for title selection
  3. Validation - No platform constraint checking (50 char limit, etc.)
  4. State accumulation - No workflow-data bus yet

  ---
  All prompts created and ready for testing! 🎉

  The prompts are now in your dev-workspace/ and ready to be tested once the Astro server (Epic 2) is built. Each one follows POEM conventions and can work independently or be chained together in workflows (Epic 4).