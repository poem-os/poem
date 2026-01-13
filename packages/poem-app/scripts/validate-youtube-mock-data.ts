/**
 * Script to validate YouTube Launch Optimizer mock data against its schema
 * Run with: npx tsx scripts/validate-youtube-mock-data.ts
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { SchemaValidator } from '../src/services/schema/validator';
import { convertJSONSchemaToUnified } from '../src/services/mock-generator/schema-converter';

async function main() {
  try {
    console.log('🔍 Validating YouTube Launch Optimizer mock data...\n');

    // 1. Read the JSON Schema
    const schemaPath = path.resolve(
      process.cwd(),
      '../../data/youtube-launch-optimizer/schemas/workflow-attributes.json'
    );

    console.log(`📖 Reading schema: ${schemaPath}`);
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    const jsonSchema = JSON.parse(schemaContent);

    // 2. Convert to UnifiedSchema
    console.log('🔄 Converting to UnifiedSchema format...');
    const unifiedSchema = convertJSONSchemaToUnified(
      jsonSchema,
      'youtube-launch-optimizer-workflow'
    );

    // 3. Read the generated mock data
    const mockDataPath = path.resolve(
      process.cwd(),
      '../../dev-workspace/workflows/youtube-launch-optimizer/mock-data/workflow-data.json'
    );

    console.log(`📖 Reading mock data: ${mockDataPath}`);
    const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf-8'));

    // 4. Validate the data
    console.log('✅ Validating mock data against schema...\n');
    const validator = new SchemaValidator();
    const validationResult = validator.validateUnified(mockData, unifiedSchema, 'input');

    if (validationResult.valid) {
      console.log('✅ Validation PASSED!');
      console.log(`   All ${Object.keys(mockData).length} fields are valid\n`);
    } else {
      console.log('❌ Validation FAILED!');
      console.log(`\n   Errors found: ${validationResult.errors.length}\n`);

      validationResult.errors.forEach((error, index) => {
        const icon = error.severity === 'error' ? '❌' : '⚠️';
        console.log(`   ${icon} ${index + 1}. ${error.field}: ${error.message}`);
      });
      console.log();

      process.exit(1);
    }

    // 5. Summary
    console.log('📊 Validation Summary:');
    console.log(`   Schema fields: ${unifiedSchema.input.fields.length}`);
    console.log(`   Mock data fields: ${Object.keys(mockData).length}`);
    console.log(`   Required fields: ${unifiedSchema.input.fields.filter(f => f.required).length}`);
    console.log(`   Validation result: ${validationResult.valid ? 'PASS' : 'FAIL'}\n`);
  } catch (error) {
    console.error('❌ Error validating mock data:', error);
    process.exit(1);
  }
}

main();
