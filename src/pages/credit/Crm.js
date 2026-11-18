import { useMemo, useState } from "react";
import { Inbox, Users, Landmark, Settings, ArrowLeft, X, RotateCcw } from "lucide-react";
import { BRAND, LOAN_TYPES, formatEur } from "../../lib/credit";
import { STATUSES, loadLeads, saveStatus, resetDemo } from "../../lib/creditLeads";
import { BrandMark } from "./components/Logo";

const SCORE = {
  high: ["висока", "bg-credit-mint/20 text-credit-pine2"],
  medium: ["средна", "bg-amber-100 text-amber-800"],
  low: ["ниска", "bg-red-100 text-red-700"],
};
const STATUS_TONE = {
  "Нов": "bg-sky-100 text-sky-800",
  "Документи": "bg-amber-100 text-amber-800",
  "Подаден": "bg-indigo-100 text-indigo-800",
  "Одобрен": "bg-credit-mint/20 text-credit-pine2",
  "Отказан": "bg-red-100 text-red-700",
};
const NAV = [[Inbox, "Запитвания", true], [Users, "Клиенти"], [Landmark, "Банки"], [Settings, "Настройки"]];
const DOCS = ["Лична карта", "Удостоверение за доход", "Предварителен договор / документи за имота"];

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit" }) +
  " " + new Date(iso).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();

function Chip({ className, children }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}

function BackLink({ nav, className = "" }) {
  return (
    <a href="/credit" onClick={(e) => { e.preventDefault(); nav("credit"); window.scrollTo?.(0, 0); }} className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
      <ArrowLeft size={16} aria-hidden="true" /> Към сайта
    </a>
  );
}

