/**
 * Webview content generation for PostScript Preview
 */

/**
 * Generate navigation HTML for multi-page documents
 */
function getNavigationHtml(currentPage: number, totalPages: number): string {
    if (totalPages <= 1) {
        return "";
    }

    return `
  <div class="page-navigation">
    <button id="prev-page" class="nav-btn" ${
        currentPage <= 1 ? "disabled" : ""
    }>Prev</button>
    <span class="page-info">
      <input type="number" id="page-input" value="${currentPage}" min="1" max="${totalPages}" />
      <span>/ ${totalPages}</span>
    </span>
    <button id="next-page" class="nav-btn" ${
        currentPage >= totalPages ? "disabled" : ""
    }>Next</button>
  </div>
  `;
}

/**
 * Generate navigation CSS styles
 */
function getNavigationStyles(showNavigation: boolean): string {
    if (!showNavigation) {
        return "";
    }

    return `
    .page-navigation {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .nav-btn {
      background-color: white;
      color: #209a8e;
      border: 2px solid #209a8e;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .nav-btn:hover:not(:disabled) {
      background-color: #209a8e;
      color: white;
    }

    .nav-btn:disabled {
      background-color: #f0f0f0;
      color: #999;
      border-color: #ccc;
      cursor: not-allowed;
    }

    .page-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      font-size: 0.875rem;
    }

    #page-input {
      width: 40px;
      text-align: center;
      padding: 4px 6px;
      border: 2px solid #209a8e;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    #page-input:focus {
      outline: none;
      border-color: #1a7d73;
    }
  `;
}

/**
 * Generate navigation JavaScript
 */
function getNavigationScript(showNavigation: boolean): string {
    if (!showNavigation) {
        return "";
    }

    return `
    const vscode = acquireVsCodeApi();
    
    document.getElementById('prev-page').addEventListener('click', () => {
      vscode.postMessage({ command: 'prevPage' });
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
      vscode.postMessage({ command: 'nextPage' });
    });
    
    document.getElementById('page-input').addEventListener('change', (e) => {
      vscode.postMessage({ command: 'goToPage', page: e.target.value });
    });
    
    document.getElementById('page-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        vscode.postMessage({ command: 'goToPage', page: e.target.value });
      }
    });
  `;
}

/**
 * Get base CSS styles for the webview
 */
function getBaseStyles(): string {
    return `
    body {
      margin-top: 2%;
      padding: 2% 0%;
    }

    h2 {
      font-size: 1.2em;
      margin-left: 10%;
      border: 1px solid black;
      width: max-content;
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 2%;
    }

    .main-main-container {
      margin: 3% 2% !important;
      position: relative;
    }

    .main-container {
      margin: 0 auto;
      max-width: max-content;
      border-radius: 8px;
      position: relative;
      border: 1px solid black;
      overflow: clip;
      position: relative;
    }

    .main-control-container {
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      float: right;
      width: 0;
      height: max-content;
      scroll-behavior: smooth;
      padding-top: 1em;
      padding-right: 2.5em;
      z-index: 2;
    }

    .main-content {
      top: 0;
      right: 0;
      white-space: nowrap;
    }

    svg {
      width: inherit;
      height: inherit;
    }

    .btn-controls {
      margin: 0 auto;
      margin-bottom: 2px;
    }

    .control-btn {
      background-color: #209a8e !important;
      border-color: #209a8e !important;
      font-weight: bold;
    }

    .control-btn:hover,
    .control-btn:active,
    .control-btn:visited {
      background-color: #209a8e !important;
      border-color: #209a8e !important;
    }

    .reset-btn {
      background-color: white !important;
      color: #209a8e !important;
      border: 2px solid #209a8e !important;
      font-weight: 600;
    }

    .reset-btn:hover,
    .reset-btn:active,
    .reset-btn:visited {
      background-color: #209a8e !important;
      color: white !important;
      border-color: #209a8e !important;
    }

    #reset {
      width: 56px;
      height: auto;
      text-align: center;
    }

    #hider {
      border: 0.16em solid #209a8e !important;
    }

    .pickr .pcr-button.clear {
      background: white;
    }

    .pickr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10% !important;
      float: right;
      position: absolute;
      justify-content: flex-end;
      padding: 2% 0%;
      right: 0;
      top: 2%;
      width: max-content;
      height: max-content;
    }

    div>.pickr {
      background: #000;
      color: white;
      border: 1px solid black;
      top: 0;
      margin: 0;
      padding: 0;
      cursor: pointer;
      border-radius: 4px;
      height: 30px;
      width: 40px;
    }
  `;
}

/**
 * Get color picker and zoom control scripts
 */
