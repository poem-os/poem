# ADR-042: JWT Authentication (Example)

> ⚠️ **EXAMPLE FILE**: This is a placeholder created for the [KDD Workflow Guide](../meta/kdd-workflow-guide.md).
> This ADR does not represent a real POEM decision. This file prevents broken link warnings.

**Status**: Example (not a real POEM decision)
**Date**: 2026-01-26 (example)
**Decision Makers**: Example Team

## Context

(Example decision - not real POEM architecture)

We need to implement user authentication for the application. We must decide between:
- Session-based authentication (cookies)
- Token-based authentication (JWT)
- OAuth 2.0 with third-party providers

## Decision

**We will use JWT (JSON Web Tokens) for authentication.**

## Alternatives Considered

### Option 1: Session-Based Authentication
- **Pros**: Simple, server-controlled, easy revocation
- **Cons**: Requires server-side session storage, not stateless
- **Verdict**: Rejected (scalability concerns)

### Option 2: JWT Authentication
- **Pros**: Stateless, scalable, works with SPAs and mobile apps
- **Cons**: Revocation complexity, token size
- **Verdict**: **Selected**

### Option 3: OAuth 2.0 Only
- **Pros**: Offload authentication to third parties
- **Cons**: Requires third-party dependency, limited control
- **Verdict**: Rejected (need first-party auth)

## Rationale

JWT provides:
- Stateless authentication (no server-side sessions)
- Cross-domain support (CORS-friendly)
- Mobile app compatibility
- Scalability (no session store bottleneck)

## Consequences

**Positive**:
- Horizontal scaling without session affinity
- Simplified deployment (no session store)
- Better mobile/SPA experience

**Negative**:
- Token revocation requires blacklist or short expiry
- Token size larger than session IDs
- Need secure storage on client

**Mitigations**:
- Use short-lived access tokens (15 min)
- Implement refresh token rotation
- Store tokens in httpOnly cookies (web) or secure storage (mobile)

## Implementation

(Example implementation - not real POEM code)

```javascript
// Generate JWT
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);
```

---

**Status**: Example file for documentation purposes
**Created**: 2026-01-26
**Source**: KDD Workflow Guide illustration
