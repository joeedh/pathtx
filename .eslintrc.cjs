module.exports = {
  'root': true,
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {'project': ['./tsconfig.json']},
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    '@typescript-eslint/no-unused-vars': ['warn'],
    'prefer-const': ['warn'],
    'no-constant-condition': ['warn'],
    'no-empty': ['warn'],
    '@typescript-eslint/strict-boolean-expressions': [
      2,
      {
        'allowString': false,
        'allowNumber': true,
      },
    ],
  },
  'ignorePatterns': [],
};
