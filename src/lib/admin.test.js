import { adminLogin, fetchAdminStats } from "./admin";

afterEach(() => { delete global.fetch; });

test("adminLogin calls the pb_admin_check RPC and returns its boolean", async () => {
  const fetchFn = jest.fn().mockResolvedValue({ ok: true, json: async () => true });
  expect(await adminLogin("secret", { fetchFn })).toBe(true);
  const [url, opts] = fetchFn.mock.calls[0];
  expect(url).toBe("https://bhiirhfrbbjjaaamxegd.supabase.co/rest/v1/rpc/pb_admin_check");
  expect(JSON.parse(opts.body)).toEqual({ p_pass: "secret" });
  const no = jest.fn().mockResolvedValue({ ok: true, json: async () => false });
  expect(await adminLogin("wrong", { fetchFn: no })).toBe(false);
});

test("fetchAdminStats calls pb_admin_stats with the password and range", async () => {
  const stats = { totals: { views: 5 }, daily: [] };
  const fetchFn = jest.fn().mockResolvedValue({ ok: true, json: async () => stats });
  expect(await fetchAdminStats("secret", 7, { fetchFn })).toEqual(stats);
  const [url, opts] = fetchFn.mock.calls[0];
  expect(url).toBe("https://bhiirhfrbbjjaaamxegd.supabase.co/rest/v1/rpc/pb_admin_stats");
  expect(JSON.parse(opts.body)).toEqual({ p_pass: "secret", p_days: 7 });
});

test("fetchAdminStats throws on unauthorized", async () => {
  const fetchFn = jest.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ message: "unauthorized" }) });
  await expect(fetchAdminStats("wrong", 30, { fetchFn })).rejects.toThrow("unauthorized");
});
