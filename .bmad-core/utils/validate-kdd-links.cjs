#!/usr/bin/env node
/**
 * KDD Link Validator for Pre-commit Hook
 *
 * Purpose: Lightweight link validation for KDD (Knowledge-Driven Development) documents
 * Usage: Called by .husky/pre-commit when KDD files are changed
 *
 * Behavior:
 * - Validates all internal links in production KDD documents
 * - Ignores docs/kdd/meta/ (allows example files to reference non-existent docs)
 * - Fails (exit 1) if broken links found in production docs
 * - Passes (exit 0) if all links valid
 *
 * Performance: ~1 second for 43 documents
 *
 * Created: 2026-01-26
 * Owner: Lisa (Librarian)
 * Project: POEM OS
 */

const fs = require('fs');
const path = require('path');

const kddDir = 'docs/kdd';
const ignorePaths = [
  'docs/kdd/meta' // Meta docs can have example links
];

let brokenLinks = [];
let totalLinks = 0;

/**
 * Extract markdown links from file content
 * Format: [text](path) or [text](path#anchor)
 */
function extractLinks(content, filePath) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const linkPath = match[2];

    // Skip external URLs and internal anchors
    if (linkPath.startsWith('http://') ||
        linkPath.startsWith('https://') ||
        linkPath.startsWith('#')) {
      continue;
    }

    totalLinks++;

    // Resolve relative path
    const dir = path.dirname(filePath);
    const [targetFile] = linkPath.split('#'); // Ignore anchor for file check
    const resolvedPath = path.resolve(dir, targetFile);

    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      brokenLinks.push({
        source: filePath,
        target: linkPath,
        resolved: resolvedPath
      });
    }
  }
}

/**
 * Recursively scan directory for markdown files
 */
function scanDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ KDD directory not found: ${dir}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip ignored paths (meta docs with examples)
    if (ignorePaths.some(ignore => fullPath.startsWith(ignore))) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      extractLinks(content, fullPath);
    }
  }
}

// Main execution
console.log('🔍 Lisa: Validating KDD topology...\n');

scanDirectory(kddDir);

if (brokenLinks.length > 0) {
  console.error('❌ VALIDATION FAILED: Broken links detected in production KDD documents\n');
  console.error(`   Total links checked: ${totalLinks}`);
  console.error(`   Broken links: ${brokenLinks.length}\n`);

  console.error('Broken links:\n');
  brokenLinks.forEach(link => {
    console.error(`  📄 ${link.source}`);
    console.error(`     → ${link.target}`);
    console.error(`     (resolved to: ${link.resolved})\n`);
  });

  console.error('💡 Fix these links before committing.');
  console.error('   Tip: Run "npm run validate-kdd" for detailed validation report\n');
  process.exit(1);
}

console.log('✅ KDD topology healthy');
console.log(`   Links checked: ${totalLinks}`);
console.log(`   Broken links: 0\n`);
process.exit(0);
