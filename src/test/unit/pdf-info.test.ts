import * as assert from "assert";
import { parsePdfPageCount } from "../../pdf-info";

suite("PDF metadata", () => {
    test("returns no page count when pdfinfo omits the Pages field", () => {
        const output = [
            "Title:          Example",
            "Page size:      612 x 792 pts",
            "PDF version:    1.7",
        ].join("\n");

        assert.strictEqual(parsePdfPageCount(output), undefined);
    });

    test("returns the declared page count from pdfinfo output", () => {
        const output = [
            "Title:          Example",
            "Pages:          12",
            "Page size:      612 x 792 pts",
        ].join("\n");

        assert.strictEqual(parsePdfPageCount(output), 12);
    });
});
