import { getPlatform } from "../lib/hermes/platform.js";

export function initAIToolbar() {
    injectAiToolbarStyles();
    createToolbarUI();
    attachToolbarEvents();
}

export function injectAiToolbarStyles() {
    const p = getPlatform();
    const paths = ["ai/aiLoading.css", "ai/aiToolbar.css", "ai/aiOutput.css"];
    for (const path of paths) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = p.resolveAsset(path);
        document.head.appendChild(link);
    }
}

function createToolbarUI() {
    const toolbar = document.createElement("div");
    toolbar.id = "ai-toolbar";
    toolbar.innerHTML = `
        <div id="ai-toolbar-header">
            <span>AI Assistant</span>
        </div>
        <div id="ai-toolbar-body">
            <button class="ai-action" data-action="summarize">Summarize</button>
            <button class="ai-action" data-action="highlight">Highlight</button>
            <button class="ai-action" data-action="simplify">Simplify</button>
            <button class="ai-action" data-action="explain">Explain</button>
            <button class="ai-action" data-action="flashcards">Flashcards</button>
        </div>
    `;

    const handle = document.createElement("button");
    handle.id = "ai-toolbar-handle";
    handle.textContent = "⮜";

    document.body.appendChild(toolbar);
    document.body.appendChild(handle);
}

function attachToolbarEvents() {
    const toolbar = document.getElementById("ai-toolbar");
    const handle = document.getElementById("ai-toolbar-handle");

    handle.addEventListener("click", () => {
        toolbar.classList.toggle("collapsed");
        handle.classList.toggle("collapsed");
        handle.textContent = toolbar.classList.contains("collapsed") ? "⮞" : "⮜";
    });

    document.querySelectorAll("#ai-toolbar .ai-action").forEach((btn) => {
        btn.addEventListener("click", () => {
            const action = btn.dataset.action;
            runAIAction(action);
        });
    });
}

export async function runAIAction(action) {
    const article = document.getElementById("reader-container");
    if (!article) {
        alert("Reader Mode must be enabled for AI to work.");
        return;
    }

    const text = article.innerText;

    const buttons = document.querySelectorAll("#ai-toolbar .ai-action");
    buttons.forEach((b) => {
        b.disabled = true;
        b.style.opacity = "0.5";
        b.style.cursor = "not-allowed";
    });

    showLoadingPanel();

    try {
        const result = await getPlatform().requestAI({ action, text });
        showAIResult(result);
    } catch (e) {
        showAIResult("⚠️ AI Error: " + (e && e.message ? e.message : String(e)));
    } finally {
        buttons.forEach((b) => {
            b.disabled = false;
            b.style.opacity = "1";
            b.style.cursor = "pointer";
        });
    }
}

export function showAIResult(text) {
    let panel = document.getElementById("ai-output-panel");

    if (!panel) {
        panel = document.createElement("div");
        panel.id = "ai-output-panel";
        document.body.appendChild(panel);
    }

    panel.innerHTML = `
        <h3>AI Result</h3>
        <div>${String(text).replace(/\n/g, "<br>")}</div>
    `;
}

export function showLoadingPanel() {
    let panel = document.getElementById("ai-output-panel");

    if (!panel) {
        panel = document.createElement("div");
        panel.id = "ai-output-panel";
        document.body.appendChild(panel);
    }

    panel.innerHTML = `
        <h3>AI Result</h3>
        <div class="ai-loading">
            <div class="ai-spinner"></div>
            <span>Processing your request...</span>
        </div>
    `;
}
