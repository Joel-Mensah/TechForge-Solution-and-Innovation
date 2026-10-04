# 04 — Authentication, Authorization & Session Security

> **Current state:** this site has **no end-user authentication** and **no
> server-side sessions** — it is static. The "accounts" that actually matter are
> the **GitHub account** (controls the site) and the **Gmail inbox** (receives
> leads). This document secures those now and prepares a baseline for when a
> backend is introduced.

## Part 1 — Accounts that exist today

### GitHub (controls site content)
- [ ] Enable **2FA** (TOTP app or hardware key). Enforce for all collaborators.
- [ ] Strong, unique password stored in a password manager.
- [ ] **Branch protection** on `main`: require PR + review; block force-push.
- [ ] Limit who has `write`/`admin`; remove stale collaborators.
- [ ] Review **SSH keys / PATs / OAuth apps / GitHub Apps**; revoke anything unused.
- [ ] Enable **secret scanning**, **push protection**, and **Dependabot**.

### Gmail (receives PII leads)
- [ ] Enable **2-Step Verification**.
- [ ] Audit **filters, forwarding, delegation, and connected apps** periodically.
- [ ] Use app passwords/OAuth (never the main password) for any automation.
- [ ] Consider FormSubmit's **random alias** instead of the raw address.

## Part 2 — Password policy (for any future admin/user accounts)
- Minimum 12 characters; allow long passphrases; no forced rotation without reason.
- Screen against **breached-password lists** (e.g. k-anonymity HIBP API).
- Ban common/contextual passwords; rate-limit + progressive delays + lockout.
- Store only with **Argon2id** (or bcrypt cost ≥ 12). Never reversible encryption.

## Part 3 — MFA options
- **TOTP** (authenticator apps) — good default, no SMS.
- **WebAuthn / passkeys / hardware keys** — strongest; prefer for admins.
- **Recovery codes** stored offline; disable SMS where a stronger factor exists.

## Part 4 — Session management (future backend)
Guidance to hand to developers:
- **Short-lived access tokens** (5–15 min); **rotating refresh tokens** with reuse
  detection and absolute expiry.
- Prefer **server-side sessions** with opaque IDs for first-party web apps, or
  signed tokens if stateless.
- Cookie attributes:
  - `HttpOnly` — not readable by JS.
  - `Secure` — HTTPS only.
  - `SameSite=Lax` (or `Strict`) — CSRF resistance.
  - `Path=/`, `Domain` scoped as tightly as possible; short `Max-Age`.
- **Regenerate** the session ID on login privilege change; **invalidate** on logout,
  password change, and suspicious activity.
- **Idle + absolute timeouts**; allow "log out everywhere".
- **CSRF:** double-submit token or `SameSite` + origin checks for state-changing ops.
- **Brute force / credential stuffing:** per-IP + per-account rate limits, CAPTCHA
  after N failures, exponential backoff, notify on new-device/login.

## Part 5 — Authorization checklist (future backend)
- [ ] **Deny by default**; grant explicit roles/permissions.
- [ ] Enforce **role-based access control server-side on every request**.
- [ ] Check **object ownership** (prevent IDOR) — not just "is logged in".
- [ ] Centralise authorization in one middleware/policy layer (no scattered checks).
- [ ] **Audit log** all privileged actions (who, what, when, from where, result).
- [ ] Never rely on hidden UI or client-side role checks.

## Current gap summary
| Control | Today | Action |
|---|---|---|
| End-user auth | N/A (static) | Add only with a backend |
| Sessions | N/A | Use Part 4 when backend exists |
| Admin auth | GitHub 2FA | ✅ enable now |
| Lead inbox | Gmail 2FA | ✅ enable now |
| Authorization | N/A | Part 5 when backend exists |
