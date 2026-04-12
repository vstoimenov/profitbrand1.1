import { useState, useEffect, useRef } from "react";
import { HeroGeometric } from "./components/ui/shape-landing-hero";

// ─── TYPEWRITER ─────────────────────────────
function Typewriter({ words, speed = 100, pause = 2000 }) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx];
    const t = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, charIdx + 1));
        if (charIdx + 1 === word.length) setTimeout(() => setDeleting(true), pause);
        else setCharIdx(charIdx + 1);
      } else {
        setText(word.slice(0, charIdx));
        if (charIdx === 0) { setDeleting(false); setWordIdx((wordIdx + 1) % words.length); }
        else setCharIdx(charIdx - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return <span className="tw">{text}<span className="cur">|</span></span>;
}

// ─── COUNTER ─────────────────────────────
function Counter({ end, suffix = "", duration = 2200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const step = (n) => {
          const p = Math.min((n - s) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Number.isInteger(end) ? Math.round(ease * end) : parseFloat((ease * end).toFixed(1)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── DATA ─────────────────────────────
const systemSteps = [
  {
    icon: "🔍", letter: "А", label: "А — Първо", title: "Анализ & Blueprint",
    desc: "Влизаме в бизнеса ви и правим пълен одит — къде губите пари, кой е идеалният клиент, какво прави конкуренцията. Създаваме PROFITBRAND Blueprint — цялостна стратегия, адаптирана 100% към вас.",
    tags: ["Оперативен одит", "Целева аудитория", "Конкурентен анализ"],
    details: ["Анализ на бизнес модела и процесите", "Deep dive в клиентския профил — кой купува, защо, какво му боли", "Конкурентен landscape и позициониране", "Бюджетен план с очакван ROI за всеки канал", "Стратегия за фуния от awareness до conversion"]
  },
  {
    icon: "⚙️", letter: "И", label: "И — Второ", title: "Изграждане & Инфраструктура",
    desc: "Изграждаме цялата дигитална инфраструктура — сайт, landing pages, CRM, email фунии, AI автоматизации, видео съдържание. Всичко, от което бизнесът ви има нужда.",
    tags: ["Платформи", "AI системи", "Съдържание"],
    details: ["Сайтове, landing pages и фунии за конверсии", "CRM интеграции и автоматизирани процеси", "AI Voice Agents и Customer Support", "Видео и рекламно съдържание, оптимизирано за продажби", "Email nurture последователности"]
  },
  {
    icon: "🚀", letter: "Р", label: "Р — Трето", title: "Растеж & Скалиране",
    desc: "Пускаме кампаниите (Meta, Google, TikTok Ads), оптимизираме в реално време, скалираме това, което работи. Всеки месец — повече leads, повече продажби, нови пазари.",
    tags: ["Перформанс Ads", "Оптимизация", "Нови пазари"],
    details: ["Meta Ads, Google Ads, TikTok Ads кампании", "Седмични отчети и data-driven оптимизация", "A/B тестове на креативи, аудитории и оферти", "Стратегия за международно скалиране", "Месечни стратегически calls с екипа"]
  },
];

const processSteps = [
  { num: "01", icon: "📞", title: "Безплатна Консултация", desc: "Преценяваме с какво и как можем да помогнем. Разбираме бизнеса, целите и ограниченията ви.", details: ["Кой е идеалният ви клиент и какво го спира", "Къде \"изтичат\" leads-овете в процеса", "Кои канали имат най-голям потенциал за вас", "Какъв бюджет е реалистичен за целите ви"] },
  { num: "02", icon: "📋", title: "Персонално Предложение", desc: "Изпращаме предложение, адаптирано към вашите нужди. Условията се договарят индивидуално.", details: ["Обхват: Blueprint + кампании + автоматизации", "Времева рамка и KPI (CPL, ROAS, leads)", "Финансови параметри — договаряме се като партньори", "Отговорности, активи и срокове"] },
  { num: "03", icon: "⚡", title: "Имплементация на системата АИР", desc: "Изграждаме инфраструктурата, пускаме кампаниите и започваме да генерираме резултати.", details: ["Анализ → Изграждане → Растеж (циклично)", "Тестове + оптимизация на всеки етап", "Седмични отчети и корекции по данни", "Скалиране на работещите канали"] },
];

const caseStudies = [
  { client: "E-COMMERCE БРАНД", problem: "ROAS 1.2 при 8,000 лв./мес. бюджет — губеха пари.", result: "ROAS 4.7 за 60 дни — 4x повече приходи при същия бюджет.", metric: "4.7x", metricLabel: "ROAS", time: "60 дни" },
  { client: "ЛОКАЛЕН БИЗНЕС", problem: "Нулево онлайн присъствие, зависимост от \"от уста на уста\".", result: "127 квалифицирани заявки за първия месец. Пълен график за 3 месеца.", metric: "127", metricLabel: "ЗАЯВКИ", time: "30 дни" },
  { client: "B2B КОМПАНИЯ", problem: "70% от времето на екипа — студени обаждания без резултат.", result: "AI квалифицира leads автоматично. Екипът говори само с готови клиенти.", metric: "70%", metricLabel: "СПЕСТЕНО ВРЕМЕ", time: "45 дни" },
];

const services = [
  { icon: "⚡", title: "ПЕРФОРМАНС РЕКЛАМА", desc: "Meta, Google, TikTok Ads — оптимизирани за продажби." },
  { icon: "🔍", title: "ОПЕРАТИВЕН ОДИТ", desc: "Намираме къде губите пари СЛЕД маркетинга." },
  { icon: "🤖", title: "AI АВТОМАТИЗАЦИИ", desc: "Voice Agents, Customer Support, Video Generate." },
  { icon: "🌍", title: "МЕЖДУНАРОДНО СКАЛИРАНЕ", desc: "Доказани стратегии за нови пазари." },
  { icon: "🎬", title: "ВИДЕО & СЪДЪРЖАНИЕ", desc: "Клипове, създадени да конвертират." },
  { icon: "✉️", title: "EMAIL ФУНИИ", desc: "Автоматизирани последователности за продажби." },
  { icon: "⭐", title: "БРАНД ИДЕНТИЧНОСТ", desc: "Позициониране, което внушава доверие." },
  { icon: "⚙️", title: "ПЛАТФОРМИ & СИСТЕМИ", desc: "Сайтове, фунии, CRM интеграции." },
  { icon: "🎓", title: "ОБУЧЕНИЕ НА ЕКИПИ", desc: "Предаваме знания, за да не зависите от нас." },
  { icon: "🎙️", title: "АУДИО ПРОДУКЦИЯ", desc: "Подкасти и аудио брандинг." },
  { icon: "📊", title: "МАРКЕТИНГ СТРАТЕГИЯ", desc: "План: кой е клиентът, как го намираме." },
  { icon: "🎯", title: "ПЛАТЕНО РЕКЛАМИРАНЕ", desc: "Data-driven с фокус ROI." },
];

const faqs = [
  { q: "Колко бързо ще видя резултати?", a: "Първите leads — до 14 дни. Пълната система работи оптимално до 60-90 дни." },
  { q: "Какво ако вече работя с друга агенция?", a: "Повечето клиенти идват точно затова. Правим безплатен одит и показваме какво може да се подобри." },
  { q: "Трябва ли голям бюджет?", a: "Минимум 2,000 лв./мес. за реклама. Под тази сума не гарантираме значим резултат." },
  { q: "Какво точно получавам?", a: "Цялостна система — стратегия, кампании, съдържание, автоматизации, одит. Всичко с един екип." },
  { q: "Как се заплаща?", a: "Условията се договарят индивидуално за всеки партньор. Вярваме, че всеки бизнес е различен и заслужава персонален подход." },
];

const defaultClients = [{ id: 1, name: "Client 1" }, { id: 2, name: "Client 2" }, { id: 3, name: "Client 3" }, { id: 4, name: "Client 4" }];
const defaultTeam = [
  { id: 1, name: "Иван Петров", role: "CEO & Founder", bio: "10+ години в перформанс маркетинг. Изградил системи, генериращи милиони." },
  { id: 2, name: "Мария Георгиева", role: "Head of Strategy", bio: "Експерт по скалиране. Извела 15+ бизнеса на международни пазари." },
];

// ─── MAIN ─────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [clients, setClients] = useState(defaultClients);
  const [team, setTeam] = useState(defaultTeam);
  const [nc, setNc] = useState({ name: "", logo: "" });
  const [nm, setNm] = useState({ name: "", role: "", bio: "" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", biz: "", msg: "" });
  const [audit, setAudit] = useState({ name: "", email: "", web: "" });
  const [showAudit, setShowAudit] = useState(false);
  const [vis, setVis] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [openProcess, setOpenProcess] = useState(null);
  const [openSystem, setOpenSystem] = useState(null);

  useEffect(() => { try { const d = JSON.parse(localStorage.getItem("pb4")); if (d?.c) setClients(d.c); if (d?.t) setTeam(d.t); } catch {} }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) setVis(p => ({ ...p, [x.target.dataset.v]: true })); }), { threshold: 0.08 });
    setTimeout(() => document.querySelectorAll("[data-v]").forEach(el => obs.observe(el)), 120);
    return () => obs.disconnect();
  }, [page]);

  const nav = p => { setPage(p); setMenuOpen(false); window.scrollTo?.(0, 0); setVis({}); };
  const sv = (c, t) => { try { localStorage.setItem("pb4", JSON.stringify({ c, t })); } catch {} };
  const f = (id, d = 0) => ({ "data-v": id, style: { opacity: vis[id] ? 1 : 0, transform: vis[id] ? "translateY(0)" : "translateY(40px)", transition: `all .75s cubic-bezier(.16,1,.3,1) ${d}s` } });

  const css = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
:root{--y:#FFD600;--yD:#E6C200;--b:#080810;--b2:#0D0D18;--b3:#13131F;--b4:#1A1A28;--w:#FFF;--g:#707088;--g2:#9999B0;--r:#FF4455}
*{margin:0;padding:0;box-sizing:border-box}
.Z{font-family:'Outfit',sans-serif;color:var(--w);background:var(--b);min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
.U{font-family:'Unbounded',sans-serif}

/* cursor */
.tw{color:var(--y)}
.cur{color:var(--y);animation:blink 1s infinite}
@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* NAV */
.N{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(8,8,16,.85);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,214,0,.05)}
.NL{font-family:'Unbounded';font-weight:900;font-size:18px;cursor:pointer;background:linear-gradient(135deg,var(--w),var(--y));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.NR{display:flex;gap:24px;align-items:center}
.NR a{color:var(--g2);text-decoration:none;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:color .3s}
.NR a:hover{color:var(--y)}
.btn{background:var(--y);color:var(--b);border:none;padding:12px 28px;font-family:'Unbounded';font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border-radius:8px;transition:all .3s;white-space:nowrap}
.btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,214,0,.3)}
.btn2{background:transparent;border:2px solid var(--y);color:var(--y);padding:12px 28px;font-family:'Unbounded';font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border-radius:8px;transition:all .3s;white-space:nowrap}
.btn2:hover{background:var(--y);color:var(--b)}
.mob{display:none;background:none;border:none;color:var(--y);font-size:28px;cursor:pointer}
.mm{display:none;position:fixed;inset:0;background:rgba(8,8,16,.97);z-index:99;flex-direction:column;align-items:center;justify-content:center;gap:28px}
.mm.o{display:flex}
.mm a{font-family:'Unbounded';font-size:20px;font-weight:700;color:var(--w);text-decoration:none;cursor:pointer}
.mm a:hover{color:var(--y)}

/* HERO */
.H{min-height:90vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:120px 24px 60px;position:relative;overflow:hidden}
.HB{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 40%,rgba(255,214,0,.06),transparent 70%)}
.HC{max-width:800px;position:relative;z-index:2}
.Hsub{color:var(--y);font-size:12px;font-weight:700;letter-spacing:4px;text-transform:uppercase;margin-bottom:20px}
.HC h1{font-family:'Unbounded';font-size:clamp(28px,5vw,56px);font-weight:900;line-height:1.1;letter-spacing:-1.5px;margin-bottom:24px}
.HC h1 em{font-style:normal;display:block;color:var(--y);min-height:1.2em;margin:8px 0}
.HP{font-size:17px;line-height:1.75;color:var(--g2);max-width:560px;margin:0 auto 36px}
.HP strong{color:var(--y);font-weight:600}
.HBs{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}

/* STATS */
.ST{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;padding:60px 48px;background:var(--b2);border-top:1px solid rgba(255,214,0,.06);border-bottom:1px solid rgba(255,214,0,.06)}
.SI{text-align:center}
.SIi{font-size:36px;margin-bottom:12px}
.SIs{color:var(--g);font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px}
.SIn{font-family:'Unbounded';font-size:clamp(32px,5vw,52px);font-weight:900;color:var(--y);text-shadow:0 0 40px rgba(255,214,0,.15)}
.SIl{font-size:13px;color:var(--g2);margin-top:4px;line-height:1.4}

/* SECTIONS */
.sec{padding:80px 48px;position:relative}
.sec.dk{background:var(--b2)}
.sec.dk2{background:var(--b3)}
.tg{color:var(--y);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;display:block}
.sec h2{font-family:'Unbounded';font-size:clamp(24px,3.8vw,44px);font-weight:800;margin-bottom:16px;letter-spacing:-1px;line-height:1.1;text-align:center}
.sec h2 em{font-style:normal;color:var(--y)}
.sdesc{font-size:16px;line-height:1.7;color:var(--g2);max-width:600px;margin:0 auto 40px;text-align:center}

/* SYSTEM 3-step */
.sys-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto}
.sys-card{background:var(--b3);border:1px solid rgba(255,255,255,.04);border-radius:20px;padding:36px 28px;transition:all .4s;cursor:pointer;position:relative;overflow:hidden}
.sys-card:hover{border-color:rgba(255,214,0,.2);transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,.3)}
.sys-top{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.sys-letter{font-family:'Unbounded';font-size:28px;font-weight:900;color:var(--y)}
.sys-label{font-size:11px;font-weight:700;color:var(--g);letter-spacing:1px;text-transform:uppercase}
.sys-card h3{font-family:'Unbounded';font-size:16px;font-weight:700;margin-bottom:10px}
.sys-card p{font-size:14px;color:var(--g2);line-height:1.65;margin-bottom:16px}
.sys-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.sys-tag{padding:4px 12px;border-radius:20px;background:rgba(255,214,0,.08);border:1px solid rgba(255,214,0,.12);font-size:11px;color:var(--y);font-weight:600}
.sys-details{max-height:0;overflow:hidden;transition:max-height .5s}
.sys-details.o{max-height:400px}
.sys-details ul{list-style:none;padding-top:12px;border-top:1px solid rgba(255,255,255,.06)}
.sys-details li{padding:8px 0;font-size:13px;color:var(--g2);display:flex;gap:10px;align-items:flex-start}
.sys-details li::before{content:'→';color:var(--y);font-weight:700;flex-shrink:0}
.sys-toggle{color:var(--y);font-size:12px;font-weight:700;cursor:pointer;display:inline-block}

/* PROCESS */
.proc{max-width:700px;margin:0 auto}
.proc-step{border:1px solid rgba(255,255,255,.05);border-radius:16px;margin-bottom:12px;background:var(--b3);overflow:hidden;transition:border .3s}
.proc-step:hover{border-color:rgba(255,214,0,.12)}
.proc-head{display:flex;align-items:center;gap:20px;padding:24px 28px;cursor:pointer}
.proc-num{font-family:'Unbounded';font-size:24px;font-weight:900;color:var(--y);min-width:40px}
.proc-icon{font-size:24px}
.proc-head h4{font-family:'Unbounded';font-size:14px;font-weight:700;flex:1}
.proc-head .arr{color:var(--y);font-size:20px;transition:transform .3s}
.proc-head .arr.o{transform:rotate(45deg)}
.proc-body{max-height:0;overflow:hidden;transition:max-height .4s;padding:0 28px}
.proc-body.o{max-height:400px;padding:0 28px 24px}
.proc-body p{color:var(--g2);font-size:14px;line-height:1.6;margin-bottom:12px}
.proc-body li{list-style:none;padding:6px 0;font-size:13px;color:var(--g2);display:flex;gap:8px}
.proc-body li::before{content:'✓';color:var(--y);font-weight:700}

/* CASES */
.cases{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;max-width:1100px;margin:0 auto}
.case{background:var(--b3);border:1px solid rgba(255,255,255,.04);border-radius:16px;padding:32px 24px;transition:all .3s}
.case:hover{border-color:rgba(255,214,0,.12);transform:translateY(-4px)}
.case-tag{font-family:'Unbounded';font-size:11px;font-weight:700;color:var(--y);letter-spacing:2px;margin-bottom:14px;display:block}
.case-lb{font-size:10px;font-weight:700;color:var(--g);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px}
.case p{font-size:13px;color:var(--g2);line-height:1.6;margin-bottom:12px}
.case-metrics{display:flex;gap:12px;padding-top:14px;border-top:1px solid rgba(255,255,255,.05)}
.case-m{padding:10px 16px;border-radius:10px;background:rgba(255,214,0,.05);border:1px solid rgba(255,214,0,.1);text-align:center}
.case-m .n{font-family:'Unbounded';font-size:22px;font-weight:800;color:var(--y)}
.case-m .l{font-size:9px;color:var(--g);letter-spacing:1px;text-transform:uppercase;margin-top:2px}

/* SERVICES */
.svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;max-width:1100px;margin:0 auto}
.svc{background:var(--b3);border:1px solid rgba(255,255,255,.03);border-radius:12px;padding:24px 20px;transition:all .3s}
.svc:hover{border-color:rgba(255,214,0,.15);transform:translateY(-3px)}
.svc .ic{font-size:24px;margin-bottom:10px}
.svc h4{font-family:'Unbounded';font-size:11px;font-weight:700;letter-spacing:.5px;margin-bottom:6px}
.svc p{font-size:12px;color:var(--g2);line-height:1.5}

