import * as assert from "assert";
import * as vscode from "vscode";
import { getConfig } from "../../config";

suite("Configuration Test Suite", () => {
    vscode.window.showInformationMessage("Start config tests.");

    test("Default configuration values", () => {
        const config = getConfig();
        assert.strictEqual(config.ps2pdf, "ps2pdf");
        assert.strictEqual(config.pdftocairo, "pdftocairo");
        assert.strictEqual(config.pdfinfo, "pdfinfo");
    });
    test("Configuration should be readable", () => {
        const config = vscode.workspace.getConfiguration("postscript-preview");
        assert.ok(config.has("path.ps2pdf"));
        assert.ok(config.has("path.pdftocairo"));
    });
});
