import { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart3, Palette, Star, Target, GraduationCap, Video, Mic,
  DollarSign, Mail, Bot, Globe, Settings, Search, Wrench, Rocket,
  Check, Plus, X, ChevronDown, Menu, Eye, GripVertical, Handshake,
  TrendingUp, AlertCircle, Shield, Sparkles, ArrowRight, Clock,
  PhoneCall, FileText, Zap, Quote, Award,
} from "lucide-react";
import { HeroGeometric } from "./components/ui/shape-landing-hero";

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

function Typewriter({ words, className }) {
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const full = words[idx % words.length];
    const speed = del ? 40 : 85;
    const t = setTimeout(() => {
      if (!del) {
        setSub(full.slice(0, sub.length + 1));
        if (sub.length + 1 === full.length) setTimeout(() => setDel(true), 1400);
      } else {
        setSub(full.slice(0, sub.length - 1));
        if (sub.length - 1 === 0) {
          setDel(false);
          setIdx((i) => (i + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [sub, del, idx, words]);
  return (
    <span className={className}>
      {sub}
      <span className="tw-caret">|</span>
    </span>
  );
}

/* ---------- Default data ---------- */

const defaultServices = [
  { id: 1, icon: "BarChart3", title: "МАРКЕТИНГ КОНСУЛТИРАНЕ", desc: "Влизаме в бизнеса, анализираме процесите и изграждаме стратегия за реален растеж.", active: true },
  { id: 2, icon: "Palette", title: "РЕКЛАМНО СЪДЪРЖАНИЕ", desc: "Съдържание, което продава — реални конверсии.", active: true },
  { id: 3, icon: "Star", title: "БРАНД ИДЕНТИЧНОСТ", desc: "Позициониране, което внушава доверие от първата секунда.", active: true },
  { id: 4, icon: "Target", title: "РЕКЛАМНИ КАМПАНИИ", desc: "Meta, Google, TikTok Ads — перформанс с доказана възвръщаемост.", active: true },
  { id: 5, icon: "GraduationCap", title: "ОБУЧИТЕЛНИ КУРСОВЕ", desc: "Предаваме знанията си на екипа ви.", active: true },
  { id: 6, icon: "Video", title: "ВИДЕО ПРОДУКЦИЯ", desc: "Видео, оптимизирано за конверсии.", active: true },
  { id: 7, icon: "Mic", title: "АУДИО ПРОДУКЦИЯ", desc: "Подкасти, аудио реклами и звуков брандинг.", active: true },
  { id: 8, icon: "DollarSign", title: "HIGH TICKET СТРУКТУРА", desc: "Продажба на скъпи оферти с предвидим поток от клиенти.", active: true },
  { id: 9, icon: "Mail", title: "EMAIL МАРКЕТИНГ", desc: "Автоматизирани фунии, които конвертират.", active: true },
  { id: 10, icon: "Bot", title: "AI АВТОМАТИЗАЦИИ", desc: "AI Voice Agents, Customer Support, Video Generate.", active: true },
  { id: 11, icon: "Globe", title: "МЕЖДУНАРОДНО СКАЛИРАНЕ", desc: "Доказани стратегии за нови пазари.", active: true },
  { id: 12, icon: "Settings", title: "ПЛАТФОРМИ & СИСТЕМИ", desc: "Сайтове, фунии, CRM — цялата инфраструктура.", active: true },
];

const ICONS = {
  BarChart3, Palette, Star, Target, GraduationCap, Video, Mic,
  DollarSign, Mail, Bot, Globe, Settings, Search, Wrench, Rocket,
  Handshake, TrendingUp, AlertCircle, Shield, Sparkles,
  PhoneCall, FileText, Zap, Award,
};

function SvcIcon({ name, size = 28 }) {
  const Ico = ICONS[name] || Sparkles;
  return <Ico size={size} strokeWidth={2} />;
}

const defaultClients = [
  { id: 1, name: "Client 1", logo: "" },
  { id: 2, name: "Client 2", logo: "" },
  { id: 3, name: "Client 3", logo: "" },
  { id: 4, name: "Client 4", logo: "" },
  { id: 5, name: "Client 5", logo: "" },
  { id: 6, name: "Client 6", logo: "" },
];

const defaultTeam = [
  { id: 1, name: "Иван Петров", role: "CEO & Founder", bio: "10+ години в перформанс маркетинг.", photo: "" },
  { id: 2, name: "Мария Георгиева", role: "Head of Strategy", bio: "Експерт по скалиране на международни пазари.", photo: "" },
];

const defaultCases = [
  { id: 1, client: "E-COMMERCE БРАНД", problem: "ROAS 1.2 при 8,000 лв./мес. — горяха пари без да знаят защо.", result: "ROAS 4.7 за 60 дни. Същият бюджет — 4x повече приходи. Без смяна на продукт.", metric: "4.7x ROAS", time: "60 дни" },
  { id: 2, client: "ЛОКАЛЕН БИЗНЕС", problem: "Нулево онлайн присъствие. Разчитаха само на препоръки.", result: "127 квалифицирани заявки за 30 дни. Първите 20 от тях покриха цялата инвестиция.", metric: "127 заявки", time: "30 дни" },
  { id: 3, client: "B2B КОМПАНИЯ", problem: "70% от времето на екипа отиваше в студени обаждания. Продуктивността — нула.", result: "AI квалифицира leads автоматично. Екипът говори само с hot leads. 3x повече сделки.", metric: "3x сделки", time: "45 дни" },
];

const journeySteps = [
  { step: 0, title: "ВИЕ СТЕ ТУК", desc: "Интерес за съвместна работа." },
  { step: 1, title: "СРЕЩА & АНАЛИЗ", desc: "Установяваме целите и правим съвместен анализ на текущата ситуация." },
  { step: 2, title: "PROFITBRAND BLUEPRINT", desc: "Стратегически документ (40+ страници), който разглежда цялостна маркетингова стратегия за бизнеса." },
  { step: 3, title: "ПРЕДЛОЖЕНИЕ", desc: "Бизнес предложение за партньорство, нива на обслужване, финансови параметри и договорни условия." },
  { step: 4, title: "ИНФРАСТРУКТУРА", desc: "Достъп до комуникационните канали, изграждане на съвместна инфраструктура за работни практики и процеси на одобрение." },
  { step: 5, title: "СТАРТ НА СЪВМЕСТНА РАБОТА", desc: "Вашият бизнес е наш бизнес. Растем заедно." },
];

const systemSteps = [
  {
    icon: "Search",
    letter: "А",
    title: "Анализ & Blueprint",
    desc: "Влизаме в бизнеса и правим пълен одит — не само маркетинга, а целия оперативен процес. Къде губите пари? Къде клиентите отпадат СЛЕД маркетинга?",
    tags: ["Оперативен одит", "Целева аудитория", "Конкурентен анализ"],
    details: [
      "Анализ на бизнес модела и оперативните процеси",
      "Deep dive в клиентския профил",
      "Конкурентен landscape",
      "Бюджетен план с очакван ROI",
    ],
  },
  {
    icon: "Wrench",
    letter: "И",
    title: "Изграждане & Инфраструктура",
    desc: "Сайт, фунии, CRM, email системи, AI автоматизации, видео — цялата машина за растеж.",
    tags: ["Платформи", "AI системи", "Съдържание"],
    details: [
      "Сайтове, landing pages и фунии",
      "CRM интеграции и автоматизации",
      "AI Voice Agents и Support",
      "Видео и рекламно съдържание",
    ],
  },
  {
    icon: "Rocket",
    letter: "Р",
    title: "Растеж & Скалиране",
    desc: "Пускаме кампаниите, оптимизираме в реално време, скалираме. Повече leads, повече продажби, повече пазари.",
    tags: ["Перформанс Ads", "Оптимизация", "Нови пазари"],
    details: [
      "Meta, Google, TikTok Ads",
      "Седмични отчети",
      "A/B тестове",
      "Международно скалиране",
    ],
  },
];

const faqs = [
  { q: "Колко бързо ще видя резултати?", a: "Първите leads — до 14 дни. Пълна система, която работи предвидимо — 60-90 дни. Без „магия за 7 дни“." },
  { q: "Какво ако вече работя с агенция?", a: "Повечето клиенти идват точно затова. Правим безплатен одит — ако настоящата ви агенция върши работа, ще ви кажем. Ако не — ще ви покажем какво губите." },
  { q: "Как се заплаща?", a: "Условията се договарят индивидуално. Влизаме като съдружници — споделяме риска и резултата. Работим с максимум 12 бизнеса годишно, за да сме реално ангажирани." },
  { q: "Какво ви отличава?", a: "Не пускаме просто реклами. Влизаме в бизнеса, гледаме оперативните процеси, следваме клиента след маркетинга. Там повечето агенции спират — ние тепърва започваме." },
  { q: "Защо само 12 бизнеса?", a: "Защото когато влизаме като съдружници, трябва да имаме реален капацитет. Не продаваме час. Продаваме резултат." },
];

const workProcess = [
  {
    icon: "PhoneCall",
    step: "Стъпка 1",
    title: "Безплатна Консултация",
    desc: "Преценяваме с какво и как можем да ви помогнем. Разбираме вашия бизнес, цели и ограничения.",
    listLabel: "Какво изясняваме:",
    items: [
      "Кой е най-подходящият ви клиент и какво наистина го спира",
      "Кои оферти/услуги носят най-голям потенциал",
      "Къде „изтичат“ leads-ите и какво да поправим първо",
    ],
  },
  {
    icon: "FileText",
    step: "Стъпка 2",
    title: "Персонално Предложение",
    desc: "Изпращаме предложение спрямо вашите нужди и сключваме сделка, ако условията устройват и двете страни.",
    listLabel: "Какво включва:",
    items: [
      "Обхват: фуния/landing + реклами + email/автоматизации",
      "Времева рамка и KPI (CPL, CR, ROAS, записвания)",
      "Отговорности, активи и срокове",
    ],
  },
  {
    icon: "Zap",
    step: "Стъпка 3",
    title: "Имплементиране на АИР",
    desc: "Започваме със стратегически консултации 1:1, създаване на план и имплементация стъпка по стъпка.",
    listLabel: "Как работим:",
    items: [
      "Анализ → Изграждане → Растеж (циклично)",
      "Тестове и оптимизация по реални данни",
      "Седмични отчети и корекции на стратегията",
    ],
  },
];

const founderCredentials = [
  "Собственици на агенция, генерирала над 2 047 000 евро в онлайн оборот за последните 12 месеца — за нас и нашите партньори.",
  "Тествали сме над 340 000 евро от собствените си средства в реклами, фунии и автоматизации, докато намерим какво работи в реална среда.",
  "Работили сме с 50+ различни бизнеса — E-commerce, SaaS, локални услуги, B2B — и знаем какво се чупи в кой стадий на растежа.",
  "Изграждаме първата в България система, в която маркетинг агенцията споделя оперативния риск с клиента — не само пуска реклами, а влиза в бизнеса.",
];

const defaultTestimonials = [
  { id: 1, name: "Даниела К.", role: "E-commerce, мода", quote: "Благодаря за отдадеността, експертността и информацията, която ни дадохте. Уникални сте, защото трансформирате бизнеси, не просто пускате реклами. Такива честни и отдадени хора рядко се срещат." },
  { id: 2, name: "Мария Любенова", role: "B2B услуги", quote: "За първи път работех с агенция и съм силно впечатлена от професионализма. Дадохте много стойност и информацията беше поднесена на много разбираем език. Продължавайте все така автентично да горите във вашата мисия." },
  { id: 3, name: "Lily Rose", role: "Coach / High-ticket", quote: "Не съм се съмнявала, че ще дадете максимума. Феноменално добри сте. Безценно е цялото знание, което споделяте. Трансформацията се случи още в първия месец." },
  { id: 4, name: "Златка П.", role: "Local services", quote: "С огромна благодарност и вълнение искам да споделя колко ценен беше за мен онбординг процесът. Близо 6 часа дълбоко, ясно и човешко говорене за най-важната част в бизнеса — продаването, стратегията — но по начин, в който хората не се чувстват притиснати, а подкрепени да вземат решение и да действат навреме." },
  { id: 5, name: "Радостина Славова", role: "SaaS founder", quote: "Досега ви следях понякога и бях с впечатление, че сте знаещи и можещи. След първия месец работа съм толкова впечатлена от всеотдайността и ползите, които дадохте. За мен е напълно ясно, че вие сте хората, които могат да ми помогнат да успея." },
  { id: 6, name: "Галина", role: "Стартиращ бизнес", quote: "Благодаря за страхотния онбординг, научих много неща. Засега съм в начален етап — първо да тествам идеята си и после ще влезна в програмата за пълно скалиране." },
  { id: 7, name: "Гинка Генова", role: "Retail", quote: "Много благодаря за процеса, който беше интересен и надежден. Харесва ми, че предлагате реална подкрепа от вас като експерти. Това, което давате като знания, е с много висока стойност и предлагате нормална такса. Вярвам, че ще постигнем успех заедно." },
];

/* ---------- App ---------- */

export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminTab, setAdminTab] = useState("clients");
  const [clients, setClients] = useState(defaultClients);
  const [team, setTeam] = useState(defaultTeam);
  const [services, setServices] = useState(defaultServices);
  const [cases, setCases] = useState(defaultCases);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [nc, setNc] = useState({ name: "", logo: "" });
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
        if (d.c) setClients(d.c);
        if (d.t) setTeam(d.t);
        if (d.s) setServices(d.s);
        if (d.cs) setCases(d.cs);
        if (d.tm) setTestimonials(d.tm);
        if (d.cr) setCredentials(d.cr);
      }
    } catch {}
  }, []);

  const save = useCallback((c, t, s, cs, tm, cr) => {
    try { localStorage.setItem("pb5", JSON.stringify({ c, t, s, cs, tm, cr })); } catch {}
  }, []);

  // Scroll-reveal removed — elements always visible, no flash issues
  useEffect(() => {}, [page]);

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

  const nav = (p) => { setPage(p); setMenuOpen(false); window.scrollTo?.(0, 0); };
  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // ff() — always visible, no flash. data-v kept for potential future use.
  const ff = (id, d = 0) => ({ "data-v": id });
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

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
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
.trust-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:14px;
  max-width:1100px; margin:0 auto; }
