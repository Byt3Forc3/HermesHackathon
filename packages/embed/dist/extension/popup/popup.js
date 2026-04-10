import {
    createExtensionPlatform,
    setPlatform,
    getPlatform,
} from "../lib/hermes/platform.js";

setPlatform(createExtensionPlatform());

function initPopup() {
    const modules = [
        "dyslexia",
        "adhd",
        "autism",
        "color_blindness",
        "partially_blindness",
        "epilepsy",
        "simplify",
        "reader_mode",
        "text_to_speech",
    ];
    const checkboxes = Object.fromEntries(
        modules.map((id) => [id, document.getElementById(id)])
    );

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        const domain = new URL(tab.url).hostname;

        getPlatform().storage.local.get("site_" + domain, (data) => {
            const enabledModules = data["site_" + domain] || [];

            if (enabledModules.length > 0) {
                const active = enabledModules[0];
                if (checkboxes[active]) {
                    checkboxes[active].checked = true;
                }
            }
        });
    });

    modules.forEach((mod) => {
        if (checkboxes[mod]) {
            checkboxes[mod].addEventListener("change", () => {
                applySelection(mod, checkboxes[mod].checked);
            });
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPopup);
} else {
    initPopup();
}

function applySelection(selected, isChecked) {
    const modules = [
        "dyslexia",
        "adhd",
        "autism",
        "color_blindness",
        "partially_blindness",
        "epilepsy",
        "simplify",
        "reader_mode",
        "text_to_speech",
    ];

    if (isChecked) {
        modules.forEach((m) => {
            if (m !== selected) {
                const box = document.getElementById(m);
                if (box) {
                    box.checked = false;
                }
            }
        });
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        const domain = new URL(tab.url).hostname;
        const key = "site_" + domain;

        if (isChecked) {
            getPlatform().storage.local.set({ [key]: [selected] }, reloadActiveTab);
        } else {
            getPlatform().storage.local.set({ [key]: [] }, reloadActiveTab);
        }
    });
}

function reloadActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
    });
}

document.getElementById("openSimplifySettings").addEventListener("click", () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("affections/simplify/settings-popup.html"),
    });
});
