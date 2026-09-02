import { readCookie, trackPixel, sendCapi, trackLead, PIXEL_ID } from "./meta";

afterEach(() => { delete window.fbq; delete global.fetch; });

test("pixel id is the PROFITBRAND pixel", () => {
  expect(PIXEL_ID).toBe("1521657903341268");
});

test("readCookie extracts a value", () => {
  expect(readCookie("_fbp", "a=1; _fbp=fb.1.123.456; _fbc=fb.1.9.abc")).toBe("fb.1.123.456");
  expect(readCookie("missing", "a=1")).toBe("");
});

test("trackPixel calls fbq with eventID when fbq exists, else returns false", () => {
  expect(trackPixel("Lead", {}, "e1")).toBe(false);
  window.fbq = jest.fn();
  expect(trackPixel("Lead", { value: 1 }, "e1")).toBe(true);
  expect(window.fbq).toHaveBeenCalledWith("track", "Lead", { value: 1 }, { eventID: "e1" });
});

test("sendCapi POSTs the event to /api/meta-capi and swallows failures", async () => {
  const fetchFn = jest.fn().mockResolvedValue({ ok: true });
  const ok = await sendCapi({ eventName: "Lead", eventId: "e1", userData: { em: "a@b.c" }, customData: { content_name: "x" } }, { fetchFn, cookie: "_fbp=fb.1.1.1" });
  expect(ok).toBe(true);
  const [url, opts] = fetchFn.mock.calls[0];
  expect(url).toBe("/api/meta-capi");
  expect(opts.method).toBe("POST");
  const body = JSON.parse(opts.body);
  expect(body).toMatchObject({ event_name: "Lead", event_id: "e1", user_data: { em: "a@b.c", fbp: "fb.1.1.1" }, custom_data: { content_name: "x" } });
  const bad = await sendCapi({ eventName: "Lead", eventId: "e2", userData: {} }, { fetchFn: jest.fn().mockRejectedValue(new Error("x")) });
  expect(bad).toBe(false);
});

test("trackLead fires pixel and CAPI with the same event id", async () => {
  window.fbq = jest.fn();
  const fetchFn = jest.fn().mockResolvedValue({ ok: true });
  const id = await trackLead({ email: "a@b.c", phone: "0888", name: "Иван Петров" }, { content_name: "chatgpt-ads" }, { fetchFn });
  expect(typeof id).toBe("string");
  expect(window.fbq).toHaveBeenCalledWith("track", "Lead", { content_name: "chatgpt-ads" }, { eventID: id });
  const body = JSON.parse(fetchFn.mock.calls[0][1].body);
  expect(body.event_id).toBe(id);
  expect(body.user_data).toMatchObject({ em: "a@b.c", ph: "0888", fn: "Иван", ln: "Петров" });
});
