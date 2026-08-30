<p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview"><img src="https://img.shields.io/visual-studio-marketplace/v/ahnafnafee.postscript-preview?logo=visualstudiocode&style=for-the-badge" alt="Version" /></a>
    <a href="https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview"><img src="https://img.shields.io/visual-studio-marketplace/r/ahnafnafee.postscript-preview?logo=visualstudiocode&style=for-the-badge" alt="Rating" /></a>
    <a href="https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview"><img src="https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/ahnafnafee.postscript-preview?logo=visualstudiocode&style=for-the-badge" alt="Installs" /></a>
</p>

<p align="center">
    <img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/images/logo.png" alt="PostScript Preview Logo" width="128px" height="auto" />
</p>
<p align="center">
    <br/>
    <a title="READ REQUIREMENTS AFTER INSTALL" href="#-requirements"><img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/docs/images/req-btn.png" alt="Read Requirements After Install"></a>
</p>

<h1 align="center">PostScript Preview for VS Code</h1>

> **A popular PostScript and EPS file previewer for Visual Studio Code** — Preview, pan, zoom, and debug your `.ps` and `.eps` files directly in VS Code. Supports multi-page documents, GhostScript console output, custom themes, and more.

## ✨ Features

-   **Live Preview** — View EPS and PS files side-by-side with your code
-   **Pan & Zoom** — Smooth SVG-based pan and zoom controls
-   **Multi-Page Support** — Navigate through multi-page PostScript documents
-   **Theme Support** — Automatic light/dark mode matching VS Code theme
-   **Background Color Picker** — Customize preview background color
-   **Console Output** — View GhostScript output (from `==`, `print`, etc.)
-   **Custom Paths** — Configure paths to GhostScript and Poppler tools
-   **Auto-Refresh** — Preview updates automatically when you save

<img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/demo/postscript-preview-demo.gif" alt="PostScript Preview Demo" style="zoom:50%;" />

## 🚀 Quick Start

1. Install this extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview)
2. Install [GhostScript](https://www.ghostscript.com/) and [Poppler](https://poppler.freedesktop.org/)
3. Open any `.ps` or `.eps` file
4. Click the preview icon in the editor title bar

## 📋 Requirements

This extension requires:

-   **[PostScript Language](https://marketplace.visualstudio.com/items?itemName=mxschmitt.postscript)** extension — required for the preview button to appear (it registers `.ps`/`.eps` files as PostScript, which this extension's preview button and activation depend on; it also provides syntax highlighting). Installed automatically alongside this extension.
-   **GhostScript** (provides `ps2pdf`)
-   **Poppler** (provides `pdftocairo` and `pdfinfo`)

> **No preview button?** If the preview icon does not appear in the editor title bar, your `.ps`/`.eps` file is likely opening as *Plain Text* (check the language indicator in the status bar). Make sure the [PostScript Language](https://marketplace.visualstudio.com/items?itemName=mxschmitt.postscript) extension is installed and enabled, then reload VS Code.

### macOS

```bash
brew install ghostscript poppler
```

### Ubuntu / Debian

```bash
sudo apt-get install ghostscript poppler-utils -y
```

### Windows

Install via [Chocolatey](https://chocolatey.org/install) (run as Administrator):

```powershell
choco install ghostscript -y
choco install poppler --version 0.89.0 -y --force
```

> **Why the Poppler pin?** Chocolatey `poppler` packages newer than `0.89.0` do not ship working Windows binaries (`25.x`+ contain only the source tarball, and the `22.11.x` builds are missing their dependency DLLs), so `0.89.0` is the newest version that works there. If you prefer a current Poppler, download a prebuilt release from [poppler-windows](https://github.com/oschwartz10612/poppler-windows/releases) instead, extract it, and point `postscript-preview.path.pdftocairo` / `postscript-preview.path.pdfinfo` at the executables in its `Library\bin` folder (see [Configuration](#configuration)).

Add to PATH (auto-detects the installed GhostScript version):

```powershell
$gs = (Get-ChildItem "C:\Program Files\gs\gs*\bin\gswin64c.exe" | Select-Object -Last 1).Directory.Parent.FullName
[Environment]::SetEnvironmentVariable("Path",[Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine) + ";$gs\lib;$gs\bin;C:\ProgramData\chocolatey\lib\poppler\tools",[EnvironmentVariableTarget]::Machine)
```

**Restart VS Code** after installation.

<details>
<summary>Manual PATH setup</summary>

If you have issues setting PATH, add these manually via System Properties → Environment Variables (substitute your installed GhostScript version, e.g. `gs10.07.1`):

```
C:\Program Files\gs\gs<version>\lib
C:\Program Files\gs\gs<version>\bin
C:\ProgramData\chocolatey\lib\poppler\tools
```

</details>

## Configuration

Configure custom executable paths in VS Code settings (useful for conda environments or non-standard installations):

| Setting                              | Description                   | Default      |
| ------------------------------------ | ----------------------------- | ------------ |
| `postscript-preview.path.ps2pdf`     | Path to ps2pdf executable     | `ps2pdf`     |
| `postscript-preview.path.pdftocairo` | Path to pdftocairo executable | `pdftocairo` |
| `postscript-preview.path.pdfinfo`    | Path to pdfinfo executable    | `pdfinfo`    |

Example `settings.json`:

```json
{
    "postscript-preview.path.ps2pdf": "/opt/ghostscript/bin/ps2pdf",
    "postscript-preview.path.pdftocairo": "/opt/poppler/bin/pdftocairo"
}
```

## Multi-Page Documents

For PostScript files with multiple `showpage` commands, navigation controls appear automatically:

-   **◀ / ▶** — Navigate between pages
-   **Page input** — Jump to a specific page

The preview resets to page 1 when the source file is modified.

## Console Output

View GhostScript output in VS Code:

1. Open Output panel (`Ctrl+Shift+U` / `Cmd+Shift+U`)
2. Select **"PostScript-Preview"** from the dropdown
3. Output from `==`, `print`, and other operators will appear here

## Known Issues

None currently. [Report issues here](https://github.com/ahnafnafee/PostScript-Preview/issues).

## Credits

-   [mkvoya/eps-preview](https://github.com/mkvoya/eps-preview) — Original base extension
-   [svg-pan-zoom](https://github.com/bumbu/svg-pan-zoom) — Pan and zoom library
-   [pickr](https://github.com/Simonwep/pickr) — Color picker library

## Development

See [TESTING.md](TESTING.md) for local development instructions.

```bash
yarn install
yarn compile
# Press F5 in VS Code to launch Extension Development Host
```

## License

[MIT](LICENSE)

---

<p align="center">
    <strong>⭐ If you find this extension useful, please star the repo and leave a review!</strong>
</p>
