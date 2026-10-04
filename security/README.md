# Security Plan — TechForge Solutions - Innovation

A tailored security program for this project. Everything here is written for the
**actual** stack, not a generic template.

## What this project actually is

| Area | Reality |
|---|---|
| App type | Static site: `index.html`, `css/styles.css`, `js/main.js`, `assets/*` |
| Backend | **None** — no server, database, auth, or sessions |
| Host | **GitHub Pages** (static hosting, HTTPS enforced by GitHub) |
| Form handling | **FormSubmit.co** AJAX endpoint → emails `techforgesolutions7@gmail.com` |
| Messaging | WhatsApp deep links (`wa.me/233200470536`) |
| Third-party | Google Fonts, Font Awesome (cdnjs, SRI-protected) |

## ⚠️ The GitHub Pages constraint (read this first)

GitHub Pages **cannot send custom HTTP response headers**. There is no
`_headers`, `.htaccess`, or Nginx config you can use. Consequences:

| Header | Can we set it on GH Pages? | What we do instead |
|---|---|---|
| `Content-Security-Policy` | Partially — via `<meta http-equiv>` | ✅ Applied in `index.html` (see `02-hardening-checklist.md`) |
| `Referrer-Policy` | ✅ via `<meta name="referrer">` | ✅ Applied |
| `Strict-Transport-Security` | ❌ header-only | Enforce HTTPS in repo settings; add at CDN (see `08`) |
| `X-Content-Type-Options` | ❌ header-only | Add at CDN/proxy layer |
| `X-Frame-Options` | ❌ header-only | Add at CDN, or use CSP `frame-ancestors` at CDN |
| `Permissions-Policy` | ❌ header-only | Add at CDN/proxy layer |

**If you need full header control:** place free **Cloudflare** in front of
GitHub Pages and inject the headers there. Steps are in
`08-network-infra.md`. Until then, the `<meta>` CSP + `Referrer-Policy` are the
best achievable on the origin.

## File index

| File | Covers |
|---|---|
| `implementation-plan.md` | Phased roadmap & priority for this site |
| `01-threat-model.md` | Attacker goals, entry points, mitigations (+ future-backend appendix) |
| `02-hardening-checklist.md` | Headers, CSP, SRI, TLS, static serving, non-functional reqs |
| `03-risk-register-owasp.md` | OWASP Top 10 risk register (likelihood / impact / mitigation) |
| `04-auth-session.md` | Auth, MFA, sessions (future-backend ready) |
| `05-input-validation-secure-coding.md` | Input validation, output encoding, XSS/CSRF/injection |
| `06-data-protection.md` | PII in transit/at rest, key management, retention |
| `07-dependency-sbom.md` | Dependency review, SBOM, patching workflow |
| `08-network-infra.md` | Firewall/rate limiting, reverse proxy, Cloudflare header injection |
| `09-waf.md` | WAF tuning for this stack |
| `10-tls.md` | TLS versions/ciphers, cert rotation, monitoring |
| `11-monitoring-ir.md` | Logging, monitoring, alerting, IR playbook |
| `12-cicd-security.md` | Secure CI/CD, secrets, dependency pinning, security gates |
| `13-compliance.md` | GDPR/CCPA mapping & gap analysis, retention/deletion policy |
| `14-tabletop-runbooks.md` | Tabletop exercises + outage/breach runbooks |
| `prompt-pack.md` | Your ready-to-run prompts, compiled & tailored |

## Quick-start checklist (do these now)

- [x] **HTTPS** — GitHub Pages serves HTTPS; enable **Settings → Pages → Enforce HTTPS**.
- [x] **CSP delivered via `<meta>`** — applied in `index.html`.
- [x] **Referrer-Policy via `<meta>`** — applied (`strict-origin-when-cross-origin`).
- [x] **SRI on third-party CSS** — Font Awesome already has `integrity` + `crossorigin`.
- [x] **Removed duplicate Google Fonts `@import`** from `styles.css`.
- [ ] **Verify the CSP doesn't break the site** — open DevTools → Console, check for CSP errors.
- [ ] **Turn on 2FA** for the GitHub account and the Gmail inbox.
- [ ] **Confirm FormSubmit form is activated** and consider using FormSubmit's random alias instead of the raw email.
- [ ] **Add a spam strategy** for the contact form (honeypot already present).
- [ ] *(Recommended)* **Put Cloudflare in front** to gain HSTS + full headers.
- [ ] **Back up** the repo content and document a restore procedure.
- [ ] Run a **baseline scan** (e.g. Mozilla Observatory, securityheaders.com) after changes.

## How to use this pack

1. Work through `implementation-plan.md` top-to-bottom.
2. Treat each numbered file as the checklist for that domain.
3. Re-run the scan tools after each change and record results.
4. Hand `prompt-pack.md` to anyone (or any AI) reviewing the project.
