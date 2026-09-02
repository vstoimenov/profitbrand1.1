/* Meta Pixel (browser) + Conversions API (via /api/meta-capi) helpers.
   The pixel base code lives in public/index.html. The CAPI access token
   lives ONLY in the Vercel env var META_CAPI_TOKEN. */

export const PIXEL_ID = "1521657903341268";

export function newEventId() {
  try { return crypto.randomUUID(); } catch { /* old browsers */ }
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function readCookie(name, cookieStr) {
  const src = cookieStr ?? (typeof document !== "undefined" ? document.cookie : "");
  const hit = src.split(";").map((s) => s.trim()).find((s) => s.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : "";
}

export function trackPixel(eventName, params = {}, eventId) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return false;
  window.fbq("track", eventName, params, eventId ? { eventID: eventId } : undefined);
  return true;
}

export async function sendCapi({ eventName, eventId, userData = {}, customData = {} }, { fetchFn, url = "/api/meta-capi", cookie } = {}) {
  const f = fetchFn || ((...a) => fetch(...a));
  const body = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
    user_data: { ...userData, fbp: readCookie("_fbp", cookie), fbc: readCookie("_fbc", cookie) },
    custom_data: customData,
  };
  try {
    const r = await f(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true });
    return !!(r && (r.ok ?? true));
  } catch {
    return false;
  }
}

/* Browser pixel + server event share one event_id so Meta deduplicates them. */
export async function trackLead({ email = "", phone = "", name = "" } = {}, customData = {}, opts = {}) {
  const eventId = newEventId();
  trackPixel("Lead", customData, eventId);
  const [fn = "", ...rest] = name.trim().split(/\s+/);
  await sendCapi(
    { eventName: "Lead", eventId, userData: { em: email.trim().toLowerCase(), ph: phone, fn, ln: rest.join(" ") }, customData },
    opts
  );
  return eventId;
}
