# 10 — TLS Configuration & Certificate Management

## 1. Current state (GitHub Pages)
- GitHub Pages **terminates TLS** for you and provisions a **Let's Encrypt**
  certificate automatically (for the `*.github.io` host and for verified custom
  domains). Renewal is automatic.
- You can enable **Enforce HTTPS** but you **cannot** change cipher suites or add
  HSTS at the origin.

## 2. Recommended settings (apply at a CDN if you add one)
| Setting | Target | Where |
|---|---|---|
| TLS versions | **1.2 minimum, prefer 1.3** | Cloudflare SSL/TLS |
| Cipher suites | Strong modern suites; disable CBC/3DES | Cloudflare (managed) |
| HSTS | `max-age=31536000; includeSubDomains; preload` | Cloudflare header rule |
| HTTPS redirect | Always Use HTTPS = ON | Cloudflare |
| Automatic HTTPS Rewrites | ON | Cloudflare |
| OCSP Stapling | ON | CDN/Nginx |
| Min TLS for API | 1.2 | Cloudflare |

## 3. Certificate rotation & monitoring
- [ ] GitHub Pages: rely on automatic renewal, but **verify** the cert periodically.
- [ ] Custom domain: ensure DNS/validation records persist so renewal never fails.
- [ ] Monitoring: use a free external checker (e.g. SSL Labs / UptimeRobot SSL
  monitoring) to alert **≥14 days** before expiry.
- [ ] Add a calendar reminder ~30 days before any manual cert expiry.

## 4. Verification commands
```powershell
# Inspect the served certificate chain / expiry
openssl s_client -connect your-domain:443 -servername your-domain </dev/null 2>/dev/null | openssl x509 -noout -dates -issuer
# Check redirect + HSTS (only present once Cloudflare/headers are added)
curl.exe -sSI https://your-domain | Select-String -Pattern "strict-transport|location|HTTP/"
```

## 5. Future Nginx TLS baseline
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305';
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```
Use **Certbot/ACME** for automated issuance + renewal (`certbot renew` via timer).

## 6. Non-functional notes
| Aspect | Impact |
|---|---|
| TLS 1.3 | Faster handshakes, forward secrecy |
| OCSP stapling | Faster validation, less client-side privacy leakage |
| Auto-renewal | Removes outage risk from expired certs |
| Monitoring | Early warning; maintainability via alerts + calendar |
