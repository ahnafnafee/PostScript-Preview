/**
 * Generates HTML content for the webview
 */
import * as vscode from "vscode";

export function getWebviewContent(
    filename: string,
    pdfData: string, // Base64 encoded PDF
    pageNumber: number = 1
): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;">
    <title>PostScript Preview</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    </script>
    <style>
        /* ... existing styles ... */
        :root {
            --accent: #209a8e;
            --accent-hover: #1a7d73;
        }
        
        body {
            margin: 0;
            padding: 0;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            font-family: var(--vscode-font-family);
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px;
            background: var(--vscode-editor-group-header-tabs-background);
            border-bottom: 1px solid var(--vscode-panel-border);
            z-index: 10;
        }

        .filename {
            font-size: 13px;
            font-weight: 600;
        }

        .controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        button {
            background: transparent;
            color: var(--vscode-icon-foreground);
            border: 1px solid transparent; 
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        button:hover:not(:disabled) {
            background: var(--vscode-toolbar-hoverBackground);
        }

        button:disabled {
            opacity: 0.4;
            cursor: default;
        }

        .page-nav {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .page-nav span {
            font-size: 12px;
            margin: 0 4px;
            min-width: 40px;
            text-align: center;
        }

        #previewContainer {
            flex: 1;
            position: relative;
            overflow: hidden;
            background-color: #525659;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #svgContainer {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        svg {
            /* Let svg-pan-zoom handle the size, but ensure it starts reasonable */
            max-width: 100%;
            max-height: 100%;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }

        .pickr-wrap {
            margin-left: 8px;
        }
        
        .pickr .pcr-button {
            width: 20px !important;
            height: 20px !important;
            border-radius: 4px !important;
        }
    </style>
</head>
<body>
    <div class="header">
        <span class="filename">${filename}</span>
        <div class="controls">
            <div class="page-nav">
                <button id="prev" title="Previous Page">◀</button>
                <span id="page_info"><span id="page_num">--</span> / <span id="page_count">--</span></span>
                <button id="next" title="Next Page">▶</button>
            </div>
            
            <button id="zoomIn" title="Zoom In">+</button>
            <button id="zoomReset" title="Reset Zoom">↺</button>
            <button id="zoomOut" title="Zoom Out">−</button>
            
            <div class="pickr-wrap" id="colorPicker"></div>
        </div>
    </div>
    
    <div id="previewContainer">
        <div id="svgContainer"></div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        // --- State ---
        let pdfDoc = null;
        let pageNum = ${pageNumber};
        let panZoomInstance = null;
        let pcr = null;
        
        const svgContainer = document.getElementById('svgContainer');
        
        // --- PDF to SVG Rendering ---
        const pdfData = atob("${pdfData}");
        const loadingTask = pdfjsLib.getDocument({data: pdfData});

        loadingTask.promise.then(function(pdfDoc_) {
            pdfDoc = pdfDoc_;
            document.getElementById('page_count').textContent = pdfDoc.numPages;
            renderPage(pageNum);
        }, function (reason) {
            console.error("Error loading PDF:", reason);
        });

        function renderPage(num) {
            pdfDoc.getPage(num).then(function(page) {
                const viewport = page.getViewport({scale: 1.0}); 
                
                page.getOperatorList().then(function (opList) {
                    const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
                    
                    svgGfx.getSVG(opList, viewport).then(function (svg) {
                        svgContainer.innerHTML = '';
                        
                        // 1. Aspect Ratio Safety
                        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                        
                        if (!svg.getAttribute('viewBox')) {
                            svg.setAttribute('viewBox', \`0 0 \${viewport.width} \${viewport.height}\`);
                        }

                        // 2. Paper Background Strategy: Inject a Rect
                        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        bgRect.setAttribute("x", "0");
                        bgRect.setAttribute("y", "0");
                        bgRect.setAttribute("width", viewport.width);
                        bgRect.setAttribute("height", viewport.height);
                        bgRect.setAttribute("fill", "white"); // Default Paper Color
                        bgRect.setAttribute("id", "paper-bg");
                        
                        svg.insertBefore(bgRect, svg.firstChild);

                        // 3. Sizing
                        svg.removeAttribute('width');
                        svg.removeAttribute('height');
                        
                        svg.style.width = '100%';
                        svg.style.height = '100%';
                        svg.style.display = 'block';
                        svg.style.backgroundColor = 'transparent'; 

                        // 4. Color Picker Restore
                        if (pcr) {
                            bgRect.setAttribute("fill", pcr.getColor().toHEXA().toString());
                        }

                        svgContainer.appendChild(svg);
                        
                        // 5. Initialize Pan Zoom safely
                        // Use requestAnimationFrame to let the DOM update dimensions first
                        window.requestAnimationFrame(() => {
                            initPanZoom(svg);
                        });
                    });
                });
            });

            document.getElementById('page_num').textContent = num;
            document.getElementById('prev').disabled = num <= 1;
            document.getElementById('next').disabled = num >= pdfDoc.numPages;
        }

        function initPanZoom(svgElement) {
            if (typeof svgPanZoom === 'undefined') {
                console.error("svg-pan-zoom library not loaded!");
                return;
            }

            if (panZoomInstance) {
                panZoomInstance.destroy();
                panZoomInstance = null;
            }
            
            if (!svgElement.id) svgElement.id = 'preview-svg';
            
            try {
                panZoomInstance = svgPanZoom(svgElement, {
                    zoomEnabled: true,
                    controlIconsEnabled: false,
                    fit: true, 
                    center: true,
                    minZoom: 0.1,
                    maxZoom: 10,
                    contain: true
                });
            } catch (e) {
                console.error("PanZoom Initialization Failed:", e);
            }
        }

        // --- Controls ---
        
        document.getElementById('prev').addEventListener('click', () => {
            if (pageNum <= 1) return;
            pageNum--;
            renderPage(pageNum);
            vscode.postMessage({command: 'goToPage', page: pageNum}); 
        });

        document.getElementById('next').addEventListener('click', () => {
             if (pageNum >= pdfDoc.numPages) return;
             pageNum++;
             renderPage(pageNum);
             vscode.postMessage({command: 'goToPage', page: pageNum});
        });

        document.getElementById('zoomIn').addEventListener('click', () => {
            if (panZoomInstance) panZoomInstance.zoomIn();
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
             if (panZoomInstance) panZoomInstance.zoomOut();
        });

        document.getElementById('zoomReset').addEventListener('click', () => {
             if (panZoomInstance) {
                 panZoomInstance.resetZoom();
                 panZoomInstance.resetPan();
             }
        });

        // --- Coloring ---
        
        pcr = Pickr.create({
            el: '#colorPicker',
            theme: 'nano',
            default: '#FFFFFF', // Paper Default
            swatches: ['#FFFFFF', '#000000', '#1EBFAF', '#525659', '#333333'],
            components: { preview: true, opacity: false, hue: true, interaction: { input: true, save: true } }
        }).on('save', (color) => {
            const hex = color.toHEXA().toString();
            // Apply to the paper-bg rect
            const bgRect = document.getElementById('paper-bg');
            if (bgRect) {
                bgRect.setAttribute('fill', hex);
            }
            pcr.hide();
        });
        
    </script>
</body>
</html>`;
}
