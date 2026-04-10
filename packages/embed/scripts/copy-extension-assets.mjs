import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const extSrc = path.join(root, "extension");
const dist = path.join(root, "packages", "embed", "dist", "extension");

await fs.cp(extSrc, dist, { recursive: true });
console.log("Copied extension assets to dist/extension");
