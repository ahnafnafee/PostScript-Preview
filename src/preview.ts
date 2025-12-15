/**
 * Preview generation for PostScript files
 */
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { execSync, spawnSync } from "child_process";
import * as vscode from "vscode";
import temp = require("temp");
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs = require("fs");
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path = require("path");
import { getConfig } from "./config";
import { PreviewState } from "./types";
import { getWebviewContent } from "./webview";

/**
 * Get page count from PDF using pdfinfo
 */
export function getPageCount(
    pdfPath: string,
    channel: vscode.OutputChannel
): number {
    const config = getConfig();
    try {
        const result = execSync(`"${config.pdfinfo}" "${pdfPath}"`, {
            encoding: "utf-8",
        });
        const match = result.match(/Pages:\s+(\d+)/);
        if (match) {
            return parseInt(match[1], 10);
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
    temp.track();

    // Helper function to generate SVG from existing PDF
    const generateSvgFromPdf = (pdfPath: string, totalPages: number) => {
        temp.open(
            { prefix: "postscript-preview-svg_", suffix: ".svg" },
            (svgErr, svgInfo) => {
                if (svgErr) {
                    console.log(
                        "Creating temporary file eps-preview-svg failed."
                    );
                    return;
                }
                try {
                    execSync(
                        `"${config.pdftocairo}" -svg -f ${pageNumber} -l ${pageNumber} "${pdfPath}" "${svgInfo.path}"`
                    );
                } catch (err) {
                    vscode.window.showInformationMessage(
                        "Failed to execute pdftocairo. Report bug with postscript file to dev."
                    );
                    console.log("Error executing pdftocairo.");
                    console.log(err);
                    temp.cleanupSync();
                    return;
                }
                try {
                    const stat = fs.fstatSync(svgInfo.fd);
                    const svgContent = Buffer.alloc(stat.size);
                    fs.readSync(svgInfo.fd, svgContent, 0, stat.size, null);
                    // Show SVG in the webview panel
                    panel.webview.html = getWebviewContent(
                        path.basename(filepath),
                        svgContent,
                        pageNumber,
                        totalPages
                    );
                } catch (err) {
                    console.log("Error reading the final file.");
                    console.log(err);
                }
            }
        );
    };

    // If we have an existing PDF (page navigation), use it directly
    if (existingPdfPath) {
        const totalPages = getPageCount(existingPdfPath, channel);
        generateSvgFromPdf(existingPdfPath, totalPages);
        return existingPdfPath;
    }

    // Otherwise, generate new PDF from PS/EPS file
    let pdfPathResult: string | undefined;
    temp.open(
        { prefix: "postscript-preview-svg_", suffix: ".pdf" },
        (pdfErr, pdfInfo) => {
            if (pdfErr) {
                console.log("Creating temporary file eps-preview-pdf failed.");
                return;
            }
            // Transform EPS to PDF using ps2pdf
            // Capture stdout/stderr for console output display (Issue #7)
            try {
                const ps2pdfResult = spawnSync(
                    config.ps2pdf,
                    ["-dEPSCrop", filepath, pdfInfo.path],
                    { encoding: "utf-8", shell: true }
                );

                // Display any console output from GhostScript
                if (ps2pdfResult.stdout && ps2pdfResult.stdout.trim()) {
                    channel.appendLine("--- GhostScript Output ---");
                    channel.appendLine(ps2pdfResult.stdout);
                    channel.show(true); // Show output channel without taking focus
                }
                if (ps2pdfResult.stderr && ps2pdfResult.stderr.trim()) {
                    channel.appendLine("--- GhostScript Errors/Warnings ---");
                    channel.appendLine(ps2pdfResult.stderr);
                    channel.show(true);
                }

                if (ps2pdfResult.status !== 0) {
                    throw new Error(
                        `ps2pdf exited with code ${ps2pdfResult.status}`
                    );
                }
            } catch (err) {
                vscode.window.showInformationMessage(
                    "Failed to execute ps2pdf. Report bug with postscript file to dev."
                );
                console.log("Error executing ps2pdf.");
                console.log(err);
                temp.cleanupSync();
                return;
            }

            // Get page count for multi-page navigation
            const totalPages = getPageCount(pdfInfo.path, channel);
            pdfPathResult = pdfInfo.path;

            // Store state in webview for page navigation
            (panel as any).__previewState = {
                currentPage: pageNumber,
                totalPages: totalPages,
                pdfPath: pdfInfo.path,
                filepath: filepath,
            } as PreviewState;

            generateSvgFromPdf(pdfInfo.path, totalPages);
        }
    );

    return pdfPathResult;
}
