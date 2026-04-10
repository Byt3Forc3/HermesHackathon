# Brilliant Mind — site integration

## One-line embed (Tier A — client bootstrap)

Add the built script **after** you have a `<body>` (or use `defer` in `<head>`). The loader fetches your site config from the API, restores the visitor’s chosen experience from `localStorage`, and applies the matching module. The **collapsible side panel** lists experiences, explains what each mode does, and exposes **AI actions** when Reader mode is active.

```html
<script
  src="https://your-cdn.example.com/embed.js"
  data-brilliantmind
  data-site-id="demo"
  data-api-base="https://api.yourdomain.com"
  data-site-key="bm_pub_demo"
  defer
></script>
```

Deploy **`embed.js`** together with the **`extension/`** asset tree next to it (same layout as `packages/embed/dist/` after `npm run build`). The script resolves static files (CSS, fonts) from `…/extension/…` relative to `embed.js`.

### Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-site-id` | Yes | Site id registered on the API (e.g. `demo`). |
| `data-api-base` | No | API origin, default `http://127.0.0.1:8787` for local dev. |
| `data-site-key` | For AI | Publishable key; sent as `Authorization: Bearer …` to `POST /v1/ai`. |
| `data-brilliantmind` | Recommended | Marker so the loader can find the tag if `document.currentScript` is unavailable. |

### Local development

1. **API:** from repo root, `cd server` and `npm start` (port **8787**). Set `OPENROUTER_API_KEY` for AI proxying.
2. **Embed bundle:** `cd packages/embed` and `npm run build` (outputs `dist/embed.js` and copies `extension/` into `dist/extension/`).
3. **Preview:** `cd packages/embed` and `npm run preview` — open the URL shown and load a page that includes `embed.js` from that origin (see `examples/embed-demo.html`).

### CORS

The API checks `Origin` against each site’s `allowedOrigins`. Add every domain (and port) where your pages run, including Vite dev (`http://localhost:5173`) and preview (`http://localhost:4173`). The demo site id `demo` allows these in `server/index.mjs`.

## Tier B — edge / HTML injection (optional)

For the strongest “before first paint” story, inject the same `<script>` via a **reverse proxy** or **edge worker** (e.g. Cloudflare) so the snippet is present in the first HTML response. This does not replace Tier A logic; it only improves **early** delivery when you control the HTML pipeline.

## Tier C — framework apps

Use framework middleware or a plugin to inject the script tag and optional meta for SSR apps (Next.js, Vite SSR, etc.).

## Troubleshooting

- **Styles or fonts 404:** Ensure the **`extension/`** directory is deployed beside `embed.js` and URLs resolve under `{origin}/extension/...`.
- **Config 404 / CORS:** Register the page origin for your `siteId` in the API; restart the server after editing `allowedOrigins`.
- **AI errors:** Confirm `OPENROUTER_API_KEY` on the server and a valid `data-site-key` matching `publishableKey` in the registry.
