// Acest modul oferă protecție vizuală împotriva stimulilor care pot declanșa 
// disconfort sau crize fotosensibile. Include mecanisme de siguranță pentru GIF-uri, 
// videoclipuri, animații, reclame agresive și culori puternice, oferind o experiență 
// vizuală stabilă, controlată și sigură pentru utilizatori sensibili.

// ===============================
// 1.  GIF PROTECTION — HOVER MODE
// ===============================

// Extrage primul frame din GIF ca imagine statică
function getStaticFrame(img) {
    return new Promise(resolve => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const tempImg = new Image();
        tempImg.crossOrigin = "anonymous";
        tempImg.src = img.src;

        tempImg.onload = () => {
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;

            try {
                ctx.drawImage(tempImg, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            } catch {
                resolve(null);
            }
        };

        tempImg.onerror = () => resolve(null);
    });
}


// Găsește URL-ul REAL al GIF-ului
function findRealGifURL(img) {
    if (img.dataset.gif) return img.dataset.gif;
    if (img.dataset.src?.endsWith(".gif")) return img.dataset.src;
    if (img.dataset.original?.endsWith(".gif")) return img.dataset.original;
    if (img.dataset.preview?.endsWith(".gif")) return img.dataset.preview;

    if (img.src.includes("giphy.com/media") && img.src.includes("_s.")) {
        return img.src.replace("_s.", ".");
    }

    const picture = img.closest("picture");
    if (picture) {
        const source = picture.querySelector("source[srcset*='.gif'], source[type='image/gif']");
        if (source) {
            return source.srcset.split(" ")[0];
        }
    }

    return img.src;
}


// Înlocuiește GIF-ul cu static + overlay + hover behavior
async function replaceGif(img) {
    if (img.dataset.gifReplaced === "true") return;
    img.dataset.gifReplaced = "true";

    const realGif = findRealGifURL(img);
    const staticSrc = await getStaticFrame(img);

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.cursor = "pointer";
    wrapper.dataset.epilepsyWrapper = "true";

    const staticImg = document.createElement("img");
    staticImg.src = staticSrc || img.src;
    staticImg.style.width = img.width + "px";
    staticImg.style.pointerEvents = "none";

    const overlay = document.createElement("div");
    overlay.innerText = "⚠ GIF – Hover pentru a porni";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.color = "white";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.fontSize = "14px";
    overlay.style.textAlign = "center";
    overlay.style.pointerEvents = "none";

    wrapper.appendChild(staticImg);
    wrapper.appendChild(overlay);

    img.replaceWith(wrapper);

    let playing = false;

    // Start GIF on hover
    wrapper.addEventListener("mouseenter", () => {
        if (!playing) {
            staticImg.src = realGif;
            overlay.innerText = "✋ GIF activ";
            overlay.style.background = "rgba(0,0,0,0.35)";
            playing = true;
        }
    });

    // Stop GIF on mouse leave
    wrapper.addEventListener("mouseleave", () => {
        if (playing) {
            staticImg.src = staticSrc;
            overlay.innerText = "⚠ GIF – Hover pentru a porni";
            overlay.style.background = "rgba(0,0,0,0.55)";
            playing = false;
        }
    });

    // Prevent link navigation if GIF is inside <a>
    wrapper.addEventListener("click", e => e.preventDefault());
}


// Detectează GIF-uri noi
function detectAndReplaceAllGifs() {
    const imgs = Array.from(document.querySelectorAll("img"));

    for (const img of imgs) {
        if (img.closest("[data-epilepsy-wrapper]")) continue;
        if (img.dataset.gifReplaced === "true") continue;

        const src = img.src?.toLowerCase() || "";

        const looksLikeGif =
            src.endsWith(".gif") ||
            img.dataset.gif ||
            img.dataset.src?.endsWith(".gif") ||
            img.dataset.original?.endsWith(".gif") ||
            src.includes("giphy.com/media");

        if (looksLikeGif) replaceGif(img);
    }
}


