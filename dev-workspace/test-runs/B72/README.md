# B72 Workflow Snapshots

**Purpose**: Time-travel debugging and regression comparison for B72 YouTube Launch Formula workflow

**Validator**: Victor (Workflow Validator Agent)
**Last Updated**: 2026-01-09

---

## What Are Snapshots?

Snapshots capture the **complete state** of the B72 workflow at specific story milestones. They enable:

1. **Regression Testing**: Compare outputs across milestones to detect breaking changes
2. **Time-Travel Debugging**: Go back to any milestone to understand what changed
3. **Progress Tracking**: See how workflow outputs improve as capabilities are added
4. **Root Cause Analysis**: Identify which story introduced an issue

---

## Directory Structure

```
B72/
├── README.md                    # This file
├── baseline/                    # Pre-Epic 3 state (no automation)
│   ├── inputs/                  # Input data (transcript, etc.)
│   ├── outputs/                 # Expected outputs (manual)
│   └── metadata.json            # Snapshot metadata
├── story-3.1/                   # After Story 3.1 (Prompt Execution)
│   ├── inputs/
│   ├── outputs/
│   ├── logs/
│   └── test-results.json
├── story-3.2/                   # After Story 3.2 (Schema Validation)
│   └── ...
└── story-3.3/                   # After Story 3.3 (Mock Data Generation)
    └── ...
```

---

## Snapshot Contents

Each story snapshot contains:

### 1. `inputs/` - Input Data

All data used to execute the workflow:

```
inputs/
├── transcript.txt               # B72 video transcript
├── brand-config.json            # Brand configuration (optional)
├── schemas/                     # JSON schemas used
│   ├── summarize-video.json
│   ├── generate-title.json
│   └── ...
└── mock-data/                   # Mock data generated (if applicable)
    ├── summarize-video.json
    ├── generate-title.json
    └── ...
```

### 2. `outputs/` - Workflow Outputs

All outputs produced by the workflow:

```
outputs/
├── phase-1-analyze/
│   ├── summarize-video.txt
│   ├── abridge-transcript.txt
│   ├── identify-chapters.json
│   └── ...
├── phase-2-generate/
│   ├── generate-title.json
│   ├── thumbnail-text.json
│   ├── video-description.json
│   └── ...
└── final-bundle.json            # Complete YouTube metadata bundle
```

### 3. `logs/` - Execution Logs

Logs from workflow execution:

```
logs/
├── execution.log                # Workflow execution log
├── errors.log                   # Errors encountered (if any)
└── performance.log              # Timing and performance metrics
```

### 4. `test-results.json` - Test Results

Test results and validation status:

```json
{
  "story": "3.3",
  "timestamp": "2026-01-09T14:30:00Z",
  "capabilities": ["prompt-execution", "schema-validation", "mock-data-generation"],
  "tests": {
    "regression": "PASS",
    "progression": "PASS",
    "integration": "PARTIAL"
  },
  "prompts_executed": 22,
  "prompts_passed": 22,
  "prompts_failed": 0,
  "coverage": "40%",
  "warnings": [
    "Mock data generator doesn't handle deeply nested arrays"
  ],
  "duration_seconds": 68
}
```

### 5. `metadata.json` - Snapshot Metadata

Metadata about the snapshot:

```json
{
  "snapshot_id": "story-3.3",
  "created_at": "2026-01-09T14:30:00Z",
  "story": "3.3",
  "epic": "3",
  "capabilities_added": ["mock-data-generation"],
  "dependencies": ["story-3.1", "story-3.2"],
  "validator": "Victor",
  "validation_duration_minutes": 68,
  "notes": "First snapshot with mock data generation capability"
}
```

---

## Baseline Snapshot

**Location**: `baseline/`

**Purpose**: Captures the **pre-Epic 3 state** before any POEM automation

