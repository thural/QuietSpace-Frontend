#!/usr/bin/env node

/**
 * JSDoc Compliance Checker Script
 * 
 * Validates that migrated JavaScript files comply with Pure JSDoc strategy
 * including ESLint rules, JSDoc patterns, and migration quality.
 * 
 * Usage: node scripts/check-jsdoc-compliance.js [options] [files...]
 * 
 * Options:
 *   --fix         Auto-fix ESLint issues where possible
 *   --verbose     Detailed output
 *   --strict      Enable strict validation mode
 *   --summary     Show summary only
 *   --core-only   Check only core modules (src/core/**)
 *   --exclude=PAT Exclude files matching pattern
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const config = {
  // Core JSDoc patterns to validate
  jsdocPatterns: {
    // Essential tags that should be present
    requiredTags: ['@param', '@returns', '@type', '@typedef', '@property'],

    // TypeScript-specific patterns to avoid
    forbiddenPatterns: [
      /ReturnType<typeof/,
      /interface\s+\w+\s*{/,
      /type\s+\w+\s*=/,
      /enum\s+\w+\s*{/,
      /@ts-/,
      /\.d\.ts/,
    ],

    // Required JSDoc for exported items
    exportedItemPatterns: [
      /^export\s+(class|function|const|let|var)\s+/,
      /^export\s*{/,
      /^class\s+\w+/,
      /^function\s+\w+/,
    ],
  },

  // File patterns to include/exclude
  includePatterns: [
    '**/*.js',
    '**/*.jsx',
  ],

  excludePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.test.js',
    '**/*.spec.js',
    '**/*.config.js',
    '**/scripts/**',
  ],

  // Core modules to prioritize
  coreModules: [
    'src/core/auth/**',
    'src/core/cache/**',
    'src/core/di/**',
    'src/core/network/**',
    'src/core/services/**',
    'src/core/websocket/**',
    'src/core/theme/**',
  ],
};

