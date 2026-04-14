import { useState, useEffect, useRef } from "react";
import { HeroGeometric } from "./components/ui/shape-landing-hero";

function Counter({ end, suffix = "", duration = 2200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const step = (n) => { const p = Math.min((n - s) / duration, 1); const ease = 1 - Math.pow(1 - p, 3); setVal(Number.isInteger(end) ? Math.round(ease * end) : parseFloat((ease * end).toFixed(1))); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const defaultServices = [
  { id: 1, icon: "📊", title: "МАРКЕТИНГ КОНСУЛТИРАНЕ", desc: "Влизаме в бизнеса, анализираме процесите и изграждаме стратегия за реален растеж.", active: true },
  { id: 2, icon: "🎨", title: "РЕКЛАМНО СЪДЪРЖАНИЕ", desc: "Съдържание, което продава — реални конверсии.", active: true },
  { id: 3, icon: "⭐", title: "БРАНД ИДЕНТИЧНОСТ", desc: "Позициониране, което внушава доверие от първата секунда.", active: true },
  { id: 4, icon: "🧩", title: "РЕКЛАМНИ КАМПАНИИ", desc: "Meta Ads, Google Ads, TikTok Ads — перформанс с доказана възвръщаемост.", active: true },
  { id: 5, icon: "🎓", title: "ОБУЧИТЕЛНИ КУРСОВЕ", desc: "Предаваме знанията си на екипа ви.", active: true },
  { id: 6, icon: "🎬", title: "ВИДЕО ПРОДУКЦИЯ", desc: "Видео, оптимизирано за конверсии.", active: true },
  { id: 7, icon: "🎙️", title: "АУДИО ПРОДУКЦИЯ", desc: "Подкасти, аудио реклами и звуков брандинг.", active: true },
  { id: 8, icon: "🎯", title: "ПЛАТЕНО РЕКЛАМИРАНЕ", desc: "Data-driven кампании с фокус ROI.", active: true },
  { id: 9, icon: "✉️", title: "EMAIL МАРКЕТИНГ", desc: "Автоматизирани фунии, които конвертират.", active: true },
  { id: 10, icon: "🤖", title: "AI АВТОМАТИЗАЦИИ", desc: "AI Voice Agents, Customer Support, Video Generate.", active: true },
  { id: 11, icon: "🌍", title: "МЕЖДУНАРОДНО СКАЛИРАНЕ", desc: "Доказани стратегии за нови пазари.", active: true },
  { id: 12, icon: "⚙️", title: "ПЛАТФОРМИ & СИСТЕМИ", desc: "Сайтове, фунии, CRM — цялата инфраструктура.", active: true },
];
const defaultClients = [{id:1,name:"Client 1",logo:""},{id:2,name:"Client 2",logo:""},{id:3,name:"Client 3",logo:""},{id:4,name:"Client 4",logo:""},{id:5,name:"Client 5",logo:""},{id:6,name:"Client 6",logo:""}];
const defaultTeam = [{id:1,name:"Иван Петров",role:"CEO & Founder",bio:"10+ години в перформанс маркетинг."},{id:2,name:"Мария Георгиева",role:"Head of Strategy",bio:"Експерт по скалиране на международни пазари."}];
const defaultCases = [{id:1,client:"E-COMMERCE БРАНД",problem:"ROAS 1.2 при 8,000 лв./мес.",result:"ROAS 4.7 за 60 дни — 4x повече приходи.",metric:"4.7x ROAS",time:"60 дни"},{id:2,client:"ЛОКАЛЕН БИЗНЕС",problem:"Нулево онлайн присъствие.",result:"127 квалифицирани заявки за 30 дни.",metric:"127 заявки",time:"30 дни"},{id:3,client:"B2B КОМПАНИЯ",problem:"70% от времето — студени обаждания.",result:"AI квалифицира leads автоматично.",metric:"70% спестено",time:"45 дни"}];
const journeySteps = [{step:0,title:"ВИЕ СТЕ ТУК",desc:"Интерес за съвместна работа"},{step:1,title:"СРЕЩА & АНАЛИЗ",desc:"Установяваме целите, анализираме ситуацията, влизаме в бизнеса."},{step:2,title:"BLUEPRINT",desc:"Цялостна маркетингова стратегия, адаптирана 100% към вас."},{step:3,title:"ПРЕДЛОЖЕНИЕ",desc:"Партньорство, нива на обслужване, финансови параметри."},{step:4,title:"ИНФРАСТРУКТУРА",desc:"Достъп до канали, съвместни процеси на одобрение."},{step:5,title:"СТАРТ",desc:"Вашият бизнес е наш бизнес. Растем заедно."}];
const systemSteps = [{icon:"🔍",letter:"А",title:"Анализ & Blueprint",desc:"Влизаме в бизнеса и правим пълен одит — не само маркетинга, а целия оперативен процес. Къде губите пари? Къде клиентите отпадат СЛЕД маркетинга?",tags:["Оперативен одит","Целева аудитория","Конкурентен анализ"],details:["Анализ на бизнес модела и оперативните процеси","Deep dive в клиентския профил","Конкурентен landscape","Бюджетен план с очакван ROI"]},{icon:"⚙️",letter:"И",title:"Изграждане & Инфраструктура",desc:"Сайт, фунии, CRM, email системи, AI автоматизации, видео — цялата машина за растеж.",tags:["Платформи","AI системи","Съдържание"],details:["Сайтове, landing pages и фунии","CRM интеграции и автоматизации","AI Voice Agents и Support","Видео и рекламно съдържание"]},{icon:"🚀",letter:"Р",title:"Растеж & Скалиране",desc:"Пускаме кампаниите, оптимизираме в реално време, скалираме. Повече leads, повече продажби.",tags:["Перформанс Ads","Оптимизация","Нови пазари"],details:["Meta, Google, TikTok Ads","Седмични отчети","A/B тестове","Международно скалиране"]}];
const faqs = [{q:"Колко бързо ще видя резултати?",a:"Първите leads — до 14 дни. Пълната система — 60-90 дни."},{q:"Какво ако вече работя с агенция?",a:"Повечето клиенти идват точно затова. Правим безплатен одит."},{q:"Как се заплаща?",a:"Условията се договарят индивидуално за всеки партньор."},{q:"Какво ви отличава?",a:"Влизаме като съдружници. Не пускаме само реклами — търсим проблемите оперативно и след маркетинга."}];

export default function App(){
  const[page,setPage]=useState("home");const[menuOpen,setMenuOpen]=useState(false);const[isAdmin,setIsAdmin]=useState(false);const[adminPass,setAdminPass]=useState("");const[adminTab,setAdminTab]=useState("clients");
  const[clients,setClients]=useState(defaultClients);const[team,setTeam]=useState(defaultTeam);const[services,setServices]=useState(defaultServices);const[cases,setCases]=useState(defaultCases);
  const[nc,setNc]=useState({name:"",logo:""});const[nm,setNm]=useState({name:"",role:"",bio:""});const[ns,setNs]=useState({icon:"",title:"",desc:""});const[ncase,setNcase]=useState({client:"",problem:"",result:"",metric:"",time:""});
  const[form,setForm]=useState({name:"",email:"",phone:"",msg:""});const[audit,setAudit]=useState({name:"",email:"",web:""});const[showAudit,setShowAudit]=useState(false);
  const[vis,setVis]=useState({});const[openFaq,setOpenFaq]=useState(null);const[openSys,setOpenSys]=useState(null);

  useEffect(()=>{try{const d=JSON.parse(localStorage.getItem("pb5"));if(d){if(d.c)setClients(d.c);if(d.t)setTeam(d.t);if(d.s)setServices(d.s);if(d.cs)setCases(d.cs)}}catch{}},[]);
  const save=(c,t,s,cs)=>{try{localStorage.setItem("pb5",JSON.stringify({c,t,s,cs}))}catch{}};
  useEffect(()=>{const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)setVis(p=>({...p,[x.target.dataset.v]:true}))}),{threshold:0.08});setTimeout(()=>document.querySelectorAll("[data-v]").forEach(el=>obs.observe(el)),120);return()=>obs.disconnect()},[page]);
  const nav=p=>{setPage(p);setMenuOpen(false);window.scrollTo?.(0,0);setVis({})};
  const ff=(id,d=0)=>({"data-v":id,style:{opacity:vis[id]?1:0,transform:vis[id]?"translateY(0)":"translateY(36px)",transition:`all .75s cubic-bezier(.16,1,.3,1) ${d}s`}});
  const activeServices=services.filter(s=>s.active);

  const css=`@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
:root{--y:#FFD600;--b:#080810;--b2:#0D0D18;--b3:#13131F;--w:#FFF;--g:#707088;--g2:#9999B0}
*{margin:0;padding:0;box-sizing:border-box}
.Z{font-family:'Outfit',sans-serif;color:var(--w);background:var(--b);min-height:100vh;overflow-x:hidden}
.U{font-family:'Unbounded',sans-serif}
@keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.N{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(8,8,16,.85);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,214,0,.05)}
.NL{font-family:'Unbounded';font-weight:900;font-size:18px;cursor:pointer;background:linear-gradient(135deg,var(--w),var(--y));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.NR{display:flex;gap:24px;align-items:center}
.NR a{color:var(--g2);text-decoration:none;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:color .3s}
.NR a:hover{color:var(--y)}
.btn{background:var(--y);color:var(--b);border:none;padding:12px 28px;font-family:'Unbounded';font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border-radius:8px;transition:all .3s;white-space:nowrap}
.btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,214,0,.3)}
.btn2{background:transparent;border:2px solid var(--y);color:var(--y);padding:12px 28px;font-family:'Unbounded';font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border-radius:8px;transition:all .3s;white-space:nowrap}
.btn2:hover{background:var(--y);color:var(--b)}
.btnSm{padding:8px 18px;font-size:10px;border-radius:6px}
.btnD{background:#FF4455;color:#fff;border:none;padding:6px 14px;font-family:'Outfit';font-weight:600;font-size:11px;cursor:pointer;border-radius:6px}
.mob{display:none;background:none;border:none;color:var(--y);font-size:28px;cursor:pointer}
.mm{display:none;position:fixed;inset:0;background:rgba(8,8,16,.97);z-index:99;flex-direction:column;align-items:center;justify-content:center;gap:28px}
.mm.o{display:flex}.mm a{font-family:'Unbounded';font-size:20px;font-weight:700;color:var(--w);text-decoration:none;cursor:pointer}.mm a:hover{color:var(--y)}
.cmq{overflow:hidden;white-space:nowrap;padding:24px 0;background:var(--b2);border-top:1px solid rgba(255,214,0,.06);border-bottom:1px solid rgba(255,214,0,.06)}
.cmi{display:inline-flex;animation:mq 25s linear infinite;align-items:center;gap:40px}
.cl-logo{min-width:140px;height:56px;display:flex;align-items:center;justify-content:center;background:var(--b3);border:1px solid rgba(255,255,255,.05);border-radius:10px;padding:0 24px;font-family:'Unbounded';font-size:11px;font-weight:600;color:var(--g);flex-shrink:0}
.cl-logo img{max-width:100px;max-height:34px;object-fit:contain;filter:grayscale(1) brightness(2)}
.sec{padding:80px 48px;position:relative}.sec.dk{background:var(--b2)}.sec.dk2{background:var(--b3)}
.tg{color:var(--y);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;display:block;text-align:center}
.sec h2{font-family:'Unbounded';font-size:clamp(22px,3.6vw,40px);font-weight:800;margin-bottom:14px;letter-spacing:-1px;line-height:1.1;text-align:center}
.sec h2 em{font-style:normal;color:var(--y)}
.sdesc{font-size:15px;line-height:1.7;color:var(--g2);max-width:580px;margin:0 auto 36px;text-align:center}
.svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;max-width:1100px;margin:0 auto}
.svc{background:var(--b3);border:1px solid rgba(255,255,255,.04);border-radius:14px;padding:24px 18px;transition:all .3s;text-align:center}
.svc:hover{border-color:rgba(255,214,0,.18);transform:translateY(-3px)}
.svc .ic{width:52px;height:52px;border-radius:50%;background:var(--b);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 12px;border:2px solid rgba(255,214,0,.15)}
.svc h4{font-family:'Unbounded';font-size:10px;font-weight:700;letter-spacing:.5px;margin-bottom:5px}
.svc p{font-size:11px;color:var(--g2);line-height:1.45}
.jrn{position:relative;max-width:1000px;margin:40px auto 0;padding:0 20px}
.jrn-line{position:absolute;top:36px;left:8%;right:8%;height:4px;background:linear-gradient(90deg,var(--y),rgba(255,214,0,.15));border-radius:2px;z-index:0}
.jrn-steps{display:flex;justify-content:space-between;position:relative;z-index:1}
.jrn-step{text-align:center;flex:1;max-width:150px}
.jrn-circle{width:48px;height:48px;border-radius:50%;background:var(--y);color:var(--b);font-family:'Unbounded';font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;box-shadow:0 0 20px rgba(255,214,0,.2);transition:all .3s}
.jrn-circle.start{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0;line-height:1.2}
.jrn-step:hover .jrn-circle{transform:scale(1.12);box-shadow:0 0 32px rgba(255,214,0,.4)}
.jrn-step h5{font-family:'Unbounded';font-size:9px;font-weight:700;color:var(--y);margin-bottom:3px}
.jrn-step p{font-size:10px;color:var(--g2);line-height:1.4}
.pbox{max-width:900px;margin:48px auto 0;padding:44px;border-radius:20px;background:linear-gradient(135deg,rgba(255,214,0,.05),rgba(255,214,0,.01));border:1px solid rgba(255,214,0,.1);text-align:center}
.pbox h3{font-family:'Unbounded';font-size:clamp(16px,2.2vw,24px);font-weight:800;margin-bottom:14px}.pbox h3 em{color:var(--y);font-style:normal}
.pbox>p{color:var(--g2);font-size:14px;line-height:1.7;max-width:640px;margin:0 auto}
.pbox-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:28px}
.pbox-item{padding:18px;border-radius:12px;background:rgba(255,214,0,.03);border:1px solid rgba(255,214,0,.07)}
.pbox-item .pi{font-size:22px;margin-bottom:6px}.pbox-item h5{font-family:'Unbounded';font-size:10px;font-weight:700;color:var(--y);margin-bottom:3px}.pbox-item p{font-size:11px;color:var(--g2);line-height:1.45}
.ST{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;padding:56px 48px;background:var(--b2);border-top:1px solid rgba(255,214,0,.06);border-bottom:1px solid rgba(255,214,0,.06)}
.SI{text-align:center}.SIi{font-size:32px;margin-bottom:6px}.SIs{color:var(--g);font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase}.SIn{font-family:'Unbounded';font-size:clamp(26px,4vw,44px);font-weight:900;color:var(--y)}.SIl{font-size:12px;color:var(--g2);margin-top:3px}
.sys-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1100px;margin:0 auto}
.sys-card{background:var(--b3);border:1px solid rgba(255,255,255,.04);border-radius:14px;padding:28px 22px;transition:all .3s;cursor:pointer}
.sys-card:hover{border-color:rgba(255,214,0,.18);transform:translateY(-3px)}
.sys-letter{font-family:'Unbounded';font-size:26px;font-weight:900;color:var(--y);margin-bottom:8px}
.sys-label{font-size:10px;font-weight:700;color:var(--g);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
.sys-card h3{font-family:'Unbounded';font-size:13px;font-weight:700;margin-bottom:6px}
.sys-card>p{font-size:12px;color:var(--g2);line-height:1.55;margin-bottom:10px}
.sys-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
.sys-tag{padding:3px 9px;border-radius:16px;background:rgba(255,214,0,.07);border:1px solid rgba(255,214,0,.1);font-size:10px;color:var(--y);font-weight:600}
.sys-det{max-height:0;overflow:hidden;transition:max-height .4s}.sys-det.o{max-height:250px}
.sys-det li{list-style:none;padding:4px 0;font-size:11px;color:var(--g2);display:flex;gap:6px}.sys-det li::before{content:'→';color:var(--y);font-weight:700}
.sys-tog{color:var(--y);font-size:10px;font-weight:700}
.cases{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;max-width:1100px;margin:0 auto}
.case{background:var(--b3);border:1px solid rgba(255,255,255,.04);border-radius:14px;padding:26px 22px;transition:all .3s}
.case:hover{border-color:rgba(255,214,0,.12);transform:translateY(-3px)}
.case-tag{font-family:'Unbounded';font-size:10px;font-weight:700;color:var(--y);letter-spacing:1.5px;margin-bottom:10px;display:block}
.case-lb{font-size:9px;font-weight:700;color:var(--g);letter-spacing:1px;text-transform:uppercase;margin-bottom:2px}
.case p{font-size:12px;color:var(--g2);line-height:1.5;margin-bottom:8px}
.case-metrics{display:flex;gap:8px;padding-top:10px;border-top:1px solid rgba(255,255,255,.04)}
.case-m{padding:7px 12px;border-radius:8px;background:rgba(255,214,0,.04);border:1px solid rgba(255,214,0,.07);text-align:center}
.case-m .n{font-family:'Unbounded';font-size:16px;font-weight:800;color:var(--y)}.case-m .l{font-size:8px;color:var(--g);letter-spacing:1px;text-transform:uppercase;margin-top:1px}
.guar{background:linear-gradient(135deg,rgba(255,214,0,.04),rgba(255,214,0,.01));border:1px solid rgba(255,214,0,.1);border-radius:18px;padding:40px;max-width:660px;margin:0 auto}
.guar h3{font-family:'Unbounded';font-size:16px;font-weight:800;margin-bottom:16px;text-align:center}.guar h3 em{color:var(--y);font-style:normal}
.guar li{list-style:none;padding:8px 0;font-size:13px;color:var(--g2);line-height:1.5;display:flex;gap:10px}
.guar .gc{width:20px;height:20px;min-width:20px;border-radius:5px;background:rgba(255,214,0,.1);color:var(--y);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;margin-top:2px}
.faq{max-width:660px;margin:0 auto}.faq-i{border-bottom:1px solid rgba(255,255,255,.04)}
.faq-q{padding:16px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:600;transition:color .3s}.faq-q:hover{color:var(--y)}
.faq-q .a{width:24px;height:24px;border-radius:5px;background:rgba(255,214,0,.07);display:flex;align-items:center;justify-content:center;color:var(--y);font-size:15px;transition:all .3s;flex-shrink:0}
.faq-q .a.o{background:var(--y);color:var(--b);transform:rotate(45deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s;font-size:13px;color:var(--g2);line-height:1.65}.faq-a.o{max-height:200px;padding-bottom:12px}
.tm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;max-width:700px;margin:0 auto}
.tm{background:var(--b3);padding:26px 20px;border-radius:14px;border:1px solid rgba(255,255,255,.04);text-align:center;transition:border .3s}.tm:hover{border-color:rgba(255,214,0,.12)}
.tm h4{font-family:'Unbounded';font-size:13px;font-weight:700;margin-bottom:3px}
.tm .rl{color:var(--y);font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:5px;display:block}
.tm p{color:var(--g2);font-size:11px;line-height:1.45}
.fg{margin-bottom:12px}.fg label{display:block;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--g);margin-bottom:4px}
.fg input,.fg textarea{width:100%;background:var(--b3);border:1px solid rgba(255,255,255,.06);color:var(--w);padding:11px 14px;font-family:'Outfit';font-size:13px;outline:none;border-radius:8px;transition:border .3s}
.fg input:focus,.fg textarea:focus{border-color:var(--y)}.fg textarea{min-height:80px;resize:vertical}
.cta{text-align:center;padding:72px 24px;position:relative}.cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,214,0,.04),transparent 60%)}.cta *{position:relative}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
.mo-box{background:var(--b3);border:1px solid rgba(255,214,0,.1);border-radius:18px;padding:36px;max-width:440px;width:100%;position:relative}
.mo-x{position:absolute;top:12px;right:16px;background:none;border:none;color:var(--g);font-size:20px;cursor:pointer}
.ft{padding:36px 48px;border-top:1px solid rgba(255,214,0,.06);text-align:center}.ft .cp{color:var(--g);font-size:10px;margin-bottom:6px}
.ft .lk{display:flex;gap:14px;justify-content:center}.ft .lk a{color:var(--g);font-size:10px;text-decoration:none;cursor:pointer}.ft .lk a:hover{color:var(--y)}
.adm{padding:100px 48px 60px}.adm h2{font-family:'Unbounded';font-size:22px;font-weight:800;color:var(--y);margin-bottom:20px}
.adm-tabs{display:flex;gap:6px;margin-bottom:24px;flex-wrap:wrap}
.adm-tab{padding:8px 16px;border-radius:8px;background:var(--b3);border:1px solid rgba(255,255,255,.06);font-family:'Unbounded';font-size:10px;font-weight:700;color:var(--g);cursor:pointer;transition:all .2s}
.adm-tab.act{background:var(--y);color:var(--b);border-color:var(--y)}.adm-tab:hover{border-color:var(--y)}
.adm h3{font-family:'Unbounded';font-size:12px;font-weight:700;margin:16px 0 10px;color:var(--g2)}
.ai{background:var(--b3);border:1px solid rgba(255,255,255,.08);color:var(--w);padding:9px 12px;font-family:'Outfit';font-size:12px;outline:none;border-radius:7px;margin-right:5px;margin-bottom:5px;min-width:140px}.ai:focus{border-color:var(--y)}
.al{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.ae{background:var(--b3);padding:8px 14px;border-radius:7px;display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.04);font-size:11px}
@media(max-width:900px){.NR{display:none}.mob{display:block}.sec{padding:48px 16px}.ST{grid-template-columns:1fr;gap:16px;padding:36px 16px}.sys-grid{grid-template-columns:1fr}.jrn-steps{flex-wrap:wrap;gap:16px;justify-content:center}.jrn-line{display:none}.pbox{padding:24px 14px}.pbox-grid{grid-template-columns:1fr}.ft{padding:24px 16px}.adm{padding:80px 14px 36px}.N{padding:12px 14px}.svc-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:500px){.svc-grid{grid-template-columns:1fr}}`;

  const Home=()=>(<>
    <HeroGeometric badge="PERFORMANCE MARKETING AGENCY" title1="Ние Помагаме на Бизнеси" title2="Да Генерират Предвидим Растеж" subtitle="Изградихме система, генерираща 2M+ евро оборот за 2025г. — тествана с нашите пари. Сега я изграждаме за 12 бизнеса годишно." ctaText="Безплатна Консултация →" onCtaClick={()=>setShowAudit(true)}/>
    {clients.length>0&&<div className="cmq"><div className="cmi">{[...clients,...clients,...clients].map((c,i)=><div key={i} className="cl-logo">{c.logo?<img src={c.logo} alt={c.name}/>:c.name}</div>)}</div></div>}
    <section className="ST"><div className="SI" {...ff("s0")}><div className="SIi">💰</div><div className="SIs">Над</div><div className="SIn"><Counter end={2} suffix="M+ евро"/></div><div className="SIl">Оборот за нас и партньорите ни</div></div><div className="SI" {...ff("s1",.1)}><div className="SIi">🧪</div><div className="SIs">Над</div><div className="SIn"><Counter end={340} suffix="K €"/></div><div className="SIl">Тествани с наши средства</div></div><div className="SI" {...ff("s2",.2)}><div className="SIi">🚀</div><div className="SIs">Над</div><div className="SIn"><Counter end={50} suffix="+"/></div><div className="SIl">Успешни проекта</div></div></section>
    <section className="sec dk"><div {...ff("ptg")} className="tg">Какво ни отличава</div><h2 {...ff("ph2",.1)} className="U">Не пускаме просто реклами.<br/><em>Влизаме в бизнеса ви.</em></h2><p {...ff("psd",.15)} className="sdesc">Не сме поредната агенция за постове и сторита. Влизаме в бизнеса, виждаме проблемите оперативно и търсим къде има проблеми СЛЕД маркетинга.</p>
      <div className="pbox" {...ff("pbx",.2)}><h3 className="U">Вашият бизнес е <em>наш бизнес</em>.</h3><p>Работим като съдружници. Ние ще докараме хора в бизнеса, но после идват проблемите — оперативни пропуски, лошо обслужване, изтичащи клиенти. Затова не гледаме само рекламите — гледаме <strong style={{color:"var(--y)"}}>целия бизнес</strong>.</p>
        <div className="pbox-grid"><div className="pbox-item"><div className="pi">🔍</div><h5>ОПЕРАТИВЕН ОДИТ</h5><p>Намираме проблемите в процесите — не само в маркетинга</p></div><div className="pbox-item"><div className="pi">🚧</div><h5>СЛЕД МАРКЕТИНГА</h5><p>Какво се случва когато клиентът дойде? Там повечето агенции спират.</p></div><div className="pbox-item"><div className="pi">🤝</div><h5>ПАРТНЬОРИ</h5><p>Споделяме риска. Условията — индивидуално за всеки.</p></div></div></div></section>
    <section className="sec" style={{textAlign:"center"}}><div {...ff("svtg")} className="tg">Нашите услуги</div><h2 {...ff("svh2",.1)} className="U">Всичко под <em>един покрив</em>.</h2><p {...ff("svsd",.15)} className="sdesc">Не продаваме отделни услуги — всичко работи като система.</p>
      <div className="svc-grid" {...ff("svg",.2)}>{activeServices.map(s=><div key={s.id} className="svc"><div className="ic">{s.icon}</div><h4>{s.title}</h4><p>{s.desc}</p></div>)}</div></section>
    <section className="sec dk" style={{textAlign:"center"}}><div {...ff("sytg")} className="tg">Как го правим?</div><h2 {...ff("syh2",.1)} className="U">Системата <em>АИР</em></h2><p {...ff("sysd",.15)} className="sdesc">Анализ → Изграждане → Растеж.</p>
      <div className="sys-grid" {...ff("syg",.2)}>{systemSteps.map((s,i)=><div key={i} className="sys-card" onClick={()=>setOpenSys(openSys===i?null:i)}><div className="sys-letter">{s.letter}{s.icon}</div><div className="sys-label">{["А — Първо","И — Второ","Р — Трето"][i]}</div><h3>{s.title}</h3><p>{s.desc}</p><div className="sys-tags">{s.tags.map((t,j)=><span key={j} className="sys-tag">{t}</span>)}</div><span className="sys-tog">{openSys===i?"Скрий ↑":"Виж детайли ⌄"}</span><div className={`sys-det ${openSys===i?"o":""}`}><ul>{s.details.map((d,j)=><li key={j}>{d}</li>)}</ul></div></div>)}</div></section>
    <section className="sec dk2" style={{textAlign:"center"}}><div {...ff("jrtg")} className="tg">Пътят на клиента</div><h2 {...ff("jrh2",.1)} className="U">PROFITBRAND <em>ONBOARDING</em></h2><p {...ff("jrsd",.15)} className="sdesc">Знаете какво следва — от първия разговор до съвместна работа.</p>
      <div className="jrn" {...ff("jrg",.2)}><div className="jrn-line"/><div className="jrn-steps">{journeySteps.map((j,i)=><div key={i} className="jrn-step"><div className={`jrn-circle ${i===0?"start":""}`}>{i===0?"Вие сте\nтук":i}</div><h5>{j.title}</h5><p>{j.desc}</p></div>)}</div></div></section>
    <section className="sec" style={{textAlign:"center"}}><div {...ff("cstg")} className="tg">Доказателства</div><h2 {...ff("csh2",.1)} className="U">Числата говорят <em>сами</em>.</h2>
      <div className="cases" style={{marginTop:32}} {...ff("csg",.2)}>{cases.map(c=><div key={c.id} className="case"><span className="case-tag">{c.client}</span><div className="case-lb">ПРОБЛЕМ</div><p>{c.problem}</p><div className="case-lb">РЕЗУЛТАТ</div><p>{c.result}</p><div className="case-metrics"><div className="case-m"><div className="n">{c.metric}</div><div className="l">Резултат</div></div><div className="case-m"><div className="n">{c.time}</div><div className="l">Време</div></div></div></div>)}</div></section>
    {team.length>0&&<section className="sec dk" style={{textAlign:"center"}}><div {...ff("thtg")} className="tg">Кои сме ние</div><h2 {...ff("thh2",.1)} className="U">Хората зад <em>системата</em>.</h2><div className="tm-grid" style={{marginTop:28}} {...ff("thg",.2)}>{team.map(m=><div key={m.id} className="tm"><h4>{m.name}</h4><span className="rl">{m.role}</span><p>{m.bio}</p></div>)}</div></section>}
    <section className="sec" style={{textAlign:"center"}}><div {...ff("grtg")} className="tg">Гаранция</div><h2 {...ff("grh2",.1)} className="U">Поемаме <em>риска</em>.</h2><div className="guar" style={{marginTop:28}} {...ff("grg",.2)}><h3 className="U">Тройна <em>Гаранция</em></h3><ul><li><span className="gc">✓</span>30 leads за 30 дни или работим безплатно.</li><li><span className="gc">✓</span>Без дългосрочни договори.</li><li><span className="gc">✓</span>Пълна прозрачност в реално време.</li></ul></div></section>
    <section className="sec dk" style={{textAlign:"center"}}><div {...ff("fqtg")} className="tg">Въпроси</div><h2 {...ff("fqh2",.1)} className="U">Знаем какво <em>си мислите</em>.</h2><div className="faq" style={{marginTop:28,textAlign:"left"}} {...ff("fqg",.2)}>{faqs.map((q,i)=><div key={i} className="faq-i"><div className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>{q.q}<span className={`a ${openFaq===i?"o":""}`}>+</span></div><div className={`faq-a ${openFaq===i?"o":""}`}>{q.a}</div></div>)}</div></section>
    <section className="sec" style={{textAlign:"center"}}><div {...ff("cftg")} className="tg">Контакт</div><h2 {...ff("cfh2",.1)} className="U">Готови? <em>Пишете ни.</em></h2><div style={{maxWidth:440,margin:"28px auto 0",textAlign:"left"}} {...ff("cfg",.2)}><div className="fg"><label>Име</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Вашето име"/></div><div className="fg"><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com"/></div><div className="fg"><label>Телефон</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+359 ..."/></div><div className="fg"><label>Съобщение</label><textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="Разкажете за бизнеса и целите ви..."/></div><button className="btn" style={{width:"100%"}} onClick={()=>alert("Благодарим!")}>Изпращане →</button></div></section>
    <section className="cta sec dk"><h2 {...ff("cth2")} className="U" style={{maxWidth:560,margin:"0 auto 14px"}}>Работим с <em>12 бизнеса годишно</em>.</h2><p {...ff("ctp",.1)} style={{color:"var(--g2)",maxWidth:420,margin:"0 auto 24px",fontSize:14,lineHeight:1.7}}>Заявете безплатна консултация.</p><button {...ff("ctb",.2)} className="btn" onClick={()=>setShowAudit(true)}>Безплатна Консултация →</button></section>
  </>);

  const AdminPage=()=>{
    if(!isAdmin)return<div className="adm" style={{textAlign:"center",paddingTop:180}}><h2>ADMIN ПАНЕЛ</h2><p style={{color:"var(--g2)",marginBottom:14}}>Въведете парола</p><input className="ai" type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&adminPass==="profit2025"&&setIsAdmin(true)} placeholder="Парола"/><button className="btn btnSm" onClick={()=>adminPass==="profit2025"&&setIsAdmin(true)}>ВХОД</button></div>;
    return<div className="adm">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:6}}><h2 style={{margin:0}}>ADMIN ПАНЕЛ</h2><button className="btn2 btnSm" onClick={()=>{setIsAdmin(false);setAdminPass("")}}>ИЗХОД</button></div>
      <div className="adm-tabs">{[{k:"clients",l:"🏢 Клиенти"},{k:"team",l:"👥 Екип"},{k:"services",l:"⚡ Услуги"},{k:"cases",l:"📊 Case Studies"}].map(t=><div key={t.k} className={`adm-tab ${adminTab===t.k?"act":""}`} onClick={()=>setAdminTab(t.k)}>{t.l}</div>)}</div>
      {adminTab==="clients"&&<div><h3>Добави клиент (движеща се лента)</h3><div style={{display:"flex",flexWrap:"wrap",gap:5}}><input className="ai" value={nc.name} onChange={e=>setNc({...nc,name:e.target.value})} placeholder="Име"/><input className="ai" value={nc.logo} onChange={e=>setNc({...nc,logo:e.target.value})} placeholder="URL лого (опц.)"/><button className="btn btnSm" onClick={()=>{if(!nc.name)return;const u=[...clients,{...nc,id:Date.now()}];setClients(u);save(u,team,services,cases);setNc({name:"",logo:""})}}>+</button></div><div className="al">{clients.map(c=><div key={c.id} className="ae">{c.name}<button className="btnD" onClick={()=>{const u=clients.filter(x=>x.id!==c.id);setClients(u);save(u,team,services,cases)}}>×</button></div>)}</div></div>}
      {adminTab==="team"&&<div><h3>Добави член на екипа</h3><div style={{display:"flex",flexWrap:"wrap",gap:5}}><input className="ai" value={nm.name} onChange={e=>setNm({...nm,name:e.target.value})} placeholder="Име"/><input className="ai" value={nm.role} onChange={e=>setNm({...nm,role:e.target.value})} placeholder="Позиция"/><input className="ai" style={{minWidth:220}} value={nm.bio} onChange={e=>setNm({...nm,bio:e.target.value})} placeholder="Описание"/><button className="btn btnSm" onClick={()=>{if(!nm.name)return;const u=[...team,{...nm,id:Date.now()}];setTeam(u);save(clients,u,services,cases);setNm({name:"",role:"",bio:""})}}>+</button></div><div className="al">{team.map(m=><div key={m.id} className="ae"><div><strong>{m.name}</strong> — <span style={{color:"var(--y)"}}>{m.role}</span><br/><span style={{color:"var(--g)",fontSize:10}}>{m.bio}</span></div><button className="btnD" onClick={()=>{const u=team.filter(x=>x.id!==m.id);setTeam(u);save(clients,u,services,cases)}}>×</button></div>)}</div></div>}
      {adminTab==="services"&&<div><h3>Добави услуга</h3><div style={{display:"flex",flexWrap:"wrap",gap:5}}><input className="ai" style={{maxWidth:70}} value={ns.icon} onChange={e=>setNs({...ns,icon:e.target.value})} placeholder="Emoji"/><input className="ai" value={ns.title} onChange={e=>setNs({...ns,title:e.target.value})} placeholder="Заглавие"/><input className="ai" style={{minWidth:220}} value={ns.desc} onChange={e=>setNs({...ns,desc:e.target.value})} placeholder="Описание"/><button className="btn btnSm" onClick={()=>{if(!ns.title)return;const u=[...services,{...ns,id:Date.now(),active:true}];setServices(u);save(clients,team,u,cases);setNs({icon:"",title:"",desc:""})}}>+</button></div><h3>Управление (клик = вкл/изкл)</h3><div className="al">{services.map(s=><div key={s.id} className="ae" style={{opacity:s.active?1:.4,cursor:"pointer"}} onClick={()=>{const u=services.map(x=>x.id===s.id?{...x,active:!x.active}:x);setServices(u);save(clients,team,u,cases)}}><span>{s.icon} {s.title}</span><span style={{color:s.active?"#0f0":"#f44",fontSize:9,fontWeight:700}}>{s.active?"ON":"OFF"}</span><button className="btnD" onClick={e=>{e.stopPropagation();const u=services.filter(x=>x.id!==s.id);setServices(u);save(clients,team,u,cases)}}>×</button></div>)}</div></div>}
      {adminTab==="cases"&&<div><h3>Добави Case Study</h3><div style={{display:"flex",flexWrap:"wrap",gap:5}}><input className="ai" value={ncase.client} onChange={e=>setNcase({...ncase,client:e.target.value})} placeholder="Клиент"/><input className="ai" style={{minWidth:200}} value={ncase.problem} onChange={e=>setNcase({...ncase,problem:e.target.value})} placeholder="Проблем"/><input className="ai" style={{minWidth:200}} value={ncase.result} onChange={e=>setNcase({...ncase,result:e.target.value})} placeholder="Резултат"/><input className="ai" style={{maxWidth:100}} value={ncase.metric} onChange={e=>setNcase({...ncase,metric:e.target.value})} placeholder="Метрика"/><input className="ai" style={{maxWidth:80}} value={ncase.time} onChange={e=>setNcase({...ncase,time:e.target.value})} placeholder="Време"/><button className="btn btnSm" onClick={()=>{if(!ncase.client)return;const u=[...cases,{...ncase,id:Date.now()}];setCases(u);save(clients,team,services,u);setNcase({client:"",problem:"",result:"",metric:"",time:""})}}>+</button></div><div className="al">{cases.map(c=><div key={c.id} className="ae"><div><strong style={{color:"var(--y)"}}>{c.client}</strong> — {c.metric}</div><button className="btnD" onClick={()=>{const u=cases.filter(x=>x.id!==c.id);setCases(u);save(clients,team,services,u)}}>×</button></div>)}</div></div>}
    </div>;
  };

  return<div className="Z"><style>{css}</style>
    <nav className="N"><div className="NL U" onClick={()=>nav("home")}>PROFITBRAND</div><div className="NR"><a onClick={()=>nav("home")}>Начало</a><a onClick={()=>nav("admin")} style={{opacity:.3,fontSize:9}}>•</a><button className="btn btnSm" onClick={()=>setShowAudit(true)}>Безплатна Консултация</button></div><button className="mob" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?"✕":"☰"}</button></nav>
    <div className={`mm ${menuOpen?"o":""}`}><a onClick={()=>nav("home")}>Начало</a><a onClick={()=>nav("admin")}>Admin</a><button className="btn" onClick={()=>{setMenuOpen(false);setShowAudit(true)}}>Консултация</button></div>
    {page==="home"&&<Home/>}{page==="admin"&&<AdminPage/>}
    <footer className="ft"><div className="cp">© 2025 PROFITBRAND. Всички права запазени.</div><div className="lk"><a onClick={()=>nav("home")}>Начало</a></div></footer>
    {showAudit&&<div className="mo" onClick={e=>e.target.className.includes("mo ")&&setShowAudit(false)}><div className="mo-box"><button className="mo-x" onClick={()=>setShowAudit(false)}>✕</button><h3 className="U" style={{fontSize:16,marginBottom:4}}>Безплатна Консултация</h3><p style={{color:"var(--g2)",fontSize:12,marginBottom:18,lineHeight:1.6}}>Ще покажем къде можете да растете. Без ангажимент.</p><div className="fg"><label>Име</label><input value={audit.name} onChange={e=>setAudit({...audit,name:e.target.value})} placeholder="Вашето име"/></div><div className="fg"><label>Email</label><input value={audit.email} onChange={e=>setAudit({...audit,email:e.target.value})} placeholder="email@example.com"/></div><div className="fg"><label>Уебсайт</label><input value={audit.web} onChange={e=>setAudit({...audit,web:e.target.value})} placeholder="yoursite.com"/></div><button className="btn" style={{width:"100%"}} onClick={()=>{alert("Заявката е изпратена!");setShowAudit(false)}}>Искам Консултация →</button></div></div>}
  </div>;
}
