/**
 * Configuration management for PostScript Preview extension
 */
import * as vscode from "vscode";
import { ExtensionConfig } from "./types";

/**
 * Get configuration values for executable paths
 */
export function getConfig(): ExtensionConfig {
    const config = vscode.workspace.getConfiguration("postscript-preview");
    return {
        ps2pdf: config.get<string>("path.ps2pdf", "ps2pdf"),
        pdftocairo: config.get<string>("path.pdftocairo", "pdftocairo"),
        pdfinfo: config.get<string>("path.pdfinfo", "pdfinfo"),
    };
}
