# Core Workflows

These sequence diagrams illustrate the key system workflows.

## Workflow 1: New Prompt Creation

```mermaid
sequenceDiagram
    participant U as User
    participant CC as Claude Code
    participant PE as Prompt Engineer Agent
    participant SK as Skills
    participant API as Astro API
    participant FS as File System

    U->>CC: /poem/agents/penny
    CC->>PE: Activate agent
    PE->>U: Greet, show commands

    U->>PE: *new
    PE->>U: What is the prompt's purpose?
    U->>PE: Generate YouTube titles from transcript

    PE->>U: What output format do you need?
    U->>PE: List of 5 title candidates

    PE->>U: What input data is available?
    U->>PE: transcriptAbridgement, contentAnalysis

    PE->>FS: Create /poem/prompts/generate-titles.hbs
    FS-->>PE: File created

    PE->>SK: Generate schema from template
    SK->>API: POST /api/schema/extract
    API-->>SK: Extracted schema
    SK->>FS: Create /poem/schemas/generate-titles.json

    PE->>U: Generate mock data for preview?
    U->>PE: Yes

    SK->>API: POST /api/mock/generate
    API-->>SK: Mock data

    SK->>API: POST /api/prompt/render
    API-->>SK: Rendered preview

    PE->>U: Here's the preview with mock data...
    PE->>U: Prompt created! Files saved to /poem/
```

## Workflow 2: Refine Prompt (Iterative)

```mermaid
sequenceDiagram
    participant U as User
    participant PE as Prompt Engineer Agent
    participant SK as Skills
    participant API as Astro API
    participant FS as File System

    U->>PE: *refine prompts/generate-titles.hbs

    PE->>FS: Read template file
    FS-->>PE: Template content

    PE->>FS: Read associated schema
    FS-->>PE: Schema content

    PE->>U: Current template:<br/>{{transcriptAbridgement}}...<br/>What would you like to improve?

    U->>PE: Add SEO keywords to context

    PE->>FS: Update template
    FS-->>PE: File updated

    PE->>SK: Preview with data
    SK->>API: POST /api/prompt/render
    API-->>SK: Rendered output

    PE->>U: Updated preview:<br/>[shows rendered output]<br/>Continue refining?

    U->>PE: Looks good, but truncate titles to 50 chars

    PE->>FS: Update template (add truncate helper)
    FS-->>PE: File updated

    SK->>API: POST /api/prompt/render
    API-->>SK: Rendered with truncation

    PE->>U: Titles now truncated. Satisfied?
    U->>PE: Yes, done refining

    PE->>U: Template saved. Run *validate to check quality.
```

## Workflow 3: Test Prompt with Mock Data

```mermaid
sequenceDiagram
    participant U as User
    participant PE as Prompt Engineer Agent
    participant SK as Skills
    participant API as Astro API
    participant FS as File System

    U->>PE: *test prompts/generate-titles.hbs

    PE->>U: Data source?<br/>1. Generate mock data<br/>2. Use file<br/>3. Provide inline

    U->>PE: 1 (generate mock)

    PE->>FS: Read schema
    FS-->>PE: Schema content

    SK->>API: POST /api/mock/generate<br/>{schema, count: 5, includeEdgeCases: true}
    API-->>SK: 5 mock data records

    loop For each mock record
        SK->>API: POST /api/prompt/render
        API-->>SK: Rendered output
        PE->>U: Scenario {{n}}:<br/>Input: {{mock summary}}<br/>Output: {{rendered}}
    end

    PE->>U: Test summary:<br/>- 5 scenarios tested<br/>- 0 errors<br/>- 2 warnings (long text truncated)<br/>- Avg render time: 45ms
```

## Workflow 4: Prompt Chain Execution (YouTube Launch Optimizer)

