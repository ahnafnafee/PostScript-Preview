import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const unavailableOpenVsxDependencies = new Set(["mxschmitt.postscript"]);

export function createOpenVsxManifest(manifest) {
    const openVsxManifest = { ...manifest };
    const availableDependencies = manifest.extensionDependencies?.filter(
        (dependency) => !unavailableOpenVsxDependencies.has(dependency)
    );

    if (availableDependencies?.length) {
        openVsxManifest.extensionDependencies = availableDependencies;
    } else {
        delete openVsxManifest.extensionDependencies;
    }

    return openVsxManifest;
}

async function prepareOpenVsxManifest(manifestPath) {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    const openVsxManifest = createOpenVsxManifest(manifest);
    await writeFile(
        manifestPath,
        `${JSON.stringify(openVsxManifest, null, "\t")}\n`,
        "utf8"
    );
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    const manifestPath = process.argv[2];
    if (!manifestPath) {
        throw new Error("Usage: prepare-open-vsx-manifest.mjs <package.json>");
    }
    await prepareOpenVsxManifest(manifestPath);
}
