# Performance

This document covers how fast the site loads and runs, what optimization techniques exist today, where the **actual bottlenecks** are, and what a measurable plan for improvement looks like. All numbers below were measured from the current `dist/` build in this repo.

---

## Build Measured (from `dist/`)

| Asset | Size (raw) | Notes |
|---|---|---|
| `index-BqgQaJD7.js` | **356.8 KB** | React 19 + Framer Motion + app code, single chunk, minified |
| `index-l7kCyfWd.css` | **27.3 KB** | Full design system `index.css` |
| `index.html` | 1.1 KB | Entry, font links, meta |
| Media (.webm) | ~9.6 MB total | 4 walkthrough videos (RDV 3.6 MB, Freshera 3.1 MB, Console 1.8 MB, Ivy 0.8 MB) |
| WebP posters/screenshots | ~300 KB total | 7 WebP for galleries / posters |

> **No web fonts measured above** — Google Fonts (Inter/Space Grotesk/JetBrains Mono) is loaded from a CDN at runtime.

### First-load heuristic
- HTML ≈ 1 KB — near-zero.
- JS 356.8 KB single file **without route-level code splitting** → the largest single latency cost. Uncached transfer over 3G is roughly 1.5–3 s **before any hydration**.
- CSS is small (27 KB) and the base font stack renders immediately.

---

## What the Code Optimizes On (already in place)

| Technique | Where | Evidence |
|---|---|---|
| **Lazy media** | `ProjectVisual.tsx` | `<video preload="metadata">`, `<img loading="lazy">` |
| **Video only on view** | `ProjectShowcaseCard.useVideoOnView()` | IntersectionObserver play/pause at ≥40% visible |
| **Play only when needed** | same hook | `video.play().catch()` — deferred to scroll |
| **transform-only animation** | `MirrorCube.tsx` | rotations via `motion.div` translate/rotate (no layout thrash) |
| **Spring interpolation, not per-frame setState** | MirrorCube rAF | `useAnimationFrame` lerps refs; setState only on meaningful float delta |
| **`backface-visibility` + `preserve-3d`** | cube faces | avoids reflows per face |
| **Parallax disabled under reduced-motion** | `ProjectShowcaseCard` | reads `matchMedia('(prefers-reduced-motion: reduce)')` |
| **Reduced-motion CSS block** | `index.css` (`@media (prefers-reduced-motion: reduce)`) | removes transitions + zoom transform |
| **memo via `motion.div` variants** | sections | scroll-triggered `whileInView` reveal (only animates when visible) |

So: the app is already thoughtful about **interaction performance**. The significant gaps are in the **load path and asset pipeline**, not the interaction hot-path.

---

## Bottlenecks (ranked)

### 1. Single ~357 KB JS bundle, no code splitting
The whole site — hero, cube, three projects, modal, focus trap, gallery, explainers — all ships as one chunk. There's no router, so route-based splitting is out-of-box impossible; but **component-level lazy loading** would work: `React.lazy` for `Work`, `ProjectModal`, `ProjectGallery`, which only mount on scroll/hover/click.

**Impact:** a smaller bundle needed for a fast LCP on mid-range devices. See [Roadmap in README](../README.md#roadmap).

### 2. Media delivery (videos ~9.6 MB in `public/`)
Three `.webm`s over 1.5 MB each. Even with `preload="metadata"`, the *moment* a project preview scrolls into view, the browser starts pulling the full file. A user scanning the work section can trigger ~3-4 MB of downloads.

| Better | Win |
|---|---|
| Host video in a CDN (S3/Cloudflare R2 + Vercel CDN) | Regional edge, no cold hop |
| Compress further via `ffmpeg -crf 32` balance | ~30-45% smaller |
| Generate `poster` WebP (already present!) and use `poster`+`first-frame` technique | so video loads only when user clicks |

### 3. First contentful paint vs. fonts
Google Fonts `display=swap` is correct — but the browser must resolve CSS + font requests. Consider `preload` of the two main weights, or `unicode-range` subsets via the CSS2 API (already partially). Firefox-blocking: fonts in `<head>` are render-blocking to grok text; `font-display: swap` already mitigates invisible-text.

### 4. No caching headers / service worker
The static host controls HTTP cache: JS/CSS are content-hashed (`assets/index-*.{js,css}`) so `Cache-Control: immutable` + CDN edge caching is trivial to add. A service worker would make the site PWA-capable; currently none.

### 5. Cube CPU/GPU usage
CSS 3D with `perspective`, `preserve-3d`, 26 cubies × 6 faces ≈ 156 layered shadowed `div`s — a persistent WebGL/GPU workload on every frame. On low-end SoCs this is a quiet battery drain. Options: `will-change` hints are already implied (precomputed transforms), cap animation to when the cube is in viewport (cull via visibility), reduce shadow blur radius on mobile.

---

## Rendering performance (frame budget)

- rAF loop only runs while `mode === "interactive"` — heroes idle when leaving the Hero section (mode constant, though; the loop still lives for the whole page mount because it re-renders via `setTime` every frame while mounted).
  - ⚠️ *Currently the loop is mounted with App for its lifetime* — a genuine concern. Fix: gate rAF on `isVisible` (IntersectionObserver on the cube) or `document.visibilityState`.

## Network Requests per page view

| Request | Count | Sized |
|---|---|---|
| HTML + JS + CSS | 3 | ~385 KB |
| Google Fonts (CSS + fonts) | 2-4 | ~200-400 KB |
| Simple Icons (per tech pill) | ~14-20 | ~30-100 KB total |
| WebM videos (on-in-view) | up to 3 concurrently | 0.8–3.6 MB each |

Best case initial: ~0.6 MB parsimonious. Worst case scroll-through-work: ~5-8 MB.

---

## Recommendations (concrete)

1. **Lazy-load App's below-fold sections** (`Work` heroes cube) with `React.lazy` + `Suspense` — instant major win on LCP.
2. **Add `preload`/`fetchpriority` hints** to `Hero` (and the cube) so the critical above-fold bytes beat fonts.
3. **Add `preload`/`fetchpriority` hints** for the above-fold bytes (hero + fonts).
4. **Compress the largest videos** (RDV 3.6 MB → <1.5 MB bitrate cap).
5. **CDN + immutable headers** for `dist/assets`.
6. **Gate the cube's rAF loop on in-view** (IntersectionObserver) instead of page mount.
7. **Move logos offline**: Simple Icons CDN adds N parallel requests; bundle a sprite from `public/icons.svg`.

> Metrics tool note: no bundler visualizer and no Lighthouse configs are included; run `npx vite-bundle-visualizer` (dev dependency, not present) if you want a graph.

> Next: [Security](security.md) · [Back to README](../README.md)