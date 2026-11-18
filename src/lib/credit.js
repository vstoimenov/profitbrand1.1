/* Credit demo („Финора“): loan types and annuity math. Pure functions only. */

export const BRAND = "Финора";

export const LOAN_TYPES = {
  ipo: {
    label: "Ипотечен",
    amountLabel: "Стойност на имота",
    min: 20000, max: 600000, step: 5000, default: 160000,
    years: { min: 1, max: 35, default: 30 },
    rate: { min: 1, max: 12, step: 0.1, default: 2.9 },
    hasDown: true,
    down: { min: 0, max: 50, default: 15 },
  },
  pot: {
    label: "Потребителски",
    amountLabel: "Сума",
    min: 1000, max: 50000, step: 500, default: 15000,
    years: { min: 1, max: 10, default: 5 },
    rate: { min: 3, max: 15, step: 0.1, default: 7.5 },
    hasDown: false,
  },
  biz: {
    label: "Бизнес",
    amountLabel: "Сума на финансирането",
    min: 5000, max: 500000, step: 5000, default: 80000,
    years: { min: 1, max: 15, default: 7 },
    rate: { min: 2, max: 12, step: 0.1, default: 5.2 },
    hasDown: false,
  },
};

/* Annuity: M = P·r / (1 − (1+r)^−n); r = 0 → P/n. */
export function monthlyPayment(principal, annualRatePct, years) {
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRatePct / 100 / 12;
  if (!principal || principal <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function loanSummary({ type, amount, downPct = 0, years, rate }) {
  const t = LOAN_TYPES[type] || LOAN_TYPES.ipo;
  const principal = t.hasDown ? amount * (1 - downPct / 100) : amount;
  const payment = monthlyPayment(principal, rate, years);
  const totalPaid = payment * Math.round(years * 12);
  return { principal, payment, totalInterest: totalPaid - principal, totalPaid };
}

export function clampToRange(value, min, max, fallback) {
  if (value === "" || value === null || value === undefined) return fallback;
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function formatEur(n, decimals = 0) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(n) ? n : 0);
}
