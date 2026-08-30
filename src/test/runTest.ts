import * as cp from "child_process";
import * as fs from "fs";
import * as path from "path";
import {
    downloadAndUnzipVSCode,
    resolveCliArgsFromVSCodeExecutablePath,
    runTests,
} from "@vscode/test-electron";

const POSTSCRIPT_LANGUAGE_VSIX_URL =
    "https://marketplace.visualstudio.com/_apis/public/gallery/publishers/mxschmitt/vsextensions/postscript/latest/vspackage";

/**
 * This extension declares an extension dependency on mxschmitt.postscript
 * (it registers the `postscript` language for .ps/.eps files), so the
 * extension under test cannot activate unless that dependency is present in
 * the test instance. Install it from a downloaded VSIX file: installing by id
 * can fail in the test CLI when the marketplace signature verification
 * tooling is unavailable ("Signature verification failed with 'ENOENT'").
 */
async function installPostscriptLanguageExtension(
    vscodeExecutablePath: string
) {
    const vsixPath = path.resolve(
        __dirname,
        "../../.vscode-test/mxschmitt.postscript.vsix"
    );
    const response = await fetch(POSTSCRIPT_LANGUAGE_VSIX_URL);
    if (!response.ok) {
        throw new Error(
            `Failed to download PostScript Language extension: HTTP ${response.status}`
        );
    }
    fs.mkdirSync(path.dirname(vsixPath), { recursive: true });
    fs.writeFileSync(vsixPath, Buffer.from(await response.arrayBuffer()));

    const [cliPath, ...cliArgs] =
        resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);
    const result = cp.spawnSync(
        cliPath,
        [...cliArgs, "--install-extension", vsixPath],
        {
            encoding: "utf-8",
            stdio: "inherit",
            shell: process.platform === "win32",
        }
    );
    if (result.status !== 0) {
        throw new Error(
            `Failed to install PostScript Language extension (exit code ${result.status})`
        );
    }
}

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, "../../");

        // The path to test runner
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, "./suite/index");

        // Download VS Code and install the PostScript Language dependency
        // into the test instance before running the tests.
        const vscodeExecutablePath = await downloadAndUnzipVSCode();
        await installPostscriptLanguageExtension(vscodeExecutablePath);

        // Run the integration test
        await runTests({
            vscodeExecutablePath,
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [extensionDevelopmentPath],
        });
    } catch (err) {
        console.error("Failed to run tests", err);
        process.exit(1);
    }
}

main();
