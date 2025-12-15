/**
 * PostScript Preview Extension
 * Main entry point
 */
import * as vscode from "vscode";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path = require("path");
import { PreviewState } from "./types";
import { generatePreview } from "./preview";
import { showWhatsNew } from "./whats-new";

/**
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext): void {
    const isWindows = process.platform === "win32";

    if (isWindows) {
        showWhatsNew(context); // show notification in case of a minor release
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

            generatePreview(mainFilePath, panel, channel);
            channel.appendLine(`Watching ${filePath}`);

            // Handle messages from webview for page navigation
            panel.webview.onDidReceiveMessage(
                (message) => {
                    const state = (panel as any).__previewState as
                        | PreviewState
                        | undefined;
                    if (!state) {
                        return;
                    }

                    switch (message.command) {
                        case "prevPage":
                            if (state.currentPage > 1) {
                                state.currentPage--;
                                generatePreview(
                                    state.filepath,
                                    panel,
                                    channel,
                                    state.currentPage,
                                    state.pdfPath
                                );
                            }
                            break;
                        case "nextPage":
                            if (state.currentPage < state.totalPages) {
                                state.currentPage++;
                                generatePreview(
                                    state.filepath,
                                    panel,
                                    channel,
                                    state.currentPage,
                                    state.pdfPath
                                );
                            }
                            break;
                        case "goToPage": {
                            const page = parseInt(message.page, 10);
                            if (page >= 1 && page <= state.totalPages) {
                                state.currentPage = page;
                                generatePreview(
                                    state.filepath,
                                    panel,
                                    channel,
                                    state.currentPage,
                                    state.pdfPath
                                );
                            }
                            break;
                        }
                    }
                },
                undefined,
                context.subscriptions
            );

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
}

/**
 * Called when the extension is deactivated
 */
export function deactivate(): void {}
