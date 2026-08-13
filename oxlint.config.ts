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
    oxlintOverride(
      ['apps/nexus/**/*'],
      [
        oxlintConfigReact,
        oxlintConfigNext,
        {
          rules: {
            'eslint/no-underscore-dangle': ['error', { allow: ['_0xProto'] }],
            'import/no-unassigned-import': ['error', { allow: ['server-only', '*/css'] }],
          },
        },
      ],
    ),
  ],
  settings: {
    next: {
      rootDir: ['apps/nexus/'],
    },
  },
});
