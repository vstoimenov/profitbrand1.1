/* Credit demo: lead validation, AI-style scoring and browser-only storage.
   Nothing here talks to a server: the demo CRM reads what the form saved. */
import { LOAN_TYPES, loanSummary } from "./credit";

export const STATUSES = ["Нов", "Документи", "Подаден", "Одобрен", "Отказан"];

const LEADS_KEY = "finora_demo_leads";
const STATUS_KEY = "finora_demo_status";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCreditLead(form = {}) {
  const errs = {};
  const str = (k) => String(form[k] ?? "").trim();
  if (!LOAN_TYPES[form.type]) errs.type = "Избери вид кредит.";
  if (!(Number(form.amount) > 0)) errs.amount = "Напиши сума.";
  if (!str("name")) errs.name = "Напиши името си.";
  if (!str("phone")) errs.phone = "Напиши телефон за връзка.";
  else if (str("phone").replace(/\D/g, "").length < 9) errs.phone = "Телефонът не изглежда валиден.";
  if (!str("email")) errs.email = "Напиши имейл.";
  else if (!EMAIL_RE.test(str("email"))) errs.email = "Имейлът не изглежда валиден.";
  if (form.consent !== true) errs.consent = "Нужно е съгласие, за да обработим запитването.";
  return errs;
}

export function scoreLead({ payment, income }) {
  if (!income || !(income > 0)) return "medium";
  const ratio = payment / income;
  if (ratio <= 0.35) return "high";
  if (ratio <= 0.5) return "medium";
  return "low";
}

export function banksForScore(score) {
  return { high: 9, medium: 5, low: 2 }[score] ?? 5;
}

const num = (v) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function buildCreditLead(form, { now = new Date(), source = "form", chat = null, summary } = {}) {
  const t = LOAN_TYPES[form.type] || LOAN_TYPES.ipo;
  const amount = Number(form.amount);
  const years = num(form.years) ?? t.years.default;
  const rate = num(form.rate) ?? t.rate.default;
  const rawDown = form.downPct === "" || form.downPct == null ? NaN : Number(form.downPct);
  const downPct = !t.hasDown ? 0 : Number.isFinite(rawDown) ? rawDown : t.down.default;
  const income = num(form.income);
  const s = summary || loanSummary({ type: form.type, amount, downPct, years, rate });
  return {
    id: "L" + now.getTime(),
    date: now.toISOString(),
    name: String(form.name || "").trim(),
    phone: String(form.phone || "").trim(),
    email: String(form.email || "").trim(),
    type: form.type,
    amount,
    years,
    rate,
    downPct,
    income,
    note: String(form.note || "").trim(),
    payment: s.payment,
    score: scoreLead({ payment: s.payment, income }),
    status: "Нов",
    consultant: "—",
    source,
    chat,
    isNew: true,
  };
}

/* ---------- demo data (fixed, clearly fictional) ---------- */
const DEMO_BASE = Date.UTC(2026, 10, 18, 9, 0, 0);
const DAY = 86400000;
const demo = (id, daysAgo, name, type, amount, income, status, consultant, extra = {}) => {
  const t = LOAN_TYPES[type];
  const downPct = t.hasDown ? (extra.downPct ?? 20) : 0;
  const years = extra.years ?? t.years.default;
  const rate = t.rate.default;
  const { payment } = loanSummary({ type, amount, downPct, years, rate });
  return {
    id, date: new Date(DEMO_BASE - daysAgo * DAY - (Number(id.slice(1)) % 5) * 3600000).toISOString(),
    name, phone: "0888 000 0" + id.slice(1), email: "demo" + id.slice(1) + "@example.com",
    type, amount, years, rate, downPct, income, note: extra.note || "",
    payment, score: scoreLead({ payment, income }), status, consultant,
    source: extra.source || "form", chat: null, isNew: false,
  };
};

export const DEMO_LEADS = [
  demo("D01", 0, "Мария П.", "ipo", 180000, 2400, "Нов", "—", { source: "assistant" }),
  demo("D02", 0, "Георги Д.", "biz", 120000, 9000, "Нов", "—", { note: "Оборотни средства за склад" }),
  demo("D03", 1, "Елена К.", "pot", 12000, 450, "Документи", "Ивана"),
  demo("D04", 2, "Николай С.", "ipo", 240000, 2100, "Документи", "Петър", { downPct: 15 }),
  demo("D05", 3, "Ралица Т.", "ipo", 135000, 2000, "Подаден", "Деси", { source: "assistant" }),
  demo("D06", 4, "Стоян В.", "biz", 300000, 15000, "Подаден", "Петър", { note: "Нова производствена линия" }),
  demo("D07", 5, "Виктория Н.", "pot", 25000, 850, "Отказан", "Ивана"),
  demo("D08", 6, "Иван М.", "ipo", 95000, 1800, "Одобрен", "Деси", { downPct: 25 }),
  demo("D09", 8, "Петя Г.", "ipo", 210000, 4200, "Одобрен", "Ивана"),
  demo("D10", 9, "Тодор А.", "biz", 45000, 1500, "Документи", "Петър"),
  demo("D11", 11, "Анна Й.", "pot", 8000, 1300, "Подаден", "Деси"),
  demo("D12", 13, "Христо Б.", "ipo", 160000, 0, "Нов", "—", { note: "Рефинансиране" }),
];

/* ---------- storage ---------- */
const memoryStore = () => {
  const m = {};
  return { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: (k) => { delete m[k]; } };
};
let fallbackStore = null;

export function safeStorage() {
  try {
    const s = window.localStorage;
    const probe = "__finora_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    fallbackStore = fallbackStore || memoryStore();
    return fallbackStore;
  }
}

function readJson(storage, key, fallback, check) {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return check(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(storage, key, value) {
  try { storage.setItem(key, JSON.stringify(value)); } catch { /* demo: best effort */ }
}

const isPlainObject = (v) => v && typeof v === "object" && !Array.isArray(v);

function storedLeads(storage) {
  return readJson(storage, LEADS_KEY, [], Array.isArray).filter((l) => isPlainObject(l) && l.id);
}

export function loadStatuses(storage = safeStorage()) {
  return readJson(storage, STATUS_KEY, {}, isPlainObject);
}

export function loadLeads(storage = safeStorage()) {
  const statuses = loadStatuses(storage);
  return [...storedLeads(storage), ...DEMO_LEADS].map((l) =>
    STATUSES.includes(statuses[l.id]) ? { ...l, status: statuses[l.id] } : l
  );
}

export function saveLead(lead, storage = safeStorage()) {
  const list = storedLeads(storage);
  if (!list.some((l) => l.id === lead.id)) writeJson(storage, LEADS_KEY, [lead, ...list]);
  return loadLeads(storage);
}

export function saveStatus(id, status, storage = safeStorage()) {
  writeJson(storage, STATUS_KEY, { ...loadStatuses(storage), [id]: status });
}

export function resetDemo(storage = safeStorage()) {
  try { storage.removeItem(LEADS_KEY); } catch { /* ignore */ }
  try { storage.removeItem(STATUS_KEY); } catch { /* ignore */ }
}
