# Change Log

## [0.6.0] - 2026-08-29

### Security

-   Removed the abandoned `temp` runtime dependency and replaced it with Node.js built-in temporary-directory handling.
-   Stopped constructing shell command strings for GhostScript and Poppler tools; executable paths and arguments are now passed directly to child processes.
-   Refreshed the supported development dependencies and regenerated the lockfile with patched transitive packages.

### Maintenance

-   Updated CI to Node.js 24 and current Node.js 24-based GitHub Actions.
-   Migrated extension tests to the current VS Code test CLI, including automatic installation of declared extension dependencies.
-   Updated the VS Code test runtime to support current macOS runners.
-   Added weekly Dependabot updates for npm packages and GitHub Actions.

## [0.5.4] - 2025-12-23

-   Fixed an issue where previewing files with special characters in the filename (e.g., spaces, parentheses) would fail with a syntax error.

## [0.5.2] - 2025-12-17

-   Fixed `Cannot find module 'path-scurry'` runtime error by downgrading `glob` dependency.
-   Fixed "Command not found" error during extension activation on Windows (caused by `showWhatsNew` crash).

## [0.5.0] - 2025-12-15

### New Features

-   **Custom Executable Paths**: Configure paths to `ps2pdf`, `pdftocairo`, and `pdfinfo` in VS Code settings. Useful for conda environments or non-standard installations.
-   **Multi-Page Navigation**: Navigate through multi-page PostScript documents with Prev/Next buttons and page input.
-   **GhostScript Console Output**: View output from `==`, `print`, and other operators in the VS Code Output panel.
-   **Theme Support**: Automatic light/dark mode matching VS Code theme.

### Improvements

-   Refactored codebase into modular components for easier maintenance
-   Simplified webview with cleaner UI and removed Bootstrap dependency
-   Updated ESLint configuration for modern TypeScript
-   Added TESTING.md for local development instructions
-   Improved README with better documentation and SEO

## [0.4.4] - 2024-09-23

-   Fixed README issues
-   Added doc to pin to version 0.89.0 for poppler on Windows
-   Added auto-refresh capability

## [0.4.0] - 2021-11-11

-   Fixed pdf conversion error
-   Updated README with new instructions

## [0.3.2] - 2021-11-11

-   Fixed README instructions
-   Version bump

## [0.3.1] - 2021-10-22

-   Version bump

## [0.3.0] - 2021-10-11

-   Fixed controller scrolling
-   Added instructions for Ubuntu install

## [0.2.3] - 2021-10-09

-   Added option to hide controls
-   Fixed container sizing issue
-   Switched controller positioning

## [0.2.1] - 2021-10-08

-   Fixed requirement instructions

## [0.2.0] - 2021-10-08

-   Added support for SVG Pan and Zoom
-   Added support for changing background color of preview window

-   Fixed issue with Windows 10 preview

## [0.1.0] - 2020-07-19

-   Basic functionality of EPS preview.
-   A command to invoke the preview.
-   A preview icon in the menu bar for open EPS file.
-   README and CHANGELOG files.
