module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { sourceType: 'module', ecmaVersion: 2022, ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
  ],
  env: { browser: true, es2022: true },
  ignorePatterns: ['dist', 'node_modules', '*.config.ts', '*.config.js'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
  },
};
