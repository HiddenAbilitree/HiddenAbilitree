import {
  eslintConfigNext,
  eslintConfigPrettier,
} from '@hiddenability/opinionated-defaults/eslint';

const eslintConfig = [...eslintConfigNext, ...eslintConfigPrettier];

export default eslintConfig;
