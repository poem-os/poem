<!-- Powered by BMAD™ Core -->

# Detect Semantic Duplicates Task

## Purpose

To identify duplicate or highly similar KDD (Knowledge-Driven Development) documents using keyword-based similarity analysis (no RAG/embeddings), generate advisory warnings for consolidation opportunities, and maintain documentation quality. This task implements Lisa's `*search-similar` command and prevents knowledge duplication (VAL-002).

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 0. Pre-Detection Setup

- Load `.bmad-core/core-config.yaml` from the project root
- Load validation rules: `.bmad-core/data/validation-rules.yaml`
- Extract VAL-002 rule: Semantic Similarity threshold (default: 70%)
- Identify KDD directories to scan:
  - `docs/kdd/patterns/`
  - `docs/kdd/learnings/` (including subdirectories)
  - `docs/kdd/decisions/`
  - `docs/examples/`
- Initialize detection counters:
  - Documents scanned
  - Duplicate pairs detected
  - Consolidation suggestions

### 1. Extract Keywords from Documents

- **For each KDD document** in scope:
  - Read document content (full text, not just frontmatter)
  - **Extract keywords using simple NLP**:
    - Tokenize content into words
    - Remove stop words (common words: the, a, is, are, etc.)
    - Extract nouns and verbs (heuristic: words >3 characters, exclude common verbs)
    - Extract technical terms (words with capitals, acronyms, code identifiers)
    - Extract code snippets if present (function names, class names)
  - **Weight keywords by frequency and position**:
    - Title keywords: 3x weight
    - First paragraph keywords: 2x weight
    - Body keywords: 1x weight
    - Code snippet identifiers: 2x weight
  - Store document signature: `{filename, title, keywords[], weighted_keywords{}}`

### 2. Compute Pairwise Similarity

- **For each document pair** (doc1, doc2):
  - **Compute keyword overlap** (Jaccard similarity):
    - Intersection: Keywords present in BOTH documents
    - Union: Keywords present in EITHER document
    - Similarity score = |Intersection| / |Union| * 100
  - **Apply weighted similarity** (if high-value keywords match):
    - If title keywords match: +10% bonus
    - If code identifiers match: +15% bonus
    - If problem signatures match (for learnings): +20% bonus
  - **Store similarity score**: `{doc1, doc2, score, matched_keywords[]}`
  - **If score >= VAL-002 threshold (70%)**:
    - Flag as potential duplicate: `{doc1} ↔ {doc2}: {score}%`

### 3. Analyze Duplicate Pairs

- **For each flagged duplicate pair** (score >= 70%):
  - **Determine relationship type**:
    - **Exact duplicate** (score >= 90%): Likely copy-paste, consolidate
    - **High overlap** (70-89%): Related content, consider merging
    - **Partial overlap** (70-79%): Shared concepts, cross-link instead
  - **Identify consolidation strategy**:
    - If both documents in same subdirectory: Merge into single document
    - If documents in different subdirectories: Create cross-links, keep separate
    - If one document is pattern, other is learning: Promote learning to pattern
  - **Extract differences**:
    - Keywords unique to doc1
    - Keywords unique to doc2
    - Determine which document has more complete information

### 4. Generate Consolidation Suggestions

- **For each duplicate pair**, create suggestion:
  ```markdown
  ## Duplicate Pair: {score}% similarity

  **Documents**:
  - Primary: {doc1-path} ({doc1-title})
  - Secondary: {doc2-path} ({doc2-title})

  **Matched Keywords**: {keyword-list}

  **Suggested Action**:
  - {Merge | Cross-link | Promote}

  **Rationale**:
  - {Explanation based on relationship type}

  **Consolidation Strategy**:
  1. {Step-by-step merge instructions}
  2. {Preserve unique content from both documents}
  3. {Update cross-references}
  4. {Archive or delete redundant document}

  **Human Approval Required**: YES
  ```

### 5. Display Duplicate Detection Report

- **Report results**:
  ```
  📊 Semantic Duplicate Detection Report (VAL-002)

  Documents Scanned: {total-count}
  Duplicate Pairs Detected: {pair-count}

  High-Priority Duplicates (>= 90% similarity):
  - {doc1} ↔ {doc2}: {score}%
    Action: Merge (exact duplicate)

  Medium-Priority Duplicates (70-89% similarity):
  - {doc1} ↔ {doc2}: {score}%
    Action: Consider merging or cross-linking

  Consolidation Suggestions: {suggestion-count}

  Next Steps:
  - Review each duplicate pair manually
  - Run `*consolidate {doc1} {doc2}` to merge (requires approval)
  - Update cross-references if keeping separate documents
  ```

### 6. Optional: Interactive Consolidation Mode

- **If user requests interactive mode** (optional):
  - Present each duplicate pair one at a time
  - Show side-by-side diff of document content
  - Options:
    1. **Merge**: Consolidate into single document (run `*consolidate`)
    2. **Cross-link**: Keep both, add mutual references
    3. **Skip**: No action, documents are intentionally similar
    4. **Archive**: Mark secondary document as deprecated
  - **For "Merge" option**:
    - Transition to `*consolidate` command (requires human approval)
    - Do NOT auto-merge (human-in-loop consolidation principle)

### 7. Update Duplicate Tracking

- **Optional: Log detected duplicates** (for recurrence tracking):
  - Create `.bmad-core/data/duplicate-log.yaml` if it doesn't exist
  - Log each detected pair: `{date, doc1, doc2, score, action-taken}`
  - Track consolidation history for metrics reporting

## Error Handling

- **If document has parse errors**: Skip and log warning: "Skipped {path} (invalid Markdown)"
- **If no documents found**: Report: "No KDD documents found. Nothing to scan."
- **If validation-rules.yaml not found**: Use default threshold (70% similarity)
- **If keyword extraction fails**: Use filename and title only (fallback)

## Graceful Degradation

- Parse errors skip document, continue scanning (non-blocking)
- Missing metadata use filename as title (fallback)
- Similarity scores advisory only (VAL-002 = warning severity, not error)
- No automatic merging (human approval required for all consolidations)

## Technical Constraints

- **No RAG/Embeddings**: Use simple keyword-based similarity (Jaccard index)
- **No External Services**: All computation local, no API calls
- **No AI Models**: Pure algorithmic analysis, no LLM-based comparison
- **Performance**: O(n²) pairwise comparison acceptable for <100 documents per directory

## Notes

- This task is Lisa's duplicate detection command (`*search-similar`)
- VAL-002 rule: 70% similarity threshold triggers warning (evidence: 80% overlap in SupportSignal)
- Advisory only: Lisa suggests consolidation, does NOT auto-merge
- Human-in-loop consolidation required (run `*consolidate` command)
- Integration with `*consolidate` command for manual merge workflow
- Run duplicate detection:
  - After bulk knowledge curation (post-epic)
  - Monthly topology health checks
  - Before promoting learnings to patterns
