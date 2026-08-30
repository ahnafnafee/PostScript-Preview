import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
    files: "out/test/suite/**/*.test.js",
    workspaceFolder: ".",
    mocha: {
        ui: "tdd",
        color: true,
        timeout: 10_000,
    },
});
