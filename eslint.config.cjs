const jsConfigs = require('@eslint/js')
const tseslint = require('typescript-eslint')
const eslintPlugin = require('@nx/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const { node, jest, vitest } = require('globals')
const jsoncParser = require('jsonc-eslint-parser')
const angular = require('angular-eslint')
const pluginImport = require('eslint-plugin-import')
const pluginSimpleImportSort = require('eslint-plugin-simple-import-sort')
const pluginUnusedImports = require('eslint-plugin-unused-imports')

module.exports = [
  jsConfigs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...eslintPlugin.configs['flat/base'],
  ...eslintPlugin.configs['flat/typescript'],
  ...eslintPlugin.configs['flat/javascript'],
  ...angular.configs.tsRecommended,
  {
    ignores: ['node_modules', '**/*.js', '.angular'],
  },
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        ...node,
        ...jest,
        ...vitest,
      },
    },
    rules: {
      semi: ['error', 'always'], // Require semicolons
      'no-unused-vars': 'warn', // Warn on unused variables
      'no-undef': 'warn', // Warn on undefined variables
      'no-debugger': 'warn', // Warn on debugger statements
    },
  },
  {
    files: ['*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {},
  },
  {
    files: ['**/*.cjs', '**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'semi': 'off'
    },
  },
  {
    files: ['**/*.ts'],
    processor: angular.processInlineTemplates,
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: ['Component', 'Page'],
        },
      ],
      'import/first': 'error',
      'import/no-duplicates': 'warn',
      'import/newline-after-import': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [['^\\u0000'], ['^'], ['^\\.\\.'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'semi': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
]
