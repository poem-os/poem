# Prompt Engineering Best Practices

Guidelines for creating effective AI prompts with POEM.

## 1. Clear Structure

Organize prompts with clear sections:
- Context/background information first
- Specific instructions in the middle
- Output format requirements at the end

## 2. Explicit Output Format

Always specify the expected output format:
- Use examples when possible
- Define JSON structure for structured outputs
- Specify length constraints where applicable

## 3. Variable Naming

Use descriptive placeholder names:
- `{{userName}}` over `{{n}}`
- `{{orderDetails.items}}` for nested data
- Consistent naming across related templates

## 4. Helper Usage

Leverage Handlebars helpers for formatting:
- `{{titleCase name}}` for proper capitalization
- `{{truncate text 100}}` for length limits
- `{{json data}}` for debugging complex objects

## 5. Testing Coverage

Ensure comprehensive test coverage:
- Happy path with complete data
- Edge cases with minimal data
- Error cases with invalid data
- Performance tests with large datasets
