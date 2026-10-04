# 11 — Monitoring, Logging & Incident Response

## 1. What we can actually observe (static site)
There is no server, so there are **no application/OS logs**. The meaningful
signals are:
- **GitHub** audit log, commit history, Pages deploy events, security alerts.
- **Gmail** sign-in/IP alerts, filters/forwarding changes, lead volume.
- **FormSubmit.co** dashboard (submissions).
- **CDN** (Cloudflare) analytics/WAF events, once added.
- **Uptime** monitoring for availability.

## 2. Log sources & where they live
| Source | Signal | Where |
|---|---|---|
| GitHub | Repo changes, member changes, secret alerts | Repo → Insights/Audit |
| Gmail | Logins, filters, suspicious access | Google security alerts |
| FormSubmit | Submission count/content | FormSubmit dashboard |
| Cloudflare (opt.) | Traffic, WAF blocks, bot score | CF dashboard |
| Uptime (opt.) | Downtime | UptimeRobot/Pingdom |

## 3. Alert thresholds (practical)
| Event | Threshold | Action |
|---|---|---|
| New device/location login (GitHub/Gmail) | Any | Verify; rotate password if unsure |
| Gmail filter/forwarding changed | Any | Investigate immediately (lead theft) |
| Form spam spike | >20/hour (tune) | Enable CAPTCHA / tighten rate limit |
| Site down | 2 consecutive failed checks | Follow outage runbook (`14`) |
| Unexpected repo commit/member | Any | Revert; review access |
| WAF block/challenge spike | 10× baseline | Review as possible attack |

## 4. Centralized visibility (lightweight)
- [ ] Email/label all security notifications into one Gmail label; never mark spam.
- [ ] Weekly manual review checklist (see §7).
- [ ] When Cloudflare is added, enable email alerts for WAF/rate-limit events.
- [ ] (Optional) A small log sink (e.g. a Google Sheet via Apps Script that records
  FormSubmit submissions) for trend analysis — avoid storing sensitive detail.

## 5. Incident Response playbook (this site)
**D — Detect:** alert/report of defacement, spam flood, account breach, or outage.
**C — Contain:** revoke exposed credentials (GitHub tokens, Gmail sessions);
disable the form if it's being abused; enable Cloudflare "Under Attack" if DDoS.
**E — Eradicate:** revert the malicious commit (`git revert`/force-reset to last
good tag); remove malicious filters/forwards; rotate all secrets/keys.
**R — Recover:** redeploy clean `main`; re-verify CSP/headers; confirm site + form;
notify stakeholders (`14`).
**P — Post-incident:** write a blameless post-mortem; add a detection/prevention
control; update this doc.

## 6. Evidence collection (if compromised)
- Export GitHub audit log + commit diff of the malicious change.
- Preserve email headers of phishing/spam notifications.
- Screenshot WAF/analytics around the event window.
- Record timeline in UTC; keep a chain-of-custody note.

## 7. Weekly review checklist
- [ ] Any new GitHub security alerts / Dependabot notifications?
- [ ] Any unexpected logins to GitHub or Gmail?
- [ ] Submission volume normal? Any spam pattern?
- [ ] Uptime OK? Any downtime alerts?
- [ ] Third-party status pages green (cdnjs, Google Fonts, FormSubmit)?
