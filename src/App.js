import { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart3, Palette, Star, Target, GraduationCap, Video, Mic,
  DollarSign, Mail, Bot, Globe, Settings, Search, Wrench, Rocket,
  Check, Plus, X, ChevronDown, Menu, Eye, GripVertical, Handshake,
  TrendingUp, AlertCircle, Shield, Sparkles, ArrowRight,
  PhoneCall, FileText, Zap, Quote, Award, Headphones,
} from "lucide-react";
import { HeroGeometric } from "./components/ui/shape-landing-hero";
import ChatGptAds from "./pages/ChatGptAds";
import { pageFromPath, pathForPage, isCreditPage } from "./lib/routing";
import CreditApp from "./pages/credit/CreditApp";
import { trackPixel } from "./lib/meta";
import { trackPageView } from "./lib/analytics";
import { adminLogin, fetchAdminStats } from "./lib/admin";
import AdminStats from "./components/AdminStats";

/* ---------- Helpers ---------- */

function Counter({ end, suffix = "", duration = 2200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const s = performance.now();
          const step = (n) => {
            const p = Math.min((n - s) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(
              Number.isInteger(end)
                ? Math.round(ease * end)
                : parseFloat((ease * end).toFixed(1))
            );
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ---------- Default data ---------- */

const defaultServices = [
  { id: 1, icon: "Target", title: "РЕКЛАМИ В META И INSTAGRAM", desc: "Стигаме до хората, които ще купят — на най-ниската цена. Тестваме визии и текстове и връщаме посетителите, които не са купили.", active: true },
  { id: 6, icon: "Sparkles", title: "РЕКЛАМИ В CHATGPT", desc: "Реклами под отговорите на ChatGPT — в България от 1 септември. Безплатна проверка до 24 часа дали има смисъл за твоя бизнес.", active: true, href: "/chatgpt-ads" },
  { id: 2, icon: "Bot", title: "AI ИМЕЙЛИ И ПОВТОРНИ ПОКУПКИ", desc: "Автоматични имейли за изоставена количка, след покупка и за стари клиенти. Правилното съобщение в правилния момент.", active: true },
  { id: 3, icon: "TrendingUp", title: "ПОВЕЧЕ ПРОДАЖБИ ОТ СЪЩИЯ ТРАФИК", desc: "Подобряваме страниците и офертите, за да купуват повече хора — и за повече. Преди да вдигаме бюджета.", active: true },
  { id: 4, icon: "Headphones", title: "AI ОБСЛУЖВАНЕ 24/7", desc: "AI агент отговаря на клиентите веднага — преди и след покупка. Без изпуснати продажби, без чакане.", active: true },
  { id: 5, icon: "Award", title: "🔒 ЗАКРИТ WORKSHOP", desc: "Само за клиенти. Рекламните формули, AI инструкциите и имейл поредиците, които вдигат средната поръчка с 30–40%. Не ги споделяме публично.", active: true },
];

const ICONS = {
  BarChart3, Palette, Star, Target, GraduationCap, Video, Mic,
  DollarSign, Mail, Bot, Globe, Settings, Search, Wrench, Rocket,
  Handshake, TrendingUp, AlertCircle, Shield, Sparkles,
  PhoneCall, FileText, Zap, Award, Headphones,
};

function SvcIcon({ name, size = 28 }) {
  const Ico = ICONS[name] || Sparkles;
  return <Ico size={size} strokeWidth={2} />;
}

const defaultClients = [];

const defaultTeam = [
  { id: 1, name: "Виктор Стоименов", role: "CEO & Founder", bio: "Performance Marketing & AI Strategy. Управляваме собствен бизнес + бизнеси на клиенти в 7 държави в Европа. Сертифициран от Google за AI Leadership. Управлявали сме рекламни бюджети, генерирали над 2 000 000 € оборот за 12 месеца. Не теоретизираме — всичко, което препоръчваме, сме тествали с реални пари и реални бизнеси.", photo: "/viktor.jpg" },
];

const defaultCases = [
  {
    id: 1,
    client: "ОНЛАЙН МАГАЗИН — ОТ ROAS 1.2 ДО 4.7x ЗА 60 ДНИ",
    problem: "8\u00A0000\u00A0€ на месец за реклама, а всяко евро връщаше едва 1.20 €. Без автоматични имейли, без реклами към посетителите, без тестове на визиите.",
    result: "Пренаредихме кампаниите, тествахме нови визии, пуснахме автоматични имейли и реклами към посетителите на 3 нива. За 60 дни — 4.7x ROAS при същия бюджет и същия продукт. Над 2\u00A0000\u00A0000\u00A0€ оборот за 12 месеца.",
    metric: "4.7x ROAS",
    time: "60 дни",
  },
];

const painPoints = [
  { icon: "DollarSign", title: "Харчиш за реклами, а продажбите стоят", desc: "Бюджетът расте, оборотът — не. И никой не ти казва ясно защо." },
  { icon: "AlertCircle", title: "Не знаеш колко ти струва един клиент", desc: "Агенцията праща отчети с харесвания и кликове. Не с печалба." },
  { icon: "Mail", title: "Клиентите купуват веднъж и изчезват", desc: "Няма имейли, няма напомняния, няма причина да се върнат." },
  { icon: "Settings", title: "Всичко е на парче", desc: "Реклами тук, сайт там, имейли никъде. Нищо не работи заедно." },
];

const journeySteps = [
  { step: 0, title: "ТИ СИ ТУК", desc: "Искаш да скалираш." },
  { step: 1, title: "РАЗГОВОР И АНАЛИЗ", desc: "Изясняваме целите и гледаме къде си сега." },
  { step: 2, title: "PROFITBRAND BLUEPRINT", desc: "Стратегия от 40+ страници за целия ти маркетинг." },
  { step: 3, title: "ПРЕДЛОЖЕНИЕ", desc: "Обхват, цена и условия — черно на бяло." },
  { step: 4, title: "ПОДГОТОВКА", desc: "Достъпи, канали за връзка, ред за одобрение." },
  { step: 5, title: "СТАРТ", desc: "Твоят бизнес е наш бизнес. Растем заедно." },
];

const systemSteps = [
  {
    icon: "Search",
    letter: "А",
    title: "Анализ",
    desc: "Преглеждаме бизнеса отвътре: колко струва един клиент, колко ти носи и къде губиш пари.",
    tags: ["Цена на клиент", "Печалба по продукти", "Конкуренция"],
    details: [
      "Колко струва и колко носи един клиент",
      "Къде посетителите се отказват — от рекламата до плащането",
      "Как стоиш спрямо конкуренцията",
      "Защо клиентите купуват повторно (или не)",
    ],
  },
  {
    icon: "Wrench",
    letter: "И",
    title: "Изграждане",
    desc: "Пускаме реклами, имейли, страници и визии — цялата машина, настроена за твоя бранд.",
    tags: ["Реклами в Meta", "AI имейли", "Страници, които продават"],
    details: [
      "Структура на кампаниите, аудитории и визии",
      "Имейли за изоставена количка, след покупка и за стари клиенти",
      "Страници за продукти и оферти, които продават",
      "Реклами към посетителите на сайта на 3 нива",
    ],
  },
  {
    icon: "Rocket",
    letter: "Р",
    title: "Растеж",
    desc: "Следим числата всяка седмица. Наливаме бюджет в това, което работи, и добавяме нови приходи.",
    tags: ["Седмични корекции", "По-голяма поръчка", "Нови приходи"],
    details: [
      "Корекции всяка седмица според данните",
      "Пакети и допълнителни продукти за по-голяма поръчка",
      "Абонаменти, VIP и програми за лоялност",
      "Повече бюджет там, където носи",
    ],
  },
];

const faqs = [
  { q: "Кога ще видя резултати?", a: "Първите подобрения идват обикновено до 2–4 седмици. Цялата система е напълно настроена за 60–90 дни." },
  { q: "Вече работя с агенция. Защо да сменям?", a: "Ако не ти показват ясно колко струва един клиент и колко носи — имаш проблем. Правим безплатен преглед и сам виждаш къде са пропуските." },
  { q: "Как се плаща?", a: "Месечна такса + бонус, само ако постигнем целите. Без дългосрочен договор. Детайлите — на разговора." },
  { q: "С какво сте различни?", a: "Повечето агенции спират до клика. Ние работим до повторната покупка — реклами, страници, имейли и AI в една система." },
  { q: "За какъв бизнес е подходящо?", a: "За бизнеси, които вече продават и могат да вложат поне 3\u00A0000–5\u00A0000\u00A0€ на месец в реклама. Ако още нямаш продажби — рано е." },
  { q: "Работите ли извън България?", a: "Да. Основно с бизнеси в България и Европа. За други пазари говорим индивидуално." },
];

const timeline = [
  { icon: "PhoneCall", when: "До 24 часа", title: "Свързваме се с теб", desc: "Уговаряме кратък разговор в удобно за теб време." },
  { icon: "Search", when: "30 минути", title: "Разглеждаме бизнеса ти", desc: "Какво работи, къде губиш пари и къде е най-големият потенциал. Безплатно." },
  { icon: "FileText", when: "След разговора", title: "Получаваш план", desc: "Кои канали — Google, Meta, TikTok, ChatGPT — с какъв бюджет и с какви цели за 90 дни." },
  { icon: "Rocket", when: "Старт", title: "Пускаме системата", desc: "Реклами, имейли и AI автоматизации — свързани и проследими от първия ден." },
  { icon: "TrendingUp", when: "Всяка седмица", title: "Растем", desc: "Отчет с ясни числа и корекции по данни. Среща на всеки 2 седмици." },
];

const founderCredentials = [
  "Работим в 7 държави в Европа — със собствен бизнес и с клиенти. Продаваме всеки ден, на реални пазари.",
  "Сертифициран от Google за AI Leadership.",
  "Над 2\u00A0000\u00A0000\u00A0€ оборот за клиент за 12 месеца. ROAS от 1.2 до 4.7x за 60 дни — без по-голям бюджет.",
  "Десетки хиляди евро рекламен бюджет, тествани със собствени пари. Знаем как се обръща кампания, която не върви.",
  "Всички резултати са от реални клиенти и реални рекламни акаунти. Можеш да ги видиш сам.",
];

const defaultTestimonials = [
  { id: 1, name: "Даниела К.", role: "E-commerce, мода", quote: "PROFITBRAND не пускат просто реклами. Влязоха в бизнеса ни — погледнаха margins, retention, цялата фуния. За 60 дни ROAS-ът ни се вдигна 4 пъти. Това не е магия — това е работа на хора, които знаят какво правят." },
  { id: 2, name: "minimart", role: "E-commerce", quote: "Преди работехме на парче — една кампания тук, един пост там. PROFITBRAND ни подредиха цялата система: реклами, retargeting, автоматизирани имейли. Сега знаем точно колко ни струва един клиент и колко ни носи." },
  { id: 3, name: "Saint Charles Apothecary", role: "Premium бранд", quote: "Търсехме партньор, който разбира как се позиционира premium бранд онлайн, без да смъква стойността му с агресивни промоции. Кампаниите са прецизни, комуникацията — на ниво, а отчетите — с реални числа, не с общи приказки." },
  { id: 4, name: "Захарни Заводи", role: "Производство / FMCG", quote: "Впечатли ни колко бързо разбраха спецификата на нашия пазар. Ясен процес, седмични отчети и коректност във всяко едно нещо, за което сме се разбрали." },
  { id: 5, name: "ПК Инвиктус", role: "Спортен клуб", quote: "Кампаниите за записване на нови деца дадоха резултат още в първите седмици — а автоматизираните отговори ни спестиха часове писане всеки ден. Препоръчваме ги на всеки, който иска реални клиенти, а не просто харесвания." },
  { id: 6, name: "Kavo Kerreu", role: "Дентална клиника", quote: "Графикът ни се пълни с нови пациенти от кампаниите, а AI асистентът отговаря на запитвания и записва часове дори когато клиниката е затворена. Преди изпускахме обаждания всеки ден — сега нито едно запитване не остава без отговор." },
  { id: 7, name: "Кирил Иванов", role: "Собственик, онлайн магазин", quote: "Бях харчил хиляди по други агенции без резултат. С PROFITBRAND за първи път виждам точно къде отива всеки лев от бюджета и какво връща обратно. Вече не гадая — просто гледам числата." },
  { id: 8, name: "Мария Георгиева", role: "Основател, козметичен бранд", quote: "Най-ценното е, че мислят като партньори, а не като изпълнители. Сами предложиха промени в оферта и сайт, които вдигнаха конверсията, преди изобщо да сме говорили за повече рекламен бюджет." },
  { id: 9, name: "Стефан Димитров", role: "Управител, търговска фирма", quote: "Отговарят бързо, казват нещата директно и не обещават чудеса. За три месеца запитванията ни се удвоиха, а благодарение на автоматизациите не наехме нито един допълнителен човек." },
  { id: 10, name: "Елена Петрова", role: "Собственик, детски стоки", quote: "Притеснявах се, че сме твърде малки за агенция. Оказа се обратното — получихме система, която работи и с нашия бюджет, и ясен план как да растем стъпка по стъпка. Препоръчвам ги без колебание." },
];

/* Bump when default copy (services/credentials/testimonials) changes,
   so visitors with older localStorage get the fresh content. */
const DATA_VERSION = 13;

/* ---------- App ---------- */

export default function App() {
  const [page, setPage] = useState(() =>
    typeof window !== "undefined" ? pageFromPath(window.location.pathname) : "home"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminTab, setAdminTab] = useState("stats");
  const [loginErr, setLoginErr] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsDays, setStatsDays] = useState(30);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsErr, setStatsErr] = useState("");
  const [clients, setClients] = useState(defaultClients);
  const [team, setTeam] = useState(defaultTeam);
  const [services, setServices] = useState(defaultServices);
  const [cases, setCases] = useState(defaultCases);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [nm, setNm] = useState({ name: "", role: "", bio: "", photo: "" });
  const [credentials, setCredentials] = useState(founderCredentials);
  const [newCred, setNewCred] = useState("");
  const [ns, setNs] = useState({ icon: "Sparkles", title: "", desc: "" });
  const [ncase, setNcase] = useState({ client: "", problem: "", result: "", metric: "", time: "" });
  const [nt, setNt] = useState({ name: "", role: "", quote: "" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", msg: "" });
  const [audit, setAudit] = useState({ name: "", email: "", web: "" });
  const [showAudit, setShowAudit] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [openSys, setOpenSys] = useState(null);
  const [dragId, setDragId] = useState(null);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem("pb5"));
      if (d) {
        if (d.t) setTeam(d.t);
        if (d.cs) setCases(d.cs);
        // Copy content (clients/services/credentials/testimonials) rolls out
        // fresh on version bump; stored overrides load only for the same version.
        if (d.v === DATA_VERSION) {
          if (d.c) setClients(d.c);
          if (d.s) setServices(d.s);
          if (d.tm) setTestimonials(d.tm);
          if (d.cr) setCredentials(d.cr);
        }
      }
    } catch {}
  }, []);

  const save = useCallback((c, t, s, cs, tm, cr) => {
    try { localStorage.setItem("pb5", JSON.stringify({ v: DATA_VERSION, c, t, s, cs, tm, cr })); } catch {}
  }, []);

  // Scroll-reveal. No flash: only elements still below the fold get hidden,
  // and only after mount. Containers with data-stagger reveal their children
  // one after another. Reduced-motion users and old browsers see everything at once.
  useEffect(() => {
    if (page !== "home" || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups = [];
    const finish = (el) => {
      el.setAttribute("data-rv", "done");
      el.style.transitionDelay = "";
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          el.setAttribute("data-rv", "in");
          const delay = parseFloat(el.style.transitionDelay) || 0;
          const t = setTimeout(() => finish(el), (delay + 1) * 1000);
          cleanups.push(() => clearTimeout(t));
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const vh = window.innerHeight;
    document.querySelectorAll("[data-v]").forEach((el) => {
      const base = parseFloat(el.getAttribute("data-d")) || 0;
      const items = el.hasAttribute("data-stagger")
        ? Array.from(el.children).map((c, i) => [c, Math.min(i, 8) * 0.08])
        : [[el, base]];
      items.forEach(([item, d]) => {
        if (item.hasAttribute("data-rv")) return;
        if (item.getBoundingClientRect().top < vh) return; // already on screen: leave visible
        item.setAttribute("data-rv", "out");
        item.style.transitionDelay = `${d}s`;
        item.style.setProperty("--rvd", `${d}s`);
        io.observe(item);
      });
    });

    return () => {
      io.disconnect();
      cleanups.forEach((fn) => fn());
      document.querySelectorAll('[data-rv="out"],[data-rv="in"]').forEach(finish);
    };
  }, [page]);

  // Inject CSS into <head> exactly once — never re-renders, no paint flash
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("pb-app-styles")) return;
    const el = document.createElement("style");
    el.id = "pb-app-styles";
    el.textContent = css;
    document.head.appendChild(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nav = (p) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo?.(0, 0);
    const path = pathForPage(p);
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
  };

  // Meta Pixel PageView on SPA navigation (the first PageView comes from index.html)
  const firstPageView = useRef(true);
  useEffect(() => {
    if (firstPageView.current) { firstPageView.current = false; return; }
    if (isCreditPage(page)) return;
    trackPixel("PageView");
  }, [page]);

  // First-party page views -> Supabase (shown in /admin -> Статистика)
  useEffect(() => { if (page !== "admin" && !isCreditPage(page)) trackPageView(); }, [page]);

  const loadStats = useCallback(async (pass, days) => {
    setStatsLoading(true); setStatsErr("");
    try { setStats(await fetchAdminStats(pass, days)); }
    catch (e) { setStatsErr(e.message || "грешка"); }
    finally { setStatsLoading(false); }
  }, []);

  const tryLogin = async () => {
    if (!adminPass || loginBusy) return;
    setLoginBusy(true); setLoginErr("");
    const ok = await adminLogin(adminPass);
    setLoginBusy(false);
    if (!ok) { setLoginErr("Грешна парола."); return; }
    setIsAdmin(true);
    loadStats(adminPass, statsDays);
  };

  // Sync page with browser back/forward
  useEffect(() => {
    const onPop = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const scrollTo = (id) => {
    setMenuOpen(false);
    const go = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (page !== "home") { nav("home"); setTimeout(go, 60); } else go();
  };
  // ff() — marks an element for scroll-reveal (see effect above).
  // d = delay in seconds; stagger = reveal the element's children one by one.
  const ff = (id, d = 0, stagger = false) => ({
    "data-v": id,
    "data-d": d,
    ...(stagger ? { "data-stagger": "" } : {}),
  });
  const activeServices = services.filter((s) => s.active);

  /* drag-drop reordering for admin lists */
  const onDragStart = (id) => setDragId(id);
  const reorder = (list, fromId, toId) => {
    const from = list.findIndex((x) => x.id === fromId);
    const to = list.findIndex((x) => x.id === toId);
    if (from < 0 || to < 0 || from === to) return list;
    const copy = [...list];
    const [m] = copy.splice(from, 1);
    copy.splice(to, 0, m);
    return copy;
  };

  const css = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --y:#FFD600; --y2:#FFC107;
  --b:#080810; --b2:#0D0D18; --b3:#13131F;
  --w:#FFFFFF; --g:#707088; --g2:#9999B0;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
button, a, [role="button"] { touch-action:manipulation; }
html { scroll-behavior:smooth; -webkit-font-smoothing:antialiased; scroll-padding-top:72px; }
body { background:var(--b); overflow-x:hidden; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior:auto; }
  *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; }
}

button, a, [role="button"], input[type="submit"] { cursor:pointer; }
button:disabled { cursor:not-allowed; }

button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
  outline:2px solid var(--y); outline-offset:2px; border-radius:4px;
}

.Z { font-family:'Outfit',sans-serif; color:var(--w); background:var(--b); min-height:100vh; overflow-x:hidden; }
.U { font-family:'Unbounded',sans-serif; }

@keyframes pulse-y { 0%,100%{box-shadow:0 0 0 0 rgba(255,214,0,.35)} 50%{box-shadow:0 0 0 14px rgba(255,214,0,0)} }
@keyframes blink { 50%{opacity:0} }

.tw-caret { display:inline-block; margin-left:2px; color:var(--y); animation:blink 1s step-end infinite; }

/* SCROLL REVEAL — attributes are set by JS only for elements below the fold */
.Z [data-rv="out"] { opacity:0; transform:translateY(28px); }
.Z [data-rv="in"] { opacity:1; transform:none;
  transition:opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
.jrn-svg polyline { stroke-dasharray:1; stroke-dashoffset:0; }
.jrn-wrap[data-rv="out"] .jrn-svg polyline { stroke-dashoffset:1; }
.jrn-wrap:not([data-rv="out"]) .jrn-svg polyline { transition:stroke-dashoffset 1.6s cubic-bezier(.65,0,.35,1) .25s; }
.SI[data-rv="in"] .SIi { animation:pop-in .6s cubic-bezier(.34,1.56,.64,1) both; animation-delay:calc(var(--rvd, 0s) + .15s); }
@keyframes pop-in { from { transform:scale(.6); opacity:0; } to { transform:none; opacity:1; } }

/* MARQUEE */
.mq { overflow:hidden; background:var(--b2); border-top:1px solid rgba(255,214,0,.12);
  border-bottom:1px solid rgba(255,214,0,.12); padding:16px 0;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent); }
.mq-track { display:flex; width:max-content; animation:mq 36s linear infinite; }
.mq:hover .mq-track { animation-play-state:paused; }
.mq-set { display:flex; }
.mq-set span { font-family:'Unbounded'; font-size:13px; font-weight:700; letter-spacing:1.5px;
  text-transform:uppercase; color:var(--w); white-space:nowrap; display:inline-flex; align-items:center; }
.mq-set span::after { content:'✦'; color:var(--y); margin:0 28px; font-size:12px; }
@keyframes mq { to { transform:translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .mq-track { animation:none !important; } }

/* PAIN */
.pain-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; max-width:1100px; margin:0 auto; }
.pain-card { background:var(--b2); border:1px solid rgba(255,107,120,.16); border-radius:16px;
  padding:26px 22px; text-align:left; transition:border-color .25s ease, transform .25s ease; }
.pain-card:hover { border-color:rgba(255,214,0,.4); transform:translateY(-3px); }
.pain-ic { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center;
  background:rgba(255,107,120,.1); color:#FF6B78; margin-bottom:16px; }
.pain-card h4 { font-family:'Unbounded'; font-size:14px; font-weight:700; line-height:1.4; margin-bottom:8px; color:var(--w); }
.pain-card p { font-size:13px; color:var(--g2); line-height:1.6; }
.pain-out { text-align:center; margin:40px auto 0; max-width:640px; font-size:clamp(17px,2.2vw,22px);
  font-weight:700; line-height:1.4; color:var(--w); }
.pain-out em { font-style:normal; color:var(--y); }

/* CTA BAND */
.cta-band { background:linear-gradient(135deg,#FFD600,#FFC107); color:var(--b); padding:56px 24px; text-align:center; }
.cta-band h3 { font-family:'Unbounded'; font-size:clamp(22px,3.2vw,34px); font-weight:800; letter-spacing:-.5px; margin-bottom:10px; }
.cta-band p { font-size:15px; line-height:1.6; color:rgba(8,8,16,.75); max-width:520px; margin:0 auto 24px; }
.btn.btn-dk { background:var(--b); color:var(--y); box-shadow:0 10px 30px rgba(8,8,16,.25); }
.btn.btn-dk:hover { box-shadow:0 14px 34px rgba(8,8,16,.35); }

/* NAV */
.N {
  position:fixed; top:0; left:0; right:0; z-index:100;
  padding:14px 48px; display:flex; align-items:center; justify-content:space-between;
  background:rgba(8,8,16,.96);
  border-bottom:1px solid rgba(255,214,0,.05);
}
.NL { font-family:'Unbounded'; font-weight:900; font-size:18px; cursor:pointer;
  background:linear-gradient(135deg,var(--w),var(--y));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.NR { display:flex; gap:24px; align-items:center; }
.NR a {
  color:var(--g2); text-decoration:none; font-size:12px; font-weight:600;
  letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:color .2s ease;
  background:none; border:none; font-family:inherit; padding:4px 0;
}
.NR a:hover { color:var(--y); }
.mob { display:none; background:none; border:none; color:var(--y); cursor:pointer; padding:6px; }
.mm { display:none; position:fixed; inset:0; background:rgba(8,8,16,.97); z-index:99;
  flex-direction:column; align-items:center; justify-content:center; gap:28px; }
.mm.o { display:flex; }
.mm a { font-family:'Unbounded'; font-size:20px; font-weight:700; color:var(--w);
  text-decoration:none; cursor:pointer; background:none; border:none; transition:color .2s ease; }
.mm a:hover { color:var(--y); }

/* BUTTONS */
.btn {
  background:var(--y); color:var(--b); border:none;
  padding:13px 28px; font-family:'Unbounded'; font-weight:700; font-size:11px;
  letter-spacing:1px; text-transform:uppercase; cursor:pointer; border-radius:8px;
  transition:transform .2s ease, box-shadow .25s ease; white-space:nowrap;
  display:inline-flex; align-items:center; gap:8px;
}
.btn:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(255,214,0,.32); }
.btn:active { transform:translateY(0); }
.btn2 { background:transparent; border:2px solid var(--y); color:var(--y); padding:11px 26px;
  font-family:'Unbounded'; font-weight:700; font-size:11px; letter-spacing:1px;
  text-transform:uppercase; cursor:pointer; border-radius:8px; transition:all .25s ease; white-space:nowrap;
  display:inline-flex; align-items:center; gap:8px; }
.btn2:hover { background:var(--y); color:var(--b); }
.btnSm { padding:9px 18px; font-size:10px; border-radius:6px; }
.btnD { background:#FF4455; color:#fff; border:none; padding:6px 10px;
  font-family:'Outfit'; font-weight:600; font-size:11px; cursor:pointer; border-radius:6px;
  display:inline-flex; align-items:center; transition:background .2s ease; }
.btnD:hover { background:#ff5e6e; }

/* Trust strip — static client logos */
.trust { padding:36px 32px 40px; background:var(--b2);
  border-top:1px solid rgba(255,214,0,.06); border-bottom:1px solid rgba(255,214,0,.06); }
.trust-lbl { text-align:center; font-size:10px; letter-spacing:3px; text-transform:uppercase;
  color:var(--g); font-weight:700; margin-bottom:18px; font-family:'Unbounded'; }
.trust-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px;
  max-width:1100px; margin:0 auto; }
.cl-logo { height:72px; display:flex; align-items:center; justify-content:center;
  background:#FFFFFF; border:1px solid rgba(255,255,255,.08); border-radius:10px;
  padding:10px 16px; font-family:'Unbounded'; font-size:11px; font-weight:600;
  color:#3a3a4a; transition:border-color .25s ease, transform .25s ease;
  text-align:center; line-height:1.2; overflow:hidden; }
.cl-logo:hover { border-color:rgba(255,214,0,.45); transform:translateY(-2px); }
.cl-logo.dark { background:#0D0D18; border-color:rgba(255,255,255,.12); color:var(--g2); }
.cl-logo img { max-width:100%; max-height:48px; object-fit:contain; display:block; }
@media (max-width:900px) { .trust-grid { grid-template-columns:repeat(3,1fr); } }
@media (max-width:480px) { .trust-grid { grid-template-columns:repeat(2,1fr); } .trust { padding:28px 16px; } }

/* Section */
.sec { padding:88px 48px; position:relative; scroll-margin-top:72px; contain:layout paint; isolation:isolate; }
.sec.dk { background:var(--b2); }
.sec.dk2 { background:var(--b3); }
.sec.yellow { background:var(--y); color:var(--b); }
.tg { color:var(--y); font-size:11px; font-weight:700; letter-spacing:3px;
  text-transform:uppercase; margin-bottom:12px; display:block; text-align:center; }
.sec.yellow .tg { color:var(--b); }
.sec h2 { font-family:'Unbounded'; font-size:clamp(24px,3.6vw,42px); font-weight:800;
  margin-bottom:14px; letter-spacing:-1px; line-height:1.1; text-align:center; }
.sec h2 em { font-style:normal; color:var(--y); }
.sec.yellow h2 em { color:var(--y); background:#080810; padding:0 10px; border-radius:6px; }
.sdesc { font-size:15px; line-height:1.7; color:var(--g2); max-width:600px; margin:0 auto 40px; text-align:center; }
.sec.yellow .sdesc { color:rgba(8,8,16,.75); }

/* STATS */
.ST { display:grid; grid-template-columns:repeat(3,1fr); gap:28px;
  padding:60px 48px; background:var(--b2);
  border-top:1px solid rgba(255,214,0,.06); border-bottom:1px solid rgba(255,214,0,.06); }
.SI { text-align:center; }
.SIi { display:flex; justify-content:center; margin-bottom:10px; color:var(--y); }
.SIs { color:var(--g); font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
.SIn { font-family:'Unbounded'; font-size:clamp(28px,4vw,46px); font-weight:900; color:var(--y); }
.SIl { font-size:12px; color:var(--g2); margin-top:3px; }

/* SERVICES — yellow bg, white cards, black circles, yellow icons */
.svc-grid {
  display:grid; grid-template-columns:repeat(3,1fr);
  gap:24px; max-width:1180px; margin:0 auto;
}
.svc {
  background:#FFFFFF; color:var(--b);
  border-radius:14px; padding:28px 18px 22px;
  text-align:center;
  transition:transform .25s ease, box-shadow .25s ease;
  display:flex; flex-direction:column; align-items:center; gap:14px;
  min-height:200px; cursor:default;
  box-shadow:0 2px 0 rgba(8,8,16,.08);
}
.svc:hover { transform:translateY(-4px); box-shadow:0 18px 40px -10px rgba(8,8,16,.35); }
.svc .ic {
  width:66px; height:66px; border-radius:50%;
  background:var(--b); color:var(--y);
  display:flex; align-items:center; justify-content:center;
  transition:transform .25s ease;
}
.svc:hover .ic { transform:scale(1.08); }
.svc h4 {
  font-family:'Unbounded'; font-size:11px; font-weight:800;
  letter-spacing:.3px; line-height:1.3; color:var(--b);
}
.svc p { font-size:13px; color:#3a3a4a; line-height:1.6; padding:0 4px; }
.svc-link { text-decoration:none; cursor:pointer; }
.svc-more { margin-top:auto; font-family:'Unbounded'; font-size:10px; font-weight:800;
  color:var(--b); display:inline-flex; align-items:center; gap:4px; letter-spacing:.5px; }
.NR a.nav-hot { color:var(--y); }

/* JOURNEY — stair-step */
.jrn-wrap {
  position:relative; max-width:1200px; margin:60px auto 0;
  padding:40px 20px 20px;
  min-height:520px;
}
.jrn-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }
.jrn-grid {
  position:relative; z-index:1; display:grid;
  grid-template-columns:repeat(6,1fr);
  align-items:end;
  height:420px;
}
.jrn-step {
  display:flex; flex-direction:column; align-items:center;
  position:relative;
  transition:transform .25s ease;
}
.jrn-step:nth-child(1) { align-self:end; }
.jrn-step:nth-child(2) { align-self:end; padding-bottom:70px; }
.jrn-step:nth-child(3) { align-self:end; padding-bottom:140px; }
.jrn-step:nth-child(4) { align-self:end; padding-bottom:210px; }
.jrn-step:nth-child(5) { align-self:end; padding-bottom:280px; }
.jrn-step:nth-child(6) { align-self:end; padding-bottom:350px; }
.jrn-circle {
  width:72px; height:72px; border-radius:50%;
  background:var(--y); color:var(--b);
  font-family:'Unbounded'; font-size:28px; font-weight:900;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 30px rgba(255,214,0,.28);
  transition:transform .25s ease, box-shadow .25s ease;
  position:relative;
  animation:pulse-y 2.6s ease-out infinite;
}
.jrn-circle.start {
  font-size:10px; font-weight:700; text-align:center; line-height:1.15;
  letter-spacing:.2px; animation:none;
}
.jrn-step:hover { transform:translateY(-4px); }
.jrn-step:hover .jrn-circle { transform:scale(1.08); box-shadow:0 0 40px rgba(255,214,0,.5); }
.jrn-label {
  position:absolute;
  width:190px;
  font-size:11px;
  color:var(--g2);
  text-align:left;
  line-height:1.5;
}
.jrn-label h5 {
  font-family:'Unbounded'; font-size:10px; font-weight:800;
  color:var(--y); letter-spacing:1px; margin-bottom:6px; text-transform:uppercase;
}
/* alternate label above/below for readability */
.jrn-step:nth-child(odd)  .jrn-label { bottom:calc(100% + 14px); left:50%; transform:translateX(-50%); text-align:center; width:180px; }
.jrn-step:nth-child(even) .jrn-label { top:calc(100% + 14px); left:50%; transform:translateX(-50%); text-align:center; width:180px; }
.jrn-step:nth-child(1) .jrn-label { top:calc(100% + 14px); bottom:auto; }

/* WHAT SETS US APART pbox */
.pbox { max-width:940px; margin:48px auto 0; padding:48px;
  border-radius:20px; background:linear-gradient(135deg,rgba(255,214,0,.05),rgba(255,214,0,.01));
  border:1px solid rgba(255,214,0,.1); text-align:center; }
.pbox h3 { font-family:'Unbounded'; font-size:clamp(18px,2.4vw,26px);
  font-weight:800; margin-bottom:14px; }
.pbox h3 em { color:var(--y); font-style:normal; }
.pbox > p { color:var(--g2); font-size:14px; line-height:1.7; max-width:680px; margin:0 auto; }
.pbox-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:32px; }
.pbox-item { padding:22px 18px; border-radius:12px;
  background:rgba(255,214,0,.03); border:1px solid rgba(255,214,0,.08);
  transition:border-color .25s ease; }
.pbox-item:hover { border-color:rgba(255,214,0,.25); }
.pbox-item .pi { color:var(--y); margin-bottom:10px; display:flex; justify-content:center; }
.pbox-item h5 { font-family:'Unbounded'; font-size:11px; font-weight:800;
  color:var(--y); margin-bottom:6px; letter-spacing:.5px; }
.pbox-item p { font-size:12px; color:var(--g2); line-height:1.5; }

/* SYSTEM AIR cards */
.sys-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; max-width:1140px; margin:0 auto; }
.sys-card { background:var(--b3); border:1px solid rgba(255,255,255,.04);
  border-radius:16px; padding:30px 24px; transition:all .25s ease; cursor:pointer; }
.sys-card:hover { border-color:rgba(255,214,0,.2); transform:translateY(-4px);
  box-shadow:0 20px 40px -20px rgba(255,214,0,.15); }
.sys-head { display:flex; align-items:center; gap:14px; margin-bottom:12px; }
.sys-letter { font-family:'Unbounded'; font-size:38px; font-weight:900; color:var(--y); line-height:1; }
.sys-ico { color:var(--y); }
.sys-label { font-size:10px; font-weight:700; color:var(--g);
  letter-spacing:1px; text-transform:uppercase; margin-bottom:6px; }
.sys-card h3 { font-family:'Unbounded'; font-size:14px; font-weight:800; margin-bottom:8px; }
.sys-card > p { font-size:12px; color:var(--g2); line-height:1.6; margin-bottom:14px; }
.sys-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
.sys-tag { padding:4px 10px; border-radius:16px;
  background:rgba(255,214,0,.07); border:1px solid rgba(255,214,0,.12);
  font-size:10px; color:var(--y); font-weight:600; }
.sys-det { max-height:0; overflow:hidden; transition:max-height .4s ease; }
.sys-det.o { max-height:280px; }
.sys-det li { list-style:none; padding:5px 0; font-size:11px; color:var(--g2); display:flex; gap:8px; }
.sys-det li::before { content:'→'; color:var(--y); font-weight:700; }
.sys-tog { color:var(--y); font-size:10px; font-weight:700;
  display:inline-flex; align-items:center; gap:4px; }

/* CASES */
.cases { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:18px; max-width:1140px; margin:0 auto; }
.case { background:var(--b3); border:1px solid rgba(255,255,255,.04);
  border-radius:16px; padding:28px 24px; transition:all .25s ease; }
.case:hover { border-color:rgba(255,214,0,.15); transform:translateY(-3px); }
.case-tag { font-family:'Unbounded'; font-size:10px; font-weight:800;
  color:var(--y); letter-spacing:1.5px; margin-bottom:12px; display:block; }
.case-lb { font-size:9px; font-weight:700; color:var(--g);
  letter-spacing:1px; text-transform:uppercase; margin-bottom:3px; margin-top:8px; }
.case p { font-size:12px; color:var(--g2); line-height:1.55; margin-bottom:8px; }
.case-metrics { display:flex; gap:8px; padding-top:12px; margin-top:4px;
  border-top:1px solid rgba(255,255,255,.04); }
.case-m { padding:9px 14px; border-radius:8px; flex:1;
  background:rgba(255,214,0,.04); border:1px solid rgba(255,214,0,.08); text-align:center; }
.case-m .n { font-family:'Unbounded'; font-size:18px; font-weight:900; color:var(--y); }
.case-m .l { font-size:8px; color:var(--g); letter-spacing:1px; text-transform:uppercase; margin-top:2px; }

/* Guarantee */
.guar { background:linear-gradient(135deg,rgba(255,214,0,.05),rgba(255,214,0,.01));
  border:1px solid rgba(255,214,0,.12); border-radius:20px;
  padding:44px; max-width:680px; margin:0 auto; }
.guar h3 { font-family:'Unbounded'; font-size:18px; font-weight:800;
  margin-bottom:20px; text-align:center; }
.guar h3 em { color:var(--y); font-style:normal; }
.guar li { list-style:none; padding:10px 0; font-size:13px; color:var(--g2);
  line-height:1.55; display:flex; gap:12px; align-items:flex-start; }
.guar .gc { width:22px; height:22px; min-width:22px; border-radius:6px;
  background:rgba(255,214,0,.12); color:var(--y);
  display:flex; align-items:center; justify-content:center; margin-top:1px; }

/* FAQ */
.faq { max-width:700px; margin:0 auto; }
.faq-i { border-bottom:1px solid rgba(255,255,255,.05); }
.faq-q { padding:18px 0; cursor:pointer; display:flex;
  justify-content:space-between; align-items:center; gap:16px;
  font-size:14px; font-weight:600; transition:color .2s ease; }
.faq-q:hover { color:var(--y); }
.faq-q .a { width:26px; height:26px; border-radius:6px;
  background:rgba(255,214,0,.08); display:flex; align-items:center; justify-content:center;
  color:var(--y); transition:transform .3s ease, background .25s ease; flex-shrink:0; }
.faq-q .a.o { background:var(--y); color:var(--b); transform:rotate(45deg); }
.faq-a { max-height:0; overflow:hidden; transition:max-height .4s ease;
  font-size:13px; color:var(--g2); line-height:1.65; }
.faq-a.o { max-height:240px; padding-bottom:16px; }

/* Team */
.tm-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:16px; max-width:760px; margin:0 auto; }
.tm { background:var(--b3); padding:28px 22px; border-radius:16px;
  border:1px solid rgba(255,255,255,.04); text-align:center;
  transition:border-color .25s ease, transform .25s ease; }
.tm:hover { border-color:rgba(255,214,0,.15); transform:translateY(-3px); }
.tm h4 { font-family:'Unbounded'; font-size:13px; font-weight:800; margin-bottom:4px; }
.tm .rl { color:var(--y); font-size:9px; font-weight:700;
  letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; display:block; }
.tm p { color:var(--g2); font-size:11px; line-height:1.5; }

/* Forms */
.fg { margin-bottom:14px; }
.fg label { display:block; font-size:9px; font-weight:700;
  letter-spacing:2px; text-transform:uppercase; color:var(--g); margin-bottom:6px; }
.fg input, .fg textarea { width:100%; background:var(--b3);
  border:1px solid rgba(255,255,255,.06); color:var(--w); padding:12px 14px;
  font-family:'Outfit'; font-size:13px; outline:none; border-radius:8px;
  transition:border-color .2s ease; }
.fg input:focus, .fg textarea:focus { border-color:var(--y); }
.fg textarea { min-height:90px; resize:vertical; }

.cta { text-align:center; padding:88px 24px; position:relative; }
.cta::before { content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse at center,rgba(255,214,0,.05),transparent 60%); }
.cta * { position:relative; }

/* Modal */
.mo { position:fixed; inset:0; background:rgba(0,0,0,.92);
  z-index:200;
  display:flex; align-items:center; justify-content:center; padding:24px; }
.mo-box { background:var(--b3); border:1px solid rgba(255,214,0,.12);
  border-radius:20px; padding:38px; max-width:460px; width:100%; position:relative; }
.mo-x { position:absolute; top:14px; right:14px; background:none; border:none;
  color:var(--g); cursor:pointer; padding:4px; display:flex; transition:color .2s ease; }
.mo-x:hover { color:var(--y); }

.ft { padding:40px 48px; border-top:1px solid rgba(255,214,0,.06); text-align:center; }
.ft .cp { color:var(--g); font-size:10px; margin-bottom:8px; }
.ft .lk { display:flex; gap:18px; justify-content:center; }
.ft .lk a { color:var(--g); font-size:10px; text-decoration:none; cursor:pointer;
  background:none; border:none; font-family:inherit; transition:color .2s ease; }
.ft .lk a:hover { color:var(--y); }

/* Admin */
.adm { padding:110px 48px 60px; }
.adm h2 { font-family:'Unbounded'; font-size:24px; font-weight:900;
  color:var(--y); margin-bottom:20px; }
.adm-tabs { display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap; }
.adm-tab { padding:10px 18px; border-radius:8px; background:var(--b3);
  border:1px solid rgba(255,255,255,.06); font-family:'Unbounded';
  font-size:10px; font-weight:700; color:var(--g); cursor:pointer;
  transition:all .2s ease; display:inline-flex; align-items:center; gap:6px; }
.adm-tab.act { background:var(--y); color:var(--b); border-color:var(--y); }
.adm-tab:hover { border-color:var(--y); color:var(--y); }
.adm-tab.act:hover { color:var(--b); }
.adm h3 { font-family:'Unbounded'; font-size:12px; font-weight:800;
  margin:18px 0 12px; color:var(--g2); }
.ai { background:var(--b3); border:1px solid rgba(255,255,255,.08);
  color:var(--w); padding:10px 14px; font-family:'Outfit'; font-size:12px;
  outline:none; border-radius:8px; margin-right:6px; margin-bottom:6px; min-width:150px;
  transition:border-color .2s ease; }
.ai:focus { border-color:var(--y); }
.al { display:flex; flex-direction:column; gap:8px; margin-top:10px; }
.ae { background:var(--b3); padding:10px 14px; border-radius:8px;
  display:flex; align-items:center; gap:12px;
  border:1px solid rgba(255,255,255,.04); font-size:12px; }
.ae .grip { color:var(--g); cursor:grab; display:flex; }
.ae .grip:active { cursor:grabbing; }
.ae.drop { border-color:var(--y); background:rgba(255,214,0,.04); }
.ae-body { flex:1; }
.adm-preview { background:var(--b); border:1px dashed rgba(255,214,0,.2);
  border-radius:10px; padding:18px; margin-top:12px; }
.adm-preview-lbl { font-size:9px; color:var(--y); letter-spacing:2px;
  text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:6px; }

/* TIMELINE — what happens after you click */
.tl { list-style:none; max-width:720px; margin:0 auto; text-align:left; }
.tl-i { display:grid; grid-template-columns:56px 1fr; gap:22px; position:relative; padding-bottom:30px; }
.tl-i:last-child { padding-bottom:0; }
.tl-i::before { content:''; position:absolute; left:27px; top:62px; bottom:6px; width:2px;
  background:linear-gradient(rgba(255,214,0,.7), rgba(255,214,0,.08)); border-radius:2px; }
.tl-i:last-child::before { display:none; }
.tl-dot { width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  background:rgba(255,214,0,.08); border:1px solid rgba(255,214,0,.35); color:var(--y);
  transition:transform .25s ease, background .25s ease; }
.tl-i:hover .tl-dot { transform:scale(1.08); background:rgba(255,214,0,.16); }
.tl-i:last-child .tl-dot { background:var(--y); color:var(--b); box-shadow:0 0 30px rgba(255,214,0,.35); }
.tl-body { padding-top:4px; }
.tl-when { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--y); }
.tl-body h3 { font-family:'Unbounded'; font-size:18px; font-weight:700; color:var(--w); margin:6px 0; line-height:1.3; }
.tl-body p { font-size:14px; color:var(--g2); line-height:1.6; }

/* FOUNDERS */
.fd-wrap { max-width:920px; margin:0 auto; padding:36px;
  background:linear-gradient(135deg,rgba(255,214,0,.04),rgba(255,214,0,.01));
  border:1px solid rgba(255,214,0,.12); border-radius:20px; }
.fd-people { display:flex; gap:22px; justify-content:center; flex-wrap:wrap;
  margin-bottom:30px; padding-bottom:28px; border-bottom:1px solid rgba(255,214,0,.08); }
.fd-person { text-align:center; max-width:220px; }
.fd-avatar { width:88px; height:88px; border-radius:50%;
  background:rgba(255,214,0,.1); border:2px solid rgba(255,214,0,.25);
  color:var(--y); display:flex; align-items:center; justify-content:center;
  margin:0 auto 14px; overflow:hidden; flex-shrink:0; }
.fd-avatar img { width:100%; height:100%; object-fit:cover; display:block; }
.fd-person h4 { font-size:14px; font-weight:800; margin-bottom:4px; }
.fd-person .rl { color:var(--y); font-size:9px; font-weight:700;
  letter-spacing:2px; text-transform:uppercase; margin-bottom:8px; display:block; }
.fd-person p { color:var(--g2); font-size:12px; line-height:1.55; }
.fd-creds { list-style:none; }
.fd-creds li { display:flex; gap:14px; padding:14px 0; font-size:13px;
  color:var(--g2); line-height:1.65; align-items:flex-start;
  border-bottom:1px solid rgba(255,255,255,.04); }
.fd-creds li:last-child { border-bottom:none; }
.fd-num { font-family:'Unbounded'; font-size:18px; font-weight:900;
  color:var(--y); flex-shrink:0; line-height:1; padding-top:2px; min-width:32px; }

/* TESTIMONIALS */
.ts-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:18px; max-width:1200px; margin:0 auto; }
.ts-card { background:var(--b3); border:1px solid rgba(255,255,255,.04);
  border-radius:16px; padding:28px 24px; position:relative;
  transition:border-color .25s ease, transform .25s ease; }
.ts-card:hover { border-color:rgba(255,214,0,.18); transform:translateY(-3px); }
.ts-q { color:var(--y); opacity:.4; margin-bottom:10px; }
.ts-text { font-size:13px; color:var(--g2); line-height:1.7; margin-bottom:18px;
  font-style:italic; }
.ts-meta { padding-top:14px; border-top:1px solid rgba(255,214,0,.08); }
.ts-name { font-family:'Unbounded'; font-size:12px; font-weight:800; color:var(--w); }
.ts-role { font-size:10px; color:var(--y); letter-spacing:1.5px;
  text-transform:uppercase; margin-top:3px; font-weight:600; }

/* RESPONSIVE */
@media (max-width:1200px) {
  .svc-grid { grid-template-columns:repeat(4,1fr); }
}
@media (max-width:1024px) {
  .sec { padding:72px 32px; }
  .pain-grid { grid-template-columns:repeat(2,1fr); }
  .svc-grid { grid-template-columns:repeat(3,1fr); }
  .sys-grid { grid-template-columns:1fr; gap:14px; }
  .tl-i { grid-template-columns:44px 1fr; gap:16px; }
  .tl-dot { width:44px; height:44px; }
  .tl-i::before { left:21px; top:50px; }
  .tl-body h3 { font-size:16px; }
  .jrn-grid { height:360px; }
  .jrn-step:nth-child(2) { padding-bottom:56px; }
  .jrn-step:nth-child(3) { padding-bottom:112px; }
  .jrn-step:nth-child(4) { padding-bottom:168px; }
  .jrn-step:nth-child(5) { padding-bottom:224px; }
  .jrn-step:nth-child(6) { padding-bottom:280px; }
}
@media (max-width:900px) {
  .NR { display:none; }
  .mob { display:block; }
  .N { padding:12px 16px; }
  .sec { padding:56px 20px; content-visibility:auto; contain-intrinsic-size:auto 600px; }
  .jrn-circle { animation:none; }
  .svc:hover, .case:hover, .tm:hover, .sys-card:hover, .jrn-step:hover { transform:none; }
  .ST { grid-template-columns:1fr; gap:22px; padding:40px 20px; }
  .svc-grid { grid-template-columns:repeat(2,1fr); gap:12px; }
  .svc { min-height:170px; padding:22px 14px 18px; }
  .pbox { padding:28px 18px; }
  .pbox-grid { grid-template-columns:1fr; }
  .ft { padding:28px 20px; }
  .adm { padding:90px 18px 40px; }
  .fd-wrap { padding:24px 18px; }
  .fd-creds li { font-size:12px; gap:10px; }
  /* Journey becomes vertical timeline */
  .jrn-wrap { min-height:auto; padding:20px 0; }
  .jrn-svg { display:none; }
  .jrn-grid { grid-template-columns:1fr; height:auto; gap:22px; }
  .jrn-step { flex-direction:row; align-items:flex-start; gap:18px;
    padding:0 0 0 0 !important; align-self:start !important; text-align:left; }
  .jrn-step .jrn-circle { flex-shrink:0; }
  .jrn-step .jrn-label { position:static !important; transform:none !important;
    width:auto !important; text-align:left !important; flex:1; padding-top:6px; }
}
@media (max-width:500px) {
  .svc-grid { grid-template-columns:1fr; }
  .pain-grid { grid-template-columns:1fr; }
  .mq-set span { font-size:11px; }
  .cases { grid-template-columns:1fr; }
  .sec h2 { font-size:24px; }
  .jrn-circle { width:60px; height:60px; font-size:22px; }
}
@media (max-width:375px) {
  .sec { padding:48px 16px; }
  .N { padding:10px 14px; }
  .NL { font-size:16px; }
}
`;

  const marqueeWords = ["Реклами в Google", "Реклами в Meta", "Реклами в TikTok", "Реклами в ChatGPT", "AI автоматизации", "Имейли, които продават", "AI обслужване 24/7", "Страници, които конвертират"];

  const ctaBand = (title, text, id) => (
    <section className="cta-band">
      <h3 {...ff(`${id}h`)}>{title}</h3>
      <p {...ff(`${id}p`, 0.08)}>{text}</p>
      <button {...ff(`${id}b`, 0.16)} className="btn btn-dk" onClick={() => setShowAudit(true)}>
        Искам безплатна стратегия <ArrowRight size={14} />
      </button>
    </section>
  );

  const renderHome = () => (
    <>
      {/* 1. Hero — one message */}
      <HeroGeometric
        badge="РЕКЛАМИ + AI, КОИТО ПРОДАВАТ"
        title1="Време е да скалираш"
        title2="бизнеса си."
        subtitle="Реклами в Google, Meta, TikTok и ChatGPT + AI автоматизации — в една система, която носи клиенти всеки ден. Ти движиш бизнеса. Ние движим продажбите."
        ctaText="Искам безплатна стратегия"
        onCtaClick={() => setShowAudit(true)}
      />

      {/* 2. Marquee — what we do, at a glance */}
      <div className="mq" aria-label="Какво правим">
        <div className="mq-track">
          {[0, 1].map((k) => (
            <div key={k} className="mq-set" aria-hidden={k === 1 ? "true" : undefined}>
              {marqueeWords.map((w) => <span key={w}>{w}</span>)}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Proof in numbers */}
      <section className="sec dk" id="stats" style={{ paddingBottom: 30 }}>
        <div {...ff("sttg")} className="tg">Резултати</div>
        <h2 {...ff("sth2", 0.1)} className="U">
          Числата <em>говорят</em>.
        </h2>
        <div className="ST" style={{ marginTop: 32, padding: 0, background: "transparent", border: "none" }} {...ff("stg", 0.2, true)}>
          <div className="SI">
            <div className="SIi"><DollarSign size={34} /></div>
            <div className="SIs">Над</div>
            <div className="SIn"><Counter end={2} suffix="M+ €" /></div>
            <div className="SIl">Оборот за един клиент за 12 месеца</div>
          </div>
          <div className="SI">
            <div className="SIi"><TrendingUp size={34} /></div>
            <div className="SIs">Постигнахме</div>
            <div className="SIn">4.7x ROAS</div>
            <div className="SIl">Всяко евро в реклама връща 4.70 € продажби</div>
          </div>
          <div className="SI">
            <div className="SIi"><Rocket size={34} /></div>
            <div className="SIs">За</div>
            <div className="SIn"><Counter end={60} suffix=" дни" /></div>
            <div className="SIl">От ROAS 1.2 до 4.7 — без да вдигаме бюджета</div>
          </div>
        </div>
      </section>

      {/* 4. Pain — does this sound familiar? */}
      <section className="sec dk2" id="pain">
        <div {...ff("pntg")} className="tg">Познато ли ти е?</div>
        <h2 {...ff("pnh2", 0.1)} className="U">
          Бизнесът ти може повече.<br /><em>Нещо го спира.</em>
        </h2>
        <div className="pain-grid" style={{ marginTop: 32 }} {...ff("png", 0.2, true)}>
          {painPoints.map((p) => (
            <div key={p.title} className="pain-card">
              <div className="pain-ic"><SvcIcon name={p.icon} size={22} /></div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
        <p className="pain-out U" {...ff("pno", 0.1)}>
          Не ти трябват още реклами. Трябва ти <em>система</em>.
        </p>
      </section>

      {/* 5. The answer — why us */}
      <section className="sec dk" id="about">
        <div {...ff("ptg")} className="tg">Решението</div>
        <h2 {...ff("ph2", 0.1)} className="U">
          Една система.<br /><em>Предвидим растеж.</em>
        </h2>
        <p {...ff("psd", 0.15)} className="sdesc">
          Тествали сме с <strong style={{ color: "var(--y)" }}>собствени пари</strong>, не с твоите. Знаем какво е нещо да не върви — и как да го обърнем.
        </p>
        <div className="pbox" {...ff("pbx", 0.2)}>
          <div className="pbox-grid">
            <div className="pbox-item">
              <div className="pi"><Search size={22} /></div>
              <h5>ГЛЕДАМЕ ЦЕЛИЯ БИЗНЕС</h5>
              <p>Не само рекламите. Маржове, цени, повторни покупки. Иначе числата в рекламите не значат нищо.</p>
            </div>
            <div className="pbox-item">
              <div className="pi"><Bot size={22} /></div>
              <h5>AI РАБОТИ ВМЕСТО ТЕБ</h5>
              <p>Имейли, напомняния за изоставена количка, отговори на клиенти — автоматично, денонощно.</p>
            </div>
            <div className="pbox-item">
              <div className="pi"><Settings size={22} /></div>
              <h5>ВСИЧКО РАБОТИ ЗАЕДНО</h5>
              <p>Реклами в Meta и ChatGPT, страници, имейли и AI — свързани в една машина. Не купуваш парчета.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Services */}
      <section className="sec yellow" id="services">
        <div {...ff("svtg")} className="tg">Какво правим</div>
        <h2 {...ff("svh2", 0.1)} className="U">
          Всичко за <em>растеж</em>. На едно място.
        </h2>
        <p {...ff("svsd", 0.15)} className="sdesc">
          Избираме това, от което бизнесът ти има нужда — и го свързваме в една система.
        </p>
        <div className="svc-grid" {...ff("svg", 0.2, true)}>
          {activeServices.map((s) => s.href ? (
            <a key={s.id} className="svc svc-link" href={s.href} onClick={(e) => { e.preventDefault(); nav(pageFromPath(s.href)); }}>
              <div className="ic"><SvcIcon name={s.icon} size={28} /></div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <span className="svc-more">Виж повече <ArrowRight size={12} /></span>
            </a>
          ) : (
            <div key={s.id} className="svc" tabIndex={0}>
              <div className="ic"><SvcIcon name={s.icon} size={28} /></div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Case study */}
      <section className="sec" id="cases">
        <div {...ff("cstg")} className="tg">Доказателство</div>
        <h2 {...ff("csh2", 0.1)} className="U">
          Един бранд. <em>4.7x ROAS. {"2\u00A0000\u00A0000+\u00A0€"} оборот.</em>
        </h2>
        <p {...ff("cssd", 0.15)} className="sdesc">
          Реален клиент. Реални числа от рекламния акаунт.
        </p>
        <div className="cases" {...ff("csg", 0.2, true)}>
          {cases.map((c) => (
            <div key={c.id} className="case">
              <span className="case-tag">{c.client}</span>
              <div className="case-lb">Проблем</div>
              <p>{c.problem}</p>
              <div className="case-lb">Резултат</div>
              <p>{c.result}</p>
              <div className="case-metrics">
                <div className="case-m"><div className="n">{c.metric}</div><div className="l">Резултат</div></div>
                <div className="case-m"><div className="n">{c.time}</div><div className="l">Време</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Testimonials */}
      {testimonials.length > 0 && (
        <section className="sec" id="testimonials" style={{ paddingTop: 20 }}>
          <div {...ff("tstg")} className="tg">Отзиви</div>
          <h2 {...ff("tsh2", 0.1)} className="U">
            Какво <em>казват</em> клиентите.
          </h2>
          <p {...ff("tssd", 0.15)} className="sdesc">
            Реални думи от реални хора.
          </p>
          <div className="ts-grid" {...ff("tsg", 0.2, true)}>
            {testimonials.map((t) => (
              <div key={t.id} className="ts-card">
                <Quote size={22} className="ts-q" />
                <p className="ts-text">{t.quote}</p>
                <div className="ts-meta">
                  <div className="ts-name">{t.name}</div>
                  <div className="ts-role">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {ctaBand("Готов да скалираш?", "30 минути. Безплатно. Ще ти кажем къде губиш пари и какво да промениш.", "cb1")}

      {/* 9. What happens after you click — timeline */}
      <section className="sec" id="process">
        <div {...ff("wptg")} className="tg">След бутона</div>
        <h2 {...ff("wph2", 0.1)} className="U">
          Какво става, след като <em>натиснеш бутона</em>.
        </h2>
        <p {...ff("wpsd", 0.15)} className="sdesc">
          Без дълги договори. Без изненади.
        </p>
        <ol className="tl" {...ff("tl", 0.2, true)}>
          {timeline.map((t) => (
            <li key={t.title} className="tl-i">
              <div className="tl-dot"><SvcIcon name={t.icon} size={22} /></div>
              <div className="tl-body">
                <span className="tl-when">{t.when}</span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button {...ff("tlb", 0.1)} className="btn" onClick={() => setShowAudit(true)}>
            Искам безплатна стратегия <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 10. System AIR */}
      <section className="sec dk" id="system">
        <div {...ff("sytg")} className="tg">Методът</div>
        <h2 {...ff("syh2", 0.1)} className="U">
          Системата <em>АИР</em>
        </h2>
        <p {...ff("sysd", 0.15)} className="sdesc">
          Анализ → Изграждане → Растеж. Без гадаене.
        </p>
        <div className="sys-grid" {...ff("syg", 0.2, true)}>
          {systemSteps.map((s, i) => (
            <div
              key={i}
              className="sys-card"
              onClick={() => setOpenSys(openSys === i ? null : i)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === "Enter" && setOpenSys(openSys === i ? null : i)}
            >
              <div className="sys-head">
                <div className="sys-letter">{s.letter}</div>
                <div className="sys-ico"><SvcIcon name={s.icon} size={28} /></div>
              </div>
              <div className="sys-label">{["Първо", "Второ", "Трето"][i]}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="sys-tags">
                {s.tags.map((t, j) => <span key={j} className="sys-tag">{t}</span>)}
              </div>
              <span className="sys-tog">
                {openSys === i ? "Скрий" : "Виж детайли"} <ChevronDown size={12} style={{ transform: openSys === i ? "rotate(180deg)" : "none", transition: "transform .3s ease" }} />
              </span>
              <div className={`sys-det ${openSys === i ? "o" : ""}`}>
                <ul>{s.details.map((d, j) => <li key={j}>{d}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Onboarding journey */}
      <section className="sec dk2" id="journey">
        <div {...ff("jrtg")} className="tg">Пътят</div>
        <h2 {...ff("jrh2", 0.1)} className="U">
          От разговор до <em>растеж</em>.
        </h2>
        <p {...ff("jrsd", 0.15)} className="sdesc">
          Знаеш какво следва на всяка стъпка.
        </p>
        <div className="jrn-wrap" {...ff("jrg", 0.2)}>
          <svg className="jrn-svg" viewBox="0 0 1200 520" preserveAspectRatio="none">
            <defs>
              <linearGradient id="jrline" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFD600" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FFD600" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <polyline
              pathLength="1"
              points="100,460 300,460 300,390 500,390 500,320 700,320 700,250 900,250 900,180 1100,180 1100,110"
              fill="none"
              stroke="url(#jrline)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="jrn-grid" {...ff("jrs", 0.3, true)}>
            {journeySteps.map((j, i) => (
              <div key={i} className="jrn-step">
                <div className={`jrn-circle ${i === 0 ? "start" : ""}`}>
                  {i === 0 ? <>Ти<br />си<br />тук</> : i}
                </div>
                <div className="jrn-label">
                  <h5>{j.title}</h5>
                  <span>{j.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Founder */}
      <section className="sec dk" id="team">
        <div {...ff("fdtg")} className="tg">Кой стои зад Profitbrand</div>
        <h2 {...ff("fdh2", 0.1)} className="U">
          Тествали сме <em>с наши пари</em>. Не с твоите.
        </h2>
        <div className="fd-wrap" {...ff("fdg", 0.2)}>
          {team.length > 0 && (
            <div className="fd-people">
              {team.map((m) => (
                <div key={m.id} className="fd-person">
                  <div className="fd-avatar">
                    {m.photo ? <img src={m.photo} alt={m.name} loading="lazy" decoding="async" /> : <SvcIcon name="Award" size={28} />}
                  </div>
                  <h4 className="U">{m.name}</h4>
                  <span className="rl">{m.role}</span>
                  <p>{m.bio}</p>
                </div>
              ))}
            </div>
          )}
          <ul className="fd-creds">
            {credentials.map((c, i) => (
              <li key={i}>
                <span className="fd-num">{String(i + 1).padStart(2, "0")}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button className="btn" onClick={() => setShowAudit(true)}>
              Искам безплатна стратегия <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 13. Guarantee */}
      <section className="sec" id="guarantee">
        <div {...ff("grtg")} className="tg">Гаранция</div>
        <h2 {...ff("grh2", 0.1)} className="U">
          Ние поемаме <em>риска</em>.
        </h2>
        <p {...ff("grsd", 0.15)} className="sdesc">
          Вярваме в системата. Затова я гарантираме.
        </p>
        <div className="guar" {...ff("grg", 0.2)}>
          <h3 className="U">Тройна <em>гаранция</em></h3>
          <ul>
            <li><span className="gc"><Check size={14} /></span>ROAS +50% за първите 90 дни — или работим безплатно, докато го постигнем.</li>
            <li><span className="gc"><Check size={14} /></span>Без дългосрочен договор. Спираш, когато поискаш.</li>
            <li><span className="gc"><Check size={14} /></span>Пълна прозрачност — виждаш рекламите и данните в реално време.</li>
          </ul>
        </div>
      </section>

      {/* 14. FAQ */}
      <section className="sec dk" id="faq">
        <div {...ff("fqtg")} className="tg">Въпроси</div>
        <h2 {...ff("fqh2", 0.1)} className="U">
          Знаем какво <em>си мислиш</em>.
        </h2>
        <div className="faq" style={{ marginTop: 32 }} {...ff("fqg", 0.2, true)}>
          {faqs.map((q, i) => (
            <div key={i} className="faq-i">
              <div
                className="faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setOpenFaq(openFaq === i ? null : i)}
              >
                {q.q}
                <span className={`a ${openFaq === i ? "o" : ""}`}><Plus size={16} /></span>
              </div>
              <div className={`faq-a ${openFaq === i ? "o" : ""}`}>{q.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 15. Final CTA + form */}
      <section className="sec cta" id="contact">
        <div {...ff("cftg")} className="tg">Последна стъпка</div>
        <h2 {...ff("cfh2", 0.1)} className="U" style={{ maxWidth: 680, margin: "0 auto 16px" }}>
          Време е да <em>скалираш</em>.
        </h2>
        <p {...ff("cfsd", 0.15)} className="sdesc">
          Запиши безплатен 30-минутен разговор. Работим с малко клиенти наведнъж — така всеки получава пълно внимание.
        </p>
        <div style={{ maxWidth: 460, margin: "32px auto 0", textAlign: "left" }} {...ff("cfg", 0.2)}>
          <div className="fg"><label>Име</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Твоето име" />
          </div>
          <div className="fg"><label>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
          </div>
          <div className="fg"><label>Сайт на бизнеса</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="https://..." />
          </div>
          <div className="fg"><label>Месечен рекламен бюджет</label>
            <textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="Напр. 5 000 €/мес. + няколко думи за бизнеса" />
          </div>
          <button className="btn" style={{ width: "100%" }} onClick={() => alert("Благодаря! Ще се свържем с теб до 24 часа.")}>
            Искам безплатна стратегия <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </>
  );

  /* Admin Preview */
  const previewService = (s) => (
    <div className="svc" style={{ maxWidth: 200, margin: "0 auto" }}>
      <div className="ic"><SvcIcon name={s.icon} size={28} /></div>
      <h4>{s.title || "ЗАГЛАВИЕ"}</h4>
    </div>
  );
  const previewCase = (c) => (
    <div className="case" style={{ maxWidth: 320 }}>
      <span className="case-tag">{c.client || "КЛИЕНТ"}</span>
      <div className="case-lb">Проблем</div><p>{c.problem || "..."}</p>
      <div className="case-lb">Резултат</div><p>{c.result || "..."}</p>
      <div className="case-metrics">
        <div className="case-m"><div className="n">{c.metric || "—"}</div><div className="l">Резултат</div></div>
        <div className="case-m"><div className="n">{c.time || "—"}</div><div className="l">Време</div></div>
      </div>
    </div>
  );

  const dragProps = (list, setList, id) => ({
    draggable: true,
    onDragStart: () => onDragStart(id),
    onDragOver: (e) => e.preventDefault(),
    onDrop: () => {
      if (dragId == null || dragId === id) return;
      const next = reorder(list, dragId, id);
      setList(next);
      setDragId(null);
      if (list === clients) save(next, team, services, cases, testimonials, credentials);
      if (list === team) save(clients, next, services, cases, testimonials, credentials);
      if (list === services) save(clients, team, next, cases, testimonials, credentials);
      if (list === cases) save(clients, team, services, next, testimonials, credentials);
      if (list === testimonials) save(clients, team, services, cases, next, credentials);
    },
  });

  const renderAdmin = () => {
    if (!isAdmin)
      return (
        <div className="adm" style={{ textAlign: "center", paddingTop: 180 }}>
          <h2>ADMIN ПАНЕЛ</h2>
          <p style={{ color: "var(--g2)", marginBottom: 14 }}>Въведете парола</p>
          <input
            className="ai"
            type="password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryLogin()}
            placeholder="Парола"
          />
          <button className="btn btnSm" onClick={tryLogin} disabled={loginBusy}>{loginBusy ? "…" : "ВХОД"}</button>
          {loginErr && <p style={{ color: "#FF6B78", fontSize: 12, marginTop: 12 }}>{loginErr}</p>}
        </div>
      );

    const iconOptions = Object.keys(ICONS);

    return (
      <div className="adm">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
          <h2 style={{ margin: 0 }}>ADMIN ПАНЕЛ</h2>
          <button className="btn2 btnSm" onClick={() => { setIsAdmin(false); setAdminPass(""); }}>ИЗХОД</button>
        </div>
        <div className="adm-tabs">
          {[
            { k: "stats", l: "Статистика" },
            { k: "team", l: "Екип & Снимки" },
            { k: "credentials", l: "За нас (Credentials)" },
            { k: "services", l: "Услуги" },
            { k: "cases", l: "Case Studies" },
            { k: "testimonials", l: "Отзиви" },
          ].map((t) => (
            <div key={t.k} className={`adm-tab ${adminTab === t.k ? "act" : ""}`} onClick={() => setAdminTab(t.k)}>
              {t.l}
            </div>
          ))}
        </div>

        {adminTab === "stats" && (
          <AdminStats
            stats={stats}
            days={statsDays}
            loading={statsLoading}
            error={statsErr}
            onDays={(d) => { setStatsDays(d); loadStats(adminPass, d); }}
            onRefresh={() => loadStats(adminPass, statsDays)}
          />
        )}

        {adminTab === "team" && (
          <div>
            <h3>Добави член на екипа</h3>
            <p style={{ color: "var(--g)", fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>
              💡 Снимка: качи файл директно от компютъра (бутон „📁 Качи снимка") ИЛИ постави URL на онлайн снимка.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
              <input className="ai" value={nm.name} onChange={(e) => setNm({ ...nm, name: e.target.value })} placeholder="Име" />
              <input className="ai" value={nm.role} onChange={(e) => setNm({ ...nm, role: e.target.value })} placeholder="Позиция" />
              <input className="ai" style={{ minWidth: 240 }} value={nm.bio} onChange={(e) => setNm({ ...nm, bio: e.target.value })} placeholder="Описание" />
              <input className="ai" style={{ minWidth: 220 }} value={nm.photo.startsWith("data:") ? "(качена снимка)" : nm.photo} onChange={(e) => setNm({ ...nm, photo: e.target.value })} placeholder="URL снимка" disabled={nm.photo.startsWith("data:")} />
              <label className="btn2 btnSm" style={{ cursor: "pointer", margin: 0 }}>
                📁 Качи снимка
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    if (f.size > 2 * 1024 * 1024) {
                      alert("Снимката трябва да е под 2MB. Compress-ни я на squoosh.app");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => setNm((p) => ({ ...p, photo: reader.result }));
                    reader.readAsDataURL(f);
                  }}
                />
              </label>
              {nm.photo && (
                <button className="btnD" onClick={() => setNm({ ...nm, photo: "" })} title="Изчисти снимката">
                  <X size={12} />
                </button>
              )}
              <button className="btn btnSm" onClick={() => {
                if (!nm.name) return;
                const u = [...team, { ...nm, id: Date.now() }];
                setTeam(u); save(clients, u, services, cases, testimonials, credentials); setNm({ name: "", role: "", bio: "", photo: "" });
              }}><Plus size={12} /> Добави</button>
            </div>
            {(nm.name || nm.photo) && (
              <div className="adm-preview">
                <div className="adm-preview-lbl"><Eye size={12} /> PREVIEW</div>
                <div className="fd-person" style={{ margin: "0 auto" }}>
                  <div className="fd-avatar">
                    {nm.photo ? <img src={nm.photo} alt={nm.name} /> : <Award size={28} />}
                  </div>
                  <h4 className="U">{nm.name || "Име"}</h4>
                  <span className="rl">{nm.role || "Позиция"}</span>
                  <p>{nm.bio || "Описание..."}</p>
                </div>
              </div>
            )}
            <h3>Управление (drag & drop за подредба)</h3>
            <div className="al">
              {team.map((m) => (
                <div key={m.id} className="ae" {...dragProps(team, setTeam, m.id)}>
                  <span className="grip"><GripVertical size={14} /></span>
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,214,0,.25)" }} />
                  ) : (
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,214,0,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--y)" }}>
                      <Award size={16} />
                    </div>
                  )}
                  <div className="ae-body">
                    <strong>{m.name}</strong> — <span style={{ color: "var(--y)" }}>{m.role}</span>
                    <br /><span style={{ color: "var(--g)", fontSize: 10 }}>{m.bio}</span>
                  </div>
                  <button className="btnD" onClick={() => { const u = team.filter((x) => x.id !== m.id); setTeam(u); save(clients, u, services, cases, testimonials, credentials); }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "credentials" && (
          <div>
            <h3>Credentials (точки в секцията „Кои сме ние")</h3>
            <p style={{ color: "var(--g)", fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>
              Това са пронумерованите твърдения за теб/екипа в секция „Кои сме ние и защо да ни вярвате". Добавяй конкретни числа, доказателства, постижения.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              <input
                className="ai"
                style={{ minWidth: 480, flex: 1 }}
                value={newCred}
                onChange={(e) => setNewCred(e.target.value)}
                placeholder="Напр: Изградихме системата ХYZ, която генерира 1М€ оборот..."
              />
              <button className="btn btnSm" onClick={() => {
                if (!newCred.trim()) return;
                const u = [...credentials, newCred.trim()];
                setCredentials(u); save(clients, team, services, cases, testimonials, u); setNewCred("");
              }}><Plus size={12} /> Добави</button>
            </div>
            <h3>Подредба & редакция</h3>
            <div className="al">
              {credentials.map((c, i) => (
                <div key={i} className="ae">
                  <span className="grip" style={{ minWidth: 20, color: "var(--y)", fontFamily: "Unbounded", fontWeight: 900 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <textarea
                    className="ai"
                    style={{ flex: 1, minHeight: 50, fontFamily: "Outfit", resize: "vertical" }}
                    value={c}
                    onChange={(e) => {
                      const u = credentials.map((x, j) => j === i ? e.target.value : x);
                      setCredentials(u);
                    }}
                    onBlur={() => save(clients, team, services, cases, testimonials, credentials)}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button
                      className="btnD"
                      style={{ background: "var(--b)", color: "var(--g2)" }}
                      disabled={i === 0}
                      onClick={() => {
                        if (i === 0) return;
                        const u = [...credentials];
                        [u[i - 1], u[i]] = [u[i], u[i - 1]];
                        setCredentials(u); save(clients, team, services, cases, testimonials, u);
                      }}
                    >↑</button>
                    <button
                      className="btnD"
                      style={{ background: "var(--b)", color: "var(--g2)" }}
                      disabled={i === credentials.length - 1}
                      onClick={() => {
                        if (i === credentials.length - 1) return;
                        const u = [...credentials];
                        [u[i], u[i + 1]] = [u[i + 1], u[i]];
                        setCredentials(u); save(clients, team, services, cases, testimonials, u);
                      }}
                    >↓</button>
                  </div>
                  <button className="btnD" onClick={() => {
                    const u = credentials.filter((_, j) => j !== i);
                    setCredentials(u); save(clients, team, services, cases, testimonials, u);
                  }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "services" && (
          <div>
            <h3>Добави услуга</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
              <select className="ai" value={ns.icon} onChange={(e) => setNs({ ...ns, icon: e.target.value })}>
                {iconOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <input className="ai" value={ns.title} onChange={(e) => setNs({ ...ns, title: e.target.value })} placeholder="Заглавие" />
              <input className="ai" style={{ minWidth: 240 }} value={ns.desc} onChange={(e) => setNs({ ...ns, desc: e.target.value })} placeholder="Описание" />
              <button className="btn btnSm" onClick={() => {
                if (!ns.title) return;
                const u = [...services, { ...ns, id: Date.now(), active: true }];
                setServices(u); save(clients, team, u, cases, testimonials, credentials); setNs({ icon: "Sparkles", title: "", desc: "" });
              }}><Plus size={12} /> Добави</button>
            </div>
            {(ns.title || ns.desc) && (
              <div className="adm-preview">
                <div className="adm-preview-lbl"><Eye size={12} /> PREVIEW</div>
                {previewService(ns)}
              </div>
            )}
            <h3>Управление (клик = вкл/изкл, drag = подреждане)</h3>
            <div className="al">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="ae"
                  style={{ opacity: s.active ? 1 : 0.4 }}
                  {...dragProps(services, setServices, s.id)}
                >
                  <span className="grip"><GripVertical size={14} /></span>
                  <div
                    className="ae-body"
                    style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                    onClick={() => {
                      const u = services.map((x) => x.id === s.id ? { ...x, active: !x.active } : x);
                      setServices(u); save(clients, team, u, cases, testimonials, credentials);
                    }}
                  >
                    <SvcIcon name={s.icon} size={16} />
                    <span>{s.title}</span>
                  </div>
                  <span style={{ color: s.active ? "#6bff8b" : "#ff6e7e", fontSize: 9, fontWeight: 800 }}>{s.active ? "ON" : "OFF"}</span>
                  <button className="btnD" onClick={(e) => { e.stopPropagation(); const u = services.filter((x) => x.id !== s.id); setServices(u); save(clients, team, u, cases, testimonials, credentials); }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "cases" && (
          <div>
            <h3>Добави Case Study</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              <input className="ai" value={ncase.client} onChange={(e) => setNcase({ ...ncase, client: e.target.value })} placeholder="Клиент" />
              <input className="ai" style={{ minWidth: 220 }} value={ncase.problem} onChange={(e) => setNcase({ ...ncase, problem: e.target.value })} placeholder="Проблем" />
              <input className="ai" style={{ minWidth: 220 }} value={ncase.result} onChange={(e) => setNcase({ ...ncase, result: e.target.value })} placeholder="Резултат" />
              <input className="ai" style={{ maxWidth: 110 }} value={ncase.metric} onChange={(e) => setNcase({ ...ncase, metric: e.target.value })} placeholder="Метрика" />
              <input className="ai" style={{ maxWidth: 90 }} value={ncase.time} onChange={(e) => setNcase({ ...ncase, time: e.target.value })} placeholder="Време" />
              <button className="btn btnSm" onClick={() => {
                if (!ncase.client) return;
                const u = [...cases, { ...ncase, id: Date.now() }];
                setCases(u); save(clients, team, services, u, testimonials, credentials); setNcase({ client: "", problem: "", result: "", metric: "", time: "" });
              }}><Plus size={12} /> Добави</button>
            </div>
            {(ncase.client || ncase.problem) && (
              <div className="adm-preview">
                <div className="adm-preview-lbl"><Eye size={12} /> PREVIEW</div>
                {previewCase(ncase)}
              </div>
            )}
            <h3>Подредба (drag & drop)</h3>
            <div className="al">
              {cases.map((c) => (
                <div key={c.id} className="ae" {...dragProps(cases, setCases, c.id)}>
                  <span className="grip"><GripVertical size={14} /></span>
                  <div className="ae-body">
                    <strong style={{ color: "var(--y)" }}>{c.client}</strong> — {c.metric} / {c.time}
                  </div>
                  <button className="btnD" onClick={() => { const u = cases.filter((x) => x.id !== c.id); setCases(u); save(clients, team, services, u, testimonials, credentials); }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "testimonials" && (
          <div>
            <h3>Добави отзив</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              <input className="ai" value={nt.name} onChange={(e) => setNt({ ...nt, name: e.target.value })} placeholder="Име" />
              <input className="ai" value={nt.role} onChange={(e) => setNt({ ...nt, role: e.target.value })} placeholder="Бизнес / роля" />
              <input className="ai" style={{ minWidth: 320 }} value={nt.quote} onChange={(e) => setNt({ ...nt, quote: e.target.value })} placeholder="Отзив (цитат)" />
              <button className="btn btnSm" onClick={() => {
                if (!nt.name || !nt.quote) return;
                const u = [...testimonials, { ...nt, id: Date.now() }];
                setTestimonials(u); save(clients, team, services, cases, u, credentials); setNt({ name: "", role: "", quote: "" });
              }}><Plus size={12} /> Добави</button>
            </div>
            {(nt.name || nt.quote) && (
              <div className="adm-preview">
                <div className="adm-preview-lbl"><Eye size={12} /> PREVIEW</div>
                <div className="ts-card" style={{ maxWidth: 360 }}>
                  <Quote size={22} className="ts-q" />
                  <p className="ts-text">{nt.quote || "..."}</p>
                  <div className="ts-meta">
                    <div className="ts-name">{nt.name || "Име"}</div>
                    <div className="ts-role">{nt.role || "Роля"}</div>
                  </div>
                </div>
              </div>
            )}
            <h3>Подредба (drag &amp; drop)</h3>
            <div className="al">
              {testimonials.map((t) => (
                <div key={t.id} className="ae" {...dragProps(testimonials, setTestimonials, t.id)}>
                  <span className="grip"><GripVertical size={14} /></span>
                  <div className="ae-body">
                    <strong>{t.name}</strong> — <span style={{ color: "var(--y)" }}>{t.role}</span>
                    <br /><span style={{ color: "var(--g)", fontSize: 10 }}>{t.quote.slice(0, 80)}{t.quote.length > 80 ? "..." : ""}</span>
                  </div>
                  <button className="btnD" onClick={() => { const u = testimonials.filter((x) => x.id !== t.id); setTestimonials(u); save(clients, team, services, cases, u, credentials); }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Credit demo: its own app, no PROFITBRAND nav/footer/modal.
  if (isCreditPage(page)) return <CreditApp page={page} nav={nav} />;

  return (
    <div className="Z">
      <nav className="N">
        <div className="NL U" onClick={() => nav("home")}>PROFITBRAND</div>
        <div className="NR">
          <a href="#team" onClick={(e) => { e.preventDefault(); scrollTo("team"); }}>За нас</a>
          <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }}>Услуги</a>
          <a href="/chatgpt-ads" className="nav-hot" onClick={(e) => { e.preventDefault(); nav("chatgpt"); }}>ChatGPT Ads</a>
          <a href="#process" onClick={(e) => { e.preventDefault(); scrollTo("process"); }}>Процес</a>
          <a href="#cases" onClick={(e) => { e.preventDefault(); scrollTo("cases"); }}>Резултати</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }}>Въпроси</a>
          <button className="btn btnSm" onClick={() => setShowAudit(true)}>Консултация</button>
        </div>
        <button className="mob" aria-label="Меню" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <div className={`mm ${menuOpen ? "o" : ""}`}>
        <a href="/" onClick={(e) => { e.preventDefault(); setMenuOpen(false); nav("home"); }}>Начало</a>
        <a href="#team" onClick={(e) => { e.preventDefault(); scrollTo("team"); }}>За нас</a>
        <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }}>Услуги</a>
        <a href="/chatgpt-ads" onClick={(e) => { e.preventDefault(); nav("chatgpt"); }}>ChatGPT Ads</a>
        <a href="#process" onClick={(e) => { e.preventDefault(); scrollTo("process"); }}>Процес</a>
        <a href="#cases" onClick={(e) => { e.preventDefault(); scrollTo("cases"); }}>Резултати</a>
        <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }}>Въпроси</a>
        <button className="btn" onClick={() => { setMenuOpen(false); setShowAudit(true); }}>Консултация</button>
      </div>

      {page === "home" && renderHome()}
      {page === "admin" && renderAdmin()}
      {page === "chatgpt" && <ChatGptAds nav={nav} />}

      <footer className="ft">
        <div className="cp">© 2025 PROFITBRAND. Всички права запазени.</div>
        <div className="lk">
          <a href="/" onClick={(e) => { e.preventDefault(); nav("home"); }}>Начало</a>
          <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }}>Услуги</a>
          <a href="/chatgpt-ads" onClick={(e) => { e.preventDefault(); nav("chatgpt"); }}>ChatGPT Ads</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Контакт</a>
        </div>
      </footer>

      {showAudit && (
        <div className="mo" onClick={(e) => e.target.className.includes("mo ") && setShowAudit(false)}>
          <div className="mo-box">
            <button className="mo-x" aria-label="Затвори" onClick={() => setShowAudit(false)}><X size={20} /></button>
            <h3 className="U" style={{ fontSize: 16, marginBottom: 4 }}>Безплатна стратегия за растеж</h3>
            <p style={{ color: "var(--g2)", fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
              30 минути. Ще ти покажем къде губиш пари и как да скалираш. Без ангажимент. Без продажбени трикове.
            </p>
            <div className="fg"><label>Име</label>
              <input value={audit.name} onChange={(e) => setAudit({ ...audit, name: e.target.value })} placeholder="Твоето име" />
            </div>
            <div className="fg"><label>Email</label>
              <input value={audit.email} onChange={(e) => setAudit({ ...audit, email: e.target.value })} placeholder="email@example.com" />
            </div>
            <div className="fg"><label>Сайт на бизнеса</label>
              <input value={audit.web} onChange={(e) => setAudit({ ...audit, web: e.target.value })} placeholder="https://yoursite.com" />
            </div>
            <button className="btn" style={{ width: "100%" }} onClick={() => { alert("Благодаря! Ще се свържем с теб до 24 часа."); setShowAudit(false); }}>
              Искам безплатна стратегия <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
