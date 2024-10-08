<p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview"><img src="https://img.shields.io/visual-studio-marketplace/v/ahnafnafee.postscript-preview?logo=visualstudiocode&style=for-the-badge" alt="Version" /></a>
    <a href="https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview"><img src="https://img.shields.io/visual-studio-marketplace/r/ahnafnafee.postscript-preview?logo=visualstudiocode&style=for-the-badge" alt="Rating" /></a>
    <a href="https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview"><img src="https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/ahnafnafee.postscript-preview?logo=visualstudiocode&style=for-the-badge" alt="Installs" /></a>
</p>

<p align="center">
    <img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/images/logo.png" alt="Logo"  width="128px" height="auto" />
</p>
<p align="center">
    <br/>
    <a title="READ REQUIREMENTS AFTER INSTALL" href="#requirements"><img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/docs/images/req-btn.png" alt="Read Requirements After Install"></a>
</p>

<h1 align="center">PostScript Preview</h1>

> PostScript Preview is an extension that helps to **preview** EPS and PS files in [Visual Studio Code](https://code.visualstudio.com/). It supercharges how your view PostScript files by also allowing to **pan** and **zoom** the image. You can also change the preview background for extra **customizations**.

## Features

This extension enables the in-VSCode preview of EPS image files.
A new command `postscript-preview.sidePreview` is added as well as a preview icon in the menu bar when EPS or PS files are open in VSCode.

<img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/demo/postscript-preview-demo.gif" alt="demo" style="zoom:50%;" />

## Requirements

This extension depends on the `PostScript Language` extension to recognize EPS/PS file.
You can install that [extension](https://marketplace.visualstudio.com/items?itemName=mxschmitt.postscript) from the VSCode extension store.

This extension also depends on two commands:

-   `ps2pdf` - to first convert the EPS/PS file to PDF (the command is part of GhostScript)
-   `pdftocairo` - to convert the generated pdf to svg which is shown in the preview

Thus you need to install these two commands first and ensure they are in the executable path.

### **macOS**

You can install them via [homebrew](https://brew.sh/):

```bash
brew install ghostscript
brew install poppler
```

### **Ubuntu**

You can install them using the following commands:

```bash
sudo apt-get install ghostscript -y
sudo apt-get install poppler-utils -y
```

### **Windows**

You need to have GhostScript installed in your system. You can install them via [Chocolatey](https://chocolatey.org/install). Run the following commands using an **Administrative PowerShell**.

Installs GhostScript for _ps2pdf_

```bash
choco install ghostscript --version 9.55.0 --force -y
```

Installs _pdftocairo_

```bash
choco install poppler --version 0.89.0 -y --force
```

Adds the executables to the environment path

```bash
[Environment]::SetEnvironmentVariable("Path",[Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine) + ";C:\Program Files\gs\gs9.55.0\lib;C:\Program Files\gs\gs9.55.0\bin;C:\ProgramData\chocolatey\lib\poppler\tools",[EnvironmentVariableTarget]::Machine)
```

**Now restart VSCode**. You should now be able to view the EPS/PS files in the preview.

If you are having issues setting the PATH, you can set it using the GUI instead as described [here](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/). The paths that need to be added are:

```bash
C:\Program Files\gs\gs9.55.0\lib
C:\Program Files\gs\gs9.55.0\bin
C:\ProgramData\chocolatey\lib\poppler\tools
```

_Please verify that you can view files in the above folders. If the folders do not exist, you might have run into issues with your installation. It's good to close Logitech GHUB and Logitech GHUB Updater when you install these as they might interfere with the process._

## Known Issues

None yet. If you run into issues, please report them here: <https://github.com/ahnafnafee/PostScript-Preview/issues>

You are also encouraged to open pull requests for additional features and fixes you want to add to this extension.

## Credits

-   [mkvoya/eps-preview](https://github.com/mkvoya/eps-preview) for the original base extension
-   [bumbu/svg-pan-zoom](https://github.com/bumbu/svg-pan-zoom) for the SVG Pan Zoom library
-   [Simonwep/pickr](https://github.com/Simonwep/pickr) for the color picker library

## Installing Locally (for Development Purposes)

Install the VSCode Publishing Extension

```bash
npm install -g @vscode/vsce
```

Package the extension:

```bash
vsce package
```

Publish the extension:

```bash
vsce publish
```

See published extensions here: <https://marketplace.visualstudio.com/manage>
