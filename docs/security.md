# Security

A security review of the repository as it stands today. The honest headline: **this is a static frontend with no secrets, no backend, and no user-supplied data** — so the traditional attack surface (injection, CSRF, auth bypass, secrets in transit) is largely absent by construction. That said, there are real hardening opportunities worth documenting.

---

## Attack Surface Assessment

| Vector | Status | Explanation |
|---|---|---|
| SQL Injection | **N/A** | No database, no SQL, no ORM anywhere |
| XSS (Reflected) | **Low** | No user input is ever echoed; all content is static TSX literals |
| XSS (Stored) | **Low** | Same — no comment systems, forms, or CMS |
| CSRF | **N/A** | No state-changing endpoints |
| Auth / Sessions | **N/A** | No logins, no tokens, no cookies |
| Secrets exposure | **Low** | No `.env`, no API keys committed (verified via grep) |
| Dependency supply chain | **Medium** | 3 direct + 15 dev deps pulled from npm registry at build time; no lockfile CI pinning enforced, no audit gate |
| External CDN trust | **Medium** | Fonts + brand logos loaded from third-party origins |

---

## What the Code Already Does Well

1. **No secrets in the repo.** `.gitignore` covers env files (`*.local`) and node_modules/dist; `grep -r` for `sk-`, `password`, `api_key`, `process.env` finds nothing meaningful in `src/`.
2. **`rel="noopener noreferrer"`** on every external `<a target="_blank">` (Hero CTAs, Contact links, project links) — prevents tab-nabbing and referrer leakage.
3. **Content is rendered as React text nodes**, not `dangerouslySetInnerHTML` (verified: zero usages). Even if a content file were edited maliciously, React escapes HTML by default.
4. **No user input surface.** The only interactions are navigation, modal toggling, and hover — no forms, no search, no uploads.
5. **Focus trap + aria-modal** in `ProjectModal` — good keyboard/AT hygiene, though not a security control per se.

---

## Verified Claims

- `grep -rn "dangerouslySetInnerHTML" src/` → 0 hits
- `grep -rn "process.env\|import.meta.env" src/` → 0 hits
- `grep -rn "localStorage\|document.cookie" src/` → 0 hits (state is all in-memory React)
- No `fetch(`/`axios`/WebSocket anywhere → no client-server trust boundary to attack
- The only `window` external input: `deviceorientation` (permission-gated on iOS) and mouse/touch events

---

## Recommendations (ranked by value)

### 1. Dependency audit gate (Medium → high value)
Lockfile exists (`package-lock.json`) — enforce it with `npm ci` in CI, and run `npm audit --omit=dev` periodically. Add a `predeploy` step if CI is introduced:

```bash
npm audit --omit=dev
```

### 2. Supply-chain hygiene for the media CDN
`public/` media is self-hosted (good). Brand logos come from `cdn.simpleicons.org` — a third party could, in theory, serve different bytes tomorrow. Options:
- Acceptable for a portfolio, but add `crossorigin` + `referrerpolicy="no-referrer"` to the `<img>`s in `Brands.tsx` (cheap).
- Long-term: inline the ~24 icons as SVGs (they're all in `public/icons.svg` already, unused).

### 3. If a contact form / backend is ever added (this is where the real surface appears)
- **Validate server-side** (zod) — never trust the client.
- **Rate limit** the endpoint (e.g. Vercel Edge middleware or Upstash Redis) to prevent spam/abuse.
- **Honeypot field** + simple arithmetic challenge to cut bots.
- **Never** put SMTP keys / Supabase keys in `src/` — keep them in platform env vars, out of the bundle.
- Add `Content-Security-Policy` header once you control the host's headers.

### 4. Headers on the static host (do this now — zero code)
Once deployed to any CDN/Vercel/Netlify, set:

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; img-src 'self' data: https://cdn.simpleicons.org; font-src https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; media-src 'self'; script-src 'self'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `gyroscope=(self)` (the cube uses the gyro — allow self) |

> ⚠️ `'unsafe-inline'` for styles is needed because styles are injected inline by React/Framer Motion; `script-src 'self'` is safe because no CDN scripts are used.

### 5. HSTS & HTTPS
Static hosts do this by default; just confirm on the dashboard. No mixed-content: all external URLs in code already use `https://`.

### 6. Privacy notes
- No analytics scripts exist (good for privacy).
- The device gyroscope permission prompt appears on iOS after a tap — that's a user-gesture-gated permission, standard, no data leaves the device.

---

## Honest Limitations

- No automated security scanning is configured (no CodeQL, no Dependabot) — the repo has zero `.github` workflows.
- `favicon.svg`/`icons.svg` are self-authored; no third-party blobs in `public/`.
- If the site is later deployed to GitHub Pages, ensure the Pages origin's CSP isn't nullified — Pages applies no CSP by default, so the header recommendations above are the mitigation.

> Next: [Deployment](deployment.md) · [Back to README](../README.md)