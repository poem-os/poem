# YouTube Workflow Mock Data - Test Data Summary

**Generated**: 2026-01-13
**Seed**: 12345
**Total Fields**: 68
**File Size**: 105KB

## Sample Field Values

This document provides representative samples of generated mock data for reference during testing.

### String Fields (YouTube Content)

**videoTitle** (sample):
```
Omnis recusandae assumenda numquam sunt.
```
*Length: 42 characters*

**videoDescription** (sample excerpt):
```
Mollitia quasi suscipit tempora ipsam accusantium dignissimos. Fuga laborum architecto...
```
*Length: ~3000+ characters*

**simpleDescription** (sample):
```
Illo laudantium sint quod modi repudiandae. Maxime iusto esse eligendi non culpa. Esse assumenda blanditiis beatae dolores incidunt. Dolorem quaerat voluptatibus aut tempore...
```
*Length: ~200 characters*

**thumbnailText** (sample):
```
voluptatem aut iusto
```
*Length: 19 characters (within 20 char limit)*

### Array Fields

**titleIdeas** (sample):
```json
[
  "Debitis necessitatibus occaecati suscipit.",
  "Repellendus dolore animi assumenda.",
  "Qui inventore eum at saepe."
]
```
*Count: 3 items (within 3-5 range)*

**videoKeywords** (sample):
```json
[
  "voluptatem",
  "corporis",
  "quisquam",
  "modi",
  "voluptates",
  "deleniti",
  "atque"
]
```
*Count: 7 items (within 5-10 range)*

**affiliateCta** (sample):
```json
[
  "Subscribe for more!",
  "Download the resource",
  "Follow on social media"
]
```
*Count: 3 items (within 3-5 range)*

### Long Text Fields

**transcriptAbridgement** (sample excerpt):
```
Temporibus architecto expedita consequatur deserunt soluta dignissimos. Et ducimus 
perferendis optio officiis quam. Nemo quibusdam reiciendis vitae. Odit ducimus 
cupiditate dolor voluptatibus accusantium...
```
*Word count: 704 words (within 500-1000 range)*

**createChapters** (sample):
```
0:00 illo minus magnam
2:34 quis illo veniam repellat deserunt
4:15 sequi cum neque officiis
7:02 veniam nobis officia magnam maiores
9:48 excepturi magnam voluptates
```
*Format: MM:SS Title - Sequential timestamps*

## Field Type Distribution

- **String fields**: 52
- **Array fields**: 16
- **Total fields**: 68

## Validation Status

✅ All 68 fields present
✅ All fields conform to schema types
✅ All required fields populated
✅ No validation errors

## Test Commands Reference

```bash
# View all field names
jq 'keys' dev-workspace/workflows/youtube-launch-optimizer/mock-data/workflow-data.json

# Count specific array
jq '.titleIdeas | length' dev-workspace/workflows/youtube-launch-optimizer/mock-data/workflow-data.json

# Check word count
jq -r '.transcriptAbridgement' dev-workspace/workflows/youtube-launch-optimizer/mock-data/workflow-data.json | wc -w

# View chapters
jq -r '.createChapters' dev-workspace/workflows/youtube-launch-optimizer/mock-data/workflow-data.json
```

---

**For detailed testing instructions**: See `docs/stories/4.3.story-SAT.md`
