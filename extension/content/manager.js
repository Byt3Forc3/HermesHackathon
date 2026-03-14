function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const domain = location.hostname;
chrome.storage.local.get("site_" + domain, data => {
    const enabledModules = data["site_" + domain] || [];
    if (!enabledModules) return;

    enabledModules.forEach(mod => {
        import(chrome.runtime.getURL(`affections/${mod}/apply${capitalize(mod)}.js`))
            .then(module => module.apply())
            .catch(err => console.error("Error loading module:", mod, err));
    });
});

// Embedded Brilliant Mind panel (in-page, top-right) — no popup window
const PANEL_ID = "brilliant-mind-embedded-panel";
const PANEL_WIDTH = 420;
const PANEL_HEIGHT = 100;
const PANEL_RADIUS = "28px";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type !== "togglePanel") return;
    const existing = document.getElementById(PANEL_ID);
    if (existing) {
        existing.remove();
        sendResponse({ open: false });
        return;
    }
    const tabId = msg.tabId;

    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.style.cssText = [
        "position:fixed",
        "top:16px",
        "right:16px",
        "width:" + PANEL_WIDTH + "px",
        "height:" + PANEL_HEIGHT + "px",
        "border-radius:" + PANEL_RADIUS,
        "overflow:hidden",
        "box-shadow:0 8px 32px rgba(0,0,0,0.2)",
        "z-index:2147483647",
        "font-family:system-ui,sans-serif",
        "background:#e7dcd6"
    ].join(";");

    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×";
    closeBtn.style.cssText = [
        "position:absolute",
        "top:8px",
        "right:8px",
        "width:28px",
        "height:28px",
        "border:none",
        "border-radius:50%",
        "background:rgba(44,37,34,0.12)",
        "color:#2c2522",
        "font-size:20px",
        "line-height:1",
        "cursor:pointer",
        "z-index:10",
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "padding:0"
    ].join(";");
    closeBtn.addEventListener("click", () => panel.remove());

    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("popup/popup.html" + (tabId != null ? "?tabId=" + tabId : ""));
    iframe.style.cssText = "width:100%;height:100%;border:none;display:block;border-radius:" + PANEL_RADIUS;

    panel.appendChild(closeBtn);
    panel.appendChild(iframe);
    document.documentElement.appendChild(panel);
    sendResponse({ open: true });
});
