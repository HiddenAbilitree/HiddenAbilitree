import {
  eslintConfigBase,
  eslintConfigPrettier,
  eslintConfigRelative,
  eslintConfigTypescript,
} from '@hiddenability/opinionated-defaults/eslint';

const eslintConfig = [
  ...eslintConfigBase,
  ...eslintConfigTypescript,
  ...eslintConfigRelative,
  ...eslintConfigPrettier,
];

export default eslintConfig;
