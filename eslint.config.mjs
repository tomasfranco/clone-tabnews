import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,

  // Converte configs "antigos" (eslintrc-style) para Flat Config
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:jest/recommended",
    "prettier",
  ),
];
