# Credit Demo (`/credit`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A partner-demo credit platform („Финора“) at `/credit` (landing built from the Cruip „Simple“ template) and `/credit/crm` (demo CRM), inside the existing PROFITBRAND CRA app.

**Architecture:** The hand-rolled router gains two pages; `App.js` renders `<CreditApp>` alone (no PROFITBRAND chrome) for them. All logic (annuity, lead validation/scoring/storage, scripted chat) lives in pure, unit-tested modules under `src/lib/credit*.js`; React components under `src/pages/credit/` are ports of the template's sections restyled in the pine/mint palette. Leads live in `localStorage` only.

**Tech Stack:** React 19, react-scripts 5 (Jest), Tailwind 3.4 (no v4 syntax), framer-motion, lucide-react.

**Spec:** `docs/superpowers/specs/2026-11-18-credit-demo-landing-design.md`

**Template source:** `git clone --depth 1 https://github.com/cruip/tailwind-landing-page-template.git $TPL` (any scratch dir, never inside the repo). Port from `$TPL/components/*.tsx`; copy only the images listed in Task 4 into `public/credit/`.

## Global Constraints

- Brand name only via `BRAND = "Финора"` exported from `src/lib/credit.js`; no "CreditHub"/"credit-hub" text, logo or copy anywhere.
- Palette (Tailwind `theme.extend.colors.credit`): `pine #0f3d2e`, `pine2 #175c45`, `mint #38c98c`, `mist #eef4f1`, `ink #12261e`, `soft #5b7268`, `line #d6e3dc`. Light theme only.
- Lead form adds an optional „нетен месечен доход“ field (needed for AI scoring; implementer's addition to the spec's field list).
- Fonts: Geologica 400/600/700 (headings, class `font-cr-head`), Golos Text 400/500/600 (body, class `font-cr-body`), loaded by a `<link>` added in `CreditApp` on mount (Google Fonts), fallback `system-ui, sans-serif`.
- Tailwind 3 only: translate template v4 classes (`bg-linear-to-*` → `bg-gradient-to-*`, `shadow-xs` → `shadow-sm`, `rounded-xs` → `rounded-sm`, drop `*:`/`in-*` variants, `aos`/`data-aos` → framer-motion `whileInView` with `viewport={{ once: true }}`, disabled when `useReducedMotion()`).
- No new dependencies.
- Every figure that could read as real carries a marker: calculator „Ориентировъчно изчисление, не е оферта.“; testimonial „Примерен отзив“; chat header „Демо асистент“; CRM banner „Демо данни“.
- Footer copy includes: „© 2026 Финора · Изчисленията са ориентировъчни и не са оферта. Решенията са на банките.“ and a link „Регистър на кредитните посредници (БНБ)“ → `https://www.bnb.bg/` (`target="_blank" rel="noopener"`).
- No PROFITBRAND nav, mobile menu, footer, audit modal, Meta Pixel event or `trackPageView` on `credit*` pages.
- Layout must not scroll horizontally at 360px width.

## Review Focus

1. Number field cleared or typed out of range (e.g. empty, „абв“, 9 999 999) → calculator clamps on blur, never shows `NaN` or `Infinity`. Test in Task 1 (`clampToRange`) and Task 3.
2. `localStorage` blocked, throwing, or holding corrupt JSON → landing and CRM still render; CRM shows the 12 demo leads. Tests in Task 2.
3. Bulgarian phone formats „0888 123 456“, „+359 888 123 456“, „+359-88-812-3456“ accepted; „12“ rejected. Test in Task 2.
4. Direct load / refresh of `/credit/crm/` (trailing slash) → CRM, not PROFITBRAND home. Test in Task 4.
5. Lead sent twice in a row quickly (double click) → one row in CRM. Test in Task 6 (submit disabled while saving + `saveLead` returns the stored list).

---

### Task 1: Loan types and annuity math (`src/lib/credit.js`)

**Files:**
- Create: `src/lib/credit.js`
- Test: `src/lib/credit.test.js`

