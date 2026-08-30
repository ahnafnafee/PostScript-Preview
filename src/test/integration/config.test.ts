import * as assert from "assert";
import * as vscode from "vscode";
import { getConfig } from "../../config";

suite("Configuration integration", () => {
    test("reads the default executable paths", () => {
        const config = getConfig();

        assert.strictEqual(config.ps2pdf, "ps2pdf");
        assert.strictEqual(config.pdftocairo, "pdftocairo");
        assert.strictEqual(config.pdfinfo, "pdfinfo");
    });

    test("exposes every executable path through VS Code settings", () => {
        const config = vscode.workspace.getConfiguration("postscript-preview");

        assert.ok(config.has("path.ps2pdf"));
        assert.ok(config.has("path.pdftocairo"));
        assert.ok(config.has("path.pdfinfo"));
    });
});
