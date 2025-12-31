# POEM Core Principles

These principles guide prompt engineering within the POEM framework.

## 1. Schema-First Design

Every prompt template should have a corresponding JSON schema that defines:
- Required input fields and their types
- Optional fields with default values
- Validation rules for data integrity

## 2. Test Before Deploy

Always test prompts with mock data before deployment:
- Generate diverse test scenarios
- Validate edge cases and error conditions
- Verify output format matches expectations

## 3. Iterative Refinement

Prompt development is an iterative process:
- Start with a minimal working template
- Test with real-world data patterns
- Refine based on output quality
- Validate after each change

## 4. Template Modularity

Design prompts for reusability:
- Use Handlebars helpers for common formatting
- Keep templates focused on single responsibilities
- Extract shared patterns into helper functions

## 5. Graceful Degradation

Prompts should handle missing or unexpected data:
- Provide sensible defaults for optional fields
- Use conditional blocks for optional sections
- Never crash on missing placeholders
