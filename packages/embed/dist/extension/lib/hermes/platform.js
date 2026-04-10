/**
 * Hermes platform adapter: extension (Chrome) vs embed (web).
 * Content scripts and affection modules call getPlatform() after setPlatform() in the entrypoint.
 */

export function setPlatform(p) {
    globalThis.__HERMES_PLATFORM__ = p;
}

export function getPlatform() {
    const p = globalThis.__HERMES_PLATFORM__;
    if (!p) {
        throw new Error("HermesPlatform not initialized");
    }
    return p;
}

/** Safe for optional features (e.g. settings page without init). */
export function tryGetPlatform() {
    return globalThis.__HERMES_PLATFORM__ ?? null;
}

export function createExtensionPlatform() {
    return {
        kind: "extension",
        resolveAsset(path) {
            return chrome.runtime.getURL(path.replace(/^\//, ""));
        },
        storage: {
            local: {
                get(keys, callback) {
                    return chrome.storage.local.get(keys, callback);
                },
                set(items, callback) {
                    return chrome.storage.local.set(items, callback);
                },
            },
            sync: {
                get(keys, callback) {
                    return chrome.storage.sync.get(keys, callback);
                },
                set(items, callback) {
                    return chrome.storage.sync.set(items, callback);
                },
            },
        },
        async requestAI({ action, text }) {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    { type: "ai_request", action, text },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                            return;
                        }
                        if (response && response.success) {
                            resolve(response.result);
                        } else {
                            reject(
                                new Error(
                                    (response && response.error) || "AI request failed"
                                )
                            );
                        }
                    }
                );
            });
        },
    };
}

/**
 * @param {object} opts
 * @param {string} opts.siteId
 * @param {string} opts.apiBase - e.g. https://api.example.com (no trailing slash)
 * @param {() => string} [opts.getPublishableKey]
 */
export function createEmbedPlatform(opts) {
    const { siteId, apiBase } = opts;
    const getPublishableKey =
        typeof opts.getPublishableKey === "function"
            ? opts.getPublishableKey
            : () => "";
    const base = apiBase.replace(/\/$/, "");
    const ns = `hermes:${siteId}:`;

    return {
        kind: "embed",
        siteId,
        apiBase: base,
        resolveAsset(path) {
            const cdn =
                globalThis.__HERMES_CDN_BASE__ ||
                globalThis.__HERMES_EMBED_BASE__ ||
                "";
            const clean = path.replace(/^\//, "");
            if (!cdn) {
                return new URL(clean, location.origin).href;
            }
            const root = cdn.endsWith("/") ? cdn : `${cdn}/`;
            return new URL(clean, root).href;
        },
        storage: {
            local: {
                get(keys, callback) {
                    const keyArr = normalizeStorageKeys(keys);
                    const out = {};
                    for (const k of keyArr) {
                        const raw = localStorage.getItem(ns + k);
                        if (raw !== null) {
                            try {
                                out[k] = JSON.parse(raw);
                            } catch {
                                out[k] = raw;
                            }
                        }
                    }
                    callback(out);
                },
                set(items, callback) {
                    for (const [k, v] of Object.entries(items)) {
                        localStorage.setItem(
                            ns + k,
                            typeof v === "string" ? v : JSON.stringify(v)
                        );
                    }
                    if (callback) {
                        callback();
                    }
                },
            },
            sync: {
                get(keys, callback) {
                    return this.local.get(keys, callback);
                },
                set(items, callback) {
                    return this.local.set(items, callback);
                },
            },
        },
        async requestAI({ action, text }) {
            const key = getPublishableKey();
            const res = await fetch(`${base}/v1/ai`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(key ? { Authorization: `Bearer ${key}` } : {}),
                },
                body: JSON.stringify({ action, text }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.error || res.statusText || "AI request failed");
            }
            if (data.success === false) {
                throw new Error(data.error || "AI request failed");
            }
            return data.result;
        },
    };
}

function normalizeStorageKeys(keys) {
    if (keys == null) {
        return [];
    }
    if (typeof keys === "string") {
        return [keys];
    }
    if (Array.isArray(keys)) {
        return keys;
    }
    return Object.keys(keys);
}
