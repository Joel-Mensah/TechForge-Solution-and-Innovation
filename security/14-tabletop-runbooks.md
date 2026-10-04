# 14 — Tabletop Exercises & Incident Runbooks

Run these periodically (start quarterly). Each exercise: **Scenario → decision
points → communications → evidence → follow-ups.**

## Exercise 1 — Credential compromise (GitHub or Gmail)
**Scenario:** A maintainer's GitHub or the lead Gmail password leaks via phishing.
- Decision points:
  - How do we detect it (audit log, security email, stranger commits)?
  - Revoke/rotate what, in what order (tokens → password → 2FA reset)?
  - Do we revert the repo to the last good tag and disable Pages briefly?
- Communications: internal owner; (if defaced) a public note on the site/socials.
- Evidence: audit-log export, commit diffs, email headers.
- Follow-ups: force 2FA, add branch protection, enable secret scanning.

## Exercise 2 — Injection / defacement (XSS or malicious script)
**Scenario:** A commit injects a script that redirects visitors or steals input.
- Decision points:
  - Confirm via diff + browser console; is the CSP blocking it (defense worked)?
  - Immediate rollback to last-good commit; rotate any exposed keys.
- Communications: owner; visitors via social channels if it was live long.
- Evidence: malicious commit diff, CSP violation console logs, timeline.
- Follow-ups: tighten required reviews; verify `script-src 'self'` still enforced.

## Exercise 3 — Misconfigured cloud storage (analogy exercise)
**Scenario:** (No S3 here today.) If a future bucket holds lead exports:
- Decision points: make private immediately; rotate access keys; assess exposure.
- Evidence: bucket policy history, access logs. Follow-ups: block public ACLs by default.

## Exercise 4 — Lead-inbox loss / spam flood
**Scenario:** The contact form is spammed, burying real leads, or delivery breaks.
- Decision points: enable CAPTCHA/rate limit; confirm FormSubmit activation status;
  switch to WhatsApp-only temporarily.
- Communications: internal; note current turnaround if leads are delayed.
- Evidence: submission samples, FormSubmit dashboard, timestamps.
- Follow-ups: tune honeypot/CAPTCHA, consider Cloudflare rate limiting.

---

## Runbook — Sudden outage (DDoS or hosting incident)
1. **Confirm** (Uptime monitor + manual `curl`); scope it (global vs region).
2. **Status check:** GitHub Pages status page; Cloudflare status page.
3. **Mitigate:**
   - If DDoS and Cloudflare is in place → toggle **"I'm Under Attack"** mode.
   - If a bad deploy → `git revert` to last-good commit/tag.
4. **Communicate:** brief holding message on socials; a status note if long.
5. **Recover:** confirm site + form + CSP/headers; watch for recurrence.
6. **Post-mortem:** cause, timeline, cost, prevention.

## Runbook — 24-hour credential-compromise response
1. **0–30 min:** reset password, revoke sessions/tokens, force re-enroll 2FA.
2. **30–60 min:** review audit log; revert any rogue commits; disable Pages if defaced.
3. **1–4 h:** scan for persistence (filters, webhooks, deploy keys, OAuth apps).
4. **4–8 h:** restore clean content; re-verify CSP/headers + form delivery.
5. **8–24 h:** notify affected parties if PII was accessed; start post-mortem.
6. **After:** implement one new preventive control; update `11`/`12`.

## Tabletop facilitation tips
- Fix a clock and roles (incident lead, comms, scribe).
- Capture decisions + timeline; the **process** matters more than "winning".
- End with **3 concrete actions** owned and dated.
