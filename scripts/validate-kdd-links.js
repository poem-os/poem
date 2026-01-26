#!/usr/bin/env node

/**
 * Validate all Markdown links in docs/kdd/ directory
 * Measures VAL-001 link health after fixes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Find all .md files in docs/kdd/
function findMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Extract Markdown links from content
function extractLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const text = match[1];
    const target = match[2];

    // Skip external URLs
    if (target.startsWith('http://') || target.startsWith('https://')) {
      continue;
    }

    // Parse target (may have anchor)
    const [filepath, anchor] = target.split('#');

    links.push({
      text,
      target,
      filepath,
      anchor: anchor || null,
      line: content.substring(0, match.index).split('\n').length
    });
  }

  return links;
}

// Extract anchors (headings) from Markdown content
function extractAnchors(content) {
  const anchors = new Set();
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^#+\s+(.+)$/);
    if (match) {
      const heading = match[1];
      // Convert heading to anchor format
      const anchor = heading
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      anchors.add(anchor);
    }
  }

  return anchors;
}

// Validate a single link
function validateLink(sourceFile, link) {
  const sourceDir = path.dirname(sourceFile);

  // Resolve relative path
  let targetPath;
  if (link.filepath.startsWith('/')) {
    // Absolute from project root
    targetPath = path.join(projectRoot, link.filepath);
  } else {
    // Relative to source file
    targetPath = path.resolve(sourceDir, link.filepath);
  }

  // Check if file exists
  if (!fs.existsSync(targetPath)) {
    return {
      valid: false,
      reason: 'File not found',
      link,
      sourceFile,
      targetPath
    };
  }

  // Check if it's a directory (handle directory links)
  const stats = fs.statSync(targetPath);
  if (stats.isDirectory()) {
    // Directory links are valid (they point to index.md implicitly)
    return { valid: true, link, sourceFile, targetPath };
  }

  // If anchor specified, check if it exists
  if (link.anchor) {
    const targetContent = fs.readFileSync(targetPath, 'utf-8');
    const anchors = extractAnchors(targetContent);

    if (!anchors.has(link.anchor)) {
      return {
        valid: false,
        reason: 'Anchor not found',
        link,
        sourceFile,
        targetPath
      };
    }
  }

  return { valid: true, link, sourceFile, targetPath };
}

// Main validation
function main() {
  const kddDir = path.join(projectRoot, 'docs/kdd');
  const files = findMarkdownFiles(kddDir);

  console.log('=== KDD Link Validation Report ===\n');
  console.log(`Scanning ${files.length} Markdown files in docs/kdd/\n`);

  let totalLinks = 0;
  let validLinks = 0;
  let brokenLinks = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractLinks(content);

    for (const link of links) {
      totalLinks++;
      const result = validateLink(file, link);

      if (result.valid) {
        validLinks++;
      } else {
        brokenLinks.push(result);
      }
    }
  }

  // Report results
  const healthScore = totalLinks > 0 ? ((validLinks / totalLinks) * 100).toFixed(1) : 0;

  console.log('--- Summary ---');
  console.log(`Total links checked: ${totalLinks}`);
  console.log(`Valid links: ${validLinks} (${healthScore}%)`);
  console.log(`Broken links: ${brokenLinks.length} (${(100 - healthScore).toFixed(1)}%)\n`);

  if (brokenLinks.length > 0) {
    console.log('--- Broken Links ---\n');

    // Group by source file
    const byFile = {};
    for (const broken of brokenLinks) {
      const relPath = path.relative(projectRoot, broken.sourceFile);
      if (!byFile[relPath]) {
        byFile[relPath] = [];
      }
      byFile[relPath].push(broken);
    }

    for (const [file, links] of Object.entries(byFile)) {
      console.log(`${file}:`);
      for (const broken of links) {
        console.log(`  Line ${broken.link.line}: [${broken.link.text}](${broken.link.target})`);
        console.log(`    Reason: ${broken.reason}`);
        if (broken.reason === 'File not found') {
          console.log(`    Expected: ${path.relative(projectRoot, broken.targetPath)}`);
        } else if (broken.reason === 'Anchor not found') {
          console.log(`    Anchor: #${broken.link.anchor}`);
        }
      }
      console.log();
    }
  }

  // Comparison to previous results
  console.log('--- Improvement Analysis ---');
  const previousScore = 87.8;
  const improvement = healthScore - previousScore;
  console.log(`Previous score: ${previousScore}%`);
  console.log(`Current score: ${healthScore}%`);
  console.log(`Improvement: ${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)} percentage points`);

  if (improvement > 0) {
    console.log('✅ Link health improved!');
  } else if (improvement === 0) {
    console.log('➡️ Link health unchanged');
  } else {
    console.log('⚠️ Link health decreased');
  }

  // Exit code
  process.exit(brokenLinks.length > 0 ? 1 : 0);
}

main();
