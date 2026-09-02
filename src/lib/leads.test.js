import { buildLeadPayload, validateLead, submitLead, BUDGETS, CLIENT_VALUES } from "./leads";

const valid = {
  sells: "CRM софтуер за малки фирми",
  budget: "€1 000–3 000",
  clientValue: "€150–500",
  name: "Иван",
  email: "ivan@example.com",
  phone: "+359 888 123 456",
  website: "https://example.com",
};
const now = new Date("2026-09-02T12:00:00Z");

test("select options exist", () => {
  expect(BUDGETS).toEqual(["под €500", "€500–1 000", "€1 000–3 000", "над €3 000"]);
  expect(CLIENT_VALUES).toEqual(["под €50", "€50–150", "€150–500", "над €500"]);
});

test("verdict is 'не още' for budget under €500", () => {
  const p = buildLeadPayload({ ...valid, budget: "под €500" }, { now, source: "direct" });
  expect(p.verdict).toBe("не още");
});

test("verdict is 'не още' for client value under €50", () => {
  const p = buildLeadPayload({ ...valid, clientValue: "под €50" }, { now, source: "direct" });
  expect(p.verdict).toBe("не още");
});

test("verdict is 'за преглед' otherwise and payload carries all fields", () => {
  const p = buildLeadPayload(valid, { now, source: "utm:facebook" });
  expect(p).toEqual({
    date: "2026-09-02T12:00:00.000Z",
    name: "Иван",
    email: "ivan@example.com",
    phone: "+359 888 123 456",
    website: "https://example.com",
    sells: "CRM софтуер за малки фирми",
    budget: "€1 000–3 000",
    clientValue: "€150–500",
    verdict: "за преглед",
    source: "utm:facebook",
  });
});

test("validateLead flags missing fields and bad email", () => {
  expect(validateLead(valid)).toEqual({});
  const errs = validateLead({ ...valid, name: "  ", email: "nope", sells: "", phone: "12" });
  expect(Object.keys(errs).sort()).toEqual(["email", "name", "phone", "sells"]);
});

test("submitLead rejects when no endpoint configured", async () => {
  await expect(submitLead({ name: "x" }, "")).rejects.toThrow("no-endpoint");
});

test("submitLead POSTs JSON to the endpoint", async () => {
  const fetchMock = jest.fn().mockResolvedValue({});
  global.fetch = fetchMock;
  await submitLead({ name: "x" }, "https://script.google.com/macros/s/abc/exec");
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, opts] = fetchMock.mock.calls[0];
  expect(url).toBe("https://script.google.com/macros/s/abc/exec");
  expect(opts.method).toBe("POST");
  expect(opts.mode).toBe("no-cors");
  expect(JSON.parse(opts.body)).toEqual({ name: "x" });
});
