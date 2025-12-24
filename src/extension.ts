/**
 * PostScript Preview Extension
 * Main entry point
 */
import * as vscode from "vscode";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path = require("path");
import { PreviewState } from "./types";
import { generatePreview } from "./preview";

/**
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log("PostScript Preview: Activating extension...");
    const isWindows = process.platform === "win32";

    if (isWindows) {
        console.log("PostScript Preview: Checking for updates (Windows)...");
    }

    const channel = vscode.window.createOutputChannel("PostScript-Preview");

    // Register the preview command
    const disposable = vscode.commands.registerCommand(
        "postscript-preview.sidePreview",
        () => {
            const document = vscode.window.activeTextEditor?.document;

            if (!document) {
                console.log("No active document. Do nothing.");
                return;
            }

            const filename = path.basename(document.fileName);
            const filePath = document.uri.fsPath;

            // Create new panel
            const panel = vscode.window.createWebviewPanel(
                "",
                `PostScript Preview - ${filename}`,
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true,
                }
            );

            const mainFilePath = document.fileName;

            // Generate preview without awaiting (fire and forget)
            generatePreview(mainFilePath, panel, channel);
            channel.appendLine(`Watching ${filePath}`);

            // Watch for file changes
            const watcher = vscode.workspace.createFileSystemWatcher(filePath);
            watcher.onDidChange((_: vscode.Uri) => {
                channel.appendLine(`File changed, regenerating : ${filePath}`);
                // Reset to page 1 on file change and regenerate PDF
                generatePreview(mainFilePath, panel, channel);
            });
            panel.onDidDispose(() => {
                watcher.dispose();
                channel.appendLine(`Stop watching ${filePath}`);
            });
        }
    );

    context.subscriptions.push(disposable);
    console.log("PostScript Preview: Activation complete. Command registered.");
}

/**
 * Called when the extension is deactivated
 */
export function deactivate(): void {}
