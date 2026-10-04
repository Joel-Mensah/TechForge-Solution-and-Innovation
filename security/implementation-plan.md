# Implementation Plan — Phased Roadmap

Priority, effort, and owner-friendly steps for this specific site. Work top-down.

## Phase 0 — Done (applied in this change)
- [x] Tailored threat model, risk register, and full doc pack (`/security`).
- [x] `Content-Security-Policy` delivered via `<meta>` in `index.html`.
- [x] `Referrer-Policy: strict-origin-when-cross-origin` via `<meta>`.
- [x] Removed the duplicate Google Fonts `@import` from `styles.css`.
- [x] Verified: single external script, no inline handlers, no DOM-XSS sinks.
- [x] Confirmed Font Awesome keeps SRI; no secrets in the repo.

## Phase 1 — Today (zero/low cost, manual)
- [ ] **Verify the CSP** — open the site, DevTools → Console; fix any
      `Refused to ...` errors. (Especially: fonts/icons still render.)
- [ ] **GitHub → Enforce HTTPS** on (Settings → Pages).
- [ ] Enable **2FA** on GitHub **and** the Gmail inbox.
- [ ] Enable **Dependabot alerts** + **secret scanning** in the repo.
- [ ] Confirm **FormSubmit** form is activated; consider a random alias.
- [ ] Add a **`.gitignore`** (OS/editor files, `.env`, exports).

## Phase 2 — This month (recommended)
- [ ] Add **branch protection** on `main` (PR + review, no force-push).
- [ ] Publish a **Privacy Policy** page + consent note near the form (`13`).
- [ ] Adopt the **retention/deletion policy**; set Gmail auto-delete for old leads.
- [ ] Add a **`.github/workflows/security.yml`** with SAST + integrity assertions (`12`).
- [ ] Run **baseline scans** (Mozilla Observatory, securityheaders.com) and record results.

## Phase 3 — Next quarter (stronger posture)
- [ ] Put **Cloudflare** in front → add HSTS, `nosniff`, `X-Frame-Options`,
      `Permissions-Policy`, and CSP `frame-ancestors 'none'` as **headers** (`08`).
- [ ] Enable **Cloudflare WAF** (managed rules) in simulate → enforce (`09`).
- [ ] Add **uptime + TLS-expiry monitoring** (`10`, `11`).
- [ ] Run the first **tabletop exercise** (`14`).

## Phase 4 — Hardening backlog (optional, higher effort)
- [ ] Move inline `style="..."` attributes into CSS classes → drop
      `'unsafe-inline'` from `style-src` (strongest CSP win).
- [ ] **Self-host fonts and Font Awesome** → `script-src`/`style-src`/`font-src`
      become `'self'`; removes Google/cdnjs third parties.
- [ ] Add SRI-recompute + link-lint automation.

## Phase 5 — When a backend is added (Node/Express/Postgres/Nginx)
- [ ] Threat-model the server side (`01` appendix).
- [ ] Implement auth/sessions (`04`), server-side validation (`05`), encryption +
      KMS (`06`), WAF (`09`), TLS (`10`), logging/IR (`11`), secure CI/CD (`12`).

## Owners & cadence
| Area | Owner | Cadence |
|---|---|---|
| Repo/account security | Repo owner | On change |
| Leads/PII + retention | Inbox owner | Monthly review |
| Headers/CSP verification | Web owner | After every change |
| Full doc review | Owner | Every 6 months |

## Definition of done (this cycle)
A visitor can load the site with the CSP active (no console violations), the
contact form still delivers email + WhatsApp, HTTPS is enforced, and all Phase 1
items are checked.
