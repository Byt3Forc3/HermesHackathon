import { getPlatform } from "../../lib/hermes/platform.js";

export function apply() {
    console.log("Reader Mode activated");

    if (document.readyState === "complete") {
        runReaderMode();
    } else {
        window.addEventListener("load", runReaderMode);
    }
}

function runReaderMode() {
    console.log("Extracting clean text...");

    const mainContent = extractMainContent();
    const cleanTextHTML = cleanHTML(mainContent.innerHTML);

    document.body.innerHTML = "";
    const container = document.createElement("div");
    container.id = "reader-container";
    container.innerHTML = cleanTextHTML;

    document.body.appendChild(container);
    injectReaderCSS();
}

/* ---------------------------------------
   Try to detect the main content
---------------------------------------- */
function extractMainContent() {
    const selectors = [
        "#mw-content-text",  // Wikipedia
        "#content",
        "#main",
        "article",
        "[role='main']",
        ".content",
        ".main"
    ];

    for (const sel of selectors) {
        const found = document.querySelector(sel);
        if (found) return found.cloneNode(true);
    }
    return document.body.cloneNode(true);
}

/* ---------------------------------------
   Clean HTML of: links, images, refs, nav,
   sidebars, tables, lists, footnotes
---------------------------------------- */
function cleanHTML(html) {
    let div = document.createElement("div");
    div.innerHTML = html;

    // Remove images, tables, sidebars, footnotes
    div.querySelectorAll("img, table, figure, nav, footer, aside, header, form").forEach(e => e.remove());

    // Remove links (replace with text)
    div.querySelectorAll("a").forEach(a => {
        const text = document.createTextNode(a.textContent);
        a.replaceWith(text);
    });

    // Remove brackets like [1], [2], [citation needed]
    div.innerHTML = div.innerHTML.replace(/\[[^\]]*?\]/g, "");

    // Remove empty divs/spans
    div.querySelectorAll("div, span").forEach(el => {
        if (!el.textContent.trim()) el.remove();
    });

    return div.innerHTML;
}

/* ---------------------------------------
   Inject minimal clean reader-mode CSS
---------------------------------------- */
function injectReaderCSS() {
    fetch(getPlatform().resolveAsset("affections/reader_mode/styles.css"))
        .then(r => r.text())
        .then(css => {
            const style = document.createElement("style");
            style.textContent = css;
            document.head.appendChild(style);
        });
}
