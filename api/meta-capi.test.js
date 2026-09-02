const test = require("node:test");
const assert = require("node:assert");
const { normalizeUserData, buildEventPayload, sha256 } = require("./meta-capi.js");

test("sha256 hashes lowercased trimmed values", () => {
  assert.strictEqual(sha256(" A@B.C "), sha256("a@b.c"));
  assert.strictEqual(sha256("a@b.c").length, 64);
});

test("normalizeUserData hashes PII and keeps fbp/fbc/ip/ua plain", () => {
  const out = normalizeUserData(
    { em: "Ivan@Example.com ", ph: "+359 (888) 123-456", fn: "Иван", ln: "Петров", fbp: "fb.1.1.1", fbc: "fb.1.2.2" },
    { ip: "1.2.3.4", ua: "UA" }
  );
  assert.deepStrictEqual(out.em, [sha256("ivan@example.com")]);
  assert.deepStrictEqual(out.ph, [sha256("359888123456")]);
  assert.deepStrictEqual(out.fn, [sha256("иван")]);
  assert.deepStrictEqual(out.ln, [sha256("петров")]);
  assert.strictEqual(out.fbp, "fb.1.1.1");
  assert.strictEqual(out.fbc, "fb.1.2.2");
  assert.strictEqual(out.client_ip_address, "1.2.3.4");
  assert.strictEqual(out.client_user_agent, "UA");
  assert.ok(!("ph" in normalizeUserData({ ph: "" }, {})));
});

test("buildEventPayload shapes a Graph API events request", () => {
  const p = buildEventPayload(
    { event_name: "Lead", event_id: "e1", event_source_url: "https://profitbrand.online/chatgpt-ads", user_data: { em: "a@b.c" }, custom_data: { content_name: "x" } },
    { ip: "1.1.1.1", ua: "UA", now: 1700000000 }
  );
  assert.strictEqual(p.data.length, 1);
  const ev = p.data[0];
  assert.strictEqual(ev.event_name, "Lead");
  assert.strictEqual(ev.event_id, "e1");
  assert.strictEqual(ev.event_time, 1700000000);
  assert.strictEqual(ev.action_source, "website");
  assert.strictEqual(ev.event_source_url, "https://profitbrand.online/chatgpt-ads");
  assert.deepStrictEqual(ev.custom_data, { content_name: "x" });
  assert.deepStrictEqual(ev.user_data.em, [sha256("a@b.c")]);
});

test("buildEventPayload rejects unknown event names", () => {
  assert.throws(() => buildEventPayload({ event_name: "Whatever", event_id: "x" }, {}), /event_name/);
});
