# LATO Code Patterns: Prompt Type Taxonomy

**Date**: 2026-02-04 (Updated: Section 5 analysis)
**Source**: SupportSignal analysis schemas + YouTube Section 4-5 patterns
**Status**: Pattern identification (fifth type discovered)

---

## Overview

**LATO Code** (Logical Analysis and Transformation Operations) defines prompt archetypes for structured AI operations. Originally defined in SupportSignal with 3 types, YouTube workflow reveals **two additional pattern types** (Extraction and Facilitation).

---

## The Five LATO Patterns

### 1. Predicate (Binary Decision)

**Purpose**: Answer yes/no questions with justification

**Schema** (SupportSignal):
```json
{
  "templateName": "analysis-predicate-example",
  "outputType": "predicate",
  "outputFormat": "Yes/No with brief justification",
  "placeholders": {
    "context": "text (decision context)",
    "question": "string (yes/no question)"
  },
  "maxTokens": 150,
  "temperature": 0.3
}
```

**Example Use Cases**:
- "Is this a reportable incident?"
- "Does this meet safety criteria?"
- "Should this be escalated?"

**Output**:
```
Yes - Participant injury requires immediate reporting under NDIS guidelines.
```

---

### 2. Observation (Insight Generation)

**Purpose**: Generate brief, actionable insights from data

**Schema** (SupportSignal):
```json
{
  "templateName": "analysis-observation-example",
  "outputType": "observation",
  "outputFormat": "Brief observation (1-2 sentences)",
  "placeholders": {
    "data": "text (data to analyze)",
    "focus_area": "string (observation angle)"
  },
  "maxTokens": 150,
  "temperature": 0.3
}
```

**Example Use Cases**:
- Identify patterns in incident data
- Suggest improvements
- Highlight trends

**Output**:
```
Kitchen incidents cluster during meal prep times, suggesting need for additional supervision or layout modifications to reduce hazards.
```

---

### 3. Classification (Category Assignment)

**Purpose**: Assign input to predefined categories

**Schema** (SupportSignal):
```json
{
  "templateName": "analysis-classification-example",
  "outputType": "classification",
  "outputFormat": "Category name only",
  "placeholders": {
    "categories": "string (comma-separated list)",
    "input": "text (content to classify)"
  },
  "maxTokens": 150,
  "temperature": 0.3
}
```

**Example Use Cases**:
- Incident type classification
- Severity categorization
- Content tagging

**Output**:
```
Behavioral Event
```

---

### 4. Extraction (Metadata Extraction) ⭐ NEW

**Purpose**: Extract structured metadata from unstructured content

**Schema** (YouTube Section 4):
```json
{
  "templateName": "extract-[metadata-type]",
  "outputType": "extraction",
  "outputFormat": "Structured metadata (varies by type)",
  "placeholders": {
    "content": "text (source to extract from)",
    "extraction_focus": "string (metadata type)"
  },
  "maxTokens": 500,
  "temperature": 0.3
}
```

**Example Use Cases** (YouTube workflow):
- Extract theme from transcript
- Extract keywords for SEO
- Extract emotional triggers
- Extract CTAs for marketing
- Extract statistics/data points
- Extract audience insights

**Output** (theme extraction):
```json
{
  "theme": "Building sustainable habits through small, incremental changes"
}
```

**Output** (keywords extraction):
```json
{
  "keywords": [
    "habit formation",
    "behavioral change",
    "incremental progress",
    "sustainability"
  ]
}
```

---

### 5. Facilitation (Human-in-the-Loop Curation) ⭐ NEW

**Purpose**: Guide human decision-making through conversational interaction

**Schema** (YouTube Section 5-2):
```json
{
  "templateName": "facilitate-[decision-type]",
  "outputType": "facilitation",
  "outputFormat": "Curated selection + captured rationale + preferences",
  "placeholders": {
    "candidates": "list (options to evaluate)",
    "context": "text (decision context)"
  },
  "conversation": {
    "phases": [
      "present_analysis",
      "ask_questions",
      "create_shortlist"
    ],
    "capture_rationale": true,
    "capture_preferences": true
  },
  "maxTokens": 1500,
  "temperature": 0.5
}
```

