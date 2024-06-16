module.exports = {
  root: true,
  extends: [
    //
    'plugin:@typescript-eslint/recommended',
    '@react-native',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    //
    '@typescript-eslint',
  ],
  rules: {
    radix: 'off',
  },
};
