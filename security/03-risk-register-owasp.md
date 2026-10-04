# 03 — Risk Register (OWASP Top 10, small-business site)

Likelihood & Impact are rated **Low / Medium / High** for *this specific site*
(static, GitHub Pages, FormSubmit, no auth/DB). "Now" = applicable today;
"Future" = applies when a backend/DB is added.

| ID | OWASP 2021 | Relevance | Likelihood | Impact | Concrete mitigations |
|---|---|---|---|---|---|
| R1 | **A01 Broken Access Control** | Low now (no auth), **High future** | Low / High | High | Now: protect the GitHub repo (branch protection, least privilege). Future: server-side RBAC on every request, deny-by-default, object-level ownership checks, no client-side-only gates. |
| R2 | **A02 Cryptographic Failures** | Medium (PII in transit) | Medium | High | Enforce HTTPS; `Referrer-Policy`; avoid sending PII to third parties unnecessarily; future: TLS 1.2+, encrypt PII at rest with KMS, no sensitive data in URLs. |
| R3 | **A03 Injection** | Low (no server/SQL); DOM-XSS risk stays | Low | High | Keep all untrusted input out of `innerHTML` (verified: only constants used). Escape/URL-encode dynamic strings (WhatsApp builder already `encodeURIComponent`s). Future: parameterised queries, output encoding. |
| R4 | **A04 Insecure Design** | Medium | Medium | Medium | Threat-model the inquiry flow (done — `01`); treat all form input as untrusted; add rate limiting + honeypot on the form; design for lead-loss resilience (email + WhatsApp). |
| R5 | **A05 Security Misconfiguration** | **High** (main gap) | Medium | Medium | Apply CSP + `Referrer-Policy` (done); keep repo settings tight; remove the redundant Fonts `@import` (done); add HSTS/`nosniff`/`X-Frame-Options` at CDN. |
| R6 | **A06 Vulnerable & Outdated Components** | High | Medium | Medium | Pin Font Awesome (done via version + SRI); enable Dependabot + secret scanning; review third parties quarterly (`07`). |
| R7 | **A07 Identification & Auth Failures** | High (accounts, not end-users) | Medium | High | 2FA on GitHub **and** Gmail; strong unique passwords; review Gmail filters/forwarding; future: MFA for app users, breach-password checks, lockouts. |
| R8 | **A08 Software & Data Integrity Failures** | Medium (supply chain) | Medium | High | SRI on Font Awesome (done); consider self-hosting fonts; require PR review before merge; never load scripts from untrusted origins. |
| R9 | **A09 Security Logging & Monitoring Failures** | Medium | Medium | Medium | Monitor GitHub audit log + Gmail sign-in alerts + spam trends; define alerts & IR (`11`). No server logs to collect yet. |
| R10 | **A10 Server-Side Request Forgery** | None now; low future | Low | High | Not applicable (no server). Future: allow-list outbound hosts, block metadata IPs, validate URLs. |

## Top priorities for this site
1. **R5 — Misconfiguration:** finish headers (Cloudflare) + verify CSP in DevTools.
2. **R7 — Account security:** 2FA on GitHub and Gmail (protects the two things that
   control the site and the leads).
3. **R6/R8 — Supply chain:** Dependabot + keep SRI; consider self-hosting assets.
4. **R4 — Abuse:** rate limiting / spam controls on the contact form.

## Residual risk statement
On GitHub Pages alone, header-only protections (HSTS, `nosniff`, `X-Frame-Options`,
`Permissions-Policy`) cannot be applied; the `<meta>` CSP covers most client-side
risk. This is **accepted** until a CDN/proxy (Cloudflare) is added — see `08`.
