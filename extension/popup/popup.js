function getTargetTabId() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("tabId");
    return id ? parseInt(id, 10) : null;
}

function withTargetTab(cb) {
    const tabId = getTargetTabId();
    if (tabId != null) {
        chrome.tabs.get(tabId, (tab) => {
            if (!chrome.runtime.lastError && tab) cb(tab);
        });
    } else {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (tab) cb(tab);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const modules = ["dyslexia", "adhd", "autism", "color_blindness", "partially_blindness", "epilepsy", "simplify", "reader_mode", "text_to_speech"];
    const checkboxes = Object.fromEntries(
        modules.map(id => [id, document.getElementById(id)])
    );

    // Load saved preference for THIS SITE ONLY (use tab from URL when opened as window)
    withTargetTab((tab) => {
        try {
            const domain = new URL(tab.url).hostname;
            chrome.storage.local.get("site_" + domain, data => {
                const enabledModules = data["site_" + domain] || [];
                if (enabledModules.length > 0) {
                    const active = enabledModules[0];
                    if (checkboxes[active]) checkboxes[active].checked = true;
                }
            });
        } catch (_) {}
    });

    // Add listeners for matrix checkboxes
    modules.forEach(mod => {
        if (checkboxes[mod]) {
            checkboxes[mod].addEventListener("change", () => {
                applySelection(mod, checkboxes[mod].checked);
            });
        }
    });

    // Customize button (opens settings page in new tab — no dropdown)
    const customizeBtn = document.getElementById("openSimplifySettings");
    if (customizeBtn) {
        customizeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            chrome.tabs.create({
                url: chrome.runtime.getURL("affections/simplify/settings-popup.html")
            });
        });
    }

    // Close panel when embedded in page (tell parent to remove panel)
    const closeBtn = document.getElementById("closePanel");
    if (closeBtn && window !== window.top) {
        closeBtn.addEventListener("click", () => {
            window.parent.postMessage({ type: "brilliant-mind-close" }, "*");
        });
    } else if (closeBtn) {
        closeBtn.style.display = "none";
    }
});

function applySelection(selected, isChecked) {
    const modules = ["dyslexia", "adhd", "autism", "color_blindness", "partially_blindness", "epilepsy", "simplify", "reader_mode", "text_to_speech"];

    // Turn off all other checkboxes when selecting one
    if (isChecked) {
        modules.forEach(m => {
            if (m !== selected) {
                const box = document.getElementById(m);
                if (box) box.checked = false;
            }
        });
    }

    withTargetTab((tab) => {
        try {
            const domain = new URL(tab.url).hostname;
            const key = "site_" + domain;
            const tabId = tab.id;
            const storagePayload = isChecked ? { [key]: [selected] } : { [key]: [] };
            chrome.storage.local.set(
                {
                    ...storagePayload,
                    reopenPanelAfterReload: true
                },
                () => reloadTab(tabId)
            );
        } catch (_) {}
    });
}

function reloadTab(tabId) {
    if (tabId != null) chrome.tabs.reload(tabId);
}

