import { OPENROUTER_KEY } from "./api/key.js";

// Embed UI in the page — inject panel from background so it works on every tab
function injectPanel(popupUrl, panelId, panelWidth, panelRadius) {
    const existing = document.getElementById(panelId);
    if (existing) {
        existing.remove();
        return;
    }
    const panel = document.createElement("div");
    panel.id = panelId;
    panel.style.cssText = [
        "position:fixed",
        "top:16px",
        "right:16px",
        "width:" + panelWidth + "px",
        "max-height:230px",
        "border-radius:" + panelRadius,
        "overflow:hidden",
        "box-shadow:0 8px 32px rgba(0,0,0,0.2)",
        "z-index:2147483647",
        "font-family:system-ui,sans-serif",
        "background:#e7dcd6"
    ].join(";");

    const iframe = document.createElement("iframe");
    iframe.src = popupUrl;
    iframe.style.cssText = "width:100%;height:230px;border:none;display:block;border-radius:" + panelRadius;
    panel.appendChild(iframe);

    function onMessage(e) {
        if (e.data && e.data.type === "brilliant-mind-close" && e.source === iframe.contentWindow) {
            panel.remove();
            window.removeEventListener("message", onMessage);
        }
    }
    window.addEventListener("message", onMessage);
    document.documentElement.appendChild(panel);
}

async function openPanelForTab(tabId) {
    if (!tabId) return;
    const popupUrl = chrome.runtime.getURL("popup/popup.html?tabId=" + tabId);
    try {
        await chrome.scripting.executeScript({
            target: { tabId },
            func: injectPanel,
            args: [popupUrl, "brilliant-mind-embedded-panel", 420, "28px"]
        });
    } catch (_) {}
}

chrome.action.onClicked.addListener(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    await openPanelForTab(tab.id);
});

// Reopen panel after page reload when user just selected an option
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.status !== "complete") return;
    const { reopenPanelAfterReload } = await chrome.storage.local.get("reopenPanelAfterReload");
    if (reopenPanelAfterReload) {
        await chrome.storage.local.remove("reopenPanelAfterReload");
        await openPanelForTab(tabId);
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "ai_request") {
        handleAIRequest(msg)
            .then(result => sendResponse({ success: true, result }))
            .catch(err => sendResponse({ success: false, error: err.toString() }));
        return true; // keep channel open for async
    }
});

async function handleAIRequest({ action, text }) {
    const apiKey = OPENROUTER_KEY;

    const prompt = getPrompt(action, text);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini",      // OpenRouter uses provider/model format
            messages: [
                { role: "user", content: prompt }
            ]
        })
    });

    const data = await res.json();

    // safety: if error occurs
    if (!data || !data.choices || !data.choices[0]) {
        return "AI Error: Invalid response.";
    }

    return data.choices[0].message.content;
}

function getPrompt(action, text) {
    switch (action) {
        case "summarize":
            return `Summarize the following text in 5 short bullet points:\n\n${text}`;
        case "highlight":
            return `Extract the most important key ideas from this text:\n\n${text}`;
        case "simplify":
            return `Rewrite this text in simpler, easier-to-understand language:\n\n${text}`;
        case "explain":
            return `Explain this text as if teaching a beginner:\n\n${text}`;
        case "flashcards":
            return `Create 10 flashcards (Q&A format) based on this text:\n\n${text}`;
        default:
            return text;
    }
}
