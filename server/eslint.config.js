import prettier from 'eslint-plugin-prettier';

export default [
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'prettier/prettier': 'error',
    },
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
];
