import Reveal from "./Reveal";

const STEPS = [
  ["Разкажи целта си", "Чат с асистента или калкулатор. Две минути, без документи."],
  ["Подготви профила", "Доходи и документи на едно място. Асистентът казва какво липсва."],
  ["Сравни предложенията", "Консултант подава към подходящите банки. Следиш статуса онлайн."],
];

export default function Steps() {
  return (
    <section id="kak" className="scroll-mt-24 border-y border-credit-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 md:py-14">
        {STEPS.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.08} className="flex gap-4">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-credit-mint font-cr-head font-bold text-credit-pine">{i + 1}</span>
            <div>
              <h3 className="mb-1 font-cr-head text-lg font-semibold text-credit-ink">{title}</h3>
              <p className="text-sm text-credit-soft">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