function getControlScripts(): string {
    return `
    const inputElement = document.querySelector('.pickr');
    // Simple example, see optional options for more configuration.
    const pickr = Pickr.create({
      el: inputElement,
      useAsButton: true,
      default: '#1EBFAF',
      defaultRepresentation: 'HEX',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(103, 58, 183, 1)',
        'rgba(63, 81, 181, 1)',
        'rgba(33, 150, 243, 1)',
        'rgba(3, 169, 244, 1)',
      ],
      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,
        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          input: true,
          clear: true,
          save: true
        }
      }
    }).on('init', pickr => {
      inputElement.style.background = pickr.getSelectedColor().toHEXA().toString();
    }).on('save', color => {
      pickr.hide();
      document.getElementById("container").style.background = color.toHEXA().toString();
      inputElement.style.background = pickr.getSelectedColor().toHEXA().toString();
    });
    const svgElem = document.getElementsByTagName("svg")[0];
    // SVG Pan Zoom
    window.onload = function() {
      const panZoom = svgPanZoom(svgElem, {
        zoomEnabled: true,
        controlIconsEnabled: false
      });
      document.getElementById("zoom-out").addEventListener("click", function(ev) {
        ev.preventDefault();
        panZoom.zoomIn();
      });
      document.getElementById("zoom-in").addEventListener("click", function(ev) {
        ev.preventDefault();
        panZoom.zoomOut();
      });
      document.getElementById("reset").addEventListener("click", function(ev) {
        ev.preventDefault();
        panZoom.resetZoom();
        panZoom.resetPan();
      });
    };
    const controlDiv = document.querySelector(".control-container");
    const hideToggle = document.querySelector("#hider");
    controlDiv.style.visibility = "visible";

    function hideControls() {
      if (controlDiv.style.visibility === "visible") {
        controlDiv.style.visibility = "hidden";
        hideToggle.textContent = "Show Controls";
      } else {
        controlDiv.style.visibility = "visible";
        hideToggle.textContent = "Hide Controls";
      }
    }
    var rect = svgElem.getBoundingClientRect();
    const mainContainer = document.querySelector(".main-container");
    console.log(mainContainer);
    // mainContainer.style.maxWidth = rect.width + "pt";
    // mainContainer.style.maxHeight = rect.height + "pt";
    console.log(mainContainer.style.maxWidth);
    console.log(mainContainer.style.maxHeight);
    console.log(rect.width);
    console.log(rect.height);
  `;
}

/**
 * Generate complete webview HTML content
 */
// biome-ignore lint/suspicious/noExplicitAny: SVG content can be string or Buffer
export function getWebviewContent(
    fileName: string,
    svgContent: any,
    currentPage: number = 1,
    totalPages: number = 1
): string {
    const showNavigation = totalPages > 1;
    const navigationHtml = getNavigationHtml(currentPage, totalPages);
    const navigationStyles = getNavigationStyles(showNavigation);
    const navigationScript = getNavigationScript(showNavigation);
    const baseStyles = getBaseStyles();
    const controlScripts = getControlScripts();

    return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- One of the following themes -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css" /> <!-- 'nano' theme -->

  <!-- Modern or es5 bundle -->
  <script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-uWxY/CJNBR+1zjPWmfnSnVxwRheevXITnMqoEIeG1LJrdI0GlVs/9cVSyPYXdcSF" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-kQtW33rZJAHjgefvhyyzcGF3C5TFyBQBA13V1RKPf4uH+bwyzQxZ6CmMZHmNBEfJ" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.5.0/dist/svg-pan-zoom.min.js"></script>
  <style>
    ${baseStyles}
    ${navigationStyles}
  </style>
  <title>PostScript Preview</title>
</head>

<body>
  <h2>${fileName}</h2>

  ${navigationHtml}

  <div class="pickr-container">
    <div class="pickr"></div>
  </div>

  <div class="btn-controls d-flex justify-content-center">
    <button id="hider" type="button" onclick="hideControls()" class="btn btn-outline-primary reset-btn btn-sm">Hide Controls</button>
  </div>
  <div class="main-main-container">
    <main class="main-container">
      <div class="main-control-container d-flex align-items-end justify-content-center">
        <div class="control-container d-flex align-items-end flex-column justify-content-center">
          <div class="btn-controls">
            <button id="zoom-out" type="button" class="control-btn btn btn-primary btn-sm">+</button>
          </div>
          <div class="btn-controls">
            <button id="reset" type="button" class="btn btn-outline-primary reset-btn btn-sm">Reset</button>
          </div>
          <div class="btn-controls">
            <button id="zoom-in" type="button" class="control-btn btn btn-primary btn-sm">-</button>
          </div>
        </div>
      </div>
      <div id="container" class="main-content">
        <?xml version="1.0" encoding="UTF-8"?>
        ${svgContent}
      </div>

    </main>
  </div>
  <script>
    ${navigationScript}
    ${controlScripts}
  </script>
</body>

</html>
`;
}
