import { getPlatform } from "./platform.js";

const MODULE_IDS = [
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

/** @type {Record<string, string[]>} */
const MODULE_MODIFICATIONS = {
    dyslexia: [
        "OpenDyslexic font with increased spacing and line height",
        "Reading ruler and paragraph focus",
        "Long paragraphs split for easier scanning",
    ],
    adhd: [
        "Navigation and footer de-emphasized",
        "Paragraph focus: one block at a time",
        "Optional table of contents for scanning",
    ],
    autism: [
        "Reduced visual noise and calmer palette",
        "Optional vertical layout and simplified chrome",
        "Short on-page summaries per paragraph (when enabled)",
    ],
    color_blindness: [
        "Color filters for protanopia, deuteranopia, or tritanopia",
        "Adjustable simulation and correction modes",
    ],
    partially_blindness: [
        "Selectable region shown in a high-contrast mini view",
        "Rest of the page dimmed to reduce clutter",
    ],
    epilepsy: [
        "GIFs and animations paused until interaction",
        "Videos require deliberate play; flashing reduced",
        "Aggressive motion and transitions toned down",
    ],
    simplify: [
        "Consistent fonts, spacing, and contrast from your settings",
        "Uses saved Simplify preferences (Customize in extension)",
    ],
    reader_mode: [
        "Main article extracted into a clean reading column",
        "Sidebars, ads, and chrome stripped from content",
    ],
    text_to_speech: [
        "Play, pause, and step through sentences",
        "Adjustable speed for the selected content",
    ],
};

let shellReady = false;

/**
 * @param {{ context?: 'extension' | 'embed' }} opts
 */
export function initSideShell(opts = {}) {
    if (shellReady) {
        return;
    }
    shellReady = true;
    const context = opts.context || "extension";

    const host = document.createElement("div");
    host.id = "hermes-brilliant-shell";
    document.documentElement.appendChild(host);

    const p = getPlatform();
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = p.resolveAsset("lib/hermes/sideShell.css");
    document.head.appendChild(cssLink);

    const panelCollapsed =
        typeof localStorage !== "undefined" &&
        localStorage.getItem("hermes_shell_collapsed") === "1";

    host.classList.toggle("hermes-panel-collapsed", panelCollapsed);

    host.innerHTML = `
        <button type="button" id="hermes-shell-handle" aria-expanded="${!panelCollapsed}">Brilliant Mind</button>
        <div id="hermes-shell-panel" role="region" aria-label="Brilliant Mind accessibility">
            <h3>Brilliant Mind</h3>
            <p class="hermes-sub">Choose one experience for this site. The page reloads when you change it.</p>
            <div class="hermes-section-title">Experience</div>
            <div class="hermes-module-list" id="hermes-module-list"></div>
            <div class="hermes-section-title">What this does</div>
            <ul class="hermes-mods-list" id="hermes-mods-list"></ul>
        </div>
    `;

    const listEl = host.querySelector("#hermes-module-list");
    const modsEl = host.querySelector("#hermes-mods-list");
    const handle = host.querySelector("#hermes-shell-handle");

    function addRadio(id, labelText) {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "hermes-module";
        input.value = id;
        input.id = `hermes-mod-${id || "off"}`;
        const span = document.createElement("span");
        span.textContent = labelText;
        label.appendChild(input);
        label.appendChild(span);
        listEl.appendChild(label);
    }

    addRadio("", "None (standard page)");
    MODULE_IDS.forEach((id) => {
        addRadio(id, humanLabel(id));
    });

    function humanLabel(id) {
        return id
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    }

    function updateModsList(moduleId) {
        modsEl.innerHTML = "";
        if (!moduleId) {
            const li = document.createElement("li");
            li.textContent =
                "No Brilliant Mind mode is active. Pick an experience above to adapt this site.";
            modsEl.appendChild(li);
            return;
        }
        const bullets = MODULE_MODIFICATIONS[moduleId] || [
            "Accessibility adjustments applied for this mode.",
        ];
        bullets.forEach((t) => {
            const li = document.createElement("li");
            li.textContent = t;
            modsEl.appendChild(li);
        });
    }

    function readSelectedModule(cb) {
        const domain = location.hostname;
        const key = "site_" + domain;
        p.storage.local.get(key, (data) => {
            const enabled = data[key] || [];
            const active = enabled[0] || null;
            cb(active);
        });
    }

    readSelectedModule((active) => {
        const off = host.querySelector("#hermes-mod-off");
        if (off) {
            off.checked = !active;
        }
        MODULE_IDS.forEach((id) => {
            const input = host.querySelector(`#hermes-mod-${id}`);
            if (input) {
                input.checked = active === id;
            }
        });
        updateModsList(active);
    });

    listEl.addEventListener("change", (e) => {
        const t = e.target;
        if (t && t.name === "hermes-module" && t.checked) {
            const mod = t.value;
            updateModsList(mod);
            const domain = location.hostname;
            const key = "site_" + domain;
            const value = mod ? [mod] : [];
            p.storage.local.set({ [key]: value }, () => {
                if (context === "extension") {
                    chrome.runtime.sendMessage({ type: "reload_active_tab" });
                } else {
                    location.reload();
                }
            });
        }
    });

    handle.addEventListener("click", () => {
        const collapsed = !host.classList.contains("hermes-panel-collapsed");
        host.classList.toggle("hermes-panel-collapsed", collapsed);
        handle.setAttribute("aria-expanded", String(!collapsed));
        try {
            localStorage.setItem("hermes_shell_collapsed", collapsed ? "1" : "0");
        } catch {
            /* ignore */
        }
    });
}
