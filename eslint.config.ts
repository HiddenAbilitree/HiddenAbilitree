import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
export default [...eslintPluginAstro.configs.recommended, eslintPluginPrettier];
