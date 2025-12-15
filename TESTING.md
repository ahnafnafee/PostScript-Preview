# Testing PostScript Preview Extension

This guide explains how to test the extension locally during development.

## Prerequisites

Ensure you have the following installed:

1. **Node.js** (v14 or later)
2. **GhostScript** (provides `ps2pdf`)
3. **Poppler** (provides `pdftocairo` and `pdfinfo`)

### Verify Prerequisites

```bash
# Check if commands are available
ps2pdf --help
pdftocairo --help
pdfinfo --help
```

## Setup

1. Install dependencies:

    ```bash
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

Test files are located in `test_eps/`:

| File                | Purpose                                |
| ------------------- | -------------------------------------- |
| `test_01.ps`        | Basic single-page PostScript           |
| `test_02.ps`        | PostScript with shapes                 |
| `multipage_test.ps` | 3-page document for testing navigation |

## Features to Test

### 1. Basic Preview

-   Open `test_eps/test_01.ps`
-   Click preview icon → Preview should appear

### 2. Multi-Page Navigation

-   Open `test_eps/multipage_test.ps`
-   Verify Prev/Next buttons appear
-   Test page navigation and direct page input

### 3. Console Output

-   Open `test_eps/multipage_test.ps`
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

## Running Tests

```bash
yarn test
```

## Packaging

Build a VSIX package for local installation:

```bash
npm install -g @vscode/vsce
vsce package
```

Install the generated `.vsix` file via:
**Extensions → ⋯ → Install from VSIX...**

## Debugging Tips

-   Use `console.log()` statements in TypeScript code
-   View debug output in **Debug Console** panel when running with F5
-   Check the Output panel for "PostScript-Preview" logs
