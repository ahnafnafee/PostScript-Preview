/**
 * Parse the page count reported by the `pdfinfo` command.
 */
export function parsePdfPageCount(output: string): number | undefined {
    const pages = /^Pages:\s+(\d+)\s*$/m.exec(output);
    return pages ? Number.parseInt(pages[1], 10) : undefined;
}
