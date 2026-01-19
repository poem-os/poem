# ADR-005: Mock Data Generation with Faker.js

**Date**: 2026-01-13
**Status**: Accepted
**Source**: Story 4.3 (Generate Mock Workflow Data)

## Context

POEM needs to generate realistic test data for prompt templates to enable:
- Testing prompts in isolation before real data exists
- Validating prompt chains with multi-step data accumulation
- Providing developers with realistic examples
- Reproducing bugs with deterministic test data (seeded generation)

The YouTube Launch Optimizer workflow has 68 fields across 53 templates, making manual mock data creation impractical.

**Options evaluated**:
1. **Faker.js** (@faker-js/faker) - Mature data generation library
2. **Chance.js** - Alternative faker library
3. **Custom generators** - Build from scratch
4. **JSON Schema Faker** - Schema-driven generation
5. **Hard-coded fixtures** - Manual mock data files

## Decision

Use **@faker-js/faker** as the core generation engine, augmented with domain-specific generators for YouTube content (timestamps, chapters, abridgements).

Implementation approach:
- Type-based generation using `faker.*` methods
- Pattern-based field detection for domain-specific content
- Constraint satisfaction (minLength, maxLength, min, max)
- Seed support for reproducible generation

## Alternatives Considered

### Option 1: Faker.js (Chosen)

**Pros**:
- Mature (10+ years, 45K+ GitHub stars)
- Comprehensive (100+ generators across 20+ categories)
- TypeScript support (type-safe APIs)
- Locale support (internationalization)
- Deterministic generation via seeds
- Active maintenance (last update: 2025-12)

**Cons**:
- 2MB package size (acceptable for dev dependency)
- Requires pattern detection for domain-specific fields
- No built-in constraint satisfaction (must implement)

### Option 2: Chance.js

**Pros**:
- Lightweight (smaller than Faker.js)
- Good browser support

**Cons**:
- Less comprehensive (fewer generator types)
- No TypeScript support
- Less active maintenance (last update: 2023-06)
- No deterministic seeding

**Rejected**: TypeScript support and active maintenance critical for POEM.

### Option 3: Custom Generators

**Pros**:
- Full control over generation logic
- No dependencies

**Cons**:
- 3-6 months development time
- Reinventing the wheel (Faker.js already solves this)
- Ongoing maintenance burden
- No internationalization out of box

**Rejected**: Not worth the development cost.

### Option 4: JSON Schema Faker

**Pros**:
- Schema-native (understands JSON Schema format)
- Built on Faker.js (benefits from its generators)

**Cons**:
- Requires JSON Schema format (POEM uses UnifiedSchema)
- Limited control over domain-specific generation
- Extra conversion layer (UnifiedSchema → JSON Schema)

**Rejected**: Additional complexity without clear benefit.

### Option 5: Hard-coded Fixtures

**Pros**:
- Simple implementation
- Predictable output

**Cons**:
- 68 fields × 53 templates = ~3,600 values to create manually
- Stale data (doesn't adapt to schema changes)
- No constraint validation
- No randomization (all tests use identical data)

**Rejected**: Doesn't scale.

## Rationale

**Why Faker.js Won**:

1. **Proven Reliability**: 10+ years, 45K stars, used by thousands of projects
2. **TypeScript First-Class**: Type-safe APIs prevent runtime errors
3. **Comprehensive Coverage**: 100+ generators cover most use cases
4. **Seed Support**: `faker.seed(12345)` enables reproducible tests
5. **Active Maintenance**: Regular updates, security patches, community support
6. **Extensibility**: Easy to wrap with domain-specific logic

**Pattern-Based Detection Strategy**:
Faker.js provides primitives (names, dates, numbers). We layer domain-specific generators on top:
- Field name `transcriptAbridgement` → `generateTranscriptAbridgement()` (500-1000 words)
- Field name `chapters` → `generateChapters(5)` (MM:SS format)
- Field name `videoTitle` → `generateYouTubeTitle()` (40-50 chars)

This hybrid approach gets best of both worlds: robust primitives + domain realism.

**Constraint Satisfaction**:
Faker.js doesn't enforce schema constraints. We implemented wrapper logic:
- Respect `minLength`/`maxLength` for strings
- Respect `min`/`max` for numbers
- Respect `enum` for fixed value sets
- Truncate or pad values to meet constraints

## Consequences

**Positive**:
- ✅ Generated 68-field YouTube workflow mock data in <1 second
- ✅ All 61 mock-generator tests passing
- ✅ Reproducible tests via seed parameter
- ✅ Realistic content (not "lorem ipsum" everywhere)
- ✅ Easy to extend with new domain generators

**Negative**:
- ⚠️ 2MB dependency (acceptable - dev only, not shipped to production)
- ⚠️ Requires maintenance of pattern detection logic
- ⚠️ Some field names need fakerHint in schema for correct generation

**Neutral**:
- Pattern detection is heuristic (field name matching) - works well in practice but not bulletproof

## Gap Analysis Impact ⭐

- **VibeDeck Relevance**: Not yet applicable (VibeDeck doesn't use mock generation)
- **Real-World Validation**: Untested in production workflows
- **Future Implications**: VibeDeck will need model-research-specific generators (e.g., `generateModelComparison`, `generateDimensionAnalysis`)

## Evolution from Epic 3 ⭐

- **Related Epic 3 ADR**: None (mock generation new in Epic 4)
- **Pattern Change**: N/A
- **Breaking Change**: No

## References

- **Story**: `docs/stories/4.3.story.md` (Generate Mock Workflow Data)
- **Implementation**: `packages/poem-app/src/services/mock-generator/`
- **Tests**: 61/61 passing (generator, youtube-generators, field-detector, schema-converter, API)
- **QA Gate**: Quality Score 100/100
- **Dependencies**: `@faker-js/faker@^9.4.0`

---

**Last Updated**: 2026-01-19
