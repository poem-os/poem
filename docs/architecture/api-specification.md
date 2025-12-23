# API Specification

POEM's Astro server exposes REST API endpoints that skills and agents call via HTTP. No authentication is required (local development tool).

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: POEM Runtime API
  version: 1.0.0
  description: |
    Local REST API for POEM (Prompt Orchestration and Engineering Method).
    Called by Claude Code skills and agents for template rendering,
    schema operations, and provider integration.

servers:
  - url: http://localhost:4321/api
    description: Local development server (port configurable)

paths:
  /health:
    get:
      summary: Health check endpoint
      description: Returns server status and version
      responses:
        "200":
          description: Server is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"
                  version:
                    type: string
                    example: "1.0.0"
                  uptime:
                    type: number
                    description: Uptime in seconds
                  helpersLoaded:
                    type: number
                    description: Count of registered Handlebars helpers

  /prompt/render:
    post:
      summary: Render a Handlebars template with data
      description: |
        Compiles and renders a prompt template with provided data.
        Returns rendered output and metadata.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - template
              properties:
                template:
                  type: string
                  description: Template path (relative to /poem/prompts/) or raw template content
                  example: "youtube-launch-optimizer/5-1-generate-title-v2.hbs"
                data:
                  type: object
                  description: Data to render template with
                  example:
                    transcriptAbridgement: "This video covers..."
                    analyzeContentEssence:
                      mainTopic: "AI Development"
                isRawTemplate:
                  type: boolean
                  description: If true, template field contains raw Handlebars content
                  default: false
      responses:
        "200":
          description: Template rendered successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  rendered:
                    type: string
                    description: Rendered template output
                  renderTimeMs:
                    type: number
                    description: Render time in milliseconds
                  warnings:
                    type: array
                    items:
                      type: string
                    description: Missing fields, unused data, etc.
                  templatePath:
                    type: string
                    description: Resolved template path
        "400":
          description: Invalid request (missing template, syntax error)
        "404":
          description: Template file not found

  /schema/extract:
    post:
      summary: Extract schema from template placeholders
      description: |
        Parses a Handlebars template and extracts a JSON schema
        based on placeholder usage patterns.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - template
              properties:
                template:
                  type: string
                  description: Template path or raw content
                isRawTemplate:
                  type: boolean
                  default: false
      responses:
        "200":
          description: Schema extracted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  schema:
                    type: object
                    description: Extracted schema
                  requiredHelpers:
                    type: array
                    items:
                      type: string
                    description: Helper names used in template
                  templatePath:
                    type: string

  /schema/validate:
    post:
      summary: Validate data against a schema
      description: Checks if provided data matches schema requirements
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - schema
                - data
              properties:
                schema:
                  type: string
                  description: Schema path or inline schema object
                data:
                  type: object
                  description: Data to validate
      responses:
        "200":
          description: Validation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  valid:
                    type: boolean
                  errors:
                    type: array
                    items:
                      type: object
                      properties:
                        field:
                          type: string
                        message:
                          type: string

  /mock/generate:
    post:
      summary: Generate mock data from schema
      description: |
        Uses Faker.js to generate realistic mock data
        based on schema field definitions and constraints.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - schema
              properties:
                schema:
                  type: string
                  description: Schema path or inline schema object
                count:
                  type: number
                  description: Number of mock records to generate
                  default: 1
                seed:
                  type: number
                  description: Random seed for reproducible generation
                includeEdgeCases:
                  type: boolean
                  description: Include edge cases (empty, long, special chars)
                  default: false
      responses:
        "200":
          description: Mock data generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      type: object
                  count:
                    type: number
                  seed:
                    type: number

  /helpers:
    get:
      summary: List registered Handlebars helpers
      description: Returns all available helpers with their descriptions
      responses:
        "200":
          description: List of helpers
          content:
            application/json:
              schema:
                type: object
                properties:
                  helpers:
                    type: array
                    items:
                      type: object
                      properties:
                        name:
                          type: string
                        description:
                          type: string
                        example:
                          type: string

  /helpers/test:
    post:
      summary: Test a Handlebars helper
      description: Execute a helper with test inputs
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - helper
                - args
              properties:
                helper:
                  type: string
                  description: Helper name
                args:
                  type: array
                  description: Arguments to pass to helper
      responses:
        "200":
          description: Helper executed
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: string
                  success:
                    type: boolean

  /providers/{name}/test:
    post:
      summary: Test provider connection
      description: Verify connectivity to external provider
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
          description: Provider name (e.g., "supportsignal")
      responses:
        "200":
          description: Connection test result
          content:
            application/json:
              schema:
                type: object
                properties:
                  connected:
                    type: boolean
                  latencyMs:
                    type: number
                  error:
                    type: string

  /providers/{name}/dictionary:
    get:
      summary: Pull data dictionary from provider
      description: Fetch available fields and types from external system
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Data dictionary
          content:
            application/json:
              schema:
                type: object

  /providers/{name}/publish:
    post:
      summary: Publish prompt to provider
      description: Deploy a prompt template to external system
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - templatePath
              properties:
                templatePath:
                  type: string
                  description: Path to template file
                schemaPath:
                  type: string
                  description: Path to associated schema
                targetLocation:
                  type: string
                  description: Provider-specific deployment location
      responses:
        "200":
          description: Publish result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  publishedAt:
                    type: string
                    format: date-time
                  location:
                    type: string
```

## API Summary Table

| Endpoint                           | Method | Purpose                        | NFR         |
| ---------------------------------- | ------ | ------------------------------ | ----------- |
| `/api/health`                      | GET    | Server status check            | -           |
| `/api/prompt/render`               | POST   | Render template with data      | < 1s (NFR3) |
| `/api/schema/extract`              | POST   | Extract schema from template   | -           |
| `/api/schema/validate`             | POST   | Validate data against schema   | -           |
| `/api/mock/generate`               | POST   | Generate mock data from schema | -           |
| `/api/helpers`                     | GET    | List available helpers         | -           |
| `/api/helpers/test`                | POST   | Test a helper                  | -           |
| `/api/providers/{name}/test`       | POST   | Test provider connection       | -           |
| `/api/providers/{name}/dictionary` | GET    | Pull data dictionary           | -           |
| `/api/providers/{name}/publish`    | POST   | Publish prompt to provider     | -           |

---
