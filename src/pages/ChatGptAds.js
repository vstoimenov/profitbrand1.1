import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Check, X, Plus, FileText, Zap,
  MessageSquare, Users, BarChart3, Mail, AlertTriangle, Clock, Target,
} from "lucide-react";
import { BUDGETS, CLIENT_VALUES, buildLeadPayload, validateLead, submitLead, sourceFromSearch } from "../lib/leads";
import { trackPixel, trackLead } from "../lib/meta";

const EASE = [0.22, 1, 0.36, 1];

const canObserve = typeof IntersectionObserver !== "undefined";

function Reveal({ children, delay = 0, className, style, y = 24 }) {
  const reduce = useReducedMotion();
  if (reduce || !canObserve) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Lift({ children, className, style }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} style={style} whileHover={reduce ? undefined : { y: -5 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}

const FACTS = [
  { icon: BarChart3, t: "Кликът е скъп — около €3–5.", d: "Не €0.30 като във Facebook." },
  { icon: Users, t: "Виждат я само хора на безплатния план.", d: "Който плаща за ChatGPT Plus, не вижда реклами." },
  { icon: Target, t: "Няма таргетиране по възраст или интереси.", d: "Рекламата излиза само ако темата на разговора съвпада с твоя продукт." },
  { icon: Clock, t: "В България е от 1 септември.", d: "Още никой няма реални данни какво работи тук." },
];

const FOR_YOU = [
  ["Хората питат ChatGPT за това, което продаваш", "— услуги, софтуер, обучения, по-скъпа техника, B2B."],
  ["Един клиент ти носи над €150.", "Иначе клик за €4 не се връща."],
  ["Имаш сайт, който вече продава.", "Рекламата праща хора — сайтът ги превръща в клиенти."],
];

const STEPS = [
  { icon: MessageSquare, step: "Стъпка 1", title: "Отговаряш на 3 въпроса", desc: "Какво продаваш, какъв бюджет, колко ти носи един клиент. Отнема минута." },
  { icon: FileText, step: "Стъпка 2", title: "До 48 часа ти пиша лично", desc: "Подходящ е, не е, или не още — и защо. Ако е подходящ, говорим 15 минути и записваме целта: колко да струва клик или запитване." },
  { icon: Zap, step: "Стъпка 3", title: "Пускаме рекламите", desc: "Първите данни виждаш на 14-ия ден, пълен отчет на 30-ия. Ако не сме стигнали целта — вторият месец е без такса." },
];

const INCLUDED = [
  "Достъп до рекламите в ChatGPT през партньорска агенция (в България още няма самостоятелен достъп)",
  "Настройка на акаунт и проследяване",
  "3–5 варианта на рекламата по въпросите, които хората реално задават",
  "Два отчета — на 14-ия и на 30-ия ден",
];

const FAQS = [
  { q: "Ако кажеш, че не е подходящо — какво получавам?", a: "Една конкретна причина и какво трябва да се промени, за да стане. Никой не получава „не“ без обяснение." },
  { q: "Защо не пускаш реклами на всеки, който плаща?", a: "Защото след две седмици ще видиш, че не работи, и ще си прав да си ядосан. Предпочитам 5 клиента, при които работи, пред 15, които се отказват." },
  { q: "Колко струва един клик?", a: "В САЩ — около $3–5. В България още никой не знае точно. След 14 дни ще го знаеш за твоя бизнес." },
  { q: "Всички ли виждат рекламата?", a: "Не. Само хора на безплатния план на ChatGPT. Който плаща за Plus, не вижда реклами. За повечето бизнеси в България това е голямото мнозинство от хората." },
  { q: "Кой определя целта?", a: "Заедно, преди да платиш. Ако ти се струва твърде лесна — кажи, вдигаме я." },
  { q: "Не мога ли просто да си пусна сам, като отвори за всички?", a: "Можеш. Тогава ще влезеш заедно с всички останали. Сега има по-малко конкуренция и кликът е по-евтин." },
];

const EMPTY = { sells: "", budget: "", clientValue: "", name: "", email: "", phone: "", website: "" };

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

/* Pricing */
.cg-price { max-width:900px; margin:36px auto 0; display:grid; grid-template-columns:1.1fr 1fr; gap:18px; }
.cg-price-main { background:#fff; color:var(--b); border-radius:18px; padding:32px 30px; box-shadow:0 2px 0 rgba(8,8,16,.08); }
.cg-price-main .big { font-family:'Unbounded'; font-size:clamp(30px,4vw,44px); font-weight:900; line-height:1; }
.cg-price-main .big small { font-size:14px; font-weight:700; color:#3a3a4a; margin-left:6px; }
.cg-price-main .sub { font-size:13px; font-weight:700; color:#3a3a4a; margin:6px 0 18px; }
.cg-price-main li { list-style:none; display:flex; gap:10px; padding:8px 0; font-size:13px; line-height:1.55; color:#3a3a4a; border-top:1px solid rgba(8,8,16,.06); }
.cg-price-main li svg { color:var(--b); flex-shrink:0; margin-top:3px; }
.cg-price-side { display:flex; flex-direction:column; gap:14px; }
.cg-price-box { background:#080810; color:var(--w); border-radius:16px; padding:22px 24px; font-size:13px; line-height:1.65; flex:1; }
.cg-price-box h4 { font-family:'Unbounded'; font-size:11px; font-weight:800; color:var(--y); letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; }
.cg-price-box b { color:var(--y); }
.cg-notfor { max-width:900px; margin:20px auto 0; padding:20px 24px; border-radius:14px; background:var(--b3); border:1px solid rgba(255,68,85,.25);
  font-size:14px; line-height:1.65; color:var(--g2); display:flex; gap:14px; align-items:flex-start; }
.cg-notfor .m { width:26px; height:26px; min-width:26px; border-radius:7px; background:rgba(255,68,85,.14); color:#FF6B78; display:flex; align-items:center; justify-content:center; margin-top:1px; }
.cg-notfor b { color:var(--w); }
@media (max-width:900px) { .cg-price { grid-template-columns:1fr; } .cg-price-main { padding:24px 20px; } }

/* Fit-check widget */
.cg-fit { display:flex; gap:12px; padding:14px 16px; border-radius:12px; cursor:pointer; border:1px solid rgba(255,255,255,.07);
  background:rgba(255,255,255,.02); transition:border-color .2s ease, background .2s ease, transform .2s ease; font-size:14px; line-height:1.55; color:var(--g2); margin-bottom:10px; }
.cg-fit:hover { border-color:rgba(255,214,0,.35); transform:translateY(-2px); }
.cg-fit.on { border-color:var(--y); background:rgba(255,214,0,.08); }
.cg-fit b { color:var(--w); display:block; margin-bottom:2px; }
.cg-fit .m { width:26px; height:26px; min-width:26px; border-radius:8px; border:2px solid rgba(255,214,0,.4); display:flex; align-items:center; justify-content:center; color:var(--b); margin-top:2px; transition:all .2s ease; }
.cg-fit.on .m { background:var(--y); border-color:var(--y); }
.cg-fit input { position:absolute; opacity:0; width:1px; height:1px; pointer-events:none; }
.cg-verdict { margin-top:14px; padding:18px 20px; border-radius:14px; border:1px solid rgba(255,255,255,.08); background:var(--b3); font-size:14px; line-height:1.6; color:var(--g2); }
.cg-verdict.yes { border-color:rgba(255,214,0,.5); background:linear-gradient(135deg,rgba(255,214,0,.12),rgba(255,214,0,.03)); color:var(--w); }
.cg-verdict.no { border-color:rgba(255,68,85,.35); }
.cg-verdict b { color:var(--y); }
.cg-verdict .btn { margin-top:12px; }
.cg-fit-wrap { max-width:760px; margin:32px auto 0; }

/* Form progress */
.cg-prog { height:4px; border-radius:4px; background:rgba(255,255,255,.08); margin:-4px 0 18px; overflow:hidden; }
.cg-prog i { display:block; height:100%; background:var(--y); border-radius:4px; transition:width .35s ease; }

/* Sticky CTA bar */
.cg-bar { position:fixed; left:0; right:0; bottom:0; z-index:90; padding:10px 16px calc(10px + env(safe-area-inset-bottom));
  background:rgba(8,8,16,.94); backdrop-filter:blur(10px); border-top:1px solid rgba(255,214,0,.18);
  display:flex; align-items:center; justify-content:center; gap:16px; }
.cg-bar span { font-size:12px; color:var(--g2); }
.cg-bar span b { color:var(--w); }
@media (max-width:600px) { .cg-bar span { display:none; } .cg-bar .btn { width:100%; justify-content:center; } }

@keyframes cg-pulse { 0%,100% { transform:rotate(-4deg) scale(1); } 50% { transform:rotate(-4deg) scale(1.06); } }
.cg-shot-tag { animation:cg-pulse 2.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .cg-shot-tag { animation:none; } }

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
  const reduce = useReducedMotion();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | fail
  const [openFaq, setOpenFaq] = useState(null);
  const [fit, setFit] = useState([false, false, false]);
  const [showBar, setShowBar] = useState(false);
  const heroRef = useRef(null);
  const applyRef = useRef(null);

  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("pb-cg-styles")) return;
    const el = document.createElement("style");
    el.id = "pb-cg-styles";
    el.textContent = css;
    document.head.appendChild(el);
  }, []);

  useEffect(() => { trackPixel("ViewContent", { content_name: "chatgpt-ads" }); }, []);

  // Sticky CTA: visible after the hero scrolls away, hidden while the form is on screen
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const seen = { hero: true, apply: false };
    const update = () => setShowBar(!seen.hero && !seen.apply && status !== "done");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.target === heroRef.current) seen.hero = e.isIntersecting; if (e.target === applyRef.current) seen.apply = e.isIntersecting; });
      update();
    }, { threshold: 0.05 });
    if (heroRef.current) obs.observe(heroRef.current);
    if (applyRef.current) obs.observe(applyRef.current);
    return () => obs.disconnect();
  }, [status]);

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
      trackLead(
        { email: form.email, phone: form.phone, name: form.name },
        { content_name: "chatgpt-ads", budget: form.budget, client_value: form.clientValue }
      );
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

  const fitCount = fit.filter(Boolean).length;
  const answered = [form.sells.trim(), form.budget, form.clientValue].filter(Boolean).length;
  const heroItem = (i) => reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 * i, ease: EASE } };

  return (
    <div className="cg">
      {/* 1. Hero */}
      <section className="cg-hero" ref={heroRef}>
        <motion.div className="cg-pre" {...heroItem(0)}>За собственици на бизнес, които се питат дали да рекламират в ChatGPT</motion.div>
        <motion.h1 {...heroItem(1)}>
          ChatGPT показва реклами в България <em>от 1 септември</em>. Разбери дали бизнесът ти е подходящ за реклами там — за 48 часа, безплатно.
        </motion.h1>
        <motion.p className="cg-sub" {...heroItem(2)}>
          Отговаряш на 3 кратки въпроса. Аз преглеждам бизнеса ти и до 2 дни ти пиша лично: <strong>подходящ ли е, или не</strong>. Ако не е — ще ти кажа защо и ще си спестил парите. Ако е — пускаме рекламите с ясна цел, записана преди да платиш.
        </motion.p>
        <motion.div {...heroItem(3)}>
          <button className="btn" onClick={goApply}>Провери дали бизнесът ти е подходящ <ArrowRight size={14} /></button>
          <div className="cg-micro">3 въпроса · 1 минута · <b>отговор до 48 часа</b> · без обаждания и презентации</div>
        </motion.div>

        <motion.figure className="cg-shot" {...(reduce ? {} : { initial: { opacity: 0, y: 40, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.8, delay: 0.45, ease: EASE } })}>
          <img
            src="/chatgpt-ad-example.jpg"
            width="750"
            height="1000"
            alt="ChatGPT отговор със Sponsored реклама под него — пример как изглежда рекламата в ChatGPT"
          />
          <figcaption className="cg-shot-tag"><ArrowLeft size={14} /> ТОВА Е РЕКЛАМАТА</figcaption>
        </motion.figure>
      </section>

      {/* 2. What it is */}
      <section className="sec dk">
        <Reveal>
          <div className="tg">С две думи</div>
          <h2 className="U">Какво са <em>рекламите в ChatGPT</em></h2>
        </Reveal>
        <Reveal className="cg-prose" style={{ marginTop: 24 }} delay={0.05}>
          <p>Човек пише в ChatGPT: <strong>„кой софтуер за фактури е най-добър за малка фирма“</strong>. Получава отговор. А под отговора — малка карта с надпис <em>„Sponsored“</em>. Това е рекламата. Появява се точно когато някой пита за това, което продаваш.</p>
          <p className="cg-big">Звучи страхотно. И за някои бизнеси е. Но има няколко неща, които трябва да знаеш, преди да похарчиш и евро:</p>
        </Reveal>
        <div className="cg-secrets">
          {FACTS.map((s, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <Lift className="cg-secret">
                <span className="ic"><s.icon size={22} /></span>
                <div><h4>{s.t}</h4><p>{s.d}</p></div>
              </Lift>
            </Reveal>
          ))}
        </div>
        <Reveal className="cg-punch" delay={0.1}>
          Затова не казвам „да“ на всеки. Първо проверявам дали има смисъл за теб.
        </Reveal>
      </section>

      {/* 3. For whom — interactive fit check */}
      <section className="sec">
        <Reveal>
          <div className="tg">За кого е и за кого не е</div>
          <h2 className="U">Най-вероятно е подходящо <em>за теб, ако</em>:</h2>
          <p className="sdesc" style={{ marginBottom: 0 }}>Отбележи кое от трите важи за теб — и виж на място дали има смисъл.</p>
        </Reveal>
        <Reveal className="cg-fit-wrap" delay={0.05}>
          {FOR_YOU.map(([b, d], i) => (
            <label key={i} className={`cg-fit ${fit[i] ? "on" : ""}`}>
              <input type="checkbox" checked={fit[i]} onChange={() => setFit(fit.map((v, j) => (j === i ? !v : v)))} />
              <span className="m">{fit[i] && <Check size={16} strokeWidth={3} />}</span>
              <span><b>{b}</b>{d}</span>
            </label>
          ))}
          {/* keyed remount = short enter animation on every verdict change */}
            <motion.div
              key={fitCount === 0 ? "none" : fitCount === 1 ? "one" : "yes"}
              className={`cg-verdict ${fitCount >= 2 ? "yes" : fitCount === 1 ? "no" : ""}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {fitCount === 0 && <>Отбележи какво е вярно за теб. Ако поне две от трите са верни — най-вероятно е за теб.</>}
              {fitCount === 1 && <>Само едно от трите. Най-вероятно не е за теб — но провери, ще ти кажа честно и няма да ти губя времето.</>}
              {fitCount >= 2 && (
                <>
                  <b>Най-вероятно е за теб.</b> Провери безплатно — до 48 часа ти пиша лично дали да пускаме.
                  <div><button className="btn btnSm" onClick={goApply}>Провери за 48 часа <ArrowRight size={12} /></button></div>
                </>
              )}
            </motion.div>
        </Reveal>
        <Reveal className="cg-notfor" delay={0.1}>
          <span className="m"><X size={14} /></span>
          <span><b>Най-вероятно не е за теб</b>, ако продаваш евтини стоки под €30, нямаш работещ сайт или искаш „да пробваш със 100 евро“. Ще ти го кажа честно и няма да ти губя времето.</span>
        </Reveal>
      </section>

      {/* 4. Steps */}
      <section className="sec dk">
        <Reveal>
          <div className="tg">Как става</div>
          <h2 className="U">3 стъпки, <em>без срещи</em>.</h2>
        </Reveal>
        <div className="wp-grid" style={{ marginTop: 36 }}>
          {STEPS.map((p, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <Lift className="wp-card">
                <div className="wp-head">
                  <div className="wp-ico"><p.icon size={26} /></div>
                  <div className="wp-step">{p.step}</div>
                </div>
                <h3 className="U">{p.title}</h3>
                <p>{p.desc}</p>
              </Lift>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Pricing */}
      <section className="sec yellow">
        <Reveal>
          <div className="tg">Колко струва</div>
          <h2 className="U">Без първоначална <em>такса</em>.</h2>
        </Reveal>
        <div className="cg-price">
          <Reveal delay={0.05}>
            <div className="cg-price-main">
              <motion.div className="big" {...(reduce ? {} : { initial: { scale: 0.85, opacity: 0 }, whileInView: { scale: 1, opacity: 1 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.2, ease: EASE } })}>€350<small>на месец</small></motion.div>
              <div className="sub">Без първоначална такса. Вътре е всичко:</div>
              <ul>
                {INCLUDED.map((t, i) => <li key={i}><Check size={15} /> <span>{t}</span></li>)}
              </ul>
            </div>
          </Reveal>
          <div className="cg-price-side">
            <Reveal delay={0.15} style={{ flex: 1, display: "flex" }}>
              <div className="cg-price-box">
                <h4>Рекламен бюджет — отделно</h4>
                Минимум <b>€500 на месец</b>, плащаш го директно на платформата, не на мен. Минимален ангажимент <b>2 месеца</b>, защото за по-малко не се научава нищо.
              </div>
            </Reveal>
            <Reveal delay={0.25} style={{ flex: 1, display: "flex" }}>
              <div className="cg-price-box">
                <h4>За сравнение</h4>
                В САЩ първите рекламодатели плащаха около <b>$200 000</b>, за да влязат. Тук влизаш с <b>€850</b> за първия месец.
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. Who am I */}
      <section className="sec">
        <Reveal>
          <div className="tg">Кой съм аз</div>
          <h2 className="U">Предпочитам да ти кажа <em>„не“ в началото</em>.</h2>
        </Reveal>
        <Reveal className="cg-founder" style={{ marginTop: 36 }} delay={0.1}>
          <img src="/viktor.jpg" alt="Виктор Стоименов" loading="lazy" />
          <div>
            <div className="nm">Виктор Стоименов</div>
            <span className="rl">Founder, PROFITBRAND</span>
            <p>Правя реклами в интернет от 2024 г. — за мои продукти и за клиенти. Кампании в <strong>9 европейски държави</strong>, бюджети от €3 000 до над €10 000 на месец, бизнес, който помогнах да стигне <strong>седемцифрен оборот</strong>.</p>
            <p>Виждал съм много канали, които не връщат парите. Затова предпочитам да ти кажа „не“ в началото, отколкото ти да го разбереш след месец и €1 000.</p>
            <p>Рекламите в ChatGPT следя от февруари, когато тръгнаха в САЩ. Имам достъп до тях за България през партньор. <strong>Първите кампании тук ще ги направим заедно.</strong></p>
            <div className="cg-creds">
              <span>Google AI Leader сертификат</span>
              <span>9 европейски държави</span>
              <span>Достъп до ChatGPT Ads за България</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7. Guarantee */}
      <section className="sec dk">
        <Reveal>
          <div className="tg">Гаранция</div>
          <h2 className="U">Обещавам числото, <em>което зависи от мен</em>.</h2>
        </Reveal>
        <Reveal className="guar" style={{ marginTop: 32 }} delay={0.1}>
          <h3 className="U">Една цел, <em>записана преди да платиш</em></h3>
          <ul>
            <li><span className="gc"><Check size={14} /></span>Преди да платиш, записваме една цел: колко да струва клик или запитване за твоя бизнес. На 30-ия ден я сравняваме с реалността.</li>
            <li><span className="gc"><Check size={14} /></span>Ако не сме я стигнали, вторият месец е без такса за управление. Плащаш само рекламния бюджет и решаваш дали продължаваме.</li>
            <li><span className="gc"><Check size={14} /></span>Не обещавам продажби — каналът е нов и който ти обещава продажби, гадае. Обещавам числото, което зависи от мен.</li>
          </ul>
        </Reveal>
      </section>

      {/* 8. Apply */}
      <section className="sec" id="apply" ref={applyRef}>
        <Reveal>
          <div className="tg">Провери дали бизнесът ти е подходящ</div>
          <h2 className="U">3 въпроса, <em>1 минута</em>.</h2>
          <p className="sdesc">До 48 часа ти пиша лично.</p>
        </Reveal>
        <Reveal className="cg-form" delay={0.1}>
          {status === "done" ? (
            <motion.div className="cg-done" {...(reduce ? {} : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.4, ease: EASE } })}>
              <div className="ic"><Mail size={28} /></div>
              <h3 className="U">Заявката е получена.</h3>
              <p>Преглеждам бизнеса ти и до 48 часа ти пиша лично: подходящ е, не е, или не още — и защо.</p>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="cg-form-q">Трите въпроса · {answered}/3</div>
              <div className="cg-prog" aria-hidden="true"><i style={{ width: `${(answered / 3) * 100}%` }} /></div>
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
              <div className="cg-form-q second">Къде да ти пиша</div>
              {field("name", "Име", <input id="cg-name" value={form.name} onChange={set("name")} placeholder="Твоето име" autoComplete="name" />)}
              {field("email", "Имейл", <input id="cg-email" type="email" value={form.email} onChange={set("email")} placeholder="email@firma.bg" autoComplete="email" />)}
              {field("phone", "Телефон", <input id="cg-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="0888 123 456" autoComplete="tel" />)}
              {field("website", "Сайт", <input id="cg-website" value={form.website} onChange={set("website")} placeholder="https://..." autoComplete="url" />)}
              <button className="btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Изпращаме…" : <>Прати и ще ти пиша до 48 часа <ArrowRight size={14} /></>}
              </button>
              {status === "fail" && (
                <div className="cg-fail">Нещо се обърка и заявката не стигна до мен. Опитай пак след минута или ми пиши директно — ще отговоря.</div>
              )}
              <div className="cg-form-note">
                Без обаждания и презентации. Отговарям писмено, лично, до 48 часа.
              </div>
            </form>
          )}
        </Reveal>
      </section>

      {/* 9. FAQ */}
      <section className="sec dk">
        <Reveal>
          <div className="tg">Често задавани въпроси</div>
          <h2 className="U">Знаем какво <em>си мислиш</em>.</h2>
        </Reveal>
        <Reveal className="faq" style={{ marginTop: 32 }} delay={0.1}>
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
        </Reveal>
      </section>

      {/* 10. Final */}
      <section className="cta sec">
        <Reveal>
          <h2 className="cg-final-h U">Най-много <em>5 нови клиента</em> на месец.</h2>
          <p className="cg-final-p">За да мога да им обърна внимание. Ако бизнесът ти е подходящ — ще ти кажа до 48 часа. Ако не е — също.</p>
          <button className="btn" onClick={goApply}>Провери дали бизнесът ти е подходящ <ArrowRight size={14} /></button>
          <p style={{ marginTop: 22, fontSize: 12 }}>
            <a href="/" onClick={(e) => { e.preventDefault(); nav("home"); }} style={{ color: "var(--g)", textDecoration: "none" }}>
              <AlertTriangle size={12} style={{ verticalAlign: -2, marginRight: 4 }} /> Обратно към PROFITBRAND
            </a>
          </p>
        </Reveal>
      </section>

      {/* Sticky CTA bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div className="cg-bar" initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ duration: 0.3, ease: EASE }}>
            <span><b>Подходящ ли е бизнесът ти?</b> 3 въпроса · отговор до 48 часа</span>
            <button className="btn btnSm" onClick={goApply}>Провери безплатно <ArrowRight size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