**Example Use Cases** (YouTube workflow):
- Title shortlist curation (10 titles → 2-4 curated with rationale)
- Design style selection with preference capture
- Content strategy decisions
- Feature prioritization

**Process Flow**:
```
1. AI presents analysis of candidates
   ↓
2. AI asks clarifying questions (5+ turns)
   ↓
3. Human provides responses
   ↓
4. AI creates curated shortlist based on input
   ↓
5. AI captures rationale + preferences for future use
```

**Output** (title curation):
```json
{
  "shortlist": [
    {
      "title": "Build AI Workflows 10X Faster with Agent SDK",
      "hookType": "desire",
      "chars": 48,
      "rationale": "Balances both keywords, uses number hook, optimal length",
      "gapFilled": "Only title combining speed claim with both keywords"
    }
  ],
  "preferences": {
    "keywordPriority": "equal weight BMAD + SDK",
    "hookPreference": "curiosity > desire > fear",
    "commonTweaks": "shorten to 45-48 chars, front-load keywords"
  }
}
```

**Key Characteristics**:
- **Interactive**: Multi-turn conversation (5+ questions)
- **Captures rationale**: Why each selection was made
- **Learns preferences**: Records decision patterns for future use
- **Allows modifications**: Human can tweak AI suggestions
- **Higher token usage**: 1500 tokens (conversational)
- **Philosophy**: "AI facilitates, human decides"

---

## Pattern Comparison Matrix

| Pattern | Input | Output | Complexity | Use Case |
|---------|-------|--------|------------|----------|
| **Predicate** | Context + question | Yes/No + justification | Low | Decision making |
| **Observation** | Data + focus area | 1-2 sentence insight | Low | Pattern identification |
| **Classification** | Categories + input | Category name | Low | Categorization |
| **Extraction** | Content + focus | Structured metadata | Medium | Metadata generation |
| **Facilitation** | Candidates + context | Curated selection + rationale + preferences | High | Human-guided curation |

---

## Characteristics by Pattern

### Token Usage
- **Predicate**: Low (150 tokens) - Binary decision
- **Observation**: Low (150 tokens) - Brief insight
- **Classification**: Low (150 tokens) - Single category
- **Extraction**: Medium (500 tokens) - Structured data
- **Facilitation**: High (1500 tokens) - Conversational interaction

### Temperature
- **Patterns 1-4**: 0.3 (deterministic, factual outputs)
- **Facilitation**: 0.5 (conversational, creative curation)

### Model Recommendations
- **Predicate**: gpt-4o-mini (simple decision)
- **Observation**: gpt-5 (insight generation)
- **Classification**: gpt-4o-mini (category matching)
- **Extraction**: gpt-4o / gpt-5 (complex understanding)
- **Facilitation**: gpt-5 (multi-turn conversation, curation reasoning)

---

## Extraction Pattern Deep Dive

### Subtypes of Extraction

**1. Single-Value Extraction**
- Extract one piece of metadata
- Example: Theme, tone, main topic

**2. List Extraction**
- Extract multiple items
- Example: Keywords, statistics, questions

**3. Structured Extraction**
- Extract nested/complex data
- Example: Emotional triggers with influence, USPs with explanations

### SRP Applied to Extraction

**Current YouTube Section 4** (violates SRP):
```
4-1: Extract 4 things (theme + keywords + stats + takeaways)
4-2: Extract 4 things (emotions + tone + audience + USPs)
4-3: Extract 4 things (CTAs + phrases + questions + search terms)
```

**SRP-Compliant Extraction** (recommended):
```
4.1: Extract theme
4.2: Extract keywords
4.3: Extract statistics
4.4: Extract takeaways
4.5: Extract emotional triggers
4.6: Extract tone/style
4.7: Extract audience insights
4.8: Extract USPs
4.9: Extract CTAs
4.10: Extract catchy phrases
4.11: Extract questions
4.12: Extract search terms
```

