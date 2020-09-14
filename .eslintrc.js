module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'airbnb-base', 'airbnb-typescript/base'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'no-ex-assign': 'off',
  },
};
