import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '**/*.config.js', '**/*.config.ts'] },
  {
    extends: [
      js.configs.recommended, 
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      stylistic,
      import: importPlugin,
      jsdoc
    },
    rules: {
      // React Hooks Rules
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      
      // Google Style Guide - Naming Conventions
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow'
        },
        {
          selector: ['class', 'interface', 'typeAlias', 'enum', 'typeParameter'],
          format: ['PascalCase']
        },
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          format: ['UPPER_CASE']
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE']
        },
        {
          selector: 'function',
          format: ['camelCase']
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase']
        }
      ],
      
      // Google Style Guide - OOP Patterns
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/prefer-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-const': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      
      // Import Rules
      'import/no-default-export': 'error',
      'import/prefer-named-export': 'error',
      'import/no-namespace': 'warn',
      'import/order': [
        'error',
        { 
          groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always'
        }
      ],
      'import/no-mutable-exports': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'import/no-relative-parent-imports': 'warn',
      
      // Stylistic Rules (Google Style Guide)
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/max-len': ['warn', { code: 100 }],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'semi', requireLast: true },
          singleline: { delimiter: 'semi', requireLast: false }
        }
      ],
      
      // JSDoc Rules
      'jsdoc/require-jsdoc': [
        'error',
        { 
          require: { 
            ClassDeclaration: true, 
            FunctionDeclaration: true, 
            MethodDefinition: true 
          } 
        }
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/check-tag-names': 'error',
      
      // Disallowed Patterns
      'no-debugger': 'error',
      'no-eval': 'error',
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': false }],
      'no-var': 'error'
    }
  }
)
