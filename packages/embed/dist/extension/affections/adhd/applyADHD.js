export function apply() {
    const style = document.createElement("style");
    style.id = "simplify-style";
    style.textContent = `
        footer, nav { display: none !important; }   /* Hide the footer and navigation bar */

        /* Link styling */
        a, a:visited {
            color: #1565C0 !important;
            font-weight: bold;
            text-decoration: underline !important;
            background-color: unset !important;
        }
        a:hover, a:focus {
            color: #0D47A1 !important;
            background-color: rgba(187, 222, 251, 0.3) !important;
            transition: background-color 0.25s, color 0.25s;
        }

        /* Paragraph focus system: the focused paragraph is fully visible, others are faded */
        p.adhd-focus { opacity: 1 !important; color: #111 !important; }
        p:not(.adhd-focus) {
            opacity: 0.4 !important;
            color: transparent !important;
            text-shadow: 0 0 8px #aaa !important;
            transition: opacity 0.25s, color 0.25s;
        }

        /* Make images fully visible and remove filters/shadows */
        figure, figure *, img { opacity: 1 !important; filter: none !important; text-shadow: none !important; }

        body { background: unset !important; }

        /* Table of Contents container */
        #adhd-summary {
            border: 1px solid #ccc;
            padding: 16px;
            margin-bottom: 24px;
            background: unset;
            font-family: sans-serif;
            border-radius: 8px;
            max-width: 600px;
        }
        #adhd-summary h2 { margin-top: 0; font-size: 1.4em; color: #1565C0; }
        #adhd-summary table { width: 100%; border-collapse: collapse; }
        #adhd-summary tr { border-bottom: 1px solid #ddd; transition: background 0.2s; }
        #adhd-summary tr:hover { background: rgba(21, 101, 192, 0.05); }
        #adhd-summary td {
            padding: 6px 12px;
            vertical-align: middle;
            font-size: 0.95em;
            color: unset;
        }
        /* Indent headers according to level */
        #adhd-summary td[data-level="1"] { padding-left: 0px; font-weight: bold; }
        #adhd-summary td[data-level="2"] { padding-left: 16px; font-weight: 600; }
        #adhd-summary td[data-level="3"] { padding-left: 32px; font-weight: 500; }
        #adhd-summary td[data-level="4"] { padding-left: 48px; font-weight: 500; font-style: italic; }
    `;

    document.head.appendChild(style);   // Append the style to the document head

    // --- Create Table of Contents ---
    const summary = document.createElement("div");
    summary.id = "adhd-summary";

    const title = document.createElement("h2");
    title.innerText = "Summary";
    summary.appendChild(title);

    const table = document.createElement("table");

    // Select all headings (h1–h4) and add them to the table of contents
    const headers = Array.from(document.querySelectorAll("h1, h2, h3, h4"));
    headers.forEach(h => {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        const level = parseInt(h.tagName.substring(1));
        cell.dataset.level = level;
        
        const text = h.innerText;
        // If the header contains periods, split into multiple lines
        const splitLines = text.indexOf('.') > 0 ? text.split('. ') : [text];
        cell.innerHTML = splitLines.map(line => `• ${line}`).join('<br>');
        
        row.appendChild(cell);
        table.appendChild(row);
    });


    summary.appendChild(table);
    const firstElement = document.body.firstElementChild;
    document.body.insertBefore(summary, firstElement);  // Insert the summary at the top of the body

    // --- Paragraph focus system ---
    const paragraphs = Array.from(document.querySelectorAll("p"));
    if (paragraphs.length) {
        let current = 0;    
        function setFocus(idx) {
            paragraphs.forEach((p, i) => p.classList.toggle("adhd-focus", i === idx));
            paragraphs[idx].scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setFocus(current);  // Start with the first paragraph focused
        function nextPara() { if (current < paragraphs.length - 1) { current++; setFocus(current); } }
        function prevPara() { if (current > 0) { current--; setFocus(current); } }

        // Navigate paragraphs using arrow keys or page up/down
        window.addEventListener("keydown", e => {
            if (e.key === "ArrowDown" || e.key === "PageDown") { nextPara(); e.preventDefault(); }
            if (e.key === "ArrowUp" || e.key === "PageUp") { prevPara(); e.preventDefault(); }
        });

         // Navigate paragraphs using mouse wheel (throttled)
        let lastScroll = 0;
        window.addEventListener("wheel", e => {
            const now = Date.now();
            if (now - lastScroll < 300) return;
            if (e.deltaY > 0) nextPara(); else prevPara();
            lastScroll = now;
        }, { passive: false });
    }

    // GIF pausing system
    function getStaticFrame(img) {
        // Convert first frame of GIF to static PNG
        return new Promise(resolve => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const tempImg = new Image();
            tempImg.crossOrigin = "anonymous";
            tempImg.src = img.src;
            tempImg.onload = () => {
                canvas.width = tempImg.width;
                canvas.height = tempImg.height;
                try { ctx.drawImage(tempImg, 0, 0); resolve(canvas.toDataURL("image/png")); }
                catch { resolve(null); }
            };
            tempImg.onerror = () => resolve(null);
        });
    }

    function findRealGifURL(img) {
        // Attempt to find the original GIF URL from various sources/attributes
        if (img.dataset.gif) return img.dataset.gif;
        if (img.dataset.src?.endsWith(".gif")) return img.dataset.src;
        if (img.dataset.original?.endsWith(".gif")) return img.dataset.original;
        if (img.dataset.preview?.endsWith(".gif")) return img.dataset.preview;
        if (img.src.includes("giphy.com/media") && img.src.includes("_s.")) return img.src.replace("_s.", ".");
        const picture = img.closest("picture");
        if (picture) {
            const source = picture.querySelector("source[srcset*='.gif'], source[type='image/gif']");
            if (source) return source.srcset.split(" ")[0];
        }
        return img.src;
    }

    async function replaceGif(img) {
         // Replace GIF with static frame and overlay
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
                overlay.style.background = "rgba(0,0,0,0.35)";
                overlay.innerText = "✋ GIF activ";
                playing = true;
            }
        });

        // Stop GIF on mouse leave
        wrapper.addEventListener("mouseleave", () => {
            if (playing) {
                staticImg.src = staticSrc;
                overlay.style.background = "rgba(0,0,0,0.55)";
                overlay.innerText = "⚠ GIF – Hover pentru a porni";
                playing = false;
            }
        });

        // Prevent navigation if GIF is inside a link
        wrapper.addEventListener("click", e => e.preventDefault());
    }

    function detectAndReplaceAllGifs() {
        // Scan all images and replace GIFs with static version
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

    function initGifProtection() {
        detectAndReplaceAllGifs();
         // Observe DOM changes to detect dynamically added GIFs
        new MutationObserver(() => detectAndReplaceAllGifs())
            .observe(document.body, { childList: true, subtree: true });
    }

    initGifProtection();     // Initialize GIF protection system

}
