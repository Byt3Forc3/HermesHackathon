// Global variables
let colorBlindnessEnabled = false;  // Flag: whether color blindness mode is active
let colorBlindnessType = null; // null | "protanopia" | "deuteranopia" | "tritanopia"

let closeListenerRegistered = false;

function attachBelowBrilliantPanel(el, fullWidth = true) {
    let attempts = 0;

    function tryPosition() {
        const panel = document.getElementById("brilliant-mind-embedded-panel");
        if (!panel) return false;

        const rect = panel.getBoundingClientRect();
        const inset = 10;
        el.style.left = rect.left + inset + "px";
        el.style.top = rect.bottom + 8 + "px";
        if (fullWidth) {
            el.style.width = Math.max(rect.width - inset * 2, 0) + "px";
        }

        requestAnimationFrame(() => {
            el.style.transform = "translateY(0)";
            el.style.opacity = "1";
        });

        return true;
    }

    if (tryPosition()) return;

    const id = setInterval(() => {
        attempts++;
        if (tryPosition() || attempts > 30) clearInterval(id);
    }, 100);
}


// SVG Filters for color blindness
// These filters are used to simulate different types of color blindness
const svgFilter = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;" id="color-blindness-filters">
  <filter id="protanopia-filter">
    <feColorMatrix type="matrix" values="0.567,0.433,0,0,0
                                         0.558,0.442,0,0,0
                                         0,0.242,0.758,0,0
                                         0,0,0,1,0"/>
  </filter>
  <filter id="deuteranopia-filter">
    <feColorMatrix type="matrix" values="0.625,0.375,0,0,0
                                         0.7,0.3,0,0,0
                                         0,0.3,0.7,0,0
                                         0,0,0,1,0"/>
  </filter>
  <filter id="tritanopia-filter">
    <feColorMatrix type="matrix" values="0.95,0.05,0,0,0
                                         0,0.433,0.567,0,0
                                         0,0.475,0.525,0,0
                                         0,0,0,1,0"/>
  </filter>
  <filter id="none-filter">
    <feColorMatrix type="matrix" values="1,0,0,0,0
                                         0,1,0,0,0
                                         0,0,1,0,0
                                         0,0,0,1,0"/>
  </filter>
</svg>`;

// Insert SVG filters into the DOM if not already present
if (!document.getElementById('color-blindness-filters')) {
    document.body.insertAdjacentHTML('beforeend', svgFilter);
}

//main initialization function
function initColorBlindnessMode() {
    if (!colorBlindnessEnabled || !colorBlindnessType) return;

    applyFilterByType(colorBlindnessType);

    // Observe DOM changes to reapply filter on new elements
    new MutationObserver(() => {
        if (!colorBlindnessEnabled) return;
        applyFilterByType(colorBlindnessType);
    }).observe(document.body, { childList: true, subtree: true });
}


// Apply filter to the entire document
function applyFilterByType(type) {
    let filterId = 'none-filter';
    if (type === 'protanopia') filterId = 'protanopia-filter';
    if (type === 'deuteranopia') filterId = 'deuteranopia-filter';
    if (type === 'tritanopia') filterId = 'tritanopia-filter';

    // Apply the selected filter to the root element
    document.documentElement.style.filter = `url(#${filterId})`;
}

// Remove color blindness filter
function removeColorBlindnessMode() {
    colorBlindnessType = null;
    document.documentElement.style.filter = 'none';
}

// UI: Menu to select color blindness type
function createColorBlindnessMenu() {
    if (document.getElementById("colorblind-menu")) return;

    const menu = document.createElement("div");
    menu.id = "colorblind-menu";

    menu.style = `
        position: fixed;
        padding: 10px 12px 12px;
        background: #e7dcd6;
        border-radius: 20px;
        color: #2c2522;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        z-index: 999999999999;
        transform: translateY(16px);
        opacity: 0;
        transition: transform 0.2s ease-out, opacity 0.2s ease-out;
    `;

    // Menu content: buttons for each type of color blindness
    menu.innerHTML = `
        <div style="font-size:13px; margin:0 4px 4px; font-weight:600; text-align:center;">
            Color Blindness Mode
        </div>

        <button data-type="protanopia" class="cb-btn">Protanopia</button>
        <button data-type="deuteranopia" class="cb-btn">Deuteranopia</button>
        <button data-type="tritanopia" class="cb-btn">Tritanopia</button>
    `;

    document.body.appendChild(menu);
    attachBelowBrilliantPanel(menu, true);

    const baseStyle = `
        width: 100%;
        padding: 7px 10px;
        margin-bottom: 6px;
        background: rgba(255,255,255,0.8);
        color: #2c2522;
        border: 1px solid rgba(44,37,34,0.24);
        border-radius: 999px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        box-shadow: 0 1px 3px rgba(34,30,30,0.16);
        transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    `;

    const setActiveStyles = (activeBtn) => {
        menu.querySelectorAll(".cb-btn").forEach(b => {
            b.style.cssText = baseStyle;
        });
        if (activeBtn) {
            activeBtn.style.background = "rgba(34,30,30,0.14)";
            activeBtn.style.borderColor = "rgba(44,37,34,0.6)";
            activeBtn.style.boxShadow = "0 0 0 1px rgba(34,30,30,0.4), 0 3px 10px rgba(34,30,30,0.3)";
        }
    };

    menu.querySelectorAll(".cb-btn").forEach(btn => {
        btn.style.cssText = baseStyle;
        btn.addEventListener("click", () => {
            colorBlindnessType = btn.dataset.type;
            setActiveStyles(btn);
            initColorBlindnessMode();
        });
    });
}

function registerCloseListener() {
    if (closeListenerRegistered) return;
    closeListenerRegistered = true;

    window.addEventListener("message", (e) => {
        if (!e.data || e.data.type !== "brilliant-mind-close") return;

        const menu = document.getElementById("colorblind-menu");
        if (menu) menu.remove();
        removeColorBlindnessMode();
        colorBlindnessEnabled = false;
    });
}

export function apply() {
    // When the Color Blindness module is selected from the main panel,
    // we enable the mode by default and show the submenu under the panel.
    if (!colorBlindnessEnabled) {
        colorBlindnessEnabled = true;
    }
    createColorBlindnessMenu();
    registerCloseListener();
}
