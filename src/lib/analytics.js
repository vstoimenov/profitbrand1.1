/* First-party page-view tracking -> Supabase table pb_page_views (anon INSERT only).
   No cookies: the session id lives in sessionStorage and dies with the tab. */
import { SUPABASE_URL, SUPABASE_KEY } from "./leads";

export const VIEWS_TABLE = "pb_page_views";
const SESSION_KEY = "pb_sid";

function randomId() {
  try { return crypto.randomUUID(); } catch { /* old browsers */ }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) { id = randomId(); sessionStorage.setItem(SESSION_KEY, id); }
    return id;
  } catch {
    return randomId();
  }
}

export function deviceType(width) {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function utmSource(search) {
  try { return new URLSearchParams(search || "").get("utm_source") || null; } catch { return null; }
}

export async function trackPageView(
  {
    path = typeof window !== "undefined" ? window.location.pathname : "/",
    referrer = typeof document !== "undefined" ? document.referrer : "",
    search = typeof window !== "undefined" ? window.location.search : "",
    width = typeof window !== "undefined" ? window.innerWidth : 0,
    hostname = typeof window !== "undefined" ? window.location.hostname : "",
  } = {},
  { fetchFn } = {}
) {
  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") return false;
  const f = fetchFn || ((...a) => fetch(...a));
  const row = {
    path: path.replace(/\/+$/, "") || "/",
    referrer: (referrer || "").slice(0, 500) || null,
    session_id: getSessionId(),
    device: deviceType(width),
    utm_source: utmSource(search),
    screen_w: width || null,
  };
  try {
    const r = await f(`${SUPABASE_URL}/rest/v1/${VIEWS_TABLE}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
      keepalive: true,
    });
    return !!(r && r.ok);
  } catch {
    return false;
  }
}