/* GUARANTEE */
.guar{background:linear-gradient(135deg,rgba(255,214,0,.04),rgba(255,214,0,.01));border:1px solid rgba(255,214,0,.1);border-radius:20px;padding:48px;max-width:700px;margin:0 auto}
.guar h3{font-family:'Unbounded';font-size:20px;font-weight:800;margin-bottom:20px;text-align:center}
.guar h3 em{color:var(--y);font-style:normal}
.guar li{list-style:none;padding:12px 0;font-size:14px;color:var(--g2);line-height:1.6;display:flex;gap:12px;align-items:flex-start}
.guar .gc{width:24px;height:24px;min-width:24px;border-radius:6px;background:rgba(255,214,0,.1);color:var(--y);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;margin-top:2px}

/* FAQ */
.faq{max-width:700px;margin:0 auto}
.faq-i{border-bottom:1px solid rgba(255,255,255,.05)}
.faq-q{padding:20px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:15px;font-weight:600;transition:color .3s}
.faq-q:hover{color:var(--y)}
.faq-q .a{width:28px;height:28px;border-radius:6px;background:rgba(255,214,0,.08);display:flex;align-items:center;justify-content:center;color:var(--y);font-size:18px;transition:all .3s;flex-shrink:0}
.faq-q .a.o{background:var(--y);color:var(--b);transform:rotate(45deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s;font-size:14px;color:var(--g2);line-height:1.7}
.faq-a.o{max-height:200px;padding-bottom:16px}

/* CLIENTS */
.cl-grid{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}
.cl-i{width:150px;height:75px;border-radius:12px;background:var(--b3);border:1px solid rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--g);transition:all .3s}
.cl-i:hover{border-color:var(--y);color:var(--y);transform:translateY(-2px)}

