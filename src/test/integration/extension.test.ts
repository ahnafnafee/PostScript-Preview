import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension integration", () => {
    test("is installed in the extension host", () => {
        assert.ok(
            vscode.extensions.getExtension("ahnafnafee.postscript-preview")
        );
    });

    test("activates successfully", async () => {
        const extension = vscode.extensions.getExtension(
            "ahnafnafee.postscript-preview"
        );
        assert.ok(extension, "Extension not found");

        if (!extension.isActive) {
            await extension.activate();
        }

        assert.strictEqual(extension.isActive, true);
    });

    test("registers the preview command", async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(commands.includes("postscript-preview.sidePreview"));
    });

    test("previews a PostScript document", async () => {
        await executePreviewForExample("basic_shapes.ps");
    });

    test("previews a filename containing special characters", async () => {
        await executePreviewForExample("test (example).ps");
    });
});

async function executePreviewForExample(filename: string): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
    assert.ok(workspaceRoot, "No workspace is open");

    const fileUri = vscode.Uri.joinPath(workspaceRoot, "examples", filename);
    const document = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(document);

    const previewCreated = await vscode.commands.executeCommand<boolean>(
        "postscript-preview.sidePreview"
    );

    assert.strictEqual(
        previewCreated,
        true,
        `Preview generation failed for ${filename}`
    );
}
