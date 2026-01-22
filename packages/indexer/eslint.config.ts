import { includeIgnoreFile } from '@eslint/compat';
import {
  eslintConfig,
  eslintConfigBase,
  eslintConfigDefaultProject,
  eslintConfigNext,
  eslintConfigPerfectionist,
  eslintConfigPrettier,
  eslintConfigReact,
  eslintConfigRelative,
} from '@hiddenability/opinionated-defaults/eslint';
import { fileURLToPath } from 'node:url';

export default eslintConfig([
  includeIgnoreFile(
    fileURLToPath(new URL(`../../.gitignore`, import.meta.url)),
    ``,
  ),
  ...eslintConfigBase,
  ...eslintConfigDefaultProject([`eslint.config.ts`, `prettier.config.mjs`]),
  ...eslintConfigNext,
  ...eslintConfigPerfectionist,
  ...eslintConfigPrettier,
  ...eslintConfigReact,
  ...eslintConfigRelative,
]);
