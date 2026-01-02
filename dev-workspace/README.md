# Dev Workspace

This directory is the **development testing workspace** for POEM framework developers.

## Purpose

When testing POEM agents and workflows during development, user-generated content (prompts, schemas, mock data) is created here instead of polluting the source code.

## Directory Structure

```
dev-workspace/
├── prompts/        # Test prompt templates (.hbs files)
├── schemas/        # Test JSON schemas
├── mock-data/      # Test mock data files
├── config/         # Test configuration files
└── workflow-data/  # Workflow state and output
```

## Important Notes

- This directory is **gitignored** - contents are not committed
- In **production mode**, user content goes to `poem/` instead
- The config service automatically detects which mode you're in

## Mode Detection

| Mode | Detection | User Content Location |
|------|-----------|----------------------|
| Development | `POEM_DEV=true` | `dev-workspace/` |
| Production | `POEM_DEV` not set | `poem/` |

## See Also

- `packages/poem-core/poem-core-config.yaml` - Path configuration source of truth
- `packages/poem-core/workflows/README.md` - Workflow path resolution pattern