**Contents**:
- **inputs/**: B72 transcript and any manual input data
- **outputs/**: Manually created YouTube metadata (what David creates without POEM)
- **metadata.json**: Baseline metadata

**Use Case**: Compare automated outputs against manual (gold standard) outputs

**Status**: To be created at start of Epic 3 validation

---

## Story Snapshots

### Story 3.1: Prompt Execution

**Capability Added**: Basic prompt execution via Astro API

**Expected Outputs**:
- 6 prompts execute successfully
- Outputs are plain text (no validation yet)
- No mock data (manual input required)

**Coverage**: ~10% of B72 workflow

---

### Story 3.2: Schema Validation

**Capability Added**: JSON schema validation for prompt inputs

**Expected Outputs**:
- All 6 prompts validate against schemas
- Invalid inputs rejected with helpful errors
- Output quality improves (type-safe)

**Coverage**: ~25% of B72 workflow

---

### Story 3.3: Mock Data Generation

**Capability Added**: Generate mock data from schemas for testing

**Expected Outputs**:
- Mock data generated for all 22 prompts (6 existing + 16 new)
- Data is schema-compliant
- Prompts execute with mock data (no manual input required)

**Coverage**: ~40% of B72 workflow

---

### Story 3.4: Handlebars Integration (Pending)

**Capability Added**: Handlebars templating for prompts

**Expected Outputs**:
- Templates render with variables
- Template variables validated against schemas
- Prompts are more flexible and reusable

**Expected Coverage**: ~60% of B72 workflow

---

### Story 3.5: Template Refinement (Pending)

**Capability Added**: Iterative template refinement workflows

**Expected Outputs**:
- Templates can be refined based on feedback
- Refinement maintains schema compliance
- Output quality improves through iteration

**Expected Coverage**: ~80% of B72 workflow (Epic 3 target)

---

## How to Use Snapshots

### 1. Compare Snapshots (Detect Regressions)

```bash
# Compare outputs between two milestones
diff -r test-runs/B72/story-3.2/outputs/ test-runs/B72/story-3.3/outputs/

# Or use Victor's command
/poem/agents/workflow-validator
*compare-milestones 3.2 3.3
```

**Use Case**: After story 3.3, verify that prompts from stories 3.1-3.2 still work

---

### 2. Analyze Progression (Track Improvements)

```bash
# Review test results over time
cat test-runs/B72/story-3.1/test-results.json
cat test-runs/B72/story-3.2/test-results.json
cat test-runs/B72/story-3.3/test-results.json

# Or use Victor's command
*progress-report
```

**Use Case**: Understand how workflow coverage progresses from 10% → 25% → 40%

---

### 3. Debug Issues (Root Cause Analysis)

```bash
# Find when an issue was introduced
diff test-runs/B72/story-3.2/outputs/generate-title.json \
     test-runs/B72/story-3.3/outputs/generate-title.json

# Review logs
cat test-runs/B72/story-3.3/logs/errors.log
```

**Use Case**: Story 3.4 breaks title generation - which story introduced the bug?

---

### 4. Validate Against Baseline

```bash
# Compare automated vs manual outputs
diff test-runs/B72/baseline/outputs/ \
     test-runs/B72/story-3.5/outputs/

# Measure automation quality
```

**Use Case**: Are automated outputs as good as manual outputs?

---

## Snapshot Creation Process

Snapshots are created **automatically** by Victor during validation:

1. **After regression testing** (Step 2): Saves inputs and outputs
2. **After progression testing** (Step 3): Saves test results
3. **After integration testing** (Step 4): Saves logs and metadata
4. **During artifact updates** (Step 5): Finalizes snapshot

Manual snapshot creation:

```bash
/poem/agents/workflow-validator
*snapshot
```

---

## Snapshot Retention Policy

**Keep All Snapshots** (for now):
- Epic 3 in progress, need full history
- Disk space not a concern yet
- Valuable for debugging and analysis

**Future Retention** (after Epic 3):
- Keep baseline forever
- Keep epic boundary snapshots (story 3.5, 4.X, etc.)
- Archive intermediate snapshots (compress or remove)

---

## Snapshot Size Estimates

**Per Snapshot**:
- inputs/: ~500 KB (transcript + schemas + mock data)
- outputs/: ~200 KB (prompt outputs)
- logs/: ~100 KB (execution logs)
- metadata: ~5 KB
- **Total**: ~800 KB per snapshot

**For Epic 3 (5 stories + baseline)**:
- 6 snapshots × 800 KB = ~4.8 MB
- Negligible disk space usage

---

## Best Practices

### For Developers
1. **Review previous snapshot** before implementing new story
2. **Run local snapshot** before formal validation
3. **Compare your outputs** against expected results

### For Validators
1. **Always snapshot** after story completion
2. **Compare against previous** to detect regressions
3. **Document differences** in test results

### For QA
1. **Reference snapshots** during story review
2. **Validate outputs** against baseline (gold standard)
3. **Track quality metrics** across milestones

---

## Troubleshooting

### Issue: Snapshot directory not created

**Cause**: Victor wasn't run or snapshot step failed

**Solution**:
```bash
/poem/agents/workflow-validator
*snapshot
```

---

### Issue: Outputs differ but no regression

**Cause**: Expected improvement from new capability

**Solution**: Review test results, document improvement in metadata

---

### Issue: Snapshots too large

**Cause**: Large mock data files or verbose logs

**Solution**: Compress snapshots, archive old ones

---

## Snapshot Metadata Format

Standard `metadata.json` structure:

```json
{
  "snapshot_id": "story-3.3",
  "created_at": "2026-01-09T14:30:00Z",
  "story": "3.3",
  "epic": "3",
  "capabilities_added": ["mock-data-generation"],
  "dependencies": ["story-3.1", "story-3.2"],
  "validator": "Victor",
  "validation_duration_minutes": 68,
  "b72_workflow": {
    "prompts_total": 54,
    "prompts_executable": 22,
    "coverage_percent": 40
  },
  "tests": {
    "regression": "PASS",
    "progression": "PASS",
    "integration": "PARTIAL"
  },
  "warnings": [
    "Mock data generator doesn't handle deeply nested arrays"
  ],
  "notes": "First snapshot with mock data generation capability"
}
```

---

## Resources

- **Victor Agent**: `.claude/commands/poem/agents/workflow-validator.md`
- **Validation Guide**: `dev-workspace/WORKFLOW-VALIDATION-GUIDE.md`
- **Test Reports**: `dev-workspace/test-reports/`
- **B72 Testing Guide**: `dev-workspace/B72-VIDEO-TESTING-GUIDE.md`

---

**Last Updated**: 2026-01-09
**Next Snapshot**: After Story 3.4 completion
**Maintained By**: Victor (Workflow Validator Agent)
