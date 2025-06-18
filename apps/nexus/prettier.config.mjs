import {
  merge,
  prettierConfigBase,
  prettierConfigTailwind,
} from '@hiddenability/opinionated-defaults/prettier';

const config = merge(prettierConfigBase, prettierConfigTailwind, {
  tailwindStylesheet: './src/globals.css',
});

export default config;