function Detail({ lead, onClose, onStatus }) {
  const t = LOAN_TYPES[lead.type];
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-credit-ink/40" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-label={`Запитване от ${lead.name}`} className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-cr-head text-xl font-semibold">{lead.name}</h2>
            <p className="text-sm text-credit-soft">{fmtDate(lead.date)} · {lead.source === "assistant" ? "от асистента" : "от формата"}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Затвори" className="rounded-lg p-1 text-credit-soft hover:bg-credit-mist"><X size={20} /></button>
        </div>

        <label htmlFor="crm-status" className="mb-1 block text-sm font-medium">Статус</label>
        <select id="crm-status" value={lead.status} onChange={(e) => onStatus(lead.id, e.target.value)} className="mb-6 w-full rounded-lg border border-credit-line px-3 py-2 text-sm">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <dl className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <dt className="text-credit-soft">Телефон</dt><dd className="select-all">{lead.phone}</dd>
          <dt className="text-credit-soft">Имейл</dt><dd className="select-all break-all">{lead.email}</dd>
          <dt className="text-credit-soft">Вид</dt><dd>{t?.label}</dd>
          <dt className="text-credit-soft">{t?.amountLabel}</dt><dd className="tabular-nums">{formatEur(lead.amount)}</dd>
          {t?.hasDown && (<><dt className="text-credit-soft">Самоучастие</dt><dd>{lead.downPct}%</dd></>)}
          <dt className="text-credit-soft">Срок / лихва</dt><dd>{lead.years} г. · {Number(lead.rate).toFixed(1)}%</dd>
          <dt className="text-credit-soft">Вноска</dt><dd className="font-semibold tabular-nums">{formatEur(lead.payment, 2)}</dd>
          <dt className="text-credit-soft">Доход</dt><dd className="tabular-nums">{lead.income ? formatEur(lead.income) : "не е посочен"}</dd>
          <dt className="text-credit-soft">AI оценка</dt><dd><Chip className={(SCORE[lead.score] || SCORE.medium)[1]}>{(SCORE[lead.score] || SCORE.medium)[0]}</Chip></dd>
        </dl>

        {lead.note && <p className="mb-6 rounded-lg bg-credit-mist p-3 text-sm">{lead.note}</p>}

        <h3 className="mb-2 font-cr-head font-semibold">Документи</h3>
        <ul className="mb-6 space-y-2 text-sm">
          {DOCS.map((d) => (
            <li key={d}><label className="flex items-center gap-2"><input type="checkbox" className="accent-credit-pine2" /> {d}</label></li>
          ))}
        </ul>

        {Array.isArray(lead.chat) && (
          <>
            <h3 className="mb-2 font-cr-head font-semibold">Разговор с асистента</h3>
            <div className="flex flex-col gap-2">
              {lead.chat.map((m, i) => (
                <div key={i} className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${m.from === "me" ? "self-end bg-credit-pine text-white" : "self-start bg-credit-mist"}`}>{m.text}</div>
              ))}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* Demo CRM: reads leads saved by the landing form plus fixed demo rows. */
export default function Crm({ nav }) {
  const [leads, setLeads] = useState(() => loadLeads());
  const [openId, setOpenId] = useState(null);
  const open = leads.find((l) => l.id === openId) || null;

  const stats = useMemo(() => [
    ["Нови днес", leads.filter((l) => l.isNew || isToday(l.date)).length],
    ["В обработка", leads.filter((l) => l.status === "Документи").length],
    ["Подадени към банка", leads.filter((l) => l.status === "Подаден").length],
    ["Одобрени", leads.filter((l) => l.status === "Одобрен").length],
  ], [leads]);

  const onStatus = (id, status) => {
    saveStatus(id, status);
    setLeads(loadLeads());
  };
  const onReset = () => {
    resetDemo();
    setOpenId(null);
    setLeads(loadLeads());
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-60 flex-none flex-col bg-credit-ink p-5 text-white/80 md:flex">
        <div className="mb-8 flex items-center gap-2 font-cr-head text-lg font-bold text-white">
          <BrandMark tone="bg-credit-pine2" /> {BRAND} <span className="text-xs font-normal text-white/50">CRM</span>
        </div>
        <nav aria-label="CRM" className="flex flex-col gap-1">
          {NAV.map(([Icon, label, active]) => (
            <span key={label} aria-disabled={!active} aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${active ? "bg-white/10 text-white" : "opacity-50"}`}>
              <Icon size={16} aria-hidden="true" /> {label}
            </span>
          ))}
        </nav>
        <div className="mt-auto pt-8"><BackLink nav={nav} className="text-white/70 hover:text-white" /></div>
      </aside>

      <div className="flex items-center justify-between bg-credit-ink px-4 py-3 text-white md:hidden">
        <span className="flex items-center gap-2 font-cr-head font-bold"><BrandMark tone="bg-credit-pine2" className="h-6 w-6" /> {BRAND} CRM</span>
        <BackLink nav={nav} className="text-white/80" />
      </div>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-cr-head text-2xl font-bold">Запитвания</h1>
            <p className="text-sm text-credit-soft">Демо данни · нищо тук не е реален клиент</p>
          </div>
          <button type="button" onClick={onReset} className="inline-flex items-center gap-2 self-start rounded-lg border border-credit-line bg-white px-3 py-2 text-sm text-credit-soft hover:text-credit-pine">
            <RotateCcw size={14} aria-hidden="true" /> Нулирай демото
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(([label, n]) => (
            <div key={label} className="rounded-xl border border-credit-line bg-white p-4">
              <div className="text-xs text-credit-soft">{label}</div>
              <div className="font-cr-head text-2xl font-bold tabular-nums">{n}</div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-credit-line bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-credit-line text-xs uppercase tracking-wide text-credit-soft">
              <tr>{["Дата", "Клиент", "Вид", "Сума", "AI оценка", "Статус", "Консултант"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} data-testid="crm-row" data-id={l.id} tabIndex={0}
                  onClick={() => setOpenId(l.id)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpenId(l.id))}
                  className={`cursor-pointer border-b border-credit-line/70 last:border-0 hover:bg-credit-mist focus:bg-credit-mist focus:outline-none ${l.isNew ? "bg-credit-mint/5" : ""}`}>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-credit-soft">{fmtDate(l.date)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-2">{l.name}{l.isNew && <Chip className="bg-credit-pine text-white">ново</Chip>}</span>
                  </td>
                  <td className="px-4 py-3">{LOAN_TYPES[l.type]?.label}</td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums">{formatEur(l.amount)}</td>
                  <td className="px-4 py-3"><Chip className={(SCORE[l.score] || SCORE.medium)[1]}>{(SCORE[l.score] || SCORE.medium)[0]}</Chip></td>
                  <td className="px-4 py-3"><Chip className={STATUS_TONE[l.status]}>{l.status}</Chip></td>
                  <td className="px-4 py-3 text-credit-soft">{l.consultant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {open && <Detail lead={open} onClose={() => setOpenId(null)} onStatus={onStatus} />}
    </div>
  );
}