// Activează protecția GIF-urilor
function initGifProtection() {
    detectAndReplaceAllGifs();

    new MutationObserver(() => detectAndReplaceAllGifs())
        .observe(document.body, { childList: true, subtree: true });
}

// ===============================
// 2.  VIDEO PLAY / STOP OVERLAY
// ===============================

function createVideoOverlay(message = "⚠ VIDEO – Click pentru a porni") {
    const overlay = document.createElement("div");
    overlay.innerText = message;
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.color = "white";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.fontSize = "16px";
    overlay.style.fontFamily = "sans-serif";
    overlay.style.textAlign = "center";
    overlay.style.zIndex = "99999";
    overlay.style.cursor = "pointer";

    return overlay;
}

function wrapVideo(video) {
    if (video.dataset.epilepsyWrapped === "true") return;
    video.dataset.epilepsyWrapped = "true";

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.width = video.clientWidth + "px";
    wrapper.style.cursor = "pointer";

    const overlay = createVideoOverlay();

    video.parentNode.insertBefore(wrapper, video);
    wrapper.appendChild(video);
    wrapper.appendChild(overlay);

    video.autoplay = false;
    video.pause();
    video.muted = false;

    let playing = false;

    // FIRST CLICK → PLAY
    overlay.addEventListener("click", () => {
        playing = true;
        video.play();
        overlay.style.display = "none";
    });

    // CLICK ON VIDEO → STOP + SHOW OVERLAY AGAIN
    video.addEventListener("click", () => {
        if (playing) {
            video.pause();
            playing = false;
            overlay.innerText = "✋ VIDEO – Click pentru a porni din nou";
            overlay.style.display = "flex";
        }
    });

    // If video finished → show overlay again
    video.addEventListener("ended", () => {
        playing = false;
        overlay.innerText = "⚠ VIDEO – Click pentru a porni";
        overlay.style.display = "flex";
    });
}

function detectVideos() {
    document.querySelectorAll("video").forEach(wrapVideo);
}

function initVideoProtection() {
    detectVideos();

    new MutationObserver(() => {
        detectVideos();
    }).observe(document.body, { childList: true, subtree: true });
}

// ===========================================
// 3.     ADVANCED AD REMOVAL — HEURISTICS
// ===========================================

function removeAdvancedAds() {
    const STANDARD_AD_SIZES = [
        [300, 250], [728, 90], [160, 600], [468, 60],
        [970, 250], [300, 600], [250, 250], [320, 50],
        [336, 280], [180, 150], [234, 60]
    ];

    // 1) Remove elements with standard ad sizes
    document.querySelectorAll("div, section, aside, iframe").forEach(el => {
        const rect = el.getBoundingClientRect();
        STANDARD_AD_SIZES.forEach(([w, h]) => {
            if (
                Math.abs(rect.width - w) < 5 &&
                Math.abs(rect.height - h) < 5
            ) {
                el.remove();
            }
        });
    });

    // 2) Remove floating sticky/fixed elements (corner ads)
    document.querySelectorAll("div, aside, section").forEach(el => {
        const style = window.getComputedStyle(el);

        const isFloating =
            style.position === "fixed" ||
            style.position === "sticky";

        const isCorner =
            (parseInt(style.top) < 50 || parseInt(style.bottom) < 50) &&
            (parseInt(style.left) < 50 || parseInt(style.right) < 50);

        if (isFloating && isCorner) {
            el.remove();
        }
    });

    // 3) Remove autoplaying video containers
    document.querySelectorAll("video").forEach(video => {
        if (video.autoplay || video.hasAttribute("autoplay")) {
            const parent = video.closest("div, section, aside") || video;
            parent.remove();
        }
    });

    // 4) Remove iframe ads by network signature
    document.querySelectorAll("iframe").forEach(iframe => {
        const src = iframe.src?.toLowerCase() || "";

        const AD_NETWORKS = [
            "doubleclick", "googlesyndication", "adnxs",
            "outbrain", "taboola", "teads", "revcontent",
            "zemanta", "opendsp"
        ];

        if (AD_NETWORKS.some(net => src.includes(net))) {
            iframe.remove();
        }
    });

    // 5) Remove elements with text like “Advertisement”
    document.querySelectorAll("div, p, span").forEach(el => {
        if (el.innerText.trim().toLowerCase() === "advertisement") {
            const container = el.closest("div, section, aside") || el;
            container.remove();
        }
    });
}

