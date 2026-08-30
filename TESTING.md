# Testing PostScript Preview Extension

This guide explains how to test the extension locally during development.

## Prerequisites

Ensure you have the following installed:

1. **Node.js 24** with Corepack (the active LTS release used by CI)
2. **Ghostscript** (provides `ps2pdf`; the extension invokes `gswin64c.exe` directly on Windows)
3. **Poppler** (provides `pdftocairo` and `pdfinfo`)

### Verify Prerequisites

On macOS or Linux:

```bash
ps2pdf --help
pdftocairo --help
pdfinfo --help
```

On Windows:

```powershell
gswin64c -version
pdftocairo -v
pdfinfo -v
```

## Setup

1. Install dependencies:

    ```bash
    corepack enable
    yarn install
    ```

2. Compile TypeScript:

    ```bash
    yarn compile
    ```

## Running the Extension

### Method 1: VS Code Debugger (Recommended)

1. Open the project in VS Code
2. Press `F5` or go to **Run → Start Debugging**
3. A new VS Code window will open ("[Extension Development Host]")
4. In the new window, open a `.ps` or `.eps` file
5. Click the preview icon in the editor title bar

### Method 2: Watch Mode

For continuous development with auto-compilation:

```bash
yarn watch
```

Then press `F5` to launch the Extension Development Host.

## Test Files

Test files are located in `examples/`:

| File               | Purpose                                |
| ------------------ | -------------------------------------- |
| `sample.eps`       | Sample EPS file                        |
| `basic_shapes.ps`  | Basic single-page PostScript           |
| `triangle_grid.ps` | PostScript with shapes and grid        |
| `multipage.ps`     | 3-page document for testing navigation |

## Features to Test

### 1. Basic Preview

-   Open `examples/basic_shapes.ps`
-   Click preview icon → Preview should appear

### 2. Multi-Page Navigation

-   Open `examples/multipage.ps`
-   Verify Prev/Next buttons appear
-   Test page navigation and direct page input

### 3. Console Output

-   Open `examples/multipage.ps`
-   Preview the file
-   Open Output panel (`Ctrl+Shift+U`)
-   Select "PostScript-Preview" → Should show GhostScript output

### 4. Custom Paths Configuration

-   Open Settings (`Ctrl+,`)
-   Search "postscript-preview"
-   Verify 3 path settings appear

### 5. Zoom & Background

-   Use +/- buttons for zoom
-   Click color picker to change background
-   Test "Hide Controls" button

### 6. Auto-Refresh

-   Preview a file
-   Edit and save the PostScript file
-   Preview should auto-update

## Automated Tests

Tests are grouped by the boundary they exercise:

```text
src/test/
├── unit/          # Pure logic; no VS Code host or native tools
├── integration/   # Extension behavior in a real VS Code host
└── runTest.ts     # Downloads and launches the integration test host
```

Run the fast unit suite while developing pure preview behavior:

```bash
yarn test:unit
```

Run the integration suite after installing Ghostscript and Poppler:

```bash
yarn test:integration
```

Run the complete suite in the same order as CI:

```bash
yarn test
```

CI runs both suites on Node.js 24 across Ubuntu, Windows, and macOS. Linux integration tests use Xvfb to provide the display required by the Visual Studio Code test host.

## Packaging

Build a VSIX package for local installation:

```bash
npm install -g @vscode/vsce
vsce package --no-dependencies
```

Install the generated `.vsix` file via:
**Extensions → ⋯ → Install from VSIX...**

## Publishing to VS Code Marketplace

### Prerequisites

1. Create a Personal Access Token (PAT) - see [official instructions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token)

2. Login to vsce:

    ```bash
    vsce login ahnafnafee
    ```

### Release Checklist

Before publishing a new version:

1. Update version in `package.json`
2. Update `CHANGELOG.md` with new features/fixes
3. Compile and test locally (`yarn compile` + `F5`)
4. Build package to verify: `vsce package --no-dependencies`

### Publish

```bash
vsce publish --no-dependencies
```

Or publish with a version bump:

```bash
vsce publish --no-dependencies patch  # 0.6.0 → 0.6.1
vsce publish --no-dependencies minor  # 0.6.0 → 0.7.0
vsce publish --no-dependencies major  # 0.6.0 → 1.0.0
```

### View Published Extension

https://marketplace.visualstudio.com/manage

## Debugging Tips

-   Use `console.log()` statements in TypeScript code
-   View debug output in **Debug Console** panel when running with F5
-   Check the Output panel for "PostScript-Preview" logs