**Interfaces:**
- Produces:
  - `BRAND: string` (`"Финора"`)
  - `LOAN_TYPES: Record<"ipo"|"pot"|"biz", { label, amountLabel, min, max, step, default, years: {min,max,default}, rate: {min,max,step,default}, hasDown: boolean, down?: {min,max,default} }>` with spec values: ipo label „Ипотечен“, amountLabel „Стойност на имота“, 20000–600000 step 5000 default 160000, years 1–35 def 30, rate 1–12 step 0.1 def 2.9, down 0–50 def 15; pot „Потребителски“, „Сума“, 1000–50000 step 500 def 15000, years 1–10 def 5, rate 3–15 def 7.5; biz „Бизнес“, „Сума на финансирането“, 5000–500000 step 5000 def 80000, years 1–15 def 7, rate 2–12 def 5.2.
  - `monthlyPayment(principal: number, annualRatePct: number, years: number): number`
  - `loanSummary({ type, amount, downPct, years, rate }): { principal, payment, totalInterest, totalPaid }` (principal = amount × (1 − downPct/100) for `hasDown`, else amount)
  - `clampToRange(value: unknown, min: number, max: number, fallback: number): number` (non-finite → fallback, else clamp)
  - `formatEur(n: number, decimals = 0): string` (`Intl.NumberFormat("bg-BG", {style:"currency", currency:"EUR"})`)

- [ ] **Step 1: Write failing tests** (normalize spaces with `.replace(/\s/g, " ")` before comparing strings)

```js
test("monthlyPayment matches reference 120 000 € / 25 г. / 3.2%", () => {
  expect(monthlyPayment(120000, 3.2, 25)).toBeCloseTo(581.61, 2);
});
test("monthlyPayment at 0% is principal / months", () => {
  expect(monthlyPayment(10000, 0, 5)).toBeCloseTo(166.67, 2);
});
test("loanSummary applies down payment only for ipo", () => {
  const s = loanSummary({ type: "ipo", amount: 150000, downPct: 20, years: 25, rate: 3.2 });
  expect(s.principal).toBe(120000);
  expect(Math.round(s.totalInterest)).toBe(54484);
  expect(loanSummary({ type: "pot", amount: 15000, downPct: 20, years: 5, rate: 7.5 }).principal).toBe(15000);
});
test("clampToRange", () => {
  expect(clampToRange("", 1, 35, 30)).toBe(30);
  expect(clampToRange("абв", 1, 35, 30)).toBe(30);
  expect(clampToRange(9999999, 20000, 600000, 160000)).toBe(600000);
  expect(clampToRange("12", 1, 35, 30)).toBe(12);
});
test("formatEur", () => {
  expect(formatEur(581.61, 2).replace(/\s/g, " ")).toBe("581,61 €");
  expect(formatEur(120000).replace(/\s/g, " ")).toBe("120 000 €");
});
test("LOAN_TYPES defaults lie inside their ranges", () => { /* for each type: min ≤ default ≤ max for amount, years, rate */ });
```

- [ ] **Step 2: Run** `CI=true npx react-scripts test src/lib/credit.test.js --watchAll=false` → FAIL (module not found).
- [ ] **Step 3: Implement** the exports above in `src/lib/credit.js`.
- [ ] **Step 4: Run** the same command → PASS.
- [ ] **Step 5: Commit** `git add src/lib/credit.js src/lib/credit.test.js && git commit -m "credit demo: loan types and annuity math"`

---

### Task 2: Leads — validation, scoring, storage, demo data (`src/lib/creditLeads.js`)

**Files:**
- Create: `src/lib/creditLeads.js`
- Test: `src/lib/creditLeads.test.js`

