// dyslexia/applyDyslexia.js

let dyslexiaFilterActive = false;
let filterLevel = 0; // 0: Cream, 1: Off-White, 2: Soft Peach

const filterColors = [
    //"rgba(247, 240, 207, 0.45)", // Cream
    // "rgba(255, 255, 220, 0.4)", // Off-White
    "rgba(251, 205, 159, 0.59)"  // Soft Peach
];

const filterNames = ["ON", "Off-White", "Soft Peach"];

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
    // Create floating Focus button
    const focusBtn = document.createElement("button");
    focusBtn.id = "dyslexia-sentence-focus-btn";
    focusBtn.innerText = "🔍 Focus Sentence";
    focusBtn.style.cssText = `
        position: absolute;
        display: none;
        z-index: 2147483647;
        padding: 5px 10px;
        background: #001f41;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    document.documentElement.appendChild(focusBtn);

    // Show button when selecting text
    document.addEventListener("mouseup", () => {
        if (isSentenceFocusActive) return;

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            focusBtn.style.top = `${window.scrollY + rect.top - 40}px`;
            focusBtn.style.left = `${window.scrollX + rect.left}px`;
            focusBtn.style.display = "block";
        } else {
            focusBtn.style.display = "none";
        }
    });

    // Activate focus mode
    focusBtn.addEventListener("click", () => {
        if (isSentenceFocusActive) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const container = selection.anchorNode.parentElement.closest("p");
        if (!container) return;

        isSentenceFocusActive = true;

        const range = selection.getRangeAt(0);

        // Create focused wrapper
        const focusSpan = document.createElement("span");
        focusSpan.className = "dyslexia-focused-text";

        try {
            range.surroundContents(focusSpan);
        } catch (err) {
            // Prevent crash if selection partially overlaps complex nodes
            isSentenceFocusActive = false;
            return;
        }

        // Blur other text nodes in paragraph
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let textNode;
        while ((textNode = walker.nextNode())) {
            if (!textNode.textContent.trim()) continue;
            if (focusSpan.contains(textNode)) continue;

            const blurSpan = document.createElement("span");
            blurSpan.className = "dyslexia-blurred-text";

            textNode.parentNode.insertBefore(blurSpan, textNode);
            blurSpan.appendChild(textNode);
        }

        focusBtn.style.display = "none";
        selection.removeAllRanges();

        // Clear focus on click anywhere
        const clearFocus = () => {
            // Remove blur wrappers safely
            const blurSpans = container.querySelectorAll(".dyslexia-blurred-text");
            blurSpans.forEach(span => {
                while (span.firstChild) {
                    span.parentNode.insertBefore(span.firstChild, span);
                }
                span.remove();
            });

            // Unwrap focused span safely (preserves links!)
            while (focusSpan.firstChild) {
                focusSpan.parentNode.insertBefore(focusSpan.firstChild, focusSpan);
            }
            focusSpan.remove();

            isSentenceFocusActive = false;
            document.removeEventListener("click", clearFocus);
        };

        setTimeout(() => {
            document.addEventListener("click", clearFocus);
        }, 100);
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
}