**Each extraction** focuses on one metadata type (SRP), runs in parallel (efficiency).

---

## Cross-Pattern Relationships

### Patterns That Work Together

**1. Classification → Predicate**
```
Classify incident → If "Critical" → Predicate: "Is immediate action required?"
```

**2. Extraction → Observation**
```
Extract statistics → Observe patterns in statistics
```

**3. Extraction → Classification**
```
Extract keywords → Classify content by primary keyword
```

**4. Predicate → Observation**
```
Multiple predicates answered → Observe trends in decisions
```

**5. Extraction → Facilitation** ⭐
```
Extract 10 title alternatives → Facilitate human curation → 2-4 curated titles
```

**6. Facilitation → Extraction**
```
Facilitated curation captures preferences → Extract user preference patterns
```

---

## POEM Integration

### Schema Templates

POEM should support all 5 LATO patterns:

```yaml
lato_patterns:
  predicate:
    schema_template: predicate-template.json
    prompt_template: predicate-template.hbs

  observation:
    schema_template: observation-template.json
    prompt_template: observation-template.hbs

  classification:
    schema_template: classification-template.json
    prompt_template: classification-template.hbs

  extraction:
    schema_template: extraction-template.json
    prompt_template: extraction-template.hbs

  facilitation:
    schema_template: facilitation-template.json
    prompt_template: facilitation-template.hbs
    conversation_template: facilitation-conversation.yaml
```

### Workflow Execution

**Sequential**:
```yaml
- step: classify-incident
  pattern: classification

- step: is-critical
  pattern: predicate
  depends_on: classify-incident
```

**Parallel**:
```yaml
- step: extract-metadata
  pattern: extraction-parallel
  extractions:
    - theme
    - keywords
    - statistics
```

---

## Pattern Selection Guide

**Use Predicate when**:
- Need binary decision
- Yes/no question to answer
- Decision requires justification

**Use Observation when**:
- Need brief insight
- Identifying patterns or trends
- Actionable recommendation needed

**Use Classification when**:
- Assigning to predefined categories
- Categorization/tagging required
- Fixed taxonomy exists

**Use Extraction when**:
- Extracting metadata from content
- Structured data needed
- Multiple related data points
- SEO, analytics, or marketing metadata

---

## Evolution of LATO Patterns

**Version 1** (SupportSignal - 3 patterns):
- Predicate (binary decision)
- Observation (brief insight)
- Classification (category assignment)

**Version 2** (YouTube Section 4 - 4th pattern):
- Added: **Extraction** (metadata extraction)
- Discovered through Section 4 analysis (12 extraction types)
- See: `srp-prompt-design.md` for SRP-compliant extraction approach

**Version 3** (YouTube Section 5 - 5th pattern):
- Added: **Facilitation** (human-in-the-loop curation)
- Discovered through Section 5-2 analysis
- Enables conversational human interaction with rationale capture

**Version 4** (Future?):
- Transformation (convert format A → format B)
- Synthesis (combine multiple sources)
- Validation (verify correctness of data)
- Generation (create new content from templates)

---

## References

**SupportSignal Examples**:
- `/data/supportsignal/schemas/analysis-predicate-example.json`
- `/data/supportsignal/schemas/analysis-observation-example.json`
- `/data/supportsignal/schemas/analysis-classification-example.json`

**YouTube Extraction Examples**:
- Section 4 prompts (4-1, 4-2, 4-3)
- Current: 3 prompts with 12 total extractions
- SRP redesign: 12 focused prompts (1 extraction each)
- See: `/docs/architecture-decisions/srp-prompt-design.md`

**YouTube Facilitation Examples**:
- Section 5-2: select-title-shortlist
- Conversational curation with 5 questions
- Captures rationale + preferences
- See: `/docs/architecture-decisions/human-checkpoint-patterns.md`

---

**Status**: Five patterns documented (Predicate, Observation, Classification, Extraction, Facilitation)
**Next**: Apply LATO patterns to Epic 4-5 schema/template design
