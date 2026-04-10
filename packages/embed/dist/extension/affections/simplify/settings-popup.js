import {
    createExtensionPlatform,
    setPlatform,
    getPlatform,
} from "../../lib/hermes/platform.js";

setPlatform(createExtensionPlatform());

class SimplifySettings {
    static async getSettings() {
        return new Promise((resolve) => {
            getPlatform().storage.sync.get(["simplifySettings"], (result) => {
                resolve(
                    result.simplifySettings || {
                        enabled: true,
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        textColor: "#333",
                        lineHeight: "1.5",
                        letterSpacing: "0",
                    }
                );
            });
        });
    }

    static async saveSettings(settings) {
        return new Promise((resolve) => {
            getPlatform().storage.sync.set({ simplifySettings: settings }, resolve);
        });
    }
}

function initializeRangeDisplays() {
    const lineHeightSlider = document.getElementById("lineHeight");
    const letterSpacingSlider = document.getElementById("letterSpacing");

    if (lineHeightSlider) {
        lineHeightSlider.addEventListener("input", function () {
            document.getElementById("lineHeightValue").textContent = this.value;
        });
    }

    if (letterSpacingSlider) {
        letterSpacingSlider.addEventListener("input", function () {
            document.getElementById("letterSpacingValue").textContent =
                this.value + "px";
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const settings = await SimplifySettings.getSettings();

    document.getElementById("fontFamily").value = settings.fontFamily;
    document.getElementById("textColor").value = settings.textColor;

    if (document.getElementById("lineHeight")) {
        document.getElementById("lineHeight").value = settings.lineHeight || "1.5";
        document.getElementById("lineHeightValue").textContent =
            settings.lineHeight || "1.5";
    }

    if (document.getElementById("letterSpacing")) {
        document.getElementById("letterSpacing").value = settings.letterSpacing || "0";
        document.getElementById("letterSpacingValue").textContent =
            (settings.letterSpacing || "0") + "px";
    }

    initializeRangeDisplays();

    document.getElementById("saveBtn").addEventListener("click", async () => {
        const newSettings = {
            enabled: settings.enabled,
            fontFamily: document.getElementById("fontFamily").value,
            textColor: document.getElementById("textColor").value,
            lineHeight: document.getElementById("lineHeight").value,
            letterSpacing: document.getElementById("letterSpacing").value,
        };

        await SimplifySettings.saveSettings(newSettings);
        alert("Settings saved! Refresh pages to see changes.");
        window.close();
    });
});
