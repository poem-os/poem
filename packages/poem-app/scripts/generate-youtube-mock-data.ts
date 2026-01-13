/**
 * Script to generate YouTube Launch Optimizer workflow mock data
 * Run with: npx tsx scripts/generate-youtube-mock-data.ts
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { generateFromSchema } from '../src/services/mock-generator';
import { convertJSONSchemaToUnified } from '../src/services/mock-generator/schema-converter';

async function main() {
  try {
    console.log('📦 Generating YouTube Launch Optimizer mock data...\n');

    // 1. Read the workflow-attributes JSON Schema
    const schemaPath = path.resolve(
      process.cwd(),
      '../../data/youtube-launch-optimizer/schemas/workflow-attributes.json'
    );

    console.log(`📖 Reading schema: ${schemaPath}`);
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    const jsonSchema = JSON.parse(schemaContent);

    // 2. Convert to UnifiedSchema format
    console.log('🔄 Converting JSON Schema to UnifiedSchema format...');
    const unifiedSchema = convertJSONSchemaToUnified(
      jsonSchema,
      'youtube-launch-optimizer-workflow'
    );

    console.log(`✅ Converted ${unifiedSchema.input.fields.length} fields\n`);

    // 3. Generate mock data
    console.log('🎲 Generating mock data...');
    const result = generateFromSchema(unifiedSchema, {
      count: 1,
      seed: 12345, // Fixed seed for reproducibility
      includeEdgeCases: false
    });

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach((warning) => console.log(`   - ${warning}`));
      console.log();
    }

    // 4. Save to dev-workspace
    const outputPath = path.resolve(
      process.cwd(),
      '../../dev-workspace/workflows/youtube-launch-optimizer/mock-data/workflow-data.json'
    );

    console.log(`💾 Saving mock data to: ${outputPath}`);

    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write mock data
    await fs.writeFile(
      outputPath,
      JSON.stringify(result.data[0], null, 2),
      'utf-8'
    );

    console.log(`\n✅ Successfully generated mock data!`);
    console.log(`   Fields generated: ${Object.keys(result.data[0]).length}`);
    console.log(`   Seed used: ${result.seed}`);
    console.log(`   Output: ${outputPath}\n`);
  } catch (error) {
    console.error('❌ Error generating mock data:', error);
    process.exit(1);
  }
}

main();
