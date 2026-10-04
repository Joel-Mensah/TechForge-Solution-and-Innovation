# 07 — Dependencies, SBOM & Patching

## 1. What we depend on (this project)
| Dependency | How loaded | Pinned? | Integrity |
|---|---|---|---|
| Google Fonts (Inter, Outfit) | `<link>` in `index.html` | Versioned by URL, but served dynamically | ❌ cannot SRI |
| Font Awesome 6.5.1 | `<link>` from cdnjs | ✅ exact version in URL | ✅ SRI `integrity` + `crossorigin` |
| FormSubmit.co | runtime `fetch()` | external SaaS | N/A |
| WhatsApp (`wa.me`) | links | external SaaS | N/A |
| (none) runtime JS libs | — | — | — |

> There is **no `package.json`/lockfile** because the site ships no build step.
> The guidance below is deliberately lightweight but future-proofs a Node build.

## 2. Review the current dependencies
- [ ] Confirm **exact versions** are pinned in URLs (Font Awesome ✅; consider
  pinning the Google Fonts request too, or self-hosting).
- [ ] Verify the Font Awesome SRI hash matches the pinned version (recompute on upgrade).
- [ ] Review the third-party **privacy/security posture** (Google Fonts, cdnjs,
  FormSubmit) at least quarterly.
- [ ] Prefer **fewer third parties** — self-hosting fonts/icons removes both.

## 3. Recomputing SRI when upgrading Font Awesome
```powershell
# Download the exact file, then hash it (sha512, base64)
curl.exe -sL "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" -o all.min.css
openssl dgst -sha512 -binary all.min.css | openssl base64 -A
```
Paste the result into the `integrity="sha512-…"` attribute (keep `crossorigin`).

## 4. Automated checks (GitHub Actions, no build required)
Add `.github/workflows/security.yml` running on push/PR:
- [ ] **Dependency/secret scanning:** GitHub **Dependabot** + **secret scanning**
  (enable in repo settings; Dependabot covers `npm` once a `package.json` exists).
- [ ] **Static analysis (SAST):** CodeQL or Semgrep for any JS.
- [ ] **Link/asset check:** fail if `integrity` attributes disappear.
- [ ] **SBOM generation:** `syft`/`cdxgen` → produce a CycloneDX `sbom.json`
  artifact (becomes meaningful once dependencies exist).

Example minimal workflow:
```yaml
name: security
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Static analysis (JS)
        uses: github/codeql-action/init@v3
        with: { languages: javascript }
      - uses: github/codeql-action/analyze@v3
```

## 5. SBOM & patching workflow
- [ ] Generate an **SBOM** (CycloneDX) on each release and store it as an artifact.
- [ ] Subscribe to advisories for the few things you use (Font Awesome, Google Fonts).
- [ ] Patch **critical/high** within **72h**, medium within **30 days**.
- [ ] After any third-party upgrade: re-verify SRI, re-run the CSP check in DevTools,
  and visually smoke-test the site.

## 6. Maintainability note
Because there is no lockfile, "pinning" here means **exact version strings in
URLs** + **SRI hashes**. That is sufficient for a static site; introduce a real
lockfile only if you add a toolchain.
