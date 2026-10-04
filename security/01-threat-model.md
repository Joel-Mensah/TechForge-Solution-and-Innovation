# 01 — Threat Model

**Scope:** The static TechForge Solutions site as deployed on GitHub Pages, plus
its third-party integrations (FormSubmit.co, Google Fonts, Font Awesome, WhatsApp).

**Method:** Lightweight STRIDE-ish analysis — attacker goals → entry points →
mitigations, across authentication, authorization, data in transit, data at rest,
and business logic.

---

## 1. Attacker goals

| Goal | Why it matters here |
|---|---|
| Deface or alter the site | Reputation damage for a business marketing itself on trust |
| Inject scripts (stored/reflected XSS) | Steal visitor data, redirect to phishing/malware |
| Harvest PII from the contact form | Name + phone + project details are valuable for spam/scam |
| Spam / abuse the contact form | Inbox flooding, FormSubmit reputation, DoS of the business email |
| Impersonate the site (phishing clone) | Fraud visitors via lookalike domains |
| Compromise supply chain | Poison Google Fonts / Font Awesome / FormSubmit dependency |
| Account takeover | GitHub account (repo control) or Gmail inbox (lead theft) |
| Deny availability | Make the site unreachable (limited surface on GH Pages) |

## 2. Entry points (real)

| # | Entry point | Notes |
|---|---|---|
| E1 | **GitHub account / repo** | Whoever controls the repo controls the site content |
| E2 | **Gmail inbox** `techforgesolutions7@gmail.com` | Receives all leads; exposed in `js/main.js` |
| E3 | **Contact form → FormSubmit.co** | Accepts untrusted input; forwards PII |
| E4 | **Third-party CDNs** (Google Fonts, cdnjs) | Executed/loaded in visitors' browsers |
| E5 | **DNS / domain** (if a custom domain is added) | Hijack → full site takeover |
| E6 | **Visitor browser / links** | `target="_blank"` links, WhatsApp deep links |
| E7 | **Google Fonts `<meta name="referrer">`/CSP mistakes** | Misconfig can break or loosen protections |

## 3. Mitigations by domain

### Authentication
- **E1 (GitHub):** Enable 2FA (TOTP/hardware key), use a strong unique password,
  limit repo collaborators, enable GitHub secret scanning + Dependabot.
- **E2 (Gmail):** Enable 2-Step Verification, app-specific passwords or OAuth for
  any automation, review forwarding rules and filters regularly.
- There is **no end-user authentication** on the site (nothing to protect); do not
  add one without a backend (see appendix).

### Authorization
- Least privilege on the GitHub org/repo: only trusted maintainers get `write`.
- Protect `main` with a branch protection rule; require PR review for changes that
  touch `index.html`/`js/main.js` (the trust boundary of what gets served).
- No client-side authorization exists or should be trusted — never gate real
  content behind JS-only checks.

### Data in transit
- HTTPS enforced by GitHub Pages (Enable *Enforce HTTPS*).
- `Referrer-Policy: strict-origin-when-cross-origin` (applied via `<meta>`).
- All third-party resources loaded over HTTPS; Font Awesome pinned with **SRI**.
- The contact form POSTs over TLS to `https://formsubmit.co`; CSP `connect-src`
  restricts outbound fetch to that origin only.
- WhatsApp/tel/mailto links are user-initiated navigations — no data leaves without
  the user acting.

### Data at rest
- **No database.** The only "at rest" copy of submitted data is the **Gmail
  inbox** and FormSubmit's transient storage.
- Protect the inbox with 2FA; apply Gmail retention/auto-delete rules if desired.
- Do **not** commit `.env`, tokens, or backups of leads to the repo (currently
  none present — keep it that way; add a `.gitignore`).

### Business logic
- The only business logic is the **inquiry → email/WhatsApp** flow.
- Trust boundary: **all form input is untrusted**. It is only ever placed into
  (a) a URL-encoded WhatsApp string and (b) a JSON body — never into `innerHTML`.
- Business-logic abuse = **spam/automation**. Mitigate with honeypot, rate limits
  (see `08`/`09`), and monitoring of submission volume.
- Guard against **lead loss**: the email is best-effort with a WhatsApp fallback
  (already implemented) — keep both paths.

## 4. Assumptions & residual risk
- GitHub Pages TLS and DDoS absorption are trusted (they are, at this scale).
- Some header-only protections **cannot** be applied on GH Pages (see README) —
  this is the main residual gap; solve with Cloudflare.
- The business email is intentionally public; treat it as known to attackers.

---

## Appendix — Future backend (Node.js + Express + PostgreSQL + Nginx)

Apply the same framework when a server is introduced:

| Domain | New risks | Baseline mitigations |
|---|---|---|
| Authentication | Credential stuffing, brute force | Argon2id/bcrypt, MFA, rate-limit + lockout, breach-password checks |
| Authorization | IDOR, privilege escalation | Server-side RBAC on every request, deny-by-default, object-level checks |
| Data in transit | MITM | TLS 1.2/1.3 only, HSTS preload, secure cookies |
| Data at rest | DB theft, PII leak | Encrypt volumes + column-level for PII, KMS-managed keys, least-privilege DB roles |
| Business logic | Abuse, fraud, race conditions | Server-side validation, idempotency keys, transactional integrity, audit logging |
| Nginx | Header gaps, info disclosure | Security headers, `server_tokens off`, rate limiting, WAF |

See `04`, `05`, `06`, `08`, `09`, `10` for the detailed versions.
