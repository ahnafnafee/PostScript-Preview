import * as assert from "assert";
import { createPostScriptConversionCommand } from "../../postscript-command";

suite("PostScript conversion command", () => {
    test("uses the native Ghostscript executable on Windows", () => {
        const command = createPostScriptConversionCommand(
            "ps2pdf",
            "C:\\input files\\drawing & notes.ps",
            "C:\\output files\\preview.pdf",
            "win32"
        );

        assert.strictEqual(command.executable, "gswin64c.exe");
        assert.deepStrictEqual(command.args, [
            "-q",
            "-P-",
            "-dSAFER",
            "-dBATCH",
            "-dNOPAUSE",
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.4",
            "-dEPSCrop",
            "-sOutputFile=C:\\output files\\preview.pdf",
            "C:\\input files\\drawing & notes.ps",
        ]);
    });

    test("accepts an explicitly configured native Ghostscript executable", () => {
        const command = createPostScriptConversionCommand(
            "C:\\Tools\\Ghostscript\\gswin64c.exe",
            "C:\\input.ps",
            "C:\\output.pdf",
            "win32"
        );

        assert.strictEqual(
            command.executable,
            "C:\\Tools\\Ghostscript\\gswin64c.exe"
        );
        assert.ok(command.args.includes("-sDEVICE=pdfwrite"));
    });

    test("preserves ps2pdf semantics on non-Windows platforms", () => {
        const command = createPostScriptConversionCommand(
            "/usr/local/bin/ps2pdf",
            "/tmp/input.ps",
            "/tmp/output.pdf",
            "linux"
        );

        assert.deepStrictEqual(command, {
            executable: "/usr/local/bin/ps2pdf",
            args: ["-dEPSCrop", "/tmp/input.ps", "/tmp/output.pdf"],
        });
    });

    test("resolves an absolute Windows ps2pdf batch path without a shell", () => {
        const command = createPostScriptConversionCommand(
            "C:\\Program Files\\gs\\gs10.07.1\\lib\\ps2pdf.bat",
            "C:\\input.ps",
            "C:\\output.pdf",
            "win32"
        );

        assert.strictEqual(
            command.executable,
            "C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe"
        );
    });
});
