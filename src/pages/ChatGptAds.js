import { useEffect, useState } from "react";
import {
  ArrowRight, ArrowLeft, Check, X, Plus, Shield, Search, FileText, Zap,
  MessageSquare, Lock, Users, Ban, Clock, Sparkles, Target, BarChart3, Mail, AlertTriangle,
} from "lucide-react";
import { daysSince, daysWord, bgMonthName } from "../lib/dates";
import { BUDGETS, CLIENT_VALUES, buildLeadPayload, validateLead, submitLead, sourceFromSearch } from "../lib/leads";

const LAUNCH_BG = "2026-08-24";

const SECRETS = [
  { icon: BarChart3, t: "Кликът струва около €3–5. Не €0.30.", d: "Ако продаваш нещо за €25, това не е реклама — това е дарение за OpenAI." },
  { icon: Users, t: "Вижда я само човек на безплатния или Go план.", d: "Който плаща за Plus — никога. Ако таргетираш CEO-та на корпорации, забрави." },
  { icon: Target, t: "Няма „жени 35–45 в София“. Няма интереси.", d: "Има само темата на разговора. Ако хората не питат ChatGPT за твоя продукт — рекламата ти не съществува." },
  { icon: Clock, t: "В България тръгна на 24 август 2026.", d: "Никой няма и един ред данни какво работи тук. НИКОЙ." },
];

const DONT = [
  ["…продаваш импулсна стока под €30.", "Сметката не излиза. Никога."],
  ["…нямаш сайт, който вече продава.", "ChatGPT праща най-горещия трафик, който ще видиш — на счупен лендинг това е горещ трафик в кофата."],
  ["…искаш „да пробваш със 100 евро“.", "100 евро са 25 клика. От 25 клика не научаваш нищо, освен че си похарчил 100 евро."],
  ["…търсиш някой да ти обещае продажби.", "Каналът е на седмици тук. Който ти обещава продажби, гадае — с твоите пари."],
];

const DO = [
  ["Хората питат ChatGPT за това, което продаваш", "— софтуер, услуги, обучения, специализирана техника, B2B."],
  ["Един клиент ти носи над €150.", "Тогава клик за €4 е най-евтиният клиент, който си купувал от години."],
  ["Сайтът ти вече конвертира от Facebook или Google.", "Просто искаш още един кран, от който конкурентите още не пият."],
];

const STEPS = [
  { icon: MessageSquare, step: "Стъпка 1", title: "3 въпроса, 60 секунди", desc: "Какво продаваш, какъв бюджет, колко ти носи клиент. Толкова. Никакво „да си запишем разговор за откриване“." },
  { icon: FileText, step: "Стъпка 2", title: "Вердикт за 48 часа", desc: "„Да“, „не“ или „не още“ — с една конкретна причина, на имейл. Ако е „не“, току-що си спестил бюджета и месец нерви. Ако е „да“ — получаваш офертата и KPI-а, с който ще те мерим НАС, писмено, преди да си платил лев." },
  { icon: Zap, step: "Стъпка 3", title: "30-дневен пилот", desc: "Setup за 5 работни дни. Първи данни на 14-ия ден. Присъда на 30-ия. Стигнем ли KPI-а — продължаваш. Не го стигнем ли — вторият месец е за наша сметка." },
];

const PILOT = [
  { icon: Lock, t: "Партньорски достъп до ChatGPT Ads инвентара за България", d: "Не чакаш self-serve, който за България още не е отворен, и не се редиш зад корпорациите." },
  { icon: Search, t: "Fit анализ на една страница", d: "Кои точно разговори в ChatGPT водят към твоя продукт, какво питат хората и с какви думи." },
  { icon: Target, t: "Setup на акаунт, tracking и конверсии", d: "За да виждаш всяко евро от ChatGPT отделно, а не смесено с Facebook." },
  { icon: Sparkles, t: "3–5 варианта на рекламата", d: "Написани по въпросите, които хората реално задават — не по това, което ти мислиш, че питат." },
  { icon: BarChart3, t: "Два отчета — ден 14 и ден 30", d: "Цена на клик, цена на лийд, какво работи, какво режем и защо." },
  { icon: Shield, t: "KPI, записан в деня на вердикта", d: "Преди да платиш. Ако не го стигнем — плащаме ние. (Виж гаранцията.)" },
];

