<div align="center"><a id="readme-top"></a>

<img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/images/logo.png" alt="PostScript Preview logo" width="128">

<h1>PostScript Preview</h1>

<p>Preview PostScript and EPS files without leaving Visual Studio Code.</p>

<p>
  <a href="https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview"><strong>Visual Studio Marketplace</strong></a> ·
  <a href="https://open-vsx.org/extension/ahnafnafee/postscript-preview"><strong>Open VSX</strong></a> ·
  <a href="https://github.com/ahnafnafee/PostScript-Preview/releases"><strong>Changelog</strong></a> ·
  <a href="https://github.com/ahnafnafee/PostScript-Preview/issues"><strong>Feedback</strong></a>
</p>

[![Marketplace version][marketplace-version-shield]][marketplace-link] [![Marketplace installs][marketplace-installs-shield]][marketplace-link] [![Marketplace rating][marketplace-rating-shield]][marketplace-link] [![Open VSX version][open-vsx-shield]][open-vsx-link]<br>[![Test status][tests-shield]][tests-link] [![CodeQL status][codeql-shield]][codeql-link] [![License][license-shield]][license-link] [![GitHub stars][stars-shield]][stars-link]

</div>

<p align="center">
  <img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/demo/postscript-preview-demo.gif" alt="PostScript Preview showing a PostScript document beside its source" width="900">
</p>

