import { trackPageView, getSessionId, deviceType } from "./analytics";

beforeEach(() => { sessionStorage.clear(); });
afterEach(() => { delete global.fetch; });

test("getSessionId is stable within a session", () => {
  const a = getSessionId();
  expect(a).toMatch(/^[a-z0-9_-]{8,64}$/i);
  expect(getSessionId()).toBe(a);
});

test("deviceType classifies by width", () => {
  expect(deviceType(375)).toBe("mobile");
  expect(deviceType(800)).toBe("tablet");
  expect(deviceType(1440)).toBe("desktop");
});

test("trackPageView posts a row to Supabase", async () => {
  const fetchFn = jest.fn().mockResolvedValue({ ok: true });
  const ok = await trackPageView({ path: "/chatgpt-ads", referrer: "https://l.facebook.com/", search: "?utm_source=fb", width: 375, hostname: "profitbrand.online" }, { fetchFn });
  expect(ok).toBe(true);
  const [url, opts] = fetchFn.mock.calls[0];
  expect(url).toBe("https://bhiirhfrbbjjaaamxegd.supabase.co/rest/v1/pb_page_views");
  expect(opts.method).toBe("POST");
  expect(opts.headers.apikey).toMatch(/^sb_publishable_/);
  expect(JSON.parse(opts.body)).toMatchObject({ path: "/chatgpt-ads", referrer: "https://l.facebook.com/", device: "mobile", utm_source: "fb", screen_w: 375 });
  expect(JSON.parse(opts.body).session_id).toBe(getSessionId());
});

test("trackPageView is skipped on localhost and never throws", async () => {
  const fetchFn = jest.fn();
  expect(await trackPageView({ path: "/", hostname: "localhost", width: 1000 }, { fetchFn })).toBe(false);
  expect(fetchFn).not.toHaveBeenCalled();
  const bad = jest.fn().mockRejectedValue(new Error("x"));
  expect(await trackPageView({ path: "/", hostname: "profitbrand.online", width: 1000 }, { fetchFn: bad })).toBe(false);
});
