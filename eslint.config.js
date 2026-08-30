const eslint = require("@eslint/js");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");

module.exports = [
    {
        ignores: ["out/**", "dist/**", "**/*.d.ts"],
    },
    eslint.configs.recommended,
    ...typescriptEslint.configs["flat/recommended"],
    {
        files: ["src/**/*.ts"],
        rules: {
            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: "class",
                    format: ["PascalCase"],
                },
            ],
            curly: "warn",
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { caughtErrors: "none" },
            ],
        },
    },
];
