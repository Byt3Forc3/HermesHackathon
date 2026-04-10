import { getPlatform } from "../../lib/hermes/platform.js";

class SimplifySettings {
    // We take the settings stored in chrome.storage.sync under 'simplifySettings'
    // or default values if not present.
    static async getSettings() {
        return new Promise((resolve) => {
            getPlatform().storage.sync.get(['simplifySettings'], (result) => {
                resolve(result.simplifySettings || {
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    textColor: '#333',
                    enabled: true
                });
            });
        });
    }
}

// Only run when the document is ready
export function apply() {
    // console.log("Simplify module activated");
    
    if (document.readyState === "complete") {
        runSimplify();
    } else {
        window.addEventListener("load", runSimplify);
    }
}

async function runSimplify() {
    // console.log("Applying familiar styling...");
    // Get the user stored settings
    const settings = await SimplifySettings.getSettings();
    
    if (!settings.enabled) {
        // console.log("Simplify is disabled");
        return;
    }
    
    // Use user settings to apply styles
    applyConsistentFonts(settings);
    applyBetterContrast(settings);
    applyComfortableSpacing(settings); // Updated to take settings
}

function applyConsistentFonts(settings) {
    const css = `
        /* Consistent fonts everywhere */
        * {
            font-family: ${settings.fontFamily} !important;
            letter-spacing: ${settings.letterSpacing}px !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

function applyComfortableSpacing(settings) {
    const css = `
        /* Comfortable line height and text spacing */
        body {
            line-height: ${settings.lineHeight} !important;
        }
        
        p {
            margin-bottom: 1.2em !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
            line-height: 1.3 !important;
            margin-top: 1.5em !important;
            margin-bottom: 0.8em !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    
    // console.log("Applied comfortable spacing");
}

function applyBetterContrast(settings) {
    const css = `
        /* Better text contrast and readability */
        body {
            color: ${settings.textColor} !important;
            background: white !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #000 !important;
        }
        
        a {
            color: #0066cc !important;
        }
        
        a:hover {
            opacity: 0.8 !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}