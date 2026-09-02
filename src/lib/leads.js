/* Lead form helpers for the /chatgpt-ads landing.
   Primary store: Supabase table pb_chatgpt_ads_leads (project bg-explorer),
   anonymous INSERT only via RLS. Optional secondary: Google Apps Script web app
   bound to the "gpt ads" sheet (scripts/google-sheets-leads.gs). */

export const SUPABASE_URL = "https://bhiirhfrbbjjaaamxegd.supabase.co";
export const SUPABASE_KEY = "sb_publishable_sbFtrp834-PwgycMxhmR2A_2LUxwVY1";
export const LEADS_TABLE = "pb_chatgpt_ads_leads";
export const SHEET_ENDPOINT = "";

export const BUDGETS = ["под €500", "€500–1 000", "€1 000–3 000", "над €3 000"];
export const CLIENT_VALUES = ["под €50", "€50–150", "€150–500", "над €500"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(form) {
  const errs = {};
  const req = (k, msg) => { if (!(form[k] || "").trim()) errs[k] = msg; };
  req("sells", "Напиши какво продаваш и на кого.");
  req("budget", "Избери бюджет.");
  req("clientValue", "Избери колко ти носи един клиент.");
  req("name", "Напиши името си.");
  if (!(form.phone || "").trim()) errs.phone = "Напиши телефон за връзка.";
  else if ((form.phone || "").replace(/\D/g, "").length < 6) errs.phone = "Телефонът не изглежда валиден.";
  req("website", "Напиши сайта си.");
  if (!(form.email || "").trim()) errs.email = "Напиши имейл.";
  else if (!EMAIL_RE.test(form.email.trim())) errs.email = "Имейлът не изглежда валиден.";
  return errs;
}

export function buildLeadPayload(form, { now = new Date(), source = "" } = {}) {
  const budget = form.budget || "";
  const clientValue = form.clientValue || "";
  const notYet = budget === BUDGETS[0] || clientValue === CLIENT_VALUES[0];
  return {
    date: now.toISOString(),
    name: (form.name || "").trim(),
    email: (form.email || "").trim(),
    phone: (form.phone || "").trim(),
    website: (form.website || "").trim(),
    sells: (form.sells || "").trim(),
    budget,
    clientValue,
    verdict: notYet ? "не още" : "за преглед",
    source,
  };
}

/* Insert the lead into Supabase (throws on failure), then mirror it to the
   Google Sheet if an Apps Script endpoint is configured (best effort). */
export async function submitLead(payload, { fetchFn, sheetEndpoint = SHEET_ENDPOINT, supabaseUrl = SUPABASE_URL, supabaseKey = SUPABASE_KEY } = {}) {
  const f = fetchFn || ((...a) => fetch(...a));
  const row = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    website: payload.website || null,
    sells: payload.sells || null,
    budget: payload.budget || null,
    client_value: payload.clientValue || null,
    verdict: payload.verdict || null,
    source: payload.source || null,
    page_url: typeof window !== "undefined" ? window.location.href : null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  };
  const r = await f(`${supabaseUrl}/rest/v1/${LEADS_TABLE}`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!r || !r.ok) throw new Error(`supabase-${r ? r.status : "no-response"}`);

  if (sheetEndpoint) {
    /* Apps Script web apps do not answer CORS preflights: text/plain + no-cors. */
    try {
      await f(sheetEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    } catch { /* sheet mirror is best effort */ }
  }
}

/* "utm_source=x" -> "utm:x", else "direct" */
export function sourceFromSearch(search) {
  try {
    const p = new URLSearchParams(search || "");
    const s = p.get("utm_source");
    return s ? `utm:${s}` : "direct";
  } catch {
    return "direct";
  }
}
