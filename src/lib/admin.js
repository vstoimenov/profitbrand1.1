/* Admin panel backend: two SECURITY DEFINER RPCs in Supabase.
   pb_admin_check(p_pass)        -> boolean   (bcrypt compare, hash never leaves the DB)
   pb_admin_stats(p_pass, p_days) -> jsonb     (views/sessions/leads, daily series, top lists, leads)
   Change the password with SQL:
   update pb_admin_config set value = extensions.crypt('NEW', extensions.gen_salt('bf')) where key = 'admin_pass_hash'; */
import { SUPABASE_URL, SUPABASE_KEY } from "./leads";

async function rpc(name, args, fetchFn) {
  const f = fetchFn || ((...a) => fetch(...a));
  const r = await f(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) throw new Error((data && (data.message || data.error)) || `rpc-${r.status}`);
  return data;
}

export async function adminLogin(pass, { fetchFn } = {}) {
  try { return (await rpc("pb_admin_check", { p_pass: pass }, fetchFn)) === true; }
  catch { return false; }
}

export function fetchAdminStats(pass, days = 30, { fetchFn } = {}) {
  return rpc("pb_admin_stats", { p_pass: pass, p_days: days }, fetchFn);
}
