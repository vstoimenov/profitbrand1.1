import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { LOAN_TYPES, loanSummary } from "../../../lib/credit";
import { validateCreditLead, buildCreditLead, saveLead } from "../../../lib/creditLeads";

const EMPTY = { type: "ipo", amount: "", income: "", name: "", phone: "", email: "", note: "", consent: false };

const inputCls =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-credit-ink outline-none transition focus:border-credit-pine2 focus:ring-2 focus:ring-credit-mint/40";

function Field({ id, label, error, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-credit-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/* Lead form for the demo: validates, scores and stores the lead in this browser only. */
export default function LeadForm({ prefill, onOpenCrm }) {
  const [form, setForm] = useState(EMPTY);
  const [extra, setExtra] = useState({}); // downPct, years, rate, chat from calculator/assistant
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    if (!prefill) return;
    const { type, amount, income, downPct, years, rate, chat } = prefill;
    setForm((f) => ({
      ...f,
      type: LOAN_TYPES[type] ? type : f.type,
      amount: amount ?? f.amount,
      income: income ?? f.income,
    }));
    setExtra({ downPct, years, rate, chat: chat || null });
    setSent(false);
    busy.current = false;
  }, [prefill]);

  const set = (k) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (busy.current) return;
    const errs = validateCreditLead(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    busy.current = true;
    const t = LOAN_TYPES[form.type];
    const years = extra.years ?? t.years.default;
    const rate = extra.rate ?? t.rate.default;
    const downPct = t.hasDown ? extra.downPct ?? t.down.default : 0;
    const summary = loanSummary({ type: form.type, amount: Number(form.amount), downPct, years, rate });
    const lead = buildCreditLead(
      { ...form, years, rate, downPct },
      { summary, source: extra.chat ? "assistant" : "form", chat: extra.chat || null }
    );
    saveLead(lead);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-credit-line bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 text-credit-mint" size={40} />
        <h3 className="font-cr-head text-xl font-semibold text-credit-ink">Запитването е прието.</h3>
        <p className="mx-auto mt-2 max-w-md text-credit-soft">
          Консултант ще се свърже с теб до 24 часа.
        </p>
        <button
          type="button"
          onClick={onOpenCrm}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-credit-pine px-5 py-3 text-sm font-semibold text-white transition hover:bg-credit-pine2"
        >
          Виж го в CRM (демо) <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const border = (k) => (errors[k] ? "border-red-400" : "border-credit-line");

  return (
    <form noValidate onSubmit={submit} className="grid gap-4 rounded-2xl border border-credit-line bg-white p-5 text-left sm:grid-cols-2 sm:p-8">
      <Field id="lf-type" label="Вид кредит" error={errors.type}>
        <select id="lf-type" value={form.type} onChange={(e) => { set("type")(e); setExtra((x) => ({ chat: x.chat || null })); }} className={`${inputCls} ${border("type")}`}>
          {Object.entries(LOAN_TYPES).map(([id, t]) => <option key={id} value={id}>{t.label}</option>)}
        </select>
      </Field>
      <Field id="lf-amount" label={`${LOAN_TYPES[form.type].amountLabel} (€)`} error={errors.amount}>
        <input id="lf-amount" type="number" inputMode="numeric" min="0" value={form.amount} onChange={set("amount")} className={`${inputCls} ${border("amount")}`} placeholder="напр. 150000" />
      </Field>
      <Field id="lf-income" label="Нетен месечен доход (€, по избор)">
        <input id="lf-income" type="number" inputMode="numeric" min="0" value={form.income} onChange={set("income")} className={`${inputCls} border-credit-line`} placeholder="помага за по-точна оценка" />
      </Field>
      <Field id="lf-name" label="Име" error={errors.name}>
        <input id="lf-name" autoComplete="name" value={form.name} onChange={set("name")} className={`${inputCls} ${border("name")}`} />
      </Field>
      <Field id="lf-phone" label="Телефон" error={errors.phone}>
        <input id="lf-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className={`${inputCls} ${border("phone")}`} placeholder="+359 …" />
      </Field>
      <Field id="lf-email" label="Имейл" error={errors.email}>
        <input id="lf-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className={`${inputCls} ${border("email")}`} />
      </Field>
      <div className="sm:col-span-2">
        <Field id="lf-note" label="Коментар (по избор)">
          <textarea id="lf-note" rows={3} value={form.note} onChange={set("note")} className={`${inputCls} border-credit-line`} placeholder="Какъв имот, срок, въпроси…" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="lf-consent" className="flex items-start gap-3 text-sm text-credit-soft">
          <input id="lf-consent" type="checkbox" checked={form.consent} onChange={set("consent")} className="mt-0.5 h-4 w-4 flex-none accent-credit-pine2" />
          <span>Съгласен/а съм с обработката на личните ми данни за целите на запитването.</span>
        </label>
        {errors.consent && <p className="mt-1 text-xs text-red-600">{errors.consent}</p>}
      </div>
      <div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        {extra.chat ? <span className="text-xs text-credit-pine2">Данните са попълнени от асистента.</span> : <span className="text-xs text-credit-soft">Безплатно и без ангажимент.</span>}
        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-credit-pine px-6 py-3 text-sm font-semibold text-white transition hover:bg-credit-pine2 sm:w-auto">
          Изпрати запитване
        </button>
      </div>
    </form>
  );
}
