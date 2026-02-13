#!/usr/bin/env node

/**
 * Theme Usage Validation Script
 * 
 * This script validates that UI components don't contain hard-coded styling values
 * and properly use theme tokens instead.
 */

const fs = require('fs');
const path = require('path');

// Hard-coded patterns to detect
const HARDCODED_PATTERNS = [
  /\b\d+px\b/g,           // 12px, 8px, etc.
  /\b\d+rem\b/g,          // 1rem, 0.5rem, etc.
  /\b\d+em\b/g,           // 1em, 0.5em, etc.
  /\#[0-9a-fA-F]{6}/g,    // hex colors #ffffff
  /\#[0-9a-fA-F]{3}/g,     // hex colors #fff
  /rgba?\([^)]+\)/g,        // rgba/rgb colors
  /linear-gradient\([^)]+\)/g, // gradients
];

const EXCLUDED_PATTERNS = [
  /\/\*[\s\S]*?\*\//g,     // comments
  /\/\/.*$/gm,              // single line comments
  /`[^`]*`/g,             // template literals (might contain dynamic values)
];

const UI_COMPONENTS_DIR = path.join(__dirname, '../src/shared/ui/components');

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, index) => {
    // Skip excluded patterns
    let processedLine = line;
    EXCLUDED_PATTERNS.forEach(pattern => {
      processedLine = processedLine.replace(pattern, '');
    });

    HARDCODED_PATTERNS.forEach(pattern => {
      const matches = processedLine.match(pattern);
      if (matches) {
        matches.forEach(match => {
          violations.push({
            line: index + 1,
            content: line.trim(),
            violation: match,
            type: 'hard-coded-value'
          });
        });
      }
    });
  });

  return violations;
}

function validateDirectory(dir) {
  const results = [];
  
  function traverseDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (/\.(tsx?|jsx?)$/.test(item)) {
        const violations = validateFile(fullPath);
        if (violations.length > 0) {
          results.push({
            file: path.relative(UI_COMPONENTS_DIR, fullPath),
            violations
          });
        }
      }
    }
  }
  
  traverseDirectory(dir);
  return results;
}

function main() {
  console.log('🔍 Validating theme token usage in UI components...\n');
  
  if (!fs.existsSync(UI_COMPONENTS_DIR)) {
    console.error(`❌ UI components directory not found: ${UI_COMPONENTS_DIR}`);
    process.exit(1);
  }

  const results = validateDirectory(UI_COMPONENTS_DIR);
  
  if (results.length === 0) {
    console.log('✅ No hard-coded styling values found!');
    console.log('🎉 All components are properly using theme tokens.');
  } else {
    console.log(`❌ Found ${results.length} files with hard-coded values:\n`);
    
    results.forEach(result => {
      console.log(`📁 ${result.file}:`);
      result.violations.forEach(violation => {
        console.log(`   Line ${violation.line}: ${violation.violation}`);
        console.log(`   Content: ${violation.content}`);
        console.log('');
      });
    });
    
    console.log('\n💡 Please replace hard-coded values with theme tokens:');
    console.log('   - Use getSpacing(theme, "sm") instead of "8px"');
    console.log('   - Use getColor(theme, "brand.500") instead of "#007bff"');
    console.log('   - Use getRadius(theme, "md") instead of "4px"');
    console.log('   - Use getBorderWidth(theme, "sm") instead of "1px"');
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateFile, validateDirectory };
