# KDD Decisions Index

Architecture Decision Records (ADRs) documenting significant technical decisions made during POEM development.

## All ADRs

### ADR-001: [Test Organization by Directory Structure](./adr-001-test-organization-by-directory.md)
- **Status**: Accepted
- **Date**: 2026-01-29
- **Story**: Story 0.7
- **Decision**: Organize tests by directory (tests/unit/ and tests/integration/) based on server dependency
- **Impact**: Enables selective test execution (fast unit tests vs slower integration tests)

### ADR-010: [Story Files as Single Source of Truth](./adr-010-handover-documents-vs-story-files.md)
- **Status**: Accepted
- **Date**: 2026-01-30
- **Story**: Story 1.12
- **Decision**: Prohibit handover documents in `.ai/` directory, enforce story files as definitive record for all implementation details
- **Impact**: Prevents documentation fragmentation, eliminates source of truth violations, reduces maintenance burden

## ADRs by Status

### Accepted (2)
- [ADR-001: Test Organization by Directory Structure](./adr-001-test-organization-by-directory.md)
- [ADR-010: Story Files as Single Source of Truth](./adr-010-handover-documents-vs-story-files.md)

## ADRs by Story

### Story 0.7 (1)
- [ADR-001: Test Organization by Directory Structure](./adr-001-test-organization-by-directory.md)

### Story 1.12 (1)
- [ADR-010: Story Files as Single Source of Truth](./adr-010-handover-documents-vs-story-files.md)

## Related Patterns

- ADR-001 relates to: [Zero-Tolerance Testing Pattern](../patterns/testing-zero-tolerance-pattern.md) (to be created)
- ADR-010 relates to: Story File Structure Pattern (candidate)

## Related Policies

- ADR-010 establishes: [.ai/ Directory Usage Policy](../../../.ai/README.md)

---

**Index maintained by**: Lisa (Librarian)
**Last updated**: 2026-01-30
**Total ADRs**: 2 active (excluding examples and ADRs 002-009 not yet indexed)