const FAQS = [
  { q: "Ако ме отхвърлите — какво получавам?", a: "Една конкретна причина и какво трябва да се промени, за да стане „да“. Понякога е сайтът, понякога офертата, понякога нишата просто не се пита в ChatGPT. Никой не получава „не“ без обяснение." },
  { q: "Защо не пускате реклами на всеки, който плаща?", a: "Защото на 14-ия ден ще видиш, че не работи, и ще си прав да ни намразиш. Искаме 10 пилота, които работят, не 30, от които 20 се отказват с лош вкус в устата. Данните от твоята ниша са ни по-ценни от таксата ти." },
  { q: "Колко струва един клик в ChatGPT?", a: "В САЩ — около $3–5. В България никой няма число. Това е част от това, което пилотът ти дава: на 14-ия ден ще го знаеш за твоята ниша, от твоя акаунт." },
  { q: "Всички ли виждат рекламата?", a: "Не. Само хора на безплатния и Go план. Plus и Pro не виждат реклами. За B2C и малък/среден B2B в България това е огромното мнозинство. За корпоративни CEO-та — не разчитай." },
  { q: "Кой определя KPI-а — не е ли удобно за вас?", a: "Заедно, в деня на вердикта, писмено, преди да си платил. Ако сметнеш, че сме го поставили меко — кажи, вдигаме го. Гаранцията е безсмислена, ако KPI-ът е шега." },
  { q: "Не може ли просто да изчакам self-serve Ads Manager?", a: "Може. Тогава влизаш заедно с всички останали и наддаваш срещу тях. Помниш ли Facebook през 2015? Ранните плащаха стотинки, защото никой друг не наддаваше. После дойдоха всички. Прозорецът е сега." },
];

const EMPTY = { sells: "", budget: "", clientValue: "", name: "", email: "", website: "" };

