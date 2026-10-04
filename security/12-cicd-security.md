# 12 — Secure CI/CD & Deployment

## 1. Current deployment model
- **GitHub Pages serves directly from `main`** — a push to `main` deploys.
- There is **no build step** and **no secrets** in the pipeline (good).
- Therefore the pipeline risk is mainly **who can push** and **what they push**.

## 2. Supply-chain protections
- [ ] **Branch protection** on `main`: require PR + review, no force-push, status
  checks required.
- [ ] **Signed commits** (optional but recommended) for maintainers.
- [ ] **Pin** all third-party resources by exact version + **SRI** (Font Awesome ✅).
- [ ] **Code review** required for changes to `index.html`, `css/styles.css`,
  `js/main.js` (these define what visitors execute).
- [ ] Enable Dependabot + secret scanning (see `07`).

## 3. Secret management
- [ ] Keep **zero secrets** in the repo (currently true — preserve it).
- [ ] Add a `.gitignore` and never commit `.env`, tokens, or lead exports.
- [ ] If automation is added, use **GitHub Actions secrets** or a vault/KMS; never
  echo secrets in logs.
- [ ] If a secret leaks: rotate immediately, then purge history.

## 4. Environment separation (future)
When a backend exists, separate **dev / stage / prod**:
- Distinct GitHub Environments with their own secrets + protection rules (required
  reviewers for `prod`).
- Least-privilege deploy roles (scoped tokens, OIDC to cloud, no long-lived keys).
- Promote the **same artifact** through environments (no rebuild per env).

## 5. Deployment roles & least privilege
- [ ] Deploy credentials can **only publish** — not modify repo settings or secrets.
- [ ] Prefer **OIDC** federation over static cloud keys.
- [ ] Time-boxed, audit-logged deploys.

## 6. Pre-deployment security gates
Add a `.github/workflows/security.yml` (no build needed) that runs on PR:
- [ ] **SAST:** CodeQL/Semgrep on `js/**`.
- [ ] **Dependency scan:** Dependabot (and `npm audit` once a lockfile exists).
- [ ] **Config drift / integrity checks:** fail the build if:
  - the `integrity` attribute on the Font Awesome tag is missing,
  - the CSP `<meta>` disappears,
  - unexpected hosts appear in `<link>`/`<script>` `src`.
- [ ] **HTML/link lint** to catch broken or external-unknown references.
- [ ] **SBOM** artifact generated on release.

Example gate (integrity assertion):
```yaml
- name: Assert SRI + CSP present
  run: |
    grep -q 'integrity="sha512-' index.html
    grep -q 'http-equiv="Content-Security-Policy"' index.html
```

## 7. Rollback criteria & procedure
- **Trigger rollback** if: site defaced, CSP/headers regressed, broken layout in
  prod, or a malicious commit landed.
- **Procedure:** `git revert <bad-commit>` (or reset to the last good tag) → push →
  GitHub Pages redeploys within ~1 min. Keep a known-good tag.
- **Maintainability:** document the last-good commit/tag in the incident channel.

## 8. Non-functional notes
| Aspect | Impact |
|---|---|
| Required reviews | Slower merges, safer releases |
| Security gates | Add CI minutes (GitHub-hosted free for public repos) |
| Rollback via revert | Fast, auditable, keeps history |
