/**
 * Webview content generation for PostScript Preview
 * Uses VS Code theme variables for automatic light/dark mode support
 */

/**
 * Generate complete webview HTML content
 * Uses CSS variables from VS Code for theme support
 */
// biome-ignore lint/suspicious/noExplicitAny: SVG content can be string or Buffer
export function getWebviewContent(
    fileName: string,
    svgContent: any,
    currentPage: number = 1,
    totalPages: number = 1
): string {
    const showNav = totalPages > 1;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PostScript Preview</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.5.0/dist/svg-pan-zoom.min.js"></script>
  <style>
    :root {
      --accent: #209a8e;
      --accent-hover: #1a7d73;
    }
    
    body {
      margin: 0;
      padding: 16px;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      font-family: var(--vscode-font-family);
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .filename {
      font-size: 14px;
      font-weight: 600;
      padding: 4px 10px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      border-radius: 4px;
    }

    .controls {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    button {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: 1px solid var(--vscode-button-border, transparent);
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
    }

    button:hover:not(:disabled) {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button.primary {
      background: var(--accent);
      color: white;
      border: none;
    }

    button.primary:hover:not(:disabled) {
      background: var(--accent-hover);
    }

    .page-nav {
      display: ${showNav ? "flex" : "none"};
      align-items: center;
      gap: 6px;
    }

    .page-nav input {
      width: 36px;
      text-align: center;
      padding: 4px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border, #444);
      border-radius: 4px;
      font-size: 12px;
    }

    .page-nav span {
      font-size: 12px;
    }

    .preview-container {
      display: flex;
      justify-content: center;
      margin-top: 12px;
    }

    .preview-box {
      border: 1px solid var(--vscode-panel-border, #444);
      border-radius: 6px;
      overflow: hidden;
      background: white;
      position: relative;
    }

    .zoom-controls {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 10;
    }

    .zoom-controls button {
      width: 28px;
      height: 28px;
      padding: 0;
      font-size: 16px;
      font-weight: bold;
    }

    svg { width: 100%; height: auto; display: block; }

    .pickr-wrap {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid var(--vscode-panel-border, #444);
      background: #1EBFAF;
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="filename">${fileName}</span>
    <div class="controls">
      <div class="page-nav">
        <button id="prev" ${currentPage <= 1 ? "disabled" : ""}>◀</button>
        <input type="number" id="pageNum" value="${currentPage}" min="1" max="${totalPages}">
        <span>/ ${totalPages}</span>
        <button id="next" ${
            currentPage >= totalPages ? "disabled" : ""
        }>▶</button>
      </div>
      <div class="pickr-wrap" id="colorPicker"></div>
    </div>
  </div>
  
  <div class="preview-container">
    <div class="preview-box" id="previewBox">
      <div class="zoom-controls">
        <button class="primary" id="zoomIn">+</button>
        <button class="primary" id="zoomReset">↺</button>
        <button class="primary" id="zoomOut">−</button>
      </div>
      <div id="svgContainer">${svgContent}</div>
    </div>
  </div>

  <script>
    ${
        showNav
            ? `
    const vscode = acquireVsCodeApi();
    document.getElementById('prev').onclick = () => vscode.postMessage({command: 'prevPage'});
    document.getElementById('next').onclick = () => vscode.postMessage({command: 'nextPage'});
    document.getElementById('pageNum').onchange = e => vscode.postMessage({command: 'goToPage', page: e.target.value});
    `
            : ""
    }

    // Color picker
    const pickr = Pickr.create({
      el: '#colorPicker',
      theme: 'nano',
      default: '#FFFFFF',
      swatches: ['#FFFFFF', '#000000', '#1EBFAF', '#F5F5F5', '#333333'],
      components: { preview: true, opacity: false, hue: true, interaction: { input: true, save: true } }
    }).on('save', (color) => {
      document.getElementById('previewBox').style.background = color.toHEXA().toString();
      pickr.hide();
    });

    // SVG Pan Zoom
    const svg = document.querySelector('svg');
    if (svg) {
      const pz = svgPanZoom(svg, { zoomEnabled: true, controlIconsEnabled: false, fit: true, center: true });
      document.getElementById('zoomIn').onclick = () => pz.zoomIn();
      document.getElementById('zoomOut').onclick = () => pz.zoomOut();
      document.getElementById('zoomReset').onclick = () => { pz.resetZoom(); pz.resetPan(); };
    }
  </script>
</body>
</html>`;
}