const css = `
.cg { color:var(--w); }
.cg .sec h2 { max-width:900px; margin-left:auto; margin-right:auto; }
.cg-hero { padding:120px 48px 72px; text-align:center; position:relative; overflow:hidden;
  background:radial-gradient(ellipse at 50% 0%, rgba(255,214,0,.10), transparent 55%), var(--b); }
.cg-pre { display:inline-block; max-width:820px; margin:0 auto 22px; padding:10px 16px; border-radius:8px;
  background:rgba(255,68,85,.10); border:1px solid rgba(255,68,85,.35); color:#FF8A94;
  font-size:12px; font-weight:700; letter-spacing:.5px; line-height:1.5; }
.cg-pre b { color:#FF4455; }
.cg-hero h1 { font-family:'Unbounded'; font-size:clamp(24px,3.6vw,42px); font-weight:800; line-height:1.15;
  letter-spacing:-1px; max-width:960px; margin:0 auto 20px; }
.cg-hero h1 em { font-style:normal; color:var(--y); }
.cg-sub { font-size:16px; line-height:1.7; color:var(--g2); max-width:760px; margin:0 auto 28px; }
.cg-sub strong { color:var(--w); }
.cg-micro { margin-top:14px; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--g); font-weight:700; }
.cg-micro b { color:var(--y); }

/* Real ChatGPT screenshot with Sponsored card */
.cg-shot { max-width:560px; margin:52px auto 0; position:relative; border-radius:18px; overflow:visible; }
.cg-shot img { display:block; width:100%; height:auto; border-radius:18px; border:1px solid rgba(255,255,255,.1);
  box-shadow:0 30px 80px -30px rgba(0,0,0,.85), 0 0 0 1px rgba(255,214,0,.08); }
.cg-shot-tag { position:absolute; right:-18px; top:27%; transform:rotate(-4deg);
  background:#FF4455; color:#fff; font-family:'Unbounded'; font-size:11px; font-weight:800; letter-spacing:.5px;
  padding:9px 12px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;
  box-shadow:0 10px 30px rgba(255,68,85,.45); white-space:nowrap; }
@media (max-width:700px) { .cg-shot-tag { right:8px; top:25%; font-size:9px; padding:8px 10px; } }

/* Section prose */
.cg-prose { max-width:720px; margin:0 auto; font-size:16px; line-height:1.75; color:var(--g2); }
.cg-prose p { margin-bottom:16px; }
.cg-prose strong { color:var(--w); }
.cg-prose em { color:var(--y); font-style:normal; }
.cg-prose .cg-big { font-family:'Unbounded'; font-size:clamp(16px,2vw,22px); font-weight:700; color:var(--w); line-height:1.35; margin:26px 0 18px; }
.cg-secrets { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; max-width:900px; margin:32px auto 0; }
.cg-secret { background:var(--b3); border:1px solid rgba(255,214,0,.12); border-radius:16px; padding:22px; display:flex; gap:14px; align-items:flex-start; }
.cg-secret .ic { color:var(--y); flex-shrink:0; margin-top:2px; }
.cg-secret h4 { font-family:'Unbounded'; font-size:12px; font-weight:800; line-height:1.4; margin-bottom:6px; }
.cg-secret p { font-size:13px; color:var(--g2); line-height:1.6; }
.cg-punch { max-width:760px; margin:36px auto 0; padding:22px 26px; border-left:4px solid #FF4455; background:rgba(255,68,85,.06);
  border-radius:0 12px 12px 0; font-size:15px; line-height:1.65; color:var(--w); }

/* Warning */
.cg-warn-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:1040px; margin:40px auto 0; }
.cg-warn { border-radius:18px; padding:30px 28px; background:var(--b3); border:1px solid rgba(255,68,85,.25); }
.cg-warn.ok { border-color:rgba(255,214,0,.35); background:linear-gradient(135deg,rgba(255,214,0,.07),rgba(255,214,0,.02)); }
.cg-warn h3 { font-family:'Unbounded'; font-size:15px; font-weight:800; margin-bottom:18px; display:flex; align-items:center; gap:10px; color:#FF6B78; }
.cg-warn.ok h3 { color:var(--y); }
.cg-warn li { list-style:none; display:flex; gap:12px; padding:11px 0; border-top:1px solid rgba(255,255,255,.05); font-size:14px; line-height:1.55; color:var(--g2); }
.cg-warn li b { color:var(--w); display:block; margin-bottom:2px; }
.cg-warn li .m { width:24px; height:24px; min-width:24px; border-radius:7px; display:flex; align-items:center; justify-content:center; margin-top:2px;
  background:rgba(255,68,85,.14); color:#FF6B78; }
.cg-warn.ok li .m { background:rgba(255,214,0,.14); color:var(--y); }

/* Pilot deliverables on yellow */
.cg-pilot { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; max-width:1140px; margin:0 auto; }
.cg-pilot-i { background:#fff; color:var(--b); border-radius:14px; padding:24px 20px; display:flex; flex-direction:column; gap:10px;
  box-shadow:0 2px 0 rgba(8,8,16,.08); }
.cg-pilot-i .ic { width:44px; height:44px; border-radius:50%; background:var(--b); color:var(--y); display:flex; align-items:center; justify-content:center; }
.cg-pilot-i h4 { font-family:'Unbounded'; font-size:12px; font-weight:800; line-height:1.35; }
.cg-pilot-i p { font-size:13px; color:#3a3a4a; line-height:1.6; }
.cg-pilot-note { max-width:760px; margin:32px auto 0; text-align:center; background:#080810; color:var(--w); border-radius:14px; padding:20px 24px;
  font-size:14px; line-height:1.65; }
.cg-pilot-note b { color:var(--y); }

/* Founder */
.cg-founder { max-width:900px; margin:0 auto; display:grid; grid-template-columns:220px 1fr; gap:36px; align-items:start;
  background:linear-gradient(135deg,rgba(255,214,0,.05),rgba(255,214,0,.01)); border:1px solid rgba(255,214,0,.12); border-radius:20px; padding:36px; }
.cg-founder img { width:100%; aspect-ratio:1; object-fit:cover; border-radius:16px; border:2px solid rgba(255,214,0,.3); display:block; }
.cg-founder .nm { font-family:'Unbounded'; font-size:16px; font-weight:800; margin-bottom:4px; }
.cg-founder .rl { color:var(--y); font-size:10px; letter-spacing:2px; text-transform:uppercase; font-weight:700; margin-bottom:16px; display:block; }
.cg-founder p { font-size:14px; line-height:1.7; color:var(--g2); margin-bottom:12px; }
.cg-founder p strong { color:var(--w); }
.cg-creds { display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
.cg-creds span { padding:6px 12px; border-radius:16px; background:rgba(255,214,0,.07); border:1px solid rgba(255,214,0,.15); font-size:11px; color:var(--y); font-weight:600; }

/* Form */
.cg-form { max-width:560px; margin:36px auto 0; background:var(--b3); border:1px solid rgba(255,214,0,.15); border-radius:20px; padding:34px; text-align:left; }
.cg-form .fg label { color:var(--g2); font-size:10px; }
.cg-form select { width:100%; background:var(--b2); border:1px solid rgba(255,255,255,.08); color:var(--w); padding:12px 14px; font-family:'Outfit';
  font-size:13px; outline:none; border-radius:8px; appearance:none; -webkit-appearance:none;
  background-image:linear-gradient(45deg,transparent 50%,var(--y) 50%),linear-gradient(135deg,var(--y) 50%,transparent 50%);
  background-position:calc(100% - 20px) 50%,calc(100% - 14px) 50%; background-size:6px 6px,6px 6px; background-repeat:no-repeat; }
.cg-form select:focus, .cg-form .fg input:focus { border-color:var(--y); }
.cg-form select:invalid { color:var(--g); }
.cg-form .fg input { background:var(--b2); border-color:rgba(255,255,255,.08); }
.cg-form .fg.err input, .cg-form .fg.err select { border-color:#FF4455; }
.cg-err { color:#FF6B78; font-size:11px; margin-top:6px; }
.cg-form-q { font-family:'Unbounded'; font-size:10px; font-weight:800; color:var(--y); letter-spacing:1.5px; margin:0 0 14px; }
.cg-form-q.second { margin-top:24px; padding-top:20px; border-top:1px solid rgba(255,255,255,.06); }
.cg-form .btn { width:100%; justify-content:center; margin-top:8px; }
.cg-form-note { font-size:12px; color:var(--g); line-height:1.6; margin-top:14px; text-align:center; }
.cg-form-note b { color:var(--g2); }
.cg-fail { margin-top:12px; padding:12px 14px; border-radius:8px; background:rgba(255,68,85,.1); border:1px solid rgba(255,68,85,.3); color:#FF8A94; font-size:13px; line-height:1.5; }
.cg-done { text-align:center; padding:20px 0; }
.cg-done .ic { width:64px; height:64px; border-radius:50%; background:var(--y); color:var(--b); display:flex; align-items:center; justify-content:center; margin:0 auto 18px; }
.cg-done h3 { font-family:'Unbounded'; font-size:18px; font-weight:800; margin-bottom:10px; }
.cg-done p { font-size:14px; color:var(--g2); line-height:1.65; }

/* Final */
.cg-paths { display:grid; grid-template-columns:1fr 1fr; gap:18px; max-width:900px; margin:36px auto; }
.cg-path { border-radius:18px; padding:28px; background:var(--b3); border:1px solid rgba(255,255,255,.06); text-align:left; }
.cg-path.win { border-color:rgba(255,214,0,.4); background:linear-gradient(135deg,rgba(255,214,0,.08),rgba(255,214,0,.02)); }
.cg-path .lb { font-family:'Unbounded'; font-size:10px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:var(--g); margin-bottom:10px; }
.cg-path.win .lb { color:var(--y); }
.cg-path p { font-size:14px; line-height:1.65; color:var(--g2); }
.cg-path.win p { color:var(--w); }
.cg-final-h { font-family:'Unbounded'; font-size:clamp(20px,3vw,32px); font-weight:800; max-width:720px; margin:0 auto 12px; line-height:1.2; text-align:center; }
.cg-final-h em { font-style:normal; color:var(--y); }
.cg-final-p { color:var(--g2); font-size:14px; max-width:560px; margin:0 auto 26px; text-align:center; line-height:1.65; }

@media (max-width:1024px) { .cg-pilot { grid-template-columns:repeat(2,1fr); } }
@media (max-width:900px) {
  .cg-hero { padding:104px 20px 56px; }
  .cg-secrets, .cg-warn-grid, .cg-paths { grid-template-columns:1fr; }
  .cg-founder { grid-template-columns:1fr; padding:24px 18px; }
  .cg-founder img { max-width:200px; }
  .cg-form { padding:24px 18px; }
  .cg-warn { padding:22px 18px; }
}
@media (max-width:600px) { .cg-pilot { grid-template-columns:1fr; } .cg-hero h1 { font-size:22px; letter-spacing:-.5px; } .cg-sub { font-size:15px; }
  .cg .btn { white-space:normal; text-align:center; line-height:1.45; padding:14px 20px; max-width:100%; } }
`;

