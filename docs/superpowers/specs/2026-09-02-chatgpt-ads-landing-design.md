# ChatGPT Ads: service card on home + `/chatgpt-ads` landing page

Date: 2026-09-02. Repo: profitbrand1.1 (CRA + React 19, single `src/App.js`, CSS injected once). Deployed on Vercel project `profitbrand1-1` from GitHub `vstoimenov/profitbrand1.1` (main).

## Goals
1. Home page describes ChatGPT Ads as a service.
2. New landing page at `/chatgpt-ads` built from the copy doc "ChatGPT Ads Pilot — landing copy v2 (Sabri Suby style)", **without any of our own prices** (owner quotes prices in a personal offer).
3. Application form writes rows into Google Sheet `gpt ads` (id `1v0mQ2F8meOj5cKoYSdmQg-quaaZVuVS9Fm4XD0LGIl0`, sheet `Лист1`) via a Google Apps Script web app.

## Home page changes (`src/App.js`, `public/index.html`)
- `defaultServices`: insert `{ id: 6, icon: "Sparkles", title: "CHATGPT ADS", desc: ..., active: true, href: "/chatgpt-ads" }` at position 2 (after PERFORMANCE ACQUISITION). Service cards with `href` render as links; the rest stay as before. Bump `DATA_VERSION` to 7 so stored copies refresh.
- Hero subtitle: mention "Meta + ChatGPT Ads".
- "ЦЯЛАТА СИСТЕМА, НЕ ПАРЧЕТА" paragraph mentions ChatGPT Ads.
- Nav (desktop + mobile) and footer: link "ChatGPT Ads" -> `/chatgpt-ads`.
- `index.html`: keywords + JSON-LD `serviceType` gain "ChatGPT Ads".

## Routing
Existing hand-rolled router: `page` state derived from `window.location.pathname` (`/admin` -> admin, else home). Extend: `/chatgpt-ads` -> `"chatgpt"`. `nav(p)` maps `"chatgpt"` -> `/chatgpt-ads`. Popstate handler uses the same resolver. Resolver extracted as `pageFromPath(pathname)` in `src/lib/routing.js` (unit-tested).

## Landing page component `src/pages/ChatGptAds.js`
Props: `nav`, `scrollTo`. Uses existing global classes (`.sec`, `.tg`, `.U`, `.btn`, `.guar`, `.faq*`, `.fg`, `.wp-card`...) plus a small page-scoped CSS block (`cg-*` classes) appended to the global `css` string. Sections (doc numbering):
1. Hero: pre-headline, H1, sub, CTA (scrolls to `#apply`), micro-line "3 въпроса · 60 секунди · вердикт за 48 ч · само 5 пилотни слота за {текущ месец}". Visual: stylised mock of a ChatGPT answer with a "Sponsored" card (pure CSS/JSX, no image).
2. "Мръсната малка тайна" — narrative + 4 bullet "secrets". Copy 1:1.
3. "ПРЕДУПРЕЖДЕНИЕ: Не кандидатствай, ако…" 4 red items + "Кандидатствай, ако…" 3 green items.
4. "Как става — 3 стъпки, нула срещи". Step 2 text: replace "спестил си €1 480 и месец нерви" with "спестил си бюджета и месец нерви".
5. "Какво влиза в пилота" — 6 deliverables. Removed: the "$200 000 / по-малко от €1 500" paragraph, the whole price block, "Не може ли по-евтино?". Replaced by one line: конкретните условия получаваш в персонална оферта в деня на вердикта.
6. "Кой ти казва „не“" — Viktor bio (photo `/viktor.jpg`).
7. Guarantee "плащаме ние" — "(€390)" removed.
8. Apply form `#apply`: fields: what you sell (text), monthly budget (select: под €500 / €500–1 000 / €1 000–3 000 / над €3 000), value per client (select: под €50 / €50–150 / €150–500 / над €500), name, email, website. Validation: all required, email format. Submit -> POST to Apps Script; states: idle / sending / success (inline thank-you text) / error (inline text with retry). Under-button note copy 1:1.
9. FAQ — 6 items, accordion (existing `.faq` classes). "Колко струва един клик" answer keeps the market figure ($3–5 in the US).
10. Final CTA — "спестил си €1 480" -> "спестил си бюджета".
Dynamic: `daysSince("2026-08-24")` for "преди X дни" (min 1), `bgMonthName(new Date())` for the slots line.

## Lead submission (`src/lib/leads.js`)
- `SHEET_ENDPOINT` constant (Apps Script `/exec` URL; empty until the owner deploys the script).
- `buildLeadPayload(form, {now, utm})` -> `{ date, name, email, website, sells, budget, clientValue, verdict, source }`; `verdict` = "не още" when budget is "под €500" or client value "под €50", else "за преглед".
- `submitLead(payload)`: `fetch(SHEET_ENDPOINT, { method: "POST", mode: "no-cors", headers: {"Content-Type":"text/plain"}, body: JSON.stringify(payload) })`. With `no-cors` the response is opaque, so success = fetch resolved. Empty endpoint -> rejects with a clear error (form shows error state).

## Apps Script (`scripts/google-sheets-leads.gs`)
`doPost(e)` parses JSON, appends header row if sheet empty, appends `[date, name, email, website, sells, budget, clientValue, verdict, source]`, returns JSON `{ok:true}`. Deploy as Web App: execute as Me, access Anyone. README-style steps live at the top of the file.

## Tests (`react-scripts test`)
- `src/lib/routing.test.js`: `pageFromPath` for `/`, `/admin`, `/chatgpt-ads`, `/chatgpt-ads/`.
- `src/lib/leads.test.js`: `buildLeadPayload` verdict rules; `submitLead` rejects with empty endpoint.
- `src/lib/dates.test.js`: `daysSince`, `bgMonthName`.

## Out of scope
Admin editing of the landing copy; email notifications; analytics events.
