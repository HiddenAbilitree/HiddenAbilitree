import {
  oxlintConfig,
  oxlintConfigBase,
  oxlintIgnorePatterns,
  oxlintOverride,
  oxlintConfigReact,
  oxlintConfigNext,
} from '@hiddenability/opinionated-defaults/oxlint';

export default oxlintConfig([oxlintConfigBase], {
  ignorePatterns: oxlintIgnorePatterns([oxlintConfigNext]),
  overrides: [
    oxlintOverride(['apps/nexus/**/*'], [oxlintConfigReact, oxlintConfigNext]),
    {
      files: ['apps/nexus/styles/fonts/index.ts'],
      rules: {
        'eslint/no-underscore-dangle': ['error', { allow: ['_0xProto'] }],
      },
    },
    {
      files: ['apps/nexus/components/code-block.tsx'],
      rules: {
        'import/no-unassigned-import': 'off',
      },
    },
  ],
  rules: {
    'import/no-unassigned-import': ['error', { allow: ['server-only'] }],
  },
  settings: {
    next: {
      rootDir: ['apps/nexus/'],
    },
  },
});
