import { BRAND, LOAN_TYPES, monthlyPayment, loanSummary, clampToRange, formatEur } from "./credit";

const norm = (s) => s.replace(/\s/g, " ");

test("brand name is the working name", () => {
  expect(BRAND).toBe("Финора");
});

test("monthlyPayment matches reference 120 000 € / 25 г. / 3.2%", () => {
  expect(monthlyPayment(120000, 3.2, 25)).toBeCloseTo(581.61, 2);
});

test("monthlyPayment at 0% is principal / months", () => {
  expect(monthlyPayment(10000, 0, 5)).toBeCloseTo(166.67, 2);
});

test("loanSummary applies down payment only for ipo", () => {
  const s = loanSummary({ type: "ipo", amount: 150000, downPct: 20, years: 25, rate: 3.2 });
  expect(s.principal).toBe(120000);
  expect(s.payment).toBeCloseTo(581.61, 2);
  expect(Math.round(s.totalInterest)).toBe(54484);
  expect(Math.round(s.totalPaid)).toBe(174484);
  expect(loanSummary({ type: "pot", amount: 15000, downPct: 20, years: 5, rate: 7.5 }).principal).toBe(15000);
});

test("clampToRange falls back on non-numbers and clamps", () => {
  expect(clampToRange("", 1, 35, 30)).toBe(30);
  expect(clampToRange("абв", 1, 35, 30)).toBe(30);
  expect(clampToRange(undefined, 1, 35, 30)).toBe(30);
  expect(clampToRange(9999999, 20000, 600000, 160000)).toBe(600000);
  expect(clampToRange(-5, 1, 35, 30)).toBe(1);
  expect(clampToRange("12", 1, 35, 30)).toBe(12);
});

test("formatEur", () => {
  expect(norm(formatEur(581.61, 2))).toBe("581,61 €");
  expect(norm(formatEur(120000))).toBe("120 000 €");
});

test("LOAN_TYPES defaults lie inside their ranges", () => {
  expect(Object.keys(LOAN_TYPES)).toEqual(["ipo", "pot", "biz"]);
  for (const t of Object.values(LOAN_TYPES)) {
    expect(t.default).toBeGreaterThanOrEqual(t.min);
    expect(t.default).toBeLessThanOrEqual(t.max);
    for (const r of [t.years, t.rate]) {
      expect(r.default).toBeGreaterThanOrEqual(r.min);
      expect(r.default).toBeLessThanOrEqual(r.max);
    }
    if (t.hasDown) expect(t.down.default).toBeLessThanOrEqual(t.down.max);
  }
  expect(LOAN_TYPES.ipo.hasDown).toBe(true);
  expect(LOAN_TYPES.pot.hasDown).toBe(false);
  expect(LOAN_TYPES.biz.amountLabel).toBe("Сума на финансирането");
});
