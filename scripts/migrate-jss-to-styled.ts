#!/usr/bin/env ts-node

/**
 * JSS to Styled-Components Migration Script
 * 
 * This script automatically migrates JSS style files to styled-components
 * while maintaining the same styling behavior and theme integration.
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface JSSStyleFile {
    filePath: string;
    content: string;
    componentName: string;
}

// Template for styled-components migration
const STYLED_COMPONENTS_TEMPLATE = (componentName: string, styles: string) => `/**
 * ${componentName} Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

${styles}

// Legacy export for backward compatibility during migration
export const ${componentName}Styles = {
  ${Object.keys(JSON.parse(styles.replace(/.*?export const (\w+) = styled\.component.*?{([^}]+)}.*/gs, '$1:$2'))).join(',\n  ')},
};
`;

// Convert JSS createUseStyles to styled-components
const convertJSSToStyled = (jssContent: string, componentName: string): string => {
    // Extract the styles object from createUseStyles
    const stylesMatch = jssContent.match(/createUseStyles\(\(theme: Theme\) => \(([\s\S]*?)\)\)/);
    if (!stylesMatch) {
        throw new Error(`Could not extract styles from ${componentName}`);
    }

    const stylesObject = stylesMatch[1];

    // Convert JSS syntax to styled-components
    let styledComponents = '';

    // Parse each style rule
    const styleRules = stylesObject.match(/(\w+):\s*{([^}]+)}/g);
    if (styleRules) {
        styleRules.forEach(rule => {
            const ruleMatch = rule.match(/(\w+):\s*{([^}]+)}/);
            if (ruleMatch) {
                const [, ruleName, ruleStyles] = ruleMatch;
                const componentNameCamel = ruleName.charAt(0).toUpperCase() + ruleName.slice(1);

                // Convert JSS styles to CSS
                const cssStyles = convertJSSToCSS(ruleStyles);

                styledComponents += `export const ${componentNameCamel} = styled.div<{ theme: Theme }>\`\n${cssStyles}\`;\n\n`;
            }
        });
    }

    return styledComponents;
};

// Convert JSS style syntax to CSS
const convertJSSToCSS = (jssStyles: string): string => {
    let css = jssStyles;

    // Convert theme.spacing() calls
    css = css.replace(/theme\.spacing\(([^)]+)\)/g, 'props.theme.spacing($1)');

    // Convert theme.colors references
    css = css.replace(/theme\.colors\.(\w+)/g, 'props.theme.colors?.$1 || "default"');

    // Convert theme.typography references
    css = css.replace(/theme\.typography\.(\w+)/g, 'props.theme.typography.$1');

    // Convert theme.radius references
    css = css.replace(/theme\.radius\.(\w+)/g, 'props.theme.radius.$1');

    // Convert nested selectors (&.hover, etc.)
    css = css.replace(/&\s*\./g, '&.');

    // Convert media queries
    css = css.replace(/'@media \([^)]+\)':/g, '@media $1:');

    return css.trim();
};

// Find all JSS files
const findJSSFiles = async (): Promise<JSSStyleFile[]> => {
    const pattern = '**/styles/**/*Styles.ts';
    const files = await glob(pattern, { cwd: process.cwd() });

    const jssFiles: JSSStyleFile[] = [];

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');

        // Check if file uses createUseStyles
        if (content.includes('createUseStyles')) {
            const componentName = path.basename(file, '.ts');
            jssFiles.push({
                filePath: file,
                content,
                componentName
            });
        }
    }

    return jssFiles;
};

// Migrate a single JSS file
const migrateJSSFile = async (jssFile: JSSStyleFile): Promise<void> => {
    try {
        const styledComponents = convertJSSToStyled(jssFile.content, jssFile.componentName);

        // Create new file with .tsx extension for styled-components
        const newPath = jssFile.filePath.replace(/\.ts$/, '.tsx');
        const newFileName = path.basename(newPath, '.tsx');
        const pascalCaseName = newFileName.charAt(0).toUpperCase() + newFileName.slice(1);

        const newContent = `/**
 * ${pascalCaseName} Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

${styledComponents}

// Legacy export for backward compatibility during migration
export const ${jssFile.componentName} = {
  // Add legacy exports here if needed
};
`;

        // Write the new file
        fs.writeFileSync(newPath, newContent, 'utf-8');

        // Backup the original file
        const backupPath = jssFile.filePath + '.backup';
        fs.renameSync(jssFile.filePath, backupPath);

        console.log(`✅ Migrated: ${jssFile.filePath} -> ${newPath}`);
        console.log(`📦 Backup: ${backupPath}`);

    } catch (error) {
        console.error(`❌ Failed to migrate ${jssFile.filePath}:`, error);
    }
};

// Main migration function
const main = async (): Promise<void> => {
    console.log('🚀 Starting JSS to Styled-Components Migration...\n');

    try {
        const jssFiles = await findJSSFiles();
        console.log(`📁 Found ${jssFiles.length} JSS files to migrate\n`);

        for (const jssFile of jssFiles) {
            await migrateJSSFile(jssFile);
        }

        console.log('\n✨ Migration completed!');
        console.log('📝 Next steps:');
        console.log('1. Update component imports to use new styled-components');
        console.log('2. Test all migrated components');
        console.log('3. Remove react-jss dependency from package.json');
        console.log('4. Clean up backup files if migration is successful');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

// Run the migration
if (require.main === module) {
    main();
}

export { migrateJSSFile, findJSSFiles, convertJSSToStyled };
