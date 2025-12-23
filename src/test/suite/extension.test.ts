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

    test("Preview command should execute without error", async () => {
        // Ensure workspace is open
        assert.ok(vscode.workspace.workspaceFolders, "No workspace is open");

        const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const filePath = vscode.Uri.file(
            workspaceRoot + "/examples/basic_shapes.ps"
        );

        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);

        // Execute the command - validation fails if this throws
        await vscode.commands.executeCommand("postscript-preview.sidePreview");
    });

    test("Preview command should execute with special characters in filename", async () => {
        // Ensure workspace is open
        assert.ok(vscode.workspace.workspaceFolders, "No workspace is open");

        const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const filePath = vscode.Uri.file(
            workspaceRoot + "/examples/test (example).ps"
        );

        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);

        // Execute the command - validation fails if this throws
        await vscode.commands.executeCommand("postscript-preview.sidePreview");
    });
});
