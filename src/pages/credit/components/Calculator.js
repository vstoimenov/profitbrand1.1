import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { LOAN_TYPES, loanSummary, clampToRange, formatEur } from "../../../lib/credit";

const defaultsFor = (type) => {
  const t = LOAN_TYPES[type];
  return { amount: t.default, downPct: t.hasDown ? t.down.default : 0, years: t.years.default, rate: t.rate.default };
};

function fieldsFor(type) {
  const t = LOAN_TYPES[type];
  const f = [
    { key: "amount", label: t.amountLabel, unit: "€", min: t.min, max: t.max, step: t.step, show: (v) => formatEur(v) },
  ];
  if (t.hasDown) f.push({ key: "downPct", label: "Самоучастие", unit: "%", min: t.down.min, max: t.down.max, step: 1, show: (v, all) => `${v}% · ${formatEur((all.amount * v) / 100)}` });
  f.push({ key: "years", label: "Срок", unit: "години", min: t.years.min, max: t.years.max, step: 1, show: (v) => `${v} г.` });
  f.push({ key: "rate", label: "Примерна лихва", unit: "%", min: t.rate.min, max: t.rate.max, step: t.rate.step, show: (v) => `${v.toFixed(1)}%` });
  return f;
}

/* Annuity calculator; every number field also has a slider bound to the same value. */
export default function Calculator({ onRequest }) {
  const [type, setType] = useState("ipo");
  const [values, setValues] = useState(() => defaultsFor("ipo"));
  const [drafts, setDrafts] = useState({});

  const s = loanSummary({ type, ...values });
  const fields = fieldsFor(type);

  const pickType = (next) => {
    setType(next);
    setValues(defaultsFor(next));
    setDrafts({});
  };
  const commit = (f, raw) => setValues((v) => ({ ...v, [f.key]: clampToRange(raw, f.min, f.max, v[f.key]) }));

  return (
    <div className="rounded-2xl border border-credit-line bg-white p-5 text-left shadow-[0_24px_60px_-32px_rgba(15,61,46,0.55)] sm:p-6">
      <div role="tablist" aria-label="Вид кредит" className="mb-5 flex gap-1 rounded-xl bg-credit-mist p-1">
        {Object.entries(LOAN_TYPES).map(([id, t]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={type === id}
            onClick={() => pickType(id)}
            className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition ${
              type === id ? "bg-white text-credit-pine shadow-sm" : "text-credit-soft hover:text-credit-pine"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `calc-${f.key}`;
          const value = values[f.key];
          return (
            <div key={f.key} className="min-w-0">
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                <label htmlFor={id} className="text-credit-soft">{f.label}</label>
                <span className="font-semibold tabular-nums text-credit-ink">{f.show(value, values)}</span>
              </div>
              <input
                id={id}
                type="number"
                inputMode="decimal"
                aria-label={`${f.label} (${f.unit})`}
                min={f.min}
                max={f.max}
                step={f.step}
                value={drafts[f.key] ?? value}
                onChange={(e) => {
                  setDrafts((d) => ({ ...d, [f.key]: e.target.value }));
                  commit(f, e.target.value);
                }}
                onBlur={() => setDrafts((d) => ({ ...d, [f.key]: undefined }))}
                className="w-full rounded-lg border border-credit-line bg-white px-3 py-2 text-sm tabular-nums text-credit-ink outline-none focus:border-credit-pine2 focus:ring-2 focus:ring-credit-mint/40"
              />
              <input
                type="range"
                aria-label={`${f.label}, плъзгач`}
                min={f.min}
                max={f.max}
                step={f.step}
                value={value}
                onChange={(e) => {
                  setDrafts((d) => ({ ...d, [f.key]: undefined }));
                  commit(f, e.target.value);
                }}
                className="mt-2 w-full accent-credit-pine2"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 items-end gap-4 rounded-xl bg-credit-pine p-5 text-white sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-xs text-white/70">Месечна вноска</div>
          <div data-testid="calc-payment" className="font-cr-head text-3xl font-bold tabular-nums text-credit-mint sm:text-[34px]">
            {formatEur(s.payment, 2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-white/70">Кредит</div>
          <div className="font-semibold tabular-nums">{formatEur(s.principal)}</div>
        </div>
        <div>
          <div className="text-xs text-white/70">Общо лихви</div>
          <div className="font-semibold tabular-nums">{formatEur(s.totalInterest)}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs text-credit-soft">Ориентировъчно изчисление, не е оферта.</p>
        <button
          type="button"
          onClick={() => onRequest({ type, ...values, payment: s.payment })}
          className="inline-flex items-center gap-2 rounded-xl bg-credit-pine px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-credit-pine2"
        >
          Искам реални оферти <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
