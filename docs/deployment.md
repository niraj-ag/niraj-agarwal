# Deployment

> **Important caveat:** the repository contains **no deployment configuration** — no Vercel/Netlify config, no GitHub Actions workflows, no Dockerfile, no `vercel.json`, and no CI/CD pipeline. The links inside the site's own project data go to Vercel-hosted URLs (e.g. `freshera.vercel.app`), which strongly suggests this project is deployed to Vercel manually or via an uncommitted platform config — but that hosting choice is **inferred, not confirmed**, from the repo.

This document therefore covers the static-build reality of the app plus concrete, copy-paste instructions for the most common targets.

---

## What the Repo Actually Defines

| Concern | What exists |
|---|---|
| Build command | `npm run build` → `tsc -b && vite build` |
| Output | `dist/` — static site (HTML + hashed JS/CSS + everything in `public/`) |
| Preview | `npm run preview` |
| Environment variables | **None.** No `.env`, no `process.env` usage anywhere. Zero backend, zero keys. |
| CI | Not present in repo |
| Container | None |

`base` is default (`/`) in `vite.config.ts`, so the app deploys at domain root.

---

## Prerequisites

- Node.js ≥ 20 (Vite 8 / TS 6 era tooling)
- npm ≥ 10

Verify:

```bash
node -v
npm -v
```

---

## Build & Preview (local production simulation)

```bash
npm install          # install locked deps
npm run build        # type-check (tsc -b) then bundle (vite build)
npm run preview      # serve ./dist locally, usually at http://localhost:4173
```

> Because `tsc -b` runs first, any TypeScript error **fails the whole build** — that's the safety gate that normally replaces tests.

---

## Deploy to Static Host (manual)

Because `dist/` is a folder of static files, any static host works:

### Vercel (most likely — matches site links)

```bash
npm i -g vercel
vercel login
vercel          # first run prompts for project + framework preset (Vite)
vercel --prod   # promote
```

Framework preset: **Vite** → build `npm run build`, output `dist`. No env vars needed.

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages (note: needs extra flag)

Vite defaults to root-relative paths. For a `username.github.io/repo/` sub-path you must add `base: "/<repo>/"` to `vite.config.ts` or assets 404. Not configured in the repo.

---

## CI/CD

**Not present.** There are no workflow files under `.github/`. Recommended baseline if you add CI:

```yaml
# .github/workflows/ci.yml — suggested starting point (not in repo)
name: CI
on:
  push: { branches: [main] }
  pull_request:
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

---

## Environment Variables

There are **none**. Because the app is fully static, `import.meta.env` is unpopulated and no keys are expected. If you later add a contact backend or analytics, keep secrets server-side (see [Security](security.md)).

---

## Rollback Strategy

Since each deploy is a static snapshot pinned to a git commit:

1. **Vercel:** Promote a previous deployment from the dashboard (Deployments → ⋯ → Promote to Production). Instant.
2. **Any CDN/host:** re-deploy the previous `dist/` or `git revert` + rebuild.

Keep `dist/` out of git (it's already git-ignored) — never hand-edit deployed artifacts.

## Monitoring & Logging

- **None configured.** Static hosting = no server logs to tail. Options: Vercel Analytics / Speed Insights (toast-toggle, zero-code), or a `<img>`-based analytics (Plausible/Umami) in `index.html`.
- Readiness check: `curl -I https://your-domain/` → expect `200` with cached assets in `dist/`.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `dist/` is a folder of original files | `vite build` output — deploy `dist/` itself |
| Blank page on GitHub Pages | root-relative `base`; set `base: './'` |
| Fonts look wrong | Google Fonts blocked by network; add system-font fallbacks |
| Older browser, white page | Build targets modern browsers (`es2023`); use Vite build target `es2017` if needed |
| `vercel` doesn't pick the right framework | Explicitly choose Vue—React preset + set build/output to `dist` |

> Next: [Contributing](contributing.md) · [Back to README](../README.md)