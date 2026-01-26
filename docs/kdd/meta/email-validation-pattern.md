# Email Validation Pattern (Example)

> ⚠️ **EXAMPLE FILE**: This is a placeholder created for the [KDD Workflow Guide](./kdd-workflow-guide.md).
> This pattern does not exist in POEM yet. This file prevents broken link warnings.

## Purpose

This would document an email validation pattern if we had one.

**Example Context**: Pattern for validating email addresses using regex and/or external validation services.

## When To Use

(Example pattern - not implemented in POEM)

This pattern would be used when:
- User registration forms
- Email-based authentication
- Contact form validation

## Implementation

(Example implementation - not real POEM code)

```javascript
// Example email validation pattern
function validateEmail(email) {
  // RFC 5322 simplified regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Enhanced validation with DNS check
async function validateEmailWithDNS(email) {
  const isValidFormat = validateEmail(email);
  if (!isValidFormat) return false;

  // Check MX records (example)
  const domain = email.split('@')[1];
  const hasMX = await checkMXRecords(domain);
  return hasMX;
}
```

## Related Patterns

- Password Validation Pattern (example)
- Form Validation Pattern (example)

---

**Status**: Example file for documentation purposes
**Created**: 2026-01-26
**Source**: KDD Workflow Guide illustration (local link example)