**Interfaces:**
- Consumes: `LOAN_TYPES`, `loanSummary` from Task 1.
- Produces:
  - `STATUSES = ["Нов", "Документи", "Подаден", "Одобрен", "Отказан"]`
  - `validateCreditLead(form): Record<string,string>` — form `{ type, amount, name, phone, email, income?, note?, consent }`. Required: type ∈ LOAN_TYPES, amount > 0, name, phone (≥ 9 digits after stripping non-digits), email (same regex as `src/lib/leads.js`), `consent === true`. Messages in Bulgarian, e.g. `phone: "Телефонът не изглежда валиден."`, `consent: "Нужно е съгласие, за да обработим запитването."`.
  - `scoreLead({ payment, income }): "high"|"medium"|"low"` — no/zero income → `"medium"`; ratio = payment/income: ≤ 0.35 high, ≤ 0.5 medium, else low.
  - `banksForScore(score): number` — high 9, medium 5, low 2.
  - `buildCreditLead(form, { now = new Date(), source = "form", chat = null, summary }): Lead` — `Lead = { id, date (ISO), name, phone, email, type, amount, years, rate, downPct, income, note, payment, score, status: "Нов", consultant: "—", source, chat, isNew: true }`; `id` = `"L" + now.getTime()`.
  - `DEMO_LEADS: Lead[]` — exactly 12, `isNew: false`, dates within the last 14 days relative to a fixed `2026-11-18`, mix of all types/scores/statuses, Bulgarian names that are clearly generic (e.g. „Мария П.“), consultants „Ивана“, „Петър“, „Деси“.
  - `loadLeads(storage = safeStorage()): Lead[]` — stored leads (newest first) followed by `DEMO_LEADS`, each with status overridden from `loadStatuses`.
  - `saveLead(lead, storage = safeStorage()): Lead[]` — prepends unless a lead with the same `id` exists; returns `loadLeads(storage)`.
  - `loadStatuses(storage)`, `saveStatus(id, status, storage)` — key `finora_demo_status` (object id → status).
  - `resetDemo(storage)` — removes `finora_demo_leads` and `finora_demo_status`.
  - `safeStorage()` — returns `window.localStorage` or an in-memory stand-in when access throws.

- [ ] **Step 1: Write failing tests**

```js
const mem = () => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
const throwing = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };

test("phone formats", () => {
  const base = { type: "ipo", amount: 100000, name: "А", email: "a@b.bg", consent: true };
  for (const phone of ["0888 123 456", "+359 888 123 456", "+359-88-812-3456"]) expect(validateCreditLead({ ...base, phone }).phone).toBeUndefined();
  expect(validateCreditLead({ ...base, phone: "12" }).phone).toBeDefined();
});
test("consent required", () => { expect(validateCreditLead({ consent: false }).consent).toBeDefined(); });
test("scoreLead thresholds", () => {
  expect(scoreLead({ payment: 600, income: 2400 })).toBe("high");
  expect(scoreLead({ payment: 1100, income: 2400 })).toBe("medium");
  expect(scoreLead({ payment: 1300, income: 2400 })).toBe("low");
  expect(scoreLead({ payment: 600 })).toBe("medium");
});
test("DEMO_LEADS has 12 entries with valid statuses", () => { expect(DEMO_LEADS).toHaveLength(12); /* every status ∈ STATUSES */ });
test("saveLead dedupes by id and puts new first", () => {
  const s = mem(); const lead = buildCreditLead({ type: "pot", amount: 15000, name: "Тест", phone: "0888123456", email: "t@t.bg", consent: true }, { now: new Date("2026-11-18T10:00:00Z") });
  saveLead(lead, s); const list = saveLead(lead, s);
  expect(list.filter(l => l.id === lead.id)).toHaveLength(1);
  expect(list[0].id).toBe(lead.id);
  expect(list).toHaveLength(13);
});
test("corrupt JSON falls back to demo data", () => { const s = mem(); s.setItem("finora_demo_leads", "{oops"); expect(loadLeads(s)).toHaveLength(12); });
test("throwing storage still works", () => { expect(loadLeads(throwing)).toHaveLength(12); expect(() => saveStatus("x", "Подаден", throwing)).not.toThrow(); });
test("saveStatus overrides status on load and resetDemo clears", () => {
  const s = mem(); saveStatus(DEMO_LEADS[0].id, "Одобрен", s);
  expect(loadLeads(s)[0].status).toBe("Одобрен"); resetDemo(s); expect(loadLeads(s)[0].status).toBe(DEMO_LEADS[0].status);
});
```

