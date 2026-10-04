# 05 — Input Validation, Output Encoding & Secure Coding

Applies to the only code that handles untrusted input: the contact form in
`js/main.js` (and, when added, any backend).

## 1. Trust boundaries
- **Untrusted:** everything a visitor types (`client-name`, `client-phone`,
  `client-service`, `client-budget`, `client-details`), URL parameters, and
  anything loaded from third-party CDNs.
- **Trusted (relative):** repo-committed source, same-origin assets.

## 2. Current implementation review (good practices already present)
- Input is read with `.trim()` and used only in:
  - a **URL-encoded** WhatsApp string (`encodeURIComponent`) — ✅ safe,
  - a **JSON body** to FormSubmit — ✅ not interpreted as code,
  - and `.innerHTML` — ⚠️ only ever with **constant** strings (icons), never user
    input. The portfolio modal uses **`.innerText`** — ✅ safe.
- **Conclusion:** no DOM-XSS sink currently. **Keep it that way.**

## 3. Rules for this codebase
- **Never** put user input into `innerHTML`, `insertAdjacentHTML`, `document.write`,
  `eval`, `new Function`, `setTimeout(string)`, or `javascript:` URLs.
- Use `textContent`/`innerText` for any dynamic text.
- Validate **on the client for UX** and (in a future backend) **again on the server
  for security** — client validation is never a security control.
- Encode by context: HTML-escape for HTML, URL-encode for URLs, never hand-build SQL.

## 4. Validation rules for the contact form
| Field | Expectation | Enforce |
|---|---|---|
| Name | 1–100 chars, printable | trim, max length, reject control chars |
| Phone | optional, `+`, digits, spaces, `-()`, 7–20 chars | regex allow-list |
| Service | one of a fixed list | allow-list (already a `<select>`) |
| Budget | one of a fixed list | allow-list (already a `<select>`) |
| Details | optional, ≤ 2000 chars | max length |
| Honeypot `_honey` | must be empty | silently drop if filled (already implemented) |

Suggested client guards (add to `initContactForm`):
```js
const MAX = { name: 100, phone: 20, details: 2000 };
if (name.length > MAX.name || phone.length > MAX.phone || details.length > MAX.details) {
  showStatus('error', 'One of your entries is too long.');
  return;
}
```

## 5. Attack-by-attack cheat-sheet
| Attack | Where it would land | Mitigation |
|---|---|---|
| **XSS** | `innerHTML` with user data | Use `textContent`; keep constants-only `innerHTML`; CSP `script-src 'self'` blocks injected scripts |
| **CSRF** | Auto-submitting form | GET/POST with `SameSite` cookies; a public contact form has low CSRF value, but add a token if it ever mutates state |
| **SQL injection** | Future DB layer | Parameterised queries / ORM binds only; never string-concatenate SQL |
| **Path traversal** | Future file endpoints | Canonicalise + allow-list paths; never pass user input to `fs` directly |
| **Open redirect** | Links built from input | Don't construct redirect targets from input; allow-list hosts |
| **Injection via email** (formula/CSV, header) | Lead email | Avoid `\r\n` in headers; keep values as data, not headers |
| **Tabnabbing** | `target="_blank"` | `rel="noopener"` (already used on external links) |

## 6. Review checklist
- [ ] No user input reaches dangerous sinks (audit `innerHTML` usage).
- [ ] All external links use `rel="noopener"` (ideally `noopener noreferrer`).
- [ ] Selects use allow-lists; free-text fields have max lengths.
- [ ] Third-party scripts/styles are pinned (SRI) — see `07`.
- [ ] CSP stays in place and is re-verified after edits.
