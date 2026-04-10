import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionRoot = path.resolve(__dirname, "../../extension");

function serveExtensionMiddleware(rootDir) {
    const root = rootDir || extensionRoot;
    return (req, res, next) => {
        const url = req.url.split("?")[0];
        if (!url.startsWith("/extension/")) {
            return next();
        }
        const rel = decodeURIComponent(url.slice("/extension/".length));
        const fp = path.normalize(path.join(root, rel));
        if (!fp.startsWith(root)) {
            res.statusCode = 403;
            res.end();
            return;
        }
        fs.stat(fp, (err, st) => {
            if (err || !st.isFile()) {
                next();
                return;
            }
            const ext = path.extname(fp).toLowerCase();
            const types = {
                ".js": "text/javascript",
                ".css": "text/css",
                ".otf": "font/otentype",
                ".html": "text/html",
                ".png": "image/png",
                ".svg": "image/svg+xml",
            };
            res.setHeader(
                "Content-Type",
                types[ext] || "application/octet-stream"
            );
            fs.createReadStream(fp).pipe(res);
        });
    };
}

export default defineConfig({
    root: ".",
    build: {
        outDir: "dist",
        lib: {
            entry: path.resolve(__dirname, "src/main.js"),
            name: "BrilliantMindEmbed",
            fileName: () => "embed.js",
            formats: ["iife"],
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
        },
    },
    server: {
        port: 5173,
        fs: { allow: [path.resolve(__dirname, "../..")] },
    },
        plugins: [
        {
            name: "serve-extension-assets",
            configureServer(server) {
                server.middlewares.use(serveExtensionMiddleware(extensionRoot));
            },
            configurePreviewServer(server) {
                const built = path.resolve(__dirname, "dist/extension");
                const root = fs.existsSync(built) ? built : extensionRoot;
                server.middlewares.use(serveExtensionMiddleware(root));
            },
        },
    ],
});
