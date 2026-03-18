
let dyslexiaFilterActive = false;
let filterLevel = 0; // 0: Cream, 1: Off-White, 2: Soft Peach

const filterColors = [
     "rgba(197, 184, 149, 0.7)", // Off-White
];

const filterNames = ["ON"];  //"Soft-Peach", "Off-White"];

function updateFilterUI() {
    const filter = document.getElementById("dyslexia-calming-filter");
    const btn = document.getElementById("dyslexia-toggle-btn");
    
    if (!filter || !btn) return;

    if (dyslexiaFilterActive) {
        filter.style.display = "block";
        filter.style.backgroundColor = filterColors[filterLevel];

        btn.innerText = `Filter: ${filterNames[filterLevel]}`;
        btn.style.background = "#2a8f2a"; // Green for ON
    } else {
        filter.style.display = "none";
        btn.innerText = "Filter: OFF";
        btn.style.background = "#444"; // Grey for OFF
    }
}

function initDyslexiaFilter() {
    if (document.getElementById("dyslexia-calming-filter")) return;

    const filter = document.createElement("div");
    filter.id = "dyslexia-calming-filter";
    

    filter.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        pointer-events: none !important;
        z-index: 2147483647 !important;
        mix-blend-mode: multiply !important;
        display: none;
    `;
    
    document.documentElement.appendChild(filter);
}

function createDyslexiaToggle() {
    if (document.getElementById("dyslexia-toggle-btn")) return;

    const btn = document.createElement("button");
    btn.id = "dyslexia-toggle-btn";
    btn.innerText = "Dyslexia Filter: OFF";
    
    btn.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        padding: 10px 14px !important;
        border-radius: 8px !important;
        border: none !important;
        background: #444 !important;
        color: white !important;
        cursor: pointer !important;
        z-index: 2147483647 !important;
        font-family: sans-serif !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
    `;

    document.documentElement.appendChild(btn);

    btn.addEventListener("click", () => {
        if (!dyslexiaFilterActive) {
            dyslexiaFilterActive = true;
            filterLevel = 0;
        } else {
            filterLevel++;
            if (filterLevel >= filterColors.length) {
                dyslexiaFilterActive = false;
            }
        }
        updateFilterUI();
    });
}

function splitLongParagraphs() {
    const paragraphs = document.querySelectorAll('html.dyslexia-mode p');
    paragraphs.forEach(p => {
        if (p.dataset.splitProcessed === "true" || p.innerText.length < 250) return;
        const text = p.innerText;
        const sentences = text.match(/[^.!?]+[.!?]+/g);
        if (sentences && sentences.length > 3) {
            p.innerHTML = ''; 
            p.dataset.splitProcessed = "true";
            for (let i = 0; i < sentences.length; i += 2) {
                const chunk = sentences.slice(i, i + 2).join(' ');
                const newP = document.createElement('span');
                newP.innerText = chunk;
                newP.style.display = "block";
                newP.style.marginBottom = "1.8em";
                p.appendChild(newP);
            }
        }
    });
}



let isSentenceFocusActive = false;


