import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import stylistic from '@stylistic/eslint-plugin'
import jsdoc from 'eslint-plugin-jsdoc'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '**/*.config.js', '**/*.config.ts'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      './eslint-rules/theme-compliance-rules.js'
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: [
          './tsconfig.json',
          './tsconfig.test.json'
        ],
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
      '@stylistic': stylistic,
      'jsdoc': jsdoc,
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
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE']
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
          selector: 'objectLiteralProperty',
          format: ['camelCase', 'UPPER_CASE']
        }
      ],

      // Google Style Guide - OOP Patterns (temporarily relaxed for migration)
      '@typescript-eslint/explicit-member-accessibility': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Disallowed Patterns
      'no-debugger': 'error',
      'no-eval': 'error',
      'no-var': 'error',

      // Google Style Guide - Import/Export Rules
      'import/no-default-export': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-namespace': 'warn',
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type'
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false }
      ],
      'import/no-relative-parent-imports': 'warn',

      // Google Style Guide - JSDoc Requirements (temporarily relaxed)
      // 'jsdoc/require-jsdoc': ['error', { require: { ClassDeclaration: true, FunctionDeclaration: true, MethodDefinition: true } }],
      // 'jsdoc/require-description': 'error',
      // 'jsdoc/require-param': 'error',
      // 'jsdoc/require-returns': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/no-types': 'error',
      'jsdoc/valid-types': 'error',

      // Google Style Guide - Code Formatting (@stylistic)
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/max-len': ['warn', { code: 100, ignoreUrls: true }],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      '@stylistic/member-delimiter-style': ['error', { multiline: { delimiter: 'semi' } }],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],

      // Google Style Guide - Advanced Type Safety (temporarily relaxed for migration)
      // '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      // '@typescript-eslint/strict-boolean-expressions': 'error',
      // '@typescript-eslint/prefer-function-type': 'warn',
      // '@typescript-eslint/no-non-null-assertion': 'error',
      // '@typescript-eslint/prefer-nullish-coalescing': 'error',
      // '@typescript-eslint/prefer-optional-chain': 'error',
      // '@typescript-eslint/prefer-readonly': 'error',
      // '@typescript-eslint/prefer-for-of': 'error',
      // '@typescript-eslint/no-unnecessary-condition': 'error',
      // '@typescript-eslint/no-floating-promises': 'error',

      // Google Style Guide - Ban Rules
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': false, 'ts-nocheck': false }],
      '@typescript-eslint/no-dynamic-delete': 'error'
    }
  }
)