.cl-logo { height:64px; display:flex; align-items:center; justify-content:center;
  background:var(--b3); border:1px solid rgba(255,255,255,.05); border-radius:10px;
  padding:0 14px; font-family:'Unbounded'; font-size:11px; font-weight:600;
  color:var(--g2); transition:border-color .25s ease, transform .25s ease, color .25s ease;
  text-align:center; line-height:1.2; }
.cl-logo:hover { border-color:rgba(255,214,0,.25); color:var(--y); transform:translateY(-2px); }
.cl-logo img { max-width:100%; max-height:36px; object-fit:contain;
  filter:grayscale(1) brightness(1.6) opacity(.75); transition:filter .25s ease; }
.cl-logo:hover img { filter:grayscale(0) brightness(1) opacity(1); }
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
.sec.yellow h2 em { color:#0D0D18; background:#080810; padding:0 10px; border-radius:6px; }
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

/* SERVICES — Anomaly style (yellow bg, white cards, black circles, yellow icons) */
.svc-grid {
  display:grid; grid-template-columns:repeat(5,1fr);
  gap:18px; max-width:1200px; margin:0 auto;
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
.svc p { font-size:11px; color:#3a3a4a; line-height:1.45; display:none; }

/* JOURNEY — stair-step like Anomaly */
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

/* WORK PROCESS */
.wp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px;
  max-width:1140px; margin:0 auto; }
.wp-card { background:var(--b3); border:1px solid rgba(255,255,255,.04);
  border-radius:16px; padding:30px 26px; transition:all .25s ease; }
.wp-card:hover { border-color:rgba(255,214,0,.2); transform:translateY(-4px);
  box-shadow:0 20px 40px -20px rgba(255,214,0,.12); }
.wp-head { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
.wp-ico { width:50px; height:50px; border-radius:12px;
  background:rgba(255,214,0,.08); border:1px solid rgba(255,214,0,.18);
  color:var(--y); display:flex; align-items:center; justify-content:center; }
.wp-step { font-family:'Unbounded'; font-size:10px; font-weight:800;
  color:var(--y); letter-spacing:2px; text-transform:uppercase; }
.wp-card h3 { font-family:'Unbounded'; font-size:16px; font-weight:800;
  margin-bottom:10px; line-height:1.25; }
.wp-card > p { font-size:13px; color:var(--g2); line-height:1.6; margin-bottom:16px; }
.wp-list-lbl { font-size:10px; font-weight:700; color:var(--y);
  letter-spacing:1.5px; text-transform:uppercase; margin-bottom:10px;
  padding-top:14px; border-top:1px solid rgba(255,214,0,.08); }
.wp-list { list-style:none; }
.wp-list li { display:flex; gap:10px; padding:6px 0; font-size:12px;
  color:var(--g2); line-height:1.5; align-items:flex-start; }
.wp-list li svg { color:var(--y); margin-top:3px; flex-shrink:0; }

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
  .svc-grid { grid-template-columns:repeat(3,1fr); }
  .sys-grid { grid-template-columns:1fr; gap:14px; }
  .wp-grid { grid-template-columns:1fr; }
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
  .sec { padding:56px 20px; }
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

  const Home = () => (
    <>
      <HeroGeometric
        badge="ПЕРФОРМАНС МАРКЕТИНГ АГЕНЦИЯ"
        title1="Ние помагаме на"
        typewriterWords={["E-commerce", "SaaS", "B2B", "Локални бизнеси", "Експерти"]}
        subtitle="Да изградят 6-цифрен и 7-цифрен оборот чрез предвидима маркетинг система. Тествана с нашите средства — над 2 047 000 евро в онлайн оборот за 12 месеца."
        ctaText="Безплатна Консултация"
        onCtaClick={() => setShowAudit(true)}
      />

      {clients.length > 0 && (
        <section className="trust" aria-label="Клиенти">
          <div className="trust-lbl">Доверяват ни се</div>
          <div className="trust-grid">
            {clients.map((c) => (
              <div key={c.id} className="cl-logo">
                {c.logo ? <img src={c.logo} alt={c.name} /> : c.name}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="sec dk" id="stats" style={{ paddingBottom: 30 }}>
        <div {...ff("sttg")} className="tg">Резултати</div>
        <h2 {...ff("sth2", 0.1)} className="U">
          Числата говорят <em>сами</em>.
        </h2>
        <div className="ST" style={{ marginTop: 32, padding: 0, background: "transparent", border: "none" }} {...ff("stg", 0.2)}>
          <div className="SI">
            <div className="SIi"><DollarSign size={34} /></div>
            <div className="SIs">Над</div>
            <div className="SIn"><Counter end={2} suffix="M+ €" /></div>
            <div className="SIl">Оборот онлайн за нас и нашите партньори</div>
          </div>
          <div className="SI">
            <div className="SIi"><TrendingUp size={34} /></div>
            <div className="SIs">Над</div>
            <div className="SIn"><Counter end={340} suffix="K €" /></div>
            <div className="SIl">Изхарчени за тестове и реклами, търсейки най-добрите решения</div>
          </div>
          <div className="SI">
            <div className="SIi"><Rocket size={34} /></div>
            <div className="SIs">Над</div>
            <div className="SIn"><Counter end={50} suffix="+" /></div>
            <div className="SIl">Различни бизнеса, с които сме направили пробив</div>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="sec dk" id="about">
        <div {...ff("ptg")} className="tg">Какво ни отличава</div>
        <h2 {...ff("ph2", 0.1)} className="U">
          Не пускаме просто реклами.<br />
          <em>Влизаме в бизнеса ви.</em>
        </h2>
        <p {...ff("psd", 0.15)} className="sdesc">
          Ако търсите поредната агенция за „постове и сторита“ — не сме ние. Влизаме в бизнеса,
          виждаме къде губите пари оперативно, и оправяме проблемите СЛЕД маркетинга. Защото трафикът
          без система е просто по-скъп начин да загубите клиенти.
        </p>
        <div className="pbox" {...ff("pbx", 0.2)}>
          <h3 className="U">Вашият бизнес е <em>наш бизнес</em>.</h3>
          <p>
            Работим като съдружници — споделяме риска и резултата. Ние ще докараме хора в бизнеса,
            но после идват оперативните пропуски, лошо обслужване, изтичащи клиенти. Затова не
            гледаме само рекламите — гледаме <strong style={{ color: "var(--y)" }}>целия бизнес</strong>.
          </p>
          <div className="pbox-grid">
            <div className="pbox-item">
              <div className="pi"><Search size={22} /></div>
              <h5>ОПЕРАТИВЕН ОДИТ</h5>
              <p>Намираме проблемите в процесите — не само в маркетинга.</p>
            </div>
            <div className="pbox-item">
              <div className="pi"><AlertCircle size={22} /></div>
              <h5>СЛЕД МАРКЕТИНГА</h5>
              <p>Какво се случва когато клиентът дойде? Там повечето агенции спират.</p>
            </div>
            <div className="pbox-item">
              <div className="pi"><Handshake size={22} /></div>
              <h5>ПАРТНЬОРИ</h5>
              <p>Споделяме риска. Условията — индивидуално за всеки.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services — Anomaly style yellow bg */}
      <section className="sec yellow" id="services">
        <div {...ff("svtg")} className="tg">Нашите услуги</div>
        <h2 {...ff("svh2", 0.1)} className="U">
          Всичко под <em>един покрив</em>.
        </h2>
        <p {...ff("svsd", 0.15)} className="sdesc">
          Не продаваме отделни услуги. Всичко работи като една система — от първия клик до последното плащане.
        </p>
        <div className="svc-grid" {...ff("svg", 0.2)}>
          {activeServices.map((s) => (
            <div key={s.id} className="svc" tabIndex={0}>
              <div className="ic"><SvcIcon name={s.icon} size={28} /></div>
              <h4>{s.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* System AIR */}
      <section className="sec dk" id="system">
        <div {...ff("sytg")} className="tg">Как го правим</div>
        <h2 {...ff("syh2", 0.1)} className="U">
          Системата <em>АИР</em>
        </h2>
        <p {...ff("sysd", 0.15)} className="sdesc">
          Анализ → Изграждане → Растеж. Три стъпки. Нула гадаене.
        </p>
        <div className="sys-grid" {...ff("syg", 0.2)}>
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

      {/* Work Process — funnel-masters style 3 steps */}
      <section className="sec" id="process">
        <div {...ff("wptg")} className="tg">Процес</div>
        <h2 {...ff("wph2", 0.1)} className="U">
          Процес на <em>работа</em>.
        </h2>
        <p {...ff("wpsd", 0.15)} className="sdesc">
          Ясни стъпки, бързи обратни връзки и фокус върху резултата.
        </p>
        <div className="wp-grid" {...ff("wpg", 0.2)}>
          {workProcess.map((p, i) => (
            <div key={i} className="wp-card">
              <div className="wp-head">
                <div className="wp-ico"><SvcIcon name={p.icon} size={28} /></div>
                <div className="wp-step">{p.step}</div>
              </div>
              <h3 className="U">{p.title}</h3>
              <p>{p.desc}</p>
              <div className="wp-list-lbl">{p.listLabel}</div>
              <ul className="wp-list">
                {p.items.map((it, j) => (
                  <li key={j}><Check size={14} /> <span>{it}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Onboarding Journey - Anomaly stair */}
      <section className="sec dk2" id="journey">
        <div {...ff("jrtg")} className="tg">Пътят на клиента</div>
        <h2 {...ff("jrh2", 0.1)} className="U">
          PROFITBRAND <em>ONBOARDING</em>
        </h2>
        <p {...ff("jrsd", 0.15)} className="sdesc">
          Знаете какво следва — от първия разговор до съвместна работа.
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
              points="100,460 300,460 300,390 500,390 500,320 700,320 700,250 900,250 900,180 1100,180 1100,110"
              fill="none"
              stroke="url(#jrline)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="jrn-grid">
            {journeySteps.map((j, i) => (
              <div key={i} className="jrn-step">
                <div className={`jrn-circle ${i === 0 ? "start" : ""}`}>
                  {i === 0 ? <>Вие<br />сте<br />тук</> : i}
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

      {/* Cases */}
      <section className="sec" id="cases">
        <div {...ff("cstg")} className="tg">Доказателства</div>
        <h2 {...ff("csh2", 0.1)} className="U">
          Числата говорят <em>сами</em>.
        </h2>
        <p {...ff("cssd", 0.15)} className="sdesc">
          Реални клиенти. Реални бюджети. Реални резултати.
        </p>
        <div className="cases" {...ff("csg", 0.2)}>
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

      {/* Founders / Why trust us — funnel-masters style */}
      <section className="sec dk" id="team">
        <div {...ff("fdtg")} className="tg">Кои сме ние</div>
        <h2 {...ff("fdh2", 0.1)} className="U">
          Защо да <em>ни вярвате</em>.
        </h2>
        <p {...ff("fdsd", 0.15)} className="sdesc">
          Не сме теоретици. Изградили сме това с наши пари, наш риск и наши клиенти.
        </p>
        <div className="fd-wrap" {...ff("fdg", 0.2)}>
          {team.length > 0 && (
            <div className="fd-people">
              {team.map((m) => (
                <div key={m.id} className="fd-person">
                  <div className="fd-avatar">
                    {m.photo ? <img src={m.photo} alt={m.name} /> : <SvcIcon name="Award" size={28} />}
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
              Безплатна Консултация <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="sec" id="testimonials">
          <div {...ff("tstg")} className="tg">Отзиви</div>
          <h2 {...ff("tsh2", 0.1)} className="U">
            Какво <em>казват</em> другите.
          </h2>
          <p {...ff("tssd", 0.15)} className="sdesc">
            Реални думи от реални хора. Не платени актьори.
          </p>
          <div className="ts-grid" {...ff("tsg", 0.2)}>
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

      {/* Guarantee */}
      <section className="sec" id="guarantee">
        <div {...ff("grtg")} className="tg">Гаранция</div>
        <h2 {...ff("grh2", 0.1)} className="U">
          Поемаме <em>риска</em>.
        </h2>
        <p {...ff("grsd", 0.15)} className="sdesc">
          Ако ние сме уверени в системата, защо вие да не сте?
        </p>
        <div className="guar" {...ff("grg", 0.2)}>
          <h3 className="U">Тройна <em>Гаранция</em></h3>
          <ul>
            <li><span className="gc"><Check size={14} /></span>30 квалифицирани leads за 30 дни — или работим безплатно докато ги докараме.</li>
            <li><span className="gc"><Check size={14} /></span>Без дългосрочни договори. Спирате когато искате.</li>
            <li><span className="gc"><Check size={14} /></span>Пълна прозрачност в реално време — виждате всяко изхарчено евро.</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec dk" id="faq">
        <div {...ff("fqtg")} className="tg">Въпроси</div>
        <h2 {...ff("fqh2", 0.1)} className="U">
          Знаем какво <em>си мислите</em>.
        </h2>
        <div className="faq" style={{ marginTop: 32 }} {...ff("fqg", 0.2)}>
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

      {/* Contact */}
      <section className="sec" id="contact">
        <div {...ff("cftg")} className="tg">Контакт</div>
        <h2 {...ff("cfh2", 0.1)} className="U">
          Готови? <em>Пишете ни.</em>
        </h2>
        <p {...ff("cfsd", 0.15)} className="sdesc">
          Отговаряме в рамките на 24 часа. Без ботове, без sales скриптове.
        </p>
        <div style={{ maxWidth: 460, margin: "32px auto 0", textAlign: "left" }} {...ff("cfg", 0.2)}>
          <div className="fg"><label>Име</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Вашето име" />
          </div>
          <div className="fg"><label>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
          </div>
          <div className="fg"><label>Телефон</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+359 ..." />
          </div>
          <div className="fg"><label>Съобщение</label>
            <textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="Разкажете за бизнеса и целите ви..." />
          </div>
          <button className="btn" style={{ width: "100%" }} onClick={() => alert("Благодарим!")}>
            Изпращане <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="cta sec dk">
        <h2 {...ff("cth2")} className="U" style={{ maxWidth: 600, margin: "0 auto 16px" }}>
          Работим с <em>12 бизнеса годишно</em>.
        </h2>
        <p {...ff("ctp", 0.1)} style={{ color: "var(--g2)", maxWidth: 460, margin: "0 auto 28px", fontSize: 14, lineHeight: 1.7 }}>
          Местата за 2026г. са ограничени. Ако сте сериозни за растеж — заявете консултацията сега.
        </p>
        <button {...ff("ctb", 0.2)} className="btn" onClick={() => setShowAudit(true)}>
          Безплатна Консултация <ArrowRight size={14} />
        </button>
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

  const AdminPage = () => {
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
            onKeyDown={(e) => e.key === "Enter" && adminPass === "profit2025" && setIsAdmin(true)}
            placeholder="Парола"
          />
          <button className="btn btnSm" onClick={() => adminPass === "profit2025" && setIsAdmin(true)}>ВХОД</button>
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
            { k: "clients", l: "Клиенти" },
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

        {adminTab === "clients" && (
          <div>
            <h3>Добави клиент (движеща се лента)</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              <input className="ai" value={nc.name} onChange={(e) => setNc({ ...nc, name: e.target.value })} placeholder="Име" />
              <input className="ai" value={nc.logo} onChange={(e) => setNc({ ...nc, logo: e.target.value })} placeholder="URL лого (опц.)" />
              <button className="btn btnSm" onClick={() => {
                if (!nc.name) return;
                const u = [...clients, { ...nc, id: Date.now() }];
                setClients(u); save(u, team, services, cases, testimonials, credentials); setNc({ name: "", logo: "" });
              }}><Plus size={12} /> Добави</button>
            </div>
            <h3>Подредба (drag & drop)</h3>
            <div className="al">
              {clients.map((c) => (
                <div key={c.id} className="ae" {...dragProps(clients, setClients, c.id)}>
                  <span className="grip"><GripVertical size={14} /></span>
                  <div className="ae-body">{c.name}{c.logo && <span style={{ color: "var(--g)", fontSize: 10 }}> — {c.logo}</span>}</div>
                  <button className="btnD" onClick={() => { const u = clients.filter((x) => x.id !== c.id); setClients(u); save(u, team, services, cases, testimonials, credentials); }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "team" && (
          <div>
            <h3>Добави член на екипа</h3>
            <p style={{ color: "var(--g)", fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>
              💡 За снимка: качи я в imgur.com → копирай direct link (.jpg/.png) → постави го в полето „URL снимка".
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              <input className="ai" value={nm.name} onChange={(e) => setNm({ ...nm, name: e.target.value })} placeholder="Име" />
              <input className="ai" value={nm.role} onChange={(e) => setNm({ ...nm, role: e.target.value })} placeholder="Позиция" />
              <input className="ai" style={{ minWidth: 240 }} value={nm.bio} onChange={(e) => setNm({ ...nm, bio: e.target.value })} placeholder="Описание" />
              <input className="ai" style={{ minWidth: 240 }} value={nm.photo} onChange={(e) => setNm({ ...nm, photo: e.target.value })} placeholder="URL снимка (опц.)" />
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

  return (
    <div className="Z">
      <nav className="N">
        <div className="NL U" onClick={() => nav("home")}>PROFITBRAND</div>
        <div className="NR">
          <a onClick={() => scrollTo("about")}>За нас</a>
          <a onClick={() => scrollTo("services")}>Услуги</a>
          <a onClick={() => scrollTo("system")}>АИР</a>
          <a onClick={() => scrollTo("process")}>Процес</a>
          <a onClick={() => scrollTo("testimonials")}>Отзиви</a>
          <a onClick={() => scrollTo("faq")}>FAQ</a>
          <button className="btn btnSm" onClick={() => setShowAudit(true)}>Консултация</button>
        </div>
        <button className="mob" aria-label="Меню" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <div className={`mm ${menuOpen ? "o" : ""}`}>
        <a onClick={() => { setMenuOpen(false); nav("home"); }}>Начало</a>
        <a onClick={() => scrollTo("services")}>Услуги</a>
        <a onClick={() => scrollTo("system")}>Системата АИР</a>
        <a onClick={() => scrollTo("process")}>Процес</a>
        <a onClick={() => scrollTo("testimonials")}>Отзиви</a>
        <a onClick={() => scrollTo("faq")}>FAQ</a>
        <a onClick={() => nav("admin")}>Admin</a>
        <button className="btn" onClick={() => { setMenuOpen(false); setShowAudit(true); }}>Консултация</button>
      </div>

      {page === "home" && <Home />}
      {page === "admin" && <AdminPage />}

      <footer className="ft">
        <div className="cp">© 2025 PROFITBRAND. Всички права запазени.</div>
        <div className="lk">
          <a onClick={() => nav("home")}>Начало</a>
          <a onClick={() => scrollTo("services")}>Услуги</a>
          <a onClick={() => scrollTo("contact")}>Контакт</a>
          <a onClick={() => nav("admin")} style={{ color: "var(--y)" }}>Admin</a>
        </div>
      </footer>

      {showAudit && (
        <div className="mo" onClick={(e) => e.target.className.includes("mo ") && setShowAudit(false)}>
          <div className="mo-box">
            <button className="mo-x" aria-label="Затвори" onClick={() => setShowAudit(false)}><X size={20} /></button>
            <h3 className="U" style={{ fontSize: 16, marginBottom: 4 }}>Безплатна Консултация</h3>
            <p style={{ color: "var(--g2)", fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
              Ще покажем къде можете да растете. Без ангажимент. Без sales скрипт.
            </p>
            <div className="fg"><label>Име</label>
              <input value={audit.name} onChange={(e) => setAudit({ ...audit, name: e.target.value })} placeholder="Вашето име" />
            </div>
            <div className="fg"><label>Email</label>
              <input value={audit.email} onChange={(e) => setAudit({ ...audit, email: e.target.value })} placeholder="email@example.com" />
            </div>
            <div className="fg"><label>Уебсайт</label>
              <input value={audit.web} onChange={(e) => setAudit({ ...audit, web: e.target.value })} placeholder="yoursite.com" />
            </div>
            <button className="btn" style={{ width: "100%" }} onClick={() => { alert("Заявката е изпратена!"); setShowAudit(false); }}>
              Искам Консултация <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