- [ ] **Step 2: Run** `CI=true npx react-scripts test src/lib/creditLeads.test.js --watchAll=false` → FAIL.
- [ ] **Step 3: Implement** the exports in `src/lib/creditLeads.js` (every storage access inside try/catch).
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `git commit -m "credit demo: lead validation, scoring and local storage"`

---

### Task 3: Scripted assistant flow (`src/lib/creditChat.js`)

**Files:**
- Create: `src/lib/creditChat.js`
- Test: `src/lib/creditChat.test.js`

**Interfaces:**
- Consumes: `LOAN_TYPES`, `loanSummary`, `formatEur` (Task 1); `scoreLead`, `banksForScore` (Task 2).
- Produces:
  - `startChat(): ChatState` — `{ step: "type", answers: {}, messages: [{from:"bot", text:"Здравей! Аз съм демо асистентът на Финора. Какво финансиране търсиш?"}], options: [{id:"ipo",label:"Ипотечен"},{id:"pot",label:"Потребителски"},{id:"biz",label:"Бизнес"}] }`
  - `answerChat(state, optionId): ChatState` — appends the user's option label as `{from:"me"}` then bot message(s); steps: `type` → `amount` (3 bucket options per type, value = bucket midpoint, e.g. ipo „До 100 000 €“=80000, „100–200 000 €“=150000, „Над 200 000 €“=260000) → `down` (ipo only: „10%“,„20%“,„30%+“ → 10/20/30) → `income` („До 1 500 €“=1200, „1 500–3 000 €“=2200, „Над 3 000 €“=4000) → `result`. Result bot text: „При тези данни вноската е около {formatEur(payment)} на месец ({ratio}% от дохода). Профилът ти изглежда подходящ за {n} от 14 банки.“ using type defaults for years/rate; options `[{id:"send",label:"Изпрати като запитване"},{id:"restart",label:"Започни отначало"}]`. Unknown optionId → state unchanged. `restart` → `startChat()`.
  - `chatToFormPrefill(state): { type, amount, income, downPct } | null` — non-null only at `result`.

- [ ] **Step 1: Write failing tests** — full ipo path (`ipo` → 150000 bucket → `20` → 2200 bucket) ends at `step === "result"`, and the last bot text contains `подходящ за ${banksForScore(scoreLead({ payment, income: 2200 }))} от 14 банки` where `payment = loanSummary({ type:"ipo", amount:150000, downPct:20, years:30, rate:2.9 }).payment`; the `pot` path goes `type → amount → income` (no `down` step); an unknown option id returns the same state object (`toBe`); `chatToFormPrefill` returns `{ type:"ipo", amount:150000, income:2200, downPct:20 }` at result and `null` before it.
- [ ] **Step 2: Run** `CI=true npx react-scripts test src/lib/creditChat.test.js --watchAll=false` → FAIL.
- [ ] **Step 3: Implement** as a data table of steps + pure reducer.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `git commit -m "credit demo: scripted assistant flow"`

---

### Task 4: Routing, isolated shell, tracking guard, theme

**Files:**
- Modify: `src/lib/routing.js`, `src/lib/routing.test.js`
- Modify: `src/App.js` (render branch near line 1704 `return (`; pixel effect ~line 321; page-view effect ~line 328)
- Modify: `public/index.html` (Meta Pixel block, lines ~61–67)
- Modify: `tailwind.config.js` (colors + `fontFamily['cr-head']`, `['cr-body']`)
- Create: `src/pages/credit/CreditApp.js` (props `{ page, nav }`; sets `document.title` to „Финора · Ипотечни и бизнес кредити“ while mounted, restoring on unmount; injects Google Fonts link once by id `finora-fonts`; root `<div className="min-h-screen bg-credit-mist font-cr-body text-credit-ink antialiased">`; renders `Landing` or `Crm` placeholder `<main>` for now)

