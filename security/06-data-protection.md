# 06 — Data Protection (PII, transit, at rest, retention)

## 1. What personal data this site touches
The contact form collects, and FormSubmit emails to
`techforgesolutions7@gmail.com`:
- **Name** (PII)
- **Phone / WhatsApp number** (PII)
- **Service** and **Budget** (business context)
- **Project details** (free text — could contain PII if the visitor writes it)
- **Submitted At / Submitted From** (metadata)

There is **no database** — the at-rest copy lives in the **Gmail inbox** and
FormSubmit's transient processing.

## 2. Data minimization
- [ ] Only collect what you need to quote/contact. (No email field is collected —
  acceptable; add it later only if you need to reply by email.)
- [ ] Don't log/mirror submissions anywhere else.
- [ ] Don't commit any lead exports to the repo; keep a `.gitignore`.

## 3. In transit
- [x] HTTPS everywhere (GitHub Pages).
- [x] `Referrer-Policy: strict-origin-when-cross-origin` (limits leakage to third parties).
- [x] CSP `connect-src` limited to `https://formsubmit.co` (no other outbound egress).
- [x] Third-party assets loaded over HTTPS; Font Awesome pinned with SRI.
- [ ] (Recommended) Reduce third parties by self-hosting fonts → less PII/telemetry
  exposure to Google.

## 4. At rest
- Protect the **Gmail inbox** (2FA, review filters/forwarding).
- If you later add a backend/DB:
  - Encrypt disk/volumes **and** sensitive columns (name, phone) at rest.
  - Use **KMS/vault-managed keys** with rotation; never hard-code keys.
  - Hash/index only what you must (e.g. store phone encrypted, searchable via token).
  - Separate PII from analytics data.

## 5. Key management (future)
- [ ] Keys in a managed store (AWS KMS, GCP KMS, HashiCorp Vault) — not in code/env files.
- [ ] Rotation schedule + separation of duties; least-privilege key policies.
- [ ] Document key owners and recovery.

## 6. Retention & deletion
- [ ] Define a retention window for lead emails (e.g. **12 months**), then delete.
- [ ] Implement Gmail auto-delete/archive labels for old inquiries.
- [ ] Honour deletion requests promptly (see `13` for the policy text).
- [ ] Do not retain data you cannot justify (minimisation principle).

## 7. Access
- [ ] Only the intended inbox holder(s) can read leads.
- [ ] Prefer a shared mailbox with its own 2FA over personal forwarding chains.
- [ ] Log/limit who can change form routing.

## 8. Data-flow diagram (text)
```
Visitor browser ──HTTPS──▶ index.html (GitHub Pages)
      │  (fills form)
      ▼
 js/main.js ──HTTPS fetch──▶ https://formsubmit.co ──email──▶ Gmail inbox
      │
      └──HTTPS──▶ wa.me/… (opens WhatsApp with encoded text)
```
Every arrow is TLS-protected; the only persistent store is the Gmail inbox.
