# Cutout — Free Background Remover

A minimalist, 100% free background removal website. No signup, no API keys, no server costs. The AI model runs entirely in the user's browser using WebAssembly.

## Tech Stack

- **Next.js 14** (App Router)
- **@imgly/background-removal** — ONNX model running in browser via WASM
- **TypeScript**
- No backend, no database, no API keys needed

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel (Free)

### Option 1: GitHub + Vercel (recommended)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Settings:
   - Framework: **Next.js**
   - Build command: `npm run build`
   - Output: leave as default (`.next`)
5. Click Deploy ✅

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

## How it works

1. User uploads an image (drag & drop or click)
2. `@imgly/background-removal` loads an ONNX model via WebAssembly (downloaded once, ~40 MB, then cached)
3. The model runs locally in the browser — no image ever touches a server
4. Result PNG with transparent background is shown and available for download

## Important: CORS Headers

The `vercel.json` and `next.config.mjs` both set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. These are **required** for the SharedArrayBuffer API that the WASM model uses.

## Customization

- Change the brand name: search for "cutout" in `app/page.tsx` and `app/layout.tsx`
- Colors: edit CSS variables in `app/globals.css`
- Font: update the Google Fonts import in `app/globals.css`
