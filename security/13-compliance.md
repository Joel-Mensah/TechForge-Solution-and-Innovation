# 13 — Compliance & Governance

> This is **practical guidance**, not legal advice. Confirm specifics with counsel
> based on your jurisdiction (the business operates from **Accra, Ghana**; visitors
> may be in the EU/California, which pulls in GDPR/CCPA).

## 1. Which regimes plausibly apply
| Regime | Applies? | Why |
|---|---|---|
| **GDPR** | Possibly | If you market to / receive EU visitors and process their personal data (name, phone) |
| **CCPA/CPRA** | Possibly | If you serve California residents |
| **PCI-DSS** | ❌ No | No card data is processed or stored on this site |
| **Ghana Data Protection Act, 2012 (Act 843)** | Likely | Local processing of personal data |

## 2. Control mapping (site-relevant)
| Requirement | Current control | Gap / action |
|---|---|---|
| Lawful basis for processing lead data | Legitimate interest / consent via contact form | Add a short consent/privacy note near the form |
| Data minimisation | Only needed fields collected | ✅ keep it minimal |
| Security of processing | HTTPS, CSP, 2FA on accounts | Add CDN headers (`08`) |
| Transparency | — | Publish a **Privacy Policy** page |
| Data subject rights (access/delete) | — | Provide a contact route + respond within statutory window |
| Retention limits | None defined | Define + automate (`06` §6) |
| Breach notification | Ad-hoc | Use IR playbook (`11`, `14`) |
| Records of processing | None | Keep a simple register (below) |

## 3. Gap analysis & remediation plan
| # | Gap | Priority | Remediation |
|---|---|---|---|
| G1 | No Privacy Policy published | High | Add `privacy.html` + link in footer |
| G2 | No explicit consent/cookie note | Medium | Add brief note near form; no cookies are set today (verify) |
| G3 | No retention/deletion policy | High | Adopt policy (§4) + Gmail auto-delete |
| G4 | No header-only protections | Medium | Add Cloudflare (`08`) |
| G5 | No breach process documented | Medium | Adopt IR playbook (`11`/`14`) |
| G6 | No processing register | Low | Create the table in §5 |

## 4. Data retention & deletion policy (ready to adopt)
- **Purpose:** respond to project inquiries and provide quotes.
- **Scope:** names, phone numbers, and project details submitted via the contact form.
- **Retention:** keep inquiry emails for **12 months**; delete or anonymise after
  unless an active engagement requires otherwise.
- **Deletion:** on request, delete the relevant email(s) and any copies; confirm to
  the requester within **30 days**.
- **Minimisation:** do not collect or store data beyond the above.
- **Security:** access limited to authorised inbox holders with 2FA.
- **Backups:** any backup containing lead data inherits the same retention window.

## 5. Simple records-of-processing register
| Data | Source | Purpose | Legal basis | Storage | Retention |
|---|---|---|---|---|---|
| Name | Contact form | Reply/quote | Legit. interest | Gmail inbox | 12 months |
| Phone/WhatsApp | Contact form | Reply/quote | Legit. interest | Gmail inbox | 12 months |
| Project details | Contact form | Scope/quote | Legit. interest | Gmail inbox | 12 months |
| Submitted At/From | Form automation | Context/anti-abuse | Legit. interest | Gmail inbox | 12 months |

## 6. Governance
- [ ] Assign a data owner (who is responsible for lead data + this policy).
- [ ] Review this document every **6 months** or after any change to data flows.
- [ ] Keep change history in git (this folder is version-controlled).
