/**
 * Minimal Brilliant Mind API: site config + AI proxy (OpenRouter).
 * Env: OPENROUTER_API_KEY (required for /v1/ai), PORT (default 8787)
 */

import http from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.PORT || 8787);
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";

/** Demo registry — replace with DB in production */
const SITES = {
    demo: {
        publishableKey: "bm_pub_demo",
        allowedOrigins: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:3333",
            "http://127.0.0.1:3333",
            "null",
        ],
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
    },
};

const rateWindowMs = 60_000;
const rateMax = 60;
const rateByKey = new Map();

function allowOrigin(origin, site) {
    if (!origin) {
        return true;
    }
    if (site.allowedOrigins.includes("*")) {
        return true;
    }
    return site.allowedOrigins.some((o) => o === origin || o === "null");
}

function rateLimit(key) {
    const now = Date.now();
    let row = rateByKey.get(key);
    if (!row || now - row.start > rateWindowMs) {
        row = { start: now, count: 0 };
        rateByKey.set(key, row);
    }
    row.count += 1;
    return row.count <= rateMax;
}

function getPrompt(action, text) {
    switch (action) {
        case "summarize":
            return `Summarize the following text in 5 short bullet points:\n\n${text}`;
        case "highlight":
            return `Extract the most important key ideas from this text:\n\n${text}`;
        case "simplify":
            return `Rewrite this text in simpler, easier-to-understand language:\n\n${text}`;
        case "explain":
            return `Explain this text as if teaching a beginner:\n\n${text}`;
        case "flashcards":
            return `Create 10 flashcards (Q&A format) based on this text:\n\n${text}`;
        default:
            return text;
    }
}

async function handleAI(body, site) {
    if (!OPENROUTER_KEY) {
        throw new Error("Server missing OPENROUTER_API_KEY");
    }
    const { action, text } = body;
    const prompt = getPrompt(action, text);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        }),
    });

    const data = await res.json();
    if (!data || !data.choices || !data.choices[0]) {
        throw new Error("Invalid AI response");
    }
    return data.choices[0].message.content;
}

function sendJson(res, status, obj, origin) {
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
    };
    if (origin) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
        headers["Access-Control-Allow-Headers"] =
            "Content-Type, Authorization, Accept";
    }
    res.writeHead(status, headers);
    res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const origin = req.headers.origin || "";
    const path = url.pathname;

    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": origin || "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers":
                "Content-Type, Authorization, Accept",
            "Access-Control-Max-Age": "86400",
        });
        res.end();
        return;
    }

    if (path.startsWith("/v1/sites/") && path.endsWith("/config") && req.method === "GET") {
        const siteId = decodeURIComponent(
            path.slice("/v1/sites/".length, -"/config".length)
        );
        const site = SITES[siteId];
        if (!site) {
            sendJson(res, 404, { error: "Unknown site" }, origin || "*");
            return;
        }
        if (!allowOrigin(origin, site)) {
            sendJson(res, 403, { error: "Origin not allowed" }, origin || "*");
            return;
        }
        sendJson(
            res,
            200,
            {
                siteId,
                allowedModules: site.allowedModules,
                defaultModule: site.defaultModule,
            },
            origin || "*"
        );
        return;
    }

    if (path === "/v1/ai" && req.method === "POST") {
        let body = "";
        for await (const chunk of req) {
            body += chunk;
        }
        let parsed;
        try {
            parsed = JSON.parse(body || "{}");
        } catch {
            sendJson(res, 400, { success: false, error: "Invalid JSON" }, origin);
            return;
        }

        const auth = req.headers.authorization || "";
        const token = auth.replace(/^Bearer\s+/i, "");
        const site = Object.values(SITES).find((s) => s.publishableKey === token);
        if (!site) {
            sendJson(res, 401, { success: false, error: "Invalid site key" }, origin);
            return;
        }
        if (!allowOrigin(origin, site)) {
            sendJson(res, 403, { success: false, error: "Origin not allowed" }, origin);
            return;
        }
        if (!rateLimit(token)) {
            sendJson(res, 429, { success: false, error: "Rate limit" }, origin);
            return;
        }

        try {
            const result = await handleAI(parsed, site);
            sendJson(res, 200, { success: true, result }, origin);
        } catch (e) {
            sendJson(
                res,
                500,
                { success: false, error: String(e && e.message ? e.message : e) },
                origin
            );
        }
        return;
    }

    sendJson(res, 404, { error: "Not found" }, origin || "*");
});

server.listen(PORT, () => {
    console.log(`Brilliant Mind API http://127.0.0.1:${PORT}`);
});
