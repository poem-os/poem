# Prompt Template Formatting Rules

This document defines the formatting standards for Handlebars prompt templates in the YouTube Launch Optimizer workflow.

## Core Principles

1. **Readability First** - Prompts should be scannable and easy to understand
2. **Clear Structure** - Use sections and headers to organize content
3. **Separation of Concerns** - Keep instructions separate from format examples
4. **Whitespace Matters** - Use blank lines to create visual breathing room

## Template Structure

Every prompt should follow this general structure:

```markdown
[Opening statement - what is this prompt for?]

## Step 1: [Action Name]
[Clear instruction for this step]

## Step 2: [Action Name]
[Clear instruction for this step]

## Step N: [Action Name]
[Clear instruction for this step]

---

## Output Format

```
[Show expected output structure in a code block]
```

---

## [Input Section Name]

<input-tag>
{{variable}}
</input-tag>
```

## Formatting Rules

### ✅ DO

- **Use markdown headers** for sections (`##` for main sections)
- **Number sequential steps** (Step 1, Step 2, etc.)
- **Add horizontal rules** (`---`) to separate major sections
- **Put output formats in code blocks** for clarity
- **Use bullet points** for lists of items
- **Add blank lines** between sections
- **Start with context** - explain what the prompt does
- **Use descriptive section names** (not just "Format" or "Input")

### ❌ DON'T

- **Avoid wall-of-text paragraphs** - break them up
- **Don't mix instructions and format specs** in the same sentence
- **Don't embed format examples in prose** - use code blocks
- **Don't skip whitespace** - it improves scannability
- **Don't use vague labels** like "stuff goes here"

## Example Transformations

### Before (Hard to Read)
```
Review the project folder name "{{projectFolder}}" and extract the project code
which will be a letter followed by two numbers, example "b69" , then build a
short title short title based on the project folder name using "Title Format"
Read the transcription and generate a list of aditional titles, each 3-7 words
based on the video's key content. # Format Project Code: [code goes inside a
codeblock] Short Title: [title goes inside a codeblock] Suggested Titles: [
titles get listed inside a codeblock Format: - title one - title two etc. ]
```

### After (Clean and Structured)
```markdown
You are reviewing a YouTube video project to generate title suggestions.

## Step 1: Extract Project Code
Review the project folder name "{{projectFolder}}" and extract the project code.
The code format is: one letter followed by two numbers (example: "b69").

## Step 2: Generate Short Title
Create a short title based on the project folder name using the "Title Format" guidelines.

## Step 3: Suggest Additional Titles
Read the transcript and generate 3-7 alternative titles (3-7 words each) based on the video's key content.

---

## Output Format

```
Project Code: [code]

Short Title: [title based on folder name]

Suggested Titles:
- [title option 1]
- [title option 2]
- [title option 3]
```
```

## Why This Matters

1. **Faster comprehension** - Developers can scan and understand prompts quickly
2. **Easier maintenance** - Clear structure makes updates straightforward
3. **Better AI results** - Well-structured prompts often produce better AI outputs
4. **Consistency** - Standard format across all 54 prompts in the workflow
5. **Reduced errors** - Clear instructions minimize misunderstandings

## Checklist for Formatting a Prompt

- [ ] Opening statement explains the prompt's purpose
- [ ] Steps are numbered and clearly labeled
- [ ] Each step has a single, clear instruction
- [ ] Output format is shown in a code block
- [ ] Sections are separated with horizontal rules
- [ ] Blank lines used between major sections
- [ ] No run-on paragraphs or walls of text
- [ ] Variable names use clear, descriptive Handlebars syntax
- [ ] Spelling and grammar checked

## Common Patterns

### Simple Workflow (3-5 steps)
Use numbered steps with clear action verbs (Extract, Generate, Review, etc.)

### Complex Output Format
Show the complete structure in a code block with placeholder labels in [brackets]

### Multiple Input Sources
Use separate sections for each input type (Transcript, Config, Context, etc.)

---

**Version:** 1.0
**Last Updated:** 2026-02-04
**Reference:** See `1-1-configure.hbs` for a well-formatted example
