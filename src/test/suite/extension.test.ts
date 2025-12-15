import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
    vscode.window.showInformationMessage("Start extension tests.");

    test("Extension should be present", () => {
        assert.ok(
            vscode.extensions.getExtension("ahnafnafee.postscript-preview")
        );
    });

    test("Extension should activate", async () => {
        const ext = vscode.extensions.getExtension(
            "ahnafnafee.postscript-preview"
        );
        assert.ok(ext, "Extension not found");

        // Activate if not active
        if (!ext.isActive) {
            await ext.activate();
        }

        assert.strictEqual(ext.isActive, true);
    });

    test("Command should be registered", async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes("postscript-preview.sidePreview"));
    });
});
