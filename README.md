[![](https://vsmarketplacebadge.apphb.com/version-short/ahnafnafee.postscript-preview.svg)](https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview) [![](https://vsmarketplacebadge.apphb.com/installs-short/ahnafnafee.postscript-preview.svg)](https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview) [![](https://vsmarketplacebadge.apphb.com/rating-short/ahnafnafee.postscript-preview.svg)](https://marketplace.visualstudio.com/items?itemName=ahnafnafee.postscript-preview)




<p align="center">
    <img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/images/logo.png" alt="Logo"  width="128px" height="auto" />
</p>
<p align="center">
    <br/>
    <a title="READ REQUIREMENTS AFTER INSTALL" href="#requirements"><img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/docs/images/req-btn.png" alt="Read Requirements After Install"></a>
</p>


# PostScript Preview



> PostScript Preview is an extension that helps to **preview** EPS and PS files in [Visual Studio Code](https://code.visualstudio.com/). It supercharges how your view PostScript files by also allowing to **pan** and **zoom** the image. You can also change the preview background for extra **customizations**.




## Features

This extension enables the in-VSCode preview of EPS image files.
A new command `postscript-preview.sidePreview` is added as well as a preview icon in the menu bar when EPS or PS files are open in VSCode.

<img src="https://github.com/ahnafnafee/PostScript-Preview/raw/master/demo/postscript-preview-demo.gif" alt="demo" style="zoom:50%;" />



## Requirements

This extension depends on the `PostScript Language` extension to recognize EPS/PS file.
You can install that extension from the VSCode extension store.

This extension also depends on two commands:

- `ps2pdf` - to first convert the EPS/PS file to PDF (the command is part of GhostScript)
- `pdf2svg` - to convert the generated pdf to svg which is shown in the preview

Thus you need to install these two commands first and ensure they are in the executable path.

For **macOS/Linux**, you can install them via [homebrew](https://brew.sh/):

```sh
brew install ghostscript pdf2svg
```



For **Windows 10**, you need to have GhostScript installed in your system.  You can install  them via [Chocolatey](https://chocolatey.org/install). Run the following commands using an administrative shell.

```bash
choco install ghostscript --version 9.55.0 --force -y

set PATH=%PATH%;"C:\Program Files\gs\gs9.55.0\lib";"C:\Program Files\gs\gs9.55.0\bin"

choco install pdf2svg --ignore-checksums -y

refreshenv

set PATH=%PATH%;C:\ProgramData\chocolatey\lib\pdf2svg\tools\pdf2svg-windows-master\dist-64bits
```

You should now be able to view the EPS/PS files in the preview.

If you are having issues setting the PATH, you can set it using the GUI instead as described [here](https://stackoverflow.com/questions/44272416/how-to-add-a-folder-to-path-environment-variable-in-windows-10-with-screensho). The paths that need to be added are:

```bash
C:\Program Files\gs\gs9.55.0\lib
C:\Program Files\gs\gs9.55.0\bin
C:\ProgramData\chocolatey\lib\pdf2svg\tools\pdf2svg-windows-master\dist-64bits
```



## Known Issues

None yet. If you run into issues, please report the issues. You are also encouraged to open pull requests for additional features and fixes you want to add to this extension.



## Credits

- [mkvoya/eps-preview](https://github.com/mkvoya/eps-preview) for the original base extension
- [bumbu/svg-pan-zoom](https://github.com/bumbu/svg-pan-zoom) for the SVG Pan Zoom library
- [Simonwep/pickr](https://github.com/Simonwep/pickr) for the color picker library
