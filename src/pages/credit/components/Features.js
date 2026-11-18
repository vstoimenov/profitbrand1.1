import { Sparkles, Calculator as CalcIcon, UserRound, FolderOpen, LayoutDashboard, Handshake } from "lucide-react";
import AssistantChat from "./AssistantChat";
import Reveal from "./Reveal";

const FEATURES = [
  [Sparkles, "AI квалифициране", "Асистентът задава правилните въпроси и прави предварителна оценка на профила."],
  [CalcIcon, "Кредитен калкулатор", "Вноска, лихви и общо плащане за ипотечни, потребителски и бизнес кредити."],
  [UserRound, "Дигитален профил", "Един профил за всички банки, без да попълваш едно и също по няколко пъти."],
  [FolderOpen, "Документи на едно място", "Чеклист какво трябва и сигурно място, където да го качиш."],
  [LayoutDashboard, "CRM и статус в реално време", "Консултантът и клиентът виждат един и същ статус на заявката."],
  [Handshake, "Партньорска мрежа", "Заявката отива само до банките, които реално отговарят на профила."],
];

/* Port of the template's FeaturesPlanet: dark band, planet visual, 3×2 hairline grid.
   The assistant chat sits next to the planet so it can be tried right here. */
export default function Features({ onSend }) {
  return (
    <section id="asistent" className="relative isolate scroll-mt-20 bg-credit-ink">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <h2 className="text-balance font-cr-head text-3xl font-bold text-white md:text-4xl">
              AI асистент, който пита като банков експерт
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Задава правилните въпроси, оценява шанса за одобрение и подготвя досието за консултанта. Решението остава при банката.
            </p>
          </div>

          <div className="grid items-center gap-10 pb-16 md:pb-20 lg:grid-cols-2">
            <Reveal className="min-w-0">
              <AssistantChat onSend={onSend} />
            </Reveal>
            <div className="hidden justify-center lg:flex" aria-hidden="true">
              <div className="relative inline-flex rounded-full before:absolute before:inset-0 before:-z-10 before:scale-[.85] before:rounded-full before:bg-gradient-to-b before:from-credit-pine2 before:to-credit-mint/40 before:blur-3xl motion-safe:before:animate-[pulse_4s_cubic-bezier(.4,0,.6,1)_infinite]">
                <img className="rounded-full bg-credit-ink [filter:grayscale(1)_brightness(1.5)]" src="/credit/planet.png" width={400} height={400} alt="" />
                <div className="absolute inset-0 rounded-full bg-credit-mint mix-blend-color" />
                <div className="absolute -left-16 top-16 z-10 rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur motion-safe:animate-[float_4s_ease-in-out_infinite_both]">Профилът е готов на 78%</div>
                <div className="absolute -right-10 bottom-24 z-10 rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur motion-safe:animate-[float_4s_ease-in-out_1.5s_infinite_both]">Подходящ за 9 банки</div>
              </div>
            </div>
          </div>

          <div className="grid overflow-hidden border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([Icon, title, text]) => (
              <article key={title} className="border-b border-white/10 p-6 sm:[&:nth-child(odd)]:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0 md:p-10">
                <h3 className="mb-2 flex items-center gap-2 font-medium text-white">
                  <Icon size={18} className="text-credit-mint" aria-hidden="true" />
                  <span>{title}</span>
                </h3>
                <p className="text-[15px] text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
