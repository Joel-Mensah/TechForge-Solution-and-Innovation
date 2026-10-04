# Prompt Pack (compiled & tailored)

Copy-paste prompts for reviewing or extending this project. All are pre-filled
with the **real stack**: *static site (HTML/CSS/JS), GitHub Pages, FormSubmit.co,
Google Fonts, Font Awesome, WhatsApp links.*

---

### Threat modeling
> You are a security analyst. For a **static marketing site on GitHub Pages**
> (HTML/CSS/JS; no backend/DB), with a contact form that posts PII to
> **FormSubmit.co** and deep-links to **WhatsApp**, identify attacker goals, entry
> points, and mitigations across authentication (GitHub + Gmail accounts),
> authorization, data in transit, data at rest (Gmail inbox), and business logic
> (form abuse). Prioritize actions.

### Hardening
> Generate a hardening plan for a **GitHub Pages** static site given that custom
> HTTP headers are impossible at the origin. Specify what to deliver via `<meta>`
> (CSP, Referrer-Policy), what requires a **Cloudflare** layer (HSTS,
> X-Content-Type-Options, X-Frame-Options, Permissions-Policy), SRI for cdnjs
> assets, and a strict-but-working CSP for a site using inline `style` attributes.

### Monitoring
> Design a security monitoring setup for a **serverless static site**: relevant
> log sources (GitHub audit log, Gmail security, FormSubmit, optional Cloudflare),
> alert rules (new-device logins, forwarding changes, form-spam spikes, downtime),
> and a weekly review checklist.

### Incident response
> Provide a concise 24-hour incident response plan for a **credential compromise**
> of a GitHub/Gmail account controlling a static site: containment, eradication,
> communication, rollback, and post-mortem steps.

### CI/CD security
> Outline a secure CI/CD gate for a **GitHub Pages** deployment with no build step:
> required reviews on `main`, secret scanning, Dependabot, SAST (CodeQL), an
> integrity assertion (SRI present, CSP present), SBOM generation, and rollback
> criteria using `git revert`.

### Auth & sessions (future backend)
> Review an authentication flow and propose improvements for **Node.js + Express**:
> password policy, MFA, session management (HttpOnly/Secure/SameSite cookies,
> short-lived access + rotating refresh tokens), and protections against brute
> force and credential stuffing.

### Input validation (this codebase)
> For a vanilla-JS contact form, list concrete rules to validate name/phone/service/
> budget/details, and guarantees to avoid DOM XSS (no user data in `innerHTML`,
> use `textContent`), plus how the applied CSP constrains injected scripts.

### Data protection
> Given PII (name, phone, project details) flowing to a Gmail inbox via
> FormSubmit.co, specify transport protection, minimal at-rest handling, retention
> (12 months) and deletion, and what changes when a Postgres backend is added
> (encryption at rest, KMS keys, least-privilege DB roles).

### Dependencies & SBOM
> Review third-party web dependencies (Google Fonts, Font Awesome via cdnjs,
> FormSubmit.co) for supply-chain risk; define a patching workflow and an SRI
> re-computation procedure; propose an SBOM step for a build that currently has no
> package manager.

### WAF tuning
> Configure a **Cloudflare** WAF to block scanners (`/.git`, `/.env`, wp-admin
> probes, traversal) and rate-limit abuse for a static site, while allowing
> legitimate bots and static assets; give a simulate-then-enforce rollout.

### TLS
> Given GitHub Pages auto-provisions TLS, specify what can/can't be set there and
> how to add TLS 1.2+ enforcement, HSTS, OCSP stapling, and certificate-expiry
> monitoring via a CDN.

### Compliance
> Map this site's data flows to **GDPR / CCPA / Ghana Act 843**, produce a gap
> analysis, and draft a data-retention & deletion policy aligned with minimisation.