function initSentenceFocus() {
    let focusBtn = document.getElementById("dyslexia-sentence-focus-btn");
    if (!focusBtn) {
        focusBtn = document.createElement("button");
        focusBtn.id = "dyslexia-sentence-focus-btn";
        focusBtn.innerText = "🔍 Focus";
        focusBtn.style.cssText = `
            position: absolute;
            display: none;
            z-index: 2147483647;
            padding: 6px 12px;
            background: #001f41;
            color: white;
            border: 2px solid #ffe877;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            pointer-events: auto;
        `;
        document.documentElement.appendChild(focusBtn);
    }

    document.addEventListener("mouseup", () => {
        if (isSentenceFocusActive) return;
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            focusBtn.style.top = `${window.scrollY + rect.top - 45}px`;
            focusBtn.style.left = `${window.scrollX + rect.left}px`;
            focusBtn.style.display = "block";
        } else {
            focusBtn.style.display = "none";
        }
    });

    focusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isSentenceFocusActive) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        isSentenceFocusActive = true;
        focusBtn.style.display = "none";

        const range = selection.getRangeAt(0);
        
        // Identofy all paragraphs included in the selection
        const containers = [];
        let startContainer = range.startContainer.parentElement.closest("p, li, h1, h2, h3, blockquote");
        let endContainer = range.endContainer.parentElement.closest("p, li, h1, h2, h3, blockquote");

        if (!startContainer || !endContainer) {
            isSentenceFocusActive = false;
            return;
        }

        // Find all elems between start and end
        let current = startContainer;
        while (current && current !== endContainer.nextElementSibling) {
            if (current.matches("p, li, h1, h2, h3, blockquote")) {
                containers.push(current);
            }
            current = current.nextElementSibling;
        }

        const activeFocusSpans = [];

        containers.forEach(container => {
            //un range temporar doar pentru bucata din acest container
            const tempRange = document.createRange();
            
            if (container === startContainer && container === endContainer) {
                // Selection is within the same container
                tempRange.setStart(range.startContainer, range.startOffset);
                tempRange.setEnd(range.endContainer, range.endOffset);
            } else if (container === startContainer) {
                // Suntem la început (de la cursor până la finalul paragrafului)
                tempRange.setStart(range.startContainer, range.startOffset);
                tempRange.setEndAfter(container.lastChild);
            } else if (container === endContainer) {
                // Suntem la final (de la începutul paragrafului până la cursor)
                tempRange.setStartBefore(container.firstChild);
                tempRange.setEnd(range.endContainer, range.endOffset);
            } else {
                // Paragraf complet selectat între cele două
                tempRange.selectNodeContents(container);
            }

            const focusSpan = document.createElement("span");
            focusSpan.className = "dyslexia-focused-text";
            
            try {
                focusSpan.appendChild(tempRange.extractContents());
                tempRange.insertNode(focusSpan);
                activeFocusSpans.push({ span: focusSpan, container: container });

                // Apply blur to all other text nodes in the container that are not part of the focus span
                const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
                let textNode;
                const nodesToWrap = [];
                while ((textNode = walker.nextNode())) {
                    if (!textNode.textContent.trim() || focusSpan.contains(textNode)) continue;
                    nodesToWrap.push(textNode);
                }

                nodesToWrap.forEach(node => {
                    const blurSpan = document.createElement("span");
                    blurSpan.className = "dyslexia-blurred-text";
                    if (node.parentNode) {
                        node.parentNode.insertBefore(blurSpan, node);
                        blurSpan.appendChild(node);
                    }
                });
            } catch (err) {
                console.error("Eroare la procesarea containerului:", err);
            }
        });

        selection.removeAllRanges();

        const clearFocus = () => {
            containers.forEach(container => {
                // Curățăm blur-ul
                const blurSpans = container.querySelectorAll(".dyslexia-blurred-text");
                blurSpans.forEach(span => {
                    while (span.firstChild) span.parentNode.insertBefore(span.firstChild, span);
                    span.remove();
                });

                // Curățăm focus-ul
                const focusSpans = container.querySelectorAll(".dyslexia-focused-text");
                focusSpans.forEach(fSpan => {
                    while (fSpan.firstChild) fSpan.parentNode.insertBefore(fSpan.firstChild, fSpan);
                    fSpan.remove();
                });

                container.normalize();
            });

            isSentenceFocusActive = false;
            document.removeEventListener("click", clearFocus);
        };

        setTimeout(() => document.addEventListener("click", clearFocus), 200);
    });
}


export function apply() {
    document.documentElement.classList.add("dyslexia-mode");

    const fontUrl = chrome.runtime.getURL("affections/dyslexia/fonts/OpenDyslexic-Regular.otf");
    if (!document.getElementById("dyslexia-dynamic-style")) {
        const style = document.createElement("style");
        style.id = "dyslexia-dynamic-style";
        style.textContent = `

            @font-face {
                font-family: 'OpenDyslexic';
                src: url('${fontUrl}') format('opentype');
            }
            @import url('https://fonts.googleapis.com/css2?family=Lexend&display=swap');



            html.dyslexia-mode body,
            html.dyslexia-mode p,
            html.dyslexia-mode span,
            html.dyslexia-mode li,
            html.dyslexia-mode h1, html.dyslexia-mode h2, html.dyslexia-mode h3,
            html.dyslexia-mode div {
                font-family: 'OpenDyslexic', 'Lexend', sans-serif !important;
                font-size: 18px !important;
                word-spacing: 0.3em !important;
                line-height: 1.9 !important;
                /* color: #000000 !important; */
            }

            html.dyslexia-mode a {
                /* color: #002247 !important; */
                text-decoration: none !important;
                font-weight: bold !important;
                font-family: 'OpenDyslexic', 'Lexend', sans-serif !important;
            }


            /* Focus system styles */
            .dyslexia-blurred-text {
                filter: blur(4px) opacity(0.5);
                transition: filter 0.3s ease;
            }

            .dyslexia-focused-text {
                background: rgba(255, 232, 119, 0.19);
                padding: 2px 0;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
    }

    initDyslexiaFilter();
    createDyslexiaToggle();
    splitLongParagraphs();
    initSentenceFocus();
}