**Interfaces:**
- Produces: `pageFromPath("/credit") === "credit"`, `pageFromPath("/credit/crm") === "creditCrm"`, `pathForPage("creditCrm") === "/credit/crm"`, `isCreditPage(page): boolean` exported from `routing.js`. `nav("credit" | "creditCrm")` from App is the in-app navigation used by later tasks.

- [ ] **Step 1: Add failing tests** to `routing.test.js`: `/credit`, `/credit/` → credit; `/credit/crm`, `/credit/crm/` → creditCrm; `/credit/other` → home; `pathForPage` inverses; `isCreditPage`.
- [ ] **Step 2: Run** `CI=true npx react-scripts test src/lib/routing.test.js --watchAll=false` → FAIL.
- [ ] **Step 3: Implement** routes + `isCreditPage`.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Wire App.js**: before the main `return`, `if (isCreditPage(page)) return <CreditApp page={page} nav={nav} />;` (after all hooks, so hook order is unchanged); skip `trackPixel("PageView")` and `trackPageView()` when `isCreditPage(page)`. In `index.html`, wrap `fbq('track','PageView')` in `if (!/^\/credit(\/|$)/.test(window.location.pathname))` (keep `fbq('init', …)`).
- [ ] **Step 6: Verify** `npm start`, open `http://localhost:3000/credit` → mist background, no PROFITBRAND nav/footer; `/` unchanged; `/credit/crm/` → CRM placeholder. Run the full suite `CI=true npm test -- --watchAll=false` → all PASS.
- [ ] **Step 7: Commit** `git commit -m "credit demo: routes, isolated shell, tracking guard"`

---

### Task 5: Calculator component

**Files:**
- Create: `src/pages/credit/components/Calculator.js`
- Test: `src/pages/credit/components/Calculator.test.js`

**Interfaces:**
- Consumes: Task 1 exports.
- Produces: `<Calculator onRequest={(values) => void} />` where `values = { type, amount, downPct, years, rate, payment }`.

UI (mockup A): white card, segmented tabs (3 types), per field a label row with live value, a number `<input>` (clamped via `clampToRange` on blur, raw text allowed while typing) and a range slider bound to the same state; `downPct` row only when `hasDown`; switching type resets fields to that type's defaults; result block on `bg-credit-pine` with payment in `text-credit-mint` (formatEur(…, 2)), principal and total interest; note „Ориентировъчно изчисление, не е оферта.“; button „Искам реални оферти“ → `onRequest`.

- [ ] **Step 1: Write failing tests** (@testing-library/react): default render shows „Ипотечен“ selected and a payment text containing „€“; clicking „Потребителски“ hides „Самоучастие“; typing „абв“ into the years input then blurring shows the type default (30) and no „NaN“ anywhere in `container.textContent`; clicking „Искам реални оферти“ calls `onRequest` with `type: "ipo"` and numeric `payment`.
- [ ] **Step 2: Run** `CI=true npx react-scripts test src/pages/credit --watchAll=false` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `git commit -m "credit demo: calculator"`

---

### Task 6: Lead form + assistant chat components

**Files:**
- Create: `src/pages/credit/components/LeadForm.js`, `src/pages/credit/components/AssistantChat.js`
- Test: `src/pages/credit/components/LeadForm.test.js`

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces:
  - `<LeadForm prefill={{ type, amount, income?, downPct?, years?, rate?, chat? } | null} onOpenCrm={() => void} />` — fields: вид кредит (select), сума (number), нетен месечен доход (optional), име, телефон, имейл, коментар (optional), checkbox „Съгласен/а съм с обработката на личните ми данни за целите на запитването.“ Errors inline under each field. On submit: disable button („Изпращане…“), `validateCreditLead`, `loanSummary` with prefill/type-default years & rate, `scoreLead`, `buildCreditLead(…, { source: prefill?.chat ? "assistant" : "form", chat: prefill?.chat ?? null })`, `saveLead`; then success panel „Запитването е прието. Консултант ще се свърже с теб до 24 часа.“ with button „Виж го в CRM (демо)“ → `onOpenCrm`. When `prefill` changes, the form fields update to it.
  - `<AssistantChat onSend={(prefill) => void} />` — header with avatar letter „ф“, „Демо асистент“, green „онлайн“; message list (bot bubbles `bg-credit-mist`, user `bg-credit-pine text-white`), 600 ms „пише…“ indicator before bot messages (skipped when reduced motion), option chips from state; `send` → `onSend({ ...chatToFormPrefill(state), chat: state.messages })`.

