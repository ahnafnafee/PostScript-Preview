/**
 * Preview generation for PostScript files
 */
import * as vscode from "vscode";
import * as path from "path";
// @ts-ignore
import ghostscript = require("@jspawn/ghostscript-wasm");
import { getWebviewContent } from "./webview";

export interface PreviewResult {
    data: Uint8Array;
    mimeType: string;
}

/**
 * Generate PDF buffer from PostScript file using Ghostscript WASM
 */
export async function generatePdfFromPs(
    filepath: string,
    channel: vscode.OutputChannel
): Promise<Uint8Array> {
    try {
        const fs = require("fs");
        const psContent = fs.readFileSync(filepath);

        // Initialize Ghostscript WASM
        const gs = await ghostscript();

        // Write PS file to virtual filesystem
        gs.FS.writeFile("/input.ps", psContent);

        // Execute gs command to convert to PDF
        // eq to: gs -sDEVICE=pdfwrite -o output.pdf input.ps
        const exitCode = gs.callMain([
            "-sDEVICE=pdfwrite",
            "-o",
            "/output.pdf",
            "/input.ps",
        ]);

        if (exitCode !== 0) {
            throw new Error(`Ghostscript exited with code ${exitCode}`);
        }

        // Read the result PDF
        const pdfData = gs.FS.readFile("/output.pdf");

        // Cleanup virtual file system if needed (optional for short lived instances)
        // gs.FS.unlink("/input.ps");
        // gs.FS.unlink("/output.pdf");

        return pdfData;
    } catch (err: any) {
        channel.appendLine(`Error generating PDF: ${err.message}`);
        channel.show(true);
        throw err;
    }
}

/**
 * Generate preview for a PostScript file
 */
export async function generatePreview(
    filepath: string,
    panel: vscode.WebviewPanel,
    channel: vscode.OutputChannel,
    pageNumber: number = 1
): Promise<void> {
    try {
        const pdfData = await generatePdfFromPs(filepath, channel);

        // Convert to base64 to pass to webview
        const base64Pdf = Buffer.from(pdfData).toString("base64");

        // Update webview
        panel.webview.html = getWebviewContent(
            path.basename(filepath),
            base64Pdf,
            pageNumber
        );
    } catch (err) {
        vscode.window.showErrorMessage("Failed to generate preview.");
    }
}
