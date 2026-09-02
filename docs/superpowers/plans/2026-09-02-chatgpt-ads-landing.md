# ChatGPT Ads Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ChatGPT Ads as a service on the PROFITBRAND home page and ship a `/chatgpt-ads` application landing page whose form writes to a Google Sheet.

**Architecture:** The site is a single CRA React app with a hand-rolled router in `src/App.js` (`page` state from `window.location.pathname`). We extract the path resolver into `src/lib/routing.js`, add pure helpers in `src/lib/dates.js` and `src/lib/leads.js`, and render the landing from a new `src/pages/ChatGptAds.js` that reuses the global CSS classes. Leads POST as JSON (no-cors) to a Google Apps Script web app bound to the sheet.

**Tech Stack:** React 19, react-scripts 5 (Jest + Testing Library), lucide-react icons, Google Apps Script.

## Global Constraints
- No prices of our own anywhere on the landing (no €490 / €390 / €600 / €1 480 / "$200 000 vs €1 500"). Market facts (click ≈ $3–5 in the US) and qualification thresholds (client > €150, budget ranges in the form) stay.
- Copy language: Bulgarian, "ти" form, currency €. Copy taken 1:1 from the spec where not removed.
- Existing visual system: fonts Unbounded/Outfit, colours `--y #FFD600`, `--b #080810`; reuse `.sec .tg .U .btn .btn2 .guar .faq .fg .wp-card` classes.
- Bump `DATA_VERSION` to 7 when `defaultServices` changes.
- Tests run with `CI=true npx react-scripts test --watchAll=false`.
- Commit after each task; push to `main` at the end (Vercel auto-deploys).

---

### Task 1: Path resolver `pageFromPath`
**Files:** Create `src/lib/routing.js`, `src/lib/routing.test.js`; Modify `src/App.js` (page init ~line 224, `nav` ~line 286, popstate ~line 309).
**Produces:** `pageFromPath(pathname: string): "home"|"admin"|"chatgpt"`, `pathForPage(page): string`.
- [ ] Test: `/`→home, `/admin`→admin, `/admin/`→admin, `/chatgpt-ads`→chatgpt, `/chatgpt-ads/`→chatgpt, `/x`→home; `pathForPage("chatgpt")==="/chatgpt-ads"`.
- [ ] Run, expect FAIL (module not found). Implement. Run, expect PASS.
- [ ] Wire into App.js: `useState(() => pageFromPath(window.location.pathname))`, `nav` uses `pathForPage(p)`, popstate uses `pageFromPath`.
- [ ] Commit `feat: extract page router, add /chatgpt-ads route`.

### Task 2: Date helpers
**Files:** Create `src/lib/dates.js`, `src/lib/dates.test.js`.
**Produces:** `daysSince(isoDate, now=new Date()): number` (min 1, calendar days), `bgMonthName(date): string` ("септември"), `daysWord(n): string` ("ден"/"дни").
- [ ] Tests: daysSince("2026-08-24", new Date("2026-09-02")) === 9; same day → 1; bgMonthName(new Date("2026-09-02")) === "септември"; daysWord(1)==="ден", daysWord(9)==="дни".
- [ ] FAIL → implement → PASS → commit `feat: date helpers for landing`.

### Task 3: Lead payload + submit
**Files:** Create `src/lib/leads.js`, `src/lib/leads.test.js`.
**Produces:** `SHEET_ENDPOINT` (string const), `BUDGETS`, `CLIENT_VALUES` (string arrays for the selects), `buildLeadPayload(form, {now, source}) → {date,name,email,website,sells,budget,clientValue,verdict,source}`, `validateLead(form) → {field: message}` (empty object = valid), `submitLead(payload, endpoint=SHEET_ENDPOINT) → Promise<void>` (fetch POST no-cors text/plain; rejects `Error("no-endpoint")` if endpoint empty).
- [ ] Tests: verdict "не още" for budget "под €500"; "не още" for clientValue "под €50"; "за преглед" otherwise; validateLead flags empty fields and bad email; submitLead rejects with empty endpoint; submitLead calls global fetch with method POST and JSON body when endpoint set.
- [ ] FAIL → implement → PASS → commit `feat: lead payload/validation/submit helpers`.

### Task 4: Home page service + nav + SEO
**Files:** Modify `src/App.js` (`defaultServices` line 51-57, `DATA_VERSION` 219, hero subtitle 831, pbox paragraph 908, services grid 923-929, nav 1602-1622, footer 1635), `public/index.html` (keywords, JSON-LD serviceType).
- [ ] Insert service `{ id: 6, icon: "Sparkles", title: "CHATGPT ADS", desc: "Реклами в отговорите на ChatGPT — първите в България. Fit анализ на разговорите в твоята ниша, партньорски достъп до инвентара, 30-дневен пилот с KPI, записан преди да платиш. Не на всеки — само ако сметката излиза.", active: true, href: "/chatgpt-ads" }` at index 1. `DATA_VERSION = 7`.
- [ ] Service card: if `s.href`, render `<a className="svc svc-link" href={s.href} onClick={e=>{e.preventDefault(); nav("chatgpt");}}>` with a small "Виж програмата →" line; CSS `.svc-link{text-decoration:none} .svc-more{font-size:11px;font-weight:700;color:var(--b);margin-top:auto}`.
- [ ] Hero subtitle → "Да изградят 7-цифрен оборот чрез Performance Meta реклами, ChatGPT Ads + AI автоматизации — цялата система от първия клик до повторната покупка. Доказано с над 2 000 000 € генериран оборот за 12 месеца."
- [ ] pbox paragraph → "Meta реклами + ChatGPT Ads + landing pages + email sequences + AI автоматизации + creative стратегия. ..."
- [ ] Nav desktop/mobile + footer: `<a href="/chatgpt-ads" onClick={(e)=>{e.preventDefault(); nav("chatgpt");}}>ChatGPT Ads</a>`.
- [ ] index.html: keywords add "ChatGPT Ads България, реклами в ChatGPT"; JSON-LD serviceType add "ChatGPT Ads".
- [ ] `npm run build` passes. Commit `feat: ChatGPT Ads service on home page`.

### Task 5: Landing page component
**Files:** Create `src/pages/ChatGptAds.js`, `src/pages/ChatGptAds.test.js`; Modify `src/App.js` (render `{page === "chatgpt" && <ChatGptAds nav={nav} />}`, append `cg-*` CSS to the `css` string, set `document.title` per page).
**Consumes:** Tasks 2–3 helpers. Sections 1–10 exactly as listed in the spec (`docs/superpowers/specs/2026-09-02-chatgpt-ads-landing-design.md`).
- [ ] Test (RTL): renders H1 containing "ChatGPT започна да показва реклами"; no "€490"/"€390"/"€1 480" text; submit with empty form shows validation message; submit with valid form calls mocked `submitLead` and shows "Благодарим".
- [ ] FAIL → implement → PASS.
- [ ] `npm run build` passes; browser check of `/` and `/chatgpt-ads` (desktop + 375px). Commit `feat: /chatgpt-ads landing page`.

### Task 6: Ship
- [ ] `CI=true npx react-scripts test --watchAll=false` all green; `npm run build` green.
- [ ] `git push origin main`; confirm Vercel deployment READY via MCP `get_project`.
- [ ] Hand owner the Apps Script deploy steps (`scripts/google-sheets-leads.gs` header) and ask for the `/exec` URL to fill `SHEET_ENDPOINT`.
