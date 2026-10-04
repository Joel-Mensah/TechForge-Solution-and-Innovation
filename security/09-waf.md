# 09 — Web Application Firewall (WAF) Configuration

## 1. Do you need a WAF?
For a **static site**, a WAF is mostly about **availability and bot abuse**, not
application exploits (there's no app to exploit). A free Cloudflare WAF/Managed
Rules layer is the pragmatic choice. If you later add a backend, its value rises
sharply (SQLi, XSS, path traversal, LFI/RFI, SSRF).

## 2. Recommended Cloudflare setup
- [ ] **Managed Rules** (OWASP Core Ruleset) — start in **simulate/log** mode.
- [ ] **Bot Fight Mode** — free; stops basic scrapers/credential-stuffing bots.
- [ ] **Security Level**: Medium normally; High under attack.
- [ ] **Rate Limiting** rule: e.g. `>10 requests/min` per IP to `/` → challenge.
  Tighten for any future form endpoint (e.g. `>5/min`).
- [ ] **Challenge (Managed)** for suspicious fingerprints rather than hard-block.

## 3. Tuning to avoid blocking real users
- Deploy in **log/simulate** first; review for **false positives** (Ghana/EU
  mobile carriers, corporate NATs, WhatsApp/facebook link-preview crawlers).
- Allowlist legitimate bots you want (e.g. Googlebot for SEO) via **Verified Bots**.
- Don't blanket-block countries unless abuse is proven — many real clients use VPNs.
- Exclude static asset paths (`*.css`, `*.js`, `*.svg`, images) from aggressive
  rules to protect caching and performance.

## 4. Rules tuned to this stack
| Rule | Action | Rationale |
|---|---|---|
| Block requests to `/.git/*`, `/.env`, `/*.bak`, `wp-admin/*` | Block | Common scanners; site has none of these |
| Block `?` params like `?file=`, `../` traversal patterns | Block | Path traversal probing |
| Rate-limit form-adjacent POSTs (if proxied) | Challenge | Anti-spam |
| Challenge low-reputation bots | Managed Challenge | Cuts scraping/abuse |
| Allow GET on `/`, `/css/*`, `/js/*`, `/assets/*` | Skip aggressive rules | Performance + availability |

## 5. If you self-host (future Nginx) — ModSecurity/CRS baseline
```nginx
modsecurity on;
modsecurity_rules_file /etc/nginx/modsec/main.conf; # OWASP CRS, paranoia level 1
```
- Start at **paranoia level 1**, log-only (`SecRuleEngine DetectionOnly`), review,
  then move to `On`.
- Tune out false positives on legitimate form fields (long "Project details").

## 6. Operational discipline
- [ ] Review WAF dashboards weekly; note blocked-vs-challenged ratios.
- [ ] Keep an allowlist/exception log with a reason and date.
- [ ] Re-tune after any site change that adds new endpoints.
- [ ] Alert on sudden spikes in challenges/blocks (possible attack — see `11`).

## 7. Non-functional notes
| Aspect | Impact |
|---|---|
| WAF | Sub-ms to low-ms overhead at edge; negligible for static assets |
| Rules | Maintainability risk if over-customised — keep rules few and documented |
| False positives | Biggest risk; always simulate before enforcing |
