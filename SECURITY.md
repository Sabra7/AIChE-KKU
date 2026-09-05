# Security

## Reporting a vulnerability

Report privately through GitHub Security Advisories on
[Sabra7/AIChE-KKU](https://github.com/Sabra7/AIChE-KKU/security/advisories/new).
Please do not open a public issue for anything exploitable.

There is no separate security mailbox — the chapter has no official email
address yet, which is also why the site itself has no contact form.

Expect an acknowledgement within a week. This is a student project maintained
in spare time, so please size your expectations accordingly.

---

## What this application is

**A brochure site with no backend.** Understanding that is most of the security
model, because it removes most of the categories a review would normally cover.

- Two pages, both statically generated at build time: Arabic at `/`, English at
  `/en`. Plus `robots.txt`, `sitemap.xml`, the icons and the Open Graph images.
- **No server-side code paths.** No API routes, no route handlers, no server
  actions, no middleware.
- **No database**, no ORM, no queries — therefore no SQL or NoSQL injection.
- **No authentication, no authorization, no sessions, no accounts, no
  passwords, no tokens.** Nothing is access-controlled because there is nothing
  non-public to control.
- **No user input.** No forms, no search, no comments, no file uploads, no query
  parameters read by any component.
- **No cookies, no `localStorage`, no `sessionStorage`.**
- **No analytics and no third-party scripts.** Nothing runs on the page that is
  not in this repository.
- **No environment variables.** The whole configuration is checked-in
  TypeScript under `data/`. There is no `.env`, no secret store, and no secret
  to leak. If a future change needs one, that is the moment to re-open this
  file.

The categories a reviewer would normally look for therefore evaluate as
*not applicable*, not as *unaudited*: SQL/NoSQL injection, IDOR/BOLA, CSRF,
SSRF, command injection, path traversal, insecure deserialisation, insecure
file upload, broken access control, session fixation, and password handling.

## Architecture and trust boundaries

```
Visitor ──HTTPS──▶ Static host (Vercel) ──▶ prerendered HTML/CSS/JS/images
                                             (built from this repo)

Visitor ──click──▶ Google Forms      (joining — handled entirely by Google)
Visitor ──click──▶ LinkedIn / TikTok / X / Instagram / Google Maps
```

The only trust boundary the site owns is the build: **whatever is committed to
`data/` is published verbatim.** There is no second boundary at runtime,
because no runtime input exists.

The join flow leaves the site entirely. Applicant data is submitted to, stored
by, and governed by Google Forms. This project never sees it, and any privacy
notice for that data is Google's and the chapter's, not this repository's.

## Sensitive data handling

There is none, by design.

The repository does contain personal information that was **published with
consent**: team members' names, roles, majors, self-written biographies and the
public profile links they supplied, plus their portrait photographs under
`public/team/`. Treat additions the same way — a member's entry in
`data/team.ts` is public the moment it merges. Never add a phone number, a
personal email address, a student ID, or a link the person did not offer for
publication.

`app/(ar)/layout.tsx` and `app/(en)/layout.tsx` both carry a Google Search
Console `verification` token. **That is not a secret.** It is published as a
`<meta>` tag in the page source by design; its whole purpose is to be readable
by anyone who fetches the page. It grants no access to the Search Console
property to whoever reads it.

## Input validation and output encoding

There is no input to validate. Content flows one way — `data/*.ts` → React →
static HTML — and React escapes every interpolated value, so a stray `<` in a
biography renders as text.

Two places deliberately bypass or sit outside that escaping, and both are
handled:

**Inline JSON-LD** — `components/Shell.tsx` writes structured data with
`dangerouslySetInnerHTML`, which is the only way to emit a
`<script type="application/ld+json">` body. `serialiseJsonLd()` rewrites every
`<` as the JSON escape `\u003c` before the string reaches the attribute. This
matters because an HTML parser terminates a `<script>` block at the first
literal `</script>` regardless of JSON quoting: without the escape, a chapter
name or partner URL containing that sequence would close the block and inject
markup. The escape is valid JSON and parses back to the identical string.

**SVG text in the OG image script** — `scripts/og-image.mjs` escapes `&`, `<`
and `>` before interpolating chapter names into an SVG document. It is a
developer-run build script whose only inputs are `data/site.ts` and Google's
font CDN, so this is defence in depth rather than a control.

## Outbound links

Every `target="_blank"` link on the site carries `rel="noopener noreferrer"`.
`noopener` denies the opened page a `window.opener` handle back into this one;
`noreferrer` withholds the referrer. Applies to the join button, the chapter's
social links, each team member's links and each partner's links.

**Keep it that way.** A new `target="_blank"` without `rel="noopener"` is the
one genuinely exploitable mistake this codebase can still make.

## Security headers

Set in `next.config.mjs` and verified against a production build:

| Header | Value | Why |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | A mis-served asset cannot be re-interpreted as script. |
| `X-Frame-Options` | `SAMEORIGIN` | The page is not meant to be framed by third parties. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Outbound clicks leak the origin, never the path. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | Nothing on the page uses these APIs, so deny them. |

`poweredByHeader: false` also removes `X-Powered-By: Next.js`, which otherwise
tells a scanner exactly which CVE list to try.

**Two caveats.**

1. Headers are emitted by the server that runs the build output — Vercel, or
   `next start`. A **static export** (`output: 'export'`, commented out at the
   bottom of `next.config.mjs`) has no server, so `headers()` is dropped
   silently. If you deploy that way, configure the same four headers on the
   host: `_headers` on Netlify, a bucket/CDN policy on S3+CloudFront. GitHub
   Pages cannot set custom headers at all.
2. HSTS is not set here because the platform owns it. Vercel serves HSTS on its
   own domains; a self-hosted deployment must add
   `Strict-Transport-Security: max-age=63072000; includeSubDomains` itself.

## Content Security Policy — deliberately absent

There is no CSP, and this is a considered trade-off rather than an oversight.

A CSP worth having has to be strict enough to block inline script. Next.js
hydrates through an inline bootstrap script, so a strict policy requires a
per-request nonce generated in middleware — which converts two statically
prerendered pages into dynamically rendered ones, losing full-page caching on
a site whose entire performance story is that it is static. A permissive
`script-src 'unsafe-inline'` policy would keep the static build but block
nothing that matters.

The exposure it would mitigate is small: the site loads no third-party script,
no analytics, no tag manager, no embeds, and takes no user input, so there is
no injection vector for a CSP to catch. Revisit this the moment any of those
sentences stops being true — an embedded video, an analytics snippet or a
comment widget all change the calculation.

## Dependencies

Four runtime dependencies (`next`, `react`, `react-dom`, `gsap`) and seven
build-time ones. Small surface, deliberately.

`npm audit` as of the last review reports **2 advisories, both `postcss`, both
build-time only**:

- The direct `postcss` devDependency has been upgraded to `8.5.28`, which
  clears it.
- A second copy is vendored inside `next@15.5.25` and cannot be moved without
  upgrading to Next 16, a major version bump. **Accepted risk:** every one of
  those advisories requires attacker-controlled CSS to be fed through PostCSS.
  The only CSS this project processes is `app/globals.css`, from this
  repository. There is no path by which a visitor supplies CSS, and PostCSS
  never runs at request time. Re-evaluate when Next 16 is adopted.

Several packages are behind their latest release (`gsap`, `tailwindcss` 3 → 4,
`typescript`, the `@types/*` set). None carry an advisory today. Run
`npm audit` before each deploy.

Do not add a dependency to this project without a concrete reason. The current
list is short enough to audit by reading it.

## Known limitations

- **No CSP.** Rationale above.
- **No rate limiting, no WAF, no bot protection.** There is no endpoint to
  abuse; the host's own edge absorbs static traffic.
- **No automated dependency scanning in CI.** There is no CI at all. Dependabot
  or a scheduled `npm audit` in an Actions workflow would close this.
- **No Subresource Integrity.** Not applicable — every asset is same-origin and
  content-hashed by the build.
- **`scripts/og-image.mjs` fetches from the network** (Google Fonts CSS, then
  the `.ttf` URLs that CSS names). It is developer-run, never part of
  `npm run build`, and never runs in production — but it does execute a fetch
  against URLs extracted from a remote response. Run it on a machine you trust.

## Recommendations, roughly in order of value

1. **Enable Dependabot** (or a weekly `npm audit` workflow) on the repository.
2. **Upgrade to Next 16** when convenient; it retires the vendored PostCSS
   advisory and is the only way to.
3. **Set the real domain** in `siteUrl` (`data/site.ts`) before launch, so
   canonicals, the sitemap and the OG tags stop pointing at `vercel.app`.
4. **Re-read this file the first time a form, an API route, an analytics
   snippet or an environment variable is added.** Every "not applicable" above
   is contingent on the site staying static and input-free.
