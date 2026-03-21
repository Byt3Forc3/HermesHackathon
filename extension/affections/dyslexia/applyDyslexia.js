
let dyslexiaFilterActive = false;
let filterLevel = 0; // 0: Cream, 1: Off-White, 2: Soft Peach

const filterColors = [
     "rgba(197, 184, 149, 0.7)", // Off-White
];

const filterNames = ["ON"];  //"Soft-Peach", "Off-White"];

let closeListenerRegistered = false;

function attachBelowBrilliantPanel(el, fullWidth = true) {
    let attempts = 0;

    function tryPosition() {
        const panel = document.getElementById("brilliant-mind-embedded-panel");
        if (!panel) return false;

        const rect = panel.getBoundingClientRect();
        const inset = 10;
        el.style.left = rect.left + inset + "px";
        el.style.top = rect.bottom + 8 + "px";
        if (fullWidth) {
            el.style.width = Math.max(rect.width - inset * 2, 0) + "px";
            el.style.textAlign = "center";
        }

        requestAnimationFrame(() => {
            el.style.transform = "translateY(0)";
            el.style.opacity = "1";
        });

        return true;
    }

    if (tryPosition()) return;

    const id = setInterval(() => {
        attempts++;
        if (tryPosition() || attempts > 30) clearInterval(id);
    }, 100);
}

function updateFilterUI() {
    const filter = document.getElementById("dyslexia-calming-filter");
    const btn = document.getElementById("dyslexia-toggle-btn");
    
    if (!filter || !btn) return;

    if (dyslexiaFilterActive) {
        filter.style.display = "block";
        filter.style.backgroundColor = filterColors[filterLevel];

        btn.innerText = `Filter: ${filterNames[filterLevel]}`;
        btn.style.background = "rgba(34,30,30,0.14)"; // active highlight
        btn.style.borderColor = "rgba(44,37,34,0.6)";
        btn.style.boxShadow = "0 0 0 1px rgba(34,30,30,0.4), 0 3px 10px rgba(34,30,30,0.3)";
    } else {
        filter.style.display = "none";
        btn.innerText = "Filter: OFF";
        btn.style.background = "#e7dcd6";
        btn.style.borderColor = "rgba(44,37,34,0.24)";
        btn.style.boxShadow = "0 1px 3px rgba(34,30,30,0.16)";
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
        padding: 9px 16px !important;
        border-radius: 999px !important;
        border: 1px solid rgba(44,37,34,0.24) !important;
        background: #e7dcd6 !important;
        color: #2c2522 !important;
        cursor: pointer !important;
        z-index: 2147483647 !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif !important;
        box-shadow: 0 1px 3px rgba(34,30,30,0.16) !important;
        transform: translateY(16px);
        opacity: 0;
        transition: transform 0.2s ease-out, opacity 0.2s ease-out;
    `;

    document.documentElement.appendChild(btn);
    attachBelowBrilliantPanel(btn, true);

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
        
        // Identificăm toate paragrafele/listele atinse de selecție
        const containers = [];
        let startContainer = range.startContainer.parentElement.closest("p, li, h1, h2, h3, blockquote");
        let endContainer = range.endContainer.parentElement.closest("p, li, h1, h2, h3, blockquote");

        if (!startContainer || !endContainer) {
            isSentenceFocusActive = false;
            return;
        }

        // Găsim toate elementele de același tip între început și sfârșit
        let current = startContainer;
        while (current && current !== endContainer.nextElementSibling) {
            if (current.matches("p, li, h1, h2, h3, blockquote")) {
                containers.push(current);
            }
            current = current.nextElementSibling;
        }

        const activeFocusSpans = [];

        containers.forEach(container => {
            // Creăm un range temporar doar pentru bucata din acest container
            const tempRange = document.createRange();
            
            if (container === startContainer && container === endContainer) {
                // Selecția este toată în același element
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

                // Aplicăm Blur pe restul textului din acest container specific
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

function registerCloseListener() {
    if (closeListenerRegistered) return;
    closeListenerRegistered = true;

    window.addEventListener("message", (e) => {
        if (!e.data || e.data.type !== "brilliant-mind-close") return;

        const btn = document.getElementById("dyslexia-toggle-btn");
        const filter = document.getElementById("dyslexia-calming-filter");
        if (btn) btn.remove();
        if (filter) filter.style.display = "none";
        dyslexiaFilterActive = false;
    });
}


export function apply() {
    document.documentElement.classList.add("dyslexia-mode");

    if (!document.getElementById("dyslexia-dynamic-style")) {
        const style = document.createElement("style");
        style.id = "dyslexia-dynamic-style";
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Lexend&display=swap');

            html.dyslexia-mode body,
            html.dyslexia-mode p {
                font-family: 'Lexend', sans-serif !important;
                font-size: 18px !important;
                word-spacing: 0.3em !important;
                line-height: 1.9 !important;
                color: #2c2c2c !important;
            }

            html.dyslexia-mode a {
                color: #002247 !important;
                text-decoration: none !important;
                font-weight: bold !important;
                font-family: 'Lexend', sans-serif !important;
            }

            html.dyslexia-mode i,
            html.dyslexia-mode em {
                font-style: normal !important;
                font-weight: 700 !important;
            }

            /* Focus system styles */
            .dyslexia-blurred-text {
                filter: blur(4px) opacity(0.5);
                transition: filter 0.3s ease;
            }

            .dyslexia-focused-text {
                background: rgba(255, 232, 119, 0.4);
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
    registerCloseListener();
}