/* Lead form helpers for the /chatgpt-ads landing.
   Submissions go to a Google Apps Script web app bound to the "gpt ads" sheet.
   Deploy steps: scripts/google-sheets-leads.gs */

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
    website: (form.website || "").trim(),
    sells: (form.sells || "").trim(),
    budget,
    clientValue,
    verdict: notYet ? "не още" : "за преглед",
    source,
  };
}

/* Apps Script web apps do not answer CORS preflights, so we send text/plain
   with mode no-cors. The response is opaque: a resolved fetch means the
   request reached Google. */
export async function submitLead(payload, endpoint = SHEET_ENDPOINT) {
  if (!endpoint) throw new Error("no-endpoint");
  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
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
