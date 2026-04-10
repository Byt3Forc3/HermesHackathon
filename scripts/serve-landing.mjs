/**
 * Serves the marketing site (landingpage/) with embed.js + extension assets
 * from packages/embed/dist so the one-line embed works on the same origin.
 *
 * Open http://127.0.0.1:3333/ — run the API on 8787 first (cd server && npm start).
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const landingRoot = path.join(repoRoot, "landingpage");
const embedDist = path.join(repoRoot, "packages", "embed", "dist");
const PORT = Number(process.env.LANDING_PORT || 3333);

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
};

function safeJoin(root, rel) {
    const fp = path.normalize(path.join(root, rel));
    if (!fp.startsWith(root)) {
        return null;
    }
    return fp;
}

function sendFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    fs.stat(filePath, (err, st) => {
        if (err || !st.isFile()) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }
        res.writeHead(200, { "Content-Type": type });
        fs.createReadStream(filePath).pipe(res);
    });
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/embed.js") {
        const fp = safeJoin(embedDist, "embed.js");
        return sendFile(res, fp);
    }

    if (pathname.startsWith("/extension/")) {
        const rel = pathname.slice("/extension/".length);
        const fp = safeJoin(path.join(embedDist, "extension"), rel);
        if (!fp) {
            res.writeHead(403);
            return res.end();
        }
        return sendFile(res, fp);
    }

    if (pathname === "/") {
        pathname = "/index.html";
    }

    const rel = pathname.replace(/^\/+/, "");
    const fp = safeJoin(landingRoot, rel);
    if (!fp) {
        res.writeHead(403);
        return res.end();
    }
    sendFile(res, fp);
});

server.listen(PORT, "127.0.0.1", () => {
    console.log(`Landing + embed: http://127.0.0.1:${PORT}/`);
    console.log(`Ensure API is running: http://127.0.0.1:8787 (cd server && npm start)`);
});
