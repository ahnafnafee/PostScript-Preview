# Antigravity Guide

## Project Overview

**PostScript Preview** is a VS Code extension that renders previews for `.ps` and `.eps` files.

-   **Core Logic**: Uses `Ghostscript` (`ps2pdf`) to convert PS -> PDF, then `Poppler` (`pdftocairo`) to convert PDF -> SVG for display in a webview.
-   **Languages**: TypeScript.

## Build & Test

-   **Build**: `yarn compile` (runs `tsc`).
-   **Test**: `yarn test` (runs VS Code extension tests via `mocha`).
-   **Lint**: `yarn lint` (`eslint`).

## Key Files

-   **`src/extension.ts`**: Entry point. Registers commands (`postscript-preview.sidePreview`).
-   **`src/preview.ts`**: Core logic.
    -   `generatePreview()`: Handles the `ps2pdf` and `pdftocairo` pipeline.
    -   **CRITICAL**: usage of `spawnSync` for `ps2pdf` must use `{ shell: false }` to support special characters in filenames.
-   **`src/webview.ts`**: Generates HTML content for the webview.
-   **`src/config.ts`**: Manages configuration settings (paths to executables).
-   **`src/test/suite/extension.test.ts`**: Integration tests. Includes cases for special character filenames.
-   **`.github/workflows/release.yml`**: CI/CD for publishing. Automatically extracts changelog entries for release descriptions.

## Workflows

-   **Release**:
    1. Bump version in `package.json`.
    2. Add entry to `CHANGELOG.md`.
    3. Push to `main`. The GitHub Action will build, test, package (`vsce`), and publish to Marketplace/OpenVSX.

## Common Issues

-   **Ghostscript Warnings**: "no display font for 'ArialUnicode'" is a common benign warning from Ghostscript.
-   **Filenames**: Always ensure command execution avoids shell injection (use `shell: false`).