/* TEAM */
.tm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;max-width:800px;margin:0 auto}
.tm{background:var(--b3);padding:32px 24px;border-radius:16px;border:1px solid rgba(255,255,255,.04);transition:border .3s;text-align:center}
.tm:hover{border-color:rgba(255,214,0,.12)}
.tm h4{font-family:'Unbounded';font-size:15px;font-weight:700;margin-bottom:4px}
.tm .rl{color:var(--y);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;display:block}
.tm p{color:var(--g2);font-size:13px;line-height:1.5}

/* CTA */
.cta{text-align:center;padding:80px 24px;position:relative}
.cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,214,0,.04),transparent 60%)}
.cta *{position:relative}

/* CONTACT */
.con-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;max-width:900px;margin:0 auto}
.fg{margin-bottom:16px}
.fg label{display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--g);margin-bottom:5px}
.fg input,.fg textarea{width:100%;background:var(--b3);border:1px solid rgba(255,255,255,.06);color:var(--w);padding:14px 16px;font-family:'Outfit';font-size:14px;outline:none;border-radius:10px;transition:border .3s}
.fg input:focus,.fg textarea:focus{border-color:var(--y)}
.fg textarea{min-height:100px;resize:vertical}

/* MODAL */
.mo{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
.mo-box{background:var(--b3);border:1px solid rgba(255,214,0,.1);border-radius:20px;padding:44px;max-width:460px;width:100%;position:relative}
.mo-x{position:absolute;top:14px;right:18px;background:none;border:none;color:var(--g);font-size:22px;cursor:pointer}

/* MARQUEE */
.mq{overflow:hidden;white-space:nowrap;padding:16px 0;background:var(--y)}
.mi{display:inline-block;animation:marquee 22s linear infinite}
.mi span{font-family:'Unbounded';font-size:11px;font-weight:800;color:var(--b);letter-spacing:4px;text-transform:uppercase;margin-right:40px}

/* FOOTER */
.ft{padding:48px;border-top:1px solid rgba(255,214,0,.06);text-align:center}
.ft .cp{color:var(--g);font-size:11px;margin-bottom:12px}
.ft .lk{display:flex;gap:20px;justify-content:center}
.ft .lk a{color:var(--g);font-size:11px;text-decoration:none;cursor:pointer}
.ft .lk a:hover{color:var(--y)}

/* ADMIN */
.ad{padding:120px 48px 60px}
.ad h2{font-family:'Unbounded';font-size:24px;font-weight:800;color:var(--y);margin-bottom:28px}
.ad h3{font-family:'Unbounded';font-size:14px;font-weight:700;margin:28px 0 12px}
.ai{background:var(--b3);border:1px solid rgba(255,255,255,.08);color:var(--w);padding:10px 14px;font-family:'Outfit';font-size:13px;outline:none;border-radius:8px;margin-right:6px;margin-bottom:6px;min-width:160px}
.ai:focus{border-color:var(--y)}
.al{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.ae{background:var(--b3);padding:8px 16px;border-radius:8px;display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.04);font-size:12px}
.ax{color:#f44;cursor:pointer;font-weight:700;font-size:16px;background:none;border:none}

@media(max-width:900px){
.NR{display:none}.mob{display:block}
.H{padding:120px 20px 60px}
.sec{padding:48px 20px}
.ST{grid-template-columns:1fr;gap:24px;padding:40px 20px}
.sys-grid{grid-template-columns:1fr}
.con-grid{grid-template-columns:1fr}
.HBs{flex-direction:column;align-items:stretch}
.ft{padding:32px 20px}
.ad{padding:100px 20px 40px}
.N{padding:12px 20px}
.guar{padding:28px 20px}
.mo-box{padding:28px 20px}
}
`;

  const Home = () => (
    <>
      {/* HERO */}
      <HeroGeometric
        badge="PERFORMANCE MARKETING AGENCY"
        title1="Ние Помагаме на Бизнеси"
        title2="Да Генерират Предвидим Растеж"
        subtitle="Изградихме система, генерираща 2M+ евро оборот за 2025г. — тествана с нашите пари. Сега я изграждаме за 12 бизнеса годишно."
        ctaText="Безплатна Консултация →"
        onCtaClick={()=>setShowAudit(true)}
      />

      {/* MARQUEE */}
      <div className="mq"><div className="mi">{[0,1].map(i=><span key={i}>META ADS • GOOGLE ADS • TIKTOK ADS • AI АВТОМАТИЗАЦИИ • ПЕРФОРМАНС • СКАЛИРАНЕ • ВИДЕО • EMAIL ФУНИИ •{" "}</span>)}</div></div>

      {/* STATS */}
      <section className="ST">
        <div className="SI" {...f("s0")}>
          <div className="SIi">💰</div>
          <div className="SIs">Над</div>
          <div className="SIn"><Counter end={2} suffix="M+ евро" /></div>
          <div className="SIl">Оборот за нас и нашите партньори</div>
        </div>
        <div className="SI" {...f("s1",0.1)}>
          <div className="SIi">🧪</div>
          <div className="SIs">Над</div>
          <div className="SIn"><Counter end={340} suffix="K €" /></div>
          <div className="SIl">Изхарчени за тестове с наши средства</div>
        </div>
        <div className="SI" {...f("s2",0.2)}>
          <div className="SIi">🚀</div>
          <div className="SIs">Над</div>
          <div className="SIn"><Counter end={50} suffix="+" /></div>
          <div className="SIl">Успешни проекта за последните 12 месеца</div>
        </div>
      </section>

      {/* SYSTEM АИР */}
      <section className="sec dk" style={{textAlign:"center"}}>
        <div {...f("sytg")} className="tg">Как го правим?</div>
        <h2 {...f("syh2",0.1)} className="U">Системата <em>АИР</em></h2>
        <p {...f("sysd",0.15)} className="sdesc">Три фази, през които минава всеки наш партньор. Всяка е критична за успеха.</p>
        <div className="sys-grid">
          {systemSteps.map((s,i) => (
            <div key={i} className="sys-card" {...f(`sy${i}`,i*0.08)} onClick={()=>setOpenSystem(openSystem===i?null:i)}>
              <div className="sys-top">
                <div className="sys-letter">{s.letter}{s.icon}</div>
              </div>
              <div className="sys-label">{s.label}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="sys-tags">{s.tags.map((t,j)=><span key={j} className="sys-tag">{t}</span>)}</div>
              <span className="sys-toggle">{openSystem===i?"Скрий ↑":"Виж детайли ⌄"}</span>
              <div className={`sys-details ${openSystem===i?"o":""}`}>
                <ul>{s.details.map((d,j)=><li key={j}>{d}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="sec" style={{textAlign:"center"}}>
        <div {...f("prtg")} className="tg">Процес</div>
        <h2 {...f("prh2",0.1)} className="U">Процес на <em>Работа</em>:</h2>
        <p {...f("prsd",0.15)} className="sdesc">Ясни стъпки, бързи обратни връзки и фокус върху резултата.</p>
        <div className="proc" {...f("prgr",0.2)}>
          {processSteps.map((s,i)=>(
            <div key={i} className="proc-step">
              <div className="proc-head" onClick={()=>setOpenProcess(openProcess===i?null:i)}>
                <div className="proc-num">{s.num}</div>
                <div className="proc-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <span className={`arr ${openProcess===i?"o":""}`}>+</span>
              </div>
              <div className={`proc-body ${openProcess===i?"o":""}`}>
                <p>{s.desc}</p>
                <ul>{s.details.map((d,j)=><li key={j}>{d}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="sec dk" style={{textAlign:"center"}}>
        <div {...f("cstg")} className="tg">Доказателства</div>
        <h2 {...f("csh2",0.1)} className="U">Числата говорят <em>сами</em>:</h2>
        <p {...f("cssd",0.15)} className="sdesc">Не показваме impressions. Показваме какво стана с банковата сметка.</p>
        <div className="cases" {...f("csgr",0.2)}>
          {caseStudies.map((c,i)=>(
            <div key={i} className="case">
              <span className="case-tag">{c.client}</span>
              <div className="case-lb">ПРОБЛЕМ</div>
              <p>{c.problem}</p>
              <div className="case-lb">РЕЗУЛТАТ</div>
              <p>{c.result}</p>
              <div className="case-metrics">
                <div className="case-m"><div className="n">{c.metric}</div><div className="l">{c.metricLabel}</div></div>
                <div className="case-m"><div className="n">{c.time}</div><div className="l">Време</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="sec" style={{textAlign:"center"}}>
        <div {...f("whtg")} className="tg">Кои сме ние</div>
        <h2 {...f("whh2",0.1)} className="U">Кои сме ние и защо<br/>да ни <em>вярвате</em>:</h2>
        <div {...f("whgr",0.2)} style={{maxWidth:700,margin:"40px auto 0",textAlign:"left"}}>
          <p style={{fontSize:16,color:"var(--g2)",lineHeight:1.8,marginBottom:20}}>
            <strong style={{color:"var(--y)",fontFamily:"Unbounded",fontSize:14}}>Собственици на перформанс агенция, генерирала над 2 000 000 евро оборот за 2025г.!</strong>
          </p>
          <p style={{fontSize:16,color:"var(--g2)",lineHeight:1.8,marginBottom:20}}>
            <strong style={{color:"var(--y)",fontFamily:"Unbounded",fontSize:14}}>Тествали сме стотици хиляди евро от собствени средства</strong> в различни стратегии, платформи и концепции, докато намерим формулите, които работят — и сега ги прилагаме за вас!
          </p>
          <p style={{fontSize:16,color:"var(--g2)",lineHeight:1.8,marginBottom:20}}>
            <strong style={{color:"var(--y)",fontFamily:"Unbounded",fontSize:14}}>Влизаме в бизнеса ви като съдружници</strong> — не като външен изпълнител. Когато вие растете, ние растем. Когато нещо не работи — губим и ние. Затова работим така, сякаш бизнесът е наш.
          </p>
          <p style={{fontSize:16,color:"var(--g2)",lineHeight:1.8,marginBottom:32}}>
            <strong style={{color:"var(--y)",fontFamily:"Unbounded",fontSize:14}}>Прилагаме завършен модел:</strong> от създаване на стратегия, през организация на процеса, до цялостна реализация. Получавате комплексен маркетинг екип, адаптиран към вашите цели.
          </p>
          {team.length > 0 && (
            <div className="tm-grid" style={{marginTop:20}}>
              {team.map(m=>(
                <div key={m.id} className="tm">
                  <h4>{m.name}</h4>
                  <span className="rl">{m.role}</span>
                  <p>{m.bio}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{textAlign:"center",marginTop:40}}>
            <button className="btn" onClick={()=>setShowAudit(true)}>Безплатна Консултация →</button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="sec dk" style={{textAlign:"center"}}>
        <div {...f("svtg")} className="tg">Инструменти</div>
        <h2 {...f("svh2",0.1)} className="U">12 инструмента. <em>Една система</em>.</h2>
        <p {...f("svsd",0.15)} className="sdesc">Всеки елемент е свързан с останалите.</p>
        <div className="svc-grid" {...f("svgr",0.2)}>
          {services.map((s,i)=>(
            <div key={i} className="svc">
              <div className="ic">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="sec" style={{textAlign:"center"}}>
        <div {...f("grtg")} className="tg">Гаранция</div>
        <h2 {...f("grh2",0.1)} className="U">Поемаме <em>риска</em> вместо вас.</h2>
        <p {...f("grsd",0.15)} className="sdesc">Повечето агенции искат 6-месечен договор без ангажимент. Ние — не.</p>
        <div className="guar" {...f("grgr",0.2)}>
          <h3 className="U">Нашата <em>Тройна Гаранция</em></h3>
          <ul>
            <li><span className="gc">✓</span>Ако не генерираме минимум 30 leads за 30 дни — работим безплатно докато го постигнем.</li>
            <li><span className="gc">✓</span>Без дългосрочни договори. Оставате, защото искате.</li>
            <li><span className="gc">✓</span>Пълна прозрачност — всеки лев, всяка метрика, в реално време.</li>
          </ul>
        </div>
      </section>

      {/* CLIENTS */}
      {clients.length > 0 && (
        <section className="sec dk" style={{textAlign:"center"}}>
          <div {...f("cltg")} className="tg">Партньори</div>
          <h2 {...f("clh2",0.1)} className="U">Работят с нас, защото <em>виждат резултат</em>.</h2>
          <div className="cl-grid" style={{marginTop:40}} {...f("clgr",0.2)}>
            {clients.map(c=><div key={c.id} className="cl-i">{c.logo?<img src={c.logo} alt={c.name} style={{maxWidth:100,maxHeight:40,objectFit:"contain",filter:"grayscale(1) brightness(2)"}}/>:c.name}</div>)}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="sec" style={{textAlign:"center"}}>
        <div {...f("fqtg")} className="tg">Въпроси</div>
        <h2 {...f("fqh2",0.1)} className="U">Знаем какво <em>си мислите</em>.</h2>
        <div className="faq" style={{marginTop:40,textAlign:"left"}} {...f("fqgr",0.2)}>
          {faqs.map((q,i)=>(
            <div key={i} className="faq-i">
              <div className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>{q.q}<span className={`a ${openFaq===i?"o":""}`}>+</span></div>
              <div className={`faq-a ${openFaq===i?"o":""}`}>{q.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="sec dk" style={{textAlign:"center"}}>
        <div {...f("cftg")} className="tg">Контакт</div>
        <h2 {...f("cfh2",0.1)} className="U">Имаш въпроси?<br/><em>Изпрати запитване!</em></h2>
        <div style={{maxWidth:500,margin:"40px auto 0",textAlign:"left"}} {...f("cfgr",0.2)}>
          <div className="fg"><label>Име</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Вашето име" /></div>
          <div className="fg"><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com" /></div>
          <div className="fg"><label>Телефон</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+359 ..." /></div>
          <div className="fg"><label>Съобщение</label><textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="Разкажете ни за бизнеса и целите ви..." /></div>
          <button className="btn" style={{width:"100%"}} onClick={()=>alert("Благодарим! Ще се свържем скоро.")}>Изпращане! →</button>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2 {...f("cth2")} className="U" style={{maxWidth:600,margin:"0 auto 16px"}}>Работим с <em>12 бизнеса годишно</em>.<br/>Остават ли места?</h2>
        <p {...f("ctp",0.1)} style={{color:"var(--g2)",maxWidth:440,margin:"0 auto 32px",fontSize:15,lineHeight:1.7}}>Заявете безплатна консултация и разберете за 15 минути дали можем да помогнем.</p>
        <button {...f("ctb",0.2)} className="btn" onClick={()=>setShowAudit(true)}>Безплатна Консултация →</button>
      </section>
    </>
  );

  const AdminPage = () => {
    if (!isAdmin) return (
      <div className="ad" style={{textAlign:"center",paddingTop:200}}>
        <h2>ADMIN ПАНЕЛ</h2>
        <p style={{color:"var(--g2)",marginBottom:16}}>Въведете парола</p>
        <input className="ai" type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&adminPass==="profit2025"&&setIsAdmin(true)} placeholder="Парола"/>
        <button className="btn" onClick={()=>adminPass==="profit2025"&&setIsAdmin(true)}>ВХОД</button>
        <p style={{color:"var(--g)",fontSize:11,marginTop:10}}>Парола: profit2025</p>
      </div>
    );
    return (
      <div className="ad">
        <h2>ADMIN ПАНЕЛ</h2>
        <h3>🏢 Клиенти</h3>
        <div style={{display:"flex",flexWrap:"wrap",alignItems:"center"}}>
          <input className="ai" value={nc.name} onChange={e=>setNc({...nc,name:e.target.value})} placeholder="Име"/>
          <input className="ai" value={nc.logo} onChange={e=>setNc({...nc,logo:e.target.value})} placeholder="URL лого"/>
          <button className="btn" onClick={()=>{if(!nc.name)return;const u=[...clients,{...nc,id:Date.now()}];setClients(u);sv(u,team);setNc({name:"",logo:""})}}>ДОБАВИ</button>
        </div>
        <div className="al">{clients.map(c=><div key={c.id} className="ae">{c.name}<button className="ax" onClick={()=>{const u=clients.filter(x=>x.id!==c.id);setClients(u);sv(u,team)}}>×</button></div>)}</div>
        <h3>👥 Екип</h3>
        <div style={{display:"flex",flexWrap:"wrap",alignItems:"center"}}>
          <input className="ai" value={nm.name} onChange={e=>setNm({...nm,name:e.target.value})} placeholder="Име"/>
          <input className="ai" value={nm.role} onChange={e=>setNm({...nm,role:e.target.value})} placeholder="Позиция"/>
          <input className="ai" value={nm.bio} onChange={e=>setNm({...nm,bio:e.target.value})} placeholder="Описание"/>
          <button className="btn" onClick={()=>{if(!nm.name)return;const u=[...team,{...nm,id:Date.now()}];setTeam(u);sv(clients,u);setNm({name:"",role:"",bio:""})}}>ДОБАВИ</button>
        </div>
        <div className="al">{team.map(m=><div key={m.id} className="ae">{m.name} — {m.role}<button className="ax" onClick={()=>{const u=team.filter(x=>x.id!==m.id);setTeam(u);sv(clients,u)}}>×</button></div>)}</div>
        <div style={{marginTop:32}}><button className="btn2" onClick={()=>{setIsAdmin(false);setAdminPass("")}}>ИЗХОД</button></div>
      </div>
    );
  };

  return (
    <div className="Z">
      <style>{css}</style>
      <nav className="N">
        <div className="NL U" onClick={()=>nav("home")}>PROFITBRAND</div>
        <div className="NR">
          <a onClick={()=>nav("home")}>Начало</a>
          <a onClick={()=>document.querySelector('.sec.dk')?.scrollIntoView({behavior:'smooth'})}>За нас</a>
          <a onClick={()=>nav("admin")} style={{opacity:.3,fontSize:9}}>•</a>
          <button className="btn" onClick={()=>setShowAudit(true)}>Безплатна Консултация</button>
        </div>
        <button className="mob" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?"✕":"☰"}</button>
      </nav>
      <div className={`mm ${menuOpen?"o":""}`}>
        <a onClick={()=>nav("home")}>Начало</a>
        <a onClick={()=>nav("admin")}>Admin</a>
        <button className="btn" onClick={()=>{setMenuOpen(false);setShowAudit(true)}}>Консултация</button>
      </div>

      {page==="home"&&<Home/>}
      {page==="admin"&&<AdminPage/>}

      <footer className="ft">
        <div className="cp">© 2025 PROFITBRAND. Всички права запазени.</div>
        <div className="lk">
          <a onClick={()=>nav("home")}>Начало</a>
          <a onClick={()=>nav("admin")}>Admin</a>
        </div>
      </footer>

      {showAudit&&(
        <div className="mo" onClick={e=>e.target.className.includes("mo ")&&setShowAudit(false)}>
          <div className="mo-box">
            <button className="mo-x" onClick={()=>setShowAudit(false)}>✕</button>
            <h3 className="U" style={{fontSize:18,marginBottom:4}}>Безплатна Консултация</h3>
            <p style={{color:"var(--g2)",fontSize:13,marginBottom:24,lineHeight:1.6}}>Ще анализираме бизнеса ви и ще покажем конкретно къде можете да растете. Без ангажимент.</p>
            <div className="fg"><label>Име</label><input value={audit.name} onChange={e=>setAudit({...audit,name:e.target.value})} placeholder="Вашето име"/></div>
            <div className="fg"><label>Email</label><input value={audit.email} onChange={e=>setAudit({...audit,email:e.target.value})} placeholder="email@example.com"/></div>
            <div className="fg"><label>Уебсайт</label><input value={audit.web} onChange={e=>setAudit({...audit,web:e.target.value})} placeholder="yoursite.com"/></div>
            <button className="btn" style={{width:"100%"}} onClick={()=>{alert("Заявката е изпратена!");setShowAudit(false)}}>Искам Безплатна Консултация →</button>
            <p style={{color:"var(--g)",fontSize:10,textAlign:"center",marginTop:10}}>Без спам. Без ангажимент. 100% безплатно.</p>
          </div>
        </div>
      )}
    </div>
  );
}