class JSDocComplianceChecker {
  constructor(options = {}) {
    this.options = {
      fix: false,
      verbose: false,
      strict: false,
      summary: false,
      coreOnly: false,
      exclude: [],
      ...options,
    };

    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: [],
      warnings: [],
      fileResults: [],
    };
  }

  /**
   * Run the compliance check
   * @param {string[]} files - Specific files to check (optional)
   * @returns {Object} Check results
   */
  async run(files = []) {
    console.log('🔍 JSDoc Compliance Checker');
    console.log('=============================\n');

    const targetFiles = files.length > 0 ? files : this.getFilesToCheck();

    if (targetFiles.length === 0) {
      console.log('⚠️  No files found to check');
      return this.results;
    }

    console.log(`📁 Checking ${targetFiles.length} files...\n`);

    for (const file of targetFiles) {
      await this.checkFile(file);
    }

    // Run ESLint on all files
    await this.runESLintCheck(targetFiles);

    // Generate summary
    this.generateSummary();

    return this.results;
  }

  /**
   * Get list of files to check
   * @returns {string[]} Array of file paths
   */
  getFilesToCheck() {
    let pattern = this.options.coreOnly
      ? config.coreModules.join(' ')
      : 'src/**/*.js src/**/*.jsx';

    // Add exclusions
    const exclusions = [
      ...config.excludePatterns,
      ...this.options.exclude.map(ex => `--exclude=${ex}`)
    ];

    try {
      const result = execSync(
        `find ${pattern} -name "*.js" -o -name "*.jsx" | grep -v -E "${exclusions.join('|')}"`,
        {
          encoding: 'utf8',
          cwd: projectRoot,
          stdio: ['pipe', 'pipe', 'pipe']
        }
      );

      return result.trim().split('\n').filter(Boolean).map(f => join(projectRoot, f));
    } catch (error) {
      console.warn('  Could not find files using find command, trying alternative...');
      return this.findFilesRecursively(join(projectRoot, 'src'));
    }
  }

  /**
   * Recursive file finder (fallback)
   * @param {string} dir - Directory to search
   * @returns {string[]} Array of file paths
   */
  findFilesRecursively(dir) {
    const files = [];

    try {
      const items = require('fs').readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = require('fs').statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...this.findFilesRecursively(fullPath));
        } else if (this.shouldCheckFile(fullPath)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return files;
  }

  /**
   * Check if file should be included in check
   * @param {string} filePath - File path to check
   * @returns {boolean} Whether to check the file
   */
  shouldCheckFile(filePath) {
    const ext = extname(filePath);
    if (!['.js', '.jsx'].includes(ext)) return false;

    const relativePath = relative(projectRoot, filePath);

    // Check exclusions
    for (const pattern of config.excludePatterns) {
      if (this.matchesPattern(relativePath, pattern)) {
        return false;
      }
    }

    // Check custom exclusions
    for (const exclusion of this.options.exclude) {
      if (relativePath.includes(exclusion)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check individual file for JSDoc compliance
   * @param {string} filePath - Path to file to check
   */
  async checkFile(filePath) {
    const relativePath = relative(projectRoot, filePath);
    const fileResult = {
      file: relativePath,
      passed: true,
      errors: [],
      warnings: [],
      jsdocIssues: [],
    };

    try {
      const content = readFileSync(filePath, 'utf8');

      // Check for JSDoc patterns
      this.validateJSDocPatterns(content, fileResult);

      // Check for TypeScript-specific patterns
      this.validateNoTypeScriptPatterns(content, fileResult);

      // Check for proper JSDoc on exports
      this.validateExportedItems(content, fileResult);

      // Check for proper enum patterns
      this.validateEnumPatterns(content, fileResult);

      // Check for proper type definitions
      this.validateTypeDefinitions(content, fileResult);

      fileResult.passed = fileResult.errors.length === 0;

      if (!fileResult.passed) {
        this.results.failed++;
      } else {
        this.results.passed++;
      }

      this.results.warnings += fileResult.warnings.length;

    } catch (error) {
      fileResult.passed = false;
      fileResult.errors.push(`Failed to read file: ${error.message}`);
      this.results.failed++;
    }

    this.results.fileResults.push(fileResult);
    this.results.total++;

    // Output file results
    if (!this.options.summary && (fileResult.errors.length > 0 || fileResult.warnings.length > 0 || this.options.verbose)) {
      this.outputFileResult(fileResult);
    }
  }

  /**
   * Validate JSDoc patterns in file content
   * @param {string} content - File content
   * @param {Object} fileResult - File result object
   */
  validateJSDocPatterns(content, fileResult) {
    const lines = content.split('\n');
    let inJSDoc = false;
    let currentJSDoc = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check for JSDoc start
      if (trimmed.startsWith('/**')) {
        inJSDoc = true;
        currentJSDoc = [line];
        continue;
      }

      // Check for JSDoc end
      if (inJSDoc && trimmed.endsWith('*/')) {
        inJSDoc = false;
        currentJSDoc.push(line);

        // Validate JSDoc block
        this.validateJSDocBlock(currentJSDoc, fileResult, i + 1);
        currentJSDoc = [];
        continue;
      }

      // Collect JSDoc content
      if (inJSDoc) {
        currentJSDoc.push(line);
      }
    }
  }

  /**
   * Validate individual JSDoc block
   * @param {string[]} jsdocLines - JSDoc block lines
   * @param {Object} fileResult - File result object
   * @param {number} lineNumber - Line number in file
   */
  validateJSDocBlock(jsdocLines, fileResult, lineNumber) {
    const jsdocContent = jsdocLines.join('\n');

    // Check for required tags in functions
    if (this.isFunctionJSDoc(jsdocContent)) {
      if (!jsdocContent.includes('@param')) {
        fileResult.warnings.push(`Line ${lineNumber}: Function JSDoc missing @param tags`);
      }

      if (!jsdocContent.includes('@returns') && !jsdocContent.includes('@return')) {
        fileResult.warnings.push(`Line ${lineNumber}: Function JSDoc missing @returns tag`);
      }
    }

    // Check for type annotations
    if (!jsdocContent.includes('@type') && !jsdocContent.includes('@param') && !jsdocContent.includes('@returns')) {
      fileResult.warnings.push(`Line ${lineNumber}: JSDoc block missing type annotations`);
    }

    // Check for descriptions
    const hasDescription = jsdocLines.some(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('*') && !trimmed.startsWith('* @') && trimmed.length > 2;
    });

    if (!hasDescription) {
      fileResult.warnings.push(`Line ${lineNumber}: JSDoc block missing description`);
    }
  }

  /**
   * Check if JSDoc block is for a function
   * @param {string} jsdocContent - JSDoc content
   * @returns {boolean} Whether it's a function JSDoc
   */
  isFunctionJSDoc(jsdocContent) {
    return jsdocContent.includes('@param') || jsdocContent.includes('@returns') || jsdocContent.includes('@return');
  }

  /**
   * Validate no TypeScript-specific patterns
   * @param {string} content - File content
   * @param {Object} fileResult - File result object
   */
  validateNoTypeScriptPatterns(content, fileResult) {
    for (const pattern of config.jsdocPatterns.forbiddenPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        fileResult.errors.push(`TypeScript pattern found: ${pattern.source} - ${matches.length} occurrence(s)`);
      }
    }
  }

  /**
   * Validate exported items have JSDoc
   * @param {string} content - File content
   * @param {Object} fileResult - File result object
   */
  validateExportedItems(content, fileResult) {
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for export statements
      if (config.jsdocPatterns.exportedItemPatterns.some(pattern => pattern.test(line))) {
        // Look for JSDoc before the export
        const jsdocFound = this.findJSDocBeforeLine(lines, i);

        if (!jsdocFound) {
          fileResult.warnings.push(`Line ${i + 1}: Exported item missing JSDoc documentation`);
        }
      }
    }
  }

  /**
   * Find JSDoc block before a specific line
   * @param {string[]} lines - File lines
   * @param {number} lineIndex - Line index
   * @returns {boolean} Whether JSDoc was found
   */
  findJSDocBeforeLine(lines, lineIndex) {
    for (let i = lineIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();

      if (line.startsWith('/**')) {
        return true;
      }

      if (line && !line.startsWith('*') && !line.startsWith('//')) {
        return false;
      }
    }

    return false;
  }

  /**
   * Validate enum patterns
   * @param {string} content - File content
   * @param {Object} fileResult - File result object
   */
  validateEnumPatterns(content, fileResult) {
    // Check for Object.freeze() usage for enums
    const enumPattern = /export\s+const\s+(\w+)\s*=\s*Object\.freeze\s*\(/g;
    let match;

    while ((match = enumPattern.exec(content)) !== null) {
      const enumName = match[1];
      const startPos = match.index;
      const endPos = this.findMatchingBrace(content, startPos + match[0].length);

      if (endPos === -1) {
        fileResult.errors.push(`Enum ${enumName}: Unclosed Object.freeze() call`);
        continue;
      }

      const enumContent = content.substring(startPos, endPos + 1);

      // Check for JSDoc on enum
      const jsdocFound = this.findJSDocBeforeLine(content.split('\n'), content.substring(0, startPos).split('\n').length);

      if (!jsdocFound) {
        fileResult.warnings.push(`Enum ${enumName}: Missing JSDoc documentation`);
      }

      // Check for @readonly and @enum tags
      if (!enumContent.includes('@readonly') || !enumContent.includes('@enum')) {
        fileResult.warnings.push(`Enum ${enumName}: Missing @readonly or @enum tag`);
      }
    }
  }

  /**
   * Find matching closing brace
   * @param {string} content - Content to search
   * @param {number} startPos - Starting position
   * @returns {number} Position of matching brace or -1
   */
  findMatchingBrace(content, startPos) {
    let braceCount = 0;

    for (let i = startPos; i < content.length; i++) {
      const char = content[i];

      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Validate type definitions
   * @param {string} content - File content
   * @param {Object} fileResult - File result object
   */
  validateTypeDefinitions(content, fileResult) {
    // Check for @typedef definitions
    const typedefPattern = /@typedef\s+{([^}]+)}\s+(\w+)/g;
    let match;

    while ((match = typedefPattern.exec(content)) !== null) {
      const typeName = match[2];
      const typeDefinition = match[1];

      // Check for proper type structure
      if (typeDefinition.includes('interface') || typeDefinition.includes('type ')) {
        fileResult.errors.push(`Type ${typeName}: TypeScript-specific syntax in @typedef`);
      }

      // Check for property documentation
      const propertyPattern = new RegExp(`@property\\s+{[^}]+}\\s+\\w+.*${typeName}`, 'g');
      const hasProperties = propertyPattern.test(content);

      if (!hasProperties && typeDefinition.includes('Object')) {
        fileResult.warnings.push(`Type ${typeName}: Object @typedef missing @property definitions`);
      }
    }
  }

  /**
   * Run ESLint check on files
   * @param {string[]} files - Files to check
   */
  async runESLintCheck(files) {
    console.log('🔧 Running ESLint check...\n');

    try {
      const eslintCmd = `npx eslint ${files.join(' ')} --format=json`;

      if (this.options.fix) {
        execSync(`npx eslint ${files.join(' ')} --fix`, {
          cwd: projectRoot,
          stdio: 'inherit'
        });
        console.log('✅ ESLint auto-fix applied');
      }

      const result = execSync(eslintCmd, {
        encoding: 'utf8',
        cwd: projectRoot,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      const eslintResults = JSON.parse(result);

      for (const eslintResult of eslintResults) {
        const fileResult = this.results.fileResults.find(fr => fr.file === eslintResult.filePath);

        if (fileResult) {
          for (const message of eslintResult.messages) {
            if (message.ruleId && message.ruleId.startsWith('jsdoc/')) {
              if (message.severity === 2) {
                fileResult.errors.push(`ESLint: ${message.message} (${message.ruleId})`);
              } else {
                fileResult.warnings.push(`ESLint: ${message.message} (${message.ruleId})`);
              }
            }
          }
        }
      }

      console.log(`✅ ESLint check completed (${eslintResults.length} files processed)`);

    } catch (error) {
      // ESLint found issues
      if (error.stdout) {
        try {
          const eslintResults = JSON.parse(error.stdout);

          for (const eslintResult of eslintResults) {
            const fileResult = this.results.fileResults.find(fr =>
              fr.file === relative(projectRoot, eslintResult.filePath)
            );

            if (fileResult) {
              for (const message of eslintResult.messages) {
                if (message.ruleId && message.ruleId.startsWith('jsdoc/')) {
                  if (message.severity === 2) {
                    fileResult.errors.push(`ESLint: ${message.message} (${message.ruleId})`);
                  } else {
                    fileResult.warnings.push(`ESLint: ${message.message} (${message.ruleId})`);
                  }
                }
              }
            }
          }

          console.log(`⚠️  ESLint found issues in ${eslintResults.length} files`);

        } catch (parseError) {
          console.error('❌ Failed to parse ESLint output:', parseError.message);
        }
      } else {
        console.error('❌ ESLint check failed:', error.message);
      }
    }
  }

  /**
   * Output results for a single file
   * @param {Object} fileResult - File result object
   */
  outputFileResult(fileResult) {
    const status = fileResult.passed ? '✅' : '❌';
    console.log(`${status} ${fileResult.file}`);

    if (fileResult.errors.length > 0) {
      for (const error of fileResult.errors) {
        console.log(`   ❌ ${error}`);
      }
    }

    if (fileResult.warnings.length > 0) {
      for (const warning of fileResult.warnings) {
        console.log(`   ⚠️  ${warning}`);
      }
    }

    console.log('');
  }

  /**
   * Generate and display summary
   */
  generateSummary() {
    console.log('\n📊 Compliance Check Summary');
    console.log('==========================\n');

    console.log(`📁 Total files checked: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Total warnings: ${this.results.warnings}\n`);

    if (this.results.failed > 0) {
      console.log('❌ Files with errors:');
      for (const fileResult of this.results.fileResults) {
        if (!fileResult.passed) {
          console.log(`   - ${fileResult.file} (${fileResult.errors.length} errors)`);
        }
      }
      console.log('');
    }

    const complianceRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    console.log(`📈 Compliance Rate: ${complianceRate}%`);

    if (complianceRate >= 90) {
      console.log('🎉 Excellent compliance!');
    } else if (complianceRate >= 75) {
      console.log('👍 Good compliance');
    } else if (complianceRate >= 50) {
      console.log('⚠️  Moderate compliance - needs improvement');
    } else {
      console.log('❌ Poor compliance - significant work needed');
    }

    // Exit with appropriate code
    if (this.results.failed > 0) {
      process.exit(1);
    }
  }

  /**
   * Check if path matches pattern
   * @param {string} path - Path to check
   * @param {string} pattern - Pattern to match
   * @returns {boolean} Whether path matches pattern
   */
  matchesPattern(path, pattern) {
    // Simple glob pattern matching
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');

    return new RegExp(`^${regexPattern}$`).test(path);
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const options = {};
  const files = [];

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');

      if (key === 'exclude') {
        if (!options.exclude) options.exclude = [];
        options.exclude.push(value);
      } else {
        options[key] = value === undefined ? true : value;
      }
    } else {
      files.push(arg);
    }
  }

  // Create and run checker
  const checker = new JSDocComplianceChecker(options);

  checker.run(files).catch(error => {
    console.error('❌ Checker failed:', error.message);
    process.exit(1);
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default JSDocComplianceChecker;