function initAdvancedAdRemoval() {
    removeAdvancedAds();
    new MutationObserver(() => removeAdvancedAds())
        .observe(document.body, { childList: true, subtree: true });
}

// ========================================================
// 3.2.      REMOVE FLOATING / AUTOPLAY / STICKY VIDEO ADS
// ========================================================

function removeFloatingAds() {
    // 1) Remove any video (or div containing video) that is fixed/sticky
    document.querySelectorAll("video").forEach(video => {
        const style = getComputedStyle(video);

        const isFixed = 
            style.position === "fixed" ||
            style.position === "sticky" ||
            video.closest("[style*='position:fixed']") ||
            video.closest("[style*='position: sticky']");

        const isAutoplay =
            video.autoplay ||
            video.hasAttribute("autoplay") ||
            video.getAttribute("muted") === "muted";

        // This catches exactly your screenshot ad
        if (isFixed || isAutoplay) {
            const container = video.closest("div");
            if (container) container.remove();
            else video.remove();
        }
    });

    // 2) Remove fixed-position divs with a close button (common in ads)
    document.querySelectorAll("div").forEach(div => {
        const style = getComputedStyle(div);

        const isFixed = style.position === "fixed" || style.position === "sticky";
        const hasX = div.innerText.trim() === "×" ||
                     div.querySelector("button") ||
                     div.querySelector("[role='button']");

        if (isFixed && hasX) {
            div.remove();
        }
    });

    // 3) Remove advertisement iframe networks (they hide domain)
    document.querySelectorAll("iframe").forEach(iframe => {
        const src = iframe.src?.toLowerCase() ?? "";

        if (
            src.includes("doubleclick") ||
            src.includes("googlesyndication") ||
            src.includes("adnxs") ||
            src.includes("outbrain") ||
            src.includes("taboola") ||
            src.includes("teads")
        ) {
            iframe.remove();
        }
    });
}

function initFloatingAdRemoval() {
    removeFloatingAds();
    new MutationObserver(() => removeFloatingAds())
        .observe(document.body, { subtree: true, childList: true });
}

// ===============================
// 4. ANIMATION BLOCKER 
// ===============================

