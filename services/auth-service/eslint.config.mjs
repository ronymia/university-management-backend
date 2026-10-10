import pluginJs from '@eslint/js';
import parser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    eslintPluginPrettierRecommended,
    {
        ignores: ['dist', 'node_modules', '.env'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                process: 'readonly',
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: parser,
        },
        rules: {
            'no-unused-vars': 'error',
            'prefer-const': 'error',
            'no-unused-expressions': 'error',
            'no-undef': 'error',
            'no-console': 'off',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            'prettier/prettier': ['off'],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
];
