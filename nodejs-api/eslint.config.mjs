import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
      "no-unused-vars": "off",
      "no-else-return": "off",
      "no-var": "off", 
      "no-console": "error",
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];