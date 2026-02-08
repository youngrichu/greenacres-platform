import { config as baseConfig } from "@greenacres/config/eslint.config";
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...baseConfig,
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "dist/**"]
  }
]);

export default eslintConfig;
