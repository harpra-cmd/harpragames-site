# harpragames.com — source

The studio site, kept here so it changes together with the app. Plain static
files: no build step, no fonts or scripts from other sites, no cookies.
Published to the public repo `harpra-cmd/harpragames-site` (GitHub Pages,
HTTPS enforced since 2026-10-25): copy changed files there and push.

**Design rule (2026-10-25 redesign, from the designer's spec): the app is the
source of truth.** `site.css` uses the app's own tokens — navy `#0b1020`, the
gold metal gradient its titles are lettered in, Cinzel capitals for section
bands, Outfit for headings, Inter for reading text, pillow-faced cards with a
thin gold edge, the gold Upgrade button. Every feature claim is checked against
the code (comments at the top of each page say where).

| Path | What it is |
|---|---|
| `/` (`index.html`) | Harpra Games home — no game links in its header or footer (everything about Knighted! is reached through the featured card); two sections: the studio (logo, promise, philosophy), then one featured box holding everything about Knighted! (its board, three cards, the invitation) |
| `/getknighted` (`getknighted.html`) | **The Knighted! page and the store chooser.** Every share link and the card QR point here (`src/sharelink.js`). **This address must never change or break.** Phones arriving from outside the site go straight to their store; iPhones see "Coming soon" until `APP_STORE` is set |
| `/knighted/knights-tour` | "What is the Knight's Tour?": how the knight moves, open vs closed, history, the maths, solving strategies and facts (every claim sourced, list at the foot), with boards in the app's own look and a tour played Guide me style; the search-friendly way into Knighted! (2026-10-26, rewritten to the content brief 2026-11-17). Has its own store row with the same `PLAY_LIVE` / `APP_STORE` switches |
| `/knighted/support` | Help & Support (Apple requires a support URL) |
| `/knighted/privacy` | The privacy policy both stores link to, and `PRIVACY_POLICY_URL` in `src/ui.js`. Source draft: `docs/PRIVACY_POLICY.md` — change both together |
| `/app-ads.txt` | AdMob's file: one line for publisher pub-6410707045255857 (covers Android and iPhone) |
| `analytics.js` | Cookie-free counting with **Umami** (on since 2026-10-26) — see below |
| `robots.txt`, `sitemap.xml` | For search engines: every page may be indexed; **add each new page to the sitemap** |
| `knighted/og-knighted.jpg`, `brand/og-harpra.jpg` | Link-preview images (1200×630) shown by WhatsApp, Facebook, X and others; made from the app's logo and Daily screenshot |
| `fonts/` | Inter 400/600, Outfit 600, Cinzel 700 (latin), copied from the app's `public/fonts` |
| `knighted/google-play-badge.svg` | Google's official "Get it on Google Play" badge (English, web colour), unaltered, from its Partner Marketing Hub (2026-10-25). Keep it at least 28px tall on a plain background; the footer carries Google's trademark line |
| `knighted/knighted-logo.webp` | The app's wordmark (`public/knighted_logo_rich.webp`) at 900 px wide |
| `knighted/favicon.*`, `knighted/apple-touch-icon.png` | The app's own K icon: the tab icon of the Knighted! pages |
| `knighted/shots/` | Screens and the board in all eight themes, taken from the app through the harness routes (`scripts/lib/app-routes.mjs`, `gotoRoute`, 412x915 at 2x, as a Premium player so no ad slot shows), resized to WebP. Retake them when the app's look changes |
| `knighted/art/` | The app's medal art (`public/medals/v2`, shown only where it means medals) and two board crops from the shots. Card icons are inline line icons in the app's Premium-tile style |
| `brand/` | Harpra Games: the logo (from `public/harpra_transparent.png`) and its "H" on navy as the studio pages' tab icon |
| `CNAME`, `.nojekyll` | GitHub Pages: the custom domain, and serve files as they are |

A future game gets `/get<name>` and `/<name>/privacy`, `/<name>/support`.

## Tracking: how players arrive
`getknighted.html` works out where each visitor came from and passes it on:

| Arrival | Tag | Play install referrer | Analytics event |
|---|---|---|---|
| Card QR scan | `?src=qr` (`src/sharelink.js` `QR_LINK`) | `utm_source=qr` | `arrive/qr` |
| Share link | `?src=<context>&look=<card>` | `utm_source=share&utm_medium=<context>&utm_content=<card>` | `arrive/share-<context>` |
| From this site | (referrer) | `utm_source=site` | `arrive/site` |
| Typed / other | none | `utm_source=direct` | `arrive/direct` |

Store searches are reported by the stores themselves (Play Console: "Google
Play search"; App Store Connect: "App Store search"). Taps on store buttons are
`tap: <name>` events; an iPhone seeing "Coming soon" is `view: iphone-soon`; a Help
question opened is `open: <question>`. **Search crawlers and visitors arriving from a
search are never redirected**, or Google could not index `/getknighted`.

## Analytics (Umami, on since 2026-10-26)
Owner's Umami Cloud account on harpragames@gmail.com (free plan); the dashboard is
at cloud.umami.is. Chosen over Google Analytics because it needs no cookies, so no
consent banner: every arrival on `/getknighted` is counted before the redirect,
and the site still sets no cookies. `analytics.js` sends counts to Umami's
endpoint itself (no Umami script is loaded) and only from harpragames.com, never a
local preview. The privacy policy's section 8 "This website" says exactly what
is counted: **change it in the same change as `analytics.js`**.

## SEO
Every page has a canonical address, a description, link-preview tags with an
image, and (home and `/getknighted`) structured data for Harpra Games and the
game. Owner, once: add the site to **Google Search Console** and **Bing
Webmaster Tools** (verify with a DNS TXT record in Cloudflare) and submit
`https://harpragames.com/sitemap.xml`; that is where search queries show up.

## When the Play listing goes public (Android launch day)
1. In `getknighted.html` **and `knighted/knights-tour.html`** set `PLAY_LIVE = true`: Google's badge replaces "Coming soon to
   Google Play", and Android phones arriving from a share or QR go straight to Play.
   (Until then the listing answers "not found", so neither happens.)
2. In `knighted/support.html`, "Which phones can play?": say it is on Google Play.
   Same on the home page (`index.html`): the line under "Explore Knighted!" (Coming soon...).
3. Publish, and open `/getknighted` on an Android phone to see it reach the listing.

## When the iPhone app launches
Set `APP_STORE` in `getknighted.html` and `knighted/knights-tour.html` to the App Store URL (with Apple's
campaign token, so the arrival tags reach App Store Connect). Nothing in the
app changes.

## Still to do
- **At iPhone launch:** swap the "Coming soon / App Store" button for Apple's official
  "Download on the App Store" badge (Apple's badge tool) and add Apple's trademark
  line to the footer. Apple allows the badge only once the app is live.
- A completion/medal screenshot (the harness has no finished-board route yet).

## Preview locally
Serve this folder so that `/getknighted` maps to `getknighted.html` (as GitHub
Pages does), e.g. any static server with clean URLs, and open `/getknighted`.