- [ ] **Step 1: Write failing tests** for LeadForm: submit empty → shows phone and consent errors and saves nothing; valid submit → success text visible and `localStorage.getItem("finora_demo_leads")` holds exactly 1 lead; double click on submit → still 1 lead (Review Focus 5); prefill `{type:"biz", amount: 80000}` → select shows „Бизнес“ and amount 80000. Clear `localStorage` in `beforeEach`.
- [ ] **Step 2: Run** `CI=true npx react-scripts test src/pages/credit --watchAll=false` → FAIL.
- [ ] **Step 3: Implement** both components.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `git commit -m "credit demo: lead form and assistant chat"`

---

### Task 7: Landing page (ported template sections)

**Files:**
- Create: `src/pages/credit/Landing.js`, `src/pages/credit/components/{Header,Hero,Steps,LoanCategories,Features,Testimonial,Footer}.js`
- Copy from `$TPL/public/images/` to `public/credit/`: `planet.png`, `planet-overlay.svg`, `stripes.svg`, `stripes-dark.svg`, `large-testimonial.jpg`
- Modify: `src/pages/credit/CreditApp.js` (render `<Landing nav={nav} />`)

**Interfaces:**
- Consumes: `Calculator`, `AssistantChat`, `LeadForm`, `BRAND`, `nav`.
- Produces: `<Landing nav />`; section ids `#kalkulator`, `#krediti`, `#asistent`, `#banki`, `#zapitvane`. Landing holds `prefill` state: `Calculator.onRequest` and `AssistantChat.onSend` set it and smooth-scroll to `#zapitvane`.

