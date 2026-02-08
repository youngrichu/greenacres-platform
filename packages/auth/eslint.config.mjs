import { config as baseConfig } from "@greenacres/config/eslint.config";

export default [
    ...baseConfig,
    {
        ignores: ["dist/**"]
    }
];
