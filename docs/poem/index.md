# POEM Product Documentation

Documentation for using POEM (Prompt Orchestration and Engineering Method) features and capabilities.

---

## Getting Started

**[Getting Started with Workflows](./user-guide/getting-started-with-workflows.md)** ⭐ **START HERE**

Learn how to use POEM workflows for multi-step prompt orchestration and data accumulation.

**What it covers**:
- When you need workflows vs standalone prompts
- How the workflow data accumulation pattern works
- Building your first 3-prompt workflow
- Real example walkthrough (YouTube Launch Optimizer)

---

## Product Features

### Workflow Validation

**[Workflow Validation Guide](./workflow-validation-guide.md)**

Complete guide for using Victor (Workflow Validator agent) to validate capabilities across stories with product-level QA.

**What it covers**:
- What is workflow validation?
- When to use Victor
- 6-step validation cycle
- Commands reference
- Artifacts explained
- Decision gates
- Integration with BMAD

**Agent**: `/poem/agents/victor`

**[Backing Up Validation Data](./backing-up-validation-data.md)**

How to back up and restore Victor's validation artifacts for time-travel debugging and regression testing.

---

### Work Intake & Routing

**[Triage Guide](./triage-guide.md)**

Complete guide for using the `/triage` command to route development work to the optimal workflow path.

**What it covers**:
- Decision criteria (time/ceremony, epic fit, existing work)
- Usage modes (conversation, issues, explicit, planning)
- Routing paths (Quick Fix, Epic 0, Feature Epic, Existing Story)
- Layer 3 behavioral integration (v2.0 issue schema)
- Examples and troubleshooting

---

### Examples & Demonstrations

**[POEM Feature Examples](./examples/index.md)**

Working examples demonstrating how to use POEM product features:

- **Epic 4 Examples**: Field mapper chains, helper creation, schema-based mock generation, workflow pause/resume
- **Workflow Patterns**: Multi-workflow setup, end-to-end validation
- **Development Patterns**: Skill creation, unified schema creation

Each example includes complete code, configuration, and usage instructions.

---

## Coming Soon

More guides will be added as POEM develops:
- Prompt engineering best practices
- Schema design patterns
- Mock data generation strategies
- Workflow orchestration patterns

---

**Last Updated**: 2026-01-22
**Maintained By**: POEM Documentation Team
