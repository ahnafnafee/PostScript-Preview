/**
 * Preview generation for PostScript files
 */
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { spawnSync } from "child_process";
import * as vscode from "vscode";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs = require("fs");
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import os = require("os");
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path = require("path");
import { getConfig } from "./config";
import { parsePdfPageCount } from "./pdf-info";
import { createPostScriptConversionCommand } from "./postscript-command";
import { PreviewState } from "./types";
import { getWebviewContent } from "./webview";

const temporaryDirectories = new Set<string>();

function removeDirectoryRecursively(directory: string): void {
    for (const entry of fs.readdirSync(directory)) {
        const entryPath = path.join(directory, entry);
        if (fs.lstatSync(entryPath).isDirectory()) {
            removeDirectoryRecursively(entryPath);
        } else {
            fs.unlinkSync(entryPath);
        }
    }
    fs.rmdirSync(directory);
}

function tryCreateTemporaryFilePath(extension: string): string | undefined {
    try {
        const directory = fs.mkdtempSync(
            path.join(os.tmpdir(), "postscript-preview-")
        );
        temporaryDirectories.add(directory);
        return path.join(directory, `preview${extension}`);
    } catch (err) {
        console.log("Creating a temporary preview file failed.");
        console.log(err);
        return undefined;
    }
}

function cleanupTemporaryDirectory(directory: string): void {
    if (!temporaryDirectories.has(directory)) {
        return;
    }

    try {
        if (fs.existsSync(directory)) {
            removeDirectoryRecursively(directory);
        }
        temporaryDirectories.delete(directory);
    } catch (err) {
        console.log(`Failed to clean up temporary preview file: ${err}`);
    }
}

export function cleanupPreviewFile(filePath: string): void {
    cleanupTemporaryDirectory(path.dirname(filePath));
}

export function cleanupAllPreviewFiles(): void {
    for (const directory of [...temporaryDirectories]) {
        cleanupTemporaryDirectory(directory);
    }
}

/**
 * Get page count from PDF using pdfinfo
 */
export function getPageCount(
    pdfPath: string,
    channel: vscode.OutputChannel
): number {
    const config = getConfig();
    try {
        const result = spawnSync(config.pdfinfo, [pdfPath], {
            encoding: "utf-8",
            shell: false,
        });
        if (result.status !== 0) {
            throw new Error(
                `pdfinfo exited with code ${result.status}: ${result.stderr}`
            );
        }
        const pageCount = parsePdfPageCount(result.stdout);
        if (pageCount !== undefined) {
            return pageCount;
        }
    } catch (err) {
        channel.appendLine(
            `Warning: Could not get page count using pdfinfo: ${err}`
        );
    }
    return 1; // Default to 1 page
}

/**
 * Generate preview for a PostScript file
 */
export function generatePreview(
    filepath: string,
    panel: vscode.WebviewPanel,
    channel: vscode.OutputChannel,
    pageNumber: number = 1,
    existingPdfPath?: string
): string | undefined {
    const config = getConfig();

    // Helper function to generate SVG from existing PDF
    const generateSvgFromPdf = (
        pdfPath: string,
        totalPages: number
    ): boolean => {
        const svgPath = tryCreateTemporaryFilePath(".svg");
        if (!svgPath) {
            vscode.window.showInformationMessage(
                "Failed to create a temporary SVG preview file."
            );
            return false;
        }

        try {
            const result = spawnSync(
                config.pdftocairo,
                [
                    "-svg",
                    "-f",
                    String(pageNumber),
                    "-l",
                    String(pageNumber),
                    pdfPath,
                    svgPath,
                ],
                { encoding: "utf-8", shell: false }
            );
            if (result.status !== 0) {
                throw new Error(
                    `pdftocairo exited with code ${result.status}: ${result.stderr}`
                );
            }

            const svgContent = fs.readFileSync(svgPath);
            panel.webview.html = getWebviewContent(
                path.basename(filepath),
                svgContent,
                pageNumber,
                totalPages
            );
            return true;
        } catch (err) {
            vscode.window.showInformationMessage(
                "Failed to execute pdftocairo. Report bug with postscript file to dev."
            );
            console.log("Error generating the SVG preview.");
            console.log(err);
            return false;
        } finally {
            cleanupPreviewFile(svgPath);
        }
    };

    // If we have an existing PDF (page navigation), use it directly
    if (existingPdfPath) {
        const totalPages = getPageCount(existingPdfPath, channel);
        return generateSvgFromPdf(existingPdfPath, totalPages)
            ? existingPdfPath
            : undefined;
    }

    // Otherwise, generate new PDF from PS/EPS file
    const previousState = (panel as any).__previewState as
        | PreviewState
        | undefined;
    if (previousState) {
        cleanupPreviewFile(previousState.pdfPath);
        delete (panel as any).__previewState;
    }

    const pdfPath = tryCreateTemporaryFilePath(".pdf");
    if (!pdfPath) {
        vscode.window.showInformationMessage(
            "Failed to create a temporary PDF preview file."
        );
        return undefined;
    }

    try {
        const conversionCommand = createPostScriptConversionCommand(
            config.ps2pdf,
            filepath,
            pdfPath
        );
        const ps2pdfResult = spawnSync(
            conversionCommand.executable,
            conversionCommand.args,
            { encoding: "utf-8", shell: false }
        );

        if (ps2pdfResult.stdout && ps2pdfResult.stdout.trim()) {
            channel.appendLine("--- GhostScript Output ---");
            channel.appendLine(ps2pdfResult.stdout);
            channel.show(true);
        }
        if (ps2pdfResult.stderr && ps2pdfResult.stderr.trim()) {
            channel.appendLine("--- GhostScript Errors/Warnings ---");
            channel.appendLine(ps2pdfResult.stderr);
            channel.show(true);
        }

        if (ps2pdfResult.status !== 0) {
            throw new Error(`ps2pdf exited with code ${ps2pdfResult.status}`);
        }
    } catch (err) {
        vscode.window.showInformationMessage(
            "Failed to execute ps2pdf. Report bug with postscript file to dev."
        );
        console.log("Error executing ps2pdf.");
        console.log(err);
        cleanupPreviewFile(pdfPath);
        return undefined;
    }

    const totalPages = getPageCount(pdfPath, channel);
    (panel as any).__previewState = {
        currentPage: pageNumber,
        totalPages,
        pdfPath,
        filepath,
    } as PreviewState;

    if (!generateSvgFromPdf(pdfPath, totalPages)) {
        cleanupPreviewFile(pdfPath);
        delete (panel as any).__previewState;
        return undefined;
    }

    return pdfPath;
}
