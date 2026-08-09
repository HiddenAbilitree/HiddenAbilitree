import { defineConfig } from 'oxlint';

export default defineConfig({
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_0xProto'] }],
    'no-unassigned-import': [
      'warn',
      {
        allow: ['**/*.css', '**/*.scss', '**/*.less', 'react-shiki/css'],
      },
    ],
    'typescript/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'typescript/prefer-nullish-coalescing': 'error',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
        },
      },
    ],
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
  },
  categories: {
    correctness: 'error',
    suspicious: 'warn',
  },
  plugins: [
    'typescript',
    'unicorn',
    'oxc',
    'import',
    'promise',
    'node',
    'jsx-a11y',
    'react',
    'react-perf',
    'nextjs',
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  ignorePatterns: ['**/dist/', '**/node_modules/', '**/.git/', '**/*.gen.ts', 'next-env.d.ts'],
  options: {
    typeAware: true,
    typeCheck: true,
  },
});