function initAnimationBlocker() {
    // 1. CSS absolut (injectat pe <html>)
    const style = document.createElement("style");
    style.textContent = `
        * {
            animation: none !important;
            animation-duration: 0s !important;
            animation-iteration-count: 1 !important;
            transition: none !important;
            scroll-behavior: auto !important;
        }
    `;
    document.documentElement.appendChild(style);

    // 2. CSSSheet injectat cu prioritate maximă
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
        * {
            animation: none !important;
            transition: none !important;
        }
    `);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    // 3. Patch direct pe style computed — această parte e invincibilă
    function patchElement(el) {
        try {
            el.style.setProperty("animation", "none", "important");
            el.style.setProperty("transition", "none", "important");
            el.style.setProperty("scroll-behavior", "auto", "important");
        } catch {}
    }

    // 4. Patch pe TOATE elementele din pagină
    document.querySelectorAll("*").forEach(patchElement);

    // 5. Patch pe elementele noi (mutation observer)
    new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        patchElement(node);
                        node.querySelectorAll?.("*").forEach(patchElement);
                    }
                });
            }
        }
    }).observe(document.documentElement, { childList: true, subtree: true });
}// ===============================================
//  5. EPILEPSY COLOR SAFETY MODE — FULL SINGLE FILE
//   (Light Mode v3 + Toggle ON/OFF)
// ===============================================

// Flag global — activat/dezactivat
let colorSafetyEnabled = false;


// 1. Funcția principală de aplicare
function initColorSafety() {
    if (!colorSafetyEnabled) return;

    replaceDangerousColors();
    softenNeonColors();
    applyGlobalCalmingFilter();

    new MutationObserver(() => {
        if (!colorSafetyEnabled) return;
        replaceDangerousColors();
        softenNeonColors();
    }).observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true
    });
}


// 2. Înlocuiește alb/negru extrem cu variante soft & luminoase
function replaceDangerousColors() {
    const replacements = [
        ["#ffffff", "#fdfdfb"],
        ["rgb(255, 255, 255)", "rgb(253,253,251)"],

        ["#000000", "#222222"],
        ["rgb(0, 0, 0)", "rgb(34,34,34)"]
    ];

    document.querySelectorAll("*").forEach(el => {
        const style = getComputedStyle(el);

        replacements.forEach(([from, to]) => {
            if (style.backgroundColor.toLowerCase() === from) {
                el.style.backgroundColor = to;
            }
            if (style.color.toLowerCase() === from) {
                el.style.color = to;
            }
        });
    });
}


// 3. Estompare neon-urilor (soft, luminous, natural)
function softenNeonColors() {
    const neonRegex = /(rgb|hsl)a?\(([^)]+)\)/;

    document.querySelectorAll("*").forEach(el => {
        const style = getComputedStyle(el);

        ["color", "backgroundColor", "borderColor"].forEach(prop => {
            const value = style[prop];
            if (!value || !neonRegex.test(value)) return;

            let match = value.match(/\d+/g);
            if (!match) return;

            let [r, g, b] = match.map(Number);

            const isNeon = (r > 240) || (g > 240) || (b > 240);

            if (isNeon) {
                const newColor = `rgb(${r * 0.7}, ${g * 0.7}, ${b * 0.7})`;
                el.style[prop] = newColor;
            }
        });
    });
}


// 4. Overlay global ultra luminos & subtil
function applyGlobalCalmingFilter() {
    if (document.getElementById("epilepsy-light-filter")) return;

    const overlay = document.createElement("div");
    overlay.id = "epilepsy-light-filter";

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "999999999";

    // SUPER luminos, subtil, natural
    overlay.style.backdropFilter = "brightness(0.98) saturate(0.95)";
    overlay.style.background = "rgba(255,255,240,0.015)";

    document.body.appendChild(overlay);
}


// 5. Dezactivare completă (reset)
function removeColorSafety() {
    const overlay = document.getElementById("epilepsy-light-filter");
    if (overlay) overlay.remove();

    document.querySelectorAll("*").forEach(el => {
        el.style.backgroundColor = "";
        el.style.color = "";
        el.style.borderColor = "";
    });
}


// 6. Toggle Button (ON / OFF)
function createColorToggleButton() {
    if (document.getElementById("color-safety-toggle")) return;

    const btn = document.createElement("button");
    btn.id = "color-safety-toggle";
    btn.innerText = "Color Safe: OFF";

    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.padding = "10px 14px";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.fontSize = "14px";
    btn.style.color = "#fff";
    btn.style.background = "#444";
    btn.style.zIndex = "9999999999999";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
        colorSafetyEnabled = !colorSafetyEnabled;

        if (colorSafetyEnabled) {
            btn.innerText = "Color Safe: ON";
            btn.style.background = "#2a8f2a";
            initColorSafety();
        } else {
            btn.innerText = "Color Safe: OFF";
            btn.style.background = "#444";
            removeColorSafety();
        }
    });
}


export function apply() {
    initGifProtection();
    initVideoProtection();
    initFloatingAdRemoval();
    initAdvancedAdRemoval();
    initAnimationBlocker();
    initColorSafety(); 
    createColorToggleButton();

}