export default function ChatGptAds({ nav }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | fail
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("pb-cg-styles")) return;
    const el = document.createElement("style");
    el.id = "pb-cg-styles";
    el.textContent = css;
    document.head.appendChild(el);
  }, []);

  const days = daysSince(LAUNCH_BG);
  const month = bgMonthName(new Date());

  const goApply = () => {
    const el = document.getElementById("apply");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateLead(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    try {
      const payload = buildLeadPayload(form, { source: sourceFromSearch(typeof window !== "undefined" ? window.location.search : "") });
      await submitLead(payload);
      setStatus("done");
    } catch {
      setStatus("fail");
    }
  };

  const field = (k, label, input) => (
    <div className={`fg ${errors[k] ? "err" : ""}`}>
      <label htmlFor={`cg-${k}`}>{label}</label>
      {input}
      {errors[k] && <div className="cg-err">{errors[k]}</div>}
    </div>
  );

  return (
    <div className="cg">
      {/* 1. Hero */}
      <section className="cg-hero">
        <div className="cg-pre"><b>ВНИМАНИЕ:</b> За собственици на бизнес, които плащат €0.30 на клик във Facebook и се питат защо клиентите стават все по-скъпи</div>
        <h1>
          ChatGPT започна да показва реклами в България преди <em>{days} {daysWord(days)}</em>. Ето как да сложиш бизнеса си под отговора, който клиентът ти сам е поискал — преди конкурентите ти да разберат, че това изобщо е възможно.
        </h1>
        <p className="cg-sub">
          Не пускаме реклами на всеки, който плаща. Отговаряш на 3 въпроса, за 48 часа получаваш вердикт — <strong>„да“, „не“ или „не още“</strong> — и ако си от 3-те на всеки 10, които одобряваме, за 30 дни ще знаеш какво струва клиент от ChatGPT в ТВОЯТА ниша. От твоя акаунт. Не от статия.
        </p>
        <button className="btn" onClick={goApply}>Провери дали бизнесът ти е подходящ <ArrowRight size={14} /></button>
        <div className="cg-micro">3 въпроса · 60 секунди · вердикт за 48 ч · <b>само 5 пилотни слота за {month}</b></div>

        <figure className="cg-shot">
          <img
            src="/chatgpt-ad-example.jpg"
            width="750"
            height="1000"
            alt="ChatGPT отговор със Sponsored реклама под него — пример как изглежда рекламата в ChatGPT"
          />
          <figcaption className="cg-shot-tag"><ArrowLeft size={14} /> ТУК. ТВОЯТА. ИЛИ НА КОНКУРЕНТА.</figcaption>
        </figure>
      </section>

      {/* 2. Secret */}
      <section className="sec dk">
        <div className="tg">Прочети това внимателно</div>
        <h2 className="U">Мръсната малка тайна за <em>рекламите в ChatGPT</em></h2>
        <p className="sdesc">Защото след 6 месеца ще е късно.</p>
        <div className="cg-prose">
          <p>Представи си клиента ти. Сяда вечерта, отваря ChatGPT и пише: <strong>„кой софтуер за фактури е най-добър за малка фирма в България“</strong>. Не скролва. Не гледа видеа с котки. Пита. С намерение. С кредитна карта в главата.</p>
          <p>И под отговора — малка карта с надпис <em>Sponsored</em>. Твоята. Или на конкурента ти.</p>
          <p className="cg-big">Няма по-топъл момент в цялата история на рекламата. Google хващаше намерение с 3 думи. ChatGPT го хваща с цял разговор.</p>
          <p>А сега тайната, която „експертите“ в LinkedIn пропускат:</p>
        </div>
        <div className="cg-secrets">
          {SECRETS.map((s, i) => (
            <div key={i} className="cg-secret">
              <span className="ic"><s.icon size={22} /></span>
              <div><h4>{s.t}</h4><p>{s.d}</p></div>
            </div>
          ))}
        </div>
        <div className="cg-punch">
          Точно затова всяка агенция, която ти каже „да, разбира се, пускаме веднага!“ — ти казва „да“ на парите ти, не на резултата ти.
        </div>
      </section>

      {/* 3. Warning */}
      <section className="sec">
        <div className="tg">Предупреждение</div>
        <h2 className="U">Не кандидатствай, <em>ако…</em></h2>
        <div className="cg-warn-grid">
          <div className="cg-warn">
            <h3><Ban size={18} /> Не кандидатствай, ако…</h3>
            <ul>
              {DONT.map(([b, d], i) => (
                <li key={i}><span className="m"><X size={14} /></span><span><b>{b}</b>{d}</span></li>
              ))}
            </ul>
          </div>
          <div className="cg-warn ok">
            <h3><Check size={18} /> Кандидатствай, ако поне две от тези три са верни:</h3>
            <ul>
              {DO.map(([b, d], i) => (
                <li key={i}><span className="m"><Check size={14} /></span><span><b>{b}</b>{d}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Steps */}
      <section className="sec dk">
        <div className="tg">Как става</div>
        <h2 className="U">3 стъпки, <em>нула срещи</em>.</h2>
        <div className="wp-grid" style={{ marginTop: 36 }}>
          {STEPS.map((p, i) => (
            <div key={i} className="wp-card">
              <div className="wp-head">
                <div className="wp-ico"><p.icon size={26} /></div>
                <div className="wp-step">{p.step}</div>
              </div>
              <h3 className="U">{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Pilot */}
      <section className="sec yellow">
        <div className="tg">Какво влиза в пилота</div>
        <h2 className="U">Не си сам <em>в него</em>.</h2>
        <p className="sdesc">Първите пилоти в България ги правим заедно. Ти получаваш данните за нишата си, ние — за следващите.</p>
        <div className="cg-pilot">
          {PILOT.map((p, i) => (
            <div key={i} className="cg-pilot-i">
              <div className="ic"><p.icon size={20} /></div>
              <h4>{p.t}</h4>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
        <div className="cg-pilot-note">
          Условията и цената получаваш в <b>персонална оферта в деня на вердикта</b> — писмено, заедно с KPI-а, преди да си платил лев.
        </div>
      </section>

      {/* 6. Founder */}
      <section className="sec">
        <div className="tg">Кой ти казва „не“</div>
        <h2 className="U">„Не“ е <em>част от услугата</em>.</h2>
        <div className="cg-founder" style={{ marginTop: 36 }}>
          <img src="/viktor.jpg" alt="Виктор Стоименов" loading="lazy" />
          <div>
            <div className="nm">Виктор Стоименов</div>
            <span className="rl">Founder, PROFITBRAND</span>
            <p>От 2024 г. правя performance маркетинг — за собствени продукти и за клиенти. Кампании в <strong>9 европейски пазара</strong>. Бизнес, който помогнах да стигне <strong>седемцифрен годишен оборот</strong>. Месечни бюджети от €3 000 до над €10 000.</p>
            <p>Виждал съм достатъчно канали, които не връщат парите, за да ги познавам на втория ден. Затова „не“ е част от услугата. Ако ти кажа „да“ на всичко, съм поредната агенция. Ако ти кажа „не“ навреме — съм ти спестил повече от всяка кампания.</p>
            <p>ChatGPT Ads гледам от февруари, когато тръгна в САЩ. Имам партньорски достъп до инвентара за България. Първите пилоти тук ще ги направим заедно — ти получаваш данните за нишата си, аз — за следващите. <strong>Затова слотовете са 5, не 50.</strong></p>
            <div className="cg-creds">
              <span>Google AI Leader сертификат</span>
              <span>9 европейски пазара</span>
              <span>Партньорски достъп ChatGPT Ads BG</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Guarantee */}
      <section className="sec dk">
        <div className="tg">Гаранция</div>
        <h2 className="U">Гаранцията <em>„плащаме ние“</em></h2>
        <div className="guar" style={{ marginTop: 32 }}>
          <h3 className="U">Гарантираме <em>числото, което зависи от нас</em></h3>
          <ul>
            <li><span className="gc"><Check size={14} /></span>В деня на вердикта записваме един KPI: цена на клик или цена на лийд, конкретна за твоята ниша. Писмено. Преди да платиш.</li>
            <li><span className="gc"><Check size={14} /></span>На 30-ия ден я сравняваме с реалността. Не сме я стигнали → вторият месец управление е за наша сметка. Ти плащаш само рекламния бюджет и решаваш дали продължаваме.</li>
            <li><span className="gc"><Check size={14} /></span>Не гарантираме продажби — и това е единствената честна гаранция, която някой може да ти даде за канал на {days} {daysWord(days)} в България. Гарантираме числото, което зависи от нас. И го носим.</li>
          </ul>
        </div>
      </section>

      {/* 8. Apply */}
      <section className="sec" id="apply">
        <div className="tg">Кандидатствай</div>
        <h2 className="U">3 въпроса, <em>60 секунди</em>.</h2>
        <p className="sdesc">Няма обаждане. Няма презентация. Няма „да ти покажем деска“. Отговаряш, проверяваме, за 48 часа получаваш вердикт на имейл.</p>
        <div className="cg-form">
          {status === "done" ? (
            <div className="cg-done">
              <div className="ic"><Mail size={28} /></div>
              <h3 className="U">Заявката е получена.</h3>
              <p>Проверяваме и до 48 часа получаваш вердикт на имейл — „да“, „не“ или „не още“, с една конкретна причина.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="cg-form-q">Трите въпроса</div>
              {field("sells", "Какво продаваш и на кого? (едно изречение)",
                <input id="cg-sells" value={form.sells} onChange={set("sells")} placeholder="Напр.: CRM софтуер за малки счетоводни кантори" />)}
              {field("budget", "Какъв месечен бюджет си готов да тестваш?",
                <select id="cg-budget" value={form.budget} onChange={set("budget")} required>
                  <option value="" disabled>Избери…</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>)}
              {field("clientValue", "Колко ти носи един клиент средно?",
                <select id="cg-clientValue" value={form.clientValue} onChange={set("clientValue")} required>
                  <option value="" disabled>Избери…</option>
                  {CLIENT_VALUES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>)}
              <div className="cg-form-q second">Къде да пратим вердикта</div>
              {field("name", "Име", <input id="cg-name" value={form.name} onChange={set("name")} placeholder="Твоето име" autoComplete="name" />)}
              {field("email", "Имейл", <input id="cg-email" type="email" value={form.email} onChange={set("email")} placeholder="email@firma.bg" autoComplete="email" />)}
              {field("website", "Сайт", <input id="cg-website" value={form.website} onChange={set("website")} placeholder="https://..." autoComplete="url" />)}
              <button className="btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Изпращаме…" : <>ПРАТИ ЗАЯВКАТА — ВЕРДИКТ ЗА 48 Ч <ArrowRight size={14} /></>}
              </button>
              {status === "fail" && (
                <div className="cg-fail">Нещо се обърка и заявката не стигна до нас. Опитай пак след минута или ни пиши директно — ще отговорим.</div>
              )}
              <div className="cg-form-note">
                Бюджет под €500 или клиент под €50 = <b>„не още“</b>. Ще ти го кажем директно. Честното „не“ е по-евтино и за двама ни.
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="sec dk">
        <div className="tg">ЧЗВ</div>
        <h2 className="U">Знаем какво <em>си мислиш</em>.</h2>
        <div className="faq" style={{ marginTop: 32 }}>
          {FAQS.map((q, i) => (
            <div key={i} className="faq-i">
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setOpenFaq(openFaq === i ? null : i)}>
                {q.q}
                <span className={`a ${openFaq === i ? "o" : ""}`}><Plus size={16} /></span>
              </div>
              <div className={`faq-a ${openFaq === i ? "o" : ""}`}>{q.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Final */}
      <section className="cta sec">
        <div className="tg">Имаш два пътя оттук</div>
        <div className="cg-paths">
          <div className="cg-path">
            <div className="lb">Първият</div>
            <p>Затваряш страницата, чакаш self-serve да отвори, влизаш след 6 месеца заедно с всички и плащаш клика, който тълпата е качила. Легитимен избор. Просто скъп.</p>
          </div>
          <div className="cg-path win">
            <div className="lb">Вторият</div>
            <p>Отговаряш на 3 въпроса сега. За 48 часа знаеш дали изобщо си струва. Ако не — спестил си бюджета. Ако да — след 30 дни имаш числа за нишата си, които никой конкурент няма.</p>
          </div>
        </div>
        <h2 className="cg-final-h U">5 пилотни слота за <em>{month}</em>.</h2>
        <p className="cg-final-p">Не защото е „маркетинг“ — защото толкова можем да водим като хората.</p>
        <button className="btn" onClick={goApply}>Провери дали бизнесът ти е подходящ <ArrowRight size={14} /></button>
        <p style={{ marginTop: 22, fontSize: 12 }}>
          <a href="/" onClick={(e) => { e.preventDefault(); nav("home"); }} style={{ color: "var(--g)", textDecoration: "none" }}>
            <AlertTriangle size={12} style={{ verticalAlign: -2, marginRight: 4 }} /> Обратно към PROFITBRAND
          </a>
        </p>
      </section>
    </div>
  );
}