Sections, each ported from the named template file (keep its structure, spacing and decorative SVG/dot patterns; recolor blue → pine/mint; replace copy):
1. `Header` ← `ui/header.tsx` + `ui/logo.tsx`: floating rounded bar; logo = pine rounded square with mint dot + „Финора“; links Кредити (#krediti), Как работи (#kak), Асистент (#asistent), Банки (#banki) hidden below `md`; button „Безплатна консултация“ → #zapitvane.
2. `Hero` ← `hero-home.tsx`: badge „14 банки · едно запитване“; H1 „Жилищен кредит, без да обикаляш банките.“; subline „Изчисли вноската, сподели целта си с AI асистента и получи сравнение на реални предложения от банките. Безплатно за теб.“; CTAs „Започни запитване“ (#zapitvane) / „Говори с асистента“ (#asistent); the template's terminal window is replaced by `<Calculator>` inside the same framed container (`id="kalkulator"`). Drop the avatar row and video modal.
3. `Steps` (`id="kak"`): 3 columns „Разкажи целта си“ / „Подготви профила“ / „Сравни предложенията“ with copy from mockup A.
4. `LoanCategories` ← `business-categories.tsx` (`id="krediti"` on tabs, `id="banki"` on orbit): tabs Ипотечни / Потребителски / Бизнес / Рефинансиране, each with a 1–2 sentence description below; orbit center = brand mark; orbit items = text badges ДСК, UniCredit, ОББ, Пощенска, Fibank, ЦКБ, ПроКредит, tbi bank, Алианц (no bank logos); caption „Банките са изброени информативно.“; orbit scales down (`scale-75`) below `sm` with `overflow-hidden` on the section.
5. `Features` ← `features-planet.tsx` (`id="asistent"`): dark section `bg-credit-ink`; heading „AI асистент, който пита като банков експерт“; `planet.png` replaced on mobile by `<AssistantChat>` and on `lg` shown side by side (chat left, planet right); 6-cell grid: AI квалифициране, Кредитен калкулатор, Дигитален профил, Документи на едно място, CRM и статус в реално време, Партньорска мрежа — one-sentence descriptions, lucide icons in mint.
6. `Testimonial` ← `large-testimonial.tsx`: quote „Получих три оферти за една седмица, без да стъпя в банка.“ — „Мария П., София“, label „Примерен отзив“.
7. Lead section (`id="zapitvane"`) ← `cta.tsx` styling: heading „Започни запитване“, `<LeadForm prefill onOpenCrm={() => nav("creditCrm")}>`.
8. `Footer` ← `ui/footer.tsx` simplified: brand + footer copy from Global Constraints, BNB link, link „Демо: виж CRM“ → `nav("creditCrm")`.

- [ ] **Step 1: Port sections 1–8** and compose `Landing`.
- [ ] **Step 2: Verify build** `CI=true npm run build` → „Compiled successfully“ (no ESLint warnings treated as errors).
- [ ] **Step 3: Verify in browser** with Playwright at 1440×900 and 390×844 (`http://localhost:3000/credit`): screenshot full page; check `document.documentElement.scrollWidth <= innerWidth`; no text „NaN“; calculator → „Искам реални оферти“ scrolls to the form with values filled; assistant ipo path → „Изпрати като запитване“ fills the form.
- [ ] **Step 4: Commit** `git commit -m "credit demo: landing page from Cruip template"`

---

### Task 8: Demo CRM (`/credit/crm`)

**Files:**
- Create: `src/pages/credit/Crm.js`
- Test: `src/pages/credit/Crm.test.js`
- Modify: `src/pages/credit/CreditApp.js` (render `<Crm nav={nav} />` for `creditCrm`)

**Interfaces:**
- Consumes: `loadLeads`, `saveStatus`, `resetDemo`, `STATUSES`, `LOAN_TYPES`, `formatEur`, `BRAND`; `nav("credit")`.

Layout: left sidebar (`bg-credit-ink`, brand, items Запитвания (active), Клиенти, Банки, Настройки (inactive, `aria-disabled`), link „← Към сайта“ → `nav("credit")`; collapses to a top bar below `md`); banner „Демо данни · нищо тук не е реален клиент“; 4 stat tiles computed from the loaded list (Нови днес = `isNew` or date today; В обработка = Документи; Подадени към банка = Подаден; Одобрени = Одобрен); table (horizontal scroll inside its own `overflow-x-auto` wrapper) columns Дата, Клиент, Вид, Сума, AI оценка (chip: висока mint / средна amber / ниска red), Статус (pill), Консултант; new leads first with a „ново“ badge; row click opens a right-side panel: contact details, loan figures with payment, chat transcript if `chat`, document checklist (лична карта, удостоверение за доход, предварителен договор / документи за имота — static checkboxes), status `<select>` that calls `saveStatus` and updates the row; button „Нулирай демото“ → `resetDemo` + reload list.

- [ ] **Step 1: Write failing tests**: renders 12 rows with empty storage and the „Демо данни“ banner; with one stored lead → 13 rows and the first has „ново“; changing status in the panel to „Одобрен“ updates the row pill and persists (`loadStatuses`); „Нулирай демото“ → back to 12 rows.
- [ ] **Step 2: Run** `CI=true npx react-scripts test src/pages/credit/Crm.test.js --watchAll=false` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** → PASS; then full suite `CI=true npm test -- --watchAll=false` → all PASS.
- [ ] **Step 5: Commit** `git commit -m "credit demo: CRM view"`

---

### Task 9: End-to-end check and push

- [ ] **Step 1:** `CI=true npm run build` → success.
- [ ] **Step 2:** Serve `build/` (`npx serve -s build -l 5050`) and with Playwright at 1440×900 and 390×844: `/` looks unchanged (PROFITBRAND nav present); `/credit` full flow: assistant → send → form submit → „Виж го в CRM (демо)“ → `/credit/crm` shows the new lead first; refresh `/credit/crm/` stays on CRM; no horizontal scroll on either page; no console errors. Save screenshots to the scratchpad.
- [ ] **Step 3:** `git push -u origin claude/vigilant-keller-qm8fze`.
