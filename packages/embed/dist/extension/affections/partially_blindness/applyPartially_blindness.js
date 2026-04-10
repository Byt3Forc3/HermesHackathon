// PARTIAL VISION MODE — View Only Inside Selected Area (IFRAME MODE)
// Partial Vision Mode: permite utilizatorului să selecteze o zonă a ecranului,
// iar pagina este reafișată într-un iFrame în acel dreptunghi, restul fiind estompat.


let partialVisionEnabled = false;
let maskOverlay = null;
let selectionBox = null;
let iframeContainer = null;


// 1. Start mode
function initPartialVisionMode() {
    if (!partialVisionEnabled) return;

    createDarkMask();
    enableDragSelection();
}


// 2. Mask the entire screen
function createDarkMask() {
    if (maskOverlay) return;

    maskOverlay = document.createElement("div");
    maskOverlay.id = "pv-mask";
    Object.assign(maskOverlay.style, {
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0.88)",
        zIndex: "999999998",
        pointerEvents: "none"
    });

    document.body.appendChild(maskOverlay);
}


// 3. Drag-to-select area
function enableDragSelection() {
    let startX = 0, startY = 0, endX = 0, endY = 0;

    document.addEventListener("mousedown", (e) => {
        if (!partialVisionEnabled) return;

        startX = e.clientX;
        startY = e.clientY;

        if (selectionBox) selectionBox.remove();
        if (iframeContainer) iframeContainer.remove();

        createSelectionBox();
    });

    document.addEventListener("mousemove", (e) => {
        if (!partialVisionEnabled || !selectionBox) return;

        endX = e.clientX;
        endY = e.clientY;

        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        const w = Math.abs(startX - endX);
        const h = Math.abs(startY - endY);

        updateSelectionBox(x, y, w, h);
    });

    document.addEventListener("mouseup", () => {
        if (!partialVisionEnabled || !selectionBox) return;

        const rect = selectionBox.getBoundingClientRect();
        createMiniBrowser(rect);

        selectionBox.remove();
        selectionBox = null;
    });
}


// 4. Create the visible selection rectangle
function createSelectionBox() {
    selectionBox = document.createElement("div");
    selectionBox.id = "pv-selection";

    Object.assign(selectionBox.style, {
        position: "fixed",
        border: "2px solid #00ffcc",
        background: "transparent",
        zIndex: "999999999",
        pointerEvents: "none",
        borderRadius: "12px"  
    });

    document.body.appendChild(selectionBox);
}

function updateSelectionBox(x, y, w, h) {
    selectionBox.style.left = x + "px";
    selectionBox.style.top = y + "px";
    selectionBox.style.width = w + "px";
    selectionBox.style.height = h + "px";
}


// 5. Create the MINIBROWSER (iframe) in the selected area
function createMiniBrowser(rect) {
    iframeContainer = document.createElement("div");
    iframeContainer.id = "pv-iframe-container";

    Object.assign(iframeContainer.style, {
        position: "fixed",
        left: rect.left + "px",
        top: rect.top + "px",
        width: rect.width + "px",
        height: rect.height + "px",
        overflow: "hidden",       
        zIndex: "999999999",
        borderRadius: "12px"     
    });

    const iframe = document.createElement("iframe");
    iframe.src = window.location.href;

    Object.assign(iframe.style, {
        width: "100%",
        height: "100%",
        border: "none",
        background: "white"
    });

    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);
}


// 6. Disable mode completely
function removePartialVisionMode() {
    partialVisionEnabled = false;

    if (maskOverlay) maskOverlay.remove();
    if (selectionBox) selectionBox.remove();
    if (iframeContainer) iframeContainer.remove();

    maskOverlay = null;
    selectionBox = null;
    iframeContainer = null;
}


// 7. Toggle button
function createPartialVisionToggle() {
    if (document.getElementById("partialvision-toggle")) return;

    const btn = document.createElement("button");
    btn.id = "partialvision-toggle";
    btn.innerText = "Partial Vision: OFF";

    Object.assign(btn.style, {
        position: "fixed",
        bottom: "60px",
        right: "20px",
        padding: "10px 15px",
        background: "#333",
        color: "white",
        border: "none",
        borderRadius: "8px",
        zIndex: "999999999999",
        cursor: "pointer"
    });

    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
        partialVisionEnabled = !partialVisionEnabled;

        if (partialVisionEnabled) {
            btn.innerText = "Partial Vision: ON";
            btn.style.background = "#008c8c";
            initPartialVisionMode();
        } else {
            btn.innerText = "Partial Vision: OFF";
            btn.style.background = "#333";
            removePartialVisionMode();
        }
    });
}

export function apply() {
    createPartialVisionToggle();
    console.log("Partial Vision (Iframe Mode) loaded.");
}