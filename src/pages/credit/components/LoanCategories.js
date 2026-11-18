import { useState } from "react";
import { BrandMark } from "./Logo";

const TABS = [
  ["Ипотечни", "Покупка на жилище, строителство или ваканционен имот. Срок до 35 години, обезпечение с имота."],
  ["Потребителски", "Ремонт, обзавеждане или кола. Без обезпечение, решение обикновено до няколко дни."],
  ["Бизнес", "Оборотни средства, инвестиции и техника за фирми. Подготвяме досието за банката заедно с теб."],
  ["Рефинансиране", "Прехвърляне на съществуващ кредит при по-добри условия. Сравняваме общата цена, не само лихвата."],
];

/* Orbit positions from the template (px offsets from the center). */
const ORBIT = [
  ["ДСК", -136, 0, "h-16 w-16", "3s"],
  ["UniCredit", 136, 0, "h-16 w-16", "3.5s"],
  ["ОББ", -216, -82, "h-20 w-20", "3.5s"],
  ["Пощенска", 216, -82, "h-20 w-20", "1.5s"],
  ["Fibank", 216, 82, "h-20 w-20", "2s"],
  ["ЦКБ", -216, 82, "h-20 w-20", "2.5s"],
  ["ПроКредит", -292, 0, "h-12 w-12 opacity-50", "2s"],
  ["tbi bank", 292, 0, "h-12 w-12 opacity-50", "4s"],
];

/* Port of the template's BusinessCategories: tabs + logo orbit (banks as text badges). */
export default function LoanCategories() {
  const [tab, setTab] = useState(0);
  return (
    <section id="krediti" className="scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl pb-10 text-center">
          <h2 className="font-cr-head text-3xl font-bold text-credit-ink md:text-4xl">Един профил за всички банки</h2>
          <p className="mt-3 text-lg text-credit-soft">Попълваш веднъж. Ние намираме кои банки отговарят на профила ти.</p>
        </div>

        <div id="banki" className="relative flex h-[324px] scroll-mt-28 items-center justify-center">
          <div className="absolute -z-10 h-[300px] w-[300px] rounded-full border border-credit-line sm:h-[420px] sm:w-[420px]" aria-hidden="true" />
          <div className="absolute -z-10 h-[180px] w-[180px] rounded-full border border-credit-line/70" aria-hidden="true" />
          <div className="relative flex scale-[0.62] items-center justify-center sm:scale-90 md:scale-100">
            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-white shadow-xl shadow-credit-pine/10 ring-1 ring-credit-line">
              <BrandMark className="h-10 w-10" />
            </div>
            {ORBIT.map(([name, x, y, size, d]) => (
              <div key={name} className="absolute" style={{ transform: `translate(${x}px, ${y}px)` }}>
                <div className="motion-safe:animate-[breath_6s_ease-in-out_infinite_both]" style={{ animationDelay: d }}>
                  <div className={`grid place-items-center rounded-full bg-white px-1 text-center text-[11px] font-semibold leading-tight text-credit-pine shadow-lg shadow-black/[0.04] ring-1 ring-credit-line ${size}`}>
                    {name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mb-10 text-center text-xs text-credit-soft">Банките са изброени информативно.</p>

        <div className="mx-auto max-w-3xl">
          <div role="tablist" aria-label="Видове кредити" className="flex flex-wrap justify-center gap-2">
            {TABS.map(([label], i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === i ? "bg-credit-pine text-white" : "bg-white text-credit-soft ring-1 ring-credit-line hover:text-credit-pine"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p role="tabpanel" className="mt-5 text-center text-credit-soft">{TABS[tab][1]}</p>
        </div>
      </div>
    </section>
  );
}
