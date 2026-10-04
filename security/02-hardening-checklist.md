# 02 — Baseline Secure Configuration Checklist

Target: static site on **GitHub Pages** (with optional **Cloudflare** in front).

## A. Transport / TLS
- [ ] GitHub Pages → **Settings → Pages → Enforce HTTPS** = ON.
- [ ] If a custom domain is used, verify DNS + let GitHub provision the cert.
- [ ] Add **HSTS** at the CDN layer (Cloudflare) — *not possible on GH Pages origin*:
  `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- [ ] TLS 1.2 minimum; prefer 1.3 (CDN setting). Detail in `10-tls.md`.

## B. HTTP security headers
Applied now (via `<meta>` because GH Pages can't send headers):
- [x] `Content-Security-Policy` (in `index.html`)
- [x] `Referrer-Policy: strict-origin-when-cross-origin` (in `index.html`)

Requires a CDN/proxy layer (Cloudflare) — recommended:
- [ ] `Strict-Transport-Security`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`)
- [ ] `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- [ ] `Cross-Origin-Opener-Policy: same-origin`
- [ ] `Cross-Origin-Resource-Policy: same-origin`

## C. Content-Security-Policy (current value)

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com;
img-src 'self' data:;
connect-src 'self' https://formsubmit.co;
form-action 'self';
base-uri 'self';
object-src 'none';
frame-src 'none';
upgrade-insecure-requests
```

Why each piece:
- `script-src 'self'` — only `js/main.js`; blocks injected inline scripts.
- `style-src ... 'unsafe-inline'` — the HTML uses many `style="..."` attributes;
  required until they're moved to CSS classes (hardening backlog below).
- `style-src https://fonts.googleapis.com https://cdnjs.cloudflare.com` — the two
  third-party stylesheets.
- `font-src ... data:` — Font Awesome + Google font files.
- `img-src 'self' data:` — local SVGs plus the CSS data-URI noise texture.
- `connect-src https://formsubmit.co` — the only `fetch()` target.
- `frame-ancestors` is **omitted** (ignored in `<meta>`); use the header at the CDN.

**Verify after any change:** DevTools → Console, look for
`Refused to ... because it violates the following Content Security Policy`.

## D. Subresource Integrity (SRI)
- [x] Font Awesome from cdnjs has `integrity` + `crossorigin` — keep it pinned.
- [ ] Google Fonts **cannot** be SRI-pinned (served dynamically). Options:
  - Self-host the fonts (`assets/fonts/`) and load them with `@font-face` → removes
    the dependency entirely (best for privacy + supply chain).
  - Or accept the risk and keep the `preconnect` hints.
- [ ] When upgrading Font Awesome, recompute the `integrity` hash (see `07`).

## E. Static file serving
- [ ] Keep a single source of truth: no stray/minified duplicates.
- [ ] Add `404.html` for a friendly not-found page (optional).
- [ ] Add a `.gitignore` (OS files, editor folders, secrets).
- [ ] Add `robots.txt`/`sitemap.xml` if SEO matters (not security-critical).

## F. Secrets & repo hygiene
- [ ] No secrets in the repo (verified — the only external value is the public email).
- [ ] Turn on GitHub **secret scanning** + **push protection**.
- [ ] Turn on **Dependabot** alerts.

## G. Non-functional requirements
| Requirement | Target | How |
|---|---|---|
| Performance | No added render-blocking requests | Removed duplicate Fonts `@import`; SRI/headers add negligible cost |
| Performance | Fonts preconnected | `preconnect` hints already present |
| Maintainability | One place to change the CSP | Keep CSP in `index.html` head + mirrored in this doc |
| Maintainability | Third-party deps pinned | Font Awesome version + integrity hash pinned |
| Reliability | No single point of lead loss | Email best-effort + WhatsApp fallback |
| Privacy | Minimal third parties | Consider self-hosting fonts to drop Google |

## Hardening backlog (optional, higher effort)
- [ ] Move inline `style="..."` attributes into classes → allows dropping
  `'unsafe-inline'` from `style-src` (strongest CSP win).
- [ ] Self-host fonts and Font Awesome → `script-src`/`style-src`/`font-src` become
  `'self'` only.
- [ ] Put Cloudflare in front → add HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
  `Permissions-Policy`.
