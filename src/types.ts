/**
 * Type definitions for PostScript Preview extension
 */

/**
 * State for multi-page document preview
 */
export interface PreviewState {
    currentPage: number;
    totalPages: number;
    pdfPath: string;
    filepath: string;
}

/**
 * Configuration for executable paths
 */
export interface ExtensionConfig {
    ps2pdf: string;
    pdftocairo: string;
    pdfinfo: string;
}
