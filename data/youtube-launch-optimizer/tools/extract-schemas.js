#!/usr/bin/env node

/**
 * Schema Extraction Tool for YouTube Launch Optimizer
 *
 * Parses youtube-launch-optimizer.yaml and generates JSON schema files
 * for each step based on their inputs/outputs arrays.
 *
 * This is a TEMPORARY discovery tool (not Epic 4.2 implementation).
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type mappings from schema-extraction.md reference
const TYPE_MAPPINGS = {
  // Core content
  'transcript': { type: 'string', description: 'Full video transcript text', format: 'long-text' },
  'transcriptAbridgement': { type: 'string', description: 'Compressed transcript (40-60% of original)', format: 'long-text' },
  'transcriptSummary': { type: 'string', description: 'Condensed summary (100-1000 chars)' },
  'transcriptIntro': { type: 'string', description: 'Introduction section extracted from transcript' },
  'transcriptOutro': { type: 'string', description: 'Conclusion section extracted from transcript' },

  // Project metadata
  'projectFolder': { type: 'string', description: 'Path to project folder' },
  'projectCode': { type: 'string', description: 'Unique project identifier (e.g., b69)', pattern: '^[a-z]\\d{2}$' },
  'shortTitle': { type: 'string', description: 'Brief working title (3-7 words)' },

  // Chapters
  'identifyChapters': { type: 'string', description: 'Initial chapter identification output' },
  'chapters': { type: 'string', description: 'Final refined chapters with timestamps', format: 'multi-line' },

  // Analysis outputs (Section 4)
  'analyzeContentEssence': {
    type: 'object',
    description: 'Content essence analysis output',
    properties: {
      mainTopic: { type: 'string', description: 'Central theme or subject' },
      keywords: { type: 'array', items: { type: 'string' }, description: 'Key terms and phrases' },
      statistics: { type: 'array', items: { type: 'string' }, description: 'Important numbers and data points' },
      takeaways: { type: 'array', items: { type: 'string' }, description: 'Key insights and conclusions' }
    }
  },
  'analyzeAudienceEngagement': {
    type: 'object',
    description: 'Audience engagement analysis',
    properties: {
      emotionalTriggers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            trigger: { type: 'string' },
            influence: { type: 'string' }
          }
        }
      },
      tone: {
        type: 'object',
        properties: {
          style: { type: 'string', enum: ['formal', 'casual', 'humorous'] },
          examples: { type: 'array', items: { type: 'string' } }
        }
      },
      audienceInsights: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            group: { type: 'string', description: 'Target demographic' },
            relevance: { type: 'string' }
          }
        }
      },
      usps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            point: { type: 'string' },
            explanation: { type: 'string' }
          }
        }
      }
    }
  },
  'analyzeCtaCompetitors': {
    type: 'object',
    description: 'CTA and competitor analysis',
    properties: {
      callToActions: { type: 'array', items: { type: 'string' }, nullable: true },
      catchyPhrases: { type: 'array', items: { type: 'string' }, nullable: true },
      questions: { type: 'array', items: { type: 'string' }, nullable: true },
      searchTerms: { type: 'array', items: { type: 'string' }, nullable: true }
    }
  },

  // QA output
  'transcriptAbridgementDescrepencies': {
    type: 'array',
    items: { type: 'string' },
    description: 'List of discrepancies found in QA'
  },

  // Default fallback
  '_default': { type: 'string', description: 'Auto-generated from workflow YAML' }
};

/**
 * Get type definition for a field name
 */
function getFieldType(fieldName) {
  // Check exact match first
  if (TYPE_MAPPINGS[fieldName]) {
    return { ...TYPE_MAPPINGS[fieldName] };
  }

  // Check for nested paths (e.g., analyzeContentEssence.mainTopic)
  const parts = fieldName.split('.');
  if (parts.length > 1) {
    const baseField = parts[0];
    if (TYPE_MAPPINGS[baseField]) {
      const baseType = TYPE_MAPPINGS[baseField];
      if (baseType.type === 'object' && baseType.properties) {
        const nestedField = parts[1];
        if (baseType.properties[nestedField]) {
          return { ...baseType.properties[nestedField] };
        }
      }
    }
  }

  // Use default
  return { ...TYPE_MAPPINGS._default, description: `${fieldName} (auto-generated)` };
}

/**
 * Generate schema for a single step
 */
function generateStepSchema(step, sectionName) {
  const schema = {
    templateName: step.id,
    title: step.name,
    description: step.description,
    section: sectionName,
    input: {
      fields: (step.inputs || []).map(fieldName => ({
        name: fieldName,
        required: true,
        ...getFieldType(fieldName)
      }))
    },
    output: {
      fields: (step.outputs || []).map(fieldName => ({
        name: fieldName,
        ...getFieldType(fieldName)
      }))
    }
  };

  return schema;
}

/**
 * Main extraction function
 */
function extractSchemas() {
  console.log('🔍 YouTube Launch Optimizer Schema Extractor\n');

  // Paths
  const baseDir = path.resolve(__dirname, '..');
  const yamlPath = path.join(baseDir, 'youtube-launch-optimizer.yaml');
  const schemasDir = path.join(baseDir, 'schemas');

  // Read YAML
  console.log(`📖 Reading workflow: ${yamlPath}`);
  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  const workflow = parse(yamlContent);

  console.log(`   Name: ${workflow.name}`);
  console.log(`   Version: ${workflow.version}`);
  console.log(`   Sections: ${workflow.sections?.length || 0}\n`);

  // Ensure schemas directory exists
  if (!fs.existsSync(schemasDir)) {
    fs.mkdirSync(schemasDir, { recursive: true });
    console.log(`📁 Created: ${schemasDir}`);
  }

  // Track statistics
  const stats = {
    totalSteps: 0,
    schemasGenerated: 0,
    totalInputs: 0,
    totalOutputs: 0
  };

  // Process each section
  workflow.sections.forEach(section => {
    console.log(`\n📦 Section: ${section.name}`);
    console.log(`   Description: ${section.description}`);
    console.log(`   Steps: ${section.steps.length}`);

    section.steps.forEach(step => {
      stats.totalSteps++;
      stats.totalInputs += (step.inputs || []).length;
      stats.totalOutputs += (step.outputs || []).length;

      console.log(`\n   ⚙️  Step: ${step.id} - ${step.name}`);
      console.log(`      Inputs: ${(step.inputs || []).join(', ') || 'none'}`);
      console.log(`      Outputs: ${(step.outputs || []).join(', ') || 'none'}`);

      // Generate schema
      const schema = generateStepSchema(step, section.name);

      // Write schema file
      const schemaPath = path.join(schemasDir, `${step.id}.json`);
      fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
      stats.schemasGenerated++;

      console.log(`      ✅ Generated: ${step.id}.json`);
    });
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Extraction Summary');
  console.log('='.repeat(60));
  console.log(`Total Steps:           ${stats.totalSteps}`);
  console.log(`Schemas Generated:     ${stats.schemasGenerated}`);
  console.log(`Total Input Fields:    ${stats.totalInputs}`);
  console.log(`Total Output Fields:   ${stats.totalOutputs}`);
  console.log(`Output Directory:      ${schemasDir}`);
  console.log('='.repeat(60));

  return stats;
}

// Run extraction
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    extractSchemas();
    console.log('\n✅ Schema extraction complete!\n');
  } catch (error) {
    console.error('\n❌ Error during extraction:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

export { extractSchemas, generateStepSchema, getFieldType };
