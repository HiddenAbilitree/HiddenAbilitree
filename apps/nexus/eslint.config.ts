import { includeIgnoreFile } from '@eslint/compat';
import {
  eslintConfig,
  eslintConfigBase,
  eslintConfigNext,
  eslintConfigPerfectionist,
  eslintConfigPrettier,
  eslintConfigReact,
  eslintConfigRelative,
} from '@hiddenability/opinionated-defaults/eslint';
import tailwindPlugin from 'eslint-plugin-better-tailwindcss';
import { fileURLToPath } from 'node:url';

export default eslintConfig([
  includeIgnoreFile(fileURLToPath(new URL(`.gitignore`, import.meta.url)), ``),
  includeIgnoreFile(
    fileURLToPath(new URL(`../../.gitignore`, import.meta.url)),
    ``,
  ),
  ...eslintConfigBase,
  ...eslintConfigNext,
  ...eslintConfigPerfectionist,
  ...eslintConfigReact,
  ...eslintConfigRelative,
  ...eslintConfigPrettier,
  {
    plugins: { 'better-tailwindcss': tailwindPlugin },
    rules: {
      ...tailwindPlugin.configs.recommended.rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': `off`,
      'better-tailwindcss/no-unknown-classes': [
        `error`,
        { ignore: [`^not-prose$`, `^chatbot-code$`] },
      ],
    },

    settings: {
      'better-tailwindcss': {
        entryPoint: `./styles/globals.css`,
      },
    },
  },
]);
