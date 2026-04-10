import {
    createEmbedPlatform,
    setPlatform,
    getPlatform,
} from "../../../extension/lib/hermes/platform.js";
import { initSideShell } from "../../../extension/lib/hermes/sideShell.js";

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function setCdnBase(scriptEl) {
    if (import.meta.env.DEV) {
        globalThis.__HERMES_CDN_BASE__ = `${window.location.origin}/extension/`;
        return;
    }
    if (scriptEl && scriptEl.src) {
        const u = new URL(scriptEl.src);
        u.hash = "";
        u.search = "";
        const dir = u.href.replace(/[^/]+$/, "");
        globalThis.__HERMES_CDN_BASE__ = `${dir}extension/`;
    } else {
        globalThis.__HERMES_CDN_BASE__ = `${window.location.origin}/extension/`;
    }
}

function getEmbedScriptEl() {
    if (document.currentScript && document.currentScript.dataset?.siteId != null) {
        return document.currentScript;
    }
    return document.querySelector("script[data-brilliantmind][data-site-id]");
}

const loaders = import.meta.glob("../../../extension/affections/*/apply*.js", {
    eager: true,
});

function resolveModule(moduleId) {
    const needle = `/${moduleId}/apply${capitalize(moduleId)}.js`;
    const key = Object.keys(loaders).find((k) =>
        k.replace(/\\/g, "/").endsWith(needle)
    );
    return key ? loaders[key] : null;
}

async function fetchConfig(apiBase, siteId) {
    const url = `${apiBase}/v1/sites/${encodeURIComponent(siteId)}/config`;
    const res = await fetch(url, {
        credentials: "omit",
        headers: { Accept: "application/json" },
    });
    if (!res.ok) {
        throw new Error(`Config failed: ${res.status}`);
    }
    return res.json();
}

async function run() {
    const scriptEl = getEmbedScriptEl();
    const siteId = scriptEl?.dataset?.siteId || "demo";
    const apiBase = (scriptEl?.dataset?.apiBase || "http://127.0.0.1:8787").replace(
        /\/$/,
        ""
    );
    const siteKey = scriptEl?.dataset?.siteKey || "";

    setCdnBase(scriptEl);

    setPlatform(
        createEmbedPlatform({
            siteId,
            apiBase,
            getPublishableKey: () => siteKey,
        })
    );

    initSideShell({ context: "embed" });

    let config;
    try {
        config = await fetchConfig(apiBase, siteId);
    } catch (e) {
        console.warn("[BrilliantMind] config fetch failed, using defaults:", e);
        config = {
            allowedModules: [
                "dyslexia",
                "adhd",
                "autism",
                "color_blindness",
                "partially_blindness",
                "epilepsy",
                "simplify",
                "reader_mode",
                "text_to_speech",
            ],
            defaultModule: null,
        };
    }

    const domain = location.hostname;
    const storageKey = `site_${domain}`;

    const stored = await new Promise((resolve) => {
        getPlatform().storage.local.get(storageKey, (data) => {
            resolve(data[storageKey]);
        });
    });

    let moduleId =
        (Array.isArray(stored) && stored[0]) || config.defaultModule || null;

    if (
        moduleId &&
        config.allowedModules &&
        !config.allowedModules.includes(moduleId)
    ) {
        moduleId = config.defaultModule || null;
    }

    if (!moduleId) {
        return;
    }

    const mod = resolveModule(moduleId);
    if (!mod) {
        console.error("[BrilliantMind] Unknown module:", moduleId);
        return;
    }

    if (typeof mod.apply === "function") {
        mod.apply();
    }
}

run().catch((e) => console.error("[BrilliantMind]", e));
