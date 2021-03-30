module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: 'tsconfig.json',
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'prettier',
    'jsx-a11y',
  ],
  rules: {
    'react/require-default-props': 'off',
    'unicorn/no-useless-undefined': 'off',
    'react/react-in-jsx-scope': 'off',

    '@typescript-eslint/await-thenable': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn'],
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'off',
  },
};