> **Requirements:** PostScript Preview uses Ghostscript and Poppler installed on your computer. Complete the [requirements](#requirements) after installing the extension.

## Quick start

1. Install [PostScript Preview from the Visual Studio Marketplace][marketplace-link] or [Open VSX][open-vsx-link].
2. Install [Ghostscript](https://www.ghostscript.com/) and [Poppler](https://poppler.freedesktop.org/) for your operating system.
3. Open a `.ps` or `.eps` file in Visual Studio Code.
4. Select the preview icon in the editor title bar.

The Visual Studio Marketplace installs the companion [PostScript Language](https://marketplace.visualstudio.com/items?itemName=mxschmitt.postscript) extension automatically so Visual Studio Code can recognize PostScript files. Open VSX does not currently mirror that dependency; Open VSX and VSCodium users must first [download its VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/mxschmitt/vsextensions/postscript/latest/vspackage) and run **Extensions: Install from VSIX...**.

## Highlights

| | |
| --- | --- |
| **Live preview**<br>View `.ps` and `.eps` output beside the source file. | **Multi-page navigation**<br>Move between pages or jump directly to a page. |
| **Pan and zoom**<br>Inspect SVG output with smooth navigation controls. | **Automatic refresh**<br>Regenerate the preview whenever the source file is saved. |
| **Theme-aware interface**<br>Match Visual Studio Code's light and dark themes. | **Custom background**<br>Choose a preview color for transparent artwork. |
| **Ghostscript output**<br>Read output from `==`, `print`, and other operators. | **Configurable tools**<br>Use custom Ghostscript and Poppler executable paths. |

## Requirements

PostScript Preview delegates document conversion to three command-line tools:

| Tool | Provided by | Purpose |
| --- | --- | --- |
| `ps2pdf` (`gswin64c.exe` on Windows) | Ghostscript | Converts PostScript or EPS to PDF. |
| `pdftocairo` | Poppler | Converts a PDF page to SVG for the preview. |
| `pdfinfo` | Poppler | Detects the number of pages in a document. |

### macOS

Install both dependencies with [Homebrew](https://brew.sh/):

```bash
brew install ghostscript poppler
```

### Ubuntu and Debian

```bash
sudo apt-get update
sudo apt-get install ghostscript poppler-utils -y
```

### Windows

Install Ghostscript with [Chocolatey](https://chocolatey.org/install) from an Administrator terminal:

```powershell
choco install ghostscript -y
```

Download the latest prebuilt Poppler archive from [poppler-windows](https://github.com/oschwartz10612/poppler-windows/releases/latest), then extract it to `C:\Program Files\poppler`. The Chocolatey `poppler` package does not currently include a complete set of working Windows binaries, so the release archive is the recommended source.

Add the installed tools to the system `PATH` (the command detects the installed Ghostscript version):

```powershell
$gs = (Get-ChildItem "C:\Program Files\gs\gs*\bin\gswin64c.exe" | Select-Object -Last 1).Directory.Parent.FullName
$popplerBin = (Get-ChildItem "C:\Program Files\poppler" -Filter pdftocairo.exe -Recurse | Select-Object -First 1).DirectoryName
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine) + ";$gs\lib;$gs\bin;$popplerBin", [EnvironmentVariableTarget]::Machine)
```

Restart Visual Studio Code after installation.

If automatic `PATH` setup does not work, add these directories through **System Properties → Environment Variables**, replacing `<version>` with the installed Ghostscript version:

```text
C:\Program Files\gs\gs<version>\lib
C:\Program Files\gs\gs<version>\bin
C:\Program Files\poppler\poppler-<version>\Library\bin
```

## Configuration

Custom paths are useful for Conda environments and other non-standard installations. Open Visual Studio Code settings and search for **PostScript Preview**, or add the values directly to `settings.json`.

| Setting | Description | Default |
| --- | --- | --- |
| `postscript-preview.path.ps2pdf` | Path to the `ps2pdf` executable. On Windows, the default safely invokes `gswin64c.exe` from `PATH`. | `ps2pdf` |
| `postscript-preview.path.pdftocairo` | Path to the `pdftocairo` executable. | `pdftocairo` |
| `postscript-preview.path.pdfinfo` | Path to the `pdfinfo` executable. | `pdfinfo` |

```json
{
  "postscript-preview.path.ps2pdf": "/opt/ghostscript/bin/ps2pdf",
  "postscript-preview.path.pdftocairo": "/opt/poppler/bin/pdftocairo",
  "postscript-preview.path.pdfinfo": "/opt/poppler/bin/pdfinfo"
}
```

## Using the preview

### Multi-page documents

Navigation controls appear when a PostScript document contains multiple pages:

- Select **◀** or **▶** to move one page at a time.
- Enter a page number to jump directly to it.
- Save the source file to regenerate the document and return to page 1.

### Console output

To inspect Ghostscript output:

1. Open the Output panel with `Ctrl+Shift+U` on Windows or Linux, or `Cmd+Shift+U` on macOS.
2. Select **PostScript-Preview** from the channel list.
3. Save or reopen the preview to run the converter.

### Troubleshooting

| Problem | What to check |
| --- | --- |
| The preview icon is missing. | Confirm the file's language mode is **PostScript**, then make sure the [PostScript Language](https://marketplace.visualstudio.com/items?itemName=mxschmitt.postscript) extension is installed and enabled. |
| A converter cannot be found. | Run `ps2pdf`, `pdftocairo`, and `pdfinfo` in a terminal, or configure their absolute paths. |
| A newly installed tool is not detected. | Restart Visual Studio Code so it receives the updated `PATH`. |

If the problem continues, [open an issue](https://github.com/ahnafnafee/PostScript-Preview/issues/new/choose) with your operating system, extension version, and the **PostScript-Preview** output.

## Development

```bash
git clone https://github.com/ahnafnafee/PostScript-Preview.git
cd PostScript-Preview
corepack enable
yarn install
yarn compile
```

Press `F5` in Visual Studio Code to open an Extension Development Host.

### Tests

| Command | Coverage |
| --- | --- |
| `yarn test:unit` | Fast tests for pure preview behavior. |
| `yarn test:integration` | Extension activation and behavior inside a real Visual Studio Code host. |
| `yarn test` | The complete unit and integration test suite. |

See the [testing guide](https://github.com/ahnafnafee/PostScript-Preview/blob/master/TESTING.md) for prerequisites, sample documents, and manual checks.

## Credits

- [mkvoya/eps-preview](https://github.com/mkvoya/eps-preview) — the original extension on which this project was based.
- [svg-pan-zoom](https://github.com/bumbu/svg-pan-zoom) — SVG pan and zoom controls.
- [Pickr](https://github.com/Simonwep/pickr) — the preview background color picker.

## License

PostScript Preview is available under the [MIT License][license-link].

<div align="center">

If PostScript Preview is useful to you, consider [starring the repository][stars-link] or leaving a review on the [Visual Studio Marketplace][marketplace-link].

<a href="#readme-top">Back to top</a>

</div>

[marketplace-link]: https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview
[marketplace-version-shield]: https://vsmarketplacebadges.dev/version-short/ahnafnafee.postscript-preview.svg
[marketplace-installs-shield]: https://vsmarketplacebadges.dev/installs-short/ahnafnafee.postscript-preview.svg
[marketplace-rating-shield]: https://vsmarketplacebadges.dev/rating-short/ahnafnafee.postscript-preview.svg
[open-vsx-link]: https://open-vsx.org/extension/ahnafnafee/postscript-preview
[open-vsx-shield]: https://img.shields.io/open-vsx/v/ahnafnafee/postscript-preview?label=Open%20VSX
[tests-link]: https://github.com/ahnafnafee/PostScript-Preview/actions/workflows/test.yml
[tests-shield]: https://img.shields.io/github/actions/workflow/status/ahnafnafee/PostScript-Preview/test.yml?branch=master&label=tests&logo=github
[codeql-link]: https://github.com/ahnafnafee/PostScript-Preview/actions/workflows/codeql-analysis.yml
[codeql-shield]: https://img.shields.io/github/actions/workflow/status/ahnafnafee/PostScript-Preview/codeql-analysis.yml?branch=master&label=CodeQL&logo=github
[license-link]: https://github.com/ahnafnafee/PostScript-Preview/blob/master/LICENSE
[license-shield]: https://img.shields.io/github/license/ahnafnafee/PostScript-Preview
[stars-link]: https://github.com/ahnafnafee/PostScript-Preview
[stars-shield]: https://img.shields.io/github/stars/ahnafnafee/PostScript-Preview?style=flat
