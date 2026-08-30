import * as path from "path";

export interface PostScriptConversionCommand {
    executable: string;
    args: string[];
}

function resolveWindowsGhostscriptExecutable(
    configuredExecutable: string
): string | undefined {
    const basename = path.win32.basename(configuredExecutable).toLowerCase();
    if (
        ["gswin64c", "gswin64c.exe", "gswin32c", "gswin32c.exe"].includes(
            basename
        )
    ) {
        return configuredExecutable;
    }

    if (!["ps2pdf", "ps2pdf.bat", "ps2pdf.cmd"].includes(basename)) {
        return undefined;
    }

    if (
        path.win32.isAbsolute(configuredExecutable) &&
        basename !== "ps2pdf"
    ) {
        return path.win32.resolve(
            path.win32.dirname(configuredExecutable),
            "..",
            "bin",
            "gswin64c.exe"
        );
    }

    return "gswin64c.exe";
}

export function createPostScriptConversionCommand(
    configuredExecutable: string,
    inputPath: string,
    outputPath: string,
    platform: NodeJS.Platform = process.platform
): PostScriptConversionCommand {
    const ghostscriptExecutable =
        platform === "win32"
            ? resolveWindowsGhostscriptExecutable(configuredExecutable)
            : undefined;

    if (ghostscriptExecutable) {
        return {
            executable: ghostscriptExecutable,
            args: [
                "-q",
                "-P-",
                "-dSAFER",
                "-dBATCH",
                "-dNOPAUSE",
                "-sDEVICE=pdfwrite",
                "-dCompatibilityLevel=1.4",
                "-dEPSCrop",
                `-sOutputFile=${outputPath}`,
                inputPath,
            ],
        };
    }

    return {
        executable: configuredExecutable,
        args: ["-dEPSCrop", inputPath, outputPath],
    };
}
