/* Vercel serverless function: forwards browser events to the Meta Conversions API.
   Env vars (Vercel -> Settings -> Environment Variables):
     META_CAPI_TOKEN  - system user access token (secret, never in git)
     META_PIXEL_ID    - optional, defaults to the PROFITBRAND pixel */
const crypto = require("crypto");

const ALLOWED_EVENTS = new Set(["Lead", "ViewContent", "PageView", "Contact", "CompleteRegistration", "Schedule"]);
const API_VERSION = "v21.0";
const DEFAULT_PIXEL_ID = "1521657903341268";

function sha256(value) {
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

function normalizeUserData(u = {}, ctx = {}) {
  const out = {};
  const hashed = (key, v) => { if (v && String(v).trim()) out[key] = [sha256(v)]; };
  hashed("em", u.em);
  if (u.ph) { const digits = String(u.ph).replace(/\D/g, ""); if (digits) out.ph = [sha256(digits)]; }
  hashed("fn", u.fn);
  hashed("ln", u.ln);
  if (u.fbp) out.fbp = String(u.fbp);
  if (u.fbc) out.fbc = String(u.fbc);
  if (ctx.ip) out.client_ip_address = ctx.ip;
  if (ctx.ua) out.client_user_agent = ctx.ua;
  return out;
}

function buildEventPayload(body = {}, ctx = {}) {
  if (!ALLOWED_EVENTS.has(body.event_name)) throw new Error("invalid event_name");
  const event = {
    event_name: body.event_name,
    event_time: ctx.now || Math.floor(Date.now() / 1000),
    action_source: "website",
    user_data: normalizeUserData(body.user_data || {}, ctx),
    custom_data: body.custom_data || {},
  };
  if (body.event_id) event.event_id = String(body.event_id);
  if (body.event_source_url) event.event_source_url = String(body.event_source_url);
  return { data: [event] };
}

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "POST only" });
  }
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return res.status(200).json({ ok: false, skipped: "META_CAPI_TOKEN not set" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || (req.socket && req.socket.remoteAddress) || "";
  const ua = req.headers["user-agent"] || "";

  let payload;
  try { payload = buildEventPayload(body || {}, { ip, ua }); }
  catch (e) { return res.status(400).json({ ok: false, error: e.message }); }

  const pixelId = process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID;
  const url = `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`;
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const json = await r.json().catch(() => ({}));
  return res.status(r.ok ? 200 : 502).json({ ok: r.ok, events_received: json.events_received, error: json.error && json.error.message });
}

module.exports = handler;
module.exports.sha256 = sha256;
module.exports.normalizeUserData = normalizeUserData;
module.exports.buildEventPayload = buildEventPayload;
