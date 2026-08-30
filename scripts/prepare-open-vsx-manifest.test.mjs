import assert from "node:assert/strict";
import test from "node:test";
import { createOpenVsxManifest } from "./prepare-open-vsx-manifest.mjs";

test("removes unavailable extension dependencies from the Open VSX manifest", () => {
    const marketplaceManifest = {
        name: "postscript-preview",
        version: "0.6.1",
        extensionDependencies: ["mxschmitt.postscript"],
    };

    const openVsxManifest = createOpenVsxManifest(marketplaceManifest);

    assert.deepEqual(openVsxManifest, {
        name: "postscript-preview",
        version: "0.6.1",
    });
    assert.deepEqual(marketplaceManifest.extensionDependencies, [
        "mxschmitt.postscript",
    ]);
});

test("preserves dependencies that can be resolved by Open VSX", () => {
    const marketplaceManifest = {
        name: "postscript-preview",
        extensionDependencies: [
            "mxschmitt.postscript",
            "example.available-extension",
        ],
    };

    const openVsxManifest = createOpenVsxManifest(marketplaceManifest);

    assert.deepEqual(openVsxManifest.extensionDependencies, [
        "example.available-extension",
    ]);
});
