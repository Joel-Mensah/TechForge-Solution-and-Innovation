# 08 — Network, Infrastructure & Hosting Hardening

## 1. The architecture (today)
```
Visitor ──HTTPS──▶ GitHub Pages (CDN, TLS terminated by GitHub, no custom headers)
                          ▲
                          └─ DNS (default *.github.io or a custom domain)
```
You do not manage a server, firewall, or OS. Hardening focuses on **repo/DNS
hygiene** and **adding a header-capable layer**.

## 2. GitHub Pages hardening
- [ ] **Settings → Pages → Enforce HTTPS** = ON.
- [ ] Use the default `*.github.io` domain, or a custom domain with DNSSEC if you own it.
- [ ] Enable **branch protection** on `main` (no direct pushes; require review).
- [ ] Enable **secret scanning**, **push protection**, **Dependabot**.
- [ ] Restrict who can publish; remove unused deploy keys/webhooks/apps.
- [ ] Review the GitHub **audit log** periodically.
- [ ] Avoid `CNAME`/DNS dangling records (subdomain-takeover risk if a domain is removed).

## 3. Adding full security headers — Cloudflare in front (recommended)
GitHub Pages can't send headers. Put **free Cloudflare** in front of the site,
then inject headers via **Rules → Transform Rules → Modify Response Header**
(or a Worker). Set:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: <same policy as the <meta> in index.html, PLUS frame-ancestors 'none'>
Cross-Origin-Opener-Policy: same-origin
```
> When you add the CSP as a **header**, add `frame-ancestors 'none'` (impossible
> via `<meta>`). Keep the `<meta>` version as a defense-in-depth fallback.

Steps:
1. Add the domain to Cloudflare, update nameservers.
2. Enable **SSL/TLS → Full (strict)** and **Always Use HTTPS**.
3. Enable **Automatic HTTPS Rewrites**.
4. Add the response-header rules above.
5. Re-test with the tools in `README.md`.

## 4. Rate limiting & abuse (leads to `09` WAF)
- Cloudflare **Rate Limiting** rule: e.g. max ~10 requests/min per IP to the site
  root in a "high" security level during an attack.
- A **Rate Limiting** rule is especially useful if you later proxy the form
  submission through your own endpoint.

## 5. Firewall rules (Cloudflare / future Nginx)
- Cloudflare **WAF Managed Rules** on (free tier includes a baseline).
- Block known-bad ASNs/countries only if abuse justifies it (avoid breaking users).
- **Future Nginx** baseline (when self-hosting):
  ```nginx
  server_tokens off;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  limit_req_zone $binary_remote_addr zone=site:10m rate=10r/s;
  limit_req zone=site burst=20 nodelay;
  ```

## 6. Secure defaults checklist
- [ ] TLS 1.2+ only, prefer 1.3 (see `10`).
- [ ] HSTS + Always Use HTTPS.
- [ ] No directory listing (GH Pages doesn't list; Nginx `autoindex off`).
- [ ] Directory/index files only serve expected content.
- [ ] `.git` never served (GitHub Pages handles this; verify with a request to `/.git/config`).

## 7. Non-functional notes
| Aspect | Impact |
|---|---|
| Cloudflare proxy | Adds ~1 hop latency; negligible, often net-positive (edge cache) |
| Header rules | Zero meaningful perf cost |
| Rate limiting | Protects availability during abuse; tune to avoid blocking legit bursts |
| Maintainability | Headers documented in one place; mirrored in `02` and here |