```mermaid
sequenceDiagram
    participant U as User
    participant PE as Prompt Engineer Agent
    participant API as Astro API
    participant WD as Workflow Data
    participant FS as File System

    U->>PE: Run YouTube Launch Optimizer chain

    PE->>WD: Initialize workflow-data.json
    WD-->>PE: {id: "yt-001", data: {}}

    Note over PE,API: Step 1: Abridge Transcript
    PE->>API: POST /api/prompt/render<br/>template: 1-4-abridge-v2.hbs<br/>data: {rawTranscript}
    API-->>PE: transcriptAbridgement
    PE->>WD: Store transcriptAbridgement

    Note over PE,API: Step 2: Analyze Content
    PE->>API: POST /api/prompt/render<br/>template: 4-1-analyze-content-essence.hbs<br/>data: {transcriptAbridgement}
    API-->>PE: analyzeContentEssence
    PE->>WD: Store analyzeContentEssence

    Note over PE,API: Step 3: Generate Titles
    PE->>API: POST /api/prompt/render<br/>template: 5-1-generate-title-v2.hbs<br/>data: {transcriptAbridgement, analyzeContentEssence}
    API-->>PE: titleCandidates[]
    PE->>WD: Store titleCandidates

    Note over PE,U: Step 4: Human Curation (Checkpoint)
    PE->>U: Select titles for shortlist:<br/>1. "Master BMAD..."<br/>2. "Claude SDK..."<br/>3. "Build AI Agents..."
    U->>PE: 1, 3
    PE->>WD: Store selectedTitles: [1, 3]

    Note over PE,API: Step 5: Continue Chain
    PE->>API: POST /api/prompt/render<br/>template: 6-1-yt-simple-description-v2.hbs<br/>data: {selectedTitles, analyzeContentEssence, ...}
    API-->>PE: videoDescription

    PE->>FS: Save workflow-data.json
    PE->>U: Chain complete!<br/>- 12 prompts executed<br/>- 1 human checkpoint<br/>- Output: workflow-data.json
```

## Workflow 5: Provider Integration (Publish Prompt)

```mermaid
sequenceDiagram
    participant U as User
    participant IA as Integration Agent
    participant SK as Skills
    participant API as Astro API
    participant PROV as Provider API
    participant FS as File System

    U->>IA: *publish prompts/enhance-narrative.hbs to supportsignal

    IA->>FS: Read provider config
    FS-->>IA: SupportSignal config

    IA->>SK: Validate prompt before publish
    SK->>API: POST /api/prompt/render (dry run)
    API-->>SK: Renders OK

    SK->>API: POST /api/schema/validate
    API-->>SK: Schema valid

    IA->>U: Pre-publish validation passed.<br/>Publish to SupportSignal?
    U->>IA: Yes

    IA->>API: POST /api/providers/supportsignal/test
    API->>PROV: Test connection
    PROV-->>API: Connected
    API-->>IA: Connection OK

    IA->>API: POST /api/providers/supportsignal/publish
    API->>PROV: Upload template + schema
    PROV-->>API: Published, ID: abc123
    API-->>IA: Success

    IA->>FS: Log publish to /poem/config/publish-history.json

    IA->>U: Published successfully!<br/>- Location: prompts/enhance-narrative<br/>- Provider ID: abc123<br/>- Rollback available
```

## Workflow 6: Add Custom Helper

````mermaid
sequenceDiagram
    participant U as User
    participant SA as System Agent
    participant API as Astro API
    participant FS as File System
    participant HBS as Handlebars Service

    U->>SA: *add-helper
    SA->>U: Describe the helper you need

    U->>SA: I need a helper to format YouTube timestamps<br/>Input: seconds (number)<br/>Output: "MM:SS" format

    SA->>SA: Generate JavaScript code

    SA->>U: Here's the helper code:<br/>```js<br/>module.exports = (seconds) => {...}<br/>```<br/>Create this helper?

    U->>SA: Yes

    SA->>FS: Write .poem-app/src/services/handlebars/helpers/formatTimestamp.js
    FS-->>SA: File created

    Note over SA,HBS: Hot-reload detects new file
    HBS->>FS: Load formatTimestamp.js
    HBS->>HBS: Register helper

    SA->>API: POST /api/helpers/test<br/>{helper: "formatTimestamp", args: [125]}
    API-->>SA: "2:05"

    SA->>U: Helper created and tested!<br/>Usage: {{formatTimestamp 125}} → "2:05"<br/>Available immediately.
````

---
