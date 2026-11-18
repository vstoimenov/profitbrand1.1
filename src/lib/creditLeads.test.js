import {
  STATUSES, DEMO_LEADS, validateCreditLead, scoreLead, banksForScore, buildCreditLead,
  loadLeads, saveLead, loadStatuses, saveStatus, resetDemo,
} from "./creditLeads";

const mem = () => {
  const m = {};
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: (k) => { delete m[k]; },
  };
};
const throwing = {
  getItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
  removeItem() { throw new Error("blocked"); },
};
const validForm = { type: "pot", amount: 15000, name: "Тест", phone: "0888123456", email: "t@t.bg", consent: true };

test("accepts Bulgarian phone formats and rejects short ones", () => {
  const base = { type: "ipo", amount: 100000, name: "А", email: "a@b.bg", consent: true };
  for (const phone of ["0888 123 456", "+359 888 123 456", "+359-88-812-3456"]) {
    expect(validateCreditLead({ ...base, phone }).phone).toBeUndefined();
  }
  expect(validateCreditLead({ ...base, phone: "12" }).phone).toBe("Телефонът не изглежда валиден.");
});

test("valid form has no errors", () => {
  expect(validateCreditLead(validForm)).toEqual({});
});

test("consent, email, name, type and amount are required", () => {
  const e = validateCreditLead({ type: "xxx", amount: 0, name: " ", phone: "0888123456", email: "nope", consent: false });
  expect(e.consent).toBe("Нужно е съгласие, за да обработим запитването.");
  expect(e.email).toBeDefined();
  expect(e.name).toBeDefined();
  expect(e.type).toBeDefined();
  expect(e.amount).toBeDefined();
});

test("scoreLead thresholds", () => {
  expect(scoreLead({ payment: 600, income: 2400 })).toBe("high");
  expect(scoreLead({ payment: 1100, income: 2400 })).toBe("medium");
  expect(scoreLead({ payment: 1300, income: 2400 })).toBe("low");
  expect(scoreLead({ payment: 600 })).toBe("medium");
  expect(scoreLead({ payment: 600, income: 0 })).toBe("medium");
});

test("banksForScore", () => {
  expect(banksForScore("high")).toBe(9);
  expect(banksForScore("medium")).toBe(5);
  expect(banksForScore("low")).toBe(2);
});

test("DEMO_LEADS has 12 entries with valid statuses and scores", () => {
  expect(DEMO_LEADS).toHaveLength(12);
  for (const l of DEMO_LEADS) {
    expect(STATUSES).toContain(l.status);
    expect(["high", "medium", "low"]).toContain(l.score);
    expect(l.isNew).toBe(false);
  }
  expect(new Set(DEMO_LEADS.map((l) => l.id)).size).toBe(12);
});

test("buildCreditLead fills computed fields", () => {
  const lead = buildCreditLead({ ...validForm, income: "2000" }, { now: new Date("2026-11-18T10:00:00Z") });
  expect(lead.id).toBe("L" + new Date("2026-11-18T10:00:00Z").getTime());
  expect(lead.status).toBe("Нов");
  expect(lead.source).toBe("form");
  expect(lead.isNew).toBe(true);
  expect(lead.income).toBe(2000);
  expect(lead.payment).toBeGreaterThan(0);
  expect(["high", "medium", "low"]).toContain(lead.score);
});

test("saveLead dedupes by id and puts new first", () => {
  const s = mem();
  const lead = buildCreditLead(validForm, { now: new Date("2026-11-18T10:00:00Z") });
  saveLead(lead, s);
  const list = saveLead(lead, s);
  expect(list.filter((l) => l.id === lead.id)).toHaveLength(1);
  expect(list[0].id).toBe(lead.id);
  expect(list).toHaveLength(13);
});

test("corrupt JSON falls back to demo data", () => {
  const s = mem();
  s.setItem("finora_demo_leads", "{oops");
  s.setItem("finora_demo_status", "[[[");
  expect(loadLeads(s)).toHaveLength(12);
  expect(loadStatuses(s)).toEqual({});
});

test("throwing storage still works", () => {
  expect(loadLeads(throwing)).toHaveLength(12);
  expect(() => saveStatus("x", "Подаден", throwing)).not.toThrow();
  expect(() => resetDemo(throwing)).not.toThrow();
  const lead = buildCreditLead(validForm, { now: new Date("2026-11-18T10:00:00Z") });
  expect(() => saveLead(lead, throwing)).not.toThrow();
});

test("saveStatus overrides status on load and resetDemo clears", () => {
  const s = mem();
  saveStatus(DEMO_LEADS[0].id, "Одобрен", s);
  expect(loadLeads(s)[0].status).toBe("Одобрен");
  resetDemo(s);
  expect(loadLeads(s)[0].status).toBe(DEMO_LEADS[0].status);
});

test("DEMO_LEADS mix every score, type and status", () => {
  const set = (k) => new Set(DEMO_LEADS.map((l) => l[k]));
  expect(set("score")).toEqual(new Set(["high", "medium", "low"]));
  expect(set("type")).toEqual(new Set(["ipo", "pot", "biz"]));
  expect(set("status")).toEqual(new Set(STATUSES));
  expect(DEMO_LEADS.filter((l) => l.score === "low").length).toBeGreaterThanOrEqual(2);
  expect(DEMO_LEADS.filter((l) => l.score === "medium").length).toBeGreaterThanOrEqual(3);
});
