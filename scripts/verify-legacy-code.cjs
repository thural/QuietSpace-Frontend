#!/usr/bin/env node

/**
 * Authentication Module Legacy Code Verification Script
 * 
 * This script checks for any remaining dependencies on deprecated authentication components
 * before proceeding with the legacy code cleanup.
 */

const fs = require('fs');
const path = require('path');

// Patterns to search for deprecated components
const deprecatedPatterns = [
    'EnterpriseAuthService',
    'EnterpriseAuthServiceAdapter',
    'IAuthProvider',
    'createDefaultAuthService',
    'AuthModule.createDefault',
    'createEnterpriseAuthServiceAdapter',
    'addRule.*deprecated',
    'getTokenInfo.*deprecated',
    'isTokenExpired.*deprecated',
    'getTokenTimeToExpiry.*deprecated',
    '@deprecated.*EnterpriseAuthService',
    '@deprecated.*AuthOrchestrator',
    '@deprecated.*createDefault'
];

// Directories to search
const searchDirectories = [
    'src/core/modules/authentication'
    // Excluding features/auth as it's outside authentication module scope
];

// File extensions to search
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function searchInFiles(patterns, directories, extensions) {
    const results = [];

    for (const dir of directories) {
        if (!fs.existsSync(dir)) {
            continue;
        }

        const files = [];

        function walkDirectory(currentDir) {
            const items = fs.readdirSync(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    walkDirectory(fullPath);
                } else if (stat.isFile() && extensions.includes(path.extname(fullPath))) {
                    files.push(fullPath);
                }
            }
        }

        walkDirectory(dir);

        // Search in each file
        for (const file of files) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const lines = content.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const lineNumber = i + 1;

                    for (const pattern of patterns) {
                        const regex = new RegExp(pattern, 'i');
                        const matches = line.match(regex);

                        if (matches) {
                            results.push({
                                file: path.relative(process.cwd(), file),
                                line: lineNumber,
                                content: line.trim(),
                                pattern: pattern,
                                match: matches[0]
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(`Error reading file ${file}:`, error.message);
            }
        }
    }

    return results;
}

function generateReport(results) {
    console.log('🔍 Authentication Module Legacy Code Verification Report');
    console.log('='.repeat(60));
    console.log();

    if (results.length === 0) {
        console.log('✅ No deprecated components found! Ready for cleanup.');
        return;
    }

    console.log(`⚠️  Found ${results.length} instances of deprecated components:`);
    console.log();

    // Group by file
    const groupedResults = {};
    for (const result of results) {
        const key = result.file;
        if (!groupedResults[key]) {
            groupedResults[key] = [];
        }
        groupedResults[key].push(result);
    }

    // Display results
    for (const [file, occurrences] of Object.entries(groupedResults)) {
        console.log(`📁 ${file}:`);
        console.log(`   ${occurrences.length} occurrences:`);

        for (const occurrence of occurrences) {
            console.log(`   Line ${occurrence.line}: ${occurrence.content}`);
            console.log(`   Pattern: ${occurrence.pattern}`);
            console.log();
        }
    }

    console.log();
    console.log('📋 Recommendations:');
    console.log('1. Update all imports to use new interfaces');
    console.log('2. Replace deprecated factory method calls');
    console.log('3. Review and update the cleanup plan before proceeding with legacy code removal.');
    console.log('4. Consider using feature flags for gradual cleanup');
}

function main() {
    console.log('🔍 Starting Authentication Module Legacy Code Verification...');
    console.log();

    const results = searchInFiles(deprecatedPatterns, searchDirectories, fileExtensions);
    generateReport(results);

    // Exit with appropriate code
    process.exit(results.length === 0 ? 0 : 1);
}

if (require.main === module) {
    main();
}
